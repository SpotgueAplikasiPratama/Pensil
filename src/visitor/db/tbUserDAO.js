// import { RealmDB, tbUserData as tbUserRealm } from './RealmDB';
import { SGBaseModel } from '../../core/model/SGBaseModel';
import { SGLocalize } from '../locales/SGLocalize';
import { SGHelperStringValidator, SGHelperFieldValidator, SGHelperRangeValidator, SGHelperArrayValidator } from '../../core/helper/SGHelperValidator'
import { SGDialogBox as DialogBox } from '../../core/control';
import { SGHelperType } from '../../core/helper';

export class tbUserDAO {

  
   
}

export class tbUserDataModelPassword extends SGBaseModel {
    static getBlankJSON() {
        return { fID: '', fImageProfileJSON: [], fEmail: '', fPhoneNumber: '', fPassword: '', fConfirmPassword: '', fSecurityQuestionKey: '', fQuestionAnswer: '', fName: '', fGender: '', fDOB: new Date(0), fLocation: '', fFamily: '', fFoodPreference: [], fLanguage: '', fCurrency: 'IDR', fCar: [], fImageSetting: 'med', fTrackingActive: 'Y', fNotificationActive: 'Y', fShortDescription: '', fReminderReservation: '', fTimeZoneSetting: new Date(0), fCountry: '', fProvince: '', fCity: '', fUrlInstagram: '', fUrlFacebook: '', fUrlTwitter: '', fFacebookID: '', fGoogleID: '', fRegisterMethod: 'spotgue', fActive: 'Y', fSpendCriteria: 'C', fCreatedBy: '', fCreatedDate: new Date(0), fLastModifiedBy: '', fLastModifiedDate: new Date(0) };
    }
    constructor(ori, cur, changeList) {
        super(tbUserDataModelPassword, ori ? ori : tbUserDataModelPassword.getBlankJSON(), cur, changeList);
        this.addValidator('fPassword', new SGHelperStringValidator(SGHelperType.stringType.password, true, 8, SGLocalize.translate('UserDBModel.fPassword')));
        this.addValidator('fConfirmPassword', new SGHelperStringValidator(SGHelperType.stringType.password, true, 8, SGLocalize.translate('UserDBModel.fPassword')));
        this.addValidator('fConfirmPassword', new SGHelperFieldValidator(SGHelperType.stringType.password, SGHelperFieldValidator.operator.equal, this, 'fPassword', SGHelperFieldValidator.nullRule.bothNullReturnTrue, SGLocalize.translate('UserDBModel.fConfirmPassword')));
    }
    set fID(val) { this._setValue('fID', val); } get fID() { return this._getValue('fID'); }
    set fImageProfileJSON(val) { this._setValue('fImageProfileJSON', val); } get fImageProfileJSON() { return this._getValue('fImageProfileJSON'); }
    set fEmail(val) { this._setValue('fEmail', val); } get fEmail() { return this._getValue('fEmail'); }
    set fPhoneNumber(val) { this._setValue('fPhoneNumber', val); } get fPhoneNumber() { return this._getValue('fPhoneNumber'); }
    set fPassword(val) { this._setValue('fPassword', val); } get fPassword() { return this._getValue('fPassword'); }
    set fConfirmPassword(val) { this._setValue('fConfirmPassword', val); } get fConfirmPassword() { return this._getValue('fConfirmPassword'); }
    set fSecurityQuestionKey(val) { this._setValue('fSecurityQuestionKey', val); } get fSecurityQuestionKey() { return this._getValue('fSecurityQuestionKey'); }
    set fQuestionAnswer(val) { this._setValue('fQuestionAnswer', val); } get fQuestionAnswer() { return this._getValue('fQuestionAnswer'); }
    set fName(val) { this._setValue('fName', val); } get fName() { return this._getValue('fName'); }
    set fGender(val) { this._setValue('fGender', val); } get fGender() { return this._getValue('fGender'); }
    set fDOB(val) { this._setValue('fDOB', val); } get fDOB() { return this._getValue('fDOB'); }
    set fLocation(val) { this._setValue('fLocation', val); } get fLocation() { return this._getValue('fLocation'); }
    set fFamily(val) { this._setValue('fFamily', val); } get fFamily() { return this._getValue('fFamily'); }
    set fFoodPreference(val) { this._setValue('fFoodPreference', val); } get fFoodPreference() { return this._getValue('fFoodPreference'); }
    set fLanguage(val) { this._setValue('fLanguage', val); } get fLanguage() { return this._getValue('fLanguage'); }
    set fCurrency(val) { this._setValue('fCurrency', val); } get fCurrency() { return this._getValue('fCurrency'); }
    set fSpendCriteria(val) { this._setValue('fSpendCriteria', val); } get fSpendCriteria() { return this._getValue('fSpendCriteria'); }
    set fCar(val) { this._setValue('fCar', val); } get fCar() { return this._getValue('fCar'); }
    set fImageSetting(val) { this._setValue('fImageSetting', val); } get fImageSetting() { return this._getValue('fImageSetting'); }
    set fTrackingActive(val) { this._setValue('fTrackingActive', val); } get fTrackingActive() { return this._getValue('fTrackingActive'); }
    set fNotificationActive(val) { this._setValue('fNotificationActive', val); } get fNotificationActive() { return this._getValue('fNotificationActive'); }
    set fShortDescription(val) { this._setValue('fShortDescription', val); } get fShortDescription() { return this._getValue('fShortDescription'); }
    set fReminderReservation(val) { this._setValue('fReminderReservation', val); } get fReminderReservation() { return this._getValue('fReminderReservation'); }
    set fTimeZoneSetting(val) { this._setValue('fTimeZoneSetting', val); } get fTimeZoneSetting() { return this._getValue('fTimeZoneSetting'); }
    set fCountry(val) { this._setValue('fCountry', val); } get fCountry() { return this._getValue('fCountry'); }
    set fProvince(val) { this._setValue('fProvince', val); } get fProvince() { return this._getValue('fProvince'); }
    set fCity(val) { this._setValue('fCity', val); } get fCity() { return this._getValue('fCity'); }
    set fUrlInstagram(val) { this._setValue('fUrlInstagram', val); } get fUrlInstagram() { return this._getValue('fUrlInstagram'); }
    set fUrlFacebook(val) { this._setValue('fUrlFacebook', val); } get fUrlFacebook() { return this._getValue('fUrlFacebook'); }
    set fUrlTwitter(val) { this._setValue('fUrlTwitter', val); } get fUrlTwitter() { return this._getValue('fUrlTwitter'); }
    set fFacebookID(val) { this._setValue('fFacebookID', val); } get fFacebookID() { return this._getValue('fFacebookID'); }
    set fGoogleID(val) { this._setValue('fGoogleID', val); } get fGoogleID() { return this._getValue('fGoogleID'); }
    set fRegisterMethod(val) { this._setValue('fRegisterMethod', val); } get fRegisterMethod() { return this._getValue('fRegisterMethod'); }
    set fActive(val) { this._setValue('fActive', val); } get fActive() { return this._getValue('fActive'); }
    set fCreatedBy(val) { this._setValue('fCreatedBy', val); } get fCreatedBy() { return this._getValue('fCreatedBy'); }
    set fCreatedDate(val) { this._setValue('fCreatedDate', val); } get fCreatedDate() { return this._getValue('fCreatedDate'); }
}

