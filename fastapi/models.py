from datetime import datetime
from pydantic import BaseModel

class UserResponse(BaseModel):
    user_id: int
    username: str
    email: str
    created_at: datetime

class User(BaseModel):
    username: str
    password_hash: str
    email: str

class UserCreate(BaseModel):
    username: str
    first_name: str
    last_name: str
    password: str

class UserLogin(BaseModel):
    username: str
    password: str