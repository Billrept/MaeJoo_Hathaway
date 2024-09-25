import psycopg2
import pandas as pd
from datetime import datetime, timedelta
import os

DATABASE_CONFIG = {
    "host": os.getenv("DB_HOST", "postgres"),
    "database": os.getenv("DB_NAME", "advcompro"),
    "user": os.getenv("DB_USER", "temp"),
    "password": os.getenv("DB_PASSWORD", "temp")
}


def get_db_connection():
    conn = psycopg2.connect(**DATABASE_CONFIG)
    return conn

def get_stock_history(ticker):
    conn = get_db_connection()
    cur = conn.cursor()

    query = """
    SELECT trade_date, close
    FROM stock_history
    WHERE ticker = %s
    ORDER BY trade_date ASC;
    """
    cur.execute(query, (ticker,))
    result = cur.fetchall()

    cur.close()
    conn.close()

    if result:
        df = pd.DataFrame(result, columns=["Date", "Close"])
        df.set_index("Date", inplace=True)

        df = df.apply(pd.to_numeric, errors='coerce').dropna()

        return df
    return None

def get_all_stock_prices():
    connection = get_db_connection()
    cursor = connection.cursor()

    # Query to get the most recent close_price for each ticker
    query = """
    SELECT ticker, close
    FROM stock_history
    WHERE (ticker, trade_date) IN (
        SELECT ticker, MAX(trade_date)
        FROM stock_history
        GROUP BY ticker
    )
    """
    
    cursor.execute(query)
    stock_prices = cursor.fetchall()
    connection.close()

    # Convert the data to a list of dictionaries
    return [{"ticker": ticker, "current_price": f'{float(close_price):.2f}'} for ticker, close_price in stock_prices]

def store_prediction(ticker, predicted_price, predicted_volatility, model_used="ARIMA-GARCH"):
    conn = get_db_connection()
    cur = conn.cursor()

    prediction_date = datetime.today().date() + timedelta(days=1)
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

    cur.close()
    conn.close()

def get_prediction(ticker):
    conn = get_db_connection()
    cur = conn.cursor()

    query = """
    SELECT ticker, predicted_price, predicted_volatility, model_used
    FROM stock_predictions
    WHERE ticker = %s
	ORDER BY prediction_date DESC
    """
    cur.execute(query, (ticker,))
    result = cur.fetchone()

    cur.close()
    conn.close()

    return result

def get_all_predictions():
    conn = get_db_connection()
    cur = conn.cursor()

    query = """
    SELECT ticker, predicted_price, predicted_volatility
    FROM stock_predictions
    ORDER BY created_at DESC;
    """
    cur.execute(query)
    result = cur.fetchall()

    cur.close()
    conn.close()

    return result

def insert_stock_history(ticker, trade_date, close_price):
    conn = get_db_connection()
    cur = conn.cursor()

    cur.execute("""
    INSERT INTO stock_history (ticker, trade_date, close)
    VALUES (%s, %s, %s)
    ON CONFLICT (ticker, trade_date) 
    DO UPDATE SET close = EXCLUDED.close;
    """, (ticker, trade_date, close_price))
    conn.commit()

    cur.close()
    conn.close()