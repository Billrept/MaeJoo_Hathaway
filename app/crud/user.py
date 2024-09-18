from sqlalchemy.orm import Session
from auth.models import User

def get_user_by_username(db: Session, username: str):
    return db.query(User).filter(User.username == username).first()

def create_user(db: Session, username: str, first_name: str, last_name: str, hashed_password: str):
    user = User(username=username, first_name=first_name, last_name=last_name, hashed_password=hashed_password)
    db.add(user)
    db.commit()
    db.refresh(user)
    return user