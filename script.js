let tasksData = {};

const todo = document.querySelector("#todo");
const progress = document.querySelector("#progress");
const done = document.querySelector("#done");
const addTaskButton = document.querySelector("#add-new-task");
const tasks = document.querySelectorAll(".task");
const toggleTaskButton = document.querySelector("#toggle-task");
const modal = document.querySelector(".modal");
const modalBg = document.querySelector(".modal .bg");
let draggedTask = null;
let columns = [todo, progress, done];

function updateTaskCounts(){
    columns.forEach((col) => {
        const tasks = col.querySelectorAll(".task");
        const count = col.querySelector(".right");

        count.textContent = tasks.length;
    });
}

function saveTasksToLocalStorage() {
    columns.forEach((col) => {
        const tasks = col.querySelectorAll(".task");
        tasksData[col.id] = Array.from(tasks).map((task) => {
            return {
                title: task.querySelector("h2").textContent,
                description: task.querySelector("p").textContent
            };
        });
    });
    localStorage.setItem("tasks", JSON.stringify(tasksData));
}

function allowDragEventsOnColumn(column) {
    column.addEventListener("dragenter", (e) => {
        e.preventDefault();
        column.classList.add("hover-over");
    });
    column.addEventListener("dragleave", (e) => {
        e.preventDefault();
        column.classList.remove("hover-over");
    });
    column.addEventListener("dragover", (e) => {
        e.preventDefault();
    });
    column.addEventListener("drop", (e) => {
        e.preventDefault();

        if (draggedTask) {
            column.appendChild(draggedTask);
            updateTaskCounts();
            column.classList.remove("hover-over");
            saveTasksToLocalStorage();
        }
    });

}

function createTaskElement(title, description, column) {
    const task = document.createElement("div");
    task.setAttribute("draggable", "true");
    task.classList.add("task");

    task.innerHTML = `
        <h2>${title}</h2>
        <p>${description}</p>
        <button>Delete</button>
    `;

    column.appendChild(task);

    task.addEventListener("drag", (e) => {
        draggedTask = task;
    });

    const deleteButton = task.querySelector("button");
    deleteButton.addEventListener("click", () => {
        task.remove();
        updateTaskCounts();
        saveTasksToLocalStorage();
    });
}


if (localStorage.getItem("tasks")) {
    tasksData = JSON.parse(localStorage.getItem("tasks"));

    for (const colId in tasksData) {
        const column = document.querySelector(`#${colId}`);
        tasksData[colId].forEach((taskData) => {
            createTaskElement(taskData.title, taskData.description, column);
        });
        updateTaskCounts();
    }
}

tasks.forEach((task) => {
    task.addEventListener("drag", (e) => {
        draggedTask = task;
    });
});

columns.forEach((col) => {
    allowDragEventsOnColumn(col);
});


toggleTaskButton.addEventListener("click", () => {
    modal.classList.toggle("active");
});


modalBg.addEventListener("click", () => {
    modal.classList.remove("active");
});

addTaskButton.addEventListener("click", function (e) {
    const taskTitleInput = document.querySelector("#task-title-input").value;
    const taskDescriptionInput = document.querySelector("#task-description-input").value;

    createTaskElement(taskTitleInput, taskDescriptionInput, todo);
    updateTaskCounts();
    saveTasksToLocalStorage();

    modal.classList.remove("active");
    document.querySelector("#task-title-input").value = "";
    document.querySelector("#task-description-input").value = "";

});
