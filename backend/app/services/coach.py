from __future__ import annotations

from datetime import datetime, timedelta, timezone
import json
import logging

import httpx
from sqlalchemy.orm import Session

from app.config import get_settings
from app.models import CoachConversation, CoachMessage, StudyTask
from app.models.planner import TaskStatus
from app.services.academic import (
    attendance_summary,
    compute_cgpa,
    goal_progress,
    subject_performance,
    upcoming_deadlines,
    weak_subjects,
)

logger = logging.getLogger("unisphere.coach")


def snapshot(db: Session, student_id: int) -> dict:
    perf = subject_performance(db, student_id)
    cgpa = compute_cgpa(perf)
    att = attendance_summary(db, student_id)
    return {
        "performance": perf,
        "cgpa": cgpa,
        "attendance": att,
        "weak_subjects": weak_subjects(perf),
        "deadlines": upcoming_deadlines(db, student_id, limit=8),
        "goals": goal_progress(db, student_id, cgpa["cgpa"]),
    }


def rule_based_advice(data: dict, user_message: str) -> tuple[str, list[dict]]:
    cgpa = data["cgpa"].get("cgpa")
    att = data["attendance"].get("overall_percentage")
    weak = data["weak_subjects"]
    deadlines = data["deadlines"]
    lines = [
        "AI Success Coach (rule-based fallback — no external AI provider is configured).",
        "",
        f"Current CGPA (from recorded exam marks only): {cgpa if cgpa is not None else 'insufficient data'}.",
        data["cgpa"]["assumptions"],
        f"Attendance (present+late / held): {att if att is not None else 'no attendance recorded'}%.",
    ]
    if att is not None and att < 75:
        lines.append("Attendance is below 75%. Prioritize being present in remaining sessions.")
    if weak:
        names = [w.get("name") or f"subject {w.get('subject_id')}" for w in weak]
        lines.append("Focus subjects: " + ", ".join(names) + ".")
    else:
        lines.append("No weak subjects identified from recorded marks.")
    if deadlines:
        lines.append("Upcoming deadlines:")
        for d in deadlines[:5]:
            lines.append(f"- [{d['kind']}] {d['title']} due {d['due_at']}")
    else:
        lines.append("No upcoming exams, assignments, or dated study tasks.")
    for g in data["goals"]:
        if g.get("gap") is not None and g["gap"] > 0:
            lines.append(f"Goal '{g['title']}': {g['gap']} grade points remaining to target CGPA {g['target_cgpa']}.")
        elif g.get("met"):
            lines.append(f"Goal '{g['title']}' is currently met.")
    lines.append("")
    lines.append(f"You asked: {user_message}")
    lines.append("Recommendations: 1) 45–60 minutes on the weakest subject today. 2) Review next exam notes 48 hours ahead. 3) Convert this plan into planner tasks if you want them tracked.")

    now = datetime.now(timezone.utc)
    tasks = []
    for i, w in enumerate(weak[:3]):
        title = f"Study: {w.get('name') or 'weak subject'} (coach)"
        tasks.append(
            {
                "title": title,
                "subject_id": w.get("subject_id"),
                "due_at": (now + timedelta(days=i + 1)).isoformat(),
            }
        )
    if deadlines:
        tasks.append(
            {
                "title": f"Prepare: {deadlines[0]['title']}",
                "subject_id": deadlines[0].get("subject_id"),
                "due_at": deadlines[0]["due_at"],
            }
        )
    return "\n".join(lines), tasks



def _gemini_advice(data: dict, user_message: str, history: list[dict]) -> str | None:
    settings = get_settings()

    if not settings.gemini_api_key.strip():
        return None

    system = (
        "You are UniSphere AI Success Coach. Use only the provided academic snapshot. "
        "Do not invent marks, attendance, or CGPA. If data is missing, say so. "
        "State CGPA assumptions from the snapshot. Be concise and actionable."
    )

    conversation = "\n".join(
        f"{'Student' if m['role'] == 'user' else 'Coach'}: {m['content']}"
        for m in history[-8:]
        if m.get("role") in ("user", "assistant")
    )

    prompt = (
        f"{system}\n\n"
        "Academic snapshot JSON:\n"
        f"{json.dumps(data, default=str)[:12000]}\n\n"
        f"Recent conversation:\n{conversation}\n\n"
        f"Student: {user_message}\n"
        "Coach:"
    )

    try:
        from google import genai

        client = genai.Client(api_key=settings.gemini_api_key)
        response = client.models.generate_content(
            model=settings.gemini_model,
            contents=prompt,
        )
        return response.text or None
    except Exception:
        logger.exception("Gemini coach call failed; using rule-based fallback")
        return None


def respond(db: Session, student_id: int, user_message: str, conversation_id: int | None) -> dict:
    settings = get_settings()
    data = snapshot(db, student_id)
    if conversation_id:
        conv = db.get(CoachConversation, conversation_id)
        if conv is None or conv.student_id != student_id:
            conv = None
    else:
        conv = None
    if conv is None:
        conv = CoachConversation(student_id=student_id, title=user_message[:80])
        db.add(conv)
        db.flush()

    db.add(CoachMessage(conversation_id=conv.id, role="user", content=user_message, provider=None))

    history = [{"role": m.role, "content": m.content} for m in conv.messages if m.role in ("user", "assistant")]
    provider = "rule_based"
    text = None
    suggested: list[dict] = []
    if settings.ai_provider_configured:
        text = _gemini_advice(data, user_message, history)
        if text:
            provider = "gemini"
            _, suggested = rule_based_advice(data, user_message)

    if text is None:
        text, suggested = rule_based_advice(data, user_message)
        provider = "rule_based"

    db.add(CoachMessage(conversation_id=conv.id, role="assistant", content=text, provider=provider))
    db.commit()
    db.refresh(conv)
    return {
        "conversation_id": conv.id,
        "provider": provider,
        "ai_provider_configured": settings.ai_provider_configured,
        "reply": text,
        "suggested_tasks": suggested,
        "snapshot": {
            "cgpa": data["cgpa"],
            "attendance_overall": data["attendance"]["overall_percentage"],
            "weak_subjects": [{"id": w.get("subject_id"), "name": w.get("name")} for w in data["weak_subjects"]],
        },
    }


def apply_suggested_tasks(db: Session, student_id: int, tasks: list[dict]) -> list[StudyTask]:
    created = []
    for t in tasks:
        due = t.get("due_at")
        due_dt = None
        if due:
            try:
                due_dt = datetime.fromisoformat(due.replace("Z", "+00:00"))
            except ValueError:
                due_dt = None
        row = StudyTask(
            student_id=student_id,
            subject_id=t.get("subject_id"),
            title=t["title"],
            status=TaskStatus.pending,
            due_at=due_dt,
            source="coach",
        )
        db.add(row)
        created.append(row)
    db.commit()
    for r in created:
        db.refresh(r)
    return created
