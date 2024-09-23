from passlib.context import CryptContext
from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from typing import Dict
from datetime import datetime, timedelta
import os
import hmac
import hashlib
import pyotp

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")

SECRET_KEY = "1wakrai6_kmitlzaza"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

SERVER_SECRET_KEY = os.getenv("SERVER_SECRET_KEY", "some-very-secret-key")


def generate_2fa_secret(user_email: str) -> str:
    secret_hash = hmac.new(SERVER_SECRET_KEY.encode(), user_email.encode(), hashlib.sha256).hexdigest()
    return pyotp.random_base32()[:16]

def verify_totp_code(totp_secret: str, totp_code: str) -> bool:
    totp = pyotp.TOTP(totp_secret)
    return totp.verify(totp_code)

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def get_current_user(token: str = Depends(oauth2_scheme)) -> Dict[str, str]:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise HTTPException(status_code=401, detail="Invalid token")
        return {"username": username}
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")
    
def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow(+7) + expires_delta
    else:
        expire = datetime.utcnow(+7) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt