/*
* 1. Leon 12 Apr 2021
* - add ErrorHandling
 * Version 1.2.0
 * 1. Leon, 4 May 2021
  - Fix Like, Fix Favorite, Fix Notification
*/
import React from 'react';
import { StyleSheet, Linking, Animated, Platform } from 'react-native';
import { SGView as View, SGViewPager as ViewPager, SGPopView, SGScrollView as ScrollView, SGRootView as RootView, SGText as Text, SGImage as Image, SGTouchableOpacity as TouchableOpacity, SGTouchableOpacity, SGIcon as Icon, SGMapStatic, SGActivityIndicator as ActivityIndicator,SGDialogBox as DialogBox,SGWebView as WebView,SGDragView,SGPanZoomView } from '../../../core/control';
import { SGBaseScreen } from '../../../core/screen/SGBaseScreen';
import { SGHelperNavigation, SGHelperGlobalVar, SGHelperWindow,SGHelperType, SGHelperErrorHandling } from '../../../core/helper';
import { RibbonHeader } from '../../component_V2/RibbonHeader';
import { SGLocalize } from '../../locales/SGLocalize';
import { BottomNavigationContainer } from '../../component_V2/BottomNavigationContainer';
import { CardIconButton,CardIconButtonLike,CardIconButtonFavorite,CardIconButtonNotification,CardIconButtonComment,CardIconButtonShare } from '../../component_V2/CardIconButton';
import image from '../../asset/image';
import { VStoreProfileAPI } from '../../api/VStoreProfileAPI';
import { tbLookupDAO } from '../../db/tbLookupDAO';
import { CustomMenuBar } from '../../component_V2/CustomMenuBar';
import { toHumanSize } from 'i18n-js';
import idJSON from '../../locales/id.json';
import enJSON from '../../locales/en.json';
import cnJSON from '../../locales/cn.json';
import { VisitorHelper } from '../../helper/VisitorHelper';
import { WebViewRender } from '../../component_V2/WebViewRender';

