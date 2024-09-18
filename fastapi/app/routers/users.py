# from fastapi import APIRouter, Depends, HTTPException
# from auth.auth_handler import get_current_user
# from typing import Dict

# router = APIRouter()

# # Example route that requires authentication
# @router.get("/me", response_model=Dict[str, str])
# def read_current_user(current_user: Dict[str, str] = Depends(get_current_user)):
#     if not current_user:
#         raise HTTPException(status_code=401, detail="Not authenticated")
    
#     return {"current_user": current_user}

# # Example of another protected route
# @router.get("/protected")
# def protected_route(current_user: Dict[str, str] = Depends(get_current_user)):
#     return {"message": "You have access to this protected route", "user": current_user}
