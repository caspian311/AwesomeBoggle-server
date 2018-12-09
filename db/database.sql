SET @dropstatement = CONCAT('DROP DATABASE IF EXISTS ', @db);
PREPARE prepareddrop FROM @dropstatement;
EXECUTE prepareddrop;

SET @createstatement = CONCAT('CREATE DATABASE ', @db);
PREPARE preparedcreate FROM @createstatement;
EXECUTE preparedcreate;

