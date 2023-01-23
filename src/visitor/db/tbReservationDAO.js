// import { RealmDB, tbReservationData as tbReservationRealm } from './RealmDB.js';
import { SGBaseModel } from '../../core/model/SGBaseModel';
import { SGHelperType, SGHelperDB } from '../../core/helper';
import { SGHelperStringValidator, SGHelperFieldValidator, SGHelperRangeValidator } from '../../core/helper/SGHelperValidator';
import { SGLocalize } from '../locales/SGLocalize';

export class tbReservationDAO extends SGBaseModel {

}

export class tbReservationData extends SGBaseModel {

    static getBlankJSON() {
        return { fID: '', fStoreKey: '', fName: '', fNumberPhone: '', fNumberOfPerson: 1, fNotes: '', fTempStatus: 'Y', fBookBy: '', fStatus: '', fBookDate: new Date(), fBookTime: new Date(), fBookDateTime: new Date(), fResponTime: new Date(0), fResponResult: '', fCancelBy: '', fDoneDateTime: new Date(0), fSearchKey: '', fCreatedBy: '', fCreatedByID: '', fCreatedDate: new Date(0), fLastModifiedBy: '', fLastModifiedByID: '', fLastModifiedDate: new Date(0), fExpiredDate: new Date(),fPushNotification:'N' };
    }
    constructor(ori, cur, changeList) {
        var limit = SGHelperType.getSystemParamsValue('LimitReservation');
        super(tbReservationData, ori ? ori : tbReservationData.getBlankJSON(), cur, changeList);
        this.addValidator('fName', new SGHelperStringValidator(SGHelperType.stringType.string, true, 1, SGLocalize.translate('ReservationDBModel.Name')));
        this.addValidator('fNumberPhone', new SGHelperStringValidator(SGHelperType.stringType.string, true, 10, SGLocalize.translate('ReservationDBModel.NumberPhone')));
        this.addValidator('fNumberOfPerson', new SGHelperRangeValidator(SGHelperType.stringType.decimal, true, SGLocalize.translate('ReservationDBModel.NumberOfPerson'), 1, limit));
        // this.addValidator('fNotes', new SGHelperStringValidator(SGHelperType.stringType.string, false, 1, 'Deskripsi harus diisi minimal 1 karakter'));
    }
    set fID(val) { this._setValue('fID', val); } get fID() { return this._getValue('fID'); }
    set fName(val) { this._setValue('fName', val); } get fName() { return this._getValue('fName'); }
    set fNumberPhone(val) { this._setValue('fNumberPhone', val); } get fNumberPhone() { return this._getValue('fNumberPhone'); }
    set fNumberOfPerson(val) { this._setValue('fNumberOfPerson', val); } get fNumberOfPerson() { return this._getValue('fNumberOfPerson'); }
    set fNotes(val) { this._setValue('fNotes', val); } get fNotes() { return this._getValue('fNotes'); }
    set fTempStatus(val) { this._setValue('fTempStatus', val); } get fTempStatus() { return this._getValue('fTempStatus'); }
    set fBookBy(val) { this._setValue('fBookBy', val); } get fBookBy() { return this._getValue('fBookBy'); }
    set fStatus(val) { this._setValue('fStatus', val); } get fStatus() { return this._getValue('fStatus'); }
    set fBookDate(val) { this._setValue('fBookDate', val); } get fBookDate() { return this._getValue('fBookDate'); }
    set fBookTime(val) { this._setValue('fBookTime', val); } get fBookTime() { return this._getValue('fBookTime'); }
    set fBookDateTime(val) { this._setValue('fBookDateTime', val); } get fBookDateTime() { return this._getValue('fBookDateTime'); }
    set fResponTime(val) { this._setValue('fResponTime', val); } get fResponTime() { return this._getValue('fResponTime'); }
    set fResponResult(val) { this._setValue('fResponResult', val); } get fResponResult() { return this._getValue('fResponResult'); }
    set fCancelBy(val) { this._setValue('fCancelBy', val); } get fCancelBy() { return this._getValue('fCancelBy'); }
    set fDoneDateTime(val) { this._setValue('fDoneDateTime', val); } get fDoneDateTime() { return this._getValue('fDoneDateTime'); }
    set fStoreKey(val) { this._setValue('fStoreKey', val); } get fStoreKey() { return this._getValue('fStoreKey'); }
    set fSearchKey(val) { this._setValue('fSearchKey', val); } get fSearchKey() { return this._getValue('fSearchKey'); }
    set fCreatedBy(val) { this._setValue('fCreatedBy', val); } get fCreatedBy() { return this._getValue('fCreatedBy'); }
    set fCreatedByID(val) { this._setValue('fCreatedByID', val); } get fCreatedByID() { return this._getValue('fCreatedByID'); }
    set fCreatedDate(val) { this._setValue('fCreatedDate', val); } get fCreatedDate() { return this._getValue('fCreatedDate'); }
    set fLastModifiedBy(val) { this._setValue('fLastModifiedBy', val); } get fLastModifiedBy() { return this._getValue('fLastModifiedBy'); }
    set fLastModifiedByID(val) { this._setValue('fLastModifiedByID', val); } get fLastModifiedByID() { return this._getValue('fLastModifiedByID'); }
    set fLastModifiedDate(val) { this._setValue('fLastModifiedDate', val); } get fLastModifiedDate() { return this._getValue('fLastModifiedDate'); }
    set fExpiredDate(val) { this._setValue('fExpiredDate', val); } get fExpiredDate() { return this._getValue('fExpiredDate'); }
    set fPushNotification(val) { this._setValue('fPushNotification', val); } get fPushNotification() { return this._getValue('fPushNotification'); }
}
