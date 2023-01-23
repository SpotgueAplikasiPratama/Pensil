/**
 * create custom datepicker component using SGDrumRoll with behavior
 * 1. format yyyy|mmm|dd
 * 2. dateRange : {start:,end:} -> min and max date
 * 3. value prop as UTCDate format 
 * 4. onValueChange event 
 * 5. hidden true|false
 * 6. disabled true|false
 * 7. shadow true|false with prop shadowIntensity from 0.0 to 1.0
 * 8. show DrumRoll in PopUp view 
 * 9. language property ID|EN|CN
 * 10. user can customize textStyle prop and textPreset prop
 * 11. stateless true|false
 * 12. darkMode true|false
 */

import React from 'react';
import { SGDatePicker as labels } from '../locale/lang.json';
import { StyleSheet } from 'react-native';
import { SGView } from './SGView';
import { SGPopView } from './SGPopView';
import { SGText } from './SGText';
import { SGBaseControl } from '../../core/control/SGBaseControl';
import { SGTouchableOpacity } from './SGTouchableOpacity';
import { SGHelperType, SGHelperStyle, SGHelperWindow } from '../helper';
import { SGDrumRoll } from './SGDrumRoll';
import { SGImage } from './SGImage'
import { SGImageButton } from './SGImageButton'
import { SGPicker } from '.';
export class SGDatePicker extends SGBaseControl {

    get Value() {
        return this._value;
    }

    getFormattedValue() {
        return SGHelperType.formatDate(this._value, this._lang);
    }

    onShowHandler() {
        SGPopView.showPopView(this.pvID);
    }

    onHideHandler() {
        SGPopView.hidePopView(this.pvID);
    }

    setupYear() {
        var arr = [];
        var start = this._dateStart.getFullYear();
        var end = this._dateEnd.getFullYear();
        for (var i = start; i <= end; i++) {
            arr.push({ key: i, title: i });
        }
        this._yearData = arr;
    }

    setupMonth() {
        this._monthData = this.labels[this._lang].month;
    }

    setupDate() {
        var dt = new Date(this._year, this._month, 0);
        var arr = [];
        for (var i = 1; i <= dt.getDate(); i++) {
            arr.push({ key: i, title: i });
        }
        this._lastDateOfMonth = dt.getDate();
        this._dateData = arr;
    }

    resetDate() {
        var dt = new Date(this._year, this._month, 0)
        if (this._lastDateOfMonth !== dt.getDate()) {
            this.setupDate();
            this._date = Math.min(this._date, dt.getDate());
        }
    }

    validateMonth() {
        if (SGHelperType.isDefined(this.props.dateRange)) {
            //validateMin
            if (SGHelperType.isDefined(this.props.dateRange.start)) {
                if (this._year === this._dateStart.getFullYear() && this._month < this._dateStart.getMonth() + 1) {
                    this._month = this._dateStart.getMonth() + 1;
                }
            }
            //validateMax
            if (SGHelperType.isDefined(this.props.dateRange.end)) {
                if (this._year === this._dateEnd.getFullYear() && this._month > this._dateEnd.getMonth() + 1) {
                    this._month = this._dateEnd.getMonth() + 1;
                }
            }
        }
    }

    validateDate() {
        if (SGHelperType.isDefined(this.props.dateRange)) {
            //validateMin
            if (SGHelperType.isDefined(this.props.dateRange.start)) {
                if (this._year === this._dateStart.getFullYear() && this._month === this._dateStart.getMonth() + 1 && this._date < this._dateStart.getDate()) {
                    this._date = this._dateStart.getDate();
                }
            }
            //validateMax
            if (SGHelperType.isDefined(this.props.dateRange.end)) {
                if (this._year === this._dateEnd.getFullYear() && this._month === this._dateEnd.getMonth() + 1 && this._date > this._dateEnd.getDate()) {
                    this._date = this._dateEnd.getDate();
                }
            }
        }
    }

    onYearChangeHandler(v) {
        this._year = v;
        this.validateMonth();
        this.resetDate();
        this.validateDate();
        this.updateValue();
    }

