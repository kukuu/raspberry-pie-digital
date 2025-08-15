const express = require('express');
const promClient = require('prom-client');
const ConveyorSimulator = require('./lib/conveyor');
const WorkerSystem = require('./lib/workers');
const cors = require('cors');

// Initialize Express
const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Prometheus Metrics
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

// Initialize Systems
const conveyor = new ConveyorSimulator();
const workers = Array(3).fill().map(() => new WorkerSystem());

// API Endpoints
app.get('/', (req, res) => {
  res.send(`
    <h1>Conveyor Belt Control</h1>
    <button onclick="runSimulation()">Run Simulation</button>
    <button onclick="resetSimulation()">Reset</button>
    <pre id="output"></pre>
    <script>
      async function runSimulation() {
        const response = await fetch('/api/simulate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ steps: 100 })
        });
        const data = await response.json();
        document.getElementById('output').textContent = JSON.stringify(data, null, 2);
      }
      async function resetSimulation() {
        const response = await fetch('/api/reset', { method: 'POST' });
        const data = await response.json();
        document.getElementById('output').textContent = "System reset: " + JSON.stringify(data, null, 2);
      }
    </script>
  `);
});

app.get('/metrics', async (req, res) => {
  try {
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
    }

    // Update metrics
    productsCounter.inc(conveyor.productsC - initialProducts);
    componentsGauge.set({ type: 'A' }, conveyor.unusedA);
    componentsGauge.set({ type: 'B' }, conveyor.unusedB);

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

// Helper Functions
function calculateEfficiency() {
  const total = conveyor.unusedA + conveyor.unusedB + conveyor.productsC;
  return total > 0 ? (conveyor.productsC / total * 100).toFixed(2) : 0;
}

// Error Handling
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

// Start Server
app.listen(port, () => {
  console.log(`\nConveyor Belt API running on port ${port}`);
  console.log(`\nEndpoints:
  - GET  /               : Web Interface
  - POST /api/simulate   : Run simulation
  - POST /api/reset      : Reset system
  - GET  /metrics        : Prometheus metrics\n`);
});
