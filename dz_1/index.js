var player ="x";

/* begin new game */
function newGame(){
    var cell = document.getElementsByClassName("cell");
    for (var i=0;i<9;i++){
        cell[i].classList.remove("x","o");
        cell[i].addEventListener("click",turn);
    }
    player = "x";
}
/* toggling player*/
function playerToggle(){
    if (player == "x") {
        player = "o";
    } else {
        player = "x";
    }
}
/* remove listeners when game over*/
function gameOver(){
    var cell = document.getElementsByClassName("cell");
    for (var i=0;i<9;i++){
        cell[i].removeEventListener("click",turn);
    }

}
/* making turn*/
function turn(event){
    event.target.classList.add(player);
    event.target.removeEventListener("click",turn);
    playerToggle();
    if(getWinner()){
        gameOver();
        if (getWinner()=="x") {
            document.querySelector("div.winner-message").innerHTML = "Крестик победил"
        } else {
            document.querySelector("div.winner-message").innerHTML = "Нолик победил";
        }
    }
}
/*init*/
document.addEventListener("DOMContentLoaded", function(event) {
    document.getElementsByClassName("startNewGame")[0].addEventListener("click",function(){newGame()});
});



