import React from 'react';
import Core from '../../core/core';
import MyTranslator from '../locale/MyTranslator';


export default class Lesson20Screen extends Core.Screen.SGBaseScreen {

  createStyleSheet = (whp) => {
    const { StyleSheet } = Core;
    var { w, h, p } = whp;
    return StyleSheet.create({
      v1: { justifyContent: 'center', alignItems: 'flex-start', width: w, height: h, overflow: 'visible' },
    });
  }

  constructor(props, context, ...args) {
    Core.log('constructor');
    super(props, context, ...args);
    const { Animated, } = Core.Control;
    this.style = this.createStyleSheet(this.WHP);
    this._darkMode = false;
    this._flag = 'down';
    this._baseAnimVar = new Animated.Value(0);
    this._flag2 = 'right';
    this._baseAnimVar2 = new Animated.Value(0);
    this._flag3 = 'right';
    this._baseAnimVar3 = new Animated.Value(0);

    this._posisiKiri = true;
    this._lingkaranXPos = new Animated.Value(0);

    this._skalaNormal = true;
    this._lingkaranScale = new Animated.Value(1);

    this._rotateNormal = true;
    this._lingkaranRotate = new Animated.Value(0);

    this._opacityNormal = true;
    this._lingkaranOpacity = new Animated.Value(1);

    // this._white = true;
    // this._lingkaranRGB = new Animated.Value(1);
  }

  onButtonPress() {
    const { Animated, } = Core.Control;
    var start = this._flag === 'down' ? 1 : 0;
    var end = this._flag === 'down' ? 0 : 1;
    this._baseAnimVar.setValue(start);
    Animated.timing(this._baseAnimVar, {
      toValue: end,
      duration: 500,
      useNativeDriver: false
    }).start((res) => {
      this._flag = this._flag === 'down' ? 'up' : 'down';
      Core.log('animasi selesai')
    });
  }

  onButton2Press() {
    const { Animated, } = Core.Control;
    var start = this._flag2 === 'right' ? 0 : 1;
    var end = this._flag2 === 'right' ? 1 : 0;
    this._baseAnimVar2.setValue(start);
    Animated.timing(this._baseAnimVar2, {
      toValue: end,
      duration: 500,
      useNativeDriver: false
    }).start((res) => {
      this._flag2 = this._flag2 === 'right' ? 'left' : 'right';
      Core.log('animasi selesai')
    });
  }

  onButton3Press() {
    const { Animated, } = Core.Control;
    var start = this._flag3 === 'right' ? 0 : 1;
    var end = this._flag3 === 'right' ? 1 : 0;
    this._baseAnimVar3.setValue(start);
    Animated.timing(this._baseAnimVar3, {
      toValue: end,
      duration: 500,
      useNativeDriver: false
    }).start((res) => {
      this._flag3 = this._flag3 === 'right' ? 'left' : 'right';
      Core.log('animasi selesai')
    });
  }

  // 8 button
  // 1. geser ke kanan 300
  // 2. geser ke kiri kembali ke 0
  // 3. scale dari 1 ke 2 
  // 4. scale dari 2 ke 1
  // 5. rotate dari 0 ke 180 degree
  // 6. rotate dari 180 ke 0 degree
  // 7. opacity dari 1 ke 0
  // 8. opacity dari 0 ke 1

  onButton4Press(){
    const { Animated, } = Core.Control;
    var start = (this._posisiKiri ? 0 : 300);
    var end = (this._posisiKiri ? 300 : 0);
    this._lingkaranXPos.setValue(start);
    Animated.timing(this._lingkaranXPos, {
      toValue: end,
      duration: 1000,
      useNativeDriver: false
    }).start((res) => {
      this._posisiKiri = !this._posisiKiri;
    });
  }

  onButton5Press(){
    const { Animated, } = Core.Control;
    var start = (this._skalaNormal ? 1 : 2);
    var end = (this._skalaNormal ? 2 : 1);
    this._lingkaranScale.setValue(start);
    Animated.timing(this._lingkaranScale, {
      toValue: end,
      duration: 1000,
      useNativeDriver: false
    }).start((res) => {
      this._skalaNormal = !this._skalaNormal;
    });
  }

