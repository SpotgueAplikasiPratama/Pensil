import React from 'react';
import { SGBaseContainer } from '../../core/container/SGBaseContainer';
import { SGImage as Image, SGTouchableOpacity as TouchableOpacity, SGText as Text, SGView as View } from '../../core/control';
import { StyleSheet } from 'react-native';
import { SGHelperNavigation, SGHelperGlobalVar } from '../../core/helper';

export class StoreCardSmall extends SGBaseContainer {
    createStyleSheet = (whp) => {
        var { w, h, p } = whp;
        return StyleSheet.create({
            mainContainer: {backgroundColor: '#FFFFFF', width: (w - (p * 4)) / 3, borderRadius: w * 0.05, marginLeft: this.props.index == 0 ? w * 0.03 : w * 0.015 , marginRight: w * 0.015, justifyContent: 'center', alignItems: 'center'},
            imageContainer: {width: (w - (p * 4)) / 3, height: (w - (p * 4)) / 3, marginTop: 0},
            sliderImage: {width: (w - (p * 4)) / 3, height: (w - (p * 4)) / 3, resizeMode: 'cover', borderRadius: 0, borderTopLeftRadius: w * 0.05, borderTopRightRadius: w * 0.05, borderBottomLeftRadius: 0, borderBottomRightRadius: 0},
            textContainer: {justifyContent: 'center', paddingVertical: p},
            sliderText: {color: '#3B444B'}
        });
    }

    onCardPress(screen, contentKey) {
        SGHelperNavigation.navigatePush(this.props.navigator, screen, { contentKey: contentKey });
    }

    constructor(props, context, ...args) {
        super(props, context, ...args);
        this.whp = { w: props.style.width, h: props.style.height, p: props.style.padding };
        this.style = this.createStyleSheet(this.whp);
    }

    render() {
        var { w, h, p } = this.whp;
        var style = this.style;
        return (
            <TouchableOpacity onPress={() => { this.onCardPress(this.props.screen, this.props.contentKey) }}>
                <View accessible={true} accessibilityLabel={'StoreCardSmallRootView'} shadow shadowIntensity={0.6} style={style.mainContainer}>
                    <View accessible={true} accessibilityLabel={''} style={style.imageContainer}>
                        <Image accessible={true} accessibilityLabel={'StoreCardSmallImage'} style={style.sliderImage} source={{ uri: this.props.image }}></Image>
                    </View>
                    <View accessible={true} accessibilityLabel={'StoreCardSmallTextView'} style={style.textContainer}>
                        <Text accessible={true} accessibilityLabel={'StoreCardSmallContentText'} numberOfLines={1} preset={Text.preset.titleH4B} style={style.sliderText}>{this.props.storeName}</Text>
                        <Text accessible={true} accessibilityLabel={'StoreCardSmallPlaceNameText'} numberOfLines={1} preset={Text.preset.titleH5} style={style.sliderText}>{this.props.placeName}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        );
    }
}
