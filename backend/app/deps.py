from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.orm import Session

from app.db import get_db
from app.models import FacultyProfile, StudentProfile, User, UserRole
from app.security import decode_token

bearer = HTTPBearer(auto_error=False)


def get_current_user(
    creds: HTTPAuthorizationCredentials | None = Depends(bearer),
    db: Session = Depends(get_db),
) -> User:
    if creds is None or creds.scheme.lower() != "bearer":
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authenticated")
    try:
        payload = decode_token(creds.credentials)
        user_id = int(payload["sub"])
    except (ValueError, KeyError, TypeError):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
    user = db.get(User, user_id)
    if user is None or not user.is_active:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User unavailable")
    return user


def require_student(user: User = Depends(get_current_user)) -> User:
    if user.role != UserRole.student:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Student role required")
    return user


def require_faculty(user: User = Depends(get_current_user)) -> User:
    if user.role != UserRole.faculty:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Faculty role required")
    return user


def get_student_profile(
    user: User = Depends(require_student),
    db: Session = Depends(get_db),
) -> StudentProfile:
    profile = db.query(StudentProfile).filter(StudentProfile.user_id == user.id).one_or_none()
    if profile is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Student profile missing")
    return profile


def get_faculty_profile(
    user: User = Depends(require_faculty),
    db: Session = Depends(get_db),
) -> FacultyProfile:
    profile = db.query(FacultyProfile).filter(FacultyProfile.user_id == user.id).one_or_none()
    if profile is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Faculty profile missing")
    return profile
