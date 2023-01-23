/**
 * Version 1.2.0
 * 1. Yohanes April 01 2021
 * - add Error Handling
 */
import React from "react";
import { StyleSheet } from "react-native";
import { SGBaseScreen } from "../../../core/screen/SGBaseScreen";
import { SGView as View, SGButton as Button, SGText as Text, SGRootScrollView as SGRootScrollView, SGDialogBox as DialogBox, SGImage as Image } from '../../../core/control';
import { SGHelperNavigation, SGHelperType, SGHelperGlobalVar, SGHelperErrorHandling } from '../../../core/helper';
import image from '../../asset/image';
import { SGLocalize } from '../../locales/SGLocalize';
import { ForgotPasswordChangePasswordForm } from '../../form_V2/ForgotPasswordChangePasswordForm';
import {  tbVUserAPI } from '../../api/tbVUserAPI';
import { BackButton } from '../../component_V2/BackButton';
import { SGFormButton } from "../../../core/form";

export class ForgotPasswordChangePasswordScreen extends SGBaseScreen {
    createStyleSheet = (whp) => {
        var { w, h, p } = whp;
        return StyleSheet.create({
            mainView1: { width: w, backgroundColor: 'white' },
            sv1_2: { width: w, justifyContent: 'center', backgroundColor: 'white' },
            welcomeText: { marginLeft: 12 * p, marginBottom: 4 * p, alignSelf: 'flex-start' },
            throwWHP: { width: w, height: h, padding: p },
            containerView1: { width: (w - 2 * p), height: h, padding: p },
            headerMargin1: { marginBottom: (w - 2 * p) * 0.04 },
            text1: { color: '#909090', alignSelf: 'center', marginHorizontal: w * 0.05, marginTop: 3 * p, },
            text2: { fontSize: w * 0.03, color: 'black', opacity: 0.6 },
            textButton1: { fontSize: w * 0.05, color: 'white' },
            inputView1: { width: w - 2 * p, height: w * 0.13, alignItems: "center", justifyContent: 'center', padding: p, marginVertical: w * 0.02 },
            button1: { backgroundColor: '#465056', marginTop: 5 * p, width: w * 0.45, height: w * 0.125, justifyContent: "center", alignSelf: "center", alignItems: "center", borderRadius: p * 10 },
            headerView: { flexDirection: 'row', width: w - 16 * p, justifyContent: 'space-between', alignSelf: 'center' },
            logo: { backgroundColor: 'transparent', alignSelf: 'flex-end', marginTop: 8 * p, marginBottom: 6 * p, marginRight: 2 * p }
        });
    };
    constructor(props, context, ...args) {
        super(props, context, ...args);
        this.style = this.createStyleSheet(this.WHP);
        this.props.navigation.setOptions({
            headerShown: false
        });
        this.passwordConfirmation = '';
        this.imageSetting = SGHelperGlobalVar.getVar('GlobalImageSetting')
        this.userData = (this.props.route.params.data);
        this.selectedTab = this.props.route.params.selectedTab;
    }

    componentDidMount() {
        this._unsubscribe = this.props.navigation.addListener('focus', () => {
            this.forceUpdate();
        });
    }


    async _onSubmitPress(dataInput) {
        if (dataInput.fPassword !== '') {
            try {
                this.dbID= DialogBox.showLoading(SGLocalize.translate("AlertMessage.Waiting"))
                if (this.selectedTab === 0) {
                    await tbVUserAPI.changePasswordForgotPassword(this.userData.fEmail, SGHelperType.encrypt(dataInput.fPassword));
                }
                if (this.selectedTab === 1) {
                    await tbVUserAPI.changePasswordForgotPassword(this.userData.fPhoneNumber, SGHelperType.encrypt(dataInput.fPassword));
                }
                DialogBox.hideDialogBox(this.dbID,true)
                DialogBox.showSuccess(null, SGLocalize.translate('ForgotPasswordChangePasswordScreen.AlertChangePasswordTitle'), SGLocalize.translate('ForgotPasswordChangePasswordScreen.AlertChangePasswordText'), SGLocalize.translate('globalText.ok'), () => {SGHelperNavigation.navigateReset(this.props.navigation, 'SignIn')}, true);
            } catch (error) {
                DialogBox.hideDialogBox(this.dbID,true)
                SGHelperErrorHandling.Handling(error,this._onSubmitPress.bind(this,dataInput))
            }
        }
        else {
            DialogBox.showFail(null, SGLocalize.translate('ChangePasswordScreen.alertPasswordMustFillTitle'), SGLocalize.translate('ChangePasswordScreen.alertPasswordMustFillText'))
        }
    }

    render() {
        var { w, h, p } = this.WHP;
        var style = this.style;
        return (
            <SGRootScrollView accessible={true} accessibilityLabel={'ForgotPasswordChangePasswordScreenRootScrollView'} style={style.mainView1} contentContainerStyle={style.sv1_2}>
                <View style={style.headerView}>
                    <BackButton color={'black'} hidden={!SGHelperNavigation.canGoBack(this.props.navigation)} imageSetting={this.imageSetting} navigator={this.props.navigation}></BackButton>
                    <Image source={{ uri: image.spotgueLogoOnly[this.imageSetting].url }} style={style.logo}></Image>
                </View>
                <Text preset={Text.preset.titleH1B} style={style.welcomeText}>{SGLocalize.translate("ForgotPasswordSecurity1Screen.headerTitle")}</Text>
                <ForgotPasswordChangePasswordForm accessible={true} accessibilityLabel={'ForgotPasswordChangePasswordScreenForgotPass'} ph1={SGLocalize.translate("ForgotPasswordChangePasswordScreen.placeholder1")} ph2={SGLocalize.translate("ForgotPasswordChangePasswordScreen.placeholder2")} passwordText={SGLocalize.translate("ForgotPasswordChangePasswordScreen.passwordText")} userData={this.userData} style={style.throwWHP}></ForgotPasswordChangePasswordForm>
                <SGFormButton preset={SGFormButton.preset.t3_h3B} data={this.userData} accessible={true} accessibilityLabel={'ChangePasswordScreenSubmitButton'} shadow label={SGLocalize.translate("ForgotPasswordChangePasswordScreen.buttonSubmit")} onPress={this._onSubmitPress.bind(this, this.userData)}></SGFormButton>
            </SGRootScrollView>
        );
    }
}
