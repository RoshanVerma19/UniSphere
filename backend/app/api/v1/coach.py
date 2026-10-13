from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db import get_db
from app.deps import get_student_profile
from app.models import CoachConversation, CoachMessage, StudentProfile
from app.schemas import CoachMessageIn, ok
from app.services.coach import apply_suggested_tasks, respond

router = APIRouter(prefix="/api/v1/student/coach", tags=["coach"])


@router.post("/messages")
def send_message(
    body: CoachMessageIn,
    student: StudentProfile = Depends(get_student_profile),
    db: Session = Depends(get_db),
):
    result = respond(db, student.id, body.message, body.conversation_id)
    return ok(result)


@router.get("/conversations")
def conversations(student: StudentProfile = Depends(get_student_profile), db: Session = Depends(get_db)):
    rows = (
        db.query(CoachConversation)
        .filter(CoachConversation.student_id == student.id)
        .order_by(CoachConversation.created_at.desc())
        .all()
    )
    return ok([{"id": c.id, "title": c.title, "created_at": c.created_at.isoformat() if c.created_at else None} for c in rows])


@router.get("/conversations/{conversation_id}")
def conversation_detail(
    conversation_id: int,
    student: StudentProfile = Depends(get_student_profile),
    db: Session = Depends(get_db),
):
    conv = db.get(CoachConversation, conversation_id)
    if conv is None or conv.student_id != student.id:
        raise HTTPException(404, "Conversation not found")
    messages = db.query(CoachMessage).filter(CoachMessage.conversation_id == conv.id).all()
    return ok(
        {
            "id": conv.id,
            "title": conv.title,
            "messages": [
                {"id": m.id, "role": m.role, "content": m.content, "provider": m.provider} for m in messages
            ],
        }
    )


@router.post("/apply-plan")
def apply_plan(
    body: CoachMessageIn,
    student: StudentProfile = Depends(get_student_profile),
    db: Session = Depends(get_db),
):
    result = respond(db, student.id, body.message, body.conversation_id)
    created = apply_suggested_tasks(db, student.id, result.get("suggested_tasks") or [])
    return ok(
        {
            "conversation_id": result["conversation_id"],
            "provider": result["provider"],
            "tasks_created": [{"id": t.id, "title": t.title} for t in created],
        }
    )
