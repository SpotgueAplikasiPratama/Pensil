/*
Version 1.1.0
  change by Melvin, 2 Maret 2021, Changing UI Announcement Pop Up
  change by Melvin, 8 Maret 2021, Add Interval Expired Version
  //..
*/

import React from 'react';
import { StyleSheet, Dimensions, Animated, AppState, Linking, RefreshControl, BackHandler } from 'react-native';
import { SGView as View, SGRootView as RootView, SGText as Text, SGTabView as TabView, SGScrollView as ScrollView, SGImage as Image, SGPopView, SGDialogBox, SGActivityIndicator as ActivityIndicator, SGButton as Button, SGViewPager as ViewPager, SGTouchableOpacity as TouchableOpacity, SGIcon as Icon, SGFlatList as FlatList,SGWebView as WebView } from '../../../core/control';
import { HomeSearchHeader } from '../../component_V2/HomeSearchHeader';
import { SGBaseScreen } from '../../../core/screen/SGBaseScreen';
import { PlaceEventSlider } from '../../container_V2/PlaceEventSlider';
import { PlaceSlider } from '../../container_V2/PlaceSlider';
import { AuctionSlider } from '../../container_V2/AuctionSlider'
import { StorePromoSlider } from '../../container_V2/StorePromoSlider';
import { StoreSlider } from '../../container_V2/StoreSlider';
import { RestoPromoSlider } from '../../container_V2/RestoPromoSlider';
import { RestoSlider } from '../../container_V2/RestoSlider';
import { SponsorshipSlider } from '../../container_V2/SponsorshipSlider';
import { BottomNavigationContainer } from '../../component_V2/BottomNavigationContainer';
import { SGHelperNavigation, SGHelperGlobalVar, SGHelperWindow, SGHelperStyle, SGHelperType, SGHelperErrorHandling, SGHelperDB,SGHelperOneSignal } from '../../../core/helper';
import { SGHelperAPICall } from '../../../core/helper/SGHelperAPICall'
import { SGLocalize } from '../../locales/SGLocalize';
import { AddFavoritePopUp } from '../../container_V2/AddFavoritePopUp';
import { tbVUserFavoriteAPI } from '../../api/tbVUserFavoriteAPI';
import { VtrendingAPI } from '../../api/VtrendingAPI';
import { VGroupAPI } from '../../api/VGroupAPI';
import { tbVWaitingListAPI } from '../../api/tbVWaitingListAPI';
import { tbVReservationAPI } from '../../api/tbVReservationAPI';
import { tbVUserSearchHistoryAPI } from '../../api/tbVUserSearchHistoryAPI';
import { DefaultGroupCard } from '../../container_V2/DefaultGroupCard';
import { tbVAnnouncementAPI } from '../../api/tbVAnnouncementAPI';
import { tbVNotificationAPI } from '../../api/tbVNotificationAPI';
import { tbVUserAPI } from '../../api/tbVUserAPI';
import { tbCCommentAPI } from '../../api/tbCCommentAPI';
import DeviceInfo from 'react-native-device-info';
import { tbSystemParamsDAO, tbSystemParamsData } from '../../db/tbSystemParamsDAO';
import { tbCOneSignalAPI } from '../../api/tbCOneSignalAPI';
import { tbCArrayOfLinksAPI } from '../../api/tbCArrayOfLinksAPI';
import RNExitApp from 'react-native-exit-app';
import { VSpyAPI } from '../../api/VSpyAPI';
import { announcementDAO } from '../../db/announcementDAO';
import { tbVEventSponsorshipAPI } from '../../api/tbVEventSponsorshipAPI';
import { Platform } from 'react-native';
import image from '../../asset/image';
import {mode} from '../../../../app.json';
import RNFetchBlob from 'react-native-blob-util';
import { visitorTableID } from '../../../../app.json';

import tbVMainHomeVisitorAPI from '../../../plugin/plugin1/api/tbVMainHomeVisitorAPI'
import SpotgueAppMyCardSlider from '../../../plugin/plugin1/component/SpotgueAppMyCardSlider';

export class HomeScreen extends SGBaseScreen {


  getFilterDataWaitingListActive() {
    var date = new Date()
    return ([
      { name: 'fStatus', operator: '=', value: 'waiting', visible: false },
      { name: 'fResponResult', operator: '=', value: 'waiting', visible: false },
      { name: 'waitingfCreatedByID', operator: '=', value: this.currentUserData.fID, visible: false },
    ]);
  }

  getFilterDataWaiting() {
    var date = new Date()
    return ([
      { name: 'fStatus', operator: '=', value: 'called', visible: false },
      { name: 'fResponResult', operator: '=', value: 'waiting', visible: false },
      { name: 'waitingfCreatedByID', operator: '=', value: this.currentUserData.fID, visible: false },
    ]);
  }

  getFilterOnGoingData() {
    return ([
      { name: 'fStatus', operator: 'IN', value: ['waiting', 'cancel'], visible: false },
      { name: 'fResponResult', operator: '=', value: 'waiting', visible: false },
      { name: 'fBookDateTime', operator: '>=', value: new Date(), visible: false },
      { name: 'reservationfCreatedByID', operator: '=', value: this.currentUserData.fID, visible: false },
    ]);
  }

  getReservationReminder() {
    return ([
      { name: 'fTempStatus', operator: '=', value: 'N', visible: false },
      { name: 'fStatus', operator: '=', value: 'waiting', visible: false },
      { name: 'fResponResult', operator: '=', value: 'notified', visible: false },
      { name: 'fBookDateTime', operator: '>=', value: new Date(), visible: false },
      { name: 'reservationfCreatedByID', operator: '=', value: this.currentUserData.fID, visible: false },
    ]);
  }

  getPagingWaitingList() {
    var itemPerPage = SGHelperType.getPaging()
    return { paging: false, offset: this.pagingCounterWaitingList, totalPerPage: itemPerPage }
  }

  getPagingReservation() {
    var itemPerPage = SGHelperType.getPaging()
    return { paging: false, offset: this.pagingCounterReservation, totalPerPage: itemPerPage }
  }




