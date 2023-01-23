import React from 'react';
import { StyleSheet } from 'react-native';
import { SGBaseForm } from "../../core/container/SGBaseForm";
import { SGView as View, SGTouchableOpacity as TouchableOpacity, SGIcon as Icon, SGTextInput as TextInput, SGText as Text, SGDialogBox } from "../../core/control";
import { SGLocalize } from '../locales/SGLocalize';
import { SGFormTextInput,SGFormPicker } from '../../core/form';
import {SGHelperType,SGHelperGlobalVar} from '../../core/helper';
import { tbLookupDAO } from '../db/tbLookupDAO';

export class InputOrderDataForm extends SGBaseForm {
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
        this._language = SGHelperGlobalVar.getVar('GlobalLanguage')
        this.lookUpOrderType = tbLookupDAO.getActiveLookUpByGroup('OrderType');
        this.orderTypePickerData = [];
    }


    _checkUserDataName() {
        var userData = this.props.userData;
        if (userData.fName !== '') {
            var res = userData.fName
            this.setData('fOrderName', userData.fName)
        }
        else {
            var res = this.getData('fOrderName')
        }
        return res
    }


    _orderTypeData(){
        this.orderTypePickerData = [];
        for (var i = 0; i < this.lookUpOrderType.length; i++) {
            var jsonPicker = { key: this.lookUpOrderType[i].fLookUpKey, title: this.lookUpOrderType[i].fLanguage[this._language.toLowerCase()] };
            this.orderTypePickerData.push(jsonPicker);
        }
    }

    render() {
        this.initData(this.props.data)
        var style = this.style;
        var disabled = this.props.disabled;
        var tR = SGLocalize.translate;
        this._orderTypeData();
        return (
            <View accessible={true} accessibilityLabel={'InputOrderDataFormRootView'} style={style.mainView1}>

                <SGFormTextInput maxLength={SGHelperType.ArraymaxLength(2)} disabled={true} accessible={true} accessibilityLabel={'InputOrderDataFormTableNumberInput'} shadow preset={SGFormTextInput.preset.default} dataType={TextInput.dataType.text} label={SGLocalize.translate('inputDataOrderMenuScreen.TableKey')}
                    onValueChange={(v) => { this.setData('fTableKey', v) }} value={this.getData('fTableKey')} />

                <SGFormTextInput maxLength={SGHelperType.ArraymaxLength(2)} disabled={true} accessible={true} accessibilityLabel={'InputOrderDataFormNameInput'} shadow preset={SGFormTextInput.preset.default} dataType={TextInput.dataType.text} label={SGLocalize.translate('inputDataOrderMenuScreen.tableNumber')}
                    onValueChange={(v) => { this.setData('fTableNumber', v) }} value={this.getData('fTableNumber')} validator={this._data.getValidators('fTableNumber')} />

                <SGFormTextInput maxLength={SGHelperType.ArraymaxLength(2)} accessible={true} accessibilityLabel={'InputOrderDataFormNameInput'} disabled={disabled} shadow preset={SGFormTextInput.preset.default} dataType={TextInput.dataType.text} label={SGLocalize.translate('inputDataOrderMenuScreen.nameLabel')}
                    placeholder={SGLocalize.translate('inputDataOrderMenuScreen.namePlaceholder')} onValueChange={(v) => { this.setData('fOrderName', v) }} value={this._checkUserDataName()} validator={this._data.getValidators('fOrderName')} />
                <SGFormTextInput maxLength={SGHelperType.ArraymaxLength(1)} accessible={true} accessibilityLabel={'InputOrderDataFormNumbPersonInput'} disabled={disabled} shadow preset={SGFormTextInput.preset.default} dataType={TextInput.dataType.number} label={SGLocalize.translate('inputDataOrderMenuScreen.personLabel')}
                    placeholder={SGLocalize.translate('inputDataOrderMenuScreen.personPlaceholder')} onValueChange={(v) => { this.setData('fNumberOfPerson', v) }} value={this.getData('fNumberOfPerson')} validator={this._data.getValidators('fNumberOfPerson')} />
                <SGFormPicker single accessible={true} accessibilityLabel={'formPicker'} disabled={disabled} label={tR('inputDataOrderMenuScreen.fOrderType')} value={this.getData('fOrderType')}
                    onValueChange={(v) => { this.setData('fOrderType', v) }} optionList={this.orderTypePickerData} />

            </View>
        );
    }
}
