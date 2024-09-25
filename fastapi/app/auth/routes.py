from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session
from .auth_handler import get_password_hash, verify_otp, create_access_token, generate_otp, send_otp_via_email
from app.database import get_db_connection
from app.crud.user import create_user, get_user_by_email


router = APIRouter()

OTP_SECRET = "123456"

class UserSignup(BaseModel):
    username: str
    email: str
    password: str

class UserLogin(BaseModel):
    email: str
    password: str

class VerifyOtpRequest(BaseModel):
    email: str
    otp: str

@router.post("/signup")
def signup(user: UserSignup, db: Session = Depends(get_db_connection)):
    hashed_password = get_password_hash(user.password)
    new_user = create_user(db, username=user.username, email=user.email, hashed_password=hashed_password)
    otp = generate_otp(OTP_SECRET)
    send_otp_via_email(user.email, otp)
    return {"message": "User created successfully", "user": new_user}

@router.post("/login")
def login(user: UserLogin, conn = Depends(get_db_connection)):

    db_user = get_user_by_email(conn, user.email)
    
    if not db_user:
        raise HTTPException(status_code=400, detail="Invalid username or password")

    otp = generate_otp(user.email)
    send_otp_via_email(user.email, otp)
    access_token = create_access_token(data={"sub": user.email})
    
    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/verify-otp")
def validared(data: VerifyOtpRequest):
    # OTP verification logic
    if not verify_otp(data.email, data.otp):
        raise HTTPException(status_code=400, detail="Invalid OTP")
    return {"success": True}

@router.post("/resend-otp")
def resend_otp(data: VerifyOtpRequest):
    otp = generate_otp(data.email)
    send_otp_via_email(data.email, otp)
    return {"message": "OTP sent successfully"}