export class tbUserData extends SGBaseModel {
    static getBlankJSON() {
        return { fID: '', fImageProfileJSON: [], fEmail: '', fPhoneNumber: '', fPassword: '', fConfirmPassword: '', fSecurityQuestionKey: '', fQuestionAnswer: '', fName: '', fGender: '', fDOB: new Date(), fLocation: '', fFamily: '', fFoodPreference: [], fLanguage: 'id', fCurrency: 'IDR', fCar: [], fImageSetting: 'med', fTrackingActive: 'Y', fNotificationActive: 'Y', fShortDescription: '', fReminderReservation: 'RR12', fTimeZoneSetting: new Date(0), fCountry: '', fProvince: '', fCity: '', fUrlInstagram: '', fUrlFacebook: '', fUrlTwitter: '', fFacebookID: '', fGoogleID: '', fAppleID: '', fRegisterMethod: 'spotgue', fActive: 'Y', fSpendCriteria: 'B', fCreatedBy: '', fCreatedDate: new Date(0), fLastModifiedBy: '', fLastModifiedDate: new Date(0), 
        fDeviceModel: '', fDeviceBrand: '', fDeviceOS: '', fDeviceOSVersion: '', fDeviceHeight: 0, fDeviceWidth: 0, fLoginLocation: '',fIsSimulator:false
    };
    }
    constructor(ori, cur, changeList) {
        super(tbUserData, ori ? ori : tbUserData.getBlankJSON(), cur, changeList);
        this.addValidator('fName', new SGHelperStringValidator(SGHelperType.stringType.string, true, 1,  SGLocalize.translate('UserDBModel.fName')));
        // this.addValidator('fSecurityQuestionKey', new SGHelperStringValidator(SGHelperType.stringType.string, true, 0, SGLocalize.translate('UserDBModel.SecurityQuestion')));
        // this.addValidator('fQuestionAnswer', new SGHelperStringValidator(SGHelperType.stringType.string, true, 1, SGLocalize.translate('UserDBModel.SecurityAnswer')));
        this.addValidator('fGender', new SGHelperStringValidator(SGHelperType.stringType.string, true, 1,  SGLocalize.translate('UserDBModel.fGender')));
        this.addValidator('fFamily', new SGHelperStringValidator(SGHelperType.stringType.string, true, 1,  SGLocalize.translate('UserDBModel.fFamily')));
        this.addValidator('fFoodPreference', new SGHelperArrayValidator(true, 1,SGLocalize.translate('UserDBModel.fFoodPreference')));
        this.addValidator('fSpendCriteria', new SGHelperStringValidator(SGHelperType.stringType.string, true, 1,  SGLocalize.translate('UserDBModel.fSpendCriteria')));
        this.addValidator('fPassword', new SGHelperStringValidator(SGHelperType.stringType.password, true, 8, SGLocalize.translate('UserDBModel.fPassword')));
        this.addValidator('fConfirmPassword', new SGHelperStringValidator(SGHelperType.stringType.password, true, 8, SGLocalize.translate('UserDBModel.fPassword')));
        this.addValidator('fConfirmPassword', new SGHelperFieldValidator(SGHelperType.stringType.password, SGHelperFieldValidator.operator.equal, this, 'fPassword', SGHelperFieldValidator.nullRule.bothNullReturnTrue, SGLocalize.translate('UserDBModel.fConfirmPassword')));
    }

