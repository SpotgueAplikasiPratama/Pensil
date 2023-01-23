import React from 'react';
import Core from '../../../core/core';
import EarnPointModel from '../model/EarnPointModel';
import {EarnPointForm} from '../component/EarnPointForm';
import tbVEarnPointAPI from '../api/tbVEarnPointAPI';
import MyTranslator from '../../lessons/locale/MyTranslator';
import { ArrayOfReceiptCRUDList } from './ArrayOfReceiptCRUD';

export class EarnPointSelf extends Core.Form.SGBaseForm {

    createStyleSheet = (whp) => {
        const { StyleSheet } = Core;
        var { w, h, p } = whp;
        return StyleSheet.create({
            mainView1: {  width: (w -2 * p), minHeight: h*0.8 ,justifyContent: 'flex-start', borderRadius: 2 * p, borderWidth: w * 0.001, borderColor: 'rgb(100,100,100)', elevation: 1, shadowOpacity: 0.085, padding: 2 * p,  backgroundColor: 'white', marginTop: p*2  },
            textInput: { backgroundColor:'#F6F4F4', width: w* 0.725, height: w * 0.1 },
        
            v20: {width: 0.95*w,backgroundColor:'white', borderRadius:10, justifyContent:'center',paddingVertical:2*p, borderWidth:1, borderColor:'lightgrey', marginTop: p*4, marginBottom: p*2},
    
            vSV: {width:w,alignSelf:'center',flexDirection:'column',justifyContent:'space-between'},
            vSV2: {width:w*0.9,flexDirection:'row',justifyContent:'space-between'},

            throwWHP: { width: w, height:h , padding: p },
            cardFlow:{width: w*0.9 ,flexDirection: 'row', justifyContent:'space-between'},
            textFlow: {width: w*0.8},
            v4: { width: w*0.08, alignItems: 'center',justifyContent:'center' },

            vClose: { position: 'absolute', right: 0, top: -2 },
            vView1:{flex:1, justifyContent: 'flex-start', margin: p*3},
            descriptionText: { color: '#000000', alignSelf: 'flex-start' },

            c1: { width: w, height: h, padding: p },
        });
    }

    constructor(props, context, ...args) {
        const {SGHelperGlobalVar} = Core.Helper
        super(props, context, ...args);
        this.style = this.createStyleSheet(this.screenWHP);
        this.fBuildingKey = this.props.buildingKey;
        this.dataReceiptV = new EarnPointModel();
        this.initData(this.dataReceiptV)
        this.imageSetting = SGHelperGlobalVar.getVar('GlobalImageSetting');
        this.MyLoyaltyCardDetailByID = this.props.MyLoyaltyCardDetailByID
        // this.temp = SGHelperGlobalVar.getVar('MyLoyaltyCardDetailByID');
        this.bool = true;
        this.pvID1 = Core.Control.SGPopView.getPopViewID();
        this.pvID2 = Core.Control.SGPopView.getPopViewID();
    }


    showPopEarnPoint(){
        const {SGDialogBox, SGLocalize} = Core.Control
        var settingReceipt = this.props.setting

        if(this.getData('fReceipt').length < settingReceipt.fMaxReceiptCombined){
            Core.Control.SGPopView.showPopView(this.pvID2);
        }
        else{
            SGDialogBox.showWarning(null, SGLocalize.translate('globalText.FailText'), MyTranslator.tr('EarnPointSelf.overReceipt'), SGLocalize.translate('AlertMessage.OK'), ()=>{}, true)
        }
      }
    
    showPopBene(){
        Core.Control.SGPopView.showPopView(this.pvID1);
    }

    hidePopBene(){
        Core.Control.SGPopView.hidePopView(this.pvID1);
    }

    _setReceipt(v){
        this.setData('fReceipt', v)
        this.forceUpdate();
    }

    _RemoveReceiptPress(index){
        this.getData('fReceipt').splice(index, 1);
        var arr = [];
        for (var i = 0; i < this.getData('fReceipt').length; i++) {
            var acceptJSON = this.getData('fReceipt')[i];
            arr.push(acceptJSON);
        }
        this.arrayFlow = arr;
        this.setData('fReceipt', this.arrayFlow);
        this.forceUpdate();
    }

