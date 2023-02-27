/**
* MAG CheckBox control class 
* wrap react native checkbox implementation and hide from MAG UI App
* inheritance from SGBaseControl
* @format 
* @flow 
* 1. can tick or untick by tapping on box or label part
* 2. hidden true|false
* 3. disabled true|false
* 4. stateless true|false
* 5. darkMode true|false
*/

import React from 'react';
import { SGText } from './SGText';
import { SGIcon } from './SGIcon';
import { SGTouchableOpacity } from './SGTouchableOpacity';
import { SGBaseControl } from './SGBaseControl';
import { SGHelperType } from '../helper/SGHelperType';
import { SGHelperStyle } from '../helper/SGHelperStyle';

export class SGCheckBox extends SGBaseControl {
    static preset = {
        default:'default',
        disabled:'disabled',
    }

    static presetCheckBox = {
        light:{
            default:{color:SGHelperStyle.color.SGCheckBox.Black},
            disabled:{color:SGHelperStyle.color.SGCheckBox.Disabled}
        },
        dark:{
            default:{color:SGHelperStyle.color.SGCheckBox.White},
            disabled:{color:SGHelperStyle.color.SGCheckBox.Disabled}
        },
    }

    constructor(props, context, ...args) {
        super(props, context, ...args);
    }
    onPressHandler() {
        this._value = !this._value;
        if (!this.props.stateless) { super.mySetState({ value: this._value }); }
        if (SGHelperType.isDefined(this.props.onValueChange)) {
            this.props.onValueChange(this._value);
        }
    }
    initProps() {
        if (super.isPropsNeedInitOrChanged(this.props)) {
            var isDef = SGHelperType.isDefined;
            this.bgColor = !isDef(this.props.style) ? null : (!isDef(this.props.style.backgroundColor) ? null : { backgroundColor: this.props.style.backgroundColor });
            this.w = (!isDef(this.props.style) ? {} : !isDef(this.props.style.width) ? {} : { width: this.props.style.width });
            this.styleText = SGHelperStyle.appendStyle({...(SGCheckBox.presetCheckBox[this.props.darkMode?'dark':'light'][this.props.disabled?SGCheckBox.preset.disabled:this.props.preset?this.props.preset:SGCheckBox.preset.default]),...this.props.style}, { width: null, backgroundColor: null });
        }
    }
    render() {
        this.initProps();
        super.initValue((SGHelperType.isDefined(this.props.value) ? this.props.value : false), this.props.stateless, () => { this.state = { value: this._value }; });
        return (
            !this.props.hidden &&
            <SGTouchableOpacity disabled={this.props.disabled ? true : false} noSafeClick hidden={this.props.hidden ? this.props.hidden : false} style={[{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }, this.bgColor, this.w]} onPress={this.onPressHandler.bind(this)}>
                <SGText accessible={true} accessibilityLabel={'SGCheckBoxRootText'} numberOfLines={this.props.multi ?null:1} preset={this.props.textPreset ? this.props.textPreset : SGText.preset.titleH2} style={this.styleText}>
                    <SGIcon accessible={true} accessibilityLabel={'SGCheckBoxSquareIcon'} name={this._value ? SGIcon.Icon.squareChecked : SGIcon.Icon.square} preset={this.props.textPreset ? this.props.textPreset : SGIcon.preset.h2} style={this.styleText} /> {this.props.title}
                </SGText>
            </SGTouchableOpacity>
        );
    }
}
