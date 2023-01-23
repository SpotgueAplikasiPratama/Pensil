/**
 * 1. have default preset and list of available preset
 * 2. shadow true|false and shadowIntensity prop
 * 3. disabled true|false
 * 4. hidden true|false
 * 5. dataType from SGTextInput.dataType option list
 * 6. value prop
 * 7. validator prop
 * 8. onValueChange event
 * 9. on change will perform validation and display error icon when is not valid
 * 10. display popView screen showing error message when error icon pressed 
 * 11. label prop
 * 12. placeholder prop
 * 13. showFlag prop 'ID'|'EN'|'CN'
 */

import React from 'react';
import {Platform, PlatForm} from 'react-native';
import { SGView, SGText, SGTextInput, SGIconButton, SGIcon, SGPopView, SGImage } from '../control';
import { SGFormBaseContainer } from './SGFormBaseContainer';
import { SGHelperType, SGHelperGlobalVar, SGHelperStyle, SGHelperWindow } from '../helper';
import { SGFormErrorMessage } from './SGFormErrorMessage';
//buat SGPopMessage show message with timer to auto close, preset message type and appropriate icon

export class SGFormTextInput extends SGFormBaseContainer {
    static preset = {
        default: 'default', defaultMulti: 'defaultMulti',
        t1: 't1', t2: 't2', t3: 't3', t4: 't4', t5: 't5',
        v1: 'v1', v2: 'v2',
        v3: 'v3', v4: 'v4', v5: 'v5', v6: 'v6',
        bSingle: 'bSingle', bMulti: 'bMulti', bMulti2: 'bMulti2', bHTML: 'bHTML', bAlert: 'bAlert',
        phoneNumber: 'phoneNumber'

    }
    static _isPresetInit = false;
    static _presetView = {};
    static _initPresetView() {
        var { w, h, p } = SGHelperWindow.getWHPNoHeader();
        SGFormTextInput._presetView = {
            default: {
                style: { width: w - 8 * p, padding: p, marginTop: 3 * p, backgroundColor: 'white', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' },
            },
            defaultMulti: {
                style: { width: w - 8 * p, padding: p, marginTop: 3 * p, backgroundColor: 'white', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' },
            },
            phoneNumber: {
                style: { width: (w - 8 * p) * 0.725, flexDirection: 'row', marginTop: Platform.OS ==='ios'? -4.8 *p : - 7 * p, marginHorizontal: p, justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' },
            },
            v1: { style: { width: (w - 4 * p) * 0.8, flex: null, padding: p, marginTop: 0, backgroundColor: 'white', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }, },
            v2: { style: { width: w - 20 * p, flex: null, marginTop: 2 * p, backgroundColor: 'white', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }, },
            v3: { style: { width: (w - 4 * p) * 0.8, flex: null, padding: p, marginTop: 2 * p, marginVertical: 0, backgroundColor: 'white', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }, },
            v4: { style: { width: (w - 4 * p) * 0.875, flex: null, padding: p, marginVertical: 0, marginTop: 1.5 * p, backgroundColor: '#080808', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', flexWrap: 'wrap' }, },
            v5: { style: { width: (w - 4 * p) * 0.6, flex: null, padding: p, marginTop: 0, backgroundColor: 'white', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }, },
            v6: { style: { width: (w - 4 * p) * 0.55, flex: null, padding: p, marginTop: 0, backgroundColor: 'white', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }, },
            t1: {
                style: { width: w - 8 * p, padding: p, marginTop: 3 * p, backgroundColor: 'white', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' },
            },
            t2: {
                style: { flex: null, width: w - 21 * p, padding: p, marginTop: 2 * p, backgroundColor: 'white', justifyContent: 'flex-start', alignItems: 'flex-start', },
            },
            t3: { style: { width: (w - 4 * p) * 0.875, flex: null, padding: p, marginVertical: 0, marginTop: 1.5 * p, backgroundColor: 'white', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', flexWrap: 'wrap' }, },
            t4: { style: { width: (w - 4 * p) * 0.875, flex: null, padding: p, marginVertical: 0, marginTop: 1.5 * p, backgroundColor: 'white', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', flexWrap: 'wrap' }, },
            t5: { style: { width: (w - 4 * p) * 0.875, flex: null, padding: p, marginVertical: 0, marginTop: 1.5 * p, backgroundColor: 'white', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', flexWrap: 'wrap' }, },
            bSingle: {
                style: { width: w - 4 * p, padding: p, marginTop: 2 * p, backgroundColor: 'white', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', },
            },
            bMulti: {
                style: { width: w - 4 * p, padding: p, marginTop: 2 * p, backgroundColor: 'white', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', },
            },
            bMulti2: {
                style: { width: w - 4 * p, padding: p, marginTop: 2 * p, backgroundColor: 'white', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', },
            },
            bHTML: {
                style: { width: w - 4 * p, padding: p, marginTop: 2 * p, backgroundColor: 'white', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', },
            },
            bAlert: {
                style: { width: w / 2, backgroundColor: 'white', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', },
            },

        };
    }
    static _presetText = {};
    static _initPresetText() {
        var { w, h, p } = SGHelperWindow.getWHPNoHeader();

        SGFormTextInput._presetText = {
            default: {
                style: { color: SGHelperStyle.color.textColor },
                preset: SGText.preset.titleH3,
                numberOfLines: 2,
            },
            phoneNumber: {
                style: { color: SGHelperStyle.color.textColor },
                preset: SGText.preset.titleH3,
                numberOfLines: 1,
            },
            defaultMulti: {
                style: { color: SGHelperStyle.color.textColor },
                preset: SGText.preset.titleH3,
                numberOfLines: 10,
            },
            v1: {
                style: { color: SGHelperStyle.color.textColor },
                preset: SGText.preset.titleH3,
                numberOfLines: 1,
            },
            v2: {
                style: { color: SGHelperStyle.color.textColor },
                preset: SGText.preset.titleH3,
                numberOfLines: 1,
            },
            v3: {
                style: { color: 'SGHelperStyle.color.textColor' },
                preset: SGText.preset.titleH3,
                numberOfLines: 1,
            },
            v4: {
                style: { color: 'white' },
                preset: SGText.preset.titleH4B,
                numberOfLines: 5,
            },
            v5: {
                style: { color: SGHelperStyle.color.textColor },
                preset: SGText.preset.titleH3,
                numberOfLines: 1,
            },
            v6: {
                style: { color: SGHelperStyle.color.textColor },
                preset: SGText.preset.titleH3,
                numberOfLines: 1,
            },
            t1: {
                style: { color: SGHelperStyle.color.textColor },
                preset: SGText.preset.titleH3,
                numberOfLines: 5,
            },
            t2: {
                style: { color: SGHelperStyle.color.textColor },
                preset: SGText.preset.titleH3,
                numberOfLines: 3,
            },
            t3: {
                style: { color: 'black' },
                preset: SGText.preset.titleH4B,
                numberOfLines: 5,
            },
            t4: {
                style: { color: 'black' },
                preset: SGText.preset.titleH4B,
                numberOfLines: 5,
            },
            t5: {
                style: { color: SGHelperStyle.color.textColor },
                preset: SGText.preset.titleH3B,
                numberOfLines: 5,
            },
            bSingle: {
                style: { color: SGHelperStyle.color.textColor },
                preset: SGText.preset.titleH3,
                numberOfLines: 1,
            },
            bMulti: {
                style: { color: SGHelperStyle.color.textColor },
                preset: SGText.preset.titleH3,
                numberOfLines: 3,
            },
            bMulti2: {
                style: { color: SGHelperStyle.color.textColor },
                preset: SGText.preset.titleH3,
                numberOfLines: 10,
            },
            bHTML: {
                style: { color: SGHelperStyle.color.textColor },
                preset: SGText.preset.titleH3,
                numberOfLines: 1,
            },
            bAlert: {
                style: { color: SGHelperStyle.color.textColor },
                preset: SGText.preset.titleH3,
                numberOfLines: 1,
            }
        };
    }
    static _presetTextInput = {};
    static _initPresetTextInput() {
        var { w, h, p } = SGHelperWindow.getWHPNoHeader();

        SGFormTextInput._presetTextInput = {
            default: {
                style: { width: w - 10 * p, marginTop:0, },
                // textStyle: { minHeight: w * 0.15, marginLeft: 4 * p, paddingTop: 5 * p },
            },
            phoneNumber: {
                style: { width: (w - 10 * p) * 0.735, height: w * 0.11, },
                preset: SGTextInput.preset.default,
                textStyle: { minHeight: w * 0.15, marginLeft: 4 * p, paddingTop: 5 * p },
            },
            defaultMulti: {
                style: { width: w - 10 * p, marginTop:0,  },
            },
            v1: {
                style: {},
                preset: SGTextInput.preset.default,
                textStyle: { minHeight: w * 0.07, },
            },
            v3: {
                style: { marginBottom: 3 * p },
                preset: SGTextInput.preset.visitor1,
                textStyle: { minHeight: w * 0.125, },
            },
            v4: {
                style: {},
                preset: SGTextInput.preset.visitor1,
                textStyle: { minHeight: w * 0.125, },
            },
            v5: {
                style: {},
                preset: SGTextInput.preset.visitor1,
                textStyle: { minHeight: w * 0.08, },
            },
            v6: {
                style: {},
                preset: SGTextInput.preset.visitor1,
                textStyle: { minHeight: w * 0.08, },
            },
            t1: {
                style: { borderWidth: 1, width: w - 10 * p, borderRadius: 2 * p, borderColor: SGHelperStyle.color.BorderColorTextInput, backgroundColor: SGHelperStyle.color.BackGroundTextInput },
                preset: SGTextInput.preset.default,
                textStyle: { minHeight: w * 0.3, paddingLeft: 4 * p, paddingTop: 10 * p },
                darkMode: false,
                numberOfLines: 1,
                shadow: false
            },
            t2: {
                style: { borderWidth: 1, width: w * 0.8, borderRadius: 2 * p, borderColor: SGHelperStyle.color.BorderColorTextInput, backgroundColor: SGHelperStyle.color.BackGroundTextInput },
                preset: SGTextInput.preset.default,
                textStyle: { minHeight: w * 0.15, marginLeft: 4 * p, paddingTop: 5 * p },
                darkMode: false,
                shadow: false
            },
            t3: {
                style: { borderWidth: 1, width: w * 0.8, borderRadius: 2 * p, borderColor: SGHelperStyle.color.BorderColorTextInput, backgroundColor: SGHelperStyle.color.BackGroundTextInput },
                preset: SGTextInput.preset.default,
                textStyle: { minHeight: w * 0.15, marginLeft: 4 * p, paddingTop: 5 * p },
                darkMode: false,
                shadow: false
            },
            t4: {
                style: { borderWidth: 1, width: w * 0.8, borderRadius: 2 * p, borderColor: SGHelperStyle.color.BorderColorTextInput, backgroundColor: SGHelperStyle.color.BackGroundTextInput },
                preset: SGTextInput.preset.default,
                textStyle: { minHeight: w * 0.15, marginLeft: 4 * p, paddingTop: 5 * p },
                darkMode: false,
                shadow: false
            },
            t5: {
                style: { borderWidth: 1, width: w * 0.8, borderRadius: 2 * p, borderColor: SGHelperStyle.color.BorderColorTextInput, backgroundColor: SGHelperStyle.color.BackGroundTextInput },
                preset: SGTextInput.preset.default,
                textStyle: { minHeight: w * 0.15, marginLeft: 4 * p, paddingTop: 5 * p },
                darkMode: false,
                shadow: false
            },
            bSingle: {
                style: { width: w - 6 * p },
                preset: SGTextInput.preset.default,
                shadow: true,

                textStyle: { minHeight: w * 0.1, paddingTop: 3 * p },

            },
            bMulti: {
                style: { marginTop: p, backgroundColor: 'white', width: w - 4 * p, borderRadius: 3 * p, borderWidth: p * 0.02 },
                preset: SGTextInput.preset.default,
                textStyle: { justifyContent: 'center', alignItems: 'center', paddingTop: 6.5 * p },

                textStyle: { minHeight: w * 0.1 },
                shadow: true,
                multiline: true

            },
            bMulti2: {
                style: { marginTop: p, backgroundColor: 'white', width: w - 6 * p, borderRadius: 3 * p, borderWidth: p * 0.02 },
                preset: SGTextInput.preset.default,
                textStyle: { justifyContent: 'center', alignItems: 'center' },

                textStyle: { minHeight: w * 0.1 },
                shadow: true,
                multiline: true

            },
            bHTML: {
                style: { marginTop: p, backgroundColor: 'white', width: (w - 6 * p), height: w * 0.11, borderRadius: 3 * p, borderWidth: p * 0.02, },
                preset: SGTextInput.preset.default,
                textStyle: { height: w * 0.1, justifyContent: 'center', alignItems: 'center', paddingTop: 3 * p },
                shadow: true,

            },
            bAlert: {
                style: { marginTop: p, backgroundColor: 'white', width: (w - p) / 2, color: 'white' },
                preset: SGTextInput.preset.default,
                textStyle: { height: w * 0.115, justifyContent: 'center', alignItems: 'center', paddingTop: 3 * p },
                shadow: false,
            }
        };
    }
    static _presetIconButton = {};
    static _initPresetIconButton() {
        var { w, h, p } = SGHelperWindow.getWHPNoHeader();
        SGFormTextInput._presetIconButton = {
            default: {
                style: { color: 'red' },
                preset: SGIconButton.preset.default,
                textPreset: SGText.preset.titleH2,
            },
            phoneNumber: {
                style: { color: 'red' },
                preset: SGIconButton.preset.default,
                textPreset: SGText.preset.titleH2,
            },
            defaultMulti: {
                style: { color: 'red' },
                preset: SGIconButton.preset.default,
                textPreset: SGText.preset.titleH1,
            },
            v1: {
                style: { color: 'red', },
                preset: SGIconButton.preset.default,
                textPreset: SGText.preset.titleH3,
            },
            v3: {
                style: { color: 'red', },
                preset: SGIconButton.preset.default,
                textPreset: SGText.preset.titleH3,
            },
            v5: {
                style: { color: 'red', },
                preset: SGIconButton.preset.default,
                textPreset: SGText.preset.titleH3,
            },
            v6: {
                style: { color: 'red', },
                preset: SGIconButton.preset.default,
                textPreset: SGText.preset.titleH3,
            },
            t1: {
                style: { color: 'red' },
                preset: SGIconButton.preset.default,
                textPreset: SGText.preset.titleH3,
            },
            t2: {
                style: { color: 'red' },
                preset: SGIconButton.preset.default,
                textPreset: SGText.preset.titleH3,
            },
            t3: {
                style: { color: 'red' },
                preset: SGIconButton.preset.default,
                textPreset: SGText.preset.titleH3,
            },
            t4: {
                style: { color: 'red' },
                preset: SGIconButton.preset.default,
                textPreset: SGText.preset.titleH3,
            },
            t5: {
                style: { color: 'red' },
                preset: SGIconButton.preset.default,
                textPreset: SGText.preset.titleH3,
            },
            bSingle: {
                style: { color: 'red' },
                preset: SGIconButton.preset.default,
                textPreset: SGText.preset.titleH3,
            },
            bMulti: {
                style: { color: 'red' },
                preset: SGIconButton.preset.default,
                textPreset: SGText.preset.titleH3,
            },
            bMulti2: {
                style: { color: 'red' },
                preset: SGIconButton.preset.default,
                textPreset: SGText.preset.titleH3,

            },
            bHTML: {
                style: { color: 'red' },
                preset: SGIconButton.preset.default,
                textPreset: SGText.preset.titleH3,
            },
            bAlert: {
                style: { color: 'red' },
                preset: SGIconButton.preset.default,
                textPreset: SGText.preset.titleH3,
            },
        };
    }
    static _initPreset() {
        if (!SGFormTextInput._isPresetInit) {
            SGFormTextInput._initPresetView();
            SGFormTextInput._initPresetText();
            SGFormTextInput._initPresetTextInput();
            SGFormTextInput._initPresetIconButton();
            SGFormTextInput._isPresetInit = true;
        }
    }

    constructor(props, context, ...args) {
        super(props, context, ...args);
        SGFormTextInput._initPreset();
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
        // console.log(this._value)    
        var disabled = this.props.disabled;
        var shadow = this.props.shadow;
        var shadowIntensity = this.props.shadowIntensity;
        var hidden = this.props.hidden;
        var dataType = this.props.dataType;
        var placeholder = this.props.placeholder;
        var autoCapitalize = this.props.autoCapitalize
        var pr = SGHelperType.isDefined(this.props.preset) ? this.props.preset : SGFormTextInput.preset.default;

        return (
            <SGView accessible={true} accessibilityLabel={'SGFormTextInputRootView'} hidden={hidden} {...SGFormTextInput._presetView[pr]}>
                <SGView accessible={true} accessibilityLabel={'SGFormTextInputRowView'} style={{ flexDirection: 'row', marginBottom: 2 * p }}>
                    <SGImage accessible={true} accessibilityLabel={'SGFormTextInputFlagImage'} hidden={this.props.showFlag ? false : true} preset={SGImage.preset.w20S} source={SGFormBaseContainer.flagImage[this.props.showFlag ? this.props.showFlag : 'ID']} />
                    <SGText accessible={true} accessibilityLabel={'SGFormTextInputLabelText'} hidden={this.props.hideLabel ? true : false} {...SGFormTextInput._presetText[pr]} style={{ color: this.props.disabled ? SGHelperStyle.color.TextDisabled : 'black', marginLeft: 2 * p }} >{this.props.label}</SGText>
                </SGView>
                <SGIconButton accessible={true} accessibilityLabel={'SGFormTextInputErrorIconButton'} hidden={!this._showError} {...SGFormTextInput._presetIconButton[pr]} name={SGIcon.Icon.error} onPress={this.onShowErrorHandler.bind(this)} />
                <SGTextInput accessible={true} accessibilityLabel={'SGFormTextInputTextInput'} maxLength={this.props.maxLength} shadow={shadow} label={this.props.label} shadowIntensity={shadowIntensity} disabled={disabled} stateless dataType={dataType} {...SGFormTextInput._presetTextInput[pr]} value={this._value} onValueChange={this.onValueChangeHandler.bind(this)} placeholder={placeholder} onBlur={this.props.onBlur} autoCapitalize={autoCapitalize} />
                <SGFormErrorMessage accessible={true} accessibilityLabel={'SGFormTextInputErrorMessageForm'} preset={SGFormErrorMessage.preset.default} popViewID={this.pvID} errMessage={this._errMessage} />
            </SGView>
        );
    }
} 