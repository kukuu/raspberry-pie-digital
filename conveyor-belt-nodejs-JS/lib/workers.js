class WorkerSystem {
  constructor() {
    this.reset();
  }

  reset() {
    this.hands = [null, null];
    this.assemblyTime = 0;
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
      return 'C';
    }

    return slot;
  }

  canPickComponent(slot) {
    return (slot === 'A' || slot === 'B') && 
           this.hands.includes(null) && 
           !this.hands.includes(slot);
  }

  pickComponent(slot) {
    const emptyIndex = this.hands.indexOf(null);
    this.hands[emptyIndex] = slot;
    return null;
  }

  hasBothComponents() {
    return this.hands.includes('A') && this.hands.includes('B');
  }

  startAssembly() {
    this.hands = [null, null];
    this.assemblyTime = 4;
  }

  isAssembling() {
    return this.assemblyTime > 0;
  }

  hasCompletedProduct() {
    return this.assemblyTime === 1;
  }

  getStatus() {
    return {
      hands: [...this.hands],
      assemblyTime: this.assemblyTime,
      isAssembling: this.isAssembling()
    };
  }
}

module.exports = WorkerSystem;
