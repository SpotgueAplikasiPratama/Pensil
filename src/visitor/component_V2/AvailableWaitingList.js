import React from 'react';
import { Dimensions } from 'react-native';
import { SGBaseContainer } from '../../core/container/SGBaseContainer';
import { SGView as View, SGText as Text, SGTouchableOpacity as TouchableOpacity, SGImage as Image,SGIcon as Icon } from '../../core/control';
import { StyleSheet } from 'react-native';
import { SGLocalize } from '../locales/SGLocalize';
import { SGHelperNavigation } from '../../core/helper';

export class AvailableWaitingList extends SGBaseContainer {
    createStyleSheet = (whp) => {
        var { w, h, p } = whp;
        return StyleSheet.create({
            header: { backgroundColor: '#FFFFFF', paddingVertical: p },

          
        });
    }
    componentDidMount(){
        this.interval = setInterval(() => {
           this.endTimes = new Date()
           this.differencesTimes =   Math.trunc((this.endTimes - this.startTimes)/1000)
          
           this.timeString = this._changeHourString(this.differencesTimes)
           this.timeDifference =  this._constructTime(this.differencesTimes)
           this.forceUpdate()
        //   console.log(this.timeDifference)
        }, 5000);
    }
    componentWillUnmount() {
        clearInterval(this.interval);
      }
      _constructTime(time){
          console.log("_constructTime")
        console.log(time)
        var convertTime = 60
        if (time<3600)convertTime= 60
        else if(time<86400) convertTime= 3600
        else if(time<604800) convertTime = 86400
        else if(time<2592000) convertTime = 604800
        
        return Math.trunc(time / convertTime)
    }
    _changeHourString(diffenceMinutes){
        console.log("_changeHourString")
        console.log(diffenceMinutes)
         if(diffenceMinutes<3600) return "Minute"
        else if(diffenceMinutes<86400) return "Hour"
        else if (diffenceMinutes<2592000) return "Day"
    }
    constructor(props, context, ...args) {
        super(props, context, ...args);
        this.whp = { w: props.style.width, h: props.style.height, p: props.style.padding }
        this.style = this.createStyleSheet(this.whp);
        this.startTimes= new Date()
        this.endTimes = new Date()
        this.differencesTimes = Math.trunc((this.endTimes - this.startTimes)/1000)
       
        this.timeString = this._changeHourString(this.differencesTimes)
        this.timeDifference =  this._constructTime(this.differencesTimes)
        console.log(this.timeDifference)
    }
    
   

    render() {
        var { w, h, p } = this.whp;
        var style = this.style;

        var tR = SGLocalize.translate
        return (
            
               <View accessible={true} accessibilityLabel={'RestoWaitingListHighlightTopTextView'} style={style.header}>
                    {/* <Text accessible={true} accessibilityLabel={'RestoWaitingListHighlightTitleText'} style={{ color: '#000000' }} preset={Text.preset.heading7B}>{SGLocalize.translate("parkingHighlight.title")}</Text> */}
                    <Text accessible={true} accessibilityLabel={'RestoWaitingListHighlightTitleText'} style={style.textTitle} preset={Text.preset.titleH6}>{tR("AvailableParkir.LastUpdated"+this.timeString, { count: this.timeDifference })}</Text>
                </View>
                
        );
    }
}
