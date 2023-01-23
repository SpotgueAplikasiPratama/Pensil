import React from 'react';
import { SGBaseContainer } from '../../core/container/SGBaseContainer';
import { SGImage as Image, SGView as View, SGText as Text, SGTouchableOpacity as TouchableOpacity, SGViewPager as ViewPager } from '../../core/control';
import { StyleSheet } from 'react-native';
import { SGHelperNavigation,SGHelperErrorHandling,SGHelperType } from '../../core/helper';
import { SGLocalize } from '../locales/SGLocalize';
import { tbVUserViewAPI } from '../api/tbVUserViewAPI';

export class RestoPromoSlider extends SGBaseContainer {
    createStyleSheet = (whp) => {
        var { w, h, p } = whp;
        return StyleSheet.create({
            mainContainer: {width: w, backgroundColor: '#FFFFFF', paddingTop: this.props.borderTop ? p * 2 : 0, paddingBottom: this.props.borderBottom ? p * 3 : 0, borderColor: '#E7E7E7', borderTopWidth: 0, borderBottomWidth: this.props.borderBottom ? w * 0.006 : 0},
            header: {width: w * 0.96, backgroundColor: '#FFFFFF', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'flex-start'},
            heading: {width: w * 0.96, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop:this.props.marginText ? 4*p : 4*p, marginBottom:this.props.marginText ? 2*p : 1*p},
            headingText: {maxWidth: w * 0.75, color: '#000000', marginVertical: 0, alignSelf: 'center'},
            description: {width: w * 0.96, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom:1*p},
            descriptionText: {color: '#7D7D7D',marginVertical: 0},
            seeMoreHeadingText: {color: '#63AEE0'},
            seeMoreDescriptionText: {color: '#63AEE0'},
            sliderContainer: {width: w, height: w * 1.1 * 9 / 16, backgroundColor: '#FFFFFF', borderRadius: 0},
            sliderImage: {width: w, height: w * 9 / 16, resizeMode: 'cover', alignSelf: 'center', marginVertical: 0, marginHorizontal: 0, borderRadius: 0}
        });
    }

    constructor(props, context, ...args) {
        super(props, context, ...args);
        this.whp = { w: props.style.width, h: props.style.height, p: props.style.padding }
        this.style = this.createStyleSheet(this.whp);
        this.oneLineSeeMore = false,
        this.twoLine = false;
    }

    _onSeeMorePress(){

        console.log('SeeMorePress')
        console.log(this.props.befSeeMoreScreen)
        if(this.props.befSeeMoreScreen == 'HomeFav'){
            var jsonInput = { fID: '', fContentType: 'SeeAllFavoriteRestoEvent',  fTargetKey: SGHelperType.getGUID(), fUserKey: '', fActive: 'Y', fCreatedByID: '', fCreatedDate: new Date(), fLastModifiedByID: '', fLastModifiedDate: new Date() }
            this._addUserClick(jsonInput)
        }else if(this.props.befSeeMoreScreen == 'HomeTren'){
            var jsonInput = { fID: '', fContentType: 'SeeAllTrendingRestoEvent',  fTargetKey: SGHelperType.getGUID(), fUserKey: '', fActive: 'Y', fCreatedByID: '', fCreatedDate: new Date(), fLastModifiedByID: '', fLastModifiedDate: new Date() }
            this._addUserClick(jsonInput)
        }else if(this.props.befSeeMoreScreen == 'MallHighlight'){
            var jsonInput = { fID: '', fContentType: 'SeeAllMallHighlightRestoEvent',  fTargetKey: SGHelperType.getGUID(), fUserKey: '', fActive: 'Y', fCreatedByID: '', fCreatedDate: new Date(), fLastModifiedByID: '', fLastModifiedDate: new Date() }
            this._addUserClick(jsonInput)
        }else if(this.props.befSeeMoreScreen == 'RestoHighlight'){
            var jsonInput = { fID: '', fContentType: 'SeeAllRestoHighlightRestoEvent',  fTargetKey: SGHelperType.getGUID(), fUserKey: '', fActive: 'Y', fCreatedByID: '', fCreatedDate: new Date(), fLastModifiedByID: '', fLastModifiedDate: new Date() }
            this._addUserClick(jsonInput)
        }
        SGHelperNavigation.navigatePush(this.props.navigator, this.props.seeMoreScreen, { title: this.props.seeMoreTitle, contentKey: this.props.contentKey, contentData: this.props.contentData })
    }

    _addUserClick(jsonInput){
        console.log('user click');
        tbVUserViewAPI.addUserClick(jsonInput).then(()=>{}).catch((error)=>{
            SGHelperErrorHandling.Handling(error,this._addUserClick(this,jsonInput))
        })
    }


    render() {
        console.log('RestoEventSlider-render')
        var { w, h, p } = this.whp;
        var style = this.style;
        var data = this.props.data;
        this.oneLineSeeMore = this.props.oneLineSeeMore;
        this.twoLine = this.props.twoLine;
   
        return (
            <View accessible={true} accessibilityLabel={'RestoPromoSliderRootView'} style={style.mainContainer}>
                <View accessible={true} accessibilityLabel={'RestoPromoHeader'} style={style.header}>
                    <View accessible={true} accessibilityLabel={'RestoPromoHeading'} style={style.heading}>
                        <Text accessible={true} preset={Text.preset.titleH2B} style={style.headingText}>{SGLocalize.translate('HomeScreen.WhatsHappeningRestoTitle')}</Text>
                        {this.oneLineSeeMore ?
                            (<TouchableOpacity onPress={() => this._onSeeMorePress()}>
                                <Text accessible={true} accessibilityLabel={'RestoPromoSliderSeeMore'} preset={Text.preset.titleH4} style={style.seeMoreHeadingText}>{this.props.seeMoreLabel}</Text>
                            </TouchableOpacity>)
                        :
                            (null)
                        }
                    </View>
                    {this.twoLine ?
                        (<View accessible={true} accessibilityLabel={'RestoPromoDescription'} style={style.description}>
                            <Text accessible={true} preset={Text.preset.titleH3} style={style.descriptionText}>{this.props.title}</Text>
                            <TouchableOpacity onPress={() => this._onSeeMorePress()}>
                                <Text accessible={true} accessibilityLabel={'RestoPromoSliderSeeMore'} preset={Text.preset.titleH4B} style={style.seeMoreDescriptionText}>{this.props.seeMoreLabel}</Text>
                            </TouchableOpacity>
                        </View>)
                    :
                        (null)
                    }
                </View>
                <ViewPager accessible={true} accessibilityLabel={'RestoPromoSliderViewPager'} style={style.sliderContainer} initialPage={0} showPageIndicator={true} transitionStyle={'scroll'}  pageIndicatorStyle={{position: 'absolute', bottom: 0 * p, flexDirection: 'row', alignSelf: 'center' }}>
                    {
                        data.map((x) => {
                            return (
                                <TouchableOpacity key={x.key} onPress={() => { SGHelperNavigation.navigatePush(this.props.navigator, 'RestoPromoDetail', { contentKey: x.key }) }}>
                                    <Image accessible={true} accessibilityLabel={'RestoPromoSliderImage'} style={style.sliderImage} source={{ uri: x['fContent' + (this.props.language).toUpperCase()]['fImageJSON'][0][this.props.imageSetting].uri }}></Image>
                                </TouchableOpacity>
                            )
                        })
                    }
                </ViewPager>
            </View>

        );
    }
}
