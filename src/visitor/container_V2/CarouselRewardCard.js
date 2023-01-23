import React from 'react';
import { SGBaseContainer } from '../../core/container/SGBaseContainer';
import { SGImage as Image, SGTouchableOpacity as TouchableOpacity, SGText as Text, SGView as View, SGButton as Button } from '../../core/control';
import { StyleSheet } from 'react-native';
import { CardIconButton } from '../component_V2/CardIconButton';
import { DiscountTag } from '../component_V2/DiscountTag';
import { SGHelperNavigation, SGHelperGlobalVar, SGHelperType } from '../../core/helper';
import { VisitorHelper } from '../helper/VisitorHelper';
import { SGLocalize } from '../locales/SGLocalize';

export class CarouselRewardCard extends SGBaseContainer {
    createStyleSheet = (whp) => {
        var { w, h, p } = whp;
        return StyleSheet.create({
            mainView: { marginHorizontal: p * 2, alignItems: 'flex-start', justifyContent: 'flex-start', marginVertical: p * 2, backgroundColor: 'white', width: w * 0.7, minHeight: w * 0.785, borderRadius: 3 * p, paddingBottom: 2 * p, borderColor: '#c5c4bc', borderWidth: 0.3, shadowRadius: 5, shadowOffset: { height: 3 } },
            image: { marginHorizontal: 0, width: w * 0.7, height: w * 0.7 * 9 / 16, backgroundColor: '#FFFFFF', marginVertical: 0, borderTopLeftRadius: 3 * p, borderTopRightRadius: 3 * p, borderRadius: 0, },
            textTitle: { marginHorizontal: 2 * p, marginTop: 3 * p, color: '#000000' },
            textShortDesc: { marginHorizontal: 2 * p, marginTop: p, color: '#000000' },
            tag: { position: 'absolute', right: this.props.listMode ? p * 3 : p * 1.8, top: p },
            textNormalPrice: { marginHorizontal: 2 * p, color: '#000000' },
            textNormalPrice2: { marginHorizontal: 2 * p, textDecorationLine: 'line-through', textDecorationStyle: 'solid', color: '#000000' },
            textPromoPrice: { marginVertical: 0, marginHorizontal: 2 * p, color: '#F05759' },
            bottomView: { flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'space-between', width: w * 0.7, flex: 1 },
            bottomView1: { alignItems: 'flex-start', width: w * 0.7 },
            bottomView2: { flexDirection: 'row', width: w * 0.7, justifyContent: 'space-between' },
            icon: { width: w * 1.3, height: h * 1.3, padding: p * 1.3 }
        });
    }

    onCardPress(screen) {
        this.props.navigator.navigate(screen)
    }

    constructor(props, context, ...args) {
        super(props, context, ...args);
        this.whp = { w: props.style.width, h: props.style.height, p: props.style.padding };
        this.style = this.createStyleSheet(this.whp);
    }

    render() {
        var { w, h, p } = this.whp;
        var style = this.style;
        var data = this.props.data;
        var dataContent = this.props.data['fContent' + this.props.language.toUpperCase()];

        return (
            <TouchableOpacity onPress={() => { SGHelperNavigation.navigatePush(this.props.navigator, 'StoreProductDetail', { contentKey: this.props.contentKey, storeKey: this.props.storeKey }) }}>
                <View accessible={true} accessibilityLabel={'CarouselRewardCardRootView'} shadow shadowIntensity={this.props.listMode ? 0.2 : 1} style={style.mainView}>
                    <Image accessible={true} accessibilityLabel={'CarouselRewardCardImage'} style={style.image} source={{ uri: dataContent.fImageJSON[0][this.props.imageSetting].uri }}></Image>
                    <View accessible={true} accessibilityLabel={'CarouselRewardCardBottomView'} style={style.bottomView}>
                        <View accessible={true} accessibilityLabel={'CarouselRewardCardPriceView'} style={style.bottomView1}>
                            <Text accessible={true} accessibilityLabel={'CarouselRewardCardTitle'} numberOfLines={3} preset={Text.preset.h6B} style={style.textTitle}>{(dataContent.fRewardName)}</Text>
                            <Text accessible={true} accessibilityLabel={'CarouselRewardCardTitle'} numberOfLines={3} preset={Text.preset.h7} style={style.textShortDesc}>{(dataContent.fShortDescription)}</Text>
                        </View>
                        <View>
                            <Text preset={Text.preset.h8} style={{ alignSelf: 'flex-start' }}>{SGLocalize.translate('CarouselRewardCard.availableStockLabel')} Available Stock: {data.totalAvailable}</Text>
                            <View accessible={true} accessibilityLabel={'CarouselRewardCardLikeView'} style={style.bottomView2}>
                                <View accessible={true} style={{ flexDirection: 'row', justifyContent: 'flex-start' }}>
                                    <View accessible={true} accessibilityLabel={'CarouselRewardCardP riceView'}>
                                        <Text accessible={true} accessibilityLabel={'CarouselRewardCardPriceText'} preset={this.props.listMode ? Text.preset.heading6B : Text.preset.heading7B} style={style.textNormalPrice}>{SGLocalize.translate('CarouselRewardCard.referralPriceLabel',{price: data.fReferralPrice})} Trade for {data.fReferralPrice} points</Text>
                                    </View>
                                </View>
                                <Button onPress={() => { this.props.onTradePress() }} style={{ borderRadius: p * 3, marginRight: p * 4 }} label={SGLocalize.translate('CarouselRewardCard.tradeButton')}></Button>
                            </View>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        );
    }
}
