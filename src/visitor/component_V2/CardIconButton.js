/**
 * Version 1.2.0
 * 1. Yohanes 26 March 2021
 * - add ErrorHandling
 */
import React from "react";
import { StyleSheet, Share,Platform } from "react-native";
import { SGView as View, SGText as Text, SGImage as Image, SGTouchableOpacity as TouchableOpacity, SGPopView, SGDialogBox, SGActivityIndicator,SGIcon as Icon } from "../../core/control";

import { SGBaseContainer } from '../../core/container/SGBaseContainer';
import { SGHelperGlobalVar, SGHelperStyle, SGHelperNavigation, SGHelperErrorHandling, SGHelperType } from '../../core/helper';
import { SGLocalize } from '../locales/SGLocalize';
import image from '../asset/image';
import { CommentPopup } from '../container_V2/CommentPopup';
import { PleaseRegisterPopup } from '../container_V2/PleaseRegisterPopup';
import { tbUserFavoriteData } from '../db/tbUserFavoriteDAO';
import { tbVUserFavoriteAPI } from '../../visitor/api/tbVUserFavoriteAPI';
import { tbVUserLikeAPI } from '../../visitor/api/tbVUserLikeAPI';
import { tbVUserNotificationSettingsAPI } from '../../visitor/api/tbVUserNotificationSettingsAPI';
import { tbUserNotificationSettingsData } from '../db/tbUserNotificationSettingsDAO'
import { tbUserShareData } from '../db/tbUserShareDAO'
import { tbVUserShareAPI } from '../../visitor/api/tbVUserShareAPI';
import { mode } from '../../../app.json';

export class CardIconButtonLike extends SGBaseContainer {
    createStyleSheet() {
        var { w, h, p } = this._screenWHP;
        if (this.props.style) {
            if (this.props.style.width) w = this.props.style.width;
            if (this.props.style.height) h = this.props.style.height;
            if (this.props.style.padding) p = this.props.style.padding;
        }
        return StyleSheet.create({
            throwWHP: { width: this._screenWHP.w, height: this._screenWHP.h, padding: this._screenWHP.p, backgroundColor: 'white' },
            mainView: { padding: 0.075 * p, justifyContent: 'center', alignItems: 'center' },
            icon: { width: w * 0.08, height: w * 0.08, resizeMode: 'contain', backgroundColor: 'transparent', marginRight: p * 2.5 },
            viewLoading: { width: w * 0.09, height: w * 0.08, backgroundColor: 'transparent', marginRight: p * 2.5 },
            loading: { marginLeft: p },
            title: { color: this.props.textColor ? this.props.textColor : '#909090', marginTop: -1 * p }
        });
    }

    constructor(props, context, ...args) {
        super(props, context, ...args);
        this.style = this.createStyleSheet();
        this.imageSetting = SGHelperGlobalVar.getVar('GlobalImageSetting');
        this.state = { loading: false };
        this.pvID1 = SGPopView.getPopViewID();
        this.pvID2 = SGPopView.getPopViewID();
        this.currentUser = SGHelperGlobalVar.getVar('GlobalCurrentUser');
        this.anonymousMode = SGHelperGlobalVar.getVar('GlobalAnonymous');
        this.textMode = this.props.textMode ? (this.props.textMode) : ('on')
    }

    onShowHandler(pvID) {
        SGPopView.showPopView(pvID);
    }

    _updateLikeCache(fActive){
        var likePackage = this.props.likePackage;
        var temp = SGHelperGlobalVar.getVar("UserLikeCache");
        var key = likePackage.fContentType + '_' + likePackage.fTargetKey + '_' + likePackage.fContentKey
        temp[key] = {fActive: fActive};
    }

    _getLikeCache(){
        var likePackage = this.props.likePackage;
        var temp = SGHelperGlobalVar.getVar("UserLikeCache");
        var key = this.props.likePackage.fContentType + '_' + likePackage.fTargetKey + '_' + likePackage.fContentKey
        if(SGHelperType.isDefined(temp[key])){
            return temp[key].fActive;
        } else {
            return this.props.active;
        }
    }

    async _updateDataActive() {
        try {
            await tbVUserLikeAPI.addUserLike(this.props.likePackage);
            if (SGHelperType.isDefined(this.props.onIconPressed)) {
                this.props.onIconPressed('Y', 1);
            }
            this._updateLikeCache('Y');
            if (this.props.likeMallGetReward) await this.props.likeMallGetReward()
            if (this.props.likeTenantGetReward) await this.props.likeTenantGetReward()
        } catch (error) {
            SGHelperErrorHandling.Handling(error, this._updateDataActive.bind(this))
        }
    }
    
    async _updateDataInactive() {
        try {
            await tbVUserLikeAPI.addUserUnlike(this.props.likePackage);
            if (SGHelperType.isDefined(this.props.onIconPressed)) {
                this.props.onIconPressed('N', -1);
            }
            this._updateLikeCache('N');
        } catch (error) {
            SGHelperErrorHandling.Handling(error, this._updateDataInactive.bind(this))
        }
    }

    async _iconPressed() {
        if (this.anonymousMode) {
            SGDialogBox.showAction(null, SGLocalize.translate("AnonymousAlert.title"), SGLocalize.translate("AnonymousAlert.message"), SGLocalize.translate("AnonymousAlert.signUpButton"), () => { SGHelperNavigation.navigatePush(this.props.navigator, 'SignUp') }, SGLocalize.translate("AnonymousAlert.signInButton"), () => { SGHelperNavigation.navigatePush(this.props.navigator, 'SignIn') }, true)
        } else {
            this.setState({ loading: true })
            var active = this._getLikeCache();
            if (active === 'Y') {
                await this._updateDataInactive();
            }
            else if (active === 'N') {
                await this._updateDataActive();
            }
            this.setState({ loading: false })
        }
    }

    _getListOfOptions() {
        if(this.props.luxury){
            return {
                like: { icon: image.likeInactiveIconLuxury[this.imageSetting].url, iconActive: image.likeActiveIconLuxury[this.imageSetting].url, title: SGLocalize.translate("cardIconButton.like") },
            }
        }else{
            return {
                like: { icon: image.likeInactiveIcon[this.imageSetting].url, iconActive: image.likeActiveIcon[this.imageSetting].url, title: SGLocalize.translate("cardIconButton.like") },
            }
        }
        
    }

    render() {
        // var { w, h, p } = this.whp;
        var style = this.style;
        var options = this._getListOfOptions();
        this.style.mainView = SGHelperStyle.appendStyle(this.style.mainView, this.props.customStyle);
        return (
            <View accessible={true} accessibilityLabel={'CardIconButtonRootView'} style={style.mainView}>
                <TouchableOpacity style={style.mainView} onPress={this._iconPressed.bind(this)}>
                    {
                        this.state.loading ?
                            <View style={style.viewLoading}><SGActivityIndicator style={style.loading}></SGActivityIndicator></View>
                            :
                            <Image accessible={true} accessibilityLabel={this.props.type} style={style.icon} source={{ uri: (this._getLikeCache() === 'Y') ? options[this.props.type].iconActive : options[this.props.type].icon }} ></Image>
                    }
                </TouchableOpacity>
                <SGPopView accessible={true} accessibilityLabel={'CardIconButtonSGPopView1'} vPos={'Top'} modal popViewID={this.pvID2}>
                    <PleaseRegisterPopup accessible={true} accessibilityLabel={'CardIconButtonRegisterPopup'} navigator={this.props.navigator} contentType={this.props.contentType} contentKey={this.props.contentKey} popViewID={this.pvID2} style={style.throwWHP}></PleaseRegisterPopup>
                </SGPopView>
            </View>
        );
    }
}

export class CardIconButtonFavorite extends SGBaseContainer {

    createStyleSheet() {
        var { w, h, p } = this._screenWHP;
        if (this.props.style) {
            if (this.props.style.width) w = this.props.style.width;
            if (this.props.style.height) h = this.props.style.height;
            if (this.props.style.padding) p = this.props.style.padding;
        }
        return StyleSheet.create({
            throwWHP: { width: this._screenWHP.w, height: this._screenWHP.h, padding: this._screenWHP.p, backgroundColor: 'white' },
            mainView: { padding: 0.075 * p, justifyContent: 'center', alignItems: 'center' },
            icon: { width: w * 0.08, height: w * 0.08, resizeMode: 'contain', backgroundColor: 'transparent', marginRight: p * 2.5 },
            viewLoading: { width: w * 0.09, height: w * 0.08, backgroundColor: 'transparent', marginRight: p * 2.5 },
            loading: { marginLeft: p },
            title: { color: this.props.textColor ? this.props.textColor : '#909090', marginTop: -1 * p }
        });
    }

    constructor(props, context, ...args) {
        super(props, context, ...args);
        this.style = this.createStyleSheet();
        this.imageSetting = SGHelperGlobalVar.getVar('GlobalImageSetting');
        this.state = { loading: false };
        this.pvID2 = SGPopView.getPopViewID();
        this.currentUser = SGHelperGlobalVar.getVar('GlobalCurrentUser');
        this.anonymousMode = SGHelperGlobalVar.getVar('GlobalAnonymous');
        this.textMode = this.props.textMode ? (this.props.textMode) : ('on')
    }

