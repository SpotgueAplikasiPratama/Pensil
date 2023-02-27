/**
* MAG Button control class 
* wrap react native Button implementation and hide from MAG UI App
* inheritance from SGBaseControl
* @format 
* @flow 
* 1. implement safe click
* 2. default style preset
* 3. disabled true|false
* 4. hidden true|false
* 5. shadow true|false
* 6. noSafeClick true|false default is false
* 7. safeClickDelay props
*/

import React from 'react';
import { SGTouchableOpacity } from './SGTouchableOpacity';
import { SGText } from './SGText';
import { SGBaseControl } from './SGBaseControl';
import { StyleSheet } from 'react-native';
import { SGIcon } from './SGIcon';
import { SGButton } from './SGButton';
import { SGHelperType, SGHelperStyle, SGHelperWindow } from '../helper';

export class SGIconButton extends SGBaseControl {
    static preset = SGButton.preset;
    static _presetTextProps = SGButton._presetTextProps;
    static _isPresetInit = false;
    static _presetButtonProps = {};
    static _initPreset() {
        var { w, h, p } = SGHelperWindow.getWHPNoHeader();
        if (!SGIconButton._isPresetInit) {
            SGIconButton._presetButtonProps = SGButton._presetButtonProps;
            SGIconButton._isPresetInit = true;
        }
    }
    constructor(props, context, ...args) {
        super(props, context, ...args);
        SGIconButton._initPreset();
    }
    initProps() {
        if (super.isPropsNeedInitOrChanged(this.props)) {
            var isDef = SGHelperType.isDefined;
            var txColor = !isDef(this.props.style) ? null : (!isDef(this.props.style.color) ? null : { color: this.props.style.color });
            this.textProps = { ...SGIconButton._presetTextProps[(this.props.disabled?(this.props.preset ?SGIconButton.preset.disabled:SGIconButton.preset.default) : this.props.preset ? this.props.preset : SGIconButton.preset.default)], ...txColor };
            this.myProps = [];
            var pr = (this.props.hidden ? SGIconButton.preset.hidden : (this.props.disabled && !this.props.overrideDisabled? (this.props.preset ?SGIconButton.preset.disabled:SGIconButton.preset.default) : this.props.preset ? this.props.preset : SGIconButton.preset.default));
            this.myProps = SGHelperStyle.addStyleProps(this.props, { ...SGIconButton._presetButtonProps[pr], flexDirection: 'row', justifyContent: 'center', alignItems: 'center' });
            if(!this.props.noSafeClick){
                this.myProps.onPress = SGBaseControl.makeSafeClick(this, this.myProps.onPress, this.props.safeClickDelay);
            }
            this.myProps.disabled = this.props.disabled ? true : false;
        }
    }
    render() {
        this.initProps();
        return (
            !this.props.hidden &&
            <SGTouchableOpacity {...this.myProps}>
                <SGIcon accessible={true} accessibilityLabel={'SGIconButtonIcon'} disabled={this.props.disabled} name={this.props.name} preset={this.props.iconPreset ? this.props.iconPreset : this.props.textPreset ? this.props.textPreset : SGIcon.preset.h6} style={this.textProps} />
                <SGText accessible={true} accessibilityLabel={'SGIconButtonText'} hidden={!SGHelperType.isDefined(this.props.label)} preset={this.props.textPreset ? this.props.textPreset : SGText.preset.titleH3} style={this.textProps}>{this.props.label}</SGText>
            </SGTouchableOpacity>
        )
    }
}