    set fID(val) { this._setValue('fID', val); } get fID() { return this._getValue('fID'); }
    set fImageProfileJSON(val) { this._setValue('fImageProfileJSON', val); } get fImageProfileJSON() { return this._getValue('fImageProfileJSON'); }
    set fEmail(val) { this._setValue('fEmail', val); } get fEmail() { return this._getValue('fEmail'); }
    set fPhoneNumber(val) { this._setValue('fPhoneNumber', val); } get fPhoneNumber() { return this._getValue('fPhoneNumber'); }
    set fPassword(val) { this._setValue('fPassword', val); } get fPassword() { return this._getValue('fPassword'); }
    set fConfirmPassword(val) { this._setValue('fConfirmPassword', val); } get fConfirmPassword() { return this._getValue('fConfirmPassword'); }
    set fSecurityQuestionKey(val) { this._setValue('fSecurityQuestionKey', val); } get fSecurityQuestionKey() { return this._getValue('fSecurityQuestionKey'); }
    set fQuestionAnswer(val) { this._setValue('fQuestionAnswer', val); } get fQuestionAnswer() { return this._getValue('fQuestionAnswer'); }
    set fName(val) { this._setValue('fName', val); } get fName() { return this._getValue('fName'); }
    set fGender(val) { this._setValue('fGender', val); } get fGender() { return this._getValue('fGender'); }
    set fDOB(val) { this._setValue('fDOB', val); } get fDOB() { return this._getValue('fDOB'); }
    set fLocation(val) { this._setValue('fLocation', val); } get fLocation() { return this._getValue('fLocation'); }
    set fFamily(val) { this._setValue('fFamily', val); } get fFamily() { return this._getValue('fFamily'); }
    set fFoodPreference(val) { this._setValue('fFoodPreference', val); } get fFoodPreference() { return this._getValue('fFoodPreference'); }
    set fLanguage(val) { this._setValue('fLanguage', val); } get fLanguage() { return this._getValue('fLanguage'); }
    set fCurrency(val) { this._setValue('fCurrency', val); } get fCurrency() { return this._getValue('fCurrency'); }
    set fSpendCriteria(val) { this._setValue('fSpendCriteria', val); } get fSpendCriteria() { return this._getValue('fSpendCriteria'); }
    set fCar(val) { this._setValue('fCar', val); } get fCar() { return this._getValue('fCar'); }
    set fImageSetting(val) { this._setValue('fImageSetting', val); } get fImageSetting() { return this._getValue('fImageSetting'); }
    set fTrackingActive(val) { this._setValue('fTrackingActive', val); } get fTrackingActive() { return this._getValue('fTrackingActive'); }
    set fNotificationActive(val) { this._setValue('fNotificationActive', val); } get fNotificationActive() { return this._getValue('fNotificationActive'); }
    set fShortDescription(val) { this._setValue('fShortDescription', val); } get fShortDescription() { return this._getValue('fShortDescription'); }
    set fReminderReservation(val) { this._setValue('fReminderReservation', val); } get fReminderReservation() { return this._getValue('fReminderReservation'); }
    set fTimeZoneSetting(val) { this._setValue('fTimeZoneSetting', val); } get fTimeZoneSetting() { return this._getValue('fTimeZoneSetting'); }
    set fCountry(val) { this._setValue('fCountry', val); } get fCountry() { return this._getValue('fCountry'); }
    set fProvince(val) { this._setValue('fProvince', val); } get fProvince() { return this._getValue('fProvince'); }
    set fCity(val) { this._setValue('fCity', val); } get fCity() { return this._getValue('fCity'); }
    set fUrlInstagram(val) { this._setValue('fUrlInstagram', val); } get fUrlInstagram() { return this._getValue('fUrlInstagram'); }
    set fUrlFacebook(val) { this._setValue('fUrlFacebook', val); } get fUrlFacebook() { return this._getValue('fUrlFacebook'); }
    set fUrlTwitter(val) { this._setValue('fUrlTwitter', val); } get fUrlTwitter() { return this._getValue('fUrlTwitter'); }
    set fFacebookID(val) { this._setValue('fFacebookID', val); } get fFacebookID() { return this._getValue('fFacebookID'); }
    set fGoogleID(val) { this._setValue('fGoogleID', val); } get fGoogleID() { return this._getValue('fGoogleID'); }
    set fAppleID(val) { this._setValue('fAppleID', val); } get fAppleID() { return this._getValue('fAppleID'); };
    set fRegisterMethod(val) { this._setValue('fRegisterMethod', val); } get fRegisterMethod() { return this._getValue('fRegisterMethod'); }
    set fActive(val) { this._setValue('fActive', val); } get fActive() { return this._getValue('fActive'); }
    set fCreatedBy(val) { this._setValue('fCreatedBy', val); } get fCreatedBy() { return this._getValue('fCreatedBy'); }
    set fCreatedDate(val) { this._setValue('fCreatedDate', val); } get fCreatedDate() { return this._getValue('fCreatedDate'); }
    set fDeviceModel(val) { this._setValue('fDeviceModel', val); } get fDeviceModel() { return this._getValue('fDeviceModel'); }
    set fDeviceBrand(val) { this._setValue('fDeviceBrand', val); } get fDeviceBrand() { return this._getValue('fDeviceBrand'); }
    set fDeviceOS(val) { this._setValue('fDeviceOS', val); } get fDeviceOS() { return this._getValue('fDeviceOS'); }
    set fDeviceOSVersion(val) { this._setValue('fDeviceOSVersion', val); } get fDeviceOSVersion() { return this._getValue('fDeviceOSVersion'); }
    set fDeviceHeight(val) { this._setValue('fDeviceHeight', val); } get fDeviceHeight() { return this._getValue('fDeviceHeight'); }
    set fDeviceWidth(val) { this._setValue('fDeviceWidth', val); } get fDeviceWidth() { return this._getValue('fDeviceWidth'); }
    set fLoginLocation(val) { this._setValue('fLoginLocation', val); } get fLoginLocation() { return this._getValue('fLoginLocation'); }
    set fIsSimulator(val) { this._setValue('fIsSimulator', val); } get fIsSimulator() { return this._getValue('fIsSimulator'); }
}

