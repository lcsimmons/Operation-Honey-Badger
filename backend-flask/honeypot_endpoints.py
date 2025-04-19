# from __main__ import app
from flask import jsonify, request
import base64
import hashlib
import os
import sqlite3
import json
import ipinfo
from user_agents import parse
from dotenv import load_dotenv
from decoy_database import get_memory_db
from postgres_db import log_attacker_information
from gemini import analyze_payload_2

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

    load_dotenv('.env')
    geolocation_handler = ipinfo.getHandler(os.environ.get('IP_INFO_ACCESS_TOKEN'))

    geolocation = geolocation_handler.getDetails(ip_address)
    print(type(geolocation.all))
    print(geolocation.all)
    
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
        "geolocation": geolocation.all,
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

def get_attacker_summary(attacker_info):
    #send the information to the ai to process
    payload_to_analyze = {
        "attacker_info": attacker_info,
    }
    
    #Basically ignore using request.data
    # print("Data", request.data)
    # print("Decoded Data", request.data.decode('utf-8'))

    #sent data through post request
    if request.is_json:
        # print("JSON", dict(request.get_json()))
        # print("Data", request.data)
        # print(dict(request.get_json()).items())
        try:
            decoded_request_data = [(row[0],base64.b64decode(row[1]).decode('utf-8')) for row in dict(request.get_json()).items()]
        except:
            #No need to decode
            try:
                decoded_request_data = dict(request.get_json()).items()
            except:
                #sent an application/json content header but with no json
                decoded_request_data = []
        payload_to_analyze['request_data'] = dict(decoded_request_data)
    
    #get any query arguments or strings 
    payload_to_analyze['query_params'] = request.query_string

    #get response from gemini
    gemini_analysis = analyze_payload_2(payload_to_analyze)

    print(gemini_analysis)


    response_string = str(gemini_analysis).split("\n")

    #filter the empty lines
    arr = []
    for row in response_string:
        if row:
            arr.append(row)
    
    response_string = arr

    gemini_analysis_res = {
        "technique": response_string[0],
        "iocs": response_string[1],
        "description": response_string[2] 
    }

    attacker_summary = {
        "attacker_info" : attacker_info,
        "gemini" : gemini_analysis_res,
        "request_details": {
            "full_url": request.url,
            "path": request.path,
            "query_string": request.query_string.decode('utf-8'),
            "root_path": request.root_path
        }
    }

    print(attacker_summary['request_details'])
    print(type(attacker_summary['request_details']))
    # print(attacker_summary['attacker_info'])

    return attacker_summary



