import { Project, Task } from "./project";
// import { DOM, domInterface, sortController } from "./dom";
import { updateUi } from "./dom";
import "../css/main.css";
import { refreshInstance, updateLocalStorage } from "./local-storage";
import { defaultData } from "./default-data";

// Init
// Check if local data exist, if they are empty, init default
if (localStorage.getItem("data") && localStorage.getItem("data") !== "[]") {
  console.log("data found");
  init();
} else {
  console.log("data not found");
  Project.projectList = defaultData;
  updateLocalStorage();
  init();
}

function init() {
  refreshInstance();
  updateUi.project(Project.projectList);
  updateUi.task("all");
}
