# Conveyor Belt Challenge 

## Development steps
-  The simulation initializes a 10-slot conveyor belt with 3 worker pairs.
-  Components arrive randomly (1/3 chance each for A, B, or empty).
-  Workers collect components (1 per hand), assemble product C (4-step process), and place it back.
-  GPIO LEDs indicate active workers (requires wiringPi on Pi).
-  Metrics are exposed on /metrics for Prometheus.
-  To run:
```
npm install && node index.js

```
 - Tests:
```
npm test

```

- Production:

i. containerize with Docker, deploy with PM2. 

ii. Grafana dashboard visualizes throughput and component statistics.

iii. Assumes Node 14+, works cross-platform with GPIO simulation on non-Pi systems.

## Why Use PM2 in This Project?

- Perfect for Raspberry Pi deployments! (Lightweight & efficient.)

- Ensures the simulation keeps running even after SSH disconnects.

- Easily manage logs (useful for debugging production issues).

- Zero downtime if you need to update the app.

- Works well with Prometheus for metrics collection.
  
- Keeps your Node.js application running forever (auto-restarts if it crashes).

- Manages multiple instances (clustering) for better CPU utilization.

