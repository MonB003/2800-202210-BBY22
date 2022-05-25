"use strict";

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

    // Sends a post request to the server side when sign up button is clicked
    document.querySelector("#signUpBtn").addEventListener("click", function (e) {
        e.preventDefault();
        let fName = document.getElementById("firstName");
        let lName = document.getElementById("lastName");
        let uName = document.getElementById("userName");
        let city = document.getElementById("city");
        let email = document.getElementById("userEmail");
        let password = document.getElementById("userPassword");

        // Get all the text fields in the form to check the values entered in them
        let formInputFields = document.querySelectorAll('input');
        let checkEmptyInput = false;

        // Check for input fields with empty values
        for (let i = 0; i < formInputFields.length; i++) {
            let currentInput = formInputFields[i];

            // If value is empty
            if (currentInput.value.trim() == "") {
                checkEmptyInput = true;
                currentInput.style.border = "1px solid red";

            } else {
                currentInput.style.border = "none";
            }
        }


        // If at least one of the inputs is empty
        if (checkEmptyInput) {
            document.getElementById("accExistsMsg").innerHTML = "Please fill out all fields.";

        } else {
            // Data being sent to the server
            let dataSent = "firstName=" + fName.value + "&lastName=" + lName.value + "&userName=" + uName.value + "&city=" + city.value + "&email=" + email.value + "&password=" + password.value;

            ajaxPOST("/signup", function (data) {

                if (data) {
                    let dataParsed = JSON.parse(data);
                    if (dataParsed.status == "Fail") {
                        document.getElementById("accExistsMsg").innerHTML = dataParsed.msg;
                    } else {
                        window.location.replace("/main");
                    }
                }

            }, dataSent);
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


// Resets all text fields
function resetFields() {
    document.getElementById("firstName").value = "";
    document.getElementById("lastName").value = "";
    document.getElementById("userName").value = "";
    document.getElementById("city").value = "";
    document.getElementById("userEmail").value = "";
    document.getElementById("userPassword").value = "";
}