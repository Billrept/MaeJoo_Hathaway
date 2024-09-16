import pandas as pd
from statsmodels.tsa.arima.model import ARIMA
from arch import arch_model
import numpy as np

def arima_prediction(close_prices):
    model = ARIMA(close_prices, order=(5, 1, 0))
    model_fit = model.fit()
    predicted_price = model_fit.forecast(steps=1).iloc[0]
    return predicted_price

def garch_prediction(close_prices):
    returns = close_prices.pct_change().dropna() * 100
    garch_model = arch_model(returns, vol='Garch', p=2, q=2)
    garch_fit = garch_model.fit(disp="off")
    predicted_volatility = np.sqrt(garch_fit.forecast(horizon=1).variance.iloc[-1, 0])
    return predicted_volatility