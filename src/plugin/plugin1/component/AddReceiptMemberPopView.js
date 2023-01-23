import React from 'react';
import Core from '../../../core/core'
import MyTranslator from '../../lessons/locale/MyTranslator';

const {SGView, SGTextInput, SGPopView, SGImageButton, SGText, SGImagePicker, SGScrollView} = Core.Control
const {SGHelperGlobalVar, SGHelperStringValidator, SGHelperRangeValidator } = Core.Helper
const {SGFormTextInput, SGFormButton, SGFormImagePicker, SGFormDatePicker, SGFormPicker} = Core.Form

export class AddReceiptMemberPopViewData extends Core.Model.SGBaseModel {
    static getBlankJSON() {
        return { 
            fID: '', fEarnPointKey: null, fMemberKey: '', fBuildingKey: '',
            fStoreKey: '', fUserKey: '', fReceiptNumber: '', fReceiptImage: [], fReceiptAmount: 0, fReceiptDate: new Date(),
            fValidDate: new Date(), fActive: 'Y', fCreatedByID: '', fCreatedDate: new Date(), fLastModifiedByID: '', fLastModifiedDate: new Date(),  fMaxDate: new Date()
        };
    }
    constructor(ori, cur, changeList) {
        const {SGHelperType,SGHelperFieldValidator,SGHelperRangeValidator,SGHelperStringValidator} = Core.Helper;
        super(AddReceiptMemberPopViewData, ori ? ori : AddReceiptMemberPopViewData.getBlankJSON(), cur, changeList);
        var settingReceipt = SGHelperGlobalVar.getVar('NewRegistrationSetting')
        var date = new Date()
        var maxDate = new Date(date.getFullYear(), date.getMonth(), date.getDate() - settingReceipt.fMaxReceiptDay)
        this._setValue('fMaxDate', maxDate)

        //setting new regis
        if(settingReceipt.fNewRegistrationMinAmount > 0){
            this.addValidator('fReceiptNumber',  new SGHelperStringValidator(SGHelperType.stringType.string, true, 1, MyTranslator.tr('EarnPointForm.receiptNumberValidator')));
            this.addValidator('fReceiptImage', new SGHelperStringValidator(SGHelperType.stringType.string, true, 1, MyTranslator.tr('EarnPointForm.receiptImageValidator')));
            this.addValidator('fReceiptAmount', new SGHelperRangeValidator(SGHelperType.stringType.decimal, true, MyTranslator.tr('EarnPointForm.receiptAmountValidator'), settingReceipt.fNewRegistrationMinAmount));
            this.addValidator('fStoreKey',  new SGHelperStringValidator(SGHelperType.stringType.string, true, 0, MyTranslator.tr('EarnPointForm.storeNameValidator')));  
            this.addValidator('fReceiptDate', new SGHelperFieldValidator(SGHelperType.stringType.date, SGHelperFieldValidator.operator.greaterThanOrEqual, this, 'fMaxDate', SGHelperFieldValidator.nullRule.bothNullReturnTrue, MyTranslator.tr('EarnPointForm.receiptDateValidator')))
        }
    }
    
    set fID(val) { this._setValue('fID', val); } get fID() { return this._getValue('fID'); }
    set fEarnPointKey(val) { this._setValue('fEarnPointKey', val); } get fEarnPointKey() { return this.fEarnPointKey('fQuestion'); }
    set fMemberKey(val) { this._setValue('fMemberKey', val); } get fMemberKey() { return this._getValue('fMemberKey'); }
    set fBuildingKey(val) { this._setValue('fBuildingKey', val); } get fBuildingKey() { return this._getValue('fBuildingKey'); }
    set fStoreKey(val) { this._setValue('fStoreKey', val); } get fStoreKey() { return this._getValue('fStoreKey'); }
    set fUserKey(val) { this._setValue('fUserKey', val); } get fUserKey() { return this._getValue('fUserKey'); }
    set fReceiptNumber(val) { this._setValue('fReceiptNumber', val); } get fReceiptNumber() { return this._getValue('fReceiptNumber'); }
    set fReceiptImage(val) { this._setValue('fReceiptImage', val); } get fReceiptImage() { return this._getValue('fReceiptImage'); }
    set fReceiptAmount(val) { this._setValue('fReceiptAmount', val); } get fReceiptAmount() { return this._getValue('fReceiptAmount'); }
    set fReceiptDate(val) { this._setValue('fReceiptDate', val); } get fReceiptDate() { return this._getValue('fReceiptDate'); }
    set fValidDate(val) { this._setValue('fValidDate', val); } get fValidDate() { return this._getValue('fValidDate'); }
    set fActive(val) { this._setValue('fActive', val); } get fActive() { return this._getValue('fActive'); }
    set fCreatedByID(val) { this._setValue('fCreatedByID', val); } get fCreatedByID() { return this._getValue('fCreatedByID'); }
    set fCreatedDate(val) { this._setValue('fCreatedDate', val); } get fCreatedDate() { return this._getValue('fCreatedDate'); }
    set fLastModifiedByID(val) { this._setValue('fLastModifiedByID', val); } get fLastModifiedByID() { return this._getValue('fLastModifiedByID'); }
    set fLastModifiedDate(val) { this._setValue('fLastModifiedDate', val); } get fLastModifiedDate() { return this._getValue('fLastModifiedDate'); }
    get fMaxDate() { return this._getValue('fMaxDate'); }
    set fMaxDate(val) { this._setValue('fMaxDate', val); }

}

