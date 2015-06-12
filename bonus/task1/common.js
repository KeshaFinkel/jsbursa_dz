/**
 * Created by user on 11.06.2015.
 */

/* dat funct*/
function handleClickOutside(element, fn){
  document.querySelector('body').addEventListener('click',function(event){
    if(event.target!==element){
      fn.call();
    }
  });
}

/**/
function draw() {
  console.log("function called");
}

/* init function*/
document.addEventListener('DOMContentLoaded', function(event) {
  var divs = document.querySelectorAll("div");
  for(var i = 0; i < divs.length;i++){
    handleClickOutside(divs[i], draw);
  }
});