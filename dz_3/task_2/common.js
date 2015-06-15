/**
 * Created by kesha-kh on 10.06.15.
 */

/*send request*/
function send(type, element) {
  'use strict';
  var req = new XMLHttpRequest();
  req.open(type, 'http://cors-test.appspot.com/test', true);
  req.addEventListener('readystatechange', function rsc() {
    if ((req.status === 200) && (req.readyState === 4)) {
      if (JSON.parse(req.response).status === 'ok') {
        element.textContent = 'OK';
        element.style.color = 'green';
        element.style.fontWeight = 'bold';
      } else {
        element.textContent = 'Failed';
        element.style.color = 'red';
        element.style.fontWeight = 'bold';
      }
    } else if (req.readyState === 4) {
      element.textContent = 'Failed';
      element.style.color = 'red';
      element.style.fontWeight = 'bold';
    }
  });
  req.send(null);
}


/* render*/
function render(element) {
  'use strict';
  var type = element.className.toUpperCase();
  send(type, element);
}
/*init*/
window.addEventListener('load', function init() {
  'use strict';
  var i;
  var spans = document.querySelectorAll('span');
  for (i = 0; i < spans.length; i++) {
    render(spans[i]);
  }
});

