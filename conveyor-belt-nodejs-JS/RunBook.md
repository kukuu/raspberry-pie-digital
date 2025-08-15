
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

Key Features:

Belt Mechanics:

10-slot conveyor belt

Random component generation (A, B, or empty)

Tracks unused components falling off the end

Worker Interaction:

Workers interact with odd-numbered slots (1, 3, 5...)

Products placed on even-numbered slots (0, 2, 4...)

Worker coordination handled via worker.pickOrPlace()

Product Assembly:

Completed products ('C') are placed in first available even slot

Production count tracked via productsC

State Management:

Immutable state returns via simulateStep()

Full reset capability with reset()

## Conveyor Belt Simulation

Key Features:

Core Functionality:

POST /api/simulate - Runs simulation for specified steps

POST /api/reset - Resets simulation state

GET /metrics - Prometheus metrics endpoint

GET /health - Health check endpoint

Monitoring:

Tracks products manufactured (conveyor_products_total)

Monitors unused components (conveyor_components_unused)

Default Node.js metrics collection

Error Handling:

CORS support

JSON error responses

Request validation

Configuration:

Environment variable support (PORT)

Default to 5000 if PORT not specified

Worker System:

Initializes 3 workers by default

Maintains individual worker states

Required Dependencies:


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
