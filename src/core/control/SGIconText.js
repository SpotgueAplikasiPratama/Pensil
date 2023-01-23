/**
 * custom component that display icon with variety color and text 
 * behavior
 * 1. hidden true|false
 * 2. default style from available preset
 * 3. implement safeClick
 * 4. display color based on the first letter of the props text
 * 5. disabled true|false
 * 6. shadow true|false
 * 7. safeClickDelay props
 */

import React from 'react';
import { StyleSheet, } from 'react-native';
import { SGText } from './SGText';
import { SGView } from './SGView';
import { SGHelperStyle, SGHelperType, SGHelperWindow } from '../helper';
import { SGBaseControl } from './SGBaseControl';
import { SGTouchableOpacity } from './SGTouchableOpacity';


export class SGIconText extends SGBaseControl {
    static Color = {
        A: '#FC766AFF',
        B: '#5B84B1FF',
        C: '#76528BFF',
        D: '#42EADDFF',
        E: '#D4B996FF',
        F: '#00A4CCFF',
        G: '#F95700FF',
        H: '#00203FFF',
        I: '#2BAE66FF',
        J: '#606060FF',
        K: '#D6ED17FF',
        L: '#F93822FF',
        M: '#D85A7FFF',
        N: '#2C5F2DFF',
        O: '#79C000FF',
        P: '#00539CFF',
        Q: '#EEA47FFF',
        R: '#89ABE3FF',
        S: '#9CC3D5FF',
        T: '#D198C5FF',
        U: '#F2AA4CFF',
        V: '#101820FF',
        W: '#FDD20EFF',
        X: '#CBCE91FF',
        Y: '#FF4F58FF',
        Z: '#A07855FF',
        def: '#5CC8D7FF',
    }
    static preset = {
        //default normal font size is w6
        w1: 'w1', w2: 'w2', w3: 'w3', w4: 'w4', w5: 'w5', w6: 'w6', w7: 'w7', w8: 'w8',
        hidden: 'hidden',
    }
    static _isPresetInit = false;
    static _presetStyle = {};
    static _initPreset() {
        if (!SGIconText._isPresetInit) {
            var isDef = SGHelperType.isDefined;
            var { w, h, p } = SGHelperWindow.getWHPNoHeader();
            SGIconText._presetStyle = StyleSheet.create({
                //{fontSize},{borderRadius}, {width}, {height}, {padding}, {marginVertical} and {marginHorizontal} is % multiplication factor of screen w
                w1: { fontSize: 100 / 1 * 0.48 * w * 0.01, borderRadius: w * 0.03, width: 100 / 1 * 0.96 * w * 0.01, height: 100 / 1 * 0.96 * w * 0.01, padding: w * 0.01, marginVertical: w * 0.01, marginHorizontal: w * 0.01, },
                w2: { fontSize: 100 / 2 * 0.48 * w * 0.01, borderRadius: w * 0.03, width: 100 / 2 * 0.96 * w * 0.01, height: 100 / 2 * 0.96 * w * 0.01, padding: w * 0.01, marginVertical: w * 0.01, marginHorizontal: w * 0.01, },
                w3: { fontSize: 100 / 3 * 0.48 * w * 0.01, borderRadius: w * 0.03, width: 100 / 3 * 0.96 * w * 0.01, height: 100 / 3 * 0.96 * w * 0.01, padding: w * 0.01, marginVertical: w * 0.01, marginHorizontal: w * 0.01, },
                w4: { fontSize: 100 / 4 * 0.48 * w * 0.01, borderRadius: w * 0.03, width: 100 / 4 * 0.96 * w * 0.01, height: 100 / 4 * 0.96 * w * 0.01, padding: w * 0.01, marginVertical: w * 0.01, marginHorizontal: w * 0.01, },
                w5: { fontSize: 100 / 5 * 0.48 * w * 0.01, borderRadius: w * 0.03, width: 100 / 5 * 0.96 * w * 0.01, height: 100 / 5 * 0.96 * w * 0.01, padding: w * 0.01, marginVertical: w * 0.01, marginHorizontal: w * 0.01, },
                w6: { fontSize: 100 / 6 * 0.48 * w * 0.01, borderRadius: w * 0.03, width: 100 / 6 * 0.96 * w * 0.01, height: 100 / 6 * 0.96 * w * 0.01, padding: w * 0.01, marginVertical: w * 0.01, marginHorizontal: w * 0.01, },
                w7: { fontSize: 100 / 7 * 0.48 * w * 0.01, borderRadius: w * 0.03, width: 100 / 7 * 0.96 * w * 0.01, height: 100 / 7 * 0.96 * w * 0.01, padding: w * 0.01, marginVertical: w * 0.01, marginHorizontal: w * 0.01, },
                w8: { fontSize: 100 / 8 * 0.48 * w * 0.01, borderRadius: w * 0.03, width: 100 / 8 * 0.96 * w * 0.01, height: 100 / 8 * 0.96 * w * 0.01, padding: w * 0.01, marginVertical: w * 0.01, marginHorizontal: w * 0.01, },
                hidden: { fontSize: 0, borderRadius: 0, width: 0, height: 0, padding: 0, marginVertical: 0, marginHorizontal: 0, },
            });
            SGIconText._isPresetInit = true;
        }
    }

    parseText() {
        if (this._text !== this.props.text) {
            this._text = this.props.text;
            this._inisial = this._text.substr(0, 1).toUpperCase();
            this._inisialLabel = this._inisial;
            if (!SGIconText.Color[this._inisial]) {
                this._inisial = String.fromCharCode((this._inisial.charCodeAt(0) % 26) + 65);
            }
        }
    }
    constructor(props, context, ...args) {
        super(props, context, ...args);
        SGIconText._initPreset();
    }
    render() {
        this.parseText();
        var pr = SGIconText._presetStyle[this.props.preset ? this.props.preset : SGIconText.preset.w6];
        this._style = {
            v1: { ...pr, justifyContent: 'center', alignItems: 'center', backgroundColor: this.props.disabled? SGHelperStyle.color.SGIconText.BGDisabled : SGIconText.Color[this._inisial], ...this.props.style, },
            t1: { fontSize: pr.fontSize, color: this.props.disabled? SGHelperStyle.color.SGIconText.TextDisabled:SGHelperStyle.color.SGIconText.TextWhite, fontFamily: SGHelperStyle.fontFamily.bold }
        }
        this.safePress = SGBaseControl.makeSafeClick(this, this.props.onPress, this.props.safeClickDelay);
        return (
            !this.props.hidden &&
            <SGTouchableOpacity accessible={true} accessibilityLabel={'SGIconTextRootTouchable'} shadow={this.props.shadow} shadowIntensity={this.props.shadowIntensity} disabled={this.props.disabled ? true : false} style={(this.props.hidden ? SGIconText._presetStyle.hidden : this._style.v1)} onPress={this.safePress}>
                <SGText accessible={true} accessibilityLabel={this._text} style={this._style.t1}>
                    {this._inisialLabel}
                </SGText>
                {this.props.children &&
                    <SGView accessible={true} accessibilityLabel={'SGIconTextBottomView'} style={{ position: 'absolute', width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center', }}>{this.props.children}</SGView>
                }
            </SGTouchableOpacity>
        );
    }
}
