
import os
import json
import requests

BASE = "http://127.0.0.1:8081"

email = os.getenv("UNISPHERE_STUDENT_EMAIL")
password = os.getenv("UNISPHERE_STUDENT_PASSWORD")

if not email or not password:
    print("Student credentials missing. Set environment variables first.")
    raise SystemExit(1)

response = requests.post(
    f"{BASE}/api/v1/auth/login",
    json={
        "email": email,
        "password": password,
        "portal": "student"
    },
    timeout=15
)

print("Student login:", response.status_code)

if not response.ok:
    print("Login failed. Check credentials and portal.")
    raise SystemExit(1)

result = response.json()
data = result.get("data") or {}
token = data.get("access_token")

if not token:
    print("Access token missing from response data.")
    raise SystemExit(1)

headers = {"Authorization": f"Bearer {token}"}

for path in [
    "/api/v1/student/assignments",
    "/api/v1/student/notifications"
]:
    try:
        r = requests.get(BASE + path, headers=headers, timeout=15)
        print(f"\n--- {path} | HTTP {r.status_code} ---")

        try:
            print(json.dumps(r.json(), indent=2)[:6000])
        except ValueError:
            print(r.text[:2000])

    except requests.RequestException as exc:
        print("Request failed:", str(exc))

