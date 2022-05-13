"use strict";

// Updates a user's data in the database
async function editpost(postID) {


    // Sends data to the server and saves it to a session
    const dataSent = {
        postID
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
    const postResponse = await fetch('/toeditpost', postDetails);
    const jsonData = await postResponse.json();
    if (jsonData.status == "Success") {
        window.location.replace("/editpost");
    }
};