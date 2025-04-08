from faker import Faker
import random
import base64
import hashlib
import datetime

fake = Faker()

def generate_security_questions():
    questions = [
        "What is your mother's maiden name?",
        "What was the name of your first pet?",
        "What is your favorite color?",
        "In what city were you born?",
        "What is your favorite movie?",
        "What high school did you attend?",
        "What was the model of your first car?",
        "What is 2+2?",
        "What is your favorite book?",
        "What is your favorite food?"
    ]
    sql_statements = []
    for i, question in enumerate(questions, start=1):
        sql = f"INSERT INTO SecurityQuestions (question_id, question_text) VALUES ({i}, \"{question}\");"
        sql_statements.append(sql)
    return "\n".join(sql_statements)

def generate_department():
    departments = ["IT", "Human Resources", "Finance"]
    sql_statements = []
    for i, dept in enumerate(departments, start=1):
        sql = f"INSERT INTO Department (department_id, name) VALUES ({i}, '{dept}');"
        sql_statements.append(sql)
    return "\n".join(sql_statements)

def generate_users():
    first_name = fake.unique.first_name()
    last_name = fake.unique.last_name()

    name = first_name + " " + last_name
    email = f"{first_name.lower()}.{last_name.lower()}@company.com"
    username = (first_name[0] + last_name).lower()
    password = hashlib.md5(fake.password().encode()).hexdigest()
    department_id = random.randint(1, 3)
    title = fake.job()
    privileges = "Standard User"
    salary = random.randint(40000, 120000)
    last_login = fake.date_time_this_year().strftime("%Y-%m-%d %H:%M:%S")
    is_sensitive = random.choice([0, 1])

    # Escape single quotes for SQL
    name = name.replace("'", "''")
    title = title.replace("'", "''")
    email = email.replace("'", "''")

    return f"INSERT INTO Users (name, email, username, password, title, department_id, privileges, salary, last_login, is_sensitive) VALUES ('{name}', '{email}', '{username}', '{password}', '{title}', {department_id}, '{privileges}', {salary}, '{last_login}', {is_sensitive});"

def generate_expenses():
    categories = ["Office Supplies", "Travel", "Equipment", "Meals", "Training"]
    statuses = ["Pending", "Approved", "Rejected"]
    
    amount = random.randint(50, 5000)
    category = random.choice(categories)
    status = random.choice(statuses)
    user_id = random.randint(1, 187)  # Assuming we'll generate 187 users
    last_modified_by = random.randint(1, 187)
    timestamp = fake.date_time_this_year().strftime("%Y-%m-%d %H:%M:%S")
    
    return f"INSERT INTO Expenses (amount, category, status, user_id, last_modified_by, timestamp) VALUES ({amount}, '{category}', '{status}', {user_id}, {last_modified_by}, '{timestamp}');"

def generate_it_support():
    issues = [
        "Computer won't start",
        "Software installation needed",
        "Network connectivity issues",
        "Password reset required",
        "Printer not working",
        "Email problems",
        "VPN access issues",
        "Account lockout",
        "Virus/malware detected",
        "Hardware upgrade request"
    ]
    statuses = ["Open", "In Progress", "Resolved", "Closed"]
    
    issue = random.choice(issues)
    status = random.choice(statuses)
    reported_by = random.randint(1, 187)  # Assuming we'll generate 187 users
    assigned_to = random.randint(1, 187) if status != "Open" else None
    timestamp = fake.date_time_this_year().strftime("%Y-%m-%d %H:%M:%S")
    
    # Escape single quotes for SQL
    issue = issue.replace("'", "''")
    
    if assigned_to:
        return f"INSERT INTO ITSupport (issue, status, reported_by, assigned_to, timestamp) VALUES ('{issue}', '{status}', {reported_by}, {assigned_to}, '{timestamp}');"
    else:
        return f"INSERT INTO ITSupport (issue, status, reported_by, timestamp) VALUES ('{issue}', '{status}', {reported_by}, '{timestamp}');"

