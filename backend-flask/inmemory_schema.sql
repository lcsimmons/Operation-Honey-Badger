-- Department table
CREATE TABLE IF NOT EXISTS Department (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS  Users (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,  -- Plaintext as shown in ERD (consider using hashing in production)
    title TEXT,
    department_id INTEGER,
    privileges TEXT,
    FOREIGN KEY (department_id) REFERENCES Department(id)
);



-- Forum table
CREATE TABLE IF NOT EXISTS Forum (
    id INTEGER PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    forum_category TEXT
);

-- Forum Comments table
CREATE TABLE IF NOT EXISTS ForumComments (
    id INTEGER PRIMARY KEY,
    forum_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    comment TEXT NOT NULL,
    timestamp timestamp DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (forum_id) REFERENCES Forum(id),
    FOREIGN KEY (user_id) REFERENCES Users(id)
);

-- Cloud Resources table
CREATE TABLE IF NOT EXISTS CloudResources (
    id INTEGER PRIMARY KEY,
    category TEXT,
    department_id INTEGER,
    access_requirement TEXT,
    session_duration INTEGER,
    key_public TEXT,
    key_private TEXT,
    FOREIGN KEY (department_id) REFERENCES Department(id)
);

-- Keys table
CREATE TABLE IF NOT EXISTS Keys (
    id INTEGER PRIMARY KEY,
    resource_id INTEGER NOT NULL,
    is_public_key BOOLEAN,
    key_value TEXT NOT NULL,
    FOREIGN KEY (resource_id) REFERENCES CloudResources(id)
);