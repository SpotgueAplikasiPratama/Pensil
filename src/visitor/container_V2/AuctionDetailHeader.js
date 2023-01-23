import React from 'react';
import { SGBaseContainer } from '../../core/container/SGBaseContainer';
import { SGView as View, SGText as Text, SGImage as Image, SGTouchableOpacity as TouchableOpacity, SGViewPager as ViewPager } from '../../core/control';
import { StyleSheet } from 'react-native';
import { CardIconButton,CardIconButtonLike,CardIconButtonComment,CardIconButtonShare } from '../component_V2/CardIconButton';
import { SGLocalize } from '../locales/SGLocalize';
import { SGHelperNavigation, SGHelperGlobalVar, SGHelperType } from '../../core/helper';
import { tbLookupDAO } from '../db/tbLookupDAO';
import { DateTag } from '../component_V2/DateTag';
import { VisitorHelper } from '../helper/VisitorHelper';

export class AuctionDetailHeader extends SGBaseContainer {
    createStyleSheet = (whp) => {
        var { w, h, p } = whp;
        return StyleSheet.create({
            mainContainer: { width: w, backgroundColor: '#FFFFFF', justifyContent: 'flex-start', borderRadius: 0 },
            sliderContainer: { width: w, height: w * 1.2 * 9 / 16, backgroundColor: '#FFFFFF', borderRadius: 0 },
            sliderImage: { width: w, height: w * 9 / 16, resizeMode: 'cover', alignSelf: 'flex-start', marginVertical: 0, marginHorizontal: 0, borderRadius: 0, overflow: 'visible' },
            tag: { position: 'absolute', alignSelf: 'flex-start', top: 0, height: w * 0.09, right: 0 },
            bottomContainer: { width: w, flexDirection: 'column', justifyContent: 'flex-start', marginVertical: p * 2 },
            placeAndIconContainer: { width: w * 0.97, backgroundColor: '#FFFFFF', flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: p,marginVertical:2*p },
            placeContainer: { width: w * 0.65, flexDirection: 'row', justifyContent: 'flex-start' },
            placeThumbnailImage: { width: w * 0.165, height: w * 0.165, backgroundColor: '#FFFFFF', resizeMode: 'cover', borderRadius: 100*p },
            footerView: { marginHorizontal: 0, width: w * 0.45, justifyContent: 'flex-start', flexDirection: 'row' },
            footerImage: { marginLeft: 0, width: w * 0.12, height: w * 0.12, backgroundColor: 'white', resizeMode: 'cover' },
            footerTextView: { width:(w - p * 10)*0.4,justifyContent: 'flex-start', alignItems: 'flex-start' },
            textFooterName: { color: '#000000', maxWidth: w * 0.6 },
            textFooterContent: { color: '#bebebe', maxWidth: w * 0.6 },
            textContentLiked: { color: '#bebebe', maxWidth: w * 0.6,marginVertical:0 },
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
        var shareParams = {MallName:this.props.placeName, StorestoName:this.props.footerName, DateStart:SGHelperType.formatDate(this.props.startDate), DateEnd:SGHelperType.formatDate(this.props.endDate), EventName: this.props.auctionName }
      
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
                    <DateTag accessible={true} accessibilityLabel={'StorePromoDetailScreenDateTag'} style={style.tag} startDate={this.props.startDate} endDate={this.props.endDate}></DateTag>
                </View>
                    <View accessible={true} style={style.placeAndIconContainer}>
                        <TouchableOpacity onPress={() => { SGHelperNavigation.navigatePush(this.props.navigator, this.props.contentType == "StoreAuction"? 'StoreHome' : 'RestoHome', { contentKey: this.props.storeKey }) }}>
                            <View accessible={true} accessibilityLabel={'EventDetailHeaderFooterView'} style={style.placeContainer}>
                                <Image accessible={true} accessibilityLabel={'EventDetailHeaderFooterLogo'} style={style.placeThumbnailImage} source={{ uri: this.props.footerLogo }}></Image>
                                <View accessible={true} accessibilityLabel={'EventDetailHeaderFooterTextView'} style={style.footerTextView}>
                                    <Text accessible={true} accessibilityLabel={'EventDetailHeaderFooterName'} preset={Text.preset.titleH4B} style={style.textFooterName} numberOfLines={2} >{this.props.footerName}</Text>
                                    <Text accessible={true} accessibilityLabel={'EventDetailHeaderPlaceName'} hidden={this.props.placeName ? false : true} preset={Text.preset.titleH5B} style={style.textFooterContent} numberOfLines={1}>{this.props.placeName}</Text>
                                    <Text accessible={true} accessibilityLabel={'EventDetailHeaderFooterLikeCount'} preset={Text.preset.titleH6B} style={style.textContentLiked} numberOfLines={1}>{this.props.footerLikedCount} {SGLocalize.translate('globalText.likeCountText')}</Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                        <View accessible={true} accessibilityLabel={'EventDetailHeaderIconButtonView'} style={style.iconButtonView}>
                            <CardIconButtonLike onIconPressed={this.props.onLike} accessible={true} accessibilityLabel={'EventDetailHeaderLikeIcon'} likePackage={this.props.likePackage} textColor='#bebebe' navigator={this.props.navigator} contentType={this.props.contentType} contentKey={this.props.contentKey} active={this.props.isUserLikeThis} type={'like'} style={style.iconButton}></CardIconButtonLike>
                            <CardIconButtonComment accessible={true} accessibilityLabel={'EventDetailHeaderCommentIcon'} commentPackage={this.props.commentPackage} textColor='#bebebe' navigator={this.props.navigator} contentType={this.props.contentType} contentKey={this.props.contentKey} canComment={this.props.canComment} type={'comment'} style={style.iconButton}></CardIconButtonComment>
                            <CardIconButtonShare shareParams={shareParams} img={this.props.imageSlider[0].thumbnailLow.uri} accessible={true} accessibilityLabel={'EventDetailHeaderShareIcon'} textColor='#bebebe' navigator={this.props.navigator} contentType={this.props.contentType} contentKey={this.props.contentKey} shareMessage={this.props.shareMessage} targetKey={this.props.targetKey} type={'share'} style={style.iconButton}></CardIconButtonShare>
                        </View>
                    </View>
                </View>
        );
    }
}
