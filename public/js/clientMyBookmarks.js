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

// retrieves bookmarks from database
async function loadbookmarks() {

    const dataSent = {}

    const getDetails = {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(dataSent)
    }

    const getResponse = await fetch('/loadmybookmarks', getDetails);
    const jsonData = await getResponse.json();
    console.log(jsonData);
    bookmarksdata = jsonData;
    console.log(bookmarksdata);

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
    }

    const getResponse = await fetch('/loadsavedposts', getDetails);
    const jsonData = await getResponse.json();
    postdata = jsonData;
    console.log(postdata);
    console.log(jsonData);
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

loadbookmarks();


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