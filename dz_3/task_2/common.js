/**
 * Created by kesha-kh on 10.06.15.
 */

/*send request*/
function send(type,element) {
    var req = new XMLHttpRequest();
    req.open(type , 'https://cors-test.appspot.com/test', true);
    req.addEventListener('readystatechange', function(e){
        if ((req.readyState == 4) && (req.status == 200)) {
            if (JSON.parse(req.response)){
                element.innerHTML = 'OK';
                element.style.color = 'green';
                element.style.fontWeight = 'bold';
            }else {
                element.innerHTML = 'Failed';
                element.style.color = 'red';
                element.style.fontWeight = 'bold';
            }
        }
    });
    req.addEventListener("error", function(e){
        element.innerHTML = 'Failed';
        element.style.color = 'red';
        element.style.fontWeight = 'bold';
    });
    req.send(null);
}


/* render*/
function render(element){
    var type = element.className;
    send(type,element);
}
/*init*/
window.addEventListener('load', function () {
    var spans = document.querySelectorAll('span');
    for(var i=0; i<spans.length; i++){
        render(spans[i]);
    }
});