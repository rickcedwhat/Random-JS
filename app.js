import Course from './CustomTypes/Course.js';
import CourseType from './CustomTypes/CourseType.js';
import Student from './CustomTypes/Student.js';
import Task from './CustomTypes/Task.js';
import User from './CustomTypes/User.js';
//import Worker from './CustomTypes/Worker.js';
import WorkerAmount from './CustomTypes/WorkerAmount.js';
import WorkerArea from './CustomElements/WorkerArea.js';
import UserAvatar from './CustomElements/UserAvatar.js';
import * as utilityFunctions from './utilityFunctions.js';

Object.values(utilityFunctions).forEach(func => {
  window[func.name] = func;
});

const privateData = new WeakMap();

const customObjectsCache = new WeakMap();

//custom types
window.Course = Course;
window.CourseType = CourseType;
window.Student = Student;
window.Task = Task;
window.User = User;
//window.Worker = Worker;
window.WorkerAmount = WorkerAmount;
//custom elements
window.UserAvatar = UserAvatar;
window.WorkerArea = WorkerArea;
//weak maps
//window.privateData = privateData;
//window.customObjectsCache = customObjectsCache;