"use strict";

// When profile button is clicked, direct to profile page
document.querySelector("#profile").addEventListener("click", function (e) {
    window.location.replace("/profile");
});

// Redirects to main page
document.querySelector("#home").addEventListener("click", function (e) {
    window.location.replace("/main");
});

// When new post button is clicked, direct to newPost page
document.querySelector("#newPostPageBtn").addEventListener("click", function (e) {
    window.location.replace("/newPost");
});

// Saves the post ID to the session and redirects to the view post html if validated
async function viewPost(postID) {


    // Sends data in an array to the server and saves it to a session
    const dataSent = {
        postID
    }

    // Looks for only an app.post function
    // Sends the JSON data (postID) to the server
    const postDetails = {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(dataSent)
    }

    // Get response from server side post request called update-user-data
    const postResponse = await fetch('/toviewpost', postDetails);
    const jsonData = await postResponse.json();
    if (jsonData.status == "Success") {
        window.location.replace("/viewPost");
    }
};

// Calls appropriate method to update a post's status in the database and on the page. This is based on what the post's current status is
async function changePostStatus(postID) {
    let postStatusDiv = document.getElementById('postStatus' + postID);
    let currentPostStatus = postStatusDiv.textContent;

    // Status: available --> pending --> reserved --> collected

    if (currentPostStatus == "available") {
        changeAvailableStatus(postID);

    } else if (currentPostStatus == "pending") {
        changePendingStatus(postID);

    } else if (currentPostStatus == "reserved") {
        changeReservedStatus(postID);
    }
}


// Updates available status to pending
async function changeAvailableStatus(postID) {
    // Data passed to post request
    const dataSent = {
        postID
    }

    // Other details passed to post request
    const postDetails = {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(dataSent)
    }

    // Get response from server side post request
    const postResponse = await fetch('/get-post-and-session-ids', postDetails);
    const jsonData = await postResponse.json();

    let currentIDReturned = jsonData.currentUserID;
    let postIDReturned = jsonData.postUserID;
    let postUserID = postIDReturned.user_id;


    // If post user_id matches current session user id, they are the same user. A user cannot request their own post
    if (currentIDReturned == postUserID) {
        return;
    } 

    let postStatusDiv = document.getElementById('postStatus' + postID);
    let newStatus = "pending";

    const pendingDataSent = {
        postID,
        newStatus
    }

    const postPendingDetails = {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(pendingDataSent)
    }

    // Get response from server side post request to update status to pending
    const pendingPostResponse = await fetch('/update-post-status', postPendingDetails);
    const jsonPendingData = await pendingPostResponse.json();

    // Saves the current user as the reserved user for that post in the database
    const saveUserPostRequest = await fetch('/save-user-pending-status', postDetails);
    const jsonSaveUser = await saveUserPostRequest.json();

    // If both post requests are a success, the status button on the post can be updated
    if (jsonPendingData.status == "Success" && jsonSaveUser.status == "Success") {
        postStatusDiv.innerHTML = newStatus;
    }
}


// Updates pending status to reserved
async function changePendingStatus(postID) {
    const dataSent = {
        postID
    }

    const postDetails = {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(dataSent)
    }

    // Get response from server side post request
    const postResponse = await fetch('/get-post-and-session-ids', postDetails);
    const jsonData = await postResponse.json();

    let currentIDReturned = jsonData.currentUserID;
    let postIDReturned = jsonData.postUserID;
    let postUserID = postIDReturned.user_id;


    // If post user_id matches current session user id, they are allowed to reserve their item
    if (currentIDReturned == postUserID) {
        let newStatus = "reserved";

        const reserveDataSent = {
            postID,
            newStatus
        }

        const postReserveDetails = {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(reserveDataSent)
        }

        // Get response from server side post request to update status to reserved
        const postResponseFromReserved = await fetch('/update-post-status', postReserveDetails);
        const jsonDataReserved = await postResponseFromReserved.json();

        if (jsonDataReserved.status == "Success") {
            let postStatusDiv = document.getElementById('postStatus' + postID);
            postStatusDiv.innerHTML = newStatus;
        }

    }
}


// Updates reserved status to collected
async function changeReservedStatus(postID) {
    const dataSent = {
        postID
    }

    const postDetails = {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(dataSent)
    }

    // Get response from server side post request
    const postResponse = await fetch('/get-post-and-session-ids', postDetails);
    const jsonData = await postResponse.json();

    let currentIDReturned = jsonData.currentUserID;
    let postIDReturned = jsonData.postUserID;
    let postUserID = postIDReturned.user_id;


    // If the post user_id matches current session user id, they are allowed to update the status to collected
    if (currentIDReturned == postUserID) {
        let newStatus = "collected";

        const collectedDataSent = {
            postID,
            newStatus
        }

        const collectedPostDetails = {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(collectedDataSent)
        }

        // Get response from server side post request to update status to collected
        const postCollectedResponse = await fetch('/update-post-status', collectedPostDetails);
        const jsonCollectedData = await postCollectedResponse.json();

        // If both post requests are a success, that HTML post element can be removed from the page
        if (jsonCollectedData.status == "Success") {
            let postStatusDiv = document.getElementById('post' + postID);
            postStatusDiv.remove();
        }
    }
}
