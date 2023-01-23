import React from 'react';
import { SGBaseContainer } from '../../core/container/SGBaseContainer';
import { SGView as View, SGText as Text, SGImage as Image, SGTouchableOpacity as TouchableOpacity, SGIcon as Icon } from '../../core/control';
import { StyleSheet } from 'react-native';
import { CardIconButton,CardIconButtonLike,CardIconButtonComment,CardIconButtonShare } from '../component_V2/CardIconButton';
import { LastVisitedTag } from '../component_V2/LastVisitedTag';
import { SGLocalize } from '../locales/SGLocalize';
import { SGHelperNavigation, SGHelperGlobalVar } from '../../core/helper';

export class MallFacilityListCard extends SGBaseContainer {
    createStyleSheet = (whp) => {
        var { w, h, p } = whp;
        return StyleSheet.create({
            throwWHP: { width: w, height: h, padding: p },
            mainContainer: { width: w, flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'flex-start', paddingVertical: p * 3, paddingLeft: w * 0.085, paddingRight: p * 2, borderBottomWidth: p * 0.6, borderColor: '#E2E2E2' },
            leftContainer: { width: w * 0.3, paddingVertical: 0, paddingHorizontal: p, marginHorizontal: 0, marginVertical: 0 },
            rightContainer: { width: w * 0.68 - w * 0.085, justifyContent: 'flex-start', alignItems: 'flex-start', marginLeft: 0, backgroundColor: '#FFFFFF' },
            facilityImage: { width: w * 0.24, height: w * 0.24, resizeMode: 'cover', backgroundColor: '#FFFFFF' },
            facilityNameText: { color: '#000000', marginBottom: p * 6 },
            typeAndLocationText: { color: '#6D6D6D', marginVertical: 0 },
            text1: { color: '#909090', },
            iconButtonView: { marginVertical: 0, paddingVertical: 0, justifyContent: 'flex-end' },
            iconButtonContainer: { flexDirection: 'row', },
            iconFoot: { backgroundColor: '#0b76dd', padding: 0, borderRadius: w, width: w * 0.04, height: w * 0.04 },
            lastVisitedView: { marginLeft: p, flexDirection: 'row', justifyContent: 'flex-start', marginVertical: 1.5 * p },
            lastVisitedText: { color: '#93c6e1', marginVertical: 0.2 * p, maxWidth: w * 0.9 }
        });
    }

    _decideDayText(value) {
        if (value === 1) {
            return (SGLocalize.translate("lastVisitedTag.day"))
        }
        else if (value < 7) {
            return (value.toString() + ' ' + SGLocalize.translate("lastVisitedTag.days"))
        }
        else if (value === 7) {
            return ('1' + ' ' + SGLocalize.translate("lastVisitedTag.week"))
        }
        else {
            return (SGLocalize.translate("lastVisitedTag.overWeek"))
        }
    }

    _getLikeResource(data) {
        var contentBuildingID = data.fContentBuildingID;
        var contentBuildingEN = data.fContentBuildingEN;
        var contentBuildingCN = data.fContentBuildingCN;
        var contentFacilityID = data.fContentFacilityID;
        var contentFacilityEN = data.fContentFacilityEN;
        var contentFacilityCN = data.fContentFacilityCN;
        return (
            { fContentType: 'Facility', fContentKey: data.key, fText1: { id: contentFacilityID.fFacilityName, en: contentFacilityEN.fFacilityName, cn: contentFacilityCN.fFacilityName }, fText2: { id: contentBuildingID.fBuildingName, en: contentBuildingEN.fBuildingName, cn: contentBuildingCN.fBuildingName }, fText3: { id: contentFacilityID.fShortDescription, en: contentFacilityEN.fShortDescription, cn: contentFacilityCN.fShortDescription }, fImageID: contentFacilityID.fImageJSON, fImageEN: contentFacilityEN.fImageJSON, fImageCN: contentFacilityCN.fImageJSON, fTargetKey: data.buildingKey }
        )
    }

