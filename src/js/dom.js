import {
  formatDistanceToNow,
  isToday,
  isThisWeek,
  isThisMonth,
} from "date-fns";
import { allProject } from "./index";
import { Project, Task } from "./project";
export { DOM, domInterface, sortController };

const PRIO_LIST = ["undefined", "low", "medium", "high"];

const dateFnsScope = {
  isToday,
  isThisWeek,
  isThisMonth,
};

// Dom Template elements
const projectsView = document.querySelector(".project-content");
const tasksView = document.querySelector(".task-content");
const newProjectBtn = document.querySelector(".new-project-btn");
const newTaskBtn = document.querySelector(".new-task-btn");
const dialog = document.querySelector("dialog");
const sortSelect = document.getElementById("sort");
const categoryBtns = document.querySelectorAll(".category-btn");

// TODO: Move completed task to bottom of the list (done, but need to update tasklist for this to take effect) find a better way
// TODO: Add localStorage interface
// TODO: Delete today, week, month button

// Currently selected project and category
let g_activeProject = "all";
let g_activeCategory = "all";
const sortController = (project) => {
  if (project === "all") {
    const taskArr = [];
    // Merging all task into one array
    for (const project of allProject) {
      for (const task of project.task) {
        taskArr.push(task);
      }
    }
    // Merge completed task
    const completedTaskArr = [];
    for (const project of allProject) {
      for (const task of project.completedTasks) {
        completedTaskArr.push(task);
      }
    }
    DOM.sortTask(categoryFilter(taskArr), categoryFilter(completedTaskArr));
  } else {
    DOM.sortTask(
      categoryFilter(project.task),
      categoryFilter(project.completedTasks)
    );
  }
};
const categoryFilter = (arr) => {
  if (g_activeCategory === "all") {
    return arr;
  } else {
    return arr.filter((el) => dateFnsScope[g_activeCategory](el._date));
  }
};

// Main event listener
sortSelect.addEventListener("change", () => {
  sortController(g_activeProject);
});

categoryBtns.forEach((el) => {
  el.addEventListener("click", (e) => {
    // Remove active class when clicking other category
    for (const btn of categoryBtns) {
      btn.classList.remove("active");
    }
    e.target.classList.add("active");
    g_activeCategory = el.dataset.category;
    sortController(g_activeProject);
  });
});

newTaskBtn.addEventListener("click", () => {
  if (allProject.length === 0) {
    alert("You need to have at least 1 project!");
    dialog.innerHTML = "";
    dialog.appendChild(DOM.modal.createProjectForm());
    dialog.showModal();
    return;
  }
  dialog.innerHTML = "";
  dialog.appendChild(DOM.modal.createTask());
  dialog.showModal();
});

newProjectBtn.addEventListener("click", () => {
  dialog.innerHTML = "";
  dialog.appendChild(DOM.modal.createProjectForm());
  dialog.showModal();
});

