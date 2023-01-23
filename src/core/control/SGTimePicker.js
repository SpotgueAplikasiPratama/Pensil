/**
 * create custom datepicker component using SGDrumRoll with behavior
 * 1. format hh:mm
 * 2. hourList and minuteList prop as array of key-title
 * 3. value prop as UTCDate format with date 1 jan 2000
 * 4. onValueChange event 
 * 5. hidden true|false
 * 6. disabled true|false
 * 7. shadow true|false with prop shadowIntensity from 0.0 to 1.0
 * 8. show DrumRoll in PopUp view 
 * 9. user can customize textStyle prop and textPreset prop
 * 10. language property ID|EN|CN
 */

import React from 'react';
import { SGTimePicker as labels } from '../locale/lang.json';
import { StyleSheet } from 'react-native';
import { SGView } from './SGView';
import { SGPopView } from './SGPopView';
import { SGText } from './SGText';
import { SGBaseControl } from '../../core/control/SGBaseControl';
import { SGIcon } from './SGIcon';
import { SGTouchableOpacity } from './SGTouchableOpacity';
import { SGHelperType, SGHelperStyle, SGHelperWindow } from '../helper';
import { SGDrumRoll } from './SGDrumRoll';
import { SGImage } from './SGImage'

import Theme from '../asset/Theme'
export class SGTimePicker extends SGBaseControl {
    get Value() {
        return this._value;
    }

    getFormattedValue() {
        return SGHelperType.zeroPad(this._hour, 2) + ':' + SGHelperType.zeroPad(this._minute, 2);
    }

    onShowHandler() {
        SGPopView.showPopView(this.pvID);
    }

    onHideHandler() {
        SGPopView.hidePopView(this.pvID);
    }

    setupHour() {
        if (this.props.hourList) {
            this._hourData = this.props.hourList;
        } else {
            this._hourData = [];
            for (var i = 0; i < 24; i++) {
                this._hourData.push({ key: i, title: SGHelperType.zeroPad(i, 2) });
            }
        }
    }

    setupMinute() {
        if (this.props.minuteList) {
            this._minuteData = this.props.minuteList;
        } else {
            this._minuteData = [];
            for (var i = 0; i < 60; i++) {
                this._minuteData.push({ key: i, title: SGHelperType.zeroPad(i, 2) });
            }
        }
    }

    onHourChangeHandler(v) {
        this._hour = v;
        this.updateValue();
    }

    onMinuteChangeHandler(v) {
        this._minute = v;
        this.updateValue();
    }

    updateValue() {
        this._value = new Date(2000, 0, 1, this._hour, this._minute, 0, 0);
        if (this.props.onValueChange) {
            this.props.onValueChange(this._value);
        }
        if (!this.props.stateless) { super.mySetState({ value: this._value, hour: this._hour, minute: this._minute }) };
    }

