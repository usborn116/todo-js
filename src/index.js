import "./style.css";
import { loadPage, loadProjects, populateEditForm, populateProjectOptions } from './modules/display-controller';
import { todoFactory, getProjects, toggleCompleted, filterTodos, sortTodos } from './modules/todos';
import { showNotification } from './modules/notifications';

// form elements and buttons

function component() {
    const element = document.createElement('div');
 
    // Lodash, now imported by this script
    element.innerHTML = _.join(['Hello', 'webpack'], ' ');
   element.classList.add('hello');
 
    return element;
  }

  
const newTodoButton = document.getElementById('new-todo-button');
const newTodoForm = document.querySelector('.new-todo form');
const editTodoForm = document.querySelector('.edit-todo form');
const closeNewForm = document.querySelector('.new-todo span');
const closeEditForm = document.querySelector('.edit-todo span');
const deleteButton = document.getElementById('delete-button');

// sidebar navigation links
const homeLink = document.getElementById('home');
const uncategorizedLink = document.getElementById('uncategorized');
// sidebar project inks
const projectsLink = document.getElementById('projects');
const projectList = document.querySelector('.project-list');

const todoWrapper = document.querySelector('.todo-wrapper');

// checks for any available data in the local storage
// otherwise assigns it to an empty object to prevent any rendering errors
const todos = JSON.parse(localStorage.getItem('todos')) || [];
let projects = getProjects(todos);


function addTodo (e) {
    e.preventDefault();
    
    let title = this.querySelector('[name=title]').value;
    let description = this.querySelector('[name=description]').value;
    let priority = this.querySelector('[name=priority]').value;
    let date = this.querySelector('[name=date]').value;
    let selectProject = this.querySelector('select').value;
    let newProject = this.querySelector('[name=new-project]').value;

    let project;

    if(newProject.length > 0){
         project = newProject;
    }else{  
        project = selectProject;
    }

    let todo = todoFactory(title, description, date, project, priority);
    todos.push(todo);
    localStorage.setItem('todos', JSON.stringify(todos));
    toggleNewModal();

    // checks if new to-do has an assigned project
    // then renders the project view or the home page
    if (project.length > 0) {
        loadPage(project, filterTodos(todos, project));
        projects = getProjects(todos);
        loadProjects(projects);
        setSidebarListeners(); 
    } else {
        loadPage('Home', todos)
    }


    this.reset();
}

function editTodo (e) {
    e.preventDefault();
    
    let title = this.querySelector('[name=title]').value;
    let description = this.querySelector('[name=description]').value;
    let date = this.querySelector('[name=date]').value;
    let priority = this.querySelector('[name=priority]').value;
    let selectProject = this.querySelector('select').value;
    let newProject = this.querySelector('[name=new-project]').value;
    let project;

    if(newProject.length > 0){
        project = newProject;
   }else{  
       project = selectProject;
   }

    let index = this.querySelector('input[type = "hidden"]').value;

    let todo = todoFactory(title, description, date, project, priority);
    todos[index] = todo;
    localStorage.setItem('todos', JSON.stringify(todos));
    toggleEditModal();

    // checks if edited to-do has an assigned project
    // then renders the project view or the home page
    if(project.length > 0){
        loadPage(project, filterTodos(todos, project));
        projects = getProjects(todos);
        loadProjects(projects);
        setSidebarListeners(); 
    }else{
        loadPage('Home', todos)
    }

    showNotification('edited');

    this.reset();
}

function deleteTodo (e) {
    e.preventDefault();

    let index = document.querySelector('input[type = "hidden"]').value;
    todos.splice(index, 1)
    console.log(todos)
    toggleEditModal();

    loadPage('Home', todos)
}

// opens modal for the new to-do form
function toggleNewModal() {
    let modal = document.querySelector('.new-todo');
    let form = modal.querySelector('form');
    modal.classList.toggle('modal-active');
    populateProjectOptions(form, projects)
}
// opens modal for editing a to-do
function toggleEditModal(){
    let modal = document.querySelector('.edit-todo');
    modal.classList.toggle('modal-active');
}


// event delegation
// handle clicks for individual to-do items
function handleClick (e) {
    if (e.target.matches('input')) {
        let index = e.target.dataset.index;
        let item = this.querySelector(`.item${index}`)
        item.classList.toggle('completed');
        if(item.classList.contains('completed')){
            showNotification('completed');
        }
        toggleCompleted(todos, index);
        localStorage.setItem('todos', JSON.stringify(todos));
    } else if (e.target.matches('.edit-button')){
        let index = e.target.dataset.index;
        let item = todos[index];
        toggleEditModal();
        populateEditForm(index, item, projects);
    } else if (e.target.matches('.expand-button')){
        let item = e.target;
        let parent = item.parentNode;
        let details = parent.parentNode.querySelector('.details');
        details.classList.toggle('expand-details');
    }
}

// sets listeners for the navigation and the project links
const setSidebarListeners = () => {
    const sideLinks = document.querySelectorAll('.side-link');
    sideLinks.forEach(link => {
        link.addEventListener('click', () => {
            let current = document.querySelector('.active-link');
            if(current){
                current.classList.remove('active-link');
            }
            link.classList.add('active-link');
        })
    })
}

// submit listeners for forms
newTodoForm.addEventListener('submit', addTodo);
editTodoForm.addEventListener('submit', editTodo);
deleteButton.addEventListener('click', deleteTodo);

homeLink.addEventListener('click', () => loadPage('Home', todos));
uncategorizedLink.addEventListener('click', () => loadPage('Uncategorized', filterTodos(todos)));

newTodoButton.addEventListener('click', toggleNewModal);
closeNewForm.addEventListener('click', toggleNewModal);
closeEditForm.addEventListener('click', toggleEditModal);

todoWrapper.addEventListener('click', handleClick);

projectList.addEventListener('click', (e) => {
    if(e.target.matches('li')){
        let project = e.target.textContent;
        loadPage(project, filterTodos(todos, project));
    }
})

projectsLink.addEventListener('click',  () => {
    projectList.classList.toggle('expand');
});






// initializes the app with rendering the 'home' view
loadPage('Home', sortTodos(todos));
loadProjects(projects);
setSidebarListeners();
