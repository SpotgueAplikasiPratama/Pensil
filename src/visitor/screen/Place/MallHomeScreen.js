/**
 * Version 1.2.0
 * 1. Yohanes 05 April 2021
 * - add ErrorHandling
 
 * 2. Leon, 4 May 2021
 - Fix Like, Fix Favorite, Fix Notification
   Change log by Melvin 1 Maret 2021 - Catching All API to Global Var and Make Render API depends on SystemParams Value In Second
*/
import React from 'react';
import { StyleSheet, Linking, Animated, AppState } from 'react-native';
import { SGText as Text, SGView as View, SGTouchableOpacity as TouchableOpacity, SGRootView as RootView, SGTabView as TabView, SGScrollView as ScrollView, SGPopView, SGIcon as Icon, SGButton as Button, SGImage as Image, SGActivityIndicator as ActivityIndicator, SGDialogBox, SGActivityIndicator } from '../../../core/control';
import { SGBaseScreen } from '../../../core/screen/SGBaseScreen';
import { BottomNavigationContainer } from '../../component_V2/BottomNavigationContainer';
import { SimpleSearchBar } from '../../component_V2/SimpleSearchBar';
import { MallHomeHeader } from '../../container_V2/MallHomeHeader';
import { MallHomeNewHeader } from '../../container_V2/MallHomeNewHeader';
import { MallHomeNewHeaderLuxury } from '../../container_V2/MallHomeNewHeaderLuxury';
import { MallHomeNewHeaderLuxury2 } from '../../container_V2/MallHomeNewHeaderLuxury2';
import { TabHighlightsMall } from '../../container_V2/TabHighlightsMall';
import { TabFacilityList } from '../../container_V2/TabFacilityList';
import { TabStoreList } from '../../container_V2/TabStoreList';
import { TabRestoList } from '../../container_V2/TabRestoList';
import { SGLocalize } from '../../locales/SGLocalize';
import { SGHelperErrorHandling, SGHelperGlobalVar, SGHelperNavigation, SGHelperWindow } from '../../../core/helper';
import { SGHelperType } from '../../../core/helper';
import { VRewardAPI } from '../../api/VRewardAPI';
import { VMallHomeAPI } from '../../api/VMallHomeAPI';
import tbVHomeMallAPI from '../../../plugin/plugin1/api/tbVHomeMallAPI';
import { VMallProfileAPI } from '../../api/VMallProfileAPI';
import { tbVUserCheckInAPI } from '../../api/tbVUserCheckInAPI';
import { tbVUserViewAPI } from '../../api/tbVUserViewAPI';
import { EmptyDetailView } from '../../container_V2/EmptyDetailView';
import { VSpyAPI } from '../../api/VSpyAPI';
import { VisitorHelper } from '../../helper/VisitorHelper';

export class MallHomeHelper {
    static InitGlobalVar() {
        //globalVar Optimize
        if (!SGHelperGlobalVar.isVar('renderPlace')) { SGHelperGlobalVar.addVar('renderPlace', []); }
        if (!SGHelperGlobalVar.isVar('datePullPlaceBatch1')) { SGHelperGlobalVar.addVar('datePullPlaceBatch1', []); }
        if (!SGHelperGlobalVar.isVar('currentBuildingContent')) { SGHelperGlobalVar.addVar('currentBuildingContent', []); }
        if (!SGHelperGlobalVar.isVar('isAlreadyCheckInPlace')) { SGHelperGlobalVar.addVar('isAlreadyCheckInPlace', []); }
        if (!SGHelperGlobalVar.isVar('mallHeaderDataPlace')) { SGHelperGlobalVar.addVar('mallHeaderDataPlace', []); }
        if (!SGHelperGlobalVar.isVar('parkingHighlightDataPlace')) { SGHelperGlobalVar.addVar('parkingHighlightDataPlace', []); }
        if (!SGHelperGlobalVar.isVar('parkingListDataPlace')) { SGHelperGlobalVar.addVar('parkingListDataPlace', []); }
        if (!SGHelperGlobalVar.isVar('placeEventDataPlace')) { SGHelperGlobalVar.addVar('placeEventDataPlace', []); }
        if (!SGHelperGlobalVar.isVar('loyaltyDataPlace')) { SGHelperGlobalVar.addVar('loyaltyDataPlace', []); }
        if (!SGHelperGlobalVar.isVar('auctionDataPlace')) { SGHelperGlobalVar.addVar('auctionDataPlace', []); }
        if (!SGHelperGlobalVar.isVar('storePromoDataPlace')) { SGHelperGlobalVar.addVar('storePromoDataPlace', []); }
        if (!SGHelperGlobalVar.isVar('restoPromoDataPlace')) { SGHelperGlobalVar.addVar('restoPromoDataPlace', []); }
        if (!SGHelperGlobalVar.isVar('mostLikedStoreDataPlace')) { SGHelperGlobalVar.addVar('mostLikedStoreDataPlace', []); }
        if (!SGHelperGlobalVar.isVar('mostLikedRestoDataPlace')) { SGHelperGlobalVar.addVar('mostLikedRestoDataPlace', []); }
        if (!SGHelperGlobalVar.isVar('linkDataPlace')) { SGHelperGlobalVar.addVar('linkDataPlace', []); }
        if (!SGHelperGlobalVar.isVar('storeListDataPlace')) { SGHelperGlobalVar.addVar('storeListDataPlace', []); }
        if (!SGHelperGlobalVar.isVar('restoListDataPlace')) { SGHelperGlobalVar.addVar('restoListDataPlace', []); }
        if (!SGHelperGlobalVar.isVar('facilityListDataPlace')) { SGHelperGlobalVar.addVar('facilityListDataPlace', []); }
        if (!SGHelperGlobalVar.isVar('storeCategoryDataPlace')) { SGHelperGlobalVar.addVar('storeCategoryDataPlace', []); }
        if (!SGHelperGlobalVar.isVar('mallFloorDataPlace')) { SGHelperGlobalVar.addVar('mallFloorDataPlace', []); }
        if (!SGHelperGlobalVar.isVar('restoCategoryDataPlace')) { SGHelperGlobalVar.addVar('restoCategoryDataPlace', []); }
        if (!SGHelperGlobalVar.isVar('restoCuisineDataPlace')) { SGHelperGlobalVar.addVar('restoCuisineDataPlace', []); }
        if (!SGHelperGlobalVar.isVar('facilityCategoryDataPlace')) { SGHelperGlobalVar.addVar('facilityCategoryDataPlace', []); }
        if (!SGHelperGlobalVar.isVar('salesPromoDataPlace')) { SGHelperGlobalVar.addVar('salesPromoDataPlace', []); }
        if (!SGHelperGlobalVar.isVar('hashTagPromoDataPlace')) { SGHelperGlobalVar.addVar('hashTagPromoDataPlace', []); }
        if (!SGHelperGlobalVar.isVar('restoStoreFacilityLoaded')) { SGHelperGlobalVar.addVar('restoStoreFacilityLoaded', []); }
    }

    static AddUpdateGlobalVar(vKey, vName, vData, vLastUpdate) {
        // console.log('_addUpdateGlobalVar:'+vName);
        var _tempVarData = SGHelperGlobalVar.getVar(vName);
        var _isExist = false;
        for (var i = 0; i < _tempVarData.length; i++) {
            if (_tempVarData[i].key === vKey) { _isExist = true; break; }
        }
        if (_isExist) {
            _tempVarData[i].data = vData;
            _tempVarData[i].lastUpdate = vLastUpdate;
        } else {
            _tempVarData.push({ key: vKey, data: vData, lastUpdate: vLastUpdate });
        }
        SGHelperGlobalVar.setVar(vName, _tempVarData);
    }

    static ReplaceGlobalVarData(VarName, data, placeKey) {
        var globalVar = SGHelperGlobalVar.getVar(VarName);
        for (var i = 0; i < globalVar.length; i++) {
            if (globalVar[i].key === placeKey) {
                globalVar[i].data = data;
                return;
            }
        }
    }

    static AddUpdateDatePullBatch(vKey, vName) {
        var tempDatePull = SGHelperGlobalVar.getVar(vName)
        if (tempDatePull.length === 0) {
            tempDatePull.push({ key: vKey, data: new Date() });
            SGHelperGlobalVar.setVar(vName, tempDatePull)
        } else {
            var isExist = false;
            for (var i = 0; i < tempDatePull.length; i++) {
                if (tempDatePull[i].key === vKey) {
                    isExist = true;
                    break;
                }
            }
            if (!isExist) {
                tempDatePull.push({ key: vKey, data: new Date() });
                SGHelperGlobalVar.setVar(vName, tempDatePull)
            } else {
                MallHomeHelper.ReplaceGlobalVarData(vName, new Date(), vKey);
            }
        }
    }

    static ConstructDataStoreForEachCategory(storeListData, storeCategoryData, lang) {
        var arrOfCategoryList = [];
        for (var i = 0; i < storeCategoryData.length; i++) {
            var arrOfStoreList = [];
            for (var j = 0; j < storeListData.length; j++) {
                if (storeCategoryData[i].key === storeListData[j].storeCategoryKey) {
                    arrOfStoreList.push(storeListData[j])
                }
            }
            if(arrOfStoreList.length>0){
                arrOfStoreList = VisitorHelper._naturalSort(arrOfStoreList, 'desc', 'fStoreName' + lang)
                arrOfCategoryList.push(arrOfStoreList);    
            }
        }
        return arrOfCategoryList;
    }

