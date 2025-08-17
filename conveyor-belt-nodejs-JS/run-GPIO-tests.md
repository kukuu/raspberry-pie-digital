# Run GPIO Tests

```
# Unit tests
npm test test/unit/gpio.test.js

# Hardware integration test (mock mode)
npm test test/integration/hardware.test.js

# Physical GPIO test (on Raspberry Pi)
node scripts/test-gpio.js

```

## Expected Output:

- Non-Pi environments: Automatically falls back to mock mode

- Raspberry Pi: Controls actual GPIO pins 17, 27, 22, 23

- Test LEDs should blink in sequence during hardware test

##  Key Safety Features:

- Automatic mock mode detection

- Graceful cleanup on exit

- Hardware-independent test suite

- Visual feedback for all critical states
