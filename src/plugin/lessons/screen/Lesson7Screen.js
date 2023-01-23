import React from 'react';
import Core from '../../core/core';

export default class Lesson7Screen extends Core.Screen.SGBaseScreen {

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
  }

  render() {
    const { SGRootScrollView,SGRootView, SGView, SGScrollView } = Core.Control;
    console.log('render')
    var style = this.style;
    var { w, h, p } = this.WHP;
    return (
      <SGRootScrollView contentContainerStyle={{ alignItems: 'center', justifyContent: 'flex-start', width:w, backgroundColor:'white' }}>
        <SGView style={{ width: w * 0.8, height: w * 0.8, marginVertical: 5 * p }}>
          <SGScrollView nestedScrollEnabled={true} style={{ width: w * 0.8, height: w * 0.8, backgroundColor: 'orange', marginVertical: 5 * p }}>
            <SGView style={{ width: w * 0.25, height: h * 0.2, margin: w * 0.05, backgroundColor: 'black' }} />
            <SGView style={{ width: w * 0.25, height: h * 0.2, margin: w * 0.05, backgroundColor: 'black' }} />
            <SGView style={{ width: w * 0.25, height: h * 0.2, margin: w * 0.05, backgroundColor: 'black' }} />
            <SGView style={{ width: w * 0.25, height: h * 0.2, margin: w * 0.05, backgroundColor: 'black' }} />
            <SGView style={{ width: w * 0.25, height: h * 0.2, margin: w * 0.05, backgroundColor: 'black' }} />
          </SGScrollView>
        </SGView>
        <SGView style={{ width: w * 0.8, height: w * 0.8, justifyContent: 'flex-start', alignItems: 'flex-start', backgroundColor: 'purple', marginVertical: 5 * p }}>
        </SGView>
        <SGView style={{ width: w * 0.8, height: w * 0.8, justifyContent: 'flex-start', alignItems: 'flex-start', backgroundColor: 'pink', marginVertical: 5 * p }}>
        </SGView>
        <SGView style={{ width: w * 0.8, height: w * 0.8, justifyContent: 'flex-start', alignItems: 'flex-start', backgroundColor: 'green', marginVertical: 5 * p }}>
        </SGView>
        <SGView style={{ width: w * 0.8, height: w * 0.8, marginVertical: 5 * p }}>
          <SGScrollView style={{ backgroundColor: 'orange', }} showsHorizontalScrollIndicator={false} contentContainerStyle={{ alignItems: 'flex-start' }} horizontal>
            <SGView style={{ width: w * 0.25, height: h * 0.2, margin: w * 0.05, backgroundColor: 'black' }} />
            <SGView style={{ width: w * 0.25, height: h * 0.2, margin: w * 0.05, backgroundColor: 'black' }} />
            <SGView style={{ width: w * 0.25, height: h * 0.2, margin: w * 0.05, backgroundColor: 'black' }} />
            <SGView style={{ width: w * 0.25, height: h * 0.2, margin: w * 0.05, backgroundColor: 'black' }} />
            <SGView style={{ width: w * 0.25, height: h * 0.2, margin: w * 0.05, backgroundColor: 'black' }} />
          </SGScrollView>
        </SGView>
        <SGView style={{ width: w * 0.8, height: w * 0.8, marginVertical: 5 * p }}>
          <SGScrollView style={{ width: w * 0.8, height: w * 0.8, backgroundColor: 'orange', marginVertical: 5 * p }} contentContainerStyle={{ alignItems: 'center' }} horizontal>
            <SGView style={{ width: w * 0.25, height: h * 0.2, margin: w * 0.05, backgroundColor: 'black' }} />
            <SGView style={{ width: w * 0.25, height: h * 0.2, margin: w * 0.05, backgroundColor: 'black' }} />
            <SGView style={{ width: w * 0.25, height: h * 0.2, margin: w * 0.05, backgroundColor: 'black' }} />
            <SGView style={{ width: w * 0.25, height: h * 0.2, margin: w * 0.05, backgroundColor: 'black' }} />
            <SGView style={{ width: w * 0.25, height: h * 0.2, margin: w * 0.05, backgroundColor: 'black' }} />
          </SGScrollView>
        </SGView>
        <SGView style={{ width: w * 0.8, height: w * 0.8, marginVertical: 5 * p }}>
          <SGScrollView style={{ width: w * 0.8, height: w * 0.8, backgroundColor: 'orange', marginVertical: 5 * p }} contentContainerStyle={{ alignItems: 'flex-end' }} horizontal>
            <SGView style={{ width: w * 0.25, height: h * 0.2, margin: w * 0.05, backgroundColor: 'black' }} />
            <SGView style={{ width: w * 0.25, height: h * 0.2, margin: w * 0.05, backgroundColor: 'black' }} />
            <SGView style={{ width: w * 0.25, height: h * 0.2, margin: w * 0.05, backgroundColor: 'black' }} />
            <SGView style={{ width: w * 0.25, height: h * 0.2, margin: w * 0.05, backgroundColor: 'black' }} />
            <SGView style={{ width: w * 0.25, height: h * 0.2, margin: w * 0.05, backgroundColor: 'black' }} />
          </SGScrollView>
        </SGView>
      </SGRootScrollView>
    );
  }
}