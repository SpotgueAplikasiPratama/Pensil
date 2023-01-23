/**
 * Custom dialog box with several capabilities
 * 1. title props
 * 2. message props
 * 3. icon props
 * 4. preset for : viewStyle, titleStyle, messageStyle, iconStyle, yesButtonStyle, noButtonStyle
 * 5. type : OK, YesNo, OKCancel, Custom
 * 6. event : onOK, onCancel
 * 
 * calling schema
 * ({title:'',message:'',icon:{name:'',color:''})
 */



 import React from 'react';
 import { Platform } from 'react-native';
 import { SGPopView } from './SGPopView';
 import { SGText } from './SGText';
 import { SGView } from './SGView';
 import { SGButton } from './SGButton';
 import { SGIcon } from './SGIcon';
 import { SGIconButton } from './SGIconButton';
 import { SGPicker } from './SGPicker';
 import { SGActivityIndicator } from './SGActivityIndicator';
 import { SGTextInput } from './SGTextInput';
 import { SGWebView} from './SGWebView';
 import { SGTouchableOpacity } from './SGTouchableOpacity';
 import { SGHelperType, SGHelperWindow, SGHelperStyle, SGHelperGlobalVar } from '../helper';
 
 export class SGDialogBox extends React.Component {
    static _dialogBoxList = [];
    static _dialogOpened = false;
    static getDialogBoxID() {
        return SGHelperType.getGUID();
    }
    static registerDialogBox(dialogBoxID, callBackShow, callBackHide) {
        SGDialogBox._dialogBoxList[dialogBoxID] = { id: dialogBoxID, callBackShow: callBackShow, callBackHide: callBackHide };
    }
    static removeDialogBox(dialogBoxID) {
        SGDialogBox.popActiveDialogBox(dialogBoxID);
        delete SGDialogBox._dialogBoxList[dialogBoxID];
    }
    static _activeDialogBoxStack = [];
    static pushActiveDialogBox(dialogBoxID) {
        SGDialogBox._activeDialogBoxStack.push(SGDialogBox._dialogBoxList[dialogBoxID]);
    }
    static popActiveDialogBox(dialogBoxID) {
        for (var i = 0; i < SGDialogBox._activeDialogBoxStack.length; i++) {
            if (SGDialogBox._activeDialogBoxStack[i].id === dialogBoxID) {
                SGDialogBox._activeDialogBoxStack.splice(i, 1);
                return;
            }
        }
    }
    static getActiveDialogBox() {
        if (SGDialogBox._activeDialogBoxStack.length > 0) {
            return SGDialogBox._activeDialogBoxStack[SGDialogBox._activeDialogBoxStack.length - 1];
        } else {
            throw new Error('no active dialog box');
        }
    }
    static showDialogBox(dialogBoxID, options) {
        if (SGDialogBox._dialogOpened) {
            setTimeout(() => { SGDialogBox.showDialogBox(dialogBoxID, options) }, 200);
        } else {
            if (dialogBoxID !== null) {
                if (SGHelperType.isDefined(SGDialogBox._dialogBoxList[dialogBoxID])) {
                    SGDialogBox._dialogOpened = true;
                    SGDialogBox._dialogBoxList[dialogBoxID].callBackShow(options);
                }
            } else {
                SGDialogBox._dialogOpened = true;
                SGDialogBox.getActiveDialogBox().callBackShow(options);
            }
        }
    }
    static hideDialogBox(dialogBoxID, forceClose = false) {
        if (SGHelperType.isDefined(SGDialogBox._dialogBoxList[dialogBoxID])) {
            SGDialogBox._dialogBoxList[dialogBoxID].callBackHide();
        }
        if (forceClose) { SGDialogBox._dialogOpened = false };
    }
    static showLoading(title) {
        var dBID = SGDialogBox.getActiveDialogBox().id;
        var { w, h, p } = SGHelperWindow.getWHP();
        SGDialogBox.showDialogBox(dBID, {
            modal: true,
            preset: SGDialogBox.preset.loading,
            view: null,
            icon: null,
            title: { children: <SGActivityIndicator style={Platform.OS === 'ios' ? {} : { width: w * 0.1, height: w * 0.1, overflow: 'visible' }} preset={SGActivityIndicator.preset.h1} /> },
            message: { children: title },
            textInput: null,
            negativeButton: null,
            onNegativeButtonPress: null,
            positiveButton: null,
            onPositiveButtonPress: null,
            picker: { optionList: [] },
            closeButton: null,
            linkObject:null
        });
        return dBID;
    }
    static showToast(title, onEnd) {
        var dBID = SGDialogBox.getActiveDialogBox().id;
        var { w, h, p } = SGHelperWindow.getWHP();
        SGDialogBox.showDialogBox(dBID, {
            modal: true,
            preset: SGDialogBox.preset.toast,
            view: null,
            icon: null,
            title: null,
            message: { children: title },
            textInput: null,
            negativeButton: null,
            onNegativeButtonPress: null,
            positiveButton: null,
            onPositiveButtonPress: null,
            picker: { optionList: [] },
            closeButton: null,
            linkObject:null,
            onEnd:onEnd
        });
        return dBID;
    }
    static showWebView(url, onEnd) {
        var dBID = SGDialogBox.getActiveDialogBox().id;
        var { w, h, p } = SGHelperWindow.getWHP();
        SGDialogBox.showDialogBox(dBID, {
            modal: true,
            preset: SGDialogBox.preset.webView,
            view: null,
            icon: null,
            title: null,
            message: { children: '' },
            textInput: null,
            negativeButton: null,
            onNegativeButtonPress: null,
            positiveButton: null,
            onPositiveButtonPress: null,
            picker: { optionList: [] },
            closeButton: null,
            linkObject: {label:'',url:url},
            onEnd: onEnd
        });
        return dBID;
    }    
    static updateProgress(val) {
        SGHelperGlobalVar.setVar('SGDialogBox.Progress', val);
    }
    static showProgress(title) {
        var dBID = SGDialogBox.getActiveDialogBox().id;
        var { w, h, p } = SGHelperWindow.getWHP();
        SGHelperGlobalVar.removeVar('SGDialogBox.Progress');
        SGDialogBox.showDialogBox(dBID, {
            globalVarName: 'SGDialogBox.Progress',
            modal: true,
            preset: SGDialogBox.preset.progress,
            view: null,
            icon: null,
            title: { children: <SGActivityIndicator style={Platform.OS === 'ios' ? {} : { width: w * 0.1, height: w * 0.1, overflow: 'visible' }} preset={SGActivityIndicator.preset.h1} /> },
            message: { children: title },
            textInput: null,
            negativeButton: null,
            onNegativeButtonPress: null,
            positiveButton: null,
            onPositiveButtonPress: null,
            picker: { optionList: [] },
            closeButton: null,
            linkObject:null
        });
        return dBID;
    }
    static showSuccess(dbID, title, message, buttonLabel, onButtonPress, forceClose = false, linkObject=null) {
        SGDialogBox.showDialogBox(dbID, {
            modal: false,
            preset: SGDialogBox.preset.successOK,
            view: null,
            icon: null,
            title: { children: title },
            message: { children: message },
            textInput: null,
            negativeButton: null,
            onNegativeButtonPress: null,
            positiveButton: { label: buttonLabel, },
            onPositiveButtonPress: onButtonPress,
            picker: { optionList: [] },
            forceClose: forceClose,
            closeButton: null,
            linkObject:linkObject
        });
    }
    static showWarning(dbID, title, message, buttonLabel, onButtonPress, forceClose = false, linkObject=null) {
       SGDialogBox.showDialogBox(dbID, {
           modal: false,
           preset: SGDialogBox.preset.warning,
           view: null,
           icon: null,
           title: { children: title },
           message: { children: message },
           textInput: null,
           negativeButton: null,
           onNegativeButtonPress: null,
           positiveButton: { label: buttonLabel, },
           onPositiveButtonPress: onButtonPress,
           picker: { optionList: [] },
           forceClose: forceClose,
           closeButton: null,
           linkObject:linkObject
       });
   }
    static showFail(dbID, title, message, buttonLabel, onButtonPress, forceClose = false, linkObject=null) {
        SGDialogBox.showDialogBox(dbID, {
            modal: true,
            preset: SGDialogBox.preset.failOK,
            view: null,
            icon: null,
            title: { children: title },
            message: { children: message },
            textInput: null,
            negativeButton: { label: buttonLabel },
            onNegativeButtonPress: onButtonPress,
            positiveButton: null,
            onPositiveButtonPress: null,
            picker: { optionList: [] },
            forceClose: forceClose,
            closeButton: null,
            linkObject:linkObject
        });
    }
    static showConfirmation(dbID, title, message, buttonLabelNo, onNoPress, buttonLabelYes, onYesPress, forceClose = false, linkObject=null) {
        SGDialogBox.showDialogBox(dbID, {
            modal: true,
            preset: SGDialogBox.preset.yesNo,
            view: null,
            icon: null,
            title: { children: title },
            message: { children: message },
            textInput: null,
            negativeButton:  { label: buttonLabelNo },
            onNegativeButtonPress: onNoPress,
            positiveButton: { label: buttonLabelYes },
            onPositiveButtonPress: onYesPress,
            picker: { optionList: [] },
            forceClose: forceClose,
            closeButton: null,
            linkObject: linkObject
        });
    }
    static showAction(dbID, title, message, buttonLabelNo, onNoPress, buttonLabelYes, onYesPress, forceClose = false,linkObject=null) {
        SGDialogBox.showDialogBox(dbID, {
            modal: false,
            preset: SGDialogBox.preset.action,
            view: null,
            icon: null,
            title: { children: title },
            message: { children: message },
            textInput: null,
            negativeButton: { label: buttonLabelNo },
            onNegativeButtonPress: onNoPress,
            positiveButton: { label: buttonLabelYes },
            onPositiveButtonPress: onYesPress,
            picker: { optionList: [] },
            forceClose: forceClose,
            closeButton: {},
            linkObject:linkObject
        });
    }

    static showInputBox(dbID, title, message, stringType, onValueChange, disabled, buttonLabelNo, onNoPress, buttonLabelYes, onYesPress, forceClose = false, defaultValue = null, linkObject=null) {
        SGDialogBox.showDialogBox(dbID, {
            modal: true,
            preset: SGDialogBox.preset.inputBox,
            view: null,
            icon: null,
            title: { children: title },
            message: { children: message },
            textInput: { stringType: stringType, onValueChange: onValueChange, disabled: disabled, value: defaultValue },
            negativeButton: { label: buttonLabelNo },
            onNegativeButtonPress: onNoPress,
            positiveButton: { label: buttonLabelYes },
            onPositiveButtonPress: onYesPress,
            picker: { optionList: [] },
            forceClose: forceClose,
            closeButton: null,
            linkObject:linkObject
        });
    }
    static showPickerBox(dbID, title, message, single, mandatory, optionList, onValueChange, disabled, buttonLabelNo, onNoPress, buttonLabelYes, onYesPress, forceClose = false, defaultValue = null, linkObject=null) {
        SGDialogBox.showDialogBox(dbID, {
            modal: true,
            preset: SGDialogBox.preset.pickerBox,
            view: null,
            icon: null,
            title: { children: title },
            message: { children: message },
            textInput: null,
            negativeButton: { label: buttonLabelNo },
            onNegativeButtonPress: onNoPress,
            positiveButton: { label: buttonLabelYes },
            onPositiveButtonPress: onYesPress,
            picker: { single: single, mandatory: mandatory, optionList: optionList, onValueChange: onValueChange, disabled: disabled, value: defaultValue },
            forceClose: forceClose,
            closeButton: null,
            linkObject:linkObject
        });
    }

    static preset = {
        successOK: 'successOK',
        failOK: 'failOK',
        yesNo: 'yesNo',
        inputBox: 'inputBox',
        loading: 'loading',
        progress: 'progress',
        pickerBox: 'pickerBox',
        action: 'action',
        toast:'toast',
        warning:'warning',
        webView: 'webView',
    }
    static _viewPreset = [];
    static _initViewPreset() {
        var { w, h, p } = SGHelperWindow.getWHPNoHeader();
        SGDialogBox._viewPreset = {
            successOK: {
                style: { justifyContent: 'flex-start', overflow: 'visible', paddingHorizontal: 6 * p, paddingTop: 12 * p, paddingBottom: 6 * p, width: w * 0.800, minHeight: w * 0.5, backgroundColor: SGHelperStyle.color.SGDialogBox.BGWhite, borderRadius: 4 * p },
            },
            failOK: {
                style: { justifyContent: 'flex-start', overflow: 'visible', paddingHorizontal: 6 * p, paddingTop: 12 * p, paddingBottom: 6 * p, width: w * 0.800, minHeight: w * 0.5, backgroundColor: SGHelperStyle.color.SGDialogBox.BGWhite, borderRadius: 4 * p },
            },
            yesNo: {
                style: { justifyContent: 'flex-start', overflow: 'visible', paddingHorizontal: 6 * p, paddingTop: 12 * p, paddingBottom: 6 * p, width: w * 0.800, minHeight: w * 0.5, backgroundColor: SGHelperStyle.color.SGDialogBox.BGWhite, borderRadius: 4 * p },
            },
            inputBox: {
                style: { justifyContent: 'flex-start', overflow: 'visible', paddingHorizontal: 6 * p, paddingTop: 12 * p, paddingBottom: 6 * p, width: w * 0.800, minHeight: w * 0.5, backgroundColor: SGHelperStyle.color.SGDialogBox.BGWhite, borderRadius: 4 * p },
            },
            loading: {
                style: { justifyContent: 'flex-start', overflow: 'visible', paddingHorizontal: 6 * p, paddingTop: 12 * p, paddingBottom: 6 * p, width: w * 0.600, minHeight: w * 0.375, backgroundColor: SGHelperStyle.color.SGDialogBox.BGWhite, borderRadius: 4 * p },
            },
            progress: {
                style: { justifyContent: 'flex-start', overflow: 'visible', paddingHorizontal: 6 * p, paddingTop: 12 * p, paddingBottom: 6 * p, width: w * 0.600, minHeight: w * 0.375, backgroundColor: SGHelperStyle.color.SGDialogBox.BGWhite, borderRadius: 4 * p },
            },
            pickerBox: {
                style: { justifyContent: 'flex-start', overflow: 'visible', paddingHorizontal: 6 * p, paddingTop: 12 * p, paddingBottom: 6 * p, width: w * 0.800, minHeight: w * 0.5, backgroundColor: SGHelperStyle.color.SGDialogBox.BGWhite, borderRadius: 4 * p },
            },
            action: {
                style: { justifyContent: 'flex-start', overflow: 'visible', paddingHorizontal: 6 * p, paddingTop: 12 * p, paddingBottom: 6 * p, width: w * 0.800, minHeight: w * 0.5, backgroundColor: SGHelperStyle.color.SGDialogBox.BGWhite, borderRadius: 4 * p },
            },
            toast: {
                style: { justifyContent: 'flex-start', overflow: 'visible', paddingHorizontal: 2 * p, width:0.35*w, paddingVertical: 2 * p, backgroundColor: SGHelperStyle.color.SGDialogBox.ToastGrey, borderRadius: 2 * p },
            },
            warning:{
               style: { justifyContent: 'flex-start', overflow: 'visible', paddingHorizontal: 6 * p, paddingTop: 12 * p, paddingBottom: 6 * p, width: w * 0.800, minHeight: w * 0.5, backgroundColor: SGHelperStyle.color.SGDialogBox.BGWhite, borderRadius: 4 * p },
            },
            webView: {
                style: {},
            },
        };
    }

    static _titlePreset = [];
    static _initTitlePreset() {
        var { w, h, p } = SGHelperWindow.getWHPNoHeader();
        SGDialogBox._titlePreset = {
            successOK: {
                style: { marginBottom: 6 * p, color: SGHelperStyle.color.SGDialogBox.TextBlack,textAlign: 'center' },
                preset: SGText.preset.titleH2B,
            },
            failOK: {
                style: { marginBottom: 6 * p, color: SGHelperStyle.color.SGDialogBox.TextBlack,textAlign: 'center' },
                preset: SGText.preset.titleH2B,
            },
            yesNo: {
                style: { marginBottom: 6 * p, color: SGHelperStyle.color.SGDialogBox.TextBlack,textAlign: 'center' },
                preset: SGText.preset.titleH2B,
            },
            inputBox: {
                style: { marginBottom: 6 * p, color: SGHelperStyle.color.SGDialogBox.TextBlack,textAlign: 'center' },
                preset: SGText.preset.titleH2B,
            },
            loading: {
                style: {},
            },
            progress: {
                style: {},
            },
            pickerBox: {
                style: { marginBottom: 6 * p, color: SGHelperStyle.color.SGDialogBox.TextBlack,textAlign: 'center' },
                preset: SGText.preset.titleH2B,
            },
            action: {
                style: { marginBottom: 6 * p, color: SGHelperStyle.color.SGDialogBox.TextBlack,textAlign: 'center' },
                preset: SGText.preset.titleH2B,
            },
            toast: {
                style: {},
                hidden:true
            },
            warning:{
               style: { marginBottom: 6 * p, color: SGHelperStyle.color.SGDialogBox.TextBlack,textAlign: 'center' },
               preset: SGText.preset.titleH2B,
            },
            webView: {
                style: {},
                hidden: true
            },
        };
    }

    static _messagePreset = {};
    static _initMessagePreset() {
        var { w, h, p } = SGHelperWindow.getWHPNoHeader();
        SGDialogBox._messagePreset = {
            successOK: {
                style: { marginBottom: 6 * p, color: SGHelperStyle.color.SGDialogBox.TextGrey, textAlign: 'center' },
                preset: SGText.preset.titleH4,
            },
            failOK: {
                style: { marginBottom: 6 * p, color: SGHelperStyle.color.SGDialogBox.TextGrey, textAlign: 'center' },
                preset: SGText.preset.titleH4,
            },
            yesNo: {
                style: { marginBottom: 6 * p, color: SGHelperStyle.color.SGDialogBox.TextGrey, textAlign: 'center' },
                preset: SGText.preset.titleH4,
            },
            inputBox: {
                style: { marginBottom: 6 * p, color: SGHelperStyle.color.SGDialogBox.TextGrey, textAlign: 'center' },
                preset: SGText.preset.titleH4,
            },
            loading: {
                style: { marginBottom: 6 * p, color: SGHelperStyle.color.SGDialogBox.TextGrey, textAlign: 'center' },
                preset: SGText.preset.titleH4,
            },
            progress: {
                style: { marginBottom: 6 * p, color: SGHelperStyle.color.SGDialogBox.TextGrey, textAlign: 'center' },
                preset: SGText.preset.titleH4,
            },
            pickerBox: {
                style: { marginBottom: 6 * p, color: SGHelperStyle.color.SGDialogBox.TextGrey, textAlign: 'center' },
                preset: SGText.preset.titleH4,
            },
            action: {
                style: { marginBottom: 6 * p, color: SGHelperStyle.color.SGDialogBox.TextGrey, textAlign: 'center' },
                preset: SGText.preset.titleH4,
            },
            toast: {
                style: { marginBottom: 0 * p, color: SGHelperStyle.color.SGDialogBox.ToastWhite, textAlign: 'center' },
                preset: SGText.preset.titleH4,
            },
            warning:{
               style: { marginBottom: 6 * p, color: SGHelperStyle.color.SGDialogBox.TextGrey, textAlign: 'center' },
               preset: SGText.preset.titleH4,
            },
            webView: {
                style: {},
                hidden: true
            },
        };
    }
    static _linkPreset = {};
    static _initLinkPreset() {
        var { w, h, p } = SGHelperWindow.getWHPNoHeader();
        SGDialogBox._linkPreset = {
            successOK: {
                style: { marginTop:-5*p, marginBottom: 6 * p, color: SGHelperStyle.color.SGDialogBox.TextBlue, textAlign: 'center' },
                preset: SGText.preset.titleH4,
            },
            failOK: {
                style: { marginTop:-5*p, marginBottom: 6 * p, color: SGHelperStyle.color.SGDialogBox.TextBlue, textAlign: 'center' },
                preset: SGText.preset.titleH4,
            },
            yesNo: {
                style: { marginTop:-5*p, marginBottom: 6 * p, color: SGHelperStyle.color.SGDialogBox.TextBlue, textAlign: 'center' },
                preset: SGText.preset.titleH4,
            },
            inputBox: {
                style: { marginTop:-5*p, marginBottom: 6 * p, color: SGHelperStyle.color.SGDialogBox.TextBlue, textAlign: 'center' },
                preset: SGText.preset.titleH4,
            },
            loading: {
                style: { },
                hidden: true
            },
            progress: {
                style: { },
                hidden: true
            },
            pickerBox: {
                style: { marginTop:-5*p, marginBottom: 6 * p, color: SGHelperStyle.color.SGDialogBox.TextBlue, textAlign: 'center' },
                preset: SGText.preset.titleH4,
            },
            action: {
                style: { marginTop:-5*p, marginBottom: 6 * p, color: SGHelperStyle.color.SGDialogBox.TextBlue, textAlign: 'center' },
                preset: SGText.preset.titleH4,
            },
            toast: {
                style: { },
                hidden: true
            },
            warning:{
               style: { marginTop:-5*p, marginBottom: 6 * p, color: SGHelperStyle.color.SGDialogBox.TextBlue, textAlign: 'center' },
               preset: SGText.preset.titleH4,
            },
            webView: {
                style: {},
                hidden: true
            },
        };
    }
    static _pickerPreset = [];
    static _initPickerPreset() {
        var { w, h, p } = SGHelperWindow.getWHPNoHeader();
        SGDialogBox._pickerPreset = {
            successOK: {
                hidden: true,
            },
            failOK: {
                hidden: true,
            },
            yesNo: {
                hidden: true,
            },
            inputBox: {
                hidden: true,
            },
            loading: {
                hidden: true,
            },
            progress: {
                hidden: true,
            },
            pickerBox: {
                style: { marginHorizontal: 0, paddingLeft: p, marginBottom: 6 * p, width: w * 0.800 - 12 * p, borderWidth: 0 },
                shadow: true,
            },
            action: {
                hidden: true,
            },
            toast: {
                hidden: true,
            },
            warning:{
               hidden: true,
            },
            webView: {
                style: {},
                hidden: true
            },
        };
    }

    static _textInputPreset = [];
    static _initTextInputPreset() {
        var { w, h, p } = SGHelperWindow.getWHPNoHeader();
        SGDialogBox._textInputPreset = {
            successOK: {
                hidden: true,
            },
            failOK: {
                hidden: true,
            },
            yesNo: {
                hidden: true,
            },
            inputBox: {
                style: { marginHorizontal: 0, marginBottom: 6 * p, width: w * 3 / 4, height: w * 0.1 },
                shadow: true,
            },
            loading: {
                hidden: true,
            },
            progress: {
                hidden: true,
            },
            pickerBox: {
                hidden: true,
            },
            action: {
                hidden: true,
            },
            toast: {
                hidden: true,
            }, 
            warning: {
               hidden: true,
            },
            webView: {
                hidden: true,
            },
        };
    }

    static _viewIconPreset = {};
    static _initViewIconPreset() {
        var { w, h, p } = SGHelperWindow.getWHPNoHeader();
        SGDialogBox._viewIconPreset = {
            successOK: {
                style: { overflow: 'visible', alignItems: 'center', justifyContent: 'center', position: 'absolute', top: -w / 10, padding: 0, paddingVertical: 0, paddingHorizontal: 0, borderRadius: w / 5, backgroundColor: SGHelperStyle.color.SGDialogBox.BGWhite, width: w / 5 * 0.86, height: w / 5 * 0.86 },
            },
            failOK: {
                style: { overflow: 'visible', alignItems: 'center', justifyContent: 'center', position: 'absolute', top: -w / 10, padding: 0, paddingVertical: 0, paddingHorizontal: 0, borderRadius: w / 5, backgroundColor: SGHelperStyle.color.SGDialogBox.BGWhite, width: w / 5 * 0.86, height: w / 5 * 0.86 },
            },
            yesNo: {
                style: { overflow: 'visible', alignItems: 'center', justifyContent: 'center', position: 'absolute', top: -w / 10, padding: 0, paddingVertical: 0, paddingHorizontal: 0, borderRadius: w / 5, backgroundColor: SGHelperStyle.color.SGDialogBox.BGWhite, width: w / 5 * 0.86, height: w / 5 * 0.86 },
            },
            inputBox: {
                style: { overflow: 'visible', alignItems: 'center', justifyContent: 'center', position: 'absolute', top: -w / 10, padding: 0, paddingVertical: 0, paddingHorizontal: 0, borderRadius: w / 5, backgroundColor: SGHelperStyle.color.SGDialogBox.BGWhite, width: w / 5 * 0.86, height: w / 5 * 0.86 },
            },
            loading: {
                hidden: true
            },
            progress: {
                hidden: true
            },
            pickerBox: {
                style: { overflow: 'visible', alignItems: 'center', justifyContent: 'center', position: 'absolute', top: -w / 10, padding: 0, paddingVertical: 0, paddingHorizontal: 0, borderRadius: w / 5, backgroundColor: SGHelperStyle.color.SGDialogBox.BGWhite, width: w / 5 * 0.86, height: w / 5 * 0.86 },
            },
            action: {
                style: { overflow: 'visible', alignItems: 'center', justifyContent: 'center', position: 'absolute', top: -w / 10, padding: 0, paddingVertical: 0, paddingHorizontal: 0, borderRadius: w / 5, backgroundColor: SGHelperStyle.color.SGDialogBox.BGWhite, width: w / 5 * 0.86, height: w / 5 * 0.86 },
            },
            toast: {
                hidden: true
            },
            warning: {
               style: { overflow: 'visible', alignItems: 'center', justifyContent: 'center', position: 'absolute', top: -w / 10, padding: 0, paddingVertical: 0, paddingHorizontal: 0, borderRadius: w / 5, backgroundColor: SGHelperStyle.color.SGDialogBox.BGWhite, width: w / 5 * 0.86, height: w / 5 * 0.86 },
            },
            webView: {
                hidden: true
            },
        };
    }
    static _iconPreset = {};
    static _initIconPreset() {
        var { w, h, p } = SGHelperWindow.getWHPNoHeader();
        SGDialogBox._iconPreset = {
            successOK: {
                name: SGIcon.Icon.dialogSuccess,
                style: { color: SGHelperStyle.color.SGDialogBox.IconGreen, marginVertical: 0, marginHorizontal: 0, margin: 0, paddingVertical: 0, paddingHorizontal: 0, padding: 0, width: w / 5, height: w / 5 },
                preset: SGIcon.preset.w5,
                shadow: true,
            },
            failOK: {
                name: SGIcon.Icon.dialogFail,
                style: { color: SGHelperStyle.color.SGDialogBox.IconRed, marginVertical: 0, marginHorizontal: 0, margin: 0, paddingVertical: 0, paddingHorizontal: 0, padding: 0, width: w / 5, height: w / 5, },
                preset: SGIcon.preset.w5,
                shadow: true,
            },
            yesNo: {
                name: SGIcon.Icon.dialogConfirmation,
                style: { color: SGHelperStyle.color.SGDialogBox.IconOrange, marginVertical: 0, marginHorizontal: 0, margin: 0, paddingVertical: 0, paddingHorizontal: 0, padding: 0, width: w / 5, height: w / 5, },
                preset: SGIcon.preset.w5,
                shadow: true,
            },
            inputBox: {
                name: SGIcon.Icon.dialogInputBox,
                style: { color: SGHelperStyle.color.SGDialogBox.IconBlue, marginVertical: 0, marginHorizontal: 0, margin: 0, paddingVertical: 0, paddingHorizontal: 0, padding: 0, width: w / 5, height: w / 5, },
                preset: SGIcon.preset.w5,
                shadow: true,
            },
            loading: {
                name: SGIcon.Icon.dialogConfirmation,
                hidden: true,
            },
            progress: {
                name: SGIcon.Icon.dialogConfirmation,
                hidden: true,
            },
            pickerBox: {
                name: SGIcon.Icon.dialogInputBox,
                style: { color: SGHelperStyle.color.SGDialogBox.IconBlue, marginVertical: 0, marginHorizontal: 0, margin: 0, paddingVertical: 0, paddingHorizontal: 0, padding: 0, width: w / 5, height: w / 5, },
                preset: SGIcon.preset.w5,
                shadow: true,
            },
            action: {
                name: SGIcon.Icon.dialogConfirmation,
                style: { color: SGHelperStyle.color.SGDialogBox.IconOrange, marginVertical: 0, marginHorizontal: 0, margin: 0, paddingVertical: 0, paddingHorizontal: 0, padding: 0, width: w / 5, height: w / 5, },
                preset: SGIcon.preset.w5,
                shadow: true,
            },
            toast: {
                name: SGIcon.Icon.dialogConfirmation,
                hidden: true,
            },
            warning:{
               name: SGIcon.Icon.dialogConfirmation,
               style: { color: SGHelperStyle.color.SGDialogBox.IconOrange, marginVertical: 0, marginHorizontal: 0, margin: 0, paddingVertical: 0, paddingHorizontal: 0, padding: 0, width: w / 5, height: w / 5 },
               preset: SGIcon.preset.w5,
               shadow: true,
               
            },
            webView: {
                name: SGIcon.Icon.dialogConfirmation,
                hidden: true,
            },
        };
    }

    static _buttonPreset = {};
    static _initButtonPreset() {
        var { w, h, p } = SGHelperWindow.getWHPNoHeader();
        SGDialogBox._buttonPreset = {
            successOK: {
                negativeButton: {
                    hidden: true,
                },
                positiveButton: {
                    preset: SGButton.preset.green,
                    style: { width: w * 0.3, marginHorizontal: 4 * p, },
                    shadow: true,
                },
            },
            failOK: {
                negativeButton: {
                    preset: SGButton.preset.red,
                    style: { width: w * 0.3, marginHorizontal: 4 * p, },
                    shadow: true,
                },
                positiveButton: {
                    hidden: true,
                },
            },
            yesNo: {
                negativeButton: 
                {
                    preset: SGButton.preset.grey,
                    style: { width: w * 0.3, marginHorizontal: 4 * p, },
                    shadow: true,
                },
                positiveButton: {
                    preset: SGButton.preset.green,
                    style: { width: w * 0.3, marginHorizontal: 4 * p, },
                    shadow: true,
                },
            },
            inputBox: {
                negativeButton: {
                    preset: SGButton.preset.grey,
                    style: { width: w * 0.3, marginHorizontal: 4 * p, },
                    shadow: true,
                },
                positiveButton: {
                    preset: SGButton.preset.green,
                    style: { width: w * 0.3, marginHorizontal: 4 * p, },
                    shadow: true,
                },
            },
            loading: {
                negativeButton: {
                    hidden: true,
                },
                positiveButton: {
                    hidden: true,
                },
            },
            progress: {
                negativeButton: {
                    hidden: true,
                },
                positiveButton: {
                    hidden: true,
                },
            },
            pickerBox: {
                negativeButton: {
                    preset: SGButton.preset.grey,
                    style: { width: w * 0.3, marginHorizontal: 4 * p, },
                    shadow: true,
                },
                positiveButton: {
                    preset: SGButton.preset.green,
                    style: { width: w * 0.3, marginHorizontal: 4 * p, },
                    shadow: true,
                },
            },
            action: {
                negativeButton: {
                    preset: SGButton.preset.grey,
                    style: { width: w * 0.3, marginHorizontal: 4 * p, },
                    shadow: true,
                },
                positiveButton: {
                    preset: SGButton.preset.green,
                    style: { width: w * 0.3, marginHorizontal: 4 * p, },
                    shadow: true,
                },
            },
            toast: {
                negativeButton: {
                    hidden: true,
                },
                positiveButton: {
                    hidden: true,
                },
            },
            warning: {
               negativeButton: {
                   hidden: true,
               },
               positiveButton: {
                   preset: SGButton.preset.green,
                   style: { width: w * 0.3, marginHorizontal: 4 * p, },
                   shadow: true,
               },
            },
            webView: {
                negativeButton: {
                    hidden: true,
                },
                positiveButton: {
                    hidden: true,
                },
            },
        };
    }

    static _closeButtonPreset = {};
    static _initCloseButtonPreset() {
        var { w, h, p } = SGHelperWindow.getWHPNoHeader();
        SGDialogBox._closeButtonPreset = {
            successOK: {
                hidden: true
            },
            failOK: {
                hidden: true
            },
            yesNo: {
                hidden: true
            },
            inputBox: {
                hidden: true
            },
            loading: {
                hidden: true
            },
            progress: {
                hidden: true
            },
            pickerBox: {
                hidden: true
            },
            action: {
                style: { position: 'absolute', top: 2 * p, right: 2 * p, padding: 0, marginRight: 0, marginTop: 0, alignItems: 'center', color: 'white', borderRadius: 2 * p, width: w * 0.06, height: w * 0.06, backgroundColor: 'red', },
                name: SGIcon.Icon.close,
                iconPreset: SGIcon.preset.h6,
            },
            toast: {
                hidden: true
            },
            warning:{
               hidden: true
            },
            webView: {
                hidden: true
            },
        };
    }

    static _isPresetInit = false;
    static _initPreset() {
        if (!SGDialogBox._isPresetInit) {
            SGDialogBox._initViewPreset();
            SGDialogBox._initTitlePreset();
            SGDialogBox._initMessagePreset();
            SGDialogBox._initLinkPreset();
            SGDialogBox._initTextInputPreset();
            SGDialogBox._initPickerPreset();
            SGDialogBox._initIconPreset();
            SGDialogBox._initViewIconPreset();
            SGDialogBox._initButtonPreset();
            SGDialogBox._initCloseButtonPreset();
        }
    }
    constructor(props, context, ...args) {
        super(props, context, ...args);
        this.pvID = SGPopView.getPopViewID();
        this.dbID = this.props.dialogBoxID;
        this.state = { options: null };
        this.isOpened = false;
        SGDialogBox._initPreset();
        SGDialogBox.registerDialogBox(this.dbID, this.onShowHandler.bind(this), this.onHideHandler.bind(this))
        this.pvID2 = SGPopView.getPopViewID();
        this.pvID3 = SGPopView.getPopViewID();
        this.toastTimeOutID = null;
    }
    onProgressVarChange(v) {
        this.forceUpdate();
    }
    componentWillUnmount() {
        if (this.isOpened) { SGDialogBox._dialogOpened = false; }
        if (this.toastTimeOutID) { clearTimeout(this.toastTimeOutID); }
        SGDialogBox.removeDialogBox(this.dbID);
    }

    onShowHandler(options) {
        this.isOpened = true;
        this.setState({ options: options })
        if (options.preset === SGDialogBox.preset.webView) {
            this._showWebView(this.pvID3);
        } else {
            SGPopView.showPopView(this.pvID, true);
            if (options.preset === SGDialogBox.preset.progress) {
                SGHelperGlobalVar.addVar(options.globalVarName, 0, (v) => { this.onProgressVarChange(v) });
            } else if (options.preset === SGDialogBox.preset.toast) {
                this.toastTimeOutID = setTimeout(((onEnd)=>{
                    if(SGHelperType.isDefined(onEnd)){onEnd();}
                    SGPopView.hidePopView(this.pvID,true);
                    this.toastTimeOutID=null;
                }).bind(this,options.onEnd),1000);
            }
        }
    }

    onHideHandler() {
        this.isOpened = false;
        SGPopView.hidePopView(this.pvID, true);
    }

    onNegativeButtonPressHandler() {
        var options = this.state.options;
        if (options.onNegativeButtonPress) {
            options.onNegativeButtonPress();
        }
        this.isOpened = false;
        SGPopView.hidePopView(this.pvID, true);
        if (options.forceClose) SGDialogBox._dialogOpened = false;
    }
    onPositiveButtonPressHandler() {
        var options = this.state.options;
        if (options.onPositiveButtonPress) {
            options.onPositiveButtonPress();
        }
        this.isOpened = false;
        SGPopView.hidePopView(this.pvID, true);
        if (options.forceClose) SGDialogBox._dialogOpened = false;
    }
    _hideWebView(pvID){
        console.log('tutup');
        SGPopView.hidePopView(pvID,true);
    }
    _showWebView(pvID){
        console.log('hehe');
        SGPopView.showPopView(pvID,true);
    }
    render() {
        var options = this.state.options;
        var { w, h, p } = SGHelperWindow.getWHPNoHeader();
        if(SGHelperWindow.isLandscapeLeft()){
            var t = w; w=h; h=t;
        }
        var _noFade = options? (options.preset===SGDialogBox.preset.toast?true:false): false
        var _hideNegative = options? (options.preset===SGDialogBox.preset.successOK || options.preset===SGDialogBox.preset.loading || options.preset===SGDialogBox.preset.progress || options.preset===SGDialogBox.preset.toast || options.preset===SGDialogBox.preset.warning? true : false): false
       
        return (
            <>
            <SGPopView noFade={_noFade} accessible={true} accessibilityLabel={'SGDialogBoxRootPopView'} shadow noDialogBox animationType={'none'} popViewID={this.pvID} modal={options ? options.modal : false} onDismiss={() => { SGDialogBox._dialogOpened = false }}>
                {
                    options !== null &&
                    <SGView accessible={true} accessibilityLabel={'SGDialogBoxContentView'} {...SGDialogBox._viewPreset[options.preset]} {...options.view}>
                        <SGPopView popViewID={this.pvID2} on animationType={'slide'} vPos='Top'>
                            <SGView style={{ width: w - 6 * p, height: h*0.92, backgroundColor: '#FFFFFF', borderRadius: 0, justifyContent: 'flex-start' }}>
                                <SGWebView accessible={true} accessibilityLabel={'WebViewDialog'} style={{ width: w - 6 * p, height: h*0.92, backgroundColor: '#FFFFFF', borderRadius: 0, justifyContent: 'flex-start' }} source={{ uri: SGHelperType.isDefined(options.linkObject)?options.linkObject.url:''}} />
                                <SGTouchableOpacity style={{position:'absolute', top:p,right:p,  width: w * 0.1, height: w * 0.1, alignSelf: 'flex-end' }} onPress={() => { this._hideWebView(this.pvID2) }}>
                                    <SGIcon name={SGIcon.Icon.closecircle} preset={SGIcon.preset.h1} style={{ color: '#181818' }}></SGIcon>
                                </SGTouchableOpacity>
                            </SGView>
                        </SGPopView>
                        <SGView accessible={true} accessibilityLabel={'SGDialogBoxIconView'} {...SGDialogBox._viewIconPreset[options.preset]} >
                            <SGIcon accessible={true} accessibilityLabel={'SGDialogBoxIcon'} {...SGDialogBox._iconPreset[options.preset]} {...options.icon}  />
                        </SGView>
                        <SGText accessible={true} accessibilityLabel={'SGDialogBoxTitle'} {...SGDialogBox._titlePreset[options.preset]} {...options.title} />
                        <SGText accessible={true} accessibilityLabel={'SGDialogBoxMessage'} {...SGDialogBox._messagePreset[options.preset]} {...options.message} />
                        {
                            SGHelperType.isDefined(options.linkObject) &&
                            <SGText accessible={true} accessibilityLabel={'SGDialogBoxLink'} {...SGDialogBox._linkPreset[options.preset]} onPress={()=>{this._showWebView(this.pvID2);}}>{options.linkObject.label}</SGText>
                        }
                        {
                            options.preset === SGDialogBox.preset.progress &&
                            <SGText accessible={true} accessibilityLabel={'SGDialogBoxMessage'} {...SGDialogBox._messagePreset[options.preset]}>{SGHelperGlobalVar.getVar(options.globalVarName) + '%'}</SGText>
                        }
                        <SGTextInput accessible={true} accessibilityLabel={'SGDialogBoxInput'} {...SGDialogBox._textInputPreset[options.preset]} {...options.textInput} SGDialogInput={true} />
                        <SGPicker accessible={true} accessibilityLabel={'SGDialogBoxPicker'} {...SGDialogBox._pickerPreset[options.preset]} {...options.picker} SGDialogPicker={true} />
                        <SGView accessible={true} accessibilityLabel={'SGDialogBoxButtonView'} style={{ flexDirection: 'row', width: w * 0.85 }}>
                            <SGButton accessible={true} accessibilityLabel={'SGDialogBoxPositiveButton'} {...SGDialogBox._buttonPreset[options.preset].negativeButton} textPreset={SGText.preset.titleH3B} hidden={SGHelperGlobalVar.getVar("HideNegativeButton")==="Y"?true:_hideNegative} {...options.negativeButton} onPress={this.onNegativeButtonPressHandler.bind(this)} />
                            <SGButton accessible={true} accessibilityLabel={'SGDialogBoxNegativeButton'} {...SGDialogBox._buttonPreset[options.preset].positiveButton} textPreset={SGText.preset.titleH3B} {...options.positiveButton} onPress={this.onPositiveButtonPressHandler.bind(this)} />
                        </SGView>
                        <SGIconButton {...SGDialogBox._closeButtonPreset[options.preset]} onPress={this.onHideHandler.bind(this)} />
                    </SGView>
                }
            </SGPopView>
            <SGPopView noFade={_noFade} accessible={true} accessibilityLabel={'SGDialogBoxRootPopView'} shadow noDialogBox animationType={'none'} popViewID={this.pvID3} modal={options ? options.modal : false} onDismiss={() => { SGDialogBox._dialogOpened = false }}>
                {
                    options !== null &&
                    <SGView style={{ width: w - 6 * p, height: h*0.92, backgroundColor: '#FFFFFF', borderRadius: 0, justifyContent: 'flex-start' }}>
                        <SGWebView accessible={true} accessibilityLabel={'WebViewDialog'} style={{ width: w - 6 * p, height: h*0.92, backgroundColor: '#FFFFFF', borderRadius: 0, justifyContent: 'flex-start' }} source={{ uri: SGHelperType.isDefined(options)? (SGHelperType.isDefined(options.linkObject) ? options.linkObject.url : ''):'' }} />
                        <SGTouchableOpacity style={{position:'absolute', top:p,right:p,  width: w * 0.1, height: w * 0.1, alignSelf: 'flex-end' }} onPress={() => { this._hideWebView(this.pvID3) }}>
                            <SGIcon name={SGIcon.Icon.closecircle} preset={SGIcon.preset.h1} style={{ color: '#181818' }}></SGIcon>
                        </SGTouchableOpacity>
                    </SGView>
                }
            </SGPopView>

            </>
        );
    }

}

