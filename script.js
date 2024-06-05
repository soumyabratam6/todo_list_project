document.addEventListener("DOMContentLoaded", () => {
  const taskForm = document.getElementById("taskForm");
  const taskName = document.getElementById("taskName");
  const taskDate = document.getElementById("taskDate");
  const taskPriority = document.getElementById("taskPriority");
  const todayTasks = document.getElementById("todayTasks");
  const futureTasks = document.getElementById("futureTasks");
  const completedTasks = document.getElementById("completedTasks");

  taskDate.onfocus = function () {
    this.type = "date";
  };

  taskDate.onblur = function () {
    if (!this.value) {
      this.type = "text";
      this.placeholder = "Deadline";
    }
  };
  taskDate.type = "text";
  taskDate.placeholder = "Deadline";

  const loadTasks = () => {
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    renderTasks(tasks);
  };

  const saveTasks = (tasks) => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
    renderTasks(tasks);
  };
  //Change the date formate
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = ("0" + date.getDate()).slice(-2);
    const month = ("0" + (date.getMonth() + 1)).slice(-2);
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };
  //capitalize the first letter of string
  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };
  
  const renderTasks = (tasks) => {
    todayTasks.innerHTML = "";
    futureTasks.innerHTML = "";
    completedTasks.innerHTML = "";
    const today = new Date().toISOString().split("T")[0];

    tasks.forEach((task, index) => {
      const taskElement = document.createElement("div");
      taskElement.className = `task-item ${task.completed ? "completed" : ""} ${
        !task.completed && task.date < today ? "red-border" : ""
      }`;
      if (task.completed) {
        taskElement.style.backgroundColor = "transparent";
      }
      taskElement.innerHTML = `
                <div>${task.id}.${capitalizeFirstLetter(task.name)}</div>
                <div>${formatDate(task.date)}</div>
                <div>Priority: ${capitalizeFirstLetter(task.priority)}</div>
                ${
                  task.completed
                    ? `<div>
                <img onclick="deleteTask(${index})" src="asset/Vector.svg" />
                </div>`
                    : `<div>
                 <img onclick="toggleTask(${index})" src="asset/check-circle 1.svg" alt="Complete Task" />
                 <img onclick="deleteTask(${index})" src="asset/trash 1.svg" />
                 <div>
                 `
                }  
            `;

      if (task.completed) {
        completedTasks.appendChild(taskElement);
      } else if (task.date === today) {
        todayTasks.appendChild(taskElement);
      } else {
        futureTasks.appendChild(taskElement);
      }
    });
  };

  taskForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    const newTaskId = tasks.length + 1;

    tasks.push({
      id: newTaskId,
      name: taskName.value,
      date: taskDate.value,
      priority: taskPriority.value,
      completed: false,
    });

    saveTasks(tasks);

    taskForm.reset();
  });

  window.deleteTask = (index) => {
    const tasks = JSON.parse(localStorage.getItem("tasks"));
    tasks.splice(index, 1);
    saveTasks(tasks);
  };

  window.toggleTask = (index) => {
    const tasks = JSON.parse(localStorage.getItem("tasks"));
    tasks[index].completed = !tasks[index].completed;
    saveTasks(tasks);
  };

  loadTasks();
});
