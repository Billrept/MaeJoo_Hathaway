from fastapi import FastAPI
from auth import routes as auth_routes
from routers import users

app = FastAPI()

# Include routers for authentication, stock data, and predictions
app.include_router(auth_routes.router, prefix="/auth")
app.include_router(users.router, prefix="/api/users")