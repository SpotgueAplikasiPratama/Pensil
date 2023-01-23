import React from 'react';
import { SGBaseContainer } from '../../core/container/SGBaseContainer';
import { SGScrollView as ScrollView, SGTouchableOpacity as TouchableOpacity, SGText as Text, SGView as View } from '../../core/control';
import { StyleSheet } from 'react-native';
import { StoreCategoryProductCard } from './StoreCategoryProductCard';
import { SGLocalize } from '../locales/SGLocalize';
import image from '../asset/image';

export class StoreProductCategorySlider extends SGBaseContainer {
    createStyleSheet = (whp) => {
        var { w, h, p } = whp;
        return StyleSheet.create({
            mainView1: { width: w, alignSelf: 'center', padding: p, backgroundColor: '#FFFFFF', borderColor: '#E7E7E7' },
            sliderView1: { width: w - 2 * p, paddingVertical: p },
            textTitle: { maxWidth: w * 0.9, color: '#000000' },
            textSeeMore: { color: '#63aee0' },
            image: { width: w, height: w * 0.4, resizeMode: 'contain', backgroundColor: 'transparent' },
            sliderHeader: { width: w - 5 * p, height: w * 0.12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', },
            throwWHP: { width: w, height: h, padding: p, }
        });
    }

    constructor(props, context, ...args) {
        super(props, context, ...args);
        this.whp = { w: props.style.width, h: props.style.height, p: props.style.padding }
        this.style = this.createStyleSheet(this.whp);
    }

    getIndexingList(data) {
        var indexList = [];
        //tambahan
        if(this.props.secondTab){
            if(this.props.promoCatalog){
                indexList.push('promoCatalog');
            }
        }
        //end
        if (this.props.showTrending === 'Y') {
            indexList.push('trending');
        }
     
        if (this.props.showBestSeller === 'Y') {
            indexList.push('bestSeller');
        }
        //tambahan
        if(this.props.showRestoBooking){
            indexList.push('showRestoBooking');
        }
        //end
        for (var i = 0; i < data.length; i++) {
            indexList.push(data[i].key);
        }
        return (indexList);
    }

    render() {
        var { w, h, p } = this.whp;
        var style = this.style;
        var data = this.props.storeProductCategory;
        var pageList = this.getIndexingList(data); 
        var showRestoBooking = this.props.showRestoBooking;
        console.log(pageList);
        console.log(this.props.secondTab);
        // showRestoBooking? (this.props.promoCatalog ? (this.props.secondTab ? pageList.indexOf(x.key) + 3 : pageList.indexOf(x.key) + 2) : pageList.indexOf(x.key) + 2) : (this.props.promoCatalog ? pageList.indexOf(x.key) + 2 : pageList.indexOf(x.key) + 1)
        return (
            <View accessible={true} accessibilityLabel={'StoreProductCategorySliderRootView'} style={style.mainView1}>
                <View accessible={true} accessibilityLabel={'StoreProductCategorySliderHeaderView'} style={style.sliderHeader}>
                    <Text accessible={true} accessibilityLabel={'StoreProductCategorySliderTitle'} preset={Text.preset.titleH2B} style={style.textTitle}>{this.props.title}</Text>
                </View>
                <ScrollView accessible={true} accessibilityLabel={'StoreProductCategorySliderScrollView'} showsHorizontalScrollIndicator={false} style={style.sliderView1} horizontal snapToInterval={w * 0.275}>
                    {this.props.showTrending === 'Y' ?
                        <StoreCategoryProductCard accessible={true} accessibilityLabel={'StoreProductCategorySliderTrendingCard'} goToIndex={pageList.indexOf('trending') + 1} goToPage={this.props.goToPage} image={image.trendingProductCategory[this.props.imageSetting].url} categoryName={SGLocalize.translate("storeHomeScreen.trendingTitle")} style={style.throwWHP}></StoreCategoryProductCard> : (null)}
                    {
                        data.map((x, index) => {
                            return (
                                <StoreCategoryProductCard accessible={true} accessibilityLabel={'StoreProductCategorySliderStoreCategoryCard'} language={this.props.language} imageSetting={this.props.imageSetting} goToIndex={pageList.indexOf(x.key) + 1} goToPage={this.props.goToPage} key={index} productCategoryKey={x.key} categoryName={x['fContent' + this.props.language.toUpperCase()].fCategoryName} image={x['fContent' + this.props.language.toUpperCase()].fImageJSON[0][this.props.imageSetting].uri} style={style.throwWHP}></StoreCategoryProductCard>
                            )
                        })
                    }
                </ScrollView>
            </View>
        );
    }
}
