/**
 * Version 1.2.0
 * 1. Yohanes April 01 2021
 * - add Error Handling
 */
import React from 'react';
import { StyleSheet, } from 'react-native';
import { SGBaseScreen } from '../../../core/screen/SGBaseScreen';
import { SGTouchableOpacity as TouchableOpacity, SGButton as Button, SGText as Text, SGView as View, SGRootScrollView, SGOTPInput as OTPInputView, SGDialogBox as DialogBox, SGImage as Image } from '../../../core/control';
import { SGHelperNavigation, SGHelperGlobalVar ,SGHelperType, SGHelperErrorHandling} from '../../../core/helper';
import { SGLocalize } from '../../locales/SGLocalize';
import image from '../../asset/image';
import { tbCOTPUserAPI } from '../../api/tbCOTPUserAPI';
import { BackButton } from '../../component_V2/BackButton';

export class VerifyOTPForgotPasswordScreen extends SGBaseScreen {
    createStyleSheet() {
        var { w, h, p } = this._screenWHP;

        return StyleSheet.create({
            mainView1: { width: w, justifyContent: 'flex-start', backgroundColor: 'white' },
            headerView: { flexDirection: 'row', width: w - 16 * p, justifyContent: 'space-between', alignSelf: 'center' },
            sv1_2: { width: w, justifyContent: 'flex-start', backgroundColor: 'white' },
            logo: { backgroundColor: 'transparent', alignSelf: 'flex-end', marginTop: 8 * p, marginBottom: 6 * p },
            throwWHP: { width: w, height: h, padding: p },
            text1: { color: '#909090', marginHorizontal: 2 * p, marginVertical: 3 * p },
            text2: { color: '#909090', marginTop: 3 * p, textAlign: 'center', },
            text3: { textAlign: 'center', color: '#63aee0', },
            button1: { backgroundColor: '#465056', marginTop: 4 * p, width: w * 0.425, height: w * 0.125, justifyContent: "center", alignSelf: "center", alignItems: "center", borderRadius: p * 10, shadowOpacity: 0.15, shadowRadius: 0.5 * p },
            inactiveOTPField: { padding: p, backgroundColor: 'white', borderRadius: 3 * p, fontSize: w * 0.1, color: "black", },
            activeOTPField: { padding: p, backgroundColor: 'white', borderColor: 'red', borderRadius: 3 * p, fontSize: w * 0.1, color: "black", },
        });
    }

    async componentDidMount() {
        await this._onRefreshItem()
    }

    async _onRefreshItem(){
        SGHelperGlobalVar.addVar("otpDate", new Date());
        this.counter = this.counter+1
        try {
            if (this.selectedTab == 0 && this.userData.fEmail !== '') {
                this.OTPCode = await tbCOTPUserAPI.addOTPUser(this.userData.fEmail, 'Email',this.counter);
            }
            if (this.selectedTab == 1 && this.userData.fPhoneNumber !== '') {
                // this.OTPCode = await tbCOTPUserAPI.addOTPUser(this.userData.fPhoneNumber, 'SMS',this.counter);
                this.OTPCode = await tbCOTPUserAPI.addOTPUser(this.userData.fPhoneNumber, 'Whatsapp',this.counter);
            }
            console.log(this.OTPCode);
            this.setState({timer:30})
            this.interval = setInterval(
                () => this.setState((prevState) => ({ timer: prevState.timer - 1 })),
                1000
            );
        } catch (error) {
            SGHelperErrorHandling.Handling(error,this._onRefreshItem.bind(this))
        }

        this.forceUpdate();
    }


