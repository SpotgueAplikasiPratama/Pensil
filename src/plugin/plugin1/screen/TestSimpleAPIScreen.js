import React from 'react';
import Core from '../../../core/core';
import TestComponent from '../component/TestComponent';
import StudentModel from '../model/StudentModel';
import SimpleAPI from '../api/SimpleAPI';

export default class TestSimpleAPIScreen extends Core.Screen.SGBaseScreen {

  createStyleSheet = (whp) => {
    const { StyleSheet } = Core;
    var { w, h, p } = whp;
    return StyleSheet.create({
      v1: { flex: 1, backgroundColor: 'white', alignItems: 'center', justifyContent: 'center' }
    });
  }

  constructor(props, context, ...args) {
    super(props, context, ...args);
    this.style = this.createStyleSheet(this.WHP);
    this.data = new StudentModel({nama:'afaldo',alamat:'disana',umur:69});
  }

  async _onCallAPITambah(num1,num2){
    try{
        var res = await SimpleAPI.CallAPITambah(num1, num2);
        alert(res);
    } catch(e){
      Core.log(e);
    }
  }
  async _onCallAPIUpperCase(){
    try{
      var v = await SimpleAPI.CallAPIUpperCase(this.data.getCurrentJSON());
      this.data.nama = v.nama;
      this.data.alamat = v.alamat;
      this.data.umur = v.umur;
      this.forceUpdate();
    } catch(e){
      Core.log(e);
    }
  }

  render() {
    const {SGRootScrollView, SGText, SGTextInput, SGButton } = Core.Control;
    var { w, h, p } = this.WHP;
    var style = this.style;
    return (
      <SGRootScrollView style={style.v1}>
        <SGText>{'a'}</SGText>
        <SGTextInput value={this.num1} onValueChange={(v)=>{this.num1=v;}}/>
        <SGText>{'b'}</SGText>
        <SGTextInput value={this.num2} onValueChange={(v)=>{this.num2=v;}}/>
        <SGButton label={'Call API Tambah'} onPress={()=>{this._onCallAPITambah(this.num1, this.num2)}} />
        <TestComponent data={this.data} />
        <SGButton label={'Call API Upper'} onPress={this._onCallAPIUpperCase.bind(this)} />
      </SGRootScrollView>
    );
  }
}