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
import { DiscountTagAndroidTV } from '../component_V2/DiscountTagAndroidTV';
import image from '../asset/image';

export class ProductSliderMixCardAndroidTV extends SGBaseContainer {
    createStyleSheet = (whp) => {
        var { w, h, p } = whp;
        return StyleSheet.create({
            mainContainer: { width:  w * 0.36, height: w * 0.53, backgroundColor: '#FFFFFF', borderRadius: p * 3, justifyContent: 'flex-start', marginVertical: 0, paddingVertical: 0, marginLeft: 0, marginRight: 4*p },
            menuImage: { width:  w * 0.36, height:  w * 0.295 , resizeMode: 'cover', borderRadius: 0, borderTopLeftRadius: p * 3, borderTopRightRadius: p * 3, marginVertical: 0, marginHorizontal: 0 },
            overlay: {width: w * 0.36, height:w * 0.295, resizeMode: 'cover', borderRadius: 0, borderTopLeftRadius: p * 3, borderTopRightRadius: p * 3, marginVertical: 0, marginHorizontal: 0,backgroundColor: 'rgba(255,255,255,0.5)' },
            iconContainer: { flexDirection: 'row',alignSelf:'flex-start',padding:0,margin:0,height:w*0.06},
            iconChef: { color: "#FBB833",marginVertical:0,marginHorizontal:0, paddingRight:p},
            iconSpicy: { color: '#E24444',marginVertical:0,marginHorizontal:0, paddingRight:p},
            menuNameContainer: { width: w * 0.36, height: w * 0.06, justifyContent: 'flex-start', marginVertical: p},
            menuNameText: { color: '#000000', alignSelf: 'flex-start' },
            
            bottomContainer: { width:  w * 0.36, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: p * 5, paddingLeft: 0},
            normalPriceText: { color: '#000000', marginVertical: 0, alignSelf: 'flex-start' },
            normalPriceStrikeText: { color: '#000000', marginVertical: 0, alignSelf: 'flex-start', textDecorationLine: 'line-through' },
            promoPriceText: { color: '#F05759', marginVertical: 0, alignSelf: 'flex-start' },
            tag: { width: w * 0.12, height: w * 0.12, position: 'absolute', top: 2*p, right: p * 4 },
            leftContainer:{width: w * 0.36,justifyContent:'center',alignItems:'center'},
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

    
    render() {
        var { w, h, p } = this.whp;
        var style = this.style;
        var data = this.props.data;
        var dataContent = data['fContent' + this.props.language.toUpperCase()];
        return (
            // <TouchableOpacity >
                <View shadow accessible={true} accessibilityLabel={'ProductSliderCardRootView'} style={style.mainContainer}>
                    {
                        data.isAvailable == 'Y' &&
                        <Image accessible={true} accessibilityLabel={'ProductSliderCardImage'} style={style.menuImage} source={{ uri: dataContent.fImageJSON[0][this.props.imageSetting].uri }}></Image>
                    }
                    {
                        data.isAvailable == 'N' &&
                        <Image accessible={true} accessibilityLabel={'ProductSliderCardImage'} style={style.menuImage} source={{ uri: dataContent.fImageJSON[0][this.props.imageSetting].uri }}>
                            <View style={style.overlay}>
                                <Image style={{width:w*0.2,height:w*0.18,backgroundColor:'transparent',resizeMode:'stretch'}} source={{uri: image.OutOfStockImage[this.imageSetting].url}}></Image>
                            </View>
                        </Image>
                    }
                    {
                        data.fCNormalPrice !== data.fCPromoPrice ?
                        <DiscountTagAndroidTV accessible={true} accessibilityLabel={'ProductSliderCardDiscTag'} normalPrice={data.fCNormalPrice} promoPrice={data.fCPromoPrice} style={style.tag}></DiscountTagAndroidTV> : null}
                        <View accessible={true} accessibilityLabel={'ProductSliderCardIconView'} style={style.iconContainer}>
                        {
                            data.fType === 'resto' &&
                            <View style={{flexDirection:'row',alignSelf:'flex-start',paddingLeft:p,paddingTop:p/2}}>  
                                {data.fChefRecommended === 'Y' ?
                                    (<Icon accessible={true} accessibilityLabel={'ProductSliderCardChefHatIcon'} style={style.iconChef} name={Icon.Icon.chefHat} preset={Icon.preset.h8}></Icon>)
                                    :
                                    (null)
                                }
                                {tbLookupDAO.getLookUpValue(data.fSpicy).fValueKey === 'sl0' ?
                                    (null)
                                    :
                                    (<Icon accessible={true} accessibilityLabel={'ProductSliderCardSpicyLevelIcon'} style={style.iconSpicy} name={Icon.Icon[this.spicyLevel[tbLookupDAO.getLookUpValue(data.fSpicy).fValueKey]]} preset={Icon.preset.h8}></Icon>)
                                }
                            </View>
                        }
                        </View>
                   
                    <View accessible={true} style={style.menuNameContainer}>
                        <Text accessible={true} accessibilityLabel={'ProductSliderCardProductName'} preset={ Text.preset.h11B} numberOfLines={2} style={style.menuNameText}>{dataContent.fProductName}</Text>
                    </View>
                    <View accessible={true} style={style.bottomContainer}>
                        <View accessible={true} style={style.leftContainer}>
                            <Text accessible={true} accessibilityLabel={'ProductSliderCardNormPriceText'} preset={Text.preset.h12B} style={data.fCNormalPrice === data.fCPromoPrice ? style.normalPriceText : style.normalPriceStrikeText}>{this.props.currency} {VisitorHelper._showPriceText(data.fCNormalPrice, data.fCurrency)}</Text>
                            {
                                data.fCNormalPrice === data.fCPromoPrice ?
                                null
                                :
                                <Text accessible={true} accessibilityLabel={'ProductSliderCardDiscPriceText'} preset={Text.preset.h12B} style={style.promoPriceText}>{this.props.currency} {VisitorHelper._showPriceText(data.fCPromoPrice, data.fCurrency)}</Text>
                            }
                        </View>
                      
                    </View>

                </View>
            // </TouchableOpacity>
        );
    }
}
