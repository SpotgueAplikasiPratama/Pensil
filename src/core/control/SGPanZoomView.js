/**
* MAG PanZoomView control class 
* wrap react native view and drag drop implementation and hide from MAG UI App
* inheritance from SGBaseControl
* @format 
* @flow 
* 1. allow all child component to do pan and zoom
* 2. initial scale props to adjust with the content (have better resolution)
* 3. hidden true|false
* 4. locked true|false
* 5. default style with available preset
* 6. shadow true|false
* 7. maxScale props (default is 8) for maximum zoom factor
* 8. showBar true|false
*/

import React from 'react';
import { StyleSheet, } from 'react-native'
import Animated from 'react-native-reanimated';
import { SGHelperType, SGHelperStyle, SGHelperWindow } from '../helper';
import { SGBaseControl } from './SGBaseControl';
import { PanGestureHandler, PinchGestureHandler, State } from 'react-native-gesture-handler';
import { SGView } from './SGView';
import { SGIconButton } from './SGIconButton';
import {SGIcon} from './SGIcon';
import {SGPopView} from './SGPopView';
import { SGButton } from '.';


const { set, cond, block, eq, add, call, Value, event, divide,  multiply, min, max, sub, } = Animated;

export class SGPanZoomView extends SGBaseControl {
    static preset = {
        default: 'default',
        hidden: 'hidden',
    }

    static _presetStyle = StyleSheet.create({
        default: { backgroundColor: SGHelperStyle.color.SGPanZoomView.BGWhite, justifyContent: 'center', alignItems: 'center', overflow: 'hidden', },
        hidden: { width: 0, height: 0, margin: 0, overflow: 'hidden' },
    });

