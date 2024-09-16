import psycopg2
import pandas as pd
from datetime import datetime, timedelta

conn = psycopg2.connect(
	host="localhost",
	database="advcompro",
	user="temp",
	password="temp"
)
cur = conn.cursor()

def get_stock_history(ticker):
    query = """
    SELECT trade_date, close
    FROM stock_history
    WHERE ticker = %s
    ORDER BY trade_date ASC;
    """
    cur.execute(query, (ticker,))
    result = cur.fetchall()

    if result:
        df = pd.DataFrame(result, columns=["Date", "Close"])
        df.set_index("Date", inplace=True)

        # Clean the data: Remove any non-numeric values or NaNs
        df = df.apply(pd.to_numeric, errors='coerce').dropna()

        return df
    return None

# Store predictions in the stock_predictions table
def store_prediction(ticker, predicted_price, predicted_volatility, model_used="ARIMA-GARCH"):
    prediction_date = datetime.today().date() + timedelta(days=1)  # Predict for the next day
    cur.execute("""
    INSERT INTO stock_predictions (ticker, prediction_date, predicted_price, predicted_volatility, model_used)
    VALUES (%s, %s, %s, %s, %s)
    ON CONFLICT (ticker, prediction_date) 
    DO UPDATE SET 
        predicted_price = EXCLUDED.predicted_price,
        predicted_volatility = EXCLUDED.predicted_volatility,
        model_used = EXCLUDED.model_used;
    """, (ticker, prediction_date, predicted_price, predicted_volatility, model_used))
    conn.commit()

def get_prediction(ticker):
	query = """
	SELECT ticker, predicted_price, predicted_volatility, model_used
	FROM stock_predictions
	WHERE ticker = %s
	ORDER BY created_at DESC LIMIT 1;
	"""
	cur.execute(query, (ticker,))
	return cur.fetchone()

def get_all_predictions():
    query = """
    SELECT ticker, predicted_price, predicted_volatility
    FROM stock_predictions
    ORDER BY created_at DESC;
    """
    cur.execute(query)
    return cur.fetchall()  # Returns a list of tuples: (ticker, predicted_price, 
