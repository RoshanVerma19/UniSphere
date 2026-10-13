from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.db import get_db
from app.deps import get_faculty_profile
from app.models import (
    Announcement,
    Assignment,
    AttendanceRecord,
    Enrollment,
    Exam,
    FacultyAssignment,
    FacultyProfile,
    Mark,
    Notification,
    StudentProfile,
    Submission,
    Subject,
    TimetableEntry,
    User,
)
from app.models.academic import AttendanceStatus
from app.schemas import (
    AnnouncementIn,
    AssignmentCreateIn,
    AttendanceBulkIn,
    EvaluateIn,
    ExamCreateIn,
    MarkIn,
    ProfileUpdateIn,
    ok,
)
from app.services.access import authorized_student_ids, faculty_assignment, faculty_scope_ids
from app.services.academic import students_needing_support, subject_performance, compute_cgpa, attendance_summary
from app.services.notifications import notify

router = APIRouter(prefix="/api/v1/faculty", tags=["faculty"])


@router.get("/profile")
def profile(faculty: FacultyProfile = Depends(get_faculty_profile), db: Session = Depends(get_db)):
    user = db.get(User, faculty.user_id)
    return ok(
        {
            "id": faculty.id,
            "email": user.email if user else None,
            "employee_id": faculty.employee_id,
            "full_name": faculty.full_name,
            "designation": faculty.designation,
            "department_id": faculty.department_id,
            "university_id": faculty.university_id,
            "campus_id": faculty.campus_id,
            "phone": faculty.phone,
        }
    )


@router.patch("/profile")
def update_profile(
    body: ProfileUpdateIn,
    faculty: FacultyProfile = Depends(get_faculty_profile),
    db: Session = Depends(get_db),
):
    if body.full_name:
        faculty.full_name = body.full_name
    if body.phone is not None:
        faculty.phone = body.phone
    user = db.get(User, faculty.user_id)
    if body.timezone and user:
        user.timezone = body.timezone
    db.commit()
    return profile(faculty, db)


@router.get("/classes")
def classes(faculty: FacultyProfile = Depends(get_faculty_profile), db: Session = Depends(get_db)):
    rows = db.query(FacultyAssignment).filter(FacultyAssignment.faculty_id == faculty.id).all()
    items = []
    for r in rows:
        s = db.get(Subject, r.subject_id)
        items.append(
            {
                "assignment_id": r.id,
                "subject_id": r.subject_id,
                "section_id": r.section_id,
                "subject_code": s.code if s else None,
                "subject_name": s.name if s else None,
            }
        )
    return ok(items)


@router.get("/students")
def directory(
    faculty: FacultyProfile = Depends(get_faculty_profile),
    db: Session = Depends(get_db),
    subject_id: int | None = None,
    section_id: int | None = None,
):
    q = db.query(FacultyAssignment).filter(FacultyAssignment.faculty_id == faculty.id)
    if subject_id is not None:
        q = q.filter(FacultyAssignment.subject_id == subject_id)
    if section_id is not None:
        q = q.filter(FacultyAssignment.section_id == section_id)
    assignments = q.all()
    if subject_id or section_id:
        if not assignments:
            raise HTTPException(403, "Not assigned to this class/subject")
    seen: set[int] = set()
    out = []
    for a in assignments:
        enrolls = (
            db.query(Enrollment)
            .filter(Enrollment.subject_id == a.subject_id, Enrollment.section_id == a.section_id)
            .all()
        )
        for e in enrolls:
            if e.student_id in seen:
                continue
            seen.add(e.student_id)
            st = db.get(StudentProfile, e.student_id)
            if st:
                out.append(
                    {
                        "student_id": st.id,
                        "student_code": st.student_id,
                        "full_name": st.full_name,
                        "subject_id": a.subject_id,
                        "section_id": a.section_id,
                    }
                )
    return ok(out)


