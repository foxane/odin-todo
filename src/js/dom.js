import { formatDistanceToNow } from "date-fns";
export { updateProjectList, updateTaskList, sortByPrio };

const projectsView = document.querySelector(".project-content");
const tasksView = document.querySelector(".task-content");

const PRIO_LIST = ["undefined", "low", "medium", "high"];

const updateProjectList = (projectList) => {
  projectsView.innerHTML = "";
  for (const project of projectList) {
    projectsView.innerHTML += `
        <div class="project-btn cursor" data-proj="${project.id}">
          <h4>${project.name}</h4>
        </div>
    `;
  }
};

const updateTaskList = (projectList) => {
  tasksView.innerHTML = "";
  // iterate through project list
  for (const project of projectList) {
    updateTask(project.task);
  }
};

const sortByPrio = (projectList) => {
  const allTask = [];
  // Take all project from projectlist
  for (const project of projectList) {
    // Take all task from project
    for (const task of project.task) {
      allTask.push(task);
    }
  }
  allTask.sort((a, b) => b.id - a.id);
  updateTask(allTask);
};

const updateTask = (taskArr) => {
  tasksView.innerHTML = "";
  for (const task of taskArr) {
    tasksView.innerHTML += `
      <div class="task-card ${PRIO_LIST[task.priority]}" data-task-id="${
      task.id
    }">
        <h3>${task.title}</h3>
        <p>${task.desc}</p>
        <p>Dues in <strong>${formatDistanceToNow(task.dueDate)}</strong></p>
        <div class="task-card__control">
          <button type="button" data-edit="${task.id}">
            <i class="fa-regular fa-pen-to-square"></i>
          </button>
          <button type="button" data-delete="${task.id}">
            <i class="fa-solid fa-trash"></i>
          </button>
          <button type="button" data-finish="${task.id}">
            <i class="fa-solid fa-check"></i>
          </button>
        </div>
      </div>
    `;
  }
};
