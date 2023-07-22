let todoItemsContainer = document.getElementById("todoItemsContainer");
let addTodoButton = document.getElementById("addTodoButton");
let saveTodoButton = document.getElementById("saveTodoButton");



function getTodoListFromLocalStorage() {
    let stringifiedTodoList = localStorage.getItem("todoList");
    let parsedTodoList = JSON.parse(stringifiedTodoList);
    console.log(parsedTodoList);
    if (parsedTodoList === null) {
        return [];
    } else {
        return parsedTodoList;
    }
}

let todoList = getTodoListFromLocalStorage();
let sortedList = [...todoList];
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

    // get due date
    let dueDateValue = document.getElementById('dateInput').value;

    if (!dueDateValue) {
        dueDateValue = parseDueDate(userInputValue);
    }

    // get category
    let categoryValue = document.getElementById('categoryDropdown').value;

    // get priority value
    let priorityValue = document.getElementById('priorityDropdown').value;

    // store tags
    const tagsInput = document.getElementById('tagsInput');
    const tagsText = tagsInput.value.trim();
    const tags = tagsText.split(',').map(tag => tag.trim());
    tagsInput.value = "";

    todosCount = todosCount + 1;

    let newTodo = {
        text: userInputValue,
        uniqueNo: todosCount,
        dueDate: changeDateFormat(dueDateValue),
        originalDueDate: dueDateValue,
        category: categoryValue,
        priority: priorityValue,
        isChecked: false,
        tags: tags,
        reminder: false,
        subTasks: []
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


function onSubTodoStatusChange(subcheckboxId, sublabelId, subtodoId, todoId) {
    let checkboxElement = document.getElementById(subcheckboxId);
    let labelElement = document.getElementById(sublabelId);
    labelElement.classList.toggle("checked");

    for (todo of todoList) {
        if ("todo" + todo.uniqueNo === todoId) {
            for (subtodo of todo.subTasks) {
                if ("subtodo" + subtodo.id === subtodoId) {
                    if (subtodo.isChecked === true) {
                        subtodo.isChecked = false;
                    }
                    else {
                        subtodo.isChecked = true;
                    }
                    break;
                }
            }
        }
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
    todoElement.classList.add("todo-item-container");
    todoElement.setAttribute('draggable', 'true');
    todoElement.id = todoId;
    todoElement.setAttribute('ondragstart', 'onDragStart(event)');
    todoElement.addEventListener('dragstart', onDragStart);
    todoElement.addEventListener('dragover', onDragOver);
    todoElement.addEventListener('drop', onDrop);

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

    let labelPreContainer = document.createElement("div");
    labelPreContainer.classList.add("label-pre-container");
    todoElement.appendChild(labelPreContainer);

    let labelContainer = document.createElement("div");
    labelContainer.classList.add("label-container");
    labelPreContainer.appendChild(labelContainer);

    let labelElement = document.createElement("label");
    labelElement.setAttribute("for", checkboxId);
    labelElement.id = labelId;
    labelElement.classList.add("checkbox-label");
    labelElement.textContent = todo.text;
    if (todo.isChecked === true) {
        labelElement.classList.add("checked");
    }
    labelContainer.appendChild(labelElement);


    // notification button
    let notifyIconContainer = document.createElement("div");
    notifyIconContainer.classList.add("notification-icon-container");
    labelContainer.appendChild(notifyIconContainer);

    let notifyIcon = document.createElement("i");
    let notifyIconId = "notifyicon" + todo.uniqueNo;
    notifyIcon.id = notifyIconId;
    if (todo.reminder) {
        notifyIcon.classList.add("bi", "bi-bell-fill", "notification-icon");
        if (!todo.isChecked) {
            setTimeout(function () {
                alert(`Please complete the task: ${todo.text}`);
            }, 2000);
        }

    }
    else {
        notifyIcon.classList.add("bi", "bi-bell", "notification-icon");
    }

    notifyIcon.onclick = function () {
        onnotifyTodo(notifyIconId, todoId);
    };

    notifyIconContainer.appendChild(notifyIcon);


    let editIconContainer = document.createElement("div");
    editIconContainer.classList.add("edit-icon-container");
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


    // display due date and category
    const todoDetails = document.createElement('div');
    todoDetails.innerHTML = "<div class='detailsHolder'><p class='dueDateholder'><span class='detailsText'>Due Date: </span>" + todo.dueDate + "</p>" + "<p class='categoryHolder'><span class='detailsText'>Category: </span>" + todo.category + "</p>" + "<p class='priorityHolder'><span class='detailsText'>Priority: </span>" + todo.priority + "</p></div>"
    // todoDetails.textContent = "Due Date: " + todo.dueDate + ", Category: " + todo.category + ", Priority: " + todo.priority;
    labelPreContainer.appendChild(todoDetails);

    if (todo.tags.length > 0) {
        const tagsElement = document.createElement('div');
        tagsElement.classList.add('tags');
        todo.tags.forEach(tag => {
            const tagElement = document.createElement('span');
            tagElement.textContent = tag;
            tagElement.classList.add('tag');
            tagsElement.appendChild(tagElement);
        });
        labelPreContainer.appendChild(tagsElement);
    }


    // add subtasks
    let addIconContainer = document.createElement("div");
    addIconContainer.classList.add("add-icon-container");
    labelContainer.appendChild(addIconContainer);



    let addIcon = document.createElement("button");
    // addIcon.innerHTML = "<svg xmlns='http://www.w3.org/2000/svg' width='40' height='40' class='add-icon' fill='currentColor' viewBox='0 0 16 16'> <path d='M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z'/></svg>"
    addIcon.textContent = "View Subtask";
    addIcon.classList.add("add-icon");
    addIconContainer.appendChild(addIcon);

    addIcon.onclick = function () {
        onAddSubTodo(todo);
    };

    const editTask = document.createElement("button");
    editTask.textContent = 'Edit Details';
    editTask.classList.add("add-icon");
    labelContainer.appendChild(editTask);
    editTask.onclick = function () {
        onEditDetailsTodo(todo);
    };


}

function onEditDetailsTodo(todo) {
    let editTodoContainer = document.getElementById("editTodoContainer");
    editTodoContainer.style.display = "block";

    let editTodoUserInput = document.getElementById("editTodoUserInput");
    editTodoUserInput.value = todo.text;

    let editDateInput = document.getElementById("editDateInput");
    editDateInput.value = todo.originalDueDate;

    let editCategoryDropdown = document.getElementById("editCategoryDropdown");
    editCategoryDropdown.value = todo.category;

    let editPriorityDropdown = document.getElementById("editPriorityDropdown");
    editPriorityDropdown.value = todo.priority;

    let editTagsInput = document.getElementById("editTagsInput");
    editTagsInput.value = todo.tags.join(",");

    editTodoContainer.scrollIntoView({ behavior: 'smooth' });

    let editTodoButton = document.getElementById("editTodoButton");
    editTodoButton.onclick = function () {

        let edituserInputValue = editTodoUserInput.value;

        if (edituserInputValue === "") {
            alert("Enter Valid Text");
            return;
        }

        todo.text = edituserInputValue;
        console.log(todo);
        todo.dueDate = changeDateFormat(editDateInput.value);
        todo.originalDueDate = editDateInput.value,
            todo.category = editCategoryDropdown.value;
        todo.priority = editPriorityDropdown.value;
        todo.tags = editTagsInput.value.split(',').map(tag => tag.trim());

        let todoItemsContainer1 = document.getElementById("todoItemsContainer");
        todoItemsContainer1.innerHTML = "";
        todoList.forEach(todo => {
            createAndAppendTodo(todo);
        });

        let todoItemContainer = document.getElementById("todo" + todo.uniqueNo);
        todoItemContainer.scrollIntoView({ behavior: 'smooth' });


        editTodoContainer.style.display = "none";
        localStorage.setItem("todoList", JSON.stringify(todoList));
    }
}


function onAddSubTodo(todo) {
    let popUp = document.createElement('div');
    popUp.classList.add('popup-container');
    document.body.appendChild(popUp);
    popUp.id = "popup-id";

    let popUpheader = document.createElement('h2');
    popUpheader.textContent = todo.text;
    popUp.appendChild(popUpheader);

    let popUpinputbox = document.createElement('input');
    popUpinputbox.type = "text";
    popUpinputbox.value = "";
    popUpinputbox.placeholder = "Enter Subtask Here";
    popUpinputbox.id = "popUpinputbox";
    popUp.appendChild(popUpinputbox);

    let popUpinputsave = document.createElement('button');
    popUpinputsave.textContent = "Save";
    popUpinputsave.classList.add("add-icon");
    popUp.appendChild(popUpinputsave);

    let subTaskDiv = document.createElement('div');
    subTaskDiv.id = "subTaskContainerid";
    subTaskDiv.classList.add('sub-tast-item-container');
    popUp.appendChild(subTaskDiv);

    let subTaskDivHeading = document.createElement('h2');
    subTaskDivHeading.textContent = "Sub Tasks";
    subTaskDiv.appendChild(subTaskDivHeading);

    let subtodoItemsContainer = document.createElement('div');
    subTaskDiv.appendChild(subtodoItemsContainer);
    for (let subtodo of todo.subTasks) {
        createAndAppendSubTodo(subtodo, "todo" + todo.uniqueNo);
    }

    popUpinputsave.onclick = function () {
        console.log("here");
        onSaveSubTask(todo);
        popUpinputbox.value = "";
    };


    let popUpClose = document.createElement('button');
    popUpClose.textContent = "Close";
    popUpClose.classList.add("add-icon");
    popUp.appendChild(popUpClose);
    popUpClose.onclick = function () {
        let popUpContainer = document.getElementById("popup-id");
        // console.log("here");
        // popUpContainer.style.display = "none";
        popUp.style.display = "none";
        document.body.removeChild(popUpContainer);
    }

}

function onSaveSubTask(todo) {
    let subTask = document.getElementById("popUpinputbox").value;
    if (subTask != "") {

        let newSubTodo = {
            text: subTask,
            id: generateUniqueId(),
            isChecked: false
        };
        let todoId = "todo" + todo.uniqueNo;
        createAndAppendSubTodo(newSubTodo, todoId);
        todo.subTasks.push(newSubTodo);
    }


    localStorage.setItem("todoList", JSON.stringify(todoList));
    let popUpMessage = document.getElementById("popUpMessage");
    popUpMessage.textContent = "Hurrah , Everything has been saved! Lets complete what is left of the day";
}


function createAndAppendSubTodo(subTodo, todoId) {
    let subtodoItemsContainer = document.getElementById("subTaskContainerid");
    let subtodoId = "subtodo" + subTodo.id;
    let subcheckboxId = "subcheckbox" + subTodo.id;
    let sublabelId = "sublabel" + subTodo.id;

    let subtodoElement = document.createElement("li");
    subtodoElement.classList.add("todo-item-container");
    subtodoElement.id = subtodoId;
    subtodoElement.setAttribute('draggable', 'true');
    subtodoElement.addEventListener('dragstart', onSubTodoDragStart);
    subtodoItemsContainer.appendChild(subtodoElement);

    let inputElement = document.createElement("input");
    inputElement.type = "checkbox";
    inputElement.id = subcheckboxId;
    inputElement.checked = subTodo.isChecked;

    inputElement.onclick = function () {
        onSubTodoStatusChange(subcheckboxId, sublabelId, subtodoId, todoId);
    };

    inputElement.classList.add("checkbox-input");
    subtodoElement.appendChild(inputElement);

    let labelContainer = document.createElement("div");
    labelContainer.classList.add("label-container");
    subtodoElement.appendChild(labelContainer);

    let labelElement = document.createElement("label");
    labelElement.setAttribute("for", subcheckboxId);
    labelElement.id = sublabelId;
    labelElement.classList.add("checkbox-label");
    labelElement.textContent = subTodo.text;
    if (subTodo.isChecked === true) {
        labelElement.classList.add("checked");
    }
    labelContainer.appendChild(labelElement);

    let deleteIconContainer = document.createElement("div");
    deleteIconContainer.classList.add("delete-icon-container");
    labelContainer.appendChild(deleteIconContainer);

    let deleteIcon = document.createElement("i");
    deleteIcon.classList.add("far", "fa-trash-alt", "delete-icon");

    deleteIcon.onclick = function () {
        onDeleteSubTodo(subTodo, subtodoId, todoId);
    };

    deleteIconContainer.appendChild(deleteIcon);



}


function onDeleteSubTodo(subTodo, subtodoId, todoId) {
    let subtodoItemsContainer = document.getElementById("subTaskContainerid");
    let subtodoElement = document.getElementById(subtodoId);
    subtodoItemsContainer.removeChild(subtodoElement);

    todoList.forEach(eachTodo => {
        let eachTodoId = "todo" + eachTodo.uniqueNo;
        console.log(eachTodoId);
        console.log(todoId);
        if (eachTodoId === todoId) {
            console.log("here");
            let deleteSubElementIndex = eachTodo.subTasks.findIndex(function (eachsubTodo) {
                let eachSubTodoId = "subtodo" + eachsubTodo.id;
                if (eachSubTodoId === subtodoId) {
                    return true;
                }
                else {
                    return false;
                }
            })
            eachTodo.subTasks.splice(deleteSubElementIndex, 1);
        }
    });

    // todoList.splice(deleteElementIndex, 1);
}


for (let todo of todoList) {
    createAndAppendTodo(todo);

}


function generateUniqueId() {
    return Date.now().toString();
}



// add filter options

let filterContainer = document.getElementById("filter-container");

const filterLabel = document.createElement('label');
filterLabel.setAttribute('for', 'filter');
filterLabel.textContent = 'Filter: ';
filterLabel.classList.add('filter-label');
filterContainer.appendChild(filterLabel);

// category filter
let categoryfilterOptions = [
    { value: 'all', text: 'Category' },
    { value: 'category1', text: 'Category 1' },
    { value: 'category2', text: 'Category 2' },
    { value: 'category3', text: 'Category 3' },
    { value: 'pending', text: 'Pending' },
    { value: 'completed', text: 'Completed' },
    { value: 'missed', text: 'Missed' }
];
const categoryfilterSelect = document.createElement('select');
categoryfilterSelect.setAttribute('id', 'categoryFilter');
categoryfilterOptions.forEach(option => {
    const optionElement = document.createElement('option');
    optionElement.setAttribute('value', option.value);
    optionElement.textContent = option.text;
    categoryfilterSelect.appendChild(optionElement);
});

categoryfilterSelect.addEventListener('change', applyCategoryFilter);
filterContainer.appendChild(categoryfilterSelect);

function applyCategoryFilter() {
    const categoryfilter = document.getElementById('categoryFilter').value;
    const todoListFromPage = document.getElementById('todoItemsContainer');

    if (categoryfilter != 'all') {
        while (todoListFromPage.firstChild) {
            todoListFromPage.removeChild(todoListFromPage.firstChild);
        }

        if (categoryfilter === "pending") {
            todoList.forEach(todoItem => {
                if (!todoItem.isChecked) {
                    createAndAppendTodo(todoItem);
                }
            });
            return;
        }

        if (categoryfilter === "completed") {
            todoList.forEach(todoItem => {
                if (todoItem.isChecked) {
                    createAndAppendTodo(todoItem);
                }
            });
            return;
        }

        if (categoryfilter === "missed") {
            const currentDate = new Date();
            todoList.forEach(todoItem => {
                if (!todoItem.isChecked && new Date(todoItem.originalDueDate) < currentDate) {
                    createAndAppendTodo(todoItem);
                }
            });
            return;
        }



        todoList.forEach(todoItem => {
            if (todoItem.category === categoryfilter) {
                createAndAppendTodo(todoItem);
            }
        });
    }
    else {
        while (todoListFromPage.firstChild) {
            todoListFromPage.removeChild(todoListFromPage.firstChild);
        }
        todoList.forEach(todoItem => {
            createAndAppendTodo(todoItem);
        });
    }


}


// priority filter
const priorityfilterOptions = [
    { value: 'all', text: 'Priority' },
    { value: 'low', text: 'Low' },
    { value: 'medium', text: 'Medium' },
    { value: 'high', text: 'High' }
];
const priorityfilterSelect = document.createElement('select');
priorityfilterSelect.setAttribute('id', 'priorityFilter');
priorityfilterOptions.forEach(option => {
    const optionElement = document.createElement('option');
    optionElement.setAttribute('value', option.value);
    optionElement.textContent = option.text;
    priorityfilterSelect.appendChild(optionElement);
});

priorityfilterSelect.addEventListener('change', applypriorityFilter);
filterContainer.appendChild(priorityfilterSelect);

function applypriorityFilter() {
    const priorityfilter = document.getElementById('priorityFilter').value;
    const todoListFromPage = document.getElementById('todoItemsContainer');

    if (priorityfilter != 'all') {
        while (todoListFromPage.firstChild) {
            todoListFromPage.removeChild(todoListFromPage.firstChild);
        }
        todoList.forEach(todoItem => {
            if (todoItem.priority === priorityfilter) {
                createAndAppendTodo(todoItem);
            }
        });
    }
    else {
        while (todoListFromPage.firstChild) {
            todoListFromPage.removeChild(todoListFromPage.firstChild);
        }
        todoList.forEach(todoItem => {
            createAndAppendTodo(todoItem);
        });
    }


}

// add sort options

let sortContainer = document.getElementById("sort-container");
const sortLabel = document.createElement('label');
sortLabel.setAttribute('for', 'sort');
sortLabel.textContent = 'Sort By: ';
sortLabel.classList.add('filter-label');
sortContainer.appendChild(sortLabel);



const sortOptions = [
    { value: 'default', text: 'Default' },
    { value: 'dueDate', text: 'Due Date' },
    { value: 'priority', text: 'Priority' }
];
const sortSelect = document.createElement('select');
sortSelect.setAttribute('id', 'sortOption');
sortOptions.forEach(option => {
    const optionElement = document.createElement('option');
    optionElement.setAttribute('value', option.value);
    optionElement.textContent = option.text;
    sortSelect.appendChild(optionElement);
});

sortContainer.appendChild(sortSelect);
sortSelect.addEventListener('change', sortTasks);
function sortTasks() {
    const sortOption = document.getElementById('sortOption').value;
    const todoListFromPage = document.getElementById('todoItemsContainer');
    // let sortedList = [...todoList];

    switch (sortOption) {
        case 'dueDate':
            sortedList.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
            break;
        case 'priority':
            sortedList.sort((a, b) => priorityToValue(a.priority) - priorityToValue(b.priority));
            break;
        case 'default':
            console.log("here");
            sortedList = [...todoList];
            break;
        default:
            break;
    }


    while (todoListFromPage.firstChild) {
        todoListFromPage.removeChild(todoListFromPage.firstChild);
    }
    sortedList.forEach(todoItem => {
        createAndAppendTodo(todoItem);

    });
}


function priorityToValue(priority) {
    switch (priority) {
        case "low":
            return 1;
        case "medium":
            return 2;
        case "high":
            return 3;
        default:
            return 0;
    }
}



function onnotifyTodo(notifyIconId, todoId) {
    let notifyIcon = document.getElementById(notifyIconId);

    todoList.forEach(function (todo, index) {
        let listtodoid = "todo" + todo.uniqueNo;
        console.log(todoList);
        console.log(todo);
        console.log(listtodoid);
        if (todoId === listtodoid) {

            if (todo.reminder) {
                notifyIcon.classList.remove("bi-bell-fill");
                notifyIcon.classList.add("bi-bell");
                todo.reminder = false;
            }
            else {
                notifyIcon.classList.remove("bi-bell");
                notifyIcon.classList.add("bi-bell-fill");
                todo.reminder = true;
                setTimeout(function () {
                    alert(`Please complete the task: ${todo.text}`);
                }, 2000);
            }

        }
    })

}



const searchButton = document.getElementById("searchTaskButton");
searchButton.onclick = function () {
    const searchInput = document.getElementById('searchInput');
    const searchQuery = searchInput.value.trim().toLowerCase();

    if (searchQuery !== '') {
        // Filter tasks based on the search query
        const filteredTasks = todoList.filter(todoItem => {
            const searchText = todoItem.text.toLowerCase();
            const tagsText = todoItem.tags.join(',').toLowerCase();

            // Check for exact task name match
            if (searchText === searchQuery) {
                return true;
            }

            // console.log(todoItem.subTasks);
            if (todoItem.subTasks && todoItem.subTasks.some(subtask =>
                subtask.text.toLowerCase().includes(searchQuery))) {
                return true;
            }

            // Check for sub-tasks
            if (searchText.includes(searchQuery)) {
                return true;
            }

            // Check for similar words
            if (searchText.includes(searchQuery) || tagsText.includes(searchQuery)) {
                return true;
            }
            // Check for partial search
            if (searchText.includes(searchQuery) || tagsText.includes(searchQuery)) {
                return true;
            }

            // Check for tags
            if (todoItem.tags.some(tag => tag.toLowerCase() === searchQuery)) {
                return true;
            }

            return false;
        });

        displayFilteredTasks(filteredTasks);
    } else {
        // If the search query is empty, display all tasks
        displayFilteredTasks(todoList);
    }
}


function displayFilteredTasks(filteredTasks) {

    const todoListFromPage = document.getElementById('todoItemsContainer');
    while (todoListFromPage.firstChild) {
        todoListFromPage.removeChild(todoListFromPage.firstChild);
    }


    filteredTasks.forEach(todoItem => {
        createAndAppendTodo(todoItem);
    });
}



function parseDueDate(inputText) {
    inputText.trim();
    console.log(inputText);
    // Regular expression to match common date formats
    const datePattern = /(\b(?:\d{1,2}(?:st|nd|rd|th)?\s+(?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)\s*\d{2,4}|tomorrow|today)\b|\b(?:\d{1,2}:\d{2}(?:\s*(?:am|pm))?)\b)/i;

    const match = inputText.match(datePattern);

    if (match) {
        // If a date is found in the input text, extract it
        console.log(match[0]);
        let dueDate = Date.parse(match[0]);

        if (!isNaN(dueDate)) {
            return dueDate;
        }
        return match[0];
    }

    return '';

}



let draggedElement = null;

function onDragStart(event) {
    draggedElement = event.target.closest('.todo-item-container');
    console.log(draggedElement.classList);
    event.dataTransfer.effectAllowed = 'move';
}

function onDragOver(event) {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
}

function onDrop(event) {
    event.preventDefault();
    let droppedElement = event.target.closest('.todo-item-container');
    console.log(droppedElement.classList);
    if (draggedElement && droppedElement) {
        const fromIndex = Array.from(todoItemsContainer.children).indexOf(draggedElement);
        const toIndex = Array.from(todoItemsContainer.children).indexOf(droppedElement);

        // Reorder the todoList based on the dragged and dropped positions
        const [removed] = todoList.splice(fromIndex, 1);
        todoList.splice(toIndex, 0, removed);

        // Clear and re-render the todo items
        todoItemsContainer.innerHTML = '';
        todoList.forEach(todoItem => {
            createAndAppendTodo(todoItem);
        });
        localStorage.setItem("todoList", JSON.stringify(todoList));
        draggedElement = null;
    }
}

// Add event listeners for drag events on todo and subtask elements
todoItemsContainer.addEventListener('dragstart', onDragStart);
todoItemsContainer.addEventListener('dragover', onDragOver);
todoItemsContainer.addEventListener('drop', onDrop);





let draggedSubTodoElement = null;
function onSubTodoDragStart(event) {
    draggedSubTodoElement = event.target.closest('.todo-item-container');;
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('text/html', draggedSubTodoElement.innerHTML);
}

function onSubTodoDragOver(event) {
    event.preventDefault();
}

function onSubTodoDrop(event) {
    event.preventDefault();
    let droppedSubTodoElement = event.target.closest('.todo-item-container');
    console.log(draggedSubTodoElement);
    console.log(droppedSubTodoElement);
    if (draggedSubTodoElement && droppedSubTodoElement) {
        const draggedsubTodoId = draggedSubTodoElement.getAttribute('id');
        const droppedsubTodoId = droppedSubTodoElement.getAttribute('id');
        //   console.log(subTodoId);
        let flag = false;
        for (todo of todoList) {
            for (subtask of todo.subTasks) {
                if ("subtodo" + subtask.id === draggedsubTodoId) {
                    flag = true;
                }
            }
            if (flag) {
                const fromSubtaskId = todo.subTasks.findIndex(subtask => 'subtodo' + subtask.id === draggedsubTodoId);
                const toSubtaskId = todo.subTasks.findIndex(subtask => 'subtodo' + subtask.id === droppedsubTodoId);
                const [removed] = todo.subTasks.splice(fromSubtaskId, 1);
                todo.subTasks.splice(toSubtaskId, 0, removed);
                const subtodoItemsContainer = droppedSubTodoElement.parentElement;
                subtodoItemsContainer.innerHTML = '<h2>Sub Tasks</h2>';
                todo.subTasks.forEach(subtask => {
                    createAndAppendSubTodo(subtask, "todo" + todo.uniqueNo);
                }
                );

                break;
            }
        }

        draggedSubTodoElement = null;
    }
}

// Add event listeners for subtask drag and drop
document.addEventListener('dragover', onSubTodoDragOver);
document.addEventListener('drop', onSubTodoDrop);


function changeDateFormat(datetimeString) {
    const options = {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        hour12: true,
    };

    return Intl.DateTimeFormat("en-US", options).format(new Date(datetimeString));
}



let filterStartDateInput = document.getElementById("filterStartDateInput");
filterStartDateInput.onchange = onFilterDateChange;

let filterEndDateInput = document.getElementById("filterEndDateInput");
filterEndDateInput.onchange = onFilterDateChange;

function onFilterDateChange() {
    if (!filterStartDateInput.value && !filterEndDateInput.value) {
        return;
    }
    let startDate = filterStartDateInput.value;
    let endDate = filterEndDateInput.value;

    const startDateTime = new Date(startDate).getTime();
    const endDateTime = new Date(endDate).getTime();

    const todosInRange = todoList.filter(todoItem => {
        const dueDateTime = new Date(todoItem.originalDueDate).getTime();
        return dueDateTime >= startDateTime && dueDateTime <= endDateTime;
    });
    const todoListFromPage = document.getElementById('todoItemsContainer');
    while (todoListFromPage.firstChild) {
        todoListFromPage.removeChild(todoListFromPage.firstChild);
    }
    todosInRange.forEach(todoItem => {
        createAndAppendTodo(todoItem);
    });
}



// add categories
const categories = [
    { value: "", text: "Category" },
    { value: "category1", text: "Category 1" },
    { value: "category2", text: "Category 2" },
    { value: "category3", text: "Category 3" }
];

// Get the select element by its id
const categoryDropdown = document.getElementById("categoryDropdown");
const editCategoryDropdown = document.getElementById("editCategoryDropdown");

// Create and add options to the select element using the categories array
categories.forEach(category => {
    const option = document.createElement("option");
    option.value = category.value;
    option.textContent = category.text;
    categoryDropdown.appendChild(option);
});

categories.forEach(category => {
    const option = document.createElement("option");
    option.value = category.value;
    option.textContent = category.text;
    editCategoryDropdown.appendChild(option);
});



const priorities = [
    { value: "", text: "Priority" },
    { value: "low", text: "Low" },
    { value: "medium", text: "Medium" },
    { value: "high", text: "High" }
];

// Get the select element by its id
const priorityDropdown = document.getElementById("priorityDropdown");
const editPriorityDropdown = document.getElementById("editPriorityDropdown");

// Create and add options to the select element using the categories array
priorities.forEach(category => {
    const option = document.createElement("option");
    option.value = category.value;
    option.textContent = category.text;
    priorityDropdown.appendChild(option);
});
priorities.forEach(category => {
    const option = document.createElement("option");
    option.value = category.value;
    option.textContent = category.text;
    editPriorityDropdown.appendChild(option);
});


