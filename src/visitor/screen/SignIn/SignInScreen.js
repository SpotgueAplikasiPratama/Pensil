/**
 * Version 1.2.0
 * 1. Yohanes 29 March 2021
 * - add ErrorHandling
 */
 import React from "react";
 import { Dimensions, StyleSheet, Alert, Platform,BackHandler } from "react-native";
 import { SGBaseScreen } from "../../../core/screen/SGBaseScreen";
 import { SGTabView as TabView, SGButton as Button, SGView as View, SGText as Text, SGTouchableOpacity as TouchableOpacity, SGScrollView as ScrollView, SGImage as Image, SGDialogBox as DialogBox, SGRootScrollView, SGPopView, SGWebView, SGIcon as Icon, SGDialogBox } from "../../../core/control";
 import { SGHelperNavigation, SGHelperGlobalVar, SGHelperType, SGHelperErrorHandling, SGHelperWindow,SGHelperOneSignal } from '../../../core/helper';
//  import {SGHelperFBSDK} from '../../../core/helper';
 import { SGLocalize } from '../../locales/SGLocalize';
 import { tbUserData } from '../../db/tbUserDAO';
 import image from '../../asset/image';
 import DeviceInfo from 'react-native-device-info';
 import { tbVUserAPI } from "../../api/tbVUserAPI";
 import { tbSystemParamsDAO, tbSystemParamsData } from '../../db/tbSystemParamsDAO';
 import { SignInFormWithEmail } from '../../form_V2/SignInFormWithEmail';
 import { SignInFormWithPhoneNumber } from '../../form_V2/SignInFormWithPhoneNumber';
// import { LoginManager, AccessToken } from 'react-native-fbsdk';
//  import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
 import { BackButton } from '../../component_V2/BackButton';
 import { tbCOneSignalAPI } from '../../api/tbCOneSignalAPI';
 import { VisitorHelper } from '../../helper/VisitorHelper';
//  import { AppleButton, appleAuth } from '@invertase/react-native-apple-authentication';
 import RNExitApp from 'react-native-exit-app';
 
 // import jwt_decode from 'jwt-decode';
