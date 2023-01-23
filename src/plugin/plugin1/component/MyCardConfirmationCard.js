import React from 'react';
import Core from '../../../core/core';
import MyTranslator from '../../lessons/locale/MyTranslator';

export default class MyCardConfirmationCard extends Core.Control.SGBaseContainer {

  createStyleSheet = (whp) => {
    const { StyleSheet } = Core;
    var { w, h, p } = whp;
    return StyleSheet.create({
      v1: {flexDirection:'row', width:0.9*w, height: 0.2*w ,justifyContent:'space-between', borderWidth:1, borderRadius:10, marginVertical: p*2},
      accepted: {color:'green'},
      submitted: {color:'yellow'},
      rejected: {color:'red'}
    });
  }
  constructor(props, context, ...args) {
    super(props, context, ...args);
    this.style = this.createStyleSheet(this.screenWHP);
  }

  render() {
    const {SGText, SGView, SGIcon, SGImage, SGPopView, SGRootView } = Core.Control;
    const {SGHelperType} = Core.Helper;
    var { w, h, p } = this.screenWHP;
    var style = this.style;
    var data = this.props.data;
    var language = this.props.datalang
    if(data.fCardStatus == "rejected" || data.fCardStatus == "blocked"){
        style = this.style.rejected;
    }
    else if (data.fCardStatus == "approved"){
      style=this.style.accepted;
    }else {
      style = this.style.submitted;
    }
    return (
        <SGView style={{marginTop:5*p, flexDirection:'row', width:0.9*w, justifyContent:'space-between', borderWidth:1, borderRadius:10}}>
            <SGView style={{alignItems:'flex-start', width :0.6*w}}>
            <SGText preset={SGText.preset.h5B}>{data['fContent'+language].fCardName}</SGText>
            <SGText>{data.fMemberProfileJSON.fFullName}</SGText>
            <SGText>{MyTranslator.tr('SpotgueAppMyCardList.DateLabel')}{SGHelperType.formatDate(SGHelperType.convertNewDate(data.fCardRegistrationDate),this._language)}</SGText>
            {data.fCardStatus == 'rejected' || data.fCardStatus == 'blocked' &&
            <SGText>{MyTranslator.tr('SpotgueAppMyCardList.ReasonLabel')}{data.fReason}</SGText>
            }
            </SGView>
            <SGView>
              <SGText style={style} preset={SGText.preset.h5B}>{data.fCardStatus.toUpperCase()}</SGText>
            </SGView>
        </SGView>
    );
  }
}