const { Gpio } = require('onoff');

class GPIOController {
  constructor() {
    this.mockMode = process.env.NODE_ENV === 'test' || !Gpio.accessible;
    this.leds = {};
    this.initGPIO();
  }

  initGPIO() {
    if (this.mockMode) {
      console.log('Using GPIO mock mode');
      this.leds = {
        beltActive: { writeSync: () => {} },
        worker1: { writeSync: () => {} },
        worker2: { writeSync: () => {} },
        worker3: { writeSync: () => {} }
      };
      return;
    }

    try {
      this.leds = {
        beltActive: new Gpio(17, 'out'),
        worker1: new Gpio(27, 'out'),
        worker2: new Gpio(22, 'out'),
        worker3: new Gpio(23, 'out')
      };
    } catch (err) {
      this.mockMode = true;
      console.warn('GPIO init failed, falling back to mock mode');
    }
  }

  setLed(pin, state) {
    if (!this.leds[pin]) {
      throw new Error(`Invalid GPIO pin: ${pin}`);
    }
    this.leds[pin].writeSync(state ? 1 : 0);
  }

  cleanup() {
    if (this.mockMode) return;
    Object.values(this.leds).forEach(led => {
      try {
        led.unexport();
      } catch (err) {
        console.error('GPIO cleanup error:', err);
      }
    });
  }
}

module.exports = new GPIOController();
