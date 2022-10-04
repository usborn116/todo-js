const container = document.querySelector('.notification-container');

function showNotification(action){
    container.textContent = `🎉 Task ${action}!`;
    container.classList.add('notification-active');
    setTimeout(closeNotification, 3000);

}

function closeNotification(){
    container.classList.remove('notification-active');
}

export { showNotification }