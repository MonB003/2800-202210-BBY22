"use strict";

// When new post button is clicked, redirect to newPost page
document.querySelector("#newPostPageBtn").addEventListener("click", function (e) {
    window.location.replace("/newPost");
});

// Redirects to main page
document.querySelector("#home").addEventListener("click", function (e) {
    window.location.replace("/main");
});
document.querySelector("#home2").addEventListener("click", function (e) {
    window.location.replace("/main");
});

//redirects to bookmarks page
document.querySelector("#bookmark").addEventListener("click", function (e) {
    window.location.replace("/myBookmarks");
});
document.querySelector("#bookmark2").addEventListener("click", function (e) {
    window.location.replace("/myBookmarks");
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
let bookmarksdata = [];
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
        filterstatus = "reserved";
        document.querySelector("#filterstatus").innerHTML = "Reserved"
    } else if (filterstatus == "reserved") {
        filterstatus = "collected";
        document.querySelector("#filterstatus").innerHTML = "Collected";
    } else {
        filterstatus = "all"
        document.querySelector("#filterstatus").innerHTML = "All"
    }
    displayposts();
});

// Gets the currently selected bookmark status in the dropdown
function getBookmarkStatus(postID) {

    // Get dropdown menu item selected
    let savePostDropdown = document.getElementById(`savepost${postID}`);
    var bookmarkStatus = savePostDropdown.value;


    if (bookmarkStatus == "0") {

        //Make the confirmation pop-up visible when user wants to remove a bookmark 
        let confirmBookmarkDiv = document.getElementById('confirmBookmark');
        confirmBookmarkDiv.style.display = "block";

        //when user confirms removing the bookmark
        document.querySelector("#removeMsgBtn").addEventListener("click", function (e) {
            // Remove post_id from bby_22_bookmarks table
            const dataSent = {
                postID
            }

            removeBookmark(dataSent);
        });

        // when the user decides to keep the bookmark when prompted for removal confirmation
        // when the cancel button is clicked in confirm remove bookmark popup - removes the pop-up display
        document.querySelector("#cancelMsgBtn").addEventListener("click", function (e) {
            confirmBookmarkDiv.style.display = "none";
            window.location.reload();
        });



    } else {
        // Do nothing if save bookmark is selected

    }

}

//Removes a bookmark from the mybookmarks page
async function removeBookmark(dataSent) {

    // Looks for only an app.post function
    // Sends the JSON data (postID) to the server

    const removeBookmark = {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(dataSent)

    }
    // Get response from server side post request
    const updateBookmark = await fetch('/removeBookmark', removeBookmark);
    const jsonData = await updateBookmark.json();
    if (jsonData.status == "Success") {
        window.location.reload();
    }

}

async function addBookmark(dataSent) {

    // Looks for only an app.post function
    // Sends the JSON data (postID) to the server
    const addBookmark = {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(dataSent)
    }

    // Get response from server side post request
    await fetch('/addBookmark', addBookmark);
}

// retrieves bookmarks from database
async function loadbookmarks() {

    const getDetails = {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        }
    };

    const getResponse = await fetch('/loadmybookmarks', getDetails);
    const jsonData = await getResponse.json();
    bookmarksdata = jsonData;

    loadposts();

};

// retrieves posts from database
async function loadposts() {

    const dataSent = bookmarksdata;

    const getDetails = {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(dataSent)
    };

    const getResponse = await fetch('/loadsavedposts', getDetails);
    const jsonData = await getResponse.json();
    postdata = jsonData;

    displayposts();
};

//displays saved posts
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
                        let postpic = "<img src=\"imgs/uploads/userPic-" + postdata[i].item_pic + "\" alt=\"profile-pic\" id=\"picID\">";
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
                        let postpic = "<img src=\"imgs/uploads/userPic-" + postdata[i].item_pic + "\" alt=\"profile-pic\" id=\"picID\">";
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
                        let postpic = "<img src=\"imgs/uploads/userPic-" + postdata[i].item_pic + "\" alt=\"profile-pic\" id=\"picID\">";
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
                        let postpic = "<img src=\"imgs/uploads/userPic-" + postdata[i].item_pic + "\" alt=\"profile-pic\" id=\"picID\">";
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
                        let postpic = "<img src=\"imgs/uploads/userPic-" + postdata[i].item_pic + "\" alt=\"profile-pic\" id=\"picID\">";
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
                        let postpic = "<img src=\"imgs/uploads/userPic-" + postdata[i].item_pic + "\" alt=\"profile-pic\" id=\"picID\">";
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
                        let postpic = "<img src=\"imgs/uploads/userPic-" + postdata[i].item_pic + "\" alt=\"profile-pic\" id=\"picID\">";
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
                        let postpic = "<img src=\"imgs/uploads/userPic-" + postdata[i].item_pic + "\" alt=\"profile-pic\" id=\"picID\">";
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

loadbookmarks();


// Saves the post ID to the session and redirects to the view post html if validated
async function viewPost(postID) {

    // Sends data in an array to the server and saves it to a session
    const dataSent = {
        postID
    };

    // Looks for only an app.post function
    // Sends the JSON data (postID) to the server
    const postDetails = {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(dataSent)
    };

    const postResponse = await fetch('/toviewpost', postDetails);
    const jsonData = await postResponse.json();
    if (jsonData.status == "Success") {
        window.location.replace("/viewPost");
    }
};