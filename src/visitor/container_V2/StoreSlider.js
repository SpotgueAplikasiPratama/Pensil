import React from 'react';
import { SGBaseContainer } from '../../core/container/SGBaseContainer';
import { SGScrollView as ScrollView, SGTouchableOpacity as TouchableOpacity, SGText as Text, SGView as View, SGImage as Image } from '../../core/control';
import { StyleSheet } from 'react-native';
import { StoreCardSmall } from './StoreCardSmall';
import { SGHelperNavigation , SGHelperGlobalVar} from '../../core/helper';
import image from '../asset/image';

export class StoreSlider extends SGBaseContainer {
    createStyleSheet = (whp) => {
        var { w, h, p } = whp;
        return StyleSheet.create({
            bigContainer: {width: w, paddingVertical: 0, backgroundColor: '#FFFFFF', paddingTop: this.props.borderTop ? p * 3 : 2*p, paddingBottom: p * 3, borderColor: '#E7E7E7', borderTopWidth: 0, borderBottomWidth: this.props.borderBottom ? w * 0.006 : 0,marginVertical:1*p},
            mainContainer: {width: w, height: this.props.titleBar ? w * 0.61 : w * 0.51, alignSelf: 'center', backgroundColor: '#FFFFFF'},
            heading: {width: w * 0.96, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',marginVertical:this.props.marginText?4*p:0},
            headingText: {maxWidth: w * 0.75, color: '#000000', marginVertical: 0, alignSelf: 'center'},
            seeMoreText: {color: '#63AEE0'},
            sliderContainer: {width: w, height: h, padding: 0, alignSelf: 'flex-start'},
            cardSlider: {width: w, height: h, padding: p},
            seeMoreContainer: {backgroundColor: '#FFFFFF', justifyContent: 'center', alignItems: 'center', borderRadius: p * 2 },
            arrowImage: {width: w * 0.1, height: w * 0.1, backgroundColor: 'transparent', transform: [{rotate: '180deg'}]},
            textContainer: { justifyContent: 'center' },
            sliderText: { color: '#63AEE0', height: w * 0.0425 }
        });
    }

    constructor(props, context, ...args) {
        super(props, context, ...args);
        this.whp = { w: props.style.width, h: props.style.height, p: props.style.padding }
        this.style = this.createStyleSheet(this.whp);
        this.titleBar = false;
        this.imageSetting = SGHelperGlobalVar.getVar('GlobalImageSetting');
    }

    render() {
        console.log('mostLikeStore-render')
        var { w, h, p } = this.whp;
        var style = this.style;
        var data = this.props.data;
        this.titleBar = this.props.titleBar;
        return (
            <View accessible={true} style={style.bigContainer}>
                <View accessible={true} accessibilityLabel={'StoreSliderRootView'} style={style.mainContainer}>
                    {this.titleBar ?
                        (<View accessible={true} accessibilityLabel={'StoreSliderHeaderView'} style={style.heading}>
                            <Text accessible={true} accessibilityLabel={'StoreSliderTitle'} preset={Text.preset.titleH2B} style={style.headingText}>{this.props.title}</Text>
                            <TouchableOpacity onPress={() => SGHelperNavigation.navigatePush(this.props.navigator, this.props.seeMoreScreen, { title: this.props.seeMoreTitle, contentKey: this.props.contentKey, contentData: this.props.contentData })}>
                                <Text accessible={true} accessibilityLabel={'StoreSliderSeeMore'} preset={Text.preset.titleH4} style={style.seeMoreText}>{this.props.seeMoreLabel}</Text>
                            </TouchableOpacity>
                        </View>)
                    :
                        (null)
                    }
                    <ScrollView accessible={true} accessibilityLabel={'StoreSliderScrollView'} showsHorizontalScrollIndicator={false} style={style.sliderContainer} contentContainerStyle={{ justifyContent: 'center', alignItems: 'center' }} horizontal>
                        {
                            data.map((x, index) => {
                                return (
                                    <StoreCardSmall accessible={true} accessibilityLabel={'StoreSliderStoreCardSmall'} key={x.key} contentKey={x.key} screen={this.props.screen} navigator={this.props.navigator} storeName={x['fContent' + (this.props.language).toUpperCase()].fStoreName} placeName={x['fBuildingName' + (this.props.language).toUpperCase()]} image={x['fContent' + (this.props.language).toUpperCase()]['fStoreImageJSON'][0][this.props.imageSetting].uri} index={index} style={style.cardSlider}>
                                    </StoreCardSmall>
                                )
                            })
                        }
                        {this.titleBar ?
                            (null)
                        :
                            (<TouchableOpacity onPress={() => SGHelperNavigation.navigatePush(this.props.navigator, this.props.seeMoreScreen, { title: this.props.seeMoreTitle, contentKey: this.props.contentKey, contentData: this.props.contentData })}>
                                <View accessible={true} shadowIntensity={0.6} style={style.seeMoreContainer}>
                                    <Image accessible={true} source={{ uri: image.backLineBlackIcon[this.imageSetting].url }} style={style.arrowImage}></Image>
                                    <View accessible={true} style={style.textContainer}>
                                        <Text accessible={true} numberOfLines={1} preset={Text.preset.titleH4B} style={style.sliderText}>{this.props.seeMoreLabel}</Text>
                                    </View>
                                </View>
                            </TouchableOpacity>)
                        }
                    </ScrollView>
                </View>
            </View>
        );
    }
}
