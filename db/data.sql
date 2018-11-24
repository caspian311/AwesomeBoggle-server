USE awesomeboggle;

DELETE FROM USERS;

INSERT INTO users (username, created_on) values ('matt', NOW());
INSERT INTO users (username, created_on) values ('abbi', NOW());
