
/**.
 * Version 1.2.0
  * 1. Yohanes 05 April 2021
  * - add ErrorHandling
  * Leon, 4 May 2021
  - Fix Like, Fix Favorite, Fix Notification
 * 
 * Version 1.1.0
    Change Log , Melvin - > Fixing Card Resto Home
    1. Yohanes , 10 March 2021
 * - fix style

 */

import React from 'react';
import { StyleSheet, Alert, Animated,Platform } from 'react-native';
import { SGView as View,SGViewShot, SGRootView as RootView, SGText as Text, SGScrollView as ScrollView, SGButton as Button, SGTextInput as TextInput, SGTabView as TabView, SGDialogBox, SGQRScanner, SGActivityIndicator as ActivityIndicator, SGImage as Image,SGIcon as Icon,SGWebView as WebView } from '../../../core/control';
import { SGBaseScreen } from '../../../core/screen/SGBaseScreen';
import { SGLocalize } from '../../locales/SGLocalize';
import { BottomNavigationContainer } from '../../component_V2/BottomNavigationContainer';
import { SimpleSearchBar } from '../../component_V2/SimpleSearchBar';
import { RestoHomeHeader } from '../../container_V2/RestoHomeHeader';
import {RestoHomeNewHeader} from '../../container_V2/RestoHomeNewHeader';
import {RestoHomeNewHeaderLuxury} from '../../container_V2/RestoHomeNewHeaderLuxury';
import { SGPopView } from '../../../core/control/SGPopView';
import { SGHelperNavigation, SGHelperGlobalVar, SGHelperWindow,SGHelperType ,SGHelperErrorHandling} from '../../../core/helper';
import { RestoPromoSlider } from '../../container_V2/RestoPromoSlider';
import { RestoMenuSlider } from '../../container_V2/RestoMenuSlider';
import { tbUserCheckInData } from '../../db/tbUserCheckInDAO';
import { tbVUserCheckInAPI } from '../../api/tbVUserCheckInAPI';
import { VRestoHomeAPI } from '../../api/VRestoHomeAPI';
import { VRestoProfileAPI } from '../../api/VRestoProfileAPI';
import { tbVOrderMenuAPI } from '../../api/tbVOrderMenuAPI';
import { tbVUserxOrderTableData } from '../../db/tbUserxOrderTableData';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { VRewardAPI } from '../../api/VRewardAPI';
import { tbVUserViewAPI } from '../../api/tbVUserViewAPI';
import { RestoMenuCategorySlider } from '../../container_V2/RestoMenuCategorySlider';
import { sortDAO } from '../../db/sortDAO';
import { WebViewRender,WebViewButton } from '../../component_V2/WebViewRender';
import {tbVAuctionAPI} from '../../api/tbVAuctionAPI';
import {AuctionSlider} from '../../container_V2/AuctionSlider';

export class RestoHomeScreen extends SGBaseScreen {

    getPagingData(){
        var itemPerPage = SGHelperType.getPaging()
        return {paging:false,offset:this.pagingCounter, totalPerPage:itemPerPage}
    }

    getPagingOrderMenu(){
        var itemPerPage = SGHelperType.getPaging()
        return {paging:true,offset:this.pagingCounterOrderMenu, totalPerPage:itemPerPage}
    }

    getDataFilterActiveOrderMenuActive() {
        return ([
            { name: 'fStatus', operator: 'IN', value: ["neworder"], visible: false },
            { name: 'fUserID', operator: '=', value: this.currentUserData.fID, visible: false },
        ]);
    }

    getSortDataActive() {
        return ([
            { name: 'ordermenufLastModifiedDate', descending: false, selected: true, visible: false },
            { name: 'ordermenufID', descending: false, selected: true, visible: false },
        ]);
    }

    createStyleSheet = (whp) => {
        var { w, h, p } = whp;

        return StyleSheet.create({
            mainContainer: { width: w, height: '100%', backgroundColor: 'white', justifyContent: 'flex-start' },
            throwWHP: { width: w, height: h, padding: p },
            tabBarStyle: { borderColor: '#E7E7E7', borderTopWidth: w * 0.006, borderBottomWidth: w * 0.006, width:w },
            tabBarUnderlineStyle: { backgroundColor: '#1E1E1E' },
            textSeeMore: { alignSelf: 'flex-end', color: '#00cdf6', marginRight: 2 * p, marginVertical: 4 * p },
            orderMenuInputCodeView: { width: w - 12 * p, flexDirection: 'row', backgroundColor: "white", marginTop: 2 * p },
            codeTextInput: { marginVertical: 3 * p, width: w * 0.6, height: w * 0.1 },
            qrScannerView: { backgroundColor: 'white', marginHorizontal: p },
            vOrderMenu: { width: w - 12 * p, marginTop: 5 * p },
            orderMenuText1: { color: 'black', alignSelf: 'flex-start', paddingLeft: 2 * p },
            orderMenuText2: { color: 'grey', alignSelf: 'flex-start', paddingLeft: 2 * p },
            vRestoBooking: { width: w - 12 * p, height: w * 0.25, justifyContent: 'center', backgroundColor: "white", borderRadius: 4 * p, marginTop: 5 * p,borderColor:'#F5F5F5',borderWidth:0.4*p },
            vRestoBookingDisabled: { width: w - 12 * p, height: w * 0.25, justifyContent: 'center', backgroundColor: "grey", borderRadius: 4 * p, marginTop: 5 * p },
            restoBookingText1: { color: 'black', alignSelf: 'flex-start', paddingLeft: 3 * p },
            restoBookingText2: { color: 'grey', alignSelf: 'flex-start', paddingLeft: 3 * p },
            notAvailable:{color:'red',alignSelf:'flex-end',paddingRight:2*p},
            buttonSubmit: { borderRadius: 6 * p, width: w * 0.4, height: w * 0.115, alignItems: 'center', justifyContent: 'center', marginBottom: 8 * p },
            buttonMyOrder: { borderRadius: 6 * p, width: w * 0.4, height: w * 0.115, alignItems: 'center', justifyContent: 'center', marginBottom: 8 * p },
            textEmpty: {marginVertical: 0.3 * w, textAlign:'center', maxWidth: w * 0.75, color: '#858585' },
            vVIcon: { width: w, height: w * 0.1, flexDirection: 'row', backgroundColor: 'white', justifyContent: 'flex-start', paddingLeft: 5 * p },
            vVIcon1: { flexDirection: 'row', paddingLeft: 2 * p },
            vVIcon2: { flexDirection: 'row', paddingLeft: 4 * p },
            iconChef: { color: "#FBB833", marginRight:2*p },
            iconSpicy: { color: '#E24444', marginVertical: 0 },
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
            pv1: { width: 8.5*w/10, padding: p, borderRadius: 2 * p, marginBottom: p, backgroundColor: '#f8f8ff', justifyContent: 'flex-start' },
            pv2: { marginTop: 3*p, maxHeight: 2*h/3 },
            pv3: { marginTop: 3*p, maxHeight: 2*h/3 },
        });
    }

    constructor(props, context, ...args) {
        super(props, context, ...args);
        this.style = this.createStyleSheet(this.WHP);
        this.orderMenuKey = '';
        this.orderMenuQRKey = ''
        this.currentUser = SGHelperGlobalVar.getVar('GlobalCurrentUser');
        this.restoProductPdfDataList = [];
        this.currentUserData = SGHelperGlobalVar.getVar('GlobalCurrentUserData');
        this.imageSetting = SGHelperGlobalVar.getVar('GlobalImageSetting');
        this.currentUserImage = SGHelperGlobalVar.getVar('GlobalCurrentUserImage');
        this.currency = SGHelperGlobalVar.getVar('GlobalCurrency');
        this.anonymousMode = SGHelperGlobalVar.getVar('GlobalAnonymous');

        this.restoProductCategoryData = [];
        this.productDataList = [];
        this.restoAuctionData = [];
        this.productEmpty = false;
        this.restoHeaderData = '';
        this.dataTable = [];
        this.selectedRestoKey = this.props.route.params.contentKey;
        this.userxOrderTableData = new tbVUserxOrderTableData();
        this.animFlag = false;
        this.isAlreadyCheckIn = 'false';
        this.props.navigation.setOptions({
            headerShown: false,
        });
        this.alreadyMount = false;
        this.pvID = SGPopView.getPopViewID();
        this.pvID2 = SGPopView.getPopViewID();
        this.surpriseReward = { fID: null, fRewardID: { fTargetName: '', fShortDescription: '', fImageJSON: [] }, fRewardEN: { fTargetName: '', fShortDescription: '', fImageJSON: [] }, fRewardCN: { fTargetName: '', fShortDescription: '', fImageJSON: [] } }
        this.sortArr = sortDAO.getRestoMenuNoSearchSortData();
        this.counterBatch=0
        this.errorBatch = []

        this.dataFilterActive = this.getDataFilterActiveOrderMenuActive();
        this._dataSortActive = this.getSortDataActive();

        this.orderExistance = true
        try {
            this.props.route.params.orderMenuTab?this.orderMenuTab = this.props.route.params.orderMenuTab : this.orderMenuTab = 0;
        } catch {
            this.orderMenuTab = 0;
        }
        this.webViewRenderRef = React.createRef()
        this.touhableWL = false;
        this.touchableR = false;
        this._baseAnimVar = new Animated.Value(1);
        this.showFullScreen = false;
        this.luxuryMode = false;
        this.viewShotRef = React.createRef();
        this.screenShotMode = false;
    }

    async componentDidMount() {
        await this._onRefreshAllItem(false);
        this._unsubscribe = this.props.navigation.addListener('focus', async () => {
            this.touhableWL = false;
            this.touchableR = false;
            await this._onRefreshAllItem(true);
        });

       
    }

    async checkAPIBatchStatusAllDone(onFocusFlag) {

        try {
            await this._showProduct(onFocusFlag)
           
        } catch (error) {
            SGHelperErrorHandling.Handling(error,this.checkAPIBatchStatusAllDone.bind(this))
        }
    }

    async checkAPIBatchStatusAllDone1(onFocusFlag){
        this._checkUserView()
        this._SurpriseRewardOpenStore(onFocusFlag);
        this.alreadyMount = true;

        console.log('check all done ----')
        
        this.forceUpdate();
        if(SGHelperType.isDefined(this.props.route.params.movetoOrderMenu) && this.props.route.params.movetoOrderMenu == true){
            this.props.route.params.movetoOrderMenu = false;
            setTimeout((()=>{this.refs.TV1.goToPageLabel(SGLocalize.translate("restoHomeScreen.tabOrderMenuTitle"))}).bind(this),300);
        }
        if(SGHelperType.isDefined(this.props.route.params.movetoRestoMenu) && this.props.route.params.movetoRestoMenu == true){
            this.props.route.params.movetoRestoMenu = false;
            if(this.restoProductPdfDataList.length!==0 || this.productDataList.length !== 0){
                setTimeout((()=>{this.refs.TV1.goToPageLabel(SGLocalize.translate("restoHomeScreen.tabMenuListTitle"))}).bind(this),300);
            }
        }
        // if (!this.animFlag) { setTimeout(() => { this.animFlag = true; this.baseCreateAnimation(500, null); }, 1000); }
        // if (!this.animFlag) { setTimeout(() => { this.animFlag = true; this.baseCreateAnimation(500, null); }, 1000); }
    }

