
/**
 * Version 1.3.0
 * 1. Melvin 20 May 2021
 * - Improve API Main Home Screen
 * Version 1.2.0
 * 1. Yohanes 26 March 2021
 * - add ErrorHandling
 * 2. Yohanes 26 April 2021
 * - add TrackingTransparency
 * Version 1.1.0
 * 1. Yohanes, 8 Maret 2021
 *  - add Version and Mode  
 *  - check Version Pending
 *  
 * */
import React, { Fragment } from "react";
import { StyleSheet, Dimensions, Linking, Platform,BackHandler } from "react-native";
import { SGBaseScreen } from "../../../core/screen/SGBaseScreen";
import { SGImage as Image, SGText as Text, SGView as View, SGRootView as RootView,SGDialogBox,SGFlatList as FlatList,SGActivityIndicator as ActivityIndicator } from "../../../core/control";
import {  SGHelperGlobalVar, SGHelperNavigation, SGHelperType,SGHelperErrorHandling,SGHelperOneSignal } from '../../../core/helper';
import image from '../../asset/image';
import { SGLocalize } from '../../locales/SGLocalize';
import { tbVUserAPI } from '../../api/tbVUserAPI';
import CryptoJS from 'crypto-js';
import DeviceInfo from 'react-native-device-info';
import { tbSystemParamsDAO } from '../../db/tbSystemParamsDAO';
import { tbCLookUpAPI } from "../../api/tbCLookUpAPI";
import { tbLookupDAO } from '../../db/tbLookupDAO';
import idJSON from '../../locales/id.json';
import enJSON from '../../locales/en.json';
import cnJSON from '../../locales/cn.json';
import { SGHelperAPICall } from '../../../core/helper/SGHelperAPICall';
import { SGHelperWindow } from '../../../core/helper/SGHelperWindow';
import { tbVUserLoginAPI } from '../../api/tbVUserLoginAPI';
import { tbVUserFavoriteAPI } from '../../api/tbVUserFavoriteAPI';
import { tbVUserSearchHistoryAPI } from '../../api/tbVUserSearchHistoryAPI';
import { tbVNotificationAPI } from '../../api/tbVNotificationAPI';
import { tbCCommentAPI } from '../../api/tbCCommentAPI';
import { VtrendingAPI } from '../../api/VtrendingAPI';
import { VGroupAPI } from '../../api/VGroupAPI';
import { tbVAnnouncementAPI } from '../../api/tbVAnnouncementAPI';
import { tbCArrayOfLinksAPI } from '../../api/tbCArrayOfLinksAPI';
import { tbCSysParamAPI } from '../../api/tbCSysParamAPI';
import { mode, version,tvMode } from '../../../../app.json'
import RNExitApp from 'react-native-exit-app';
import { Alert } from "react-native";
import {SGHelperSoundPlayer} from '../../../core/helper/SGHelperSoundPlayer';
import {tbVProfileSponsorshipAPI} from '../../api/tbVProfileSponsorshipAPI';
import { tbVEventSponsorshipAPI } from '../../api/tbVEventSponsorshipAPI';
import MyTranslator from "../../../plugin/lessons/locale/MyTranslator";
import tbVMainHomeVisitorAPI from "../../../plugin/plugin1/api/tbVMainHomeVisitorAPI";

export class SplashScreen extends SGBaseScreen {

    constructor(props, context, ...args) {
        super(props, context, ...args);
        
        SGHelperGlobalVar.addVar("Navigation",this.props.navigation)
        SGHelperGlobalVar.addVar("ResponTimes",15000)
        this.style = this.createStyleSheet(this.WHPNoHeader);
        this.props.navigation.setOptions({
            headerShown: false,
        });
        this.versionExpired = false;
        this.userTokenData = '';
        this.userDataSetting = '';
        this.sponsorData = [];
        this.alreadyMount = false;
        SGHelperGlobalVar.addVar('GlobalLanguage', 'id');
        SGLocalize.initLanguage(SGHelperGlobalVar.getVar('GlobalLanguage'));
        SGHelperGlobalVar.addVar("GlobalImageSetting", 'med');
        SGHelperGlobalVar.addVar("GlobalCurrency", 'IDR');
        SGHelperGlobalVar.addVar('GlobalAnonymous', false);
        SGHelperGlobalVar.addVar('tmpHidePrompt',false);
        SGHelperGlobalVar.addVar('tmpHidePromptFav',false);
        this.imageSetting = SGHelperGlobalVar.getVar("GlobalImageSetting");
        this.currency = SGHelperGlobalVar.getVar("GlobalCurrency");
        this.state = { loadingStart: 0, loadingEnd: 8, disabled: true }
        this.pending = false
        SGHelperGlobalVar.setVar("UserLikeCache",[]);
        SGHelperGlobalVar.setVar("UserFavoriteCache",[]);
        SGHelperGlobalVar.setVar("UserNotificationCache",[]);
        this._logo = [require('../../asset/logo1_480.gif'),
            require('../../asset/logo2_480.gif'),
            require('../../asset/logo3_480.gif'),
            require('../../asset/logo4_480.gif'),
            require('../../asset/logo5_480.gif'),
            require('../../asset/logo6_480.gif')];
        this._i = Math.floor(Math.random()*6);
        this._soundFinished=false;
        this._deepLinkingHandlerPushNotification = this._checkDeepLinkingHandlerPushNotification;
        this._deepLinkingHandlerShareMessage = this._checkDeepLinkingHandlerShareMessage
        
    }