    onShowHandler(pvID) {
        SGPopView.showPopView(pvID);
    }
    _updateFavoriteCache(fActive){
        var temp = SGHelperGlobalVar.getVar("UserFavoriteCache");
        var key = this.props.contentType + '_' + this.props.contentKey 
        temp[key] = {fActive: fActive};
    }

    _getFavoriteCache(){
        var temp = SGHelperGlobalVar.getVar("UserFavoriteCache");
        var key = this.props.contentType + '_' + this.props.contentKey 
        if(SGHelperType.isDefined(temp[key])){
            return temp[key].fActive;
        } else {
            return this.props.active;
        }
    }
    async _updateDataActive() {
        try {
            var userFavoriteData = new tbUserFavoriteData().getCurrentJSON();
            userFavoriteData.fContentType = this.props.contentType;
            userFavoriteData.fContentKey = this.props.contentKey;
            userFavoriteData.UserKey = this.currentUser;
            await tbVUserFavoriteAPI.addUserFavorite(userFavoriteData);
            if (SGHelperType.isDefined(this.props.onIconPressed)) {
                this.props.onIconPressed('Y');
            }
            this._updateFavoriteCache('Y');
        } catch (error) {
            SGHelperErrorHandling.Handling(error, this._updateDataActive.bind(this))
        }
    }

    async _updateDataInactive() {
        var userFavoriteData = new tbUserFavoriteData().getCurrentJSON();
        userFavoriteData.fContentType = this.props.contentType;
        userFavoriteData.fContentKey = this.props.contentKey;
        userFavoriteData.UserKey = this.currentUser;
        try {
            await tbVUserFavoriteAPI.addUserUnfavorite(userFavoriteData);
            if (SGHelperType.isDefined(this.props.onIconPressed)) {
                this.props.onIconPressed('N');
            }
            this._updateFavoriteCache('N');
        } catch (error) {
            console.log(error)
        }
    }

    async _iconPressed() {
        if (this.anonymousMode) {
            SGDialogBox.showAction(null, SGLocalize.translate("AnonymousAlert.title"), SGLocalize.translate("AnonymousAlert.message"), SGLocalize.translate("AnonymousAlert.signUpButton"), () => { SGHelperNavigation.navigatePush(this.props.navigator, 'SignUp') }, SGLocalize.translate("AnonymousAlert.signInButton"), () => { SGHelperNavigation.navigatePush(this.props.navigator, 'SignIn') }, true)
        } else {
            this.setState({ loading: true })
            if (this._getFavoriteCache() === 'Y') {
                await this._updateDataInactive();
            }
            else if (this._getFavoriteCache() === 'N') {
                await this._updateDataActive();
            }
            this.setState({ loading: false })
        }
    }

    _getListOfOptions() {
        if(this.props.luxury){
            return {favorite: { icon: image.favoritesInactiveIconLuxury[this.imageSetting].url, iconActive: image.favoritesActiveIconLuxury[this.imageSetting].url, title: SGLocalize.translate("cardIconButton.favorite")}}
        }else{
            return {favorite: { icon: image.favoritesInactiveIcon[this.imageSetting].url, iconActive: image.favoritesActiveIcon[this.imageSetting].url, title: SGLocalize.translate("cardIconButton.favorite")}}
        }
    }

    render() {
        // var { w, h, p } = this.whp;
        var style = this.style;
        var options = this._getListOfOptions();
        this.style.mainView = SGHelperStyle.appendStyle(this.style.mainView, this.props.customStyle);
        return (
            <View accessible={true} accessibilityLabel={'CardIconButtonRootView'} style={style.mainView}>
                <TouchableOpacity style={style.mainView} onPress={this._iconPressed.bind(this)}>
                    {
                        this.state.loading ?
                            <View style={style.viewLoading}><SGActivityIndicator style={style.loading}></SGActivityIndicator></View>
                            :
                            <Image accessible={true} accessibilityLabel={this.props.type} style={style.icon} source={{ uri: (this._getFavoriteCache() === 'Y') ? options[this.props.type].iconActive : options[this.props.type].icon }} ></Image>
                    }

                </TouchableOpacity>
                {/* <Text accessible={true} accessibilityLabel={'CardIconButtonTextPresetType'} hidden={this.props.hideText ? this.props.hideText : false} preset={this.props.textPreset ? this.props.textPreset : Text.preset.h10} style={style.title}>{options[this.props.type].title}</Text> */}
                {/* {this.textMode === 'off' ? (null) : (<Text preset={Text.preset.h10} style={style.title}>{options[this.props.type].title}</Text>)}
                {this.textMode === 'import' ? (<Text preset={Text.preset.h10} style={style.title}>{this.props.importText}</Text>) : (null)} */}
                <SGPopView accessible={true} accessibilityLabel={'CardIconButtonSGPopView1'} vPos={'Top'} modal popViewID={this.pvID2}>
                    <PleaseRegisterPopup accessible={true} accessibilityLabel={'CardIconButtonRegisterPopup'} navigator={this.props.navigator} contentType={this.props.contentType} contentKey={this.props.contentKey} popViewID={this.pvID2} style={style.throwWHP}></PleaseRegisterPopup>
                </SGPopView>
            </View>
        );
    }
}

export class CardIconButtonNotification extends SGBaseContainer {

    createStyleSheet() {
        var { w, h, p } = this._screenWHP;
        if (this.props.style) {
            if (this.props.style.width) w = this.props.style.width;
            if (this.props.style.height) h = this.props.style.height;
            if (this.props.style.padding) p = this.props.style.padding;
        }
        return StyleSheet.create({
            throwWHP: { width: this._screenWHP.w, height: this._screenWHP.h, padding: this._screenWHP.p, backgroundColor: 'white' },
            mainView: { padding: 0.075 * p, justifyContent: 'center', alignItems: 'center' },
            icon: { width: w * 0.08, height: w * 0.08, resizeMode: 'contain', backgroundColor: 'transparent', marginRight: p * 2.5 },
            viewLoading: { width: w * 0.09, height: w * 0.08, backgroundColor: 'transparent', marginRight: p * 2.5 },
            loading: { marginLeft: p },
            title: { color: this.props.textColor ? this.props.textColor : '#909090', marginTop: -1 * p }
        });
    }

    constructor(props, context, ...args) {
        super(props, context, ...args);
        this.style = this.createStyleSheet();
        this.imageSetting = SGHelperGlobalVar.getVar('GlobalImageSetting');
        this.state = { loading: false };
        this.pvID2 = SGPopView.getPopViewID();
        this.currentUser = SGHelperGlobalVar.getVar('GlobalCurrentUser');
        this.anonymousMode = SGHelperGlobalVar.getVar('GlobalAnonymous');
        this.textMode = this.props.textMode ? (this.props.textMode) : ('on')
    }

    onShowHandler(pvID) {
        SGPopView.showPopView(pvID);
    }

    _updateNotificationCache(fActive){
        var temp = SGHelperGlobalVar.getVar("UserNotificationCache");
        var key = this.props.contentType + '_' + this.props.contentKey 
        temp[key] = {fActive: fActive};
    }

    _getNotificationCache(){
        var temp = SGHelperGlobalVar.getVar("UserNotificationCache");
        var key = this.props.contentType + '_' + this.props.contentKey 
        if(SGHelperType.isDefined(temp[key])){
            return temp[key].fActive;
        } else {
            return this.props.active;
        }
    }

    async _updateDataActive() {
        try {
            var userNotificationSettingsData = new tbUserNotificationSettingsData().getCurrentJSON();
            userNotificationSettingsData.fContentType = this.props.contentType;
            userNotificationSettingsData.fContentKey = this.props.contentKey;
            userNotificationSettingsData.UserKey = this.currentUser;
            await tbVUserNotificationSettingsAPI.addUserNotificationSettingsOn(userNotificationSettingsData);
            if (SGHelperType.isDefined(this.props.onIconPressed)) {
                this.props.onIconPressed('Y');
            }
            this._updateNotificationCache('Y');
        } catch (error) {
            SGHelperErrorHandling.Handling(error, this._updateDataActive.bind(this))
        }

    }

    async _updateDataInactive() {
        var userNotificationSettingsData = new tbUserNotificationSettingsData().getCurrentJSON();
        userNotificationSettingsData.fContentType = this.props.contentType;
        userNotificationSettingsData.fContentKey = this.props.contentKey;
        userNotificationSettingsData.UserKey = this.currentUser;
        try {
            await tbVUserNotificationSettingsAPI.addUserNotificationSettingsOff(userNotificationSettingsData);
            if (SGHelperType.isDefined(this.props.onIconPressed)) {
                this.props.onIconPressed('N');
            }
            this._updateNotificationCache('N');
        } catch (error) {
            console.log(error)
        }
    }

    async _iconPressed() {
        if (this.anonymousMode) {
            SGDialogBox.showAction(null, SGLocalize.translate("AnonymousAlert.title"), SGLocalize.translate("AnonymousAlert.message"), SGLocalize.translate("AnonymousAlert.signUpButton"), () => { SGHelperNavigation.navigatePush(this.props.navigator, 'SignUp') }, SGLocalize.translate("AnonymousAlert.signInButton"), () => { SGHelperNavigation.navigatePush(this.props.navigator, 'SignIn') }, true)
        } else {
            this.setState({ loading: true })
                if (this._getNotificationCache() === 'Y') {
                    await this._updateDataInactive();
                }
                else if (this._getNotificationCache() === 'N') {
                    await this._updateDataActive();
                }
            this.setState({ loading: false })
        }
    }

