# KY040 Rotary Encoder MakeCode Package [![Build Status](https://travis-ci.org/Tinkertanker/pxt-ky040-microbit.svg?branch=master)](https://travis-ci.org/Tinkertanker/pxt-ky040-microbit)

This is the MakeCode package for the KY-040 rotary encoder.

## Hardware Setup
1. Connect the appropriate pins (CLK, DT, SW, GND) to the micro:bit.

## Blocks
### Initialise rotary encoder
Initialises the rotary encoder.

Sets up the micro:bit to use the rotary encoder.

```sig
RotaryEncoder.init(P0, P1, P2)
```

This block must be placed before any of the other blocks in this list.

### On button pressed
Button push event.

Called whenever the button is pushed down.

```sig
RotaryEncoder.onPressEvent(() => {
    basic.showString("Button pressed!")
})
```

### On rotate (left/right)
Rotation event.

Called whenever the encoder detects rotation.

```sig
RotaryEncoder.onRotateEvent(RotationDirection.Left, () => {
    basic.showString("<")
})

RotaryEncoder.onRotateEvent(RotationDirection.Right, () => {
    basic.showString(">")
})
```

## Example: Number input
The follow code creates a number input that can be adjusted by turning the encoder.

```blocks
RotaryEncoder.init(P0, P1, P2)
let item = 0
basic.showNumber(item)
RotaryEncoder.onRotateEvent(RotationDirection.Left, () => {
    item -= 1
    basic.showNumber(item)
})
RotaryEncoder.onRotateEvent(RotationDirection.Right, () => {
    item += 1
    basic.showNumber(item)
})
RotaryEncoder.onPressEvent(() => {
    basic.showString("selected!")
})
```

## Supported targets

 * for PXT/microbit
 
