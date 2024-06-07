// Modularity hell yeah
// For easier management, some date-fns function are imported and immediately exported
import {
  add,
  isThisMonth,
  isThisWeek,
  isToday,
  format,
  formatDistanceToNow,
} from "date-fns";
import defaultData from "./default-data";

// Interface with localstorage
const getData = () => {
  return JSON.parse(localStorage.getItem("localData"));
};

const setData = (dataObj) => {
  return localStorage.setItem("localData", JSON.stringify(dataObj));
};

const clearData = () => {
  localStorage.removeItem("localData");
};

const createDefaultData = () => {
  localStorage.setItem("localData", JSON.stringify(defaultData));
};

// Date Formatter
const formatHourAndDate = function (date) {
  return format(date, "H':'mm EEE MMM yyyy");
};
const formatDate = function (date) {
  return format(date, "EEE MMM yyy");
};

export {
  // Localstorage
  getData,
  setData,
  clearData,
  createDefaultData,
  // Date-fns
  add,
  formatDate,
  formatHourAndDate,
  formatDistanceToNow,
  isToday,
  isThisWeek,
  isThisMonth,
};
