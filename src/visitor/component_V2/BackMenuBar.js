import React from 'react';
import { StyleSheet,Platform } from 'react-native';
import { SGBaseContainer } from '../../core/container/SGBaseContainer';
import { SGView as View, SGTextInput as TextInput, SGTouchableOpacity as TouchableOpacity, SGIcon, SGImage as Image, SGText as Text, SGPopView,SGQRScannerIcon } from '../../core/control';
import image from '../asset/image';
import { SGHelperNavigation, SGHelperGlobalVar, SGHelperWindow,SGHelperType } from '../../core/helper';
import { BackButton } from '../component_V2/BackButton';

export class BackMenuBar extends SGBaseContainer {
    createStyleSheet = (whp) => {
        var { w, h, p } = whp;
        return StyleSheet.create({
            throwWHP: {width: w, height: h, padding: p},
            mainContainer:{width: w, height: SGHelperWindow.getHeaderHeight(), backgroundColor: '#191919', flexDirection: 'row', justifyContent: 'space-between', paddingLeft: p * 5, paddingRight: p * 2, borderBottomLeftRadius: w * 0.035, borderBottomRightRadius: w * 0.035},
            leftSection: {flexDirection: 'row'},
            iconBack: {width: w * 0.072, height: w * 0.072,backgroundColor: 'transparent', resizeMode: 'contain'},
            rightSection: {flexDirection: 'row'},
            icon: {backgroundColor: 'transparent', width: w * 0.097, height: w * 0.097, resizeMode: 'contain'},
        });
    }

    constructor(props, context, ...args) {
        super(props, context, ...args);
        this.whp = { w: props.style.width, h: props.style.height, p: props.style.padding }
        this.style = this.createStyleSheet(this.whp);
        this.pvID2 = SGPopView.getPopViewID();
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


    render() {
        var { w, h, p } = this.whp;
        var style = this.style;

        return (
            <View accessible={true} accessibilityLabel={'HomeSearchHeaderRootView'} style={style.mainContainer}>
                <View accessible={true} style={style.leftSection}>
                    <BackButton hidden={!SGHelperNavigation.canGoBack(this.props.navigator)} imageSetting={this.props.imageSetting} navigator={this.props.navigator} style={style.iconBack}></BackButton>
                </View>
                {this.anonymousMode !== true &&
                    <SGQRScannerIcon iconPreset={SGIcon.preset.w16} onScanSuccess={(v) => { this._checkDeepLinkingHandlerShareMessage(v) }}></SGQRScannerIcon>
                }   
            </View>
        );
    }
}
