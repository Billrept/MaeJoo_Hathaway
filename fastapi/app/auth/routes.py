from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session
from .auth_handler import get_password_hash
from app.database import get_db_connection
from app.crud.user import create_user

router = APIRouter()

class UserSignup(BaseModel):
    username: str
    email: str
    password: str
    
class UserLogin(BaseModel):
    email: str
    password: str

@router.post("/signup")
def signup(user: UserSignup, db: Session = Depends(get_db_connection)):
    hashed_password = get_password_hash(user.password)
    new_user = create_user(db, username=user.username, email=user.email, hashed_password=hashed_password)
    return {"message": "User created successfully", "user": new_user}