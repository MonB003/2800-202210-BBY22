"use strict";

// When profile button is clicked, redirect to profile page
document.querySelector("#profile").addEventListener("click", function (e) {
    window.location.replace("/profile");
});

// Redirects to main page
document.querySelector("#home").addEventListener("click", function (e) {
    window.location.replace("/main");
});

// When new post button is clicked, redirect to newPost page
document.querySelector("#newPostPageBtn").addEventListener("click", function (e) {
    window.location.replace("/newPost");
});

document.querySelector("#allMessagesBtn").addEventListener("click", function (e) {
    window.location.replace("/message");
});

// When my listings button is clicked, redirect to myListings page
document.querySelector("#mylistings").addEventListener("click", function (e) {
    window.location.replace("/mylistings");
});


// Redirects to message page if both users are different
function getMessagePage(postID) {
    // Store this post ID for message JS file
    localStorage.setItem("currentPostID", postID);

    // Check for same user
    checkPostOwnerAndSessionUser(postID);
}


// Checks if post owner and current session user are the same
// If they are the same, the user cannot message themself
async function checkPostOwnerAndSessionUser(postID) {
    const idDataSent = {
        postID
    }
    const idPostDetails = {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(idDataSent)
    }

    // Get post owner's ID
    const postResponseID = await fetch('/get-other-user-by-post', idPostDetails);
    const jsonDataID = await postResponseID.json();
    let returnedUserID = jsonDataID.otherUserID;
    let postOwnerID = returnedUserID.user_id; // Post owner userID
    let returnedSessionID = jsonDataID.sessionUserID; // Current session userID

    // Compare post owner and session user IDs
    if (postOwnerID != returnedSessionID) {
        // If they are different, redirect to private message page
        window.location.replace("/postMessage");
    }
}

// Gets the currently selected bookmark status in the dropdown
function getBookmarkStatus(postID) {
    // Get dropdown menu item selected
    let savePostDropdown = document.getElementById(`savepost${postID}`);
    var bookmarkStatus = savePostDropdown.value;


    if (bookmarkStatus == "1") {
        // Record post_id and current user_id to bby_22_bookmarks table
        const dataSent = {
            postID
        }
        console.log(postID);
        console.log(dataSent);

        addBookmark(dataSent);

    } else {
        // Remove post_id from bby_22_bookmarks table
        const dataSent = {
            postID
        }

        // Looks for only an app.post function
        // Sends the JSON data (postID) to the server
        const bookmarkDetails = {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(dataSent)
        }

        // Get response from server side post request
        // const updateBookmark = await fetch('/deleteBookmark', bookmarkDetails);
    }


}

async function addBookmark(dataSent) {

    // Looks for only an app.post function
    // Sends the JSON data (postID) to the server
    const bookmarkDetails = {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(dataSent)
    }

    // Get response from server side post request
    const updateBookmark = await fetch('/addBookmark', bookmarkDetails);
}


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
    } else {
        filterstatus = "all"
        document.querySelector("#filterstatus").innerHTML = "All"
    }
    displayposts();
});

