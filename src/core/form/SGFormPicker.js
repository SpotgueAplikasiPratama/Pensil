/**
 * 1. have default preset and list of available preset
 * 2. shadow true|false and shadowIntensity prop
 * 3. disabled true|false
 * 4. hidden true|false
 * 5. receive array of key-title JSON via prop optionList
 * 6. value prop
 * 7. validator prop
 * 8. onValueChange event
 * 9. on change will perform validation and display error icon when is not valid
 * 10. display popView screen showing error message when error icon pressed 
 * 11. label prop
 * 12. single true|false
 * 13. mandatory true|false
 * 14. language prop
 * 15. filterMode true|false
 * 16. showFlag prop 'ID'|'EN'|'CN'
 */


import React from 'react';
import { SGView, SGText, SGPicker, SGIconButton, SGIcon, SGPopView, SGImage } from '../control';
import { SGFormBaseContainer } from './SGFormBaseContainer';
import { SGHelperType, SGHelperGlobalVar, SGHelperStyle, SGHelperWindow } from '../helper';
import { SGFormErrorMessage } from './SGFormErrorMessage';
//buat SGPopMessage show message with timer to auto close, preset message type and appropriate icon

export class SGFormPicker extends SGFormBaseContainer {
    static preset = {
        default: 'default',
        t1: 't1',
        v1: 'v1',
        b1: 'b1', b2: 'b2',
        phoneNumber: 'phoneNumber'
    }
    static _isPresetInit = false;
    static _presetView = {};
    static _initPresetView() {
        var { w, h, p } = SGHelperWindow.getWHPNoHeader();
        SGFormPicker._presetView = {
            default: {
                style: { width: w - 8 * p, padding: p, marginTop: 3 * p, backgroundColor: 'white', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' },
            },
            phoneNumber: {
                style: { width: (w - 8 * p) * 0.3, padding: p, backgroundColor: 'white', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' },
            },

            v1: {
                style: { width: w - 6 * p, padding: p, marginTop: 2 * p, backgroundColor: 'white', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' },
            },
            t1: {},
            b1: {
                style: { width: w - 4 * p, padding: p, marginTop: 2 * p, backgroundColor: 'white', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' },
            },
            b2: {
                style: { width: w - 4 * p, padding: p, marginTop: 2 * p, backgroundColor: 'white', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' },
            }
        };
    }
    static _presetText = {};
    static _initPresetText() {
        var { w, h, p } = SGHelperWindow.getWHPNoHeader();
        SGFormPicker._presetText = {
            default: {
                style: { color: 'black' },
                preset: SGText.preset.titleH3,
                numberOfLines: 1,
            },
            phoneNumber: {
                style: { color: 'black' },
                preset: SGText.preset.titleH3,
                numberOfLines: 1,
            },

            v1: {
                style: { color: 'black' },
                preset: SGText.preset.titleH3,
                numberOfLines: 1,
            },
            t1: {},
            b1: {
                style: { color: 'black' },
                preset: SGText.preset.titleH3,
                numberOfLines: 1,
            },
            b2: {
                style: { color: 'black' },
                preset: SGText.preset.titleH3,
                numberOfLines: 1,
            }
        };
    }
    static _presetPicker = {};
    static _initPresetPicker() {
        var { w, h, p } = SGHelperWindow.getWHPNoHeader();
        SGFormPicker._presetPicker = {
            default: {
                style: { width: w - 10 * p, marginHorizontal: 0, padding: 0, marginTop:0,  },
                textPreset: SGText.preset.titleH3,
                textStyle: {},
            },
            phoneNumber: {
                style: { borderWidth: 1, width: (w - 10 * p) * 0.25, marginHorizontal: 0, padding: 0, minHeight: w * 0.1 },
                textPreset: SGText.preset.titleH4,
                textStyle: {},
            },
            v1: {},
            t1: {
                style: { borderWidth: 1, width: w - 6 * p, marginHorizontal: 0, padding: 0, minHeight: w * 0.1 },
                textPreset: SGText.preset.titleH3,
                textStyle: {},
            },
            b1: {
                style: { flex: null, marginTop: p, backgroundColor: 'white', width: (w - 6 * p), height: w * 0.11, borderRadius: 3 * p, borderWidth: p * 0.02, },
                textPreset: SGText.preset.titleH3,
                textStyle: {},
                single: true,
                shadow: true
            },
            b2: {
                style: { flex: null, marginTop: p, backgroundColor: 'white', width: (w - 6 * p), height: w * 0.11, borderRadius: 3 * p, borderWidth: p * 0.02, },
                textPreset: SGText.preset.titleH3,
                textStyle: {},
                shadow: true
            }
        };
    }
    static _presetIconButton = {};
    static _initPresetIconButton() {
        var { w, h, p } = SGHelperWindow.getWHPNoHeader();
        SGFormPicker._presetIconButton = {
            default: {
                style: { color: 'red' },
                preset: SGIconButton.preset.default,
                textPreset: SGText.preset.titleH2,
            },
            phoneNumber: {
                style: { color: 'red' },
                preset: SGIconButton.preset.default,
                textPreset: SGText.preset.titleH3,
            },
            v1: {},
            t1: {
                style: { color: 'red' },
                preset: SGIconButton.preset.default,
                textPreset: SGText.preset.titleH1,
            },
            b1: {
                style: { color: 'red' },
                preset: SGIconButton.preset.default,
                textPreset: SGText.preset.titleH3,
            },
            b2: {
                style: { color: 'red' },
                preset: SGIconButton.preset.default,
                textPreset: SGText.preset.titleH3,
            }
        };
    }

    static _initPreset() {
        if (!SGFormPicker._isPresetInit) {
            SGFormPicker._initPresetView();
            SGFormPicker._initPresetText();
            SGFormPicker._initPresetPicker();
            SGFormPicker._initPresetIconButton();
            SGFormPicker._isPresetInit = true;
        }
    }

    constructor(props, context, ...args) {
        super(props, context, ...args);
        SGFormPicker._initPreset();
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
        var pickerProp = { shadow: this.props.shadow, shadowIntensity: this.props.shadowIntensity, language: this.props.language, single: this.props.single, mandatory: this.props.mandatory, filterMode: this.props.filterMode, disabled: this.props.disabled };
        var pr = SGHelperType.isDefined(this.props.preset) ? this.props.preset : SGFormPicker.preset.default;
        return (
            <SGView accessible={true} accessibilityLabel={'SGFormPickerRootView'} hidden={hidden} {...SGFormPicker._presetView[pr]}>
                <SGView accessible={true} accessibilityLabel={'SGFormPickerRowVieww'} style={{ flexDirection: 'row', marginBottom:p }}>
                    <SGImage accessible={true} accessibilityLabel={'SGFormTextInputFlagImage'} hidden={this.props.showFlag ? false : true} preset={SGImage.preset.w20S} source={SGFormBaseContainer.flagImage[this.props.showFlag ? this.props.showFlag : 'ID']} />
                    <SGText accessible={true} accessibilityLabel={'SGFormPickerText'} {...SGFormPicker._presetText[pr]} style={{ color: this.props.disabled ? SGHelperStyle.color.TextDisabled : 'black', marginLeft: 2 * p }}>{this.props.label}</SGText>
                </SGView>
                <SGIconButton accessible={true} accessibilityLabel={'SGFormPickerErrorIconButton'} hidden={!this._showError} {...SGFormPicker._presetIconButton[pr]} name={SGIcon.Icon.error} onPress={this.onShowErrorHandler.bind(this)} />
                <SGPicker accessible={true} accessibilityLabel={'SGFormPicker2'} label={this.props.label} {...pickerProp} stateless {...SGFormPicker._presetPicker[pr]} optionList={this.props.optionList} value={this._value} onValueChange={this.onValueChangeHandler.bind(this)} language={this.props.language} />
                <SGFormErrorMessage accessible={true} accessibilityLabel={'SGFormPickerErrorMessage'} preset={SGFormErrorMessage.preset.default} popViewID={this.pvID} errMessage={this._errMessage} />
            </SGView>
        );
    }
} 
