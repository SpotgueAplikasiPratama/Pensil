/**
 * 1. Yohanes 01 April 2021
 * - add ErrorHandling
 */
import React from 'react';
import { StyleSheet,Linking } from 'react-native';
import { SGBaseScreen } from "../../../core/screen/SGBaseScreen";
import { SGView as View, SGText as Text, SGScrollView as ScrollView, SGIcon as Icon, SGSwitch as Switch, SGTouchableOpacity as TouchableOpacity, SGRootView as RootView, SGDialogBox as DialogBox,SGPopView,SGTextInput as TextInput,SGButton as Button, SGCheckBoxList } from "../../../core/control";
import { tbUserDAO } from '../../db/tbUserDAO';
import { SGHelperNavigation, SGHelperGlobalVar,SGHelperStyle,SGHelperType, SGHelperErrorHandling,SGHelperOneSignal } from '../../../core/helper';
import { SGLocalize } from '../../locales/SGLocalize';
import { VUserSettingsAPI } from '../../api/VUserSettingsAPI';
import { tbVUserAPI } from '../../api/tbVUserAPI';
import { tbSystemParamsDAO } from '../../db/tbSystemParamsDAO';
import { CustomMenuBar } from '../../component_V2/CustomMenuBar';
import { tbCOneSignalAPI } from '../../api/tbCOneSignalAPI'
import {version} from '../../../../app.json'

export class ChooseSettingScreen extends SGBaseScreen {

    getData() {
        return ([
            { key: 1, title: SGLocalize.translate('ChooseScreenProfile.TextProfile'), desc: SGLocalize.translate('ChooseScreenProfile.TextProfile1'), type: 1, show: true, enable: true, verify: false, screen: "DetailProfileScreen" },
            { key: 13, title: SGLocalize.translate('ChooseScreenProfile.TextAddEmail'), desc: SGLocalize.translate('ChooseScreenProfile.TextAddEmail1'), type: 1, show: this.emailMode === 'add' ? true : false, enable: true, verify: true, screen: "AddEmailScreen" },
            { key: 14, title: SGLocalize.translate('ChooseScreenProfile.TextAddPhoneNumber'), desc: SGLocalize.translate('ChooseScreenProfile.TextAddPhoneNumber1'), type: 1, show: this.phoneNumberMode === 'add' ? true : false, enable: true, verify: true, screen: "AddPhoneNumberScreen" },
            { key: 15, title: SGLocalize.translate('ChooseScreenProfile.TextChangeEmail'), desc: SGLocalize.translate('ChooseScreenProfile.TextChangeEmail1'), type: 1, show: this.emailMode === 'change' ? true : false, enable: this.isChangeEmailEnable, verify: true, screen: "ChangeEmailScreen" },
            { key: 16, title: SGLocalize.translate('ChooseScreenProfile.TextChangePhoneNumber'), desc: SGLocalize.translate('ChooseScreenProfile.TextChangePhoneNumber1'), type: 1, show: this.phoneNumberMode === 'change' ? true : false, enable: this.isChangePhoneNumberEnable, verify: true, screen: "ChangePhoneNumberScreen" },
            // { key: 17, title: SGLocalize.translate('ChooseScreenProfile.TitleSecurityQuestion'), desc: SGLocalize.translate('ChooseScreenProfile.TitleDescSecurityQuestion'), type: 1, show: true, enable: true, verify: true, screen: "ChangeSecurityQuestionScreen" },
            { key: 2, title: SGLocalize.translate('ChooseScreenProfile.TextPassword'), desc: SGLocalize.translate('ChooseScreenProfile.TextPassword1'), type: 1, show: true, enable: true, verify: false, screen: "VerifyOldPassword" },
            { key: 3, title: SGLocalize.translate('ChooseScreenProfile.TextLanguage'), desc: SGLocalize.translate('ChooseScreenProfile.TextLanguage1'), type: 1, show: true, enable: true, verify: false, screen: "ChooseLanguageProfileScreen" },
            { key: 11, title: SGLocalize.translate('ChooseScreenProfile.TextImageSetting'), desc: SGLocalize.translate('ChooseScreenProfile.TextImageSetting1'), type: 1, show: true, enable: true, verify: false, screen: "ChangeImageSettingScreen" },
            { key: 12, title: SGLocalize.translate('ChooseScreenProfile.TextCurrency'), desc: SGLocalize.translate('ChooseScreenProfile.TextCurrency1'), type: 1, show: true, enable: true, verify: false, screen: "ChangeCurrencyScreen" },
            { key: 4, title: SGLocalize.translate('ChooseScreenProfile.Notification'), desc: SGLocalize.translate('ChooseScreenProfile.Notification1'), type: 2, show: true, enable: true, verify: false, check: this.SwitchNotif },
            { key: 5, title: SGLocalize.translate('ChooseScreenProfile.Tracking'), desc: SGLocalize.translate('ChooseScreenProfile.Tracking1'), type: 2, show: true, enable: true, verify: false, check: this.SwitchTracking },
            { key: 18, title: SGLocalize.translate('ChooseScreenProfile.TitleDeveloperMode'), desc:SGLocalize.translate('ChooseScreenProfile.DescDeveloperMode'), type: 2, show: true, enable: true, verify: false,check : this.SwitchDeveloperMode },
            { key: 6, title: SGLocalize.translate('ChooseScreenProfile.TextHelp'), desc: SGLocalize.translate('ChooseScreenProfile.TextHelp1'), type: 1, show: true, enable: true, verify: false, screen: "HelpScreen" },
            // { key: 7, title: SGLocalize.translate('ChooseScreenProfile.TextTips'), desc: SGLocalize.translate('ChooseScreenProfile.TextTips1'), type: 1, show: true, enable: true, verify: false, screen: "TipsAndTrickScreen" },
            { key: 8, title: SGLocalize.translate('ChooseScreenProfile.TextPolicy'), desc: SGLocalize.translate('ChooseScreenProfile.TextPolicy1'), type: 1, show: true, enable: true, verify: false, screen: "PolicyScreen" },
            { key: 9, title: SGLocalize.translate('ChooseScreenProfile.Review'), desc: SGLocalize.translate('ChooseScreenProfile.Review1'), type: 1, show: true, enable: true, verify: false, screen: "ReviewApp" },
            { key: 19, title: SGLocalize.translate('deleteAccountReason.title'), desc: SGLocalize.translate('deleteAccountReason.desc'), type: 1, show: true, enable: true, verify: false, screen: "delete" },
            { key: 10, title: SGLocalize.translate('ChooseScreenProfile.TextSignout'), desc: SGLocalize.translate('ChooseScreenProfile.TextSignout1'), show: true, type: 1, enable: true, verify: false, screen: "Signout" },
        ]);
    }

