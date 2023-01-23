import React from 'react';
import { SGBaseContainer } from '../../core/container/SGBaseContainer';
import { SGImage as Image, SGTouchableOpacity as TouchableOpacity, SGText as Text, SGView as View, SGIcon as Icon } from '../../core/control';
import { StyleSheet } from 'react-native';
import { SGHelperNavigation, SGHelperGlobalVar, SGHelperType } from '../../core/helper';
import { DiscountTag } from '../component_V2/DiscountTag';
import { CardIconButton,CardIconButtonLike } from '../component_V2/CardIconButton';
import { SGLocalize } from '../locales/SGLocalize';
import { tbLookupDAO } from '../db/tbLookupDAO';
import { VisitorHelper } from '../helper/VisitorHelper';
import image from '../asset/image';

export class ProductSliderMixCard extends SGBaseContainer {
    createStyleSheet = (whp) => {
        var { w, h, p } = whp;
        return StyleSheet.create({
            mainContainer: {backgroundColor: '#FFFFFF', width: (w - (p * 4)) / 3, borderRadius: w * 0.05, marginLeft: w * 0.015  , marginRight: w * 0.015, justifyContent: 'center', alignItems: 'center'},
            imageContainer: {width: (w - (p * 4)) / 3, height: (w - (p * 4)) / 3, marginTop: 0},
            sliderImage: {width: (w - (p * 4)) / 3, height: (w - (p * 4)) / 3, resizeMode: 'cover', borderRadius: 0, borderTopLeftRadius: w * 0.05, borderTopRightRadius: w * 0.05, borderBottomLeftRadius: 0, borderBottomRightRadius: 0},
            textContainer: {justifyContent: 'center', paddingVertical: p, minHeight: w*0.15},
            priceContainer:{flexDirection:'row'},
            sliderText: {color: '#3B444B'},
            tag: { width: w * 0.09, height: w * 0.09, position: 'absolute', top: p, right: p * 2 },
            iconContainer: { flexDirection: 'row', height: w * 0.035, alignSelf: 'flex-start',marginLeft: p },
            iconChef: { color: "#FBB833",  width: w * 0.035, height: w * 0.035},
            iconSpicy: { color: '#E24444',  width: w * 0.035, height: w * 0.035},
            normalPriceText: { color: '#000000', marginVertical: 0, alignSelf: 'center' },
            normalPriceStrikeText: { color: '#000000', marginVertical: 0, alignSelf: 'center', textDecorationLine: 'line-through' },
            promoPriceText: { color: '#F05759', marginVertical: 0, alignSelf: 'center' },
        });
    }


    constructor(props, context, ...args) {
        super(props, context, ...args);
        this.whp = { w: props.style.width, h: props.style.height, p: props.style.padding };
        this.style = this.createStyleSheet(this.whp);
        this.spicyLevel = { sl1: 'chilli1', sl2: 'chilli2', sl3: 'chilli3' };
        this._language = SGHelperGlobalVar.getVar('GlobalLanguage')
        this.imageSetting = SGHelperGlobalVar.getVar('GlobalImageSetting');
    }

    navigateScreen(data){
        if(data.fType == 'resto'){
            SGHelperNavigation.navigatePush(this.props.navigator, 'RestoMenuDetail', { contentKey: data.key, restoKey: data.storeKey})
        }else{
            SGHelperNavigation.navigatePush(this.props.navigator, 'StoreProductDetail', { contentKey: data.key, storeKey: data.storeKey })
        }
       
    }
    
