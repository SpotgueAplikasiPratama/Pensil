/**
 * Version 1.3.0
 * 1. Yohanes 03 May 2021
 * -add ErrorHandling
 */
import React from "react";
import { StyleSheet } from "react-native";
import { SGView as View, SGText as Text, SGImage as Image, SGIcon as Icon, SGIconButton as IconButton, SGButton as Button, SGPopView,SGDialogBox } from "../../core/control";
import { SGBaseContainer } from '../../core/container/SGBaseContainer';
import { SGHelperErrorHandling, SGHelperGlobalVar, SGHelperStyle } from '../../core/helper';
import { SGLocalize } from "../locales/SGLocalize";
import { PleaseRegisterPopup } from '../container_V2/PleaseRegisterPopup';
import { tbVUserCheckInAPI } from '../api/tbVUserCheckInAPI';

export class CheckOutButton extends SGBaseContainer {
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
            button: { width: w * 0.3, height: w * 0.13, justifyContent: 'center', borderRadius: p * 5.5 },
        });
    }

    constructor(props, context, ...args) {
        super(props, context, ...args);
        this.style = this.createStyleSheet();
        this.pvID1 = SGPopView.getPopViewID();
        this.pvID2 = SGPopView.getPopViewID();
        this.currentUser = SGHelperGlobalVar.getVar('GlobalCurrentUser');
    }

    async _iconPressed() {
        try {
            this.dbID2 = SGDialogBox.showLoading(SGLocalize.translate('AlertMessage.Waiting'));
            await tbVUserCheckInAPI.ChangeUserCheckInInactive(this.props.contentKey);
            this.props.refreshCheckOut();
            SGDialogBox.hideDialogBox(this.dbID2, true);
        } catch (error) {
            SGDialogBox.hideDialogBox(this.dbID2, true);
            SGHelperErrorHandling.Handling(error,this._iconPressed.bind(this))
        }
    }

    render() {
        var style = this.style;
        this.style.mainView = SGHelperStyle.appendStyle(this.style.mainView, this.props.style);
        return (
            <View accessible={true} accessibilityLabel={'CheckOutButtonRootView'} style={style.mainView}>
                <Button accessible={true} accessibilityLabel={'CheckOutButtonIcon'} preset={Button.preset.red} shadow textPreset={Text.preset.titleH3B} style={style.button} label={SGLocalize.translate("mallHomeScreen.buttonCheckOut")} onPress={this._iconPressed.bind(this)}></Button>
            </View>
        )
    }
}

