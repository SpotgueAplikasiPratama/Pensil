import React from "react";
import { StyleSheet } from "react-native";
import { SGView as View, SGText as Text, SGImage as Image } from "../../core/control";

import { SGBaseContainer } from '../../core/container/SGBaseContainer';
import { SGHelperStyle, SGHelperGlobalVar } from '../../core/helper';
import image from '../asset/image';
import { SGLocalize } from "../locales/SGLocalize";
import { VisitorHelper } from "../helper/VisitorHelper";

export class LastVisitedTag extends SGBaseContainer {

    createStyleSheet() {
        var { w, h, p } = this._screenWHP;
        if (this.props.style) {
            if (this.props.style.width) w = this.props.style.width;
            if (this.props.style.height) h = this.props.style.height;
            if (this.props.style.padding) p = this.props.style.padding;
        }
        return StyleSheet.create({
            tag: { alignSelf: 'center', width: w * 0.23, height: w * 0.13, resizeMode: 'stretch', backgroundColor: 'transparent', alignItems: 'center', justifyContent: 'flex-end', marginHorizontal: 0 },
            title: { color: '#ffffff', marginBottom: 2 * p, textAlign: 'center',width:w*0.15 }
        });
    }
    constructor(props, context, ...args) {
        super(props, context, ...args);
        this.style = this.createStyleSheet();
        this.imageSetting = SGHelperGlobalVar.getVar('GlobalImageSetting');
    }

    render() {
        var style = this.style;
        this.style.tag = SGHelperStyle.appendStyle(this.style.tag, this.props.styleTag);
        this.style.title = SGHelperStyle.appendStyle(this.style.title, this.props.styleText);
        return (
            <View accessible={true}>
                {this.props.value !== null &&
                <View>
                    <View><Image accessible={true} accessibilityLabel={'LastVisitedTagImage'} style={style.tag} source={{ uri: image.lastVisitedTagIcon[this.imageSetting].url }}></Image></View>
                    <View><Text accessible={true} accessibilityLabel={'LastVisitedTagText'} preset={Text.preset.titleH5B} style={style.title}>{VisitorHelper._decideDayText(this.props.value)}</Text></View>
                </View>
                }
            </View>
        );
    }
}

