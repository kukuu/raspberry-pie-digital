const { Gpio } = require('onoff');
const gpio = require('./gpio');

class ConveyorSimulator {
  constructor() {
    // Remove direct GPIO initialization
    this.slots = Array(10).fill(null);
    this.unusedA = 0;
    this.unusedB = 0;
    this.productsC = 0;
  }
  initializeGPIO() {
    // Belt activity indicator
    gpio.setLed('beltActive', true);
    
    // Emergency stop monitoring
    this.emergencyStop = new Gpio(24, 'in', 'both');
    this.emergencyStop.watch((err, value) => {
      if (err) throw err;
      if (value === 0) this.handleEmergencyStop();
    });
  }

  simulateStep(workers) {
    if (this.isStopped) return this.getState();

    this.stepCount++;
    
    // 1. Generate new component
    const newItem = this.generateComponent();
    this.slots.pop();
    this.slots.unshift(newItem);

    // 2. Track unused components
    this.trackUnusedComponents();

    // 3. Process workers
    workers.forEach((worker, index) => {
      this.processWorker(worker, index);
    });

    // 4. Update GPIO status
    this.updateGPIOFeedback(workers);

    return this.getState();
  }

  generateComponent() {
    const rand = Math.random();
    if (rand < 0.33) return 'A';
    if (rand < 0.66) return 'B';
    return null;
  }

  trackUnusedComponents() {
    const lastItem = this.slots[this.slots.length - 1];
    if (lastItem === 'A') this.unusedA++;
    if (lastItem === 'B') this.unusedB++;
  }

  processWorker(worker, workerIndex) {
    // Worker interacts with odd-numbered slots
    for (let i = 1; i < this.slots.length; i += 2) {
      const updatedSlot = worker.pickOrPlace(this.slots[i]);
      if (updatedSlot !== undefined) {
        this.slots[i] = updatedSlot;
      }
    }

    // Place completed products on even-numbered slots
    if (worker.hasCompletedProduct()) {
      this.placeProduct(workerIndex);
    }
  }

  placeProduct(workerIndex) {
    for (let i = 0; i < this.slots.length; i += 2) {
      if (this.slots[i] === null) {
        this.slots[i] = 'C';
        this.productsC++;
        gpio.setLed(`worker${workerIndex + 1}`, false); // Turn off LED
        break;
      }
    }
  }

  updateGPIOFeedback(workers) {
    // Update worker activity LEDs
    workers.forEach((worker, i) => {
      gpio.setLed(`worker${i + 1}`, worker.isAssembling());
    });

    // Blink belt activity LED every 10 steps
    if (this.stepCount % 10 === 0) {
      gpio.setLed('beltActive', false);
      setTimeout(() => gpio.setLed('beltActive', true), 100);
    }
  }

  handleEmergencyStop() {
    this.isStopped = true;
    gpio.setLed('beltActive', false);
    [1, 2, 3].forEach(i => gpio.setLed(`worker${i}`, false));
    console.error('EMERGENCY STOP ACTIVATED');
  }

  reset() {
    this.slots = Array(10).fill(null);
    this.unusedA = 0;
    this.unusedB = 0;
    this.productsC = 0;
    this.stepCount = 0;
    this.isStopped = false;
    
    // Reset GPIO indicators
    gpio.setLed('beltActive', true);
  }

  getState() {
    return {
      slots: [...this.slots], // Immutable copy
      unusedA: this.unusedA,
      unusedB: this.unusedB,
      productsC: this.productsC,
      isStopped: this.isStopped,
      efficiency: this.calculateEfficiency(),
      timestamp: new Date().toISOString()
    };
  }

  calculateEfficiency() {
    const totalComponents = this.unusedA + this.unusedB + this.productsC;
    return totalComponents > 0 
      ? (this.productsC / totalComponents * 100).toFixed(2)
      : 0;
  }

  shutdown() {
    this.emergencyStop.unexport();
    gpio.cleanup();
  }
}

// Change to named export
module.exports = { ConveyorSimulator };
