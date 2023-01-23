import React from 'react';
import { SGBaseContainer } from '../../core/container/SGBaseContainer';
import { SGView as View, SGText as Text, SGImage as Image, SGTouchableOpacity as TouchableOpacity } from '../../core/control';
import { StyleSheet } from 'react-native';
import { CardIconButton,CardIconButtonLike,CardIconButtonFavorite,CardIconButtonNotification } from '../component_V2/CardIconButton';
import { LastVisitedTag } from '../component_V2/LastVisitedTag';
import { tbLookupDAO } from '../db/tbLookupDAO';
import { SGLocalize } from '../locales/SGLocalize';
import { SGHelperNavigation,SGHelperGlobalVar } from '../../core/helper';
import { VisitorHelper } from '../helper/VisitorHelper';

export class DefaultStoreCard extends SGBaseContainer {
    createStyleSheet = (whp) => {
        var { w, h, p } = whp;
        return StyleSheet.create({
            mainContainer: {width: w, padding: p, backgroundColor: '#FFFFFF', overflow: 'visible',  marginVertical: this.props.slider ? 0 : p, borderRadius: 0, paddingHorizontal: p * 3},
            topContainer: {flexDirection: 'row', justifyContent: 'flex-start'},
            leftContainer: {width: w * 0.3},
            image: {width: (w - p * 2) * 0.275, height: (w - p * 2) * 0.275, resizeMode: 'cover', borderRadius: p * 3},
            likeText: {color: '#A9A9A9'},
            centerContainer: {width: w * 0.44, height: w * 0.335, marginTop: p, marginBottom: p, paddingLeft: p, paddingTop: p * 2, flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'space-between', overflow: 'visible'},
            storeDetailsContainer: {flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'flex-start'},
            storeNameText: {color: '#000000', marginTop: 0},
            categoryNameText: {color: '#989898', marginTop: 0},
            typeAndLocationText: {color: '#989898', marginTop: 0, marginBottom: p},
            shortDescText: {color: '#A7A7A7', marginVertical: p * 2, maxWidth: w * 0.45},
            iconContainer: {flexDirection: 'row'},
            icon: {width: w, height: h, padding: p},
            rightContainer: {width: w * 0.2, flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'center'},
            tagIcon: {width: w * 0.09, height: w * 0.115},
            tagText: {color: '#000000'},
            bottomContainer: { width: w, borderTopColor: '#E5E5E5', borderTopWidth: w * 0.003, flexDirection: 'row', justifyContent: 'flex-start' },
            bottomLeftContainer: {width: w * 0.2, paddingLeft: p * 2, marginVertical: p * 1.5},
            mallThumbnail: {width: (w - p * 2) * 0.14, height: (w - p * 2) * 0.14, resizeMode: 'cover', borderRadius: p * 2.5, marginBottom: 0},
            bottomRightContainer: {width: w * 0.5, justifyContent: 'flex-start', alignItems: 'flex-start', marginLeft: 0},
            mallNameText: {color: '#3E3E3E', marginTop: 0},
            mallLocationText: {color: '#989898', marginVertical: 0},
            likedText: {color: '#909090', marginTop: p}
        });
    }

    constructor(props, context, ...args) {
        super(props, context, ...args);
        this.whp = { w: props.style.width, h: props.style.height, p: props.style.padding }
        this.style = this.createStyleSheet(this.whp);
        this.title = props.title;
        this.showFooter = this.props.hideFooter ? true : false;
        this._language = SGHelperGlobalVar.getVar('GlobalLanguage')
    }
    _constructFloorString() {
        var str = '';
        for (var i = 0; i < this.props.storeFloor.length; i++) {
            if (i === this.props.storeFloor.length - 1) { str = str + this.props.storeFloor[i]['fFloorName' + this.props.language.toUpperCase()] }
            else {
                str = str + this.props.storeFloor[i]['fFloorName' + (this.props.language).toUpperCase()] + ', '
            }
        }
        return (str);
    }