    createStyleSheet = (whp) => {
        var { w, h, p } = whp;
        return StyleSheet.create({
            v1: { flex: 1, justifyContent: 'flex-start', backgroundColor: "white",width:w },
            v2: { width: w - 2 * p, height: w * 0.18, padding: p, flexDirection: 'row', marginTop: 3 * p, borderBottomWidth: p * 0.2, borderColor: "#E4E4E4" },
            v2_1: { width: (w - 2 * p) * 0.9, height: w * 0.18, padding: p, alignItems: 'flex-start' },
            v2_1_1: { width: (w - 2 * p) * 0.9, height: w * 0.08, alignItems: 'flex-start' },
            v2_1_2: { width: (w - 2 * p) * 0.9, height: w * 0.08, alignItems: 'flex-start' },
            v2_2: { width: (w - 2 * p) * 0.1, height: w * 0.18, padding: p, alignItems: 'flex-end' },
            v3: { width: w - 2 * p, height: w * 0.18, padding: p, flexDirection: 'row', marginTop: 3 * p, borderBottomWidth: p * 0.2, borderColor: "#E4E4E4" },
            v3_1: { width: (w - 2 * p) * 0.8, height: w * 0.18, padding: p, alignItems: 'flex-start' },
            v3_1_1: { width: (w - 2 * p) * 0.8, height: w * 0.08, alignItems: 'flex-start' },
            v3_1_2: { width: (w - 2 * p) * 0.8, height: w * 0.08, alignItems: 'flex-start' },
            v3_2: { width: (w - 2 * p) * 0.2, height: w * 0.18, padding: p, alignItems: 'flex-end' },
            text: { alignSelf: 'flex-start', paddingLeft: 2 * p },
            text2: { alignSelf: 'flex-start', paddingLeft: 2 * p, color: "grey" },
            vPopView:{width: w - 12 * p,height:w*0.45, backgroundColor: 'white', borderRadius: 2 * p, padding: 0, borderColor: SGHelperStyle.color.SGDatePicker.Border, borderWidth: p / 4},
            vPopView2:{height:w, backgroundColor: 'white', borderRadius: 2 * p, padding: p*2, borderColor: SGHelperStyle.color.SGDatePicker.Border, borderWidth: p / 4},
            TextPopView:{alignSelf:'flex-start',paddingLeft:2*p},
            vButton:{marginVertical:2*p},
            vTextInput:{width:w-16*p,},
            vTextInputReason:{width:w-8*p,},
            vClose: { position: 'absolute', right: 0, top: 2 },
            checkBoxContainer: { marginVertical: p * 3 },
        });
    }

