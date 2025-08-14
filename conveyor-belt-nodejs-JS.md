# Conveyor Belt Simulation 

**Node.js Solution**

(With Persistence, GPIO, Tests, Monitoring & Deployment)

## Implementation Summary

This solution simulates a conveyor belt with 3 worker pairs, where components (A/B) are randomly placed (⅓ chance each). Workers pick components, assemble product C (takes 4 steps), and place it back. The system includes:

- SQLite persistence (stores simulation results)

- GPIO integration (LEDs indicate worker activity on Raspberry Pi)

- Unit & integration tests (Jest)

- Prometheus + Grafana for real-time monitoring

- PM2 for production deployment

### Folder Structure 
```

/conveyor-belt  
├── index.js                # Main app & API  
├── lib/  
│   ├── conveyor.js         # Belt logic & simulation  
│   ├── workers.js          # Worker behavior  
│   ├── gpio.js             # GPIO control (falls back to mock if not on Pi)  
│   └── db.js               # SQLite persistence  
├── test/  
│   ├── unit/               # Unit tests (Jest)  
│   └── integration/        # API & DB tests  
├── config/  
│   ├── prometheus.yml      # Prometheus scraping config  
│   └── grafana-dashboard.json # Pre-configured dashboard  
├── package.json            # Dependencies & scripts  
└── README.md               # Setup instructions


``` 

## Key Code Snippets

**A. Conveyor Belt Logic (lib/conveyor.js)**

```
class ConveyorBelt {
  constructor(length = 10) {
    this.slots = Array(length).fill(null);
    this.workers = [ /* 3 pairs */ ];
    this.unusedA = 0;
    this.unusedB = 0;
    this.productsC = 0;
  }

  moveBelt() {
    // Randomly add A, B, or empty (⅓ chance each)
    const newItem = Math.random() < 0.33 ? 'A' : (Math.random() < 0.5 ? 'B' : null);
    this.slots.pop(); // Remove last item
    this.slots.unshift(newItem); // Add new item
    
    // Track unused components
    if (this.slots[this.slots.length - 1] === 'A') this.unusedA++;
    if (this.slots[this.slots.length - 1] === 'B') this.unusedB++;
  }
}
```

Code Explanation: https://github.com/kukuu/raspberry-pie-digital/blob/main/convey-belt-explanation-1.md

**Updated code to include Assembly**

We extend ConveyorBelt class to include the missing worker logic for processing components A and B into product C, while also updating the productsC counter:

```
class ConveyorBelt {
  constructor(length = 10) {
    this.slots = Array(length).fill(null);
    this.workers = [
      { position: 0, canAssemble: false }, // Worker pair 1
      { position: 3, canAssemble: false }, // Worker pair 2
      { position: 6, canAssemble: false }  // Worker pair 3
    ];
    this.unusedA = 0;
    this.unusedB = 0;
    this.productsC = 0;
  }

  moveBelt() {
    // Randomly add A, B, or empty (⅓ chance each)
    const newItem = Math.random() < 0.33 ? 'A' : (Math.random() < 0.5 ? 'B' : null);
    this.slots.pop(); // Remove last item
    this.slots.unshift(newItem); // Add new item

    // Track unused components
    if (this.slots[this.slots.length - 1] === 'A') this.unusedA++;
    if (this.slots[this.slots.length - 1] === 'B') this.unusedB++;

    // Worker assembly logic
    this.assembleProducts();
  }

  assembleProducts() {
    for (const worker of this.workers) {
      const { position } = worker;
      // Check if current and next slot have A and B (order matters)
      if (this.slots[position] === 'A' && this.slots[position + 1] === 'B') {
        // Replace A and B with assembled product C
        this.slots[position] = 'C';
        this.slots[position + 1] = null; // Clear the adjacent slot
        this.productsC++; // Increment product count
      }
    }
  }
}
```

Code Explanation: https://github.com/kukuu/raspberry-pie-digital/blob/main/conveyor-belt-explanation-2.md

**B. Worker Logic (lib/workers.js)**

```
class Worker {
  constructor(side) {
    this.hands = [null, null]; // Max 2 items
    this.assemblyTime = 0;
  }

  pickOrPlace(slot) {
    if (this.assemblyTime > 0) {
      this.assemblyTime--;
      return; // Busy assembling
    }
    
    // If holding A & B, assemble C (takes 4 steps)
    if (this.hands.includes('A') && this.hands.includes('B')) {
      this.assemblyTime = 4;
      this.hands = [null, null];
      return;
    }

    // Pick up component if slot has one
    if (slot && !this.hands.includes(slot)) {
      const emptyHandIndex = this.hands.indexOf(null);
      if (emptyHandIndex !== -1) {
        this.hands[emptyHandIndex] = slot;
        slot = null; // Remove from belt
      }
    }
  }
}

```
Worker Logic Explanation: https://github.com/kukuu/raspberry-pie-digital/blob/main/worker-logic-explanation.md

**C. SQLite Persistence (lib/db.js)** 

```
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('conveyor.db');

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS results (
    id INTEGER PRIMARY KEY,
    unusedA INTEGER,
    unusedB INTEGER,
    productsC INTEGER,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);
});

function saveResults(unusedA, unusedB, productsC) {
  db.run(`INSERT INTO results (unusedA, unusedB, productsC) VALUES (?, ?, ?)`, 
    [unusedA, unusedB, productsC]);
}
```

Code Explanation:  https://github.com/kukuu/raspberry-pie-digital/blob/main/sqLite-db-explanation.md

**D. GPIO Integration (lib/gpio.js)** 

```
const Gpio = require('onoff').Gpio;
const LEDS = {
  worker1: new Gpio(17, 'out'), // Mocked if not on Pi
  worker2: new Gpio(27, 'out'),
  worker3: new Gpio(22, 'out')
};

function updateLeds(activeWorker) {
  Object.values(LEDS).forEach(led => led.writeSync(0)); // Turn all off
  if (LEDS[`worker${activeWorker}`]) LEDS[`worker${activeWorker}`].writeSync(1);
}
```

**E. Prometheus Metrics (index.js)**

```
const prometheus = require('prom-client');
const metrics = {
  productsC: new prometheus.Counter({ name: 'products_c_total', help: 'Total products C made' }),
  unusedA: new prometheus.Counter({ name: 'unused_a_total', help: 'Total unused A components' }),
  unusedB: new prometheus.Counter({ name: 'unused_b_total', help: 'Total unused B components' })
};

// Expose metrics endpoint
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', prometheus.register.contentType);
  res.end(await prometheus.register.metrics());
});
```

**F. Running the Simulation**

https://github.com/kukuu/raspberry-pie-digital/blob/main/running-simulation.md

**G. Expected Output** 

```
- Products C made: 12  
- Unused A components: 18  
- Unused B components: 15

```
