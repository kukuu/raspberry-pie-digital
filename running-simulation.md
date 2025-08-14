# Running the Simulation

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
