"use strict";

// Requires
const express = require("express");
const session = require("express-session");
const res = require("express/lib/response");
const app = express();
const fs = require("fs");
const {
    JSDOM
} = require('jsdom');


app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));
const multer = require("multer");

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

const storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, "./public/imgs/")
    },
    filename: function (req, file, callback) {
        callback(null, "userPic-" + file.originalname.split('/').pop().trim());
        // callback(null, req.session.userID + file.originalname.split('/').pop().trim());
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


// Go to: http://localhost:8000
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

            const mysql = require("mysql2");
            const connection = mysql.createConnection(database);
            connection.connect();
            connection.query(

                'SELECT * FROM BBY_22_users',
                function (error, userResults, fields2) {

                    // Create a table to display the users table
                    let allUsers = "<table>";

                    // For loop gets each row of data
                    for (let row = 0; row < userResults.length; row++) {
                        let userIdNum = userResults[row].id;

                        // StrRowData creates a table that will be displayed on the HTML page
                        // Add each row of data and append each attribute to strRowData
                        let strRowData = "<tr><td><input type=\"text\" id=\"userFirstName" + userIdNum + "\"" + " value=\"" + userResults[row].firstName + "\">" + "</td></tr>";
                        strRowData += "<tr><td><input type=\"text\" id=\"userLastName" + userIdNum + "\"" + " value=\"" + userResults[row].lastName + "\">" + "</td></tr>";
                        strRowData += "<tr><td><input type=\"text\" id=\"userCity" + userIdNum + "\"" + " value=\"" + userResults[row].city + "\">" + "</td></tr>";
                        strRowData += "<tr><td><input type=\"text\" id=\"userEmail" + userIdNum + "\"" + " value=\"" + userResults[row].email + "\">" + "</td></tr>";
                        strRowData += "<tr><td><input type=\"text\" id=\"userPassword" + userIdNum + "\"" + " value=\"" + userResults[row].password + "\">" + "</td></tr>";
                        strRowData += "<tr><td><input type=\"text\" id=\"userType" + userIdNum + "\"" + " class=\"user-type-input\"" + " value=\"" + userResults[row].type + "\">" + "</td></tr>";
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

                        // Set button name and its method when clicked
                        mainDOM.window.document.getElementById("editButton" + userIdNum).textContent = "Edit User";
                        mainDOM.window.document.getElementById("editButton" + userIdNum).setAttribute("onclick", "updateAUsersData(" + userIdNum + ")");
                        mainDOM.window.document.getElementById("deleteButton" + userIdNum).textContent = "Delete User";
                        mainDOM.window.document.getElementById("deleteButton" + userIdNum).setAttribute("onclick", "deleteAUser(" + userIdNum + ")");
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

//populates the editpost page with the correct information
app.get("/editpost", function (req, res) {
    if (req.session.loggedIn) {
        let editpost = fs.readFileSync("./app/editpost.html", "utf8");
        let editpostDOM = new JSDOM(editpost);
        const mysql = require("mysql2");
        const connection = mysql.createConnection(database);
        let myResults = null;
        connection.connect();
        connection.query(
            "SELECT * FROM BBY_22_item_posts WHERE id = ? AND user_id = ?",
            [req.session.editpostID, req.session.userID],
            function (error, results, fields) {
                myResults = results;
                if (error) {} else if (results.length > 0) {
                    results.forEach(post => {
                        editpostDOM.window.document.querySelector("#title").setAttribute("value", `${post.title}`);
                        editpostDOM.window.document.querySelector("#city").setAttribute("value", `${post.city}`);
                        editpostDOM.window.document.querySelector("#description").innerHTML = `${post.description}`;
                        editpostDOM.window.document.querySelector("#savepost").setAttribute("onclick", `save_post(${post.id})`);
                        editpostDOM.window.document.querySelector("#deletepost").setAttribute("onclick", `delete_post(${post.id})`);
                    });
                    connection.end();
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

app.post("/loadposts", function (req, res) {
    const mysql = require("mysql2");
    const connection = mysql.createConnection(database);
    let myResults = null;
    let posts = [];
    connection.connect();
    connection.query(
        "SELECT * FROM BBY_22_item_posts where status != 'collected'",
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
})

app.post("/loadmyposts", function (req, res) {
    const mysql = require("mysql2");
    const connection = mysql.createConnection(database);
    let myResults = null;
    let posts = [];
    connection.connect();
    connection.query(
        "SELECT * FROM BBY_22_item_posts where user_id = ?",
        [req.session.userID],
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
})

app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));


// Login using an email and password
app.post("/login", function (req, res) {
    res.setHeader("Content-Type", "application/json");

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
    checkEmailAlreadyExists(req.body.email,
        function (recordReturned) {

            // If authenticate() returns null, user isn't currently in database, so their data can be inserted/added
            if (recordReturned == null) {

                const mysql = require("mysql2");
                let connection = mysql.createConnection(database);
                connection.connect();

                // Insert the new user into the database
                connection.query('INSERT INTO BBY_22_users (firstName, lastName, city, email, password, type, profile_pic) VALUES (?, ?, ?, ?, ?, ?, ?)',
                    [req.body.firstName, req.body.lastName, req.body.city, req.body.email, req.body.password, "USER", "user-pic-none.jpg"],

                    function (error, results, fields) {
                        if (error) {
                            // Send message saying account already exists
                            res.send({
                                status: "Fail",
                                msg: "Account already exists with this information."
                            });

                        } else {
                            // User is logged in, so save their data into a session
                            req.session.loggedIn = true;
                            req.session.email = req.body.email;
                            req.session.password = req.body.password;
                            req.session.firstName = req.body.firstName;
                            req.session.lastName = req.body.lastName;
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

                // Send message saying account already exists
                res.send({
                    status: "Fail",
                    msg: "Account already exists with this information."
                });
            }
        });
});

// Gets the user input from newPost.html and passes it into the database server.
app.post('/newPost', function (req, res) {
    res.setHeader('Content-Type', 'application/json');

    const mysql = require("mysql2");
    let connection = mysql.createConnection(database);
    connection.connect();

    // Get the current date and time 
    var today = new Date();
    var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    var dateAndTime = date + ' ' + time;

    // This is where the user input is passed into the database. 
    // User_ID is saved from the current user of the session. The details of the post are sent from the client side.
    connection.query('INSERT INTO BBY_22_item_posts (user_id, title, city, description, status, timestamp, item_pic) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [req.session.userID, req.body.title, req.body.city, req.body.description, "available", dateAndTime, req.body.item_pic],

        function (error, results, fields) {
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

    let newPic = req.files[0].filename;

    let profile = fs.readFileSync("./app/updateProfile.html", "utf8");
    let profileDOM = new JSDOM(profile);

    const mysql = require("mysql2");
    const connection = mysql.createConnection(database);
    connection.connect();
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

app.post('/upload-images2', upload.array("files"), function (req, res) {

    //console.log(req.body);
    // console.log(req.files);

    for (let i = 0; i < req.files.length; i++) {
        req.files[i].filename = req.files[i].originalname;
    }

});

// app.post('/profile-upload-single', upload.single('profile-file'), function (req, res, next) {
//     // req.file is the `profile-file` file
//     // req.body will hold the text fields, if there were any
//     console.log(JSON.stringify(req.file))
//     var response = '<a href="/">Home</a><br>'
//     response += "Files uploaded successfully.<br>"
//     response += `<img src="${req.file.path}" /><br>`
//     return res.send(response)
// })

// Load sign up page
app.get("/signup", function (req, res) {
    let signup = fs.readFileSync("./app/account.html", "utf8");
    let signupDOM = new JSDOM(signup);

    res.set("Server", "MACT Engine");
    res.set("X-Powered-By", "MACT");
    res.send(signupDOM.serialize());
});

app.get("/newPost", function (req, res) {
    let newPost = fs.readFileSync("./app/newPost.html", "utf8");
    let newPostDOM = new JSDOM(newPost);

    res.send(newPostDOM.serialize());
});


// Load profile page
app.get('/profile', function (req, res) {
    let profile = fs.readFileSync("./app/updateProfile.html", "utf8");
    let profileDOM = new JSDOM(profile);

    // Load current user's data into the text fields on the page
    profileDOM.window.document.getElementById("userFirstName").defaultValue = req.session.firstName;
    profileDOM.window.document.getElementById("userLastName").defaultValue = req.session.lastName;
    profileDOM.window.document.getElementById("userCity").defaultValue = req.session.city;
    profileDOM.window.document.getElementById("userEmail").defaultValue = req.session.email;
    profileDOM.window.document.getElementById("userPassword").defaultValue = req.session.password;

    let profileP = "<img src=\"imgs/userPic-" + req.session.profile_pic + "\" alt=\"profile-pic\" id=\"picID\">"
    profileDOM.window.document.getElementById("postimage").innerHTML = profileP

    res.set("Server", "MACT Engine");
    res.set("X-Powered-By", "MACT");
    res.send(profileDOM.serialize());
});

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
        const mysql = require("mysql2");
        const connection = mysql.createConnection(database);
        let myResults = null;
        connection.connect();
        connection.query(
            "SELECT * FROM BBY_22_item_posts WHERE id = ?",
            [req.session.postID],
            function (error, results, fields) {
                myResults = results;
                if (error) {} else if (results.length > 0) {
                    results.forEach(post => {
                        viewPostDOM.window.document.querySelector("#post-title").innerHTML = `${post.title}`;
                        viewPostDOM.window.document.querySelector("#post-status").innerHTML = `${post.status}`;
                        viewPostDOM.window.document.querySelector("#post-description").innerHTML = `${post.description}`;
                        viewPostDOM.window.document.querySelector("#post-location").innerHTML = `${post.city}`;
                        viewPostDOM.window.document.querySelector("#postdate").innerHTML = `${post.timestamp}`;

                        req.session.postOwnerID = post.user_id;

                        connection.query(
                            "SELECT * FROM BBY_22_users WHERE id = ?",
                            [req.session.postOwnerID],
                            function (error, results, fields) {
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
    const mysql = require("mysql2");
    const connection = mysql.createConnection(database);
    let userName = [];
    connection.connect();
    connection.query(
        "SELECT * FROM BBY_22_users WHERE id = ?",
        [req.session.postOwnerID],
        function (error, results, fields) {

            if (error) {} else if (results.length > 0) {
                results.forEach(user => {
                    userName = {
                        "name": `${user.firstName} ${user.lastName}`
                    }
                });


            } else {}
            res.send(userName);
        }
    );
});

//saves the postid so that the post can be edited on the editpost page
app.post('/toeditpost', (req, res) => {
    const mysql = require("mysql2");
    const connection = mysql.createConnection(database);
    connection.connect();
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
    const mysql = require("mysql2");
    const connection = mysql.createConnection(database);
    connection.connect();
    connection.query(
        "UPDATE BBY_22_item_posts SET title = ?, city = ?, description = ? WHERE id = ? AND user_id = ?",
        [req.body.title, req.body.city, req.body.description, req.body.postID, req.session.userID],
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

    const mysql = require("mysql2");
    const connection = mysql.createConnection(database);
    connection.connect();
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
    const mysql = require("mysql2");
    const connection = mysql.createConnection(database);
    connection.connect();
    connection.query(
        "UPDATE BBY_22_users SET firstName = ?, lastName = ?, city = ?, email = ?, password = ?, type = ? WHERE id = ?",
        [req.body.firstName, req.body.lastName, req.body.city, req.body.email, req.body.password, req.body.type, req.body.userID],
        function (error, results) {
            if (error) {
                res.send({
                    status: 'Fail',
                    msg: 'Error. User could not be updated.'
                });
            }
        }
    );

    res.send({
        status: 'Success',
        msg: 'Updated ' + req.body.firstName + ' ' + req.body.lastName + '\'s data.'
    });
});


// When a user updates their own data
app.post('/update-data', (req, res) => {
    const mysql = require("mysql2");
    const connection = mysql.createConnection(database);
    connection.connect();
    connection.query(
        "UPDATE BBY_22_users SET firstName = ?, lastName = ?, city = ?, email = ?, password = ? WHERE email = ? AND password = ?",
        [req.body.firstName, req.body.lastName, req.body.city, req.body.email, req.body.password, req.session.email, req.session.password],
        function (error, results) {
            if (error) {
                res.send({
                    status: "Fail",
                    msg: "Error updating data."
                });
            }
        }
    );

    res.send({
        status: 'Success',
        msg: 'Data updated.'
    });
});


// When an admin deletes a user from the database
app.post('/delete-user', (req, res) => {
    let requestName = req.body.firstName + " " + req.body.lastName;

    const mysql = require("mysql2");
    const connection = mysql.createConnection(database);
    connection.connect();
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

    // Checks if the new user's email is already in the database
    checkEmailAlreadyExists(req.body.email,
        function (recordReturned) {

            // If authenticate() returns null, user isn't currently in database, so they can be added
            if (recordReturned == null) {
                const mysql = require("mysql2");
                let connection = mysql.createConnection(database);
                connection.connect();
                connection.query('INSERT INTO BBY_22_users (firstName, lastName, city, email, password, type, profile_pic) VALUES (?, ?, ?, ?, ?, ?, ?)',
                    [req.body.firstName, req.body.lastName, req.body.city, req.body.email, req.body.password, req.body.type, "user-pic-none.jpg"],

                    function (error, results) {
                        if (error) {
                            // Send message saying account already exists
                            res.send({
                                status: "Fail",
                                msg: "Error adding user."
                            });

                        } else {
                            res.send({
                                status: "Success",
                                msg: req.body.firstName + " " + req.body.lastName + " was added."
                            });
                        }
                    });

            } else {
                // Account already exists in the database
                res.send({
                    status: "Fail",
                    msg: "Account already exists with this information."
                });
            }
        });
});


// Updates a post's status in the database
app.post('/update-post-status', (req, res) => {
    const mysql = require("mysql2");
    const connection = mysql.createConnection(database);
    connection.connect();
    connection.query(
        "UPDATE BBY_22_item_posts SET status = ? WHERE id = ?",
        [req.body.newStatus, req.body.postID],
        function (error, results) {
            if (error) {
                res.send({
                    status: 'Fail',
                    msg: 'Error. Post status could not be updated.'
                });
            }
            res.send({
                status: 'Success',
                msg: 'Updated post status.'
            });
        }
    );
});


// Saves the current session user as the user who reserved the post that was clicked
app.post('/save-user-pending-status', (req, res) => {
    const mysql = require("mysql2");
    const connection = mysql.createConnection(database);
    connection.connect();
    connection.query(
        "UPDATE BBY_22_item_posts SET user_reserved = ? WHERE id = ?",
        [req.session.userID, req.body.postID],
        function (error, results) {
            if (error) {
                res.send({
                    status: 'Fail',
                    msg: 'Error. Post status could not be updated.'
                });
            }
        }
    );

    res.send({
        status: 'Success',
        msg: 'Saved pending user in post.'
    });
});


// Returns the current session user ID and the post ID that was clicked. These get compared to verify if the user
// pressing the status button has the ability to set the item status to reserved or collected.
app.post('/get-post-and-session-ids', (req, res) => {
    let currentSessionUserID = req.session.userID;

    const mysql = require("mysql2");
    const connection = mysql.createConnection(database);
    connection.connect();
    connection.query(
        "SELECT user_id FROM BBY_22_item_posts WHERE id = ?",
        [req.body.postID],
        function (error, result) {
            res.send({
                status: 'Success',
                postUserID: result[0],
                currentUserID: currentSessionUserID
            });
        }
    );
});



// Validates user's email and password
function authenticateUser(email, pwd, callback) {

    const mysql = require("mysql2");
    const connection = mysql.createConnection(database);
    connection.connect();
    connection.query(
        "SELECT * FROM BBY_22_users WHERE email = ? AND password = ?", [email, pwd],
        function (error, results, fields) {

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
function checkEmailAlreadyExists(email, callback) {

    const mysql = require("mysql2");
    const connection = mysql.createConnection(database);
    connection.connect();
    connection.query(
        "SELECT * FROM BBY_22_users WHERE email = ?", [email],
        function (error, results, fields) {
            if (error) {
                res.send({
                    status: "Fail",
                    msg: "Error finding the user."
                });
            }
            if (results.length > 0) {
                // Email already exists
                return callback(results[0]);
            } else {
                // Email does not exist
                return callback(null);
            }
        }
    );
}


// Function connects to a database, checks if database exists, if not it creates it
async function initializeDatabase() {
    // Promise
    const mysql = require("mysql2/promise");
    const connection = await mysql.createConnection(database);

    const createDatabaseTables = `CREATE DATABASE IF NOT EXISTS COMP2800;
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
            FOREIGN KEY (user_id) REFERENCES BBY_22_users(id) ON UPDATE CASCADE ON DELETE CASCADE);`;

    if (is_heroku) {
        createDatabaseTables = `CREATE DATABASE IF NOT EXISTS gi80n4hbnupblp0y;
        use gi80n4hbnupblp0y;
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
            FOREIGN KEY (user_id) REFERENCES BBY_22_users(id) ON UPDATE CASCADE ON DELETE CASCADE);`;
    }

    // Creates a table for user profiles and item posts
    await connection.query(createDatabaseTables);

    // Await allows for us to wait for this line to execute synchronously
    const [rows, fields] = await connection.query("SELECT * FROM BBY_22_users");

    // Adds a default user account in case there is no data in the table.
    if (rows.length == 0) {
        let recordReturneds = "INSERT INTO BBY_22_users (firstName, lastName, city, email, password, type) VALUES ?";
        let recordValues = [
            ["Test", "Test", "Vancouver", "test@test.ca", "password", "ADMIN"]
        ];
        await connection.query(recordReturneds, [recordValues]);
    }

}

// Server runs on port 8000
let port = process.env.PORT || 8000;
app.listen(port, initializeDatabase);