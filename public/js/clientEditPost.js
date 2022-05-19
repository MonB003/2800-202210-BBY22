"use strict";

//Returns user to listing page
document.querySelector("#cancel").addEventListener("click", function (e) {
    window.location.replace("/mylistings");
});


// Get default status of the item to set default dropdown option
async function getDefaultStatus() {
    const postDetails = {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        }
    }

    // Get response from server side post request
    const postResponse = await fetch('/get-current-item-status', postDetails);
    const jsonData = await postResponse.json();
    let currentStatus = jsonData.itemStatus;

    // Select the dropdown option of the current status
    let statusOption = document.getElementById(currentStatus);
    statusOption.setAttribute("selected", "selected");

    // If status is reserved, display div with username text field
    if (currentStatus == "reserved") {
        // Make div to input username visible
        document.getElementById("reserveStatusDiv").style.visibility = "visible";

        let currentUserReserved = jsonData.userReserved;
        document.getElementById("userReserved").value = currentUserReserved;
        
    } else if (currentStatus == "available") {
        // If status is available, disable collected option until a user is reserved
        document.getElementById("collected").disabled = true;
    }
}
getDefaultStatus();

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

    } else {
        // If there's input, enable the button
        reserveUserBtn.disabled = false;
    }
});