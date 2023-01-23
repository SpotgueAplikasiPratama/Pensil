/**
 * 1. Yohanes 01 April 2021
 * - add ErrorHandling
 */
import React from "react";
import { StyleSheet } from "react-native";
import { SGBaseScreen } from '../../../core/screen/SGBaseScreen';
import { SGView as View, SGButton as Button, SGText as Text, SGRootScrollView as SGRootScrollView, SGDialogBox as DialogBox, SGRootView, SGScrollView as ScrollView, SGTextInput as TextInput } from '../../../core/control';
import { SpotgueSignHeader } from '../../container_V2/SpotgueSignHeader';
import { SGLocalize } from '../../locales/SGLocalize';
import image from '../../asset/image';
import { SGHelperNavigation } from '../../../core/helper';
import { SGHelperGlobalVar } from '../../../core/helper';
import { SGHelperType } from '../../../core/helper';
import { CustomMenuBar } from '../../component_V2/CustomMenuBar';

export class VerifyOldPasswordScreen extends SGBaseScreen {
    createStyleSheet = (whp) => {
        var { w, h, p } = whp;
        var headerHeight = this._screenWHPNoHeader.h - this._screenWHP.h;
        return StyleSheet.create({
            mainView1: { width: w, justifyContent: 'flex-start', backgroundColor: '#FFFFFF' },
            signHeader: { marginTop: p },
            sv1_2: { width: w, padding: p, justifyContent: 'flex-start', backgroundColor: 'white' },
            throwWHP: { width: w, height: h, padding: p },
            containerView1: { width: (w - 2 * p), height: h, padding: p },
            headerMargin1: { marginBottom: (w - 2 * p) * 0.04 },
            text1: { color: '#909090', alignSelf: 'center', marginHorizontal: w * 0.05, marginTop: 3 * p, },
            text2: { fontSize: w * 0.03, color: 'black', opacity: 0.6 },
            textButton1: { fontSize: w * 0.05, color: 'white' },
            inputView1: { width: w - 2 * p, height: w * 0.13, alignItems: "center", justifyContent: 'center', padding: p, marginVertical: w * 0.02 },
        });
    };

    componentDidMount() {
        this._refreshData();
        this._unsubscribe = this.props.navigation.addListener('focus', async () => {
            this._refreshData();
        });
    }

    _componentWillUnmount() {
        if (this._unsubscribe) { this._unsubscribe(); }
    }

    _refreshData() {
        this.passwordConfirmation = '';
        this.currentUserData = SGHelperGlobalVar.getVar('GlobalCurrentUserData');
        this.imageSetting = SGHelperGlobalVar.getVar('GlobalImageSetting');
        this.forceUpdate();
    }

    constructor(props, context, ...args) {
        super(props, context, ...args);
        this.style = this.createStyleSheet(this.WHP);
        this.props.navigation.setOptions({
            headerShown: false,
        });
        this.passwordConfirmation = '';
        this.currentUserData = SGHelperGlobalVar.getVar('GlobalCurrentUserData');
        this.imageSetting = SGHelperGlobalVar.getVar('GlobalImageSetting');
        this.state = { passwordInput: '' };
    }

    _onSubmitPress() {
        if (this.state.passwordInput !== '') {
            if (this.currentUserData.fPassword === SGHelperType.encrypt(this.state.passwordInput)) {
                SGHelperNavigation.navigatePopPush(this.props.navigation, 'ChangePasswordProfileScreen')
            }
            else {
                DialogBox.showFail(null, SGLocalize.translate('globalText.FailText'), SGLocalize.translate('VerifyOldPasswordScreen.wrongPasswordAlert'), SGLocalize.translate('globalText.ok'))
            }
        }
        else {
            DialogBox.showFail(null, SGLocalize.translate('globalText.FailText'),  SGLocalize.translate('VerifyOldPasswordScreen.mustFillAlert'), SGLocalize.translate('globalText.ok'))
        }
    }

    render() {
        var { w, h, p } = this.WHP;
        var style = this.style;

        return (
            <SGRootView dummyStatusBar accessible={true} accessibilityLabel={'VerifyOldPasswordScreenRootScrollView'} style={style.mainView1} contentContainerStyle={style.sv1_2}>
                <CustomMenuBar btnBack accessible={true} accessibilityLabel={'HomeScreenHeader'} currentUser={this.currentUser} navigator={this.props.navigation} imageSetting={this.imageSetting} style={style.throwWHP}></CustomMenuBar>
                <ScrollView dummyHeaderBar dummyFooterBar dummyBottomBar accessible={true} accessibilityLabel={'HomeScreenFavScrollView'} contentContainerStyle={{ alignItems: 'center' }} showsVerticalScrollIndicator={false}>
                    <SpotgueSignHeader accessible={true} accessibilityLabel={'VerifyOldPasswordScreenSGSignHeader'} image={image.logoSpotgueHeader[this.imageSetting].url} text={SGLocalize.translate('VerifyOldPasswordScreen.Title')} style={style.signHeader}></SpotgueSignHeader>
                    <TextInput style={{ marginVertical: 12 * p }} preset={TextInput.preset.default} accessible={true} accessibilityLabel={'AddEmailFormConfirmPassTextInput'} shadow dataType={TextInput.dataType.password} onValueChange={(v) => { this.setState({ passwordInput: v }) }} placeholder={SGLocalize.translate('VerifyOldPasswordScreen.PlaceholderCurrentPassword')} />
                    <Button accessible={true} accessibilityLabel={'VerifyOldPasswordScreenSubmitButton'} onPress={() => { this._onSubmitPress() }} label={SGLocalize.translate('VerifyOldPasswordScreen.Button')}></Button>
                </ScrollView>
            </SGRootView>
        );
    }
}
