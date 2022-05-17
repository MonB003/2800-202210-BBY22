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
    // alert(jsonData.item_pic);
    // let postpic = "<img src=\"imgs/userPic-" + jsonData.item_pic + "\" alt=\"profile-pic\" id=\"picID\">"
    // document.querySelector("#postimage").innerHTML = postpic;

};

getPostOwner();