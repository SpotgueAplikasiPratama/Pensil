import React from 'react';
import Core from '../../core/core';

export default class Lesson8Screen extends Core.Screen.SGBaseScreen {

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
  }

  render() {
    const { SGRootScrollView, SGTouchableHighlight, SGTouchableOpacity, SGTouchableNativeFeedback, SGTouchableWithoutFeedback, SGView, SGButton, SGText, } = Core.Control
    console.log('render')
    var style = this.style;
    var { w, h, p } = this.WHP;
    return (
      <SGRootScrollView style={{ width:w, backgroundColor: this._darkMode ? 'black' : 'white' }}>
        <SGButton label={'Toggle Dark Mode'} onPress={() => { this._darkMode = !this._darkMode; this.forceUpdate(); }} />
        <SGView style={{ alignSelf: 'stretch', flex: 1 }}>
          <SGTouchableHighlight shadow style={{ marginVertical: 20, width:w*0.5,height:w*0.1, backgroundColor:'pink', borderRadius:4*p }} onPress={() => { alert('hehe') }}>
            {/* <SGView style={{width:w*0.4,height:w*0.1, backgroundColor:'pink', borderRadius:4*p}}> */}
              <SGText>SGTouchableHighlight</SGText>
            {/* </SGView> */}
          </SGTouchableHighlight>
          <SGTouchableHighlight shadow disabled style={{ backgroundColor: 'orange', marginVertical: 20 }} onPress={() => { alert('hehe') }}>
            <SGText>SGTouchableHighlight</SGText>
          </SGTouchableHighlight>
          <SGTouchableNativeFeedback shadow style={{ backgroundColor: 'orange', marginVertical: 20 }} onPress={() => { alert('hehe') }}>
            <SGText>SGTouchableNativeFeedback</SGText>
          </SGTouchableNativeFeedback>
          <SGTouchableNativeFeedback shadow disabled style={{ backgroundColor: 'orange', marginVertical: 20 }} onPress={() => { alert('hehe') }}>
            <SGText>SGTouchableNativeFeedback</SGText>
          </SGTouchableNativeFeedback>
          <SGTouchableOpacity shadow activeOpacity={0.8} onPress={() => { alert('hehe') }} style={{ backgroundColor: 'orange', marginVertical: 20, }} >
            <SGText >SGTouchableOpacity</SGText>
          </SGTouchableOpacity>
          <SGTouchableOpacity shadow activeOpacity={0.8} disabled style={{ backgroundColor: 'orange', marginVertical: 20, }} onPress={() => { alert('hehe') }}>
            <SGText>SGTouchableOpacity</SGText>
          </SGTouchableOpacity>
          <SGTouchableWithoutFeedback shadow style={{ backgroundColor: 'orange', marginVertical: 20, }} onPress={() => { alert('hehe') }}>
            <SGText>SGTouchableWithoutFeedback</SGText>
          </SGTouchableWithoutFeedback>
          <SGTouchableWithoutFeedback shadow disabled onPress={() => { alert('hehe') }} style={{ backgroundColor: 'orange', marginVertical: 20, }}>
            <SGText>SGTouchableWithoutFeedback</SGText>
          </SGTouchableWithoutFeedback>
        </SGView>
      </SGRootScrollView>
    );
  }
}