    _getCommentResource(data) {
        var contentBuildingID = data.fContentBuildingID;
        var contentBuildingEN = data.fContentBuildingEN;
        var contentBuildingCN = data.fContentBuildingCN;
        var contentFacilityID = data.fContentFacilityID;
        var contentFacilityEN = data.fContentFacilityEN;
        var contentFacilityCN = data.fContentFacilityCN;
        return (
            {
                fUserImage: this.props.currentUserData.fProfileImageJSON, fContentType: 'Facility', fContentKey: data.key,
                fContentName: { id: contentFacilityID.fFacilityName, en: contentFacilityEN.fFacilityName, cn: contentFacilityCN.fFacilityName },
                fContentText1: { id: contentBuildingID.fBuildingName, en: contentBuildingEN.fBuildingName, cn: contentBuildingCN.fBuildingName },
                fContentText2: { id: contentFacilityID.fShortDescription, en: contentFacilityEN.fShortDescription, cn: contentFacilityCN.fShortDescription },
                fContentImage: { id: contentFacilityID.fImageJSON, en: contentFacilityEN.fImageJSON, cn: contentFacilityCN.fImageJSON },
                fTargetType: 'Place', fTargetName: { id: contentFacilityID.fFacilityName, en: contentFacilityEN.fFacilityName, cn: contentFacilityCN.fFacilityName },
                fTargetImage: { id: contentBuildingID.fImageJSON, en: contentBuildingEN.fImageJSON, cn: contentBuildingCN.fImageJSON },
                fTargetKey: data.buildingKey
            }
        )
    }



    constructor(props, context, ...args) {
        super(props, context, ...args);
        this.whp = { w: props.style.width, h: props.style.height, p: props.style.padding }
        this.style = this.createStyleSheet(this.whp);
        this.title = props.title;
        this.showFooter = this.props.hideFooter ? true : false;
    }

    render() {
        this.whp = { w: this.props.style.width, h: this.props.style.height, p: this.props.style.padding }
        this.style = this.createStyleSheet(this.whp);
        var style = this.style;
        var dataFacility = this.props.dataFacility;
        var shareParams = {MallName: this.props.placeName, FacilityName: this.props.facilityName }
    
        return (
            <TouchableOpacity onPress={() => SGHelperNavigation.navigatePush(this.props.navigator, 'FacilityDetail', { contentKey: dataFacility.key })}>
                <View accessible={true} accessibilityLabel={'MallFacilityListCardRootView'} style={style.mainContainer}>
                    <View accessible={true} accessibilityLabel={'MallFacilityListTopView'} style={style.leftContainer}>
                        <Image accessible={true} accessibilityLabel={'MallFacilityListCardImage'} shadow style={style.facilityImage} source={{ uri: this.props.contentImage }}></Image>
                        <Text accessible={true} accessibilityLabel={'MallFacilityListCardLikeText'} preset={Text.preset.titleH6B} style={style.text1}>{this.props.contentLiked} {this.props.likeText}</Text>
                    </View>
                    <View accessible={true} accessibilityLabel={'MallFacilityListCardContainerView'} style={style.rightContainer}>
                        <Text accessible={true} accessibilityLabel={'MallFacilityListCardFacilityName'} preset={Text.preset.titleH3B} numberOfLines={2} style={style.facilityNameText}>{this.props.facilityName ? (this.props.facilityName).toUpperCase() : ''}</Text>
                        <Text accessible={true} accessibilityLabel={'MallFacilityListCardFacilityCategory'} preset={Text.preset.titleH4_5B} numberOfLines={1} style={style.typeAndLocationText}>{this.props.locationText} {this.props.floorLocation}</Text>
                        <Text accessible={true} accessibilityLabel={'MallFacilityListCardFacilityLocation'} preset={Text.preset.titleH5B} numberOfLines={1} style={style.typeAndLocationText}>{this.props.facilityLocationDesc}</Text>
                        <View accessible={true} accessibilityLabel={'MallFacilityListCardIconButtonView'} style={style.iconButtonView}>
                            <View accessible={true} accessibilityLabel={'MallFacilityListCardIconButtonContainerView'} style={style.iconButtonContainer}>
                                <CardIconButtonLike onIconPressed={this.props.onLike} accessible={true} accessibilityLabel={'MallFacilityListCardLikeIcon'} likePackage={this._getLikeResource(dataFacility)} navigator={this.props.navigator} contentType='Facility' contentKey={this.props.contentKey} active={this.props.like} type={'like'} textPreset={Text.preset.h11} style={style.throwWHP}></CardIconButtonLike>
                                <CardIconButtonComment accessible={true} accessibilityLabel={'MallFacilityListCardCommentIcon'} commentPackage={this._getCommentResource(dataFacility)} navigator={this.props.navigator} contentType='Facility' contentKey={this.props.contentKey} canComment={this.props.canComment} type={'comment'} textPreset={Text.preset.h11} style={style.throwWHP}></CardIconButtonComment>
                                <CardIconButtonShare shareParams={shareParams} img={this.props.contentImageShareButton} accessible={true} accessibilityLabel={'MallFacilityListCardShareIcon'} navigator={this.props.navigator} contentType='Facility' contentKey={this.props.contentKey} shareMessage={this.props.shareMessage} targetKey={this.props.targetKey} type={'share'} textPreset={Text.preset.h11} style={style.throwWHP}></CardIconButtonShare>
                            </View>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        );
    }
}
