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
    email = f"{username}@opossum.org"
    password = hashlib.md5(fake.password().encode()).hexdigest()
    department_id = random.randint(1, 3)
    title = random.randint(1, 10)
    privileges = "Standard User"
    salary = round(random.uniform(27000, 250000), 2)
    last_login = fake.date_time_this_year().strftime('%Y-%m-%d %H:%M:%S')
    is_sensitive = random.choice([1, 0])

    return (
        "INSERT INTO Users "
        "(Name, Email, Username, Password, Title, DepartmentID, Privileges, Salary, LastLogin, IsSensitive) "
        f"VALUES ('{name}', '{email}', '{username}', '{password}', '{title}', {department_id}, "
        f"'{privileges}', {salary}, '{last_login}', {is_sensitive});"
    )

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
    
    return (
        "INSERT INTO CloudResources (Category, DepartmentID, AccessRequirement, SessionDuration, KeyPublic, KeyPrivate) "
        f"VALUES ('{category}', {department_id}, '{access_requirement}', {session_duration}, '{key_public}', '{key_private}');"
    )

def generate_keys():
    key_id = random.randint(10000, 99999)
    resource_id = random.randint(1000, 9999)
    key_type = random.choice(["Public", "Private"])
    key_value = hashlib.md5(fake.word().encode()).hexdigest()
    
    return f"INSERT INTO Keys (KeyID, ResourceID, KeyType, KeyValue) VALUES ({key_id}, {resource_id}, '{key_type}', '{key_value}');"

def generate_it_support_ticket():
    reported_by = random.randint(1, 187)
    assigned_to = random.randint(1, 187)
    
    common_issues = [
        "Cannot connect to the internet",
        "Printer not working",
        "Computer running slow",
        "Forgot password",
        "Email not syncing",
        "VPN connection issues",
        "Software installation request",
        "Blue screen error",
        "Application crash",
        "Hardware malfunction",
        "Unable to access shared drive",
        "Wi-Fi connectivity issues"
    ]
    issue = random.choice(common_issues)
    
    status = random.choice(["Open", "In Progress", "Resolved", "Closed"])
    timestamp = fake.date_time_this_year().strftime("%Y-%m-%d %H:%M:%S")
    
    return (
        "INSERT INTO ITSupport (ReportedBy, Issue, Status, AssignedTo, Timestamp) "
        f"VALUES ({reported_by}, '{issue}', '{status}', {assigned_to}, '{timestamp}');"
    )


def generate_performance_analytics():
    metrics = [
        "Employee Satisfaction",
        "Revenue Growth",
        "Cost Reduction",
        "Operational Efficiency",
        "System Uptime",
        "Customer Satisfaction"
    ]
    
    department_id = random.randint(1, 3)
    metric = random.choice(metrics)
    
    value = round(random.uniform(0, 100), 2)
    
    last_updated = fake.date_time_this_year().strftime('%Y-%m-%d %H:%M:%S')
    
    return (
        "INSERT INTO PerformanceAnalytics (DepartmentID, Metric, Value, LastUpdated) "
        f"VALUES ({department_id}, '{metric}', {value}, '{last_updated}');"
    )

def generate_corporate_initiatives():
    initiatives = [
        {
            "ProjectName": "Digital Transformation",
            "Budget": 500000,
            "Progress": "In Progress",
            "ExecutiveSponsor": "Alice Johnson"
        },
        {
            "ProjectName": "Market Expansion 2025",
            "Budget": 750000,
            "Progress": "Planning",
            "ExecutiveSponsor": "Bob Smith"
        },
        {
            "ProjectName": "Sustainability Initiative",
            "Budget": 300000,
            "Progress": "Not Started",
            "ExecutiveSponsor": "Carol Lee"
        },
        {
            "ProjectName": "Customer Experience Revamp",
            "Budget": 600000,
            "Progress": "In Progress",
            "ExecutiveSponsor": "David Kim"
        },
        {
            "ProjectName": "Innovation Lab Launch",
            "Budget": 400000,
            "Progress": "Completed",
            "ExecutiveSponsor": "Eva Green"
        }
    ]
    
    sql_statements = []
    for initiative in initiatives:
        sql = (
            "INSERT INTO CorporateInitiatives "
            "(ProjectName, Budget, Progress, ExecutiveSponsor) "
            f"VALUES ('{initiative['ProjectName']}', {initiative['Budget']}, "
            f"'{initiative['Progress']}', '{initiative['ExecutiveSponsor']}');"
        )
        sql_statements.append(sql)
    return sql_statements

