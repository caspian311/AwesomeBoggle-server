USE awesomeboggle;

DELETE FROM USERS;

SET @hour_ago = DATE_SUB(NOW(), INTERVAL 1 HOUR);

INSERT INTO users (username, created_on) values ('matt', NOW());
SET @user1 = LAST_INSERT_ID();

INSERT INTO users (username, created_on) values ('abbi', NOW());
SET @user2 = LAST_INSERT_ID();

INSERT INTO games (created_on, finished)
  values (@hour_ago, 1);
SET @game_id = LAST_INSERT_ID();

INSERT INTO scores (user_id, game_id, score)
  values (@user1, @game_id, 12);

INSERT INTO scores (user_id, game_id, score)
  values (@user2, @game_id, 20);

INSERT INTO games (created_on, finished)
  values (NOW(), 0);
SET @game_id = LAST_INSERT_ID();

INSERT INTO scores (user_id, game_id, score)
  values (@user1, @game_id, 0);

INSERT INTO scores (user_id, game_id, score)
  values (@user2, @game_id, 0);
