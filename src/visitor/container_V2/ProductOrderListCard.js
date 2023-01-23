import React from 'react';
import { StyleSheet } from 'react-native';
import { SGBaseContainer } from "../../core/container/SGBaseContainer";
import { SGView as View, SGText as Text, SGImage as Image, SGScrollView as ScrollView, SGIcon as Icon, SGTouchableOpacity as TouchableOpacity, SGTextInput as TextInput, SGDialogBox } from "../../core/control";
import { SGFormTextInput } from '../../core/form';
import { SGHelperNavigation, SGHelperGlobalVar, SGHelperType } from '../../core/helper';
import { SGLocalize } from '../locales/SGLocalize';
import image from '../asset/image';
import { VisitorHelper } from '../helper/VisitorHelper';

export default class ProductOrderListCard extends SGBaseContainer {
    createStyleSheet = (whp) => {
        var { w, h, p } = whp;
        return StyleSheet.create({
            v1: { width: w - 4 * p, justifyContent: 'flex-start', alignItems: 'flex-start', marginVertical: p, backgroundColor: 'white', borderWidth: 0.5, borderColor: '#181818', borderRadius: 2 * p },
            v1_1: { width: w, flexDirection: 'row', justifyContent: 'flex-start', marginLeft: 2 * p },
            v2: { width: w * 0.275, height: w * 0.275, borderRadius: 2 * p, flexDirection: 'row', marginHorizontal: 1.5 * p, marginVertical: 1.5 * p },
            v3: { width: (w / 3) * 2 },
            v3_1: { width: (w / 3) * 2, height: w * 0.23, justifyContent: 'center', alignItems: 'flex-start' },
            v3_2: { width: (w / 3) * 2, height: w * 0.07, justifyContent: 'flex-start', alignItems: 'flex-end', marginTop: w * 0.04 },
            v4: { alignSelf: 'center', width: w * 0.9, marginTop: p, borderBottomWidth: 0.5, borderColor: '#181818' },
            iconView: { width: (w / 3) * 2, flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'flex-start' },
            icon: { color: "#181818", marginHorizontal: 0 },
            iconArrow: { color: "#181818", marginRight: 7.5 * p },
            text: { alignSelf: 'flex-start', paddingLeft: p, color: "black", marginHorizontal: 0, marginVertical: 0.2 * p },
            text1: { alignSelf: 'flex-start', paddingLeft: 3 * p, color: "black", marginHorizontal: 0, marginVertical: 0.2 * p },
            text2: { alignSelf: 'center', color: '#181818' },
            text3: { alignSelf: 'center', color: 'green' },
            textInput: { width: w * 0.8, alignSelf: 'flex-start', marginBottom: 2 * p },
            iconClose: { position: 'absolute', resizeMode: 'contain', backgroundColor: 'transparent', color: 'red', top: 0, right: 0 },
            vArrow: { position: 'absolute', right: w * 0.05, bottom: 0 },
            vThrowWHP: { width: w, padding: p },
            vIcon: { color: 'red' },
        });
    }
    constructor(props, context, ...args) {
        super(props, context, ...args);
        this.whp = { w: props.style.width, h: props.style.height, p: props.style.padding }
        this.style = this.createStyleSheet(this.whp);
        this.state = { click: true, comment: '' }
    }

    _Check() { this.setState({ click: !this.state.click }); }

