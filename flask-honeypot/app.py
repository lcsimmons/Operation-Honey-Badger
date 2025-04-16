from flask import Flask, request, jsonify
import requests
import json
import hashlib
import os
from datetime import datetime
from dotenv import load_dotenv
from user_agents import parse

# Initialize Flask
app = Flask(__name__)

# Load environment variables (optional)
load_dotenv()

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

def extract_attacker_info():
    """Extract attacker information from the request with hardcoded payload for port 6969"""
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
    
    # Get geolocation - optional, using ipinfo if available
    geolocation = {"country": "Unknown", "city": "Unknown"}
    try:
        import ipinfo
        ipinfo_token = os.environ.get('IP_INFO_ACCESS_TOKEN')
        if ipinfo_token:
            geolocation_handler = ipinfo.getHandler(ipinfo_token)
            geolocation = geolocation_handler.getDetails(ip_address).all
    except Exception as e:
        print(f"Geolocation lookup failed: {str(e)}")
    
    # Hardcoded IOCs for port 6969
    ioc_list = ["Port Scanning", "Unauthorized Access Attempt"]
    
    # Add user-agent specific IOCs
    if parsed_ua["is_bot"]:
        ioc_list.append("Bot detected")
        
    if user_agent_string and (len(user_agent_string) < 10 or "curl" in user_agent_string.lower() or "wget" in user_agent_string.lower()):
        ioc_list.append("Suspicious User-Agent")
        
    if not parsed_ua["browser"] or parsed_ua["browser"] == "Other":
        ioc_list.append("Unusual browser signature")
    
    # Join IOCs
    ioc = json.dumps(ioc_list)
    
    # Store the full parsed UA data
    user_agent_data = json.dumps(parsed_ua)
    
    return {
        "ip_address": ip_address,
        "user_agent": user_agent_data,
        "device_fingerprint": device_fingerprint,
        "geolocation": geolocation,
        "ioc": ioc,
        "browser": parsed_ua["browser"],
        "os": parsed_ua["os"],
        "device_type": "Mobile" if parsed_ua["is_mobile"] else "Tablet" if parsed_ua["is_tablet"] else "PC" if parsed_ua["is_pc"] else "Other",
        "is_bot": parsed_ua["is_bot"],
        "payload": "Port 6969"  # Hardcoded payload for port 6969 access
    }

def handle_port_6969_connection():
    """
    Handle connection attempt to port 6969, extract attacker info,
    and forward to backend for logging
    """
    try:
        # Load environment from .env.local explicitly if exists
        if os.path.exists('.env.local'):
            load_dotenv('.env.local')

        # Extract attacker information
        attacker_info = extract_attacker_info()
        print(attacker_info)

        # Get backend URL from env or fallback to localhost
        backend_url = os.environ.get('BACKEND_API_URL')

        # Send data to backend
        response = requests.post(
            backend_url,
            json=attacker_info,
            headers={"Content-Type": "application/json"}
        )

        # Check response
        if response.status_code == 200:
            print(f"Successfully logged port 6969 connection from {attacker_info['ip_address']}")
            return True
        else:
            print(f"Failed to log connection: Backend returned status {response.status_code}")
            print(f"Response: {response.text}")
            return False

    except Exception as e:
        print(f"Error handling port 6969 connection: {str(e)}")
        return False

@app.route('/', methods=['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'HEAD', 'PATCH'])
@app.route('/<path:path>', methods=['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'HEAD', 'PATCH'])
def catch_all(path=""):
    """Catch all routes to capture any connection attempts to port 6969"""
    
    # Log the connection attempt
    handle_port_6969_connection()
    
    # Return a generic response to the attacker
    return jsonify({
        "error": "Access denied",
        "message": "This port is not available for external connections"
    }), 403

if __name__ == '__main__':
    app.run(host='127.0.0.1', port=6969)