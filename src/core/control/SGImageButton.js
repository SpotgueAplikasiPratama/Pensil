/**
* Spotgue Button control class 
* wrap react native Button implementation and hide from Spotgue UI App
* inheritance from SGBaseControl
* @format 
* @flow 
* 1. implement safe click
* 2. default style preset
* 3. disabled true|false
* 4. hidden true|false
* 5. shadow true|false
* 6. safeClickDelay props
*/

import React from 'react';
import { SGTouchableOpacity } from './SGTouchableOpacity';
import { SGText } from './SGText';
import { SGBaseControl } from './SGBaseControl';
import { StyleSheet } from 'react-native';
import { SGImage } from './SGImage';
import {SGButton} from './SGButton';
import { SGHelperType, SGHelperStyle, SGHelperWindow } from '../helper';

export class SGImageButton extends SGBaseControl {
    static preset = SGButton.preset;
    static _presetTextProps = SGButton._presetTextProps;
    static _isPresetInit = false;
    static _presetButtonProps = {};
    static _initPreset() {
        if (!SGImageButton._isPresetInit) {
            const isDef = SGHelperType.isDefined;
            var { w, h, p } = SGHelperWindow.getWHPNoHeader();
            SGImageButton._presetButtonProps = SGButton._presetButtonProps;
            SGImageButton._isPresetInit = true;
        }
    }

    constructor(props, context, ...args) {
        super(props, context, ...args);
        SGImageButton._initPreset();
    }

    render() {
        var isDef = SGHelperType.isDefined;
        var txColor = !isDef(this.props.style) ? null : (!isDef(this.props.style.color) ? null : { color: this.props.style.color });
        var textStyle = { ...SGImageButton._presetTextProps[(this.props.disabled? SGImageButton.preset.disabled : this.props.preset ? this.props.preset : SGImageButton.preset.default)], ...txColor, ...this.props.textStyle };
        var myProps = [];
        var pr = (this.props.hidden ? SGImageButton.preset.hidden : (this.props.disabled? SGImageButton.preset.disabled :this.props.preset ? this.props.preset : SGImageButton.preset.default));
        myProps = SGHelperStyle.addStyleProps(this.props, { ...SGImageButton._presetButtonProps[pr], flexDirection: 'row', justifyContent: 'center', alignItems: 'center' });
        myProps.onPress = SGBaseControl.makeSafeClick(this, myProps.onPress, this.props.safeClickDelay);

        myProps.disabled = this.props.disabled ? true : false;
        myProps.source = null;
        myProps.textStyle = null;
        myProps.imageStyle = null;
        myProps.textPreset = null;
        myProps.imagePreset = null;
        myProps.children = null;
        return (
            !this.props.hidden &&
            <SGTouchableOpacity {...myProps}>
                <React.Fragment>
                    <SGImage source={this.props.source} disabled={this.props.disabled} preset={this.props.imagePreset ? this.props.imagePreset : SGImage.preset.w6S} style={this.props.imageStyle}>
                        {this.props.children}
                    </SGImage>
                    {(SGHelperType.isDefined(this.props.label) || String(this.props.label) !== '') &&
                        <SGText hidden={!SGHelperType.isDefined(this.props.label) || String(this.props.label) === '' ? true : false} preset={this.props.textPreset ? this.props.textPreset : SGText.preset.titleH3B} style={textStyle}>{this.props.label}</SGText>
                    }
                </React.Fragment>
            </SGTouchableOpacity>
        )
    }
}