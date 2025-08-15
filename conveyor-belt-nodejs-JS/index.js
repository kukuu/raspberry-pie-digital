const express = require('express');
const promClient = require('prom-client');
const ConveyorSimulator = require('./lib/conveyor');
const WorkerSystem = require('./lib/workers');
const cors = require('cors');
const path = require('path');

// Initialize Express
const app = express();
const port = process.env.PORT || 5000;

// ======================
// Middleware Setup
// ======================
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ======================
// Prometheus Metrics Setup
// ======================
const Registry = promClient.Registry;
const register = new Registry();
promClient.collectDefaultMetrics({ register });

// Custom Metrics
const productsCounter = new promClient.Counter({
  name: 'conveyor_products_total',
  help: 'Total number of products C manufactured',
  registers: [register]
});

const componentsGauge = new promClient.Gauge({
  name: 'conveyor_components_unused',
  help: 'Number of unused components',
  labelNames: ['type'],
  registers: [register]
});

const simulationCounter = new promClient.Counter({
  name: 'conveyor_simulations_run',
  help: 'Total number of simulations executed',
  registers: [register]
});

// ======================
// Simulation System Initialization
// ======================
const conveyor = new ConveyorSimulator();
const workers = Array(3).fill().map(() => new WorkerSystem());

// ======================
// API Endpoints
// ======================

// Health Check
app.get('/', (req, res) => {
  res.json({
    status: 'operational',
    message: 'Conveyor Belt Simulation API',
    endpoints: {
      simulate: 'POST /api/simulate',
      metrics: 'GET /metrics',
      reset: 'POST /api/reset'
    }
  });
});

// Prometheus Metrics
app.get('/metrics', async (req, res) => {
  try {
    res.set('Content-Type', register.contentType);
    res.end(await register.metrics());
  } catch (err) {
    res.status(500).end(err);
  }
});

// Simulation Endpoint
app.post('/api/simulate', (req, res) => {
  try {
    const { steps = 100 } = req.body;
    
    if (isNaN(steps) || steps < 1) {
      return res.status(400).json({ 
        error: 'Steps must be a positive number' 
      });
    }

    const results = [];
    let previousProducts = conveyor.productsC;

    for (let i = 0; i < steps; i++) {
      const state = conveyor.simulateStep(workers);
      results.push(state);
    }

    // Update metrics
    productsCounter.inc(conveyor.productsC - previousProducts);
    componentsGauge.set({ type: 'A' }, conveyor.unusedA);
    componentsGauge.set({ type: 'B' }, conveyor.unusedB);
    simulationCounter.inc();

    res.json({
      success: true,
      steps: steps,
      productsC: conveyor.productsC,
      unusedA: conveyor.unusedA,
      unusedB: conveyor.unusedB,
      efficiency: calculateEfficiency(conveyor),
      data: results.slice(-10) // Return last 10 steps for preview
    });

  } catch (error) {
    console.error('Simulation error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Simulation failed' 
    });
  }
});

// Reset Endpoint
app.post('/api/reset', (req, res) => {
  conveyor.reset();
  workers.forEach(worker => worker.reset());
  res.json({ 
    success: true,
    message: 'Simulation reset complete',
    metrics: {
      productsC: conveyor.productsC,
      unusedA: conveyor.unusedA,
      unusedB: conveyor.unusedB
    }
  });
});

// ======================
// Helper Functions
// ======================
function calculateEfficiency(conveyor) {
  const totalComponents = conveyor.unusedA + conveyor.unusedB + conveyor.productsC;
  return totalComponents > 0 
    ? ((conveyor.productsC / totalComponents) * 100).toFixed(2)
    : 0;
}

// ======================
// Error Handling
// ======================
app.use((req, res, next) => {
  res.status(404).json({ 
    success: false,
    error: 'Endpoint not found' 
  });
});

app.use((err, req, res, next) => {
  console.error('Server error:', err.stack);
  res.status(500).json({ 
    success: false,
    error: 'Internal server error' 
  });
});

// ======================
// Server Startup
// ======================
app.listen(port, () => {
  console.log(`\n🚀 Conveyor Belt Simulation API running on port ${port}`);
  console.log(`\nEndpoints:`);
  console.log(`- Health Check: http://localhost:${port}/`);
  console.log(`- Run Simulation: POST http://localhost:${port}/api/simulate`);
  console.log(`- Reset Simulation: POST http://localhost:${port}/api/reset`);
  console.log(`- Metrics: http://localhost:${port}/metrics\n`);
});

module.exports = app;
