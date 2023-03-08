import Project, { Librarian, Todo } from './Classes';

export default class UI {
    static loadEventListeners() {
        const addProject = document.querySelector('#addproject');
        addProject.addEventListener('click', () => {
            const projects = document.querySelector('#projects');
            const projectForm = document.querySelector('#project-form');
            if (projectForm) {
                this.removeElement(projects, projectForm);
            }
            this.loadElement(projects, this.addProjectForm());
            this.projectEventListeners();
        });
    }

    static addTodoFunctions(object) {
        object.editTodo = (title, description, due, priority) => {
            object.title = title;
            object.description = description;
            object.due = due;
            object.priority = priority;
        };

        object.getTitle = () => object.title;

        object.getDesc = () => object.description;

        object.getDate = () => object.due;

        object.getPriority = () => object.priority;
    }

    static addProjectFunctions(object) {
        object.getTitle = () => object.title;

        object.getID = () => object.id;

        object.getTodos = () => object.Todos;

        object.appendTodo = (todo) => object.Todos.push(todo);
    }

    static loadElement(parent, element) {
        parent.appendChild(element);
    }

    static removeElement(parent, element) {
        parent.removeChild(element);
    }

    static removeAllChildren(parent) {
        while (parent.firstChild) {
            parent.firstChild.remove();
        }
    }

    static removeClassSelected(elementsArray) {
        for (let i = 0; i < elementsArray.length; i++) {
            elementsArray[i].classList.remove('selected');
        }
    }

    static projectEventListeners() {
        const projects = document.querySelector('#projects');
        const projectForm = document.querySelector('#project-form');
        const cancelBtn = document.querySelector('.cancelbtn');
        const createBtn = document.querySelector('.createbtn');
        createBtn.addEventListener('click', () => {
            const input = document.querySelector('#project-input');
            if (input.value === '') {
                // Do nothing
            } else {
                // Apend new project to librarian
                const newProject = new Project(input.value);
                Librarian.addProject(newProject);
                // Render all objects in librarian
                this.renderAllProjects();
                projects.removeChild(projectForm);
                UI.projectDeleteEventListener();
                // Delete everything from main
                const main = document.querySelector('main');
                this.removeAllChildren(main);
                // Save localStorage
                Librarian.saveAllProjects();
                // Give eventlisteners to project buttons
                const ProjectList = document.querySelectorAll('.project');
                ProjectList.forEach((project) => {
                    project.addEventListener('click', () => {
                        // Remove selected class from other projects/home
                        const DOMProjects =
                            document.querySelectorAll('.project');
                        const DOMHome = document.querySelectorAll('.home');
                        const main = document.querySelector('main');
                        this.removeClassSelected(DOMProjects);
                        this.removeClassSelected(DOMHome);
                        // Add selected class
                        project.classList.add('selected');
                        const clickedProject = project.firstChild.textContent;
                        // Remove everything from main
                        this.removeAllChildren(main);
                        // Load todos first
                        const foundProject = this.findProject(clickedProject);
                        this.renderProjectTodos(foundProject);
                        // Load add todo button
                        main.appendChild(this.renderAddTodo());
                        // Add eventlisteners
                        this.addTodoEventListener();
                        this.addDetailsEventListener();
                        this.editTodoEventListener();
                        this.todoDeleteEventListener();
                    });
                });
            }
        });
        cancelBtn.addEventListener('click', () => {
            projects.removeChild(projectForm);
        });
    }

    static startupEventListener() {
        UI.projectDeleteEventListener();
        const ProjectList = document.querySelectorAll('.project');
        ProjectList.forEach((project) => {
            project.addEventListener('click', () => {
                // Remove selected class from other projects/home
                const DOMProjects =
                    document.querySelectorAll('.project');
                const DOMHome = document.querySelectorAll('.home');
                const main = document.querySelector('main');
                this.removeClassSelected(DOMProjects);
                this.removeClassSelected(DOMHome);
                // Add selected class
                project.classList.add('selected');
                const clickedProject = project.firstChild.textContent;
                // Remove everything from main
                this.removeAllChildren(main);
                // Load todos first
                const foundProject = this.findProject(clickedProject);
                this.renderProjectTodos(foundProject);
                // Load add todo button
                main.appendChild(this.renderAddTodo());
                // Add eventlisteners
                this.addTodoEventListener();
                this.addDetailsEventListener();
                this.editTodoEventListener();
                this.todoDeleteEventListener();
            });
        });
    }

