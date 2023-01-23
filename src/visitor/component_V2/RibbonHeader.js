import React from "react";
import { StyleSheet } from "react-native";
import { SGView as View, SGText as Text, SGImage as Image } from "../../core/control";

import { SGBaseContainer } from '../../core/container/SGBaseContainer';
import { SGHelperStyle, SGHelperWindow } from '../../core/helper';
import image from '../asset/image';

export class RibbonHeader extends SGBaseContainer {

    createStyleSheet() {
        var { w, h, p } = this._screenWHP;
        if (this.props.style) {
            if (this.props.style.width) w = this.props.style.width;
            if (this.props.style.height) h = this.props.style.height;
            if (this.props.style.padding) p = this.props.style.padding;
        }
        return StyleSheet.create({
            mainContainer: {width: w, height: this.props.search ? SGHelperWindow.getHeaderHeight() * 1.4 : SGHelperWindow.getHeaderHeight(), backgroundColor: '#FFFFFF', paddingHorizontal: p * 2.5, justifyContent: 'center', alignItems: 'flex-start', marginHorizontal: 0, borderColor: '#E4E4E4', borderBottomWidth: this.props.borderOff? null : w * 0.0023},
            text: {color: '#000000', marginVertical: this.props.search ? 0 : p},
            searchText: {color: '#A8A8A8', marginVertical: 0}
        });
    }

    constructor(props, context, ...args) {
        super(props, context, ...args);
        this.style = this.createStyleSheet();
    }
    render() {
        this.style.mainView = SGHelperStyle.appendStyle(this.style.mainView, this.props.style);
        var style = this.style;
        return(
            <View style={style.mainContainer}>
                {this.props.search ?
                    <Text preset={(this.props.textPreset) ? Text.preset[this.props.textPreset] : Text.preset.titleH2B} style={style.searchText}>{this.props.searchTitle}</Text>
                :
                    (null)
                }
                <Text preset={(this.props.textPreset) ? Text.preset[this.props.textPreset] : Text.preset.titleH2B} style={style.text}>{this.props.title}</Text>
            </View>
        );
    }
}

