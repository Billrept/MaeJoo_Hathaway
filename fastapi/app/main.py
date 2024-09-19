from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .auth import routes as auth_routes
from .routers import users

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_routes.router, prefix="/auth")
# app.include_router(users.router, prefix="/api/users")
