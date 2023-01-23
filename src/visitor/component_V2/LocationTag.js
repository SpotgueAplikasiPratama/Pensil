import React from "react";
import { StyleSheet } from "react-native";
import { SGView as View, SGText as Text, SGImage as Image } from "../../core/control";
import { SGBaseContainer } from '../../core/container/SGBaseContainer';
import { SGHelperStyle } from '../../core/helper';
import image from '../asset/image';
import { SGLocalize } from "../locales/SGLocalize";

export class LocationTag extends SGBaseContainer {

    createStyleSheet() {
        var { w, h, p } = this._screenWHP;
        if (this.props.style) {
            if (this.props.style.width) w = this.props.style.width;
            if (this.props.style.height) h = this.props.style.height;
            if (this.props.style.padding) p = this.props.style.padding;
        }
        return StyleSheet.create({
            tag:{ width: w, backgroundColor: '#191919', alignItems: 'center', paddingVertical: p * 2, paddingHorizontal: p * 2, borderRadius: p * 2},
            floorText: {color: '#FFFFFF', textAlign: 'center', marginBottom: p},
            hintText: {color: '#FFFFFF', textAlign: 'center'}
        });
    }

    constructor(props, context, ...args) {
        super(props, context, ...args);
        this.style = this.createStyleSheet();

    }

    convertDate(startDate, endDate) {
        var months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
        if (startDate === endDate) {
            var fullDate = new Date(startDate);
            var month = months[fullDate.getMonth()];
            var date = fullDate.getDate();
            var fullDateResult = date + ' ' + month;
            return (fullDateResult);
        } else {
            var dateInterval = [startDate, endDate];
            var fullDateIntervalResult = '';
            for (var i = 0; i < dateInterval.length; i++) {
                var fullDate = new Date(dateInterval[i]);
                var month = months[fullDate.getMonth()];
                var date = fullDate.getDate();
                var fullDateResult = date + ' ' + month;
                fullDateIntervalResult = (i === 0) ? fullDateResult : (fullDateIntervalResult + ' - ' + fullDateResult)
            }
            return (fullDateIntervalResult);
        }
    }

    render() {
        var style = this.style;
        this.style.tag = SGHelperStyle.appendStyle(this.style.tag, this.props.style);
        return (
            <View accessible={true} style={style.tag}>
                <Text accessible={true} accessibilityLabel={'LocationTagFloorLocation'} preset={this.props.textHintPreset ? Text.preset[this.props.textHintPreset] : Text.preset.titleH2B} style={style.floorText}>{SGLocalize.translate('LocationTag.labelLocation')} {this.props.floorLocation}</Text>
                <Text accessible={true} accessibilityLabel={'LocationTagLocationHintText'} preset={this.props.textLocationPreset ? Text.preset[this.props.textLocationPreset] : Text.preset.titleH4B} style={style.hintText}>{this.props.locationHint}</Text>
            </View>
        );
    }
}