    createPanZoomHandler() {
        this._x = 0;
        this._y = 0;
        this._z = this._startScale;
        this._minX = 0;
        this._maxX = 0;
        this._minY = 0;
        this._maxY = 0;
        this._minZ = this._startScale;
        this._maxZ = this._startScale * this._maxScale;
        this._dx = this._wh.w * 0.25;
        this._dy = this._wh.h * 0.25;
        this._dz = Math.pow(this._maxZ/this._minZ,1/5);

        //set Animation.Value
        this.X = new Value(this._x);
        this.Y = new Value(this._y);
        this.Z = new Value(this._z);
        this.offsetX = new Value(this._x);
        this.offsetY = new Value(this._y);
        this.offsetZ = new Value(this._z);
        this.minZ = new Value(this._minZ);
        this.maxZ = new Value(this._maxZ);
        this.minX = new Value(this._minX);
        this.maxX = new Value(this._maxX);
        this.minY = new Value(this._minY);
        this.maxY = new Value(this._maxY);
        this.factorZ = new Value(0);
        this.flagPan = new Value(0);
        this.flagZoom = new Value(0);    

        this.onCall = (argss)=>{
            this._x = argss[0];
            this._y = argss[1];
            this._z = argss[2];
            this._minX = argss[3];
            this._maxX = argss[4];
            this._minY = argss[5];
            this._maxY = argss[6];
            this._minZ = argss[7];
            this._maxZ = argss[8];
        };

        this.updateAnimZoomValue = (flagZoomIn)=>{
            var _prevZ = this._z;
            this._z = Math.max(Math.min(Math.round(this._z * (flagZoomIn? this._dz:1/this._dz) *100)/100,this._maxZ),this._minZ);
            var _fZ = this._z/this._startScale-1;
            this._maxX = _fZ * this._wh.w/2;
            this._minX = -this._maxX;
            this._maxY = _fZ * this._wh.h/2;
            this._minY = -this._maxY;
            this._x = Math.min(Math.max(this._x*this._z/_prevZ, this._minX), this._maxX);
            this._y = Math.min(Math.max(this._y*this._z/_prevZ, this._minY), this._maxY);

            this.X.setValue(this._x);
            this.Y.setValue(this._y);
            this.Z.setValue(this._z);
            this.offsetX.setValue(this._x);
            this.offsetY.setValue(this._y);
            this.offsetZ.setValue(this._z);
            this.minZ.setValue(this._minZ);
            this.maxZ.setValue(this._maxZ);
            this.minX.setValue(this._minX);
            this.maxX.setValue(this._maxX);
            this.minY.setValue(this._minY);
            this.maxY.setValue(this._maxY);
        };


        this.onZoomIn=()=>{
            this.updateAnimZoomValue(true);
        };

        this.onZoomOut=()=>{
            this.updateAnimZoomValue(false);
        };

        this.onPanLeft=()=>{
            this._x = Math.min(this._x+this._dx,this._maxX)
            this.X.setValue(this._x);
        };

        this.onPanRight=()=>{
            this._x = Math.max(this._x-this._dx,this._minX)
            this.X.setValue(this._x);
        };

        this.onPanUp=()=>{
            this._y = Math.min(this._y+this._dy,this._maxY)
            this.Y.setValue(this._y);
        };
        
        this.onPanDown=()=>{
            this._y = Math.max(this._y-this._dy,this._minY)
            this.Y.setValue(this._y);
        };

        this.handlePan = event([
            {
                nativeEvent: ({ translationX: x, translationY: y, state }) =>
                    block([
                        cond(eq(state, State.BEGAN), [
                            set(this.offsetX, this.X),
                            set(this.offsetY, this.Y),
                            set(this.flagPan,1),
                        ]),
                        cond(eq(state, State.ACTIVE), [
                            set(this.X, min(max(add(x, this.offsetX), this.minX), this.maxX)),
                            set(this.Y, min(max(add(y, this.offsetY), this.minY), this.maxY)),
                        ]),
                        cond(eq(state, State.END), [
                            cond(eq(this.flagPan,1),[
                                set(this.offsetX, this.X),
                                set(this.offsetY, this.Y),    
                                set(this.flagPan,0),
                                call([this.X,this.Y, this.Z, this.minX, this.maxX, this.minY, this.maxY, this.minZ, this.maxZ], this.onCall),
                            ]),
                        ]),
                    ]),
            },
        ]);

        this.handleZoom = event([
            {
                nativeEvent: ({ scale: z, state}) =>
                    block([
                        cond(eq(state,State.BEGAN),[
                            set(this.offsetX, this.X),
                            set(this.offsetY, this.Y),
                            set(this.flagZoom,1),
                        ]),
                        cond(eq(state, State.ACTIVE), [
                            set(this.Z, min(max(multiply(z, this.offsetZ), this.minZ), this.maxZ)),
                            set(this.factorZ, sub(multiply(this.Z, (1 / this._startScale)), 1)),
                            set(this.maxX, multiply(this.factorZ, (this._wh.w/2))),
                            set(this.minX, multiply(-1, this.maxX)),
                            set(this.maxY, multiply(this.factorZ, (this._wh.h/2))),
                            set(this.minY, multiply(-1, this.maxY)),
                            set(this.X, min(max(multiply(this.offsetX,divide(this.Z,this.offsetZ)), this.minX), this.maxX)),
                            set(this.Y, min(max(multiply(this.offsetY,divide(this.Z,this.offsetZ)), this.minY), this.maxY)),
                        ]),
                        cond(eq(state, State.END), [
                            cond(eq(this.flagZoom,1),[
                                set(this.offsetZ, this.Z),
                                set(this.offsetX, this.X),
                                set(this.offsetY, this.Y),
                                set(this.flagZoom,0),
                                call([this.X,this.Y, this.Z, this.minX, this.maxX, this.minY, this.maxY, this.minZ, this.maxZ], this.onCall),
                            ]),
                        ]),
                    ]),
            },
        ]);
    }

    constructor(props, context, ...args) {
        super(props, context, ...args);
        this.panRef = React.createRef();
        this.pinchRef = React.createRef();
        this.initStyleAndHandler();
    }

    initStyleAndHandler() {
        var isDef = SGHelperType.isDefined;
        if (isDef(this._strStyle) ? this._strStyle !== JSON.stringify(this.props.style) : true) {
            var { w, h, p } = SGHelperWindow.getWHPNoHeader();
            this._strStyle = JSON.stringify(this.props.style);
            this._startScale = (isDef(this.props.scale) ? this.props.scale : 1);
            this._maxScale = (isDef(this.props.maxScale) ? this.props.maxScale : 4);
            this._wh = { w: isDef(this.props.style.width) ? this.props.style.width : w, h: isDef(this.props.style.height) ? this.props.style.height : w };
            this._style = {
                v1: { ...SGPanZoomView._presetStyle[this.props.preset ? this.props.preset : SGPanZoomView.preset.default], ...this.props.style },
                v2: { ...SGPanZoomView._presetStyle[this.props.preset ? this.props.preset : SGPanZoomView.preset.default], ...this.props.style },
                iB1: {width:w*0.13,height:w*0.07, borderWidth:0, color:'white',borderRadius:2*p},
                iBar1 :{backgroundColor:SGHelperStyle.color.SGButton.Black, flexDirection:'row',width:this._wh.w, marginTop:p, paddingVertical:2*p, justifyContent:'space-between'},
            };

            this._style.v1.width = this._wh.w;
            this._style.v1.height = this._wh.h;
            this._style.v2.width = this._wh.w / this._startScale;
            this._style.v2.height = this._wh.h / this._startScale;
            this.createPanZoomHandler();
        }
    }

