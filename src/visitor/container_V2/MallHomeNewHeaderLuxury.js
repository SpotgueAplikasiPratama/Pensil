import React from 'react';
import { SGBaseContainer } from '../../core/container/SGBaseContainer';
import { SGView as View, SGDialogBox as DialogBox, SGImage as Image, SGText as Text, SGTouchableOpacity as TouchableOpacity, SGIcon as Icon, SGIconButton as IconButton } from '../../core/control';
import { StyleSheet, Linking, Animated, StatusBar } from 'react-native';
import { SGLocalize } from "../locales/SGLocalize";
import { CardIconButton, CardIconButtonLike, CardIconButtonFavorite, CardIconButtonNotification, CardIconButtonComment, CardIconButtonShare } from '../component_V2/CardIconButton';
import { CheckInButton } from '../component_V2/CheckInButton';
import { CheckOutButton } from '../component_V2/CheckOutButton';
import { CheckOutButtonSmall } from '../component_V2/CheckoutButtonSmall';
import { CheckInButtonSmall } from '../component_V2/CheckInButtonSmall';
import { SGHelperNavigation, SGHelperGlobalVar, SGHelperType, SGHelperWindow,SGHelperErrorHandling } from '../../core/helper';
import { tbLookupDAO } from '../db/tbLookupDAO';
import { VisitorHelper } from '../helper/VisitorHelper';
import idJSON from '../locales/id.json';
import enJSON from '../locales/en.json';
import cnJSON from '../locales/cn.json';
import image from '../asset/image';
import { tbVUserViewAPI } from '../api/tbVUserViewAPI';

