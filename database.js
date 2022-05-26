"use strict";

// Requires
const express = require("express");
const session = require("express-session");
const res = require("express/lib/response");
const app = express();
const multer = require("multer");
const fs = require("fs");
const {
    JSDOM
} = require('jsdom');
const sanitizeHtml = require('sanitize-html');


var http = require("http").createServer(app);
var io = require("socket.io")(http);
var users = [];

app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));

//mysql connection setup
const is_heroku = process.env.IS_HEROKU || false;
var database = {
    host: "localhost",
    user: "root",
    password: "",
    database: "COMP2800",
    multipleStatements: true
};

if (is_heroku) {
    database = {
        host: "nnsgluut5mye50or.cbetxkdyhwsb.us-east-1.rds.amazonaws.com",
        user: "biysuiwt6fbjxdfw",
        password: "llwyk8vg4c7p5rtu",
        database: "gi80n4hbnupblp0y",
        multipleStatements: true
    };
}

const mysql = require("mysql2");
const {
    request
} = require("http");
const connection = mysql.createPool(database);

const storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, "./public/imgs/uploads/")
    },
    filename: function (req, file, callback) {
        callback(null, "userPic-" + req.session.userID + file.originalname.split('/').pop().trim());
    }
});
const upload = multer({
    storage: storage
});

// Paths
app.use('/js', express.static('./public/js'));
app.use('/css', express.static('./public/css'));
app.use('/imgs', express.static('./public/imgs'));
app.use('/img', express.static('/public/imgs'));
app.use('/html', express.static('./app'));

// Session
app.use(session({
    secret: "no one will guess this secret",
    name: "onTheHouseSessionID",
    resave: false,
    saveUninitialized: true
}));

// Go to the landing page
app.get('/', function (req, res) {

    // If there is a current session, go directly to the main page
    if (req.session.loggedIn) {
        res.redirect("/main");

    } else {
        // If there's no session, go to the login page
        let login = fs.readFileSync("./app/login.html", "utf8");
        let loginDOM = new JSDOM(login);

        res.set("Server", "MACT Engine");
        res.set("X-Powered-By", "MACT");
        res.send(loginDOM.serialize());
    }
});

// When user successfully logs in
app.get("/main", function (req, res) {

    // Check if user is logged in, if they are then check the user's type
    if (req.session.loggedIn) {

        // If user is admin
        if (req.session.type == "ADMIN") {
            let main = fs.readFileSync("./app/dashboard.html", "utf8");
            let mainDOM = new JSDOM(main);

            // Get the user's name and put it into the page
            mainDOM.window.document.getElementById("customerName").innerHTML = "Welcome, " + req.session.firstName +
                " " + req.session.lastName + "!";

            connection.query(

                'SELECT * FROM BBY_22_users',
                function (error, userResults) {

                    // Create a table to display the users table
                    let allUsers = "<table>";

                    // For loop gets each row of data
                    for (let row = 0; row < userResults.length; row++) {
                        let userIdNum = userResults[row].id;

                        // StrRowData creates a table that will be displayed on the HTML page
                        // Add each row of data and append each attribute to strRowData
                        let strRowData = "<tr><td><input type=\"text\" id=\"userFirstName" + userIdNum + "\"" + " value=\"" + userResults[row].firstName + "\"" + " placeholder=\"First Name\"" + " maxlength=\"20\"" + ">" + "</td></tr>";
                        strRowData += "<tr><td><input type=\"text\" id=\"userLastName" + userIdNum + "\"" + " value=\"" + userResults[row].lastName + "\"" + " placeholder=\"Last Name\"" + " maxlength=\"20\"" + ">" + "</td></tr>";
                        strRowData += "<tr><td><input type=\"text\" id=\"userName" + userIdNum + "\"" + " value=\"" + userResults[row].userName + "\"" + " placeholder=\"User Name\"" + " maxlength=\"20\"" + ">" + "</td></tr>";
                        strRowData += "<tr><td><input type=\"text\" id=\"userCity" + userIdNum + "\"" + " value=\"" + userResults[row].city + "\"" + " placeholder=\"City\"" + " maxlength=\"30\"" + ">" + "</td></tr>";
                        strRowData += "<tr><td><input type=\"email\" id=\"userEmail" + userIdNum + "\"" + " value=\"" + userResults[row].email + "\"" + " placeholder=\"Email@email.ca\"" + " maxlength=\"30\"" + ">" + "</td></tr>";
                        strRowData += "<tr><td><input type=\"text\" id=\"userPassword" + userIdNum + "\"" + " value=\"" + userResults[row].password + "\"" + " placeholder=\"Password\"" + " maxlength=\"30\"" + ">" + "</td></tr>";

                        // Dropdown of user types
                        strRowData += "<tr><td><select name=\"user-type\" id=\"userType" + userIdNum + "\" class=\"user-type-input\">";
                        strRowData += "<option id=\"ADMIN" + userIdNum + "\" value=\"ADMIN\">Admin</option>";
                        strRowData += "<option id=\"USER" + userIdNum + "\" value=\"USER\">User</option>";
                        strRowData += "</select></td></tr>";

                        strRowData += "<tr><td>" + "<button id=\"editButton" + userIdNum + "\"" + "</td><tr>";
                        strRowData += "<tr><td>" + "<button id=\"deleteButton" + userIdNum + "\"" + "</td></tr>";

                        allUsers += strRowData;
                    }

                    // Close table tag
                    allUsers += "</table>";

                    // Add table to HTML div
                    mainDOM.window.document.getElementById("userTableDiv").innerHTML = allUsers;

                    for (let row = 0; row < userResults.length; row++) {
                        let userIdNum = userResults[row].id;

                        // Select the current user's type as the default dropdown value
                        let currUserType = userResults[row].type;
                        mainDOM.window.document.getElementById(currUserType + userIdNum).setAttribute("selected", "selected");

                        // Set the button name and its method when clicked
                        mainDOM.window.document.getElementById("editButton" + userIdNum).textContent = "Edit User";
                        mainDOM.window.document.getElementById("editButton" + userIdNum).setAttribute("onclick", "updateAUsersData(" + userIdNum + ")");

                        mainDOM.window.document.getElementById("deleteButton" + userIdNum).textContent = "Delete User";
                        mainDOM.window.document.getElementById("deleteButton" + userIdNum).setAttribute("onclick", "showConfirmDeletePopup()");
                        mainDOM.window.document.getElementById("deleteMsgBtn").setAttribute("onclick", "deleteAUser(" + userIdNum + ")");
                    }

                    res.set("Server", "MACT Engine");
                    res.set("X-Powered-By", "MACT");
                    res.send(mainDOM.serialize());
                }
            );

        } else {
            // If it is a regular user, display posts on the main page
            let main = fs.readFileSync("./app/main.html", "utf8");
            let mainDOM = new JSDOM(main);

            mainDOM.window.document.getElementById("customerName").innerHTML = "Welcome, " + req.session.firstName +
                " " + req.session.lastName + "!";

            res.set("Server", "MACT Engine");
            res.set("X-Powered-By", "MACT");
            res.send(mainDOM.serialize());
        }
    } else {
        // User is not logged in, so direct to login page
        res.redirect("/");
    }
});

