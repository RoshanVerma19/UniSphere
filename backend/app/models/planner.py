from __future__ import annotations

import enum
from datetime import datetime

from sqlalchemy import Boolean, DateTime, Enum, Float, ForeignKey, Integer, String, Text, UniqueConstraint, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db import Base


class TaskStatus(str, enum.Enum):
    pending = "pending"
    in_progress = "in_progress"
    completed = "completed"


class StudyTask(Base):
    __tablename__ = "study_tasks"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    student_id: Mapped[int] = mapped_column(ForeignKey("student_profiles.id"), nullable=False, index=True)
    subject_id: Mapped[int | None] = mapped_column(ForeignKey("subjects.id"))
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    notes: Mapped[str | None] = mapped_column(Text)
    status: Mapped[TaskStatus] = mapped_column(Enum(TaskStatus, native_enum=False), default=TaskStatus.pending, nullable=False)
    due_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    source: Mapped[str] = mapped_column(String(32), default="manual")  # manual | coach
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    completed_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))


class TimetableEntry(Base):
    __tablename__ = "timetable_entries"
    __table_args__ = (UniqueConstraint("section_id", "day_of_week", "start_time"),)

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    section_id: Mapped[int] = mapped_column(ForeignKey("class_sections.id"), nullable=False)
    subject_id: Mapped[int] = mapped_column(ForeignKey("subjects.id"), nullable=False)
    faculty_id: Mapped[int | None] = mapped_column(ForeignKey("faculty_profiles.id"))
    day_of_week: Mapped[int] = mapped_column(Integer, nullable=False)  # 0=Mon
    start_time: Mapped[str] = mapped_column(String(8), nullable=False)  # HH:MM
    end_time: Mapped[str] = mapped_column(String(8), nullable=False)
    room: Mapped[str | None] = mapped_column(String(64))


class AcademicGoal(Base):
    __tablename__ = "academic_goals"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    student_id: Mapped[int] = mapped_column(ForeignKey("student_profiles.id"), nullable=False)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    target_cgpa: Mapped[float | None] = mapped_column(Float)
    target_date: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    student: Mapped["StudentProfile"] = relationship(back_populates="goals")


class StudyMaterial(Base):
    __tablename__ = "study_materials"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    student_id: Mapped[int] = mapped_column(ForeignKey("student_profiles.id"), nullable=False)
    subject_id: Mapped[int | None] = mapped_column(ForeignKey("subjects.id"))
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    url: Mapped[str | None] = mapped_column(String(500))
    file_path: Mapped[str | None] = mapped_column(String(500))
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())


class Note(Base):
    __tablename__ = "notes"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    student_id: Mapped[int] = mapped_column(ForeignKey("student_profiles.id"), nullable=False)
    subject_id: Mapped[int | None] = mapped_column(ForeignKey("subjects.id"))
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    body: Mapped[str] = mapped_column(Text, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
