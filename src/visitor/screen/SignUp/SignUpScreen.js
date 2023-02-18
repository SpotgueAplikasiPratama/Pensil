import React from "react";
import { StyleSheet, Platform, Alert } from "react-native";
import { SGBaseScreen } from "../../../core/screen/SGBaseScreen";
import { SGImage as Image, SGTouchableOpacity as TouchableOpacity, SGButton as Button, SGText as Text, SGView as View, SGRootView as RootView, SGRootScrollView, SGScrollView, SGDialogBox as DialogBox, SGTabView as TabView,SGPopView,SGIcon as Icon ,SGWebView, SGDialogBox} from "../../../core/control";
import { SGHelperNavigation, SGHelperGlobalVar, SGHelperType, SGHelperErrorHandling } from '../../../core/helper';
//  import {SGHelperFBSDK} from '../../../core/helper';
import { SGLocalize } from '../../locales/SGLocalize';
import { tbUserData } from '../../db/tbUserDAO';
import { SignUpFormWithEmail } from '../../form_V2/SignUpFormWithEmail';
import { SignUpFormWithPhoneNumber } from '../../form_V2/SignUpFormWithPhoneNumber';
import image from '../../asset/image';
import { tbVUserAPI } from '../../api/tbVUserAPI';
//import { LoginButton, LoginManager, AccessToken } from 'react-native-fbsdk';
// import { GoogleSignin, GoogleSigninButton, statusCodes } from '@react-native-google-signin/google-signin';
import { BackButton } from '../../component_V2/BackButton';
import { VisitorHelper } from '../../helper/VisitorHelper';
// import { AppleButton, appleAuth } from '@invertase/react-native-apple-authentication';
import { tbInitAppleAccDAO } from '../../db/tbInitAppleAccDAO';

export class SignUpScreen extends SGBaseScreen {
    createStyleSheet() {
        var { w, h, p } = this._screenWHPNoHeader;
        var headerHeight = this._screenWHPNoHeader.h - this._screenWHP.h;
        return StyleSheet.create({
            mainView1: { width: w, backgroundColor: 'white' },
            headerView: { flexDirection: 'row', width: w - 16 * p, justifyContent: 'space-between', alignSelf: 'center' },
            welcomeText: { marginLeft: 12 * p, marginBottom: 4 * p, alignSelf: 'flex-start' },
            welcomeBodyText: { marginLeft: 12 * p, alignSelf: 'flex-start', maxWidth: 0.8 * w, color: '#465056' },
            sv1_2: { width: w, justifyContent: 'center', backgroundColor: 'white' },
            throwWHP: { width: w, height: h, padding: p },
            containerView1: { padding: p },
            text1: { color: '#909090' },
            text2: { color: '#63aee0' },
            text3: { marginTop: w * 0.12, color: '#7a7a7a' },
            button1: { backgroundColor: '#465056', width: w * 0.425, height: w * 0.125, justifyContent: "center", alignSelf: "center", alignItems: "center", borderRadius: p * 10, shadowOpacity: 0.15, shadowRadius: 0.5 * p },
            textView1: { marginTop: w * 0.03, flexDirection: 'row' },
            textView2: { marginTop: w * 0.01, flexDirection: 'row' },
            socmedButtonList: { marginTop: w * 0.06, flexDirection: 'row' },
            socmedButton: { backgroundColor: 'white', width: w * 0.2, height: w * 0.2 },
            appleButton: { backgroundColor: 'white', width: w * 0.13, height: w * 0.13 },
            tabViewContainer: { width: w * 0.8, height: w * 0.443 },
            tabViewStyle: { marginTop: 8 * p, },
            tabBarStyle: { backgroundColor: 'transparent', marginHorizontal: 0, width:w*0.8 },
            logo: { backgroundColor: 'transparent', alignSelf: 'flex-end', marginTop: 8 * p, marginBottom: 6 * p },
            vText1: { marginTop: 4 * p, color: 'grey', alignSelf: 'center' },
            vText2: { marginTop: 2 * p, alignSelf: 'center', color: '#63aee0' },
            vView: { width: w - 6 * p, height: Platform.OS === 'ios'?w * 3.35 * 9 / 16: w * 2.8 * 9 / 16, backgroundColor: '#FFFFFF', borderRadius: 0, justifyContent: 'flex-start' },
            vView1: { width: w - 6 * p, height: Platform.OS === 'ios'?w * 3.2 * 9 / 16:w * 2.65 * 9 / 16, backgroundColor: '#FFFFFF', borderRadius: 0, justifyContent: 'flex-start' },
            vClose: { width: w * 0.1, height: w * 0.1, alignSelf: 'flex-end' },
        });
    };

