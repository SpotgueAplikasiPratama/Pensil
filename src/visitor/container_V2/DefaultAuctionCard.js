import React from 'react';
import { SGBaseContainer } from '../../core/container/SGBaseContainer';
import { SGView as View, SGImage as Image, SGText as Text, SGTouchableOpacity as TouchableOpacity } from '../../core/control';
import { StyleSheet } from 'react-native';
import { CardIconButton,CardIconButtonLike,CardIconButtonComment,CardIconButtonShare } from '../component_V2/CardIconButton';
import { SGHelperNavigation, SGHelperGlobalVar, SGHelperType } from '../../core/helper';
import { DateTag } from '../component_V2/DateTag';
import { SGLocalize } from '../locales/SGLocalize';
import { tbLookupDAO } from '../db/tbLookupDAO';
import { VisitorHelper } from '../helper/VisitorHelper';

export class DefaultAuctionCard extends React.PureComponent {
    createStyleSheet = (whp) => {
        var { w, h, p } = whp;
        return StyleSheet.create({
            mainContainer: { width: w, backgroundColor: '#FFFFFF', overflow: 'visible', marginHorizontal: 0, marginVertical: this.props.slider ? 0 : p, justifyContent: 'flex-start',  },
            topContainer: { width: w * 0.9, marginTop: p * 0.5, flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start' },
            auctionImage: { width: w * 0.9, height: w * 0.9 * 9 / 16, borderRadius: p * 2, alignSelf: 'center' },
            auctionNameText: { color: '#000000' },
            likeCountAndIconContainer: { width: w * 0.9, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
            likeCountText: { color: '#9D9D9D', marginTop: p * 2 },
            iconContainer: { flexDirection: 'row' },
            bottomContainer: { width: w, borderTopColor: '#E5E5E5', borderTopWidth: w * 0.003, flexDirection: 'row', justifyContent: 'center' },
            bottomLeftContainer: { width: w * 0.15, marginLeft: w * 0.1, marginVertical: p * 1.5 },
            storeThumbnail: { width: (w - p * 2) * 0.14, height: (w - p * 2) * 0.14, resizeMode: 'cover', borderRadius: p * 2.5, marginBottom: 0 },
            bottomCenterContainer: { width: w * 0.4, marginTop: p, flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', marginLeft: 0 },
            storeNameText: { color: '#3E3E3E' },
            typeAndLocationText: { color: '#989898' },
            bottomRightContainer: { width: w * 0.45 },
            dateTag: {}
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
        var shareParams={MallName:this.props.placeName, StorestoName:this.props.storeName, DateStart:SGHelperType.formatDate(this.props.startDate), DateEnd:SGHelperType.formatDate(this.props.endDate), EventName:this.props.auctionName }

        return (
            <TouchableOpacity onPress={() => SGHelperNavigation.navigatePush(this.props.navigator, 'AuctionDetail', { contentKey: this.props.contentKey })}>
                <View accessible={true} accessibilityLabel={'DefaultAuctionCardRootView'} style={style.mainContainer}>
                    <View accessible={true} style={style.topContainer}>
                        <Image accessible={true} accessibilityLabel={'DefaultAuctionCardContentImage'} source={{ uri: this.props.contentImage }} style={style.auctionImage}></Image>
                        <View style={{ height: w * 0.142758 }}>
                            <Text accessible={true} accessibilityLabel={'DefaultAuctionCardEventName'} numberOfLines={2} preset={Text.preset.h4B} style={style.auctionNameText}>{(this.props.auctionName).toUpperCase()}</Text>
                        </View>
                        <View accessible={true} style={style.likeCountAndIconContainer}>
                            <Text accessible={true} accessibilityLabel={'DefaultAuctionCarContentLike'} preset={Text.preset.h10B} style={style.likeCountText}>{this.props.contentLikeCount} {this.props.likeText}</Text>
                            <View accessible={true} accessibilityLabel={'DefaultAuctionCardIconButtonView'} style={style.iconContainer}>
                                <CardIconButtonLike onIconPressed={this.props.onLike} accessible={true} accessibilityLabel={'DefaultAuctionCardIconLike'} likePackage={this.props.likePackage} navigator={this.props.navigator} contentType={this.props.fContentType} contentKey={this.props.contentKey} active={this.props.like} type={'like'}></CardIconButtonLike>
                                <CardIconButtonComment accessible={true} accessibilityLabel={'DefaultAuctionCardIconComment'} commentPackage={this.props.commentPackage} navigator={this.props.navigator} contentType={this.props.fContentType} contentKey={this.props.contentKey} data={this.props.data} canComment={this.props.canComment} type={'comment'}></CardIconButtonComment>
                                <CardIconButtonShare shareParams={shareParams} img={this.props.contentImageShareButton} accessible={true} accessibilityLabel={'DefaultAuctionCardIconShare'} navigator={this.props.navigator} contentType={this.props.fContentType} contentKey={this.props.contentKey} shareMessage={this.props.shareMessage} targetKey={this.props.targetKey} type={'share'}></CardIconButtonShare>
                            </View>
                        </View>
                    </View>
                    <View accessible={true} accessibilityLabel={'DefaultAuctionCardContainerView2'} style={style.bottomContainer}>
                        <View accessible={true} style={style.bottomLeftContainer}>
                            <Image accessible={true} accessibilityLabel={'DefaultAuctionCardFooterImage'} source={{ uri: this.props.image }} style={style.storeThumbnail}></Image>
                        </View>
                        <View accessible={true} style={style.bottomCenterContainer}>
                            <Text accessible={true} accessibilityLabel={'DefaultAuctionCardRestoName'} numberOfLines={1} preset={Text.preset.h8_5B} style={style.storeNameText}>{(this.props.storeName).toUpperCase()}</Text>
                            <Text accessible={true} accessibilityLabel={'DefaultAuctionCardRestoCategory'} numberOfLines={1} preset={Text.preset.h9} style={style.typeAndLocationText}>{VisitorHelper.getLocalizeDataFromLookUp('StoreCategory',this.props.storeCategory,this._language)}</Text>
                            <Text accessible={true} accessibilityLabel={'DefaultAuctionCardPlaceName'} numberOfLines={1} preset={Text.preset.h9} style={style.typeAndLocationText}>{this.props.placeName}, {VisitorHelper.getLocalizeDataFromLookUp('City',this.props.location,this._language)}</Text>
                            <Text accessible={true} accessibilityLabel={'DefaultAuctionCardFooterLike'} numberOfLines={1} preset={Text.preset.h11B} style={style.typeAndLocationText}>{this.props.footerLikeCount} {this.props.likeText}</Text>
                        </View>
                        <View accessible={true} style={style.bottomRightContainer}>
                            <DateTag accessible={true} accessibilityLabel={'DefaultAuctionCardDateTag'} style={style.dateTag} startDate={this.props.startDate} endDate={this.props.endDate}></DateTag>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        );
    }
}
