import React from 'react';
import { Dimensions } from 'react-native';
import { SGBaseContainer } from '../../core/container/SGBaseContainer';
import { SGView as View, SGText as Text, SGTouchableOpacity as TouchableOpacity, SGImage as Image,SGIcon as Icon } from '../../core/control';
import { StyleSheet } from 'react-native';
import { SGLocalize } from '../locales/SGLocalize';
import { SGHelperNavigation } from '../../core/helper';

export class ParkingLayoutHeader extends SGBaseContainer {
    createStyleSheet = (whp) => {
        var { w, h, p } = whp;
        return StyleSheet.create({
            header: { width: w, paddingLeft: p * 4, paddingRight: p * 4, flexDirection: 'row', justifyContent: 'space-between', backgroundColor: '#FFFFFF', paddingVertical: p },
            textTitle:{color:'#737373'}
          
        });
    }
    componentDidMount(){
        this.interval = setInterval(() => {
            this.forceUpdate()
          
        }, 5000);
    }
 
    _resetTimes(){
        this.startTimes = this.props.startTimes
        this.endTimes = new Date()
        this.differencesTimes =   Math.trunc((this.endTimes - this.startTimes)/1000)
       
        this.timeString = this._changeHourString(this.differencesTimes)
        this.timeDifference =  this._constructTime(this.differencesTimes)
        // this.forceUpdate()
    //    console.log(this.timeDifference)
    }
    componentWillUnmount() {
        clearInterval(this.interval);
    }
    _constructTime(time){
        // 
        var convertTime = 60
        if (time<3600)convertTime= 60
        else if(time<86400) convertTime= 3600
        else if(time<604800) convertTime = 86400
        else if(time<2592000) convertTime = 604800
        
        return Math.trunc(time / convertTime)
    }
    _changeHourString(diffenceMinutes){
     
        if(diffenceMinutes<3600) return "Minute"
        else if(diffenceMinutes<86400) return "Hour"
        else if (diffenceMinutes<2592000) return "Day"
    }
    constructor(props, context, ...args) {
        super(props, context, ...args);
        this.whp = { w: props.style.width, h: props.style.height, p: props.style.padding }
        this.style = this.createStyleSheet(this.whp);
        // this._resetTimes()
        // this.startTimes= new Date()
        // this.endTimes = new Date()
        // this.differencesTimes = Math.trunc((this.endTimes - this.startTimes)/1000)
       
        // this.timeString = this._changeHourString(this.differencesTimes)
        // this.timeDifference =  this._constructTime(this.differencesTimes)
        // console.log(this.timeDifference)
    }
    
   

    render() {
        var { w, h, p } = this.whp;
        var style = this.style;

        var tR = SGLocalize.translate
        this._resetTimes()
        return (
            
               <View accessible={true} accessibilityLabel={'ParkingHighlightTopTextView'}>
                    <Text accessible={true} accessibilityLabel={'ParkingHighlightTitleText'} style={style.textTitle} preset={Text.preset.titleH4_5B}>{tR("AvailableParkir.LastUpdated"+this.timeString, { count: this.timeDifference })}</Text>
                </View>
                
        );
    }
}
