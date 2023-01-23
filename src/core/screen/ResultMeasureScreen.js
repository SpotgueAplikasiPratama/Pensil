import React from 'react';
import { View, SafeAreaView, Text, StatusBar, Animated } from 'react-native';
import { SGView, SGScrollView } from '../control';
import { SGHelperGlobalVar, SGHelperNavigation, SGHelperWindow } from '../../core/helper';
import { SGFirstMeasureScreen } from '../../core/screen/SGFirstMeasureScreen';
import {SGBaseScreen} from '../../core/screen/SGBaseScreen';

export class ResultMeasureScreen extends SGBaseScreen {
    constructor(props, context, ...args) {
        super(props, context, ...args);
        this.props.navigation.setOptions({
            headerShown: false,
        });
        // this._animY = new Animated.Value(0);
        // this._lastY = 0;
        // this._flag = true;
        // this._isAnimating = false;
        // this._isMomentumScroll = false;
    }
    onPressHandler() {
        SGHelperNavigation.navigatePush(this.props.navigation, 'Splash')
    }
    /*
    animateSlideOut() {
        if (!this._isAnimating) {
            this._isAnimating = true;
            Animated.timing(this._animY, {
                toValue: -1,
                duration: 200,
                useNativeDriver: false
            }).start((res) => {
                this._isAnimating = false;
                this._flag = false;
                this.forceUpdate();
            });
        } else {
            //
        }
    }

    animateSlideIn() {
        if (!this._isAnimating) {
            this._isAnimating = true;
            Animated.timing(this._animY, {
                toValue: 0,
                duration: 200,
                useNativeDriver: false
            }).start((res) => {
                this._isAnimating = false;
                this._flag = true;
                this.forceUpdate();
            });
        } else {
            //
        }
    }

    onScrollHandler(v) {
        console.log('onScrollHandler');
        var h = SGHelperWindow.getWHPNoHeader().h;
        var y = v.nativeEvent.contentOffset.y;
        if (this._flag && y > (SGHelperWindow.getStatusBarHeight() + SGHelperWindow.getHeaderHeight()) * 1.1 && !this._isAnimating && y > this._lastY) {
            this.animateSlideOut();
        }
        else if (!this._flag && y > (SGHelperWindow.getStatusBarHeight() + SGHelperWindow.getHeaderHeight()) * 1.1 && !this._isAnimating && this._lastY > y) {
            this.animateSlideIn();
        }
        this._lastY = y;
    }
    onScrollEndDragHandler(v) {
        // console.log('onScrollEndDragHandler' + this._isMomentumScroll);
        var y = v.nativeEvent.contentOffset.y;
        this._lastY = y;
        // if(!this._isMomentumScroll){
        //     if (!this._flag) {
        //         // setTimeout(()=>{
        //             this.animateSlideIn();
        //         // },200); 
        //     }    
        // }
    }
    onMomentumScrollBeginHandler(v) {
        console.log('onMomentumScrollBeginHandler');
        this._isMomentumScroll = true;
    }
    onMomentumScrollEndHandler(v) {
        // console.log('onMomentumScrollEndHandler');
        this._isMomentumScroll = false;
        var y = v.nativeEvent.contentOffset.y;
        this._lastY = y;
        // if (!this._flag) {
        //     // setTimeout(()=>{
        //         this.animateSlideIn();
        //     // },200); 
        // }
    }*/
    render() {
        var whp = SGHelperWindow.getWHP();
        var whpNoHeader = SGHelperWindow.getWHPNoHeader();
        return (
            <SGView style={{ flex: 1, alignSelf: 'stretch', backgroundColor: 'orange', justifyContent: 'flex-start' }}>
                <StatusBar translucent backgroundColor="transparent" barStyle={this._baseFlag?'light-content':'dark-content'} />
                <SGScrollView style={{ height: SGHelperWindow.getWHP().h, backgroundColor: 'purple' }} contentContainerStyle={{ alignSelf: 'stretch' }} scrollEventThrottle={100} onScroll={this.baseOnScrollHandler.bind(this)} onMomentumScrollBegin={this.baseOnMomentumScrollBeginHandler.bind(this)} onScrollEndDrag={this.baseOnScrollEndDragHandler.bind(this)} onMomentumScrollEnd={this.baseOnMomentumScrollEndHandler.bind(this)} decelerationRate={'fast'} bounces={false} showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false}>
                    <SGView style={{ height: SGHelperWindow.getStatusBarHeight(), backgroundColor: 'rgba(255,255,255,0.1)', alignSelf: 'stretch' }}></SGView>
                    <SGView style={{ height: SGHelperWindow.getHeaderHeight(), backgroundColor: 'rgba(255,255,255,0.1)', alignSelf: 'stretch' }}></SGView>
                    <SGView style={{ height: whp.h, alignSelf: 'stretch', backgroundColor: 'white' }}>
                        <Text onPress={this.onPressHandler.bind(this)}>{'next'}</Text>
                    </SGView>
                    <SGView style={{ height: whp.h, width: '100%', backgroundColor: 'pink' }}>
                        <Text onPress={this.onPressHandler.bind(this)}>{'next'}</Text>
                    </SGView>
                    <SGView style={{ height: SGHelperWindow.getFooterHeight(), backgroundColor: 'rgba(255,255,255,0.1)', alignSelf: 'stretch' }}></SGView>
                </SGScrollView>
                <Animated.View style={{ position: 'absolute', transform: [{ translateY: this._baseAnimY.interpolate({ inputRange: [-1, 0], outputRange: [-(SGHelperWindow.getStatusBarHeight() + SGHelperWindow.getHeaderHeight()), 0] }) },], height: SGHelperWindow.getStatusBarHeight(), backgroundColor: 'navy', width: '100%' }}></Animated.View>
                <Animated.View style={{ position: 'absolute', transform: [{ translateY: this._baseAnimY.interpolate({ inputRange: [-1, 0], outputRange: [-(SGHelperWindow.getHeaderHeight()), SGHelperWindow.getStatusBarHeight()] }) },], height: SGHelperWindow.getHeaderHeight(), backgroundColor: 'blue', width: '100%' }}></Animated.View>
                <Animated.View style={{ position: 'absolute', transform: [{ translateY: this._baseAnimY.interpolate({ inputRange: [-1, 0], outputRange: [SGHelperWindow.getWHPNoHeader().h, SGHelperWindow.getWHPNoHeader().h - SGHelperWindow.getFooterHeight()] }) },], height: SGHelperWindow.getFooterHeight(), backgroundColor: 'green', width: '100%' }}></Animated.View>
            </SGView>
        )
    }
}
