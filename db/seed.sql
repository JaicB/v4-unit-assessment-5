DROP TABLE IF EXISTS helo_users;

CREATE TABLE helo_users (
    id SERIAL PRIMARY KEY,
    username VARCHAR NOT NULL,
    password VARCHAR NOT NULL,
    profile_pic TEXT
);

DROP TABLE IF EXISTS helo_posts;

CREATE TABLE helo_posts (
    id SERIAL PRIMARY KEY,
    title VARCHAR(45) NOT NULL,
    content TEXT,
    img TEXT,
    author_id INTEGER REFERENCES helo_users(id), 
    date_created TIMESTAMP
);