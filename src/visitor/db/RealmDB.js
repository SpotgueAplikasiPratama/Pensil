
// import React from 'react';
// import Realm from 'realm';
// import {SGHelperFileMgr} from '../../core/helper';

// export class tbInitAppleAcc { }
// tbInitAppleAcc.schema = {
//     name: 'tbInitAppleAcc',
//     primaryKey: 'fID',
//     properties: {
//         fID: 'string',
//         fName: 'string',
//         fEmail: 'string',
//         fAppleUserID: 'string'
//     }
// }

// export class tbSystemParamsData { }
// tbSystemParamsData.schema = {
//     name: 'tbSystemParamsData',
//     primaryKey: 'fID',
//     properties: {
//         fID: 'string',
//         fParams: 'string',
//         fValue: 'string',
//         fActive: 'string',
//         fCreatedBy: 'string',
//         fCreatedDate: 'date',
//         fLastModifiedBy: 'string',
//         fLastModifiedDate: 'date',
//     }
// }

// export class tbLookupData { }
// tbLookupData.schema = {
//     name: 'tbLookupData',
//     primaryKey: 'fID',
//     properties: {
//         fID: 'string',
//         fGroup: 'string',
//         fLookUpKey: 'string',
//         fValueKey: 'string',
//         fActive: 'string',
//         fCreatedBy: 'string',
//         fCreatedDate: 'string',
//         fLastModifiedBy: 'string',
//         fLastModifiedDate: 'string',
//     }
// }

// export class tbUserData { }
// tbUserData.schema = {
//     name: 'tbUserData',
//     primaryKey: 'fID',
//     properties: {
//         fID: 'string',
//         fImageJSON: 'string',
//         fEmail: 'string',
//         fPhoneNumber: 'string',
//         fPassword: 'string',
//         fSecurityQuestionKey: 'string',
//         fQuestionAnswer: 'string',
//         fName: 'string',
//         fGender: 'string',
//         fDOB: 'date',
//         fLocation: 'string',
//         fFamily: 'string',
//         fFoodPreference: 'string',
//         fLanguage: 'string',
//         fCurrency: 'string',
//         fCar: 'string',
//         fImageSetting: 'string',
//         fTrackingActive: 'string',
//         fNotificationActive: 'string',
//         fShortDescription: 'string',
//         fReminderReservation: 'string',
//         fTimeZoneSetting: 'date',
//         fCountry: 'string',
//         fProvince: 'string',
//         fCity: 'string',
//         fUrlInstagram: 'string',
//         fUrlFacebook: 'string',
//         fUrlTwitter: 'string',
//         fActive: 'string',
//         fCreatedBy: 'string',
//         fCreatedDate: 'date',
//         fLastModifiedBy: 'string',
//         fLastModifiedDate: 'date',
//     }
// }

// export class askAliceLastLocationSelected { }
// askAliceLastLocationSelected.schema = {
//     name: 'askAliceLastLocationSelected',
//     primaryKey: 'fID',
//     properties: {
//         fID: 'string',
//         fUserKey:'string',
//         selectedPlace:'string',
//         fCreatedBy: 'string',
//         fCreatedDate: 'date',
//         fLastModifiedBy: 'string',
//         fLastModifiedDate: 'date',
//     }
// }

// export class announcementData { }
// announcementData.schema = {
//     name: 'announcementData',
//     primaryKey: 'fID',
//     properties: {
//         fID: 'string',
//         fAnnouncementKey:'string',
//         fEndDate:'string',
//         fCreatedBy: 'string',
//         fCreatedDate: 'date',
//         fLastModifiedBy: 'string',
//         fLastModifiedDate: 'date',
//     }
// }


// export class RealmDB {
//     //Define your models and their properties

//     static _realm = null;

//     static getRealm() {
//         if (RealmDB._realm === null) {
//             databaseOptions = {
//                 path: SGHelperFileMgr.getRealmDir() + 'visitorApp.realm',
//                 schema: [tbSystemParamsData,askAliceLastLocationSelected,
//                     tbLookupData, tbUserData, tbInitAppleAcc,announcementData],
//                 schemaVersion: 0,
//             };
//             RealmDB._realm = new Realm(databaseOptions);
//         }
//         return RealmDB._realm;
//     }
//     static beginTransaction(shareTransaction = false) {
//         if (!shareTransaction) { RealmDB.getRealm().beginTransaction(); }
//     }
//     static commitTransaction(shareTransaction = false) {
//         if (!shareTransaction) { RealmDB.getRealm().commitTransaction(); }
//     }
//     static cancelTransaction(shareTransaction = false) {
//         if (!shareTransaction) { RealmDB.getRealm().cancelTransaction(); }
//     }
// };
