/**
 * Version 1.2.0
 * 1. Yohanes 27 April 2021
 * - add loading in SignUP
 * - fix referralCode
 */
import Clipboard from '@react-native-community/clipboard';
import React from "react";
import { Dimensions,StyleSheet, Alert,Platform } from "react-native";
import { SGBaseScreen } from "../../../core/screen/SGBaseScreen";
import { SGImage as Image, SGButton as Button, SGTouchableOpacity as TouchableOpacity, SGText as Text, SGView as View, SGRootScrollView as RootScrollView, SGDialogBox as DialogBox,SGPopView,SGIcon as Icon,SGWebView, SGDialogBox } from "../../../core/control";
import { SGHelperNavigation, SGHelperType, SGHelperGlobalVar, SGHelperErrorHandling,SGHelperOneSignal } from '../../../core/helper';
import { SGLocalize } from '../../locales/SGLocalize';
import { SignUp2Form } from '../../form_V2/SignUp2Form';
import { BackButton } from '../../component_V2/BackButton';
import image from '../../asset/image';
import { tbLookupDAO } from '../../db/tbLookupDAO';
import { tbVUserAPI } from '../../api/tbVUserAPI';
import { SGFormButton as FormButton } from '../../../core/form/SGFormButton';
import DeviceInfo from 'react-native-device-info';

import { tbSystemParamsDAO, tbSystemParamsData } from '../../db/tbSystemParamsDAO';
import { tbCOneSignalAPI } from '../../api/tbCOneSignalAPI';

import MyTranslator from '../../../plugin/lessons/locale/MyTranslator';
export class SignUpFormScreen extends SGBaseScreen {
    state = {
        choosenIndex: 0
    };
    createStyleSheet = (whp) => {
        var { w, h, p } = whp;
        return StyleSheet.create({
            rv1: { width: w, backgroundColor: 'white' },
            headerView: { flexDirection: 'row', width: w - 16 * p, justifyContent: 'space-between', alignSelf: 'center' },
            throwWHP: { width: w, height: h, padding: p },
            mainSView1: { width: w,  padding: p, backgroundColor: 'white', alignItems: 'center', justifyContent: 'flex-start' },
            text1: { color: '#909090' },
            text2: { color: '#63aee0', },
            textView2: { flexDirection: 'row', alignSelf: 'center', marginBottom: 2 * p },
            logo: { backgroundColor: 'transparent', alignSelf: 'flex-end', marginTop: 8 * p, marginBottom: 6 * p },
            titleText: { marginLeft: 12 * p, marginBottom: 2 * p, alignSelf: 'flex-start' },
            bodyText: { marginLeft: 12 * p, alignSelf: 'flex-start', maxWidth: 0.8 * w, color: '#465056' },
            vText1: { marginTop: 4 * p, color: 'grey', alignSelf: 'center' },
            vText2: { marginTop: 2 * p, alignSelf: 'center', color: '#63aee0' },
            vView: { width: w - 6 * p, height: Platform.OS === 'ios'?w * 3.35 * 9 / 16: w * 2.8 * 9 / 16, backgroundColor: '#FFFFFF', borderRadius: 0, justifyContent: 'flex-start' },
            vView1: { width: w - 6 * p, height: Platform.OS === 'ios'?w * 3.2 * 9 / 16:w * 2.65 * 9 / 16, backgroundColor: '#FFFFFF', borderRadius: 0, justifyContent: 'flex-start' },
            vClose: { width: w * 0.1, height: w * 0.1, alignSelf: 'flex-end' },
        });
    };

    constructor(props, context, ...args) {
        super(props, context, ...args);
        this.style = this.createStyleSheet(this.WHP);
        this.props.navigation.setOptions({
            headerShown: false,
        });
        this.userData = this.props.route.params.data;
        this.selectedTab = this.props.route.params.selectedTab;
        //console.log(this.userData)
        this.imageSetting = SGHelperGlobalVar.getVar('GlobalImageSetting');
        this.referralCode = '';
        if (this.selectedTab == 0) {
            this.userData.fPhoneNumber = '';
        }
        if (this.selectedTab == 1) {
            this.userData.fEmail = '';
        }
        this.pvID1 = SGPopView.getPopViewID();
        this.pvID2 = SGPopView.getPopViewID();
        this.validatorOff=this.userData.fRegisterMethod==="apple"? true:false
        //Alert.alert(this.userData.fAppleID)
    }



