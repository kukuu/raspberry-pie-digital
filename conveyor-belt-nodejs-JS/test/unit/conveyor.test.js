const { ConveyorSimulator } = require('../lib/conveyor');

describe('ConveyorSimulator', () => {
  let simulator;

  beforeEach(() => {
    simulator = new ConveyorSimulator();
  });

  test('should initialize with empty belt', () => {
    const state = simulator.getState();
    expect(state.slots.every(slot => slot === null)).toBe(true);
  });
  
  // Additional tests...
});