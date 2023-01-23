/**
 * Version 1.2.0
 * 1. Yohanes 27 April 2021
 * - add Switch SIgnUP for Apple
 */
import React from 'react';
import { StyleSheet } from 'react-native';
import { SGBaseForm } from "../../core/container/SGBaseForm";
import { SGView as View, SGText as Text, SGTextInput as TextInput, SGPicker as Picker } from '../../core/control';
import {SGLocalize} from '../locales/SGLocalize';
import { SGFormTextInput,SGFormPicker, SGFormSwitch } from '../../core/form';
import {SGHelperType} from '../../core/helper';

export class SignUp2Form extends SGBaseForm {
    createStyleSheet = (whp) => {
        var { w, h, p } = whp;
        return StyleSheet.create({
            mainView1: { justifyContent: 'center', alignItems: 'center', marginTop: 5 * p },
            throwWHP: { width: w, height: h, padding: p },
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
    }
    _changeSwitch(data){
        this.switch=data
        if(data==="N"){
            this.setData("fPassword",SGHelperType.encrypt(SGHelperType.getGUID()))
           
        }
        if(this.props.hideValidator)this.props.hideValidator(data)
        this.forceUpdate()
    }
  
    render() {
        this.initData(this.props.userData);
        var { w, h, p } = this.whp;
        var style = this.style;
        var userData = this.props.userData;
        var securityQuestionData = this.props.securityQuestionData;
        var lang = this.props.language.toUpperCase();
        var hiddenSwitchApple = this.getData("fRegisterMethod")!=="apple" 
        var hiddenField = !hiddenSwitchApple && this.switch==="N"
        // securityQuestionTitle={SGLocalize.translate("SignUpFormScreen.securityQuestionTitle")} ph1={SGLocalize.translate("SignUpFormScreen.placeholder1")} ph2={SGLocalize.translate("SignUpFormScreen.placeholder2")} ph3={SGLocalize.translate("SignUpFormScreen.placeholder3")} ph4={SGLocalize.translate("SignUpFormScreen.placeholder4")} ph5={SGLocalize.translate("SignUpFormScreen.placeholder5")} passwordText={SGLocalize.translate("SignUpFormScreen.passwordText")}
        return (
            <View accessible={true} accessibilityLabel={'SignUp2FormRootView'} style={style.mainView1}>

                <SGFormTextInput maxLength={SGHelperType.ArraymaxLength(3)} disabled label={SGLocalize.translate('SignUpFormScreen.Email/Phone')} preset={TextInput.preset.default} accessible={true} accessibilityLabel={'SignUp2FormEmailTextInput'}  dataType={TextInput.dataType.text} onValueChange={(v) => { this.setData('fEmail', v) }} value={userData.fEmail !== '' ? (userData.fEmail) : (userData.fPhoneNumber !== '' ? (userData.fPhoneNumber) : (''))} placeholder={''} />
                <SGFormSwitch hidden={hiddenSwitchApple} accessible={true} accessibilityLabel={'SignUpFormScreenSwitch'}  label={SGLocalize.translate('SignUpScreen.additionalSwitch')} onValueChange={(v) => {this._changeSwitch(v)}} value={this.switch} />
                
                <SGFormTextInput hidden={hiddenField} maxLength={SGHelperType.ArraymaxLength(2)} label={SGLocalize.translate("SignUpFormScreen.placeholder1")} preset={TextInput.preset.default} accessible={true} accessibilityLabel={'SignUp2FormNameTextInput'} shadow dataType={TextInput.dataType.text}onValueChange={(v) => { this.setData('fName', v) }} value={userData.fName} placeholder={''}  validator={this._data.getValidators('fName')} />
                <SGFormTextInput hidden={hiddenField} maxLength={SGHelperType.ArraymaxLength(3)} label={SGLocalize.translate("SignUpFormScreen.placeholder2")} preset={TextInput.preset.default} accessible={true} accessibilityLabel={'SignUp2FormPasswordTextInput'} shadow dataType={TextInput.dataType.password}   onValueChange={(v) => {  this.setData('fPassword', v) }}  placeholder={''}  validator={this.switch==="Y"? this._data.getValidators('fPassword'):"" }  />
                <Text hidden={hiddenField} accessible={true} accessibilityLabel={'SignUp2FormSecQuestionText'} preset={Text.preset.titleH4B} style={style.text2}>{SGLocalize.translate('SignUpFormScreen.passwordText')}</Text>
                <SGFormTextInput hidden={hiddenField} maxLength={SGHelperType.ArraymaxLength(3)} label={SGLocalize.translate("SignUpFormScreen.placeholder3")} preset={TextInput.preset.default} accessible={true} accessibilityLabel={'SignUp2FormPasswordTextInput'} shadow dataType={TextInput.dataType.password}  onValueChange={(v) => { this.setData('fConfirmPassword', v) }} placeholder={''}  validator={this.switch==="Y"? this._data.getValidators('fConfirmPassword'):""}  />
                {/* <SGFormPicker hidden={hiddenField} single language={lang} label={SGLocalize.translate("SignUpFormScreen.securityQuestionTitle")} shadow preset={SGFormPicker.preset.default}  accessible={true} accessibilityLabel={'SignUp2FormSecQuestionPicker'}  optionList={securityQuestionData}    onValueChange={(v) => { this.setData('fSecurityQuestionKey', v) }} validator={this.switch==="Y"? this._data.getValidators('fSecurityQuestionKey'):""} />
                <SGFormTextInput hidden={hiddenField} maxLength={SGHelperType.ArraymaxLength(3)} label={SGLocalize.translate("SignUpFormScreen.placeholder5")} preset={TextInput.preset.default} accessible={true} accessibilityLabel={'SignUp2FormQuestionAnswerTextInput'} shadow dataType={TextInput.dataType.text} onValueChange={(v) => { this.setData('fQuestionAnswer', v) }} validator={this.switch==="Y"? this._data.getValidators('fQuestionAnswer'):""} /> */}
                <SGFormTextInput  maxLength={SGHelperType.ArraymaxLength(2)} label={SGLocalize.translate('SignUpFormScreen.refferalPlaceholder')} preset={TextInput.preset.default} accessible={true} accessibilityLabel={'SignUp2FormPasswordConfirmTextInput'} shadow dataType={TextInput.dataType.text}  onValueChange={(v) => { this.props.setReferralCode(v) }}  />
               
            </View>
        );
    }
}