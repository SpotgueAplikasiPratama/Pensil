import React from 'react';
import { SGBaseContainer } from '../../core/container/SGBaseContainer';
import { SGView as View, SGText as Text, SGImage as Image, SGTouchableOpacity as TouchableOpacity } from '../../core/control';
import { StyleSheet } from 'react-native';
import { CardIconButton,CardIconButtonFavorite,CardIconButtonLike,CardIconButtonNotification } from '../component_V2/CardIconButton';
import { LastVisitedTag } from '../component_V2/LastVisitedTag';
import { SGHelperNavigation, SGHelperGlobalVar } from '../../core/helper';
import { tbLookupDAO } from '../db/tbLookupDAO';
import { SGLocalize } from '../locales/SGLocalize';
import { VisitorHelper } from '../helper/VisitorHelper';

export class DefaultPlaceCard extends SGBaseContainer {
    createStyleSheet = (whp) => {
        var { w, h, p } = whp;
        return StyleSheet.create({
            mainContainer: { width: w, padding: p, backgroundColor: '#FFFFFF', overflow: 'visible', flexDirection: 'row', justifyContent: 'flex-start', marginVertical: this.props.slider ? 0 : p, paddingHorizontal: p * 3 },
            leftContainer: { width: w * 0.3 },
            image: { width: (w - p * 2) * 0.275, height: (w - p * 2) * 0.275, resizeMode: 'cover', borderRadius: p * 3 },
            likeText: { color: '#A9A9A9' },
            centerContainer: { width: w * 0.44, height: w * 0.335, marginTop: p, marginBottom: p, paddingLeft: p, paddingTop: p * 2, flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'space-between', overflow: 'visible' },
            mallDetailsContainer: { height: w * 0.23, flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'flex-start' },
            placeNameText: { color: '#000000', marginTop: 0},
            typeAndLocationText: { color: '#989898', marginTop: 0, marginBottom: p * 1 },
            shortDescText: { color: '#A5A5A5', marginVertical: p * 2, maxWidth: w * 0.45 },
            iconContainer: { flexDirection: 'row' },
            icon: { width: w, height: h, padding: p },
            rightContainer: { width: w * 0.2, flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start' },
            tagIcon: { width: w * 0.09, height: w * 0.115 },
            tagText: { color: '#000000' }
        });
    }

    constructor(props, context, ...args) {
        super(props, context, ...args);
        this.whp = { w: props.style.width, h: props.style.height, p: props.style.padding }
        this.style = this.createStyleSheet(this.whp);
        this.title = props.title;
        this._language = SGHelperGlobalVar.getVar('GlobalLanguage')
    }
    render() {
        var { w, h, p } = this.whp;
        var style = this.style;
        return (
            <TouchableOpacity onPress={() => SGHelperNavigation.navigatePush(this.props.navigator, 'MallHome', { contentKey: this.props.contentKey })}>
                <View accessible={true} accessibilityLabel={'DefaultPlaceCardRootView'} style={style.mainContainer}>
                    <View accessible={true} accessibilityLabel={'DefaultPlaceCardContainerView1'} style={style.leftContainer}>
                        <Image accessible={true} accessibilityLabel={'DefaultPlaceCardContentImage'} shadow style={style.image} source={{ uri: this.props.contentImage }}></Image>
                        <Text accessible={true} accessibilityLabel={'DefaultPlaceCarContentLike'} preset={Text.preset.titleH6} style={style.likeText}>{this.props.contentLikeCount} {this.props.likeText}</Text>
                    </View>
                    <View accessible={true} accessibilityLabel={'DefaultPlaceCardContainerView2'} style={style.centerContainer}>
                        <View accessible={true} style={style.mallDetailsContainer}>
                            <Text accessible={true} accessibilityLabel={'DefaultPlaceCardPlaceName'} preset={Text.preset.titleH3B} numberOfLines={2} style={style.placeNameText}>{(this.props.placeName).toUpperCase()}</Text>
                            <Text accessible={true} accessibilityLabel={'DefaultPlaceCardPlaceCategory'} preset={Text.preset.titleH5B} numberOfLines={1} style={style.typeAndLocationText}>{SGLocalize.translate("buildingCategory." + tbLookupDAO.getLookUpValue(this.props.placeCategory).fValueKey)}, {SGLocalize.translate("city." + tbLookupDAO.getLookUpValue(this.props.location).fValueKey)}</Text>
                            <Text accessible={true} accessibilityLabel={'DefaultPlaceCardDesc'} preset={Text.preset.titleH6B} numberOfLines={2} style={style.shortDescText}>{this.props.shortDesc}</Text>
                        </View>
                        <View accessible={true} accessibilityLabel={'DefaultPlaceCardIconButtonView'} style={style.iconContainer}>
                            <CardIconButtonLike onIconPressed={this.props.onLike} accessible={true} accessibilityLabel={'DefaultPlaceCardIconLike'} likePackage={this.props.likePackage} navigator={this.props.navigator} contentType='Place' contentKey={this.props.contentKey} active={this.props.like} type={'like'} style={style.icon} likeMallGetReward={this.props.likeMallGetReward}></CardIconButtonLike>
                            <CardIconButtonNotification onIconPressed={this.props.onNotification}  accessible={true} accessibilityLabel={'DefaultPlaceCardIconNotification'} navigator={this.props.navigator} contentType='Place' contentKey={this.props.contentKey} active={this.props.notification} type={'notification'} style={style.icon}></CardIconButtonNotification>
                            <CardIconButtonFavorite onIconPressed={this.props.onFavorite} accessible={true} accessibilityLabel={'DefaultPlaceCardIconFavourite'} navigator={this.props.navigator} contentType='Place' contentKey={this.props.contentKey} active={this.props.favorite} type={'favorite'} style={style.icon}></CardIconButtonFavorite>
                        </View>
                    </View>
                    <View accessible={true} style={style.rightContainer}>
                    {(this.props.lastVisited !== null)&&
                        <LastVisitedTag accessible={true} accessibilityLabel={'DefaultPlaceCardLastVisited1'} textPreset={Text.preset.titleH5B} value={this.props.lastVisited} imageSetting={this.imageSetting} styleTag={style.tagIcon} styleText={style.tagText}></LastVisitedTag>
                    }
                    </View>
                </View>
            </TouchableOpacity>
        );
    }
}
