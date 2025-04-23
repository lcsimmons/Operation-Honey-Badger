
# from __main__ import app
from flask import jsonify, request
from postgres_db import get_db_connection, aggregate_attack_by_type, aggregate_attacker_by_type, attacker_engagement, total_attacker_count

#API Endpoints for SOC Admin frontend
def register_soc_admin_routes(app):
    @app.route('/api/geolocation/country', methods=['GET'])
    def get_country_activity():
        try:
            # Connect to the database - use your PostgreSQL connection 
            # (You might be using SQLAlchemy or psycopg2)
            db = get_db_connection()  # Your database connection function
            cursor = db.cursor()
            
            # PostgreSQL-specific query to extract country from JSON
            query = """
            SELECT 
                (geolocation::json->>'country') as country_code,
                COUNT(*) as activity_count
            FROM 
                attacker
            WHERE 
                geolocation IS NOT NULL
            GROUP BY 
                country_code
            ORDER BY 
                activity_count DESC
            """
            
            # Execute the query
            cursor.execute(query)
            result = cursor.fetchall()
            
            # Convert the result to a dictionary with country code as key and count as value
            country_data = {}
            if result:
                for row in result:
                    country_code = row[0]  # First column is country_code
                    count = row[1]         # Second column is activity_count
                    
                    if country_code:  # Ensure we have a valid country code
                        country_data[country_code] = count
            
            cursor.close()
            db.close()
            
            return jsonify(country_data)
        
        except Exception as e:
            print(f"Database error: {e}")
            return jsonify({"error": f"Database error: {str(e)}"}), 500

    #all the soc-admin functions
    @app.route('/soc-admin/dashboard/attack_type', methods=['GET'])
    @app.route('/soc-admin/dashboard/common_exploits', methods=['GET'])
    def attack_type_report():
        try:
            res = aggregate_attack_by_type(category="owasp_technique")
            return jsonify(res)
        except Exception as e:
            print(e)
            return jsonify({"error": f"Database error: {str(e)}"}), 500

    @app.route('/soc-admin/dashboard/request_url', methods=['GET'])
    @app.route('/soc-admin/dashboard/pages_targeted', methods=['GET'])
    def attack_request_url_report():
        try:
            res = aggregate_attack_by_type(category="request_url")
            return jsonify(res)
        except Exception as e:
            print(e)
            return jsonify({"error": f"Database error: {str(e)}"}), 500

    @app.route('/soc-admin/dashboard/attacker_ip', methods=['GET'])
    def attacker_ip_report():
        try:
            res = aggregate_attacker_by_type(category="ip_address")
            return jsonify(res)
        except Exception as e:
            print(e)
            return jsonify({"error": f"Database error: {str(e)}"}), 500

    @app.route('/soc-admin/dashboard/attacker_user_agent', methods=['GET'])
    def attacker_user_agent_report():
        try:
            res = aggregate_attacker_by_type(category="user_agent")
            return jsonify(res)
        except Exception as e:
            print(e)
            return jsonify({"error": f"Database error: {str(e)}"}), 500

    @app.route('/soc-admin/dashboard/attacker_device_fingerprint', methods=['GET'])
    def attacker_device_fingerprint_report():
        try:
            res = aggregate_attacker_by_type(category="device_fingerprint")
            return jsonify(res)
        except Exception as e:
            print(e)
            return jsonify({"error": f"Database error: {str(e)}"}), 500
        
    @app.route('/soc-admin/dashboard/attacker_geolocation', methods=['GET'])
    def attacker_geolocation_report():
        try:
            res = aggregate_attacker_by_type(category="geolocation")
            return jsonify(res)
        except Exception as e:
            print(e)
            return jsonify({"error": f"Database error: {str(e)}"}), 500

    @app.route('/soc-admin/dashboard/attacker_browser', methods=['GET'])
    def attacker_browser_report():
        try:
            res = aggregate_attacker_by_type(category="browser")
            return jsonify(res)
        except Exception as e:
            print(e)
            return jsonify({"error": f"Database error: {str(e)}"}), 500
        
    @app.route('/soc-admin/dashboard/attacker_os', methods=['GET'])
    def attacker_os_report():
        try:
            res = aggregate_attacker_by_type(category="os")
            return jsonify(res)
        except Exception as e:
            print(e)
            return jsonify({"error": f"Database error: {str(e)}"}), 500
        
    @app.route('/soc-admin/dashboard/total_attackers', methods=['GET'])
    def total_attacker_report():
        try:
            res = total_attacker_count()
            return jsonify(res)
        except Exception as e:
            print(e)
            return jsonify({"error": f"Database error: {str(e)}"}), 500

    @app.route('/soc-admin/dashboard/attacker_engagement', methods=['GET'])
    def attacker_engagement_report():
        attacker_id = request.args.get('attacker_id')
        try:
            res = attacker_engagement(attacker_id=attacker_id)
            return jsonify(res)
        except Exception as e:
            print(e)
            return jsonify({"error": f"Database error: {str(e)}"}), 500