    _getListOfOptions() {
        if(this.props.luxury){
            return {
                notification: { icon: image.notificationInactiveIconLuxury[this.imageSetting].url, iconActive: image.notificationActiveIconLuxury[this.imageSetting].url, title: SGLocalize.translate("cardIconButton.notification") },
            }
        }else{
            return {
                notification: { icon: image.notificationInactiveIcon[this.imageSetting].url, iconActive: image.notificationActiveIcon[this.imageSetting].url, title: SGLocalize.translate("cardIconButton.notification") },
            }
        }
        
    }

    render() {
        // var { w, h, p } = this.whp;
        var style = this.style;
        var options = this._getListOfOptions();
        this.style.mainView = SGHelperStyle.appendStyle(this.style.mainView, this.props.customStyle);
        return (
            <View accessible={true} accessibilityLabel={'CardIconButtonRootView'} style={style.mainView}>
                <TouchableOpacity style={style.mainView} onPress={this._iconPressed.bind(this)}>
                    {
                        this.state.loading ?
                            <View style={style.viewLoading}><SGActivityIndicator style={style.loading}></SGActivityIndicator></View>
                            :
                            <Image accessible={true} accessibilityLabel={this.props.type} style={style.icon} source={{ uri: (this._getNotificationCache() === 'Y') ? options[this.props.type].iconActive : options[this.props.type].icon }} ></Image>
                    }

                </TouchableOpacity>
                {/* <Text accessible={true} accessibilityLabel={'CardIconButtonTextPresetType'} hidden={this.props.hideText ? this.props.hideText : false} preset={this.props.textPreset ? this.props.textPreset : Text.preset.h10} style={style.title}>{options[this.props.type].title}</Text> */}
                {/* {this.textMode === 'off' ? (null) : (<Text preset={Text.preset.h10} style={style.title}>{options[this.props.type].title}</Text>)}
                {this.textMode === 'import' ? (<Text preset={Text.preset.h10} style={style.title}>{this.props.importText}</Text>) : (null)} */}
                <SGPopView accessible={true} accessibilityLabel={'CardIconButtonSGPopView1'} vPos={'Top'} modal popViewID={this.pvID2}>
                    <PleaseRegisterPopup accessible={true} accessibilityLabel={'CardIconButtonRegisterPopup'} navigator={this.props.navigator} contentType={this.props.contentType} contentKey={this.props.contentKey} popViewID={this.pvID2} style={style.throwWHP}></PleaseRegisterPopup>
                </SGPopView>
                <SGPopView accessible={true} accessibilityLabel={'CardIconButtonSGPopView2'} vPos={'Top'} modal popViewID={this.pvID1}>
                    <CommentPopup accessible={true} accessibilityLabel={'CardIconButtonCommentPopup'} commentPackage={this.props.commentPackage} contentType={this.props.contentType} contentKey={this.props.contentKey} popViewID={this.pvID1} style={style.throwWHP}></CommentPopup>
                </SGPopView>
            </View>
        );
    }
}

export class CardIconButtonComment extends SGBaseContainer {

    createStyleSheet() {
        var { w, h, p } = this._screenWHP;
        if (this.props.style) {
            if (this.props.style.width) w = this.props.style.width;
            if (this.props.style.height) h = this.props.style.height;
            if (this.props.style.padding) p = this.props.style.padding;
        }
        return StyleSheet.create({
            throwWHP: { width: this._screenWHP.w, height: this._screenWHP.h, padding: this._screenWHP.p, backgroundColor: 'white' },
            mainView: { padding: 0.075 * p, justifyContent: 'center', alignItems: 'center' },
            icon: { width: w * 0.08, height: w * 0.08, resizeMode: 'contain', backgroundColor: 'transparent', marginRight: p * 2.5 },
            viewLoading: { width: w * 0.09, height: w * 0.08, backgroundColor: 'transparent', marginRight: p * 2.5 },
            loading: { marginLeft: p },
            title: { color: this.props.textColor ? this.props.textColor : '#909090', marginTop: -1 * p }
        });
    }

    constructor(props, context, ...args) {
        super(props, context, ...args);
        this.style = this.createStyleSheet();
        this.imageSetting = SGHelperGlobalVar.getVar('GlobalImageSetting');
        this.state = { active: (this.props.active) ? this.props.active : 'N', loading: false };
        this.pvID1 = SGPopView.getPopViewID();
        this.pvID2 = SGPopView.getPopViewID();
        this.currentUser = SGHelperGlobalVar.getVar('GlobalCurrentUser');
        this.anonymousMode = SGHelperGlobalVar.getVar('GlobalAnonymous');
        this.textMode = this.props.textMode ? (this.props.textMode) : ('on')
    }

    onShowHandler(pvID) {
        SGHelperGlobalVar.setVar('PauseViewPager',true);
        SGPopView.showPopView(pvID);
    }

    async _iconPressed() {
        if (this.anonymousMode) {
            SGDialogBox.showAction(null, SGLocalize.translate("AnonymousAlert.title"), SGLocalize.translate("AnonymousAlert.message"), SGLocalize.translate("AnonymousAlert.signUpButton"), () => { SGHelperNavigation.navigatePush(this.props.navigator, 'SignUp') }, SGLocalize.translate("AnonymousAlert.signInButton"), () => { SGHelperNavigation.navigatePush(this.props.navigator, 'SignIn') }, true)
        } else {
            this.setState({ loading: true })
            if (this.props.type === 'comment') {
                if (this.currentUser) {
                    if (this.props.canComment === 'Y') {
                        this.onShowHandler(this.pvID1);
                    }
                    else {
                        if (this.props.commentPackage.fTargetType === 'Place')
                            SGDialogBox.showWarning(null, SGLocalize.translate('globalText.FailText'), SGLocalize.translate('LockComment.PlaceLockComment'), SGLocalize.translate('globalText.ok'), () => { }, true)
                        if (this.props.commentPackage.fTargetType === 'Store')
                            SGDialogBox.showWarning(null, SGLocalize.translate('globalText.FailText'), SGLocalize.translate('LockComment.StoreLockComment'), SGLocalize.translate('globalText.ok'), () => { }, true)
                        if (this.props.commentPackage.fTargetType === 'Resto')
                            SGDialogBox.showWarning(null, SGLocalize.translate('globalText.FailText'), SGLocalize.translate('LockComment.RestoLockComment'), SGLocalize.translate('globalText.ok'), () => { }, true)
                    }
                }
                else {
                    this.onShowHandler(this.pvID2);
                }

                // this.props.onCommentPress(this.props.pvID1);
            }
            this.setState({ loading: false })
        }
    }

    _getListOfOptions() {
        if(this.props.luxury){
            return {
                comment: { icon: image.commentIconLuxury[this.imageSetting].url, iconActive: image.commentIconLuxury[this.imageSetting].url, title: SGLocalize.translate("cardIconButton.comment") },
            }
        }else{
            return {
                comment: { icon: image.commentIcon[this.imageSetting].url, iconActive: image.commentIcon[this.imageSetting].url, title: SGLocalize.translate("cardIconButton.comment") },
            }
        }
        
    }
    render() {
        // var { w, h, p } = this.whp;
        var style = this.style;
        var options = this._getListOfOptions();
        this.style.mainView = SGHelperStyle.appendStyle(this.style.mainView, this.props.customStyle);
        return (
            <View accessible={true} accessibilityLabel={'CardIconButtonRootView'} style={style.mainView}>
                <TouchableOpacity style={style.mainView} onPress={this._iconPressed.bind(this)}>
                    {
                        this.state.loading ?
                            <View style={style.viewLoading}><SGActivityIndicator style={style.loading}></SGActivityIndicator></View>
                            :
                            <Image accessible={true} accessibilityLabel={this.props.type} style={style.icon} source={{ uri: (this.state.active === 'Y') ? options[this.props.type].iconActive : options[this.props.type].icon }} ></Image>
                    }

                </TouchableOpacity>
                {/* <Text accessible={true} accessibilityLabel={'CardIconButtonTextPresetType'} hidden={this.props.hideText ? this.props.hideText : false} preset={this.props.textPreset ? this.props.textPreset : Text.preset.h10} style={style.title}>{options[this.props.type].title}</Text> */}
                {/* {this.textMode === 'off' ? (null) : (<Text preset={Text.preset.h10} style={style.title}>{options[this.props.type].title}</Text>)}
                {this.textMode === 'import' ? (<Text preset={Text.preset.h10} style={style.title}>{this.props.importText}</Text>) : (null)} */}
                <SGPopView accessible={true} accessibilityLabel={'CardIconButtonSGPopView1'} vPos={'Top'} modal popViewID={this.pvID2}>
                    <PleaseRegisterPopup accessible={true} accessibilityLabel={'CardIconButtonRegisterPopup'} navigator={this.props.navigator} contentType={this.props.contentType} contentKey={this.props.contentKey} popViewID={this.pvID2} style={style.throwWHP}></PleaseRegisterPopup>
                </SGPopView>
                <SGPopView accessible={true} accessibilityLabel={'CardIconButtonSGPopView2'} vPos={'Top'} modal popViewID={this.pvID1}>
                    <CommentPopup accessible={true} accessibilityLabel={'CardIconButtonCommentPopup'} commentPackage={this.props.commentPackage} contentType={this.props.contentType} contentKey={this.props.contentKey} popViewID={this.pvID1} style={style.throwWHP}></CommentPopup>
                </SGPopView>
            </View>
        );
    }
}

