// Updates a user's data in the database
async function updateAUsersData(userID) {
    let firstName = document.getElementById('userFirstName'+userID).value;
    let lastName = document.getElementById('userLastName'+userID).value;
    let city = document.getElementById('userCity'+userID).value;
    let email = document.getElementById('userEmail'+userID).value;
    let password = document.getElementById('userPassword'+userID).value;
    let type = document.getElementById('userType'+userID).value;

    // Store user's data that was filled into the text fields on the page
    const dataSent = {
        firstName,
        lastName,
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
    console.log(jsonData);
    console.log(jsonData.msg);
    document.getElementById('message').innerHTML = jsonData.msg;
};


// Deletes a user from the database
async function deleteAUser(userID) {
    let firstName = document.getElementById('userFirstName'+userID).value;
    let lastName = document.getElementById('userLastName'+userID).value;
    let city = document.getElementById('userCity'+userID).value;
    let email = document.getElementById('userEmail'+userID).value;
    let password = document.getElementById('userPassword'+userID).value;
    let type = document.getElementById('userType'+userID).value;

    const dataSent = {
        firstName,
        lastName,
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
    console.log(jsonData);
    console.log(jsonData.msg);
    document.getElementById('message').innerHTML = jsonData.msg;

    // Remove that user's text fields from the page
    document.getElementById('userFirstName'+userID).remove();
    document.getElementById('userLastName'+userID).remove();
    document.getElementById('userCity'+userID).remove();
    document.getElementById('userEmail'+userID).remove();
    document.getElementById('userPassword'+userID).remove();
    document.getElementById('userType'+userID).remove();
    document.getElementById("editButton"+userID).remove();
    document.getElementById("deleteButton"+userID).remove();
};