// import { RealmDB, tbUserCheckInData as tbUserCheckInRealm } from './RealmDB';
import { SGHelperType, SGHelperDB } from '../../core/helper';
import { SGBaseModel } from '../../core/model/SGBaseModel';
import { SGHelperRangeValidator, SGHelperArrayValidator } from '../../core/helper/SGHelperValidator';
import { SGLocalize } from '../locales/SGLocalize';

export class tbTAuctionxParticipantDAO {


}

export class tbTAuctionxParticipantData extends SGBaseModel {
    static getBlankJSON() {
        return { fID: '', fStoreKey: '', fUserKey: '', fAuctionKey: '' ,fBidPrice: '', fReceiptImage: [] , fStatus: '', fReason: '' ,fActive: 'Y', fCreatedBy: '', fCreatedByID: '', fCreatedDate: new Date(0), fLastModifiedBy: '', fLastModifiedByID: '', fLastModifiedDate: new Date(0) };
    }
    constructor(ori, cur, changeList) {
        super(tbTAuctionxParticipantData, ori ? ori : tbTAuctionxParticipantData.getBlankJSON(), cur, changeList);
        // this.addValidator('fBidPrice', new SGHelperRangeValidator(SGHelperType.stringType.currency, true, SGLocalize.translate('AuctionForm.bidPriceValidator'), 1, null));
    }

    set fID(val) { this._setValue('fID', val); } get fID() { return this._getValue('fID'); }
    set fStoreKey(val) { this._setValue('fStoreKey', val); } get fStoreKey() { return this._getValue('fStoreKey'); }
    set fUserKey(val) { this._setValue('fUserKey', val); } get fUserKey() { return this._getValue('fUserKey'); }
    set fAuctionKey(val) { this._setValue('fAuctionKey', val); } get fAuctionKey() { return this._getValue('fAuctionKey'); }
    set fBidPrice(val) { this._setValue('fBidPrice', val);} get fBidPrice() { return this._getValue('fBidPrice'); }
    set fReceiptImage(val) { this._setValue('fReceiptImage', val);} get fReceiptImage() { return this._getValue('fReceiptImage'); }
    set fStatus(val) { this._setValue('fStatus', val);} get fStatus() { return this._getValue('fStatus'); }
    set fReason(val) { this._setValue('fReason', val);} get fReason() { return this._getValue('fReason'); }
    set fActive(val) { this._setValue('fActive', val); } get fActive() { return this._getValue('fActive'); }
    set fCreatedBy(val) { this._setValue('fCreatedBy', val); } get fCreatedBy() { return this._getValue('fCreatedBy'); }
    set fCreatedByID(val) { this._setValue('fCreatedByID', val); } get fCreatedByID() { return this._getValue('fCreatedByID'); }
    set fCreatedDate(val) { this._setValue('fCreatedDate', val); } get fCreatedDate() { return this._getValue('fCreatedDate'); }
    set fLastModifiedBy(val) { this._setValue('fLastModifiedBy', val); } get fLastModifiedBy() { return this._getValue('fLastModifiedBy'); }
    set fLastModifiedByID(val) { this._setValue('fLastModifiedByID', val); } get fLastModifiedByID() { return this._getValue('fLastModifiedByID'); }
    set fLastModifiedDate(val) { this._setValue('fLastModifiedDate', val); } get fLastModifiedDate() { return this._getValue('fLastModifiedDate'); }
    set fReferralPoint(val) { this._setValue('fReferralPoint', val); } get fReferralPoint() { return this._getValue('fReferralPoint'); }
    set fUploadReceipt(val) { this._setValue('fUploadReceipt', val); } get fUploadReceipt() { return this._getValue('fUploadReceipt'); }
}

export class tbTAuctionxParticipantDataReceipt extends SGBaseModel {
    static getBlankJSON() {
        return { fID: '', fStoreKey: '', fUserKey: '', fAuctionKey: '' ,fBidPrice: '', fReceiptImage: [] , fStatus: '', fReason: '' ,fActive: 'Y', fCreatedBy: '', fCreatedByID: '', fCreatedDate: new Date(0), fLastModifiedBy: '', fLastModifiedByID: '', fLastModifiedDate: new Date(0) };
    }
    constructor(ori, cur, changeList) {
        super(tbTAuctionxParticipantData, ori ? ori : tbTAuctionxParticipantData.getBlankJSON(), cur, changeList);
        // this.addValidator('fBidPrice', new SGHelperRangeValidator(SGHelperType.stringType.currency, true, SGLocalize.translate('AuctionForm.bidPriceValidator'), 0, null));
        this.addValidator('fReceiptImage', new SGHelperArrayValidator(true, 1, SGLocalize.translate('AuctionForm.receiptImageValidator')));
    }

    set fID(val) { this._setValue('fID', val); } get fID() { return this._getValue('fID'); }
    set fStoreKey(val) { this._setValue('fStoreKey', val); } get fStoreKey() { return this._getValue('fStoreKey'); }
    set fUserKey(val) { this._setValue('fUserKey', val); } get fUserKey() { return this._getValue('fUserKey'); }
    set fAuctionKey(val) { this._setValue('fAuctionKey', val); } get fAuctionKey() { return this._getValue('fAuctionKey'); }
    set fBidPrice(val) { this._setValue('fBidPrice', val);} get fBidPrice() { return this._getValue('fBidPrice'); }
    set fReceiptImage(val) { this._setValue('fReceiptImage', val);} get fReceiptImage() { return this._getValue('fReceiptImage'); }
    set fStatus(val) { this._setValue('fStatus', val);} get fStatus() { return this._getValue('fStatus'); }
    set fReason(val) { this._setValue('fReason', val);} get fReason() { return this._getValue('fReason'); }
    set fActive(val) { this._setValue('fActive', val); } get fActive() { return this._getValue('fActive'); }
    set fCreatedBy(val) { this._setValue('fCreatedBy', val); } get fCreatedBy() { return this._getValue('fCreatedBy'); }
    set fCreatedByID(val) { this._setValue('fCreatedByID', val); } get fCreatedByID() { return this._getValue('fCreatedByID'); }
    set fCreatedDate(val) { this._setValue('fCreatedDate', val); } get fCreatedDate() { return this._getValue('fCreatedDate'); }
    set fLastModifiedBy(val) { this._setValue('fLastModifiedBy', val); } get fLastModifiedBy() { return this._getValue('fLastModifiedBy'); }
    set fLastModifiedByID(val) { this._setValue('fLastModifiedByID', val); } get fLastModifiedByID() { return this._getValue('fLastModifiedByID'); }
    set fLastModifiedDate(val) { this._setValue('fLastModifiedDate', val); } get fLastModifiedDate() { return this._getValue('fLastModifiedDate'); }
    set fReferralPoint(val) { this._setValue('fReferralPoint', val); } get fReferralPoint() { return this._getValue('fReferralPoint'); }
    set fUploadReceipt(val) { this._setValue('fUploadReceipt', val); } get fUploadReceipt() { return this._getValue('fUploadReceipt'); }
}