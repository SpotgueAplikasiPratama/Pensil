import React from 'react';
import { SGText } from '../../core/control';
import Core from '../../core/core';


export default class Lesson6Screen extends Core.Screen.SGBaseScreen {

  createStyleSheet = (whp) => {
    const { StyleSheet } = Core;
    var { w, h, p } = whp;
    return StyleSheet.create({
      rv1: { justifyContent: 'flex-start', alignItems: 'flex-start',width:w, backgroundColor:'white' },
      cube: { width: w * 0.05, height: w * 0.05, backgroundColor: 'red', borderWidth: 1, borderColor: 'black' },
    });
  }

  constructor(props, context, ...args) {
    console.log('constructor');
    // Core.Helper.SGHelperGlobalVar.setVar('UseRandomColor',true);
    super(props, context, ...args);
    this.style = this.createStyleSheet(this.WHP);
    this.viewFlexDirection = 'column';
    this.viewJustifyContent = 'flex-start';
    this.viewAlignItems = 'flex-start';
  }

  componentWillUnmount() {
    Core.Helper.SGHelperGlobalVar.setVar('UseRandomColor',false);
  }

  onFlexDirectionChange(v){
    this.viewFlexDirection = v;
    this.forceUpdate();
  }

  onJustifyContentChange(v){
    this.viewJustifyContent = v;
    this.forceUpdate();
  }

  onAlignItemsChange(v){
    this.viewAlignItems = v;
    this.forceUpdate();
  }

  onToggleRandom(){
    var f = Core.Helper.SGHelperGlobalVar.getVar('UseRandomColor');
    Core.Helper.SGHelperGlobalVar.setVar('UseRandomColor',!f);
    this.forceUpdate();
  }

  render() {
    console.log('render')
    const { SGRootView, SGView, SGPicker, SGText } = Core.Control;
    var style = this.style;
    var { w, h, p } = this.WHP;
    return (
      <SGRootView style={style.rv1} >
        <SGText style={{color:'blue'}} onPress={this.onToggleRandom.bind(this)}>Toggle Random Color</SGText>
        <SGText>flexDirection</SGText>
        <SGPicker label={'Select flexDirection'} single onValueChange={this.onFlexDirectionChange.bind(this)} language={'ID'} value={'column'} optionList={[{ key: 'column', title: 'column' }, { key: 'row', title: 'row' }]} />
        <SGText>justifyContent (main axis)</SGText>
        <SGPicker label={'Select justifyContent'} single onValueChange={this.onJustifyContentChange.bind(this)} language={'ID'} value={'flex-start'} optionList={[{ key: 'flex-start', title: 'flex-start' }, { key: 'flex-end', title: 'flex-end' }, { key: 'center', title: 'center' }, { key: 'space-between', title: 'space-between' }, { key: 'space-around', title: 'space-around' }, { key: 'space-evenly', title: 'space-evenly' }]} />
        <SGText>alignItems (cross axis)</SGText>
        <SGPicker label={'Select alignItems'} single onValueChange={this.onAlignItemsChange.bind(this)} language={'ID'} value={'flex-start'} optionList={[{ key: 'flex-start', title: 'flex-start' }, { key: 'flex-end', title: 'flex-end' }, { key: 'center', title: 'center' }, { key: 'stretch', title: 'stretch' }, { key: 'baseline', title: 'baseline' }]} />
        <SGView style={{ width: w*0.8, height: w*0.4, borderWidth:1, borderRadius:2*p, borderColor:'black', backgroundColor: 'orange', flexDirection:this.viewFlexDirection, alignItems: this.viewAlignItems, justifyContent:this.viewJustifyContent }}>
          <SGView style={style.cube} />
          <SGView style={style.cube} />
          <SGView style={style.cube} />
          <SGView style={style.cube} />
          <SGView style={style.cube} />
        </SGView>
      </SGRootView>
    );
  }
}