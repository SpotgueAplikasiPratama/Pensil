import React from 'react';
import { SGBaseContainer } from '../../core/container/SGBaseContainer';
import { SGImage as Image, SGView as View, SGText as Text, SGTouchableOpacity as TouchableOpacity, SGViewPager as ViewPager } from '../../core/control';
import { StyleSheet } from 'react-native';
import { SGHelperNavigation } from '../../core/helper';
import { SGLocalize } from '../locales/SGLocalize';

export class AuctionSlider extends SGBaseContainer {
    createStyleSheet = (whp) => {
        var { w, h, p } = whp;
        return StyleSheet.create({
            mainContainer: {width: w, backgroundColor: '#FFFFFF', paddingTop: this.props.borderTop ? p * 2 : 0, paddingBottom: this.props.borderBottom ? p * 3 : 0, borderColor: '#E7E7E7', borderTopWidth: 0, borderBottomWidth: this.props.borderBottom ? w * 0.006 : 0},
            header: {width: w * 0.96, backgroundColor: '#FFFFFF',  flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'flex-start'},
            heading: {width: w * 0.96, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',marginVertical:this.props.marginText ? 4*p : 2*p},
            headingText: {maxWidth: w * 0.75, color: '#000000', marginVertical: 0, alignSelf: 'center'},
            description: {width: w * 0.96, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',marginBottom:2*p},
            descriptionText: {color: '#7D7D7D', marginVertical: 0},
            seeMoreHeadingText: {color: '#63AEE0'},
            seeMoreDescriptionText: {color: '#63AEE0'},
            sliderContainer: {width: w, height: w * 1.1 * 9 / 16, backgroundColor: '#FFFFFF', borderRadius: 0},
            sliderImage: {width: w, height: w * 9 / 16, resizeMode: 'cover', alignSelf: 'center', marginVertical: 0, marginHorizontal: 0, borderRadius: 0},
           
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
        console.log('auction slider')
        console.log(data);
        console.log(this.props.screen)
        return (
            <View accessible={true} accessibilityLabel={'AuctionMainContainer'} style={style.mainContainer}>
                <View accessible={true} accessibilityLabel={'AuctionHeader'} style={style.header}>
                    <View accessible={true} accessibilityLabel={'AuctionHeading'} style={style.heading}>
                        <Text accessible={true} preset={Text.preset.heading4B} style={style.headingText}>{this.props.titleHeading}</Text>
                        {this.oneLineSeeMore ?
                            (<TouchableOpacity onPress={() => SGHelperNavigation.navigatePush(this.props.navigator, this.props.seeMoreScreen, { title: this.props.seeMoreTitle, contentKey: this.props.contentKey,contentData: this.props.contentData })}>
                                <Text accessible={true} accessibilityLabel={'AuctionSliderSeeMore'} preset={Text.preset.heading8B} style={style.seeMoreHeadingText}>{this.props.seeMoreLabel}</Text>
                            </TouchableOpacity>)
                        :
                            (null)
                        }
                    </View>
                    {this.twoLine ?
                        (<View accessible={true} accessibilityLabel={'AuctionDescription'} style={style.description}>
                            <Text accessible={true} preset={Text.preset.heading6} style={style.descriptionText}>{this.props.title}</Text>
                            <TouchableOpacity onPress={() => SGHelperNavigation.navigatePush(this.props.navigator, this.props.seeMoreScreen, { title: this.props.seeMoreTitle, contentKey: this.props.contentKey,contentData: this.props.contentData })}>
                                <Text accessible={true} accessibilityLabel={'AuctionSliderSeeMore'} preset={Text.preset.heading8B} style={style.seeMoreDescriptionText}>{this.props.seeMoreLabel}</Text>
                            </TouchableOpacity>
                        </View>)
                    :
                        (null)
                    }
                </View>
                <ViewPager accessible={true} accessibilityLabel={'AuctionSliderViewPager'} style={style.sliderContainer} initialPage={0} showPageIndicator={true} transitionStyle={'scroll'} pageIndicatorStyle={{ position: 'absolute', bottom: 0 * p, flexDirection: 'row', alignSelf: 'center' }}>
                    {
                        data.map((x) => {
                            return (
                                <TouchableOpacity key={x.key} onPress={() => { SGHelperNavigation.navigatePush(this.props.navigator, this.props.screen, { contentKey: x.key }) }}>
                                    <Image accessible={true} accessibilityLabel={'AuctionSliderImage'} style={style.sliderImage} source={{ uri: x['fContent' + (this.props.language).toUpperCase()]['fImageJSON'][0][this.props.imageSetting].uri }}></Image>
                                </TouchableOpacity>
                            )
                        })
                    }
                </ViewPager>
            </View>

        );
    }
}
