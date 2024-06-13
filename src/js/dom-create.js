import {
  updateUi,
  templateEl,
  selectedProject,
  setSelectedProject,
} from "./dom";
import { updateLocalStorage } from "./local-storage";
import { formatDistanceToNow } from "date-fns";
import { Project } from "./project";
export { elementFactory, modal };

const PRIO_LIST = ["undefined", "low", "medium", "high"];

const elementFactory = (() => {
  const createAllProjectBtn = () => {
    const allProjectBtn = document.createElement("div");
    allProjectBtn.classList.add("project-btn", "all-project-btn", "cursor");
    allProjectBtn.dataset.project = "all";
    const allP = document.createElement("p");
    allP.textContent = "All Projects";
    allProjectBtn.appendChild(allP);
    templateEl.projectsView.appendChild(allProjectBtn);
    allProjectBtn.addEventListener("click", () => {
      const projectBtnArr = document.querySelectorAll(".project-btn");
      projectBtnArr.forEach((btn) => {
        btn.classList.remove("active");
      });
      allProjectBtn.classList.add("active");
      setSelectedProject("all");
      updateUi.task("all");
    });

    return allProjectBtn;
  };
  const createProjectBtn = (project) => {
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
      // TODO: fix local storage update
      updateLocalStorage();
      templateEl.projectsView.removeChild(projectDiv);
      updateUi.task("all");
    });
    p.appendChild(icon);

    // View project tasks and apply current project
    projectDiv.addEventListener("click", () => {
      const projectBtnArr = document.querySelectorAll(".project-btn");
      projectBtnArr.forEach((btn) => {
        btn.classList.remove("active");
      });
      projectDiv.classList.add("active");
      setSelectedProject(project);
      updateUi.task(project);
    });

    projectDiv.appendChild(p);

    return projectDiv;
  };

  // Create task card
  const createTask = (task) => {
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
        func(task, taskCardElement) {
          finishTask(task, taskCardElement);
        },
      },
    ];

    // Task container
    const taskDiv = document.createElement("div");
    taskDiv.classList.add("task-card", PRIO_LIST[task.priority]);
    taskDiv.dataset.taskId = task.id;
    // Check if task is completed before this
    if (task.completed) {
      taskDiv.classList.add("complete");
      taskDiv.classList.add("completed-before");
    }
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
    const taskCards = templateEl.tasksView.querySelectorAll(".task-card");
    for (const taskCard of taskCards) {
      if (taskCard.dataset.taskId === task.id) {
        // Check is task is already completed
        if (
          taskCard.classList.contains("complete") ||
          taskCard.classList.contains("completed-before")
        )
          return;
        if (task) {
          // Find parent object from task
          const parentProjectIndex = Project.projectList.findIndex((project) =>
            project.tasks.some((taskItem) => taskItem.id === task.id)
          );
          Project.projectList[parentProjectIndex].completeTask(task);
        }
        taskCard.classList.add("complete");
      }
    }
    // Update localStorage
    updateLocalStorage();
  };
  const deleteTask = (task) => {
    for (const project of Project.projectList) {
      // Delete not completed task
      project.tasks.forEach((el) => {
        if (task.id == el.id) {
          project.removeTask(task);
          templateEl.tasksView.removeChild(
            document.querySelector(`[data-task-id="${task.id}"]`)
          );
        }
      });
      // Delete completed task
      project.completedTasks.forEach((el) => {
        if (task.id == el.id) {
          project.removeTask(task);
          templateEl.tasksView.removeChild(
            document.querySelector(`[data-task-id="${task.id}"]`)
          );
        }
      });
    }
    // Update localStorage
    updateLocalStorage();
  };
  const editTask = (task) => {
    if (task.completed) return;
    templateEl.dialog.innerHTML = "";
    templateEl.dialog.classList.remove(".create-project");
    templateEl.dialog.appendChild(modal.editTask(task));
    templateEl.dialog.showModal();
    // Update localStorage
    updateLocalStorage();
  };

  return { createAllProjectBtn, createProjectBtn, createTask };
})();

