from fastapi import APIRouter, HTTPException, Depends, BackgroundTasks
from pydantic import BaseModel
from .auth_handler import *
from app.database import get_db_connection
from app.crud.user import create_user, get_user_by_email
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
    otp: str

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
def login(user: UserLogin, background_tasks: BackgroundTasks, conn = Depends(get_db_connection)):
    db_user = get_user_by_email(conn, user.email)
    if not db_user:
        raise HTTPException(status_code=400, detail="Invalid username or password")
    otp = generate_otp(user.email)
    background_tasks.add_task(send_otp_via_email, user.email, otp)
    access_token = create_access_token(data={"sub": user.email})
    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/verify-otp")
def verify_otp_endpoint(data: VerifyOtpRequest):

    otp = data.otp.strip()
    if verify_otp(data.email, otp):
        return {"success": True, "message": "OTP verified successfully"}
    else:
        raise HTTPException(status_code=400, detail="Invalid or expired OTP.")

@router.post("/resend-otp")
async def resend_otp(data: resendOtpRequest):
    try:
        otp = generate_otp(data.email)
        reference_code = generate_reference_code()
        store_reference_code(data.email, reference_code)  # Store the reference code
        send_otp_via_email(data.email, otp, reference_code)
        
        return {"message": "OTP sent successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to resend OTP: {str(e)}")

@router.post("/verify-token")
def verify_token(token_request: TokenRequest):
    token = token_request.token
    try:
        payload = decode_token(token)
        return {"valid": True} 
    except:
        raise HTTPException(status_code=401, detail="Invalid token")
    
@router.get("/get-reference-code/{email}")
async def get_reference_code_endpoint(email: str):
    reference_code = get_reference_code(email)
    if reference_code:
        return {"reference_code": reference_code}
    else:
        raise HTTPException(status_code=404, detail="Reference code not found")