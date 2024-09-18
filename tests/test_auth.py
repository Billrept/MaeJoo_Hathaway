from fastapi.testclient import TestClient
from app.main import app
from sqlalchemy.orm import Session
from app.database import get_db
from app.auth.models import User
from app.crud.user import create_user, get_user_by_username
import pytest

client = TestClient(app)

# Helper function to create a user in the test database
def create_test_user(db: Session):
    hashed_password = "$2b$12$KIXf.QHSZZqMQsDiSdyKlO.kASLRnhRhY3jJvOPBlbAGDoZw6FytO"  # bcrypt hash for 'testpassword'
    user = get_user_by_username(db, "testuser")
    if not user:
        user = create_user(db, "testuser", "Test", "User", hashed_password)
    return user

@pytest.fixture(scope="module")
def test_db():
    # Create a test database connection here, such as an in-memory SQLite database
    db = Session()  # replace with actual test database connection
    yield db
    db.close()

def test_signup(test_db):
    response = client.post("/auth/signup", json={
        "username": "newuser",
        "first_name": "New",
        "last_name": "User",
        "password": "newpassword123"
    })
    assert response.status_code == 200
    assert response.json() == {"msg": "User created successfully"}

def test_login(test_db):
    # Create a test user directly in the database to simulate a login scenario
    create_test_user(test_db)

    response = client.post("/auth/login", json={
        "username": "testuser",
        "password": "testpassword"  # This should match the hashed password
    })
    assert response.status_code == 200
    json_response = response.json()
    assert "access_token" in json_response
    assert json_response["token_type"] == "bearer"

def test_protected_route(test_db):
    # First login and get the access token
    response = client.post("/auth/login", json={
        "username": "testuser",
        "password": "testpassword"
    })
    token = response.json()["access_token"]

    # Access a protected route using the token
    headers = {"Authorization": f"Bearer {token}"}
    response = client.get("/users/me", headers=headers)

    assert response.status_code == 200
    assert response.json() == {"username": "testuser"}

def test_invalid_token():
    # Test access to a protected route with an invalid token
    headers = {"Authorization": "Bearer invalidtoken"}
    response = client.get("/users/me", headers=headers)
    
    assert response.status_code == 403
    assert response.json() == {"detail": "Could not validate credentials"}