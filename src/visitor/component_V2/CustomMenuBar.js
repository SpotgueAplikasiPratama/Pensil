import React from 'react';
import {StyleSheet,Platform} from 'react-native';
import {SGBaseContainer} from '../../core/container/SGBaseContainer';
import {SGView as View, SGTextInput as TextInput, SGTouchableOpacity as TouchableOpacity, SGIcon as Icon, SGImage as Image, SGText as Text, SGPopView, SGQRScannerIcon, SGIcon} from '../../core/control';
import image from '../asset/image';
import {SGHelperNavigation, SGHelperGlobalVar, SGHelperWindow} from '../../core/helper';
import {PleaseRegisterPopup} from '../container_V2/PleaseRegisterPopup';

export class CustomMenuBar extends SGBaseContainer{
    createStyleSheet = (whp) => {
        var {w, h, p} = this._screenWHP;
        if(this.props.style){
            if(this.props.style.width) w = this.props.style.width;
            if(this.props.style.height) h = this.props.style.height;
            if(this.props.style.padding) p = this.props.style.padding;
        }
        return StyleSheet.create({
            mainContainer: {width: w, height: SGHelperWindow.getHeaderHeight(), backgroundColor: '#191919', flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: p * 3, borderBottomLeftRadius: p * 3, borderBottomRightRadius: p * 3},
            leftContainer: {flexDirection: 'row'},
            rightContainer: {flexDirection: 'row'},
            leftBtnProfile: {width: w * 0.1, height: h * 0.1, marginLeft: 0, backgroundColor: 'transparent', resizeMode: 'contain'},
            btnBack: {width: w * 0.072, height: w * 0.072, marginLeft: p * 3.5, backgroundColor: 'transparent', resizeMode: 'contain'},
            btnSearch: {width: w, height: h, backgroundColor: 'transparent', resizeMode: 'contain'},
            btnInbox: {width: w, height: h, backgroundColor: 'transparent', resizeMode: 'contain'},
            btnNotification: {width: w, height: h, backgroundColor: 'transparent', resizeMode: 'contain'},
            btnSetting: {color: '#FFFFFF', marginTop: p},
        });
    }
    
    constructor(props, context, ...args){
        super(props, context, ...args);
        this.style = this.createStyleSheet();
        this.pvID2 = SGPopView.getPopViewID();
        this.leftBtnProfile = false;
        this.btnBack = false;
        this.btnSetting = false;
        this.anonymousMode = SGHelperGlobalVar.getVar('GlobalAnonymous');
    }

    onShowHandler(pvID){
        SGPopView.showPopView(pvID);
    }

    onProfilePressed(){
        console.log('onProfilePressed')
        console.log(this.props.currentUser)
        if(this.props.currentUser){
            SGHelperNavigation.navigatePush(this.props.navigator, 'ProfileScreen');
        }else{
            this.onShowHandler(this.pvID2);
        }
    }

    onBackPressed(){
        SGHelperNavigation.goBack(this.props.navigator);
    }

    render(){
        var style = this.style;
        this.leftBtnProfile = this.props.leftBtnProfile;
        this.btnBack = SGHelperNavigation.canGoBack(this.props.navigator);
        this.btnSetting = this.props.btnSetting;
        this.btnQR = this.props.btnQR
        return(
            <View accessible={true} style={style.mainContainer}>
                <View accessible={true} style={style.leftContainer}>
                    {
                        this.leftBtnProfile ?
                            (<TouchableOpacity onPress={this.onBackPressed.bind(this)}>
                                <Image style={style.leftBtnProfile} source={{uri: image.profileIcon[this.props.imageSetting].url}}></Image>
                            </TouchableOpacity>)
                        :
                            (null)
                    }
                    {
                        this.btnBack ?
                            (<TouchableOpacity onPress={this.onBackPressed.bind(this)}>
                                <Image style={style.btnBack} source={{uri: image.backLineWhiteIcon[this.props.imageSetting].url}}></Image>
                            </TouchableOpacity>)
                        :
                            (null)
                    }
                </View>
                <View accessible={true} style={style.rightContainer}>
                    {this.btnSetting ?
                        (<TouchableOpacity onPress={this.props.onSettingPress}>
                            <Icon accessible={true} accessibilityLabel={'ProfileHeaderContainerSettingIcon'} preset={Icon.preset.w15} style={style.btnSetting} name={Icon.Icon.setting}></Icon>
                        </TouchableOpacity>)
                    :
                        (null)
                    }
                    {this.anonymousMode !== true &&
                        <SGQRScannerIcon iconPreset={SGIcon.preset.w16} onScanSuccess={(v) => { this._checkDeepLinkingHandlerShareMessage(v) }}></SGQRScannerIcon>
                    }   
                </View>
            </View>
        );
    }
}