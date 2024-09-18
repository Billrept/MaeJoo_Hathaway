import psycopg2
from psycopg2.extras import RealDictCursor

def create_user(db, username: str, email: str, hashed_password: str):
    cursor = db.cursor(cursor_factory=RealDictCursor)
    try:
        cursor.execute(
            """
            INSERT INTO users (username, email, password_hash)
            VALUES (%s, %s, %s)
            RETURNING id, username, email, password_hash;
            """,
            (username, email, hashed_password)
        )
        new_user = cursor.fetchone()
        db.commit()
        return new_user
    except Exception as e:
        db.rollback()
        raise e
    finally:
        cursor.close()