    async _onRefreshAllItem(onFocusFlag) {
        this.currentUser = SGHelperGlobalVar.getVar('GlobalCurrentUser');
        this.currentUserData = SGHelperGlobalVar.getVar('GlobalCurrentUserData');
        this.imageSetting = SGHelperGlobalVar.getVar('GlobalImageSetting');
        this.currentUserImage = SGHelperGlobalVar.getVar('GlobalCurrentUserImage');
        this.paging = this.getPagingData();
        this.pagingOrderMenu = this.getPagingOrderMenu();

        this.baseInitAPIParallel( SGHelperGlobalVar.getVar("ResponTimes"), (() => { this.checkAPIBatchStatusAllDone(onFocusFlag); }).bind(this));

        this.baseAddAPIParallel('getRestoSettings', (async (v1) => { return VRestoHomeAPI.getRestoSettings(v1) }).bind(this,this.props.route.params.contentKey), ((v) => {
            this.restoSettingsData = v 
            console.log(v)
            console.log("RESTORAN SETTING CHECK")
        }).bind(this), null);
        this.baseAddAPIParallel('getRestoProductCategory', (async (v1) => { return VRestoHomeAPI.getRestoProductCategory(v1) }).bind(this,this.props.route.params.contentKey), ((v) => {
            this.restoProductCategoryData = v 
            console.log('this.restoProductCategoryData')
            console.log(v)
        }).bind(this), null);
        this.baseAddAPIParallel('CheckUserCheckInHere', (async (v1) => { return tbVUserCheckInAPI.CheckUserCheckInHere(v1) }).bind(this,this.props.route.params.contentKey), ((v) => {
            this.isAlreadyCheckIn = v 
        }).bind(this), null);
        this.baseAddAPIParallel('getRestoHomeHeader', (async (v1) => { return VRestoHomeAPI.getRestoHomeHeader(v1) }).bind(this,this.props.route.params.contentKey), ((v) => {
            this.restoHeaderData = v 
            if(this.restoHeaderData.fLuxuryMode == 'Y') this.luxuryMode = true;
            else this.luxuryMode = false;
        }).bind(this), null);
        this.baseAddAPIParallel('getRestoHomeProfile', (async (v1) => { return VRestoProfileAPI.getRestoHomeProfile(v1) }).bind(this,this.props.route.params.contentKey), ((v) => {
            this.restoProfileData = v 
            console.log('DATA PROFILE')
            console.log(this.restoProfileData)
        }).bind(this), null);
        this.baseAddAPIParallel('getRestoPromoSlider', (async (v1) => { return VRestoHomeAPI.getRestoPromoSlider(v1) }).bind(this,this.props.route.params.contentKey), ((v) => {
            this.restoPromoData = v 
        }).bind(this), null);
        this.baseAddAPIParallel('getRestoTrendingProductList', (async (v1) => { return VRestoHomeAPI.getRestoTrendingProductList(v1) }).bind(this,this.props.route.params.contentKey), ((v) => {
            this.restoTrendingProductData = v 
        }).bind(this), null);
        this.baseAddAPIParallel('getRestoBestSellerProductList', (async (v1) => { return VRestoHomeAPI.getRestoBestSellerProductList(v1) }).bind(this,this.props.route.params.contentKey), ((v) => {
            this.restoBestSellerProductData = v 
        }).bind(this), null);
        this.baseAddAPIParallel('getRestoChefRecommendedProductList', (async (v1) => { return VRestoHomeAPI.getRestoChefRecommendedProductList(v1) }).bind(this,this.props.route.params.contentKey), ((v) => {
            this.restoChefRecommendedProductData = v 
        }).bind(this), null);
        this.baseAddAPIParallel('getRestoPromoProductList', (async (v1) => { return VRestoHomeAPI.getRestoPromoProductList(v1) }).bind(this,this.props.route.params.contentKey), ((v) => {
            this.restoPromoProductData = v 
        }).bind(this), null);
        this.baseAddAPIParallel('getRestoProductPdfCategory', (async (v1) => { return VRestoHomeAPI.getRestoProductPdfCategory(v1) }).bind(this,this.props.route.params.contentKey), ((v) => {
            this.restoPdfCategoryData = v 
            
            console.log(this.restoPdfCategoryData)
        }).bind(this), null);


        this.baseAddAPIParallel('searchRestoAuctionSlider', (async (v1) => { return tbVAuctionAPI.searchRestoAuctionSlider(v1) }).bind(this,this.props.route.params.contentKey), ((v) => {
            this.restoAuctionData = v 
            console.log('searchRestoAuctionSlider')
            console.log(this.restoAuctionData);
        }).bind(this), null);


        if (this.anonymousMode !== true) {
            this.baseAddAPIParallel('searchOrderMenuMyBookingVisitor', (async (v1,v2,v3) => { return tbVOrderMenuAPI.searchOrderMenuMyBookingVisitor(v1,v2,v3); }).bind(this,this.dataFilterActive, this._dataSortActive,this.pagingOrderMenu), ((v) => {
                this.dataActive = v;
                this.doesOrderExist();
            }).bind(this),  null);
        }
        this.baseRunAPIParallel();

    }

    async _checkUserView(){
        if (this.alreadyMount === false) {
            var jsonInput = { fID: '', fContentType: 'Resto', fContentKey: this.props.route.params.contentKey, fTargetKey: this.props.route.params.contentKey, fUserKey: '', fActive: 'Y', fCreatedBy: '', fCreatedDate: new Date(), fLastModifiedBy: '', fLastModifiedDate: new Date() }
     
            tbVUserViewAPI.addUserView(jsonInput).then(()=>{

            }).catch((error)=>{
                SGHelperErrorHandling.Handling(error,this._checkUserView.bind(this,jsonInput))
            })  
        }
    }

    async _showProduct(onFocusFlag){

            this.paging = this.getPagingData();

            this.baseInitAPIParallel( SGHelperGlobalVar.getVar("ResponTimes"), (() => { this.checkAPIBatchStatusAllDone1(onFocusFlag) }).bind(this));
            if (this.restoSettingsData.fProductShownType === 'pdf') {
                this.baseAddAPIParallel('getRestoProductPdfByCategoryDapper', (async (v1,v2) => { return VRestoHomeAPI.getRestoProductPdfByCategoryDapper(v1,v2) }).bind(this,this.props.route.params.contentKey, this.paging), ((v) => {       
                    this.restoProductPdfDataList = v
                }).bind(this), null);
            }else{
                this.baseAddAPIParallel('getRestoProductByCategoryDapper', (async (v1,v2,v3) => { return VRestoHomeAPI.getRestoProductByCategoryDapper(v1,v2,v3) }).bind(this,this.props.route.params.contentKey, this.sortArr,this.paging), ((v) => {       
                    this.productDataList = v
                }).bind(this), null);
            }
            this.baseRunAPIParallel();
    }

    componentWillUnmount() {
        if (this._unsubscribe) { this._unsubscribe(); }
    }

    showPopView(args) {
        SGPopView.showPopView(args[0]);
    }

    onHideReward() {
        this.surpriseReward = { fID: null, fRewardID: { fTargetName: '', fShortDescription: '', fImageJSON: [] }, fRewardEN: { fTargetName: '', fShortDescription: '', fImageJSON: [] }, fRewardCN: { fTargetName: '', fShortDescription: '', fImageJSON: [] } }
        SGPopView.hidePopView(this.pvID);
    }

    onShowReward() {
        console.log('show reward')
        setTimeout(() => { SGPopView.showPopView(this.pvID); this.forceUpdate(); }, 300);
    }

    async _onCheckInPress() {
        if (this.anonymousMode) {
            SGDialogBox.showAction(null, SGLocalize.translate("AnonymousAlert.title"), SGLocalize.translate("AnonymousAlert.message"), SGLocalize.translate("AnonymousAlert.signUpButton"), () => { SGHelperNavigation.navigatePush(this.props.navigator, 'SignUp') }, SGLocalize.translate("AnonymousAlert.signInButton"), () => { SGHelperNavigation.navigatePush(this.props.navigator, 'SignIn') }, true)
        }
        else {
            if (this.currentUser) {
                this.dbID2 = SGDialogBox.showLoading(SGLocalize.translate('AlertMessage.Waiting'));
                await this._onCheckInPressHandler()
                this.isAlreadyCheckIn = true;
                this.forceUpdate();
                await this._SurpriseRewardCheckInStore();
                SGDialogBox.hideDialogBox(this.dbID2, true);   
            }
        }
    }

    async _onCheckInPressHandler(){
        try {
            var userCheckInData = new tbUserCheckInData().getCurrentJSON();
            userCheckInData.fID = null;
            userCheckInData.fUserKey = this.currentUser;
            userCheckInData.fCreatedBy = this.currentUser;
            userCheckInData.fLastModifiedBy = this.currentUser;
            userCheckInData.fContentType = 'Resto';
            userCheckInData.fContentKey = this.props.route.params.contentKey;
            await tbVUserCheckInAPI.addUserCheckIn(userCheckInData);
        } catch (error) {
            SGDialogBox.hideDialogBox(this.dbID2, true); 
            SGHelperErrorHandling.Handling(error,this._onCheckInPressHandler.bind(this))
        }
    }

    async _SurpriseRewardOpenStore(onFocusFlag) {
        try {
            if (!SGHelperGlobalVar.getVar('GlobalAnonymous')) {
                console.log('OPEN STORE--------------------------------------')
                if(onFocusFlag===false)this.surpriseReward = await VRewardAPI.SurpriseRewardOpenStore(this.props.route.params.contentKey)
                else this.surpriseReward = { fID: null, fRewardID: { fTargetName: '', fShortDescription: '', fImageJSON: [] }, fRewardEN: { fTargetName: '', fShortDescription: '', fImageJSON: [] }, fRewardCN: { fTargetName: '', fShortDescription: '', fImageJSON: [] } }
                if (this.surpriseReward.fID !== null) {
                    this.onShowReward()
                } else this.surpriseReward = { fID: null, fRewardID: { fTargetName: '', fShortDescription: '', fImageJSON: [] }, fRewardEN: { fTargetName: '', fShortDescription: '', fImageJSON: [] }, fRewardCN: { fTargetName: '', fShortDescription: '', fImageJSON: [] } }
    
            }
        } catch (error) {
            SGHelperErrorHandling.Handling(error,this._SurpriseRewardOpenStore.bind(this,onFocusFlag))
        }


    }

    async _SurpriseRewardCheckInStore() {
        try {
            if (!SGHelperGlobalVar.getVar('GlobalAnonymous')) {
                this.surpriseReward = await VRewardAPI.SurpriseRewardCheckInStore(this.props.route.params.contentKey)
                console.log('surprise reward checkIn')
                console.log(this.surpriseReward);
                if (this.surpriseReward.fID !== null) {
                    this.onShowReward()
                } else this.surpriseReward = { fID: null, fRewardID: { fTargetName: '', fShortDescription: '', fImageJSON: [] }, fRewardEN: { fTargetName: '', fShortDescription: '', fImageJSON: [] }, fRewardCN: { fTargetName: '', fShortDescription: '', fImageJSON: [] } }
            }
        } catch (error) {
            SGDialogBox.hideDialogBox(this.dbID2, true); 
            SGHelperErrorHandling.Handling(error,this._SurpriseRewardCheckInStore.bind(this))
        }


    }

