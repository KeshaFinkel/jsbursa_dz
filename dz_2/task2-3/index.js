var player ="x";

/*draw field*/
function draw_field(x){
    for(var i=0;i<x;i++){
        var row = document.createElement("div");
        row.className = "row";
        for(var j=0;j<x;j++){
            var cell = document.createElement("div");
            cell.className = "cell";
            cell.setAttribute("data-x",j);
            cell.setAttribute("data-y",i);
            row.appendChild(cell);
        }
        document.querySelector(".field").appendChild(row);
    }
    document.querySelector(".startGame").style.display = "none";
    document.querySelector(".mainGame").style.display = "block";
    newGame();
}
/*clear field*/
function kill_field(){
    document.querySelector(".field").innerHTML = "";
}

/*start game*/
function start_game(){
    var size = Number(document.querySelector(".count").value);
    document.querySelector(".error-message").innerText = "";
    kill_field();

    if (size == size) {
        if (size < 16 && size > 4) {
            draw_field(size);
        } else {
           document.querySelector(".error-message").innerText = "Вы ввели некорректное число";
        }
    } else {
        document.querySelector(".error-message").innerText = "Вы ввели некорректное число";
    }
}
/*begin new game*/
function newGame(){
    var cell = document.getElementsByClassName("cell");
    for (var i=0;i<cell.length;i++){
        cell[i].classList.remove("x","o");
        cell[i].addEventListener("click",turn);
    }
    player = "x";
}
/*player toggle*/
function playerToggle(){
    if (player == "x") {
        player = "o";
    } else {
        player = "x";
    }
}

/* making turn*/
function turn(event){
    event.target.classList.add(player);
    event.target.removeEventListener("click",turn);
    playerToggle();
    /*if(getWinner()){
        gameOver();
        if (getWinner()=="x") {
            document.querySelector("div.winner-message").innerHTML = "Крестик победил"
        } else {
            document.querySelector("div.winner-message").innerHTML = "Нолик победил";
        }
    }*/
}

/*init*/
window.addEventListener('load', function () {
    document.querySelector(".generateField").addEventListener("click",start_game);
});