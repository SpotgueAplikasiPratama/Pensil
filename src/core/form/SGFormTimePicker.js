/**
 * 1. have default preset and list of available preset
 * 2. shadow true|false and shadowIntensity prop
 * 3. disabled true|false
 * 4. hidden true|false
 * 5. hourList and minuteList prop as array of key-title
 * 6. value prop
 * 7. validator prop
 * 8. onValueChange event
 * 9. on change will perform validation and display error icon when is not valid
 * 10. display popView screen showing error message when error icon pressed 
 * 11. label prop
 * 12. language prop
 * 13. showFlag prop 'ID'|'EN'|'CN' 
 */

import React from 'react';
import { SGView, SGText, SGTimePicker, SGIconButton, SGIcon, SGPopView, SGImage } from '../control';
import { SGFormBaseContainer } from './SGFormBaseContainer';
import { SGHelperType, SGHelperGlobalVar, SGHelperStyle, SGHelperWindow } from '../helper';
import { SGFormErrorMessage } from './SGFormErrorMessage';
//buat SGPopMessage show message with timer to auto close, preset message type and appropriate icon

export class SGFormTimePicker extends SGFormBaseContainer {
    static preset = {
        default: 'default',
        t1: 't1',
        v1: 'v1',
        v3: 'v3',
        b1: 'b1',
    }
    static _isPresetInit = false;
    static _presetView = {};
    static _initPresetView() {
        var { w, h, p } = SGHelperWindow.getWHPNoHeader();
        SGFormTimePicker._presetView = {
            default: {
                style: { width: w - 8 * p, padding: p, marginTop: 3 * p, backgroundColor: 'white', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' },
            },
            v1: { style: { width: (w - 4 * p) * 0.8, flex: null, padding: p, marginTop: 2 * p, backgroundColor: 'white', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }, },
            v3: { style: { width: (w - 4 * p) * 0.8, flex: null, padding: p, marginTop: 2 * p, marginVertical: 0, backgroundColor: 'white', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }, },
            t1: {
                style: { backgroundColor: 'white', },
            },

            b1: {}
        };
    }
    static _presetText = {};
    static _initPresetText() {
        var { w, h, p } = SGHelperWindow.getWHPNoHeader();
        SGFormTimePicker._presetText = {
            default: {
                style: { color: 'black' },
                preset: SGText.preset.titleH3,
                numberOfLines: 1,
            },
            v1: {
                style: { color: SGHelperStyle.color.textColor },
                preset: SGText.preset.titleH3,
                numberOfLines: 1,
            },
            v3: {
                style: { color: SGHelperStyle.color.textColor },
                preset: SGText.preset.titleH3,
                numberOfLines: 1,
            },
            t1: {
                style: { color: 'black' },
                preset: SGText.preset.titleH3,
                numberOfLines: 1,
            },
            b1: {}
        };
    }
    static _presetTimePicker = {};
    static _initPresetTimePicker() {
        var { w, h, p } = SGHelperWindow.getWHPNoHeader();
        SGFormTimePicker._presetTimePicker = {
            default: {
                style: { width: w - 10 * p, marginHorizontal: 0, padding: 0, marginTop:0},
                textPreset: SGText.preset.titleH3,
                textIcon: SGImage.preset.w20SnoBorder
            },
            v1: {
                style: { borderWidth: 0, width: (w - 4 * p) * 0.8, marginHorizontal: 0, paddingRight: 2 * p, minHeight: w * 0.1 },
                textPreset: SGText.preset.titleH3,
                textStyle: {},
            },
            v3: {
                style: { borderWidth: 0, width: (w - 4 * p) * 0.78, marginHorizontal: 0, paddingRight: 2 * p, minHeight: w * 0.1 },
                textPreset: SGText.preset.titleH3,
                textStyle: {},
            },
            t1: {
                style: { width: (w - 6 * p) / 2, marginHorizontal: 0, padding: 0, minHeight: w * 0.11, borderRadius: 3 * p, borderWidth: p * 0.02, },
                textPreset: SGText.preset.titleH3,
                textStyle: {},
            },
            b1: {}
        };
    }
    static _presetIconButton = {};
    static _initPresetIconButton() {
        var { w, h, p } = SGHelperWindow.getWHPNoHeader();
        SGFormTimePicker._presetIconButton = {
            default: {
                style: { color: 'red' },
                preset: SGIconButton.preset.default,
                textPreset: SGText.preset.titleH3,
            },
            v1: {
                style: { color: 'red' },
                preset: SGIconButton.preset.default,
                textPreset: SGText.preset.titleH3,
            },
            t1: {},
            b1: {}
        };
    }

    static _initPreset() {
        if (!SGFormTimePicker._isPresetInit) {
            SGFormTimePicker._initPresetView();
            SGFormTimePicker._initPresetText();
            SGFormTimePicker._initPresetTimePicker();
            SGFormTimePicker._initPresetIconButton();
            SGFormTimePicker._isPresetInit = true;
        }
    }

    constructor(props, context, ...args) {
        super(props, context, ...args);
        SGFormTimePicker._initPreset();
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
        var pickerProp = { hourList: this.props.hourList, minuteList: this.props.minuteList, shadow: this.props.shadow, shadowIntensity: this.props.shadowIntensity, language: this.props.language, disabled: this.props.disabled };
        var pr = SGHelperType.isDefined(this.props.preset) ? this.props.preset : SGFormTimePicker.preset.default;
        return (
            <SGView accessible={true} accessibilityLabel={'SGFormTimePickerRootView'} hidden={hidden} {...SGFormTimePicker._presetView[pr]}>
                <SGView accessible={true} accessibilityLabel={'SGFormTimePickerTitleView'} style={{ flexDirection: 'row', marginBottom:0 }}>
                    <SGImage accessible={true} accessibilityLabel={'SGFormTextInputFlagImage'} hidden={this.props.showFlag ? false : true} preset={SGImage.preset.w20S} source={SGFormBaseContainer.flagImage[this.props.showFlag ? this.props.showFlag : 'ID']} />
                    <SGText accessible={true} accessibilityLabel={'SGFormTimePickerLabel'} {...SGFormTimePicker._presetText[pr]}>{this.props.label}</SGText>
                </SGView>
                <SGIconButton accessible={true} accessibilityLabel={'SGFormTimePickerErrorIconButton'} hidden={!this._showError} {...SGFormTimePicker._presetIconButton[pr]} name={SGIcon.Icon.error} onPress={this.onShowErrorHandler.bind(this)} />
                <SGTimePicker accessible={true} accessibilityLabel={'SGFormTimePicker2'} label={this.props.label} {...pickerProp} stateless {...SGFormTimePicker._presetTimePicker[pr]} value={this._value} onValueChange={this.onValueChangeHandler.bind(this)} />
                <SGFormErrorMessage accessible={true} accessibilityLabel={'SGFormTimePickerErrorMessage'} preset={SGFormErrorMessage.preset.default} popViewID={this.pvID} errMessage={this._errMessage} />
            </SGView>
        );
    }
} 
