import React from 'react';
import { StyleSheet } from 'react-native';
import { SGBaseContainer } from '../../core/container/SGBaseContainer';
import { SGImage as Image, SGText as Text, SGView as View } from '../../core/control';
import { SGHelperStyle } from '../../core/helper';

export class SpotgueSignHeader extends SGBaseContainer {
    createStyleSheet() {
        var { w, h, p } = this._screenWHP;
        if (this.props.style) {
            if (this.props.style.width) w = this.props.style.width;
            if (this.props.style.height) h = this.props.style.height;
            if (this.props.style.padding) p = this.props.style.padding;
        }
        return StyleSheet.create({
            v1: { alignItems: 'center', justifyContent: 'center', width: w - 2 * p, padding: p, marginTop: p * 5 },
            i1: { height: w * 0.24, width: w * 0.8, backgroundColor: 'white', resizeMode: 'contain' },
            t1: { marginTop: w * 0.065, color: '#606060', textAlign: 'center' },
        });
    }

    constructor(props, context, ...args) {
        super(props, context, ...args);
        this.style = this.createStyleSheet();
    }

    render() {
        var style = this.style;
        this.style.v1 = SGHelperStyle.appendStyle(this.style.v1, this.props.style);
        return (
            <View accessible={true} accessibilityLabel={'SpotgueSignHeaderRootView'} style={style.v1}>
                <Image accessible={true} accessibilityLabel={'SpotgueSignHeaderImage'} style={style.i1} source={{ uri: this.props.image }}></Image>
                <Text accessible={true} accessibilityLabel={'SpotgueSignHeaderText'} preset={Text.preset.titleH2B} style={style.t1}>
                    {this.props.text}
                </Text>
            </View>
        );
    }
}
