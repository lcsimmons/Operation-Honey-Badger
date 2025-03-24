import psycopg2
from dotenv import load_dotenv
import os
from psycopg.rows import dict_row
from psycopg2.extras import DictCursor
import psycopg
from datetime import datetime, timedelta, timezone

_psql_db_conn = None

# Actual Database connection
def get_db_connection():
    global _psql_db_conn
    #reduce the amount of actual connections
    if _psql_db_conn is None:
        env_path = ".env"
        load_dotenv(dotenv_path=env_path)
        _psql_db_conn = conn = psycopg2.connect(host='localhost',
                                database='honeybager_db_postgres',
                                user=os.environ['DB_USERNAME'],
                                password=os.environ['DB_PASSWORD'],
                                )
        print("Database connected successfully")
    return _psql_db_conn

def query_db(query, args=(), one=False):
    #cursor(cursor_factory=psycopg2.extras.DictCursor)
    cur = get_db_connection().cursor(cursor_factory=DictCursor)
    cur.execute(query, args)

    rv = cur.fetchall()

    cur.close()
    return (rv[0] if rv else None) if one else rv

# Example of using the parsed data in the log_attacker_info function
def log_attacker_information(attacker_summary):
    """Log attacker information with enhanced user agent data to the database"""
    conn = get_db_connection()
    cur = conn.cursor(cursor_factory=DictCursor)

    attacker_info = attacker_summary['attacker_info']
    gemini = attacker_summary['gemini']

    attacker_id = update_attacker(attacker_info)

    session_id = update_honey_session(attacker_id)
    attack_command = {
        "session_id": session_id,
        "gemini": gemini,
        "attacker_info": attacker_info,
        "request_details": attacker_summary['request_details']
    }

    update_attack_command(attack_command)

    conn.commit()
    cur.close()


def update_attacker(attacker_info):
    conn = get_db_connection()
    cur = conn.cursor(cursor_factory=DictCursor)

    # Check if this attacker has been seen before
    cur.execute(
        "SELECT * FROM Attacker WHERE ip_address = %s AND device_fingerprint = %s",
        (attacker_info["ip_address"], attacker_info["device_fingerprint"])
    )

    exists = cur.fetchone()
    attacker_id = ""
    if exists:
        # Update last_seen timestamp and other data for returning attackers
        attacker_id = exists['attacker_id']
        cur.execute(
            """
            UPDATE Attacker SET 
                last_seen = CURRENT_TIMESTAMP, 
                user_agent = %s,
                browser = %s,
                os = %s,
                device_type = %s,
                is_bot = %s
            WHERE ip_address = %s AND device_fingerprint = %s
            """,
            (
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
            (ip_address, user_agent, device_fingerprint, geolocation, browser, os, device_type, is_bot) 
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s) RETURNING attacker_id;
            """,
            (
                attacker_info["ip_address"],
                attacker_info["user_agent"],
                attacker_info["device_fingerprint"],
                attacker_info["geolocation"],
                attacker_info["browser"],
                attacker_info["os"],
                attacker_info["device_type"],
                attacker_info["is_bot"]
            )
        )

        attacker_id = cur.fetchone()
        attacker_id = attacker_id['attacker_id']
    conn.commit()
    cur.close()
    return attacker_id

def update_honey_session(attacker_id):
    conn = get_db_connection()
    cur = conn.cursor(cursor_factory=DictCursor)

    # Check if this attacker has been seen before
    cur.execute(
        "SELECT * FROM Honeypot_Session where attacker_id = %s ORDER  BY last_seen DESC NULLS LAST LIMIT 1",
        str(attacker_id)
    )

    exists = cur.fetchone()
    session_id = ""
    current_time_utc = datetime.now(timezone.utc)
    # print(current_time_utc)
    # print(current_time_utc - timedelta(minutes=15))
    # another_time = current_time_utc - timedelta(minutes=5)
    # print(timedelta(minutes=10))
    # print(current_time_utc - another_time >= timedelta(minutes=10))
    # last_dt = parser("2025-03-21 23:14:55.120000")
    #conversion
    # last_dt = datetime.strptime("2025-03-21 23:14:55.120000", "%Y-%m-%d %H:%M:%S.%f")

    # print(last_dt)

    #check to see if it's in the 15 minute time window
    if exists:
        #make the time from psql timezone aware
        last_seen = datetime.strptime(str(exists["last_seen"]), "%Y-%m-%d %H:%M:%S.%f").replace(tzinfo=timezone.utc)
        # print(current_time_utc)
        print("Last seen:", last_seen)
        time_diff = current_time_utc - last_seen
        print(time_diff)
        # print(time_diff >= timedelta(minutes=15))

        #False if it goes past 15 minutes
        exists = exists if current_time_utc - last_seen <= timedelta(minutes=15) else False


    if exists:
        # if datetime.now(tzinfo=datetime.timezone.utc) - exists['last_seen'] < 15 : 
        # Update last_seen timestamp
        session_id = exists["session_id"]
        cur.execute(
            """
            UPDATE Honeypot_Session SET 
                last_seen = CURRENT_TIMESTAMP
            WHERE session_id = %s;
            """,
            (
                str(session_id)
            )
        )
    else:
        cur.execute(
            """
            INSERT INTO Honeypot_Session 
            (attacker_id) 
            VALUES (%s) RETURNING session_id;
            """,
            (
                str(attacker_id)
            )
        )

        session_id = cur.fetchone()
        session_id = session_id['session_id']
    conn.commit()
    cur.close()
    return session_id


def update_attack_command(attacker_command):
    conn = get_db_connection()
    cur = conn.cursor(cursor_factory=DictCursor)

    attacker_info = attacker_command['attacker_info']
    gemini = attacker_command['gemini']
    request_details = attacker_command['request_details']


    #insert the information
    cur.execute(
            """
            INSERT INTO Attack 
            (session_id, request_url, interaction_type, owasp_technique, ioc, gemini_response) 
            VALUES (%s, %s, %s, %s, %s, %s);
            """,
            (
                str(attacker_command['session_id']),
                request_details['path'],
                attacker_info['device_type'],
                gemini['technique'],
                gemini['iocs'],
                gemini['description']
            )
    )

    # print("Insert successful", cur.fetchone())
    conn.commit()
    cur.close()