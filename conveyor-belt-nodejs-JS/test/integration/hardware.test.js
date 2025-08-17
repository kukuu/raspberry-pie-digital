const { ConveyorSimulator } = require('../../lib/conveyor');
const { WorkerSystem } = require('../../lib/workers'); // Fixed import
const gpio = require('../../lib/gpio');

describe('Hardware Integration', () => {
  let conveyor;
  let testWorkers;
  
  beforeAll(() => {
    // Initialize with mock mode forced for testing
    gpio.mockMode = true;
    conveyor = new ConveyorSimulator();
    testWorkers = [new WorkerSystem()]; // Now using proper constructor
  });

  afterAll(() => {
    gpio.cleanup();
  });

  test('should activate belt LED on initialization', () => {
    // Verify mock console output
    expect(console.log).toHaveBeenCalledWith(
      expect.stringContaining('Using GPIO mock mode')
    );
    expect(gpio.setLed).toHaveBeenCalledWith('beltActive', true);
  });

  test('should reflect worker states in GPIO', () => {
    // Mock worker state
    testWorkers[0].assemblyTime = 4; // Simulate assembling
    
    conveyor.simulateStep(testWorkers);
    
    // Verify worker LED was activated
    expect(gpio.setLed).toHaveBeenCalledWith('worker1', true);
  });
});
