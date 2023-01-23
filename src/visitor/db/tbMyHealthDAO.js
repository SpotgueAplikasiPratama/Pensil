// import { RealmDB, tbUserData as tbUserRealm } from './RealmDB';
import { SGBaseModel } from '../../core/model/SGBaseModel';
import { SGLocalize } from '../locales/SGLocalize';
import { SGHelperStringValidator, SGHelperFieldValidator, SGHelperRangeValidator, SGHelperArrayValidator } from '../../core/helper/SGHelperValidator'
import { SGDialogBox as DialogBox } from '../../core/control';
import { SGHelperType } from '../../core/helper';

export class tbMyHealthDAO {

  
   
}

export class tbCMyHealthData extends SGBaseModel {
    static getBlankJSON() {
    return { fID :'',fUserKey:'',fVaccineImage1:[],fVaccineImage2:[],fCreatedByID:'',fCreatedDate:new Date(),fLastModifiedByID:'',fLastModifiedDate:new Date(),fType:'' };
    }
    constructor(ori, cur, changeList) {
    super(tbCMyHealthData, ori ? ori : tbCMyHealthData.getBlankJSON(), cur, changeList);
    }
    set fID(val) { this._setValue('fID', val); } get fID() { return this._getValue('fID'); }
    set fUserKey(val) { this._setValue('fUserKey', val); } get fUserKey() { return this._getValue('fUserKey'); }
    set fVaccineImage1(val) { this._setValue('fVaccineImage1', val); } get fVaccineImage1() { return this._getValue('fVaccineImage1'); }
    set fVaccineImage2(val) { this._setValue('fVaccineImage2', val); } get fVaccineImage2() { return this._getValue('fVaccineImage2'); }
    set fCreatedByID(val) { this._setValue('fCreatedByID', val); } get fCreatedByID() { return this._getValue('fCreatedByID'); }
    set fCreatedDate(val) { this._setValue('fCreatedDate', val); } get fCreatedDate() { return this._getValue('fCreatedDate'); }
    set fLastModifiedByID(val) { this._setValue('fLastModifiedByID', val); } get fLastModifiedByID() { return this._getValue('fLastModifiedByID'); }
    set fLastModifiedDate(val) { this._setValue('fLastModifiedDate', val); } get fLastModifiedDate() { return this._getValue('fLastModifiedDate'); }
    set fType(val) { this._setValue('fType', val); } get fType() { return this._getValue('fType'); }
}