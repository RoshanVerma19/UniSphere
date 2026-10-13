"""
UniSphere automated backend diagnostic.
Run from the project root with:
    .\.venv\Scripts\python.exe check_backend.py
Optional:
    $env:UNISPHERE_BASE_URL="http://127.0.0.1:8080"
This script never prints secret values and does not send email or upload files.
"""
import importlib.util
import json
import os
import subprocess
import sys
import urllib.error
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent
BASE_URL = os.getenv("UNISPHERE_BASE_URL", "http://127.0.0.1:8080").rstrip("/")
results = []

def report(name, ok, detail=""):
    status = "PASS" if ok else "FAIL"
    results.append((name, ok, detail))
    print(f"[{status}] {name}" + (f" — {detail}" if detail else ""))

def get_url(url, timeout=5):
    req = urllib.request.Request(url, headers={"User-Agent": "UniSphere-Diagnostic/1.0"})
    with urllib.request.urlopen(req, timeout=timeout) as response:
        return response.status, response.read()

print("=" * 62)
print(" UniSphere Backend Automatic Diagnostic")
print(f" Project: {ROOT}")
print(f" API:     {BASE_URL}")
print("=" * 62)

# Load .env without displaying values.
try:
    from dotenv import load_dotenv
    load_dotenv(ROOT / ".env", override=False)
    report(".env file", (ROOT / ".env").is_file(), "loaded locally; secret values are hidden")
except Exception as exc:
    report(".env loader", False, str(exc))

# Server and OpenAPI checks.
try:
    code, body = get_url(f"{BASE_URL}/openapi.json")
    schema = json.loads(body)
    paths = schema.get("paths", {})
    report("API reachable", code == 200, f"HTTP {code}")
    report("OpenAPI schema", bool(paths), f"{len(paths)} route paths discovered")
    for path in sorted(paths):
        methods = ",".join(sorted(m.upper() for m in paths[path] if m.lower() in {
            "get", "post", "put", "patch", "delete", "options"
        }))
        print(f"    {methods:20} {path}")
except urllib.error.HTTPError as exc:
    report("API reachable / OpenAPI", False, f"HTTP {exc.code}")
except Exception as exc:
    report("API reachable / OpenAPI", False, f"{type(exc).__name__}: {exc}")

# Required project files.
for relative in ("app/main.py", "app/config.py", "requirements.txt", "tests"):
    p = ROOT / relative
    report(f"Project file: {relative}", p.exists(), "found" if p.exists() else "missing")

# Compile check.
try:
    proc = subprocess.run(
        [sys.executable, "-m", "compileall", "-q", "app"],
        cwd=ROOT, capture_output=True, text=True, timeout=60
    )
    report("Python compile check", proc.returncode == 0,
           "no syntax errors" if proc.returncode == 0 else (proc.stderr.strip() or proc.stdout.strip())[-500:])
except Exception as exc:
    report("Python compile check", False, str(exc))

# Automated tests.
if (ROOT / "tests").exists():
    try:
        proc = subprocess.run(
            [sys.executable, "-m", "pytest", "-q"],
            cwd=ROOT, capture_output=True, text=True, timeout=180
        )
        summary = (proc.stdout.strip() or proc.stderr.strip()).splitlines()
        summary = summary[-1] if summary else "No pytest summary"
        report("Pytest suite", proc.returncode == 0, summary)
    except Exception as exc:
        report("Pytest suite", False, str(exc))
else:
    report("Pytest suite", False, "tests/ folder not found")

# Environment variable presence only; never print values.
env_requirements = {
    "Gemini AI": ("GEMINI_API_KEY",),
    "Cloudinary": ("CLOUDINARY_URL",),
    "Resend email": ("RESEND_API_KEY",),
}
for service, keys in env_requirements.items():
    present = [k for k in keys if os.getenv(k)]
    report(f"{service} environment", len(present) == len(keys),
           "configured" if len(present) == len(keys) else f"missing: {', '.join(k for k in keys if k not in present)}")

# Check configured Firebase service-account file without printing contents.
firebase_path = os.getenv("FIREBASE_CREDENTIALS_PATH") or os.getenv("GOOGLE_APPLICATION_CREDENTIALS")
if not firebase_path:
    firebase_path = "secrets/firebase-service-account.json"
fp = Path(firebase_path)
if not fp.is_absolute():
    fp = ROOT / fp
try:
    if fp.is_file():
        with fp.open("r", encoding="utf-8") as f:
            creds = json.load(f)
        valid_shape = bool(creds.get("project_id") and creds.get("private_key") and creds.get("client_email"))
        report("Firebase service-account file", valid_shape, "JSON shape looks valid" if valid_shape else "JSON missing expected service-account fields")
    else:
        report("Firebase service-account file", False, "file not found at configured/default path")
except Exception as exc:
    report("Firebase service-account file", False, f"{type(exc).__name__}: {exc}")

# Package/import checks.
for package in ("cloudinary", "firebase_admin", "resend", "google.genai"):
    try:
        ok = importlib.util.find_spec(package) is not None
        report(f"Python package: {package}", ok, "installed" if ok else "not installed in this interpreter")
    except (ImportError, ModuleNotFoundError, ValueError):
        report(f"Python package: {package}", False, "not installed in this interpreter")

# Optional live Gemini smoke test. Makes one short API request if key/package exist.
if os.getenv("GEMINI_API_KEY") and importlib.util.find_spec("google.genai"):
    try:
        from google import genai
        client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))
        model = os.getenv("GEMINI_MODEL", "gemini-3.5-flash")
        response = client.models.generate_content(
            model=model,
            contents="Reply with exactly: UniSphere Gemini AI is working"
        )
        report("Gemini live API test", bool(getattr(response, "text", None)),
               "received a response" if getattr(response, "text", None) else "empty response")
    except Exception as exc:
        # Avoid dumping request headers, credentials, or full response objects.
        report("Gemini live API test", False, f"{type(exc).__name__}: {str(exc)[:220]}")
else:
    report("Gemini live API test", False, "skipped: key or google.genai package missing")

print("\n" + "=" * 62)
passed = sum(1 for _, ok, _ in results if ok)
failed = len(results) - passed
print(f"SUMMARY: {passed} PASS | {failed} FAIL | {len(results)} total checks")
if failed:
    print("Next: fix the FAIL items above; secret values were not printed.")
else:
    print("All checks passed.")
print("=" * 62)
sys.exit(1 if failed else 0)