export class CardIconButtonShare extends SGBaseContainer {

    createStyleSheet() {
        var { w, h, p } = this._screenWHP;
        if (this.props.style) {
            if (this.props.style.width) w = this.props.style.width;
            if (this.props.style.height) h = this.props.style.height;
            if (this.props.style.padding) p = this.props.style.padding;
        }
        return StyleSheet.create({
            throwWHP: { width: this._screenWHP.w, height: this._screenWHP.h, padding: this._screenWHP.p, backgroundColor: 'white' },
            mainView: { padding: 0.075 * p, justifyContent: 'center', alignItems: 'center' },
            icon: {  backgroundColor: 'transparent', justifyContent:'center',alignItems:'center',marginHorizontal:p},
            viewLoading: { width: w * 0.09, height: w * 0.08, backgroundColor: 'transparent', marginRight: p * 2.5 },
            loading: { marginLeft: p },
            title: { color: this.props.textColor ? this.props.textColor : '#909090', marginTop: -1 * p }
        });
    }

    constructor(props, context, ...args) {
        super(props, context, ...args);
        this.style = this.createStyleSheet();
        this.imageSetting = SGHelperGlobalVar.getVar('GlobalImageSetting');
        this.state = { active: (this.props.active) ? this.props.active : 'N', loading: false };
        this.pvID2 = SGPopView.getPopViewID();
        this.currentUser = SGHelperGlobalVar.getVar('GlobalCurrentUser');
        this.anonymousMode = SGHelperGlobalVar.getVar('GlobalAnonymous');
        this.textMode = this.props.textMode ? (this.props.textMode) : ('on')
    }

    onShowHandler(pvID) {
        SGPopView.showPopView(pvID);
    }

    async _addData() {
        // mengambil tipe icon nya apa, favorite, like, atau notification
        // melakukan update pada tabel yang sesuai dengan tipe icon nya
        // update dilakukan pada userID yang sedang aktif
        // WHERE dilakukan update sesuai contentType yang sedang di klik dan contentID nya
        // console.log(this.props)
        try {
            if (this.props.type == 'share') {
                var userShareData = new tbUserShareData().getCurrentJSON();
                userShareData.fUserKey = this.currentUser;
                userShareData.fCreatedBy = this.currentUser;
                userShareData.fLastModifiedBy = this.currentUser;
                userShareData.fContentType = this.props.contentType;
                userShareData.fContentKey = this.props.contentKey;
                userShareData.fTargetKey = this.props.targetKey;
                await tbVUserShareAPI.addUserShare(userShareData);
            }
        } catch (error) {
            SGHelperErrorHandling.Handling(error, this._addData.bind(this))
        }

    }

