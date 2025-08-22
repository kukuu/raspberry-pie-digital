const { Gpio } = require('onoff');
const gpio = require('./gpio');

class WorkerSystem {
  constructor(id) {
    this.id = id;
    this.hands = [null, null];
    this.assemblyTime = 0;
    this.productsCompleted = 0;
    
    if (!gpio.mockMode && this.id) {
      this.initializeGpio();
    }
  }

  initializeGpio() {
    try {
      this.led = new Gpio(17 + this.id, 'out');
    } catch (err) {
      console.error(`Failed to initialize GPIO for worker ${this.id}:`, err);
      gpio.mockMode = true;
    }
  }

  pickOrPlace(slot) {
    if (this.isAssembling()) {
      this.assemblyTime--;
      return slot;
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

    return slot;
  }

  canPickComponent(component) {
    const isValidComponent = component === 'A' || component === 'B';
    const hasEmptyHand = this.hands.includes(null);
    const noDuplicate = !this.hands.includes(component);
    
    return isValidComponent && hasEmptyHand && noDuplicate;
  }

  pickComponent(component) {
    const emptyHandIndex = this.hands.indexOf(null);
    if (emptyHandIndex === -1) {
      throw new Error('No empty hands available');
    }
    
    this.hands[emptyHandIndex] = component;
    return null;
  }

  hasBothComponents() {
    return this.hands.includes('A') && this.hands.includes('B');
  }

  startAssembly() {
    this.hands = [null, null];
    this.assemblyTime = 4;
    this.setWorkerLed(true);
  }

  isAssembling() {
    return this.assemblyTime > 0;
  }

  hasCompletedProduct() {
    return this.assemblyTime === 1;
  }

  placeProduct() {
    this.assemblyTime = 0;
    this.productsCompleted++;
    this.setWorkerLed(false);
    return 'C';
  }

  reset() {
    this.hands = [null, null];
    this.assemblyTime = 0;
    this.productsCompleted = 0;
    this.setWorkerLed(false);
  }

  getStatus() {
    return {
      hands: [...this.hands],
      isAssembling: this.isAssembling(),
      timeRemaining: this.assemblyTime,
      productsCompleted: this.productsCompleted,
      lastActivity: new Date().toISOString()
    };
  }

  setWorkerLed(state) {
    if (gpio.mockMode || !this.id) return;
    
    try {
      if (this.led) {
        this.led.writeSync(state ? 1 : 0);
      } else {
        gpio.setLed(`worker${this.id}`, state);
      }
    } catch (err) {
      console.error(`Failed to set LED for worker ${this.id}:`, err);
    }
  }
}

module.exports = { WorkerSystem };