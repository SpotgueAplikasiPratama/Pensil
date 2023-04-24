/**
 * Custom component to pick, upload, and get the uploaded URL of the document file
 * 1. default style and user can customize
 * 2. shadow true|false with shadow intensity
 * 3. hidden true|false
 * 4. disabled true|false
 * 5. value prop is server URL location
 * 6. after file picked, it is uploaded to server that will return the URL and trigger onValueChange
 *    temporarily it will copy to local folder and return the uri
 * 7. maxSize prop is 8 MB by default
 * 8. preview button to open in a popUpView via webview component
 * 9. fileType prop
 * 10. label prop to be displayed on the popup menu for upload and preview
 * 11. placeholder prop to be shown when no file selected
 * 12. darkMode true|false
 */

import React from 'react';
import { SGFilePicker as labels } from '../locale/lang.json';
import { Platform, PermissionsAndroid } from 'react-native';
import { StyleSheet } from 'react-native';
import { SGView } from './SGView';
import { SGPopView } from './SGPopView';
import { SGText } from './SGText';
import { SGBaseControl } from '../../core/control/SGBaseControl';
import { SGIcon } from './SGIcon';
import { SGTouchableOpacity } from './SGTouchableOpacity';
import { SGIconButton } from './SGIconButton';
import { SGButton } from './SGButton';
import { SGHelperType, SGHelperStyle, SGHelperWindow } from '../helper';
import { SGDialogBox } from './SGDialogBox';
import DocumentPicker from 'react-native-document-picker';
import RNFetchBlob from 'react-native-blob-util';
import Pdf from 'react-native-pdf';
import { tbCPdfUploadAPI } from '../api/tbCPdfUploadAPI';
import RNFS from 'react-native-fs';

