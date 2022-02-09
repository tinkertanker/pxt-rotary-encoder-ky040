let lri = 0, lbi = 0, tsb = 0;
let leftRotate: Action;
let rightRotate: Action;
let pressRotate: Action;
let ri: DigitalPin;
let dv: DigitalPin;
let dsw: DigitalPin;
let lastPressed = 1;
let lastRI = 1;
let lastDV = 1;
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
                //serial.writeValue("pressed", pressed);
                //serial.writeValue("lastPressed", lastPressed);
                if (pressed != lastPressed) {
                    lastPressed = pressed;
                    if (pressed == 0) control.raiseEvent(pressedID, 0);
                }
                basic.pause(50);
            }
        })
        /*
        while (true) {
            serial.writeNumber(pins.digitalReadPin(dsw));
            serial.writeLine("");
            basic.pause(50);
            if (pins.digitalReadPin(dsw) == 1) continue;
            let now = input.runningTime();
            if (now - lbi < 50) continue;
            lbi = now;
            control.raiseEvent(5600, 0);
            //onPress();
        }
        */
    }

    /**
     * initialises local variables and enables the rotary encoder.
     */
    //% blockId=rotary_ky_init
    //% block="connect clk %clk|dt %dt|sw %sw"
    //% icon="\uf1ec"
    export function init(clk: DigitalPin, dt: DigitalPin, sw: DigitalPin): void {
        serial.setBaudRate(115200);
        serial.writeString("Initialising...");
        serial.writeLine("");
        ri = clk;
        dv = dt;
        dsw = sw;
    }

    function monitorPress() {
        /*
        while (true) {
            serial.writeNumber(pins.digitalReadPin(dsw));
            serial.writeLine("");
            basic.pause(50);
            if (pins.digitalReadPin(dsw) == 1) continue;
            let now = input.runningTime();
            if (now - lbi < 50) continue;
            lbi = now;
            onPress();
        }
        */
    }

    function onPress() {
        serial.writeString("Pressed!\n");
        pressRotate;
    }
}
