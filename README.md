# Implementation Summary

- This solution simulates a conveyor belt with 3 worker pairs, where components (A/B) are randomly placed (⅓ chance each). 

- Workers pick components, assemble product C (takes 4 steps), and place it back. The system includes:

- GPIO integration (LEDs indicate worker activity on Raspberry Pi)

- Unit & integration tests (Jest)

- SQLite persistence (stores simulation results)

- Prometheus + Grafana for real-time monitoring

- PM2 for production deployment

## Execution Thought Process

- https://github.com/kukuu/raspberry-pie-digital/blob/main/appendix/conveyor-belt-execution-steps.md


## Conveyor belt simulation:  Running on port 5000

- Run Simulation: POST http://localhost:5000/
- Reset Simulation: POST http://localhost:5000/api/reset
- Metrics: http://localhost:5000/metrics

# Run GPIO Tests

```
# Unit tests
npm test test/unit/gpio.test.js

npm run test:integration

# Hardware integration test (mock mode)
npm test test/integration/hardware.test.js

# Physical GPIO test (on Raspberry Pi)
node scripts/test-gpio.js
```

## Testing in Browser from Browser Console

- Request
```
// Run this in browser console
fetch('http://localhost:5000/api/simulate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ steps: 100 })
})
.then(response => response.json())
.then(data => console.log(data));
```

- Response

https://github.com/kukuu/raspberry-pie-digital/blob/main/conveyor-belt-nodejs-JS/test/conveyor-belt-browser-console-test-response.png

## Test from Command Line:

From Command Line (curl):

```
curl -X POST http://localhost:5000/api/simulate \
  -H "Content-Type: application/json" \
  -d '{"steps": 100}'

```

- Start the server:

```
node index.js

```


## All endpoints

1. POST /api/simulate

2. POST /api/reset

3. GET /metrics

4. GET / (web interface)
