/**
 * Version 1.3.0
 * 1. Yohanes 03 May 2021
 * -add ErrorHandling
 */
import React from "react";
import { StyleSheet } from "react-native";
import { SGView as View, SGText as Text, SGImage as Image, SGIcon as Icon, SGIconButton as IconButton, SGButton as Button, SGPopView, SGDialogBox } from "../../core/control";
import { SGBaseContainer } from '../../core/container/SGBaseContainer';
import { SGHelperGlobalVar, SGHelperStyle, SGHelperNavigation, SGHelperErrorHandling } from '../../core/helper';
import { SGLocalize } from "../locales/SGLocalize";
import { tbUserCheckInData } from '../db/tbUserCheckInDAO';
import { tbVUserCheckInAPI } from '../api/tbVUserCheckInAPI';

export class CheckInButtonSmall extends SGBaseContainer {
    createStyleSheet() {
        var { w, h, p } = this._screenWHP;
        if (this.props.style) {
            if (this.props.style.width) w = this.props.style.width;
            if (this.props.style.height) h = this.props.style.height;
            if (this.props.style.padding) p = this.props.style.padding;
        }
        return StyleSheet.create({
            throwWHP: { width: this._screenWHP.w, height: this._screenWHP.h, padding: this._screenWHP.p, backgroundColor: 'white' },
            mainView: {},
            button: { width: w * 0.26, height: w * 0.11, justifyContent: 'center', borderRadius: p * 5.5 },
            title: { color: '#ffffff', textAlign: 'center' }
        });
    }

    constructor(props, context, ...args) {
        super(props, context, ...args);
        this.style = this.createStyleSheet();
        this.pvID1 = SGPopView.getPopViewID();
        this.pvID2 = SGPopView.getPopViewID();
        this.currentUser = SGHelperGlobalVar.getVar('GlobalCurrentUser');
        this.anonymousMode = SGHelperGlobalVar.getVar('GlobalAnonymous');
    }
    async _addUserCheckIn(userCheckInData){
        try {
            await tbVUserCheckInAPI.addUserCheckIn(userCheckInData);
                
            if (this.props.checkInReward) await this.props.checkInReward()
            await this.props.refresh();
            SGDialogBox.hideDialogBox(this.dbID2, true);
        } catch (error) {
            SGDialogBox.hideDialogBox(this.dbID2, true);
            SGHelperErrorHandling.Handling(error,this._addUserCheckIn.bind(this,userCheckInData))
        }
        
    }
    async _iconPressed() {

        if (this.anonymousMode) {
            SGDialogBox.showAction(null, SGLocalize.translate("AnonymousAlert.title"), SGLocalize.translate("AnonymousAlert.message"), SGLocalize.translate("AnonymousAlert.signUpButton"), () => { SGHelperNavigation.navigatePush(this.props.navigator, 'SignUp') }, SGLocalize.translate("AnonymousAlert.signInButton"), () => { SGHelperNavigation.navigatePush(this.props.navigator, 'SignIn') }, true)
        }
        else {
            if (this.currentUser) {
                var userCheckInData = new tbUserCheckInData().getCurrentJSON();
                userCheckInData.fID = null;
                userCheckInData.fUserKey = this.currentUser;
                userCheckInData.fCreatedBy = this.currentUser;
                userCheckInData.fLastModifiedBy = this.currentUser;
                userCheckInData.fContentType = this.props.contentType;
                userCheckInData.fContentKey = this.props.contentKey;
                this.dbID2 = SGDialogBox.showLoading(SGLocalize.translate('AlertMessage.Waiting'));
                await this._addUserCheckIn(userCheckInData)
            }
        }
    }

    render() {
        var style = this.style;
        this.style.mainView = SGHelperStyle.appendStyle(this.style.mainView, this.props.style);
        return (
            <View accessible={true} accessibilityLabel={'CheckInButtonRootView'} style={style.mainView}>
                <Button accessible={true} accessibilityLabel={'CheckInButtonIcon'} preset={Button.preset.green} shadow textPreset={Text.preset.heading9B} style={style.button} label={SGLocalize.translate("mallHomeScreen.buttonCheckIn")} onPress={this._iconPressed.bind(this)}></Button>
            </View>
        )
    }
}

