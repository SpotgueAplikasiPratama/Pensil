/**
 * Wrap TouchableNativeFeedback from react-native
 * specific behavior : 
 * 1. implement safe click
 * 2. hidden true|false
 * 3. noSafeClick true|false
 * 4. disabled true|false
 * 5. shadow true|false
 * 6. safeClickDelay props
 */

import React from 'react';
import { TouchableNativeFeedback } from 'react-native';
import { SGBaseControl } from './SGBaseControl';
import {SGView} from './SGView';
import { SGHelperStyle } from '../helper/SGHelperStyle';

export class SGTouchableNativeFeedback extends SGBaseControl {
    static SelectableBackground(){
        return TouchableNativeFeedback.SelectableBackground();
    }
    constructor(props, context, ...args) {
        super(props, context, ...args);
    }
    render() {
        var myProps=[];
        myProps = SGHelperStyle.addStyleProps(this.props, this.props.hidden?{width:0,height:0,margin:0, overflow:'hidden'}:(this.props.disabled?{opacity:SGHelperStyle.opacity.disabled}:{}));        
        var vStyle=myProps.style;
        myProps.style=null;
        myProps.onPress=null;
        var onPressSafe =this.props.disabled? null : (!this.props.noSafeClick ?SGBaseControl.makeSafeClick(this, this.props.onPress, this.props.safeClickDelay):this.props.onPress) ;
        return (
            !this.props.hidden &&
            <SGView shadow={this.props.shadow}  shadowIntensity={this.props.shadowIntensity} style={vStyle}>
                <TouchableNativeFeedback {...myProps} onPress={onPressSafe} />
            </SGView>
        )
    }
}