    constructor(props, context, ...args) {
        super(props, context, ...args);
        this.currentUserData = SGHelperGlobalVar.getVar('GlobalCurrentUserData');
        this.imageSetting = SGHelperGlobalVar.getVar('GlobalImageSetting');
        this.style = this.createStyleSheet(this.WHP);
        this.props.navigation.setOptions({
            headerShown: false,
        });
        this.pvID = SGPopView.getPopViewID();
        this.pvDeleteID = SGPopView.getPopViewID();
        this.developerModePassword = '';
        this._setFlagEmail();
        this._setFlagPhoneNumber();
        this.data = this.getData();
        this.firstTimeEmail = SGHelperGlobalVar.addVar('firstTimeOtpSettingEmail',true);
        this.firstTimePhoneNumber = SGHelperGlobalVar.addVar('firstTimeOtpSettingPhoneNumber',true);
        this._dataReasonDeleteAccount();
    }

    _dataReasonDeleteAccount(){
        this.hiddenText = true
        this.deleteReasonData = [
            {key:1, title: SGLocalize.translate('deleteAccountReason.reasonOne')},
            {key:2, title: SGLocalize.translate('deleteAccountReason.reasonTwo')},
            {key:3, title: SGLocalize.translate('deleteAccountReason.reasonThree')}
        ]
        this.deleteReasonDataValue = ''
    }

    handleLink(url) {
        Linking.canOpenURL(url
        ).then(supported => {
            if (supported) {
                Linking.openURL(url);
            } else {
                DialogBox.showWebView(url,()=>{});   
                // DialogBox.showWarning(null,SGLocalize.translate("AlertMessage.Fail"),SGLocalize.translate("AlertMessage.AlertHandleLink"),SGLocalize.translate("AlertMessage.OK"),()=>{},true,{label: url,url:url})
                // console.log("Don't know how to open URI: " + url);
            }
        });
    };

    linkReview(){
        if(Platform.OS === 'ios'){
            this.handleLink('https://apps.apple.com/id/app/spotgue/id1550106092')
            }else{
            this.handleLink('https://play.google.com/store/apps/details?id=com.spotguevisitor')
            }
    }

    async componentDidMount() {
        this._focus();
        this._unsubscribe = this.props.navigation.addListener('focus', async () => {
            this._focus();
        });
    }

    _focus() {
        this.currentUserData = SGHelperGlobalVar.getVar('GlobalCurrentUserData');
        this.imageSetting = SGHelperGlobalVar.getVar('GlobalImageSetting');
        this._setFlagEmail();
        this._setFlagPhoneNumber();
        this.data = this.getData();
        this._refreshData();
    }

    _setFlagEmail() {
        if (this.currentUserData.fEmail !== '') {
            this.emailMode = 'change';
            if (this.currentUserData.fPhoneNumber !== '') {
                this.isChangeEmailEnable = true;
            }
            else {
                this.isChangeEmailEnable = false;

            }
        }
        else {
            this.emailMode = 'add';
        }
    }

    _setFlagPhoneNumber() {
        if (this.currentUserData.fPhoneNumber !== '') {
            this.phoneNumberMode = 'change';
            if (this.currentUserData.fEmail !== '') {
                this.isChangePhoneNumberEnable = true;
            }
            else {
                this.isChangePhoneNumberEnable = false;
            }
        }
        else {
            this.phoneNumberMode = 'add';
        }
    }

