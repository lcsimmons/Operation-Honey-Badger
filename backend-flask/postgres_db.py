import psycopg2
from dotenv import load_dotenv
import os
import uuid
import requests
from psycopg.rows import dict_row
from psycopg2.extras import DictCursor
import json
from datetime import datetime, timedelta, timezone
_psql_db_conn = None

# Actual Database connection
def get_db_connection():
    global _psql_db_conn
    
    #reduce the amount of actual connections
    if _psql_db_conn is None:
        try:
            env_path = ".env"
            load_dotenv(dotenv_path=env_path)
            
            _psql_db_conn = conn = psycopg2.connect(
                host='localhost',
                database=os.environ['DB_NAME'],
                user=os.environ['DB_USERNAME'],
                password=os.environ['DB_PASSWORD'],
                connect_timeout=3  # Increased timeout
            )
            print("Successfully connected to PostgreSQL database")
            return _psql_db_conn
        except Exception as e:
            print(f"Database connection error: {e}")
            return None
    else:
        # Return existing connection if it's still valid
        try:
            # Test if connection is still alive with a simple query
            cur = _psql_db_conn.cursor()
            cur.execute("SELECT 1")
            cur.close()
            return _psql_db_conn
        except Exception:
            # If connection is dead, set to None and try again
            _psql_db_conn = None
            return get_db_connection()

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

    #make sure the dict is in string format
    attacker_info['geolocation'] = json.dumps(attacker_info['geolocation'])

    attacker_id = update_attacker(attacker_info)

    session_id = update_honey_session(attacker_id)
    attack_command = {
        "session_id": session_id,
        "gemini": gemini,
        "attacker_info": attacker_info,
        "request_details": attacker_summary['request_details']
    }

    #update the attack table with the attack command / request information
    update_attack_command(attack_command)

    #generate the json for the log
    attacker_json = generate_attacker_json(attack_command, attacker_id)

    #send to logstash, can have a response if the connection isn't working
    send_log_to_logstash("http://cs412anallam.me", attacker_json)

    #close db connection
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

    print("Attacker id:", attacker_id)

    # Check if this attacker has been seen before
    cur.execute(
        "SELECT * FROM Honeypot_Session where attacker_id = %s ORDER BY last_seen DESC NULLS LAST LIMIT 1",
        (str(attacker_id), )
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
        print("The session id is", str(session_id))
        cur.execute(
            """
            UPDATE Honeypot_Session SET 
                last_seen = CURRENT_TIMESTAMP
            WHERE session_id = %s;
            """,
            (str(session_id), ) #funny, apparently had to make it into a tuple explicitly by adding the comma XD
        )
    else:
        cur.execute(
            """
            INSERT INTO Honeypot_Session 
            (attacker_id) 
            VALUES (%s) RETURNING session_id;
            """,
            (str(attacker_id), )#nvm it actually does need to be a tuple lol
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

#aggregate functions for the soc admin 
# -- attack table
def aggregate_attack_by_type(category="owasp_technique"):
    conn = get_db_connection()
    cur = conn.cursor(cursor_factory=DictCursor)

    curr_categories = ["attack_id", 
                       "session_id", 
                       "request_url", 
                       "interaction_type", 
                       "owasp_technique", 
                       "ioc", 
                       "gemini_response", 
                       "timestamp"]

    if category not in curr_categories:
        raise Exception("Incorrect Column")
    
    # Customize query based on category
    if category == "owasp_technique":
        # Exclude "No Attack Vector" and "No attack Vector"
        query_db = """
            SELECT {0}, COUNT({0}) as count
            FROM attack
            WHERE {0} IS NOT NULL AND {0} NOT IN ('No Attack Vector', 'No attack vector')
            GROUP BY {0}
            ORDER BY COUNT({0}) DESC
            LIMIT 5
        """.format(category)
    else:
        # Standard query with ordering by count and null check
        query_db = """
            SELECT {0}, COUNT({0}) as count
            FROM attack
            WHERE {0} IS NOT NULL
            GROUP BY {0}
            ORDER BY COUNT({0}) DESC
            LIMIT 5
        """.format(category)
    
    # Execute the query
    cur.execute(query_db)

    res = cur.fetchall()

    if res:
        res = [dict(row) for row in res]

    print(res)
    conn.commit()
    cur.close()
    return res

# -- attacker table
def aggregate_attacker_by_type(category="request_url", selection=""):
    conn = get_db_connection()
    cur = conn.cursor(cursor_factory=DictCursor)

    curr_categories = ["attacker_id",
                       "ip_address",
                       "user_agent",
                       "device_fingerprint",
                       "geolocation",
                       "browser",
                       "os",
                       "device_type",
                       "is_bot",
                       "last_seen",
                       "first_seen",
                       "owasp_technique",
                       "request_url"]

    if category not in curr_categories:
        raise Exception("Incorrect Column")

    # Customize query based on category
    if category == "ip_address":
        # Exclude localhost and 127.0.0.1
        query_db = """
            SELECT {0}, COUNT({0}) as count
            FROM attacker
            WHERE {0} IS NOT NULL AND {0} NOT IN ('127.0.0.1', 'localhost', 'Other', 'Unknown', 'unknown')
            GROUP BY {0}
            ORDER BY COUNT({0}) DESC
            LIMIT 5
        """.format(category)
    elif category == "os":
        # Include Other & Unknown for OS
        query_db = """
            SELECT {0}, COUNT({0}) as count
            FROM attacker
            WHERE {0} IS NOT NULL
            GROUP BY {0}
            ORDER BY COUNT({0}) DESC
            LIMIT 5
        """.format(category)
    else:
        # Standard query with ordering by count and null/unkown/other check
        query_db = """
            SELECT {0}, COUNT({0}) as count
            FROM attacker
            WHERE {0} IS NOT NULL AND {0} NOT IN ('Other', 'other', 'Unknown', 'unknown')
            GROUP BY {0}
            ORDER BY COUNT({0}) DESC
            LIMIT 5
        """.format(category)

    # Execute the query
    cur.execute(query_db)

    res = cur.fetchall()

    if res:
        res = [dict(row) for row in res]

    print(res)
    conn.commit()
    cur.close()
    return res


def total_attacker_count():
    conn = get_db_connection()
    cur = conn.cursor(cursor_factory=DictCursor)
    
    query_db = "Select count(*) from attacker;"
    cur.execute(
        query_db
    )

    res = cur.fetchall()

    if res:
        res = [dict(row) for row in res]

    print(res)
    conn.commit()
    cur.close()
    return res

def attacker_engagement(attacker_id=None):
    conn = get_db_connection()
    cur = conn.cursor(cursor_factory=DictCursor)
    query_wrap = "SELECT * from ({}) ORDER BY day ASC;"
    query_db = """

    SELECT
        DATE(hs.first_seen) AS day,
        hs.attacker_id,
        COUNT(*) AS occurrences
    FROM attacker inner join honeypot_session hs on attacker.attacker_id = hs.attacker_id

    """

    params = ()

    if attacker_id:
        query_db += " WHERE hs.attacker_id = %s "
        params = (attacker_id,)

    query_db += """
        GROUP BY day, hs.attacker_id
        ORDER BY day DESC, hs.attacker_id LIMIT 5;
    """

    query_wrap.format(query_db)

    cur.execute(
        query_wrap,
        params
    )

    res = cur.fetchall()

    if res:
        res = [dict(row) for row in res]

    print(res)
    conn.commit()
    cur.close()
    return res

def total_attacker_engagement(attacker_id=None):
    conn = get_db_connection()
    cur = conn.cursor(cursor_factory=DictCursor)

    # query_wrap = "SELECT * from ({}) ORDER BY day ASC;".format(query_db)
    
    query_db = """

    SELECT
        DATE(hs.first_seen) AS day,
        COUNT(*) AS occurrences
    FROM attacker inner join honeypot_session hs on attacker.attacker_id = hs.attacker_id

    """

    params = ()

    if attacker_id:
        query_db += "WHERE  hs.attacker_id = %s "
        params = (attacker_id,)
    
    query_db += """
        GROUP BY day
        ORDER BY day DESC LIMIT 5
    """

    # query_wrap.format(query_db)
    query_wrap = "SELECT * from ({}) ORDER BY day ASC;".format(query_db)

    print(query_wrap)

    cur.execute(
        query_wrap,
        params
    )

    res = cur.fetchall()

    if res:
        res = [dict(row) for row in res]

    print(res)
    conn.commit()
    cur.close()
    return res

def total_report_count():
    conn = get_db_connection()
    cur = conn.cursor(cursor_factory=DictCursor)
    query_db = """

    SELECT
        COUNT(*)
    FROM soc_dashboard;

    """

    cur.execute(
        query_db
    )

    res = cur.fetchone()

    if res:
        res = dict(res)

    print(res)
    conn.commit()
    cur.close()
    return res

def generate_attacker_json(attack_command, attacker_id):

    attacker_log = {
        "ip": attack_command.get("attacker_info").get("ip_address"),
        "user-agent": attack_command.get("attacker_info").get("user_agent"),
        "device-fingerprint": attack_command.get("attacker_info").get("device_fingerprint"),
        "browser OS": f"{attack_command.get('attacker_info').get('browser')} {attack_command.get('attacker_info').get('os')}",
        "device-type": attack_command.get("attacker_info").get("device_type"),
        "bot-or-human": "bot" if attack_command.get("attacker_info").get("is_bot") else "human",
        "first-interaction": attack_command.get("attacker_info").get("first_seen", str(datetime.now())),
        "current-interaction": str(datetime.now()),
        "sessionID": attack_command.get("session_id"),  # Generate a unique session ID
        "payload": attack_command.get("attacker_info").get("payload", ""),
        "gemini-response": attack_command.get("gemini", ""),
        "request-url": attack_command.get("request_details", ""),
        "severity-rating": attack_command.get("attacker_info").get("severity_rating", "high"),  # Default to "low" if not provided
        "incident-response-id": str(uuid.uuid4()),  # Generate a unique incident ID
        "log-id": str(uuid.uuid4()),  # Generate a unique log ID
        "geolocation" : attack_command.get("attacker_info").get("geolocation"),
        "port" : "6969" if attack_command.get("gemini").get("technique") == "Security Misconfiguration" else "",
        "attacker-id" : attacker_id
    }

    return json.dumps(attacker_log, indent=4)

def send_log_to_logstash(elk_url, attacker_json):
    index_name = "attacker_logs"
    url = f"{elk_url}:5044"
    headers = {
        "Content-Type": "application/json"
    }
    try:
        response = requests.post(url, headers=headers, data=attacker_json, timeout=3)
        return response
    except Exception as e: 
        print(e)
        return None