    static preset = {
        default: 'default',
        disabled:'disabled'
    }
    static _presetProps = {};
    static _isPresetInit = false;
    static _initPreset() {
        if (!SGTimePicker._isPresetInit) {
            var { w, h, p } = SGHelperWindow.getWHPNoHeader();
            SGTimePicker._presetProps = {
                default: StyleSheet.create({
                    v1: { width: w - 12 * p, marginVertical: 2 * p, paddingVertical: 0, borderRadius: 2 * p, borderColor: SGHelperStyle.color.SGTimePicker.Border, borderWidth: p / 4, backgroundColor: SGHelperStyle.color.SGTimePicker.BGWhite },
                    v2: { width: '100%', flexDirection: 'row', justifyContent: 'space-between', paddingLeft: 3 * p, paddingRight: 0, paddingVertical: 0, },
                    pv1: { paddingHorizontal: 4 * p, paddingTop: 2 * p, backgroundColor: SGHelperStyle.color.SGTimePicker.PVBGBlack, width: w, height: h * 0.5, borderTopLeftRadius: 5 * p, borderTopRightRadius: 5 * p, },
                    t1: { marginVertical:0, paddingVertical: 3 * p, flex: 1, color: SGHelperStyle.color.SGTimePicker.TextBlack },
                    icon1: { marginVertical: 0, paddingVertical: 0 },
                    v3: { width: '100%', flexDirection: 'row', justifyContent: 'center', marginBottom: SGHelperWindow.getFooterHeight() },
                    v4: { overflow: 'visible' },
                    dr1: { backgroundColor: SGHelperStyle.color.SGTimePicker.BGTransparent, width: w * 0.25, height: w * 0.45, },
                    fv: { width: w * 0.6, height: w * 0.115, backgroundColor: SGHelperStyle.color.SGDatePicker.PVDRDarkGrey, borderRadius: 3 * p, position: 'absolute', top: w * (0.45 - 0.115) / 2, left: w * 0.2 - 4 * p },
                    text1: { alignSelf: 'flex-start', color: SGHelperStyle.color.SGDatePicker.TextWhite },
                    to1: { backgroundColor: SGHelperStyle.color.SGDatePicker.PVBGWhite, width: w * 0.14, height: w * 0.009, marginVertical: 2 * p, borderRadius: 5 * p },
                }),
                disabled: StyleSheet.create({
                    v1: { width: w - 12 * p, marginVertical: 2 * p, paddingVertical: 0, borderRadius: 2 * p, borderColor: SGHelperStyle.color.SGTimePicker.Border, borderWidth: p / 4, backgroundColor: SGHelperStyle.color.SGTimePicker.BGDisabled },
                    v2: { width: '100%', flexDirection: 'row', justifyContent: 'space-between', paddingLeft: 3 * p, paddingRight: 0, paddingVertical: 0, },
                    pv1: { paddingHorizontal: 4 * p, paddingTop: 2 * p, backgroundColor: SGHelperStyle.color.SGTimePicker.PVBGBlack, width: w, height: h * 0.5, borderTopLeftRadius: 5 * p, borderTopRightRadius: 5 * p, },
                    t1: { marginVertical:0, paddingVertical: 3 * p, flex: 1, color: SGHelperStyle.color.SGTimePicker.TextDisabled },
                    icon1: { marginVertical: 0, paddingVertical: 0 },
                    v3: { width: '100%', flexDirection: 'row', justifyContent: 'center', marginBottom: SGHelperWindow.getFooterHeight() },
                    v4: { overflow: 'visible' },
                    dr1: { backgroundColor: SGHelperStyle.color.SGTimePicker.BGTransparent, width: w * 0.25, height: w * 0.45, },
                    fv: { width: w * 0.6, height: w * 0.115, backgroundColor: SGHelperStyle.color.SGDatePicker.PVDRDarkGrey, borderRadius: 3 * p, position: 'absolute', top: w * (0.45 - 0.115) / 2, left: w * 0.2 - 4 * p },
                    text1: { alignSelf: 'flex-start', color: SGHelperStyle.color.SGDatePicker.TextWhite },
                    to1: { backgroundColor: SGHelperStyle.color.SGDatePicker.PVBGWhite, width: w * 0.14, height: w * 0.009, marginVertical: 2 * p, borderRadius: 5 * p },
                })
            };
            SGTimePicker._isPresetInit = true;
        }
    }

    constructor(props, context, ...args) {
        super(props, context, ...args);
        SGTimePicker._initPreset();
        this.labels = labels;
        this.pvID = SGPopView.getPopViewID();
    }

    initProps() {
        if (super.isPropsNeedInitOrChanged(this.props)) {
            var isDef = SGHelperType.isDefined;
            this._lang = this.props.language ? this.props.language : 'ID';
            this.setupHour();
            this.setupMinute();
        }
    }

    initValue() {
        if (!this._isValueInit || this.props.stateless || !this._renderBySelf) {
            this._value = SGHelperType.isDefined(this.props.value) ? (this.props.value instanceof Date ? this.props.value : new Date(this.props.value)) : new Date(2000, 0, 1, 0, 0, 0, 0);
            this._hour = this._value.getHours();
            this._minute = this._value.getMinutes();
            this.state = { value: this._value, hour: this._hour, minute: this._minute };
            this._isValueInit = true;
        }
    }

