import React from 'react';
import Core from '../../core/core';

export default class Lesson12Screen extends Core.Screen.SGBaseScreen {

  createStyleSheet = (whp) => {
    const { StyleSheet } = Core;
    var { w, h, p } = whp;
    return StyleSheet.create({
      v1: { justifyContent: 'center', alignItems: 'flex-start', width: w, height: h, overflow: 'visible' },
    });
  }

  constructor(props, context, ...args) {
    super(props, context, ...args);
    this.style = this.createStyleSheet(this.WHP);
    this._darkMode = false;
  }

  render() {
    const { SGRootView, SGViewPager, SGImage, SGView, SGText, } = Core.Control;
    var style = this.style;
    var { w, h, p } = this.WHP;
    return (
      <SGRootView>
        <SGView tabLabel='SGViewPager' style={{ alignSelf: 'stretch', flex: 1, width:w, }}>
          <SGViewPager noAutoScroll style={{ width: '100%', height: '100%', }} initialPage={0}>
            <SGView key='1' style={{ alignItems: 'center', justifyContent: 'center', backgroundColor: 'purple', borderRadius: 30 }}>
              <SGText>Hello</SGText>
              <SGImage preset={SGImage.preset.w3P} source={{ uri: 'https://www.spotgue.com/logo.png' }} />
            </SGView>
            <SGView key='2' style={{ borderRadius: 30 }}>
              <SGText>Apa</SGText>
            </SGView>
            <SGView key='3' style={{ backgroundColor: 'orange', borderRadius: 30 }}>
              <SGText>Kabar</SGText>
            </SGView>
          </SGViewPager>
        </SGView>
      </SGRootView>
    );
  }
}