import React from 'react';
import { SGBaseContainer } from '../../core/container/SGBaseContainer';
import { SGView as View, SGText as Text, SGImage as Image, SGTouchableOpacity as TouchableOpacity } from '../../core/control';
import { StyleSheet } from 'react-native';
import { CardIconButton } from '../component_V2/CardIconButton';
import { LastVisitedTag } from '../component_V2/LastVisitedTag';
import { SGHelperNavigation, SGHelperGlobalVar, SGHelperType } from '../../core/helper';

export class RestoCheckInHistoryCard extends SGBaseContainer {
    createStyleSheet = (whp) => {
        var { w, h, p } = whp;
        return StyleSheet.create({
            mainContainer: {width: w, backgroundColor: '#FFFFFF', paddingHorizontal: p * 2.5, paddingVertical: p * 2, flexDirection: 'row', justifyContent: 'flex-start', borderColor: '#E6E6E6', borderTopWidth: 0.0025 * w, borderBottomWidth: 0.0025 * w},
            image: {width: w * 0.218, height: w * 0.218, resizeMode: 'cover', backgroundColor: '#FFFFFF'},
            rightContainer: {width: w * 0.68, backgroundColor: '#FFFFFF', marginLeft: p * 2, flexDirection: 'row', justifyContent: 'space-between'},
            detail: {width: w * 0.5,justifyContent: 'flex-start', alignItems: 'flex-start'},
            nameText: {color: '#000000'},
            typeAndLocationText: {color: '#989898', marginBottom: p },
            lastCheckInText: {color: '#000000'},
            lastVisited: {width: w * 0.2, height: w * 0.218, backgroundColor: '#FFFFFF'},
            tagIcon: { width: w * 0.085, height: w * 0.105 },
            tagText: { color: '#000000' }
        });
    }

    constructor(props, context, ...args) {
        super(props, context, ...args);
        this.whp = { w: props.style.width, h: props.style.height, p: props.style.padding }
        this.style = this.createStyleSheet(this.whp);
        this.title = props.title;
        this.data = this.props.data;
    }

    render() {
        var { w, h, p } = this.whp;
        var style = this.style;
        this.data = this.props.data;
        this.dataContent = this.data['fContent' + this.props.language.toUpperCase()];

        return (
            <TouchableOpacity onPress={() => SGHelperNavigation.navigatePush(this.props.navigator, 'RestoHome', { contentKey: this.data.contentKey })}>
                <View accessible={true} accessibilityLabel={'RestoCheckInHistoryCardRootView'} style={style.mainContainer}>
                    <View accessible={true} accessibilityLabel={'RestoCheckInHistoryCardImageView'} style={style.leftContainer}>
                        <Image accessible={true} accessibilityLabel={'RestoCheckInHistoryCardImage'} style={style.image} source={{ uri: this.dataContent.fStoreImageJSON[0][this.props.imageSetting].uri }}></Image>
                    </View>
                    <View accessible={true} style={style.rightContainer}>
                        <View accessible={true} style={style.detail}>
                            <Text accessible={true} accessibilityLabel={'RestoCheckInHistoryCardRestoName'} preset={Text.preset.titleH3B} numberOfLines={1} style={style.nameText}>{this.dataContent.fStoreName.toUpperCase()}</Text>
                            <Text accessible={true} accessibilityLabel={'RestoCheckInHistoryCardRestoCategoryLocation'} preset={Text.preset.titleH4_5B} numberOfLines={1} style={style.typeAndLocationText}>{this.data['fBuildingName' + this.props.language.toUpperCase()]}</Text>
                            <Text accessible={true} accessibilityLabel={'RestoCheckInHistoryCardCIText'} preset={Text.preset.titleH5} numberOfLines={1} style={style.lastCheckInText}>{this.props.lastCheckInLabel}</Text>
                            <Text accessible={true} accessibilityLabel={'RestoCheckInHistoryCardLastCI'} preset={Text.preset.titleH5B} numberOfLines={1} style={style.typeAndLocationText}>{SGHelperType.formatDateTime(this.data.lastCheckInDateTime, (this.props.language).toUpperCase())}</Text>
                        </View>
                        <View accessible={true} style={style.lastVisited}>
                            <LastVisitedTag accessible={true} accessibilityLabel={'RestoCheckInHistoryCardLastVisitesTag'} textPreset={Text.preset.h11B} value={this.data.fLastVisited} imageSetting={this.imageSetting} styleTag={style.tagIcon} styleText={style.tagText}></LastVisitedTag>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        );
    }
}