const { Gpio } = require('onoff');
const gpio = require('./gpio');

class ConveyorSimulator {
  constructor() {
    this.slots = Array(10).fill(null);
    this.unusedA = 0;
    this.unusedB = 0;
    this.productsC = 0;
    this.stepCount = 0;
    this.isStopped = false;
    
    if (!gpio.mockMode) {
      this.initializeGPIO();
    }
  }

  initializeGPIO() {
    try {
      gpio.setLed('beltActive', true);
      this.emergencyStop = new Gpio(24, 'in', 'both');
      this.emergencyStop.watch((err, value) => {
        if (err) throw err;
        if (value === 0) this.handleEmergencyStop();
      });
    } catch (err) {
      console.error('GPIO initialization failed:', err);
      gpio.mockMode = true;
    }
  }

  simulateStep(workers) {
    if (this.isStopped) return this.getState();

    this.stepCount++;
    const newItem = this.generateComponent();
    this.slots.pop();
    this.slots.unshift(newItem);
    this.trackUnusedComponents();

    workers.forEach((worker, index) => {
      this.processWorker(worker, index);
    });

    this.updateGPIOFeedback(workers);
    return this.getState();
  }

  generateComponent() {
    const rand = Math.random();
    return rand < 0.33 ? 'A' : (rand < 0.66 ? 'B' : null);
  }

  trackUnusedComponents() {
    const lastItem = this.slots[this.slots.length - 1];
    if (lastItem === 'A') this.unusedA++;
    if (lastItem === 'B') this.unusedB++;
  }

  processWorker(worker, workerIndex) {
    for (let i = 1; i < this.slots.length; i += 2) {
      const updatedSlot = worker.pickOrPlace(this.slots[i]);
      if (updatedSlot !== undefined) {
        this.slots[i] = updatedSlot;
      }
    }

    if (worker.hasCompletedProduct()) {
      this.placeProduct(workerIndex);
    }
  }

  placeProduct(workerIndex) {
    for (let i = 0; i < this.slots.length; i += 2) {
      if (this.slots[i] === null) {
        this.slots[i] = 'C';
        this.productsC++;
        gpio.setLed(`worker${workerIndex + 1}`, false);
        break;
      }
    }
  }

  updateGPIOFeedback(workers) {
    workers.forEach((worker, i) => {
      gpio.setLed(`worker${i + 1}`, worker.isAssembling());
    });

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
    gpio.setLed('beltActive', true);
  }

  getState() {
    return {
      slots: [...this.slots],
      unusedA: this.unusedA,
      unusedB: this.unusedB,
      productsC: this.productsC,
      isStopped: this.isStopped,
      efficiency: this.calculateEfficiency(),
      timestamp: new Date().toISOString()
    };
  }

  calculateEfficiency() {
    const total = this.unusedA + this.unusedB + this.productsC;
    return total > 0 ? (this.productsC / total * 100).toFixed(2) : 0;
  }

  shutdown() {
    if (!gpio.mockMode && this.emergencyStop) {
      this.emergencyStop.unexport();
    }
    gpio.cleanup();
  }
}

module.exports = { ConveyorSimulator };