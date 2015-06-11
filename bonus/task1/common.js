/**
 * Created by user on 11.06.2015.
 */

/* dat funct*/
function handleClickOutside(element, fn){
  element.addEventListener("click", function(){
    if(event.target != element) {

    }
    console.log(event);
  });
}

/**/
function draw(element) {
  element.style.background = "rgba(90,0,0,0.3)";
}

/* init function*/
document.addEventListener('DOMContentLoaded', function(event) {
  var divs = document.querySelectorAll("div");
  for(var i = 0; i < divs.length;i++){
    handleClickOutside(divs[i], draw);
  }
});