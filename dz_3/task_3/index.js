/*global vars*/
var socket;
var gameState = {
  player: '',
  game: '',
  side: '',
  enemy: '',
  move: 101,
  won: false
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
}

/*request send function*/
function sendReq(type, url, data, onSuc, onErr,headers) {
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
  if (headers === true){
    req.setRequestHeader('GAME-ID', String(gameState.game));
    req.setRequestHeader('PLAYER-ID', String(gameState.player));
  }
  req.send(data);
  req.addEventListener('readystatechange',onSuc);
}

/*--gamelist render---*/
/*add Game to list*/
function addGame(id) {
  var li = document.createElement('li');
  li.id = id;
  li.innerHTML = id;
  document.querySelector('.existing-games').appendChild(li);
}
/*remove game*/
function removeGame(id) {
  document.querySelector('.existing-games').removeChild(document.getElementById(id));
}
/*----gameplay----*/
/*---listen functions---*/
/*listen succes*/
function listenSuc(event){
  var req = event.target;
  if ((req.readyState === 4) && (req.status === 200)) {
    if (JSON.parse(req.response).move) {
      gameState.move = JSON.parse(req.response).move - 1;
      document.querySelectorAll('.cell')[gameState.move].classList.add(gameState.enemy);
      document.querySelector('.field').addEventListener('click', turn);
    }
    if (JSON.parse(req.response).win) {
      console.log(JSON.parse(req.response).win);
      document.querySelectorAll('.status-message')[1].textContent = JSON.parse(req.response).win;
      document.querySelectorAll('.newGame').textContent = 'Новая игра';
      gameState.won = true;
    }
  } else if((req.readyState === 4) && (req.status !== 410)){
    listen();
  }
}
/*listen*/
function listen(){
  sendReq('GET',gameUrls.move,null,listenSuc,listen,true);
}
/*---turn functions---*/
/*turn succes*/
function turnSuc(event) {
  var req = event.target;
  if ((req.readyState === 4) && (req.status === 200)) {
    console.log(Number(gameState.move));
    document.querySelectorAll('.cell')[gameState.move].classList.add(gameState.side);
    document.querySelector('.field').removeEventListener('click',turn);
    if(JSON.parse(req.response).win) {
      document.querySelectorAll('.status-message')[1].textContent = JSON.parse(req.response).win;
      document.querySelectorAll('.newGame').textContent = 'Новая игра';
      gameState.won = true;
    } else {
      listen();
    }
  } else if (req.readyState === 4) {
    document.querySelector('.field').removeEventListener('click',turn);
    document.querySelectorAll('.status-message')[1].textContent = JSON.parse(req.response).message || 'Неизвестная ошибка';
  }
}
/*turn error*/
function turnErr(event) {
  document.querySelector('.status-message').textContent = event.target.response || 'неизвестная ошибка';
  console.log(event.target.response);
}
/* make turn */
function turn(event){
  var number = event.target.dataset.number;
  var daMove = {'move': number};
  gameState.move = number - 1;
  event.stopPropagation();
  sendReq('POST',gameUrls.move,JSON.stringify(daMove),turnSuc,turnErr,true);
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

/*newgamebutton*/
/*onsuccess*/
function buttSuc(event){
  var req = event.target;
  if ((req.readyState === 4) && (req.status === 200)) {
    document.querySelector(".startGame").style.display = "block";
    document.querySelector(".mainGame").style.display = "none";
    document.querySelector('.createGame').disabled = false;
    document.querySelector('.status-message').textContent = 'Ошибка создания игры';
  } else if (req.readyState === 4) {
    document.querySelector('.field').removeEventListener('click',turn);
    document.querySelectorAll('.status-message')[1].textContent = JSON.parse(req.response).message || 'Неизвестная ошибка';
  }
}
/*onclick*/
function newButt(){
  if (gameState.won === true) {
    document.querySelector(".startGame").style.display = "block";
    document.querySelector(".mainGame").style.display = "none";
    document.querySelector('.createGame').disabled = false;
    document.querySelector('.status-message').textContent = 'Ошибка создания игры';
  } else {
    sendReq('PUT',gameUrls.surrender,null,buttSuc,null,true);
  }
}
/*-----game lobby functions------*/
/*start succes*/
function startSuc(event){
  var req = event.target;
  if ((req.readyState === 4) && (req.status === 200)) {
    gameState.side = JSON.parse(req.response)['side'];
    if (gameState.side == 'x') {
      gameState.enemy = 'o';
    } else {
      gameState.enemy = 'x';
    }
    gameState.won = false;
    document.querySelector('.newGame').textContent = 'Сдаться';
    draw_field();
    document.querySelector(".startGame").style.display = "none";
    document.querySelector(".mainGame").style.display = "block";
    if (gameState.side === 'x'){
      document.querySelector('.field').addEventListener('click',turn);
    } else {
      listen();
    }
  } else if (req.readyState === 4) {
    document.querySelector('.createGame').disabled = false;
    if (req.status === 410) {
      document.querySelector('.status-message').textContent = 'Ошибка старта игры: другой игрок не ответил';
    } else {
      document.querySelector('.status-message').textContent = 'Неизвестная ошибка старта игры';
    }
  }
}
/*start error*/
function startErr(event){
  var req = event.target;
  if ((req.readyState === 4) && (req.status !== 200)) {
    document.querySelector('.createGame').disabled = false;
    document.querySelector('.status-message').textContent = 'Ошибка';
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
  sendReq('POST', gameUrls.gameReady, JSON.stringify(data),startSuc,startErr);
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
  } else if(req.readyState === 4){
    document.querySelector('.createGame').disabled = false;
    document.querySelector('.status-message').textContent = 'Ошибка создания игры';
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
function eReg(event){
  var req = event.target;
  if ((req.readyState === 4) && (req.status !== 200)) {
    document.querySelector('.createGame').disabled = false;
    document.querySelector('.status-message').textContent = 'Ошибка создания игры';
  }
}
/*game create*/
function gameCreate() {
  document.querySelector('.createGame').disabled = true;
  sendReq('POST', gameUrls.newGame,null,gReg);
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
    document.querySelector('.status-message').textContent = 'Ошибка создания игры';
    document.querySelector('.createGame').disabled = false;
  }
}

/*init*/
window.addEventListener('load', function() {
  connectW(gameUrls.list,gamesList);
  document.querySelector('.createGame').addEventListener('click',gameCreate);
  document.querySelector('.existing-games').addEventListener('click',gRegC);
  document.querySelector('.newGame').addEventListener('click',newButt);
});
