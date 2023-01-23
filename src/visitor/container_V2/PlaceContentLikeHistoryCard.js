import React from 'react';
import { SGBaseContainer } from '../../core/container/SGBaseContainer';
import { SGView as View, SGText as Text, SGImage as Image, SGTouchableOpacity as TouchableOpacity } from '../../core/control';
import { StyleSheet } from 'react-native';
import { CardIconButton,CardIconButtonLike } from '../component_V2/CardIconButton';
import { SGLocalize } from '../locales/SGLocalize';
import { SGHelperNavigation, SGHelperGlobalVar, SGHelperType } from '../../core/helper';

export class PlaceContentLikeHistoryCard extends SGBaseContainer {
    createStyleSheet = (whp) => {
        var { w, h, p } = whp;
        return StyleSheet.create({
            mainContainer: {width: w, backgroundColor: '#FFFFFF', paddingHorizontal: p * 2.5, paddingVertical: p * 2, flexDirection: 'row', justifyContent: 'flex-start', borderColor: '#E6E6E6', borderTopWidth: 0.0025 * w, borderBottomWidth: 0.0025 * w},
            image: {width: w * 0.218, height: w * 0.218, resizeMode: 'cover', backgroundColor: '#FFFFFF'},
            rightContainer: {width: w * 0.58, backgroundColor: '#FFFFFF', marginLeft: p * 2, flexDirection: 'row', justifyContent: 'space-between'},
            detail: {justifyContent: 'flex-start', alignItems: 'flex-start'},
            nameText: {color: '#000000'},
            secondText: {color: '#989898', marginBottom: p },
            thridText: {color: '#000000'},
            liked: {width: w * 0.1, height: w * 0.218},
            icon: { width: w * 1.5, height: w * 1.5, padding: 0 }
        });
    }

    constructor(props, context, ...args) {
        super(props, context, ...args);
        this.whp = { w: props.style.width, h: props.style.height, p: props.style.padding };
        this.style = this.createStyleSheet(this.whp);
        this.title = props.title;
        this.data = this.props.data;
        this.navigationList = { Place: 'MallHome', PlaceEvent: 'PlaceEventDetail', Facility: 'FacilityDetail', WhereToGo: 'WhereToGoResultDetail', PlaceReward: 'RewardDetail' }
    }

    render() {
        var { w, h, p } = this.whp;
        var style = this.style;
        this.data = this.props.data;

        return (
            <TouchableOpacity hidden={this.props.hidden} onPress={() => SGHelperNavigation.navigatePush(this.props.navigator, this.navigationList[this.data.contentGroup], { contentKey: this.data.contentKey })}>
                <View accessible={true} accessibilityLabel={'PlaceContentLikeHistoryCardRootView'} style={style.mainContainer}>
                    <View accessible={true} accessibilityLabel={'PlaceContentLikeHistoryCardImageView'} style={style.leftContainer}>
                        <Image accessible={true} accessibilityLabel={'PlaceContentLikeHistoryCardImage'} style={style.image} source={{ uri: this.data['contentImage' + this.props.language.toUpperCase()][0][this.props.imageSetting].uri }}></Image>
                    </View>
                    <View accessible={true} accessibilityLabel={'PlaceContentLikeHistoryCardTextView'} style={style.rightContainer}>
                        <View accessible={true} style={style.detail}>
                            <Text accessible={true} accessibilityLabel={'PlaceContentLikeHistoryCardName'} preset={Text.preset.titleH3B} numberOfLines={1} style={style.nameText}>{(this.data.text1[this.props.language]).toUpperCase()}</Text>
                            <Text accessible={true} accessibilityLabel={'PlaceContentLikeHistoryCardLocation'} preset={Text.preset.titleH4_5B} numberOfLines={1} style={style.secondText}>{this.data.text2[this.props.language]} {this.data.text3[this.props.language] !== '' ? (',' + this.data.text3[this.props.language]) : ('')}</Text>
                            <Text accessible={true} accessibilityLabel={'PlaceContentLikeHistoryCardCIText'} preset={Text.preset.titleH4_5} numberOfLines={1} style={style.thridText}>{SGLocalize.translate('filterPlaceLike.' + this.data.contentGroup)}</Text>
                        </View>
                    </View>
                    <View accessible={true} accessibilityLabel={'PlaceContentLikeHistoryCardIconButtonView'} style={style.liked}>
                        <CardIconButtonLike onIconPressed={this.props.onLike} accessible={true} accessibilityLabel={'PlaceContentLikeHistoryCardLikeIcon'} hideText likePackage={this.props.likePackage} navigator={this.props.navigator} contentType={this.data.contentGroup} contentKey={this.data.contentKey} active={this.data.fUserLikedThis} type={'like'} likeMallGetReward={this.props.likeMallGetReward} style={style.icon} ></CardIconButtonLike>
                    </View>
                </View>
            </TouchableOpacity>
        );
    }
}