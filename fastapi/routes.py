from fastapi import APIRouter, HTTPException, Depends
from models import User, UserCreate, UserLogin
from database import *
from tables import users_table
from hash import hash_password, verify_password
from auth.auth_handler import create_access_token, get_current_user

router = APIRouter()

@router.get("/users")
async def get_users():
    query = users_table.select()
    results = await database.fetch_all(query)
    return results

@router.post("/users")
async def create_user(user: User):
    query = "INSERT INTO users (username, password_hash, email) VALUES (:username, :password_hash, :email)"
    values = {"username": user.username, "password_hash":user.password_hash, "email": user.email}
    await database.execute(query, values)
    return {"message": "User created successfully"}

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

    # Generate a valid JWT token for the user
    access_token = create_access_token(data={"sub": user.username})

    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/me")
def read_current_user(current_user: str = Depends(get_current_user)):
    return {"current_user": current_user}
