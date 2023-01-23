import React from 'react';
import { SGBaseContainer } from '../../core/container/SGBaseContainer';
import { SGImage as Image, SGTouchableOpacity as TouchableOpacity, SGText as Text, SGView as View } from '../../core/control';
import { StyleSheet } from 'react-native';

export class RestoCategoryProductCard extends SGBaseContainer {
    createStyleSheet = (whp) => {
        var { w, h, p } = whp;
        return StyleSheet.create({
            mainView: { backgroundColor: 'white', width: w * 0.275, borderRadius: 2 * p, borderColor: '#c5c4bc', marginHorizontal: 1.5 * p, borderWidth: 0.3 },
            image: { width: w * 0.275, height: w * 0.275, marginVertical: 0, borderTopLeftRadius: 2 * p, borderTopRightRadius: 2 * p, borderRadius: 0, },
            text: { padding: 1 * p, color: '#747170' }
            // image: { backgroundColor: 'white', width: (w - 12 * p) / 3, height: (w - 12 * p) / 3, resizeMode: 'cover', borderRadius: w * 0.02, },
            // textContent: { color: '#3b444b' },
            // textView1: { justifyContent: 'flex-start' }
        });
    }

    onCardPress(screen) {
        this.props.navigator.navigate(screen)
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
            <TouchableOpacity onPress={() => this.props.goToPage(this.props.goToIndex)}>
                <View accessible={true} accessibilityLabel={'StoreCategoryProductCardRootView'} style={style.mainView}>
                    <Image accessible={true} accessibilityLabel={'StoreCategoryProductCardImage'} style={style.image} source={{ uri: this.props.image }}></Image>
                    <Text accessible={true} accessibilityLabel={'StoreCategoryProductCardName'} preset={Text.preset.h9B} style={style.text}>{(this.props.categoryName).toUpperCase()}</Text>
                </View>
            </TouchableOpacity>
        );
    }
}