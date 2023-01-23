import React from 'react';
import Core from '../../core/core';


export default class TestScreen extends Core.Screen.SGBaseScreen {
  createStyleSheet = (whp) => {
    const { StyleSheet } = Core;
    var { w, h, p } = whp;
    return StyleSheet.create({
        v1:{backgroundColor:'red'},
    });
  }

  constructor(props, context, ...args) {
    super(props, context, ...args);
    this.style = this.createStyleSheet(this.WHP);
  }

  render() {
    const { SGRootScrollView, SGImage, SGTouchableOpacity, SGText, SGButton } = Core.Control;
    const { SGHelperNavigation } = Core.Helper;
    var style = this.style;
    var {w,h,p} = this.WHPNoHeader;
    return (
      <SGRootScrollView style={style.v1} >
      </SGRootScrollView>
    );
  }
}