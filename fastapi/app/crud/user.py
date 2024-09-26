from psycopg2 import sql
from psycopg2.extras import RealDictCursor

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

        # Insert a corresponding record into the favorites table
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


        
def get_user_by_email(conn, username: str):
    with conn.cursor() as cur:
        # Raw SQL query to fetch user by username
        query = sql.SQL("""
            SELECT id, username, email, password_hash
            FROM users
            WHERE email = %s;
        """)
        
        cur.execute(query, (username,))
        result = cur.fetchone()
    
    return result

def update_user(db, username: str, email: str):
	cursor = db.cursor(cursor_factory=RealDictCursor)
	try:
		cursor.execute(
			"""
			UPDATE users
			SET username = %s, email = %s
			WHERE id = %s
			RETURNING id, username, email;
			""",
			(username, email)
		)
		updated_user = cursor.fetchone()
		db.commit()
		return updated_user
	except Exception as e:
		db.rollback()
		raise e
	finally:
		cursor.close()
