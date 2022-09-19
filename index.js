const express = require('express');
const app = express();
var fs = require('fs');
var cors = require('cors');

const DATA_PATH = 'data/tasks.json';

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors({ origin: '*' }));

app.get('/', function (req, res, next) {
  console.log('reading file %o', DATA_PATH);
  const tasks = getTasks();
  res.json(tasks);
});

app.post('/create', (req, res, next) => {
  const name = req.body.name;
  //   const id = req.body.id;
  const id = Math.random().toString(36).substring(7) + new Date().getTime();
  const tasks = getTasks();
  tasks.push({ name, id });

  setTasks(tasks);

  res.json({ success: true, id });
  res.status(201);
});

app.delete('/delete', function (req, res, next) {
  const id = req.body.id;

  const tasks = getTasks().filter((task) => task.id != id);

  setTasks(tasks);

  res.json({ success: true });
});

app.put('/update', function (req, res, next) {
  const id = req.body.id;
  const name = req.body.name;
  console.log(req.body);
  console.log(name);
  console.log(id);
  const tasks = getTasks();
  console.log(tasks);

  //   const task = tasks.find((task) => task.id == id);
  const task = tasks.find((task) => task.id == id);

  console.log(task);
  if (task) {
    task.name = name;
    task.id = id;
  }
  console.log(tasks);
  setTasks(tasks);

  res.json({ success: true });
});

function getTasks() {
  const content = fs.readFileSync(DATA_PATH);
  return JSON.parse(content);
}

function setTasks(tasks) {
  const content = JSON.stringify(tasks, null, 2);
  fs.writeFileSync(DATA_PATH, content);
}

app.listen(3000, () => {
  console.log('LISTEN ON PORT 3000! ');
});
