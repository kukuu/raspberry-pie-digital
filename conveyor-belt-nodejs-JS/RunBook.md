
# Run Book

## /conveyor-belt  Directory Structure



```
/conveyor-belt/nodejs-JS
├── index.js                  # Main app & API entry point
├── lib/
│   ├── conveyor.js           # Belt logic & simulation
│   ├── workers.js            # Worker behavior
│   ├── gpio.js               # GPIO control (with mock fallback)
│   └── db.js                 # SQLite persistence
│
├── test/
│   ├── unit/                 # Unit tests (Jest)
│   │   ├── conveyor.test.js  # Core belt logic tests
│   │   ├── worker.test.js    # Worker behavior tests
│   │   └── gpio.mock.test.js # GPIO integration tests (mocked)
│   │
│   └── integration/          # Integration tests
│       ├── api.test.js       # REST API endpoint tests
│       ├── db.test.js        # SQLite operations tests
│       └── simulation.test.js # Full 100-step simulation test
│
├── config/
│   ├── prometheus.yml        # Prometheus scraping config
│   └── grafana-dashboard.json # Pre-configured dashboard
│
├── package.json              # Dependencies & scripts
└── README.md                 # Setup instructions

```


## How The Three Core Component Files Work Together

- conveyor.js
- workers.js
- gpio.js


1. index.js (the main app file) requires these three modules - 

2. It first calls gpio.initializeGpio() to get the hardware interface.

3. It then creates a new ConveyorBelt(...) instance, passing it the GPIO configuration.

It calls workers.start(conveyor, gpio), which spins up the two worker threads.

The Simulation Worker ticks the simulation forward, calling conveyor.simulatePulse().

The Sensor Worker monitors the GPIO (real or simulated) for changes.

When the simulation triggers a sensor event (in simulatePulse) or the sensor worker detects a real change, the conveyor object emits an event.

The main application in index.js listens for these events to update its status, log activity, or respond via an API.

## Running the Simulation

- Install dependencies

```
npm install sqlite3 onoff prom-client express

```
- Run simulation

```
node index.js
```

- Test

```
npm test

```

- Deploy with PM2

```
pm2 start index.js --name "conveyor-belt"
pm2 save
pm2 startup

```
- Monitor with Grafana

i. Import grafana-dashboard.json

ii. View real-time metrics

## Belt Mechanics for Conveyor.js

### Key Features:

- Belt Mechanics:

1. 10-slot conveyor belt

2. Random component generation (A, B, or empty)

3. Tracks unused components falling off the end

4. Worker Interaction:

5. Workers interact with odd-numbered slots (1, 3, 5...)

6. Products placed on even-numbered slots (0, 2, 4...)

7. Worker coordination handled via worker.pickOrPlace()

- Product Assembly:

1. Completed products ('C') are placed in first available even slot

2. Production count tracked via productsC

- State Management:

1. Immutable state returns via simulateStep()

2. Full reset capability with reset()

## Conveyor Belt Simulation

### Key Features:

- Core Functionality:

1. POST /api/simulate - Runs simulation for specified steps

2. POST /api/reset - Resets simulation state

3. GET /metrics - Prometheus metrics endpoint

4. GET /health - Health check endpoint

- Monitoring:

1. Tracks products manufactured (conveyor_products_total)

2. Monitors unused components (conveyor_components_unused)

3. Default Node.js metrics collection

- Error Handling:

1. CORS support

2. JSON error responses

3. Request validation

- Configuration:

1. Environment variable support (PORT)

2. Default to 5000 if PORT not specified

- Worker System:

1. Initializes 3 workers by default

2. Maintains individual worker states



## Usage

Usage Examples:

- Run Simulation:

```
curl -X POST http://localhost:5000/api/simulate \
  -H "Content-Type: application/json" \
  -d '{"steps": 100}'

```

- Reset Simulation:

```
curl -X POST http://localhost:5000/api/reset

```

- Get Metrics:

```
curl http://localhost:5000/metrics

```

- This implementation provides:

i. Production-ready API server

ii. Comprehensive monitoring

iii. Clean state management

iv. Scalable worker system

v. Proper error handling

## Expected Output

After 100 steps, the system logs:


i. Products C made: 12  

ii. Unused A components: 18  

iii. Unused B components: 15  

## Updated "Running the Simulation" Guide


 1. Install Dependencies

```
npm install

npm install -g pm2  # For production deployment
```

2. Initialize Database
```
sqlite3 conveyor.db "CREATE TABLE IF NOT EXISTS production_log (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  products_c INTEGER,
  unused_a INTEGER,
  unused_b INTEGER,
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
);"
```
3. Run the Simulation

```
# Development mode
npm start

```

```
# Production mode (with monitoring)
pm2 start index.js --name "conveyor-belt" --watch
pm2 save
pm2 startup

```

4. Testing

```
# Run all tests
npm test


# Run unit tests only
npm run test:unit

# Run integration tests
npm run test:integration


```

5. Monitoring Setup

```
# Start Prometheus and Grafana (requires Docker)
docker run -d -p 9090:9090 -v $(pwd)/config/prometheus.yml:/etc/prometheus/prometheus.yml prom/prometheus
docker run -d -p 3000:3000 grafana/grafana

# Import dashboard (after Grafana starts):
# 1. Login to http://localhost:3000 (admin/admin)
# 2. Create Prometheus datasource (URL: http://host.docker.internal:9090)
# 3. Import dashboard from config/grafana-dashboard.json

```

6. Expected Output

After 100 steps, check logs:

```
pm2 logs conveyor-belt

```

- Typical output:


• Products assembled: 14
• Unused A components: 19
• Unused B components: 17
• Worker efficiency: 72%


7. View Metrics
• Prometheus: http://localhost:9090
• Grafana: http://localhost:3000
• API Docs: http://localhost:5000/docs



### Key improvements in this version:
1. Added proper database initialization command
2. Included PM2 watch mode for automatic restarts
3. Added Docker commands for monitoring setup
4. Specified Grafana setup steps
5. Included expected log output format
6. Added direct links to monitoring services
7. Separated test commands for different suites

The configuration files now support:
- Real-time efficiency tracking
- Automated alert thresholds
- Historical performance comparison
- Containerized monitoring stack
- Production-ready logging


## Conveyor belt simulation running on port 5000
- Metrics: http://localhost:5000/metrics
- API Docs: http://localhost:5000/api/simulate
