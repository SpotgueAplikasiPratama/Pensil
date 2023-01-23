import React from 'react';
import { SGBaseContainer } from '../../core/container/SGBaseContainer';
import { SGImage as Image, SGView as View, SGText as Text, SGTouchableOpacity as TouchableOpacity, SGViewPager as ViewPager } from '../../core/control';
import { StyleSheet } from 'react-native';
import { SGHelperNavigation, SGHelperStyle } from '../../core/helper';

export class PlaceEventSliderAndroidTV extends SGBaseContainer {
    createStyleSheet = (whp) => {
       
        var { w, h, p } = whp;
        return StyleSheet.create({
            mainContainer: {width: w, backgroundColor: '#FFFFFF', paddingTop: 0, paddingBottom: 0, borderColor: '#E7E7E7', borderTopWidth: 0,marginVertical:0,paddingVertical:0,margin:0,padding:0},
            header: {width: w , backgroundColor: '#FFFFFF', marginVertical: p, flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'flex-start'},
            heading: {width: w , flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',marginVertical:this.props.marginText ? 4*p : 2*p},
            headingText: {maxWidth: w * 0.75, color: '#000000', marginVertical: 0, alignSelf: 'center'},
            description: {width: w , flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'space-between', marginVertical:p,paddingLeft:1.5*p},
            descriptionText: {color: SGHelperStyle.color.SGText.TextBlack, marginVertical: 0},
            seeMoreHeadingText: {color: '#63AEE0'},
            seeMoreDescriptionText: {color: '#63AEE0'},
            sliderContainer: {width: w, height: w * 0.55, backgroundColor: '#FFFFFF', borderRadius: 0},
            sliderImage: {width: w, height:w * 0.55, resizeMode: 'stretch', alignSelf: 'center', marginVertical: 0, marginHorizontal: 0, borderRadius: 0,padding:0}
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
        return (
            <View accessible={true} accessibilityLabel={'PlaceEventMainContainer'} style={style.mainContainer}>
               <View accessible={true} accessibilityLabel={'PlaceEventDescription'} style={style.description}>
                    <Text accessible={true} preset={Text.preset.h8B} style={style.descriptionText}>{this.props.titleHeading+" "+this.props.mallName}</Text>
                </View>
                <ViewPager accessible={true} accessibilityLabel={'PlaceEventSliderViewPager'} bottom={0} halfWidth style={style.sliderContainer} initialPage={0} showPageIndicator={true} transitionStyle={'scroll'} pageIndicatorStyle={{position: 'absolute', marginVertical: 0, flexDirection: 'row', alignSelf: 'center' }}>
                    {
                        data.map((x) => {
                            return (
                                <TouchableOpacity key={x.key} >
                                    <Image accessible={true} accessibilityLabel={'PlaceEventSliderImage'} style={style.sliderImage} source={{ uri: x['fContent' + (this.props.language).toUpperCase()]['fImageJSON'][0][this.props.imageSetting].uri }}></Image>
                                </TouchableOpacity>
                            )
                        })
                    }
                </ViewPager>
            </View>

        );
    }
}
