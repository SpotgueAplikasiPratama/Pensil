/**
 * 1. have default preset and list of available preset
 * 2. shadow true|false and shadowIntensity prop
 * 3. disabled true|false
 * 4. hidden true|false
 * 5. value prop
 * 6. onValueChange event
 * 7. label prop
 * 8. language prop
 * 9. showFlag prop 'ID'|'EN'|'CN'
 */

import React from 'react';
import { SGView, SGText, SGSwitch, SGPopView, SGImage } from '../control';
import { SGFormBaseContainer } from './SGFormBaseContainer';
import { SGHelperType, SGHelperGlobalVar, SGHelperStyle, SGHelperWindow } from '../helper';
//buat SGPopMessage show message with timer to auto close, preset message type and appropriate icon

export class SGFormSwitch extends SGFormBaseContainer {
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
        SGFormSwitch._presetView = {
            default: {
                style: { width: w - 8 * p, padding: p, marginTop: 3 * p, backgroundColor: 'white', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' },
            },
            v1: {},
            t1: {},
            b1: {
                style: { width: w - 8 * p, backgroundColor: 'white', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' },
            }
        };
    }
    static _presetText = {};
    static _initPresetText() {
        var { w, h, p } = SGHelperWindow.getWHPNoHeader();
        SGFormSwitch._presetText = {
            default: {
                style: { color: 'black' },
                preset: SGText.preset.titleH3,
                numberOfLines: 1,
            },
            v1: {},
            t1: {},
            b1: {
                style: { color: 'black' },
                preset: SGText.preset.titleH4,
                numberOfLines: 1,
            }
        };
    }
    static _presetSwitch = {};
    static _initPresetSwitch() {
        var { w, h, p } = SGHelperWindow.getWHPNoHeader();
        SGFormSwitch._presetSwitch = {
            default: {
                preset:SGSwitch.preset.default, 
                style: {},
                mappingValue: { true: 'Y', false: 'N' }
            },
            v1: {},
            t1: {},
            b1: {
                style: {},
                mappingValue: { true: 'Y', false: 'N' }
            }
        };
    }

    static _initPreset() {
        if (!SGFormSwitch._isPresetInit) {
            SGFormSwitch._initPresetView();
            SGFormSwitch._initPresetText();
            SGFormSwitch._initPresetSwitch();
            SGFormSwitch._isPresetInit = true;
        }
    }

    constructor(props, context, ...args) {
        super(props, context, ...args);
        SGFormSwitch._initPreset();
        this._isValueInit = false;
        this._renderBySelf = false;
    }

    initValue() {
        if (!this._isValueInit) {
            this._value = this.props.value;
            this.state = { value: this._value };
            this._isValueInit = true;
        } else if (!this._renderBySelf || this.props.stateless) {
            this._value = this.props.value;
        }
    }

    onValueChangeHandler(v) {
        this._value = v;
        if (!this.props.stateless) {
            this._renderBySelf = true;
            this.setState({ value: this._value });
        }
        if (SGHelperType.isDefined(this.props.onValueChange)) this.props.onValueChange(v);
    }

    render() {
        this.initValue();
        this._renderBySelf = false;
        var hidden = this.props.hidden;
        var switchProp = { shadow: this.props.shadow, shadowIntensity: this.props.shadowIntensity, disabled: this.props.disabled };
        var pr = SGHelperType.isDefined(this.props.preset) ? this.props.preset : SGFormSwitch.preset.default;
        return (
            <SGView accessible={true} accessibilityLabel={'SGFormSwitchRootView'} hidden={hidden} {...SGFormSwitch._presetView[pr]}>
                <SGView accessible={true} accessibilityLabel={'SGFormSwitchRowView'} style={{ flexDirection: 'row' }}>
                    <SGImage accessible={true} accessibilityLabel={'SGFormTextInputFlagImage'} hidden={this.props.showFlag ? false : true} preset={SGImage.preset.w20S} source={SGFormBaseContainer.flagImage[this.props.showFlag ? this.props.showFlag : 'ID']} />
                    <SGText accessible={true} accessibilityLabel={'SGFormSwitchText'} {...SGFormSwitch._presetText[pr]}>{this.props.label}</SGText>
                </SGView>
                <SGSwitch accessible={true} accessibilityLabel={'SGFormSwitchHandler'} {...switchProp} stateless {...SGFormSwitch._presetSwitch[pr]} value={this._value} onValueChange={this.onValueChangeHandler.bind(this)} />
            </SGView>
        );
    }
} 
