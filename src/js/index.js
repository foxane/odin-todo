import { Project, Task } from "./project";
import { DOM, domInterface, sortController } from "./dom";
import "../css/main.css";
import { refreshInstance, updateLocalStorage } from "./local-storage";
import { defaultData } from "./default-data";

// Init
if (localStorage.getItem("data")) {
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
  DOM.updateProjectList(Project.projectList);
  sortController("all");
}
