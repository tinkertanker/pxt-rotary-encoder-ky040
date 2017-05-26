//% color=50 weight=80
//% icon="\uf01e"
namespace RotaryEncoder {

    /**
     * rotary encoder was rotated.
     */
    //% blockId=rotary_ky_rotated_left_event
    //% block="on rotated |%dir" shim=RotaryEncoder::onRotateEvent
    export function onRotateEvent(dir: RotationDirection, body: () => void): void{
        return;
    }

    /**
     * rotary encoder button was pressed.
     */
    //% blockId=rotary_ky_pressed_event
    //% block="on button pressed" shim=RotaryEncoder::onPressEvent
    export function onPressEvent(body: () => void): void{
        return;
    }

    /**
     * initialises local variables and enables the rotary encoder.
     */ 
    //% blockId=rotary_ky_init
    //% block="connect clk %clk|dt %dt|sw %sw"
    //% icon="\uf1ec" shim=RotaryEncoder::init
    export function init(clk: Pins, dt: Pins, sw: Pins): void{
        return;
    }
}