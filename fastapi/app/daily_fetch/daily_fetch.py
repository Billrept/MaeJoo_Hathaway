import yfinance as yf
from datetime import datetime, timedelta
from ..model_handler import predict_next_day_price_and_volatility
from ..database import insert_stock_history, store_prediction
import numpy as np
from fastapi import APIRouter

router = APIRouter()

def fetch_and_store_stock_data(ticker):
	end_date = datetime.today().date()
	start_date = end_date - timedelta(days=730)
	print(f"Fetching data for {ticker} from {start_date} to {end_date}")
	data = yf.download(ticker, start=start_date, end=end_date)
	if data.empty:
		print(f"No data found for {ticker}")
		return []
	close_prices = []
	for date, row in data.iterrows():
		close_price = float(row['Close'])
		close_prices.append(close_price)
		insert_stock_history(ticker, date.date(), close_price)
	return close_prices

def predict_and_store(ticker, close_prices):
	if not close_prices:
		print(f"Not enough data to make predictions for {ticker}")
		return
	predicted_price, predicted_volatility = predict_next_day_price_and_volatility(ticker, close_prices)
	print(f"Predicted price for {ticker}: {predicted_price}, Predicted volatility: {predicted_volatility}")
	if predicted_price is None or np.isnan(predicted_price) or predicted_volatility is None or np.isnan(predicted_volatility):
		print(f"Invalid predictions for {ticker}. Skipping.")
		return
	store_prediction(ticker, predicted_price, predicted_volatility, model_used='ARIMA-GARCH')

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
	]
	for ticker in tickers:
		close_prices = fetch_and_store_stock_data(ticker)
		predict_and_store(ticker, close_prices)

@router.get("/")
def fetch_data():
	fetch_predict_and_store_all()
	return {"message": "Data fetched and predictions stored successfully."}
