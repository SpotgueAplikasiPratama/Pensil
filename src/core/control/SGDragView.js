/**
* MAG DragView control class 
* wrap react native view and drag drop implementation and hide from MAG UI App
* inheritance from SGBaseControl
* @format 
* @flow 
* 1. allow all child component to be draggable
* 2. publish event onBeginDrag, onRelease
* 3. hidden true|false
* 4. preset style
* 5. shadow true|false with prop shadowIntensity from 0.0 to 1.0
* 6. locked true|false to disable movement gesture
*/

import React from 'react';
import { Animated, StyleSheet } from 'react-native';
import { PanGestureHandler, State, } from 'react-native-gesture-handler';
import { SGBaseControl } from './SGBaseControl';
import { SGHelperStyle, SGHelperType } from '../helper';

export class SGDragView extends SGBaseControl {
    static preset = {
        default: 'default',
        hidden: 'hidden',
    }
    static _presetStyle = StyleSheet.create({
        default: { justifyContent: 'center', alignItems: 'center', overflow: 'hidden', position: 'absolute' },
        hidden: { width: 0, height: 0, margin: 0, overflow: 'hidden' },
    });
    constructor(props, context, ...args) {
        super(props, context, ...args);
        this._pos = { x: new Animated.Value(0), y: new Animated.Value(0) };
        this._lastOffset = { x: this.props.value?this.props.value.x:0, y: this.props.value?this.props.value.y:0 };
        this._onGestureEvent = Animated.event(
            [{ nativeEvent: { translationX: this._pos.x, translationY: this._pos.y, }, },],
            { useNativeDriver: true }
        );
    }
    _onHandlerStateChange = event => {
        if (event.nativeEvent.state === State.BEGAN) {
            if (this.props.onBeginDrag) {
                this.props.onBeginDrag(event);
            }
        }
        if (event.nativeEvent.oldState === State.ACTIVE) {
            this._lastOffset.x += event.nativeEvent.translationX;
            this._lastOffset.y += event.nativeEvent.translationY;
            this._pos.x.setOffset(this._lastOffset.x);
            this._pos.x.setValue(0);
            this._pos.y.setOffset(this._lastOffset.y);
            this._pos.y.setValue(0);
          
            if(SGHelperType.isDefined(this.props.onValueChange)){
                this.props.onValueChange(this._lastOffset);
            }
            if (this.props.onRelease) {
                this.props.onRelease(event);
            }
        }
    };
    render() {
        var myProps;
        if(this.props.stateless){
            // this._pos = { x: new Animated.Value(this.props.value?this.props.value.x:0), y: new Animated.Value(this.props.value?this.props.value.y:0) };
            this._pos.x.setOffset(this.props.value?this.props.value.x:0);
            this._pos.y.setOffset(this.props.value?this.props.value.y:0);
            this._lastOffset = { x: this.props.value?this.props.value.x:0, y: this.props.value?this.props.value.y:0 };
            this._onGestureEvent = Animated.event(
                [{ nativeEvent: { translationX: this._pos.x, translationY: this._pos.y, }, },],
                { useNativeDriver: true }
            );
        }
        if (this.props.hidden) {
            myProps = SGHelperStyle.addStyleProps(this.props, SGDragView._presetStyle[SGDragView.preset.hidden], true);
        } else {
            myProps = SGHelperStyle.addStyleProps(this.props, SGDragView._presetStyle[this.props.preset ? this.props.preset : SGDragView.preset.default]);
            if (this.props.shadow && !this.props.disabled) {
                myProps.style = SGHelperStyle.addShadowStyle(myProps.style, this.props.shadowIntensity);
            }
        }
        if (this.props.disabled) {
            myProps.style = SGHelperStyle.prependStyle(myProps.style, { opacity: SGHelperStyle.opacity.disabled })
        }
        myProps.style = SGHelperStyle.appendStyle(myProps.style, { transform: [{ translateX: this._pos.x }, { translateY: this._pos.y }] });
        return (
            !this.props.hidden &&
            <PanGestureHandler onGestureEvent={this.props.locked?()=>{}:this._onGestureEvent} onHandlerStateChange={this.props.locked?()=>{}:this._onHandlerStateChange}>
                <Animated.View {...myProps} />
            </PanGestureHandler>
        );
    }
}