    static ConstructDataRestoForEachCategory(restoListData, restoCategoryData, lang) {
        var arrOfCategoryList = [];
        for (var i = 0; i < restoCategoryData.length; i++) {
            var arrOfRestoList = [];
            for (var j = 0; j < restoListData.length; j++) {
                if (restoCategoryData[i].key === restoListData[j].restoCategoryKey) {
                    arrOfRestoList.push(restoListData[j])
                }
            }
            if(arrOfRestoList.length>0){
                arrOfRestoList = VisitorHelper._naturalSort(arrOfRestoList, 'desc', 'fRestoName' + lang)
                arrOfCategoryList.push(arrOfRestoList);    
            }
        }
        return arrOfCategoryList;
    }

    static ConstructDataFacilityList(categoryList, dataFacility, lang) {
        var arrOfCategoryList = [];
        for (var i = 0; i < categoryList.length; i++) {
            var arrOfFacilityList = [];
            for (var j = 0; j < dataFacility.length; j++) {
                if (categoryList[i].key === dataFacility[j].facilityCategoryKey) {
                    arrOfFacilityList.push(dataFacility[j]);
                }
            }
            if(arrOfFacilityList.length>0){
                arrOfFacilityList = VisitorHelper._naturalSort(arrOfFacilityList, 'desc', 'fFacilityName' + lang)
                arrOfCategoryList.push(arrOfFacilityList);    
            }
        }
        return arrOfCategoryList;
    }

    static GetGlobalVarByPlaceKey(varName, vKey) {
        var VarName = SGHelperGlobalVar.getVar(varName);
        for (var i = 0; i < VarName.length; i++) {
            if (VarName[i].key === vKey) {
                return VarName[i].data;
            }
        }
        return null;
    }

    static GetGlobalVarDateByPlaceKey(varName, vKey) {
        var VarName = SGHelperGlobalVar.getVar(varName);
        for (var i = 0; i < VarName.length; i++) {
            if (VarName[i].key === vKey) {
                return VarName[i].lastUpdate;
            }
        }
    }

    static CheckExpiredCacheDate(lastRefresh,lastUpdate){
        if (lastUpdate !== null) {
            if ( lastRefresh < lastUpdate) {
                return true;
            }
        }
        return false;
    }
}

export class MallHomeScreen extends SGBaseScreen {

    createStyleSheet = (whp) => {
        var { w, h, p } = whp;

        return StyleSheet.create({
            mainContainer: { width: w, height: h, backgroundColor: '#FFFFFF', justifyContent: 'flex-start' },
            // mainView1: { width: w, height: h, backgroundColor: 'white', justifyContent: 'flex-start', },
            throwWHP: { width: w, height: h, padding: p },
            tabBarStyle: {backgroundColor:'rgba(255,255,255,0)', borderColor: '#C5C4BC', borderTopWidth: 0.0015 * w, borderBottomWidth: 0.0015 * w, width: w },
            tabBarUnderlineStyle: { backgroundColor: '#1E1E1E' },
            //style popup reward
            rewardPV: { width: w - 12 * p, padding: p, borderRadius: 2 * p, backgroundColor: 'white', justifyContent: 'flex-start' },
            headerPV: { width: w - 22 * p, paddingVertical: 2 * p },
            textPV1: { color: '#484848' },
            textPV2: { color: '#858585' },
            textPV3: { color: '#484848', marginVertical: p, alignItems: 'flex-start' },
            textPV4: { color: '#484848', alignSelf: 'flex-start', marginVertical: p, paddingLeft: 4 * p },
            imagePV: { width: w * 0.667, height: w * 0.375, padding: p, marginVertical: 2 * p },
            buttonPV: { backgroundColor: '#01BBA0', width: w * 0.38, height: w * 0.1, borderRadius: p, alignItems: 'center', justifyContent: 'center' },
            buttonViewPV: { flexDirection: 'row', justifyContent: 'space-around', width: w - 22 * p, marginVertical: 2 * p },
        });
    }

    _initUserSettingData(){
        this.currentUser = SGHelperGlobalVar.getVar('GlobalCurrentUser');
        this.currentUserData = SGHelperGlobalVar.getVar('GlobalCurrentUserData');
        this.imageSetting = SGHelperGlobalVar.getVar('GlobalImageSetting');
        this.currentUserImage = SGHelperGlobalVar.getVar('GlobalCurrentUserImage');
    }

    constructor(props, context, ...args) {
        super(props, context, ...args);
        this.style = this.createStyleSheet(this.WHP);
        this.pvID = SGPopView.getPopViewID();
        this._initUserSettingData();
        this.alreadyView = false;
        this.alreadyMount = false;
        this.storeRestoFacilityAlreadyMount = false;
        this.alreadyMountRefreshAllTime = false;
        // console.log('mall home--')
        // console.log(this.props.route.params.contentKey);
        this.selectedPlaceKey = this.props.route.params.contentKey;
        this.anonymousMode = SGHelperGlobalVar.getVar('GlobalAnonymous')
        this.parkingTypeData = [];
        this.surpriseReward = { fID: null, fRewardID: { fTargetName: '', fShortDescription: '', fImageJSON: [] }, fRewardEN: { fTargetName: '', fShortDescription: '', fImageJSON: [] }, fRewardCN: { fTargetName: '', fShortDescription: '', fImageJSON: [] } }
        this.animFlag = false;
        this.selectedPlaceContent = ''
        
        this.props.navigation.setOptions({
            headerShown: false,
        });

        this.state = { appState: AppState.currentState };
        this.parkingLastUpdateTime = { data: new Date() }

        MallHomeHelper.InitGlobalVar();
        this.renderPlace = SGHelperGlobalVar.getVar('renderPlace');

        this.dateGlobalVariabel = {
            dateBuildingData: new Date(),
            dateStoreRestoData: new Date(),
            dateFacilityData: new Date(),
            dateEventTenantData: new Date(),
            dateFloorData: new Date(),
            dateEventBuildingData: new Date(),
            dateSettingBuildingData : new Date()
        }
        this.MallHighlightRef = React.createRef();
        this.MallHeaderRef = React.createRef();
        this.FacilityListRef = React.createRef();
        this.StoreListRef = React.createRef();
        this.RestoListRef = React.createRef();

        this._tabIndex = 0;

        this.appStateChange = null;
        this.linkingListener = null;
        this._unsubscribeFocus = null;
        this._unsubscribeBlur = null;
        this.parkingInterval = -1;
        this.spyInterval = -1;
        this.parkingHighlightData = { data: [] }
        this.parkingListData = { data: [] }
        this.mallHeaderData = { data: null };
        this.placeEventData = { data: [] };
        this.loyaltyData = { data: [] };
        this.auctionData = { data: [] };
        this.storePromoData = { data: [] };
        this.restoPromoData = { data: [] };
        this.mostLikedStoreData = { data: [] };
        this.mostLikedRestoData = { data: [] };    
        this.linkData = { data: [] };
        this.storeListData = { data: [] };
        this.restoListData = { data: [] };
        this.facilityListData = { data: [] };
        this.storeCategoryData = { data: [] };
        this.restoCategoryData = { data: [] };
        this.mallFloorData = { data: [] };
        this.restoCuisineData = { data: [] };
        this.facilityCategoryData = { data: [] };
        this.salesDiscountData = { data: [] };
        this.hashTagData = { data: [] };
        this.isAlreadyCheckIn = '';
        this._baseAnimVar = new Animated.Value(1);
        this.luxuryMode = false;
    }

    _handleAppStateChange = (nextAppState) => {
        if (this.state.appState.match(/inactive|background/) && nextAppState === 'active') {
            // console.log('App has come to the foreground!');
        }
        this.setState({ appState: nextAppState });
    };

    componentWillUnmount() {
        if (this.appStateChange) { this.appStateChange.remove(); }
        //if (this.linkingListener) { this.linkingListener.remove(); }
        if (this.parkingInterval !== -1) { clearInterval(this.parkingInterval) };
        if (this.spyInterval !== -1) { clearInterval(this.spyInterval) };
        if (this._unsubscribeFocus !== null) { this._unsubscribeFocus(); }
        if (this._unsubscribeBlur !== null) { this._unsubscribeBlur(); }
    }

    _initIntervalParking() {
        // console.log('interval parking ..')
        if (this.parkingInterval === -1) {
            this.parkingInterval = setInterval((async () => {
                // console.log('interval parking ..')
                if (this.state.appState === "active") {
                    // console.log('active interval 1')
                    this._getDataParking();
                }
            }).bind(this), SGHelperType.getSysParamsValueToInt('HomeScreenVisitorInterval'));
        }
    }

    _initIntervalSpy() {
        // console.log('interval spy ..')
        if (this.spyInterval === -1) {
            this.spyInterval = setInterval(async () => {
                // console.log('interval spy ..')
                if (this.state.appState === "active") {
                    // console.log('active interval 2')
                    this._checkSpyAPI();
                }
            }, SGHelperType.getSysParamsValueToInt('IntervalSpyHomePlace'));
        }
    }

    async componentDidMount() {
        await this._checkingRenderPlace(false);
        // console.log(SGHelperNavigation.getRoutes(this.props.navigation))
        //this.linkingListener = Linking.addEventListener('url', this.handleOpenURL);
        if (this.appStateChange === null) { this.appStateChange = AppState.addEventListener('change', this._handleAppStateChange); }
        this._initIntervalParking();
        this._initIntervalSpy();
        // console.log('run out focus')
        this._unsubscribeFocus = this.props.navigation.addListener('focus', async () => {
            // console.log('run focus')
            await this._checkingRenderPlace(true);
            this._initIntervalParking();
            this._initIntervalSpy();
            this.forceUpdate();
        });
        this._unsubscribeBlur = this.props.navigation.addListener('blur', async () => {
            if (this.parkingInterval !== -1) { 
                clearInterval(this.parkingInterval);
                this.parkingInterval = -1;
            };
            if (this.spyInterval !== -1) { 
                clearInterval(this.spyInterval) 
                this.spyInterval = -1;
            };
        });
    }

