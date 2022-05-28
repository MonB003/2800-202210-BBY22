CREATE DATABASE IF NOT EXISTS COMP2800;
use COMP2800;
CREATE TABLE IF NOT EXISTS BBY_22_users(
    id int NOT NULL AUTO_INCREMENT,
    username VARCHAR(20),
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
    
CREATE TABLE IF NOT EXISTS BBY_22_messages(
    id int NOT NULL AUTO_INCREMENT, 
    userSending int NOT NULL,                
    userReceiving int NOT NULL, 
    message VARCHAR(300), 
    time VARCHAR(50), 
    PRIMARY KEY (id));

CREATE TABLE IF NOT EXISTS BBY_22_bookmarks(
    id int NOT NULL AUTO_INCREMENT, 
    user_id int NOT NULL,
    post_id int NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (user_id) REFERENCES BBY_22_users(id) ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY (post_id) REFERENCES BBY_22_item_posts(id) ON UPDATE CASCADE ON DELETE CASCADE);

CREATE TABLE IF NOT EXISTS BBY_22_ratings(
    id int NOT NULL AUTO_INCREMENT, 
    user int NOT NULL,                
    reviewer int NOT NULL, 
    rating int,
    PRIMARY KEY (id),
    FOREIGN KEY (user) REFERENCES BBY_22_users(id) ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY (reviewer) REFERENCES BBY_22_users(id) ON UPDATE CASCADE ON DELETE CASCADE);

INSERT INTO BBY_22_users (userName, firstName, lastName, city, email, password, type, profile_pic) 
VALUES ("Admin", "Test", "Admin", "Vancouver", "admin@test.ca", "password", "ADMIN", "user-pic-none.jpg"),
("User", "Test", "User", "Vancouver", "user@test.ca", "password", "USER", "user-pic-none.jpg");