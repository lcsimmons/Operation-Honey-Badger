import base64
from flask import Flask, jsonify, request, g
import google.generativeai as genai
from dotenv import load_dotenv
load_dotenv(".env") # Load .env variables at startup
from unittest.mock import MagicMock
import os
import sqlite3
import json
import hashlib
from flask_cors import CORS
from user_agents import parse
from decoy_database import get_memory_db
from postgres_db import get_db_connection, log_attacker_information, generate_attacker_json, send_log_to_logstash
from psycopg2.extras import DictCursor

app = Flask(__name__)
# Configure CORS properly - allow all origins for all routes
CORS(app, resources={r"/*": {"origins": "*"}}, allow_headers="*", methods=["GET", "POST", "OPTIONS"])
# cors = CORS(app, resources={r"/api/*": {"origins": "*"}})

#import from other files
# Use register_routes functions instead of * imports

from honeypot_endpoints import register_honeypot_routes
from soc_admin import register_soc_admin_routes

from gemini import analyze_payload

# Register routes
register_honeypot_routes(app)
register_soc_admin_routes(app)

def temp_payload_analysis(ioc_list, request):
    # Check request data for suspicious patterns
    payload = request.data.decode('utf-8') if request.data else ""
    print(type(request.data))
    print(type(request.args))
    if payload == "" and request.args:
        payload = dict(request.args).__str__()
        print(payload)
    

    if any(pattern in payload.lower() for pattern in ["select ", "union ", "insert ", "drop ", "--", "'; ", "' or '", "1=1"]):
        ioc_list.append("Possible SQL injection attempt")
    
    if any(pattern in payload.lower() for pattern in ["<script>", "javascript:", "onerror=", "onload="]):
        ioc_list.append("Possible XSS attempt")

    print("Current IOC list:", ioc_list)

@app.route('/')
def index():
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute('SELECT (name) FROM users;')
    books = cur.fetchall()
    cur.close()
    conn.close()
    return "Worked: " + books[0][0] 

def analyze_login(data):
    if not data or 'username' not in data or 'password' not in data:
        return jsonify({"error": "username and password are required"}), 400

    username_encoded = data['username']
    password_encoded = data['password']
    username = base64.b64decode(username_encoded).decode('utf-8')
    password = base64.b64decode(password_encoded).decode('utf-8')
    
    payload = username + password
    return jsonify({"login": analyze_payload(payload)})


#All the api routes
# @app.route("/api/login", methods=["OPTIONS"])
# def preflight_method():
#     return "",200

@app.route('/api/analyze', methods=['POST'])
def analyze():
    data = request.get_json()
    if not data or 'payload' not in data:
        return jsonify({"error": "No payload provided"}), 400

    payload = data['payload']
    analysis_result = analyze_payload(payload)
    return jsonify({"analysis": analysis_result})


@app.route('/api/log/security_misconfiguration', methods=['POST'])
def logConnection():
    try:
        attacker_info = request.get_json()

        #Hardcoded since we are not sending anything to Gemini
        gemini_analysis_res = {
            "technique": "Security Misconfiguration",
            "iocs": "Port 6969",
            "description": "Port 6969: unauthorized access attempt or scanned"
        }

        print(attacker_info)

        attacker_summary = {
            "attacker_info": attacker_info,
            "gemini": gemini_analysis_res,
            "request_details": {
                "full_url": "N/A",
                "path": "/log/security_misconfiguration",
                "query_string": "N/A",
                "root_path": "N/A"
            }
        }

        log_result = log_attacker_information(attacker_summary)
        
        # Return a success response with status code 200
        return jsonify({
            "status": "success",
            "message": "Attack attempt logged successfully"
        }), 200
        
    except Exception as e:
        # Return an error response with status code 500
        return jsonify({
            "status": "error",
            "message": f"Failed to log attack: {str(e)}"
        }), 500

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

#Testing and debugging
@app.route('/api/test', methods=['GET'])
def test_connection():
    """Simple endpoint to verify connectivity with frontend"""
    return jsonify({
        "message": "Successfully communicated with Flask Backend!"
    })

@app.route('/api/debug/gemini', methods=['GET'])
def debug_gemini():
    payload =  {"request": "/api/test/name=<script>alert('')</script>"}
    # print(jsonify(payload))
    analysis = analyze_payload(payload)
    return analysis

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
        

        db.execute("SELECT * FROM Attack ORDER BY timestamp DESC")

        rows = db.fetchall()

        if rows:
            attacks = [dict(row) for row  in rows]

        print("Getting to this stage")
        reponse_obj = example_ua_queries()
        
        return jsonify({
            "count": len(attackers),
            "attackers": attackers,
            "examples": reponse_obj,
            "attack_information": attacks
        })
    except Exception as e:
        print(e)
        return jsonify({"error": str(e)}), 500
    
#Testing to see honeypot session information
# @app.route('/api/debug/honeypot_session', methods=['GET'])
# def debug_honeypot_session():
#     """Debug endpoint to view attacker records"""
#     try:
#         conn = get_db_connection()
#         db = conn.cursor(cursor_factory=DictCursor)
        
#         db.execute("SELECT * FROM Attacker ORDER BY last_seen DESC")

#         rows = db.fetchall()

#         print(rows)

#         attackers = []

#         if rows:
#             attackers = [dict(row) for row  in rows]

