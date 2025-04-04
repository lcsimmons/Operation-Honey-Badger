-- Department table
CREATE TABLE IF NOT EXISTS Department (
    department_id INTEGER PRIMARY KEY,
    name TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS  Users (
    user_id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,  
    title TEXT,
    department_id INTEGER,
    privileges TEXT,
    salary INTEGER,
    avatar TEXT DEFAULT '/default.png',
    last_login timestamp DEFAULT CURRENT_TIMESTAMP,
    is_sensitive BOOLEAN,
    FOREIGN KEY (department_id) REFERENCES Department(department_id)
);

-- Expenses Table
CREATE TABLE IF NOT EXISTS Expenses (
    expense_id INTEGER PRIMARY KEY,
    amount INTEGER NOT NULL,
    category TEXT,
    status TEXT,
    user_id INTEGER NOT NULL,
    last_modified_by INTEGER NOT NULL,
    timestamp timestamp DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id) REFERENCES Users(user_id),
    FOREIGN KEY (last_modified_by) REFERENCES Users(user_id)
);

-- IT Support Table
CREATE TABLE IF NOT EXISTS ITSupport (
    ticket_id INTEGER PRIMARY KEY,
    issue TEXT NOT NULL,
    status TEXT,
    reported_by INTEGER NOT NULL,
    assigned_to INTEGER,
    timestamp timestamp DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (reported_by) REFERENCES Users(user_id),
    FOREIGN KEY (assigned_to) REFERENCES Users(user_id)
);


-- Security Questions
CREATE TABLE IF NOT EXISTS SecurityQuestions (
    question_id INTEGER PRIMARY KEY,
    question_text TEXT NOT NULL
);


-- Security Answers
CREATE TABLE IF NOT EXISTS SecurityAnswers (
    answer_id INTEGER PRIMARY KEY,
    answer TEXT NOT NULL,
    user_id INTEGER NOT NULL,
    question_id INTEGER NOT NULL,
    timestamp timestamp DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(user_id),
    FOREIGN KEY (question_id) REFERENCES SecurityQuestions(question_id)
);


-- Performance Analytics table
CREATE TABLE IF NOT EXISTS PerformanceAnalytics (
    metric_id INTEGER PRIMARY KEY,
    metric TEXT,
    value INTEGER,
    department_id INTEGER NOT NULL,
    last_updated timestamp DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (department_id) REFERENCES Department(department_id)
); 

-- Forum table
CREATE TABLE IF NOT EXISTS Forum (
    forum_id INTEGER PRIMARY KEY,
    title TEXT NOT NULL,
    forum_category TEXT,
    description TEXT,
    is_pinned BOOLEAN DEFAULT 0,
    likes_count INTEGER DEFAULT 0,
    user_id INTEGER NOT NULL,
    timestamp timestamp DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(user_id)
);

-- Forum Comments table
CREATE TABLE IF NOT EXISTS ForumComments (
    comment_id INTEGER PRIMARY KEY,
    forum_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    comment TEXT NOT NULL,
    is_pinned BOOLEAN DEFAULT 0,
    likes_count INTEGER DEFAULT 0,
    timestamp timestamp DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (forum_id) REFERENCES Forum(forum_id),
    FOREIGN KEY (user_id) REFERENCES Users(user_id)
);

-- Cloud Resources table
CREATE TABLE IF NOT EXISTS CloudResources (
    resource_id INTEGER PRIMARY KEY,
    category TEXT,
    department_id INTEGER,
    access_requirement TEXT,
    session_duration INTEGER,
    key_public TEXT,
    key_private TEXT,
    FOREIGN KEY (department_id) REFERENCES Department(department_id)
);

-- Keys table
CREATE TABLE IF NOT EXISTS Keys (
    key_id INTEGER PRIMARY KEY,
    resource_id INTEGER NOT NULL,
    key_type TEXT NOT NULL,
    key_value TEXT NOT NULL,
    FOREIGN KEY (resource_id) REFERENCES CloudResources(resource_id)
);

-- Corporate Initiatives table
CREATE TABLE IF NOT EXISTS CorporateInitiatives (
    project_id INTEGER PRIMARY KEY,
    project_name TEXT NOT NULL,
    budget INTEGER,
    progress TEXT,
    executive_sponsor TEXT
);