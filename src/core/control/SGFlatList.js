/**
 * wrap react-native flatlist component with 2 additional behavior
 * 1. default style and preset to choose from
 * 2. hidden true|false
 */

import React from 'react';
import { StyleSheet, FlatList } from 'react-native';
import { SGHelperStyle, SGHelperType } from '../helper';
import { SGBaseControl } from './SGBaseControl';
import { SGView } from './SGView';
import { SGActivityIndicator } from './SGActivityIndicator';


export class SGFlatList extends SGBaseControl {
    static preset = {
        default: 'default',
        hidden: 'hidden',
    }

    static _presetStyle = StyleSheet.create({
        default: { alignSelf: 'stretch', alignItems: 'stretch' },
        hidden: { width: 0, height: 0, margin: 0, overflow: 'hidden' },
    });

    constructor(props, context, ...args) {
        super(props, context, ...args);
        this.FL = React.createRef();
    }
    scrollToIndex(v){
        this.FL.current.scrollToIndex(v)
    }
    render() {
        var myProps;
        myProps = SGHelperStyle.addStyleProps(this.props,null);
        myProps.style = this.props.hidden ? SGFlatList._presetStyle.hidden : myProps.style;;
        myProps.contentContainerStyle = SGHelperStyle.prependStyle(SGFlatList._presetStyle[this.props.preset ? this.props.preset : SGFlatList.preset.default],myProps.contentContainerStyle);
        myProps.keyboardShouldPersistTaps = SGHelperType.isDefined(this.props.keyboardShouldPersistTaps) ? this.props.keyboardShouldPersistTaps : 'handled';
        return (
            !this.props.hidden &&
            <FlatList {...myProps} ref={this.FL}/>
        );
    }
}