def register_honeypot_routes(app):
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
        attacker_info = extract_attacker_info()

        print("Submitted attacker information to database with ip:", attacker_info['ip_address'])

        #continue the request as normal back to the frontend
        if not data or 'username' not in data or 'password' not in data:
            attacker_summary = get_attacker_summary(attacker_info)
            log_attacker_information(attacker_summary)
            return jsonify({"error": "username and password are required"}), 400

        username_encoded = data['username']
        password_encoded = data['password']

        print(username_encoded)
        print(password_encoded)
        try:
            #Attempt to decode if it was encoded through http request
            username = base64.b64decode(username_encoded).decode('utf-8')
            password = base64.b64decode(password_encoded).decode('utf-8')
        except Exception as e:
            username = username_encoded
            password = password_encoded
            print("Did the except")

        # Hash the incoming password before comparison
        hashed_password = hashlib.md5(password.encode()).hexdigest()

        #Check another time if there is a sql injection in the credentils
        if "'" in username or "'" in password:
            attacker_info["ioc"] = json.dumps(["SQL injection in credentials"])

        attacker_summary = get_attacker_summary(attacker_info)
        log_attacker_information(attacker_summary)

        try:
            #purposely using a sql injection susceptible query
            query = "select * from users where username = '" + username + "' and password = '" + hashed_password + "'"

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
                    "user_id": [ row['user_id'] for row in result]
                }), 200
            else:
                return jsonify({"success": False, "message": "Invalid credentials"}), 401
        except sqlite3.Error as e:
            print(f"SQLite error: {e}")
            return jsonify({"error": f"Database error: {str(e)}"}), 500

    #Forgot Password Routes
    def validate_security_answers(username, answers):
        try:
            db = get_memory_db()
            # Fetch user_id based on username
            user = db.execute("SELECT user_id FROM users WHERE username = '" + username + "'")

            user = user.fetchone()
            
            if not user:
                return False, f"User not found. {username}"
            
            user_id = user['user_id']
            
            # Check the answers to the security questions
            # for answer in answers:
            #     question_id = answer.get('question_id')
            #     answer_text = answer.get('answer')

            for item in answers:
                question_id = item["question_id"]
                answer = item["answer"]

            userCheck = db.execute("SELECT * FROM SecurityAnswers WHERE user_id = " + str(user_id) + " AND question_id = " + str(question_id) + " AND answer = '" + answer + "'")

            if not userCheck.fetchone():
                return False, f"Incorrect answer for question."
            
            return True, "Answers validated successfully."
        except Exception as e:
            print(e)
            return False, str(e)


    @app.route('/api/forgot_password', methods=['POST'])
    def forgot_password():
        data = request.json
        username = data.get('username')
        answers = data.get('answers')

        if not username or not answers:
            return jsonify({"error": "Username and answers are required."}), 400

        # Validate security answers
        valid, message = validate_security_answers(username, answers)
        
        if not valid:
            return jsonify({"error": message}), 400

        # Return a message indicating that password reset can proceed
        return jsonify({"message": "Security questions validated. You can reset your password."}), 200

    @app.route('/api/security_questions', methods=['POST'])
    def security_questions():
        data = request.json
        username = data.get('username')

        if not username:
            return jsonify({"error": "Username is required."}), 400

        db = get_memory_db()
        user = db.execute("SELECT user_id FROM users WHERE username = '" + username + "'")
        user = user.fetchone()

        if not user:
                return False, f"User not found. {username}"
        
        user_id = user['user_id']

        questionCheck = db.execute(
        "SELECT sq.question_id, sq.question_text "
        "FROM SecurityAnswers sa "
        "JOIN SecurityQuestions sq ON sa.question_id = sq.question_id "
        "WHERE sa.user_id = " + str(user_id))

        question = questionCheck.fetchone()

        if question:
            return jsonify({
            "question_text": question[1],
            "question_id": question[0]
            }), 200
        else:
            return jsonify({"error": "User not found or invalid user_id."}), 404

    @app.route('/api/change_password', methods=['POST'])
    def change_password():
        data = request.json
        username = data.get('username')
        new_password = data.get('newPassword')

        if not username or not new_password:
            return jsonify({"error": "Username and new password are required."}), 400

        # Fetch the user based on username
        db = get_memory_db()
        userCheck = db.execute("SELECT user_id FROM Users WHERE username = '" + username + "'")
        user = userCheck.fetchone()
        if not user:
            return jsonify({"error": "User not found."}), 404

        user_id = user['user_id']

        new_password = hashlib.md5(new_password.encode()).hexdigest()
        # Update the user's password
        db.execute("UPDATE Users SET password = '" + new_password + "' WHERE user_id = " + str(user_id))
        db.commit()

        #"Password successfully changed."
        return jsonify({"message": True}), 200

    #Forum Routes
    @app.route('/api/forum', methods=['GET'])
    def get_forum():
        request_args = list(request.args.items())

        attacker_info = extract_attacker_info()

        attacker_summary = get_attacker_summary(attacker_info)

        #get the log from the attacker
        log_attacker_information(attacker_summary)
        
        try:
            #actually get the data from the decoy database
            db = get_memory_db()

            query = "Select *  from Forum " \
            "inner join Users as us on Forum.user_id = us.user_id "
            
            # request_args = list(dict(request.args).items())
            if len(request_args) != 0:
                query += "WHERE "

            for i in range(len(request_args)):
                query += request_args[i][0] + " = " + request_args[i][1]
                if i != len(request_args) - 1:
                    query += " AND "

            print(query)
            cur = db.execute(query)
            result = cur.fetchall()

            res = []

            if result:
                res = [dict(row) for row in result]
            return jsonify(res)
        except sqlite3.Error as e:
            print(f"SQLite error: {e}")
            return jsonify({"error": f"Database error: {str(e)}"}), 500

    @app.route('/api/forum', methods=['POST'])
    def add_forum():
        if request.method == "OPTIONS":
            return "", 200
        
        request_data_encoded = request.get_json()

        print(request_data_encoded)

        if ('username' not in request_data_encoded and 'user_id' not in request_data_encoded)  or 'title' not in request_data_encoded or 'description' not in request_data_encoded or 'forum_category' not in request_data_encoded:
            return jsonify({"error": "Bad request, incorrect body data"}), 400

        #decode all the items if possible
        try:
            request_data = {
                key: base64.b64decode(value).decode('utf-8')
                for key, value in request_data_encoded.items()
            }
        except:
            request_data = request_data_encoded

        #get user id
        user_id = ""
        if not 'user_id' in request_data_encoded:
            db = get_memory_db()
            query = "SELECT user_id from Users where username = '" + request_data['username'] + "';" 

            res = db.execute(query).fetchone()

            #not able to find the user
            if not res:
                return jsonify({"error": "Bad request, invalid username"}), 400 
            
            user_id = res['user_id']
        else:
            user_id = request_data['user_id']


        print("Add forum post request data:")
        print(request_data)

        attacker_info = extract_attacker_info()

        attacker_summary = get_attacker_summary(attacker_info)

        #get the log from the attacker
        log_attacker_information(attacker_summary)
        
        try:
            #actually get the data from the decoy database
            db = get_memory_db()

            query = "INSERT INTO Forum (title, description, forum_category, user_id, is_pinned)" \
                " VALUES " \
                "( '" + request_data['title'] + "' , '" + request_data['description'] + "', '" + request_data['forum_category'] + "', '" + str(user_id) + "', " + ('1' if request_data['is_pinned'] else '0') + " ) RETURNING *;"
            
            print(query)
            cur = db.execute(query)
            result = cur.fetchone()
            print(result)

            if result:
                result = dict(result)
                
            return jsonify(result)
        except sqlite3.Error as e:
            print(f"SQLite error: {e}")
            return jsonify({"error": f"Database error: {str(e)}"}), 500
        
    @app.route('/api/forum/comments', methods=['GET'])
    def get_forum_coments():
        request_args = list(request.args.items())


        attacker_info = extract_attacker_info()

        attacker_summary = get_attacker_summary(attacker_info)

        #get the log from the attacker
        log_attacker_information(attacker_summary)
        
        try:
            #actually get the data from the decoy database
            db = get_memory_db()

            query = "Select *, fm.title as forum_title from ForumComments " \
            "inner join Forum as fm on ForumComments.forum_id = fm.forum_id " \
            "inner join Users as us on ForumComments.user_id = us.user_id "
            
            # request_args = list(dict(request.args).items())
            if len(request_args) != 0:
                query += "WHERE "

            for i in range(len(request_args)):
                query += request_args[i][0] + " = " + request_args[i][1]
                if i != len(request_args) - 1:
                    query += " AND "

            print(query)
            cur = db.execute(query)
            result = cur.fetchall()

            res = []

            if result:
                res = [dict(row) for row in result]
            return jsonify(res)
        except sqlite3.Error as e:
            print(f"SQLite error: {e}")
            return jsonify({"error": f"Database error: {str(e)}"}), 500

    @app.route('/api/forum/comments', methods=['POST'])
    def add_forum_comment():
        if request.method == "OPTIONS":
            return "", 200

        request_data_encoded = request.get_json()
        print("Encoded comment payload:", request_data_encoded)

        # Validate basic structure
        if ('username' not in request_data_encoded and 'user_id' not in request_data_encoded) or 'forum_id' not in request_data_encoded or 'comment' not in request_data_encoded:
            return jsonify({"error": "Bad request, missing required fields"}), 400

        try:
            request_data = {
                key: base64.b64decode(value).decode('utf-8')
                for key, value in request_data_encoded.items()
            }
        except Exception as e:
            print("Base64 decoding error:", e)
            request_data = request_data_encoded

        user_id = ""
        if 'user_id' not in request_data:
            db = get_memory_db()
            query = f"SELECT user_id FROM Users WHERE username = '{request_data['username']}';"
            print("Lookup query:", query)
            res = db.execute(query).fetchone()
            if not res:
                return jsonify({"error": "Invalid username"}), 400
            user_id = res['user_id']
        else:
            user_id = request_data['user_id']

        # Log attacker info
        attacker_info = extract_attacker_info()
        attacker_summary = get_attacker_summary(attacker_info)
        log_attacker_information(attacker_summary)

        try:
            db = get_memory_db()
            query = (
                "INSERT INTO ForumComments (forum_id, user_id, comment) "
                f"VALUES ('{request_data['forum_id']}', '{user_id}', '{request_data['comment']}') RETURNING *;"
            )
            print("Insert comment query:", query)
            cur = db.execute(query)
            result = cur.fetchone()

            if result:
                result = dict(result)
            return jsonify(result)

        except sqlite3.Error as e:
            print(f"SQLite error: {e}")
            return jsonify({"error": f"Database error: {str(e)}"}), 500


    #Admin route functions
    @app.route('/api/admin/reimbursement', methods=['GET'])
    def fake_reimbursements():
        #if we want to add some error handling
        # employee_name = request.args.get('name', default = "", type = str)
        # amount = request.args.get('amount', default = 0, type = int)
        
        employee_name = request.args.get('name')
        amount = request.args.get('amount')
        print(request.args.items())

        attacker_info = extract_attacker_info()

        attacker_summary = get_attacker_summary(attacker_info)

        #get the log from the attacker
        log_attacker_information(attacker_summary)
        
        try:
            #actually get the data from the decoy database
            db = get_memory_db()

            query = ""
            if employee_name and amount:
                query = "select * from Expenses inner join Users us on Expenses.user_id = us.user_id WHERE us.name = '" + employee_name + "' AND Expenses.amount = " + amount
            elif employee_name:
                query = "select * from Expenses inner join Users us on Expenses.user_id = us.user_id WHERE us.name = '" + employee_name + "'"
            elif amount:
                query = "select * from Expenses inner join Users us on Expenses.user_id = us.user_id WHERE amount = " + amount
            else:
                query = "select * from Expenses inner join Users us on Expenses.user_id = us.user_id"

            cur = db.execute(query)
            result = cur.fetchall()

            res = []

            if result:
                res = [dict(row) for row in result]
            return jsonify(res)
        except sqlite3.Error as e:
            print(f"SQLite error: {e}")
            return jsonify({"error": f"Database error: {str(e)}"}), 500

    @app.route('/api/admin/it_support', methods=['GET'])
    def fake_it_support():
        request_args = list(request.args.items())

        # print(dict(request.args))
        # print(dict(request.args).items())

        attacker_info = extract_attacker_info()

        attacker_summary = get_attacker_summary(attacker_info)

        #get the log from the attacker
        log_attacker_information(attacker_summary)
        
        try:
            #actually get the data from the decoy database
            db = get_memory_db()

            query = "Select ITSupport.reported_by as reported_by_id, ITSupport.assigned_to as assigned_to_id, user1.name as reported_by, user2.name as assigned_to, ITSupport.* from ITSupport " \
            "inner join Users as user1 on ITSupport.reported_by = user1.user_id " \
            "inner join Users as user2 on ITSupport.assigned_to = user2.user_id "
            
            # request_args = list(dict(request.args).items())
            if len(request_args) != 0:
                query += "WHERE "

            for i in range(len(request_args)):
                query += request_args[i][0] + " = " + request_args[i][1]
                if i != len(request_args) - 1:
                    query += " AND "

            print(query)
            cur = db.execute(query)
            result = cur.fetchall()

            res = []

            if result:
                res = [dict(row) for row in result]
            return jsonify(res)
        except sqlite3.Error as e:
            print(f"SQLite error: {e}")
            return jsonify({"error": f"Database error: {str(e)}"}), 500
        
    @app.route('/api/admin/performance_analytics', methods=['GET'])
    def fake_performance_analytics():
        request_args = list(request.args.items())


        attacker_info = extract_attacker_info()

        attacker_summary = get_attacker_summary(attacker_info)

        #get the log from the attacker
        log_attacker_information(attacker_summary)
        
        try:
            #actually get the data from the decoy database
            db = get_memory_db()

            query = "Select *, d.name as department_name from PerformanceAnalytics " \
            "inner join Department as d on PerformanceAnalytics.department_id = d.department_id "
            
            # request_args = list(dict(request.args).items())
            if len(request_args) != 0:
                query += "WHERE "

            for i in range(len(request_args)):
                query += request_args[i][0] + " = " + request_args[i][1]
                if i != len(request_args) - 1:
                    query += " AND "

            print(query)
            cur = db.execute(query)
            result = cur.fetchall()

            res = []

            if result:
                res = [dict(row) for row in result]
            return jsonify(res)
        except sqlite3.Error as e:
            print(f"SQLite error: {e}")
            return jsonify({"error": f"Database error: {str(e)}"}), 500


    @app.route('/api/admin/corporate_initiatives', methods=['GET'])
    def fake_corporate_initiatives():
        request_args = list(request.args.items())


        attacker_info = extract_attacker_info()

        attacker_summary = get_attacker_summary(attacker_info)

        #get the log from the attacker
        log_attacker_information(attacker_summary)
        
        try:
            #actually get the data from the decoy database
            db = get_memory_db()

            query = "Select * from CorporateInitiatives "
            
            # request_args = list(dict(request.args).items())
            if len(request_args) != 0:
                query += "WHERE "

            for i in range(len(request_args)):
                query += request_args[i][0] + " = " + request_args[i][1]
                if i != len(request_args) - 1:
                    query += " AND "

            print(query)
            cur = db.execute(query)
            result = cur.fetchall()

            res = []

            if result:
                res = [dict(row) for row in result]
            return jsonify(res)
        except sqlite3.Error as e:
            print(f"SQLite error: {e}")
            return jsonify({"error": f"Database error: {str(e)}"}), 500

    @app.route('/api/admin/employees', methods=['GET'])
    def getEmployees():
        request_args = list(request.args.items())
        
        attacker_info = extract_attacker_info()
        attacker_summary = get_attacker_summary(attacker_info)
        log_attacker_information(attacker_summary) #logging to postgres
        
        try:
            # Connect to the database
            db = get_memory_db()
            
            # Base query to get all employees
            query = "SELECT * FROM Users "
            
            # Add WHERE clause if query parameters are provided
            if len(request_args) != 0:
                query += "WHERE "
                
                for i in range(len(request_args)):
                    query += request_args[i][0] + " = '" + request_args[i][1] + "'"
                    if i != len(request_args) - 1:
                        query += " AND "
            
            # Execute the query
            cur = db.execute(query)
            result = cur.fetchall()
            
            # Convert the result to a list of dictionaries
            res = []
            if result:
                res = [dict(row) for row in result]
                
            return jsonify(res)
        
        except sqlite3.Error as e:
            print(f"SQLite error: {e}")
            return jsonify({"error": f"Database error: {str(e)}"}), 500