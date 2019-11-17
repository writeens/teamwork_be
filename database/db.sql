--  \cd /Users/Victor/Documents/Coding/Teamwork/teamwork_be/database
-- DROP DATABASE IF EXISTS testDB;
-- CREATE DATABASE testDB
--     WITH 
--     OWNER = postgres
--     ENCODING = 'UTF8'
--     LC_COLLATE = 'English_United States.1252'
--     LC_CTYPE = 'English_United States.1252'
--     TABLESPACE = pg_default
--     CONNECTION LIMIT = -1;

-- Create Database on Local Machine
CREATE DATABASE testdb;

\connect testdb;

-- Create The Users Table
CREATE TABLE users(
    "id" SERIAL PRIMARY KEY,
    "firstName" TEXT,
    "lastName" TEXT,
    "email" TEXT,
    "password" TEXT,
    "gender" TEXT,
    "jobRole" TEXT,
    "department" TEXT,
    "address" TEXT
);
-- Create the Articles Table
CREATE TABLE articles(
    "articleId" SERIAL PRIMARY KEY,
    "createdOn" TIMESTAMP WITHOUT TIME ZONE,
    "title" TEXT,
    "article" TEXT,
    "authorId" INTEGER REFERENCES users("id"),
    "type" TEXT
);
-- Create the GIFs Table
CREATE TABLE gifs(
    "gifId" SERIAL PRIMARY KEY,
    "createdOn" TIMESTAMP WITHOUT TIME ZONE,
    "title" TEXT,
    "imageUrl" TEXT,
    "authorId" INTEGER REFERENCES users("id"),
    "type" TEXT,
    "publicId" TEXT
);
-- Create the Article Comments Table
CREATE TABLE "articleComments"(
    "commentId" SERIAL PRIMARY KEY,
    "createdOn" TIMESTAMP WITHOUT TIME ZONE,
    "comment" TEXT,
    "authorId" INTEGER REFERENCES users("id"),
    "articleId" INTEGER REFERENCES articles("articleId")
);
-- Create the GIF Comments Table
CREATE TABLE "gifComments"(
    "commentId" SERIAL PRIMARY KEY,
    "createdOn" TIMESTAMP WITHOUT TIME ZONE,
    "comment" TEXT,
    "authorId" INTEGER REFERENCES users("id"),
    "articleId" INTEGER REFERENCES gifs("gifId")
);

--Insert Admin Details
INSERT INTO users("firstName", "lastName", email, password, gender, "jobRole", department, address)
VALUES('admin', 'admin', 'admin@teamwork.com', '$2b$08$/P4uAOelOZCrY09asow2P.ZOOEHwCa96kaBbI4zdiWd57w2ypPLFW', 'Male', 'Software Developer', 'Teamwork', 'Remote');