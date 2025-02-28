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

    return f"""
    INSERT INTO Users (Name, Username, Password, Title, DepartmentID, Privileges) 
    VALUES ('{name}', '{username}', '{password}', {title}, {department_id}, '{privileges}')
    RETURNING UserID;
    """

def generate_department():
    pass

def generate_cloud_resources():
    pass

def generate_keys():
    pass

def generate_forum_comments():
    pass

def generate_forum():
    pass

def generate_sql_insert():
    pass

print(generate_users())