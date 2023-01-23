import React from 'react';
import { StyleSheet } from 'react-native';
import { SGBaseForm } from "../../core/container/SGBaseForm";
import { SGView as View, SGText as Text, SGTextInput as TextInput } from '../../core/control';
import { SGFormTextInput, SGFormPicker } from '../../core/form';
import { SGHelperType, SGHelperStyle } from '../../core/helper';
import { tbLookupDAO } from '../db/tbLookupDAO';
import { SGLocalize } from '../locales/SGLocalize';
import image from '../asset/image';
import {SGHelperGlobalVar} from '../../core/helper';

export class AddPhoneNumberForm extends SGBaseForm {
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
            phoneInputView: { flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'flex-start', width: w },
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
        this.setData('fPhoneNumber', '+62-');
        this.phoneNumberInput = this.getData('fPhoneNumber');
        this.selectedCountryPhoneCode = this.phoneNumberInput.substr(0, this.phoneNumberInput.indexOf('-'));
    }

    _onSetPhoneNumber(v) {
        var code = '';
        if (!(v.includes(this.selectedCountryPhoneCode))) {
            code = this.selectedCountryPhoneCode + '-';
        }
        this.setData('fPhoneNumber', code + v);
        this.phoneNumberInput = v
    }

    _onPickerValueChange(v) {
        this.selectedCountryPhoneCode = v;
        this.phoneNumberInput = this.selectedCountryPhoneCode + '-';
        this.forceUpdate();
    }

    render() {
        this.initData(this.props.userData);
        var { w, h, p } = this.whp;
        var style = this.style;
        return (
            <View accessible={true} accessibilityLabel={'AddPhoneNumberFormRootView'} style={style.mainView1}>
                <Text preset={Text.preset.titleH2B} style={style.phoneNumberText}>{this.props.inputNewPhoneNumberText}</Text>
                <View accessible={true} accessibilityLabel={'SignUpFormWithPhoneNumberRootView'} style={style.phoneInputView}>
                    <SGFormPicker accessible={true} accessibilityLabel={'ProfileScreenLikedRestoPicker'} single  mandatory language={(this.props.language).toUpperCase()} preset={SGFormPicker.preset.phoneNumber} optionList={this.countryPhoneCodePickerData} value={this.selectedCountryPhoneCode} onValueChange={(v) => { this._onPickerValueChange(v) }} />
                    <SGFormTextInput maxLength={SGHelperType.ArraymaxLength(2)} accessible={true} accessibilityLabel={'SignInFormWithPhoneNumberPhoneNumberPhoneTextInput'} dataType={TextInput.dataType.phone} onValueChange={(v) => { this._onSetPhoneNumber(v) }} preset={SGFormTextInput.preset.phoneNumber} value={this.phoneNumberInput} placeholder={'000000000'} />
                </View>
            </View>
        );
    }
}