const modal = (() => {
  const project = () => {
    // Create form element
    const form = document.createElement("form");
    form.setAttribute("action", "");
    form.setAttribute("method", "templateEl.dialog");
    form.classList.add("create-project");

    // Create close button
    const closeButton = document.createElement("button");
    closeButton.setAttribute("type", "button");
    closeButton.className = "close-modal-btn";
    closeButton.innerHTML = '<i class="fa-solid fa-xmark"></i>';
    closeButton.addEventListener("click", () => templateEl.dialog.close());
    form.appendChild(closeButton);

    // Create title
    const title = document.createElement("h2");
    title.className = "templateEl.dialog-title";
    title.textContent = "New Project";
    form.appendChild(title);

    // Create project name input
    const projectNameInput = document.createElement("input");
    projectNameInput.setAttribute("type", "text");
    projectNameInput.setAttribute("id", "task-title");
    projectNameInput.setAttribute("placeholder", "Project names");
    projectNameInput.setAttribute("required", "true");
    form.appendChild(projectNameInput);

    // Create submit button
    const submitButton = document.createElement("button");
    submitButton.setAttribute("type", "submit");
    submitButton.className = "submit-modal";
    submitButton.textContent = "Confirm";
    submitButton.addEventListener("click", (e) => {
      if (!projectNameInput.value) {
        alert("Huh? i thought you want to create a project..");
        e.preventDefault();
        return;
      }
      domInterface.createProject(projectNameInput.value);
    });
    form.appendChild(submitButton);

    return form;
  };

  // Tasks modals
  const editTask = (task) => {
    return createTaskForm("Edit Task", "edit", task);
  };
  const createTask = () => {
    return createTaskForm("Create Task", "create");
  };

  const createTaskForm = (dialog, type, task) => {
    // Create form element
    const form = document.createElement("form");
    form.setAttribute("action", "");
    form.setAttribute("method", "dialog");

    // Create close button
    const closeButton = document.createElement("button");
    closeButton.setAttribute("type", "button");
    closeButton.className = "close-modal-btn";
    closeButton.innerHTML = '<i class="fa-solid fa-xmark"></i>';
    closeButton.addEventListener("click", () => templateEl.dialog.close());
    form.appendChild(closeButton);

    // Create title
    const title = document.createElement("h2");
    title.className = "dialog-title";
    title.textContent = templateEl.dialogTitle;
    form.appendChild(title);

    // Create task name input
    const taskNameLabel = document.createElement("label");
    taskNameLabel.setAttribute("for", "task-title");
    taskNameLabel.textContent = "*Task Name ";
    const taskNameInput = document.createElement("input");
    taskNameInput.setAttribute("type", "text");
    taskNameInput.setAttribute("id", "task-title");
    taskNameInput.setAttribute("required", "true");
    // If this an edit, set the value
    taskNameInput.value = task ? task.title : "";
    taskNameLabel.appendChild(taskNameInput);
    form.appendChild(taskNameLabel);

    // Create task description textarea
    const taskDescLabel = document.createElement("label");
    taskDescLabel.setAttribute("for", "task-desc");
    taskDescLabel.textContent = "Description ";
    const taskDescTextarea = document.createElement("textarea");
    taskDescTextarea.setAttribute("name", "task-desc");
    taskDescTextarea.setAttribute("id", "task-desc");
    taskDescTextarea.setAttribute(
      "placeholder",
      "Long description for this task (optional)"
    );
    taskDescTextarea.setAttribute("rows", "4");
    // If this an edit, set the value
    taskDescTextarea.value = task ? task.desc : "";
    taskDescLabel.appendChild(taskDescTextarea);
    form.appendChild(taskDescLabel);

    // Create due date input
    const dueDateLabel = document.createElement("label");
    dueDateLabel.setAttribute("for", "task-due-date");
    dueDateLabel.textContent = "*Due Date ";
    const dueDateInput = document.createElement("input");
    dueDateInput.setAttribute("type", "date");
    dueDateInput.setAttribute("required", "true");
    dueDateInput.setAttribute("name", "task-due-date");
    dueDateInput.setAttribute("id", "task-due-date");
    // If this an edit, set the value
    dueDateInput.value = task ? task._date : "";
    dueDateLabel.appendChild(dueDateInput);
    form.appendChild(dueDateLabel);

    // Create priority select
    const priorityLabel = document.createElement("label");
    priorityLabel.setAttribute("for", "task-priority");
    priorityLabel.textContent = "Priority ";
    const prioritySelect = document.createElement("select");
    prioritySelect.setAttribute("name", "task-priority");
    prioritySelect.setAttribute("id", "task-priority");
    const priorities = ["Low", "Medium", "High"];
    priorities.forEach((priority) => {
      const option = document.createElement("option");
      option.setAttribute("value", priorities.indexOf(priority) + 1);
      option.textContent = priority;
      // If this and edit, set the value
      if (task && task.priority === priorities.indexOf(priority) + 1) {
        option.selected = true;
      }
      prioritySelect.appendChild(option);
    });
    priorityLabel.appendChild(prioritySelect);
    form.appendChild(priorityLabel);

    // Create parent project select
    const parentLabel = document.createElement("label");
    parentLabel.setAttribute("for", "project-parent");
    parentLabel.textContent = "Project ";

    const parentSelect = document.createElement("select");
    parentSelect.setAttribute("name", "project-parent");
    parentSelect.setAttribute("id", "project-parent");

    // Create Select element and assigb default value
    // TODO: FIX THIS DISGUSTING MESS
    const parents = Project.projectList;
    for (const [index, parent] of parents.entries()) {
      const option = document.createElement("option");
      option.value = index;
      option.textContent = parent.name;
      if (selectedProject === "all") {
        // Selected project is all
        parentSelect.appendChild(option);
      } else {
        if (Project.projectList.indexOf(selectedProject) === index) {
          // Selected project
          option.selected = true;
        }
      }
      parentSelect.appendChild(option);
    }
    if (!task) {
      parentLabel.appendChild(parentSelect);
      form.appendChild(parentLabel);
    }

    // Create submit button
    const submitButton = document.createElement("button");
    submitButton.setAttribute("type", "submit");
    submitButton.className = "submit-modal";
    submitButton.textContent = "Confirm";
    submitButton.addEventListener("click", (e) => {
      // Check if all required field are filled
      const required = form.querySelectorAll("[required]");
      for (const input of required) {
        if (!input.value) {
          input.classList.add("required-effect");
          alert("Please fill out all required fields!");
          e.preventDefault();
          return;
        } else {
          input.classList.remove("required-effect");
        }
      }
      if (type === "create") {
        domInterface.createTask(
          taskNameInput.value,
          taskDescTextarea.value,
          new Date(dueDateInput.value),
          prioritySelect.value,
          Project.projectList[parentSelect.value]
        );
      } else if (type === "edit") {
        domInterface.editTask(
          taskNameInput.value,
          taskDescTextarea.value,
          new Date(dueDateInput.value),
          prioritySelect.value,
          task.completed,
          Project.projectList[parentSelect.value],
          task
        );
      }
    });
    form.appendChild(submitButton);

    return form;
  };

  return { project, createTask, editTask, createTaskForm };
})();

// TODO: fix modal.project broken
