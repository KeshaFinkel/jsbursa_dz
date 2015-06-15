/*global vars*/
var socket;
var gameState = {
  player: '',
  game: '',
  side: '',
  turn: 'x',
  turns: ''
}
/*---request and socket---*/
/*websocket connect*/
function connectW(url, onMessage) {
  socket = new WebSocket(url)
  socket.onopen = function() {
    console.log('Соединение установлено.');
  };

  socket.onclose = function(event) {
    if (event.wasClean) {
      console.log('Соединение закрыто чисто');
    } else {
      console.log('Обрыв соединения'); // например, 'убит' процесс сервера
    }
    console.log('Код: ' + event.code + ' причина: ' + event.reason);
  };

  socket.onmessage = onMessage;

  socket.onerror = function(error) {
    console.log('Ошибка ' + error.message);
  };
}

/*request send function*/
function sendReq(type, url, data, onSuc, onErr) {
  var req = new XMLHttpRequest();
  onSuc = onSuc || function sucDef(e){
    if ((req.readyState === 4) && (req.status === 200)) {
      console.log('suc',req);
    }
  };

  onErr = onErr || function errDef(e){
    if ((req.readyState === 4) && (req.status !== 200)) {
      console.log('err',req);
    }
  };
  req.open(type, url, true);
  if (data !== null) {
    req.setRequestHeader('Content-Type', 'application/json');
  }
  req.send(data);
  req.addEventListener('readystatechange',onSuc);
}

/*--gamelist render---*/
/*add Game to list*/
function addGame(id) {
  var li = document.createElement('li');
  li.id = id;
  li.innerHTML = '<b>ID:</b>' + id;
  document.querySelector('.existing-games').appendChild(li);
}
/*remove game*/
function removeGame(id) {
  document.querySelector('.existing-games').removeChild(document.getElementById(id));
}

/* make turn */
function turn(event){
  var number = event.target.dataset.number;
}
/*----render field----*/
function draw_field() {
  var i;
  var j;
  var cell;
  var row;
  for (i = 0; i < 10; i++) {
    row = document.createElement("div");
    row.className = "row";
    for (j = 0; j < 10; j++) {
      cell = document.createElement("div");
      cell.classList.add("cell");
      cell.setAttribute("data-number", (i)*10 + j+1);
      cell.addEventListener("click", turn);
      row.appendChild(cell);
    }
    document.querySelector(".field").appendChild(row);
  }
}


/*-----game lobby functions------*/
/*start succes*/
function startSuc(event){
  var req = event.target;
  if ((req.readyState === 4) && (req.status === 200)) {
    gameState.side = JSON.parse(req.response)['side'];
    draw_field();
    document.querySelector(".startGame").style.display = "none";
    document.querySelector(".mainGame").style.display = "block";
  }
}

/*start game*/
function startGame(player_id){
  var data = {};
  gameState.player = player_id;
  data.game = gameState.game;
  data.player = gameState.player;
  document.querySelector('.createGame').disabled = true;
  document.querySelector('.status-message').textContent = 'Ожидаем начала игры';
  sendReq('POST', gameUrls.gameReady, JSON.stringify(data),startSuc);
}

/*game register new*/
function gReg(event){
  var req = event.target;
  var id = {};
  if ((req.readyState === 4) && (req.status === 200)) {
    id.register = JSON.parse(req.response)['yourId'];
    gameState.game = id.register;
    console.log('registernewgame',gameState);
    socket.send(JSON.stringify(id));
  }
}
/*game reg connect*/
function gRegC(event){
  var id = {};
    id.register = event.target.id;
    gameState.game = id.register;
    socket.send(JSON.stringify(id));
}
/*game register new err*/
function eReg(){
  document.querySelector('.createGame').disabled = false;
  document.querySelector('.status-message').textContent = 'Ошибка создания игры';
}
/*game create*/
function gameCreate(event) {
  document.querySelector('.createGame').disabled = true;
  sendReq('POST', gameUrls.newGame,null,gReg,eReg);
}

/*gameslist*/
function gamesList(e) {
  var data = JSON.parse(e.data);
  if (data.action === 'add') {
    addGame(data.id);
  }
  if (data.action === 'remove') {
    removeGame(data.id);
  }
  if (data.action === 'startGame') {
    console.log(data);
    startGame(data.id);
  }
  if (data.error) {
    console.log('error:' + data.error);
    document.querySelector('.status-message').textContent = data.error;
  }
}

/*init*/
window.addEventListener('load', function() {
  connectW(gameUrls.list,gamesList);
  document.querySelector('.createGame').addEventListener('click',gameCreate);
  document.querySelector('.existing-games').addEventListener('click',gRegC);
});
