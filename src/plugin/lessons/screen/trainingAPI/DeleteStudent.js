import React from 'react';
import Core from '../../core/core';

export default class DeleteStudent extends Core.Screen.SGBaseScreen {

  createStyleSheet = (whp) => {
    const { StyleSheet } = Core;
    var { w, h, p } = whp;
    return StyleSheet.create({
      v1: { flex: 1, backgroundColor: '#fff3d1', alignItems: 'center', justifyContent: 'center' }
    });
  }

  constructor(props, context, ...args) {
    super(props, context, ...args);
    this.whp = Core.Helper.SGHelperWindow.getWHP();
    this.style = this.createStyleSheet(this.whp);
    this._posXY = { x: 50, y: 50 };
    this.data='';
  }

 
  async _onCallAPIStudent(){
    var data1 = {id:this.id, nama: this.nama, umur: this.umur, sekolah:this.sekolah}
    try{
      var v = await Core.Helper.SGHelperAPICall.callAPIAsync("POST",
      "https://skolineapilessonrh.azurewebsites.net/api/functionDelete?code=wUB4KhKGK4vDZmkyCwbXTWukQJZaUaKzfObiRzFl1bJS6A9HqZr3gQ==","",
      JSON.stringify(data1));
      var data2 = JSON.parse(v.data);
      this.id = data2.id;
      this.sekolah = data2.sekolah;
      this.forceUpdate();
      Core.log('data masuk')
    } catch(e){
      Core.log(e);
    }
  }
  

  render() {
    const { SGRootScrollView, SGText, SGTextInput, SGView, SGViewShot, SGImage, SGDragView, SGButton } = Core.Control;
    var { w, h, p } = this.whp;
    var style = this.style;
    return (
      <SGRootScrollView style={style.v1}>
        <SGText>{'ID'}</SGText>
        <SGTextInput value={this.id} placeholder={'Masukan ID'} onValueChange={(v)=>{this.id=v;}}/>
        <SGText>{'Sekolah'}</SGText>
        <SGTextInput value={this.sekolah} placeholder={'Masukan Sekolah'} onValueChange={(v)=>{this.sekolah=v;}}/>
        <SGButton label={'Hapus'} onPress={()=>{this._onCallAPIStudent()}} />        
  
      </SGRootScrollView>
    );
  }
}