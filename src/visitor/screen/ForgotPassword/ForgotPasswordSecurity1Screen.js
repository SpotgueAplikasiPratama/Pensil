/**
 * Version 1.2.0
 * 1. Yohanes April 01 2021
 * - add Error Handling
 */
import React from "react";
import { StyleSheet } from "react-native";
import { SGBaseScreen } from "../../../core/screen/SGBaseScreen";
import { SGButton as Button, SGText as Text, SGRootScrollView, SGDialogBox as DialogBox, SGImage as Image, SGView as View, SGTabView as TabView, SGTouchableOpacity as TouchableOpacity } from '../../../core/control';
import { tbUserDataModelPassword } from '../../db/tbUserDAO';
import { SGLocalize } from '../../locales/SGLocalize';
import { SGHelperErrorHandling, SGHelperGlobalVar, SGHelperNavigation } from '../../../core/helper';
import image from '../../asset/image';
import { tbVUserAPI } from '../../api/tbVUserAPI';
import { SignUpFormWithEmail } from '../../form_V2/SignUpFormWithEmail';
import { SignUpFormWithPhoneNumber } from '../../form_V2/SignUpFormWithPhoneNumber';
import { BackButton } from '../../component_V2/BackButton';
import { VisitorHelper } from '../../helper/VisitorHelper';

export class ForgotPasswordSecurity1Screen extends SGBaseScreen {

    createStyleSheet = (whp) => {
        var { w, h, p } = whp;
        return StyleSheet.create({
            mainView1: { width: w, justifyContent: 'flex-start', backgroundColor: 'white' },
            headerView: { flexDirection: 'row', width: w - 16 * p, justifyContent: 'space-between', alignSelf: 'center' },
            welcomeText: { marginLeft: 12 * p, marginBottom: 4 * p, alignSelf: 'flex-start' },
            welcomeBodyText: { marginLeft: 12 * p, alignSelf: 'flex-start', maxWidth: 0.8 * w, color: '#465056' },
            sv1_2: { width: w, justifyContent: 'flex-start', backgroundColor: 'white' },
            throwWHP: { width: w, height: h, padding: p },
            text1: { color: '#909090', alignSelf: 'center', marginHorizontal: w * 0.05, marginTop: 3 * p, },
            button1: { backgroundColor: '#465056', width: w * 0.45, height: w * 0.125, justifyContent: "center", alignSelf: "center", alignItems: "center", borderRadius: p * 10 },
            tabViewContainer: { width: w * 0.8, height: w * 0.443 },
            tabViewStyle: { marginTop: 8 * p },
            tabBarStyle: { backgroundColor: 'transparent', marginHorizontal: 0, width:w*0.8 },
            logo: { backgroundColor: 'transparent', alignSelf: 'flex-end', marginTop: 8 * p, marginBottom: 6 * p, marginRight: 2 * p }
        });
    };

    constructor(props, context, ...args) {
        super(props, context, ...args);
        this.style = this.createStyleSheet(this.WHP);
        this.props.navigation.setOptions({
            headerShown: false,
        });
        this.imageSetting = SGHelperGlobalVar.getVar('GlobalImageSetting');
        this.userData = new tbUserDataModelPassword();
        this.countryPhoneCode = '+62';
        console.log('ForgotPasswordSecurity1Screen')
    }

    _onChangeTab(e) {
        this._activeTab = e.i;
        this.forceUpdate()
    }

    _setCountryPhoneCode(v){
        this.countryPhoneCode = v;
        this.forceUpdate();
    }

