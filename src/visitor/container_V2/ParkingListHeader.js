import React from 'react';
import { StyleSheet } from 'react-native';
import { SGBaseContainer } from '../../core/container/SGBaseContainer';
import { SGView as View, SGText as Text, SGIcon as Icon, SGPicker as Picker } from '../../core/control';
import { SGLocalize } from '../locales/SGLocalize';
import { tbLookupDAO } from '../db/tbLookupDAO';
import { VisitorHelper } from '../helper/VisitorHelper';
export class ParkingListHeader extends SGBaseContainer {
    createStyleSheet = (whp) => {
        var { w, h, p } = whp;

        return StyleSheet.create({
            mainView1: { width: w, alignItems: 'flex-end', justifyContent: 'flex-start' },
            containerView1: { flexDirection: 'row', width: w - 2 * p, alignItems: 'flex-start', justifyContent: 'space-between', },
            containerView1_1: { alignItems: 'flex-start', height: w * 0.1 },
            containerView1_2: { justifyContent: 'flex-start', alignItems: 'flex-end', },
            containerView2: { overflow: 'visible', alignSelf: 'flex-end', backgroundColor: 'white', justifyContent: 'space-around', flexDirection: 'row', width: w - 2 * p, paddingVertical: 0.5 * p, paddingHorizontal: 2 * p, borderColor: '#D3D3D3', borderWidth: 0.075 * p, borderRightWidth: 0, borderTopLeftRadius: 2 * p, borderBottomLeftRadius: 2 * p, shadowOpacity: 0.03, marginHorizontal: 0 },
            containerView2_1: { justifyContent: 'flex-start', flexDirection: 'row', width: (w - 2 * p) / 4.5, height: w * 0.1 },
            filterBox: { justifyContent: 'space-around', flexDirection: 'row', backgroundColor: '#FAFAFA', marginTop: w * 0.011, paddingHorizontal: p, height: w * 0.05, borderWidth: w * 0.002, borderRadius: 3, shadowOpacity: 0.03 },
            textFilterBox: { fontSize: w * 0.03, },
            picker: { width: w * 0.315},
            icon1: { fontSize: w * 0.0425, },
            icon2: { fontSize: w * 0.0425 },
            text2: { color: '#7a7a7a' }

        });
    }

    _generateTimeAgo(currentTime) {
        var time = Math.round((((new Date().getTime() - currentTime.getTime()) / 1000) / 60), 0);
        //second
        if (time < 60) {
            var res = SGLocalize.translate("parkingHighlight.lastUpdateTextSecond", { time: time })
        }
        //mins
        else if (time >= 60) {
            var x = (time / 60).toFixed(0);
            var res = SGLocalize.translate("parkingHighlight.lastUpdateTextMinute", { time: x })
        }

        else if (time >= 3600) {
            var x = (time / 3600).toFixed(0);
            var res = SGLocalize.translate("parkingHighlight.lastUpdateTextHour", { time: x })
        }
        return res;
    }

    

    constructor(props, context, ...args) {
        super(props, context, ...args);
        this.whp = { w: props.acceptStyle.width, h: props.acceptStyle.height, p: props.acceptStyle.padding }
        this.style = this.createStyleSheet(this.whp);
        this.parkingTypeData = this.props.parkingTypeData;
        console.log('this.parkingTypeData ')
        // console.log(this.parkingTypeData);
        this.filterOptions = [{ key: 'default', title: VisitorHelper.availabilityLocalize(this.props.language) }];
        this.selectedFilter = 'default';
        for (var i = 0; i < this.parkingTypeData.length; i++) {
            var jsonFilterOption = { key: this.parkingTypeData[i].fValueKey, title: this.parkingTypeData[i].fLanguage[this.props.language] }
            this.filterOptions.push(jsonFilterOption);
        }
    }

    render() {
        this.whp = { w: this.props.acceptStyle.width, h: this.props.acceptStyle.height, p: this.props.acceptStyle.padding }
        this.style = this.createStyleSheet(this.whp);
        var style = this.style;
        var language= this.props.language;
        console.log(language);
        return (
            <View accessible={true} accessibilityLabel={'ParkingListHeaderRootView'} style={style.mainView1}>
                <View accessible={true} accessibilityLabel={'ParkingListHeaderTopView'} style={style.containerView1}>
                    <View accessible={true} accessibilityLabel={'ParkingListHeaderLastUpdView'} style={style.containerView1_1}>
                        <Text accessible={true} accessibilityLabel={'ParkingListHeaderLastUpdText'} preset={Text.preset.titleH4_5} style={style.text2}>{this._generateTimeAgo(this.props.lastUpdated)}</Text>
                    </View>
                    <View accessible={true} accessibilityLabel={'ParkingListHeaderPickerView'} style={style.containerView1_2}>
                        <Picker accessible={true} accessibilityLabel={'ParkingListHeaderOptionPicker'} shadow shadowIntensity={0.2} textPreset={Text.preset.titleH4} single style={style.picker} optionList={this.filterOptions} value={(this.props.selectedParking)} onValueChange={(v) => { this.props.changeParkingFilter(v) }} />
                    </View>
                </View>
            </View>
        );
    }
}
