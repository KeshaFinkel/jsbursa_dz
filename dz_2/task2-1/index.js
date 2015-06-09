var tasks = [];
/*add task function*/
function add_task(event){
    if (document.querySelector('input[type=text]').value) {
        var task_text = document.querySelector('input[type=text]').value;
        tasks.push(task_text);
        tasks.sort();
        document.querySelector('ul').innerHTML = '';
        for (var i=0;i < tasks.length; i++) {
            render_task(tasks[i]);
        }
        window.localStorage.setItem('tasks',JSON.stringify(tasks));
        document.querySelector('input[type=text]').value = '';
    }
}
/*append task to ul with tasks*/
function render_task(text) {
    var task = document.createElement('li');
    task.textContent = text;
    document.querySelector('ul').appendChild(task);
}
/*call addtask on 'enter'*/
function add_task_press(event){
    if (event.keyCode == 13) {
        add_task();
    }
}

/* get function*/
function get_tasks(){
    if (localStorage.getItem('tasks')) {
        tasks = JSON.parse(localStorage.getItem('tasks'));
        for (var i=0;i < tasks.length; i++) {
            render_task(tasks[i]);
        }
    }
}
/* init function*/
document.addEventListener('DOMContentLoaded', function(event) {
    get_tasks();
    document.querySelector('button').addEventListener('click',add_task);
    document.querySelector('input').addEventListener('keypress',add_task_press);
});