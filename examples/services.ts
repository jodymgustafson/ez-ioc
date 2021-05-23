import { EzIocContainer } from "..";

type User = {
    name: string;
    id: string;
};

interface UserService {
    getUser(id: string): User;
}

class MockUserService implements UserService {
    private users: User[] = [
        { name: "User1", id: "1" },
        { name: "User2", id: "2" },
        { name: "User3", id: "3" },
    ];

    getUser(id: string): User {
        return this.users.find(u => u.id === id);
    }
}

type Task = {
    name: string;
    completed: boolean;
    userId: string;
};

interface TaskService {
    getTasks(): Task[];
    getUser(task: Task): User;
}

class MockTaskService implements TaskService {
    constructor(readonly userSvc: UserService) {}

    getUser(task: Task): User {
        return this.userSvc.getUser(task.userId);
    }

    getTasks(): Task[] {
        return [
            { name: "Task1", completed: false, userId: "1" },
            { name: "Task2", completed: true, userId: "1" },
            { name: "Task3", completed: false, userId: "2" },
        ];
    }
}

interface TaskList {
    getTaskTitles(): string[];
}

class MockTaskList implements TaskList {
    constructor(readonly taskSvc: TaskService) {}

    getTaskTitles(): string[] {
        const tasks = this.taskSvc.getTasks();
        return tasks.map(t => `${t.name} assigned to ${this.taskSvc.getUser(t).name}`);
    }
}

const TYPES = {
    App: Symbol.for("App"),
    TaskService: Symbol.for("TaskService"),
    UserService: Symbol.for("UserService"),
};

const container = new EzIocContainer()
    .bind<TaskList>(TYPES.App, MockTaskList, [TYPES.TaskService])
    .bind<TaskService>(TYPES.TaskService, MockTaskService, [TYPES.UserService])
    .bind<UserService>(TYPES.UserService, MockUserService);

const app: TaskList = container.resolve(TYPES.App);
const tasks = app.getTaskTitles();
console.log(tasks);
