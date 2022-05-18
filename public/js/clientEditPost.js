"use strict";

//Returns user to listing page
document.querySelector("#cancel").addEventListener("click", function (e) {
    window.location.replace("/mylistings");
});

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
    }
    const postDetails = {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(dataSent)
    }
    fetch("/upload-images3", options, postDetails
    ).then(function (res) {
        console.log(res);
        window.location.replace("/editpost")
    }).catch(function (err) { ("Error:", err) }
    );
    document.getElementById("savedMsg").innerHTML = "Photo Saved";
}


//redirects to update photo page
// document.querySelector("#updatePicBtn").addEventListener("click", function (e) {
//     alert("clicked redirect to photo");
//     window.location.replace("/editpostPhoto");
// });


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