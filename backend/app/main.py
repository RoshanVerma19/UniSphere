import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI, HTTPException, Request
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from sqlalchemy.exc import IntegrityError

from app import models  # noqa: F401  — register metadata
from app.config import get_settings
from app.db import Base, SessionLocal, engine
from app.limiter import limiter
from app.api.v1 import auth, coach, faculty, students

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s %(levelname)s %(name)s %(message)s",
)
logger = logging.getLogger("unisphere")
# Avoid leaking secrets in logs: do not log request bodies on auth routes.
logging.getLogger("uvicorn.access").setLevel(logging.INFO)

settings = get_settings()


@asynccontextmanager
async def lifespan(app: FastAPI):
    Base.metadata.create_all(bind=engine)
    settings.upload_path.mkdir(parents=True, exist_ok=True)
    scheduler = None
    if settings.enable_scheduler and settings.environment != "test":
        from apscheduler.schedulers.background import BackgroundScheduler
        from app.services.notifications import generate_reminders

        scheduler = BackgroundScheduler(timezone=settings.reminder_timezone)
        scheduler.add_job(
            lambda: generate_reminders(SessionLocal()),
            "interval",
            minutes=30,
            id="reminders",
            replace_existing=True,
        )
        scheduler.start()
        logger.info("Reminder scheduler started (every 30 minutes, tz=%s)", settings.reminder_timezone)
    yield
    if scheduler:
        scheduler.shutdown(wait=False)


app = FastAPI(
    title=settings.app_name,
    version="0.1.0",
    description="UniSphere — AI-powered college super app backend",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc",
)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.exception_handler(HTTPException)
async def http_exc(_request: Request, exc: HTTPException):
    return JSONResponse(
        status_code=exc.status_code,
        content={"success": False, "data": None, "error": {"message": exc.detail, "code": exc.status_code}},
    )


@app.exception_handler(RequestValidationError)
async def validation_exc(_request: Request, exc: RequestValidationError):
    return JSONResponse(
        status_code=422,
        content={"success": False, "data": None, "error": {"message": "Validation failed", "details": exc.errors()}},
    )


@app.exception_handler(IntegrityError)
async def integrity_exc(_request: Request, exc: IntegrityError):
    logger.warning("integrity_error")
    return JSONResponse(
        status_code=409,
        content={"success": False, "data": None, "error": {"message": "Duplicate or constraint violation"}},
    )


@app.exception_handler(Exception)
async def unhandled(_request: Request, exc: Exception):
    logger.exception("unhandled_error")
    return JSONResponse(
        status_code=500,
        content={"success": False, "data": None, "error": {"message": "Internal server error"}},
    )


@app.get("/api/health", tags=["system"])
def health():
    return {
        "success": True,
        "data": {
            "status": "ok",
            "app": settings.app_name,
            "environment": settings.environment,
            "ai_provider_configured": settings.ai_provider_configured,
        },
        "error": None,
    }


app.include_router(auth.router)
app.include_router(students.router)
app.include_router(faculty.router)
app.include_router(coach.router)
