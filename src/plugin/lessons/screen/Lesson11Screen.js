import React from 'react';
import Core from '../../core/core';

export default class Lesson11Screen extends Core.Screen.SGBaseScreen {

  createStyleSheet = (whp) => {
    const { StyleSheet } = Core;
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
    this.pvID1 = Core.Control.SGPopView.getPopViewID();
    this.pvID2 = Core.Control.SGPopView.getPopViewID();
  }

  showPopView1() {
    Core.Control.SGPopView.showPopView(this.pvID1);
  }
  showPopView2() {
    Core.Control.SGPopView.showPopView(this.pvID2);
  }

  render() {
    const { SGRootScrollView, SGPopView, SGView, SGButton, SGText, } = Core.Control;
    const { SGHelperNavigation } = Core.Helper;
    console.log('render')
    var style = this.style;
    var { w, h, p } = this.WHP;
    return (
      <SGRootScrollView style={{width:w, backgroundColor: this._darkMode ? 'black' : 'white' }}>
        <SGButton label={'Toggle Dark Mode'} onPress={() => { this._darkMode = !this._darkMode; this.forceUpdate(); }} />
        <SGText onPress={this.showPopView1.bind(this)}>Show Pop View1</SGText>
        <SGText onPress={this.showPopView2.bind(this)}>Show Pop View2</SGText>

        <SGPopView modal vPos={'top'} hPos={'center'} animationType={'none'} popViewID={this.pvID1}>
          <SGView style={{ width: w * 0.8, height: w * 0.5, backgroundColor: 'green' }}>
            <SGText style={{ color: 'white' }} onPress={() => { SGPopView.hidePopView(this.pvID1) }}>Modal Hide</SGText>
          </SGView>
        </SGPopView>
        <SGPopView animationType={'slide'} vPos={'bottom'} popViewID={this.pvID2}>
          <SGView style={{ width: w * 0.5, height: w * 0.5, backgroundColor: 'red' }}>
            <SGText style={{color:'white'}} onPress={() => { SGHelperNavigation.navigateReset(this.props.navigation, 'HomeScreen') }}>Home Screen</SGText>
          </SGView>
        </SGPopView>
      </SGRootScrollView>
    );
  }
}