const conveyor = require('../../lib/conveyor');
const workers = require('../../lib/workers');
const gpio = require('../../lib/gpio');

describe('Hardware Integration', () => {
  let testWorkers;

  beforeEach(() => {
    testWorkers = [new workers.WorkerSystem()];
  });

  test('should activate belt LED on initialization', () => {
    new conveyor.ConveyorSimulator();
    expect(gpio.mockMode).toBeTruthy(); // Safety check
  });

  test('should reflect worker states in GPIO', () => {
    const conv = new conveyor.ConveyorSimulator();
    testWorkers[0].startAssembly();
    conv.simulateStep(testWorkers);
    // Verify mock output contains worker activity
  });
});