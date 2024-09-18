from sqlalchemy import create_engine
from app import metadata

# Define your database URL
DATABASE_URL = "postgresql+asyncpg://temp:temp@localhost/advcompro"

# Create the SQLAlchemy engine
engine = create_engine(DATABASE_URL)

# Create all tables defined in the metadata
metadata.create_all(engine)

print("Tables created successfully")
