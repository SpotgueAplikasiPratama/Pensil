/**
 * 1. have default preset and list of available preset
 * 2. shadow true|false and shadowIntensity prop
 * 3. disabled true|false
 * 4. hidden true|false
 * 5. dateRange prop
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
import { SGView, SGText, SGDatePicker, SGIconButton, SGIcon, SGPopView, SGImage } from '../control';
import { SGFormBaseContainer } from './SGFormBaseContainer';
import { SGHelperType, SGHelperGlobalVar, SGHelperStyle, SGHelperWindow } from '../helper';
import { SGFormErrorMessage } from './SGFormErrorMessage';
//buat SGPopMessage show message with timer to auto close, preset message type and appropriate icon

export class SGFormDatePicker extends SGFormBaseContainer {
    static preset = {
        default: 'default',
        t1: 't1', t2: 't2',
        v1: 'v1', v3: 'v3',
        b1: 'b1',
    }
    static _isPresetInit = false;
    static _presetView = {};
    static _initPresetView() {
        var { w, h, p } = SGHelperWindow.getWHPNoHeader();
        SGFormDatePicker._presetView = {
            default: {
                style: { width: w - 8 * p, padding: p, marginTop: 3 * p, backgroundColor: 'white', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' },
            },
            v1: { style: { width: (w - 4 * p) * 0.8, flex: null, padding: p, marginTop: 2 * p, backgroundColor: 'white', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }, },
            v3: { style: { width: (w - 4 * p) * 0.8, flex: null, padding: p, marginTop: 2 * p, marginVertical: 0, backgroundColor: 'white', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }, },
            t1: {
                style: { flex: null, width: w - 35 * p, padding: p, marginTop: 2 * p, backgroundColor: 'white', justifyContent: 'flex-start', alignItems: 'flex-start', },
            },
            b1: {}
        };
    }
    static _presetText = {};
    static _initPresetText() {
        var { w, h, p } = SGHelperWindow.getWHPNoHeader();
        SGFormDatePicker._presetText = {
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
    static _presetDatePicker = {};
    static _initPresetDatePicker() {
        var { w, h, p } = SGHelperWindow.getWHPNoHeader();
        SGFormDatePicker._presetDatePicker = {
            default: {
                style: { width: w - 10 * p, marginHorizontal: 0, padding: 0, marginTop:0 },
                textPreset: SGText.preset.titleH3,
                textIcon: SGImage.preset.w20SnoBorder
            },
            v1: {
                style: { borderWidth: 0, width: (w - 4 * p) * 0.8, marginHorizontal: 0, paddingRight: 2 * p, minHeight: w * 0.1 },
                textPreset: SGText.preset.titleH3,
                textStyle: {},
                textIcon: SGImage.preset.w20SnoBorder
            },
            v3: {
                style: { borderWidth: 0, width: (w - 4 * p) * 0.78, marginHorizontal: 0, paddingRight: 2 * p, minHeight: w * 0.1 },
                textPreset: SGText.preset.titleH3,
                textStyle: {},
                textIcon: SGImage.preset.w20SnoBorder
            },
            t1: {
                style: { borderWidth: 0, width: w - 38 * p, marginHorizontal: 0, padding: 0, minHeight: w * 0.1 },
                textPreset: SGText.preset.titleH3,
                textStyle: {},
                textIcon: SGImage.preset.w20SnoBorder
            },
            b1: {}
        };
    }
    static _presetIconButton = {};
    static _initPresetIconButton() {
        var { w, h, p } = SGHelperWindow.getWHPNoHeader();
        SGFormDatePicker._presetIconButton = {
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
            v3: {
                style: { color: 'red', },
                preset: SGIconButton.preset.default,
                textPreset: SGText.preset.titleH3,
            },
            t1: {},
            b1: {}
        };
    }

    static _initPreset() {
        if (!SGFormDatePicker._isPresetInit) {
            SGFormDatePicker._initPresetView();
            SGFormDatePicker._initPresetText();
            SGFormDatePicker._initPresetDatePicker();
            SGFormDatePicker._initPresetIconButton();
            SGFormDatePicker._isPresetInit = true;
        }
    }

    constructor(props, context, ...args) {
        super(props, context, ...args);
        SGFormDatePicker._initPreset();
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
        console.log('render');
        console.log(this.props.value);
        this.initValue();
        var { w, h, p } = this._screenWHPNoHeader
        this._renderBySelf = false;
        var disabled = this.props.disabled;
        var hidden = this.props.hidden;
        var pickerProp = { dateRange: this.props.dateRange, shadow: this.props.shadow, shadowIntensity: this.props.shadowIntensity, language: this.props.language, disabled: this.props.disabled,timeEOD:this.props.timeEOD };
        var pr = SGHelperType.isDefined(this.props.preset) ? this.props.preset : SGFormDatePicker.preset.default;
        return (
            <SGView accessible={true} accessibilityLabel={'SGFormDatePickerRootView'} hidden={hidden} {...SGFormDatePicker._presetView[pr]}>
                <SGView accessible={true} accessibilityLabel={'SGFormDatePickerTitleView'} style={{flexDirection: 'row', marginBottom: 2*p }}>
                    <SGImage accessible={true} accessibilityLabel={'SGFormTextInputFlagImage'} hidden={this.props.showFlag ? false : true} preset={SGImage.preset.w20S} source={SGFormBaseContainer.flagImage[this.props.showFlag ? this.props.showFlag : 'ID']} />
                    <SGText accessible={true} accessibilityLabel={'SGFormDatePickerLabel'} {...SGFormDatePicker._presetText[pr]} style={{ color: this.props.disabled ? SGHelperStyle.color.TextDisabled : 'black', marginLeft: 2 * p }} >{this.props.label}</SGText>
                </SGView>
                <SGIconButton accessible={true} accessibilityLabel={'SGFormDatePickerErrorIconButton'} hidden={!this._showError} {...SGFormDatePicker._presetIconButton[pr]} name={SGIcon.Icon.error} onPress={this.onShowErrorHandler.bind(this)} />
                <SGDatePicker accessible={true} accessibilityLabel={'SGFormDatePicker2'} language={this.props.language} label={this.props.label} {...pickerProp} stateless {...SGFormDatePicker._presetDatePicker[pr]} value={this._value} onValueChange={this.onValueChangeHandler.bind(this)} />
                <SGFormErrorMessage accessible={true} accessibilityLabel={'SGFormDatePickerErrorMessage'} preset={SGFormErrorMessage.preset.default} popViewID={this.pvID} errMessage={this._errMessage} />
            </SGView>
        );
    }
} 