    render() {
        this.initProps();
        this.initValue();
        var style = SGTimePicker._presetProps[this.props.disabled ? SGTimePicker.preset.disabled : this.props.preset ? this.props.preset : SGTimePicker.preset.default];
        // var vStyle = [style.v1, this.props.style, this.props.disabled ? { opacity: SGHelperStyle.opacity.disabled } : {}];
        var vStyle = [style.v1, this.props.style]

        if (this.props.hidden) {
            vStyle = { width: 0, height: 0, margin: 0, overflow: 'hidden' }
        } else {
            if (this.props.shadow && !this.props.disabled) {
                vStyle = SGHelperStyle.addShadowStyle(vStyle, this.props.shadowIntensity);
            }
        }
        return (
            !this.props.hidden &&
            <SGView accessible={true} accessibilityLabel={'SGTimePickerRootView'} style={vStyle} >
                <SGTouchableOpacity disabled={this.props.disabled} onPress={this.onShowHandler.bind(this)}>
                    <SGView accessible={true} accessibilityLabel={'SGTimePickerTopView'} style={style.v2} disabled={this.props.disabled}>
                        <SGText accessible={true} accessibilityLabel={'SGTimePickerTitle'} preset={this.props.textPreset} numberOfLines={1} style={[style.t1, this.props.textStyle]}>{this.getFormattedValue()}</SGText>
                        <SGImage disabled={this.props.disabled} accessible={true} accessibilityLabel={'SGTimePickerButton'} source={require('../asset/image/Icon-awesome-clock.png')} preset={this.props.textIcon ? this.props.textIcon : SGImage.preset.w20SnoBorder}></SGImage>
                    </SGView>
                </SGTouchableOpacity>
                <SGPopView accessible={true} accessibilityLabel={'SGTimePickerPopView'} animationType={'slide'} popViewID={this.pvID} vPos='bottom'>
                    <SGView accessible={true} accessibilityLabel={'SGTimePickerContentView'} style={style.pv1} >
                        <SGTouchableOpacity style={style.to1} onPress={this.onHideHandler.bind(this)}></SGTouchableOpacity>
                        <SGText accessible={true} accessibilityLabel={'SGTimePickerLabelText'} preset={SGText.preset.titleH1B} style={style.text1} hidden={SGHelperType.isDefined(this.props.label) ? false : true}>{this.props.label}</SGText>
                        <SGView style={{ flex: 1, width:'100%'}}>
                            <SGView accessible={true} accessibilityLabel={'SGTimePickerTimeView'} style={style.v3}>
                                <SGView style={style.fv}></SGView>
                                <SGView accessible={true} accessibilityLabel={'SGTimePickerHourView'} style={style.v4}>
                                    <SGDrumRoll accessible={true} accessibilityLabel={'SGTimePickerHourDrumRoll'} value={this._hour} textStyle={{ color: this.props.darkMode ? SGHelperStyle.color.SGDatePicker.TextBlack : SGHelperStyle.color.SGDatePicker.TextWhite }} textPreset={SGText.preset.titleH3} selectedTextPreset={SGText.preset.titleH1B} onValueChange={this.onHourChangeHandler.bind(this)} shadow={this.props.shadow} shadowIntensity={this.props.shadowIntensity} style={style.dr1} optionList={this._hourData} />
                                </SGView>
                                <SGView accessible={true} accessibilityLabel={'SGTimePickerMinuteView'} style={style.v4}>
                                    <SGDrumRoll accessible={true} accessibilityLabel={'SGTimePickerMinuteDrumRoll'} value={this._minute} textStyle={{ color: this.props.darkMode ? SGHelperStyle.color.SGDatePicker.TextBlack : SGHelperStyle.color.SGDatePicker.TextWhite }} textPreset={SGText.preset.titleH3} selectedTextPreset={SGText.preset.titleH1B} onValueChange={this.onMinuteChangeHandler.bind(this)} shadow={this.props.shadow} shadowIntensity={this.props.shadowIntensity} style={style.dr1} optionList={this._minuteData} />
                                </SGView>
                            </SGView>
                        </SGView>
                    </SGView>
                </SGPopView>
            </SGView>
        );
    }
}