    componentDidMount() {
        //Comment GoogleSignin
        // GoogleSignin.configure({
        //     scopes: ['https://www.googleapis.com/auth/user.birthday.read', 'https://www.googleapis.com/auth/user.gender.read'], // what API you want to access on behalf of the user, default is email and profile
        //     webClientId: '479137611395-gu0chgjoenkqep7n8nakrhom9hk1qa0e.apps.googleusercontent.com', // client ID of type WEB for your server (needed to verify user ID and offline access)
        //     offlineAccess: true, // if you want to access Google API on behalf of the user FROM YOUR SERVER
        //     //hostedDomain: '', // specifies a hosted domain restriction
        //     //loginHint: '', // [iOS] The user's ID, or email address, to be prefilled in the authentication UI if possible. [See docs here](https://developers.google.com/identity/sign-in/ios/api/interface_g_i_d_sign_in.html#a0a68c7504c31ab0b728432565f6e33fd)
        //     forceCodeForRefreshToken: true, // [Android] related to `serverAuthCode`, read the docs link below *.
        //     //accountName: '', // [Android] specifies an account name on the device that should be used
        //     //iosClientId: '<FROM DEVELOPER CONSOLE>', // [iOS] optional, if you want to specify the client ID of type iOS (otherwise, it is taken from GoogleService-Info.plist)
        // });
    }

