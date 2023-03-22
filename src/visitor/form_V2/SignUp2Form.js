/**
 * Version 1.2.0
 * 1. Yohanes 27 April 2021
 * - add Switch SIgnUP for Apple
 */
import React from 'react';
import { StyleSheet } from 'react-native';
import { SGBaseForm } from "../../core/container/SGBaseForm";
import { SGView as View, SGText as Text, SGTextInput as TextInput, SGPicker as Picker,SGDatePicker } from '../../core/control';
import {SGLocalize} from '../locales/SGLocalize';
import { SGFormTextInput,SGFormPicker, SGFormSwitch } from '../../core/form';
import {SGHelperType,SGHelperGlobalVar} from '../../core/helper';
import { tbLookupDAO } from '../db/tbLookupDAO';
import { VisitorHelper } from '../helper/VisitorHelper';

export class SignUp2Form extends SGBaseForm {
    createStyleSheet = (whp) => {
        var { w, h, p } = whp;
        return StyleSheet.create({
            mainView1: { justifyContent: 'center', alignItems: 'center', marginTop: 5 * p },
            throwWHP: { width: w, height: h, padding: p },
            text: { alignSelf: 'flex-start', marginHorizontal: 2 * p, marginTop: 6 * p,paddingLeft:5*p },
            text1: { color: '#909090', alignSelf: 'center', marginHorizontal: p },
            text2: { color: '#7a7a7a', alignSelf: 'flex-start', marginHorizontal: w * 0.05 },
            textView: { width: (w - 2 * p) * 0.8, },
            inputView1: { flex: null, marginTop: w * 0.03, backgroundColor: 'white', width: (w - 2 * p) * 0.8, height: w * 0.15, borderRadius: 3 * p, borderWidth: p * 0.02, },
            input1: { color: '#7a7a7a', paddingHorizontal: p * 2, fontSize: w * 0.0375 },
            inputView2: { marginVertical: w * 0.03, width: (w - 2 * p) * 0.8, height: w * 0.15, borderWidth: p * 0.02, borderRadius: 3 * p, },
        });
    }
    constructor(props, context, ...args) {
        super(props, context, ...args);
        this.whp = { w: props.style.width, h: props.style.height, p: props.style.padding }
        this.style = this.createStyleSheet(this.whp);
        this.initData(this.props.userData);
        this.state = {
            selected: "",
        };
        this.securityQuestionData = this.props.securityQuestionData;
        this.switch= this.getData("fRegisterMethod")==="apple" ?"N":"Y"
        this.currentUserCurrency = SGHelperGlobalVar.getVar('GlobalCurrency');
    }
    _changeSwitch(data){
        this.switch=data
        if(data==="N"){
            this.setData("fPassword",SGHelperType.encrypt(SGHelperType.getGUID()))
           
        }
        if(this.props.hideValidator)this.props.hideValidator(data)
        this.forceUpdate()
    }
    
    _getPickerData(filter) {
        var pullData = tbLookupDAO.getSpecificLookupByGroup(filter);
        var data = [];
        for (var i = 0; i < pullData.length; i++) {
            var pickerData = { key: pullData[i].fLookUpKey, title:pullData[i].fLanguage[this.props.language.toLowerCase()]  };
            data.push(pickerData)
        }
        data = VisitorHelper._naturalSort(data, 'desc', 'title');
        return (data);
    }

    _pushPickerData() {
        var genderData = this._getPickerData("Gender");
        var statusData = this._getPickerData("Family");
        var preferenceData = this._getPickerData("Preference");
        var spendingCriteriaData = this._getSpendingCriteriaData("SpendingCriteria","SpendingCriteria");
        spendingCriteriaData = VisitorHelper._sortArrJSON(spendingCriteriaData, 'key', true);
        this.pickerData = [];
        this.pickerData.push(genderData)
        this.pickerData.push(statusData)
        this.pickerData.push(preferenceData)
        this.pickerData.push(spendingCriteriaData)
    }

