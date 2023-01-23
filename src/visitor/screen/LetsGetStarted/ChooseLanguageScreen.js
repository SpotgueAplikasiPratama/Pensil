import React from "react";
import { StatusBar, StyleSheet,Linking } from "react-native";
import { SGBaseScreen } from "../../../core/screen/SGBaseScreen";
import { SGTouchableOpacity as TouchableOpacity, SGRootView as RootView, SGButton as Button, SGText as Text, SGView as View, SGScrollView as ScrollView, SGImage as Image ,SGDialogBox, SGRootScrollView,SGPopView as SGPopView} from "../../../core/control";
import { SGHelperNavigation, SGHelperGlobalVar ,SGHelperType} from '../../../core/helper';
import { SGLocalize } from '../../locales/SGLocalize';
import { tbLookupDAO } from '../../db/tbLookupDAO';
import image from '../../asset/image';
import { getTrackingStatus } from 'react-native-tracking-transparency';
import { requestTrackingPermission } from 'react-native-tracking-transparency';
import RNExitApp from 'react-native-exit-app';
import MyTranslator from "../../../plugin/lessons/locale/MyTranslator";
export class ChooseLanguageScreen extends SGBaseScreen {

    createStyleSheet() {
        var { w, h, p } = this._screenWHPNoHeader;
        var headerHeight = this._screenWHPNoHeader.h - this._screenWHP.h;
        return StyleSheet.create({
            mainView1: { width: w, height: h, backgroundColor: 'red', },
            sv1_2: { width: w, height: h, justifyContent: 'flex-start', backgroundColor: 'white' },
            topOrnament: { backgroundColor: 'white', borderRadius: 0, width: w, height: w * 0.4, resizeMode: 'cover', padding: 0, marginTop: 0, },
            text1: { color: '#ffffff', marginTop: 6 * p },
            text2: { color: '#7a7a7a', marginTop: 12 * p },
            text3: { color: '#606060' },
            containerView1: { marginTop: 3 * p, padding: p, alignItems: 'center', justifyContent: 'center' },
            containerView1_2: { padding: p, alignItems: 'flex-start', justifyContent: 'space-between', flexDirection: 'row' },
            textView1: { alignSelf: 'center', width: (w - 2 * p) / 3, height: w * 0.2, padding: p, alignItems: 'flex-start' },
            image1: { backgroundColor: 'white', width: w * 0.2, height: w * 0.2, resizeMode: 'contain' },
            button1: { marginTop: 7 * p, backgroundColor: '#465056', width: w * 0.425, height: w * 0.125, justifyContent: "center", alignSelf: "center", alignItems: "center", borderRadius: p * 10, shadowOpacity: 0.15, shadowRadius: 0.5 * p },
            mainContainer: { width: w, height: h, backgroundColor: '#FFFFFF' },
            scrollViewMaincontainer: { width: w, height: h, justifyContent: 'center', alignItems: 'center' },
            logo: { width: w * 0.15, height: w * 0.15, backgroundColor: 'transparent', resizeMode: 'contain', position: 'absolute', top: w * 0.2, right: w * 0.1 },
            titleText: { color: '#000000',marginTop:5*p },
            selectLanguageText: { color: '#939393' },
            btnNext: { width: w * 0.6, height: w * 0.14, backgroundColor: '#535353', color: '#FFFFFF', borderRadius: p * 4.5, justifyContent: 'center', alignItems: 'center' },
        });
    };

    constructor(props, context, ...args) {
        super(props, context, ...args);
        this.style = this.createStyleSheet(this.WHPNoHeader);
        this.props.navigation.setOptions({
            headerShown: false,
        });
        this.sortArr = ['id', 'en', 'cn'];
        SGLocalize.initLanguage(this.Language);
        this.state = { selectedIndex: (this.Language).toUpperCase() };
        SGLocalize.changeLanguage(this.Language);
        MyTranslator.changeLanguage(this._language);
        this.imageSetting = SGHelperGlobalVar.getVar('GlobalImageSetting');
    }


    _generateLanguageCode(str) {
        var res = str.toLowerCase();
        return res;
    }

