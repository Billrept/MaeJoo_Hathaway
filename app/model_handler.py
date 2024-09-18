from models import arima_prediction, garch_prediction
from database import get_stock_history

def predict_next_day_price_and_volatility(ticker, stock_data):
	predicted_price = arima_prediction(stock_data)
	predicted_volatility = garch_prediction(stock_data)
	return predicted_price, predicted_volatility
