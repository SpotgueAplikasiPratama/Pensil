import React from 'react';
import Core from '../../../core/core';
import { SGFormImagePicker } from '../../../core/form';
import MyTranslator from '../../lessons/locale/MyTranslator';
import EarnPointModel from '../model/EarnPointModel';

export class EarnPointForm extends Core.Form.SGBaseForm {

    createStyleSheet = (whp) => {
        const { StyleSheet } = Core;
        var { w, h, p } = whp;
        return StyleSheet.create({
            mainView1: { width: (w -2 * p), height: w ,justifyContent: 'center', borderRadius: 2 * p, borderWidth: w * 0.001, borderColor: 'rgb(100,100,100)', elevation: 1, shadowOpacity: 0.085, padding: 2 * p,  backgroundColor: 'white' },
            textInput: { backgroundColor:'#F6F4F4', width: w* 0.725, height: w * 0.1 },
            buttonAdd:{width: w*0.9, height: w *0.08, padding: 0, margin: 0, backgroundColor: '#FF2800', marginTop: 2*p , marginBottom: 4*p, borderRadius: 2*p, color:'white'},
            buttonAddImageStyle : { width : w * 0.04, height: w * 0.04, backgroundColor:'transparent'},
        });
    }

    constructor(props, context, ...args) {
        const { SGHelperGlobalVar } = Core.Helper
        super(props, context, ...args);
        this.whp = { w: props.style.width, h: props.style.height, p: props.style.padding }
        this.style = this.createStyleSheet(this.whp);
        this.currency = SGHelperGlobalVar.getVar('GlobalCurrency');
        this.dataReceipt = new EarnPointModel();
        this.fMemberKey = this.props.fMemberKey
        this.fUserKey = this.props.fUserKey
        this.initData(this.dataReceipt)
    }

    onCloseHandler() {
        const {SGPopView} = Core.Control
        SGPopView.hidePopView(this.props.popViewID);
    }

    _onAddPress(){
        this.dataReceipt.getCurrentJSON().fMemberKey = this.fMemberKey
        this.dataReceipt.getCurrentJSON().fUserKey = this.fUserKey
        this.dataReceipt.getCurrentJSON().fBuildingKey = this.fBuildingKey
        this.props.data.push(this.dataReceipt.getCurrentJSON())
        this.props.setDataReceipt(this.props.data)
        this.onCloseHandler()
    }


    render() {
        const { SGImagePicker, SGView, SGScrollView, SGText, SGTextInput} = Core.Control
        const { SGFormTextInput, SGFormDatePicker, SGFormImagePicker, SGFormPicker, SGFormButton } = Core.Form
        const {SGHelperType} = Core.Helper;
        var settingReceipt = this.props.setting
        var { w, h, p } = this.whp;
        var style = this.style;

        return (
            <SGView style={style.mainView1} >
                <SGScrollView accessible={true} accessibilityLabel={'CommentPopupRootView'}>
                    <SGFormTextInput dataType={SGTextInput.dataType.string} label={MyTranslator.tr('EarnPointForm.receiptNumberLabel')} placeholder={MyTranslator.tr('EarnPointForm.receiptNumberPlaceholder')} value={this.getData('fReceiptNumber')} onValueChange={(v) => { this.setData('fReceiptNumber', v)}} validator={this._data.getValidators('fReceiptNumber')} />
                    <SGFormImagePicker maxImageCount={1} label={MyTranslator.tr('EarnPointForm.receiptImageLabel')} noreview hideText ratio={SGImagePicker.ratio.r9x16} value={this.getData('fReceiptImage')} onValueChange={(v) => { this.setData('fReceiptImage', v)}} validator={this._data.getValidators('fReceiptImage')}></SGFormImagePicker>
                    <SGText>{MyTranslator.tr('EarnPointForm.minReceiptAmountLabel')}{this.currency + ' ' + SGHelperType.addThousandSeparator((this.props.setting.fReceiptMinAmount.toFixed(0)).toString())}</SGText>
                    <SGFormTextInput dataType={SGTextInput.dataType.currency} label={MyTranslator.tr('EarnPointForm.receiptAmountLabel')} placeholder={MyTranslator.tr('EarnPointForm.receiptAmountPlaceholder')} value={this.getData('fReceiptAmount')} onValueChange={(v) => { this.setData('fReceiptAmount', v)}} validator={this._data.getValidators('fReceiptAmount')}/>
                    <SGFormDatePicker dateRange={{ start: new Date(1900, 1, 1), end: new Date() }} label={MyTranslator.tr('EarnPointForm.receiptDateLabel')} value={this.getData('fReceiptDate')} onValueChange={(v) => { this.getData('fReceiptDate', v) }} validator={this._data.getValidators('fReceiptDate')}/>
                    
                    <SGFormPicker single label={MyTranslator.tr('EarnPointForm.storeName')} optionList={this.props.tenantPicker} value={this.getData('fStoreKey')} onValueChange={(v) => { this.setData('fStoreKey', v)}} validator={this._data.getValidators('fStoreKey')}/>
                    
                    <SGFormButton preset={SGFormButton.preset.b1} accessible={true} accessibilityLabel={''} onPress={this._onAddPress.bind(this)} label={MyTranslator.tr('EarnPointForm.addReceiptButton')} data={this.dataReceipt}></SGFormButton>
                    
                </SGScrollView>
            </SGView>
           
        );
    }
}