    constructor(props, context, ...args) {
        super(props, context, ...args);
        try {
            this.alternativeSignup = false;
            this.alternativeSignup = this.props.route.params.showHeader;
        } catch (error) {
        }
        this.style = this.createStyleSheet(this.WHPNoHeader);
        this.props.navigation.setOptions({
            headerShown: false,
        });
        
        this.userData = new tbUserData();
        this._activeTab = 0;
        this.dataFacebook = '';
        this.imageSetting = SGHelperGlobalVar.getVar('GlobalImageSetting');
        this.countryPhoneCode = '+62';
        this.tokenGoogle;
        this.userInfo;
        this.pvID1 = SGPopView.getPopViewID();
        this.pvID2 = SGPopView.getPopViewID();
        this.counterBatch=0
        this.errorBatch = []
        this.showFB = SGHelperType.getSystemParamsValue("FacebookSignUp")
        this.showGoogle = SGHelperType.getSystemParamsValue("GoogleSignUp")
        this.showApple = SGHelperType.getSystemParamsValue("AppleSignUp")
    }
    async _addAppleAccount(userData,appleAuthRequestResponse){
        try {
            userData.fEmail = appleAuthRequestResponse.email
            userData.fName = appleAuthRequestResponse.fullName.givenName
            userData.fAppleID = appleAuthRequestResponse.user
            //callAPI
            await tbVUserAPI.addAppleAccount(userData.getCurrentJSON());
        } catch (error) {
            SGHelperErrorHandling.Handling(error,this._addAppleAccount.bind(this,userData,appleAuthRequestResponse))
        }
    }
    async onAppleButtonPress(userData) {
        if(this.showApple==="Y"){
            appleAuth.Operation.LOGOUT
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
    
                // user = newUser;
                if (identityToken) {
                    if(appleAuthRequestResponse.email===null){
                          this.baseRunSingleAPIWithRedoOption('getAppleAccount', (async (v1) => { return tbVUserAPI.getAppleAccount(v1) }).bind(this,appleAuthRequestResponse.user), (async(res) => {
                            console.log(res)  
                            if(res.fActive==="NotFound"){
                                DialogBox.showFail(null, SGLocalize.translate('SignUpScreen.alert1SignUpFailTitle'), SGLocalize.translate("SignUpScreen.alertSignUpFailAppleNeedToUninstall"), SGLocalize.translate('globalText.ok'), () => { }, true)
                              }else{
                                var appleAccount = res 
                                console.log(appleAccount)
                                // this.baseRunSingleAPIWithRedoOption('IsAppleIDAvailable', (async (v1) => { return tbVUserAPI.isAppleIDAvailable(v1) }).bind(this,appleAccount.fAppleID), (async(result) => {
                                    // if (result == false) {
                                    //     DialogBox.showFail(null, SGLocalize.translate('SignUpScreen.alert1SignUpFailTitle'), SGLocalize.translate("SignUpScreen.alert1SignUpFailText"), SGLocalize.translate('globalText.ok'), () => { }, true)
                                    // }
                                    // else {
                                    this.baseRunSingleAPIWithRedoOption('isEmailOrPhoneAvailable', (async (v1) => { return tbVUserAPI.isEmailOrPhoneAvailable(v1) }).bind(this,appleAccount.fEmail), (async(v) => {
                                        if (v.canBeUsed == false) {
                                            this._popUpRegistered(v.fRegisterMethod)   
                                            // DialogBox.showFail(null, SGLocalize.translate('SignUpScreen.alert1SignUpFailTitle'), SGLocalize.translate("SignUpScreen.alert1SignUpFailText"), SGLocalize.translate('globalText.ok'))
                                        }
                                        else {
                                            this.baseRunSingleAPIWithRedoOption('isEmailOrPhoneDeleted', (async (v1) => { return tbVUserAPI.isEmailOrPhoneDeleted(v1) }).bind(this,appleAccount.fEmail), (async(v) => {
                                                if(v == true){
                                                    userData.fEmail = appleAccount.fEmail;
                                                    userData.fName = appleAccount.fName;
                                                    userData.fAppleID = appleAccount.fAppleID;
                                                    userData.fRegisterMethod = 'apple';
                                                    SGHelperNavigation.navigate(this.props.navigation, 'SignUpForm', { data: userData, selectedTab: '' })
                                                }
                                            }).bind(this),  null,  SGHelperGlobalVar.getVar("ResponTimes"));
                                      }
                                    }).bind(this),  null,  SGHelperGlobalVar.getVar("ResponTimes"));      
                                //   }
                                // }).bind(this),  null,  SGHelperGlobalVar.getVar("ResponTimes")); 
                              }
    
                      
                        }).bind(this),  null,  SGHelperGlobalVar.getVar("ResponTimes"));
                    }else{
                        try {
                            // var userDataApple = new tbUserData()
                            // this.baseRunSingleAPIWithRedoOption('IsAppleIDAvailable', (async (v1) => { return tbVUserAPI.isAppleIDAvailable(v1) }).bind(this,appleAuthRequestResponse.user), (async(v) => {
                            //     if (v == false) {
                            //         DialogBox.showFail(null, SGLocalize.translate('SignUpScreen.alert1SignUpFailTitle'), SGLocalize.translate("SignUpScreen.alert1SignUpFailText"), SGLocalize.translate('globalText.ok'), () => { }, true)
                            //     }
                                // else {
                                    console.log('aa')
                                    console.log(appleAuthRequestResponse)
                                   this.baseRunSingleAPIWithRedoOption('isEmailOrPhoneAvailable', (async (v1) => { return tbVUserAPI.isEmailOrPhoneAvailable(v1) }).bind(this,appleAuthRequestResponse.email), (async(v) => {
                                      if (v.canBeUsed == false) {
                                        console.log('1')
                                        this._popUpRegistered(v.fRegisterMethod)   
                                        // DialogBox.showFail(null, SGLocalize.translate('SignUpScreen.alert1SignUpFailTitle'), SGLocalize.translate("SignUpScreen.alert1SignUpFailText"), SGLocalize.translate('globalText.ok'))
                                    }else{
                                        console.log('2')
                                        await this._addAppleAccount(userData,appleAuthRequestResponse);
                                        userData.fEmail = appleAuthRequestResponse.email
                                        userData.fName = appleAuthRequestResponse.fullName.givenName
                                        userData.fAppleID = appleAuthRequestResponse.user
                                        userData.fRegisterMethod = 'apple';
                                        SGHelperNavigation.navigate(this.props.navigation, 'SignUpForm', { data: userData, selectedTab: '' })
                                    }
                                }).bind(this),  null,  SGHelperGlobalVar.getVar("ResponTimes"));    
                                   
                                // }
                            // }).bind(this),  null,  SGHelperGlobalVar.getVar("ResponTimes")); 
                        } catch (error) {
                            SGHelperErrorHandling.Handling(error,this.onAppleButtonPress.bind(this,userData))
                        }  
                    }
    
                } else {
                    DialogBox.showFail(null, SGLocalize.translate('SignUpScreen.alert1SignUpFailTitle'), SGLocalize.translate("SignUpScreen.alertSignUpSomethingWrong"), SGLocalize.translate('globalText.ok'), () => { }, true)
                }
    
                if (realUserStatus === appleAuth.UserStatus.LIKELY_REAL) {
                    console.log("I'm a real person!");
                }
    
                // console.warn(`Apple Authentication Completed, ${user}, ${email}`);
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
        }else{
            SGDialogBox.showFail(null, SGLocalize.translate("AlertMessage.Fail"), SGLocalize.translate('AlertPermission.DisableFeature'), SGLocalize.translate("AlertMessage.OK"), async () => {  }, true)
        }
       
    }

