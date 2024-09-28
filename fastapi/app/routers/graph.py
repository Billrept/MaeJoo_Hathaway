from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import List
from ..database import *
from sqlalchemy.orm import Session

router = APIRouter()

class StockHistoryRecord(BaseModel):
    date: str
    close_price: float
    
class StockPrediction(BaseModel):
	ticker: str
	predicted_price: float
	predicted_volatility: float
	prediction_models: str

class FavoriteStockResponse(BaseModel):
    ticker: str

@router.get("/{ticker}/history", response_model=List[StockHistoryRecord])
def get_stock_history_endpoint(ticker: str):
    stock_history = get_stock_history(ticker)

    if stock_history is None:
        raise HTTPException(status_code=404, detail=f"No stock history found for ticker: {ticker}")
    
    history_data = [
        {"date": str(index), "close_price": row['Close']}
        for index, row in stock_history.iterrows()
    ]

    return history_data

@router.get("/{ticker}/prediction", response_model=StockPrediction)
def stock_prediction(ticker: str):
    prediction = get_prediction(ticker)

    if not prediction:
        raise HTTPException(status_code=404, detail=f"No prediction found for ticker: {ticker}")
    
    response = {
        "ticker": prediction[0],
        "predicted_price": float(prediction[1]),
        "predicted_volatility": float(prediction[2]),
        "prediction_models": str(prediction[3])
    }

    return response

@router.post("/prices")
def fetch_current_stock_prices():
    return get_all_stock_prices()

@router.post("/{ticker}/price")
def fetch_single_stock_price(ticker: str):
    return get_stock_price(ticker)

@router.post("/{ticker}/{userId}/add-favorite")
async def add_favorite_stock(ticker: str, userId: int, db: Session = Depends(get_db_connection)):
    cursor = db.cursor()
    try:
        cursor.execute("SELECT id FROM stock_predictions WHERE ticker = %s", (ticker,))
        stock = cursor.fetchone()
        if not stock:
            raise HTTPException(status_code=404, detail="Stock not found")
        stock_id = stock[0]
        cursor.execute("SELECT fav_id FROM favorites WHERE fav_user = %s", (userId,))
        favorite = cursor.fetchone()
        if not favorite:
            cursor.execute(
                "INSERT INTO favorites (fav_user) VALUES (%s) RETURNING fav_id",
                (userId,)
            )
            fav_id = cursor.fetchone()[0]
        else:
            fav_id = favorite[0]
        cursor.execute(
            """
            INSERT INTO favorite_stocks (fav_id, stock_id)
            VALUES (%s, %s)
            ON CONFLICT (fav_id, stock_id) DO NOTHING;
            """,
            (fav_id, stock_id)
        )
        db.commit()
        return {"message": "Stock added to favorites"}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=f"Error adding stock to favorites: {str(e)}")
    finally:
        cursor.close()

@router.get("/{user_id}/favorites", response_model=List[FavoriteStockResponse])
def get_favorite_stocks(user_id: int, db: Session = Depends(get_db_connection)):
    try:
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
    
