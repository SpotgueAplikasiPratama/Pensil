import { padStart } from 'core-js/core/string';
import React from 'react';
import Core from '../../../core/core';
import MyTranslator from '../../lessons/locale/MyTranslator';


export default class ExistingRegistrationForm extends Core.Model.SGBaseModel {
    static getBlankJSON() {
        return {
            fID:'',
            fReferralCode: '',
            fCardKey: '',
            fBuildingKey:'',
            fUserKey: '',
            fMemberProfileJSON : {    
                fFullName:'', fGender:'', fBirthDate:new Date(),fBirthPlace:'',
                fIDCardNumber:'', fIDCardPicture:[], fReligion:'', fMaritalStatus:'',
                fCountry:'', fProvince:'',fCity:'', fAddress:'', fPostalCode:'',
                fMobilePhone:'', fEmail:'', fOccupation:'', fIncomeRange:'',
                fUDF1: '', fUDF2: '', fUDF3: '', fUDF4: '', fUDF5: '', fUDF6: '', fUDF7: '', fUDF8: ''
            },
            fCardExpiryDate : new Date(),
            fCardNumber : '', 
            fCardRegistrationDate : new Date(),
            fCardStatus : '',
            fCardBlockedStatus : '',
            fRegisterType : '',
            fReason: '',
            fLocked : '',
            fLockedDate : new Date(),
            fLockedByID : '',
            fActive:'',
            fCreatedByID:'',
            fCreatedDate:new Date(),
            fLastModifiedByID:'',
            fLastModifiedDate:new Date(),
            fRegistrationReceipt: [],
            };
                
    }
    constructor(ori, cur, changeList) {
        super(ExistingRegistrationForm, ori ? ori : ExistingRegistrationForm.getBlankJSON(), cur, changeList);
        const { SGHelperStringValidator, SGHelperFieldValidator, SGHelperRangeValidator, SGHelperArrayValidator, SGHelperType, SGHelperGlobalVar } = Core.Helper;
        this.addValidator('fCardNumber', new SGHelperStringValidator(SGHelperType.stringType.string, true, 1, MyTranslator.tr('AddNewRegistrationForm.cardNumberValidator')));
        this.addValidator('fCardKey', new SGHelperStringValidator(SGHelperType.stringType.string, true, 1, MyTranslator.tr('AddNewRegistrationForm.cardTypeValidator')));

        var setting = SGHelperGlobalVar.getVar('ExistingRegistrationFormSetting')
        
        if(setting.fFullName === 'mandatory'){
            this.addValidator('fMemberProfileJSON.fFullName', new SGHelperStringValidator(SGHelperType.stringType.string, true, 1, MyTranslator.tr('AddNewRegistrationForm.fullNameValidator')));
        }
        if(setting.fEmail === 'mandatory'){
            this.addValidator('fMemberProfileJSON.fEmail', new SGHelperStringValidator(SGHelperType.stringType.email, true, 1, MyTranslator.tr('AddNewRegistrationForm.emailValidator')));
        }
        if(setting.fMobilePhone === 'mandatory'){
            this.addValidator('fMemberProfileJSON.fMobilePhone', new SGHelperRangeValidator(SGHelperType.stringType.string, true, MyTranslator.tr('AddNewRegistrationForm.phoneNumberValidator'), 1));
        }
        if(setting.fBirthDate === 'mandatory'){
            this.addValidator('fMemberProfileJSON.fBirthDate', new SGHelperStringValidator(SGHelperType.stringType.date, true, 1, MyTranslator.tr('AddNewRegistrationForm.birthDateValidator')),new Date(2020, 0, 1, 0, 0, 0, 0));
        }

        if(setting.fPostalCode === 'mandatory'){
            this.addValidator('fMemberProfileJSON.fPostalCode', new SGHelperStringValidator(SGHelperType.stringType.string, true, 1, MyTranslator.tr('AddNewRegistrationForm.postalCodeValidator')));
        }

        if(setting.fIDCardNumber === 'mandatory'){
            this.addValidator('fMemberProfileJSON.fIDCardNumber', new SGHelperStringValidator(SGHelperType.stringType.string, true,16, MyTranslator.tr('AddNewRegistrationForm.IDCardNumberValidator') ));
        }
        if(setting.fIDCardPicture === 'mandatory'){
            this.addValidator('fMemberProfileJSON.fIDCardPicture', new SGHelperStringValidator(SGHelperType.stringType.string, true, 1, MyTranslator.tr('AddNewRegistrationForm.IDCardImageValidator')));
        }
        if(setting.fGender === 'mandatory'){
            this.addValidator('fMemberProfileJSON.fGender', new SGHelperStringValidator(SGHelperType.stringType.string, true, 1, MyTranslator.tr('AddNewRegistrationForm.genderValidator')));
        }
        if(setting.fReligion === 'mandatory'){
            this.addValidator('fMemberProfileJSON.fReligion', new SGHelperStringValidator(SGHelperType.stringType.string, true, 1, MyTranslator.tr('AddNewRegistrationForm.religionValidator')));
        }
        if(setting.fMaritalStatus === 'mandatory'){
            this.addValidator('fMemberProfileJSON.fMaritalStatus', new SGHelperStringValidator(SGHelperType.stringType.string, true, 1, MyTranslator.tr('AddNewRegistrationForm.maritalStatusValidator')));
        }
        if(setting.fCountry === 'mandatory'){
            this.addValidator('fMemberProfileJSON.fCountry', new SGHelperStringValidator(SGHelperType.stringType.string, true, 0, MyTranslator.tr('AddNewRegistrationForm.countryValidator')));
        }
        if(setting.fProvince === 'mandatory'){
            this.addValidator('fMemberProfileJSON.fProvince', new SGHelperStringValidator(SGHelperType.stringType.string, true, 0, MyTranslator.tr('AddNewRegistrationForm.provinceValidator')));
        }
        if(setting.fCity === 'mandatory'){
            this.addValidator('fMemberProfileJSON.fCity', new SGHelperStringValidator(SGHelperType.stringType.string, true, 0, MyTranslator.tr('AddNewRegistrationForm.cityValidator')));
        }
        if(setting.fAddress === 'mandatory'){
            this.addValidator('fMemberProfileJSON.fAddress', new SGHelperStringValidator(SGHelperType.stringType.string, true, 1, MyTranslator.tr('AddNewRegistrationForm.addressValidator')));
        }
        if(setting.fOccupation === 'mandatory'){
            this.addValidator('fMemberProfileJSON.fOccupation', new SGHelperStringValidator(SGHelperType.stringType.string, true, 1, MyTranslator.tr('AddNewRegistrationForm.occupationValidator')));
        }
        if(setting.fIncomeRange === 'mandatory'){
            this.addValidator('fMemberProfileJSON.fIncomeRange', new SGHelperStringValidator(SGHelperType.stringType.string, true, 1, MyTranslator.tr('AddNewRegistrationForm.incomeValidator')));
        }
    }

