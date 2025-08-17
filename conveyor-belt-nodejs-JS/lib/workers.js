const { Gpio } = require('onoff');
const gpio = require('./gpio');

class WorkerSystem {
  constructor() {
    this.hands = [null, null]; // Each worker has two hands (max 2 items)
    this.assemblyTime = 0;     // Countdown timer for product assembly
    this.productsCompleted = 0; // Track productivity metrics
  }

  /**
   * Primary interaction method with conveyor belt slots
   * @param {string|null} slot - Current item in belt slot (A, B, C, or null)
   * @returns {string|null} - Modified slot value after interaction
   */
  pickOrPlace(slot) {
    if (this.isAssembling()) {
      this.assemblyTime--;
      return slot; // No interaction during assembly
    }

    if (this.hasBothComponents()) {
      this.startAssembly();
      return slot;
    }

    if (this.canPickComponent(slot)) {
      return this.pickComponent(slot);
    }

    if (this.hasCompletedProduct() && slot === null) {
      return this.placeProduct();
    }

    return slot; // No action taken
  }

  /**
   * Checks if worker can pick up a component
   * @param {string} component - Component to check (A or B)
   * @returns {boolean}
   */
  canPickComponent(component) {
    const isValidComponent = component === 'A' || component === 'B';
    const hasEmptyHand = this.hands.includes(null);
    const noDuplicate = !this.hands.includes(component);
    
    return isValidComponent && hasEmptyHand && noDuplicate;
  }

  /**
   * Picks up a component from belt
   * @param {string} component - Component to pick up
   * @returns {null} - Returns null (slot becomes empty)
   */
  pickComponent(component) {
    const emptyHandIndex = this.hands.indexOf(null);
    if (emptyHandIndex === -1) {
      throw new Error('No empty hands available');
    }
    
    this.hands[emptyHandIndex] = component;
    return null; // Slot is emptied after pickup
  }

  /**
   * Checks if worker has both component types
   * @returns {boolean}
   */
  hasBothComponents() {
    return this.hands.includes('A') && this.hands.includes('B');
  }

  /**
   * Starts product assembly process
   */
  startAssembly() {
    this.hands = [null, null]; // Clear hands
    this.assemblyTime = 4;     // Assembly takes 4 time units
    gpio.setLed(`worker${this.id}`, true); // Visual feedback
  }

  /**
   * Checks if worker is currently assembling
   * @returns {boolean}
   */
  isAssembling() {
    return this.assemblyTime > 0;
  }

  /**
   * Checks if product is ready to be placed
   * @returns {boolean}
   */
  hasCompletedProduct() {
    return this.assemblyTime === 1; // Ready next cycle
  }

  /**
   * Places completed product on belt
   * @returns {string} - Returns 'C' (product)
   */
  placeProduct() {
    this.assemblyTime = 0;
    this.productsCompleted++;
    gpio.setLed(`worker${this.id}`, false); // Turn off LED
    return 'C';
  }

  /**
   * Resets worker to initial state
   */
  reset() {
    this.hands = [null, null];
    this.assemblyTime = 0;
    if (this.id) {
      gpio.setLed(`worker${this.id}`, false);
    }
  }

  /**
   * Gets current worker status
   * @returns {object} - Worker state snapshot
   */
  getStatus() {
    return {
      hands: [...this.hands], // Clone array
      isAssembling: this.isAssembling(),
      timeRemaining: this.assemblyTime,
      productsCompleted: this.productsCompleted,
      lastActivity: new Date().toISOString()
    };
  }
}

// Named export for better testability
module.exports = { WorkerSystem };
