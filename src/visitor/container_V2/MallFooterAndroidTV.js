import React from 'react';
import { SGBaseContainer } from '../../core/container/SGBaseContainer';
import { SGView as View, SGText as Text, SGImage as Image,SGIcon as Icon ,SGTouchableOpacity as TouchableOpacity, } from '../../core/control';
import { StyleSheet ,Animated,Easing} from 'react-native';
import {SGHelperStyle} from '../../core/helper';
// import Animated from 'react-native-reanimated';
export class MallFooterAndroidTV extends SGBaseContainer {
    createStyleSheet = (whp,textLength) => {
        var { w, h, p } = whp;
        var width = w 
        // var width = w + textLength*5*p

        return StyleSheet.create({
            v1:{width: textLength*5*p,height:w*0.08,backgroundColor:'rgb(0,67,88)',alignItems:'flex-end',padding:0,marginHorizontal:0},
            text:{left:w, paddingLeft:2*p, fontSize: Math.floor( 3.75 * Math.pow(1.15, 1) * w * 0.01), fontFamily: SGHelperStyle.fontFamily.bold, textAlign: 'left', textAlignVertical: 'top', color: SGHelperStyle.color.SGText.TextWhite, marginHorizontal: w * 0.01 },
            img:{width:w*0.33,height:w*0.1,backgroundColor:'transparent',resizeMode:'contain'},
            imgAppStore:{width:w*0.14,height:w*0.07,resizeMode:'contain',backgroundColor:'transparent'},
            imgPlayStore:{width:w*0.14,height:w*0.07,resizeMode:'contain',backgroundColor:'transparent'}
        });
    }

    constructor(props, context, ...args) {
        super(props, context, ...args);
        this.whp = this.screenWHPNoHeader
        this.text= this.props.text
        this.style = this.createStyleSheet(this.whp,this.text.length);
  
        this._animMovement = new Animated.Value(-this.text.length*5);
        this.textRef = React.createRef()
        this.viewRef = React.createRef()
        this.startAnimateMovement();
    }
    async animMovement (){
        // this._animMovement.setValue(0)
        var dur = (this.text.length*0.3)*1000;
        var toPositionX = (this.text.length*4.4*this.whp.p)*-1

        Animated.loop(
            Animated.timing(this._animMovement, {
                toValue: toPositionX,
                duration: dur,
                useNativeDriver: true,
                easing:Easing.linear
            }),
            {iterations: 86400},
          ).start();    
    }

    async startAnimateMovement() {
        
        setTimeout((()=>{this.animMovement();}).bind(this),100);    

    }

    render() {
        var { w, h, p } = this.whp;
        var style = this.style;
       
        return (
            <View style={{alignItems:'center',height:w*0.2}}>
               <View accessible={true} accessibilityLabel={'ParkingHighlightTopTextView'} style={style.v1}>
                  <Animated.Text ref={this.textRef} style={ [style.text,  {transform: [{ translateX: this._animMovement }]} ]}  >
                      {this.text}
                  </Animated.Text>
               </View>
               <View style={{flexDirection:'row'}}>
                    <View style={{flexDirection:'row',width:w,justifyContent:'flex-start',alignItems:'flex-end'}}>
                        <Image source={{ uri: 'https://spotguestoragelive01.blob.core.windows.net/visitordefaultassets/Spotgue_Logo_and_Name.png' }} style={style.img}></Image>
                        <View style={{marginBottom:2*p}}>
                            <Text preset={Text.preset.h10} style={{alignSelf:'flex-start',marginVertical:0}}>{"Official App of "}</Text>
                            <Text preset={Text.preset.h10} style={{marginVertical:0}}>{ this.props.fBuildingName+" 4.0"}</Text>
                        </View>
                        <Image source={{ uri: 'https://spotguestoragelive01.blob.core.windows.net/visitordefaultassets/logo_playstore.png' }} style={style.imgPlayStore}></Image>
                        <Image source={{ uri: 'https://spotguestoragelive01.blob.core.windows.net/visitordefaultassets/logo_appstore.png'}} style={style.imgAppStore}></Image>
                    </View>
                </View>
            </View>
        );
    }
}