    async _checkingRenderPlace(flagOnFocus) {
        if (this.renderPlace.length === 0) {
            // console.log('refresh all ')
            await this._onRefreshAllItem(flagOnFocus);
        } else {
            var pullingNewData = true;
            for (var i = 0; i < this.renderPlace.length; i++) {
                if (this.renderPlace[i].key === this.selectedPlaceKey) {
                    pullingNewData = false;
                    break;
                }
            }
            if (pullingNewData) {
                // console.log(' 1 refresh all ')
                await this._onRefreshAllItem(flagOnFocus);
            } else {
                // console.log(' 2 pull data batch ')
                await this._pullDataBatchCache(flagOnFocus);
            }
        }
    }

    async _pullDataBatchCache(flagOnFocus) {
        var dateNow = new Date()
        var datePullPlaceBatch1 = new Date(MallHomeHelper.GetGlobalVarByPlaceKey('datePullPlaceBatch1', this.selectedPlaceKey));
        var dateTimePullPlaceBatch1 = new Date(datePullPlaceBatch1.getFullYear(), datePullPlaceBatch1.getMonth(), datePullPlaceBatch1.getDate(), datePullPlaceBatch1.getHours(), datePullPlaceBatch1.getMinutes(), datePullPlaceBatch1.getSeconds() + SGHelperType.getSysParamsValueToInt('PlaceScreenPullDataBatch1'));

        if(!flagOnFocus){
            this._loadCache();
        }
        if (dateNow > dateTimePullPlaceBatch1) {
            this._checkSpyAPI();
            this._getDataParking();
        } 
        tbVUserCheckInAPI.CheckUserCheckInHere(this.selectedPlaceKey).then((v)=>{
            this.isAlreadyCheckIn = v;
            this.forceUpdate();   
        });
    }

    async _checkUserView() {
        if (!this.alreadyView) {
            var jsonInput = { fID: '', fContentType: 'Place', fContentKey: this.selectedPlaceKey, fTargetKey: this.selectedPlaceKey, fUserKey: '', fActive: 'Y', fCreatedBy: '', fCreatedDate: new Date(), fLastModifiedBy: '', fLastModifiedDate: new Date() }
            try {
                await tbVUserViewAPI.addUserView(jsonInput);
                this.alreadyView = true;
            } catch (error) {
                SGHelperErrorHandling.Handling(error, this._checkUserView.bind(this))
            }
        }
    }

    _addAPIParallelCheckUserCheckInHere(callerObj =null){
        this.baseAddAPIParallel('CheckUserCheckInHere', (async (v1) => { return tbVUserCheckInAPI.CheckUserCheckInHere(v1) }).bind(this, this.selectedPlaceKey), ((v) => {
            this.isAlreadyCheckIn = v;
            // MallHomeHelper.AddUpdateGlobalVar(this.selectedPlaceKey, 'isAlreadyCheckInPlace', this.isAlreadyCheckIn, new Date());
        }).bind(this), null, callerObj);
    }

    _addAPIParallelGetBuildingContent(callerObj = null){
        this.baseAddAPIParallel('getBuildingContent', (async (v1) => { return VMallHomeAPI.getBuildingContent(v1) }).bind(this, this.selectedPlaceKey), ((v) => {
            this.selectedPlaceContent = v;
            MallHomeHelper.AddUpdateGlobalVar(this.selectedPlaceKey, 'currentBuildingContent', this.selectedPlaceContent, new Date());
            SGHelperGlobalVar.setVar('GlobalLastSelectedPlace', { key: this.selectedPlaceKey, placeNameID: this.selectedPlaceContent.fContentID.fBuildingName, placeNameEN: this.selectedPlaceContent.fContentEN.fBuildingName, placeNameCN: this.selectedPlaceContent.fContentCN.fBuildingName });
            this.mallSummaryData = this.selectedPlaceContent['fContent' + this.Language.toUpperCase()].fImageSlider;
            this.instagramSpotData = this.selectedPlaceContent['fContent' + this.Language.toUpperCase()].fInstagramSpot;
            this.uniqueExperienceData = this.selectedPlaceContent['fContent' + this.Language.toUpperCase()].fUniqueExperience;
            // try{
            //     if (SGHelperType.isDefined(this.MallHighlightRef.current)) {
            //         this.MallHighlightRef.current.refreshHighlightSummary();
            //         this.MallHighlightRef.current.refreshInstagramSpot();
            //         this.MallHighlightRef.current.refreshUniqueExperience();
            //     }    
            // } catch(e){}
        }).bind(this), null, callerObj);
    }


    _addAPIParallelGetSalesPromo(callerObj =null){
        this.baseAddAPIParallel('getSalesPromo', (async (v1) => { return VMallHomeAPI.SearchBuildingHighlightSaleDiscount(v1) }).bind(this, this.selectedPlaceKey), ((v) => {
            // console.log('runnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnn----------')
            this.salesDiscountData.data = v;
            MallHomeHelper.AddUpdateGlobalVar(this.selectedPlaceKey, 'salesPromoDataPlace', this.salesDiscountData, new Date());
        }).bind(this), null,callerObj);
    }

    getPagingData(){
        var itemPerPage = SGHelperType.getPaging()
        return {paging:false,offset:this.pagingCounter, totalPerPage:itemPerPage}
    }

    _addAPIParallelHashTagPromo(callerObj =null){
        this.paging = this.getPagingData()
        this.baseAddAPIParallel('getHashTagPromo', (async (v1,v2,v3,v4,v5) => { return VMallHomeAPI.SearchBuildingHighlightSaleHashtag(v1,v2,v3,v4,v5) }).bind(this, this.selectedPlaceKey,this._language,[],[],this.paging), ((v) => {
            this.hashTagData.data = v;
            // console.log('hashTagData')
            // console.log(this.hashTagData);
            MallHomeHelper.AddUpdateGlobalVar(this.selectedPlaceKey, 'hashTagPromoDataPlace', this.hashTagData, new Date());
        }).bind(this), null,callerObj);
    }

    _addAPIParallelGetBuildingHomeHeader(callerObj =null){
        this.baseAddAPIParallel('getBuildingHomeHeader', (async (v1) => { return VMallHomeAPI.getBuildingHomeHeader(v1) }).bind(this, this.selectedPlaceKey), ((v) => {
            // console.log('getBuildingHomeHeader')
            this.mallHeaderData.data = v;
            if(this.mallHeaderData.data.fLuxuryMode == 'Y') this.luxuryMode = true;
            else this.luxuryMode = false;
            // console.log(this.mallHeaderData);
            MallHomeHelper.AddUpdateGlobalVar(this.selectedPlaceKey, 'mallHeaderDataPlace', this.mallHeaderData, new Date());
            // try{
            //     if (SGHelperType.isDefined(this.MallHeaderRef.current)) {
            //         this.MallHeaderRef.current.refreshMallHeader();
            //     }    
            // } catch(e){}
        }).bind(this), null,callerObj);
    }

    _addAPIParallelGetBuildingHomeProfile(callerObj =null){
        this.baseAddAPIParallel('getBuildingHomeProfile', (async (v1) => { return VMallProfileAPI.getBuildingHomeProfile(v1) }).bind(this, this.selectedPlaceKey), ((v) => {
            // console.log('getBuildingHomeProfile')
            this.linkData.data = v;
            MallHomeHelper.AddUpdateGlobalVar(this.selectedPlaceKey, 'linkDataPlace', this.linkData, new Date());
            // try{
            //     if (SGHelperType.isDefined(this.MallHeaderRef.current)) {
            //         this.MallHeaderRef.current.refreshMallHeader();
            //     }    
            // } catch(e){}
        }).bind(this), null,callerObj);
    }

    _addAPIParallelGetBuildingParkingHighlightData(callerObj =null){
        this.baseAddAPIParallel('getBuildingParkingHighlightData', (async (v1) => { return VMallHomeAPI.getBuildingParkingHighlightData(v1) }).bind(this, this.selectedPlaceKey), ((v) => {
            // console.log('getBuildingParkingHighlightData')
            this.parkingHighlightData.data = v;
            MallHomeHelper.AddUpdateGlobalVar(this.selectedPlaceKey, 'parkingHighlightDataPlace', this.parkingHighlightData, new Date());
            // try{
            //     if (SGHelperType.isDefined(this.MallHighlightRef.current)) {
            //         this.MallHighlightRef.current.refreshParkingHighlight();
            //     }
            // }catch(e){}
        }).bind(this), null, callerObj);
    }

    _addAPIParallelGetParkingListData(callerObj =null){
        this.baseAddAPIParallel('getParkingListData', (async (v1) => { return VMallHomeAPI.getParkingListData(v1) }).bind(this, this.selectedPlaceKey), ((v) => {
            // console.log('getParkingListData')
            this.parkingListData.data = v;
            MallHomeHelper.AddUpdateGlobalVar(this.selectedPlaceKey, 'parkingListDataPlace', this.parkingListData, new Date());
            // try{
            //     if (SGHelperType.isDefined(this.FacilityListRef.current)) {
            //         this.FacilityListRef.current.refreshParkingListData();
            //     }
            // }catch(e){}
        }).bind(this), null,callerObj);
    }
 
    _addAPIParallelGetBuildingEventSlider(callerObj =null){
        this.baseAddAPIParallel('getBuildingEventSlider', (async (v1) => { return VMallHomeAPI.getBuildingEventSlider(v1) }).bind(this, this.selectedPlaceKey), ((v) => {
            // console.log('getBuildingEventSlider')
            this.placeEventData.data = v;
            MallHomeHelper.AddUpdateGlobalVar(this.selectedPlaceKey, 'placeEventDataPlace', this.placeEventData, new Date());
            // try{
            //     if (SGHelperType.isDefined(this.MallHighlightRef.current)) {
            //         this.MallHighlightRef.current.refreshPlaceEvent();
            //     }
            // } catch(e){}
        }).bind(this), null,callerObj);
    }

