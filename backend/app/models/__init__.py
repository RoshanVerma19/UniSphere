from app.models.academic import (
    Assessment,
    Assignment,
    AttendanceRecord,
    ClassSection,
    Course,
    Enrollment,
    Exam,
    FacultyAssignment,
    Mark,
    Semester,
    Subject,
    Submission,
)
from app.models.coach import CoachConversation, CoachMessage
from app.models.comms import Announcement, Notification, RefreshToken
from app.models.org import Campus, Department, University
from app.models.planner import AcademicGoal, Note, StudyMaterial, StudyTask, TimetableEntry
from app.models.user import FacultyProfile, StudentProfile, User, UserRole

__all__ = [
    "Assessment",
    "Assignment",
    "AttendanceRecord",
    "ClassSection",
    "Course",
    "Enrollment",
    "Exam",
    "FacultyAssignment",
    "Mark",
    "Semester",
    "Subject",
    "Submission",
    "CoachConversation",
    "CoachMessage",
    "Announcement",
    "Notification",
    "RefreshToken",
    "Campus",
    "Department",
    "University",
    "AcademicGoal",
    "Note",
    "StudyMaterial",
    "StudyTask",
    "TimetableEntry",
    "FacultyProfile",
    "StudentProfile",
    "User",
    "UserRole",
]
