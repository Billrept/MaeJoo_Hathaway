from fastapi import FastAPI, Query
from pydantic import BaseModel
from database import *
import psycopg2
from utils.utils import merge_sort

app = FastAPI()

conn = psycopg2.connect(
    host="localhost",
    database="advcompro",
    user="temp",
    password="temp"
)
cur = conn.cursor()

@app.get("/predictions/")
def get_predictions(
    sort_by: str = Query("predicted_price", description="Field to sort by: predicted_price or predicted_volatility"),
    sort_order: str = Query("desc", description="Sort order: asc or desc"),
    min_price: float = Query(None, description="Minimum predicted price"),
    max_price: float = Query(None, description="Maximum predicted price"),
    ticker: str = Query(None, description="Filter by specific stock ticker")
):
    query = "SELECT ticker, predicted_price, predicted_volatility FROM stock_predictions WHERE 1=1"

    if ticker is not None:
        query += f" AND ticker = '{ticker}'"

    if min_price is not None:
        query += f" AND predicted_price >= {min_price}"
    if max_price is not None:
        query += f" AND predicted_price <= {max_price}"

    cur.execute(query)
    predictions = cur.fetchall()

    if sort_by == "predicted_price":
        sorted_predictions = merge_sort(predictions)
    elif sort_by == "predicted_volatility":
        sorted_predictions = merge_sort([(p[0], p[2]) for p in predictions])  # Sort by volatility and then adjust back

    if sort_order == "desc":
        sorted_predictions.reverse()

    return {"predictions": sorted_predictions}

@app.get("/predictions/{ticker}")
def search_prediction(ticker: str):
    ticker = ticker.upper()
    query = "SELECT ticker, predicted_price, predicted_volatility FROM stock_predictions WHERE ticker = %s"
    
    cur.execute(query, (ticker,))
    prediction = cur.fetchone()

    if not prediction:
        return {"message": "Stock not found"}

    return {
        "ticker": prediction[0], 
        "predicted_price": prediction[1], 
        "predicted_volatility": prediction[2]
	}