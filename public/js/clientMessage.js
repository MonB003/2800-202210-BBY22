"use strict";

/* 
 * Creates basic messaging feature between 2 users.
 * This is the source that was referenced and modified: https://www.youtube.com/watch?v=Ozrm_xftcjQ
 */

let socket = io.connect('/');

var userReceiving = "";
var userSending = "";


// Saves a user's email as the userSending when they connect to the message page
function saveConnectedUserInfo() {
    // Get user's email
    var currentEmail = document.getElementById("thisUsersEmail").textContent;

    // Send it to the server
    socket.emit("a-user-connects", currentEmail);

    // Save the email into a global variable
    userSending = currentEmail;

    // Prevent form from submitting
    return false;
}
saveConnectedUserInfo();


// When a user connects to the message page
socket.on("a-user-connects", function (userEmail) {
    let onlineUser = document.createElement("p");
    onlineUser.textContent = "Online: " + userEmail;
    document.getElementById("users").appendChild(onlineUser);
});


// Gets past messages between this user and the user selected, then displays them on the page
async function getSelectedUser(userEmail) {
    userReceiving = userEmail;
    userSending = document.getElementById("thisUsersEmail").textContent;

    document.getElementById("allMessages").innerHTML = "";

    const dataSent = {
        userSending,
        userReceiving
    }
    const postDetails = {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(dataSent)
    }
    const postResponse = await fetch('/all-messages-between-two-users', postDetails);
    const jsonData = await postResponse.json();
    let dbMessageObjs = jsonData.dbResult;

    // Gets each of the past messages saved in the database and styles them based on 
    // if the message was from this user or the other
    for (var index = 0; index < dbMessageObjs.length; index++) {
        var currObj = dbMessageObjs[index];

        // Create HTML p tag element to store the current message
        let currMessage = document.createElement("p");
        let thisUser = document.getElementById("thisUsersEmail").textContent;

        if (currObj.userSending == thisUser) {
            // Message is from you
            currMessage.textContent = "You: " + currObj.message;
            currMessage.style.backgroundColor = "rgb(130, 255, 173)";
            currMessage.style.textAlign = "right";

        } else {
            // Message is from other user
            currMessage.textContent = currObj.userSending + ": " + currObj.message;
            currMessage.setAttribute("style", "background-color: rgb(226, 226, 226);");
        }

        document.getElementById("allMessages").appendChild(currMessage);
    }

    let todayPar = document.createElement("h3");
    todayPar.setAttribute("style", "font-style: italic;");
    todayPar.textContent = "TODAY";

    document.getElementById("allMessages").appendChild(todayPar);

    // Automatically scroll down
    var messages = document.getElementById("allMessages");
    messages.scrollTop = messages.scrollHeight;
}


// Sends a private message to other user
function sendMessageToUser() {
    // Get the message value of the text field
    var messageInput = document.getElementById("messageInput").value;

    // Send message to server
    socket.emit("send-message-to-other-user", {
        userSending: userSending,
        userReceiving: userReceiving,
        message: messageInput
    });

    // Create HTML element for new message
    let newMessage = document.createElement("p");
    newMessage.textContent = "You: " + messageInput;
    newMessage.style.backgroundColor = "rgb(130, 255, 173)";
    newMessage.style.textAlign = "right";

    document.getElementById("allMessages").appendChild(newMessage);

    // Clear text field
    document.getElementById("messageInput").value = "";

    // Disable send button until user enters input
    document.getElementById("sendMessageBtn").disabled = true;

    // Automatically scroll down
    var allMessages = document.getElementById("allMessages");
    allMessages.scrollTop = allMessages.scrollHeight;

    // Prevent form from submitting
    return false;
}


// Listens from the server when the other user sends a message to this user
socket.on("new-message-from-other-user", function (data) {
    // Create HTML element to display the other user's messsage
    let newMessage = document.createElement("p");
    newMessage.textContent = data.userSending + ": " + data.message;
    newMessage.style.backgroundColor = "rgb(226, 226, 226)";

    document.getElementById("allMessages").appendChild(newMessage);

    // Automatically scroll down
    var allMessages = document.getElementById("allMessages");
    allMessages.scrollTop = allMessages.scrollHeight;
});


// Function to get each user with a post's button
async function getAllUserPostIDs(thisUsersID) {
    const dataSent = {
        thisUsersID
    }

    const postDetails = {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(dataSent)
    }

    // Get response from server side post request called add-new-user
    const postResponse = await fetch('/all-user-post-ids', postDetails);
    const jsonData = await postResponse.json();

    let allUserIDs = jsonData.idResult;

    let usersIDsArray = new Array();
    for (var index = 0; index < allUserIDs.length; index++) {
        var currObj = allUserIDs[index];

        // Add ID to array
        usersIDsArray.push(currObj.user_id);
    }

    // Creates buttons for each user based on the IDs returned from the database
    for (let currUserId = 0; currUserId < usersIDsArray.length; currUserId++) {
        const currentID = usersIDsArray[currUserId];

        const dataSent = {
            currentID
        }

        const postDetails = {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(dataSent)
        }

        // Get response from server side post request called add-new-user
        const postResponse = await fetch('/get-unique-user-email', postDetails);
        const jsonData = await postResponse.json();
        let jsonUserResult = jsonData.currentUserEmail;

        // Create button for each of those users
        let newBtn = document.createElement("button");
        newBtn.setAttribute("id", "user" + currentID);
        newBtn.setAttribute("class", "email-message-btns");
        newBtn.innerHTML = jsonUserResult.email;
        newBtn.setAttribute("onclick", "getSelectedUser(this.innerHTML);");
        document.getElementById("usersBtnsDiv").appendChild(newBtn);

        let newLine = document.createElement("br");
        document.getElementById("usersBtnsDiv").appendChild(newLine);
    }

    // Disable button to view all users otherwise it will add all the users when clicked again
    document.getElementById("getAllIdsBtn").disabled = true;

    // Enable message text field
    document.getElementById("messageInput").disabled = false;
}


// Redirects to main page
document.querySelector("#backToMain").addEventListener("click", function (e) {
    window.location.replace("/main");
});


// Method to disable send button if there's no input
document.getElementById("messageInput").addEventListener("input", function (e) {
    // Get the current value in the text field
    let messageInputValue = document.getElementById("messageInput").value;
    let sendMessageBtn = document.getElementById("sendMessageBtn");

    // If there's no input in the text field, disable the send button
    if (messageInputValue == "") {
        sendMessageBtn.disabled = true;
    } else {
        // If there's input, enable the button
        sendMessageBtn.disabled = false;
    }
});