import MyTranslator from "../../../plugin/lessons/locale/MyTranslator";
 //yohaneslin@spotgue.com
 export class SignInScreen extends SGBaseScreen {
     createStyleSheet() {
         var { w, h, p } = this._screenWHPNoHeader;
         var headerHeight = this._screenWHPNoHeader.h - this._screenWHP.h;
         return StyleSheet.create({
             mainView1: { width: w, backgroundColor: 'white' },
             headerView: { flexDirection: 'row', width: w - 16 * p, justifyContent: 'space-between', alignSelf: 'center' },
             titleText: { marginLeft: 12 * p, marginBottom: 4 * p, alignSelf: 'flex-start' },
             bodyText: { marginLeft: 12 * p, alignSelf: 'flex-start', maxWidth: 0.8 * w, color: '#465056' },
             logo: { backgroundColor: 'transparent', alignSelf: 'flex-end', marginTop: 8 * p, marginBottom: 6 * p },
             sv1_2: { width: w, justifyContent: 'flex-start', backgroundColor: 'white' },
             signHeader: { marginTop: this.showHeader ? p * 5 : p * 5 + headerHeight },
             throwWHP: { width: w, height: h, padding: p },
             text1: { marginTop: p * 3, color: '#909090' },
             text2: { marginTop: p * 10, color: '#7a7a7a' },
             text3: { color: '#7a7a7a' },
             text4: { color: '#63aee0' },
             textView1: { marginTop: p * 4, flexDirection: 'row' },
             tabViewContainer: { width: w * 0.8, height: w * 0.605 },
             tabViewStyle: { marginTop: 8 * p },
             tabBarStyle: { backgroundColor: 'transparent', marginHorizontal: 0, width:w*0.8 },
             button1: { marginTop: 0, backgroundColor: '#465056', width: w * 0.425, height: w * 0.125, justifyContent: "center", alignSelf: "center", alignItems: "center", borderRadius: p * 10, shadowOpacity: 0.15, shadowRadius: 0.5 * p },
             socmedButtonList: { marginTop: 4 * p, flexDirection: 'row' },
             socmedButton: { backgroundColor: 'white', width: w * 0.2, height: w * 0.2 },
             appleButton: { backgroundColor: 'white', width: w * 0.13, height: w * 0.13 },
             vText1: { marginTop: 4 * p, color: 'grey', alignSelf: 'center' },
             vText2: { marginTop: 2 * p, alignSelf: 'center', color: '#63aee0' },
            //  vView: { width: w-2*p, height: h-(w*0.1+SGHelperWindow.getHeaderHeight()-3*p), backgroundColor: '#FFFFFF', borderRadius: 0, justifyContent: 'flex-start' },
            //  vView1: { width: w-2*p, height: h-(w*0.1+SGHelperWindow.getHeaderHeight()-3*p), backgroundColor: '#FFFFFF', borderRadius: 0, justifyContent: 'flex-start' },
            //  vClose: { width: (w-2*p) * 0.1,backgroundColor:'transparent',alignSelf:'flex-end'},
            vView: { width: w - 6 * p, height: Platform.OS === 'ios'?w * 3.35 * 9 / 16: w * 2.8 * 9 / 16, backgroundColor: '#FFFFFF', borderRadius: 0, justifyContent: 'flex-start' },
            vView1: { width: w - 6 * p, height: Platform.OS === 'ios'?w * 3.2 * 9 / 16:w * 2.65 * 9 / 16, backgroundColor: '#FFFFFF', borderRadius: 0, justifyContent: 'flex-start' },
            vClose: { width: w * 0.1, height: w * 0.1, alignSelf: 'flex-end' },
         });
     };
 
     componentDidMount() {
         //Comment GoogleSignin
        //  GoogleSignin.configure({
        //      scopes: ['https://www.googleapis.com/auth/user.birthday.read', 'https://www.googleapis.com/auth/user.gender.read'], // what API you want to access on behalf of the user, default is email and profile
        //      webClientId: '479137611395-gu0chgjoenkqep7n8nakrhom9hk1qa0e.apps.googleusercontent.com', // client ID of type WEB for your server (needed to verify user ID and offline access)
        //      offlineAccess: true, // if you want to access Google API on behalf of the user FROM YOUR SERVER
        //      //hostedDomain: '', // specifies a hosted domain restriction
        //      //loginHint: '', // [iOS] The user's ID, or email address, to be prefilled in the authentication UI if possible. [See docs here](https://developers.google.com/identity/sign-in/ios/api/interface_g_i_d_sign_in.html#a0a68c7504c31ab0b728432565f6e33fd)
        //      forceCodeForRefreshToken: true, // [Android] related to `serverAuthCode`, read the docs link below *.
        //      //accountName: '', // [Android] specifies an account name on the device that should be used
        //      //iosClientId: '<FROM DEVELOPER CONSOLE>', // [iOS] optional, if you want to specify the client ID of type iOS (otherwise, it is taken from GoogleService-Info.plist)
        //  });


         //yohaneslin@spotgue.com
        //  console.log('supported')
        //  console.log(appleAuth.isSupported)
         BackHandler.addEventListener('hardwareBackPress', this.onBackPress);
     }
 
 
     componentWillUnmount() {
         BackHandler.removeEventListener('hardwareBackPress', this.onBackPress);
     }
 
     onBackPress(){
        SGDialogBox.showConfirmation(null, SGLocalize.translate('ExitApp.ExitAppTitle'), SGLocalize.translate('ExitApp.ExitAppDesc'), SGLocalize.translate('ExitApp.No2'), () => { console.log('Close') },SGLocalize.translate('ExitApp.Yes2'), () => {RNExitApp.exitApp()}, true)
         return true;
     }
 
     async _assignValueSignIn(sourceUserData,token){
         
             this.userDataSetting = await tbSystemParamsDAO.getUserDataSetting()
             this.userTokenData = await tbSystemParamsDAO.getUserDataToken()
             if(this.userDataSetting.fID===''){
                 this.userDataSetting.fID = SGHelperType.getGUID()
                 this.userDataSetting.fActive='Y'
                 this.userDataSetting.fCreatedBy='25ed05dc-d5c2-4cd8-f051-08d86aa18a6b'
                 this.userDataSetting.fCreatedDate=new Date()
                 this.userDataSetting.fCreatedBy='25ed05dc-d5c2-4cd8-f051-08d86aa18a6b'
                 this.userDataSetting.fLastModifiedDate= new Date()
                 this.userDataSetting.fParams = 'userDataSetting';
                 this.userDataSetting.fValue = JSON.stringify(sourceUserData);
                 console.log('addSysParam')
                 await tbSystemParamsDAO.addSystemParams(this.userDataSetting);
             }else{
                 console.log('updateSysParam')
                 this.userDataSetting.fLastModifiedDate = new Date()
                 await tbSystemParamsDAO.updateUserDataSetting(this.userDataSetting,sourceUserData)
             }
             if(this.userTokenData.fID===''){
                 this.userTokenData.fID = SGHelperType.getGUID()
                 this.userTokenData.fActive='Y'
                 this.userTokenData.fCreatedBy='25ed05dc-d5c2-4cd8-f051-08d86aa18a6b'
                 this.userTokenData.fCreatedDate=new Date()
                 this.userTokenData.fCreatedBy='25ed05dc-d5c2-4cd8-f051-08d86aa18a6b'
                 this.userTokenData.fLastModifiedDate= new Date()
                 this.userTokenData.fParams = 'userTokenData';
                 this.userTokenData.fValue = JSON.stringify(token);
                 console.log('addSysParam')
                 await tbSystemParamsDAO.addSystemParams(this.userTokenData);
             }else{
                 console.log('updateSysParam')
                 this.userTokenData.fActive='Y'
                 this.userTokenData.fLastModifiedDate = new Date()
                 await tbSystemParamsDAO.updateUserDataToken(this.userTokenData,token)
             }
             //  await tbSystemParamsDAO.consoleAllData()
             // console.log(tbSystemParamsDAO.consoleAllData())
             SGHelperGlobalVar.addVar('GlobalCurrentUserData', sourceUserData);
             SGHelperGlobalVar.addVar('GlobalCurrentUser', sourceUserData.fID);
             SGHelperGlobalVar.addVar('GlobalCurrency', sourceUserData.fCurrency);
             SGHelperGlobalVar.addVar('GlobalCurrentUserImage', 'https://spotgue.com/dev/visitor/avatar.png');
             SGHelperGlobalVar.addVar('GlobalImageSetting', sourceUserData.fImageSetting);
             SGLocalize.changeLanguage((sourceUserData.fLanguage).toLowerCase());
             MyTranslator.changeLanguage((sourceUserData.fLanguage).toLowerCase());
             SGHelperGlobalVar.addVar('GlobalLanguage', sourceUserData.fLanguage);
             SGHelperGlobalVar.addVar('GlobalAnonymous', false);
             var status = await SGHelperOneSignal.getDeviceState()
             tbCOneSignalAPI.editOneSignalNotificationTags(status.userId);
             console.log(this.dbID)
             if(this.dbID!==null)SGDialogBox.hideDialogBox(this.dbID,true)
            //  console.log(await tbSystemParamsDAO.consoleAllData())
             SGHelperNavigation.navigateReset(this.props.navigation, 'Home',{signIn :true});
     }
     _getUserLoginInputSpotgue (dataInput,type){
         return {
             emailOrPhone: type == 'email' ? dataInput.fEmail : dataInput.fPhoneNumber,
             fDeviceID: DeviceInfo.getUniqueId(),
             password: SGHelperType.encrypt(dataInput.fPassword),
             fDeviceModel: DeviceInfo.getModel(),
             fDeviceBrand: DeviceInfo.getBrand(),
             fDeviceOS: DeviceInfo.getSystemName(),
             fDeviceOSVersion: DeviceInfo.getSystemVersion(),
             fDeviceHeight: (Dimensions.get('screen').width),
             fDeviceWidth: (Dimensions.get('screen').width),
             fLoginLocation: ""
         }
     }
 
     async _onSignInPress() {
         var dataInput = this.userData.getCurrentJSON();
         // mode email login
         if (this._activeTab === 0) {
             if (dataInput.fEmail !== '' && dataInput.fPassword !== '') {
                 var userLoginInput = this._getUserLoginInputSpotgue(dataInput,'email')
                 var tr=SGLocalize.translate
                 this.baseRunSingleAPIWithRedoOption('authenticate', (async (v1) => {this.dbID=SGDialogBox.showLoading(tr("AlertMessage.Waiting")); return tbVUserAPI.authenticate(v1) }).bind(this,userLoginInput), (async(v) => {
                    console.log(v)
                    console.log('result authenticate')
                    var result = v
                     SGHelperGlobalVar.addVar("token", v.token);
                     this.baseRunSingleAPIWithRedoOption('getUserByID', (async () => {if(this.dbID===null)this.dbID=SGDialogBox.showLoading(tr("AlertMessage.Waiting")); return tbVUserAPI.getUserByID() }).bind(this), (async(userData) => {
                         await this._assignValueSignIn(userData,result)
                     }).bind(this), (()=>{SGDialogBox.hideDialogBox(this.dbID,true);this.dbID=null;}),  SGHelperGlobalVar.getVar("ResponTimes"));
                 }).bind(this), (()=>{SGDialogBox.hideDialogBox(this.dbID,true)}),  SGHelperGlobalVar.getVar("ResponTimes"));
             }
             else {
                 DialogBox.showFail(null, SGLocalize.translate('SignInScreen.alert3SignInTitle'), SGLocalize.translate("SignInScreen.alert3SignInText"), SGLocalize.translate('globalText.ok'), () => { }, true)
             }
         }
         //mode phone number login
         if (this._activeTab === 1) {
             if (dataInput.fPhoneNumber !== '' && dataInput.fPassword !== '') {
                 dataInput.fPhoneNumber = VisitorHelper.checkPhoneNumberCountryCode(this.countryPhoneCode, VisitorHelper._getPhoneNumber(dataInput.fPhoneNumber));
                 var userLoginInput = this._getUserLoginInputSpotgue(dataInput,'phoneNumber')
                 var tr=SGLocalize.translate
                 this.baseRunSingleAPIWithRedoOption('authenticate', (async (v1) => {this.dbID=SGDialogBox.showLoading(tr("AlertMessage.Waiting")); return tbVUserAPI.authenticate(v1) }).bind(this,userLoginInput), (async(v) => {
                     var result = v
                     SGHelperGlobalVar.addVar("token", v.token);
                     this.baseRunSingleAPIWithRedoOption('getUserByID', (async () => {if(this.dbID===null)this.dbID=SGDialogBox.showLoading(tr("AlertMessage.Waiting")); return tbVUserAPI.getUserByID() }).bind(this), (async(v) => {
                         await this._assignValueSignIn(v,result)
                         
                     }).bind(this), (()=>{SGDialogBox.hideDialogBox(this.dbID,true);this.dbID=null;}),  SGHelperGlobalVar.getVar("ResponTimes"));
                 }).bind(this), (()=>{SGDialogBox.hideDialogBox(this.dbID,true)}),  SGHelperGlobalVar.getVar("ResponTimes"));
             }
             else {
                 DialogBox.showFail(null, SGLocalize.translate('SignInScreen.alert3SignInTitle'), SGLocalize.translate("SignInScreen.alert3SignInText"), SGLocalize.translate('globalText.ok'))
             }
         }
     }
 
     _onChangeTab(e) {
         this._activeTab = e.i;
         this.forceUpdate();
     }
 
     _setCountryPhoneCode(v) {
         this.countryPhoneCode = v;
         this.forceUpdate();
     }
 
     constructor(props, context, ...args) {
         super(props, context, ...args);
         try {
             this.showHeader = false;
             this.showHeader = this.props.route.params.showHeader;
             
         } catch (error) {
         }
 
         this.style = this.createStyleSheet(this.WHPNoHeader);
         this.props.navigation.setOptions({
             headerShown: this.showHeader,
             headerTitle: ''
         });
         this.userData = new tbUserData();
         this.imageSetting = SGHelperGlobalVar.getVar('GlobalImageSetting');
         this._activeTab = 0;
         this.pvID1 = SGPopView.getPopViewID();
         this.pvID2 = SGPopView.getPopViewID();
         this.tokenGoogle;
         this.userInfo;
         this.countryPhoneCode = '+62';
         this.showFB = SGHelperType.getSystemParamsValue("FacebookSignIn")
         this.showGoogle = SGHelperType.getSystemParamsValue("GoogleSignIn")
         this.showApple = SGHelperType.getSystemParamsValue("AppleSignIn")
     }
 
     _showTermAndCondition() {
         SGPopView.showPopView(this.pvID1);
     }
 
     _hideTermAndCondition() {
         SGPopView.hidePopView(this.pvID1);
     }
 
     _showPrivacyPolicy() {
         SGPopView.showPopView(this.pvID2);
     }
 
     _hidePrivacyPolicy() {
         SGPopView.hidePopView(this.pvID2);
     }
 
     async signInFBCallBack(data){
         var objThis = SGHelperGlobalVar.getVar('FBSignIn.this');
         var userData = objThis.__userData;
         var navigation = objThis.__navigation;
         var userLoginInput = {
             facebookUserID: data.userID,
             fDeviceID: DeviceInfo.getUniqueId(),
             fDeviceModel: DeviceInfo.getModel(),
             fDeviceBrand: DeviceInfo.getBrand(),
             fDeviceOS: DeviceInfo.getSystemName(),
             fDeviceOSVersion: DeviceInfo.getSystemVersion(),
             fDeviceHeight: (Dimensions.get('screen').width),
             fDeviceWidth: (Dimensions.get('screen').width),
             fLoginLocation: "",
             fEmail:""
         }
         try {
             var tr =SGLocalize.translate
             objThis.dbID = SGDialogBox.showLoading(tr("AlertMessage.Waiting"))
             var dataFacebook = await tbVUserAPI.getFacebookData(data.userID, data.accessToken);
             userLoginInput.fEmail=dataFacebook.email
             var result = await tbVUserAPI.authenticateByFB(userLoginInput);
             SGHelperGlobalVar.addVar("token", result.token);
             var sourceUserData = await tbVUserAPI.getUserByID();
             await this._assignValueSignIn(sourceUserData,result);
         } catch (error) {
             SGDialogBox.hideDialogBox(objThis.dbID,false);
             SGHelperErrorHandling.Handling(error,objThis.signInFB.bind(objThis,objThis._userData,objThis._navigation))
         }
     }
     
     async signInFB(userData, navigation) {
         if(!SGHelperGlobalVar.isVar('FBSignIn.this')){
             SGHelperGlobalVar.addVar('FBSignIn.this',this);
         } else {
             SGHelperGlobalVar.setVar('FBSignIn.this',this);
         }
         this.__userData = userData;
         this.__navigation = navigation;
  
         if(this.showFB==='Y'){
             SGHelperFBSDK.logOut()
             SGHelperFBSDK.setLoginBehavior('WEB_ONLY');
             SGHelperFBSDK.logInWithPermissions(["email", "public_profile", "user_birthday", "user_gender"]).then(
                 async function (result) {
                     if (result.isCancelled) {
                         console.log('Login cancelled')
                     } else {
                         console.log('Login success with permissions: ' + result.grantedPermissions.toString())
                         console.log(await SGHelperFBSDK.getCurrentAccessToken())
                         SGHelperFBSDK.getCurrentAccessToken().then(
                             async (data) => {
                                 setTimeout((()=>{
                                     var objThis = SGHelperGlobalVar.getVar('FBSignIn.this');
                                     objThis.signInFBCallBack(data);
                                 }).bind(this,data),500)
                             })
                     }
                 },
                 function (error) {
                     console.log('Login fail with error: ' + error)
                 }
             )
         }else{
             SGDialogBox.showFail(null, SGLocalize.translate("AlertMessage.Fail"), SGLocalize.translate('AlertPermission.DisableFeature'), SGLocalize.translate("AlertMessage.OK"), async () => {  }, true)
         }
 
     }
 
     async checkAPIBatchStatusAllDone() {
         if (this.status.userInfo &&
             this.status.token
         ) {
             // var dataGoogle = await tbVUserAPI.getGoogleData(this.userInfo.user.id, this.tokenGoogle.accessToken);

             var userLoginInput = {
                 googleUserID: this.userInfo.user.id,
                 fDeviceID: DeviceInfo.getUniqueId(),
                 fDeviceModel: DeviceInfo.getModel(),
                 fDeviceBrand: DeviceInfo.getBrand(),
                 fDeviceOS: DeviceInfo.getSystemName(),
                 fDeviceOSVersion: DeviceInfo.getSystemVersion(),
                 fDeviceHeight: (Dimensions.get('screen').width),
                 fDeviceWidth: (Dimensions.get('screen').width),
                 fLoginLocation: "",
                 fEmail:this.userInfo.user.email
             }
             var tr = SGLocalize.translate
             this.baseRunSingleAPIWithRedoOption('authenticateByGoogle', (async (v1) => {this.dbID=SGDialogBox.showLoading(tr("AlertMessage.Waiting")); return tbVUserAPI.authenticateByGoogle(v1) }).bind(this,userLoginInput), (async(v) => {
                 var result = v
                 SGHelperGlobalVar.addVar("token", v.token);
                 this.baseRunSingleAPIWithRedoOption('getUserByID', (async () => {if(this.dbID===null)this.dbID=SGDialogBox.showLoading(tr("AlertMessage.Waiting")); return tbVUserAPI.getUserByID() }).bind(this), (async(v) => {
                     await this._assignValueSignIn(v,result);
                     SGDialogBox.hideDialogBox(this.dbID,true);
                     this.dbID=null;
                     SGHelperNavigation.navigateReset(this.props.navigation, 'Home',{signIn :true});
                 }).bind(this), (()=>{SGDialogBox.hideDialogBox(this.dbID,true);this.dbID=null;}).bind(this),  SGHelperGlobalVar.getVar("ResponTimes"));
             }).bind(this), (()=>{ SGDialogBox.hideDialogBox(this.dbID,true)}).bind(this),  SGHelperGlobalVar.getVar("ResponTimes"));
         }
     }
     async _onYesAppleSignIn(userData){
 
         SGHelperNavigation.navigate(this.props.navigation, 'SignUpForm', { data: userData, selectedTab: '' })
 
         
     }
     async _addAppleAccount(userData,appleAuthRequestResponse){
         try {
             if(this.dbID==null)this.dbID = SGDialogBox.showLoading(SGLocalize.translate("AlertMessage.Waiting"))
             userData.fEmail = appleAuthRequestResponse.email
             userData.fName = appleAuthRequestResponse.fullName.givenName
             userData.fAppleID = appleAuthRequestResponse.user
             userData.fRegisterMethod="apple"
             //callAPI
             await tbVUserAPI.addAppleAccount(userData.getCurrentJSON());
             SGDialogBox.hideDialogBox(this.dbID)
         } catch (error) {
             this.dbID=null
             SGDialogBox.hideDialogBox(this.dbID)
             SGHelperErrorHandling.Handling(error,this._addAppleAccount.bind(this,userData,appleAuthRequestResponse))
         }
     }
     async onAppleButtonPress2(appleAuthRequestResponse){
         try {
            var userLoginInput = {
                appleUserID: appleAuthRequestResponse.user,
                fDeviceID: DeviceInfo.getUniqueId(),
                fDeviceModel: DeviceInfo.getModel(),
                fDeviceBrand: DeviceInfo.getBrand(),
                fDeviceOS: DeviceInfo.getSystemName(),
                fDeviceOSVersion: DeviceInfo.getSystemVersion(),
                fDeviceHeight: (Dimensions.get('screen').width),
                fDeviceWidth: (Dimensions.get('screen').width),
                fLoginLocation: "",
                fEmail: ""
            }
            var appleAccount=await tbVUserAPI.getAppleAccount(appleAuthRequestResponse.user)
            userLoginInput.fEmail=appleAccount.fEmail
            var tr = SGLocalize.translate
            this.baseRunSingleAPIWithRedoOption('authenticateByApple', (async (v1) => {this.dbID=SGDialogBox.showLoading(tr("AlertMessage.Waiting")); return tbVUserAPI.authenticateByApple(v1) }).bind(this,userLoginInput), (async(v) => {
                var result = v
                if(v.fUserType==="NotRegistered"){
                    var tR = SGLocalize.translate
                    var userData= new tbUserData()
                    if(appleAuthRequestResponse.email===null){
                       //  this.baseRunSingleAPIWithRedoOption('getAppleAccount', (async (v1) => { return tbVUserAPI.getAppleAccount(v1) }).bind(this,appleAuthRequestResponse.user), (async(v) => {
                           SGDialogBox.hideDialogBox(this.dbID) 
                           if(appleAccount.fActive==="NotFound"){
                                DialogBox.showFail(null, SGLocalize.translate('SignUpScreen.alert1SignUpFailTitle'), SGLocalize.translate("SignUpScreen.alertSignUpFailAppleNeedToUninstall"), SGLocalize.translate('globalText.ok'), () => { }, true)
                            }else{
                               console.log('1')
                               this.baseRunSingleAPIWithRedoOption('isEmailOrPhoneAvailable', (async (v1) => { return tbVUserAPI.isEmailOrPhoneAvailable(v1) }).bind(this,appleAccount.fEmail), (async(vRes) => {
                                   console.log(vRes)
                                   if (vRes.canBeUsed == false) {
                                     DialogBox.showFail(null, SGLocalize.translate('SignUpScreen.alert1SignUpFailTitle'), SGLocalize.translate("SignInScreen.alertAppleSignInText"), SGLocalize.translate('globalText.ok'))
                                 }else{
                                    this.baseRunSingleAPIWithRedoOption('isEmailOrPhoneDeleted', (async (v1) => { return tbVUserAPI.isEmailOrPhoneDeleted(v1) }).bind(this,appleAccount.fEmail), (async(v) => {
                                        if(v == true){
                                            userData.fEmail = appleAccount.fEmail
                                            userData.fName = appleAccount.fName
                                            userData.fAppleID = appleAccount.fAppleID
                                            userData.fRegisterMethod="apple"
                                            SGDialogBox.showConfirmation(null,
                                            tR('AlertMessage.Confirmation'),
                                            tR('SignInScreen.SignInAppleExist',{email:appleAccount.fEmail}),
                                            tR('AlertMessage.No'), () => { },
                                            tR('AlertMessage.Yes'), async () => { this._onYesAppleSignIn(userData) })
                                        }
                                    }).bind(this),  null,  SGHelperGlobalVar.getVar("ResponTimes"));
                                 }
                               }).bind(this),  null,  SGHelperGlobalVar.getVar("ResponTimes"));   
                            }
    
                       //  }).bind(this), ()=>{SGDialogBox.hideDialogBox(this.dbID)},  SGHelperGlobalVar.getVar("ResponTimes"));
                    }else{
                       var isAvailable = await tbVUserAPI.isEmailOrPhoneAvailable(appleAuthRequestResponse.email);
                       SGDialogBox.hideDialogBox(this.dbID)
                        if(isAvailable.canBeUsed == false){
                          DialogBox.showFail(null, SGLocalize.translate('SignUpScreen.alert1SignUpFailTitle'), SGLocalize.translate("SignInScreen.alertAppleSignInText"), SGLocalize.translate('globalText.ok'))
                       }
                       else{
                        var isAvailable = await tbVUserAPI.isEmailOrPhoneDeleted(appleAuthRequestResponse.email);
                            if(isAvailable == true){
                                await this._addAppleAccount(userData,appleAuthRequestResponse)
                                SGDialogBox.showConfirmation(null,
                                tR('AlertMessage.Confirmation'),
                                tR('SignInScreen.SignInAppleExist',{email:appleAuthRequestResponse.email}),
                                tR('AlertMessage.No'), () => { },
                                tR('AlertMessage.Yes'), async () => { this._onYesAppleSignIn(userData) })
                            }
                       }
                    }
                    // SGHelperNavigation.navigate(this.props.navigation, 'SignUpForm', { data: userData, selectedTab: '' })
                }else{
                    SGHelperGlobalVar.addVar("token", v.token);
                    this.baseRunSingleAPIWithRedoOption('getUserByID', (async () => {if(this.dbID===null)this.dbID=SGDialogBox.showLoading(tr("AlertMessage.Waiting")); return tbVUserAPI.getUserByID() }).bind(this), (async(v) => {
                        await this._assignValueSignIn(v,result)
                    }).bind(this),  (()=>{SGDialogBox.hideDialogBox(this.dbID,true);this.dbID=null;}),  SGHelperGlobalVar.getVar("ResponTimes"));
                }
              
            }).bind(this),  (()=>{SGDialogBox.hideDialogBox(this.dbID,true)}),  SGHelperGlobalVar.getVar("ResponTimes"));
         } catch (error) {
             SGHelperErrorHandling.Handling(error,this.onAppleButtonPress2.bind(this,appleAuthRequestResponse))
         }
      

     }
     async onAppleButtonPress() {
         if(this.showApple==='Y'){
             console.warn('Beginning Apple Authentication');
 
             // start a login request
             try {
                 const appleAuthRequestResponse = await appleAuth.performRequest({
                     requestedOperation: appleAuth.Operation.LOGIN,
                     requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
                 });
 
                 console.log('appleAuthRequestResponse', appleAuthRequestResponse);
 
                 const {
                     user: newUser,
                     email,
                     nonce,
                     identityToken,
                     realUserStatus /* etc */,
                 } = appleAuthRequestResponse;
 
                 user = newUser;
 
 
                 if (identityToken) {
                        await this.onAppleButtonPress2(appleAuthRequestResponse)
                 } else {
                     DialogBox.showFail(null, SGLocalize.translate('SignInScreen.alert1SignInTitle'), SGLocalize.translate("SignInScreen.alertSomethingWrongSignIn"), SGLocalize.translate('globalText.ok'))
                 }
 
                 if (realUserStatus === appleAuth.UserStatus.LIKELY_REAL) {
                     console.log("I'm a real person!");
                 }
 
                 console.warn(`Apple Authentication Completed, ${user}, ${email}`);
             } catch (error) {
                 if (error.code === appleAuth.Error.CANCELED) {
 
                     const appleAuthRequestResponse = await appleAuth.performRequest({
                         requestedOperation: appleAuth.Operation.LOGOUT
                     });
                     console.warn('User canceled Apple Sign in.');
                 } else {
                     console.error(error);
                 }
    
             }
 
             // // performs login request
             // const appleAuthRequestResponse = await appleAuth.performRequest({
             //     requestedOperation: appleAuth.Operation.LOGIN,
             //     requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
             // });
             // console.log(appleAuthRequestResponse)
             // // get current authentication state for user
             // // /!\ This method must be tested on a real device. On the iOS simulator it always throws an error.
             // const credentialState = await appleAuth.getCredentialStateForUser(appleAuthRequestResponse.user);
 
             // // use credentialState response to ensure the user is authenticated
             // if (credentialState === appleAuth.State.AUTHORIZED) {
             //     // user is authenticated
             // }
         }else{
             SGDialogBox.showFail(null, SGLocalize.translate("AlertMessage.Fail"), SGLocalize.translate('AlertPermission.DisableFeature'), SGLocalize.translate("AlertMessage.OK"), async () => {  }, true)
         }
     }
 
     async _signInGoogle () {
         if(this.showGoogle==='Y'){
             try {
                 await GoogleSignin.hasPlayServices();
     
                 this.status = {
                     userInfo: false,
                     token: false
                 }
                 await GoogleSignin.signIn().then((async (v) => {
                     this.userInfo = v
                     this.status.userInfo = true; 
                     await GoogleSignin.getTokens().then(((v) => {
                         this.tokenGoogle = v
                         this.status.token = true; 
                        //  console.log("YOHANES")
                        //  console.log(this.userInfo.user.email)
                        //  console.log(this.tokenGoogle)
                         setTimeout((()=>{
                             this.checkAPIBatchStatusAllDone();
                         }).bind(this),500);
                     }).bind(this));
                 }).bind(this));
     
     
             } catch (error) {
                 if (error.code === statusCodes.SIGN_IN_CANCELLED) {
                     await GoogleSignin.signOut();
                 } else if (error.code === statusCodes.IN_PROGRESS) {
                     // operation (e.g. sign in) is in progress already
                 } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
                     // play services not available or outdated
                 } else {
                     // some other error happened
                 }
                 console.log(error)
             }
         }
         else{
             SGDialogBox.showFail(null, SGLocalize.translate("AlertMessage.Fail"), SGLocalize.translate('AlertPermission.DisableFeature'), SGLocalize.translate("AlertMessage.OK"), async () => {  }, true)
         }
     }
 
 
     _getValueTermNCondition() {
         if (this._language == 'id')
             return SGHelperType.getSystemParamsValue('snkID')
         else if (this._language == 'en') {
             return SGHelperType.getSystemParamsValue('snkEN')
         } else if (this._language == 'cn') {
             return SGHelperType.getSystemParamsValue('snkCN')
         }
     }
 
     _getPolicy() {
         if (this._language == 'id')
             return SGHelperType.getSystemParamsValue('privacyID')
         else if (this._language == 'en') {
             return SGHelperType.getSystemParamsValue('privacyEN')
         } else if (this._language == 'cn') {
             return SGHelperType.getSystemParamsValue('privacyCN')
         }
     }
 
 
     render() {
 
         var { w, h, p } = this.WHPNoHeader;
         var style = this.style;
         var uriTermAndCondition = this._getValueTermNCondition();
         var uriPolicy = this._getPolicy();
         
         return (
             <SGRootScrollView accessible={true} accessibilityLabel={'SignInScreenRootScrollView'} style={style.mainView1} contentContainerStyle={style.sv1_2}>
 
                 <SGPopView popViewID={this.pvID1} on animationType={'slide'} vPos='Top'>
                     <View style={style.vView}>
                        <TouchableOpacity style={style.vClose} onPress={() => { this._hideTermAndCondition() }}>
                             <Icon name={Icon.Icon.closecircle} preset={Icon.preset.h1} style={{ color: '#181818' }}></Icon>
                         </TouchableOpacity>
                         <SGWebView accessible={true} accessibilityLabel={'WebViewTermAndCondition'} style={style.vView1} source={{ uri: uriTermAndCondition }} />
                     </View>
                 </SGPopView>
 
                 <SGPopView popViewID={this.pvID2} on animationType={'slide'} vPos='Top'>
                     <View style={style.vView}>
                        <TouchableOpacity style={style.vClose} onPress={() => { this._hidePrivacyPolicy() }}>
                             <Icon name={Icon.Icon.closecircle} preset={Icon.preset.h1} style={{ color: '#181818' }}></Icon>
                         </TouchableOpacity>
                         <SGWebView accessible={true} accessibilityLabel={'WebViewTermAndCondition'} style={style.vView1} source={{ uri: uriPolicy }} />
                     </View>
                 </SGPopView>
 
                 <View style={style.headerView}>
                     <BackButton color={'black'} hidden={!SGHelperNavigation.canGoBack(this.props.navigation)} imageSetting={this.imageSetting} navigator={this.props.navigation}></BackButton>
                     <Image source={{ uri: image.magLogoOnly[this.imageSetting].url }} style={style.logo}></Image>
                 </View>
                 <Text preset={Text.preset.titleH1B} style={style.titleText}>{SGLocalize.translate("SignInScreen.headerTitle")}</Text>
                 <Text preset={Text.preset.titleH3} style={style.bodyText}>{SGLocalize.translate("SignUpScreen.bodyText")}</Text>
                 <View style={style.tabViewContainer}>
                     <TabView accessible={true} accessibilityLabel={'HomeScreenTabView'} tabBarStyle={style.tabBarStyle} tabBarTextStyle={style.tabBarTextStyle} tabBarUnderlineStyle={{ backgroundColor: '#181818', height: 0.5 * p }} tabBarActiveTextPreset={Text.preset.titleH2B} tabBarInactiveTextPreset={Text.preset.titleH2} style={style.tabViewStyle} initialPage={0} onChangeTab={this._onChangeTab.bind(this)} renderTabBar={() => <DefaultTabBar />}  >
                         <View tabLabel={'Email'}>
                             <SignInFormWithEmail accessible={true} accessibilityLabel={'SignInScreenForm'} language={this.Language} placeholder={SGLocalize.translate("SignInScreen.input1")} userData={this.userData} style={style.throwWHP}></SignInFormWithEmail>
                         </View>
                         <View tabLabel={'Phone Number'}>
                             <SignInFormWithPhoneNumber accessible={true} accessibilityLabel={'SignInScreenForm'} language={this.Language} placeholder={SGLocalize.translate("SignInScreen.input1")} userData={this.userData} onChangeCountryPhoneCode={this._setCountryPhoneCode.bind(this)} style={style.throwWHP}></SignInFormWithPhoneNumber>
                         </View>
                     </TabView>
                 </View>
 
                 <Button accessible={true} accessibilityLabel={'SignInScreenSignInButton'} textPreset={Text.preset.titleH3B} style={style.button1} label={SGLocalize.translate("SignInScreen.buttonSignIn")} onPress={this._onSignInPress.bind(this)}>
                 </Button>
 
                 <TouchableOpacity onPress={() => SGHelperNavigation.navigatePush(this.props.navigation, 'ForgotPasswordSecurity1')}>
                     <Text accessible={true} accessibilityLabel={'SignInScreenForgotPass'} preset={Text.preset.titleH4_5} style={style.text1}>{SGLocalize.translate("SignInScreen.text1")}</Text>
                 </TouchableOpacity>
                 <Text accessible={true} accessibilityLabel={'SignInScreenSignInText'} preset={Text.preset.titleH3B} style={style.text2}>{SGLocalize.translate("SignInScreen.text2")}</Text>
 
                 <View>
                 </View>
                 <View accessible={true} accessibilityLabel={'SignInScreenSocMedView'} style={style.socmedButtonList}>
                    {this.showFB == 'Y' &&
                     <TouchableOpacity onPress={() => this.signInFB(this.userData, this.props.navigation)}>
                         <Image accessible={true} accessibilityLabel={'SignInScreenFBButtonImage'} style={style.socmedButton} source={{ uri: image.facebookButton[this.imageSetting].url }}></Image>
                     </TouchableOpacity>
                     }
                     
 
                     {Platform.OS === 'ios' &&  this.showApple =='Y' &&
                         <TouchableOpacity onPress={() => this.onAppleButtonPress()}>
                             <Image accessible={true} accessibilityLabel={'SignInAppleButtonImage'} style={style.appleButton} source={{ uri: image.appleButton[this.imageSetting].url }}></Image>
                         </TouchableOpacity>
                     }

                     {this.showGoogle =='Y' &&
                     <TouchableOpacity onPress={this._signInGoogle.bind(this)}>
                         <Image accessible={true} accessibilityLabel={'SignInScreenGoogleButtonImage'} style={style.socmedButton} source={{ uri: image.googleButton[this.imageSetting].url }}></Image>
                     </TouchableOpacity>
                     }
   
                 </View>
                 <View accessible={true} accessibilityLabel={'SignInScreenTextView'} style={style.textView1}>
                     <Text accessible={true} accessibilityLabel={'SignInScreenSignText'} preset={Text.preset.titleH3B} style={style.text3}>{SGLocalize.translate("SignInScreen.text3")}</Text>
                     <TouchableOpacity onPress={() => SGHelperNavigation.navigateReset(this.props.navigation, 'SignUp')}>
                         <Text accessible={true} accessibilityLabel={'SignInScreenSignUpText'} preset={Text.preset.titleH3B} style={style.text4}>{SGLocalize.translate("SignInScreen.text4")}</Text>
                     </TouchableOpacity>
                 </View>
 
                 <Text preset={Text.preset.titleH4} style={style.vText1}>{SGLocalize.translate("SignInScreen.text5")}</Text>
                 <View style={{ width: w, flexDirection: 'row' }}>
                     <TouchableOpacity onPress={() => { this._showTermAndCondition() }}>
                         <Text preset={Text.preset.titleH4B} style={style.vText2}>{SGLocalize.translate("SignInScreen.text6")}</Text>
                     </TouchableOpacity>
                     <Text style={{ color: 'grey' }}>&</Text>
                     <TouchableOpacity onPress={() => { this._showPrivacyPolicy() }}>
                         <Text preset={Text.preset.titleH4B} style={style.vText2}>{SGLocalize.translate("SignInScreen.text7")}</Text>
                     </TouchableOpacity>
                 </View>
 
             </SGRootScrollView>
         );
     }
 }
