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

export class ProductSliderListMixCard extends SGBaseContainer {
    createStyleSheet = (whp) => {
        var { w, h, p } = whp;
        return StyleSheet.create({
            mainContainer: { width: this.props.listMode ? w * 0.45 : w * 0.36, height: this.props.listMode ? w * 0.7 : w * 0.53, backgroundColor: '#FFFFFF', borderRadius: p * 3, justifyContent: 'flex-start', marginVertical: 0, marginBottom: this.props.listMode ? p * 5 : null, paddingVertical: 0, marginLeft: this.props.listMode ? p * 2 : 0, marginRight: this.props.listMode ? p * 2 : p * 5 },
            menuImage: { width: this.props.listMode ? w * 0.45 : w * 0.36, height: this.props.listMode ? w * 0.4 : w * 0.295 , resizeMode: 'cover', borderRadius: 0, borderTopLeftRadius: p * 3, borderTopRightRadius: p * 3, marginVertical: 0, marginHorizontal: 0 },
            overlay: {width: this.props.listMode ? w * 0.45 : w * 0.36, height:this.props.listMode ? w * 0.4 : w * 0.295, resizeMode: 'cover', borderRadius: 0, borderTopLeftRadius: p * 3, borderTopRightRadius: p * 3, marginVertical: 0, marginHorizontal: 0,backgroundColor: 'rgba(255,255,255,0.5)' },
            iconContainer: { flexDirection: 'row', height: w * 0.035, alignSelf: 'flex-start', marginTop: p, marginLeft: p },
            iconChef: { color: "#FBB833",  width: w * 0.035, height: w * 0.035},
            iconSpicy: { color: '#E24444',  width: w * 0.035, height: w * 0.035},
            menuNameContainer: { width: this.props.listMode ? w * 0.45 : w * 0.36, paddingHorizontal: this.props.listMode ? p * 2 : null, height: this.props.listMode ? w * 0.1 : w * 0.07, justifyContent: 'flex-start', marginVertical: p },
            menuNameText: { color: '#000000', alignSelf: 'flex-start' },
            bottomContainer: { width: this.props.listMode ? w * 0.45 : w * 0.36, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: p * 5, paddingLeft: p },
            normalPriceText: { color: '#000000', marginVertical: 0, alignSelf: 'flex-start' },
            normalPriceStrikeText: { color: '#000000', marginVertical: 0, alignSelf: 'flex-start', textDecorationLine: 'line-through' },
            promoPriceText: { color: '#F05759', marginVertical: 0, alignSelf: 'flex-start' },

            tag: { width: w * 0.09, height: w * 0.09, position: 'absolute', top: p, right: p * 2 },
            leftContainer:{width:this.props.listMode ? w * 0.35 : w * 0.26,justifyContent:'center',alignItems:'center'},
            rightContainer:{width:w*0.1,justifyContent:'center',alignItems:'center'}
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
            console.log(data.key);
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
                <View shadow accessible={true} accessibilityLabel={'RestoMenuSliderCardRootView'} style={style.mainContainer}>
                    {data.isAvailable == 'Y' &&
                    <Image accessible={true} accessibilityLabel={'RestoMenuSliderCardImage'} style={style.menuImage} source={{ uri: dataContent.fImageJSON[0][this.props.imageSetting].uri }}>
                    </Image>
                    }
                    {data.isAvailable == 'N' &&
                    <Image accessible={true} accessibilityLabel={'RestoMenuSliderCardImage'} style={style.menuImage} source={{ uri: dataContent.fImageJSON[0][this.props.imageSetting].uri }}>
                         <View style={style.overlay}>
                         <Image style={{width:w*0.2,height:w*0.18,backgroundColor:'transparent',resizeMode:'stretch'}} source={{uri: image.OutOfStockImage[this.imageSetting].url}}></Image>
                          </View>
                    </Image>
                    }
                    {data.fCNormalPrice !== data.fCPromoPrice ?
                        (<DiscountTag accessible={true} accessibilityLabel={'RestoMenuSliderCardDiscTag'} normalPrice={data.fCNormalPrice} promoPrice={data.fCPromoPrice} style={style.tag}></DiscountTag>) : (null)}
                    <View accessible={true} accessibilityLabel={'RestoMenuSliderCardIconView'} style={style.iconContainer}>
                        {data.fType === 'resto' &&
                            <View style={{flexDirection: 'row'}}> 
                                {data.fChefRecommended === 'Y' ?
                                    (<Icon accessible={true} accessibilityLabel={'RestoMenuSliderCardChefHatIcon'} style={style.iconChef} name={Icon.Icon.chefHat}></Icon>)
                                    :
                                    (null)
                                }
                                {tbLookupDAO.getLookUpValue(data.fSpicy).fValueKey === 'sl0' ?
                                    (null)
                                    :
                                    (<Icon accessible={true} accessibilityLabel={'RestoMenuSliderCardSpicyLevelIcon'} style={style.iconSpicy} name={Icon.Icon[this.spicyLevel[tbLookupDAO.getLookUpValue(data.fSpicy).fValueKey]]}></Icon>)
                                }
                            </View>
                        }
                    </View>
                    <View accessible={true} style={style.menuNameContainer}>
                        <Text accessible={true} accessibilityLabel={'RestoMenuSliderCardProductName'} preset={this.props.listMode ? Text.preset.titleH3B : Text.preset.titleH4B} numberOfLines={2} style={style.menuNameText}>{dataContent.fProductName}</Text>
                    </View>
                    <View accessible={true} style={style.bottomContainer}>
                        <View accessible={true} style={style.leftContainer}>
                            <Text accessible={true} accessibilityLabel={'RestoMenuSliderCardNormPriceText'} preset={this.props.listMode ? Text.preset.titleH3B : Text.preset.titleH4B} style={data.fCNormalPrice === data.fCPromoPrice ? style.normalPriceText : style.normalPriceStrikeText}>{this.props.currency} {VisitorHelper._showPriceText(data.fCNormalPrice, data.fCurrency)}</Text>
                            {data.fCNormalPrice === data.fCPromoPrice ?
                                (null)
                                :
                                (<Text accessible={true} accessibilityLabel={'RestoMenuSliderCardDiscPriceText'} preset={this.props.listMode ? Text.preset.titleH3B : Text.preset.titleH4B} style={style.promoPriceText}>{this.props.currency} {VisitorHelper._showPriceText(data.fCPromoPrice, data.fCurrency)}</Text>)
                            }
                        </View>
                        <View accessible={true} style={style.rightContainer}>
                        {data.fType === 'resto' ?
                            <CardIconButtonLike onIconPressed={this.props.onLike} accessible={true} accessibilityLabel={'RestoLikeIcon'} likePackage={this.props.likePackage} hideText={true} navigator={this.props.navigator} contentType='RestoMenu' contentKey={data.key} active={data.fUserLikedThis} type={'like'} ></CardIconButtonLike>
                            :
                            <CardIconButtonLike onIconPressed={this.props.onLike} accessible={true} accessibilityLabel={'StoreLikeIcon'} likePackage={this.props.likePackage} hideText={true} navigator={this.props.navigator} contentType='StoreProduct' contentKey={data.key} active={data.fUserLikedThis} type={'like'}></CardIconButtonLike>
                        }
                        </View>
                    </View>

                </View>
            </TouchableOpacity>
        );
    }
}
