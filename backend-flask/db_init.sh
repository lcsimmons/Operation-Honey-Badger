#!/bin/bash

# Activate the virtual environment
source ./venv/bin/activate

# Load environment variables
source ./.env

# Pull latest PostgreSQL image
sudo docker pull postgres

# Stop and remove any existing container
sudo docker stop honeybadger_db
sudo docker rm honeybadger_db

# Start new PostgreSQL container with env vars
sudo docker run -it -p 5432:5432 --name honeybadger_db \
  -e POSTGRES_PASSWORD=$DB_PASSWORD \
  -e POSTGRES_USER=$DB_USERNAME \
  -e POSTGRES_DB=$DB_NAME \
  -d postgres

# Wait for PostgreSQL to be ready
echo "Waiting for PostgreSQL to initialize (10 seconds)..."
sleep 10

# Run DB initialization script
python3 init_db.py

echo "Database Initialization done"
