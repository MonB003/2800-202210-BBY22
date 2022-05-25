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

// Updates a user's data in the database
async function getPostOwner() {

    // Additional details needed when sending data to server side
    const postDetails = {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        }
    };

    // Get response from server side post request
    const postResponse = await fetch('/getPostOwner', postDetails);
    const jsonData = await postResponse.json();

    document.querySelector("#post-owner").innerHTML = jsonData.name;
    document.querySelector("#post-owner").addEventListener("click", function (e) {
        window.location.replace(`/profile/${jsonData.name}`);
    });
    
};

getPostOwner();


// Redirects to private message page if both users are different
function getMessagePage(postID) {
    // Store this post ID for message JS file
    localStorage.setItem("currentPostID", postID);

    // Check for same user
    checkPostOwnerAndSessionUser(postID);
}


// Checks if post owner and current session user are the same
// If they are the same, the user cannot message themself
async function checkPostOwnerAndSessionUser(postID) {
    const idDataSent = {
        postID
    };
    const idPostDetails = {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(idDataSent)
    };

    // Get post owner's ID
    const postResponseID = await fetch('/get-other-user-by-post', idPostDetails);
    const jsonDataID = await postResponseID.json();
    let returnedUserID = jsonDataID.otherUserID;
    let postOwnerID = returnedUserID.user_id; // Post owner userID
    let returnedSessionID = jsonDataID.sessionUserID; // Current session userID

    // Compare post owner and session user IDs
    if (postOwnerID != returnedSessionID) {
        // If they are different, redirect to private message page
        window.location.replace("/postMessage");
    } else {
        document.getElementById("messagepost").style.cursor = "not-allowed";
    }
}