    onFullScreen(){
        if(SGHelperType.isDefined(this.props.onSizeFullScreen)){
            this.props.onSizeFullScreen();
        }
    }

    render() {
        this.initStyleAndHandler();
        var { w, h, p } = SGHelperWindow.getWHPNoHeader();
        return (
            !this.props.hidden &&
            <SGView>
                {
                    this.props.showBar &&
                    <SGView style={this._style.iBar1}>
                        <SGIconButton style={this._style.iB1} noSafeClick iconPreset={SGIcon.preset.h4} name={SGIcon.Icon.arrowLeft} onPress={this.onPanLeft.bind(this)} />
                        <SGIconButton style={this._style.iB1} noSafeClick iconPreset={SGIcon.preset.h4} name={SGIcon.Icon.arrowUp} onPress={this.onPanUp.bind(this)}  />
                        <SGIconButton style={this._style.iB1} noSafeClick iconPreset={SGIcon.preset.h4} name={SGIcon.Icon.arrowDown} onPress={this.onPanDown.bind(this)} />
                        <SGIconButton style={this._style.iB1} noSafeClick iconPreset={SGIcon.preset.h4} name={SGIcon.Icon.arrowRight} onPress={this.onPanRight.bind(this)} />
                        <SGIconButton style={this._style.iB1} noSafeClick iconPreset={SGIcon.preset.h4} name={SGIcon.Icon.minusCircle} onPress={this.onZoomOut.bind(this)} />
                        <SGIconButton style={this._style.iB1} noSafeClick iconPreset={SGIcon.preset.h4} name={SGIcon.Icon.plusCircle} onPress={this.onZoomIn.bind(this)} />
                        {   this.props.allowFullScreen && 
                            <SGIconButton style={this._style.iB1} noSafeClick iconPreset={SGIcon.preset.h4} name={this.props.fullScreenMode?SGIcon.Icon.sizeActual:SGIcon.Icon.sizeFullScreen} onPress={this.onFullScreen.bind(this)} />
                        }
                    </SGView>
                }
                <SGView accessible={true} accessibilityLabel={'SGPanZoomViewRootView'} shadow={this.props.shadow} shadowIntensity={this.props.shadowIntensity} style={this.props.hidden ? SGPanZoomView._presetStyle.hidden : this.props.shadow ? { backgroundColor: 'white' } : {}} >
                    <PanGestureHandler accessible={true} accessibilityLabel={'SGPanZoomViewPanGestureHandler'} ref={this.panRef}  minDist={10} onGestureEvent={this.handlePan} onHandlerStateChange={this.handlePan}>
                        <Animated.View accessible={true} accessibilityLabel={'SGPanZoomViewPanAnimatedView'} style={this._style.v1} >
                            <PinchGestureHandler accessible={true} accessibilityLabel={'SGPanZoomViewPinchGestureHandler'} ref={this.pinchRef} onGestureEvent={this.handleZoom} onHandlerStateChange={this.handleZoom}>
                                <Animated.View accessible={true} accessibilityLabel={'SGPanZoomViewPinchAnimated'} style={[this._style.v2, { transform: [{ translateX: this.X }, { translateY: this.Y }, { scale: this.Z },] }]} >
                                    {this.props.children}
                                </Animated.View>
                            </PinchGestureHandler>
                        </Animated.View>
                    </PanGestureHandler>
                    {this.props.locked &&
                        <SGView accessible={true} accessibilityLabel={'SGPanZoomViewBottomView'} style={[this.props.locked ? this._style.v1 : SGPanZoomView._presetStyle.hidden, { position: 'absolute', backgroundColor: 'rgba(0,0,0,0.5)' }]}></SGView>
                    }
                </SGView>
            </SGView>
        );
    }
}