export class StoreProfileScreen extends SGBaseScreen {
    createStyleSheet = (whp) => {
        var { w, h, p } = whp;
        return StyleSheet.create({
            throwWHP: { width: w, height: h, padding: p },
            mainContainer: { width: w, flex: 1, backgroundColor: '#FFFFFF', justifyContent: 'flex-start' },
            header: { width: w, backgroundColor: '#E2E2E2', position: 'absolute' },
            imageBackground: { width: w, height: w * 0.6, resizeMode: 'cover', marginHorizontal: 0, marginVertical: 0, borderRadius: 0 },
            overlay: { width: w, height: w * 0.6, backgroundColor: '#000000', opacity: 0.3 },
            scrollView: { width: w, backgroundColor: 'transparent', marginTop: 0, },
            scrollContainer: { width: w, justifyContent: 'flex-start', backgroundColor: 'transparent', },
            thumbnailContainer: { overflow: 'hidden', padding: 0, position: 'absolute', top: w * 0.235, backgroundColor: 'transparent', borderColor: 'rgb(230,230,230)', justifyContent: 'center', alignItems: 'center', },
            thumbnailImage: { width: w * 0.375, height: w * 0.375, resizeMode: 'contain', backgroundColor: '#FFFFFF', borderRadius: p * 4 },
            storeProfileContainer: { width: w, backgroundColor: '#FFFFFF', paddingTop: p * 12,  justifyContent: 'flex-start', alignItems: 'flex-start', borderTopLeftRadius: p * 5, borderTopRightRadius: p * 5 },
            profileDetailContainer: { width: w, alignContent: 'center', backgroundColor: '#FFFFFF' },
            storeNameText: { color: '#000000', marginBottom: p * 1.5 },
            likedText: { color: '#9D9D9D', marginBottom: p * 1.5 },
            websiteText: { color: '#7ED9FA', marginBottom: p * 3 },
            iconButtonView: { flexDirection: 'row' },
            profileInfoContainer: { flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start' },
            infoSectionContainer: { marginTop: p * 7, justifyContent: 'space-between' },
            infoSectionHeadingText: { marginBottom: p * 4,paddingLeft:5*p, alignSelf: 'flex-start', color: '#000000' },
            infoSectionDescContainer: { marginTop: p, width: w,paddingLeft:5*p,flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start' },
            operationHoursContainer: { width:w-p*2*7,flexDirection: 'row', justifyContent: 'space-between' },
            sectionDescText: { color: '#000000',  minWidth: w * 0.3 },
            operationalText:{color: '#000000', minWidth:w*0.1},
            sliderContainer: { width: w, height: w * 1.15 * 9 / 16, backgroundColor: '#FFFFFF', marginTop: p * 4, borderRadius: 0 },
            sliderImage: { width: w, height: w * 9 / 16, resizeMode: 'cover', alignSelf: 'center', borderRadius: p * 3 },
            descriptionText: { width: w, color: '#000000', paddingLeft:5*p,marginVertical:2*p },
            iconSliderContainer: { marginVertical: p * 2,paddingLeft:3*p },
            icon: { width: w * 0.13, height: w * 0.13, resizeMode: 'contain', backgroundColor: 'transparent', marginVertical: 0 },
            iconwhatsapp:{ width: w * 0.08, height: w * 0.08, resizeMode: 'contain', backgroundColor: 'transparent' },
            webView: {width: '100%',height:'100%' },
            psv1: { width: w, height:w*0.75, borderWidth: 2, borderColor: 'rgb(150,150,150)' },
            psv1FS: { width: w, height:h, borderWidth: 2, borderColor: 'rgb(150,150,150)' },
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
        this.storeKey = this.props.route.params.contentKey;
        this.baseRunSingleAPIWithRedoOption('getStoreHomeProfile', (async (v1) => { return VStoreProfileAPI.getStoreHomeProfile(v1) }).bind(this,this.storeKey), ((v) => {
            this.data = v 
            this._checkImageData(this.data['fContent' + this.Language.toUpperCase()].fLocationImageJSON,1);
            this._checkImageData(this.data['fContent' + this.Language.toUpperCase()].fImageSlider,2);
            this.showBar=true
            this.forceUpdate();
        }).bind(this), null,  SGHelperGlobalVar.getVar("ResponTimes"));
    }

    constructor(props, context, ...args) {
        super(props, context, ...args);
        this.style = this.createStyleSheet(this.WHP);
        this.props.navigation.setOptions({
            headerShown: false,
        });
        this.data = '';
        this.currentUser = SGHelperGlobalVar.getVar('GlobalCurrentUser');
        this.currentUserData = SGHelperGlobalVar.getVar('GlobalCurrentUserData');
        this.imageSetting = SGHelperGlobalVar.getVar('GlobalImageSetting');
        this.currentUserImage = SGHelperGlobalVar.getVar('GlobalCurrentUserImage');
        this.storeKey = this.props.route.params.contentKey;
        this._animIcon = new Animated.Value(1);
        this.noImageLocation = true;
        this.noImageStory = true;
        this.showBar=false
        this.fPosXY = [];
        this._logo = require('../../asset/icon_location.gif')
    }

    _checkImageData(data,type){
        console.log(data[0][this.imageSetting].uri)
        if(data[0][this.imageSetting].uri !== SGHelperType.getSystemParamsValue('DefaultImage')){
           if(type == 1){
            this.noImageLocation = false;
           }else if(type ==2){
            this.noImageStory = false;
           }
        }
}

    handleLink(url) {
        var valid = SGHelperType.validURL(url)
        console.log(url);
        console.log(valid);
        if(valid){
        Linking.canOpenURL(url
        ).then(supported => {
            if (supported) {
                Linking.openURL(url);
            } else {
                DialogBox.showWebView(url,()=>{});   
                // DialogBox.showWarning(null,SGLocalize.translate("AlertMessage.Fail"),SGLocalize.translate("AlertMessage.AlertHandleLink"),SGLocalize.translate("AlertMessage.OK"),()=>{},true,{label: url,url:url})
                // console.log("Don't know how to open URI: " + url);
            }
        });
        }else{
            DialogBox.showFail(null, SGLocalize.translate("globalText.FailText"), SGLocalize.translate('globalText.notSupportedLink'), SGLocalize.translate('globalText.ok'), () => { }, true);
        }
    };

    showPopView(args) {
        SGPopView.showPopView(args[0]);
    }

    _opHourConverter(time) {
        var x = SGHelperType.convertNewDate(time);
        var hours = x.getHours();
        hours = ("0" + hours).slice(-2);
        var minutes = x.getMinutes();
        minutes = ("0" + minutes).slice(-2);
        var strTime = hours + ':' + minutes;
        return (strTime);
    }

    _getLikeResource(data) {
        var contentStoreID = data.fContentID;
        var contentStoreEN = data.fContentEN;
        var contentStoreCN = data.fContentCN;
        return (
            { fContentType: 'Store', fContentKey: data.key, fText1: { id: contentStoreID.fStoreName, en: contentStoreEN.fStoreName, cn: contentStoreCN.fStoreName }, fText2: { id: idJSON.storeCategory[tbLookupDAO.getLookUpValue(data.storeCategory)], en: enJSON.storeCategory[tbLookupDAO.getLookUpValue(data.storeCategory)], cn: cnJSON.storeCategory[tbLookupDAO.getLookUpValue(data.storeCategory)] }, fText3: { id: data.fBuildingNameID, en: data.fBuildingNameEN, cn: data.fBuildingNameCN }, fImageID: contentStoreID.fStoreImageJSON, fImageEN: contentStoreEN.fStoreImageJSON, fImageCN: contentStoreCN.fStoreImageJSON, fTargetKey: data.key }
        )
    }

    _getCommentResource(data) {
        var contentStoreID = data.fContentID;
        var contentStoreEN = data.fContentEN;
        var contentStoreCN = data.fContentCN;
        return (
            {
                fUserImage: this.currentUserData.fProfileImageJSON, fContentType: 'Store', fContentKey: data.key,
                fContentName: { id: contentStoreID.fStoreName, en: contentStoreEN.fStoreName, cn: contentStoreCN.fStoreName },
                fContentText1: { id: data.fBuildingNameID, en: data.fBuildingNameEN, cn: data.fBuildingNameCN },
                fContentText2: { id: contentStoreID.fShortDescription, en: contentStoreEN.fShortDescription, cn: contentStoreCN.fShortDescription },
                fContentImage: { id: contentStoreID.fStoreImageJSON, en: contentStoreEN.fStoreImageJSON, cn: contentStoreCN.fStoreImageJSON },
                fTargetType: 'Store', fTargetName: { id: contentStoreID.fStoreName, en: contentStoreEN.fStoreName, cn: contentStoreCN.fStoreName },
                fTargetImage: { id: contentStoreID.fStoreImageJSON, en: contentStoreEN.fStoreImageJSON, cn: contentStoreCN.fStoreImageJSON },
                fTargetKey: data.key
            }
        )
    }

    onScrollHandler(v) {
        var { w, h, p } = this.WHP;
        var y = v.nativeEvent.contentOffset.y;
        this._animIcon.setValue(Math.pow(Math.max(0, w * 0.5 - y) / (w * 0.5), 2));
    }

    _constructFloorString(floorData) {
        var str = '';
        for (var i = 0; i < floorData.length; i++) {
            if (i === floorData.length - 1) { str = str + floorData[i]['fFloorName' + this.Language.toUpperCase()] }
            else {
                str = str + floorData[i]['fFloorName' + (this.Language).toUpperCase()] + ', '
            }
        }
        return (str);
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

      getUrlLocation(id){
        console.log(id);
        var data = this.data['fContent'+this.Language.toUpperCase()].fLocationUrl;
        if(data.length == 0){
            DialogBox.showFail(null, SGLocalize.translate("globalText.FailText"), SGLocalize.translate('globalText.notSupportedLink'), SGLocalize.translate('globalText.ok'), () => { }, true);
        }else{
            for(var i=0;i<data.length;i++){
                if(id === data[i].fFloorKey){
                   var url = data[i].urlLink;
                   this.handleLink(url);
                   break;
                }
            }
        }
    }

    checkUrlLocation(id){
        var data = this.data['fContent'+this.Language.toUpperCase()].fLocationUrl;
        for(var i=0;i<data.length;i++){
            if(id === data[i].fFloorKey){
              return true;
            }
        }

    }

    getValue(data,index){
        // console.log('data')
        // console.log(data);
        var temp = this.data['fContent' + this.Language.toUpperCase()].fLocationMapper;  
        if(temp.length !==0){
            for(var i=0;i<temp.length;i++){
                if(data.id === temp[i].fFloorKey){
                    // var tempValue = {x : temp[i].fPosXY.x*2, y :temp[i].fPosXY.y*2*9/16*2};
                    var tempValue = {x : temp[i].fPosXY.x, y :temp[i].fPosXY.y};
                    this.fPosXY.push(tempValue);
                }  
            }
        }else{
            this.fPosXY = [];
            var count = this.data.floor.length
            for(var i=0;i<count;i++){
                // var tempValue = {x : 50*2, y :50*2*9/16*2};
                var tempValue = {x : 50, y :50};
                this.fPosXY.push(tempValue);
            }
        }
        return this.fPosXY[index];
    }

    render() {
        var { w, h, p } = this.WHP;
        var style = this.style;
        var data = this.data;
        var dataContent = this.data['fContent' + this.Language.toUpperCase()];
        var shareParams = {StorestoName:this.data['fStoreName'+this.Language.toUpperCase()] , MallName:data['fBuildingName' + this.Language.toUpperCase()] }
        return (
            <RootView dummyStatusBar accessible={true} accessibilityLabel={'StoreProfileScreenRootView'} style={style.mainContainer}>
                {this.data !== '' ?
                    (<View accessible={true} style={style.mainContainer}>
                        <View accessible={true} style={style.header}>
                            <Image accessible={true} accessibilityLabel={'StoreProfileScreenBackgroundImage'} style={style.imageBackground} source={{ uri: dataContent.fStoreBackgroundImageJSON[0][this.imageSetting].uri }}>
                                <View accessible={true} style={style.overlay}></View>
                            </Image>
                        </View>
                        <View style={{ width: w, flex: 1, backgroundColor: 'transparent' }}>
                            <ScrollView dummyFooterBar dummyBottomBar bounces={false} accessible={true} accessibilityLabel={'StoreProfileScreenScrollView'} style={style.scrollView} contentContainerStyle={style.scrollContainer} showsVerticalScrollIndicator={false} scrollEventThrottle={16} onScroll={(v) => { this.onScrollHandler(v); this.baseOnScrollHandler(v); }} onMomentumScrollBegin={this.baseOnMomentumScrollBeginHandler.bind(this)} onScrollEndDrag={this.baseOnScrollEndDragHandler.bind(this)} onMomentumScrollEnd={this.baseOnMomentumScrollEndHandler.bind(this)}>
                                <View style={{ width: w, height: w * 0.55 }}></View>
                                <View accessible={true} style={style.storeProfileContainer}>
                                    <View accessible={true} style={style.profileDetailContainer}>
                                        <Text accessible={true} accessibilityLabel={'StoreProfileScreenStoreName'} preset={Text.preset.titleH1B} style={style.storeNameText}>{dataContent.fStoreName.toUpperCase()}</Text>
                                        <Text accessible={true} accessibilityLabel={'StoreProfileScreenLikeCount'} preset={Text.preset.titleH4B} style={style.likedText}>{data.fLikeCount} {SGLocalize.translate('globalText.likeCountText')}</Text>
                                        {data.linkWebsite !== "" &&
                                        <TouchableOpacity onPress={() => this.handleLink(data.linkWebsite)}>
                                            <Text accessible={true} accessibilityLabel={'StoreProfileScreenWebText'} style={style.websiteText} preset={Text.preset.titleH4_5B}>{SGLocalize.translate('storeProfileScreen.websiteText', { name: dataContent.fStoreName })}</Text>
                                        </TouchableOpacity>
                                        }
                                        <View accessible={true} accessibilityLabel={'StoreProfileScreenIconButtonView'} style={style.iconButtonView}>
                                            <CardIconButtonFavorite onIconPressed={((item, s)=>{console.log(item);  item.fUserFavoriteThis = s; this.forceUpdate();}).bind(this, this.data)} accessible={true} accessibilityLabel={'StoreProfileScreenFavoriteIcon'} textColor='white' navigator={this.props.navigation} contentType='Store' contentKey={this.storeKey} active={data.fUserFavoriteThis} type={'favorite'} ></CardIconButtonFavorite>
                                            <CardIconButtonLike onIconPressed={((item, s,c)=>{console.log(item);  item.fUserLikedThis = s; item.fLikeCount+=c; this.forceUpdate();}).bind(this, this.data)} accessible={true} accessibilityLabel={'StoreProfileScreenLikeIcon'} likePackage={this._getLikeResource(this.data)} textColor='white' navigator={this.props.navigation} contentType='Store' contentKey={this.storeKey} active={data.fUserLikedThis} type={'like'} ></CardIconButtonLike>
                                            <CardIconButtonComment accessible={true} accessibilityLabel={'StoreProfileScre         enCommentIcon'} commentPackage={this._getCommentResource(this.data)} textColor='white' navigator={this.props.navigation} contentType='Store' contentKey={this.storeKey} canComment={data.fCanComment} type={'comment'} ></CardIconButtonComment>
                                            <CardIconButtonShare shareParams={shareParams}  img={dataContent.fStoreImageJSON[0].thumbnailLow.uri}  accessible={true} accessibilityLabel={'StoreProfileScreenShareIcon'} textColor='white' navigator={this.props.navigation} contentType='Store' contentKey={this.storeKey} shareMessage={dataContent.fShareMessage} targetKey={this.storeKey} type={'share'} ></CardIconButtonShare>
                                            <CardIconButtonNotification onIconPressed={((item, s)=>{ console.log(item);  item.fUserNotificationThis = s; this.forceUpdate();}).bind(this, this.data)}  accessible={true} accessibilityLabel={'StoreProfileScreenNotificationIcon'} textColor='white' navigator={this.props.navigation} contentType='Store' contentKey={this.storeKey} active={data.fUserNotificationThis} type={'notification'} ></CardIconButtonNotification> 
                                        </View>
                                    </View>

                                    {/* Jam Operasional  */}
                                    <View accessible={true} style={style.profileInfoContainer}>
                                        <View accessible={true} style={style.infoSectionContainer}>
                                            <Text accessible={true} style={style.infoSectionHeadingText} preset={Text.preset.titleH2B}>{SGLocalize.translate('storeProfileScreen.opHours')}</Text>
                                            <View accessible={true} style={style.infoSectionDescContainer}>
                                                {(data.opHours).map((x, index) => {
                                                    return (
                                                        x.fActive === 'Y' ?
                                                            (
                                                                <View accessible={true} style={style.operationHoursContainer}>
                                                                    <Text accessible={true} accessibilityLabel={'StoreProfileScreenDayName'} style={style.sectionDescText} preset={Text.preset.titleH3}>{SGLocalize.translate('dayName.' + x.day)}</Text>
                                                                    <View style={{flexDirection:'row'}}>
                                                                       <Text accessible={true} accessibilityLabel={'MallProfileScreenHourText'} style={style.operationalText} preset={Text.preset.titleH3}>{SGHelperType.formatTime(SGHelperType.convertNewDate(x.openTime))}</Text>
                                                                       <Text accessible={true} accessibilityLabel={'MallProfileScreenHourText'} preset={Text.preset.titleH3}>-</Text>
                                                                       <Text accessible={true} accessibilityLabel={'MallProfileScreenHourText'} style={style.operationalText} preset={Text.preset.titleH3}>{SGHelperType.formatTime(SGHelperType.convertNewDate(x.closeTime))}</Text>
                                                                      </View>
                                                                </View>

                                                            )
                                                            :
                                                            (
                                                                <View accessible={true} style={style.operationHoursContainer}>
                                                                    <Text accessible={true} accessibilityLabel={'StoreProfileScreenDayName'} style={style.sectionDescText} preset={Text.preset.titleH3}>{SGLocalize.translate('dayName.' + x.day)}</Text>
                                                                    <View style={{width:w*0.3,justifyContent:'center'}}> 
                                                                        <Text accessible={true} accessibilityLabel={'StoreProfileScreenHourText'} style={style.operationalText} preset={Text.preset.titleH3}>{SGLocalize.translate('mallProfileScreen.closedText')}</Text>
                                                                    </View>
                                                                </View>

                                                            )
                                                    )
                                                })}
                                            </View>
                                        </View>

                                        {/* Kontak  */}
                                        { ((data.whatsapp !== '' && data.whatsapp !== '-') || (data.phoneNumber !== '' && data.phoneNumber !== '-') 
                                                || (data.email !== '' && data.email !== '-')) &&
                                            <View accessible={true} style={style.infoSectionContainer}>
                                                <Text accessible={true} accessibilityLabel={'StoreProfileScreenPhoneNumbTitle'} style={style.infoSectionHeadingText} preset={Text.preset.titleH2B}>{SGLocalize.translate('storeProfileScreen.contacts')}</Text>
                                                <View accessible={true} style={style.infoSectionDescContainer}>
                                                    {(data.phoneNumber !== '' && data.phoneNumber !== '-') &&
                                                        <Text accessible={true} accessibilityLabel={'StoreProfileScreenPhoneNumbText'} style={style.sectionDescText} preset={Text.preset.titleH3}>{data.phoneNumber}</Text>
                                                    }
                                                    
                                                    {(data.email !== '' && data.email !== '-') && 
                                                        <Text accessible={true} accessibilityLabel={'StoreProfileScreenEmailText'} style={style.sectionDescText} preset={Text.preset.titleH3}>{data.email}</Text>
                                                    }

                                                    {(data.whatsapp !== '' && data.whatsapp !== '-') &&
                                                        <TouchableOpacity onPress={() => {this.whatsappEnjoyer(data.whatsapp)}}>
                                                            <View style={{flexDirection:'row'}}> 
                                                                <Image accessible={true} accessibilityLabel={'MallProfileScreenYTIconImage'} source={{ uri: image.iconWhatsapp[this.imageSetting].url }} style={style.iconwhatsapp}></Image>
                                                                <Text accessible={true} accessibilityLabel={'StoreProfileScreenEmailText'} style={style.sectionDescText} preset={Text.preset.titleH3}>{data.whatsapp}</Text>
                                                            </View>
                                                        </TouchableOpacity>
                                                    }
                                                </View>
                                            </View>
                                        }

            
                                        {/* Lokasi  */}
                                        <View accessible={true} style={style.infoSectionContainer}>
                                            <Text accessible={true} accessibilityLabel={'StoreProfileScreenLocTitle'} style={style.infoSectionHeadingText} preset={Text.preset.titleH2B}>{SGLocalize.translate('storeProfileScreen.location')}</Text>
                                            
                                            {/* Tipe Gambar  */}
                                            {this.noImageLocation !== true &&
                                             data.fShowLayoutLocationType == 'type2' &&
                                            <ViewPager accessible={true} accessibilityLabel={'StoreProfileLocationViewPager'} style={style.sliderContainer} initialPage={0} showPageIndicator={true} transitionStyle={'scroll'} pageIndicatorStyle={{ position: 'absolute', bottom: 0 * p, flexDirection: 'row', alignSelf: 'center' }}>
                                                {(dataContent.fLocationImageJSON).map((x, index) => {
                                                    return (
                                                        <View accessible={true} accessibilityLabel={'RestoProfileLocationImageView'} key={x.id} style={{ justifyContent: 'flex-start' }}>
                                                           {x[this.imageSetting].uri !== SGHelperType.getSystemParamsValue('DefaultImage') &&
                                                                <Image accessible={true} accessibilityLabel={'RestoProfileLocationImage'} style={style.sliderImage} source={{ uri: x[this.imageSetting].uri }}></Image>
                                                           }
                                                        </View>
                                                    )
                                                })}
                                            </ViewPager>
                                            }

                                            {/* Tipe URL  */}
                                            {data.floor.length !== 0 &&
                                                data.fShowLayoutLocationType == 'type3' &&
                                                    data.floor.map((data) => {
                                                        return (
                                                            this.checkUrlLocation(data.id) &&
                                                            <View style={{flexDirection: 'row', justifyContent: 'flex-start', width: 9*w/10}}>
                                                                <TouchableOpacity key={data.id} onPress={() => this.getUrlLocation(data.id)}>
                                                                    <View style={{flexDirection: 'row', justifyContent: 'flex-start'}}>
                                                                        <Text preset={Text.preset.titleH2B} style={{color: '#7ED9FA'}}>{SGLocalize.translate('storeProfileScreen.LocDesc')}</Text>
                                                                        <Text preset={Text.preset.titleH2B} style={{color: '#7ED9FA'}}>{data['fFloorName'+this.Language.toUpperCase()]}</Text>
                                                                    </View>
                                                                </TouchableOpacity>
                                                            </View>
                                                            )
                                                    })
                                            }

                                             {/* Tipe Tandai Lokasi Gambar   */}
                                             {data.floor.length !== 0 &&
                                                data.fShowLayoutLocationType == 'type1' &&
                                                    data.floor.map((data,index) => {
                                                        return (
                                                            <>
                                                            <SGPopView popViewID={data.id}>
                                                                <View style={{width:w,height:h*1.2,backgroundColor:'white'}}>
                                                                    <SGPanZoomView allowFullScreen fullScreenMode onSizeFullScreen={((pvID)=>{SGPopView.hidePopView(pvID)}).bind(this,data.id)} showBar={this.showBar} accessible={true} accessibilityLabel={'LayoutFullScreenZoomView'} style={style.psv1FS} scale={1/2} locked={false} maxScale={16}>
                                                                    <Text preset={Text.preset.h3B} style={{color: '#7ED9FA'}}>{data['fFloorName'+this.Language.toUpperCase()]}</Text>
                                                                    <Image key={data.id} tabLabel="SGDragView" style={{backgroundColor:'white',width:w*2, height:w*0.5*2*9/16*2,resizeMode:'stretch'}} source={{uri:data['fFloorContent'+this.Language.toUpperCase()].fImageJSON[0][this.imageSetting].uri}}>
                                                                    <View style={{backgroundColor:'transparent',position:'absolute',left:this.getValue(data,index).x,top:this.getValue(data,index).y, width:w*0.1*2, height:w*0.1*2*9/16*2}} >
                                                                        <Image  style={{backgroundColor:'transparent', width:w*0.08*2, height:w*0.08*2*9/16*2}} source={this._logo}></Image>
                                                                    </View>
                                                                    </Image>
                                                                    </SGPanZoomView>
                                                                </View>
                                                            </SGPopView>
                                                            <SGPanZoomView allowFullScreen onSizeFullScreen={((pvID)=>{SGPopView.showPopView(pvID)}).bind(this,data.id)}  showBar={this.showBar} accessible={true} accessibilityLabel={'LayoutFullScreenZoomView'} style={style.psv1} scale={1/2} locked={false} maxScale={16}>
                                                                <Text preset={Text.preset.h3B} style={{color: '#7ED9FA'}}>{data['fFloorName'+this.Language.toUpperCase()]}</Text>
                                                                <Image key={data.id} tabLabel="SGDragView" style={{backgroundColor:'white',width:w*2, height:w*0.5*2*9/16*2,resizeMode:'stretch'}} source={{uri:data['fFloorContent'+this.Language.toUpperCase()].fImageJSON[0][this.imageSetting].uri}}>
                                                                <View style={{backgroundColor:'transparent',position:'absolute',left:this.getValue(data,index).x,top:this.getValue(data,index).y, width:w*0.1*2, height:w*0.1*2*9/16*2}} >
                                                                    <Image  style={{backgroundColor:'transparent', width:w*0.08*2, height:w*0.08*2*9/16*2}} source={this._logo}></Image>
                                                                </View>
                                                                </Image>
                                                            </SGPanZoomView>
                                                            </>
                                                            )
                                                    })
                                            }

                                            <View accessible={true} style={style.infoSectionDescContainer}>
                                                <Text accessible={true} accessibilityLabel={'StoreProfileScreenPlaceName'} style={style.sectionDescText} preset={Text.preset.titleH3}>{data['fBuildingName' + this.Language.toUpperCase()]}</Text>
                                                <Text accessible={true} accessibilityLabel={'StoreProfileScreenFloorLoc'} style={style.sectionDescText} preset={Text.preset.titleH3}>{this._constructFloorString(this.data.floor)}</Text>
                                                <Text accessible={true} accessibilityLabel={'StoreProfileScreenLocHint'} style={style.sectionDescText} preset={Text.preset.titleH3}>{dataContent.fLocation}</Text>
                                            </View>
                                        </View>
                                        <View accessible={true} style={style.infoSectionContainer}>
                                            <Text accessible={true} accessibilityLabel={'StoreProfileScreenDescTitle'} style={style.infoSectionHeadingText} preset={Text.preset.titleH2B}>{SGLocalize.translate('storeProfileScreen.DescTitle')}</Text>
                                            {this.noImageStory !== true &&
                                            <ViewPager accessible={true} accessibilityLabel={'StoreProfileScreenBookViewPager'} style={style.sliderContainer} initialPage={0} showPageIndicator={true} transitionStyle={'scroll'} pageIndicatorStyle={{ position: 'absolute', bottom: 0 * p, flexDirection: 'row', alignSelf: 'center' }}>
                                                {(dataContent.fImageSlider).map((x, index) => {
                                                    return (
                                                        <View accessible={true} accessibilityLabel={'StoreProfileScreenBookImageView'} key={x.id} style={{ justifyContent: 'flex-start' }}>
                                                            {x[this.imageSetting].uri !== SGHelperType.getSystemParamsValue('DefaultImage') &&
                                                                <Image accessible={true} accessibilityLabel={'StoreProfileScreenBookImage'} style={style.sliderImage} source={{ uri: x[this.imageSetting].uri }}></Image>
                                                            }
                                                       </View>
                                                    )
                                                })}
                                            </ViewPager>
                                            }
                                        </View>
                                        {dataContent.fTypeDetail === 'longdescription' ?
                                            (<Text accessible={true} accessibilityLabel={'StoreProfileScreenBookDescText'} style={style.descriptionText} preset={Text.preset.titleH3}>{dataContent.fLongDescription}</Text>)
                                            :
                                            (null)
                                        }
                                        {dataContent.fTypeDetail === 'url' && dataContent.fUrl !== '' ?
                                            <View style={{width:w,height:h}}> 
                                                <WebViewRender nestedScrollEnabled={true} data={dataContent.fUrl} style={style.throwWHP} fType='url'></WebViewRender>
                                            </View>
                                            :
                                            (null)
                                        }
                                        {dataContent.fTypeDetail === 'html' && dataContent.fHtml !== '' ?
                                        <View style={{width:w-16*p,height:h}}> 
                                            <WebViewRender nestedScrollEnabled={true} data={dataContent.fHtml} style={style.throwWHP} fType='html'></WebViewRender>
                                        </View>
                                            :
                                            (null)
                                        }
                                    </View>

                                    <ScrollView accessible={true} accessibilityLabel={'MallProfileScreenSocmedIconView'} showsHorizontalScrollIndicator={false} style={style.iconSliderContainer} contentContainerStyle={{ justifyContent: 'center', alignItems: 'center' }} horizontal>
                                    {SGHelperType.validURL(this.data.linkFacebook)?
                                                (<TouchableOpacity onPress={this.handleLink.bind(this, this.data.linkFacebook)}>
                                                    <Image accessible={true} accessibilityLabel={'MallProfileScreenFBIconImage'} source={{ uri: image.iconFacebook[this.imageSetting].url }} style={style.icon}></Image>
                                                </TouchableOpacity>)
                                                :
                                                (null)
                                            }
                                            {SGHelperType.validURL(this.data.linkInstagram)?
                                                (<TouchableOpacity onPress={this.handleLink.bind(this, this.data.linkInstagram)}>
                                                    <Image accessible={true} accessibilityLabel={'MallProfileScreenIGIconImage'} source={{ uri: image.iconInstagram[this.imageSetting].url }} style={style.icon}></Image>
                                                </TouchableOpacity>)
                                                :
                                                (null)
                                            }
                                            {SGHelperType.validURL(this.data.linkTwitter)?
                                                (<TouchableOpacity onPress={this.handleLink.bind(this, this.data.linkTwitter)}>
                                                    <Image accessible={true} accessibilityLabel={'MallProfileScreenTwitIconImage'} source={{ uri: image.iconTwitter[this.imageSetting].url }} style={style.icon}></Image>
                                                </TouchableOpacity>)
                                                :
                                                (null)
                                            }
                                            {SGHelperType.validURL(this.data.linkYoutube)?
                                                (<TouchableOpacity onPress={this.handleLink.bind(this, this.data.linkYoutube)}>
                                                    <Image accessible={true} accessibilityLabel={'MallProfileScreenYTIconImage'} source={{ uri: image.iconYoutube[this.imageSetting].url }} style={style.icon}></Image>
                                                </TouchableOpacity>)
                                                :
                                                (null)
                                            }
                                            {SGHelperType.validURL(this.data.linkLinkedIn)?
                                                (<TouchableOpacity onPress={this.handleLink.bind(this, this.data.linkLinkedIn)}>
                                                    <Image accessible={true} accessibilityLabel={'MallProfileScreenYTIconImage'} source={{ uri: image.iconLinked[this.imageSetting].url }} style={style.icon}></Image>
                                                </TouchableOpacity>)
                                                :
                                                (null)
                                            }
                                            {/* {SGHelperType.validURL(this.data.whatsapp)?
                                                (<TouchableOpacity onPress={this.handleLink.bind(this, this.data.whatsapp)}>
                                                    <Image accessible={true} accessibilityLabel={'MallProfileScreenYTIconImage'} source={{ uri: image.iconWhatsapp[this.imageSetting].url }} style={style.icon}></Image>
                                                </TouchableOpacity>)
                                                :
                                                (null)
                                            } */}
                                            {SGHelperType.validURL(this.data.line)?
                                                (<TouchableOpacity onPress={this.handleLink.bind(this, this.data.line)}>
                                                    <Image accessible={true} accessibilityLabel={'MallProfileScreenYTIconImage'} source={{ uri: image.iconLine[this.imageSetting].url }} style={style.icon}></Image>
                                                </TouchableOpacity>)
                                                :
                                                (null)
                                            }
                                            {SGHelperType.validURL(this.data.linkTripAdvisor)?
                                                (<TouchableOpacity onPress={this.handleLink.bind(this, this.data.linkTripAdvisor)}>
                                                    <Image accessible={true} accessibilityLabel={'MallProfileScreenYTIconImage'} source={{uri: image.iconTripAdvisor[this.imageSetting].url }} style={style.icon}></Image>
                                                </TouchableOpacity>)
                                                :
                                                (null)
                                            }
                                            {SGHelperType.validURL(this.data.linkAppStore)?
                                                (<TouchableOpacity onPress={this.handleLink.bind(this, this.data.linkAppStore)}>
                                                    <Image accessible={true} accessibilityLabel={'MallProfileScreenYTIconImage'} source={{ uri: image.iconAppStore[this.imageSetting].url }} style={style.icon}></Image>
                                                </TouchableOpacity>)
                                                :
                                                (null)
                                            }
                                            {SGHelperType.validURL(this.data.linkPlayStore)?
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
                            <Image accessible={true} accessibilityLabel={'StoreProfileScreenLogoImage'} source={{ uri: dataContent.fStoreImageJSON[0][this.imageSetting].uri }} style={style.thumbnailImage}></Image>
                        </Animated.View>
                    </View>)
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
