from fastapi import APIRouter, Depends
from auth.auth_handler import get_current_user

router = APIRouter()

@router.get("/me")
def read_current_user(current_user: str = Depends(get_current_user)):
    return {"username": current_user}