    render() {
        var { w, h, p } = this.whp;
        var style = this.style;
        var language = (this.props.language).toUpperCase();
        var imageSetting = this.props.imageSetting;
        var data = this.props.data;
        var dataStore = this.props.dataStore;
        return (
            <View accessible={true} accessibilityLabel={'ProductOrderListCardRootView'} style={style.v1}>
                <View accessible={true} accessibilityLabel={'ProductOrderListCardContentView'} style={style.v1_1}>
                    <Image accessible={true} accessibilityLabel={'ProductOrderListCardProductImage'} style={style.v2} source={{ uri: data.fProductJSON["fContent" + language].fImageJSON[0]['thumbnail' + imageSetting.charAt(0).toUpperCase() + imageSetting.slice(1)].uri }}></Image>
                    <View accessible={true} accessibilityLabel={'ProductOrderListCardContainerView'} style={style.v3}>
                        <Text accessible={true} accessibilityLabel={'ProductOrderListCardCountText'} preset={Text.preset.titleH3B} style={style.text}>{data.fOrderCount}x</Text>
                        <Text accessible={true} accessibilityLabel={'ProductOrderListCardTopNameText'} preset={Text.preset.titleH3B} style={style.text} numberOfLines={2}>{data.fProductJSON["fContent" + language].fProductName}</Text>
                        {data.fProductJSON.fRecommendationChef === 'Y' ?
                            (<View accessible={true} accessibilityLabel={'ProductOrderListCardCRecView'} style={style.iconView}>
                                {data.fProductJSON.fRecommendationChef === 'Y' ? (<Icon accessible={true} accessibilityLabel={'ProductOrderListCardChefHatIcon'} style={style.icon} name={Icon.Icon.chefHat} preset={Icon.preset.h5}></Icon>) : (null)}
                                <View accessible={true} accessibilityLabel={'ProductOrderListCardCRecSpicyLevelView'}>
                                    {data.fProductJSON.fSpicyLevel === 'SL1' ? (<Icon accessible={true} accessibilityLabel={'ProductOrderListCardCRecSpicy1Icon'} style={style.icon} name={Icon.Icon.chilli1} preset={Icon.preset.h5}></Icon>) : (null)}
                                    {data.fProductJSON.fSpicyLevel === 'SL2' ? (<Icon accessible={true} accessibilityLabel={'ProductOrderListCardCRecSpicy2Icon'} style={style.icon} name={Icon.Icon.chilli2} preset={Icon.preset.h5}></Icon>) : (null)}
                                    {data.fProductJSON.fSpicyLevel === 'SL3' ? (<Icon accessible={true} accessibilityLabel={'ProductOrderListCardCRecSpicy3Icon'} style={style.icon} name={Icon.Icon.chilli3} preset={Icon.preset.h5}></Icon>) : (null)}
                                </View>
                            </View>) :
                            (<View accessible={true} accessibilityLabel={'ProductOrderListCardView'} style={style.iconView}>
                                <View accessible={true} accessibilityLabel={'ProductOrderListCardSpicyLevelView'}>
                                    {data.fProductJSON.fSpicyLevel === 'SL1' ? (<Icon accessible={true} accessibilityLabel={'ProductOrderListCardSpicy1Icon'} style={style.icon} name={Icon.Icon.chilli1} preset={Icon.preset.h5}></Icon>) : (null)}
                                    {data.fProductJSON.fSpicyLevel === 'SL2' ? (<Icon accessible={true} accessibilityLabel={'ProductOrderListCardSpicy2Icon'} style={style.icon} name={Icon.Icon.chilli2} preset={Icon.preset.h5}></Icon>) : (null)}
                                    {data.fProductJSON.fSpicyLevel === 'SL3' ? (<Icon accessible={true} accessibilityLabel={'ProductOrderListCardSpicy3Icon'} style={style.icon} name={Icon.Icon.chilli3} preset={Icon.preset.h5}></Icon>) : (null)}
                                </View>
                            </View>)
                        }
                        <Text accessible={true} accessibilityLabel={'ProductOrderListCardTotalPriceText'} preset={Text.preset.titleH4B} style={style.text}>{SGLocalize.translate('orderListScreen.LabelTotalPrice')}: {dataStore.fCurrency} {VisitorHelper._showPriceText(data.fTotalGroupPrice, data.fCurrency)}</Text>
                    </View>
                    <TouchableOpacity style={style.vArrow} onPress={this._Check.bind(this)}>
                        <Icon accessible={true} accessibilityLabel={'ProductOrderListCardCRecViewArrowdownIcon'} name={this.state.click ? Icon.Icon.arrowUp : Icon.Icon.arrowDown} style={style.iconArrow} preset={Icon.preset.h3}></Icon>
                    </TouchableOpacity>
                </View>
                {this.state.click &&
                    this.props.data.fOrderDetail.map((dataDetail) => {
                        return (
                            <View accessible={true} accessibilityLabel={'ProductOrderListCardCRecViewBottomView'} style={style.v4} key={SGHelperType.getGUID()}>
                                {dataDetail.fStatus === 'neworder' || dataDetail.fStatus === 'confirmorder' ?
                                    <TouchableOpacity style={style.iconClose} onPress={() => { SGDialogBox.showInputBox(null, SGLocalize.translate("AlertMessage.AlertComment"), SGLocalize.translate("AlertMessage.AlertCommentInput"), TextInput.dataType.text, (v) => { this.setState({ comment: v }) }, false, SGLocalize.translate("AlertMessage.Cancel"), () => { }, SGLocalize.translate("AlertMessage.OK"), () => { this.props.onCancelPress(dataDetail, this.state.comment); }) }}>
                                        <Icon accessible={true} accessibilityLabel={'ActiveFollowerMirrorContentCardCloseIcon'} name={Icon.Icon.closecircle} preset={Icon.preset.h3} style={style.vIcon}></Icon>
                                    </TouchableOpacity>
                                :null}
                                <Text accessible={true} accessibilityLabel={'ProductOrderListCardCRecViewDeliverStatusText'} preset={Text.preset.titleH4B} style={dataDetail.fStatus !== "deliver" ? style.text2 : style.text3}>{SGLocalize.translate('orderListScreen.' + dataDetail.fStatus)}</Text>
                                <Text accessible={true} accessibilityLabel={'ProductOrderListCardCRecViewAddOnText'} preset={Text.preset.titleH4_5B} style={style.text}>{SGLocalize.translate('orderListScreen.LabelAddOn')}</Text>
                                {   dataDetail.fOrderCustomize.length != 0 &&
                                    dataDetail.fOrderCustomize.map((dataCustomize) => {
                                        return (
                                            <Text key={SGHelperType.getGUID()} accessible={true} accessibilityLabel={'ProductOrderListCardCRecViewCustomizationTextInput'} preset={Text.preset.titleH4B} style={style.text1}>{dataCustomize.fCustomizationJSON["fContent" + language].fCustomizeName}</Text>
                                        )
                                    })
                                }
                                <TextInput disabled={true} key={SGHelperType.getGUID()} accessible={true} accessibilityLabel={'ProductOrderListCardCRecViewCustomizationTextInput'} style={style.textInput} shadow preset={TextInput.preset.tenant1} dataType={TextInput.dataType.text} value={dataDetail.fComment}></TextInput>
                            </View>
                        )
                    })
                }
            </View>
        );
    }
}


