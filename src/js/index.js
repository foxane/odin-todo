import "../css/main.css";
import {
  createProject,
  deleteProject,
  createTask,
  deleteTask,
} from "./project";
import "./utils";
import { clearData, createDefaultData, getData } from "./utils";
import "./dom";
import { updateProject, updateTask } from "./dom";

clearData();
// Initialize or retrieve data from localStorage
const projectList = (() => {
  if (getData()) {
    console.log("Data exist");
    return getData();
  } else {
    console.log("Data dont exit, cretaed new");
    createDefaultData();
    return getData();
  }
})();
console.log(projectList);
updateProject(projectList);
updateTask(projectList);