    onMonthChangeHandler(v) {
        this._month = v;
        this.validateMonth();
        this.resetDate();
        this.validateDate();
        this.updateValue();
    }

    onDateChangeHandler(v) {
        this._date = v;
        this.validateDate();
        this.updateValue();
    }

    static preset = {
        default: 'default',
        disabled: 'disabled',
    }
    static _presetProps = {};
    static _isPresetInit = false;
    static _initPreset() {
        if (!SGDatePicker._isPresetInit) {
            var { w, h, p } = SGHelperWindow.getWHPNoHeader();
            SGDatePicker._presetProps = {
                light: {
                    default: StyleSheet.create({
                        v1: { width: w - 8 * p, marginVertical: 2 * p, paddingVertical: 0, borderRadius: 2 * p, borderColor: SGHelperStyle.color.SGDatePicker.Border, borderWidth: p / 4, backgroundColor: SGHelperStyle.color.SGDatePicker.BGWhite },
                        v2: { width: '100%', flexDirection: 'row', justifyContent: 'space-between', paddingLeft: 3 * p, paddingRight: 0, paddingVertical: 0, },
                        pv1: { padding: 4 * p,paddingTop:2*p, backgroundColor: SGHelperStyle.color.SGDatePicker.PVBGBlack, width: w, height: h * 0.5, borderTopLeftRadius: 5 * p, borderTopRightRadius: 5 * p, },
                        t1: {marginVertical:0, paddingVertical:3*p, flex: 1, color: SGHelperStyle.color.SGDatePicker.TextBlack },
                        v3: { width: '100%', flexDirection: 'row', justifyContent: 'space-around', marginBottom: SGHelperWindow.getFooterHeight() },
                        dr1: { width: w / 4, height: w / 3, backgroundColor: SGHelperStyle.color.SGDatePicker.BGTransparent },
                        text1: { alignSelf: 'flex-start', color: SGHelperStyle.color.SGDatePicker.TextWhite },
                        to1: { backgroundColor: SGHelperStyle.color.SGDatePicker.PVBGWhite, width: w * 0.14, height: w * 0.009, marginVertical: 2 * p, borderRadius: 5 * p },
                        fv: { width: w - 8 * p, height: w * 0.115, backgroundColor: SGHelperStyle.color.SGDatePicker.PVDRDarkGrey, borderRadius: 3 * p, position: 'absolute', top: w * (1 / 3 - 0.115) / 2, left: 0 },
                    }),
                    disabled: StyleSheet.create({
                        v1: { width: w - 8 * p, marginVertical: 2 * p, paddingVertical: 0, borderRadius: 2 * p, borderColor: SGHelperStyle.color.SGDatePicker.Border, borderWidth: p / 4, backgroundColor: SGHelperStyle.color.SGDatePicker.BGDisabled },
                        v2: { width: '100%', flexDirection: 'row', justifyContent: 'space-between', paddingLeft: 3 * p, paddingRight: 0, paddingVertical: 0 },
                        pv1: { padding: 4 * p,paddingTop:2*p, backgroundColor: SGHelperStyle.color.SGDatePicker.PVBGBlack, width: w, height: h * 0.5, borderTopLeftRadius: 5 * p, borderTopRightRadius: 5 * p, },
                        t1: { marginVertical:0, paddingVertical:3*p, flex: 1, color: SGHelperStyle.color.SGDatePicker.TextDisabled },
                        v3: { width: '100%', flexDirection: 'row', justifyContent: 'space-around', marginBottom: SGHelperWindow.getFooterHeight() },
                        dr1: { width: w / 4, height: w / 3, backgroundColor: SGHelperStyle.color.SGDatePicker.BGTransparent },
                        text1: { alignSelf: 'flex-start', color: SGHelperStyle.color.SGDatePicker.TextWhite },
                        to1: { backgroundColor: SGHelperStyle.color.SGDatePicker.PVBGWhite, width: w * 0.14, height: w * 0.009, marginVertical: 2 * p, borderRadius: 5 * p },
                        fv: { width: w - 8 * p, height: w * 0.115, backgroundColor: SGHelperStyle.color.SGDatePicker.PVDRDarkGrey, borderRadius: 3 * p, position: 'absolute', top: w * (1 / 3 - 0.115) / 2, left: 0 },
                    }),
                },
                dark: {
                    default: StyleSheet.create({
                        v1: { width: w - 8 * p, marginVertical: 2 * p, paddingVertical: 0, borderRadius: 2 * p, borderColor: SGHelperStyle.color.SGDatePicker.Border, borderWidth: p / 4, backgroundColor: SGHelperStyle.color.SGDatePicker.BGWhite },
                        v2: { width: '100%', flexDirection: 'row', justifyContent: 'space-between', paddingLeft: 3 * p, paddingRight: 0, paddingVertical: 0 },
                        pv1: { padding: 4 * p,paddingTop:2*p, backgroundColor: SGHelperStyle.color.SGDatePicker.PVBGWhite, width: w, height: h * 0.5, borderTopLeftRadius: 5 * p, borderTopRightRadius: 5 * p, },
                        t1: { marginVertical:0, paddingVertical:3*p, flex: 1, color: SGHelperStyle.color.SGDatePicker.TextBlack },
                        v3: { width: '100%', flexDirection: 'row', justifyContent: 'space-around', marginBottom: SGHelperWindow.getFooterHeight() },
                        dr1: { width: w / 4, height: w / 3, backgroundColor: SGHelperStyle.color.SGDatePicker.BGTransparent },
                        text1: { alignSelf: 'flex-start', color: SGHelperStyle.color.SGDatePicker.TextBlack },
                        to1: { backgroundColor: SGHelperStyle.color.SGDatePicker.PVBGBlack, width: w * 0.14, height: w * 0.009, marginVertical: 2 * p, borderRadius: 5 * p },
                        fv: { width: w - 8 * p, height: w * 0.115, backgroundColor: SGHelperStyle.color.SGDatePicker.PVDRLightGrey, borderRadius: 3 * p, position: 'absolute', top: w * (1 / 3 - 0.115) / 2, left: 0 },
                    }),
                    disabled: StyleSheet.create({
                        v1: { width: w - 8 * p, marginVertical: 2 * p, paddingVertical: 0, borderRadius: 2 * p, borderColor: SGHelperStyle.color.SGDatePicker.Border, borderWidth: p / 4, backgroundColor: SGHelperStyle.color.SGDatePicker.BGDisabled },
                        v2: { width: '100%', flexDirection: 'row', justifyContent: 'space-between', paddingLeft: 3 * p, paddingRight: 0, paddingVertical: 0 },
                        pv1: { padding: 4 * p,paddingTop:2*p, backgroundColor: SGHelperStyle.color.SGDatePicker.PVBGBlack, width: w, height: h * 0.5, borderTopLeftRadius: 5 * p, borderTopRightRadius: 5 * p, },
                        t1: { marginVertical:0, paddingVertical:3*p, flex: 1, color: SGHelperStyle.color.SGDatePicker.TextDisabled },
                        v3: { width: '100%', flexDirection: 'row', justifyContent: 'space-around', marginBottom: SGHelperWindow.getFooterHeight() },
                        dr1: { width: w / 4, height: w / 3, backgroundColor: SGHelperStyle.color.SGDatePicker.BGTransparent },
                        text1: { alignSelf: 'flex-start', color: SGHelperStyle.color.SGDatePicker.TextWhite },
                        to1: { backgroundColor: SGHelperStyle.color.SGDatePicker.PVBGWhite, width: w * 0.14, height: w * 0.009, marginVertical: 2 * p, borderRadius: 5 * p },
                        fv: { width: w - 8 * p, height: w * 0.115, backgroundColor: SGHelperStyle.color.SGDatePicker.PVDRLightGrey, borderRadius: 3 * p, position: 'absolute', top: w * (1 / 3 - 0.115) / 2, left: 0 },
                    }),
                },
            };
            SGDatePicker._isPresetInit = true;
        }
    }
    constructor(props, context, ...args) {
        super(props, context, ...args);
        this.labels = labels;
        SGDatePicker._initPreset();
        this.pvID = SGPopView.getPopViewID();
    }
    _constructEOD(){
        if(this.props.timeEOD)this._value = new Date(this._year, this._month - 1, this._date,23,59,59,999)
        else this._value = new Date(this._year, this._month - 1, this._date,0,0,0,0)

    }
    updateValue() {
        this._constructEOD()
        // this._value = new Date(this._year, this._month - 1, this._date)
        this._day = this._getDay(this._value.getDay())
        if (this.props.onValueChange) {
            this.props.onValueChange(this._value);
        }
        if (!this.props.stateless) { super.mySetState({ value: this._value, date: this._date, month: this._month, year: this._year }); }
    }

