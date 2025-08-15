class WorkerSystem {
  constructor() {
    this.hands = [null, null]; // Can hold two components (A/B) or one product (C)
    this.assemblyTime = 0;     // Countdown timer for assembly
    this.productsAssembled = 0;// Track worker productivity
  }

  /**
   * Primary worker interaction with conveyor belt slots
   * @param {string|null} slot - Current belt slot item (A, B, C, or null)
   * @returns {string|null} - Modified slot value after interaction
   */
  pickOrPlace(slot) {
    // If currently assembling, decrement timer
    if (this.isAssembling()) {
      this.assemblyTime--;
      return slot; // No interaction during assembly
    }

    // If holding A+B, start assembly process
    if (this.hasBothComponents()) {
      this.startAssembly();
      return slot;
    }

    // Pick up components if hands aren't full
    if (slot && this.canPickComponent(slot)) {
      return this.pickComponent(slot);
    }

    // Place completed product if ready
    if (this.hasCompletedProduct() && slot === null) {
      return this.placeProduct();
    }

    return slot; // No action taken
  }

  // Helper Methods

  canPickComponent(slot) {
    return (slot === 'A' || slot === 'B') && 
           this.hands.includes(null) && 
           !this.hands.includes(slot);
  }

  pickComponent(slot) {
    const emptyIndex = this.hands.indexOf(null);
    this.hands[emptyIndex] = slot;
    return null; // Item was picked from belt
  }

  hasBothComponents() {
    return this.hands.includes('A') && this.hands.includes('B');
  }

  startAssembly() {
    this.hands = [null, null]; // Clear hands
    this.assemblyTime = 4;     // Assembly takes 4 time units
  }

  isAssembling() {
    return this.assemblyTime > 0;
  }

  hasCompletedProduct() {
    return this.assemblyTime === 1; // Completes next cycle
  }

  placeProduct() {
    this.assemblyTime = 0;
    this.productsAssembled++;
    return 'C'; // Place product on belt
  }

  // Diagnostic Methods

  getStatus() {
    return {
      hands: [...this.hands],
      assemblyTime: this.assemblyTime,
      productsAssembled: this.productsAssembled,
      isAssembling: this.isAssembling(),
      canWork: !this.isAssembling()
    };
  }

  reset() {
    this.hands = [null, null];
    this.assemblyTime = 0;
  }
}

module.exports = WorkerSystem;