    async signUpFB(userData, navigation) {
        if(this.showFB==="Y"){
            console.log('aw')
            if(!SGHelperGlobalVar.isVar('signUpFB.this')){
                SGHelperGlobalVar.addVar('signUpFB.this',this);
            } else {
                SGHelperGlobalVar.setVar('signUpFB.this',this);
            }
            this.__userData = userData;
            this.__navigation = navigation;
            SGHelperFBSDK.logOut()
            SGHelperFBSDK.setLoginBehavior('WEB_ONLY');
            await SGHelperFBSDK.logInWithPermissions(["email", "public_profile", "user_birthday", "user_gender"]).then(
                async function (result) {
                    if (result.isCancelled) {
                        console.log('Login cancelled')
                    } else {
                        console.log('Login success with permissions: ' + result.grantedPermissions.toString())
                        await SGHelperFBSDK.getCurrentAccessToken().then(
                            async (data) => {
                                try {
                                    var objThis = SGHelperGlobalVar.getVar('signUpFB.this');
  
                                    var dataFacebook = await tbVUserAPI.getFacebookData(data.userID, data.accessToken);
                                    console.log("APA")
                                    console.log(dataFacebook)
                                    if(dataFacebook.email===null){
                                        DialogBox.showFail(null, SGLocalize.translate('AlertMessage.Fail'), SGLocalize.translate("SignUpScreen.noEmailFB"), SGLocalize.translate('globalText.ok'), () => { }, true)
                                    }else{
                                        var isAvailable = await tbVUserAPI.isEmailOrPhoneAvailable(dataFacebook.email);
                                        console.log('3')
                                        if (isAvailable.canBeUsed == false) {
                                            objThis._popUpRegistered(isAvailable.fRegisterMethod)   
                                            // DialogBox.showFail(null, SGLocalize.translate('SignUpScreen.alert1SignUpFailTitle'), SGLocalize.translate("SignUpScreen.alert1SignUpFailText"), SGLocalize.translate('globalText.ok'), () => { }, true)
                                          
                                        } 
                                        else {
                                            var isDeleted = await tbVUserAPI.isEmailOrPhoneDeleted(dataFacebook.email);
                                                if(isDeleted == true){
                                                    userData.fEmail = dataFacebook.email;
                                                    userData.fName = dataFacebook.name;
                                                    if (dataFacebook.birthday !== '0001-01-01T00:00:00') {
                                                        userData.fDOB = new Date(dataFacebook.birthday).toISOString();
                                                    }
                                                    userData.fFacebookID = dataFacebook.id;
                                                    userData.fRegisterMethod = 'facebook';
                                                    SGHelperNavigation.navigate(navigation, 'SignUpForm', { data: userData, selectedTab: '' })
                                                }
                                        }
                                    }

                                 
                                } catch (error) {
                                    SGHelperErrorHandling.Handling(error,objThis.signUpFB.bind(objThis,objThis.__userdata,objThis.__navigation))
                                }
                               
                            })
                    }
    
                },
                function (error) {
                    console.log('Login fail with error: ' + error)
                }
            );
        }else{
            SGDialogBox.showFail(null, SGLocalize.translate("AlertMessage.Fail"), SGLocalize.translate('AlertPermission.DisableFeature'), SGLocalize.translate("AlertMessage.OK"), async () => {  }, true)
        }
      
    }

