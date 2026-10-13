from app.models import FacultyProfile, User, UserRole
from app.security import hash_password


def register(client, email="stu@example.com", student_id="S1"):
    return client.post(
        "/api/v1/auth/register",
        json={
            "email": email,
            "password": "password123",
            "full_name": "Test Student",
            "student_id": student_id,
        },
    )


def test_health(client):
    r = client.get("/api/health")
    assert r.status_code == 200
    body = r.json()
    assert body["success"] is True
    assert body["data"]["status"] == "ok"
    assert body["data"]["ai_provider_configured"] is False


def test_student_register_and_login(client):
    r = register(client)
    assert r.status_code == 201
    assert r.json()["data"]["user"]["role"] == "student"
    login = client.post(
        "/api/v1/auth/login",
        json={"email": "stu@example.com", "password": "password123", "portal": "student"},
    )
    assert login.status_code == 200
    token = login.json()["data"]["access_token"]
    me = client.get("/api/v1/auth/me", headers={"Authorization": f"Bearer {token}"})
    assert me.status_code == 200
    assert me.json()["data"]["role"] == "student"


def test_student_cannot_use_faculty_portal(client):
    register(client)
    login = client.post(
        "/api/v1/auth/login",
        json={"email": "stu@example.com", "password": "password123", "portal": "faculty"},
    )
    assert login.status_code == 403
    assert "not authorized" in login.json()["error"]["message"].lower()


def test_student_blocked_from_faculty_routes(client):
    r = register(client)
    token = r.json()["data"]["tokens"]["access_token"]
    resp = client.get("/api/v1/faculty/profile", headers={"Authorization": f"Bearer {token}"})
    assert resp.status_code == 403


def test_faculty_cannot_read_student_private_routes(client, db_session):
    user = User(
        email="fac@example.com",
        hashed_password=hash_password("password123"),
        role=UserRole.faculty,
        is_active=True,
    )
    db_session.add(user)
    db_session.flush()
    db_session.add(
        FacultyProfile(user_id=user.id, employee_id="E1", full_name="Fac")
    )
    db_session.commit()
    login = client.post(
        "/api/v1/auth/login",
        json={"email": "fac@example.com", "password": "password123", "portal": "faculty"},
    )
    assert login.status_code == 200
    token = login.json()["data"]["access_token"]
    resp = client.get("/api/v1/student/profile", headers={"Authorization": f"Bearer {token}"})
    assert resp.status_code == 403


def test_students_isolated(client):
    a = register(client, email="a@example.com", student_id="A1")
    b = register(client, email="b@example.com", student_id="B1")
    token_a = a.json()["data"]["tokens"]["access_token"]
    token_b = b.json()["data"]["tokens"]["access_token"]
    client.post(
        "/api/v1/student/notes",
        headers={"Authorization": f"Bearer {token_a}"},
        json={"title": "secret", "body": "private"},
    )
    notes_b = client.get("/api/v1/student/notes", headers={"Authorization": f"Bearer {token_b}"})
    assert notes_b.status_code == 200
    assert notes_b.json()["data"] == []


def test_invalid_login(client):
    r = client.post(
        "/api/v1/auth/login",
        json={"email": "none@example.com", "password": "nope12345", "portal": "student"},
    )
    assert r.status_code == 401
