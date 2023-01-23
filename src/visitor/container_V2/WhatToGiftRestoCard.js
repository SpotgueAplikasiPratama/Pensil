import React from 'react';
import { SGBaseContainer } from '../../core/container/SGBaseContainer';
import { SGView as View, SGText as Text, SGImage as Image, SGTouchableOpacity as TouchableOpacity } from '../../core/control';
import { StyleSheet } from 'react-native';
import { CardIconButton,CardIconButtonLike,CardIconButtonComment,CardIconButtonShare } from '../component_V2/CardIconButton';
import { DiscountTag } from '../component_V2/DiscountTag';
import { SGHelperNavigation, SGHelperGlobalVar, SGHelperType,SGHelperErrorHandling } from '../../core/helper';
import { SGLocalize } from '../locales/SGLocalize';
import { tbLookupDAO } from '../db/tbLookupDAO';
import { VisitorHelper } from '../helper/VisitorHelper';
import { tbVUserViewAPI } from '../api/tbVUserViewAPI';

export class WhatToGiftRestoCard extends SGBaseContainer {
    createStyleSheet = (whp) => {
        var { w, h, p } = whp;
        return StyleSheet.create({
            mainContainer: { width: w, padding: p, backgroundColor: '#FFFFFF', overflow: 'visible', marginTop: p * 3, borderTopRightRadius: p * 3, paddingHorizontal: 0, paddingVertical: 0, justifyContent: 'flex-start', alignItems: 'flex-start' },
            topContainer: { width: w, flexDirection: 'row', justifyContent: 'flex-start', paddingHorizontal: p * 3 },
            leftContainer: { width: w * 0.3 },
            image: { width: (w - p * 2) * 0.275, height: (w - p * 2) * 0.275, resizeMode: 'cover', borderRadius: p * 3 },
            likeText: { color: '#A9A9A9' },
            rightContainer: { width: w * 0.6, height: w * 0.335, marginTop: p, marginBottom: p, paddingLeft: p, paddingTop: p * 2, flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'space-between', overflow: 'visible' },
            storeDetailsContainer: { flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'flex-start' },
            menuNameText: { color: '#000000', marginTop: 0, marginBottom: p * 3 },
            foodPreferenceText: { color: '#989898', marginTop: 0 },
            priceView: { flexDirection: 'row', marginTop: p, marginHorizontal: 0 },
            textPrice: { color: '#7D7D7D', marginVertical: 0 },
            textPriceStrike: { color: '#7D7D7D', textDecorationLine: 'line-through', marginVertical: 0 },
            promoPrice: { color: '#f94d50', marginVertical: 0 },
            iconContainer: { flexDirection: 'row' },
            icon: { width: w, height: h, padding: p },
            bottomContainer: { width: w, borderTopColor: '#E5E5E5', borderTopWidth: w * 0.0015, flexDirection: 'row', justifyContent: 'flex-start' },
            bottomLeftContainer: { width: w * 0.23, paddingLeft: p * 2, marginVertical: p * 1.5 },
            storeThumbnail: { width: (w - p * 2) * 0.18, height: (w - p * 2) * 0.18, resizeMode: 'cover', borderRadius: p * 2.5, marginBottom: 0 },
            bottomRightContainer: { width: w * 0.5, justifyContent: 'flex-start', alignItems: 'flex-start', marginLeft: 0 },
            storeNameText: { color: '#3E3E3E', marginTop: 0 },
            storeLocationText: { color: '#989898', marginTop: 0 },

            mainView1: { backgroundColor: '#ededed', marginHorizontal: 0, marginVertical: 3 * p, width: w, justifyContent: 'flex-start', padding: p, marginBottom: 2 * p, borderTopRightRadius: 3 * p },
            contentView: { overflow: 'visible', flexDirection: 'row', alignItems: 'flex-start', alignSelf: 'flex-start' },
            containerView1: { marginBottom: p, padding: p },
            containerView2: { flex: 1, height: w * 0.35, justifyContent: 'space-between', alignItems: 'flex-start', marginLeft: -1 * p, alignSelf: 'flex-start', marginBottom: p, padding: p, paddingLeft: 3 * p },
            image: { width: (w - 2 * p) * 0.275, height: (w - 2 * p) * 0.275, resizeMode: 'cover', backgroundColor: 'white', borderRadius: 3 * p, marginHorizontal: 4 * p },
            text1: { color: '#909090', },
            textMenuName: { color: '#606060', marginTop: 3 * p, maxWidth: w * 0.475 },
            priceView: { flexDirection: 'row', marginTop: p, marginHorizontal: 0 },
            textPrice: { color: '#7a7a7a', textDecorationLine: (this.props.promoPrice !== this.props.normalPrice) ? 'line-through' : null, marginVertical: 0, },
            promoPrice: { color: '#e43a36', marginVertical: 0, },
            iconButtonContainer: { marginLeft: - 2 * p, flexDirection: 'row', width: 0.35 * w, justifyContent: 'space-around', marginTop: 1.5 * p, marginHorizontal: 0 },
            textFooter1: { color: '#606060', maxWidth: w * 0.4, marginVertical: 0 },
            textFooter2: { color: '#7a7a7a', maxWidth: w * 0.4, marginVertical: 0 },
            textFooter3: { color: '#909090', maxWidth: w * 0.4, marginTop: p, marginVertical: 0 },
            footerView: { height: w * 0.21, width: w * 0.8, backgroundColor: 'white', flexDirection: 'row', justifyContent: 'flex-start', alignSelf: 'flex-start', marginBottom: -p, marginLeft: -p, borderTopRightRadius: 2 * p, borderBottomWidth: 0.2 * p, borderColor: '#D3D3D3', borderWidth: 0.075 * p },
            footerImage: { marginLeft: 6 * p, backgroundColor: 'white', height: w * 0.15, width: w * 0.15, borderWidth: p * 0.01 },
            footerTextView: { marginLeft: 3 * p, marginVertical: 4 * p, alignItems: 'flex-start' },
            textFoodPreference: { marginVertical: p, color: '#7a7a7a' }
        });
    }

