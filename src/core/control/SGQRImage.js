/**
 * Wrap RN-QRCode-SVG as component
 * 1. default style and user can customize
 * 2. shadow : true|false
 * 3. hidden : true|false
 * 4. preset, style, textPreset, textStyle props
 */

import React from 'react';
import { StyleSheet } from 'react-native';
import { SGView } from './SGView';
import { SGText } from './SGText';
import { SGBaseControl } from './SGBaseControl';
import { SGHelperType, SGHelperStyle, SGHelperWindow } from '../helper';
import QRCode from 'react-native-qrcode-svg';

export class SGQRImage extends SGBaseControl {
    static preset = {
        w1: 'w1',
        w1_1: 'w1_1',
        w2: 'w2',
        w3: 'w3',
        w4: 'w4',
        wCustom:'wCustom',
        default: 'default'
    }
    static _presetStyleView = {};
    static _presetStyleText = {};
    static _isPresetInit = false;
    static _initPreset() {
        if (!SGQRImage._isPresetInit) {
            var { w, h, p } = SGHelperWindow.getWHPNoHeader();
            SGQRImage._presetStyleView = {
                default:StyleSheet.create({
                    w1: { width: (w - 6 * p), marginTop: 2 * p, paddingTop: 4*p, borderRadius: p, backgroundColor: SGHelperStyle.color.SGQRImage.BGWhite, },
                    w1_1: { width: (w - 6 * p) / 1.5, marginTop: 2 * p, paddingTop: 4*p, borderRadius: p, backgroundColor: SGHelperStyle.color.SGQRImage.BGWhite, },
                    w2: { width: (w - 6 * p) / 2, marginTop: 2 * p, paddingTop: 4*p, borderRadius: p, backgroundColor: SGHelperStyle.color.SGQRImage.BGWhite, },
                    w3: { width: (w - 6 * p) / 3, marginTop: 2 * p, paddingTop: 4*p, borderRadius: p, backgroundColor: SGHelperStyle.color.SGQRImage.BGWhite, },
                    w4: { width: (w - 6 * p) / 4, marginTop: 2 * p, paddingTop: 4*p, borderRadius: p, backgroundColor: SGHelperStyle.color.SGQRImage.BGWhite, },
                    wCustom: { width: (w - 6 * p) / 7, marginTop: 0, paddingTop: 0, borderRadius: 0, backgroundColor: SGHelperStyle.color.SGQRImage.BGWhite, },
                    default: { width: (w - 6 * p) * 0.6, marginTop: 2 * p, paddingTop: 4*p, borderRadius: p, backgroundColor: SGHelperStyle.color.SGQRImage.BGWhite, },
                }),
                disabled:StyleSheet.create({
                    w1: { width: (w - 6 * p), marginTop: 2 * p, paddingTop: 4*p, borderRadius: p, backgroundColor: SGHelperStyle.color.SGQRImage.BGDisabled, },
                    w1_1: { width: (w - 6 * p) / 1.5, marginTop: 2 * p, paddingTop: 4*p, borderRadius: p, backgroundColor: SGHelperStyle.color.SGQRImage.BGWhite, },
                    w2: { width: (w - 6 * p) / 2, marginTop: 2 * p, paddingTop: 4*p, borderRadius: p, backgroundColor: SGHelperStyle.color.SGQRImage.BGDisabled, },
                    w3: { width: (w - 6 * p) / 3, marginTop: 2 * p, paddingTop: 4*p, borderRadius: p, backgroundColor: SGHelperStyle.color.SGQRImage.BGDisabled, },
                    w4: { width: (w - 6 * p) / 4, marginTop: 2 * p, paddingTop: 4*p, borderRadius: p, backgroundColor: SGHelperStyle.color.SGQRImage.BGDisabled, },
                    wCustom: { width: (w - 6 * p) / 7, marginTop: 2 * p, paddingTop: 4*p, borderRadius: 0, backgroundColor: SGHelperStyle.color.SGQRImage.BGDisabled, },
                    default: { width: (w - 6 * p) * 0.6, marginTop: 2 * p, paddingTop: 4*p, borderRadius: p, backgroundColor: SGHelperStyle.color.SGQRImage.BGDisabled, },
                })
            }
            SGQRImage._presetStyleText = {
                default:StyleSheet.create({
                    w1: { marginVertical: 2 * p, color:SGHelperStyle.color.SGQRImage.TextBlack },
                    w1_1: { marginVertical: 2 * p, color:SGHelperStyle.color.SGQRImage.TextBlack },
                    w2: { marginVertical: 2 * p, color:SGHelperStyle.color.SGQRImage.TextBlack },
                    w3: { marginVertical: 2 * p, color:SGHelperStyle.color.SGQRImage.TextBlack },
                    w4: { marginVertical: 2 * p, color:SGHelperStyle.color.SGQRImage.TextBlack },
                    wCustom: { marginVertical: 0, color:SGHelperStyle.color.SGQRImage.TextBlack },
                    default: { marginVertical: 2 * p, color:SGHelperStyle.color.SGQRImage.TextBlack },
                }),
                disabled:StyleSheet.create({
                    w1: { marginVertical: 2 * p, color:SGHelperStyle.color.SGQRImage.TextBlack },
                    w1_1: { marginVertical: 2 * p, color:SGHelperStyle.color.SGQRImage.TextBlack },
                    w2: { marginVertical: 2 * p, color:SGHelperStyle.color.SGQRImage.TextBlack },
                    w3: { marginVertical: 2 * p, color:SGHelperStyle.color.SGQRImage.TextBlack },
                    w4: { marginVertical: 2 * p, color:SGHelperStyle.color.SGQRImage.TextBlack },
                    wCustom: { marginVertical: 0, color:SGHelperStyle.color.SGQRImage.TextBlack },
                    default: { marginVertical: 2 * p, color:SGHelperStyle.color.SGQRImage.TextBlack },
                })
            }
            SGQRImage._isPresetInit = true;
        }
    }
    constructor(props, context, ...args) {
        super(props, context, ...args);
        SGQRImage._initPreset();
    }
    render() {
        var { w, h, p } = SGHelperWindow.getWHPNoHeader();
        var pr = this.props.preset ? this.props.preset : SGQRImage.preset.default;
        var vStyle = SGQRImage._presetStyleView[this.props.disabled?'disabled':'default'][pr];
        var tStyle = SGQRImage._presetStyleText[this.props.disabled?'disabled':'default'][pr];
        var value = SGHelperType.isDefined(this.props.value) ? this.props.value : '0000000000000000';
        var myProps = [];
        myProps = SGHelperStyle.addStyleProps(this.props, vStyle);
        return (
            !this.props.hidden &&
            <SGView accessible={true} accessibilityLabel={'SGQRImageRootView'} {...myProps}>
                <SGView style={{alignSelf:'center'}}>
                    <QRCode accessible={true} accessibilityLabel={'SGQRImageQRCode'} value={value} size={vStyle.width-8*p} />
                </SGView>
                <SGText hidden={this.props.disabledText?this.props.disabledText:false} accessible={true} accessibilityLabel={'SGQRImageValue'} preset={this.props.textPreset?this.props.textPreset: SGText.preset.titleH3} style={[this.props.textStyle, tStyle]}>{value}</SGText>
            </SGView>
        );
    }

}
