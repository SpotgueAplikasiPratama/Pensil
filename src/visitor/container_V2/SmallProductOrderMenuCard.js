import React from 'react';
import { StyleSheet } from 'react-native';
import { SGBaseContainer } from "../../core/container/SGBaseContainer";
import { SGView as View, SGText as Text, SGImage as Image, SGButton as Button, SGIcon as Icon } from "../../core/control";
import { SGHelperNavigation, SGHelperGlobalVar, SGHelperType } from '../../core/helper';
import { SGLocalize } from '../locales/SGLocalize';
import { DiscountTag } from '../component_V2/DiscountTag';
import image from '../asset/image';
import { VisitorHelper } from '../helper/VisitorHelper';

export default class SmallProductOrderMenuCard extends SGBaseContainer {
    createStyleSheet = (whp) => {
        var { w, h, p } = whp;
        return StyleSheet.create({
            v1: { width: w, paddingHorizontal: 3 * p, paddingTop: 3 * p, paddingBottom: 5 * p, justifyContent: 'flex-start', alignItems: 'center', flexDirection: 'row', borderBottomWidth: p * 0.1, borderTopWidth: p * 0.1, borderTopColor: "#181818", borderBottomColor: "#181818", },
            v2: { width: w * 0.23, height: w * 0.23, borderRadius: p * 2, marginLeft: 5 * p, marginTop: 3 * p, marginBottom: 3 * p },
            v3: { width: (w * 0.23) * 3, flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start' },
            v4: { width: (w * 0.23) * 3, justifyContent: 'flex-start', alignItems: 'flex-start', marginTop: p },
            v5: { justifyContent: 'space-between', flexDirection: 'row', width: w * 0.6, marginTop: w * 0.015 },
            text: { color: "#181818", marginBottom: 0, paddingLeft: 2 * p },
            text2: { color: '#929090', paddingLeft: 2 * p },
            textPrice1: { color: "#E24444", paddingLeft: p },
            textPrice2: { textDecorationLine: 'line-through', textDecorationColor: "#181818", color: "#181818", paddingLeft: p, marginVertical: 0 },
            textPrice3: { color: "#181818", paddingLeft: p },
            btn: { position: 'absolute', bottom: 4 * p, right: 2 * p, color: "white", backgroundColor: "#1DB482", justifyContent: 'center', alignItems: 'center', borderRadius: 6 * p },
            btn2: { position: 'absolute', bottom: 4 * p, right: 2 * p, color: "white", backgroundColor: "grey", justifyContent: 'center', alignItems: 'center', borderRadius: 6 * p },
            iconView: { flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'flex-start' },
            icon: { color: "#c49848", marginHorizontal: 0, paddingLeft: 2 * p },
            icon2: { color: "#E24444", marginHorizontal: 0, paddingLeft: 2 * p },
            overlay: { flexDirection: 'row', height: '100%', width: '100%', backgroundColor: 'rgba(255,255,255,0.5)' },
            discountTag: { position: 'absolute', top: 0, right: 0, zIndex: 999 }
        });
    }

    constructor(props, context, ...args) {
        super(props, context, ...args);
        this.whp = { w: props.style.width, h: props.style.height, p: props.style.padding }
        this.style = this.createStyleSheet(this.whp);
        this.state = {
            click: true,
        }

    }

    _Check() { this.setState({ click: !this.state.click, }); }

    render() {
        var { w, h, p } = this.whp;
        var style = this.style;
        var data = this.props.data;
        var dataStore = this.props.dataStore;
        var language = this.props.language.toUpperCase();
        var imageSetting = this.props.imageSetting;
        try {
            console.log()
        } catch (e) {
            console.log(e);
        }
        return (
            <View accessible={true} accessibilityLabel={'SmallProductOrderMenuCardRootView'} style={style.v1}>
                {data.fDiscountPrice !== data.fPrice && <DiscountTag accessible={true} accessibilityLabel={'ClothToBuyCardDiscountTag'} normalPrice={data.fPrice} promoPrice={data.fDiscountPrice} style={style.discountTag}></DiscountTag>}
                {data.isAvailable === 'Y' &&
                    <Image accessible={true} accessibilityLabel={'SmallProductOrderMenuCardImage'} style={style.v2} source={{ uri: data["fContent" + language].fImageJSON[0]['thumbnail' + imageSetting.charAt(0).toUpperCase() + imageSetting.slice(1)].uri }}></Image>
                }
                {data.isAvailable === 'N' &&
                    <Image accessible={true} accessibilityLabel={'SmallProductOrderMenuCardImage'} style={style.v2} source={{ uri: data["fContent" + language].fImageJSON[0]['thumbnail' + imageSetting.charAt(0).toUpperCase() + imageSetting.slice(1)].uri }}>
                        <View style={style.overlay}></View>
                    </Image>

                }
                <View accessible={true} accessibilityLabel={'SmallProductOrderMenuCardContentView'} style={style.v3}>
                    <Text accessible={true} accessibilityLabel={'SmallProductOrderMenuCardName'} style={style.text} preset={Text.preset.titleH3B} numberOfLines={1}>{data["fContent" + language].fProductName}</Text>
                    <Text accessible={true} accessibilityLabel={'SmallProductOrderMenuCardShortDesc'} style={style.text} preset={Text.preset.titleH4} numberOfLines={2}>{data["fContent" + language].fShortDescription}</Text>
                    {data.fDiscountPrice !== data.fPrice ?
                        <View accessible={true} accessibilityLabel={'SmallProductOrderMenuCardDiscPriceView'} style={style.v4}>
                            <Text accessible={true} accessibilityLabel={'SmallProductOrderMenuCardNormPriceText'} style={style.textPrice2} preset={Text.preset.titleH4B}>{dataStore.fCurrency} {SGHelperType.addThousandSeparator((data.fPrice).toString())}</Text>
                            <Text accessible={true} accessibilityLabel={'SmallProductOrderMenuCardDiscPriceText'} style={style.textPrice1} preset={Text.preset.titleH4B}>{dataStore.fCurrency} {SGHelperType.addThousandSeparator((data.fDiscountPrice).toString())}</Text>
                            {/*  */}
                        </View> :
                        (<Text accessible={true} accessibilityLabel={'SmallProductOrderMenuCardPriceText'} style={style.textPrice3} preset={Text.preset.titleH4B}>{dataStore.fCurrency} {SGHelperType.addThousandSeparator((data.fPrice).toString())}</Text>)}
                    {data.chefRecommended === 'N' && this.props.spicy === 'SL0' ? (<View accessible={true} accessibilityLabel={'SmallProductOrderMenuCardNoIconView'} style={{ width: 0, height: 0 }}></View>) :
                        (<View accessible={true} accessibilityLabel={'SmallProductOrderMenuCardIconView'} style={style.iconView}>
                            {data.fRecommendationChef === 'Y' ? (<Icon accessible={true} accessibilityLabel={'SmallProductOrderMenuCardCRIcon'} name={Icon.Icon.chefHat} preset={Icon.preset.h5} style={style.icon}></Icon>) : (null)}
                            {data.fSpicyLevel === 'SL1' ? (<Icon accessible={true} accessibilityLabel={'SmallProductOrderMenuCardSpicy1Icon'} name={Icon.Icon.chilli1} preset={Icon.preset.h5} style={style.icon2}></Icon>) : (null)}
                            {data.fSpicyLevel === 'SL2' ? (<Icon accessible={true} accessibilityLabel={'SmallProductOrderMenuCardSpicy2Icon'} name={Icon.Icon.chilli2} preset={Icon.preset.h5} style={style.icon2}></Icon>) : (null)}
                            {data.fSpicyLevel === 'SL3' ? (<Icon accessible={true} accessibilityLabel={'SmallProductOrderMenuCardSpicy3Icon'} name={Icon.Icon.chilli3} preset={Icon.preset.h5} style={style.icon2}></Icon>) : (null)}</View>)}
                </View>
                <Button disabled={data.isAvailable == 'N' ? true : false} accessible={true} accessibilityLabel={'SmallProductOrderMenuCardAddButton'} style={data.isAvailable == 'Y' ? style.btn : style.btn2} onPress={this.props.onPress} label={SGLocalize.translate('orderMenuListScreen.LabelButtonAdd')} textPreset={Text.preset.titleH4_5B}></Button>
            </View>
        );
    }
}

