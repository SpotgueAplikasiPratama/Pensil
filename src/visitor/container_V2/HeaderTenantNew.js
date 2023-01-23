import React from 'react';
import { StyleSheet } from 'react-native';
import { SGBaseContainer } from '../../core/container/SGBaseContainer';
import { SGView as View, SGText as Text, SGImage as Image, SGButton as Button, SGTouchableOpacity as TouchableOpacity } from '../../core/control';
import { SGLocalize } from '../locales/SGLocalize';
import { tbLookupDAO } from '../db/tbLookupDAO';
import { CheckInButton } from '../component_V2/CheckInButton';
import { CheckOutButton } from '../component_V2/CheckOutButton';
import { CardIconButton,CardIconButtonLike,CardIconButtonFavorite,CardIconButtonNotification,CardIconButtonComment,CardIconButtonShare } from '../component_V2/CardIconButton';
import { SGHelperNavigation,SGHelperGlobalVar } from '../../core/helper';
import { VisitorHelper } from '../helper/VisitorHelper';
import idJSON from '../locales/id.json';
import enJSON from '../locales/en.json';
import cnJSON from '../locales/cn.json';

export class HeaderTenantNew extends SGBaseContainer {
    createStyleSheet = (whp) => {
        var { w, h, p } = whp;
        return StyleSheet.create({
            v1: { width: w, backgroundColor: 'white', justifyContent: 'center', flexDirection: 'column' },
            v1_1: { width: w, height: w * 0.38, justifyContent: 'flex-start' },
            v1_2: { width: w, height: w * 0.28, flexDirection: 'row', alignItems: 'flex-start' },
            v2: { width: w - 2 * p, height: w * 0.24, resizeMode: 'cover', backgroundColor: "white" },
            v3: { width: w * 0.3, height: w * 0.3, position: 'absolute', resizeMode: 'cover', backgroundColor: "white", borderRadius: 5 * p, alignSelf: 'flex-start', left: 4 * p, marginTop: 4 * p },
            v3_1: { width: w * 0.2, height: w * 0.2, resizeMode: 'cover', backgroundColor: "white" },
            v4: { width: w / 2, justifyContent: 'flex-start' },
            v5: { width: w / 2, justifyContent: 'flex-end', flexDirection: 'row', alignSelf: 'flex-end' },
            vButtonCheck: { width: w * 0.27, height: w * 0.12, position: 'absolute', borderRadius: 5 * p, backgroundColor: "#1FBC8D", alignSelf: 'flex-end', marginTop: 20 * p, right: 8 * p },
            text: { color: "white" },
            text2: { paddingLeft: 4 * p, alignSelf: 'flex-start' },
            text3: { paddingLeft: 4 * p, color: "#888686", alignSelf: 'flex-start' },
            iconButton: { width: w, height: w, padding: p },

        });
    }
    constructor(props, context, ...args) {
        super(props, context, ...args);
        this.whp = this.screenWHPNoHeader
        this.style = this.createStyleSheet(this.whp);
        this._language = SGHelperGlobalVar.getVar('GlobalLanguage')
    }

