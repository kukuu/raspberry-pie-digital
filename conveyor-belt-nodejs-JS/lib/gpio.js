const { Gpio } = require('onoff');

class GPIOController {
  constructor() {
    this.mockMode = process.env.NODE_ENV === 'test' || process.platform !== 'linux' || !Gpio.accessible;
    this.leds = {};
    this._initGPIO();
  }

  _initGPIO() {
    if (this.mockMode) {
      this._setupMockGPIO();
      // Initialize belt LED to active state
      this.setLed('beltActive', true);
      return;
    }
    this._setupRealGPIO();
  }

  _setupMockGPIO() {
    console.log('[GPIO] Using mock mode');
    const createMockLed = (name) => {
      const mockFn = (value) => {
        console.log(`[GPIO MOCK] ${name} set to ${value === 1}`);
      };
      
      // Add Jest mock functionality only in test environment
      if (process.env.NODE_ENV === 'test') {
        mockFn.mockImplementation = (impl) => {
          return jest.fn(impl);
        };
      }
      
      return {
        writeSync: mockFn,
        readSync: () => 0,
        unexport: () => {}
      };
    };

    this.leds = {
      beltActive: createMockLed('beltActive'),
      worker1: createMockLed('worker1'),
      worker2: createMockLed('worker2'),
      worker3: createMockLed('worker3')
    };
  }

  _setupRealGPIO() {
    try {
      console.log('[GPIO] Initializing real hardware');
      this.leds = {
        beltActive: new Gpio(17, 'out'),
        worker1: new Gpio(27, 'out'),
        worker2: new Gpio(22, 'out'),
        worker3: new Gpio(23, 'out')
      };
      
      // Initialize all LEDs to off
      Object.values(this.leds).forEach(led => led.writeSync(0));
      // Activate belt LED
      this.setLed('beltActive', true);
    } catch (err) {
      console.error('[GPIO] Hardware initialization failed, falling back to mock mode:', err);
      this.mockMode = true;
      this._setupMockGPIO();
    }
  }

  setLed(pin, state) {
    if (!this.leds[pin]) {
      throw new Error(`[GPIO] Invalid pin: ${pin}`);
    }
    
    const value = state ? 1 : 0;
    this.leds[pin].writeSync(value);
    
    if (this.mockMode) {
      console.log(`[GPIO] ${pin} set to ${state}`);
    }
  }

  getLedState(pin) {
    if (!this.leds[pin]) {
      throw new Error(`[GPIO] Invalid pin: ${pin}`);
    }
    return this.leds[pin].readSync() === 1;
  }

  cleanup() {
    if (this.mockMode) {
      console.log('[GPIO] Mock cleanup complete');
      return;
    }

    console.log('[GPIO] Cleaning up hardware');
    Object.entries(this.leds).forEach(([pin, led]) => {
      try {
        led.writeSync(0);
        led.unexport();
        console.log(`[GPIO] Released pin ${pin}`);
      } catch (err) {
        console.error(`[GPIO] Error cleaning up pin ${pin}:`, err);
      }
    });
  }
}

// Singleton instance with enhanced logging
const gpioInstance = new GPIOController();

// Add test helper methods when in test environment
if (process.env.NODE_ENV === 'test') {
  gpioInstance._resetForTests = function() {
    this.mockMode = true;
    this._setupMockGPIO();
    // Reset belt LED to active state
    this.setLed('beltActive', true);
    console.log('[GPIO] Reset for tests');
  };
  
  gpioInstance._getMockCalls = function(pin) {
    if (!this.leds[pin]) {
      throw new Error(`[GPIO] Pin ${pin} not found`);
    }
    return this.leds[pin].writeSync.mock?.calls || [];
  };
}

module.exports = gpioInstance;