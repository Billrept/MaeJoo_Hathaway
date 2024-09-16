import unittest
import os
import pandas as pd
from models import run_arima, run_garch  # Import your prediction functions

class TestRealData(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        # Define the folder where the historical data is stored
        historical_data_folder = "historical_data"
        stock_symbol = "AAPL"  # You can change this symbol dynamically or loop through multiple stocks

        # Construct the file path for the stock's historical data CSV
        csv_file = os.path.join(historical_data_folder, f"{stock_symbol}_5y.csv")

        # Check if the CSV file exists
        if not os.path.exists(csv_file):
            raise FileNotFoundError(f"CSV file for {stock_symbol} not found in {historical_data_folder}")

        # Load the historical data from the CSV file
        print(f"Loading historical data for {stock_symbol} from {csv_file}...")
        cls.stock_data = pd.read_csv(csv_file, parse_dates=["Date"], index_col="Date")['Close']

        # Ensure there is no missing data
        cls.stock_data = cls.stock_data.dropna()

    def test_arima_prediction(self):
        # Run ARIMA model on the real stock data
        print("Testing ARIMA model with real data...")
        arima_model = run_arima(self.stock_data)
        arima_pred = arima_model.forecast(steps=1).iloc[0]  # Forecast next day's price

        # Print and validate the ARIMA prediction
        print(f"ARIMA Prediction for next day: {arima_pred}")
        self.assertIsNotNone(arima_pred)
        self.assertIsInstance(arima_pred, float)

    def test_garch_prediction(self):
        # Run GARCH model on the real stock data
        print("Testing GARCH model with real data...")
        garch_model = run_garch(self.stock_data)
        garch_pred = garch_model.forecast(horizon=1).mean['h.1'].iloc[-1]  # Forecast next day's volatility

        # Print and validate the GARCH prediction
        print(f"GARCH Prediction for next day volatility: {garch_pred}")
        self.assertIsNotNone(garch_pred)
        self.assertIsInstance(garch_pred, float)

if __name__ == '__main__':
    unittest.main()
