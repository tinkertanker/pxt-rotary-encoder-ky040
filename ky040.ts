let ri: DigitalPin;
let dv: DigitalPin;
let dsw: DigitalPin;
let lastPressed = 1;
let pressedID = 5600;
let rotatedLeftID = 5601;
let rotatedRightID = 5602;
let rotateReady = true;

enum RotationDirection {
    Left = 0,
    Right = 1
}

//% color=50 weight=80
//% icon="\uf01e"
namespace RotaryEncoder {

    /**
     * rotary encoder was rotated.
     */
    //% blockId=rotary_ky_rotated_left_event
    //% block="on rotated |%dir"
    export function onRotateEvent(dir: RotationDirection, body: () => void): void {
        serial.setBaudRate(115200);
        if (dir == RotationDirection.Left) control.onEvent(rotatedLeftID, dir, body);
        if (dir == RotationDirection.Right) control.onEvent(rotatedRightID, dir, body);
        control.inBackground(() => {
            while (true) {
                const riValue = pins.digitalReadPin(ri);
                const dvValue = pins.digitalReadPin(dv);
                serial.writeValue("ri", riValue);
                serial.writeValue("dv", dvValue);
                if (riValue == 1 && dvValue == 1) rotateReady = true;
                else if (rotateReady) {
                    if (riValue == 1 && dvValue == 0) {
                        serial.writeLine("Right!");
                        rotateReady = false;
                        control.raiseEvent(rotatedRightID, RotationDirection.Right);
                    }
                    else if (riValue == 0 && dvValue == 1) {
                        serial.writeLine("Left!")
                        rotateReady = false;
                        control.raiseEvent(rotatedLeftID, RotationDirection.Left);
                    }
                }
                basic.pause(5);
            }
        })
    }

    /**
     * rotary encoder button was pressed.
     */
    //% blockId=rotary_ky_pressed_event
    //% block="on button pressed"
    export function onPressEvent(body: () => void): void {
        control.onEvent(pressedID, 0, body);
        control.inBackground(() => {
            while (true) {
                const pressed = pins.digitalReadPin(dsw);
                if (pressed != lastPressed) {
                    lastPressed = pressed;
                    if (pressed == 0) control.raiseEvent(pressedID, 0);
                }
                basic.pause(50);
            }
        })
    }

    /**
     * initialises local variables and enables the rotary encoder.
     */
    //% blockId=rotary_ky_init
    //% block="connect clk %clk|dt %dt|sw %sw"
    //% icon="\uf1ec"
    export function init(clk: DigitalPin, dt: DigitalPin, sw: DigitalPin): void {
        ri = clk;
        dv = dt;
        dsw = sw;
    }
}