export class SGFilePicker extends SGBaseControl {
    static fileType = {
        image: DocumentPicker.types.images,
        pdf: DocumentPicker.types.pdf,
        all: DocumentPicker.types.allFiles,
    }
    static preset = {
        default: 'default',
        disabled: 'disabled',
    }
    static _presetProps = {};
    static _isPresetInit = false;
    static _initPreset() {
        if (!SGFilePicker._isPresetInit) {
            var { w, h, p } = SGHelperWindow.getWHPNoHeader();
            SGFilePicker._presetProps = {
                light:{
                    default: StyleSheet.create({
                        v1: { width: w - 12 * p, marginVertical: 2 * p, paddingVertical: 0, borderRadius: 2*p, borderColor: SGHelperStyle.color.SGFilePicker.Border, borderWidth: p / 4, backgroundColor: SGHelperStyle.color.SGFilePicker.BGWhite },
                        v2: { width: '100%', flexDirection: 'row', justifyContent: 'space-between', paddingLeft: 3 * p, paddingRight: p, paddingVertical: 2 * p },
                        pv1: { paddingHorizontal: 3 * p, backgroundColor: SGHelperStyle.color.SGFilePicker.PVBGBlack, width: w, height: h * 0.75, borderTopLeftRadius: 5 * p, borderTopRightRadius: 5 * p, },
                        pv1_t1: { alignSelf: 'flex-start',color:SGHelperStyle.color.SGFilePicker.TextWhite,marginVertical:2*p   },
                        t1: { flex: 1, color:SGHelperStyle.color.SGFilePicker.TextBlack },
                        icon1: { marginVertical: 0, paddingVertical: 0 },
                        pv3: { padding: 4 * p, backgroundColor: SGHelperStyle.color.SGFilePicker.PVBGBlack, borderColor: SGHelperStyle.color.borderColor, width: w, height: h *0.75, borderTopLeftRadius: 5 * p, borderTopRightRadius: 5 * p, },
                        pv3_t1: { alignSelf: 'flex-start',color:SGHelperStyle.color.SGFilePicker.TextWhite },
                        pv3_t2: { alignSelf: 'flex-start',color:SGHelperStyle.color.SGFilePicker.TextWhite, marginBottom:2*p },
                        pv3_t3: { alignSelf: 'flex-start',color:SGHelperStyle.color.SGFilePicker.TextWhite, marginVertical:2*p },
                        pv3_v1: { flexDirection: 'row', justifyContent: 'space-between', },
                        pv3_b1: { marginHorizontal: 2 * p },
                        to1: { backgroundColor: SGHelperStyle.color.SGDatePicker.PVBGWhite, width: w * 0.14, height: w * 0.009, marginVertical: 2 * p, borderRadius: 5 * p },
                    }),
                    disabled: StyleSheet.create({
                        v1: { width: w - 12 * p, marginVertical: 2 * p, paddingVertical: 0, borderRadius: 2*p, borderColor: SGHelperStyle.color.SGFilePicker.Border, borderWidth: p / 4, backgroundColor: SGHelperStyle.color.SGFilePicker.BGDisabled },
                        v2: { width: '100%', flexDirection: 'row', justifyContent: 'space-between', paddingLeft: 3 * p, paddingRight: p, paddingVertical: 2 * p },
                        pv1: { paddingHorizontal: 3 * p, backgroundColor: SGHelperStyle.color.SGFilePicker.PVBGBlack, width: w, height: h * 0.75, borderTopLeftRadius: 5 * p, borderTopRightRadius: 5 * p, },
                        pv1_t1: { alignSelf: 'flex-start',color:SGHelperStyle.color.SGFilePicker.TextWhite,marginVertical:2*p   },
                        t1: { flex: 1, color:SGHelperStyle.color.SGFilePicker.TextDisabled },
                        icon1: { marginVertical: 0, paddingVertical: 0 },
                        pv3: { padding: 4 * p, backgroundColor: SGHelperStyle.color.SGFilePicker.PVBGBlack, borderColor: SGHelperStyle.color.borderColor, width: w, height: h *0.75, borderTopLeftRadius: 5 * p, borderTopRightRadius: 5 * p, },
                        pv3_t1: { alignSelf: 'flex-start',color:SGHelperStyle.color.SGFilePicker.TextWhite },
                        pv3_t2: { alignSelf: 'flex-start',color:SGHelperStyle.color.SGFilePicker.TextWhite, marginBottom:2*p },
                        pv3_t3: { alignSelf: 'flex-start',color:SGHelperStyle.color.SGFilePicker.TextWhite, marginVertical:2*p },
                        pv3_v1: { flexDirection: 'row', justifyContent: 'space-between', },
                        pv3_b1: { marginHorizontal: 2 * p },
                        to1: { backgroundColor: SGHelperStyle.color.SGDatePicker.PVBGWhite, width: w * 0.14, height: w * 0.009, marginVertical: 2 * p, borderRadius: 5 * p },
                    }),
                },
                dark:{
                    default: StyleSheet.create({
                        v1: { width: w - 12 * p, marginVertical: 2 * p, paddingVertical: 0, borderRadius: 2*p, borderColor: SGHelperStyle.color.SGFilePicker.Border, borderWidth: p / 4, backgroundColor: SGHelperStyle.color.SGFilePicker.BGWhite },
                        v2: { width: '100%', flexDirection: 'row', justifyContent: 'space-between', paddingLeft: 3 * p, paddingRight: p, paddingVertical: 2 * p },
                        pv1: { paddingHorizontal: 3 * p, backgroundColor: SGHelperStyle.color.SGFilePicker.PVBGWhite, width: w, height: h * 0.75, borderTopLeftRadius: 5 * p, borderTopRightRadius: 5 * p, },
                        pv1_t1: { alignSelf: 'flex-start',color:SGHelperStyle.color.SGFilePicker.TextBlack,marginVertical:2*p   },
                        t1: { flex: 1, color:SGHelperStyle.color.SGFilePicker.TextBlack },
                        icon1: { marginVertical: 0, paddingVertical: 0 },
                        pv3: { padding: 4 * p, backgroundColor: SGHelperStyle.color.SGFilePicker.PVBGWhite, borderColor: SGHelperStyle.color.borderColor, width: w, height: h *0.75, borderTopLeftRadius: 5 * p, borderTopRightRadius: 5 * p, },
                        pv3_t1: { alignSelf: 'flex-start',color:SGHelperStyle.color.SGFilePicker.TextBlack },
                        pv3_t2: { alignSelf: 'flex-start',color:SGHelperStyle.color.SGFilePicker.TextBlack, marginBottom:2*p },
                        pv3_t3: { alignSelf: 'flex-start',color:SGHelperStyle.color.SGFilePicker.TextBlack, marginVertical:2*p },
                        pv3_v1: { flexDirection: 'row', justifyContent: 'space-between', },
                        pv3_b1: { marginHorizontal: 2 * p },
                        to1: { backgroundColor: SGHelperStyle.color.SGDatePicker.PVBGBlack, width: w * 0.14, height: w * 0.009, marginVertical: 2 * p, borderRadius: 5 * p },
                    }),
                    disabled: StyleSheet.create({
                        v1: { width: w - 12 * p, marginVertical: 2 * p, paddingVertical: 0, borderRadius: 2*p, borderColor: SGHelperStyle.color.SGFilePicker.Border, borderWidth: p / 4, backgroundColor: SGHelperStyle.color.SGFilePicker.BGDisabled },
                        v2: { width: '100%', flexDirection: 'row', justifyContent: 'space-between', paddingLeft: 3 * p, paddingRight: p, paddingVertical: 2 * p },
                        pv1: { paddingHorizontal: 3 * p, backgroundColor: SGHelperStyle.color.SGFilePicker.PVBGWhite, width: w, height: h * 0.75, borderTopLeftRadius: 5 * p, borderTopRightRadius: 5 * p, },
                        pv1_t1: { alignSelf: 'flex-start',color:SGHelperStyle.color.SGFilePicker.TextBlack,marginVertical:2*p   },
                        t1: { flex: 1, color:SGHelperStyle.color.SGFilePicker.TextDisabled },
                        icon1: { marginVertical: 0, paddingVertical: 0 },
                        pv3: { padding: 4 * p, backgroundColor: SGHelperStyle.color.SGFilePicker.PVBGWhite, borderColor: SGHelperStyle.color.borderColor, width: w, height: h *0.75, borderTopLeftRadius: 5 * p, borderTopRightRadius: 5 * p, },
                        pv3_t1: { alignSelf: 'flex-start',color:SGHelperStyle.color.SGFilePicker.TextBlack },
                        pv3_t2: { alignSelf: 'flex-start',color:SGHelperStyle.color.SGFilePicker.TextBlack, marginBottom:2*p },
                        pv3_t3: { alignSelf: 'flex-start',color:SGHelperStyle.color.SGFilePicker.TextBlack, marginVertical:2*p },
                        pv3_v1: { flexDirection: 'row', justifyContent: 'space-between', },
                        pv3_b1: { marginHorizontal: 2 * p },
                        to1: { backgroundColor: SGHelperStyle.color.SGDatePicker.PVBGBlack, width: w * 0.14, height: w * 0.009, marginVertical: 2 * p, borderRadius: 5 * p },
                    }),
                },
            };
            SGFilePicker._isPresetInit = true;
        }
    }

