import psycopg2
from dotenv import load_dotenv
import os
from psycopg.rows import dict_row
from psycopg2.extras import DictCursor
import psycopg



# Actual Database connection
def get_db_connection():
    env_path = ".env"
    load_dotenv(dotenv_path=env_path)
    conn = psycopg2.connect(host='localhost',
                            database='honeybager_db_postgres',
                            user=os.environ['DB_USERNAME'],
                            password=os.environ['DB_PASSWORD'],
                            )
    print("Database connected successfully")
    return conn

def query_db(query, args=(), one=False):
    #cursor(cursor_factory=psycopg2.extras.DictCursor)
    cur = get_db_connection().cursor(cursor_factory=DictCursor)
    cur.execute(query, args)

    rv = cur.fetchall()

    cur.close()
    return (rv[0] if rv else None) if one else rv

# Example of using the parsed data in the log_attacker_info function
def log_enhanced_attacker_info(attacker_info):
    """Log attacker information with enhanced user agent data to the database"""
    conn = get_db_connection()
    cur = conn.cursor(cursor_factory=DictCursor)
    
    # Check if this attacker has been seen before
    cur.execute(
        "SELECT * FROM Attacker WHERE ip_address = %s AND device_fingerprint = %s",
        (attacker_info["ip_address"], attacker_info["device_fingerprint"])
    )

    exists = cur.fetchone()
    
    if exists:
        # Update last_seen timestamp and other data for returning attackers
        cur.execute(
            """
            UPDATE Attacker SET 
                last_seen = CURRENT_TIMESTAMP, 
                ioc = %s,
                user_agent = %s,
                browser = %s,
                os = %s,
                device_type = %s,
                is_bot = %s
            WHERE ip_address = %s AND device_fingerprint = %s
            """,
            (
                attacker_info["ioc"],
                attacker_info["user_agent"],
                attacker_info["browser"],
                attacker_info["os"],
                attacker_info["device_type"],
                attacker_info["is_bot"],
                attacker_info["ip_address"],
                attacker_info["device_fingerprint"]
            )
        )
    else:
        # Insert new attacker record with enhanced data
        cur.execute(
            """
            INSERT INTO Attacker 
            (ip_address, user_agent, device_fingerprint, geolocation, ioc, browser, os, device_type, is_bot) 
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
            """,
            (
                attacker_info["ip_address"],
                attacker_info["user_agent"],
                attacker_info["device_fingerprint"],
                attacker_info["geolocation"],
                attacker_info["ioc"],
                attacker_info["browser"],
                attacker_info["os"],
                attacker_info["device_type"],
                attacker_info["is_bot"]
            )
        )
    conn.commit()
    cur.close()