#         print("Getting to this stage")
#         reponse_obj = example_ua_queries()
        
#         return jsonify({
#             "count": len(attackers),
#             "attackers": attackers,
#             "examples": reponse_obj
#         })
#     except Exception as e:
#         print(e)
#         return jsonify({"error": str(e)}), 500

@app.route('/test_generate_json', methods=['GET'])
def test_generate_json():
    # Sample attacker information and attack command for testing
    attacker_info = {
        "ip_address": "192.168.0.1",
        "user_agent": "Mozilla/5.0",
        "device_fingerprint": "sample-fingerprint-123",
        "geolocation": "USA",
        "browser": "Chrome",
        "os": "Windows 10",
        "device_type": "desktop",
        "is_bot": False,
        "first_seen": "1/1/2025",
        "severity_rating": "high",
        "payload": "example_payload"
    }

    attack_command = {
        "session_id": "123013238",
        "gemini": {
            "technique": "SQL Injection",
            "iocs": "12345-67890",
            "description": "An SQL Injection attempt."
        },
        "attacker_info": attacker_info,
        "request_details": {
            "path": "/login"
        }
    }

    attacker_json = generate_attacker_json(attack_command, 1)
    response = send_log_to_logstash("https://cs412anallam.me", attacker_json)

    if not response:
        #Not connecting to the elk
        return jsonify({"error" : "Probably having issue connecting to elk"}), 500
    
    return jsonify({"attacker_log": attacker_json}), 200

@app.route('/api/generate_narrative_report', methods=['GET'])
def generate_narrative_report():
    attacker_id = request.args.get("attacker_id")
    start_date = request.args.get("start_date")
    end_date = request.args.get("end_date")

    if not attacker_id:
        return jsonify({"error": "attacker_id is required"}), 400

    try:
        conn = get_db_connection()
        cur = conn.cursor()

        query = """
            SELECT a.gemini_response
            FROM attack a
            JOIN honeypot_session s ON a.session_id = s.session_id
            WHERE s.attacker_id = %s
        """
        params = [attacker_id]

        if start_date and end_date:
            query += " AND a.timestamp BETWEEN %s AND %s"
            params.extend([start_date, end_date])

        query += " ORDER BY a.timestamp"

        cur.execute(query, params)
        responses = [row[0] for row in cur.fetchall() if row[0]]
        cur.close()
        conn.close()

        if not responses:
            return jsonify({"error": "No Gemini responses found for this attacker"}), 404

        # Format responses into a single narrative prompt
        joined_responses = "\n".join(responses)

        prompt = (
            f"""You are a threat intelligence analyst. Review the following AI-assessed attack interactions and craft a coherent narrative summary.

Each entry represents Gemini's previous analysis of a specific attacker action or payload.

Focus your narrative on behavioral trends, attack techniques, and potential objectives. Avoid repeating every detail; summarize meaningfully.

Entries:
{joined_responses}

Narrative Summary:"""
        )

        model = gemini_client.GenerativeModel('gemini-1.5-flash')
        gemini_output = model.generate_content(prompt)

        # Store in soc_dashboard
        conn = get_db_connection()
        cur = conn.cursor()

        # Get the most recent session_id for this attacker
        cur.execute("""
            SELECT s.session_id
            FROM honeypot_session s
            WHERE s.attacker_id = %s
            ORDER BY s.last_seen DESC
            LIMIT 1
        """, (attacker_id,))
        session_result = cur.fetchone()

        if not session_result:
            return jsonify({"error": "No session found for this attacker"}), 404

        session_id = session_result[0]

        # Insert the report into soc_dashboard
        cur.execute("""
            INSERT INTO soc_dashboard (session_id, severity, summary, affected_components, report)
            VALUES (%s, %s, %s, %s, %s)
        """, (
            session_id,
            1,  # Placeholder severity
            gemini_output.text,
            'N/A',  # Placeholder for affected components
            gemini_output.text  # Using same text for now
        ))

        conn.commit()
        cur.close()
        conn.close()

        return jsonify({
            "attacker_id": attacker_id,
            "session_id": session_id,
            "narrative_summary": gemini_output.text
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500
        

# Joins soc_dashboard with honeypot_session to access report metadata and attacker_id
# Retrieves the most recent reports with timestamps
# Returns data formatted for frontend use        
@app.route('/api/reports', methods=['GET'])
def get_reports():
    try:
        conn = get_db_connection()
        print(f"[DEBUG] DB Connection: {conn}") # DEBUG
        cur = conn.cursor(cursor_factory=DictCursor)

        cur.execute("""
            SELECT s.session_id, s.attacker_id, d.report_id, d.summary, d.severity, d.created_at
            FROM soc_dashboard d
            JOIN honeypot_session s ON s.session_id = d.session_id
            ORDER BY d.created_at DESC
        """)

        rows = cur.fetchall()
        cur.close()
        conn.close()

        reports = [dict(row) for row in rows]

        return jsonify({ "reports": reports })

    except Exception as e:
        return jsonify({ "error": str(e) }), 500

#initialize the in memory database
with app.app_context():
    get_memory_db()

if __name__ == '__main__':
    print("Starting Flask backend server on localhost only...")
    print("Access the test endpoint at: http://localhost:5000/api/test")
    # Setting host to '127.0.0.1' restricts access to local connections only
    app.run(debug=True, host='127.0.0.1', port=5000)