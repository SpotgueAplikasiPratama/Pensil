import React from 'react';
import { StyleSheet } from 'react-native';
import { SGBaseForm } from "../../core/container/SGBaseForm";
import { SGView as View, SGTextInput as TextInput } from "../../core/control";
import { SGLocalize } from '../locales/SGLocalize';
import { SGFormTextInput } from '../../core/form';
import {SGHelperType} from '../../core/helper';

export class WaitingListForm extends SGBaseForm {
    createStyleSheet = (whp) => {
        var { w, h, p } = whp;
        return StyleSheet.create({
            mainView1: { padding: p, backgroundColor: "white" }
        });
    }
    constructor(props, context, ...args) {
        super(props, context, ...args);
        this.whp = { w: props.style.width, h: props.style.height, p: props.style.padding }
        this.style = this.createStyleSheet(this.whp);
        this.initData(this.props.data);
    }

    _checkUserDataName() {
        var userData = this.props.userData;
        if (this.props.addScreen == true) {
            if (userData.fName !== '') {
                var res = userData.fName
                this.setData('fName', userData.fName)
            }
            else {
                var res = this.getData('fName')
            }
        } else {
            var res = this.getData('fName')
        }
        return res
    }

    _checkUserDataPhoneNumber() {
        var userData = this.props.userData;
        if (this.props.addScreen == true) {
            if (userData.fPhoneNumber !== '') {
                var res = userData.fPhoneNumber
                this.setData('fNumberPhone', userData.fPhoneNumber)
            }
            else {
                var res = this.getData('fNumberPhone')
            }
        } else {
            var res = this.getData('fNumberPhone')
        }
        return res;
    }

    render() {
        this.initData(this.props.data);
        var { w, h, p } = this.whp;
        var style = this.style;
        var tR = SGLocalize.translate;
        var disabled = this.props.disabled;
        return (
            <View style={style.mainView1}>
                <SGFormTextInput maxLength={SGHelperType.ArraymaxLength(2)} accessible={true} accessibilityLabel={'WaitingListFormTextInputName'} disabled={disabled} shadow preset={SGFormTextInput.preset.default} dataType={TextInput.dataType.text} label={tR('WaitingListAddView.Name')} placeholder={tR('WaitingListAddView.placeholderName')} onValueChange={(v) => { this.setData('fName', v) }} value={this._checkUserDataName()} validator={this._data.getValidators('fName')} />
                <SGFormTextInput maxLength={SGHelperType.ArraymaxLength(2)} accessible={true} accessibilityLabel={'WaitingListFormTextInputNumbPhone'} disabled={disabled} shadow preset={SGFormTextInput.preset.default} dataType={TextInput.dataType.phone} label={tR('WaitingListAddView.NumberPhone')} placeholder={tR('WaitingListAddView.placeholderNumberPhone')} onValueChange={(v) => { this.setData('fNumberPhone', v) }} value={this._checkUserDataPhoneNumber()} validator={this._data.getValidators('fNumberPhone')} />
                <SGFormTextInput maxLength={SGHelperType.ArraymaxLength(1)} accessible={true} accessibilityLabel={'WaitingListFormTextInputNumbPerson'} disabled={disabled} shadow preset={SGFormTextInput.preset.default} dataType={TextInput.dataType.number} label={tR('WaitingListAddView.NumberofPerson')} placeholder={tR('WaitingListAddView.placeholderNumberOfPerson')} onValueChange={(v) => { this.setData('fNumberOfPerson', v) }} value={this.getData('fNumberOfPerson')} validator={this._data.getValidators('fNumberOfPerson')} />
                <SGFormTextInput maxLength={SGHelperType.ArraymaxLength(3)} accessible={true} accessibilityLabel={'WaitingListFormTextInputNotes'} disabled={disabled} shadow preset={SGFormTextInput.preset.default} dataType={TextInput.dataType.multiline} label={tR('WaitingListAddView.Notes')} placeholder={tR('WaitingListAddView.placeholderNotes')} onValueChange={(v) => { this.setData('fNotes', v) }} value={this.getData('fNotes')} validator={this._data.getValidators('fNotes')} />
            </View>
        );
    }
}