    hashAnonymousLogin(str, key) {
        str = CryptoJS.enc.Utf8.parse(str);
        key = CryptoJS.enc.Utf8.parse(key);
        var mac = CryptoJS.HmacSHA256(str, key);
        return (mac.toString(CryptoJS.enc.Base64));
    }

    createStyleSheet = (whp) => {
        var { w, h, p } = whp;
        return StyleSheet.create({
            mainView1: { width: w, height: h, padding: p, justifyContent: 'center', backgroundColor: 'rgb(254,252,254)' },
            imageCont1: { padding: p, backgroundColor: 'rgb(254,252,254)' },
            image1:{backgroundColor:'white',width:w*0.5, height:w*0.5, resizeMode: 'contain',},
            container: { height: w * 0.015, width: w * 0.35, backgroundColor: 'rgb(254,252,254)', borderColor: 'rgb(228,228,228)', borderWidth: 1, borderRadius: 10, alignItems: 'flex-start', marginTop: 1 * p },
            text1: { color: '#909090', },
            vViewSponsorship:{width:w,flexDirection:'row',justifyContent:'space-between'},
            viewVSponsorship: { alignSelf: 'stretch', flex: 1 },
            vSponsorship: { width: w*0.15, height:w*0.15,alignItems:'center',justifyContent:'center', marginHorizontal:8*p,resizeMode:'contain',backgroundColor:'transparent' },
            textSponsorship: { color: '#909090',alignSelf:'center' },
            style1:{width:w,height:w*0.15},
            style2:{width:w,height:w*0.3},
            style3:{width:w,height:w*0.45}
        });
    };

    async _tableMapAPI() {

      var res = await SGHelperAPICall.refreshVisitorAPIMap()
      if (res.respInfo.status === 404) {
          this.versionExpired = true;
      } else if (res.respInfo.status === 405) {
          this.pending=true
          SGDialogBox.showConfirmation(null, SGLocalize.translate("AlertPermission.Sorry"), SGLocalize.translate("globalText.UnderConstructionVersion"), SGLocalize.translate("AlertPermission.Exit"), () => { RNExitApp.exitApp(); }, SGLocalize.translate("AlertPermission.TryAgain"), async() => { this.pending=false; await this._tableMapAPI() }, true)
      }else if(res.respInfo.status!==200){
        throw new Error("error API Map")
      }
      if (this.versionExpired == true) {
          SGDialogBox.showConfirmation(null, SGLocalize.translate("globalText.NewUpdate"), SGLocalize.translate("globalText.ExpiredVersion"), SGLocalize.translate("AlertPermission.Exit"), () => { RNExitApp.exitApp(); }, SGLocalize.translate("globalText.UpdateNow"), ( )=>{ this.linkDownload(res)}, true)
          // SGDialogBox.showFail(null, SGLocalize.translate("globalText.FailText"), SGLocalize.translate('globalText.ExpiredVersion'), SGLocalize.translate("globalText.UpdateNow"), () => { this.linkDownload(res) }, true)
      }
  
    }

    linkDownload(res) {
        var result = JSON.parse(res.data);
        
        if (Platform.OS === 'ios') {
            var value = result.linkAppStore
            this.handleLink(value)
        } else {
            var value = result.linkPlayStore
            this.handleLink(value)
        }
    }

    handleLink(url) {
        Linking.canOpenURL(url
        ).then(supported => {
            if (supported) {
                Linking.openURL(url);
            } else {
              SGDialogBox.showWebView(url,()=>{});
              // SGDialogBox.showWarning(null,SGLocalize.translate("AlertMessage.Whoops"),SGLocalize.translate("AlertMessage.AlertHandleLink"),SGLocalize.translate("AlertMessage.OK"),()=>{},true,{label: url,url:url})
                //GERRY HASANG please handle this error!
                // console.log("Don't know how to open URI: " + url);
            }
        });
    };

