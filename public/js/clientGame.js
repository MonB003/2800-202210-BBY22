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
        move = random * 100;
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
            let body = document.body;
            let msgBox = document.createElement("div");
            msgBox.setAttribute("ID", "msg-box");
            body.appendChild(msgBox);

            let msg = document.createElement("h3");
            msg.setAttribute("ID", "game-over");
            msg.innerHTML = "Game Over! Score: " + count;
            msgBox.appendChild(msg);

            let submit = document.createElement("input");
            submit.setAttribute("type", "submit");
            submit.setAttribute("ID", "submit");
            submit.setAttribute("value", "OK");
            submit.setAttribute("onclick", "gameover()");
            msgBox.appendChild(submit);
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