// My listings page of all this user's posts
app.get("/mylistings", function (req, res) {

    // Check if user is logged in
    if (req.session.loggedIn) {
        let mylistings = fs.readFileSync("./app/mylistings.html", "utf8");
        let mylistingsDOM = new JSDOM(mylistings);
        res.set("Server", "MACT Engine");
        res.set("X-Powered-By", "MACT");
        res.send(mylistingsDOM.serialize());
    } else {
        // User is not logged in, so direct to login page
        res.redirect("/");
    }
});

var currentPostID = ""
//populates the editpost page with the correct information
app.get("/editpost", function (req, res) {
    if (req.session.loggedIn) {
        let editpost = fs.readFileSync("./app/editpost.html", "utf8");
        let editpostDOM = new JSDOM(editpost);
        let myResults = null;
        currentPostID = req.session.editpostID;

        connection.query(
            "SELECT * FROM BBY_22_item_posts WHERE id = ? AND user_id = ?",
            [req.session.editpostID, req.session.userID],
            function (error, results) {
                myResults = results;
                if (error) {} else if (results.length > 0) {
                    results.forEach(post => {
                        editpostDOM.window.document.querySelector("#title").setAttribute("value", `${post.title}`);
                        editpostDOM.window.document.querySelector("#city").setAttribute("value", `${post.city}`);
                        editpostDOM.window.document.querySelector("#description").innerHTML = `${post.description}`;
                        editpostDOM.window.document.querySelector("#reserveUserBtn").setAttribute("onclick", `reserveUserForItem(${post.id})`);

                        editpostDOM.window.document.querySelector("#savepost").setAttribute("onclick", `save_post(${post.id})`);
                        editpostDOM.window.document.querySelector("#deleteMsgBtn").setAttribute("onclick", `delete_post(${post.id})`);
                    });
                } else {}

                res.set("Server", "MACT Engine");
                res.set("X-Powered-By", "MACT");
                res.send(editpostDOM.serialize());
            }
        );
    } else {
        // User is not logged in, so direct to login page
        res.redirect("/");
    }
});

//sends item post information to main page client
app.post("/loadposts", function (req, res) {
    let myResults = null;
    let posts = [];

    connection.query(
        "SELECT * FROM BBY_22_item_posts where status != 'collected'",
        function (error, results) {
            myResults = results;
            if (error) {} else if (results.length > 0) {
                results.forEach(post => {
                    if (req.session.userID == post.user_id) {
                        posts.push({
                            "postid": post.id,
                            "title": post.title,
                            "status": post.status,
                            "city": post.city,
                            "timestamp": post.timestamp,
                            "item_pic": post.item_pic,
                            "is_owner": true
                        });
                    } else {
                        posts.push({
                            "postid": post.id,
                            "title": post.title,
                            "status": post.status,
                            "city": post.city,
                            "timestamp": post.timestamp,
                            "item_pic": post.item_pic,
                            "is_owner": false
                        });
                    }
                    
                });
            }
            res.send(posts);
        }
    );
});

//checks for duplicate and adds a bookmark to the database
app.post("/addBookmark", function (req, res) {

    connection.query("SELECT * FROM BBY_22_bookmarks WHERE user_id = ? AND post_id = ?",
        [req.session.userID, req.body.postID],
        function (error, results) {
            if (error) {

            } else if (results.length > 0) {
                //detects an existing bookmark

            } else {
                connection.query('INSERT INTO BBY_22_bookmarks (user_id, post_id) VALUES (?, ?)',
                    [req.session.userID, req.body.postID],
                    function (error, results) {
                        if (error) {

                        } else {
                            req.session.save(function (err) {
                                // Session saved
                            });

                            res.send({
                                status: "Success",
                                msg: "New bookmark created."
                            });
                        }
                    });

            }


        });
});

//checks for exisiting record and removes a bookmark from the database
app.post("/removeBookmark", function (req, res) {

    //removes a bookmark
    connection.query("DELETE FROM BBY_22_bookmarks WHERE user_id = ? AND post_id = ?",
        [req.session.userID, req.body.postID],
        function (error, results) {
            if (error) {}
        }
    );

    res.send({
        status: "Success",
        msg: "Bookmark removed."
    });
});

// Loads all this user's posts and sends them to the client side my listings file
app.post("/loadmyposts", function (req, res) {
    let myResults = null;
    let posts = [];

    connection.query(
        "SELECT * FROM BBY_22_item_posts where user_id = ?",
        [req.session.userID],
        function (error, results) {
            myResults = results;
            if (error) {} else if (results.length > 0) {
                results.forEach(post => {
                    posts.push({
                        "postid": post.id,
                        "title": post.title,
                        "status": post.status,
                        "city": post.city,
                        "timestamp": post.timestamp,
                        "item_pic": post.item_pic
                    });
                });
            }
            res.send(posts);
        }
    );
});


// Loads all bookmarked posts for this user
app.post("/loadmybookmarks", function (req, res) {
    let myResults = null;
    let bookmarks = [];

    connection.query(
        "SELECT * FROM BBY_22_bookmarks where user_id = ?",
        [req.session.userID],
        function (error, results) {
            myResults = results;
            if (error) {} else if (results.length > 0) {
                results.forEach(bookmark => {
                    bookmarks.push({
                        "saveid": bookmark.post_id
                    });
                });
            }
            res.send(bookmarks);
        }
    );
});

// Gets all posts
app.post("/loadsavedposts", function (req, res) {
    let myResults = null;
    let savedposts = [];
    connection.query(
        "SELECT * FROM BBY_22_item_posts",
        function (error, results) {
            myResults = results;
            if (error) {} else if (results.length > 0) {
                results.forEach(post => {

                    for (let i = 0; i < req.body.length; i++) {
                        if (post.id == req.body[i].saveid) {
                            savedposts.push({
                                "postid": post.id,
                                "title": post.title,
                                "status": post.status,
                                "city": post.city,
                                "timestamp": post.timestamp,
                                "item_pic": post.item_pic
                            });
                        }

                    }


                });
            }
            res.send(savedposts);
        }
    );
});


