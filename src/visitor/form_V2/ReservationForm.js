import React from 'react';
import { StyleSheet } from 'react-native';
import { SGBaseForm } from "../../core/container/SGBaseForm";
import { SGView as View, SGText as Text, SGTextInput as TextInput } from "../../core/control";
import { SGLocalize } from '../locales/SGLocalize';
import { SGFormTextInput, SGFormDatePicker, SGFormTimePicker } from '../../core/form';
import { SGHelperType } from '../../core/helper';

export class ReservationForm extends SGBaseForm {
    createStyleSheet = (whp) => {
        var { w, h, p } = whp;
        return StyleSheet.create({
            mainView1: { padding: p }
        });
    }
    constructor(props, context, ...args) {
        super(props, context, ...args);
        this.initData(this.props.data)
        this.whp = { w: props.style.width, h: props.style.height, p: props.style.padding }
        this.style = this.createStyleSheet(this.whp);
    }

    _checkUserDataName() {
        if (this.props.screenAdd === true) {
            var userData = this.props.userData;
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
        if (this.props.screenAdd === true) {
            var userData = this.props.userData;
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
        this.initData(this.props.data)
        var style = this.style;
        var date = new Date();
        var tR = SGLocalize.translate;
        var disabled = this.props.disabled;
        var userData = this.props.userData;
        var language = this.props.language.toUpperCase();
       
        return (
            <View style={style.mainView1}>
                <SGFormDatePicker language={language} accessible={true} accessibilityLabel={'ReservationFormDatePicker'} label={tR('ReservationAddView.SelectDateText')} disabled={disabled}  preset={SGFormTextInput.preset.default} onValueChange={(v) => { this.setData('fBookDate', v);this.props.callback() }} value={date} dateRange={{ start: new Date(), end: new Date(date.getFullYear() + 5, date.getMonth(), date.getDate(), 23, 59, 59) }} />
                <SGFormTimePicker accessible={true} accessibilityLabel={'ReservationFormTimePicker'} label={tR('ReservationAddView.SelectTimeText')} disabled={disabled}  preset={SGFormTextInput.preset.default} onValueChange={(v) => { this.setData('fBookTime', v) }} value={SGHelperType.convertNewDate(this.getData('fBookTime'))} />
                <SGFormTextInput maxLength={SGHelperType.ArraymaxLength(2)} accessible={true} accessibilityLabel={'ReservationFormTextInputName'} label={tR('ReservationAddView.Name')} disabled={disabled}  preset={SGFormTextInput.preset.default} dataType={TextInput.dataType.text} placeholder={tR('ReservationAddView.placeholderName')} onValueChange={(v) => { this.setData('fName', v) }} value={this._checkUserDataName()} validator={this._data.getValidators('fName')} />
                <SGFormTextInput maxLength={SGHelperType.ArraymaxLength(2)} accessible={true} accessibilityLabel={'ReservationFormTextInputNumbPhone'} label={tR('ReservationAddView.NumberPhone')} disabled={disabled}  preset={SGFormTextInput.preset.default} dataType={TextInput.dataType.phone} placeholder={tR('ReservationAddView.placeholderNumberPhone')} onValueChange={(v) => { this.setData('fNumberPhone', v) }} value={this._checkUserDataPhoneNumber()} validator={this._data.getValidators('fNumberPhone')} />
                <SGFormTextInput maxLength={SGHelperType.ArraymaxLength(1)} accessible={true} accessibilityLabel={'ReservationFormTextInputNumbPerson'} label={tR('ReservationAddView.NumberofPerson')} disabled={disabled}  preset={SGFormTextInput.preset.default} dataType={TextInput.dataType.number} placeholder={tR('ReservationAddView.placeholderNumberOfPerson')} onValueChange={(v) => { this.setData('fNumberOfPerson', v) }} value={this.getData('fNumberOfPerson')} validator={this._data.getValidators('fNumberOfPerson')} />
                <SGFormTextInput maxLength={SGHelperType.ArraymaxLength(3)} accessible={true} accessibilityLabel={'ReservationFormTextInputNotes'} label={tR('ReservationAddView.Notes')} disabled={disabled}  preset={SGFormTextInput.preset.default} dataType={TextInput.dataType.multiline} placeholder={tR('ReservationAddView.placeholderNotes')} onValueChange={(v) => { this.setData('fNotes', v) }} value={this.getData('fNotes')} validator={this._data.getValidators('fNotes')} />
            </View>
        );
    }
}
