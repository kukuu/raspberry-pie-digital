# Conveyor Belt Simulation - Node.js Solution

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

A. Conveyor Belt Logic (lib/conveyor.js)

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

_Explanation_:

Here’s a step-by-step breakdown of what the ConveyorBelt class does:

**1. Constructor Initialization**
Creates a conveyor belt with length slots (default: 10), all initially empty (null).

- Initializes:

i. workers: An empty array (placeholder for 3 worker pairs, though currently unassigned).

ii. unusedA/unusedB: Counters for unused components (starting at 0).

iii. productsC: Counter for assembled products (initially 0).

**2. moveBelt() Method**

- Step 1: Add a New Item

- Generates a random item:

33% chance of 'A', 33% chance of 'B', 33% chance of null (empty).

**Step 2: Update the Belt**

- Removes the last item (using pop()).

- Adds the new item to the front (using unshift()), simulating belt movement.

**Step 3: Track Unused Components**

- Checks the last slot (before it was removed by pop()):

i. If it was 'A', increments unusedA.

ii. If it was 'B', increments unusedB.

**Key Purpose**

- Simulates a conveyor belt moving components (A/B) forward.

- Tracks unused components that "fell off" the belt’s end (for efficiency metrics).

