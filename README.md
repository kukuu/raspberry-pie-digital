

# Conveyor Belt Simulation


## Solution

- This solution simulates a conveyor belt with 3 worker pairs, where components (A/B) are randomly placed (⅓ chance each). 

- Workers pick components, assemble product C (takes 4 steps), and place it back. The system includes:

- GPIO integration (LEDs indicate worker activity on Raspberry Pi)

- Unit & integration tests (Jest)

- SQLite persistence (stores simulation results)

- Prometheus + Grafana for real-time monitoring

- PM2 for production deployment

## Installation Guide 

- https://github.com/kukuu/raspberry-pie-digital/blob/main/appendix/running-simulation.md
  
## Key Components

- The solution simulates a conveyor belt with 3 worker pairs, where components (A/B) are randomly placed (⅓ chance each). 

- Workers pick components, assemble product C (takes 4 steps), and place it back. The system includes:

- GPIO integration (LEDs indicate worker activity on Raspberry Pi)

- Unit & integration tests (Jest)

- Prometheus Client  for real-time monitoring

- Simulation Control Dashboard using Real-time data

- SQLite persistence (stores simulation results)*

- PM2 for production deployment*

## Worker Logic

- https://github.com/kukuu/raspberry-pie-digital/blob/main/appendix/worker-logic-explanation.md


## Scaffolding

- https://github.com/kukuu/raspberry-pie-digital/blob/main/appendix/running-simulation.md

## Repository
- https://github.com/kukuu/raspberry-pie-digital/tree/main/conveyor-belt-nodejs-JS
  
## Running Conveyor belt simulation: Port 5000

- Run Simulation: POST http://localhost:5000/
- Reset Simulation: POST http://localhost:5000/api/reset
- Metrics: http://localhost:5000/metrics

## GPIO Tests

```
# Unit tests
npm test test/unit/gpio.test.js

npm run test:integration

# Hardware integration test (mock mode)
npm test test/integration/hardware.test.js

# Physical GPIO test (on Raspberry Pi)
node scripts/test-gpio.js
```

## Browser Console Tests

- https://github.com/kukuu/raspberry-pie-digital/blob/main/appendix/browser-console-test.md

## Browser Console Response

- https://github.com/kukuu/raspberry-pie-digital/blob/main/appendix/Browser-console-response.md

## Command Line Tests:

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
- Access the web interface at:

 Simulation: http://localhost:5000

 Metrics: http://localhost:5000/metrics



## All endpoints

1. POST /api/simulate

2. POST /api/reset

3. GET /metrics

4. GET / (web interface)


## Documentation

- Task: https://github.com/kukuu/raspberry-pie-digital/blob/main/appendix/TASK_1_-_Conveyor_Belt_Challenge__2_.pdf
- Architecture: https://github.com/kukuu/raspberry-pie-digital/blob/main/docs/conveyor-belt-nodejs-JS/docs/data-architecture.md
- Flow Diagram - https://github.com/kukuu/raspberry-pie-digital/blob/main/docs/conveyor-belt-nodejs-JS/conveyor-belt-flow-diagram.png
- Folder Structure: https://github.com/kukuu/raspberry-pie-digital/blob/main/conveyor-belt-nodejs-JS/docs/folder-structure.md
- Run Book: https://github.com/kukuu/raspberry-pie-digital/blob/main/conveyor-belt-nodejs-JS/RunBook.md
- Metrics: http://localhost:5000/metrics
- Simulation (Web Interface): http://localhost:5000
- Simulation Control Dashboard: https://github.com/kukuu/raspberry-pie-digital/blob/main/conveyor-belt-nodejs-JS/docs/simulation-control-dashboad.md
- Logs: https://github.com/kukuu/raspberry-pie-digital/blob/main/conveyor-belt-nodejs-JS/docs/logs.md
- GPIO Tests: https://github.com/kukuu/raspberry-pie-digital/blob/main/conveyor-belt-nodejs-JS/docs/run-GPIO-tests.md
- GPIO Unit Test Results: https://github.com/kukuu/raspberry-pie-digital/blob/main/conveyor-belt-nodejs-JS/docs/test/GPIO-tests.png
- Browser Console test - https://github.com/kukuu/raspberry-pie-digital/blob/main/conveyor-belt-nodejs-JS/test/conveyor-belt-browser-console-test-response.png
- GPIO Integration Test Results: https://github.com/kukuu/raspberry-pie-digital/blob/main/conveyor-belt-nodejs-JS/docs/run-GPIO-tests.md
- GPIO Physical GPIO test (on Raspberry Pi):
- Monitoring Integration: https://github.com/kukuu/raspberry-pie-digital/tree/main/conveyor-belt-nodejs-JS/docs/monitoring-integration.md
- GPIO Verification Steps:https://github.com/kukuu/raspberry-pie-digital/blob/main/conveyor-belt-nodejs-JS/docs/GPIO-verification-steps.md


## Apendix

- Thought Process: https://github.com/kukuu/raspberry-pie-digital/blob/main/appendix/conveyor-belt-execution-steps.md
- Conveyor Belt CLASS: https://github.com/kukuu/raspberry-pie-digital/blob/main/appendix/convey-belt-CLASS.md
- The Maze: https://github.com/kukuu/raspberry-pie-digital/blob/main/appendix/conveyor-belt-maze.md
- Console Browser Test: https://github.com/kukuu/raspberry-pie-digital/blob/main/appendix/browser-console-test.md
- Console Browser Response: https://github.com/kukuu/raspberry-pie-digital/blob/main/appendix/Browser-console-response.md
- Buffer: https://github.com/kukuu/raspberry-pie-digital/blob/main/appendix/conveyor-belt-nodejs-JS.md
- Database setup - https://github.com/kukuu/raspberry-pie-digital/blob/main/appendix/sqLite-db-explanation.md
