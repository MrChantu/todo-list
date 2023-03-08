import _ from 'lodash';
import * as bootstrap from 'bootstrap';
import './scss/styles.scss';

import UI from './Modules/UI';
import { Todo } from './Modules/Classes';

const init = (() => {
    UI.loadEventListeners();
    const myTodo = new Todo('Market', 'Get some bread', '3/15/2023', 'Low');
    //console.log(myTodo);
    //console.log(myTodo.getTitle());
    //console.log('init');
})();

// myTodo = new Todo('Market', 'Get some bread', '3/15/2023', 'Low');
