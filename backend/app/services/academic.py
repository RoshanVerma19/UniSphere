"""Transparent academic calculations. Never fabricate missing records."""

from __future__ import annotations

from datetime import date, datetime, timezone

from sqlalchemy.orm import Session

from app.models import AcademicGoal, Assignment, AttendanceRecord, Enrollment, Exam, Mark, StudyTask, Subject
from app.models.academic import AttendanceStatus
from app.models.planner import TaskStatus

# Indian 10-point scale commonly used in many universities (assumption, documented in API).
GRADE_BANDS = (
    (90, 10, "O"),
    (80, 9, "A+"),
    (70, 8, "A"),
    (60, 7, "B+"),
    (50, 6, "B"),
    (40, 5, "C"),
    (0, 0, "F"),
)

CGPA_ASSUMPTIONS = (
    "CGPA uses a 10-point scale mapped from percentage: "
    ">=90 O/10, >=80 A+/9, >=70 A/8, >=60 B+/7, >=50 B/6, >=40 C/5, else F/0. "
    "Subject percentage is the unweighted mean of recorded exam marks for that subject. "
    "CGPA is credit-weighted over subjects that have at least one exam mark. "
    "Subjects without marks are excluded rather than guessed."
)


def percentage_to_grade(pct: float) -> tuple[float, str]:
    for threshold, points, letter in GRADE_BANDS:
        if pct >= threshold:
            return float(points), letter
    return 0.0, "F"


def attendance_summary(db: Session, student_id: int) -> dict:
    rows = db.query(AttendanceRecord).filter(AttendanceRecord.student_id == student_id).all()
    by_subject: dict[int, list[AttendanceRecord]] = {}
    for r in rows:
        by_subject.setdefault(r.subject_id, []).append(r)

    subjects = []
    total_held = 0
    total_present = 0
    for sid, recs in by_subject.items():
        held = len(recs)
        present = sum(1 for r in recs if r.status in (AttendanceStatus.present, AttendanceStatus.late))
        total_held += held
        total_present += present
        subj = db.get(Subject, sid)
        pct = round(100.0 * present / held, 2) if held else None
        subjects.append(
            {
                "subject_id": sid,
                "subject_code": subj.code if subj else None,
                "subject_name": subj.name if subj else None,
                "held": held,
                "present_or_late": present,
                "percentage": pct,
                "at_risk": pct is not None and pct < 75,
            }
        )
    overall = round(100.0 * total_present / total_held, 2) if total_held else None
    return {
        "overall_percentage": overall,
        "sessions_held": total_held,
        "sessions_present_or_late": total_present,
        "threshold_warning_percent": 75,
        "rule": "Present and late count as attended. Absent and excused do not. 75% is the warning threshold.",
        "by_subject": subjects,
    }


def subject_performance(db: Session, student_id: int) -> list[dict]:
    enrollments = db.query(Enrollment).filter(Enrollment.student_id == student_id).all()
    out = []
    for enr in enrollments:
        subject = db.get(Subject, enr.subject_id)
        exams = db.query(Exam).filter(Exam.subject_id == enr.subject_id, Exam.section_id == enr.section_id).all()
        exam_ids = [e.id for e in exams]
        marks = []
        if exam_ids:
            marks = (
                db.query(Mark)
                .filter(Mark.student_id == student_id, Mark.exam_id.in_(exam_ids))
                .all()
            )
        percents = []
        mark_items = []
        for m in marks:
            exam = db.get(Exam, m.exam_id)
            if exam and exam.max_marks:
                pct = 100.0 * m.obtained / exam.max_marks
                percents.append(pct)
                gp, letter = percentage_to_grade(pct)
                mark_items.append(
                    {
                        "exam_id": exam.id,
                        "exam_title": exam.title,
                        "obtained": m.obtained,
                        "max_marks": exam.max_marks,
                        "percentage": round(pct, 2),
                        "grade_point": gp,
                        "letter": letter,
                    }
                )
        avg = round(sum(percents) / len(percents), 2) if percents else None
        gp, letter = percentage_to_grade(avg) if avg is not None else (None, None)
        out.append(
            {
                "subject_id": subject.id if subject else enr.subject_id,
                "code": subject.code if subject else None,
                "name": subject.name if subject else None,
                "credits": subject.credits if subject else None,
                "average_percentage": avg,
                "grade_point": gp,
                "letter": letter,
                "marks": mark_items,
            }
        )
    return out


