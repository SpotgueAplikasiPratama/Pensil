/**
 * 1. have default preset and list of available preset
 * 2. shadow true|false and shadowIntensity prop
 * 3. disabled true|false
 * 4. hidden true|false
 * 5. receive 2 value prop latitude={num} and longitude={num}
 * 6. validator prop
 * 7. onValueChange event
 * 8. on change will perform validation and display error icon when is not valid
 * 9. display popView screen showing error message when error icon pressed 
 * 10. label prop
 * 11. language prop
 * 12. showFlag prop 'ID'|'EN'|'CN'
 */

import React from 'react';
import { SGView, SGText, SGMapPicker, SGIconButton, SGIcon, SGPopView, SGImage } from '../control';
import { SGFormBaseContainer } from './SGFormBaseContainer';
import { SGHelperType, SGHelperGlobalVar, SGHelperStyle, SGHelperWindow } from '../helper';
import { SGFormErrorMessage } from './SGFormErrorMessage';
//buat SGPopMessage show message with timer to auto close, preset message type and appropriate icon

export class SGFormMapPicker extends SGFormBaseContainer {
    static preset = {
        default: 'default',
        t1: 't1',
        v1: 'v1',
        b1: 'b1', b2: 'b2'
    }
    static _isPresetInit = false;
    static _presetView = {};
    static _initPresetView() {
        var { w, h, p } = SGHelperWindow.getWHPNoHeader();
        SGFormMapPicker._presetView = {
            default: {
                style: { width: w - 8 * p, padding: p, marginTop: 3 * p, backgroundColor: 'white', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' },
            },
            v1: {},
            t1: {},
            b1: {
                style: { width: w - 4 * p, padding: p, marginTop: 2 * p, backgroundColor: 'white', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' },
                shadow: true
            },
            b2: {},
        };
    }
    static _presetText = {};
    static _initPresetText() {
        var { w, h, p } = SGHelperWindow.getWHPNoHeader();
        SGFormMapPicker._presetText = {
            default: {
                style: { color: 'black' },
                preset: SGText.preset.titleH3,
                numberOfLines: 1,
            },
            v1: {},
            t1: {},
            b1: {
                style: { color: 'black' },
                preset: SGText.preset.titleH3,
                numberOfLines: 1,
            },
            b2: {},
        };
    }
    static _presetMapPicker = {};
    static _initPresetMapPicker() {
        var { w, h, p } = SGHelperWindow.getWHPNoHeader();
        SGFormMapPicker._presetMapPicker = {
            default: {
                style: {width:w-10*p, marginHorizontal: 0, padding: 0, marginTop:0, },
                textPreset: SGText.preset.titleH4,
                textStyle: {},
            },
            v1: {},
            t1: {},
            b1: {
                style: { width: w - 8 * p, alignItems: 'center', flexWrap: 'wrap' },
                textPreset: SGText.preset.titleH4,
                textStyle: {},
            }
        };
    }
    static _presetIconButton = {};
    static _initPresetIconButton() {
        var { w, h, p } = SGHelperWindow.getWHPNoHeader();
        SGFormMapPicker._presetIconButton = {
            default: {
                style: { color: 'red' },
                preset: SGIconButton.preset.default,
                textPreset: SGText.preset.titleH3,
            },
            v1: {},
            t1: {},
            b1: {
                style: { color: 'red' },
                preset: SGIconButton.preset.default,
                textPreset: SGText.preset.h6,
            },
            b2: {},
        };
    }
    static _initPreset() {
        if (!SGFormMapPicker._isPresetInit) {
            SGFormMapPicker._initPresetView();
            SGFormMapPicker._initPresetText();
            SGFormMapPicker._initPresetMapPicker();
            SGFormMapPicker._initPresetIconButton();
            SGFormMapPicker._isPresetInit = true;
        }
    }

    constructor(props, context, ...args) {
        super(props, context, ...args);
        SGFormMapPicker._initPreset();
        this.pvID = SGPopView.getPopViewID();
        this._isValueInit = false;
        this._renderBySelf = false;
    }

    initValue() {
        if (!this._isValueInit) {
            this._value = { latitude: this.props.latitude, longitude: this.props.longitude };
            this.validateValue();
            this.state = { value: this._value, showError: this._showError, errMessage: this._errMessage };
            this._isValueInit = true;
        } else if (!this._renderBySelf || this.props.stateless) {
            this._value = { latitude: this.props.latitude, longitude: this.props.longitude };
            this.validateValue();
        }
    }
    onValueChangeHandler(v) {
        this._value = v;
        this.validateValue();
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
        var pickerProp = { shadow: this.props.shadow, shadowIntensity: this.props.shadowIntensity, disabled: this.props.disabled };
        var pr = SGHelperType.isDefined(this.props.preset) ? this.props.preset : SGFormMapPicker.preset.default;
        return (
            <SGView accessible={true} accessibilityLabel={'SGFormMapPickerRootView'} hidden={hidden} {...SGFormMapPicker._presetView[pr]}>
                <SGView accessible={true} accessibilityLabel={'SGFormMapPickerTopView'} style={{flexDirection: 'row', marginBottom:2*p }}>
                    <SGImage accessible={true} accessibilityLabel={'SGFormTextInputFlagImage'} hidden={this.props.showFlag ? false : true} preset={SGImage.preset.w20S} source={SGFormBaseContainer.flagImage[this.props.showFlag ? this.props.showFlag : 'ID']} />
                    <SGText accessible={true} accessibilityLabel={'SGFormMapPickerText'} {...SGFormMapPicker._presetText[pr]}>{this.props.label}</SGText>
                </SGView>
                <SGIconButton accessible={true} accessibilityLabel={'SGFormMapPickerErrorIconButton'} hidden={!this._showError} {...SGFormMapPicker._presetIconButton[pr]} name={SGIcon.Icon.error} onPress={this.onShowErrorHandler.bind(this)} />
                <SGMapPicker accessible={true} accessibilityLabel={'SGFormMapPicker2'} label={this.props.label} {...pickerProp} stateless {...SGFormMapPicker._presetMapPicker[pr]} latitude={this._value.latitude} longitude={this._value.longitude} onValueChange={this.onValueChangeHandler.bind(this)} />
                <SGFormErrorMessage accessible={true} accessibilityLabel={'SGFormMapPickerErrorMessage'} preset={SGFormErrorMessage.preset.default} popViewID={this.pvID} errMessage={this._errMessage} />
            </SGView>
        );
    }
} 