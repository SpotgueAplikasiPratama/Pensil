// import { RealmDB, tbUserFavoriteData as tbUserFavoriteRealm } from './RealmDB';
import { SGHelperType, SGHelperDB } from '../../core/helper';
import { SGBaseModel } from '../../core/model/SGBaseModel';

export class tbUserFavoriteDAO {

}

export class tbUserFavoriteData extends SGBaseModel {
    static getBlankJSON() {
        return { fID: '', fContentType: '', fContentKey: '', fUserKey: '', fActive: 'Y', fCreatedBy: '', fCreatedDate: new Date(0), fLastModifiedBy: '', fLastModifiedDate: new Date(0) };
    }
    constructor(ori, cur, changeList) {
        super(tbUserFavoriteData, ori ? ori : tbUserFavoriteData.getBlankJSON(), cur, changeList);
    }
    set fID(val) { this._setValue('fID', val); } get fID() { return this._getValue('fID'); }
    set fContentType(val) { this._setValue('fContentType', val); } get fContentType() { return this._getValue('fContentType'); }
    set fContentKey(val) { this._setValue('fContentKey', val); } get fContentKey() { return this._getValue('fContentKey'); }
    set fUserKey(val) { this._setValue('fUserKey', val); } get fUserKey() { return this._getValue('fUserKey'); }
    set fActive(val) { this._setValue('fActive', val); } get fActive() { return this._getValue('fActive'); }
    set fCreatedBy(val) { this._setValue('fCreatedBy', val); } get fCreatedBy() { return this._getValue('fCreatedBy'); }
    set fCreatedDate(val) { this._setValue('fCreatedDate', val); } get fCreatedDate() { return this._getValue('fCreatedDate'); }
    set fLastModifiedBy(val) { this._setValue('fLastModifiedBy', val); } get fLastModifiedBy() { return this._getValue('fLastModifiedBy'); }
    set fLastModifiedDate(val) { this._setValue('fLastModifiedDate', val); } get fLastModifiedDate() { return this._getValue('fLastModifiedDate'); }
}
