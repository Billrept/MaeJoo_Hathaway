from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session
from .auth_handler import get_password_hash
from app.database import get_db_connection
import logging

router = APIRouter()

class UserSignup(BaseModel):
    username: str
    email: str
    password: str

@router.post("/signup")
def signup(user: UserSignup, db: Session = Depends(get_db_connection)):
    try:
        # Check if the email is already registered
        check_user_query = "SELECT * FROM users WHERE email = :email"
        result = db.execute(check_user_query, {"email": user.email}).fetchone()

        if result:
            raise HTTPException(status_code=400, detail="Email already registered")
        
        # Hash the password
        hashed_password = get_password_hash(user.password)
        
        # Insert the new user into the PostgreSQL database using a raw SQL query
        insert_user_query = """
        INSERT INTO users (username, email, password_hash) 
        VALUES (:username, :email, :password_hash)
        RETURNING id, username, email;
        """
        result = db.execute(insert_user_query, {
            "username": user.username,
            "email": user.email,
            "password_hash": hashed_password
        }).fetchone()

        db.commit()

        return {"message": "User created successfully", "user": result}

    except Exception as e:
        db.rollback()
        logging.error(f"Error occurred during user signup: {str(e)}")  # Log the error
        raise HTTPException(status_code=500, detail="An error occurred while creating the user")
