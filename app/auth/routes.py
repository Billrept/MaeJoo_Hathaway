from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from auth.auth_handler import create_access_token, get_password_hash, verify_password
from database import get_db
from auth.models import User
from crud.user import get_user_by_username, create_user

router = APIRouter()

@router.post("/signup")
def signup(username: str, first_name: str, last_name: str, password: str, db: Session = Depends(get_db)):
    user = get_user_by_username(db, username)
    if user:
        raise HTTPException(status_code=400, detail="Username already taken")
    
    hashed_password = get_password_hash(password)
    create_user(db, username, first_name, last_name, hashed_password)
    return {"msg": "User created successfully"}

@router.post("/login")
def login(username: str, password: str, db: Session = Depends(get_db)):
    user = get_user_by_username(db, username)
    if not user or not verify_password(password, user.hashed_password):
        raise HTTPException(status_code=400, detail="Incorrect username or password")
    
    access_token = create_access_token(data={"sub": user.username})
    return {"access_token": access_token, "token_type": "bearer"}