    // generateUserID() {
    //     var userID = tbUserDAO.generateUserID();
    //     return userID;
    // }

    _onChangeTab(e) {
        this._activeTab = e.i;
        this.forceUpdate()
    }

    _setCountryPhoneCode(v) {
        this.countryPhoneCode = v;
        this.forceUpdate();
    }

    async checkAPIBatchStatusAllDone() {
        if(this.counterBatch===2){
            if (this.status.userInfo &&
                this.status.token
            ) {
                console.log(this.userInfo.user.id)
                console.log(this.tokenGoogle.accessToken)
                this.baseRunSingleAPIWithRedoOption('getGoogleData', (async (v1,v2) => { return tbVUserAPI.getGoogleData(v1,v2) }).bind(this,this.userInfo.user.id, this.tokenGoogle.accessToken), (async(v) => {
                    var dataGoogle =v // await tbVUserAPI.getFacebookData(data.userID, data.accessToken);
                    this.baseRunSingleAPIWithRedoOption('isEmailOrPhoneAvailable', (async (v1) => { return tbVUserAPI.isEmailOrPhoneAvailable(v1) }).bind(this,dataGoogle.email), (async(v) => {
                        if (v.canBeUsed == false) {
                            this._popUpRegistered(v.fRegisterMethod)   
                            // DialogBox.showFail(null, SGLocalize.translate('SignUpScreen.alert1SignUpFailTitle'), SGLocalize.translate("SignUpScreen.alert1SignUpFailText"), SGLocalize.translate('globalText.ok'))
                        }
                        else {
                            this.baseRunSingleAPIWithRedoOption('isEmailOrPhoneDeleted', (async (v1) => { return tbVUserAPI.isEmailOrPhoneDeleted(v1) }).bind(this,dataGoogle.email), (async(v) => {
                                if(v == true){
                                    this.userData.fEmail = dataGoogle.email.toLowerCase();
                                    this.userData.fName = dataGoogle.name;
                                    this.userData.fDOB = dataGoogle.birthday;
                                    this.userData.fGoogleID = dataGoogle.id;
                                    this.userData.fRegisterMethod = 'google';
                                    SGHelperNavigation.navigate(this.props.navigation, 'SignUpForm', { data: this.userData, selectedTab: '' })
                                }
                            }).bind(this),  null,  SGHelperGlobalVar.getVar("ResponTimes"));
                        }
                    }).bind(this),  null,  SGHelperGlobalVar.getVar("ResponTimes"));
                   
                }).bind(this),  null,  SGHelperGlobalVar.getVar("ResponTimes"));

                // var dataGoogle = await tbVUserAPI.getGoogleData(this.userInfo.user.id, this.tokenGoogle.accessToken);
              
                
            }else{
                this.counterBatch=0
                console.log(this.errorBatch)
                SGHelperErrorHandling.multiHandling(this.errorBatch,this._signUpGoogle.bind(this))
                this.errorBatch=[]
            }
        }

    }

