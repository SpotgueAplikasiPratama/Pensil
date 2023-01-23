import React from 'react';
import { SGBaseContainer } from '../../core/container/SGBaseContainer';
import { SGView as View, SGText as Text, SGImage as Image,SGPanZoomView } from '../../core/control';
import { StyleSheet } from 'react-native';

import { SGHelperNavigation, SGHelperType } from '../../core/helper';
import { CarBoxCardAndroidTV } from './CarBoxCardAndroidTV';
import { SGLocalize } from '../locales/SGLocalize';
export class MallBodyPromoAndroidTV extends SGBaseContainer {
    createStyleSheet = (whp,data) => {
        var { w, h, p } = whp;
        this._vW = w - 4 * p
        this._vH = w - 4 * p
        
        this._scXY = Math.max(data.fWidthImage / this._vW, data.fHeightImage / this._vH) / this._imgScale; 
        this._imgW = data.fWidthImage / this._scXY;
        this._imgH = data.fHeightImage / this._scXY;
        var scaleW = Math.trunc(w * (h/w)/10*0.975)
        var scaleH =  Math.trunc(w * (h/w)/10 *1.95)
        this._cW = scaleW * this._scXY * data.fCarScale;
        this._cH = scaleH * this._scXY * data.fCarScale;

        return StyleSheet.create({
            v0:{width:w-4*p,borderTopWidth:1,borderColor:'rgb(228,228,228)',marginTop:2*p},
            v1:{width:w,height:p,padding:p},
            psv1: { width: this._vW, height: this._vH, borderWidth: 2, borderColor: 'rgb(150,150,150)' },
            img1: { width: this._imgW, height: this._imgH, alignItems: 'flex-start', justifyContent: 'flex-start',resizeMode:'contain',backgroundColor:'transparent' },
            c1: { width: this._cW, height: this._cH, backgroundColor: 'blue' },
         
        });
    }

    constructor(props, context, ...args) {
        super(props, context, ...args);
        this.whp = this.screenWHPNoHeader
        this._data=this.props.parkingData
        this._imgScale = SGHelperType.getSysParamsValueToInt("ImageScaleParking")/2;
        this.style = this.createStyleSheet(this.whp,this._data);
       
        this.startTimes= this.props.lastUpdated;
        this.endTimes = new Date()
        this.differencesTimes = Math.trunc((this.endTimes - this.startTimes)/1000)
       
        this.timeString = this._changeHourString(this.differencesTimes)
        this.timeDifference =  this._constructTime(this.differencesTimes)
        
        this.state={parkingSpot:this._data.parkingSpot}
        
    }
    componentDidMount(){
        this.interval = setInterval(() => {
            this.startTimes= this.props.lastUpdated;
            this.endTimes = new Date()
            this.differencesTimes =   Math.trunc((this.endTimes - this.startTimes)/1000)
        
            this.timeString = this._changeHourString(this.differencesTimes)
            this.timeDifference =  this._constructTime(this.differencesTimes)
            this.forceUpdate()
        }, 5000);
    }
    componentWillUnmount() {
        clearInterval(this.interval);
    }
    _constructTime(time){
        // 
        var convertTime = 1
        if(time <60 ) convertTime = 1
        else if (time<3600)convertTime= 60
        else if(time<86400) convertTime= 3600
        else if(time<604800) convertTime = 86400
        else if(time<2592000) convertTime = 604800
        
        return Math.trunc(time / convertTime)
    }

    _changeHourString(diffenceMinutes){
        if(diffenceMinutes<60) return "Second"
        else if(diffenceMinutes<3600) return "Minute"
        else if(diffenceMinutes<86400) return "Hour"
        else if (diffenceMinutes<2592000) return "Day"
    }
    render() {
        var { w, h, p } = this.whp;
        var style = this.style;
        // var data = this.props.data
        var language=this.props.language.toUpperCase()
        var imageSetting=this.props.imageSetting
        var data=this.props.parkingData
        var tR=SGLocalize.translate
        return (
            <View accessible={true} accessibilityLabel={'ParkingHighlightTopTextView'} style={style.v0}>
                <View style={{width:w,alignItems:'flex-start',paddingLeft:4*p}}>
                    <Text preset={Text.preset.h1B}>{data['fParkirName'+language]}</Text>
                    <Text accessible={true} accessibilityLabel={'ParkingHighlightTitleText'} style={style.textTitle} preset={Text.preset.heading9}>{tR("AvailableParkir.LastUpdated"+this.timeString, { count: this.timeDifference })}</Text>
                </View>
                <SGPanZoomView showBar={false} accessible={true} accessibilityLabel={'ParkingLayoutFullScreenZoomView'} style={style.psv1} scale={1 / this._imgScale} locked={false} maxScale={8}>
                    <Image accessible={true} accessibilityLabel={'ParkingLayoutFullScreenImgBackMap'} style={style.img1} source={{ uri: this._data.fURLImage }} resizeMode='contain' >
                        {
                            
                            this.state.parkingSpot.map((d,i) => {
                                return <CarBoxCardAndroidTV accessible={true} accessibilityLabel={'ParkingLayoutFullScreenCarBoxCard'} key={i}  style={style.c1} data={d} scale={1 / this._scXY} fDDSActive={this._data.fDDSActive} fOnline={this._data.fOnline}/>
                            })
                        }
                    </Image>
                </SGPanZoomView>
            </View>
                
        );
    }
}
