import React from 'react';
import Core from '../../../core/core';
import { SGLocalize } from '../../../visitor/locales/SGLocalize';

export default class Reward extends Core.Control.SGBaseContainer {

  createStyleSheet = (whp) => {
    const { StyleSheet } = Core;
    var { w, h, p } = whp;
    return StyleSheet.create({
      v1: { width:w, flex: 1, backgroundColor: 'white', alignItems: 'center', justifyContent: 'center' },
      v2: {height:w*0.6, width:0.9*w,borderRadius:10, alignItems:'flex-start', justifyContent:'flex-start'},
      v3: {alignSelf:'flex-start',width:0.9*w,alignItems:'flex-start', justifyContent:'flex-start',borderBottomWidth:1,width:w,borderColor:'grey',marginLeft:10*p},
      v4: {alignSelf:'flex-start',width:0.9*w,alignItems:'flex-end'},
      vImage: {marginBottom:10,backgroundColor: 'rgba(255,0,0,0.6)', width: '100%', height:'100%',borderRadius:10, alignItems:'flex-start', justifyContent:'flex-start',paddingVertical:4*p},
      vColorGreen: {color:'green'},
      vColorBlue: {color:'lightblue'},
    });
  }

  constructor(props, context, ...args) {
    super(props, context, ...args);
    this.style = this.createStyleSheet(this.screenWHP);
  }

  componentWillUnmount() {
    if (!this._previousOrientationLandscape) {      
      Core.Helper.SGHelperWindow.lockPortrait();
    }
  }

  render() {
    const { SGText,SGIcon,SGView, SGButton, SGImage,SGTouchableOpacity} = Core.Control;
    const { SGHelperNavigation } = Core.Helper;
    var { w, h, p } = this.screenWHP;
    var style = this.style;
    var data = this.props.data;
    var imset = this.props.imset;
  
    return(
    <SGView style={{backgroundColor:'red', marginVertical: p*2}}>
      <SGTouchableOpacity style={{alignItems:'center'}}onPress={() => { }}>
        <SGView style={style.v2}>
          <SGImage style={style.vImage}source={{ uri:data.fContentID.fImageJSON[0][imset].uri}}></SGImage>
        </SGView>
        <SGView style={style.v3}>
          <SGView style={{alignItems:'flex-start'}}>
              <SGText preset={SGText.preset.h5B} style={{color:'black'}}>{data.fRewardNameID}</SGText>
              <SGText preset={SGText.preset.h6}>{data.fShortDescriptionID}</SGText>
          </SGView> 
          <SGView style={style.v4}>
              <SGText preset={SGText.preset.h5B} style={style.vColorGreen}>{SGLocalize.translate('Loyalty.ExchangeWithText')} </SGText>
              <SGText preset={SGText.preset.h6B} style={style.vColorBlue}>{SGLocalize.translate('Loyalty.TotalStockText')}: {data.totalAvailable}</SGText>
          </SGView> 
        </SGView>
      </SGTouchableOpacity>
    </SGView>
    );
  }
}