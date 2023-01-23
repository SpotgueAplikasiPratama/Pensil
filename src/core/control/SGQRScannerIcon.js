/**
 * Wrap RN-QRCode-SVG as component
 * 1. default style and user can customize
 * 2. shadow : true|false
 * 3. hidden : true|false
 * 4. preset, textStyle, style props
 */

 import React from 'react';
 import { SGQRScanner as labels } from '../locale/lang.json';
 import { StyleSheet } from 'react-native';
 import { SGIcon } from './SGIcon';
 import { SGIconButton } from './SGIconButton';
 import { SGBaseControl } from './SGBaseControl';
 import { SGPopView } from './SGPopView';
 import { SGView } from './SGView';
 import { SGText } from './SGText';
 import { SGTouchableOpacity } from './SGTouchableOpacity';
 import { SGHelperStyle, SGHelperWindow } from '../helper';
 import QRCodeScanner from './RNQRCodeScanner/QRCodeScanner';
 import { RNCamera } from 'react-native-camera';
 
 export class SGQRScannerIcon extends SGBaseControl {
     static preset = SGIconButton.preset;
     static iconPreset = SGIcon.preset;
 
     static _presetStyle = {};
     static _isPresetInit = false;
     static _initPreset() {
         if (!SGQRScannerIcon._isPresetInit) {
             var { w, h, p } = SGHelperWindow.getWHPNoHeader();
             SGQRScannerIcon._presetStyle = {
                 default: StyleSheet.create({
                     v1: { backgroundColor: 'transparent', borderRadius: 2 * p },
                     icon1: { margin: 0, paddingVertical: 0, color:'white' },
                     t1: { color: SGHelperStyle.color.SGQRScanner.TextBlack },
                     pv1: { paddingVertical: 0, paddingHorizontal: 2 * p, backgroundColor: SGHelperStyle.color.SGQRScanner.PVBGBlack, width: w, height: SGHelperWindow.getWHP().h * 0.8, borderTopLeftRadius: 5 * p, borderTopRightRadius: 5 * p, justifyContent: 'flex-start' },
                     pv1_t1: { color: SGHelperStyle.color.SGQRScanner.TextWhite },
                     to1: { backgroundColor: 'white', width: w * 0.14, height: w * 0.009, marginTop: 3.5 * p, borderRadius: 5 * p, marginBottom: 3.5 * p },
                 }),
                 disabled: StyleSheet.create({
                     v1: { backgroundColor: 'transparent', borderRadius: 2 * p },
                     icon1: { margin: 0, paddingVertical: 0, color:'white' },
                     t1: { color: SGHelperStyle.color.SGQRScanner.TextBlack },
                     pv1: { paddingVertical: 0, paddingHorizontal: 2 * p, backgroundColor: SGHelperStyle.color.SGQRScanner.PVBGBlack, width: w, height: SGHelperWindow.getWHP().h * 0.8, borderTopLeftRadius: 5 * p, borderTopRightRadius: 5 * p, justifyContent: 'flex-start' },
                     pv1_t1: { color: SGHelperStyle.color.SGQRScanner.TextWhite },
                     to1: { backgroundColor: 'white', width: w * 0.14, height: w * 0.009, marginTop: 3.5 * p, borderRadius: 5 * p, marginBottom: 3.5 * p },
                 })
             }
             SGQRScannerIcon._isPresetInit = true;
         }
     }
     constructor(props, context, ...args) {
         super(props, context, ...args);
         this.labels = labels;
         SGQRScannerIcon._initPreset();
         this.pvID = SGPopView.getPopViewID();
     }
     onShowHandler() {
         SGPopView.showPopView(this.pvID);
     }
     onHideHandler() {
         SGPopView.hidePopView(this.pvID);
     }
     onSuccess(e) {
         SGPopView.hidePopView(this.pvID);
         if (this.props.onScanSuccess) { this.props.onScanSuccess(e.data); }
     };
     render() {
         var style = SGQRScannerIcon._presetStyle[this.props.disabled ? 'disabled' : 'default'];
         var iconPr = this.props.iconPreset ? this.props.iconPreset : SGIcon.preset.w6;
         this._lang = this.props.language ? this.props.language : 'ID';
         return (
             !this.props.hidden &&
             <SGTouchableOpacity disabled={this.props.disabled} onPress={this.onShowHandler.bind(this)} shadow={this.props.shadow}>
                 <SGView accessible={true} accessibilityLabel={'SGQRScannerRootView'} style={style.v1} >
                     <SGIcon disabled={this.props.disabled} accessible={true} accessibilityLabel={'SGQRScannerIconButton'} preset={iconPr} name={SGIcon.Icon.qrscan} style={style.icon1}/>
                     <SGPopView accessible={true} accessibilityLabel={'SGQRScannerPopView'} animationType={'slide'} popViewID={this.pvID} vPos='bottom'>
                         <SGView accessible={true} accessibilityLabel={'SGQRScannerContentView'} style={style.pv1} >
                             <SGTouchableOpacity accessible={true} accessibilityLabel={'SGPickerPopArrowdownIcon'} style={style.to1} onPress={this.onHideHandler.bind(this)} ></SGTouchableOpacity>
                             <QRCodeScanner accessible={true} accessibilityLabel={'SGQRScannerQRScanner'} onRead={this.onSuccess.bind(this)} flashMode={RNCamera.Constants.FlashMode.off}
                                 topContent={<SGText preset={SGText.preset.titleH3B} style={style.pv1_t1}>{this.props.headerTitle}</SGText>}
                                 bottomContent={null} />
                         </SGView>
                     </SGPopView>
                 </SGView>
             </SGTouchableOpacity>
         );
     }
 }
 