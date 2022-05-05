// Requires
const express = require("express");
const session = require("express-session");
const app = express();
const fs = require("fs");
const {
    JSDOM
} = require('jsdom');

// Paths
app.use('/js', express.static('./public/js'));
app.use('/css', express.static('./public/css'));
app.use('/imgs', express.static('./public/imgs'));
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
            const connection = mysql.createConnection({
                host: "localhost",
                user: "root",
                password: "",
                database: "OnTheHouseDB"
            });
            connection.connect();
            connection.query(

                'SELECT * FROM users',
                function (error, userResults, fields2) {

                    // Create a table to display the users table
                    let allUsers = "<table><tr><th>First Name</th><th>Last Name</th><th>City</th><th>Email</th><th>Password</th><th>Role</th></tr>";

                    // For loop gets each row of data
                    for (let row = 0; row < userResults.length; row++) {
                        let userIdNum = userResults[row].id;

                        // Add each row of data and append each attribute to strRowData
                        let strRowData = "</tr><td>" + "<input type=\"text\" id=\"userFirstName" + userIdNum + "\"" + " value=\"" + userResults[row].firstName + "\">" + "</td>";
                        strRowData += "<td>" + "<input type=\"text\" id=\"userLastName" + userIdNum + "\"" + " value=\"" + userResults[row].lastName + "\">" + "</td>";
                        strRowData += "<td>" + "<input type=\"text\" id=\"userCity" + userIdNum + "\"" + " value=\"" + userResults[row].city + "\">" + "</td>";
                        strRowData += "<td>" + "<input type=\"text\" id=\"userEmail" + userIdNum + "\"" + " value=\"" + userResults[row].email + "\">" + "</td>";
                        strRowData += "<td>" + "<input type=\"text\" id=\"userPassword" + userIdNum + "\"" + " value=\"" + userResults[row].password + "\">" + "</td>";
                        strRowData += "<td>" + "<input type=\"text\" id=\"userType" + userIdNum + "\"" + " value=\"" + userResults[row].type + "\">" + "</td>";
                        //doesnt work
                        strRowData += "<td>" + "<button id=\"editButton" + userIdNum + "\"" + "</tr>";
                        strRowData += "<td>" + "<button id=\"deleteButton" + userIdNum + "\"" + "</td></tr>";

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
            // If it is a regular user
            //Display posts on the main page
            let main = fs.readFileSync("./app/main.html", "utf8");
            let mainDOM = new JSDOM(main);
            const mysql = require("mysql2");
            const connection = mysql.createConnection({
                host: "localhost",
                user: "root",
                password: "",
                database: "OnTheHouseDB"
            });
            let myResults = null;
            connection.connect();

            connection.execute(
                "SELECT * FROM item_posts",
                function (error, results, fields) {
                    console.log("results:", results);
                    myResults = results;
                    let posttemplate = mainDOM.window.document.getElementById("posttemplate");
                    let posts = mainDOM.window.document.getElementById("posts");
                    if (error) {} else if (results.length > 0) {
                        results.forEach(post => {
                            let testpost = posttemplate.content.cloneNode(true);
                            testpost.querySelector(".post").id = `post${post.ID}`;
                            testpost.querySelector(".posttitle").innerHTML = post.title;
                            testpost.querySelector(".poststatus").innerHTML = post.status;
                            testpost.querySelector(".postlocation").innerHTML = post.city;
                            testpost.querySelector(".poststatus").innerHTML = post.status;
                            testpost.querySelector(".postdate").innerHTML = post.timestamp;
                            testpost.querySelector(".savepost").id = `save${post.ID}`;
                            testpost.querySelector(".messagepost").id = `message${post.ID}`;
                            posts.appendChild(testpost);
                        });
                        connection.end();
                        res.set("Server", "MACT Engine");
                        res.set("X-Powered-By", "MACT");
                        res.send(mainDOM.serialize());
                    } else {}
    
                }
            );
        }
    } else {
        // User is not logged in, so direct to login page
        res.redirect("/");
    }
});


app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));


