import React from 'react';
import { StyleSheet } from 'react-native';
import { SGBaseForm } from "../../core/container/SGBaseForm";
import { SGView as View, SGText as Text, SGTextInput as TextInput } from '../../core/control';
import { tbLookupDAO } from '../db/tbLookupDAO';
import { SGFormTextInput, SGFormSwitch, SGFormPicker, SGFormImagePicker, SGFormDatePicker } from '../../core/form';
import { SGHelperNavigation, SGHelperGlobalVar, SGHelperType, SGHelperStyle } from '../../core/helper';
import { CustomizationData, CustomizationCarCRUDList } from '../container_V2/CarCRUDCard';
import { VisitorHelper } from '../helper/VisitorHelper';
import { SGLocalize } from '../locales/SGLocalize';
import image from '../asset/image';

export class ChangeSecurityQuestionForm extends SGBaseForm {
    createStyleSheet = (whp) => {
        var { w, h, p } = whp;
        return StyleSheet.create({
            mainView1: { padding: p },
            throwWHP: { width: w, height: h, padding: p },
            text1: { color: '#909090', alignSelf: 'center', marginHorizontal: w * 0.01 },
            textView: { width: (w - 2 * p) * 0.8, },
            inputView1: { backgroundColor: 'white', flex: null, marginTop: w * 0.03, backgroundColor: 'white', width: (w - 2 * p) * 0.8, height: w * 0.15, borderRadius: 3 * p, borderWidth: p * 0.02, },
            input1: { backgroundColor: 'white', color: '#7a7a7a', paddingHorizontal: p * 2, fontSize: w * 0.0375 },
        });
    }
    constructor(props, context, ...args) {
        super(props, context, ...args);
        this.whp = { w: props.style.width, h: props.style.height, p: props.style.padding }
        this.style = this.createStyleSheet(this.whp);
        this.initData(this.props.userData);
        this.setData('fQuestionAnswer', '');
        this._language = SGHelperGlobalVar.getVar('GlobalLanguage')
        this.lookupSecurityQuestion = tbLookupDAO.getActiveLookUpByGroup('SecurityQuestion');
        this.securityQuestionPickerData = [];
       
    }

    _securityPickerData(){
        this.securityQuestionPickerData = [];
        for (var i = 0; i < this.lookupSecurityQuestion.length; i++) {
            var jsonPicker = { key: this.lookupSecurityQuestion[i].fLookUpKey, title: this.lookupSecurityQuestion[i].fLanguage[this._language.toLowerCase()] };
            this.securityQuestionPickerData.push(jsonPicker);
        }
    }

    render() {
        this.initData(this.props.userData);
        var { w, h, p } = this.whp;
        var style = this.style;
        this._securityPickerData();
       
        return (
            <View accessible={true} accessibilityLabel={'ChangeSecurityQuestionFormRootView'} style={style.mainView1}>
                <SGFormPicker accessible={true} accessibilityLabel={'UserProfileFormSecQuestionPicker'} single mandatory label={SGLocalize.translate('ChangeSecurityQuestionScreen.labelCurrentSecurityQuestion')} shadow optionList={this.securityQuestionPickerData} disabled value={this.props.oldSecurityQuestionKey} />
                <SGFormPicker accessible={true} accessibilityLabel={'UserProfileFormSecQuestionPicker'} single mandatory label={SGLocalize.translate('ChangeSecurityQuestionScreen.labelNewSecurityQuestion')} shadow optionList={this.securityQuestionPickerData} onValueChange={(v) => { this.setData('fSecurityQuestionKey', v)}} value={this.getData('fSecurityQuestionKey')} />
                <SGFormTextInput maxLength={SGHelperType.ArraymaxLength(3)} accessible={true} accessibilityLabel={'UserProfileFormSecQuestionTextInput'} shadow preset={SGFormTextInput.preset.default} dataType={TextInput.dataType.text} label={SGLocalize.translate('ChangeSecurityQuestionScreen.securityAnswer')}
                placeholder={SGLocalize.translate("ChangeSecurityQuestionScreen.securityAnswer1")} onValueChange={(v) => { this.setData('fQuestionAnswer', v) }} value={this.getData('fQuestionAnswer')} />
            </View>
        );
    }
}