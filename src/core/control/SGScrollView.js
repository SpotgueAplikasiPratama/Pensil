/**
* MAG Scroll View control class 
* wrap react native view implementation and hide from MAG UI App
* inheritance from SGBaseControl
* @format 
* @flow 
 * 1. ability to randomize background color based on global property 'UseRandomColor'
 * 2. apply default style from available preset
 * 3. hidden true|false
 * 4. shadow true|false with prop shadowIntensity from 0.0 to 1.0
*/

import React from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import { SGHelperGlobalVar, SGHelperType, SGHelperStyle, SGHelperWindow } from '../helper';
import { SGBaseControl } from './SGBaseControl';
import { SGView } from './SGView';

export class SGScrollView extends SGBaseControl {
    static preset = {
        default: 'default',
        hidden: 'hidden',
    }
    static _presetStyle = StyleSheet.create({
        default: { flex: 1, alignSelf: 'stretch' },
        hidden: { width: 0, height: 0, margin: 0, overflow: 'hidden' }
    });
    static _presetContentStyle = StyleSheet.create({
        default: { justifyContent: 'flex-start', alignItems: 'center' },
        hidden: { width: 0, height: 0, margin: 0, overflow: 'hidden' }
    });
    constructor(props, context, ...args) {
        super(props, context, ...args);
        this.SV = React.createRef();
    }
    scrollTo(v) {
        this.SV.current.scrollTo(v);
    }
    scrollToEnd(v) {
        this.SV.current.scrollToEnd(v);
    }

    render() {
        var {w,h,p}=this.screenWHPNoHeader;
        var myProps = SGHelperStyle.addStyleProps(this.props, SGScrollView._presetStyle[this.props.preset ? this.props.preset : SGScrollView.preset.default]);
        if (SGHelperGlobalVar.getVar('UseRandomColor') && !SGHelperType.isDefined(myProps.dontRandomColor)) {
            myProps.style.backgroundColor = SGHelperStyle.getRandomBGColor();
        }
        myProps.contentContainerStyle = SGHelperStyle.appendStyle(SGScrollView._presetContentStyle[this.props.preset ? this.props.preset : SGScrollView.preset.default], this.props.contentContainerStyle)
        if (this.props.hidden) {
            myProps.style = SGScrollView._presetStyle.hidden;
            myProps.contentContainerStyle = SGScrollView._presetContentStyle.hidden;
        }
        if (this.props.shadow && !this.props.hidden && !this.props.disabled) {
            myProps.style = SGHelperStyle.addShadowStyle(myProps.style, this.props.shadowIntensity);
        }
        if (this.props.disabled) {
            myProps.style = SGHelperStyle.prependStyle(myProps.style, { opacity: SGHelperStyle.opacity.disabled })
        }
        myProps.keyboardShouldPersistTaps = SGHelperType.isDefined(this.props.keyboardShouldPersistTaps) ? this.props.keyboardShouldPersistTaps : 'handled';
        var children = myProps.children;
        myProps.children = null;
        return (
            !this.props.hidden &&
            <ScrollView accessible={true} accessibilityLabel={'SGScrollViewRoot'} ref={this.SV} {...myProps}>
                {
                    this.props.dummyStatusBar &&
                    <SGView style={{ width: '100%', height: SGHelperWindow.getStatusBarHeight() }}></SGView>
                }
                {
                    this.props.dummyHeaderBar &&
                    <SGView style={{ width: '100%', height: SGHelperWindow.getHeaderHeight() }}></SGView>
                }
                {
                    this.props.dummyTabBar &&
                    <SGView style={{ width: '100%', height: SGHelperWindow.getHeaderHeight() }}></SGView>
                }
                {children}
                {
                    this.props.dummyBottomBar &&
                    <SGView style={{ width: '100%',  height: SGHelperWindow.getHeaderHeight()}}></SGView>
                }
                {
                    this.props.dummyFooterBar &&
                    <SGView style={{ width: '100%',  height: SGHelperWindow.getFooterHeight() }}></SGView>
                }
            </ScrollView>
        );
    }
}


