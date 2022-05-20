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

const upLoadForm = document.getElementById("upload-images-form");
upLoadForm.addEventListener("submit", uploadImages);

async function uploadImages(e) {
    e.preventDefault();

    //send image to server side
    const imageUpload = document.querySelector('#image-upload');
    const formData = new FormData();
    for (let i = 0; i < imageUpload.files.length; i++) {
        // put the images from the input into the form data
        formData.append("files", imageUpload.files[i]);
    }

    const options = {
        method: 'POST',
        body: formData
    };

    // now use fetch
    await fetch("/upload-images", options);
    window.location.reload();
}

async function updateData() {
    let firstName = document.getElementById('userFirstName').value;
    let lastName = document.getElementById('userLastName').value;
    let userName = document.getElementById('userName').value;
    let city = document.getElementById('userCity').value;
    let email = document.getElementById('userEmail').value;
    let password = document.getElementById('userPassword').value;

    // Store user's data that was filled into the text fields on the page
    const dataSent = {
        firstName,
        lastName,
        userName,
        city,
        email,
        password
    }

    // Additional details needed when sending data to server side
    const postDetails = {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(dataSent)
    }

    // Get response from server side
    const postResponse = await fetch('/update-data', postDetails);
    const jsonData = await postResponse.json();
    document.getElementById('message').innerHTML = jsonData.msg;
};


// Directs to main page when home button is clicked
document.querySelector("#home").addEventListener("click", function (e) {
    window.location.replace("/main");
});

// Directs to client listing page
document.querySelector("#mylistings").addEventListener("click", function (e) {
    window.location.replace("/mylistings");
});