    async checkAPIGetMainHomeBatchStatusAllDone() {
        console.log('run home')
        this.setState(prevState => ({ loadingStart: prevState.loadingStart + 1 }))
        this._askingVersion('Home')
    }

    async _getMainHomeAPI() {
          this.currentUserData = SGHelperGlobalVar.getVar('GlobalCurrentUserData');
          var language = SGHelperGlobalVar.getVar('GlobalLanguage')
          console.log(language);
          console.log(this.currentUserData)
          this.baseInitAPIParallel( SGHelperGlobalVar.getVar("ResponTimes"), (() => { this.checkAPIGetMainHomeBatchStatusAllDone(); }).bind(this));

          this.baseAddAPIParallel('getUserFavPlaceEventSlider', (async () => { return tbVUserFavoriteAPI.getUserFavPlaceEventSlider() }).bind(this), ((v) => {
             SGHelperGlobalVar.addVar('getUserFavPlaceEventSlider', v);
          }).bind(this), null);

          this.baseAddAPIParallel('getUserFavPlaceSlider', (async () => { return tbVUserFavoriteAPI.getUserFavPlaceSlider() }).bind(this), ((v) => {
            SGHelperGlobalVar.addVar('getUserFavPlaceSlider', v);
          }).bind(this), null);
          this.baseAddAPIParallel('getUserFavStorePromoSlider', (async () => { return tbVUserFavoriteAPI.getUserFavStorePromoSlider() }).bind(this), ((v) => {
            SGHelperGlobalVar.addVar('getUserFavStorePromoSlider', v);
          }).bind(this), null);
          this.baseAddAPIParallel('getUserFavStoreSlider', (async () => { return tbVUserFavoriteAPI.getUserFavStoreSlider() }).bind(this), ((v) => {
            SGHelperGlobalVar.addVar('getUserFavStoreSlider', v);
          }).bind(this), null);
          this.baseAddAPIParallel('getUserFavRestoPromoSlider', (async () => { return tbVUserFavoriteAPI.getUserFavRestoPromoSlider() }).bind(this), ((v) => {
            SGHelperGlobalVar.addVar('getUserFavRestoPromoSlider', v);
          }).bind(this), null);
          this.baseAddAPIParallel('getUserFavRestoSlider', (async () => { return tbVUserFavoriteAPI.getUserFavRestoSlider() }).bind(this), ((v) => {
            SGHelperGlobalVar.addVar('getUserFavRestoSlider', v);
          }).bind(this), null);
          this.baseAddAPIParallel('getUserSearchHistory', (async () => { return tbVUserSearchHistoryAPI.getUserSearchHistory() }).bind(this), ((v) => {
            SGHelperGlobalVar.addVar('getUserSearchHistory', v);
          }).bind(this), null);
          this.baseAddAPIParallel('notificationLength', (async (v1,v2) => { return tbVNotificationAPI.notificationLength(v1,v2) }).bind(this,[{ name: 'fUserKey', operator: '=', value: this.currentUserData.fID }, { name: 'fRead', operator: '=', value: 'N' }], []), ((v) => {
            if(v >=10){
              SGHelperGlobalVar.addVar("Notification", "9+")
            }else{
              SGHelperGlobalVar.addVar("Notification", v.toString())
            }
          }).bind(this), null);
          this.baseAddAPIParallel('inboxLength', (async (v1,v2) => { return tbCCommentAPI.inboxLength(v1,v2) }).bind(this,[{ name: 'fCreatedBy', operator: '=', value: this.currentUserData.fID },{name: 'fReadCreator', operator: '=', value: 'N'}], []), ((v) => {
            if(v >=10){
              SGHelperGlobalVar.addVar("Inbox", "9+")
            }else{
              SGHelperGlobalVar.addVar("Inbox", v.toString())
            }
          }).bind(this), null);
        
        //trending data
        this.baseAddAPIParallel('getUserTrendingPlaceEventSlider', (async () => { return VtrendingAPI.getUserTrendingPlaceEventSlider() }).bind(this), ((v) => {
            SGHelperGlobalVar.addVar('getUserTrendingPlaceEventSlider', v);
        }).bind(this), null);
        this.baseAddAPIParallel('getUserTrendingPlaceSlider', (async () => { return VtrendingAPI.getUserTrendingPlaceSlider() }).bind(this), ((v) => {
            SGHelperGlobalVar.addVar('getUserTrendingPlaceSlider', v);
        }).bind(this), null);
        this.baseAddAPIParallel('getUserTrendingAuctionSlider', (async () => { return VtrendingAPI.getUserTrendingAuctionSlider() }).bind(this), ((v) => {
          SGHelperGlobalVar.addVar('getUserTrendingAuctionSlider', v);
        }).bind(this), null);
        this.baseAddAPIParallel('getUserTrendingStorePromoSlider', (async () => { return VtrendingAPI.getUserTrendingStorePromoSlider() }).bind(this), ((v) => {
            SGHelperGlobalVar.addVar('getUserTrendingStorePromoSlider', v);
        }).bind(this), null);
        this.baseAddAPIParallel('getUserTrendingStoreSlider', (async () => { return VtrendingAPI.getUserTrendingStoreSlider() }).bind(this), ((v) => {
            SGHelperGlobalVar.addVar('getUserTrendingStoreSlider', v);
        }).bind(this), null);
        this.baseAddAPIParallel('getUserTrendingRestoPromoSlider', (async () => { return VtrendingAPI.getUserTrendingRestoPromoSlider() }).bind(this), ((v) => {
            SGHelperGlobalVar.addVar('getUserTrendingRestoPromoSlider', v);
        }).bind(this), null);
        

        this.baseAddAPIParallel('getUserTrendingRestoSlider', (async () => { return VtrendingAPI.getUserTrendingRestoSlider() }).bind(this), ((v) => {
          SGHelperGlobalVar.addVar('getUserTrendingRestoSlider', v);
        }).bind(this), null);
        this.baseAddAPIParallel('getGroupTenantOfStore', (async () => { return VGroupAPI.getGroupTenantOfStore() }).bind(this), ((v) => {
            SGHelperGlobalVar.addVar('getGroupTenantOfStore', v);
        }).bind(this), null);
        this.baseAddAPIParallel('getGroupTenantOfResto', (async () => { return VGroupAPI.getGroupTenantOfResto() }).bind(this), ((v) => {
            SGHelperGlobalVar.addVar('getGroupTenantOfResto', v);
        }).bind(this), null);
        this.baseAddAPIParallel('getAnnouncementData', (async () => { return tbVAnnouncementAPI.getAnnouncementData() }).bind(this), ((v) => {
            console.log('splash')
            // console.log(v);
           
            SGHelperGlobalVar.addVar('getAnnouncementData', v);
        }).bind(this), null);

         // call API my card
        // Call API get Card Data
        this.baseAddAPIParallel('SearchMyLoyaltyCardSlider', (async () => { return tbVMainHomeVisitorAPI.SearchMyLoyaltyCardSlider() }).bind(this), ((v) => {
          SGHelperGlobalVar.addVar('getLoyaltyCardData', v);
        }).bind(this), null,);

        this.baseAddAPIParallel('GetActiveUserLogin', (async () => { return tbVUserAPI.GetActiveUserLogin() }).bind(this), ((v) => {
            SGHelperGlobalVar.addVar('userActiveLogin', v);
        }).bind(this), null);
        this.baseAddAPIParallel('pickerArrayOfLinks', (async (v1) => { return tbCArrayOfLinksAPI.pickerArrayOfLinks(v1) }).bind(this,language), ((v) => {
            SGHelperGlobalVar.addVar('arrayOfLinks', v);
        }).bind(this), null);

         //Sponsorship
        this.baseAddAPIParallel('getUserSearchEventSponsorshipSlider', (async () => { return tbVEventSponsorshipAPI.searchEventSponsorshipSlider() }).bind(this), ((v) => {
            SGHelperGlobalVar.addVar('getEventSponsorshipSlider', v);
        }).bind(this), null);

        this.baseRunAPIParallel()    
      }
    

