import React from 'react';
import { StyleSheet, Image, TouchableOpacity } from 'react-native';
import { SGBaseContainer } from '../../core/container/SGBaseContainer';
import { SGView as View } from '../../core/control/SGView';
import Icon from 'react-native-vector-icons/AntDesign';
import image from '../asset/image';
import { SGHelperGlobalVar } from '../../core/helper';

export class FAB extends SGBaseContainer {
    createStyleSheet = (whp) => {
        var { w, h, p } = whp;
        return StyleSheet.create({
            v1: { backgroundColor: 'transparent', alignItems: 'flex-end' },
            icon: { width: w * 0.2, height: w * 0.2, resizeMode: 'cover' },
            icon2: { width: w * 0.15, height: w * 0.15, resizeMode: 'cover' },
        });
    }
    constructor(props, context, ...args) {
        super(props, context, ...args);
        this.whp = { w: props.style.width, h: props.style.height, p: props.style.padding }
        this.style = this.createStyleSheet(this.whp);
        this.imageSetting = SGHelperGlobalVar.getVar('GlobalImageSetting');
        this.arrayType = { add: image.addFavoriteFloatingIcon[this.imageSetting].url, bill: image.billButton[this.imageSetting].url, check: image.checkButton[this.imageSetting].url }
    }
    render() {
        var { w, h, p } = this.whp;
        var style = this.style;
        return (
            <TouchableOpacity shadow shadowIntensity={0.2} style={style.v1} activeOpacity={0.7} onPress={this.props.onPress}>
                <Image accessible={true} accessibilityLabel={'FABIconImage'} source={{ uri: this.props.type ? this.arrayType[this.props.type] : this.arrayType.add }} style={this.props.smallIcon?style.icon2:style.icon}></Image>
            </TouchableOpacity>
        );
    }
}
