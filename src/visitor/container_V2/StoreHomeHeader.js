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

export class StoreHomeHeader extends SGBaseContainer {
    createStyleSheet = (whp) => {
        var { w, h, p } = whp;
        return StyleSheet.create({
            mainContainer: { width: w, flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start' },
            imageHeaderContainer: { width: w, backgroundColor: '#FFFFFF', marginTop: p * 8.5, justifyContent: 'center', alignItems: 'center'  },
            placeCoverImage: { width: w, height: w * 0.49, resizeMode: 'cover' },
            overlay: { width: w, height: w * 0.49, backgroundColor: '#000000', opacity: 0.3 },
            thumbnailContainer: { marginLeft: p * 4, backgroundColor: 'transparent', position: 'absolute', top: w * 0.335 },
            placeThumbnailImage: { width: w * 0.31, height: w * 0.31, resizeMode: 'cover',borderRadius:4*p},
            checkInOutBtnContainer: { width: w - p * 4, height: w * 0.22, backgroundColor: 'transparent', justifyContent: 'flex-end',alignItems:'flex-end', position: 'absolute', top: w * 0.425,right:w*0.02 },
            placeDetailContainer: { width: w, paddingTop: 12*p, backgroundColor: '#FFFFFF', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'flex-end', paddingHorizontal: p * 4 },
            leftContainer: { width: w-4*p, justifyContent: 'flex-start', alignItems: 'flex-start' },
            leftContainer1: {width: w-4*p,flexDirection:'row',justifyContent:'flex-start',marginVertical:p},
            placeNameText: { color: '#000000'},
            shortDescText: { color: '#A2A2A2', marginVertical: 0, marginBottom: p },
            typeLocationText: { color: '#A2A2A2', marginVertical: p },
            vLastVisited:{position:'absolute',right:2,bottom:-20},
            lastVisitText: { color: '#A2A2A2'},
            containerView1: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', },
            containerView1_1: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', backgroundColor: '#2886e3', borderRadius: 0.5 * p, marginTop: p, marginLeft: p, padding: 0 },
            containerView2: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-evenly', marginBottom: 1.5 * p, borderRadius: p },
            containerView2_1: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'flex-start', width: w, },
            textView1: { height: w * 0.3, marginTop: 2.5 * p, flex: 1, justifyContent: 'center', alignItems: 'flex-start', },
            imageView: { height: w * 0.3, },
            iconButton: { width: w, height: w, padding: p },
            text: { color: 'white', marginVertical: 0.25 * p, maxWidth: w * 0.5 },
            image1: { marginLeft: 4 * p, width: w * 0.2, height: w * 0.2, resizeMode: 'cover', borderRadius: 0.75 * p },
            containerView2_1_1: { marginRight: w * 0.005, justifyContent: 'flex-end', flexDirection: 'row', width: w / 4, height: w * 0.4 / 7, marginVertical: w * 0.006 },
            containerView2_1_2: { justifyContent: 'flex-end', flexDirection: 'row', width: w / 4, height: w * 0.4 / 7, marginVertical: w * 0.006 },
            icon: { marginRight: w * 0.02, fontSize: w * 0.05, },
            icon1: { marginVertical: 0.5 * p, color: 'white' },
            textLastVisited: { color: 'white', marginVertical: 0, marginHorizontal: p },
            textLiked: { color: 'white', marginLeft: 4 * p, maxWidth: w * 0.25, marginTop: 4 * p }
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

    _getLikeResource(data) {
        var contentStoreID = data.fContentID;
        var contentStoreEN = data.fContentEN;
        var contentStoreCN = data.fContentCN;
        return (
            {
                fContentType: 'Store', fContentKey: data.storeKey, fText1: { id: contentStoreID.fStoreName, en: contentStoreEN.fStoreName, cn: contentStoreCN.fStoreName }, fText2: { id: idJSON.storeCategory[tbLookupDAO.getLookUpValue(data.storeCategory)], en: enJSON.storeCategory[tbLookupDAO.getLookUpValue(data.storeCategory)], cn: cnJSON.storeCategory[tbLookupDAO.getLookUpValue(data.storeCategory)] }, fText3: { id: data.fBuildingNameID, en: data.fBuildingNameEN, cn: data.fBuildingNameCN }, fImageID: contentStoreID.fStoreImageJSON, fImageEN: contentStoreEN.fStoreImageJSON, fImageCN: contentStoreCN.fStoreImageJSON, fTargetImage: { id: contentStoreID.fStoreImageJSON, en: contentStoreEN.fStoreImageJSON, cn: contentStoreCN.fStoreImageJSON }, fTargetKey: data.storeKey
            }
        )
    }

    _getCommentResource(data) {
        var contentStoreID = data.fContentID;
        var contentStoreEN = data.fContentEN;
        var contentStoreCN = data.fContentCN;

        return (
            {
                fUserImage: this.props.currentUserData.fProfileImageJSON, fContentType: 'Store', fContentKey: data.storeKey,
                fContentName: { id: contentStoreID.fStoreName, en: contentStoreEN.fStoreName, cn: contentStoreCN.fStoreName },
                fContentText1: { id: data.fBuildingNameID, en: data.fBuildingNameEN, cn: data.fBuildingNameCN },
                fContentText2: { id: contentStoreID.fShortDescription, en: contentStoreEN.fShortDescription, cn: contentStoreCN.fShortDescription },
                fContentImage: { id: contentStoreID.fStoreImageJSON, en: contentStoreEN.fStoreImageJSON, cn: contentStoreCN.fStoreImageJSON },
                fTargetType: 'Store', fTargetName: { id: contentStoreID.fStoreName, en: contentStoreEN.fStoreName, cn: contentStoreCN.fStoreName },
                fTargetImage: { id: contentStoreID.fStoreImageJSON, en: contentStoreEN.fStoreImageJSON, cn: contentStoreCN.fStoreImageJSON },
                fTargetKey: data.storeKey
            }
        )
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
    
    render() {
        var { w, h, p } = this.whp;
        var style = this.style;
        var data = this.props.headerData;
        var dataContent = data['fContent' + this.props.language.toUpperCase()];
        var isAlreadyCheckIn = this.props.isAlreadyCheckIn;
        return (
            <View accessible={true} style={style.mainContainer}>
                <Animated.View accessible={true} style={[style.imageHeaderContainer, { overflow: 'hidden', height: SGHelperType.isDefined(this.props.animVar) ? this.props.animVar.interpolate({ inputRange: [0, 1], outputRange: [w * 0.49, w * 0.28] }) : w * 0.49 }]}>
                    <Image accessible={true} accessibilityLabel={'StoreHomeHeaderBackgroundImage'} style={style.placeCoverImage} source={{ uri: dataContent.fStoreBackgroundImageJSON[0][this.props.imageSetting].uri }}>
                        <View accessible={true} accessibilityLabel={'StoreHomeHeaderOverlayView'} style={style.overlay}></View>
                    </Image>
                </Animated.View>
              
               
            
                <View accessible={true} style={style.placeDetailContainer}>
                    <View accessible={true} style={style.leftContainer}>
                        <Text accessible={true} accessibilityLabel={'StoreHomeHeaderStoreName'} preset={Text.preset.h4B} style={style.placeNameText} numberOfLines={1} >{(dataContent.fStoreName).toUpperCase()}</Text>
                        <Text accessible={true} accessibilityLabel={'StoreHomeHeaderShortDesc'} preset={Text.preset.h8} style={style.shortDescText} numberOfLines={2}>{dataContent.fShortDescription}</Text>
                        <Text accessible={true} accessibilityLabel={'StoreHomeHeaderStoreCategory'} preset={Text.preset.h7} style={style.typeLocationText} numberOfLines={2}>{VisitorHelper.getLocalizeDataFromLookUp('StoreCategory',data.storeCategory,this._language)}</Text>
                        <Text accessible={true} accessibilityLabel={'StoreHomeHeaderPlaceName'} preset={Text.preset.h7} style={style.typeLocationText} numberOfLines={2}>{data['fBuildingName' + this.props.language.toUpperCase()]}, {VisitorHelper.getLocalizeDataFromLookUp('City',data.city,this._language)}, {this._constructFloorString(data.floor)}</Text>
                        
                    <View style={style.leftContainer1}>
                        <CardIconButtonLike onIconPressed={this.props.onLike} accessible={true} accessibilityLabel={'StoreHomeHeaderLikeIcon'} likePackage={this._getLikeResource(data)} textColor='white' navigator={this.props.navigator} contentType='Store' contentKey={data.storeKey} active={data.fUserLikedThis} type={'like'} style={style.iconButton} likeTenantGetReward={this.props.likeTenantGetReward}></CardIconButtonLike>
                        <CardIconButtonFavorite onIconPressed={this.props.onFavorite} accessible={true} accessibilityLabel={'StoreHomeHeaderFavoritesIcon'} textColor='white' navigator={this.props.navigator} contentType='Store' contentKey={data.storeKey} active={data.fUserFavoriteThis} type={'favorite'} style={style.iconButton}></CardIconButtonFavorite>
                        <CardIconButtonComment accessible={true} accessibilityLabel={'StoreHomeHeaderCommentIcon'} commentPackage={this._getCommentResource(data)} textColor='white' navigator={this.props.navigator} contentType='Place' contentKey={data.storeKey} canComment={data.fCanComment} type={'comment'} style={style.iconButton}></CardIconButtonComment>
                        <CardIconButtonShare accessible={true} accessibilityLabel={'StoreHomeHeaderShareIcon'} textColor='white' navigator={this.props.navigator} contentType='Store' contentKey={data.storeKey} shareMessage={dataContent.fShareMessage} targetKey={data.storeKey} type={'share'} style={style.iconButton}></CardIconButtonShare>
                        <CardIconButtonNotification onIconPressed={this.props.onNotification}  accessible={true} accessibilityLabel={'StoreHomeHeaderNotificationIcon'} textColor='white' navigator={this.props.navigator} contentType='Store' contentKey={data.storeKey} active={data.fUserNotificationThis} type={'notification'} style={style.iconButton}></CardIconButtonNotification>
                    </View>
                </View>
                </View>

                
                <Animated.View accessible={true} style={[style.checkInOutBtnContainer, { transform: [{ translateY: SGHelperType.isDefined(this.props.animVar) ? this.props.animVar.interpolate({ inputRange: [0, 1], outputRange: [0, -w * 0.2] }) : 0 }] }]}>
                    {isAlreadyCheckIn === true ?
                        (<CheckOutButton accessible={true} accessibilityLabel={'MallHomeHeaderCheckOutButton'} navigator={this.props.navigator} refresh={this.props.refresh} contentType='Store' contentKey={data.storeKey} ></CheckOutButton>)
                        :
                        (<CheckInButton accessible={true} accessibilityLabel={'MallHomeHeaderCheckInButton'} navigator={this.props.navigator} refresh={this.props.refresh} contentType='Store' contentKey={data.storeKey} checkInReward={this.props.checkInReward} ></CheckInButton>)
                    }
                    <View style={style.vLastVisited}>                    
                        {data.lastVisited !== null &&
                            <Text accessible={true} preset={Text.preset.heading9} style={style.lastVisitText}>{(SGLocalize.translate("globalText.lastVisitedText"))} {VisitorHelper._decideDayText(data.lastVisited)}</Text>
                        }
                    </View>

                </Animated.View>

                <Animated.View accessible={true} style={[style.thumbnailContainer, { transform: [{ translateY: SGHelperType.isDefined(this.props.animVar) ? this.props.animVar.interpolate({ inputRange: [0, 1], outputRange: [0, -w * 0.2] }) : 0 }] }]}>
              
                    <TouchableOpacity onPress={() => { SGHelperNavigation.navigatePush(this.props.navigator, this.props.screen, { contentKey: data.storeKey }) }} shadow>
                        <Image accessible={true} accessibilityLabel={'StoreHomeHeaderLogoImage'}  style={style.placeThumbnailImage} source={{ uri: dataContent.fStoreImageJSON[0][this.props.imageSetting].uri }}></Image>
                    </TouchableOpacity>
                </Animated.View>

            </View>
        )
    }
}