    _componentWillUnmount() {
        if (this._unsubscribe) { this._unsubscribe(); }
    }

    _renderSwitchData() {
        if (this.currentUserData.fTrackingActive === "Y") {
            this.SwitchTracking = true
        } else {
            this.SwitchTracking = false;
        }
        if (this.currentUserData.fNotificationActive === "Y") {
            this.SwitchNotif = true
        } else {
            this.SwitchNotif = false;
        }
        if (this.currentUserData.fDeveloperMode === "Y") {
            this.SwitchDeveloperMode = true
        }else{
            this.SwitchDeveloperMode = false
        }
    }

    async _refreshData() {
 
        this.baseRunSingleAPIWithRedoOption('getUserByID', (async (v1) => { return tbVUserAPI.getUserByID(v1) }).bind(this,this.currentUserData.fID), (async(v) => {
            var newCurrentUserData = v //await tbVUserAPI.getUserByID(this.currentUserData.fID);
            SGHelperGlobalVar.addVar('GlobalCurrentUserData', newCurrentUserData);
            this.currentUserData = SGHelperGlobalVar.getVar('GlobalCurrentUserData');
            this.userDataSetting = await tbSystemParamsDAO.getUserDataSetting();
            await tbSystemParamsDAO.updateUserDataSetting(this.userDataSetting, this.currentUserData)
            this._renderSwitchData();
            this.data = this.getData();
            this.forceUpdate();
        }).bind(this), null,  SGHelperGlobalVar.getVar("ResponTimes"));    
          
    }

    async _updateUserNotificationSetting(v) {
        this.currentUserData.fNotificationActive = (v === true ? ('Y') : ('N'));
        try {
            await VUserSettingsAPI.updateUserData(this.currentUserData);
            this._renderSwitchData();
            this.data = this.getData();
            this.forceUpdate()
        } catch (error) {
            SGHelperErrorHandling.Handling(error,this._updateUserNotificationSetting.bind(this,v))
        }

    }

    async _updateUserTrackingSetting(v) {
        this.currentUserData.fTrackingActive = (v === true ? ('Y') : ('N'));
        try {
            await VUserSettingsAPI.updateUserData(this.currentUserData);
            this._renderSwitchData();
            this.data = this.getData();
            this.forceUpdate()
        } catch (error) {
            SGHelperErrorHandling.Handling(error,this._updateUserTrackingSetting(this,v))
        }

    }

    async _checkClick(data, v) {
        if (data.key === 4 && data.check === false) {
            DialogBox.showConfirmation(null, SGLocalize.translate('UserProfileScreen.alertNotificationTitle'), SGLocalize.translate('UserProfileScreen.alertNotificationTextTurnOn'), SGLocalize.translate('globalText.no'), () => { this.forceUpdate(); }, SGLocalize.translate('globalText.yes'), () => { this._updateUserNotificationSetting(v) })
    
        } else if (data.key === 4 && data.check === true) {
            DialogBox.showConfirmation(null, SGLocalize.translate('UserProfileScreen.alertNotificationTitle'), SGLocalize.translate('UserProfileScreen.alertNotificationTextTurnOff'), SGLocalize.translate('globalText.no'), () => { this.forceUpdate(); }, SGLocalize.translate('globalText.yes'), () => { this._updateUserNotificationSetting(v) })
        
        }
        if (data.key === 5 && data.check === false) {
            DialogBox.showConfirmation(null, SGLocalize.translate('UserProfileScreen.alertNotificationTitle'), SGLocalize.translate('UserProfileScreen.alertTrackingTextTurnOn'), SGLocalize.translate('globalText.no'), () => { this.forceUpdate(); }, SGLocalize.translate('globalText.yes'), () => { this._updateUserTrackingSetting(v) })
        
        } else if (data.key === 5 && data.check === true) {
            DialogBox.showConfirmation(null, SGLocalize.translate('UserProfileScreen.alertNotificationTitle'), SGLocalize.translate('UserProfileScreen.alertTrackingTextTurnOff'), SGLocalize.translate('globalText.no'), () => { this.forceUpdate(); }, SGLocalize.translate('globalText.yes'), () => { this._updateUserTrackingSetting(v) })
           
        }
        if (data.key === 18 && data.check === false) {
            SGPopView.showPopView(this.pvID);
        } else if (data.key === 18 && data.check === true) {
           data.check = false;
           console.log(data);
           await this._onInActivateDeveloperMode();
           
        }

    }

