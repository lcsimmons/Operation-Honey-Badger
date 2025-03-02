from flask import Flask, jsonify, request
from google import genai
from dotenv import load_dotenv
import os

app = Flask(__name__)

def init_gemini():
    env_path = "../.env"
    load_dotenv(dotenv_path=env_path)
    key = os.getenv("GEMINI_API_KEY")
    return genai.Client(api_key=key) 

gemini_client = init_gemini()

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

@app.route('/api/analyze', methods=['POST'])
def analyze():
    data = request.get_json()
    if not data or 'payload' not in data:
        return jsonify({"error": "No payload provided"}), 400

    payload = data['payload']
    analysis_result = analyze_payload(payload)
    return jsonify({"analysis": analysis_result})

@app.route('/api/test', methods=['GET'])
def test_connection():
    """Simple endpoint to verify connectivity with frontend"""
    return jsonify({
        "message": "Successfully communicated with Flask Backend!"
    })

if __name__ == '__main__':
    print("Starting Flask backend server on localhost only...")
    print("Access the test endpoint at: http://localhost:5000/api/test")
    # Setting host to '127.0.0.1' restricts access to local connections only
    app.run(debug=True, host='127.0.0.1', port=5000)