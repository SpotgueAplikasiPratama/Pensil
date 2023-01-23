/*
* Version 1.2.0
* Leon, 4 May 2021
  - Fix Like
*/
import React from 'react';
import { SGBaseContainer } from '../../core/container/SGBaseContainer';
import { SGScrollView as ScrollView, SGTouchableOpacity as TouchableOpacity, SGText as Text, SGView as View } from '../../core/control';
import { StyleSheet } from 'react-native';
import { ProductSliderMixCard } from './ProductSliderMixCard';
import { SGLocalize } from '../locales/SGLocalize';
import { SGHelperNavigation } from '../../core/helper';

export class ProductStoreRestoMix extends SGBaseContainer {
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
            sliderContainer: { width: w, padding: 0, paddingLeft: p * 2, marginBottom: p * 5 },
        });
    }

    constructor(props, context, ...args) {
        super(props, context, ...args);
        this.whp = { w: props.style.width, h: props.style.height, p: props.style.padding }
        this.style = this.createStyleSheet(this.whp);
    }


    _getLikeRestoResource(data) {
        var contentID = data.fContentID;
        var contentEN = data.fContentEN;
        var contentCN = data.fContentCN;
        return (
            { fContentType: 'RestoMenu', fContentKey: data.key, fText1: { id: contentID.fProductName, en: contentEN.fProductName, cn: contentCN.fProductName }, fText2: { id: data.fStoreNameID, en: data.fStoreNameEN, cn: data.fStoreNameCN }, fText3: { id: data.fBuildingNameID, en: data.fBuildingNameEN, cn: data.fBuildingNameCN }, fImageID: contentID.fImageJSON, fImageEN: contentEN.fImageJSON, fImageCN: contentCN.fImageJSON, fTargetKey: data.storeKey }
        )
    }

    _getLikeStoreResource(data) {
        var contentID = data.fContentID;
        var contentEN = data.fContentEN;
        var contentCN = data.fContentCN;
        return (
            { fContentType: 'StoreProduct',fContentKey: data.key, fText1: { id: contentID.fProductName, en: contentEN.fProductName, cn: contentCN.fProductName }, fText2: { id: data.fStoreNameID, en: data.fStoreNameEN, cn: data.fStoreNameCN }, fText3: { id: data.fBuildingNameID, en: data.fBuildingNameEN, cn: data.fBuildingNameCN }, fImageID: contentID.fImageJSON, fImageEN: contentEN.fImageJSON, fImageCN: contentCN.fImageJSON, fTargetKey: data.storeKey }
        )
    }

    navigateType(){
        if(this.props.type ===1){
            SGHelperNavigation.navigatePush(this.props.navigator, 'StoreRestoProductList',{buildingKey : this.props.contentKey})
        }else{
            SGHelperNavigation.navigatePush(this.props.navigator, 'StoreRestoHashTagProductList',{buildingKey : this.props.contentKey,screenTitle:this.props.hashTag})
        }
       
    }

    render() {
        var { w, h, p } = this.whp;
        var style = this.style;
        var data = this.props.data;
        return (
            <View accessible={true} accessibilityLabel={'RestoMenuSliderRootView'} style={style.mainContainer}>
                <View accessible={true} accessibilityLabel={'RestoMenuSliderHeaderView'} style={style.sliderHeader}>
                    <Text accessible={true} accessibilityLabel={'RestoMenuSliderTitle'} preset={Text.preset.titleH2B} style={style.categoryNameText}>{this.props.type ==1 ? SGLocalize.translate('mallHomeScreen.SecretSaleText'): this.props.hashTag}</Text>
                        <TouchableOpacity onPress={()=>{this.navigateType()}}>
                            <Text accessible={true} accessibilityLabel={'RestoMenuSliderSeeMoreText'} preset={Text.preset.titleH4B} style={style.seeMoreText}>{this.props.seeMoreLabel}</Text>
                        </TouchableOpacity>
                </View>
                <ScrollView accessible={true} accessibilityLabel={'RestoMenuSliderScrollView'} showsHorizontalScrollIndicator={false} style={style.sliderContainer} horizontal>
                    {
                        data.map((x, index) => {
                            return (
                            <ProductSliderMixCard onLike={((item, s,c)=>{console.log(item);  item.fUserLikedThis = s; item.fLikeCountProduct+=c; this.forceUpdate();}).bind(this, x)} accessible={true} accessibilityLabel={'RestoMenuSliderCard'} likePackage={x.fType =='resto'? this._getLikeRestoResource(x) :this._getLikeStoreResource(x)} language={this.props.language} imageSetting={this.props.imageSetting} navigator={this.props.navigator} key={x.key} data={x} currency={this.props.currency} style={style.throwWHP} type={this.props.type}></ProductSliderMixCard>)  
                        })
                    }
                </ScrollView>
            </View>
        );
    }
}
