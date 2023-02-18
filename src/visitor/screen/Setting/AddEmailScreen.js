/**
 * 1. Yohanes 01 April 2021
 * - add ErrorHandling
 *  *  * 2. Leon 12 Apr 2021
 * - add ErrorHandling
 */
import React from "react";
import { StyleSheet } from "react-native";
import { SGBaseScreen } from '../../../core/screen/SGBaseScreen';
import { SGView as View, SGButton as Button, SGText as Text, SGRootScrollView as SGRootScrollView, SGDialogBox as DialogBox, SGRootView, SGScrollView as ScrollView } from '../../../core/control';
import { SpotgueSignHeader } from '../../container_V2/SpotgueSignHeader';
import {  tbUserData } from '../../db/tbUserDAO';
import { SGLocalize } from '../../locales/SGLocalize';
import image from '../../asset/image';
import { SGHelperNavigation,SGHelperGlobalVar,SGHelperType, SGHelperErrorHandling } from '../../../core/helper';
import { AddEmailForm } from '../../form_V2/AddEmailForm';
import { tbVUserAPI } from '../../api/tbVUserAPI';
import { CustomMenuBar } from '../../component_V2/CustomMenuBar';

export class AddEmailScreen extends SGBaseScreen {
    createStyleSheet = (whp) => {
        var { w, h, p } = whp;
        var headerHeight = this._screenWHPNoHeader.h - this._screenWHP.h;
        return StyleSheet.create({
            mainView1: { width: w, justifyContent: 'flex-start', backgroundColor: '#FFFFFF' },
            signHeader: { marginTop: p },
            sv1_2: { width: w, padding: p, justifyContent: 'flex-start', backgroundColor: 'white' },
            throwWHP: { width: w, height: h, padding: p },
            containerView1: { width: (w - 2 * p), height: h, padding: p },
            headerMargin1: { marginBottom: (w - 2 * p) * 0.04 },
            text1: { color: '#909090', alignSelf: 'center', marginHorizontal: w * 0.05, marginTop: 3 * p, },
            text2: { fontSize: w * 0.03, color: 'black', opacity: 0.6 },
            textButton1: { fontSize: w * 0.05, color: 'white' },
            inputView1: { width: w - 2 * p, height: w * 0.13, alignItems: "center", justifyContent: 'center', padding: p, marginVertical: w * 0.02 },
        });
    };

    async componentDidMount() {
        this._refreshData();
        this._unsubscribe = this.props.navigation.addListener('focus', async () => {
            this._refreshData();
        });
    }

    _componentWillUnmount() {
        if (this._unsubscribe) { this._unsubscribe(); }
    }

     _refreshData() {
        this.passwordConfirmation = '';
        this.currentUserData = SGHelperGlobalVar.getVar('GlobalCurrentUserData');
        this.imageSetting = SGHelperGlobalVar.getVar('GlobalImageSetting');
        this.forceUpdate();
    }

    constructor(props, context, ...args) {
        super(props, context, ...args);
        this.style = this.createStyleSheet(this.WHP);
        this.props.navigation.setOptions({
            headerShown: false,
        });
        this.passwordConfirmation = '';
        this.currentUserData = SGHelperGlobalVar.getVar('GlobalCurrentUserData');
        this.imageSetting = SGHelperGlobalVar.getVar('GlobalImageSetting');
        this.userDataModel = new tbUserData(this.currentUserData);
        this.firstTimeAddEmail = SGHelperGlobalVar.addVar('firstTimeAddEmailOTP',true);
    }