    onValueChange(value) {
        this.setState({
            selected: value
        });
    }

    async _setReferralCode(value) {
        this.referralCode = value;
    }

    async _checkReferralCode(){
        try {
            var result = await tbVUserAPI.checkReferralCodeValid(this.referralCode, DeviceInfo.getUniqueId());
            console.log(result)
            return(result);
        } catch (error) {
            console.log('error _checkReferralCode')
            console.log(error)
            SGDialogBox.hideDialogBox(this.dbID,true)
            SGHelperErrorHandling.Handling(error,this._checkReferralCode.bind(this))
            return false
        }

    }

    async _addUser(data) {
        try {
            data.referredCode = this.referralCode;
            data.deviceID = DeviceInfo.getUniqueId();
            // console.log('aw')
            // console.log(JSON.stringify(data));
            // Clipboard.setString(JSON.stringify(data));
            var result = await tbVUserAPI.registerUser(data);
            console.log(result)
            return (result);
            //return(false);
        } catch (error) {
            SGHelperErrorHandling.Handling(error,this._addUser.bind(this,data))
        }

    }
    async _assignValueSignIn(sourceUserData,token){
        console.log(sourceUserData)
        console.log(token)
        this.userDataSetting = await tbSystemParamsDAO.getUserDataSetting()
        this.userTokenData = await tbSystemParamsDAO.getUserDataToken()
        if(this.userDataSetting.fID===''){
            this.userDataSetting.fID = SGHelperType.getGUID()
            this.userDataSetting.Active='Y'
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
            this.userTokenData.Active='Y'
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
            this.userTokenData.Active='Y'
            this.userTokenData.fLastModifiedDate = new Date()
            await tbSystemParamsDAO.updateUserDataToken(this.userTokenData,token)
        }
        // await tbSystemParamsDAO.consoleAllData()
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
        // console.log(await tbSystemParamsDAO.consoleAllData())
        SGHelperNavigation.navigateReset(this.props.navigation, 'Home',{signIn :true, page:1});
    }
    async _addUserHandler(data){
        var isSuccess = await this._addUser(data);
        console.log('_addUserHandler')
        console.log(isSuccess)
        SGHelperGlobalVar.addVar("token", isSuccess.token);
        this.baseRunSingleAPIWithRedoOption('getUserByID', (async () => {if(this.dbID===null)this.dbID=SGDialogBox.showLoading(tr("AlertMessage.Waiting")); return tbVUserAPI.getUserByID() }).bind(this), (async(userData) => {
            await this._assignValueSignIn(userData,isSuccess)
        }).bind(this), (()=>{SGDialogBox.hideDialogBox(this.dbID,true);this.dbID=null;}),  SGHelperGlobalVar.getVar("ResponTimes"));
    }
    async _onSignUpPress() {
        this.dbID = SGDialogBox.showLoading(SGLocalize.translate("AlertMessage.Waiting"))
        this.userData.fDeviceID = DeviceInfo.getUniqueId()
        this.userData.fDeviceModel= DeviceInfo.getModel()
        this.userData.fDeviceBrand= DeviceInfo.getBrand()
        this.userData.fDeviceOS= DeviceInfo.getSystemName()
        this.userData.fDeviceOSVersion= DeviceInfo.getSystemVersion()
        this.userData.fDeviceHeight= (Dimensions.get('screen').width)
        this.userData.fDeviceWidth= (Dimensions.get('screen').width)
        this.userData.fLoginLocation= ""
        var data = SGHelperType.copyJSON(this.userData.getCurrentJSON());
        data.fPassword = SGHelperType.encrypt(data.fPassword);
        data.fLanguage = this.Language;
        data.fIsSimulator = await DeviceInfo.isEmulator()
        if(data.fIsSimulator && this.referralCode!==''){
            SGDialogBox.hideDialogBox(this.dbID);
            SGDialogBox.showFail(null,'Cannot Use Referral Code','We are sorry, only user from real device and not simulator can use referral code. Please clear the referral code to proceed.','Close',()=>{});
        } else {
            data.fProfileImageJSON = [{ id: '993581f2-d951-45dc-ae6e-5041b7a16ff7', text: "", textPosition: "topLeft", low: { uri: image.defaultUserImage.low.url, width: 480, height: 480 }, med: { uri: image.defaultUserImage.med.url, width: 720, height: 720 }, high: { uri: image.defaultUserImage.high.url, width: 1080, height: 1080 }, thumbnailLow: { uri: image.defaultUserImage.low.url, width: 480, height: 480 }, thumbnailMed: { uri: image.defaultUserImage.med.url, width: 720, height: 720 }, thumbnailHigh: { uri: image.defaultUserImage.high.url, width: 1080, height: 1080 } }]
            if(this.referralCode !== ''){
                var isReferralCodeValid = await this._checkReferralCode();
                if(isReferralCodeValid){
                    data.referredCode = this.referralCode;
                    data.deviceID = DeviceInfo.getUniqueId();
                    try {
                       await this._addUserHandler(data)
                    } catch (error) {
                        SGDialogBox.hideDialogBox(this.dbID,true)
                        SGHelperErrorHandling.Handling(error,this._addUserHandler.bind(this,data))
                    }
    
                    // SGDialogBox.hideDialogBox(this.dbID,true)
                    // if(isSuccess)DialogBox.showSuccess(null, SGLocalize.translate('SignUpFormScreen.alertSignUpSuccessTitle'), SGLocalize.translate("SignUpFormScreen.alertSignUpSuccessText"), SGLocalize.translate('globalText.ok'), () => SGHelperNavigation.navigateReset(this.props.navigation, 'SignIn'), true)
                    
                }
            }else{
                data.referredCode = this.referralCode;
                data.deviceID = DeviceInfo.getUniqueId();
                try {
                    await this._addUserHandler(data)
                 } catch (error) {
                     SGDialogBox.hideDialogBox(this.dbID,true)
                     SGHelperErrorHandling.Handling(error,this._addUserHandler.bind(this,data))
                 }
            }
        }
    }

