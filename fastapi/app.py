from fastapi import FastAPI, HTTPException, APIRouter
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
from database import * 
from fastapi.middleware.cors import CORSMiddleware
from routes import router as users_router

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Only allow requests from localhost:3000
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods (GET, POST, PUT, DELETE, etc.)
    allow_headers=["*"],  # Allow all headers
)

# Pydantic model for returning user data
class UserResponse(BaseModel):
    user_id: int
    username: str
    email: str
    created_at: datetime

class User(BaseModel):
    username: str
    password_hash: str
    email: str

# Connect to the database on startup
@app.on_event("startup")
async def startup():
    await connect_db()

# Disconnect from the database on shutdown
@app.on_event("shutdown")
async def shutdown():
    await disconnect_db()

@app.get("/")
async def read_root():
    return {"message": "Hello World"}

app.include_router(users_router, prefix="/api")