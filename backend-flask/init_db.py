import psycopg2
import os
from dotenv import load_dotenv

env_path = ".env"

load_dotenv(dotenv_path=env_path)


def get_db_connection():
    try:
        conn = psycopg2.connect(host='localhost',
                                database='honeybager_db_postgres',
                                user=os.environ['DB_USERNAME'],
                                password=os.environ['DB_PASSWORD'],#hardcode for now
                                connect_timeout=1
                                )

                                #user=os.environ['DB_USERNAME'],
                                #password=os.environ['DB_PASSWORD'])
        return conn
    except:
        return None


def create_table():
    conn = get_db_connection()
    if(conn == None):
        print("Connection failed")
        return 
    cur = conn.cursor()

    # Execute a command: this creates a new table
    cur.execute('DROP TABLE IF EXISTS Users CASCADE;')
    cur.execute(""" CREATE TABLE Users (
                        user_id serial primary key not null,
                        username text,
                        password text,
                        name text,
                        position int,
                        privileges text); """
                );
    
    cur.execute('DROP TABLE IF EXISTS Attacker CASCADE;')
    cur.execute(""" CREATE TABLE Attacker (
                        attacker_id serial primary key,
                        ip_address TEXT,
                        user_agent TEXT,
                        device_fingerprint TEXT,
                        geolocation TEXT,
                        --- ioc TEXT, might need to remove this
                        browser TEXT,       
                        os TEXT,                 
                        device_type TEXT,        
                        is_bot BOOLEAN,        
                        last_seen TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                        first_seen TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
                    ); """
                
                
                );
    
    cur.execute('DROP TABLE IF EXISTS Honeypot_Session CASCADE;')
    cur.execute(""" CREATE TABLE Honeypot_Session (
                        session_id serial primary key ,
                        attacker_id serial references Attacker(attacker_id),
                        last_seen timestamp DEFAULT CURRENT_TIMESTAMP,
                        first_seen timestamp DEFAULT CURRENT_TIMESTAMP
                    ); """
                );

    cur.execute('DROP TABLE IF EXISTS Attack CASCADE;')
    cur.execute(""" CREATE TABLE Attack
                    (
                        session_id       serial references Honeypot_Session (session_id),
                        request_url text,
                        interaction_type text,
                        owasp_technique text,
                        ioc text,
                        gemini_response text,
                        timestamp timestamp DEFAULT CURRENT_TIMESTAMP
                    ); """
                );        
    
    cur.execute('DROP TABLE IF EXISTS SOC_Dashboard CASCADE;')
    cur.execute(""" CREATE TABLE SOC_Dashboard
                    (
                        report_id       serial primary key,
                        session_id serial references  Honeypot (session_id),
                        severity integer,
                        summary text,
                        affected_components text,
                        report text
                    ); """
                ); 
    

    #commit to the database
    conn.commit()


    #close the connections
    cur.close()
    conn.close()


create_table()
# insert_to_table()