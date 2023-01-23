/**
 * 1. Yohanes 01 April 2021
 * - add ErrorHandling
 * Version 1.2.0
 * 1. Leon, 4 May 2021
- Fix Like, Fix Favorite, Fix Notification
*/
import React from 'react';
import { StyleSheet, Linking, Animated, Platform } from 'react-native';
import { SGView as View, SGViewPager as ViewPager, SGPopView, SGScrollView as ScrollView, SGRootView as RootView, SGText as Text, SGImage as Image, SGTouchableOpacity as TouchableOpacity, SGTouchableOpacity, SGIcon as Icon, SGMapStatic, SGActivityIndicator as ActivityIndicator, SGWebView as WebView, SGButton as Button,SGDialogBox as DialogBox } from '../../../core/control';
import { SGBaseScreen } from '../../../core/screen/SGBaseScreen';
import { SGHelperNavigation, SGHelperGlobalVar, SGHelperWindow,SGHelperType, SGHelperErrorHandling } from '../../../core/helper';
import { RibbonHeader } from '../../component_V2/RibbonHeader';
import { SGLocalize } from '../../locales/SGLocalize';
import { BottomNavigationContainer } from '../../component_V2/BottomNavigationContainer';
import { CardIconButton,CardIconButtonLike,CardIconButtonFavorite,CardIconButtonNotification,CardIconButtonComment,CardIconButtonShare } from '../../component_V2/CardIconButton';
import image from '../../asset/image';
import { VMallProfileAPI } from '../../api/VMallProfileAPI';
import { tbLookupDAO } from '../../db/tbLookupDAO';
import idJSON from '../../locales/id.json';
import enJSON from '../../locales/en.json';
import cnJSON from '../../locales/cn.json';
import { VRewardAPI } from '../../api/VRewardAPI'
import { CustomMenuBar } from '../../component_V2/CustomMenuBar';
import { VisitorHelper } from '../../helper/VisitorHelper';
import { WebViewRender } from '../../component_V2/WebViewRender';