    async _onSubmitPress() {
        var dataInput = this.userDataModel.getCurrentJSON();
        if (dataInput.fEmail !== '') {
            if (dataInput.fEmail !== this.oldEmail) {
                // try {
                    this.baseRunSingleAPIWithRedoOption('isEmailOrPhoneAvailable', (async (v1) => { return tbVUserAPI.isEmailOrPhoneAvailable(v1) }).bind(this, dataInput.fEmail), ((v) => {           
                            var isEmailAvailable = v//await tbVUserAPI.isEmailOrPhoneAvailable(dataInput.fEmail);
                            if (isEmailAvailable.canBeUsed) {
                                //check OTP send request time
                                if(this.firstTimeAddEmail){
                                    this.firstTimeAddEmail = SGHelperGlobalVar.setVar('firstTimeAddEmailOTP',false);
                                    SGHelperNavigation.navigatePopPush(this.props.navigation, 'VerifyOTP', { data: this.userDataModel, contentType: 'email', verifyMethod: 'email' })
                                }else{
                                var dateNow = new Date();
                                var dateOtp = new Date(SGHelperGlobalVar.getVar('otpLastVerifyOTPSetting'));
                                var dateOtpPlus1Minutes = new Date(dateOtp.getFullYear(),dateOtp.getMonth(),dateOtp.getDate(),dateOtp.getHours(),dateOtp.getMinutes()+1,dateOtp.getSeconds());
                                    if(dateNow > dateOtpPlus1Minutes){
                                        SGHelperNavigation.navigatePopPush(this.props.navigation, 'VerifyOTP', { data: this.userDataModel, contentType: 'email', verifyMethod: 'email' })
                                    }else{
                                        DialogBox.showWarning(null, SGLocalize.translate('globalText.FailText'), SGLocalize.translate('globalText.FailRequestOTP'), SGLocalize.translate('globalText.ok'), () => { }, true);
                                    }
                                }
                            }
                            else {
                                DialogBox.showFail(null, SGLocalize.translate('globalText.FailText'), SGLocalize.translate('AddEmailScreen.alertEmailAlreadyUsedText'), SGLocalize.translate('globalText.ok'))
                            }
                        // } catch (error) {
                        //     SGHelperErrorHandling.Handling(error,this._onSubmitPress.bind(this))
                        // }
                    }).bind(this), null, SGHelperGlobalVar.getVar("ResponTimes"));
            }
            else {
                DialogBox.showFail(null, SGLocalize.translate('globalText.FailText'), SGLocalize.translate('AddEmailScreen.alertEmailUpdateSameText'), SGLocalize.translate('globalText.ok'))
            }
        }
        else {
            DialogBox.showFail(null, SGLocalize.translate('globalText.FailText'), SGLocalize.translate('AddEmailScreen.alertEmailMustFillText'), SGLocalize.translate('globalText.ok'))
        }
    }

    render() {
        var { w, h, p } = this.WHP;
        var style = this.style;

        return (
            <SGRootView dummyStatusBar accessible={true} accessibilityLabel={'AddEmailScreenRootScrollView'} style={style.mainView1} contentContainerStyle={style.sv1_2}>
                <CustomMenuBar btnBack accessible={true} accessibilityLabel={'HomeScreenHeader'} currentUser={this.currentUser} navigator={this.props.navigation} imageSetting={this.imageSetting} style={style.throwWHP}></CustomMenuBar>
                <ScrollView dummyHeaderBar dummyFooterBar dummyBottomBar accessible={true} accessibilityLabel={'HomeScreenFavScrollView'} contentContainerStyle={{ alignItems: 'center' }} showsVerticalScrollIndicator={false}>
                    <SpotgueSignHeader accessible={true} accessibilityLabel={'AddEmailScreenSGSignHeader'} image={image.logoMagHeader[this.imageSetting].url} text={SGLocalize.translate("AddEmailScreen.Title")} style={style.signHeader}></SpotgueSignHeader>
                    <AddEmailForm accessible={true} accessibilityLabel={'AddEmailScreenForm'} userData={this.userDataModel} style={style.throwWHP} placeHolderEmail={SGLocalize.translate("AddEmailScreen.emailPlaceholder")} inputCurrentEmailText={SGLocalize.translate('AddEmailScreen.InputCurrentEmail')} inputNewEmailText={SGLocalize.translate('AddEmailScreen.InputNewEmail')} oldEmail={this.oldEmail}></AddEmailForm>
                    <Button accessible={true} accessibilityLabel={'AddEmailScreenSubmitButton'} onPress={() => { this._onSubmitPress() }} label={SGLocalize.translate("AddEmailScreen.ButtonNext")}></Button>
                </ScrollView>
            </SGRootView>
        );
    }
}
