from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .auth import routes as auth_routes
from .routers import graph as stock
from .daily_fetch.daily_fetch import router as daily_fetch

app = FastAPI()

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # You can adjust this based on where your frontend is hosted
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(auth_routes.router, prefix="/auth")
app.include_router(daily_fetch, prefix="/fetch")
app.include_router(stock.router, prefix="/stocks")