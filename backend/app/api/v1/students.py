from datetime import datetime, timezone

from fastapi import APIRouter, Depends, File, HTTPException, Query, UploadFile
from sqlalchemy.orm import Session

from app.config import get_settings
from app.db import get_db
from app.deps import get_student_profile
from app.models import (
    AcademicGoal,
    Announcement,
    Assignment,
    AttendanceRecord,
    Enrollment,
    Exam,
    Mark,
    Note,
    Notification,
    StudentProfile,
    StudyMaterial,
    StudyTask,
    Subject,
    Submission,
    TimetableEntry,
    User,
)
from app.models.planner import TaskStatus
from app.schemas import (
    GoalCreateIn,
    MaterialCreateIn,
    NoteCreateIn,
    ProfileUpdateIn,
    SubmissionIn,
    TaskCreateIn,
    TaskUpdateIn,
    ok,
)
from app.services.academic import (
    attendance_summary,
    compute_cgpa,
    goal_progress,
    subject_performance,
    task_completion,
    upcoming_deadlines,
)

router = APIRouter(prefix="/api/v1/student", tags=["student"])
ALLOWED_UPLOAD = {".pdf", ".png", ".jpg", ".jpeg", ".txt", ".md", ".docx"}


def _enrolled(db: Session, student: StudentProfile):
    return db.query(Enrollment).filter(Enrollment.student_id == student.id).all()


@router.get("/profile")
def profile(student: StudentProfile = Depends(get_student_profile), db: Session = Depends(get_db)):
    user = db.get(User, student.user_id)
    return ok(
        {
            "id": student.id,
            "user_id": student.user_id,
            "email": user.email if user else None,
            "student_id": student.student_id,
            "full_name": student.full_name,
            "program": student.program,
            "year_of_study": student.year_of_study,
            "phone": student.phone,
            "university_id": student.university_id,
            "campus_id": student.campus_id,
            "course_id": student.course_id,
            "section_id": student.section_id,
            "timezone": user.timezone if user else None,
        }
    )


@router.patch("/profile")
def update_profile(
    body: ProfileUpdateIn,
    student: StudentProfile = Depends(get_student_profile),
    db: Session = Depends(get_db),
):
    if body.full_name:
        student.full_name = body.full_name
    if body.phone is not None:
        student.phone = body.phone
    user = db.get(User, student.user_id)
    if body.timezone and user:
        user.timezone = body.timezone
    db.commit()
    return profile(student, db)


@router.get("/dashboard")
def dashboard(student: StudentProfile = Depends(get_student_profile), db: Session = Depends(get_db)):
    perf = subject_performance(db, student.id)
    cgpa = compute_cgpa(perf)
    att = attendance_summary(db, student.id)
    return ok(
        {
            "cgpa": cgpa,
            "attendance": att,
            "upcoming": upcoming_deadlines(db, student.id),
            "tasks": task_completion(db, student.id),
            "goals": goal_progress(db, student.id, cgpa["cgpa"]),
        }
    )


@router.get("/academics")
def academics(student: StudentProfile = Depends(get_student_profile), db: Session = Depends(get_db)):
    perf = subject_performance(db, student.id)
    return ok({"subjects": perf, "cgpa": compute_cgpa(perf)})


@router.get("/attendance")
def attendance(student: StudentProfile = Depends(get_student_profile), db: Session = Depends(get_db)):
    return ok(attendance_summary(db, student.id))


@router.get("/subjects")
def subjects(student: StudentProfile = Depends(get_student_profile), db: Session = Depends(get_db)):
    enrolls = _enrolled(db, student)
    items = []
    for e in enrolls:
        s = db.get(Subject, e.subject_id)
        items.append(
            {
                "enrollment_id": e.id,
                "subject_id": e.subject_id,
                "section_id": e.section_id,
                "code": s.code if s else None,
                "name": s.name if s else None,
                "credits": s.credits if s else None,
            }
        )
    return ok(items)


@router.get("/marks")
def marks(student: StudentProfile = Depends(get_student_profile), db: Session = Depends(get_db)):
    return ok(subject_performance(db, student.id))


@router.get("/exams")
def exams(student: StudentProfile = Depends(get_student_profile), db: Session = Depends(get_db)):
    enrolls = _enrolled(db, student)
    section_ids = [e.section_id for e in enrolls]
    subject_ids = [e.subject_id for e in enrolls]
    if not section_ids:
        return ok([])
    rows = db.query(Exam).filter(Exam.section_id.in_(section_ids), Exam.subject_id.in_(subject_ids)).all()
    return ok(
        [
            {
                "id": r.id,
                "title": r.title,
                "exam_date": r.exam_date.isoformat(),
                "max_marks": r.max_marks,
                "subject_id": r.subject_id,
                "venue": r.venue,
            }
            for r in rows
        ]
    )


