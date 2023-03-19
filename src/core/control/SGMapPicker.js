/**
 * wrap react-native-maps map view with several additional behavior
 * 1. default style and can be customized
 * 2. receive 2 value prop latitude={num} and longitude={num}
 * 3. onValueChange event with parameter JSON object {latitude:num, longitude:num}
 * 4. hidden true|false
 * 5. disabled true|false
 * 6. shadow true|false and shadowIntensity
 * 7. default coordinate to MAG office (CP)
 * 8. darkMode true|false
 */

import React from 'react';
import { StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { SGBaseControl } from './SGBaseControl';
import { SGHelperType } from '../helper';
import { SGPopView } from './SGPopView';
import { SGView } from './SGView';
import { SGText } from './SGText';
import { SGMapStatic } from './SGMapStatic';
import { SGIcon } from './SGIcon';
import { SGTouchableOpacity } from './SGTouchableOpacity';
import { SGHelperStyle } from '../helper';

export class SGMapPicker extends SGBaseControl {
    static defaultCoordinate = {
        //MAG Office
        latitude: -6.145576,
        longitude: 106.892242,
    }
    onShowMapHandler() {
        SGPopView.showPopView(this.pvID);
    }
    onHideMapHandler() {
        SGPopView.hidePopView(this.pvID);
    }

    constructor(props, context, ...args) {
        super(props, context, ...args);
        this.pvID = SGPopView.getPopViewID();
    }

    initProps() {
        if (super.isPropsNeedInitOrChanged(this.props)) {
            var { w, h, p } = this._screenWHP;
            this._style = {
                light: {
                    default: StyleSheet.create({
                        v1: { width: w - 12 * p, marginTop: 2 * p, justifyContent: 'flex-start', padding: 2 * p, backgroundColor: SGHelperStyle.color.SGMapPicker.BGWhite, borderRadius: 2 * p, justifyContent: 'space-around', alignItems: 'center', borderColor: SGHelperStyle.color.SGMapPicker.Border, borderWidth: p / 4, },
                        mapStatic1: { width: (w - 16 * p), height: (w - 16 * p) / 2, borderRadius: 2 * p, margin: 0 },
                        mapStaticImage1: { width: (w - 16 * p), height: (w - 16 * p) / 2, margin: 0 },
                        t1: { marginTop: 2 * p, color: SGHelperStyle.color.SGMapPicker.TextBlack },
                        pv1: { paddingTop: 4 * p, backgroundColor: SGHelperStyle.color.SGMapPicker.PVBGBlack, width: w, height: this._screenWHP.h * 0.8, borderTopLeftRadius: 5 * p, borderTopRightRadius: 5 * p, justifyContent: 'flex-start' },
                        pv1_t1: {marginHorizontal:4*p, color: SGHelperStyle.color.SGMapPicker.TextWhite, alignSelf: 'flex-start', marginBottom: 2 * p },
                        icon1: { marginVertical: p, paddingVertical: 0 },
                        mv1: { alignSelf: 'stretch', flex: 1, borderRadius: 0 },
                        to1: { backgroundColor: SGHelperStyle.color.SGMapPicker.PVBGWhite, width: w * 0.14, height: w * 0.009, marginVertical: 2 * p, borderRadius: 5 * p },
                    }),
                    disabled: StyleSheet.create({
                        v1: { width: w - 12 * p, marginTop: 2 * p, justifyContent: 'flex-start', padding: 2 * p, backgroundColor: SGHelperStyle.color.SGMapPicker.BGDisabled, borderRadius: 2 * p, justifyContent: 'space-around', alignItems: 'center', borderColor: SGHelperStyle.color.SGMapPicker.Border, borderWidth: p / 4, },
                        mapStatic1: { width: (w - 16 * p), height: (w - 16 * p) / 2, borderRadius: 2 * p, margin: 0 },
                        mapStaticImage1: { width: (w - 16 * p), height: (w - 16 * p) / 2, margin: 0 },
                        t1: { marginTop: 2 * p, color: SGHelperStyle.color.SGMapPicker.TextBlack },
                        pv1: { paddingTop: 4 * p, backgroundColor: SGHelperStyle.color.SGMapPicker.PVBGBlack, width: w, height: this._screenWHP.h * 0.8, borderTopLeftRadius: 5 * p, borderTopRightRadius: 5 * p, justifyContent: 'flex-start' },
                        pv1_t1: { marginHorizontal:4*p, color: SGHelperStyle.color.SGMapPicker.TextWhite, alignSelf: 'flex-start', marginBottom: 2 * p },
                        icon1: { marginVertical: p, paddingVertical: 0 },
                        mv1: { alignSelf: 'stretch', flex: 1, borderRadius: 0 },
                        to1: { backgroundColor: SGHelperStyle.color.SGMapPicker.PVBGWhite, width: w * 0.14, height: w * 0.009, marginVertical: 2 * p, borderRadius: 5 * p },
                    }),
                },
                dark: {
                    default: StyleSheet.create({
                        v1: { width: w - 12 * p, marginTop: 2 * p, justifyContent: 'flex-start', padding: 2 * p, backgroundColor: SGHelperStyle.color.SGMapPicker.BGWhite, borderRadius: 2 * p, justifyContent: 'space-around', alignItems: 'center', borderColor: SGHelperStyle.color.SGMapPicker.Border, borderWidth: p / 4, },
                        mapStatic1: { width: (w - 16 * p), height: (w - 16 * p) / 2, borderRadius: 2 * p, margin: 0 },
                        mapStaticImage1: { width: (w - 16 * p), height: (w - 16 * p) / 2, margin: 0 },
                        t1: { marginTop: 2 * p, color: SGHelperStyle.color.SGMapPicker.TextBlack },
                        pv1: { paddingTop: 4 * p, backgroundColor: SGHelperStyle.color.SGMapPicker.PVBGWhite, width: w, height: this._screenWHP.h * 0.8, borderTopLeftRadius: 5 * p, borderTopRightRadius: 5 * p, justifyContent: 'flex-start' },
                        pv1_t1: { marginHorizontal:4*p, color: SGHelperStyle.color.SGMapPicker.TextBlack, alignSelf: 'flex-start', marginBottom: 2 * p },
                        icon1: { marginVertical: p, paddingVertical: 0 },
                        mv1: { alignSelf: 'stretch', flex: 1, borderRadius: 0 },
                        to1: { backgroundColor: SGHelperStyle.color.SGMapPicker.PVBGBlack, width: w * 0.14, height: w * 0.009, marginVertical: 2 * p, borderRadius: 5 * p },
                    }),
                    disabled: StyleSheet.create({
                        v1: { width: w - 12 * p, marginTop: 2 * p, justifyContent: 'flex-start', padding: 2 * p, backgroundColor: SGHelperStyle.color.SGMapPicker.BGDisabled, borderRadius: 2 * p, justifyContent: 'space-around', alignItems: 'center', borderColor: SGHelperStyle.color.SGMapPicker.Border, borderWidth: p / 4, },
                        mapStatic1: { width: (w - 16 * p), height: (w - 16 * p) / 2, borderRadius: 2 * p, margin: 0 },
                        mapStaticImage1: { width: (w - 16 * p), height: (w - 16 * p) / 2, margin: 0 },
                        t1: { marginTop: 2 * p, color: SGHelperStyle.color.SGMapPicker.TextBlack },
                        pv1: { paddingTop: 4 * p, backgroundColor: SGHelperStyle.color.SGMapPicker.PVBGWhite, width: w, height: this._screenWHP.h * 0.8, borderTopLeftRadius: 5 * p, borderTopRightRadius: 5 * p, justifyContent: 'flex-start' },
                        pv1_t1: { marginHorizontal:4*p, color: SGHelperStyle.color.SGMapPicker.TextBlack, alignSelf: 'flex-start', marginBottom: 2 * p },
                        icon1: { marginVertical: p, paddingVertical: 0 },
                        mv1: { alignSelf: 'stretch', flex: 1, borderRadius: 0 },
                        to1: { backgroundColor: SGHelperStyle.color.SGMapPicker.PVBGBlack, width: w * 0.14, height: w * 0.009, marginVertical: 2 * p, borderRadius: 5 * p },
                    }),
                },
            }
        }
    }

    initValue() {
        if (!this._isValueInit || this.props.stateless || !this._renderBySelf) {
            this._value = {
                latitude: SGHelperType.isDefined(this.props.latitude) ? this.props.latitude : SGMapPicker.defaultCoordinate.latitude,
                longitude: SGHelperType.isDefined(this.props.longitude) ? this.props.longitude : SGMapPicker.defaultCoordinate.longitude
            };
            this._mapRegion = {
                latitude: this._value.latitude,
                longitude: this._value.longitude,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421
            }
            this.state = { value: this._value, mapRegion: this._mapRegion };
            this._isValueInit = true;
        }
        this._renderBySelf = false;
    }

    onMapPressHandler(event) {
        this._value = { latitude: event.nativeEvent.coordinate.latitude, longitude: event.nativeEvent.coordinate.longitude, }
        if (this.props.onValueChange) {
            this.props.onValueChange({ latitude: this._value.latitude, longitude: this._value.longitude });
        }
        if (!this.props.stateless) { super.mySetState({ value: this._value }) }
    }

    render() {
        this.initProps();
        this.initValue();
        var style = this._style[this.props.darkMode?'dark':'light'][this.props.disabled ? 'disabled' : 'default'];
        return (
            !this.props.hidden &&
            <SGView shadow={this.props.shadow} hidden={this.props.hidden} style={[style.v1,this.props.style]}>
                <SGMapStatic disabled={this.props.disabled} resolution={SGMapStatic.resolution.wide} style={style.mapStatic1} imageStyle={style.mapStaticImage1} latitude={this._value.latitude} longitude={this._value.longitude} onPress={this.onShowMapHandler.bind(this)} />
                <SGText disabled={this.props.disabled} style={[this.props.textStyle, style.t1]} preset={this.props.textPreset ? this.props.textPreset : SGText.preset.titleH4}>({this._value.latitude}, {this._value.longitude})</SGText>
                <SGPopView animationType={'slide'} popViewID={this.pvID} vPos='bottom'>
                    <SGView style={style.pv1} >
                        <SGTouchableOpacity style={style.to1} onPress={this.onHideMapHandler.bind(this)}></SGTouchableOpacity>
                        {/* <SGIcon name={SGIcon.Icon.arrowDown} style={style.icon1} onPress={this.onHideMapHandler.bind(this)} /> */}
                        <SGText preset={SGText.preset.titleH2B} style={{ alignSelf: 'flex-start' }} style={style.pv1_t1} hidden={SGHelperType.isDefined(this.props.label) ? false : true}>{this.props.label}</SGText>
                        <MapView provider={'google'} style={style.mv1} initialRegion={this._mapRegion} onPress={this.onMapPressHandler.bind(this)}>
                            <Marker title="picked location" coordinate={this._value} />
                        </MapView>
                    </SGView>
                </SGPopView>
            </SGView>
        );
    }
}

