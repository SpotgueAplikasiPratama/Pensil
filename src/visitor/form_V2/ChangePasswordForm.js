import React from 'react';
import { StyleSheet } from 'react-native';
import { SGBaseForm } from "../../core/container/SGBaseForm";
import { SGView as View, SGText as Text, SGTextInput as TextInput } from '../../core/control';
import { SGFormTextInput } from '../../core/form';
import { SGHelperType } from '../../core/helper';


export class ChangePasswordForm extends SGBaseForm {
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
    }



    render() {
        this.initData(this.props.userData);
        var { w, h, p } = this.whp;
        var style = this.style;
        return (
            <View accessible={true} accessibilityLabel={'ChangePasswordFormRootView'} style={style.mainView1}>
                <SGFormTextInput maxLength={SGHelperType.ArraymaxLength(3)} preset={TextInput.preset.default} accessible={true} accessibilityLabel={'ChangePasswordFormPassTextInput'} shadow dataType={TextInput.dataType.password} onValueChange={(v) => { this.setData('fPassword', v) }} placeholder={this.props.placeholderPassword} validator={this._data.getValidators('fPassword')} />
                <View accessible={true} accessibilityLabel={'ChangePasswordFormView'} style={style.textView}><Text preset={Text.preset.titleH3} style={style.text1}>{this.props.NoteText}</Text></View>
                <SGFormTextInput maxLength={SGHelperType.ArraymaxLength(3)} preset={TextInput.preset.default} accessible={true} accessibilityLabel={'ChangePasswordFormConfirmPassTextInput'} shadow dataType={TextInput.dataType.password} onValueChange={(v) => { this.setData('fConfirmPassword', v) }} placeholder={this.props.placeholderConfirmPassword} validator={this._data.getValidators('fConfirmPassword')} />
            </View>
        );
    }
}