/* init function*/
window.addEventListener('load', function() {
    'use strict';

    var input1 = document.createElement('input');
    var input2 = document.createElement('input');
    var button = document.createElement('button');
    var result = document.createElement('div');

    /*render html*/
    function renterHtml() {
        document.querySelector('body').appendChild(input1);
        document.querySelector('body').appendChild(input2);
        document.querySelector('body').appendChild(button);
    }
    /*add error function*/
    function error(element) {
        var check = (/(^[\d]+[.]?[\d]+$)|(^\d+$)/);
        if (!(check.test(element.value))) {
            if (!(element.nextSibling.classList.contains('error-message'))) {
                var error = document.createElement('div');
                error.className = 'error-message';
                error.innerHTML = 'Это не число';
                element.parentNode.insertBefore(error, element.nextSibling);
            }
            return false;
        } else {
            if (element.nextSibling.classList.contains('error-message')) {
                element.parentNode.removeChild(element.nextSibling);
            }
            return true;
        }
    }
    /*validate function*/
    function validate(){
        var flag_1 = error(input1),
            flag_2 = error(input2);
        if (document.querySelector('#result')){
            result.parentNode.removeChild(result);
        }

        if (flag_1 && flag_2) {
            result.innerHTML = Number(input1.value) + Number(input2.value);
            document.querySelector('body').appendChild(result);
        }
    }

    result.id = 'result';
    button.innerHTML = 'Посчитать';
    button.addEventListener('click', validate);

    renterHtml();
});
