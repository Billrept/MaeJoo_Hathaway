from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List
from ..database import get_stock_history, get_prediction

router = APIRouter()

class StockHistoryRecord(BaseModel):
    date: str
    close_price: float
    
class StockPrediction(BaseModel):
	ticker: str
	predicted_price: float
	predicted_volatility: float
	prediction_models: str

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
