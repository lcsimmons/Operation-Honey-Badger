source ./.env
docker pull postgres
docker run -it -p 5432:5432 --name honeybadger_db -e POSTGRES_PASSWORD=$DB_PASSWORD -e POSTGRES_USER=$DB_USERNAME -e POSTGRES_DB=$DB_NAME -d postgres

# Wait for PostgreSQL to be ready
echo "Waiting for PostgreSQL to initialize (10 seconds)..."
sleep 10

# run the db init file to initialize the tables
python3 init_db.py

echo "Database Initialization done"