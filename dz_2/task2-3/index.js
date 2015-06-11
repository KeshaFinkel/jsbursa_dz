window.addEventListener('load', function () {
    var game = {
        field: [],
        player:"x"
    };

    /*draw field*/
    function draw_field(x){
        for(var i=0;i<x;i++){
            var row = document.createElement("div");
            row.className = "row";
            if(game.field[i]) {
            } else {
                game.field[i]= [];
            }
            for(var j=0;j<x;j++){
                var cell = document.createElement("div");
                cell.classList.add("cell");
                cell.setAttribute("data-x",j);
                cell.setAttribute("data-y",i);

                if(game.field[i][j]){
                    cell.classList.add(game.field[i][j]);
                } else {
                    game.field[i][j]= null;
                    cell.addEventListener("click",turn);
                }

                row.appendChild(cell);
            }
            document.querySelector(".field").appendChild(row);
        }
        window.localStorage.setItem('game',JSON.stringify(game));
    }
    /*clear field*/
    function kill_field(){
        document.querySelector(".field").innerHTML = "";
        document.querySelector(".winner-message").innerHTML = "";
        game = {
            field: [],
            player:"x"
        };
        localStorage.removeItem('game');
    }

    /*start game*/
    function start_game(){
        var size = Number(document.querySelector(".count").value),
          check = (/^\d+$/);
        document.querySelector(".error-message").innerHTML = "";

        if (check.test(size)) {
            if (size < 16 && size > 4) {
                draw_field(size);
                document.querySelector(".startGame").style.display = "none";
                document.querySelector(".mainGame").style.display = "block";
            } else {
                document.querySelector(".error-message").innerHTML = "Вы ввели некорректное число";
            }
        } else {
            document.querySelector(".error-message").innerHTML = "Вы ввели некорректное число";
        }
    }
    /*begin new game*/
    function newGame(){
        document.querySelector(".startGame").style.display = "block";
        document.querySelector(".mainGame").style.display = "none";
        kill_field();
    }
    /*player toggle*/
    function playerToggle(){
        if (game.player == "x") {
            game.player = "o";
        } else {
            game.player = "x";
        }
    }

    /* making turn*/
    function turn(event){
        var turn_x = event.target.dataset.x,
          turn_y = event.target.dataset.y;

        game.field[turn_y][turn_x] = game.player;

        event.target.classList.add(game.player);
        event.target.removeEventListener("click",turn);
        playerToggle();

        window.localStorage.setItem('game',JSON.stringify(game));
        if(getWinner()){
            gameOver();
            if (getWinner()=="x") {
                document.querySelector("div.winner-message").innerHTML = "Крестик победил"
            } else {
                document.querySelector("div.winner-message").innerHTML = "Нолик победил";
            }
        }
    }

    /* remove listeners when game over*/
    function gameOver(){
        var cell = document.getElementsByClassName("cell");
        for (var i=0;i<cell.length;i++){
            cell[i].removeEventListener("click",turn);
        }
    }

    if (localStorage.game) {
        game = JSON.parse(localStorage.game);
        draw_field(game.field[0].length);
        document.querySelector(".startGame").style.display = "none";
        document.querySelector(".mainGame").style.display = "block";
        if(getWinner()){
            gameOver();
            if (getWinner()=="x") {
                document.querySelector("div.winner-message").innerHTML = "Крестик победил"
            } else {
                document.querySelector("div.winner-message").innerHTML = "Нолик победил";
            }
        }
    }
    document.querySelector(".generateField").addEventListener("click",start_game);
    document.querySelector(".startNewGame").addEventListener("click",newGame);
});