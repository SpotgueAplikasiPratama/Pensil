import React from 'react';
import { StyleSheet,Platform } from 'react-native';
import { SGBaseContainer } from '../../core/container/SGBaseContainer';
import { SGView as View, SGTextInput as TextInput, SGTouchableOpacity as TouchableOpacity, SGIcon as Icon, SGImage as Image, SGText as Text, SGPopView, SGQRScannerIcon, SGIcon } from '../../core/control';
import image from '../asset/image';
import { SGHelperNavigation, SGHelperGlobalVar, SGHelperWindow } from '../../core/helper';
import { PleaseRegisterPopup } from '../container_V2/PleaseRegisterPopup';
import { BackButton } from '../component_V2/BackButton';

export class MyMenuBar extends SGBaseContainer {
    createStyleSheet = (whp) => {
        var { w, h, p } = whp;
        return StyleSheet.create({
            throwWHP: {width: w, height: h, padding: p},
            mainContainer:{width: w, height: SGHelperWindow.getHeaderHeight(), backgroundColor: '#191919', flexDirection: 'row', justifyContent: 'space-between', paddingLeft: p * 5, paddingRight: p * 2, borderBottomLeftRadius: w * 0.035, borderBottomRightRadius: w * 0.035},
            leftSection: {flexDirection: 'row'},
            iconBack: {width: w * 0.072, height: w * 0.072, backgroundColor: 'transparent', resizeMode: 'contain'},
            rightSection: {flexDirection: 'row'},
            icon: {backgroundColor: 'transparent', width: w * 0.095, height: w * 0.095, resizeMode: 'contain'},
            
            // searchBar: { backgroundColor: 'white', width: (w - 2 * p) * 0.075 * 7.083, height: (w - 2 * p) * 0.100, resizeMode: 'stretch' },
            // searchView1: { borderWidth: w * 0.0015, width: (w - 2 * p) * 0.6, borderRadius: w * 0.1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 4 * p },
            // searchView2: { width: (w - 2 * p) * 0.3, flexDirection: 'row', justifyContent: 'space-evenly' },
            // iconSearch: { marginLeft: w * 0.015, borderRightWidth: w * 0.01, borderColor: '#696969', color: 'black' },
            // textSearch: { marginLeft: w * 0.03, alignSelf: 'flex-start', color: '#7a7a7a' },
        });
    }

    constructor(props, context, ...args) {
        super(props, context, ...args);
        this.whp = { w: props.style.width, h: props.style.height, p: props.style.padding }
        this.style = this.createStyleSheet(this.whp);
        this.pvID2 = SGPopView.getPopViewID();
        this.imageSetting = SGHelperGlobalVar.getVar('GlobalImageSetting');
        this.anonymousMode = SGHelperGlobalVar.getVar('GlobalAnonymous');
    }

    onShowHandler(pvID) {
        SGPopView.showPopView(pvID);
    }

    onProfilePress() {
        if (this.props.currentUser) {
            SGHelperNavigation.navigatePush(this.props.navigator, 'ProfileScreen')
        }
        else {
            this.onShowHandler(this.pvID2);
        }
    }

    onInboxPress() {
        if (this.props.currentUser) {
            SGHelperNavigation.navigatePush(this.props.navigator, 'InboxList')
        }
        else {
            this.onShowHandler(this.pvID2);
        }
    }

    onSearchPress() {
        SGHelperNavigation.navigatePush(this.props.navigator, 'SearchStart')
    }

    onNotificationPress() {
        if (this.props.currentUser) {
            SGHelperNavigation.navigatePush(this.props.navigator, 'Notification')
        }
        else {
            this.onShowHandler(this.pvID2);
        }
    }

    render() {
        var { w, h, p } = this.whp;
        var style = this.style;

        return (
            <View accessible={true} accessibilityLabel={'HomeSearchHeaderRootView'} style={style.mainContainer}>
                <View accessible={true} style={style.leftSection}>
                    <BackButton hidden={!SGHelperNavigation.canGoBack(this.props.navigator)} imageSetting={this.props.imageSetting} navigator={this.props.navigator} style={style.iconBack}></BackButton>
                </View>
                <View accessible={true} style={style.rightSection}>
                    <SGPopView accessible={true} accessibilityLabel={'HomeSearchHeaderPopView'} vPos={'Top'} modal popViewID={this.pvID2}>
                        <PleaseRegisterPopup accessible={true} accessibilityLabel={'HomeSearchHeaderPleaseRegisterPopUp'} navigator={this.props.navigator} popViewID={this.pvID2} style={style.throwWHP}></PleaseRegisterPopup>
                    </SGPopView>
                    <TouchableOpacity onPress={this.onProfilePress.bind(this)}>
                        <Image accessible={true} accessibilityLabel={'HomeSearchHeaderIconProfile'} source={{ uri: image.profileIcon[this.imageSetting].url }} style={style.icon}></Image>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={this.onInboxPress.bind(this)}>
                        <Image accessible={true} accessibilityLabel={'HomeSearchHeaderIconInbox'} source={{ uri: image.inboxIcon[this.imageSetting].url }} style={style.icon}></Image>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={this.onNotificationPress.bind(this)}>
                        <Image accessible={true} accessibilityLabel={'HomeSearchHeaderNotifIconImage'} source={{ uri: image.notificationIcon[this.imageSetting].url }} style={style.icon}></Image>
                    </TouchableOpacity>
                    {this.anonymousMode !== true &&
                        <View style={{backgroundColor: 'transparent', width: w * 0.095, height: w * 0.095}}>
                            <SGQRScannerIcon iconPreset={SGIcon.preset.w16} onScanSuccess={(v) => { this._checkDeepLinkingHandlerShareMessage(v) }}></SGQRScannerIcon>
                        </View>
                    }
                </View>
            </View>
        );
    }
}
