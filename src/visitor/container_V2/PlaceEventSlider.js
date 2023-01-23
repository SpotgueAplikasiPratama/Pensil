import React from 'react';
import { SGBaseContainer } from '../../core/container/SGBaseContainer';
import { SGImage as Image, SGView as View, SGText as Text, SGTouchableOpacity as TouchableOpacity, SGViewPager as ViewPager } from '../../core/control';
import { StyleSheet } from 'react-native';
import { SGHelperNavigation,SGHelperErrorHandling,SGHelperType } from '../../core/helper';
import { tbVUserViewAPI } from '../api/tbVUserViewAPI';

export class PlaceEventSlider extends SGBaseContainer {
    createStyleSheet = (whp) => {
        var { w, h, p } = whp;
        return StyleSheet.create({
            mainContainer: {width: w, backgroundColor: '#FFFFFF', paddingTop: this.props.borderTop ? p * 2 : p, paddingBottom: this.props.borderBottom ? p * 3 : 0, borderColor: '#E7E7E7', borderTopWidth: 0, borderBottomWidth: this.props.borderBottom ? w * 0.006 : 0},
            header: {width: w * 0.96, backgroundColor: '#FFFFFF', marginVertical: p, flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'flex-start'},
            heading: {width: w * 0.96, flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', marginTop:this.props.marginText ? 4*p : 2*p, marginBottom:this.props.marginText ? 2*p : 1*p},
            headingText: {maxWidth: this.props.twoLine?w *0.96: w * 0.75, color: '#000000', marginVertical: 0, alignSelf: 'center'},
            description: {width: w * 0.96, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom:0*p},
            descriptionText: {color: '#7D7D7D', marginVertical: 0},
            seeMoreHeadingText: {color: '#63AEE0', alignSelf:'flex-end'},
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
            var jsonInput = { fID: '', fContentType: 'SeeAllFavoritePlaceEvent',  fTargetKey: SGHelperType.getGUID(), fUserKey: '', fActive: 'Y', fCreatedByID: '', fCreatedDate: new Date(), fLastModifiedByID: '', fLastModifiedDate: new Date() }
            this._addUserClick(jsonInput)
        }else if(this.props.befSeeMoreScreen == 'HomeTren'){
            var jsonInput = { fID: '', fContentType: 'SeeAllTrendingPlaceEvent',  fTargetKey: SGHelperType.getGUID(), fUserKey: '', fActive: 'Y', fCreatedByID: '', fCreatedDate: new Date(), fLastModifiedByID: '', fLastModifiedDate: new Date() }
            this._addUserClick(jsonInput)
        }else if(this.props.befSeeMoreScreen == 'MallHighlight'){
            var jsonInput = { fID: '', fContentType: 'SeeAllMallHighlightPlaceEvent',  fTargetKey: SGHelperType.getGUID(), fUserKey: '', fActive: 'Y', fCreatedByID: '', fCreatedDate: new Date(), fLastModifiedByID: '', fLastModifiedDate: new Date() }
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
        console.log('PlaceEventSlider-render')
        var { w, h, p } = this.whp;
        var style = this.style;
        var data = this.props.data;
        this.oneLineSeeMore = this.props.oneLineSeeMore;
        this.twoLine = this.props.twoLine;
        return (
            <View accessible={true} accessibilityLabel={'PlaceEventMainContainer'} style={style.mainContainer}>
                <View accessible={true} accessibilityLabel={'PlaceEventHeader'} style={style.header}>
                    <View accessible={true} accessibilityLabel={'PlaceEventHeading'} style={style.heading}>
                        <Text accessible={true} preset={Text.preset.titleH2B} style={style.headingText}>{this.props.titleHeading}</Text>
                        {this.oneLineSeeMore ?
                            (
                            <TouchableOpacity onPress={() => this._onSeeMorePress()}>
                                <Text accessible={true} accessibilityLabel={'PlaceEventSliderSeeMore'} preset={Text.preset.titleH4} style={style.seeMoreHeadingText}>{this.props.seeMoreLabel}</Text>
                            </TouchableOpacity>)
                        :
                            (null)
                        }
                    </View>
                    {this.twoLine ?
                        (<View accessible={true} accessibilityLabel={'PlaceEventDescription'} style={style.description}>
                            <Text accessible={true} preset={Text.preset.titleH3} style={style.descriptionText}>{this.props.title}</Text>
                            <TouchableOpacity onPress={() => this._onSeeMorePress()}>
                                <Text accessible={true} accessibilityLabel={'PlaceEventSliderSeeMore'} preset={Text.preset.titleH4B} style={style.seeMoreDescriptionText}>{this.props.seeMoreLabel}</Text>
                            </TouchableOpacity>
                        </View>)
                    :
                        (null)
                    }
                </View>
                <ViewPager accessible={true} accessibilityLabel={'PlaceEventSliderViewPager'} style={style.sliderContainer} initialPage={0} showPageIndicator={true} transitionStyle={'scroll'} pageIndicatorStyle={{position: 'absolute', bottom: 0, marginVertical: 0, flexDirection: 'row', alignSelf: 'center' }}>
                    {
                        data.map((x) => {
                            return (
                                <TouchableOpacity key={x.key} onPress={() => { SGHelperNavigation.navigatePush(this.props.navigator, 'PlaceEventDetail', { contentKey: x.key }) }}>
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
