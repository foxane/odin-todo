import { formatDistanceToNow } from "date-fns";
import { allProject } from "./index";
export { DOM };

const projectsView = document.querySelector(".project-content");
const tasksView = document.querySelector(".task-content");
const PRIO_LIST = ["undefined", "low", "medium", "high"];

const DOM = (() => {
  // Project
  const updateProjectList = (allProject) => {
    projectsView.innerHTML = "";
    for (const project of allProject) {
      projectsView.appendChild(createProjectDiv(project));
    }
  };

  // Create Project Button
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
      updateAllTask(allProject);
    });
    p.appendChild(icon);

    // View project tasks
    projectDiv.addEventListener("click", () => {
      updateAllTask(project);
    });

    projectDiv.appendChild(p);

    return projectDiv;
  };

  // Tasks
  const updateAllTask = (allProject) => {
    tasksView.innerHTML = "";
    for (const project of allProject) {
      for (const task of project.task) {
        tasksView.appendChild(createTaskDiv(task));
      }
    }
  };
  const updateTaskByProject = (project) => {
    tasksView.innerHTML = "";
    for (const task of project.task) {
      tasksView.appendChild(createTaskDiv(task));
    }
  };

  // Create task card
  const createTaskDiv = (task) => {
    // Task control button values
    const BUTTON_VALUES = [
      {
        dataSet: "data-edit",
        iconClass: ["fa-regular", "fa-pen-to-square"],
        func(task) {
          editTask(task);
        },
      },
      {
        dataSet: "data-delete",
        iconClass: ["fa-solid", "fa-trash"],
        func(task) {
          deleteTask(task);
        },
      },
      {
        dataSet: "data-finish",
        iconClass: ["fa-solid", "fa-check"],
        func(task) {
          finishTask(task);
        },
      },
    ];

    // Task container
    const taskDiv = document.createElement("div");
    taskDiv.classList.add("task-card", PRIO_LIST[task.priority]);
    taskDiv.dataset.taskId = task.id;

    // task title
    const h3 = document.createElement("h3");
    h3.textContent = task.title;
    taskDiv.appendChild(h3);

    // task description
    const p = document.createElement("p");
    p.textContent = task.desc;
    taskDiv.appendChild(p);

    // task dueDate
    const p2 = document.createElement("p2");
    p2.textContent = "Dues in ";
    const strong = document.createElement("strong");
    strong.textContent = formatDistanceToNow(task.dueDate);
    p2.appendChild(strong);
    taskDiv.appendChild(p2);

    const buttonDiv = document.createElement("button");
    buttonDiv.classList.add("task-card__control");
    for (const buttonVal of BUTTON_VALUES) {
      const button = document.createElement("button");
      button.setAttribute("type", "button");
      button.setAttribute(buttonVal.dataSet, task.id);
      button.addEventListener("click", () => {
        buttonVal.func(task);
      });

      const icon = document.createElement("i");
      icon.classList.add(buttonVal.iconClass[0], buttonVal.iconClass[1]);
      button.appendChild(icon);

      buttonDiv.appendChild(button);
    }
    taskDiv.appendChild(buttonDiv);

    return taskDiv;
  };

  // Task card button functions
  const finishTask = (task) => {
    const taskCards = tasksView.querySelectorAll(".task-card");
    for (const taskCard of taskCards) {
      if (taskCard.dataset.taskId === task.id) {
        taskCard.classList.add("complete");
      }
    }
  };

  const deleteTask = (task) => {
    console.log(task);
    for (const project of allProject) {
      project.task.forEach((el) => {
        if (task.id == el.id) {
          project.removeTask(task);
          tasksView.removeChild(
            document.querySelector(`[data-task-id="${task.id}"]`)
          );
        }
      });
      console.log(project.task);
    }
  };
  const editTask = (task) => {};

  return { updateProjectList, updateAllTask };
})();
