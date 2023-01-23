// import { RealmDB, tbCommentData as tbCommentRealm } from './RealmDB';
import { SGHelperType } from '../../core/helper';
import { SGBaseModel } from '../../core/model/SGBaseModel';

export class tbCommentDAO {

}

export class tbCommentData extends SGBaseModel {
    static getBlankJSON() {
        return { fID: '', fUserImage: '', fContentType: '', fContentKey: '', fContentName: '', fContentText1: '', fContentText2: '', fContentImage: '', fRespon: '', fTargetType: '', fTargetKey: '', fTargetName: '', fTargetImage: '', fReplyJSON: '', fLastReplyDate: new Date(), fReadAdmin: '', fReadCreator: '', fActive: '', fCreatedBy: '', fCreatedDate: new Date(), fLastModifiedBy: '', fLastModifiedDate: new Date(), fReplyData: [], fReplySingle: { replyText: '', replyDate: new Date(), writer: '' } };
    }
    constructor(ori, cur, changeList) {
        super(tbCommentData, ori ? ori : tbCommentData.getBlankJSON(), cur, changeList);
    }
    set fID(val) { this._setValue('fID', val); } get fID() { return this._getValue('fID'); }
    set fUserImage(val) { this._setValue('fUserImage', val); } get fUserImage() { return this._getValue('fUserImage'); }
    set fContentType(val) { this._setValue('fContentType', val); } get fContentType() { return this._getValue('fContentType'); }
    set fContentKey(val) { this._setValue('fContentKey', val); } get fContentKey() { return this._getValue('fContentKey'); }
    set fContentName(val) { this._setValue('fContentName', val); } get fContentName() { return this._getValue('fContentName'); }
    set fContentText1(val) { this._setValue('fContentText1', val); } get fContentText1() { return this._getValue('fContentText1'); }
    set fContentText2(val) { this._setValue('fContentText2', val); } get fContentText2() { return this._getValue('fContentText2'); }
    set fContentImage(val) { this._setValue('fContentImage', val); } get fContentImage() { return this._getValue('fContentImage'); }
    set fRespon(val) { this._setValue('fRespon', val); } get fRespon() { return this._getValue('fRespon'); }
    set fTargetType(val) { this._setValue('fTargetType', val); } get fTargetType() { return this._getValue('fTargetType'); }
    set fTargetKey(val) { this._setValue('fTargetKey', val); } get fTargetKey() { return this._getValue('fTargetKey'); }
    set fTargetName(val) { this._setValue('fTargetName', val); } get fTargetName() { return this._getValue('fTargetName'); }
    set fTargetImage(val) { this._setValue('fTargetImage', val); } get fTargetImage() { return this._getValue('fTargetImage'); }
    set fReplyJSON(val) { this._setValue('fReplyJSON', val); } get fReplyJSON() { return this._getValue('fReplyJSON'); }
    set fLastReplyDate(val) { this._setValue('fLastReplyDate', val); } get fLastReplyDate() { return this._getValue('fLastReplyDate'); }
    set fReadAdmin(val) { this._setValue('fReadAdmin', val); } get fReadAdmin() { return this._getValue('fReadAdmin'); }
    set fReadCreator(val) { this._setValue('fReadCreator', val); } get fReadCreator() { return this._getValue('fReadCreator'); }
    set fActive(val) { this._setValue('fActive', val); } get fActive() { return this._getValue('fActive'); }
    set fCreatedBy(val) { this._setValue('fCreatedBy', val); } get fCreatedBy() { return this._getValue('fCreatedBy'); }
    set fCreatedDate(val) { this._setValue('fCreatedDate', val); } get fCreatedDate() { return this._getValue('fCreatedDate'); }
    set fLastModifiedBy(val) { this._setValue('fLastModifiedBy', val); } get fLastModifiedBy() { return this._getValue('fLastModifiedBy'); }
    set fLastModifiedDate(val) { this._setValue('fLastModifiedDate', val); } get fLastModifiedDate() { return this._getValue('fLastModifiedDate'); }
}
