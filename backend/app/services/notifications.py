from datetime import date, datetime, timedelta, timezone
import logging

from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.models import Assignment, Enrollment, Exam, Notification, StudentProfile, StudyTask, User
from app.models.planner import TaskStatus

logger = logging.getLogger("unisphere.notifications")


def notify(db: Session, user_id: int, kind: str, title: str, body: str, ref_key: str) -> Notification | None:
    row = Notification(user_id=user_id, kind=kind, title=title, body=body, ref_key=ref_key, is_read=False)
    db.add(row)
    try:
        db.commit()
        db.refresh(row)
        return row
    except IntegrityError:
        db.rollback()
        return None


def generate_reminders(db: Session) -> int:
    """Create exam/assignment/task reminders without duplicates (unique user+kind+ref_key)."""
    now = datetime.now(timezone.utc)
    horizon = now + timedelta(hours=48)
    created = 0

    exams = db.query(Exam).filter(Exam.exam_date >= date.today(), Exam.exam_date <= (date.today() + timedelta(days=2))).all()
    for exam in exams:
        enrolls = (
            db.query(Enrollment)
            .filter(Enrollment.subject_id == exam.subject_id, Enrollment.section_id == exam.section_id)
            .all()
        )
        for enr in enrolls:
            student = db.get(StudentProfile, enr.student_id)
            if not student:
                continue
            ref = f"exam:{exam.id}:{exam.exam_date.isoformat()}"
            n = notify(
                db,
                student.user_id,
                "exam_reminder",
                f"Exam soon: {exam.title}",
                f"{exam.title} is scheduled on {exam.exam_date.isoformat()}.",
                ref,
            )
            if n:
                created += 1

    assignments = db.query(Assignment).filter(Assignment.due_at >= now, Assignment.due_at <= horizon).all()
    for a in assignments:
        enrolls = (
            db.query(Enrollment)
            .filter(Enrollment.subject_id == a.subject_id, Enrollment.section_id == a.section_id)
            .all()
        )
        for enr in enrolls:
            student = db.get(StudentProfile, enr.student_id)
            if not student:
                continue
            ref = f"assignment:{a.id}:{a.due_at.date().isoformat()}"
            n = notify(
                db,
                student.user_id,
                "assignment_reminder",
                f"Assignment due: {a.title}",
                f"{a.title} is due at {a.due_at.isoformat()}.",
                ref,
            )
            if n:
                created += 1

    tasks = (
        db.query(StudyTask)
        .filter(
            StudyTask.status != TaskStatus.completed,
            StudyTask.due_at.is_not(None),
            StudyTask.due_at >= now,
            StudyTask.due_at <= horizon,
        )
        .all()
    )
    for t in tasks:
        student = db.get(StudentProfile, t.student_id)
        if not student:
            continue
        ref = f"task:{t.id}:{t.due_at.date().isoformat()}"
        n = notify(
            db,
            student.user_id,
            "study_plan_reminder",
            f"Study task: {t.title}",
            f"{t.title} is due at {t.due_at.isoformat()}.",
            ref,
        )
        if n:
            created += 1

    logger.info("reminder_job created=%s", created)
    return created