export class tbUserDataProfileScreen extends SGBaseModel {
    static getBlankJSON() {
        return { fID: '', fImageProfileJSON: [], fEmail: '', fPhoneNumber: '', fPassword: '', fConfirmPassword: '', fSecurityQuestionKey: '', fQuestionAnswer: '', fName: '', fGender: '', fDOB: new Date(0), fLocation: '', fFamily: '', fFoodPreference: [], fLanguage: 'id', fCurrency: 'IDR', fCar: [], fImageSetting: 'med', fTrackingActive: 'Y', fNotificationActive: 'Y', fShortDescription: '', fReminderReservation: 'RR12', fTimeZoneSetting: new Date(0), fCountry: '', fProvince: '', fCity: '', fUrlInstagram: '', fUrlFacebook: '', fUrlTwitter: '', fFacebookID: '', fGoogleID: '', fAppleID: '', fRegisterMethod: 'spotgue', fActive: 'Y', fSpendCriteria: 'B', fCreatedBy: '', fCreatedDate: new Date(0), fLastModifiedBy: '', fLastModifiedDate: new Date(0), 
        fDeviceModel: '', fDeviceBrand: '', fDeviceOS: '', fDeviceOSVersion: '', fDeviceHeight: 0, fDeviceWidth: 0, fLoginLocation: ''
    };
    }
    constructor(ori, cur, changeList) {
        super(tbUserData, ori ? ori : tbUserData.getBlankJSON(), cur, changeList);
        this.addValidator('fName', new SGHelperStringValidator(SGHelperType.stringType.string, true, 1,  SGLocalize.translate('UserDBModel.fName')));
        // this.addValidator('fSecurityQuestionKey', new SGHelperStringValidator(SGHelperType.stringType.string, true, 0, SGLocalize.translate('UserDBModel.SecurityQuestion')));
        // this.addValidator('fQuestionAnswer', new SGHelperStringValidator(SGHelperType.stringType.string, true, 1, SGLocalize.translate('UserDBModel.SecurityAnswer')));
        this.addValidator('fGender', new SGHelperStringValidator(SGHelperType.stringType.string, true, 1,  SGLocalize.translate('UserDBModel.fGender')));
        this.addValidator('fCountry', new SGHelperStringValidator(SGHelperType.stringType.string, true, 1,  SGLocalize.translate('UserDBModel.fCountry')));
        this.addValidator('fProvince', new SGHelperStringValidator(SGHelperType.stringType.string, true, 1,  SGLocalize.translate('UserDBModel.fProvince')));
        this.addValidator('fCity', new SGHelperStringValidator(SGHelperType.stringType.string, true, 1,  SGLocalize.translate('UserDBModel.fCity')));
        this.addValidator('fReminderReservation', new SGHelperStringValidator(SGHelperType.stringType.string, true, 1,  SGLocalize.translate('UserDBModel.fReminderReservation')));
        this.addValidator('fFamily', new SGHelperStringValidator(SGHelperType.stringType.string, true, 1,  SGLocalize.translate('UserDBModel.fFamily')));
        this.addValidator('fFoodPreference', new SGHelperArrayValidator(true, 1,SGLocalize.translate('UserDBModel.fFoodPreference')));
        this.addValidator('fSpendCriteria', new SGHelperStringValidator(SGHelperType.stringType.string, true, 1,  SGLocalize.translate('UserDBModel.fSpendCriteria')));

    }

