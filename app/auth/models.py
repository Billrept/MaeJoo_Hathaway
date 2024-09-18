from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, Table
from sqlalchemy.orm import relationship
from database import Base

# Association table to link users and their top 10 interested stocks
user_stock_association = Table(
    'user_stock',
    Base.metadata,
    Column('user_id', Integer, ForeignKey('users.id')),
    Column('ticker', String, ForeignKey('stock_history.ticker'))
)

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    first_name = Column(String, index=True)
    last_name = Column(String, index=True)
    hashed_password = Column(String)
    two_factor_enabled = Column(Boolean, default=False)
    
    # Relationship to the top 10 interested stocks
    interested_stocks = relationship("StockHistory", secondary=user_stock_association)