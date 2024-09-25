from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from .auth_handler import get_password_hash, verify_otp, create_access_token, generate_otp, send_otp_via_email, decode_token
from app.database import get_db_connection
from app.crud.user import create_user, get_user_by_email
import logging
from sqlalchemy.orm import Session


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
    otp: int

class resendOtpRequest(BaseModel):
    email: str
    
class TokenRequest(BaseModel):
    token: str

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
async def verify_otp_endpoint(data: VerifyOtpRequest):
    # Convert OTP to an integer for comparison, assuming OTP is stored/generated as an integer
    try:
        user_otp = int(data.otp)  # Convert the user-provided OTP to an integer
    except ValueError:
        # Handle cases where the provided OTP is not a valid number
        raise HTTPException(status_code=400, detail="Invalid OTP format.")

    if verify_otp(data.email, user_otp):  # Ensure OTPs are compared as integers
        return {"success": True, "message": "OTP verified successfully"}
    else:
        raise HTTPException(status_code=400, detail="Invalid OTP.")

@router.post("/resend-otp")
async def resend_otp(data: resendOtpRequest):
    try:
        otp = generate_otp(data.email)
        
        send_otp_via_email(data.email, otp)
        
        return {"message": "OTP sent successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to resend OTP: {str(e)}")

@router.post("/verify-token")
def verify_token(token_request: TokenRequest):
    token = token_request.token
    try:
        # Use the decode_token function to verify the JWT token
        payload = decode_token(token)
        return {"valid": True}  # If the token is valid
    except:
        raise HTTPException(status_code=401, detail="Invalid token")  # Return 401 if token is invalid