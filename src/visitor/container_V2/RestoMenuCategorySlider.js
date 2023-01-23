import React from 'react';
import { SGBaseContainer } from '../../core/container/SGBaseContainer';
import { SGScrollView as ScrollView, SGTouchableOpacity as TouchableOpacity, SGText as Text, SGView as View } from '../../core/control';
import { StyleSheet } from 'react-native';
import { RestoCategoryProductCard } from './RestoCategoryProductCard';
import { SGLocalize } from '../locales/SGLocalize';

export class RestoMenuCategorySlider extends SGBaseContainer {
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
        if (this.props.showTrending === 'Y') {
            indexList.push('trending');
        }
        if (this.props.showBestSeller === 'Y') {
            indexList.push('bestSeller');
        }
        for (var i = 0; i < data.length; i++) {
            indexList.push(data[i].key);
        }
        return (indexList);
    }

    render() {
        var { w, h, p } = this.whp;
        var style = this.style;
        var data = this.props.restoCategory;
        var pageList = this.getIndexingList(data);
        console.log('Resto Menu Category')
        console.log(this.props.highlight);
        return (
            <View accessible={true} accessibilityLabel={'restoCategorySliderRootView'} style={style.mainView1}>
                <View accessible={true} accessibilityLabel={'restoCategorySliderHeaderView'} style={style.sliderHeader}>
                    <Text accessible={true} accessibilityLabel={'restoCategorySliderTitle'} preset={Text.preset.titleH2B} style={style.textTitle}>{this.props.title}</Text>
                </View>
                <ScrollView accessible={true} accessibilityLabel={'restoCategorySliderScrollView'} showsHorizontalScrollIndicator={false} style={style.sliderView1} horizontal snapToInterval={w * 0.275}>
                    {this.props.showTrending === 'Y' ?
                        <RestoCategoryProductCard accessible={true} accessibilityLabel={'restoCategorySliderTrendingCard'} goToIndex={pageList.indexOf('trending') + 1} goToPage={this.props.goToPage} image='https://spotgue.com/dev/visitor/trending_category.jpeg' categoryName={SGLocalize.translate("storeHomeScreen.trendingTitle")} style={style.throwWHP}></RestoCategoryProductCard> : (null)}
                    {
                        data.map((x, index) => {
                            return (
                                <RestoCategoryProductCard accessible={true} accessibilityLabel={'restoCategorySliderStoreCategoryCard'} language={this.props.language} imageSetting={this.props.imageSetting} goToIndex={this.props.doubleNav ? 2 : 1} goToPage={this.props.goToPage} key={index} productCategoryKey={x.key} categoryName={x['fCategoryName'+this.props.language.toUpperCase()]} image={x['fContent' + this.props.language.toUpperCase()].fImageJSON[0][this.props.imageSetting].uri} style={style.throwWHP}></RestoCategoryProductCard>
                            )
                        })
                    }
                </ScrollView>
            </View>
        );
    }
}