def generate_security_answers():
    user_id = random.randint(1, 187)  # Assuming we'll generate 187 users
    question_id = random.randint(1, 10)  # Assuming we have 10 security questions
    answer = fake.word()
    timestamp = fake.date_time_this_year().strftime("%Y-%m-%d %H:%M:%S")
    
    # Escape single quotes for SQL
    answer = answer.replace("'", "''")
    
    return f"INSERT INTO SecurityAnswers (answer, user_id, question_id, timestamp) VALUES ('{answer}', {user_id}, {question_id}, '{timestamp}');"

def generate_performance_analytics():
    metrics = ["Productivity", "Revenue", "Efficiency", "Customer Satisfaction", "Employee Retention"]
    metric = random.choice(metrics)
    value = random.randint(50, 100)
    department_id = random.randint(1, 3)
    last_updated = fake.date_time_this_year().strftime("%Y-%m-%d %H:%M:%S")
    
    return f"INSERT INTO PerformanceAnalytics (metric, value, department_id, last_updated) VALUES ('{metric}', {value}, {department_id}, '{last_updated}');"

def generate_forum():
    title = fake.sentence(nb_words=5)
    # title = base64.b64encode(title_bytes).decode()
    description = fake.text(max_nb_chars=100)
    # description = base64.b64encode(description_bytes).decode()
    forum_category = random.choice(["General", "Announcements", "Support"])
    
    # Escape single quotes for SQL
    title = title.replace("'", "''")
    description = description.replace("'", "''")
    
    return f"INSERT INTO Forum (title, description, forum_category) VALUES ('{title}', '{description}', '{forum_category}');"

def generate_forum_comments():
    forum_id = random.randint(1, 50)  # Assuming we'll generate 50 forums
    user_id = random.randint(1, 187)  # Assuming we'll generate 187 users
    comment_bytes = fake.sentence(nb_words=10)
    # comment = base64.b64encode(comment_bytes).decode()
    comment = comment_bytes
    timestamp = fake.date_time_this_year().strftime("%Y-%m-%d %H:%M:%S")
    
    # Escape single quotes for SQL
    comment = comment.replace("'", "''")
    
    return f"INSERT INTO ForumComments (forum_id, user_id, comment, timestamp) VALUES ({forum_id}, {user_id}, '{comment}', '{timestamp}');"

def generate_cloud_resources():
    categories = ["Compute", "Storage", "Networking", "Database", "Security"]
    category = random.choice(categories)
    department_id = random.randint(1, 3)
    access_requirement = random.choice(["Public", "Private", "Restricted"])
    session_duration = random.randint(5, 180)  
    key_public = hashlib.md5(fake.word().encode()).hexdigest()
    key_private = hashlib.md5(fake.word().encode()).hexdigest()
    
    return f"INSERT INTO CloudResources (category, department_id, access_requirement, session_duration, key_public, key_private) VALUES ('{category}', {department_id}, '{access_requirement}', {session_duration}, '{key_public}', '{key_private}');"

def generate_keys():
    resource_id = random.randint(1, 100)  # Assuming we'll generate 100 resources
    key_type = random.choice(["Public", "Private", "Shared"])
    key_value = hashlib.md5(fake.word().encode()).hexdigest()
    
    return f"INSERT INTO Keys (resource_id, key_type, key_value) VALUES ({resource_id}, '{key_type}', '{key_value}');"

def generate_corporate_initiatives():
    project_names = [
        "Digital Transformation",
        "Market Expansion",
        "Cost Reduction",
        "Product Innovation",
        "Employee Engagement",
        "Customer Experience",
        "Sustainability Initiative",
        "Operational Excellence",
        "Talent Development",
        "Strategic Realignment"
    ]
    progress_statuses = ["Planning", "In Progress", "On Hold", "Completed"]
    
    project_name = random.choice(project_names)
    budget = random.randint(50000, 1000000)
    progress = random.choice(progress_statuses)
    executive_sponsor = fake.name()
    
    # Escape single quotes for SQL
    project_name = project_name.replace("'", "''")
    executive_sponsor = executive_sponsor.replace("'", "''")
    
    return f"INSERT INTO CorporateInitiatives (project_name, budget, progress, executive_sponsor) VALUES ('{project_name}', {budget}, '{progress}', '{executive_sponsor}');"

