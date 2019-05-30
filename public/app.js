//document.querySelector()
// Returns the first element within the document that matches the specified selector or group of selectors
//e.g. var title = document.querySelector('#title');

/*
appendChild() -> adds a node to the end of the list of children of a specified parent node
removeChild() -> removes a child node from the DOM
createElement() -> creates the HTML elements specified by tagName
firstChild -> read-only property returns the node's first child in the tree
*/

// Step 1 -> create variables `form`, `todosList`, `button`, `input`
    // to target the form, unordered list, button and input.

var form = document.querySelector('form');
var todoList = document.getElementById('taskList');
var button = document.getElementById('clear');
var taskName = document.getElementById('user-todo');
var description = document.getElementById('user-description');

class Task {
    constructor(id, name, description){
        this.id = id,
        this.name = name.value,
        this.description = description.value,
        this.creationDate = new Date(),
        this.status = 'to do'
    }
}

//var todosArray = []; //used for localStorage will delete all data D:

var todosArray = localStorage.getItem('todos') ? JSON.parse(localStorage.getItem('todos')) : []; // ? is a conditional. Whatever comes after is what we do when statement is true. everything after : is what we do when the condition is false. If false, set to empty array
localStorage.setItem('todos', JSON.stringify(todosArray)); //local storage works with strings, so we need to stringify any object/data we send to the browser
var storage = JSON.parse(localStorage.getItem('todos'));//to get data from storage, we have to convert the string format into JS objects. We do this with JSON.parse

form.addEventListener('submit', function(event) {
    
      event.preventDefault(); //will keep the page from refreshing (refreshing is the default action)

      var task = new Task(todosArray.length + 1, taskName, description);
      addTask(task);
    //   todosArray.push(task);
    //    //put value in array in local storage
    //    localStorage.setItem('todos', JSON.stringify(todosArray));
    //   todoMaker(task);
    //   console.log(task);
      name.value = '';
      description.value = '';
    })
    
function todoMaker(taskInfo) {
    
    var todoItem = document.createElement('div');
    
    console.log(taskInfo);
    
    todoItem.innerHTML = '<strong>' + taskInfo.name + '</strong><br><br>' + taskInfo.description + '<br><br>' + taskInfo.creationDate + '<br>' + 'Status: ' + taskInfo.status;   
    todoItem.setAttribute('class', 'listItem');
    todoList.appendChild(todoItem);

}


button.addEventListener('click', function() {

    //clear localstorage
    localStorage.clear();

    //while loop to empty todoList
    while (todoList.firstChild) {
        todoList.removeChild(todoList.firstChild);
    }
})

//AJAX**********************************

//display list items as found in server storage
function getList() {
    
    $.ajax({
        type: 'GET',
        url:'/api/tasks/',
        dataType: 'text',
        success: function(response) {
            console.log(response);
            var myArr = JSON.parse(response);
            for(i=0;i<myArr.length;i++){
                
                var myObj = myArr[i];
                todoMaker(myObj);
            }
        }
    });

}

//Add task to the server storage
function addTask(taskObj) {

    $.ajax({
        type: 'POST',
        url:'/api/tasks/',
        data: {"name": taskObj.name, "description": taskObj.description},
        dataType: 'text',
        success: function(response) {
            var myObj = JSON.parse(response);
            todoMaker(myObj);
        }
            
    });

}




