"use strict";

// Updates a user's data in the database
async function getPostOwner() {

    // Sends data to the server and saves it to a session
    const dataSent = {

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
    const postResponse = await fetch('/getPostOwner', postDetails);
    const jsonData = await postResponse.json();

    document.querySelector("#post-owner").innerHTML = jsonData.name;
    document.querySelector("#post-owner").addEventListener("click", function (e) {
        window.location.replace(`/profile/${jsonData.name}`);
    });
    
};

getPostOwner();