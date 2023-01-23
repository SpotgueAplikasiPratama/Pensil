/**
 * Version 1.4.3
 * 1. Yohanes 13 Agustus 2021
 * - Add New Status Grey, and add New Type Vip,Gold,ChargingStation
 * Version 1.4.1
 * 1. Yohanes 8 July 2021
 * - Change Style CarBoxCard using transform
 * Version 1.4.0
 * 1. Yohanes 16 June 2021
 * - Change Style CarBoxCard
 * Version 1.2.0
 * 1. Yohanes 21 April 2021
 * - checking isAlreadyCheckIn using globalVar
 * version 1.1.0
 * 1. Yohanes 9 Maret 2021
 * - Disabled CarBoxCard if Rendered by MyParkingSpotWithLayoutScreen
 */
 import React from 'react';
 import { Animated, StyleSheet} from 'react-native';
 import { SGBaseContainer } from '../../core/container/SGBaseContainer';
 import FastImage  from 'react-native-fast-image'
 import { SGImage as Image, SGDialogBox, SGTouchableOpacity as TouchableOpacity } from '../../core/control';
 import { SGLocalize } from '../locales/SGLocalize'
 import { SGHelperType, SGHelperNavigation, SGHelperGlobalVar,SGHelperStyle } from '../../core/helper';
 import ImageAssets from '../asset/image'
 export class CarBoxCardAndroidTV extends SGBaseContainer {
     static _arrType = ['PublicParking', 'LadiesParking', 'DisabledParking', 'ValetParking', 'GoldParking', 'VIPParking', 'ChargingParking']
     static _arrStatus = ['green', 'red', 'yellow', '', 'grey'];
     static _jsonColor = { green: '#1FBC8D', red: '#E64D4D', yellow: '#FFDE00', grey: '#808080' };
 
     constructor(props, context, ...args) {
         super(props, context, ...args);
         this.prevStatus = -1;
         this.fStatus = -1;
         this.initStyleSheet(this.props.style);
         this.initStaticData(this.props.data, this.props.scale, this.props.style);
         this.imageSetting = SGHelperGlobalVar.getVar("GlobalImageSetting");
     }
 
     initStyleSheet(propStyle) {
         this._whp = { w: propStyle.width, h: propStyle.height, p: propStyle.padding }
         var { w, h, p } = this._whp;
         this._style = StyleSheet.create({
             v1: { position: 'absolute', width: w * 2, height: h * 2, borderRadius: w/2, alignItems: 'center', justifyContent: 'center', margin: 0, padding:0},
             to1: { width: w * 2, height: h * 2, borderRadius: w/2, margin: 0, alignItems: 'center', justifyContent: 'space-evenly', padding:0 },
             img1 : { width: w * 2.5, height: w * 2, backgroundColor: 'transparent' },
             t1: { maxWidth:w*2, fontSize:w*0.5,color:'white', fontFamily: SGHelperStyle.fontFamily.bold},
         });
     }
  
     shouldComponentUpdate(prevProps){

         //not applicable for visitor carboxcard component
         if (this.props.data.fStatus !== prevProps.data.fStatus 
             || this.props.data.fType !== prevProps.data.fType 
             || this.props.fDDSActive !== prevProps.fDDSActive 
             || this.props.fOnline !== prevProps.fOnline
             || this.props.data.fLastModifiedDate !== prevProps.data.fLastModifiedDate  
            
             ) {
             return true
         }
         return false
     }
     
     initStaticData(propData, propScale, propStyle)
     {
         this._data = propData;
         this._scale = propScale;
         this._X = new Animated.Value(this._data.fXPosition * this._scale - propStyle.width );
         this._Y = new Animated.Value(this._data.fYPosition * this._scale - propStyle.height );
         this._rotateFlag = (this._data.fRotation !== 0);
         if (this._rotateFlag) {
             this._R = new Animated.Value(((this._data.fRotation+360)%360)/360).interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });
             this._Rneg = new Animated.Value(((-this._data.fRotation+360)%360)/360).interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });
         }
     }
 
     translateStatus(fStatus){
         if (this.props.fDDSActive === "N" && this.props.fOnline==="Y") {
             if(fStatus === 2) { return(1); }                
             if(fStatus === 3) { return(0); }
             return fStatus;                
         } else {
             if (fStatus !== 5) {return(4);}
             else {return (fStatus);}
         }
     }
 
     //original _data.fStatus
     //0 = hijau, 1 = merah, 2 = kuning, 3 = ungu,  4 = abu-abu, 5 = hitam
     //DDS off & online Y
     //0 = hijau, 1 = merah, 1 = merah,  0 = hijau, 4 = abu-abu, 5 = hitam
     //Else
     //4 = abu,   4 = abu,   4 = abu,    4 = abu,   4 = abu,     5 = hitam
     initData(propData) {
         this._data = propData;
         this.prevStatus = this._data.fStatus;
         this.fStatus = this.translateStatus(this.prevStatus);
         
     }

 
     render() {
         // console.log('CarBoxCard.render');
         this.initData(this.props.data);
         var style = this._style;
        //  console.log(this)
         return (
             <>
                 {
                     this._rotateFlag &&  this._data.fStatus!==5 &&
                     <Animated.View style={[style.v1, { opacity: this._animOpacity,backgroundColor: CarBoxCardAndroidTV._jsonColor[CarBoxCardAndroidTV._arrStatus[this.fStatus]], transform: [{ translateX: this._X }, { translateY: this._Y }, { rotate: this._R }, { scale: 0.25/2 }] }]}>
                         <TouchableOpacity disabled={this.props.disabled} style={style.to1}>
                             {   this._data.fLocation!=='' &&
                                 <Animated.Text numberOfLines={1} style={[style.t1,{ transform: [{ rotate: this._Rneg }]}]}>{this._data.fLocation}</Animated.Text>
                             }
                             <Animated.View style={{ transform: [{ rotate: this._Rneg }] }}>
                                 <FastImage style={style.img1} source={{ uri: ImageAssets[CarBoxCardAndroidTV._arrType[this._data.fType]][this.imageSetting].url }} />
                             </Animated.View>
                         </TouchableOpacity>
                     </Animated.View>
                 }
                 {
                     !this._rotateFlag &&  this._data.fStatus!==5 &&
                     <Animated.View style={[style.v1, { opacity: this._animOpacity,backgroundColor: CarBoxCardAndroidTV._jsonColor[CarBoxCardAndroidTV._arrStatus[this.fStatus]], transform: [{ translateX: this._X }, { translateY: this._Y }, { scale: 0.25/2 }] }]}>
                         <TouchableOpacity disabled={this.props.disabled} style={style.to1}>
                             {   this._data.fLocation!=='' &&
                                 <Animated.Text numberOfLines={1} style={style.t1}>{this._data.fLocation}</Animated.Text>
                             }
                             <FastImage style={style.img1} source={{ uri: ImageAssets[CarBoxCardAndroidTV._arrType[this._data.fType]][this.imageSetting].url }} />
                         </TouchableOpacity>
                     </Animated.View>
                 }
             </>
         );
     }
 }
 