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

// When new post button is clicked, direct to newPost page
document.querySelector("#newPostPageBtn").addEventListener("click", function (e) {
    window.location.replace("/newPost");
});

//toggle filter menu
document.querySelector("#togglefilter").addEventListener("click", function (e) {
    let filtermenu = document.querySelector("#filtermenu");
    if (filtermenu.style.display === "none") {
        filtermenu.style.display = "grid";
    } else {
        filtermenu.style.display = "none";
    }
});

let postdata = [];
let sort = "recent";
let filterstatus = "all";

//sort posts by recent or oldest
document.querySelector("#sortbutton").addEventListener("click", function (e) {
    if (sort == "recent") {
        sort = "oldest";
    } else {
        sort = "recent";
    }
    displayposts();
});

//filter posts by status
document.querySelector("#filterstatus").addEventListener("click", function (e) {
    if (filterstatus == "all") {
        filterstatus = "available";
        document.querySelector("#filterstatus").innerHTML = "Available"
    } else if (filterstatus == "available") {
        filterstatus = "pending";
        document.querySelector("#filterstatus").innerHTML = "Pending"
    } else if (filterstatus == "pending") {
        filterstatus = "reserved";
        document.querySelector("#filterstatus").innerHTML = "Reserved"
    } else if (filterstatus == "reserved") {
        filterstatus = "collected";
        document.querySelector("#filterstatus").innerHTML = "Collected"
    } else {
        filterstatus = "all"
        document.querySelector("#filterstatus").innerHTML = "All"
    }
    displayposts();
});

// retrieves posts from database
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

    const getResponse = await fetch('/loadmyposts', getDetails);
    const jsonData = await getResponse.json();
    postdata = jsonData;
    displayposts();
};