    render() {
        var { w, h, p } = this.whp;
        var style = this.style;
        var data = this.props.data;
        var dataContent = data['fContent' + this.props.language.toUpperCase()];
        return (
            <TouchableOpacity onPress={() => this.navigateScreen(data)}>
                <View accessible={true} accessibilityLabel={'RestoCardSmallRootView'} shadow shadowIntensity={0.6} style={style.mainContainer}>
                    <View accessible={true} accessibilityLabel={''} style={style.imageContainer}>
                        {data.isAvailable == 'Y' &&
                            <Image accessible={true} accessibilityLabel={'ProductSliderCardImage'} style={style.sliderImage} source={{ uri: dataContent.fImageJSON[0][this.props.imageSetting].uri }}>
                            </Image>
                            }
                            {data.isAvailable == 'N' &&
                            <Image accessible={true} accessibilityLabel={'ProductSliderCardImage'} style={style.sliderImage} source={{ uri: dataContent.fImageJSON[0][this.props.imageSetting].uri }}>
                                <View style={style.overlay}>
                                    <Image style={{width:w*0.2,height:w*0.18,backgroundColor:'transparent',resizeMode:'stretch'}} source={{uri: image.OutOfStockImage[this.imageSetting].url}}></Image>
                                </View>
                            </Image>
                        }

                        {data.fCNormalPrice !== data.fCPromoPrice ?
                            <DiscountTag accessible={true} accessibilityLabel={'ProductSliderCardDiscTag'} normalPrice={data.fCNormalPrice} promoPrice={data.fCPromoPrice} style={style.tag}></DiscountTag> 
                            : (null)
                        }
                    </View>  
                    <View accessible={true} accessibilityLabel={'ProductSliderCardIconView'} style={style.iconContainer}>
                        {data.fType === 'resto' &&
                            <View style={{flexDirection:'row'}}>  
                                {data.fChefRecommended === 'Y' ?
                                    (<Icon accessible={true} accessibilityLabel={'ProductSliderCardChefHatIcon'} style={style.iconChef} name={Icon.Icon.chefHat}></Icon>)
                                    :
                                    (null)
                                }
                                {tbLookupDAO.getLookUpValue(data.fSpicy).fValueKey === 'sl0' ?
                                    (null)
                                    :
                                    (<Icon accessible={true} accessibilityLabel={'ProductSliderCardSpicyLevelIcon'} style={style.iconSpicy} name={Icon.Icon[this.spicyLevel[tbLookupDAO.getLookUpValue(data.fSpicy).fValueKey]]}></Icon>)
                                }
                            </View>

                        }
                    </View> 
                        <View accessible={true} accessibilityLabel={'RestoCardSmallTextView'} style={style.textContainer}>
                            <Text accessible={true} accessibilityLabel={'RestoCardSmallContentText'} numberOfLines={1} preset={Text.preset.titleH4B} style={style.sliderText}>{dataContent.fProductName}</Text>
                           <View style={style.priceContainer}>
                               <View>
                                <Text numberOfLines={1} accessible={true} accessibilityLabel={'ProductSliderCardNormPriceText'} preset={Text.preset.titleH4B} style={data.fCNormalPrice === data.fCPromoPrice ? style.normalPriceText : style.normalPriceStrikeText}>{this.props.currency} {VisitorHelper._showPriceText(data.fCNormalPrice, data.fCurrency)}</Text>
                                {data.fCNormalPrice === data.fCPromoPrice ?
                                    (null)
                                    :
                                    (<Text numberOfLines={1} accessible={true} accessibilityLabel={'ProductSliderCardDiscPriceText'} preset={Text.preset.titleH4B} style={style.promoPriceText}>{this.props.currency} {VisitorHelper._showPriceText(data.fCPromoPrice, data.fCurrency)}</Text>)
                                }
                                </View>
                                {/* {data.fType === 'resto' ?
                                <CardIconButtonLike onIconPressed={this.props.onLike} accessible={true} accessibilityLabel={'RestoLikeIcon'} likePackage={this.props.likePackage} hideText={true} navigator={this.props.navigator} contentType='RestoMenu' contentKey={data.key} active={data.fUserLikedThis} type={'like'} ></CardIconButtonLike>
                                :
                                <CardIconButtonLike onIconPressed={this.props.onLike} accessible={true} accessibilityLabel={'StoreLikeIcon'} likePackage={this.props.likePackage} hideText={true} navigator={this.props.navigator} contentType='StoreProduct' contentKey={data.key} active={data.fUserLikedThis} type={'like'}></CardIconButtonLike>
                                } */}
                        </View>
                    </View>
                            
                </View>
            </TouchableOpacity>
        );
    }
}

