/**
 * 1. Yohanes 01 April 2021
 * - add ErrorHandling
 */
import React from 'react';
import { StyleSheet, } from 'react-native';
import { SGBaseScreen } from '../../../core/screen/SGBaseScreen';
import { SGTouchableOpacity as TouchableOpacity, SGButton as Button, SGText as Text, SGView as View, SGRootView as RootView, SGRootScrollView, SGOTPInput as OTPInputView, SGDialogBox as DialogBox, SGImage as Image } from '../../../core/control';
import { SGHelperNavigation, SGHelperGlobalVar, SGHelperType, SGHelperErrorHandling } from '../../../core/helper';
import { SGLocalize } from '../../locales/SGLocalize';
import { BackButton } from '../../component_V2/BackButton';
import image from '../../asset/image';
import { tbCOTPUserAPI } from '../../api/tbCOTPUserAPI';
import { tbVUserAPI } from '../../api/tbVUserAPI';
import { tbSystemParamsDAO } from '../../db/tbSystemParamsDAO';

export class VerifyOTPScreen extends SGBaseScreen {
    createStyleSheet() {
        var { w, h, p } = this._screenWHP;

        return StyleSheet.create({
            mainView1: { width: w, backgroundColor: 'white' },
            headerView: { flexDirection: 'row', width: w - 16 * p, justifyContent: 'space-between', alignSelf: 'center' },
            sv1_2: { width: w, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white' },
            text1: { alignItems: 'center', color: '#909090', marginVertical: 3 * p },
            text2: { color: '#909090', marginTop: 3 * p, textAlign: 'center', },
            text3: { textAlign: 'center', color: '#63aee0', },
            button1: { backgroundColor: '#465056', marginTop: 4 * p, width: w * 0.425, height: w * 0.125, justifyContent: "center", alignSelf: "center", alignItems: "center", borderRadius: p * 10, shadowOpacity: 0.15, shadowRadius: 0.5 * p },
            inactiveOTPField: { padding: p, backgroundColor: 'white', borderRadius: 3 * p, fontSize: w * 0.1, color: "black" },
            activeOTPField: { padding: p, backgroundColor: 'white', borderColor: 'red', borderRadius: 3 * p, fontSize: w * 0.1, color: "black", },
            logo: { backgroundColor: 'transparent', alignSelf: 'flex-end', marginTop: 8 * p, marginBottom: 6 * p },
            titleText: { marginLeft: 12 * p, marginBottom: 4 * p, alignSelf: 'flex-start' },
            bodyText: { marginLeft: 12 * p, alignSelf: 'flex-start', maxWidth: 0.8 * w, color: '#465056' },
        });
    }

    async componentDidMount() {
        console.log('run')
        this.interval = setInterval(
            () => this.setState((prevState) => ({ timer: prevState.timer - 1 })),
            SGHelperType.getSysParamsValueToInt('VerifyOTPScreenInterval1')
        );
        SGHelperGlobalVar.addVar("otpLastVerifyOTPSetting", new Date());
        await this._callAPI()
    }

    componentDidUpdate() {
        if (this.state.timer === 0) {
            clearInterval(this.interval);
        }
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    async _callAPI(){
        this.counter = this.counter+1
        try {
            if (this.contentType === 'email' && this.userData.fEmail !== '') {
                this.OTPCode = await tbCOTPUserAPI.addOTPUser(this.userData.fEmail, 'Email',this.counter);
                console.log('1')
                console.log(this.OTPCode);
            }
            else if (this.contentType === 'phonenumber' && this.userData.fPhoneNumber !== '') {
                this.OTPCode = await tbCOTPUserAPI.addOTPUser(this.userData.fPhoneNumber, 'Whatsapp',this.counter);
                // this.OTPCode = await tbCOTPUserAPI.addOTPUser(this.userData.fPhoneNumber, 'SMS',this.counter);
                console.log('2')
                console.log(this.OTPCode);
            }
           this.forceUpdate()
        } catch (error) {
            SGHelperErrorHandling.Handling(error,this._callAPI.bind(this))
        }

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
        this.counter = -1
        this.userData = this.props.route.params.data.getCurrentJSON();
        this.fUserID = this.userData.fUserID;
        this.contentType = this.props.route.params.contentType;
        console.log('contentType')
        console.log(this.contentType);
        this.imageSetting = SGHelperGlobalVar.getVar('GlobalImageSetting');
    }

    async _onSubmitPress() {
        try {
            if (this.state.otp == this.OTPCode) {
                if (this.contentType === 'email') {
                    var res = await tbVUserAPI.changeEmail(this.userData.fEmail);
                }
                else if (this.contentType === 'phonenumber') {
                    var res = await tbVUserAPI.changePhoneNumber(this.userData.fPhoneNumber);
                }
                if (res === true) {
                    this.userDataSetting = await tbSystemParamsDAO.getUserDataSetting();
                    await tbSystemParamsDAO.updateUserDataSetting(this.userDataSetting, this.userData);
                    this.userDataSetting = await tbSystemParamsDAO.getUserDataSetting();
                    SGHelperGlobalVar.setVar('GlobalCurrentUserData', this.userDataSetting.fValue);

                    if (this.contentType === 'email') {
                        
                        DialogBox.showToast(SGLocalize.translate('ShowToastMessage.SuccessUpdateEmail'), () =>{SGHelperNavigation.navigatePop(this.props.navigation, 'ChooseSettingScreen')})   
                    }
                    else if (this.contentType === 'phonenumber') {
                        DialogBox.showToast(SGLocalize.translate('ShowToastMessage.SuccessUpdatePhoneNumber'),   () =>{SGHelperNavigation.navigatePop(this.props.navigation, 'ChooseSettingScreen')})   
                    }
                }
                else {
                    DialogBox.showFail(null, SGLocalize.translate('VerifyOTPScreen.alertVerificationFailTitle'), SGLocalize.translate("VerifyOTPScreen.alertVerificationFailText"), SGLocalize.translate('globalText.ok'))
                }
            } 
            else {
                DialogBox.showFail(null, SGLocalize.translate('VerifyOTPScreen.alertVerificationFailTitle'), SGLocalize.translate("VerifyOTPScreen.alertVerificationFailText"), SGLocalize.translate('globalText.ok'))
            }
        }
        catch (error) {
            SGHelperErrorHandling.Handling(error,this._onSubmitPress.bind(this))
        }

    }

    async _onResendEmailPress(){
        try {
            this.dbIDOTP = DialogBox.showLoading(SGLocalize.translate('AlertMessage.Waiting'));
            SGHelperGlobalVar.addVar("otpLastVerifyOTPSetting", new Date());
            this.counter = this.counter+1
            if (this.contentType === 'email' && this.userData.fEmail !== '') {
                this.OTPCode = await tbCOTPUserAPI.addOTPUser(this.userData.fEmail, 'Email',this.counter);
            }
            console.log(this.OTPCode);
            DialogBox.hideDialogBox(this.dbIDOTP, true);  
            this.setState({ timer: 30 })
            this.interval = setInterval(
                () => this.setState((prevState) => ({ timer: prevState.timer - 1 })),
                SGHelperType.getSysParamsValueToInt('VerifyOTPScreenInterval1')
            );
        } catch (error) {
            DialogBox.hideDialogBox(this.dbIDOTP, true);  
            SGHelperErrorHandling.Handling(error,this._onResendEmailPress.bind(this))
        }

        this.forceUpdate();
    }

    async _onResendWaOrSmsPress(type){
        try {
            this.dbIDOTP = DialogBox.showLoading(SGLocalize.translate('AlertMessage.Waiting'));
            SGHelperGlobalVar.addVar("otpLastVerifyOTPSetting", new Date());
            this.counter = this.counter+1
            if (this.contentType === 'phonenumber' && this.userData.fPhoneNumber !== '') {
                if(type === 'whatsapp'){
                    this.OTPCode = await tbCOTPUserAPI.addOTPUser(this.userData.fPhoneNumber, 'Whatsapp',this.counter);
                }else{
                    this.OTPCode = await tbCOTPUserAPI.addOTPUser(this.userData.fPhoneNumber, 'SMS',this.counter);
                }
            }
            console.log(this.OTPCode);
            DialogBox.hideDialogBox(this.dbIDOTP, true); 
            this.setState({ timer: 30 })
            this.interval = setInterval(
                () => this.setState((prevState) => ({ timer: prevState.timer - 1 })),
                SGHelperType.getSysParamsValueToInt('VerifyOTPScreenInterval1')
            );
        } catch (error) {
            DialogBox.hideDialogBox(this.dbIDOTP, true); 
            SGHelperErrorHandling.Handling(error,this._onResendWaOrSmsPress.bind(type))
        }

        this.forceUpdate();
    }

    render() {
        var { w, h, p } = this.WHP;
        var style = this.style;
        return (
            <SGRootScrollView accessible={true} accessibilityLabel={'VerifyOTPScreenRootView'} style={style.mainView1} contentContainerStyle={style.sv1_2}>
                <View style={style.headerView}>
                    <BackButton color={'black'} hidden={!SGHelperNavigation.canGoBack(this.props.navigation)} imageSetting={this.imageSetting} navigator={this.props.navigation}></BackButton>
                    <Image source={{ uri: image.magLogoOnly[this.imageSetting].url }} style={style.logo}></Image>
                </View>
                <Text preset={Text.preset.titleH1B} style={style.titleText}>{SGLocalize.translate("VerifyOTPScreen.headerTitle")}</Text>
                {this.contentType === 'email' ?
                    (<Text preset={Text.preset.titleH2} style={style.bodyText}>{SGLocalize.translate("VerifyOTPScreen.text1_1")} {this.userData.fEmail}</Text>)
                    :
                    (null)}
                {this.contentType === 'phonenumber' ?
                    (<Text preset={Text.preset.titleH2} style={style.bodyText}>{SGLocalize.translate("VerifyOTPScreen.text1_1")} {this.userData.fPhoneNumber}</Text>)
                    :
                    (null)}
                <OTPInputView accessible={true} accessibilityLabel={'VerifyOTPScreenOTPInput'}
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
                <Button accessible={true} accessibilityLabel={'VerifyOTPScreenSubmitButton'} textPreset={Text.preset.titleH3B} style={style.button1} label={SGLocalize.translate("VerifyOTPScreen.buttonSubmit")} onPress={this._onSubmitPress.bind(this)}></Button>
                <Text accessible={true} accessibilityLabel={'VerifyOTPScreenOTPText1'} preset={Text.preset.titleH4} style={style.text2}>{SGLocalize.translate("VerifyOTPScreen.text2_1")} {this.state.timer} {SGLocalize.translate("VerifyOTPScreen.text2_2")}</Text>
                {this.state.timer === 0 ? 
                this.contentType === 'email' ?
                <TouchableOpacity onPress={this._onResendEmailPress.bind(this)}>
                    <Text accessible={true} accessibilityLabel={'VerifyOTPScreenOTPText2'} preset={Text.preset.h8B} style={style.text3}>{SGLocalize.translate("VerifyOTPScreen.text3")}</Text>
                </TouchableOpacity> 
                :
                <View style={{flexDirection:'row'}}>
                    {/* <TouchableOpacity onPress={() => {this._onResendWaOrSmsPress('sms')}}>
                        <Text accessible={true} preset={Text.preset.titleH5B} style={style.text3}>{SGLocalize.translate("VerifyOTPScreen.text3") + ' '+ 'SMS'}</Text>
                    </TouchableOpacity>  */}
                    <TouchableOpacity onPress={() => {this._onResendWaOrSmsPress('whatsapp')}}>
                        <Text accessible={true} preset={Text.preset.titleH5B} style={style.text3}>{SGLocalize.translate("VerifyOTPScreen.text3") + ' '+ 'Whatsapp'}</Text>
                    </TouchableOpacity> 
                </View>
                : null
                }
            </SGRootScrollView>
        );
    }
}
