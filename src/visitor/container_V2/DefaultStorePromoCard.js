import React from 'react';
import { SGBaseContainer } from '../../core/container/SGBaseContainer';
import { SGView as View, SGImage as Image, SGText as Text, SGTouchableOpacity as TouchableOpacity } from '../../core/control';
import { StyleSheet } from 'react-native';
import { CardIconButton,CardIconButtonLike,CardIconButtonComment,CardIconButtonShare } from '../component_V2/CardIconButton';
import { DateTag } from '../component_V2/DateTag';
import { SGHelperNavigation, SGHelperGlobalVar, SGHelperType } from '../../core/helper';
import { SGLocalize } from '../locales/SGLocalize';
import { tbLookupDAO } from '../db/tbLookupDAO';
import { VisitorHelper } from '../helper/VisitorHelper';

export class DefaultStorePromoCard extends SGBaseContainer {
    createStyleSheet = (whp) => {
        var { w, h, p } = whp;
        return StyleSheet.create({
            mainContainer: { width: w, backgroundColor: '#FFFFFF', overflow: 'visible', marginHorizontal: 0, marginVertical: this.props.slider ? 0 : p, justifyContent: 'flex-start', borderRadius: 0 },
            topContainer: { width: w * 0.9, marginTop: p * 0.5, flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start' },
            promoImage: { width: w * 0.9, height: w * 0.9 * 9 / 16, borderRadius: p * 2, alignSelf: 'center' },
            promoNameText: { color: '#000000' },
            likeCountAndIconContainer: { width: w * 0.9, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
            likeCountText: { color: '#9D9D9D', marginTop: p * 2 },
            iconContainer: { flexDirection: 'row' },
            bottomContainer: { width: w, borderTopColor: '#E5E5E5', borderTopWidth: w * 0.003, flexDirection: 'row', justifyContent: 'center' },
            bottomLeftContainer: { width: w * 0.15, marginLeft: w * 0.1, marginVertical: p * 1.5 },
            storeThumbnail: { width: (w - p * 2) * 0.14, height: (w - p * 2) * 0.14, resizeMode: 'cover', borderRadius: p * 2.5, marginBottom: p },
            bottomCenterContainer: { width: w * 0.4, marginTop: p, flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', marginLeft: 0 },
            storeNameText: { color: '#3E3E3E' },
            typeAndLocationText: { color: '#989898',marginVertical:0.2*p },
            bottomRightContainer: { width: w * 0.45 },
            dateTag: {}
        });
    }

    constructor(props, context, ...args) {
        super(props, context, ...args);
        this.whp = { w: props.style.width, h: props.style.height, p: props.style.padding }
        this.style = this.createStyleSheet(this.whp);
        this.title = props.title;
        this.contentID = this.props.key;
        this._language = SGHelperGlobalVar.getVar('GlobalLanguage')
    }
    render() {
        var { w, h, p } = this.whp;
        var style = this.style;
        var shareParams = {MallName:this.props.placeName, StorestoName:this.props.storeName, EventName:this.props.eventName, DateStart:SGHelperType.formatDate(this.props.startDate), DateEnd:SGHelperType.formatDate(this.props.endDate) }
        return (
            <TouchableOpacity onPress={() => SGHelperNavigation.navigatePush(this.props.navigator, 'StorePromoDetail', { contentKey: this.props.contentKey })}>
                <View accessible={true} accessibilityLabel={'DefaultStorePromoCardRootView'} style={style.mainContainer}>
                    <View accessible={true} style={style.topContainer}>
                        <Image accessible={true} accessibilityLabel={'DefaultStorePromoCardContentImage'} source={{ uri: this.props.contentImage }} style={style.promoImage}></Image>
                        <View style={{ height: w * 0.142758 }}>
                            <Text accessible={true} accessibilityLabel={'DefaultStorePromoCardEventName'} numberOfLines={2} preset={Text.preset.titleH2B} style={style.promoNameText}>{(this.props.eventName).toUpperCase()}</Text>
                        </View>
                        <View accessible={true} style={style.likeCountAndIconContainer}>
                            <Text accessible={true} accessibilityLabel={'DefaultStorePromoCarContentLike'} preset={Text.preset.titleH6B} style={style.likeCountText}>{this.props.contentLikeCount} {this.props.likeText}</Text>
                            <View accessible={true} accessibilityLabel={'DefaultStorePromoCardIconButtonView'} style={style.iconContainer}>
                                <CardIconButtonLike onIconPressed={this.props.onLike} accessible={true} accessibilityLabel={'DefaultStorePromoCardIconLike'} likePackage={this.props.likePackage} navigator={this.props.navigator} contentType='StorePromo' contentKey={this.props.contentKey} active={this.props.like} type={'like'}></CardIconButtonLike>
                                <CardIconButtonComment accessible={true} accessibilityLabel={'DefaultStorePromoCardIconComment'} commentPackage={this.props.commentPackage} navigator={this.props.navigator} contentType='StorePromo' contentKey={this.props.contentKey} canComment={this.props.canComment} type={'comment'}></CardIconButtonComment>
                                <CardIconButtonShare shareParams={shareParams} img={this.props.contentImageShareButton} accessible={true} accessibilityLabel={'DefaultStorePromoCardIconShare'} navigator={this.props.navigator} contentType='StorePromo' contentKey={this.props.contentKey} shareMessage={this.props.shareMessage} targetKey={this.props.targetKey} type={'share'}></CardIconButtonShare>
                            </View>
                        </View>
                    </View>
                    <View accessible={true} accessibilityLabel={'DefaultStorePromoCardContainerView2'} style={style.bottomContainer}>
                        <View accessible={true} style={style.bottomLeftContainer}>
                            <Image accessible={true} accessibilityLabel={'DefaultStorePromoCardFooterImage'} source={{ uri: this.props.image }} style={style.storeThumbnail}></Image>
                        </View>
                        <View accessible={true} style={style.bottomCenterContainer}>
                            <Text accessible={true} accessibilityLabel={'DefaultStorePromoCardRestoName'} numberOfLines={1} preset={Text.preset.titleH4_5B} style={style.storeNameText}>{(this.props.storeName).toUpperCase()}</Text>
                            <Text accessible={true} accessibilityLabel={'DefaultStorePromoCardRestoCategory'} numberOfLines={1} preset={Text.preset.titleH6B} style={style.typeAndLocationText}>{VisitorHelper.getLocalizeDataFromLookUp('StoreCategory',this.props.storeCategory,this._language)}</Text>
                            <Text accessible={true} accessibilityLabel={'DefaultStorePromoCardPlaceName'} numberOfLines={1} preset={Text.preset.titleH6B} style={style.typeAndLocationText}>{this.props.placeName}, {VisitorHelper.getLocalizeDataFromLookUp('City',this.props.location,this._language)}</Text>
                            <Text accessible={true} accessibilityLabel={'DefaultStorePromoCardFooterLike'} numberOfLines={1} preset={Text.preset.titleH6B} style={style.typeAndLocationText}>{this.props.footerLikeCount} {this.props.likeText}</Text>
                        </View>
                        <View accessible={true} style={style.bottomRightContainer}>
                            <DateTag accessible={true} accessibilityLabel={'DefaultStorePromoCardDateTag'} style={style.dateTag} startDate={this.props.startDate} endDate={this.props.endDate}></DateTag>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        );
    }
}
