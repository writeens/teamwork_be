--Drop Database and User
\i database/uninstall.sql;

--Setup Database structure
\i database/db.sql;

--Setup Fake User so password access can be granted
CREATE USER testdbuser WITH PASSWORD 'password';
ALTER DATABASE testdb OWNER TO testdbuser;
ALTER TABLE users OWNER TO testdbuser;
ALTER TABLE gifs OWNER TO testdbuser;
ALTER TABLE articles OWNER TO testdbuser;
ALTER TABLE "gifComments" OWNER TO testdbuser;
ALTER TABLE "articleComments" OWNER TO testdbuser;