USE awesomeboggle;

DELETE FROM users;
DELETE FROM games;
DELETE FROM scores;

SET @hour_ago = DATE_SUB(NOW(), INTERVAL 1 HOUR);

INSERT INTO users (username, auth_token, created_on)
  VALUES ('matt', '1f5b4ed0-f0b3-11e8-9aa2-e7e59d5339f5', NOW());
SET @user1 = LAST_INSERT_ID();

INSERT INTO users (username, auth_token, created_on)
  VALUES ('abbi', '5fa4d3d0-f0b3-11e8-9aa2-e7e59d5339f5', NOW());
SET @user2 = LAST_INSERT_ID();

INSERT INTO users (username, auth_token, created_on)
  VALUES ('caleb', '603a8420-f0b3-11e8-9aa2-e7e59d5339f5', NOW());
SET @user3 = LAST_INSERT_ID();

INSERT INTO users (username, auth_token, created_on)
  VALUES ('aurelia', '6091f2f0-f0b3-11e8-9aa2-e7e59d5339f5', NOW());
SET @user4 = LAST_INSERT_ID();

INSERT INTO users (username, auth_token, created_on)
  VALUES ('peter', '60e6a2a0-f0b3-11e8-9aa2-e7e59d5339f5', NOW());
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
