/**
 * Version1.4.4
 * 1.Yohanes 13 Agustus 2021
 * - add new Component
 */
import React from 'react';
import { SGBaseContainer } from '../../core/container/SGBaseContainer';
import { SGView as View,SGText as Text, SGImage as Image, SGIcon as Icon } from '../../core/control';
import { StyleSheet } from 'react-native';
import { SGHelperGlobalVar, SGHelperNavigation,SGHelperType } from '../../core/helper';
import ImageAssets from '../asset/image';
import { SGLocalize } from '../locales/SGLocalize';

import { ScrollView } from 'react-native-gesture-handler';
export class ParkingStatusDescription extends SGBaseContainer {
    createStyleSheet = (whp) => {
        var { w, h, p } = whp;
        return StyleSheet.create({
            iconView:{width:w, borderColor: 'white', borderBottomWidth: 0.005 * w},
            parkingStatusContainer: {  alignItems:'flex-start',flexGrow:1,marginVertical:2*p,marginHorizontal:2*p},
            statusContainer: { minWidth: w * 0.195, height: w * 0.15, justifyContent: 'flex-start', borderRadius: p * 2, backgroundColor: '#FFFFFF', borderColor: '#E6E6E6', borderWidth: w * 0.005,marginHorizontal:2*p },
            availableLeftContainer: { minWidth: w * 0.195, height: w * 0.085, backgroundColor: '#59B990' },
            fullLeftContainer: { minWidth: w * 0.195, height: w * 0.085, backgroundColor: '#D44E48' },
            myLeftContainer: { minWidth: w * 0.195, height: w * 0.085, backgroundColor: '#FADD4B' },
            blackContrainer: { minWidth: w * 0.195, height: w * 0.085, backgroundColor: '#808080' },
            numberTextAvailable: { color: '#59B990', textAlign: 'center' },
            numberTextFull: { color: '#D44E48', textAlign: 'center' },
            numberTextLeft: { color: '#FADD4B', textAlign: 'center' },
            numberTextOffline: { color: '#808080', textAlign: 'center' },
            
            statusRightContainer: { width: w * 0.2, justifyContent: 'flex-start' },
        });
    }
    constructor(props, context, ...args) {
        super(props, context, ...args);
        this.whp = { w: props.style.width, h: props.style.height, p: props.style.padding }
        this.style = this.createStyleSheet(this.whp);
        this.imageSetting = SGHelperGlobalVar.getVar('GlobalImageSetting');
    }


    render() {

        var { w, h, p } = this.whp;
        var imageSetting= SGHelperGlobalVar.getVar('GlobalImageSetting');
        var style = this.style;
        var tR=SGLocalize.translate
        var mySpot= this.props.mySpot
        var available=this.props.available
        var full = this.props.full
        var offline =this.props.offline
        var data = this.props.data
        return (
                <View style={style.iconView}>

                    <ScrollView accessible={true} accessibilityLabel={'ParkingLayoutFullScreenContainerView3'} contentContainerStyle={style.parkingStatusContainer} horizontal showsHorizontalScrollIndicator={false}>
                    {
                        data.available>0 &&
                        <View accessible={true} accessibilityLabel={'ParkingLayoutFullScreenStatusView'} style={style.statusContainer}>
                            <View accessible={true} accessibilityLabel={'ParkingLayoutFullScreenGStatusView'} style={style.availableLeftContainer}>
                                <Text accessible={true} accessibilityLabel={'ParkingLayoutFullScreenGAvailable'} preset={Text.preset.titleH4B} style={{ color: 'white' }}>{tR('ParkingLayoutFullScreen.Available')}</Text>
                            </View>
                            <Text accessible={true} accessibilityLabel={'ParkingLayoutFullScreenGNumber'} preset={Text.preset.titleH4B} style={style.numberTextAvailable}>{data.available}</Text>
                        </View>
                    }
                    {
                        data.full> 0 && 
                        <View accessible={true} accessibilityLabel={'ParkingLayoutFullScreenStatusView2'} style={style.statusContainer}>
                            <View accessible={true} accessibilityLabel={'ParkingLayoutFullScreenRStatusView'} style={style.fullLeftContainer}>
                                <Text accessible={true} accessibilityLabel={'ParkingLayoutFullScreenRFull'} preset={Text.preset.titleH4B} style={{ color: 'white' }}>{tR('ParkingLayoutFullScreen.Full')}</Text>
                            </View>
                            <Text accessible={true} accessibilityLabel={'ParkingLayoutFullScreenRNumber'} preset={Text.preset.titleH4B} style={style.numberTextFull}>{data.full}</Text>
                        </View>
                    }
                    {
                        data.mySpot>0 &&
                        <View accessible={true} accessibilityLabel={'ParkingLayoutFullScreenStatusView3'} style={style.statusContainer}>
                            <View accessible={true} accessibilityLabel={'ParkingLayoutFullScreenPStatusView'} style={style.myLeftContainer}>
                                <Text accessible={true} accessibilityLabel={'ParkingLayoutFullScreenPMySpot'} preset={Text.preset.titleH4B} style={{ color: 'white' }}>{tR('ParkingLayoutFullScreen.MySpot')}</Text>
                            </View>
                            <Text accessible={true} accessibilityLabel={'ParkingLayoutFullScreenPNumber'} preset={Text.preset.titleH4B} style={style.numberTextLeft}>{data.mySpot}</Text>
                        </View>
                    }
                    {
                        data.offline>0 &&
                        <View accessible={true} accessibilityLabel={'ParkingLayoutFullScreenStatusView3'} style={style.statusContainer}>
                            <View accessible={true} accessibilityLabel={'ParkingLayoutFullScreenPStatusView'} style={style.blackContrainer}>
                                <Text accessible={true} accessibilityLabel={'ParkingLayoutFullScreenPMySpot'} preset={Text.preset.titleH4B} style={{ color: 'white' }}>{tR('ParkingLayoutFullScreen.Offline')}</Text>
                            </View>
                            <Text accessible={true} accessibilityLabel={'ParkingLayoutFullScreenPNumber'} preset={Text.preset.titleH4B} style={style.numberTextOffline}>{data.offline}</Text>
                        </View>
                    }
                    </ScrollView> 
                    
    
                  
                </View>
        );
    }
}
