from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from passlib.context import CryptContext
from database import get_db_connection
import bcrypt
router = APIRouter()

# Password hashing context
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Models for request validation
class UserCreate(BaseModel):
    username: str
    first_name: str
    last_name: str
    password: str

class UserLogin(BaseModel):
    username: str
    password: str

# Utility functions for password hashing
def hash_password(password: str):
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str):
    return pwd_context.verify(plain_password, hashed_password)

# Sign up route
@router.post("/signup")
def signup(user: UserCreate):
    conn = get_db_connection()
    cur = conn.cursor()

    # Check if user already exists
    cur.execute("SELECT * FROM users WHERE username = %s", (user.username,))
    existing_user = cur.fetchone()
    
    if existing_user:
        raise HTTPException(status_code=400, detail="Username already taken")

    # Hash the user's password and insert the new user into the database
    hashed_password = hash_password(user.password)
    cur.execute(
        """
        INSERT INTO users (username, first_name, last_name, hashed_password)
        VALUES (%s, %s, %s, %s)
        """,
        (user.username, user.first_name, user.last_name, hashed_password)
    )
    conn.commit()
    cur.close()
    conn.close()

    return {"msg": "User created successfully"}

# Login route
@router.post("/login")
def login(user: UserLogin):
    conn = get_db_connection()
    cur = conn.cursor()

    # Fetch the user by username
    cur.execute("SELECT username, hashed_password FROM users WHERE username = %s", (user.username,))
    db_user = cur.fetchone()

    cur.close()
    conn.close()

    if not db_user or not verify_password(user.password, db_user[1]):
        raise HTTPException(status_code=400, detail="Incorrect username or password")

    # Generate a token (use JWT in a real system)
    access_token = "fake_token_for_demo"  # Replace with actual JWT generation

    return {"access_token": access_token, "token_type": "bearer"}