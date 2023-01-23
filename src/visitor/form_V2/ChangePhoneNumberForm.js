import React from 'react';
import { StyleSheet } from 'react-native';
import { SGBaseForm } from "../../core/container/SGBaseForm";
import { SGView as View, SGText as Text, SGTextInput as TextInput, SGTextInput } from '../../core/control';
import { SGFormTextInput, SGFormPicker } from '../../core/form';
import { SGHelperType, SGHelperStyle } from '../../core/helper';
import { tbLookupDAO } from '../db/tbLookupDAO';
import { SGLocalize } from '../locales/SGLocalize';
import image from '../asset/image';
import { VisitorHelper } from '../helper/VisitorHelper';
import {SGHelperGlobalVar} from '../../core/helper';

export class ChangePhoneNumberForm extends SGBaseForm {
    createStyleSheet = (whp) => {
        var { w, h, p } = whp;
        return StyleSheet.create({
            mainView1: { padding: p },
            throwWHP: { width: w, height: h, padding: p },
            text1: { color: '#909090', alignSelf: 'center', marginHorizontal: w * 0.01 },
            textView: { width: (w - 2 * p) * 0.8, },
            inputView1: { backgroundColor: 'white', flex: null, marginTop: w * 0.03, backgroundColor: 'white', width: (w - 2 * p) * 0.8, height: w * 0.15, borderRadius: 3 * p, borderWidth: p * 0.02, },
            input1: { backgroundColor: 'white', color: '#7a7a7a', paddingHorizontal: p * 2, fontSize: w * 0.0375 },
            picker: { width: w * 0.1 },
            phoneInputView: { flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'flex-start', width: w},
            phoneNumberText: { alignSelf: 'flex-start', marginHorizontal: 5 * p, marginTop: 3 * p, color: SGHelperStyle.color.TextDisabled }
        });
    }
    constructor(props, context, ...args) {
        super(props, context, ...args);
        this.whp = { w: props.style.width, h: props.style.height, p: props.style.padding }
        this.style = this.createStyleSheet(this.whp);
        this.initData(this.props.userData);
        this._language = SGHelperGlobalVar.getVar('GlobalLanguage')
        this.lookupCountryPhoneCode = tbLookupDAO.getActiveLookUpByGroup('CountryPhoneCode');
        this.countryPhoneCodePickerData = [];
        for (var i = 0; i < this.lookupCountryPhoneCode.length; i++) {
            var jsonPicker = { key: this.lookupCountryPhoneCode[i].fValueKey, title: this.lookupCountryPhoneCode[i].fLanguage[this._language.toLowerCase()], image: image[this.lookupCountryPhoneCode[i].fValueKey].med.url };
            this.countryPhoneCodePickerData.push(jsonPicker);
        }
        this.oldPhoneNumberInput = VisitorHelper._getPhoneNumber(this.props.oldPhoneNumber);
        this.oldSelectedCountryPhoneCode = VisitorHelper._getPhoneNumberCountryCode(this.props.oldPhoneNumber);
        this.phoneNumberInput = '';
        this.selectedCountryPhoneCode = '+62';
       
    }

    _onSetPhoneNumber(v) {
        this.setData('fPhoneNumber', v);
    }

    _onPickerValueChange(v) {
        this.selectedCountryPhoneCode = v;
        this.props.onChangeCountryPhoneCode(v);
    }

    render() {
        this.initData(this.props.userData);
        var { w, h, p } = this.whp;
        var style = this.style;
        return (
            <View accessible={true} accessibilityLabel={'ChangePhoneNumberFormRootView'} style={style.mainView1}>
                <Text preset={Text.preset.titleH3} style={style.phoneNumberText}>{this.props.inputNewPhoneNumberText}</Text>
                <View accessible={true} accessibilityLabel={'SignUpFormWithPhoneNumberRootView'} style={style.phoneInputView}>
                    <SGFormPicker accessible={true} accessibilityLabel={'ProfileScreenLikedRestoPicker'} disabled single shadow mandatory language={(this.props.language).toUpperCase()} preset={SGFormPicker.preset.phoneNumber} optionList={this.countryPhoneCodePickerData} value={this.oldSelectedCountryPhoneCode} onValueChange={(v) => { this._onPickerValueChange(v) }} />
                    <SGTextInput maxLength={SGHelperType.ArraymaxLength(2)} accessible={true} accessibilityLabel={'SignInFormWithPhoneNumberPhoneNumberPhoneTextInput'} disabled dataType={TextInput.dataType.phone} onValueChange={(v) => { this._onSetPhoneNumber(v) }} shadow preset={SGTextInput.preset.default} value={this.oldPhoneNumberInput} placeholder={'000000000'} style={{width: (w - 10 * p) * 0.735, height: w * 0.11,marginTop:3*p,marginLeft:p}}/>
                </View>
                <Text preset={Text.preset.titleH3} style={style.phoneNumberText}>{this.props.inputNewPhoneNumberText}</Text>
                <View accessible={true} accessibilityLabel={'SignUpFormWithPhoneNumberRootView'} style={style.phoneInputView}>
                    <SGFormPicker accessible={true} accessibilityLabel={'ProfileScreenLikedRestoPicker'} single shadow mandatory language={(this.props.language).toUpperCase()} preset={SGFormPicker.preset.phoneNumber} optionList={this.countryPhoneCodePickerData} value={this.selectedCountryPhoneCode} onValueChange={(v) => { this._onPickerValueChange(v) }} />
                    <SGTextInput maxLength={SGHelperType.ArraymaxLength(2)} accessible={true} accessibilityLabel={'SignInFormWithPhoneNumberPhoneNumberPhoneTextInput'} dataType={TextInput.dataType.phone} onValueChange={(v) => { this._onSetPhoneNumber(v) }} shadow preset={SGTextInput.preset.default} value={this.phoneNumberInput} placeholder={'000000000'} style={{width: (w - 10 * p) * 0.735, height: w * 0.11,marginTop:3*p,marginLeft:p}}/>
                </View>
            </View>
        );
    }
}