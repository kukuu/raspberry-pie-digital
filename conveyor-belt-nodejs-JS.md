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