    static addTodoEventListener() {
        const todobtn = document.querySelector('#todobtn');
        const body = document.querySelector('body');

        function handleClose() {
            const body = document.querySelector('body');
            const taskForm = document.querySelector('#task-form');
            body.removeChild(taskForm);
        }

        function handleCreate() {
            // Get form data from user
            const title = document.querySelector('#title');
            const desc = document.querySelector('#description');
            const date = document.querySelector('#due');
            // Priority options
            const low = document.querySelector('#option1');
            const medium = document.querySelector('#option2');
            const high = document.querySelector('#option3');
            let selectedPriority = null;
            // console.log(title.value, desc.value, date.value);
            if (low.checked) {
                selectedPriority = 'Low';
            } else if (medium.checked) {
                selectedPriority = 'Medium';
            } else if (high.checked) {
                selectedPriority = 'High';
            }
            // Find the project that is selected
            const selectedProject = UI.findSelectedProject();
            // Create new todo
            const foundProject = UI.findProject(
                selectedProject.firstChild.textContent
            );
            const newTodo = new Todo(
                title.value,
                desc.value,
                date.value,
                selectedPriority
            );
            foundProject.appendTodo(newTodo);
            // Remove all child elements
            const main = document.querySelector('main');
            UI.removeAllChildren(main);
            // Render todos
            UI.renderProjectTodos(foundProject);
            // Render addtodo button
            main.append(UI.renderAddTodo());
            // Add eventlisteners back
            UI.addTodoEventListener();
            UI.addDetailsEventListener();
            UI.editTodoEventListener();
            UI.todoDeleteEventListener();
            // Remove taskform from screen
            const body = document.querySelector('body');
            const taskForm = document.querySelector('#task-form');
            body.removeChild(taskForm);
            // Save localStorage
            Librarian.saveAllProjects();
        }
        todobtn.addEventListener('click', () => {
            // Render form
            body.append(this.addTodoForm());
            // Variables
            const closebtn = document.querySelector('#closebtn');
            const createbtn = document.querySelector('#task-create');
            // Event Listeners
            closebtn.addEventListener('click', handleClose);
            createbtn.addEventListener('click', handleCreate);
        });
    }

    static editTodoEventListener() {
        const EDITBTNS = document.querySelectorAll('.editbtn');
        EDITBTNS.forEach((button) => {
            button.addEventListener('click', () => {
                const TODOTITLE =
                    button.parentElement.parentElement.querySelector(
                        '.task-title'
                    );
                const SELECTEDPROJECT = this.findSelectedProject();
                const PROJECT = this.findProject(
                    SELECTEDPROJECT.firstChild.innerHTML
                );
                const TODO = this.findTodo(PROJECT, TODOTITLE.textContent);
                // Render edit form
                const body = document.querySelector('body');
                body.appendChild(
                    this.editTodoForm(
                        TODO.getTitle(),
                        TODO.getDesc(),
                        TODO.getDate()
                    )
                );
                // Handle priority buttons
                if (TODO.getPriority() === 'Low') {
                    document.querySelector('#option1').checked = true;
                } else if (TODO.getPriority() === 'Medium') {
                    document.querySelector('#option2').checked = true;
                } else if (TODO.getPriority() === 'High') {
                    document.querySelector('#option3').checked = true;
                }
                // Event Listeners
                const CLOSEBTN = document.querySelector('#edit-closebtn');
                const CONFIRMBTN = document.querySelector('#confirm-edit');
                CLOSEBTN.addEventListener('click', () => {
                    const body = document.querySelector('body');
                    const TASKEDITOR = document.querySelector('#task-editor');
                    body.removeChild(TASKEDITOR);
                });
                CONFIRMBTN.addEventListener('click', () => {
                    // Update TODO
                    const newTitle = document.querySelector('#edit-title');
                    const newDesc = document.querySelector('#edit-description');
                    const newDate = document.querySelector('#edit-due');
                    let newPriority = null;
                    if (document.querySelector('#option1').checked) {
                        newPriority = 'Low';
                    } else if (document.querySelector('#option2').checked) {
                        newPriority = 'Medium';
                    } else if (document.querySelector('#option3').checked) {
                        newPriority = 'High';
                    }
                    TODO.editTodo(
                        newTitle.value,
                        newDesc.value,
                        newDate.value,
                        newPriority
                    );
                    // Check if todo is updated
                    const clickedProject =
                        this.findSelectedProject().firstChild.textContent;
                    const foundProject = this.findProject(clickedProject);
                    // Render updated projects
                    const main = document.querySelector('main');
                    this.removeAllChildren(main);
                    this.renderProjectTodos(foundProject);
                    main.appendChild(this.renderAddTodo());
                    this.addTodoEventListener();
                    this.addDetailsEventListener();
                    this.editTodoEventListener();
                    // Remove edit todo form
                    const body = document.querySelector('body');
                    const taskEditor = document.querySelector('#task-editor');
                    body.removeChild(taskEditor);
                    // Save localStorage
                    Librarian.saveAllProjects();
                });
            });
        });
    }

