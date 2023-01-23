import React from 'react';
import Core from '../../../core/core';
import MyTranslator from '../../lessons/locale/MyTranslator';


export default class EarnPointModel extends Core.Model.SGBaseModel {
    static getBlankJSON() {
        return {
            fID:'',
            fEarnPointKey:'',
            fMemberKey:'',
            fBuildingKey:'',
            fStoreKey:'',
            fUserKey:'',
            fReceiptNumber:'',
            fReceiptImage:[],
            fReceiptAmount:'',
            fReceiptDate: new Date(),
            fValidDate: new Date(),
            fActive:'',
            fReceipt:[],
            fMaxDate: new Date()
            };
                
    }
    constructor(ori, cur, changeList) {
        super(EarnPointModel, ori ? ori : EarnPointModel.getBlankJSON(), cur, changeList);
        const {SGHelperType, SGHelperGlobalVar, SGHelperStringValidator, SGHelperRangeValidator, SGHelperFieldValidator} = Core.Helper;
        var settingReceipt = SGHelperGlobalVar.getVar('EarnPointSetting')
        var date = new Date()
        var maxDate = new Date(date.getFullYear(), date.getMonth(), date.getDate() - settingReceipt.fMaxReceiptDay)
        this._setValue('fMaxDate', maxDate)

        if(settingReceipt.fReceiptMinAmount > 0){
            this.addValidator('fReceiptNumber',  new SGHelperStringValidator(SGHelperType.stringType.string, true, 1, MyTranslator.tr('EarnPointForm.receiptNumberValidator')));
            this.addValidator('fReceiptImage', new SGHelperStringValidator(SGHelperType.stringType.string, true, 1, MyTranslator.tr('EarnPointForm.receiptImageValidator')));
            this.addValidator('fReceiptAmount', new SGHelperRangeValidator(SGHelperType.stringType.decimal, true, MyTranslator.tr('EarnPointForm.receiptAmountValidator'), settingReceipt.fReceiptMinAmount ));
            this.addValidator('fStoreKey',  new SGHelperStringValidator(SGHelperType.stringType.string, true, 0, MyTranslator.tr('EarnPointForm.storeNameValidator')));  
            this.addValidator('fReceiptDate', new SGHelperFieldValidator(SGHelperType.stringType.date, SGHelperFieldValidator.operator.greaterThanOrEqual, this, 'fMaxDate', SGHelperFieldValidator.nullRule.bothNullReturnTrue, MyTranslator.tr('EarnPointForm.receiptDateValidator')))
        }
    }

    get fID() { return this._getValue('fID'); }
    set fID(val) { this._setValue('fID', val); }
    get fMemberKey() { return this._getValue('fMemberKey'); }
    set fMemberKey(val) { this._setValue('fMemberKey', val); }
    get fBuildingKey() { return this._getValue('fBuildingKey'); }
    set fBuildingKey(val) { this._setValue('fBuildingKey', val); }
    get fStoreKey() { return this._getValue('fStoreKey'); }
    set fStoreKey(val) { this._setValue('fStoreKey', val); }
    get fUserKey() { return this._getValue('fUserKey'); }
    set fUserKey(val) { this._setValue('fUserKey', val); }
    get fReceiptNumber() { return this._getValue('fReceiptNumber'); }
    set fReceiptNumber(val) { this._setValue('fReceiptNumber', val); }
    get fReceiptImage() { return this._getValue('fReceiptImage'); }
    set fReceiptImage(val) { this._setValue('fReceiptImage', val); }
    get fReceiptAmount() { return this._getValue('fReceiptAmount'); }
    set fReceiptAmount(val) { this._setValue('fReceiptAmount', val); }
    get fReceiptDate() { return this._getValue('fReceiptDate'); }
    set fReceiptDate(val) { this._setValue('fReceiptDate', val); }
    get fValidDate() { return this._getValue('fValidDate'); }
    set fValidDate(val) { this._setValue('fValidDate', val); }
    get fActive() { return this._getValue('fActive'); }
    set fActive(val) { this._setValue('fActive', val); }
    get fReceipt() { return this._getValue('fActive'); }
    set fReceipt(val) { this._setValue('fActive', val); }
    get fMaxDate() { return this._getValue('fMaxDate'); }
    set fMaxDate(val) { this._setValue('fMaxDate', val); }
}