    _sortDataLookUp(arr, order) {
        var newArr = [];
        for (var i = 0; i < order.length; i++) {
            for (var j = 0; j < arr.length; j++) {
                if (arr[j].fLookUpKey === order[i]) {
                    newArr.push(arr[j]);
                }
            }
        }
        return newArr;
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
    
    
    async _onContinuePress(trackingStatus,TrackingTransparencyMode){ 
        
        if(TrackingTransparencyMode==="A"){
            if(trackingStatus === 'not-determined' ){

                var tR = SGLocalize.translate
            
                var requestTrackingStatus =  await requestTrackingPermission();

                if (requestTrackingStatus === 'authorized') {
                    SGHelperGlobalVar.setVar("HideNegativeButton","N")
                    SGHelperNavigation.navigateReset(this.props.navigation, 'LetsGetStarted')
                }else if(requestTrackingStatus==="denied"){
                    var tR = SGLocalize.translate
                    SGDialogBox.showFail(null,tR("AlertMessage.Fail"),tR("TrackingTransparency.denied"), tR("AlertMessage.OK"),() => { }, true)
                }
            }else if(trackingStatus === 'denied'){
                var tR = SGLocalize.translate
                SGDialogBox.showFail(null,tR("AlertMessage.Fail"),tR("TrackingTransparency.denied"), tR("AlertMessage.OK"),() => { }, true)
            } 
        }else if(TrackingTransparencyMode==="B"){
            if(trackingStatus === 'not-determined' ){
                var requestTrackingStatus =  await requestTrackingPermission();
                SGHelperGlobalVar.setVar("HideNegativeButton","N")
                if (trackingStatus) {
                    SGHelperNavigation.navigateReset(this.props.navigation, 'LetsGetStarted')
                }else{
                    SGHelperNavigation.navigateReset(this.props.navigation, 'LetsGetStarted')
                }
            }else {
                var tR = SGLocalize.translate
                SGDialogBox.showFail(null,tR("AlertMessage.Fail"),tR("TrackingTransparency.denied"), tR("AlertMessage.OK"),() => { }, true)
            } 
        }
    }

    handleLink(url) {
        Linking.canOpenURL(url
        ).then(supported => {
            if (supported) {
                Linking.openURL(url);
            } else {
                SGDialogBox.showWebView(url,()=>{});
                //GERRY HASANG please handle this error!
                // SGDialogBox.showWarning(null,SGLocalize.translate("AlertMessage.Whoops"),SGLocalize.translate("AlertMessage.AlertHandleLink"),SGLocalize.translate("AlertMessage.OK"),()=>{},true,{label: url,url:url})
                // console.log("Don't know how to open URI: " + url);
            }
        });
    };

    _onShowPopup(){
        SGPopView.showPopView(this.pvID1);
    }

    async _onButtonPress(){
        var title = SGHelperType.getSystemParamsValue('TitleTracking'+this.Language.toUpperCase())
        var opening = SGHelperType.getSystemParamsValue('OpeningTracking'+this.Language.toUpperCase())
        var linkText = SGHelperType.getSystemParamsValue('LinkTracking'+this.Language.toUpperCase())
        var urlLink = SGHelperType.getSystemParamsValue('UrlTracking'+this.Language.toUpperCase())
        var closing = SGHelperType.getSystemParamsValue('ClosingTracking'+this.Language.toUpperCase())
        var TrackingTransparencyMode = SGHelperType.getSystemParamsValue('TrackingTransparencyMode') 
        var trackingStatus = await getTrackingStatus();
        SGHelperGlobalVar.addVar("HideNegativeButton",SGHelperType.getSystemParamsValue("HideNegativeButton"))
        if(TrackingTransparencyMode==="A"){
           
            if(trackingStatus ==='not-determined' || trackingStatus === 'denied'){
                var tR = SGLocalize.translate
                console.log('aw')
                SGDialogBox.showConfirmation(null,
                    title,
                    opening + '\n' + closing + '\n' + linkText,
                    tR('TrackingTransparency.Exit'), () => { RNExitApp.exitApp();},
                    tR('TrackingTransparency.Continue'), () => {this._onContinuePress(trackingStatus,TrackingTransparencyMode) }, true, {label: tR("TrackingTransparency.PrivacyPolicy"),url:urlLink})
            }else if(trackingStatus === 'authorized' || trackingStatus === 'unavailable' || trackingStatus ==="restricted"){
                SGHelperGlobalVar.setVar("HideNegativeButton","N")
                SGHelperNavigation.navigateReset(this.props.navigation, 'LetsGetStarted')
            }
        }else if(TrackingTransparencyMode==="B"){
            if(trackingStatus ==='not-determined' ){
                var tR = SGLocalize.translate
                SGDialogBox.showConfirmation(null,
                    title,
                    opening + '\n' + closing + '\n' + linkText,
                    tR('TrackingTransparency.Exit'), () => { RNExitApp.exitApp();},
                    tR('TrackingTransparency.Continue'), () => {this._onContinuePress(trackingStatus,TrackingTransparencyMode) }, true, {label:tR("TrackingTransparency.PrivacyPolicy"),url:urlLink})
            }else if(trackingStatus === 'authorized' || trackingStatus === 'unavailable' || trackingStatus ==="restricted" || trackingStatus === 'denied'){
                SGHelperGlobalVar.setVar("HideNegativeButton","N")
                SGHelperNavigation.navigateReset(this.props.navigation, 'LetsGetStarted')
            }
        }else if(TrackingTransparencyMode==="C") {
            SGHelperGlobalVar.setVar("HideNegativeButton","N")
            SGHelperNavigation.navigateReset(this.props.navigation, 'LetsGetStarted')
        }

        
    }
    render() {
        var { w, h, p } = this.WHPNoHeader;
        var style = this.style;
        var data = this._sortDataLookUp(tbLookupDAO.getSpecificLookupByGroup('Language'), this.sortArr);
        return (
            <SGRootScrollView accessible={true} accessibilityLabel={'ChooseLanguageScreenScrollView'} style={style.mainContainer} contentContainerStyle={style.scrollViewMaincontainer}>
                
                <Image accessible={true} style={style.logo} source={{ uri: image['spotgueLogoOnly'][this.imageSetting].url }}></Image>
                <Text accessible={true} accessibilityLabel={'ChooseLanguageScreenTitleOrnament'} preset={Text.preset.titleH1B} style={style.titleText}>{SGLocalize.translate("letsGetStartedScreen.title")}</Text>
                <Text accessible={true} accessibilityLabel={'ChooseLanguageScreenSubText2'} preset={Text.preset.titleH3B} style={style.selectLanguageText}>{SGLocalize.translate("letsGetStartedScreen.subtitle")}</Text>
                <View accessible={true} accessibilityLabel={'ChooseLanguageScreenContainerView'} style={style.containerView1}>
                    {
                        data.map((x) => {
                            return (
                                <TouchableOpacity key={x.fValueKey} onPress={() => { this.setState({ selectedIndex: x.fValueKey }); SGLocalize.changeLanguage(this._generateLanguageCode(x.fValueKey)); this._language=this._generateLanguageCode(x.fValueKey); this.forceUpdate();}}>
                                    <View accessible={true} accessibilityLabel={'ChooseLanguageScreenSelectedContainerView'} style={[style.containerView1_2, this.state.selectedIndex === x.fValueKey ? { borderColor: 'red', borderRadius: 2 * p, borderWidth: p / 2 } : {}]}>
                                        <Image accessible={true} accessibilityLabel={'ChooseLanguageScreenSelectedImage'} style={style.image1} source={{ uri: image[x.fValueKey][this.imageSetting].url }}></Image>
                                        <View accessible={true} accessibilityLabel={'ChooseLanguageScreenSelectedView_2'} style={style.textView1}><Text preset={Text.preset.titleH2B} style={style.text3}>{x.fLanguage[this._language.toLowerCase()]}</Text></View>
                                    </View>
                                </TouchableOpacity>
                            )
                        })
                    }
                </View>
                <Button textPreset={Text.preset.titleH2B} style={style.btnNext} label={SGLocalize.translate("letsGetStartedScreen.buttonText")} onPress={() => this._onButtonPress()}></Button>
            </SGRootScrollView>


        );
    }
}
