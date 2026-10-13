from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models import Enrollment, FacultyAssignment, FacultyProfile


def faculty_assignment(
    db: Session, faculty: FacultyProfile, subject_id: int, section_id: int
) -> FacultyAssignment:
    row = (
        db.query(FacultyAssignment)
        .filter(
            FacultyAssignment.faculty_id == faculty.id,
            FacultyAssignment.subject_id == subject_id,
            FacultyAssignment.section_id == section_id,
        )
        .one_or_none()
    )
    if row is None:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You are not assigned to this class/subject",
        )
    return row


def faculty_scope_ids(db: Session, faculty: FacultyProfile) -> tuple[set[int], set[int]]:
    rows = db.query(FacultyAssignment).filter(FacultyAssignment.faculty_id == faculty.id).all()
    return {r.subject_id for r in rows}, {r.section_id for r in rows}


def authorized_student_ids(db: Session, faculty: FacultyProfile) -> set[int]:
    rows = db.query(FacultyAssignment).filter(FacultyAssignment.faculty_id == faculty.id).all()
    ids: set[int] = set()
    for r in rows:
        enrolls = (
            db.query(Enrollment)
            .filter(Enrollment.subject_id == r.subject_id, Enrollment.section_id == r.section_id)
            .all()
        )
        ids.update(e.student_id for e in enrolls)
    return ids
