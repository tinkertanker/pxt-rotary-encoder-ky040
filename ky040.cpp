#include "pxt.h"
using namespace pxt;
typedef vector<Action> vA;

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
  uint32_t lri = 0, lbi=0;InterruptIn *ri; DigitalIn *dv, *dsw; Timer tsb; vA leftRotate, rightRotate, pressRotate;
  
  //%
  void onRotateEvent(RotationDirection dir, Action body) {
    if(dir == RotationDirection::Left) leftRotate.push_back(body);
    else rightRotate.push_back(body);
  }
  
  //%
  void onPressEvent(Action body){
    pressRotate.push_back(body);
  }
  
  void cA(vA runner){for(int i=0;i<runner.size();i++){runAction0(runner[i]);} }
  void onLR(){cA(leftRotate);}
  void onRR(){cA(rightRotate);}

  void onPress(){
    cA(pressRotate);
  }
  
  void onRotated(){
    uint32_t now = tsb.read_ms();
    if(now - lri < 50) return;
    lri = now;
    if(dv->read()) create_fiber(onLR);//fire right rotate
    else create_fiber(onRR); //fire left rotate
  }

  void monitorPress(){
    printf("entering fiber\r\n");
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
