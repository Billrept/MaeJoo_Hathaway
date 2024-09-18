import yfinance as yf
from datetime import datetime, timedelta
from model_handler import predict_next_day_price_and_volatility
from database import insert_stock_history, store_prediction
import numpy as np

# Fetch stock data and store it in stock_history table
def fetch_and_store_stock_data(ticker):
    end_date = datetime.today().date()
    start_date = end_date - timedelta(days=730)  # 2 years of data

    print(f"Fetching data for {ticker} from {start_date} to {end_date}")
    data = yf.download(ticker, start=start_date, end=end_date)

    if data.empty:
        print(f"No data found for {ticker}")
        return []

    close_prices = []

    for date, row in data.iterrows():
        close_price = float(row['Close'])
        close_prices.append(close_price)

        # Store stock data in the stock_history table using insert_stock_history function
        insert_stock_history(ticker, date.date(), close_price)

    return close_prices

# Predict and store predictions in stock_predictions table using one query
def predict_and_store(ticker, close_prices):
    if not close_prices:
        print(f"Not enough data to make predictions for {ticker}")
        return

    # Run predictions after historical data is stored
    predicted_price, predicted_volatility = predict_next_day_price_and_volatility(ticker, close_prices)

    # Log the predictions to verify values
    print(f"Predicted price for {ticker}: {predicted_price}, Predicted volatility: {predicted_volatility}")

    # Check if the predicted values are valid
    if predicted_price is None or np.isnan(predicted_price) or predicted_volatility is None or np.isnan(predicted_volatility):
        print(f"Invalid predictions for {ticker}. Skipping.")
        return

    # Store both predictions in one query using store_prediction function
    store_prediction(ticker, predicted_price, predicted_volatility, model_used='ARIMA-GARCH')

# Fetch data for all tickers, predict, and store results
def fetch_predict_and_store_all():
    tickers = [
        "AAPL", "ABNB", "ADBE", "ADI", "ADP", "ADSK", "AEP", "AMAT", "AMD", "AMGN", 
        "AMZN", "ANSS", "ARM", "ASML", "AVGO", "AZN", "BIIB", "BKNG", "BKR", "CCEP", 
        "CDNS", "CDW", "CEG", "CHTR", "CMCSA", "COST", "CPRT", "CRWD", "CSCO", "CSGP", 
        "CSX", "CTAS", "CTSH", "DASH", "DDOG", "DLTR", "DXCM", "EA", "EXC", "FANG", 
        "FAST", "FTNT", "GEHC", "GFS", "GILD", "GOOG", "GOOGL", "HON", "IDXX", "ILMN", 
        "INTC", "INTU", "ISRG", "KDP", "KHC", "KLAC", "LIN", "LRCX", "LULU", "MAR", 
        "MCHP", "MDB", "MDLZ", "MELI", "META", "MNST", "MRNA", "MRVL", "MSFT", "MU", 
        "NFLX", "NVDA", "NXPI", "ODFL", "ON", "ORLY", "PANW", "PAYX", "PCAR", "PDD", 
        "PEP", "PYPL", "QCOM", "REGN", "ROP", "ROST", "SBUX", "SMCI", "SNPS", "TEAM", 
        "TMUS", "TSLA", "TTD", "TTWO", "TXN", "VRSK", "VRTX", "WBD", "WDAY", "XEL", "ZS"
    ]  # Reduced for debugging purposes
    
    for ticker in tickers:
        close_prices = fetch_and_store_stock_data(ticker)  # Fetch and store stock data
        predict_and_store(ticker, close_prices)            # Predict and store results
    
    print("Data fetched and predictions stored successfully.")

if __name__ == "__main__":
    fetch_predict_and_store_all()