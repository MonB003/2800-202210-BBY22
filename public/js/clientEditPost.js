"use strict";

// When profile button is clicked, redirect to profile page
document.querySelector("#profile").addEventListener("click", function (e) {
    window.location.replace("/profile");
});

// Redirects to main page
document.querySelector("#home").addEventListener("click", function (e) {
    window.location.replace("/main");
});

document.querySelector("#messages").addEventListener("click", function (e) {
    window.location.replace("/message");
});

// When my listings button is clicked, redirect to myListings page
document.querySelector("#listings").addEventListener("click", function (e) {
    window.location.replace("/mylistings");
});

//Returns user to listing page
document.querySelector("#cancel").addEventListener("click", function (e) {
    window.location.replace("/mylistings");
});


//upload image
const upLoadForm = document.getElementById("image-form");
upLoadForm.addEventListener("submit", uploadImages);

function uploadImages(e) {
    e.preventDefault();
    let description = document.querySelector("#description").value;
    const imageUpload = document.querySelector('#image-upload');
    const formData = new FormData();

    for (let i = 0; i < imageUpload.files.length; i++) {
        // put the images from the input into the form data
        formData.append("files", imageUpload.files[i]);
    }

    const options = {
        method: 'POST',
        body: formData,
    };
    const dataSent = {
        description
    }
    const postDetails = {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(dataSent)
    }
    fetch("/upload-images3", options, postDetails
    ).then(function (res) {
        console.log(res);
        window.location.replace("/editpost")
    }).catch(function (err) { ("Error:", err) }
    );
    document.getElementById("savedMsg").innerHTML = "Photo Saved";
}


// saves post information into database
async function save_post(postID) {
    let title = document.querySelector("#title").value;
    let city = document.querySelector("#city").value;
    let description = document.querySelector("#description").value;
    let status = document.querySelector("#itemStatus").value;

    if (status == "available") {
        // If there's a user reserved and item status changes to available, set user reserved back to null
        removePotentialUserReserved(postID);
    }

    const dataSent = {
        title,
        city,
        description,
        status,
        postID
    }

    const postDetails = {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(dataSent)
    }

    await fetch('/savepostinfo', postDetails);
    window.location.replace("/mylistings");
};


// Sets user_reserved variable back to null if item status becomes available again
async function removePotentialUserReserved(postID) {
    let userReserved = null;

    const dataSentUpdate = {
        userReserved,
        postID
    }

    const postDetailsUpdate = {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(dataSentUpdate)
    }

    // Get response from server side post request
    await fetch('/reserve-user-for-item', postDetailsUpdate);
}


// Deletes a post from the database
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

    // Get response from server side post request called delete-post
    await fetch('/deletepost', postDetails);
    window.location.replace("/mylistings");
};


// Gets the currently selected item status in the dropdown
function getItemStatus() {
    // Get dropdown menu item selected
    let itemStatusDropdown = document.getElementById("itemStatus");
    var statusSelected = itemStatusDropdown.value;
    
    let reserveStatusDiv = document.getElementById("reserveStatusDiv");
    let savepostBtn = document.getElementById("savepost");

    if (statusSelected == "reserved") {
        // Make div to input username visible
        reserveStatusDiv.style.visibility = "visible";

        // Disable save button until user is reserved
        savepostBtn.disabled = true;

    } else {
        // Hide reserve elements
        reserveStatusDiv.style.visibility = "hidden";
        savepostBtn.disabled = false;
    }
}


// Reserves a user's username for an item in the database
async function reserveUserForItem(postID) {
    let userReserved = document.getElementById("userReserved").value;

    const dataSentCheck = {
        userReserved
    }

    const postDetailsCheck = {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(dataSentCheck)
    }

    // Get response from server side post request
    const postResponseCheck = await fetch('/check-username-exists', postDetailsCheck);
    const jsonDataCheck = await postResponseCheck.json();

    if (jsonDataCheck.status == "Fail") {
        // Username is not valid
        document.getElementById("reserveMsg").textContent = jsonDataCheck.msg;

        // Clear text field
        document.getElementById("userReserved").value = "";

        // Disable save button
        document.getElementById("savepost").disabled = true;
        return;
    }


    // If username exists, update user_reserved in database
    const dataSentUpdate = {
        userReserved,
        postID
    }

    const postDetailsUpdate = {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(dataSentUpdate)
    }

    // Get response from server side post request
    const postResponseUpdate = await fetch('/reserve-user-for-item', postDetailsUpdate);
    const jsonDataUpdate = await postResponseUpdate.json();

    // Display message feedback for user
    document.getElementById("reserveMsg").textContent = jsonDataUpdate.msg;

    // Enable save button
    document.getElementById("savepost").disabled = false;
};


// Method to disable reserve button if there's no input
document.getElementById("userReserved").addEventListener("input", function (e) {
    // Get the current value in the text field
    let userReservedValue = document.getElementById("userReserved").value;
    let reserveUserBtn = document.getElementById("reserveUserBtn");

    // If there's no input in the text field, disable the reserve button
    if (userReservedValue.trim() == "") {
        reserveUserBtn.disabled = true;

    } else {
        // If there's input, enable the button
        reserveUserBtn.disabled = false;
    }
});