class ConveyorSimulator {
  
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


  export default ConveyorSimulator; 