    async APIBatchStatusAllDone() {
        this.alreadyMount = true;
        this.forceUpdate();

        this.userTokenData = await tbSystemParamsDAO.getUserDataToken();
        this.userDataSetting = await tbSystemParamsDAO.getUserDataSetting();
        this.userAliceVoiceSetting =  await tbSystemParamsDAO.getUserAliceVoiceSetting();
        // console.log(this.userAliceVoiceSetting )
        //check if Alice Voice setting is stored in realm
        if (this.userAliceVoiceSetting.fValue==='') {
           
            this.userAliceVoiceSetting.fParams = 'userAliceVoiceSetting';
            this.userAliceVoiceSetting.fValue = 'Y'
            await tbSystemParamsDAO.addSystemParams(this.userAliceVoiceSetting);
        }
        if (this.userTokenData.fValue !== '' &&  this.userDataSetting.fValue !== '') {
            var userTokenDataValue = this.userTokenData.fValue;
            var userDataSettingValue = this.userDataSetting.fValue;
            console.log("A")
            SGHelperGlobalVar.addVar('GlobalCurrentUserData', userDataSettingValue);
            SGHelperGlobalVar.addVar('GlobalCurrentUser', userDataSettingValue.fID);
            SGHelperGlobalVar.addVar('GlobalCurrentUserImage', userDataSettingValue.fImageJSON ? userDataSettingValue.fImageJSON : 'https://spotgue.com/dev/visitor/avatar.png');
            SGHelperGlobalVar.addVar('GlobalImageSetting', userDataSettingValue.fImageSetting);
            SGHelperGlobalVar.addVar('GlobalCurrency', userDataSettingValue.fCurrency);
            SGHelperGlobalVar.addVar('GlobalLanguage', userDataSettingValue.fLanguage);
            SGLocalize.changeLanguage(SGHelperGlobalVar.getVar('GlobalLanguage'));
            MyTranslator.changeLanguage(SGHelperGlobalVar.getVar('GlobalLanguage'));
            var isTokenExpired = new Date() > new Date(userTokenDataValue.tokenExpiryDate);
            console.log(isTokenExpired)
            if (isTokenExpired) {
                this.setState({ loadingStart: this.state.loadingEnd })
                console.log("SignIn")
                this._askingVersion('SignIn')
            }
            else {
                SGHelperGlobalVar.addVar("token", userTokenDataValue.token);
                var userLoginInput = {
                    fDeviceID: DeviceInfo.getUniqueId(),
                    fDeviceModel: DeviceInfo.getModel(),
                    fDeviceBrand: DeviceInfo.getBrand(),
                    fDeviceOS: DeviceInfo.getSystemName(),
                    fDeviceOSVersion: DeviceInfo.getSystemVersion(),
                    fDeviceHeight: (Dimensions.get('screen').width),
                    fDeviceWidth: (Dimensions.get('screen').width),
                    fLoginLocation: "Undetected"
                };

                this.baseRunSingleAPIWithRedoOption('regenerateTokenLogin', (async (userLoginInput) => { return tbVUserAPI.regenerateTokenLogin(userLoginInput) }).bind(this, userLoginInput), (async (newToken) => {
                    this.setState(prevState => ({ loadingStart: prevState.loadingStart + 1 }))
                    await tbSystemParamsDAO.updateUserDataToken(this.userTokenData, newToken);
                    await this._getMainHomeAPI();
                }).bind(this), null,  SGHelperGlobalVar.getVar("ResponTimes"));
 
            }
        }else {
            console.log("ChooseLanguage")
            // await tbSystemParamsDAO.consoleAllData()
            this.setState({ loadingStart: this.state.loadingEnd })
            this._askingVersion('ChooseLanguage')
        }
        
    }

