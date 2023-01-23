import React from 'react';
import Core from '../../core/core';

export default class AddStudent extends Core.Screen.SGBaseScreen {

  createStyleSheet = (whp) => {
    const { StyleSheet } = Core;
    var { w, h, p } = whp;
    return StyleSheet.create({
      v1: {  backgroundColor: '#fff3d1', alignItems: 'center', justifyContent: 'center' }
    });
  }

  constructor(props, context, ...args) {
    super(props, context, ...args);
    this.whp = Core.Helper.SGHelperWindow.getWHP();
    this.style = this.createStyleSheet(this.whp);
    this.props.navigation.setOptions({
        title: 'Add Student',
        headerShown: true
      });
    this._posXY = { x: 50, y: 50 };
    this.data='';
  }

 
  async _onCallAPIStudent(){
    var data1 = {nama: this.nama, umur: this.umur, sekolah:this.sekolah}
    try{
      var v = await Core.Helper.SGHelperAPICall.callAPIAsync("POST",
      "https://skolineapilessonrh.azurewebsites.net/api/FunctionAdd?code=aIKQ7bubMeUc5DzVrjEUrKBqxCazpaaVSlI39aMCYRf7mVsEynyPlQ==","",
      JSON.stringify(data1));
      var data2 = JSON.parse(v.data);
      this.nama = data2.nama;
      this.umur = data2.umur;
      this.sekolah = data2.sekolah;
      this.forceUpdate();
      Core.log('data masuk');

    } catch(e){
      Core.log(e);
    }
  }
  

  render() {
    const { SGRootScrollView, SGText, SGTextInput, SGView, SGViewShot, SGImage, SGDragView, SGButton ,SGDialogBox} = Core.Control;
    const { SGHelperNavigation } = Core.Helper;

    var { w, h, p } = this.whp;
    var style = this.style;
    return (
      <SGRootScrollView style={style.v1}>
        <SGText>{'Nama'}</SGText>
        <SGTextInput value={this.nama} placeholder={'Masukan Nama'} onValueChange={(v)=>{this.nama=v;}}/>
        <SGText>{'Umur'}</SGText>
        <SGTextInput value={this.umur} placeholder={'Masukan Umur'} onValueChange={(v)=>{this.umur=v;}}/>
        <SGText>{'Sekolah'}</SGText>
        <SGTextInput value={this.sekolah} placeholder={'Masukan Sekolah'} onValueChange={(v)=>{this.sekolah=v;}}/>
        <SGButton label={'Simpan'} onPress={()=>{this._onCallAPIStudent();SGDialogBox.showConfirmation(null, 'Add Student', 'Are you Sure ?', 'No',() => {'tidak'}, 'Yes',() => { SGHelperNavigation.goBack(this.props.navigation);} );  }} />        
  
      </SGRootScrollView>
    );
  }
}