import React from "react";
import { StyleSheet } from "react-native";
import { SGView as View, SGText as Text, SGImage as Image } from "../../core/control";
import { SGBaseContainer } from '../../core/container/SGBaseContainer';
import { SGHelperStyle } from '../../core/helper';
import { SGLocalize } from "../locales/SGLocalize";

export class OutOfStockTag extends SGBaseContainer {

    createStyleSheet() {
        var { w, h, p } = this._screenWHP;
        if (this.props.style) {
            if (this.props.style.width) w = this.props.style.width;
            if (this.props.style.height) h = this.props.style.height;
            if (this.props.style.padding) p = this.props.style.padding;
        }
        return StyleSheet.create({
            tag: { overflow: 'visible', backgroundColor: '#de3649', width: (this.props.tagWidth) ? w * this.props.tagWidth : w * 0.22, height: w * 0.075, borderBottomLeftRadius: 4 * p },
            title: { color: '#ffffff', textAlign: 'center', marginVertical: 0 }
        });
    }

    constructor(props, context, ...args) {
        super(props, context, ...args);
        this.style = this.createStyleSheet();
    }

    render() {
        var style = this.style;
        this.style.tag = SGHelperStyle.appendStyle(this.style.tag, this.props.style);
        return (
            <View accessible={true} accessibilityLabel={'OutOfStockTagRootView'} style={style.tag}>
                <Text preset={Text.preset.h10B} style={style.title}>{SGLocalize.translate("OutOfStockTag.labelOutOfStock")}</Text>
            </View>
        );
    }
}