    async _getAnonymous(){
        try {
          var date = new Date().toJSON()
          var str = DeviceInfo.getUniqueId() + date
          var deviceJSON = {
              fDeviceID: DeviceInfo.getUniqueId(),
              password: this.hashAnonymousLogin(str, "SpotgueRangers"),
              timestamp: date,
              fDeviceModel: DeviceInfo.getModel(),
              fDeviceBrand: DeviceInfo.getBrand(),
              fDeviceOS: DeviceInfo.getSystemName(),
              fDeviceOSVersion: DeviceInfo.getSystemVersion(),
              fDeviceHeight: (Dimensions.get('screen').width).toString(),
              fDeviceWidth: (Dimensions.get('screen').width).toString(),
              fLoginLocation: ""
          }
            console.log("CallAnonymous")
            var resAnonymous = await tbVUserAPI.anonymous(deviceJSON);
            console.log('res Anonymous');
            console.log(resAnonymous);
            this.setState(prevState => ({ loadingStart: prevState.loadingStart + 1 }))
            // var result = JSON.parse(resAnonymous.data);
            SGHelperGlobalVar.addVar("token", resAnonymous.token);
            SGHelperGlobalVar.addVar('refreshAnnouncement', true);
            
            this.baseInitAPIParallel( SGHelperGlobalVar.getVar("ResponTimes"), (async () => { await this.APIBatchStatusAllDone(); }).bind(this));
          
            this.baseAddAPIParallel('getAllSponsorshipData', (async () => { return tbVProfileSponsorshipAPI.searchActiveSponsor(); }).bind(this), ((v) => {
                // this.sponsorData = v
                // this.sponsorData=[]

                if(v.length>=9){
                  for(var i =0;i<9;i++){
                    this.sponsorData.push(v[i])
                  }
                }else{
                  for(var i =0;i<v.length;i++){
                    this.sponsorData.push(v[i])
                  }
                }
                  // for(var i =0;i<9;i++){
                  //   this.sponsorData.push(v[0])
                  // }
                this.setState(prevState => ({ loadingStart: prevState.loadingStart + 1 }))
            }).bind(this), null);

            // //get last login for announcement setting
            this.baseAddAPIParallel('getLastLoginUser', (async () => { return tbVUserLoginAPI.getLastLoginUser(); }).bind(this), ((v) => {
                SGHelperGlobalVar.addVar("lastLogin", v);
                console.log('last login')
                console.log(v);
                this.setState(prevState => ({ loadingStart: prevState.loadingStart + 1 }))
            }).bind(this), null);

            // //Update Lookup to Realm
            this.baseAddAPIParallel('getAllLookUpData', (async () => { return tbCLookUpAPI.getAllLookUpData(); }).bind(this), ((v) => {
                this.LookUpData = v
                // console.log('LookUpData')
                // console.log(this.LookUpData);
                console.log('lookup')
                // console.log(v);
                tbLookupDAO.refreshLookup(this.LookUpData);
                this.setState(prevState => ({ loadingStart: prevState.loadingStart + 1 }))
            }).bind(this), null);

            // //retrieve visitor sysparam and store in memory
            this.baseAddAPIParallel('searchSysParam', (async () => { return tbCSysParamAPI.searchSysParam([{ name: 'fType', operator: '=', value: 'visitor' }], []); }).bind(this), ((v) => {
                var systemParamObject = {}
                for (var i = 0; i < v.length; i++) {
                    systemParamObject[v[i].fParams] = v[i].fValue
                }
                console.log('system params')
                // console.log(systemParamObject);
                SGHelperGlobalVar.addVar("SysParam", systemParamObject)
                SGHelperGlobalVar.setVar("ResponTimes",SGHelperType.getSysParamsValueToInt("TimeOutAPI"))
                this.setState(prevState => ({ loadingStart: prevState.loadingStart + 1 }))
            }).bind(this),  null);

           
            this.baseRunAPIParallel();
        } catch (error) {
            SGHelperErrorHandling.Handling(error,this._getAnonymous.bind(this,deviceJSON),null,true,'_getAnonymous')
        }
    }
    _checkDeepLinkingHandlerPushNotification() {
        var url = SGHelperGlobalVar.getVar('deepLinkingURL')
        // console.log("YOHANES PushNotification")
        // console.log(url)
        if (url != null && url != '') {
          if (url.includes(SGHelperGlobalVar.getVar('UriScheme1')) && !url.includes("web")) {
     
            var urischeme = SGHelperGlobalVar.getVar('UriScheme1')
            var app_link = url.split(urischeme);
    
            var link = app_link[1].split('/');
            // console.log(link[0])
            SGHelperGlobalVar.addVar('deepLinkingURL', '');
    
            switch (link[0]) {
              case '': break;//do nothing
              case 'building':
                SGHelperGlobalVar.addVar('deepLinkingURL', '');
                SGHelperNavigation.navigatePush(this.props.navigation, "MallHome", { contentKey: link[1], notificationKey: link[2] });
                break;
              case 'store':
                SGHelperGlobalVar.addVar('deepLinkingURL', '');
                SGHelperNavigation.navigatePush(this.props.navigation, "StoreHome", { contentKey: link[1], notificationKey: link[2] });
                break;
              case 'resto':
                SGHelperGlobalVar.addVar('deepLinkingURL', '');
                SGHelperNavigation.navigatePush(this.props.navigation, "RestoHome", { contentKey: link[1], notificationKey: link[2] });
                break;
              case 'facility':
                SGHelperGlobalVar.addVar('deepLinkingURL', '');
                SGHelperNavigation.navigatePush(this.props.navigation, "FacilityDetail", { contentKey: link[1], notificationKey: link[2] });
                break;
              case 'eventbuilding':
                SGHelperGlobalVar.addVar('deepLinkingURL', '');
                SGHelperNavigation.navigatePush(this.props.navigation, "NotificationDetail", { fID: link[1], fContentType: 'PlaceEvent' });
                break;
              case 'eventstore':
                SGHelperGlobalVar.addVar('deepLinkingURL', '');
                SGHelperNavigation.navigatePush(this.props.navigation, "NotificationDetail", { fID: link[1], fContentType: 'StorePromo' });
                break;
              case 'eventresto':
                SGHelperGlobalVar.addVar('deepLinkingURL', '');
                SGHelperNavigation.navigatePush(this.props.navigation, "NotificationDetail", { fID: link[1], fContentType: 'RestoPromo' });
                break;
              case 'productstore':
                SGHelperGlobalVar.addVar('deepLinkingURL', '');
                SGHelperNavigation.navigatePush(this.props.navigation, "StoreProductDetail", { contentKey: link[1], notificationKey: link[2] });
                break;
              case 'productresto':
                SGHelperGlobalVar.addVar('deepLinkingURL', '');
                SGHelperNavigation.navigatePush(this.props.navigation, "RestoMenuDetail", { contentKey: link[1], notificationKey: link[2] });
                break;
              case 'inbox':
                SGHelperGlobalVar.addVar('deepLinkingURL', '');
                SGHelperNavigation.navigatePush(this.props.navigation, "InboxDetail", { commentKey: link[1] });
                break;
              case 'notification':
                SGHelperGlobalVar.addVar('deepLinkingURL', '');
                SGHelperNavigation.navigatePush(this.props.navigation, "NotificationDetail", { fID: link[1],fContentType:"Broadcast" });
                break;
              case 'auctionstore':
                  SGHelperGlobalVar.addVar('deepLinkingURL', '');
                  SGHelperNavigation.navigatePush(this.props.navigation, "NotificationDetail", { fID: link[1], fContentType: "StoreAuction" });
                  break;
              case 'auctionresto':
                SGHelperGlobalVar.addVar('deepLinkingURL', '');
                SGHelperNavigation.navigatePush(this.props.navigation, "NotificationDetail", { fID: link[1], fContentType: "RestoAuction" });
                break;
              case 'quiztenant':
                  SGHelperGlobalVar.addVar('deepLinkingURL', '');
                  SGHelperNavigation.navigatePush(this.props.navigation, "Quiz", { fID: link[1]});
                  break;
              case 'quizbuilding':
                  SGHelperGlobalVar.addVar('deepLinkingURL', '');
                  SGHelperNavigation.navigatePush(this.props.navigation, "QuizBuilding", { fID: link[1]});
                  break;
              default: console.log("do nothing")//SGHelperGlobalVar.addVar('deepLinkingURL', '');
            }
          }
        }
      }
    
    
    async _getData(){
        // await tbSystemParamsDAO.consoleAllData()
        SGHelperOneSignal.setAppId("a71e1f13-7669-4b10-af6b-380b389c0cbf");
        // OneSignal.setLogLevel(6, 0);
        SGHelperOneSignal.getDeviceState().then((v) => {
            var device = v;
        });
        //show when app open
        SGHelperOneSignal.setNotificationWillShowInForegroundHandler(notifReceivedEvent => {
            // console.log("OneSignal: notification will show in foreground:", notifReceivedEvent);
            let notif = notifReceivedEvent.getNotification();
            setTimeout(() => notifReceivedEvent.complete(notif), 0);
        });
        Linking.getInitialURL().then((u) => {
            if (u !== null) {
                console.log("SPLASH SCREEN YOH: ")
                console.log(u)
                SGHelperGlobalVar.addVar('deepLinkingURL', u.toLowerCase())
            }
        });
        // OneSignal.promptForPushNotificationsWithUserResponse(response => {
        //     // console.log(response)
        // });
      

        this.baseRunSingleAPIWithRedoOption('APIMap', (async () => { return this._tableMapAPI() }).bind(this), ( async () => {
            if (!this.pending) {
                this.setState(prevState => ({ loadingStart: prevState.loadingStart + 1 }))
                if (this.versionExpired == false) {

                    SGHelperGlobalVar.addVar('GlobalLastSelectedPlace', { key: '', placeNameID: idJSON.globalText.defaultSelectedPlaceText, placeNameEN: enJSON.globalText.defaultSelectedPlaceText, placeNameCN: cnJSON.globalText.defaultSelectedPlaceText });
                    SGHelperGlobalVar.addVar('GlobalEnableAliceVoice', true);
                    await this._getAnonymous();
                   
                }
            }
        }).bind(this), null,  SGHelperGlobalVar.getVar("ResponTimes"));
  
    }

