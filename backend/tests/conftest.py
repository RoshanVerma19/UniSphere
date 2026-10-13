import os

os.environ["SECRET_KEY"] = "test-secret-key-please-change"
os.environ["DATABASE_URL"] = "sqlite:///./test_unisphere.db"
os.environ["ENVIRONMENT"] = "test"
os.environ["ENABLE_SCHEDULER"] = "false"
os.environ["OPENAI_API_KEY"] = ""
os.environ["GEMINI_API_KEY"] = ""

from pathlib import Path

import pytest
from fastapi.testclient import TestClient
from sqlalchemy.orm import sessionmaker

from app.db import Base, engine
from app.main import app

TEST_DB = Path("test_unisphere.db")


@pytest.fixture(autouse=True)
def _reset_db():
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)


@pytest.fixture
def client():
    with TestClient(app) as c:
        yield c


@pytest.fixture
def db_session():
    Session = sessionmaker(bind=engine)
    s = Session()
    try:
        yield s
    finally:
        s.close()
