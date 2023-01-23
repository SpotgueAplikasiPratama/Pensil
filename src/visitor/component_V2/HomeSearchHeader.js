import React from 'react';
import { StyleSheet,Platform, Linking } from 'react-native';
import { SGBaseContainer } from '../../core/container/SGBaseContainer';
import { SGView as View, SGTextInput as TextInput, SGTouchableOpacity as TouchableOpacity, SGIcon as Icon, SGImage as Image, SGText as Text, SGPopView as PopView, SGDialogBox,SGQRScannerIcon, SGIcon } from '../../core/control';
import image from '../asset/image';
import { SGHelperNavigation, SGHelperGlobalVar, SGHelperWindow ,SGHelperType} from '../../core/helper';
import { PleaseRegisterPopup } from '../container_V2/PleaseRegisterPopup';
import { SGLocalize } from '../locales/SGLocalize';
import { SearchPopUp } from './SearchPopUp';

export class HomeSearchHeader extends SGBaseContainer {
    createStyleSheet = (whp) => {
        var { w, h, p } = whp;
        return StyleSheet.create({
            throwWHP: { width: w, height: h, padding: p },
            mainContainer: { width: w, height: SGHelperWindow.getHeaderHeight(), backgroundColor: '#171717', flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth: w * 0.0015, borderColor: '#C5C4BC', paddingHorizontal: p * 1.5, borderBottomLeftRadius: w * 0.035, borderBottomRightRadius: w * 0.035 },
            icon: { backgroundColor: 'transparent', width: w * 0.095, height: w * 0.095, resizeMode: 'contain' },
            icon2:{color: 'white'},
            leftSection: { flexDirection: 'row' },
            rightSection: { flexDirection: 'row' },
            fV1: { position: 'absolute', left: 5 * p, top: p, backgroundColor: 'red', borderRadius: w, width: 6 * p, height: 6 * p, zIndex: 1 },
            fV2: { position: 'absolute', left: 6 * p, top: p, backgroundColor: 'red', borderRadius: w, width: 6 * p, height: 6 * p, zIndex: 1 },
        });
    }

    constructor(props, context, ...args) {
        super(props, context, ...args);
        this.whp = { w: props.style.width, h: props.style.height, p: props.style.padding }
        this.style = this.createStyleSheet(this.whp);
        this.anonymousMode = SGHelperGlobalVar.getVar('GlobalAnonymous');
        this.imageSetting = SGHelperGlobalVar.getVar('GlobalImageSetting');
        this.pvID1 = PopView.getPopViewID();
        this.clickQR = false;
    }

    onProfilePress() {
        if (this.anonymousMode) {
            SGDialogBox.showAction(null, SGLocalize.translate("AnonymousAlert.title"), SGLocalize.translate("AnonymousAlert.message"), SGLocalize.translate("AnonymousAlert.signUpButton"), () => { SGHelperNavigation.navigatePush(this.props.navigator, 'SignUp') }, SGLocalize.translate("AnonymousAlert.signInButton"), () => { SGHelperNavigation.navigatePush(this.props.navigator, 'SignIn') }, true)
        }
        else {
            SGHelperNavigation.navigatePush(this.props.navigator, 'ProfileScreen')
        }
    }

    onInboxPress() {
        if (this.anonymousMode) {
            SGDialogBox.showAction(null, SGLocalize.translate("AnonymousAlert.title"), SGLocalize.translate("AnonymousAlert.message"), SGLocalize.translate("AnonymousAlert.signUpButton"), () => { SGHelperNavigation.navigatePush(this.props.navigator, 'SignUp') }, SGLocalize.translate("AnonymousAlert.signInButton"), () => { SGHelperNavigation.navigatePush(this.props.navigator, 'SignIn') }, true)
        }
        else {
            var circuitBreaker = SGHelperType.getCircuitBreakerStatus('CircuitBreakerInbox')
            var language=SGHelperGlobalVar.getVar('GlobalLanguage').toUpperCase()

            if(circuitBreaker.fActive==="Y"){
                SGHelperNavigation.navigatePush(this.props.navigator, 'InboxList')
            }   
            else{
                SGDialogBox.showWarning(null,circuitBreaker["Title"+language],circuitBreaker[language],circuitBreaker["Button"+language],()=>{},true)
            }
           
        }
    }

