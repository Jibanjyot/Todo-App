let todoItemsContainer = document.getElementById("todoItemsContainer");
let addTodoButton = document.getElementById("addTodoButton");
let saveTodoButton = document.getElementById("saveTodoButton");


function fetchAndStoreTodo() {
    let p = fetch("https://jsonplaceholder.typicode.com/todos")
    p.then((response) => {
        if (!response.ok) {
            throw new Error('Network response was not OK');
        }
        console.log(response.status);
        console.log(response.ok);
        return response.json();
    }).then(data => {
        // console.log(data);
        data.forEach(e => {
            todosCount = todosCount + 1;
            let newTodo = {
                text: e['title'],
                uniqueNo: todosCount,
                isChecked: false
            };
            // todoList.push(newTodo);
            createAndAppendTodo(newTodo);
            console.log(e['title']);
        });
        return data;
    })
        .catch(error => {
            console.error('Error:', error);
        });

}



function getTodoListFromLocalStorage() {
    let stringifiedTodoList = localStorage.getItem("todoList");
    let parsedTodoList = JSON.parse(stringifiedTodoList);
    if (parsedTodoList === null) {
        return [];
    } else {
        return parsedTodoList;
    }
}

let todoList = getTodoListFromLocalStorage();

if(!todoList.length){
    fetchAndStoreTodo();
}

let todosCount = todoList.length;

saveTodoButton.onclick = function () {
    localStorage.setItem("todoList", JSON.stringify(todoList));
    let popUpMessage = document.getElementById("popUpMessage");
    popUpMessage.textContent = "Hurrah , Everything has been saved! Lets complete what is left of the day";
};

function onAddTodo() {
    let userInputElement = document.getElementById("todoUserInput");
    let userInputValue = userInputElement.value;

    if (userInputValue === "") {
        alert("Enter Valid Text");
        return;
    }

    todosCount = todosCount + 1;

    let newTodo = {
        text: userInputValue,
        uniqueNo: todosCount,
        isChecked: false
    };
    todoList.push(newTodo);
    createAndAppendTodo(newTodo);
    userInputElement.value = "";
}

addTodoButton.onclick = function () {
    onAddTodo();
};

function onTodoStatusChange(checkboxId, labelId, todoId) {
    let checkboxElement = document.getElementById(checkboxId);
    let labelElement = document.getElementById(labelId);
    labelElement.classList.toggle("checked");

    let todoItemIndex = todoList.findIndex(function (eachTodo) {
        let eachTodoId = "todo" + eachTodo.uniqueNo;

        if (eachTodoId === todoId) {
            return true;
        } else {
            return false;
        }
    });
    console.log(todoItemIndex);

    let todoObject = todoList[todoItemIndex];
    if (todoObject.isChecked === true) {
        todoObject.isChecked = false;
    } else {
        todoObject.isChecked = true;
    }
}

function onDeleteTodo(todoId) {
    let todoElement = document.getElementById(todoId);
    todoItemsContainer.removeChild(todoElement);

    let deleteElementIndex = todoList.findIndex(function (eachTodo) {
        let eachTodoId = "todo" + eachTodo.uniqueNo;
        if (eachTodoId === todoId) {
            return true;
        } else {
            return false;
        }
    });

    todoList.splice(deleteElementIndex, 1);
}


function onEditTodo(labelId, todoId) {
    let todoElement = document.getElementById(labelId);
    let text = todoElement.innerText;
    var input = document.createElement("input");
    input.type = "text";
    input.value = text;

    todoElement.innerText = "";
    todoElement.appendChild(input);

    input.focus();

    document.addEventListener("click", function (event) {
        var container = document.getElementById(todoId);
        let editElement = todoList.find(function (eachTodo) {
            let eachTodoId = "todo" + eachTodo.uniqueNo;
            if (eachTodoId === todoId) {
                // eachTodo['text'] = input.value;
                return true;
            } else {
                return false;
            }
        });
        console.log(editElement);
        editElement.text = input.value;
        console.log(todoList);
        if (!container.contains(event.target)) {
            todoElement.innerText = input.value;
        }
    });



    // todoList.splice(deleteElementIndex, 1);
}

function createAndAppendTodo(todo) {
    let todoId = "todo" + todo.uniqueNo;
    let checkboxId = "checkbox" + todo.uniqueNo;
    let labelId = "label" + todo.uniqueNo;

    let todoElement = document.createElement("li");
    todoElement.classList.add("todo-item-container", "d-flex", "flex-row");
    todoElement.id = todoId;
    todoItemsContainer.appendChild(todoElement);

    let inputElement = document.createElement("input");
    inputElement.type = "checkbox";
    inputElement.id = checkboxId;
    inputElement.checked = todo.isChecked;

    inputElement.onclick = function () {
        onTodoStatusChange(checkboxId, labelId, todoId);
    };

    inputElement.classList.add("checkbox-input");
    todoElement.appendChild(inputElement);

    let labelContainer = document.createElement("div");
    labelContainer.classList.add("label-container", "d-flex", "flex-row");
    todoElement.appendChild(labelContainer);

    let labelElement = document.createElement("label");
    labelElement.setAttribute("for", checkboxId);
    labelElement.id = labelId;
    labelElement.classList.add("checkbox-label");
    labelElement.textContent = todo.text;
    if (todo.isChecked === true) {
        labelElement.classList.add("checked");
    }
    labelContainer.appendChild(labelElement);

    let editIconContainer = document.createElement("div");
    editIconContainer.classList.add("delete-icon-container");
    labelContainer.appendChild(editIconContainer);

    let editIcon = document.createElement("i");
    editIcon.classList.add("fas", "fa-edit", "edit-icon");

    editIcon.onclick = function () {
        onEditTodo(labelId, todoId);
    };

    editIconContainer.appendChild(editIcon);


    let deleteIconContainer = document.createElement("div");
    deleteIconContainer.classList.add("delete-icon-container");
    labelContainer.appendChild(deleteIconContainer);

    let deleteIcon = document.createElement("i");
    deleteIcon.classList.add("far", "fa-trash-alt", "delete-icon");

    deleteIcon.onclick = function () {
        onDeleteTodo(todoId);
    };

    deleteIconContainer.appendChild(deleteIcon);
}

for (let todo of todoList) {
    createAndAppendTodo(todo);
}