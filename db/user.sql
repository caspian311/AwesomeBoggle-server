DROP USER IF EXISTS 'awesomeboggle'@'localhost';

CREATE USER 'awesomeboggle'@'localhost' IDENTIFIED WITH mysql_native_password BY 'awesomeboggle';

SET @grantstatement = CONCAT('GRANT ALL PRIVILEGES ON ', @db, '.* TO ''awesomeboggle''@''localhost''');
PREPARE preparedgrant FROM @grantstatement;
EXECUTE preparedgrant;