//displays posts
async function displayposts() {
    document.querySelector("#posts").innerHTML = "";
    let search = document.getElementById("search").value;
    let posttemplate = document.getElementById("posttemplate");
    let posts = document.getElementById("posts");
    if (sort == "recent") {
        for (let i = postdata.length-1; i > -1; i--) {
            if (document.querySelector("#filter").value == "title") {
                if (postdata[i].title.toLowerCase().includes(search.toLowerCase())) {
                    if (postdata[i].status == filterstatus) {
                        let testpost = posttemplate.content.cloneNode(true);
                        testpost.querySelector(".post").id = `post${postdata[i].postid}`;
                        testpost.querySelector(".posttitle").innerHTML = postdata[i].title;
                        testpost.querySelector(".poststatus").innerHTML = postdata[i].status;
                        testpost.querySelector(".postlocation").innerHTML = postdata[i].city;
                        testpost.querySelector(".poststatus").innerHTML = postdata[i].status;
                        testpost.querySelector(".poststatus").setAttribute("id", `postStatus${postdata[i].postid}`);
                        testpost.querySelector(".postdate").innerHTML = postdata[i].timestamp;
                        testpost.querySelector(".messagepost").id = `message${postdata[i].postid}`;
                        let postpic = "<img src=\"imgs/uploads/userPic-" + postdata[i].item_pic + "\" alt=\"profile-pic\" id=\"picID\">"
                        testpost.querySelector(".postimage").innerHTML = postpic;
                        testpost.querySelector(".editpost").id = `edit${postdata[i].postid}`;
                        testpost.querySelector(".editpost").setAttribute("onclick", `editpost(${postdata[i].postid})`)
                        testpost.querySelector(".posttitle").setAttribute("onclick", `viewPost(${postdata[i].postid})`);
                        posts.appendChild(testpost);
                    } else if (filterstatus == "all"){
                        let testpost = posttemplate.content.cloneNode(true);
                        testpost.querySelector(".post").id = `post${postdata[i].postid}`;
                        testpost.querySelector(".posttitle").innerHTML = postdata[i].title;
                        testpost.querySelector(".poststatus").innerHTML = postdata[i].status;
                        testpost.querySelector(".postlocation").innerHTML = postdata[i].city;
                        testpost.querySelector(".poststatus").innerHTML = postdata[i].status;
                        testpost.querySelector(".poststatus").setAttribute("id", `postStatus${postdata[i].postid}`);
                        testpost.querySelector(".postdate").innerHTML = postdata[i].timestamp;
                        testpost.querySelector(".messagepost").id = `message${postdata[i].postid}`;
                        let postpic = "<img src=\"imgs/uploads/userPic-" + postdata[i].item_pic + "\" alt=\"profile-pic\" id=\"picID\">"
                        testpost.querySelector(".postimage").innerHTML = postpic;
                        testpost.querySelector(".editpost").id = `edit${postdata[i].postid}`;
                        testpost.querySelector(".editpost").setAttribute("onclick", `editpost(${postdata[i].postid})`)
                        testpost.querySelector(".posttitle").setAttribute("onclick", `viewPost(${postdata[i].postid})`);
                        posts.appendChild(testpost);
                    }
                }
            } else if (document.querySelector("#filter").value == "city") {
                if (postdata[i].city.toLowerCase().includes(search.toLowerCase())) {
                    if (postdata[i].status == filterstatus) {
                        let testpost = posttemplate.content.cloneNode(true);
                        testpost.querySelector(".post").id = `post${postdata[i].postid}`;
                        testpost.querySelector(".posttitle").innerHTML = postdata[i].title;
                        testpost.querySelector(".poststatus").innerHTML = postdata[i].status;
                        testpost.querySelector(".postlocation").innerHTML = postdata[i].city;
                        testpost.querySelector(".poststatus").innerHTML = postdata[i].status;
                        testpost.querySelector(".poststatus").setAttribute("id", `postStatus${postdata[i].postid}`);
                        testpost.querySelector(".postdate").innerHTML = postdata[i].timestamp;
                        testpost.querySelector(".messagepost").id = `message${postdata[i].postid}`;
                        let postpic = "<img src=\"imgs/uploads/userPic-" + postdata[i].item_pic + "\" alt=\"profile-pic\" id=\"picID\">"
                        testpost.querySelector(".postimage").innerHTML = postpic;
                        testpost.querySelector(".editpost").id = `edit${postdata[i].postid}`;
                        testpost.querySelector(".editpost").setAttribute("onclick", `editpost(${postdata[i].postid})`)
                        testpost.querySelector(".posttitle").setAttribute("onclick", `viewPost(${postdata[i].postid})`);
                        posts.appendChild(testpost);
                    } else if (filterstatus == "all"){
                        let testpost = posttemplate.content.cloneNode(true);
                        testpost.querySelector(".post").id = `post${postdata[i].postid}`;
                        testpost.querySelector(".posttitle").innerHTML = postdata[i].title;
                        testpost.querySelector(".poststatus").innerHTML = postdata[i].status;
                        testpost.querySelector(".postlocation").innerHTML = postdata[i].city;
                        testpost.querySelector(".poststatus").innerHTML = postdata[i].status;
                        testpost.querySelector(".poststatus").setAttribute("id", `postStatus${postdata[i].postid}`);
                        testpost.querySelector(".postdate").innerHTML = postdata[i].timestamp;
                        testpost.querySelector(".messagepost").id = `message${postdata[i].postid}`;
                        let postpic = "<img src=\"imgs/uploads/userPic-" + postdata[i].item_pic + "\" alt=\"profile-pic\" id=\"picID\">"
                        testpost.querySelector(".postimage").innerHTML = postpic;
                        testpost.querySelector(".editpost").id = `edit${postdata[i].postid}`;
                        testpost.querySelector(".editpost").setAttribute("onclick", `editpost(${postdata[i].postid})`)
                        testpost.querySelector(".posttitle").setAttribute("onclick", `viewPost(${postdata[i].postid})`);
                        posts.appendChild(testpost);
                    }
                }
            } 
        }
    } else {
        for (let i = 0; i < postdata.length; i++) {
            if (document.querySelector("#filter").value == "title") {
                if (postdata[i].title.toLowerCase().includes(search.toLowerCase())) {
                    if (postdata[i].status == filterstatus) {
                        let testpost = posttemplate.content.cloneNode(true);
                        testpost.querySelector(".post").id = `post${postdata[i].postid}`;
                        testpost.querySelector(".posttitle").innerHTML = postdata[i].title;
                        testpost.querySelector(".poststatus").innerHTML = postdata[i].status;
                        testpost.querySelector(".postlocation").innerHTML = postdata[i].city;
                        testpost.querySelector(".poststatus").innerHTML = postdata[i].status;
                        testpost.querySelector(".poststatus").setAttribute("id", `postStatus${postdata[i].postid}`);
                        testpost.querySelector(".postdate").innerHTML = postdata[i].timestamp;
                        testpost.querySelector(".messagepost").id = `message${postdata[i].postid}`;
                        let postpic = "<img src=\"imgs/uploads/userPic-" + postdata[i].item_pic + "\" alt=\"profile-pic\" id=\"picID\">"
                        testpost.querySelector(".postimage").innerHTML = postpic;
                        testpost.querySelector(".editpost").id = `edit${postdata[i].postid}`;
                        testpost.querySelector(".editpost").setAttribute("onclick", `editpost(${postdata[i].postid})`)
                        testpost.querySelector(".posttitle").setAttribute("onclick", `viewPost(${postdata[i].postid})`);
                        posts.appendChild(testpost);
                    } else if (filterstatus == "all"){
                        let testpost = posttemplate.content.cloneNode(true);
                        testpost.querySelector(".post").id = `post${postdata[i].postid}`;
                        testpost.querySelector(".posttitle").innerHTML = postdata[i].title;
                        testpost.querySelector(".poststatus").innerHTML = postdata[i].status;
                        testpost.querySelector(".postlocation").innerHTML = postdata[i].city;
                        testpost.querySelector(".poststatus").innerHTML = postdata[i].status;
                        testpost.querySelector(".poststatus").setAttribute("id", `postStatus${postdata[i].postid}`);
                        testpost.querySelector(".postdate").innerHTML = postdata[i].timestamp;
                        testpost.querySelector(".messagepost").id = `message${postdata[i].postid}`;
                        let postpic = "<img src=\"imgs/uploads/userPic-" + postdata[i].item_pic + "\" alt=\"profile-pic\" id=\"picID\">"
                        testpost.querySelector(".postimage").innerHTML = postpic;
                        testpost.querySelector(".editpost").id = `edit${postdata[i].postid}`;
                        testpost.querySelector(".editpost").setAttribute("onclick", `editpost(${postdata[i].postid})`)
                        testpost.querySelector(".posttitle").setAttribute("onclick", `viewPost(${postdata[i].postid})`);
                        posts.appendChild(testpost);
                    }
                }
            } else if (document.querySelector("#filter").value == "city") {
                if (postdata[i].city.toLowerCase().includes(search.toLowerCase())) {
                    if (postdata[i].status == filterstatus) {
                        let testpost = posttemplate.content.cloneNode(true);
                        testpost.querySelector(".post").id = `post${postdata[i].postid}`;
                        testpost.querySelector(".posttitle").innerHTML = postdata[i].title;
                        testpost.querySelector(".poststatus").innerHTML = postdata[i].status;
                        testpost.querySelector(".postlocation").innerHTML = postdata[i].city;
                        testpost.querySelector(".poststatus").innerHTML = postdata[i].status;
                        testpost.querySelector(".poststatus").setAttribute("id", `postStatus${postdata[i].postid}`);
                        testpost.querySelector(".postdate").innerHTML = postdata[i].timestamp;
                        testpost.querySelector(".messagepost").id = `message${postdata[i].postid}`;
                        let postpic = "<img src=\"imgs/uploads/userPic-" + postdata[i].item_pic + "\" alt=\"profile-pic\" id=\"picID\">"
                        testpost.querySelector(".postimage").innerHTML = postpic;
                        testpost.querySelector(".editpost").id = `edit${postdata[i].postid}`;
                        testpost.querySelector(".editpost").setAttribute("onclick", `editpost(${postdata[i].postid})`)
                        testpost.querySelector(".posttitle").setAttribute("onclick", `viewPost(${postdata[i].postid})`);
                        posts.appendChild(testpost);
                    } else if (filterstatus == "all"){
                        let testpost = posttemplate.content.cloneNode(true);
                        testpost.querySelector(".post").id = `post${postdata[i].postid}`;
                        testpost.querySelector(".posttitle").innerHTML = postdata[i].title;
                        testpost.querySelector(".poststatus").innerHTML = postdata[i].status;
                        testpost.querySelector(".postlocation").innerHTML = postdata[i].city;
                        testpost.querySelector(".poststatus").innerHTML = postdata[i].status;
                        testpost.querySelector(".poststatus").setAttribute("id", `postStatus${postdata[i].postid}`);
                        testpost.querySelector(".postdate").innerHTML = postdata[i].timestamp;
                        testpost.querySelector(".messagepost").id = `message${postdata[i].postid}`;
                        let postpic = "<img src=\"imgs/uploads/userPic-" + postdata[i].item_pic + "\" alt=\"profile-pic\" id=\"picID\">"
                        testpost.querySelector(".postimage").innerHTML = postpic;
                        testpost.querySelector(".editpost").id = `edit${postdata[i].postid}`;
                        testpost.querySelector(".editpost").setAttribute("onclick", `editpost(${postdata[i].postid})`)
                        testpost.querySelector(".posttitle").setAttribute("onclick", `viewPost(${postdata[i].postid})`);
                        posts.appendChild(testpost);
                    }
                }
            } 
        }
    }

}

loadposts();

//saves post id to session for editing post on editpost page
async function editpost(postID) {
    const dataSent = {
        postID
    }

    const postDetails = {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(dataSent)
    }

    const postResponse = await fetch('/toeditpost', postDetails);
    const jsonData = await postResponse.json();
    if (jsonData.status == "Success") {
        window.location.replace("/editpost");
    }
};

// Saves the post ID to the session and redirects to the view post html if validated
async function viewPost(postID) {


    // Sends data in an array to the server and saves it to a session
    const dataSent = {
        postID
    }

    // Looks for only an app.post function
    // Sends the JSON data (postID) to the server
    const postDetails = {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(dataSent)
    }

    const postResponse = await fetch('/toviewpost', postDetails);
    const jsonData = await postResponse.json();
    if (jsonData.status == "Success") {
        window.location.replace("/viewPost");
    }
};