    async _onEarnPoint(length){
        const {SGDialogBox, SGLocalize} = Core.Control;
        const {SGHelperType, SGHelperErrorHandling} = Core.Helper;
        
        // console.log(this.MyLoyaltyCardDetailByID)
        var input = {fBuildingKey: this.fBuildingKey, fMemberKey: this.MyLoyaltyCardDetailByID.fID, fCardKey: this.props.fCardKey ,receiptList: this.getData('fReceipt') }

        SGDialogBox.showConfirmation(null, MyTranslator.tr("AlertMessage.Confirmation"), MyTranslator.tr('EarnPointSelf.confirmationLabel'), MyTranslator.tr("AlertMessage.Cancel"), () => { },
        MyTranslator.tr('AlertMessage.OK'), async  () => {
          try {
            await tbVEarnPointAPI.SubmitLoyaltyPointEarnFromReceipt(input);
            this.dataReceiptV = new EarnPointModel();
            this.initData(this.dataReceiptV)
            SGDialogBox.showSuccess(null, SGLocalize.translate("AlertMessage.Success"), MyTranslator.tr('EarnPointSelf.successLabel'), SGLocalize.translate("AlertMessage.OK"), () => {this.forceUpdate()}, true )
          } catch (error) {
            SGHelperErrorHandling.Handling(error,this._onEarnPoint.bind(this))
          }
        } ,true)
      }

    updateArrayOfAnswer(val) {
        const {SGHelperType} = Core.Helper
        var arr = [];
        for (var i = 0; i < val.length; i++) {
            var acceptJSON = SGHelperType.copyJSON(val[i].getCurrentJSON());
            acceptJSON.fMemberKey = this.MyLoyaltyCardDetailByID.fID;
            acceptJSON.fBuildingKey = this.MyLoyaltyCardDetailByID.fBuildingKey;
            acceptJSON.fUserKey = this.MyLoyaltyCardDetailByID.fUserKey;
            acceptJSON.fActive = 'Y';
            arr.push(acceptJSON);
        }
        this.arrayOfAnswer = arr;
        this.setData('fReceipt', this.arrayOfAnswer);
        if(this.getData('fReceipt').length > 0){
            this.bool = false
        }else {
            this.bool = true
        }
        this.forceUpdate();
    }


    render() {
        const { SGScrollView, SGTouchableOpacity, SGIcon, SGButton,SGView, SGText, SGPopView, SGTextInput, SGDialogBox, SGLocalize} = Core.Control
        const {SGHelperType,CustomMenuBar} = Core.Helper;
        this.MyLoyaltyCardDetailByID = this.props.MyLoyaltyCardDetailByID
        var language = this._language.toUpperCase();
        var { w, h, p } = this.screenWHP;
        var style = this.style;
       
        return (
        <SGView style={style.mainView1} >
            <SGPopView vPos={'center'} hPos={'center'} animationType={'none'} popViewID={this.pvID1}>
                <SGView style={{ width: w - 8 * p, height: h*0.85, padding: p, borderRadius: 2 * p, backgroundColor: 'white', justifyContent: 'flex-start' }}>
                    <SGText preset={SGText.preset.h4B}>{MyTranslator.tr('CardDetail.tc')}</SGText>
                    <SGTouchableOpacity style={style.vClose} onPress={() => { this.hidePopBene() }}>
                        <SGIcon name={SGIcon.Icon.closecircle} preset={SGIcon.preset.h1} style={{ color: '#181818' }}></SGIcon>
                    </SGTouchableOpacity>
                    <SGScrollView contentContainerStyle={style.vView1}> 
                        <SGText preset={SGText.preset.heading7} style={style.descriptionText}>{this.MyLoyaltyCardDetailByID['fContent' + language].fTandC}</SGText>
                    </SGScrollView>
                </SGView>
            </SGPopView>

            <SGText preset={SGText.preset.h3B} style={{alignSelf:'flex-start'}}>{MyTranslator.tr('EarnPoint.titleEarn')}</SGText>
            <SGText>{this.MyLoyaltyCardDetailByID['fContent'+this._language.toUpperCase()].fStepEarnSelf}</SGText>

            <SGTouchableOpacity onPress={this.showPopBene.bind(this)}>
                <SGView style={style.v20}> 
                    <SGText preset={SGText.preset.h6B}>{MyTranslator.tr('EarnPoint.tandc')}</SGText>
                    <SGIcon name={SGIcon.Icon.arrowDown} preset={SGIcon.preset.h8B} style={{color:'black'}}/>
                </SGView> 
            </SGTouchableOpacity>

            <ArrayOfReceiptCRUDList fMaxReceiptCombined={this.props.setting.fMaxReceiptCombined} fCardBlockedStatus ={this.props.fCardBlockedStatus} full language={this._language} globalLanguage={this._language} dataList={this.getData('fReceipt')} updateArrayOfAnswer={this.updateArrayOfAnswer.bind(this)} style={style.c1} imageSetting ={this.imageSetting} tenantPicker={this.props.tenantPicker} _checkCustomSetting={this.props._checkCustomSetting} fCardKey={this.props.fCardKey}></ArrayOfReceiptCRUDList>

            {this.props.fCardBlockedStatus !== 'Y' &&
                <SGButton disabled = {this.bool} label={MyTranslator.tr('EarnPointForm.addReceiptButton')} onPress={this._onEarnPoint.bind(this, this.getData('fReceipt'))}></SGButton>
            }
        </SGView>
           
        );
    }
}