    _getSpendingCriteriaData(filter, LookUpVariable) {
        var spendingCriteriaJSON = {
            IDR: { d: { min: 0.0, max: 250000.0 }, c: { min: 250000.0, max: 750000.0 }, b: { min: 750000.0, max: 1500000.0 }, a: { min: 1500000.0, max: 1000000000.0 } },
            USD: { d: { min: 0.0, max: 20.0, }, c: { min: 20.0, max: 55.0 }, b: { min: 55.0, max: 110.0 }, a: { min: 110.0, max: 1000000000.0 } },
            CNY: { d: { min: 0.0, max: 120.0 }, c: { min: 120.0, max: 350.0 }, b: { min: 350.0, max: 700.0 }, a: { min: 700.0, max: 1000000000.0 } },
            JPY: { d: { min: 0.0, max: 1850.0 }, c: { min: 1850.0, max: 5550.0 }, b: { min: 5550.0, max: 11100.0 }, a: { min: 11100.0, max: 1000000000.0 } },
            KRW: { d: { min: 0.0, max: 19500.0 }, c: { min: 19500.0, max: 60000.0 }, b: { min: 60000.0, max: 116000.0 }, a: { min: 116000.0, max: 1000000000.0 } },
            MYR: { d: { min: 0.0, max: 75.0 }, c: { min: 75.0, max: 220.0 }, b: { min: 220.0, max: 435.0 }, a: { min: 435.0, max: 1000000000.0 } },
            SGD: { d: { min: 0.0, max: 25.0 }, c: { min: 25.0, max: 72.0 }, b: { min: 72.0, max: 145.0 }, a: { min: 145.0, max: 1000000000.0 } },
            AUD: { d: { min: 0.0, max: 25.0 }, c: { min: 25.0, max: 70.0 }, b: { min: 70.0, max: 141.0 }, a: { min: 141.0, max: 1000000000.0 } },
        }
        var pullData = tbLookupDAO.getSpecificLookupByGroup(filter);
        var data = [];
        for (var i = 0; i < pullData.length; i++) {
            var pickerData = { key: pullData[i].fLookUpKey, title: SGLocalize.translate(LookUpVariable + "." + pullData[i].fValueKey, { currency: this.currentUserCurrency, min: spendingCriteriaJSON[this.currentUserCurrency][pullData[i].fValueKey].min, max: spendingCriteriaJSON[this.currentUserCurrency][pullData[i].fValueKey].max }) };
            data.push(pickerData);
        }

        return (data);
    }


