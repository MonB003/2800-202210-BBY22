async function updateData() {
    let firstName = document.getElementById('userFirstName').value;
    let lastName = document.getElementById('userLastName').value;
    let city = document.getElementById('userCity').value;
    let email = document.getElementById('userEmail').value;
    let password = document.getElementById('userPassword').value;

    const dataSent = {
        firstName,
        lastName,
        city,
        email,
        password
    }

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
    console.log(jsonData);
    console.log(jsonData.msg);
    document.getElementById('message').innerHTML = jsonData.msg;
};


document.querySelector("#home").addEventListener("click", function (e) {
    window.location.replace("/main");
});