export class MallHomeNewHeaderLuxury extends SGBaseContainer {
    createStyleSheet = (whp) => {
        var { w, h, p } = whp;
        return StyleSheet.create({
            mainContainer: { backgroundColor:'transparent', width: w, flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start' },
            imageHeaderContainer: {paddingVertical:0, paddingHorizontal:0, width: w, backgroundColor: 'transparent', marginTop: 0, justifyContent: 'flex-start', alignItems: 'center' },
            placeCoverImage: {padding:0,marginVertical:0, marginHorizontal:0, width: w, height: '100%', resizeMode: 'cover', borderRadius: 0,justifyContent:'flex-start'},
            overlay: {padding:0, width: w, height: w, backgroundColor: 'rgba(0,0,0,0)', opacity: 1, justifyContent:'space-between'},
            thumbnailContainer: { marginLeft: p * 4, backgroundColor: 'transparent', position: 'absolute', top: w * 0.375 },
            placeThumbnailImage: { width: w * 0.28-p, height: w * 0.28-p,borderColor:'rgb(198,128,0)',borderWidth:p*0.8, resizeMode: 'contain', borderRadius: p * 4, elevation: 1 },
            checkInOutBtnContainer: { width: w - p * 4, height: w * 0.22, backgroundColor: 'transparent', justifyContent: 'flex-end', alignItems: 'flex-end', position: 'absolute', top: w * 0.425, right: w * 0.02 },
            placeDetailContainer: { width: w, paddingTop: 12 * p, backgroundColor: 'transparent', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'flex-end', paddingHorizontal: p * 4 },
            leftContainer: {backgroundColor:'transparent', width: w - 2 * p, flexDirection:'row', justifyContent: 'flex-start', alignItems: 'flex-start',flexWrap: 'wrap' },
            leftContainer1: {backgroundColor:'transparent', width: w - 2 * p, flexDirection: 'row', justifyContent: 'flex-start', marginVertical: p },
            placeNameText: { color: '#FFFFFF', marginTop: 3 * p },
            typeLocationText: { color: '#FFFFFF', marginVertical: 0, marginBottom: p * 0.5 },
            // imageBackground: { width: w, height: w * 0.365, resizeMode: 'cover', borderRadius: 0, },
            // containerView1: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', },
            // containerView2: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-evenly', marginBottom: 1.5 * p, borderRadius: p },
            iconButton: { width: w, height: w, padding: p },
            // text: { color: 'white', marginVertical: 0.25 * p, maxWidth: w * 0.5 },
            // icon: { marginRight: w * 0.02, fontSize: w * 0.05, },
            vLastVisited: { position: 'absolute', right: 2, bottom: -20 },
            lastVisitText: { color: '#FFFFFF' },
            arrowUp: {backgroundColor:'transparent', width: w, alignItems: 'center' },
            //new Header
            // imageHeaderContainerNew: { width: w, backgroundColor: '#FFFFFF', marginTop: p * 2.5, justifyContent: 'center', alignItems: 'center' },
            // placeCoverImageNew: { width: w, height: w * 0.13, resizeMode: 'cover', borderRadius: 0 },
            // overlayNew: { width: w, height: w * 0.39, backgroundColor: '#000000', opacity: 0.3 },
            // placeThumbnailImageNew: { width: w * 0.23, height: w * 0.23, resizeMode: 'cover', borderRadius: 4 * p },
            // checkInOutBtnContainerNew: { width: w - p * 4, height: w * 0.16, backgroundColor: 'transparent', justifyContent: 'flex-end', alignItems: 'flex-end', position: 'absolute', top: w * 0.34, right: w * 0.02 },
            // placeDetailContainerNew: { position: 'absolute', width: w, paddingTop: 28 * p, flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'flex-end', },
            // thumbnailContainerNew: { marginLeft: p * 3, backgroundColor: 'transparent', position: 'absolute', top: w * 0.26 + 11 * p },
            // arrowDownNew: { alignSelf: 'center', height: w * 0.14, marginBottom: -p, width: w * 0.1, alignItems: 'center', justifyContent: 'flex-end', backgroundColor: 'transparent' },

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
            console.log(trueData);

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
        console.log(data);
        var dataContent = data['fContent' + this.props.language.toUpperCase()];
        var isAlreadyCheckIn = this.props.isAlreadyCheckIn;
        var shareParams = {MallName:data['fBuildingName'+this.props.language.toUpperCase()]}
        return (
            <View>
                <StatusBar translucent={true} backgroundColor={'transparent'}/>
                <View accessible={true} style={style.mainContainer}>
                    <View style={{padding:0,justifyContent:'flex-start',}}>
                        <Animated.View accessible={true} style={[style.imageHeaderContainer, {height: this._animW.interpolate({ inputRange: [0, 1], outputRange: [w * 0.45 + SGHelperWindow.getStatusBarHeight(), w] }) }]}>
                            <Image accessible={true} accessibilityLabel={'MallHomeHeaderRootImageBackground'} style={style.placeCoverImage} source={{ uri: dataContent.fImageBackgroundJSON[0][this.props.imageSetting].uri }}>
                                <Animated.View accessible={true} accessibilityLabel={'MallHomeHeaderOverlayView'} style={[style.overlay,{paddingVertical:0,marginVertical:0, height: '100%'} ]}>
                                    <Animated.Image source={require('../../core/asset/image/mall_top.png')} resizeMode={'stretch'} style={{position:'absolute',top:0, marginLeft:0, marginTop:-p, backgroundColor:'transparent',borderRadius:0, width:w, height:this._animW.interpolate({ inputRange: [0, 1], outputRange: [(w * 0.45 + SGHelperWindow.getStatusBarHeight())*0.35, w*0.35] }) }}></Animated.Image>
                                    <Animated.Image source={require('../../core/asset/image/mall_top.png')} resizeMode={'stretch'} style={{opacity:0.5, position:'absolute',top:0, marginLeft:0, marginTop:-p, backgroundColor:'transparent',borderRadius:0, width:w, height:this._animW.interpolate({ inputRange: [0, 1], outputRange: [(w * 0.45 + SGHelperWindow.getStatusBarHeight())*0.35, w*0.35] }) }}></Animated.Image>
                                    <Animated.Image source={require('../../core/asset/image/mall_bottom.png')} resizeMode={'stretch'} style={{position:'absolute',bottom:0, marginLeft:0, marginBottom:0, backgroundColor:'transparent',borderRadius:0, width:w, height:this._animW.interpolate({ inputRange: [0, 1], outputRange: [(w * 0.45 + SGHelperWindow.getStatusBarHeight())*0.55, w*0.6] }) }}></Animated.Image>
                                    <Animated.Image source={require('../../core/asset/image/mall_bottom.png')} resizeMode={'stretch'} style={{opacity:0.5,position:'absolute',bottom:0, marginLeft:0, marginBottom:0, backgroundColor:'transparent',borderRadius:0, width:w, height:this._animW.interpolate({ inputRange: [0, 1], outputRange: [(w * 0.45 + SGHelperWindow.getStatusBarHeight())*0.55, w*0.6] }) }}></Animated.Image>
                                </Animated.View>
                            </Image>
                        </Animated.View>
                    </View>
                    <Animated.View accessible={true} style={[style.placeDetailContainer,{marginTop:this._animW.interpolate({ inputRange: [0, 1], outputRange: [-27*p,-w*0.58]}), paddingTop:this._animW.interpolate({ inputRange: [0, 1], outputRange: [data.lastVisited !== null ?9*p:4*p,12*p] }),marginBottom:this._animW.interpolate({ inputRange: [0, 1], outputRange: [-3*p,0] }) }]}>
                        <View accessible={true} style={style.leftContainer}>
                            <Animated.View style={{width:this._animW.interpolate({ inputRange: [0, 1], outputRange: [0, w-8*p] }), }}>
                                <Text accessible={true} accessibilityLabel={'MallHomeHeaderBottomDataText'} preset={Text.preset.titleH1B} style={style.placeNameText} numberOfLines={1} >{(dataContent.fBuildingName).toUpperCase()}</Text>
                            </Animated.View>
                            <Animated.View style={{width:this._animW.interpolate({ inputRange: [0, 1], outputRange: [0, w-8*p] }), }}>
                                <Text accessible={true} accessibilityLabel={'MallHomeHeaderPlaceCategoryName'} preset={Text.preset.titleH3B} style={style.typeLocationText} numberOfLines={1}>{VisitorHelper.getLocalizeDataFromLookUp('BuildingCategory', data.buildingType, this._language)}, {VisitorHelper.getLocalizeDataFromLookUp('City', data.city, this._language)}</Text>                            
                            </Animated.View>
                            <Animated.View style={{width:this._animW.interpolate({ inputRange: [0, 1], outputRange: [0, w-8*p] }), }}>
                                <Text accessible={true} accessibilityLabel={'MallHomeHeaderShortDesc'} numberOfLines={1} preset={Text.preset.titleH3_5} style={style.lastVisitText} numberOfLines={2}>{dataContent.fShortDescription}</Text>                            
                            </Animated.View>
                            <Animated.View style={{width:this._animW.interpolate({ inputRange: [0, 1], outputRange: [(w-8*p)*0.3, 0]}),}}></Animated.View>
                            <Animated.View style={{width:this._animW.interpolate({ inputRange: [0, 1], outputRange: [(w-8*p)*0.7, w-8*p] }), }}>
                                <View style={style.leftContainer1}>
                                    <CardIconButtonFavorite luxury  onIconPressed={this.props.onFavorite} accessible={true} accessibilityLabel={'MallHomeHeaderFavoritesIcon'} textColor='white' navigator={this.props.navigator} contentType='Place' contentKey={data.buildingKey} active={data.fUserFavoriteThis} type={'favorite'} style={style.iconButton}></CardIconButtonFavorite>
                                    <CardIconButtonLike luxury onIconPressed={this.props.onLike} accessible={true} accessibilityLabel={'MallHomeHeaderLikeIcon'} likePackage={this._getLikeResource(data)} textColor='white' navigator={this.props.navigator} contentType='Place' contentKey={data.buildingKey} active={data.fUserLikedThis} type={'like'} style={style.iconButton} likeMallGetReward={this.props.likeMallGetReward}></CardIconButtonLike>
                                    <CardIconButtonComment luxury accessible={true} accessibilityLabel={'MallHomeHeaderCommentIcon'} commentPackage={this._getCommentResource(data)} textColor='white' navigator={this.props.navigator} contentType='Place' contentKey={data.buildingKey} canComment={data.fCanComment} type={'comment'} style={style.iconButton}></CardIconButtonComment>
                                    <CardIconButtonShare luxury shareParams={shareParams} img={dataContent.fImageJSON[0].thumbnailLow.uri} accessible={true} accessibilityLabel={'MallHomeHeaderShareIcon'} textColor='white' navigator={this.props.navigator} contentType='Place' contentKey={data.buildingKey} shareMessage={dataContent.fShareMessage} targetKey={data.buildingKey} type={'share'} style={style.iconButton} img={dataContent.fImageJSON[0][this.props.imageSetting].uri}  ></CardIconButtonShare>
                                    <CardIconButtonNotification luxury onIconPressed={this.props.onNotification} accessible={true} accessibilityLabel={'MallHomeHeaderNotificationIcon'} textColor='white' navigator={this.props.navigator} contentType='Place' contentKey={data.buildingKey} active={data.fUserNotificationThis} type={'notification'} style={style.iconButton}></CardIconButtonNotification>
                                    {(fullData.whatsapp !== '' && fullData.whatsapp !== '–' && fullData.whatsapp !== ' ' && fullData.whatsapp !== '-') &&
                                        <TouchableOpacity onPress={() => { this.whatsappEnjoyer(fullData.whatsapp) }}>
                                            <Image accessible={true} accessibilityLabel={'MallProfileScreenYTIconImage'} source={{ uri: image.iconWhatsapp[this.props.imageSetting].url }} style={style.iconwhatsapp}></Image>
                                        </TouchableOpacity>
                                    }
                                </View>                                
                            </Animated.View>
                        </View>
                    </Animated.View>

                    <Animated.View accessible={true} style={[style.checkInOutBtnContainer,{marginRight:this._animW.interpolate({ inputRange: [0, 1], outputRange: [-7*p, 0] }), top:this._animW.interpolate({ inputRange: [0, 1], outputRange: [w * 0.425 - 18*p + SGHelperWindow.getStatusBarHeight(), w * 0.38+ SGHelperWindow.getStatusBarHeight()] })} , { transform: [{scale:this._animW.interpolate({ inputRange: [0, 1], outputRange: [0.85,1] })},{ translateY: SGHelperType.isDefined(this.props.animVar) ? this.props.animVar.interpolate({ inputRange: [0, 1], outputRange: [0, -w * 0.23] }) : 0 }] }]}>
                        {isAlreadyCheckIn === true ?
                            (<CheckOutButton accessible={true} accessibilityLabel={'MallHomeHeaderCheckOutButton'} navigator={this.props.navigator} refreshCheckOut={this.props.refreshCheckOut} contentType='Place' contentKey={data.buildingKey}></CheckOutButton>)
                            :
                            (<CheckInButton accessible={true} accessibilityLabel={'MallHomeHeaderCheckInButton'} navigator={this.props.navigator} refresh={this.props.refresh} contentType='Place' contentKey={data.buildingKey} checkInReward={this.props.checkInReward} ></CheckInButton>)
                        }
                        <View style={style.vLastVisited}>
                            {data.lastVisited !== null &&
                                <Text accessible={true} accessibilityLabel={'MallHomeHeaderLastVisitedText'} preset={Text.preset.titleH6B} style={style.lastVisitText}>{(SGLocalize.translate("globalText.lastVisitedText"))} {VisitorHelper._decideDayText(data.lastVisited)}</Text>
                            }
                        </View>
                    </Animated.View>

                    <Animated.View accessible={true} style={[style.thumbnailContainer, {marginLeft:this._animW.interpolate({ inputRange: [0, 1], outputRange: [1*p, 4*p] }), top:this._animW.interpolate({ inputRange: [0, 1], outputRange: [w * 0.26 + 11 * p - 10*p + SGHelperWindow.getStatusBarHeight(), w * 0.235 + 11 * p + SGHelperWindow.getStatusBarHeight()] })} , { transform: [{scale: this._animW.interpolate({ inputRange: [0, 1], outputRange: [0.85,1] })},{ translateY: SGHelperType.isDefined(this.props.animVar) ? this.props.animVar.interpolate({ inputRange: [0, 1], outputRange: [0, -w * 0.2] }) : 0 }] }]}>

                        <TouchableOpacity onPress={() => { SGHelperNavigation.navigatePush(this.props.navigator, this.props.screen, { contentKey: data.buildingKey }) }} shadow>
                            <Image accessible={true} accessibilityLabel={'MallHomeHeaderLogoImage'} style={style.placeThumbnailImage} source={{ uri: dataContent.fImageJSON[0][this.props.imageSetting].uri }} ></Image>
                        </TouchableOpacity>

                    </Animated.View>

                    <TouchableOpacity onPress={this._changeHeader.bind(this)} style={style.arrowUp}>
                        <Icon name={this.state.show?Icon.Icon.arrowUp:Icon.Icon.arrowDown} preset={Icon.preset.h3} style={{color:'#FFFFFF'}}></Icon>
                    </TouchableOpacity>

                </View>
            </View>
        );
    }
}