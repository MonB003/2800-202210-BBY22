"use strict";

// Redirects to main page
document.querySelector("#home").addEventListener("click", function (e) {
    window.location.replace("/main");
});
document.querySelector("#home2").addEventListener("click", function (e) {
    window.location.replace("/main");
});

//redirects to bookmarks page
document.querySelector("#bookmark").addEventListener("click", function (e) {
    window.location.replace("/myBookmarks");
});
document.querySelector("#bookmark2").addEventListener("click", function (e) {
    window.location.replace("/myBookmarks");
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

//Returns user to listing page
document.querySelector("#cancel").addEventListener("click", function (e) {
    window.location.replace("/mylistings");
});

// Tiny editor for textarea
tinymce.init({
    selector: '#description',
    placeholder: "Description"
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
    };
    const postDetails = {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(dataSent)
    };
    fetch("/upload-images3", options, postDetails).then(function (res) {
        window.location.replace("/editpost");
    }).catch(function (err) {
        ("Error:", err);
    });
    document.getElementById("savedMsg").innerHTML = "Photo Saved";
}


// Get default status of the item to set default dropdown option
async function getDefaultStatus() {
    const postDetails = {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        }
    };

    // Get response from server side post request
    const postResponse = await fetch('/get-current-item-status', postDetails);
    const jsonData = await postResponse.json();
    let currentStatus = jsonData.itemStatus;

    // Select the dropdown option of the current status
    let statusOption = document.getElementById(currentStatus);
    statusOption.setAttribute("selected", "selected");

    // If status is reserved, display div with username text field
    if (currentStatus == "reserved") {
        let currentUserReserved = jsonData.userReserved;
        displayReservedDetails(currentUserReserved);

    } else if (currentStatus == "available") {
        // If status is available, disable collected option until a user is reserved
        document.getElementById("collected").disabled = true;
    }
}
getDefaultStatus();


// Displays reserve details div and fills in the text field with the current user reserved
async function displayReservedDetails(otherUserID) {
    // Make div to input username visible
    document.getElementById("reserveStatusDiv").style.visibility = "visible";

    const dataSent = {
        otherUserID
    };

    const postDetails = {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(dataSent)
    };

    // Get response from server side post request for the user's username
    const postResponse = await fetch('/get-owner-username-with-id', postDetails);
    const jsonData = await postResponse.json();
    let returnedUsername = jsonData.otherUsername;
    let username = returnedUsername.userName;   // Gets the username of the user reserved

    document.getElementById("userReserved").value = username;
}


// saves post information into database
async function save_post(postID) {
    let title = document.querySelector("#title").value;
    let city = document.querySelector("#city").value;
    let description = tinymce.get("description").getContent(); // Gets the text value in the tiny editor
    let status = document.querySelector("#itemStatus").value;

    let descriptionValue = tinymce.get("description").getContent({
        format: 'text'
    });
    let descriptionContainer = document.querySelector(".tox-editor-container"); // Gets the tiny editor HTML element

    // Get all user's input values and input field elements
    let inputsArray = [title, city, descriptionValue];
    let inputFields = [document.getElementById("title"), document.getElementById("city"), descriptionContainer];
    let checkEmptyInput = false;

    // Check for empty input fields 
    for (let i = 0; i < inputsArray.length; i++) {
        let currentInput = inputsArray[i];

        // If a value is empty, set boolean to false
        if (currentInput.trim() == "" || currentInput.trim() == null) {
            checkEmptyInput = true;
            inputFields[i].style.border = "1px solid red";
        } else {
            inputFields[i].style.border = "none";
        }
    }

    // If one or more fields are empty
    if (checkEmptyInput) {
        document.getElementById('savedDetail').textContent = "All fields must be filled out.";

    } else {

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
        };

        const postDetails = {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(dataSent)
        };

        await fetch('/savepostinfo', postDetails);
        window.location.replace("/mylistings");
    }
};


// Sets user_reserved variable back to null if item status becomes available again
async function removePotentialUserReserved(postID) {
    let userReserved = null;

    const dataSentUpdate = {
        userReserved,
        postID
    };

    const postDetailsUpdate = {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(dataSentUpdate)
    };

    // Get response from server side post request
    await fetch('/reserve-user-for-item', postDetailsUpdate);
}


// Deletes a post from the database
async function delete_post(postID) {

    const dataSent = {
        postID
    };

    const postDetails = {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(dataSent)
    };

    // Get response from server side post request called delete-post
    await fetch('/deletepost', postDetails);
    window.location.replace("/mylistings");
};


// Gets the currently selected item status in the dropdown every time a status is selected
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
        savepostBtn.style.cursor = "not-allowed";

    } else {
        // Hide reserve elements
        reserveStatusDiv.style.visibility = "hidden";
        savepostBtn.disabled = false;
        savepostBtn.style.cursor = "pointer";
    }
}


// Reserves a user's username for an item in the database
async function reserveUserForItem(postID) {
    let userReserved = document.getElementById("userReserved").value;

    const dataSentCheck = {
        userReserved
    };

    const postDetailsCheck = {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(dataSentCheck)
    };

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
        document.getElementById("savepost").style.cursor = "not-allowed";
        return;
    }

    // Get the user returned and their ID, which will be stored in the database
    let userReturned = jsonDataCheck.username;
    userReserved = userReturned.id;

    // If username exists, update user_reserved in database
    const dataSentUpdate = {
        userReserved,
        postID
    };

    const postDetailsUpdate = {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(dataSentUpdate)
    };

    // Get response from server side post request
    const postResponseUpdate = await fetch('/reserve-user-for-item', postDetailsUpdate);
    const jsonDataUpdate = await postResponseUpdate.json();

    // Display message feedback for user
    document.getElementById("reserveMsg").textContent = jsonDataUpdate.msg;

    // Enable save button
    document.getElementById("savepost").disabled = false;
    document.getElementById("savepost").style.cursor = "pointer";

    document.getElementById("reserveUserBtn").disabled = true;
    document.getElementById("reserveUserBtn").style.cursor = "not-allowed";

    // Enable collected option from dropdown
    document.getElementById("collected").disabled = false;
};


// Method to disable reserve button if there's no input
document.getElementById("userReserved").addEventListener("input", function (e) {
    // Get the current value in the text field
    let userReservedValue = document.getElementById("userReserved").value;
    let reserveUserBtn = document.getElementById("reserveUserBtn");

    // If there's no input in the text field, disable the reserve button
    if (userReservedValue.trim() == "") {
        reserveUserBtn.disabled = true;
        document.getElementById("savepost").disabled = true;
        document.getElementById("savepost").style.cursor = "not-allowed";

    } else {
        // If there's input, enable the button
        reserveUserBtn.disabled = false;
        reserveUserBtn.style.cursor = "pointer";
    }
});



// When the cancel button is clicked in confirm delete post popup
function cancelConfirmDelete() {
    let confirmDeleteDiv = document.getElementById('confirmDeletion');
    confirmDeleteDiv.style.display = "none";
}

// Makes the confirm delete post popup div visible
function showConfirmDeletePopup() {
    let confirmDeleteDiv = document.getElementById('confirmDeletion');
    confirmDeleteDiv.style.display = "block";
}