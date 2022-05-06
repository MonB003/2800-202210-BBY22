ready(function() {

    console.log("Client script loaded.");

    function ajaxGET(url, callback) {

        const xhr = new XMLHttpRequest();
        xhr.onload = function() {
            if (this.readyState == XMLHttpRequest.DONE && this.status == 200) {
                callback(this.responseText);

            } else {
                console.log(this.status);
            }
        }
        xhr.open("GET", url);
        xhr.send();
    }

    function ajaxPOST(url, callback, data) {

        let params = typeof data == 'string' ? data : Object.keys(data).map(
                function(k){ return encodeURIComponent(k) + '=' + encodeURIComponent(data[k]) }
            ).join('&');
        console.log("params in ajaxPOST", params);

        const xhr = new XMLHttpRequest();
        xhr.onload = function() {
            if (this.readyState == XMLHttpRequest.DONE && this.status == 200) {
                callback(this.responseText);

            } else {
                console.log(this.status);
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
        let city = document.getElementById("city");
        let email = document.getElementById("userEmail");
        let password = document.getElementById("userPassword");

        // Data being sent to the server
        let dataSent = "firstName=" + fName.value + "&lastName=" + lName.value + "&city=" + city.value + "&email=" + email.value + "&password=" + password.value;

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
    });

});

function ready(callback) {
    if (document.readyState != "loading") {
        callback();
        console.log("ready state is 'complete'");
    } else {
        document.addEventListener("DOMContentLoaded", callback);
        console.log("Listener was invoked");
    }
}
