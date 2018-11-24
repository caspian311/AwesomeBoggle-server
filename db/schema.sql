
DROP DATABASE IF EXISTS awesomeboggle;
CREATE DATABASE awesomeboggle;

USE awesomeboggle;

CREATE TABLE IF NOT EXISTS games (
   id INT AUTO_INCREMENT PRIMARY KEY,
   created_on DATETIME NOT NULL,
   finished INT DEFAULT 0
);

CREATE TABLE IF NOT EXISTS users (
   id INT AUTO_INCREMENT PRIMARY KEY,
   username VARCHAR(255),
   created_on DATETIME NOT NULL
);

CREATE TABLE IF NOT EXISTS scores (
   game_id INT NOT NULL,
   user_id INT NOT NULL,
   score INT NOT NULL,
   PRIMARY KEY (game_id, user_id),
   FOREIGN KEY (game_id) REFERENCES games(id) ON DELETE CASCADE,
   FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
