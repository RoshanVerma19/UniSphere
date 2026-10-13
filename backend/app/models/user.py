from __future__ import annotations

import enum
from datetime import datetime

from sqlalchemy import Boolean, DateTime, Enum, ForeignKey, Integer, String, UniqueConstraint, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db import Base


class UserRole(str, enum.Enum):
    student = "student"
    faculty = "faculty"


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True, nullable=False)
    hashed_password: Mapped[str] = mapped_column(String(255), nullable=False)
    role: Mapped[UserRole] = mapped_column(Enum(UserRole, native_enum=False), nullable=False, index=True)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    timezone: Mapped[str] = mapped_column(String(64), default="Asia/Kolkata", nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )

    student_profile: Mapped[StudentProfile | None] = relationship(back_populates="user", uselist=False)
    faculty_profile: Mapped[FacultyProfile | None] = relationship(back_populates="user", uselist=False)
    refresh_tokens: Mapped[list["RefreshToken"]] = relationship(back_populates="user")


class StudentProfile(Base):
    __tablename__ = "student_profiles"
    __table_args__ = (UniqueConstraint("user_id"), UniqueConstraint("university_id", "student_id"))

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    university_id: Mapped[int | None] = mapped_column(ForeignKey("universities.id"))
    campus_id: Mapped[int | None] = mapped_column(ForeignKey("campuses.id"))
    course_id: Mapped[int | None] = mapped_column(ForeignKey("courses.id"))
    section_id: Mapped[int | None] = mapped_column(ForeignKey("class_sections.id"))
    student_id: Mapped[str] = mapped_column(String(64), nullable=False, index=True)
    full_name: Mapped[str] = mapped_column(String(200), nullable=False)
    program: Mapped[str | None] = mapped_column(String(200))
    year_of_study: Mapped[int | None] = mapped_column(Integer)
    phone: Mapped[str | None] = mapped_column(String(32))

    user: Mapped[User] = relationship(back_populates="student_profile")
    enrollments: Mapped[list["Enrollment"]] = relationship(back_populates="student")
    goals: Mapped[list["AcademicGoal"]] = relationship(back_populates="student")


class FacultyProfile(Base):
    __tablename__ = "faculty_profiles"
    __table_args__ = (UniqueConstraint("user_id"), UniqueConstraint("employee_id"))

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    university_id: Mapped[int | None] = mapped_column(ForeignKey("universities.id"))
    campus_id: Mapped[int | None] = mapped_column(ForeignKey("campuses.id"))
    department_id: Mapped[int | None] = mapped_column(ForeignKey("departments.id"))
    employee_id: Mapped[str] = mapped_column(String(64), nullable=False, index=True)
    full_name: Mapped[str] = mapped_column(String(200), nullable=False)
    designation: Mapped[str | None] = mapped_column(String(120))
    phone: Mapped[str | None] = mapped_column(String(32))

    user: Mapped[User] = relationship(back_populates="faculty_profile")
    assignments: Mapped[list["FacultyAssignment"]] = relationship(back_populates="faculty")