def insert_security_question():
    question = "What was your first pet's name?"
    sql = f"INSERT INTO SecurityQuestions (QuestionText) VALUES ('{question}');"
    return sql

def generate_security_answer(user_id):
    pet_names = [
        "Max", "Bella", "Charlie", "Lucy", "Daisy", "Buddy", "Molly", "Bailey",
        "Rocky", "Lola", "Sophie", "Duke", "Jack", "Sadie", "Toby", "Chloe", "Coco", "Oscar", "Milo", "Zoe"
    ]
   
    question_id = 1
    answer = random.choice(pet_names)
    timestamp = fake.date_time_this_year().strftime("%Y-%m-%d %H:%M:%S")
    
    sql = (
        "INSERT INTO SecurityAnswers (UserID, QuestionID, Answer, Timestamp) "
        f"VALUES ({user_id}, {question_id}, '{answer}', '{timestamp}');"
    )
    return sql


def generate_expenses_record():
    
    categories = [
        "Travel", "Meals", "Office Supplies", "Software",
        "Training", "Consulting", "Maintenance", "Entertainment"
    ]
    category = random.choice(categories)
    
    user_id = random.randint(1, 187)  # Assuming 187 employees exist
    amount = round(random.uniform(50, 5000), 2)  
    status = random.choice(["Submitted", "Approved", "Rejected", "Paid"])
    last_modified_by = random.randint(1, 187)
    timestamp = fake.date_time_this_year().strftime("%Y-%m-%d %H:%M:%S")
    
    sql = (
        "INSERT INTO Expenses (UserID, Amount, Category, Status, LastModifiedBy, Timestamp) "
        f"VALUES ({user_id}, {amount}, '{category}', '{status}', {last_modified_by}, '{timestamp}');"
    )
    return sql

def generate_expenses_records(num_records=250):
    return [generate_expenses_record() for _ in range(num_records)]

# def generate_forum_comments():
#     comment_id = random.randint(1000, 9999)
#     forum_id = random.randint(100, 300)
#     user_id = random.randint(1, 187) 
#     comment_bytes = fake.sentence(nb_words=10).encode("ascii")
#     comment = base64.b64encode(comment_bytes).decode()
#     timestamp = fake.date_time_this_year().strftime("%Y-%m-%d %H:%M:%S")
    
#     return f"INSERT INTO ForumComments (CommentID, ForumID, UserID, Comment, Timestamp) VALUES ({comment_id}, {forum_id}, {user_id}, '{comment}', '{timestamp}');"


# def generate_forum():
#     forum_id = random.randint(100, 300)
#     title_bytes = fake.sentence(nb_words=5).encode("ascii")
#     title =  base64.b64encode(title_bytes).decode()
#     description_bytes = fake.text(max_nb_chars=100).encode("ascii")
#     description =  base64.b64encode(description_bytes).decode()
#     forum_category = random.choice(["General", "Announcements", "Support"])
    
#     return f"INSERT INTO Forum (ForumID, Title, Description, ForumCategory) VALUES ({forum_id}, '{title}', '{description}', '{forum_category}');"

def generate_sql_insert():
    statements = []
    statements.append(generate_department())

    for _ in range(187):
        statements.append(generate_users())

    statements.append(insert_security_question())
        
    for _ in range(634):
        statements.append(generate_performance_analytics())   

    statements.extend(generate_expenses_records()) 
    statements.extend(generate_corporate_initiatives())

    for _ in range(10):
        statements.append(generate_it_support_ticket())
        
    for _ in range(623):
        statements.append(generate_cloud_resources())
        
    for _ in range(187):
        statements.append(generate_keys())

    for user_id in range(1, 188):
        statements.append(generate_security_answer(user_id))
    
    full_sql = "\n".join(statements)
 
    with open("populate_decoy_db.sql", "w") as file:
        file.write(full_sql)

generate_sql_insert()
