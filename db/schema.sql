CREATE TABLE IF NOT EXISTS games (
   id INT AUTO_INCREMENT PRIMARY KEY,
   grid VARCHAR(20) NOT NULL,
   created_on DATETIME NOT NULL,
   finished INT DEFAULT 0
);

CREATE TABLE IF NOT EXISTS users (
   id INT AUTO_INCREMENT PRIMARY KEY,
   username VARCHAR(255) UNIQUE,
   auth_token VARCHAR(255) UNIQUE,
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

CREATE TABLE IF NOT EXISTS invitations (
   game_id INT NOT NULL,
   user_id INT NOT NULL,
   accepted INT DEFAULT 0,
   PRIMARY KEY (game_id, user_id),
   FOREIGN KEY (game_id) REFERENCES games(id) ON DELETE CASCADE,
   FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS words (
   id INT AUTO_INCREMENT PRIMARY KEY,
   text VARCHAR(255) NOT NULL
);
