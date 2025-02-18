from github import Github
from github.GithubException import GithubException

import re
import json

import os
from dotenv import load_dotenv

env_path = "../.env"

load_dotenv(dotenv_path=env_path)

try:
    google_auth_token = os.getenv("GOOGLE_AUTH_TOKEN")
    g = Github(google_auth_token)
    repo = g.get_repo("swisskyrepo/PayloadsAllTheThings")
    
    file_path = "SQL Injection/PostgreSQL Injection.md"
    file_content = repo.get_contents(file_path)
    
    content_str = file_content.decoded_content.decode()

    pattern = r"```sql\s+(.*?)\s+```"
    sql_payloads = re.findall(pattern, content_str, re.DOTALL)
    payloads_json = [{"id": idx, "payload": payload} for idx, payload in enumerate(sql_payloads, start=1)]

    json_data = json.dumps(payloads_json, indent=2)
    print(json_data)


except GithubException as e:
    print("An error occurred:", e)

