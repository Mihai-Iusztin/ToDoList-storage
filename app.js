function $(selector) {
  return document.querySelector(selector);
}

let allTasks = [];
let editId;

function getTaskHTML(task) {
  return (tasks.innerHTML += `
    <div class = "task" > 
    <span id = "taskname">
    ${task.name}
    </span>
    <div>
    <button data-id= ${task.id} class = delete>
    &#128465;
    </button>
    <button data-id= ${task.id} class = edit>
    &#9998
    </button>
    </div>
  </div>`);
}

function displayTasks(tasks) {
  let taskHTML = '';
  tasks.forEach((task) => {
    taskHTML += getTaskHTML(task);
  });
}

function getTaskValue() {
  const name = $('input[name=task]').value;
  const id = editId;
  const task = {
    name: name,
    id: id,
  };
  return task;
}

function loadTasks() {
  fetch('http://localhost:3000')
    .then((resp) => resp.json())
    .then((tasks) => {
      allTasks = tasks;
      displayTasks(tasks);
    });
}

function createTaskRequest(task) {
  return fetch('http://localhost:3000/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(task),
  });
}

function removeTaskRequest(id) {
  return fetch('http://localhost:3000/delete', {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ id: id }),
  }).then((r) => r.json());
}

function updateTaskRequest(task) {
  console.log('Update!');
  return fetch('http://localhost:3000/update', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(task),
  }).then((r) => r.json());
}

function setInputValue(task) {
  console.log(task);
  $('input[name = task]').value = task.name;
}

function startEditTask(id) {
  console.log(allTasks);
  const task = allTasks.find((task) => task.id === id);
  console.log(task);
  setInputValue(task);
  editId = id;
}

function submitForm(e) {
  e.preventDefault();
  let task = getTaskValue();

  if (editId) {
    console.log('edit!');
    updateTaskRequest(task).then((status) => {
      console.log(status);
      if (status.success) {
        location.reload();
        // loadTasks();
      }
    });
  } else {
    createTaskRequest(task)
      .then((r) => r.json())
      .then((status) => {
        console.log(status);
        if (status.success) {
          location.reload();
        }
      });
  }
}

function initEvents() {
  const form = $('form');
  const tasks = $('#tasks');
  form.addEventListener('submit', submitForm);
  tasks.addEventListener('click', (e) => {
    e.preventDefault();
    console.log(e);
    console.log(e.target);
    if (e.target.matches('button.delete')) {
      console.log(e.target);
      const id = e.target.getAttribute('data-id');
      console.log(id);
      removeTaskRequest(id).then((status) => {
        console.log(status);
        if (status.success) {
          location.reload();
          //   loadTasks();
        }
      });
    } else if (e.target.matches('button.edit')) {
      console.log(e.target);
      const id = e.target.getAttribute('data-id');
      console.log(id);
      startEditTask(id);
    }
  });
}

initEvents();
loadTasks();
