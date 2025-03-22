import psycopg2
from dotenv import load_dotenv
import os
import uuid
import requests
from psycopg.rows import dict_row
from psycopg2.extras import DictCursor
import psycopg
from datetime import datetime
import json


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

    attacker_json = generate_attacker_json(attacker_info)
    response = send_to_logstash("http://localhost:5044", attacker_json)
    #Response used for debugging

    
    cur.close()

def generate_attacker_json(attacker_info):

    attacker_log = {
        "ip": attacker_info.get("ip_address"),
        "user-agent": attacker_info.get("user_agent"),
        "device-fingerprint": attacker_info.get("device_fingerprint"),
        "browser OS": f"{attacker_info.get('browser')} {attacker_info.get('os')}",
        "device-type": attacker_info.get("device_type"),
        "bot-or-human": "bot" if attacker_info.get("is_bot") else "human",
        "first-interaction": attacker_info.get("first_seen", str(datetime.now())),
        "current-interaction": str(datetime.now()),
        "sessionID": str(uuid.uuid4()),  # Generate a unique session ID
        "payload": attacker_info.get("payload", ""),
        "gemini-response": attacker_info.get("gemini_response", ""),
        "request-url": attacker_info.get("request_url", ""),
        "severity-rating": attacker_info.get("severity_rating", "low"),  # Default to "low" if not provided
        "incident-response-id": str(uuid.uuid4()),  # Generate a unique incident ID
        "log-id": str(uuid.uuid4())  # Generate a unique log ID
    }

    return json.dumps(attacker_log, indent=4)

def send_log_to_logstash(elk_url, attacker_json):
    url = f"{elk_url}/{index_name}/_doc/"
    index_name = "attacker_logs"
    headers = {
        "Content-Type": "application/json"
    }

    response = requests.post(url, headers=headers, data=attacker_json)
    return response 