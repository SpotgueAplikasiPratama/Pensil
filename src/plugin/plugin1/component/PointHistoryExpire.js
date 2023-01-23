import React from 'react';
import Core from '../../../core/core';
import { SGLocalize } from '../../../visitor/locales/SGLocalize';

export default class PointHistoryExpire extends Core.Control.SGBaseContainer {

  createStyleSheet = (whp) => {
    const { StyleSheet } = Core;
    var { w, h, p } = whp;
    return StyleSheet.create({
      v1: { width:w, flex: 1, backgroundColor: 'white', alignItems: 'center', justifyContent: 'center' },
      imagekartu:{marginBottom:10,backgroundColor: 'rgba(255,0,0,0.6)', width: '100%', height:'100%',borderRadius:10, alignItems:'flex-start', justifyContent:'flex-start',paddingVertical:4*p},
      pointStyle:{},
      vCard: {height:52*p, width:0.9*w+p,borderRadius:10, alignItems:'flex-start', justifyContent:'center',marginLeft:-p, backgroundColor: 'blue',},
      vColorWhite: {color:'white'},
      vPosition: {flexDirection:'row', justifyContent:'flex-start', marginTop:-2*p},
      vCardName: {color:'white', marginTop:6*p},
      vJSONName: {color:'white', marginTop:-2*p},
      vThru: {color:'white',marginTop:-1*p},
      v11: {paddingVertical: 2*p,borderWidth:1, marginTop:3*p, borderRadius:5, width:w*0.9, flexDirection:'row', justifyContent:'space-between'},
      v12: {minWidth: w*0.2, maxWidth: w*0.35, borderBottomLeftRadius:5, borderTopLeftRadius:5, backgroundColor:'black'},
    });
  }

  constructor(props, context, ...args) {
    super(props, context, ...args);
    this.style = this.createStyleSheet(this.screenWHP);
    // this.pointData = new PointCardModel();
  }

  componentWillUnmount() {
    if (!this._previousOrientationLandscape) {     
      Core.Helper.SGHelperWindow.lockPortrait();
    }
  }

  render() {
    const {SGText,SGRootView, SGTextInput, SGView,SGTouchableOpacity,SGImage } = Core.Control;
    const {SGHelperType} = Core.Helper
    var { w, h, p } = this.screenWHP;
    var style = this.style;
    var data = this.props.data;
    return (
    <SGView style={style.v11}>
      <SGView style={{alignItems:'flex-start'}}>
        <SGText>{SGHelperType.formatDate(SGHelperType.convertNewDate(data.fCreatedDate),this._language)}</SGText>
        <SGText>{SGLocalize.translate('Loyalty.PointEarnOnText')}</SGText>
        <SGText>{SGHelperType.formatDate(SGHelperType.convertNewDate(data.fEarnedDate),this._language)}</SGText>
      </SGView>
      <SGView style={style.v12}>
        <SGText preset={SGText.preset.h5B} style={{color:'white', minWidth: w*0.2, maxWidth: w*0.35}}>- {data.fExpiredPoint} p</SGText>
      </SGView>
    </SGView>
    );
  }
}