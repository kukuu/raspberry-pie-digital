# Raspberry Pie Digital
A practical JavaScript steps to building a digital Raspberry Pie - a ToDo exercise  for building and testing a digital experience. 

## Practical step-by-step guide using JavaScript (Node.js) on a Raspberry Pi to build and test a simple ToDo App

**A -  Using API REST end-point**

_1. Set Up Raspberry Pi_

- Flash OS: Install Raspberry Pi OS (Lite or Desktop) using Raspberry Pi Imager.

- Enable SSH: Use sudo raspi-config to enable SSH for remote access.

- Update: Run sudo apt update && sudo apt upgrade -y.

_2. Install Node.js_

```
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs
node -v  # Verify installation (v18+)

```
_3. Create a Simple ToDo App_

Backend (Express.js)

i. Initialis project

,,,
mkdir todo-app && cd todo-app
npm init -y
npm install express body-parser

```

ii. Create server.js:

```
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.json());

let tasks = [];

// Add task
app.post('/tasks', (req, res) => {
  tasks.push(req.body.task);
  res.send(`Added: ${req.body.task}`);
});

// List tasks
app.get('/tasks', (req, res) => {
  res.json(tasks);
});

app.listen(3000, () => console.log('Server running on port 3000'));

```



**B -  Using a Custom JSON Object (list)**
