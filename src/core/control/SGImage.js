/**.
 * Version 1.1.0
 * 1 Yohanes , 10 March 2021
 * - change props resizeMode
 */
/**
 * wrap react-native ImageBackground component
 * additional behavior
 * 1. display loading icon while the image not loaded
 * 2. defaut style from available preset
 * 3. hidden true|false
 * 4. shadow true|false with prop shadowIntensity from 0.0 to 1.0
 */


 import React from 'react';
 import { StyleSheet, ImageBackground} from 'react-native';
 import FastImage  from 'react-native-fast-image'
 import { SGHelperStyle } from '../helper/SGHelperStyle';
 import { SGHelperType } from '../helper/SGHelperType';
 import { SGHelperGlobalVar } from '../helper/SGHelperGlobalVar';
 import { SGBaseControl } from './SGBaseControl';
 import { SGActivityIndicator } from './SGActivityIndicator';
 import { Platform } from 'react-native';
 import { SGHelperWindow } from '../helper/SGHelperWindow';
 import { SGView } from './SGView';
 
 
 export class SGImage extends SGBaseControl {
     static preset = {
         //default normal font size is w6S
         //S = square 1:1, L=landscape16:9, P=portrait 9:16
         w1S: 'w1S', w2S: 'w2S', w3S: 'w3S', w4S: 'w4S', w5S: 'w5S', w6S: 'w6S', w7S: 'w7S', w8S: 'w8S',
         w10S: 'w10S', w12S: 'w12S', w14S: 'w14S', w16S: 'w16S', w18S: 'w18S', w20S: 'w20S', w20S: 'w24S',
         w1L: 'w1L', w2L: 'w2L', w3L: 'w3L', w4L: 'w4L', w5L: 'w5L', w6L: 'w6L', w7L: 'w7L', w8L: 'w8L',
         w1P: 'w1P', w2P: 'w2P', w3P: 'w3P', w4P: 'w4P', w5P: 'w5P', w6P: 'w6P', w7P: 'w7P', w8P: 'w8P',
         w20SnoBorder: 'w20SnoBorder', w24SnoBorder: 'w24SnoBorder',
         w1Slider: 'w1Slider', hidden: 'hidden',
     }
     static _isPresetInit = false;
     static _presetStyle = {};
     static _initPreset() {
         if (!SGImage._isPresetInit) {
             var { w, h, p } = SGHelperWindow.getWHPNoHeader();
             SGImage._presetStyle = StyleSheet.create({
                 //{fontSize},{borderRadius}, {width}, {height}, {padding}, {marginVertical} and {marginHorizontal} is % multiplication factor of screen w
                 w1S: { borderRadius: w * 0.03, width: 100 / 1 * 0.96 * w * 0.01, height: 100 / 1 * 0.96 * w * 0.01, padding: w * 0.01, marginVertical: w * 0.01, marginHorizontal: w * 0.01, justifyContent: 'center', alignItems: 'center', overflow: 'hidden', backgroundColor: SGHelperStyle.color.SGImage.BGGrey, },
                 w2S: { borderRadius: w * 0.03, width: 100 / 2 * 0.96 * w * 0.01, height: 100 / 2 * 0.96 * w * 0.01, padding: w * 0.01, marginVertical: w * 0.01, marginHorizontal: w * 0.01, justifyContent: 'center', alignItems: 'center', overflow: 'hidden', backgroundColor: SGHelperStyle.color.SGImage.BGGrey, },
                 w3S: { borderRadius: w * 0.03, width: 100 / 3 * 0.96 * w * 0.01, height: 100 / 3 * 0.96 * w * 0.01, padding: w * 0.01, marginVertical: w * 0.01, marginHorizontal: w * 0.01, justifyContent: 'center', alignItems: 'center', overflow: 'hidden', backgroundColor: SGHelperStyle.color.SGImage.BGGrey, },
                 w4S: { borderRadius: w * 0.03, width: 100 / 4 * 0.96 * w * 0.01, height: 100 / 4 * 0.96 * w * 0.01, padding: w * 0.01, marginVertical: w * 0.01, marginHorizontal: w * 0.01, justifyContent: 'center', alignItems: 'center', overflow: 'hidden', backgroundColor: SGHelperStyle.color.SGImage.BGGrey, },
                 w5S: { borderRadius: w * 0.03, width: 100 / 5 * 0.96 * w * 0.01, height: 100 / 5 * 0.96 * w * 0.01, padding: w * 0.01, marginVertical: w * 0.01, marginHorizontal: w * 0.01, justifyContent: 'center', alignItems: 'center', overflow: 'hidden', backgroundColor: SGHelperStyle.color.SGImage.BGGrey, },
                 w6S: { borderRadius: w * 0.03, width: 100 / 6 * 0.96 * w * 0.01, height: 100 / 6 * 0.96 * w * 0.01, padding: w * 0.01, marginVertical: w * 0.01, marginHorizontal: w * 0.01, justifyContent: 'center', alignItems: 'center', overflow: 'hidden', backgroundColor: SGHelperStyle.color.SGImage.BGGrey, },
                 w7S: { borderRadius: w * 0.03, width: 100 / 7 * 0.96 * w * 0.01, height: 100 / 7 * 0.96 * w * 0.01, padding: w * 0.01, marginVertical: w * 0.01, marginHorizontal: w * 0.01, justifyContent: 'center', alignItems: 'center', overflow: 'hidden', backgroundColor: SGHelperStyle.color.SGImage.BGGrey, },
                 w8S: { borderRadius: w * 0.03, width: 100 / 8 * 0.96 * w * 0.01, height: 100 / 8 * 0.96 * w * 0.01, padding: w * 0.01, marginVertical: w * 0.01, marginHorizontal: w * 0.01, justifyContent: 'center', alignItems: 'center', overflow: 'hidden', backgroundColor: SGHelperStyle.color.SGImage.BGGrey, },
                 w10S: { borderRadius: w * 0.03, width: 100 / 10 * 0.96 * w * 0.01, height: 100 / 10 * 0.96 * w * 0.01, padding: w * 0.01, marginVertical: w * 0.01, marginHorizontal: w * 0.01, justifyContent: 'center', alignItems: 'center', overflow: 'hidden', backgroundColor: SGHelperStyle.color.SGImage.BGGrey, },
                 w12S: { borderRadius: w * 0.03, width: 100 / 12 * 0.96 * w * 0.01, height: 100 / 12 * 0.96 * w * 0.01, padding: w * 0.01, marginVertical: w * 0.01, marginHorizontal: w * 0.01, justifyContent: 'center', alignItems: 'center', overflow: 'hidden', backgroundColor: SGHelperStyle.color.SGImage.BGGrey, },
                 w14S: { borderRadius: w * 0.03, width: 100 / 14 * 0.96 * w * 0.01, height: 100 / 14 * 0.96 * w * 0.01, padding: w * 0.01, marginVertical: w * 0.01, marginHorizontal: w * 0.01, justifyContent: 'center', alignItems: 'center', overflow: 'hidden', backgroundColor: SGHelperStyle.color.SGImage.BGGrey, },
                 w16S: { borderRadius: w * 0.03, width: 100 / 16 * 0.96 * w * 0.01, height: 100 / 16 * 0.96 * w * 0.01, padding: w * 0.01, marginVertical: w * 0.01, marginHorizontal: w * 0.01, justifyContent: 'center', alignItems: 'center', overflow: 'hidden', backgroundColor: SGHelperStyle.color.SGImage.BGGrey, },
                 w18S: { borderRadius: w * 0.03, width: 100 / 18 * 0.96 * w * 0.01, height: 100 / 16 * 0.96 * w * 0.01, padding: w * 0.01, marginVertical: w * 0.01, marginHorizontal: w * 0.01, justifyContent: 'center', alignItems: 'center', overflow: 'hidden', backgroundColor: SGHelperStyle.color.SGImage.BGGrey, },
                 w20S: { borderRadius: w * 0.03, width: 100 / 20 * 0.96 * w * 0.01, height: 100 / 20 * 0.96 * w * 0.01, padding: w * 0.01, marginVertical: w * 0.01, marginHorizontal: w * 0.01, justifyContent: 'center', alignItems: 'center', overflow: 'hidden', backgroundColor: SGHelperStyle.color.SGImage.BGGrey, },
                 w24S: { borderRadius: w * 0.03, width: 100 / 24 * 0.96 * w * 0.01, height: 100 / 20 * 0.96 * w * 0.01, padding: w * 0.01, marginVertical: w * 0.01, marginHorizontal: w * 0.01, justifyContent: 'center', alignItems: 'center', overflow: 'hidden', backgroundColor: SGHelperStyle.color.SGImage.BGGrey, },
 
                 //used in other SG component'
                 w20SnoBorder: { width: 100 / 20 * 0.96 * w * 0.01, height: 100 / 20 * 0.96 * w * 0.01, padding: w * 0.01, marginVertical: w * 0.01, marginHorizontal: w * 0.01, justifyContent: 'center', alignItems: 'center', overflow: 'hidden', marginRight: 2 * p },
                 w24SnoBorder: { width: 100 / 24 * 0.96 * w * 0.01, height: 100 / 24 * 0.96 * w * 0.01, padding: w * 0.01, marginVertical: w * 0.01, marginHorizontal: w * 0.01, justifyContent: 'center', alignItems: 'center', overflow: 'hidden', marginRight: 2 * p },
 
                 w1L: { borderRadius: w * 0.03, width: 100 / 1 * 0.96 * w * 0.01, height: 100 / 1 * 0.96 * 9 / 16 * w * 0.01, padding: w * 0.01, marginVertical: w * 0.01, marginHorizontal: w * 0.01, justifyContent: 'center', alignItems: 'center', overflow: 'hidden', backgroundColor: SGHelperStyle.color.SGImage.BGGrey, },
                 w2L: { borderRadius: w * 0.03, width: 100 / 2 * 0.96 * w * 0.01, height: 100 / 2 * 0.96 * 9 / 16 * w * 0.01, padding: w * 0.01, marginVertical: w * 0.01, marginHorizontal: w * 0.01, justifyContent: 'center', alignItems: 'center', overflow: 'hidden', backgroundColor: SGHelperStyle.color.SGImage.BGGrey, },
                 w3L: { borderRadius: w * 0.03, width: 100 / 3 * 0.96 * w * 0.01, height: 100 / 3 * 0.96 * 9 / 16 * w * 0.01, padding: w * 0.01, marginVertical: w * 0.01, marginHorizontal: w * 0.01, justifyContent: 'center', alignItems: 'center', overflow: 'hidden', backgroundColor: SGHelperStyle.color.SGImage.BGGrey, },
                 w4L: { borderRadius: w * 0.03, width: 100 / 4 * 0.96 * w * 0.01, height: 100 / 4 * 0.96 * 9 / 16 * w * 0.01, padding: w * 0.01, marginVertical: w * 0.01, marginHorizontal: w * 0.01, justifyContent: 'center', alignItems: 'center', overflow: 'hidden', backgroundColor: SGHelperStyle.color.SGImage.BGGrey, },
                 w5L: { borderRadius: w * 0.03, width: 100 / 5 * 0.96 * w * 0.01, height: 100 / 5 * 0.96 * 9 / 16 * w * 0.01, padding: w * 0.01, marginVertical: w * 0.01, marginHorizontal: w * 0.01, justifyContent: 'center', alignItems: 'center', overflow: 'hidden', backgroundColor: SGHelperStyle.color.SGImage.BGGrey, },
                 w6L: { borderRadius: w * 0.03, width: 100 / 6 * 0.96 * w * 0.01, height: 100 / 6 * 0.96 * 9 / 16 * w * 0.01, padding: w * 0.01, marginVertical: w * 0.01, marginHorizontal: w * 0.01, justifyContent: 'center', alignItems: 'center', overflow: 'hidden', backgroundColor: SGHelperStyle.color.SGImage.BGGrey, },
                 w7L: { borderRadius: w * 0.03, width: 100 / 7 * 0.96 * w * 0.01, height: 100 / 7 * 0.96 * 9 / 16 * w * 0.01, padding: w * 0.01, marginVertical: w * 0.01, marginHorizontal: w * 0.01, justifyContent: 'center', alignItems: 'center', overflow: 'hidden', backgroundColor: SGHelperStyle.color.SGImage.BGGrey, },
                 w8L: { borderRadius: w * 0.03, width: 100 / 8 * 0.96 * w * 0.01, height: 100 / 8 * 0.96 * 9 / 16 * w * 0.01, padding: w * 0.01, marginVertical: w * 0.01, marginHorizontal: w * 0.01, justifyContent: 'center', alignItems: 'center', overflow: 'hidden', backgroundColor: SGHelperStyle.color.SGImage.BGGrey, },
                 w1P: { borderRadius: w * 0.03, width: 100 / 1 * 0.96 * w * 0.01, height: 100 / 1 * 0.96 * 16 / 9 * w * 0.01, padding: w * 0.01, marginVertical: w * 0.01, marginHorizontal: w * 0.01, justifyContent: 'center', alignItems: 'center', overflow: 'hidden', backgroundColor: SGHelperStyle.color.SGImage.BGGrey, },
                 w2P: { borderRadius: w * 0.03, width: 100 / 2 * 0.96 * w * 0.01, height: 100 / 2 * 0.96 * 16 / 9 * w * 0.01, padding: w * 0.01, marginVertical: w * 0.01, marginHorizontal: w * 0.01, justifyContent: 'center', alignItems: 'center', overflow: 'hidden', backgroundColor: SGHelperStyle.color.SGImage.BGGrey, },
                 w3P: { borderRadius: w * 0.03, width: 100 / 3 * 0.96 * w * 0.01, height: 100 / 3 * 0.96 * 16 / 9 * w * 0.01, padding: w * 0.01, marginVertical: w * 0.01, marginHorizontal: w * 0.01, justifyContent: 'center', alignItems: 'center', overflow: 'hidden', backgroundColor: SGHelperStyle.color.SGImage.BGGrey, },
                 w4P: { borderRadius: w * 0.03, width: 100 / 4 * 0.96 * w * 0.01, height: 100 / 4 * 0.96 * 16 / 9 * w * 0.01, padding: w * 0.01, marginVertical: w * 0.01, marginHorizontal: w * 0.01, justifyContent: 'center', alignItems: 'center', overflow: 'hidden', backgroundColor: SGHelperStyle.color.SGImage.BGGrey, },
                 w5P: { borderRadius: w * 0.03, width: 100 / 5 * 0.96 * w * 0.01, height: 100 / 5 * 0.96 * 16 / 9 * w * 0.01, padding: w * 0.01, marginVertical: w * 0.01, marginHorizontal: w * 0.01, justifyContent: 'center', alignItems: 'center', overflow: 'hidden', backgroundColor: SGHelperStyle.color.SGImage.BGGrey, },
                 w6P: { borderRadius: w * 0.03, width: 100 / 6 * 0.96 * w * 0.01, height: 100 / 6 * 0.96 * 16 / 9 * w * 0.01, padding: w * 0.01, marginVertical: w * 0.01, marginHorizontal: w * 0.01, justifyContent: 'center', alignItems: 'center', overflow: 'hidden', backgroundColor: SGHelperStyle.color.SGImage.BGGrey, },
                 w7P: { borderRadius: w * 0.03, width: 100 / 7 * 0.96 * w * 0.01, height: 100 / 7 * 0.96 * 16 / 9 * w * 0.01, padding: w * 0.01, marginVertical: w * 0.01, marginHorizontal: w * 0.01, justifyContent: 'center', alignItems: 'center', overflow: 'hidden', backgroundColor: SGHelperStyle.color.SGImage.BGGrey, },
                 w8P: { borderRadius: w * 0.03, width: 100 / 8 * 0.96 * w * 0.01, height: 100 / 8 * 0.96 * 16 / 9 * w * 0.01, padding: w * 0.01, marginVertical: w * 0.01, marginHorizontal: w * 0.01, justifyContent: 'center', alignItems: 'center', overflow: 'hidden', backgroundColor: SGHelperStyle.color.SGImage.BGGrey, },
 
                 w1Slider: { width: w, height: 9 / 16 * w, padding: w * 0.01, marginVertical: w * 0.01, justifyContent: 'center', alignItems: 'center', overflow: 'hidden', backgroundColor: SGHelperStyle.color.SGImage.BGGrey, },
                 hidden: { fontSize: 0, borderRadius: 0, width: 0, height: 0, padding: 0, marginVertical: 0, marginHorizontal: 0, },
             });
             SGImage._isPresetInit = true;
         }
     }
 
     constructor(props, context, ...args) {
         super(props, context, ...args);
         SGImage._initPreset();
         this.state = { isLoaded: false };
     }
 
     render() {
         var isDef = SGHelperType.isDefined;
         var pr = SGImage._presetStyle[this.props.preset ? this.props.preset : SGImage.preset.w6S];
         var myProps = [];
         myProps = SGHelperStyle.addStyleProps(this.props, pr);
         myProps.imageStyle = {  opacity: this.props.disabled ? SGHelperStyle.opacity.SGImageDisabled : 1, borderRadius: !this.props.style ? pr.borderRadius : SGHelperType.isDefined(this.props.style.borderRadius) ? this.props.style.borderRadius : pr.borderRadius };
         myProps.resizeMode = !isDef(this.props.style) ? FastImage.resizeMode.cover : !isDef(this.props.style.resizeMode) ? FastImage.resizeMode.cover : FastImage.resizeMode[this.props.style.resizeMode]
         if (this.props.hidden) {
             myProps.style = SGImage._presetStyle.hidden;
         }
         if (this.props.shadow && !this.props.hidden) {
             myProps.style = SGHelperStyle.addShadowStyle(myProps.style, this.props.shadowIntensity);
         }
         myProps.children = null;
         // if(Platform.OS==='ios'){
         //     myProps.source.cache = 'force-cache';
         // }
         var emptyImage = !this.props.source ? true : this.props.source.uri === '' ? true : false;
         return (
             <React.Fragment>
                 {
                     !this.props.hidden && !emptyImage &&
                     <FastImage accessible={true} accessibilityLabel={'SGImageRoot'} {...myProps} onLoadStart={() => { this.setState({ isLoaded: false }) }} onLoad={() => { this.setState({ isLoaded: true }); if(this.props.onLoad){this.props.onLoad();}}}>
                         {this.props.children}
                         {(!this.state.isLoaded || (this.props.source && this.props.source.uri === '')) &&
                             <SGActivityIndicator accessible={true} accessibilityLabel={'SGImageActivityIndicator'} style={{ position: 'absolute', width: '100%', height: '100%' }} hidden={this.props.hidden ? true : this.state.isLoaded} preset={SGActivityIndicator.preset.h2} />
                         }
                     </FastImage>
                 }
                 {
                     !this.props.hidden && emptyImage &&
                     <SGView accessible={true} accessibilityLabel={'SGImageRoot'} style={myProps.style} >
                         <SGActivityIndicator accessible={true} accessibilityLabel={'SGImageActivityIndicator'} style={{ position: 'absolute', width: '100%', height: '100%' }} hidden={this.props.hidden ? true : this.state.isLoaded} preset={SGActivityIndicator.preset.h2} />
                     </SGView>
                 }
             </React.Fragment>
         );
     }
 }
 