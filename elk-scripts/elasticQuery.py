# Operation Honey Badger - Dynamic Honeypot
# Script is WIP; will update as ELK and logging functionality is implementing

from elasticsearch import Elasticsearch

# Connect to Elasticsearch
es = Elasticsearch(["http://localhost:9200"])

# Uncomment the desired query

# Query: Last 7 days
query_last_7_days = {
    "query": {
        "range": {
            "timestamp": {
                "gte": "now-7d/d",
                "lt": "now/d"
            }
        }
    }
}

# Query: Filter SQL Injection attacks
query_sql_injection = {
    "query": {
        "match": {
            "attack_data": "SQL Injection"
        }
    }
}

# Query: Filter by specific Source IP
query_specific_ip = {
    "query": {
        "term": {
            "source_ip.keyword": "192.168.1.10"
        }
    }
}

# Query: Retrieve all logs, sorted by latest first
query_match_all = {
    "query": {"match_all": {}},
    "sort": [{"timestamp": {"order": "desc"}}]
}

# Choose which query to use (Uncomment one)
query = query_last_7_days  # Default: last 7 days logs
# query = query_sql_injection  # Uncomment to get SQL Injection attacks only
# query = query_specific_ip  # Uncomment to filter by specific IP
# query = query_match_all  # Uncomment to get all logs sorted by timestamp

# Search Elasticsearch
index_name = "honeypot-logs"
response = es.search(index=index_name, body=query, size=1000)  # Adjust size as needed

# Display results
for hit in response["hits"]["hits"]:
    print(f"Timestamp: {hit['_source']['timestamp']}, "
          f"Source IP: {hit['_source']['source_ip']}, "
          f"Attack: {hit['_source']['attack_data']}")