    componentDidUpdate() {
        if (this.state.timer === 0) {
            clearInterval(this.interval);
        }
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    constructor(props, context, ...args) {
        super(props, context, ...args);
        this.style = this.createStyleSheet();
        this.props.navigation.setOptions({
            headerShown: false,
        });
        this.state = {
            timer: 30,
            otp: '',
        };
        this.counter=-1
        this.userData = this.props.route.params.data.getCurrentJSON();
        this.fUserID = this.userData.fUserID;
        this.selectedTab = this.props.route.params.selectedTab;
        this.imageSetting = SGHelperGlobalVar.getVar('GlobalImageSetting');
        console.log('VerifyOTPForgotPasswordScreen')
    }

    async _onResendEmailPress(){
        SGHelperGlobalVar.addVar("otpDate", new Date());
        this.counter = this.counter+1
        try {
            this.dbIDOTP = DialogBox.showLoading(SGLocalize.translate('AlertMessage.Waiting'));
            if (this.selectedTab == 0 && this.userData.fEmail !== '') {
                this.OTPCode = await tbCOTPUserAPI.addOTPUser(this.userData.fEmail, 'Email',this.counter);
            }
            DialogBox.hideDialogBox(this.dbIDOTP, true);  
            console.log(this.OTPCode);
            this.setState({timer:30})
            this.interval = setInterval(
                () => this.setState((prevState) => ({ timer: prevState.timer - 1 })),
                1000
            );
        } catch (error) {
            DialogBox.hideDialogBox(this.dbIDOTP, true);  
            SGHelperErrorHandling.Handling(error,this._onResendEmailPress.bind(this))
        }

        this.forceUpdate();
    }

    async _onResendWaOrSmsPress(type){
        SGHelperGlobalVar.addVar("otpDate", new Date());
        this.counter = this.counter+1
        try {
            this.dbIDOTP = DialogBox.showLoading(SGLocalize.translate('AlertMessage.Waiting'));
            if (this.selectedTab == 1 && this.userData.fPhoneNumber !== '') {
                if(type === 'whatsapp'){
                     this.OTPCode = await tbCOTPUserAPI.addOTPUser(this.userData.fPhoneNumber, 'Whatsapp',this.counter);
                }else{
                    this.OTPCode = await tbCOTPUserAPI.addOTPUser(this.userData.fPhoneNumber, 'SMS',this.counter);
                }
            }
            DialogBox.hideDialogBox(this.dbIDOTP, true);  
            console.log(this.OTPCode);
            this.setState({timer:30})
            this.interval = setInterval(
                () => this.setState((prevState) => ({ timer: prevState.timer - 1 })),
                1000
            );
        } catch (error) {
            DialogBox.hideDialogBox(this.dbIDOTP, true);  
            SGHelperErrorHandling.Handling(error,this._onResendWaOrSmsPress.bind(type))
        }

        this.forceUpdate();
    }

    _onSubmitPress() {
        if (this.state.otp == this.OTPCode) {
            SGHelperNavigation.navigate(this.props.navigation, 'ForgotPasswordChangePassword', { data: this.props.route.params.data, selectedTab: this.selectedTab })
        }
        else {
            DialogBox.showFail(null, SGLocalize.translate('VerifyOTPForgotPasswordScreen.alertVerifyTitle'), SGLocalize.translate('VerifyOTPForgotPasswordScreen.alertVerifyText'), SGLocalize.translate('globalText.ok'));
        }
    }
    render() {
        var { w, h, p } = this.WHP;
        var style = this.style;

        return (
            <SGRootScrollView accessible={true} accessibilityLabel={'VerifyOTPForgotPasswordScreenRootScrollView'} style={style.mainView1} contentContainerStyle={style.sv1_2}>
                <View style={style.headerView}>
                    <BackButton color={'black'} hidden={!SGHelperNavigation.canGoBack(this.props.navigation)} imageSetting={this.imageSetting} navigator={this.props.navigation}></BackButton>
                    <Image source={{ uri: image.magLogoOnly[this.imageSetting].url }} style={style.logo}></Image>
                </View>
                <Text preset={Text.preset.titleH1B} style={style.text1}>{SGLocalize.translate("VerifyOTPSignUpScreen.headerTitle")}</Text>
                <Text preset={Text.preset.titleH3} style={style.text2}>{SGLocalize.translate("VerifyOTPSignUpScreen.text1_1")} {this.selectedTab == 0 ? (this.userData.fEmail) : (this.userData.fPhoneNumber)}</Text>
                <OTPInputView accessible={true} accessibilityLabel={'VerifyOTPSignUpScreenOTPInput'}
                    shadow
                    pinCount={4}
                    // code={this.state.code} //You can supply this prop or not. The component will be used as a controlled / uncontrolled component respectively.
                    // onCodeChanged = {code => { this.setState({code})}}
                    autoFocusOnLoad
                    codeInputFieldStyle={style.inactiveOTPField}
                    codeInputHighlightStyle={style.activeOTPField}
                    onCodeFilled={(otp) => { this.setState({ otp }) }}
                    style={{ marginTop: 10 * p, marginBottom: 8 * p }}
                />
                <Button accessible={true} accessibilityLabel={'VerifyOTPSignUpScreenSubmitButton'} textPreset={Text.preset.titleH3B} style={style.button1} label={SGLocalize.translate("VerifyOTPSignUpScreen.buttonSubmit")} onPress={this._onSubmitPress.bind(this)}></Button>
                <Text accessible={true} accessibilityLabel={'VerifyOTPSignUpScreenOTPText1'} preset={Text.preset.titleH4} style={style.text2}>{SGLocalize.translate("VerifyOTPSignUpScreen.text2_1")} {this.state.timer} {SGLocalize.translate("VerifyOTPSignUpScreen.text2_2")}</Text>
                {this.state.timer === 0 ?
                this.selectedTab === 0 ?
                <TouchableOpacity onPress={this._onResendEmailPress.bind(this)}>
                    <Text accessible={true} accessibilityLabel={'VerifyOTPSignUpScreenOTPText2'} preset={Text.preset.titleH5B} style={style.text3}>{SGLocalize.translate("VerifyOTPSignUpScreen.text3")}</Text>
                </TouchableOpacity> 
                :
                <View style={{flexDirection:'row'}}>
                    {/* <TouchableOpacity onPress={() => {this._onResendWaOrSmsPress('sms')}}>
                        <Text accessible={true} preset={Text.preset.titleH5B} style={style.text3}>{SGLocalize.translate("VerifyOTPSignUpScreen.text3") + ' '+ 'SMS'}</Text>
                    </TouchableOpacity>  */}
                    <TouchableOpacity onPress={() => {this._onResendWaOrSmsPress('whatsapp')}}>
                        <Text accessible={true} preset={Text.preset.titleH5B} style={style.text3}>{SGLocalize.translate("VerifyOTPSignUpScreen.text3") + ' '+ 'Whatsapp'}</Text>
                    </TouchableOpacity> 
                </View>
                : null
                }
            </SGRootScrollView>
        );
    }
}
