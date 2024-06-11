import { Project, Task } from "./project";
import { DOM, domInterface, sortController } from "./dom";
import "../css/main.css";
import { refreshInstance } from "./local-storage";
import { defaultData } from "./default-data";
export { allProject };

let allProject;

// Init
if (localStorage.getItem("data")) {
  console.log(typeof localStorage.getItem("data"));
  init(Project.projectList);
} else {
  console.log("data not found");
  init(defaultData);
}

function init(value) {
  refreshInstance();
  allProject = value;
  DOM.updateProjectList(allProject);
  sortController("all");
}

console.log(localStorage.getItem("data"));
