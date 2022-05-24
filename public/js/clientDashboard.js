"use strict";

// Updates a user's data in the database
async function updateAUsersData(userID) {
    let firstName = document.getElementById('userFirstName' + userID).value;
    let lastName = document.getElementById('userLastName' + userID).value;
    let userName = document.getElementById('userName' + userID).value;
    let city = document.getElementById('userCity' + userID).value;
    let email = document.getElementById('userEmail' + userID).value;
    let password = document.getElementById('userPassword' + userID).value;
    let type = document.getElementById('userType' + userID).value;


    // Get all user's input values for their type
    var formInputFields = document.querySelectorAll('.user-type-input');
    var adminCount = 0;

    // Check for input fields of type admin
    for (let i = 0; i < formInputFields.length; i++) {
        var currentInput = formInputFields[i];

        // If a value is admin, increment count
        if (currentInput.value == "ADMIN") {
            adminCount++;
        }
    }

    // If there's only 1 admin, and that user is the admin, their type cannot be edited
    if (adminCount < 1) {
        document.getElementById('userType' + userID).value = "ADMIN"; // Keep type as admin
        type = "ADMIN";
    }


    // Get all user's input values and input field elements
    let inputsArray = [firstName, lastName, userName, city, email, password, type];
    let inputFields = [document.getElementById('userFirstName' + userID), document.getElementById('userLastName' + userID),
        document.getElementById('userName' + userID), document.getElementById('userCity' + userID), document.getElementById('userEmail' + userID),
        document.getElementById('userPassword' + userID), document.getElementById('userType' + userID)
    ];
    let checkEmptyInput = false;

    // Check for empty input fields 
    for (let i = 0; i < inputsArray.length; i++) {
        let currInput = inputsArray[i];

        // If a value is empty, set boolean to false
        if (currInput.trim() == "" || currInput.trim() == null) {
            checkEmptyInput = true;
            inputFields[i].style.border = "1px solid red";
        } else {
            inputFields[i].style.border = "none";
        }
    }

    // If one or more fields are empty
    if (checkEmptyInput) {
        document.getElementById('message').textContent = "All fields must be filled out.";
        return;
    }


    // Store user's data that was filled into the text fields on the page
    const dataSent = {
        firstName,
        lastName,
        userName,
        city,
        email,
        password,
        type,
        userID
    }

    // Additional details needed when sending data to server side
    const postDetails = {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(dataSent)
    }

    // Get response from server side post request called update-user-data
    const postResponse = await fetch('/update-user-data', postDetails);
    const jsonData = await postResponse.json();

    if (adminCount < 1) {
        document.getElementById('message').innerHTML = "Admin type cannot be edited. There is only 1 admin. The rest of the data was updated";
    } else {
        document.getElementById('message').innerHTML = jsonData.msg;
    }

};


// Deletes a user from the database
async function deleteAUser(userID) {
    let firstName = document.getElementById('userFirstName' + userID).value;
    let lastName = document.getElementById('userLastName' + userID).value;
    let userName = document.getElementById('userName' + userID).value;
    let city = document.getElementById('userCity' + userID).value;
    let email = document.getElementById('userEmail' + userID).value;
    let password = document.getElementById('userPassword' + userID).value;
    let type = document.getElementById('userType' + userID).value;

    // Get all user's input values for their type
    var formInputFields = document.querySelectorAll('.user-type-input');
    var adminCount = 0;

    // Check for input fields of type admin
    for (let i = 0; i < formInputFields.length; i++) {
        var currentInput = formInputFields[i];

        // If a value is admin, increment count
        if (currentInput.value == "ADMIN") {
            adminCount++;
        }
    }

    // If there's only 1 admin, and they are the admin, they cannot be deleted
    if (adminCount < 2 && type == "ADMIN") {
        document.getElementById('message').innerHTML = "Admin user cannot be deleted.";

    } else {

        const dataSent = {
            firstName,
            lastName,
            userName,
            city,
            email,
            password,
            type,
            userID
        }

        const postDetails = {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(dataSent)
        }

        // Get response from server side post request called delete-user
        const postResponse = await fetch('/delete-user', postDetails);
        const jsonData = await postResponse.json();
        document.getElementById('message').innerHTML = jsonData.msg;

        // Remove that user's text fields from the page
        document.getElementById('userFirstName' + userID).remove();
        document.getElementById('userLastName' + userID).remove();
        document.getElementById('userName' + userID).remove();
        document.getElementById('userCity' + userID).remove();
        document.getElementById('userEmail' + userID).remove();
        document.getElementById('userPassword' + userID).remove();
        document.getElementById('userType' + userID).remove();
        document.getElementById("editButton" + userID).remove();
        document.getElementById("deleteButton" + userID).remove();
    }
};


// Adds a new user to the database
async function addAUser() {
    let firstName = document.getElementById('newUserFirstName').value;
    let lastName = document.getElementById('newUserLastName').value;
    let userName = document.getElementById('newUserName').value;
    let city = document.getElementById('newUserCity').value;
    let email = document.getElementById('newUserEmail').value;
    let password = document.getElementById('newUserPassword').value;
    let type = document.getElementById('newUserType').value;

    // Get all the text fields in the add user form to check the values entered
    var userDiv = document.getElementById('userDiv');
    var formInputFields = userDiv.querySelectorAll('input');
    var checkEmptyInput = false;

    // Check for input fields with empty values
    for (let i = 0; i < formInputFields.length; i++) {
        var currentInput = formInputFields[i];

        // If a value is empty
        if (currentInput.value == "") {
            checkEmptyInput = true;
            currentInput.style.border = "1px solid red";
        } else {
            currentInput.style.border = "none";
        }
    }

    // If at least one of the inputs is empty
    if (checkEmptyInput) {
        document.getElementById('message').innerHTML = "Please fill out all fields.";

    } else {

        // If all data entered is valid
        const dataSent = {
            firstName,
            lastName,
            userName,
            city,
            email,
            password,
            type
        }

        const postDetails = {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(dataSent)
        }

        // Get response from server side post request called add-new-user
        const postResponse = await fetch('/add-new-user', postDetails);
        const jsonData = await postResponse.json();
        document.getElementById('message').innerHTML = jsonData.msg;

        if (jsonData.status == "Success") {
            // Reload page to show updated dashboard with added user
            window.location.reload();
        }

    }
};