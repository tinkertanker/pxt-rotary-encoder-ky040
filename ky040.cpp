#include "pxt.h"
#include "mbed.h"
using namespace pxt;

enum class Pins{
P0=  3,
P1=  2,
P2=  1,
P3=  4,
P4=  5,
P5=  17,
P6=  12,
P7=  11,
P8=  18,
P9=  10,
P10= 6,
P11= 26,
P12= 20,
P13= 23,
P14= 22,
P15= 21,
P16= 16,
P19= 0,
P20= 30};

enum class RotationDirection{
  Left = 0,
  Right = 1
};

namespace RotaryEncoder {
  uint32_t lri = 0, lbi=0;
  InterruptIn *ri;
  DigitalIn *dv, *dsw;
  Timer tsb;
  Action leftRotate, rightRotate, pressRotate;

  //%
  void onRotateEvent(RotationDirection dir, Action body) {
    //printf("onRotateEvent");
    if(dir == RotationDirection::Left) leftRotate = body;
    else rightRotate = body;
  }
  
  //%
  void onPressEvent(Action body){
    //printf("onPressEvent");
    pressRotate = body;
  }
  
  void onLR(){
    //printf("onLR");
    runAction0(leftRotate);
  }
  void onRR(){
    //printf("onRR");
    runAction0(rightRotate);
  }

  void onPress(){
    //printf("onPress");
    runAction0(pressRotate);
  }
  
  void onRotated(void){
    uint32_t now = tsb.read_ms();
    if(now - lri < 50) return;
    lri = now;
    if(dv->read()) create_fiber(onLR);//fire right rotate
    else create_fiber(onRR); //fire left rotate
  }

  void monitorPress(){
    while(true){
      uBit.sleep(50);
      if(dsw->read()) continue;
      uint32_t now = tsb.read_ms();
      if(now - lbi < 50) continue;
      lbi = now;
      onPress();
    }
  }

  //%
  void init(Pins clk, Pins dt, Pins sw){
    uBit.init();
    uBit.serial.send("init\n");
    ri = new InterruptIn((PinName)clk);
    dv = new DigitalIn((PinName)dt);
    dsw = new DigitalIn((PinName)sw);
    //EventQueue queue(32 * EVENTS_EVENT_SIZE);
    create_fiber(monitorPress);
    tsb.start(); //interrupt timer for debounce
    //ri.fall(&onPress);
    //ri.fall(&test);
    //ri->fall(callback(&onRotated));
    //ri.fall(queue.event(onRotated));
    //ri.fall(&onRotated);
    //Callback<void()> fall_event = queue.event(onRotated);
    //ri.fall(fall_event);
    //ri.fall(callback(this, RotaryEncoder::&onRotated));
    //ri->callback(&onRotated);
    //ri->fall(callback(this, &onRotated));
    //ri->fall(&onRotated);
  }
}

/*
namespace RotaryEncoder {
  uint32_t lri = 0, lbi=0;
  InterruptIn *ri;
  DigitalIn *dv, *dsw;
  Timer tsb;
  Action leftRotate, rightRotate, pressRotate;
  
  //%
  void onRotateEvent(RotationDirection dir, Action body) {
    if(dir == RotationDirection::Left) leftRotate.push_back(body);
    else rightRotate.push_back(body);
    //if(dir == RotationDirection::Left) leftRotate = body;
    //else rightRotate = body;
  }
  
  //%
  void onPressEvent(Action body){
    pressRotate.push_back(body);
    //pressRotate = body;
  }
  
  void onLR(){runAction0(leftRotate);}
  void onRR(){runAction0(rightRotate);}

  void onPress(){
    runAction0(pressRotate);
  }
  
  void onRotated(){
    uint32_t now = tsb.read_ms();
    if(now - lri < 50) return;
    lri = now;
    if(dv->read()) create_fiber(onLR);//fire right rotate
    else create_fiber(onRR); //fire left rotate
  }

  void monitorPress(){
    //printf("entering fiber\r\n");
    while(1){
      uBit.sleep(50);
      if(dsw->read()) continue;
      uint32_t now = tsb.read_ms();
      if(now - lbi < 50) continue;
      lbi = now;
      onPress();
    }
  }
  
  //%
  void init(Pins clk, Pins dt, Pins sw){
    ri = new InterruptIn((PinName)clk);
    dv = new DigitalIn((PinName)dt);
    dsw = new DigitalIn((PinName)sw);
    create_fiber(monitorPress);
    tsb.start(); //interrupt timer for debounce
    ri->fall(&onRotated);
  }
}
*/