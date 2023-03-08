import _ from 'lodash';
import * as bootstrap from 'bootstrap';
import './scss/styles.scss';

import UI from './Modules/UI';
import { Librarian, Todo } from './Modules/Classes';

const init = (() => {
    UI.loadEventListeners();
    if (localStorage.getItem('ALLPROJECTS')) {
        console.log('It exists');
        Librarian.setProjects(JSON.parse(localStorage.getItem('ALLPROJECTS')));
        // Give functions back
        const PROJECTS = Librarian.getAllProjects();
        for (let i = 0; i < PROJECTS.length; i++) {
            UI.addProjectFunctions(PROJECTS[i]);
        }
        for (let i = 0; i < PROJECTS.length; i++) {
            console.log(PROJECTS[i]);
            const PROJECTTODOS = PROJECTS[i].getTodos();
            for (let j = 0; j < PROJECTTODOS.length; j++) {
                if (PROJECTTODOS[j]) {
                    console.log(PROJECTTODOS);
                    UI.addTodoFunctions(PROJECTTODOS[j]);
                }
            }
        }
        // Render projects
        //console.log(Librarian.getAllProjects());
        UI.renderAllProjects();
        // Event listeners
        UI.startupEventListener();
    } else {
        console.log('Does not exist');
    }
})();

// myTodo = new Todo('Market', 'Get some bread', '3/15/2023', 'Low');
