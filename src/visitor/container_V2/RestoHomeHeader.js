import React from 'react';
import { SGBaseContainer } from '../../core/container/SGBaseContainer';
import { SGView as View, SGImage as Image, SGText as Text, SGTouchableOpacity as TouchableOpacity, SGIcon as Icon, SGIconButton as IconButton } from '../../core/control';
import { StyleSheet, Animated } from 'react-native';
import { SGLocalize } from "../locales/SGLocalize";
import { CardIconButton,CardIconButtonLike, CardIconButtonFavorite,CardIconButtonNotification,CardIconButtonComment,CardIconButtonShare } from '../component_V2/CardIconButton';
import { CheckInButton } from '../component_V2/CheckInButton';
import { CheckOutButton } from '../component_V2/CheckOutButton';
import { SGHelperNavigation, SGHelperGlobalVar, SGHelperType } from '../../core/helper';
import { VisitorHelper } from '../helper/VisitorHelper';
import { tbLookupDAO } from '../db/tbLookupDAO';
import idJSON from '../locales/id.json';
import enJSON from '../locales/en.json';
import cnJSON from '../locales/cn.json';

export class RestoHomeHeader extends SGBaseContainer {
    createStyleSheet = (whp) => {
        var { w, h, p } = whp;
        return StyleSheet.create({
            mainContainer: { width: w, flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start'},
            coverImageContainer: { width: w, backgroundColor: '#FFFFFF', marginTop: p * 8.5, justifyContent: 'center', alignItems: 'center' },
            coverImage: { width: w, height: w * 0.47, resizeMode: 'cover', borderRadius: 0 },
            coverOverlay: { width: w, height: w * 0.47, backgroundColor: '#000000', opacity: 0.3 },
            tenatDetailContainer: { width: w, backgroundColor: '#FFFFFF', paddingVertical: 0, paddingHorizontal: p * 4, paddingTop: w * 0.13, justifyContent: 'flex-start', alignItems: 'flex-start', alignSelf: 'center' },
            nameText: { color: '#000000', marginVertical: 0, marginBottom: p },
            shortDescText: { color: '#A2A2A2', marginVertical: 0, marginBottom: p },
            categoryText: { color: '#A2A2A2', marginVertical: 0, marginBottom: p },
            foodPreferenceText: { color: '#A2A2A2', marginVertical: 0, marginBottom: p },
            bottomTenatDetailContainer: { width: w - p * 6, flexDirection: 'row', justifyContent: 'space-between' },
            placeNameText: { color: '#A2A2A2', marginVertical: 0, marginBottom: p, alignSelf: 'flex-start' },
            iconContainer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
            iconButton: { width: w,height: w, padding: p },
            thumbnailContainer: { marginLeft: p * 4, backgroundColor: 'transparent', position: 'absolute', top: w * 0.335 },
            thumbnailImage: {width: w * 0.28, height: w * 0.28, resizeMode: 'contain',borderRadius:4*p },
            checkInOutBtnContainer: { width: w - p * 4, height: w * 0.22, backgroundColor: 'transparent', justifyContent: 'flex-end',alignItems:'flex-end', position: 'absolute', top: w * 0.425,right:w*0.02 },
            placeDetailContainer: { width: w, paddingTop: 12*p, backgroundColor: '#FFFFFF', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'flex-end', paddingHorizontal: p * 4 },
            leftContainer: { width: w-4*p, justifyContent: 'flex-start', alignItems: 'flex-start' },
            leftContainer1: {width: w-2*p,flexDirection:'row',justifyContent:'flex-start',marginVertical:p},
            vLastVisited:{position:'absolute',right:2,bottom:-20},
            lastVisitText: { color: '#A2A2A2'},
        });
    }

    constructor(props, context, ...args) {
        super(props, context, ...args);
        this.whp = { w: props.style.width, h: props.style.height, p: props.style.padding }
        this.style = this.createStyleSheet(this.whp);
        this.title = props.title;
        this.image = props.image;
        this._language = SGHelperGlobalVar.getVar('GlobalLanguage')
    }

    _constructFloorString(floorData) {
        var str = '';
        for (var i = 0; i < floorData.length; i++) {
            if (i === floorData.length - 1) { str = str + floorData[i]['fFloorName' + this.props.language.toUpperCase()] }
            else {
                str = str + floorData[i]['fFloorName' + (this.props.language).toUpperCase()] + ', '
            }
        }
        return (str);
    }

    _getLikeResource(data) {
        var contentRestoID = data.fContentID;
        var contentRestoEN = data.fContentEN;
        var contentRestoCN = data.fContentCN;

        return (
            { fContentType: 'Resto', fContentKey: data.restoKey, fText1: { id: contentRestoID.fStoreName, en: contentRestoEN.fStoreName, cn: contentRestoCN.fStoreName }, fText2: { id: idJSON.restoCategory[tbLookupDAO.getLookUpValue(data.restoCategory)], en: enJSON.restoCategory[tbLookupDAO.getLookUpValue(data.restoCategory)], cn: cnJSON.restoCategory[tbLookupDAO.getLookUpValue(data.restoCategory)] }, fText3: { id: data.fBuildingNameID, en: data.fBuildingNameEN, cn: data.fBuildingNameCN }, fImageID: contentRestoID.fStoreImageJSON, fImageEN: contentRestoEN.fStoreImageJSON, fImageCN: contentRestoCN.fStoreImageJSON, fTargetKey: data.restoKey }
        )
    }

    _getCommentResource(data) {
        var contentRestoID = data.fContentID;
        var contentRestoEN = data.fContentEN;
        var contentRestoCN = data.fContentCN;

        return (
            {
                fUserImage: this.props.currentUserData.fProfileImageJSON, fContentType: 'Resto', fContentKey: data.restoKey,
                fContentName: { id: contentRestoID.fStoreName, en: contentRestoEN.fStoreName, cn: contentRestoCN.fStoreName },
                fContentText1: { id: data.fBuildingNameID, en: data.fBuildingNameEN, cn: data.fBuildingNameCN },
                fContentText2: { id: contentRestoID.fShortDescription, en: contentRestoEN.fShortDescription, cn: contentRestoCN.fShortDescription },
                fContentImage: { id: contentRestoID.fStoreImageJSON, en: contentRestoEN.fStoreImageJSON, cn: contentRestoCN.fStoreImageJSON },
                fTargetType: 'Resto', fTargetName: { id: contentRestoID.fStoreName, en: contentRestoEN.fStoreName, cn: contentRestoCN.fStoreName },
                fTargetImage: { id: contentRestoID.fStoreImageJSON, en: contentRestoEN.fStoreImageJSON, cn: contentRestoCN.fStoreImageJSON },
                fTargetKey: data.restoKey
            }
        )
    }

    render() {
        var { w, h, p } = this.whp;
        var style = this.style;
        var data = this.props.headerData;
        console.log(data);
        var dataContent = data['fContent' + this.props.language.toUpperCase()];
        var isAlreadyCheckIn = this.props.isAlreadyCheckIn;

        return (
            <View accessible={true} style={style.mainContainer}>
                <Animated.View accessible={true} style={[style.coverImageContainer, { overflow: 'hidden', height: SGHelperType.isDefined(this.props.animVar) ? this.props.animVar.interpolate({ inputRange: [0, 1], outputRange: [w * 0.49, w * 0.28] }) : w * 0.49 }]}>
                    <Image accessible={true} accessibilityLabel={'RestoHomeHeaderRootImage'} style={style.coverImage} source={{ uri: dataContent.fStoreBackgroundImageJSON[0][this.props.imageSetting].uri }}>
                        <View accessible={true} accessibilityLabel={'RestoHomeHeaderOverlayView'} style={style.coverOverlay}></View>
                    </Image>
                </Animated.View>

                <View accessible={true} style={style.placeDetailContainer}>
                    <View accessible={true} style={style.leftContainer}>
                        <Text accessible={true} accessibilityLabel={'RestoHomeHeaderNameText'} preset={Text.preset.h4B} style={style.nameText} >{(dataContent.fStoreName).toUpperCase()}</Text>
                        <Text accessible={true} accessibilityLabel={'RestoHomeHeaderShortDesc'} preset={Text.preset.h8} style={style.shortDescText} numberOfLines={2}>{dataContent.fShortDescription}</Text>
                        <Text accessible={true} accessibilityLabel={'RestoHomeHeaderRestoCategory'} preset={Text.preset.h7} style={style.categoryText}>{VisitorHelper.getLocalizeDataFromLookUp('RestoCategory',data.restoCategory,this._language)}, {VisitorHelper.getLocalizeDataFromLookUp('CuisineCategory',data.restoCuisine,this._language)}</Text>
                        <Text accessible={true} accessibilityLabel={'RestoHomeHeaderHalalText'} preset={Text.preset.h7} style={style.foodPreferenceText} numberOfLines={1}>{SGLocalize.translate('isHalal.' + data.isHalal)} {SGLocalize.translate('isVegetarian.' + data.isVegetarian)}</Text>
                        <Text accessible={true} accessibilityLabel={'RestoHomeHeaderPlaceName'} preset={Text.preset.h7} style={style.placeNameText}>{data['fBuildingName' + this.props.language.toUpperCase()]}, {VisitorHelper.getLocalizeDataFromLookUp('City',data.city,this._language)}, {this._constructFloorString(data.floor)}</Text>

                    <View style={style.leftContainer1}>
                            <CardIconButtonLike onIconPressed={this.props.onLike} accessible={true} accessibilityLabel={'RestoHomeHeaderLikeIcon'} likePackage={this._getLikeResource(data)} textColor='white' navigator={this.props.navigator} contentType='Resto' contentKey={data.restoKey} active={data.fUserLikedThis} type={'like'} style={style.iconButton} likeTenantGetReward={this.props.likeTenantGetReward}></CardIconButtonLike>
                            <CardIconButtonFavorite onIconPressed={this.props.onFavorite} accessible={true} accessibilityLabel={'RestoHomeHeaderFavoritesIcon'} textColor='white' navigator={this.props.navigator} contentType='Resto' contentKey={data.restoKey} active={data.fUserFavoriteThis} type={'favorite'} style={style.iconButton}></CardIconButtonFavorite>
                            <CardIconButtonComment accessible={true} accessibilityLabel={'RestoHomeHeaderCommentIcon'} commentPackage={this._getCommentResource(data)} textColor='white' navigator={this.props.navigator} contentType='Resto' contentKey={data.restoKey} canComment={data.fCanComment} type={'comment'} style={style.iconButton}></CardIconButtonComment>
                            <CardIconButtonShare accessible={true} accessibilityLabel={'RestoHomeHeaderShareIcon'} textColor='white' navigator={this.props.navigator} contentType='Resto' contentKey={data.restoKey} shareMessage={dataContent.fShareMessage} targetKey={data.restoKey} type={'share'} style={style.iconButton}></CardIconButtonShare>
                            <CardIconButtonNotification onIconPressed={this.props.onNotification}  accessible={true} accessibilityLabel={'RestoHomeHeaderNotificationIcon'} textColor='white' navigator={this.props.navigator} contentType='Resto' contentKey={data.restoKey} active={data.fUserNotificationThis} type={'notification'} style={style.iconButton}></CardIconButtonNotification>
                    </View>

                    </View>
                </View>
        
                <Animated.View accessible={true} style={[style.checkInOutBtnContainer, { transform: [{ translateY: SGHelperType.isDefined(this.props.animVar) ? this.props.animVar.interpolate({ inputRange: [0, 1], outputRange: [0, -w * 0.2] }) : 0 }] }]}>
                    {isAlreadyCheckIn === true ?
                        (<CheckOutButton accessible={true} accessibilityLabel={'RestoHomeHeaderCheckInButton'} navigator={this.props.navigator} refresh={this.props.refresh} contentType='Resto' checkInData={this.props.checkInData} contentKey={data.restoKey}></CheckOutButton>)
                        :
                        (<CheckInButton accessible={true} accessibilityLabel={'RestoHomeHeaderCheckOutButton'} navigator={this.props.navigator} refresh={this.props.refresh} contentType='Resto' contentKey={data.restoKey} checkInReward={this.props.checkInReward}></CheckInButton>)
                    }
                    <View style={style.vLastVisited}>                    
                        {data.lastVisited !== null &&
                                <Text accessible={true} accessibilityLabel={'RestoHomeHeaderLastVisitedText'} preset={Text.preset.heading9} style={style.lastVisitText}>{(SGLocalize.translate("globalText.lastVisitedText"))} {VisitorHelper._decideDayText(data.lastVisited)}</Text>
                        }
                    </View>
                </Animated.View>
                <Animated.View accessible={true} style={[style.thumbnailContainer, { transform: [{ translateY: SGHelperType.isDefined(this.props.animVar) ? this.props.animVar.interpolate({ inputRange: [0, 1], outputRange: [0, -w * 0.2] }) : 0 }] }]}>
                    <TouchableOpacity onPress={() => { SGHelperNavigation.navigatePush(this.props.navigator, this.props.screen, { contentKey: data.restoKey }) }} shadow>
                        <Image accessible={true} accessibilityLabel={'RestoHomeHeaderLogoImage'} style={style.thumbnailImage} source={{ uri: dataContent.fStoreImageJSON[0][this.props.imageSetting].uri }}></Image>
                    </TouchableOpacity>
                </Animated.View>
            </View>
        );
    }
}
