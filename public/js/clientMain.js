"use strict";

// When profile button is clicked, direct to profile page
document.querySelector("#profile").addEventListener("click", function (e) {
    window.location.replace("/profile");
});

// Redirects to main page
document.querySelector("#home").addEventListener("click", function (e) {
    window.location.replace("/main");
});

// When new post button is clicked, direct to newPost page
document.querySelector("#newPostPageBtn").addEventListener("click", function (e) {
    window.location.replace("/newPost");
});

let postdata = [];

// Updates a user's data in the database
async function loadposts() {
    
    const dataSent = {
    }

    const getDetails = {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(dataSent)
    }

    const getResponse = await fetch('/loadposts', getDetails);
    const jsonData = await getResponse.json();
    postdata = jsonData;
    displayposts();
};

async function displayposts() {
    document.querySelector("#posts").innerHTML = "";
    let posttemplate = document.getElementById("posttemplate");
    let posts = document.getElementById("posts");
    console.log(postdata);
    for (let i = postdata.length-1; i > -1; i--) {
        let testpost = posttemplate.content.cloneNode(true);
        testpost.querySelector(".post").id = `post${postdata[i].postid}`;
        testpost.querySelector(".posttitle").innerHTML = postdata[i].title;
        testpost.querySelector(".poststatus").innerHTML = postdata[i].status;
        testpost.querySelector(".postlocation").innerHTML = postdata[i].city;
        testpost.querySelector(".postdate").innerHTML = postdata[i].timestamp;
        testpost.querySelector(".savepost").id = `save${postdata[i].postid}`;
        testpost.querySelector(".messagepost").id = `message${postdata[i].postid}`;
        posts.appendChild(testpost);
    }
}

loadposts();