@router.get("/assignments")
def assignments(student: StudentProfile = Depends(get_student_profile), db: Session = Depends(get_db)):
    enrolls = _enrolled(db, student)
    pairs = {(e.subject_id, e.section_id) for e in enrolls}
    rows = db.query(Assignment).all()
    data = []
    for a in rows:
        if (a.subject_id, a.section_id) not in pairs:
            continue
        sub = (
            db.query(Submission)
            .filter(Submission.assignment_id == a.id, Submission.student_id == student.id)
            .one_or_none()
        )
        data.append(
            {
                "id": a.id,
                "title": a.title,
                "description": a.description,
                "due_at": a.due_at.isoformat(),
                "max_marks": a.max_marks,
                "subject_id": a.subject_id,
                "submission": None
                if sub is None
                else {
                    "id": sub.id,
                    "submitted_at": sub.submitted_at.isoformat() if sub.submitted_at else None,
                    "score": sub.score,
                    "feedback": sub.feedback,
                },
            }
        )
    return ok(data)


@router.post("/assignments/{assignment_id}/submit")
def submit_assignment(
    assignment_id: int,
    body: SubmissionIn,
    student: StudentProfile = Depends(get_student_profile),
    db: Session = Depends(get_db),
):
    assignment = db.get(Assignment, assignment_id)
    if assignment is None:
        raise HTTPException(404, "Assignment not found")
    enrolled = (
        db.query(Enrollment)
        .filter(
            Enrollment.student_id == student.id,
            Enrollment.subject_id == assignment.subject_id,
            Enrollment.section_id == assignment.section_id,
        )
        .one_or_none()
    )
    if enrolled is None:
        raise HTTPException(403, "Not enrolled in this assignment's class")
    existing = (
        db.query(Submission)
        .filter(Submission.assignment_id == assignment_id, Submission.student_id == student.id)
        .one_or_none()
    )
    if existing:
        raise HTTPException(409, "Already submitted")
    now = datetime.now(timezone.utc)
    due = assignment.due_at
    if due.tzinfo is None:
        due = due.replace(tzinfo=timezone.utc)
    row = Submission(
        assignment_id=assignment_id,
        student_id=student.id,
        content=body.content,
        submitted_at=now,
        is_late=now > due,
    )
    db.add(row)
    db.commit()
    db.refresh(row)
    return ok({"id": row.id, "is_late": row.is_late})


@router.get("/planner")
def list_tasks(student: StudentProfile = Depends(get_student_profile), db: Session = Depends(get_db)):
    rows = db.query(StudyTask).filter(StudyTask.student_id == student.id).order_by(StudyTask.due_at).all()
    return ok(
        [
            {
                "id": t.id,
                "title": t.title,
                "notes": t.notes,
                "status": t.status.value,
                "due_at": t.due_at.isoformat() if t.due_at else None,
                "source": t.source,
                "subject_id": t.subject_id,
            }
            for t in rows
        ]
    )


@router.post("/planner", status_code=201)
def create_task(
    body: TaskCreateIn,
    student: StudentProfile = Depends(get_student_profile),
    db: Session = Depends(get_db),
):
    t = StudyTask(
        student_id=student.id,
        title=body.title,
        notes=body.notes,
        subject_id=body.subject_id,
        due_at=body.due_at,
        source="manual",
        status=TaskStatus.pending,
    )
    db.add(t)
    db.commit()
    db.refresh(t)
    return ok({"id": t.id})


@router.patch("/planner/{task_id}")
def update_task(
    task_id: int,
    body: TaskUpdateIn,
    student: StudentProfile = Depends(get_student_profile),
    db: Session = Depends(get_db),
):
    t = db.get(StudyTask, task_id)
    if t is None or t.student_id != student.id:
        raise HTTPException(404, "Task not found")
    if body.title is not None:
        t.title = body.title
    if body.notes is not None:
        t.notes = body.notes
    if body.due_at is not None:
        t.due_at = body.due_at
    if body.status is not None:
        try:
            t.status = TaskStatus(body.status)
        except ValueError:
            raise HTTPException(422, "Invalid status")
        if t.status == TaskStatus.completed:
            t.completed_at = datetime.now(timezone.utc)
    db.commit()
    return ok({"id": t.id, "status": t.status.value})


@router.get("/timetable")
def timetable(student: StudentProfile = Depends(get_student_profile), db: Session = Depends(get_db)):
    enrolls = _enrolled(db, student)
    section_ids = {e.section_id for e in enrolls}
    if not section_ids:
        return ok([])
    rows = db.query(TimetableEntry).filter(TimetableEntry.section_id.in_(section_ids)).all()
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


@router.get("/materials")
def materials(student: StudentProfile = Depends(get_student_profile), db: Session = Depends(get_db)):
    rows = db.query(StudyMaterial).filter(StudyMaterial.student_id == student.id).all()
    return ok([{"id": r.id, "title": r.title, "url": r.url, "subject_id": r.subject_id} for r in rows])


@router.post("/materials", status_code=201)
def create_material(
    body: MaterialCreateIn,
    student: StudentProfile = Depends(get_student_profile),
    db: Session = Depends(get_db),
):
    row = StudyMaterial(student_id=student.id, title=body.title, url=body.url, subject_id=body.subject_id)
    db.add(row)
    db.commit()
    db.refresh(row)
    return ok({"id": row.id})