@router.get("/attendance")
def get_attendance(
    subject_id: int,
    section_id: int,
    faculty: FacultyProfile = Depends(get_faculty_profile),
    db: Session = Depends(get_db),
):
    faculty_assignment(db, faculty, subject_id, section_id)
    rows = (
        db.query(AttendanceRecord)
        .filter(AttendanceRecord.subject_id == subject_id, AttendanceRecord.section_id == section_id)
        .all()
    )
    return ok(
        [
            {
                "id": r.id,
                "student_id": r.student_id,
                "session_date": r.session_date.isoformat(),
                "status": r.status.value,
            }
            for r in rows
        ]
    )


@router.post("/attendance")
def upsert_attendance(
    body: AttendanceBulkIn,
    faculty: FacultyProfile = Depends(get_faculty_profile),
    db: Session = Depends(get_db),
):
    faculty_assignment(db, faculty, body.subject_id, body.section_id)
    allowed = {
        e.student_id
        for e in db.query(Enrollment)
        .filter(Enrollment.subject_id == body.subject_id, Enrollment.section_id == body.section_id)
        .all()
    }
    saved = []
    for rec in body.records:
        if rec.student_id not in allowed:
            raise HTTPException(403, f"Student {rec.student_id} is not in this class")
        try:
            status = AttendanceStatus(rec.status)
        except ValueError:
            raise HTTPException(422, "Invalid attendance status")
        existing = (
            db.query(AttendanceRecord)
            .filter(
                AttendanceRecord.student_id == rec.student_id,
                AttendanceRecord.subject_id == body.subject_id,
                AttendanceRecord.session_date == body.session_date,
            )
            .one_or_none()
        )
        if existing:
            existing.status = status
            existing.marked_by_faculty_id = faculty.id
            saved.append(existing.id)
        else:
            row = AttendanceRecord(
                student_id=rec.student_id,
                subject_id=body.subject_id,
                section_id=body.section_id,
                marked_by_faculty_id=faculty.id,
                session_date=body.session_date,
                status=status,
            )
            db.add(row)
            db.flush()
            saved.append(row.id)
    db.commit()
    return ok({"saved": saved})


@router.post("/assignments", status_code=201)
def create_assignment(
    body: AssignmentCreateIn,
    faculty: FacultyProfile = Depends(get_faculty_profile),
    db: Session = Depends(get_db),
):
    faculty_assignment(db, faculty, body.subject_id, body.section_id)
    row = Assignment(
        subject_id=body.subject_id,
        section_id=body.section_id,
        created_by_faculty_id=faculty.id,
        title=body.title,
        description=body.description,
        due_at=body.due_at,
        max_marks=body.max_marks,
    )
    db.add(row)
    db.commit()
    db.refresh(row)
    enrolls = (
        db.query(Enrollment)
        .filter(Enrollment.subject_id == body.subject_id, Enrollment.section_id == body.section_id)
        .all()
    )
    for e in enrolls:
        st = db.get(StudentProfile, e.student_id)
        if st:
            notify(
                db,
                st.user_id,
                "assignment_created",
                f"New assignment: {row.title}",
                row.description or row.title,
                f"assignment_created:{row.id}",
            )
    return ok({"id": row.id})


@router.get("/assignments")
def list_assignments(faculty: FacultyProfile = Depends(get_faculty_profile), db: Session = Depends(get_db)):
    subjects, sections = faculty_scope_ids(db, faculty)
    if not subjects:
        return ok([])
    rows = db.query(Assignment).filter(Assignment.subject_id.in_(subjects), Assignment.section_id.in_(sections)).all()
    return ok(
        [
            {
                "id": a.id,
                "title": a.title,
                "due_at": a.due_at.isoformat(),
                "max_marks": a.max_marks,
                "subject_id": a.subject_id,
                "section_id": a.section_id,
            }
            for a in rows
        ]
    )


