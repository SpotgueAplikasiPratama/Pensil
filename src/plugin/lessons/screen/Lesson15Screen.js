import React from 'react';
import Core from '../../core/core';

export default class Lesson15Screen extends Core.Screen.SGBaseScreen {

  createStyleSheet = (whp) => {
    const {StyleSheet} = Core;
    var { w, h, p } = whp;
    return StyleSheet.create({
      v1: { justifyContent: 'center', alignItems: 'flex-start', width: w, height: h, overflow: 'visible' },
    });
  }

  constructor(props, context, ...args) {
    Core.log('constructor');
    super(props, context, ...args);
    this.style = this.createStyleSheet(this.WHP);
    this._darkMode = false;
}

  render() {
    Core.log('render')
    const {SGRootView, SGView, SGButton, SGText, SGDragView } = Core.Control;
    var style = this.style;
    var {w,h,p} =this.WHP;
    return (
      <SGRootView>
        <SGView style={{ width:w,alignSelf: 'stretch', flex: 1, backgroundColor: this._darkMode ? 'black' : 'white' }}>
            <SGDragView shadow style={{ top: h - 300, right: 20, borderRadius: 25, width: 100, height: 100, backgroundColor: 'blue', }} onBeginDrag={(e) => { Core.log('mulai') }} onRelease={(e) => { Core.log('selesai') }}>
                <SGText preset={SGText.preset.h1} style={{ color: 'white' }} onPress={()=>{alert('button clicked')}} >+</SGText>
            </SGDragView>
            <SGDragView shadow style={{ top: w*0.075, left: w*0.075, borderRadius: w*0.075, width: w*0.15, height: w*0.15, backgroundColor: 'blue', }} onBeginDrag={(e) => { Core.log('mulai') }} onRelease={(e) => { Core.log('selesai') }}>
                <SGText preset={SGText.preset.h1} style={{ color: 'white' }} onPress={()=>{alert('button clicked')}}  >+</SGText>
            </SGDragView>
            <SGDragView shadow style={{ top: 20, right: 20, borderRadius: 25, backgroundColor: 'blue', }} onBeginDrag={(e) => { Core.log('mulai') }} onRelease={(e) => { Core.log('selesai') }}>
                <SGButton label={'Toggle Dark Mode'} onPress={()=>{this._darkMode=!this._darkMode; this.forceUpdate();}} />
            </SGDragView>
        </SGView>
      </SGRootView>
    );
  }
}