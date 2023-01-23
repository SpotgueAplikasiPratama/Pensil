import React from 'react';
import Core from '../../../core/core';

export default class TestComponent extends Core.Control.SGBaseContainer {

  createStyleSheet = (whp) => {
    const { StyleSheet } = Core;
    var { w, h, p } = whp;
    return StyleSheet.create({
      v1: { width:w, flex: 1, backgroundColor: 'white', alignItems: 'center', justifyContent: 'center' }
    });
  }

  constructor(props, context, ...args) {
    super(props, context, ...args);
    this.style = this.createStyleSheet(this.screenWHP);
  }

  componentWillUnmount() {
    if (!this._previousOrientationLandscape) {     
      Core.Helper.SGHelperWindow.lockPortrait();
    }
  }

  render() {
    const {SGText, SGTextInput, SGView, } = Core.Control;
    var { w, h, p } = this.screenWHP;
    var style = this.style;
    var data = this.props.data;
    return (
      <SGView style={style.v1}>
        <SGText>{data.nama}</SGText>
        <SGTextInput value={data.nama} onValueChange={(v)=>{data.nama=v;}}/>
        <SGText>{'alamat'}</SGText>
        <SGTextInput value={data.alamat} onValueChange={(v)=>{data.alamat=v;}}/>
        <SGText>{'umur'}</SGText>
        <SGTextInput value={data.umur} onValueChange={(v)=>{data.umur=v;}}/>
      </SGView>
    );
  }
}