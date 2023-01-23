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
import { ChangeSecurityQuestionForm } from '../../form_V2/ChangeSecurityQuestionForm';
import { SGFormButton as FormButton } from '../../../core/form/SGFormButton';
import { SGHelperGlobalVar } from '../../../core/helper';
import { tbVUserAPI } from '../../api/tbVUserAPI';
import { SGHelperType } from '../../../core/helper';
import { CustomMenuBar } from '../../component_V2/CustomMenuBar';
import { tbSystemParamsDAO } from '../../db/tbSystemParamsDAO';

export class ChangeSecurityQuestionScreen extends SGBaseScreen {
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

    async _refreshData() {
        this.passwordConfirmation = '';
        this.currentUserData = SGHelperGlobalVar.getVar('GlobalCurrentUserData');
        this.oldSecurityQuestionKey = this.currentUserData.fSecurityQuestionKey;
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
        this.oldSecurityQuestionKey = this.currentUserData.fSecurityQuestionKey;
        this.imageSetting = SGHelperGlobalVar.getVar('GlobalImageSetting');
        this.userDataModel = new tbUserData(this.currentUserData);
    }

    async _onSubmitPress() {
        var dataInput = this.userDataModel.getCurrentJSON();
        if ((dataInput.fSecurityQuestionKey) !== '') {
            if (dataInput.fSecurityQuestionKey !== this.oldSecurityQuestionKey) {
                try {
                    var res = await tbVUserAPI.changeSecurityQuestion(dataInput.fSecurityQuestionKey, dataInput.fQuestionAnswer);
                    if (res === true) {
                        this.userDataSetting = await tbSystemParamsDAO.getUserDataSetting();
                        await tbSystemParamsDAO.updateUserDataSetting(this.userDataSetting, dataInput);
                        this.userDataSetting = await tbSystemParamsDAO.getUserDataSetting();
                        SGHelperGlobalVar.setVar('GlobalCurrentUserData', this.userDataSetting.fValue);
                        DialogBox.showToast(SGLocalize.translate('ShowToastMessage.SuccessUpdateSecurityQuestion'),() => {SGHelperNavigation.navigatePop(this.props.navigation, 'ProfileScreen')})   
                    }
                    else {
                        DialogBox.showFail(null, SGLocalize.translate('globalText.FailText'), SGLocalize.translate("ChangeSecurityQuestionScreen.alertFailChangeText"), SGLocalize.translate('globalText.ok'))
                    }
                } catch (error) {
                    SGHelperErrorHandling.Handling(error,this._onSubmitPress.bind(this))
                }
            }
            else {
                DialogBox.showFail(null, SGLocalize.translate('globalText.FailText'), SGLocalize.translate('ChangeSecurityQuestionScreen.alertSecurityQuestionSameText'),SGLocalize.translate('globalText.ok'))
            }
        }
        else {
            DialogBox.showFail(null, SGLocalize.translate('globalText.FailText'), SGLocalize.translate('ChangeSecurityQuestionScreen.alertSecurityAnswerMustFill'), SGLocalize.translate('globalText.ok'))
        }
    }

    render() {
        var { w, h, p } = this.WHP;
        var style = this.style;
  
        return (
            <SGRootView dummyStatusBar accessible={true} accessibilityLabel={'ChangeSecurityQuestionScreenRootScrollView'} style={style.mainView1} contentContainerStyle={style.sv1_2}>
                <CustomMenuBar btnBack accessible={true} accessibilityLabel={'HomeScreenHeader'} currentUser={this.currentUser} navigator={this.props.navigation} imageSetting={this.imageSetting} style={style.throwWHP}></CustomMenuBar>
                <ScrollView dummyHeaderBar dummyFooterBar dummyBottomBar accessible={true} accessibilityLabel={'HomeScreenFavScrollView'} contentContainerStyle={{ alignItems: 'center' }} showsVerticalScrollIndicator={false}>
                    <SpotgueSignHeader accessible={true} accessibilityLabel={'ChangeSecurityQuestionScreenSGSignHeader'} image={image.logoSpotgueHeader[this.imageSetting].url} text={SGLocalize.translate('ChangeSecurityQuestionScreen.Title')} style={style.signHeader}></SpotgueSignHeader>
                    <ChangeSecurityQuestionForm accessible={true} accessibilityLabel={'ChangeSecurityQuestionScreenForm'} userData={this.userDataModel} style={style.throwWHP} language={this.Language} placeHolderPhoneNumber={SGLocalize.translate("ChangeSecurityQuestionScreen.phonePlaceholder")} inputCurrentPhoneNumberText={SGLocalize.translate('ChangeSecurityQuestionScreen.InputCurrentPhoneNumber')} inputNewPhoneNumberText={SGLocalize.translate('ChangeSecurityQuestionScreen.InputNewPhoneNumber')} oldSecurityQuestionKey={this.oldSecurityQuestionKey}></ChangeSecurityQuestionForm>
                    <Button accessible={true} accessibilityLabel={'ChangeSecurityQuestionScreenSubmitButton'} onPress={() => { this._onSubmitPress() }} style={{ marginVertical: 4 * p }} label={SGLocalize.translate('ChangeSecurityQuestionScreen.Button')}></Button>
                </ScrollView>
            </SGRootView>
        );
    }
}