    async _onNextPress() {

        var dataInput = this.userData.getCurrentJSON();
        if (this._activeTab === 0) {
            if (dataInput.fEmail !== '') {
                this.baseRunSingleAPIWithRedoOption('isEmailOrPhoneAvailable', (async (v) => { return tbVUserAPI.isEmailOrPhoneAvailable(v) }).bind(this, dataInput.fEmail), ((v) => {
                    var isAvailable = v
                    if (isAvailable.canBeUsed == false) {
                        SGHelperNavigation.navigatePush(this.props.navigation, 'VerifyOTPForgotPassword', { data: this.userData, selectedTab: this._activeTab });
                    }
                    else {
                        DialogBox.showFail(null, SGLocalize.translate('ForgotPasswordSecurity1Screen.alertUnregisteredTitle'), SGLocalize.translate('ForgotPasswordSecurity1Screen.alertUnregisteredText'), SGLocalize.translate('globalText.ok'));
                    }
                }).bind(this),  null,  SGHelperGlobalVar.getVar("ResponTimes"));
                // var isAvailable = await tbVUserAPI.isEmailOrPhoneAvailable(dataInput.fEmail);
                
            }
            else {
                DialogBox.showFail(null, SGLocalize.translate('SignUpScreen.alert2SignUpFailTitle'), SGLocalize.translate("SignUpScreen.alert2SignUpFailText"), SGLocalize.translate('globalText.ok'))
            }
        }
        if (this._activeTab === 1) {
            if (dataInput.fPhoneNumber !== '') {
                dataInput.fPhoneNumber = VisitorHelper.checkPhoneNumberCountryCode(this.countryPhoneCode,VisitorHelper._getPhoneNumber(dataInput.fPhoneNumber));
                this.baseRunSingleAPIWithRedoOption('isEmailOrPhoneAvailable', (async (v) => { return tbVUserAPI.isEmailOrPhoneAvailable(v) }).bind(this, dataInput.fPhoneNumber), ((v) => {
                console.log(dataInput);
                var isAvailable =v// await tbVUserAPI.isEmailOrPhoneAvailable(dataInput.fPhoneNumber);
                if (isAvailable.canBeUsed == false) {
                    SGHelperNavigation.navigatePush(this.props.navigation, 'VerifyOTPForgotPassword', { data: this.userData, selectedTab: this._activeTab });
                }
                else {
                    DialogBox.showFail(null, SGLocalize.translate('ForgotPasswordSecurity1Screen.alertUnregisteredTitle'), SGLocalize.translate('ForgotPasswordSecurity1Screen.alertUnregisteredText'), SGLocalize.translate('globalText.ok'));
                }
                }).bind(this),  null,  SGHelperGlobalVar.getVar("ResponTimes"));
            }
            else {

                DialogBox.showFail(null, SGLocalize.translate('ForgotPasswordSecurity1Screen.alertMustFillTitle'), SGLocalize.translate('ForgotPasswordSecurity1Screen.alertMustFillText'), SGLocalize.translate('globalText.ok'));
            }
        }
       
    }

    render() {
        var { w, h, p } = this.WHP;
        var style = this.style;

        return (
            <SGRootScrollView accessible={true} accessibilityLabel={'ForgotPasswordSecurity1ScreenRootScrollView'} style={style.mainView1} contentContainerStyle={style.sv1_2}>
                <View style={style.headerView}>
                    <BackButton color={'black'} hidden={!SGHelperNavigation.canGoBack(this.props.navigation)} imageSetting={this.imageSetting} navigator={this.props.navigation}></BackButton>
                    <Image source={{ uri: image.spotgueLogoOnly[this.imageSetting].url }} style={style.logo}></Image>
                </View>
                <Text preset={Text.preset.titleH1B} style={style.welcomeText}>{SGLocalize.translate("ForgotPasswordSecurity1Screen.headerTitle")}</Text>
                <Text preset={Text.preset.titleH3} style={style.welcomeBodyText}>{SGLocalize.translate("ForgotPasswordSecurity1Screen.text1")}</Text>
                <View style={style.tabViewContainer}>
                    <TabView accessible={true} accessibilityLabel={'ForgotPasswordSecurity1ScreenTabView'} tabBarStyle={style.tabBarStyle} tabBarTextStyle={style.tabBarTextStyle} tabBarUnderlineStyle={{ backgroundColor: '#181818', height: 0.5 * p }} tabBarActiveTextPreset={Text.preset.titleH3B} tabBarInactiveTextPreset={Text.preset.titleH3} style={style.tabViewStyle} initialPage={0} onChangeTab={this._onChangeTab.bind(this)} renderTabBar={() => <DefaultTabBar />}  >
                        <View tabLabel={'Email'}>
                            <SignUpFormWithEmail accessible={true} accessibilityLabel={'ForgotPasswordSecurity1ScreenForm'} language={this.Language} placeholder={SGLocalize.translate("SignUpScreen.input1")} userData={this.userData} style={style.throwWHP}></SignUpFormWithEmail>
                        </View>
                        <View tabLabel={'Phone Number'}>
                            <SignUpFormWithPhoneNumber accessible={true} accessibilityLabel={'ForgotPasswordSecurity1ScreenForm'} language={this.Language} placeholder={SGLocalize.translate("SignUpScreen.input1")} userData={this.userData} onChangeCountryPhoneCode = {this._setCountryPhoneCode.bind(this)} style={style.throwWHP}></SignUpFormWithPhoneNumber>
                        </View>
                    </TabView>
                </View>
                <View accessible={true} accessibilityLabel={'ForgotPasswordSecurity1ScreenContainerView'} style={style.containerView1}>
                    <Button accessible={true} accessibilityLabel={'ForgotPasswordSecurity1ScreenForgotPassButtonNext'} textPreset={Text.preset.titleH3B} shadow style={style.button1} label={SGLocalize.translate("ForgotPasswordSecurity1Screen.buttonNext")} onPress={this._onNextPress.bind(this)}></Button>
                </View>
            </SGRootScrollView>
        );
    }
}
