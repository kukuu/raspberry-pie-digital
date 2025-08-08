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

**Backend (Express.js)**

i. Initialis project

```
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
**Frontend (HTML/JS)**

- Create public/index.html:

1. 
```
<!DOCTYPE html>
<html>
<body>
  <h1>ToDo App</h1>
  <input id="taskInput" placeholder="New task">
  <button onclick="addTask()">Add</button>
  <ul id="taskList"></ul>

  <script>
    async function addTask() {
      const task = document.getElementById('taskInput').value;
      await fetch('http://localhost:3000/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ task })
      });
      loadTasks();
    }

    async function loadTasks() {
      const response = await fetch('http://localhost:3000/tasks');
      const tasks = await response.json();
      document.getElementById('taskList').innerHTML = tasks.map(t => `<li>${t}</li>`).join('');
    }
    loadTasks();
  </script>
</body>
</html>
```

**Serve static files in server.js:**

```
app.use(express.static('public'));
```

_4. Run and Test_

i. Start the Server

```
node server.js

```

ii. Access the app:

Open a browser on the Pi (or another device on the same network) and navigate to:

```
http://<RASPBERRY_PI_IP>:3000

```
NB: Use:

```

hostname -I
```
to find the Pi’s IP.


_5. Extensions for Students_

- Add Persistence: Save tasks to a file or SQLite database.

- GPIO Integration: Use onoff npm package to trigger an LED when a task is added (for hardware interaction).

GPIO (General Purpose Input/Output) is a programmable interface on Raspberry Pi (and other hardware) that allows you to connect and control external electronic components (e.g., LEDs, sensors) by reading/writing digital signals (high/low voltage).

- Deploy: Use nginx as a reverse proxy to expose the app to the internet.

**B -  Using a Custom JSON Object (list)**
