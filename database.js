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
        let doc = fs.readFileSync("./app/login.html", "utf8");

        res.set("Server", "MACT Engine");
        res.set("X-Powered-By", "MACT");
        res.send(doc);
    }
});


app.get("/main", function (req, res) {

    if (req.session.loggedIn) {
        let main = fs.readFileSync("./app/main.html", "utf8");
        let mainDOM = new JSDOM(main);

        // Get the user's data and put it into the page
        mainDOM.window.document.getElementById("customerName").innerHTML = "Welcome, " + req.session.firstName +
            " " + req.session.lastName + "!";

        res.set("Server", "MACT Engine");
        res.set("X-Powered-By", "MACT");
        res.send(mainDOM.serialize());

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

    let results = authenticate(req.body.email, req.body.password,
        function (userRecord) {
            //console.log(rows);
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

app.post("/signup", function (req, res) {
    res.setHeader("Content-Type", "application/json");

    console.log("POST: What was sent", req.body.firstName, req.body.lastName, req.body.city, req.body.email, req.body.password);

    let results = authenticate(req.body.email, req.body.password,
        function (userRecord) {

            // When authenticate() returns null because user isn't currently in database
            if (userRecord == null) {
                console.log("Returned null");

                req.session.loggedIn = true;
                req.session.email = req.body.email;
                req.session.password = req.body.password;
                req.session.firstName = req.body.firstName;
                req.session.lastName = req.body.lastName;
                req.session.city = req.body.city;

                let newUser = {
                    firstName: req.body.firstName,
                    lastName: req.body.lastName,
                    city: req.body.city,
                    email: req.body.email,
                    password: req.body.password
                };

                // ? is placeholder for data being inserted
                let sql = `INSERT INTO users SET ?`

                const mysql = require("mysql2");
                const connection = mysql.createConnection({
                    host: "localhost",
                    user: "root",
                    password: "",
                    database: "OnTheHouseDB"
                });
                connection.connect();
                connection.query(sql, newUser, (err, result) => {
                    if (err) throw err;
                    console.log(result);
                    console.log("User added");
                });

                req.session.save(function (err) {
                    // Session saved
                });

                // Send message saying user's login was successful
                res.send({
                    status: "success",
                    msg: "Logged in."
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


// Validates user's email and password
function authenticate(email, pwd, callback) {

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
            // results is an array of records, in JSON format
            // fields contains extra meta data about results
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


/*
 * Function that connects to the DBMS and checks if the DB exists, if not
 * creates it, then populates it with a couple of records
 */
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
        id int NOT NULL AUTO_INCREMENT, 
        firstName VARCHAR(20), 
        lastName VARCHAR(20), 
        city VARCHAR(30), 
        email VARCHAR(30), 
        password VARCHAR(30), 
        PRIMARY KEY (id));`;
    await connection.query(createDBAndTables);

    // Await allows for us to wait for this line to execute synchronously
    const [rows, fields] = await connection.query("SELECT * FROM users");

    // If no records, add some
    if (rows.length == 0) {
        let userRecords = "insert into users (firstName, lastName, city, email, password) values ?";
        let recordValues = [
            ["Test", "Test", "Vancouver", "test@test.ca", "password"]
        ];
        await connection.query(userRecords, [recordValues]);
    }

    console.log("Listening on port " + port + "!");
}

// RUN SERVER
let port = 8000;
app.listen(port, init);