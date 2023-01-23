/**
 * Wrap react-native TextInput with 2 additional behavior
 * 1. default style with preset
 * 2. disabled true|false
 * 3. hidden true|false
 * 4. manage its own state to minimize screen re-rendering
 * 5. various dataType: text|multiline|password|url|html|number|decimal|email|phone|emailOrPhone
 * 6. shadow true|false
 * 7. textStyle property for modifying the text styling
 */

 import React from 'react';
 import { TextInput, StyleSheet, Keyboard, Platform, ScrollView, Animated, TouchableOpacity } from 'react-native';
 import { SGView } from './SGView';
 import { SGScrollView } from './SGScrollView';
 import { SGIcon } from './SGIcon';
 import { SGBaseControl } from './SGBaseControl';
 import { SGHelperStyle, SGHelperWindow, SGHelperType } from '../helper';
 import { SGText } from './SGText';
 import { SGPopView } from './SGPopView';
 import { SGWebView } from './SGWebView';
 import { SGTouchableOpacity } from './SGTouchableOpacity';
 import { SGIconButton } from './SGIconButton';
 import { SGImageButton } from './SGImageButton'
 import { SGImage } from './SGImage'
 import Clipboard from '@react-native-community/clipboard';
 
 export class SGTextInput extends SGBaseControl {
     static pwdStr = Platform.OS === 'ios' ? '\u25cf\u25cf\u25cf\u25cf\u25cf\u25cf\u25cf\u25cf\u25cf\u25cf\u25cf\u25cf\u25cf\u25cf\u25cf\u25cf\u25cf\u25cf\u25cf\u25cf\u25cf\u25cf\u25cf\u25cf\u25cf\u25cf\u25cf\u25cf\u25cf\u25cf\u25cf\u25cf\u25cf\u25cf\u25cf\u25cf\u25cf\u25cf\u25cf\u25cf' : '****************************************';
     static preset = {
         default: 'default',
         visitor1: 'visitor1',
         tenant1: 'tenant1',
         visitorAddReply: 'visitorAddReply',
         visitorSearchBar: 'visitorSearchBar',
         hidden: 'hidden',
     }
     static dataType = {
         text: 'text',
         multiline: 'multiline',
         password: 'password',
         url: 'url',
         html: 'html',
         number: 'number',
         decimal: 'decimal',
         currency: 'currency',
         email: 'email',
         phone: 'phone',
         emailOrPhone: 'emailOrPhone',
         numeric: 'numeric'
     }
     static _presetStyle = {};
     static _presetTextStyle = {};
     static _presetTextInputStyle = {};
     static _isPresetInit = false;
     static _initPreset() {
         if (!SGTextInput._isPresetInit) {
             var { w, h, p } = SGHelperWindow.getWHPNoHeader();
             SGTextInput._presetStyle = StyleSheet.create({
                 default: {paddingVertical:0, width: w - 12 * p, backgroundColor: SGHelperStyle.color.SGTextInput.BGWhite, flexDirection: 'row', marginVertical: p,  paddingLeft: 3 * p, paddingRight: p, borderRadius: 2 * p, borderWidth: 1, borderColor: SGHelperStyle.color.SGTextInput.Border },
                 hidden: { width: 0, height: 0, margin: 0, padding: 0 },
                 visitor1: { backgroundColor: SGHelperStyle.color.TextInputBackgroundColor, flexDirection: 'row', marginVertical: p, paddingHorizontal: p, borderRadius: 2 * p, justifyContent: 'center', alignItems: 'center' },
                 tenant1: { backgroundColor: SGHelperStyle.color.TextInputBackgroundColor, flexDirection: 'row', marginVertical: p, paddingHorizontal: p, borderRadius: 1 * p, justifyContent: 'center', alignItems: 'center' },
                 visitorSearchBar: { backgroundColor: SGHelperStyle.color.textInputBackgroundColor, flexDirection: 'row', marginVertical: p, paddingHorizontal: p, borderRadius: 1 * p, justifyContent: 'center', alignItems: 'center', width: w * 0.5 },
                 visitorAddReply: { backgroundColor: 'transparent', marginVertical: 0, },
             });
             SGTextInput._presetTextStyle = StyleSheet.create({
                 default: {marginVertical:0, paddingVertical:3*p, flex: 1, fontFamily: SGHelperStyle.fontFamily.regular, padding: 0, marginVertical: 0, maxHeight: Math.min(w * 0.2, h * 0.15), },
                 hidden: {},
                 visitor1: { alignSelf: 'center', flex: 1, fontFamily: SGHelperStyle.fontFamily.regular, padding: 0, marginVertical: 0, maxHeight: Math.min(w * 0.2, h * 0.15), justifyContent: 'center', alignItems: 'center', },
                 visitorSearchBar: { fontSize: w * 0.022, alignSelf: 'center', flex: 1, fontFamily: SGHelperStyle.fontFamily.regular, padding: 0, marginVertical: 0, maxHeight: Math.min(w * 0.2, h * 0.15), justifyContent: 'center', alignItems: 'center', },
                 tenant1: { fontSize: w * 0.032, alignSelf: 'center', flex: 1, fontFamily: SGHelperStyle.fontFamily.regular, padding: 0, marginVertical: 0, maxHeight: Math.min(w * 0.2, h * 0.15), justifyContent: 'center', alignItems: 'center', },
                 visitorAddReply: { flex: 1, fontFamily: SGHelperStyle.fontFamily.regular, padding: 0, marginVertical: 0, maxHeight: Math.min(w * 0.2, h * 0.15), },
             });
             SGTextInput._presetTextInputStyle = StyleSheet.create({
                 default: { flex: 1, fontFamily: SGHelperStyle.fontFamily.regular, padding: 0, fontSize: w * 0.045, marginVertical: 0, maxHeight: Math.min(w * 0.2, h * 0.15), backgroundColor: SGHelperStyle.color.TextInputBackgroundColor, },
                 hidden: {},
                 visitor1: { fontFamily: SGHelperStyle.fontFamily.regular, padding: 0, fontSize: w * 0.045, marginVertical: 0, maxHeight: Math.min(w * 0.2, h * 0.15), backgroundColor: 'white', },
                 visitorSearchBar: { fontFamily: SGHelperStyle.fontFamily.regular, padding: 0, fontSize: w * 0.045, marginVertical: 0, maxHeight: Math.min(w * 0.2, h * 0.15), backgroundColor: 'white', },
                 tenant1: { fontFamily: SGHelperStyle.fontFamily.regular, padding: 0, fontSize: w * 0.035, marginVertical: 0, maxHeight: Math.min(w * 0.2, h * 0.15), backgroundColor: 'white', },
                 visitorAddReply: { flex: 1, fontFamily: SGHelperStyle.fontFamily.regular, padding: 0, fontSize: w * 0.025, marginVertical: 0, maxHeight: Math.min(w * 0.2, h * 0.15), backgroundColor: 'transparent', },
             });
             SGTextInput._isPresetInit = true;
         }
     }
 
     myNumber(val) {
         if (val === '-' || val === '.' || val === ',' || val === '-.' || val === '-,' || val === '') {
             return 0;
         } else {
             return (Number(val));
         }
     }
 
     myRoundDecimal(val) {
         if (val === null) return val;
         else {
             var s = String(val).split('.');
             return Number(s[0] + (s.length > 1 ? '.' + SGHelperType.left(s[1], 2) : ''));
         }
     }
 
     myIsNaN(val) {
        if (val === '-' || val === '.' || val === ',' || val === '-.' || val === '-,' || val === '') {
            return false;
        } else {
            var a = val.split(SGHelperType.getDecimalSeparator());
            if(a.length===2){
                if(!isNaN(a[0])&&(!isNaN(a[1]) || a[1]==='')) {return false}
            }
            return (isNaN(SGHelperType.normalizeCurrency(val)));
        }
    }
 
     onTogglePasswordHandler() {
         this._showPassword = !this._showPassword;
         if (this.props.dataType === SGTextInput.dataType.password) {
             this._myProps.secureTextEntry = !this._showPassword;
         }
         super.mySetState({ showPassword: this._showPassword });
     }
 
     getDisplayValue() {
         if (this.props.dataType === SGTextInput.dataType.password) {
             return this._value === '' ? this.props.placeholder : (this._showPassword ? this._value : SGHelperType.left(SGTextInput.pwdStr, this._value.length));
         } else if (this.props.dataType === SGTextInput.dataType.currency) {
             return this._value === '' ? this.props.placeholder : SGHelperType.localizeCurrency(this._value);
         } else {
             return this._value === '' ? this.props.placeholder : this._value;
         }
     }
 
     onTextPressHandler() {
         // console.log('onTextPressHandler')
         if (!this._isKeyboardInit) {
             this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this.onKeyboardDidShowHandler.bind(this));
             this._isKeyboardActive = true;
         }
         this._undoValue = this._value;
         this._isHidingKeyboard = false;
         SGPopView.showPopView(this.pvID2, false, this.props.SGDialogInput);
     }
 
     onKeyboardDidShowHandler(e) {
         // console.log('onKeyboardDidShowHandler')
         var {w,h,p}=this._screenWHPNoHeader;
         if (!this._isKeyboardInit && this._isKeyboardActive) {
             this._keyboardHeight = e.endCoordinates.height + (Platform.OS==='android'? SGHelperWindow.getHeaderHeight():SGHelperWindow.getHeaderHeight());
             this.animateViewBox();
             this._isKeyboardInit = true;
             if (SGHelperType.isDefined(this.keyboardDidShowListener)) {
                 this.keyboardDidShowListener.remove();
                 this.keyboardDidShowListener = null;
             }
         }
     }
     animateViewBox() {
         // console.log('animateViewBox')
         this._anim.setValue(this._keyboardHeight);
     }
 
     componentWillUnmount() {
         // console.log('componentWillUnmount')
         if (this.keyboardDidShowListener) { this.keyboardDidShowListener.remove(); }
     }
 
     onPopViewKeyboardShow() {
         // console.log('onPopViewKeyboardShow')        
         if (Platform.OS === 'android') { this.refTextInput.current.focus(); }
     }
 
     onPopViewKeyboardWillHide() {
         // console.log('onPopViewKeyboardWillHide')        
         this._isHidingKeyboard = true;
     }
 
     onPopViewKeyboardDismissed() {
         // console.log('onPopViewKeyboardDismissed')        
         this.onBlurCurrencyHandler();
     }
 
     onChangeTextHandler(v) {
        this._value = (this.props.dataType !== SGTextInput.dataType.number && this.props.dataType !== SGTextInput.dataType.decimal && this.props.dataType !== SGTextInput.dataType.currency) ? v : (this.myIsNaN(v) ? this._value : v);
        this._myProps.value = this._value;
        if (!this.props.stateless) { super.mySetState({ value: this._value }); }
        var res = (this.props.dataType !== SGTextInput.dataType.number && this.props.dataType !== SGTextInput.dataType.decimal && this.props.dataType !== SGTextInput.dataType.currency) ? this._value : this.myNumber(SGHelperType.normalizeCurrency(this._value));
        if (SGHelperType.isDefined(this.props.onChangeText)) {
            this.props.onChangeText(res);
        }
        if (SGHelperType.isDefined(this.props.onValueChange)) {
            this.props.onValueChange(res);
        }
    }
 
     onFocusCurrencyHandler(e) {
         // console.log('onFocusCurrencyHandler')        
         if (this.props.onFocus) {
             this.props.onFocus(e);
         }
     }
 
     onBlurCurrencyHandler() {
         // console.log('onBlurCurrencyHandler')        
         if (this.props.dataType === SGTextInput.dataType.currency) {
             var n = String(this.myNumber(this._value));
             if (this._value !== n) {
                 this._value = n;
                 this._myProps.value = this._value;
                 var res = (this.props.dataType !== SGTextInput.dataType.number && this.props.dataType !== SGTextInput.dataType.decimal && this.props.dataType !== SGTextInput.dataType.currency) ? this._value : this.myNumber(SGHelperType.normalizeCurrency(this._value));
                 if (SGHelperType.isDefined(this.props.onChangeText)) {
                     this.props.onChangeText(res);
                 }
                 if (SGHelperType.isDefined(this.props.onValueChange)) {
                     this.props.onValueChange(res);
                 }
                 if (!this.props.stateless) { super.mySetState({ value: this._value }); }
             }
         }
         if (!this._isHidingKeyboard) { SGPopView.hidePopView(this.pvID2, false, this.props.SGDialogInput); }
         if (this.props.onBlur) {
             this.props.onBlur();
         }
     }
     onCopyPressHandler() {
         Clipboard.setString(this._value);
     }
     onPastePressHandler() {
         Clipboard.getString().then((x) => {
             this.onChangeTextHandler(x);
         }).catch((e) => { })
     }
 
     onOKPressHandler(){
        SGPopView.hidePopView(this.pvID2, false, this.props.SGDialogInput);
        Keyboard.dismiss();
        if (this.props.onOK) {
            this.props.onOK();
        }
    }

     constructor(props, context, ...args) {
         super(props, context, ...args);
         SGTextInput._initPreset();
         this.refTextInput = React.createRef();
         this._isKeyboardInit = false;
         this._isKeyboardActive = false;
         this._isHidingKeyboard = false;
         this._keyboardHeight = 0;
         this._showPassword = false;
         this.pvID1 = SGPopView.getPopViewID();
         this.pvID2 = SGPopView.getPopViewID();
         this._anim = new Animated.Value(0);
     }
 
     initProps() {
         if (super.isPropsNeedInitOrChanged(this.props)) {
             var { w, h, p } = this._screenWHPNoHeader;
             var myProps;
             myProps = SGHelperStyle.addStyleProps(this.props, SGTextInput._presetStyle[this.props.preset ? this.props.preset : SGTextInput.preset.default]);
 
             if (this.props.hidden) {
                 myProps.style = SGTextInput._presetStyle.hidden;
             }
             myProps.onChangeText = this.onChangeTextHandler.bind(this);
             myProps.onBlur = null;
             myProps.editable = !this.props.disabled ? true : false
             myProps.autoCapitalize = !this.props.autoCapitalize ? 'none' : this.props.autoCapitalize;
             myProps.autoCorrect = !this.props.autoCorrect ? false : true;
             switch (this.props.dataType) {
                 case SGTextInput.dataType.password:
                     myProps.secureTextEntry = !this._showPassword;
                     break;
                 case SGTextInput.dataType.text:
                     break;
                 case SGTextInput.dataType.multiline:
                     myProps.multiline = true;
                     myProps.numberOfLines = !this.props.numberOfLines ? 3 : this.props.numberOfLines;
                     myProps.autoCapitalize = !this.props.autoCapitalize ? 'sentences' : this.props.autoCapitalize;
                     break;
                 case SGTextInput.dataType.url:
                     break;
                 case SGTextInput.dataType.html:
                     myProps.multiline = true;
                     myProps.numberOfLines = !this.props.numberOfLines ? 5 : this.props.numberOfLines;
                     myProps.autoCapitalize = !this.props.autoCapitalize ? 'none' : this.props.autoCapitalize;
                     break;
                 case SGTextInput.dataType.number:
                     myProps.keyboardType = 'number-pad';
                     break;
                 case SGTextInput.dataType.decimal:
                     myProps.keyboardType = 'decimal-pad';
                     break;
                 case SGTextInput.dataType.currency:
                     myProps.keyboardType = 'decimal-pad';
                     break;
                 case SGTextInput.dataType.email:
                     myProps.keyboardType = 'email-address';
                     break;
                 case SGTextInput.dataType.phone:
                     myProps.keyboardType = 'phone-pad';
                     break;
                 case SGTextInput.dataType.emailOrPhone:
                     myProps.keyboardType = 'email-address';
                     break;
                 case SGTextInput.dataType.numeric:
                     myProps.keyboardType = 'numeric';
                     break;
             }
             this._numberOfLines = SGHelperType.isDefined(this.props.numberOfLines) ? this.props.numberOfLines : (SGHelperType.isDefined(myProps.numberOfLines) ? myProps.numberOfLines : (myProps.multiline ? null : 1));
             this._vStyle = myProps.style;
             this._tStyle = SGHelperStyle.prependStyle(this.props.textStyle, { height: myProps.multiline ? Math.min(w * 0.2, h * 0.15) : null, ...SGTextInput._presetTextStyle[this.props.preset ? this.props.preset : SGTextInput.preset.default] });
             myProps.style = SGHelperStyle.prependStyle(SGTextInput._presetTextInputStyle[this.props.preset ? this.props.preset : SGTextInput.preset.default], { height: myProps.multiline ? Math.min(w * 0.2, h * 0.15) : null, });
             this._myProps = myProps;
             this._pvStyle = { padding: 0,paddingTop:2*p, backgroundColor: this.props.darkMode ? SGHelperStyle.color.SGTextInput.PVBGWhite : SGHelperStyle.color.SGTextInput.PVBGBlack, width: w, height: h * 0.8, borderTopLeftRadius: 5 * p, borderTopRightRadius: 5 * p, }
             this._pvStyle2 = { paddingHorizontal: 4*p,paddingTop:2*p, paddingBottom:0, backgroundColor: this.props.darkMode ? SGHelperStyle.color.SGTextInput.PVBGWhite : SGHelperStyle.color.SGTextInput.PVBGBlack, width: w, borderTopLeftRadius: 5 * p, borderTopRightRadius: 5 * p, justifyContent: 'flex-start' };
             this._pv1TOStyle = { backgroundColor: this.props.darkMode ? SGHelperStyle.color.SGTextInput.PVBGBlack:SGHelperStyle.color.SGTextInput.PVBGWhite , width: w * 0.14, height: w * 0.009, marginVertical: 2 * p, borderRadius: 5 * p }
             this._pv1TStyle = { marginHorizontal:4*p, marginBottom:2*p,alignSelf:'flex-start', color: this.props.darkMode? SGHelperStyle.color.SGTextInput.TextBlack:SGHelperStyle.color.SGTextInput.TextWhite }
             this._dummyBoxStyle = { width: '100%', margin: 0, padding: 0, backgroundColor: this.props.darkMode ? SGHelperStyle.color.SGTextInput.PVBGWhite : SGHelperStyle.color.SGTextInput.PVBGBlack};
         }
     }
 
     initValue() {
         if (!this._isValueInit || this.props.stateless || !this._renderBySelf) {
             var v = SGHelperType.isDefined(this.props.value) ? String(this.props.value) : '';
             this._value = v;
             this._myProps.value = this._value;
             this.state = { value: this._value, showPassword: this._showPassword };
             this._isValueInit = true;
         }
         this._renderBySelf = false;
     }
 
     render() {
         var { w, h, p } = this._screenWHPNoHeader;
         this.initProps();
         this.initValue();
         var myProps = this._myProps;
         var textStyle = this._tStyle;
         var vStyle = this._vStyle;
         if (this._value === '') {
             textStyle = SGHelperStyle.appendStyle(textStyle, { color: SGHelperStyle.color.placeHolderTextColor });
         }
         if (this.props.disabled) {
 
             vStyle = SGHelperStyle.appendStyle(vStyle, { backgroundColor: SGHelperStyle.color.SGTextInput.BGDisabled, })
             textStyle = SGHelperStyle.appendStyle(textStyle, { color: SGHelperStyle.color.SGTextInput.TextDisabled });
         }
         return (
             !this.props.hidden &&
             <SGTouchableOpacity disabled={this.props.disabled} onPress={this.onTextPressHandler.bind(this)} >
                 <SGView accessible={true} accessibilityLabel={'SGTextInputRootView'} shadow={this.props.shadow} shadowIntensity={this.props.shadowIntensity} hidden={this.props.hidden} style={[vStyle, { flexDirection: 'row', backgroundColor: this.props.disabled ? SGHelperStyle.color.BackGroundDisabled : SGHelperStyle.color.BackGroundTextInput }]}>
                     <SGText accessible={true} accessibilityLabel={'SGTextInputValueText'} style={textStyle} preset={SGText.preset.titleH3} >{this.getDisplayValue()}</SGText>
                     {(this.props.dataType === SGTextInput.dataType.password) &&
                         <SGIconButton overrideDisabled disabled={this.props.disabled} accessible={true} accessibilityLabel={'SGTextInputEyeOffIconButton'} hidden={this.props.dataType === SGTextInput.dataType.password ? false : true}  name={this._showPassword ? SGIcon.Icon.eye:SGIcon.Icon.eyeOff} iconPreset={SGIcon.preset.h5} preset={SGIconButton.preset.default} onPress={() => { this.onTogglePasswordHandler(); }} style={{margin:0, padding:0}}/>
                         // <SGImageButton accessible={true} accessibilityLabel={'SGTextInputEyeOffIconButton'} source={this._showPassword ? require('../asset/image/Icon-awesome-eye.png') : require('../asset/image/Icon-awesome-eye-slash.png')} hidden={this.props.dataType === SGTextInput.dataType.password ? false : true} preset={SGImageButton.preset.noBorder} imagePreset={SGImage.preset.w20SnoBorder} onPress={() => { this.onTogglePasswordHandler(); }} imageStyle={{ backgroundColor: this.props.disabled ? SGHelperStyle.color.BackGroundDisabled : 'white', opacity: this.props.disabled ? SGHelperStyle.opacity.disabled : 1, marginLeft: 2 * p }}></SGImageButton>
                     }
                     {(this.props.dataType === SGTextInput.dataType.url || this.props.dataType === SGTextInput.dataType.html) &&
                         <SGIconButton overrideDisabled disabled={this.props.disabled} accessible={true} accessibilityLabel={'SGTextInputHTMLIconButton'} hidden={(this.props.dataType === SGTextInput.dataType.url || this.props.dataType === SGTextInput.dataType.html) ? false : true} name={SGIcon.Icon.browser} iconPreset={SGIcon.preset.h4} preset={SGIconButton.preset.default} onPress={() => { if (this._value !== '') { SGPopView.showPopView(this.pvID1, false, this.props.SGDialogInput) }; }} />
                     }
                     {(this.props.dataType === SGTextInput.dataType.url || this.props.dataType === SGTextInput.dataType.html) &&
                         <SGPopView accessible={true} accessibilityLabel={'SGTextInputPopView'} animationType={'slide'} popViewID={this.pvID1} vPos='bottom'>
                             <SGView accessible={true} accessibilityLabel={'SGTextInputContentView'} style={this._pvStyle}>
                                 <SGTouchableOpacity style={this._pv1TOStyle} onPress={() => { SGPopView.hidePopView(this.pvID1, false, this.props.SGDialogInput) }}></SGTouchableOpacity>
                                 <SGText accessible={true} style={this._pv1TStyle} preset={SGText.preset.titleH3B} accessibilityLabel={'SGTextInputURLText'} numberOfLines={1} hidden={this.props.dataType === SGTextInput.dataType.url ? false : true}>{this._value}</SGText>
                                 <SGWebView accessible={true} accessibilityLabel={'SGTextInputWebView'} style={{ flex: 1 }} source={this.props.dataType === SGTextInput.dataType.url ? { uri: this._value } : { html: this._value }} />
                             </SGView>
                         </SGPopView>
                     }
                     <SGPopView noDialogBox accessible={true} accessibilityLabel={'SGTextInputPopView2'} hideWhenKeyboardDismissed={true} onShow={this.onPopViewKeyboardShow.bind(this)} onWillHide={this.onPopViewKeyboardWillHide.bind(this)} onDismiss={this.onPopViewKeyboardDismissed.bind(this)} animationType={'none'} popViewID={this.pvID2} vPos='bottom'>
                         <SGView accessible={true} accessibilityLabel={'SGTextInputBottomView'} style={this._pvStyle2}>
                             <SGTouchableOpacity style={this._pv1TOStyle} onPress={() => { SGPopView.hidePopView(this.pvID2, false, this.props.SGDialogInput) }}></SGTouchableOpacity>
                             <SGText accessible={true} accessibilityLabel={'SGTextInputIsDefText'} darkMode preset={SGText.preset.titleH2B} style={{ alignSelf: 'flex-start', }} hidden={SGHelperType.isDefined(this.props.label) ? false : true}>{this.props.label}</SGText>
                             <SGView accessible={true} accessibilityLabel={'SGTextInputRowView'} shadow style={{ width: w-8*p, marginVertical: 2 * p, flexDirection: 'row', justifyContent: 'space-between', backgroundColor: this.props.darkMode?SGHelperStyle.color.SGTextInput.TextBlack:SGHelperStyle.color.SGTextInput.TextWhite, paddingHorizontal: 3 * p, paddingVertical:2*p, borderRadius: 2 * p }}>
                                 <TextInput accessible={true} accessibilityLabel={'SGTextInputProp'} ref={this.refTextInput} {...myProps} keyboardType={myProps.keyboardType} autoFocus={Platform.OS === 'android' ? false : true} onFocus={this.onFocusCurrencyHandler.bind(this)} allowFontScaling={false} />
                                 {(this.props.dataType === SGTextInput.dataType.password) &&
                                     // <SGImageButton accessible={true} accessibilityLabel={'SGTextInputEyeOffIconButton'} source={this._showPassword ? require('../asset/image/Icon-awesome-eye.png') : require('../asset/image/Icon-awesome-eye-slash.png')} hidden={this.props.dataType === SGTextInput.dataType.password ? false : true} preset={SGImageButton.preset.noBorder} imagePreset={SGImage.preset.w20SnoBorder} onPress={() => { this.onTogglePasswordHandler(); }} ></SGImageButton>
                                     <SGIconButton accessible={true} accessibilityLabel={'SGTextInputEyeOffIconButton2'} hidden={this.props.dataType === SGTextInput.dataType.password ? false : true}  name={this._showPassword ? SGIcon.Icon.eye:SGIcon.Icon.eyeOff} iconPreset={SGIcon.preset.h5} preset={SGIconButton.preset.default} onPress={() => { this.onTogglePasswordHandler(); }} style={{margin:0, padding:0}}/>
                                 }
                             </SGView>
                             <SGView accessible={true} accessibilityLabel={'SGTextInputButtonView'} style={{width:w-8*p, flexDirection: 'row', justifyContent: 'space-between', marginBottom: 2 * p }}>
                                 <SGImageButton accessible={true} accessibilityLabel={'SGTextInputCopyIconButton'} source={require('../asset/image/Icon-ionic-ios-copy.png')} preset={SGImageButton.preset.noBorder} imagePreset={SGImage.preset.w24SnoBorder} onPress={this.props.disabled?()=>{}:() => { this.onCopyPressHandler() }} style={{minWidth:0}}></SGImageButton>
                                 <SGImageButton accessible={true} accessibilityLabel={'SGTextInputPasteIconButton'} source={require('../asset/image/Icon-awesome-paste.png')} preset={SGImageButton.preset.noBorder} imagePreset={SGImage.preset.w24SnoBorder} onPress={this.props.disabled?()=>{}:() => { this.onPastePressHandler() }} style={{minWidth:0}}></SGImageButton>
                                 <SGImageButton accessible={true} accessibilityLabel={'SGTextInputUndoIconButton'} source={require('../asset/image/Icon-awesome-undo-alt.png')} preset={SGImageButton.preset.noBorder} imagePreset={SGImage.preset.w24SnoBorder} onPress={this.props.disabled?()=>{}:() => { this.onChangeTextHandler(this._undoValue) }} style={{minWidth:0}}></SGImageButton>
                                 <SGImageButton accessible={true} accessibilityLabel={'SGTextInputClearIconButton'} source={require('../asset/image/Icon-ionic-ios-close.png')} preset={SGImageButton.preset.noBorder} imagePreset={SGImage.preset.w24SnoBorder} onPress={this.props.disabled?()=>{}:() => { this.onChangeTextHandler('') }} style={{minWidth:0}}></SGImageButton>
                                 <SGImageButton accessible={true} accessibilityLabel={'SGTextInputOkIconButton'} source={require('../asset/image/Icon-ionic-ios-checkmark.png')} preset={SGImageButton.preset.noBorder} imagePreset={SGImage.preset.w24SnoBorder} onPress={this.props.disabled?()=>{}:() => { this.onOKPressHandler(); }} style={{minWidth:0}}></SGImageButton>
                             </SGView>
                             <Animated.View accessible={true} accessibilityLabel={'SGTextInputAnimatedView'} style={[this._dummyBoxStyle, { height: this._anim }]}></Animated.View>
                         </SGView>
                     </SGPopView>
                 </SGView>
             </SGTouchableOpacity>
         );
     }
 }
 