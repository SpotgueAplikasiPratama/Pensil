import React from "react";
import { StyleSheet } from "react-native";
import { SGView as View, SGText as Text, SGImage as Image } from "../../core/control";

import { SGBaseContainer } from '../../core/container/SGBaseContainer';
import { SGHelperStyle } from '../../core/helper';
import image from '../asset/image';
import { SGLocalize } from "../locales/SGLocalize";

export class DiscountTag extends SGBaseContainer {

    createStyleSheet() {
        var { w, h, p } = this._screenWHP;
        if (this.props.style) {
            if (this.props.style.width) w = this.props.style.width;
            if (this.props.style.height) h = this.props.style.height;
            if (this.props.style.padding) p = this.props.style.padding;
        }
        return StyleSheet.create({
            tag: { alignSelf: 'flex-start', width: (this.props.tagWidth) ? w * this.props.tagWidth : w * 0.08 * 1.3, height: w * 0.11 * 1, resizeMode: 'stretch', backgroundColor: '#E24444', alignItems: 'center', justifyContent: 'center', marginTop: -1 * p, marginRight: - 2 * p, borderBottomLeftRadius: 2 * p, borderTopRightRadius: 2 * p },
            title: { color: '#ffffff', textAlign: 'center', marginVertical: 0 }
        });
    }

    constructor(props, context, ...args) {
        super(props, context, ...args);
        this.style = this.createStyleSheet();
    }

    _calculateDiscount() {
        if(this.props.normalPrice == this.props.promoPrice){
            return ''
        }else{
        var discount = Math.round((this.props.normalPrice - this.props.promoPrice) / this.props.normalPrice.toFixed(2) * 100).toFixed(0)
        return (discount);
        }  
    }

    render() {
        var style = this.style;
        this.style.tag = SGHelperStyle.appendStyle(this.style.tag, this.props.style);
        return (
            <View accessible={true} accessibilityLabel={'DiscountTagRootImage'} style={style.tag}>
                <Text accessible={true} accessibilityLabel={'DiscountTagDiscountTotal'} preset={Text.preset.titleH5B} style={style.title}>{this._calculateDiscount()}%</Text>
                <Text preset={Text.preset.titleH5B} style={style.title}>OFF</Text>
            </View>
        );
    }
}