    async _iconPressed() {
        if (this.anonymousMode) {
            SGDialogBox.showAction(null, SGLocalize.translate("AnonymousAlert.title"), SGLocalize.translate("AnonymousAlert.message"), SGLocalize.translate("AnonymousAlert.signUpButton"), () => { SGHelperNavigation.navigatePush(this.props.navigator, 'SignUp') }, SGLocalize.translate("AnonymousAlert.signInButton"), () => { SGHelperNavigation.navigatePush(this.props.navigator, 'SignIn') }, true)
        } else {
            this.setState({ loading: true })
            if (this.props.type === 'share') {
                this._addData();
                var fContentType = this.props.contentType
                var fContentKey = this.props.contentKey
                var url = SGHelperGlobalVar.getVar('UriScheme2');
                // var img = 'https://www.spotgue.com/test-image/index3.php?url=' + this.props.img /*+ '&title=' + this.props.contentKey*/;                
                // var urlImage = 'https://spotguestoragedev04.blob.core.windows.net/tenant/621a9ff9-af20-48f8-1449-08d87bdd7f06.5c9ce5b0-a965-4121-9681-2d874da0d579';
                var img = '';
                if(SGHelperType.isDefined(this.props.img)){
                    var urlArr1 = this.props.img.split(".blob.core.windows.net/")
                    var storageID = urlArr1[0].slice(urlArr1[0].length-1, urlArr1[0].length);
                    var urlPath = urlArr1[1];
                    var urlArr2 = urlPath.split('/');         
                }
                var targetKey = this.props.targetKey;
                // var message = 'One Stop Solution For Your Mall 4.0 Experience!\n\nBe the first to get a complete access to all information and promotion from your favourite malls.\nDownload Spotgue App\nhttp://spotgue.app.link/AL76TKSvibb'
                var message = this.props.shareMessage;
                

                if( message == ''  ){
                switch (fContentType) {
                    case 'Place':
                        url = url + 'building/' + fContentKey + fContentKey  + '?t=' + urlArr2[0] + '&m=' + mode.slice(0,1) + '&s=' + storageID + '&i=' + urlArr2[1];                        
                        // url = url + '?t=' + urlArr2[0] + '&m=' + mode.slice(0,1) + '&s=' + storageID + '&i=' + urlArr2[1];
                        message = SGLocalize.translate('ShareButtonMessage.PlaceMsg',this.props.shareParams) + '\n\n' + SGLocalize.translate('ShareButtonMessage.UserReferralShare',{referralCode:SGHelperGlobalVar.getVar("GlobalCurrentUserData").fReferralCode}) + '\n\n' + 'Link: ' + url;
                        break;
                    case 'Store':
                        url = url + 'store/' + fContentKey  + '?t=' + urlArr2[0] + '&m=' + mode.slice(0,1) + '&s=' + storageID + '&i=' + urlArr2[1];                        
                        message =  SGLocalize.translate('ShareButtonMessage.StorestoMsg',this.props.shareParams) + '\n\n' + SGLocalize.translate('ShareButtonMessage.UserReferralShare',{referralCode:SGHelperGlobalVar.getVar("GlobalCurrentUserData").fReferralCode}) + '\n\n' + 'Link: ' + url;
                        break;
                    case 'Resto':
                        url = url + 'resto/' + fContentKey  + '?t=' + urlArr2[0] + '&m=' + mode.slice(0,1) + '&s=' + storageID + '&i=' + urlArr2[1];                        
                        message =  SGLocalize.translate('ShareButtonMessage.StorestoMsg',this.props.shareParams) + '\n\n' + SGLocalize.translate('ShareButtonMessage.UserReferralShare',{referralCode:SGHelperGlobalVar.getVar("GlobalCurrentUserData").fReferralCode}) + '\n\n' + 'Link: ' + url;
                        break;
                    case 'Facility':
                        url = url + 'facility/' + fContentKey  + '?t=' + urlArr2[0] + '&m=' + mode.slice(0,1) + '&s=' + storageID + '&i=' + urlArr2[1];                        
                        message =  SGLocalize.translate('ShareButtonMessage.FacilityMsg',this.props.shareParams) + '\n\n' + SGLocalize.translate('ShareButtonMessage.UserReferralShare',{referralCode:SGHelperGlobalVar.getVar("GlobalCurrentUserData").fReferralCode}) + '\n\n' + 'Link: ' + url;
                        break;
                    case 'PlaceEvent':
                        url = url + 'eventbuilding/' + fContentKey  + '?t=' + urlArr2[0] + '&m=' + mode.slice(0,1) + '&s=' + storageID + '&i=' + urlArr2[1];                        
                        message =  SGLocalize.translate('ShareButtonMessage.PlaceEventMsg',this.props.shareParams) + '\n\n' + SGLocalize.translate('ShareButtonMessage.UserReferralShare',{referralCode:SGHelperGlobalVar.getVar("GlobalCurrentUserData").fReferralCode}) + '\n\n' + 'Link: ' + url;
                        break;
                    case 'StorePromo':
                        url = url + 'eventstore/' + fContentKey  + '?t=' + urlArr2[0] + '&m=' + mode.slice(0,1) + '&s=' + storageID + '&i=' + urlArr2[1];                        
                        message =  SGLocalize.translate('ShareButtonMessage.StorestoEventMsg',this.props.shareParams) + '\n\n' + SGLocalize.translate('ShareButtonMessage.UserReferralShare',{referralCode:SGHelperGlobalVar.getVar("GlobalCurrentUserData").fReferralCode}) + '\n\n' + 'Link: ' + url;
                        break;
                    case 'RestoPromo':
                        url = url + 'eventresto/' + fContentKey + fContentKey  + '?t=' + urlArr2[0] + '&m=' + mode.slice(0,1) + '&s=' + storageID + '&i=' + urlArr2[1];                        
                        message =  SGLocalize.translate('ShareButtonMessage.StorestoEventMsg',this.props.shareParams) + '\n\n' + SGLocalize.translate('ShareButtonMessage.UserReferralShare',{referralCode:SGHelperGlobalVar.getVar("GlobalCurrentUserData").fReferralCode}) + '\n\n' + 'Link: ' + url;
                        break;
                    case 'StoreProduct':
                        url = url + 'productstore/' + fContentKey + '/' + targetKey  + '?t=' + urlArr2[0] + '&m=' + mode.slice(0,1) + '&s=' + storageID + '&i=' + urlArr2[1];                        
                        message =  SGLocalize.translate('ShareButtonMessage.StorestoPrdMsg',this.props.shareParams) + '\n\n' + SGLocalize.translate('ShareButtonMessage.UserReferralShare',{referralCode:SGHelperGlobalVar.getVar("GlobalCurrentUserData").fReferralCode}) + '\n\n' + 'Link: ' + url;
                        break;
                    case 'RestoMenu':
                        url = url + 'productresto/' + fContentKey + '/' + targetKey;
                        message =  SGLocalize.translate('ShareButtonMessage.StorestoPrdMsg',this.props.shareParams) + '\n\n' + SGLocalize.translate('ShareButtonMessage.UserReferralShare',{referralCode:SGHelperGlobalVar.getVar("GlobalCurrentUserData").fReferralCode}) + '\n\n' + 'Link: ' + url;
                        break;
                    case 'WhereToGo':
                        url = url + 'building/' + fContentKey  + '?t=' + urlArr2[0] + '&m=' + mode.slice(0,1) + '&s=' + storageID + '&i=' + urlArr2[1];                        
                        message =  SGLocalize.translate('ShareButtonMessage.PlaceMsg',this.props.shareParams) + '\n\n' + SGLocalize.translate('ShareButtonMessage.UserReferralShare',{referralCode:SGHelperGlobalVar.getVar("GlobalCurrentUserData").fReferralCode}) + '\n\n' + 'Link: ' + url;
                        break;
                    case 'StoreWhatToGift':
                        url = url + 'storewhattogift/' + fContentKey  + '?t=' + urlArr2[0] + '&m=' + mode.slice(0,1) + '&s=' + storageID + '&i=' + urlArr2[1];                        
                        message =  SGLocalize.translate('ShareButtonMessage.ProductRcmMsgGift',this.props.shareParams) + '\n\n' + SGLocalize.translate('ShareButtonMessage.UserReferralShare',{referralCode:SGHelperGlobalVar.getVar("GlobalCurrentUserData").fReferralCode}) + '\n\n' + 'Link: ' + url;
                        break;
                    case 'RestoWhatToGift':
                        url = url + 'restowhattogift/' + fContentKey  + '?t=' + urlArr2[0] + '&m=' + mode.slice(0,1) + '&s=' + storageID + '&i=' + urlArr2[1];                        
                        message =  SGLocalize.translate('ShareButtonMessage.ProductRcmMsgGift',this.props.shareParams) + '\n\n' + SGLocalize.translate('ShareButtonMessage.UserReferralShare',{referralCode:SGHelperGlobalVar.getVar("GlobalCurrentUserData").fReferralCode}) + '\n\n' + 'Link: ' + url;
                        break;
                    case 'ClothToBuy':
                        url = url + 'clothtobuy/' + fContentKey  + '?t=' + urlArr2[0] + '&m=' + mode.slice(0,1) + '&s=' + storageID + '&i=' + urlArr2[1];                        
                        message =  SGLocalize.translate('ShareButtonMessage.ProductRcmMsgStore',this.props.shareParams) + '\n\n' + SGLocalize.translate('ShareButtonMessage.UserReferralShare',{referralCode:SGHelperGlobalVar.getVar("GlobalCurrentUserData").fReferralCode}) + '\n\n' + 'Link: ' + url;
                        break;
                    case 'WhatToEat':
                        url = url + 'whattoeat/' + fContentKey  + '?t=' + urlArr2[0] + '&m=' + mode.slice(0,1) + '&s=' + storageID + '&i=' + urlArr2[1];                        
                        message =  SGLocalize.translate('ShareButtonMessage.ProductRcmMsgResto',this.props.shareParams) + '\n\n' + SGLocalize.translate('ShareButtonMessage.UserReferralShare',{referralCode:SGHelperGlobalVar.getVar("GlobalCurrentUserData").fReferralCode}) + '\n\n' + 'Link: ' + url;
                        break;
                    case 'StoreAuction':
                        url = url + 'StoreAuction/'+ fContentKey  + '?t=' + urlArr2[0] + '&m=' + mode.slice(0,1) + '&s=' + storageID + '&i=' + urlArr2[1];                        
                        message =  SGLocalize.translate('ShareButtonMessage.AuctionMsg',this.props.shareParams) + '\n\n' + SGLocalize.translate('ShareButtonMessage.UserReferralShare',{referralCode:SGHelperGlobalVar.getVar("GlobalCurrentUserData").fReferralCode}) + '\n\n' + 'Link: ' + url;
                        break;
                    case 'RestoAuction':
                        url = url + 'RestoAuction/'+ fContentKey  + '?t=' + urlArr2[0] + '&m=' + mode.slice(0,1) + '&s=' + storageID + '&i=' + urlArr2[1];                        
                        message =  SGLocalize.translate('ShareButtonMessage.AuctionMsg',this.props.shareParams) + '\n\n' + SGLocalize.translate('ShareButtonMessage.UserReferralShare',{referralCode:SGHelperGlobalVar.getVar("GlobalCurrentUserData").fReferralCode}) + '\n\n' + 'Link: ' + url;
                        break;
                }
            }

                else{
                switch (fContentType) {
                    case 'Place':
                        url = url + 'building/' + fContentKey  + '?t=' + urlArr2[0] + '&m=' + mode.slice(0,1) + '&s=' + storageID + '&i=' + urlArr2[1];                        
                        message =  message + '\n\n' + SGLocalize.translate('ShareButtonMessage.CusPlaceMsg',this.props.shareParams) + '\n\n' + SGLocalize.translate('ShareButtonMessage.UserReferralShare',{referralCode:SGHelperGlobalVar.getVar("GlobalCurrentUserData").fReferralCode}) + '\n\n' + 'Link: ' + url;
                        break;
                    case 'Store':
                        url = url + 'store/' + fContentKey  + '?t=' + urlArr2[0] + '&m=' + mode.slice(0,1) + '&s=' + storageID + '&i=' + urlArr2[1];                        
                        message =  message + '\n\n' + SGLocalize.translate('ShareButtonMessage.CusStorestoMsg',this.props.shareParams) + '\n\n' + SGLocalize.translate('ShareButtonMessage.UserReferralShare',{referralCode:SGHelperGlobalVar.getVar("GlobalCurrentUserData").fReferralCode}) + '\n\n' + 'Link: ' + url;
                        break;
                    case 'Resto':
                        url = url + 'resto/' + fContentKey  + '?t=' + urlArr2[0] + '&m=' + mode.slice(0,1) + '&s=' + storageID + '&i=' + urlArr2[1];                        
                        message =  message + '\n\n' + SGLocalize.translate('ShareButtonMessage.CusStorestoMsg',this.props.shareParams) + '\n\n' + SGLocalize.translate('ShareButtonMessage.UserReferralShare',{referralCode:SGHelperGlobalVar.getVar("GlobalCurrentUserData").fReferralCode}) + '\n\n' + 'Link: ' + url;
                        break;
                    case 'Facility':
                        url = url + 'facility/' + fContentKey  + '?t=' + urlArr2[0] + '&m=' + mode.slice(0,1) + '&s=' + storageID + '&i=' + urlArr2[1];                        
                        // Hai friends, kamu tahu ada fasilitas %{FacilityName} di %{MallName}. \n\nCari tahu info lengkapnya dan beragam Event & Promo terbaru %{MallName} di aplikasi Spotgue sekarang. Ada hadiah kejutan dan referral reward yang seru banget."
                        message =  SGLocalize.translate('ShareButtonMessage.FacilityMsg',this.props.shareParams) + '\n\n' + SGLocalize.translate('ShareButtonMessage.UserReferralShare',{referralCode:SGHelperGlobalVar.getVar("GlobalCurrentUserData").fReferralCode}) + '\n\n' + 'Link: ' + url;
                        break;
                    case 'PlaceEvent':
                        url = url + 'eventbuilding/' + fContentKey  + '?t=' + urlArr2[0] + '&m=' + mode.slice(0,1) + '&s=' + storageID + '&i=' + urlArr2[1];                        
                        message =  message + '\n\n' + SGLocalize.translate('ShareButtonMessage.CusPlaceEventMsg',this.props.shareParams) + '\n\n' + SGLocalize.translate('ShareButtonMessage.UserReferralShare',{referralCode:SGHelperGlobalVar.getVar("GlobalCurrentUserData").fReferralCode}) + '\n\n' + 'Link: ' + url;
                        break;
                    case 'StorePromo':
                        url = url + 'eventstore/' + fContentKey  + '?t=' + urlArr2[0] + '&m=' + mode.slice(0,1) + '&s=' + storageID + '&i=' + urlArr2[1];                        
                        message =  message + '\n\n' + SGLocalize.translate('ShareButtonMessage.CusStorestoEventMsg',this.props.shareParams) + '\n\n' + SGLocalize.translate('ShareButtonMessage.UserReferralShare',{referralCode:SGHelperGlobalVar.getVar("GlobalCurrentUserData").fReferralCode}) + '\n\n' + 'Link: ' + url;
                        break;
                    case 'RestoPromo':
                        url = url + 'eventresto/' + fContentKey  + '?t=' + urlArr2[0] + '&m=' + mode.slice(0,1) + '&s=' + storageID + '&i=' + urlArr2[1];                        
                        message =  message + '\n\n' + SGLocalize.translate('ShareButtonMessage.CusStorestoEventMsg',this.props.shareParams) + '\n\n' + SGLocalize.translate('ShareButtonMessage.UserReferralShare',{referralCode:SGHelperGlobalVar.getVar("GlobalCurrentUserData").fReferralCode}) + '\n\n' + 'Link: ' + url;
                        break;
                    case 'StoreProduct':
                        url = url + 'productstore/' + fContentKey + '/' + targetKey  + '?t=' + urlArr2[0] + '&m=' + mode.slice(0,1) + '&s=' + storageID + '&i=' + urlArr2[1];                        
                        message =  message + '\n\n' + SGLocalize.translate('ShareButtonMessage.CusStorestoPrdMsg',this.props.shareParams) + '\n\n' + SGLocalize.translate('ShareButtonMessage.UserReferralShare',{referralCode:SGHelperGlobalVar.getVar("GlobalCurrentUserData").fReferralCode}) + '\n\n' + 'Link: ' + url;
                        break;
                    case 'RestoMenu':
                        url = url + 'productresto/' + fContentKey + '/' + targetKey  + '?t=' + urlArr2[0] + '&m=' + mode.slice(0,1) + '&s=' + storageID + '&i=' + urlArr2[1];                        
                        message =  message + '\n\n' + SGLocalize.translate('ShareButtonMessage.CusStorestoPrdMsg',this.props.shareParams) + '\n\n' + SGLocalize.translate('ShareButtonMessage.UserReferralShare',{referralCode:SGHelperGlobalVar.getVar("GlobalCurrentUserData").fReferralCode}) + '\n\n' + 'Link: ' + url;
                        break;
                    case 'WhereToGo':
                        url = url + 'building/' + fContentKey  + '?t=' + urlArr2[0] + '&m=' + mode.slice(0,1) + '&s=' + storageID + '&i=' + urlArr2[1];                        
                        message =  message + '\n\n' + SGLocalize.translate('ShareButtonMessage.CusPlaceMsg',this.props.shareParams) + '\n\n' + SGLocalize.translate('ShareButtonMessage.UserReferralShare',{referralCode:SGHelperGlobalVar.getVar("GlobalCurrentUserData").fReferralCode}) + '\n\n' + 'Link: ' + url;
                        break;
                    case 'StoreWhatToGift':
                        url = url + 'storewhattogift/' + fContentKey  + '?t=' + urlArr2[0] + '&m=' + mode.slice(0,1) + '&s=' + storageID + '&i=' + urlArr2[1];                        
                        message =  message + '\n\n' + SGLocalize.translate('ShareButtonMessage.CusProductRcmMsgGift',this.props.shareParams) + '\n\n' + SGLocalize.translate('ShareButtonMessage.UserReferralShare',{referralCode:SGHelperGlobalVar.getVar("GlobalCurrentUserData").fReferralCode}) + '\n\n' + 'Link: ' + url;
                        break;
                    case 'RestoWhatToGift':
                        url = url + 'restowhattogift/' + fContentKey  + '?t=' + urlArr2[0] + '&m=' + mode.slice(0,1) + '&s=' + storageID + '&i=' + urlArr2[1];                        
                        message =  message + '\n\n' + SGLocalize.translate('ShareButtonMessage.CusProductRcmMsgGift',this.props.shareParams) + '\n\n' + SGLocalize.translate('ShareButtonMessage.UserReferralShare',{referralCode:SGHelperGlobalVar.getVar("GlobalCurrentUserData").fReferralCode}) + '\n\n' + 'Link: ' + url;
                        break;
                    case 'ClothToBuy':
                        url = url + 'clothtobuy/' + fContentKey  + '?t=' + urlArr2[0] + '&m=' + mode.slice(0,1) + '&s=' + storageID + '&i=' + urlArr2[1];                        
                        message =  message + '\n\n' + SGLocalize.translate('ShareButtonMessage.CusProductRcmMsgStore',this.props.shareParams) + '\n\n' + SGLocalize.translate('ShareButtonMessage.UserReferralShare',{referralCode:SGHelperGlobalVar.getVar("GlobalCurrentUserData").fReferralCode}) + '\n\n' + 'Link: ' + url;
                        break;
                    case 'WhatToEat':
                        url = url + 'whattoeat/' + fContentKey  + '?t=' + urlArr2[0] + '&m=' + mode.slice(0,1) + '&s=' + storageID + '&i=' + urlArr2[1];                        
                        message =  message + '\n\n' + SGLocalize.translate('ShareButtonMessage.CusProductRcmMsgResto',this.props.shareParams) + '\n\n' + SGLocalize.translate('ShareButtonMessage.UserReferralShare',{referralCode:SGHelperGlobalVar.getVar("GlobalCurrentUserData").fReferralCode}) + '\n\n' + 'Link: ' + url;
                        break;
                    case 'UserRefferal':
                        message = message
                        break;
                    case 'SponsorEvent':
                        url = url + 'eventsponsor/'+ fContentKey  + '?t=' + urlArr2[0] + '&m=' + mode.slice(0,1) + '&s=' + storageID + '&i=' + urlArr2[1];                        
                        message =  message + 'Link: ' + url;
                        break;
                    case 'StoreAuction':
                        url = url + 'StoreAuction/'+ fContentKey  + '?t=' + urlArr2[0] + '&m=' + mode.slice(0,1) + '&s=' + storageID + '&i=' + urlArr2[1];                        
                        message =  message + '\n\n' + SGLocalize.translate('ShareButtonMessage.CusAuctionMsg',this.props.shareParams) + '\n\n' + SGLocalize.translate('ShareButtonMessage.UserReferralShare',{referralCode:SGHelperGlobalVar.getVar("GlobalCurrentUserData").fReferralCode}) + '\n\n' + 'Link: ' + url;
                        break;
                    case 'RestoAuction':
                        url = url + 'RestoAuction/'+ fContentKey  + '?t=' + urlArr2[0] + '&m=' + mode.slice(0,1) + '&s=' + storageID + '&i=' + urlArr2[1];                        
                        message =  message + '\n\n' + SGLocalize.translate('ShareButtonMessage.CusAuctionMsg',this.props.shareParams) + '\n\n' + SGLocalize.translate('ShareButtonMessage.UserReferralShare',{referralCode:SGHelperGlobalVar.getVar("GlobalCurrentUserData").fReferralCode}) + '\n\n' + 'Link: ' + url;    
                        break;                
                }
            }

                Share.share({
                    subject: 'Spotgue Share!',
                    title: 'Share Spotgue!',
                    message: message,
                }, {
                    // Android only:
                    dialogTitle: 'Share',
                    // iOS only:
                })
                // memanggil function lagi untuk melakukan share
            }
            this.setState({ loading: false })
        }
    }

