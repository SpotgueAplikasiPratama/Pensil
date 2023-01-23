import React from 'react';
import Core from '../../../core/core';
import MyTranslator from '../../lessons/locale/MyTranslator';

export default class Card extends Core.Control.SGBaseContainer {

  createStyleSheet = (whp) => {
    const { StyleSheet } = Core;
    var { w, h, p } = whp;
    return StyleSheet.create({
      v1: { width:w, flex: 1, backgroundColor: 'red', alignItems: 'center', justifyContent: 'center' },
      imagekartu: {width:w*0.9,height:w * 9 / 16 ,backgroundColor: 'transparent',alignItems:'flex-start', justifyContent:'flex-start', resizeMode: 'cover'},
      imagekartuDisabled:{opacity:0.7, width:w*0.9,height:w * 9 / 16 ,backgroundColor: 'transparent',alignItems:'flex-start', justifyContent:'flex-start', resizeMode: 'cover'},

      fJSONName: {color:'white',marginTop: -2*p, marginLeft: p*4},
      fJSONNumber: {color:'white', marginTop: p, marginLeft: p*4},
      fJSONValidNumber: {flexDirection:'row', justifyContent:'flex-start',marginLeft: p*4},
      fJSONExpiredDate: {color:'white'},
      fJSONPoint: {left:-p, backgroundColor: "#0000004D", borderTopRightRadius: 20, borderBottomRightRadius: 20,
        width: w*0.4, alignItems: "flex-start", alignSelf:'flex-start', marginBottom: p, marginTop: p*4,padding: p, color: "white"
      },
      vColorWhiteM1: {color: 'white', marginTop: -p},
      vColorWhite: {color: 'white'},

      blocked: {color:'red', alignSelf:'center'},
    

    });
  }

  constructor(props, context, ...args) {
    super(props, context, ...args);
    this.style = this.createStyleSheet(this.screenWHP);
    this.data = this.props.data;
    this.language = this.props.datalang;
    this.imageSetting = this.props.imset;
  }

