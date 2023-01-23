/**
 * Version 1.4.2
 * GH Version 14 july 2021
 * - Updated new Component
 * wrap react-native SafeAreaView component with 2 additional behavior
 * 1. ability to randomize background color based on global property 'UseRandomColor'
 * 2. apply default style from available preset
 */
import React from 'react';
import { SafeAreaView, StyleSheet, StatusBar } from 'react-native';
import { SGHelperGlobalVar, SGHelperType, SGHelperStyle, SGHelperWindow } from '../helper';
import { SGBaseControl } from './SGBaseControl';
import { SGDialogBox } from './SGDialogBox';
import { SGView } from './SGView';

export class SGRootView extends SGBaseControl {
    static preset = {
        default: 'default',
    }
    static _presetStyle = StyleSheet.create({
        default: { flex: 1, alignSelf: 'stretch', justifyContent: 'flex-start', alignItems: 'center', overflow: 'hidden', backgroundColor: 'white' },
    });
    constructor(props, context, ...args) {
        super(props, context, ...args);
        this._dbID = SGDialogBox.getDialogBoxID();
        this._showBlackSideAreas = SGHelperGlobalVar.getVar('ShowBlackSideAreas');
    }
    componentWillUnmount() {
        SGDialogBox.popActiveDialogBox(this._dbID);
    }
    componentDidMount() {
        SGDialogBox.pushActiveDialogBox(this._dbID);
    }
    render() {
        var myProps = SGHelperStyle.addStyleProps(this.props, SGRootView._presetStyle[this.props.preset ? this.props.preset : SGRootView.preset.default]);
        if (SGHelperGlobalVar.getVar('UseRandomColor') && !SGHelperType.isDefined(myProps.dontRandomColor)) {
            myProps.style.backgroundColor = SGHelperStyle.getRandomBGColor();
        }
        var children = myProps.children;
        myProps.children = null;
        if(this._showBlackSideAreas){
            myProps = SGHelperStyle.addStyleProps(myProps,{alignSelf:null},true);
        }
        // return (
        //     <SafeAreaView accessible={true} accessibilityLabel={'SGRootViewSafeArea'} {...myProps} >
        //         {children}
        //         <SGDialogBox accessible={true} accessibilityLabel={'SGRootViewDialogBox'} dialogBoxID={this._dbID} />
        //     </SafeAreaView>
        // );
        return (
            <>
            {
                this._showBlackSideAreas &&
                <SGView style={{backgroundColor:'black', flex:1, alignSelf:'stretch', justifyContent:'flex-start',alignItems:'center'}}>
                    <SGView accessible={true} accessibilityLabel={'SGRootViewSafeArea'} {...myProps} >
                        <StatusBar translucent backgroundColor="transparent" barStyle={'light-content'} />
                        {
                            this.props.dummyStatusBar &&
                            <SGView style={{ width: '100%', height: SGHelperWindow.getStatusBarHeight(), backgroundColor: '#181818' }}></SGView>
                        }
                        {
                            this.props.dummyStatusBarWhite &&
                            <SGView style={{ width: '100%', height: SGHelperWindow.getStatusBarHeight(), backgroundColor: '#FFFFFF' }}></SGView>
                        }
                        {
                            this.props.dummyHeaderBar &&
                            <SGView style={{ width: '100%', height: SGHelperWindow.getHeaderHeight(), backgroundColor: '#FFFFFF' }}></SGView>
                        }
                        {
                            this.props.dummyTabBar &&
                            <SGView style={{ width: '100%', height: SGHelperWindow.getHeaderHeight(), backgroundColor: '#FFFFFF' }}></SGView>
                        }
                        {children}
                        {
                            this.props.dummyBottomBar &&
                            <SGView style={{ width: '100%', height: SGHelperWindow.getHeaderHeight(), backgroundColor: '#FFFFFF' }}></SGView>
                        }
                        {
                            this.props.dummyFooterBar &&
                            <SGView style={{ width: '100%', height: SGHelperWindow.getFooterHeight(), backgroundColor: '#181818' }}></SGView>
                        }
                        {
                            this.props.dummyFooterBarWhite &&
                            <SGView style={{ width: '100%', height: SGHelperWindow.getFooterHeight(), backgroundColor: '#FFFFFF' }}></SGView>
                        }
                        <SGDialogBox accessible={true} accessibilityLabel={'SGRootViewDialogBox'} dialogBoxID={this._dbID} />
                    </SGView>
                </SGView>
            }
            {
                !this._showBlackSideAreas &&
                <SGView accessible={true} accessibilityLabel={'SGRootViewSafeArea'} {...myProps} >
                    <StatusBar translucent backgroundColor="transparent" barStyle={'light-content'} />
                    {
                        this.props.dummyStatusBar &&
                        <SGView style={{ width: '100%', height: SGHelperWindow.getStatusBarHeight(), backgroundColor: '#181818' }}></SGView>
                    }
                    {
                        this.props.dummyStatusBarWhite &&
                        <SGView style={{ width: '100%', height: SGHelperWindow.getStatusBarHeight(), backgroundColor: '#FFFFFF' }}></SGView>
                    }
                    {
                        this.props.dummyHeaderBar &&
                        <SGView style={{ width: '100%', height: SGHelperWindow.getHeaderHeight(), backgroundColor: '#FFFFFF' }}></SGView>
                    }
                    {
                        this.props.dummyTabBar &&
                        <SGView style={{ width: '100%', height: SGHelperWindow.getHeaderHeight(), backgroundColor: '#FFFFFF' }}></SGView>
                    }
                    {children}
                    {
                        this.props.dummyBottomBar &&
                        <SGView style={{ width: '100%', height: SGHelperWindow.getHeaderHeight(), backgroundColor: '#FFFFFF' }}></SGView>
                    }
                    {
                        this.props.dummyFooterBar &&
                        <SGView style={{ width: '100%', height: SGHelperWindow.getFooterHeight(), backgroundColor: '#181818' }}></SGView>
                    }
                    {
                        this.props.dummyFooterBarWhite &&
                        <SGView style={{ width: '100%', height: SGHelperWindow.getFooterHeight(), backgroundColor: '#FFFFFF' }}></SGView>
                    }
                    <SGDialogBox accessible={true} accessibilityLabel={'SGRootViewDialogBox'} dialogBoxID={this._dbID} />
                </SGView>
            }
            </>
        );
    }
}


