"use strict";

// Redirects to main page
document.querySelector("#home").addEventListener("click", function (e) {
    window.location.replace("/main");
});
document.querySelector("#home2").addEventListener("click", function (e) {
    window.location.replace("/main");
});

//redirects to message page
document.querySelector("#messages").addEventListener("click", function (e) {
    window.location.replace("/message");
});
document.querySelector("#messages2").addEventListener("click", function (e) {
    window.location.replace("/message");
});

// When my listings button is clicked, redirect to myListings page
document.querySelector("#listings").addEventListener("click", function (e) {
    window.location.replace("/mylistings");
});
document.querySelector("#listings2").addEventListener("click", function (e) {
    window.location.replace("/mylistings");
});

// When profile button is clicked, redirect to profile page
document.querySelector("#profile").addEventListener("click", function (e) {
    window.location.replace("/profile");
});
document.querySelector("#profile2").addEventListener("click", function (e) {
    window.location.replace("/profile");
});


// Redirects to private message page if post owner and session user are different
async function getMessagePage(userName) {
    const userDataSent = {
        userName
    }
    const userPostDetails = {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(userDataSent)
    }

    // Get profile user and session user's IDs
    const postResponseID = await fetch('/get-user-id-from-username', userPostDetails);
    const jsonDataID = await postResponseID.json();
    let returnedUserID = jsonDataID.otherUserID;
    let profileUserID = returnedUserID.id;   // User ID
    let sessionUserID = jsonDataID.sessionUserID;   // Session ID

    // Compare profile user and session user IDs
    if (profileUserID != sessionUserID) {
        // If they are different, redirect to private message page
        window.location.replace("/postMessage");
    }
}