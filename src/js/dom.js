/* REFACTORED CODES */
import {
  formatDistanceToNow,
  isToday,
  isThisWeek,
  isThisMonth,
} from "date-fns";
import { elementFactory, modal } from "./dom-create";
import { Project, Task } from "./project";
import { clearData, setData, updateLocalStorage } from "./local-storage";
export {
  updateUi,
  templateEl,
  selectedProject,
  setSelectedProject,
  timePeriod,
};

// Make their own scope to call it from string
const dateFnsScope = {
  isToday,
  isThisWeek,
  isThisMonth,
};

// Dom Template elements

const templateEl = {
  projectsView: document.querySelector(".project-content"),
  tasksView: document.querySelector(".task-content"),
  newProjectBtn: document.querySelector(".new-project-btn"),
  newTaskBtn: document.querySelector(".new-task-btn"),
  dialog: document.querySelector("dialog"),
  sortSelect: document.getElementById("sort"),
  timePeriodBtns: document.querySelectorAll(".category-btn"),
};

// ####################################################
// Template event listener
templateEl.sortSelect.addEventListener("change", () => {
  updateUi.task(selectedProject);
});

templateEl.timePeriodBtns.forEach((el) => {
  el.addEventListener("click", (e) => {
    // Remove active class when clicking other category
    for (const btn of templateEl.timePeriodBtns) {
      btn.classList.remove("active");
    }
    e.target.classList.add("active");
    timePeriod = el.dataset.category;
    updateUi.task(selectedProject);
  });
});
templateEl.newTaskBtn.addEventListener("click", () => {
  if (Project.projectList.length === 0) {
    alert("You need to have at least 1 project!");
    templateEl.dialog.innerHTML = "";
    templateEl.dialog.appendChild(modal.project());
    templateEl.dialog.showModal();
    return;
  }
  templateEl.dialog.innerHTML = "";
  templateEl.dialog.appendChild(modal.createTask());
  templateEl.dialog.showModal();
});

templateEl.newProjectBtn.addEventListener("click", () => {
  templateEl.dialog.innerHTML = "";
  templateEl.dialog.appendChild(modal.project());
  templateEl.dialog.showModal();
});

// ####################################################
// UPDATE UI
let selectedProject = "all"; // Selected project button
function setSelectedProject(val) {
  selectedProject = val;
}
let timePeriod = "all"; // Selected time period

const updateUi = (() => {
  // Update task can either take a project or show all
  const task = (project) => {
    templateEl.tasksView.innerHTML = "";
    if (project === "all") {
      const taskToShow = [];
      const completedTaskToShow = [];

      // Merging all task into one
      for (const project of Project.projectList) {
        for (const task of project.tasks) {
          taskToShow.push(task);
        }
      }

      // Completed tasks loaded later to make them appear at the bottom
      for (const project of Project.projectList) {
        for (const task of project.completedTasks) {
          completedTaskToShow.push(task);
        }
      }
      sortTasks(filterTime(taskToShow));
      sortTasks(filterTime(completedTaskToShow));

      // Merging only selected project
    } else {
      sortTasks(filterTime(project.tasks));
      sortTasks(filterTime(project.completedTasks));
    }
  };

  const filterTime = (taskToShow) => {
    if (timePeriod === "all") {
      return taskToShow;

      // Filter to fit timePeriod
    } else {
      const sorted = taskToShow.filter((el) =>
        dateFnsScope[timePeriod](el._date)
      );
      return sorted;
    }
  };

  const sortTasks = (taskArr) => {
    const sortVal = templateEl.sortSelect.value;

    if (sortVal === "priority") {
      taskArr.sort(function (a, b) {
        return b.priority - a.priority;
      });
      for (const task of taskArr) {
        templateEl.tasksView.appendChild(elementFactory.createTask(task));
      }
    } else if (sortVal === "closest") {
      taskArr.sort(function (a, b) {
        return new Date(a._date) - new Date(b._date);
      });
      for (const task of taskArr) {
        templateEl.tasksView.appendChild(elementFactory.createTask(task));
      }
    }
  };

  // ############
  // Project

  const project = () => {
    templateEl.projectsView.innerHTML = "";
    templateEl.projectsView.appendChild(elementFactory.createAllProjectBtn());
    for (const project of Project.projectList) {
      templateEl.projectsView.appendChild(
        elementFactory.createProjectBtn(project)
      );
    }
  };

  return { task, sortTasks, project };
})();

// ###################################################
// Element creator

const domInterface = (() => {
  // Create Project
  const createProject = (projectName) => {
    new Project(projectName);
    DOM.updateProjectList(Project.projectList);
    // Update localStorage
    updateLocalStorage();
  };

  // Create Task
  const createTask = (title, desc, dueDate, priority, parentProject) => {
    const newTask = new Task(title, desc, dueDate, priority);
    parentProject.addTask(newTask);
    updateUi.task(parentProject);
    // Update localStorage
    updateLocalStorage();
  };

  // Edit Task
  const editTask = (
    title,
    desc,
    dueDate,
    priority,
    completed,
    parentProject,
    task
  ) => {
    const index = parentProject.tasks.indexOf(task);
    // Edit not completed task
    if (!completed) {
      parentProject.tasks[index].title = title;
      parentProject.tasks[index].desc = desc;
      parentProject.tasks[index].dueDate = dueDate;
      parentProject.tasks[index].priority = priority;
      updateUi.task(parentProject);
    }
    // Update localStorage
    updateLocalStorage();
  };

  //
  return { createProject, createTask, editTask };
})();
