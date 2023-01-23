import React from 'react';
import { StyleSheet } from 'react-native';
import { SGBaseContainer } from '../../core/container/SGBaseContainer';
import { SGView as View, SGTouchableOpacity as TouchableOpacity, SGText as Text, SGImage as Image } from '../../core/control';
import { SGHelperType, SGHelperNavigation } from '../../core/helper';
import { SGLocalize } from '../locales/SGLocalize';
import image from '../asset/image';

export class MyParkingSpotHistoryCard extends SGBaseContainer {

    createStyleSheet = (whp) => {
        var { w, h, p } = whp;
        return StyleSheet.create({
            mainContainer: {width: w - p * 10, flexDirection: 'row', justifyContent: 'flex-start', backgroundColor: '#323232', borderRadius: p * 3, borderWidth: w * 0.0015, marginVertical: p * 2},
            leftContainer: {maxWidth: w * 0.2, paddingHorizontal: p * 3, justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#323232'},
            parkingFloorNameText: {color: '#FFFFFF', marginTop: p * 3, marginBottom: p * 2},
            line: {width: w * 0.12, borderWidth: w * 0.0035, borderColor: '#7A7A7A'},
            iconCar: {color: '#191919', width: w * 0.15, height: w * 0.15, resizeMode: 'contain', backgroundColor: 'transparent', marginVertical: 0, marginVertical: p * 2},
            rightContainer: {width: (w - p * 10) - w * 0.2, height: w * 0.3, marginLeft: p * 3, justifyContent: 'space-around', alignItems: 'flex-start'},
            detail: {flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'flex-start'},
            keyText: {width: w * 0.265, color: '#FFFFFF', marginHorizontal: 0},
            sepText: {color: '#FFFFFF', marginHorizontal: 0, marginRight: p},
            valueText: {color: '#FFFFFF', marginHorizontal: 0},
        });
    }

    constructor(props, context, ...args) {
        super(props, context, ...args);

        this.whp = { w: props.style.width, h: props.style.height, p: props.style.padding }
        this.style = this.createStyleSheet(this.whp);
        this.state = {
            active: false,
        }
    }

    render() { 
        var { w, h, p } = this.whp;
        var style = this.style;
        var data = this.props.data
        var tR = SGLocalize.translate
        var language = this.props.language.toUpperCase()
        console.log(data);
        return (
            <TouchableOpacity onPress={() => SGHelperNavigation.navigatePush(this.props.navigator, 'MallHome', { contentKey: data.fBuildingKey })}>
                <View accessible={true} accessibilityLabel={'MyParkingSpotHistoryCardRootView'} style={style.mainContainer}>
                    <View accessible={true} accessibilityLabel={'MyParkingSpotHistoryCarView1'} style={style.leftContainer}>
                        <Text accessible={true} accessibilityLabel={'MyParkingSpotHistoryParkirName'} preset={Text.preset.titleH3B} style={style.parkingFloorNameText}>{data.fParkingJSON['fParkirName' + language]}</Text>
                        <View accessible={true} accessibilityLabel={'MyParkingSpotHistoryCardLineView'} style={style.line}></View>
                        <Image accessible={true} accessibilityLabel={'MyParkingSpotHistoryCardImage'} source={{ uri: image.myParkingGoldIcon[this.props.imageSetting].url }} style={style.iconCar}></Image>
                    </View>
                    <View accessible={true} accessibilityLabel={'MyParkingSpotHistoryCarView2'} style={style.rightContainer}>
                        <View accessible={true} style={style.detail}>
                            <Text accessible={true} accessibilityLabel={'MyParkingSpotHistoryPlaceName'} preset={Text.preset.titleH4_5B} style={style.keyText}>{tR('MyParkingSpotWithLayoutScreen.PlaceName')}</Text>
                            <Text accessible={true} accessibilityLabel={'MyParkingSpotHistoryCardText1'} preset={Text.preset.titleH4_5B} style={style.sepText}>:</Text>
                            <Text accessible={true} accessibilityLabel={'MyParkingSpotHistoryCardTextPlaceName'} preset={Text.preset.titleH4_5B} style={style.valueText}>{data.fParkingJSON['fBuildingName' + language]}</Text>
                        </View>
                        <View accessible={true} style={style.detail}>
                            <Text accessible={true} accessibilityLabel={'MyParkingSpotHistoryParkingLocation'} preset={Text.preset.titleH4_5B} style={style.keyText}>{tR('MyParkingSpotWithLayoutScreen.ParkingLocation')}</Text>
                            <Text accessible={true} accessibilityLabel={'MyParkingSpotHistoryCardText2'} preset={Text.preset.titleH4_5B} style={style.sepText}>:</Text>
                            <Text accessible={true} accessibilityLabel={'MyParkingSpotHistoryCardTextParkirName'} preset={Text.preset.titleH4_5B} style={style.valueText}>{data.fParkingJSON['fParkirName' + language]}, {data.fParkingJSON.fLocation}</Text>
                        </View>
                        <View accessible={true} style={style.detail}>
                            <Text accessible={true} accessibilityLabel={'MyParkingSpotHistoryVehicleNumb'} preset={Text.preset.titleH4_5B} style={style.keyText}>{tR('MyParkingSpotWithLayoutScreen.VehicleNumber')}</Text>
                            <Text accessible={true} accessibilityLabel={'MyParkingSpotHistoryCardText3'} preset={Text.preset.titleH4_5B} style={style.sepText}>:</Text>
                            <Text accessible={true} accessibilityLabel={'MyParkingSpotHistoryCardTextPlateNumb'} preset={Text.preset.titleH4_5B} style={style.valueText}>{data.fParkingJSON.fPlate}</Text>
                        </View>
                        <View accessible={true} style={style.detail}>
                            <Text accessible={true} accessibilityLabel={'MyParkingSpotHistoryCheckIn'} preset={Text.preset.titleH4_5B} style={style.keyText}>{tR('MyParkingSpotWithLayoutScreen.CheckIn')}</Text>
                            <Text accessible={true} accessibilityLabel={'MyParkingSpotHistoryCardText4'} preset={Text.preset.titleH4_5B} style={style.sepText}>:</Text>
                            <Text accessible={true} accessibilityLabel={'MyParkingSpotHistoryCardTextDateCheckIn'} preset={Text.preset.titleH4_5B} style={style.valueText}>{SGHelperType.formatTime(SGHelperType.convertNewDate(data.fCheckInDate), language)}</Text>
                        </View>
                        <View accessible={true} style={style.detail}>
                            <Text accessible={true} accessibilityLabel={'MyParkingSpotHistoryCheckOut'} preset={Text.preset.titleH4_5B} style={style.keyText}>{tR('MyParkingSpotWithLayoutScreen.CheckOut')}</Text>
                            <Text accessible={true} accessibilityLabel={'MyParkingSpotHistoryCardText5'} preset={Text.preset.titleH4_5B} style={style.sepText}>:</Text>
                            <Text accessible={true} accessibilityLabel={'MyParkingSpotHistoryCardTextDateCheckOut'} preset={Text.preset.titleH4_5B} style={style.valueText}>{SGHelperType.formatTime(SGHelperType.convertNewDate(data.fCheckOutDate), language)}</Text>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        );
    }
}