    get fID() { return this._getValue('fID'); } set fID(val) { this._setValue('fID', val); }
    get fReferralCode() { return this._getValue('fReferralCode'); } set fReferralCode(val) { this._setValue('fReferralCode', val); }
    get fCardKey() { return this._getValue('fCardKey'); } set fCardKey(val) { this._setValue('fCardKey', val); }
    get fBuildingKey() { return this._getValue('fBuildingKey'); } set fBuildingKey(val) { this._setValue('fBuildingKey', val); }
    get fUserKey() { return this._getValue('fUserKey'); } set fUserKey(val) { this._setValue('fUserKey', val); }
    get fMemberProfileJSON() { return this._getValue('fMemberProfileJSON'); } set fMemberProfileJSON(val) { this._setValue('fMemberProfileJSON', val); }
    get fCardExpiryDate() { return this._getValue('fCardExpiryDate'); } set fCardExpiryDate(val) { this._setValue('fCardExpiryDate', val); }
    get fCardNumber() { return this._getValue('fCardNumber'); } set fCardNumber(val) { this._setValue('fCardNumber', val); }
    get fCardRegistrationDate() { return this._getValue('fCardRegistrationDate'); } set fCardRegistrationDate(val) { this._setValue('fCardRegistrationDate', val); }
    get fCardStatus() { return this._getValue('fCardStatus'); } set fCardStatus(val) { this._setValue('fCardStatus', val); }
    get fCardBlockedStatus() { return this._getValue('fCardBlockedStatus'); } set fCardBlockedStatus(val) { this._setValue('fCardBlockedStatus', val); }
    get fRegisterType() { return this._getValue('fRegisterType'); } set fRegisterType(val) { this._setValue('fRegisterType', val); }
    get fLocked() { return this._getValue('fLocked'); } set fLocked(val) { this._setValue('fLocked', val); }
    get fLockedDate() { return this._getValue('fLockedDate'); } set fLockedDate(val) { this._setValue('fLockedDate', val); }
    get fLockedByID() { return this._getValue('fLockedByID'); } set fLockedByID(val) { this._setValue('fLockedByID', val); }
    get fActive() { return this._getValue('fActive'); } set fActive(val) { this._setValue('fActive', val); }
    get fCreatedByID() { return this._getValue('fCreatedByID'); } set fCreatedByID(val) { this._setValue('fCreatedByID', val); }
    get fCreatedDate() { return this._getValue('fCreatedDate'); } set fCreatedDate(val) { this._setValue('fCreatedDate', val); }
    get fLastModifiedByID() { return this._getValue('fLastModifiedByID'); } set fLastModifiedByID(val) { this._setValue('fLastModifiedByID', val); }
    get fLastModifiedDate() { return this._getValue('fLastModifiedDate'); } set fLastModifiedDate(val) { this._setValue('fLastModifiedDate', val); }
}