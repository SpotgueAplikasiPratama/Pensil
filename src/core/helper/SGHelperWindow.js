/**
* Spotgue Core Helper for Window functionality
* wrap react native implementation and hide from Spotgue UI App
* @format 
* @flow 
* 1. get, set, lock screen orientation
* 2. get screen and width
* 3. get safe area from screen and width (notch effect)
* 4. get screen information (resolution, brightness, etc)
*/

import React from 'react';
import { SGHelperType } from './SGHelperType';
import Orientation from 'react-native-orientation-locker';

export class SGHelperWindow {
    static _whp = null;
    static getWHP() {
        if(SGHelperWindow.isPortrait()){
            return SGHelperWindow._whp;
        } else {
            var temp = SGHelperWindow._whp;
            return {w: temp.h, h:temp.w, p:temp.p};
        }
    }
    static setWHP(whp) {
        SGHelperWindow._whp = SGHelperType.copyJSON(whp);
    }
    static _whpNoHeader = null;
    static getWHPNoHeader() {
        if(SGHelperWindow.isPortrait()){
            return SGHelperWindow._whpNoHeader;
        } else {
            var temp = SGHelperWindow._whpNoHeader;
            return {w: temp.h, h:temp.w, p:temp.p};
        }
    }
    static setWHPNoHeader(whpNoHeader) {
        SGHelperWindow._whpNoHeader = SGHelperType.copyJSON(whpNoHeader);
    }
    static _statusBarHeight = 0;
    static getStatusBarHeight() {
        return SGHelperWindow._statusBarHeight;
    }
    static setStatusBarHeight(statusBarHeight) {
        SGHelperWindow._statusBarHeight = statusBarHeight;
    }
    static _headerHeight = 0;
    static getHeaderHeight() {
        return SGHelperWindow._headerHeight;
    }
    static setHeaderHeight(headerHeight) {
        SGHelperWindow._headerHeight = headerHeight;
    }
    static _footerHeight = 0;
    static getFooterHeight() {
        return SGHelperWindow._footerHeight;
    }
    static setFooterHeight(footerHeight) {
        SGHelperWindow._footerHeight = footerHeight;
    }

    static _globalOrientation = 'PORTRAIT';
    static isPortrait() {
        return (SGHelperWindow._globalOrientation === 'PORTRAIT');
    }
    static isLandscapeLeft() {
        return (SGHelperWindow._globalOrientation === 'LANDSCAPE-LEFT');
    }
    static lockPortrait() {
        SGHelperWindow._globalOrientation = 'PORTRAIT';
        Orientation.lockToPortrait();
    }
    static lockLandscape() {
        SGHelperWindow._globalOrientation = 'LANDSCAPE-LEFT';
        Orientation.lockToLandscapeLeft();
    }
    // static getWindowDimension() {
    //     let a = { w: 0, h: 0 };
    //     let w = Dimensions.get('window').width;
    //     let h = Dimensions.get('window').height;
    //     let temp = w;
    //     if (CommonHelper.isPortrait()) {
    //         a.w = (w > h ? h : w);
    //         a.h = (temp > h ? temp : h);
    //     }
    //     else {
    //         a.w = (w > h ? w : h);
    //         a.h = (temp > h ? h : temp);
    //     }
    //     return (a);
    // }
}

