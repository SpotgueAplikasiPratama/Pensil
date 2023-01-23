import React from "react";
import { StyleSheet } from "react-native";
import { SGView as View, SGText as Text, SGImage as Image } from "../../core/control";

import { SGBaseContainer } from '../../core/container/SGBaseContainer';
import { SGHelperStyle, SGHelperType } from '../../core/helper';
import image from '../asset/image';
import { SGLocalize } from "../locales/SGLocalize";

export class DateTag extends SGBaseContainer {

    createStyleSheet() {
        var { w, h, p } = this._screenWHP;
        if (this.props.style) {
            if (this.props.style.width) w = this.props.style.width;
            if (this.props.style.height) h = this.props.style.height;
            if (this.props.style.padding) p = this.props.style.padding;
        }
        return StyleSheet.create({
            // tag: { alignSelf: 'flex-end', width: (this.props.tagWidth) ? w * this.props.tagWidth : w * 0.35, height: w * 0.15, marginRight: -2 * p, resizeMode: 'stretch', backgroundColor: 'transparent', alignItems: 'center', justifyContent: 'center', transform: this.props.leftMode ? [{ rotate: '180deg' }] : [{ rotate: '0deg' }] },
            // title: { color: '#ffffff', textAlign: 'center', transform: this.props.leftMode ? [{ rotate: '180deg' }] : [{ rotate: '0deg' }] }
            dateContainer: {width: (this.props.tagWidth) ? w * this.props.tagWidth : w * 0.4, height: w * 0.087, backgroundColor: '#000000', marginTop: p * 0.5, borderTopLeftRadius: p * 3, borderBottomLeftRadius: p * 3, flexDirection: 'row', justifyContent: 'center', alignItems: 'center'},
            dateText: {color: '#FFFFFF'}
        });
    }

    constructor(props, context, ...args) {
        super(props, context, ...args);
        this.style = this.createStyleSheet();

    }

    convertDate(startDate, endDate) {
        var months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
        if (startDate === endDate) {
            var fullDate = SGHelperType.convertNewDate(startDate);
            var month = months[fullDate.getMonth()];
            var date = fullDate.getDate();
            var fullDateResult = date + ' ' + month;
            return (fullDateResult);
        } else {
            var dateInterval = [startDate, endDate];
            var fullDateIntervalResult = '';
            for (var i = 0; i < dateInterval.length; i++) {
                var fullDate = SGHelperType.convertNewDate(dateInterval[i]);
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
        this.style.dateContainer = SGHelperStyle.appendStyle(this.style.dateContainer, this.props.style);
        var data = this.props.data;
        var imageSetting = this.props.imageSetting ? this.props.imageSetting : 'med'
        var language = this.props.language;
        return (
            <View accessible={true} style={style.dateContainer}>
                <Text accessible={true} accessibilityLabel={'DateTagText'} preset={Text.preset.titleH4B} style={style.dateText}>{SGHelperType.isDefined(data) ? SGHelperType.formatDate(SGHelperType.convertNewDate(new Date(data)), language) : this.convertDate(this.props.startDate, this.props.endDate)}</Text>
            </View>
        );
    }
}

