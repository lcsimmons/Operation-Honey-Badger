import base64
from flask import Flask, jsonify, request, g
from google import genai
from dotenv import load_dotenv
from unittest.mock import MagicMock
import os
import sqlite3
import json
import hashlib
from flask_cors import CORS
from user_agents import parse
from decoy_database import get_memory_db
from postgres_db import get_db_connection, log_enhanced_attacker_info
from psycopg2.extras import DictCursor

app = Flask(__name__)
# Configure CORS properly - allow all origins for all routes
# CORS(app, resources={r"/api/*": {"origins": "*", "methods": ["GET", "POST", "OPTIONS"]}})
cors = CORS(app, resources={r"/api/*": {"origins": "*"}})


def parse_user_agent(user_agent_string):
    """
    Parse a user agent string into structured data using the user-agents package
    """
    if not user_agent_string:
        return {
            "browser": "Unknown",
            "browser_version": "Unknown",
            "os": "Unknown",
            "device": "Unknown",
            "is_mobile": False,
            "is_tablet": False,
            "is_pc": False,
            "is_bot": False,
            "raw": user_agent_string
        }
    
    try:
        # Parse the user agent string
        user_agent = parse(user_agent_string)
        
        # Extract structured information
        parsed_data = {
            "browser": user_agent.browser.family,
            "browser_version": ".".join(str(v) for v in user_agent.browser.version if v),
            "os": f"{user_agent.os.family} {'.'.join(str(v) for v in user_agent.os.version if v)}".strip(),
            "device": user_agent.device.family,
            "is_mobile": user_agent.is_mobile,
            "is_tablet": user_agent.is_tablet,
            "is_pc": user_agent.is_pc,
            "is_bot": user_agent.is_bot,
            "raw": user_agent_string
        }
        
        return parsed_data
    except Exception as e:
        print(f"Error parsing user agent: {e}")
        return {
            "browser": "Parse Error",
            "browser_version": "Unknown",
            "os": "Unknown",
            "device": "Unknown",
            "is_mobile": False,
            "is_tablet": False,
            "is_pc": False,
            "is_bot": False,
            "raw": user_agent_string,
            "error": str(e)
        }
def example_ua_queries():
    conn = get_db_connection()
    db = conn.cursor()

    # Get count of attacker requests by operating system
    os_stats = db.execute("""
        SELECT os, COUNT(*) as count 
        FROM Attacker 
        GROUP BY os 
        ORDER BY count DESC
    """)
    
    # Get count of mobile vs desktop attacks
    device_stats = db.execute("""
        SELECT device_type, COUNT(*) as count 
        FROM Attacker 
        GROUP BY device_type
    """)
    
    # Get all bot traffic
    bots = db.execute("""
        SELECT COUNT(*) FROM Attacker 
        WHERE is_bot = true
    """)

    #error handling
    os_stats = (os_stats.fetchall()) if os_stats else []
    device_stats = (device_stats.fetchall()) if device_stats else []
    bots = (bots.fetchall()) if bots else []


    conn.close()
    return {
        "os_stats": [dict(row) for row in os_stats],
        "device_stats": [dict(row) for row in device_stats],
        "bots": [dict(row) for row in bots]
    }

