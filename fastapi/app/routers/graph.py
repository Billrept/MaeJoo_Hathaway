from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List
from ..database import get_stock_history  # Ensure correct import path

router = APIRouter()

# Define the structure for each record
class StockHistoryRecord(BaseModel):
    date: str
    close_price: float

@router.get("/{ticker}/history", response_model=List[StockHistoryRecord])
def get_stock_history_endpoint(ticker: str):
    stock_history = get_stock_history(ticker)  # This returns a DataFrame

    if stock_history is None:
        raise HTTPException(status_code=404, detail=f"No stock history found for ticker: {ticker}")
    
    # Convert the DataFrame to a list of dictionaries with 'date' and 'close_price'
    history_data = [
        {"date": str(index), "close_price": row['Close']}
        for index, row in stock_history.iterrows()
    ]

    return history_data