    render() {
        var { w, h, p } = this.whp;
        var style = this.style;
        var floorString = this._constructFloorString();
        return (
            <TouchableOpacity onPress={() => SGHelperNavigation.navigatePush(this.props.navigator, 'StoreHome', { contentKey: this.props.contentKey })}>
                <View accessible={true} accessibilityLabel={'DefaultStoreCardRootView'} style={style.mainContainer}>
                    <View accessible={true} style={style.topContainer}>
                        <View accessible={true} accessibilityLabel={'DefaultStoreCardContentView'} style={style.leftContainer}>
                            <Image accessible={true} accessibilityLabel={'DefaultStoreCardContentImage'} shadow style={style.image} source={{ uri: this.props.contentImage }}></Image>
                            <Text accessible={true} accessibilityLabel={'DefaultStoreCarContentLike'} preset={Text.preset.titleH6} style={style.text1}>{this.props.contentLikeCount} {this.props.likeText}</Text>
                        </View>
                        <View accessible={true} accessibilityLabel={'DefaultStoreCardContainerView2'} style={style.centerContainer}>
                            <View accessible={true} style={style.storeDetailsContainer}>
                                <Text accessible={true} accessibilityLabel={'DefaultStoreCardStoreName'} preset={Text.preset.titleH3B} numberOfLines={2} style={style.storeNameText}>{this.props.storeName ? (this.props.storeName).toUpperCase() : ''}</Text>
                                {/* SGLocalize.translate('storeCategory.' + tbLookupDAO.getLookUpValue(this.props.storeCategory).fValueKey) */}
                                <Text accessible={true} accessibilityLabel={'DefaultStoreCardStoreCategory'} preset={Text.preset.titleH5B} numberOfLines={1} style={style.categoryNameText}>{VisitorHelper.getLocalizeDataFromLookUp('StoreCategory',this.props.storeCategory,this._language)}</Text>
                                <Text accessible={true} accessibilityLabel={'DefaultStoreCardStoreLocation'} preset={Text.preset.titleH6B} numberOfLines={3} style={style.typeAndLocationText}>{this.props.locationText} {floorString} {this.props.storeLocation}</Text>
                            </View>
                            <View accessible={true} accessibilityLabel={'DefaultStoreCardIconButtonView'} style={style.iconContainer}>
                                <CardIconButtonLike onIconPressed={this.props.onLike} accessible={true} accessibilityLabel={'DefaultStoreCardIconLike'} likePackage={this.props.likePackage} navigator={this.props.navigator} contentType='Store' contentKey={this.props.contentKey} active={this.props.like} type={'like'} style={style.throwWHP}></CardIconButtonLike>
                                <CardIconButtonNotification onIconPressed={this.props.onNotification}  accessible={true} accessibilityLabel={'DefaultStoreCardIconComment'} navigator={this.props.navigator} contentType='Store' contentKey={this.props.contentKey} active={this.props.notification} type={'notification'} style={style.throwWHP}></CardIconButtonNotification>
                                <CardIconButtonFavorite onIconPressed={this.props.onFavorite} accessible={true} accessibilityLabel={'DefaultStoreCardIconShare'} navigator={this.props.navigator} contentType='Store' contentKey={this.props.contentKey} active={this.props.favorite} type={'favorite'} style={style.throwWHP}></CardIconButtonFavorite>
                            </View>
                        </View>
                        <View accessible={true} style={style.rightContainer}>
                        {this.props.lastVisited !== null &&
                            <LastVisitedTag accessible={true} accessibilityLabel={'DefaultStoreCardLastVisited'} value={this.props.lastVisited} imageSetting={this.imageSetting} style={style.throwWHP} styleTag={style.tagIcon} styleText={style.tagText}></LastVisitedTag>
                        }
                        </View>
                    </View>
                    
                    <View accessible={true} style={style.bottomContainer}>
                        <View accessible={true} accessibilityLabel={'DefaultStoreCardContentView'} style={style.bottomLeftContainer}>
                            <Image accessible={true} accessibilityLabel={'DefaultStoreCardFooterImage'} source={{ uri: this.props.image }} style={style.mallThumbnail}></Image>
                        </View>
                        <View accessible={true} accessibilityLabel={'DefaultStoreCardContainerView2'} style={style.bottomRightContainer}>
                            <Text accessible={true} accessibilityLabel={'DefaultStoreCardFooterName'} numberOfLines={1} preset={Text.preset.titleH4_5B} style={style.mallNameText}>{this.props.placeName ? (this.props.placeName).toUpperCase() : ''}</Text>
                            <Text accessible={true} accessibilityLabel={'DefaultStoreCardFooterLocation'} numberOfLines={1} preset={Text.preset.titleH5B} style={style.mallLocationText}>{VisitorHelper.getLocalizeDataFromLookUp('City',this.props.city,this._language)}</Text>
                            <Text accessible={true} accessibilityLabel={'DefaultStoreCardFooterLikeCount'} numberOfLines={1} preset={Text.preset.titleH6B} style={style.likedText}>{this.props.footerLikeCount} {this.props.likeText}</Text>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        );
    }
}
