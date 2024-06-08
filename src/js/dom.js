import { formatDistanceToNow } from "date-fns";
import { projList } from "./index";
export { updateProjectList, updateTaskList, sortByPrio };

const projectsView = document.querySelector(".project-content");
const tasksView = document.querySelector(".task-content");

const PRIO_LIST = ["undefined", "low", "medium", "high"];

const updateProjectList = (projectList) => {
  projectsView.innerHTML = "";
  for (const project of projectList) {
    projectsView.appendChild(createProjectDiv(project));
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
  for (const task of taskArr) {
    tasksView.appendChild(createTaskDiv(task));
  }
};

const createProjectDiv = (project) => {
  const projectDiv = document.createElement("div");
  projectDiv.classList.add("project-btn", "cursor");
  projectDiv.dataset.project = project.id;

  const p = document.createElement("p");
  p.appendChild(document.createTextNode(project.name));

  // Remove project
  const icon = document.createElement("i");
  icon.classList.add("fa-solid", "fa-xmark");
  icon.dataset.deleteProject = project.id;
  icon.addEventListener("click", (e) => {
    e.stopPropagation();
    project.deleteSelf();
    projectsView.removeChild(projectDiv);
    updateTaskList(projList);
    console.log(projList);
  });
  p.appendChild(icon);

  projectDiv.appendChild(p);

  return projectDiv;
};

// Cteate Task cards
const createTaskDiv = (task) => {
  // Task container
  const taskDiv = document.createElement("div");
  taskDiv.classList.add("task-card", PRIO_LIST[task.priority]);
  taskDiv.dataset.taskId = task.id;

  // task title
  const h3 = document.createElement("h3");
  h3.textContent = task.title;
  taskDiv.appendChild(h3);

  // task desc
  const p = document.createElement("p");
  p.textContent = task.desc;
  taskDiv.appendChild(p);

  // task due
  const p2 = document.createElement("p2");
  p2.textContent = "Dues in";
  const strong = document.createElement("strong");
  strong.textContent = formatDistanceToNow(task.dueDate);
  p2.appendChild(strong);
  taskDiv.appendChild(p2);

  // Task control buttons
  const buttonValues = [
    {
      dataSet: "data-edit",
      iconClass: ["fa-regular", "fa-pen-to-square"],
    },
    {
      dataSet: "data-delete",
      iconClass: ["fa-solid", "fa-trash"],
    },
    {
      dataSet: "data-finish",
      iconClass: ["fa-solid", "fa-check"],
    },
  ];

  const buttons = document.createElement("button");
  buttons.classList.add("task-card__control");
  for (const buttonVal of buttonValues) {
    const button = document.createElement("button");
    button.setAttribute("type", "button");
    button.setAttribute(buttonVal.dataSet, task.id);

    const icon = document.createElement("i");
    icon.classList.add(buttonVal.iconClass[0], buttonVal.iconClass[1]);
    button.appendChild(icon);

    buttons.appendChild(button);
  }
  taskDiv.appendChild(buttons);

  return taskDiv;
};
