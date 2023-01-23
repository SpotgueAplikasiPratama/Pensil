/*
* Version 1.2.0
* Leon, 4 May 2021
  - Fix Like
*/
import React from 'react';
import { SGBaseContainer } from '../../core/container/SGBaseContainer';
import { SGScrollView as ScrollView, SGTouchableOpacity as TouchableOpacity, SGText as Text, SGView as View } from '../../core/control';
import { StyleSheet } from 'react-native';
import { RestoMenuSliderCard } from './RestoMenuSliderCard';
import { RestoMenuPdfSliderCard } from './RestoMenuPdfSliderCard';
import { SGLocalize } from '../locales/SGLocalize';
import { SGHelperNavigation } from '../../core/helper';

export class RestoMenuSlider extends SGBaseContainer {
    createStyleSheet = (whp) => {
        var { w, h, p } = whp;
        return StyleSheet.create({
            throwWHP: { width: w, height: h, padding: p },
            mainContainer: { width: w, height: w * 0.62 + p * 5, alignSelf: 'center', marginTop: 2 * p, borderBottomWidth: p * 0.55, borderBottomColor: '#E6E6E6' },
            sliderHeader: { width: w, paddingLeft: p * 5, paddingRight: p * 2, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
            categoryNameText: { color: '#000000', marginVertical: 0 },
            description: { width: w, flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', maxWidth: w * 0.945 },
            descriptionText: { color: '#7D7D7D', marginTop: 0, marginBottom: 0 },
            seeMoreText: { color: '#63AEE0', marginVertical: 0 },
            sliderContainer: { width: w, padding: 0, paddingLeft: p * 5, marginBottom: p * 5 },
            cardSlider: { width: w, height: h, padding: p }
        });
    }

    constructor(props, context, ...args) {
        super(props, context, ...args);
        this.whp = { w: props.style.width, h: props.style.height, p: props.style.padding }
        this.style = this.createStyleSheet(this.whp);
    }


    _getLikeResource(data) {
        var contentRestoMenuID = data.fContentID;
        var contentRestoMenuEN = data.fContentEN;
        var contentRestoMenuCN = data.fContentCN;
        return (
            { fContentType: 'RestoMenu', fContentKey: data.key, fText1: { id: contentRestoMenuID.fProductName, en: contentRestoMenuEN.fProductName, cn: contentRestoMenuCN.fProductName }, fText2: { id: data.fRestoNameID, en: data.fRestoNameEN, cn: data.fRestoNameCN }, fText3: { id: data.fBuildingNameID, en: data.fBuildingNameEN, cn: data.fBuildingNameCN }, fImageID: contentRestoMenuID.fImageJSON, fImageEN: contentRestoMenuEN.fImageJSON, fImageCN: contentRestoMenuCN.fImageJSON, fTargetKey: data.restoKey }
        )
    }

    render() {
        var { w, h, p } = this.whp;
        var style = this.style;
        var data = this.props.restoMenuData;
        // console.log('resto menu slider')
        // console.log(JSON.stringify(data[0]));
        return (
            <View accessible={true} accessibilityLabel={'RestoMenuSliderRootView'} style={style.mainContainer}>
                <View accessible={true} accessibilityLabel={'RestoMenuSliderHeaderView'} style={style.sliderHeader}>
                    <Text accessible={true} accessibilityLabel={'RestoMenuSliderTitle'} preset={Text.preset.titleH2B} style={style.categoryNameText}>{this.props.title}</Text>
                    {this.props.pdfMode === true ?
                        (null)
                        :
                        (<TouchableOpacity onPress={() => SGHelperNavigation.navigatePush(this.props.navigator, 'RestoMenuList', { screenTitle: this.props.title, restoKey: this.props.selectedRestoKey, categoryKey: this.props.categoryKey })}>
                            <Text accessible={true} accessibilityLabel={'RestoMenuSliderSeeMoreText'} preset={Text.preset.titleH4B} style={style.seeMoreText}>{this.props.seeMoreLabel}</Text>
                        </TouchableOpacity>)
                    }
                </View>
                <ScrollView accessible={true} accessibilityLabel={'RestoMenuSliderScrollView'} showsHorizontalScrollIndicator={false} style={style.sliderContainer} horizontal>
                    {
                        data.map((x, index) => {
                            return (
                                this.props.pdfMode === true ?
                                    (<RestoMenuPdfSliderCard accessible={true} accessibilityLabel={'RestoMenuSliderCard'} language={this.props.language} imageSetting={this.props.imageSetting} navigator={this.props.navigator} key={x.key} data={x} currency={this.props.currency} style={style.throwWHP}></RestoMenuPdfSliderCard>) :
                                    (<RestoMenuSliderCard onLike={((item, s,c)=>{console.log(item);  item.fUserLikedThis = s; item.fLikeCountProduct+=c; this.forceUpdate();}).bind(this, x)} accessible={true} accessibilityLabel={'RestoMenuSliderCard'} likePackage={this._getLikeResource(x)} language={this.props.language} imageSetting={this.props.imageSetting} navigator={this.props.navigator} key={x.key} data={x} currency={this.props.currency} style={style.throwWHP}></RestoMenuSliderCard>)
                            )
                        })
                    }
                </ScrollView>
            </View>
        );
    }
}