    set fID(val) { this._setValue('fID', val); } get fID() { return this._getValue('fID'); }
    set fImageProfileJSON(val) { this._setValue('fImageProfileJSON', val); } get fImageProfileJSON() { return this._getValue('fImageProfileJSON'); }
    set fEmail(val) { this._setValue('fEmail', val); } get fEmail() { return this._getValue('fEmail'); }
    set fPhoneNumber(val) { this._setValue('fPhoneNumber', val); } get fPhoneNumber() { return this._getValue('fPhoneNumber'); }
    set fPassword(val) { this._setValue('fPassword', val); } get fPassword() { return this._getValue('fPassword'); }
    set fSecurityQuestionKey(val) { this._setValue('fSecurityQuestionKey', val); } get fSecurityQuestionKey() { return this._getValue('fSecurityQuestionKey'); }
    set fQuestionAnswer(val) { this._setValue('fQuestionAnswer', val); } get fQuestionAnswer() { return this._getValue('fQuestionAnswer'); }
    set fName(val) { this._setValue('fName', val); } get fName() { return this._getValue('fName'); }
    set fGender(val) { this._setValue('fGender', val); } get fGender() { return this._getValue('fGender'); }
    set fDOB(val) { this._setValue('fDOB', val); } get fDOB() { return this._getValue('fDOB'); }
    set fLocation(val) { this._setValue('fLocation', val); } get fLocation() { return this._getValue('fLocation'); }
    set fFamily(val) { this._setValue('fFamily', val); } get fFamily() { return this._getValue('fFamily'); }
    set fFoodPreference(val) { this._setValue('fFoodPreference', val); } get fFoodPreference() { return this._getValue('fFoodPreference'); }
    set fLanguage(val) { this._setValue('fLanguage', val); } get fLanguage() { return this._getValue('fLanguage'); }
    set fCurrency(val) { this._setValue('fCurrency', val); } get fCurrency() { return this._getValue('fCurrency'); }
    set fSpendCriteria(val) { this._setValue('fSpendCriteria', val); } get fSpendCriteria() { return this._getValue('fSpendCriteria'); }
    set fCar(val) { this._setValue('fCar', val); } get fCar() { return this._getValue('fCar'); }
    set fImageSetting(val) { this._setValue('fImageSetting', val); } get fImageSetting() { return this._getValue('fImageSetting'); }
    set fTrackingActive(val) { this._setValue('fTrackingActive', val); } get fTrackingActive() { return this._getValue('fTrackingActive'); }
    set fNotificationActive(val) { this._setValue('fNotificationActive', val); } get fNotificationActive() { return this._getValue('fNotificationActive'); }
    set fShortDescription(val) { this._setValue('fShortDescription', val); } get fShortDescription() { return this._getValue('fShortDescription'); }
    set fReminderReservation(val) { this._setValue('fReminderReservation', val); } get fReminderReservation() { return this._getValue('fReminderReservation'); }
    set fTimeZoneSetting(val) { this._setValue('fTimeZoneSetting', val); } get fTimeZoneSetting() { return this._getValue('fTimeZoneSetting'); }
    set fCountry(val) { this._setValue('fCountry', val); } get fCountry() { return this._getValue('fCountry'); }
    set fProvince(val) { this._setValue('fProvince', val); } get fProvince() { return this._getValue('fProvince'); }
    set fCity(val) { this._setValue('fCity', val); } get fCity() { return this._getValue('fCity'); }
    set fUrlInstagram(val) { this._setValue('fUrlInstagram', val); } get fUrlInstagram() { return this._getValue('fUrlInstagram'); }
    set fUrlFacebook(val) { this._setValue('fUrlFacebook', val); } get fUrlFacebook() { return this._getValue('fUrlFacebook'); }
    set fUrlTwitter(val) { this._setValue('fUrlTwitter', val); } get fUrlTwitter() { return this._getValue('fUrlTwitter'); }
    set fFacebookID(val) { this._setValue('fFacebookID', val); } get fFacebookID() { return this._getValue('fFacebookID'); }
    set fGoogleID(val) { this._setValue('fGoogleID', val); } get fGoogleID() { return this._getValue('fGoogleID'); }
    set fAppleID(val) { this._setValue('fAppleID', val); } get fAppleID() { return this._getValue('fAppleID'); };
    set fRegisterMethod(val) { this._setValue('fRegisterMethod', val); } get fRegisterMethod() { return this._getValue('fRegisterMethod'); }
    set fActive(val) { this._setValue('fActive', val); } get fActive() { return this._getValue('fActive'); }
    set fCreatedBy(val) { this._setValue('fCreatedBy', val); } get fCreatedBy() { return this._getValue('fCreatedBy'); }
    set fCreatedDate(val) { this._setValue('fCreatedDate', val); } get fCreatedDate() { return this._getValue('fCreatedDate'); }
    set fDeviceModel(val) { this._setValue('fDeviceModel', val); } get fDeviceModel() { return this._getValue('fDeviceModel'); }
    set fDeviceBrand(val) { this._setValue('fDeviceBrand', val); } get fDeviceBrand() { return this._getValue('fDeviceBrand'); }
    set fDeviceOS(val) { this._setValue('fDeviceOS', val); } get fDeviceOS() { return this._getValue('fDeviceOS'); }
    set fDeviceOSVersion(val) { this._setValue('fDeviceOSVersion', val); } get fDeviceOSVersion() { return this._getValue('fDeviceOSVersion'); }
    set fDeviceHeight(val) { this._setValue('fDeviceHeight', val); } get fDeviceHeight() { return this._getValue('fDeviceHeight'); }
    set fDeviceWidth(val) { this._setValue('fDeviceWidth', val); } get fDeviceWidth() { return this._getValue('fDeviceWidth'); }
    set fLoginLocation(val) { this._setValue('fLoginLocation', val); } get fLoginLocation() { return this._getValue('fLoginLocation'); }
}
export class tbUserEmailData extends SGBaseModel {
    static getBlankJSON() {
        return { fEmail: '' };
    }
    constructor(ori, cur, changeList) {
        super(tbUserData, ori ? ori : tbUserData.getBlankJSON(), cur, changeList);

    }

    set fEmail(val) { this._setValue('fEmail', val); } get fEmail() { return this._getValue('fEmail'); }

}
