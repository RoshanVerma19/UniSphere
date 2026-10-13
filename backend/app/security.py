from datetime import datetime, timedelta, timezone
from hashlib import sha256
import secrets

import bcrypt
import jwt
from jwt import InvalidTokenError

from app.config import get_settings

ACCESS_TYP = "access"
REFRESH_TYP = "refresh"


def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt(rounds=12)).decode("utf-8")


def verify_password(password: str, hashed: str) -> bool:
    try:
        return bcrypt.checkpw(password.encode("utf-8"), hashed.encode("utf-8"))
    except ValueError:
        return False


def hash_token(raw: str) -> str:
    return sha256(raw.encode("utf-8")).hexdigest()


def create_access_token(user_id: int) -> str:
    settings = get_settings()
    now = datetime.now(timezone.utc)
    payload = {
        "sub": str(user_id),
        "typ": ACCESS_TYP,
        "iat": int(now.timestamp()),
        "exp": int((now + timedelta(minutes=settings.access_token_expire_minutes)).timestamp()),
    }
    return jwt.encode(payload, settings.secret_key, algorithm=settings.algorithm)


def create_refresh_token_value() -> str:
    return secrets.token_urlsafe(48)


def decode_token(token: str, expected_typ: str = ACCESS_TYP) -> dict:
    settings = get_settings()
    try:
        payload = jwt.decode(
            token,
            settings.secret_key,
            algorithms=[settings.algorithm],
        )
    except InvalidTokenError as exc:
        raise ValueError("Invalid or expired token") from exc
    if payload.get("typ") != expected_typ:
        raise ValueError("Wrong token type")
    return payload