  onButton6Press(){
    const { Animated, } = Core.Control;
    var start = (this._rotateNormal ? 0 : 1);
    var end = (this._rotateNormal ? 1 : 0);
    this._lingkaranRotate.setValue(start);
    Animated.timing(this._lingkaranRotate, {
      toValue: end,
      duration: 1000,
      useNativeDriver: false
    }).start((res) => {
      this._rotateNormal = !this._rotateNormal;
    });
  }
  onButton7Press(){
    const { Animated, } = Core.Control;
    var start = (this._opacityNormal ? 1 : 0);
    var end = (this._opacityNormal ? 0 : 1);
    this._lingkaranOpacity.setValue(start);
    Animated.timing(this._lingkaranOpacity, {
      toValue: end,
      duration: 1000,
      useNativeDriver: false
    }).start((res) => {
      this._opacityNormal = !this._opacityNormal;
    });
  }
  // onButton8Press(){
  //   const { Animated, } = Core.Control;
  //   var start = (this._white ? 1 : 0);
  //   var end = (this._white ? 0 : 1);
  //   this._lingkaranRGB.setValue(start);
  //   Animated.timing(this._lingkaranRGB, {
  //     toValue: end,
  //     duration: 1000,
  //     useNativeDriver: false
  //   }).start((res) => {
  //     this._white = !this._white;
  //   });
  // }

  render() {
    Core.log('render')
    const { SGRootView, Animated, SGButton, SGText, } = Core.Control;
    var style = this.style;
    var { w, h, p } = this.WHP;
    // backgroundColor:'rgb('+this._lingkaranRGB.interpolate({ inputRange: [0, 1], outputRange: [0, 255] })+','+this._lingkaranRGB.interpolate({ inputRange: [0, 1], outputRange: [0, 255] })+','+this._lingkaranRGB.interpolate({ inputRange: [0, 1], outputRange: [0, 255] })+')'
    return (
      <SGRootView style={{width:w, backgroundColor:'white'}}>
        <SGButton label={'Animate Up Down'} onPress={this.onButtonPress.bind(this)} />
        <SGButton label={'Animate Left Right'} onPress={this.onButton2Press.bind(this)} />
        <SGButton label={'Animate Rotate'} onPress={this.onButton3Press.bind(this)} />
        <SGButton label={'Geser Lingkaran Kiri-Kanan'} onPress={this.onButton4Press.bind(this)} />
        <SGButton label={MyTranslator.tr('Lesson20Screen.scale')} onPress={this.onButton5Press.bind(this)} />
        <SGButton label={'Rotate Lingkaran 0-180'} onPress={this.onButton6Press.bind(this)} />
        <SGButton label={'Opacity Lingkaran 1-0'} onPress={this.onButton7Press.bind(this)} />
        {/* <SGButton label={'Warna Lingkaran putih ke hitam'} onPress={this.onButton8Press.bind(this)} /> */}
        <Animated.View style={{ width: 100, height: 100, top: 200, left: 0, opacity: this._baseAnimVar.interpolate({ inputRange: [0, 1], outputRange: [0.5, 1] }), borderRadius: this._baseAnimVar.interpolate({ inputRange: [0, 1], outputRange: [0, 200] }), backgroundColor: 'pink', position: 'absolute', transform: [{ rotateZ: this._baseAnimVar3.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] }) }, { translateY: this._baseAnimVar.interpolate({ inputRange: [0, 1], outputRange: [0, 200] }) }, { translateX: this._baseAnimVar2.interpolate({ inputRange: [0, 1], outputRange: [0, 200] }) }] }}>
          <SGText>
            {'Magic Box'}
          </SGText>
        </Animated.View>
        <Animated.View style={{ width: 100, 
            height: 100, top: 400, opacity:this._lingkaranOpacity, transform:[{scale:this._lingkaranScale}, {rotateZ:this._lingkaranRotate.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '180deg'] })}], left: this._lingkaranXPos, borderRadius: 50,  position: 'absolute', justifyContent:'center', alignItems:'center', backgroundColor:'purple' }}>
          <SGText>Lingkaran</SGText>
        </Animated.View>
      </SGRootView>
    );
  }
}