// Login validation using an email and password
app.post("/login", function (req, res) {
    res.setHeader("Content-Type", "application/json");

    // Check that the email entered belongs to a user in the database
    authenticateUser(req.body.email, req.body.password,
        function (recordReturned) {

            if (recordReturned == null) {
                // User login in unsuccessful
                res.send({
                    status: "Fail",
                    msg: "Account not found."
                });
            } else {
                // If user successfully logged in, authenticate the user, create a session
                req.session.loggedIn = true;
                req.session.email = recordReturned.email;
                req.session.password = recordReturned.password;
                req.session.firstName = recordReturned.firstName;
                req.session.lastName = recordReturned.lastName;
                req.session.userName = recordReturned.userName;
                req.session.city = recordReturned.city;
                req.session.type = recordReturned.type;
                req.session.userID = recordReturned.id;
                req.session.profile_pic = recordReturned.profile_pic;

                req.session.save(function (err) {
                    // session saved
                });

                // Send message saying user's login was successful
                res.send({
                    status: "Success",
                    msg: "Logged in."
                });
            }
        });
});


// Logout of the session
app.get("/logout", function (req, res) {

    if (req.session) {
        req.session.destroy(function (error) {
            if (error) {
                res.status(400).send("Unable to log out");
            } else {
                // Session deleted, redirect to home
                res.redirect("/");
            }
        });
    }
});


// After user signs up
app.post('/signup', function (req, res) {
    res.setHeader('Content-Type', 'application/json');

    // Checks if the new user's email is already in the database (email must be unique)
    checkEmailAlreadyExists(req.body.email, req.session.email,
        function (recordReturned) {

            // If email validation returns null, user isn't currently in database, so their data can be inserted/added
            if (recordReturned == null) {
                // Checks if the new user's username is already in the database (username must be unique)
                checkUsernameAlreadyExists(req.body.userName, req.session.userName,
                    function (recordReturned) {

                        // If username validation returns null, user isn't currently in database, so their data can be inserted/added
                        if (recordReturned == null) {

                            // Insert the new user into the database
                            connection.query('INSERT INTO BBY_22_users (firstName, lastName, userName, city, email, password, type, profile_pic) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
                                [req.body.firstName, req.body.lastName, req.body.userName, req.body.city, req.body.email, req.body.password, "USER", "user-pic-none.jpg"],

                                function (error, results) {
                                    if (error) {
                                        // Send message saying there was an error when signing up.
                                        res.send({
                                            status: "Fail",
                                            msg: "Error when signing up."
                                        });

                                    } else {
                                        // User is logged in, so save their data into a session
                                        req.session.loggedIn = true;
                                        req.session.email = req.body.email;
                                        req.session.password = req.body.password;
                                        req.session.firstName = req.body.firstName;
                                        req.session.lastName = req.body.lastName;
                                        req.session.userName = req.body.userName;
                                        req.session.city = req.body.city;
                                        req.session.type = req.body.type;
                                        req.session.userID = results.insertId;
                                        req.session.profile_pic = "user-pic-none.jpg";

                                        req.session.save(function (err) {
                                            // Session saved
                                        });

                                        res.send({
                                            status: "Success",
                                            msg: "New user logged in."
                                        });
                                    }
                                });

                        } else {

                            // Send message saying username already exists
                            res.send({
                                status: "Fail",
                                field: "userName",
                                msg: "Username already exists."
                            });
                        }
                    });
            } else {

                // Send message saying email already exists
                res.send({
                    status: "Fail",
                    field: "userEmail",
                    msg: "Email already exists."
                });
            }
        });
});


var timeStampPhoto = ""
// Gets the user input from newPost.html and passes it into the database server.
app.post('/newPost', function (req, res) {
    res.setHeader('Content-Type', 'application/json');

    // Sanitize text from tiny editor
    let sanitizeDescription = sanitizeHtml(req.body.description, {
        allowedTags: []
    }, {
        allowedAttributes: {}
    });

    // Get the current date and time 
    var today = new Date();
    var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    var dateAndTime = date + ' ' + time;
    timeStampPhoto = dateAndTime

    // This is where the user input is passed into the database. 
    // User_ID is saved from the current user of the session. The details of the post are sent from the client side.
    connection.query('INSERT INTO BBY_22_item_posts (user_id, title, city, description, status, timestamp) VALUES (?, ?, ?, ?, ?, ?)',
        [req.session.userID, req.body.title, req.body.city, sanitizeDescription, "available", dateAndTime],
        function (error, results) {
            if (error) {

            } else {
                req.session.save(function (err) {
                    // Session saved
                });

                res.send({
                    status: "Success",
                    msg: "New post created."
                });
            }
        });
});


// Stores image in database
app.post('/upload-images', upload.array("files"), function (req, res) {
    for (let i = 0; i < req.files.length; i++) {
        req.files[i].filename = req.files[i].originalname;
    }

    let newPic = req.session.userID + req.files[0].filename;

    let profile = fs.readFileSync("./app/updateProfile.html", "utf8");
    let profileDOM = new JSDOM(profile);

    connection.query(
        "UPDATE BBY_22_users SET profile_pic = ? WHERE id = ? ",
        [newPic, req.session.userID],
        function (error, results) {
            if (error) {
                res.send({
                    status: 'Fail',
                    msg: 'Error. Profile picture could not be updated.'
                });
            }

            // Store value of new image in the session
            req.session.profile_pic = newPic;

            res.set("Server", "MACT Engine");
            res.set("X-Powered-By", "MACT");
            res.send(profileDOM.serialize());
        }
    );
});

// When user updates their item post photo
app.post('/upload-images2', upload.array("files"), function (req, res) {
    for (let i = 0; i < req.files.length; i++) {
        req.files[i].filename = req.files[i].originalname;
    }

    let newPic = req.session.userID + req.files[0].filename;
    let main = fs.readFileSync("./app/main.html", "utf8");
    let mainDOM = new JSDOM(main);

    connection.query(
        "UPDATE BBY_22_item_posts SET item_pic = ? WHERE user_id = ? AND timestamp = ?",
        [newPic, req.session.userID, timeStampPhoto],
        function (error, results) {
            if (error) {
                res.send({
                    status: 'Fail',
                    msg: 'Error. Profile picture could not be updated.'
                });
            }

            res.set("Server", "MACT Engine");
            res.set("X-Powered-By", "MACT");
            res.send(mainDOM.serialize());
        }
    );
});

//image upload
app.post('/upload-images3', upload.array("files"), function (req, res) {
    for (let i = 0; i < req.files.length; i++) {
        req.files[i].filename = req.files[i].originalname;
    }

    let newPic = req.session.userID + req.files[0].filename;
    let main = fs.readFileSync("./app/main.html", "utf8");
    let mainDOM = new JSDOM(main);

    connection.query(
        "UPDATE BBY_22_item_posts SET item_pic = ? WHERE user_id = ? AND id = ?",
        [newPic, req.session.userID, currentPostID],
        function (error, results) {
            if (error) {
                res.send({
                    status: 'Fail',
                    msg: 'Error. Profile picture could not be updated.'
                });
            }

            res.set("Server", "MACT Engine");
            res.set("X-Powered-By", "MACT");
            res.send(mainDOM.serialize());
        }
    );
});

