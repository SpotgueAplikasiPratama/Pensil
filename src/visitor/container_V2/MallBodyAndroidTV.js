import React from 'react';
import { SGBaseContainer } from '../../core/container/SGBaseContainer';
import { SGView as View, SGText as Text, SGImage as Image,SGIcon as Icon ,SGTouchableOpacity as TouchableOpacity} from '../../core/control';
import { StyleSheet } from 'react-native';

import { SGHelperNavigation, SGHelperType } from '../../core/helper';
import { ParkingHeaderAndroidTV } from './ParkingHeaderAndroidTV';
export class MallBodyAndroidTV extends SGBaseContainer {
    createStyleSheet = (whp) => {
        var { w, h, p } = whp;
        return StyleSheet.create({
            v1:{width:w,height:p,padding:p},
         
        });
    }

    constructor(props, context, ...args) {
        super(props, context, ...args);
        this.whp = this.screenWHPNoHeader
        this.style = this.createStyleSheet(this.whp);
        
    }
   
    render() {
        var { w, h, p } = this.whp;
        var style = this.style;
        // var data = this.props.data
        var language=this.props.language.toUpperCase()
        var imageSetting=this.props.imageSetting
        var data=this.props.parkingData
        console.log(data)
        console.log(language)
        return (
               <View accessible={true} accessibilityLabel={'ParkingHighlightTopTextView'} style={{width:w-4*p,borderTopWidth:1,borderColor:'rgb(228,228,228)'}}>
                   <View style={{width:w,alignItems:'flex-start',paddingLeft:3*p}}>

                        <Text preset={Text.preset.h1B}>{data['fParkirName'+language]}</Text>
                   </View>
 
                  
                </View>
                
        );
    }
}