    _signUpGoogle = async () => {
        if(this.showGoogle==="Y"){
            try {
                await GoogleSignin.hasPlayServices();
    
                this.status = {
                    userInfo: false,
                    token: false
                }
    
                await GoogleSignin.signIn().then((v) => {
                    this.userInfo = v
                    console.log(this.userInfo);
                    this.status.userInfo = true; this.checkAPIBatchStatusAllDone();
                }).catch((error)=>{
                    SGHelperErrorHandling.getMultiError(error,this.errorBatch)
                }).finally(()=>{
                    this.counterBatch++
                    this.checkAPIBatchStatusAllDone();
                })
    
                await GoogleSignin.getTokens().then((v) => {
                    this.tokenGoogle = v
                    console.log(this.tokenGoogle);
                    this.status.token = true; this.checkAPIBatchStatusAllDone();
                }).catch((error)=>{
                    SGHelperErrorHandling.getMultiError(error,this.errorBatch)
                }).finally(()=>{
                    this.counterBatch++
                    this.checkAPIBatchStatusAllDone();
                })
    
                
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
        }else{
            SGDialogBox.showFail(null, SGLocalize.translate("AlertMessage.Fail"), SGLocalize.translate('AlertPermission.DisableFeature'), SGLocalize.translate("AlertMessage.OK"), async () => {  }, true)
        }
     
    }

    _popUpRegistered(registerMethod){
        if(registerMethod==="google"){
            DialogBox.showConfirmation(null, SGLocalize.translate('SignUpScreen.alert1SignUpFailTitle'), SGLocalize.translate("SignUpScreen.RegisteredGoogle"), SGLocalize.translate('globalText.no'),()=>{},SGLocalize.translate('globalText.yes'),()=>{SGHelperNavigation.navigatePopPush(this.props.navigation,"SignIn"),true})
        }else if(registerMethod==="facebook"){
            DialogBox.showConfirmation(null, SGLocalize.translate('SignUpScreen.alert1SignUpFailTitle'), SGLocalize.translate("SignUpScreen.RegisteredFacebook"), SGLocalize.translate('globalText.no'),()=>{},SGLocalize.translate('globalText.yes'),()=>{SGHelperNavigation.navigatePopPush(this.props.navigation,"SignIn"),true})
        }else if(registerMethod==="apple"){
            DialogBox.showConfirmation(null, SGLocalize.translate('SignUpScreen.alert1SignUpFailTitle'), SGLocalize.translate("SignUpScreen.RegisteredApple"), SGLocalize.translate('globalText.no'),()=>{},SGLocalize.translate('globalText.yes'),()=>{SGHelperNavigation.navigatePopPush(this.props.navigation,"SignIn"),true})
        }else{
            DialogBox.showConfirmation(null, SGLocalize.translate('SignUpScreen.alert1SignUpFailTitle'), SGLocalize.translate("SignUpScreen.RegisteredSpotgue"), SGLocalize.translate('globalText.no'),()=>{},SGLocalize.translate('globalText.yes'),()=>{SGHelperNavigation.navigatePopPush(this.props.navigation,"SignIn"),true})
        }
    }

    async _onSignUpPress() {
  
        var dataInput = this.userData.getCurrentJSON();
        if (this._activeTab === 0) {
            if (dataInput.fEmail !== '') {

                    this.baseRunSingleAPIWithRedoOption('isEmailOrPhoneAvailable', (async (v1) => { return tbVUserAPI.isEmailOrPhoneAvailable(v1) }).bind(this,dataInput.fEmail), (async(v) => {
                        var isAvailable = v //await tbVUserAPI.isEmailOrPhoneAvailable(dataInput.fPhoneNumber);
                        if (isAvailable.canBeUsed == false) {
                            this._popUpRegistered(isAvailable.fRegisterMethod)   
                        }
                        else {
                            this.baseRunSingleAPIWithRedoOption('isEmailOrPhoneDeleted', (async (v1) => { return tbVUserAPI.isEmailOrPhoneDeleted(v1) }).bind(this,dataInput.fEmail), (async(v) => {
                                if(v == true){
                                    SGHelperNavigation.navigatePush(this.props.navigation, 'VerifyOTPSignUp', { data: this.userData, alternativeSignup: this.alternativeSignup, selectedTab: this._activeTab });
                                }
                            }).bind(this),  null,  SGHelperGlobalVar.getVar("ResponTimes"));    
                           
                        }
                    }).bind(this),  null,  SGHelperGlobalVar.getVar("ResponTimes"));    
                
            }
            else {
                DialogBox.showFail(null, SGLocalize.translate('SignUpScreen.alert2SignUpFailTitle'), SGLocalize.translate("SignUpScreen.alert2SignUpFailText"), SGLocalize.translate('globalText.ok'))
            }
        }
        if (this._activeTab === 1) {
            if (dataInput.fPhoneNumber !== '') {
                if(dataInput.fPhoneNumber.length >7){
                    dataInput.fPhoneNumber = VisitorHelper.checkPhoneNumberCountryCode(this.countryPhoneCode, VisitorHelper._getPhoneNumber(dataInput.fPhoneNumber));
                    this.baseRunSingleAPIWithRedoOption('isEmailOrPhoneAvailable', (async (v1) => { return tbVUserAPI.isEmailOrPhoneAvailable(v1) }).bind(this,dataInput.fPhoneNumber), (async(v) => {
                        var isAvailable = v //await tbVUserAPI.isEmailOrPhoneAvailable(dataInput.fPhoneNumber);
                        console.log("AC")
                        if (isAvailable.canBeUsed == false) {
                            this._popUpRegistered(isAvailable.fRegisterMethod)   
                        }
                        else {
                            this.baseRunSingleAPIWithRedoOption('isEmailOrPhoneDeleted', (async (v1) => { return tbVUserAPI.isEmailOrPhoneDeleted(v1) }).bind(this,dataInput.fPhoneNumber), (async(v) => {
                                if(v == true){
                                    SGHelperNavigation.navigatePush(this.props.navigation, 'VerifyOTPSignUp', { data: this.userData, alternativeSignup: this.alternativeSignup, selectedTab: this._activeTab });
                                }
                            }).bind(this),  null,  SGHelperGlobalVar.getVar("ResponTimes"));
                        }
                    }).bind(this),  null,  SGHelperGlobalVar.getVar("ResponTimes"));
                }else{
                    DialogBox.showFail(null, SGLocalize.translate('SignUpScreen.alert2SignUpFailTitle'), SGLocalize.translate("SignUpScreen.AlertPhoneNumberWrongFormat"), SGLocalize.translate('globalText.ok'))
                }
            }
            else {
                DialogBox.showFail(null, SGLocalize.translate('SignUpScreen.alert2SignUpFailTitle'), SGLocalize.translate("SignUpScreen.alert2SignUpFailText"), SGLocalize.translate('globalText.ok'))
            }
        }
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
            <SGRootScrollView accessible={true} accessibilityLabel={'SignUpScreenRootView'} style={style.mainView1} contentContainerStyle={style.sv1_2}>
                
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
                <Text preset={Text.preset.titleH1B} style={style.welcomeText}>{SGLocalize.translate("SignUpScreen.headerTitle")}</Text>
                <Text preset={Text.preset.titleH3} style={style.welcomeBodyText}>{SGLocalize.translate("SignUpScreen.bodyText")}</Text>
                <View style={style.tabViewContainer}>
                    <TabView accessible={true} accessibilityLabel={'HomeScreenTabView'} tabBarStyle={style.tabBarStyle} tabBarTextStyle={style.tabBarTextStyle} tabBarUnderlineStyle={{ backgroundColor: '#181818', height: 0.5 * p }} tabBarActiveTextPreset={Text.preset.titleH2B} tabBarInactiveTextPreset={Text.preset.titleH2} style={style.tabViewStyle} initialPage={0} onChangeTab={this._onChangeTab.bind(this)} renderTabBar={() => <DefaultTabBar />}  >
                        <View tabLabel={'Email'} >
                            <SignUpFormWithEmail accessible={true} accessibilityLabel={'SignUpScreenForm'} language={this.Language} placeholder={SGLocalize.translate("SignUpScreen.input1")} userData={this.userData} style={style.throwWHP}></SignUpFormWithEmail>
                        </View>
                        <View tabLabel={'Phone Number'}>
                            <SignUpFormWithPhoneNumber accessible={true} accessibilityLabel={'SignUpScreenForm'} language={this.Language} placeholder={SGLocalize.translate("SignUpScreen.input1")} userData={this.userData} onChangeCountryPhoneCode={this._setCountryPhoneCode.bind(this)} style={style.throwWHP}></SignUpFormWithPhoneNumber>
                        </View>
                    </TabView>
                </View>
                <View accessible={true} accessibilityLabel={'SignUpScreenContainerView'} style={style.containerView1}>
                    <Button accessible={true} accessibilityLabel={'SignUpScreenButton'} textPreset={Text.preset.titleH3B} style={style.button1} label={SGLocalize.translate("SignUpScreen.buttonSignUp")} onPress={this._onSignUpPress.bind(this)}></Button>

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


                    <View accessible={true} accessibilityLabel={'SignUpScreenTextView2'} style={style.textView2}>
                        <Text accessible={true} accessibilityLabel={'SignUpScreenText2'} preset={Text.preset.titleH3} style={style.text1}>{SGLocalize.translate("SignUpScreen.text3")}</Text>
                        <TouchableOpacity onPress={() => SGHelperNavigation.navigateReset(this.props.navigation, 'SignIn')}>
                            <Text accessible={true} accessibilityLabel={'SignUpScreenPressText2'} preset={Text.preset.titleH3B} style={style.text2}>{SGLocalize.translate("SignUpScreen.text4")}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <Text accessible={true} accessibilityLabel={'SignUpScreenPressText3'} preset={Text.preset.titleH3B} style={style.text3}>{SGLocalize.translate("SignUpScreen.text6")}</Text>
                
                <View accessible={true} accessibilityLabel={'SignUpScreenSocmedButtonView'} style={style.socmedButtonList}>
                    {this.showFB =='Y' &&
                        <TouchableOpacity onPress={() => this.signUpFB(this.userData, this.props.navigation)}>
                            <Image accessible={true} accessibilityLabel={'SignUpScreenFBButtonImage'} style={style.socmedButton} source={{ uri: image.facebookButton[this.imageSetting].url }}></Image>
                        </TouchableOpacity>
                    }
                    {Platform.OS === 'ios' && this.showApple =='Y' &&
                        <TouchableOpacity onPress={() => this.onAppleButtonPress(this.userData)}>
                            <Image accessible={true} accessibilityLabel={'SignInAppleButtonImage'} style={style.appleButton} source={{ uri: image.appleButton[this.imageSetting].url }}></Image>
                        </TouchableOpacity>
                    }
                    {this.showGoogle =='Y' &&
                    <TouchableOpacity onPress={() => this._signUpGoogle()}>
                        <Image accessible={true} accessibilityLabel={'SignUpScreenGoogleButtonImage'} style={style.socmedButton} source={{ uri: image.googleButton[this.imageSetting].url }}></Image>
                    </TouchableOpacity>
                    }
                </View>
            </SGRootScrollView>
        );
    }
}