// Load sign up page
app.get("/signup", function (req, res) {
    // If there is a current session, go directly to the main page
    if (req.session.loggedIn) {
        res.redirect("/main");

    } else {
        // If there's no session, go to the signup page
        let signup = fs.readFileSync("./app/account.html", "utf8");
        let signupDOM = new JSDOM(signup);

        res.set("Server", "MACT Engine");
        res.set("X-Powered-By", "MACT");
        res.send(signupDOM.serialize());
    }
});

//Load newPost page
app.get("/newPost", function (req, res) {
    if (req.session.loggedIn) {
        let newPost = fs.readFileSync("./app/newPost.html", "utf8");
        let newPostDOM = new JSDOM(newPost);

        res.send(newPostDOM.serialize());

    } else {
        // User is not logged in, so return to landing page
        res.redirect("/");
    }
});

//Load myBookmarks page
app.get("/myBookmarks", function (req, res) {
    if (req.session.loggedIn) {
        let myBookmarks = fs.readFileSync("./app/myBookmarks.html", "utf8");
        let myBookmarksDOM = new JSDOM(myBookmarks);

        res.send(myBookmarksDOM.serialize());

    } else {
        // User is not logged in, so return to landing page
        res.redirect("/");
    }
});

//Load game page
app.get("/game", function (req, res) {
    if (req.session.loggedIn) {
        let game = fs.readFileSync("./app/game.html", "utf8");
        let gameDOM = new JSDOM(game);

        res.send(gameDOM.serialize());

    } else {
        // User is not logged in, so return to landing page
        res.redirect("/");
    }
});

//Load newPostPhoto page
app.get("/newPostPhoto", function (req, res) {
    if (req.session.loggedIn) {
        let newPost = fs.readFileSync("./app/newPostPhoto.html", "utf8");
        let newPostDOM = new JSDOM(newPost);

        res.send(newPostDOM.serialize());

    } else {
        // User is not logged in, so return to landing page
        res.redirect("/");
    }
});

// Load profile page
app.get('/profile', function (req, res) {
    if (req.session.loggedIn) {
        let profile = fs.readFileSync("./app/updateProfile.html", "utf8");
        let profileDOM = new JSDOM(profile);

        // Load current user's data into the text fields on the page
        profileDOM.window.document.getElementById("userFirstName").defaultValue = req.session.firstName;
        profileDOM.window.document.getElementById("userLastName").defaultValue = req.session.lastName;
        profileDOM.window.document.getElementById("userName").defaultValue = req.session.userName;
        profileDOM.window.document.getElementById("userCity").defaultValue = req.session.city;
        profileDOM.window.document.getElementById("userEmail").defaultValue = req.session.email;
        profileDOM.window.document.getElementById("userPassword").defaultValue = req.session.password;
        var profileP = "<img src=\"imgs/uploads/userPic-" + req.session.profile_pic + "\" alt=\"profile-pic\" id=\"picID\">";
        profileDOM.window.document.getElementById("postimage").innerHTML = profileP;

        connection.query(
            "SELECT * FROM BBY_22_ratings WHERE user = ?",
            [req.session.userID],
            function (error, results, fields) {
                let totalrating = 0;
                let i = 0;
                if (error) {} else if (results.length > 0) {
                    results.forEach(rating => {
                        // Load current user's data into the text fields on the page
                        totalrating = totalrating + rating.rating;
                        i++;
                    });
                    let avgrating = totalrating / i;
                    if (Math.round(avgrating) != 0) {
                        profileDOM.window.document.querySelector(`#rating${Math.round(avgrating)}`).setAttribute("checked", "");
                    }
                    profileDOM.window.document.querySelector("#score").innerHTML = `${avgrating.toFixed(1)}/5.0`;
                } else {
                    profileDOM.window.document.querySelector("#score").innerHTML = `no rating`;
                }
                res.set("Server", "MACT Engine");
                res.set("X-Powered-By", "MACT");
                res.send(profileDOM.serialize());
            }
        );

    } else {
        // User is not logged in, so return to landing page
        res.redirect("/");
    }
});

//view user profile
app.get('/profile/:username', function (req, res) {
    if (req.session.loggedIn) {
        let profile = fs.readFileSync("./app/profile.html", "utf8");
        let profileDOM = new JSDOM(profile);

        connection.query(
            "SELECT * FROM BBY_22_users WHERE userName = ?",
            [req.params.username],
            function (error, results) {

                if (error) {} else if (results.length > 0) {
                    results.forEach(user => {
                        // Load current user's data into the text fields on the page
                        profileDOM.window.document.querySelector("#username").innerHTML = user.userName;
                        let profileP = "<img src=\"/imgs/uploads/userPic-" + user.profile_pic + "\" alt=\"profile-pic\" id=\"picID\">"
                        profileDOM.window.document.getElementById("postimage").innerHTML = profileP
                        profileDOM.window.document.querySelector("#saverating").setAttribute("onclick", `saverating("${user.userName}")`);
                        profileDOM.window.document.querySelector("#itemlistings").setAttribute("onclick", `window.location.replace("/itemlistings/${user.userName}")`);
                        profileDOM.window.document.getElementById("messageuser").setAttribute("onclick", `getMessagePage("${user.userName}")`);
                        connection.query(
                            "SELECT * FROM BBY_22_ratings WHERE user = ?",
                            [user.id],
                            function (error, results, fields) {
                                let totalrating = 0;
                                let i = 0;
                                if (error) {} else if (results.length > 0) {
                                    results.forEach(rating => {
                                        // Load current user's data into the text fields on the page
                                        totalrating = totalrating + rating.rating;
                                        i++;
                                    });
                                    let avgrating = totalrating / i;
                                    if (Math.round(avgrating) != 0) {
                                        profileDOM.window.document.querySelector(`#rating${Math.round(avgrating)}`).setAttribute("checked", "");
                                    }
                                    profileDOM.window.document.querySelector("#score").innerHTML = `${avgrating.toFixed(1)}/5.0`;
                                } else {
                                    profileDOM.window.document.querySelector("#score").innerHTML = `no rating`;
                                }
                                res.set("Server", "MACT Engine");
                                res.set("X-Powered-By", "MACT");
                                res.send(profileDOM.serialize());
                            }
                        );
                    });
                } else {}
            }
        );
    } else {
        // User is not logged in, so direct to login page
        res.redirect("/");
    }
});

//shows item listing of specified user
app.get("/itemlistings/:username", function (req, res) {
    // Check if user is logged in
    if (req.session.loggedIn) {
        let listings = fs.readFileSync("./app/listings.html", "utf8");
        let listingsDOM = new JSDOM(listings);
        listingsDOM.window.document.querySelector("#pagename").innerHTML = `${req.params.username}'s Listings`;
        res.set("Server", "MACT Engine");
        res.set("X-Powered-By", "MACT");
        res.send(listingsDOM.serialize());
    } else {
        // User is not logged in, so direct to login page
        res.redirect("/");
    }
});

