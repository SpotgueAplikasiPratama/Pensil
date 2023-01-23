import React from 'react';
import Core from '../../core/core';

export default class EditStudent extends Core.Screen.SGBaseScreen {

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
    this.id=Core.Helper.SGHelperGlobalVar.getVar('id');
    this.nama=Core.Helper.SGHelperGlobalVar.getVar('nama');
    this.umur=Core.Helper.SGHelperGlobalVar.getVar('umur');
    this.sekolah=Core.Helper.SGHelperGlobalVar.getVar('sekolah');
  }

 
  async _editStudent(){
    var data1 = {id:this.id,nama: this.nama, umur: this.umur, sekolah:this.sekolah}
    try{
      var v = await Core.Helper.SGHelperAPICall.callAPIAsync("POST",
      "https://skolineapilessonrh.azurewebsites.net/api/FunctionEdit?code=z8JWZeH0EoW9S7AEJXEwYU0M5FK8uAhHe6YYxcSzZeygCaDqZJOOjA==","",
      JSON.stringify(data1));
      var data2 = JSON.parse(v.data);
      this.id=data2.id;
      this.nama = data2.nama;
      this.umur = data2.umur;
      this.sekolah = data2.sekolah;
      this.forceUpdate();
      // Core.log('data masuk')
      // Core.log(this.id)
      

    } catch(e){
      Core.log(e);
    }
  }
  async _deleteStudent(){
    var data1 = {id:this.id, nama: this.nama, umur: this.umur, sekolah:this.sekolah}
    try{
      var v = await Core.Helper.SGHelperAPICall.callAPIAsync("POST",
      "https://skolineapilessonrh.azurewebsites.net/api/functionDelete?code=wUB4KhKGK4vDZmkyCwbXTWukQJZaUaKzfObiRzFl1bJS6A9HqZr3gQ==","",
      JSON.stringify(data1));
      var data2 = JSON.parse(v.data);
      this.id = data2.id;
      this.sekolah = data2.sekolah;
      this.forceUpdate();
      // Core.log('data masuk')
    } catch(e){
      Core.log(e);
    }
  }
  

  render() {
    const { SGRootScrollView, SGText, SGTextInput, SGView, SGViewShot, SGImage, SGDragView, SGButton,SGDialogBox } = Core.Control;
    const { SGHelperNavigation } = Core.Helper;

    var { w, h, p } = this.whp;
    var style = this.style;
    return (
      <SGRootScrollView style={style.v1}>
        <SGText>{'ID'}</SGText>
        <SGTextInput disabled preset={SGTextInput.preset.default} value={this.id} placeholder={'Masukan ID'} onValueChange={(v)=>{this.id=v;}}/>
        <SGText>{'Nama'}</SGText>
        <SGTextInput value={this.nama} placeholder={'Masukan Nama'} onValueChange={(v)=>{this.nama=v;}}/>
        <SGText>{'Umur'}</SGText>
        <SGTextInput value={this.umur} placeholder={'Masukan Umur'} onValueChange={(v)=>{this.umur=v;}}/>
        <SGText>{'Sekolah'}</SGText>
        <SGTextInput value={this.sekolah} placeholder={'Masukan Sekolah'} onValueChange={(v)=>{this.sekolah=v;}}/>
        <SGButton label={'Simpan'} onPress={()=>{this._editStudent(); SGDialogBox.showConfirmation(null, 'Update Student', 'Are you Sure ?', 'No',() => {'tidak'}, 'Yes',() => { SGHelperNavigation.goBack(this.props.navigation);} );}} />    
        <SGButton label={'Delete'} onPress={()=>{this._deleteStudent(); SGDialogBox.showConfirmation(null, 'Delete Student', 'Are you Sure ?', 'No',() => {'tidak'}, 'Yes',() => { SGHelperNavigation.goBack(this.props.navigation);} );}} />    
  
      </SGRootScrollView>
    );
  }
}