    static addDetailsEventListener() {
        const DETAILBTNS = document.querySelectorAll('.detailsbtn');
        DETAILBTNS.forEach((button) => {
            button.addEventListener('click', () => {
                const buttonParent = button.parentElement.parentElement;
                const todoTitle =
                    buttonParent.querySelector('.task-title').textContent;
                const selectedProject =
                    document.querySelector('.selected').firstChild.textContent;
                const foundProject = this.findProject(selectedProject);
                const todo = this.findTodo(foundProject, todoTitle);
                const body = document.querySelector('body');
                body.appendChild(
                    this.detailsTemplate(
                        todo.getTitle(),
                        todo.getDesc(),
                        todo.getDate(),
                        todo.getPriority()
                    )
                );
                // Details eventlistener
                const closebtn = document.querySelector('#task-details-close');
                closebtn.addEventListener('click', () => {
                    const taskDetails = document.querySelector('#task-details');
                    const body = document.querySelector('body');
                    body.removeChild(taskDetails);
                });
            });
        });
    }

    static projectDeleteEventListener() {
        const DELETEBTNS = document.querySelectorAll('.closebtn');
        DELETEBTNS.forEach((button) => {
            button.addEventListener('click', () => {
                const DOMProject = button.parentElement;
                const projectTitle = DOMProject.firstChild.textContent;
                const project = this.findProject(projectTitle);
                const projectIndex = this.findProjectIndex(projectTitle);
                const PROJECTS = Librarian.getAllProjects();
                PROJECTS.splice(projectIndex, 1);
                // Render new projects
                this.renderAllProjects();
                // Event listeners
                UI.projectDeleteEventListener();
                // Save localStorage
                Librarian.saveAllProjects();
                const ProjectList = document.querySelectorAll('.project');
                ProjectList.forEach((projects) => {
                    projects.addEventListener('click', () => {
                        // Remove selected class from other projects/home
                        const DOMProjects =
                            document.querySelectorAll('.project');
                        const DOMHome = document.querySelectorAll('.home');
                        const main = document.querySelector('main');
                        this.removeClassSelected(DOMProjects);
                        this.removeClassSelected(DOMHome);
                        // Add selected class
                        projects.classList.add('selected');
                        const clickedProject = projects.firstChild.textContent;
                        // Remove everything from main
                        this.removeAllChildren(main);
                        // Load todos first
                        const foundProject = this.findProject(clickedProject);
                        this.renderProjectTodos(foundProject);
                        // Load add todo button
                        main.appendChild(this.renderAddTodo());
                        // Add eventlisteners
                        this.addTodoEventListener();
                        this.addDetailsEventListener();
                        this.editTodoEventListener();
                        this.todoDeleteEventListener();
                    });
                });
            });
        });
    }

    static todoDeleteEventListener() {
        const DELETEBTNS = document.querySelectorAll('.deletebtn');
        DELETEBTNS.forEach((button) => {
            button.addEventListener('click', () => {
                const todoContainer = button.parentElement.parentElement;
                const todoTitle = todoContainer.querySelector('.task-title');
                const selectedProjectTitle = this.findSelectedProject();
                const selectedProject = this.findProject(
                    selectedProjectTitle.firstChild.textContent
                );
                const todoIndex = this.findTodoIndex(
                    selectedProject,
                    todoTitle.textContent
                );
                const projectTodos = selectedProject.getTodos();
                // Delete todo using index
                projectTodos.splice(todoIndex, 1);
                // Render new page todos
                const main = document.querySelector('main');
                this.removeAllChildren(main);
                this.renderProjectTodos(selectedProject);
                main.appendChild(this.renderAddTodo());
                this.addTodoEventListener();
                this.addDetailsEventListener();
                this.editTodoEventListener();
                // Save localStorage
                Librarian.saveAllProjects();
            });
        });
    }

