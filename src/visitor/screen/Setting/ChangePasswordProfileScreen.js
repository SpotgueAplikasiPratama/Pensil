/**
  * 1. Yohanes 01 April 2021
 * - add ErrorHandling
 */
import React from "react";
import { StyleSheet } from "react-native";
import { SGBaseScreen } from '../../../core/screen/SGBaseScreen';
import { SGView as View, SGButton as Button, SGText as Text, SGRootScrollView as SGRootScrollView, SGDialogBox as DialogBox, SGRootView, SGScrollView as ScrollView } from '../../../core/control';
import { SpotgueSignHeader } from '../../container_V2/SpotgueSignHeader';
import { tbUserDAO, tbUserData } from '../../db/tbUserDAO';
import { SGLocalize } from '../../locales/SGLocalize';
import image from '../../asset/image';
import { SGHelperErrorHandling, SGHelperNavigation } from '../../../core/helper';
import { ChangePasswordForm } from '../../form_V2/ChangePasswordForm';
import { SGFormButton as FormButton } from '../../../core/form/SGFormButton';
import { SGHelperGlobalVar } from '../../../core/helper/SGHelperGlobalVar';
import { tbVUserAPI } from '../../api/tbVUserAPI';
import { SGHelperType } from '../../../core/helper';
import { CustomMenuBar } from '../../component_V2/CustomMenuBar';

export class ChangePasswordProfileScreen extends SGBaseScreen {
    createStyleSheet = (whp) => {
        var { w, h, p } = whp;
        var headerHeight = this._screenWHPNoHeader.h - this._screenWHP.h;
        return StyleSheet.create({
            mainView1: { width: w, justifyContent: 'flex-start', backgroundColor: '#FFFFFF' },
            signHeader: { marginTop: p},
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
    }


    async _onSubmitPress() {
        var dataInput = this.userDataModel.getCurrentJSON();
        var emailOrPhoneNumber = this.currentUserData.fEmail !== '' ? this.currentUserData.fEmail : this.currentUserData.fPhoneNumber
        if (dataInput.fPassword !== '') {
            try {
                var changeSuccess = await tbVUserAPI.changePassword(emailOrPhoneNumber, SGHelperType.encrypt(dataInput.fPassword));
                if (changeSuccess) {
                    DialogBox.showSuccess(null, SGLocalize.translate('ChangePasswordScreen.alertChangePasswordSuccessTitle'), SGLocalize.translate('ChangePasswordScreen.alertChangePasswordSuccessText'), SGLocalize.translate('globalText.ok'), () => { SGHelperNavigation.navigatePop(this.props.navigation, 'ChooseSettingScreen') });
                }
                else {
                    DialogBox.showFail(null, SGLocalize.translate('ChangePasswordScreen.alertChangePasswordFailTitle'), SGLocalize.translate('ChangePasswordScreen.alertChangePasswordFailText'))
                    // alert("password not same, please check the password")
                }
            } catch (error) {
                SGHelperErrorHandling.Handling(error,this._onSubmitPress.bind(this))
            }
            
        }
        else {
            DialogBox.showFail(null, SGLocalize.translate('ChangePasswordScreen.alertPasswordMustFillTitle'), SGLocalize.translate('ChangePasswordScreen.alertPasswordMustFillText'))
            // alert('please fill the password!');
        }
    }

    render() {
        var { w, h, p } = this.WHP;
        var style = this.style;

        return (
            <SGRootView dummyStatusBar accessible={true} accessibilityLabel={'ChangePasswordProfileScreenRootScrollView'} style={style.mainView1} contentContainerStyle={style.sv1_2}>
                <CustomMenuBar btnBack accessible={true} accessibilityLabel={'HomeScreenHeader'} currentUser={this.currentUser} navigator={this.props.navigation} imageSetting={this.imageSetting} style={style.throwWHP}></CustomMenuBar>
                <ScrollView dummyHeaderBar dummyFooterBar dummyBottomBar accessible={true} accessibilityLabel={'HomeScreenFavScrollView'} contentContainerStyle={{ alignItems: 'center' }} showsVerticalScrollIndicator={false}>
                    <SpotgueSignHeader accessible={true} accessibilityLabel={'ChangePasswordProfileScreenSGSignHeader'} image={image.logoSpotgueHeader[this.imageSetting].url} text={SGLocalize.translate("ChangePasswordScreen.Title")} style={style.signHeader} ></SpotgueSignHeader>
                    <ChangePasswordForm accessible={true} accessibilityLabel={'ChangePasswordProfileScreenForm'} userData={this.userDataModel} style={style.throwWHP} valueConfirmPassword={this.passwordConfirmation} placeholderPassword={SGLocalize.translate("ChangePasswordScreen.InputNewPassword1")} placeholderConfirmPassword={SGLocalize.translate("ChangePasswordScreen.InputNewPassword1")} NoteText={SGLocalize.translate("ChangePasswordScreen.NoteText")}></ChangePasswordForm>
                    <FormButton data={this.userDataModel} accessible={true} accessibilityLabel={'ChangePasswordProfileScreenSubmitButton'} onPress={async() => { await this._onSubmitPress() }} label={SGLocalize.translate("UserProfileScreen.ButtonText")}></FormButton>
                </ScrollView>
            </SGRootView>
        );
    }
}