//save user rating to database
app.post('/saverating', (req, res) => {
    connection.query(
        "SELECT * FROM BBY_22_users WHERE userName = ?",
        [req.body.userName],
        function (error, results) {
            if (error) {
                res.send({
                    status: 'Fail',
                    msg: 'Error finding user'
                });
            } else if (results.length > 0) {
                let user_id = results[0].id;
                if (user_id == req.session.userID) {
                    res.send({
                        status: "Fail",
                        msg: "Can not rate yourself"
                    });
                } else {
                    connection.query(
                        "SELECT * FROM BBY_22_ratings WHERE user = ? AND reviewer = ?",
                        [user_id, req.session.userID],
                        function (error, results) {
                            if (error) {
                                res.send({
                                    status: "Fail",
                                    msg: "Error saving rating."
                                });
                            } else if (results.length > 0) {
                                connection.query(
                                    "UPDATE BBY_22_ratings SET rating = ? WHERE user = ? AND reviewer = ?",
                                    [req.body.rating, user_id, req.session.userID],
                                    function (error, results) {
                                        if (error) {
                                            res.send({
                                                status: "Fail",
                                                msg: "Error saving rating."
                                            });
                                        } else {
                                            res.send({
                                                status: 'Success',
                                                msg: 'Rating saved.'
                                            });
                                        }
                                    }
                                );
                            } else {
                                connection.query(
                                    "INSERT INTO BBY_22_ratings (user, reviewer, rating) VALUES (?, ?, ?)",
                                    [user_id, req.session.userID, req.body.rating],
                                    function (error, results) {
                                        if (error) {
                                            res.send({
                                                status: "Fail",
                                                msg: "Error saving rating."
                                            });
                                        } else {
                                            res.send({
                                                status: 'Success',
                                                msg: 'Rating saved.'
                                            });
                                        }
                                    }
                                );
                            }
                        }
                    );
                }
            }
        }
    );
});

//load user's posts on user listing page
app.post("/loaduserposts", function (req, res) {
    let myResults = null;
    let posts = [];

    connection.query(
        "SELECT * FROM BBY_22_users where userName = ?",
        [req.body.username],
        function (error, results, fields) {
            myResults = results;
            if (error) {} else if (results.length > 0) {
                results.forEach(user => {
                    connection.query(
                        "SELECT * FROM BBY_22_item_posts where user_id = ?",
                        [user.id],
                        function (error, results, fields) {
                            myResults = results;
                            if (error) {} else if (results.length > 0) {
                                results.forEach(post => {
                                    posts.push({
                                        "postid": post.id,
                                        "title": post.title,
                                        "status": post.status,
                                        "city": post.city,
                                        "timestamp": post.timestamp,
                                        "item_pic": post.item_pic
                                    });
                                });
                            }
                            res.send(posts);
                        }
                    );
                });
            }
        }
    );
})

//saves the postid so that the post can be viewed on the viewPost page
app.post('/toviewpost', (req, res) => {

    req.session.postID = req.body.postID;
    res.send({
        status: 'Success',
        msg: 'recorded post id'
    });
});

//populates the view post page with the correct information
app.get("/viewPost", function (req, res) {
    if (req.session.loggedIn) {
        let viewPost = fs.readFileSync("./app/viewPost.html", "utf8");
        let viewPostDOM = new JSDOM(viewPost);
        let myResults = null;

        connection.query(
            "SELECT * FROM BBY_22_item_posts WHERE id = ?",
            [req.session.postID],
            function (error, results) {
                myResults = results;
                if (error) {} else if (results.length > 0) {
                    results.forEach(post => {
                        viewPostDOM.window.document.querySelector("#post-title").innerHTML = `${post.title}`;
                        viewPostDOM.window.document.querySelector("#post-status").innerHTML = `${post.status}`;
                        viewPostDOM.window.document.querySelector("#post-description").innerHTML = `${post.description}`;
                        viewPostDOM.window.document.querySelector("#post-location").innerHTML = `${post.city}`;
                        viewPostDOM.window.document.querySelector("#postdate").innerHTML = `${post.timestamp}`;
                        let profileP = "<img src=\"imgs/uploads/userPic-" + post.item_pic + "\" alt=\"profile-pic\" id=\"picID\">";
                        viewPostDOM.window.document.getElementById("postimage").innerHTML = profileP;
                        viewPostDOM.window.document.getElementById("messagepost").setAttribute("onclick", `getMessagePage(${post.id})`);
                        req.session.postOwnerID = post.user_id;

                        if (req.session.userID == post.user_id) {
                            viewPostDOM.window.document.querySelector("#initialP").innerHTML = ""
                            viewPostDOM.window.document.querySelector("#finalP").innerHTML = "profile"
                            viewPostDOM.window.document.querySelector("#postoptions").innerHTML = 
                            `<div id="editpost" onclick="editpost(${post.id})">
                                Edit Post
                            </div>`;
                        }

                        connection.query(
                            "SELECT * FROM BBY_22_users WHERE id = ?",
                            [req.session.postOwnerID],
                            function (error, results) {
                                myResults = results;
                                if (error) {} else if (results.length > 0) {
                                    results.forEach(user => {
                                        viewPostDOM.window.document.querySelector("#post-owner").innerHTML = `${user.firstName} ${user.lastName}`;
                                    });
                                } else {}

                            }
                        );

                        res.set("Server", "MACT Engine");
                        res.set("X-Powered-By", "MACT");
                        res.send(viewPostDOM.serialize());

                    });
                } else {}
            }
        );
    } else {
        // User is not logged in, so direct to login page
        res.redirect("/");
    }
});

//to get post owner name from user table and displays it when view post details
app.post('/getPostOwner', (req, res) => {
    let userName = [];

    connection.query(
        "SELECT * FROM BBY_22_users WHERE id = ?",
        [req.session.postOwnerID],
        function (error, results) {

            if (error) {} else if (results.length > 0) {
                results.forEach(user => {
                    userName = {
                        "name": `${user.userName}`
                    }
                });


            } else {}
            res.send(userName);
        }
    );
});

//saves the postid so that the post can be edited on the editpost page
app.post('/toeditpost', (req, res) => {

    connection.query(
        "SELECT * FROM BBY_22_item_posts WHERE id = ?",
        [req.body.postID],
        function (error, results) {
            if (error) {} else if (results.length > 0) {
                results.forEach(post => {
                    if (post.user_id == req.session.userID) {
                        req.session.editpostID = req.body.postID;
                        res.send({
                            status: 'Success',
                            msg: 'recorded post id'
                        });
                    } else {
                        res.send({
                            status: 'Fail',
                            msg: 'Invalid user'
                        });
                    }
                });
            }
        }
    );
});