// Login
app.post("/login", function (req, res) {
    res.setHeader("Content-Type", "application/json");

    console.log("What was sent", req.body.email, req.body.password);

    authenticateUser(req.body.email, req.body.password,
        function (recordReturned) {

            if (recordReturned == null) {
                // User login in unsuccessful
                res.send({
                    status: "fail",
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

                req.session.save(function (err) {
                    // session saved
                });

                // Send message saying user's login was successful
                res.send({
                    status: "success",
                    msg: "Logged in."
                });
            }
        });
});


// Logout
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
                let connection = mysql.createConnection({
                    host: 'localhost',
                    user: 'root',
                    password: '',
                    database: 'OnTheHouseDB'
                });
                connection.connect();
                connection.query('INSERT INTO users (firstName, lastName, city, email, password, type) values (?, ?, ?, ?, ?, ?)',
                    [req.body.firstName, req.body.lastName, req.body.city, req.body.email, req.body.password, "USER"],

                    function (error, results, fields) {
                        if (error) {
                            console.log(error);

                            // Send message saying account already exists
                            res.send({
                                status: "fail",
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

                            req.session.save(function (err) {
                                // Session saved
                            });

                            res.send({
                                status: "success",
                                msg: "New user logged in."
                            });
                        }
                    });

            } else {

                // Send message saying account already exists
                res.send({
                    status: "fail",
                    msg: "Account already exists with this information."
                });
            }
        });
});

//Gets the user input from newPost.html and passes it into the database server.
app.post('/newPost', function (req, res) {
    res.setHeader('Content-Type', 'application/json');

    const mysql = require("mysql2");
    let connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'OnTheHouseDB'
    });
    connection.connect();

    var today = new Date();
    var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    var dateAndTime = date + ' ' + time;

    // This is where the user input is passed into the database. 
    // User_ID is hardcoded and needs to be amended.
    connection.query('INSERT INTO item_posts (user_id, title, city, description, status, timestamp) values (?, ?, ?, ?, ?, ?)',
        [2, req.body.title, req.body.city, req.body.description, "available", dateAndTime],

        function (error, results, fields) {
            if (error) {
                console.log(error);

                // Send message saying account already exists
                res.send({
                    status: "fail",
                    msg: "Account already exists with this information."
                });

            } else {
                // Do we need this set of code?
                // req.session.loggedIn = true;
                // req.session.title = req.body.title;
                // req.session.city = req.body.city;
                // req.session.description = req.body.description;
                // req.session.status = "Available";
                // req.session.timestamp = "April 30, 2020 (dummy date)";

                req.session.save(function (err) {
                    // Session saved
                });

                res.send({
                    status: "success",
                    msg: "New post created."
                });
            }
        });
});


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

    console.log("Directed to sign up page");

    // res.set("Server", "MACT Engine");
    // res.set("X-Powered-By", "MACT");
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

    res.set("Server", "MACT Engine");
    res.set("X-Powered-By", "MACT");
    res.send(profileDOM.serialize());
});


// When an admin updates a user's data
app.post('/update-user-data', (req, res) => {
    const mysql = require("mysql2");
    const connection = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: "OnTheHouseDB"
    });
    connection.connect();
    connection.query(
        "UPDATE users SET firstName = ?, lastName = ?, city = ?, email = ?, password = ?, type = ? WHERE id = ?",
        [req.body.firstName, req.body.lastName, req.body.city, req.body.email, req.body.password, req.body.type, req.body.userID],
        function (error, results) {
            if (error) {
                console.log(error);

                res.send({
                    status: 'Fail',
                    msg: 'Error. User could not be updated'
                });
            }
        }
    );

    res.send({
        status: 'Success',
        msg: 'Updated ' + req.body.firstName + ' ' + req.body.lastName + '\'s data'
    });
});