    async componentDidMount() {
      await this._getData()
      BackHandler.addEventListener('hardwareBackPress', this.onBackPress);
    }

    _askingVersion(screen) {
        // if(this._soundFinished){
            var stringMode = mode === "dev" ? "ALPHA" : mode.toUpperCase()
            var messageMode = mode === "dev" ? "TESTING INTERNAL" : 'TESTING EKSTERNAL'
            console.log(screen)
            

              if (mode !== 'live') {
                if (mode !== 'st') {
                    SGDialogBox.showFail(null, "Peringatan", "Anda sedang mengakses versi " + stringMode + " yang ditujuakan untuk " + messageMode + ".\n Semua perubahan di versi ini tidak menyebabkan perubahan pada versi di playstore/applestore",
                        "Oke, Saya Mengerti", () => { setTimeout(() => {  SGHelperNavigation.navigateReset(this.props.navigation, screen,{})}, 100) }, true
                    )
                }else {
                    SGHelperNavigation.navigateReset(this.props.navigation, screen,{})
                }
              } else {
                  SGHelperNavigation.navigateReset(this.props.navigation, screen,{})
              }    
            
            
        // } else {
        //     setTimeout((()=>{this._askingVersion(screen)}).bind(this),250);
        // }
    }

    componentWillUnmount() {
        clearTimeout(this.timeoutHandle); // This is just necessary in the case that the screen is closed before the timeout fires, otherwise it would cause a memory leak that would trigger the transition regardless, breaking the user experience.
        BackHandler.removeEventListener('hardwareBackPress', this.onBackPress);
    }

