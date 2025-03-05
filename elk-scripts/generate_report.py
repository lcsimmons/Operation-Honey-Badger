# Operation Honey Badger - Dynamic Honeypot
# Script is WIP; will update as ELK and logging functionality is implementing

from elasticsearch import Elasticsearch
from jinja2 import Environment, FileSystemLoader
import pandas as pd

# Connect to Elasticsearch
es = Elasticsearch(["http://localhost:9200"])

# Define the search query (Last 7 days)
query = {
    "query": {
        "range": {
            "timestamp": {
                "gte": "now-7d/d",
                "lt": "now/d"
            }
        }
    }
}

# Search Elasticsearch
index_name = "honeypot-logs"
response = es.search(index=index_name, body=query, size=1000)

# Extract data
logs = []
for hit in response["hits"]["hits"]:
    logs.append({
        "timestamp": hit["_source"]["timestamp"],
        "source_ip": hit["_source"]["source_ip"],
        "attack_data": hit["_source"]["attack_data"]
    })

# Convert to DataFrame
df = pd.DataFrame(logs)

# Load the HTML template
env = Environment(loader=FileSystemLoader("templates"))
template = env.get_template("soc_report.html")

# Render the template with data
report_html = template.render(logs=logs)

# Save the report
with open("SOC_Report.html", "w") as file:
    file.write(report_html)

print("SOC Report Generated: SOC_Report.html")
