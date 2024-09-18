import pytest
from fastapi.testclient import TestClient
from main import app
from database import get_db_connection, create_tables

# Create a TestClient to simulate API requests
client = TestClient(app)

# Set up the test database
@pytest.fixture(scope="module", autouse=True)
def setup_database():
    # Create tables if they don't exist
    create_tables()

    # Optional: Clear any existing users (for fresh testing)
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("DELETE FROM users;")  # Assuming there's a 'users' table
    conn.commit()
    cur.close()
    conn.close()

def test_create_user():
    # Define the request payload
    user_data = {
        "username": "testuser",
        "first_name": "Test",
        "last_name": "User",
        "password": "testpassword"
    }

    # Send a POST request to the signup endpoint
    response = client.post("/auth/signup", json=user_data)

    # Ensure the response status code is 200 (OK)
    assert response.status_code == 200

    # Ensure the response body contains a success message
    assert response.json() == {"msg": "User created successfully"}

def test_login_user():
    # Define the request payload for login
    login_data = {
        "username": "testuser",
        "password": "testpassword"
    }

    # Send a POST request to the login endpoint
    response = client.post("/auth/login", json=login_data)

    # Ensure the response status code is 200 (OK)
    assert response.status_code == 200

    # Ensure the response contains an access token
    response_data = response.json()
    assert "access_token" in response_data
    assert response_data["token_type"] == "bearer"

def test_login_invalid_user():
    # Attempt to log in with incorrect credentials
    login_data = {
        "username": "invaliduser",
        "password": "wrongpassword"
    }

    # Send a POST request to the login endpoint
    response = client.post("/auth/login", json=login_data)

    # Ensure the response status code is 400 (Bad Request)
    assert response.status_code == 400

    # Ensure the response contains an error message
    assert response.json() == {"detail": "Incorrect username or password"}