// import { RealmDB } from './RealmDB.js';
import { SGBaseModel } from '../../core/model/SGBaseModel';

export class tbVUserxOrderTableData extends SGBaseModel {
    static getBlankJSON() {
        return { fID: '', fUserID: '', fOrderTableID: '', fCreatedBy: '', fCreatedByID: '', fCreatedDate: new Date(), fLastModifiedBy: '', fLastModifiedByID: '', fLastModifiedDate: new Date() };
    }
    constructor(ori, cur, changeList) {
        super(tbVUserxOrderTableData, ori ? ori : tbVUserxOrderTableData.getBlankJSON(), cur, changeList);
    }
    set fID(val) { this._setValue('fID', val); } get fID() { return this._getValue('fID'); }
    set fUserID(val) { this._setValue('fUserID', val); } get fUserID() { return this._getValue('fUserID'); }
    set fOrderTableID(val) { this._setValue('fOrderTableID', val); } get fOrderTableID() { return this._getValue('fOrderTableID'); }
    set fCreatedBy(val) { this._setValue('fCreatedBy', val); } get fCreatedBy() { return this._getValue('fCreatedBy'); }
    set fCreatedByID(val) { this._setValue('fCreatedByID', val); } get fCreatedByID() { return this._getValue('fCreatedByID'); }
    set fCreatedDate(val) { this._setValue('fCreatedDate', val); } get fCreatedDate() { return this._getValue('fCreatedDate'); }
    set fLastModifiedBy(val) { this._setValue('fLastModifiedBy', val); } get fLastModifiedBy() { return this._getValue('fLastModifiedBy'); }
    set fLastModifiedByID(val) { this._setValue('fLastModifiedByID', val); } get fLastModifiedByID() { return this._getValue('fLastModifiedByID'); }
    set fLastModifiedDate(val) { this._setValue('fLastModifiedDate', val); } get fLastModifiedDate() { return this._getValue('fLastModifiedDate'); }
}



