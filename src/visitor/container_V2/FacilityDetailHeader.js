import React from 'react';
import { SGBaseContainer } from '../../core/container/SGBaseContainer';
import { SGView as View, SGText as Text, SGImage as Image, SGTouchableOpacity as TouchableOpacity, SGViewPager as ViewPager } from '../../core/control';
import { StyleSheet } from 'react-native';
import { CardIconButton,CardIconButtonLike,CardIconButtonComment,CardIconButtonShare } from '../component_V2/CardIconButton';
import { SGLocalize } from '../locales/SGLocalize';
import { SGHelperNavigation, SGHelperGlobalVar } from '../../core/helper';
import { tbLookupDAO } from '../db/tbLookupDAO';
import { VisitorHelper } from '../helper/VisitorHelper';

export class FacilityDetailHeader extends SGBaseContainer {
    createStyleSheet = (whp) => {
        var { w, h, p } = whp;
        return StyleSheet.create({
            mainContainer: { width: w, backgroundColor: '#FFFFFF', justifyContent: 'flex-start', borderRadius: 0 },
            sliderContainer: { width: w, height: w * 1.12 * 9 / 16, backgroundColor: '#FFFFFF', borderRadius: 0 },
            sliderImage: { width: w, height: w * 9 / 16, resizeMode: 'cover', alignSelf: 'flex-start', marginVertical: 0, marginHorizontal: 0, borderRadius: 0, overflow: 'visible' },
            bottomContainer: { width: w, flexDirection: 'column', justifyContent: 'flex-start', marginVertical: p * 2 },
            placeAndIconContainer: { width: w * 0.97, backgroundColor: '#FFFFFF', flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: p },
            placeContainer: { width: w * 0.6, flexDirection: 'row', justifyContent: 'flex-start' },
            placeThumbnailImage: { width: this.fullScreen ? w * 0.165 : w * 0.125, height: this.fullScreen ? w * 0.165 : w * 0.125, backgroundColor: '#FFFFFF', resizeMode: 'cover', borderRadius: p * 100 },

            bottomView: { marginHorizontal: 0, marginTop: p, width: w * 0.8, flexDirection: 'row', justifyContent: 'space-between' },
            footerView: { marginHorizontal: 0, width: w * 0.45, justifyContent: 'flex-start', flexDirection: 'row' },
            footerImage: { marginLeft: 0, width: w * 0.12, height: w * 0.12, backgroundColor: 'white', resizeMode: 'cover' },
            footerTextView: { maxWidth: w * 0.33, justifyContent: 'flex-start', alignItems: 'flex-start' },
            textFooterName: { color: '#737373', marginVertical: 0 },
            textFooterContent: { color: '#bebebe', marginTop: 0, },
            textContentLiked: { color: '#bebebe', marginTop: 0.25 * p, marginBottom: 0 },
            iconButtonView: { width: w * 0.35, flexDirection: 'row', justifyContent: 'flex-end' },
            iconButton: { width: w * 0.85, padding: p * 0.85 },
        });
    }

    constructor(props, context, ...args) {
        super(props, context, ...args);
        this.whp = { w: props.style.width, h: props.style.height, p: props.style.padding }
        this.style = this.createStyleSheet(this.whp);
        this.title = props.title;
        this.fullScreen = true;
        this._language = SGHelperGlobalVar.getVar('GlobalLanguage')
    }

    render() {
        var { w, h, p } = this.whp;
        var style = this.style;
        this.fullScreen = this.props.fullScreen;
        var shareParams = {MallName:this.props.footerName,FacilityName:this.props.shareMessage }
        
        return (
            <View accessible={true} accessibilityLabel={'FacilityDetailHeaderRootView'} style={style.mainContainer}>
                <ViewPager accessible={true} accessibilityLabel={'FacilityDetailHeaderViewPager'} style={style.sliderContainer} initialPage={0} showPageIndicator={true} transitionStyle={'scroll'} pageIndicatorStyle={{ position: 'absolute', bottom: 0 * p, flexDirection: 'row', alignSelf: 'center' }}>
                    {
                        (this.props.imageSlider).map((x, index) => {
                            return (
                                <View accessible={true} accessibilityLabel={'FacilityDetailHeaderImageView'} key={x.id} style={{ justifyContent: 'flex-start' }}>
                                    <Image accessible={true} accessibilityLabel={'FacilityDetailHeaderImage'} style={style.sliderImage} source={{ uri: x[this.props.imageSetting].uri }}></Image>
                                </View>
                            )
                        })
                    }
                </ViewPager>
                <View accessible={true} accessibilityLabel={'FacilityDetailHeaderBottomView'} style={style.bottomContainer}>
                    <View accessible={true} style={style.placeAndIconContainer}>
                        <TouchableOpacity onPress={() => { SGHelperNavigation.navigatePush(this.props.navigator, 'MallHome', { contentKey: this.props.buildingKey }) }}>
                            <View accessible={true} accessibilityLabel={'FacilityDetailHeaderFooterView'} style={style.placeContainer}>
                                <Image style={style.placeThumbnailImage} source={{ uri: this.props.footerLogo }}></Image>
                                <View accessible={true} accessibilityLabel={'FacilityDetailHeaderTextView'} style={style.footerTextView}>
                                    <Text accessible={true} accessibilityLabel={'FacilityDetailHeaderFooterName'} preset={this.fullScreen ? Text.preset.titleH2B : Text.preset.titleH3B} style={style.textFooterName} >{this.props.footerName}</Text>
                                    <Text accessible={true} accessibilityLabel={'FacilityDetailHeaderPlaceName'} hidden={this.props.placeName ? false : true} preset={this.fullScreen ? Text.preset.titleH3B : Text.preset.titleH4_5B} style={style.textFooterContent}>{this.props.placeName}</Text>
                                    <Text accessible={true} accessibilityLabel={'FacilityDetailHeaderLocation'} hidden={this.props.city ? false : true} preset={this.fullScreen ? Text.preset.titleH3B : Text.preset.titleH4_5B} style={style.textFooterContent}>{VisitorHelper.getLocalizeDataFromLookUp('City',this.props.city,this._language)}</Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                        <View accessible={true} accessibilityLabel={'FacilityDetailHeaderIconButtonView'} style={style.iconButtonView}>
                            <CardIconButtonLike onIconPressed={this.props.onLike} accessible={true} accessibilityLabel={'FacilityDetailHeaderLikeIcon'} likePackage={this.props.likePackage} textColor='#bebebe' navigator={this.props.navigator} contentType='Facility' contentKey={this.props.contentKey} active={this.props.isUserLikeThis} type={'like'} style={style.iconButton}></CardIconButtonLike>
                            <CardIconButtonComment accessible={true} accessibilityLabel={'FacilityDetailHeaderCommentIcon'} commentPackage={this.props.commentPackage} textColor='#bebebe' navigator={this.props.navigator} contentType='Facility' contentKey={this.props.contentKey} type={'comment'} canComment={this.props.canComment} style={style.iconButton}></CardIconButtonComment>
                            <CardIconButtonShare shareParams={shareParams} img={this.props.imageSlider[0].thumbnailLow.uri} accessible={true} accessibilityLabel={'FacilityDetailHeaderShareIcon'} textColor='#bebebe' navigator={this.props.navigator} contentType='Facility' contentKey={this.props.contentKey} shareMessage={this.props.shareMessage} targetKey={this.props.targetKey} type={'share'} style={style.iconButton}></CardIconButtonShare>
                        </View>
                    </View>
                </View>
            </View>

        );
    }
}