//save edits to post
app.post('/savepostinfo', (req, res) => {

    // Sanitize text from tiny editor
    let sanitizeDescription = sanitizeHtml(req.body.description, {
        allowedTags: []
    }, {
        allowedAttributes: {}
    });

    connection.query(
        "UPDATE BBY_22_item_posts SET title = ?, city = ?, description = ?, status = ? WHERE id = ? AND user_id = ?",
        [req.body.title, req.body.city, sanitizeDescription, req.body.status, req.body.postID, req.session.userID],
        function (error, results) {
            if (error) {
                res.send({
                    status: 'Fail',
                    msg: 'Error. Post could not be updated.'
                });
            }
        }
    );

    res.send({
        status: 'Success',
        msg: 'Post data updated.'
    });
});

// delete post
app.post('/deletepost', (req, res) => {

    connection.query(
        "DELETE FROM BBY_22_item_posts WHERE id = ? AND user_id = ?",
        [req.body.postID, req.session.userID],
        function (error, results) {
            if (error) {
                res.send({
                    status: 'Fail',
                    msg: 'Post could not be deleted.'
                });
            }
        }
    );

    res.send({
        status: 'Success',
        msg: 'Post deleted'
    });
});


// When an admin updates a user's data
app.post('/update-user-data', (req, res) => {

    // Check if the updated email is valid (must be unique or the same as before)
    checkEmailDashboard(req.body.email, req.body.userID,
        function (recordReturned) {

            // If validation method returns null, user's email is either the same user or they aren't currently in database, so their data can be updated
            if (recordReturned == null) {
                // Checks if the updated username is valid (must be unique or the same as before)
                checkUsernameDashboard(req.body.userName, req.body.userID,
                    function (recordReturned) {

                        // If validation method returns null, user's username is either the same user or they aren't currently in database, so their data can be updated
                        if (recordReturned == null) {

                            // Update the user into the database
                            connection.query(
                                "UPDATE BBY_22_users SET firstName = ?, lastName = ?, userName = ?, city = ?, email = ?, password = ?, type = ? WHERE id = ?",
                                [req.body.firstName, req.body.lastName, req.body.userName, req.body.city, req.body.email, req.body.password, req.body.type, req.body.userID],
                                function (error, results) {
                                    if (error) {
                                        res.send({
                                            status: "Fail",
                                            msg: "Error updating data."
                                        });
                                    }
                                    res.send({
                                        status: 'Success',
                                        msg: 'Updated ' + req.body.userName + '\'s data.'
                                    });
                                }
                            );

                        } else {
                            // Validation username method returned a different user
                            // Send message saying username already exists
                            res.send({
                                status: "Fail",
                                msg: "Username already exists."
                            });
                        }
                    });

            } else {
                // Validation email method returned a different user
                // Send message saying email already exists
                res.send({
                    status: "Fail",
                    msg: "Email already exists."
                });
            }
        });
});

// Checks an email on the dashboard when being updated
function checkEmailDashboard(email, userID, callback) {

    connection.query(
        "SELECT * FROM BBY_22_users WHERE email = ?", [email],
        function (error, results) {
            if (error) {
                res.send({
                    status: "Fail",
                    msg: "Error finding the user."
                });
            }
            if (results.length > 0) {
                let resultID = results[0].id;

                // If the user's ID matches the result ID, user edited is same as the user returned
                if (userID == resultID) {
                    // Email is same as before, so it can be updated
                    return callback(null);
                } else {
                    // Email doesn't match, so it already exists as another user and cannot be edited
                    return callback(results[0]);
                }

            } else {
                // Email does not exist so it can be updated
                return callback(null);
            }
        }
    );
}

// Checks a username on the dashboard when being updated
function checkUsernameDashboard(userName, userID, callback) {

    connection.query(
        "SELECT * FROM BBY_22_users WHERE userName = ?", [userName],
        function (error, results) {

            if (error) {
                res.send({
                    status: "Fail",
                    msg: "Error finding the user."
                });
            }
            if (results.length > 0) {
                let resultID = results[0].id;

                // If the user's ID matches the result ID, user edited is same as the user returned
                if (userID == resultID) {
                    // Username is same as before, so it can be updated
                    return callback(null);
                } else {
                    // Username doesn't match, so it already exists as another user and cannot be edited
                    return callback(results[0]);
                }

            } else {
                // Username does not exist
                return callback(null);
            }
        }
    );
}


// When a user updates their own data
app.post('/update-data', (req, res) => {

    checkEmailAlreadyExists(req.body.email, req.session.email,
        function (recordReturned) {

            // If validation returns null, user isn't currently in database, so their data can be updated
            if (recordReturned == null) {
                //Checks if the new user's username is already in the database (username must be unique)
                checkUsernameAlreadyExists(req.body.userName, req.session.userName,
                    function (recordReturned) {

                        // If validation returns null, user isn't currently in database, so their data can be updated
                        if (recordReturned == null) {

                            // Insert the new user into the database
                            connection.query(
                                "UPDATE BBY_22_users SET firstName = ?, lastName = ?, userName = ?, city = ?, email = ?, password = ? WHERE email = ? AND password = ?",
                                [req.body.firstName, req.body.lastName, req.body.userName, req.body.city, req.body.email, req.body.password, req.session.email, req.session.password],
                                function (error, results) {
                                    if (error) {
                                        res.send({
                                            status: "Fail",
                                            field: "none",
                                            msg: "Error updating data."
                                        });
                                    } else {
                                        req.session.email = req.body.email;
                                        req.session.password = req.body.password;
                                        req.session.firstName = req.body.firstName;
                                        req.session.lastName = req.body.lastName;
                                        req.session.userName = req.body.userName;
                                        req.session.city = req.body.city;

                                        res.send({
                                            status: 'Success',
                                            msg: 'Data updated.'
                                        });
                                    }
                                }
                            );

                        } else {

                            // Send message saying username already exists
                            res.send({
                                status: "Fail",
                                field: "userName",
                                msg: "Username already exists."
                            });
                        }
                    });
            } else {

                // Send message saying email already exists
                res.send({
                    status: "Fail",
                    field: "userEmail",
                    msg: "Email already exists."
                });
            }
        });
});


// When an admin deletes a user from the database
app.post('/delete-user', (req, res) => {
    let requestName = req.body.userName;

    connection.query(
        "DELETE FROM BBY_22_users WHERE id = ?",
        [req.body.userID],
        function (error, results) {
            if (error) {
                res.send({
                    status: 'Fail',
                    msg: 'User could not be deleted.'
                });
            }
        }

    );

    res.send({
        status: 'Success',
        msg: 'Deleted ' + requestName + ' from the database.'
    });
});


