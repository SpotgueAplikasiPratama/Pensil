/**
 * Wrap TouchableHighlight from react-native
 * specific behavior : 
 * 1. implement safe click
 * 2. hidden true|false
 * 3. noSafeClick true|false
 * 4. disabled true|false
 * 5. shadow true|false with prop shadowIntensity from 0.0 to 1.0
 * 6. safeClickDelay props
 */

import React from 'react';
import {Platform} from 'react-native';
import { TouchableHighlight } from 'react-native';
import { SGBaseControl } from './SGBaseControl';
import { SGHelperStyle } from '../helper/SGHelperStyle';

export class SGTouchableHighlight extends SGBaseControl {
    constructor(props, context, ...args) {
        super(props, context, ...args);
    }
    render() {
        var myProps = [];
        myProps = SGHelperStyle.addStyleProps(this.props, this.props.hidden? {width:0,height:0,margin:0, overflow:'hidden'}:(this.props.disabled?{opacity:SGHelperStyle.opacity.disabled}:{}) ,true);
        myProps.underlayColor = myProps.underlayColor? myProps.underlayColor:SGHelperStyle.color.SGTouchableHighlight.UnderlayGrey;
        if(this.props.disabled){
            myProps.onPress = null
        } else {
            if(!this.props.noSafeClick){
                myProps.onPress = SGBaseControl.makeSafeClick(this, myProps.onPress, this.props.safeClickDelay);
            }    
        }
        if (this.props.shadow && !this.props.hidden && !this.props.disabled) {
            myProps.style = SGHelperStyle.addShadowStyle(myProps.style, this.props.shadowIntensity);
        }
        return (
            !this.props.hidden &&
            <TouchableHighlight {...myProps} />
        );
    }
}
