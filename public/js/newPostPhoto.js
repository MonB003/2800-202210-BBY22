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

function uploadImages(e) {
  e.preventDefault();

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
  fetch("/upload-images2", options
  ).then(function (res) {
    console.log(res);
    window.location.replace("/main")
  }).catch(function (err) { ("Error:", err) }
  );
}
