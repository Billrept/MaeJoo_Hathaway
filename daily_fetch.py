import yfinance as yf
import psycopg2
from datetime import datetime, timedelta

# Database connection setup
conn = psycopg2.connect(
    host="localhost",
    database="advcompro",
    user="temp",
    password="temp"
)
cur = conn.cursor()

# Fetch 2 years of stock data from yfinance and store in PostgreSQL
def fetch_and_store_stock_data(ticker):
    end_date = datetime.today().date()
    start_date = end_date - timedelta(days=730)  # 2 years of data

    data = yf.download(ticker, start=start_date, end=end_date)

    for date, row in data.iterrows():
        close_price = float(row['Close'])

        # Insert into stock_history table
        cur.execute("""
        INSERT INTO stock_history (ticker, trade_date, close)
        VALUES (%s, %s, %s)
        ON CONFLICT (ticker, trade_date) 
        DO UPDATE SET close = EXCLUDED.close;
        """, (ticker, date.date(), close_price))
        conn.commit()

# Fetch data for multiple tickers
def fetch_and_update_all():
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
    ]  # Add more tickers as needed
    for ticker in tickers:
        fetch_and_store_stock_data(ticker)
    print("Data fetched and stored successfully.")

if __name__ == "__main__":
    fetch_and_update_all()
    cur.close()
    conn.close()