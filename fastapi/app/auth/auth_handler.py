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

# Password context for hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# OAuth2 scheme
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")

# JWT secret and algorithm
SECRET_KEY = "1wakrai6_kmitlzaza"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# Secret key for OTP generation
SERVER_SECRET_KEY = "123456"

# In-memory storage for reference codes (replace with a database in production)
reference_codes = {}

# Store reference code in lowercase email
def store_reference_code(email: str, reference_code: str):
    email_lower = email.lower()  # Ensure lowercase email for consistency
    reference_codes[email_lower] = reference_code
    print(f"Stored reference code for {email_lower}: {reference_code}")  # Debug print

# Get reference code by lowercase email
def get_reference_code(email: str):
    email_lower = email.lower()  # Ensure lowercase email for consistency
    reference_code = reference_codes.get(email_lower)
    print(f"Retrieved reference code for {email_lower}: {reference_code}")  # Debug print
    return reference_code

# Generate a random alphanumeric reference code
def generate_reference_code(length=8):
    letters_and_digits = string.ascii_uppercase + string.digits
    return ''.join(random.choice(letters_and_digits) for i in range(length))

# Generate a unique OTP secret for a user
def generate_otp_secret(user_identifier: str):
    hash_value = hashlib.sha256(f"{user_identifier}{SERVER_SECRET_KEY}".encode()).hexdigest()
    return pyotp.random_base32()[:16]

# In-memory storage for OTP secrets (replace with a database in production)
otp_secrets = {}

# Generate OTP for a user
def generate_otp(user_identifier: str) -> str:
    user_identifier = user_identifier.lower()  # Ensure lowercase email
    otp_secret = generate_otp_secret(user_identifier)
    otp_secrets[user_identifier] = otp_secret
    totp = pyotp.TOTP(otp_secret)
    return totp.now()

# Verify OTP for a user
def verify_otp(user_identifier: str, otp: str) -> bool:
    user_identifier = user_identifier.lower()  # Ensure lowercase email
    otp_secret = otp_secrets.get(user_identifier)
    if not otp_secret:
        return False
    totp = pyotp.TOTP(otp_secret)
    return totp.verify(otp, valid_window=1)

# Verify the password against its hash
def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

# Hash the password
def get_password_hash(password):
    return pwd_context.hash(password)

# Get current user based on token
def get_current_user(token: str = Depends(oauth2_scheme)) -> Dict[str, str]:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise HTTPException(status_code=401, detail="Invalid token")
        return {"username": username}
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

# Create an access token
def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

# Send OTP via email with a reference code
def send_otp_via_email(email: str, otp: str) -> str:
    email = email.lower()  # Ensure lowercase email
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

        # Send the email
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