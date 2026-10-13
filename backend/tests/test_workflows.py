from datetime import date, datetime, timedelta, timezone

from app.models import (
    Assignment,
    ClassSection,
    Course,
    Enrollment,
    FacultyAssignment,
    FacultyProfile,
    Semester,
    StudentProfile,
    Subject,
    University,
    User,
    UserRole,
)
from app.security import hash_password
from app.services.academic import compute_cgpa, percentage_to_grade


def test_grade_mapping():
    assert percentage_to_grade(91) == (10.0, "O")
    assert percentage_to_grade(45) == (5.0, "C")
    points, letter = percentage_to_grade(39)
    assert points == 0.0 and letter == "F"


def test_cgpa_excludes_subjects_without_marks():
    perf = [
        {"credits": 4, "grade_point": 9, "average_percentage": 82},
        {"credits": 3, "grade_point": None, "average_percentage": None},
    ]
    result = compute_cgpa(perf)
    assert result["cgpa"] == 9.0
    assert result["subjects_included"] == 1
    assert "assumptions" in result


def _setup_class(db):
    uni = University(name="U", code="U")
    db.add(uni)
    db.flush()
    course = Course(university_id=uni.id, name="CSE", code="CSE")
    db.add(course)
    db.flush()
    sem = Semester(course_id=course.id, number=1, name="S1")
    db.add(sem)
    db.flush()
    section = ClassSection(semester_id=sem.id, name="A")
    db.add(section)
    db.flush()
    subject = Subject(semester_id=sem.id, code="CS1", name="Algo", credits=4)
    db.add(subject)
    db.flush()
    fu = User(email="f@example.com", hashed_password=hash_password("password123"), role=UserRole.faculty, is_active=True)
    su = User(email="s@example.com", hashed_password=hash_password("password123"), role=UserRole.student, is_active=True)
    db.add_all([fu, su])
    db.flush()
    fac = FacultyProfile(user_id=fu.id, employee_id="F1", full_name="Fac")
    stu = StudentProfile(user_id=su.id, student_id="ST1", full_name="Stu")
    db.add_all([fac, stu])
    db.flush()
    db.add(FacultyAssignment(faculty_id=fac.id, subject_id=subject.id, section_id=section.id))
    db.add(Enrollment(student_id=stu.id, subject_id=subject.id, section_id=section.id))
    db.commit()
    return fac, stu, subject, section


def test_faculty_attendance_and_unauthorized_class(client, db_session):
    fac, stu, subject, section = _setup_class(db_session)
    login = client.post(
        "/api/v1/auth/login",
        json={"email": "f@example.com", "password": "password123", "portal": "faculty"},
    )
    token = login.json()["data"]["access_token"]
    ok = client.post(
        "/api/v1/faculty/attendance",
        headers={"Authorization": f"Bearer {token}"},
        json={
            "subject_id": subject.id,
            "section_id": section.id,
            "session_date": date.today().isoformat(),
            "records": [{"student_id": stu.id, "status": "present"}],
        },
    )
    assert ok.status_code == 200
    forbidden = client.post(
        "/api/v1/faculty/attendance",
        headers={"Authorization": f"Bearer {token}"},
        json={
            "subject_id": 999,
            "section_id": 999,
            "session_date": date.today().isoformat(),
            "records": [{"student_id": stu.id, "status": "present"}],
        },
    )
    assert forbidden.status_code == 403


def test_assignment_submit_and_evaluate(client, db_session):
    fac, stu, subject, section = _setup_class(db_session)
    due = (datetime.now(timezone.utc) + timedelta(days=2)).isoformat()
    ftok = client.post(
        "/api/v1/auth/login",
        json={"email": "f@example.com", "password": "password123", "portal": "faculty"},
    ).json()["data"]["access_token"]
    created = client.post(
        "/api/v1/faculty/assignments",
        headers={"Authorization": f"Bearer {ftok}"},
        json={
            "subject_id": subject.id,
            "section_id": section.id,
            "title": "HW1",
            "due_at": due,
            "max_marks": 10,
        },
    )
    assert created.status_code == 201
    aid = created.json()["data"]["id"]
    stok = client.post(
        "/api/v1/auth/login",
        json={"email": "s@example.com", "password": "password123", "portal": "student"},
    ).json()["data"]["access_token"]
    sub = client.post(
        f"/api/v1/student/assignments/{aid}/submit",
        headers={"Authorization": f"Bearer {stok}"},
        json={"content": "my work"},
    )
    assert sub.status_code == 200
    from app.db import SessionLocal
    from app.models import Submission as SubmissionModel

    s = SessionLocal()
    submission = s.query(SubmissionModel).filter(SubmissionModel.assignment_id == aid).one()
    s.close()
    ev = client.post(
        f"/api/v1/faculty/assignments/{aid}/evaluate",
        params={"submission_id": submission.id},
        headers={"Authorization": f"Bearer {ftok}"},
        json={"score": 8, "feedback": "good"},
    )
    assert ev.status_code == 200
    over = client.post(
        f"/api/v1/faculty/assignments/{aid}/evaluate",
        params={"submission_id": submission.id},
        headers={"Authorization": f"Bearer {ftok}"},
        json={"score": 99, "feedback": "nope"},
    )
    assert over.status_code == 422


def test_coach_rule_based(client):
    r = client.post(
        "/api/v1/auth/register",
        json={
            "email": "coach@example.com",
            "password": "password123",
            "full_name": "Coach Student",
            "student_id": "C1",
        },
    )
    token = r.json()["data"]["tokens"]["access_token"]
    msg = client.post(
        "/api/v1/student/coach/messages",
        headers={"Authorization": f"Bearer {token}"},
        json={"message": "Help me raise my CGPA"},
    )
    assert msg.status_code == 200
    data = msg.json()["data"]
    assert data["provider"] == "rule_based"
    assert data["ai_provider_configured"] is False
    assert "rule-based" in data["reply"].lower() or "CGPA" in data["reply"]
