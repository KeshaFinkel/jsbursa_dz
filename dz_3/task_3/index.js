/*websocket connect*/
function connectW(url, onMessage) {
  var socket = new WebSocket(url);
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
/*add Game to list*/
function addGame(id) {
  var li = document.createElement('li');

  li.id = "id"+ String(id).slice(2);
  li.innerHTML = '<b>ID:</b>'+ id;
  document.querySelector('.existing-games').appendChild(li);
}
/*remove game*/
function removeGame(id) {
  document.querySelector('.existing-games').removeChild(document.querySelector('#id'+String(id).slice(2)));
}
/*gameslist*/
function gamesList(e) {
  var data = JSON.parse(e.data);
  console.log(data);
  if (data.action === 'add') {
    addGame(data.id);
  }
  if (data.action === 'remove') {
    removeGame(data.id);
  }
  if (data.action === 'startGame') {
    console.log('fuck we started!');
  }
  if (data.error) {
    console.log('error:' + data.error);
  }
}
/*game create*/
function gameCreate(type) {
  var req = new XMLHttpRequest();
  req.open(type , gameUrls.newGame, true);
  req.addEventListener('readystatechange', function(e){
    if ((req.readyState == 4) && (req.status == 200)) {
      console.log(req);
    }
  });
  req.send(null);
}

/*init*/
window.addEventListener('load', function() {
  connectW(gameUrls.list,gamesList);
});
