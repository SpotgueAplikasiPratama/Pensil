import React from 'react';
import { SGBaseContainer } from '../../core/container/SGBaseContainer';
import { SGImage as Image, SGTouchableOpacity as TouchableOpacity, SGText as Text, SGView as View,SGIcon as Icon } from '../../core/control';
import { StyleSheet } from 'react-native';
import { CardIconButton,CardIconButtonLike  } from '../component_V2/CardIconButton';
import { DiscountTag } from '../component_V2/DiscountTag';
import { SGHelperNavigation, SGHelperGlobalVar, SGHelperType } from '../../core/helper';
import { VisitorHelper } from '../helper/VisitorHelper';
import image from '../asset/image';

export class CarouselProductCard extends SGBaseContainer {
    createStyleSheet = (whp) => {
        var { w, h, p } = whp;
        return StyleSheet.create({
            mainView: { marginHorizontal: p * 2, alignItems: 'flex-start',marginBottom:3*p, justifyContent: 'flex-start', backgroundColor: 'white', width: w * 0.52, minHeight: w * 0.785, borderRadius: 3 * p, paddingBottom: 2 * p, borderColor: '#c5c4bc', borderWidth: 0.3, shadowRadius: 5, shadowOffset: { height: 3 } },
            image: { width: w * 0.5, height: w * 0.5, backgroundColor: '#FFFFFF',borderTopLeftRadius: 3 * p, borderTopRightRadius: 3 * p },
            overlay: { marginHorizontal: 0,width: w * 0.52, height: w * 0.52, borderTopLeftRadius: 3 * p, borderTopRightRadius: 3 * p, borderRadius: 0,backgroundColor: 'rgba(255,255,255,0.5)' },
            textTitle: { marginHorizontal: 2 * p, marginTop: 3 * p, color: '#000000' },
            tag: { position: 'absolute', right: this.props.listMode ? p * 3 : p * 1.8, top: p },
            textNormalPrice: { marginHorizontal: 2 * p, color: '#000000' },
            textNormalPrice2: { marginHorizontal: 2 * p, textDecorationLine: 'line-through', textDecorationStyle: 'solid', color: '#000000' },
            textPromoPrice: { marginVertical: 0, marginHorizontal: 2 * p, color: '#F05759' },
            bottomView: { alignItems: 'flex-start',  width: w * 0.52, flex: 1 },
            bottomView1: { alignItems: 'flex-start' },
            bottomView2: {flexDirection: 'row', width: w * 0.52, justifyContent: 'space-between' },
            icon: { width: w * 1.3, height: w * 1.3 }
        });
    }

    onCardPress(screen) {
        this.props.navigator.navigate(screen)
    }

    constructor(props, context, ...args) {
        super(props, context, ...args);
        this.whp = { w: props.style.width, h: props.style.height, p: props.style.padding };
        this.style = this.createStyleSheet(this.whp);
        this.imageSetting = SGHelperGlobalVar.getVar('GlobalImageSetting');
    }

    render() {
        var { w, h, p } = this.whp;
        var style = this.style;
        return (
            <TouchableOpacity onPress={() => { SGHelperNavigation.navigatePush(this.props.navigator, 'StoreProductDetail', { contentKey: this.props.contentKey, storeKey: this.props.storeKey }) }}>
                <View accessible={true} accessibilityLabel={'CarouselProductCardRootView'} shadow shadowIntensity={this.props.listMode ? 0.2 : 1} style={style.mainView}>
                    {this.props.isAvailable == 'Y' &&
                    <Image accessible={true} accessibilityLabel={'CarouselProductCardImage'} style={style.image} source={{ uri: this.props.contentImage }}>
                        {this.props.normalPrice !== this.props.promoPrice ?
                            (<DiscountTag accessible={true} accessibilityLabel={'StoreProductDetailHeaderDiscTag'} normalPrice={this.props.normalPrice} promoPrice={this.props.promoPrice} style={style.tag}></DiscountTag>)
                            :
                            (null)
                        }
                    </Image>
                    }
                    {this.props.isAvailable == 'N' &&
                    <View style={style.image}> 
                    <Image accessible={true} accessibilityLabel={'CarouselProductCardImage'} style={style.image} source={{ uri: this.props.contentImage }}>
                        {this.props.normalPrice !== this.props.promoPrice ?
                            (<DiscountTag accessible={true} accessibilityLabel={'StoreProductDetailHeaderDiscTag'} normalPrice={this.props.normalPrice} promoPrice={this.props.promoPrice} style={style.tag}></DiscountTag>)
                            :
                            (null)
                        }
                          <View style={style.overlay}>
                               <Image style={{width:w*0.32,height:w*0.28,backgroundColor:'transparent',resizeMode:'stretch'}} source={{uri: image.OutOfStockImage[this.imageSetting].url}}></Image>
                          </View>
                    </Image>
                    </View>
                    }
                    <View accessible={true} accessibilityLabel={'CarouselProductCardBottomView'} style={style.bottomView}>
                        <View accessible={true} accessibilityLabel={'CarouselProductCardPriceView'} style={style.bottomView1}>
                            <Text accessible={true} accessibilityLabel={'CarouselProductCardTitle'} numberOfLines={2} preset={this.props.listMode ? Text.preset.titleH3B : Text.preset.titleH3B} style={style.textTitle}>{(this.props.productName)}</Text>
                        </View>
                        <View accessible={true} accessibilityLabel={'CarouselProductCardLikeView'} style={style.bottomView2}>
                          
                                {this.props.normalPrice !== this.props.promoPrice ?
                                    (<View accessible={true} accessibilityLabel={'CarouselProductCardDiscPriceView'} >
                                        <Text accessible={true} accessibilityLabel={'CarouselProductCardNormPriceText'} preset={this.props.listMode ? Text.preset.titleH3B : Text.preset.titleH3B} style={style.textNormalPrice2}>{this.props.currency} {VisitorHelper._showPriceText(this.props.normalPrice, this.props.contentOwnerCurrency)}</Text>
                                        <Text accessible={true} accessibilityLabel={'CarouselProductCardDiscPriceText'} preset={this.props.listMode ? Text.preset.titleH3B : Text.preset.titleH3B} style={style.textPromoPrice}>{this.props.currency} {VisitorHelper._showPriceText(this.props.promoPrice, this.props.contentOwnerCurrency)}</Text>
                                    </View>)
                                    :
                                    (<View accessible={true} accessibilityLabel={'CarouselProductCardPriceView'}>
                                        <Text accessible={true} accessibilityLabel={'CarouselProductCardPriceText'} preset={this.props.listMode ? Text.preset.titleH3B : Text.preset.titleH3B} style={style.textNormalPrice}>{this.props.currency} {VisitorHelper._showPriceText(this.props.normalPrice, this.props.contentOwnerCurrency)}</Text>
                                    </View>)
                                }
                           
                           
                            <CardIconButtonLike onIconPressed={this.props.onLike} accessible={true} accessibilityLabel={'CarouselProductCardLikeIcon'} likePackage={this.props.likePackage} hideText={true} navigator={this.props.navigator} contentType='StoreProduct' contentKey={this.props.contentKey} active={this.props.like} type={'like'} style={style.icon}></CardIconButtonLike>
                           
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        );
    }
}
