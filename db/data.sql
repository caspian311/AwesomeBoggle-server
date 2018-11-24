USE awesomeboggle;

DELETE FROM USERS;

SET @hour_ago = DATE_SUB(NOW(), INTERVAL 1 HOUR);

INSERT INTO users (username, created_on) values ('matt', NOW());
SET @user1 = LAST_INSERT_ID();

INSERT INTO users (username, created_on) values ('abbi', NOW());
SET @user2 = LAST_INSERT_ID();

INSERT INTO users (username, created_on) values ('caleb', NOW());
SET @user3 = LAST_INSERT_ID();

INSERT INTO users (username, created_on) values ('aurelia', NOW());
SET @user4 = LAST_INSERT_ID();

INSERT INTO users (username, created_on) values ('peter', NOW());
SET @user5 = LAST_INSERT_ID();

INSERT INTO games (created_on, finished)
  values (@hour_ago, 1);
SET @game1 = LAST_INSERT_ID();

INSERT INTO scores (user_id, game_id, score)
  values (@user1, @game1, 12);

INSERT INTO scores (user_id, game_id, score)
  values (@user2, @game1, 20);

INSERT INTO games (created_on, finished)
  values (NOW(), 0);
SET @game2 = LAST_INSERT_ID();

INSERT INTO scores (user_id, game_id, score)
  values (@user3, @game2, 0);

INSERT INTO scores (user_id, game_id, score)
  values (@user4, @game2, 0);