    _addAPIParallelGetBuildingLoyaltySlider(callerObj =null){
        this.baseAddAPIParallel('SearchBuildingHighlightLoyaltyCardSlider', (async (v1) => { return tbVHomeMallAPI.SearchBuildingHighlightLoyaltyCardSlider(v1) }).bind(this, this.selectedPlaceKey), ((v) => {
            this.loyaltyData.data = v;
            MallHomeHelper.AddUpdateGlobalVar(this.selectedPlaceKey, 'loyaltyDataPlace', this.loyaltyData, new Date());
            // try{
            //     if (SGHelperType.isDefined(this.MallHighlightRef.current)) {
            //         this.MallHighlightRef.current.refreshStoreEvent();
            //     }
            // } catch(e){}
        }).bind(this), null,callerObj);
    }


    _addAPIParallelGetBuildingAuctionSlider(callerObj =null){
        this.baseAddAPIParallel('getBuildingAuctionSlider', (async (v1) => { return VMallHomeAPI.getBuildingAuctionSlider(v1) }).bind(this, this.selectedPlaceKey), ((v) => {
            this.auctionData.data = v;
            MallHomeHelper.AddUpdateGlobalVar(this.selectedPlaceKey, 'auctionDataPlace', this.auctionData, new Date());
            // try{
            //     if (SGHelperType.isDefined(this.MallHighlightRef.current)) {
            //         this.MallHighlightRef.current.refreshStoreEvent();
            //     }
            // } catch(e){}
        }).bind(this), null,callerObj);
    }

    _addAPIParallelGetBuildingStorePromoSlider(callerObj =null){
        this.baseAddAPIParallel('getBuildingStorePromoSlider', (async (v1) => { return VMallHomeAPI.getBuildingStorePromoSlider(v1) }).bind(this, this.selectedPlaceKey), ((v) => {
            // console.log('getBuildingStorePromoSlider')
            this.storePromoData.data = v;
            MallHomeHelper.AddUpdateGlobalVar(this.selectedPlaceKey, 'storePromoDataPlace', this.storePromoData, new Date());
            // try{
            //     if (SGHelperType.isDefined(this.MallHighlightRef.current)) {
            //         this.MallHighlightRef.current.refreshStoreEvent();
            //     }
            // } catch(e){}
        }).bind(this), null,callerObj);
    }

    _addAPIParallelGetBuildingRestoPromoSlider(callerObj =null){
        this.baseAddAPIParallel('getBuildingRestoPromoSlider', (async (v1) => { return VMallHomeAPI.getBuildingRestoPromoSlider(v1) }).bind(this, this.selectedPlaceKey), ((v) => {
            // console.log('getBuildingRestoPromoSlider')
            this.restoPromoData.data = v;
            MallHomeHelper.AddUpdateGlobalVar(this.selectedPlaceKey, 'restoPromoDataPlace', this.restoPromoData, new Date());
            // try{
            //     if (SGHelperType.isDefined(this.MallHighlightRef.current)) {
            //         this.MallHighlightRef.current.refreshRestoEvent();
            //     }    
            // }catch(e){}
        }).bind(this), null, callerObj);
    }

    _addAPIParallelGetBuildingMostLikedStore(callerObj =null){
        this.baseAddAPIParallel('getBuildingMostLikedStore', (async (v1) => { return VMallHomeAPI.getBuildingMostLikedStore(v1) }).bind(this, this.selectedPlaceKey), ((v) => {
            // console.log('getBuildingMostLikedStore')
            this.mostLikedStoreData.data = v;
            MallHomeHelper.AddUpdateGlobalVar(this.selectedPlaceKey, 'mostLikedStoreDataPlace', this.mostLikedStoreData, new Date());
            // try{
            //     if (SGHelperType.isDefined(this.MallHighlightRef.current)) {
            //         this.MallHighlightRef.current.refreshMostLikeStore();
            //     }
            // }catch(e){}
        }).bind(this), null,callerObj);
    }

    _addAPIParallelGetBuildingMostLikedResto(callerObj =null){
        this.baseAddAPIParallel('getBuildingMostLikedResto', (async (v1) => { return VMallHomeAPI.getBuildingMostLikedResto(v1) }).bind(this, this.selectedPlaceKey), ((v) => {
            // console.log('getBuildingMostLikedResto')
            this.mostLikedRestoData.data = v;
            MallHomeHelper.AddUpdateGlobalVar(this.selectedPlaceKey, 'mostLikedRestoDataPlace', this.mostLikedRestoData, new Date());
            // try{
            //     if (SGHelperType.isDefined(this.MallHighlightRef.current)) {
            //         this.MallHighlightRef.current.refreshMostLikeResto();
            //     }
            // }catch(e){}
        }).bind(this), null,callerObj);
    }

    _addAPIParallelGetBuildingFloorData(callerObj =null){
        this.baseAddAPIParallel('getBuildingFloorData', (async (v1) => { return VMallHomeAPI.getBuildingFloorData(v1) }).bind(this, this.selectedPlaceKey), ((v) => {
            // console.log('getBuildingFloorData')
            this.mallFloorData.data = v;
            var _lang = this._language.toUpperCase();
            for (var i = 0; i < this.mallFloorData.data.length; i++) {
                if (this.mallFloorData.data[i].key === 'DefaultAll') {
                    this.mallFloorData.data[i] = { key: 'DefaultAll',  title: (_lang==='ID'? 'Semua Lantai': (_lang==='EN'?'All Floors':'所有楼层')) , logo: '' }
                }
                else {
                    this.mallFloorData.data[i] = { key: this.mallFloorData.data[i].key, title: this.mallFloorData.data[i]['fFloorName' + this.Language.toUpperCase()], logo: '' }
                }
            }
            MallHomeHelper.AddUpdateGlobalVar(this.selectedPlaceKey, 'mallFloorDataPlace', this.mallFloorData, new Date());
        }).bind(this), null,callerObj);
    }

    _addAPIParallelGetRestoCuisineData(callerObj =null){
        this.baseAddAPIParallel('getRestoCuisineData', (async (v1) => { return VMallHomeAPI.getRestoCuisineData(v1) }).bind(this, this.selectedPlaceKey), ((v) => {
            // console.log('getRestoCuisineData')
            this.restoCuisineData.data = v;
            var _lang = this._language.toUpperCase();
            for (var i = 0; i < this.restoCuisineData.data.length; i++) {
                if (this.restoCuisineData.data[i].key === 'DefaultAll') {
                    this.restoCuisineData.data[i] = { key: 'DefaultAll',title: (_lang==='ID'? 'Semua Jenis': (_lang==='EN'?'All Cuisine':'所有美食')), logo: '' }
                }
                else {
                    this.restoCuisineData.data[i] = { key: this.restoCuisineData.data[i].key, title: VisitorHelper.getLocalizeDataFromLookUp('CuisineCategory', this.restoCuisineData.data[i].key, this._language), logo: '' }
                }
            }
            MallHomeHelper.AddUpdateGlobalVar(this.selectedPlaceKey, 'restoCuisineDataPlace', this.restoCuisineData, new Date());
        }).bind(this), null, callerObj);
    }    

    _addAPIParallelGetBuildingStoreListData(callerObj =null){
        this.baseAddAPIParallel('getBuildingStoreListData', (async (v1) => { return VMallHomeAPI.getBuildingStoreListData(v1) }).bind(this, this.selectedPlaceKey), ((v) => {
            // console.log('getBuildingStoreListData')
            this.storeListData.data = v;
            MallHomeHelper.AddUpdateGlobalVar(this.selectedPlaceKey, 'storeListDataPlace', this.storeListData, new Date());
        }).bind(this), null,callerObj);
    }

    _addAPIParallelGetBuildingRestoListData(callerObj =null){
        this.baseAddAPIParallel('getBuildingRestoListData', (async (v1) => { return VMallHomeAPI.getBuildingRestoListData(v1) }).bind(this, this.selectedPlaceKey), ((v) => {
            // console.log('getBuildingRestoListData')
            this.restoListData.data = v;
            MallHomeHelper.AddUpdateGlobalVar(this.selectedPlaceKey, 'restoListDataPlace', this.restoListData, new Date());
        }).bind(this), null,callerObj);
    }

    _addAPIParallelGetBuildingFacilityListData(callerObj =null){
        this.baseAddAPIParallel('getBuildingFacilityListData', (async (v1) => { return VMallHomeAPI.getBuildingFacilityListData(v1) }).bind(this, this.selectedPlaceKey), ((v) => {
            // console.log('getBuildingFacilityListData')
            this.facilityListData.data = v;
            MallHomeHelper.AddUpdateGlobalVar(this.selectedPlaceKey, 'facilityListDataPlace', this.facilityListData, new Date());
        }).bind(this), null,callerObj);
    }

    _addAPIParallelGetStoreCategoryData(callerObj =null){
        this.baseAddAPIParallel('getStoreCategoryData', (async (v1) => { return VMallHomeAPI.getStoreCategoryData(v1) }).bind(this, this.selectedPlaceKey), ((v) => {
            // console.log('getStoreCategoryData')
            this.storeCategoryData.data = v;
            MallHomeHelper.AddUpdateGlobalVar(this.selectedPlaceKey, 'storeCategoryDataPlace', this.storeCategoryData, new Date());
        }).bind(this), null,callerObj);
    }

    _addAPIParallelGetRestoCategoryData(callerObj =null){
        this.baseAddAPIParallel('getRestoCategoryData', (async (v1) => { return VMallHomeAPI.getRestoCategoryData(v1) }).bind(this, this.selectedPlaceKey), ((v) => {
            // console.log('getRestoCategoryData')
            this.restoCategoryData.data = v;
            MallHomeHelper.AddUpdateGlobalVar(this.selectedPlaceKey, 'restoCategoryDataPlace', this.restoCategoryData, new Date());
        }).bind(this), null,callerObj);
    }