@router.post("/assignments/{assignment_id}/evaluate")
def evaluate(
    assignment_id: int,
    submission_id: int,
    body: EvaluateIn,
    faculty: FacultyProfile = Depends(get_faculty_profile),
    db: Session = Depends(get_db),
):
    assignment = db.get(Assignment, assignment_id)
    if assignment is None:
        raise HTTPException(404, "Assignment not found")
    faculty_assignment(db, faculty, assignment.subject_id, assignment.section_id)
    sub = db.get(Submission, submission_id)
    if sub is None or sub.assignment_id != assignment_id:
        raise HTTPException(404, "Submission not found")
    if body.score > assignment.max_marks:
        raise HTTPException(422, "Score exceeds max marks")
    sub.score = body.score
    sub.feedback = body.feedback
    sub.evaluated_by_faculty_id = faculty.id
    sub.evaluated_at = datetime.now(timezone.utc)
    db.commit()
    return ok({"submission_id": sub.id, "score": sub.score})


@router.post("/exams", status_code=201)
def create_exam(
    body: ExamCreateIn,
    faculty: FacultyProfile = Depends(get_faculty_profile),
    db: Session = Depends(get_db),
):
    faculty_assignment(db, faculty, body.subject_id, body.section_id)
    row = Exam(
        subject_id=body.subject_id,
        section_id=body.section_id,
        created_by_faculty_id=faculty.id,
        title=body.title,
        exam_date=body.exam_date,
        max_marks=body.max_marks,
        venue=body.venue,
    )
    db.add(row)
    db.commit()
    db.refresh(row)
    return ok({"id": row.id})


@router.get("/exams")
def list_exams(faculty: FacultyProfile = Depends(get_faculty_profile), db: Session = Depends(get_db)):
    subjects, sections = faculty_scope_ids(db, faculty)
    if not subjects:
        return ok([])
    rows = db.query(Exam).filter(Exam.subject_id.in_(subjects), Exam.section_id.in_(sections)).all()
    return ok(
        [
            {
                "id": e.id,
                "title": e.title,
                "exam_date": e.exam_date.isoformat(),
                "max_marks": e.max_marks,
                "subject_id": e.subject_id,
                "section_id": e.section_id,
            }
            for e in rows
        ]
    )


@router.post("/marks")
def record_mark(
    body: MarkIn,
    faculty: FacultyProfile = Depends(get_faculty_profile),
    db: Session = Depends(get_db),
):
    exam = db.get(Exam, body.exam_id)
    if exam is None:
        raise HTTPException(404, "Exam not found")
    faculty_assignment(db, faculty, exam.subject_id, exam.section_id)
    if body.student_id not in authorized_student_ids(db, faculty):
        raise HTTPException(403, "Student is not in your assigned classes")
    enrolled = (
        db.query(Enrollment)
        .filter(
            Enrollment.student_id == body.student_id,
            Enrollment.subject_id == exam.subject_id,
            Enrollment.section_id == exam.section_id,
        )
        .one_or_none()
    )
    if enrolled is None:
        raise HTTPException(403, "Student is not enrolled in this exam's subject/section")
    if body.obtained > exam.max_marks:
        raise HTTPException(422, "Obtained marks exceed exam maximum")
    existing = (
        db.query(Mark).filter(Mark.student_id == body.student_id, Mark.exam_id == body.exam_id).one_or_none()
    )
    if existing:
        existing.obtained = body.obtained
        existing.recorded_by_faculty_id = faculty.id
        db.commit()
        return ok({"id": existing.id, "updated": True})
    row = Mark(
        student_id=body.student_id,
        exam_id=body.exam_id,
        obtained=body.obtained,
        recorded_by_faculty_id=faculty.id,
    )
    db.add(row)
    db.commit()
    db.refresh(row)
    return ok({"id": row.id, "updated": False})


