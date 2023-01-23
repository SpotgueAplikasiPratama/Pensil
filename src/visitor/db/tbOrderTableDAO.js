// import { RealmDB } from './RealmDB.js';
import { SGHelperType, SGHelperDB } from '../../core/helper'
import { SGBaseModel } from '../../core/model/SGBaseModel';
import { SGHelperStringValidator, SGHelperFieldValidator, SGHelperRangeValidator } from '../../core/helper/SGHelperValidator';
import { SGLocalize } from '../locales/SGLocalize';

export class tbOrderTableData extends SGBaseModel {
    static getBlankJSON() {
        return {
            fID: '', fTableKey: '', fStoreKey: '', fTableNumber: '', fOrderName: '', fNumberOfPerson: 1, fOrderTime: new Date(), fOrderDate: new Date(),
            fOrderDateTime: new Date(0), fTotalPrice: 0, fStatus: '', fComment: '', fSearchKeyID: '',
            fSearchKeyEN: '', fSearchKeyCN: '', fCreatedBy: '',
            fCreatedDate: new Date(), fLastModifiedBy: '', fLastModifiedDate: new Date(),
            fDiscountPrice:0,fDiscountDescription:'',fTaxPercentage:0,fTaxPrice:0,fServicePercentage:0,fServicePrice:0,fOrderType:'DineIn'
        };
    }
    constructor(ori, cur, changeList) {
        var limit = SGHelperType.getSystemParamsValue('LimitOrderMenu');
        super(tbOrderTableData, ori ? ori : tbOrderTableData.getBlankJSON(), cur, changeList);
        this.addValidator('fTableNumber', new SGHelperStringValidator(SGHelperType.stringType.string, true, 1, SGLocalize.translate('OrderTableDBModel.TableNumber')));
        this.addValidator('fOrderName', new SGHelperStringValidator(SGHelperType.stringType.string, true, 1, SGLocalize.translate('OrderTableDBModel.OrderName')));
        this.addValidator('fNumberOfPerson', new SGHelperRangeValidator(SGHelperType.stringType.number, true, SGLocalize.translate('OrderTableDBModel.NumberOfPerson'), 1, limit));
    }
    set fID(val) { this._setValue('fID', val); } get fID() { return this._getValue('fID'); }
    set fTableKey(val) { this._setValue('fTableKey', val); } get fTableKey() { return this._getValue('fTableKey'); }
    set fStoreKey(val) { this._setValue('fStoreKey', val); } get fStoreKey() { return this._getValue('fStoreKey'); }
    set fTableNumber(val) { this._setValue('fTableNumber', val); } get fTableNumber() { return this._getValue('fTableNumber'); }
    set fOrderName(val) { this._setValue('fOrderName', val); } get fOrderName() { return this._getValue('fOrderName'); }
    set fNumberOfPerson(val) { this._setValue('fNumberOfPerson', val); } get fNumberOfPerson() { return this._getValue('fNumberOfPerson'); }
    set fOrderTime(val) { this._setValue('fOrderTime', val); } get fOrderTime() { return this._getValue('fOrderTime'); }
    set fOrderDate(val) { this._setValue('fOrderDate', val); } get fOrderDate() { return this._getValue('fOrderDate'); }
    set fOrderDateTime(val) { this._setValue('fOrderDateTime', val); } get fOrderDateTime() { return this._getValue('fOrderDateTime'); }
    set fTotalPrice(val) { this._setValue('fTotalPrice', val); } get fTotalPrice() { return this._getValue('fTotalPrice'); }
    set fStatus(val) { this._setValue('fStatus', val); } get fStatus() { return this._getValue('fStatus'); }
    set fComment(val) { this._setValue('fComment', val); } get fComment() { return this._getValue('fComment'); }
    set fSearchKeyID(val) { this._setValue('fSearchKeyID', val); } get fSearchKeyID() { return this._getValue('fSearchKeyID'); }
    set fSearchKeyEN(val) { this._setValue('fSearchKeyEN', val); } get fSearchKeyEN() { return this._getValue('fSearchKeyEN'); }
    set fSearchKeyCN(val) { this._setValue('fSearchKeyCN', val); } get fSearchKeyCN() { return this._getValue('fSearchKeyCN'); }
    set fCreatedBy(val) { this._setValue('fCreatedBy', val); } get fCreatedBy() { return this._getValue('fCreatedBy'); }
    set fCreatedDate(val) { this._setValue('fCreatedDate', val); } get fCreatedDate() { return this._getValue('fCreatedDate'); }
    set fLastModifiedBy(val) { this._setValue('fLastModifiedBy', val); } get fLastModifiedBy() { return this._getValue('fLastModifiedBy'); }
    set fLastModifiedDate(val) { this._setValue('fLastModifiedDate', val); } get fLastModifiedDate() { return this._getValue('fLastModifiedDate'); }

    set fDiscountPrice(val) { this._setValue('fDiscountPrice', val); } get fDiscountPrice() { return this._getValue('fDiscountPrice'); }
    set fDiscountDescription(val) { this._setValue('fDiscountDescription', val); } get fDiscountDescription() { return this._getValue('fDiscountDescription'); }
    set fTaxPercentage(val) { this._setValue('fTaxPercentage', val); } get fTaxPercentage() { return this._getValue('fTaxPercentage'); }
    set fTaxPrice(val) { this._setValue('fTaxPrice', val); } get fTaxPrice() { return this._getValue('fTaxPrice'); }
    set fServicePercentage(val) { this._setValue('fServicePercentage', val); } get fServicePercentage() { return this._getValue('fServicePercentage'); }
    set fServicePrice(val) { this._setValue('fServicePrice', val); } get fServicePrice() { return this._getValue('fServicePrice'); }

    set fOrderType(val) { this._setValue('fOrderType', val); } get fOrderType() { return this._getValue('fOrderType'); }
    
}

export class tbOrderTableDAO {

}