     async _signOut() {
        this.userTokenData = await tbSystemParamsDAO.getUserDataToken();
        this.userDataSetting = await tbSystemParamsDAO.getUserDataSetting();
        await tbSystemParamsDAO.updateLogout(this.userTokenData, this.userDataSetting);
        await this._onRemoveOneSignalHandler()
        // OneSignal.getDeviceState().then((status)=>{
        //     tbCOneSignalAPI.removeOneSignalNotificationTags(status.userId);
        // })
        SGHelperGlobalVar.removeVar('renderPlace')
        SGHelperNavigation.navigateReset(this.props.navigation, "Splash");
    }
    async _onRemoveOneSignalHandler(){
        try {
            var status = await SGHelperOneSignal.getDeviceState()
            await tbCOneSignalAPI.removeOneSignalNotificationTags(status.userId);
        } catch (error) {
            SGHelperErrorHandling.Handling(this,this._onRemoveOneSignalHandler.bind(this))
        }
    }
    _onPress(data) {
        if (data.screen === "ReviewApp") {
           this.linkReview();
        }
        else if (data.screen === "delete") {
             SGPopView.showPopView(this.pvDeleteID);
        }
        else if (data.screen === "Signout") (

            DialogBox.showConfirmation(null, SGLocalize.translate('UserProfileScreen.alertSignOutTitle'), SGLocalize.translate('UserProfileScreen.alertSignOutText'), SGLocalize.translate('globalText.no'), () => { console.log('Tidak') }, SGLocalize.translate('globalText.yes'), () => this._signOut(), true)
            // Alert.alert("Sign Out", "apakah anda ingin keluar?", [{ text: "Cancel" }, { text: "Okay", onPress: () => SGHelperNavigation.navigatePush(this.props.navigation, "SignIn") }])
        )
        else if (data.verify === true) {
            // utk add or change Email
            if ((data.key === 13 || data.key === 15)) {
                if (data.enable && data.key === 15) {
                    SGHelperNavigation.navigatePush(this.props.navigation, 'ChooseVerifyOTP', { contentType: 'email', screen: data.screen, data: this.currentUserData })
                }
                else {
                    if (data.enable && data.key === 13) {
                        //check OTP send request time
                        if(this.firstTimePhoneNumber){
                            this.firstTimePhoneNumber = SGHelperGlobalVar.setVar('firstTimeOtpSettingPhoneNumber',false);
                            SGHelperNavigation.navigatePush(this.props.navigation, 'FirstVerifyOTP', { contentType: 'email', verifyMethod: 'phonenumber', screen: data.screen, data: this.currentUserData })
                        }else{
                        var dateNow = new Date();
                        var dateOtp = new Date(SGHelperGlobalVar.getVar('otpDateSettingFirstOTP'));
                        var dateOtpPlus1Minutes = new Date(dateOtp.getFullYear(),dateOtp.getMonth(),dateOtp.getDate(),dateOtp.getHours(),dateOtp.getMinutes()+1,dateOtp.getSeconds());
                            if(dateNow > dateOtpPlus1Minutes){
                                SGHelperNavigation.navigatePush(this.props.navigation, 'FirstVerifyOTP', { contentType: 'email', verifyMethod: 'phonenumber', screen: data.screen, data: this.currentUserData })
                            }else{
                                DialogBox.showWarning(null, SGLocalize.translate('globalText.FailText'), SGLocalize.translate('globalText.FailRequestOTP'), SGLocalize.translate('globalText.ok'), () => { }, true);
                            }
                        }
                    }
                    else {
                        DialogBox.showWarning(null, SGLocalize.translate('globalText.FailText'), SGLocalize.translate('globalText.AddPhoneNumberFirst'), SGLocalize.translate('globalText.ok'))
                    }
                }
            }
            // utk add or change Phone Number
            if ((data.key === 14 || data.key === 16)) {
                if (data.enable && data.key === 16) {
                    SGHelperNavigation.navigatePush(this.props.navigation, 'ChooseVerifyOTP', { contentType: 'phonenumber', screen: data.screen, data: this.currentUserData })
                }
                else {
                    if (data.enable && data.key === 14) {
                        if(this.firstTimeEmail){
                            this.firstTimeEmail = SGHelperGlobalVar.setVar('firstTimeOtpSettingEmail',false);
                            SGHelperNavigation.navigatePush(this.props.navigation, 'FirstVerifyOTP', { contentType: 'phonenumber', verifyMethod: 'email', screen: data.screen, data: this.currentUserData })
                        }else{
                        var dateNow = new Date();
                        var dateOtp = new Date(SGHelperGlobalVar.getVar('otpDateSettingFirstOTP'));
                        var dateOtpPlus1Minutes = new Date(dateOtp.getFullYear(),dateOtp.getMonth(),dateOtp.getDate(),dateOtp.getHours(),dateOtp.getMinutes()+1,dateOtp.getSeconds());
                            if(dateNow > dateOtpPlus1Minutes){
                                SGHelperNavigation.navigatePush(this.props.navigation, 'FirstVerifyOTP', { contentType: 'phonenumber', verifyMethod: 'email', screen: data.screen, data: this.currentUserData })
                            }else{
                                DialogBox.showWarning(null, SGLocalize.translate('globalText.FailText'), SGLocalize.translate('globalText.FailRequestOTP'), SGLocalize.translate('globalText.ok'), () => { }, true);
                            }
                        }

     
                    }
                    else {
                        DialogBox.showWarning(null, SGLocalize.translate('globalText.FailText'),  SGLocalize.translate('globalText.AddEmailFirst'), SGLocalize.translate('globalText.ok'))
                    }
                }
            }
            if (data.key === 17) {
                if (data.enable) {
                    SGHelperNavigation.navigatePush(this.props.navigation, 'ChooseVerifyOTP', { contentType: 'securityquestion', screen: data.screen, data: this.currentUserData })
                }
            }
        }
        else {
            console.log('run')
            SGHelperNavigation.navigatePush(this.props.navigation, data.screen)
        }
    }

