/**
 * 1. have default preset and list of available preset
 * 2. shadow true|false and shadowIntensity prop
 * 3. disabled true|false
 * 4. hidden true|false
 * 5. value prop in array form
 * 6. validator prop
 * 7. onValueChange event
 * 8. on change will perform validation and display error icon when is not valid
 * 9. display popView screen showing error message when error icon pressed 
 * 10. label prop
 * 11. language prop
 * 12. hideText prop 
 * 13. ratio prop '16:9' | '9:9' | '9:16'
 * 14. imageFactor prop (0-1) represent multiplication factor of screen width
 * 15. maxImageCount prop
 * 16. showFlag prop 'ID'|'EN'|'CN'
 * 17. pngTransparent props
 */


import React from 'react';
import { SGView, SGText, SGImagePicker, SGIconButton, SGIcon, SGPopView, SGButton, SGImage } from '../control';
import { SGFormBaseContainer } from './SGFormBaseContainer';
import { SGHelperType, SGHelperGlobalVar, SGHelperStyle, SGHelperWindow } from '../helper';
import { SGFormErrorMessage } from './SGFormErrorMessage';
//buat SGPopMessage show message with timer to auto close, preset message type and appropriate icon

export class SGFormImagePicker extends SGFormBaseContainer {
    static preset = {
        default: 'default',
        t1: 't1',
        v1: 'v1',
        b1: 'b1',
        f1: 'f1'
    }
    static _isPresetInit = false;
    static _presetView = {};
    static _initPresetView() {
        var { w, h, p } = SGHelperWindow.getWHPNoHeader();
        SGFormImagePicker._presetView = {
            default: {
                style: {  width: w - 8 * p, padding: p, marginTop: 3 * p, backgroundColor: 'white', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap'},
            },
            v1: { width: w * 0.35, height: w * 0.35, padding: p, marginTop: 2 * p, backgroundColor: 'white', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', borderRadius: 100 },
            t1: {
                style: { backgroundColor: 'white', },
            },
            b1: {},
            f1: { 
                style: { width: w * 0.88, padding: p, marginTop: 3 * p, backgroundColor: 'white', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap'}
            }
        };
    }
    static _presetText = {};
    static _initPresetText() {
        var { w, h, p } = SGHelperWindow.getWHPNoHeader();
        SGFormImagePicker._presetText = {
            default: {
                style: { color: 'black' },
                preset: SGText.preset.titleH3,
                numberOfLines: 1,
            },
            v1: {},
            t1: {
                style: { color: 'black' },
                preset: SGText.preset.titleH3,
                numberOfLines: 1,
            },
            b1: {},
            f1: {
                style: { color: 'black' },
                preset: SGText.preset.titleH3,
                numberOfLines: 1,

            }
        };
    }
    static _presetImagePicker = {};
    static _initPresetImagePicker() {
        var { w, h, p } = SGHelperWindow.getWHPNoHeader();
        SGFormImagePicker._presetImagePicker = {
            default: {
                style: { width: w - 10 * p, marginHorizontal: 0, padding: 0, marginTop:0, },
                previewStyle: { marginHorizontal: 0, padding: 0, marginTop:0, },
                imageButtonStyle: {},
                addButtonStyle: {},
            },
            v1: {
                style: { borderWidth: 0, width: w * 0.15, height: w * 0.15, marginHorizontal: 0, padding: 0, minHeight: w * 0.1, borderRadius: 100 },
                imageButtonStyle: {},
                addButtonStyle: {},
            },
            t1: {},
            b1: {},
            f1: {
                style: { width: w * 0.86, marginHorizontal: 0, padding: 0, marginTop:0, },
                previewStyle: { marginHorizontal: 0, padding: 0, marginTop:0, },
                imageButtonStyle: {},
                addButtonStyle: {},
            }
        };
    }
    static _presetIconButton = {};
    static _initPresetIconButton() {
        var { w, h, p } = SGHelperWindow.getWHPNoHeader();
        SGFormImagePicker._presetIconButton = {
            default: {
                style: { color: 'red' },
                preset: SGIconButton.preset.default,
                textPreset: SGText.preset.titleH3,
            },
            v1: {},
            t1: {},
            b1: {},
            f1: {
                style: { color: 'red' },
                preset: SGIconButton.preset.default,
                textPreset: SGText.preset.titleH3,
            }
        };
    }

    static _initPreset() {
        if (!SGFormImagePicker._isPresetInit) {
            SGFormImagePicker._initPresetView();
            SGFormImagePicker._initPresetText();
            SGFormImagePicker._initPresetImagePicker();
            SGFormImagePicker._initPresetIconButton();
            SGFormImagePicker._isPresetInit = true;
        }
    }

    constructor(props, context, ...args) {
        super(props, context, ...args);
        SGFormImagePicker._initPreset();
        this.pvID = SGPopView.getPopViewID();
        this._isValueInit = false;
        this._renderBySelf = false;
    }

    initValue() {
        if (!this._isValueInit) {
            this._value = this.props.value;
            super.validateValue();
            this.state = { value: this._value, showError: this._showError, errMessage: this._errMessage };
            this._isValueInit = true;
        } else if (!this._renderBySelf || this.props.stateless) {
            this._value = this.props.value;
            super.validateValue();
        }
    }

    onValueChangeHandler(v) {
        this._value = v;
        super.validateValue();
        if (!this.props.stateless) {
            this._renderBySelf = true;
            this.setState({ value: this._value, showError: this._showError, errMessage: this._errMessage });
        }
        if (SGHelperType.isDefined(this.props.onValueChange)) this.props.onValueChange(v);
    }
    onShowErrorHandler() {
        SGPopView.showPopView(this.pvID);
    }
    render() {
        this.initValue();
        var { w, h, p } = this._screenWHPNoHeader
        this._renderBySelf = false;
        var disabled = this.props.disabled;
        var hidden = this.props.hidden;
        var pickerProp = { previewMode: this.props.previewMode, hideText: this.props.hideText, ratio: this.props.ratio, imageFactor: this.props.imageFactor, maxImageCount: this.props.maxImageCount, shadow: this.props.shadow, shadowIntensity: this.props.shadowIntensity, language: this.props.language, disabled: this.props.disabled,noreview:this.props.noreview  };
        var pr = SGHelperType.isDefined(this.props.preset) ? this.props.preset : SGFormImagePicker.preset.default;
        return (
            <SGView accessible={true} accessibilityLabel={'SGFormImagePickerRootView'} hidden={hidden} {...SGFormImagePicker._presetView[pr]}>
                <SGView accessible={true} accessibilityLabel={'SGFormImagePickerRowView'} style={{ flexDirection: 'row', marginBottom:2*p}}>
                    <SGImage accessible={true} accessibilityLabel={'SGFormTextInputFlagImage'} hidden={this.props.showFlag ? false : true} preset={SGImage.preset.w20S} source={SGFormBaseContainer.flagImage[this.props.showFlag ? this.props.showFlag : 'ID']} />
                    <SGText accessible={true} accessibilityLabel={'SGFormImagePickerText'} hidden={this.props.hideLabel ? true : false} {...SGFormImagePicker._presetText[pr]}>{this.props.label}</SGText>
                </SGView>
                <SGIconButton accessible={true} accessibilityLabel={'SGFormImagePickerErrorIconButton'} hidden={!this._showError} {...SGFormImagePicker._presetIconButton[pr]} name={SGIcon.Icon.error} onPress={this.onShowErrorHandler.bind(this)} />
                <SGView style={{ width: '100%', alignItems: 'flex-start' }}>
                    <SGImagePicker pngTransparent={this.props.pngTransparent} accessible={true} accessibilityLabel={'SGFormImagePickerUData'} userData={this.props.userData} userDataApp={this.props.userDataApp} label={this.props.label} {...pickerProp} stateless {...SGFormImagePicker._presetImagePicker[pr]} value={this._value} onValueChange={this.onValueChangeHandler.bind(this)} />
                </SGView>
                <SGFormErrorMessage accessible={true} accessibilityLabel={'SGFormImagePickerErrorMessage'} preset={SGFormErrorMessage.preset.default} popViewID={this.pvID} errMessage={this._errMessage} />
            </SGView>
        );
    }
} 