    constructor(props, context, ...args) {
        super(props, context, ...args);
        this.whp = { w: props.style.width, h: props.style.height, p: props.style.padding }
        this.style = this.createStyleSheet(this.whp);
        this._language = SGHelperGlobalVar.getVar('GlobalLanguage')
    }

    _onCardClick(){
        console.log('card click')
        var data = this.props.data;
        var jsonInput = { fID: '', fContentType: 'WhatToGiftResult',  fTargetKey: data.fBuildingKey, fUserKey: '', fActive: 'Y', fCreatedByID: '', fCreatedDate: new Date(), fLastModifiedByID: '', fLastModifiedDate: new Date() }
        this._addUserClick(jsonInput)
        SGHelperNavigation.navigatePush(this.props.navigator, 'WhatToGiftResultDetail', { contentKey: this.props.contentKey })
    }

    _addUserClick(jsonInput){
        console.log('user click');
        tbVUserViewAPI.addUserClick(jsonInput).then(()=>{}).catch((error)=>{
            SGHelperErrorHandling.Handling(error,this._addUserClick(this,jsonInput))
        })
    }


    render() {
        var { w, h, p } = this.whp;
        var style = this.style;
        var data = this.props.data;
        var dataContent = data['fContent' + this.props.language.toUpperCase()];
        var dataContentFooter = data['fContentStore' + this.props.language.toUpperCase()];
        var shareParams = { MallName:data['fBuildingName' + this.props.language.toUpperCase()],StorestoName: dataContentFooter.fStoreName, ProductName:dataContent.fRecName }
        console.log(data);
        return (
            <TouchableOpacity onPress={() => this._onCardClick()}>
                <View accessible={true} accessibilityLabel={'WhatToGiftRestoCardRootView'} style={style.mainContainer}>
                    <View accessible={true} accessibilityLabel={'WhatToGiftRestoCardContentView'} style={style.topContainer}>
                        <View accessible={true} accessibilityLabel={'WhatToGiftRestoCardContentView2'} style={style.leftContainer}>
                            <Image accessible={true} accessibilityLabel={'WhatToGiftRestoCardSettingImage'} shadow style={style.image} source={{ uri: (dataContent.fImageJSON[0][this.props.imageSetting]['uri']) }}></Image>
                            <Text accessible={true} accessibilityLabel={'WhatToGiftRestoCardLikeCountRec'} preset={Text.preset.titleH6} style={style.likeText}>{data.fLikeCountRec} {this.props.likeText}</Text>
                        </View>
                        <View accessible={true} accessibilityLabel={'WhatToGiftRestoCardMenuView'} style={style.rightContainer}>
                            <Text accessible={true} accessibilityLabel={'WhatToGiftRestoCardMenuName'} preset={Text.preset.titleH3B} numberOfLines={3} style={style.menuNameText}>{(dataContent.fRecName).toUpperCase()}</Text>
                            <Text accessible={true} accessibilityLabel={'WhatToGiftRestoCardFoodPreference'} preset={Text.preset.titleH4_5B} numberOfLines={1} style={style.foodPreferenceText}>{SGLocalize.translate("isHalal." + (data.isHalal))}{data.isVegetarian === 'Y' ? SGLocalize.translate("isVegetarian." + (data.isVegetarian)) : ''}</Text>
                            <View accessible={true} accessibilityLabel={'WhatToGiftRestoCardPriceView'} style={style.priceView}>
                                <Text accessible={true} accessibilityLabel={'WhatToGiftRestoCardNormalPrice'} preset={Text.preset.titleH4B} numberOfLines={1} style={data.fCRecPromoPrice !== data.fCRecNormalPrice ? style.textPriceStrike : style.textPrice}>{this.props.currency} {VisitorHelper._showPriceText(data.fCRecNormalPrice, data.fCurrency)}</Text>
                                {data.fCRecPromoPrice !== data.fCRecNormalPrice ? (<Text accessible={true} accessibilityLabel={'WhatToGiftRestoCardPromoPrice'} preset={Text.preset.titleH4B} numberOfLines={1} style={style.promoPrice}>{this.props.currency} {VisitorHelper._showPriceText(data.fCRecPromoPrice, data.fCurrency)}</Text>) : null}
                            </View>
                            <View accessible={true} accessibilityLabel={'WhatToGiftRestoCardIconButtonView'} style={style.iconContainer}>
                                <CardIconButtonLike onIconPressed={this.props.onLike} accessible={true} accessibilityLabel={'WhatToGiftRestoCardIconLike'} likePackage={this.props.likePackage} navigator={this.props.navigator} contentType='RestoWhatToGift' contentKey={this.props.contentKey} active={data.fUserLikedThis} type={'like'}></CardIconButtonLike>
                                <CardIconButtonComment accessible={true} accessibilityLabel={'WhatToGiftRestoCardIconComment'} commentPackage={this.props.commentPackage} navigator={this.props.navigator} contentType='RestoWhatToGift' contentKey={this.props.contentKey} canComment={data.fCanComment} type={'comment'}></CardIconButtonComment>
                                <CardIconButtonShare shareParams = {shareParams} img={(dataContent.fImageJSON[0].thumbnailLow['uri'])} accessible={true} accessibilityLabel={'WhatToGiftRestoCardIconShare'} navigator={this.props.navigator} contentType='RestoWhatToGift' contentKey={this.props.contentKey} shareMessage={dataContent.fShareMessage} targetKey={dataContent.fStoreKey} type={'share'}></CardIconButtonShare>
                            </View>
                        </View>
                        {data.fCRecPromoPrice !== data.fCRecNormalPrice ? <DiscountTag accessible={true} accessibilityLabel={'WhatToGiftRestoCardDiscountTag'} normalPrice={data.fCRecNormalPrice} promoPrice={data.fCRecPromoPrice} style={{ position: 'absolute', top: p, right: p * 2 }}></DiscountTag> : null}
                    </View>
                    <View accessible={true} accessibilityLabel={'WhatToGiftRestoCardFooterView'} shadowIntensity={0.2} style={style.bottomContainer}>
                        <View accessible={true} style={style.bottomLeftContainer}>
                            <Image accessible={true} accessibilityLabel={'WhatToGiftRestoCardFooterImage'} source={{ uri: dataContentFooter.fStoreImageJSON[0][this.props.imageSetting].uri }} style={style.storeThumbnail}></Image>
                        </View>
                        <View accessible={true} accessibilityLabel={'WhatToGiftRestoCardFooterTextView'} style={style.bottomRightContainer}>
                            <Text accessible={true} accessibilityLabel={'WhatToGiftRestoCardRestoName'} numberOfLines={1} preset={Text.preset.titleH4_5B} style={style.storeNameText}>{(dataContentFooter.fStoreName).toUpperCase()}</Text>
                            <Text accessible={true} accessibilityLabel={'WhatToGiftRestoCardRestoCategoryCuisine'} numberOfLines={1} preset={Text.preset.titleH5} style={style.storeLocationText}>{VisitorHelper.getLocalizeDataFromLookUp('RestoCategory',data.storeCategory,this._language)}, {VisitorHelper.getLocalizeDataFromLookUp('CuisineCategory',data.restoCuisine,this._language)}</Text>
                            <Text accessible={true} accessibilityLabel={'WhatToGiftRestoCardBuildingName'} numberOfLines={1} preset={Text.preset.titleH5} style={style.storeLocationText}>{data['fBuildingName' + this.props.language.toUpperCase()]}</Text>
                            <Text accessible={true} accessibilityLabel={'WhatToGiftRestoCardFooterLikeCount'} numberOfLines={1} preset={Text.preset.titleH5} style={style.storeLocationText}>{data['fLikeCountStore']} {this.props.likeText}</Text>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        );
    }
}