import React from 'react';
import { SGBaseContainer } from '../../core/container/SGBaseContainer';
import { SGView as View, SGDialogBox as DialogBox, SGImage as Image, SGText as Text, SGTouchableOpacity as TouchableOpacity, SGIcon as Icon, SGIconButton as IconButton } from '../../core/control';
import { StyleSheet, Linking, Animated } from 'react-native';
import { SGLocalize } from "../locales/SGLocalize";
import { CardIconButton, CardIconButtonLike, CardIconButtonFavorite, CardIconButtonNotification, CardIconButtonComment, CardIconButtonShare } from '../component_V2/CardIconButton';
import { CheckInButton } from '../component_V2/CheckInButton';
import { CheckOutButton } from '../component_V2/CheckOutButton';
import { CheckOutButtonSmall } from '../component_V2/CheckoutButtonSmall';
import { CheckInButtonSmall } from '../component_V2/CheckInButtonSmall';
import { SGHelperNavigation, SGHelperGlobalVar, SGHelperType, SGHelperStyle,SGHelperErrorHandling } from '../../core/helper';
import { tbLookupDAO } from '../db/tbLookupDAO';
import { VisitorHelper } from '../helper/VisitorHelper';
import idJSON from '../locales/id.json';
import enJSON from '../locales/en.json';
import cnJSON from '../locales/cn.json';
import image from '../asset/image';
import { tbVUserViewAPI } from '../api/tbVUserViewAPI';

