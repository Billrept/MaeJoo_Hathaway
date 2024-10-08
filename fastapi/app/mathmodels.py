import pandas as pd
from statsmodels.tsa.arima.model import ARIMA
from arch import arch_model
import math

# ARIMA prediction function
def arima_prediction(close_prices):
    model = ARIMA(close_prices, order=(5, 1, 0))
    model_fit = model.fit()
    predicted_price = float(model_fit.forecast(steps=1)[0])
    return predicted_price


# GARCH prediction function
def garch_prediction(close_prices):
    close_prices_series = pd.Series(close_prices)
    returns = close_prices_series.pct_change().dropna() * 100
    garch_model = arch_model(returns, vol='Garch', p=2, q=2)
    garch_fit = garch_model.fit(disp="off")
    predicted_volatility = garch_fit.forecast(horizon=1).variance.iloc[-1, 0]
    predicted_volatility = float(math.sqrt(predicted_volatility))
    return predicted_volatility