// When an admin adds a new user to the database
app.post('/add-new-user', (req, res) => {

    checkEmailBeforeAdding(req.body.email,
        function (recordReturned) {

            // If check email method returns null, user isn't currently in database, so their data can be inserted/added
            if (recordReturned == null) {
                //Checks if the new user's username is already in the database (username must be unique)
                checkUsernameBeforeAdding(req.body.userName,
                    function (recordReturned) {

                        // If check username method returns null, user isn't currently in database, so their data can be inserted/added
                        if (recordReturned == null) {

                            // Insert the new user into the database
                            connection.query('INSERT INTO BBY_22_users (firstName, lastName, userName, city, email, password, type, profile_pic) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
                                [req.body.firstName, req.body.lastName, req.body.userName, req.body.city, req.body.email, req.body.password, req.body.type, "user-pic-none.jpg"],

                                function (error, results, fields) {
                                    if (error) {
                                        // Send message saying there was an error
                                        res.send({
                                            status: "Fail",
                                            msg: "Error adding user."
                                        });

                                    } else {
                                        res.send({
                                            status: "Success",
                                            msg: req.body.userName + " was added."
                                        });
                                    }
                                });

                        } else {

                            // Send message saying email already exists
                            res.send({
                                status: "Fail",
                                msg: "Username already exists."
                            });
                        }
                    });
            } else {

                // Send message saying email already exists
                res.send({
                    status: "Fail",
                    msg: "Email already exists."
                });
            }
        });
});

// Checks an email on the dashboard before being added
function checkEmailBeforeAdding(email, callback) {

    connection.query(
        "SELECT * FROM BBY_22_users WHERE email = ?", [email],
        function (error, results) {
            if (error) {
                res.send({
                    status: "Fail",
                    msg: "Error finding the user."
                });
            }
            if (results.length > 0) {
                // Email already exists so it cannot be added
                return callback(results[0]);

            } else {
                // Email does not exist so it can be added
                return callback(null);
            }
        }
    );
}

// Checks a username on the dashboard before being added
function checkUsernameBeforeAdding(userName, callback) {

    connection.query(
        "SELECT * FROM BBY_22_users WHERE userName = ?", [userName],
        function (error, results) {

            if (error) {
                res.send({
                    status: "Fail",
                    msg: "Error finding the user."
                });
            }
            if (results.length > 0) {
                // Username already exists so it cannot be added
                return callback(results[0]);

            } else {
                // Username does not exist so it can be added
                return callback(null);
            }
        }
    );
}


// Checks if a username exists in the database before reserving an item
app.post('/check-username-exists', (req, res) => {
    connection.query("SELECT * FROM BBY_22_users WHERE userName = ? AND type = 'USER'",
        [req.body.userReserved],
        function (error, results) {
            if (error) {}
            if (results.length > 0) {
                // If username matches the post owner's, they can't reserve it for themself
                if (results[0].userName == req.session.userName) {
                    res.send({
                        status: 'Fail',
                        msg: "You cannot reserve an item for yourself."
                    });

                } else {
                    // Username exists and is valid
                    res.send({
                        status: 'Success',
                        username: results[0]
                    });
                }

            } else {
                // Username does not exist
                res.send({
                    status: 'Fail',
                    msg: "Username does not exist."
                });
            }
        }
    );
});


// Reserves an item for a user
app.post('/reserve-user-for-item', (req, res) => {
    connection.query(
        "UPDATE BBY_22_item_posts SET user_reserved = ?, status = 'reserved' WHERE id = ?",
        [req.body.userReserved, req.body.postID],
        function (error, results) {
            if (error) {
                res.send({
                    status: 'Fail',
                    msg: 'Error. Item could not be reserved.'
                });
            }
            res.send({
                status: 'Success',
                msg: 'Reserved item.'
            });
        }
    );
});


// Gets the current item post status and user reserved value
app.post('/get-current-item-status', (req, res) => {
    connection.query("SELECT * FROM BBY_22_item_posts WHERE id = ? AND user_id = ?",
        [req.session.editpostID, req.session.userID],
        function (error, results) {
            if (error) {}
            // Get the user_reserved value
            res.send({
                status: 'Success',
                postID: req.session.editpostID,
                userID: req.session.userID,
                itemStatus: results[0].status,
                userReserved: results[0].user_reserved
            });
        }
    );
});



// Loads all messages page
app.get("/message", (req, res) => {

    if (req.session.loggedIn) {
        let message = fs.readFileSync("./app/message.html", "utf8");
        let messageDOM = new JSDOM(message);

        messageDOM.window.document.getElementById("thisUserName").textContent = req.session.userName;

        // Create the appropriate HTML script for socket.io
        let socketScript = messageDOM.window.document.createElement("script");
        if (is_heroku) {
            socketScript.src = "https://on-the-house-bby-22.herokuapp.com/socket.io/socket.io.js";

        } else {
            socketScript.src = "http://localhost:8000/socket.io/socket.io.js";
        }
        messageDOM.window.document.body.appendChild(socketScript);

        let clientScript = messageDOM.window.document.createElement("script");
        clientScript.src = "js/clientMessage.js";
        messageDOM.window.document.body.appendChild(clientScript);

        res.set("Server", "MACT Engine");
        res.set("X-Powered-By", "MACT");
        res.send(messageDOM.serialize());

    } else {
        // User is not logged in, so direct to login page
        res.redirect("/");
    }
});


// Loads private message page after clicking a post
app.get("/postMessage", (req, res) => {

    if (req.session.loggedIn) {
        let message = fs.readFileSync("./app/postMessage.html", "utf8");
        let messageDOM = new JSDOM(message);

        messageDOM.window.document.getElementById("thisUserName").textContent = req.session.userName;

        // Create the appropriate HTML script for socket.io
        let socketScript = messageDOM.window.document.createElement("script");
        if (is_heroku) {
            socketScript.src = "https://on-the-house-bby-22.herokuapp.com/socket.io/socket.io.js";

        } else {
            socketScript.src = "http://localhost:8000/socket.io/socket.io.js";
        }
        messageDOM.window.document.body.appendChild(socketScript);

        let clientScript = messageDOM.window.document.createElement("script");
        clientScript.src = "js/clientPostMessage.js";
        messageDOM.window.document.body.appendChild(clientScript);

        res.set("Server", "MACT Engine");
        res.set("X-Powered-By", "MACT");
        res.send(messageDOM.serialize());

    } else {
        // User is not logged in, so direct to login page
        res.redirect("/");
    }
});


// Gets all messages between 2 users
app.post("/all-messages-between-two-users", function (req, res) {
    // Gets past messages from the 2 users in the database
    connection.query("SELECT * FROM BBY_22_messages WHERE (userSending = ? AND userReceiving = ?) OR (userSending = ? AND userReceiving = ?)",
        [req.body.userSending, req.body.userReceiving, req.body.userReceiving, req.body.userSending],
        function (error, messages) {
            res.send({
                status: "Success",
                dbResult: messages,
                sessionUserID: req.session.userID
            })
        }
    );
});


// Gets a post owner's user ID and the current user's ID, from the post ID
app.post("/get-other-user-by-post", function (req, res) {

    connection.query("SELECT user_id FROM BBY_22_item_posts WHERE id = ?",
        [req.body.postID],
        function (error, otherID) {
            res.send({
                status: "Success",
                otherUserID: otherID[0],
                sessionUserID: req.session.userID
            })
        }
    );
});


