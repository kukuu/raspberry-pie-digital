# Implementation Summary

- This solution simulates a conveyor belt with 3 worker pairs, where components (A/B) are randomly placed (⅓ chance each). 

- Workers pick components, assemble product C (takes 4 steps), and place it back. The system includes:

- GPIO integration (LEDs indicate worker activity on Raspberry Pi)

- Unit & integration tests (Jest)

- SQLite persistence (stores simulation results)

- Prometheus + Grafana for real-time monitoring

- PM2 for production deployment

## Worker Logic

- https://github.com/kukuu/raspberry-pie-digital/blob/main/appendix/worker-logic-explanation.md


## Scaffolding

- https://github.com/kukuu/raspberry-pie-digital/blob/main/appendix/running-simulation.md

## Repository
- https://github.com/kukuu/raspberry-pie-digital/tree/main/conveyor-belt-nodejs-JS
  
## Conveyor belt simulation:  Running on port 5000

- Run Simulation: POST http://localhost:5000/
- Reset Simulation: POST http://localhost:5000/api/reset
- Metrics: http://localhost:5000/metrics

## Run GPIO Tests

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
- Response
```
Promise {<pending>}[[Prototype]]: Promise[[PromiseState]]: "fulfilled"[[PromiseResult]]: undefined
VM2553:17 === Simulation Results ===
VM2553:18 Products Manufactured: 61
VM2553:19 Unused Component A: 16
VM2553:20 Unused Component B: 0
VM2553:21 Efficiency: 79.22%
VM2553:23 
=== Last 5 Steps ===
VM2553:25 Step 96: Slots: [B, , C, , , , C, , , C] State: RUNNING
VM2553:25 Step 97: Slots: [B, , , C, , , , C, , ] State: RUNNING
VM2553:25 Step 98: Slots: [C, , , , C, , , , C, ] State: RUNNING
VM2553:25 Step 99: Slots: [A, C, , , , C, , , , C] State: RUNNING
VM2553:25 Step 100: Slots: [C, , C, , , , C, , , ] State: RUNNING
VM2553:31 
=== Full Response ===
VM2553:32 {
  "success": true,
  "stepsCompleted": 100,
  "productsC": 61,
  "unusedA": 16,
  "unusedB": 0,
  "efficiency": "79.22",
  "lastSteps": [
    {
      "slots": [
        "B",
        null,
        "C",
        null,
        null,
        null,
        "C",
        null,
        null,
        "C"
      ],
      "unusedA": 16,
      "unusedB": 0,
      "productsC": 59,
      "isStopped": false,
      "efficiency": "78.67",
      "timestamp": "2025-08-18T11:27:36.965Z"
    },
    {
      "slots": [
        "B",
        null,
        null,
        "C",
        null,
        null,
        null,
        "C",
        null,
        null
      ],
      "unusedA": 16,
      "unusedB": 0,
      "productsC": 59,
      "isStopped": false,
      "efficiency": "78.67",
      "timestamp": "2025-08-18T11:27:36.965Z"
    },
    {
      "slots": [
        "C",
        null,
        null,
        null,
        "C",
        null,
        null,
        null,
        "C",
        null
      ],
      "unusedA": 16,
      "unusedB": 0,
      "productsC": 60,
      "isStopped": false,
      "efficiency": "78.95",
      "timestamp": "2025-08-18T11:27:36.965Z"
    },
    {
      "slots": [
        "A",
        "C",
        null,
        null,
        null,
        "C",
        null,
        null,
        null,
        "C"
      ],
      "unusedA": 16,
      "unusedB": 0,
      "productsC": 60,
      "isStopped": false,
      "efficiency": "78.95",
      "timestamp": "2025-08-18T11:27:36.965Z"
    },
    {
      "slots": [
        "C",
        null,
        "C",
        null,
        null,
        null,
        "C",
        null,
        null,
        null
      ],
      "unusedA": 16,
      "unusedB": 0,
      "productsC": 61,
      "isStopped": false,
      "efficiency": "79.22",
      "timestamp": "2025-08-18T11:27:36.966Z"
    }
  ]
}
//VM2553:1 Fetch finished loading: POST "http://localhost:5000/api/simulate". (anonymous) @ VM2553:1

```
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


## All endpoints

1. POST /api/simulate

2. POST /api/reset

3. GET /metrics

4. GET / (web interface)

## Apendix

- Thought Process: https://github.com/kukuu/raspberry-pie-digital/blob/main/appendix/conveyor-belt-execution-steps.md
- Conveyor Belt CLASS: https://github.com/kukuu/raspberry-pie-digital/blob/main/appendix/convey-belt-CLASS.md
- The Maze: https://github.com/kukuu/raspberry-pie-digital/blob/main/appendix/conveyor-belt-maze.md
- Buffer: https://github.com/kukuu/raspberry-pie-digital/blob/main/appendix/conveyor-belt-nodejs-JS.md
- Database setup - https://github.com/kukuu/raspberry-pie-digital/blob/main/appendix/sqLite-db-explanation.md
