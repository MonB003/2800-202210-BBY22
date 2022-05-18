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
    window.location.replace("/mylistings");
};


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
    const postResponse = await fetch('/deletepost', postDetails);
    const jsonData = await postResponse.json();
    window.location.replace("/mylistings");
};



function getItemStatus() {
    // Get dropdown menu item selected
    let itemStatusDropdown = document.getElementById("itemStatus");
    var selectedValue = itemStatusDropdown.value;

    let reserveStatusDiv = document.getElementById("reserveStatusDiv");

    if (selectedValue == "reserved") {
        // Make div to input username visible
        reserveStatusDiv.style.visibility = "visible";

    } else {
        reserveStatusDiv.style.visibility = "hidden";
    }
}



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
    let usernameReturned = jsonDataCheck.username;

    // let test1 = usernameReturned.userName;
    // if (test1 == undefined) {
    //     document.getElementById("errorMessage").textContent = "Username does not exist.";
    //     return;
    // }
    // console.log("username returned: " + test1); 

    if (jsonDataCheck.status == "Fail") {
        // Username does not exist
        document.getElementById("errorMessage").textContent = jsonDataCheck.msg;

        document.getElementById("userReserved").value = "";
        return;
    }
    // console.log("Username exists")


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

    document.getElementById("errorMessage").textContent = jsonDataUpdate.msg;

    // if (jsonDataUpdate.status == "Fail") {
    //     // Display msg
    //     document.getElementById("errorMessage").textContent = jsonDataUpdate.msg;
    // } 

};


// CALL THIS WHEN SAVEPOST BUTTON CLICKED
async function changeItemStatus(postID, newStatus) {
    const dataSent = {
        postID,
        newStatus
    }

    const postDetails = {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(dataSent)
    }

    // Get response from server side post request to update status
    const postResponse = await fetch('/update-post-status', postDetails);
    const jsonData = await postResponse.json();

    if (jsonData.status == "Success") {
        // let postStatusDiv = document.getElementById('postStatus' + postID);
        // postStatusDiv.innerHTML = newStatus;
    }
}



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