export class MallHomeNewHeader extends SGBaseContainer {
    createStyleSheet = (whp) => {
        var { w, h, p } = whp;
        return StyleSheet.create({
            mainContainer: { width: w, flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start' },
            imageHeaderContainer: { width: w, backgroundColor: '#FFFFFF', marginTop: p * 8.5, justifyContent: 'center', alignItems: 'center' },
            placeCoverImage: { width: w, height: w * 0.49, resizeMode: 'cover', borderRadius: 0 },
            overlay: { width: w, height: w * 0.49, backgroundColor: '#000000', opacity: 0.3 },
            thumbnailContainer: { marginLeft: p * 4, backgroundColor: 'transparent', position: 'absolute', top: w * 0.375 },
            placeThumbnailImage: { width: w * 0.28, height: w * 0.28, resizeMode: 'contain', borderRadius: p * 4, elevation: 1 },
            checkInOutBtnContainer: { width: w - p * 4, height: w * 0.22, backgroundColor: 'transparent', justifyContent: 'flex-end', alignItems: 'flex-end', position: 'absolute', top: w * 0.425, right: w * 0.02 },
            placeDetailContainer: { width: w, paddingTop: 12 * p, backgroundColor: '#FFFFFF', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'flex-end', paddingHorizontal: p * 4 },
            leftContainer: { width: w - 2 * p, flexDirection:'row', justifyContent: 'flex-start', alignItems: 'flex-start',flexWrap: 'wrap' },
            leftContainer1: { width: w - 2 * p, flexDirection: 'row', justifyContent: 'flex-start', marginVertical: p },
            placeNameText: { color: SGHelperStyle.color.SGText.TextBlack, marginTop: 3 * p },
            typeLocationText: { color: SGHelperStyle.color.SGText.TextGrey, marginVertical: 0, marginBottom: p * 0.5 },
            iconButton: { width: w, height: w, padding: p },
            vLastVisited: { position: 'absolute', right: 2, bottom: -20 },
            lastVisitText: { color: SGHelperStyle.color.SGText.TextGrey },
            arrowUp: { width: w, alignItems: 'center' },
            iconwhatsapp: { width: w * 0.08, height: w * 0.08, resizeMode: 'contain', backgroundColor: 'transparent' },
        });
    }

    constructor(props, context, ...args) {
        super(props, context, ...args);
        this.whp = { w: props.style.width, h: props.style.height, p: props.style.padding }
        this.style = this.createStyleSheet(this.whp);
        this.title = props.title;
        this.image = props.image;
        this.state = { show: true, timer: 0 }
        this._language = SGHelperGlobalVar.getVar('GlobalLanguage')
        this._animW = new Animated.Value(1);
        setTimeout((() => { if(this.state.show){this._changeHeader();} }).bind(this), SGHelperType.getSysParamsValueToInt('HeaderInterval'));
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
                fContentText1: { id: idJSON.city[tbLookupDAO.getLookUpValue(data.city).fValueKey], en: enJSON.city[tbLookupDAO.getLookUpValue(data.city).fValueKey], cn: cnJSON.city[tbLookupDAO.getLookUpValue(data.city).fValueKey] },
                fContentText2: { id: contentBuildingID.fShortDescription, en: contentBuildingEN.fShortDescription, cn: contentBuildingCN.fShortDescription },
                fContentImage: { id: contentBuildingID.fImageJSON, en: contentBuildingEN.fImageJSON, cn: contentBuildingCN.fImageJSON },
                fTargetType: 'Place', fTargetName: { id: contentBuildingID.fBuildingName, en: contentBuildingEN.fBuildingName, cn: contentBuildingCN.fBuildingName },
                fTargetImage: { id: contentBuildingID.fImageJSON, en: contentBuildingEN.fImageJSON, cn: contentBuildingCN.fImageJSON },
                fTargetKey: data.buildingKey
            }
        )
    }

    _changeHeader() {
        if (this.state.show) { this.hideHeader(); }
        else { this.showHeader(); }
        this.setState({ show: !this.state.show });
    }

    hideHeader() {
        this.baseControlCreateAnimation(this._animW, 1, 0, 500, () => { this.forceUpdate();});
    }
    showHeader() {
        this.baseControlCreateAnimation(this._animW, 0, 1, 500, () => { this.forceUpdate();});
    }

    refreshMallHeader() {
        this.forceUpdate();
        console.log('refresh Mall Header');
    }

    handleLink(url) {
        var valid = SGHelperType.validURL(url)
        if (valid) {
            Linking.canOpenURL(url
            ).then(supported => {
                // if (supported) {
                    if ((SGHelperType.left(url, 8) != 'https://')) {
                        Linking.openURL('https://' + url);
                    } else {
                        Linking.openURL(url);
                    }
                // } else {
                //     console.log("Don't know how to open URI: " + url);
                // }
            });
        } else {
            DialogBox.showFail(null, SGLocalize.translate("globalText.FailText"), SGLocalize.translate('globalText.notSupportedLink'), SGLocalize.translate('globalText.ok'), () => { }, true);
        }
    };

    whatsappEnjoyer(data) {
        try {
            console.log(data);
            var checkTrueData = true;

            // cek nomor whatsapp depanny ap
            if (data[0] == '+') var trueData = data.replace('+62', '');
            else if (data[0] == '0') var trueData = data.replace('0', '');
            else if (data[0] == '6') var trueData = data.replace('62', '');
            else {
                var trueData = data;
                checkTrueData = false;
            }

            // Buat android yg gada replaceAll
            if (typeof String.prototype.replaceAll == "undefined") {
                String.prototype.replaceAll = function (match, replace) {
                    return this.replace(new RegExp(match, 'g'), () => replace);
                }
            }

            // kalo format nomor whatsapp bener
            if (checkTrueData) {
                trueData = trueData.replaceAll('-', '');
                trueData = trueData.replaceAll(' ', '');
                trueData = trueData.replaceAll('–', '');
            }

            // this.handleLink.bind(this, this.data.whatsapp);
            this.handleLink('https://wa.me/62' + trueData);
            
            dataHeader = this.props.headerData;
            var jsonInput = { fID: '', fContentType: 'Whatsapp',  fTargetKey: dataHeader.buildingKey, fUserKey: '', fActive: 'Y', fCreatedByID: '', fCreatedDate: new Date(), fLastModifiedByID: '', fLastModifiedDate: new Date() }
            this._addUserClick(jsonInput)

        } catch {
            console.log('WHATSAPP NOT FOUND KEKW');
        }

    }

    _addUserClick(jsonInput){
        tbVUserViewAPI.addUserClick(jsonInput).then(()=>{}).catch((error)=>{
            SGHelperErrorHandling.Handling(error,this._addUserClick(this,jsonInput))
        })
    }
    
    render() {
        var { w, h, p } = this.whp;
        var style = this.style;
        var data = this.props.headerData;
        var fullData = this.props.fullData;
        console.log('DATA KE HEADER');
        var dataContent = data['fContent' + this.props.language.toUpperCase()];
        var isAlreadyCheckIn = this.props.isAlreadyCheckIn;
        var shareParams = {MallName:data['fBuildingName'+this.props.language.toUpperCase()]}
        
        return (
            <View>
                {/* {this.state.show ? */}
                <View accessible={true} style={style.mainContainer}>
                    <Animated.View style={{marginTop: this._animW.interpolate({ inputRange: [0, 1], outputRange: [-11*p,0] })}}>
                        <Animated.View accessible={true} style={[style.imageHeaderContainer, { height: SGHelperType.isDefined(this.props.animVar) ? this.props.animVar.interpolate({ inputRange: [0, 1], outputRange: [w * 0.49, w * 0.25] }) : w * 0.49 }]}>
                            <Image accessible={true} accessibilityLabel={'MallHomeHeaderRootImageBackground'} style={style.placeCoverImage} source={{ uri: dataContent.fImageBackgroundJSON[0][this.props.imageSetting].uri }}>
                                <View accessible={true} accessibilityLabel={'MallHomeHeaderOverlayView'} style={style.overlay}></View>
                            </Image>
                        </Animated.View>
                    </Animated.View>
                    <Animated.View accessible={true} style={[style.placeDetailContainer,{paddingTop:this._animW.interpolate({ inputRange: [0, 1], outputRange: [data.lastVisited !== null ?9*p:4*p,12*p] }),marginBottom:this._animW.interpolate({ inputRange: [0, 1], outputRange: [-3*p,0] }) }]}>
                        <View accessible={true} style={style.leftContainer}>
                            <Animated.View style={{width:this._animW.interpolate({ inputRange: [0, 1], outputRange: [0, w-8*p] }), }}>
                                <Text accessible={true} accessibilityLabel={'MallHomeHeaderBottomDataText'} preset={Text.preset.titleH1B} style={style.placeNameText} numberOfLines={1} >{(dataContent.fBuildingName).toUpperCase()}</Text>
                            </Animated.View>
                            <Animated.View style={{width:this._animW.interpolate({ inputRange: [0, 1], outputRange: [0, w-8*p] }), }}>
                                <Text accessible={true} accessibilityLabel={'MallHomeHeaderPlaceCategoryName'} preset={Text.preset.titleH3} style={style.typeLocationText} numberOfLines={2}>{VisitorHelper.getLocalizeDataFromLookUp('BuildingCategory', data.buildingType, this._language)}, {VisitorHelper.getLocalizeDataFromLookUp('City', data.city, this._language)}</Text>                            
                            </Animated.View>
                            <Animated.View style={{width:this._animW.interpolate({ inputRange: [0, 1], outputRange: [0, w-8*p] }), }}>
                                <Text accessible={true} accessibilityLabel={'MallHomeHeaderShortDesc'} preset={Text.preset.titleH4} style={style.lastVisitText} numberOfLines={2}>{dataContent.fShortDescription}</Text>                            
                            </Animated.View>
                            <Animated.View style={{width:this._animW.interpolate({ inputRange: [0, 1], outputRange: [(w-8*p)*0.3, 0]}),}}></Animated.View>
                            <Animated.View style={{width:this._animW.interpolate({ inputRange: [0, 1], outputRange: [(w-8*p)*0.7, w-8*p] }), }}>
                                <View style={style.leftContainer1}>
                                    <CardIconButtonFavorite onIconPressed={this.props.onFavorite} accessible={true} accessibilityLabel={'MallHomeHeaderFavoritesIcon'} textColor='white' navigator={this.props.navigator} contentType='Place' contentKey={data.buildingKey} active={data.fUserFavoriteThis} type={'favorite'} style={style.iconButton}></CardIconButtonFavorite>
                                    <CardIconButtonLike onIconPressed={this.props.onLike} accessible={true} accessibilityLabel={'MallHomeHeaderLikeIcon'} likePackage={this._getLikeResource(data)} textColor='white' navigator={this.props.navigator} contentType='Place' contentKey={data.buildingKey} active={data.fUserLikedThis} type={'like'} style={style.iconButton} likeMallGetReward={this.props.likeMallGetReward}></CardIconButtonLike>
                                    <CardIconButtonComment accessible={true} accessibilityLabel={'MallHomeHeaderCommentIcon'} commentPackage={this._getCommentResource(data)} textColor='white' navigator={this.props.navigator} contentType='Place' contentKey={data.buildingKey} canComment={data.fCanComment} type={'comment'} style={style.iconButton}></CardIconButtonComment>
                                    <CardIconButtonShare shareParams={shareParams} img={dataContent.fImageJSON[0].thumbnailLow.uri} accessible={true} accessibilityLabel={'MallHomeHeaderShareIcon'} textColor='white' navigator={this.props.navigator} contentType='Place' contentKey={data.buildingKey} shareMessage={dataContent.fShareMessage} targetKey={data.buildingKey} type={'share'} style={style.iconButton}></CardIconButtonShare>
                                    <CardIconButtonNotification onIconPressed={this.props.onNotification} accessible={true} accessibilityLabel={'MallHomeHeaderNotificationIcon'} textColor='white' navigator={this.props.navigator} contentType='Place' contentKey={data.buildingKey} active={data.fUserNotificationThis} type={'notification'} style={style.iconButton}></CardIconButtonNotification>
                                    {(fullData.whatsapp !== '' && fullData.whatsapp !== '–' && fullData.whatsapp !== ' ' && fullData.whatsapp !== '-') &&
                                        <TouchableOpacity onPress={() => { this.whatsappEnjoyer(fullData.whatsapp) }}>
                                            <Image accessible={true} accessibilityLabel={'MallProfileScreenYTIconImage'} source={{ uri: image.iconWhatsapp[this.props.imageSetting].url }} style={style.iconwhatsapp}></Image>
                                        </TouchableOpacity>
                                    }
                                </View>                                
                            </Animated.View>
                        </View>
                    </Animated.View>

                    <Animated.View accessible={true} style={[style.checkInOutBtnContainer,{marginRight:this._animW.interpolate({ inputRange: [0, 1], outputRange: [-7*p, 0] }), top:this._animW.interpolate({ inputRange: [0, 1], outputRange: [w * 0.425-14*p, w * 0.425] })} , { transform: [{scale:this._animW.interpolate({ inputRange: [0, 1], outputRange: [0.85,1] })},{ translateY: SGHelperType.isDefined(this.props.animVar) ? this.props.animVar.interpolate({ inputRange: [0, 1], outputRange: [0, -w * 0.23] }) : 0 }] }]}>
                        {isAlreadyCheckIn === true ?
                            (<CheckOutButton accessible={true} accessibilityLabel={'MallHomeHeaderCheckOutButton'} navigator={this.props.navigator} refreshCheckOut={this.props.refreshCheckOut} contentType='Place' contentKey={data.buildingKey}></CheckOutButton>)
                            :
                            (<CheckInButton accessible={true} accessibilityLabel={'MallHomeHeaderCheckInButton'} navigator={this.props.navigator} refresh={this.props.refresh} contentType='Place' contentKey={data.buildingKey} checkInReward={this.props.checkInReward} ></CheckInButton>)
                        }
                        <View style={style.vLastVisited}>
                            {data.lastVisited !== null &&
                                <Text accessible={true} accessibilityLabel={'MallHomeHeaderLastVisitedText'} preset={Text.preset.titleH6} style={style.lastVisitText}>{(SGLocalize.translate("globalText.lastVisitedText"))} {VisitorHelper._decideDayText(data.lastVisited)}</Text>
                            }
                        </View>
                    </Animated.View>

                    <Animated.View accessible={true} style={[style.thumbnailContainer, {marginLeft:this._animW.interpolate({ inputRange: [0, 1], outputRange: [1*p, 4*p] }), top:this._animW.interpolate({ inputRange: [0, 1], outputRange: [w * 0.26 + 11 * p-6*p, w * 0.26 + 11 * p] })} , { transform: [{scale: this._animW.interpolate({ inputRange: [0, 1], outputRange: [0.85,1] })},{ translateY: SGHelperType.isDefined(this.props.animVar) ? this.props.animVar.interpolate({ inputRange: [0, 1], outputRange: [0, -w * 0.2] }) : 0 }] }]}>

                        <TouchableOpacity onPress={() => { SGHelperNavigation.navigatePush(this.props.navigator, this.props.screen, { contentKey: data.buildingKey }) }} shadow>
                            <Image accessible={true} accessibilityLabel={'MallHomeHeaderLogoImage'} style={style.placeThumbnailImage} source={{ uri: dataContent.fImageJSON[0][this.props.imageSetting].uri }} ></Image>
                        </TouchableOpacity>

                    </Animated.View>

                    <TouchableOpacity onPress={this._changeHeader.bind(this)} style={style.arrowUp}>
                        <Icon name={this.state.show?Icon.Icon.arrowUp:Icon.Icon.arrowDown} preset={Icon.preset.h3}></Icon>
                    </TouchableOpacity>

                </View>
            </View>
        );
    }
}