from passlib.context import CryptContext
from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from typing import Dict
from datetime import datetime, timedelta
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os
import hmac
import hashlib
import pyotp

import smtplib
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

SECRET_KEY = "1wakrai6_kmitlzaza"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

SERVER_SECRET_KEY = "123456"

def generate_otp_secret(user_identifier):
    hash_value = hashlib.sha256(f"{user_identifier}{SERVER_SECRET_KEY}".encode()).hexdigest()
    return pyotp.random_base32()[:16] 

otp_secrets = {}

def generate_otp(user_identifier):
    otp_secret = generate_otp_secret(user_identifier)
    otp_secrets[user_identifier] = otp_secret
    totp = pyotp.TOTP(otp_secret)
    return totp.now()

def verify_otp(user_identifier, otp):
    otp_secret = otp_secrets.get(user_identifier)
    if not otp_secret:
        return False
    totp = pyotp.TOTP(otp_secret)
    return totp.verify(otp)

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
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def send_otp_via_email(email, otp):
    try:
        # Email setup
        sender_email = "maejoohathaway@gmail.com"
        sender_password = "ijzx anng ineu wzog"  # Ideally, this should be stored in environment variables for security.
        subject = "Your OTP Code"
        
        # Create the email content
        message = MIMEMultipart()
        message['From'] = sender_email
        message['To'] = email
        message['Subject'] = subject

        body = f"Your OTP code is: {otp}"
        message.attach(MIMEText(body, 'plain'))

        # Establish connection to the Gmail SMTP server
        server = smtplib.SMTP('smtp.gmail.com', 587)  # Use port 587 for TLS
        server.starttls()  # Upgrade the connection to a secure encrypted TLS connection
        server.login(sender_email, sender_password)

        # Send the email
        server.sendmail(sender_email, email, message.as_string())

        # Close the connection
        server.quit()
    except Exception as e:
        raise HTTPException(status_code=500, detail="Error sending OTP")
