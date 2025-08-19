const express = require('express');
const promClient = require('prom-client');
const { ConveyorSimulator } = require('./lib/conveyor');
const { WorkerSystem } = require('./lib/workers');
const cors = require('cors');
const gpio = require('./lib/gpio');
const path = require('path');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const collectDefaultMetrics = promClient.collectDefaultMetrics;
collectDefaultMetrics({ timeout: 5000 });

const productsCounter = new promClient.Counter({
  name: 'conveyor_products_total',
  help: 'Total products manufactured'
});

const componentsGauge = new promClient.Gauge({
  name: 'conveyor_components_unused',
  help: 'Unused components count',
  labelNames: ['type']
});

const gpioStatus = new promClient.Gauge({
  name: 'gpio_status',
  help: 'Current GPIO pin states',
  labelNames: ['pin']
});

const conveyor = new ConveyorSimulator();
const workers = Array(3).fill().map((_, index) => {
  const worker = new WorkerSystem(index + 1);
  return worker;
});

// Store simulation history for the dashboard
let simulationHistory = [];

// Serve static files from the current directory
app.use(express.static(path.join(__dirname)));

// Route for the main control page
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Conveyor Belt Control</title>
        <style>
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                max-width: 800px;
                margin: 0 auto;
                padding: 20px;
                background: #f5f5f5;
                color: #333;
            }
            
            h1 {
                text-align: center;
                color: #2c3e50;
                margin-bottom: 20px;
            }
            
            .button-container {
                text-align: center;
                margin-bottom: 20px;
            }
            
            button {
                padding: 10px 20px;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                font-weight: bold;
                margin: 0 5px;
            }
            
            #runSimulation {
                background-color: #4CAF50;
                color: white;
            }
            
            #resetSimulation {
                background-color: #f44336;
                color: white;
            }
            
            #dashboardButton {
                background-color: #2196F3;
                color: white;
            }
            
            pre {
                background: #2c3e50;
                color: #ecf0f1;
                padding: 15px;
                border-radius: 5px;
                max-height: 400px;
                overflow-y: auto;
                white-space: pre-wrap;
            }
        </style>
    </head>
    <body>
        <h1>Conveyor Belt Control</h1>
        
        <div class="button-container">
            <button onclick="runSimulation()" id="runSimulation">Run Simulation</button>
            <button onclick="resetSimulation()" id="resetSimulation">Reset</button>
            <button onclick="goToDashboard()" id="dashboardButton">Simulation Dashboard</button>
        </div>
        
        <pre id="output">> Click "Run Simulation" to start</pre>

        <script>
            async function runSimulation() {
                try {
                    const response = await fetch('/api/simulate', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ steps: 100 })
                    });
                    const data = await response.json();
                    document.getElementById('output').textContent = JSON.stringify(data, null, 2);
                } catch (error) {
                    document.getElementById('output').textContent = 'Error: Could not connect to server. Make sure it\\'s running on port 5000.';
                }
            }
            
            async function resetSimulation() {
                try {
                    const response = await fetch('/api/reset', { method: 'POST' });
                    const data = await response.json();
                    document.getElementById('output').textContent = "System reset: " + JSON.stringify(data, null, 2);
                } catch (error) {
                    document.getElementById('output').textContent = 'Error: Could not connect to server. Make sure it\\'s running on port 5000.';
                }
            }
            
            function goToDashboard() {
                // Use a relative path that will be served by Express
                window.location.href = '/dashboard';
            }
        </script>
    </body>
    </html>
  `);
});

// Route for the dashboard page
app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'conveyor-belt-simulation-dashboard.html'));
});

// New API endpoint to get simulation history for the dashboard
app.get('/api/simulation-history', (req, res) => {
  try {
    res.json({
      success: true,
      history: simulationHistory,
      currentState: {
        productsC: conveyor.productsC,
        unusedA: conveyor.unusedA,
        unusedB: conveyor.unusedB,
        efficiency: calculateEfficiency()
      }
    });
  } catch (error) {
    console.error('Error getting simulation history:', error);
    res.status(500).json({ error: 'Failed to get simulation history' });
  }
});

app.get('/metrics', async (req, res) => {
  try {
    updateGpioMetrics();
    res.set('Content-Type', promClient.register.contentType);
    res.end(await promClient.register.metrics());
  } catch (err) {
    res.status(500).end(err);
  }
});

app.post('/api/simulate', (req, res) => {
  try {
    const { steps = 100 } = req.body;
    const results = [];
    const initialProducts = conveyor.productsC;

    for (let i = 0; i < steps; i++) {
      results.push(conveyor.simulateStep(workers));
      updateGpioMetrics();
    }

    productsCounter.inc(conveyor.productsC - initialProducts);
    componentsGauge.set({ type: 'A' }, conveyor.unusedA);
    componentsGauge.set({ type: 'B' }, conveyor.unusedB);
    
    // Store simulation results for the dashboard
    const simulationResult = {
      timestamp: new Date().toISOString(),
      steps: steps,
      productsC: conveyor.productsC,
      unusedA: conveyor.unusedA,
      unusedB: conveyor.unusedB,
      efficiency: calculateEfficiency(),
      lastSteps: results.slice(-5)
    };
    
    simulationHistory.push(simulationResult);
    
    // Keep only the last 10 simulations in history
    if (simulationHistory.length > 10) {
      simulationHistory = simulationHistory.slice(-10);
    }

    res.json({
      success: true,
      stepsCompleted: steps,
      productsC: conveyor.productsC,
      unusedA: conveyor.unusedA,
      unusedB: conveyor.unusedB,
      efficiency: calculateEfficiency(),
      lastSteps: results.slice(-5)
    });

  } catch (error) {
    console.error('Simulation error:', error);
    res.status(500).json({ error: 'Simulation failed' });
  }
});

app.post('/api/reset', (req, res) => {
  conveyor.reset();
  workers.forEach(worker => worker.reset());
  updateGpioMetrics();
  
  // Clear simulation history on reset
  simulationHistory = [];
  
  res.json({
    success: true,
    message: 'System reset complete',
    state: {
      productsC: conveyor.productsC,
      unusedA: conveyor.unusedA,
      unusedB: conveyor.unusedB
    }
  });
});

function calculateEfficiency() {
  const total = conveyor.unusedA + conveyor.unusedB + conveyor.productsC;
  return total > 0 ? (conveyor.productsC / total * 100).toFixed(2) : 0;
}

function updateGpioMetrics() {
  if (!gpio.mockMode) {
    try {
      gpioStatus.set({ pin: 'belt_active' }, gpio.leds.beltActive.readSync());
      workers.forEach((worker, i) => {
        gpioStatus.set(
          { pin: `worker_${i+1}` }, 
          gpio.leds[`worker${i+1}`].readSync()
        );
      });
    } catch (err) {
      console.error('GPIO metrics update failed:', err);
    }
  } else {
    gpioStatus.set({ pin: 'belt_active' }, 1);
    workers.forEach((_, i) => {
      gpioStatus.set({ pin: `worker_${i+1}` }, 0);
    });
  }
}

app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(port, () => {
  console.log(`\nConveyor Belt API running on port ${port}`);
  console.log(`\nEndpoints:
  - GET  /                     : Web Interface
  - GET  /dashboard            : Dashboard page
  - GET  /api/simulation-history : Get simulation history for dashboard
  - POST /api/simulate         : Run simulation
  - POST /api/reset            : Reset system
  - GET  /metrics              : Prometheus metrics\n`);
});

process.on('SIGINT', () => {
  gpio.cleanup();
  process.exit();
});
