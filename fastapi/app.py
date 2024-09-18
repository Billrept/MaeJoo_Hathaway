from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
from database import * 
import sqlalchemy
from fastapi.middleware.cors import CORSMiddleware

# Define your user table schema
metadata = sqlalchemy.MetaData()

users_table = sqlalchemy.Table(
    "users",
    metadata,
    sqlalchemy.Column("user_id", sqlalchemy.Integer, primary_key=True),
    sqlalchemy.Column("username", sqlalchemy.String, nullable=False),
    sqlalchemy.Column("password_hash", sqlalchemy.String, nullable=False),
    sqlalchemy.Column("email", sqlalchemy.String, nullable=False),
    sqlalchemy.Column("created_at", sqlalchemy.DateTime, default=datetime.utcnow),
)

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

# GET route to fetch users
@app.get("/api/users", response_model=List[UserResponse])
async def get_users():
    query = users_table.select()
    results = await database.fetch_all(query)
    return results