    _getListOfOptions() {
        if(this.props.luxury){
            return {
                share: { icon: image.shareIconBlack[this.imageSetting].url, iconActive: image.shareIconBlack[this.imageSetting].url, title: SGLocalize.translate("cardIconButton.share") },
            }
        }else{
            return {
                share: { icon: image.shareIconLuxury[this.imageSetting].url, iconActive: image.shareIconLuxury[this.imageSetting].url, title: SGLocalize.translate("cardIconButton.share") },
            }
        }
        
    }
    render() {
        // var { w, h, p } = this.whp;
        var style = this.style;
        var options = this._getListOfOptions();
        this.style.mainView = SGHelperStyle.appendStyle(this.style.mainView, this.props.customStyle);
        return (
            <View accessible={true} accessibilityLabel={'CardIconButtonRootView'} style={style.mainView}>
                <TouchableOpacity style={style.mainView} onPress={this._iconPressed.bind(this)}>
                    {
                        this.state.loading ?
                            <View style={style.viewLoading}><SGActivityIndicator style={style.loading}></SGActivityIndicator></View>
                            :
                            <View style={style.icon}> 
                                <Icon name={Platform.OS ==='ios'? Icon.Icon.shareIOS : Icon.Icon.share} preset={Icon.preset.h4} style={this.props.luxury ? {color:'white'}: {color:'rgba(50,50,50,1)'}}></Icon>
                            </View>
                            // <Image accessible={true} accessibilityLabel={this.props.type} style={style.icon} source={{ uri: (this.state.active === 'Y') ? options[this.props.type].iconActive : options[this.props.type].icon }} ></Image>
                    }

                </TouchableOpacity>
                {/* <Text accessible={true} accessibilityLabel={'CardIconButtonTextPresetType'} hidden={this.props.hideText ? this.props.hideText : false} preset={this.props.textPreset ? this.props.textPreset : Text.preset.h10} style={style.title}>{options[this.props.type].title}</Text> */}
                {/* {this.textMode === 'off' ? (null) : (<Text preset={Text.preset.h10} style={style.title}>{options[this.props.type].title}</Text>)}
                {this.textMode === 'import' ? (<Text preset={Text.preset.h10} style={style.title}>{this.props.importText}</Text>) : (null)} */}
                <SGPopView accessible={true} accessibilityLabel={'CardIconButtonSGPopView1'} vPos={'Top'} modal popViewID={this.pvID2}>
                    <PleaseRegisterPopup accessible={true} accessibilityLabel={'CardIconButtonRegisterPopup'} navigator={this.props.navigator} contentType={this.props.contentType} contentKey={this.props.contentKey} popViewID={this.pvID2} style={style.throwWHP}></PleaseRegisterPopup>
                </SGPopView>
            </View>
        );
    }
}

