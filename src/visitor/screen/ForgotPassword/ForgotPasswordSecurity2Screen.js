/**
 * Version 1.2.0
 * 1. Yohanes April 01 2021
 * - add Error Handling
 */
import React from "react";
import { StyleSheet } from "react-native";
import { SGBaseScreen } from "../../../core/screen/SGBaseScreen";
import { SGLocalize } from '../../locales/SGLocalize';
import { SGView as View, SGButton as Button, SGText as Text, SGRootScrollView, SGDialogBox as DialogBox, SGImage as Image } from '../../../core/control';
import { SGHelperErrorHandling, SGHelperGlobalVar, SGHelperNavigation, SGHelperType } from '../../../core/helper';
import image from '../../asset/image';
import { tbLookupDAO } from '../../db/tbLookupDAO';
import { ForgotPasswordSecurity2Form } from '../../form_V2/ForgotPasswordSecurity2Form';
import { tbVUserAPI } from '../../api/tbVUserAPI';
import { BackButton } from '../../component_V2/BackButton';
import { VisitorHelper } from '../../helper/VisitorHelper';

export class ForgotPasswordSecurity2Screen extends SGBaseScreen {

    createStyleSheet = (whp) => {
        var { w, h, p } = whp;

        return StyleSheet.create({
            mainView1: { width: w, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white', flex: 1 },
            headerView: { flexDirection: 'row', width: w - 16 * p, justifyContent: 'space-between', alignSelf: 'center' },
            sv1_2: { width: w, justifyContent: 'flex-start', backgroundColor: 'white', flex: 1 },
            throwWHP: { width: w, height: h, padding: p },
            text1: { marginTop: 4 * p, marginLeft: 12 * p, marginBottom: 4 * p, alignSelf: 'flex-start', color: '#909090' },
            text2: { marginTop: 10 * p, marginLeft: 12 * p, alignSelf: 'flex-start', maxWidth: 0.8 * w, color: '#465056' },
            button1: { marginVertical: 12 * p, backgroundColor: '#465056', marginTop: 5 * p, width: w * 0.45, height: w * 0.125, justifyContent: "center", alignSelf: "center", alignItems: "center", borderRadius: p * 10 },
            logo: { backgroundColor: 'transparent', alignSelf: 'flex-end', marginTop: 8 * p, marginBottom: 6 * p, marginRight: 2 * p }
        });
    };

    async componentDidMount() {
        await this._onRefreshAllItem();
        this._unsubscribe = this.props.navigation.addListener('focus', async () => {
            await this._onRefreshAllItem();
        });
    }
    componentWillUnmount() {
        if (this._unsubscribe) { this._unsubscribe(); }
    }

    async _onRefreshAllItem() {
        this.securityQuestion = await this._pullQuestionData();
        this.forceUpdate();
    }

    constructor(props, context, ...args) {
        super(props, context, ...args);
        this.style = this.createStyleSheet(this.WHP);
        this.props.navigation.setOptions({
            headerShown: false,
        });
        this.userData = this.props.route.params.data;
        this.dataInput = this.userData.getCurrentJSON();
        this.imageSetting = SGHelperGlobalVar.getVar('GlobalImageSetting');
        this.firstTime = SGHelperGlobalVar.addVar('firstTimeOtp',true);
    }

    async _pullQuestionData() {
        if (this.props.route.params.selectedTab === 0) {
            var input = this.dataInput.fEmail
        }
        if (this.props.route.params.selectedTab === 1) {
            var input = this.dataInput.fPhoneNumber
        }
        try {
            var securityQuestion = await tbVUserAPI.getSecurityQuestion(input)
            return securityQuestion;
        } catch (error) {
            SGHelperErrorHandling.Handling(error,this._pullQuestionData.bind(this))
            return null
        }
        
    }
    _checkUserAnswer(checkUserAnswer){


        console.log(checkUserAnswer)
        if (checkUserAnswer) {  
            console.log(checkUserAnswer)
            if(this.firstTime){
                this.firstTime = SGHelperGlobalVar.setVar('firstTimeOtp',false);
                SGHelperNavigation.navigate(this.props.navigation, 'VerifyOTPForgotPassword', { data: this.props.route.params.data, selectedTab: this.props.route.params.selectedTab });
            }else{
                var dateNow = new Date();
                var dateOtp = new Date(SGHelperGlobalVar.getVar('otpDate'));
                var dateOtpPlus1Minutes = new Date(dateOtp.getFullYear(),dateOtp.getMonth(),dateOtp.getDate(),dateOtp.getHours(),dateOtp.getMinutes()+1,dateOtp.getSeconds());
                if(dateNow > dateOtpPlus1Minutes){
                    SGHelperNavigation.navigate(this.props.navigation, 'VerifyOTPForgotPassword', { data: this.props.route.params.data, selectedTab: this.props.route.params.selectedTab });
                }else{
                    DialogBox.showWarning(null, SGLocalize.translate('globalText.FailText'), SGLocalize.translate('globalText.FailRequestOTP'), SGLocalize.translate('globalText.ok'), () => { }, true);
                }
            }
        }else {
            DialogBox.showFail(null, SGLocalize.translate('ForgotPasswordSecurity2Screen.alertWrongAnswerTitle'), SGLocalize.translate('ForgotPasswordSecurity2Screen.alertWrongAnswerText'), SGLocalize.translate('globalText.ok'));
        }
    }
    async _onNextPress() {
        var dataInput = this.userData.getCurrentJSON();
        if (dataInput.fQuestionAnswer !== '') {

            if (this.props.route.params.selectedTab === 0) {
                this.baseRunSingleAPIWithRedoOption('checkSecurityQuestion', (async (v1,v2) => { return tbVUserAPI.checkSecurityQuestion(v1,v2) }).bind(this, this.dataInput.fEmail, dataInput.fQuestionAnswer), ((v) => {
                var checkUserAnswer = v //await tbVUserAPI.checkSecurityQuestion(this.dataInput.fEmail, dataInput.fQuestionAnswer)
                this._checkUserAnswer(checkUserAnswer)
                }).bind(this),  null,  SGHelperGlobalVar.getVar("ResponTimes"));
            }
            if (this.props.route.params.selectedTab === 1) {

                this.baseRunSingleAPIWithRedoOption('checkSecurityQuestion', (async (v1,v2) => { return tbVUserAPI.checkSecurityQuestion(v1,v2) }).bind(this, this.dataInput.fPhoneNumber, dataInput.fQuestionAnswer), ((v) => {
                    var checkUserAnswer = v //await tbVUserAPI.checkSecurityQuestion(this.dataInput.fEmail, dataInput.fQuestionAnswer)
                    this._checkUserAnswer(checkUserAnswer)
                }).bind(this),  null,  SGHelperGlobalVar.getVar("ResponTimes"));
            }
            
        }
        else {
            DialogBox.showFail(null, SGLocalize.translate('ForgotPasswordSecurity2Screen.alertMustFillTitle'), SGLocalize.translate('ForgotPasswordSecurity2Screen.alertMustFillText'), SGLocalize.translate('globalText.ok'));
        }
    }

    render() {
        var { w, h, p } = this.WHP;
        var style = this.style;

        return (
            <SGRootScrollView accessible={true} accessibilityLabel={'ForgotPasswordSecurity2ScreenRootScrollView'} style={style.mainView1} contentContainerStyle={style.sv1_2}>
                <View style={style.headerView}>
                    <BackButton color={'black'} hidden={!SGHelperNavigation.canGoBack(this.props.navigation)} imageSetting={this.imageSetting} navigator={this.props.navigation}></BackButton>
                    <Image source={{ uri: image.spotgueLogoOnly[this.imageSetting].url }} style={style.logo}></Image>
                </View>
                <Text accessible={true} accessibilityLabel={'ForgotPasswordSecurity2ScreenTextQuestion'} preset={Text.preset.h7} style={style.text1}>{SGLocalize.translate("ForgotPasswordSecurity2Screen.text1")}</Text>
                {SGHelperType.isDefined(this.securityQuestion) && this.securityQuestion!==''?
                    (<Text accessible={true} accessibilityLabel={'ForgotPasswordSecurity2ScreenTextQuestion2'} preset={Text.preset.h6B} style={style.text2}>{VisitorHelper.getLocalizeDataFromLookUp('SecurityQuestion',this.securityQuestion,this._language)}</Text>)
                    :
                    (null)}
                <ForgotPasswordSecurity2Form accessible={true} accessibilityLabel={'ForgotPasswordSecurity2ScreenSecurity2Form'} placeholder={SGLocalize.translate("ForgotPasswordSecurity2Screen.placeholder1")} userData={this.userData} style={style.throwWHP}></ForgotPasswordSecurity2Form>
                <Button accessible={true} accessibilityLabel={'ForgotPasswordSecurity2ScreenButtonNext'} textPreset={Text.preset.h5B} style={style.button1} label={SGLocalize.translate("ForgotPasswordSecurity2Screen.buttonNext")} onPress={this._onNextPress.bind(this)}>
                </Button>
            </SGRootScrollView>
        );
    }
}
