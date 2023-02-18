import React from "react";
import { StyleSheet, Dimensions } from "react-native";
import { SGBaseScreen } from "../../../core/screen/SGBaseScreen";
import { SGView as View, SGRootView as RootView, SGText as Text, SGButton as Button, SGViewPager as ViewPager, SGScrollView as ScrollView, SGImage as Image, SGTouchableOpacity as TouchableOpacity } from "../../../core/control";
import { SGHelperNavigation, SGHelperGlobalVar, SGHelperType } from '../../../core/helper';
import { SGLocalize } from '../../locales/SGLocalize';
import image from '../../asset/image';
import DeviceInfo from 'react-native-device-info';

export class LetsGetStartedScreen extends SGBaseScreen {
    createStyleSheet = (whp) => {
        var { w, h, p } = whp;
        var { img1W, img1H } = { img1W: 100, img1H: 200 };
        var img1Scale = Math.min(w / img1W, h / img1H) * 0.7;
        return StyleSheet.create({
        
            mainContainer: { width: w, height: h, backgroundColor: '#191919' },
            viewPager: { width: w, height: h, margin: 0, padding: 0, flexDirection: 'column', justifyContent: 'center', alignItems: 'center' },
            imageBackground: { width: w, height: h, borderRadius: 0 },
            textContainer: { width: w * 0.9, position: 'absolute', bottom: w * 0.59, flexDirection: 'column', justifyContent: 'center', alignItems: 'center', alignContent: 'center', backgroundColor: '#000000', opacity: 0.7,borderRadius:3*p,paddingTop:2*p,paddingBottom:4*p },
            heading: { color: '#FFFFFF', marginBottom: p * 2 },
            description: { color: '#FFFFFF', textAlign: 'center' },
            navContainer: { width: w * 0.9, flexDirection: 'column', justifyContent: 'flex-start', position: 'absolute', bottom: w * 0.07 },
            btnContainer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
            btnSkip: { width: w * 0.35, backgroundColor: '#454545', color: '#FFFFFF', height: w * 0.12, justifyContent: 'center', alignSelf: 'center', alignItems: 'center', borderRadius: p * 6, opacity: 0.8, marginRight: p * 2 },
            btnSignIn: { width: w * 0.35, backgroundColor: '#AAAAAA', color: '#FFFFFF', height: w * 0.12, justifyContent: 'center', alignSelf: 'center', alignItems: 'center', borderRadius: p * 6, opacity: 0.85 },
            signUpText: { color: '#FFFFFF', textDecorationLine: 'underline', marginTop: p * 5.5 }
        });
    };

    _onSkipPress() {
        var userLoginInput = {
            fDeviceID: DeviceInfo.getUniqueId(),
            fDeviceModel: DeviceInfo.getModel(),
            fDeviceBrand: DeviceInfo.getBrand(),
            fDeviceOS: DeviceInfo.getSystemName(),
            fDeviceOSVersion: DeviceInfo.getSystemVersion(),
            fDeviceHeight: (Dimensions.get('screen').width),
            fDeviceWidth: (Dimensions.get('screen').width),
            fLoginLocation: ""
        }
        var anonymousUserData = { fID: 'anonymous', fImageProfileJSON: [{ id: '993581f2-d951-45dc-ae6e-5041b7a16ff7', text: "", textPosition: "topLeft", low: { uri: image.magLogoOnly.low.url, width: 480, height: 480 }, med: { uri: image.magLogoOnly.med.url, width: 720, height: 720 }, high: { uri: image.magLogoOnly.high.url, width: 1080, height: 1080 }, thumbnailLow: { uri: image.magLogoOnly.low.url, width: 480, height: 480 }, thumbnailMed: { uri: image.magLogoOnly.med.url, width: 720, height: 720 }, thumbnailHigh: { uri: image.magLogoOnly.high.url, width: 1080, height: 1080 } }], fEmail: '', fPhoneNumber: '', fPassword: '', fSecurityQuestionKey: '', fQuestionAnswer: '', fName: '', fGender: '', fDOB: new Date(0), fLocation: '', fFamily: '', fFoodPreference: '', fLanguage: '', fCurrency: 'IDR', fCar: [], fImageSetting: 'med', fTrackingActive: 'N', fNotificationActive: 'N', fShortDescription: '', fReminderReservation: '', fTimeZoneSetting: new Date(0), fCountry: '', fProvince: '', fCity: '', fUrlInstagram: '', fUrlFacebook: '', fUrlTwitter: '', fFacebookID: '', fGoogleID: '', fRegisterMethod: '', fActive: 'Y', fCreatedBy: '', fCreatedDate: new Date(0), fLastModifiedBy: '', fLastModifiedDate: new Date(0) }
        SGHelperGlobalVar.addVar('GlobalCurrentUserData', anonymousUserData);
        SGHelperGlobalVar.addVar('GlobalCurrentUser', 'anonymous');
        SGHelperGlobalVar.addVar('GlobalCurrentUserImage', 'https://spotgue.com/dev/visitor/avatar.png');
        SGHelperGlobalVar.addVar('GlobalImageSetting', anonymousUserData.fImageSetting);
        SGHelperGlobalVar.addVar('GlobalAnonymous', true);
        SGHelperNavigation.navigateReset(this.props.navigation, 'Home',{});
    }