    async _SurpriseRewardLikeTenant(restoKey) {
        try {
            if (!SGHelperGlobalVar.getVar('GlobalAnonymous')) {
                this.surpriseReward = await VRewardAPI.SurpriseRewardLikeStore(restoKey)
                console.log(this.surpriseReward)
                if (this.surpriseReward.fID !== null) {
                    this.onShowReward()
                } else this.surpriseReward = { fID: null, fRewardID: { fTargetName: '', fShortDescription: '', fImageJSON: [] }, fRewardEN: { fTargetName: '', fShortDescription: '', fImageJSON: [] }, fRewardCN: { fTargetName: '', fShortDescription: '', fImageJSON: [] } }
            }
        } catch (error) {
            SGHelperErrorHandling.Handling(error,this._SurpriseRewardLikeTenant.bind(this,restoKey))
        }
        
    }

    async _onKeyPress() {
        try {
            if (this.anonymousMode) {
                SGDialogBox.showAction(null, SGLocalize.translate("AnonymousAlert.title"), SGLocalize.translate("AnonymousAlert.messageAnonymousWithCheckInResto"), SGLocalize.translate("AnonymousAlert.signUpButton"), () => { SGHelperNavigation.navigatePush(this.props.navigation, 'SignUp') }, SGLocalize.translate("AnonymousAlert.signInButton"), () => { SGHelperNavigation.navigatePush(this.props.navigation, 'SignIn') }, true)
            }
            else if (this.isAlreadyCheckIn !== true) {
                SGDialogBox.showAction(null, SGLocalize.translate("AnonymousAlert.title"), SGLocalize.translate("CheckInAlert.messageCheckInResto"), SGLocalize.translate("CheckInAlert.cancelButton"), () => { }, SGLocalize.translate("CheckInAlert.checkInButton"), () => { this._onCheckInPress(); }, true)
            }
            else {
                var circuitBreaker = SGHelperType.getCircuitBreakerStatus('CircuitBreakerOrderMenuSubmit')
                var language=SGHelperGlobalVar.getVar('GlobalLanguage').toUpperCase()
                if(circuitBreaker.fActive==="Y"){
                    if (this.orderMenuKey !== '') {
                        this.dbID2 = SGDialogBox.showLoading(SGLocalize.translate("AlertMessage.Processing"))
                        this.dataTable = await tbVOrderMenuAPI.searchTableDataWithKeyVisitor(this.orderMenuKey, this.selectedRestoKey);
                        if (this.dataTable.length !== 0) {
                            this.checkDataUserxOrderTable = await tbVOrderMenuAPI.SearchUserxOrderTable([{ name: 'fUserID', operator: '=', value: this.currentUserData.fID }, { name: 'fOrderTableID', operator: '=', value: this.dataTable[0].fID }], [])
                            if (this.checkDataUserxOrderTable.length !== 0) {
        
                                SGDialogBox.hideDialogBox(this.dbID2, true);
                                this.orderMenuKey = '';
                                SGHelperNavigation.navigatePush(this.props.navigation, 'OrderList', { fID: this.dataTable[0].fID, restoKey: this.selectedRestoKey })
                            } else {
                                this.userxOrderTableData.fOrderTableID = this.dataTable[0].fID;
                                this.userxOrderTableData.fUserID = this.currentUserData.fID;
                                await tbVOrderMenuAPI.addUserxOrderTable(this.userxOrderTableData);
                               
                                SGDialogBox.hideDialogBox(this.dbID2, true);
                                this.orderMenuKey = '';
                                SGHelperNavigation.navigatePush(this.props.navigation, 'OrderList', { fID: this.dataTable[0].fID, restoKey: this.selectedRestoKey })
                             
                            }
                        } else {
                            SGDialogBox.hideDialogBox(this.dbID2, true);
                            SGDialogBox.showWarning(null, SGLocalize.translate("AlertMessage.Fail"), SGLocalize.translate("AlertMessage.FailInputKeyOrderMenu"), SGLocalize.translate("AlertMessage.OK"), () => { }, true)
                        }
                    }
                }else{
                    SGDialogBox.showWarning(null,circuitBreaker["Title"+language],circuitBreaker[language],circuitBreaker["Button"+language],()=>{},true)
                }
               
            }
        } catch (error) {
            SGDialogBox.hideDialogBox(this.dbID2, true);
            SGHelperErrorHandling.Handling(error,this._onKeyPress.bind(this))
        }
        
    }

    _onTextInputOrderMenuPress(){
        if (this.anonymousMode) {
            SGDialogBox.showAction(null, SGLocalize.translate("AnonymousAlert.title"), SGLocalize.translate("AnonymousAlert.messageAnonymousWithCheckInResto"), SGLocalize.translate("AnonymousAlert.signUpButton"), () => { SGHelperNavigation.navigatePush(this.props.navigation, 'SignUp') }, SGLocalize.translate("AnonymousAlert.signInButton"), () => { SGHelperNavigation.navigatePush(this.props.navigation, 'SignIn') }, true)
        }
    }

    _onWaitingListButtonPress() {
       
        var circuitBreaker = SGHelperType.getCircuitBreakerStatus('CircuitBreakerWaitingListResto')
        var language=SGHelperGlobalVar.getVar('GlobalLanguage').toUpperCase()
        if(circuitBreaker.fActive==="Y"){        
            if (this.anonymousMode) {
                SGDialogBox.showAction(null, SGLocalize.translate("AnonymousAlert.title"), SGLocalize.translate("AnonymousAlert.message"), SGLocalize.translate("AnonymousAlert.signUpButton"), () => { SGHelperNavigation.navigatePush(this.props.navigation, 'SignUp') }, SGLocalize.translate("AnonymousAlert.signInButton"), () => { SGHelperNavigation.navigatePush(this.props.navigation, 'SignIn') }, true)
            }else{
                if(!this.touhableWL) {
                    this.touhableWL = true;
                    SGHelperNavigation.navigatePush(this.props.navigation, 'RestoWaitingList', { restoKey: this.selectedRestoKey }) 
                } 
            }
        }else{
            SGDialogBox.showWarning(null,circuitBreaker["Title"+language],circuitBreaker[language],circuitBreaker["Button"+language],()=>{},true)
        }
    }

    _onReservationButtonPress() {
        var circuitBreaker = SGHelperType.getCircuitBreakerStatus('CircuitBreakerReservationResto')
        var language=SGHelperGlobalVar.getVar('GlobalLanguage').toUpperCase()
        if(circuitBreaker.fActive==="Y"){            
            if (this.anonymousMode) {
                SGDialogBox.showAction(null, SGLocalize.translate("AnonymousAlert.title"), SGLocalize.translate("AnonymousAlert.message"), SGLocalize.translate("AnonymousAlert.signUpButton"), () => { SGHelperNavigation.navigatePush(this.props.navigation, 'SignUp') }, SGLocalize.translate("AnonymousAlert.signInButton"), () => { SGHelperNavigation.navigatePush(this.props.navigation, 'SignIn') }, true)
            }else{
                if(!this.touchableR) {
                    this.touchableR = true;
                    SGHelperNavigation.navigatePush(this.props.navigation, 'RestoReservation', { restoKey: this.selectedRestoKey })
                }
            }
        }else{
            SGDialogBox.showWarning(null,circuitBreaker["Title"+language],circuitBreaker[language],circuitBreaker["Button"+language],()=>{},true)
        }
    }

    async _onKeyQRCodePress() {
      
            setTimeout(async()=>{
                try {
                var circuitBreaker = SGHelperType.getCircuitBreakerStatus('CircuitBreakerOrderMenuScan')
                var language=SGHelperGlobalVar.getVar('GlobalLanguage').toUpperCase()
                if(circuitBreaker.fActive==="Y"){
                    this.dbID2 = SGDialogBox.showLoading(SGLocalize.translate("AlertMessage.Processing"))
                    this.dataOrderTable = await tbVOrderMenuAPI.searchOrderTablesVisitor([{ name: 'fTableKey', operator: '=', value: this.orderMenuQRKey }, { name: 'fStatus', operator: 'IN', value: ['neworder', 'completed'] }, { name: 'fStoreKey', operator: '=', value: this.selectedRestoKey }], [])
                    if (this.dataOrderTable.length !== 0) {
                        this.checkDataUserxOrderTable = await tbVOrderMenuAPI.SearchUserxOrderTable([{ name: 'fUserID', operator: '=', value: this.currentUserData.fID }, { name: 'fOrderTableID', operator: '=', value: this.dataOrderTable[0].fID }], [])
                        if (this.checkDataUserxOrderTable.length !== 0) {
                            SGDialogBox.hideDialogBox(this.dbID2, true);
                            SGHelperNavigation.navigatePush(this.props.navigation, 'OrderList', { fID: this.dataOrderTable[0].fID, restoKey: this.selectedRestoKey }, true)
                        } else {
                            this.userxOrderTableData.fOrderTableID = this.dataOrderTable[0].fID;
                            this.userxOrderTableData.fUserID = this.currentUserData.fID;
                            await tbVOrderMenuAPI.addUserxOrderTable(this.userxOrderTableData);
                            SGDialogBox.hideDialogBox(this.dbID2, true);
                                SGHelperNavigation.navigatePush(this.props.navigation, 'OrderList', { fID: this.dataOrderTable[0].fID, restoKey: this.selectedRestoKey }, true)
                        }
                    }
                    else {
                        this.dataTableQR = await tbVOrderMenuAPI.searchTableListQRCode([{ name: 'fTableKey', operator: '=', value: this.orderMenuQRKey }, { name: 'fStoreKey', operator: '=', value: this.selectedRestoKey }], []);
                        if (this.dataTableQR.length !== 0) {
                            SGDialogBox.hideDialogBox(this.dbID2, true);
                            SGHelperNavigation.navigatePopPush(this.props.navigation, 'InputDataOrderMenu', { dataTableQR: this.dataTableQR[0], restoKey: this.selectedRestoKey, navigation: this.props.navigation }, true)
                        } else {
                            SGDialogBox.hideDialogBox(this.dbID2, true);
                            SGDialogBox.showWarning(null, SGLocalize.translate("AlertMessage.Fail"), SGLocalize.translate("AlertMessage.FailScanQRMenu"), SGLocalize.translate("AlertMessage.OK"), () => { }, true)
                        }
                    }
                }else{
                    SGDialogBox.showWarning(null,circuitBreaker["Title"+language],circuitBreaker[language],circuitBreaker["Button"+language],()=>{},true)
                }
            } catch (error) {
                SGDialogBox.hideDialogBox(this.dbID2, true);
                SGHelperErrorHandling.Handling(error,this._onKeyQRCodePress.bind(this))
            }
            },300)
    }

    _disabledOrderMenu() {
        if (this.anonymousMode !== true) {
            if (this.isAlreadyCheckIn === true) {
                return false;
            }
            else {
                return true;
            }
        }
        else {
            return true;
        }
    }

    _disabledRestoBooking(){
        if (this.anonymousMode !== true) {
            if (this.isAlreadyCheckIn === true) {
                return false;
            }
            else {
                return true;
            }
        }
        else {
            return true;
        }
    }
    
