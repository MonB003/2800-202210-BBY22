"use strict";

// Redirects to main page
document.querySelector("#home").addEventListener("click", function (e) {
    window.location.replace("/main");
});
document.querySelector("#home2").addEventListener("click", function (e) {
    window.location.replace("/main");
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

// Star rating styling for user score
document.querySelector("#urlabel1").addEventListener("mouseover", function (e) {
    for (let i = 0; i < 5; i++) {
        document.querySelector(`#urlabel${i+1}`).style.color = "gray";
    }
    for (let i = 0; i < document.querySelector("#userrating1").value; i++) {
        document.querySelector(`#urlabel${i+1}`).style.color = "palegreen";
    } 
});
document.querySelector("#urlabel2").addEventListener("mouseover", function (e) {
    for (let i = 0; i < 5; i++) {
        document.querySelector(`#urlabel${i+1}`).style.color = "gray";
    }
    for (let i = 0; i < document.querySelector("#userrating2").value; i++) {
        document.querySelector(`#urlabel${i+1}`).style.color = "palegreen";
    } 
});
document.querySelector("#urlabel3").addEventListener("mouseover", function (e) {
    for (let i = 0; i < 5; i++) {
        document.querySelector(`#urlabel${i+1}`).style.color = "gray";
    }
    for (let i = 0; i < document.querySelector("#userrating3").value; i++) {
        document.querySelector(`#urlabel${i+1}`).style.color = "palegreen";
    } 
});
document.querySelector("#urlabel4").addEventListener("mouseover", function (e) {
    for (let i = 0; i < 5; i++) {
        document.querySelector(`#urlabel${i+1}`).style.color = "gray";
    }
    for (let i = 0; i < document.querySelector("#userrating4").value; i++) {
        document.querySelector(`#urlabel${i+1}`).style.color = "palegreen";
    } 
});
document.querySelector("#urlabel5").addEventListener("mouseover", function (e) {
    for (let i = 0; i < 5; i++) {
        document.querySelector(`#urlabel${i+1}`).style.color = "gray";
    }
    for (let i = 0; i < document.querySelector("#userrating5").value; i++) {
        document.querySelector(`#urlabel${i+1}`).style.color = "palegreen";
    } 
});

document.querySelector("#urlabel1").addEventListener("mouseout", function (e) {
    for (let i = 0; i < 5; i++) {
        document.querySelector(`#urlabel${i+1}`).style.color = "gray";
    }
    let rating = 0;
    for(var i = 0; i < document.getElementsByName('urating').length; i++){
        if(document.getElementsByName('urating')[i].checked){
            rating = document.getElementsByName('urating')[i].value;
        }
    }
    for (let i = 0; i < rating; i++) {
        document.querySelector(`#urlabel${i+1}`).style.color = "palegreen";
    }
});
document.querySelector("#urlabel2").addEventListener("mouseout", function (e) {
    for (let i = 0; i < 5; i++) {
        document.querySelector(`#urlabel${i+1}`).style.color = "gray";
    }
    let rating = 0;
    for(var i = 0; i < document.getElementsByName('urating').length; i++){
        if(document.getElementsByName('urating')[i].checked){
            rating = document.getElementsByName('urating')[i].value;
        }
    }
    for (let i = 0; i < rating; i++) {
        document.querySelector(`#urlabel${i+1}`).style.color = "palegreen";
    }
});
document.querySelector("#urlabel3").addEventListener("mouseout", function (e) {
    for (let i = 0; i < 5; i++) {
        document.querySelector(`#urlabel${i+1}`).style.color = "gray";
    }
    let rating = 0;
    for(var i = 0; i < document.getElementsByName('urating').length; i++){
        if(document.getElementsByName('urating')[i].checked){
            rating = document.getElementsByName('urating')[i].value;
        }
    }
    for (let i = 0; i < rating; i++) {
        document.querySelector(`#urlabel${i+1}`).style.color = "palegreen";
    }
});
document.querySelector("#urlabel4").addEventListener("mouseout", function (e) {
    for (let i = 0; i < 5; i++) {
        document.querySelector(`#urlabel${i+1}`).style.color = "gray";
    }
    let rating = 0;
    for(var i = 0; i < document.getElementsByName('urating').length; i++){
        if(document.getElementsByName('urating')[i].checked){
            rating = document.getElementsByName('urating')[i].value;
        }
    }
    for (let i = 0; i < rating; i++) {
        document.querySelector(`#urlabel${i+1}`).style.color = "palegreen";
    }
});
document.querySelector("#urlabel5").addEventListener("mouseout", function (e) {
    for (let i = 0; i < 5; i++) {
        document.querySelector(`#urlabel${i+1}`).style.color = "gray";
    }
    let rating = 0;
    for(var i = 0; i < document.getElementsByName('urating').length; i++){
        if(document.getElementsByName('urating')[i].checked){
            rating = document.getElementsByName('urating')[i].value;
        }
    }
    for (let i = 0; i < rating; i++) {
        document.querySelector(`#urlabel${i+1}`).style.color = "palegreen";
    }
});

document.querySelector("#urlabel1").addEventListener("click", function (e) {
    for (let i = 0; i < 5; i++) {
        document.querySelector(`#urlabel${i+1}`).style.color = "gray";
    }
    for (let i = 0; i < document.querySelector("#userrating1").value; i++) {
        document.querySelector(`#urlabel${i+1}`).style.color = "palegreen";
    } 
});
document.querySelector("#urlabel2").addEventListener("click", function (e) {
    for (let i = 0; i < 5; i++) {
        document.querySelector(`#urlabel${i+1}`).style.color = "gray";
    }
    for (let i = 0; i < document.querySelector("#userrating2").value; i++) {
        document.querySelector(`#urlabel${i+1}`).style.color = "palegreen";
    } 
});
document.querySelector("#urlabel3").addEventListener("click", function (e) {
    for (let i = 0; i < 5; i++) {
        document.querySelector(`#urlabel${i+1}`).style.color = "gray";
    }
    for (let i = 0; i < document.querySelector("#userrating3").value; i++) {
        document.querySelector(`#urlabel${i+1}`).style.color = "palegreen";
    } 
});
document.querySelector("#urlabel4").addEventListener("click", function (e) {
    for (let i = 0; i < 5; i++) {
        document.querySelector(`#urlabel${i+1}`).style.color = "gray";
    }
    for (let i = 0; i < document.querySelector("#userrating4").value; i++) {
        document.querySelector(`#urlabel${i+1}`).style.color = "palegreen";
    } 
});
document.querySelector("#urlabel5").addEventListener("click", function (e) {
    for (let i = 0; i < 5; i++) {
        document.querySelector(`#urlabel${i+1}`).style.color = "gray";
    }
    for (let i = 0; i < document.querySelector("#userrating5").value; i++) {
        document.querySelector(`#urlabel${i+1}`).style.color = "palegreen";
    } 
});

//display star overall rating
function displayrating() {
    let rating = 0;
    for(var i = 0; i < document.getElementsByName('rating').length; i++){
        if(document.getElementsByName('rating')[i].checked){
            rating = document.getElementsByName('rating')[i].value;
        }
    }
    for (let i = 0; i < rating; i++) {
        document.querySelector(`#rlabel${i+1}`).style.color = "palegreen";
    }
}

displayrating();

// Redirects to private message page if post owner and session user are different
async function getMessagePage(userName) {
    const userDataSent = {
        userName
    }
    const userPostDetails = {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(userDataSent)
    }

    // Get profile user and session user's IDs
    const postResponseID = await fetch('/get-user-id-from-username', userPostDetails);
    const jsonDataID = await postResponseID.json();
    let returnedUserID = jsonDataID.otherUserID;
    let profileUserID = returnedUserID.id;   // User ID
    let sessionUserID = jsonDataID.sessionUserID;   // Session ID

    // Compare profile user and session user IDs
    if (profileUserID != sessionUserID) {
        // If they are different, redirect to private message page
        window.location.replace("/postMessage");
    }
}

async function saverating(userName) {
    let rating;
    for(var i = 0; i < document.getElementsByName('urating').length; i++){
        if(document.getElementsByName('urating')[i].checked){
            rating = document.getElementsByName('urating')[i].value;
        }
    }

    const userDataSent = {
        userName,
        rating
    }
    const userPostDetails = {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(userDataSent)
    }

    // Get profile user and session user's IDs
    const postResponse = await fetch('/saverating', userPostDetails);
    const jsonData = await postResponse.json();
    if (jsonData.status == "Success") {
        window.location.reload();
    }
}