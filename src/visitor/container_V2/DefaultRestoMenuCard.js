import React from 'react';
import { SGBaseContainer } from '../../core/container/SGBaseContainer';
import { SGView as View, SGText as Text, SGImage as Image, SGTouchableOpacity as TouchableOpacity } from '../../core/control';
import { StyleSheet } from 'react-native';
import { CardIconButton,CardIconButtonLike,CardIconButtonComment,CardIconButtonShare } from '../component_V2/CardIconButton';
import { DiscountTag } from '../component_V2/DiscountTag';
import { SGHelperNavigation, SGHelperGlobalVar } from '../../core/helper';
import { SGLocalize } from '../locales/SGLocalize';
import { tbLookupDAO } from '../db/tbLookupDAO';
import { VisitorHelper } from '../helper/VisitorHelper';


export class DefaultRestoMenuCard extends SGBaseContainer {
    createStyleSheet = (whp) => {
        var { w, h, p } = whp;
        return StyleSheet.create({
            mainContainer: { width: w, padding: p, backgroundColor: '#FFFFFF', overflow: 'visible', borderTopRightRadius: p * 3, paddingHorizontal: 0, paddingVertical: 0, marginVertical: this.props.slider ? 0 : p, justifyContent: 'flex-start', alignItems: 'flex-start' },
            topContainer: { width: w, flexDirection: 'row', justifyContent: 'flex-start', paddingHorizontal: p * 3 },
            leftContainer: { width: w * 0.3 },
            image: { width: (w - p * 2) * 0.275, height: (w - p * 2) * 0.275, resizeMode: 'cover', borderRadius: p * 3 },
            likeText: { color: '#A9A9A9' },
            rightContainer: { width: w * 0.6, height: w * 0.335, marginTop: p, marginBottom: p, paddingLeft: p, paddingTop: p * 2, flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'space-between', overflow: 'visible' },
            storeDetailsContainer: { flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'flex-start' },
            menuNameText: { width: w * 0.53, color: '#000000', marginTop: 0, marginBottom: p * 3 },
            foodPreferenceText: { color: '#989898', marginTop: 0 },
            priceView: { flexDirection: 'row', marginTop: p, marginHorizontal: 0 },
            textPrice: { color: '#7D7D7D', marginVertical: 0 },
            textPriceStrike: { color: '#7D7D7D', textDecorationLine: 'line-through', marginVertical: 0 },
            promoPrice: { color: '#f94d50', marginVertical: 0 },
            iconContainer: { flexDirection: 'row' },
            icon: { width: w, height: h, padding: p },
            bottomContainer: { width: w, borderTopColor: '#E5E5E5', borderTopWidth: w * 0.0015, flexDirection: 'row', justifyContent: 'flex-start' },
            bottomLeftContainer: { width: w * 0.23, paddingLeft: p * 2, marginVertical: p * 1.5 },
            storeThumbnail: { width: (w - p * 2) * 0.18, height: (w - p * 2) * 0.18, resizeMode: 'cover', borderRadius: p * 2.5, marginBottom: p },
            bottomRightContainer: { width: w * 0.5, justifyContent: 'flex-start', alignItems: 'flex-start', marginLeft: 0 },
            storeNameText: { color: '#3E3E3E', marginTop: 0 },
            storeLocationText: { color: '#989898', marginTop: 0 },
        });
    }

    constructor(props, context, ...args) {
        super(props, context, ...args);
        this.whp = { w: props.style.width, h: props.style.height, p: props.style.padding }
        this.style = this.createStyleSheet(this.whp);
        this.currency = SGHelperGlobalVar.getVar('GlobalCurrency');
        this._language = SGHelperGlobalVar.getVar('GlobalLanguage')
    }

