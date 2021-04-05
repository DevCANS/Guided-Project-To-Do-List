let todoList = [];

const generateTodoItem = (itemName) => {
    const timeStamp = Date.now();
    return {
        id: "todo-item-" + timeStamp,
        name: itemName,
        timeStamp,
        isDone: false,
    };
};

const todoElement = (item, i) => {
    const elem = document.createElement("div");
    elem.id = item.id;
    elem.innerHTML = `
            <div class="row py-2 text-center">
                <div class="col-3 text-center">${i + 1}</div>
                <div class="col-3" id=${item.id}>
                    <input type="checkbox" onchange="markItem(event)" ${
                        item.isDone ? "checked" : ""
                    }/>
                </div>
                <div class="col-3">${item.name}</div>
                <div class="col-3" id=${item.id}>
                    <button class="btn btn-outline-danger" onclick="deleteItem(event)">Delete Item</button>
                </div>
            </div> `;
    return elem;
};

const renderList = () => {
    const listElement = document.getElementById("todo-list");
    listElement.innerHTML = "";
    for (let i = 0; i < todoList.length; i++) {
        const todoItem = todoElement(todoList[i], i);
        listElement.appendChild(todoItem);
    }
};

document.getElementById("todo-form").addEventListener("submit", (event) => {
    event.preventDefault();
    const itemName = event.target["todo-input"].value;
    if (itemName) {
        todoList.push(generateTodoItem(itemName));
        renderList();
        saveTodo();
        const alert = `
                <div class="text-center alert alert-success alert-dismissible fade show shadow border-0" role="alert"  data-aos="fade-down">
                    <strong>Congratulations, your item has been added.
                    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                </div>`;
        $("#confirmation").html(alert);
        event.target.reset();
    }
});

const markItem = (event) => {
    const itemId = event.target.parentElement.id; // getting the id of the parent element to search in the array
    todoList.some((todoItem) => {
        if (todoItem.id === itemId) {
            todoItem.isDone = !todoItem.isDone;
            renderList();
            saveTodo();
            return true;
        }
    });
};

const deleteItem = (event) => {
    const itemId = event.target.parentElement.id; // getting the id of the parent element to search in the array
    todoList.some((todoItem, i) => {
        if (todoItem.id === itemId) {
            const approveDelete = confirm(
                "Delete this item. If not then press cancel to undo"
            ); //taking input from user if they sure want to delete
            if (approveDelete) {
                todoList.splice(i, 1);
                renderList();
                saveTodo();
                const alert = `
                <div class="text-center alert alert-danger alert-dismissible fade show shadow border-0" role="alert"  data-aos="fade-down">
                    <strong>Your item has been removed.
                    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                </div>`;
                $("#confirmation").html(alert);
            }
            return true;
        }
    });
};

const saveTodo = () => {
    localStorage.setItem("todoList", JSON.stringify(todoList)); // key and its value
    const saveInfo = `
                <div class="text-center alert alert-primary alert-dismissible fade show shadow border-0" role="alert"  data-aos="zoom-in-down">
                    <strong>${
                        todoList.length > 0
                            ? "Your changes have been successfully saved."
                            : "Please add any item."
                    }
                    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                </div>`;
    $("#save-info").html(saveInfo);
};

const clearTodo = () => {
        if (todoList.length){
            const approveClear = confirm("Are you sure you want to delete your all items");
            if(approveClear){
                `${localStorage.removeItem("todoList")}
                ${(todoList = [])}
                ${renderList()}`
                const clearInfo = `
                <div class="text-center alert alert-primary alert-dismissible fade show shadow border-0" role="alert"  data-aos="zoom-in-down">
                <strong>Your items have been successfully removed.</strong>
                    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                </div>`;            
    $("#save-info").html(clearInfo);
            }
        }
        else{
            const clearInfo = `
                <div class="text-center alert alert-primary alert-dismissible fade show shadow border-0" role="alert"  data-aos="zoom-in-down">
                <strong>Please add any item</strong>
                    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                </div>`; 
    $("#save-info").html(clearInfo);
        }
};

try {
    if (localStorage.getItem("todoList")) {
        todoList = JSON.parse(localStorage.getItem("todoList"));
        renderList();
    }
} catch (e) {
    console.log(e);
}
