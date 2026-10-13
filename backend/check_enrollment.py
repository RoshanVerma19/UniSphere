
from app.db import SessionLocal
from app.models import User, StudentProfile, Enrollment, Assignment

db = SessionLocal()

try:
    print("\n--- USERS ---")
    for u in db.query(User).all():
        print({
            "id": u.id,
            "email": u.email,
            "role": str(u.role),
        })

    print("\n--- STUDENT PROFILES ---")
    for s in db.query(StudentProfile).all():
        print({
            "id": s.id,
            "user_id": s.user_id,
            "student_id": s.student_id,
            "full_name": s.full_name,
        })

    print("\n--- ENROLLMENTS ---")
    for e in db.query(Enrollment).all():
        print({
            "student_id": e.student_id,
            "subject_id": e.subject_id,
            "section_id": e.section_id,
        })

    print("\n--- ASSIGNMENTS ---")
    for a in db.query(Assignment).all():
        print({
            "id": a.id,
            "title": a.title,
            "subject_id": a.subject_id,
            "section_id": a.section_id,
        })
finally:
    db.close()