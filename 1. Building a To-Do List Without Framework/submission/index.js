let todoList = [];

            function generateTodoItem(itemName) {
                const timestamp = Date.now();
                return {
                    id: "todo-item-" + timestamp,
                    name: itemName,
                    timestamp,
                    isDone: false,
                };
            }

            function todoElement(item, i) {
                const elem = document.createElement("div");
                elem.id = item.id;
                elem.innerHTML = `
                <div class="row py-2 pb-2 text-center" data-aos="fade-up">
                    <div class="col-3 text-center">${i + 1}</div>
                    <div class="col-3"> <input type="checkbox" onchange="markItem(event)" ${
                        item.isDone ? "checked" : ""
                    }/></div>
                    <div class="col-3">${item.name}</div>
                    <div class="col-3" id=${
                        item.id
                    }><button class="btn btn-outline-danger" onclick="deleteItem(event)">Delete Item</button></div>
                </div>
                             `;
                return elem;
            }

            function renderList() {
                const listElement = document.getElementById("todo-list");

                listElement.innerHTML = "";

                for (let i = 0; i < todoList.length; i++) {
                    const todoItem = todoElement(todoList[i], i);
                    listElement.appendChild(todoItem);
                }

                let alert = `
                <div class="text-center alert ${
                    isAdded
                        ? "alert-success"
                        : "alert-danger"
                } alert-dismissible fade show shadow border-0" role="alert"  data-aos="fade-down">
                        <strong>${
                            isAdded
                                ? "Congraluations, Your item has been added."
                                : "Your item has been deleted."
                        }
                        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                    </div>`;
                $("#confirmation").html(alert);
            }

            document
                .getElementById("todo-form")
                .addEventListener("submit", function (event) {
                    event.preventDefault();
                    const itemName = event.target["todo-input"].value;
                    if (itemName) {
                        todoList.push(generateTodoItem(itemName));
                        isAdded = true;
                        renderList();
                        event.target.reset();
                    }
                });

            function markItem(event) {
                const itemId = event.target.parentElement.id; // getting the id of the parent element to search in the array
                todoList.some(function (todoItem) {
                    if (todoItem.id === itemId) {
                        todoItem.isDone = !todoItem.isDone;
                        renderList();
                        return true;
                    }
                });
            }

            function deleteItem(event) {
                isAdded = false;
                const itemId = event.target.parentElement.id; // getting the id of the parent element to search in the array
                todoList.some(function (todoItem, i) {
                    if (todoItem.id === itemId) {
                        todoList.splice(i, 1);
                        renderList();
                        return true;
                    }
                });
            }

            function saveTodo(e) {
                localStorage.setItem("todoList", JSON.stringify(todoList));
            }
            function deleteTodo(e) {
                localStorage.clear();
                location.reload();
            }

            try {
                if (localStorage.getItem("todoList")) {
                    todoList = JSON.parse(localStorage.getItem("todoList"));
                    renderList();
                }
            } catch (e) {
                console.log(e);
            }