    _addAPIParallelGetFacilityCategoryData(callerObj =null){
        this.baseAddAPIParallel('getFacilityCategoryData', (async (v1) => { return VMallHomeAPI.getFacilityCategoryData(v1) }).bind(this, this.selectedPlaceKey), ((v) => {
            // console.log('getFacilityCategoryData')
            this.facilityCategoryData.data = v;
            MallHomeHelper.AddUpdateGlobalVar(this.selectedPlaceKey, 'facilityCategoryDataPlace', this.facilityCategoryData, new Date());
        }).bind(this), null,callerObj);
    }

    async _onRefreshAllItem(flagOnFocus) {
        this.parkingLastUpdateTime.data = new Date();
        this._initUserSettingData();
        this.baseInitAPIParallel(SGHelperGlobalVar.getVar("ResponTimes"), (() => { this.checkOnRefreshAllItemAPIBatchStatusAllDone(flagOnFocus); }).bind(this));
        this._addAPIParallelGetBuildingContent();
        this._addAPIParallelCheckUserCheckInHere();
        this._addAPIParallelGetBuildingHomeHeader();
        this._addAPIParallelGetBuildingParkingHighlightData();
        this._addAPIParallelGetParkingListData();
        this._addAPIParallelGetBuildingEventSlider();
        this._addAPIParallelGetBuildingLoyaltySlider();
        this._addAPIParallelGetBuildingAuctionSlider();
        this._addAPIParallelGetBuildingStorePromoSlider();
        this._addAPIParallelGetBuildingRestoPromoSlider();
        this._addAPIParallelGetBuildingMostLikedStore();
        this._addAPIParallelGetBuildingMostLikedResto();
        this._addAPIParallelGetBuildingHomeProfile();
        this._addAPIParallelGetSalesPromo();
        this._addAPIParallelHashTagPromo();
        this.baseRunAPIParallel();
    }

    checkRestoStoreFacilityAPIBatchStatusAllDone(){
        //[GH] : need to update global variable that loading store-resto-facility is successful
        // console.log('checkRestoStoreFacilityAPIBatchStatusAllDone');
        this.storeRestoFacilityAlreadyMount = true;
        this.UpdateStoreCategoryTree();
        this.UpdateRestoCategoryTree();
        this.UpdateFacilityCategoryTree();
        MallHomeHelper.AddUpdateGlobalVar(this.selectedPlaceKey, 'restoStoreFacilityLoaded', true, new Date());
        this.forceUpdate();
    }

    loadRestoStoreFacility(){
        this.newThread3 = this.baseInitAPIParallel(SGHelperGlobalVar.getVar("ResponTimes"), (() => { this.checkRestoStoreFacilityAPIBatchStatusAllDone(); }).bind(this), () => { }, true);
        this._addAPIParallelGetBuildingFloorData(this.newThread3);
        this._addAPIParallelGetStoreCategoryData(this.newThread3);
        this._addAPIParallelGetBuildingStoreListData(this.newThread3);
        this._addAPIParallelGetBuildingRestoListData(this.newThread3);
        this._addAPIParallelGetBuildingFacilityListData(this.newThread3);
        this._addAPIParallelGetRestoCategoryData(this.newThread3);
        this._addAPIParallelGetRestoCuisineData(this.newThread3);
        this._addAPIParallelGetFacilityCategoryData(this.newThread3);
        this.baseRunAPIParallel(this.newThread3);        
    }

    //to Optimize tree structure >>>>>>>>>>>>>>>>>>
    checkOnRefreshAllItemAPIBatchStatusAllDone(flagOnFocus) {
        MallHomeHelper.AddUpdateGlobalVar(this.selectedPlaceKey, 'renderPlace', this.selectedPlaceKey, new Date());
        MallHomeHelper.AddUpdateDatePullBatch(this.selectedPlaceKey, 'datePullPlaceBatch1')

        this.loadRestoStoreFacility();

        this._checkUserView();
        this.alreadyMount = true;

        if (!this.anonymousMode) {
            if(flagOnFocus===false)this._SurpriseRewardOpenMall();
        }
        this.forceUpdate();
        // if (!this.animFlag) { setTimeout(() => { this.animFlag = true; this.baseCreateAnimation(500, null); }, 1000); }
    }

    UpdateStoreCategoryTree(){
        for (var i = 0; i < this.storeCategoryData.data.length; i++) {
            this.storeCategoryData.data[i] = { key: this.storeCategoryData.data[i].key, title: VisitorHelper.getLocalizeDataFromLookUp('StoreCategory', this.storeCategoryData.data[i].key, this._language), logo: '' }
        }
        this.storeCategoryData.data = VisitorHelper._naturalSort(this.storeCategoryData.data, 'desc', 'title')
        this.storeCategoryData.resultConstructStoreList = MallHomeHelper.ConstructDataStoreForEachCategory(this.storeListData.data, this.storeCategoryData.data, this._language.toUpperCase());
    }

    UpdateRestoCategoryTree(){
        for (var i = 0; i < this.restoCategoryData.data.length; i++) {
            this.restoCategoryData.data[i] = { key: this.restoCategoryData.data[i].key, title: VisitorHelper.getLocalizeDataFromLookUp('RestoCategory', this.restoCategoryData.data[i].key, this._language), logo: '' }
        }
        this.restoCategoryData.data = VisitorHelper._naturalSort(this.restoCategoryData.data, 'desc', 'title')
        this.restoCategoryData.resultConstructRestoList = MallHomeHelper.ConstructDataRestoForEachCategory(this.restoListData.data, this.restoCategoryData.data, this._language.toUpperCase());
    }

    UpdateFacilityCategoryTree(){
        for (var i = 0; i < this.facilityCategoryData.data.length; i++) {
            this.facilityCategoryData.data[i] = { key: this.facilityCategoryData.data[i].key, title: VisitorHelper.getLocalizeDataFromLookUp('FacilityCategory', this.facilityCategoryData.data[i].key, this._language), logo: '' }
        }
        this.facilityCategoryData.data = VisitorHelper._naturalSort(this.facilityCategoryData.data,'desc','title')
        this.facilityCategoryData.resultConstructFacilityList = MallHomeHelper.ConstructDataFacilityList(this.facilityCategoryData.data, this.facilityListData.data, this._language.toUpperCase())
    }

    async _getDataParking() {        
        this.parkingLastUpdateTime.data = new Date();
        // console.log('refresh data parking')
        this.newThread1 = this.baseInitAPIParallel(SGHelperGlobalVar.getVar("ResponTimes"), (() => {
            // console.log('update all done parking')
        }).bind(this), () => { }, true);
        this._addAPIParallelGetBuildingParkingHighlightData(this.newThread1);
        this._addAPIParallelGetParkingListData(this.newThread1);
        this.baseRunAPIParallel(this.newThread1);
    }

    async _checkSpyAPI() {
        this.baseRunSingleAPIWithRedoOption('getSpy', (async (v1) => { return VSpyAPI.SpyAPI(v1) }).bind(this, this.selectedPlaceKey), ((v) => {
            this.dateGlobalVariabel = v
            this._reloadSpyChangesData();
            // this.baseRunSingleAPIWithRedoOption('reloadSpyChangesAPI', (async () => { this._reloadSpyChangesData() }).bind(this), (v) => { }, () => { }, SGHelperGlobalVar.getVar("ResponTimes"));
        }).bind(this), () => { }, SGHelperGlobalVar.getVar("ResponTimes"), false);
    }

