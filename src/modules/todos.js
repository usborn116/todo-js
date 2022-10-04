const todoFactory = (title, description, dueDate, project, priority) => {
    return {
        title,
        description, 
        dueDate,
        project,
        priority,
        completed: false
    }
}

// filters the to-do array if any filter is given
// otherwise returns the uncategorized to-dos
const filterTodos = (arr, filter = "") => {
    let todos = arr.filter(todo => todo.project === filter);
    return sortTodos(todos);
}

// sorts the to-dos 
const sortTodos = (arr) => {
    return arr.sort((a,b) => a.dueDate > b.dueDate ? 1 : -1)
}

// returns an array of unique project names
const getProjects = (arr) => {
    let projects = arr.map(todo => todo.project);
   return projects.filter((project, index) => projects.indexOf(project) == index && project !== "");  
}

// toggles the 'completed' property of an individual to-do item
const toggleCompleted = (arr, index) => {
    arr[index].completed = !arr[index].completed;
}

export { filterTodos, todoFactory , getProjects, toggleCompleted, sortTodos }