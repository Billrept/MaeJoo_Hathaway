from fastapi.app.mathmodels import arima_prediction, garch_prediction

# Predict stock price and volatility for the next day
def predict_next_day_price_and_volatility(ticker, stock_data):
    predicted_price = arima_prediction(stock_data)
    predicted_volatility = garch_prediction(stock_data)
    return predicted_price, predicted_volatility