@router.post("/materials/upload", status_code=201)
async def upload_material(
    title: str,
    student: StudentProfile = Depends(get_student_profile),
    db: Session = Depends(get_db),
    file: UploadFile = File(...),
):
    from uuid import uuid4
    from app.services.cloud_storage import upload_study_material

    settings = get_settings()
    suffix = ""
    if file.filename and "." in file.filename:
        suffix = "." + file.filename.rsplit(".", 1)[-1].lower()

    if suffix not in ALLOWED_UPLOAD:
        raise HTTPException(
            400,
            f"File type not allowed. Allowed: {sorted(ALLOWED_UPLOAD)}",
        )

    content = await file.read()
    if len(content) > settings.max_upload_mb * 1024 * 1024:
        raise HTTPException(400, "File too large")

    filename = f"{uuid4().hex}{suffix}"

    try:
        uploaded = upload_study_material(content, filename)
    except Exception:
        import logging
        logging.getLogger("unisphere.upload").exception(
            "Cloudinary upload failed"
        )
        raise HTTPException(502, "Cloud storage upload failed")

    try:
        row = StudyMaterial(
            student_id=student.id,
            title=title,
            url=uploaded["url"],
            file_path=None,
        )
        db.add(row)
        db.commit()
        db.refresh(row)
    except Exception:
        db.rollback()
        raise HTTPException(
            500,
            "File uploaded but its database record could not be saved",
        )

    return ok({
        "id": row.id,
        "filename": filename,
        "url": row.url,
    })

@router.get("/notes")
def notes(student: StudentProfile = Depends(get_student_profile), db: Session = Depends(get_db)):
    rows = db.query(Note).filter(Note.student_id == student.id).all()
    return ok([{"id": r.id, "title": r.title, "body": r.body, "subject_id": r.subject_id} for r in rows])


@router.post("/notes", status_code=201)
def create_note(
    body: NoteCreateIn,
    student: StudentProfile = Depends(get_student_profile),
    db: Session = Depends(get_db),
):
    row = Note(student_id=student.id, title=body.title, body=body.body, subject_id=body.subject_id)
    db.add(row)
    db.commit()
    db.refresh(row)
    return ok({"id": row.id})


@router.get("/goals")
def goals(student: StudentProfile = Depends(get_student_profile), db: Session = Depends(get_db)):
    perf = subject_performance(db, student.id)
    cgpa = compute_cgpa(perf)
    return ok(goal_progress(db, student.id, cgpa["cgpa"]))


@router.post("/goals", status_code=201)
def create_goal(
    body: GoalCreateIn,
    student: StudentProfile = Depends(get_student_profile),
    db: Session = Depends(get_db),
):
    row = AcademicGoal(
        student_id=student.id,
        title=body.title,
        target_cgpa=body.target_cgpa,
        target_date=body.target_date,
        is_active=True,
    )
    db.add(row)
    db.commit()
    db.refresh(row)
    return ok({"id": row.id})


@router.get("/notifications")
def notifications(
    student: StudentProfile = Depends(get_student_profile),
    db: Session = Depends(get_db),
    unread_only: bool = False,
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=200),
):
    q = db.query(Notification).filter(Notification.user_id == student.user_id)
    if unread_only:
        q = q.filter(Notification.is_read.is_(False))
    rows = q.order_by(Notification.created_at.desc()).offset(skip).limit(limit).all()
    return ok(
        [
            {
                "id": n.id,
                "kind": n.kind,
                "title": n.title,
                "body": n.body,
                "is_read": n.is_read,
                "created_at": n.created_at.isoformat() if n.created_at else None,
            }
            for n in rows
        ]
    )


@router.patch("/notifications/{notification_id}/read")
def read_notification(
    notification_id: int,
    student: StudentProfile = Depends(get_student_profile),
    db: Session = Depends(get_db),
):
    n = db.get(Notification, notification_id)
    if n is None or n.user_id != student.user_id:
        raise HTTPException(404, "Notification not found")
    n.is_read = True
    db.commit()
    return ok({"id": n.id, "is_read": True})


@router.get("/analytics")
def analytics(student: StudentProfile = Depends(get_student_profile), db: Session = Depends(get_db)):
    perf = subject_performance(db, student.id)
    cgpa = compute_cgpa(perf)
    return ok(
        {
            "cgpa": cgpa,
            "attendance": attendance_summary(db, student.id),
            "subjects": perf,
            "tasks": task_completion(db, student.id),
            "upcoming": upcoming_deadlines(db, student.id),
            "goals": goal_progress(db, student.id, cgpa["cgpa"]),
        }
    )


@router.get("/announcements")
def announcements(student: StudentProfile = Depends(get_student_profile), db: Session = Depends(get_db)):
    enrolls = _enrolled(db, student)
    section_ids = {e.section_id for e in enrolls}
    if not section_ids:
        return ok([])
    rows = db.query(Announcement).filter(Announcement.section_id.in_(section_ids)).all()
    return ok(
        [{"id": r.id, "title": r.title, "body": r.body, "section_id": r.section_id, "subject_id": r.subject_id} for r in rows]
    )
