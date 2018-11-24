DROP USER IF EXISTS 'awesomeboggle'@'localhost';

CREATE USER 'awesomeboggle'@'localhost' IDENTIFIED BY 'awesomeboggle';

GRANT ALL PRIVILEGES ON awesomeboggle.* TO 'awesomeboggle'@'localhost';
