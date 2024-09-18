from fastapi import APIRouter, Depends
from auth.auth_handler import get_current_user

router = APIRouter()

# Example route that requires authentication
@router.get("/me")
def read_current_user(current_user: str = Depends(get_current_user)):
    return {"current_user": current_user}

# You can add more routes that use get_current_user for protected routes.