export class CardIconButton extends SGBaseContainer {

    createStyleSheet() {
        var { w, h, p } = this._screenWHP;
        if (this.props.style) {
            if (this.props.style.width) w = this.props.style.width;
            if (this.props.style.height) h = this.props.style.height;
            if (this.props.style.padding) p = this.props.style.padding;
        }
        return StyleSheet.create({
            throwWHP: { width: this._screenWHP.w, height: this._screenWHP.h, padding: this._screenWHP.p, backgroundColor: 'white' },
            mainView: { padding: 0.075 * p, justifyContent: 'center', alignItems: 'center' },
            icon: { width: w * 0.08, height: w * 0.08, resizeMode: 'contain', backgroundColor: 'transparent', marginRight: p * 2.5 },
            viewLoading: { width: w * 0.09, height: w * 0.08, backgroundColor: 'transparent', marginRight: p * 2.5 },
            loading: { marginLeft: p },
            title: { color: this.props.textColor ? this.props.textColor : '#909090', marginTop: -1 * p }
        });
    }

    componentDidMount() {
        this._unsubscribe = this.props.navigator.addListener('focus', () => {
            this._onRefreshAllItem();
        });
    }
    componentWillUnmount() {
        if (this._unsubscribe) { this._unsubscribe(); }
    }

    _onRefreshAllItem() {
        this.imageSetting = SGHelperGlobalVar.getVar('GlobalImageSetting');
        this.state = { active: (this.props.active) ? this.props.active : 'N' };
        this.currentUser = SGHelperGlobalVar.getVar('GlobalCurrentUser');
    }

    constructor(props, context, ...args) {
        super(props, context, ...args);
        this.style = this.createStyleSheet();
        this.imageSetting = SGHelperGlobalVar.getVar('GlobalImageSetting');
        this.state = { active: (this.props.active) ? this.props.active : 'N', loading: false };
        this.pvID1 = SGPopView.getPopViewID();
        this.pvID2 = SGPopView.getPopViewID();
        this.currentUser = SGHelperGlobalVar.getVar('GlobalCurrentUser');
        this.anonymousMode = SGHelperGlobalVar.getVar('GlobalAnonymous');
        this.textMode = this.props.textMode ? (this.props.textMode) : ('on')
    }

    onShowHandler(pvID) {
        SGPopView.showPopView(pvID);
    }

    async _addData() {
        // mengambil tipe icon nya apa, favorite, like, atau notification
        // melakukan update pada tabel yang sesuai dengan tipe icon nya
        // update dilakukan pada userID yang sedang aktif
        // WHERE dilakukan update sesuai contentType yang sedang di klik dan contentID nya
        console.log(this.props.type)
        try {
            if (this.props.type == 'favorite') {
                var arrFilter = [
                    { name: 'fContentType', operator: '=', value: this.props.contentType },
                    { name: 'fContentKey', operator: '=', value: this.props.contentKey },
                ]
                this.baseRunSingleAPIWithRedoOption('searchUserFavoriteWithArrFilter', (async (v1, v2) => { return tbVUserFavoriteAPI.searchUserFavoriteWithArrFilter(v1, v2) }).bind(this, arrFilter, []), (async (v) => {
                    // (await tbVUserFavoriteAPI.searchUserFavoriteWithArrFilter(arrFilter, [])).length ? (true) : (false);
                    if (v.length) {
                        this._updateDataActive();
                    }
                    else {
                        var userFavoriteData = new tbUserFavoriteData().getCurrentJSON();
                        userFavoriteData.fUserKey = this.currentUser;
                        userFavoriteData.fCreatedBy = this.currentUser;
                        userFavoriteData.fLastModifiedBy = this.currentUser;
                        userFavoriteData.fContentType = this.props.contentType;
                        userFavoriteData.fContentKey = this.props.contentKey;

                        await tbVUserFavoriteAPI.addUserFavorite(userFavoriteData);

                    }
                }).bind(this), null, SGHelperGlobalVar.getVar("ResponTimes"));

            }
            if (this.props.type == 'like') {
                await tbVUserLikeAPI.addUserLike(this.props.likePackage);
                this.setState({ active: 'Y' });
                if (this.props.refreshLikeCounter) this.props.refreshLikeCounter('Y');
                if (this.props.likeMallGetReward) await this.props.likeMallGetReward()
                if (this.props.likeTenantGetReward) await this.props.likeTenantGetReward()
            }
            if (this.props.type == 'notification') {
                console.log('gas keun')
                var userNotificationSettingsData = new tbUserNotificationSettingsData().getCurrentJSON();
                userNotificationSettingsData.fContentType = this.props.contentType;
                userNotificationSettingsData.fContentKey = this.props.contentKey;
                userNotificationSettingsData.UserKey = this.currentUser;

                await tbVUserNotificationSettingsAPI.addUserNotificationSettingsOn(userNotificationSettingsData);
                this.setState({ active: 'Y' });

            }
            if (this.props.type == 'share') {
                var userShareData = new tbUserShareData().getCurrentJSON();
                userShareData.fUserKey = this.currentUser;
                userShareData.fCreatedBy = this.currentUser;
                userShareData.fLastModifiedBy = this.currentUser;
                userShareData.fContentType = this.props.contentType;
                userShareData.fContentKey = this.props.contentKey;
                userShareData.fTargetKey = this.props.targetKey;
                await tbVUserShareAPI.addUserShare(userShareData);
            }
        } catch (error) {
            SGHelperErrorHandling.Handling(error, this._addData.bind(this))
        }

    }

    async _updateDataActive() {
        // mengambil tipe icon nya apa, favorite, like, atau notification
        // melakukan update pada tabel yang sesuai dengan tipe icon nya
        // update dilakukan pada userID yang sedang aktif
        // WHERE dilakukan update sesuai contentType yang sedang di klik dan contentID nya
        try {
            if (this.props.type == 'favorite') {
                var userFavoriteData = new tbUserFavoriteData().getCurrentJSON();
                userFavoriteData.fContentType = this.props.contentType;
                userFavoriteData.fContentKey = this.props.contentKey;

                userFavoriteData.UserKey = this.currentUser;

                await tbVUserFavoriteAPI.addUserFavorite(userFavoriteData);
                this.setState({ active: 'Y' });

            }
            if (this.props.type == 'like') {

                await tbVUserLikeAPI.addUserLike(this.props.likePackage);
                this.setState({ active: 'Y' });
                if (this.props.refreshLikeCounter) this.props.refreshLikeCounter('Y');

                if (this.props.likeMallGetReward) await this.props.likeMallGetReward()
                if (this.props.likeTenantGetReward) await this.props.likeTenantGetReward()

            }
            if (this.props.type == 'notification') {
                var userNotificationSettingsData = new tbUserNotificationSettingsData().getCurrentJSON();
                userNotificationSettingsData.fContentType = this.props.contentType;
                userNotificationSettingsData.fContentKey = this.props.contentKey;
                userNotificationSettingsData.UserKey = this.currentUser;

                await tbVUserNotificationSettingsAPI.addUserNotificationSettingsOn(userNotificationSettingsData);
                this.setState({ active: 'Y' });


            }
        } catch (error) {
            SGHelperErrorHandling.Handling(error, this._updateDataActive.bind(this))
        }

    }

    async _updateDataInactive() {
        // mengambil tipe icon nya apa, favorite, like, atau notification
        // melakukan update pada tabel yang sesuai dengan tipe icon nya
        // update dilakukan pada userID yang sedang aktif
        // WHERE dilakukan update sesuai contentType yang sedang di klik dan contentID nya
        var arrFilter = [
            { name: 'fContentType', operator: '=', value: this.props.contentType },
            { name: 'fContentKey', operator: '=', value: this.props.contentKey },
            { name: 'fActive', operator: '=', value: 'Y' },
        ]
        var arrFilterCek = [
            { name: 'fContentType', operator: '=', value: this.props.contentType },
            { name: 'fContentKey', operator: '=', value: this.props.contentKey },
            { name: 'fActive', operator: '=', value: 'N' },
        ]
        if (this.props.type == 'favorite') {
            var userFavoriteData = new tbUserFavoriteData().getCurrentJSON();
            userFavoriteData.fContentType = this.props.contentType;
            userFavoriteData.fContentKey = this.props.contentKey;
            userFavoriteData.UserKey = this.currentUser;
            try {
                await tbVUserFavoriteAPI.addUserUnfavorite(userFavoriteData);
                this.setState({ active: 'N' });
            } catch (error) {
                console.log(error)
            }

            // await tbVUserFavoriteAPI.changeUserFavoriteInactive(arrFilter, []);
        }
        if (this.props.type == 'like') {
            try {
                await tbVUserLikeAPI.addUserUnlike(this.props.likePackage);
                this.setState({ active: 'N' });
                if (this.props.refreshLikeCounter) this.props.refreshLikeCounter('N');
            } catch (error) {
                console.log(error)
            }
        }
        if (this.props.type == 'notification') {
            var userNotificationSettingsData = new tbUserNotificationSettingsData().getCurrentJSON();
            userNotificationSettingsData.fContentType = this.props.contentType;
            userNotificationSettingsData.fContentKey = this.props.contentKey;
            userNotificationSettingsData.UserKey = this.currentUser;
            try {
                await tbVUserNotificationSettingsAPI.addUserNotificationSettingsOff(userNotificationSettingsData);
                this.setState({ active: 'N' });
            } catch (error) {
                console.log(error)
            }

        }
    }

