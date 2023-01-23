/**.
 * Version 1.1.0
 * 1 Yohanes , 10 March 2021
 * - change text style
 */
import React from 'react';
import { SGBaseContainer } from '../../core/container/SGBaseContainer';
import { SGView as View, SGImage as Image, SGText as Text, SGTouchableOpacity as TouchableOpacity } from '../../core/control';
import { StyleSheet } from 'react-native';
import { CardIconButton,CardIconButtonLike,CardIconButtonComment,CardIconButtonShare } from '../component_V2/CardIconButton';
import { DateTag } from '../component_V2/DateTag';
import { SGHelperNavigation, SGHelperGlobalVar, SGHelperType } from '../../core/helper';
import { SGLocalize } from '../locales/SGLocalize';
import { tbLookupDAO } from '../db/tbLookupDAO';
import { VisitorHelper } from '../helper/VisitorHelper';

export class DefaultPlaceEventCard extends SGBaseContainer {
    createStyleSheet = (whp) => {
        var { w, h, p } = whp;
        return StyleSheet.create({
            mainContainer: { width: w, backgroundColor: '#FFFFFF', overflow: 'visible', marginHorizontal: 0, marginVertical: this.props.slider ? 0 : p, justifyContent: 'flex-start', borderRadius: 0 },
            topContainer: { width: w * 0.9, marginTop: p * 0.5, flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start' },
            eventImage: { width: w * 0.9, height: w * 0.9 * 9 / 16, borderRadius: p * 2, alignSelf: 'center' },
            eventNameText: { color: '#000000' },
            eventCategoryText: { alignSelf: 'flex-start', color:'#989898' },
            likeCountAndIconContainer: { width: w * 0.9, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
            likeCountText: { color: '#9D9D9D', marginTop: p * 2 },
            iconContainer: { flexDirection: 'row' },
            bottomContainer: { width: w, borderTopColor: '#E5E5E5', borderTopWidth: w * 0.003, flexDirection: 'row', justifyContent: 'center' },
            bottomLeftContainer: { width: w * 0.15, marginLeft: w * 0.1, marginVertical: p * 1.5 },
            mallThumbnail: { width: (w - p * 2) * 0.14, height: (w - p * 2) * 0.14, resizeMode: 'cover', borderRadius: p * 2.5, marginBottom: 0 },
            bottomCenterContainer: { width: w * 0.4, flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', marginLeft: 0 },
            mallNameText: { color: '#3E3E3E' },
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
        this.contentID = this.props.key;
        this._language = SGHelperGlobalVar.getVar('GlobalLanguage')
    }
    render() {
        var { w, h, p } = this.whp;
        var style = this.style;
        var data = this.props.data;
        var shareParams = { MallName:this.props.placeName, EventName:this.props.eventName, DateStart:SGHelperType.formatDate(this.props.startDate), DateEnd:SGHelperType.formatDate(this.props.endDate)}
        // console.log(SGHelperType.formatDate())
        return (
            <TouchableOpacity onPress={() => SGHelperNavigation.navigatePush(this.props.navigator, 'PlaceEventDetail', { contentKey: this.props.contentKey })}>
                <View accessible={true} accessibilityLabel={'DefaultPlaceEventCardRootView'} style={style.mainContainer}>
                    <View accessible={true} style={style.topContainer}>
                        <Image accessible={true} accessibilityLabel={'DefaultPlaceEventCardContentImage'} source={{ uri: this.props.contentImage }} style={style.eventImage}></Image>
                        <View style={{ height: w * 0.1425 }}>
                            <Text accessible={true} accessibilityLabel={'DefaultPlaceEventCardEventName'} numberOfLines={1} preset={Text.preset.titleH2B} style={style.eventNameText}>{(this.props.eventName).toUpperCase()}</Text>
                            <Text style={style.eventCategoryText} preset={Text.preset.titleH3}>{VisitorHelper.getLocalizeDataFromLookUp('EventBuildingCategory',this.props.eventCategory,this._language)}</Text>
                        </View>
                        <View accessible={true} style={style.likeCountAndIconContainer}>
                            <Text accessible={true} accessibilityLabel={'DefaultPlaceEventCarContentLike'} preset={Text.preset.titleH6B} style={style.likeCountText}>{this.props.contentLikeCount} {this.props.likeText}</Text>
                            <View accessible={true} accessibilityLabel={'DefaultPlaceEventCardIconButtonView'} style={style.iconContainer}>
                                <CardIconButtonLike onIconPressed={this.props.onLike} accessible={true} accessibilityLabel={'DefaultPlaceEventCardIconLike'} likePackage={this.props.likePackage} navigator={this.props.navigator} contentType='PlaceEvent' contentKey={this.props.contentKey} active={this.props.like} type={'like'}></CardIconButtonLike>
                                <CardIconButtonComment accessible={true} accessibilityLabel={'DefaultPlaceEventCardIconComment'} commentPackage={this.props.commentPackage} navigator={this.props.navigator} contentType='PlaceEvent' contentKey={this.props.contentKey} canComment={this.props.canComment} type={'comment'}></CardIconButtonComment>
                                <CardIconButtonShare shareParams={shareParams} img={this.props.contentImageShareButton} accessible={true} accessibilityLabel={'DefaultPlaceEventCardIconShare'} navigator={this.props.navigator} contentType='PlaceEvent' contentKey={this.props.contentKey} shareMessage={this.props.shareMessage} targetKey={this.props.targetKey} type={'share'}></CardIconButtonShare>
                            </View>
                        </View>
                    </View>
                    <View accessible={true} accessibilityLabel={'DefaultPlaceEventCardContainerView2'} style={style.bottomContainer}>
                        <View accessible={true} style={style.bottomLeftContainer}>
                            <Image accessible={true} accessibilityLabel={'DefaultPlaceEventCardFooterImage'} source={{ uri: this.props.image }} style={style.mallThumbnail}></Image>
                        </View>
                        <View accessible={true} style={style.bottomCenterContainer}>
                            <Text accessible={true} accessibilityLabel={'DefaultPlaceEventCardFooterName'} numberOfLines={1} preset={Text.preset.titleH4_5B} style={style.mallNameText}>{(this.props.placeName).toUpperCase()}</Text>
                            <Text accessible={true} accessibilityLabel={'DefaultPlaceEventCardFooterLocation'} numberOfLines={1} preset={Text.preset.titleH6B} style={style.typeAndLocationText}>{VisitorHelper.getLocalizeDataFromLookUp('BuildingCategory',this.props.placeCategory,this._language)}, {VisitorHelper.getLocalizeDataFromLookUp('City',this.props.location,this._language)}</Text>
                            <Text accessible={true} accessibilityLabel={'DefaultPlaceEventCardFooterLike'} numberOfLines={1} preset={Text.preset.titleH6B} style={style.typeAndLocationText}>{this.props.footerLikeCount} {this.props.likeText}</Text>
                        </View>
                        <View accessible={true} style={style.bottomRightContainer}>
                            <DateTag accessible={true} accessibilityLabel={'DefaultPlaceEventCardDateTag'} style={style.dateTag} startDate={this.props.startDate} endDate={this.props.endDate}></DateTag>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        );
    }
}