    onShowPreviewHandler() {
        if (this._value !== '') { SGPopView.showPopView(this.pvID1) };
    }
    onHidePreviewHandler() {
        SGPopView.hidePopView(this.pvID1);
    }
    onPDFError(e) {
        var a = String(e).toLowerCase();
        var b = 'Error: Password required or incorrect password.'.toLowerCase();
        if (a === b) {
            SGDialogBox.showFail(null, this.labels[this._lang].errorTitle, this.labels[this._lang].pdfPassword, this.labels[this._lang].close, () => { });
        }
    }

    async pickSingle() {
        try {
            // const res = await DocumentPicker.pick({ type: SGHelperType.isDefined(this.props.fileType) ? this.props.fileType : [SGFilePicker.fileType.all], });
            const _res = await DocumentPicker.pick({ type: SGHelperType.isDefined(this.props.fileType) ? this.props.fileType : [SGFilePicker.fileType.all], });
            const res = Array.isArray(_res)?_res[0]:_res;
            var maxSize = SGHelperType.isDefined(this.props.maxSize) ? this.props.maxSize : 8 * 1024 * 1024;
            var maxSizeLabel = (maxSize >= 1024 * 1024 ? Math.floor(maxSize / 1024 / 1024 * 10) / 10.0 + 'MB' : Math.floor(maxSize / 1024 * 10) / 10.0 + 'KB');
            if (res.size <= maxSize) {
                this._DBID = SGDialogBox.showLoading(this.labels[this._lang].uploading);
                var arr = res.name.split('.');
                var ext = arr[arr.length - 1];
                var newName = SGHelperType.getGUID() + '.' + ext;
                this._newPath = (Platform.OS === 'android' ? RNFetchBlob.fs.dirs.MainBundleDir : RNFetchBlob.fs.dirs.DocumentDir) + '/' + newName;
                if (Platform.OS === 'ios') {
                    var uri = decodeURIComponent(res.uri);
                    var str = (SGHelperType.left(uri, 6) === 'file:/') ? SGHelperType.right(uri, uri.length - 7) : uri;
                    RNFetchBlob.fs.stat(str).then((v) => {
                        this._srcPath = v.path;
                        RNFetchBlob.fs.cp(this._srcPath, this._newPath)
                            .then(() => {
                                super.mySetState({}); //to show the pdf preview
                                SGDialogBox.hideDialogBox(this._DBID);
                                SGPopView.showPopView(this.pvID3);
                            }).catch((e) => {
                                SGDialogBox.hideDialogBox(this._DBID);
                                SGDialogBox.showFail(null, this.labels[this._lang].errorTitle, this.labels[this._lang].errorLoad, this.labels[this._lang].close, () => { });
                                console.log(e);
                            });
                    }).catch((e) => {
                        SGDialogBox.hideDialogBox(this._DBID);
                        SGDialogBox.showFail(null, this.labels[this._lang].errorTitle, this.labels[this._lang].errorLoad, this.labels[this._lang].close, () => { });
                        console.log(e);
                    });
                } else {
                    PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE).then((granted) => {
                        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                            PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE).then((granted) => {
                                if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                                    PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE).then((granted) => {
                                        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                                            RNFS.copyFile(res.uri, this._newPath).then((response) => {
                                                this._newPath = 'file://'+this._newPath;
                                                super.mySetState({}); //to show the pdf preview
                                                SGDialogBox.hideDialogBox(this._DBID);
                                                SGPopView.showPopView(this.pvID3);
                                            }).catch((e) => {
                                                SGDialogBox.hideDialogBox(this._DBID);
                                                SGDialogBox.showFail(null, this.labels[this._lang].errorTitle, this.labels[this._lang].errorLoad, this.labels[this._lang].close, () => { });
                                                console.log(e);
                                            });
                                        }
                                    });
                                }
                            });
                        }
                    });
                }
            } else {
                SGDialogBox.showFail(null, this.labels[this._lang].errorTitle, this.labels[this._lang].errorSize + maxSizeLabel, this.labels[this._lang].close, () => { });
            }
        } catch (err) {
            if (DocumentPicker.isCancel(err)) {
                // User cancelled the picker, exit any dialogs or menus and move on
            } else {
                SGDialogBox.showFail(null, this.labels[this._lang].errorTitle, this.labels[this._lang].errorLoad, this.labels[this._lang].close, () => {
                    SGPopView.hidePopView(this.pvID3);
                });
            }
        }
    }

    async uploadPdf(path, callbackSuccess, callbackError) {
        var pdfJSON = {};
        var xhr = new XMLHttpRequest();
        xhr.open("GET", path, true);
        xhr.responseType = "blob";
        xhr.onerror = async function (e) { callbackError(e); }
        xhr.onload = async function (e) {
            var reader = new FileReader();
            reader.onload = async function (event) {
                var res = event.target.result;
                var base64 = res.replace(/^data:application\/pdf+;base64,/, "");
                pdfJSON = await tbCPdfUploadAPI.uploadPdf(base64);
                callbackSuccess(pdfJSON);
            }
            var file = this.response;
            reader.readAsDataURL(file)
        };
        xhr.send();
    }

    onYesHandler() {
        this._DBID = SGDialogBox.showLoading(this.labels[this._lang].uploading);
         this.uploadPdf(this._newPath,
            (res) => {
                this._value = res.fPdfUrl;
                if (!this.props.stateless) { super.mySetState({ value: this._value }); }
                if (this.props.onValueChange) { this.props.onValueChange(this._value) }
                RNFetchBlob.fs.unlink(this._newPath).then(() => { }).catch((e) => { console.log(e); });
                SGPopView.hidePopView(this.pvID3);
                SGDialogBox.hideDialogBox(this._DBID);
            },
            (e) => {
                SGDialogBox.hideDialogBox(this._DBID);
                SGPopView.hidePopView(this.pvID3);
                RNFetchBlob.fs.unlink(this._newPath).then(() => { }).catch((e) => { console.log(e); });
                SGDialogBox.showFail(null, this.labels[this._lang].errorTitle, this.labels[this._lang].errorLoad, this.labels[this._lang].close, () => {
                });
            })
    }

    onNoHandler() {
        SGPopView.hidePopView(this.pvID3);
        RNFetchBlob.fs.unlink(this._newPath).then(() => { }).catch((e) => { console.log(e); });
    }

    // onYesHandler() {
    //     this._DBID = SGDialogBox.showLoading(this.labels[this._lang].uploading);
    //     //perform file upload to server via API
    //     //>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    //     var isFileUploaded = true;

    //     SGDialogBox.hideDialogBox(this._DBID);
    //     if (isFileUploaded) {
    //         this._value = this._newPath;
    //         var arr = this._value.split('/');
    //         this._displayValue = arr[arr.length - 1];
    //         if (!this.props.stateless) { super.mySetState({ value: this._value }); }
    //         if (this.props.onValueChange) {
    //             this.props.onValueChange(this._value);
    //         }
    //         SGPopView.hidePopView(this.pvID3);
    //     } else {
    //         //show error from API then erase temp File
    //         SGDialogBox.showFail(null, this.labels[this._lang].errorTitle, this.labels[this._lang].errorLoad, this.labels[this._lang].close, () => {
    //             SGPopView.hidePopView(this.pvID3);
    //             RNFetchBlob.fs.unlink(this._newPath).then(() => {}).catch((e) => {console.log(e);});
    //         });
    //     }
    // }

    // onNoHandler() {
    //     SGPopView.hidePopView(this.pvID3);
    //     RNFetchBlob.fs.unlink(this._newPath).then(() => { }).catch((e) => { console.log(e);});
    // }

    constructor(props, context, ...args) {
        super(props, context, ...args);
        this.labels = labels;
        SGFilePicker._initPreset();
        this.pvID1 = SGPopView.getPopViewID();
        this.pvID3 = SGPopView.getPopViewID();
        this.initStateEvt = () => {
            // var arr = this._value.split('/');
            // this._displayValue = arr[arr.length - 1];
            this.state = { value: this._value, };
        }
    }

    initProps() {
        if (super.isPropsNeedInitOrChanged(this.props)) {
            this._lang = this.props.language ? this.props.language : 'ID';
            this.style = SGFilePicker._presetProps[this.props.darkMode?'dark':'light'][this.props.disabled? SGFilePicker.preset.disabled : this.props.preset ? this.props.preset : SGFilePicker.preset.default];
            this.vStyle = [this.style.v1, this.props.style];
            if (this.props.hidden) {
                this.vStyle = { width: 0, height: 0, margin: 0, overflow: 'hidden' }
            } else {
                if (this.props.shadow && !this.props.disabled) {
                    this.vStyle = SGHelperStyle.addShadowStyle(this.vStyle, this.props.shadowIntensity);
                }
            }
        }
    }

    render() {
        var {w,h,p} = SGHelperWindow.getWHPNoHeader();
        this.initProps();
        super.initValue(SGHelperType.isDefined(this.props.value) ? this.props.value : '', this.props.stateless, this.initStateEvt, this.initStateEvt);
        var style = this.style;
        var vStyle = SGHelperType.copyJSON(this.vStyle);
        return (
            !this.props.hidden &&
            <SGView accessible={true} accessibilityLabel={'SGFilePickerRootView'} style={SGHelperType.copyJSON(this.vStyle)} >
                <SGTouchableOpacity disabled={this.props.disabled} onPress={this.pickSingle.bind(this)}>
                <SGView accessible={true} accessibilityLabel={'SGFilePickerTitleView'} style={style.v2} >
                    <SGText accessible={true} accessibilityLabel={'SGFilePickerValueText'} disabled={this.props.disabled} preset={this.props.textPreset} numberOfLines={1} style={[style.t1, this.props.textStyle, this._value === '' && !this.props.disabled ? { color: SGHelperStyle.color.SGFilePicker.TextPlaceholder } : null]}>{this._value === '' ? this.props.placeholder : this._value}</SGText>
                    <SGIconButton accessible={true} accessibilityLabel={'SGFilePickerPreviewIconButton'} disabled={this.props.disabled} name={SGIcon.Icon.preview2} iconPreset={SGIcon.preset.h4} onPress={this.onShowPreviewHandler.bind(this)} />
                </SGView>
                </SGTouchableOpacity>
                <SGPopView accessible={true} accessibilityLabel={'SGFilePickerPopView1'} animationType={'slide'} popViewID={this.pvID1} vPos='bottom'>
                    <SGView accessible={true} accessibilityLabel={'SGFilePickerMidView'} style={style.pv1} >
                        <SGTouchableOpacity style={style.to1} onPress={this.onHidePreviewHandler.bind(this)}></SGTouchableOpacity>
                        <SGText accessible={true} accessibilityLabel={'SGFilePickerLabelText'} preset={SGText.preset.h5B} style={style.pv1_t1} hidden={SGHelperType.isDefined(this.props.label) ? false : true}>{this.props.label}</SGText>
                        <Pdf accessible={true} accessibilityLabel={'SGFilePickerPDF1'} onError={this.onPDFError.bind(this)} style={{ flex: 1, alignSelf: 'stretch', borderRadius:2*p }} source={{ uri: this._value }} />
                    </SGView>
                </SGPopView>
                <SGPopView accessible={true} accessibilityLabel={'SGFilePickerPopView2'} modal animationType={'slide'} popViewID={this.pvID3} vPos='bottom'>
                    <SGView accessible={true} accessibilityLabel={'SGFilePickerBottomView'} style={style.pv3} >
                        <SGTouchableOpacity style={style.to1} onPress={this.onNoHandler.bind(this)}></SGTouchableOpacity>
                        <SGText accessible={true} accessibilityLabel={'SGFilePickerIsDefinedText'} preset={SGText.preset.h4B} style={style.pv3_t1} hidden={SGHelperType.isDefined(this.props.label) ? false : true}>{this.props.label}</SGText>
                        <SGText accessible={true} accessibilityLabel={'SGFilePickerFileUpText'} style={style.pv3_t2} preset={SGText.preset.h6B}>{this.labels[this._lang].fileUpload}</SGText>
                        <Pdf accessible={true} accessibilityLabel={'SGFilePickerPDF2'} onError={this.onPDFError.bind(this)} style={{ flex: 1, alignSelf: 'stretch', borderRadius:2*p}} source={{ uri: this._newPath }} />
                        <SGText accessible={true} accessibilityLabel={'SGFilePickerConfMessageText'} style={style.pv3_t3}>{this.labels[this._lang].confirmMessage}</SGText>
                        <SGView accessible={true} accessibilityLabel={'SGFilePickerButtonView'} style={style.pv3_v1}>
                            <SGButton accessible={true} accessibilityLabel={'SGFilePickerNoButton'} style={style.pv3_b1} preset={SGButton.preset.grey} label={this.labels[this._lang].no} onPress={this.onNoHandler.bind(this)} />
                            <SGButton accessible={true} accessibilityLabel={'SGFilePickerYesButton'} style={style.pv3_b1} preset={SGButton.preset.green} label={this.labels[this._lang].yes} onPress={this.onYesHandler.bind(this)} />
                        </SGView>
                    </SGView>
                </SGPopView>
            </SGView>
        );
    }
}
