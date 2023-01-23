import React from 'react';
import { SGBaseContainer } from '../../core/container/SGBaseContainer';
import { SGView as View, SGText as Text, SGImage as Image, SGTouchableOpacity as TouchableOpacity, SGViewPager as ViewPager, SGScrollView as ScrollView, SGPopView,SGDialogBox } from '../../core/control';
import { StyleSheet,Linking } from 'react-native';
import { CardIconButton,CardIconButtonLike,CardIconButtonComment,CardIconButtonShare } from '../component_V2/CardIconButton';
import { SGLocalize } from '../locales/SGLocalize';
import { SGHelperNavigation, SGHelperGlobalVar, SGHelperType,SGHelperErrorHandling } from '../../core/helper';
import { DiscountTag } from '../component_V2/DiscountTag';
import { VisitorHelper } from '../helper/VisitorHelper';
import { tbVUserViewAPI } from '../api/tbVUserViewAPI';
import image from '../asset/image';

export class WhatToEatDetailHeader extends SGBaseContainer {
    createStyleSheet = (whp) => {
        var { w, h, p } = whp;
        return StyleSheet.create({
            throwWHP: { width: w, height: h, padding: p },
            mainContainer: { width: w, backgroundColor: '#FFFFFF', justifyContent: 'flex-start', alignContent: 'center', marginTop: p * 4 },
            sliderContainer: { width: w - p * 10, height: (w - p * 10) * 0.98, backgroundColor: '#FFFFFF', borderRadius: p * 2, marginBottom: 0 },
            sliderImage: { width: w - p * 10, height: (w - p * 10) * 0.9, resizeMode: 'cover', alignSelf: 'center', marginVertical: 0, marginHorizontal: 0, borderRadius: p * 3 },
            productDetailContainer: { width: w - p * 10, flexDirection: 'column', justifyContent: 'flex-start' },
            productNameText: { color: '#000000', alignSelf: 'flex-start', marginBottom: p * 5 },
            likedCountText: { color: '#7C7C7C', alignSelf: 'flex-start', marginBottom: p * 3 },
            bottomContainer: { width: w - p * 10, flexDirection: 'row', justifyContent: 'space-between', marginBottom: p * 3 },
            firstContainer: { flexDirection: 'row', justifyContent: 'flex-start' },
            secondContainer: { width: w - p * 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
            normalPriceText: { color: '#000000' },
            promoPriceText: { color: 'red' },
            leftContainer: { flexDirection: 'row', justifyContent: 'flex-start' },
            footerTextView: { width:(w - p * 10)*0.35,justifyContent: 'flex-start', alignItems: 'flex-start'},
            textFooter1: { color: '#606060', maxWidth: w * 0.6 },
            textFooter2: { color: '#7a7a7a', maxWidth: w * 0.6 },
            textFooter3: { color: '#909090', maxWidth: w * 0.6 },
            rightContainer: { flexDirection: 'row', justifyContent: 'flex-start' },
            iconButtonView: { width: (w - p * 10)*0.45, flexDirection: 'row', justifyContent: 'flex-end', alignSelf: 'center'},
            iconwhatsapp: { width: w * 0.08, height: w * 0.08, resizeMode: 'contain', backgroundColor: 'transparent' },
        });
    }

    constructor(props, context, ...args) {
        super(props, context, ...args);
        this.whp = { w: props.style.width, h: props.style.height, p: props.style.padding }
        this.style = this.createStyleSheet(this.whp);
        this.title = props.title;
        this.pvID1 = SGPopView.getPopViewID();
        this.state = { selectedVariation: 0 };
        this._language = SGHelperGlobalVar.getVar('GlobalLanguage')
    }

    onShowHandler(pvID) {
        SGPopView.showPopView(pvID);
    }

    onVariationPress(index) {
        this.setState({ selectedVariation: index });
        this.onShowHandler(this.pvID1);
    }

    handleLink(url) {
        var valid = SGHelperType.validURL(url)
        if (valid) {
            Linking.canOpenURL(url
            ).then(supported => {
                    if ((SGHelperType.left(url, 8) != 'https://')) {
                        Linking.openURL('https://' + url);
                    } else {
                        Linking.openURL(url);
                    }
            });
        } else {
            SGDialogBox.showFail(null, SGLocalize.translate("globalText.FailText"), SGLocalize.translate('globalText.notSupportedLink'), SGLocalize.translate('globalText.ok'), () => { }, true);
        }
    };

    whatsappEnjoyer(data) {
        try {
            console.log('whatsappenjoyer')
            console.log(data);
            var checkTrueData = true;

            // cek nomor whatsapp depanny ap
            if (data[0] == '+') var trueData = data.replace('+62', '');
            else if (data[0] == '0') var trueData = data.replace('0', '');
            else if (data[0] == '6') var trueData = data.replace('62', '');
            else {
                var trueData = data;
                checkTrueData = false;
            }

            // Buat android yg gada replaceAll
            if (typeof String.prototype.replaceAll == "undefined") {
                String.prototype.replaceAll = function (match, replace) {
                    return this.replace(new RegExp(match, 'g'), () => replace);
                }
            }

            // kalo format nomor whatsapp bener
            if (checkTrueData) {
                trueData = trueData.replaceAll('-', '');
                trueData = trueData.replaceAll(' ', '');
                trueData = trueData.replaceAll('–', '');
            }

            // this.handleLink.bind(this, this.data.whatsapp);
            this.handleLink('https://wa.me/62' + trueData);
            
            dataHeader = this.props.headerData;
            var jsonInput = { fID: '', fContentType: 'Whatsapp',  fTargetKey: this.props.data.storeKey, fUserKey: '', fActive: 'Y', fCreatedByID: '', fCreatedDate: new Date(), fLastModifiedByID: '', fLastModifiedDate: new Date() }
            this._addUserClick(jsonInput)

        } catch {
            console.log('WHATSAPP NOT FOUND KEKW');
        }
    }

    _addUserClick(jsonInput){
        tbVUserViewAPI.addUserClick(jsonInput).then(()=>{}).catch((error)=>{
            SGHelperErrorHandling.Handling(error,this._addUserClick(this,jsonInput))
        })
    }

    render() {
        var { w, h, p } = this.whp;
        var style = this.style;
        var data = this.props.data;
        var dataContent = data['fContentRec' + this.props.language.toUpperCase()];
        var dataContentFooter = data['fContentResto' + this.props.language.toUpperCase()];
        var shareParams = { MallName:data['fBuildingName' + this.props.language.toUpperCase()],StorestoName: dataContentFooter.fStoreName, ProductName:dataContent.fRecName }
        console.log(data);
        return (
            <View accessible={true} accessibilityLabel={'WhatToEatDetailHeaderRootView'} style={style.mainContainer}>
                <ViewPager accessible={true} accessibilityLabel={'WhatToEatDetailHeaderViewPager'} style={style.sliderContainer} initialPage={0} showPageIndicator={true} transitionStyle={'scroll'} pageIndicatorStyle={{ position: 'absolute', bottom: 0, marginVertical: 0, flexDirection: 'row', alignSelf: 'center' }}>
                    {(dataContent.fImageJSON).map((x, index) => {
                        return (
                            <View accessible={true} accessibilityLabel={'WhatToEatDetailHeaderViewImage'} key={x.id} style={{ justifyContent: 'flex-start' }}>
                                <Image accessible={true} accessibilityLabel={'WhatToEatDetailHeaderImageSetting'} style={style.sliderImage} source={{ uri: x[this.props.imageSetting].uri }}>
                                    {data.fCRecPromoPrice !== data.fCRecNormalPrice ? <DiscountTag accessible={true} accessibilityLabel={'WhatToGiftDetailHeaderDiscountTag'} normalPrice={data.fCRecNormalPrice} promoPrice={data.fCRecPromoPrice} style={{ position: 'absolute', top: p, right: p * 2 }}></DiscountTag> : null}
                                </Image>
                            </View>
                        )
                    })}
                </ViewPager>
                <View accessible={true} style={style.productDetailContainer}>
                    <Text accessible={true} accessibilityLabel={'WhatToEatResultDetailScreenTitleRecName'} preset={Text.preset.titleH1B} style={style.productNameText}>{(this.props.productName).toUpperCase()}</Text>
                    <Text accessible={true} accessibilityLabel={'WhatToEatResultDetailScreenContentLike'} preset={Text.preset.titleH4_5B} style={style.likedCountText}>{this.props.contentLikeCount} {SGLocalize.translate('globalText.likeCountText')}</Text>
                </View>
                <View accessible={true} style={style.bottomContainer}>
                    {data.fCRecPromoPrice !== data.fCRecNormalPrice ?
                        (<View accessible={true} style={style.firstContainer}>
                            <Text accessible={true} accessibilityLabel={'WhatToEatDetailHeaderNormalPriceText'} numberOfLines={1} preset={Text.preset.titleH3B} style={{...style.normalPriceText,textDecorationLine: 'line-through' }}>{this.props.currency} {VisitorHelper._showPriceText(data.fCRecNormalPrice, data.fCurrency)}</Text>
                            <Text accessible={true} accessibilityLabel={'WhatToEatDetailHeaderPromoPriceText'} numberOfLines={1} preset={Text.preset.titleH2B} style={style.promoPriceText}>{this.props.currency} {VisitorHelper._showPriceText(data.fCRecPromoPrice, data.fCurrency)}</Text>
                        </View>)
                        :
                        (<View accessible={true} style={style.firstContainer}>
                            <Text accessible={true} accessibilityLabel={'WhatToEatDetailHeaderNormalPriceText'} numberOfLines={1} preset={Text.preset.titleH3B} style={style.textNormalPrice}>{this.props.currency} {VisitorHelper._showPriceText(data.fCRecNormalPrice, data.fCurrency)}</Text>
                        </View>)
                    }
                </View>
                <View accessible={true} style={style.secondContainer}>
                    <TouchableOpacity onPress={() => { SGHelperNavigation.navigatePush(this.props.navigator, 'RestoHome', { contentKey: data.restoKey }) }}>
                        <View accessible={true} accessibilityLabel={'WhatToEatDetailHeaderFooterRootView'} style={style.leftContainer}>
                            <Image accessible={true} accessibilityLabel={'WhatToGiftDetailHeaderStoreImage'} style={style.footerImage} source={{ uri: dataContentFooter.fStoreImageJSON[0][this.props.imageSetting].uri }}></Image>
                            <View accessible={true} accessibilityLabel={'WhatToEatDetailHeaderFooterTextView'} style={style.footerTextView}>
                                <Text accessible={true} accessibilityLabel={'WhatToEatDetailHeaderFooterStoreName'} numberOfLines={2} preset={Text.preset.titleH4B} style={style.textFooter1} >{dataContentFooter.fStoreName}</Text>
                                <Text accessible={true} accessibilityLabel={'WhatToEatDetailHeaderFooterStoreContent'} numberOfLines={1} preset={Text.preset.titleH5B} style={style.textFooter2}>{VisitorHelper.getLocalizeDataFromLookUp('RestoCategory',data.restoCategory,this._language)}, {VisitorHelper.getLocalizeDataFromLookUp('CuisineCategory',data.restoCuisine,this._language)}</Text>
                                <Text accessible={true} accessibilityLabel={'WhatToEatDetailHeaderFooterBuildingName'} numberOfLines={1} preset={Text.preset.titleH6B} style={style.textFooter2}>{data['fBuildingName' + this.props.language.toUpperCase()]}</Text>
                                <Text accessible={true} accessibilityLabel={'WhatToEatDetailHeaderFooterLikeCountStore'} numberOfLines={1} preset={Text.preset.titleH6B} style={style.textFooter3}>{data['fLikeCountResto']} {SGLocalize.translate('globalText.likeCountText')}</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                    <View accessible={true} accessibilityLabel={'WhatToEatDetailHeaderFooterTextView'} style={style.iconButtonView}>
                        <CardIconButtonLike onIconPressed={this.props.onLike} accessible={true} accessibilityLabel={'WhatToEatDetailHeaderLikeButton'} likePackage={this.props.likePackage} textColor='#bebebe' navigator={this.props.navigator} contentType='WhatToEat' contentKey={data.key} active={data.fUserLikedThis} type={'like'} style={style.iconButton}></CardIconButtonLike>
                        <CardIconButtonComment accessible={true} accessibilityLabel={'WhatToEatDetailHeaderCommentButton'} commentPackage={this.props.commentPackage} textColor='#bebebe' navigator={this.props.navigator} contentType='WhatToEat' contentKey={data.key} canComment={data.fCanComment} type={'comment'} style={style.iconButton}></CardIconButtonComment>
                        <CardIconButtonShare shareParams = {shareParams} img={(dataContent.fImageJSON[0].thumbnailLow['uri'])} accessible={true} accessibilityLabel={'WhatToEatDetailHeaderShareButton'} textColor='#bebebe' navigator={this.props.navigator} contentCreatorKey={data.storeKey} contentType='WhatToEat' contentKey={data.key} shareMessage={dataContent.fShareMessage} targetKey={dataContent.restoKey} type={'share'} style={style.iconButton}></CardIconButtonShare>
                        {(this.props.whatsapp !== '' && this.props.whatsapp !== '–' && this.props.whatsapp !== ' ' && this.props.whatsapp !== '-') &&
                                <TouchableOpacity onPress={() => { this.whatsappEnjoyer(this.props.whatsapp) }}>
                                    <Image accessible={true} source={{ uri: image.iconWhatsapp[this.props.imageSetting].url }} style={style.iconwhatsapp}></Image>
                                </TouchableOpacity>
                            }
                    </View>
                </View>
            </View>

        );
    }
}