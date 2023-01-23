// import { RealmDB, tbUserSearchHistoryData as tbUserSearchHistoryRealm } from './RealmDB';
import { SGHelperType } from '../../core/helper';
import { SGBaseModel } from '../../core/model/SGBaseModel';

export class tbUserSearchHistoryDAO {

}

export class tbUserSearchHistoryData extends SGBaseModel {
    static getBlankJSON() {
        return { fID: '', fUserKey: '', fLanguage: '', fKeyword: '', fActive: 'Y', fCreatedBy: '', fCreatedDate: new Date(), fLastModifiedBy: '', fLastModifiedDate: new Date() };
    }
    constructor(ori, cur, changeList) {
        super(tbUserSearchHistoryData, ori ? ori : tbUserSearchHistoryData.getBlankJSON(), cur, changeList);
    }
    set fID(val) { this._setValue('fID', val); } get fID() { return this._getValue('fID'); }
    set fUserKey(val) { this._setValue('fUserKey', val); } get fUserKey() { return this._getValue('fUserKey'); }
    set fLanguage(val) { this._setValue('fLanguage', val); } get fLanguage() { return this._getValue('fLanguage'); }
    set fKeyword(val) { this._setValue('fKeyword', val); } get fKeyword() { return this._getValue('fKeyword'); }
    set fActive(val) { this._setValue('fActive', val); } get fActive() { return this._getValue('fActive'); }
    set fCreatedBy(val) { this._setValue('fCreatedBy', val); } get fCreatedBy() { return this._getValue('fCreatedBy'); }
    set fCreatedDate(val) { this._setValue('fCreatedDate', val); } get fCreatedDate() { return this._getValue('fCreatedDate'); }
    set fLastModifiedBy(val) { this._setValue('fLastModifiedBy', val); } get fLastModifiedBy() { return this._getValue('fLastModifiedBy'); }
    set fLastModifiedDate(val) { this._setValue('fLastModifiedDate', val); } get fLastModifiedDate() { return this._getValue('fLastModifiedDate'); }
}