    async _onButtonDeveloperModePress(){
        this.baseRunSingleAPIWithRedoOption('ActivateDeveloperMode', (async (v1) => { return tbVUserAPI.ActivateDeveloperMode(v1) }).bind(this,this.developerModePassword), (async (v) => {
            var res = v //await tbVUserAPI.ActivateDeveloperMode(this.developerModePassword);
            if (res === true) {
                console.log('sukses')
                await this._refreshData();
                SGPopView.hidePopView(this.pvID);
            }else{
                console.log('gagal')
                DialogBox.showWarning(null, SGLocalize.translate('globalText.FailText'), SGLocalize.translate('globalText.FailAlertDeveloperMode'), SGLocalize.translate('globalText.ok'),() => {  this.forceUpdate()},true)
            }
        }).bind(this), null,  SGHelperGlobalVar.getVar("ResponTimes"));
           


    }

    async _onInActivateDeveloperMode(){

        this.baseRunSingleAPIWithRedoOption('InActivateDeveloperMode', (async () => { return tbVUserAPI.InActivateDeveloperMode() }).bind(this), ((v) => {
            var res = v //await tbVUserAPI.InActivateDeveloperMode();
            if (res === true) {
               this.forceUpdate();
            }else{
                console.log('gagal inactive')
                DialogBox.showWarning(null, SGLocalize.translate('globalText.FailText'), SGLocalize.translate('globalText.FailAlertDeveloperMode'), SGLocalize.translate('globalText.ok'),() => { this.forceUpdate()},true)
            }
        }).bind(this), null,  SGHelperGlobalVar.getVar("ResponTimes"));
    }

    _closeDevMode(){
       this.forceUpdate();
       SGPopView.hidePopView(this.pvID);
    }