    async _reloadSpyChangesData() {
        // console.log('reload spy');
        var changedData = 0;
        this.shouldConstructStoreCategoryTree = false;
        this.shouldConstructRestoCategoryTree = false;
        this.shouldConstructFacilityCategoryTree = false;
        this._initUserSettingData();
        this.newThread2 = this.baseInitAPIParallel(SGHelperGlobalVar.getVar("ResponTimes"), (() => { this._checkAPIReloadSpyAllDone(); }).bind(this), () => { }, true);

        var dateNow = new Date()
        var datePullPlaceBatch1 = new Date(MallHomeHelper.GetGlobalVarByPlaceKey('datePullPlaceBatch1', this.selectedPlaceKey));
        var dateTimePullPlaceBatch1 = new Date(datePullPlaceBatch1.getFullYear(), datePullPlaceBatch1.getMonth(), datePullPlaceBatch1.getDate(), datePullPlaceBatch1.getHours(), datePullPlaceBatch1.getMinutes(), datePullPlaceBatch1.getSeconds() + SGHelperType.getSysParamsValueToInt('PlaceScreenPullDataBatch1'));

        if(MallHomeHelper.CheckExpiredCacheDate(SGHelperType.convertNewDate(MallHomeHelper.GetGlobalVarDateByPlaceKey('currentBuildingContent', this.selectedPlaceKey)),this.dateGlobalVariabel.dateBuildingData )){
            changedData++;
            this._addAPIParallelGetBuildingContent(this.newThread2);
        }

        if(MallHomeHelper.CheckExpiredCacheDate(SGHelperType.convertNewDate(MallHomeHelper.GetGlobalVarDateByPlaceKey('mallHeaderDataPlace', this.selectedPlaceKey)),this.dateGlobalVariabel.dateBuildingData )){
            changedData++;
            this._addAPIParallelGetBuildingHomeHeader(this.newThread2);
        }

        if(MallHomeHelper.CheckExpiredCacheDate(SGHelperType.convertNewDate(MallHomeHelper.GetGlobalVarDateByPlaceKey('placeEventDataPlace', this.selectedPlaceKey)),this.dateGlobalVariabel.dateEventBuildingData )|| dateNow > dateTimePullPlaceBatch1){
            changedData++;
            this._addAPIParallelGetBuildingEventSlider(this.newThread2);
        }

        if(MallHomeHelper.CheckExpiredCacheDate(SGHelperType.convertNewDate(MallHomeHelper.GetGlobalVarDateByPlaceKey('storePromoDataPlace', this.selectedPlaceKey)),this.dateGlobalVariabel.dateEventTenantData )|| dateNow > dateTimePullPlaceBatch1){
            changedData++;
            this._addAPIParallelGetBuildingStorePromoSlider(this.newThread2);
        }

        if(MallHomeHelper.CheckExpiredCacheDate(SGHelperType.convertNewDate(MallHomeHelper.GetGlobalVarDateByPlaceKey('restoPromoDataPlace', this.selectedPlaceKey)),this.dateGlobalVariabel.dateEventTenantData )|| dateNow > dateTimePullPlaceBatch1){
            changedData++;
            this._addAPIParallelGetBuildingRestoPromoSlider(this.newThread2);
        }
        
        if(MallHomeHelper.CheckExpiredCacheDate(SGHelperType.convertNewDate(MallHomeHelper.GetGlobalVarDateByPlaceKey('mostLikedStoreDataPlace', this.selectedPlaceKey)),this.dateGlobalVariabel.dateStoreRestoData )|| dateNow > dateTimePullPlaceBatch1){
            changedData++;
            this._addAPIParallelGetBuildingMostLikedStore(this.newThread2);
        }
        
        if(MallHomeHelper.CheckExpiredCacheDate(SGHelperType.convertNewDate(MallHomeHelper.GetGlobalVarDateByPlaceKey('mostLikedRestoDataPlace', this.selectedPlaceKey)),this.dateGlobalVariabel.dateStoreRestoData ) || dateNow > dateTimePullPlaceBatch1){
            changedData++;
            this._addAPIParallelGetBuildingMostLikedResto(this.newThread2);
        }
        
        if(MallHomeHelper.CheckExpiredCacheDate(SGHelperType.convertNewDate(MallHomeHelper.GetGlobalVarDateByPlaceKey('linkDataPlace', this.selectedPlaceKey)),this.dateGlobalVariabel.dateBuildingData )){
            changedData++;
            this._addAPIParallelGetBuildingHomeProfile(this.newThread2);
        }

        // Hanya perlu cek salah satu global var untuk Sales Promo Discount / Hashtag karena dicek dari perubahan last modified tabel setting yang sama
        if(MallHomeHelper.CheckExpiredCacheDate(SGHelperType.convertNewDate(MallHomeHelper.GetGlobalVarDateByPlaceKey('salesPromoDataPlace', this.selectedPlaceKey)),this.dateGlobalVariabel.dateSettingBuildingData ) || MallHomeHelper.CheckExpiredCacheDate(SGHelperType.convertNewDate(MallHomeHelper.GetGlobalVarDateByPlaceKey('hashTagPromoDataPlace', this.selectedPlaceKey)),this.dateGlobalVariabel.dateSettingBuildingData ) || dateNow > dateTimePullPlaceBatch1){
            changedData++;
            this._addAPIParallelGetBuildingHomeHeader(this.newThread2);
            this._addAPIParallelGetSalesPromo(this.newThread2);
            this._addAPIParallelHashTagPromo(this.newThread2);
        }

        if(this.storeRestoFacilityAlreadyMount){
            if(MallHomeHelper.CheckExpiredCacheDate(SGHelperType.convertNewDate(MallHomeHelper.GetGlobalVarDateByPlaceKey('storeListDataPlace', this.selectedPlaceKey)),this.dateGlobalVariabel.dateStoreRestoData )|| dateNow > dateTimePullPlaceBatch1){
                changedData++;
                this.shouldConstructStoreCategoryTree = true;
                this._addAPIParallelGetBuildingStoreListData(this.newThread2);
            }
            if(MallHomeHelper.CheckExpiredCacheDate(SGHelperType.convertNewDate(MallHomeHelper.GetGlobalVarDateByPlaceKey('restoListDataPlace', this.selectedPlaceKey)),this.dateGlobalVariabel.dateStoreRestoData )|| dateNow > dateTimePullPlaceBatch1){
                changedData++;
                this.shouldConstructRestoCategoryTree = true;
                this._addAPIParallelGetBuildingRestoListData(this.newThread2);
            }
            if(MallHomeHelper.CheckExpiredCacheDate(SGHelperType.convertNewDate(MallHomeHelper.GetGlobalVarDateByPlaceKey('facilityListDataPlace', this.selectedPlaceKey)),this.dateGlobalVariabel.dateFacilityData )|| dateNow > dateTimePullPlaceBatch1){
                changedData++;
                this.shouldConstructFacilityCategoryTree = true;
                this._addAPIParallelGetBuildingFacilityListData(this.newThread2);
            }
            if(MallHomeHelper.CheckExpiredCacheDate(SGHelperType.convertNewDate(MallHomeHelper.GetGlobalVarDateByPlaceKey('storeCategoryDataPlace', this.selectedPlaceKey)),this.dateGlobalVariabel.dateStoreRestoData )){
                changedData++;
                this.shouldConstructStoreCategoryTree = true;
                this._addAPIParallelGetStoreCategoryData(this.newThread2);
            }
            if(MallHomeHelper.CheckExpiredCacheDate(SGHelperType.convertNewDate(MallHomeHelper.GetGlobalVarDateByPlaceKey('restoCategoryDataPlace', this.selectedPlaceKey)),this.dateGlobalVariabel.dateStoreRestoData )){
                changedData++;
                this.shouldConstructRestoCategoryTree = true;
                this._addAPIParallelGetRestoCategoryData(this.newThread2);
            }
            if(MallHomeHelper.CheckExpiredCacheDate(SGHelperType.convertNewDate(MallHomeHelper.GetGlobalVarDateByPlaceKey('facilityCategoryDataPlace', this.selectedPlaceKey)),this.dateGlobalVariabel.dateFacilityData )){
                changedData++;
                this.shouldConstructFacilityCategoryTree = true;
                this._addAPIParallelGetFacilityCategoryData(this.newThread2);
            }
            if(MallHomeHelper.CheckExpiredCacheDate(SGHelperType.convertNewDate(MallHomeHelper.GetGlobalVarDateByPlaceKey('mallFloorDataPlace', this.selectedPlaceKey)),this.dateGlobalVariabel.dateFloorData )){
                changedData++;
                this.shouldConstructStoreCategoryTree = true;
                this.shouldConstructRestoCategoryTree = true;
                this.shouldConstructFacilityCategoryTree = true;
                this._addAPIParallelGetBuildingFloorData(this.newThread2);
            }
            if(MallHomeHelper.CheckExpiredCacheDate(SGHelperType.convertNewDate(MallHomeHelper.GetGlobalVarDateByPlaceKey('restoCuisineDataPlace', this.selectedPlaceKey)),this.dateGlobalVariabel.dateStoreRestoData )){
                changedData++;
                this.shouldConstructRestoCategoryTree = true;
                this._addAPIParallelGetRestoCuisineData(this.newThread2);
            }
        }
        if(changedData>0){this.baseRunAPIParallel(this.newThread2)} 
    }

    _checkAPIReloadSpyAllDone() {
        // console.log('API Reload Spy All Done')
        MallHomeHelper.AddUpdateDatePullBatch(this.selectedPlaceKey, 'datePullPlaceBatch1')
        if(this.shouldConstructStoreCategoryTree){
            this.UpdateStoreCategoryTree();
        }
        if(this.shouldConstructRestoCategoryTree){
            this.UpdateRestoCategoryTree();
        }
        if(this.shouldConstructFacilityCategoryTree){
            this.UpdateFacilityCategoryTree();
        }
        this.forceUpdate();
    }

