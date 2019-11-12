-- Create Database on Local Machine
-- CREATE DATABASE testDB
--     WITH 
--     OWNER = postgres
--     ENCODING = 'UTF8'
--     LC_COLLATE = 'English_United States.1252'
--     LC_CTYPE = 'English_United States.1252'
--     TABLESPACE = pg_default
--     CONNECTION LIMIT = -1;

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