    _onChangeTab(e) {
        this.selectedTab = e.i;
        this.forceUpdate();
        if (!this._baseFlag) { this.baseAnimateSlideIn(); }
    }


    async _refreshCheckIn() {
        try {
            this.isAlreadyCheckIn = await tbVUserCheckInAPI.CheckUserCheckInHere(this.props.route.params.contentKey);
            if (this.surpriseReward.fID !== null) {
                this.restoHeaderData.lastVisited = 0;
                this.onShowReward()
            } else {
                this.surpriseReward = { fID: null, fRewardID: { fTargetName: '', fShortDescription: '', fImageJSON: [] }, fRewardEN: { fTargetName: '', fShortDescription: '', fImageJSON: [] }, fRewardCN: { fTargetName: '', fShortDescription: '', fImageJSON: [] } }
                this.restoHeaderData.lastVisited = 0;
                this.forceUpdate();
            }
        } catch (error) {
            SGHelperErrorHandling.Handling(error,this._refreshCheckIn.bind(this))
        }

    }

    async _refreshCheckOut(){
        try {
            this.isAlreadyCheckIn = await tbVUserCheckInAPI.CheckUserCheckInHere(this.props.route.params.contentKey);
            this.forceUpdate();
        } catch (error) {
            SGHelperErrorHandling.Handling(error,this._refreshCheckOut.bind(this))
        }
    }

    goToPage(pageId) {
        this.refs.TV1.goToPage(pageId);
    }

    doesOrderExist(){
        this.dataActive.length > 0? this.orderExistance = false : this.orderExistance = true;
    }

    _onChangeTab(){
        if(!this._baseFlag){this.baseAnimateSlideIn();}
    }

    _renderEmbedYoutube(url){
        var newUrl = ''
        if((SGHelperType.left(url,17) == 'https://youtu.be/')){
            newUrl =url.replace("https://youtu.be/", "");
        }
        else if((SGHelperType.left(url,22) =='https://m.youtube.com/')){
            newUrl =url.replace("https://m.youtube.com/watch?v=", "");
        }
        else{
            newUrl =url.replace("https://www.youtube.com/watch?v=", "");
        }
        return 'https://www.youtube.com/embed/'+newUrl;
    }

    _showTnCPopView() {
        SGPopView.showPopView(this.pvID2);
    }

    _hideTnCPopView(){
        SGPopView.hidePopView(this.pvID2);
    }

    onToggleFullScreen(){
       this.showFullScreen = !this.showFullScreen;
       this.forceUpdate();
    }

    onMessage(e){
        //receive message and do the correct action here
        var message=e.nativeEvent.data;
        var parseArr = message.split('|');
        if(parseArr[0]==='url'){
        }
        else if(parseArr[0]==='saveBase64AsFile'){
            // alert(JSON.stringify('saveBase64AsFile:'+message));
            this.takeScreenShot(parseInt(parseArr[1]),parseInt(parseArr[2])*1.1)
        }
        else if(parseArr[0]==='screenshot'){
            // alert(JSON.stringify('screenshot:'+message));
            this.takeScreenShot(parseInt(parseArr[1]),parseInt(parseArr[2])*1.1)
        }
        else if(parseArr[0]==='thankyou'){
            //parseArr[1] adalah bill number
            //parseArr[2] adalah JSON dari order detail
            // SGDialogBox.showSuccess(null,parseArr[1],parseArr[2],'OK');
            // kita bisa simpan di tabel yang menyimpan transaksi interactive untuk user ini dengan bill_no tersebut
            // saat user ingin melihat history kita bisa panggil dengan url : 
            // https://hungryline.interactive.co.id/site/thank-you?bill_no=HL-8300G-61E75388570DF
            // atau 
            // https://hungryline.interactiveholic.net/site/thank-you?bill_no=HL-8300G-61E75388570DF
        }
    }

    takeScreenShot(sW,sH){
        var {w,h,p} = this.WHP;
        this.screenShotW = w;
        this.screenShotH = w * sH / sW;
        this.screenShotMode = true;
        this.forceUpdate();
        setTimeout((()=>{
            this.viewShotRef.current.Save();
        }).bind(this),500);    
    }
    onTakeScreenShotComplete(){
        this.screenShotMode = false;
        this.forceUpdate();
    }

