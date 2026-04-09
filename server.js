const express = require("express");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

let tasks = [];

// Home page
app.get("/", (req, res) => {
  let pending = tasks
    .filter(t => !t.completed)
    .map((t, i) => `
      <li>
        <span onclick="location.href='/toggle/${i}'" style="cursor:pointer;">
          ${t.text}
        </span>

        <a href="/edit/${i}">Edit</a>
        <a href="/delete/${i}">Delete</a>
      </li>
    `).join("");

  let completed = tasks
    .filter(t => t.completed)
    .map((t, i) => `
      <li style="text-decoration: line-through; color: gray;">
        ${t.text}
      </li>
    `).join("");

  res.send(`
    <html>
    <head>
      <title>Todo App</title>
      <style>
        body {
          font-family: Arial;
          background: #f4f4f4;
          padding: 20px;
        }
        h1 {
          text-align: center;
        }
        form {
          text-align: center;
          margin-bottom: 20px;
        }
        input {
          padding: 8px;
          width: 200px;
        }
        button {
          padding: 8px 12px;
        }
        .container {
          max-width: 500px;
          margin: auto;
          background: white;
          padding: 20px;
          border-radius: 10px;
        }
        li {
          margin: 10px 0;
        }
        a {
          margin-left: 10px;
          font-size: 12px;
        }
        .completed-section {
          margin-top: 30px;
        }
      </style>
    </head>

    <body>
      <div class="container">
        <h1>TODO App</h1>

        <form method="POST" action="/add">
          <input name="task" placeholder="Enter task" required />
          <button>Add</button>
        </form>

        <h3>Pending Tasks</h3>
        <ul>${pending}</ul>

        <div class="completed-section">
          <h3>Completed Tasks</h3>
          <ul>${completed}</ul>
        </div>
      </div>
    </body>
    </html>
  `);
});

// Add task
app.post("/add", (req, res) => {
  tasks.push({ text: req.body.task, completed: false });
  res.redirect("/");
});

// Delete task
app.get("/delete/:index", (req, res) => {
  tasks.splice(req.params.index, 1);
  res.redirect("/");
});

// Toggle complete
app.get("/toggle/:index", (req, res) => {
  tasks[req.params.index].completed = !tasks[req.params.index].completed;
  res.redirect("/");
});

// Edit page
app.get("/edit/:index", (req, res) => {
  let task = tasks[req.params.index];

  res.send(`
    <html>
    <body>
      <h2>Edit Task</h2>
      <form method="POST" action="/edit/${req.params.index}">
        <input name="task" value="${task.text}" />
        <button>Update</button>
      </form>
    </body>
    </html>
  `);
});

// Update task
app.post("/edit/:index", (req, res) => {
  tasks[req.params.index].text = req.body.task;
  res.redirect("/");
});

app.listen(3000, () => console.log("Running on http://localhost:3000"));
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running"));