const DOM = (() => {
  // Project
  const updateProjectList = (allProject) => {
    projectsView.innerHTML = ``;

    // Create 'All Project' button
    const allProjectBtn = document.createElement("div");
    allProjectBtn.classList.add("project-btn", "all-project-btn", "cursor");
    allProjectBtn.dataset.project = "all";
    const allP = document.createElement("p");
    allP.textContent = "All Projects";
    allProjectBtn.appendChild(allP);
    projectsView.appendChild(allProjectBtn);
    allProjectBtn.addEventListener("click", () => {
      const projectBtnArr = document.querySelectorAll(".project-btn");
      projectBtnArr.forEach((btn) => {
        btn.classList.remove("active");
      });
      allProjectBtn.classList.add("active");
      g_activeProject = "all";
      sortController("all");
    });

    // Iterate project list
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
      sortController("all");
    });
    p.appendChild(icon);

    // View project tasks and apply current project
    projectDiv.addEventListener("click", () => {
      const projectBtnArr = document.querySelectorAll(".project-btn");
      projectBtnArr.forEach((btn) => {
        btn.classList.remove("active");
      });
      projectDiv.classList.add("active");
      g_activeProject = project;
      sortController(project);
    });

    projectDiv.appendChild(p);

    return projectDiv;
  };

  // Tasks
  //Sort task list, require allTask array(all project.task combined into one) NOT allProject!
  const sortTask = (taskArr, completedTaskArr) => {
    const sortVal = sortSelect.value;
    if (sortVal === "priority") {
      updateTaskByPrio(taskArr, completedTaskArr);
    } else if (sortVal === "closest") {
      updateTaskByClosestDate(taskArr, completedTaskArr);
    }
  };
  const updateTaskByPrio = (taskArr, completedTaskArr) => {
    // Sort uncompleted task
    taskArr.sort(function (a, b) {
      return b.priority - a.priority;
    });
    // Sort completed task
    completedTaskArr.sort(function (a, b) {
      return b.priority - a.priority;
    });

    // Update task list
    tasksView.innerHTML = "";
    for (const task of taskArr) {
      tasksView.appendChild(createTaskDiv(task));
    }
    for (const task of completedTaskArr) {
      tasksView.appendChild(createTaskDiv(task));
    }
  };
  const updateTaskByClosestDate = (taskArr, completedTaskArr) => {
    // Sort
    taskArr.sort(function (a, b) {
      return new Date(a._date) - new Date(b._date);
    });
    completedTaskArr.sort(function (a, b) {
      return new Date(a._date) - new Date(b._date);
    });

    // update task list
    tasksView.innerHTML = "";
    for (const task of taskArr) {
      tasksView.appendChild(createTaskDiv(task));
    }
    for (const task of completedTaskArr) {
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
    if (task._completed) {
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
    const taskCards = tasksView.querySelectorAll(".task-card");
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
          const parentProjectIndex = allProject.findIndex((project) =>
            project.task.some((taskItem) => taskItem.id === task.id)
          );
          allProject[parentProjectIndex].completeTask(task);
        }
        taskCard.classList.add("complete");
      }
    }
  };

  const deleteTask = (task) => {
    console.log(task);
    for (const project of allProject) {
      // Delete not completed task
      project.task.forEach((el) => {
        if (task.id == el.id) {
          project.removeTask(task);
          tasksView.removeChild(
            document.querySelector(`[data-task-id="${task.id}"]`)
          );
        }
      });
      // Delete completed task
      project.completedTasks.forEach((el) => {
        if (task.id == el.id) {
          project.removeTask(task);
          tasksView.removeChild(
            document.querySelector(`[data-task-id="${task.id}"]`)
          );
        }
      });
    }
  };
  const editTask = (task) => {
    dialog.innerHTML = "";
    dialog.classList.remove(".create-project");
    dialog.appendChild(DOM.modal.editTask(task));
    dialog.showModal();
  };

  const modal = {
    createProjectForm() {
      // Create form element
      const form = document.createElement("form");
      form.setAttribute("action", "");
      form.setAttribute("method", "dialog");
      form.classList.add("create-project");

      // Create close button
      const closeButton = document.createElement("button");
      closeButton.setAttribute("type", "button");
      closeButton.className = "close-modal-btn";
      closeButton.innerHTML = '<i class="fa-solid fa-xmark"></i>';
      closeButton.addEventListener("click", () => dialog.close());
      form.appendChild(closeButton);

      // Create title
      const title = document.createElement("h2");
      title.className = "dialog-title";
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
    },
    editTask(task) {
      return this.createTaskForm("Edit Task", "edit", task);
    },
    createTask() {
      return this.createTaskForm("Create Task", "create");
    },
    createTaskForm(dialogTitle, type, task) {
      // Create form element
      const form = document.createElement("form");
      form.setAttribute("action", "");
      form.setAttribute("method", "dialog");

      // Create close button
      const closeButton = document.createElement("button");
      closeButton.setAttribute("type", "button");
      closeButton.className = "close-modal-btn";
      closeButton.innerHTML = '<i class="fa-solid fa-xmark"></i>';
      closeButton.addEventListener("click", () => dialog.close());
      form.appendChild(closeButton);

      // Create title
      const title = document.createElement("h2");
      title.className = "dialog-title";
      title.textContent = dialogTitle;
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
      const parents = allProject;
      for (const [index, parent] of parents.entries()) {
        const option = document.createElement("option");
        option.value = index;
        option.textContent = parent.name;
        // Edit
        if (task) {
          // Find parent object from task
          const parentProjectIndex = allProject.findIndex((project) =>
            project.task.some((taskItem) => taskItem.id === task.id)
          );
          if (parentProjectIndex === index) {
            // Select the correct index
            option.selected = true;
          }
          // Create
        } else {
          if (g_activeProject === "all") {
            // Selected project is all
            parentSelect.appendChild(option);
          } else {
            if (allProject.indexOf(g_activeProject) === index) {
              // Selected project
              option.selected = true;
            }
          }
        }
        parentSelect.appendChild(option);
      }
      parentLabel.appendChild(parentSelect);
      form.appendChild(parentLabel);

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
            allProject[parentSelect.value]
          );
        } else if (type === "edit") {
          domInterface.editTask(
            taskNameInput.value,
            taskDescTextarea.value,
            new Date(dueDateInput.value),
            prioritySelect.value,
            allProject[parentSelect.value],
            task
          );
        }
      });
      form.appendChild(submitButton);

      return form;
    },
  };

  return {
    updateProjectList,
    modal,
    sortTask,
  };
})();

const domInterface = (() => {
  // Create Project
  const createProject = (projectName) => {
    new Project(projectName);
    DOM.updateProjectList(allProject);
    console.log(allProject);
  };

  // Create Task
  const createTask = (
    title,
    desc = "Why didn't you give us description? Am i that worthless like our creator?",
    dueDate,
    priority,
    parentProject
  ) => {
    const newTask = new Task(title, desc, dueDate, priority);
    parentProject.addTask(newTask);
    sortController(parentProject);
  };

  // Edit Task
  const editTask = (title, desc, dueDate, priority, parentProject, task) => {
    const index = parentProject.task.indexOf(task);
    const completedIndex = parentProject.completedTasks.indexOf(task);
    console.log(index, completedIndex);
    // Edit not completed task
    if (index !== -1) {
      parentProject.task[index].title = title;
      parentProject.task[index].desc = desc;
      parentProject.task[index].dueDate = dueDate;
      parentProject.task[index].priority = priority;
      sortController(parentProject);
    } else {
      // Edit completed task
      parentProject.task[completedIndex].title = title;
      parentProject.task[completedIndex].desc = desc;
      parentProject.task[completedIndex].dueDate = dueDate;
      parentProject.task[completedIndex].priority = priority;
      sortController(parentProject);
    }
  };

  //
  return { createProject, createTask, editTask };
})();
