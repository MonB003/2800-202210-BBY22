"use strict";

//Returns user to listing page
document.querySelector("#cancel").addEventListener("click", function (e) {
    window.location.replace("/mylistings");
});

// saves post information into database
async function save_post(postID) {
    let title = document.querySelector("#title").value;
    let city = document.querySelector("#city").value;
    let description = document.querySelector("#description").value;

    const dataSent = {
        title,
        city,
        description,
        postID
    }

    const postDetails = {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(dataSent)
    }

    const postResponse = await fetch('/savepostinfo', postDetails);
    const jsonData = await postResponse.json();
    // document.getElementById('message').innerHTML = jsonData.msg;
    window.location.replace("/mylistings");
};


// Deletes a user from the database
async function delete_post(postID) {

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

    // Get response from server side post request called delete-user
    const postResponse = await fetch('/deletepost', postDetails);
    const jsonData = await postResponse.json();
    // document.getElementById('message').innerHTML = jsonData.msg;
    window.location.replace("/mylistings");
};