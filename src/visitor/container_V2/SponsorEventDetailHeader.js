import React from 'react';
import { SGBaseContainer } from '../../core/container/SGBaseContainer';
import { SGView as View, SGText as Text, SGImage as Image, SGTouchableOpacity as TouchableOpacity, SGViewPager as ViewPager } from '../../core/control';
import { StyleSheet } from 'react-native';
import { CardIconButton,CardIconButtonComment,CardIconButtonLike,CardIconButtonShare } from '../component_V2/CardIconButton';
import { SGLocalize } from '../locales/SGLocalize';
import { SGHelperNavigation, SGHelperGlobalVar, SGHelperType } from '../../core/helper';
import { DateTag } from '../component_V2/DateTag';
import { VisitorHelper } from '../helper/VisitorHelper';

export class SponsorEventDetailHeader extends SGBaseContainer {
    createStyleSheet = (whp) => {
        var { w, h, p } = whp;
        return StyleSheet.create({
            mainContainer: { width: w, backgroundColor: '#FFFFFF', justifyContent: 'flex-start', borderRadius: 0 },
            sliderContainer: { width: w, height: w * 1.2 * 9 / 16, backgroundColor: '#FFFFFF', borderRadius: 0 },
            sliderImage: { width: w, height: w * 9 / 16, resizeMode: 'cover', alignSelf: 'flex-start', marginVertical: 0, marginHorizontal: 0, borderRadius: 0, overflow: 'visible' },
            tag: { position: 'absolute', alignSelf: 'flex-start', top: 0, height: w * 0.09, right: 0 },
            sponsorAndIconContainer: { width: w * 0.97, backgroundColor: '#FFFFFF', flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: p,marginVertical:2*p },
            sponsorContainer: { width: w * 0.65, flexDirection: 'row', justifyContent: 'flex-start' },
            sponsorThumbnailImage: { width: w * 0.165, height: w * 0.165, backgroundColor: '#FFFFFF', resizeMode: 'cover', borderRadius: p * 100 },
            footerTextView: { width:(w - p * 10)*0.4,justifyContent: 'flex-start', alignItems: 'flex-start' },
            textFooterName: { color: '#000000', maxWidth: w * 0.6},
            textPatners: { color: '#bebebe', maxWidth: w * 0.6 },
            iconButtonView: { width: w * 0.3, flexDirection: 'row', justifyContent: 'flex-end' },
            iconButton: { width: w * 0.85, padding: p * 0.85 },
        });
    }

    constructor(props, context, ...args) {
        super(props, context, ...args);
        this.whp = { w: props.style.width, h: props.style.height, p: props.style.padding }
        this.style = this.createStyleSheet(this.whp);
        this.title = props.title;
        this._language = SGHelperGlobalVar.getVar('GlobalLanguage')
    }

    render() {
        var { w, h, p } = this.whp;
        var style = this.style;
        return (
            <View accessible={true} accessibilityLabel={'EventDetailHeaderRootView'} style={style.mainContainer}>
                <View accessible={true}>
                    <ViewPager accessible={true} accessibilityLabel={'EventDetailHeaderViewPager'} style={style.sliderContainer} initialPage={0} showPageIndicator={true} transitionStyle={'scroll'} pageIndicatorStyle={{ position: 'absolute', bottom: 0 * p, flexDirection: 'row', alignSelf: 'center' }}>
                        {
                            (this.props.imageSlider).map((x, index) => {
                                return (
                                    <View accessible={true} accessibilityLabel={'EventDetailHeaderImageView'} key={x.id}>
                                        <Image accessible={true} accessibilityLabel={'EventDetailHeaderImage'} style={style.sliderImage} source={{ uri: x[this.props.imageSetting].uri }}></Image>
                                    </View>
                                )
                            })
                        }
                    </ViewPager>
                    <DateTag accessible={true} accessibilityLabel={'EventDetailScreenDateTag'} style={style.tag} startDate={this.props.startDate} endDate={this.props.endDate} leftMode></DateTag>
                </View>
               
                    <View accessible={true} style={style.sponsorAndIconContainer}>
                            <View accessible={true} accessibilityLabel={'EventDetailHeaderFooterView'} style={style.sponsorContainer}>
                                <Image accessible={true} accessibilityLabel={'EventDetailHeaderFooterLogo'} style={style.sponsorThumbnailImage} source={{ uri: this.props.dataContentFooter.fSponsorImageJSON[0][this.props.imageSetting].uri }}></Image>
                                <View accessible={true} accessibilityLabel={'EventDetailHeaderFooterTextView'} style={style.footerTextView}>
                                    <Text accessible={true} accessibilityLabel={'EventDetailHeaderFooterName'} preset={Text.preset.titleH3B} style={style.textFooterName} numberOfLines={2}>{this.props.dataContentFooter.fSponsorName}</Text>
                                    <Text accessible={true} accessibilityLabel={'EventDetailPatnersText'} preset={Text.preset.titleH4B} style={style.textPatners} numberOfLines={1}>{SGLocalize.translate('globalText.PatnersText')}</Text>
                                </View>
                            </View>
                        <View accessible={true} accessibilityLabel={'EventDetailHeaderIconButtonView'} style={style.iconButtonView}>
                            <CardIconButtonShare img={this.props.imageSlider[0].thumbnailLow.uri} accessible={true} accessibilityLabel={'EventDetailHeaderShareIcon'} textColor='#bebebe' navigator={this.props.navigator} contentType={'SponsorEvent'} contentKey={this.props.contentKey} shareMessage={this.props.shareMessage} targetKey={this.props.fTargetKey} type={'share'} style={style.iconButton}></CardIconButtonShare>
                        </View>
                    </View>
                </View>

        );
    }
}
