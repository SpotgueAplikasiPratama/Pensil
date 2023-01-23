import React from 'react';
import Core from '../../core/core';
import { SGHelperWindow } from '../../core/helper';

//1. button : portrait
//2. button : landscape
//3. nampilin sebuah popview 

export default class DummyTestingScreen extends Core.Screen.SGBaseScreen {

  createStyleSheet = (whp) => {
    const { StyleSheet } = Core;
    var { w, h, p } = whp;
    return StyleSheet.create({
      v1: { flex: 1, backgroundColor: 'white', alignItems: 'center', justifyContent: 'center' }
    });
  }

  constructor(props, context, ...args) {
    super(props, context, ...args);
    this.whp = Core.Helper.SGHelperWindow.getWHP();
    this.style = this.createStyleSheet(this.whp);
    this._posXY = { x: 50, y: 50 };
    this.initData();
    this.viewShotRef = React.createRef();
    this.pvID1 = Core.Control.SGPopView.getPopViewID();
    this._previousOrientationLandscape = Core.Helper.SGHelperWindow.isLandscapeLeft();
    // Core.Helper.SGHelperWindow.lockLandscape();
  }

  componentWillUnmount() {
    if (!this._previousOrientationLandscape) {     
      Core.Helper.SGHelperWindow.lockPortrait();
    }
  }

  async initData() {
    this._posXY = await Core.Helper.SGHelperDB.isKeyExist('pos') ? await Core.Helper.SGHelperDB.getKeyValue('pos') : { x: 50, y: 50 };
    this.forceUpdate();
  }

  async resetMMKV() {
    this._posXY = { x: 50, y: 50 };
    Core.Helper.SGHelperDB.storeKeyValue('pos', this._posXY);
    var pos = await Core.Helper.SGHelperDB.getKeyValue('pos');
    this.forceUpdate();
  }
  async _onCallAPITambah(num1,num2){
    Core.log(num1+','+num2);
    try{
      var res = await Core.Helper.SGHelperAPICall.callAPIAsync('GET',"https://functiongh1.azurewebsites.net/api/FunctionTambah?code=fXpFWZdExiFMRUgZhDM4Y7GBvSgqy3uYpD0FS7tHiSVp/1ZbbxCAPA==&a="+num1+"&b="+num2);
      alert(res.data);
    } catch(e){
      Core.log(e);
    }
  }
  async _onCallAPIUpperCase(){
    var data1 = {nama: this.nama, alamat:this.alamat, umur: this.umur}
    try{
      var v = await Core.Helper.SGHelperAPICall.callAPIAsync("POST",
      "https://functiongh1.azurewebsites.net/api/FunctionUpperCase?code=3bZK1Tg5kMYvf1yQh5ogQ4Ahu/IHaWjwxaJGbDtfHNHetmRCoMYOng==","",
      JSON.stringify(data1));
      var data2 = JSON.parse(v.data);
      this.nama = data2.nama;
      this.alamat = data2.alamat;
      this.umur = data2.umur;
      this.forceUpdate();
    } catch(e){
      Core.log(e);
    }
  }
  _onDrop(e) {
    //movement from last position
    var a = e.nativeEvent;
    Core.log(a.translationX);
    Core.log(a.translationY);
  }

  onValueChange(pos){
    Core.log(pos);
    this._posXY.x = pos.x;
    this._posXY.y = pos.y;
    Core.Helper.SGHelperDB.storeKeyValue('pos', this._posXY);
    this.forceUpdate();
  }

