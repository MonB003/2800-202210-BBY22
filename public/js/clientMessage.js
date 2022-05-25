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
async function saveConnectedUserInfo() {
    // Get username
    var userName = document.getElementById("thisUserName").textContent;

    const userDataSent = {
        userName
    };
    const userPostDetails = {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(userDataSent)
    };

    // Get post owner and session user's IDs
    const postResponseID = await fetch('/get-user-id-from-username', userPostDetails);
    const jsonDataID = await postResponseID.json();
    let returnedUserID = jsonDataID.otherUserID;
    let thisUserID = returnedUserID.id; // User ID

    // Send ID to the server
    socket.emit("a-user-connects", thisUserID);

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


// Uses the usernames displayed on the page to get both user's IDs
async function getBothUserIDsFromUsername(userName) {
    const userDataSent = {
        userName
    };
    const userPostDetails = {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(userDataSent)
    };

    // Get post owner and session user's IDs
    const postResponseID = await fetch('/get-user-id-from-username', userPostDetails);
    const jsonDataID = await postResponseID.json();
    let returnedUserID = jsonDataID.otherUserID;
    let otherUserID = returnedUserID.id; // Post owner
    let thisUserID = jsonDataID.sessionUserID; // Current user

    // Store both user's IDs to determine the users sending and receiving the messages
    userReceiving = otherUserID;
    userSending = thisUserID;

    // Get their past messages
    getMessagesWithUser(userSending, userReceiving, userName);
}


// Gets past messages between this user and the user selected, then displays them on the page
// This is called when one of the user's username buttons is clicked
async function getMessagesWithUser(userSending, userReceiving, userName) {
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
            innerSpan += userName + ": " + currObj.message;
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
    var gridDiv = document.getElementById("grid");
    gridDiv.scrollTop = gridDiv.scrollHeight;
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
    newMessage(data.userSending, data.message);
});


// Get the username of the user who sent the new message
async function newMessage(otherUserID, message) {
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
    let username = returnedUsername.userName;

    createMessageElement(username, message);
}


// Create HTML element to display the message
function createMessageElement(returnedUsername, message) {
    // Create HTML element to display the other user's message
    let newMessage = document.createElement("p");

    let innerSpan = "<span ";
    innerSpan += "class=\"other-user-messages\">";
    innerSpan += returnedUsername + ": " + message;

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


// Function to create each user contact's button
async function getUsersThisUserMessaged() {
    const postDetails = {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        }
    };

    // Get response from server side post request
    const postResponse = await fetch('/people-who-messaged-this-user', postDetails);
    const jsonData = await postResponse.json();

    // Gets all users this user has been in contact with
    let allContacts = jsonData.thisUsersContacts;

    // Current session user (this user)
    let thisUser = jsonData.sessionUserID;

    let contactsArray = new Array();
    for (let index = 0; index < allContacts.length; index++) {
        let currObj = allContacts[index];

        // Check if users are already in the array
        let containsSender = contactsArray.includes(currObj.userSending);
        let containsReceiver = contactsArray.includes(currObj.userReceiving);

        // Add each user that isn't the current session user to the array
        if (currObj.userSending != thisUser && containsSender == false) {
            contactsArray.push(currObj.userSending);
        }

        if (currObj.userReceiving != thisUser && containsReceiver == false) {
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

        let otherUserID = userContact;

        const userDataSent = {
            otherUserID
        };
        const userPostDetails = {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(userDataSent)
        };

        // Get post owner's IDs
        const postResponseName = await fetch('/get-owner-username-with-id', userPostDetails);
        const jsonDataName = await postResponseName.json();
        let returnedUserName = jsonDataName.otherUsername;
        let contactUsername = returnedUserName.userName; // Post owner username

        // Display username on the button for that user
        newBtn.innerHTML = contactUsername;

        // User's button displays their message history when clicked
        newBtn.setAttribute("onclick", "getBothUserIDsFromUsername(this.innerHTML);");
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