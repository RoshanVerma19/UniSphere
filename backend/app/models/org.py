from __future__ import annotations

from sqlalchemy import ForeignKey, Integer, String, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db import Base


class University(Base):
    __tablename__ = "universities"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    name: Mapped[str] = mapped_column(String(255), unique=True, nullable=False)
    code: Mapped[str] = mapped_column(String(32), unique=True, nullable=False)

    campuses: Mapped[list[Campus]] = relationship(back_populates="university")


class Campus(Base):
    __tablename__ = "campuses"
    __table_args__ = (UniqueConstraint("university_id", "code"),)

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    university_id: Mapped[int] = mapped_column(ForeignKey("universities.id"), nullable=False)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    code: Mapped[str] = mapped_column(String(32), nullable=False)
    city: Mapped[str | None] = mapped_column(String(120))

    university: Mapped[University] = relationship(back_populates="campuses")
    departments: Mapped[list[Department]] = relationship(back_populates="campus")


class Department(Base):
    __tablename__ = "departments"
    __table_args__ = (UniqueConstraint("campus_id", "code"),)

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    campus_id: Mapped[int] = mapped_column(ForeignKey("campuses.id"), nullable=False)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    code: Mapped[str] = mapped_column(String(32), nullable=False)

    campus: Mapped[Campus] = relationship(back_populates="departments")
