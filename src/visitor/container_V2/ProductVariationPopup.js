import React from 'react';
import { SGBaseContainer } from '../../core/container/SGBaseContainer';
import { SGView as View, SGButton as Button, SGText as Text, SGImage as Image, SGTextInput as TextInput, SGTouchableOpacity as TouchableOpacity, SGPopView } from '../../core/control';
import { StyleSheet } from 'react-native';
import image from '../asset/image';
import { SGLocalize } from '../locales/SGLocalize';
import { SGHelperNavigation, SGHelperGlobalVar, SGHelperType } from '../../core/helper';
import { tbLookupDAO } from '../db/tbLookupDAO';
import { CommentForm } from '../form_V2/CommentForm';
import { VisitorHelper } from '../helper/VisitorHelper';

export class ProductVariationPopup extends SGBaseContainer {

    createStyleSheet = (whp) => {
        var { w, h, p } = whp;
        return StyleSheet.create({
            mainView1: { paddingHorizontal: 4 * p, width: (w * 0.9), alignItems: 'flex-start', justifyContent: 'center', borderTopLeftRadius: 2 * p, borderTopRightRadius: 2 * p, borderWidth: w * 0.001, borderColor: 'rgb(100,100,100)', elevation: 1, shadowOpacity: 0.085, paddingBottom: 10 * p, marginVertical: 0, backgroundColor: 'white' },
            throwWHP: { width: w, height: h, padding: p },
            iconClose: { marginTop: 2 * p, width: w * 0.08, height: w * 0.08, alignSelf: 'flex-end', backgroundColor: 'white' },
            buttonCancel: { color: '#7a7a7a' },
            buttonSend: { color: '#63aee0' },
            buttonView: { flexDirection: 'row', justifyContent: 'space-between', width: (w * 0.575) },
            textNormalPrice: { marginLeft: 2 * p, marginHorizontal: 0, marginVertical: 0, color: '#747170' },
            textNormalPrice2: { marginLeft: 2 * p, marginHorizontal: 0, marginVertical: 0, textDecorationLine: 'line-through', textDecorationStyle: 'solid', color: '#747170' },
            textPromoPrice: { marginLeft: 2 * p, marginHorizontal: 0, marginVertical: 0, color: '#4aa7ab' },
            textSubTitle: { marginLeft: 2 * p, color: '#747170', marginBottom: p },
            view1: { flexDirection: 'row', borderBottomWidth: 0.3, width: (w * 0.8), justifyContent: 'flex-start', borderColor: '#D3D3D3', },
            textTitle: { color: '#747170' },
            image: { width: w * 0.16, height: w * 0.16, resizeMode: 'cover' },
            textDescTitle: { color: '#747170', marginTop: 2 * p, maxWidth: w * 0.8 }
        });
    }

    constructor(props, context, ...args) {
        super(props, context, ...args);
        this.whp = { w: props.style.width, h: props.style.height, p: props.style.padding }
        this.style = this.createStyleSheet(this.whp);
        this.title = props.title;
        this.currentUser = SGHelperGlobalVar.getVar('GlobalCurrentUser');
        this.imageSetting = SGHelperGlobalVar.getVar('GlobalImageSetting');
    }

    onSendPress() {

        this.onCloseHandler();
    }

    onCloseHandler() {
        SGPopView.hidePopView(this.props.popViewID);
    }

    render() {
        var { w, h, p } = this.whp;
        var style = this.style;
        var data = this.props.data;
        var dataContent = data['fContentCustomize' + this.props.language.toUpperCase()];

        return (

            <View accessible={true} accessibilityLabel={'ProductVariationPopupRootView'} style={style.mainView1}>
                <TouchableOpacity style={style.iconClose} onPress={this.onCloseHandler.bind(this)}>
                    <Image accessible={true} accessibilityLabel={'ProductVariationPopupCloseButtonImage'} style={style.iconClose} source={{ uri: image.closeButton[this.imageSetting].url }}></Image>
                </TouchableOpacity>
                <Text accessible={true} accessibilityLabel={'ProductVariationPopupTitle'} preset={Text.preset.titleH2B} style={style.textTitle}>{dataContent.fCustomizeName}</Text>
                <View accessible={true} accessibilityLabel={'ProductVariationPopupContainerView'} style={style.view1}>
                    <Image accessible={true} accessibilityLabel={'ProductVariationPopupImage'} style={style.image} source={{ uri: dataContent.fImageJSON[0][this.props.imageSetting].uri }}></Image>
                    {data.fCPromoPriceCustomize !== data.fCNormalPriceCustomize ?
                        (<View accessible={true} accessibilityLabel={'ProductVariationPopupAddOnDiscPriceView'} style={{ marginHorizontal: p, alignItems: 'flex-start' }}>
                            <Text accessible={true} accessibilityLabel={'ProductVariationPopupAddOnDiscPriceTitle'} style={style.textSubTitle} preset={Text.preset.titleH4B}>{SGLocalize.translate('storeProductDetailScreen.addOnPriceText')}</Text>
                            <Text accessible={true} accessibilityLabel={'ProductVariationPopupNormPriceText'} preset={Text.preset.titleH4B} style={style.textNormalPrice2}>{this.props.currency} {VisitorHelper._showPriceText(data.fCNormalPriceCustomize, data.fCurrency)}</Text>
                            <Text accessible={true} accessibilityLabel={'ProductVariationPopupDiscPriceText'} preset={Text.preset.titleH4B} style={style.textPromoPrice}>{this.props.currency} {VisitorHelper._showPriceText(data.fCPromoPriceCustomize, data.fCurrency)}</Text>
                        </View>)
                        :
                        (<View accessible={true} accessibilityLabel={'ProductVariationPopupAddOnPriceView'} style={{ marginHorizontal: p, alignItems: 'flex-start' }}>
                            <Text accessible={true} accessibilityLabel={'ProductVariationPopupAddOnPriceTitle'} style={style.textSubTitle} preset={Text.preset.titleH3B}>{SGLocalize.translate('storeProductDetailScreen.addOnPriceText')}</Text>
                            <Text accessible={true} accessibilityLabel={'ProductVariationPopupPriceText'} preset={Text.preset.titleH4B} style={style.textNormalPrice}>{this.props.currency} {VisitorHelper._showPriceText(data.fCNormalPriceCustomize, data.fCurrency)}</Text>
                        </View>)
                    }
                </View>
                <Text accessible={true} accessibilityLabel={'ProductVariationPopupDescTitle'} style={style.textDescTitle} preset={Text.preset.titleH4B}>{SGLocalize.translate('storeProductDetailScreen.descTitle')}</Text>
                <Text accessible={true} accessibilityLabel={'ProductVariationPopupDescText'} preset={Text.preset.titleH4_5}>{dataContent.fShortDescription}</Text>
            </View>
        );
    }
}
