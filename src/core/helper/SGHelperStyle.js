//Fixing SGHelperStyle
import React from 'react';
import { StyleSheet } from 'react-native';
import { SGHelperType } from './SGHelperType';
import { SGHelperGlobalVar } from './SGHelperGlobalVar';
import { SGConfigCore } from '../config/SGConfigCore';

export class SGHelperStyle {

    static color = {
        SGActivityIndicator:{
           light: 'rgb(25,25,25)',
           dark: 'rgb(255,255,255)',
        },

        SGButton : {
            Green:'rgb(31,188,141)',
            Grey: 'rgb(171,170,170)',
            Red: 'rgb(230,77,77)',
            Orange: 'rgb(242,181,45)',
            Blue: 'rgb(62,148,221)',
            Black: 'rgb(25,25,25)',
            White: 'rgb(255,255,255)',
            Disabled : 'rgb(87,87,87)',
            TextWhite : 'rgb(255,255,255)',
            TextGrey : 'rgb(130,128,128)',
            TextBlack : 'rgb(25,25,25)',
            TextBlue : 'rgb(7,194,239)',
            TextDisabled : 'rgb(120,119,119)',
            Underlay:'rgb(230,230,230)'
        },

        SGCheckBox : {
            Black:'rgb(87,87,87)',
            White:'rgb(255,255,255)',
            Disabled : 'rgb(170,170,170)'
        },

        SGDatePicker : {
            Border:'rgb(228,228,228)',
            BGWhite:'rgb(252,252,252)',
            BGTransparent:'transparent',
            BGDisabled:'rgb(230,230,230)',
            TextWhite:'rgb(255,255,255)',
            TextBlack:'rgb(87,87,87)',
            TextDisabled : 'rgb(170,170,170)',
            PVBGBlack:'rgb(38,38,38)',
            PVBGWhite:'rgb(255,255,255)',
            PVDRDarkGrey:'rgb(87,87,87)',
            PVDRLightGrey:'rgb(230,230,230)'
        },

        SGTouchableOpacity:{
            Underlay:'rgb(230,230,230)'
        },

        SGDialogBox:{
            TextBlack:'rgb(25,25,25)',
            TextGrey:'rgb(87,87,87)',
            TextBlue:'#63aee0',
            BGWhite:'rgb(255,255,255)',
            IconGreen:'rgb(31,188,141)',
            IconRed:'rgb(230,77,77)',
            IconOrange:'rgb(242,181,45)',
            IconBlue:'rgb(62,148,221)',
            ToastGrey:'rgb(171,170,170)',
            ToastWhite:'rgb(255,255,255)'
        },

        SGDrumRoll:{
            TextBlack:'rgb(87,87,87)',
            TextDisabled : 'rgb(170,170,170)',
            BGTransparent:'transparent',
            BGWhite:'rgb(255,255,255)',
            BGDisabled:'rgb(230,230,230)',
        },

        SGFilePicker:{
            Border:'rgb(228,228,228)',
            BGWhite:'rgb(252,252,252)',
            BGTransparent:'transparent',
            BGDisabled:'rgb(230,230,230)',
            TextWhite:'rgb(255,255,255)',
            TextBlack:'rgb(87,87,87)',
            TextPlaceholder:'rgb(7,194,239)',
            TextDisabled : 'rgb(170,170,170)',
            PVBGBlack:'rgb(38,38,38)',
            PVBGWhite:'rgb(255,255,255)',
        },

        SGIcon:{
            Black:'rgb(25,25,25)',
            White:'rgb(255,255,255)'
        },

        SGIconText:{
            TextWhite:'rgb(255,255,255)',
            TextDisabled : 'rgb(170,170,170)',
            BGDisabled:'rgb(87,87,87)',
        },
        
        SGImage:{
            BGGrey:'rgb(171,170,170)',
            Disabled:'rgb(87,87,87)'
        },

        SGImagePicker:{
            BorderGrey:'rgb(228,228,228)',
            BGDisabled:'rgb(230,230,230)',
            ButtonAdd:'rgb(87,87,87)',
            TextWhite:'rgb(255,255,255)',
            TextBlack:'rgb(87,87,87)',
            TextDisabled : 'rgb(170,170,170)',
            PVBGBlack:'rgb(38,38,38)',
            PVBGWhite:'rgb(255,255,255)',
        },

        SGMapStatic:{
        },

        SGMapPicker:{
            TextWhite:'rgb(255,255,255)',
            TextBlack:'rgb(87,87,87)',
            TextDisabled : 'rgb(170,170,170)',
            PVBGBlack:'rgb(38,38,38)',
            PVBGWhite:'rgb(255,255,255)',
            Border: 'rgb(228,228,228)',
            BGDisabled: 'rgb(230,230,230)',
            BGWhite:'rgb(255,255,255)',
        },

        SGOTPInput:{
            TextBlack:'rgb(87,87,87)',
            TextDisabled : 'rgb(170,170,170)',
            BGWhite:'rgb(255,255,255)',
            BGDisabled: 'rgb(230,230,230)',
            Border: 'rgb(228,228,228)',
        },

        SGPanZoomView:{
            BGWhite:'rgb(255,255,255)'
        },

        SGPicker : {
            Border:'rgb(228,228,228)',
            BGWhite:'rgb(252,252,252)',
            BGTransparent:'transparent',
            BGDisabled:'rgb(230,230,230)',
            TextWhite:'rgb(255,255,255)',
            TextBlack:'rgb(87,87,87)',
            TextDisabled : 'rgb(170,170,170)',
            PVBGBlack:'rgb(38,38,38)',
            PVBGWhite:'rgb(255,255,255)',
            ButtonGreen:'rgb(31,188,141)',
            ButtonGrey:'rgb(228,228,228)',
            ButtonDisabled:'rgb(210,210,210)'
        },

        SGQRImage:{
            BGWhite:'rgb(255,255,255)',
            BGDisabled:'rgb(230,230,230)',
            TextBlack:'rgb(87,87,87)'
        },
        SGQRScanner:{
            BGWhite:'rgb(255,255,255)',
            BGDisabled:'rgb(230,230,230)',
            TextBlack:'rgb(87,87,87)',
            TextWhite:'rgb(255,255,255)',
            PVBGBlack:'rgb(38,38,38)'
        },
        SGSwitch:{
            Green:'rgb(31,188,141)',
            Red: 'rgb(230,77,77)',
            GreenDisabled:'rgb(137,198,179)',
            RedDisabled:'rgb(234,162,162)',
            White:'rgb(255,255,255)',
            Disabled:'rgb(230,230,230)'
        },

        SGTabView:{
            BGWhite: 'rgb(255,255,255)',
            ULBlack: 'rgb(87,87,87)',
            TextBlack: 'rgb(87,87,87)',
            TextGrey:'rgb(130,128,128)',
            TBWhite :'rgb(255,255,255)',
            Border : 'rgb(228,228,228)'
        },

        SGText:{
            TextBlack: 'rgb(25,25,25)',
            TextDarkGrey:'rgb(87,87,87)',
            TextGrey:'rgb(130,128,128)',
            TextLightGrey:'rgb(230,230,230)',
            TextWhite :'rgb(255,255,255)'
        },

        SGTextInput : {
            Border:'rgb(228,228,228)',
            BGWhite:'rgb(252,252,252)',
            BGTransparent:'transparent',
            BGDisabled:'rgb(230,230,230)',
            TextWhite:'rgb(255,255,255)',
            TextBlack:'rgb(87,87,87)',
            TextDisabled : 'rgb(170,170,170)',
            PVBGBlack:'rgb(38,38,38)',
            PVBGWhite:'rgb(255,255,255)',
            ButtonGreen:'rgb(31,188,141)',
            ButtonGrey:'rgb(228,228,228)',
            ButtonDisabled:'rgb(210,210,210)'
        },
        SGFormErrorMessage:{
            Border:'rgb(228,228,228)',
            BGWhite:'rgb(252,252,252)',
            BGTransparent:'transparent',
            BGDisabled:'rgb(230,230,230)',
            TextWhite:'rgb(255,255,255)',
            TextBlack:'rgb(87,87,87)',
            TextDisabled : 'rgb(170,170,170)',
            PVBGBlack:'rgb(38,38,38)',
            PVBGWhite:'rgb(255,255,255)',
            PVDRDarkGrey:'rgb(87,87,87)',
            PVDRLightGrey:'rgb(230,230,230)'
        },
        SGTimePicker : {
            Border:'rgb(228,228,228)',
            BGWhite:'rgb(252,252,252)',
            BGTransparent:'transparent',
            BGDisabled:'rgb(230,230,230)',
            TextWhite:'rgb(255,255,255)',
            TextBlack:'rgb(87,87,87)',
            TextDisabled : 'rgb(170,170,170)',
            PVBGBlack:'rgb(38,38,38)',
            PVBGWhite:'rgb(255,255,255)',
            PVDRDarkGrey:'rgb(87,87,87)',
            PVDRLightGrey:'rgb(230,230,230)'
        },
        SGTouchableHighlight : {
            UnderlayGrey:'rgb(130,128,128)'
        },

        //new style
        ButtonGreen: 'rgb(29,180,130)',
        ButtonRed: 'rgb(226,68,68)',
        ButtonOrange: 'rgb(240,172,40)',
        ButtonBlue: 'rgb(54,137,216)',
        ButtonGrey: 'rgb(161,160,160)',
        ButtonBlack: 'rgb(24,24,24)',
        BackGroundDisabled: 'rgb(230,230,230)',
        CalenderDisabled: 'rgb(170,168,168)',
        TextBlack1: 'rgb(24,24,24)',
        TextWhite: 'rgb(255,255,255)',
        TextGrey1: 'rgb(77,77,77)',
        TextBlue1: 'rgb(0,197,240)',
        TextDisabled: 'rgb(172,172,172)',
        DarkMode: 'rgb(38,38,38)',
        LightMode: 'rgb(220,220,220)',
        BackGroundTextInput: 'rgb(252,252,252)',
        BorderColorTextInput: 'rgb(230,230,230)',
        PopUpBackgroundColor: 'rgba(34,34,34,1)',
        PopUpBackgroundColorDark: 'rgba(34,34,34,1)',
        TextFilterPickerColor: 'rgb(120,120,120)',
        DatePickerBackgroundColor: 'rgb(252,252,252)',
        TextInputBackgroundColor: 'rgb(252,252,252)',
        PopUpBackgroundColorLight: 'rgba(255,255,255,1)',
        PlaceHolderTextColor: 'black',
        // borderColor:'rgb(226,226,226)'
        //older style
        backgroundColor: 'white',
        borderColor: 'rgb(150,150,150)',
        borderColorDisabled: 'rgb(226,226,226)',
        buttonColor: 'red',
        activityIndicatorColor: '#181818',
        textColor: 'black',
        placeHolderTextColor: 'rgb(150,150,150)',
        primaryColor: 'red',
        secondaryColor: 'blue',
        disabledButtonColor: 'rgb(150,150,150)',
        buttonTextColor: 'white',
        buttonDisabledTextColor: 'rgb(111,111,111)',
        iconColor: 'black',
        panzoomviewBGColor: 'rgba(0,0,0,0)',
        touchableHighlightUnderlayColor: 'rgb(100,100,100)',
        imageBackgroundColor: 'rgb(226,226,226)',
        pageIndicatorSelectedColor: '#313131',
        pageIndicatorNotSelectedColor: '#D3D3D3',
        pageIndicatorBorderColor: 'transparent',
        tabBarColor: 'rgb(255,255,255)',
        tabBarBorderColor: 'rgb(150,150,150)',
        tabBarActiveTextColor: 'black',
        tabBarInactiveTextColor: 'rgb(100,100,100)',
        tabBarUnderlineColor: 'red',
        tabViewColor: 'white',
        popUpBackgroundColor: 'rgba(250,250,250,1)',
        shadowColor: 'black',
        textInputBackgroundColor: 'rgb(255,255,255)',
        otpInputTextColor: 'black',
        otpInputBackgroundColor: 'white',
        otpInputBorderColor: 'rgb(240,240,240)',
        otpInputHighlightedColor: 'red',
        otpInputDisabledBackgroundColor: 'rgba(255,255,255,0)',
        switchThumbActive: 'white',
        switchThumbInActive: 'white',
        switchTrackActive: 'green',
        switchTrackInActive: 'rgb(150,150,150)',
        pickerSearchBarColor: 'white',
        pickerBackgroundColor: 'white',
        pickerPlaceholderTextColor: 'rgb(150,150,150)',
        pickerSelectedTextColor: 'black',
        pickerSelectedBackgroundColor: 'rgb(255,255,240)',
        pickerSelectedIconColor: 'green',
        pickerUnselectedTextColor: 'rgb(100,100,100)',
        pickerUnselectedBackgroundColor: 'rgba(0,0,0,0)',
        pickerUnselectedBorderColor: 'white',
        pickerDisplayButtonSelectedColor: 'rgb(81,201,165)',
        pickerDisplayButtonUnSelectedColor: 'rgb(226,226,226)',
        datePickerBackgroundColor: 'rgb(251,251,251)',
        datePickerDrumRollBackgroundColor: 'white',
        timePickerBackgroundColor: 'white',
        timePickerBackgroundColorDisabled: 'rgb(226,226,226)',
        timePickerDrumRollBackgroundColor: 'white',
        drumRollBackgroundColor: 'rgb(240,240,240)',
        drumRollIconColor: 'rgb(150,150,150)',
        mapPickerBackgroundColor: 'white',
        qrImageBackgroundColor: 'white',
    };
    static opacity = {
        SGIconDisabled:0.5,
        SGImageDisabled:0.5,
        disabled: 1,
        shadow: 0.2,
    }
    static elevation = 6;
    static shadowRadius = 3;
    static shadowOffset = { height: 2 };
    static fontFamily = {
        regular: 'Montserrat-Regular',
        bold: 'Montserrat-Bold',
        italic: 'Montserrat-Italic',
    }
    /**
     * get default style for various component type
     */
    static style = StyleSheet.create({
        SGView: { alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
        SGRootView: { alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
        SGText: { fontFamily: 'Ubuntu', textAlign: 'left', color: 'black' },
        SGSmartText: { fontFamily: 'Ubuntu', textAlign: 'left', color: 'black', fontSize: 20 },
        SGPopView: { zIndex: 999, },
        //SGPopView: { position:'absolute', top:0, left:0 },
    });
    /**
     * create a new set of props with the style props combined with newStyle
     * @param {*} props 
     * @param {*} newStyle 
     */

     static addStyleProps(props, newStyle, last = false) {
        var myProps = [];
        var keys = Object.keys(props);
        for (var i = 0; i < keys.length; i++) {
            myProps[keys[i]] = props[keys[i]];
        }
        if (SGHelperType.isDefined(props) ? SGHelperType.isDefined(props['style']) : false) {
            if(last){
                myProps['style'] = SGHelperStyle.appendStyle(SGHelperType.copyJSON(props['style']),newStyle);
            } else {
                myProps['style'] = SGHelperStyle.prependStyle(SGHelperType.copyJSON(props['style']),newStyle);
            }
        } else {
            myProps['style'] = newStyle;
        }
        return myProps;
    }

    /**
     * inject new style at the end (higher priority than original style)
     * @param {*} style 
     * @param {*} newStyle 
     */
    static appendStyle(style, newStyle) {
        if (SGHelperType.isDefined(style)) {
            if (Array.isArray(style)) {
                style.push(newStyle);
                return style;
            } else {
                return { ...style, ...newStyle };
            }
        } else {
            return newStyle
        }
    }
    /**
     * inject new style at the beginning (lower priority than original style)
     * @param {*} style 
     * @param {*} newStyle 
     */
    static prependStyle(style, newStyle) {
        if (SGHelperType.isDefined(style)) {
            if (Array.isArray(style)) {
                style.splice(0, 0, newStyle);
                return style;
            } else {
                return { ...newStyle, ...style };
            }
        } else {
            return newStyle
        }
    }

    /**
     * Add shadow styling
     * @param {*} style 
     */
    static addShadowStyle(style, shadowIntensity = 1.0) {
        if (Platform.OS === 'android') {
            return SGHelperStyle.prependStyle(style, { elevation: shadowIntensity * SGHelperStyle.elevation })
        } else {
            var _style = SGHelperStyle.prependStyle(style, { shadowOffset: { height: shadowIntensity * SGHelperStyle.shadowOffset.height }, shadowColor: SGHelperStyle.color.shadowColor, shadowOpacity: SGHelperStyle.opacity.shadow, shadowRadius: shadowIntensity * SGHelperStyle.shadowRadius })
            return SGHelperStyle.appendStyle(_style, { overflow: 'visible' });
        }
    }
    /**
     * copy style property in a given list or style name array
     * @param {*} arrName 
     */
    static copyStyle(style, arrName) {
        var res = {};
        for (var i = 0; i < arrName.length; i++) {
            res[arrName[i]] = style[arrName[i]];
        }
        return res;
    }
    /**
     * generate random color with defined minimum RGB value
     * @param {number} minR 
     * @param {number} minG 
     * @param {number} minB 
     */
    static getRandomColor(minR, minG, minB) {
        return 'rgb(' + Math.max(Math.floor(Math.random() * 255), minR) + ',' + Math.max(Math.floor(Math.random() * 255), minG) + ',' + Math.max(Math.floor(Math.random() * 255), minB) + ')';
    }
    /**
     * generate random light background color
     */
    static getRandomBGColor() {
        return SGHelperStyle.getRandomColor(128, 128, 128);
    }
}
