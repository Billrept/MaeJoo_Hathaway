from psycopg2 import sql
from psycopg2.extras import RealDictCursor
from passlib.context import CryptContext
from psycopg2.extras import RealDictCursor
from sqlalchemy.orm import Session

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def update_user(db, user_id: int, username: str, email: str, password: str = None):
    cursor = db.cursor(cursor_factory=RealDictCursor)
    try:
        if password:
            # Hash the new password if provided
            password_hash = pwd_context.hash(password)
            cursor.execute(
                """
                UPDATE users
                SET username = %s, email = %s, password_hash = %s
                WHERE id = %s
                RETURNING id, username, email;
                """,
                (username, email, password_hash, user_id)
            )
        else:
            cursor.execute(
                """
                UPDATE users
                SET username = %s, email = %s
                WHERE id = %s
                RETURNING id, username, email;
                """,
                (username, email, user_id)
            )
        updated_user = cursor.fetchone()
        db.commit()
        return updated_user
    except Exception as e:
        db.rollback()
        raise e
    finally:
        cursor.close()

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def create_user(db, username: str, email: str, hashed_password: str):
    cursor = db.cursor(cursor_factory=RealDictCursor)
    try:
        # Insert the new user into the users table
        cursor.execute(
            """
            INSERT INTO users (username, email, password_hash)
            VALUES (%s, %s, %s)
            RETURNING id, username, email, password_hash;
            """,
            (username, email, hashed_password)
        )
        new_user = cursor.fetchone()

        cursor.execute(
            """
            INSERT INTO favorites (fav_user)
            VALUES (%s)
            RETURNING fav_id;
            """,
            (new_user['id'],)
        )
        db.commit()

        return new_user
    except Exception as e:
        db.rollback()
        raise e
    finally:
        cursor.close()

def add_stock_to_favorites(db, user_id: int, stock_id: int):
    cursor = db.cursor()
    try:
        # Get the favorite record for the user
        cursor.execute(
            """
            SELECT fav_id FROM favorites WHERE fav_user = %s;
            """,
            (user_id,)
        )
        favorite = cursor.fetchone()

        if favorite:
            # Insert the stock into the favorite_stocks table
            cursor.execute(
                """
                INSERT INTO favorite_stocks (fav_id, stock_id)
                VALUES (%s, %s)
                RETURNING fav_stock_id;
                """,
                (favorite['fav_id'], stock_id)
            )
            updated_favorite = cursor.fetchone()
            db.commit()
            return updated_favorite
        else:
            raise Exception("Favorite record not found for user.")
    except Exception as e:
        db.rollback()
        raise e
    finally:
        cursor.close()

def get_user_by_email(conn, email: str):
    with conn.cursor(cursor_factory=RealDictCursor) as cur:
        query = sql.SQL("""
            SELECT id, username, email, password_hash
            FROM users
            WHERE email = %s;
        """)
        
        cur.execute(query, (email,))
        result = cur.fetchone()

        if result is None:
            return None

        return {
            "username": result['username'],     # username
            "id": result['id'],          # user_id
            "email": result['email'],        # email
            "password_hash": result['password_hash'] # password hash for update
        }

def get_user_by_id(conn, user_id: int):
    try:
        print(f"Querying for user with id: {user_id}")  # Log the ID being queried
        
        # Query the database for the user using raw SQL
        with conn.cursor() as cursor:
            cursor.execute("SELECT id, username, email, password_hash FROM users WHERE id = %s;", (user_id,))
            user = cursor.fetchone()

        if user:
            print(f"User found: {user}")
            return {
                "id": user[0],
                "username": user[1],
                "email": user[2],
                "password_hash" : user[3]
            }
        else:
            print(f"No user found with id: {user_id}")  # Log if no user found
            return None
    except Exception as e:
        print(f"Error fetching user by ID: {e}")
        raise e