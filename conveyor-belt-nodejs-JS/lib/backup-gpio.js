const Gpio = require('onoff').Gpio;
const LEDS = {
  worker1: new Gpio(17, 'out'), // Mocked if not on Pi
  worker2: new Gpio(27, 'out'),
  worker3: new Gpio(22, 'out')
};

function updateLeds(activeWorker) {
  Object.values(LEDS).forEach(led => led.writeSync(0)); // Turn all off
  if (LEDS[`worker${activeWorker}`]) LEDS[`worker${activeWorker}`].writeSync(1);
}