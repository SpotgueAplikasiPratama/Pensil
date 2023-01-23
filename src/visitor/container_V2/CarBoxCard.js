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
export class CarBoxCard extends SGBaseContainer {
    static _arrType = ['PublicParking', 'LadiesParking', 'DisabledParking', 'ValetParking', 'GoldParking', 'VIPParking', 'ChargingParking']
    static _arrStatus = ['green', 'red', 'yellow', '', 'grey'];
    static _jsonColor = { green: '#1FBC8D', red: '#E64D4D', yellow: '#FFDE00', grey: '#808080' };

    constructor(props, context, ...args) {
        super(props, context, ...args);
        this.anonymousMode = SGHelperGlobalVar.getVar('GlobalAnonymous')
        this._animOpacity = new Animated.Value(1);
        this._flagOpacity = true;
        this._initOpacity = false;

        this.prevStatus = -1;
        this.fStatus = -1;
        this.initStyleSheet(this.props.style);
        this.initStaticData(this.props.data, this.props.scale, this.props.style);
        this.imageSetting = SGHelperGlobalVar.getVar("GlobalImageSetting");
        this.prevUserParkedID = '';
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
        // console.log('shouldComponentUpdate');
        var prevID = this.prevUserParkedID
        var curID = (SGHelperType.isDefined(prevProps.userParked.fParkingJSON)? prevProps.userParked.fParkingJSON.fID:'');
        this.prevUserParkedID = curID;
        //not applicable for visitor carboxcard component
        if (this.props.data.fStatus !== prevProps.data.fStatus 
            || this.props.data.fType !== prevProps.data.fType 
            // || this.props.data.fPlate !== prevProps.data.fPlate 
            // || this.props.data.fLocation !== prevProps.data.fLocation 
            || this.props.fDDSActive !== prevProps.fDDSActive 
            || this.props.fOnline !== prevProps.fOnline
            // || this.props.data.fXPosition !== prevProps.data.fXPosition 
            // || this.props.data.fYPosition !== prevProps.data.fYPosition 
            // || this.props.data.fRotation !== prevProps.data.fRotation 
            || this.props.data.fLastModifiedDate !== prevProps.data.fLastModifiedDate  
            || this.props.blinking !==prevProps.blinking
            || prevID !== curID
            // || (SGHelperType.isDefined(this.props.userParked) && !SGHelperType.isDefined(prevProps.userParked))
            // || (!SGHelperType.isDefined(this.props.userParked) && SGHelperType.isDefined(prevProps.userParked))
            // || ((SGHelperType.isDefined(this.props.userParked) && SGHelperType.isDefined(prevProps.userParked))? this.props.userParked.fParkingJSON.fID!== prevProps.userParked.fParkingJSON.fID : false)
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
    initData(propData, propUserParked) {
        this._data = propData;
        this.prevStatus = this._data.fStatus;
        if (SGHelperType.isDefined(propUserParked.fParkingJSON)) {
            if (this._data.fID === propUserParked.fParkingJSON.fID && this.prevStatus !== 5) {
                this.fStatus = 2;
            } else {
                this.fStatus = this.translateStatus(this.prevStatus);
            }
        } else {
            this.fStatus = this.translateStatus(this.prevStatus);
        }
    }

    async onPressHandler() {
        if(this.props.disabled){return;}
        if(this.fStatus!== 2 && this._data.fStatus!== 5){
            if (this.anonymousMode) {
                SGDialogBox.showAction(null, SGLocalize.translate("AnonymousAlert.title"), SGLocalize.translate("AnonymousAlert.messageMarkMySpot"), SGLocalize.translate("AnonymousAlert.signUpButton"), () => { SGHelperNavigation.navigatePush(this.props.navigation, 'SignUp') }, SGLocalize.translate("AnonymousAlert.signInButton"), () => { SGHelperNavigation.navigatePush(this.props.navigation, 'SignIn') }, true)
            }
            else if (SGHelperGlobalVar.getVar("ParkingCheckIn") !== true) {
                SGDialogBox.showAction(null, SGLocalize.translate("AnonymousAlert.title"), SGLocalize.translate("CheckInAlert.messageMarkMySpotCheckInOnly"), SGLocalize.translate("CheckInAlert.cancelButton"), () => { }, SGLocalize.translate("CheckInAlert.goToContentHomeButton"), 
                    async () => { setTimeout( async ()=>{ if (await this.props.onCheckInPress()) { setTimeout((()=>{this._onSGAlertInput();}).bind(this),250); }},250);
                }, true)
            } else {
                await this._onSGAlertInput();
            }
        }
    }

    async _onSGAlertInput() {
        var tR = SGLocalize.translate
        var plate = this.props.userData.fCar[0]
        var pickerCar = this._onGetPickerCar()
        if (pickerCar.length === 0) {
            SGDialogBox.showConfirmation(null,
                tR('ParkingLayoutFullScreen.NoPlat'),
                tR('ParkingLayoutFullScreen.NoPlatText'),
                tR('ParkingLayoutFullScreen.InputLater'), () => { this._popUpReward()},
                tR('ParkingLayoutFullScreen.InputNow'), () => { SGHelperNavigation.navigatePush(this.props.navigation, "DetailProfileScreen") }, true)
        } else {
            SGDialogBox.showPickerBox(
                null,
                tR('ParkingLayoutFullScreen.Confirmation'),
                tR('ParkingLayoutFullScreen.ConfirmationText') + ' ' + (this._data.fLocation !== '' ? this._data.fLocation : "-") + '\n \n' + tR('ParkingLayoutFullScreen.ResWarning'),
                true,
                true,
                pickerCar,
                (v) => { plate = v; },
                false,
                tR('ParkingLayoutFullScreen.No'), () => { },
                tR('ParkingLayoutFullScreen.Yes'), (() => { setTimeout(()=>{this.changeStatus(plate, (this.prevStatus !== 4? 3 : 4), this.props.userParked)},250) }).bind(this), true, plate)
        }
    }

    _onGetPickerCar() {
        var userData = this.props.userData
        this.pickerCar = []
        for (var i = 0; i < userData.fCar.length; i++) {
            this.pickerCar.push({ key: userData.fCar[i], title: userData.fCar[i] })
        }
        return this.pickerCar
    }

    async changeStatus(plate, status, userParked) {
        this._data.fPlate = plate;
        this._data.fStatus = status
        if (plate !== '') {
            if ((SGHelperType.isDefined(userParked)? userParked.fID !== null:false)) {
                await this.props.onChangeParkir(this._data, '')
            } else {
                await this.props.onChangeParkir(this._data, 'add')
            }
            this._popUpReward()
        }
        // this.forceUpdate();
    }

    _popUpReward() {
        if (this.props.onShowReward) this.props.onShowReward()
    }

    async animBlink (){
        var dur = 200;
        var endValue = !this._flagOpacity?1:0.25;
        Animated.timing(this._animOpacity, {
            toValue: endValue,
            duration: dur,
            useNativeDriver: true
        }).start((res) => {
            this._flagOpacity=!this._flagOpacity;
            if(this._flagOpacity){
                this.startAnimateBlink();
            } else {
                this.animBlink();
            }
        });        
    }

    async startAnimateBlink() {
        if (this.props.blinking) {
            if(!this._initOpacity){ this._initOpacity = true;} 
            var t = 1000 - new Date().getMilliseconds()%1000;
            setTimeout((()=>{this.animBlink();}).bind(this),t);    
        } else {
            if(this._initOpacity){
                this._initOpacity = false;
                this._animOpacity.setValue(1);    
            }
        }
    }

    render() {
        // console.log('CarBoxCard.render');
        this.initData(this.props.data, this.props.userParked);
        var style = this._style;
        this.startAnimateBlink();
        return (
            <>
                {
                    this._rotateFlag &&  this._data.fStatus!==5 &&
                    <Animated.View style={[style.v1, { opacity: this._animOpacity,backgroundColor: CarBoxCard._jsonColor[CarBoxCard._arrStatus[this.fStatus]], transform: [{ translateX: this._X }, { translateY: this._Y }, { rotate: this._R }, { scale: 0.25/2 }] }]}>
                        <TouchableOpacity onPress={this.onPressHandler.bind(this)} disabled={this.props.disabled} style={style.to1}>
                            {   this._data.fLocation!=='' &&
                                <Animated.Text numberOfLines={1} style={[style.t1,{ transform: [{ rotate: this._Rneg }]}]}>{this._data.fLocation}</Animated.Text>
                            }
                            <Animated.View style={{ transform: [{ rotate: this._Rneg }] }}>
                                <FastImage style={style.img1} source={{ uri: ImageAssets[CarBoxCard._arrType[this._data.fType]][this.imageSetting].url }} />
                            </Animated.View>
                        </TouchableOpacity>
                    </Animated.View>
                }
                {
                    !this._rotateFlag &&  this._data.fStatus!==5 &&
                    <Animated.View style={[style.v1, { opacity: this._animOpacity,backgroundColor: CarBoxCard._jsonColor[CarBoxCard._arrStatus[this.fStatus]], transform: [{ translateX: this._X }, { translateY: this._Y }, { scale: 0.25/2 }] }]}>
                        <TouchableOpacity onPress={this.onPressHandler.bind(this)} disabled={this.props.disabled} style={style.to1}>
                            {   this._data.fLocation!=='' &&
                                <Animated.Text numberOfLines={1} style={style.t1}>{this._data.fLocation}</Animated.Text>
                            }
                            <FastImage style={style.img1} source={{ uri: ImageAssets[CarBoxCard._arrType[this._data.fType]][this.imageSetting].url }} />
                        </TouchableOpacity>
                    </Animated.View>
                }
            </>
        );
    }
}
