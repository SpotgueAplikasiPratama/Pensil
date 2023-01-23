import React from 'react';
import { SGBaseContainer } from '../../core/container/SGBaseContainer';
import { SGView as View, SGText as Text, SGImage as Image, SGTouchableOpacity as TouchableOpacity, SGViewPager as ViewPager, SGScrollView as ScrollView, SGPopView,SGIcon as Icon,SGDialogBox } from '../../core/control';
import { StyleSheet,Linking } from 'react-native';
import { CardIconButton,CardIconButtonLike,CardIconButtonComment,CardIconButtonShare } from '../component_V2/CardIconButton';
import { SGLocalize } from '../locales/SGLocalize';
import { SGHelperNavigation, SGHelperGlobalVar, SGHelperType,SGHelperErrorHandling } from '../../core/helper';
import { DiscountTag } from '../component_V2/DiscountTag';
import { ProductVariationPopup } from '../container_V2/ProductVariationPopup';
import { VisitorHelper } from '../helper/VisitorHelper';
import { tbVUserViewAPI } from '../api/tbVUserViewAPI';
import image from '../asset/image';

export class StoreProductDetailHeader extends SGBaseContainer {
    createStyleSheet = (whp) => {
        var { w, h, p } = whp;
        return StyleSheet.create({
            throwWHP: { width: w, height: h, padding: p },
            mainContainer: { width: w, backgroundColor: '#FFFFFF', justifyContent: 'flex-start', alignContent: 'center', marginTop: p * 4 },
            sliderContainer: { width: w - p * 10, height: (w - p * 10) * 0.98, backgroundColor: '#FFFFFF', borderRadius: p * 2, marginBottom: 0 },
            sliderImage: { width: w - p * 10, height: (w - p * 10)*0.98, resizeMode: 'cover', alignSelf: 'center', marginVertical: 0, marginHorizontal: 0, borderRadius: p * 2 },
            variationImage:{width:w*0.15,height:w*0.15,resizeMode:'contain'},
            productDetailContainer: { width: w - p * 10, flexDirection: 'column', justifyContent: 'flex-start' },
            productNameText: { color: '#000000', alignSelf: 'flex-start', marginBottom: p * 3 },
            likedCountText: { color: '#7C7C7C', alignSelf: 'flex-start', marginBottom: p * 3 },
            bottomContainer: { width: w - p * 10, flexDirection: 'row', justifyContent: 'space-between', marginBottom: p * 3 },
            leftContainer: { flexDirection: 'column', justifyContent: 'flex-start' },
            rightContainer: { flexDirection: 'column', justifyContent: 'flex-start',alignItems:'flex-end' },
            normalPriceText: { color: '#000000' },
            promoPriceText: { color: 'red' },
            chefAndSpicyContainer: { flexDirection: 'row', alignSelf: 'flex-end' },
            iconContainer: { flexDirection: 'row', justifyContent: 'flex-start' },
            addOnContainer: { width: w - p * 10 },
            addOnText: { color: '#000000', marginVertical: 0, alignSelf: 'flex-start' },
            addOnOptonalText: { color: '#7C7C7C', marginVertical: 0, alignSelf: 'flex-start' },
            addOnImage: { borderRadius: p * 10 },
            footerContainer: { width: w - p * 10, flexDirection: 'row', justifyContent: 'flex-start', marginBottom: p * 3,marginTop:3*p },
            placeThumbnailImage: { width: w * 0.165, height: w * 0.165, backgroundColor: '#FFFFFF', resizeMode: 'cover', borderRadius: p * 100 },
            footerTextView: { maxWidth: w * 0.65, justifyContent: 'flex-start', alignItems: 'flex-start' },
            textFooterName: { color: '#000000', marginVertical: 0 },
            textFooterContent: { color: '#bebebe', marginTop: 0, },
            textContentLiked: { color: '#bebebe', marginTop: 0.25 * p, marginBottom: 0 },
            overlay: {  width: w - p * 10, height: (w - p * 10) * 0.9, alignSelf: 'center', marginVertical: 0, marginHorizontal: 0, borderRadius: p * 2 ,backgroundColor: 'rgba(255,255,255,0.5)' },
            overlayVariationImage:{width:w*0.15,height:w*0.15,backgroundColor: 'rgba(255,255,255,0.5)'},
            shortDescText: {color: '#000000', alignSelf: 'flex-start'  },
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
        var dataContent = data['fContentProduct' + this.props.language.toUpperCase()];
        var dataContentFooter = data['fContentStore' + this.props.language.toUpperCase()];
        var shareParams = {MallName:data['fBuildingName' + this.props.language.toUpperCase()], StorestoName:dataContentFooter.fStoreName, ProductName:this.props.productName}
       
        return (
            <View accessible={true} style={style.mainContainer}>
                <ViewPager accessible={true} accessibilityLabel={'StoreProductDetailViewPager'} style={style.sliderContainer} initialPage={0} showPageIndicator={true} transitionStyle={'scroll'} pageIndicatorStyle={{ position: 'absolute', bottom: 0, marginVertical: 0, flexDirection: 'row', alignSelf: 'center' }}>
                    {(dataContent.fImageJSON).map((x, index) => {
                        return (
                            <View accessible={true} accessibilityLabel={'StoreProductDetailHeaderImageView1'} key={x.id} style={{ justifyContent: 'flex-start' }}>
                                {data.isProductAvailable == 'Y' &&
                                <Image accessible={true} accessibilityLabel={'StoreProductDetailHeaderImage'} style={style.sliderImage} source={{ uri: x[this.props.imageSetting].uri }}>
                                    {data.fCPromoPrice !== data.fCNormalPrice ? <DiscountTag accessible={true} accessibilityLabel={'ClothToBuyCardDiscountTag'} normalPrice={data.fCNormalPrice} promoPrice={data.fCPromoPrice} style={{ position: 'absolute', top: p, right: p * 2 }}></DiscountTag> : null}
                                </Image>
                                }
                                {data.isProductAvailable == 'N' &&
                                     <Image accessible={true} accessibilityLabel={'StoreProductDetailHeaderImage'} style={style.sliderImage} source={{ uri: x[this.props.imageSetting].uri }}>
                                            {data.fCPromoPrice !== data.fCNormalPrice ? <DiscountTag accessible={true} accessibilityLabel={'ClothToBuyCardDiscountTag'} normalPrice={data.fCNormalPrice} promoPrice={data.fCPromoPrice} style={{ position: 'absolute', top: p, right: p * 2 }}></DiscountTag> : null}
                                        <View style={style.overlay}>
                                        <Icon name={Icon.Icon.eyeOff} preset={Icon.preset.w7}></Icon>
                                        </View>
                                    </Image>
                                }
                            </View>
                        )
                    })}
                </ViewPager>
                <TouchableOpacity onPress={() => SGHelperNavigation.navigatePush(this.props.navigator, 'StoreHome', { contentKey: data.storeKey })}>
                    <View style={style.footerContainer}>
                        <Image style={style.placeThumbnailImage} source={{ uri: dataContentFooter.fStoreImageJSON[0][this.props.imageSetting].uri }}></Image>
                        <View style={style.footerTextView}>
                            <Text accessible={true} accessibilityLabel={'EventDetailHeaderFooterName'} preset={Text.preset.titleH3B} style={style.textFooterName} >{dataContentFooter.fStoreName}</Text>
                            <Text accessible={true} accessibilityLabel={'EventDetailHeaderPlaceName'} preset={Text.preset.titleH5B} style={style.textFooterContent}>{data['fBuildingName' + this.props.language.toUpperCase()]}</Text>
                            <Text accessible={true} accessibilityLabel={'EventDetailHeaderFooterCategory'} preset={Text.preset.titleH5B} style={style.textFooterContent}>{VisitorHelper.getLocalizeDataFromLookUp('StoreCategory',data.storeCategory,this._language)}</Text>
                            <Text accessible={true} accessibilityLabel={'EventDetailHeaderFooterLikeCount'} preset={Text.preset.titleH6B} style={style.textContentLiked}>{data.fLikeCountStore} {SGLocalize.translate('globalText.likeCountText')}</Text>
                        </View>
                    </View>
                </TouchableOpacity>
                <View accessible={true} style={style.productDetailContainer}>
                    <Text accessible={true} accessibilityLabel={'StoreProductDetailScreenTitle'} preset={Text.preset.titleH2B} style={style.productNameText}>{(this.props.productName).toUpperCase()}</Text>
                    <Text accessible={true} accessibilityLabel={'EventShortDescription'} preset={Text.preset.titleH3} style={style.shortDescText}>{dataContent.fShortDescription}</Text>
                    <Text accessible={true} accessibilityLabel={'StoreProductDetailScreenLikeCount'} preset={Text.preset.titleH5B} style={style.likedCountText}>{this.props.likeCount} {SGLocalize.translate('globalText.likeCountText')}</Text>
                </View>

                <View accessible={true} style={style.bottomContainer}>
                    <View accessible={true} style={style.leftContainer}>
                        {data.fCPromoPrice !== data.fCNormalPrice ?
                            (<View accessible={true} accessibilityLabel={'StoreProductDetailHeaderDiscPriceView'} style={{ marginHorizontal: p, alignItems: 'flex-start' }}>
                                <Text accessible={true} accessibilityLabel={'StoreProductDetailHeaderNormPriceText'} preset={Text.preset.titleH3B} style={{...style.normalPriceText,textDecorationLine: 'line-through' }}>{this.props.currency} {VisitorHelper._showPriceText(data.fCNormalPrice, data.fCurrency)}</Text>
                                <Text accessible={true} accessibilityLabel={'StoreProductDetailHeaderDiscPriceText'} preset={Text.preset.titleH2B} style={style.promoPriceText}>{this.props.currency} {VisitorHelper._showPriceText(data.fCPromoPrice, data.fCurrency)}</Text>
                            </View>)
                            :
                            (<View accessible={true} accessibilityLabel={'StoreProductDetailHeaderNormPriceView'} style={{ marginHorizontal: p, alignItems: 'flex-start' }}>
                                <Text accessible={true} accessibilityLabel={'StoreProductDetailHeaderPriceText'} preset={Text.preset.titleH3B} style={style.textNormalPrice}>{this.props.currency} {VisitorHelper._showPriceText(data.fCNormalPrice, data.fCurrency)}</Text>
                            </View>)
                        }
                    </View>
                    <View accessible={true} style={style.rightContainer}>
                            <ScrollView accessible={true} accessibilityLabel={'StoreProductDetailHeaderScrollView'} horizontal showsHorizontalScrollIndicator={false}>
                                {(data.fCustomize).map((x, index) => {
                                    return (
                                        <TouchableOpacity onPress={() => this.onVariationPress(index)}>
                                            {x !== null &&
                                                <View accessible={true} accessibilityLabel={'StoreProductDetailHeaderImageView2'} key={x.customizeProductKey}>
                                                {x.isCustomizationAvailable == 'Y' &&
                                                    <Image accessible={true} accessibilityLabel={'StoreProductDetailHeaderImage2'} style={style.variationImage} source={{ uri: x['fContentCustomize' + this.props.language.toUpperCase()].fImageJSON[0][this.props.imageSetting].uri }}></Image>
                                                }
                                                {x.isCustomizationAvailable == 'N' &&
                                                    <Image accessible={true} accessibilityLabel={'StoreProductDetailHeaderImage2'} style={style.variationImage} source={{ uri: x['fContentCustomize' + this.props.language.toUpperCase()].fImageJSON[0][this.props.imageSetting].uri }}>
                                                        <View style={style.overlayVariationImage}>
                                                            <Icon name={Icon.Icon.eyeOff} preset={Icon.preset.h1B}></Icon>
                                                        </View>
                                                    </Image>
                                                }
                                                </View>
                                            }
                                        </TouchableOpacity>
                                    )
                                })}
                            </ScrollView>
                        <View accessible={true} accessibilityLabel={'StoreProductDetailHeaderIconButtonView'} style={style.iconContainer} >
                            <CardIconButtonLike onIconPressed={this.props.onLike} accessible={true} accessibilityLabel={'StoreProductDetailHeaderLikeIcon'} likePackage={this.props.likePackage} textColor='#bebebe' navigator={this.props.navigator} contentType='StoreProduct' contentKey={data.key} active={data.fUserLikedThis} type={'like'} style={style.iconButton}></CardIconButtonLike>
                            <CardIconButtonComment accessible={true} accessibilityLabel={'StoreProductDetailHeaderCommentIcon'} commentPackage={this.props.commentPackage} textColor='#bebebe' navigator={this.props.navigator} contentType='StoreProduct' contentKey={data.key} canComment={data.fCanComment} type={'comment'} style={style.iconButton}></CardIconButtonComment>
                            <CardIconButtonShare shareParams={shareParams} img={dataContent.fImageJSON[0].thumbnailLow.uri} accessible={true} accessibilityLabel={'StoreProductDetailHeaderShareIcon'} textColor='#bebebe' navigator={this.props.navigator} contentType='StoreProduct' contentKey={data.key} shareMessage={dataContent.fShareMessage} targetKey={data.storeKey} type={'share'} style={style.iconButton}></CardIconButtonShare>
                            {(this.props.whatsapp !== '' && this.props.whatsapp !== '–' && this.props.whatsapp !== ' ' && this.props.whatsapp !== '-') &&
                                <TouchableOpacity onPress={() => { this.whatsappEnjoyer(this.props.whatsapp) }}>
                                    <Image accessible={true} source={{ uri: image.iconWhatsapp[this.props.imageSetting].url }} style={style.iconwhatsapp}></Image>
                                </TouchableOpacity>
                            }
                        </View>
                    </View>
                </View>
                <SGPopView accessible={true} accessibilityLabel={'StoreProductDetailHeaderPopView'} vPos={'bottom'} modal popViewID={this.pvID1}>
                    <ProductVariationPopup accessible={true} accessibilityLabel={'StoreProductDetailHeaderProductVariationPopup'} currency={this.props.currency} language={this.props.language} imageSetting={this.props.imageSetting} data={data.fCustomize[this.state.selectedVariation]} navigator={this.props.navigator} popViewID={this.pvID1} style={style.throwWHP}></ProductVariationPopup>
                </SGPopView>
            </View>

        );
    }
}
