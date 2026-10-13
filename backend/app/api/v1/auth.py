from datetime import datetime, timedelta, timezone

from fastapi import APIRouter, Depends, HTTPException, Request, status
from sqlalchemy.orm import Session

from app.config import get_settings
from app.db import get_db
from app.deps import get_current_user
from app.limiter import limiter
from app.models import RefreshToken, StudentProfile, User, UserRole
from app.schemas import LoginIn, RefreshIn, StudentRegisterIn, UserOut, ok
from app.security import (
    create_access_token,
    create_refresh_token_value,
    hash_password,
    hash_token,
    verify_password,
)

router = APIRouter(prefix="/api/v1/auth", tags=["auth"])
settings = get_settings()


def _issue_tokens(db: Session, user: User) -> dict:
    access = create_access_token(user.id)
    raw_refresh = create_refresh_token_value()
    expires = datetime.now(timezone.utc) + timedelta(days=settings.refresh_token_expire_days)
    db.add(
        RefreshToken(
            user_id=user.id,
            token_hash=hash_token(raw_refresh),
            expires_at=expires,
            revoked=False,
        )
    )
    db.commit()
    return {
        "access_token": access,
        "refresh_token": raw_refresh,
        "token_type": "bearer",
        "role": user.role.value,
        "expires_in": settings.access_token_expire_minutes * 60,
    }


@router.post("/register", status_code=status.HTTP_201_CREATED)
@limiter.limit(settings.auth_rate_limit)
def register_student(request: Request, body: StudentRegisterIn, db: Session = Depends(get_db)):
    if db.query(User).filter(User.email == str(body.email).lower()).one_or_none():
        raise HTTPException(status_code=409, detail="Email already registered")
    if db.query(StudentProfile).filter(StudentProfile.student_id == body.student_id).one_or_none():
        raise HTTPException(status_code=409, detail="Student ID already registered")
    user = User(
        email=str(body.email).lower(),
        hashed_password=hash_password(body.password),
        role=UserRole.student,
        is_active=True,
    )
    db.add(user)
    db.flush()
    db.add(
        StudentProfile(
            user_id=user.id,
            student_id=body.student_id,
            full_name=body.full_name,
            program=body.program,
            year_of_study=body.year_of_study,
        )
    )
    db.commit()
    db.refresh(user)
    tokens = _issue_tokens(db, user)
    return ok({"user": UserOut.model_validate(user).model_dump(), "tokens": tokens})


@router.post("/login")
@limiter.limit(settings.auth_rate_limit)
def login(request: Request, body: LoginIn, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == str(body.email).lower()).one_or_none()
    if user is None or not verify_password(body.password, user.hashed_password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
    if not user.is_active:
        raise HTTPException(status_code=403, detail="Account disabled")
    if user.role != body.portal:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=(
                "This account is not authorized for the selected portal. "
                "Role is stored on the server and cannot be changed by Faculty Login."
            ),
        )
    return ok(_issue_tokens(db, user))


@router.post("/refresh")
def refresh(body: RefreshIn, db: Session = Depends(get_db)):
    token_h = hash_token(body.refresh_token)
    row = db.query(RefreshToken).filter(RefreshToken.token_hash == token_h).one_or_none()
    now = datetime.now(timezone.utc)
    if row is None or row.revoked or row.expires_at.replace(tzinfo=timezone.utc) < now:
        raise HTTPException(status_code=401, detail="Invalid refresh token")
    row.revoked = True
    user = db.get(User, row.user_id)
    if user is None or not user.is_active:
        raise HTTPException(status_code=401, detail="User unavailable")
    db.commit()
    return ok(_issue_tokens(db, user))


@router.post("/logout")
def logout(body: RefreshIn, db: Session = Depends(get_db)):
    token_h = hash_token(body.refresh_token)
    row = db.query(RefreshToken).filter(RefreshToken.token_hash == token_h).one_or_none()
    if row:
        row.revoked = True
        db.commit()
    return ok({"logged_out": True})


@router.get("/me")
def me(user: User = Depends(get_current_user)):
    return ok(UserOut.model_validate(user).model_dump())