    onChooseReasonDelete(v) {
        if(v[0] == '3'){
            this.hiddenText = false
            this.deleteReasonDataValue = '3'
        }else{
            this.hiddenText = true
            for(var i = 0; i < this.deleteReasonData.length; i++){
                if(this.deleteReasonData[i].key == v[0]){
                    this.deleteReasonDataValue = this.deleteReasonData[i].title
                }
            }
        }
        this.forceUpdate()
    }

    _reasonInputPress(){
        if(this.deleteReasonDataValue == ''){
            DialogBox.showWarning(null, SGLocalize.translate('globalText.FailText'), SGLocalize.translate('deleteAccountReason.reasonMustSelected'), SGLocalize.translate('globalText.ok'))
        }
        else if(this.deleteReasonDataValue == '3'){
            DialogBox.showWarning(null, SGLocalize.translate('globalText.FailText'), SGLocalize.translate('deleteAccountReason.reasonMustFilled'), SGLocalize.translate('globalText.ok'))
        }
        else{
            DialogBox.showInputBox(null, SGLocalize.translate('globalText.ConfirmationText'), SGLocalize.translate('deleteAccountReason.deleteConfirmation'), SGHelperType.stringType.string, (v)=>{this.deleteText = v}, false, SGLocalize.translate('globalText.no'), ()=>{}, SGLocalize.translate('globalText.yes'), async ()=>{
                if(this.deleteText === 'DELETE'){
                    try {
                        await tbVUserAPI.addDeletedAcount(this.deleteReasonDataValue);
                        DialogBox.showSuccess(null, SGLocalize.translate('globalText.SuccessText'), SGLocalize.translate('deleteAccountReason.successRemove'), SGLocalize.translate('globalText.ok'), ()=>{this._signOut()}, true)
                    } catch (error) {
                        SGHelperErrorHandling.Handling(error,this._reasonInputPress.bind(this))
                    }
                }else{
                    DialogBox.showWarning(null, SGLocalize.translate('globalText.FailText'),  SGLocalize.translate('deleteAccountReason.deleteConfirmationFail'), SGLocalize.translate('globalText.ok'))
                }
            }, true, "" )
        }
    }

