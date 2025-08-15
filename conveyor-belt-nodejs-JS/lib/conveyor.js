class ConveyorSimulator {
  constructor() {
    this.reset();
  }

  reset() {
    this.slots = Array(10).fill(null);
    this.unusedA = 0;
    this.unusedB = 0;
    this.productsC = 0;
  }

  simulateStep(workers) {
    // Add new component (A, B, or empty)
    const newItem = Math.random() < 0.33 ? 'A' : (Math.random() < 0.5 ? 'B' : null);
    this.slots.pop();
    this.slots.unshift(newItem);

    // Track unused components
    const lastItem = this.slots[this.slots.length - 1];
    if (lastItem === 'A') this.unusedA++;
    if (lastItem === 'B') this.unusedB++;

    // Process workers
    workers.forEach(worker => {
      for (let i = 1; i < this.slots.length; i += 2) {
        const updatedSlot = worker.pickOrPlace(this.slots[i]);
        if (updatedSlot !== undefined) {
          this.slots[i] = updatedSlot;
        }
      }

      // Place completed products
      if (worker.hasCompletedProduct()) {
        for (let i = 0; i < this.slots.length; i += 2) {
          if (this.slots[i] === null) {
            this.slots[i] = 'C';
            this.productsC++;
            break;
          }
        }
      }
    });

    return this.getState();
  }

  getState() {
    return {
      slots: [...this.slots],
      unusedA: this.unusedA,
      unusedB: this.unusedB,
      productsC: this.productsC
    };
  }
}

module.exports = ConveyorSimulator;
