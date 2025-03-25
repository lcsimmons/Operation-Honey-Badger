docker pull postgres
docker run -it -p 5432:5432 --name honeybadger_db -e POSTGRES_PASSWORD=welove482 -e POSTGRES_USER=postgres -e POSTGRES_DB=honeybager_db_postgres -d postgres
# docker exec -it honeybadger_db bash

#after it opens up the bash terminal inside the docker container
# psql -U postgres

#run the db init file to initialize the tables
python3 init_db.py

echo "Database Initilization done"