    getSecurityQuestionData() {
        var pullData = tbLookupDAO.getSpecificLookupByGroup('SecurityQuestion');
        var securityQuestionData = [];
        for (var i = 0; i < pullData.length; i++) {
            var securityQuestion = { key: pullData[i].fLookUpKey, title: pullData[i].fLanguage[this._language.toLowerCase()]};
            securityQuestionData.push(securityQuestion);
        };
        return (securityQuestionData);
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
    _hideValidator(data){
        this.validatorOff= data==="N"? true:false
        this.forceUpdate()
    }
    render() {
        var { w, h, p } = this.WHP;
        var style = this.style;
        var securityQuestionData = this.getSecurityQuestionData();
        var uriTermAndCondition = this._getValueTermNCondition();
        var uriPolicy = this._getPolicy();
        console.log(this.validatorOff)
        return (
            <RootScrollView accessible={true} accessibilityLabel={'SignInScreenRootScrollView'} style={style.rv1} showsVerticalScrollIndicator={false} contentContainerStyle={style.mainSView1}>
                
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
                <Text preset={Text.preset.titleH1B} style={style.titleText}>{SGLocalize.translate("SignUpFormScreen.headerTitle")}</Text>
              
                <SignUp2Form accessible={true} accessibilityLabel={'SignUpFormScreenForm'} language={this.Language} setReferralCode={this._setReferralCode.bind(this)} securityQuestionData={securityQuestionData} userData={this.userData} style={style.throwWHP} hideValidator={this._hideValidator.bind(this)}></SignUp2Form>
               
                <FormButton preset={FormButton.preset.v3} data={this.userData} validatorOff={this.validatorOff} accessible={true} accessibilityLabel={'SignUpFormScreenButton'} onPress={this._onSignUpPress.bind(this)} label={SGLocalize.translate("SignUpFormScreen.buttonSignUp")}></FormButton>

                <Text accessible={true} accessibilityLabel={'SignUpFormScreenSignText'} preset={Text.preset.titleH4} style={style.text1}>{SGLocalize.translate("SignUpFormScreen.text1")}</Text>
                <View style={{ width: w, flexDirection: 'row' }}>
                    <TouchableOpacity onPress={() => { this._showTermAndCondition() }}>
                        <Text preset={Text.preset.titleH4B} style={style.vText2}>{SGLocalize.translate("SignInScreen.text6")}</Text>
                    </TouchableOpacity>
                    <Text style={{ color: 'grey' }}>&</Text>
                    <TouchableOpacity onPress={() => { this._showPrivacyPolicy() }}>
                        <Text preset={Text.preset.titleH4B} style={style.vText2}>{SGLocalize.translate("SignInScreen.text7")}</Text>
                    </TouchableOpacity>
                </View>
            </RootScrollView>
        );
    }
}
