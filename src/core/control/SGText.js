import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { SGHelperStyle, SGHelperType, SGHelperWindow } from '../helper';
import { SGBaseControl } from './SGBaseControl';

/**
 * wrap react-native Text component with 1 additional behavior
 * 1. apply default style with pre-defined presets
 * 2. implement safeClick
 * 3. hidden true|false
 * 4. disabled true|false
 * 5. safeClickDelay props
 */

export class SGText extends SGBaseControl {
    //default normal font size is H6, for long description use H7
    static preset = {
        h1: 'h1', h2: 'h2', h3: 'h3', h3_5: 'h3_5', h4: 'h4', h4_5: 'h4_5', h4_85: 'h4_85', h5: 'h5', h5_5: 'h5_5', h6: 'h6', h6_5: 'h6_5', h7: 'h7', h8: 'h8', h9: 'h9', h9_5: 'h9_5', h10: 'h10', h11: 'h11', h12: 'h12',
        h0B: 'h0B', h1B: 'h1B', h2B: 'h2B', h2_3B: 'h2_3B', h3B: 'h3B', h4B: 'h4B', h4_5B: 'h4_5B', h5B: 'h5B', h5_5B: 'h5_5B', h6_5B: 'h6_5B', h6B: 'h6B', h7B: 'h7B', h7_5B: 'h7_5B', h9_5B: 'h9_5B', h8B: 'h8B', h8_1B: 'h8_1B', h8_5B: 'h8_5B', h9B: 'h9B', h10B: 'h10B', h11B: 'h11B', h12B: 'h12B',
        h1I: 'h1I', h2I: 'h2I', h3I: 'h3I', h4I: 'h4I', h4_5I: 'h4_5I', h5I: 'h5I', h5_5I: 'h5_5I', h6_5I: 'h6_5I', h6I: 'h6I', h7I: 'h7I', h9_5I: 'h9_5I', h8I: 'h8I', h9I: 'h9I', h10I: 'h10I', h11I: 'h11I', h12I: 'h12I',
        h5_border: 'h5_border',

        heading2: 'heading2', heading3: 'heading3', heading4: 'heading4', heading5: 'heading5', heading6: 'heading6', heading7: 'heading7', heading8: 'heading8', heading9: 'heading9', heading10: 'heading10',
        
        heading2B: 'heading2B', heading3B: 'heading3B', heading4B: 'heading4B', heading5B: 'heading5B', heading6B: 'heading6B', heading7B: 'heading7B', heading8B: 'heading8B', heading9B: 'heading9B', heading10B: 'heading10B',
        
        hidden: 'hidden',

        titleH1B: 'titleH1B',
        titleH2B: 'titleH2B',
        titleH3B: 'titleH3B',
        titleH3B_C: 'titleH3B_C',
        titleH4B: 'titleH4B',
        titleH4_5B: 'titleH4_5B',
        titleH5B: 'titleH5B',
        titleH6B: 'titleH6B',
        titleH1: 'titleH1',
        titleH2: 'titleH2',
        titleH3: 'titleH3',
        titleH3_5: 'titleH3_5',
        titleH4: 'titleH4',
        titleH4_5: 'titleH4_5',
        titleH5: 'titleH5',
        titleH6: 'titleH6',
    }



