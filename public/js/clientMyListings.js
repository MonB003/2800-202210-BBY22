async function toeditpost(postID) {
    console.log(postID);
    const dataSent = {
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

    // Get response from server side post request called editpost
    const postResponse = await fetch('/toeditpost', postDetails);
    const jsonData = await postResponse.json();
    document.getElementById('message').innerHTML = jsonData.msg;
    window.location.replace("/editpost");
};