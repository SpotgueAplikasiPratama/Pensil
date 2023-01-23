import React from 'react';
import Core from '../core/core';
import tbVEarnPointAPI from './plugin1/api/tbVEarnPointAPI';
import {EarnPointSelf} from '../plugin/plugin1/component/EarnPointSelf';
import MyTranslator from './lessons/locale/MyTranslator';

export default class EarnPoint extends Core.Control.SGBaseContainer {
  createStyleSheet = (whp) => {
    var { w, h, p } = whp;
    return Core.StyleSheet.create({
      mainView1: { width: (w -2 * p), minHeight: h*0.8 ,justifyContent: 'flex-start', borderRadius: 2 * p, borderWidth: w * 0.001, borderColor: 'rgb(100,100,100)', elevation: 1, shadowOpacity: 0.085, padding: 2 * p,  backgroundColor: 'white', marginTop: p*2 },
      v10: {height:h, width:w, justifyContent:'flex-start'},
      v16: {width: w,alignItems:'center'},
      v17: {width:w,alignItems:'flex-start',marginLeft:13*p},
      v18: {marginRight:w*0.12,width:w*0.5,height:0.5*w,},
      v19: {alignSelf:'flex-start',width:w*0.9,alignItems:'center'},
      v20: {width: 0.95*w,backgroundColor:'white', borderRadius:10, justifyContent:'center',paddingVertical:2*p, borderWidth:1, borderColor:'lightgrey', marginTop: p*4, marginBottom: p*2},

      vPV: { width: w, backgroundColor: 'white'},
      vSV: {width:w,alignSelf:'center',flexDirection:'column',justifyContent:'space-between'},

      vClose: { position: 'absolute', right: 0, top: -2 },
      vView1:{flex:1, justifyContent: 'flex-start', margin: p*3},
      descriptionText: { color: '#000000', alignSelf: 'flex-start' },

      throwWHP: { width: w, height:h , padding: p },
    });
  }

  constructor(props, context, ...args) {
    const {SGHelperGlobalVar} = Core.Helper
    super(props, context, ...args);
    this.style = this.createStyleSheet(this.screenWHP);
    this.pvID1 = Core.Control.SGPopView.getPopViewID();
    this.imset = SGHelperGlobalVar.getVar('GlobalImageSetting')
  } 

  showPopBene(){
    Core.Control.SGPopView.showPopView(this.pvID1);
  }

  hidePopBene(){
    Core.Control.SGPopView.hidePopView(this.pvID1);
  }
      
