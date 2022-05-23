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

// Tiny editor for textarea
tinymce.init({
    selector: '#newPostDescription'
});


ready(function () {
    function ajaxGET(url, callback) {

        const xhr = new XMLHttpRequest();
        xhr.onload = function () {
            if (this.readyState == XMLHttpRequest.DONE && this.status == 200) {
                callback(this.responseText);

            }
        }
        xhr.open("GET", url);
        xhr.send();
    }

    function ajaxPOST(url, callback, data) {

        let params = typeof data == 'string' ? data : Object.keys(data).map(
            function (k) {
                return encodeURIComponent(k) + '=' + encodeURIComponent(data[k])
            }
        ).join('&');

        const xhr = new XMLHttpRequest();
        xhr.onload = function () {
            if (this.readyState == XMLHttpRequest.DONE && this.status == 200) {
                callback(this.responseText);
            }
        }
        xhr.open("POST", url);
        xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhr.send(params);
    }

    // POST TO THE SERVER
    document.querySelector("#newPostBtn").addEventListener("click", function (e) {
        e.preventDefault();
        let title = document.getElementById("title");
        let description = tinymce.get("newPostDescription").getContent(); // Gets the text value in the tiny editor
        let city = document.getElementById("city");

        let titleValue = title.value;
        let descriptionValue = tinymce.get("newPostDescription").getContent({
            format: 'text'
        });
        let cityValue = city.value;

        let descriptionContainer = document.querySelector(".tox-editor-container");  // Gets the tiny editor HTML element

        // Get all user's input values and input field elements
        let inputsArray = [titleValue, descriptionValue, cityValue];
        let inputFields = [title, descriptionContainer, city];
        let checkEmptyInput = false;

        // Check for empty input fields 
        for (let i = 0; i < inputsArray.length; i++) {
            let currentInput = inputsArray[i];

            // If a value is empty, set boolean to false
            if (currentInput == "" || currentInput == null) {
                checkEmptyInput = true;
                inputFields[i].style.border = "1px solid red";
            } else {
                inputFields[i].style.border = "none";
            }
        }

        // If one or more fields are empty
        if (checkEmptyInput) {
            document.getElementById('errorMessage').textContent = "All fields must be filled out.";

        } else {
            // Store values to send to the server
            let queryString = "title=" + title.value + "&description=" + description + "&city=" + city.value;

            ajaxPOST("/newPost", function (data) {
                if (data) {
                    let dataParsed = JSON.parse(data);
                    if (dataParsed.status == "Fail") {} else {
                        window.location.replace("/newPostPhoto");
                    }
                }
            }, queryString);
        }

    });
});


function ready(callback) {
    if (document.readyState != "loading") {
        callback();
    } else {
        document.addEventListener("DOMContentLoaded", callback);
    }
}