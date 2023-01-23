import React from "react";
import { StyleSheet } from "react-native";
import { SGView as View, SGText as Text, SGImage as Image, SGIcon as Icon, SGIconButton as IconButton, SGPopView } from "../../core/control";
import { SGBaseContainer } from '../../core/container/SGBaseContainer';
import { SGHelperGlobalVar, SGHelperStyle, SGHelperNavigation } from '../../core/helper';
import { SGLocalize } from "../locales/SGLocalize";
import { TouchableOpacity } from "react-native-gesture-handler";
import image from '../asset/image';

export class BackButton extends SGBaseContainer {
    createStyleSheet() {
        var { w, h, p } = this._screenWHP;
        if (this.props.style) {
            if (this.props.style.width) w = this.props.style.width;
            if (this.props.style.height) h = this.props.style.height;
            if (this.props.style.padding) p = this.props.style.padding;
        }
        return StyleSheet.create({
            throwWHP: { width: this._screenWHP.w, height: this._screenWHP.h, padding: this._screenWHP.p, backgroundColor: 'white' },
            mainView: { position: 'absolute', zIndex: 100 },
            button: { width: w * 0.072, height: w * 0.072, backgroundColor: 'transparent' },
            title: { color: '#ffffff', textAlign: 'center' }
        });
    }

    constructor(props, context, ...args) {
        super(props, context, ...args);
        this.style = this.createStyleSheet();
    }

    _iconPressed() {
        SGHelperNavigation.goBack(this.props.navigator);
    }

    render() {
        var style = this.style;
        this.style.button = SGHelperStyle.appendStyle(this.style.button, this.props.style);

        return (
            <TouchableOpacity onPress={this._iconPressed.bind(this)}>
                <Image hidden={this.props.hidden} style={style.button} source={{ uri: this.props.color === 'black' ? (image.backLineBlackIcon[this.props.imageSetting].url) : (image.backLineWhiteIcon[this.props.imageSetting].url) }}></Image>
            </TouchableOpacity>
        )
    }
}