    constructor(props, context, ...args) {
        super(props, context, ...args);
        this.style = this.createStyleSheet(this.WHPNoHeader);
        this.props.navigation.setOptions({
            headerShown: false,
        });
        this.imageSetting = SGHelperGlobalVar.getVar('GlobalImageSetting');
    }

    render() {
        var { w, h, p } = this.WHPNoHeader;
        var style = this.style;
        var language = SGHelperGlobalVar.getVar('GlobalLanguage');
        console.log(SGHelperGlobalVar.getVar('GlobalLanguage'));
        return (
            <RootView accessible={true} accessibilityLabel={'HomeScreenRootView'} style={style.mainContainer}>
                <ScrollView accessible={true} accessibilityLabel={'LetsGetStartedScreenRootScrollView'} style={style.mainContainer} contentContainerStyle={style.mainContainer}>
                    <ViewPager accessible={true} accessibilityLabel={'LetsGetStartedScreenViewPager'} style={style.viewPager} initialPage={0} showPageIndicator={true} transitionStyle={'scroll'} pageIndicatorStyle={{ position: 'absolute', bottom: w * 0.48, flexDirection: 'row', alignSelf: 'center' }}>
                        <View accessible={true} accessibilityLabel={'LetsGetStartedScreenViewPagerKey1'} style={style.viewPager} key="1">
                            <Image accessible={true} accessibilityLabel={'LetsGetStartedScreenImageKey1'} style={style.imageBackground} source={{ uri: SGHelperType.getSystemParamsValue('LGSWhereToParkFemale' + this.imageSetting) }}></Image>
                            <View accessible={true} style={style.textContainer}>
                                <Text preset={Text.preset.titleH1B} style={style.heading}>{SGLocalize.translate("letsGetStartedScreen.imagineText")}</Text>
                                <Text preset={Text.preset.titleH2} style={style.description}>{SGHelperType.getSystemParamsValue('contentText1' + language.toUpperCase())}</Text>
                            </View>
                        </View>
                        <View accessible={true} accessibilityLabel={'LetsGetStartedScreenViewPagerKey2'} style={style.viewPager} key="2">
                            <Image accessible={true} accessibilityLabel={'LetsGetStartedScreenImageKey2'} style={style.imageBackground} source={{ uri: SGHelperType.getSystemParamsValue('LGSWhatToGiftFemale' + this.imageSetting)}}></Image>
                            <View accessible={true} style={style.textContainer}>
                                <Text preset={Text.preset.titleH1B} style={style.heading}>{SGLocalize.translate("letsGetStartedScreen.imagineText")}</Text>
                                <Text preset={Text.preset.titleH2} style={style.description}>{SGHelperType.getSystemParamsValue('contentText2' + language.toUpperCase())}</Text>
                            </View>
                        </View>
                        <View accessible={true} accessibilityLabel={'LetsGetStartedScreenViewPagerKey3'} style={style.viewPager} key="3">
                            <Image accessible={true} accessibilityLabel={'LetsGetStartedScreenImageKey3'} style={style.imageBackground} source={{ uri: SGHelperType.getSystemParamsValue('LGSWhatToEatFemale' + this.imageSetting)}}></Image>
                            <View accessible={true} style={style.textContainer}>
                                <Text preset={Text.preset.titleH1B} style={style.heading}>{SGLocalize.translate("letsGetStartedScreen.imagineText")}</Text>
                                <Text preset={Text.preset.titleH2} style={style.description}>{SGHelperType.getSystemParamsValue('contentText3' + language.toUpperCase())}</Text>
                            </View>
                        </View>
                    </ViewPager>
                    <View accessible={true} accessibilityLabel={'LetsGetStartedScreenButtonView'} style={style.navContainer}>
                        <View accessible={true} style={style.btnContainer}>
                            <Button accessible={true} accessibilityLabel={'LetsGetStartedScreenButtonSkip'} textPreset={Text.preset.titleH3B} style={style.btnSkip} label={SGLocalize.translate("letsGetStartedScreen.buttonSkip")} onPress={this._onSkipPress.bind(this)}></Button>
                            <Button accessible={true} accessibilityLabel={'LetsGetStartedScreenButtonSignIn'} textPreset={Text.preset.titleH3B} style={style.btnSignIn} label={SGLocalize.translate("letsGetStartedScreen.buttonSignIn")} onPress={() => SGHelperNavigation.navigateReset(this.props.navigation, 'SignIn')} ></Button>
                        </View>
                        <TouchableOpacity onPress={() => SGHelperNavigation.navigateReset(this.props.navigation, 'SignUp')}>
                            <Text accessible={true} accessibilityLabel={'LetsGetStartedScreenText2'} preset={Text.preset.titleH2B} style={style.signUpText}>{SGLocalize.translate("letsGetStartedScreen.text2")}</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </RootView>
        );
    }
}