    _constructFloorString() {
        var str = '';
        for (var i = 0; i < this.props.data.floor.length; i++) {
            if (i === this.props.data.floor.length - 1) { str = str + this.props.data.floor[i]['fFloorName' + this.props.language.toUpperCase()] }
            else {
                str = str + this.props.data.floor[i]['fFloorName' + (this.props.language.toUpperCase())] + ', '
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
        var data = this.props.data;
        var language = this.props.language.toUpperCase();
        var imageSetting = this.props.imageSetting;
        var currentUserData = this.props.currentUserData;
        var isAlreadyCheckIn = this.props.isAlreadyCheckIn;
        return (
            <View accessible={true} accessibilityLabel={'HeaderContainerRootView'} style={style.v1}>
                <View style={style.v1_1}>
                    <Image style={style.v2} source={{ uri: data['fContent' + language].fStoreBackgroundImageJSON[0][imageSetting].uri }}></Image>
                    <View style={style.v3} shadow >
                        <TouchableOpacity onPress={() => { SGHelperNavigation.navigatePush(this.props.navigator, this.props.screen, { contentKey: data.restoKey }) }}>
                            <Image style={style.v3_1} source={{ uri: data['fContent' + language].fStoreImageJSON[0][imageSetting].uri }}></Image>
                        </TouchableOpacity>
                    </View>
                    <View shadow style={style.vButtonCheck}>
                        {isAlreadyCheckIn === true ?
                            (<CheckOutButton accessible={true} accessibilityLabel={'RestoHomeHeaderCheckInButton'} refresh={this.props.refresh} contentType='Resto' checkInData={this.props.checkInData} contentKey={data.restoKey} style={style.button1} ></CheckOutButton>) :
                            (<CheckInButton accessible={true} accessibilityLabel={'RestoHomeHeaderCheckOutButton'} refresh={this.props.refresh} contentType='Resto' contentKey={data.restoKey} style={style.button1} ></CheckInButton>)
                        }
                    </View>
                </View>
                <View style={style.v1_2}>
                    <View style={style.v4}>
                        <Text preset={Text.preset.h4B} numberOfLines={1} style={style.text2}>{data['fContent' + language].fStoreName}</Text>
                        <Text preset={Text.preset.h8} numberOfLines={1} style={style.text3}>{VisitorHelper.getLocalizeDataFromLookUp('CuisineCategory',data.restoCuisine,this._language)}</Text>
                        <Text preset={Text.preset.h8} numberOfLines={1} style={style.text3}>{SGLocalize.translate('isHalal.' + data.isHalal)} {SGLocalize.translate('isVegetarian.' + data.isVegetarian)}</Text>
                        <Text preset={Text.preset.h8} numberOfLines={1} style={style.text3}>{data['fBuildingName' + language]}, {this._constructFloorString()}</Text>
                        <Text preset={Text.preset.h8} numberOfLines={1} style={style.text3}>{(SGLocalize.translate("globalText.lastVisitedText"))} {VisitorHelper._decideDayText(data.lastVisited)}</Text>
                    </View>
                    <View style={style.v5}>
                        <CardIconButtonComment accessible={true} accessibilityLabel={'RestoHomeHeaderCommentIcon'} commentPackage={this._getCommentResource(data)} textColor='white' navigator={this.props.navigator} contentType='Resto' contentKey={data.restoKey} canComment={data.fCanComment} type={'comment'} style={style.iconButton}></CardIconButtonComment>
                        <CardIconButtonShare accessible={true} accessibilityLabel={'RestoHomeHeaderShareIcon'} textColor='white' navigator={this.props.navigator} contentType='Resto' contentKey={data.restoKey} shareMessage={data['fContent' + language].fShareMessage} targetKey={data.restoKey} type={'share'} style={style.iconButton}></CardIconButtonShare>
                        <CardIconButtonNotification onIconPressed={this.props.onNotification}  accessible={true} accessibilityLabel={'RestoHomeHeaderNotificationIcon'} textColor='white' navigator={this.props.navigator} contentType='Resto' contentKey={data.restoKey} active={data.fUserNotificationThis} type={'notification'} style={style.iconButton}></CardIconButtonNotification>
                        <CardIconButtonLike onIconPressed={this.props.onLike} accessible={true} accessibilityLabel={'RestoHomeHeaderLikeIcon'} likePackage={this._getLikeResource(data)} textColor='white' navigator={this.props.navigator} contentType='Resto' contentKey={data.restoKey} active={data.fUserLikedThis} type={'like'} style={style.iconButton}></CardIconButtonLike>
                        <CardIconButtonFavorite onIconPressed={this.props.onFavorite} accessible={true} accessibilityLabel={'RestoHomeHeaderFavoritesIcon'} textColor='white' navigator={this.props.navigator} contentType='Resto' contentKey={data.restoKey} active={data.fUserFavoriteThis} type={'favorite'} style={style.iconButton}></CardIconButtonFavorite>
                    </View>
                </View>
            </View>

        );
    }
}

