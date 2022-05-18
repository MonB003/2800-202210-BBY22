"use strict";

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
    window.location.replace("/editpost")
  }).catch(function (err) { ("Error:", err) }
  );
}