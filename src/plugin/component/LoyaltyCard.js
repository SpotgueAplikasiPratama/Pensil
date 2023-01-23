import React from 'react';
import Core from '../../core/core';
import { SGHelperType } from '../../core/helper';

export default class LoyaltyCard extends Core.Control.SGBaseContainer {

  createStyleSheet = (whp) => {
    const { StyleSheet } = Core;
    var { w, h, p } = whp;
    return StyleSheet.create({
      cardImage:{width:w-2*p,height:w*0.6,backgroundColor: 'transparent',alignItems:'flex-start', justifyContent:'flex-start'},
      pointStyle:{width:w*0.4,height:w*0.25, backgroundColor: 'rgba(0,0,0,0.75)',borderTopRightRadius:4*p,borderBottomRightRadius:4*p,justifyContent:'flex-start',alignItems:'flex-start',paddingLeft:2*p},
      numberStyle: {color:'white', marginTop:3*p,paddingLeft:3*p},
      nameStyle: {color:'white', marginTop:p,paddingLeft:3*p},
      validNumberStyle:{color:'white',paddingLeft:3*p},
      vColorWhite: {color:'white'},
      validDateStyle: {flexDirection:'row', justifyContent:'flex-start', marginTop:p},
    });
  }

  constructor(props, context, ...args) {
    super(props, context, ...args);
    this.whp = { w: props.style.width, h: props.style.height, p: props.style.padding }
    this.style = this.createStyleSheet(this.whp);
  }

  componentWillUnmount() {
    if (!this._previousOrientationLandscape) {     
      Core.Helper.SGHelperWindow.lockPortrait();
    }
  }

  render() {
    const {SGText,SGRootView, SGTextInput, SGView,SGTouchableOpacity,SGImage } = Core.Control;
    var { w, h, p } = this.whp;
    var style = this.style;
    var data = this.props.data;
    var language = this.props.language;
    var imageSetting = this.props.imageSetting;
    var stringWithSpaceAfterEvery4thChar = data.fCardNumber.match(/.{1,4}/g);
    return (
        <SGImage style={style.cardImage} source={{ uri: data['fContent' + language.toUpperCase()]['fBackGroundImage'][0][imageSetting] }}>
          <SGView style={data.fType == 'default' ? style.pointStyle : data.fJSONPoint}>
            <SGText preset={SGText.preset.h1B} style={style.vColorWhite}>{data.fTotalPoint}</SGText>
            <SGText preset={SGText.preset.titleH3} style={style.vColorWhite}>Point Available</SGText>
            <SGText preset={SGText.preset.titleH3} style={style.vColorWhite}>{data.fExpiredPoint} expiring in X min</SGText>
          </SGView>
        
          <SGText preset={SGText.preset.h3B} style={data.fType ==='default'? style.numberStyle :data.fJSONNumber}>{stringWithSpaceAfterEvery4thChar}</SGText>
          <SGText preset={SGText.preset.h3} style={data.fType ==='default'?style.nameStyle : data.fJSONName}>{data.fUserName}</SGText>
          
          <SGView style={data.fType =='default' ?style.validDateStyle : data.fJSONExpiredDate}>
              <SGView>
                <SGText preset={SGText.preset.titleH4} style={data.fType =='default' ?style.validNumberStyle : data.fJSONValidNumber}>Valid</SGText>
                <SGText preset={SGText.preset.titleH4} style={data.fType =='default' ?style.validNumberStyle : data.fJSONValidNumber}>Thru</SGText>
              </SGView>
              <SGText preset={SGText.preset.titleH1} style={style.vColorWhite}>{SGHelperType.formatDate(SGHelperType.convertNewDate(new Date(data.fValidCardDate)), language)}</SGText>
          </SGView>
        </SGImage>
    );
  }
}