    render() {
        var { w, h, p } = this.whp;
        var style = this.style;
        var data = this.props.headerData;
        var shareParams = {MallName:this.props.placeName, StorestoName:this.props.restoName, ProductName:this.props.menuName  }

        return (
            <TouchableOpacity onPress={() => SGHelperNavigation.navigatePush(this.props.navigator, 'RestoMenuDetail', { contentKey: this.props.contentKey, restoKey: this.props.restoKey })}>
                <View accessible={true} accessibilityLabel={'DefaultRestoMenuCardRootView'} style={style.mainContainer}>
                    <View accessible={true} accessibilityLabel={'DefaultRestoMenuCardContentView'} style={style.topContainer}>
                        <View accessible={true} accessibilityLabel={'DefaultRestoMenuCardTopView'} style={style.leftContainer}>
                            <Image accessible={true} accessibilityLabel={'DefaultRestoMenuCardImage'} shadow style={style.image} source={{ uri: this.props.contentImage }}></Image>
                            <Text accessible={true} accessibilityLabel={'DefaultRestoMenuCardLikeCount'} preset={Text.preset.titleH6B} style={style.likeText}>{this.props.contentLikeCount} {this.props.likeText}</Text>
                        </View>
                        <View accessible={true} accessibilityLabel={'DefaultRestoMenuCardMenuView'} style={style.rightContainer}>
                            <Text accessible={true} accessibilityLabel={'DefaultRestoMenuCardMenuName'} preset={Text.preset.titleH3B} numberOfLines={3} style={style.menuNameText}>{(this.props.menuName).toUpperCase()}</Text>
                            <View accessible={true} accessibilityLabel={'DefaultRestoMenuCardPriceView'} style={style.priceView}>
                                <Text accessible={true} accessibilityLabel={'DefaultRestoMenuCardPriceText'} preset={Text.preset.titleH4B} numberOfLines={1} style={this.props.promoPrice !== this.props.normalPrice ? style.textPriceStrike : style.textPrice}>{this.currency} {VisitorHelper._showPriceText(this.props.normalPrice, this.props.fCurrency)}</Text>
                                {this.props.promoPrice !== this.props.normalPrice ? (<Text accessible={true} accessibilityLabel={'DefaultRestoMenuCardDiscPriceText'} preset={Text.preset.titleH4B} numberOfLines={1} style={style.promoPrice}>{this.currency} {VisitorHelper._showPriceText(this.props.promoPrice, this.props.fCurrency)}</Text>) : null}
                            </View>
                            <View accessible={true} accessibilityLabel={'DefaultRestoMenuCardIconButtonView'} style={style.iconContainer}>
                                <CardIconButtonLike onIconPressed={this.props.onLike} accessible={true} accessibilityLabel={'DefaultRestoMenuCardLikeIcon'} likePackage={this.props.likePackage} navigator={this.props.navigator} contentType='RestoMenu' contentKey={this.props.contentKey} active={this.props.like} type={'like'}></CardIconButtonLike>
                                <CardIconButtonComment accessible={true} accessibilityLabel={'DefaultRestoMenuCardCommentIcon'} commentPackage={this.props.commentPackage} navigator={this.props.navigator} contentType='RestoMenu' contentKey={this.props.contentKey} canComment={this.props.canComment} type={'comment'}></CardIconButtonComment>
                                <CardIconButtonShare shareParams={shareParams} img={this.props.contentImageShareButton} accessible={true} accessibilityLabel={'DefaultRestoMenuCardShareIcon'} navigator={this.props.navigator} contentType='RestoMenu' contentKey={this.props.contentKey} shareMessage={this.props.shareMessage} targetKey={this.props.targetKey} type={'share'}></CardIconButtonShare>
                            </View>
                        </View>
                        {this.props.promoPrice !== this.props.normalPrice ? <DiscountTag accessible={true} accessibilityLabel={'DefaultRestoMenuCardDiscTag'} normalPrice={this.props.normalPrice} promoPrice={this.props.promoPrice} style={{ position: 'absolute', top: p, right: p * 2 }}></DiscountTag> : null}
                    </View>
                    <View accessible={true} accessibilityLabel={'DefaultRestoMenuCardFooterView'} shadowIntensity={0.2} style={style.bottomContainer}>
                        <View style={style.bottomLeftContainer}>
                            <Image accessible={true} accessibilityLabel={'DefaultRestoMenuCardFooterImage'} source={{ uri: this.props.footerImage }} style={style.storeThumbnail}></Image>
                        </View>
                        <View accessible={true} accessibilityLabel={'DefaultRestoMenuCardFooterTextView'} style={style.bottomRightContainer}>
                            <Text accessible={true} accessibilityLabel={'DefaultRestoMenuCardRestoName'} numberOfLines={1} preset={Text.preset.titleH4_5B} style={style.storeNameText}>{(this.props.restoName).toUpperCase()}</Text>
                            <Text accessible={true} accessibilityLabel={'DefaultRestoMenuCardRestoCategory'} numberOfLines={1} preset={Text.preset.titleH6B} style={style.storeLocationText}>{VisitorHelper.getLocalizeDataFromLookUp('RestoCategory',this.props.restoCategory,this._language)}, {VisitorHelper.getLocalizeDataFromLookUp('CuisineCategory',this.props.restoCuisine,this._language)}</Text>
                            <Text accessible={true} accessibilityLabel={'DefaultRestoMenuCardPlaceName'} numberOfLines={1} preset={Text.preset.titleH6B} style={style.storeLocationText}>{this.props.placeName}, {VisitorHelper.getLocalizeDataFromLookUp('City',this.props.location,this._language)}</Text>
                            <Text accessible={true} accessibilityLabel={'DefaultRestoMenuCardFooterLikeCount'} numberOfLines={1} preset={Text.preset.titleH6B} style={style.storeLocationText}> {this.props.footerLikeCount} {this.props.likeText}</Text>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        );
    }
}