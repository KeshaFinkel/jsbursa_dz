var input_1 = document.createElement("input"),
    input_2 = document.createElement("input"),
    button = document.createElement("button"),
    result = document.createElement("div");
result.id = "result";
button.innerHTML = "Посчитать";
button.addEventListener("click",validate);

/*render html*/
function renter_html() {
    document.querySelector("body").appendChild(input_1);
    document.querySelector("body").appendChild(input_2);
    document.querySelector("body").appendChild(button);
}
/*add error function*/
function error(element) {
    var check = (/(^[\d]+[.]?[\d]+$)|(^\d+$)/);
    if(!(check.test(element.value))) {
        if (!(element.nextSibling.classList.contains("error-message"))) {
            var error = document.createElement("div");
            error.className = "error-message";
            error.innerHTML = "Это не число";
            element.parentNode.insertBefore(error, element.nextSibling);
        }
        return false;
    } else {
        if (element.nextSibling.classList.contains("error-message")) {
            element.parentNode.removeChild(element.nextSibling);
        }
        return true;
    }
}
/*validate function*/
function validate(){
    result.innerHTML = "";
    if(error(input_1) && error(input_2)){
        result.innerHTML = Number(input_1.value) + Number(input_2.value);
        document.querySelector("body").appendChild(result);
    }
}

/* init function*/
function init(){
    renter_html();
}
document.addEventListener("DOMContentLoaded", function(event) {
    init();
});
