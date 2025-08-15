const express = require('express');
const promClient = require('prom-client');
const ConveyorSimulator = require('./lib/conveyor');
const WorkerSystem = require('./lib/workers');
const cors = require('cors');

// Initialize Express app
const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Prometheus metrics setup
const collectDefaultMetrics = promClient.collectDefaultMetrics;
collectDefaultMetrics({ timeout: 5000 });

// Metrics
const productsCounter = new promClient.Counter({
  name: 'conveyor_products_total',
  help: 'Total number of products C manufactured'
});

const componentsGauge = new promClient.Gauge({
  name: 'conveyor_components_unused',
  help: 'Number of unused components',
  labelNames: ['type']
});

// Initialize systems
const conveyor = new ConveyorSimulator();
const workers = Array(3).fill().map(() => new WorkerSystem());

// API Endpoints
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', promClient.register.contentType);
  res.end(await promClient.register.metrics());
});

app.post('/api/simulate', (req, res) => {
  const { steps = 100 } = req.body;
  const results = [];

  for (let i = 0; i < steps; i++) {
    const state = conveyor.simulateStep(workers);
    
    // Update metrics
    productsCounter.inc(state.productsC - (results[results.length-1]?.productsC || 0));
    componentsGauge.set({ type: 'A' }, state.unusedA);
    componentsGauge.set({ type: 'B' }, state.unusedB);
    
    results.push(state);
  }

  res.json({
    success: true,
    steps: steps,
    productsC: conveyor.productsC,
    unusedA: conveyor.unusedA,
    unusedB: conveyor.unusedB,
    data: results
  });
});

app.post('/api/reset', (req, res) => {
  conveyor.reset();
  workers.forEach(w => {
    w.hands = [null, null];
    w.assemblyTime = 0;
  });
  res.json({ success: true, message: 'Simulation reset' });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false,
    error: 'Internal server error' 
  });
});

// Start server
app.listen(port, () => {
  console.log(`Conveyor belt simulation running on port ${port}`);
  console.log(`- Metrics: http://localhost:${port}/metrics`);
  console.log(`- API Docs: http://localhost:${port}/api/simulate`);
});

module.exports = app; // For testing
