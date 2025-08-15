# Implementation Summary

- This solution simulates a conveyor belt with 3 worker pairs, where components (A/B) are randomly placed (⅓ chance each). 

- Workers pick components, assemble product C (takes 4 steps), and place it back. The system includes:

- SQLite persistence (stores simulation results)

- GPIO integration (LEDs indicate worker activity on Raspberry Pi)

- Unit & integration tests (Jest)

- Prometheus + Grafana for real-time monitoring

- PM2 for production deployment


## Conveyor belt simulation running on port 5000
- Run Book: https://github.com/kukuu/raspberry-pie-digital/blob/main/conveyor-belt-nodejs-JS/RunBook.md
- Metrics: http://localhost:5000/metrics
- Web Interface: http://localhost:5000
- API Docs: http://localhost:5000/api/simulate



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
- Access the web interface at:

 http://localhost:5000

- All endpoints

1. POST /api/simulate

2. POST /api/reset

3. GET /metrics

4. GET / (web interface)
