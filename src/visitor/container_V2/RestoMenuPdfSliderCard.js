import React from 'react';
import { SGBaseContainer } from '../../core/container/SGBaseContainer';
import { SGImage as Image, SGTouchableOpacity as TouchableOpacity, SGText as Text, SGView as View, SGIcon as Icon, SGPopView } from '../../core/control';
import { StyleSheet } from 'react-native';
import { SGHelperNavigation, SGHelperGlobalVar, SGHelperType } from '../../core/helper';
import { DiscountTag } from '../component_V2/DiscountTag';
import { CardIconButton } from '../component_V2/CardIconButton';
import { SGLocalize } from '../locales/SGLocalize';
import { tbLookupDAO } from '../db/tbLookupDAO';

export class RestoMenuPdfSliderCard extends SGBaseContainer {
    createStyleSheet = (whp) => {
        var { w, h, p } = whp;
        return StyleSheet.create({
            throwWHP: { width: this.whp.w, height: this.whp.h, padding: this.whp.p },
            mainView: { marginVertical: p, backgroundColor: '#080808', width: w * 0.32, height: w * 0.5, borderRadius: 2 * p, borderColor: '#bb9748', marginHorizontal: 0.5 * p, borderWidth: 0.75, justifyContent: 'flex-start', },
            image: { width: w * 0.29, height: w * 0.29, marginTop: 1.5 * p, marginHorizontal: 1.5 * p, borderRadius: 2 * p, },
            text: { alignSelf: 'flex-start', color: '#747170' },
            iconView: { width: w * 0.29, height: w * 0.04, flexDirection: 'row', padding: 0, marginVertical: 0, justifyContent: 'flex-start', },
            icon: { color: '#bb9748', marginVertical: 0, marginHorizontal: 0 },
            textProductName: { alignSelf: 'flex-start', marginLeft: 2 * p, color: 'white' },
            normalPrice1: { marginVertical: 0, alignSelf: 'flex-start', color: 'white', },
            normalPrice2: { marginVertical: 0, alignSelf: 'flex-start', color: 'white', textDecorationLine: 'line-through', textDecorationStyle: 'solid', textDecorationColor: '#bb9748' },
            promoPrice: { alignSelf: 'flex-start', color: '#bb9748' },
            priceView: { width: w * 0.29, },
            tag: { position: 'absolute', right: 0, top: 0, zIndex: 100, width: w * 0.08 * 1.2, height: w * 0.08 * 1 },
        });
    }

    onCardPress(screen) {
        this.props.navigator.navigate(screen)
    }

    constructor(props, context, ...args) {
        super(props, context, ...args);
        this.whp = { w: props.style.width, h: props.style.height, p: props.style.padding };
        this.style = this.createStyleSheet(this.whp);
        this.pvID1 = SGPopView.getPopViewID();
    }

    onShowHandler(pvID) {
        SGPopView.showPopView(pvID);
    }

    onCloseHandler() {
        SGPopView.hidePopView(this.pvID1);
    }

    render() {
        var { w, h, p } = this.whp;
        var style = this.style;
        var data = this.props.data;
        var dataContent = data['fContent' + this.props.language.toUpperCase()];
        console.log(dataContent);
        return (
            <TouchableOpacity onPress={() => SGHelperNavigation.navigatePush(this.props.navigator, 'PDFViewer', { pdfLink: dataContent.fPdfFile })}>
                <SGPopView accessible={true} accessibilityLabel={'PdfActionPopView1'} vPos={'Top'} modal popViewID={this.pvID1}>
                    {/* <PdfActionPopup accessible={true} accessibilityLabel={'PdfActionPopup'} onCloseHandler={this.onCloseHandler.bind(this)} navigator={this.props.navigator} selectedPdfLink={dataContent.fPdfFile} popViewID={this.pvID1} style={style.throwWHP}></PdfActionPopup> */}
                    {/* <PdfActionPopup accessible={true} accessibilityLabel={'PdfActionPopup'} onCloseHandler={this.onCloseHandler.bind(this)} navigator={this.props.navigator} selectedPdfLink={'https://stacks.stanford.edu/file/druid:jt687kv7146/jt687kv7146.pdf'} popViewID={this.pvID1} style={style.throwWHP}></PdfActionPopup> */}
                </SGPopView>
                <View accessible={true} accessibilityLabel={'RestoMenuPdfSliderCardRootView'} style={style.mainView}>
                    <Image accessible={true} accessibilityLabel={'RestoMenuPdfSliderCardImage'} style={style.image} source={{ uri: dataContent.fImageJSON[0][this.props.imageSetting].uri }}></Image>
                    <Text accessible={true} accessibilityLabel={'RestoMenuPdfSliderCardProductName'} preset={Text.preset.titleH3} style={style.textProductName}>{dataContent.fProductPdf}</Text>
                </View>
            </TouchableOpacity>
        );
    }
}