def add_stored_users(index):
    users = {
        "admin": {
            "firstname": "admin", 
            "lastname": "admin", 
            "password": "password123", 
            "question_id": 3, 
            "answer": "blue",
            "email": "admin@company.com"
        },
        "employee": {
            "firstname": "employee", 
            "lastname": "employee", 
            "password": "securepass", 
            "question_id": 8, 
            "answer": "4",
            "email": "employee@company.com"
        },
        "bob": {
            "firstname": "bob", 
            "lastname": "jones", 
            "password": "1234", 
            "question_id": 2, 
            "answer": "fluffy",
            "email": "bob.jones@company.com"
        }
    }

    users = list(users.items())
    user = users[index][1]
    
    first_name = user['firstname']
    last_name = user['lastname']

    name = first_name + " " + last_name
    email = user['email']
    username = (first_name[0] + last_name).lower()
    password = hashlib.md5(user['password'].encode()).hexdigest()
    department_id = random.randint(1, 3)
    title = fake.job()
    privileges = "Admin" if index == 0 else "Standard User"
    salary = random.randint(40000, 120000)
    last_login = fake.date_time_this_year().strftime("%Y-%m-%d %H:%M:%S")
    is_sensitive = 1 if index == 0 else 0

    # Escape single quotes for SQL
    name = name.replace("'", "''")
    title = title.replace("'", "''")

    user_sql = f"INSERT INTO Users (name, email, username, password, title, department_id, privileges, salary, last_login, is_sensitive) VALUES ('{name}', '{email}', '{username}', '{password}', '{title}', {department_id}, '{privileges}', {salary}, '{last_login}', {is_sensitive});"
    
    # Also add their security answer
    security_answer = f"INSERT INTO SecurityAnswers (answer, user_id, question_id, timestamp) VALUES ('{user['answer']}', {index+1}, {user['question_id']}, '{datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')}');"
    
    return user_sql, security_answer

def generate_sql_insert():
    statements = []
    
    # Start with a transaction for better performance
    statements.append("BEGIN TRANSACTION;")
    
    # Generate departments first (3 departments)
    statements.append(generate_department())
    
    # Generate security questions
    statements.append(generate_security_questions())
    
    # Generate stored users first (3 users)
    for i in range(3):
        user_sql, security_answer = add_stored_users(i)
        statements.append(user_sql)
    
    # Generate 187 regular users
    for _ in range(187):
        statements.append(generate_users())
    
    # Generate security answers for regular users
    for _ in range(187):
        statements.append(generate_security_answers())
    
    # Generate 100 expenses
    for _ in range(100):
        statements.append(generate_expenses())
    
    # Generate 75 IT support tickets
    for _ in range(75):
        statements.append(generate_it_support())
    
    # Generate 30 performance analytics
    for _ in range(30):
        statements.append(generate_performance_analytics())
    
    # Generate 50 forums
    for _ in range(50):
        statements.append(generate_forum())
    
    # Generate 200 forum comments
    for _ in range(200):
        statements.append(generate_forum_comments())
    
    # Generate 100 cloud resources
    for _ in range(100):
        statements.append(generate_cloud_resources())
    
    # Generate 150 keys
    for _ in range(150):
        statements.append(generate_keys())
    
    # Generate 20 corporate initiatives
    for _ in range(20):
        statements.append(generate_corporate_initiatives())
    
    # Commit the transaction
    statements.append("COMMIT;")
    
    full_sql = "\n".join(statements)
 
    with open("populate_decoy_memory_db.sql", "w") as file:
        file.write(full_sql)

generate_sql_insert()