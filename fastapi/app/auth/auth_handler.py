from passlib.context import CryptContext
from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from typing import Dict
from datetime import datetime, timedelta
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import random
import string
import hashlib
import pyotp
import smtplib

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")
SECRET_KEY = "1wakrai6_kmitlzaza"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30
SERVER_SECRET_KEY = "123456"
reference_codes = {}

def store_reference_code(email: str, reference_code: str):
    email_lower = email.lower()
    reference_codes[email_lower] = reference_code
    print(f"Stored reference code for {email_lower}: {reference_code}")

def get_reference_code(email: str):
    email_lower = email.lower()
    reference_code = reference_codes.get(email_lower)
    print(f"Retrieved reference code for {email_lower}: {reference_code}")
    return reference_code

def generate_reference_code(length=8):
    letters_and_digits = string.ascii_uppercase + string.digits
    return ''.join(random.choice(letters_and_digits) for i in range(length))

def generate_otp_secret(user_identifier: str):
    hash_value = hashlib.sha256(f"{user_identifier}{SERVER_SECRET_KEY}".encode()).hexdigest()
    return pyotp.random_base32()[:16]

otp_secrets = {}

def generate_otp(user_identifier: str) -> str:
    user_identifier = user_identifier.lower()
    otp_secret = generate_otp_secret(user_identifier)
    otp_secrets[user_identifier] = otp_secret
    totp = pyotp.TOTP(otp_secret)
    return totp.now()

def verify_otp(user_identifier: str, otp: str) -> bool:
    user_identifier = user_identifier.lower()
    otp_secret = otp_secrets.get(user_identifier)
    if not otp_secret:
        return False
    totp = pyotp.TOTP(otp_secret)
    return totp.verify(otp, valid_window=1)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def get_current_user(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise HTTPException(
                status_code=401,
                detail="Could not validate credentials",
                headers={"WWW-Authenticate": "Bearer"},
            )
        return user_id
    except JWTError:
        raise HTTPException(
            status_code=401,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def send_otp_via_email(email: str, otp: str) -> str:
    email = email.lower()
    try:
        sender_email = "maejoohathaway@gmail.com"
        sender_password = "ijzx anng ineu wzog"
        subject = "Your OTP Code"
        reference_code = generate_reference_code()

        store_reference_code(email, reference_code)

        message = MIMEMultipart()
        message['From'] = sender_email
        message['To'] = email
        message['Subject'] = subject

        body = f"Your OTP code is: {otp}\nref-- {reference_code}"
        message.attach(MIMEText(body, 'plain'))

        server = smtplib.SMTP('smtp.gmail.com', 587)
        server.starttls()
        server.login(sender_email, sender_password)
        server.sendmail(sender_email, email, message.as_string())
        server.quit()

        return reference_code
    
    except Exception as e:
        raise HTTPException(status_code=500, detail="Error sending OTP")

def decode_token(token: str):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        if payload["exp"] < datetime.utcnow().timestamp():
            raise HTTPException(status_code=401, detail="Token has expired")
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token has expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")
