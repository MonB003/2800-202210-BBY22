"use strict";

/* 
 * Creates basic messaging feature between 2 users.
 * This is the source that was referenced and modified: https://www.youtube.com/watch?v=Ozrm_xftcjQ
 */

let socket = io.connect('/');

// Stores the users sending and receiving the messages
var userReceiving = "";
var userSending = "";


// Saves a user's ID as the userSending when they connect to the message page
function saveConnectedUserInfo() {
    // Get stored post ID from clientMain.js
    let postIDFromMain = localStorage.getItem("currentPostID");

    // Get the post owner's data
    getPostOwnersUsername(postIDFromMain);

    // Prevent form from submitting
    return false;
}
saveConnectedUserInfo();


// Uses the post ID to get the post owner's ID, which can get the username
async function getPostOwnersUsername(postID) {
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
    let otherUserID = returnedUserID.user_id; // Post owner
    let thisUserID = jsonDataID.sessionUserID; // Current user

    // Store both user's IDs to determine the users sending and receiving the messages
    userReceiving = otherUserID;
    userSending = thisUserID;


    const dataSentUsername = {
        otherUserID
    };
    const postDetailsUsername = {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(dataSentUsername)
    };

    // Get post owner's username from their ID, this will get displayed
    const postResponseUsername = await fetch('/get-owner-username-with-id', postDetailsUsername);
    const jsonDataUsername = await postResponseUsername.json();
    let returnedUsername = jsonDataUsername.otherUsername;
    let postOwnerName = returnedUsername.userName; // Post owner's username

    document.getElementById("postOwnerUserName").textContent = postOwnerName;

    // Get messages from this user
    getMessagesWithUser(postOwnerName);
}


// Gets past messages between this user and the user selected, then displays them on the page
async function getMessagesWithUser(otherUser) {
    document.getElementById("allMessages").innerHTML = "";

    const dataSent = {
        userSending,
        userReceiving
    };
    const postDetails = {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(dataSent)
    };

    // Get all messages from the database between the sender and receiver users
    const postResponse = await fetch('/all-messages-between-two-users', postDetails);
    const jsonData = await postResponse.json();
    let dbMessageObjs = jsonData.dbResult;
    let thisUser = jsonData.sessionUserID; // Current user


    // Gets each of the past messages saved in the database and styles them based on 
    // if the message was from this user or the other
    for (var index = 0; index < dbMessageObjs.length; index++) {
        var currObj = dbMessageObjs[index];

        // Create HTML p tag element to store the current message
        let currMessage = document.createElement("p");

        let innerSpan = "<span ";

        if (currObj.userSending == thisUser) {
            // Message is from you
            innerSpan += "class=\"your-messages\">";
            innerSpan += " You: " + currObj.message + " ";

            currMessage.style.padding = "20px";
            currMessage.style.margin = "2px";

        } else {
            // Message is from other user
            innerSpan += "class=\"other-user-messages\">";
            innerSpan += otherUser + ": " + currObj.message;
            currMessage.style.padding = "20px";
            currMessage.style.margin = "2px";
        }

        innerSpan += "</span>";

        // Put span element content inside p tag
        currMessage.innerHTML = innerSpan;

        document.getElementById("allMessages").appendChild(currMessage);
    }

    let todayPar = document.createElement("h3");
    todayPar.style.fontStyle = "italic";
    todayPar.style.textAlign = "center";
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

    let innerSpan = "<span ";
    innerSpan += "class=\"your-messages\">";
    innerSpan += " You: " + messageInput;

    newMessage.style.padding = "20px";
    newMessage.style.margin = "2px";

    innerSpan += "</span>";

    // Put span element content inside p tag
    newMessage.innerHTML = innerSpan;

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
    newMessage(data.userSending);
});


// Get the username of the user who sent the new message
async function newMessage(otherUserID) {
    const dataSentUsername = {
        otherUserID
    };
    const postDetailsUsername = {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(dataSentUsername)
    };

    // Gets username from their ID, this will get displayed
    const postResponseUsername = await fetch('/get-owner-username-with-id', postDetailsUsername);
    const jsonDataUsername = await postResponseUsername.json();
    let returnedUsername = jsonDataUsername.otherUsername;

    // Display new message on the page
    createMessageElement(returnedUsername);
}


// Create HTML element to display the message
function createMessageElement(returnedUsername) {
    // HTML element to display the other user's message
    let newMessage = document.createElement("p");

    let innerSpan = "<span ";
    innerSpan += "class=\"other-user-messages\">";
    innerSpan += returnedUsername + ": " + data.message;

    newMessage.style.padding = "20px";
    newMessage.style.margin = "2px";

    innerSpan += "</span>";

    // Put span element content inside p tag
    newMessage.innerHTML = innerSpan;

    document.getElementById("allMessages").appendChild(newMessage);

    // Automatically scroll down
    var allMessages = document.getElementById("allMessages");
    allMessages.scrollTop = allMessages.scrollHeight;
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
    if (messageInputValue.trim() == "") {
        sendMessageBtn.disabled = true;
    } else {
        // If there's input, enable the button
        sendMessageBtn.disabled = false;
    }
});