import React from 'react';
import { SGBaseContainer } from '../../core/container/SGBaseContainer';
import { SGView as View, SGImage as Image, SGText as Text, SGTouchableOpacity as TouchableOpacity, SGIcon as Icon, SGIconButton as IconButton } from '../../core/control';
import { StyleSheet, Animated } from 'react-native';
import { SGLocalize } from "../locales/SGLocalize";
import { CardIconButton,CardIconButtonLike,CardIconButtonFavorite,CardIconButtonNotification,CardIconButtonComment,CardIconButtonShare } from '../component_V2/CardIconButton';
import { CheckInButton } from '../component_V2/CheckInButton';
import { CheckOutButton } from '../component_V2/CheckOutButton';
import { SGHelperNavigation, SGHelperGlobalVar, SGHelperType } from '../../core/helper';
import { tbLookupDAO } from '../db/tbLookupDAO';
import { VisitorHelper } from '../helper/VisitorHelper';
import idJSON from '../locales/id.json';
import enJSON from '../locales/en.json';
import cnJSON from '../locales/cn.json';

export class MallHomeHeader extends SGBaseContainer {
    createStyleSheet = (whp) => {
        var { w, h, p } = whp;
        return StyleSheet.create({
            mainContainer: { width: w, flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start' },
            imageHeaderContainer: { width: w, backgroundColor: '#FFFFFF', marginTop: p * 8.5, justifyContent: 'center', alignItems: 'center' },
            placeCoverImage: { width: w, height: w * 0.49, resizeMode: 'cover', borderRadius: 0 },
            overlay: { width: w, height: w * 0.49, backgroundColor: '#000000', opacity: 0.3 },
            thumbnailContainer: { marginLeft: p * 4, backgroundColor: 'transparent', position: 'absolute', top: w * 0.335},
            placeThumbnailImage: { width: w * 0.28, height: w * 0.28, resizeMode: 'contain',borderRadius:p*4  },
            checkInOutBtnContainer: { width: w - p * 4, height: w * 0.22, backgroundColor: 'transparent', justifyContent: 'flex-end',alignItems:'flex-end', position: 'absolute', top: w * 0.425,right:w*0.02 },
            placeDetailContainer: { width: w, paddingTop: 12*p, backgroundColor: '#FFFFFF', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'flex-end', paddingHorizontal: p * 4 },
            leftContainer: { width: w-2*p, justifyContent: 'flex-start', alignItems: 'flex-start' },
            leftContainer1: {width: w-2*p,flexDirection:'row',justifyContent:'flex-start',marginVertical:p},
            placeNameText: { color: '#000000' },
            typeLocationText: { color: '#A2A2A2', marginVertical: 0, marginBottom: p * 0.5 },
            imageBackground: { width: w, height: w * 0.365, resizeMode: 'cover', borderRadius: 0, },
            containerView1: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', },
            containerView1_1: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', backgroundColor: '#2886e3', borderRadius: 0.5 * p, marginTop: p, marginLeft: p, padding: 0 },
            containerView2: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-evenly', marginBottom: 1.5 * p, borderRadius: p },
            containerView2_1: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'flex-start', width: w, },
            textView1: { height: w * 0.3, marginTop: 2.5 * p, flex: 1, justifyContent: 'center', alignItems: 'flex-start', },
            imageView: { height: w * 0.3, },
            iconButton: { width: w,height:w,padding: p },
            text: { color: 'white', marginVertical: 0.25 * p, maxWidth: w * 0.5 },
            image1: { marginLeft: 4 * p, width: w * 0.2, height: w * 0.2, resizeMode: 'cover', borderRadius: 0.75 * p },
            containerView2_1_1: { marginRight: w * 0.005, justifyContent: 'flex-end', flexDirection: 'row', width: w / 4, height: w * 0.4 / 7, marginVertical: w * 0.006 },
            containerView2_1_2: { justifyContent: 'flex-end', flexDirection: 'row', width: w / 4, height: w * 0.4 / 7, marginVertical: w * 0.006 },
            icon: { marginRight: w * 0.02, fontSize: w * 0.05, },
            icon1: { marginVertical: 0.5 * p, color: 'white' },
            vLastVisited:{position:'absolute',right:2,bottom:-20},
            lastVisitText: { color: '#A2A2A2'},
            textLiked: { color: 'white', marginLeft: 4 * p, maxWidth: w * 0.25, marginTop: 4 * p }
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

    constructor(props, context, ...args) {
        super(props, context, ...args);
        this.whp = { w: props.style.width, h: props.style.height, p: props.style.padding }
        this.style = this.createStyleSheet(this.whp);
        this.title = props.title;
        this.image = props.image;
        this._language = SGHelperGlobalVar.getVar('GlobalLanguage')
    }

    _getLikeResource(data) {
        var contentBuildingID = data.fContentID;
        var contentBuildingEN = data.fContentEN;
        var contentBuildingCN = data.fContentCN;
        return (
            { fContentType: 'Place', fContentKey: data.buildingKey, fText1: { id: contentBuildingID.fBuildingName, en: contentBuildingEN.fBuildingName, cn: contentBuildingCN.fBuildingName }, fText2: { id: idJSON.city[tbLookupDAO.getLookUpValue(data.city)], en: enJSON.city[tbLookupDAO.getLookUpValue(data.city)], cn: cnJSON.city[tbLookupDAO.getLookUpValue(data.city)] }, fText3: { id: '', en: '', cn: '' }, fImageID: contentBuildingID.fImageJSON, fImageEN: contentBuildingEN.fImageJSON, fImageCN: contentBuildingCN.fImageJSON, fTargetKey: data.buildingKey }
        )
    }

    _getCommentResource(data) {
        var contentBuildingID = data.fContentID;
        var contentBuildingEN = data.fContentEN;
        var contentBuildingCN = data.fContentCN;
        return (
            {
                fUserImage: this.props.currentUserData.fProfileImageJSON, fContentType: 'Place', fContentKey: data.buildingKey,
                fContentName: { id: contentBuildingID.fBuildingName, en: contentBuildingEN.fBuildingName, cn: contentBuildingCN.fBuildingName },
                fContentText1: { id: idJSON.city[tbLookupDAO.getLookUpValue(data.city)], en: enJSON.city[tbLookupDAO.getLookUpValue(data.city)], cn: cnJSON.city[tbLookupDAO.getLookUpValue(data.city)] },
                fContentText2: { id: contentBuildingID.fShortDescription, en: contentBuildingEN.fShortDescription, cn: contentBuildingCN.fShortDescription },
                fContentImage: { id: contentBuildingID.fImageJSON, en: contentBuildingEN.fImageJSON, cn: contentBuildingCN.fImageJSON },
                fTargetType: 'Place', fTargetName: { id: contentBuildingID.fBuildingName, en: contentBuildingEN.fBuildingName, cn: contentBuildingCN.fBuildingName },
                fTargetImage: { id: contentBuildingID.fImageJSON, en: contentBuildingEN.fImageJSON, cn: contentBuildingCN.fImageJSON },
                fTargetKey: data.buildingKey
            }
        )
    }

    render() {
        var { w, h, p } = this.whp;
        var style = this.style;
        var data = this.props.headerData;
        var dataContent = data['fContent' + this.props.language.toUpperCase()];
        var isAlreadyCheckIn = this.props.isAlreadyCheckIn;
       

        return (
            <View accessible={true} style={style.mainContainer}>
                <Animated.View accessible={true} style={[style.imageHeaderContainer, { height: SGHelperType.isDefined(this.props.animVar) ? this.props.animVar.interpolate({ inputRange: [0, 1], outputRange: [w * 0.49, w * 0.25] }) : w * 0.49 }]}>
                    <Image accessible={true} accessibilityLabel={'MallHomeHeaderRootImageBackground'} style={style.placeCoverImage} source={{ uri: dataContent.fImageBackgroundJSON[0][this.props.imageSetting].uri }}>
                        <View accessible={true} accessibilityLabel={'MallHomeHeaderOverlayView'} style={style.overlay}></View>
                    </Image>
                </Animated.View>
                <View accessible={true} style={style.placeDetailContainer}>
                    <View accessible={true} style={style.leftContainer}>
                        <Text accessible={true} accessibilityLabel={'MallHomeHeaderBottomDataText'} preset={Text.preset.h4B} style={style.placeNameText} numberOfLines={1} >{(dataContent.fBuildingName).toUpperCase()}</Text>
                        <Text accessible={true} accessibilityLabel={'MallHomeHeaderPlaceCategoryName'} preset={Text.preset.heading6} style={style.typeLocationText} numberOfLines={2}>{VisitorHelper.getLocalizeDataFromLookUp('BuildingCategory',data.buildingType,this._language)}, {VisitorHelper.getLocalizeDataFromLookUp('City',data.city,this._language)}</Text>
                        <Text accessible={true} accessibilityLabel={'MallHomeHeaderShortDesc'} preset={Text.preset.heading9} style={style.lastVisitText} numberOfLines={2}>{dataContent.fShortDescription}</Text>
                    
                    <View style={style.leftContainer1}>
                        <CardIconButtonFavorite onIconPressed={this.props.onFavorite} accessible={true} accessibilityLabel={'MallHomeHeaderFavoritesIcon'} textColor='white' navigator={this.props.navigator} contentType='Place' contentKey={data.buildingKey} active={data.fUserFavoriteThis} type={'favorite'} style={style.iconButton}></CardIconButtonFavorite>
                        <CardIconButtonLike onIconPressed={this.props.onLike} accessible={true} accessibilityLabel={'MallHomeHeaderLikeIcon'} likePackage={this._getLikeResource(data)} textColor='white' navigator={this.props.navigator} contentType='Place' contentKey={data.buildingKey} active={data.fUserLikedThis} type={'like'} style={style.iconButton} likeMallGetReward={this.props.likeMallGetReward}></CardIconButtonLike>
                        <CardIconButtonComment accessible={true} accessibilityLabel={'MallHomeHeaderCommentIcon'} commentPackage={this._getCommentResource(data)} textColor='white' navigator={this.props.navigator} contentType='Place' contentKey={data.buildingKey} canComment={data.fCanComment} type={'comment'}  style={style.iconButton}></CardIconButtonComment>
                        <CardIconButtonShare accessible={true} accessibilityLabel={'MallHomeHeaderShareIcon'} textColor='white' navigator={this.props.navigator} contentType='Place' contentKey={data.buildingKey} shareMessage={dataContent.fShareMessage} targetKey={data.buildingKey} type={'share'} style={style.iconButton}></CardIconButtonShare>
                        <CardIconButtonNotification onIconPressed={this.props.onNotification}  accessible={true} accessibilityLabel={'MallHomeHeaderNotificationIcon'} textColor='white' navigator={this.props.navigator} contentType='Place' contentKey={data.buildingKey} active={data.fUserNotificationThis} type={'notification'} style={style.iconButton}></CardIconButtonNotification>
                    </View>

                    </View>
                </View>

                <Animated.View accessible={true} style={[style.checkInOutBtnContainer, { transform: [{ translateY: SGHelperType.isDefined(this.props.animVar) ? this.props.animVar.interpolate({ inputRange: [0, 1], outputRange: [0, -w * 0.23] }) : 0 }] }]}>
                    {isAlreadyCheckIn === true ?
                        (<CheckOutButton accessible={true} accessibilityLabel={'MallHomeHeaderCheckOutButton'} navigator={this.props.navigator} refresh={this.props.refresh} contentType='Place' contentKey={data.buildingKey}></CheckOutButton>)
                        :
                        (<CheckInButton accessible={true} accessibilityLabel={'MallHomeHeaderCheckInButton'} navigator={this.props.navigator} refresh={this.props.refresh} contentType='Place' contentKey={data.buildingKey} checkInReward={this.props.checkInReward} ></CheckInButton>)
                    }
                    <View style={style.vLastVisited}>                    
                        {data.lastVisited !== null &&
                                <Text accessible={true} accessibilityLabel={'MallHomeHeaderLastVisitedText'} preset={Text.preset.heading9} style={style.lastVisitText}>{(SGLocalize.translate("globalText.lastVisitedText"))} {VisitorHelper._decideDayText(data.lastVisited)}</Text>
                        }
                    </View>
                </Animated.View>

                <Animated.View accessible={true} style={[style.thumbnailContainer, { transform: [{ translateY: SGHelperType.isDefined(this.props.animVar) ? this.props.animVar.interpolate({ inputRange: [0, 1], outputRange: [0, -w * 0.2] }) : 0 }] }]}>
              
                    <TouchableOpacity onPress={() => { SGHelperNavigation.navigatePush(this.props.navigator, this.props.screen, { contentKey: data.buildingKey }) }} shadow>
                        <Image accessible={true} accessibilityLabel={'MallHomeHeaderLogoImage'}  style={style.placeThumbnailImage} source={{ uri: dataContent.fImageJSON[0][this.props.imageSetting].uri }} ></Image>
                    </TouchableOpacity>
              
                </Animated.View>
            </View>
        );
    }
}