  render() {
    const { SGIcon, SGView, SGTouchableOpacity, SGText, SGPopView, SGImage, SGRootView, SGTabView,  SGScrollView, SGActivityIndicator, SGQRImage} = Core.Control;
    var style = this.style;
    var { w, h, p } = this.screenWHPNoHeader;
    this.fStepEarnSelf = this.props.MyLoyaltyCardDetailByID['fContent' + (this._language.toUpperCase())].fStepEarnSelf;
    this.fStepEarnTenant = this.props.MyLoyaltyCardDetailByID['fContent' + (this._language.toUpperCase())].fStepEarnTenant;
    this.fStepEarnBuilding = this.props.MyLoyaltyCardDetailByID['fContent'+ (this._language.toUpperCase())].fStepEarnBuilding;
    
    {/* tabLabel jadi pemisah, setiap tambah tabLabel id tambah 1 mulai dari 0 
              gaharus view bisa apa aja yg penting ada tabLabel*/}
              console.log(this.props.bool1);
    return (
      <SGView style = {{backgroundColor: 'white', width:w}}>
        <SGView style={style.vPV}>
          <SGPopView vPos={'center'} hPos={'center'} animationType={'none'} popViewID={this.pvID1}>
            <SGView style={{ width: w - 8 * p, height: h*0.85, padding: p, borderRadius: 2 * p, backgroundColor: 'white', justifyContent: 'flex-start' }}>
              <SGText preset={SGText.preset.h4B}>{MyTranslator.tr('CardDetail.tc')}</SGText>
              <SGTouchableOpacity style={style.vClose} onPress={() => { this.hidePopBene() }}>
                  <SGIcon name={SGIcon.Icon.closecircle} preset={SGIcon.preset.h1} style={{ color: '#181818' }}></SGIcon>
              </SGTouchableOpacity>
              <SGScrollView contentContainerStyle={style.vView1}> 
                  <SGText preset={SGText.preset.heading7} style={style.descriptionText}>{this.props.MyLoyaltyCardDetailByID['fContent' + this._language.toUpperCase()].fTandC}</SGText>
              </SGScrollView>
            </SGView>
          </SGPopView>
          <SGView style={{marginTop:5}}>
            <SGTabView locked={false} hideTabBar={this._hideTabView} ref={this._tabView} scrollableTabBar={true} style={{ alignSelf: 'stretch', flex: 1, backgroundColor: this._darkMode ? 'black' : 'white' }} onChangeTab={(e) => { this._tabIndex = e.i; this.forceUpdate(); }}>
              {this.props.bool3 ? (null) : (
                <SGScrollView hidden={this.bool3} tabLabel={MyTranslator.tr('EarnPoint.SelfLabel')} contentContainerStyle={style.vSV} >
                  <EarnPointSelf fCardBlockedStatus={this.props.fCardBlockedStatus} setting = {this.props.EarnPointSetting} tenantPicker={this.props.tenantListPicker} MyLoyaltyCardDetailByID={this.props.MyLoyaltyCardDetailByID} buildingKey={this.props.fBuildingKey} _checkCustomSetting={this.props._checkCustomSetting} fCardKey={this.props.fCardKey}></EarnPointSelf>
                </SGScrollView>
              )}

            {this.props.bool1 ? (null):(
            <SGScrollView hidden={this.bool1} tabLabel={MyTranslator.tr('EarnPoint.MallLabel')} contentContainerStyle={style.vSV} >
              <SGView style={style.mainView1}>
                  <SGText preset={SGText.preset.h3B}style={{alignSelf:'flex-start'}}>{MyTranslator.tr('EarnPoint.titleEarn')}</SGText>
                  <SGText>{this.fStepEarnBuilding}</SGText>
                <SGQRImage accessible={true} accessibilityLabel={'RewardDetailScreenQRImage'} value={this.props.fMemberKey}></SGQRImage>

                  <SGTouchableOpacity onPress={this.showPopBene.bind(this)}>
                    <SGView style={style.v20}> 
                      <SGText preset={SGText.preset.h6B}>{MyTranslator.tr('EarnPoint.tandc')}</SGText>
                      <SGIcon name={SGIcon.Icon.arrowDown} preset={SGIcon.preset.h8B} style={{color:'black'}}/>
                    </SGView>    
                  </SGTouchableOpacity>
              </SGView>
            </SGScrollView>
            )}

            {this.props.bool2 ? (null):(
              <SGScrollView hidden = {this.bool2} tabLabel={MyTranslator.tr('EarnPoint.TenantLabel')} contentContainerStyle={style.vSV} >
                <SGView style={style.mainView1}>
                    <SGText preset={SGText.preset.h3B}style={{alignSelf:'flex-start'}}>{MyTranslator.tr('EarnPoint.titleEarn')}</SGText>
                    <SGText>{this.fStepEarnTenant}</SGText>
                  <SGQRImage accessible={true} accessibilityLabel={'RewardDetailScreenQRImage'} value={this.props.fMemberKey}></SGQRImage>
                    <SGTouchableOpacity onPress={this.showPopBene.bind(this)}>
                      <SGView style={style.v20}> 
                        <SGText preset={SGText.preset.h6B}>{MyTranslator.tr('EarnPoint.tandc')}</SGText>
                        <SGIcon name={SGIcon.Icon.arrowDown} preset={SGIcon.preset.h8B} style={{color:'black'}}/>
                      </SGView>    
                    </SGTouchableOpacity>
                </SGView> 
              </SGScrollView> 
            )}
            </SGTabView>
          </SGView>
        </SGView>
      </SGView>
    );
  }
}