  render() {
    const {SGPopView, SGRootScrollView, SGText, SGImagePicker, SGTextInput, SGView, SGViewShot, SGImage, SGDragView, SGButton } = Core.Control;
    const {SGHelperWindow, SGHelperSoundPlayer} = Core.Helper;
    this.whp = SGHelperWindow.getWHP();
    Core.log(this.whp.w);
    Core.log(this.whp.h);
    var { w, h, p } = this.whp;
    var style = this.style;
    return (
      <SGRootScrollView style={style.v1}>
        <SGButton label={'Read Text'} onPress={()=>{Core.Helper.SGHelperSoundPlayer.readText('hello my name is Alice, how can I help you?','id')}} />
        <SGButton label={'Stop Read'} onPress={()=>{Core.Helper.SGHelperSoundPlayer.stopReadingText()}} />
        <SGText>{'a'}</SGText>
        <SGTextInput value={this.num1} onValueChange={(v)=>{this.num1=v;}}/>
        <SGText>{'b'}</SGText>
        <SGTextInput value={this.num2} onValueChange={(v)=>{this.num2=v;}}/>
        <SGButton label={'Call API Tambah'} onPress={()=>{this._onCallAPITambah(this.num1, this.num2)}} />
        <SGText>{'nama'}</SGText>
        <SGTextInput value={this.nama} onValueChange={(v)=>{this.nama=v;}}/>
        <SGText>{'alamat'}</SGText>
        <SGTextInput value={this.alamat} onValueChange={(v)=>{this.alamat=v;}}/>
        <SGText>{'umur'}</SGText>
        <SGTextInput value={this.umur} onValueChange={(v)=>{this.umur=v;}}/>
        <SGButton label={'Call API Upper'} onPress={()=>{this._onCallAPIUpperCase()}} />
        <SGViewShot ref={this.viewShotRef} options={{ format: "png", quality: 1.0 }}>
          <SGImage source={{ uri: 'https://www.spotgue.com/logo.png' }} style={{ width: w * 0.8, height: w * 0.8 }} >
            <SGDragView stateless value={this._posXY} onValueChange={this.onValueChange.bind(this)} style={{ top: 0, left: 0, borderRadius: 50, width: 25, height: 25, backgroundColor: 'blue', }} onBeginDrag={(e) => { Core.log('mulai'); }} onRelease={this._onDrop.bind(this)}>
              <SGView style={{ width: w * 0.1, height: w * 0.1, borderRadius: w, backgroundColor: 'red' }}></SGView>
            </SGDragView>
          </SGImage>
        </SGViewShot>
        <SGImage source={{ uri: 'https://www.spotgue.com/logo.png' }} style={{ width: w * 0.8, height: w * 0.8 }} >
          <SGDragView stateless value={this._posXY} onValueChange={this.onValueChange.bind(this)} style={{ top: 0, left: 0, borderRadius: 50, width: 25, height: 25, backgroundColor: 'blue', }} onBeginDrag={(e) => { Core.log('mulai'); }} onRelease={this._onDrop.bind(this)}>
            <SGView style={{ width: w * 0.1, height: w * 0.1, borderRadius: w, backgroundColor: 'red' }}></SGView>
          </SGDragView>
        </SGImage>
        <SGDragView style={{ top: 100, left: 0, borderRadius: 50, width: 25, height: 25, backgroundColor: 'blue', }} onBeginDrag={(e) => { Core.log('mulai'); }} onRelease={this._onDrop.bind(this)}>
            <SGView style={{ width: w * 0.1, height: w * 0.1, borderRadius: w, backgroundColor: 'red' }}></SGView>
          </SGDragView>
        <SGText onPress={this.resetMMKV.bind(this)} >{'reset'}</SGText>
        <SGText onPress={() => { this.setState({ a: 'e' }) }}>{'setState'}</SGText>
        <SGImagePicker pngTransparent label={'Profile Image'} imageFactor={0.25} onValueChange={(e)=>{(Core.log(e))}} value={[]} ratio={SGImagePicker.ratio.r9x9} />
        <SGPopView popViewID={this.pvID1}>
          <SGView style={{width:w*0.5,height:h*0.5, backgroundColor:'pink'}}></SGView>
        </SGPopView>
        <SGButton preset={SGButton.preset.blue} shadow onPress={() => this.viewShotRef.current.Save()} label={'Save'} />
        <SGButton preset={SGButton.preset.green} shadow onPress={() => this.viewShotRef.current.Share()} label={'Share'} />
        <SGButton preset={SGButton.preset.white} shadow onPress={() => {Core.Helper.SGHelperWindow.lockPortrait();this.forceUpdate();}} label={'Change to Potrait'} />
        <SGButton preset={SGButton.preset.white} shadow onPress={() => {Core.Helper.SGHelperWindow.lockLandscape();this.forceUpdate();}} label={'Change to Landspace'} />
        <SGButton preset={SGButton.preset.white} shadow onPress={() => {SGPopView.showPopView(this.pvID1)}} label={'Show PopUp'} />
      </SGRootScrollView>
    );
  }
}