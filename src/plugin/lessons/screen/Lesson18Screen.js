import React from 'react';
import Core from '../../core/core';


export default class Lesson18Screen extends Core.Screen.SGBaseScreen {

  createStyleSheet = (whp) => {
    const { StyleSheet } = Core;
    var { w, h, p } = whp;
    return StyleSheet.create({
      v1: { justifyContent: 'center', alignItems: 'flex-start', width: w, height: h, overflow: 'visible' },
    });
  }

  constructor(props, context, ...args) {
    Core.log('constructor');
    super(props, context, ...args);
    this.style = this.createStyleSheet(this.WHP);
    this._darkMode = false;
  }

  render() {
    Core.log('render')
    const { SGRootScrollView, SGView, SGButton, SGText, } = Core.Control;
    const { SGHelperSoundPlayer } = Core.Helper;
    var style = this.style;
    var { w, h, p } = this.WHP;
    return (
      <SGRootScrollView style={{width:w, backgroundColor:'white'}}>
        <SGButton label={'Toggle Dark Mode'} onPress={() => { this._darkMode = !this._darkMode; this.forceUpdate(); }} />
        <SGView style={{ alignSelf: 'stretch', flex: 1 }}>
          <SGText style={{ color: 'blue' }} onPress={() => { SGHelperSoundPlayer.playSFX({ uri: 'https://raw.githubusercontent.com/zmxv/react-native-sound-demo/master/advertising.mp3' }, 0, () => { Core.log('done'); }) }}>{'mp3 remote'}</SGText>
          <SGText style={{ color: 'blue' }} onPress={() => { SGHelperSoundPlayer.playSFX({ uri: 'https://raw.githubusercontent.com/zmxv/react-native-sound-demo/master/pew2.aac' }, 0, () => { Core.log('done'); }) }}>{'aac remote'}</SGText>
          <SGText style={{ color: 'blue' }} onPress={() => { SGHelperSoundPlayer.playSFX({ uri: 'https://raw.githubusercontent.com/zmxv/react-native-sound-demo/master/frog.wav' }, -1, () => { Core.log('done'); }) }}>{'wav remote loop'}</SGText>
          <SGText style={{ color: 'blue' }} onPress={() => { SGHelperSoundPlayer.playSFX({ uri: 'https://raw.githubusercontent.com/zmxv/react-native-sound-demo/master/frog.wav' }, 0, () => { Core.log('done'); }) }}>{'wav remote'}</SGText>
          <SGText style={{ color: 'blue' }} onPress={() => { SGHelperSoundPlayer.stopAllSFX() }}>{'stop all sound'}</SGText>
        </SGView>
      </SGRootScrollView>
    );
  }
}