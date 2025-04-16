import sqlite3
from flask import Flask

app = Flask(__name__)

_app_db_conn = None

#In memory database connection
def get_memory_db():
    global _app_db_conn
    
    # Create the connection if it doesn't exist
    if _app_db_conn is None:
        
        _app_db_conn = sqlite3.connect(
            "file::memory:?cache=shared",
            uri=True,
            check_same_thread=False
        )
        _app_db_conn.row_factory = sqlite3.Row
        
        # Initialize the schema here to ensure it's done before any queries
        init_decoy_db(_app_db_conn)
    
    return _app_db_conn

def query_memory_db(query, args=(), one=False):
    cur = get_memory_db().execute(query, args)
    if not cur:
        return None
    rv = cur.fetchall()
    cur.close()
    return (rv[0] if rv else None) if one else rv

def init_decoy_db(connection):
    db = connection
    with app.open_resource('inmemory_schema.sql', mode='r') as f:
        db.cursor().executescript(f.read())
    db.commit()

    gen_data_path = "../generate-database-data/populate_decoy_memory_db2.sql"

    with app.open_resource(gen_data_path, mode='r') as f:
        db.cursor().executescript(f.read())
    db.commit()

    #Forum data
    forum_data_path = "../generate-database-data/modified_forum.sql"

    with app.open_resource(forum_data_path, mode='r') as f:
        db.cursor().executescript(f.read())
    db.commit()

    # print("Prove it works")
    # user = query_memory_db('select * from users where username = ?',
    #         ["jwoodard"], one=True)
    # if user is None:
    #     print('No such user')
    # else:
    #     print('jwoodard has the id', user['id'])
