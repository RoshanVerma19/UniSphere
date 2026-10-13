
from datetime import date, datetime
from typing import Any, Generic, TypeVar
import re

from pydantic import BaseModel, ConfigDict, EmailStr, Field, field_validator

from app.models.user import UserRole

T = TypeVar("T")


class APIResponse(BaseModel, Generic[T]):
    success: bool = True
    data: T | None = None
    error: dict[str, Any] | None = None


def ok(data: Any) -> dict:
    return {"success": True, "data": data, "error": None}


class TokenPair(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    role: UserRole
    expires_in: int


class StudentRegisterIn(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8, max_length=128)
    full_name: str = Field(min_length=2, max_length=200)
    student_id: str = Field(min_length=2, max_length=64)
    program: str | None = None
    year_of_study: int | None = Field(default=None, ge=1, le=8)



class LoginIn(BaseModel):
    email: str
    password: str
    portal: UserRole = Field(
        description="Requested portal. Must match the account's stored role; never grants extra privileges."
    )

    @field_validator("email")
    @classmethod
    def validate_login_email(cls, value: str) -> str:
        value = value.strip().lower()
        if not re.fullmatch(r"[^@\s]+@[^@\s]+\.[^@\s]+", value):
            raise ValueError("Please enter a valid email address")
        return value



class RefreshIn(BaseModel):
    refresh_token: str


class ProfileUpdateIn(BaseModel):
    full_name: str | None = Field(default=None, min_length=2, max_length=200)
    phone: str | None = Field(default=None, max_length=32)
    timezone: str | None = Field(default=None, max_length=64)


class TaskCreateIn(BaseModel):
    title: str = Field(min_length=1, max_length=255)
    notes: str | None = None
    subject_id: int | None = None
    due_at: datetime | None = None


class TaskUpdateIn(BaseModel):
    title: str | None = None
    notes: str | None = None
    status: str | None = None
    due_at: datetime | None = None


class GoalCreateIn(BaseModel):
    title: str = Field(min_length=1, max_length=255)
    target_cgpa: float | None = Field(default=None, ge=0, le=10)
    target_date: datetime | None = None


class NoteCreateIn(BaseModel):
    title: str
    body: str
    subject_id: int | None = None


class MaterialCreateIn(BaseModel):
    title: str
    url: str | None = None
    subject_id: int | None = None


class CoachMessageIn(BaseModel):
    message: str = Field(min_length=1, max_length=8000)
    conversation_id: int | None = None


class AttendanceItemIn(BaseModel):
    student_id: int
    status: str = Field(pattern="^(present|absent|late|excused)$")


class AttendanceBulkIn(BaseModel):
    subject_id: int
    section_id: int
    session_date: date
    records: list[AttendanceItemIn]


class AssignmentCreateIn(BaseModel):
    subject_id: int
    section_id: int
    title: str
    description: str | None = None
    due_at: datetime
    max_marks: float = Field(gt=0)


class SubmissionIn(BaseModel):
    content: str = Field(min_length=1)


class EvaluateIn(BaseModel):
    score: float = Field(ge=0)
    feedback: str | None = None


class ExamCreateIn(BaseModel):
    subject_id: int
    section_id: int
    title: str
    exam_date: date
    max_marks: float = Field(gt=0)
    venue: str | None = None


class MarkIn(BaseModel):
    exam_id: int
    student_id: int
    obtained: float = Field(ge=0)


class AnnouncementIn(BaseModel):
    section_id: int
    subject_id: int | None = None
    title: str
    body: str


class UserOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    email: EmailStr
    role: UserRole
    timezone: str
    is_active: bool
