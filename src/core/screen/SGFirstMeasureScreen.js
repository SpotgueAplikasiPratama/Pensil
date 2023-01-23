/**
 * Version 1.4.2
 * GH Version 14 july 2021
 * - Updated new Component
 */
import React from 'react';
import { View, SafeAreaView, Text, StatusBar, Platform, NativeModules } from 'react-native';
import { SGHelperGlobalVar, SGHelperNavigation, SGHelperWindow } from '../helper';
const { StatusBarManager } = NativeModules;

export class SGFirstMeasureScreen extends React.Component {
    constructor(props, context, ...args) {
        super(props, context, ...args);
        this.state = { counter: 0 };
        this.props.navigation.setOptions({
            headerShown: false,
        });
        this._counter = 0;
        this._flag = false;
        if (Platform.OS === 'ios') {
            StatusBarManager.getHeight((statusBarHeight) => {
                SGHelperWindow.setStatusBarHeight(statusBarHeight.height * 1);
            })
        } else {
            SGHelperWindow.setStatusBarHeight(StatusBar.currentHeight);
        }
    }
    _onLayout1a = event => {
        if (this._counter === 0 && !this._layout1aFlag) {
            this._layout1aFlag = true;
            var w = event.nativeEvent.layout.width * 1;
            var h = event.nativeEvent.layout.height * 1 + (Platform.OS === 'ios' ? 0 : SGHelperWindow.getStatusBarHeight());
            if(w/h>=10/16){
                w = h*9/16;
                SGHelperGlobalVar.addVar('ShowBlackSideAreas',true);
            } else {
                SGHelperGlobalVar.addVar('ShowBlackSideAreas',false);
            }
            var p = w * 0.01;
            SGHelperWindow.setWHPNoHeader({ w: w, h: h , p: p });
            setTimeout(() => {
                this.props.navigation.setOptions({
                    headerShown: true,
                    headerTitle: ' ',
                    headerStyle: { elevation: 0, shadowColor: 'transparent' }
                });
                this._counter = this._counter + 1;
                this.setState({ counter: this._counter })
            }, (Platform.OS === 'ios' ? 50 : 250));
        }
    }
    _onLayout1b = event => {
        if (this._counter === 0) {
            var w = event.nativeEvent.layout.width * 1;
            var h = event.nativeEvent.layout.height * 1;
            if(SGHelperGlobalVar.getVar('ShowBlackSideAreas')){
                w = SGHelperWindow.getWHPNoHeader().w;
            }
            var p = w * 0.01;
            this._whpPlusHeader = { w: w, h: h, p: p };
        }
    }
    _onLayout2 = event => {
        if (this._counter === 1) {
            var w = event.nativeEvent.layout.width * 1;
            var h = event.nativeEvent.layout.height * 1;
            if(SGHelperGlobalVar.getVar('ShowBlackSideAreas')){
                w = SGHelperWindow.getWHPNoHeader().w;
            }
            var p = w * 0.01;
            SGHelperWindow.setWHP({ w: w, h: h, p: p });
            if (!this._flag) {
                this._flag = true;
                setTimeout(() => {
                    SGHelperWindow.setHeaderHeight(Math.min(this._whpPlusHeader.h - SGHelperWindow.getWHP().h,w*0.1+4*p));
                    SGHelperWindow.setFooterHeight(SGHelperWindow.getWHPNoHeader().h - SGHelperWindow.getWHP().h - SGHelperWindow.getHeaderHeight() - SGHelperWindow.getStatusBarHeight());
                    SGHelperNavigation.navigateReset(this.props.navigation, this.nextScreen);
                }, (Platform.OS === 'ios' ? 50 : 250));
            }
        }
    }
    render() {
        switch (this._counter) {
            case 0:
                return (
                    <SafeAreaView style={{ flex: 1, alignSelf: 'stretch', backgroundColor: 'white' }} onLayout={this._onLayout1a.bind(this)}>
                        <StatusBar backgroundColor="transparent" barStyle={'default'} />
                        <View style={{ flex: 1, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center' }} onLayout={this._onLayout1b.bind(this)}></View>
                    </SafeAreaView>
                );
            case 1:
                return (<SafeAreaView style={{ flex: 1, alignSelf: 'stretch', backgroundColor: 'white' }} onLayout={this._onLayout1a.bind(this)}>
                    <StatusBar backgroundColor="transparent" barStyle={'default'} />
                    <View style={{ flex: 1, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center' }} onLayout={this._onLayout2.bind(this)}></View>
                </SafeAreaView>);
        }
    }
}
