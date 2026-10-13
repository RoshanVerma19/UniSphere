
import os
import requests
from datetime import datetime, timedelta, timezone

BASE = "http://127.0.0.1:8081"

def login(email_var, password_var, portal):
    email = os.getenv(email_var)
    password = os.getenv(password_var)

    if not email or not password:
        raise RuntimeError(
            f"Missing environment variables: {email_var} / {password_var}"
        )

    r = requests.post(
        f"{BASE}/api/v1/auth/login",
        json={"email": email, "password": password, "portal": portal},
        timeout=15,
    )
    print(f"{portal.title()} login:", r.status_code)
    r.raise_for_status()

    token = (r.json().get("data") or {}).get("access_token")
    if not token:
        raise RuntimeError(f"{portal} access token missing")

    return {"Authorization": f"Bearer {token}"}

try:
    faculty_headers = login(
        "UNISPHERE_FACULTY_EMAIL",
        "UNISPHERE_FACULTY_PASSWORD",
        "faculty",
    )

    student_headers = login(
        "UNISPHERE_STUDENT_EMAIL",
        "UNISPHERE_STUDENT_PASSWORD",
        "student",
    )

    due_at = (
        datetime.now(timezone.utc) + timedelta(days=7)
    ).isoformat()

    payload = {
        "subject_id": 1,
        "section_id": 1,
        "title": "TEST - PPS Workflow Verification",
        "description": "Temporary test assignment for API workflow verification.",
        "due_at": due_at,
        "max_marks": 10,
    }

    print("\nCreating test assignment...")
    r = requests.post(
        f"{BASE}/api/v1/faculty/assignments",
        headers=faculty_headers,
        json=payload,
        timeout=15,
    )
    print("Create assignment:", r.status_code)

    try:
        result = r.json()
    except ValueError:
        print("Response was not JSON.")
        raise SystemExit(1)

    print("Success:", result.get("success"))
    data = result.get("data")

    if not r.ok or not isinstance(data, dict):
        print("Assignment was not created. Response:", result)
        raise SystemExit(1)

    assignment_id = data.get("assignment_id", data.get("id"))
    print("Returned assignment fields:", list(data.keys()))

    if assignment_id is None:
        print("Could not identify assignment ID; stopping before submission.")
        raise SystemExit(1)

    print("Test assignment ID:", assignment_id)

    print("\nChecking student assignment list...")
    r = requests.get(
        f"{BASE}/api/v1/student/assignments",
        headers=student_headers,
        timeout=15,
    )
    print("Student assignments:", r.status_code)

    if r.ok:
        result = r.json()
        items = result.get("data")
        if isinstance(items, list):
            matches = [
                item for item in items
                if isinstance(item, dict)
                and item.get("assignment_id", item.get("id")) == assignment_id
            ]
            print("Test assignment visible to student:", bool(matches))
            if matches:
                print("Visible assignment fields:", list(matches[0].keys()))
        else:
            print("Unexpected response shape; inspect response locally.")
    else:
        print("Student assignment list request failed.")

    print(
        "\nAssignment created. Submission and evaluation have NOT been performed yet."
    )

except (requests.RequestException, RuntimeError, ValueError) as exc:
    print("Workflow setup failed:", str(exc))
