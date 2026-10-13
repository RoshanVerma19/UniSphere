from __future__ import annotations

import enum
from datetime import date, datetime

from sqlalchemy import (
    Boolean,
    CheckConstraint,
    Date,
    DateTime,
    Enum,
    Float,
    ForeignKey,
    Integer,
    String,
    Text,
    UniqueConstraint,
    func,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db import Base


class AttendanceStatus(str, enum.Enum):
    present = "present"
    absent = "absent"
    late = "late"
    excused = "excused"


class Course(Base):
    __tablename__ = "courses"
    __table_args__ = (UniqueConstraint("university_id", "code"),)

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    university_id: Mapped[int] = mapped_column(ForeignKey("universities.id"), nullable=False)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    code: Mapped[str] = mapped_column(String(32), nullable=False)
    duration_years: Mapped[int] = mapped_column(Integer, default=4)

    semesters: Mapped[list[Semester]] = relationship(back_populates="course")


class Semester(Base):
    __tablename__ = "semesters"
    __table_args__ = (UniqueConstraint("course_id", "number"),)

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    course_id: Mapped[int] = mapped_column(ForeignKey("courses.id"), nullable=False)
    number: Mapped[int] = mapped_column(Integer, nullable=False)
    name: Mapped[str] = mapped_column(String(120), nullable=False)
    start_date: Mapped[date | None] = mapped_column(Date)
    end_date: Mapped[date | None] = mapped_column(Date)

    course: Mapped[Course] = relationship(back_populates="semesters")
    sections: Mapped[list[ClassSection]] = relationship(back_populates="semester")
    subjects: Mapped[list[Subject]] = relationship(back_populates="semester")


class ClassSection(Base):
    __tablename__ = "class_sections"
    __table_args__ = (UniqueConstraint("semester_id", "name"),)

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    semester_id: Mapped[int] = mapped_column(ForeignKey("semesters.id"), nullable=False)
    name: Mapped[str] = mapped_column(String(32), nullable=False)

    semester: Mapped[Semester] = relationship(back_populates="sections")


class Subject(Base):
    __tablename__ = "subjects"
    __table_args__ = (UniqueConstraint("semester_id", "code"),)

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    semester_id: Mapped[int] = mapped_column(ForeignKey("semesters.id"), nullable=False)
    code: Mapped[str] = mapped_column(String(32), nullable=False)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    credits: Mapped[float] = mapped_column(Float, nullable=False, default=3.0)

    semester: Mapped[Semester] = relationship(back_populates="subjects")
    enrollments: Mapped[list[Enrollment]] = relationship(back_populates="subject")
    faculty_assignments: Mapped[list[FacultyAssignment]] = relationship(back_populates="subject")


class Enrollment(Base):
    __tablename__ = "enrollments"
    __table_args__ = (UniqueConstraint("student_id", "subject_id"),)

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    student_id: Mapped[int] = mapped_column(ForeignKey("student_profiles.id"), nullable=False)
    subject_id: Mapped[int] = mapped_column(ForeignKey("subjects.id"), nullable=False)
    section_id: Mapped[int] = mapped_column(ForeignKey("class_sections.id"), nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    student: Mapped["StudentProfile"] = relationship(back_populates="enrollments")
    subject: Mapped[Subject] = relationship(back_populates="enrollments")
    section: Mapped[ClassSection] = relationship()


class FacultyAssignment(Base):
    __tablename__ = "faculty_assignments"
    __table_args__ = (UniqueConstraint("faculty_id", "subject_id", "section_id"),)

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    faculty_id: Mapped[int] = mapped_column(ForeignKey("faculty_profiles.id"), nullable=False)
    subject_id: Mapped[int] = mapped_column(ForeignKey("subjects.id"), nullable=False)
    section_id: Mapped[int] = mapped_column(ForeignKey("class_sections.id"), nullable=False)

    faculty: Mapped["FacultyProfile"] = relationship(back_populates="assignments")
    subject: Mapped[Subject] = relationship(back_populates="faculty_assignments")
    section: Mapped[ClassSection] = relationship()


class AttendanceRecord(Base):
    __tablename__ = "attendance_records"
    __table_args__ = (
        UniqueConstraint("student_id", "subject_id", "session_date"),
        CheckConstraint("status IN ('present','absent','late','excused')", name="ck_attendance_status"),
    )

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    student_id: Mapped[int] = mapped_column(ForeignKey("student_profiles.id"), nullable=False)
    subject_id: Mapped[int] = mapped_column(ForeignKey("subjects.id"), nullable=False)
    section_id: Mapped[int] = mapped_column(ForeignKey("class_sections.id"), nullable=False)
    marked_by_faculty_id: Mapped[int] = mapped_column(ForeignKey("faculty_profiles.id"), nullable=False)
    session_date: Mapped[date] = mapped_column(Date, nullable=False, index=True)
    status: Mapped[AttendanceStatus] = mapped_column(Enum(AttendanceStatus, native_enum=False), nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())


class Assessment(Base):
    """Internal assessment component (quiz, midterm, etc.)."""

    __tablename__ = "assessments"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    subject_id: Mapped[int] = mapped_column(ForeignKey("subjects.id"), nullable=False)
    section_id: Mapped[int] = mapped_column(ForeignKey("class_sections.id"), nullable=False)
    created_by_faculty_id: Mapped[int] = mapped_column(ForeignKey("faculty_profiles.id"), nullable=False)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    max_marks: Mapped[float] = mapped_column(Float, nullable=False)
    weight: Mapped[float] = mapped_column(Float, default=1.0, nullable=False)
    due_date: Mapped[date | None] = mapped_column(Date)


class Exam(Base):
    __tablename__ = "exams"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    subject_id: Mapped[int] = mapped_column(ForeignKey("subjects.id"), nullable=False)
    section_id: Mapped[int] = mapped_column(ForeignKey("class_sections.id"), nullable=False)
    created_by_faculty_id: Mapped[int] = mapped_column(ForeignKey("faculty_profiles.id"), nullable=False)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    exam_date: Mapped[date] = mapped_column(Date, nullable=False)
    max_marks: Mapped[float] = mapped_column(Float, nullable=False)
    venue: Mapped[str | None] = mapped_column(String(255))

    subject: Mapped[Subject] = relationship()


class Mark(Base):
    __tablename__ = "marks"
    __table_args__ = (
        UniqueConstraint("student_id", "exam_id", name="uq_mark_student_exam"),
        CheckConstraint("obtained >= 0", name="ck_mark_nonneg"),
    )

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    student_id: Mapped[int] = mapped_column(ForeignKey("student_profiles.id"), nullable=False)
    exam_id: Mapped[int] = mapped_column(ForeignKey("exams.id"), nullable=False)
    obtained: Mapped[float] = mapped_column(Float, nullable=False)
    recorded_by_faculty_id: Mapped[int] = mapped_column(ForeignKey("faculty_profiles.id"), nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())


class Assignment(Base):
    __tablename__ = "assignments"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    subject_id: Mapped[int] = mapped_column(ForeignKey("subjects.id"), nullable=False)
    section_id: Mapped[int] = mapped_column(ForeignKey("class_sections.id"), nullable=False)
    created_by_faculty_id: Mapped[int] = mapped_column(ForeignKey("faculty_profiles.id"), nullable=False)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str | None] = mapped_column(Text)
    due_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    max_marks: Mapped[float] = mapped_column(Float, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    submissions: Mapped[list[Submission]] = relationship(back_populates="assignment")


class Submission(Base):
    __tablename__ = "submissions"
    __table_args__ = (UniqueConstraint("assignment_id", "student_id"),)

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    assignment_id: Mapped[int] = mapped_column(ForeignKey("assignments.id"), nullable=False)
    student_id: Mapped[int] = mapped_column(ForeignKey("student_profiles.id"), nullable=False)
    content: Mapped[str | None] = mapped_column(Text)
    file_path: Mapped[str | None] = mapped_column(String(500))
    submitted_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    score: Mapped[float | None] = mapped_column(Float)
    feedback: Mapped[str | None] = mapped_column(Text)
    evaluated_by_faculty_id: Mapped[int | None] = mapped_column(ForeignKey("faculty_profiles.id"))
    evaluated_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    is_late: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)

    assignment: Mapped[Assignment] = relationship(back_populates="submissions")
