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

    // Check for a session first
    if (req.session.loggedIn) {
        res.redirect("/main");

    } else {
        let doc = fs.readFileSync("./app/index.html", "utf8");

        res.set("Server", "MACT Engine");
        res.set("X-Powered-By", "MACT");
        res.send(doc);
    }
});


// When index login button redirects to login page
app.get("/login", function (req, res) {
    let login = fs.readFileSync("./app/login.html", "utf8");
    let loginDOM = new JSDOM(login);

    res.set("Server", "MACT Engine");
    res.set("X-Powered-By", "MACT");
    res.send(loginDOM.serialize());
});


// When user successfully logs in
app.get("/main", function (req, res) {

    if (req.session.loggedIn) {

        // Check user's type
        if (req.session.type == "ADMIN") {
            let main = fs.readFileSync("./app/dashboard.html", "utf8");
            let mainDOM = new JSDOM(main);

            // Get the user's data and put it into the page
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

                    // Create a table to display the recipes table
                    let allUsers = "<table><tr><th>First Name</th><th>Last Name</th><th>City</th><th>Email</th><th>Password</th><th>Edit</th></tr>";

                    // For loop gets each row of data
                    for (let row = 0; row < userResults.length; row++) {
                        let userIdNum = userResults[row].id;

                        // Add each row of data and append each attribute to strRowData
                        let strRowData = "</tr><td>" + "<input type=\"text\" id=\"firstName" + userIdNum + "\"" + " value=\"" + userResults[row].firstName + "\">" + "</td>";
                        strRowData += "<td>" + "<input type=\"text\" id=\"lastName" + userIdNum + "\"" + " value=\"" + userResults[row].lastName + "\">" + "</td>";
                        strRowData += "<td>" + "<input type=\"text\" id=\"city" + userIdNum + "\"" + " value=\"" + userResults[row].city + "\">" + "</td>";
                        strRowData += "<td>" + "<input type=\"text\" id=\"email" + userIdNum + "\"" + " value=\"" + userResults[row].email + "\">" + "</td>";
                        strRowData += "<td>" + "<input type=\"text\" id=\"password" + userIdNum + "\"" + " value=\"" + userResults[row].password + "\">" + "</td>";
                        strRowData += "<td>" + "<button id=\"button" + userIdNum + "\"" + "</td></tr>";

                        allUsers += strRowData;
                    }

                    // Close table tag
                    allUsers += "</table>";

                    // Add table to HTML div
                    mainDOM.window.document.getElementById("userTableDiv").innerHTML = allUsers;

                    for (let row = 0; row < userResults.length; row++) {
                        let userIdNum = userResults[row].id;

                        mainDOM.window.document.getElementById("button" + userIdNum).textContent = "Edit User " + userIdNum;
                    }

                    res.set("Server", "Wazubi Engine");
                    res.set("X-Powered-By", "Wazubi");
                    res.send(mainDOM.serialize());
                }
            );

        } else {
            let main = fs.readFileSync("./app/main.html", "utf8");
            let mainDOM = new JSDOM(main);

            // Get the user's data and put it into the page
            mainDOM.window.document.getElementById("customerName").innerHTML = "Welcome, " + req.session.firstName +
                " " + req.session.lastName + "!";

            res.set("Server", "MACT Engine");
            res.set("X-Powered-By", "MACT");
            res.send(mainDOM.serialize());
        }

    } else {
        // not logged in - no session and no access, redirect to home
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

    let results = authenticateUser(req.body.email, req.body.password,
        function (userRecord) {

            if (userRecord == null) {
                // User login in unsuccessful
                res.send({
                    status: "fail",
                    msg: "Account not found."
                });
            } else {
                // If user successfully logged in, authenticate the user, create a session
                req.session.loggedIn = true;
                req.session.email = userRecord.email;
                req.session.password = userRecord.password;
                req.session.firstName = userRecord.firstName;
                req.session.lastName = userRecord.lastName;
                req.session.city = userRecord.city;
                req.session.type = userRecord.type;

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


app.post('/signup', function (req, res) {
    res.setHeader('Content-Type', 'application/json');

    let results = checkEmailAlreadyExists(req.body.email,
        function (userRecord) {

            // When authenticate() returns null because user isn't currently in database
            if (userRecord == null) {

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


app.get("/signup", function (req, res) {
    let signup = fs.readFileSync("./app/account.html", "utf8");
    let signupDOM = new JSDOM(signup);

    console.log("Directed to sign up page");

    res.set("Server", "MACT Engine");
    res.set("X-Powered-By", "MACT");
    res.send(signupDOM.serialize());
});


app.get('/profile', function (req, res) {
    let profile = fs.readFileSync("./app/profile.html", "utf8");
    let profileDOM = new JSDOM(profile);

    profileDOM.window.document.getElementById("userFirstName").defaultValue = req.session.firstName;
    profileDOM.window.document.getElementById("userLastName").defaultValue = req.session.lastName;
    profileDOM.window.document.getElementById("userCity").defaultValue = req.session.city;
    profileDOM.window.document.getElementById("userEmail").defaultValue = req.session.email;
    profileDOM.window.document.getElementById("userPassword").defaultValue = req.session.password;

    res.set("Server", "MACT Engine");
    res.set("X-Powered-By", "MACT");
    res.send(profileDOM.serialize());
});


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
        msg: 'Updated ' + req.body.firstName + ' ' + req.body.lastName + '\'s data'
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
    const createDBAndTables = `CREATE DATABASE IF NOT EXISTS OnTheHouseDB;
        use OnTheHouseDB;
        CREATE TABLE IF NOT EXISTS users(
        userID int NOT NULL AUTO_INCREMENT, 
        firstName VARCHAR(20), 
        lastName VARCHAR(20), 
        city VARCHAR(30), 
        email VARCHAR(30), 
        password VARCHAR(30), 
        type VARCHAR(10),
        PRIMARY KEY (userID));`;
    await connection.query(createDBAndTables);

    // Await allows for us to wait for this line to execute synchronously
    const [rows, fields] = await connection.query("SELECT * FROM users");

    // If no records, add some
    if (rows.length == 0) {
        let userRecords = "insert into users (firstName, lastName, city, email, password, type) values ?";
        let recordValues = [
            ["Test", "Test", "Vancouver", "test@test.ca", "password", "ADMIN"]
        ];
        await connection.query(userRecords, [recordValues]);
    }

    console.log("Listening on port " + port + "!");
}

// RUN SERVER
let port = 8000;
app.listen(port, init);