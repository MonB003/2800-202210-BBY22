"use strict";

ready(function() {

    function ajaxGET(url, callback) {

        const xhr = new XMLHttpRequest();
        xhr.onload = function() {
            if (this.readyState == XMLHttpRequest.DONE && this.status == 200) {
                callback(this.responseText);

            } 
        }
        xhr.open("GET", url);
        xhr.send();
    }

    function ajaxPOST(url, callback, data) {

        let params = typeof data == 'string' ? data : Object.keys(data).map(
                function(k){ return encodeURIComponent(k) + '=' + encodeURIComponent(data[k]) }
            ).join('&');

        const xhr = new XMLHttpRequest();
        xhr.onload = function() {
            if (this.readyState == XMLHttpRequest.DONE && this.status == 200) {
                callback(this.responseText);
            }
        }
        xhr.open("POST", url);
        xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhr.send(params);
    }

    // Sends a post request to the server side when login button is clicked
    document.querySelector("#loginBtn").addEventListener("click", function(e) {
        e.preventDefault();
        let email = document.getElementById("userEmail");
        let password = document.getElementById("userPassword");

        // Data being sent to the server
        let dataSent = "email=" + email.value + "&password=" + password.value;

        ajaxPOST("/login", function(data) {

            if(data) {
                let dataParsed = JSON.parse(data);
                if(dataParsed.status == "Fail") {
                    document.getElementById("errorMsg").innerHTML = dataParsed.msg;
                } else {
                    window.location.replace("/main");
                }
            }

        }, dataSent);
    });

});

function ready(callback) {
    if (document.readyState != "loading") {
        callback();
    } else {
        document.addEventListener("DOMContentLoaded", callback);
    }
}
