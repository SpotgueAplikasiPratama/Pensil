/**
 * Version 1.4.2
 * GH Version 14 july 2021
 * - Updated new Component
 *
 * wrap react-native SafeAreaView component with 2 additional behavior
 * 1. ability to randomize background color based on global property 'UseRandomColor'
 * 2. apply default style from available preset
 * 3. built in full ScrollView inside the RootView
 */
import React from 'react';
import { SafeAreaView, StyleSheet, ScrollView } from 'react-native';
import { SGHelperGlobalVar, SGHelperType, SGHelperStyle } from '../helper';
import { SGBaseControl } from './SGBaseControl';
import { SGDialogBox } from './SGDialogBox';
import {SGView} from './SGView';

export class SGRootScrollView extends SGBaseControl {
    static preset = {
        default: 'default',
    }
    static _presetStyle = StyleSheet.create({
        default: { flex: 1, alignSelf: 'stretch', justifyContent: 'flex-start', alignItems: 'center', overflow: 'hidden' },
    });
    static _presetSVStyle = StyleSheet.create({
        default: { justifyContent: 'flex-start', alignItems: 'center' },
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
        var myProps = SGHelperStyle.addStyleProps(this.props, SGRootScrollView._presetStyle[this.props.preset ? this.props.preset : SGRootScrollView.preset.default]);
        if (SGHelperGlobalVar.getVar('UseRandomColor') && !SGHelperType.isDefined(myProps.dontRandomColor)) {
            myProps.style.backgroundColor = SGHelperStyle.getRandomBGColor();
        }
        if(this._showBlackSideAreas){
            myProps = SGHelperStyle.addStyleProps(myProps, {alignSelf:null} ,true);
        }
        myProps.children = null;
        return (
            <>
            {
                this._showBlackSideAreas &&
                <SGView style={{backgroundColor:'black', flex:1, alignSelf:'stretch', justifyContent:'flex-start',alignItems:'center'}}>
                    <SafeAreaView accessible={true} accessibilityLabel={'SGRootScrollViewSafeArea'} {...myProps}>
                        <ScrollView accessible={true} accessibilityLabel={'SGRootScrollView2'} style={{ flex: 1, alignSelf: 'stretch', }} keyboardShouldPersistTaps={SGHelperType.isDefined(this.props.keyboardShouldPersistTaps) ? this.props.keyboardShouldPersistTaps : 'handled'} showsVerticalScrollIndicator={false} showsVerticalScrollIndicator={false} contentContainerStyle={[SGRootScrollView._presetSVStyle[this.props.preset ? this.props.preset : SGRootScrollView.preset.default], this.props.contentContainerStyle]}>
                            {this.props.children}
                        </ScrollView>
                        <SGDialogBox accessible={true} accessibilityLabel={'SGRootScrollViewDialogBox'} dialogBoxID={this._dbID} />
                    </SafeAreaView>
                </SGView>
            }
            {
                !this._showBlackSideAreas &&
                <SafeAreaView accessible={true} accessibilityLabel={'SGRootScrollViewSafeArea'} {...myProps}>
                    <ScrollView accessible={true} accessibilityLabel={'SGRootScrollView2'} style={{ flex: 1, alignSelf: 'stretch', }} keyboardShouldPersistTaps={SGHelperType.isDefined(this.props.keyboardShouldPersistTaps) ? this.props.keyboardShouldPersistTaps : 'handled'} showsVerticalScrollIndicator={false} showsVerticalScrollIndicator={false} contentContainerStyle={[SGRootScrollView._presetSVStyle[this.props.preset ? this.props.preset : SGRootScrollView.preset.default], this.props.contentContainerStyle]}>
                        {this.props.children}
                    </ScrollView>
                    <SGDialogBox accessible={true} accessibilityLabel={'SGRootScrollViewDialogBox'} dialogBoxID={this._dbID} />
                </SafeAreaView>
            }
            </>
            
        );
    }
}


