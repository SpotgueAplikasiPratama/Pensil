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
* 6. safeClickDelay props
*/

import React from 'react';
import { SGTouchableOpacity } from './SGTouchableOpacity';
import { SGTouchableHighlight } from './SGTouchableHighlight';
import { SGText } from './SGText';
import { SGBaseControl } from './SGBaseControl';
import { StyleSheet } from 'react-native';
import { SGHelperGlobalVar } from '../helper/SGHelperGlobalVar';
import { SGHelperType } from '../helper/SGHelperType';
import { SGHelperStyle } from '../helper/SGHelperStyle';
import { SGHelperWindow } from '../helper/SGHelperWindow';

export class SGButton extends SGBaseControl {
    static preset = {
        green : 'green',
        red : 'red',
        orange : 'orange',
        yellow : 'yellow',
        blue : 'blue',
        grey : 'grey',
        black : 'black',
        white : 'white',
        blackBorder : 'blackBorder',
        greyBorder : 'greyBorder',
        greenBorder : 'greenBorder',
        noBorder: 'noBorder',
        default: 'default',
        disabled : 'disabled',
        hidden: 'hidden',
    }
    static _presetTextProps = StyleSheet.create({
        green : { color: SGHelperStyle.color.SGButton.TextWhite },
        red : { color: SGHelperStyle.color.SGButton.TextWhite },
        orange : { color: SGHelperStyle.color.SGButton.TextWhite },
        yellow : {color: SGHelperStyle.color.SGButton.TextWhite},
        blue : { color: SGHelperStyle.color.SGButton.TextWhite },
        grey : { color: SGHelperStyle.color.SGButton.TextWhite },
        black : { color: SGHelperStyle.color.SGButton.TextWhite },
        white : { color: SGHelperStyle.color.SGButton.TextGrey },
        blackBorder : { color: SGHelperStyle.color.SGButton.TextBlack },
        greyBorder : { color: SGHelperStyle.color.SGButton.TextGrey },
        greenBorder : { color: SGHelperStyle.color.SGButton.TextGrey },
        noBorder : { color: SGHelperStyle.color.SGButton.TextBlue },
        default : { color: SGHelperStyle.color.SGButton.TextBlack },
        disabled : { color: SGHelperStyle.color.SGButton.TextDisabled },
        hidden: {},
    });
    static _isPresetInit = false;
    static _presetButtonProps = {};
    static _initPreset() {
        if (!SGButton._isPresetInit) {
            var { w, h, p } = SGHelperWindow.getWHPNoHeader();
            const isDef = SGHelperType.isDefined;
            SGButton._presetButtonProps = StyleSheet.create({
                green : {minWidth:w*0.2,alignItems:'center', backgroundColor: SGHelperStyle.color.SGButton.Green, paddingVertical: 2.5*p, paddingHorizontal: 4 * p, borderRadius: 6 * p, marginHorizontal: p, marginVertical: p  },
                red : { minWidth:w*0.2,alignItems:'center',backgroundColor: SGHelperStyle.color.SGButton.Red, paddingVertical: 2.5*p, paddingHorizontal: 4 * p, borderRadius: 6 * p, marginHorizontal: p, marginVertical: p  },
                orange : { minWidth:w*0.2,alignItems:'center',backgroundColor: SGHelperStyle.color.SGButton.Orange, paddingVertical: 2.5*p, paddingHorizontal: 4 * p, borderRadius: 6 * p, marginHorizontal: p, marginVertical: p  },
                yellow : { minWidth:w*0.2,alignItems:'center',backgroundColor: SGHelperStyle.color.SGButton.Orange, paddingVertical: 2.5*p, paddingHorizontal: 4 * p, borderRadius: 6 * p, marginHorizontal: p, marginVertical: p  },
                blue : { minWidth:w*0.2,alignItems:'center',backgroundColor: SGHelperStyle.color.SGButton.Blue, paddingVertical: 2.5*p, paddingHorizontal: 4 * p, borderRadius: 6 * p, marginHorizontal: p, marginVertical: p  },
                grey : { minWidth:w*0.2,alignItems:'center',backgroundColor: SGHelperStyle.color.SGButton.Grey, paddingVertical: 2.5*p, paddingHorizontal: 4 * p, borderRadius: 6 * p, marginHorizontal: p, marginVertical: p  },
                black : { minWidth:w*0.2,alignItems:'center',backgroundColor: SGHelperStyle.color.SGButton.Black, paddingVertical: 2.5*p, paddingHorizontal: 4 * p, borderRadius: 6 * p, marginHorizontal: p, marginVertical: p  },
                white : { minWidth:w*0.2,alignItems:'center',backgroundColor: SGHelperStyle.color.SGButton.White, paddingVertical: 2.5*p, paddingHorizontal: 4 * p, borderRadius: 6 * p, marginHorizontal: p, marginVertical: p  },
                blackBorder : { minWidth:w*0.2,alignItems:'center',backgroundColor: SGHelperStyle.color.SGButton.White,borderColor: SGHelperStyle.color.SGButton.Black, borderWidth: 1.5,  paddingVertical: 2.5*p, paddingHorizontal: 4 * p, borderRadius: 6 * p, marginHorizontal: p, marginVertical: p  },
                greyBorder : { minWidth:w*0.2,alignItems:'center',backgroundColor: SGHelperStyle.color.SGButton.White,borderColor: SGHelperStyle.color.SGButton.TextGrey, borderWidth: 1.5,  paddingVertical: 2.5*p, paddingHorizontal: 4 * p, borderRadius: 6 * p, marginHorizontal: p, marginVertical: p  },
                greenBorder : { minWidth:w*0.2,alignItems:'center',backgroundColor: SGHelperStyle.color.SGButton.White,borderColor: SGHelperStyle.color.SGButton.Green, borderWidth: 1.5, paddingVertical: 2.5*p, paddingHorizontal: 4 * p, borderRadius: 6 * p, marginHorizontal: p, marginVertical: p  },
                noBorder : { minWidth:w*0.2,alignItems:'center', paddingVertical: 0, paddingHorizontal: 0, marginHorizontal: p, marginVertical: p  },
                default : { alignItems:'center', paddingVertical: 0, paddingHorizontal: 0, borderRadius: 0, marginHorizontal: 0, marginVertical: 0  },
                disabled : { minWidth:w*0.2,alignItems:'center', backgroundColor: SGHelperStyle.color.SGButton.Disabled, paddingVertical: 2.5*p, paddingHorizontal: 4 * p, borderRadius: 6 * p, marginHorizontal: p, marginVertical: p  },
                hidden: { width: 0, height: 0, backgroundColor: 'blue', overflow: 'hidden', borderRadius: 0, paddingVertical: 0, paddingHorizontal: 0, marginHorizontal: 0, marginVertical: 0 },
            });
            SGButton._isPresetInit = true;
        }
    }

