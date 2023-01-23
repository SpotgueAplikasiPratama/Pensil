import React from 'react';
import { SGBaseContainer } from '../../core/container/SGBaseContainer';
import { SGImage as Image, SGView as View, SGText as Text, SGTouchableOpacity as TouchableOpacity, SGViewPager as ViewPager } from '../../core/control';
import { StyleSheet } from 'react-native';
import { SGHelperNavigation } from '../../core/helper';
import { SGLocalize } from '../locales/SGLocalize';

export class StoreEventSliderAndroidTV extends SGBaseContainer {
    createStyleSheet = (whp) => {
        var { w, h, p } = whp;
        w=(w-4*p)/2
        // console.log(w)
        return StyleSheet.create({
            mainContainer: {width: w, backgroundColor: '#FFFFFF', borderColor: '#E7E7E7'},
            header: {width: w , backgroundColor: '#FFFFFF',  flexDirection: 'column',marginBottom:1.5*p},
            descriptionText: { marginVertical: 0},
            sliderContainer: {width: w, height: w * 9 / 16, backgroundColor: '#FFFFFF', borderRadius: 0},
            sliderImage: {width: w, height: w  * 9 / 16, resizeMode: 'stretch', alignSelf: 'center', marginVertical: 0, marginHorizontal: 0, borderRadius: 0}
        });
    }

    constructor(props, context, ...args) {
        super(props, context, ...args);
        this.whp = { w: props.style.width, h: props.style.height, p: props.style.padding }
        this.style = this.createStyleSheet(this.whp);
        this.oneLineSeeMore = false,
        this.twoLine = false;
    }

    render() {
        var { w, h, p } = this.whp;
        var style = this.style;
        var data = this.props.data;
        this.oneLineSeeMore = this.props.oneLineSeeMore;
        this.twoLine = this.props.twoLine;
        return (
            <View accessible={true} accessibilityLabel={'StorePromoMainContainer'} style={style.mainContainer}>
                <View accessible={true} accessibilityLabel={'StorePromoHeader'} style={style.header}>
                    <Text accessible={true} preset={Text.preset.h9B} style={style.descriptionText}>{this.props.title}</Text>
                </View>
                <ViewPager halfWidth accessible={true} bottom={0} accessibilityLabel={'StorePromoSliderViewPager'}  style={style.sliderContainer} pageIndicatorStyle={{width:w,height:h}} initialPage={0} showPageIndicator={true} transitionStyle={'scroll'} pageIndicatorStyle={{ position: 'absolute', bottom: 0 * p, flexDirection: 'row', alignSelf: 'center' }}>
                    {
                        data.map((x) => {
                            return (
                                <TouchableOpacity key={x.key} >
                                    <Image accessible={true} accessibilityLabel={'StorePromoSliderImage'} style={style.sliderImage} source={{ uri: x['fContent' + (this.props.language).toUpperCase()]['fImageJSON'][0][this.props.imageSetting].uri }}></Image>
                                </TouchableOpacity>
                            )
                        })
                    }
                </ViewPager>
                {/* <Text>a</Text> */}
            </View>

        );
    }
}