export class AddReceiptMemberPopView extends Core.Form.SGBaseForm {

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
        super(props, context, ...args);
        this.whp = { w: props.style.width, h: props.style.height, p: props.style.padding }
        this.style = this.createStyleSheet(this.whp);
        this.dataReceipt = new AddReceiptMemberPopViewData()
        this.currency = SGHelperGlobalVar.getVar('GlobalCurrency');
        this.initData(this.dataReceipt);
        this.imageSetting = SGHelperGlobalVar.getVar('GlobalImageSetting');
    }

    onCloseHandler() {
        SGPopView.hidePopView(this.props.popViewID);
    }

    _onAddPress(){
        this.props.data.push(this.dataReceipt.getCurrentJSON())
        this.props.setDataReceipt(this.props.data)
        this.onCloseHandler()
        
    }

    render() {
        const {SGHelperType} = Core.Helper;
        var settingReceipt = SGHelperGlobalVar.getVar('NewRegistrationSetting')
        var { w, h, p } = this.whp;
        var style = this.style;
        return (
            <SGView style={style.mainView1} >
                <SGScrollView accessible={true} accessibilityLabel={'CommentPopupRootView'}>
                    <SGFormTextInput dataType={SGTextInput.dataType.string} label={MyTranslator.tr('EarnPointForm.receiptNumberLabel')} placeholder={MyTranslator.tr('EarnPointForm.receiptNumberPlaceholder')} value={this.getData('fReceiptNumber')} onValueChange={(v) => { this.setData('fReceiptNumber', v)}} validator={this._data.getValidators('fReceiptNumber')} />
                    <SGFormImagePicker maxImageCount={1} label={MyTranslator.tr('EarnPointForm.receiptImageLabel')} noreview hideText ratio={SGImagePicker.ratio.r9x16} value={this.getData('fReceiptImage')} onValueChange={(v) => { this.setData('fReceiptImage', v)}} validator={this._data.getValidators('fReceiptImage')}></SGFormImagePicker>
                    <SGText>{MyTranslator.tr('EarnPointForm.minReceiptAmountLabel')}{this.currency + ' ' + SGHelperType.addThousandSeparator((settingReceipt.fNewRegistrationMinAmount.toFixed(0)).toString())}</SGText>

                    <SGFormTextInput dataType={SGTextInput.dataType.currency} label={MyTranslator.tr('EarnPointForm.receiptAmountLabel')} placeholder={MyTranslator.tr('EarnPointForm.receiptAmountPlaceholder')} value={this.getData('fReceiptAmount')} onValueChange={(v) => { this.setData('fReceiptAmount', v)}} validator={this._data.getValidators('fReceiptAmount')}/>
                    <SGFormDatePicker dateRange={{ start: new Date(1900, 1, 1), end: new Date() }} label={MyTranslator.tr('EarnPointForm.receiptDateLabel')} value={this.getData('fReceiptDate')} onValueChange={(v) => { this.getData('fReceiptDate', v) }} validator={this._data.getValidators('fReceiptDate')}/>
                    
                    <SGFormPicker single label={MyTranslator.tr('EarnPointForm.storeName')} optionList={this.props.tenantPicker} value={this.getData('fStoreKey')} onValueChange={(v) => { this.setData('fStoreKey', v)}} validator={this._data.getValidators('fStoreKey')}/>
                    
                    <SGFormButton preset={SGFormButton.preset.b1} accessible={true} accessibilityLabel={''} onPress={this._onAddPress.bind(this)} label={MyTranslator.tr('EarnPointForm.addReceiptButton')} data={this.dataReceipt}></SGFormButton>
                    {/* <ImageButton source={ {uri: image.iconAdd[this.props.imageSetting].url} }  style={style.buttonAdd} imageStyle={style.buttonAddImageStyle} textPreset={Text.preset.h7} label={tR('CommunityRaceItemForm.AddRaceFlowButton')} onPress={this._onAddPress.bind(this)}></ImageButton> */}
                </SGScrollView>
            </SGView>
           
        );
    }
}