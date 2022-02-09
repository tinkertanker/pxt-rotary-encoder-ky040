// tests go here; this will not be compiled when this package is used as a library

let item = 5;
RotaryEncoder.init(DigitalPin.P8, DigitalPin.P9, DigitalPin.P11);
basic.forever(() => {
    basic.showNumber(item);
})
RotaryEncoder.onPressEvent(() => {
    //serial.writeString("onPress\n");
    item = 5;
    basic.showIcon(IconNames.Heart);
})
RotaryEncoder.onRotateEvent(RotationDirection.Right, () => {
    //serial.writeString("rotate right\n");
    item++;
})
RotaryEncoder.onRotateEvent(RotationDirection.Left, () => {
    //serial.writeString("rotate left\n");
    item--;
})
