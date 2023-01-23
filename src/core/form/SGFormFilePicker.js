/**
 * 1. have default preset and list of available preset
 * 2. shadow true|false and shadowIntensity prop
 * 3. disabled true|false
 * 4. hidden true|false
 * 5. value prop
 * 6. validator prop
 * 7. onValueChange event
 * 8. on change will perform validation and display error icon when is not valid
 * 9. display popView screen showing error message when error icon pressed 
 * 10. label prop
 * 11. language prop
 * 12. fileType prop 
 * 13. maxSize prop in bytes
 * 14. showFlag prop 'ID'|'EN'|'CN'
 * 15. placeholder prop to be shown when no file selected
 */

import React from 'react';
import { SGView, SGText, SGFilePicker, SGIconButton, SGIcon, SGPopView, SGButton, SGImage } from '../control';
import { SGFormBaseContainer } from './SGFormBaseContainer';
import { SGHelperType, SGHelperGlobalVar, SGHelperStyle, SGHelperWindow } from '../helper';
import { SGFormErrorMessage } from './SGFormErrorMessage';
//buat SGPopMessage show message with timer to auto close, preset message type and appropriate icon

export class SGFormFilePicker extends SGFormBaseContainer {
    static preset = {
        default: 'default',
        t1: 't1',
        v1: 'v1',
        b1: 'b1',
    }
    static _isPresetInit = false;
    static _presetView = {};
    static _initPresetView() {
        var { w, h, p } = SGHelperWindow.getWHPNoHeader();
        SGFormFilePicker._presetView = {
            default: {
                style: { width: w - 8 * p, padding: p, marginTop: 3 * p, backgroundColor: 'white', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' },
            },
            v1: {},
            t1: {
                style: { backgroundColor: 'white', },
            },
            b1: {}
        };
    }
    static _presetText = {};
    static _initPresetText() {
        var { w, h, p } = SGHelperWindow.getWHPNoHeader();
        SGFormFilePicker._presetText = {
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
            b1: {}
        };
    }
    static _presetFilePicker = {};
    static _initPresetFilePicker() {
        var { w, h, p } = SGHelperWindow.getWHPNoHeader();
        SGFormFilePicker._presetFilePicker = {
            default: {
                style: { width: w - 10 * p, marginHorizontal: 0, padding: 0, marginTop:0,  },
                buttonPreset: SGButton.preset.noBorder,
                textPreset: SGText.preset.titleH3,
                textStyle: {},
            },
            v1: {},
            t1: {
                style: { width: (w - 6 * p) / 2, marginHorizontal: 0, padding: 0, minHeight: w * 0.11, borderRadius: 3 * p, borderWidth: p * 0.02, },
                buttonPreset: SGButton.preset.noBorder,
                textPreset: SGText.preset.titleH3,
                textStyle: {},
            },
            b1: {}
        };
    }
    static _presetIconButton = {};
    static _initPresetIconButton() {
        var { w, h, p } = SGHelperWindow.getWHPNoHeader();
        SGFormFilePicker._presetIconButton = {
            default: {
                style: { color: 'red' },
                preset: SGIconButton.preset.default,
                textPreset: SGText.preset.titleH3,
            },
            v1: {},
            t1: {},
            b1: {}
        };
    }

    static _initPreset() {
        if (!SGFormFilePicker._isPresetInit) {
            SGFormFilePicker._initPresetView();
            SGFormFilePicker._initPresetText();
            SGFormFilePicker._initPresetFilePicker();
            SGFormFilePicker._initPresetIconButton();
            SGFormFilePicker._isPresetInit = true;
        }
    }

    constructor(props, context, ...args) {
        super(props, context, ...args);
        SGFormFilePicker._initPreset();
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
        var pickerProp = { shadow: this.props.shadow, shadowIntensity: this.props.shadowIntensity, language: this.props.language, disabled: this.props.disabled };
        var pr = SGHelperType.isDefined(this.props.preset) ? this.props.preset : SGFormFilePicker.preset.default;
        return (
            <SGView accessible={true} accessibilityLabel={'SGFormFilePickerRootView'} hidden={hidden} {...SGFormFilePicker._presetView[pr]}>
                <SGView accessible={true} accessibilityLabel={'SGFormFilePickerTopView'} style={{flexDirection: 'row', marginBottom:0}}>
                    <SGImage accessible={true} accessibilityLabel={'SGFormTextInputFlagImage'} hidden={this.props.showFlag ? false : true} preset={SGImage.preset.w20S} source={SGFormBaseContainer.flagImage[this.props.showFlag ? this.props.showFlag : 'ID']} />
                    <SGText accessible={true} accessibilityLabel={'SGFormFilePickerText'} {...SGFormFilePicker._presetText[pr]}>{this.props.label}</SGText>
                </SGView>
                <SGIconButton accessible={true} accessibilityLabel={'SGFormFilePickerErrorIcon'} hidden={!this._showError} {...SGFormFilePicker._presetIconButton[pr]} name={SGIcon.Icon.error} onPress={this.onShowErrorHandler.bind(this)} />
                <SGFilePicker accessible={true} accessibilityLabel={'SGFormFilePicker2'} label={this.props.label} placeholder={this.props.placeholder} {...pickerProp} fileType={this.props.fileType} maxSize={this.props.maxSize} stateless {...SGFormFilePicker._presetFilePicker[pr]} value={this._value} onValueChange={this.onValueChangeHandler.bind(this)} />
                <SGFormErrorMessage accessible={true} accessibilityLabel={'SGFormFilePickerErrorMessage'} preset={SGFormErrorMessage.preset.default} popViewID={this.pvID} errMessage={this._errMessage} />
            </SGView>
        );
    }
} 