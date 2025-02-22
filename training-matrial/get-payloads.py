from github import Github
from github.GithubException import GithubException

import re
import json

import os
from dotenv import load_dotenv

env_path = "../.env"

load_dotenv(dotenv_path=env_path)

files_to_process = {
    "SQL Injection": [
        {"file_path": "SQL Injection/PostgreSQL Injection.md", "language": "sql"},
        {"file_path": "SQL Injection/MySQL Injection.md", "language": "sql"},
        {"file_path": "SQL Injection/MSSQL Injection.md", "language": "sql"},
        {"file_path": "SQL Injection/OracleSQL Injection.md", "language": "sql"},
        {"file_path": "SQL Injection/SQLite Injection.md", "language": "sql"}
    ],
    "XSS Injection": [
        {"file_path": "XSS Injection/README.md", "language": "html"}
    ], 
    "SSRF": [
        {"file_path": "Server Side Request Forgery/README.md", "language": "html"}
    ], 
    "Security Misconfiguration": [
        {"file_path": "Upload Insecure Files/README.md", "language": "ps1"},
        {"file_path": "Upload Insecure Files/README.md", "language": "ini"}
    ],
    "Broken Access Control": [
        {"file_path": "Insecure Direct Object References/README.md", "language": ""}, 
        {"file_path": "Account Takeover/README.md", "language": "http"}
    ], 
    "Cryptographic Failures": [
        {"file_path": "API Key Leaks/README.md", "language": ""}, 
        {"file_path": "Insecure Randomness/README.md", "language": ""}
    ]


}

google_auth_token = os.getenv("GOOGLE_AUTH_TOKEN")
g = Github(google_auth_token)
repo = g.get_repo("swisskyrepo/PayloadsAllTheThings")


def fetch_file_contents(repo, file_path):
    try:
        file_content = repo.get_contents(file_path)
        return file_content.decoded_content.decode()
    except Exception as e:
        print(f"Error fetching {file_path}: {e}")
        return None

def extract_payloads(markdown_content, language_marker):
    if language_marker:
        pattern = r"```" + re.escape(language_marker) + r"\s+(.*?)\s+```"
    else:
        pattern = r"```(?:\w+)?\s+(.*?)\s+```"
    return re.findall(pattern, markdown_content, re.DOTALL)

def create_payload_json(payloads, category, start_id=1):
    return [{"id": idx, "payload": payload.strip(), "owaspCategory": category}
            for idx, payload in enumerate(payloads, start=start_id)]


all_payloads = []
current_id = 1

for category, file_infos in files_to_process.items():
    for info in file_infos:
        path = info["file_path"]
        language_marker = info["language"]
        print(f"Processing {path} for category: {category} using marker: {language_marker}")
        content = fetch_file_contents(repo, path)
        if content:
            payloads = extract_payloads(content, language_marker)
            payloads_json = create_payload_json(payloads, category, start_id=current_id)
            all_payloads.extend(payloads_json)
            current_id += len(payloads_json)

json_data = json.dumps(all_payloads, indent=4)

with open("payloads.json", "w") as f:
    f.write(json_data)
