from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session
from .auth_handler import get_password_hash, verify_password, create_access_token
from app.database import get_db_connection
from app.crud.user import create_user, get_user_by_username

router = APIRouter()

class UserSignup(BaseModel):
    username: str
    email: str
    password: str

class UserLogin(BaseModel):
    username: str
    password: str

@router.post("/signup")
def signup(user: UserSignup, db: Session = Depends(get_db_connection)):
    hashed_password = get_password_hash(user.password)
    new_user = create_user(db, username=user.username, email=user.email, hashed_password=hashed_password)
    return {"message": "User created successfully", "user": new_user}

@router.post("/login")
def login(user: UserLogin, conn = Depends(get_db_connection)):

    db_user = get_user_by_username(conn, user.username)
    
    if not db_user:
        raise HTTPException(status_code=400, detail="Invalid username or password")
    
    user_id, username, email, password_hash = db_user
    
    # Verify the password
    if not verify_password(user.password, password_hash):
        raise HTTPException(status_code=400, detail="Invalid username or password")
    
    # Generate JWT Token
    access_token = create_access_token(data={"sub": username})
    
    return {"access_token": access_token, "token_type": "bearer"}

