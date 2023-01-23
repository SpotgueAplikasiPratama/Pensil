/**
 * Custom Static Map component that display map based on coordinate set
 * 1. receive prop latitude={num} and longitude={num}
 * 2. default style but can be override by user
 * 3. shadow true|false
 * 4. hidden true|false
 * 5. disabled true|false
 * 6. prop resolution: from SGMapStatic.resolution 'hi'|'med'|'low'
 * 7. PENDING : onPress to open available maps app in the device
 * 8. safeClickDelay props
 */


import React from 'react';
import { StyleSheet } from 'react-native';
import { SGImageButton } from './SGImageButton';
import { SGBaseControl } from './SGBaseControl';
import { SGHelperType, SGHelperStyle } from '../helper';

export class    SGMapStatic extends SGBaseControl {
    static defaultCoordinate = {
        //lokasi Spotgue office
        latitude: -6.174924644746781,
        longitude: 106.78991060703993,
    }
    static mapKey = 'AIzaSyAt6lz62lzKIaFOa4G6o-kZqEVsDvGR8wc';
    static mapURI = 'https://maps.googleapis.com/maps/api/staticmap?center=';
    static resolution = {
        hi: 'hi',
        med: 'med',
        low: 'low',
        wide: 'wide',
    }
    static mapSize = {
        hi: '1080x1080',
        med: '800x800',
        low: '480x480',
        wide: '1080x540',
    }

    constructor(props, context, ...args) {
        super(props, context, ...args);
    }
    onPressHandler() {
        //open default Map app in the device and pass the necessary field.
        //alert('this should open default Map app, but not yet implemented');
        if (this.props.onPress) { this.props.onPress(); }
    }
    initProps() {
        if (super.isPropsNeedInitOrChanged(this.props)) {
            var { w, h, p } = this._screenWHPNoHeader;
            this._style = StyleSheet.create({
                imgButton1: { width: w - 12 * p, height: w - 12 * p, padding: 0, borderRadius:2*p },
                img1: { width: w - 12 * p, height: w - 12 * p, resizeMode: 'cover', marginLeft: p, borderRadius:2*p },
            })
            var myProps = [];
            myProps = SGHelperStyle.addStyleProps(this.props, this._style.imgButton1);
            var lat = SGHelperType.isDefined(this.props.latitude) ? this.props.latitude : SGMapStatic.defaultCoordinate.latitude;
            var long = SGHelperType.isDefined(this.props.longitude) ? this.props.longitude : SGMapStatic.defaultCoordinate.longitude;
            var size = SGMapStatic.mapSize[this.props.resolution ? this.props.resolution : SGMapStatic.resolution.med];
            var uri = SGMapStatic.mapURI + lat + ',' + long + '&zoom=16&size=' + size + '&maptype=roadmap&markers=color:red%7Clabel:C%7C' + lat + ',' + long + '&key=' + SGMapStatic.mapKey;
            myProps.source = { uri: uri }
            myProps.imageStyle = SGHelperStyle.prependStyle(this.props.imageStyle, this._style.img1);
            myProps.onPress = SGBaseControl.makeSafeClick(this, this.onPressHandler.bind(this), this.props.safeClickDelay);
            this.myProps = myProps;
        }
    }
    render() {
        this.initProps();
        return (
            !this.props.hidden &&
            <SGImageButton accessible={true} accessibilityLabel={'SGMapStaticRootImageButton'} {...this.myProps} />
        );
    }

}