def extract_attacker_info_from_request():
    """Extract attacker information from the request with enhanced user agent parsing"""
    # Get IP Address
    ip_address = request.remote_addr
    if request.headers.get('X-Forwarded-For'):
        # If behind a proxy, get the real IP
        ip_address = request.headers.get('X-Forwarded-For').split(',')[0].strip()
    
    # Get and parse User Agent
    user_agent_string = request.headers.get('User-Agent', '')
    parsed_ua = parse_user_agent(user_agent_string)
    
    # Create device fingerprint
    fingerprint_data = {
        'ip': ip_address,
        'user_agent': user_agent_string,
        'accept_language': request.headers.get('Accept-Language', ''),
        'accept_encoding': request.headers.get('Accept-Encoding', '')
    }
    device_fingerprint = hashlib.sha256(json.dumps(fingerprint_data, sort_keys=True).encode()).hexdigest()
    
    # Placeholder for geolocation
    #Will need to get a real service/api to get the geolocation based on IP
    geolocation = "Unknown"
    
    # Look for IOCs
    ioc_list = []

    temp_payload_analysis(ioc_list, request)

    # Add user-agent specific IOCs
    if parsed_ua["is_bot"]:
        ioc_list.append("Bot detected")
        
    if user_agent_string and (len(user_agent_string) < 10 or "curl" in user_agent_string.lower() or "wget" in user_agent_string.lower()):
        ioc_list.append("Suspicious User-Agent")
        
    if not parsed_ua["browser"] or parsed_ua["browser"] == "Other":
        ioc_list.append("Unusual browser signature")
    
    # Join IOCs or set to null
    ioc = json.dumps(ioc_list) if ioc_list else None
    
    # Store the full parsed UA data
    user_agent_data = json.dumps(parsed_ua)
    
    return {
        "ip_address": ip_address,
        "user_agent": user_agent_data,  # Store the full parsed data as JSON
        "device_fingerprint": device_fingerprint,
        "geolocation": geolocation,
        "ioc": ioc,
        # Additional parsed fields for easy querying
        "browser": parsed_ua["browser"],
        "os": parsed_ua["os"],
        "device_type": "Mobile" if parsed_ua["is_mobile"] else "Tablet" if parsed_ua["is_tablet"] else "PC" if parsed_ua["is_pc"] else "Other",
        "is_bot": parsed_ua["is_bot"]
    }


def temp_payload_analysis(ioc_list, request):
    # Check request data for suspicious patterns
    payload = request.data.decode('utf-8') if request.data else ""

    if any(pattern in payload.lower() for pattern in ["select ", "union ", "insert ", "drop ", "--", "'; ", "' or '", "1=1"]):
        ioc_list.append("Possible SQL injection attempt")
    
    if any(pattern in payload.lower() for pattern in ["<script>", "javascript:", "onerror=", "onload="]):
        ioc_list.append("Possible XSS attempt")

    print("Current IOC list:", ioc_list)
    

# Gemini initialization
def init_gemini():
    if os.environ.get('FLASK_TESTING') == 'true':
        # Return a mock or dummy client for testing
        return MagicMock()
    else:
        # Real implementation for production
        env_path = ".env"  # Changed from "../.env" to match DB path
        load_dotenv(dotenv_path=env_path)
        key = os.getenv("GEMINI_API_KEY")
        return genai.Client(api_key=key) 

# Initialize Gemini client
gemini_client = init_gemini()

@app.route('/')
def index():
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute('SELECT (name) FROM users;')
    books = cur.fetchall()
    cur.close()
    conn.close()
    return "Worked: " + books[0][0] 

def analyze_payload(payload):
    prompt = (
        f"""As a cybersecurity expert, analyze each of these web application payloads and determine the attack vector being used.
        Choose ONLY from the following attack vectors for each payload:
        Broken Access Control, Cryptographic Failures, Injection, Insecure Design, Security Misconfiguration, Vulnerable and 
        Outdated Components, Identification and Authentication Failures, Software and Data Integrity Failures, Security 
        Logging and Monitoring Failures, Server-Side Request Forgery
        Respond ONLY with the attack vector.
        Payload:
        {payload}
        """ )
    try:
        response = gemini_client.models.generate_content(
            model="gemini-1.5-flash",
            contents=prompt
        )
        return response.text
    except Exception as e:
        return f"Error: {e}"
    
@app.route("/api/login", methods=["OPTIONS"])
def preflight_method():
    return "",200

@app.route('/api/analyze', methods=['POST'])
def analyze():
    data = request.get_json()
    if not data or 'payload' not in data:
        return jsonify({"error": "No payload provided"}), 400

    payload = data['payload']
    analysis_result = analyze_payload(payload)
    return jsonify({"analysis": analysis_result})

