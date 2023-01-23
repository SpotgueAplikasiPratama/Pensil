import React from 'react';
import { StyleSheet } from 'react-native';
import { SGBaseForm } from "../../core/container/SGBaseForm";
import { SGView as View, SGTextInput as TextInput, SGText as Text, SGTabView as TabView, SGPicker as Picker } from '../../core/control';
import { SGFormTextInput as FormTextInput } from '../../core/form'
import { SGHelperType } from '../../core/helper/SGHelperType';
import { SGLocalize } from '../locales/SGLocalize';
import { tbLookupDAO } from '../db/tbLookupDAO';
import image from '../asset/image';

export class SignInFormWithPhoneNumber extends SGBaseForm {

    createStyleSheet = (whp) => {
        var { w, h, p } = whp;
        return StyleSheet.create({
            mainView1: { marginVertical: 4 * p, justifyContent: 'flex-start' },
            phoneInputView: { flexDirection: 'row', justifyContent: 'flex-start', width: (w  - p * 2) * 0.8, marginBottom: p * 4 },
            // shadowOffset: { height: 10, width: -10 }
            input1: { color: '#7a7a7a'},
            picker: { width: (w - 2 * p) * 0.25, color: '#7a7a7a', marginRight: p * 2, marginVertical: 0},
            tabBarTextStyle: { color: '#606060' },
            tabBarStyle: { borderColor: '#c5c4bc', width: w * 0.4, borderBottomWidth: 0.0015 * w },
            phoneNumberInput: {width: (w - 4 * p) * 0.54, height: w * 0.112},
            textInput: {width: (w - 2 * p) * 0.8, marginBottom: p * 4, height: w * 0.112}
        });
    }

    constructor(props, context, ...args) {
        super(props, context, ...args);
        this.whp = { w: props.style.width, h: props.style.height, p: props.style.padding }
        this.style = this.createStyleSheet(this.whp);
        this.initData(this.props.userData);
        this.lookupCountryPhoneCode = tbLookupDAO.getActiveLookUpByGroup('CountryPhoneCode');
        this.countryPhoneCodePickerData = [];
        for (var i = 0; i < this.lookupCountryPhoneCode.length; i++) {
            var jsonPicker = { key: this.lookupCountryPhoneCode[i].fValueKey, title: this.lookupCountryPhoneCode[i].fLanguage[this.props.language], image: image[this.lookupCountryPhoneCode[i].fValueKey].med.url };
            this.countryPhoneCodePickerData.push(jsonPicker);
        }
        this.selectedCountryPhoneCode = '+62';
        this.phoneNumberInput = '';
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
            <View accessible={true} accessibilityLabel={'SignInFormWithPhoneNumberRootView'} style={style.mainView1}>
                <View accessible={true} accessibilityLabel={'SignUpFormWithPhoneNumberRootView'} style={style.phoneInputView}>
                    <Picker mandatory accessible={true} accessibilityLabel={'ProfileScreenLikedRestoPicker'} textPreset={Text.preset.titleH4} single language={(this.props.language).toUpperCase()} style={style.picker} optionList={this.countryPhoneCodePickerData} value={this.selectedCountryPhoneCode} onValueChange={(v) => { this._onPickerValueChange(v) }} />
                    <TextInput accessible={true} accessibilityLabel={'SignInFormWithPhoneNumberPhoneNumberPhoneTextInput'} dataType={TextInput.dataType.phone} onValueChange={(v) => { this.setData('fPhoneNumber', v); this.phoneNumberInput = v }} value={this.phoneNumberInput} placeholder={'000000000'} style={style.phoneNumberInput} textStyle={style.input1} />
                </View>
                <TextInput accessible={true} accessibilityLabel={'SignInFormPasswordTextInput'} dataType={TextInput.dataType.password} onValueChange={(v) => { this.setData('fPassword', v) }} value={this.getData('fPassword')} placeholder={'password'} style={style.textInput} textStyle={style.input1} />
            </View>

        );
    }
}