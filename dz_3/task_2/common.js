/**
 * Created by kesha-kh on 10.06.15.
 */

/*send request*/
function send(type,element) {
    var req = new XMLHttpRequest();
    req.open(type , 'https://cors-test.appspot.com/test', true);
    req.addEventListener('readystatechange', function(e){
        if ((req.readyState == 4) && (req.status == 200)) {
            console.log(JSON.parse(req.response));
            if (JSON.parse(req.response).status == 'ok'){
                element.textContent = 'OK';
                element.style.color = 'green';
                element.style.fontWeight = 'bold';
            }else {
                element.textContent = 'Failed';
                element.style.color = 'red';
                element.style.fontWeight = 'bold';
            }
        }
    });
    req.addEventListener("error", function(e){
        element.textContent = 'Failed';
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