    static _isPresetInit = false;
    static _presetStyle = {};
    static _initPreset() {
        var { w, h, p } = SGHelperWindow.getWHPNoHeader();
        var isDef = SGHelperType.isDefined;
        var bF = 2.3; 
        var bF2 = 1.15;
        if (!SGText._isPresetInit) {
            SGText._presetStyle = StyleSheet.create({
                // {fontSize} and {margin} is % multiplication factor of screen w
                h1: { fontSize: Math.floor( 3.75 * Math.pow(1.15, 5) * w * 0.01), fontFamily: SGHelperStyle.fontFamily.regular, textAlign: 'left', textAlignVertical: 'top', color: SGHelperStyle.color.SGText.TextBlack, marginVertical: 0.75 * Math.pow(1.16, 5) * w * 0.01, marginHorizontal: w * 0.01 },
                h2: { fontSize: Math.floor( 3.75 * Math.pow(1.15, 4) * w * 0.01), fontFamily: SGHelperStyle.fontFamily.regular, textAlign: 'left', textAlignVertical: 'top', color: SGHelperStyle.color.SGText.TextBlack, marginVertical: 0.75 * Math.pow(1.16, 4) * w * 0.01, marginHorizontal: w * 0.01 },
                h3: { fontSize: Math.floor( 3.75 * Math.pow(1.15, 3) * w * 0.01), fontFamily: SGHelperStyle.fontFamily.regular, textAlign: 'left', textAlignVertical: 'top', color: SGHelperStyle.color.SGText.TextBlack, marginVertical: 0.75 * Math.pow(1.16, 3) * w * 0.01, marginHorizontal: w * 0.01 },
                h3_5: { fontSize: Math.floor( 3.75 * Math.pow(1.15, 2.5) * w * 0.01), fontFamily: SGHelperStyle.fontFamily.regular, textAlign: 'left', textAlignVertical: 'top', color: SGHelperStyle.color.SGText.TextBlack, marginVertical: 0.75 * Math.pow(1.16, 2.5) * w * 0.01, marginHorizontal: w * 0.01 },
                h4: { fontSize: Math.floor( 3.75 * Math.pow(1.15, 2) * w * 0.01), fontFamily: SGHelperStyle.fontFamily.regular, textAlign: 'left', textAlignVertical: 'top', color: SGHelperStyle.color.SGText.TextBlack, marginVertical: 0.75 * Math.pow(1.16, 2) * w * 0.01, marginHorizontal: w * 0.01 },
                h4_5: { fontSize: Math.floor( 3.75 * Math.pow(1.15, 1.5) * w * 0.01), fontFamily: SGHelperStyle.fontFamily.regular, textAlign: 'left', textAlignVertical: 'top', color: SGHelperStyle.color.SGText.TextBlack, marginVertical: 0.75 * Math.pow(1.16, 1.5) * w * 0.01, marginHorizontal: w * 0.01 },
                h4_85: { fontSize: Math.floor( 3.75 * Math.pow(1.15, 1.85) * w * 0.01), fontFamily: SGHelperStyle.fontFamily.regular, textAlign: 'left', textAlignVertical: 'top', color: SGHelperStyle.color.SGText.TextBlack, marginVertical: 0.75 * Math.pow(1.16, 1.5) * w * 0.01, marginHorizontal: w * 0.01 },
                h5: { fontSize: Math.floor( 3.75 * Math.pow(1.15, 1) * w * 0.01), fontFamily: SGHelperStyle.fontFamily.regular, textAlign: 'left', textAlignVertical: 'top', color: SGHelperStyle.color.SGText.TextBlack, marginVertical: 0.75 * Math.pow(1.16, 1) * w * 0.01, marginHorizontal: w * 0.01 },
                h5_border: { fontSize: Math.floor( 3.75 * Math.pow(1.15, 1) * w * 0.01), fontFamily: SGHelperStyle.fontFamily.regular, textAlign: 'left', textAlignVertical: 'top', color: SGHelperStyle.color.SGText.TextBlack, marginVertical: 0.75 * Math.pow(1.16, 1) * w * 0.01, marginHorizontal: w * 0.01, borderWidth: 1 },
                h5_5: { fontSize: Math.floor( 3.75 * Math.pow(1.15, 0.1) * w * 0.01), fontFamily: SGHelperStyle.fontFamily.regular, textAlign: 'left', textAlignVertical: 'top', color: SGHelperStyle.color.SGText.TextBlack, marginVertical: 0.75 * Math.pow(1.16, 0.1) * w * 0.01, marginHorizontal: w * 0.01 },
                h6: { fontSize: Math.floor( 3.75 * Math.pow(1.15, 0) * w * 0.01), fontFamily: SGHelperStyle.fontFamily.regular, textAlign: 'left', textAlignVertical: 'top', color: SGHelperStyle.color.SGText.TextBlack, marginVertical: 0.75 * Math.pow(1.16, 0) * w * 0.01, marginHorizontal: w * 0.01 },
                h6_5: { fontSize: Math.floor( 3.75 * Math.pow(1.15, -0.5) * w * 0.01), fontFamily: SGHelperStyle.fontFamily.regular, textAlign: 'left', textAlignVertical: 'top', color: SGHelperStyle.color.SGText.TextBlack, marginVertical: 0.75 * Math.pow(1.16, -0.5) * w * 0.01, marginHorizontal: w * 0.01 },
                h7: { fontSize: Math.floor( 3.75 * Math.pow(1.15, -1) * w * 0.01), fontFamily: SGHelperStyle.fontFamily.regular, textAlign: 'left', textAlignVertical: 'top', color: SGHelperStyle.color.SGText.TextBlack, marginVertical: 0.75 * Math.pow(1.16, -1) * w * 0.01, marginHorizontal: w * 0.01 },
                h8: { fontSize: Math.floor( 3.75 * Math.pow(1.15, -2) * w * 0.01), fontFamily: SGHelperStyle.fontFamily.regular, textAlign: 'left', textAlignVertical: 'top', color: SGHelperStyle.color.SGText.TextBlack, marginVertical: 0.75 * Math.pow(1.16, -2) * w * 0.01, marginHorizontal: w * 0.01 },
                h9: { fontSize: Math.floor( 3.75 * Math.pow(1.15, -3) * w * 0.01), fontFamily: SGHelperStyle.fontFamily.regular, textAlign: 'left', textAlignVertical: 'top', color: SGHelperStyle.color.SGText.TextBlack, marginVertical: 0.75 * Math.pow(1.16, -3) * w * 0.01, marginHorizontal: w * 0.01 },
                h9_5: { fontSize: Math.floor( 3.75 * Math.pow(1.15, -3.5) * w * 0.01), fontFamily: SGHelperStyle.fontFamily.regular, textAlign: 'left', textAlignVertical: 'top', color: SGHelperStyle.color.SGText.TextBlack, marginVertical: 0.75 * Math.pow(1.16, -3.5) * w * 0.01, marginHorizontal: w * 0.01 },
                h10: { fontSize: Math.floor( 3.75 * Math.pow(1.15, -4) * w * 0.01), fontFamily: SGHelperStyle.fontFamily.regular, textAlign: 'left', textAlignVertical: 'top', color: SGHelperStyle.color.SGText.TextBlack, marginVertical: 0.75 * Math.pow(1.16, -4) * w * 0.01, marginHorizontal: w * 0.01 },
                h11: { fontSize: Math.floor( 3.75 * Math.pow(1.15, -5) * w * 0.01), fontFamily: SGHelperStyle.fontFamily.regular, textAlign: 'left', textAlignVertical: 'top', color: SGHelperStyle.color.SGText.TextBlack, marginVertical: 0.75 * Math.pow(1.16, -5) * w * 0.01, marginHorizontal: w * 0.01 },
                h12: { fontSize: Math.floor( 3.75 * Math.pow(1.15, -6) * w * 0.01), fontFamily: SGHelperStyle.fontFamily.regular, textAlign: 'left', textAlignVertical: 'top', color: SGHelperStyle.color.SGText.TextBlack, marginVertical: 0.75 * Math.pow(1.16, -6) * w * 0.01, marginHorizontal: w * 0.01 },
                
                h0B: { fontSize: Math.floor( 3.75 * Math.pow(1.15, 6) * w * 0.01), fontFamily: SGHelperStyle.fontFamily.bold, textAlign: 'left', textAlignVertical: 'top', color: SGHelperStyle.color.SGText.TextBlack, marginVertical: 0.75 * Math.pow(1.16, 6) * w * 0.01, marginHorizontal: w * 0.01 },
                h1B: { fontSize: Math.floor( 3.75 * Math.pow(1.15, 5) * w * 0.01), fontFamily: SGHelperStyle.fontFamily.bold, textAlign: 'left', textAlignVertical: 'top', color: SGHelperStyle.color.SGText.TextBlack, marginVertical: 0.75 * Math.pow(1.16, 5) * w * 0.01, marginHorizontal: w * 0.01 },
                h2B: { fontSize: Math.floor( 3.75 * Math.pow(1.15, 4) * w * 0.01), fontFamily: SGHelperStyle.fontFamily.bold, textAlign: 'left', textAlignVertical: 'top', color: SGHelperStyle.color.SGText.TextBlack, marginVertical: 0.75 * Math.pow(1.16, 4) * w * 0.01, marginHorizontal: w * 0.01 },
                h2_3B: { fontSize: Math.floor( 3.75 * Math.pow(1.15, 3.3) * w * 0.01), fontFamily: SGHelperStyle.fontFamily.bold, textAlign: 'left', textAlignVertical: 'top', color: SGHelperStyle.color.SGText.TextBlack, marginVertical: 0.75 * Math.pow(1.16, 4) * w * 0.01, marginHorizontal: w * 0.01 },
                h3B: { fontSize: Math.floor( 3.75 * Math.pow(1.15, 3) * w * 0.01), fontFamily: SGHelperStyle.fontFamily.bold, textAlign: 'left', textAlignVertical: 'top', color: SGHelperStyle.color.SGText.TextBlack, marginVertical: 0.75 * Math.pow(1.16, 3) * w * 0.01, marginHorizontal: w * 0.01 },
                h4B: { fontSize: Math.floor( 3.75 * Math.pow(1.15, 2) * w * 0.01), fontFamily: SGHelperStyle.fontFamily.bold, textAlign: 'left', textAlignVertical: 'top', color: SGHelperStyle.color.SGText.TextBlack, marginVertical: 0.75 * Math.pow(1.16, 2) * w * 0.01, marginHorizontal: w * 0.01 },
                h4_5B: { fontSize: Math.floor( 3.75 * Math.pow(1.15, 1.5) * w * 0.01), fontFamily: SGHelperStyle.fontFamily.bold, textAlign: 'left', textAlignVertical: 'top', color: SGHelperStyle.color.SGText.TextBlack, marginVertical: 0.75 * Math.pow(1.16, 1.5) * w * 0.01, marginHorizontal: w * 0.01 },
                h5B: { fontSize: Math.floor( 3.75 * Math.pow(1.15, 1) * w * 0.01), fontFamily: SGHelperStyle.fontFamily.bold, textAlign: 'left', textAlignVertical: 'top', color: SGHelperStyle.color.SGText.TextBlack, marginVertical: 0.75 * Math.pow(1.16, 1) * w * 0.01, marginHorizontal: w * 0.01 },
                h5_5B: { fontSize: Math.floor( 3.75 * Math.pow(1.15, 0.05) * w * 0.01), fontFamily: SGHelperStyle.fontFamily.bold, textAlign: 'left', textAlignVertical: 'top', color: SGHelperStyle.color.SGText.TextBlack, marginVertical: 0.75 * Math.pow(1.16, 0.05) * w * 0.01, marginHorizontal: w * 0.01 },
                h6B: { fontSize: Math.floor( 3.75 * Math.pow(1.15, 0) * w * 0.01), fontFamily: SGHelperStyle.fontFamily.bold, textAlign: 'left', textAlignVertical: 'top', color: SGHelperStyle.color.SGText.TextBlack, marginVertical: 0.75 * Math.pow(1.16, 0) * w * 0.01, marginHorizontal: w * 0.01 },
                h6_5B: { fontSize: Math.floor( 3.75 * Math.pow(1.15, -0.5) * w * 0.01), fontFamily: SGHelperStyle.fontFamily.bold, textAlign: 'left', textAlignVertical: 'top', color: SGHelperStyle.color.SGText.TextBlack, marginVertical: 0.75 * Math.pow(1.16, -0.5) * w * 0.01, marginHorizontal: w * 0.01 },
                h7B: { fontSize: Math.floor( 3.75 * Math.pow(1.15, -1) * w * 0.01), fontFamily: SGHelperStyle.fontFamily.bold, textAlign: 'left', textAlignVertical: 'top', color: SGHelperStyle.color.SGText.TextBlack, marginVertical: 0.75 * Math.pow(1.16, -1) * w * 0.01, marginHorizontal: w * 0.01 },
                h7_5B: { fontSize: Math.floor( 3.75 * Math.pow(1.15, -1.5) * w * 0.01), fontFamily: SGHelperStyle.fontFamily.bold, textAlign: 'left', textAlignVertical: 'top', color: SGHelperStyle.color.SGText.TextBlack, marginVertical: 0.75 * Math.pow(1.16, -1) * w * 0.01, marginHorizontal: w * 0.01 },
                h8B: { fontSize: Math.floor( 3.75 * Math.pow(1.15, -2) * w * 0.01), fontFamily: SGHelperStyle.fontFamily.bold, textAlign: 'left', textAlignVertical: 'top', color: SGHelperStyle.color.SGText.TextBlack, marginVertical: 0.75 * Math.pow(1.16, -2) * w * 0.01, marginHorizontal: w * 0.01 },
                h8_1B: { fontSize: Math.floor( 3.75 * Math.pow(1.15, -2.1) * w * 0.01), fontFamily: SGHelperStyle.fontFamily.bold, textAlign: 'left', textAlignVertical: 'top', color: SGHelperStyle.color.SGText.TextBlack, marginVertical: 0.75 * Math.pow(1.16, -2) * w * 0.01, marginHorizontal: w * 0.01 },
                h8_5B: { fontSize: Math.floor( 3.75 * Math.pow(1.15, -2.5) * w * 0.01), fontFamily: SGHelperStyle.fontFamily.bold, textAlign: 'left', textAlignVertical: 'top', color: SGHelperStyle.color.SGText.TextBlack, marginVertical: 0.75 * Math.pow(1.16, -2) * w * 0.01, marginHorizontal: w * 0.01 },
                h9B: { fontSize: Math.floor( 3.75 * Math.pow(1.15, -3) * w * 0.01), fontFamily: SGHelperStyle.fontFamily.bold, textAlign: 'left', textAlignVertical: 'top', color: SGHelperStyle.color.SGText.TextBlack, marginVertical: 0.75 * Math.pow(1.16, -3) * w * 0.01, marginHorizontal: w * 0.01 },
                h9_5B: { fontSize: Math.floor( 3.75 * Math.pow(1.15, -3.5) * w * 0.01), fontFamily: SGHelperStyle.fontFamily.bold, textAlign: 'left', textAlignVertical: 'top', color: SGHelperStyle.color.SGText.TextBlack, marginVertical: 0.75 * Math.pow(1.16, -3.5) * w * 0.01, marginHorizontal: w * 0.01 },
                h10B: { fontSize: Math.floor( 3.75 * Math.pow(1.15, -4) * w * 0.01), fontFamily: SGHelperStyle.fontFamily.bold, textAlign: 'left', textAlignVertical: 'top', color: SGHelperStyle.color.SGText.TextBlack, marginVertical: 0.75 * Math.pow(1.16, -4) * w * 0.01, marginHorizontal: w * 0.01 },
                h11B: { fontSize: Math.floor( 3.75 * Math.pow(1.15, -5) * w * 0.01), fontFamily: SGHelperStyle.fontFamily.bold, textAlign: 'left', textAlignVertical: 'top', color: SGHelperStyle.color.SGText.TextBlack, marginVertical: 0.75 * Math.pow(1.16, -5) * w * 0.01, marginHorizontal: w * 0.01 },
                h12B: { fontSize: Math.floor( 3.75 * Math.pow(1.15, -6) * w * 0.01), fontFamily: SGHelperStyle.fontFamily.bold, textAlign: 'left', textAlignVertical: 'top', color: SGHelperStyle.color.SGText.TextBlack, marginVertical: 0.75 * Math.pow(1.16, -6) * w * 0.01, marginHorizontal: w * 0.01 },

                h1I: { fontSize: Math.floor( 3.75 * Math.pow(1.15, 5) * w * 0.01), fontFamily: SGHelperStyle.fontFamily.italic, textAlign: 'left', textAlignVertical: 'top', color: SGHelperStyle.color.SGText.TextBlack, marginVertical: 0.75 * Math.pow(1.16, 5) * w * 0.01, marginHorizontal: w * 0.01 },
                h2I: { fontSize: Math.floor( 3.75 * Math.pow(1.15, 4) * w * 0.01), fontFamily: SGHelperStyle.fontFamily.italic, textAlign: 'left', textAlignVertical: 'top', color: SGHelperStyle.color.SGText.TextBlack, marginVertical: 0.75 * Math.pow(1.16, 4) * w * 0.01, marginHorizontal: w * 0.01 },
                h3I: { fontSize: Math.floor( 3.75 * Math.pow(1.15, 3) * w * 0.01), fontFamily: SGHelperStyle.fontFamily.italic, textAlign: 'left', textAlignVertical: 'top', color: SGHelperStyle.color.SGText.TextBlack, marginVertical: 0.75 * Math.pow(1.16, 3) * w * 0.01, marginHorizontal: w * 0.01 },
                h4I: { fontSize: Math.floor( 3.75 * Math.pow(1.15, 2) * w * 0.01), fontFamily: SGHelperStyle.fontFamily.italic, textAlign: 'left', textAlignVertical: 'top', color: SGHelperStyle.color.SGText.TextBlack, marginVertical: 0.75 * Math.pow(1.16, 2) * w * 0.01, marginHorizontal: w * 0.01 },
                h4_5I: { fontSize: Math.floor( 3.75 * Math.pow(1.15, 1.5) * w * 0.01), fontFamily: SGHelperStyle.fontFamily.italic, textAlign: 'left', textAlignVertical: 'top', color: SGHelperStyle.color.SGText.TextBlack, marginVertical: 0.75 * Math.pow(1.16, 1.5) * w * 0.01, marginHorizontal: w * 0.01 },
                h5I: { fontSize: Math.floor( 3.75 * Math.pow(1.15, 1) * w * 0.01), fontFamily: SGHelperStyle.fontFamily.italic, textAlign: 'left', textAlignVertical: 'top', color: SGHelperStyle.color.SGText.TextBlack, marginVertical: 0.75 * Math.pow(1.16, 1) * w * 0.01, marginHorizontal: w * 0.01 },
                h5_5I: { fontSize: Math.floor( 3.75 * Math.pow(1.15, 0.1) * w * 0.01), fontFamily: SGHelperStyle.fontFamily.italic, textAlign: 'left', textAlignVertical: 'top', color: SGHelperStyle.color.SGText.TextBlack, marginVertical: 0.75 * Math.pow(1.16, 0.1) * w * 0.01, marginHorizontal: w * 0.01 },
                h6I: { fontSize: Math.floor( 3.75 * Math.pow(1.15, 0) * w * 0.01), fontFamily: SGHelperStyle.fontFamily.italic, textAlign: 'left', textAlignVertical: 'top', color: SGHelperStyle.color.SGText.TextBlack, marginVertical: 0.75 * Math.pow(1.16, 0) * w * 0.01, marginHorizontal: w * 0.01 },
                h6_5I: { fontSize: Math.floor( 3.75 * Math.pow(1.15, -0.5) * w * 0.01), fontFamily: SGHelperStyle.fontFamily.italic, textAlign: 'left', textAlignVertical: 'top', color: SGHelperStyle.color.SGText.TextBlack, marginVertical: 0.75 * Math.pow(1.16, -0.5) * w * 0.01, marginHorizontal: w * 0.01 },
                h7I: { fontSize: Math.floor( 3.75 * Math.pow(1.15, -1) * w * 0.01), fontFamily: SGHelperStyle.fontFamily.italic, textAlign: 'left', textAlignVertical: 'top', color: SGHelperStyle.color.SGText.TextBlack, marginVertical: 0.75 * Math.pow(1.16, -1) * w * 0.01, marginHorizontal: w * 0.01 },
                h8I: { fontSize: Math.floor( 3.75 * Math.pow(1.15, -2) * w * 0.01), fontFamily: SGHelperStyle.fontFamily.italic, textAlign: 'left', textAlignVertical: 'top', color: SGHelperStyle.color.SGText.TextBlack, marginVertical: 0.75 * Math.pow(1.16, -2) * w * 0.01, marginHorizontal: w * 0.01 },
                h9I: { fontSize: Math.floor( 3.75 * Math.pow(1.15, -3) * w * 0.01), fontFamily: SGHelperStyle.fontFamily.italic, textAlign: 'left', textAlignVertical: 'top', color: SGHelperStyle.color.SGText.TextBlack, marginVertical: 0.75 * Math.pow(1.16, -3) * w * 0.01, marginHorizontal: w * 0.01 },
                h9_5I: { fontSize: Math.floor( 3.75 * Math.pow(1.15, -3.5) * w * 0.01), fontFamily: SGHelperStyle.fontFamily.italic, textAlign: 'left', textAlignVertical: 'top', color: SGHelperStyle.color.SGText.TextBlack, marginVertical: 0.75 * Math.pow(1.16, -3.5) * w * 0.01, marginHorizontal: w * 0.01 },
                h10I: { fontSize: Math.floor( 3.75 * Math.pow(1.15, -4) * w * 0.01), fontFamily: SGHelperStyle.fontFamily.italic, textAlign: 'left', textAlignVertical: 'top', color: SGHelperStyle.color.SGText.TextBlack, marginVertical: 0.75 * Math.pow(1.16, -4) * w * 0.01, marginHorizontal: w * 0.01 },
                h11I: { fontSize: Math.floor( 3.75 * Math.pow(1.15, -5) * w * 0.01), fontFamily: SGHelperStyle.fontFamily.italic, textAlign: 'left', textAlignVertical: 'top', color: SGHelperStyle.color.SGText.TextBlack, marginVertical: 0.75 * Math.pow(1.16, -5) * w * 0.01, marginHorizontal: w * 0.01 },
                h12I: { fontSize: Math.floor( 3.75 * Math.pow(1.15, -6) * w * 0.01), fontFamily: SGHelperStyle.fontFamily.italic, textAlign: 'left', textAlignVertical: 'top', color: SGHelperStyle.color.SGText.TextBlack, marginVertical: 0.75 * Math.pow(1.16, -6) * w * 0.01, marginHorizontal: w * 0.01 },

                heading2: {fontSize: Math.floor( 3.75 * Math.pow(1.15, 4) * w * 0.01), fontFamily: SGHelperStyle.fontFamily.regular, textAlign: 'left', textAlignVertical: 'top', color: SGHelperStyle.color.SGText.TextBlack, marginVertical: 0.75 * Math.pow(1.16, 4) * w * 0.01, marginHorizontal: w * 0.01, letterSpacing: 0.75},
                heading3: {fontSize: Math.floor( 3.75 * Math.pow(1.15, 3) * w * 0.01), fontFamily: SGHelperStyle.fontFamily.regular, textAlign: 'left', textAlignVertical: 'top', color: SGHelperStyle.color.SGText.TextBlack, marginVertical: 0.75 * Math.pow(1.16, 3) * w * 0.01, marginHorizontal: w * 0.01, letterSpacing: -0.25},
                heading4: {fontSize: Math.floor( 3.75 * Math.pow(1.15, 1.5) * w * 0.01), fontFamily: SGHelperStyle.fontFamily.regular, textAlign: 'left', textAlignVertical: 'top', color: SGHelperStyle.color.SGText.TextBlack, marginVertical: 0.75 * Math.pow(1.16, 1.5) * w * 0.01, marginHorizontal: w * 0.01, letterSpacing: 0.1},
                heading5: {fontSize: Math.floor( 3.75 * Math.pow(1.15, 0.3) * w * 0.01), fontFamily: SGHelperStyle.fontFamily.regular, textAlign: 'left', textAlignVertical: 'top', color: SGHelperStyle.color.SGText.TextBlack, marginVertical: 0.75 * Math.pow(1.16, 0.3) * w * 0.01, marginHorizontal: w * 0.01, letterSpacing: 0.3},
                heading6: {fontSize: Math.floor( 3.75 * Math.pow(1.15, 0) * w * 0.01), fontFamily: SGHelperStyle.fontFamily.regular, textAlign: 'left', textAlignVertical: 'top', color: SGHelperStyle.color.SGText.TextBlack, marginVertical: 0.75 * Math.pow(1.16, 0) * w * 0.01, marginHorizontal: w * 0.01, letterSpacing: 0.1},
                heading7: {fontSize: Math.floor( 3.75 * Math.pow(1.15, -1) * w * 0.01), fontFamily: SGHelperStyle.fontFamily.regular, textAlign: 'left', textAlignVertical: 'top', color: SGHelperStyle.color.SGText.TextBlack, marginVertical: 0.75 * Math.pow(1.16, -1) * w * 0.01, marginHorizontal: w * 0.01, letterSpacing: 0.1},
                heading8: {},
                heading9: {fontSize: Math.floor( 3.75 * Math.pow(1.15, -3) * w * 0.01), fontFamily: SGHelperStyle.fontFamily.regular, textAlign: 'left', textAlignVertical: 'top', color: SGHelperStyle.color.SGText.TextBlack, marginVertical: 0.75 * Math.pow(1.16, -3) * w * 0.01, marginHorizontal: w * 0.01, letterSpacing: 0.1},
                heading10: {fontSize: Math.floor( 3.75 * Math.pow(1.15, -4) * w * 0.01), fontFamily: SGHelperStyle.fontFamily.regular, textAlign: 'left', textAlignVertical: 'top', color: SGHelperStyle.color.SGText.TextBlack, marginVertical: 0.75 * Math.pow(1.16, -4) * w * 0.01, marginHorizontal: w * 0.01, letterSpacing: 0.1},
                
                heading2B: {fontSize: Math.floor( 3.75 * Math.pow(1.15, 4) * w * 0.01), fontFamily: SGHelperStyle.fontFamily.bold, textAlign: 'left', textAlignVertical: 'top', color: SGHelperStyle.color.SGText.TextBlack, marginVertical: 0.75 * Math.pow(1.16, 4) * w * 0.01, marginHorizontal: w * 0.01, letterSpacing: 0.75},
                heading3B: {fontSize: Math.floor( 3.75 * Math.pow(1.15, 3.35) * w * 0.01), fontFamily: SGHelperStyle.fontFamily.bold, textAlign: 'left', textAlignVertical: 'top', color: SGHelperStyle.color.SGText.TextBlack, marginVertical: 0.75 * Math.pow(1.16, 3.35) * w * 0.01, marginHorizontal: w * 0.01, letterSpacing: -0.25},
                heading4B: {fontSize: Math.floor( 3.75 * Math.pow(1.15, 1.25) * w * 0.01), fontFamily: SGHelperStyle.fontFamily.bold, textAlign: 'left', textAlignVertical: 'top', color: SGHelperStyle.color.SGText.TextBlack, marginVertical: 0.75 * Math.pow(1.16, 1.25) * w * 0.01, marginHorizontal: w * 0.01, letterSpacing: 0.1},
                heading5B: {fontSize: Math.floor( 3.75 * Math.pow(1.15, 0.54) * w * 0.01), fontFamily: SGHelperStyle.fontFamily.bold, textAlign: 'left', textAlignVertical: 'top', color: SGHelperStyle.color.SGText.TextBlack, marginVertical: 0.75 * Math.pow(1.16, 0.54) * w * 0.01, marginHorizontal: w * 0.01, letterSpacing: 0.1},
                heading6B: {fontSize: Math.floor( 3.75 * Math.pow(1.15, 0) * w * 0.01), fontFamily: SGHelperStyle.fontFamily.bold, textAlign: 'left', textAlignVertical: 'top', color: SGHelperStyle.color.SGText.TextBlack, marginVertical: 0.75 * Math.pow(1.16, 0) * w * 0.01, marginHorizontal: w * 0.01, letterSpacing: 0.1},
                heading7B: {fontSize: Math.floor( 3.75 * Math.pow(1.15, -1) * w * 0.01), fontFamily: SGHelperStyle.fontFamily.bold, textAlign: 'left', textAlignVertical: 'top', color: SGHelperStyle.color.SGText.TextBlack, marginVertical: 0.75 * Math.pow(1.16, -1) * w * 0.01, marginHorizontal: w * 0.01, letterSpacing: 0.1},
                heading8B: {},
                heading9B: {fontSize: Math.floor( 3.75 * Math.pow(1.15, -3) * w * 0.01), fontFamily: SGHelperStyle.fontFamily.bold, textAlign: 'left', textAlignVertical: 'top', color: SGHelperStyle.color.SGText.TextBlack, marginVertical: 0.75 * Math.pow(1.16, -3) * w * 0.01, marginHorizontal: w * 0.01, letterSpacing: 0.1},
                heading10B: {fontSize: Math.floor( 3.75 * Math.pow(1.15, -4) * w * 0.01), fontFamily: SGHelperStyle.fontFamily.bold, textAlign: 'left', textAlignVertical: 'top', color: SGHelperStyle.color.SGText.TextBlack, marginVertical: 0.75 * Math.pow(1.16, -4) * w * 0.01, marginHorizontal: w * 0.01, letterSpacing: 0.1},
                
                hidden: { width: 0, overflow: 'hidden', borderWidth: 0, height: 0, marginHorizontal: 0, marginVertical: 0, fontSize: 0.00001, padding: 0, margin: 0, },

                //Standard Ko Gerry - Leon - 
                titleH1B: { fontSize: Math.floor( bF * Math.pow(bF2, 5) * w * 0.01), fontFamily: SGHelperStyle.fontFamily.bold, textAlign: 'left', textAlignVertical: 'top', color: SGHelperStyle.color.SGText.TextBlack, marginVertical: 0.75 * Math.pow(1.16, 1) * w * 0.01, marginHorizontal: w * 0.01 },
                titleH2B: { fontSize: Math.floor( bF * Math.pow(bF2, 4) * w * 0.01), fontFamily: SGHelperStyle.fontFamily.bold, textAlign: 'left', textAlignVertical: 'top', color: SGHelperStyle.color.SGText.TextBlack, marginVertical: 0.75 * Math.pow(1.16, 1) * w * 0.01, marginHorizontal: w * 0.01 },
                titleH3B: { fontSize: Math.floor( bF * Math.pow(bF2, 3) * w * 0.01), fontFamily: SGHelperStyle.fontFamily.bold, textAlign: 'left', textAlignVertical: 'top', color: SGHelperStyle.color.SGText.TextBlack, marginVertical: 0.75 * Math.pow(1.16, 1) * w * 0.01, marginHorizontal: w * 0.01 },
                titleH3B_C: { fontSize: Math.floor( bF * Math.pow(bF2, 3) * w * 0.01), fontFamily: SGHelperStyle.fontFamily.bold, textAlign: 'center', textAlignVertical: 'top', color: SGHelperStyle.color.SGText.TextBlack, marginVertical: 0.75 * Math.pow(1.16, 1) * w * 0.01, marginHorizontal: w * 0.01 },
                titleH4B: { fontSize: Math.floor( bF * Math.pow(bF2, 2) * w * 0.01), fontFamily: SGHelperStyle.fontFamily.bold, textAlign: 'left', textAlignVertical: 'top', color: SGHelperStyle.color.SGText.TextBlack, marginVertical: 0.75 * Math.pow(1.16, 1) * w * 0.01, marginHorizontal: w * 0.01 },
                titleH4_5B: { fontSize: Math.floor( bF * Math.pow(bF2, 1.5) * w * 0.01), fontFamily: SGHelperStyle.fontFamily.bold, textAlign: 'left', textAlignVertical: 'top', color: SGHelperStyle.color.SGText.TextBlack, marginVertical: 0.75 * Math.pow(1.16, 1) * w * 0.01, marginHorizontal: w * 0.01 },
                titleH5B: { fontSize: Math.floor( bF * Math.pow(bF2, 1) * w * 0.01), fontFamily: SGHelperStyle.fontFamily.bold, textAlign: 'left', textAlignVertical: 'top', color: SGHelperStyle.color.SGText.TextBlack, marginVertical: 0.75 * Math.pow(1.16, 1) * w * 0.01, marginHorizontal: w * 0.01 },
                titleH6B: { fontSize: Math.floor( bF * Math.pow(bF2, 0) * w * 0.01), fontFamily: SGHelperStyle.fontFamily.bold, textAlign: 'left', textAlignVertical: 'top', color: SGHelperStyle.color.SGText.TextBlack, marginVertical: 0.75 * Math.pow(1.16, 1) * w * 0.01, marginHorizontal: w * 0.01 },
                titleH1: { fontSize: Math.floor( bF * Math.pow(bF2, 5) * w * 0.01), fontFamily: SGHelperStyle.fontFamily.regular, textAlign: 'left', textAlignVertical: 'top', color: SGHelperStyle.color.SGText.TextBlack, marginVertical: 0.75 * Math.pow(1.16, 1) * w * 0.01, marginHorizontal: w * 0.01 },
                titleH2: { fontSize: Math.floor( bF * Math.pow(bF2, 4) * w * 0.01), fontFamily: SGHelperStyle.fontFamily.regular, textAlign: 'left', textAlignVertical: 'top', color: SGHelperStyle.color.SGText.TextBlack, marginVertical: 0.75 * Math.pow(1.16, 1) * w * 0.01, marginHorizontal: w * 0.01 },
                titleH3: { fontSize: Math.floor( bF * Math.pow(bF2, 3) * w * 0.01), fontFamily: SGHelperStyle.fontFamily.regular, textAlign: 'left', textAlignVertical: 'top', color: SGHelperStyle.color.SGText.TextBlack, marginVertical: 0.75 * Math.pow(1.16, 1) * w * 0.01, marginHorizontal: w * 0.01 },
                titleH3_5: { fontSize: Math.floor( bF * Math.pow(bF2, 2.5) * w * 0.01), fontFamily: SGHelperStyle.fontFamily.regular, textAlign: 'left', textAlignVertical: 'top', color: SGHelperStyle.color.SGText.TextBlack, marginVertical: 0.75 * Math.pow(1.16, 1) * w * 0.01, marginHorizontal: w * 0.01 },
                titleH4: { fontSize: Math.floor( bF * Math.pow(bF2, 2) * w * 0.01), fontFamily: SGHelperStyle.fontFamily.regular, textAlign: 'left', textAlignVertical: 'top', color: SGHelperStyle.color.SGText.TextBlack, marginVertical: 0.75 * Math.pow(1.16, 1) * w * 0.01, marginHorizontal: w * 0.01 },
                titleH4_5: { fontSize: Math.floor( bF * Math.pow(bF2, 1.5) * w * 0.01), fontFamily: SGHelperStyle.fontFamily.regular, textAlign: 'left', textAlignVertical: 'top', color: SGHelperStyle.color.SGText.TextBlack, marginVertical: 0.75 * Math.pow(1.16, 1) * w * 0.01, marginHorizontal: w * 0.01 },
                titleH5: { fontSize: Math.floor( bF * Math.pow(bF2, 1) * w * 0.01), fontFamily: SGHelperStyle.fontFamily.regular, textAlign: 'left', textAlignVertical: 'top', color: SGHelperStyle.color.SGText.TextBlack, marginVertical: 0.75 * Math.pow(1.16, 1) * w * 0.01, marginHorizontal: w * 0.01 },
                titleH6: { fontSize: Math.floor( bF * Math.pow(bF2, 0) * w * 0.01), fontFamily: SGHelperStyle.fontFamily.regular, textAlign: 'left', textAlignVertical: 'top', color: SGHelperStyle.color.SGText.TextBlack, marginVertical: 0.75 * Math.pow(1.16, 1) * w * 0.01, marginHorizontal: w * 0.01 },
            });


            SGText._isPresetInit = true;
        }
    }

    constructor(props, context, ...args) {
        super(props, context, ...args);
        SGText._initPreset();

    }

    render() {
        var myProps = [];
        myProps = SGHelperStyle.addStyleProps(this.props,
            {
                ...(this.props.preset ? SGText._presetStyle[this.props.preset] : SGText._presetStyle.h6),
                ...(this.props.disabled ? { opacity: SGHelperStyle.opacity.disabled } : {}),
                ...(this.props.darkMode ? { color: SGHelperStyle.color.SGText.TextWhite } : this.props.grey ? { color: SGHelperStyle.color.SGText.TextGrey } : this.props.white ? { color: SGHelperStyle.color.SGText.TextWhite } : {})
            });
        myProps.onPress = this.props.disabled ? () => { } : SGBaseControl.makeSafeClick(this, myProps.onPress, this.props.safeClickDelay);
        if (this.props.hidden) {
            myProps.children = null;
            myProps.style = SGText._presetStyle.hidden;
        }
        return (
            !this.props.hidden &&
            <Text accessible={true} accessibilityLabel={'SGTextRoot'} {...myProps} allowFontScaling={false}></Text>
        );
    }
}










