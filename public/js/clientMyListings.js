// Updates a user's data in the database
async function editpost(postID) {
    let firstName = "yes";
    let lastName = "no";

    // Store user's data that was filled into the text fields on the page
    const dataSent = {
        firstName,
        lastName,
        postID
    }

    // Additional details needed when sending data to server side
    const postDetails = {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(dataSent)
    }

    // Get response from server side post request called update-user-data
    const postResponse = await fetch('/toeditpost', postDetails);
    const jsonData = await postResponse.json();
    // document.getElementById('message').innerHTML = jsonData.msg;
    window.location.replace("/editpost");
};