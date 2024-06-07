import deleteIcon from "../assets/images/delete.png";
import editIcon from "../assets/images/edit.png";

const updateProject = (projectList) => {
  const projectContainer = document.querySelector(".project-content");
  projectContainer.innerHTML = "";
  for (const key in projectList) {
    projectContainer.innerHTML += `<div class="project-btn" data-proj="${key}">
        <p>${key}</p>
        <img src="${deleteIcon}" class="deleteProject-btn" />
     </div>`;
  }
};

const updateTask = (projectList) => {
  const taskContainer = document.querySelector(".task-content");
  taskContainer.innerHTML = "";
  for (const key in projectList) {
    for (const task of projectList[key].task) {
      const taskTemplate = `
    <div class="task ${task.priority}">
      <div class="task-text">
        <h3 class="title">${task.title}</h3>
        <p class="decription">
          ${task.desc}.
        </p>
      </div>
      <div class="dues-in">
        <p>Due in <span class="distanceToNow"> Today</span></p>
      </div>
      <div class="task-control">
        <img
          src="${editIcon}"
          alt="edit"
          class="task-edit"
        />
        <img
          src="${deleteIcon}"
          alt="delete"
          class="task-delete"
        />
      </div>
    </div>
    `;
      taskContainer.innerHTML += taskTemplate;
    }
  }
};

export { updateProject, updateTask };