    onBackPress(){
        SGDialogBox.showConfirmation(null, SGLocalize.translate('ExitApp.ExitAppTitle'), SGLocalize.translate('ExitApp.ExitAppDesc'), SGLocalize.translate('ExitApp.No2'), () => { console.log('Close') },SGLocalize.translate('ExitApp.Yes2'), () => {RNExitApp.exitApp()}, true)
        return true;
    }
    
    _generateStyle(){
        if(this.sponsorData.length >=1 && this.sponsorData.length <=3){
            return this.style.style1
        }else if(this.sponsorData.length >=4 && this.sponsorData.length <=6){
            return this.style.style2
        }else if(this.sponsorData.length >=7 && this.sponsorData.length <=9){
            return this.style.style3
        }
    }
    render() {
        var { w, h, p } = this.WHP;
        var style = this.style;
       
        return (
            <RootView accessible={true} accessibilityLabel={'SplashScreenRootView'} style={style.mainView1}>
                {/* {this.alreadyMount && */}
                    <View accessible={true} accessibilityLabel={'SplashScreenImageContainerView'} style={style.imageCont1}>
                        <View style={{width:w,flex:1,justifyContent:'center'}}>
                            <Image accessible accessibilityLabel={'SplashScreenLogoImage'} style={style.image1} source={this._logo[this._i]} onLoad={(()=>{SGHelperSoundPlayer.playSFX(require('../../asset/spotgue_sound.m4a'),0,()=>{this._soundFinished=true;})}).bind(this)} >
                            </Image>
                            <Text accessible={true} accessibilityLabel={'SplashScreenTagLineText'} preset={Text.preset.titleH3} style={style.text1} >{SGLocalize.translate("splashScreen.tagLine")}</Text>
                            <View style={style.container}>
                                <View style={{ height: w * 0.015, width: (w * 0.35) * this.state.loadingStart / this.state.loadingEnd, backgroundColor: 'rgb(205,205,205)', justifyContent: 'flex-start' }}></View>
                            </View>
                        </View>
                        {this.sponsorData.length !==0 &&
                        <View style={{position:'absolute',bottom:30}}> 
                            {SGHelperType.isDefined(SGHelperGlobalVar.getVar('SysParam')) &&
                            SGHelperType.getSystemParamsValue('ShowTextPoweredBy') =='Y' &&
                              <Text preset={Text.preset.h8B} style={style.textSponsorship}>{SGLocalize.translate("splashScreen.SponsorText")}</Text>
                            }
                           <View style={this._generateStyle()}>
                                <FlatList  scrollEnabled={false} showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false}
                                    contentContainerStyle={{flexDirection:'column'}} style={{height:w*0.45}}  numColumns={3} data={this.sponsorData}  renderItem={({ item }) => {
                                        return (  
                                            <Image style={style.vSponsorship} source={{ uri:  item['fContentID'].fSponsorImageJSON[0].high.uri  }} />  
                                        );
                                        }} keyExtractor={item => item.fID}>
                                </FlatList>
                            </View>
                        </View>
                        }
                    </View>
                {/* } */}
                 <View style={{ width: '100%', height: SGHelperWindow.getFooterHeight(),backgroundColor:'transparent' }}></View>
                 <View style={{ width: '100%', height: SGHelperWindow.getFooterHeight(),backgroundColor:'transparent' }}></View>
                {/* {this.alreadyMount && */}
                    <View style={{ position:'absolute',bottom:15}}><Text preset={Text.preset.titleH4} style={{ color: 'rgb(144,144,144)' }}>{version} ({mode})</Text></View>
                {/* } */}
            </RootView>
        );
    }
}