    initProps() {
        if (super.isPropsNeedInitOrChanged(this.props)) {
            var isDef = SGHelperType.isDefined;
            this._dateStart = new Date(1900, 0, 1, 0, 0, 0);
            this._dateEnd = new Date();
            if (isDef(this.props.dateRange)) {
                if (isDef(this.props.dateRange.start)) {
                    this._dateStart = SGHelperType.dateValue(this.props.dateRange.start);
                }
                if (isDef(this.props.dateRange.end)) {
                    this._dateEnd = SGHelperType.dateValue(this.props.dateRange.end);
                }
            }
            this._lang = this.props.language ? this.props.language : 'ID';
            this._lastDateOfMonth = 0;
            this.setupYear();
            this.setupMonth();
        }
    }
    _getDay(indexDay){
        var ID=["Minggu","Senin","Selasa","Rabu","Kamis","Jumat","Sabtu"]
        var EN=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"]
        var CN=["星期天","星期一","星期二","星期三","星期四","星期五","星期六"]
        if(this._lang==="ID"||this._lang==="id")return ID[indexDay]
        if(this._lang==="EN"||this._lang==="en")return EN[indexDay]
        if(this._lang==="CN"||this._lang==="cn")return CN[indexDay]
    }
    initValue() {
    
        if (!this._isValueInit || this.props.stateless || !this._renderBySelf) {
            if (SGHelperType.isDefined(this.props.value)) {
                this._value = SGHelperType.dateValue(this.props.value)
            } else {
                var dt = new Date();
                if (dt >= this._dateStart && dt <= this._dateEnd) {
                    this._value = dt;
                } else {
                    if (dt < this._dateStart) {
                        this._value = this._dateStart;
                    } else {
                        this._value = this._dateEnd;
                    }
                }
            }
            this._year = this._value.getFullYear();
            this._month = this._value.getMonth() + 1;
            this._date = this._value.getDate();
            this._day = this._getDay(this._value.getDay())
            this.setupDate();
            this.state = { value: this._value, date: this._date, month: this._month, year: this._year };
            this._isValueInit = true;
        }
        this._renderBySelf = false;
    }

