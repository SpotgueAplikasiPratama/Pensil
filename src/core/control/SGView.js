/**
 * wrap react-native View component with 2 additional behavior
 * 1. ability to randomize background color based on global property 'UseRandomColor'
 * 2. apply default style and have preset to choose
 * 3. hidden true|false
 * 4. shadow true|false with prop shadowIntensity from 0.0 to 1.0
 */

import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { SGHelperGlobalVar } from '../helper/SGHelperGlobalVar';
import { SGHelperStyle } from '../helper/SGHelperStyle';
import { SGHelperType } from '../helper/SGHelperType';
import { SGBaseControl } from './SGBaseControl';

export class SGView extends SGBaseControl {
    static preset = {
        default: 'default',
        hidden: 'hidden',
    }
    static _presetStyle = StyleSheet.create({
        default: { justifyContent: 'center', alignItems: 'center', overflow: 'hidden', },
        hidden: { width: 0, height: 0, margin: 0, overflow: 'hidden', flex: null, borderWidth: 0, borderRadius: 0, padding: 0 },
    });
    constructor(props, context, ...args) {
        super(props, context, ...args);
    }

    render() {
        var { w, h, p } = this._screenWHPNoHeader;
        var myProps;
        if (this.props.hidden) {
            myProps = SGHelperStyle.addStyleProps(this.props, SGView._presetStyle[SGView.preset.hidden], true);
        } else {
            myProps = SGHelperStyle.addStyleProps(this.props, SGView._presetStyle[this.props.preset ? this.props.preset : SGView.preset.default]);
            if (this.props.shadow && !this.props.disabled) {
                myProps.style = SGHelperStyle.addShadowStyle(myProps.style, this.props.shadowIntensity);
            }
            if (this.props.disabled) {
                myProps.style = SGHelperStyle.prependStyle(myProps.style, { opacity: SGHelperStyle.opacity.disabled })
            }
        }
        if (SGHelperGlobalVar.getVar('UseRandomColor') && !SGHelperType.isDefined(myProps.dontRandomColor)) {
            myProps.style.backgroundColor = SGHelperStyle.getRandomBGColor();
        }
        return (
            !this.props.hidden &&
            <View  {...myProps}></View>
        );
    }
}