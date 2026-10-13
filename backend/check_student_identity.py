
import os
import requests

BASE = "http://127.0.0.1:8081"

r = requests.post(
    f"{BASE}/api/v1/auth/login",
    json={
        "email": os.environ["UNISPHERE_STUDENT_EMAIL"],
        "password": os.environ["UNISPHERE_STUDENT_PASSWORD"],
        "portal": "student",
    },
    timeout=15,
)

print("Login:", r.status_code)
r.raise_for_status()
token = r.json()["data"]["access_token"]

r = requests.get(
    f"{BASE}/api/v1/auth/me",
    headers={"Authorization": f"Bearer {token}"},
    timeout=15,
)

print("Identity:", r.status_code)
print(r.text)

