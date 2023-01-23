import React from 'react';
import Core from '../../core/core';

export default class Lesson9Screen extends Core.Screen.SGBaseScreen {

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
    this.hideSGActivityIndicator = false;
  }

  render() {
    const { SGRootScrollView, SGView, SGButton, SGText, SGActivityIndicator, SGImage, SGIcon, SGIconText } = Core.Control;
    console.log('render')
    var style = this.style;
    var {w,h,p} = this.WHPNoHeader;
    return (
      <SGRootScrollView style={{width:w, backgroundColor:'white'}}>
        <SGButton label={'Toggle Dark Mode'} onPress={() => { this._darkMode = !this._darkMode; this.forceUpdate(); }} />
        <SGView style={{width:w,height:w*0.1,backgroundColor:'rgb(200,200,200)'}}><SGText preset={SGText.preset.H2B}>SGActivityIndicator:</SGText></SGView>
        <SGView style={{ backgroundColor: this._darkMode ? 'black' : 'white', alignSelf: 'stretch', }}>
          <SGButton label={'ToggleHide'} onPress={() => { this.hideSGActivityIndicator = !this.hideSGActivityIndicator; this.forceUpdate(); }} />
          <SGActivityIndicator darkMode={this._darkMode} hidden={this.hideSGActivityIndicator} preset={SGActivityIndicator.preset.h1} />
          <SGActivityIndicator darkMode={this._darkMode} preset={SGActivityIndicator.preset.h1} />
          <SGActivityIndicator darkMode={this._darkMode} preset={SGActivityIndicator.preset.h2} />
        </SGView>

        <SGView style={{width:w,height:w*0.1,backgroundColor:'rgb(200,200,200)'}}><SGText preset={SGText.preset.H2B}>SGText:</SGText></SGView>
        <SGView style={{ alignSelf: 'stretch', flex: 1, backgroundColor: this._darkMode ? 'black' : 'white', alignItems: 'flex-start' }}>
          <SGText darkMode={this._darkMode} onPress={() => { alert('h1') }} style={{ color: 'green', backgroundColor: 'blue' }} preset={SGText.preset.h1B}>H1B Hello There you good looking fellow</SGText>
          <SGText darkMode={this._darkMode} hidden preset={SGText.preset.h1}>H1 Hello There you good looking fellow</SGText>
          <SGText darkMode={this._darkMode} grey preset={SGText.preset.h1B}>H1B Hello There you good looking fellow</SGText>
          <SGText darkMode={this._darkMode} preset={SGText.preset.h2B}>H2B Hello There you good looking fellow</SGText>
          <SGText darkMode={this._darkMode} preset={SGText.preset.h3B}>H3B Hello There you good looking fellow</SGText>
          <SGText darkMode={this._darkMode} preset={SGText.preset.h4B}>H4B Hello There you good looking fellow</SGText>
          <SGText darkMode={this._darkMode} preset={SGText.preset.h5B}>H5B Hello There you good looking fellow</SGText>
          <SGText darkMode={this._darkMode} preset={SGText.preset.h6B}>H6B Hello There you good looking fellow</SGText>
          <SGText darkMode={this._darkMode} preset={SGText.preset.h7B}>H7B Hello There you good looking fellow</SGText>
          <SGText darkMode={this._darkMode} preset={SGText.preset.h8B}>H8B Hello There you good looking fellow</SGText>
          <SGText darkMode={this._darkMode} preset={SGText.preset.h10B}>H10B Hello There you good looking fellow</SGText>
          <SGText darkMode={this._darkMode} preset={SGText.preset.h12B}>H12B H1 Hello There you good looking fellow</SGText>

          <SGText darkMode={this._darkMode} preset={SGText.preset.h1}>H1 Hello There you good looking fellow</SGText>
          <SGText darkMode={this._darkMode} preset={SGText.preset.h2}>H2 Hello There you good looking fellow</SGText>
          <SGText darkMode={this._darkMode} preset={SGText.preset.h3}>H3 Hello There you good looking fellow</SGText>
          <SGText darkMode={this._darkMode} preset={SGText.preset.h4}>H4 Hello There you good looking fellow</SGText>
          <SGText darkMode={this._darkMode} preset={SGText.preset.h5}>H5 Hello There you good looking fellow</SGText>
          <SGText darkMode={this._darkMode} preset={SGText.preset.h6}>H6 Hello There you good looking fellow</SGText>
          <SGText darkMode={this._darkMode} preset={SGText.preset.h7}>H7 Hello There you good looking fellow</SGText>
          <SGText darkMode={this._darkMode} preset={SGText.preset.h8}>H8 Hello There you good looking fellow</SGText>
          <SGText darkMode={this._darkMode} preset={SGText.preset.h10}>H10 Hello There you good looking fellow</SGText>
          <SGText darkMode={this._darkMode} preset={SGText.preset.h12}>H12 H1 Hello There you good looking fellow</SGText>

          <SGText darkMode={this._darkMode} preset={SGText.preset.h1I}>H1I Hello There you good looking fellow</SGText>
          <SGText darkMode={this._darkMode} preset={SGText.preset.h2I}>H2I Hello There you good looking fellow</SGText>
          <SGText darkMode={this._darkMode} preset={SGText.preset.h3I}>H3I Hello There you good looking fellow</SGText>
          <SGText darkMode={this._darkMode} preset={SGText.preset.h4I}>H4I Hello There you good looking fellow</SGText>
          <SGText darkMode={this._darkMode} preset={SGText.preset.h5I}>H5I Hello There you good looking fellow</SGText>
          <SGText darkMode={this._darkMode} preset={SGText.preset.h6I}>H6I Hello There you good looking fellow</SGText>
          <SGText darkMode={this._darkMode} preset={SGText.preset.h7I}>H7I Hello There you good looking fellow</SGText>
          <SGText darkMode={this._darkMode} preset={SGText.preset.h8I}>H8I Hello There you good looking fellow</SGText>
          <SGText darkMode={this._darkMode} preset={SGText.preset.h10I}>H10I Hello There you good looking fellow</SGText>
          <SGText darkMode={this._darkMode} preset={SGText.preset.h12I}>H12I H1 Hello There you good looking fellow</SGText>
        </SGView>

        <SGView style={{width:w,height:w*0.1,backgroundColor:'rgb(200,200,200)'}}><SGText preset={SGText.preset.H2B}>SGImage:</SGText></SGView>
        <SGView style={{ alignSelf: 'stretch', flex: 1, backgroundColor: this._darkMode ? 'black' : 'white' }}>
          <SGImage source={{ uri: 'https://www.spotgue.com/logo.png' }} style={{ width: 200, height: 50, resizeMode: 'contain' }} />
          <SGImage hidden source={{ uri: 'https://www.spotgue.com/logo.png' }} style={{ width: 200, height: 50, }} />
          <SGImage shadow preset={SGImage.preset.w2S} style={{ justifyContent: 'flex-end', alignItems: 'flex-start' }} source={{ uri: 'https://www.spotgue.com/ComingSoon.jpg' }}>
              <SGText preset={SGText.preset.h6B} style={{ color: 'black', backgroundColor: 'rgba(255,255,255,0.5)' }}>Halo Sobat</SGText>
          </SGImage>
          <SGImage shadow disabled preset={SGImage.preset.w2S} style={{ justifyContent: 'flex-end', alignItems: 'flex-start' }} source={{ uri: 'https://www.spotgue.com/ComingSoon.jpg' }}><SGText preset={SGText.preset.h6B} style={{ color: 'black', backgroundColor: 'rgba(255,255,255,0.5)' }}>Halo Sobat</SGText></SGImage>
        </SGView>

        <SGView style={{width:w,height:w*0.1,backgroundColor:'rgb(200,200,200)'}}><SGText preset={SGText.preset.H2B}>SGIcon:</SGText></SGView>
        <SGView style={{ alignSelf: 'stretch', flex: 1, backgroundColor: this._darkMode ? 'black' : 'white' }}>
          <SGIcon darkMode={this._darkMode} disabled name={SGIcon.Icon.car} preset={SGIcon.preset.h1} />
          <SGIcon darkMode={this._darkMode} name={SGIcon.Icon.camera} preset={SGIcon.preset.h2} />
          <SGIcon darkMode={this._darkMode} name={SGIcon.Icon.car} preset={SGIcon.preset.h3} />
          <SGIcon darkMode={this._darkMode} name={SGIcon.Icon.car} preset={SGIcon.preset.h4} />
          <SGIcon darkMode={this._darkMode} name={SGIcon.Icon.car} preset={SGIcon.preset.h5} />
          <SGIcon darkMode={this._darkMode} name={SGIcon.Icon.car} preset={SGIcon.preset.h6} />
          <SGIcon darkMode={this._darkMode} name={SGIcon.Icon.car} preset={SGIcon.preset.h7} />
          <SGIcon darkMode={this._darkMode} name={SGIcon.Icon.car} preset={SGIcon.preset.h8} />
          <SGIcon darkMode={this._darkMode} name={SGIcon.Icon.car} preset={SGIcon.preset.w1} onPress={() => { alert('a') }} />
          <SGIcon darkMode={this._darkMode} name={SGIcon.Icon.car} preset={SGIcon.preset.w2} onPress={() => { alert('w2') }} />
          <SGIcon darkMode={this._darkMode} name={SGIcon.Icon.car} preset={SGIcon.preset.w3} />
          <SGIcon darkMode={this._darkMode} name={SGIcon.Icon.car} preset={SGIcon.preset.w4} />
          <SGIcon darkMode={this._darkMode} name={SGIcon.Icon.car} preset={SGIcon.preset.w5} />
          <SGIcon darkMode={this._darkMode} name={SGIcon.Icon.car} preset={SGIcon.preset.w6} />
          <SGIcon darkMode={this._darkMode} name={SGIcon.Icon.car} preset={SGIcon.preset.w7} />
          <SGIcon darkMode={this._darkMode} name={SGIcon.Icon.car} style={{ color: "green" }} preset={SGIcon.preset.w8} />
          <SGIcon darkMode={this._darkMode} hidden name={SGIcon.Icon.car} style={{ color: "green" }} preset={SGIcon.preset.w8} />
        </SGView>

        <SGView style={{width:w,height:w*0.1,backgroundColor:'rgb(200,200,200)'}}><SGText preset={SGText.preset.H2B}>SGButton:</SGText></SGView>
        <SGView style={{ alignSelf: 'stretch', backgroundColor: this._darkMode ? 'black' : 'white' }}>
          <SGButton shadow label={'Tidak'} onPress={() => { }} />
          <SGButton preset={SGButton.preset.blue} onPress={() => { Core.log('blue ditekan') }} label={'OK'} />
          <SGButton preset={SGButton.preset.green} onPress={() => { }} label={'Yes'} />
          <SGButton preset={SGButton.preset.orange} onPress={() => { }} label={'No'} />
          <SGButton preset={SGButton.preset.grey} onPress={() => { }} label={'Click Me'} />
          <SGButton preset={SGButton.preset.red} onPress={() => { }} label={'Click Me'} />
          <SGButton preset={SGButton.preset.blackBorder} onPress={() => { }} label={'Click Me'} />
          <SGButton preset={SGButton.preset.greyBorder} onPress={() => { }} label={'Click Me'} />
          <SGButton preset={SGButton.preset.white} shadow onPress={() => { }} label={'Click Me'} />
          <SGButton preset={SGButton.preset.greenBorder} shadow onPress={() => { }} label={'Click Me'} />
          <SGButton preset={SGButton.preset.noBorder} onPress={() => { }} label={'Click Me'} />
          <SGButton preset={SGButton.preset.black} overrideDisabled style={{ backgroundColor: 'pink' }} disabled onPress={() => { }} label={'Click Me'} />
          <SGButton preset={SGButton.preset.green} disabled onPress={() => { }} label={'Click Me'} />
          <SGButton shadow style={{ backgroundColor: 'orange', marginVertical: 4, marginHorizontal: 10, }} preset={SGButton.preset.red} textPreset={SGText.preset.h4} label={'Click Me'} onPress={() => { alert('a') }} />
          <SGButton shadow preset={SGButton.preset.red} style={{ color: 'green', backgroundColor: 'orange' }} textPreset={SGText.preset.h5I} label={'Click Me'} />
        </SGView>

        <SGView style={{width:w,height:w*0.1,backgroundColor:'rgb(200,200,200)'}}><SGText preset={SGText.preset.H2B}>SGIconText:</SGText></SGView>
        <SGView style={{ alignSelf: 'stretch', flex: 1, flexDirection: 'row', flexWrap: 'wrap', backgroundColor: this._darkMode ? 'black' : 'white' }}>
          <SGIconText text='Aman' preset={SGIconText.preset.w1} onPress={() => { alert('hehe') }} />
          <SGIconText text='B' preset={SGIconText.preset.w2} />
          <SGIconText shadow text='C' preset={SGIconText.preset.w3} />
          <SGIconText text='D' preset={SGIconText.preset.w4} />
          <SGIconText text='E' preset={SGIconText.preset.w5} />
          <SGIconText text='F' preset={SGIconText.preset.w6} />
          <SGIconText text='Gerry' preset={SGIconText.preset.w7} />
          <SGIconText text='H' preset={SGIconText.preset.w8} />
          <SGIconText text='I' />
          <SGIconText text='J' style={{ width: 30, height: 30, borderRadius: 10 }} />
          <SGIconText text='K' hidden />
          <SGIconText text='K' />
          <SGIconText text='L' />
          <SGIconText disabled text='M' />
          <SGIconText text='N' >
            <SGIcon name={SGIcon.Icon.car} preset={SGIcon.preset.h1} style={{ color: 'red' }} />
          </SGIconText>
          <SGIconText text='O' />
          <SGIconText text='P' />
          <SGIconText text='Q' />
          <SGIconText text='R' />
          <SGIconText text='S' />
          <SGIconText text='T' />
          <SGIconText text='U' />
          <SGIconText text='V' />
          <SGIconText text='W' />
          <SGIconText text='X' />
          <SGIconText text='Y' />
          <SGIconText text='Z' />
          <SGIconText text='时尚' />
          <SGIconText text='电子' />
          <SGIconText text='书' />
          <SGIconText text='玩具' onPress={() => { alert('hehe'); }} />
        </SGView>
      </SGRootScrollView>
    );
  }
}

