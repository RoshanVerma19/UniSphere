# UniSphere Backend

Secure FastAPI backend for **UniSphere** — student and faculty portals, academic records, and an AI Success Coach.

There was no existing UniSphere repository on this machine, so this backend was created as `unisphere-backend` (backend-only). Roles are stored on the server; selecting Faculty Login never grants faculty privileges.

## Local setup

```powershell
cd $env:USERPROFILE\unisphere-backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
copy .env.example .env
# Edit SECRET_KEY in .env before using anything beyond local demos
uvicorn app.main:app --reload --port 8000
python -m app.seed
```

- API docs: http://127.0.0.1:8000/docs
- Health: http://127.0.0.1:8000/api/health

Demo accounts after seed:

- `student@unisphere.local` / `StudentPass123` (portal: `student`)
- `faculty@unisphere.local` / `FacultyPass123` (portal: `faculty`)

## Frontend integration

Point the client at `http://127.0.0.1:8000`. Send `Authorization: Bearer <access_token>`. CORS origins come from `CORS_ORIGINS` (default Vite/React local ports). Envelope:

```json
{ "success": true, "data": {}, "error": null }
```

Login body must include `portal`: `"student"` or `"faculty"`. If it does not match the account’s stored role, the API returns **403**.

## Auth

- Student self-registration: `POST /api/v1/auth/register`
- Login: `POST /api/v1/auth/login`
- Refresh (rotated): `POST /api/v1/auth/refresh`
- Current user: `GET /api/v1/auth/me`
- Passwords: bcrypt (cost 12)
- Access JWT: user id only (`sub` + `typ`); role is loaded from the database on every request
- Access token TTL: 15 minutes (configurable)

Faculty accounts are not self-registered (seed or administrative insert).

## AI Success Coach

If `OPENAI_API_KEY` is set, the backend calls that provider. Otherwise it uses a **rule-based** coach and the response includes `"provider": "rule_based"` and `"ai_provider_configured": false`. Keys never leave the server.

CGPA is credit-weighted on a 10-point scale from exam percentages. Subjects without marks are excluded, not guessed. Assumptions are returned on analytics/coach payloads.

## Database

SQLite by default (`DATABASE_URL=sqlite:///./unisphere.db`). Swap to PostgreSQL with a SQLAlchemy URL such as `postgresql+psycopg://user:pass@localhost:5432/unisphere`. Tables are created on startup; Alembic is configured (`alembic revision --autogenerate -m "msg"`).

## Tests

```powershell
.\.venv\Scripts\pytest.exe -q
```

## Security notes

- Protected routes enforce `User.role` from the database
- Students only see their own notes, planner, coach history, and marks
- Faculty attendance/marks/assignments require a `faculty_assignments` row for that subject and section
- Auth endpoints are rate-limited
- Uploads are extension- and size-checked