    render() {
        var { w, h, p } = this.WHP;
        var style = this.style;
        return (
            <RootView dummyStatusBar accessible={true} accessibilityLabel={'ChooseSettingScreenRootView'} style={style.v1}>
               
               <SGPopView modal popViewID={this.pvID} on animationType={'slide'} vPos='Top'>
                    <View style={style.vPopView}>
                        <TouchableOpacity style={style.vClose} onPress={() => { this._closeDevMode() }}>
                            <Icon name={Icon.Icon.closecircle} preset={Icon.preset.h1} style={{ color: '#181818' }}></Icon>
                        </TouchableOpacity>
                        <Text preset={Text.preset.titleH2} style={style.TextPopView}>{SGLocalize.translate('globalText.Password')}</Text>
                        <TextInput  style={style.vTextInput} dataType={TextInput.dataType.password} accessible={true} accessibilityLabel={'ChooseSettingDeveloperModePassword'}  onValueChange={(v) => { this.developerModePassword = v }} placeholder={SGLocalize.translate('ChooseScreenProfile.developerModeText')}></TextInput>
                        <Button preset={Button.preset.black} style={style.vButton} accessible={true} accessibilityLabel={'ChooseSettingDeveloperModeButton'} textPreset={Text.preset.titleH3B} label={SGLocalize.translate('globalText.Submit')} onPress={this._onButtonDeveloperModePress.bind(this)}></Button>
                    </View>
                </SGPopView>
                <SGPopView popViewID={this.pvDeleteID} on animationType={'slide'} vPos='Top'>
                    <View style={style.vPopView2}>
                        <ScrollView accessible={true} accessibilityLabel={'TabFacilityListScrollView'} showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
                            <Text style={{marginVertical: p, textAlign: 'center'}} preset={Text.preset.titleH1B}>{SGLocalize.translate('deleteAccountReason.titleText')}</Text>
                            <Text style={{marginVertical: p*4, textAlign: 'justify'}} preset={Text.preset.h6}>{SGLocalize.translate('deleteAccountReason.descText')}</Text>
                            <SGCheckBoxList single optionList={this.deleteReasonData} value={this.deleteReasonDataValue} onValueChange={(v) => {this.onChooseReasonDelete(v)}}/>
                            <TextInput hidden={this.hiddenText} style={style.vTextInputReason} dataType={TextInput.dataType.text} onValueChange={(v) => { this.deleteReasonDataValue = v;}} placeholder={SGLocalize.translate('deleteAccountReason.reasonPlaceholder')}></TextInput>
                            <Button preset={Button.preset.black} style={style.vButton} textPreset={Text.preset.titleH3B} label={SGLocalize.translate('globalText.Submit')} onPress={this._reasonInputPress.bind(this)}></Button>
                        </ScrollView>
                    </View>
                </SGPopView>
                <CustomMenuBar btnBack accessible={true} accessibilityLabel={'HomeScreenHeader'} currentUser={this.currentUser} navigator={this.props.navigation} imageSetting={this.imageSetting} style={style.throwWHP}></CustomMenuBar>
                <ScrollView accessible={true} accessibilityLabel={'ChooseSettingScreenScrollView'}>
                    {this.data.length !== 0 &&
                        this.data.map((d) => {
                            return (
                                d.show &&
                                ((<View accessible={true} accessibilityLabel={'ChooseSettingScreenContainerView'} key={d.key}>
                                    <TouchableOpacity onPress={() => { this._onPress(d) }}>
                                        {d.type === 1 && (<View accessible={true} accessibilityLabel={'ChooseSettingScreenTopView'} style={style.v2}>
                                            <View accessible={true} accessibilityLabel={'ChooseSettingScreenTTextView'} style={style.v2_1}>
                                                <View accessible={true} accessibilityLabel={'ChooseSettingScreenTTitleView'} style={style.v2_1_1}><Text accessible={true} accessibilityLabel={'ChooseSettingScreenTTitleText'} preset={Text.preset.titleH2}>{d.title}</Text></View>
                                                <View accessible={true} accessibilityLabel={'ChooseSettingScreenTDescView'} style={style.v2_1_2}><Text accessible={true} accessibilityLabel={'ChooseSettingScreenTDescText'} preset={Text.preset.titleH3} style={style.text2}>{d.desc}</Text></View>
                                            </View>
                                            <View accessible={true} accessibilityLabel={'ChooseSettingScreenIconView'} style={style.v2_2}><Icon accessible={true} accessibilityLabel={'ChooseSettingScreenCaretrightIcon'} name={Icon.Icon.caretright} preset={Icon.preset.h6}></Icon></View>
                                        </View>)}
                                    </TouchableOpacity>
                                    {d.type === 2 && (
                                            <View accessible={true} accessibilityLabel={'ChooseSettingScreenBottomView'} style={style.v3}>
                                                <View accessible={true} accessibilityLabel={'ChooseSettingScreenBTextView'} style={style.v3_1}>
                                                    <View accessible={true} accessibilityLabel={'ChooseSettingScreenBTitleView'} style={style.v3_1_1}><Text accessible={true} accessibilityLabel={'ChooseSettingScreenBTitleText'} preset={Text.preset.titleH2}>{d.title}</Text></View>
                                                    <View accessible={true} accessibilityLabel={'ChooseSettingScreenBDescView'} style={style.v3_1_2}><Text accessible={true} accessibilityLabel={'ChooseSettingScreenBDescText'} preset={Text.preset.titleH3} style={style.text2}>{d.desc}</Text></View>
                                                </View>
                                            
                                                <View accessible={true} accessibilityLabel={'ChooseSettingScreenSwitchView'} style={style.v3_2}>
                                                    <Switch accessible={true} accessibilityLabel={'ChooseSettingScreenSwitch'}
                                                        shadow
                                                        trackColor={{ true: "green" }}
                                                        thumbColor={this.check ? "green" : ''}
                                                        value={d.check}
                                                        disabled={false}
                                                        onValueChange={(v) => this._checkClick(d, v)}
                                                    ></Switch>
                                                </View>
                                            </View>
                                    )}
                                </View>))
                            )
                        })
                    }
                    <Text accessible={true} accessibilityLabel={'ChooseSettingScreenChooseProfileText'} preset={Text.preset.titleH4}>{SGLocalize.translate('ChooseScreenProfile.version')} {version}</Text>
                </ScrollView>
            </RootView>
        );
    }
}   