// retrieves posts from database
async function loadposts() {
    const dataSent = {}

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

//displays posts
async function displayposts() {
    document.querySelector("#posts").innerHTML = "";
    let search = document.getElementById("search").value;
    let posttemplate = document.getElementById("posttemplate");
    let posts = document.getElementById("posts");
    if (sort == "recent") {
        for (let i = postdata.length - 1; i > -1; i--) {
            if (document.querySelector("#filter").value == "title") {
                if (postdata[i].title.toLowerCase().includes(search.toLowerCase())) {
                    if (postdata[i].status == filterstatus) {
                        let testpost = posttemplate.content.cloneNode(true);
                        testpost.querySelector(".post").id = `post${postdata[i].postid}`;
                        testpost.querySelector(".posttitle").innerHTML = postdata[i].title;
                        testpost.querySelector(".poststatus").innerHTML = postdata[i].status;
                        testpost.querySelector(".poststatus").setAttribute("id", `postStatus${postdata[i].postid}`);
                        testpost.querySelector(".postlocation").innerHTML = postdata[i].city;
                        testpost.querySelector(".postdate").innerHTML = postdata[i].timestamp;
                        testpost.querySelector(".savepost").id = `save${postdata[i].postid}`;
                        testpost.querySelector(".messagepost").id = `message${postdata[i].postid}`;
                        testpost.querySelector(".messagepost").setAttribute("onclick", `getMessagePage(${postdata[i].postid})`);
                        let postpic = "<img src=\"imgs/uploads/userPic-" + postdata[i].item_pic + "\" alt=\"profile-pic\" id=\"picID\">"
                        testpost.querySelector(".postimage").innerHTML = postpic;
                        testpost.querySelector(".posttitle").setAttribute("onclick", `viewPost(${postdata[i].postid})`);
                        testpost.querySelector(".savepost").setAttribute("id", `savepost${postdata[i].postid}`);
                        testpost.querySelector(".savepost").setAttribute("onchange", `getBookmarkStatus(${postdata[i].postid})`);
                        posts.appendChild(testpost);
                    } else if (filterstatus == "all") {
                        let testpost = posttemplate.content.cloneNode(true);
                        testpost.querySelector(".post").id = `post${postdata[i].postid}`;
                        testpost.querySelector(".posttitle").innerHTML = postdata[i].title;
                        testpost.querySelector(".poststatus").innerHTML = postdata[i].status;
                        testpost.querySelector(".poststatus").setAttribute("id", `postStatus${postdata[i].postid}`);
                        testpost.querySelector(".postlocation").innerHTML = postdata[i].city;
                        testpost.querySelector(".postdate").innerHTML = postdata[i].timestamp;
                        testpost.querySelector(".savepost").id = `save${postdata[i].postid}`;
                        testpost.querySelector(".messagepost").id = `message${postdata[i].postid}`;
                        testpost.querySelector(".messagepost").setAttribute("onclick", `getMessagePage(${postdata[i].postid})`);
                        let postpic = "<img src=\"imgs/uploads/userPic-" + postdata[i].item_pic + "\" alt=\"profile-pic\" id=\"picID\">"
                        testpost.querySelector(".postimage").innerHTML = postpic;
                        testpost.querySelector(".posttitle").setAttribute("onclick", `viewPost(${postdata[i].postid})`);
                        testpost.querySelector(".savepost").setAttribute("id", `savepost${postdata[i].postid}`);
                        testpost.querySelector(".savepost").setAttribute("onchange", `getBookmarkStatus(${postdata[i].postid})`);
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
                        testpost.querySelector(".poststatus").setAttribute("id", `postStatus${postdata[i].postid}`);
                        testpost.querySelector(".postlocation").innerHTML = postdata[i].city;
                        testpost.querySelector(".postdate").innerHTML = postdata[i].timestamp;
                        testpost.querySelector(".savepost").id = `save${postdata[i].postid}`;
                        testpost.querySelector(".messagepost").id = `message${postdata[i].postid}`;
                        testpost.querySelector(".messagepost").setAttribute("onclick", `getMessagePage(${postdata[i].postid})`);
                        let postpic = "<img src=\"imgs/uploads/userPic-" + postdata[i].item_pic + "\" alt=\"profile-pic\" id=\"picID\">"
                        testpost.querySelector(".postimage").innerHTML = postpic;
                        testpost.querySelector(".posttitle").setAttribute("onclick", `viewPost(${postdata[i].postid})`);
                        testpost.querySelector(".savepost").setAttribute("id", `savepost${postdata[i].postid}`);
                        testpost.querySelector(".savepost").setAttribute("onchange", `getBookmarkStatus(${postdata[i].postid})`);
                        posts.appendChild(testpost);
                    } else if (filterstatus == "all") {
                        let testpost = posttemplate.content.cloneNode(true);
                        testpost.querySelector(".post").id = `post${postdata[i].postid}`;
                        testpost.querySelector(".posttitle").innerHTML = postdata[i].title;
                        testpost.querySelector(".poststatus").innerHTML = postdata[i].status;
                        testpost.querySelector(".poststatus").setAttribute("id", `postStatus${postdata[i].postid}`);
                        testpost.querySelector(".postlocation").innerHTML = postdata[i].city;
                        testpost.querySelector(".postdate").innerHTML = postdata[i].timestamp;
                        testpost.querySelector(".savepost").id = `save${postdata[i].postid}`;
                        testpost.querySelector(".messagepost").id = `message${postdata[i].postid}`;
                        testpost.querySelector(".messagepost").setAttribute("onclick", `getMessagePage(${postdata[i].postid})`);
                        let postpic = "<img src=\"imgs/uploads/userPic-" + postdata[i].item_pic + "\" alt=\"profile-pic\" id=\"picID\">"
                        testpost.querySelector(".postimage").innerHTML = postpic;
                        testpost.querySelector(".posttitle").setAttribute("onclick", `viewPost(${postdata[i].postid})`);
                        testpost.querySelector(".savepost").setAttribute("id", `savepost${postdata[i].postid}`);
                        testpost.querySelector(".savepost").setAttribute("onchange", `getBookmarkStatus(${postdata[i].postid})`);
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
                        testpost.querySelector(".poststatus").setAttribute("id", `postStatus${postdata[i].postid}`);
                        testpost.querySelector(".postlocation").innerHTML = postdata[i].city;
                        testpost.querySelector(".postdate").innerHTML = postdata[i].timestamp;
                        testpost.querySelector(".savepost").id = `save${postdata[i].postid}`;
                        testpost.querySelector(".messagepost").id = `message${postdata[i].postid}`;
                        testpost.querySelector(".messagepost").setAttribute("onclick", `getMessagePage(${postdata[i].postid})`);
                        let postpic = "<img src=\"imgs/uploads/userPic-" + postdata[i].item_pic + "\" alt=\"profile-pic\" id=\"picID\">"
                        testpost.querySelector(".postimage").innerHTML = postpic;
                        testpost.querySelector(".posttitle").setAttribute("onclick", `viewPost(${postdata[i].postid})`);
                        testpost.querySelector(".savepost").setAttribute("id", `savepost${postdata[i].postid}`);
                        testpost.querySelector(".savepost").setAttribute("onchange", `getBookmarkStatus(${postdata[i].postid})`);
                        posts.appendChild(testpost);
                    } else if (filterstatus == "all") {
                        let testpost = posttemplate.content.cloneNode(true);
                        testpost.querySelector(".post").id = `post${postdata[i].postid}`;
                        testpost.querySelector(".posttitle").innerHTML = postdata[i].title;
                        testpost.querySelector(".poststatus").innerHTML = postdata[i].status;
                        testpost.querySelector(".poststatus").setAttribute("id", `postStatus${postdata[i].postid}`);
                        testpost.querySelector(".postlocation").innerHTML = postdata[i].city;
                        testpost.querySelector(".postdate").innerHTML = postdata[i].timestamp;
                        testpost.querySelector(".savepost").id = `save${postdata[i].postid}`;
                        testpost.querySelector(".messagepost").id = `message${postdata[i].postid}`;
                        testpost.querySelector(".messagepost").setAttribute("onclick", `getMessagePage(${postdata[i].postid})`);
                        let postpic = "<img src=\"imgs/uploads/userPic-" + postdata[i].item_pic + "\" alt=\"profile-pic\" id=\"picID\">"
                        testpost.querySelector(".postimage").innerHTML = postpic;
                        testpost.querySelector(".posttitle").setAttribute("onclick", `viewPost(${postdata[i].postid})`);
                        testpost.querySelector(".savepost").setAttribute("id", `savepost${postdata[i].postid}`);
                        testpost.querySelector(".savepost").setAttribute("onchange", `getBookmarkStatus(${postdata[i].postid})`);
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
                        testpost.querySelector(".poststatus").setAttribute("id", `postStatus${postdata[i].postid}`);
                        testpost.querySelector(".postlocation").innerHTML = postdata[i].city;
                        testpost.querySelector(".postdate").innerHTML = postdata[i].timestamp;
                        testpost.querySelector(".savepost").id = `save${postdata[i].postid}`;
                        testpost.querySelector(".messagepost").id = `message${postdata[i].postid}`;
                        testpost.querySelector(".messagepost").setAttribute("onclick", `getMessagePage(${postdata[i].postid})`);
                        let postpic = "<img src=\"imgs/uploads/userPic-" + postdata[i].item_pic + "\" alt=\"profile-pic\" id=\"picID\">"
                        testpost.querySelector(".postimage").innerHTML = postpic;
                        testpost.querySelector(".posttitle").setAttribute("onclick", `viewPost(${postdata[i].postid})`);
                        testpost.querySelector(".savepost").setAttribute("id", `savepost${postdata[i].postid}`);
                        testpost.querySelector(".savepost").setAttribute("onchange", `getBookmarkStatus(${postdata[i].postid})`);
                        posts.appendChild(testpost);
                    } else if (filterstatus == "all") {
                        let testpost = posttemplate.content.cloneNode(true);
                        testpost.querySelector(".post").id = `post${postdata[i].postid}`;
                        testpost.querySelector(".posttitle").innerHTML = postdata[i].title;
                        testpost.querySelector(".poststatus").innerHTML = postdata[i].status;
                        testpost.querySelector(".poststatus").setAttribute("id", `postStatus${postdata[i].postid}`);
                        testpost.querySelector(".postlocation").innerHTML = postdata[i].city;
                        testpost.querySelector(".postdate").innerHTML = postdata[i].timestamp;
                        testpost.querySelector(".savepost").id = `save${postdata[i].postid}`;
                        testpost.querySelector(".messagepost").id = `message${postdata[i].postid}`;
                        testpost.querySelector(".messagepost").setAttribute("onclick", `getMessagePage(${postdata[i].postid})`);
                        let postpic = "<img src=\"imgs/uploads/userPic-" + postdata[i].item_pic + "\" alt=\"profile-pic\" id=\"picID\">"
                        testpost.querySelector(".postimage").innerHTML = postpic;
                        testpost.querySelector(".posttitle").setAttribute("onclick", `viewPost(${postdata[i].postid})`);
                        testpost.querySelector(".savepost").setAttribute("id", `savepost${postdata[i].postid}`);
                        testpost.querySelector(".savepost").setAttribute("onchange", `getBookmarkStatus(${postdata[i].postid})`);
                        posts.appendChild(testpost);
                    }
                }
            }
        }
    }

}

loadposts();

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