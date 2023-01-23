import React from 'react';
import { ActivityIndicator } from 'react-native';
import { SGHelperStyle } from '../helper/SGHelperStyle';
import { SGBaseControl } from '../control/SGBaseControl';
import { SGView } from '../control/SGView';
/**
 * wrap react-native Activity Indicator with 1 additional behavior
 * 1. apply default preset from list of pre-defined presets
 * 2. hidden true|false
 * 3. darkMode true|false
 */
export class SGActivityIndicator extends SGBaseControl {
    static preset = {
        h1: 'h1',
        h2: 'h2',
    }
    static _isPresetInit = false;
    static _presetProps = {
        light:{
            h1: { size: 'large', color: SGHelperStyle.color.SGActivityIndicator.light },
            h2: { size: 'small', color: SGHelperStyle.color.SGActivityIndicator.light },    
        },
        dark:{
            h1: { size: 'large', color: SGHelperStyle.color.SGActivityIndicator.dark },
            h2: { size: 'small', color: SGHelperStyle.color.SGActivityIndicator.dark },    
        },
    };
    constructor(props, context, ...args) {
        super(props, context, ...args);
    }
    render() {
        return (
            !this.props.hidden &&
            <SGView accessible={true} accessibilityLabel={'SGActivityIndicatorRootView'} hidden={this.props.hidden} style={this.props.style}>
                <ActivityIndicator accessible={true} accessibilityLabel={'SGActivityIndicator2'} {...SGActivityIndicator._presetProps[this.props.darkMode?'dark':'light'][this.props.preset ? this.props.preset : SGActivityIndicator.preset.h2]} />
            </SGView>
        );
    }
}


