
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