    render() {
        var { w, h, p } = this.WHP;
        var style = this.style;
        var language = this.Language.toUpperCase()
        var surpriseReward = this.surpriseReward;
        var tR = SGLocalize.translate;
        //GH : please get this from Mall profile
        var luxury = this.luxuryMode;
        //if Interactive order menu page : inject java script to override the button
        var INJECTED_JAVASCRIPT = `(function() {
            saveBase64AsFile=function(){var h=document.getElementsByClassName('payment')[0].offsetHeight;var w=document.getElementsByClassName('payment')[0].offsetWidth;  window.ReactNativeWebView.postMessage('saveBase64AsFile|'+w+'|'+h)};
            screenshot=function(){var h=document.getElementsByClassName('thankyou')[0].offsetHeight;var w=document.getElementsByClassName('thankyou')[0].offsetWidth;  window.ReactNativeWebView.postMessage('screenshot|'+w+'|'+h)};
            sendContent=function(){
                var _sgURL=window.location.toString().split('?');
                if(_sgURL[0]==='https://hungryline.interactiveholic.net/site/thank-you'||_sgURL[0]==='https://hungryline.interactive.co.id/site/thank-you'){
                    var _sgParam = _sgURL[1].split('&');
                    for (var i=0;i<_sgParam.length;i++){
                        var _sgBILL = _sgParam[i].split('=');
                        if(_sgBILL[0]=='bill_no'){
                            var obj={};
                            var div1 = document.getElementsByClassName('thankyou-label');
                            var div2 = document.getElementsByClassName('thankyou-value');
                            for(var j=0;j<div1.length;j++){
                                obj[div1[j].innerHTML]=div2[j].innerHTML;
                            }
                            var div3 = document.getElementsByClassName('thankyou-summary-grandtotal');
                            obj[div3[0].innerHTML]=div3[1].innerHTML;
                            window.ReactNativeWebView.postMessage('thankyou|'+_sgBILL[1]+'|'+JSON.stringify(obj));
                            break;
                        }
                    }
                }
            }
            setTimeout(sendContent,500);
        })();`; 
        
        return (
            <RootView dummyStatusBar={!luxury || this.showFullScreen} accessible={true} accessibilityLabel={'RestoHomeScreenRootView'} style={style.mainContainer}>
                <SGPopView accessible={true} accessibilityLabel={'MallHomeScreenPopView'} vPos={'Top'} animationType={'slideUp'}  popViewID={this.pvID} >
                    <View accessible={true} accessibilityLabel={'MallHomeScreenRewardView'} style={style.rewardPV}>
                        <View accessible={true} accessibilityLabel={'MallHomeScreenHeaderRewardView'} style={style.headerPV}>
                            <Text accessible={true} accessibilityLabel={'MallHomeScreenCongratsText'} style={style.textPV1} preset={Text.preset.titleH2B}>{tR('mallHomeScreen.RewardCongratulation')}</Text>
                            <Text accessible={true} accessibilityLabel={'MallHomeScreenRewardText'} style={style.textPV2} preset={Text.preset.titleH4_5B}>{tR('mallHomeScreen.RewardText')} {surpriseReward['fReward' + language].fTenantName}</Text>
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
                
                {this.alreadyMount ?
                    this.restoSettingsData ?
                        (<View accessible={true} style={{backgroundColor: 'transparent'}}>
                            {/* Terms and Conditions  */}
                            <SGPopView accessible={true} accessibilityLabel={'TermsAndConditionsPopView'} shadow animationType={'slide'} popViewID={this.pvID2} vPos='center'>
                                <View style={style.pv1}>
                                    <View style={style.pv2}>
                                        <Text preset={Text.preset.titleH2B}>{SGLocalize.translate("restoHomeScreen.TnC")}</Text>
                                    </View>
                                    <View style={style.pv3}>
                                    
                                        <ScrollView accessible={true} accessibilityLabel={'TnCScrollView'} style={{ width: 8*w/10 }} contentContainerStyle={{ justifyContent: 'flex-start', alignItems: 'flex-start' }}>
                                            <Text>{this.restoSettingsData.fTermsAndConditionsOrderMenu['fTermsAndConditions'+language.toUpperCase()]}</Text>
                                        </ScrollView>
                                    
                                    </View>
                                </View>
                            </SGPopView>

                            {this.restoHeaderData !== '' && !this.showFullScreen ?
                                luxury?
                                <RestoHomeNewHeaderLuxury animVar={this._baseAnimVar} onNotification={((item, s)=>{ console.log(item);  item.fUserNotificationThis = s; this.forceUpdate();}).bind(this, this.restoHeaderData )} onFavorite={((item, s)=>{console.log(item);  item.fUserFavoriteThis = s; this.forceUpdate();}).bind(this, this.restoHeaderData)} onLike={((item, s,c)=>{console.log(item);  item.fUserLikedThis = s; item.fLikeCount+=c; this.forceUpdate();}).bind(this, this.restoHeaderData)} accessible={true} accessibilityLabel={'RestoHomeScreenHeader'} isAlreadyCheckIn={this.isAlreadyCheckIn} currentUserData={this.currentUserData} language={this.Language} imageSetting={this.imageSetting} selectedResto={this.selectedRestoKey} refresh={this._refreshCheckIn.bind(this)} refreshCheckOut={this._refreshCheckOut.bind(this)} currentUserImage={this.currentUserImage} screen='RestoProfile' navigator={this.props.navigation} headerData={this.restoHeaderData} fullData={this.restoProfileData} style={style.throwWHP} checkInReward={async () => await this._SurpriseRewardCheckInStore()} likeTenantGetReward={async () => await this._SurpriseRewardLikeTenant(this.props.route.params.contentKey)}></RestoHomeNewHeaderLuxury>
                                :<RestoHomeNewHeader animVar={this._baseAnimVar} onNotification={((item, s)=>{ console.log(item);  item.fUserNotificationThis = s; this.forceUpdate();}).bind(this, this.restoHeaderData )} onFavorite={((item, s)=>{console.log(item);  item.fUserFavoriteThis = s; this.forceUpdate();}).bind(this, this.restoHeaderData)} onLike={((item, s,c)=>{console.log(item);  item.fUserLikedThis = s; item.fLikeCount+=c; this.forceUpdate();}).bind(this, this.restoHeaderData)} accessible={true} accessibilityLabel={'RestoHomeScreenHeader'} isAlreadyCheckIn={this.isAlreadyCheckIn} currentUserData={this.currentUserData} language={this.Language} imageSetting={this.imageSetting} selectedResto={this.selectedRestoKey} refresh={this._refreshCheckIn.bind(this)} refreshCheckOut={this._refreshCheckOut.bind(this)} currentUserImage={this.currentUserImage} screen='RestoProfile' navigator={this.props.navigation} headerData={this.restoHeaderData} fullData={this.restoProfileData} style={style.throwWHP} checkInReward={async () => await this._SurpriseRewardCheckInStore()} likeTenantGetReward={async () => await this._SurpriseRewardLikeTenant(this.props.route.params.contentKey)}></RestoHomeNewHeader>
                                :
                                (null)
                            }
                            {/* Highlight Type and Not Pdf */}
                            {this.restoSettingsData.fProductShownType !== 'pdf' &&
                                <TabView hideTabBar={this.showFullScreen} onChangeTab={(e)=>{ this._onChangeTab()}} accessible={true} accessibilityLabel={'RestoHomeScreenTabView'} ref='TV1' tabBarStyle={style.tabBarStyle} tabBarTextStyle={style.tabBarTextStyle} tabBarUnderlineStyle={style.tabBarUnderlineStyle} tabBarActiveTextColor={'#000000'} tabBarInactiveTextColor={'#6E6A6A'} tabBarActiveTextPreset={Text.preset.heading6B} tabBarInactiveTextPreset={Text.preset.heading6B} style={{ flex: 1 }} initialPage={this.orderMenuTab} scrollableTabBar  renderTabBar={() => <DefaultTabBar />}>
                                {
                                    this.restoSettingsData.fShowHighlightType == 'typeA' &&
                                    (this.restoPromoData.length >= 1 ||  this.restoTrendingProductData.length >= 1 || this.restoBestSellerProductData.length >= 1 || this.restoPromoProductData.length >= 1 || this.restoChefRecommendedProductData.length >= 1 || this.restoAuctionData.length >= 1) &&
                                    <ScrollView dummyFooterBar dummyBottomBar accessible={true} accessibilityLabel={'RestoHomeScreenScrollMainView'} style={{ backgroundColor: 'white', flex: 1 }} tabLabel={SGLocalize.translate("restoHomeScreen.tabHighlightsTitle")} scrollEventThrottle={100} onScroll={this.baseOnScrollHandler.bind(this)} onMomentumScrollBegin={this.baseOnMomentumScrollBeginHandler.bind(this)} onScrollEndDrag={this.baseOnScrollEndDragHandler.bind(this)} onMomentumScrollEnd={this.baseOnMomentumScrollEndHandler.bind(this)} showsVerticalScrollIndicator={false}>
                                        {this.restoAuctionData.length !== 0 &&
                                            <AuctionSlider marginText oneLineSeeMore accessible={true} accessibilityLabel={'RestoHomeAuctionSlider'} language={this.Language} imageSetting={this.imageSetting} screen='AuctionDetail' seeMoreScreen='SeeMoreRestoAuction' seeMoreLabel={SGLocalize.translate("globalText.seeMoreText")} contentKey={this.selectedRestoKey} navigator={this.props.navigation} data={this.restoAuctionData} titleHeading={SGLocalize.translate("restoHomeScreen.AuctionHeadingTitle")} title={SGLocalize.translate("restoHomeScreen.AuctionHeadingTitle")} style={style.throwWHP}></AuctionSlider>
                                        }
                                        
                                        {this.restoSettingsData.fProductShownPromoEvent === 'Y' && this.restoPromoData.length >= 1 ?
                                            (<RestoPromoSlider befSeeMoreScreen={'RestoHighlight'} marginText oneLineSeeMore borderBottom accessible={true} accessibilityLabel={'RestoHomeScreenPromoSlider'} blackTheme imageSetting={this.imageSetting} language={this.Language} contentKey={this.selectedRestoKey} seeMoreScreen='SeeMoreRestoPromo' seeMoreLabel={SGLocalize.translate("restoHomeScreen.SeeMore")} screen='RestoPromoDetail' navigator={this.props.navigation} data={this.restoPromoData} titleHeading={SGLocalize.translate("restoHomeScreen.restoPromoTitle")} style={style.throwWHP}></RestoPromoSlider>)
                                            :
                                            (null)
                                        }
                                        {this.restoSettingsData.fProductShownTrending === 'Y' && this.restoTrendingProductData.length >= 1 ?
                                            (<RestoMenuSlider accessible={true} accessibilityLabel={'RestoHomeScreenSliderTrending'} selectedRestoKey={this.selectedRestoKey} categoryKey={'trending'} restoName={''} placeName={''} currency={this.currency} imageSetting={this.imageSetting} language={this.Language} seeMoreLabel={SGLocalize.translate("restoHomeScreen.SeeMore")} restoMenuData={this.restoTrendingProductData} navigator={this.props.navigation} title={SGLocalize.translate("restoHomeScreen.trendingTitle")} style={style.throwWHP}></RestoMenuSlider>)
                                            :
                                            (null)
                                        }
                                        {this.restoSettingsData.fProductShownBestSeller === 'Y' && this.restoBestSellerProductData.length >= 1 ?
                                            (<RestoMenuSlider accessible={true} accessibilityLabel={'RestoHomeScreenSliderTrending'} selectedRestoKey={this.selectedRestoKey} categoryKey={'bestseller'} restoName={''} placeName={''} currency={this.currency} imageSetting={this.imageSetting} language={this.Language} seeMoreLabel={SGLocalize.translate("restoHomeScreen.SeeMore")} restoMenuData={this.restoBestSellerProductData} navigator={this.props.navigation} title={SGLocalize.translate("restoHomeScreen.bestSellerTitle")} style={style.throwWHP}></RestoMenuSlider>)
                                            :
                                            (null)
                                        }
                                        {this.restoSettingsData.fProductShownPromoProduct === 'Y' && this.restoPromoProductData.length >= 1 ?
                                            (<RestoMenuSlider accessible={true} accessibilityLabel={'RestoHomeScreenSliderTrending'} selectedRestoKey={this.selectedRestoKey} categoryKey={'promo'} restoName={''} placeName={''} currency={this.currency} imageSetting={this.imageSetting} language={this.Language} seeMoreLabel={SGLocalize.translate("restoHomeScreen.SeeMore")} restoMenuData={this.restoPromoProductData} navigator={this.props.navigation} title={SGLocalize.translate("restoHomeScreen.promoTitle")} style={style.throwWHP}></RestoMenuSlider>)
                                            :
                                            (null)
                                        }
                                        {this.restoSettingsData.fProductChefRecommendation === 'Y' && this.restoChefRecommendedProductData.length >= 1 ?
                                            (<RestoMenuSlider accessible={true} accessibilityLabel={'RestoHomeScreenSliderTrending'} selectedRestoKey={this.selectedRestoKey} categoryKey={'promo'} restoName={''} placeName={''} currency={this.currency} imageSetting={this.imageSetting} language={this.Language} seeMoreLabel={SGLocalize.translate("restoHomeScreen.SeeMore")} restoMenuData={this.restoChefRecommendedProductData} navigator={this.props.navigation} title={SGLocalize.translate("restoHomeScreen.promoTitle")} style={style.throwWHP}></RestoMenuSlider>)
                                            :
                                            (null)
                                        }
                                </ScrollView>
                            }

            
                            {this.restoSettingsData.fShowHighlightType == 'typeB' &&
                                this.restoProfileData.linkWebsite !== '' &&
                                <View tabLabel={SGLocalize.translate("storeHomeScreen.tabHighlightsTitle")} style={{width:w,flex:1,justifyContent:'flex-start'}}>
                                    <WebViewRender  injectedJavaScript={INJECTED_JAVASCRIPT} onMessage={this.onMessage.bind(this)} ref={this.webViewRenderRef} data={this.restoProfileData.linkWebsite} style={style.throwWHP} fType='url' hideButton={true} highlightDisplay></WebViewRender>
                                    <View style={{position:'absolute',bottom:Platform.OS == 'ios' ?SGHelperWindow.getHeaderHeight()*2 :SGHelperWindow.getHeaderHeight(),left:2*p}}>
                                        <WebViewButton webViewRef={this.webViewRenderRef} fullScreenMode={this.showFullScreen}></WebViewButton>
                                    </View>
                                </View>
                            }
                            
                            {this.restoSettingsData.fShowHighlightType == 'typeC' &&
                                this.restoProfileData.linkInstagram !== '' &&
                                <View tabLabel={SGLocalize.translate("storeHomeScreen.tabHighlightsTitle")} style={{width:w,flex:1,justifyContent:'flex-start'}}>
                                    <WebViewRender ref={this.webViewRenderRef} data={this.restoProfileData.linkInstagram} style={style.throwWHP} fType='url' hideButton={true} highlightDisplay></WebViewRender>
                                    <View style={{position:'absolute',bottom:Platform.OS == 'ios' ?SGHelperWindow.getHeaderHeight()*2 :SGHelperWindow.getHeaderHeight(),left:2*p}}>
                                        <WebViewButton webViewRef={this.webViewRenderRef}></WebViewButton>
                                    </View>
                                </View>
                            }
                            {this.restoSettingsData.fShowHighlightType == 'typeD' &&
                                this.restoProfileData.linkFacebook !== '' &&
                                <View tabLabel={SGLocalize.translate("storeHomeScreen.tabHighlightsTitle")} style={{width:w,flex:1,justifyContent:'flex-start'}}>
                                    <WebViewRender ref={this.webViewRenderRef} data={this.restoProfileData.linkFacebook} style={style.throwWHP} fType='url' hideButton={true} highlightDisplay></WebViewRender>
                                    <View style={{position:'absolute',bottom:Platform.OS == 'ios' ?SGHelperWindow.getHeaderHeight()*2 :SGHelperWindow.getHeaderHeight(),left:2*p}}>
                                        <WebViewButton webViewRef={this.webViewRenderRef}></WebViewButton>
                                    </View>
                                
                                </View>
                            }
                            {this.restoSettingsData.fShowHighlightType == 'typeE' &&
                                <View tabLabel={SGLocalize.translate("storeHomeScreen.tabHighlightsTitle")} style={{width:w,height:h}}>
                                     <WebView style={{ flex: 1 }} source={{ html: '<h1>Youtube</h1><iframe width="100%" height="35%" src="'+this._renderEmbedYoutube(this.restoProfileData.linkYoutube)+'"'+'allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" frameborder="0" allowfullscreen></iframe>' }} />
                                </View>
                            }

                            {
                                this.restoSettingsData.fShowHighlightType !== 'typeA' &&
                                    (this.restoPromoData.length >= 1 ||  this.restoTrendingProductData.length >= 1 || this.restoBestSellerProductData.length >= 1 || this.restoPromoProductData.length >= 1 || this.restoChefRecommendedProductData.length >= 1 || this.restoAuctionData.length >= 1) && 
                                    <ScrollView dummyFooterBar dummyBottomBar accessible={true} accessibilityLabel={'RestoHomeScreenScrollMainView'} style={{ backgroundColor: 'white', flex: 1 }} tabLabel={SGLocalize.translate("restoHomeScreen.PromoAndTrending")} scrollEventThrottle={100} onScroll={this.baseOnScrollHandler.bind(this)} onMomentumScrollBegin={this.baseOnMomentumScrollBeginHandler.bind(this)} onScrollEndDrag={this.baseOnScrollEndDragHandler.bind(this)} onMomentumScrollEnd={this.baseOnMomentumScrollEndHandler.bind(this)} showsVerticalScrollIndicator={false}>
                                        {this.restoAuctionData.length !== 0 &&
                                             <AuctionSlider marginText oneLineSeeMore accessible={true} accessibilityLabel={'RestoHomeAuctionSlider'} language={this.Language} imageSetting={this.imageSetting} screen='AuctionDetail' seeMoreScreen='SeeMoreRestoAuction' seeMoreLabel={SGLocalize.translate("globalText.seeMoreText")}  contentKey={this.selectedRestoKey} navigator={this.props.navigation} data={this.restoAuctionData} titleHeading={SGLocalize.translate("restoHomeScreen.AuctionHeadingTitle")} title={SGLocalize.translate("restoHomeScreen.AuctionHeadingTitle")} style={style.throwWHP}></AuctionSlider>
                                        }

                                        {this.restoPromoData.length >= 1 ?
                                            <RestoPromoSlider befSeeMoreScreen={'RestoHighlight'} marginText oneLineSeeMore borderBottom accessible={true} accessibilityLabel={'RestoHomeScreenPromoSlider'} blackTheme imageSetting={this.imageSetting} language={this.Language} contentKey={this.selectedRestoKey} seeMoreScreen='SeeMoreRestoPromo' seeMoreLabel={SGLocalize.translate("restoHomeScreen.SeeMore")} screen='RestoPromoDetail' navigator={this.props.navigation} data={this.restoPromoData} titleHeading={SGLocalize.translate("restoHomeScreen.restoPromoTitle")} style={style.throwWHP}></RestoPromoSlider>
                                            :
                                            (null)
                                        }
                                        {this.restoSettingsData.fProductShownTrending === 'Y' && this.restoTrendingProductData.length >= 1 ?
                                            (<RestoMenuSlider accessible={true} accessibilityLabel={'RestoHomeScreenSliderTrending'} selectedRestoKey={this.selectedRestoKey} categoryKey={'trending'} restoName={''} placeName={''} currency={this.currency} imageSetting={this.imageSetting} language={this.Language} seeMoreLabel={SGLocalize.translate("restoHomeScreen.SeeMore")} restoMenuData={this.restoTrendingProductData} navigator={this.props.navigation} title={SGLocalize.translate("restoHomeScreen.trendingTitle")} style={style.throwWHP}></RestoMenuSlider>)
                                            :
                                            (null)
                                        }
                                        {this.restoSettingsData.fProductShownBestSeller === 'Y' && this.restoBestSellerProductData.length >= 1 ?
                                            (<RestoMenuSlider accessible={true} accessibilityLabel={'RestoHomeScreenSliderTrending'} selectedRestoKey={this.selectedRestoKey} categoryKey={'bestseller'} restoName={''} placeName={''} currency={this.currency} imageSetting={this.imageSetting} language={this.Language} seeMoreLabel={SGLocalize.translate("restoHomeScreen.SeeMore")} restoMenuData={this.restoBestSellerProductData} navigator={this.props.navigation} title={SGLocalize.translate("restoHomeScreen.bestSellerTitle")} style={style.throwWHP}></RestoMenuSlider>)
                                            :
                                            (null)
                                        }
                                        {this.restoSettingsData.fProductShownPromoProduct === 'Y' && this.restoPromoProductData.length >= 1 ?
                                            (<RestoMenuSlider accessible={true} accessibilityLabel={'RestoHomeScreenSliderTrending'} selectedRestoKey={this.selectedRestoKey} categoryKey={'promo'} restoName={''} placeName={''} currency={this.currency} imageSetting={this.imageSetting} language={this.Language} seeMoreLabel={SGLocalize.translate("restoHomeScreen.SeeMore")} restoMenuData={this.restoPromoProductData} navigator={this.props.navigation} title={SGLocalize.translate("restoHomeScreen.promoTitle")} style={style.throwWHP}></RestoMenuSlider>)
                                            :
                                            (null)
                                        }
                                        {this.restoSettingsData.fProductChefRecommendation === 'Y' && this.restoChefRecommendedProductData.length >= 1 ?
                                            (<RestoMenuSlider accessible={true} accessibilityLabel={'RestoHomeScreenSliderTrending'} selectedRestoKey={this.selectedRestoKey} categoryKey={'promo'} restoName={''} placeName={''} currency={this.currency} imageSetting={this.imageSetting} language={this.Language} seeMoreLabel={SGLocalize.translate("restoHomeScreen.SeeMore")} restoMenuData={this.restoChefRecommendedProductData} navigator={this.props.navigation} title={SGLocalize.translate("restoHomeScreen.promoTitle")} style={style.throwWHP}></RestoMenuSlider>)
                                            :
                                            (null)
                                        }
                                </ScrollView>
                            }

                            {this.productDataList.length !== 0 &&
                                    <ScrollView dummyFooterBar dummyBottomBar accessible={true} accessibilityLabel={'RestoHomeScreenScrollCategoryView'} style={{ backgroundColor: 'white', flex: 1 }} tabLabel={SGLocalize.translate("restoHomeScreen.tabMenuListTitle")} scrollEventThrottle={100} onScroll={this.baseOnScrollHandler.bind(this)} onMomentumScrollBegin={this.baseOnMomentumScrollBeginHandler.bind(this)} onScrollEndDrag={this.baseOnScrollEndDragHandler.bind(this)} onMomentumScrollEnd={this.baseOnMomentumScrollEndHandler.bind(this)} showsVerticalScrollIndicator={false}>
                                        <View style={style.vVIcon}>
                                            <View style={style.vVIcon1}>
                                                <Icon accessible={true} accessibilityLabel={'RestoHomeScreenIconChef'} name={Icon.Icon.chefHat} preset={Icon.preset.h5} style={style.iconChef}></Icon>
                                                <Text preset={Text.preset.h7B} style={style.text}>{SGLocalize.translate('orderMenuListScreen.RecommendationText')}</Text>
                                            </View>
                                            <View style={style.vVIcon1}>
                                                <Icon accessible={true} accessibilityLabel={'RestoHomeScreenIconSpicy'} name={Icon.Icon.chilli1} preset={Icon.preset.h5} style={style.iconSpicy}></Icon>
                                                <Text preset={Text.preset.h7B} style={style.text}>{SGLocalize.translate('orderMenuListScreen.SpicyText')}</Text>
                                            </View>
                                        </View>
                                        {this.restoSettingsData && this.restoSettingsData.fProductShownType !== 'pdf' ?
                                            (this.productDataList.map((x, index) => {
                                                return (
                                                    <RestoMenuSlider accessible={true} accessibilityLabel={'RestoHomeScreenSliderCategory'} imageSetting={this.imageSetting} language={this.Language} selectedRestoKey={this.selectedRestoKey} categoryKey={x.categoryKey} restoMenuData={x.fProduct} currency={this.currency} seeMoreLabel={SGLocalize.translate("restoHomeScreen.SeeMore")} navigator={this.props.navigation} title={x['fCategoryName' + this.Language.toUpperCase()]} style={style.throwWHP}></RestoMenuSlider>
                                                )
                                            }))
                                            :
                                            (null)
                                        }
                                    </ScrollView>
                            }

                            { this.restoSettingsData ?
                                    (this.restoSettingsData.fShownReservation =='Y' || this.restoSettingsData.fShownWaitingList =='Y') &&
                                    <ScrollView dummyFooterBar dummyBottomBar accessible={true} accessibilityLabel={'RestoHomeScreenScrollReservationView'} style={{ backgroundColor: 'white', flex: 1, }} contentContainerStyle={{ justifyContent: 'flex-start' }} tabLabel={SGLocalize.translate("restoHomeScreen.tabRestoBookingTitle")} scrollEventThrottle={100} onScroll={this.baseOnScrollHandler.bind(this)} onMomentumScrollBegin={this.baseOnMomentumScrollBeginHandler.bind(this)} onScrollEndDrag={this.baseOnScrollEndDragHandler.bind(this)} onMomentumScrollEnd={this.baseOnMomentumScrollEndHandler.bind(this)} showsVerticalScrollIndicator={false}>
                                        <TouchableOpacity accessible={true} accessibilityLabel={'RestoHomeScreenWLView'}   onPress={() => this._onWaitingListButtonPress()} disabled={this.restoSettingsData.fShownWaitingList == 'N' ? true :false}>
                                            <View style={style.vRestoBooking } >
                                                <Text accessible={true} accessibilityLabel={'RestoHomeScreenWLText1'} preset={Text.preset.titleH3B} style={style.restoBookingText1}>{SGLocalize.translate('restoHomeScreen.waitingListText1')}</Text>
                                                <Text accessible={true} accessibilityLabel={'RestoHomeScreenWLText2'} preset={Text.preset.titleH4} style={style.restoBookingText2}>{SGLocalize.translate('restoHomeScreen.waitingListText2')}</Text>
                                                {this.restoSettingsData.fShownWaitingList == 'N' &&
                                                <Text preset={Text.preset.titleH4_5B} style={style.notAvailable}>{SGLocalize.translate('restoHomeScreen.notAvailableText')}</Text>
                                                }
                                              
                                            </View>
                                        </TouchableOpacity>
                                        <TouchableOpacity accessible={true} accessibilityLabel={'RestoHomeScreenResvView'}   onPress={() => this._onReservationButtonPress()} disabled={this.restoSettingsData.fShownReservation == 'N' ? true :false}>
                                            <View style={ style.vRestoBooking}>
                                                <Text accessible={true} accessibilityLabel={'RestoHomeScreenResvText1'} preset={Text.preset.titleH3B}  style={style.restoBookingText1}>{SGLocalize.translate('restoHomeScreen.reservationText1')}</Text>
                                                <Text accessible={true} accessibilityLabel={'RestoHomeScreenResvText2'} preset={Text.preset.titleH4} style={style.restoBookingText2}>{SGLocalize.translate('restoHomeScreen.reservationText2')}</Text>
                                                {this.restoSettingsData.fShownReservation == 'N' &&
                                                <Text preset={Text.preset.titleH4_5B} style={style.notAvailable}>{SGLocalize.translate('restoHomeScreen.notAvailableText')}</Text>
                                                }
                                            </View>
                                        </TouchableOpacity>
                                    </ScrollView>
                                    :(null)}
                                    {/* Spotgue Order Menu */}
                                    { this.restoSettingsData ?
                                    this.restoSettingsData.fShownOrderMenu =='Y' && this.restoSettingsData.fOrderMenuType == 'spotgue'  &&
                                    <ScrollView dummyFooterBar dummyBottomBar accessible={true} accessibilityLabel={'RestoHomeScreenScrollOrderView'} style={{ backgroundColor: 'white', flex: 1, }} contentContainerStyle={{ justifyContent: 'flex-start', }} tabLabel={SGLocalize.translate("restoHomeScreen.tabOrderMenuTitle")} scrollEventThrottle={100} onScroll={this.baseOnScrollHandler.bind(this)} onMomentumScrollBegin={this.baseOnMomentumScrollBeginHandler.bind(this)} onScrollEndDrag={this.baseOnScrollEndDragHandler.bind(this)} onMomentumScrollEnd={this.baseOnMomentumScrollEndHandler.bind(this)} showsVerticalScrollIndicator={false}>
                                        <View style={style.vOrderMenu}>
                                            <Text accessible={true} accessibilityLabel={'RestoHomeScreenOrderMenuText1'} preset={Text.preset.titleH3B} style={style.orderMenuText1}>{SGLocalize.translate('restoHomeScreen.orderMenuText1')}</Text>
                                            <Text accessible={true} accessibilityLabel={'RestoHomeScreenOrderMenuText2'} preset={Text.preset.titleH4} style={style.orderMenuText2}>{SGLocalize.translate('restoHomeScreen.orderMenuText2')}</Text>
                                            <View style={style.orderMenuInputCodeView} shadow>
                                                <TextInput accessible={true} accessibilityLabel={'RestoHomeScreenOrderMenuKeyTextInput'} style={style.codeTextInput} disabled={this._disabledOrderMenu()} onValueChange={(v) => { this.orderMenuKey = v.toUpperCase() }} placeholder={SGLocalize.translate('restoHomeScreen.orderMenuKeyPlaceholder')}></TextInput>
                                                <View style={style.qrScannerView}>
                                                    <SGQRScanner headerTitle={'Point your camera to scan QR code'} disabled={this._disabledOrderMenu()} onScanSuccess={(v) => { this.orderMenuQRKey = v.toUpperCase(); this._onKeyQRCodePress() }} />
                                                </View>

                                            </View>
                 
                                        </View>
                                        {/* <Button preset={Button.preset.black} accessible={true} accessibilityLabel={'RestoHomeScreenSubmitButton'} textPreset={Text.preset.titleH3B} style={style.buttonSubmit} label={SGLocalize.translate('restoHomeScreen.orderMenuSubmitButton')} onPress={()=>{this.orderMenuQRKey = 'B192312863'; this._onKeyQRCodePress()}}></Button> */}
                                        <View style={{flexDirection:'row', justifyContent:"space-between"}}>
                                            

                                            <Button preset={Button.preset.black} accessible={true} accessibilityLabel={'RestoHomeScreenSubmitButton'} textPreset={Text.preset.titleH3B} style={style.buttonSubmit} label={SGLocalize.translate('restoHomeScreen.orderMenuSubmitButton')} onPress={this._onKeyPress.bind(this)}></Button>
                                            <Button hidden={this.orderExistance} preset={Button.preset.green} style={style.buttonMyOrder} accessible={true} label={SGLocalize.translate('restoHomeScreen.orderMenuMyOrder')} onPress={()=>{SGHelperNavigation.navigatePush(this.props.navigation, 'MyRestoBooking', {initialPageCounter: 2})}}></Button>
                                        </View>
                                        
                                        {/* Terms and Conditions  */}
                                        { this.restoSettingsData.fTermsAndConditionsOrderMenu['fTermsAndConditions'+language.toUpperCase()] != "" &&
                                            <TouchableOpacity onPress={() => {this._showTnCPopView()}}>
                                                <Text preset={Text.preset.titleH4B} style={{color:'#63AEE0', marginBottom: 3*p}}>{SGLocalize.translate("restoHomeScreen.TnC")}</Text>
                                            </TouchableOpacity>
                                        }

                                    </ScrollView>
                                    :(null)}

                                   {/* Interactive Order Menu */}
                                   { this.restoSettingsData ?
                                    this.restoSettingsData.fShownOrderMenu =='Y' && this.restoSettingsData.fOrderMenuType == 'interactive'  &&
                                    <View tabLabel={SGLocalize.translate("restoHomeScreen.tabOrderMenuTitle")} style={{width:w,flex:1,justifyContent:'flex-start'}}>
                                        <SGViewShot onComplete={this.onTakeScreenShotComplete.bind(this)} ref={this.viewShotRef} options={{ format: "png", quality: 1.0 }}>
                                            <WebViewRender screenShotW = {this.screenShotW} screenShotH = {this.screenShotH} screenShotMode={this.screenShotMode} injectedJavaScript={INJECTED_JAVASCRIPT} onMessage={this.onMessage.bind(this)} ref={this.webViewRenderRef} data={this.restoSettingsData.fInteractiveLink} style={style.throwWHP} fType='url' hideButton={true}></WebViewRender>
                                        </SGViewShot>
                                        <View style={{position:'absolute',bottom:Platform.OS == 'ios' ?SGHelperWindow.getHeaderHeight()*2 :SGHelperWindow.getHeaderHeight(),left:2*p}}>
                                            <WebViewButton onToggleFullScreen={this.onToggleFullScreen.bind(this)} webViewRef={this.webViewRenderRef}></WebViewButton>
                                        </View>
                                    </View>
                                    :(null)}

                                    {/* Other Order Menu */}
                                   { this.restoSettingsData ?
                                    this.restoSettingsData.fShownOrderMenu =='Y' && this.restoSettingsData.fOrderMenuType == 'other'  &&
                                    <View tabLabel={SGLocalize.translate("restoHomeScreen.tabOrderMenuTitle")} style={{width:w,flex:1,justifyContent:'flex-start'}}>
                                        <WebViewRender ref={this.webViewRenderRef} data={this.restoSettingsData.fOtherLink} style={style.throwWHP} fType='url' hideButton={true}></WebViewRender>
                                        <View style={{position:'absolute',bottom:Platform.OS == 'ios' ?SGHelperWindow.getHeaderHeight()*2 :SGHelperWindow.getHeaderHeight(),left:2*p}}>
                                            <WebViewButton webViewRef={this.webViewRenderRef}></WebViewButton>
                                        </View>
                                    </View>
                                    :(null)}
                            </TabView>
                            }

                            {/* PDF MODE */}
                            {this.restoSettingsData.fProductShownType === 'pdf' ?
                                <TabView accessible={true} accessibilityLabel={'RestoHomeScreenTabView'} ref='TV1' tabBarStyle={style.tabBarStyle} tabBarTextStyle={style.tabBarTextStyle} tabBarUnderlineStyle={style.tabBarUnderlineStyle} tabBarActiveTextColor={'#000000'} tabBarInactiveTextColor={'#6E6A6A'} tabBarActiveTextPreset={Text.preset.heading6B} tabBarInactiveTextPreset={Text.preset.heading6B} style={{ flex: 1 }} initialPage={0} scrollableTabBar renderTabBar={() => <DefaultTabBar />}>
                                    {this.restoSettingsData.fShowHighlightType == 'typeA' &&
                                     (this.restoPromoData.length >= 1 ||  this.restoPdfCategoryData.length >= 1 || this.restoAuctionData.length >= 1) &&
                                     <ScrollView accessible={true} accessibilityLabel={'RestoHomeScreenScrollMainView'} style={{ backgroundColor: 'transparent' }} tabLabel={SGLocalize.translate("restoHomeScreen.tabHighlightsTitle")} scrollEventThrottle={100} onScroll={this.baseOnScrollHandler.bind(this)} onMomentumScrollBegin={this.baseOnMomentumScrollBeginHandler.bind(this)} onScrollEndDrag={this.baseOnScrollEndDragHandler.bind(this)} onMomentumScrollEnd={this.baseOnMomentumScrollEndHandler.bind(this)} showsVerticalScrollIndicator={false}>
                                     
                                     {this.restoAuctionData.length !== 0 &&
                                            <AuctionSlider marginText oneLineSeeMore accessible={true} accessibilityLabel={'RestoHomeAuctionSlider'} language={this.Language} imageSetting={this.imageSetting} screen='AuctionDetail' seeMoreScreen='SeeMoreRestoAuction' seeMoreLabel={SGLocalize.translate("globalText.seeMoreText")}  contentKey={this.selectedRestoKey} navigator={this.props.navigation} data={this.restoAuctionData} titleHeading={SGLocalize.translate("restoHomeScreen.AuctionHeadingTitle")} title={SGLocalize.translate("restoHomeScreen.AuctionHeadingTitle")} style={style.throwWHP}></AuctionSlider>
                                     }

                                     {this.restoSettingsData.fProductShownPromoEvent === 'Y' && this.restoPromoData.length >= 1 ?
                                         (<RestoPromoSlider befSeeMoreScreen={'RestoHighlight'} oneLineSeeMore marginText borderBottom pdfMode={true} accessible={true} accessibilityLabel={'RestoHomeScreenPromoSlider'} blackTheme imageSetting={this.imageSetting} language={this.Language} contentKey={this.selectedRestoKey} seeMoreScreen='SeeMoreRestoPromo' seeMoreLabel={SGLocalize.translate("restoHomeScreen.SeeMore")} screen='RestoPromoDetail' navigator={this.props.navigation} data={this.restoPromoData} titleHeading={SGLocalize.translate("restoHomeScreen.restoPromoTitle")} style={style.throwWHP}></RestoPromoSlider>)
                                         :
                                         (null)
                                     }      
                                  
                                    {this.restoPdfCategoryData.length !== 0 ?
                                    <RestoMenuCategorySlider accessible={true} accessibilityLabel={'RestoHomeScreenMenuCategoryCard'} language={this.Language} imageSetting={this.imageSetting} showAuction={this.restoAuctionData.length !== 0 ? true:false} showTrending={this.restoSettingsData.fProductShownType === 'pdf' ? ('N') : (this.restoSettingsData.fProductShownTrending)} goToPage={this.goToPage.bind(this)} restoCategory={this.restoPdfCategoryData} navigator={this.props.navigation} title={SGLocalize.translate("restoHomeScreen.menuCategoryTitle")} style={style.throwWHP}></RestoMenuCategorySlider> 
                                     :
                                     (null)
                                    }
                                    </ScrollView>
                                    }

                                    {this.restoSettingsData.fShowHighlightType == 'typeB' &&
                                        this.restoProfileData.linkWebsite !== '' &&
                                        <View tabLabel={SGLocalize.translate("storeHomeScreen.tabHighlightsTitle")} style={{width:w,flex:1,justifyContent:'flex-start'}}>
                                            <WebViewRender ref={this.webViewRenderRef} data={this.restoProfileData.linkWebsite} style={style.throwWHP} fType='url' hideButton={true} highlightDisplay></WebViewRender>
                                            <View style={{position:'absolute',bottom:Platform.OS == 'ios' ?SGHelperWindow.getHeaderHeight()*2 :SGHelperWindow.getHeaderHeight(),left:2*p}}>
                                                <WebViewButton webViewRef={this.webViewRenderRef}></WebViewButton>
                                            </View>
                                        </View>
                                    }
                                    {this.restoSettingsData.fShowHighlightType == 'typeC' &&
                                        this.restoProfileData.linkInstagram !== '' && 
                                        <View tabLabel={SGLocalize.translate("storeHomeScreen.tabHighlightsTitle")} style={{width:w,flex:1,justifyContent:'flex-start'}}>
                                            <WebViewRender ref={this.webViewRenderRef} data={this.restoProfileData.linkInstagram} style={style.throwWHP} fType='url' hideButton={true} highlightDisplay></WebViewRender>
                                            <View style={{position:'absolute',bottom:Platform.OS == 'ios' ?SGHelperWindow.getHeaderHeight()*2 :SGHelperWindow.getHeaderHeight(),left:2*p}}>
                                                <WebViewButton webViewRef={this.webViewRenderRef}></WebViewButton>
                                            </View>
                                        </View>
                                    }
                                    {this.restoSettingsData.fShowHighlightType == 'typeD' &&
                                        this.restoProfileData.linkFacebook !== '' && 
                                        <View tabLabel={SGLocalize.translate("storeHomeScreen.tabHighlightsTitle")} style={{width:w,flex:1,justifyContent:'flex-start'}}>
                                            <WebViewRender ref={this.webViewRenderRef} data={this.restoProfileData.linkFacebook} style={style.throwWHP} fType='url' hideButton={true} highlightDisplay ></WebViewRender>
                                            <View style={{position:'absolute',bottom:Platform.OS == 'ios' ?SGHelperWindow.getHeaderHeight()*2 :SGHelperWindow.getHeaderHeight(),left:2*p}}>
                                                <WebViewButton webViewRef={this.webViewRenderRef}></WebViewButton>
                                            </View>
                                        </View>
                                    }
                                    {this.restoSettingsData.fShowHighlightType == 'typeE' &&
                                        <View tabLabel={SGLocalize.translate("storeHomeScreen.tabHighlightsTitle")} style={{width:w,height:h}}>
                                            <WebView style={{ flex: 1 }} source={{ html: '<h1>Youtube</h1><iframe width="100%" height="35%" src="'+this._renderEmbedYoutube(this.restoProfileData.linkYoutube)+'"'+'allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" frameborder="0" allowfullscreen></iframe>' }} />
                                        </View>
                                    }

                                    {this.restoSettingsData.fShowHighlightType !== 'typeA' &&
                                        (this.restoPromoData.length >= 1 ||  this.restoPdfCategoryData.length >= 1 || this.restoAuctionData.length >= 1) ?
                                        <ScrollView accessible={true} accessibilityLabel={'RestoHomeScreenScrollMainView'} style={{ backgroundColor: 'transparent' }} tabLabel={SGLocalize.translate("restoHomeScreen.PromoAndCatalog")} scrollEventThrottle={100} onScroll={this.baseOnScrollHandler.bind(this)} onMomentumScrollBegin={this.baseOnMomentumScrollBeginHandler.bind(this)} onScrollEndDrag={this.baseOnScrollEndDragHandler.bind(this)} onMomentumScrollEnd={this.baseOnMomentumScrollEndHandler.bind(this)} showsVerticalScrollIndicator={false}>
                                             {this.restoAuctionData.length !== 0 &&
                                                  <AuctionSlider marginText oneLineSeeMore accessible={true} accessibilityLabel={'RestoHomeAuctionSlider'} language={this.Language} imageSetting={this.imageSetting} screen='AuctionDetail' seeMoreScreen='SeeMoreRestoAuction' seeMoreLabel={SGLocalize.translate("globalText.seeMoreText")}  contentKey={this.selectedRestoKey} navigator={this.props.navigation} data={this.restoAuctionData} titleHeading={SGLocalize.translate("restoHomeScreen.AuctionHeadingTitle")} title={SGLocalize.translate("restoHomeScreen.AuctionHeadingTitle")} style={style.throwWHP}></AuctionSlider>
                                            }
                                            {this.restoSettingsData.fProductShownPromoEvent === 'Y' && this.restoPromoData.length >= 1 ?
                                                (<RestoPromoSlider befSeeMoreScreen={'RestoHighlight'} oneLineSeeMore marginText borderBottom pdfMode={true} accessible={true} accessibilityLabel={'RestoHomeScreenPromoSlider'} blackTheme imageSetting={this.imageSetting} language={this.Language} contentKey={this.selectedRestoKey} seeMoreScreen='SeeMoreRestoPromo' seeMoreLabel={SGLocalize.translate("restoHomeScreen.SeeMore")} screen='RestoPromoDetail' navigator={this.props.navigation} data={this.restoPromoData} titleHeading={SGLocalize.translate("restoHomeScreen.restoPromoTitle")} style={style.throwWHP}></RestoPromoSlider>)
                                                :
                                                (null)
                                            }      
                                        
                                            {this.restoPdfCategoryData.length !== 0 ?
                                            <RestoMenuCategorySlider accessible={true} accessibilityLabel={'RestoHomeScreenMenuCategoryCard'} language={this.Language} imageSetting={this.imageSetting} showTrending={this.restoSettingsData.fProductShownType === 'pdf' ? ('N') : (this.restoSettingsData.fProductShownTrending)} goToPage={this.goToPage.bind(this)} restoCategory={this.restoPdfCategoryData} navigator={this.props.navigation} title={SGLocalize.translate("restoHomeScreen.menuCategoryTitle")} style={style.throwWHP} doubleNav></RestoMenuCategorySlider> 
                                            :
                                            (null)
                                            }
                                            </ScrollView>
                                        :
                                        this.restoSettingsData.fShowHighlightType !== 'typeA' &&
                                        <ScrollView dummyFooterBar dummyBottomBar accessible={true} accessibilityLabel={'RestoHomeScreenScrollMainView'} contentContainerStyle={{justifyContent:'center', alignItems:'center'}} tabLabel={SGLocalize.translate("restoHomeScreen.PromoAndCatalog")} scrollEventThrottle={100} onScroll={this.baseOnScrollHandler.bind(this)} onMomentumScrollBegin={this.baseOnMomentumScrollBeginHandler.bind(this)} onScrollEndDrag={this.baseOnScrollEndDragHandler.bind(this)} onMomentumScrollEnd={this.baseOnMomentumScrollEndHandler.bind(this)} showsVerticalScrollIndicator={false}>
                                            <Text preset= {Text.preset.titleH2} style={style.textEmpty}>{SGLocalize.translate("restoHomeScreen.emptyHighlightsText")}</Text>
                                        </ScrollView>
                                    }

                                    {this.restoProductPdfDataList.length !== 0 &&
                                    <ScrollView accessible={true} accessibilityLabel={'RestoHomeScreenScrollCategoryView'} style={{ backgroundColor: 'transparent' }} tabLabel={SGLocalize.translate("restoHomeScreen.tabMenuListTitle")} scrollEventThrottle={100} onScroll={this.baseOnScrollHandler.bind(this)} onMomentumScrollBegin={this.baseOnMomentumScrollBeginHandler.bind(this)} onScrollEndDrag={this.baseOnScrollEndDragHandler.bind(this)} onMomentumScrollEnd={this.baseOnMomentumScrollEndHandler.bind(this)} showsVerticalScrollIndicator={false}>
                                        {this.restoSettingsData && this.restoSettingsData.fProductShownType === 'pdf' ?
                                            (
                                                this.restoProductPdfDataList.map((x, index) => {
                                                    return (
                                                        <RestoMenuSlider pdfMode={true} accessible={true} accessibilityLabel={'RestoHomeScreenSliderCategory'} imageSetting={this.imageSetting} language={this.Language} selectedRestoKey={this.selectedRestoKey} categoryKey={x.categoryKey} restoMenuData={x.fProduct} currency={this.currency} seeMoreLabel={SGLocalize.translate("restoHomeScreen.SeeMore")} navigator={this.props.navigation} title={x['fCategoryName' + this.Language.toUpperCase()]} style={style.throwWHP}></RestoMenuSlider>
                                                    )
                                                })
                                            )
                                            :
                                            (null)
                                        }
                                      
                                    </ScrollView>
                                    }

                                    { this.restoSettingsData ?
                                     (this.restoSettingsData.fShownReservation == 'Y' || this.restoSettingsData.fShownWaitingList =='Y') &&
                                    <ScrollView dummyFooterBar dummyBottomBar accessible={true} accessibilityLabel={'RestoHomeScreenScrollReservationView'} style={{ backgroundColor: 'white', flex: 1, }} contentContainerStyle={{ justifyContent: 'flex-start' }} tabLabel={SGLocalize.translate("restoHomeScreen.tabRestoBookingTitle")} showsVerticalScrollIndicator={false} >
                                        <TouchableOpacity accessible={true} accessibilityLabel={'RestoHomeScreenWLView'} onPress={() => this._onWaitingListButtonPress()} disabled={this.restoSettingsData.fShownWaitingList == 'N' ? true :false}>
                                            <View style={style.vRestoBooking}>
                                                <Text accessible={true} accessibilityLabel={'RestoHomeScreenWLText1'} preset={Text.preset.titleH3B} style={style.restoBookingText1}>{SGLocalize.translate('restoHomeScreen.waitingListText1')}</Text>
                                                <Text accessible={true} accessibilityLabel={'RestoHomeScreenWLText2'} preset={Text.preset.titleH4} style={style.restoBookingText2}>{SGLocalize.translate('restoHomeScreen.waitingListText2')}</Text>
                                                {this.restoSettingsData.fShownWaitingList == 'N' &&
                                                <Text preset={Text.preset.titleH4_5B} style={style.notAvailable}>{SGLocalize.translate('restoHomeScreen.notAvailableText')}</Text>
                                                }
                                            </View>
                                        </TouchableOpacity>
                                        <TouchableOpacity accessible={true} accessibilityLabel={'RestoHomeScreenResvView'} shadow onPress={() => this._onReservationButtonPress()}  disabled={this.restoSettingsData.fShownReservation == 'N' ? true :false}>
                                            <View style={style.vRestoBooking}>
                                                <Text accessible={true} accessibilityLabel={'RestoHomeScreenResvText1'} preset={Text.preset.titleH3B} style={style.restoBookingText1}>{SGLocalize.translate('restoHomeScreen.reservationText1')}</Text>
                                                <Text accessible={true} accessibilityLabel={'RestoHomeScreenResvText2'} preset={Text.preset.titleH4} style={style.restoBookingText2}>{SGLocalize.translate('restoHomeScreen.reservationText2')}</Text>
                                                {this.restoSettingsData.fShownReservation == 'N' &&
                                                <Text preset={Text.preset.titleH4_5B} style={style.notAvailable}>{SGLocalize.translate('restoHomeScreen.notAvailableText')}</Text>
                                                }
                                            </View>
                                        </TouchableOpacity>
                                    </ScrollView>
                                    :(null)}
                                </TabView>
                                :
                                (null)
                            }
                            <View style={{width:w,height:Platform.OS =='ios' ?w*0.12:w*0.1,backgroundColor: 'transparent'}}></View>
                        </View>)
                        :
                        (null)
                    :
                    <ActivityIndicator preset={ActivityIndicator.preset.h1} style={{ flex: 1 }}></ActivityIndicator>
                }
                {
                    !this.showFullScreen &&
                    <Animated.View style={{ position: 'absolute', transform: [{ translateY: this._baseAnimY.interpolate({ inputRange: [-1, 0], outputRange: [(SGHelperWindow.getStatusBarHeight() ), SGHelperWindow.getStatusBarHeight()] }) },], height: SGHelperWindow.getHeaderHeight(), width: '100%' }}>
                        <SimpleSearchBar luxury={luxury} pushScreen accessible={true} accessibilityLabel={'RestoHomeScreenSimpleSearchBar'} imageSetting={this.imageSetting} language={this.Language} restoKey={this.selectedRestoKey} placeholder={SGLocalize.translate("restoHomeScreen.searchPlaceholder")} navigator={this.props.navigation}  style={this.style.throwWHP} ></SimpleSearchBar>
                    </Animated.View>
                }
                {
                    !this.showFullScreen &&
                    <Animated.View style={{ position: 'absolute', transform: [{ translateY: this._baseAnimY.interpolate({ inputRange: [-1, 0], outputRange: [SGHelperWindow.getWHPNoHeader().h + 8 * p, SGHelperWindow.getWHPNoHeader().h - Math.max(SGHelperWindow.getFooterHeight(), 2 * p) - SGHelperWindow.getHeaderHeight()] }) },], height: Math.max(SGHelperWindow.getFooterHeight(), 2 * p) + SGHelperWindow.getHeaderHeight(), width: '100%' }}>
                        <BottomNavigationContainer accessible={true} accessibilityLabel={'StoreHomeScreenBottomNav'} navigator={this.props.navigation} style={style.throwWHP}></BottomNavigationContainer>
                    </Animated.View>
                }
            </RootView>
        );
    }
}