    constructor(props, context, ...args) {
        super(props, context, ...args);
        SGButton._initPreset();
    }
    initProps() {
        if (super.isPropsNeedInitOrChanged(this.props)) {
            var isDef = SGHelperType.isDefined;
            var txColor = !isDef(this.props.style) ? null : (!isDef(this.props.style.color) ? null : { color: this.props.style.color });
            this.textStyle = { ...SGButton._presetTextProps[( this.props.disabled && !this.props.overrideDisabled? SGButton.preset.disabled : this.props.preset ? this.props.preset : SGButton.preset.black)], ...txColor };
            var pr = (this.props.hidden ? SGButton.preset.hidden : this.props.disabled && !this.props.overrideDisabled? SGButton.preset.disabled : (this.props.preset ? this.props.preset : SGButton.preset.black));
            this.myProps = SGHelperStyle.addStyleProps(this.props, SGButton._presetButtonProps[pr]);
            this.myProps.onPress = SGBaseControl.makeSafeClick(this, this.myProps.onPress, this.props.safeClickDelay);
        }
    }
    render() {
        this.initProps();
        return (
            !this.props.hidden &&
            <SGTouchableHighlight {...this.myProps} underlayColor={SGHelperStyle.color.SGButton.Underlay}>
                <SGText accessible={true} accessibilityLabel={'SGButtonText'} preset={this.props.textPreset ? this.props.textPreset : SGText.preset.titleH3B} style={this.textStyle}>{this.props.label}</SGText>
            </SGTouchableHighlight>
        )
    }
}
