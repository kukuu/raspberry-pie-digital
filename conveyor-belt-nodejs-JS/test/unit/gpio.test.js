const gpio = require('../../lib/gpio');
const mockFs = require('mock-fs');

describe('GPIO Controller', () => {
  beforeAll(() => {
    mockFs({
      '/sys/class/gpio': {} // Simulate GPIO filesystem
    });
  });

  afterAll(() => {
    mockFs.restore();
    gpio.cleanup();
  });

  test('should initialize in mock mode when GPIO inaccessible', () => {
    expect(gpio.mockMode).toBeTruthy();
  });

  test('should toggle LED states without errors', () => {
    expect(() => {
      gpio.setLed('worker1', true);
      gpio.setLed('worker1', false);
    }).not.toThrow();
  });
});