  render() {
    const {SGText,SGRootView, SGTextInput, SGView,SGTouchableOpacity,SGImage } = Core.Control;
    const {SGHelperType} = Core.Helper;
    var { w, h, p } = this.screenWHP;
    var style = this.style;
    this.data = this.props.data;
    console.log(this.data)
    console.log('dalem kartu')
    this.language = this.props.datalang;
    this.imageSetting = this.props.imset;
    return (
        <SGView>
            {this.data.fMemberProfileJSON ? (
            <SGImage style={this.data.fCardBlockedStatus == 'Y' ? style.imagekartuDisabled : style.imagekartu} source={{ uri: this.data['fContent'+(this.language)].fBackgroundImage[0][this.imageSetting].uri }}> 
              <SGView style={this.data.fType == 'default' ? style.fJSONPoint : this.data.fJSONPoint}>
                  <SGText style={this.data.fType == 'default' ? {color: style.fJSONPoint.color} : {color: this.data.fJSONPoint.color}} preset={SGText.preset.titleH2B}>{this.data.fTotalPoint} {MyTranslator.tr('LoyatyCard.PointAvailable')}</SGText>
                  <SGText style={this.data.fType == 'default' ? {color: style.fJSONPoint.color} : {color: this.data.fJSONPoint.color}} preset={SGText.preset.h6}>{this.data.fTotalPoint > 0 ? this.data.fPointSoonExpire: 0} {MyTranslator.tr('LoyatyCard.ExpiredLabel')} </SGText>
                  <SGText style={this.data.fType == 'default' ? {color: style.fJSONPoint.color} : {color: this.data.fJSONPoint.color}} preset={SGText.preset.h6}>{this.data.fTotalPoint > 0 ? SGHelperType.formatDate(SGHelperType.convertNewDate(this.data.fValidDate),this.language) : SGHelperType.formatDate(SGHelperType.convertNewDate(new Date()),this.language)}</SGText>
              </SGView>

              <SGText preset={SGText.preset.h4B} style={this.data.fType == 'default' ? style.fJSONNumber : this.data.fJSONNumber}>{this.data.fCardNumber}</SGText>
              {this.data.fCardBlockedStatus == 'Y' ?
              (
                <SGText preset={SGText.preset.h4B} style={style.blocked}>{MyTranslator.tr('LoyatyCard.Blocked')}</SGText>
              )
              :
              (
                this.data.fActive == 'Y' ?
                (
                  <SGText preset={SGText.preset.h3B} style={this.data.fType == 'default' ? style.fJSONName : this.data.fJSONName}>{this.data.fMemberProfileJSON.fFullName}</SGText>
                )
                :
                (
                  <SGText preset={SGText.preset.h4B} style={style.blocked}>{MyTranslator.tr('LoyatyCard.Expired')}</SGText>
                )
              )}

              <SGView style={this.data.fType == 'default' ? style.fJSONValidNumber : this.data.fJSONValidNumber}>
                <SGView>
                    <SGText preset={SGText.preset.h7} style={this.data.fType == 'default' ? style.fJSONExpiredDate : this.data.fJSONExpiredDate}>{MyTranslator.tr('LoyatyCard.valid')}</SGText>
                    <SGText preset={SGText.preset.h7} style={this.data.fType == 'default' ? style.fJSONExpiredDate : this.data.fJSONExpiredDate}>{MyTranslator.tr('LoyatyCard.Thru')}</SGText>
                </SGView>
                <SGText preset={SGText.preset.h4} style={this.data.fType == 'default' ? style.fJSONExpiredDate : this.data.fJSONExpiredDate}>{SGHelperType.formatDate(SGHelperType.convertNewDate(this.data.fCardExpiryDate),this.language)}</SGText>
              </SGView>
            </SGImage>
            )
            :
            (
            <SGImage style={style.imagekartu} source={{ uri: this.data['fContent'+(this.language)].fBackgroundImage[0][this.imageSetting].uri }}> 
              <SGView style={this.data.fType == 'default' ? style.fJSONPoint : this.data.fJSONPoint}>
                <SGText preset={SGText.preset.h2B} style={this.data.fType == 'default' ? {color: style.fJSONPoint.color} : {color: this.data.fJSONPoint.color}}>0</SGText>
                <SGText preset={SGText.preset.h6} style={this.data.fType == 'default' ? {color: style.fJSONPoint.color} : {color: this.data.fJSONPoint.color}}>Points Available</SGText>
                <SGText preset={SGText.preset.h6} style={this.data.fType == 'default' ? {color: style.fJSONPoint.color} : {color: this.data.fJSONPoint.color}}>0 Expiring in 0d</SGText>
              </SGView>

              <SGText preset={SGText.preset.h4B} style={this.data.fType == 'default' ? style.fJSONNumber : this.data.fJSONNumber}>0000 0000 0000 0000</SGText>
              <SGText preset={SGText.preset.h4B} style={this.data.fType == 'default' ? style.fJSONName : this.data.fJSONName}>{this.data.fContentID.fCardName}</SGText>

              <SGView style={this.data.fType == 'default' ? style.fJSONValidNumber : this.data.fJSONValidNumber}>
                <SGView>
                  <SGText preset={SGText.preset.h8} style={this.data.fType == 'default' ? style.fJSONExpiredDate : this.data.fJSONExpiredDate}>valid</SGText>
                  <SGText preset={SGText.preset.h8} style={this.data.fType == 'default' ? style.fJSONExpiredDate : this.data.fJSONExpiredDate}>thru</SGText>
                </SGView>
                <SGText preset={SGText.preset.h4} style={this.data.fType == 'default' ? style.fJSONExpiredDate : this.data.fJSONExpiredDate}>00/00/0000</SGText>
              </SGView>
            </SGImage>
            )
          }
        </SGView>
    );
  }
}