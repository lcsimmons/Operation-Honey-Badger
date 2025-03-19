source ./.env
docker pull postgres
docker run -it -p 5432:5432 --name honeybadger_db -e POSTGRES_PASSWORD=$DB_PASSWORD -e POSTGRES_USER=postgres -e POSTGRES_DB=$DB_USERNAME -d postgres

#run the db init file to initialize the tables
python3 init_db.py

echo "Database Initilization done"