def compute_cgpa(performance: list[dict]) -> dict:
    num = 0.0
    den = 0.0
    used = 0
    for s in performance:
        if s.get("grade_point") is None or not s.get("credits"):
            continue
        num += s["grade_point"] * s["credits"]
        den += s["credits"]
        used += 1
    cgpa = round(num / den, 2) if den else None
    return {
        "cgpa": cgpa,
        "subjects_included": used,
        "assumptions": CGPA_ASSUMPTIONS,
    }


def weak_subjects(performance: list[dict], threshold: float = 60.0) -> list[dict]:
    weak = []
    for s in performance:
        if s.get("average_percentage") is not None and s["average_percentage"] < threshold:
            weak.append(s)
        elif s.get("average_percentage") is None:
            weak.append({**s, "reason": "no_marks_yet"})
    return weak


def task_completion(db: Session, student_id: int) -> dict:
    tasks = db.query(StudyTask).filter(StudyTask.student_id == student_id).all()
    total = len(tasks)
    done = sum(1 for t in tasks if t.status == TaskStatus.completed)
    return {
        "total": total,
        "completed": done,
        "completion_percent": round(100.0 * done / total, 2) if total else None,
    }


def upcoming_deadlines(db: Session, student_id: int, limit: int = 10) -> list[dict]:
    now = datetime.now(timezone.utc)
    enrollments = db.query(Enrollment).filter(Enrollment.student_id == student_id).all()
    section_ids = {e.section_id for e in enrollments}
    subject_ids = {e.subject_id for e in enrollments}
    items: list[dict] = []
    if section_ids:
        assignments = (
            db.query(Assignment)
            .filter(Assignment.section_id.in_(section_ids), Assignment.due_at >= now)
            .all()
        )
        for a in assignments:
            items.append(
                {
                    "kind": "assignment",
                    "id": a.id,
                    "title": a.title,
                    "due_at": a.due_at.isoformat(),
                    "subject_id": a.subject_id,
                }
            )
        exams = (
            db.query(Exam)
            .filter(Exam.section_id.in_(section_ids), Exam.exam_date >= date.today())
            .all()
        )
        for e in exams:
            items.append(
                {
                    "kind": "exam",
                    "id": e.id,
                    "title": e.title,
                    "due_at": e.exam_date.isoformat(),
                    "subject_id": e.subject_id,
                }
            )
    tasks = (
        db.query(StudyTask)
        .filter(StudyTask.student_id == student_id, StudyTask.status != TaskStatus.completed)
        .all()
    )
    for t in tasks:
        if t.due_at:
            items.append(
                {
                    "kind": "study_task",
                    "id": t.id,
                    "title": t.title,
                    "due_at": t.due_at.isoformat(),
                    "subject_id": t.subject_id,
                }
            )
    items.sort(key=lambda x: x["due_at"])
    return items[:limit]


def goal_progress(db: Session, student_id: int, cgpa: float | None) -> list[dict]:
    goals = db.query(AcademicGoal).filter(AcademicGoal.student_id == student_id, AcademicGoal.is_active.is_(True)).all()
    out = []
    for g in goals:
        remaining = None
        on_track = None
        if cgpa is not None and g.target_cgpa is not None:
            remaining = round(g.target_cgpa - cgpa, 2)
            on_track = cgpa >= g.target_cgpa
        out.append(
            {
                "id": g.id,
                "title": g.title,
                "target_cgpa": g.target_cgpa,
                "current_cgpa": cgpa,
                "gap": remaining,
                "met": on_track,
            }
        )
    return out


def students_needing_support(db: Session, student_ids: list[int]) -> list[dict]:
    flagged = []
    for sid in student_ids:
        att = attendance_summary(db, sid)
        perf = subject_performance(db, sid)
        cgpa_info = compute_cgpa(perf)
        reasons = []
        if att["overall_percentage"] is not None and att["overall_percentage"] < 75:
            reasons.append("low_attendance")
        if any(s.get("average_percentage") is not None and s["average_percentage"] < 50 for s in perf):
            reasons.append("failing_subject")
        if cgpa_info["cgpa"] is not None and cgpa_info["cgpa"] < 6:
            reasons.append("low_cgpa")
        if reasons:
            flagged.append({"student_id": sid, "reasons": reasons, "attendance": att["overall_percentage"], "cgpa": cgpa_info["cgpa"]})
    return flagged