    static findTodoIndex(project, keyword) {
        const TODOS = project.getTodos();
        for (let i = 0; i < TODOS.length; i++) {
            if (TODOS[i].getTitle() === keyword) {
                return i;
            }
        }
    }

    static findProjectIndex(keyword) {
        const PROJECTS = Librarian.getAllProjects();
        for (let i = 0; i < PROJECTS.length; i++) {
            if (PROJECTS[i].getTitle() === keyword) {
                return i;
            }
        }
    }

    static findTodo(project, keyword) {
        const TODOS = project.getTodos();
        for (let i = 0; i < TODOS.length; i++) {
            if (TODOS[i].getTitle() === keyword) {
                return TODOS[i];
            }
        }
    }

    static findProject(keyword) {
        const ALLPROJECTS = Librarian.getAllProjects();
        for (let i = 0; i < ALLPROJECTS.length; i++) {
            if (ALLPROJECTS[i].getTitle() === keyword) {
                return ALLPROJECTS[i];
            }
        }
    }

    static findSelectedProject() {
        const DOMProjects = document.querySelectorAll('.project');
        let selectedProject = null;
        DOMProjects.forEach((project) => {
            if (project.classList.contains('selected')) {
                selectedProject = project;
            }
        });
        return selectedProject;
    }

    static renderAddTodo() {
        // Create elements
        const container = document.createElement('div');
        const span = document.createElement('span');
        const div = document.createElement('div');
        // Set attributes
        container.setAttribute('id', 'todobtn');
        span.classList.add('material-symbols-outlined');
        span.textContent = 'add';
        div.textContent = 'Add Task';
        // Append children
        container.append(span, div);
        // Return
        return container;
    }

    static renderProjectTodos(project) {
        const TODOS = project.getTodos();
        const container = document.querySelector('main');
        for (let i = 0; i < TODOS.length; i++) {
            const TITLE = TODOS[i].getTitle();
            const DATE = TODOS[i].getDate();
            const PRIORITY = TODOS[i].getPriority();
            container.appendChild(this.todoTemplate(TITLE, DATE, PRIORITY));
        }
    }

    static renderAllProjects() {
        const PROJECTS = Librarian.getAllProjects();
        const DOMContainer = document.querySelector('#projects-list');
        console.log(PROJECTS);
        // Remove any existing children from DOM projects container
        this.removeAllChildren(DOMContainer);
        // Now render everything in the library projects array
        for (let i = 0; i < PROJECTS.length; i++) {
            const DOMProject = this.addProject(PROJECTS[i].getTitle());
            DOMContainer.appendChild(DOMProject);
        }
    }

    static addProject(title) {
        // Create elements
        const container = document.createElement('div');
        const span = document.createElement('span');
        const div = document.createElement('div');
        // Set attributes
        div.setAttribute('id', 'project-text');
        container.classList.add('project');
        span.classList.add('material-symbols-outlined');
        span.classList.add('closebtn');
        div.textContent = title;
        span.textContent = 'close';
        // Append children
        container.append(div, span);
        // Return
        return container;
    }

    static editTodoForm(title, description, date) {
        const container = document.createElement('div');
        container.setAttribute('id', 'task-editor');
        container.innerHTML = `<div>
        <div id="task-header">
            <h2>Edit Task</h2>
            <span class="material-symbols-outlined" id="edit-closebtn">
                close
            </span>
        </div>
        <div>
            <label for="title">Title</label>
            <input id="edit-title" maxlength="16" type="text" value="${title}"/>
        </div>
        <div>
            <label for="description">Description</label>
            <input id="edit-description" type="text" value="${description}"/>
        </div>
        <div>
            <label for="due">Date</label>
            <input id="edit-due" type="date" value="${date}"/>
        </div>
        <div>
            <label for="priority-select">Priority</label>
            <div id="edit-priority-select">
                <input
                    type="radio"
                    class="btn-check"
                    name="options"
                    id="option1"
                    autocomplete="off" value="Low" />
                <label class="btn btn-outline-success" for="option1"
                    >Low</label
                >

                <input
                    type="radio"
                    class="btn-check"
                    name="options"
                    id="option2"
                    autocomplete="off" value="Medium" />
                <label class="btn btn-outline-warning" for="option2"
                    >Medium</label
                >

                <input
                    type="radio"
                    class="btn-check"
                    name="options"
                    id="option3"
                    autocomplete="off" value="High" />
                <label class="btn btn-outline-danger" for="option3"
                    >High</label
                >
            </div>
        </div>
        <div id="task-buttons">
            <button id="confirm-edit"
                type="button"
                class="btn btn-outline-primary btn-lg">
                Confirm
            </button>
        </div>
    </div>`;
        return container;
    }

