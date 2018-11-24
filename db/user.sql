DROP USER IF EXISTS 'awesomeboggle'@'localhost';

CREATE USER 'awesomeboggle'@'localhost' IDENTIFIED WITH mysql_native_password BY 'awesomeboggle';

GRANT ALL PRIVILEGES ON awesomeboggle.* TO 'awesomeboggle'@'localhost';
