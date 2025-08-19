# Running the Simulation

- Install dependencies

```
npm install sqlite3 onoff prom-client express

```


## Run Simulation, Dashboard & GPIO Tets


- Start the server:

```
node index.js

```

- Terminal  (curl):


```
curl -X POST http://localhost:5000/api/simulate \
  -H "Content-Type: application/json" \
  -d '{"steps": 100}'

```


- Access the web interface at:

 - Simulation: http://localhost:5000

 - Metrics: http://localhost:5000/metrics
   
 - Dashboard:: http://localhost:5000/dashboard


```
# Unit tests
npm test test/unit/gpio.test.js

npm run test:integration

# Hardware integration test (mock mode)
npm test test/integration/hardware.test.js

# Physical GPIO test (on Raspberry Pi)
node scripts/test-gpio.js
```

- Monitor with Grafana


i. Import grafana-dashboard.json

ii. View real-time metrics




  
### Running Conveyor belt simulation: Port 5000

- Run Simulation: POST http://localhost:5000/
- Reset Simulation: POST http://localhost:5000/api/reset
- Metrics: http://localhost:5000/metrics

### GPIO Tests



### Browser Console Tests

- https://github.com/kukuu/raspberry-pie-digital/blob/main/appendix/browser-console-test.md

### Browser Console Response

- https://github.com/kukuu/raspberry-pie-digital/blob/main/appendix/Browser-console-response.md

### Command Line Tests:




## All endpoints

1. POST /api/simulate

2. POST /api/reset

3. GET /metrics

4. GET / (web interface)




