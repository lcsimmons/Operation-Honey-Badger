from faker import Faker
import random
import hashlib

fake = Faker() 


def generate_users():
    first_name = fake.unique.first_name()
    last_name = fake.unique.last_name()

    name = first_name + " " + last_name
    username = (first_name[0] + last_name).lower()
    password = hashlib.md5(fake.password().encode()).hexdigest()
    department_id = random.randint(1, 3)
    title = random.randint(1, 10)
    privileges = "Standard User"

    return f"INSERT INTO Users (Name, Username, Password, Title, DepartmentID, Privileges) VALUES ('{name}', '{username}', '{password}', {title}, {department_id}, '{privileges}') RETURNING UserID;"

def generate_department():
    departments = ["IT", "Human Resources", "Finance"]
    sql_statements = []
    for i, dept in enumerate(departments, start=1):
        sql = f"INSERT INTO Department (DepartmentID, Name) VALUES ({i}, '{dept}');"
        sql_statements.append(sql)
    return "\n".join(sql_statements)

def generate_cloud_resources():
    categories = ["Compute", "Storage", "Networking"]
    resource_id = random.randint(1000, 9999)
    category = random.choice(categories)
    department_id = random.randint(1, 3)
    access_requirement = random.choice(["Public", "Private", "Restricted"])
    session_duration = random.randint(5, 180)  
    key_public = hashlib.md5(fake.word().encode()).hexdigest()
    key_private = hashlib.md5(fake.word().encode()).hexdigest()
    
    return f"INSERT INTO CloudResources (ResourceID, Category, DepartmentID, AccessRequirement, SessionDuration, KeyPublic, KeyPrivate) VALUES ({resource_id}, '{category}', {department_id}, '{access_requirement}', {session_duration}, '{key_public}', '{key_private}');"

def generate_keys():
    key_id = random.randint(10000, 99999)
    resource_id = random.randint(1000, 9999)
    key_type = random.choice(["Public", "Private"])
    key_value = hashlib.md5(fake.word().encode()).hexdigest()
    
    return f"INSERT INTO Keys (KeyID, ResourceID, KeyType, KeyValue) VALUES ({key_id}, {resource_id}, '{key_type}', '{key_value}');"

def generate_forum_comments():
    comment_id = random.randint(1000, 9999)
    forum_id = random.randint(100, 300)
    user_id = random.randint(1, 187) 
    comment = fake.sentence(nb_words=10).replace("'", "''")
    timestamp = fake.date_time_this_year().strftime("%Y-%m-%d %H:%M:%S")
    
    return f"INSERT INTO ForumComments (CommentID, ForumID, UserID, Comment, Timestamp) VALUES ({comment_id}, {forum_id}, {user_id}, '{comment}', '{timestamp}');"


def generate_forum():
    forum_id = random.randint(100, 300)
    title = fake.sentence(nb_words=5).replace("'", "''")
    description = fake.text(max_nb_chars=100).replace("'", "''")
    forum_category = random.choice(["General", "Announcements", "Support"])
    
    return f"INSERT INTO Forum (ForumID, Title, Description, ForumCategory) VALUES ({forum_id}, '{title}', '{description}', '{forum_category}');"

def generate_sql_insert():
    statements = []
    statements.append(generate_department())
    
    for _ in range(187):
        statements.append(generate_users())
        
    for _ in range(10):
        statements.append(generate_cloud_resources())
        
    statements.append("\n-- Keys")
    for _ in range(187):
        statements.append(generate_keys())
        
    statements.append("\n-- Forums")
    for _ in range(300):
        statements.append(generate_forum())
        
    statements.append("\n-- Forum Comments")
    for _ in range(534):
        statements.append(generate_forum_comments())
    
    full_sql = "\n".join(statements)
 
    with open("populate_decoy_db.sql", "w") as file:
        file.write(full_sql)

generate_sql_insert()