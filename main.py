from fastapi import FastAPI
from pydantic import BaseModel
from daily_fetch import fetch_and_store_stock_data
from database import store_prediction
from models import arima_prediction, garch_prediction
import psycopg2

# FastAPI app
app = FastAPI()

# Database connection setup
conn = psycopg2.connect(
    host="localhost",
    database="your_database",
    user="your_username",
    password="your_password"
)
cur = conn.cursor()

# Define request schema for prediction
class PredictionRequest(BaseModel):
    ticker: str

# API to fetch 2 years of stock data and make predictions
@app.post("/predict/")
def predict_stock(request: PredictionRequest):
    ticker = request.ticker.upper()

    # Fetch stock data and store it in the database
    fetch_and_store_stock_data(ticker)

    # Fetch stock data for ARIMA and GARCH models
    cur.execute("SELECT close FROM stock_history WHERE ticker = %s ORDER BY trade_date ASC", (ticker,))
    stock_data = [row[0] for row in cur.fetchall()]

    # Run ARIMA and GARCH models
    predicted_price = arima_prediction(stock_data)
    predicted_volatility = garch_prediction(stock_data)

    # Store predictions in the database
    store_prediction(ticker, predicted_price, predicted_volatility)

    return {"ticker": ticker, "predicted_price": predicted_price, "predicted_volatility": predicted_volatility}

# API to fetch historical data
@app.get("/history/{ticker}")
def get_stock_history(ticker: str):
    ticker = ticker.upper()
    cur.execute("SELECT trade_date, close FROM stock_history WHERE ticker = %s ORDER BY trade_date ASC", (ticker,))
    history = cur.fetchall()
    return {"ticker": ticker, "history": history}