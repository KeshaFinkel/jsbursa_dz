var tasks = [];
/*add task function*/
function add_task(event){
    if (document.querySelector("input[type=text]").value) {
        var task_text = document.querySelector("input[type=text]").value;

        render_task(task_text);
        tasks.push(task_text);
        tasks.sort();
        window.localStorage.setItem('tasks',JSON.stringify(tasks));
        document.querySelector("input[type=text]").value = "";
    }
}
/*append task to ul with tasks*/
function render_task(text) {
    var task = document.createElement("li");

    task.innerHTML = text;
    document.querySelector("ul").appendChild(task);
}
/*call addtask on "enter"*/
function add_task_press(event){
    if (event.keyCode == 13) {
        add_task();
    }
}

/* get function*/
function get_tasks(){
    if (localStorage.tasks) {
        tasks = JSON.parse(localStorage.tasks);
        for (var i=0;i < tasks.length; i++) {
            render_task(tasks[i]);
        }
    } else {
        console.log("asd");
    }
}
/* init function*/
document.addEventListener("DOMContentLoaded", function(event) {
    get_tasks();
    document.querySelector("button").addEventListener("click",add_task);
    document.querySelector("input").addEventListener("keypress",add_task_press);
});