    render() {
        this.initData(this.props.userData);
        var { w, h, p } = this.whp;
        var style = this.style;
        var userData = this.props.userData;
        var securityQuestionData = this.props.securityQuestionData;
        var language = this.props.language.toUpperCase();
        var hiddenSwitchApple = this.getData("fRegisterMethod")!=="apple" 
        var hiddenField = !hiddenSwitchApple && this.switch==="N"
        // securityQuestionTitle={SGLocalize.translate("SignUpFormScreen.securityQuestionTitle")} ph1={SGLocalize.translate("SignUpFormScreen.placeholder1")} ph2={SGLocalize.translate("SignUpFormScreen.placeholder2")} ph3={SGLocalize.translate("SignUpFormScreen.placeholder3")} ph4={SGLocalize.translate("SignUpFormScreen.placeholder4")} ph5={SGLocalize.translate("SignUpFormScreen.placeholder5")} passwordText={SGLocalize.translate("SignUpFormScreen.passwordText")}
        this._pushPickerData();
        var genderQuestionData = this.pickerData[0]
        var statusData = this.pickerData[1]
        var preferenceData = this.pickerData[2]
        var spendingCriteriaData = this.pickerData[3]
        return (
            <View accessible={true} accessibilityLabel={'SignUp2FormRootView'} style={style.mainView1}>

                <SGFormTextInput maxLength={SGHelperType.ArraymaxLength(3)} disabled label={SGLocalize.translate('SignUpFormScreen.Email/Phone')} preset={TextInput.preset.default} accessible={true} accessibilityLabel={'SignUp2FormEmailTextInput'}  dataType={TextInput.dataType.text} onValueChange={(v) => { this.setData('fEmail', v) }} value={userData.fEmail !== '' ? (userData.fEmail) : (userData.fPhoneNumber !== '' ? (userData.fPhoneNumber) : (''))} placeholder={''} />
                <SGFormSwitch hidden={hiddenSwitchApple} accessible={true} accessibilityLabel={'SignUpFormScreenSwitch'}  label={SGLocalize.translate('SignUpScreen.additionalSwitch')} onValueChange={(v) => {this._changeSwitch(v)}} value={this.switch} />
                
                <SGFormTextInput hidden={hiddenField} maxLength={SGHelperType.ArraymaxLength(2)} label={SGLocalize.translate("SignUpFormScreen.placeholder1")} preset={TextInput.preset.default} accessible={true} accessibilityLabel={'SignUp2FormNameTextInput'} shadow dataType={TextInput.dataType.text}onValueChange={(v) => { this.setData('fName', v) }} value={userData.fName} placeholder={''}  validator={this._data.getValidators('fName')} />
                <SGFormTextInput hidden={hiddenField} maxLength={SGHelperType.ArraymaxLength(3)} label={SGLocalize.translate("SignUpFormScreen.placeholder2")} preset={TextInput.preset.default} accessible={true} accessibilityLabel={'SignUp2FormPasswordTextInput'} shadow dataType={TextInput.dataType.password}   onValueChange={(v) => {  this.setData('fPassword', v) }}  placeholder={''}  validator={this.switch==="Y"? this._data.getValidators('fPassword'):"" }  />
                <Text hidden={hiddenField} accessible={true} accessibilityLabel={'SignUp2FormSecQuestionText'} preset={Text.preset.titleH4B} style={style.text2}>{SGLocalize.translate('SignUpFormScreen.passwordText')}</Text>
                <SGFormTextInput hidden={hiddenField} maxLength={SGHelperType.ArraymaxLength(3)} label={SGLocalize.translate("SignUpFormScreen.placeholder3")} preset={TextInput.preset.default} accessible={true} accessibilityLabel={'SignUp2FormPasswordTextInput'} shadow dataType={TextInput.dataType.password}  onValueChange={(v) => { this.setData('fConfirmPassword', v) }} placeholder={''}  validator={this.switch==="Y"? this._data.getValidators('fConfirmPassword'):""}  />
              
                {/* Additional */}
                <Text accessible={true} accessibilityLabel={'SignUp2FormDOB'} preset={Text.preset.titleH3} style={style.text}>{SGLocalize.translate('UserProfileScreen.DOBText')}</Text>
                <SGDatePicker language={language} accessible={true} accessibilityLabel={'UserProfileFormDatePicker'} preset={SGDatePicker.preset.default}  onValueChange={(v) => { this.setData('fDOB', v) }} value={this.getData('fDOB')} dateRange={{ start: new Date(1900, 1, 1), end: new Date() }}   textStyle={{ color: 'black' }} />
                <SGFormPicker language={language} accessible={true} accessibilityLabel={'UserProfileFormGenderPicker'} single label={SGLocalize.translate('UserProfileScreen.GenderText')}  optionList={genderQuestionData} onValueChange={(v) => { this.setData('fGender', v) }} value={this.getData('fGender')} validator={this._data.getValidators('fGender')}/>
                <SGFormPicker language={language} accessible={true} accessibilityLabel={'UserProfileFormStatusDataPicker'} single label={SGLocalize.translate('UserProfileScreen.Status')}  optionList={statusData} onValueChange={(v) => { this.setData('fFamily', v) }} value={this.getData('fFamily')} validator={this._data.getValidators('fFamily')} />
                <SGFormPicker language={language} accessible={true} accessibilityLabel={'UserProfileFormFoodPrefPicker'} label={SGLocalize.translate('UserProfileScreen.FoodPreference')}  optionList={preferenceData} onValueChange={(v) => { this.setData('fFoodPreference', v) }} value={this.getData('fFoodPreference')}  validator={this._data.getValidators('fFoodPreference')}/>
                <SGFormPicker language={language} accessible={true} accessibilityLabel={'UserProfileFormRemindResvPicker'} single label={SGLocalize.translate('UserProfileScreen.SpendingCriteria')}   optionList={spendingCriteriaData} onValueChange={(v) => { this.setData('fSpendCriteria', v) }} value={this.getData('fSpendCriteria')}  validator={this._data.getValidators('fSpendCriteria')}/>

                {/* <SGFormPicker hidden={hiddenField} single language={lang} label={SGLocalize.translate("SignUpFormScreen.securityQuestionTitle")} shadow preset={SGFormPicker.preset.default}  accessible={true} accessibilityLabel={'SignUp2FormSecQuestionPicker'}  optionList={securityQuestionData}    onValueChange={(v) => { this.setData('fSecurityQuestionKey', v) }} validator={this.switch==="Y"? this._data.getValidators('fSecurityQuestionKey'):""} />
                <SGFormTextInput hidden={hiddenField} maxLength={SGHelperType.ArraymaxLength(3)} label={SGLocalize.translate("SignUpFormScreen.placeholder5")} preset={TextInput.preset.default} accessible={true} accessibilityLabel={'SignUp2FormQuestionAnswerTextInput'} shadow dataType={TextInput.dataType.text} onValueChange={(v) => { this.setData('fQuestionAnswer', v) }} validator={this.switch==="Y"? this._data.getValidators('fQuestionAnswer'):""} /> */}
                <SGFormTextInput  maxLength={SGHelperType.ArraymaxLength(2)} label={SGLocalize.translate('SignUpFormScreen.refferalPlaceholder')} preset={TextInput.preset.default} accessible={true} accessibilityLabel={'SignUp2FormPasswordConfirmTextInput'} shadow dataType={TextInput.dataType.text}  onValueChange={(v) => { this.props.setReferralCode(v) }}  />
               
            </View>
        );
    }
}