import React from 'react';
import Core from '../../core/core';
import MyTranslator from '../locale/MyTranslator';

export class Lesson23Screen extends Core.Screen.SGBaseScreen {

  createStyleSheet = (whp) => {
    const {StyleSheet} = Core;
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
    const {SGRootScrollView, SGButton, SGText, } = Core.Control;
    Core.log('render');
    var style = this.style;
    var {w,h,p} =this.WHP;
    return (
      <SGRootScrollView style={{width:w, backgroundColor:'white'}}>
        <SGText preset={SGText.preset.h2B}>{MyTranslator.tr('Lesson23Screen.welcome')}</SGText>
        <SGButton label={MyTranslator.tr('Lesson23Screen.login')} onPress={()=>{ alert(MyTranslator.tr('Lesson23Screen.login')) }} />
        <SGButton label={MyTranslator.tr('Lesson23Screen.update')} onPress={()=>{ alert(MyTranslator.tr('Lesson23Screen.update')) }} />
        <SGButton label={'ID'} onPress={()=>{ MyTranslator.changeLanguage('ID'); this.forceUpdate(); }} />
        <SGButton label={'EN'} onPress={()=>{ MyTranslator.changeLanguage('EN'); this.forceUpdate(); }} />
        <SGButton label={'CN'} onPress={()=>{ MyTranslator.changeLanguage('CN'); this.forceUpdate(); }} />
      </SGRootScrollView>
    );
  }
}