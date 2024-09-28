from fastapi import APIRouter, HTTPException, Depends, BackgroundTasks
from pydantic import BaseModel, EmailStr, constr
from .auth_handler import *
from app.database import get_db_connection
from app.crud.user import create_user, get_user_by_email, update_user, get_user_by_id
from sqlalchemy.orm import Session
from typing import List, Optional

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
    user_id: int
    email: str
    otp: str

class resendOtpRequest(BaseModel):
    email: str

class TokenRequest(BaseModel):
    token: str

class UserResponse(BaseModel):
    id: int
    username: str
    email: str
    
class UpdateUsernameRequest(BaseModel):
    user_id: int
    username: str

class UpdateEmailRequest(BaseModel):
    user_id: int
    email: EmailStr

class UpdatePasswordRequest(BaseModel):
    email: str
    user_id : int
    current_password: str
    new_password: constr(min_length=8)

@router.post("/signup")
def signup(user: UserSignup, db: Session = Depends(get_db_connection)):
    try:
        # Check if user already exists by email
        existing_user = get_user_by_email(db, user.email)
        
        if existing_user:
            raise HTTPException(status_code=400, detail="User with this email already exists")
        
        # Proceed with user creation if no existing user is found
        hashed_password = get_password_hash(user.password)
        new_user = create_user(db, username=user.username, email=user.email, hashed_password=hashed_password)
        
        return {"message": "User created successfully", "user": new_user}

    except HTTPException as e:
        raise e  # Re-raise known HTTPExceptions to return specific error messages
    except Exception as e:
        # Log the error and return a generic error message
        print(f"Signup error: {str(e)}")  # This will print the error to the FastAPI logs
        raise HTTPException(status_code=500, detail="Internal Server Error")

@router.post("/login")
def login(user: UserLogin, background_tasks: BackgroundTasks, conn = Depends(get_db_connection)):
    db_user = get_user_by_email(conn, user.email)
    if not db_user:
        raise HTTPException(status_code=400, detail="Invalid username or password")
    otp = generate_otp(user.email)
    background_tasks.add_task(send_otp_via_email, user.email, otp)
    return {
        "message": "OTP sent to your email",
    }

@router.post("/verify-otp")
def verify_otp_endpoint(data: VerifyOtpRequest, db: Session = Depends(get_db_connection)):
    otp = data.otp.strip()
    db_user = get_user_by_id(db, data.user_id)
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    if verify_otp(data.email, otp):
        access_token = create_access_token(data={"sub": data.email})
        return {
            "success": True,
            "message": "OTP verified successfully",
            "access_token": access_token,
            "token_type": "bearer",
            "user_id": db_user["id"]
        }
    else:
        raise HTTPException(status_code=400, detail="Invalid or expired OTP.")

@router.post("/resend-otp")
async def resend_otp(data: resendOtpRequest):
    try:
        otp = generate_otp(data.email)
        reference_code = generate_reference_code()
        store_reference_code(data.email, reference_code)
        send_otp_via_email(data.email, otp)
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
    
@router.put("/update-username")
def update_username(data: UpdateUsernameRequest, conn = Depends(get_db_connection)):
    user = get_user_by_id(conn, data.user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    try:
        with conn.cursor() as cursor:
            cursor.execute("UPDATE users SET username = %s WHERE id = %s;", (data.username, data.user_id))
            conn.commit()

        user['username'] = data.username
        
        return {"message": "Username updated successfully", "user": user}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error updating username: {str(e)}")


@router.put("/update-email")
def update_email(data: UpdateEmailRequest, conn = Depends(get_db_connection)):
    # Retrieve user by user_id
    user = get_user_by_id(conn, data.user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Retrieve user by email
    existing_user = get_user_by_email(conn, data.email)
    if existing_user and existing_user['id'] != data.user_id:  # Access 'id' as a dict key
        raise HTTPException(status_code=400, detail="Email is already in use")
    
    try:
        # Update email in the database
        with conn.cursor() as cursor:
            cursor.execute("UPDATE users SET email = %s WHERE id = %s;", (data.email, data.user_id))
            conn.commit()

        # Return the updated user information
        user['email'] = data.email
        return {"message": "Email updated successfully", "user": user}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error updating email: {str(e)}")


# Route to update password
@router.put("/update-password")
def update_password(data: UpdatePasswordRequest, conn = Depends(get_db_connection)):
    # Retrieve the user by email
    db_user = get_user_by_id(conn, data.user_id)  # Assuming data includes email
    if not db_user:
        raise HTTPException(status_code=400, detail="Invalid username or password")

    if not verify_password(data.current_password, db_user['password_hash']):
        raise HTTPException(status_code=400, detail="Current password is incorrect")

    try:
        hashed_new_password = get_password_hash(data.new_password)

        with conn.cursor() as cursor:
            cursor.execute("UPDATE users SET password_hash = %s WHERE id = %s;", (hashed_new_password, db_user['id']))
            conn.commit()

        return {"message": "Password updated successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error updating password: {str(e)}")