  createStyleSheet = (whp) => {
    var { w, h, p } = whp;
    var sliderW; var sliderH;
    // if ((w - 24 * p) / (h * 0.45) > 1080 / 1393) {
    //   sliderH = h * 0.45;
    //   sliderW = 1080 / 1393 * sliderH;
    // } else {
    //   sliderW = w - 24 * p;
    //   sliderH = sliderW * 1393 / 1080;
    // }
    return StyleSheet.create({
      mainContainer: { width: w, height: h, backgroundColor: '#FFFFFF', justifyContent: 'flex-start' },
      throwWHP: { width: w, height: h, padding: p, backgroundColor: '#FFFFFF' },
      throwWHPGroupTab: { width: 1.5 * w, height: h, padding: p, backgroundColor: '#FFFFFF' },
      scrollView1: { flex: 1, width: w, marginTop: p * 2.5 },
      vfab: { backgroundColor: 'transparent', width: w * 0.2, height: w * 0.2, position: 'absolute', bottom: SGHelperWindow.getFooterHeight() + SGHelperWindow.getHeaderHeight() - 2 * p, right: w * 0.015, borderRadius: w * 0.6 },
      tabBarStyle: {backgroundColor:'rgba(255,255,255,0.9)', borderColor: '#E7E7E7', borderBottomWidth: 0.006 * w, width: w },
      noFavView: { flex: 1 },
      sadSmiley: { height: w * 0.325, width: w * 0.325, backgroundColor: 'transparent' },
      textEmpty: { color: '#d8d8d8' },
      sliderComponent: { width: w - 8 * p, height: w*1.5, backgroundColor: 'transparent' },
      sliderImage: { width: w-12*p, height:w*1.05, resizeMode: 'stretch',backgroundColor:'white' },
      sliderImageView: { width: w-12*p, flex:1, borderTopLeftRadius: 4 * p },
      sliderText: { width: w-12*p, height: w * 0.45, justifyContent: 'flex-start',backgroundColor:'white',borderBottomRightRadius:4*p,borderBottomLeftRadius:4*p },
      sliderwebView:{width: w-12*p,height:w*1.4,borderRadius:4*p},
      pageindicator:{position: 'absolute', bottom: 0 * p, flexDirection: 'row',backgroundColor:'transparent' },
      vClose: {position: 'absolute', right: -2.5*p, top: -2.5*p,zIndex: 999},
      buttonAnnouncement:{position:'absolute', top:w-3*p,width:w*0.4,height:w*0.1,backgroundColor:'rgba(38,38,38,0.95)',zIndex:999},
      buttonAnnouncementWebView:{position:'absolute', bottom:3*p,width:w*0.4,height:w*0.1,backgroundColor:'rgba(38,38,38,0.95)',zIndex:999},
      textViewPager: { alignSelf: 'flex-start',paddingLeft:2*p,paddingTop:4*p},
      textDescriptionViewPager: { alignSelf: 'flex-start',paddingLeft:2*p, paddingTop: 2 * p,paddingBottom:p },
      ViewPagerScrollView: { flex: 1 },
      vtabView: { width: w, height: h, padding: p },
      pdf: {
        flex: 1,
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
      },
      tabBarUnderlineStyle: { backgroundColor: '#1E1E1E' },
      vGroupOfTenantTabButton: { width: w, flexDirection: 'row', marginBottom: 4 },
      buttonGroupTenant: { width: (w - 2 * p) * 0.4, marginTop: 2 * p, marginBottom: 3 * p, borderRadius: 6 * p, marginHorizontal: 2 * p, minHeight: w * 0.1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#181818', color: "white" },
      buttonGroupTenant1: { width: (w - 2 * p) * 0.4, marginTop: 2 * p, marginBottom: 3 * p, borderRadius: 6 * p, marginHorizontal: 2 * p, minHeight: w * 0.1, alignItems: 'center', justifyContent: 'center', backgroundColor: 'white', color: "black" },
      textMyHealth: { color: '#63AEE0', marginRight: 3 * p },
      myReferralText: { color: '#63AEE0', marginLeft: 3 * p },
      starIconView: {overflow:null, width: w * 0.10, height: w * 0.06, justifyContent:'flex-end' },
      starIcon: { width: w * 0.06, height: w * 0.06, backgroundColor: 'transparent', paddingVertical: 0, paddingHorizontal: 0, marginHorizontal: 0, marginBottom: -1.5*p,   },
      vView2:{flex:1},

      //Card
      vCard2: {width: w, height: h, justifyContent: 'flex-start'},
      vCard3: {width: w, height: 0.12*w, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'},
    });
  }



  constructor(props, context, ...args) {
    super(props, context, ...args);
    this.style = this.createStyleSheet(this.WHPNoHeader);
    this.props.navigation.setOptions({
      headerShown: false,
    });
    this.anonymousMode = SGHelperGlobalVar.getVar('GlobalAnonymous');
    this.currentUser = SGHelperGlobalVar.getVar('GlobalCurrentUser');
    this.currentUserData = SGHelperGlobalVar.getVar('GlobalCurrentUserData');
    console.log('current user data')

    //Sponsorship
    this.eventSponsorship = '';

    //userFav
    this.favPlaceEventData = '';
    this.favPlaceData = '';
    this.favStorePromoData = '';
    this.favStoreData = '';
    this.favRestoPromoData = '';
    this.favRestoData = '';


    //trending
    this.trendingPlaceEventData = '';
    this.trendingPlaceData = '';
    this.trendingAuctionData = '';
    this.trendingStorePromoData = '';
    this.trendingStoreData = '';
    this.trendingRestoPromoData = '';
    this.trendingRestoData = '';

    //group
    this.groupTenantStoreData = '';
    this.groupTenantRestoData = '';

    this.alreadyMount = false;
    this.imageSetting = SGHelperGlobalVar.getVar('GlobalImageSetting');
    this.filterWaitingActiveData = this.getFilterDataWaitingListActive();
    this.filterWaitingData = this.getFilterDataWaiting();
    this.filterReservationData = this.getFilterOnGoingData();
    this.filterReservationReminder = this.getReservationReminder();
    this.pvID1 = SGPopView.getPopViewID();
    this.pvID2 = SGPopView.getPopViewID();

    //Deep Linking
    this._deepLinkingHandlerPushNotification = this._checkDeepLinkingHandlerPushNotification;
    this._deepLinkingHandlerShareMessage = this._checkDeepLinkingHandlerShareMessage
    this.searchHistoryData = [];

    //Group of Tenant
    this._tabView = React.createRef();
    this._hideTabView = true;
    this._tabIndex = 0;

    //Announcement
    this.tempAnnouncementData = [];
    this.AnnouncementData = [];
    this.globalShownAnnouncement = SGHelperGlobalVar.getVar('refreshAnnouncement');
    this.pvID = SGPopView.getPopViewID();

    //Reservation Reminder
    this.reservationReminder = '';
    // console.log(SGHelperGlobalVar.getVar('showRevervationReminder'));
    SGHelperType.isDefined(SGHelperGlobalVar.getVar('showRevervationReminder')) ? SGHelperGlobalVar.getVar('showRevervationReminder') : SGHelperGlobalVar.addVar('showRevervationReminder', true);

    //force logout
    this.forceLogOut = false;
    this.state = { appState: AppState.currentState, refreshFavorite: false, refreshTrending: false, refreshGroupOfTenant: false };

    this.showChangeProfilePrompt();

    this.cardData = '';
    this.pluginList = [];

  }

  _onChangeTab() {
    this.baseAnimateSlideIn();
    // this.forceUpdate();
  }

  _checkDeepLinkingHandlerPushNotification() {
    var url = SGHelperGlobalVar.getVar('deepLinkingURL')
    console.log("YOHANES1")
    console.log(url)
    if (url != null && url != '') {
      if (url.includes(SGHelperGlobalVar.getVar('UriScheme1'))) {
        var urischeme = SGHelperGlobalVar.getVar('UriScheme1')
        var app_link = url.split(urischeme);

        var link = app_link[1].split('/');
        // console.log(link[0])
        console.log("RESET")
        // SGHelperGlobalVar.addVar('deepLinkingURL', '');

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
            SGHelperNavigation.navigatePush(this.props.navigation, "NotificationDetail", { fID: link[1], fContentType: "Broadcast" });
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

  async componentDidMount() {
    //Deep Linking
    //this._testfunction();
    console.log('test function')
    this._checkDeepLinkingHandlerPushNotification();
    this._checkDeepLinkingHandlerShareMessage();
    SGHelperGlobalVar.addVar('deepLinkingURL', '');
    await this._onRefreshDataBooking();
    await this._checkingCallingAPI();
    this.showChangeProfilePrompt();

    this._unsubscribe = this.props.navigation.addListener('focus', async () => {
      this.showChangeProfilePrompt();
      await this._checkingCallingAPI();
      BackHandler.addEventListener('hardwareBackPress', this.onBackPress);
    });

    this._unsubscribe = this.props.navigation.addListener('blur', async () => {
      BackHandler.removeEventListener('hardwareBackPress', this.onBackPress);
      this.showChangeProfilePrompt();
    });

    AppState.addEventListener('change', this._handleAppStateChange);
    //check apps still active or not
    this.interval = setInterval(async () => {
      if (this.state.appState === "active") {
        this._checkingSpyMainHome();
        if (this.anonymousMode !== true) {
          if (SGHelperGlobalVar.getVar('GlobalCallWaitingList') == true || SGHelperGlobalVar.getVar('GlobalCallReservation') == true || SGHelperGlobalVar.getVar('GlobalReservationReminder') == true) {
            this._onRefreshDataBooking();
          }

        }
      }
    }, SGHelperType.getSysParamsValueToInt('HomeScreenVisitorInterval'));
    BackHandler.addEventListener('hardwareBackPress', this.onBackPress);
    if(mode==='dev') {this.loadPluginList();}
  }

  async _checkingData() {
    console.log('checkingData')
    if (this.DataGlobalVar.dateAPIVersion !== null) {
      if (SGHelperType.convertNewDate(SGHelperGlobalVar.getVar('dateAPIVersion')) < SGHelperType.convertNewDate(this.DataGlobalVar.dateAPIVersion)) {
        SGHelperAPICall.checkVisitorVersion(visitorTableID).then((v) => {
          var res = v;
          SGHelperGlobalVar.setVar("dateAPIVersion", new Date())
          if (res.data != "true") {
            SGDialogBox.showFail(null, SGLocalize.translate("globalText.FailText"), SGLocalize.translate('globalText.ExpiredVersion'), SGLocalize.translate("globalText.UpdateNow"), () => { this.linkDownload() }, true)
          }
        });
      }
    }
  }

  async _checkingSpyMainHome() {
    console.log('Spy Main Home')

    this.newThreadSpy = this.baseInitAPIParallel(SGHelperGlobalVar.getVar("ResponTimes"), (() => { this._checkingData(); }).bind(this),null,true,true);

    this.baseAddAPIParallel('getMainHomeSpy', (async () => { return VSpyAPI.SpyMainHome(); }).bind(this), ((v) => {
      console.log('run this spy main home')
      this.DataGlobalVar = v
     
    }).bind(this), null,this.newThreadSpy);

    if (SGHelperGlobalVar.getVar("APIMapStatus") === "Secondary") {
    this.baseAddAPIParallel('pingAzure', (async () => { return SGHelperAPICall.pingAzure(); }).bind(this), ((v) => {
      console.log('pingAzure success')
      // console.log(SGHelperGlobalVar.getVar("RTOCount"))
      // console.log(SGHelperGlobalVar.getVar("APIMapStatus"))
      // console.log(SGHelperGlobalVar.getVar("APIMap"))
    }).bind(this), null,this.newThreadSpy);
    }
    this.baseRunAPIParallel(this.newThreadSpy);
  }

  _handleAppStateChange = (nextAppState) => {
    if (
      this.state.appState.match(/inactive|background/) &&
      nextAppState === 'active'
    ) {
      console.log('App has come to the foreground!');
    }
    this.setState({ appState: nextAppState });

  };

  async _callBookingDialog() {
    if (this.checkDataWaitingList.length !== 0) {
      var dataWaitingList = { fID: this.checkDataWaitingList[0].waitingfID, fName: this.checkDataWaitingList[0].fName, fNumberPhone: this.checkDataWaitingList[0].fNumberPhone, fNumberOfPerson: this.checkDataWaitingList[0].fNumberOfPerson, fNotes: this.checkDataWaitingList[0].fNotes, fBookBy: this.checkDataWaitingList[0].fBookBy, fStatus: this.checkDataWaitingList[0].fStatus, fBookDateTime: this.checkDataWaitingList[0].fBookDateTime, fCallDateTime: this.checkDataWaitingList[0].fCallDateTime, fResponDateTime: this.checkDataWaitingList[0].fResponDateTime, fResponResult: 'notified', fCancelBy: this.checkDataWaitingList[0].fCancelBy, fDoneDateTime: this.checkDataWaitingList[0].fDoneDateTime, fStoreKey: this.checkDataWaitingList[0].fStoreKey, fSearchKey: this.checkDataWaitingList[0].fSearchKey, fCreatedBy: this.checkDataWaitingList[0].waitingfCreatedBy, fCreatedByID: this.checkDataWaitingList[0].waitingfCreatedByID, fCreatedDate: this.checkDataWaitingList[0].waitingfCreatedDate, fLastModifiedBy: this.checkDataWaitingList[0].waitingfLastModifiedBy, fLastModifiedByID: this.checkDataWaitingList[0].waitingfLastModifiedByID, fLastModifiedDate: this.checkDataWaitingList[0].waitingfLastModifiedDate, fExpiredDate: this.checkDataWaitingList[0].waitingfExpiredDate };
      var res = await tbVWaitingListAPI.updateCallWaitingListVisitor(dataWaitingList);
      SGDialogBox.showConfirmation(null, SGLocalize.translate('globalText.ConfirmationText'), SGLocalize.translate('globalText.WaitingListText1') + ' ' + this.checkDataWaitingList[0]['fStoreName' + this.Language.toUpperCase()] + ' ' + this.checkDataWaitingList[0]['fBuildingName' + this.Language.toUpperCase()] + ' ' + SGLocalize.translate('globalText.WaitingListText2'),
        SGLocalize.translate('globalText.no'), async () => {
          dataWaitingList.fResponResult = 'reject';
          var res = await tbVWaitingListAPI.updateCallWaitingListVisitor(dataWaitingList);
          this.checkDataWaitingList.splice(0, 1)
          if (res.respInfo.status === 204) SGDialogBox.showSuccess(null, SGLocalize.translate("AlertMessage.Success"), SGLocalize.translate("AlertMessage.AlertWaitingListSuccessReject"), SGLocalize.translate("AlertMessage.OK"), async () => { await this._callBookingDialog() }, true)
          else SGDialogBox.showFail(null, SGLocalize.translate("AlertMessage.Fail"), SGLocalize.translate("AlertMessage.AlertWaitingListFailReject"), SGLocalize.translate("AlertMessage.OK"), async () => { await this._callBookingDialog() }, true)
          if (this.checkDataWaitingList.length == 0) {
            SGHelperGlobalVar.setVar('GlobalCallWaitingList', false);
          }
        },
        SGLocalize.translate('globalText.yes'), async () => {
          dataWaitingList.fResponResult = 'attend';
          var res = await tbVWaitingListAPI.updateCallWaitingListVisitor(dataWaitingList);
          this.checkDataWaitingList.splice(0, 1)
          if (res.respInfo.status === 204) SGDialogBox.showSuccess(null, SGLocalize.translate("AlertMessage.Success"), SGLocalize.translate("AlertMessage.AlertWaitingListSuccessAccept"), SGLocalize.translate("AlertMessage.OK"), async () => { await this._callBookingDialog() }, true)
          else SGDialogBox.showFail(null, SGLocalize.translate("AlertMessage.Fail"), SGLocalize.translate("AlertMessage.AlertWaitingListFailAccept"), SGLocalize.translate("AlertMessage.OK"), async () => { await this._callBookingDialog() }, true)
          if (this.checkDataWaitingList.length == 0) {
            SGHelperGlobalVar.setVar('GlobalCallWaitingList', false);
          }
        })
    }
    else if (this.checkDataReservation.length !== 0) {
      // console.log(this.checkDataReservation[0].reservationfLastModifiedByID)
      // console.log(this.currentUserData.fID)
      if (this.checkDataReservation[0].reservationfLastModifiedByID !== this.currentUserData.fID) {
        // console.log('not same')
        var dataReservation = { fID: this.checkDataReservation[0].reservationfID, fName: this.checkDataReservation[0].fName, fNumberPhone: this.checkDataReservation[0].fNumberPhone, fNumberOfPerson: this.checkDataReservation[0].fNumberOfPerson, fNotes: this.checkDataReservation[0].fNotes, fTempStatus: this.checkDataReservation[0].fTempStatus, fBookBy: this.checkDataReservation[0].fBookBy, fStatus: this.checkDataReservation[0].fStatus, fBookDate: this.checkDataReservation[0].fBookDate, fBookTime: this.checkDataReservation[0].fBookTime, fBookDateTime: this.checkDataReservation[0].fBookDateTime, fResponTime: this.checkDataReservation[0].fResponTime, fResponResult: 'notified', fCancelBy: this.checkDataReservation[0].fCancelBy, fDoneDateTime: this.checkDataReservation[0].fDoneDateTime, fStoreKey: this.checkDataReservation[0].fStoreKey, fSearchKey: this.checkDataReservation[0].fSearchKey, fCreatedBy: this.checkDataReservation[0].reservationfCreatedBy, fCreatedByID: this.checkDataReservation[0].reservationfCreatedByID, fCreatedDate: this.checkDataReservation[0].reservationfCreatedDate, fLastModifiedBy: this.checkDataReservation[0].reservationfLastModifiedBy, fLastModifiedByID: this.checkDataReservation[0].reservationfLastModifiedByID, fLastModifiedDate: this.checkDataReservation[0].reservationfLastModifiedDate, fExpiredDate: this.checkDataReservation[0].reservationfExpiredDate, fPushNotification: this.checkDataReservation[0].fPushNotification };
        var dataTempReservation = this.checkDataReservation[0];
        if (this.checkDataReservation[0].fTempStatus === 'N') {
          if (this.checkDataReservation[0].fStatus === 'waiting') {
            var res = await tbVReservationAPI.updateCallReservationVisitor(dataReservation);
            this.checkDataReservation.splice(0, 1);
            if (res.respInfo.status === 204)
              SGDialogBox.showSuccess(null, SGLocalize.translate("AlertMessage.Success"), SGLocalize.translate('globalText.ReservationText1') + ' ' + dataTempReservation['fStoreName' + this.Language.toUpperCase()] + ' ' + dataTempReservation['fBuildingName' + this.Language.toUpperCase()] + ' ' + SGLocalize.translate('globalText.ReservationTextAccept'), SGLocalize.translate("AlertMessage.OK"), async () => {
                if (this.checkDataReservation.length == 0) {
                  SGHelperGlobalVar.setVar('GlobalCallReservation', false);
                }
                //Triggered Calling Reminder On When Reservation has been accepted
                if (!SGHelperType.isDefined(SGHelperGlobalVar.getVar('GlobalReservationReminder'))) {
                  SGHelperGlobalVar.addVar('GlobalReservationReminder', true)
                } else {
                  SGHelperGlobalVar.addVar('GlobalReservationReminder', true)
                }
                await this._callBookingDialog()
              }, true)
          } else if (this.checkDataReservation[0].fStatus === 'cancel') {
            var res = await tbVReservationAPI.updateCallReservationVisitor(dataReservation);
            this.checkDataReservation.splice(0, 1)
            if (res.respInfo.status === 204) {

              SGDialogBox.showWarning(null, "", SGLocalize.translate('globalText.ReservationText1') + ' ' + dataTempReservation['fStoreName' + this.Language.toUpperCase()] + ' ' + dataTempReservation['fBuildingName' + this.Language.toUpperCase()] + ' ' + SGLocalize.translate('globalText.ReservationTextReject'), SGLocalize.translate("AlertMessage.OK"), async () => { await this._callBookingDialog() }, true)
              if (this.checkDataReservation.length == 0) {
                SGHelperGlobalVar.setVar('GlobalCallReservation', false);
              }
            }

          }
        }
      }
    }

    //reminder reservation
    else if (this.dataReservationReminder.length !== 0) {
      var dateBook = SGHelperType.convertNewDate(this.dataReservationReminder[0].fBookDateTime);
      var date1 = new Date(dateBook.getFullYear(), dateBook.getMonth(), dateBook.getDate(), dateBook.getHours(), dateBook.getMinutes() - this.reservationReminder, 0)
      var dateNow = new Date();
      if (SGHelperType.formatDateTime(dateNow) >= SGHelperType.formatDateTime(date1)) {
        if (SGHelperGlobalVar.getVar('showRevervationReminder') == true) {
          SGHelperGlobalVar.setVar('showRevervationReminder', false);
          var tempDataReservationReminder = this.dataReservationReminder[0];
          this.dataReservationReminder.splice(0, 1)
          SGDialogBox.showConfirmation(null, SGLocalize.translate('AlertMessage.Confirmation'), SGLocalize.translate('globalText.ReservationReminder1') + ' ' + tempDataReservationReminder['fStoreName' + this.Language.toUpperCase()] + ' ' + tempDataReservationReminder['fBuildingName' + this.Language.toUpperCase()] + ' ' + SGHelperType.formatDate(SGHelperType.convertNewDate(tempDataReservationReminder.fBookDateTime)) + ' ' + SGHelperType.formatTime(SGHelperType.convertNewDate(tempDataReservationReminder.fBookDateTime)) + ' ' + SGLocalize.translate('globalText.ReservationReminder2'), SGLocalize.translate("AlertMessage.Cancel"),
            async () => {
              var dataReservation = { fID: tempDataReservationReminder.reservationfID, fName: tempDataReservationReminder.fName, fNumberPhone: tempDataReservationReminder.fNumberPhone, fNumberOfPerson: tempDataReservationReminder.fNumberOfPerson, fNotes: tempDataReservationReminder.fNotes, fTempStatus: tempDataReservationReminder.fTempStatus, fBookBy: tempDataReservationReminder.fBookBy, fStatus: tempDataReservationReminder.fStatus, fBookDate: tempDataReservationReminder.fBookDate, fBookTime: tempDataReservationReminder.fBookTime, fBookDateTime: tempDataReservationReminder.fBookDateTime, fResponTime: tempDataReservationReminder.fResponTime, fResponResult: 'reject', fCancelBy: tempDataReservationReminder.fCancelBy, fDoneDateTime: tempDataReservationReminder.fDoneDateTime, fStoreKey: tempDataReservationReminder.fStoreKey, fSearchKey: tempDataReservationReminder.fSearchKey, fCreatedBy: tempDataReservationReminder.reservationfCreatedBy, fCreatedByID: tempDataReservationReminder.reservationfCreatedByID, fCreatedDate: tempDataReservationReminder.reservationfCreatedDate, fLastModifiedBy: tempDataReservationReminder.reservationfLastModifiedBy, fLastModifiedByID: tempDataReservationReminder.reservationfLastModifiedByID, fLastModifiedDate: tempDataReservationReminder.reservationfLastModifiedDate, fExpiredDate: tempDataReservationReminder.reservationfExpiredDate, fPushNotification: tempDataReservationReminder.fPushNotification };
              var tempReservation = tempDataReservationReminder;
              SGHelperGlobalVar.setVar('showRevervationReminder', true);
              var res = await tbVReservationAPI.updateCallReservationVisitor(dataReservation);
              if (res.respInfo.status === 204) {
                SGDialogBox.showFail(null, SGLocalize.translate("AlertMessage.Fail"), SGLocalize.translate('globalText.ReservationText1') + ' ' + tempReservation['fStoreName' + this.Language.toUpperCase()] + ' ' + tempReservation['fBuildingName' + this.Language.toUpperCase()] + ' ' + SGLocalize.translate('globalText.AttendTextReminderCancel'), SGLocalize.translate("AlertMessage.OK"), async () => { }, true)
                if (this.dataReservationReminder.length !== 0) {
                  SGHelperGlobalVar.addVar('GlobalReservationReminder', false)
                }
              }
            }, SGLocalize.translate("AlertMessage.OK"),
            async () => {
              var dataReservation = { fID: tempDataReservationReminder.reservationfID, fName: tempDataReservationReminder.fName, fNumberPhone: tempDataReservationReminder.fNumberPhone, fNumberOfPerson: tempDataReservationReminder.fNumberOfPerson, fNotes: tempDataReservationReminder.fNotes, fTempStatus: tempDataReservationReminder.fTempStatus, fBookBy: tempDataReservationReminder.fBookBy, fStatus: tempDataReservationReminder.fStatus, fBookDate: tempDataReservationReminder.fBookDate, fBookTime: tempDataReservationReminder.fBookTime, fBookDateTime: tempDataReservationReminder.fBookDateTime, fResponTime: tempDataReservationReminder.fResponTime, fResponResult: 'attend', fCancelBy: tempDataReservationReminder.fCancelBy, fDoneDateTime: tempDataReservationReminder.fDoneDateTime, fStoreKey: tempDataReservationReminder.fStoreKey, fSearchKey: tempDataReservationReminder.fSearchKey, fCreatedBy: tempDataReservationReminder.reservationfCreatedBy, fCreatedByID: tempDataReservationReminder.reservationfCreatedByID, fCreatedDate: tempDataReservationReminder.reservationfCreatedDate, fLastModifiedBy: tempDataReservationReminder.reservationfLastModifiedBy, fLastModifiedByID: tempDataReservationReminder.reservationfLastModifiedByID, fLastModifiedDate: tempDataReservationReminder.reservationfLastModifiedDate, fExpiredDate: tempDataReservationReminder.reservationfExpiredDate, fPushNotification: tempDataReservationReminder.fPushNotification };
              var tempReservation = tempDataReservationReminder;
              SGHelperGlobalVar.setVar('showRevervationReminder', true);
              var res = await tbVReservationAPI.updateCallReservationVisitor(dataReservation);
              if (res.respInfo.status === 204) {
                SGDialogBox.showSuccess(null, SGLocalize.translate("AlertMessage.Success"), SGLocalize.translate('globalText.ReservationText1') + ' ' + tempReservation['fStoreName' + this.Language.toUpperCase()] + ' ' + tempReservation['fBuildingName' + this.Language.toUpperCase()] + ' ' + SGLocalize.translate('globalText.AttendTextReminderAttend'), SGLocalize.translate("AlertMessage.OK"), async () => { }, true)
                if (this.dataReservationReminder.length !== 0) {
                  SGHelperGlobalVar.addVar('GlobalReservationReminder', false)
                }
              }
            })
        }
      }
    }
  }

  async _checkingCallingAPI() {
    // console.log(this.props.route.params.signIn);
    if (SGHelperType.isDefined(this.props.route.params.signIn)) {
      console.log('from sign in')
      await this._onRefreshAllItem();
    } else {
      if (SGHelperGlobalVar.getVar('firstTimeLoading') === null || SGHelperGlobalVar.getVar('firstTimeLoading') === false) {
        console.log('1 first time')
        await this._onRefreshAllItemGlobalVar();
        SGHelperGlobalVar.addVar('firstTimeLoading', true);
      } else {
        console.log('2 not first time')
        await this._onRefreshAllItem();
      }
    }
  }

  async _signOut() {

    this.userTokenData = await tbSystemParamsDAO.getUserDataToken();
    this.userDataSetting = await tbSystemParamsDAO.getUserDataSetting();
    await tbSystemParamsDAO.updateLogout(this.userTokenData, this.userDataSetting);

    SGHelperOneSignal.getDeviceState().then((status) => {
      tbCOneSignalAPI.removeOneSignalNotificationTags(status.userId);
      SGHelperNavigation.navigateReset(this.props.navigation, "Splash");
    })
  }

  async checkAPIBatchStatusAllDone1() {
    await this._reservationGetTimeReminder();
    await this._callBookingDialog();
  }

  async checkAPIBatchStatusAllDone2() {
    if (this.checkDataWaitingList.length !== 0) {
      SGHelperGlobalVar.addVar('GlobalCallWaitingList', true)
    }
    if (this.checkDataReservation.length !== 0) {
      SGHelperGlobalVar.addVar('GlobalCallReservation', true)
    }
    if (this.dataReservationReminder.length !== 0) {
      SGHelperGlobalVar.addVar('GlobalReservationReminder', true)
    }
    this.forceUpdate();
  }


  linkDownload() {
    var linkIOS =SGHelperType.getSystemParamsValue('LinkAppStore');
    var linkAndroid =SGHelperType.getSystemParamsValue('LinkPlayStore');
    SGHelperGlobalVar.setVar('showVersionExpired', false);
    if (Platform.OS === 'ios') {
      this.handleLink(linkIOS)
    } else {
      this.handleLink(linkAndroid)
    }
  }


  handleLink(url) {
    Linking.canOpenURL(url
    ).then(supported => {
      if (supported) {
        Linking.openURL(url);
      } else {
        SGDialogBox.showWebView(url,()=>{});
      }
    });
  };

  async _onRefreshAllItemGlobalVar() {

    if (SGHelperType.isDefined(SGHelperGlobalVar.getVar('getUserFavPlaceEventSlider')) &&
      SGHelperType.isDefined(SGHelperGlobalVar.getVar('getUserFavPlaceSlider')) &&
      SGHelperType.isDefined(SGHelperGlobalVar.getVar('getUserFavStorePromoSlider')) &&
      SGHelperType.isDefined(SGHelperGlobalVar.getVar('getUserFavStoreSlider')) &&
      SGHelperType.isDefined(SGHelperGlobalVar.getVar('getUserFavRestoPromoSlider')) &&
      SGHelperType.isDefined(SGHelperGlobalVar.getVar('getUserFavRestoSlider')) &&
      SGHelperType.isDefined(SGHelperGlobalVar.getVar('getUserSearchHistory')) &&
      SGHelperType.isDefined(SGHelperGlobalVar.getVar('getUserTrendingPlaceEventSlider')) &&
      SGHelperType.isDefined(SGHelperGlobalVar.getVar('getUserTrendingPlaceSlider')) &&
      SGHelperType.isDefined(SGHelperGlobalVar.getVar('getUserTrendingStorePromoSlider')) &&
      SGHelperType.isDefined(SGHelperGlobalVar.getVar('getUserTrendingStoreSlider')) &&
      SGHelperType.isDefined(SGHelperGlobalVar.getVar('getUserTrendingRestoPromoSlider')) &&
      SGHelperType.isDefined(SGHelperGlobalVar.getVar('getUserTrendingRestoSlider')) &&
      SGHelperType.isDefined(SGHelperGlobalVar.getVar('getGroupTenantOfStore')) &&
      SGHelperType.isDefined(SGHelperGlobalVar.getVar('getGroupTenantOfResto')) &&
      SGHelperType.isDefined(SGHelperGlobalVar.getVar('getAnnouncementData')) &&
      SGHelperType.isDefined(SGHelperGlobalVar.getVar('getEventSponsorshipSlider')) &&
      SGHelperType.isDefined(SGHelperGlobalVar.getVar('getLoyaltyCardData'))
    ) {
      console.log('defined')
      this.favPlaceEventData = SGHelperGlobalVar.getVar('getUserFavPlaceEventSlider')
      this.favPlaceData = SGHelperGlobalVar.getVar('getUserFavPlaceSlider')
      this.favStorePromoData = SGHelperGlobalVar.getVar('getUserFavStorePromoSlider')
      this.favStoreData = SGHelperGlobalVar.getVar('getUserFavStoreSlider')
      this.favRestoPromoData = SGHelperGlobalVar.getVar('getUserFavRestoPromoSlider')
      this.favRestoData = SGHelperGlobalVar.getVar('getUserFavRestoSlider')
      this.searchHistoryData = SGHelperGlobalVar.getVar('getUserSearchHistory')
      this.trendingPlaceEventData = SGHelperGlobalVar.getVar('getUserTrendingPlaceEventSlider')
      this.trendingPlaceData = SGHelperGlobalVar.getVar('getUserTrendingPlaceSlider')
      this.trendingAuctionData = SGHelperGlobalVar.getVar('getUserTrendingAuctionSlider')
      this.trendingStorePromoData = SGHelperGlobalVar.getVar('getUserTrendingStorePromoSlider')
      this.trendingStoreData = SGHelperGlobalVar.getVar('getUserTrendingStoreSlider')
      this.trendingRestoPromoData = SGHelperGlobalVar.getVar('getUserTrendingRestoPromoSlider')
      this.trendingRestoData = SGHelperGlobalVar.getVar('getUserTrendingRestoSlider')
      this.groupTenantStoreData = SGHelperGlobalVar.getVar('getGroupTenantOfStore')
      this.groupTenantRestoData = SGHelperGlobalVar.getVar('getGroupTenantOfResto')
      this.tempAnnouncementData = SGHelperGlobalVar.getVar('getAnnouncementData')
      this.eventSponsorship = SGHelperGlobalVar.getVar('getEventSponsorshipSlider')
      this.cardData = SGHelperGlobalVar.getVar('getLoyaltyCardData')
      await this.checkAPIBatchStatusAllDone();
    } else {
      console.log('not defined')
      await this._onRefreshAllItem();
    }
  }

  async _onRefreshAllItem() {
    console.log('refresh all')
    this.thread1 = this.baseInitAPIParallel(SGHelperGlobalVar.getVar("ResponTimes"), (() => { this.checkAPIBatchStatusAllDone(); }).bind(this), null,true, true);

    if (this.currentUserData.fID !== 'anonymous') {
      this.baseAddAPIParallel('getUserFavPlaceEventSlider', (async () => { return tbVUserFavoriteAPI.getUserFavPlaceEventSlider() }).bind(this), ((v) => {
        this.favPlaceEventData = v;
        SGHelperGlobalVar.setVar('getUserFavPlaceEventSlider', v);
      }).bind(this),null,this.thread1);
      this.baseAddAPIParallel('getUserFavPlaceSlider', (async () => { return tbVUserFavoriteAPI.getUserFavPlaceSlider() }).bind(this), ((v) => {
        this.favPlaceData = v;
        SGHelperGlobalVar.setVar('getUserFavPlaceSlider', v);
      }).bind(this), null,this.thread1);
      this.baseAddAPIParallel('getUserFavStorePromoSlider', (async () => { return tbVUserFavoriteAPI.getUserFavStorePromoSlider() }).bind(this), ((v) => {
        this.favStorePromoData = v;
        SGHelperGlobalVar.setVar('getUserFavStorePromoSlider', v);
      }).bind(this), null,this.thread1);
      this.baseAddAPIParallel('getUserFavStoreSlider', (async () => { return tbVUserFavoriteAPI.getUserFavStoreSlider() }).bind(this), ((v) => {
        this.favStoreData = v;
        SGHelperGlobalVar.setVar('getUserFavStoreSlider', v);
      }).bind(this), null,this.thread1);
      this.baseAddAPIParallel('getUserFavRestoPromoSlider', (async () => { return tbVUserFavoriteAPI.getUserFavRestoPromoSlider() }).bind(this), ((v) => {
        this.favRestoPromoData = v;
        SGHelperGlobalVar.setVar('getUserFavRestoPromoSlider', v);
      }).bind(this), null,this.thread1);
      this.baseAddAPIParallel('getUserFavRestoSlider', (async () => { return tbVUserFavoriteAPI.getUserFavRestoSlider() }).bind(this), ((v) => {
        this.favRestoData = v;
        SGHelperGlobalVar.setVar('getUserFavRestoSlider', v);
      }).bind(this), null,this.thread1);
      this.baseAddAPIParallel('getUserSearchHistory', (async () => { return tbVUserSearchHistoryAPI.getUserSearchHistory() }).bind(this), ((v) => {
        this.searchHistoryData = v;
        SGHelperGlobalVar.addVar('getUserSearchHistory', v);
      }).bind(this), null,this.thread1);

      //Sponsorship
      this.baseAddAPIParallel('getUserSearchEventSponsorshipSlider', (async () => { return tbVEventSponsorshipAPI.searchEventSponsorshipSlider() }).bind(this), ((v) => {
        console.log('event Sponsorship');
        console.log(v);
        this.eventSponsorship = v;
        SGHelperGlobalVar.addVar('getEventSponsorshipSlider', v);
      }).bind(this), null,this.thread1);

      this.baseAddAPIParallel('notificationLength', (async (v1, v2) => { return tbVNotificationAPI.notificationLength(v1, v2) }).bind(this, [{ name: 'fUserKey', operator: '=', value: this.currentUserData.fID }, { name: 'fRead', operator: '=', value: 'N' }], []), ((v) => {
        if (v >= 10) {
          SGHelperGlobalVar.setVar("Notification", "9+")
        } else {
          SGHelperGlobalVar.setVar("Notification", v.toString())
        }
      }).bind(this), null,this.thread1);
      this.baseAddAPIParallel('inboxLength', (async (v1, v2) => { return tbCCommentAPI.inboxLength(v1, v2) }).bind(this, [{ name: 'fCreatedBy', operator: '=', value: this.currentUserData.fID }, { name: 'fReadCreator', operator: '=', value: 'N' }], []), ((v) => {
        if (v >= 10) {
          SGHelperGlobalVar.setVar("Inbox", "9+")
        } else {
          SGHelperGlobalVar.setVar("Inbox", v.toString())
        }
      }).bind(this), null,this.thread1);

      // Call API get Card Data
      this.baseAddAPIParallel('SearchMyLoyaltyCardSlider', (async () => { return tbVMainHomeVisitorAPI.SearchMyLoyaltyCardSlider() }).bind(this), ((v) => {
        this.cardData = v
        for(var i = 0 ; i < v.length; i++){
          this.cardData[i].fJSONPoint = JSON.parse(this.cardData[i].fJSONPoint)
          this.cardData[i].fJSONNumber = JSON.parse(this.cardData[i].fJSONNumber)
          this.cardData[i].fJSONName = JSON.parse(this.cardData[i].fJSONName)
          this.cardData[i].fJSONValidNumber = JSON.parse(this.cardData[i].fJSONValidNumber)
          this.cardData[i].fJSONExpiredDate = JSON.parse(this.cardData[i].fJSONExpiredDate)
        }
        SGHelperGlobalVar.setVar('getLoyaltyCardData', this.cardData);
      }).bind(this), null, this.thread1 );
    }

    //trending data
    this.baseAddAPIParallel('getUserTrendingPlaceEventSlider', (async () => { return VtrendingAPI.getUserTrendingPlaceEventSlider() }).bind(this), ((v) => {
      this.trendingPlaceEventData = v;
      SGHelperGlobalVar.addVar('getUserTrendingPlaceEventSlider', v);
    }).bind(this), null,this.thread1);
    this.baseAddAPIParallel('getUserTrendingPlaceSlider', (async () => { return VtrendingAPI.getUserTrendingPlaceSlider() }).bind(this), ((v) => {
      this.trendingPlaceData = v;
      console.log('trending place ------')
      console.log(this.trendingPlaceData)
      SGHelperGlobalVar.addVar('getUserTrendingPlaceSlider', v);
    }).bind(this), null,this.thread1);
    this.baseAddAPIParallel('getUserTrendingAuctionSlider', (async () => { return VtrendingAPI.getUserTrendingAuctionSlider() }).bind(this), ((v) => {
      this.trendingAuctionData = v;
      SGHelperGlobalVar.addVar('getUserTrendingAuctionSlider', v);
    }).bind(this), null,this.thread1);
    this.baseAddAPIParallel('getUserTrendingStorePromoSlider', (async () => { return VtrendingAPI.getUserTrendingStorePromoSlider() }).bind(this), ((v) => {
      this.trendingStorePromoData = v;
      SGHelperGlobalVar.addVar('getUserTrendingStorePromoSlider', v);
    }).bind(this), null,this.thread1);
    this.baseAddAPIParallel('getUserTrendingStoreSlider', (async () => { return VtrendingAPI.getUserTrendingStoreSlider() }).bind(this), ((v) => {
      this.trendingStoreData = v;
      SGHelperGlobalVar.addVar('getUserTrendingStoreSlider', v);
    }).bind(this), null,this.thread1);
    this.baseAddAPIParallel('getUserTrendingRestoPromoSlider', (async () => { return VtrendingAPI.getUserTrendingRestoPromoSlider() }).bind(this), ((v) => {
      this.trendingRestoPromoData = v;
      SGHelperGlobalVar.addVar('getUserTrendingRestoPromoSlider', v);
    }).bind(this), null,this.thread1);
    this.baseAddAPIParallel('getUserTrendingRestoSlider', (async () => { return VtrendingAPI.getUserTrendingRestoSlider() }).bind(this), ((v) => {
      this.trendingRestoData = v;
      SGHelperGlobalVar.addVar('getUserTrendingRestoSlider', v);
    }).bind(this), null,this.thread1);

    //announcement
    this.baseAddAPIParallel('getGroupTenantOfStore', (async () => { return VGroupAPI.getGroupTenantOfStore() }).bind(this), ((v) => {
      this.groupTenantStoreData = v;
      SGHelperGlobalVar.addVar('getGroupTenantOfStore', v);
    }).bind(this), null,this.thread1);
    this.baseAddAPIParallel('getGroupTenantOfResto', (async () => { return VGroupAPI.getGroupTenantOfResto() }).bind(this), ((v) => {
      this.groupTenantRestoData = v;
      SGHelperGlobalVar.addVar('getGroupTenantOfResto', v);
    }).bind(this), null,this.thread1);
    this.baseAddAPIParallel('getAnnouncementData', (async () => { return tbVAnnouncementAPI.getAnnouncementData() }).bind(this), ((v) => {
      this.tempAnnouncementData = v;
      console.log(this.tempAnnouncementData);
      console.log('announcement data')
      SGHelperGlobalVar.addVar('getAnnouncementData', v);
    }).bind(this), null,this.thread1);
    this.baseAddAPIParallel('GetActiveUserLogin', (async () => { return tbVUserAPI.GetActiveUserLogin() }).bind(this), ((v) => {
      console.log('GetActiveUserLogin');
      console.log(v);
      SGHelperGlobalVar.addVar("userActiveLogin", v)
    }).bind(this), null,this.thread1);

    this.baseAddAPIParallel('pickerArrayOfLinks', (async (v1) => { return tbCArrayOfLinksAPI.pickerArrayOfLinks(v1) }).bind(this, this._language), ((v) => {
      SGHelperGlobalVar.addVar("arrayOfLinks", v)
    }).bind(this), null,this.thread1);
    //arrayoflinks content
    this.baseRunAPIParallel(this.thread1)

  }

  _refreshFavorite() {
    console.log('refresh favorite')
    this.state.refreshFavorite = true;

    this.thread2 = this.baseInitAPIParallel(SGHelperGlobalVar.getVar("ResponTimes"), (() => { console.log('done refresh favorite'); this.state.refreshFavorite = false; this.forceUpdate(); }).bind(this),()=>{},true);
    this.baseAddAPIParallel('getUserFavPlaceEventSlider', (async () => { return tbVUserFavoriteAPI.getUserFavPlaceEventSlider() }).bind(this), ((v) => {
      this.favPlaceEventData = v;
      SGHelperGlobalVar.setVar('getUserFavPlaceEventSlider', v);
    }).bind(this), null,this.thread2);

    this.baseAddAPIParallel('getUserFavPlaceSlider', (async () => { return tbVUserFavoriteAPI.getUserFavPlaceSlider() }).bind(this), ((v) => {
      this.favPlaceData = v;
      SGHelperGlobalVar.setVar('getUserFavPlaceSlider', v);
    }).bind(this), null,this.thread2);

    this.baseAddAPIParallel('getUserFavStorePromoSlider', (async () => { return tbVUserFavoriteAPI.getUserFavStorePromoSlider() }).bind(this), ((v) => {
      this.favStorePromoData = v;
      SGHelperGlobalVar.setVar('getUserFavStorePromoSlider', v);
    }).bind(this), null,this.thread2);

    this.baseAddAPIParallel('getUserFavStoreSlider', (async () => { return tbVUserFavoriteAPI.getUserFavStoreSlider() }).bind(this), ((v) => {
      this.favStoreData = v;
      SGHelperGlobalVar.setVar('getUserFavStoreSlider', v);
    }).bind(this), null,this.thread2);

    this.baseAddAPIParallel('getUserFavRestoPromoSlider', (async () => { return tbVUserFavoriteAPI.getUserFavRestoPromoSlider() }).bind(this), ((v) => {
      this.favRestoPromoData = v;
      SGHelperGlobalVar.setVar('getUserFavRestoPromoSlider', v);
    }).bind(this), null,this.thread2);
    this.baseAddAPIParallel('getUserFavRestoSlider', (async () => { return tbVUserFavoriteAPI.getUserFavRestoSlider() }).bind(this), ((v) => {
      this.favRestoData = v;
      SGHelperGlobalVar.setVar('getUserFavRestoSlider', v);
    }).bind(this), null,this.thread2);

    this.baseAddAPIParallel('SearchMyLoyaltyCardSlider', (async () => { return tbVMainHomeVisitorAPI.SearchMyLoyaltyCardSlider() }).bind(this), ((v) => {
      this.cardData = v
      for(var i = 0 ; i < v.length; i++){
        this.cardData[i].fJSONPoint = JSON.parse(this.cardData[i].fJSONPoint)
        this.cardData[i].fJSONNumber = JSON.parse(this.cardData[i].fJSONNumber)
        this.cardData[i].fJSONName = JSON.parse(this.cardData[i].fJSONName)
        this.cardData[i].fJSONValidNumber = JSON.parse(this.cardData[i].fJSONValidNumber)
        this.cardData[i].fJSONExpiredDate = JSON.parse(this.cardData[i].fJSONExpiredDate)
      }
      SGHelperGlobalVar.setVar('getLoyaltyCardData', this.cardData);
    }).bind(this), null, this.thread2 );
    this.baseRunAPIParallel(this.thread2)
  }

  _refreshTrending() {

    console.log('refresh trending')
    this.state.refreshTrending = true;

    this.thread3 =this.baseInitAPIParallel(SGHelperGlobalVar.getVar("ResponTimes"), (() => { console.log('done refresh trending'); this.state.refreshTrending = false; this.forceUpdate(); }).bind(this),()=>{},true);

    this.baseAddAPIParallel('getUserTrendingPlaceEventSlider', (async () => { return VtrendingAPI.getUserTrendingPlaceEventSlider() }).bind(this), ((v) => {
      this.trendingPlaceEventData = v;
      SGHelperGlobalVar.addVar('getUserTrendingPlaceEventSlider', v);
    }).bind(this), null,this.thread3);

    this.baseAddAPIParallel('getUserTrendingPlaceSlider', (async () => { return VtrendingAPI.getUserTrendingPlaceSlider() }).bind(this), ((v) => {
      this.trendingPlaceData = v;
      SGHelperGlobalVar.addVar('getUserTrendingPlaceSlider', v);
    }).bind(this), null,this.thread3);


    this.baseAddAPIParallel('getUserTrendingAuctionSlider', (async () => { return VtrendingAPI.getUserTrendingAuctionSlider() }).bind(this), ((v) => {
      this.trendingAuctionData = v;
      SGHelperGlobalVar.addVar('getUserTrendingAuctionSlider', v);
    }).bind(this), null,this.thread3);

    this.baseAddAPIParallel('getUserTrendingStorePromoSlider', (async () => { return VtrendingAPI.getUserTrendingStorePromoSlider() }).bind(this), ((v) => {
      this.trendingStorePromoData = v;
      SGHelperGlobalVar.addVar('getUserTrendingStorePromoSlider', v);
    }).bind(this), null,this.thread3);

    this.baseAddAPIParallel('getUserTrendingStoreSlider', (async () => { return VtrendingAPI.getUserTrendingStoreSlider() }).bind(this), ((v) => {
      this.trendingStoreData = v;
      SGHelperGlobalVar.addVar('getUserTrendingStoreSlider', v);
    }).bind(this), null,this.thread3);

    this.baseAddAPIParallel('getUserTrendingRestoPromoSlider', (async () => { return VtrendingAPI.getUserTrendingRestoPromoSlider() }).bind(this), ((v) => {
      this.trendingRestoPromoData = v;
      SGHelperGlobalVar.addVar('getUserTrendingRestoPromoSlider', v);
    }).bind(this), null,this.thread3);

    this.baseAddAPIParallel('getUserTrendingRestoSlider', (async () => { return VtrendingAPI.getUserTrendingRestoSlider() }).bind(this), ((v) => {
      this.trendingRestoData = v;
      SGHelperGlobalVar.addVar('getUserTrendingRestoSlider', v);
    }).bind(this), null,this.thread3);
    this.baseRunAPIParallel(this.thread3)

  }

  _refreshGroupOfTenant() {
    console.log('refresh group of tenant')
    this.state.refreshGroupOfTenant = true;

    this.thread4 = this.baseInitAPIParallel(SGHelperGlobalVar.getVar("ResponTimes"), (() => { console.log('done refresh group of tenant'); this.state.refreshGroupOfTenant = false; this.forceUpdate(); }).bind(this),()=>{},true);

    this.baseAddAPIParallel('getGroupTenantOfStore', (async () => { return VGroupAPI.getGroupTenantOfStore() }).bind(this), ((v) => {
      this.groupTenantStoreData = v;
      SGHelperGlobalVar.addVar('getGroupTenantOfStore', v);
    }).bind(this), null,this.thread4);

    this.baseAddAPIParallel('getGroupTenantOfResto', (async () => { return VGroupAPI.getGroupTenantOfResto() }).bind(this), ((v) => {
      this.groupTenantRestoData = v;
      SGHelperGlobalVar.addVar('getGroupTenantOfResto', v);
    }).bind(this), null,this.thread4);

    this.baseRunAPIParallel(this.thread4)

  }

  async _constructAnnouncement() {
    for (var i = 0; i < this.tempAnnouncementData.length; i++) {
      if (this.tempAnnouncementData[i].fShowMultipleTime == 'N') {
        var announcementRealm = await announcementDAO.getAnnouncementRealm();
        console.log('announcementRealm');
        // console.log(announcementRealm);
        if (announcementRealm.length !== 0) {
          for (var j = 0; j < announcementRealm.length; j++) {
            var pushToRealm = true;
            if (this.tempAnnouncementData[i].fID === announcementRealm[j].fAnnouncementKey) {
              pushToRealm = false;
              var announcementDataInRealm = announcementRealm[j];
              if (announcementRealm[j].fEndDate >= SGHelperType.convertNewDate(new Date())) {
                console.log('delete announcement');
                await announcementDAO.deleteAnnouncementByKey(announcementRealm[j].fAnnouncementKey);
              }
              break;
            }
            if (announcementRealm[j].fEndDate >= SGHelperType.convertNewDate(new Date())) {
              console.log('delete announcement');
              await announcementDAO.deleteAnnouncementByKey(announcementRealm[j].fAnnouncementKey);
            }
          }
          if (pushToRealm) {
            console.log('pushToRealm True')
            await announcementDAO.addAnnouncement(this.tempAnnouncementData[i], this.currentUser)
            this.AnnouncementData.push(this.tempAnnouncementData[i]);
          } else {
            console.log('pushToRealm false')
            if (SGHelperType.formatDate(announcementDataInRealm.fCreatedDate) == SGHelperType.formatDate(SGHelperType.convertNewDate(new Date()))) {
              this.AnnouncementData.push(this.tempAnnouncementData[i]);
            }
          }
        } else {
          await announcementDAO.addAnnouncement(this.tempAnnouncementData[i], this.currentUser)
          this.AnnouncementData.push(this.tempAnnouncementData[i]);
        }
      } else {
        this.AnnouncementData.push(this.tempAnnouncementData[i]);
      }
    }

  }

  async checkAPIBatchStatusAllDone() {

    if (this.anonymousMode !== true) {
      var email = SGHelperType.right(this.currentUserData.fEmail, 12);
      if (email !== '@spotgue.com') {
        //force logout
        if (this.forceLogOut == false) {
          var GetUserActiveLogin = SGHelperGlobalVar.getVar("userActiveLogin")
          if (GetUserActiveLogin.length !== 0) {
            var fDeviceID = DeviceInfo.getUniqueId();
            if (fDeviceID !== GetUserActiveLogin[0].fDeviceID) {
              this.forceLogOut = true;
              this._signOut();
            }
          }
        }
      }
    }

    
    this.globalShownAnnouncement = SGHelperGlobalVar.getVar('refreshAnnouncement');
   
    if (this.globalShownAnnouncement == true) {
      SGHelperGlobalVar.addVar('firstTimeLoading', true);
      SGHelperGlobalVar.setVar('refreshAnnouncement', false);
      var url = SGHelperGlobalVar.getVar('deepLinkingURL')
      if (url == null || url == '') {
        await this._constructAnnouncement();
        if (this.tempAnnouncementData.length > 0) {
          this._showAnnouncement();
        }
      }
      if (this.anonymousMode !== true) {
        if (SGHelperGlobalVar.getVar('firstTimeLoading') !== null || SGHelperGlobalVar.getVar('firstTimeLoading') !== true) {
          await this._callingTriggerBooking();
          SGHelperGlobalVar.addVar('firstTimeLoading', true);
        }
      }
    }

    this.alreadyMount = true;
    this.forceUpdate();
  }

  async _onRefreshDataBooking() {

    console.log('_onRefreshDataBooking')
    this.pagingWaitingList = this.getPagingWaitingList();
    this.pagingReservation = this.getPagingReservation();

    this.newThreadRefreshDataBooking = this.baseInitAPIParallel(SGHelperGlobalVar.getVar("ResponTimes"), (() => { this.checkAPIBatchStatusAllDone1(); }).bind(this),()=>{},true);
    if (SGHelperGlobalVar.getVar('GlobalCallWaitingList')) {
      this.baseAddAPIParallel('searchWaitingListMyBookingVisitor', (async (v1, v2, v3) => { return tbVWaitingListAPI.searchWaitingListMyBookingVisitor(v1, v2, v3) }).bind(this, this.filterWaitingData, [], this.pagingWaitingList), ((v) => {
        this.checkDataWaitingList = v;
      }).bind(this), null, this.newThreadRefreshDataBooking);
    } else {
      this.checkDataWaitingList = [];
    }
    if (SGHelperGlobalVar.getVar('GlobalCallReservation')) {
      console.log('reservationnnnnnn')
      this.baseAddAPIParallel('searchReservationMyBookingVisitor', (async (v1, v2, v3) => { return tbVReservationAPI.searchReservationMyBookingVisitor(v1, v2, v3) }).bind(this, this.filterReservationData, [], this.pagingReservation), ((v) => {
        this.checkDataReservation = v;
      }).bind(this), null, this.newThreadRefreshDataBooking);
    } else {
      this.checkDataReservation = [];
    }

    if (SGHelperGlobalVar.getVar('GlobalReservationReminder')) {
      this.baseAddAPIParallel('searchReservationMyBookingVisitor', (async (v1, v2, v3) => { return tbVReservationAPI.searchReservationMyBookingVisitor(v1, v2, v3) }).bind(this, this.filterReservationReminder, [], this.pagingReservation), ((v) => {
        this.dataReservationReminder = v;
      }).bind(this), null, this.newThreadRefreshDataBooking);
    } else {
      this.dataReservationReminder = [];
    }
    this.baseRunAPIParallel(this.newThreadRefreshDataBooking)
  }

  async _callingTriggerBooking() {

    this.pagingWaitingList = this.getPagingWaitingList();
    this.pagingReservation = this.getPagingReservation();
    this.baseInitAPIParallel(SGHelperGlobalVar.getVar("ResponTimes"), (() => { this.checkAPIBatchStatusAllDone2(); }).bind(this));
    this.baseAddAPIParallel('searchWaitingListMyBookingVisitor', (async (v1, v2, v3) => { return tbVWaitingListAPI.searchWaitingListMyBookingVisitor(v1, v2, v3) }).bind(this, this.filterWaitingActiveData, [], this.pagingWaitingList), ((v) => {
      this.checkDataWaitingList = v;

    }).bind(this), null);
    this.baseAddAPIParallel('searchReservationMyBookingVisitor', (async (v1, v2, v3) => { return tbVReservationAPI.searchReservationMyBookingVisitor(v1, v2, v3) }).bind(this, this.filterReservationData, [], this.pagingReservation), ((v) => {
      this.checkDataReservation = v;

    }).bind(this), null);
    this.baseAddAPIParallel('searchReservationMyBookingVisitor', (async (v1, v2, v3) => { return tbVReservationAPI.searchReservationMyBookingVisitor(v1, v2, v3) }).bind(this, this.filterReservationReminder, [], this.pagingReservation), ((v) => {
      this.dataReservationReminder = v;

    }).bind(this), null);
    this.baseRunAPIParallel()
  }

  _reservationGetTimeReminder() {
    if (this.currentUserData.fReminderReservation == 'RR1') {
      this.reservationReminder = 5;
    } else if (this.currentUserData.fReminderReservation == 'RR2') {
      this.reservationReminder = 10;
    } else if (this.currentUserData.fReminderReservation == 'RR3') {
      this.reservationReminder = 15;
    } else if (this.currentUserData.fReminderReservation == 'RR4') {
      this.reservationReminder = 20;
    } else if (this.currentUserData.fReminderReservation == 'RR5') {
      this.reservationReminder = 25;
    } else if (this.currentUserData.fReminderReservation == 'RR6') {
      this.reservationReminder = 30;
    } else if (this.currentUserData.fReminderReservation == 'RR7') {
      this.reservationReminder = 35;
    } else if (this.currentUserData.fReminderReservation == 'RR8') {
      this.reservationReminder = 40;
    } else if (this.currentUserData.fReminderReservation == 'RR9') {
      this.reservationReminder = 45;
    } else if (this.currentUserData.fReminderReservation == 'RR10') {
      this.reservationReminder = 50;
    } else if (this.currentUserData.fReminderReservation == 'RR11') {
      this.reservationReminder = 55;
    } else if (this.currentUserData.fReminderReservation == 'RR12') {
      this.reservationReminder = 60;
    }
  }

  _showAnnouncement() {
    SGPopView.showPopView(this.pvID);
  }

  _hideAnnouncement() {
    SGPopView.hidePopView(this.pvID);
  }

  componentWillUnmount() {
    AppState.removeEventListener('change', this._handleAppStateChange);
    clearInterval(this.interval);
    if (this._unsubscribe) { this._unsubscribe(); }
    BackHandler.removeEventListener('hardwareBackPress', this.onBackPress);
  }

  onBackPress() {
    SGDialogBox.showConfirmation(null, SGLocalize.translate('ExitApp.ExitAppTitle'), SGLocalize.translate('ExitApp.ExitAppDesc'), SGLocalize.translate('ExitApp.No2'), () => { console.log('Close') }, SGLocalize.translate('ExitApp.Yes2'), () => { RNExitApp.exitApp() }, true)
    return true;
  }

  favPlaceEventSeeMoreOnPress() {
    SGHelperNavigation.navigatePush(this.props.navigation, 'SeeAllFavoritesPlaceEvent')
  }

  favPlaceSeeMoreOnPress() {
    SGHelperNavigation.navigatePush(this.props.navigation, 'SeeAllFavoritesPlace')
  }

  favStorePromoSeeMoreOnPress() {
    SGHelperNavigation.navigatePush(this.props.navigation, 'SeeAllFavoritesStorePromo')
  }

  favStoreSeeMoreOnPress() {
    SGHelperNavigation.navigatePush(this.props.navigation, 'SeeAllFavoritesStore')
  }

  favRestoPromoSeeMoreOnPress() {
    SGHelperNavigation.navigatePush(this.props.navigation, 'SeeAllFavoritesRestoPromo')
  }

  favRestoSeeMoreOnPress() {
    SGHelperNavigation.navigatePush(this.props.navigation, 'SeeAllFavoritesResto')
  }

  trendPlaceEventSeeMoreOnPress() {
    SGHelperNavigation.navigatePush(this.props.navigation, 'SeeAllTrendingPlaceEvent')
  }

  trendPlaceSeeMoreOnPress() {
    SGHelperNavigation.navigatePush(this.props.navigation, 'SeeAllTrendingPlace')
  }

  trendStorePromoSeeMoreOnPress() {
    SGHelperNavigation.navigatePush(this.props.navigation, 'SeeAllTrendingStorePromo')
  }

  trendStoreSeeMoreOnPress() {
    SGHelperNavigation.navigatePush(this.props.navigation, 'SeeAllTrendingStore')
  }

  trendRestoPromoSeeMoreOnPress() {
    SGHelperNavigation.navigatePush(this.props.navigation, 'SeeAllTrendingRestoPromo')
  }

  trendRestoSeeMoreOnPress() {
    SGHelperNavigation.navigatePush(this.props.navigation, 'SeeAllTrendingResto')
  }

  onShowHandler(pvID) {
    SGPopView.showPopView(pvID);
  }

  showAddFavorite() {
    SGPopView.showPopView(this.pvID2);
    SGPopView.hidePopView(this.pvID2)
  }

  onCloseHandler() {
    SGPopView.hidePopView(this.pvID2);
  }

  showChangeProfilePrompt() {
    if (this.currentUserData.fDOB != "1970-01-01T00:00:00" && this.currentUserData.fCity != "" &&
      this.currentUserData.fCountry != "" && this.currentUserData.fFamily != "" &&
      this.currentUserData.fGender != "" && this.currentUserData.fProvince != "" &&
      this.currentUserData.fFoodPreference != [] && SGHelperGlobalVar.getVar('tmpHidePrompt') != true) {
      SGHelperGlobalVar.addVar('tmpHidePrompt', true);
    } else {
      if (!SGHelperGlobalVar.isVar('tmpHidePrompt')) {
        // console.log('SINI')
        SGHelperGlobalVar.addVar('tmpHidePrompt', false);
      }
    }
  }

  _onNavigateReferral() {
    var circuitBreaker = SGHelperType.getCircuitBreakerStatus('CircuitBreakerMyReward')
    var language = SGHelperGlobalVar.getVar('GlobalLanguage').toUpperCase()
    if (circuitBreaker.fActive === "Y") {
      SGHelperNavigation.navigatePush(this.props.navigation, 'MyReferralInMyReward', { referral: true })
    }
    else {
      SGDialogBox.showWarning(null, circuitBreaker["Title" + language], circuitBreaker[language], circuitBreaker["Button" + language], () => { }, true)
    }
  }
  async loadServerFile(filePath, strLabel) {
    try {
        var APIURL = 'https://apihostlive.azurewebsites.net/api/LoadPluginNew?code=RmpriOFKeqEZrnaWA0AYw1bGzNcYviT6fGtkCksG5L1FTU1pV08O7g==';
        var _result = await RNFetchBlob.fetch('GET', APIURL, { filepath: filePath });
        if (_result.data === '') { throw 'Empty file!' }
        if (_result.respInfo.status !== 200) { throw _result.data }
        return { data: _result.data, exception: null, isError: false }
    } catch (e) {
        console.log(e);
        return { data: '', exception: e, isError: true }
    }
  }

  async loadPluginList() {
      var _res = await this.loadServerFile('/SGVisitorModule/pluginlist.json', 'HomeScreen.loadPluginList');
      if (!_res.isError) {
          var _list = JSON.parse(_res.data);
          this.pluginList = _list.pluginList;
          this.forceUpdate();
          SGDialogBox.showToast('Plugin List Loaded');
      } else {
        SGDialogBox.showToast('Failed Load Plugin List');
      }
  }

  _announcementButtonPress(data){
    console.log('announcement button press')
    if(data.fFloatingButtonType =='openurl'){
      this.handleLink(data.fUrlLink)
    }else if(data.fFloatingButtonType == 'openscreen'){
        console.log('navigate --')
        console.log(JSON.parse(data.fNavigateJSON))
        var screen = data.fNavigateScreen
        var navigateJSON = JSON.parse(data.fNavigateJSON)
        this._hideAnnouncement();
        SGHelperNavigation.navigatePush(this.props.navigation,screen,navigateJSON);
    } 
  }

  async loadServerFile(filePath, strLabel) {
    try {
        var APIURL = 'https://apihostlive.azurewebsites.net/api/LoadPluginNew?code=RmpriOFKeqEZrnaWA0AYw1bGzNcYviT6fGtkCksG5L1FTU1pV08O7g==';
        var _result = await RNFetchBlob.fetch('GET', APIURL, { filepath: filePath });
        if (_result.data === '') { throw 'Empty file!' }
        if (_result.respInfo.status !== 200) { throw _result.data }
        return { data: _result.data, exception: null, isError: false }
    } catch (e) {
        console.log(e);
        return { data: '', exception: e, isError: true }
    }
  }

  async loadPluginList() {
      var _res = await this.loadServerFile('/SGVisitorModule/pluginlist.json', 'HomeScreen.loadPluginList');
      if (!_res.isError) {
          var _list = JSON.parse(_res.data);
          this.pluginList = _list.pluginList;
          this.forceUpdate();
          SGDialogBox.showToast('Plugin List Loaded');
      } else {
        SGDialogBox.showToast('Failed Load Plugin List');
      }
  }

  render() {
    var { w, h, p } = this.WHPNoHeader;
    var style = this.style;
    console.log(SGHelperGlobalVar.getVar('token'))
    return (
      <RootView accessible={true} accessibilityLabel={'HomeScreenRootView'} style={style.mainContainer}>
        
       {/* Announcement */}
       <SGPopView popViewID={this.pvID}  animationType={'slide'} vPos='Top'>
          <ViewPager key={SGHelperType.getGUID()} accessible={true} accessibilityLabel={'ViewPagerHomeScreen'} style={style.sliderComponent} initialPage={0} showPageIndicator={true} transitionStyle={'scroll'} pageIndicatorStyle={style.pageindicator} >
            {this.AnnouncementData.map((data) => {
              return (
                data.fShowType == 'description' ?
                <View accessible={true} accessibilityLabel={'HomeScreenImageView'} key={SGHelperType.getGUID()}>
                  {/* <TouchableOpacity style={style.vClose} onPress={() => { this._hideAnnouncement() }}>
                    <Icon name={Icon.Icon.closecircle} preset={Icon.preset.w9} style={{ color:'rgba(38,38,38,0.95)'  }}></Icon>
                  </TouchableOpacity> */}
                  <View style={style.sliderImageView}>
                    <Image accessible={true} accessibilityLabel={'HomeScreenImage'} style={style.sliderImage} source={{ uri: data['fContent' + this.Language.toUpperCase()].fImageJSON[0][this.imageSetting].uri }}></Image>
                  </View>
                  {data.fFloatingButtonType !== ''&&
                    <Button style={style.buttonAnnouncement}  textStyle={{color:'white'}} label={SGLocalize.translate('Announcement.SeeMoreTitle')} onPress={()=>{this._announcementButtonPress(data)}}></Button>
                  }
                  <View style={style.sliderText}>
                    <ScrollView style={{ flex: 1 }}>
                      <Text preset={Text.preset.titleH2B} style={style.textViewPager}>{data['fTitleName' + this.Language.toUpperCase()]}</Text>
                      <Text preset={Text.preset.titleH4} style={style.textDescriptionViewPager}>{data['fContent' + this.Language.toUpperCase()].fShortDescription}</Text>
                    </ScrollView>
                  </View>
                </View>
                :
                <View accessible={true} accessibilityLabel={'HomeScreenImageView'} key={SGHelperType.getGUID()} style={style.sliderwebView}>
                      {data.fFloatingButtonType !== ''&&
                    <Button style={style.buttonAnnouncementWebView}  textStyle={{color:'white'}} label={SGLocalize.translate('Announcement.SeeMoreTitle')} onPress={()=>{this._announcementButtonPress(data)}}></Button>
                  }
                    <WebView style={style.sliderwebView} source={{ uri : data.fUrlLink}}></WebView>
                  </View> 
              )
            })
            }
          </ViewPager>
        </SGPopView>
               {/* End of Announcement  */}

        <SGPopView accessible={true} accessibilityLabel={'HomeScreenPopView'} vPos={'Top'} popViewID={this.pvID2}>
          <AddFavoritePopUp accessible={true} accessibilityLabel={'HomeScreenAddFavPopUp'} popViewID={this.pvID2} style={style.throwWHP}></AddFavoritePopUp>
        </SGPopView>
        <TabView onChangeTab={this._onChangeTab.bind(this)} tabBarFloatingStyle={{ position: 'absolute', transform: [{ translateY: this._baseAnimY.interpolate({ inputRange: [-1, 0], outputRange: [SGHelperWindow.getStatusBarHeight(), SGHelperWindow.getStatusBarHeight() + SGHelperWindow.getHeaderHeight()] }) },], }} tabBarPosition={'floating'} accessible={true} accessibilityLabel={'HomeScreenTabView'} tabBarStyle={style.tabBarStyle} tabBarTextStyle={style.tabBarTextStyle} scrollableTabBar={true} tabBarUnderlineStyle={style.tabBarUnderlineStyle} tabBarActiveTextColor={SGHelperStyle.color.SGText.TextBlack} tabBarInactiveTextColor={SGHelperStyle.color.SGText.TextGrey} tabBarActiveTextPreset={Text.preset.titleH2B} tabBarInactiveTextPreset={Text.preset.titleH2} style={{}} initialPage={SGHelperType.isDefined(this.props.route.params.page) ? this.props.route.params.page : 0} showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false} >
            {
              mode==='dev' &&
              <ScrollView tabLabel={'Plugin'} style={{flex:1,backgroundColor:'transparent'}}>
                <Text style={{marginTop:w*0.2}} >{'Local Plugin Test'}</Text>
                <Button label="Goto Plugin 1" preset={Button.preset.red} onPress={()=>{SGHelperNavigation.navigatePush(this.props.navigation, 'TestSimpleAPIScreen');}} />
                <Text style={{color:'blue'}} onPress={this.loadPluginList.bind(this)}>{'Reload Server Plugin List'}</Text>
                {
                    this.pluginList.map((d, i) => {
                        return (
                            <Button key={i} preset={Button.preset.black} label={d.pluginTitle} onPress={(() => { SGHelperNavigation.navigatePush(this.props.navigation, 'PluginScreen', { pluginFile: d.pluginFile, rootFolder: d.rootFolder }) }).bind(this)}/>
                        )
                    })
                }
              </ScrollView>
            }
          {this.anonymousMode !== true &&
            this.alreadyMount ?
            (
            <View accessible={true} accessibilityLabel={'HomeScreenFavTitleView'} tabLabel={SGLocalize.translate("HomeScreen.tabFavoriteTitle")} style={{ flex: 1, color: '#606060' }} >
              <ScrollView dummyStatusBar dummyHeaderBar dummyTabBar dummyFooterBar dummyBottomBar accessible={true} accessibilityLabel={'HomeScreenFavScrollView'} style={style.scrollView1} contentContainerStyle={{ alignItems: 'center' }} scrollEventThrottle={100} onScroll={this.baseOnScrollHandler.bind(this)} onMomentumScrollBegin={this.baseOnMomentumScrollBeginHandler.bind(this)} onScrollEndDrag={this.baseOnScrollEndDragHandler.bind(this)} onMomentumScrollEnd={this.baseOnMomentumScrollEndHandler.bind(this)} showsVerticalScrollIndicator={false}
                refreshControl={
                  <RefreshControl
                    refreshing={this.state.refreshFavorite}
                    onRefresh={this._refreshFavorite.bind(this)}
                  />
                }
              >
                {/* My Vacchine */}
                {this.anonymousMode !== true &&
                  <View style={{ width: w, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: p }}>
                    <TouchableOpacity onPress={() => this._onNavigateReferral()}>
                      <Text accessible={true} accessibilityLabel={'ProfileHeaderContainerUName'} style={style.myReferralText} preset={Text.preset.titleH3B}>{SGLocalize.translate('ProfileScreen.MyReferralButton')}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => { SGHelperNavigation.navigatePush(this.props.navigation, 'MyHealth') }}>
                      <View style={{ flexDirection: 'row' }}>
                        <Icon name={Icon.Icon.injection} preset={Icon.preset.titleH3B} style={{ color: '#63AEE0' }}></Icon>
                        <Text style={style.textMyHealth} preset={Text.preset.titleH3B}>{SGLocalize.translate('MyHealth.MyVaccineTitle')}</Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                }

                {/* kotak lengkapi profile */}
                <View style={{ backgroundColor:'rgb(62,148,221)', flexDirection: 'row', borderRadius: 3 * p, width: 9.5 * w / 10, marginTop: 3 * p,marginBottom:3*p, borderColor:'rgb(230,230,230)',borderWidth:0 }} hidden={SGHelperGlobalVar.getVar('tmpHidePrompt')}>
                  <View style={{ width: '100%'}}>
                    <Text preset={Text.preset.titleH4} style={{ paddingLeft: 2 * p, paddingRight: 2 * p, marginTop: 2 * p, textAlign: 'justify', textAlignVertical: 'top', color: "white" }}>{SGLocalize.translate("HomeScreen.textProfilePrompt")}</Text>
                    <View style={{flexDirection:'row', marginBottom:2*p}}>
                      <Button label={SGLocalize.translate("HomeScreen.completeProfileLater")} preset={Button.preset.grey} onPress={() =>{SGHelperGlobalVar.getVar('tmpHidePrompt')?SGHelperGlobalVar.setVar('tmpHidePrompt',false):SGHelperGlobalVar.setVar('tmpHidePrompt',true);this.forceUpdate()}}/>
                      <Button label={SGLocalize.translate("HomeScreen.completeProfileOK")} preset={Button.preset.green} onPress={() => { SGHelperNavigation.navigatePush(this.props.navigation, 'DetailProfileScreen') }}/>
                    </View>
                  </View>
                </View>


                {this.cardData.length ?
                  (<SpotgueAppMyCardSlider data={this.cardData} imageSetting={this.imageSetting} navigation={this.props.navigation}></SpotgueAppMyCardSlider>):(null)}
                {this.favPlaceEventData.length ?
                  (<PlaceEventSlider befSeeMoreScreen={'HomeFav'} twoLine accessible={true} accessibilityLabel={'HomeScreenFavPlaceEventSlider'} language={this.Language} imageSetting={this.imageSetting} seeMoreScreen='SeeAllFavoritesPlaceEvent' seeMoreLabel={SGLocalize.translate("HomeScreen.SeeMore")} screen='PlaceEventDetail' navigator={this.props.navigation} data={this.favPlaceEventData} titleHeading={SGLocalize.translate("HomeScreen.WhatsHappeningTitle")} title={SGLocalize.translate("HomeScreen.FavoritePlaceEventTitle")} style={style.throwWHP}></PlaceEventSlider>) : (null)}
                  {this.favPlaceData.length ?
                    (<PlaceSlider borderBottom accessible={true} accessibilityLabel={'HomeScreenFavPlaceSlider'} language={this.Language} imageSetting={this.imageSetting} seeMoreScreen='SeeAllFavoritesPlace' seeMoreLabel={SGLocalize.translate("HomeScreen.SeeMore")} screen='MallHome' navigator={this.props.navigation} data={this.favPlaceData} title={SGLocalize.translate("HomeScreen.FavoritePlaceTitle")} style={style.throwWHP}></PlaceSlider>) : (null)}
                  {this.favStorePromoData.length ?
                    (<StorePromoSlider befSeeMoreScreen={'HomeFav'} twoLine accessible={true} accessibilityLabel={'HomeScreenFavStorePromoSlider'} language={this.Language} imageSetting={this.imageSetting} seeMoreScreen='SeeAllFavoritesStorePromo' seeMoreLabel={SGLocalize.translate("HomeScreen.SeeMore")} screen='StorePromoDetail' navigator={this.props.navigation} data={this.favStorePromoData} titleHeading={SGLocalize.translate("HomeScreen.WhatsHappeningTitle")} title={SGLocalize.translate("HomeScreen.FavoriteStorePromoTitle")} style={style.throwWHP}></StorePromoSlider>) : (null)}
                  {this.favStoreData.length ?
                    (<StoreSlider borderBottom accessible={true} accessibilityLabel={'HomeScreenFavStoreSlider'} language={this.Language} imageSetting={this.imageSetting} seeMoreScreen='SeeAllFavoritesStore' seeMoreLabel={SGLocalize.translate("HomeScreen.SeeMore")} screen='StoreHome' navigator={this.props.navigation} data={this.favStoreData} title={SGLocalize.translate("HomeScreen.FavoriteStoreTitle")} style={style.throwWHP}></StoreSlider>) : (null)}
                  {this.favRestoPromoData.length ?
                    (<RestoPromoSlider befSeeMoreScreen={'HomeFav'} twoLine accessible={true} accessibilityLabel={'HomeScreenFavRestoPromoSlider'} language={this.Language} imageSetting={this.imageSetting} seeMoreScreen='SeeAllFavoritesRestoPromo' seeMoreLabel={SGLocalize.translate("HomeScreen.SeeMore")} screen='RestoPromoDetail' navigator={this.props.navigation} data={this.favRestoPromoData} titleHeading={SGLocalize.translate("HomeScreen.WhatsHappeningTitle")} title={SGLocalize.translate("HomeScreen.FavoriteRestoPromoTitle")} style={style.throwWHP}></RestoPromoSlider>) : (null)}
                {this.favRestoData.length ?
                  (<RestoSlider borderBottom accessible={true} accessibilityLabel={'HomeScreenFavRestoSlider'} language={this.Language} imageSetting={this.imageSetting} seeMoreScreen='SeeAllFavoritesResto' seeMoreLabel={SGLocalize.translate("HomeScreen.SeeMore")} screen='RestoHome' navigator={this.props.navigation} data={this.favRestoData} title={SGLocalize.translate("HomeScreen.FavoriteRestoTitle")} style={style.throwWHP}></RestoSlider>) : (null)}
                {this.eventSponsorship.length ?
                  (<SponsorshipSlider twoLine accessible={true} accessibilityLabel={'HomeScreenSponsorshipSlider'} language={this.Language} imageSetting={this.imageSetting} seeMoreScreen='SeeAllSponsorshipPromo' seeMoreLabel={SGLocalize.translate("HomeScreen.SeeMore")} screen='' navigator={this.props.navigation} data={this.eventSponsorship} titleHeading={SGLocalize.translate('HomeScreen.SponsorshipTitle')} title={SGLocalize.translate('HomeScreen.SponsorshipTitle2')} style={style.throwWHP}></SponsorshipSlider>) : (null)}



                {this.anonymousMode ?
                  (<View style={{ flex: 1, height: '100%' }}>
                    <Text preset={Text.preset.titleH4}>{SGLocalize.translate('mallHomeScreen.AnnonymousLoginText')}</Text>
                  </View>

                  ) : (null)}
                <View style={{ width: '100%', height: SGHelperWindow.getHeaderHeight() }}></View>
                {/* <View style={{ width: '100%', height: SGHelperWindow.getFooterHeight() }}></View> */}
              </ScrollView>


              {this.anonymousMode !== true &&
                this.favPlaceData.length === 0 && this.favStoreData.length === 0 && this.favRestoData.length === 0 &&
                <View hidden={SGHelperGlobalVar.getVar('tmpHidePromptFav')} style={{ borderRadius: 4 * p, backgroundColor: 'white',paddingBottom:2*p, position: 'absolute', bottom: h * 0.175, right: 2 * p, width: 0.9 * w, borderColor: 'rgb(230,230,230)', borderWidth: 0.25 * p, alignItems:'flex-start' }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', backgroundColor: "rgba(38,38,38,0.85)", width: 0.9 * w, borderTopRightRadius: 4 * p, borderTopLeftRadius: 4 * p }}>
                    <Text preset={Text.preset.titleH2B} style={{ paddingLeft: 2 * p, paddingRight: 2 * p, marginVertical: 3 * p, textAlign: 'justify', textAlignVertical: 'top', color: "white" }}>{SGLocalize.translate('mallHomeScreen.askFavoritePlaceText')}</Text>
                    <TouchableOpacity onPress={() => { SGHelperGlobalVar.getVar('tmpHidePromptFav') ? SGHelperGlobalVar.setVar('tmpHidePromptFav', false) : SGHelperGlobalVar.setVar('tmpHidePromptFav', true); this.forceUpdate(); }} style={{ height: w * 0.08, width: w * 0.08, marginRight:2*p, borderRadius: w, backgroundColor: '#878E92', alignItems: 'center', justifyContent: 'center' }}>
                      <Text preset={Text.preset.titleH2B} style={{ color: 'white' }}>X</Text>
                    </TouchableOpacity>
                  </View>
                  <Text preset={Text.preset.titleH4} style={{ paddingLeft: 2 * p, paddingRight: 2 * p, marginVertical: 2 * p, textAlign: 'justify', textAlignVertical: 'top', color: "rgb(130,128,128)" }}>{SGLocalize.translate('mallHomeScreen.NoFavoriteText')}</Text>
                  <Text preset={Text.preset.titleH4} style={{ paddingLeft: p * 2, paddingRight: p * 2, marginBottom: 2 * p, textAlign: 'justify', textAlignVertical: 'top', color: "rgb(130,128,128)" }}>{SGLocalize.translate('mallHomeScreen.NoFavoriteText2')}
                    <View style={style.starIconView}>
                      <Image style={style.starIcon} resizeMode={'contain'} source={{ uri: image.favoritesActiveIcon[this.imageSetting].url }}></Image>
                    </View>
                  </Text>
                </View>

              }

              {
                this.anonymousMode ?
                  (null)
                  :
                  <TouchableOpacity accessible={true} accessibilityLabel={'HomeScreenFABFavView'} style={style.vfab} onPress={() => { SGHelperNavigation.navigatePush(this.props.navigation, 'AddFavorites', {}) }}>
                    <Icon name={Icon.Icon.plus} preset={Icon.preset.w7} style={{ color: 'rgba(38,38,38,0.85)' }}></Icon>
                  </TouchableOpacity>
              }
            </View>)
            :
            this.anonymousMode !== true &&
            <View accessible={true} accessibilityLabel={'HomeScreenFavTitleView'} tabLabel={SGLocalize.translate("HomeScreen.tabFavoriteTitle")} style={{ flex: 1, color: '#606060' }}>
              <ActivityIndicator preset={ActivityIndicator.preset.h1} style={{ flex: 1 }}></ActivityIndicator>
            </View>
          }
          {
            this.alreadyMount ?
              (<ScrollView dummyStatusBar dummyHeaderBar dummyTabBar dummyFooterBar dummyBottomBar accessible={true} accessibilityLabel={'HomeScreenTrendScrollView'} style={style.scrollView1} tabLabel={SGLocalize.translate("HomeScreen.tabTrendingTitle")} scrollEventThrottle={100} onScroll={this.baseOnScrollHandler.bind(this)} onMomentumScrollBegin={this.baseOnMomentumScrollBeginHandler.bind(this)} onScrollEndDrag={this.baseOnScrollEndDragHandler.bind(this)} onMomentumScrollEnd={this.baseOnMomentumScrollEndHandler.bind(this)} showsVerticalScrollIndicator={false}
                refreshControl={
                  <RefreshControl
                    refreshing={this.state.refreshTrending}
                    onRefresh={this._refreshTrending.bind(this)}
                  />
                }
              >
                {this.trendingPlaceEventData.length ?
                 (<PlaceEventSlider befSeeMoreScreen={'HomeTren'} twoLine accessible={true} accessibilityLabel={'HomeScreenTrendPlaceEventSlider'} language={this.Language} imageSetting={this.imageSetting} seeMoreScreen='SeeAllTrendingPlaceEvent' seeMoreLabel={SGLocalize.translate("HomeScreen.SeeMore")} screen='PlaceEventDetail' navigator={this.props.navigation} data={this.trendingPlaceEventData} titleHeading={SGLocalize.translate("HomeScreen.WhatsHappeningTitle")} title={SGLocalize.translate("HomeScreen.TrendingPlaceEventTitle")} style={style.throwWHP}></PlaceEventSlider>) : (null)}
                 {this.trendingPlaceData.length ?
                   (<PlaceSlider borderBottom accessible={true} accessibilityLabel={'HomeScreenTrendPlaceSlider'} language={this.Language} imageSetting={this.imageSetting} seeMoreScreen='SeeAllTrendingPlace' seeMoreLabel={SGLocalize.translate("HomeScreen.SeeMore")} screen='MallHome' navigator={this.props.navigation} data={this.trendingPlaceData} title={SGLocalize.translate("HomeScreen.TrendingPlaceTitle")} style={style.throwWHP}></PlaceSlider>) : (null)}
                 {this.trendingAuctionData.length ?
                   (<AuctionSlider twoLine accessible={true} accessibilityLabel={'HomeScreenTrendAuctionSlider'} language={this.Language} imageSetting={this.imageSetting} seeMoreScreen='SeeAllTrendingAuction' seeMoreLabel={SGLocalize.translate("HomeScreen.SeeMore")} screen='AuctionDetail' navigator={this.props.navigation} data={this.trendingAuctionData} titleHeading={SGLocalize.translate("HomeScreen.AuctionHeadingTitle")} title={SGLocalize.translate("HomeScreen.TrendingAuctionTitle")} style={style.throwWHP}></AuctionSlider>) : (null)}
                 {this.trendingStorePromoData.length ?
                   (<StorePromoSlider befSeeMoreScreen={'HomeTren'} twoLine accessible={true} accessibilityLabel={'HomeScreenTrendStorePromoSlider'} language={this.Language} imageSetting={this.imageSetting} seeMoreScreen='SeeAllTrendingStorePromo' seeMoreLabel={SGLocalize.translate("HomeScreen.SeeMore")} screen='StorePromoDetail' navigator={this.props.navigation} data={this.trendingStorePromoData} titleHeading={SGLocalize.translate("HomeScreen.WhatsHappeningTitle")} title={SGLocalize.translate("HomeScreen.TrendingStorePromoTitle")} style={style.throwWHP}></StorePromoSlider>) : (null)}
                 {this.trendingStoreData.length ?
                   (<StoreSlider borderBottom accessible={true} accessibilityLabel={'HomeScreenTrendStoreSlider'} language={this.Language} imageSetting={this.imageSetting} seeMoreScreen='SeeAllTrendingStore' seeMoreLabel={SGLocalize.translate("HomeScreen.SeeMore")} screen='StoreHome' navigator={this.props.navigation} data={this.trendingStoreData} title={SGLocalize.translate("HomeScreen.TrendingStoreTitle")} style={style.throwWHP}></StoreSlider>) : (null)}
                 {this.trendingRestoPromoData.length ?
                   (<RestoPromoSlider befSeeMoreScreen={'HomeTren'} twoLine accessible={true} accessibilityLabel={'HomeScreenTrendRestoPromoSlider'} language={this.Language} imageSetting={this.imageSetting} seeMoreScreen='SeeAllTrendingRestoPromo' seeMoreLabel={SGLocalize.translate("HomeScreen.SeeMore")} screen='RestoPromoDetail' navigator={this.props.navigation} data={this.trendingRestoPromoData} titleHeading={SGLocalize.translate("HomeScreen.WhatsHappeningTitle")} title={SGLocalize.translate("HomeScreen.TrendingRestoPromoTitle")} style={style.throwWHP}></RestoPromoSlider>) : (null)}
                 {this.trendingRestoData.length ?
                   (<RestoSlider borderBottom accessible={true} accessibilityLabel={'HomeScreenTrendRestoSlider'} language={this.Language} imageSetting={this.imageSetting} seeMoreScreen='SeeAllTrendingResto' seeMoreLabel={SGLocalize.translate("HomeScreen.SeeMore")} screen='RestoHome' navigator={this.props.navigation} data={this.trendingRestoData} title={SGLocalize.translate("HomeScreen.TrendingRestoTitle")} style={style.throwWHP}></RestoSlider>) : (null)}
                 {this.eventSponsorship.length ?
                  (<SponsorshipSlider twoLine accessible={true} accessibilityLabel={'HomeScreenSponsorshipSlider'} language={this.Language} imageSetting={this.imageSetting} seeMoreScreen='SeeAllSponsorshipPromo' seeMoreLabel={SGLocalize.translate("HomeScreen.SeeMore")} screen='' navigator={this.props.navigation} data={this.eventSponsorship} titleHeading={SGLocalize.translate('HomeScreen.SponsorshipTitle')} title={SGLocalize.translate('HomeScreen.SponsorshipTitle2')} style={style.throwWHP}></SponsorshipSlider>) : (null)}
                <View style={{ width: '100%', height: SGHelperWindow.getHeaderHeight() }}></View>
                {/* <View style={{ width: '100%', height: SGHelperWindow.getFooterHeight() }}></View> */}
              </ScrollView>)
              :
              (<View accessible={true} accessibilityLabel={'HomeScreenGroupTitleView'} tabLabel={SGLocalize.translate("HomeScreen.tabTrendingTitle")} style={{ flex: 1, color: '#606060' }}>
                <ActivityIndicator preset={ActivityIndicator.preset.h1} style={{ flex: 1 }}></ActivityIndicator>
              </View>)
          }

          {
            this.alreadyMount ?
              (<ScrollView dummyStatusBar dummyHeaderBar dummyTabBar dummyFooterBar dummyBottomBar accessible={true} accessibilityLabel={'HomeScreenGroupView'} style={style.scrollView1} tabLabel={SGLocalize.translate("HomeScreen.tabGroupOfTenant")} scrollEventThrottle={100} onScroll={this.baseOnScrollHandler.bind(this)} onMomentumScrollBegin={this.baseOnMomentumScrollBeginHandler.bind(this)} onScrollEndDrag={this.baseOnScrollEndDragHandler.bind(this)} onMomentumScrollEnd={this.baseOnMomentumScrollEndHandler.bind(this)} showsVerticalScrollIndicator={false}
                refreshControl={
                  <RefreshControl
                    refreshing={this.state.refreshGroupOfTenant}
                    onRefresh={this._refreshGroupOfTenant.bind(this)}
                  />
                }
              >
                <View style={style.vGroupOfTenantTabButton}>
                  <Button shadow preset={Text.preset.titleH3B} label={SGLocalize.translate('HomeScreen.groupStoreTabTitle')} style={this._tabIndex === 0 ? style.buttonGroupTenant : style.buttonGroupTenant1} onPress={() => { this._tabView.current.goToPage(0) }} />
                  <Button shadow preset={Text.preset.titleH3B} label={SGLocalize.translate('HomeScreen.groupRestoTabTitle')} style={this._tabIndex === 1 ? style.buttonGroupTenant : style.buttonGroupTenant1} onPress={() => { this._tabView.current.goToPage(1) }} />
                </View>
                <TabView style={style.vtabView} hideTabBar={this._hideTabView} ref={this._tabView} scrollableTabBar={true} onChangeTab={(e) => { this._tabIndex = e.i; this.forceUpdate(); }} tabBarUnderlineStyle={{ backgroundColor: '#181818' }}>
                  <FlatList tabLabel={SGLocalize.translate('HomeScreen.groupStoreTabTitle')} numColumns={2} style={{ flexWrap: 'wrap', width: w, padding: p, marginHorizontal: 0.02 * w }} contentContainerStyle={{ justifyContent: 'center', alignItems: 'flex-start' }} data={this.groupTenantStoreData} renderItem={({ item }) => {
                    return (
                      item.fActive === 'Y' ?
                        (
                          <DefaultGroupCard type='store' language={this.Language} imageSetting={this.imageSetting} navigator={this.props.navigation} data={item} style={style.throwWHPGroupTab}></DefaultGroupCard>)

                        :
                        (null)
                    )
                  }} keyExtractor={item => item.key} scrollEventThrottle={100} onScroll={this.baseOnScrollHandler.bind(this)} onMomentumScrollBegin={this.baseOnMomentumScrollBeginHandler.bind(this)} onScrollEndDrag={this.baseOnScrollEndDragHandler.bind(this)} onMomentumScrollEnd={this.baseOnMomentumScrollEndHandler.bind(this)}>
                  </FlatList>
                  <FlatList tabLabel={SGLocalize.translate('HomeScreen.groupStoreTabTitle')} numColumns={2} style={{ flexWrap: 'wrap', width: w, padding: p, marginHorizontal: 0.02 * w }} contentContainerStyle={{ justifyContent: 'center', alignItems: 'flex-start' }} data={this.groupTenantRestoData} renderItem={({ item }) => {
                    return (

                      item.fActive === 'Y' ?
                        (
                          <DefaultGroupCard type='resto' language={this.Language} imageSetting={this.imageSetting} navigator={this.props.navigation} data={item} style={style.throwWHPGroupTab}></DefaultGroupCard>)

                        :
                        (null)
                    )
                  }} keyExtractor={item => item.key} scrollEventThrottle={100} onScroll={this.baseOnScrollHandler.bind(this)} onMomentumScrollBegin={this.baseOnMomentumScrollBeginHandler.bind(this)} onScrollEndDrag={this.baseOnScrollEndDragHandler.bind(this)} onMomentumScrollEnd={this.baseOnMomentumScrollEndHandler.bind(this)}>
                  </FlatList>
                </TabView>
              </ScrollView>)
              :
              (<View accessible={true} accessibilityLabel={'HomeScreenFavTitleView'} tabLabel={SGLocalize.translate("HomeScreen.tabGroupOfTenant")} style={{ flex: 1, color: '#606060' }}>
                <ActivityIndicator preset={ActivityIndicator.preset.h1} style={{ flex: 1 }}></ActivityIndicator>
              </View>)
          }
        </TabView>
        <Animated.View style={{ position: 'absolute', transform: [{ translateY: this._baseAnimY.interpolate({ inputRange: [-1, 0], outputRange: [(SGHelperWindow.getStatusBarHeight() - SGHelperWindow.getHeaderHeight()*2.2), SGHelperWindow.getStatusBarHeight()] }) },], height: SGHelperWindow.getHeaderHeight(), width: '100%' }}>
          <HomeSearchHeader accessible={true} accessibilityLabel={'HomeScreenHeader'} imageSetting={this.imageSetting} currentUser={this.currentUser} navigator={this.props.navigation} searchHistory={this.searchHistoryData} style={style.throwWHP}></HomeSearchHeader>
        </Animated.View>

        <View style={{ position: 'absolute', height: SGHelperWindow.getStatusBarHeight(), backgroundColor: '#171717', width: '100%' }}></View>
        <Animated.View style={{ position: 'absolute', transform: [{ translateY: this._baseAnimY.interpolate({ inputRange: [-1, 0], outputRange: [SGHelperWindow.getWHPNoHeader().h + 8 * p, SGHelperWindow.getWHPNoHeader().h - Math.max(SGHelperWindow.getFooterHeight(), 2 * p) - SGHelperWindow.getHeaderHeight()] }) },], height: Math.max(SGHelperWindow.getFooterHeight(), 2 * p) + SGHelperWindow.getHeaderHeight(), width: '100%' }}>
          <BottomNavigationContainer accessible={true} accessibilityLabel={'HomeScreenBottomNav'} currentUser={this.currentUser} navigator={this.props.navigation} style={style.throwWHP} screen={this.props.route.name} ></BottomNavigationContainer>
        </Animated.View>
      </RootView>
    );
  }
}