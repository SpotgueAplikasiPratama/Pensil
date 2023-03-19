/**
* MAG Core BaseControl class for all custom control in the project
* wrap react native React.Component implementation and hide from MAG UI App
* @format 
* @flow 
* 1. get ScreenWHP and ScreenWHPNoHeader on constructor from GlobalVar
*/

import React from 'react';
import { SGHelperType, SGHelperWindow, } from '../helper';
import { Animated } from 'react-native';

export class SGBaseControl extends React.Component {
    static _safeClick(obj, evt, delay) {
        if (!obj.lastClick ? true : ((new Date()).getTime() - obj.lastClick.getTime() > delay)) {
            evt();
            obj.lastClick = new Date();
        }
    }
    static makeSafeClick(obj, e, delay) {
        return (e ? () => { SGBaseControl._safeClick(obj, e, SGHelperType.isDefined(delay)?delay:600); } : e)
    }
    constructor(props, context, ...args) {
        super(props, context, ...args);
        this._screenWHP = SGHelperWindow.getWHP();
        this._screenWHPNoHeader = SGHelperWindow.getWHPNoHeader();
        this._renderBySelf = false;
        this._isPropsInit = false;
        this._isValueInit = false;
    }
    get screenWHP() {
        return this._screenWHP;
    }
    get screenWHPNoHeader() {
        return this._screenWHPNoHeader;
    }
    get renderBySelf() {
        return this._renderBySelf;
    }
    get isPropsInit() {
        return this._isPropsInit;
    }
    get isValueInit() {
        return this._isValueInit;
    }
    get strProps() {
        return this._strProps;
    }
    mySetState(stateObj) {
        this._renderBySelf = true;
        this.setState(stateObj);
    }
    isPropsNeedInitOrChanged(props) {
        var str = JSON.stringify(props);
        if (!this._isPropsInit || this._strProps !== str) {
            this._strProps = str;
            this._isPropsInit = true;
            return true;
        } else {
            return false;
        }
    }
    initValue(value, stateless, stateEvtInit, stateEvt) {
        if (!this._isValueInit) {
            this._value = value;
            if (stateEvtInit) stateEvtInit();
            this._isValueInit = true;
        } else {
            if (stateless || !this._renderBySelf) {
                this._value = value
                if (stateEvt) { stateEvt(); }
            }
        }
        this._renderBySelf = false;
    }

    baseControlCreateAnimation(animVar,fromVal, toVal, duration, onEnd) {
        animVar.setValue(fromVal);
        Animated.timing(animVar, {
          toValue: toVal,
          duration: duration,
          useNativeDriver: false
        }).start((res) => {
          if (SGHelperType.isDefined(onEnd)) { onEnd(); }
        });
      }
    
}
