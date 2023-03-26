import React from 'react';
import { SGBaseContainer } from '../../core/container/SGBaseContainer';
import { SGView as View, SGText as Text, SGImage as Image,SGIcon as Icon ,SGTouchableOpacity as TouchableOpacity,SGQRImage as QRImage} from '../../core/control';
import { StyleSheet,Animated } from 'react-native';

import { SGHelperNavigation, SGHelperType,SGHelperStyle } from '../../core/helper';
export class MallHeaderAndroidTV extends SGBaseContainer {
    createStyleSheet = (whp) => {
        var { w, h, p } = whp;
        return StyleSheet.create({
            v1:{width:w,height:w*0.28,borderBottomWidth:1,borderColor:'rgb(228,228,228)'},
            placeNameText: { color: '#000000',marginHorizontal:0,marginVertical:0},
            lastVisitText: { color: '#A2A2A2',marginHorizontal:0,marginVertical:0,paddingLeft:p},
            lastVisitText1: { color: '#A2A2A2',marginHorizontal:0,marginVertical:0},

            to:{flexDirection:'row',justifyContent:'space-between',alignItems:'flex-start',width:w,marginTop:w*0.1,backgroundColor:'white',height:w*0.22},
            v2:{padding:0,marginBottom:p,position:'absolute',top:3*p,left:3*p},
            v3:{alignItems:'flex-start',justifyContent:'flex-start',marginTop:3.5*p,marginLeft:w*0.28},
            img:{width:w*0.21,height:w*0.21},
            throwWHP:{width:w,height:h,padding:p},
            overlayView:{width: w, height: w  * 9 / 16, position:'absolute',resizeMode:'cover',zIndex:-15},
            overlay:{width: w, height: w  * 9 / 16,resizeMode:'cover',paddingHorizontal:0,marginHorizontal:0,marginRight:0,padding:0,marginVertical:0,borderRadius:0}
        });
    }

    constructor(props, context, ...args) {
        super(props, context, ...args);
        this.whp = this.screenWHPNoHeader
        this.style = this.createStyleSheet(this.whp);
        
    }
    _getDay(indexDay){
        this._lang = this.props.language
        var ID=["Minggu","Senin","Selasa","Rabu","Kamis","Jumat","Sabtu"]
        var EN=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"]
        var CN=["星期天","星期一","星期二","星期三","星期四","星期五","星期六"]
        if(this._lang==="ID"||this._lang==="id")return ID[indexDay]
        if(this._lang==="EN"||this._lang==="en")return EN[indexDay]
        if(this._lang==="CN"||this._lang==="cn")return CN[indexDay]
    }
    render() {
        var { w, h, p } = this.whp;
        var style = this.style;
        // var data = this.props.data
        var language=this.props.language
        var imageSetting=this.props.imageSetting
        var data=this.props.data
        // console.log(data.fImageBackgroundJSON[0].high.uri)
        return (
               <View accessible={true} accessibilityLabel={'ParkingHighlightTopTextView'} style={style.v1}>
                   <Animated.View style={[style.overlayView,{transform:[{translateY: -w*0.15}]}]}>
                        <Image source={{ uri: data.fImageBackgroundJSON[0].high.uri}} style={style.overlay}></Image>
                    </Animated.View>
                    <Animated.View style={style.v2}>
                        <Image shadow source={{ uri: data.fImageJSON[0]['thumbnail' + imageSetting.charAt(0).toUpperCase() + imageSetting.slice(1)].uri }} style={style.img}></Image>
                    </Animated.View>
                    <View style={style.to}> 
                       
                        <View style={style.v3}>
                            <Text accessible={true} accessibilityLabel={'AskAliceAddLocationPlaceLocationType'} preset={Text.preset.h6B} numberOfLines={1} style={style.placeNameText}>{data.fBuildingName}</Text>
                            <View style={{alignItems:'flex-start',marginVertical:0,paddingVertical:0,padding:0}}>
                                <Text preset={Text.preset.heading8} style={style.lastVisitText1} >{this._getDay(new Date().getDay())+" "+ SGHelperType.formatDate(new Date(),"ID")}</Text>   
                                <Text preset={Text.preset.heading8} style={style.lastVisitText1}>{SGHelperType.formatTime(new Date(),this.props.language.toUpperCase())}</Text>   
                            </View>
                        </View>
                        <View style={{marginRight:3*p,marginTop:2*p}}>
                            <QRImage disabledText value={'mag.spotgue.com'} preset={QRImage.preset.wCustom} textPreset={Text.preset.h12} textStyle={{ fontSize:Math.floor( 3.75 * Math.pow(1.15, -7) * w * 0.01)}}></QRImage>
                            <Text style={{fontSize: Math.floor( 3.75 * Math.pow(1.15, -7) * w * 0.01), fontFamily: SGHelperStyle.fontFamily.regular, textAlign: 'left', textAlignVertical: 'top', color: SGHelperStyle.color.SGText.TextBlack, marginVertical:   Math.pow(1.16, -7) * w * 0.0125, marginHorizontal: w * 0.01, color: '#A2A2A2'}}>Download Sekarang</Text>
                        </View>
                    </View>
                   

                  
                </View>
                
        );
    }
}
