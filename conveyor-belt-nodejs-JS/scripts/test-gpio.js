const gpio = require('../lib/gpio');

console.log('Testing physical GPIO...');
console.log(`Mock mode: ${gpio.mockMode}`);

// LED test sequence
const leds = ['beltActive', 'worker1', 'worker2', 'worker3'];
let counter = 0;

const testInterval = setInterval(() => {
  const led = leds[counter % leds.length];
  const state = !(counter % 2);
  
  gpio.setLed(led, state);
  console.log(`Toggled ${led} ${state ? 'ON' : 'OFF'}`);
  
  if (++counter >= 8) {
    clearInterval(testInterval);
    gpio.cleanup();
    console.log('GPIO test complete');
  }
}, 500);