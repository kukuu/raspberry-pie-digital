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

**Update code to include Assembly**

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


_Explanations_

Key Additions Explained

Worker Positions

- Workers are now defined with fixed positions on the belt (e.g., positions 0, 3, 6).

- Each checks its current and next slot for A and B (order-sensitive).

- Assembly Logic (assembleProducts)

i. If a worker finds A followed by B in adjacent slots:

a. Replaces them with C (product).

b. Increments productsC counter.

c. Clears the second slot (sets to null).

d. Integration with moveBelt

e. Calls assembleProducts() after every belt movement to simulate real-time assembly.

- Example Workflow

1. Belt State: [A, B, null, A, B, null, ...]

i. Worker at Position 0: Sees A (slot 0) and B (slot 1) → replaces them with C and null.

ii. Result: [C, null, null, A, B, null, ...] and productsC increases by 1


B. Worker Logic (lib/workers.js)

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

_Explanation_

**1. Constructor Initialization**

hands: Array representing the worker’s hands (max 2 items, initially [null, null]).

assemblyTime: Tracks remaining steps to assemble C (starts at 0 = idle).

**2. pickOrPlace(slot) Method**

- Step 1: Check if Busy Assembling

If assemblyTime > 0:

Decrements assemblyTime (counts down).

Returns immediately (worker can’t act while assembling).

- Step 2: Assemble C if Possible

i. If hands hold both 'A' and 'B':

a. Sets assemblyTime = 4 (takes 4 steps to assemble).

b. Clears hands ([null, null]).

c. Returns (assembly starts; product C is implied but not tracked here).

- Step 3: Pick Up Components

i. If the slot has a component ('A'/'B') and the worker isn’t already holding it:

a. Finds an empty hand (first null in hands).

b. Picks up the component (updates hands).

c. Sets slot = null (removes component from the belt).

- Key Behaviors

- Idle Worker: Picks up components when free.

- Busy Worker: Counts down assemblyTime; ignores the belt.

- Assembly: Triggered automatically when holding A+B; takes 4 steps.

Example Workflow

i. Pickup: Worker picks A from belt → hands = ['A', null].

ii. Pickup: Worker picks B from belt → hands = ['A', 'B'].

Assemble: Starts 4-step timer → assemblyTime = 4.

i. Complete: After 4 steps, hands reset → [null, null].
