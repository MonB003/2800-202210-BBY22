"use strict";

/* 
 * Creates basic messaging feature between 2 users.
 * This is the source that was referenced and modified: https://www.youtube.com/watch?v=Ozrm_xftcjQ
 */

let socket = io.connect('/');

// Stores the users sending and receiving the messages
var userReceiving = "";
var userSending = "";


// Saves a user's username as the userSending when they connect to the message page
function saveConnectedUserInfo() {
    // Get username
    var currentUserName = document.getElementById("thisUserName").textContent;

    // Send it to the server
    socket.emit("a-user-connects", currentUserName);

    // Save the username into a global variable
    userSending = currentUserName;

    // Prevent form from submitting
    return false;
}
saveConnectedUserInfo();


// When a user connects to the message page
socket.on("a-user-connects", function (username) {
    let onlineUser = document.createElement("p");
    onlineUser.textContent = "Online: " + username;
    document.getElementById("users").appendChild(onlineUser);
});


// Gets past messages between this user and the user selected, then displays them on the page
// This is called when one of the user's username buttons is clicked
async function getSelectedUser(username) {
    userReceiving = username;
    userSending = document.getElementById("thisUserName").textContent;

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
        let thisUser = document.getElementById("thisUserName").textContent;

        if (currObj.userSending == thisUser) {
            // Message is from you
            currMessage.textContent = "You: " + currObj.message;
            currMessage.style.backgroundColor = "#91C7B1";
            currMessage.style.textAlign = "right";
            currMessage.style.color = "white";
            currMessage.style.padding = "20px";
            currMessage.style.margin = "2px";  
            currMessage.style.fontWeight = "bold";

        } else {
            // Message is from other user
            currMessage.textContent = currObj.userSending + ": " + currObj.message;
            currMessage.style.backgroundColor = "#9fa4a9";
            currMessage.style.padding = "20px";
            currMessage.style.margin = "2px";  
            currMessage.style.color = "white";
            currMessage.style.fontWeight = "bold";
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

    // Enable message text field
    document.getElementById("messageInput").disabled = false;
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
    newMessage.style.backgroundColor = "#91C7B1";
    newMessage.style.textAlign = "right";
    newMessage.style.color = "white";
    newMessage.style.padding = "20px";
    newMessage.style.margin = "2px";
    newMessage.style.fontWeight = "bold";

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
    newMessage.style.backgroundColor = "#9fa4a9";
    newMessage.style.padding = "20px";
    newMessage.style.margin = "2px";
    newMessage.style.color = "white";
    newMessage.style.fontWeight = "bold";

    document.getElementById("allMessages").appendChild(newMessage);

    // Automatically scroll down
    var allMessages = document.getElementById("allMessages");
    allMessages.scrollTop = allMessages.scrollHeight;
});


// Function to create each user contact's button
async function getUsersThisUserMessaged() {
    let username = document.getElementById("thisUserName").textContent;

    const dataSent = {
        username
    }

    const postDetails = {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(dataSent)
    }

    // Get response from server side post request
    const postResponse = await fetch('/people-who-messaged-this-user', postDetails);
    const jsonData = await postResponse.json();

    // Gets all users this user has been in contact with
    let allContacts = jsonData.thisUsersContacts;   

    let contactsArray = new Array();
    for (let index = 0; index < allContacts.length; index++) {
        let currObj = allContacts[index];

        // Check if users are already in the array
        let containsSender = contactsArray.includes(currObj.userSending);
        let containsReceiver = contactsArray.includes(currObj.userReceiving);

        // Add each username that isn't the current session user to the array
        if (currObj.userSending != username && containsSender == false) {
            contactsArray.push(currObj.userSending);
        } 
        
        if (currObj.userReceiving != username && containsReceiver == false) {
            contactsArray.push(currObj.userReceiving);
        }
    }
    


    // Creates buttons for each user based on the IDs returned from the database
    for (let contact = 0; contact < contactsArray.length; contact++) {
        let userContact = contactsArray[contact];

        // Create button for each of those users
        let newBtn = document.createElement("button");
        newBtn.setAttribute("id", "user-" + userContact);
        newBtn.setAttribute("class", "username-contact-btns");
        newBtn.innerHTML = userContact;
        newBtn.setAttribute("onclick", "getSelectedUser(this.innerHTML);");
        document.getElementById("thisUsersContacts").appendChild(newBtn);

        let newLine = document.createElement("br");
        document.getElementById("thisUsersContacts").appendChild(newLine);
    }
}
getUsersThisUserMessaged();


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