    async _iconPressed() {
        if (this.anonymousMode) {
            SGDialogBox.showAction(null, SGLocalize.translate("AnonymousAlert.title"), SGLocalize.translate("AnonymousAlert.message"), SGLocalize.translate("AnonymousAlert.signUpButton"), () => { SGHelperNavigation.navigatePush(this.props.navigator, 'SignUp') }, SGLocalize.translate("AnonymousAlert.signInButton"), () => { SGHelperNavigation.navigatePush(this.props.navigator, 'SignIn') }, true)
        } else {
            this.setState({ loading: true })
            if (this.props.type === 'notification' || this.props.type === 'favorite') {
                console.log(this.props.type)
                if (this.state.active === 'Y') {

                    await this._updateDataInactive();

                    // memanggil function updateData yang sesuai dengan tipe nya untuk mendelete dari tabel

                }
                else if (this.state.active === 'N') {

                    await this._updateDataActive();

                    // this._addData();
                    // // memanggil function updateData yang sesuai dengan tipe nya untuk menambah data ke tabel

                }

            }

            if (this.props.type === 'like') {
                if (this.state.active === 'Y') {
                    await this._updateDataInactive();
                    // memanggil function updateData yang sesuai dengan tipe nya untuk mendelete dari tabel
                }
                else if (this.state.active === 'N') {
                    await this._updateDataActive();
                    // this._addData();
                    // memanggil function updateData yang sesuai dengan tipe nya untuk menambah data ke tabel
                }
            }

            if (this.props.type === 'comment') {
                if (this.currentUser) {
                    if (this.props.canComment === 'Y') {
                        this.onShowHandler(this.pvID1);
                    }
                    else {
                        if (this.props.commentPackage.fTargetType === 'Place')
                            SGDialogBox.showFail(null, 'Fail', 'This Place locks the comment feature', 'OK', () => { }, true)
                        if (this.props.commentPackage.fTargetType === 'Store')
                            SGDialogBox.showFail(null, 'Fail', 'This Store locks the comment feature', 'OK', () => { }, true)
                        if (this.props.commentPackage.fTargetType === 'Resto')
                            SGDialogBox.showFail(null, 'Fail', 'This Resto locks the comment feature', 'OK', () => { }, true)
                    }
                }
                else {
                    this.onShowHandler(this.pvID2);
                }

                // this.props.onCommentPress(this.props.pvID1);
            }

            if (this.props.type === 'share') {
                this._addData();
                var fContentType = this.props.contentType
                var fContentKey = this.props.contentKey
                var url = SGHelperGlobalVar.getVar('UriScheme2');

                var targetKey = this.props.targetKey;
                // var message = 'One Stop Solution For Your Mall 4.0 Experience!\n\nBe the first to get a complete access to all information and promotion from your favourite malls.\nDownload Spotgue App\nhttp://spotgue.app.link/AL76TKSvibb'
                var message = this.props.shareMessage;
                switch (fContentType) {
                    case 'Place':
                        url = url + 'building/' + fContentKey;
                        message = message + ' ' + url;
                        break;
                    case 'Store':
                        url = url + 'store/' + fContentKey;
                        message = message + ' ' + url;
                        break;
                    case 'Resto':
                        url = url + 'resto/' + fContentKey;
                        message = message + ' ' + url;
                        break;
                    case 'facility':
                        url = url + 'facility/' + fContentKey;
                        message = message + ' ' + url;
                        break;
                    case 'PlaceEvent':
                        url = url + 'eventbuilding/' + fContentKey;
                        message = message + ' ' + url;
                        break;
                    case 'StorePromo':
                        url = url + 'eventstore/' + fContentKey;
                        message = message + ' ' + url;
                        break;
                    case 'RestoPromo':
                        url = url + 'eventresto/' + fContentKey;
                        message = message + ' ' + url;
                        break;
                    case 'StoreProduct':
                        url = url + 'productstore/' + fContentKey + '/' + targetKey;
                        message = message + ' ' + url;
                        break;
                    case 'RestoMenu':
                        url = url + 'productresto/' + fContentKey + '/' + targetKey;
                        message = message + ' ' + url;
                        break;
                    case 'WhereToGo':
                        url = url + 'building/' + fContentKey;
                        message = message + ' ' + url;
                        break;
                    case 'StoreWhatToGift':
                        url = url + 'storewhattogift/' + fContentKey;
                        message = message + ' ' + url;
                        break;
                    case 'RestoWhatToGift':
                        url = url + 'restowhattogift/' + fContentKey;
                        message = message + ' ' + url;
                        break;
                    case 'ClothToBuy':
                        url = url + 'clothtobuy/' + fContentKey;
                        message = message + ' ' + url;
                        break;
                    case 'WhatToEat':
                        url = url + 'whattoeat/' + fContentKey;
                        message = message + ' ' + url;
                        break;



                }

                Share.share({
                    subject: 'Spotgue Share!',
                    title: 'Share Spotgue!',
                    message: message,
                }, {
                    // Android only:
                    dialogTitle: 'Share BAM goodness',
                    // iOS only:
                })
                // memanggil function lagi untuk melakukan share
            }
            this.setState({ loading: false })
        }
    }

    _getListOfOptions() {
        return {
            like: { icon: image.likeInactiveIcon[this.imageSetting].url, iconActive: image.likeActiveIcon[this.imageSetting].url, title: SGLocalize.translate("cardIconButton.like") },
            favorite: { icon: image.favoritesInactiveIcon[this.imageSetting].url, iconActive: image.favoritesActiveIcon[this.imageSetting].url, title: SGLocalize.translate("cardIconButton.favorite") },
            notification: { icon: image.notificationInactiveIcon[this.imageSetting].url, iconActive: image.notificationActiveIcon[this.imageSetting].url, title: SGLocalize.translate("cardIconButton.notification") },
            comment: { icon: image.commentIcon[this.imageSetting].url, iconActive: image.commentIcon[this.imageSetting].url, title: SGLocalize.translate("cardIconButton.comment") },
            share: { icon: image.shareIconBlack[this.imageSetting].url, iconActive: image.shareIconBlack[this.imageSetting].url, title: SGLocalize.translate("cardIconButton.share") },
        }
    }
    render() {
        // var { w, h, p } = this.whp;
        var style = this.style;
        var options = this._getListOfOptions();
        this.style.mainView = SGHelperStyle.appendStyle(this.style.mainView, this.props.customStyle);
        return (
            <View accessible={true} accessibilityLabel={'CardIconButtonRootView'} style={style.mainView}>
                <TouchableOpacity style={style.mainView} onPress={this._iconPressed.bind(this)}>
                    {
                        this.state.loading ?
                            <View style={style.viewLoading}><SGActivityIndicator style={style.loading}></SGActivityIndicator></View>
                            :
                            <Image accessible={true} accessibilityLabel={this.props.type} style={style.icon} source={{ uri: (this.state.active === 'Y') ? options[this.props.type].iconActive : options[this.props.type].icon }} ></Image>
                    }

                </TouchableOpacity>
                {/* <Text accessible={true} accessibilityLabel={'CardIconButtonTextPresetType'} hidden={this.props.hideText ? this.props.hideText : false} preset={this.props.textPreset ? this.props.textPreset : Text.preset.h10} style={style.title}>{options[this.props.type].title}</Text> */}
                {/* {this.textMode === 'off' ? (null) : (<Text preset={Text.preset.h10} style={style.title}>{options[this.props.type].title}</Text>)}
                {this.textMode === 'import' ? (<Text preset={Text.preset.h10} style={style.title}>{this.props.importText}</Text>) : (null)} */}
                <SGPopView accessible={true} accessibilityLabel={'CardIconButtonSGPopView1'} vPos={'Top'} modal popViewID={this.pvID2}>
                    <PleaseRegisterPopup accessible={true} accessibilityLabel={'CardIconButtonRegisterPopup'} navigator={this.props.navigator} contentType={this.props.contentType} contentKey={this.props.contentKey} popViewID={this.pvID2} style={style.throwWHP}></PleaseRegisterPopup>
                </SGPopView>
                <SGPopView accessible={true} accessibilityLabel={'CardIconButtonSGPopView2'} vPos={'Top'} modal popViewID={this.pvID1}>
                    <CommentPopup accessible={true} accessibilityLabel={'CardIconButtonCommentPopup'} commentPackage={this.props.commentPackage} contentType={this.props.contentType} contentKey={this.props.contentKey} popViewID={this.pvID1} style={style.throwWHP}></CommentPopup>
                </SGPopView>
            </View>
        );
    }
}