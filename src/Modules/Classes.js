export default class Project {
    constructor(title, id) {
        this.title = title;
        this.id = id;
        this.Todos = [];
    }

    getTitle = () => this.title;

    getID = () => this.id;

    getTodos = () => this.Todos;

    appendTodo = (todo) => this.Todos.push(todo);
}

export class Todo {
    constructor(title, description, due, priority) {
        this.title = title;
        this.description = description;
        this.due = due;
        this.priority = priority;
    }

    editTodo = (title, description, due, priority) => {
        this.title = title;
        this.description = description;
        this.due = due;
        this.priority = priority;
    };

    getTitle = () => this.title;

    getDesc = () => this.description;

    getDate = () => this.due;

    getPriority = () => this.priority;
}

export class Librarian {
    static projects = [];

    static setProjects(projectArray)  {
        this.projects = projectArray;
    }

    static saveAllProjects() {
        localStorage.setItem('ALLPROJECTS', JSON.stringify(this.projects));
    }

    static getAllProjects() {
        return Librarian.projects;
    }

    static addProject(project) {
        this.projects.push(project);
    }
}