    onSearchPress() {
        SGHelperNavigation.navigatePush(this.props.navigator, 'SearchStart')
    }

    onNotificationPress() {
        if (this.anonymousMode) {
            SGDialogBox.showAction(null, SGLocalize.translate("AnonymousAlert.title"), SGLocalize.translate("AnonymousAlert.message"), SGLocalize.translate("AnonymousAlert.signUpButton"), () => { SGHelperNavigation.navigatePush(this.props.navigator, 'SignUp') }, SGLocalize.translate("AnonymousAlert.signInButton"), () => { SGHelperNavigation.navigatePush(this.props.navigator, 'SignIn') }, true)
        }
        else {
            var circuitBreaker = SGHelperType.getCircuitBreakerStatus('CircuitBreakerNotification')
            var language=SGHelperGlobalVar.getVar('GlobalLanguage').toUpperCase()

            if(circuitBreaker.fActive==="Y"){
                SGHelperNavigation.navigatePush(this.props.navigator, 'Notification')
            }   
            else{
                SGDialogBox.showWarning(null,circuitBreaker["Title"+language],circuitBreaker[language],circuitBreaker["Button"+language],()=>{},true)
            }
        }
    }

    render() {
        var { w, h, p } = this.whp;
        var style = this.style;
        var data = this.props.searchHistory;
        var notif = SGHelperType.isDefined(SGHelperGlobalVar.getVar("Notification")) ? SGHelperGlobalVar.getVar("Notification") : "0"
        var inbox = SGHelperType.isDefined(SGHelperGlobalVar.getVar("Inbox")) ? SGHelperGlobalVar.getVar("Inbox") : "0"
        
        return (
            <View accessible={true} accessibilityLabel={'HomeSearchHeaderRootView'} style={style.mainContainer}>
                <View accessible={true} style={style.leftSection}>
                    <TouchableOpacity onPress={this.onProfilePress.bind(this)}>
                        <Image accessible={true} accessibilityLabel={'HomeSearchHeaderIconProfile'} source={{ uri: image.profileIcon[this.imageSetting].url }} style={style.icon}></Image>
                    </TouchableOpacity>
                </View>
                <View accessible={true} style={style.rightSection}>
                    {/* <TouchableOpacity onPress={() => PopView.showPopView(this.pvID1)}>
                        <Image accessible={true} accessibilityLabel={''} source={{ uri: image.closeButton.med.url }} style={style.icon}></Image>
                    </TouchableOpacity> */}
                    <TouchableOpacity onPress={() => this.props.navigator.navigate('SearchStart')}>
                        <Image accessible={true} accessibilityLabel={''} source={{ uri: image.searchIcon[this.imageSetting].url }} style={style.icon}></Image>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={this.onInboxPress.bind(this)}>
                        {inbox !== "0"  && inbox !== '' && 
                        <View style={style.fV2}>
                            <Text preset={Text.preset.titleH4_5B} style={{color:"white"}}>{inbox}</Text>
                        </View>
                        }
                        <Image accessible={true} accessibilityLabel={'HomeSearchHeaderIconInbox'} source={{ uri: image.inboxIcon[this.imageSetting].url }} style={style.icon}></Image>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={this.onNotificationPress.bind(this)}>
                        {notif !== "0"  && inbox !== ''&& 
                        <View style={style.fV1}>
                            <Text preset={Text.preset.titleH4_5B} style={{color:"white"}}>{notif}</Text>
                        </View>
                        }
                        <Image accessible={true} accessibilityLabel={'HomeSearchHeaderNotifIconImage'} source={{ uri: image.notificationIcon[this.imageSetting].url }} style={style.icon}></Image>
                    </TouchableOpacity>
                    {this.anonymousMode !== true &&
                     <View style={{backgroundColor: 'transparent', width: w * 0.095, height: w * 0.095}}>
                        <SGQRScannerIcon iconPreset={SGIcon.preset.w16} onScanSuccess={(v) => { this._checkDeepLinkingHandlerShareMessage(v) }}  ></SGQRScannerIcon>
                    </View>
                    }
                </View>
                <PopView accessible={true} shadow animationType={'slide'} popViewID={this.pvID1} vPos='bottom' hPos='right'>
                    <SearchPopUp navigator={this.props.navigator} searchHistory={data} style={style.throwWHP}></SearchPopUp>
                </PopView>
            </View>
        );
    }
}
