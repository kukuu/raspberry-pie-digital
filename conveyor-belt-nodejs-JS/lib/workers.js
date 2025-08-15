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