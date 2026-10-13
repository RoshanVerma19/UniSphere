"""Optional demo data. Does not overwrite existing users."""

from datetime import date, datetime, timedelta, timezone

from app.db import Base, SessionLocal, engine
from app.models import (
    Campus,
    ClassSection,
    Course,
    Department,
    Enrollment,
    Exam,
    FacultyAssignment,
    FacultyProfile,
    Mark,
    Semester,
    StudentProfile,
    Subject,
    TimetableEntry,
    University,
    User,
    UserRole,
)
from app.models.academic import AttendanceRecord, AttendanceStatus
from app.security import hash_password


def seed() -> None:
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        existing_faculty = db.query(User).filter(
            User.email == "faculty@unisphere.local"
        ).one_or_none()
        if existing_faculty:
            existing_faculty.hashed_password = hash_password("FacultyPass123")
            existing_faculty.role = UserRole.faculty
            existing_faculty.is_active = True
            db.commit()
            print("Faculty demo password reset successfully.")
            return
        uni = University(name="UniSphere Demo University", code="USU")
        db.add(uni)
        db.flush()
        campus = Campus(university_id=uni.id, name="Main Campus", code="MAIN", city="Bengaluru")
        db.add(campus)
        db.flush()
        dept = Department(campus_id=campus.id, name="Computer Science", code="CSE")
        db.add(dept)
        db.flush()
        course = Course(university_id=uni.id, name="B.Tech Computer Science", code="BT-CSE", duration_years=4)
        db.add(course)
        db.flush()
        sem = Semester(
            course_id=course.id,
            number=3,
            name="Semester 3",
            start_date=date.today() - timedelta(days=60),
            end_date=date.today() + timedelta(days=60),
        )
        db.add(sem)
        db.flush()
        section = ClassSection(semester_id=sem.id, name="A")
        db.add(section)
        db.flush()
        subj_ds = Subject(semester_id=sem.id, code="CS301", name="Data Structures", credits=4)
        subj_db = Subject(semester_id=sem.id, code="CS302", name="Database Systems", credits=3)
        db.add_all([subj_ds, subj_db])
        db.flush()

        fu = User(
            email="faculty@unisphere.local",
            hashed_password=hash_password("FacultyPass123"),
            role=UserRole.faculty,
            is_active=True,
        )
        su = User(
            email="student@unisphere.local",
            hashed_password=hash_password("StudentPass123"),
            role=UserRole.student,
            is_active=True,
        )
        db.add_all([fu, su])
        db.flush()
        fac = FacultyProfile(
            user_id=fu.id,
            university_id=uni.id,
            campus_id=campus.id,
            department_id=dept.id,
            employee_id="FAC-1001",
            full_name="Dr. Asha Rao",
            designation="Assistant Professor",
        )
        stu = StudentProfile(
            user_id=su.id,
            university_id=uni.id,
            campus_id=campus.id,
            course_id=course.id,
            section_id=section.id,
            student_id="STU-2001",
            full_name="Rohan Mehta",
            program="B.Tech CSE",
            year_of_study=2,
        )
        db.add_all([fac, stu])
        db.flush()
        db.add_all(
            [
                FacultyAssignment(faculty_id=fac.id, subject_id=subj_ds.id, section_id=section.id),
                FacultyAssignment(faculty_id=fac.id, subject_id=subj_db.id, section_id=section.id),
                Enrollment(student_id=stu.id, subject_id=subj_ds.id, section_id=section.id),
                Enrollment(student_id=stu.id, subject_id=subj_db.id, section_id=section.id),
                TimetableEntry(
                    section_id=section.id,
                    subject_id=subj_ds.id,
                    faculty_id=fac.id,
                    day_of_week=0,
                    start_time="09:00",
                    end_time="10:00",
                    room="B-201",
                ),
            ]
        )
        exam = Exam(
            subject_id=subj_ds.id,
            section_id=section.id,
            created_by_faculty_id=fac.id,
            title="DS Midterm",
            exam_date=date.today() + timedelta(days=10),
            max_marks=50,
            venue="Hall 2",
        )
        db.add(exam)
        db.flush()
        db.add(Mark(student_id=stu.id, exam_id=exam.id, obtained=38, recorded_by_faculty_id=fac.id))
        today = date.today()
        for i, st in enumerate([AttendanceStatus.present, AttendanceStatus.present, AttendanceStatus.absent]):
            db.add(
                AttendanceRecord(
                    student_id=stu.id,
                    subject_id=subj_ds.id,
                    section_id=section.id,
                    marked_by_faculty_id=fac.id,
                    session_date=today - timedelta(days=i + 1),
                    status=st,
                )
            )
        db.commit()
        print("Seeded demo accounts:")
        print("  faculty@unisphere.local / FacultyPass123")
        print("  student@unisphere.local / StudentPass123")
    finally:
        db.close()


if __name__ == "__main__":
    seed()