@app.route('/api/login', methods=["POST", "OPTIONS"])
def handleDecoyLogin():
    if request.method == "OPTIONS":
        return "", 200

    data = request.get_json()

    if not data:
        return jsonify({"error": "No data provided. Invalid Request"}), 400
    
    if 'username' not in data or 'password' not in data:
        return jsonify({"error": "Username and password are required"}), 400

    #anaylyze the payload
    # analysis_res = analyze_login(data)

    #send the result to actual db
    #should send the request without having to pass it as parameter
    attacker_info = extract_attacker_info_from_request()

    log_enhanced_attacker_info(attacker_info)
    print("Submitted attacker information to database with ip:", attacker_info['ip_address'])

    #continue the request as normal back to the frontend
    if not data or 'username' not in data or 'password' not in data:
        return jsonify({"error": "username and password are required"}), 400

    username_encoded = data['username']
    password_encoded = data['password']

    username = base64.b64decode(username_encoded).decode('utf-8')
    password = base64.b64decode(password_encoded).decode('utf-8')

    # Hash the incoming password before comparison
    hashed_password = hashlib.md5(password.encode()).hexdigest()

    #Check another time if there is a sql injection in the credentils
    if "'" in username or "'" in password:
        attacker_info["ioc"] = json.dumps(["SQL injection in credentials"])
        log_enhanced_attacker_info(attacker_info)

    try:
        #purposely using a sql injection susceptible query
        query = "select id,username, password from users where username = '" + username + "' and password = '" + hashed_password + "'"

        db = get_memory_db()

        cur = db.execute(query)
        result = cur.fetchall()

        if result:
            result = [dict(res) for res  in result]

        print(result)

        # query = "SELECT * FROM Users WHERE username = ? AND password = ?"
        # result = db.execute(query, (username, password)).fetchone()
    
        if result:
            return jsonify({
                "success": True, 
                "username": [ row['username'] for row in result],
                "id": [ row['id'] for row in result]
            }), 200
        else:
            return jsonify({"success": False, "message": "Invalid credentials"}), 401
    except sqlite3.Error as e:
        print(f"SQLite error: {e}")
        return jsonify({"error": f"Database error: {str(e)}"}), 500

def analyze_login(data):
    if not data or 'username' not in data or 'password' not in data:
        return jsonify({"error": "username and password are required"}), 400

    username_encoded = data['username']
    password_encoded = data['password']
    username = base64.b64decode(username_encoded).decode('utf-8')
    password = base64.b64decode(password_encoded).decode('utf-8')
    
    payload = username + password
    return jsonify({"login": analyze_payload(payload)})

@app.route('/api/test', methods=['GET'])
def test_connection():
    """Simple endpoint to verify connectivity with frontend"""
    return jsonify({
        "message": "Successfully communicated with Flask Backend!"
    })

#debug the in memory database
@app.route('/api/debug/decoy_db', methods=['GET'])
def debug_db():
    """Debug endpoint to check database state"""
    db = get_memory_db()
    tables = db.execute("SELECT name FROM sqlite_master WHERE type='table'").fetchall()
    tables = [t[0] for t in tables]
    
    user_count = db.execute("SELECT COUNT(*) FROM users").fetchone()[0]
    sample_user = dict(db.execute("SELECT * FROM users LIMIT 1").fetchone()) if user_count > 0 else None
    
    return jsonify({
        "tables": tables,
        "user_count": user_count,
        "sample_user": sample_user
    })

#Testing to see attacker information
@app.route('/api/debug/attackers', methods=['GET'])
def debug_attackers():
    """Debug endpoint to view attacker records"""
    try:
        conn = get_db_connection()
        db = conn.cursor(cursor_factory=DictCursor)
        
        db.execute("SELECT * FROM Attacker ORDER BY last_seen DESC")

        rows = db.fetchall()

        print(rows)

        attackers = []

        if rows:
            attackers = [dict(row) for row  in rows]

        print("Getting to this stage")
        reponse_obj = example_ua_queries()
        
        return jsonify({
            "count": len(attackers),
            "attackers": attackers,
            "examples": reponse_obj
        })
    except Exception as e:
        print(e)
        return jsonify({"error": str(e)}), 500


#initialize the in memory database
with app.app_context():
    get_memory_db()

if __name__ == '__main__':
    print("Starting Flask backend server on localhost only...")
    print("Access the test endpoint at: http://localhost:5000/api/test")
    # Setting host to '127.0.0.1' restricts access to local connections only
    app.run(debug=True, host='127.0.0.1', port=5000)