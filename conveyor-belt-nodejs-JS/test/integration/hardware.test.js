const { ConveyorSimulator } = require('../../lib/conveyor');
const { WorkerSystem } = require('../../lib/workers');
const gpio = require('../../lib/gpio');

// Mock GPIO for all tests
beforeAll(() => {
  gpio.mockMode = true;
});

describe('Hardware Integration', () => {
  let conveyor;
  let testWorkers;

  beforeEach(() => {
    conveyor = new ConveyorSimulator();
    testWorkers = [new WorkerSystem()];
    jest.spyOn(gpio, 'setLed');
  });

  test('should activate belt LED on initialization', () => {
    expect(gpio.setLed).toHaveBeenCalledWith('beltActive', true);
  });

  test('should reflect worker states in GPIO', () => {
    testWorkers[0].assemblyTime = 4; // Simulate assembling
    conveyor.simulateStep(testWorkers);
    expect(gpio.setLed).toHaveBeenCalledWith('worker1', true);
  });
});
