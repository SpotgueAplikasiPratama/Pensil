/**
 * wrap react-native OTPInputView component with additional behavior
 * 1. apply default style and have preset to choose
 * 2. hidden true|false
 * 3. shadow true|false with prop shadowIntensity from 0.0 to 1.0
 * 4. disabled true|false
 */

import React from 'react';
import OTPInputView from "@twotalltotems/react-native-otp-input";
import { StyleSheet, } from 'react-native';
import { SGHelperStyle, SGHelperType, SGHelperWindow } from '../helper';
import { SGBaseControl } from './SGBaseControl';
import { SGView } from './SGView';

export class SGOTPInput extends SGBaseControl {
    static preset = {
        default: 'default',
        hidden: 'hidden',
    }

    static _isPresetInit = false;
    static _presetStyle = {};

    static _presetStyleBase = {};

    static _presetStyleHighlight = {};

    static _initPreset() {
        const isDef = SGHelperType.isDefined;
        var { w, h, p } = SGHelperWindow.getWHPNoHeader();
        if (!SGOTPInput._isPresetInit) {
            SGOTPInput._presetStyle = StyleSheet.create({
                //width, height, fontSize, paddingHorizontal, borderRadius, borderWidth is a multiplication of w /100
                default: { width: w, height: w * 0.24, paddingHorizontal: w * 0.12, borderWidth: 0, fontSize: 0, borderRadius: 0, justifyContent: 'space-around', alignItems: 'center', overflow: 'visible', },
                hidden: { width: 0, height: 0, margin: 0, borderWidth: 0, fontSize: 0, borderRadius: 0, overflow: 'hidden' },
            });
            SGOTPInput._presetStyleBase = StyleSheet.create({
                default: { width: w * 0.16, height: w * 0.16, paddingHorizontal: 0, borderWidth: 1, borderColor:SGHelperStyle.color.SGOTPInput.Border, fontSize: w * 0.08, borderRadius: w * 0.02, fontFamily: SGHelperStyle.fontFamily.bold, color: SGHelperStyle.color.SGOTPInput.TextBlack, backgroundColor: SGHelperStyle.color.SGOTPInput.BGWhite },
                hidden: { width: 0, height: 0, margin: 0, overflow: 'hidden' },
            });
            SGOTPInput._presetStyleHighlight = StyleSheet.create({
                default: { borderWidth: 1, borderColor: SGHelperStyle.color.SGOTPInput.TextBlack },
                hidden: { width: 0, height: 0, margin: 0, overflow: 'hidden' },
            });
            SGOTPInput._isPresetInit = true;
        }
    }

    constructor(props, context, ...args) {
        super(props, context, ...args);
        SGOTPInput._initPreset();
    }

    initProps() {
        if (super.isPropsNeedInitOrChanged(this.props)) {
            var myProps;
            if (this.props.hidden) {
                myProps = SGHelperStyle.addStyleProps(this.props, SGOTPInput._presetStyle[SGOTPInput.preset.hidden], true);
            } else {
                myProps = SGHelperStyle.addStyleProps(this.props, SGOTPInput._presetStyle[this.props.preset ? this.props.preset : SGOTPInput.preset.default]);
                myProps.codeInputFieldStyle = SGHelperStyle.prependStyle(this.props.codeInputFieldStyle, SGOTPInput._presetStyleBase[this.props.preset ? this.props.preset : SGOTPInput.preset.default]);
                myProps.codeInputHighlightStyle = SGHelperStyle.prependStyle(this.props.codeInputHighlightStyle, SGOTPInput._presetStyleHighlight[this.props.preset ? this.props.preset : SGOTPInput.preset.default]);
                if (this.props.disabled) {
                    myProps.codeInputFieldStyle = SGHelperStyle.appendStyle(myProps.codeInputFieldStyle, { backgroundColor: SGHelperStyle.color.SGOTPInput.BGDisabled });
                    myProps.codeInputHighlightStyle = SGHelperStyle.appendStyle(myProps.codeInputHighlightStyle, { borderWidth: 0 });
                } else if (this.props.shadow) {
                    myProps.codeInputFieldStyle = SGHelperStyle.addShadowStyle(myProps.codeInputFieldStyle, this.props.shadowIntensity);
                }
                if (!this.props.pinCount) { myProps.pinCount = 4; }
                myProps.autoFocusOnLoad = this.props.disabled ? false : !SGHelperType.isDefined(this.props.autoFocusOnLoad) ? true : this.props.autoFocusOnLoad;
            }
            this.myProps = myProps;
        }
    }

    render() {
        this.initProps();
        return (
            !this.props.hidden &&
            <SGView accessible={true} accessibilityLabel={'SGOTPInputRootView'}>
                <OTPInputView accessible={true} accessibilityLabel={'SGOTPInputOTPView'} {...this.myProps} />
                {this.props.disabled &&
                    <SGView accessible={true} accessibilityLabel={'SGOTPInputDisableBackgroundView'} style={this.props.disabled ? { width: '100%', height: '100%', position: 'absolute', backgroundColor: SGHelperStyle.color.otpInputDisabledBackgroundColor } : { width: 0, height: 0, padding: 0, overflow: 'hidden' }}>
                    </SGView>
                }
            </SGView>
        )
    }
}
