"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("..");
class MockUserService {
    constructor() {
        this.users = [
            { name: "User1", id: "1" },
            { name: "User2", id: "2" },
            { name: "User3", id: "3" },
        ];
    }
    getUser(id) {
        return this.users.find(u => u.id === id);
    }
}
class MockTaskService {
    constructor(userSvc) {
        this.userSvc = userSvc;
    }
    getUser(task) {
        return this.userSvc.getUser(task.userId);
    }
    getTasks() {
        return [
            { name: "Task1", completed: false, userId: "1" },
            { name: "Task2", completed: true, userId: "1" },
            { name: "Task3", completed: false, userId: "2" },
        ];
    }
}
class MockTaskList {
    constructor(taskSvc) {
        this.taskSvc = taskSvc;
    }
    getTaskTitles() {
        const tasks = this.taskSvc.getTasks();
        return tasks.map(t => `${t.name} assigned to ${this.taskSvc.getUser(t).name}`);
    }
}
const TYPES = {
    App: Symbol.for("App"),
    TaskService: Symbol.for("TaskService"),
    UserService: Symbol.for("UserService"),
};
const container = new __1.EzIocContainer()
    .bind(TYPES.App, MockTaskList, [TYPES.TaskService])
    .bind(TYPES.TaskService, MockTaskService, [TYPES.UserService])
    .bind(TYPES.UserService, MockUserService);
const app = container.resolve(TYPES.App);
const tasks = app.getTaskTitles();
console.log(tasks);
//# sourceMappingURL=services.js.map