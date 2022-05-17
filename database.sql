CREATE DATABASE IF NOT EXISTS COMP2800;
use COMP2800;
CREATE TABLE IF NOT EXISTS BBY_22_users(
    id int NOT NULL AUTO_INCREMENT,
    firstName VARCHAR(20),
    lastName VARCHAR(20),
    city VARCHAR(30),
    email VARCHAR(30),
    password VARCHAR(30),
    type VARCHAR(10),
    profile_pic TEXT (999) NOT NULL,
    PRIMARY KEY (id));

CREATE TABLE IF NOT EXISTS BBY_22_item_posts(
    id int NOT NULL AUTO_INCREMENT,
    user_id int NOT NULL,
    title VARCHAR(50),
    description VARCHAR(1000),
    city VARCHAR(30),
    status VARCHAR(30),
    user_reserved int,
    timestamp VARCHAR(50),
    item_pic TEXT (999),
    PRIMARY KEY (id),
    FOREIGN KEY (user_id) REFERENCES BBY_22_users(id) ON UPDATE CASCADE ON DELETE CASCADE);

INSERT INTO BBY_22_users (firstName, lastName, city, email, password, type) 
VALUES ("Test", "Test", "Vancouver", "test@test.ca", "password", "ADMIN");