    render() {
        this.initProps();
        this.initValue();
        var style = SGDatePicker._presetProps[this.props.darkMode ? 'dark' : 'light'][this.props.disabled ? SGDatePicker.preset.disabled : this.props.preset ? this.props.preset : SGDatePicker.preset.default];
        var vStyle = [style.v1, this.props.style, this.props.disabled ? { backgroundColor: SGHelperStyle.color.BackGroundDisabled, borderColor: SGHelperStyle.color.BackGroundDisabled } : {}];
        if (this.props.hidden) {
            vStyle = { width: 0, height: 0, margin: 0, overflow: 'hidden' }
        } else {
            if (this.props.shadow && !this.props.disabled) {
                vStyle = SGHelperStyle.addShadowStyle(vStyle, this.props.shadowIntensity);
            }
        }

        var { w, h, p } = this._screenWHPNoHeader
        return (
            !this.props.hidden &&
            <SGTouchableOpacity disabled={this.props.disabled} onPress={this.onShowHandler.bind(this)}>
                <SGView accessible={true} accessibilityLabel={'SGDatePickerRootView'} style={vStyle} >
                    <SGView accessible={true} accessibilityLabel={'SGDatePickerTitleView'} style={style.v2} disabled={this.props.disabled}>
                        <SGText accessible={true} accessibilityLabel={'SGDatePickerValue'} preset={this.props.textPreset ? this.props.textPreset : SGText.preset.titleH3} numberOfLines={1} style={[style.t1, this.props.textStyle]}>{this.getFormattedValue()}</SGText>
                        <SGImage disabled={this.props.disabled} accessible={true} accessibilityLabel={'SGDatePickerButton'} source={require('../asset/image/Icon-ionic-ios-calendar.png')} preset={this.props.textIcon ? this.props.textIcon : SGImage.preset.w20SnoBorder}></SGImage>
                    </SGView>
                    <SGPopView accessible={true} accessibilityLabel={'SGDatePickerPopView'} animationType={'slide'} popViewID={this.pvID} vPos='bottom'>
                        <SGView accessible={true} accessibilityLabel={'SGDatePickerContainerPopView'} style={style.pv1} >
                            <SGTouchableOpacity style={style.to1} onPress={this.onHideHandler.bind(this)}></SGTouchableOpacity>
                                <SGView style={{width:w,flexDirection:'row'}} >
                                    <SGView style={{width:w*0.65}} > 
                                        <SGText accessible={true} accessibilityLabel={'SGDatePickerisDefinedText'} preset={SGText.preset.titleH3B} darkMode={!this.props.darkMode} style={{color:'white',paddingLeft:5*p,alignSelf:'flex-start'}} hidden={SGHelperType.isDefined(this.props.label) ? false : true} numberOfLines={2}>
                                            {this.props.label}
                                        </SGText>
                                    </SGView>
                                    <SGView style={{width:w*0.35}}>
                                        <SGText style={{color:'white',paddingRight:5*p}} preset={SGText.preset.titleH3B}>{this._day}</SGText>
                                    </SGView>
                                </SGView>
                            <SGView style={{ flex: 1, width: '100%' }}>
                                <SGView accessible={true} accessibilityLabel={'SGDatePickerDateView'} style={style.v3}>
                                    <SGView style={style.fv}></SGView>
                                    <SGView accessible={true} accessibilityLabel={'SGDatePickerYearView'} style={style.v4}>
                                        <SGDrumRoll textStyle={{ color: this.props.darkMode ? SGHelperStyle.color.SGDatePicker.TextBlack : SGHelperStyle.color.SGDatePicker.TextWhite }} textPreset={SGText.preset.titleH3} selectedTextPreset={SGText.preset.titleH1B} stateless accessible={true} accessibilityLabel={'SGDatePickerDayDrumRoll'} value={this._date} onValueChange={this.onDateChangeHandler.bind(this)} style={style.dr1} optionList={this._dateData} />
                                    </SGView>
                                    <SGView accessible={true} accessibilityLabel={'SGDatePickerMonthView'} style={style.v4}>
                                        <SGDrumRoll textStyle={{ color: this.props.darkMode ? SGHelperStyle.color.SGDatePicker.TextBlack : SGHelperStyle.color.SGDatePicker.TextWhite }} textPreset={SGText.preset.titleH3} selectedTextPreset={SGText.preset.titleH1B} stateless accessible={true} accessibilityLabel={'SGDatePickerMonthDrumRoll'} value={this._month} onValueChange={this.onMonthChangeHandler.bind(this)} style={style.dr1} optionList={this._monthData} />
                                    </SGView>
                                    <SGView accessible={true} accessibilityLabel={'SGDatePickerDayView'} style={style.v4}>
                                        <SGDrumRoll textStyle={{ color: this.props.darkMode ? SGHelperStyle.color.SGDatePicker.TextBlack : SGHelperStyle.color.SGDatePicker.TextWhite }} textPreset={SGText.preset.titleH3} selectedTextPreset={SGText.preset.titleH1B} stateless accessible={true} accessibilityLabel={'SGDatePickerYearDrumRoll'} value={this._year} onValueChange={this.onYearChangeHandler.bind(this)} style={style.dr1} optionList={this._yearData} />
                                    </SGView>
                                </SGView>
                            </SGView>
                        </SGView>
                    </SGPopView>
                </SGView>
            </SGTouchableOpacity>
        );
    }
}