    _loadCache(){
        this._baseAnimVar = new Animated.Value(1);
        this.selectedPlaceContent = MallHomeHelper.GetGlobalVarByPlaceKey('currentBuildingContent', this.selectedPlaceKey);
        SGHelperGlobalVar.setVar('GlobalLastSelectedPlace', { key: this.selectedPlaceKey, placeNameID: this.selectedPlaceContent.fContentID.fBuildingName, placeNameEN: this.selectedPlaceContent.fContentEN.fBuildingName, placeNameCN: this.selectedPlaceContent.fContentCN.fBuildingName });
        this.mallSummaryData = this.selectedPlaceContent['fContent' + this.Language.toUpperCase()].fImageSlider;
        this.instagramSpotData = this.selectedPlaceContent['fContent' + this.Language.toUpperCase()].fInstagramSpot;
        this.uniqueExperienceData = this.selectedPlaceContent['fContent' + this.Language.toUpperCase()].fUniqueExperience;
        this.mallHeaderData = MallHomeHelper.GetGlobalVarByPlaceKey('mallHeaderDataPlace', this.selectedPlaceKey);
        if(this.mallHeaderData.data.fLuxuryMode == 'Y') this.luxuryMode = true;
        else this.luxuryMode = false;
        this.linkData = MallHomeHelper.GetGlobalVarByPlaceKey('linkDataPlace', this.selectedPlaceKey);
        this.parkingHighlightData = MallHomeHelper.GetGlobalVarByPlaceKey('parkingHighlightDataPlace', this.selectedPlaceKey);
        this.parkingLastUpdateTime.data = MallHomeHelper.GetGlobalVarDateByPlaceKey('parkingHighlightDataPlace', this.selectedPlaceKey);
        this.parkingListData = MallHomeHelper.GetGlobalVarByPlaceKey('parkingListDataPlace', this.selectedPlaceKey);
        this.placeEventData = MallHomeHelper.GetGlobalVarByPlaceKey('placeEventDataPlace', this.selectedPlaceKey);
        this.loyaltyData = MallHomeHelper.GetGlobalVarByPlaceKey('loyaltyDataPlace', this.selectedPlaceKey);
        this.auctionData = MallHomeHelper.GetGlobalVarByPlaceKey('auctionDataPlace', this.selectedPlaceKey);
        this.storePromoData = MallHomeHelper.GetGlobalVarByPlaceKey('storePromoDataPlace', this.selectedPlaceKey);
        this.restoPromoData = MallHomeHelper.GetGlobalVarByPlaceKey('restoPromoDataPlace', this.selectedPlaceKey);
        this.mostLikedStoreData = MallHomeHelper.GetGlobalVarByPlaceKey('mostLikedStoreDataPlace', this.selectedPlaceKey);
        this.mostLikedRestoData = MallHomeHelper.GetGlobalVarByPlaceKey('mostLikedRestoDataPlace', this.selectedPlaceKey);    


        //[GH] : ini perlu pengecekan global var tambahan apakah sudah pernah berhasil selesai atau belum. jika belum maka harus load ulang
        var _flagRestoStoreFacilityLoaded = MallHomeHelper.GetGlobalVarByPlaceKey('restoStoreFacilityLoaded', this.selectedPlaceKey);
        if((SGHelperType.isDefined(_flagRestoStoreFacilityLoaded)?_flagRestoStoreFacilityLoaded:false)){
            this.mallFloorData = MallHomeHelper.GetGlobalVarByPlaceKey('mallFloorDataPlace', this.selectedPlaceKey);
            this.restoCuisineData = MallHomeHelper.GetGlobalVarByPlaceKey('restoCuisineDataPlace', this.selectedPlaceKey);
    
            this.storeListData = MallHomeHelper.GetGlobalVarByPlaceKey('storeListDataPlace', this.selectedPlaceKey);
            this.restoListData = MallHomeHelper.GetGlobalVarByPlaceKey('restoListDataPlace', this.selectedPlaceKey);
            this.facilityListData = MallHomeHelper.GetGlobalVarByPlaceKey('facilityListDataPlace', this.selectedPlaceKey);
    
            this.storeCategoryData = MallHomeHelper.GetGlobalVarByPlaceKey('storeCategoryDataPlace', this.selectedPlaceKey);
            this.restoCategoryData = MallHomeHelper.GetGlobalVarByPlaceKey('restoCategoryDataPlace', this.selectedPlaceKey);
            this.facilityCategoryData = MallHomeHelper.GetGlobalVarByPlaceKey('facilityCategoryDataPlace', this.selectedPlaceKey);  
            this.storeRestoFacilityAlreadyMount = true;  
        } else {
            this.loadRestoStoreFacility();            
        }

        this.salesDiscountData = MallHomeHelper.GetGlobalVarByPlaceKey('salesPromoDataPlace', this.selectedPlaceKey);
        this.hashTagData = MallHomeHelper.GetGlobalVarByPlaceKey('hashTagPromoDataPlace', this.selectedPlaceKey);

        // console.log('_loadCache');
        if (!this.anonymousMode) {
            this._SurpriseRewardOpenMall();
        }
        this.alreadyMount = true;
        this.forceUpdate();
        // if (!this.animFlag) { setTimeout(() => { this.animFlag = true; this.baseCreateAnimation(500, null); }, 1000); }
    }

    async _addViewFacility(contentKey, targetKey) {
        try {
            var jsonInput = { fID: '', fContentType: 'Facility', fContentKey: contentKey, fTargetKey: targetKey, fUserKey: '', fActive: 'Y', fCreatedBy: '', fCreatedDate: new Date(), fLastModifiedBy: '', fLastModifiedDate: new Date() }
            await tbVUserViewAPI.addUserView(jsonInput);
        } catch (error) {
            SGHelperErrorHandling.Handling(error, this._addViewFacility.bind(this, contentKey, targetKey))
        }

    }

