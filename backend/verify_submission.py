
import os
import requests

BASE = "http://127.0.0.1:8081"

def login(email_var, password_var, portal):
    r = requests.post(
        f"{BASE}/api/v1/auth/login",
        json={
            "email": os.environ[email_var],
            "password": os.environ[password_var],
            "portal": portal,
        },
        timeout=15,
    )
    print(f"{portal} login:", r.status_code)
    r.raise_for_status()
    token = r.json()["data"]["access_token"]
    return {"Authorization": f"Bearer {token}"}

try:
    faculty = login(
        "UNISPHERE_FACULTY_EMAIL",
        "UNISPHERE_FACULTY_PASSWORD",
        "faculty",
    )
    student = login(
        "UNISPHERE_STUDENT_EMAIL",
        "UNISPHERE_STUDENT_PASSWORD",
        "student",
    )

    assignment_id = 1

    # Submit assignment as the student
    print("\nSubmitting assignment ID:", assignment_id)
    r = requests.post(
        f"{BASE}/api/v1/student/assignments/{assignment_id}/submit",
        headers=student,
        json={"content": "PPS workflow verification submission."},
        timeout=15,
    )
    print("Submit status:", r.status_code)
    print(r.text)

    if not r.ok:
        raise RuntimeError("Submission failed; stopping before evaluation.")

    result = r.json()
    data = result.get("data") or {}
    submission_id = data.get("submission_id", data.get("id"))

    if submission_id is None:
        print("\nSubmission response has no obvious ID.")
        print("Check faculty submissions endpoint before evaluating.")
        raise SystemExit(0)

    # Evaluate submission as faculty
    print("\nEvaluating submission ID:", submission_id)
    r = requests.post(
        f"{BASE}/api/v1/faculty/assignments/{assignment_id}/evaluate",
        params={"submission_id": submission_id},
        headers=faculty,
        json={"score": 8, "feedback": "Workflow test completed."},
        timeout=15,
    )
    print("Evaluation status:", r.status_code)
    print(r.text)

    # Verify student can see updated assignment
    print("\nChecking student assignment result...")
    r = requests.get(
        f"{BASE}/api/v1/student/assignments",
        headers=student,
        timeout=15,
    )
    print("Assignment list status:", r.status_code)
    print(r.text)

except (requests.RequestException, KeyError, RuntimeError) as e:
    print("Workflow test stopped:", e)
