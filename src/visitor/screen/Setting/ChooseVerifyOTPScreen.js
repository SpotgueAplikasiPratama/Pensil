/**.
 * Version 1.2.0
  * 1. Yohanes 01 April 2021
 * - add ErrorHandling
 * Version 1.1.0
 * 1 Yohanes , 10 March 2021
 * - change style
 */
import React from 'react';
import { StyleSheet, } from 'react-native';
import { SGBaseScreen } from '../../../core/screen/SGBaseScreen';
import { SGTouchableOpacity as TouchableOpacity, SGButton as Button, SGText as Text, SGView as View, SGRootView as RootView, SGRootScrollView, SGOTPInput as OTPInputView, SGDialogBox as DialogBox, SGImage as Image } from '../../../core/control';
import { SGHelperNavigation, SGHelperGlobalVar,SGHelperStyle,SGHelperType, SGHelperErrorHandling } from '../../../core/helper';
import { SGLocalize } from '../../locales/SGLocalize';
import { BackButton } from '../../component_V2/BackButton';
import image from '../../asset/image';
import { tbVUserAPI } from '../../api/tbVUserAPI';
import { tbSystemParamsDAO } from '../../db/tbSystemParamsDAO';

export class ChooseVerifyOTPScreen extends SGBaseScreen {
    createStyleSheet() {
        var { w, h, p } = this._screenWHP;

        return StyleSheet.create({
            mainView1: { width: w, backgroundColor: 'white' },
            headerView: { flexDirection: 'row', width: w - 16 * p, justifyContent: 'space-between', alignSelf: 'center' },
            sv1_2: { width: w, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white' },
            text1: { alignItems: 'center', color: '#909090', marginVertical: 3 * p },
            text2: { color: '#909090', marginTop: 3 * p, textAlign: 'center', },
            text3: { textAlign: 'center', color: '#63aee0', },
            button1: { backgroundColor: '#465056', marginTop: 4 * p, width: w * 0.425, height: w * 0.125, justifyContent: "center", alignSelf: "center", alignItems: "center", borderRadius: p * 10, shadowOpacity: 0.15, shadowRadius: 0.5 * p },
            inactiveOTPField: { padding: p, backgroundColor: 'white', borderRadius: 3 * p, fontSize: w * 0.1, color: "black" },
            activeOTPField: { padding: p, backgroundColor: 'white', borderColor: 'red', borderRadius: 3 * p, fontSize: w * 0.1, color: "black", },
            logo: { backgroundColor: 'transparent', alignSelf: 'flex-end', marginTop: 8 * p, marginBottom: 6 * p },
            titleText: { /*marginLeft: 12 * p,*/ marginBottom: 4 * p, /*alignSelf: 'flex-start'*/ alignSelf:'center' },
            bodyText: { marginLeft: 12 * p, alignSelf: 'flex-start', maxWidth: 0.8 * w, color: '#465056' },
            methodCard: { borderRadius: 2 * p, width: w * 0.85,minHeight:w*0.2, backgroundColor: 'white', paddingVertical: 2 * p, marginVertical: 2 * p }
        });
    }

    constructor(props, context, ...args) {
        super(props, context, ...args);
        this.style = this.createStyleSheet();
        this.props.navigation.setOptions({
            headerShown: false,
        });
        this.userData = this.props.route.params.data;
        this.fUserID = this.userData.fUserID;
        this.contentType = this.props.route.params.contentType;
        this.screen = this.props.route.params.screen;
        this.imageSetting = SGHelperGlobalVar.getVar('GlobalImageSetting');
        this.firstTimeEmail = SGHelperGlobalVar.addVar('firstTimeOtpSettingEmail',true);
        this.firstTimePhoneNumber = SGHelperGlobalVar.addVar('firstTimeOtpSettingPhoneNumber',true);
        
    }

    async _onSubmitPress() {
        try {
            if (this.state.otp == this.OTPCode) {
                if (this.contentType === 'email') {
                    var res = await tbVUserAPI.changeEmail(this.userData.fEmail);
                }
                if (this.contentType === 'phonenumber') {
                    var res = await tbVUserAPI.changePhoneNumber(this.userData.fPhoneNumber);
                }
                if (res === true) {
                    this.userDataSetting = await tbSystemParamsDAO.getUserDataSetting();
                    await tbSystemParamsDAO.updateUserDataSetting(this.userDataSetting, this.userData);
                    this.userDataSetting = await tbSystemParamsDAO.getUserDataSetting();
                    SGHelperGlobalVar.setVar('GlobalCurrentUserData', this.userDataSetting.fValue);
                    SGHelperNavigation.navigatePopPush(this.props.navigation, 'ChooseSettingScreen');
                }
                else {
                    DialogBox.showFail(null, SGLocalize.translate('globalText.FailText'), SGLocalize.translate("ChooseVerifyOTPScreen.AlertFailVerify"), SGLocalize.translate('globalText.ok'))
                }
            } 
        } catch (error) {
            SGHelperErrorHandling.Handling(error,this._onSubmitPress.bind(this))
        }


    }

    _onMethodPress(verifyMethod) {
       if(verifyMethod == 'email'){
        //check OTP send request time
        if(this.firstTimeEmail){
            this.firstTimeEmail = SGHelperGlobalVar.setVar('firstTimeOtpSettingEmail',false);
            SGHelperNavigation.navigatePopPush(this.props.navigation, 'FirstVerifyOTP', { data: this.userData, verifyMethod: verifyMethod, screen: this.screen })
        }else{
        var dateNow = new Date();
        var dateOtp = new Date(SGHelperGlobalVar.getVar('otpDateSettingFirstOTP'));
        var dateOtpPlus1Minutes = new Date(dateOtp.getFullYear(),dateOtp.getMonth(),dateOtp.getDate(),dateOtp.getHours(),dateOtp.getMinutes()+1,dateOtp.getSeconds());
            if(dateNow > dateOtpPlus1Minutes){
                SGHelperNavigation.navigatePopPush(this.props.navigation, 'FirstVerifyOTP', { data: this.userData, verifyMethod: verifyMethod, screen: this.screen })
            }else{
                DialogBox.showWarning(null, SGLocalize.translate('globalText.FailText'), SGLocalize.translate('globalText.FailRequestOTP'), SGLocalize.translate('globalText.ok'), () => { }, true);
            }
        }

       }else{
        //check OTP send request time
        if(this.firstTimePhoneNumber){
            this.firstTimePhoneNumber = SGHelperGlobalVar.setVar('firstTimeOtpSettingPhoneNumber',false);
            SGHelperNavigation.navigatePopPush(this.props.navigation, 'FirstVerifyOTP', { data: this.userData, verifyMethod: verifyMethod, screen: this.screen })
        }else{
        var dateNow = new Date();
        var dateOtp = new Date(SGHelperGlobalVar.getVar('otpDateSettingFirstOTP'));
        var dateOtpPlus1Minutes = new Date(dateOtp.getFullYear(),dateOtp.getMonth(),dateOtp.getDate(),dateOtp.getHours(),dateOtp.getMinutes()+1,dateOtp.getSeconds());
            if(dateNow > dateOtpPlus1Minutes){
                SGHelperNavigation.navigatePopPush(this.props.navigation, 'FirstVerifyOTP', { data: this.userData, verifyMethod: verifyMethod, screen: this.screen })
            }else{
                DialogBox.showWarning(null, SGLocalize.translate('globalText.FailText'), SGLocalize.translate('globalText.FailRequestOTP'), SGLocalize.translate('globalText.ok'), () => { }, true);
            }
        }

       }
        // SGHelperNavigation.navigatePush(this.props.navigation, 'FirstVerifyOTP', { data: this.userData, verifyMethod: verifyMethod, screen: this.screen })
    }

    render() {
        var { w, h, p } = this.WHP;
        var style = this.style;
        return (
            <SGRootScrollView accessible={true} accessibilityLabel={'ChooseVerifyOTPScreenRootView'} style={style.mainView1} contentContainerStyle={style.sv1_2}>
                <View style={style.headerView}>
                    <BackButton color={'black'} hidden={!SGHelperNavigation.canGoBack(this.props.navigation)} imageSetting={this.imageSetting} navigator={this.props.navigation}></BackButton>
                    <Image source={{ uri: image.magLogoOnly[this.imageSetting].url }} style={style.logo}></Image>
                </View>
                <Text preset={Text.preset.titleH1B} style={style.titleText}>{SGLocalize.translate('ChooseVerifyOTPScreen.Title')}</Text>
                {
                    this.userData.fPhoneNumber !== '' ?
                        (<TouchableOpacity  onPress={() => this._onMethodPress('phonenumber')}>
                            <View style={style.methodCard} shadow>
                                <Text numberofLines={2} style={{textAlign:'center'}}>{SGLocalize.translate('ChooseVerifyOTPScreen.Text1')} {this.userData.fPhoneNumber}</Text>
                            </View>
                        </TouchableOpacity>)
                        :
                        (null)
                }
                {
                    this.userData.fEmail !== '' ?
                        (<TouchableOpacity  onPress={() => this._onMethodPress('email')}>
                            <View style={style.methodCard} shadow>
                                <Text numberofLines={2} style={{textAlign:'center'}} >{SGLocalize.translate('ChooseVerifyOTPScreen.Text2')} {this.userData.fEmail}</Text>
                            </View>
                        </TouchableOpacity>)
                        :
                        (null)
                }
            </SGRootScrollView>
        );
    }
}
