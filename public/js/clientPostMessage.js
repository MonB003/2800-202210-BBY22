"use strict";

/* 
 * Creates basic messaging feature between 2 users.
 * This is the source that was referenced and modified: https://www.youtube.com/watch?v=Ozrm_xftcjQ
 */

let privateSocket = io.connect('/');

// Stores the users sending and receiving the messages
var userReceiving = "";
var userSending = "";


// Saves a user's email as the userSending when they connect to the message page
function saveConnectedUserInfo() {
    // Get user's email
    var currentEmail = document.getElementById("thisUsersEmail").textContent;

    // Save the email into a global variable
    userSending = currentEmail;

    let postIDFromMain = localStorage.getItem("currentPostID");
    console.log("post id local storage: " + postIDFromMain)

    getPostOwnersEmail(postIDFromMain);

    // Prevent form from submitting
    return false;
}
saveConnectedUserInfo();


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



async function getPostOwnersEmail(postID) {
    console.log("get post owner method postID: " + postID)
    const dataSent1 = {
        postID
    }
    const postDetails1 = {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(dataSent1)
    }
    const postResponse = await fetch('/get-other-user-by-post', postDetails1);
    const jsonData = await postResponse.json();
    let returnedUserID = jsonData.otherUserID;
    let postOwnerID = returnedUserID.user_id;   // Post owner
    console.log("post owner: " + postOwnerID);
    let currentUserID = jsonData.sessionUserID; // Current user logged in
    console.log("curr user: " + currentUserID);


    const dataSent2 = {
        postOwnerID
    }
    const postDetails2 = {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(dataSent2)
    }
    const postResponse2 = await fetch('/get-owner-email-with-id', postDetails2);
    const jsonData2 = await postResponse2.json();
    let returnedUserEmail = jsonData2.otherUserEmail;
    let postOwnerEmail = returnedUserEmail.email;   // Post owner's email
    console.log("email: " + postOwnerEmail);

    getSelectedUser(postOwnerEmail);
}



// Sends a private message to other user
function sendMessageToUser() {
    // Get the message value of the text field
    var messageInput = document.getElementById("messageInput").value;

    // Send message to server
    privateSocket.emit("send-message-to-other-user", {
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
privateSocket.on("new-message-from-other-user", function (data) {
    // Create HTML element to display the other user's messsage
    let newMessage = document.createElement("p");
    newMessage.textContent = data.userSending + ": " + data.message;
    newMessage.style.backgroundColor = "rgb(226, 226, 226)";

    document.getElementById("allMessages").appendChild(newMessage);

    // Automatically scroll down
    var allMessages = document.getElementById("allMessages");
    allMessages.scrollTop = allMessages.scrollHeight;
});


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
