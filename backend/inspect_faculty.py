
import os
import json
import requests

BASE = "http://127.0.0.1:8081"

email = os.getenv("UNISPHERE_FACULTY_EMAIL")
password = os.getenv("UNISPHERE_FACULTY_PASSWORD")

if not email or not password:
    print("Faculty credentials missing in this PowerShell session.")
    raise SystemExit(1)

r = requests.post(
    f"{BASE}/api/v1/auth/login",
    json={
        "email": email,
        "password": password,
        "portal": "faculty"
    },
    timeout=15
)

print("Faculty login:", r.status_code)

if not r.ok:
    print("Faculty login failed.")
    raise SystemExit(1)

data = r.json().get("data") or {}
token = data.get("access_token")

if not token:
    print("Access token not found.")
    raise SystemExit(1)

headers = {"Authorization": f"Bearer {token}"}

for path in [
    "/api/v1/faculty/classes",
    "/api/v1/faculty/students",
    "/api/v1/faculty/assignments"
]:
    try:
        res = requests.get(BASE + path, headers=headers, timeout=15)
        print(f"\n--- {path} | HTTP {res.status_code} ---")
        try:
            print(json.dumps(res.json(), indent=2)[:4000])
        except ValueError:
            print(res.text[:1000])
    except requests.RequestException as exc:
        print("Request failed:", str(exc))
