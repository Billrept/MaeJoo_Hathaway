# model_handler.py
from models import arima_prediction, garch_prediction
from database import get_stock_history

# Function to predict next day's price and volatility for a given stock
def predict_next_day_price_and_volatility(ticker, stock_data):
    # stock_data should be a Pandas DataFrame containing historical "Close" prices

    # 1. ARIMA model for price prediction
    predicted_price = arima_prediction(stock_data)

    # 2. GARCH model for volatility prediction (on returns)
    predicted_volatility = garch_prediction(stock_data)

    return predicted_price, predicted_volatility