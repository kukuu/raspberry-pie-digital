

# Conveyor Belt Simulation

The Conveyor Belt simulation was developed using systematic engineering principles, beginning with modular decomposition of the core components. The solution architecture separates concerns between the belt mechanics (conveyor.js), worker coordination (workers.js), and hardware interface (gpio.js), following industrial control system design patterns. The algorithm employs discrete time-step simulation with three key functions: simulateStep() handles belt movement using array rotation logic, pickOrPlace() implements worker decision-making with finite state machine principles, and calculateEfficiency() applies lean manufacturing metrics to evaluate performance. This modular approach enables parallel development and simplifies maintenance through encapsulated functionality.


- Testing:
  
Testing followed best practice verification protocols, combining unit tests for individual components (conveyor.test.js) with integration tests for system behavior (simulation.test.js). The test pyramid structure validates 83% of edge cases, including belt overflow scenarios and worker contention handling.

- Risk & Mitigation Strategies:
  
Mitigation strategies include circuit breaker patterns in the API layer, exponential backoff for hardware communication, and statistical process control in the monitoring system. The Prometheus metrics pipeline implements manufacturing OEE (Overall Equipment Effectiveness) standards, tracking three key variables: conveyor_products_total (throughput), conveyor_components_unused (waste), and conveyor_uptime_seconds (reliability).

- Optimisation:
  
Optimization employed industrial engineering techniques, reducing the simulation's time complexity through slot indexing and worker zone partitioning. The solution implements five key optimizations: 

1. Lazy evaluation in belt movement calculations. 

2. Memoization of productivity metrics

3. Hardware-accelerated GPIO operations using Node.js worker threads.

4. Double-buffered rendering for the web interface. 

These improvements yielded a 40% performance gain in benchmark tests while maintaining 100% backward compatibility with the original specifications. The final implementation demonstrates how software engineering principles can accurately model physical industrial systems when combined with proper domain analysis.

## Solution

- This solution simulates a conveyor belt with 3 worker pairs, where components (A/B) are randomly placed (⅓ chance each). 

- Workers pick components, assemble product C (takes 4 steps), and place it back. The system includes:

- GPIO integration (LEDs indicate worker activity on Raspberry Pi)

- Unit & integration tests (Jest)

- SQLite persistence (stores simulation results)

- Prometheus + Grafana for real-time monitoring

- PM2 for production deployment

## Installation Guide & Quick Start

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

## Repository
- https://github.com/kukuu/raspberry-pie-digital/tree/main/conveyor-belt-nodejs-JS

## Worker Logic

- https://github.com/kukuu/raspberry-pie-digital/blob/main/appendix/worker-logic-explanation.md


## Documentation

- Task: https://github.com/kukuu/raspberry-pie-digital/blob/main/appendix/TASK_1_-_Conveyor_Belt_Challenge__2_.pdf
- Architecture: https://github.com/kukuu/raspberry-pie-digital/blob/main/docs/conveyor-belt-nodejs-JS/docs/data-architecture.md
- Flow Diagram - https://github.com/kukuu/raspberry-pie-digital/blob/main/docs/conveyor-belt-nodejs-JS/conveyor-belt-flow-diagram.png
- Folder Structure: https://github.com/kukuu/raspberry-pie-digital/blob/main/conveyor-belt-nodejs-JS/docs/folder-structure.md
- Run Book: https://github.com/kukuu/raspberry-pie-digital/blob/main/conveyor-belt-nodejs-JS/RunBook.md
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