// When a user updates their own data
app.post('/update-data', (req, res) => {
    const mysql = require("mysql2");
    const connection = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: "OnTheHouseDB"
    });
    connection.connect();
    connection.query(
        "UPDATE users SET firstName = ?, lastName = ?, city = ?, email = ?, password = ? WHERE email = ? AND password = ?",
        [req.body.firstName, req.body.lastName, req.body.city, req.body.email, req.body.password, req.session.email, req.session.password],
        function (error, results) {
            if (error) {
                console.log(error);
            }
        }
    );

    res.send({
        status: 'Success',
        msg: 'Data updated'
    });
});


// When an admin deletes a user from the database
app.post('/delete-user', (req, res) => {
    let requestName = req.body.firstName + " " + req.body.lastName;

    const mysql = require("mysql2");
    const connection = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: "OnTheHouseDB"
    });
    connection.connect();
    connection.query(
        "DELETE FROM users WHERE id = ?",
        [req.body.userID],
        function (error, results) {
            if (error) {
                console.log(error);
            }
        }

    );

    res.send({
        status: 'Success',
        msg: 'Deleted ' + requestName + '\'s data'
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
                let connection = mysql.createConnection({
                    host: 'localhost',
                    user: 'root',
                    password: '',
                    database: 'OnTheHouseDB'
                });
                connection.connect();
                connection.query('INSERT INTO users (firstName, lastName, city, email, password, type) values (?, ?, ?, ?, ?, ?)',
                    [req.body.firstName, req.body.lastName, req.body.city, req.body.email, req.body.password, req.body.type],

                    function (error, results) {
                        if (error) {
                            console.log(error);

                            // Send message saying account already exists
                            res.send({
                                status: "Fail",
                                msg: "Error adding user."
                            });

                        } else {
                            res.send({
                                status: "Success",
                                msg: req.body.firstName + " " +  req.body.lastName + " was added."
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



// Validates user's email and password
function authenticateUser(email, pwd, callback) {

    const mysql = require("mysql2");
    const connection = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: "OnTheHouseDB"
    });
    connection.connect();
    connection.query(
        "SELECT * FROM users WHERE email = ? AND password = ?", [email, pwd],
        function (error, results, fields) {
            console.log("Results from DB", results, "and the # of records returned", results.length);

            if (error) {
                console.log(error);
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
    const connection = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: "OnTheHouseDB"
    });
    connection.connect();
    connection.query(
        "SELECT * FROM users WHERE email = ?", [email],
        function (error, results, fields) {
            if (error) {
                console.log(error);
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
async function init() {
    // Promise
    const mysql = require("mysql2/promise");
    const connection = await mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        multipleStatements: true
    });

    //Creates a table for user profiles and item posts
    const createDatabaseTables = `CREATE DATABASE IF NOT EXISTS OnTheHouseDB;
        use OnTheHouseDB;
        CREATE TABLE IF NOT EXISTS users(
        id int NOT NULL AUTO_INCREMENT, 
        firstName VARCHAR(20), 
        lastName VARCHAR(20), 
        city VARCHAR(30), 
        email VARCHAR(30), 
        password VARCHAR(30), 
        type VARCHAR(10),
        PRIMARY KEY (id));
        
        CREATE TABLE IF NOT EXISTS item_posts(
            id int NOT NULL AUTO_INCREMENT, 
            user_id int NOT NULL,
            title VARCHAR(50), 
            description VARCHAR(1000), 
            city VARCHAR(30), 
            status VARCHAR(30), 
            timestamp VARCHAR(50),
            PRIMARY KEY (id),
            FOREIGN KEY (user_id) REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE);`;
    await connection.query(createDatabaseTables);

    // Await allows for us to wait for this line to execute synchronously
    const [rows, fields] = await connection.query("SELECT * FROM users");

    // Adds a default user account in case there is no data in the table.
    if (rows.length == 0) {
        let recordReturneds = "INSERT INTO users (firstName, lastName, city, email, password, type) VALUES ?";
        let recordValues = [
            ["Test", "Test", "Vancouver", "test@test.ca", "password", "ADMIN"]
        ];
        await connection.query(recordReturneds, [recordValues]);
    }

    console.log("Listening on port " + port + "!");
}

// Server runs on port 8000
let port = 8000;
app.listen(port, init);