// Gets a post owner's username from the post ID
app.post("/get-owner-username-with-id", function (req, res) {

    // Gets the email of the user with this user ID
    connection.query("SELECT userName FROM BBY_22_users WHERE id = ?",
        [req.body.otherUserID],
        function (error, username) {
            res.send({
                status: "Success",
                otherUsername: username[0]
            })
        }
    );
});


// Get all people the user has received a message from
app.post("/people-who-messaged-this-user", function (req, res) {

    // Gets all usernames who have sent this user a message or received one from them
    let sqlStatement = "SELECT DISTINCT userSending, userReceiving FROM bby_22_messages WHERE userReceiving = '" + req.session.userID + "'" + " OR userSending = '" + req.session.userID + "'";
    connection.query(sqlStatement,
        function (error, contacts) {
            res.send({
                status: "Success",
                thisUsersContacts: contacts,
                sessionUserID: req.session.userID
            })
        }
    );
});


// Get user's user ID based on their username
app.post("/get-user-id-from-username", function (req, res) {

    connection.query("SELECT id FROM bby_22_users WHERE userName = ?",
        [req.body.userName],
        function (error, otherID) {
            res.send({
                status: "Success",
                otherUserID: otherID[0],
                sessionUserID: req.session.userID
            })
        }
    );
});


// Get current session user ID
app.post("/get-this-users-id", function (req, res) {

    connection.query("SELECT id FROM bby_22_users WHERE email = ? AND password = ?",
        [req.session.email, req.session.password],
        function (error, id) {
            res.send({
                status: "Success",
                thisUsersID: id[0]
            })
        }
    );
});



/* 
 * Setup for messaging feature using socket.io
 * Handles all methods called when a user connects
 * This is the source that was referenced and modified: https://www.youtube.com/watch?v=Ozrm_xftcjQ
 */
io.on("connection", function (socket) {

    // Add a listener for new user
    socket.on("a-user-connects", function (username) {
        // Save in array
        users[username] = socket.id;

        // socket ID will be used to send message to individual person
        io.emit("a-user-connects", username);
    });

    socket.on("send-message-to-other-user", function (data) {
        // send event to userReceiving
        var socketId = users[data.userReceiving];

        io.to(socketId).emit("new-message-from-other-user", data);

        var today = new Date();
        var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
        var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        var dateAndTime = date + ' ' + time;

        connection.query("INSERT INTO BBY_22_messages (userSending, userReceiving, message, time) VALUES (?, ?, ?, ?)",
            [data.userSending, data.userReceiving, data.message, dateAndTime],
            function (error, result) {}
        );
    });
});



// Validates user's email and password
function authenticateUser(email, pwd, callback) {

    connection.query(
        "SELECT * FROM BBY_22_users WHERE email = ? AND password = ?", [email, pwd],
        function (error, results) {

            if (error) {
                res.send({
                    status: "Fail",
                    msg: "Error finding the user."
                });
            }
            if (results.length > 0) {
                // email and password found
                return callback(results[0]);
            } else {
                // user not found
                return callback(null);
            }
        }

    );

}

// Checks whether or not a new user's email already exists in the database
function checkEmailAlreadyExists(email, sessionemail, callback) {

    connection.query(
        "SELECT * FROM BBY_22_users WHERE email = ?", [email],
        function (error, results) {
            if (error) {
                res.send({
                    status: "Fail",
                    msg: "Error finding the user."
                });
            }
            if (results.length > 0 && email != sessionemail) {
                // Email already and is not current user email
                return callback(results[0]);
            } else {
                // Email does not exist
                return callback(null);
            }
        }
    );
}

// Checks whether or not a new user's username already exists in the database
function checkUsernameAlreadyExists(username, sessionusername, callback) {

    connection.query(
        "SELECT * FROM BBY_22_users WHERE userName = ?", [username],
        function (error, results) {
            if (error) {
                res.send({
                    status: "Fail",
                    msg: "Error finding the user."
                });
            }
            if (results.length > 0 && username != sessionusername) {
                // username already and is not current user username
                return callback(results[0]);
            } else {
                // username does not exist
                return callback(null);
            }
        }
    );
}


// Function connects to a database, checks if database exists, if not it creates it
async function initializeDatabase() {
    // Promise
    const mysql = require("mysql2/promise");
    let connection;
    let createDatabaseTables;

    if (is_heroku) {
        connection = await mysql.createConnection({
            host: "nnsgluut5mye50or.cbetxkdyhwsb.us-east-1.rds.amazonaws.com",
            user: "biysuiwt6fbjxdfw",
            password: "llwyk8vg4c7p5rtu",
            database: "gi80n4hbnupblp0y",
            multipleStatements: true
        });
        createDatabaseTables = `CREATE DATABASE IF NOT EXISTS gi80n4hbnupblp0y;
        use gi80n4hbnupblp0y;
        CREATE TABLE IF NOT EXISTS BBY_22_users(
        id int NOT NULL AUTO_INCREMENT, 
        firstName VARCHAR(20), 
        lastName VARCHAR(20), 
        userName VARCHAR(20), 
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
            FOREIGN KEY (reviewer) REFERENCES BBY_22_users(id) ON UPDATE CASCADE ON DELETE CASCADE);`;
    } else {
        connection = await mysql.createConnection({
            host: "localhost",
            user: "root",
            password: "",
            multipleStatements: true
        });
        createDatabaseTables = `CREATE DATABASE IF NOT EXISTS COMP2800;
        use COMP2800;
        CREATE TABLE IF NOT EXISTS BBY_22_users(
        id int NOT NULL AUTO_INCREMENT, 
        firstName VARCHAR(20), 
        lastName VARCHAR(20),
        userName VARCHAR(20),  
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
            FOREIGN KEY (reviewer) REFERENCES BBY_22_users(id) ON UPDATE CASCADE ON DELETE CASCADE);`;
    }

    // Creates a table for user profiles and item posts
    await connection.query(createDatabaseTables);

    // Await allows for us to wait for this line to execute synchronously
    const [rows, fields] = await connection.query("SELECT * FROM BBY_22_users");

    // Adds default admin and user accounts in case there is no data in the table.
    if (rows.length == 0) {
        let recordReturneds = "INSERT INTO BBY_22_users (firstName, lastName, userName, city, email, password, type, profile_pic) VALUES ?";
        let recordValues = [
            ["Admin", "Test", "Admin", "Vancouver", "admin@test.ca", "password", "ADMIN", "user-pic-none.jpg"],
            ["User", "Test", "User", "Vancouver", "user@test.ca", "password", "USER", "user-pic-none.jpg"]
        ];
        await connection.query(recordReturneds, [recordValues]);
    }

}

// Server runs on port 8000
let port = process.env.PORT || 8000;
http.listen(port, function () {
    initializeDatabase();
});