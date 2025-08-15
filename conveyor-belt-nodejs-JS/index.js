const express = require('express');
const promClient = require('prom-client');
const conveyorSimulator = require('./lib/conveyor').default;
const workerSystem = require('./lib/workers').default;

// Initialize Express
const app = express();
const port = process.env.PORT || 5000;

// Prometheus metrics setup
const collectDefaultMetrics = promClient.collectDefaultMetrics;
collectDefaultMetrics({ timeout: 5000 });

// Initialize systems
const conveyor = new conveyorSimulator();
const workers = new workerSystem();

// API Endpoints
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', promClient.register.contentType);
  res.end(await promClient.register.metrics());
});

app.post('/api/simulate', (req, res) => {
  const results = [];
  for (let i = 0; i < 100; i++) {
    results.push(conveyor.simulateStep(workers));
  }
  res.json(results);
});

// Start server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

module.exports = app; // For testing purposes