    handleOpenURL(event) {
        // console.log(event.url);
        const route = event.url.replace(/.*?:\/\//g, '');
        // do something with the url, in our case navigate(route)
    }

    onShowReward() {
        // console.log('onSHowReward')
        this.forceUpdate();
        setTimeout(() => { SGPopView.showPopView(this.pvID) }, 300);
    }

    onHideReward() {
        SGPopView.hidePopView(this.pvID);
        this.surpriseReward = { fID: null, fRewardID: { fTargetName: '', fShortDescription: '', fImageJSON: [] }, fRewardEN: { fTargetName: '', fShortDescription: '', fImageJSON: [] }, fRewardCN: { fTargetName: '', fShortDescription: '', fImageJSON: [] } }
    }

    openExternalApp(url) {
        Linking.canOpenURL(url).then(supported => {
            if (supported) {
                Linking.openURL(url);
            } else {
                SGDialogBox.showWebView(url,()=>{});   
                // SGDialogBox.showWarning(null,tR("AlertMessage.Fail"),tR("AlertMessage.AlertHandleLink"),tR("AlertMessage.OK"),()=>{},true,{label: url,url:url})
                // console.log('Don\'t know how to open URI: ' + url);
            }
        });
    }

    async _SurpriseRewardOpenMall() {
        try {
            // console.log('Calling Surprise Reward Open Mall')
            this.surpriseReward = await VRewardAPI.SurpriseRewardOpenMall(this.selectedPlaceKey)
            if (this.surpriseReward.fID !== null) {
                this.onShowReward()
            } else this.surpriseReward = { fID: null, fRewardID: { fTargetName: '', fShortDescription: '', fImageJSON: [] }, fRewardEN: { fTargetName: '', fShortDescription: '', fImageJSON: [] }, fRewardCN: { fTargetName: '', fShortDescription: '', fImageJSON: [] } }
        } catch (error) {
            SGHelperErrorHandling.Handling(error, this._SurpriseRewardOpenMall.bind(this))
        }
    }

    async _SurpriseRewardCheckInMall() {
        try {
            this.surpriseReward = await VRewardAPI.SurpriseRewardCheckInMall(this.selectedPlaceKey)
        } catch (error) {
            SGHelperErrorHandling.Handling(error, this._SurpriseRewardCheckInMall.bind(this))
        }

    }

    async _SurpriseRewardLikeMall() {
        try {
            if (!SGHelperGlobalVar.getVar('GlobalAnonymous')) {
                this.surpriseReward = await VRewardAPI.SurpriseRewardLikeMall(this.selectedPlaceKey)
                // console.log('_SurpriseRewardLikeMall')
                if (this.surpriseReward.fID !== null) {
                    this.onShowReward()
                } else this.surpriseReward = { fID: null, fRewardID: { fTargetName: '', fShortDescription: '', fImageJSON: [] }, fRewardEN: { fTargetName: '', fShortDescription: '', fImageJSON: [] }, fRewardCN: { fTargetName: '', fShortDescription: '', fImageJSON: [] } }
            }

        } catch (error) {
            SGHelperErrorHandling.Handling(error, this._SurpriseRewardLikeMall.bind(this))
        }

    }

    async _refreshCheckIn() {
        try {
            this.isAlreadyCheckIn = await tbVUserCheckInAPI.CheckUserCheckInHere(this.selectedPlaceKey);
            if (this.surpriseReward.fID !== null) {
                this.onShowReward()
            } else this.surpriseReward = { fID: null, fRewardID: { fTargetName: '', fShortDescription: '', fImageJSON: [] }, fRewardEN: { fTargetName: '', fShortDescription: '', fImageJSON: [] }, fRewardCN: { fTargetName: '', fShortDescription: '', fImageJSON: [] } }
            this.mallHeaderData.data.lastVisited = 0;
            this.forceUpdate();
        } catch (error) {
            SGHelperErrorHandling.Handling(error, this._refreshCheckIn.bind(this))
        }

    }

    async _refreshCheckOut() {
        try {
            this.isAlreadyCheckIn = await tbVUserCheckInAPI.CheckUserCheckInHere(this.selectedPlaceKey);
            this.forceUpdate();
        } catch (error) {
            SGHelperErrorHandling.Handling(error, this._refreshCheckOut.bind(this))
        }
    }

    render() {
        // console.log('MallHomeScreen-render');
        // console.log(this.mallHeaderData.data)
        var { w, h, p } = this.WHP;
        var style = this.style;
        var parkingTypeData = this.parkingTypeData;
        var surpriseReward = this.surpriseReward;
        var language = this._language.toUpperCase();
        var tR = SGLocalize.translate;
        var data = this.linkData;
        //GH : please get this from Mall profile
        var luxury = this.luxuryMode;
        // console.log('renderrrr')
        // console.log(luxury);
        return (
            <RootView dummyStatusBar={!luxury} accessible={true} accessibilityLabel={'MallHomeScreenRootView'} style={style.mainContainer}>
                <SGPopView accessible={true} accessibilityLabel={'MallHomeScreenPopView'} vPos={'Top'} animationType={'slideUp'} popViewID={this.pvID} >
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

                {
                    this.mallHeaderData.data !== null ?
                        luxury?
                        <MallHomeNewHeaderLuxury onNotification={((item, s) => { item.fUserNotificationThis = s; this.forceUpdate(); }).bind(this, this.mallHeaderData.data)} onFavorite={((item, s) => { item.fUserFavoriteThis = s; this.forceUpdate(); }).bind(this, this.mallHeaderData.data)} onLike={((item, s, c) => { item.fUserLikedThis = s; item.fLikeCount += c; this.forceUpdate(); }).bind(this, this.mallHeaderData.data)} ref={this.MallHeaderRef} animVar={this._baseAnimVar} currentUserData={this.currentUserData} accessible={true} accessibilityLabel={'MallHomeScreenHeader'} language={this.Language} imageSetting={this.imageSetting} selectedPlace={this.selectedPlaceContent} refresh={this._refreshCheckIn.bind(this)} refreshCheckOut={this._refreshCheckOut.bind(this)} isAlreadyCheckIn={this.isAlreadyCheckIn} currentUserImage={this.currentUserImage} screen='MallProfile' navigator={this.props.navigation} headerData={this.mallHeaderData.data} fullData={this.linkData.data} style={style.throwWHP} checkInReward={this._SurpriseRewardCheckInMall.bind(this)} likeMallGetReward={this._SurpriseRewardLikeMall.bind(this)}></MallHomeNewHeaderLuxury>
                        :<MallHomeNewHeader onNotification={((item, s) => { item.fUserNotificationThis = s; this.forceUpdate(); }).bind(this, this.mallHeaderData.data)} onFavorite={((item, s) => { item.fUserFavoriteThis = s; this.forceUpdate(); }).bind(this, this.mallHeaderData.data)} onLike={((item, s, c) => { item.fUserLikedThis = s; item.fLikeCount += c; this.forceUpdate(); }).bind(this, this.mallHeaderData.data)} ref={this.MallHeaderRef} animVar={this._baseAnimVar} currentUserData={this.currentUserData} accessible={true} accessibilityLabel={'MallHomeScreenHeader'} language={this.Language} imageSetting={this.imageSetting} selectedPlace={this.selectedPlaceContent} refresh={this._refreshCheckIn.bind(this)} refreshCheckOut={this._refreshCheckOut.bind(this)} isAlreadyCheckIn={this.isAlreadyCheckIn} currentUserImage={this.currentUserImage} screen='MallProfile' navigator={this.props.navigation} headerData={this.mallHeaderData.data} fullData={this.linkData.data} style={style.throwWHP} checkInReward={this._SurpriseRewardCheckInMall.bind(this)} likeMallGetReward={this._SurpriseRewardLikeMall.bind(this)}></MallHomeNewHeader>
                        :
                        null
                }

                {this.selectedPlaceContent !== '' ?
                    (<TabView onChangeTab={(e) => { if (!this._baseFlag) { this.baseAnimateSlideIn(); }; this._tabIndex = e.i; this.forceUpdate(); }} accessible={true} accessibilityLabel={'MallHomeScreenTabView'} tabBarStyle={style.tabBarStyle} tabBarTextStyle={style.tabBarTextStyle} scrollableTabBar tabBarUnderlineStyle={style.tabBarUnderlineStyle} tabBarActiveTextColor={'#000000'} tabBarInactiveTextColor={'#716E6E'} tabBarActiveTextPreset={Text.preset.titleH2B} tabBarInactiveTextPreset={Text.preset.titleH2} style={{ justifyContent: 'flex-start' }} initialPage={0} renderTabBar={() => <DefaultTabBar />}>
                        <ScrollView accessible={true} accessibilityLabel={'MallHomeScreenScrollView'} tabLabel={SGLocalize.translate("mallHomeScreen.tabHighlightsTitle")} scrollEventThrottle={100} onScroll={this.baseOnScrollHandler.bind(this)} onMomentumScrollBegin={this.baseOnMomentumScrollBeginHandler.bind(this)} onScrollEndDrag={this.baseOnScrollEndDragHandler.bind(this)} onMomentumScrollEnd={this.baseOnMomentumScrollEndHandler.bind(this)} showsVerticalScrollIndicator={false}>
                            <TabHighlightsMall ref={this.MallHighlightRef} contentKey={this.selectedPlaceKey} contentData={this.selectedPlaceContent} accessible={true} accessibilityLabel={'MallHomeScreenTabHighlight'} language={this.Language} openExternalApp={this.openExternalApp.bind(this)} imageSetting={this.imageSetting} mallName={this.selectedPlaceContent['fContent' + this.Language.toUpperCase()].fBuildingName} navigator={this.props.navigation} parkingHighlightData={this.parkingHighlightData} salesDiscountData={this.salesDiscountData} hashTagData={this.hashTagData} mostLikedStoreData={this.mostLikedStoreData} mostLikedRestoData={this.mostLikedRestoData} uniqueExperienceData={this.uniqueExperienceData} instagramSpotData={this.instagramSpotData} restoPromoData={this.restoPromoData} storePromoData={this.storePromoData} auctionData={this.auctionData} loyaltyData={this.loyaltyData} placeEventData={this.placeEventData} mallSummaryData={this.mallSummaryData} linkData={this.linkData} lastUpdated={this.parkingLastUpdateTime} style={style.throwWHP} hashTag={this.mallHeaderData.data.fHashTagSale}></TabHighlightsMall>
                        </ScrollView>
                        <View accessible={true} accessibilityLabel={'MallHomeScreenStoreListView'} tabLabel={SGLocalize.translate("mallHomeScreen.tabStoreListTitle")}>
                            { 
                            this.storeRestoFacilityAlreadyMount ?
                            (   this.storeCategoryData.data.length !== 0 && this.storeListData.data.length !== 0 ?
                                    (
                                        <TabStoreList ref={this.StoreListRef} accessible={true} accessibilityLabel={'MallHomeScreenTabStoreList'} placeContentData={this.selectedPlaceContent} imageSetting={this.imageSetting} language={this.Language} navigator={this.props.navigation} storeCategoryData={this.storeCategoryData} mallFloorData={this.mallFloorData} storeListData={this.storeListData} style={style.throwWHP}></TabStoreList>
                                    ) :
                                    (<EmptyDetailView text={SGLocalize.translate('globalText.emptyList')} style={style.throwWHP}></EmptyDetailView>)
                            )
                            : 
                            (<ActivityIndicator style={{marginTop:3*p}} />)
                            }
                        </View>
                        <View accessible={true} accessibilityLabel={'MallHomeScreenRestoListView'} tabLabel={SGLocalize.translate("mallHomeScreen.tabRestoListTitle")}>
                            { 
                                this.storeRestoFacilityAlreadyMount ?
                                (
                                    this.restoCategoryData.data.length !== 0 && this.restoListData.data.length !== 0 ?
                                        (<TabRestoList ref={this.RestoListRef} accessible={true} accessibilityLabel={'MallHomeScreenTabRestoList'} placeContentData={this.selectedPlaceContent} imageSetting={this.imageSetting} language={this.Language} navigator={this.props.navigation} restoCategoryData={this.restoCategoryData} mallFloorData={this.mallFloorData} restoCuisineData={this.restoCuisineData} restoListData={this.restoListData} style={style.throwWHP}></TabRestoList>)
                                        :
                                        (<EmptyDetailView text={SGLocalize.translate('globalText.emptyList')} style={style.throwWHP}></EmptyDetailView>)
                                )
                                : 
                                (<ActivityIndicator style={{marginTop:3*p}} />)
                            }
                        </View>
                        <View accessible={true} accessibilityLabel={'MallHomeScreenFacilityListView'} tabLabel={SGLocalize.translate("mallHomeScreen.tabFacilityListTitle")}>
                            { 
                                this.storeRestoFacilityAlreadyMount ?
                                (
                                    this.facilityCategoryData.data.length !== 0 && this.facilityListData.data.length !== 0 ?
                                    (<TabFacilityList ref={this.FacilityListRef} accessible={true} accessibilityLabel={'MallHomeScreenTabFacilityList'} addViewFacility={this._addViewFacility.bind(this)} contentKey={this.selectedPlaceKey} currentUserData={this.currentUserData} imageSetting={this.imageSetting} language={this.Language} navigator={this.props.navigation} parkingListData={this.parkingListData} facilityCategoryData={this.facilityCategoryData} facilityData={this.facilityListData} mallFloorData={this.mallFloorData} lastUpdated={this.parkingLastUpdateTime.data} style={style.throwWHP}></TabFacilityList>)
                                    :
                                    (<EmptyDetailView text={SGLocalize.translate('globalText.emptyList')} style={style.throwWHP}></EmptyDetailView>)
                                )
                                : 
                                (<ActivityIndicator style={{marginTop:3*p}} />)
                            }
                        </View>
                    </TabView>)
                    :
                    (<ActivityIndicator preset={ActivityIndicator.preset.h1} style={{ flex: 1 }}></ActivityIndicator>)
                }

                <Animated.View style={{ position: 'absolute', transform: [{ translateY: this._baseAnimY.interpolate({ inputRange: [-1, 0], outputRange: [(SGHelperWindow.getStatusBarHeight()), SGHelperWindow.getStatusBarHeight()] }) },], height: SGHelperWindow.getHeaderHeight(), width: '100%' }}>
                    <SimpleSearchBar luxury={luxury} pushScreen accessible={true} accessibilityLabel={'MallHomeScreenSimpleSearchBar'} language={this.Language} buildingKey={this.selectedPlaceKey} placeholder={SGLocalize.translate("mallHomeScreen.searchPlaceholder")} navigator={this.props.navigation} imageSetting={this.imageSetting} currentUser={this.currentUser} style={this.style.throwWHP}></SimpleSearchBar>
                </Animated.View>

                <Animated.View style={{ position: 'absolute', transform: [{ translateY: this._baseAnimY.interpolate({ inputRange: [-1, 0], outputRange: [SGHelperWindow.getWHPNoHeader().h + 8 * p, SGHelperWindow.getWHPNoHeader().h - Math.max(SGHelperWindow.getFooterHeight(), 2 * p) - SGHelperWindow.getHeaderHeight()] }) },], height: Math.max(SGHelperWindow.getFooterHeight(), 2 * p) + SGHelperWindow.getHeaderHeight(), width: '100%' }}>
                    <BottomNavigationContainer accessible={true} accessibilityLabel={'StoreHomeScreenBottomNav'} navigator={this.props.navigation} style={style.throwWHP}></BottomNavigationContainer>
                </Animated.View>
            </RootView>
        );
    }
}