    static todoTemplate(title, date, priority) {
        let buttonColor = null;
        if (priority === 'Low') {
            buttonColor = 'success';
        } else if (priority === 'Medium') {
            buttonColor = 'warning';
        } else if (priority === 'High') {
            buttonColor = 'danger';
        }
        const todoContainer = document.createElement('div');
        todoContainer.classList.add('task');
        todoContainer.classList.add(`task-${priority}`);
        const taskBody = `<div>
        <span
            class="material-symbols-outlined no-fill"
            id="completebtn">
            radio_button_unchecked
        </span>
        <div class="task-title">${title}</div>
    </div>
    <div>
        <button class="btn btn-outline-${buttonColor} btn-sm detailsbtn">
            DETAILS
        </button>
        <div class="task-date">${date}</div>
        <span class="material-symbols-outlined no-fill editbtn">
            edit
        </span>
        <span class="material-symbols-outlined no-fill deletebtn">
            delete
        </span>
    </div>`;
        todoContainer.innerHTML = taskBody;
        return todoContainer;
    }

    static addTodoForm() {
        const taskForm = `<div>
        <div id="task-header">
            <h2>New Task</h2>
            <span class="material-symbols-outlined" id="closebtn">
                close
            </span>
        </div>
        <div>
            <label for="title">Title</label>
            <input id="title" maxlength="16" type="text" />
        </div>
        <div>
            <label for="description">Description</label>
            <input id="description" type="text" />
        </div>
        <div>
            <label for="due">Date</label>
            <input id="due" type="date" />
        </div>
        <div>
            <label for="priority-select">Priority</label>
            <div id="priority-select">
                <input
                    type="radio"
                    class="btn-check"
                    name="options"
                    id="option1"
                    autocomplete="off" value="Low" />
                <label class="btn btn-outline-success" for="option1"
                    >Low</label
                >

                <input
                    type="radio"
                    class="btn-check"
                    name="options"
                    id="option2"
                    autocomplete="off" value="Medium" />
                <label class="btn btn-outline-warning" for="option2"
                    >Medium</label
                >

                <input
                    type="radio"
                    class="btn-check"
                    name="options"
                    id="option3"
                    autocomplete="off" value="High" />
                <label class="btn btn-outline-danger" for="option3"
                    >High</label
                >
            </div>
        </div>
        <div id="task-buttons">
            <button 
                id="task-create"
                type="button"
                class="btn btn-outline-primary btn-lg">
                Create
            </button>
        </div>
    </div>`;
        const container = document.createElement('div');
        container.setAttribute('id', 'task-form');
        container.innerHTML = taskForm;
        return container;
    }

    static detailsTemplate(title, description, date, priority) {
        const taskBody = `<div>
        <div id="task-details-header">
            <h2>Details</h2>
            <span class="material-symbols-outlined" id="task-details-close">close</span>
        </div>
        <div id="task-details-body">
            <h4>Title</h4>
            <div>${title}</div>
            <h4>Description</h4>
            <div>${description}</div>
            <h4>Date</h4>
            <div>${date}</div>
            <h4>Priority</h4>
            <div>${priority}</div>
        </div>
    </div>`;
        const container = document.createElement('div');
        container.setAttribute('id', 'task-details');
        container.innerHTML = taskBody;
        return container;
    }

    static addProjectForm() {
        // Create elements
        const projectForm = document.createElement('div');
        const projectButtons = document.createElement('div');
        const input = document.createElement('input');
        const createBtn = document.createElement('button');
        const cancelBtn = document.createElement('button');
        // Set attributes
        projectForm.setAttribute('id', 'project-form');
        input.setAttribute('type', 'text');
        input.setAttribute('id', 'project-input');
        input.setAttribute('maxlength', '16');
        projectButtons.setAttribute('id', 'project-buttons');
        createBtn.classList.add('createbtn');
        cancelBtn.classList.add('cancelbtn');
        createBtn.textContent = 'Create';
        cancelBtn.textContent = 'Cancel';
        // Append children
        projectForm.append(input, projectButtons);
        projectButtons.append(createBtn, cancelBtn);
        // Return projectForm
        return projectForm;
    }
}
