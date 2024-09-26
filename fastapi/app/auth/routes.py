from fastapi import APIRouter, HTTPException, Depends, BackgroundTasks
from pydantic import BaseModel
from .auth_handler import get_password_hash, verify_otp, create_access_token, generate_otp, send_otp_via_email, decode_token
from app.database import get_db_connection
from app.crud.user import create_user, get_user_by_email
from sqlalchemy.orm import Session
from typing import List


router = APIRouter()

OTP_SECRET = "123456"

class UserSignup(BaseModel):
    username: str
    email: str
    password: str

class UserLogin(BaseModel):
    email: str
    password: str

class VerifyOtpRequest(BaseModel):
    email: str
    otp: str

class resendOtpRequest(BaseModel):
    email: str
    
class TokenRequest(BaseModel):
    token: str

class FavoriteStockResponse(BaseModel):
    ticker: str

@router.post("/signup")
def signup(user: UserSignup, db: Session = Depends(get_db_connection)):
    hashed_password = get_password_hash(user.password)
    new_user = create_user(db, username=user.username, email=user.email, hashed_password=hashed_password)
    otp = generate_otp(OTP_SECRET)
    send_otp_via_email(user.email, otp)
    return {"message": "User created successfully", "user": new_user}

@router.post("/login")
def login(user: UserLogin, background_tasks: BackgroundTasks, conn = Depends(get_db_connection)):
    db_user = get_user_by_email(conn, user.email)
    if not db_user:
        raise HTTPException(status_code=400, detail="Invalid username or password")
    otp = generate_otp(user.email)
    background_tasks.add_task(send_otp_via_email, user.email, otp)
    access_token = create_access_token(data={"sub": user.email})
    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/verify-otp")
def verify_otp_endpoint(data: VerifyOtpRequest):

    otp = data.otp.strip()
    if verify_otp(data.email, otp):
        return {"success": True, "message": "OTP verified successfully"}
    else:
        raise HTTPException(status_code=400, detail="Invalid or expired OTP.")

@router.post("/resend-otp")
async def resend_otp(data: resendOtpRequest):
    try:
        otp = generate_otp(data.email)
        send_otp_via_email(data.email, otp)
        return {"message": "OTP sent successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to resend OTP: {str(e)}")

@router.post("/verify-token")
def verify_token(token_request: TokenRequest):
    token = token_request.token
    try:
        payload = decode_token(token)
        return {"valid": True} 
    except:
        raise HTTPException(status_code=401, detail="Invalid token")  # Return 401 if token is invalid

@router.post("/{ticker}/{userId}/add-favorite")
async def add_favorite_stock(ticker: str, userId: int, db: Session = Depends(get_db_connection)):
    cursor = db.cursor()
    
    try:
        # Get the stock ID from the ticker
        cursor.execute("SELECT id FROM stock_predictions WHERE ticker = %s", (ticker,))
        stock = cursor.fetchone()
        if not stock:
            raise HTTPException(status_code=404, detail="Stock not found")
        stock_id = stock[0]  # Accessing the stock ID
        
        # Check if the user already has a record in the favorites table
        cursor.execute("SELECT fav_id FROM favorites WHERE fav_user = %s", (userId,))
        favorite = cursor.fetchone()

        # If no favorites record exists, create a new one for the user
        if not favorite:
            cursor.execute(
                "INSERT INTO favorites (fav_user) VALUES (%s) RETURNING fav_id",
                (userId,)
            )
            fav_id = cursor.fetchone()[0]
        else:
            fav_id = favorite[0]
        
        # Now, insert the stock into the favorite_stocks table
        cursor.execute(
            """
            INSERT INTO favorite_stocks (fav_id, stock_id)
            VALUES (%s, %s)
            ON CONFLICT (fav_id, stock_id) DO NOTHING;
            """,
            (fav_id, stock_id)
        )
        
        # Commit the transaction
        db.commit()

        return {"message": "Stock added to favorites"}
    
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=f"Error adding stock to favorites: {str(e)}")
    
    finally:
        cursor.close()

# API to fetch favorite stocks for a user
@router.get("/{user_id}/favorites", response_model=List[FavoriteStockResponse])
def get_favorite_stocks(user_id: int, db: Session = Depends(get_db_connection)):
    try:
        # Query to get all the favorite stock tickers for the given user
        query = """
        SELECT sp.ticker
        FROM favorites f
        JOIN favorite_stocks fs ON f.fav_id = fs.fav_id
        JOIN stock_predictions sp ON fs.stock_id = sp.id
        WHERE f.fav_user = %s
        """
        cursor = db.cursor()
        cursor.execute(query, (user_id,))
        favorites = cursor.fetchall()
        cursor.close()

        # Return the list of favorite stocks
        return [{"ticker": row[0]} for row in favorites]
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching favorites: {str(e)}")
    
@router.post("/{ticker}/{userId}/remove-favorite")
async def remove_favorite_stock(ticker: str, userId: int, db: Session = Depends(get_db_connection)):
    try:
        cursor = db.cursor()
        cursor.execute("""
            DELETE FROM favorite_stocks
            USING stock_predictions
            WHERE favorite_stocks.stock_id = stock_predictions.id
            AND stock_predictions.ticker = %s
            AND favorite_stocks.fav_id = (
                SELECT fav_id FROM favorites WHERE fav_user = %s
            );
        """, (ticker, userId))
        db.commit()
        cursor.close()
        return {"message": f"Stock {ticker} removed from favorites."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error removing stock from favorites: {str(e)}")
