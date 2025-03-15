from faker import Faker
import random
import base64
import hashlib

fake = Faker() 

def generate_users():
    first_name = fake.unique.first_name()
    last_name = fake.unique.last_name()

    name = first_name + " " + last_name
    username = (first_name[0] + last_name).lower()
    password = hashlib.md5(fake.password().encode()).hexdigest()
    department_id = random.randint(1, 3)
    title = fake.job()
    privileges = "Standard User"

    # Escape single quotes for SQL
    name = name.replace("'", "''")
    title = title.replace("'", "''")

    return f"INSERT INTO Users (name, username, password, title, department_id, privileges) VALUES ('{name}', '{username}', '{password}', '{title}', {department_id}, '{privileges}');"

def generate_department():
    departments = ["IT", "Human Resources", "Finance"]
    sql_statements = []
    for i, dept in enumerate(departments, start=1):
        sql = f"INSERT INTO Department (id, name) VALUES ({i}, '{dept}');"
        sql_statements.append(sql)
    return "\n".join(sql_statements)

def generate_cloud_resources():
    categories = ["Compute", "Storage", "Networking"]
    category = random.choice(categories)
    department_id = random.randint(1, 3)
    access_requirement = random.choice(["Public", "Private", "Restricted"])
    session_duration = random.randint(5, 180)  
    key_public = hashlib.md5(fake.word().encode()).hexdigest()
    key_private = hashlib.md5(fake.word().encode()).hexdigest()
    
    return f"INSERT INTO CloudResources (category, department_id, access_requirement, session_duration, key_public, key_private) VALUES ('{category}', {department_id}, '{access_requirement}', {session_duration}, '{key_public}', '{key_private}');"

def generate_keys():
    resource_id = random.randint(1, 623)  # Assuming we'll generate 623 resources
    is_public_key = random.choice([0, 1])  # 0 for private, 1 for public
    key_value = hashlib.md5(fake.word().encode()).hexdigest()
    
    return f"INSERT INTO Keys (resource_id, is_public_key, key_value) VALUES ({resource_id}, {is_public_key}, '{key_value}');"

def generate_forum():
    title_bytes = fake.sentence(nb_words=5).encode("ascii")
    title = base64.b64encode(title_bytes).decode()
    description_bytes = fake.text(max_nb_chars=100).encode("ascii")
    description = base64.b64encode(description_bytes).decode()
    forum_category = random.choice(["General", "Announcements", "Support"])
    
    # Escape single quotes for SQL
    title = title.replace("'", "''")
    description = description.replace("'", "''")
    
    return f"INSERT INTO Forum (title, description, forum_category) VALUES ('{title}', '{description}', '{forum_category}');"

def generate_forum_comments():
    forum_id = random.randint(1, 1032)  # Assuming we'll generate 1032 forums
    user_id = random.randint(1, 187)  # Assuming we'll generate 187 users
    comment_bytes = fake.sentence(nb_words=10).encode("ascii")
    comment = base64.b64encode(comment_bytes).decode()
    timestamp = fake.date_time_this_year().strftime("%Y-%m-%d %H:%M:%S")
    
    # Escape single quotes for SQL
    comment = comment.replace("'", "''")
    
    return f"INSERT INTO ForumComments (forum_id, user_id, comment, timestamp) VALUES ({forum_id}, {user_id}, '{comment}', '{timestamp}');"

def add_stored_users(index):
    users = {
        "admin": { "firstname": "admin", "lastname": "admin", "password": "password123", "avatar": "/default.png", "question": "What is your favorite color?", 'answer': "blue" },
        "employee": { "firstname": "employee", "lastname": "employee",  "password": "securepass", "avatar": "/default.png", "question": "What is 2+2?", 'answer': "4" },
        "bob": { "firstname": "bob", "lastname": "bob", "password": "1234", "avatar": "/default.png", "question": "What is your pet’s name?", 'answer': "fluffy" }
    }

    users = list(users.items())

    # print(users)
    user = users[index][1]
    # print(user)
    
    first_name = user['firstname']
    last_name = user['lastname']

    name = first_name + " " + last_name
    username = (first_name[0] + last_name).lower()
    password = hashlib.md5(user['password'].encode()).hexdigest()
    department_id = random.randint(1, 3)
    title = fake.job()
    privileges = "Standard User"

    # Escape single quotes for SQL
    name = name.replace("'", "''")
    title = title.replace("'", "''")

    return f"INSERT INTO Users (name, username, password, title, department_id, privileges) VALUES ('{name}', '{username}', '{password}', '{title}', {department_id}, '{privileges}');"

def generate_sql_insert():
    statements = []
    
    # Start with a transaction for better performance
    statements.append("BEGIN TRANSACTION;")
    
    # Generate departments first (3 departments)
    statements.append(generate_department())
    
    # Generate 187 users
    for _ in range(187):
        statements.append(generate_users())

    for i in range(3):
        statements.append(add_stored_users(i))
    
    # Generate 623 cloud resources
    for _ in range(623):
        statements.append(generate_cloud_resources())
    
    # Generate 187 keys
    for _ in range(187):
        statements.append(generate_keys())
    
    # Generate 1032 forums
    for _ in range(1032):
        statements.append(generate_forum())
    
    # Generate 1632 forum comments
    for _ in range(1632):
        statements.append(generate_forum_comments())
    
    # Commit the transaction
    statements.append("COMMIT;")
    
    full_sql = "\n".join(statements)
 
    with open("populate_decoy_memory_db.sql", "w") as file:
        file.write(full_sql)

generate_sql_insert()