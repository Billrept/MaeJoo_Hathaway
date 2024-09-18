from databases import Database

POSTGRES_USER = "temp"
POSTGRES_PASSWORD = "temp"
POSTGRES_DB = "advcompro"

database = Database(f'postgresql+asyncpg://{POSTGRES_USER}:{POSTGRES_PASSWORD}@postgres/{POSTGRES_DB}')

# Function to connect to the database
async def connect_db():
    await database.connect()
    print("Database connected")

# Function to disconnect from the database
async def disconnect_db():
    await database.disconnect()
    print("Database disconnected")