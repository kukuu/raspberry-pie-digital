class ConveyorSimulator {
  constructor() {
    this.slots = Array(10).fill(null);
    this.unusedA = 0;
    this.unusedB = 0;
    this.productsC = 0;
  }

  simulateStep(workers) {
    // 1. Add new component to start of belt (1/3 chance for A, B, or empty)
    const newComponent = Math.random() < 0.33 ? 'A' : (Math.random() < 0.5 ? 'B' : null);
    this.slots.pop(); // Remove last item
    this.slots.unshift(newComponent); // Add new item to front

    // 2. Track unused components that fall off the end
    const lastSlot = this.slots[this.slots.length - 1];
    if (lastSlot === 'A') this.unusedA++;
    if (lastSlot === 'B') this.unusedB++;

    // 3. Process workers
    workers.forEach(worker => {
      // Workers interact with odd-numbered slots only (0-indexed)
      for (let i = 1; i < this.slots.length; i += 2) {
        worker.pickOrPlace(this.slots[i]);
      }

      // Check for completed products
      if (worker.hasCompletedProduct()) {
        // Find first empty even-numbered slot
        for (let i = 0; i < this.slots.length; i += 2) {
          if (this.slots[i] === null) {
            this.slots[i] = 'C';
            this.productsC++;
            break;
          }
        }
      }
    });

    return {
      step: Date.now(),
      slots: [...this.slots],
      unusedA: this.unusedA,
      unusedB: this.unusedB,
      productsC: this.productsC
    };
  }

  // Helper method to reset simulation
  reset() {
    this.slots = Array(10).fill(null);
    this.unusedA = 0;
    this.unusedB = 0;
    this.productsC = 0;
  }
}

module.exports = ConveyorSimulator;
