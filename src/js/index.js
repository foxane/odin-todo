import { Project, Task } from "./project";
import { defaultData } from "./default-data";
import { updateProjectList, updateTaskList, sortByPrio } from "./dom";
import "../css/main.css";

const projList = defaultData;
updateProjectList(projList);
updateTaskList(projList);
sortByPrio(projList);
console.log(projList);
