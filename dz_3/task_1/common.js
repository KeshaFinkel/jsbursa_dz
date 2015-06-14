/**
 * Created by user on 09.06.2015.
 */

/*adding script on page*/
function addScript(src) {
  'use strict';
  var elem = document.createElement('script');
  elem.src = src;
  document.head.appendChild(elem);
}
/*ask server*/
function ask(event) {
  'use strict';
  var name = event.target.value;
  var url = 'http://en.wikipedia.org/w/api.php?action=parse&page=' + name + '&prop=text&section=0&format=json&callback=recieve';
  addScript(url);
}

/*recieve data*/
function recieve(data) {
  'use strict';
  var x = data.parse.text['*'];
  document.querySelector('#content').innerHTML = x;
}

/*init*/
window.addEventListener('load', function init() {
  'use strict';
  document.querySelector('input').addEventListener('change', ask);
});

