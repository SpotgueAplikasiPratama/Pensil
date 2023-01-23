import React from 'react';
import { StyleSheet } from 'react-native';
import { SGView as View, SGRootView as RootView, SGScrollView as ScrollView, SGImage as Image, SGText as Text, SGTouchableOpacity as TouchableOpacity, SGButton as Button, SGPicker as Picker, SGDatePicker as DatePicker } from '../../core/control';
import { SGBaseContainer } from '../../core/container/SGBaseContainer';
// import { filter } from 'ramda';

export class DateRangePicker extends SGBaseContainer {
    createStyleSheet = (whp) => {
        var { w, h, p } = whp;
        return StyleSheet.create({
            mainView: { flexDirection: 'row' }
        });
    }

    constructor(props, context, ...args) {
        super(props, context, ...args);
        this.whp = { w: props.style.width, h: props.style.height, p: props.style.padding }
        this.style = this.createStyleSheet(this.whp);
    }

    render() {
        var { w, h, p } = this.whp;
        var style = this.style;
        return (
            <View accessible={true} accessibilityLabel={'DateRangePickerRootView'} style={style.mainView}>
                <DatePicker accessible={true} accessibilityLabel={'DateRangePickerStartDate'} language={this.props.language} shadow onValueChange={(v) => { console.log(v) }} value={new Date(2005, 1, 14)} dateRange={{ start: new Date(1983, 2, 5), end: new Date(2010, 9, 24) }} shadow style={{ backgroundColor: 'white', width: (w - 4 * p) / 2 }} textStyle={{ color: 'black' }} />
                <DatePicker accessible={true} accessibilityLabel={'DateRangePickerEndDate'} language={this.props.language} shadow onValueChange={(v) => { console.log(v) }} value={new Date(2005, 1, 14)} dateRange={{ start: new Date(1983, 2, 5), end: new Date(2010, 9, 24) }} shadow style={{ backgroundColor: 'white', width: (w - 4 * p) / 2 }} textStyle={{ color: 'black' }} />
            </View>
        );
    }
}