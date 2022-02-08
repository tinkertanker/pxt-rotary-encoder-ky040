// tests go here; this will not be compiled when this package is used as a library

let item = 3;
basic.forever(() => {
    basic.showNumber(item);
})
RotaryEncoder.onPressEvent(() => {
    serial.writeString("onPress\n");
    item = 0;
    basic.showNumber(item);
})
RotaryEncoder.onRotateEvent(RotationDirection.Right, () => {
    serial.writeString("rotate right\n");
    item = 1;
    basic.showNumber(item);
})
RotaryEncoder.onRotateEvent(RotationDirection.Left, () => {
    serial.writeString("rotate left\n");
    item = 2;
    basic.showNumber(item);
})
RotaryEncoder.init(Pins.P8, Pins.P9, Pins.P11);
serial.setBaudRate(9600);
serial.writeString("Hello World!\n");