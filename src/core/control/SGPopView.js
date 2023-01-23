/**
 * Version 1.4.2
 * GH Version 14 july 2021
 * - Updated new Component
 *
 * wrap SGView component with 2 additional behavior
 * 1. show floating view which load the children component
 * 2. modal true|false
 * 3. animation none | slide | fade
 * 4. noFade true|false
 */

 import React from 'react';
 //note, will not work if using SGTouchableWithoutFeedback ... use the native one
 import { TouchableWithoutFeedback, Modal, StyleSheet, Keyboard, Animated, Platform, BackHandler, Dimensions } from 'react-native';
 import { SGView } from './SGView';
 import { SGHelperType, SGHelperGlobalVar, SGHelperStyle, SGHelperWindow } from '../helper';
 import { SGBaseControl } from './SGBaseControl';
 import { SGDialogBox } from './SGDialogBox';
 
 export class SGPopView extends SGBaseControl {
     static _popViewList = [];
     static getPopViewID() {
         return SGHelperType.getGUID();
     }
     static registerPopView(popViewID, callBackShow, callBackHide) {
         SGPopView._popViewList[popViewID] = { id: popViewID, callBackShow: callBackShow, callBackHide: callBackHide };
     }
     static removePopView(popViewID) {
         delete SGPopView._popViewList[popViewID];
     }
     static showPopView(popViewID, isDialog = false, SGDialogInputOrPickerFlag = false) {
         if (!isDialog && SGDialogBox._dialogOpened && !SGDialogInputOrPickerFlag) {
             setTimeout(() => { SGPopView.showPopView(popViewID, isDialog) }, 200);
         } else {
             if (SGHelperType.isDefined(SGPopView._popViewList[popViewID])) {
                 SGPopView._popViewList[popViewID].callBackShow();
             }
         }
     }
     static hidePopView(popViewID, isDialog = false, SGDialogInputOrPickerFlag = false) {
         if (!isDialog && SGDialogBox._dialogOpened && !SGDialogInputOrPickerFlag) {
             setTimeout(() => { SGPopView.hidePopView(popViewID, isDialog) }, 200);
         } else {
             if (SGHelperType.isDefined(SGPopView._popViewList[popViewID])) {
                 SGPopView._popViewList[popViewID].callBackHide();
             }
         }
     }
 
     _keyboardDidShow() {
         this._keyboardVisible = true;
     }
     _keyboardDidHide() {
         this._keyboardVisible = false;
         if (this.props.hideWhenKeyboardDismissed && !this._hideTriggered && this.state.isVisible) {
             this._hide();
         }
     }
     _show() {
         this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow.bind(this));
         this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide.bind(this));
         this._hideTriggered = false;
         this._animFade.setValue(0);
         this.setState({ isVisible: true, isHiding: false });
     }
     _hide() {
         if (!this._hideTriggered) {
             this._hideTriggered = true;
             this.keyboardDidShowListener.remove();
             this.keyboardDidShowListener = null;
             this.keyboardDidHideListener.remove();
             this.keyboardDidHideListener = null;
             if (this.props.onWillHide) {
                 this.props.onWillHide();
             }
             this.animateFadeOut();
         }
     }
     constructor(props, context, ...args) {
         super(props, context, ...args);
         this._showBlackSideAreas = SGHelperGlobalVar.getVar('ShowBlackSideAreas');
         this._style = this.createStyleSheet(this.props.vPos, this.props.hPos);
         this._overlayBackgroundColor = 'rgba(0,0,0,0)';
         this._animFade = new Animated.Value(0);
         this._hideTriggered = false;
         this._keyboardVisible = false;
         this.state = { isVisible: false, isHiding: false };
         SGPopView.registerPopView(this.props.popViewID, this._show.bind(this), this._hide.bind(this));
         if (!this.props.noDialogBox) {
             this._dbID = SGDialogBox.getDialogBoxID();
         }
         this._orientation=SGHelperWindow._globalOrientation;
     }
     createStyleSheet(vPos, hPos) {
         var { w, h, p } = SGHelperWindow.getWHPNoHeader();
         var _hReduce = !this._showBlackSideAreas ? (Platform.OS === 'android' ? Math.min(Math.max(Dimensions.get('screen').height - SGHelperWindow.getWHPNoHeader().h, 0),SGHelperWindow.getStatusBarHeight()) : 0) : (Platform.OS === 'android' ? SGHelperWindow.getStatusBarHeight() : 0)
         return StyleSheet.create({
             v1: { zIndex: 997, width: w, height: h - _hReduce, justifyContent: (vPos === 'top' ? 'flex-start' : (vPos === 'bottom' ? 'flex-end' : 'center')), alignItems: (hPos === 'left' ? 'flex-start' : (hPos === 'right' ? 'flex-end' : 'center')), },
             v2: { overflow: this.props.shadow ? 'visible' : 'hidden', zIndex: 999 },
             v3: { zIndex: 998, width: w, height: h - _hReduce, position: 'absolute', top: 0, left: 0, backgroundColor: 'rgb(0,0,0)', opacity: 0 },
             v4: { width: w, height: h - _hReduce },
         });
     }
     componentWillUnmount() {
         if (this.keyboardDidShowListener) { this.keyboardDidShowListener.remove(); }
         if (this.keyboardDidHideListener) { this.keyboardDidHideListener.remove(); }
         SGPopView.removePopView(this.props.popViewID);
     }
     animateFadeIn() {
         var _toValue = this.props.noFade ? 0 : 0.5;
         Animated.timing(this._animFade, {
             toValue: _toValue,
             duration: 100,
             useNativeDriver: false
         }).start((res) => {
             if (!this.props.noDialogBox) { SGDialogBox.pushActiveDialogBox(this._dbID); }
         });
     }
     animateFadeOut() {
         var _fromValue = this.props.noFade ? 0 : 0.5;
         this._animFade.setValue(_fromValue);
         Animated.timing(this._animFade, {
             toValue: 0,
             duration: 100,
             useNativeDriver: false
         }).start((res) => {
             if (Platform.OS === 'android') {
                 this.setState({ isVisible: false, isHiding: true });
             } else {
                 this.setState({ isVisible: false, isHiding: true });
             }
             if (!this.props.noDialogBox) { SGDialogBox.popActiveDialogBox(this._dbID); }
         });
     }
     _onPressHandler() {
         if (this._keyboardVisible) {
             if (this.props.hideWhenKeyboardDismissed) {
                 this._hide();
             }
             Keyboard.dismiss();
             this._keyboardVisible = false;
         } else {
             if (!this.props.modal) {
                 this._hide();
             }
         }
     }
     _onShowHandler() {
         if (this.props.onShow) {
             this.props.onShow();
         }
         if (Platform.OS === 'android') {
             var animType = this.props.animationType ? this.props.animationType : 'none';
             setTimeout(() => { this.animateFadeIn(); }, animType === 'slide' ? 200 : 0);
         } else {
             this.animateFadeIn();
         }
     }
     _onDismissHandler() {
         // if (Platform.OS === 'ios') {
         //     if (this.props.onDismiss) {
         //         this.props.onDismiss();
         //     }
         // }
     }
 
     render() {
         if(this._orientation!==SGHelperWindow._globalOrientation){
             this._style = this.createStyleSheet(this.props.vPos, this.props.hPos);
             this._orientation = SGHelperWindow._globalOrientation;
         }
         // if (Platform.OS === 'android' && this.state.isHiding) {
         if (this.state.isHiding) {
             if (SGHelperType.isDefined(this.props.onDismiss)) {
                 this.props.onDismiss();
             }
             this.state.isHiding = false;
         }
         var style = this._style;
         
         return (
             <>
                 {
                     this._showBlackSideAreas &&
                     <Modal accessible={true} accessibilityLabel={'SGPopViewRootModal'} animationType={this.props.animationType ? this.props.animationType : 'none'} transparent={true} visible={this.state.isVisible} onShow={this._onShowHandler.bind(this)}  >
                         <SGView style={{ flex: 1, alignSelf: 'stretch', justifyContent: 'flex-start', alignItems: 'center', }}>
                             <SGView accessible={true} accessibilityLabel={'SGPopViewContent'} style={style.v1} dontRandomColor>
                                 <SGView accessible={true} accessibilityLabel={'SGPopViewChildView'} style={style.v2} shadow={this.props.noFade ? true : false} dontRandomColor>
                                     {this.props.children}
                                 </SGView>
                                 <Animated.View accessible={true} accessibilityLabel={'SGPopViewAnimatedView'} style={[style.v3, { opacity: this._animFade }]} dontRandomColor>
                                     <TouchableWithoutFeedback onPress={this._onPressHandler.bind(this)}>
                                         <SGView accessible={true} accessibilityLabel={'SGPopViewRandomColorView'} style={style.v4} dontRandomColor></SGView>
                                     </TouchableWithoutFeedback>
                                 </Animated.View>
                             </SGView>
                             {
                                 !this.props.noDialogBox &&
                                 <SGDialogBox accessible={true} accessibilityLabel={'SGPopViewDialogBox'} dialogBoxID={this._dbID} />
                             }
                         </SGView>
                     </Modal>
                 }
                 {
                     !this._showBlackSideAreas &&
                     <Modal accessible={true} accessibilityLabel={'SGPopViewRootModal'} animationType={this.props.animationType ? this.props.animationType : 'none'} transparent={true} visible={this.state.isVisible} onShow={this._onShowHandler.bind(this)}  >
                         <SGView accessible={true} accessibilityLabel={'SGPopViewContent'} style={style.v1} dontRandomColor>
                             <SGView accessible={true} accessibilityLabel={'SGPopViewChildView'} style={style.v2} shadow={this.props.noFade ? true : false} dontRandomColor>
                                 {this.props.children}
                             </SGView>
                             <Animated.View accessible={true} accessibilityLabel={'SGPopViewAnimatedView'} style={[style.v3, { opacity: this._animFade }]} dontRandomColor>
                                 <TouchableWithoutFeedback onPress={this._onPressHandler.bind(this)}>
                                     <SGView accessible={true} accessibilityLabel={'SGPopViewRandomColorView'} style={style.v4} dontRandomColor></SGView>
                                 </TouchableWithoutFeedback>
                             </Animated.View>
                         </SGView>
                         {
                             !this.props.noDialogBox &&
                             <SGDialogBox accessible={true} accessibilityLabel={'SGPopViewDialogBox'} dialogBoxID={this._dbID} />
                         }
                     </Modal>
                 }
             </>
 
         )
     }
 }