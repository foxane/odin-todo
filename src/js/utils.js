import { format, formatDistanceToNow } from "date-fns";

// Interface with localstorage
const getData = () => {
  return JSON.parse(localStorage.getItem("fxn-todo"));
};

const setData = (dataObj) => {
  return localStorage.setItem("fxn-todo", JSON.stringify(dataObj));
};

const clearData = () => {
  localStorage.removeItem("fxn-todo");
};

// Date Formatter
const formatDate = function (validDate) {
  return format(validDate, "H':'mm EEE MMM yyyy");
};

const formatDistance = function (toCompare) {
  return formatDistanceToNow(toCompare);
};

export { getData, setData, clearData, formatDate, formatDistance };
