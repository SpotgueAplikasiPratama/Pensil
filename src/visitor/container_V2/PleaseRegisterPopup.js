import React from 'react';
import { SGBaseContainer } from "../../core/container/SGBaseContainer";
import { SGView as View, SGButton as Button, SGText as Text, SGImage as Image, SGTextInput as TextInput, SGTouchableOpacity as TouchableOpacity, SGPopView } from '../../core/control';
import { StyleSheet } from 'react-native';
import image from '../asset/image';
import { SGLocalize } from '../locales/SGLocalize';
import { SGHelperGlobalVar, SGHelperStyle, SGHelperNavigation } from '../../core/helper';
import { tbLookupDAO } from '../db/tbLookupDAO';
import { CommentForm } from '../form_V2/CommentForm';

export class PleaseRegisterPopup extends SGBaseContainer {

    createStyleSheet = (whp) => {
        var { w, h, p } = whp;
        return StyleSheet.create({
            mainView1: { marginVertical: p, width: (w * 0.675), justifyContent: 'center', borderRadius: 3 * p, borderWidth: w * 0.001, borderColor: 'rgb(100,100,100)', elevation: 1, shadowOpacity: 0.085, padding: p, marginBottom: 4 * p, backgroundColor: 'white' },
            throwWHP: { width: w, height: h, padding: p },
            iconClose: { width: w * 0.05, height: w * 0.05, alignSelf: 'flex-end', backgroundColor: 'white' },
            buttonCancel: { color: '#7a7a7a' },
            buttonSend: { color: '#63aee0' },
            // iconClose: { fontSize: w * 0.07, alignSelf: 'flex-end', color: 'red' },
            // emotContainer: { padding: p, flexDirection: 'row-reverse', justifyContent: 'space-evenly', width: (w * 0.5), marginBottom: 3 * p },
            // emoticon: { backgroundColor: 'white', height: w * 0.13, width: w * 0.13 },
            // text1: { color: '#606060', marginVertical: 3 * p, },
            // text2: { color: '#909090' },
            // commentBox: { height: w * 0.5, width: w * 0.55, borderRadius: 0 },
            // // emoticonInactive: { fontSize: w * 0.2, color: 'black', opacity: 0.45 },
            // // emoticonActive: { fontSize: w * 0.2, color: 'green', opacity: 0.45 },
            // inputView2: { alignSelf: 'center', width: (w - 2 * p) * 0.575, height: w * 0.55, justifyContent: 'center', alignItems: 'flex-start', marginVertical: w * 0.02 },
            buttonView: { flexDirection: 'row', justifyContent: 'space-between', width: (w * 0.575) },
            // inputView1: { height: w * 0.5, width: w * 0.5 },
        });
    }

    constructor(props, context, ...args) {
        super(props, context, ...args);
        this.whp = { w: props.style.width, h: props.style.height, p: props.style.padding }
        this.style = this.createStyleSheet(this.whp);
        this.title = props.title;
        this.currentUser = SGHelperGlobalVar.getVar('GlobalCurrentUser');
        this.imageSetting = SGHelperGlobalVar.getVar('GlobalImageSetting');
    }

    onCloseHandler() {
        SGPopView.hidePopView(this.props.popViewID);
    }

    onLoginPress() {
        this.onCloseHandler();
        SGHelperNavigation.navigatePush(this.props.navigator, 'SignIn', { showHeader: true })
    }

    onRegisterPress() {
        this.onCloseHandler();
        SGHelperNavigation.navigatePush(this.props.navigator, 'SignUp', { showHeader: true })
    }

    render() {
        var { w, h, p } = this.whp;
        var style = this.style;
        return (
            <View accessible={true} accessibilityLabel={'PleaseRegisterPopupRootView'} style={style.mainView1}>
                <TouchableOpacity style={style.iconClose} onPress={this.onCloseHandler.bind(this)}>
                    <Image accessible={true} accessibilityLabel={'PleaseRegisterPopupCloseIcon'} style={style.iconClose} source={{ uri: image.closeButton[this.imageSetting].url }}></Image>
                </TouchableOpacity>
                <View>
                </View>
                <Text>{SGLocalize.translate('PleaseRegisterPopup.mainText')}</Text>
                <TouchableOpacity onPress={this.onLoginPress.bind(this)}>
                    <Text>{SGLocalize.translate('PleaseRegisterPopup.loginText')}</Text>
                </TouchableOpacity>
                <Text>{SGLocalize.translate('PleaseRegisterPopup.orText')}</Text>
                <TouchableOpacity onPress={this.onRegisterPress.bind(this)}>
                    <Text>{SGLocalize.translate('PleaseRegisterPopup.registerText')}</Text>
                </TouchableOpacity>
            </View>
        );
    }
}
