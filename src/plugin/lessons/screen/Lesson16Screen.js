import React from 'react';
import Core from '../../core/core';

export default class Lesson16Screen extends Core.Screen.SGBaseScreen {

  createStyleSheet = (whp) => {
    const {StyleSheet} = Core;
    var { w, h, p } = whp;
    return StyleSheet.create({
      v1: { justifyContent: 'center', alignItems: 'flex-start', width: w, height: h, overflow: 'visible' },
    });
  }

  constructor(props, context, ...args) {
    console.log('constructor');
    super(props, context, ...args);
    this.style = this.createStyleSheet(this.WHP);
    this._darkMode = false;
}

  render() {
    console.log('render')
    const {SGRootScrollView, SGPanZoomView, SGView, SGButton, SGImage, } = Core.Control;
    var style = this.style;
    var {w,h,p} =this.WHP;
    return (
      <SGRootScrollView style={{width:w, backgroundColor:'white'}}>
        <SGButton label={'Toggle Dark Mode'} onPress={()=>{this._darkMode=!this._darkMode; this.forceUpdate();}} />
        <SGView style={{ alignSelf: 'stretch', flex: 1 }}>
            <SGPanZoomView showBar shadow style={{ width: w*0.8, height: w*0.8, }} scale={1}>
                <SGImage source={{ uri: 'https://www.spotgue.com/logo.png' }} style={{ width: w*0.8, height: w*0.8, backgroundColor: 'orange' }} />
            </SGPanZoomView>
            <SGPanZoomView locked shadow style={{ width: w*0.8, height: w*0.8, }} scale={0.5}>
                <SGImage source={{ uri: 'https://www.spotgue.com/logo.png' }} style={{ width: w*1.6, height: w*1.6, backgroundColor: 'green' }} />
            </SGPanZoomView>
        </SGView>
      </SGRootScrollView>
    );
  }
}