export class MallProfileScreen extends SGBaseScreen {
    createStyleSheet = (whp) => {
        var { w, h, p } = whp;
        return StyleSheet.create({
            throwWHP: { width: w, height: h, padding: p },
            mainContainer: { width: w, flex: 1, backgroundColor: '#FFFFFF', justifyContent: 'flex-start' },
            coverImageContainer: { width: w, backgroundColor: '#E2E2E2', position: 'absolute' },
            coverImage: { width: w, height: w * 0.6, resizeMode: 'cover', marginHorizontal: 0, marginVertical: 0, borderRadius: 0 },
            coverOverlay: { width: w, height: w * 0.6, backgroundColor: '#000000', opacity: 0.3 },
            scrollView: { width: w, backgroundColor: 'transparent', marginTop: 0, },
            scrollContainer: { width: w, justifyContent: 'flex-start', backgroundColor: 'transparent', },
            thumbnailContainer: { overflow: 'hidden', padding: 0, position: 'absolute', top: w * 0.235, backgroundColor: 'transparent', borderColor: 'rgb(230,230,230)', justifyContent: 'center', alignItems: 'center', },
            thumbnailImage: { width: w * 0.375, height: w * 0.375, resizeMode: 'contain', backgroundColor: '#FFFFFF', borderRadius: p * 3 },
            profileContainer:  { width: w, backgroundColor: '#FFFFFF', paddingTop: p * 12,  justifyContent: 'flex-start', alignItems: 'flex-start', borderTopLeftRadius: p * 5, borderTopRightRadius: p * 5 },
            profileDetailContainer: { width: w, alignContent: 'center', backgroundColor: '#FFFFFF' },
            nameText: { color: '#000000', marginBottom: p * 1.5 },
            likedText: { color: '#9D9D9D', marginBottom: p * 1.5 },
            websiteText: { color: '#7ED9FA', marginBottom: p * 3 },
            iconButttonContainer: { flexDirection: 'row' },
            profileInfoContainer: { flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start' },
            infoSectionContainer: { marginTop: p * 7, justifyContent: 'space-between' },
            infoSectionHeadingText: { marginBottom: p * 4,paddingLeft:5*p, alignSelf: 'flex-start', color: '#000000' },
            infoSectionDescContainer: { marginTop: p, width: w,paddingLeft:5*p,flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start' },
            operationHoursContainer: { width:w-p*2*7,flexDirection: 'row', justifyContent: 'space-between' },
            sectionDescText: { color: '#000000',  minWidth: w * 0.3 },
            operationalText:{color: '#000000', marginVertical: 0,minWidth:w*0.1},
            sectionDescTextProfile: { color: '#000000', paddingLeft:5*p, marginVertical: 2*p, minWidth: w * 0.3 },
            sectionDescLocText : { color: '#000000', textAlign:'justify', marginBottom: 3*p, minWidth: w * 0.3 },
            map: { width: w, height: w * 0.8 * 9 / 16, backgroundColor: 'transparent' },
            mapView: { width: w, height: w * 0.8 * 9 / 16, backgroundColor: 'transparent' },
            sliderContainer: { width: w, height: w * 1.15 * 9 / 16, backgroundColor: '#FFFFFF', marginTop: p * 4, borderRadius: 0 },
            sliderImage: { width: w, height: w * 9 / 16, resizeMode: 'cover', alignSelf: 'center', borderRadius: p * 3 },
            iconSliderContainer: { marginVertical: p * 2,paddingLeft:3*p },
            icon: { width: w * 0.13, height: w * 0.13, resizeMode: 'contain', backgroundColor: 'transparent', marginVertical: 0 },
            iconwhatsapp:{ width: w * 0.08, height: w * 0.08, resizeMode: 'contain', backgroundColor: 'transparent' },
            webView: { width: '100%' },
            //style popup reward

            rewardPV: { width: w - 12 * p, padding: p, borderRadius: 2 * p, backgroundColor: 'white', justifyContent: 'flex-start' },
            headerPV: { width: w - 22 * p, paddingVertical: 2 * p },
            textPV1: { color: '#484848' },
            textPV2: { color: '#858585' },
            textPV3: { color: '#484848', marginVertical: p,alignItems:'flex-start' },
            textPV4: { color: '#484848', alignSelf: 'flex-start', marginVertical: p,paddingLeft:4*p},
            imagePV: { width: w * 0.667, height: w * 0.375, padding: p, marginVertical: 2 * p },
            buttonPV: { backgroundColor: '#01BBA0', width: w * 0.38, height: w * 0.1, borderRadius: p,alignItems:'center',justifyContent:'center'},
            buttonViewPV: { flexDirection: 'row', justifyContent: 'space-around', width: w - 22 * p, marginVertical: 2 * p },
            // closeText : {color: 'red'}
        });
    }

    async componentDidMount() {
        await this._onRefreshAllItem();
        this._unsubscribe = this.props.navigation.addListener('focus', async () => {
            await this._onRefreshAllItem();
        });
    }
    componentWillUnmount() {
        if (this._unsubscribe) { this._unsubscribe(); }
    }

    async _onRefreshAllItem() {
    
        this.currentUserData = SGHelperGlobalVar.getVar('GlobalCurrentUserData');
        this.currentUser = SGHelperGlobalVar.getVar('GlobalCurrentUser');
        this.imageSetting = SGHelperGlobalVar.getVar('GlobalImageSetting');
        this.baseRunSingleAPIWithRedoOption('getBuildingHomeProfile', (async (v1) => { return VMallProfileAPI.getBuildingHomeProfile(v1) }).bind(this,this.placeKey), (async(v) => {
            this.data = v 
            console.log(v)
            this._checkImageData(this.data['fContent' + this.Language.toUpperCase()].fImageSlider);
            this.isAlreadyMount = true;
            this.forceUpdate();
        }).bind(this), null,  SGHelperGlobalVar.getVar("ResponTimes"));
    }

    handleOpenURL(event) {
        console.log(event.url);
        const route = e.url.replace(/.*?:\/\//g, '');
        // do something with the url, in our case navigate(route)
    }


    handleLink(url) {
        var valid = SGHelperType.validURL(url)
        if(valid){
        Linking.canOpenURL(url
        ).then(supported => {
            if ((SGHelperType.left(url, 8) != 'https://')) {
                Linking.openURL('https://' + url);
            } else {
                Linking.openURL(url);
            }
        });
        }else{
            DialogBox.showFail(null, SGLocalize.translate("globalText.FailText"), SGLocalize.translate('globalText.notSupportedLink'), SGLocalize.translate('globalText.ok'), () => { }, true);
        }
    };

    constructor(props, context, ...args) {
        super(props, context, ...args);
        this.style = this.createStyleSheet(this.WHP);
        this.props.navigation.setOptions({
            headerShown: false
        });
        this.data = '';
        this.currentUser = SGHelperGlobalVar.getVar('GlobalCurrentUser');
        this.currentUserData = SGHelperGlobalVar.getVar('GlobalCurrentUserData');
        this.imageSetting = SGHelperGlobalVar.getVar('GlobalImageSetting');
        this.currentUserImage = SGHelperGlobalVar.getVar('GlobalCurrentUserImage');
        this.placeKey = this.props.route.params.contentKey;
        this.pvID = SGPopView.getPopViewID();
        this.surpriseReward = { fID: null, fRewardID: { fTargetName: '', fShortDescription: '', fImageJSON: [] }, fRewardEN: { fTargetName: '', fShortDescription: '', fImageJSON: [] }, fRewardCN: { fTargetName: '', fShortDescription: '', fImageJSON: [] } }
        this.isAlreadyMount = false;
        this._animIcon = new Animated.Value(1);
        this.noImage = true;
    }

    _checkImageData(data){
        if(data[0][this.imageSetting].uri !== SGHelperType.getSystemParamsValue('DefaultImage')){
            console.log('masuk')
            this.noImage=false;
        }
    }

    showPopView(args) {
        SGPopView.showPopView(args[0]);
    }

    _getLikeResource(data) {
        var contentBuildingID = data.fContentID;
        var contentBuildingEN = data.fContentEN;
        var contentBuildingCN = data.fContentCN;
        return (
            { fContentType: 'Place', fContentKey: data.key, fText1: { id: contentBuildingID.fBuildingName, en: contentBuildingEN.fBuildingName, cn: contentBuildingCN.fBuildingName }, fText2: { id: idJSON.city[tbLookupDAO.getLookUpValue(data.city)], en: enJSON.city[tbLookupDAO.getLookUpValue(data.city)], cn: cnJSON.city[tbLookupDAO.getLookUpValue(data.city)] }, fText3: { id: '', en: '', cn: '' }, fImageID: contentBuildingID.fImageJSON, fImageEN: contentBuildingEN.fImageJSON, fImageCN: contentBuildingCN.fImageJSON, fTargetKey: data.key }
        )
    }

    _getCommentResource(data) {
        var contentBuildingID = data.fContentID;
        var contentBuildingEN = data.fContentEN;
        var contentBuildingCN = data.fContentCN;
        return (
            {
                fUserImage: this.currentUserData.fProfileImageJSON, fContentType: 'Place', fContentKey: data.key,
                fContentName: { id: contentBuildingID.fBuildingName, en: contentBuildingEN.fBuildingName, cn: contentBuildingCN.fBuildingName },
                fContentText1: { id: idJSON.city[tbLookupDAO.getLookUpValue(data.city)], en: enJSON.city[tbLookupDAO.getLookUpValue(data.city)], cn: cnJSON.city[tbLookupDAO.getLookUpValue(data.city)] },
                fContentText2: { id: contentBuildingID.fShortDescription, en: contentBuildingEN.fShortDescription, cn: contentBuildingCN.fShortDescription },
                fContentImage: { id: contentBuildingID.fImageJSON, en: contentBuildingEN.fImageJSON, cn: contentBuildingCN.fImageJSON },
                fTargetType: 'Place', fTargetName: { id: contentBuildingID.fBuildingName, en: contentBuildingEN.fBuildingName, cn: contentBuildingCN.fBuildingName },
                fTargetImage: { id: contentBuildingID.fImageJSON, en: contentBuildingEN.fImageJSON, cn: contentBuildingCN.fImageJSON },
                fTargetKey: data.key
            }
        )
    }
    onScrollHandler(v) {
        var { w, h, p } = this.WHP;
        var y = v.nativeEvent.contentOffset.y;
        this._animIcon.setValue(Math.pow(Math.max(0, w * 0.5 - y) / (w * 0.5), 2));
    }

    onHideReward() {
        SGPopView.hidePopView(this.pvID);
    }
    onShowReward() {
        this.forceUpdate()
        SGPopView.showPopView(this.pvID);

    }
    async _SurpriseRewardLikeMall(buildingKey) {
        try {
            if (!SGHelperGlobalVar.getVar('GlobalAnonymous')) {
                this.surpriseReward = await VRewardAPI.SurpriseRewardLikeMall(buildingKey)
                if (this.surpriseReward.fID !== null) {
                    this.onShowReward()
                } else this.surpriseReward = { fID: null, fRewardID: { fTargetName: '', fShortDescription: '', fImageJSON: [] }, fRewardEN: { fTargetName: '', fShortDescription: '', fImageJSON: [] }, fRewardCN: { fTargetName: '', fShortDescription: '', fImageJSON: [] } }
    
            }
        } catch (error) {
            SGHelperErrorHandling.Handling(error,this._SurpriseRewardLikeMall.bind(this))
        }
        
    }
    async _SurpriseRewardLikeMall(buildingKey) {
        try {
            if (!SGHelperGlobalVar.getVar('GlobalAnonymous')) {
                this.surpriseReward = await VRewardAPI.SurpriseRewardLikeMall(buildingKey)
                if (this.surpriseReward.fID !== null) {
                    this.onShowReward()
                } else this.surpriseReward = { fID: null, fRewardID: { fTargetName: '', fShortDescription: '', fImageJSON: [] }, fRewardEN: { fTargetName: '', fShortDescription: '', fImageJSON: [] }, fRewardCN: { fTargetName: '', fShortDescription: '', fImageJSON: [] } }
    
            }
        } catch (error) {
            SGHelperErrorHandling.Handling(error,this._SurpriseRewardLikeMall.bind(this))
        }
        
    }

    whatsappEnjoyer(data){
    try{
        console.log(data);
        var checkTrueData = true;

        // cek nomor whatsapp depanny ap
        if(data[0] == '+') var trueData = data.replace('+62','');
        else if (data[0] == '0') var trueData = data.replace('0','');
        else if (data[0] == '6') var trueData = data.replace('62','');
        else {
            var trueData = data;
            checkTrueData = false;
        }

        if (typeof String.prototype.replaceAll == "undefined") {  
            String.prototype.replaceAll = function(match, replace) {  
                return this.replace(new RegExp(match, 'g'), () => replace);  
            }  
        }

        // kalo format nomor whatsapp bener
        if(checkTrueData){
            trueData = trueData.replaceAll('-','');
            trueData = trueData.replaceAll(' ','');
            trueData = trueData.replaceAll('–','');
        }

        // this.handleLink.bind(this, this.data.whatsapp);
        this.handleLink('https://wa.me/62'+trueData);
        console.log(trueData);
    } catch {
        console.log('WHATSAPP NOT FOUND KEKW');
    }
    }

    render() {
        var { w, h, p } = this.WHP;
        var style = this.style;
        var data = this.data;
        var dataContent = this.data['fContent' + this.Language.toUpperCase()];
        var language = this.Language.toUpperCase()
        var surpriseReward = this.surpriseReward;
        var tR = SGLocalize.translate
        var shareParams = {MallName:data['fBuildingName'+this.Language.toUpperCase()]}
        return (
            <RootView dummyHeaderBar accessible={true} accessibilityLabel={'MallProfileScreenRootView'} style={style.mainContainer}>
                <SGPopView accessible={true} accessibilityLabel={'MallHomeScreenPopView'} vPos={'Top'} animationType={'slideUp'} modal popViewID={this.pvID} >
                    <View accessible={true} accessibilityLabel={'MallHomeScreenRewardView'} style={style.rewardPV}>
                        <View accessible={true} accessibilityLabel={'MallHomeScreenHeaderRewardView'} style={style.headerPV}>
                            <Text accessible={true} accessibilityLabel={'MallHomeScreenCongratsText'} style={style.textPV1} preset={Text.preset.titleH2B}>{tR('mallHomeScreen.RewardCongratulation')}</Text>
                            <Text accessible={true} accessibilityLabel={'MallHomeScreenRewardText'} style={style.textPV2} preset={Text.preset.titleH4_5B}>{tR('mallHomeScreen.RewardText')} {surpriseReward['fReward' + language].fTargetName}</Text>
                            <Image accessible={true} accessibilityLabel={'MallHomeScreenRewardImage'} style={style.imagePV} source={{ uri: surpriseReward['fReward' + language].fImageJSON.length !== 0 ? surpriseReward['fReward' + language].fImageJSON[0][this.imageSetting].uri : '' }}></Image>
                            <Text accessible={true} accessibilityLabel={'MallHomeScreenRewardName'} style={style.textPV3} preset={Text.preset.titleH3B}>{surpriseReward['fReward' + language].fRewardName}</Text>
                            <Text accessible={true} accessibilityLabel={'MallHomeScreenShortDesc'} style={style.textPV4} preset={Text.preset.titleH4}>{surpriseReward['fReward' + language].fShortDescription}</Text>
                            <View accessible={true} accessibilityLabel={'MallHomeScreenButtonView'} style={style.buttonViewPV}>
                                <Button accessible={true} accessibilityLabel={'MallHomeScreenOkButton'} style={style.buttonPV} textPreset={Text.preset.titleH4_5B} label={tR('mallHomeScreen.Okay')} onPress={() => this.onHideReward(this.pvID)}></Button>
                                <Button accessible={true} accessibilityLabel={'MallHomeScreenMyRewardsButton'} style={style.buttonPV} textPreset={Text.preset.titleH4_5B} label={tR('mallHomeScreen.MyRewards')} onPress={() => { this.onHideReward(this.pvID); SGHelperNavigation.navigatePush(this.props.navigation, 'MyRewards') }}></Button>
                            </View>
                        </View>
                    </View>
                </SGPopView>
                {this.isAlreadyMount ?
                    this.data !== '' ?
                        (<View accessible={true} style={style.mainContainer}>
                            <View accessible={true} style={style.coverImageContainer}>
                                <Image accessible={true} accessibilityLabel={'MallProfileScreenBackgroundImage'} style={style.coverImage} source={{ uri: dataContent.fImageBackgroundJSON[0][this.imageSetting].uri }}>
                                    <View accessible={true} style={style.coverOverlay}></View>
                                </Image>
                            </View>
                            <View style={{ width: w, flex: 1, backgroundColor: 'transparent' }}>
                                <ScrollView dummyFooterBar dummyBottomBar bounces={false} accessible={true} accessibilityLabel={'MallProfileScreenScrollView'} style={style.scrollView} contentContainerStyle={style.scrollContainer} scrollEventThrottle={16} onScroll={(v) => { this.onScrollHandler(v); this.baseOnScrollHandler(v); }} onMomentumScrollBegin={this.baseOnMomentumScrollBeginHandler.bind(this)} onScrollEndDrag={this.baseOnScrollEndDragHandler.bind(this)} onMomentumScrollEnd={this.baseOnMomentumScrollEndHandler.bind(this)} showsVerticalScrollIndicator={false}>
                                    <View style={{ width: w, height: w * 0.55 }}></View>
                                    <View accessible={true} style={style.profileContainer}>
                                        <View accessible={true} style={style.profileDetailContainer}>
                                            <Text accessible={true} accessibilityLabel={'MallProfileScreenPlaceName'} preset={Text.preset.titleH1B} style={style.nameText}>{(dataContent.fBuildingName).toUpperCase()}</Text>
                                            <Text accessible={true} accessibilityLabel={'MallProfileScreenLikeCount'} preset={Text.preset.titleH4B} style={style.likedText}>{this.data.fLikeCount} {SGLocalize.translate('globalText.likeCountText')}</Text>
                                            <TouchableOpacity onPress={() => this.handleLink(data.linkWebsite)}>
                                                <Text accessible={true} accessibilityLabel={'MallProfileScreenWebText'} style={style.websiteText} preset={Text.preset.titleH4_5B}>{SGLocalize.translate('mallProfileScreen.websiteText', { name: dataContent.fBuildingName })}</Text>
                                            </TouchableOpacity>
                                            <View accessible={true} accessibilityLabel={'MallProfileScreenIconButtonView'} style={style.iconButttonContainer}>
                                                <CardIconButtonFavorite onIconPressed={((item, s)=>{console.log(item);  item.fUserFavoriteThis = s; this.forceUpdate();}).bind(this, this.data)} accessible={true} accessibilityLabel={'MallProfileScreenFavoriteIcon'} textColor='white' navigator={this.props.navigation} contentType='Place' contentKey={this.placeKey} active={this.data.fUserFavoriteThis} type={'favorite'} ></CardIconButtonFavorite>
                                                <CardIconButtonLike onIconPressed={((item, s,c)=>{console.log(item);  item.fUserLikedThis = s; item.fLikeCount+=c; this.forceUpdate();}).bind(this, this.data)} accessible={true} accessibilityLabel={'MallProfileScreenLikeIcon'} likePackage={this._getLikeResource(this.data)} textColor='white' navigator={this.props.navigation} contentType='Place' contentKey={this.placeKey} active={this.data.fUserLikedThis} type={'like'} likeMallGetReward={async () => await this._SurpriseRewardLikeMall(this.placeKey)}></CardIconButtonLike>
                                                <CardIconButtonComment accessible={true} accessibilityLabel={'MallProfileScreenCommentIcon'} commentPackage={this._getCommentResource(this.data)} textColor='white' navigator={this.props.navigation} contentType='Place' contentKey={this.placeKey} canComment={data.fCanComment} type={'comment'} ></CardIconButtonComment>
                                                <CardIconButtonShare shareParams={shareParams} img={dataContent.fImageJSON[0].thumbnailLow.uri} accessible={true} accessibilityLabel={'MallProfileScreenShareIcon'} textColor='white' navigator={this.props.navigation} contentType='Place' contentKey={this.placeKey} shareMessage={dataContent.fShareMessage} targetKey={this.placeKey} type={'share'} ></CardIconButtonShare>
                                                <CardIconButtonNotification onIconPressed={((item, s)=>{ console.log(item);  item.fUserNotificationThis = s; this.forceUpdate();}).bind(this, this.data)}  accessible={true} accessibilityLabel={'MallProfileScreenNotificationIcon'} textColor='white' navigator={this.props.navigation} contentType='Place' contentKey={this.placeKey} active={this.data.fUserNotificationThis} type={'notification'} ></CardIconButtonNotification>
                                            </View>
                                        </View>
                                        {/* HOURS */}
                                        <View accessible={true} style={style.profileInfoContainer}>
                                            <View accessible={true} style={style.infoSectionContainer}>
                                                <Text accessible={true} style={style.infoSectionHeadingText} preset={Text.preset.titleH2B}>{SGLocalize.translate('mallProfileScreen.opHours')}</Text>
                                                <View accessible={true} style={style.infoSectionDescContainer}>
                                                    {(data.opHours).map((x, index) => {
                                                        return (
                                                            x.fActive === 'Y' ?
                                                                (<View accessible={true} style={style.operationHoursContainer}>
                                                                    <Text accessible={true} accessibilityLabel={'MallProfileScreenDayName'} style={style.sectionDescText} preset={Text.preset.titleH3}>{SGLocalize.translate('dayName.' + x.day)}</Text>
                                                                    <View style={{flexDirection:'row'}}>
                                                                    <Text accessible={true} accessibilityLabel={'MallProfileScreenHourText'} style={style.operationalText} preset={Text.preset.titleH3}>{SGHelperType.formatTime(SGHelperType.convertNewDate(x.openTime))}</Text>
                                                                    <Text accessible={true} accessibilityLabel={'MallProfileScreenHourText'} preset={Text.preset.titleH3B}>-</Text>
                                                                    <Text accessible={true} accessibilityLabel={'MallProfileScreenHourText'} style={style.operationalText} preset={Text.preset.titleH3}>{SGHelperType.formatTime(SGHelperType.convertNewDate(x.closeTime))}</Text>
                                                                    </View>
                                                                </View>)
                                                                :
                                                                (<View accessible={true} style={style.operationHoursContainer}>
                                                                    <Text accessible={true} accessibilityLabel={'MallProfileScreenDayName'} style={style.sectionDescText} preset={Text.preset.titleH3}>{SGLocalize.translate('dayName.' + x.day)}</Text>
                                                                    <View style={{width:w*0.3,justifyContent:'center'}}> 
                                                                    <Text accessible={true} accessibilityLabel={'MallProfileScreenHourText'} style={style.closeText} preset={Text.preset.titleH3}>{SGLocalize.translate('mallProfileScreen.closedText')}</Text>
                                                                    </View>
                                                                </View>)
                                                        )
                                                    })}
                                                </View>
                                            </View>
                                            {/* CONTACTS */}
                                            <View accessible={true} style={style.infoSectionContainer}>
                                                <Text accessible={true} accessibilityLabel={'MallProfileScreenPhoneNumbTitle'} style={style.infoSectionHeadingText} preset={Text.preset.titleH2B}>{SGLocalize.translate('storeProfileScreen.contacts')}</Text>
                                                <View accessible={true} style={style.infoSectionDescContainer}>
                                                    <Text accessible={true} accessibilityLabel={'MallProfileScreenPhoneNumbText'} style={style.sectionDescText} preset={Text.preset.titleH3}>{data.phoneNumber}</Text>
                                                    <Text accessible={true} accessibilityLabel={'MallProfileScreenEmailText'} style={style.contentTextBlue} preset={Text.preset.titleH3}>{data.email}</Text>
                                                    {data.whatsapp !== '' &&
                                                    <TouchableOpacity style={{zIndex: 9}} onPress={() => {this.whatsappEnjoyer(data.whatsapp)}}>
                                                        <View style={{flexDirection:'row'}}> 
                                                            <Image accessible={true} accessibilityLabel={'MallProfileScreenYTIconImage'} source={{ uri: image.iconWhatsapp[this.imageSetting].url }} style={style.iconwhatsapp}></Image>
                                                            <Text accessible={true} accessibilityLabel={'StoreProfileScreenEmailText'} style={style.sectionDescText} preset={Text.preset.titleH3}>{data.whatsapp}</Text>
                                                        </View>
                                                    </TouchableOpacity>
                                                    } 
                                                </View>
                                            </View>
                                            {/* LOCATION  */}
                                            <View accessible={true} style={style.infoSectionContainer}>
                                                <Text accessible={true} accessibilityLabel={'MallProfileScreenLocTitle'} style={style.infoSectionHeadingText} preset={Text.preset.titleH2B}>{SGLocalize.translate('restoProfileScreen.location')}</Text>
                                                <View accessible={true} style={{width:w,justifyContent:'flex-start'}}>
                                                    <Text accessible={true} accessibilityLabel={'MallProfileScreenLocAddressText'} style={style.infoSectionHeadingText} preset={Text.preset.titleH3}>{this.data.address}</Text>
                                                    <SGMapStatic accessible={true} accessibilityLabel={'MallProfileScreenMapStatic'} imageStyle={style.map} style={style.mapView} shadow shadowIntensity={0.5} latitude={this.data.latitude} longitude={this.data.longitude} resolution={SGMapStatic.resolution['med']} />
                                                </View>
                                            </View>
                                            {/* OUR STORY  */}
                                            <View accessible={true} style={style.infoSectionContainer}>
                                                <Text accessible={true} accessibilityLabel={'MallProfileScreenBookTitle'} style={style.infoSectionHeadingText} preset={Text.preset.titleH2B}>{SGLocalize.translate('mallProfileScreen.DescTitle')}</Text>
                                                {this.noImage !== true &&
                                                <ViewPager accessible={true} accessibilityLabel={'MallProfileScreenBookViewPager'} style={style.sliderContainer} initialPage={0} showPageIndicator={true} transitionStyle={'scroll'} pageIndicatorStyle={{ position: 'absolute', bottom: 0 * p, flexDirection: 'row', alignSelf: 'center' }}>
                                                    {(dataContent.fImageSlider).map((x, index) => {
                                                        return (
                                                            <View accessible={true} accessibilityLabel={'MallProfileScreenBookImageView'} key={x.key} style={{ justifyContent: 'flex-start' }}>
                                                                {x[this.imageSetting].uri !== SGHelperType.getSystemParamsValue('DefaultImage') &&
                                                                    <Image accessible={true} accessibilityLabel={'MallProfileScreenBookImage'} style={style.sliderImage} source={{ uri: x[this.imageSetting].uri }}></Image>
                                                                }
                                                            </View>
                                                        )
                                                    })}
                                                </ViewPager>
                                                }
                                            </View>
                                            
                                            {dataContent.fTypeDetail === 'longdescription' ?
                                                (<Text accessible={true} accessibilityLabel={'MallProfileScreenBookDescText'} style={style.sectionDescTextProfile} preset={Text.preset.titleH3}>{dataContent.fLongDescription}</Text>)
                                                :
                                                (null)
                                            }
                                            {dataContent.fTypeDetail === 'url' && dataContent.fURL !== '' ?
                                                <View style={{width:w,height:h}}> 
                                                    <WebViewRender nestedScrollEnabled={true} data={dataContent.fURL } style={style.throwWHP} fType='url'></WebViewRender>
                                                </View>
                                            
                                                :
                                                (null)
                                            }
                                            {dataContent.fTypeDetail === 'html' && dataContent.fHTML !== '' ?
                                                <View style={{width:w,height:h}}> 
                                                    <WebViewRender nestedScrollEnabled={true} data={dataContent.fHTML } style={style.throwWHP} fType='html'></WebViewRender>
                                                </View>
                                                :
                                                (null)
                                            }
                                        </View>
                                        <ScrollView accessible={true} accessibilityLabel={'MallProfileScreenSocmedIconView'} showsHorizontalScrollIndicator={false} style={style.iconSliderContainer} contentContainerStyle={{ justifyContent: 'center', alignItems: 'center' }} horizontal>
                                        {SGHelperType.validURL(this.data.linkFacebook) ?
                                                (<TouchableOpacity onPress={this.handleLink.bind(this, this.data.linkFacebook)}>
                                                    <Image accessible={true} accessibilityLabel={'MallProfileScreenFBIconImage'} source={{ uri: image.iconFacebook[this.imageSetting].url }} style={style.icon}></Image>
                                                </TouchableOpacity>)
                                                :
                                                (null)
                                            }
                                            {SGHelperType.validURL(this.data.linkInstagram) ?
                                                (<TouchableOpacity onPress={this.handleLink.bind(this, this.data.linkInstagram)}>
                                                    <Image accessible={true} accessibilityLabel={'MallProfileScreenIGIconImage'} source={{ uri: image.iconInstagram[this.imageSetting].url }} style={style.icon}></Image>
                                                </TouchableOpacity>)
                                                :
                                                (null)
                                            }
                                            {SGHelperType.validURL(this.data.linkTwitter) ?
                                                (<TouchableOpacity onPress={this.handleLink.bind(this, this.data.linkTwitter)}>
                                                    <Image accessible={true} accessibilityLabel={'MallProfileScreenTwitIconImage'} source={{ uri: image.iconTwitter[this.imageSetting].url }} style={style.icon}></Image>
                                                </TouchableOpacity>)
                                                :
                                                (null)
                                            }
                                            {SGHelperType.validURL(this.data.linkYoutube) ?
                                                (<TouchableOpacity onPress={this.handleLink.bind(this, this.data.linkYoutube)}>
                                                    <Image accessible={true} accessibilityLabel={'MallProfileScreenYTIconImage'} source={{ uri: image.iconYoutube[this.imageSetting].url }} style={style.icon}></Image>
                                                </TouchableOpacity>)
                                                :
                                                (null)
                                            }
                                            {SGHelperType.validURL(this.data.linkLinkedIn) ?
                                                (<TouchableOpacity onPress={this.handleLink.bind(this, this.data.linkLinkedIn)}>
                                                    <Image accessible={true} accessibilityLabel={'MallProfileScreenYTIconImage'} source={{ uri: image.iconLinked[this.imageSetting].url }} style={style.icon}></Image>
                                                </TouchableOpacity>)
                                                :
                                                (null)
                                            }
                                            {/* {SGHelperType.validURL(this.data.whatsapp) ?
                                                (<TouchableOpacity onPress={this.handleLink.bind(this, this.data.whatsapp)}>
                                                    <Image accessible={true} accessibilityLabel={'MallProfileScreenYTIconImage'} source={{ uri: image.iconWhatsapp[this.imageSetting].url }} style={style.icon}></Image>
                                                </TouchableOpacity>)
                                                :
                                                (null)
                                            } */}
                                            {SGHelperType.validURL(this.data.line) ?
                                                (<TouchableOpacity onPress={this.handleLink.bind(this, this.data.line)}>
                                                    <Image accessible={true} accessibilityLabel={'MallProfileScreenYTIconImage'} source={{ uri: image.iconLine[this.imageSetting].url }} style={style.icon}></Image>
                                                </TouchableOpacity>)
                                                :
                                                (null)
                                            }
                                            {SGHelperType.validURL(this.data.linkTripAdvisor) ?
                                                (<TouchableOpacity onPress={this.handleLink.bind(this, this.data.linkTripAdvisor)}>
                                                    <Image accessible={true} accessibilityLabel={'MallProfileScreenYTIconImage'} source={{uri: image.iconTripAdvisor[this.imageSetting].url }} style={style.icon}></Image>
                                                </TouchableOpacity>)
                                                :
                                                (null)
                                            }
                                            {SGHelperType.validURL(this.data.linkAppStore) && Platform.OS==='ios'?
                                                (<TouchableOpacity onPress={this.handleLink.bind(this, this.data.linkAppStore)}>
                                                    <Image accessible={true} accessibilityLabel={'MallProfileScreenYTIconImage'} source={{ uri: image.iconAppStore[this.imageSetting].url }} style={style.icon}></Image>
                                                </TouchableOpacity>)
                                                :
                                                (null)
                                            }
                                            {SGHelperType.validURL(this.data.linkPlayStore) && Platform.OS==='android'?
                                                (<TouchableOpacity onPress={this.handleLink.bind(this, this.data.linkPlayStore)}>
                                                    <Image accessible={true} accessibilityLabel={'MallProfileScreenYTIconImage'} source={{ uri: image.iconPlayStore[this.imageSetting].url }} style={style.icon}></Image>
                                                </TouchableOpacity>)
                                                :
                                                (null)
                                            }
                                        </ScrollView>
                                    </View>
                                </ScrollView>
                            </View>
                            <Animated.View accessible={true} style={[style.thumbnailContainer, { width: this._animIcon.interpolate({ inputRange: [0, 1], outputRange: [w * 0.375, w * 0.425] }), height: this._animIcon.interpolate({ inputRange: [0, 1], outputRange: [w * 0.375, w * 0.425] }), borderRadius: this._animIcon.interpolate({ inputRange: [0.25, 1], outputRange: [w * 0.25, 3 * p] }), borderWidth: this._animIcon.interpolate({ inputRange: [0, 0.35], outputRange: [3, 0] }), transform: [{ scale: this._animIcon.interpolate({ inputRange: [0, 1], outputRange: [0.5, 1] }) }, { translateX: this._animIcon.interpolate({ inputRange: [0, 1], outputRange: [w * 0.75, 0] }) }, { translateY: this._animIcon.interpolate({ inputRange: [0, 1], outputRange: [-w * 0.4, 0] }) }] }]}>
                                <Image accessible={true} accessibilityLabel={'RestoProfileScreenLogoImage'} source={{ uri: dataContent.fImageJSON[0][this.imageSetting].uri }} style={style.thumbnailImage}></Image>
                            </Animated.View>
                        </View>)
                        :
                        (null)
                    :
                    (<ActivityIndicator preset={ActivityIndicator.preset.h1} style={{ flex: 1 }}></ActivityIndicator>)
                }
                <Animated.View style={{ position: 'absolute', transform: [{ translateY: this._baseAnimY.interpolate({ inputRange: [-1, 0], outputRange: [(SGHelperWindow.getStatusBarHeight() - SGHelperWindow.getHeaderHeight()), SGHelperWindow.getStatusBarHeight()] }) },], height: SGHelperWindow.getHeaderHeight(), width: '100%' }}>
                    <CustomMenuBar btnBack accessible={true} accessibilityLabel={'HomeScreenHeader'} currentUser={this.currentUser} navigator={this.props.navigation} imageSetting={this.imageSetting} style={style.throwWHP}></CustomMenuBar>
                </Animated.View>
                <View style={{ position: 'absolute', height: SGHelperWindow.getStatusBarHeight(), backgroundColor: '#181818', width: '100%' }}></View>
                <Animated.View style={{ position: 'absolute', transform: [{ translateY: this._baseAnimY.interpolate({ inputRange: [-1, 0], outputRange: [SGHelperWindow.getWHPNoHeader().h + 8 * p, SGHelperWindow.getWHPNoHeader().h - Math.max(SGHelperWindow.getFooterHeight(), 2 * p) - SGHelperWindow.getHeaderHeight()] }) },], height: Math.max(SGHelperWindow.getFooterHeight(), 2 * p) + SGHelperWindow.getHeaderHeight(), width: '100%' }}>
                    <BottomNavigationContainer accessible={true} accessibilityLabel={'StoreProfileScreenBottomNav'} navigator={this.props.navigation} style={style.throwWHP}></BottomNavigationContainer>
                </Animated.View>
            </RootView>
        );
    }
}