@router.get("/analytics")
def analytics(
    faculty: FacultyProfile = Depends(get_faculty_profile),
    db: Session = Depends(get_db),
    subject_id: int | None = None,
    section_id: int | None = None,
):
    subjects, sections = faculty_scope_ids(db, faculty)
    if subject_id and subject_id not in subjects:
        raise HTTPException(403, "Not assigned to this subject")
    if section_id and section_id not in sections:
        raise HTTPException(403, "Not assigned to this section")
    q = db.query(FacultyAssignment).filter(FacultyAssignment.faculty_id == faculty.id)
    if subject_id:
        q = q.filter(FacultyAssignment.subject_id == subject_id)
    if section_id:
        q = q.filter(FacultyAssignment.section_id == section_id)
    student_ids = set()
    for a in q.all():
        for e in (
            db.query(Enrollment)
            .filter(Enrollment.subject_id == a.subject_id, Enrollment.section_id == a.section_id)
            .all()
        ):
            student_ids.add(e.student_id)
    summaries = []
    for sid in student_ids:
        perf = subject_performance(db, sid)
        st = db.get(StudentProfile, sid)
        summaries.append(
            {
                "student_id": sid,
                "full_name": st.full_name if st else None,
                "cgpa": compute_cgpa(perf)["cgpa"],
                "attendance": attendance_summary(db, sid)["overall_percentage"],
            }
        )
    return ok(
        {
            "class_size": len(student_ids),
            "students": summaries,
            "needs_support": students_needing_support(db, list(student_ids)),
        }
    )


@router.post("/announcements", status_code=201)
def create_announcement(
    body: AnnouncementIn,
    faculty: FacultyProfile = Depends(get_faculty_profile),
    db: Session = Depends(get_db),
):
    _, sections = faculty_scope_ids(db, faculty)
    if body.section_id not in sections:
        raise HTTPException(403, "Not assigned to this section")
    if body.subject_id is not None:
        subjects, _ = faculty_scope_ids(db, faculty)
        if body.subject_id not in subjects:
            raise HTTPException(403, "Not assigned to this subject")
    row = Announcement(
        faculty_id=faculty.id,
        section_id=body.section_id,
        subject_id=body.subject_id,
        title=body.title,
        body=body.body,
    )
    db.add(row)
    db.commit()
    db.refresh(row)
    enrolls = db.query(Enrollment).filter(Enrollment.section_id == body.section_id).all()
    if body.subject_id:
        enrolls = [e for e in enrolls if e.subject_id == body.subject_id]
    for e in enrolls:
        st = db.get(StudentProfile, e.student_id)
        if st:
            notify(db, st.user_id, "announcement", body.title, body.body, f"announcement:{row.id}:{st.id}")
    return ok({"id": row.id})


@router.get("/announcements")
def list_announcements(faculty: FacultyProfile = Depends(get_faculty_profile), db: Session = Depends(get_db)):
    rows = db.query(Announcement).filter(Announcement.faculty_id == faculty.id).all()
    return ok([{"id": r.id, "title": r.title, "body": r.body, "section_id": r.section_id} for r in rows])


@router.get("/timetable")
def timetable(faculty: FacultyProfile = Depends(get_faculty_profile), db: Session = Depends(get_db)):
    rows = db.query(TimetableEntry).filter(TimetableEntry.faculty_id == faculty.id).all()
    return ok(
        [
            {
                "id": r.id,
                "day_of_week": r.day_of_week,
                "start_time": r.start_time,
                "end_time": r.end_time,
                "room": r.room,
                "subject_id": r.subject_id,
                "section_id": r.section_id,
            }
            for r in rows
        ]
    )


@router.get("/notifications")
def notifications(
    faculty: FacultyProfile = Depends(get_faculty_profile),
    db: Session = Depends(get_db),
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=200),
):
    rows = (
        db.query(Notification)
        .filter(Notification.user_id == faculty.user_id)
        .order_by(Notification.created_at.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )
    return ok(
        [{"id": n.id, "kind": n.kind, "title": n.title, "body": n.body, "is_read": n.is_read} for n in rows]
    )
