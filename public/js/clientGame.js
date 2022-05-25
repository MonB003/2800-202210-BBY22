"use strict";


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

let menu = 0;

document.querySelector(".menuBtn").addEventListener("click", function (e) {
    if (menu == 0) {
        document.getElementById("whitebox").style.zIndex = "-2";
        document.getElementById("gamer").style.zIndex = "-5";
        document.getElementById("obstacle").style.zIndex = "-4";
        document.getElementById("left").style.zIndex = "-3";
        document.getElementById("right").style.zIndex = "-3";
        document.getElementById("msg-box").style.zIndex = "-1";
        menu = 1;
    } else {
        document.getElementById("whitebox").style.zIndex = "";
        document.getElementById("gamer").style.zIndex = "";
        document.getElementById("obstacle").style.zIndex = "";
        document.getElementById("left").style.zIndex = "1";
        document.getElementById("right").style.zIndex = "1";
        document.getElementById("msg-box").style.zIndex = "2";
        menu = 0;
    }
});


function start() {
    // Allows the game character to move left
    function moveLeft() {
        let move = parseInt(window.getComputedStyle(gamer).getPropertyValue("left"));
        move -= 100;
        if (move >= 0) {
            gamer.style.left = move + "px";
        }
    }

    // Allows the game character to move right
    function moveRight() {
        let move = parseInt(window.getComputedStyle(gamer).getPropertyValue("left"));
        move += 100;
        if (move < 300) {
            gamer.style.left = move + "px";
        }

    }

    // Event listener that checks if left or right keys are pressed.
    document.addEventListener("keydown", event => {
        if (event.key === "ArrowLeft") {
            moveLeft();
        }
        if (event.key === "ArrowRight") {
            moveRight();
        }
    });

    //Randomise the columns which the obstacle slides down from
    var obstacle = document.getElementById("obstacle");
    var count = 0;
    obstacle.addEventListener('animationiteration', () => {
        var random = Math.floor(Math.random() * 3);
        let move = random * 100;
        obstacle.style.left = move + "px";
        count++;
    });

    //Sets an interval to check if the obstacle hits the gamer
    setInterval(function () {
        var gamerLeft = parseInt(window.getComputedStyle(gamer).getPropertyValue("left"));
        var obstacleLeft = parseInt(window.getComputedStyle(obstacle).getPropertyValue("left"));
        var obstacleTop = parseInt(window.getComputedStyle(obstacle).getPropertyValue("top"));
        if (gamerLeft == obstacleLeft && obstacleTop < 500 && obstacleTop > 300) {
            obstacle.style.animation = "none";

            // Creates the pop-up message to indicate game over            
            document.querySelector("#game-over").innerHTML = "Game Over! Score: " + count;
            document.querySelector("#msg-box").style.display = "flex";
        }

    }, 1);

    //Checks for the touch screen inputs and calls the functions to move left/right
    document.getElementById("left").addEventListener("touchstart", moveLeft);
    document.getElementById("right").addEventListener("touchstart", moveRight);
}

//game over reset button
function gameover() {
    window.location.reload();
}