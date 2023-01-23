import React from 'react';
import { SGBaseContainer } from '../../core/container/SGBaseContainer';
import { SGView as View, SGText as Text, SGImage as Image, SGTouchableOpacity as TouchableOpacity } from '../../core/control';
import { StyleSheet } from 'react-native';
import image from '../asset/image';

export class NotificationCard extends SGBaseContainer {
    createStyleSheet = (whp) => {
        var { w, h, p } = whp;
        return StyleSheet.create({
            mainContainer: { width: w, backgroundColor: '#FFFFFF', flexDirection: 'row', justifyContent: 'flex-start', borderColor: '#E0E0E0', borderBottomWidth: w * 0.003, paddingVertical: p * 2 },
            leftContainer: { width: w * 0.26 },
            tenantThumbnailImage: { width: w * 0.16, height: w * 0.16, resizeMode: 'cover', borderRadius: p * 2, backgroundColor: '#FFFFFF' },
            centerContainer: { width: w * 0.59, height: w * 0.16, flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', alignContent: 'flex-start', marginHorizontal: 0 },
            notificationNameText: { color: '#000000', marginBottom: p * 3 },
            notificationShortDescText: { color: '#6E6E6E' },
            viewIcon: { backgroundColor: 'transparent', width: w * 0.12, height: w * 0.12 }
        });
    }

    constructor(props, context, ...args) {
        super(props, context, ...args);
        this.whp = { w: props.style.width, h: props.style.height, p: props.style.padding }
        this.style = this.createStyleSheet(this.whp);
        this.title = props.title;
    }


    render() {
        var { w, h, p } = this.whp;
        var style = this.style;
        var data = this.props.data
        var language = this.props.language.toUpperCase()
        var imageSetting = this.props.imageSetting;
        return (
            <TouchableOpacity onPress={() => this.props.onCardPress()}>
                <View accessible={true} accessibilityLabel={'NotificationCardRootView'} style={style.mainContainer}>
                    <View accessible={true} style={style.leftContainer}>
                        <Image accessible={true} accessibilityLabel={'NotificationCardLogoImage'} style={style.tenantThumbnailImage} source={{ uri: data['fImageJSON' + language][0][imageSetting].uri }}></Image>
                    </View>
                    <View accessible={true} accessibilityLabel={'NotificationCardTextView'} style={style.centerContainer}>
                        <Text accessible={true} accessibilityLabel={'NotificationCardBCName'} preset={data.fRead === "N" ? Text.preset.titleH3B : Text.preset.titleH3} numberOfLines={1} style={style.notificationNameText}>{data['fNotificationName' + language]}</Text>
                        <Text accessible={true} accessibilityLabel={'NotificationCardShortDesc'} preset={Text.preset.titleH4} numberOfLines={2} style={style.notificationShortDescText}>{data['fContent' + language].fShortDescription}</Text>
                    </View>
                    <TouchableOpacity onPress={() => this.props.onCardPress()}>
                        <Image accessible={true} style={style.viewIcon} source={{ uri: image.arrowRightIconWhite[this.props.imageSetting].url }}></Image>
                    </TouchableOpacity>
                </View>

            </TouchableOpacity>
        );
    }
}
