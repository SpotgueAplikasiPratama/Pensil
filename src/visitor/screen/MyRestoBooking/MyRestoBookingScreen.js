/**
 * 1. Yohanes 01 April 2021
 * - add ErrorHandling
 * * 2. Leon 10-11 Apr 2021
 * - add ErrorHandling
 */
import React from 'react';
import { StyleSheet, Animated } from 'react-native';
import { SGView as View, SGRootView as RootView, SGText as Text, SGTabView as TabView, SGScrollView as ScrollView,SGDialogBox,SGActivityIndicator as ActivityIndicator,SGPopView,SGTouchableOpacity as TouchableOpacity,SGIcon as Icon,SGPicker as Picker,SGFlatList as FlatList,SGIconButton as IconButton } from '../../../core/control';
import { ModuleHeader } from '../../component_V2/ModuleHeader';
import { SGBaseScreen } from '../../../core/screen/SGBaseScreen';
import { BottomNavigationContainer } from '../../component_V2/BottomNavigationContainer';
import { RibbonHeader } from '../../component_V2/RibbonHeader';
import { TabMyOrderMenu } from '../../container_V2/TabMyOrderMenu';
import { TabMyWaitingList } from '../../container_V2/TabMyWaitingList';
import { TabMyReservation } from '../../container_V2/TabMyReservation';
import { SGLocalize } from '../../locales/SGLocalize';
import { SGHelperNavigation, SGHelperGlobalVar, SGHelperType, SGHelperWindow,SGHelperErrorHandling } from '../../../core/helper';
import { tbVWaitingListAPI } from '../../api/tbVWaitingListAPI';
import { tbVReservationAPI } from '../../api/tbVReservationAPI';
import { tbVOrderMenuAPI } from '../../api/tbVOrderMenuAPI';
import { BackMenuBar } from '../../component_V2/BackMenuBar';
import {VMallProfileAPI} from '../../api/VMallProfileAPI';
import { filterDAO } from '../../db/filterDAO';
import { sortDAO } from '../../db/sortDAO';
import {DefaultTenantCard} from '../../container_V2/DefaultTenantCard';
import idJSON from '../../locales/id.json';
import enJSON from '../../locales/en.json';
import cnJSON from '../../locales/cn.json';
import { tbLookupDAO } from '../../db/tbLookupDAO'

export class MyRestoBookingScreen extends SGBaseScreen {


    getDataFilterHistoryOrderMenu() {
        return ([
            { name: 'fStatus', operator: 'IN', value: ["cancelled", "done", "completed"], visible: false },
            { name: 'fUserID', operator: '=', value: this.currentUserData.fID, visible: false },
        ]);
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

    getSortDataHistory() {
        return ([
            { name: 'ordermenufLastModifiedDate', descending: true, selected: true, visible: false },
            { name: 'ordermenufID', descending: false, selected: true, visible: false },
        ]);
    }

   

    //Reservation 
    getFilterOnGoingData() {
        return ([
            { name: 'fStatus', operator: '=', value: 'waiting', visible: false },
            { name: 'reservationfCreatedByID', operator: '=', value: this.currentUserData.fID, visible: false },
        ]);
    }

    getFilterHistoryData() {
        return ([
            { name: 'fStatus', operator: 'IN', value: ['done', 'cancel'], visible: false },
            { name: 'reservationfCreatedByID', operator: '=', value: this.currentUserData.fID, visible: false },
        ]);
    }

    getSortReservationDataOnGoing() {
        return ([
            { name: 'fBookDateTime', descending: false, selected: true, visible: false },
            { name: 'reservationfID', descending: false, selected: true, visible: false },
        ]);
    }

    getSortReservationDataHistory() {
        return ([
            { name: 'fBookDateTime', descending: true, selected: true, visible: false },
            { name: 'reservationfID', descending: false, selected: true, visible: false },
        ]);
    }

    // Waiting List
    getFilterDataWaiting() {
        return ([

            { name: 'fStatus', operator: 'IN', value: ['waiting', 'called'], visible: false },
            { name: 'waitingfCreatedByID', operator: '=', value: this.currentUserData.fID, visible: false },
            // { name: 'fBookDateTime', operator: '>=', value: SGHelperType.startDay(), visible: false },
            // { name: 'fBookDateTime', operator: '<=', value: SGHelperType.endDay(), visible: false },
        ]);
    }

    getFilterDataWaitingHistory() {
        return ([
            { name: 'fStatus', operator: 'IN', value: ['done', 'cancel'], visible: false },
            { name: 'waitingfCreatedByID', operator: '=', value: this.currentUserData.fID, visible: false },
        ]);
    }

    getSortWaitingDataActive() {
        return ([
            { name: 'fBookDateTime', descending: false, selected: true, visible: false },
            { name: 'waitingfID', descending: false, selected: true, visible: false },
        ])
    }

    getSortWaitingDataHistory() {
        return ([
            { name: 'fBookDateTime', descending: true, selected: true, visible: false },
            { name: 'waitingfID', descending: false, selected: true, visible: false },
        ])
    }

    getBottomNavigationState() {
        return ({ active1: false, active2: false, active3: false, active4: true, active5: false });
    }

    getPagingWaitingList(){
        var itemPerPage = SGHelperType.getPaging()
        return {paging:true,offset:this.pagingCounterWaitingList, totalPerPage:itemPerPage}
    }
    getPagingWaitingListHistory(){
        var itemPerPage = SGHelperType.getPaging()
        return {paging:true,offset:this.pagingCounterWaitingListHistory, totalPerPage:itemPerPage}
    }

    getPagingReservation(){
        var itemPerPage = SGHelperType.getPaging()
        return {paging:true,offset:this.pagingCounterReservation, totalPerPage:itemPerPage}
    }
    getPagingReservationHistory(){
        var itemPerPage = SGHelperType.getPaging()
        return {paging:true,offset:this.pagingCounterReservationHistory, totalPerPage:itemPerPage}
    }

    getPagingOrderMenu(){
        var itemPerPage = SGHelperType.getPaging()
        return {paging:true,offset:this.pagingCounterOrderMenu, totalPerPage:itemPerPage}
    }
    getPagingOrderMenuHistory(){
        var itemPerPage = SGHelperType.getPaging()
        return {paging:true,offset:this.pagingCounterOrderMenuHistory, totalPerPage:itemPerPage}
    }

    getPagingQuickButtonWaitingListData(){
        var itemPerPage = SGHelperType.getPaging()
        return {paging:true,offset:this.pagingCounterQuickButtonWaitingList, totalPerPage:itemPerPage}
    }

    getPagingQuickButtonReservationData(){
        var itemPerPage = SGHelperType.getPaging()
        return {paging:true,offset:this.pagingCounterQuickButtonReservation, totalPerPage:itemPerPage}
    }

    getPagingQuickButtonOrderMenuData(){
        var itemPerPage = SGHelperType.getPaging()
        return {paging:true,offset:this.pagingCounterQuickButtonOrderMenu, totalPerPage:itemPerPage}
    }

    getPagingQuickButtonWaitingListDataBrand(){
        var itemPerPage = SGHelperType.getPaging()
        return {paging:true,offset:this.pagingCounterQuickButtonWaitingListBrand, totalPerPage:itemPerPage}
    }

    getPagingQuickButtonReservationDataBrand(){
        var itemPerPage = SGHelperType.getPaging()
        return {paging:true,offset:this.pagingCounterQuickButtonReservationBrand, totalPerPage:itemPerPage}
    }

    getPagingQuickButtonOrderMenuDataBrand(){
        var itemPerPage = SGHelperType.getPaging()
        return {paging:true,offset:this.pagingCounterQuickButtonOrderMenuBrand, totalPerPage:itemPerPage}
    }
    createStyleSheet = (whp) => {
        var { w, h, p } = whp;
        return StyleSheet.create({
            throwWHP: { width:w, height: h, padding: p },
            throwWHPTenantCard:{width:w*0.9, height: h, padding: p },
            mainView1: { width: w, height: h, backgroundColor: 'white', justifyContent: 'flex-start', },
            containerView1: { width: w, height: w, padding: p, backgroundColor: 'white' },
            tabs1: { elevation: 3, backgroundColor: 'red' },
            text1: { alignSelf: 'flex-start', paddingLeft: 4 * p },
            containerView3: { width: w, height: h, padding: p },
            scrollView1: { width: w, },
            fab: { width: w * 0.14, height: w * 0.14, padding: 0 },
            sv1: { backgroundColor: 'white' },
            sv1_2: { backgroundColor: 'white', justifyContent: 'flex-start', alignItems: 'center', },
            ribbonHeader: { marginTop: -p, marginBottom: -2 * p },
            tabBarStyle: { borderColor: '#E7E7E7', borderTopWidth: w * 0.003, borderBottomWidth: w * 0.003, width:w },
            tabBarUnderlineStyle: { backgroundColor: '#1E1E1E' },
            vPopView1: { backgroundColor:'white',width:w*0.9,height:w*1.7,alignItems:'center',justifyContent:'flex-start',borderRadius:5*p },
            vfab: { backgroundColor: 'transparent', width: w * 0.17, height: w * 0.17, position: 'absolute', bottom: w*0.02, right: w * 0.015, borderRadius: w * 0.6 },
            vClose: {position:'absolute', right:3*p,top:2*p, backgroundColor: 'rgb(38,38,38)', color: 'white', borderRadius: 5*p },
            picker: {width:w*0.4},
        });

    }

    constructor(props, context, ...args) {
        super(props, context, ...args);
        this.style = this.createStyleSheet(this.WHP);
        this.props.navigation.setOptions({
            headerShown: false,
        });

        this.currentUser = SGHelperGlobalVar.getVar('GlobalCurrentUser');
        this.currentUserData = SGHelperGlobalVar.getVar('GlobalCurrentUserData');
        this.imageSetting = SGHelperGlobalVar.getVar('GlobalImageSetting');
        this.currentUserImage = SGHelperGlobalVar.getVar('GlobalCurrentUserImage');
        this.currency = SGHelperGlobalVar.getVar('GlobalCurrency');

        // order menu
        this.dataFilterActive = this.getDataFilterActiveOrderMenuActive();
        this._dataFilterHistory = this.getDataFilterHistoryOrderMenu();
        this._dataSortActive = this.getSortDataActive();
        this._dataSortHistory = this.getSortDataHistory();

        // reservation
        this.filterReservationActive = this.getFilterOnGoingData();
        this.filterReservationHistory = this.getFilterHistoryData();
        this.sortReservationActive = this.getSortReservationDataOnGoing();
        this.sortReservationHistory = this.getSortReservationDataHistory();

        // waiting list
        this.filterWaitingData = this.getFilterDataWaiting();
        this.sortWaitingData = this.getSortWaitingDataActive();
        this.filterWaitingDataHistory = this.getFilterDataWaitingHistory();
        this.sortWaitingDataHistory = this.getSortWaitingDataHistory();

       

        this.alreadyMount = false;
        this.state = { 
            filterActive: this._dataFilterActive, filterHistory: this._dataFilterHistory, 
            sortActive: this.sortActive, sortHistory: this._dataSortHistory, 
            filterActiveReservation: this.filterReservationActive, sortReservationActive: this.sortReservationActive, 
            filterHistoryReservation: this.filterReservationHistory, sortReservationHistory: this.sortReservationHistory, 
            filterWaiting: this.filterWaitingData, sortWaiting: this.sortWaitingData, 
            filterWaitingHistory: this.filterWaitingDataHistory, sortWaitingHistory: this.sortWaitingDataHistory,

            refreshWaitingList:false,refreshWaitingListHistory:false,
            refreshReservation:false,refreshReservationHistory:false, 
            refreshOrderMenu:false,refreshOrderMenuHistory:false,
            refreshAll:false,

            loadingWaitingList:false,loadingWaitingListHistory:false,
            loadingReservation:false,loadingReservationHistory:false,
            loadingOrderMenu:false,loadingOrderMenuHistory:false,
          

            stopPullingWaitingList:false,stopPullingWaitingListHistory:false,
            stopPullingReservation:false,stopPullingReservationHistory:false,
            stopPullingOrderMenu:false,stopPullingOrderMenuHistory:false,
           

            refreshQuickButtonWaitingList:false,loadingQuickButtonWaitingList:false,
            stopPullingQuickButtonWaitingList:false,
            refreshQuickButtonWaitingListBrand:false,loadingQuickButtonWaitingListBrand:false,
            stopPullingQuickButtonWaitingListBrand:false,

            refreshQuickButtonReservation:false,loadingQuickButtonReservation:false,
            stopPullingQuickButtonReservation:false,
            refreshQuickButtonReservationBrand:false,loadingQuickButtonReservationBrand:false,
            stopPullingQuickButtonReservationBrand:false,

            refreshQuickButtonOrderMenu:false,loadingQuickButtonOrderMenu:false,
            stopPullingQuickButtonOrderMenu:false,
            refreshQuickButtonOrderMenuBrand:false,loadingQuickButtonOrderMenuBrand:false,
            stopPullingQuickButtonOrderMenuBrand:false,

        };

        this.refreshWaitingList = false
        this.refreshWaitingListHistory = false
        this.refreshReservation = false
        this.refreshReservationHistory = false
        this.refreshOrderMenu = false
        this.refreshOrderMenuHistory = false
      

        this.refreshQuickButtonWaitingList = false
        this.refreshQuickButtonReservation = false
        this.refreshQuickButtonOrderMenu = false;
        this.refreshQuickButtonWaitingListBrand = false
        this.refreshQuickButtonReservationBrand = false
        this.refreshQuickButtonOrderMenuBrand = false;

        this.pagingCounterWaitingList = 0
        this.pagingCounterWaitingListHistory = 0
        this.pagingCounterReservation = 0
        this.pagingCounterReservationHistory = 0
        this.pagingCounterOrderMenu = 0
        this.pagingCounterOrderMenuHistory = 0

        this.pagingCounterQuickButtonWaitingList = 0;
        this.pagingCounterQuickButtonReservation = 0;
        this.pagingCounterQuickButtonOrderMenu = 0;
        this.pagingCounterQuickButtonWaitingListBrand = 0;
        this.pagingCounterQuickButtonReservationBrand = 0;
        this.pagingCounterQuickButtonOrderMenuBrand = 0;

        this.counterBatch=0
        this.errorBatch = []
        
        try {
            this.props.route.params.initialPageCounter?this.initialPageCounter = this.props.route.params.initialPageCounter : this.initialPageCounter = 0
        } catch {
            this.initialPageCounter = 0
        }

        this.pvIDWaitingList = SGPopView.getPopViewID();
        this.pvIDReservation = SGPopView.getPopViewID();
        this.pvIDOrderMenu = SGPopView.getPopViewID();
        this.buildingList = [];
        this.brandList =[];

        this.listWaitingListQuickButtonData = [];
        this.listReservationQuickButtonData = [];
        this.listOrderMenuQuickButtonData = [];
        this.listWaitingListQuickButtonDataBrand = [];
        this.listReservationQuickButtonDataBrand = [];
        this.listOrderMenuQuickButtonDataBrand = [];

        this.quickButtonWaitinglistMount = false;
        this.quickButtonReservationMount = false;
        this.quickButtonOrderMenuMount = false;

        this._tabIndex = 0;

    }

    async componentDidMount() {
        await this._onRefreshAllItem(true);
        this._unsubscribe = this.props.navigation.addListener('focus', async () => {
            await this._onRefreshAllItem(true);
        });
    }

    async _callBackForUpdate() {
        await this._onRefreshAllItem(true);
    }

    checkAPIBatchStatusAllDone() { 
        this.counterBatch=0
        this.pagingCounterWaitingList = this.dataWaiting.length;
        this.pagingCounterWaitingListHistory = this.dataWaitingHistory.length;
        this.pagingCounterReservation = this.dataReservationActive.length;
        this.pagingCounterReservationHistory =  this.dataReservationHistory.length;
        this.pagingCounterOrderMenu = this.dataActive.length;
        this.pagingCounterOrderMenuHistory = this.dataHistory.length;
       

        this.alreadyMount = true;
        this.setState({ filterActive: this._dataFilterActive, filterHistory: this._dataFilterHistory, sortActive: this.sortActive, sortHistory: this._dataSortHistory, 
            filterActiveReservation: this.filterReservationActive, sortReservationActive: this.sortReservationActive, filterHistoryReservation: this.filterReservationHistory, sortReservationHistory: this.sortReservationHistory, 
            filterWaiting: this.filterWaitingData, sortWaiting: this.sortWaitingData, filterWaitingHistory: this.filterWaitingDataHistory, sortWaitingHistory: this.sortWaitingDataHistory,
            refreshWaitingList:false,refreshWaitingListHistory:false,
            refreshReservation:false,refreshReservationHistory:false, 
            refreshOrderMenu:false,refreshOrderMenuHistory:false,
        })
        
        this.forceUpdate();
    }

    _onFirstRefreshQuickButtonAllDone(type){
        this.selectedPlace = SGHelperGlobalVar.getVar('GlobalLastSelectedPlace');
        this.selectedBrand = SGHelperGlobalVar.getVar('GlobalLastSelectedBrand');

        if(this.selectedPlace.key == ""){
             this._setSelectedOption(this.buildingList[0].key,type)
        }else{
            this._setSelectedOption(this.selectedPlace.key,type)
        }

        // if(!SGHelperGlobalVar.isVar('GlobalLastSelectedBrand')){
        //     this._setSelectedBrandOption(this.brandList[0].key,type)
        // }else{
        //     this._setSelectedBrandOption(this.selectedPlace.key,type)
        // }
        this.forceUpdate();
    }

    async _onFirstRefreshQuickButton(type){

        this.baseInitAPIParallel(SGHelperGlobalVar.getVar("ResponTimes"), (() => { this._onFirstRefreshQuickButtonAllDone(type); }).bind(this));

        this.baseAddAPIParallel('getBuildingListContent', (async (v1) => {  return VMallProfileAPI.getBuildingListContent(v1) }).bind(this,this._language.toUpperCase()), (async (v) => {           
            this.buildingList = v;
            console.log('building list')
            console.log(this.buildingList)
        }).bind(this),  null);

        this.baseAddAPIParallel('getBrandListContent', (async (v1) => {  return VMallProfileAPI.getBrandListContent(v1) }).bind(this,this._language.toUpperCase()), (async (v) => {           
            this.brandList = v;
            console.log('brand list')
            console.log(this.brandList)
        }).bind(this),  null);

        this.baseRunAPIParallel();

    }

    async _onRefreshQuickButtonWaitingList(resetPaging = false){
        if(resetPaging){
            this.setState({ refreshQuickButtonWaitingList: true })
            this.pagingCounterQuickButtonWaitingList = 0
            this._filterDataWL = filterDAO.getQuickButtonMyRestoBooking(this.selectedOption);
            this._sortDataWL = sortDAO.getQuickButtonMyRestoBookingSortData(this._language.toUpperCase());
            this.pagingQuickButtonWaitingList = this.getPagingQuickButtonWaitingListData()
            console.log('---- here')
            this.baseRunSingleAPIWithRedoOption('SearchWaitingListMyBookingTenantList', (async (v1,v2,v3) => {  return tbVWaitingListAPI.SearchWaitingListMyBookingTenantList(v1,v2,v3) }).bind(this,this._filterDataWL,this._sortDataWL,this.pagingQuickButtonWaitingList), ((v) => { 
                console.log('-- here 2')
                this.listWaitingListQuickButtonData = v;
                console.log('this.listWaitingListQuickButtonData')
                console.log(this.listWaitingListQuickButtonData)
                if(v.length<SGHelperType.getPaging())this.setState({stopPullingQuickButtonWaitingList:true})
                else this.setState({stopPullingQuickButtonWaitingList:false})
                this.pagingCounterQuickButtonWaitingList = this.listWaitingListQuickButtonData.length
                this.setState({ refreshQuickButtonWaitingList: false });
                this.quickButtonWaitinglistMount = true;
                this.forceUpdate();
            }).bind(this), (()=>{this.setState({ refreshQuickButtonWaitingList: false,stopPullingQuickButtonWaitingList:false }) }), SGHelperGlobalVar.getVar("ResponTimes"));
        }else{
            this.forceUpdate()
        }
    }

    async _onRefreshQuickButtonWaitingListBrand(resetPaging = false){
        // console.log('run refresh quick button brand waiting list')
        // console.log(resetPaging);
        if(resetPaging){
            this.setState({ refreshQuickButtonWaitingListBrand: true })
            this.pagingCounterQuickButtonWaitingListBrand = 0
            this._filterDataWLBrand = filterDAO.getQuickButtonMyRestoBookingBrand(this.selectedBrandOption);
            this._sortDataWLBrand = sortDAO.getQuickButtonMyRestoBookingSortDataBrand(this._language.toUpperCase());
            this.pagingQuickButtonWaitingListBrand = this.getPagingQuickButtonWaitingListDataBrand()

            this.baseRunSingleAPIWithRedoOption('SearchWaitingListMyBookingTenantListBrand', (async (v1,v2,v3) => {  return tbVWaitingListAPI.SearchWaitingListMyBookingTenantListBrand(v1,v2,v3) }).bind(this,this._filterDataWLBrand,this._sortDataWLBrand,this.pagingQuickButtonWaitingListBrand), ((v) => { 
                this.listWaitingListQuickButtonDataBrand = v;
                if(v.length<SGHelperType.getPaging())this.setState({stopPullingQuickButtonWaitingListBrand:true})
                else this.setState({stopPullingQuickButtonWaitingListBrand:false})
                this.pagingCounterQuickButtonWaitingListBrand = this.listWaitingListQuickButtonDataBrand.length
                this.setState({ refreshQuickButtonWaitingListBrand: false });
                this.quickButtonWaitinglistMount = true;
                this.forceUpdate();
            }).bind(this), (()=>{this.setState({ refreshQuickButtonWaitingListBrand: false,stopPullingQuickButtonWaitingListBrand:false }) }), SGHelperGlobalVar.getVar("ResponTimes"));
        }else{
            this.forceUpdate()
        }
    }


    async _onLoadQuickButtonWaitingList(){
        console.log('onLoad ----')
        if(!this.state.loadingQuickButtonWaitingList && !this.state.stopPullingQuickButtonWaitingList){
            console.log("_OnLoad")
            this.setState({loadingQuickButtonWaitingList:true})
            this._filterDataWL = filterDAO.getQuickButtonMyRestoBooking(this.selectedOption);
            this._sortDataWL = sortDAO.getQuickButtonMyRestoBookingSortData(this._language.toUpperCase());
            this.pagingQuickButtonWaitingList = this.getPagingQuickButtonWaitingListData()
            this.baseRunSingleAPIWithRedoOption('SearchWaitingListMyBookingTenantList', (async (v1,v2,v3) => {  return tbVWaitingListAPI.SearchWaitingListMyBookingTenantList(v1,v2,v3) }).bind(this,this._filterDataWL,this._sortDataWL,this.pagingQuickButtonWaitingList), ((v) => { 
                var resData = v
                console.log(resData);
                if(resData.length!==0){
                    for(var i=0;i<resData.length;i++){
                        this.listWaitingListQuickButtonData.push(resData[i])
                    }
                    this.pagingCounterQuickButtonWaitingList = this.pagingCounterQuickButtonWaitingList + resData.length
                } else this.setState({stopPullingQuickButtonWaitingList:true})
               
                this.setState({loadingQuickButtonWaitingList:false})
                console.log(this.state.loadingQuickButtonWaitingList)
            }).bind(this),  (()=>{this.setState({ refreshQuickButtonWaitingList: false });}),  SGHelperGlobalVar.getVar("ResponTimes"));
        }
    }

    async _onLoadQuickButtonWaitingListBrand(){
        console.log('onLoad ----')
        if(!this.state.loadingQuickButtonWaitingListBrand && !this.state.stopPullingQuickButtonWaitingListBrand){
            console.log("_OnLoad")
            this.setState({loadingQuickButtonWaitingListBrand:true})
            this._filterDataWLBrand = filterDAO.getQuickButtonMyRestoBookingBrand(this.selectedBrandOption);
            this._sortDataWLBrand = sortDAO.getQuickButtonMyRestoBookingSortDataBrand(this._language.toUpperCase());
            this.pagingQuickButtonWaitingListBrand = this.getPagingQuickButtonWaitingListDataBrand()
            this.baseRunSingleAPIWithRedoOption('SearchWaitingListMyBookingTenantListBrand', (async (v1,v2,v3) => {  return tbVWaitingListAPI.SearchWaitingListMyBookingTenantListBrand(v1,v2,v3) }).bind(this,this._filterDataWLBrand,this._sortDataWLBrand,this.pagingQuickButtonWaitingListBrand), ((v) => { 
                var resData = v
                console.log(resData);
                if(resData.length!==0){
                    for(var i=0;i<resData.length;i++){
                        this.listWaitingListQuickButtonDataBrand.push(resData[i])
                    }
                    this.pagingCounterQuickButtonWaitingListBrand = this.pagingCounterQuickButtonWaitingListBrand + resData.length
                } else this.setState({stopPullingQuickButtonWaitingListBrand:true})
               
                this.setState({loadingQuickButtonWaitingListBrand:false})
                console.log(this.state.loadingQuickButtonWaitingListBrand)
            }).bind(this),  (()=>{this.setState({ refreshQuickButtonWaitingListBrand: false });}),  SGHelperGlobalVar.getVar("ResponTimes"));
        }
    }

    async _onRefreshQuickButtonReservation(resetPaging = false){
        console.log('run refresh quick button reservation')
        // console.log(resetPaging);
        if(resetPaging){
            this.setState({ refreshQuickButtonReservation: true })
            this.pagingCounterQuickButtonReservation = 0
            this._filterDataR = filterDAO.getQuickButtonMyRestoBooking(this.selectedOption);
            this._sortDataR = sortDAO.getQuickButtonMyRestoBookingSortData(this._language.toUpperCase());
            this.pagingQuickButtonReservation = this.getPagingQuickButtonReservationData()
            this.baseRunSingleAPIWithRedoOption('SearchReservationMyBookingTenantList', (async (v1,v2,v3) => {  return tbVReservationAPI.SearchReservationMyBookingTenantList(v1,v2,v3) }).bind(this,this._filterDataR,this._sortDataR,this.pagingQuickButtonReservation), ((v) => { 
                this.listReservationQuickButtonData = v;
                if(v.length<SGHelperType.getPaging())this.setState({stopPullingQuickButtonReservation:true})
                else this.setState({stopPullingQuickButtonReservation:false})
                this.pagingCounterQuickButtonReservation = this.listReservationQuickButtonData.length
                this.setState({ refreshQuickButtonReservation: false });
                this.quickButtonReservationMount = true;
                this.forceUpdate();
            }).bind(this), (()=>{this.setState({ refreshQuickButtonReservation: false,stopPullingQuickButtonReservation:false }) }), SGHelperGlobalVar.getVar("ResponTimes"));
        }else{
            this.forceUpdate()
        }
    }

   
    async _onRefreshQuickButtonReservationBrand(resetPaging = false){
        console.log('run refresh quick button reservation')
        // console.log(resetPaging);
        if(resetPaging){
            this.setState({ refreshQuickButtonReservationBrand: true })
            this.pagingCounterQuickButtonReservationBrand = 0
            this._filterDataRBrand = filterDAO.getQuickButtonMyRestoBookingBrand(this.selectedBrandOption);
            this._sortDataRBrand = sortDAO.getQuickButtonMyRestoBookingSortDataBrand(this._language.toUpperCase());
            this.pagingQuickButtonReservationBrand = this.getPagingQuickButtonReservationDataBrand()
            this.baseRunSingleAPIWithRedoOption('SearchReservationMyBookingTenantListBrand', (async (v1,v2,v3) => {  return tbVReservationAPI.SearchReservationMyBookingTenantListBrand(v1,v2,v3) }).bind(this,this._filterDataRBrand,this._sortDataRBrand,this.pagingQuickButtonReservationBrand), ((v) => { 
                this.listReservationQuickButtonDataBrand = v;
                if(v.length<SGHelperType.getPaging())this.setState({stopPullingQuickButtonReservationBrand:true})
                else this.setState({stopPullingQuickButtonReservationBrand:false})
                this.pagingCounterQuickButtonReservationBrand = this.listReservationQuickButtonDataBrand.length
                this.setState({ refreshQuickButtonReservationBrand: false });
                this.quickButtonReservationMount = true;
                this.forceUpdate();
            }).bind(this), (()=>{this.setState({ refreshQuickButtonReservationBrand: false,stopPullingQuickButtonReservationBrand:false }) }), SGHelperGlobalVar.getVar("ResponTimes"));
        }else{
            this.forceUpdate()
        }
    }

    async _onLoadQuickButtonReservation(){
        console.log('onLoad Reservation----')
        if(!this.state.loadingQuickButtonReservation && !this.state.stopPullingQuickButtonReservation){
            console.log("_OnLoad Reservation")
            this.setState({loadingQuickButtonReservation:true})
            this._filterDataR = filterDAO.getQuickButtonMyRestoBooking(this.selectedOption);
            this._sortDataR = sortDAO.getQuickButtonMyRestoBookingSortData(this._language.toUpperCase());
            this.pagingQuickButtonReservation = this.getPagingQuickButtonReservationData()
            this.baseRunSingleAPIWithRedoOption('SearchReservationMyBookingTenantList', (async (v1,v2,v3) => {  return tbVReservationAPI.SearchReservationMyBookingTenantList(v1,v2,v3) }).bind(this,this._filterDataR,this._sortDataR,this.pagingQuickButtonReservation), ((v) => { 
                var resData = v
                console.log(resData);
                if(resData.length!==0){
                    for(var i=0;i<resData.length;i++){
                        this.listReservationQuickButtonData.push(resData[i])
                    }
                    this.pagingCounterQuickButtonReservation = this.pagingCounterQuickButtonReservation + resData.length
                } else this.setState({stopPullingQuickButtonReservation:true})
                this.setState({loadingQuickButtonReservation:false})
            }).bind(this),  (()=>{this.setState({ refreshQuickButtonReservation: false });}),  SGHelperGlobalVar.getVar("ResponTimes"));
        }
    }

    async _onLoadQuickButtonReservationBrand(){
        console.log('onLoad Reservation----')
        if(!this.state.loadingQuickButtonReservationBrand && !this.state.stopPullingQuickButtonReservationBrand){
            console.log("_OnLoad Reservation")
            this.setState({loadingQuickButtonReservationBrand:true})
            this._filterDataRBrand = filterDAO.getQuickButtonMyRestoBookingBrand(this.selectedBrandOption);
            this._sortDataRBrand = sortDAO.getQuickButtonMyRestoBookingSortDataBrand(this._language.toUpperCase());
            this.pagingQuickButtonReservationBrand = this.getPagingQuickButtonReservationDataBrand()
            this.baseRunSingleAPIWithRedoOption('SearchReservationMyBookingTenantListBrand', (async (v1,v2,v3) => {  return tbVReservationAPI.SearchReservationMyBookingTenantListBrand(v1,v2,v3) }).bind(this,this._filterDataRBrand,this._sortDataRBrand,this.pagingQuickButtonReservationBrand), ((v) => { 
                var resData = v
                console.log(resData);
                if(resData.length!==0){
                    for(var i=0;i<resData.length;i++){
                        this.listReservationQuickButtonDataBrand.push(resData[i])
                    }
                    this.pagingCounterQuickButtonReservationBrand = this.pagingCounterQuickButtonReservationBrand + resData.length
                } else this.setState({stopPullingQuickButtonReservationBrand:true})
                this.setState({loadingQuickButtonReservationBrand:false})
            }).bind(this),  (()=>{this.setState({ refreshQuickButtonReservationBrand: false });}),  SGHelperGlobalVar.getVar("ResponTimes"));
        }
    }

    async _onRefreshQuickButtonOrderMenu(resetPaging = false){
        console.log('run refresh quick button order menu')
        // console.log(resetPaging);
        if(resetPaging){
            this.setState({ refreshQuickButtonOrderMenu: true })
            this.pagingCounterQuickButtonOrderMenu = 0
            this._filterDataOM = filterDAO.getQuickButtonMyRestoBooking(this.selectedOption);
            this._sortDataOM = sortDAO.getQuickButtonMyRestoBookingSortData(this._language.toUpperCase());
            this.pagingQuickButtonOrderMenu = this.getPagingQuickButtonOrderMenuData()
            this.baseRunSingleAPIWithRedoOption('SearchOrderMenuMyBookingTenantList', (async (v1,v2,v3) => {  return tbVOrderMenuAPI.SearchOrderMenuMyBookingTenantList(v1,v2,v3) }).bind(this,this._filterDataOM,this._sortDataOM,this.pagingQuickButtonOrderMenu), ((v) => { 
                this.listOrderMenuQuickButtonData = v;
                if(v.length<SGHelperType.getPaging())this.setState({stopPullingQuickButtonOrderMenu:true})
                else this.setState({stopPullingQuickButtonOrderMenu:false})
                this.pagingCounterQuickButtonOrderMenu = this.listOrderMenuQuickButtonData.length
                this.setState({ refreshQuickButtonOrderMenu: false });
                this.quickButtonOrderMenuMount = true;
                this.forceUpdate();
            }).bind(this), (()=>{this.setState({ refreshQuickButtonOrderMenu: false,stopPullingQuickButtonOrderMenu:false }) }), SGHelperGlobalVar.getVar("ResponTimes"));
        }else{
            this.forceUpdate()
        }
    }

    async _onRefreshQuickButtonOrderMenuBrand(resetPaging = false){
        console.log('run refresh quick button order menu')
        // console.log(resetPaging);
        if(resetPaging){
            this.setState({ refreshQuickButtonOrderMenuBrand: true })
            this.pagingCounterQuickButtonOrderMenuBrand = 0
            this._filterDataOMBrand = filterDAO.getQuickButtonMyRestoBookingBrand(this.selectedBrandOption);
            this._sortDataOMBrand = sortDAO.getQuickButtonMyRestoBookingSortDataBrand(this._language.toUpperCase());
            this.pagingQuickButtonOrderMenuBrand = this.getPagingQuickButtonOrderMenuDataBrand()
            this.baseRunSingleAPIWithRedoOption('SearchOrderMenuMyBookingTenantListBrand', (async (v1,v2,v3) => {  return tbVOrderMenuAPI.SearchOrderMenuMyBookingTenantListBrand(v1,v2,v3) }).bind(this,this._filterDataOMBrand,this._sortDataOMBrand,this.pagingQuickButtonOrderMenuBrand), ((v) => { 
                this.listOrderMenuQuickButtonDataBrand = v;
                if(v.length<SGHelperType.getPaging())this.setState({stopPullingQuickButtonOrderMenuBrand:true})
                else this.setState({stopPullingQuickButtonOrderMenuBrand:false})
                this.pagingCounterQuickButtonOrderMenuBrand = this.listOrderMenuQuickButtonDataBrand.length
                this.setState({ refreshQuickButtonOrderMenuBrand: false });
                this.quickButtonOrderMenuMount = true;
                this.forceUpdate();
            }).bind(this), (()=>{this.setState({ refreshQuickButtonOrderMenuBrand: false,stopPullingQuickButtonOrderMenuBrand:false }) }), SGHelperGlobalVar.getVar("ResponTimes"));
        }else{
            this.forceUpdate()
        }
    }

    async _onLoadQuickButtonOrderMenu(){
        console.log('onLoad Order Menu----')
        if(!this.state.loadingQuickButtonOrderMenu && !this.state.stopPullingQuickButtonOrderMenu){
            console.log("_OnLoad Order Menu")
            this.setState({loadingQuickButtonOrderMenu:true})
            this._filterDataOM = filterDAO.getQuickButtonMyRestoBooking(this.selectedOption);
            this._sortDataOM = sortDAO.getQuickButtonMyRestoBookingSortData(this._language.toUpperCase());
            this.pagingQuickButtonOrderMenu = this.getPagingQuickButtonOrderMenuData()
            this.baseRunSingleAPIWithRedoOption('SearchOrderMenuMyBookingTenantList', (async (v1,v2,v3) => {  return tbVOrderMenuAPI.SearchOrderMenuMyBookingTenantList(v1,v2,v3) }).bind(this,this._filterDataOM,this._sortDataOM,this.pagingQuickButtonOrderMenu), ((v) => { 
                var resData = v
                console.log(resData);
                if(resData.length!==0){
                    for(var i=0;i<resData.length;i++){
                        this.listOrderMenuQuickButtonData.push(resData[i])
                    }
                    this.pagingCounterQuickButtonOrderMenu = this.pagingCounterQuickButtonOrderMenu + resData.length
                } else this.setState({stopPullingQuickButtonOrderMenu:true})
                this.setState({loadingQuickButtonOrderMenu:false})
            }).bind(this),  (()=>{this.setState({refreshQuickButtonOrderMenu: false });}),  SGHelperGlobalVar.getVar("ResponTimes"));
        }
    }

    async _onLoadQuickButtonOrderMenuBrand(){
        console.log('onLoad Order Menu----')
        if(!this.state.loadingQuickButtonOrderMenuBrand && !this.state.stopPullingQuickButtonOrderMenuBrand){
            console.log("_OnLoad Order Menu")
            this.setState({loadingQuickButtonOrderMenuBrand:true})
            this._filterDataOMBrand = filterDAO.getQuickButtonMyRestoBookingBrand(this.selectedBrandOption);
            this._sortDataOMBrand = sortDAO.getQuickButtonMyRestoBookingSortDataBrand(this._language.toUpperCase());
            this.pagingQuickButtonOrderMenuBrand = this.getPagingQuickButtonOrderMenuDataBrand()
            this.baseRunSingleAPIWithRedoOption('SearchOrderMenuMyBookingTenantListBrand', (async (v1,v2,v3) => {  return tbVOrderMenuAPI.SearchOrderMenuMyBookingTenantListBrand(v1,v2,v3) }).bind(this,this._filterDataOMBrand,this._sortDataOMBrand,this.pagingQuickButtonOrderMenuBrand), ((v) => { 
                var resData = v
                console.log(resData);
                if(resData.length!==0){
                    for(var i=0;i<resData.length;i++){
                        this.listOrderMenuQuickButtonDataBrand.push(resData[i])
                    }
                    this.pagingCounterQuickButtonOrderMenuBrand = this.pagingCounterQuickButtonOrderMenuBrand + resData.length
                } else this.setState({stopPullingQuickButtonOrderMenuBrand:true})
                this.setState({loadingQuickButtonOrderMenuBrand:false})
            }).bind(this),  (()=>{this.setState({refreshQuickButtonOrderMenuBrand: false });}),  SGHelperGlobalVar.getVar("ResponTimes"));
        }
    }

    async _setSelectedOption(option,type) {

       
        
        this.selectedOption = option;

        for(var i=0;i<this.buildingList.length;i++){
            if(this.buildingList[i].key == this.selectedOption){
                SGHelperGlobalVar.setVar('GlobalLastSelectedPlace', { key: this.buildingList[i].key, placeNameID: this.buildingList[i].title, placeNameEN: this.buildingList[i].title, placeNameCN: this.buildingList[i].title });
                console.log('setselected')
                console.log(SGHelperGlobalVar.getVar('GlobalLastSelectedPlace'))
                break;
            }
        }
        // console.log('_setSelectedOption')
        // console.log(option)
        // console.log(type)
        // type 1 = waiting list
        // type 2 = reservation
        // type 3 = order menu
        console.log('set selected option!!!!')
        console.log(type)
        if(type == 1){
            await this._onRefreshQuickButtonWaitingList(true);
        }else if(type ==2){
            await this._onRefreshQuickButtonReservation(true);
        }
        else if(type ==3){
            await this._onRefreshQuickButtonOrderMenu(true);
        }
    }

    async _setSelectedBrandOption(option,type) {
        this.selectedBrandOption = option;

        for(var i=0;i<this.brandList.length;i++){
            if(this.brandList[i].key == this.selectedBrandOption){
                SGHelperGlobalVar.setVar('GlobalLastSelectedBrand', { key: this.brandList[i].key, brandNameID: this.brandList[i].title, brandNameEN: this.brandList[i].title, brandNameCN: this.brandList[i].title });
                console.log('selected brand')
                console.log(SGHelperGlobalVar.getVar('GlobalLastSelectedBrand'))
                break;
            }
        }
        console.log('_setSelectedBrandOption')
        console.log(option)
        console.log(type);
        // type 1 = waiting list
        // type 2 = reservation
        // type 3 = order menu
        if(type == 1){
            await this._onRefreshQuickButtonWaitingListBrand(true);
        }else if(type ==2){
            await this._onRefreshQuickButtonReservationBrand(true);
        }
        else if(type ==3){
            await this._onRefreshQuickButtonOrderMenuBrand(true);
        }
    }

    async _onRefreshAllItem(resetPaging = false) {

        if(resetPaging){

            this.pagingCounterWaitingList = 0
            this.pagingCounterWaitingListHistory = 0
            this.pagingCounterReservation = 0
            this.pagingCounterReservationHistory = 0
            this.pagingCounterOrderMenu = 0
            this.pagingCounterOrderMenuHistory = 0
          


            this.pagingWaitingList = this.getPagingWaitingList();
            this.pagingWaitingListHistory = this.getPagingWaitingListHistory();
            this.pagingReservation = this.getPagingReservation();
            this.pagingReservationHistory = this.getPagingReservationHistory();
            this.pagingOrderMenu = this.getPagingOrderMenu();
            this.pagingOrderMenuHistory = this.getPagingOrderMenuHistory();
           

            this.baseInitAPIParallel(SGHelperGlobalVar.getVar("ResponTimes"), (() => { this.checkAPIBatchStatusAllDone(); }).bind(this));

            this.baseAddAPIParallel('searchWaitingListMyBookingVisitor', (async (v1,v2,v3) => { return tbVWaitingListAPI.searchWaitingListMyBookingVisitor(v1,v2,v3); }).bind(this,this.filterWaitingData, this.sortWaitingData,this.pagingWaitingList), ((v) => {
                this.dataWaiting = v;
                if(v.length<SGHelperType.getPaging())this.setState({stopPullingWaitingList:true})
                else this.setState({stopPullingWaitingList:false})
            }).bind(this),  null);

            this.baseAddAPIParallel('searchWaitingListMyBookingVisitor', (async (v1,v2,v3) => { return tbVWaitingListAPI.searchWaitingListMyBookingVisitor(v1,v2,v3); }).bind(this,this.filterWaitingDataHistory, this.sortWaitingDataHistory,this.pagingWaitingListHistory), ((v) => {
                this.dataWaitingHistory = v;
                if(v.length<SGHelperType.getPaging())this.setState({stopPullingWaitingListHistory:true})
                else this.setState({stopPullingWaitingListHistory:false})
            }).bind(this),  null);

            this.baseAddAPIParallel('searchReservationMyBookingVisitor', (async (v1,v2,v3) => { return tbVReservationAPI.searchReservationMyBookingVisitor(v1,v2,v3); }).bind(this,this.filterReservationActive, this.sortReservationActive, this.pagingReservation), ((v) => {
                this.dataReservationActive = v;
                if(v.length<SGHelperType.getPaging())this.setState({stopPullingReservation:true})
                else this.setState({stopPullingReservation:false})
            }).bind(this),  null);

            this.baseAddAPIParallel('searchReservationMyBookingVisitor', (async (v1,v2,v3) => { return tbVReservationAPI.searchReservationMyBookingVisitor(v1,v2,v3); }).bind(this,this.filterReservationHistory, this.sortReservationHistory,this.pagingReservationHistory), ((v) => {
                this.dataReservationHistory = v;
                if(v.length<SGHelperType.getPaging())this.setState({stopPullingWaitingListHistory:true})
                else this.setState({stopPullingWaitingListHistory:false})
            }).bind(this),  null);

            this.baseAddAPIParallel('searchOrderMenuMyBookingVisitor', (async (v1,v2,v3) => { return tbVOrderMenuAPI.searchOrderMenuMyBookingVisitor(v1,v2,v3); }).bind(this,this.dataFilterActive, this._dataSortActive,this.pagingOrderMenu), ((v) => {
                this.dataActive = v;
                if(v.length<SGHelperType.getPaging())this.setState({stopPullingOrderMenu:true})
                else this.setState({stopPullingOrderMenu:false})
            }).bind(this),  null);

            this.baseAddAPIParallel('searchOrderMenuMyBookingVisitor', (async (v1,v2,v3) => { return tbVOrderMenuAPI.searchOrderMenuMyBookingVisitor(v1,v2,v3); }).bind(this,this._dataFilterHistory, this._dataSortHistory,this.pagingOrderMenuHistory), ((v) => {
                this.dataHistory = v;
                if(v.length<SGHelperType.getPaging())this.setState({stopPullingOrderMenuHistory:true})
                else this.setState({stopPullingOrderMenuHistory:false})
            }).bind(this),  null);

            this.baseRunAPIParallel();
        }  else {
            this.forceUpdate();
        }
    }

    async _onRefreshWaitingList() {
        this.setState({ refreshWaitingList: true ,stopPullingWaitingList:true})
        if(!this.refreshWaitingList && !this.state.loadingWaitingList){
            this.refreshWaitingList= true
            this.pagingCounterWaitingList = 0
            this.pagingWaitingList = this.getPagingWaitingList();


            this.baseRunSingleAPIWithRedoOption('searchWaitingListMyBookingVisitor', (async (v1,v2,v3) => { return tbVWaitingListAPI.searchWaitingListMyBookingVisitor(v1,v2,v3) }).bind(this,this.filterWaitingData, this.sortWaitingData,this.pagingWaitingList), ((v) => {
            this.dataWaiting = v
            this.pagingCounterWaitingList = this.dataWaiting.length
            if(v.length<SGHelperType.getPaging())this.setState({stopPullingWaitingList:true})
            else this.setState({stopPullingWaitingList:false})
            this.refreshWaitingList=false
            this.setState({ refreshWaitingList: false});
            this.forceUpdate()
            }).bind(this), null,SGHelperGlobalVar.getVar("ResponTimes") );
        }
    }

    async _onRefreshWaitingListHistory() {
        this.setState({ refreshWaitingListHistory: true ,stopPullingWaitingListHistory:true})
        if(!this.refreshWaitingListHistory && !this.state.loadingWaitingListHistory){
            this.refreshWaitingListHistory= true
            this.pagingCounterWaitingListHistory = 0
            this.pagingWaitingListHistory = this.getPagingWaitingListHistory();


            this.baseRunSingleAPIWithRedoOption('searchWaitingListMyBookingVisitor', (async (v1,v2,v3) => { return tbVWaitingListAPI.searchWaitingListMyBookingVisitor(v1,v2,v3) }).bind(this,this.filterWaitingDataHistory, this.sortWaitingDataHistory,this.pagingWaitingListHistory), ((v) => {
            this.dataWaitingHistory = v
            console.log('length')
            console.log(this.dataWaitingHistory);
            this.pagingCounterWaitingListHistory = this.dataWaitingHistory.length
            if(v.length<SGHelperType.getPaging())this.setState({stopPullingWaitingListHistory:true})
            else this.setState({stopPullingWaitingListHistory:false})
            this.refreshWaitingListHistory =false
            this.setState({ refreshWaitingListHistory: false});
            this.forceUpdate()
            }).bind(this), null,SGHelperGlobalVar.getVar("ResponTimes") );
        }
    }

    async _onRefreshReservation() {
        this.setState({ refreshReservation: true ,stopPullingReservation:true})
        if(!this.refreshReservation && !this.state.loadingReservation){
            this.refreshReservation= true
            this.pagingCounterReservation = 0
            this.pagingReservation = this.getPagingReservation();


            this.baseRunSingleAPIWithRedoOption('searchReservationMyBookingVisitor', (async (v1,v2,v3) => { return tbVReservationAPI.searchReservationMyBookingVisitor(v1,v2,v3) }).bind(this,this.filterReservationActive, this.sortReservationActive, this.pagingReservation), ((v) => {
            this.dataReservationActive = v
            this.pagingCounterReservation = this.dataReservationActive.length
            if(v.length<SGHelperType.getPaging())this.setState({stopPullingReservation:true})
            else this.setState({stopPullingReservation:false})
            this.refreshReservation =false
            this.setState({ refreshReservation: false});
            this.forceUpdate()
            }).bind(this), null,SGHelperGlobalVar.getVar("ResponTimes") );
        }
    }

    async _onRefreshReservationHistory() {
        this.setState({ refreshReservationHistory: true ,stopPullingReservationHistory:true})
        if(!this.refreshReservationHistory && !this.state.loadingReservationHistory){
            this.refreshReservationHistory = true
            this.pagingCounterReservationHistory = 0
            this.pagingReservationHistory = this.getPagingReservationHistory();


            this.baseRunSingleAPIWithRedoOption('searchReservationMyBookingVisitor', (async (v1,v2,v3) => { return tbVReservationAPI.searchReservationMyBookingVisitor(v1,v2,v3) }).bind(this,this.filterReservationHistory, this.sortReservationHistory,this.pagingReservationHistory), ((v) => {
            this.dataReservationHistory = v
            this.pagingCounterReservationHistory = this.dataReservationHistory.length
            if(v.length<SGHelperType.getPaging())this.setState({stopPullingReservationHistory:true})
            else this.setState({stopPullingReservationHistory:false})
            this.refreshReservationHistory =false
            this.setState({ refreshReservationHistory: false});
            this.forceUpdate()
            }).bind(this), null,SGHelperGlobalVar.getVar("ResponTimes") );
        }
    }

    async _onRefreshOrderMenu() {
        this.setState({ refreshOrderMenu: true ,stopPullingOrderMenu:true})
        if(!this.refreshOrderMenu && !this.state.loadingOrderMenu){
            this.refreshOrderMenu = true
            this.pagingCounterOrderMenu = 0
            this.pagingOrderMenu = this.getPagingOrderMenu();


            this.baseRunSingleAPIWithRedoOption('searchOrderMenuMyBookingVisitor', (async (v1,v2,v3) => { return tbVOrderMenuAPI.searchOrderMenuMyBookingVisitor(v1,v2,v3) }).bind(this,this.dataFilterActive, this._dataSortActive,this.pagingOrderMenu), ((v) => {
            this.dataActive = v
            this.pagingCounterOrderMenu = this.dataActive.length
            if(v.length<SGHelperType.getPaging())this.setState({stopPullingOrderMenu:true})
            else this.setState({stopPullingOrderMenu:false})
            this.refreshOrderMenu =false
            this.setState({ refreshOrderMenu: false});
            this.forceUpdate()
            }).bind(this), null,SGHelperGlobalVar.getVar("ResponTimes") );
        }
    }

    async _onRefreshOrderMenuHistory() {
        this.setState({ refreshOrderMenuHistory: true ,stopPullingOrderMenuHistory:true})
        if(!this.refreshOrderMenuHistory && !this.state.loadingOrderMenu){
            this.refreshOrderMenuHistory = true
            this.pagingCounterOrderMenuHistory = 0
            this.pagingOrderMenuHistory = this.getPagingOrderMenuHistory();


            this.baseRunSingleAPIWithRedoOption('searchOrderMenuMyBookingVisitor', (async (v1,v2,v3) => { return tbVOrderMenuAPI.searchOrderMenuMyBookingVisitor(v1,v2,v3) }).bind(this,this._dataFilterHistory, this._dataSortHistory,this.pagingOrderMenuHistory), ((v) => {
            this.dataHistory  = v
            this.pagingCounterOrderMenuHistory = this.dataHistory.length
            if(v.length<SGHelperType.getPaging())this.setState({stopPullingOrderMenuHistory:true})
            else this.setState({stopPullingOrderMenuHistory:false})
            this.refreshOrderMenuHistory =false
            this.setState({ refreshOrderMenuHistory: false});
            this.forceUpdate()
            }).bind(this), null,SGHelperGlobalVar.getVar("ResponTimes") );
        }
    }

   

    async _onLoadWaitingList(){
       
            if(!this.state.loadingWaitingList && !this.state.stopPullingWaitingList){
                this.setState({loadingWaitingList:true})
                this.pagingWaitingList = this.getPagingWaitingList()

                this.baseRunSingleAPIWithRedoOption('searchWaitingListMyBookingVisitor', (async (v1, v2, v3) => { return tbVWaitingListAPI.searchWaitingListMyBookingVisitor(v1, v2, v3) }).bind(this, this.filterWaitingData, this.sortWaitingData,this.pagingWaitingList), ((v) => {           
                var resData =  v//await tbVWaitingListAPI.searchWaitingListMyBookingVisitor(this.filterWaitingData, this.sortWaitingData,this.pagingWaitingList)
                if(resData.length!==0){
                    for(var i=0;i<resData.length;i++){
                        this.dataWaiting.push(resData[i])
                    }
                    this.pagingCounterWaitingList = this.pagingCounterWaitingList + resData.length
                   
                }else this.setState({stopPullingWaitingList:true})
                this.setState({loadingWaitingList:false})
                
            }).bind(this), (()=>{ this.setState({loadingWaitingList:false}) }), SGHelperGlobalVar.getVar("ResponTimes"));
            }
        }

    async _onLoadWaitingListHistory(){
       
            if(!this.state.loadingWaitingListHistory && !this.state.stopPullingWaitingListHistory){
                this.setState({loadingWaitingListHistory:true})
                this.pagingWaitingListHistory = this.getPagingWaitingListHistory()

                this.baseRunSingleAPIWithRedoOption('searchWaitingListMyBookingVisitor', (async (v1, v2, v3) => {  return tbVWaitingListAPI.searchWaitingListMyBookingVisitor(v1, v2, v3) }).bind(this, this.filterWaitingDataHistory, this.sortWaitingDataHistory,this.pagingWaitingListHistory), ((v) => {           
                var resData =  v//await tbVWaitingListAPI.searchWaitingListMyBookingVisitor(this.filterWaitingDataHistory, this.sortWaitingDataHistory,this.pagingWaitingListHistory)
                console.log('length')
                console.log(resData.length);
                if(resData.length!==0){
                    for(var i=0;i<resData.length;i++){
                        this.dataWaitingHistory.push(resData[i])
                    }
                    this.pagingCounterWaitingListHistory = this.pagingCounterWaitingListHistory + resData.length
                   
                }else this.setState({stopPullingWaitingListHistory:true})
                this.setState({loadingWaitingListHistory:false})
            }).bind(this), (()=>{ this.setState({loadingWaitingListHistory:false}) }), SGHelperGlobalVar.getVar("ResponTimes"));
            }
    }

    async _onLoadReservation(){
        if(!this.state.loadingReservation && !this.state.stopPullingReservation){
            this.setState({loadingReservation:true})
            this.pagingReservation = this.getPagingReservation()

            this.baseRunSingleAPIWithRedoOption('searchReservationMyBookingVisitor', (async (v1, v2, v3) => {  return tbVReservationAPI.searchReservationMyBookingVisitor(v1, v2, v3) }).bind(this, this.filterReservationActive, this.sortReservationActive, this.pagingReservation), ((v) => {           
                    var resData =  v//await tbVReservationAPI.searchReservationMyBookingVisitor(this.filterReservationActive, this.sortReservationActive, this.pagingReservation)
                    if(resData.length!==0){
                        for(var i=0;i<resData.length;i++){
                            this.dataReservationActive.push(resData[i])
                        }
                        this.pagingCounterReservation = this.pagingCounterReservation + resData.length
                    
                    }else this.setState({stopPullingReservation:true})
                this.setState({loadingReservation:false})
            }).bind(this), (()=>{ this.setState({loadingReservation:false}) }), SGHelperGlobalVar.getVar("ResponTimes"));
        }
    }

    async  _onLoadReservationHistory(){
     
            if(!this.state.loadingReservationHistory && !this.state.stopPullingWaitingListHistory){
                this.setState({loadingReservationHistory:true})
                this.pagingReservationHistory = this.getPagingReservationHistory()

                this.baseRunSingleAPIWithRedoOption('searchReservationMyBookingVisitor', (async (v1, v2, v3) => {  return tbVReservationAPI.searchReservationMyBookingVisitor(v1, v2, v3) }).bind(this, this.filterReservationHistory, this.sortReservationHistory,this.pagingReservationHistory), ((v) => {           
                var resData =  v//await tbVReservationAPI.searchReservationMyBookingVisitor(this.filterReservationHistory, this.sortReservationHistory,this.pagingReservationHistory)
                if(resData.length!==0){
                    for(var i=0;i<resData.length;i++){
                        this.dataReservationHistory.push(resData[i])
                    }
                    this.pagingCounterReservationHistory = this.pagingCounterReservationHistory + resData.length
                   
                }else this.setState({stopPullingReservationHistory:true})
                this.setState({loadingReservationHistory:false})
            }).bind(this), (()=>{ this.setState({loadingReservationHistory:false}) }), SGHelperGlobalVar.getVar("ResponTimes"));
            }
    }
    
    async _onLoadOrderMenu(){
       
            if(!this.state.loadingOrderMenu && !this.state.stopPullingOrderMenu){
                this.setState({loadingOrderMenu:true})
                this.pagingOrderMenu = this.getPagingOrderMenu()

                this.baseRunSingleAPIWithRedoOption('searchOrderMenuMyBookingVisitor', (async (v1, v2, v3) => {  return tbVOrderMenuAPI.searchOrderMenuMyBookingVisitor(v1, v2, v3) }).bind(this, this.dataFilterActive, this._dataSortActive,this.pagingOrderMenu), ((v) => {           
                var resData =  v//await tbVOrderMenuAPI.searchOrderMenuMyBookingVisitor(this.dataFilterActive, this._dataSortActive,this.pagingOrderMenu)
                if(resData.length!==0){
                    for(var i=0;i<resData.length;i++){
                        this.dataActive.push(resData[i])
                    }
                    this.pagingCounterOrderMenu = this.pagingCounterOrderMenu + resData.length
                   
                }else this.setState({stopPullingOrderMenu:true})
                this.setState({loadingOrderMenu:false})
            }).bind(this), (()=>{ this.setState({loadingReservationHistory:false}) }), SGHelperGlobalVar.getVar("ResponTimes"));
            }
    }

    async _onLoadOrderMenuHistory(){
       
            if(!this.state.loadingOrderMenuHistory && !this.state.stopPullingOrderMenuHistory){
                this.setState({loadingOrderMenuHistory:true})
                this.pagingOrderMenuHistory = this.getPagingOrderMenuHistory()

                this.baseRunSingleAPIWithRedoOption('searchOrderMenuMyBookingVisitor', (async (v1, v2, v3) => {  return tbVOrderMenuAPI.searchOrderMenuMyBookingVisitor(v1, v2, v3) }).bind(this, this._dataFilterHistory, this._dataSortHistory,this.pagingOrderMenuHistory), ((v) => {           
                    var resData = v //await tbVOrderMenuAPI.searchOrderMenuMyBookingVisitor(this._dataFilterHistory, this._dataSortHistory,this.pagingOrderMenuHistory)
                    if(resData.length!==0){
                        for(var i=0;i<resData.length;i++){
                            this.dataHistory.push(resData[i])
                        }
                        this.pagingCounterOrderMenuHistory = this.pagingCounterOrderMenuHistory + resData.length
                    
                    }else this.setState({stopPullingOrderMenuHistory:true})
                    this.setState({loadingOrderMenuHistory:false})
                }).bind(this), (()=>{ this.setState({loadingOrderMenuHistory:false}) }), SGHelperGlobalVar.getVar("ResponTimes"));
            }
    }

  

    async _showPopView(type) {
        await this._onFirstRefreshQuickButton(type);

        if(type ==1){
            SGPopView.showPopView(this.pvIDWaitingList);
        }else if(type ==2){
            SGPopView.showPopView(this.pvIDReservation);
        }else if(type ==3){
            SGPopView.showPopView(this.pvIDOrderMenu);
        }
       
    }

    _hidePopView(type) {
        if(type ==1){
            SGPopView.hidePopView(this.pvIDWaitingList);
        }else if(type ==2){
            SGPopView.hidePopView(this.pvIDReservation);
        }
        else if(type ==3){
            SGPopView.hidePopView(this.pvIDOrderMenu);
        }
    }

    _getBuildingName(){
        for(var i=0;i<this.buildingList.length;i++){
            if(this.buildingList[i].key === this.selectedOption){
                return this.buildingList[i].title;
            }
        }
    }

    _getBrandName(){
        for(var i=0;i<this.brandList.length;i++){
            if(this.brandList[i].key === this.selectedBrandOption){
                return this.brandList[i].title;
            }
        }
    }

    _getLikeResource(data) {
        var contentStoreID = data.fContentID;
        var contentStoreEN = data.fContentEN;
        var contentStoreCN = data.fContentCN;
        var contentBuildingID = data.fContentBuildingID;
        var contentBuildingEN = data.fContentBuildingEN;
        var contentBuildingCN = data.fContentBuildingCN;
        return (
            { fContentType: data.fType =='store'? 'Store' :'Resto', fContentKey: data.fID, 
            fText1: { id: contentStoreID.fStoreName, en: contentStoreEN.fStoreName, cn: contentStoreCN.fStoreName }, 
            fText2: { id: idJSON.storeCategory[tbLookupDAO.getLookUpValue(data.storeCategory)], en: enJSON.storeCategory[tbLookupDAO.getLookUpValue(data.storeCategory)], cn: cnJSON.storeCategory[tbLookupDAO.getLookUpValue(data.storeCategory)] }, 
            fText3:{id:contentBuildingID.fBuildingName,en:contentBuildingEN.fBuildingName,cn:contentBuildingCN.fBuildingName},
            fImageID: contentStoreID.fStoreImageJSON, 
            fImageEN: contentStoreEN.fStoreImageJSON, 
            fImageCN: contentStoreCN.fStoreImageJSON, 
            fTargetKey: data.fID }
        )
    }

    _onChangeTab(type){
        console.log('change tab')
        console.log(this.brandList)
        console.log(this.selectedPlace)
        console.log(type)
        console.log(this._tabIndex)
        if(this._tabIndex ==1){
            if(!SGHelperGlobalVar.isVar('GlobalLastSelectedBrand')){
                this._setSelectedBrandOption(this.brandList[0].key,type)
            }else{
                this._setSelectedBrandOption(this.selectedPlace.key,type)
            }
            this.forceUpdate();
        }
       
    }

    render() {
        var { w, h, p } = this.WHP;
        var style = this.style;
        return (
            <RootView dummyStatusBar dummyHeaderBar accessible={true} accessibilityLabel={'MyRestoBookingScreenRootView'} style={style.mainView1}>
                
                {/* PopView Quick Button Waiting List */}
                <SGPopView popViewID={this.pvIDWaitingList} on animationType={'slide'} vPos='Bottom'>
                    <View style={style.vPopView1}>
                    <TabView  onChangeTab={(e) => { this._tabIndex = e.i; this._onChangeTab(1); }}  accessible={true} accessibilityLabel={'PopViewTabView'} tabBarUnderlineStyle={{ backgroundColor: '#181818' }} tabBarActiveTextPreset={Text.preset.h6B} tabBarInactiveTextPreset={Text.preset.h6B}>
                    {this.quickButtonWaitinglistMount ?
                        <View style={style.vPopView1} tabLabel={SGLocalize.translate('globalText.PlacePicker')}>
                            <Picker accessible={true} accessibilityLabel={'QuickButtonWaitingListPicker'} shadowIntensity={0.2} textPreset={Text.preset.h8} single  language={(this._language).toUpperCase()} style={style.picker} shadow optionList={this.buildingList} value={this.selectedOption} onValueChange={(v) => { this._setSelectedOption(v,1);}} />
                            <Text preset={Text.preset.h5B} style={{alignSelf:'flex-start',marginLeft:3*p,marginTop:2*p}}>{this._getBuildingName()}</Text>
                            {this.listWaitingListQuickButtonData.length !== 0 ?
                                <FlatList refreshing={this.state.refreshQuickButtonWaitingList} onRefresh={this._onRefreshQuickButtonWaitingList.bind(this,true)} contentContainerStyle={{ justifyContent: 'center', alignItems: 'flex-start' }} data={this.listWaitingListQuickButtonData} renderItem={({ item }) => {
                                    return (
                                    <DefaultTenantCard style={style.throwWHPTenantCard} data={item} imageSetting={this.imageSetting} onNotification={((item, s)=>{ console.log(item);  item.fUserNotificationThis = s; this.forceUpdate();}).bind(this,item)} onFavorite={((item, s)=>{console.log(item);  item.fUserFavoriteThis = s; this.forceUpdate();}).bind(this,item)} onLike={((item, s,c)=>{item.fUserLikedThis = s; item.fTotalLikeStore+=c; this.forceUpdate();}).bind(this,item)} likePackage={this._getLikeResource(item)} navigator={this.props.navigation} type={1} hidePopView={this._hidePopView.bind(this,1)}></DefaultTenantCard>
                                    );
                                }} keyExtractor={item => item.fID}
                                onEndReached={this._onLoadQuickButtonWaitingList.bind(this)}
                                onEndReachedThreshold={SGHelperType.getThreshold()}
                                ListFooterComponent={()=>{
                                    if( this.state.loadingQuickButtonWaitingList)return <ActivityIndicator preset={ActivityIndicator.preset.h1} style={{ width: w, height: h * 0.05  }}></ActivityIndicator>
                                    else return null
                                }}
                                >
                                </FlatList>
                            :
                            <View style={{flex:1}}>
                                <Text preset={Text.preset.h7} style={{ textAlign: 'justify', color: "rgb(130,128,128)",alignSelf:'center',paddingLeft:2*p,paddingRight:2*p }}>{SGLocalize.translate('globalText.QuickButtonWaitingListNoResult')}</Text>
                            </View>
                            }
                        </View>
                    :
                    <View style={{flex:1}} tabLabel={SGLocalize.translate('globalText.PlacePicker')}>
                        <ActivityIndicator preset={ActivityIndicator.preset.h1} style={{ flex: 1 }}></ActivityIndicator>
                    </View>
                    }

                    {this.quickButtonWaitinglistMount ?
                        <View style={style.vPopView1} tabLabel={SGLocalize.translate('globalText.BrandPicker')}>
                            <Picker accessible={true} accessibilityLabel={'QuickButtonWaitingListPicker'} shadowIntensity={0.2} textPreset={Text.preset.h8} single  language={(this._language).toUpperCase()} style={style.picker} shadow optionList={this.brandList} value={this.selectedBrandOption} onValueChange={(v) => { this._setSelectedBrandOption(v,1);}} />
                            <Text preset={Text.preset.h5B} style={{alignSelf:'flex-start',marginLeft:3*p,marginTop:2*p}}>{this._getBrandName()}</Text>
                            {this.listWaitingListQuickButtonDataBrand.length !== 0 ?
                                <FlatList refreshing={this.state.refreshQuickButtonWaitingListBrand} onRefresh={this._onRefreshQuickButtonWaitingListBrand.bind(this,true)} contentContainerStyle={{ justifyContent: 'center', alignItems: 'flex-start' }} data={this.listWaitingListQuickButtonDataBrand} renderItem={({ item }) => {
                                    return (
                                    <DefaultTenantCard style={style.throwWHPTenantCard} data={item} imageSetting={this.imageSetting} onNotification={((item, s)=>{ console.log(item);  item.fUserNotificationThis = s; this.forceUpdate();}).bind(this,item)} onFavorite={((item, s)=>{console.log(item);  item.fUserFavoriteThis = s; this.forceUpdate();}).bind(this,item)} onLike={((item, s,c)=>{item.fUserLikedThis = s; item.fTotalLikeStore+=c; this.forceUpdate();}).bind(this,item)} likePackage={this._getLikeResource(item)} navigator={this.props.navigation} type={1} hidePopView={this._hidePopView.bind(this,1)}></DefaultTenantCard>
                                    );
                                }} keyExtractor={item => item.fID}
                                onEndReached={this._onLoadQuickButtonWaitingListBrand.bind(this)}
                                onEndReachedThreshold={SGHelperType.getThreshold()}
                                ListFooterComponent={()=>{
                                    if( this.state.loadingQuickButtonWaitingListBrand)return <ActivityIndicator preset={ActivityIndicator.preset.h1} style={{ width: w, height: h * 0.05  }}></ActivityIndicator>
                                    else return null
                                }}
                                >
                                </FlatList>
                            :
                            <View style={{flex:1}}>
                                <Text preset={Text.preset.h7} style={{ textAlign: 'justify', color: "rgb(130,128,128)",alignSelf:'center',paddingLeft:2*p,paddingRight:2*p }}>{SGLocalize.translate('globalText.QuickButtonWaitingListNoResult')}</Text>
                            </View>
                            }
                        </View>
                    :
                    <View style={{flex:1}} tabLabel={SGLocalize.translate('globalText.BrandPicker')}>
                        <ActivityIndicator preset={ActivityIndicator.preset.h1} style={{ flex: 1 }}></ActivityIndicator>
                    </View>
                    }
                    </TabView>    
                    </View>
                </SGPopView>
                {/* End Of Pop View Quick Button  Waiting List*/}
                
                {/* PopView Quick Button Reservation */}
                <SGPopView popViewID={this.pvIDReservation} on animationType={'slide'} vPos='Bottom'>
                    <View style={style.vPopView1}>
                        <TabView  onChangeTab={(e) => { this._tabIndex = e.i; this._onChangeTab(2); }} accessible={true} accessibilityLabel={'PopViewTabView'} tabBarUnderlineStyle={{ backgroundColor: '#181818' }} tabBarActiveTextPreset={Text.preset.h6B} tabBarInactiveTextPreset={Text.preset.h6B}> 
                            {this.quickButtonReservationMount ?
                                <View style={style.vPopView1} tabLabel={SGLocalize.translate('globalText.PlacePicker')}> 
                                    <Picker accessible={true} accessibilityLabel={'QuickButtonWaitingListPicker'} shadowIntensity={0.2} textPreset={Text.preset.h8} single  language={(this._language).toUpperCase()} style={style.picker} shadow optionList={this.buildingList} value={this.selectedOption} onValueChange={(v) => { this._setSelectedOption(v,2);}} />
                                    <Text preset={Text.preset.h5B} style={{alignSelf:'flex-start',marginLeft:3*p,marginTop:2*p}}>{this._getBuildingName()}</Text>
                                    {this.listReservationQuickButtonData.length !== 0 ?
                                        <FlatList refreshing={this.state.refreshQuickButtonReservation} onRefresh={this._onRefreshQuickButtonReservation.bind(this,true)} contentContainerStyle={{ justifyContent: 'center', alignItems: 'flex-start' }} data={this.listReservationQuickButtonData} renderItem={({ item }) => {
                                            return (
                                            <DefaultTenantCard style={style.throwWHPTenantCard} data={item} imageSetting={this.imageSetting} onNotification={((item, s)=>{ console.log(item);  item.fUserNotificationThis = s; this.forceUpdate();}).bind(this,item)} onFavorite={((item, s)=>{console.log(item);  item.fUserFavoriteThis = s; this.forceUpdate();}).bind(this,item)} onLike={((item, s,c)=>{item.fUserLikedThis = s; item.fTotalLikeStore+=c; this.forceUpdate();}).bind(this,item)} likePackage={this._getLikeResource(item)} navigator={this.props.navigation} type={2} hidePopView={this._hidePopView.bind(this,2)}></DefaultTenantCard>
                                            );
                                        }} keyExtractor={item => item.fID}
                                        onEndReached={this._onLoadQuickButtonReservation.bind(this)}
                                        onEndReachedThreshold={SGHelperType.getThreshold()}
                                        ListFooterComponent={()=>{
                                            if( this.state.loadingQuickButtonReservation)return <ActivityIndicator preset={ActivityIndicator.preset.h1} style={{width:w*0.9,height:h*0.05}}></ActivityIndicator>
                                            else return null
                                        }}
                                        >
                                        </FlatList>
                                    :
                                        <View style={{flex:1}}>
                                            <Text preset={Text.preset.h7} style={{ textAlign: 'justify', color: "rgb(130,128,128)",alignSelf:'center',paddingLeft:2*p,paddingRight:2*p }}>{SGLocalize.translate('globalText.QuickButtonReservationNoResult')}</Text>
                                        </View>
                                    }
                            </View>
                                :
                            <View style={{flex:1}} tabLabel={SGLocalize.translate('globalText.PlacePicker')}> 
                                <ActivityIndicator preset={ActivityIndicator.preset.h1} style={{ flex: 1 }}></ActivityIndicator>
                            </View>
                            }

                            {this.quickButtonReservationMount ?
                                <View style={style.vPopView1} tabLabel={SGLocalize.translate('globalText.BrandPicker')}> 
                                    <Picker accessible={true} accessibilityLabel={'QuickButtonWaitingListPicker'} shadowIntensity={0.2} textPreset={Text.preset.h8} single  language={(this._language).toUpperCase()} style={style.picker} shadow optionList={this.brandList} value={this.selectedBrandOption} onValueChange={(v) => { this._setSelectedBrandOption(v,2);}} />
                                    <Text preset={Text.preset.h5B} style={{alignSelf:'flex-start',marginLeft:3*p,marginTop:2*p}}>{this._getBrandName()}</Text>
                                    {this.listReservationQuickButtonDataBrand.length !== 0 ?
                                        <FlatList refreshing={this.state.refreshQuickButtonReservationBrand} onRefresh={this._onRefreshQuickButtonReservationBrand.bind(this,true)} contentContainerStyle={{ justifyContent: 'center', alignItems: 'flex-start' }} data={this.listReservationQuickButtonDataBrand} renderItem={({ item }) => {
                                            return (
                                            <DefaultTenantCard style={style.throwWHPTenantCard} data={item} imageSetting={this.imageSetting} onNotification={((item, s)=>{ console.log(item);  item.fUserNotificationThis = s; this.forceUpdate();}).bind(this,item)} onFavorite={((item, s)=>{console.log(item);  item.fUserFavoriteThis = s; this.forceUpdate();}).bind(this,item)} onLike={((item, s,c)=>{item.fUserLikedThis = s; item.fTotalLikeStore+=c; this.forceUpdate();}).bind(this,item)} likePackage={this._getLikeResource(item)} navigator={this.props.navigation} type={2} hidePopView={this._hidePopView.bind(this,2)}></DefaultTenantCard>
                                            );
                                        }} keyExtractor={item => item.fID}
                                        onEndReached={this._onLoadQuickButtonReservationBrand.bind(this)}
                                        onEndReachedThreshold={SGHelperType.getThreshold()}
                                        ListFooterComponent={()=>{
                                            if( this.state.loadingQuickButtonReservationBrand)return <ActivityIndicator preset={ActivityIndicator.preset.h1} style={{width:w*0.9,height:h*0.05}}></ActivityIndicator>
                                            else return null
                                        }}
                                        >
                                        </FlatList>
                                    :
                                        <View style={{flex:1}}>
                                            <Text preset={Text.preset.h7} style={{ textAlign: 'justify', color: "rgb(130,128,128)",alignSelf:'center',paddingLeft:2*p,paddingRight:2*p }}>{SGLocalize.translate('globalText.QuickButtonReservationNoResult')}</Text>
                                        </View>
                                    }
                            </View>
                                :
                            <View style={{flex:1}} tabLabel={SGLocalize.translate('globalText.BrandPicker')}> 
                                <ActivityIndicator preset={ActivityIndicator.preset.h1} style={{ flex: 1 }}></ActivityIndicator>
                            </View>
                            }
                        </TabView>
                    </View>
                </SGPopView>
                {/* End Of Pop View Quick Button  Reservation*/}

                 {/* PopView Quick Button Order Menu */}
                 <SGPopView popViewID={this.pvIDOrderMenu} on animationType={'slide'} vPos='Bottom'>
                    <View style={style.vPopView1}>
                    <TabView  onChangeTab={(e) => { this._tabIndex = e.i; this._onChangeTab(3); }} accessible={true} accessibilityLabel={'PopViewTabView'} tabBarUnderlineStyle={{ backgroundColor: '#181818' }} tabBarActiveTextPreset={Text.preset.h6B} tabBarInactiveTextPreset={Text.preset.h6B}> 
                        {this.quickButtonOrderMenuMount ?
                        <View style={style.vPopView1} tabLabel={SGLocalize.translate('globalText.PlacePicker')}> 
                             <Picker accessible={true} accessibilityLabel={'QuickButtonOrderMenuPicker'} shadowIntensity={0.2} textPreset={Text.preset.h8} single  language={(this._language).toUpperCase()} style={style.picker} shadow optionList={this.buildingList} value={this.selectedOption} onValueChange={(v) => { this._setSelectedOption(v,3);}} />
                             <Text preset={Text.preset.h5B} style={{alignSelf:'flex-start',marginLeft:3*p,marginTop:2*p}}>{this._getBuildingName()}</Text>
                                {this.listOrderMenuQuickButtonData.length !== 0 ?
                                    <FlatList refreshing={this.state.refreshQuickButtonOrderMenu} onRefresh={this._onRefreshQuickButtonOrderMenu.bind(this,true)} contentContainerStyle={{ justifyContent: 'center', alignItems: 'flex-start' }} data={this.listOrderMenuQuickButtonData} renderItem={({ item }) => {
                                        return (
                                        <DefaultTenantCard style={style.throwWHPTenantCard} data={item} imageSetting={this.imageSetting} onNotification={((item, s)=>{ console.log(item);  item.fUserNotificationThis = s; this.forceUpdate();}).bind(this,item)} onFavorite={((item, s)=>{console.log(item);  item.fUserFavoriteThis = s; this.forceUpdate();}).bind(this,item)} onLike={((item, s,c)=>{item.fUserLikedThis = s; item.fTotalLikeStore+=c; this.forceUpdate();}).bind(this,item)} likePackage={this._getLikeResource(item)} navigator={this.props.navigation} type={3} hidePopView={this._hidePopView.bind(this,3)}></DefaultTenantCard>
                                        );
                                    }} keyExtractor={item => item.fID}
                                    onEndReached={this._onLoadQuickButtonOrderMenu.bind(this)}
                                    onEndReachedThreshold={SGHelperType.getThreshold()}
                                    ListFooterComponent={()=>{
                                        if( this.state.loadingQuickButtonOrderMenu)return <ActivityIndicator preset={ActivityIndicator.preset.h1} style={{width:w*0.9,height:h*0.05}}></ActivityIndicator>
                                        else return null
                                    }}
                                    >
                                    </FlatList>
                                    :
                                    <View style={{flex:1}}>
                                        <Text preset={Text.preset.h7} style={{ textAlign: 'justify', color: "rgb(130,128,128)",alignSelf:'center',paddingLeft:2*p,paddingRight:2*p }}>{SGLocalize.translate('globalText.QuickButtonOrderMenuNoResult')}</Text>
                                    </View>
                                }
                        </View>
                        :
                        <View style={{flex:1}} tabLabel={SGLocalize.translate('globalText.PlacePicker')}> 
                            <ActivityIndicator preset={ActivityIndicator.preset.h1} style={{ flex: 1 }}></ActivityIndicator>
                        </View>
                        }

                    {this.quickButtonOrderMenuMount ?
                        <View style={style.vPopView1} tabLabel={SGLocalize.translate('globalText.BrandPicker')}> 
                             <Picker accessible={true} accessibilityLabel={'QuickButtonOrderMenuPicker'} shadowIntensity={0.2} textPreset={Text.preset.h8} single  language={(this._language).toUpperCase()} style={style.picker} shadow optionList={this.brandList} value={this.selectedBrandOption} onValueChange={(v) => { this._setSelectedBrandOption(v,3)}} />
                             <Text preset={Text.preset.h5B} style={{alignSelf:'flex-start',marginLeft:3*p,marginTop:2*p}}>{this._getBrandName()}</Text>
                                {this.listOrderMenuQuickButtonDataBrand.length !== 0 ?
                                    <FlatList refreshing={this.state.refreshQuickButtonOrderMenuBrand} onRefresh={this._onRefreshQuickButtonOrderMenuBrand.bind(this,true)} contentContainerStyle={{ justifyContent: 'center', alignItems: 'flex-start' }} data={this.listOrderMenuQuickButtonDataBrand} renderItem={({ item }) => {
                                        return (
                                        <DefaultTenantCard style={style.throwWHPTenantCard} data={item} imageSetting={this.imageSetting} onNotification={((item, s)=>{ console.log(item);  item.fUserNotificationThis = s; this.forceUpdate();}).bind(this,item)} onFavorite={((item, s)=>{console.log(item);  item.fUserFavoriteThis = s; this.forceUpdate();}).bind(this,item)} onLike={((item, s,c)=>{item.fUserLikedThis = s; item.fTotalLikeStore+=c; this.forceUpdate();}).bind(this,item)} likePackage={this._getLikeResource(item)} navigator={this.props.navigation} type={3} hidePopView={this._hidePopView.bind(this,3)}></DefaultTenantCard>
                                        );
                                    }} keyExtractor={item => item.fID}
                                    onEndReached={this._onLoadQuickButtonOrderMenuBrand.bind(this)}
                                    onEndReachedThreshold={SGHelperType.getThreshold()}
                                    ListFooterComponent={()=>{
                                        if( this.state.loadingQuickButtonOrderMenuBrand)return <ActivityIndicator preset={ActivityIndicator.preset.h1} style={{width:w*0.9,height:h*0.05}}></ActivityIndicator>
                                        else return null
                                    }}
                                    >
                                    </FlatList>
                                    :
                                    <View style={{flex:1}}>
                                        <Text preset={Text.preset.h7} style={{ textAlign: 'justify', color: "rgb(130,128,128)",alignSelf:'center',paddingLeft:2*p,paddingRight:2*p }}>{SGLocalize.translate('globalText.QuickButtonOrderMenuNoResult')}</Text>
                                    </View>
                                }
                        </View>
                        :
                        <View style={{flex:1}} tabLabel={SGLocalize.translate('globalText.BrandPicker')}> 
                            <ActivityIndicator preset={ActivityIndicator.preset.h1} style={{ flex: 1 }}></ActivityIndicator>
                        </View>
                        }
                    </TabView>
                        </View>
                </SGPopView>
                {/* End Of Pop View Quick Button  Order Menu*/}

                <RibbonHeader style={style.ribbonHeader} goldTheme borderTopOff imageSetting={this.imageSetting} title={SGLocalize.translate("MyBooking.screenTitle")} ribbonWidth={0.35}></RibbonHeader>
                <TabView  accessible={true} accessibilityLabel={'MyRestoBookingScreenTabView'} tabBarStyle={style.tabBarStyle} tabBarTextStyle={style.tabBarTextStyle} tabBarUnderlineStyle={style.tabBarUnderlineStyle} tabBarActiveTextColor={'#000000'} tabBarInactiveTextColor={'#6E6A6A'} tabBarActiveTextPreset={Text.preset.titleH2B} tabBarInactiveTextPreset={Text.preset.titleH2} scrollableTabBar style={{ flex: 1 }} initialPage={this.initialPageCounter} renderTabBar={() => <DefaultTabBar />}  >
                    <View accessible={true}  tabLabel={SGLocalize.translate("MyBooking.tabWaitingListTitle")} style={{flex:1}}>
                        {this.alreadyMount === true ?
                        <View style={{flex:1}}>
                            <TabMyWaitingList accessible={true} accessibilityLabel={'MyRestoBookingScreenTabWL'} navigator={this.props.navigation} myWaitingListActiveData={this.dataWaiting} myWaitingListHistoryData={this.dataWaitingHistory} style={style.containerView1} language={this._language} userData={this.currentUserData} callback={this._callBackForUpdate.bind(this)} loadData ={this._onLoadWaitingList.bind(this)}  loadDataHistory={this._onLoadWaitingListHistory.bind(this)} loadingData ={this.state.loadingWaitingList} loadingDataHistory ={this.state.loadingWaitingListHistory}   refreshData ={this._onRefreshWaitingList.bind(this)} refreshDataHistory ={this._onRefreshWaitingListHistory.bind(this)}></TabMyWaitingList>
                            <TouchableOpacity accessible={true} accessibilityLabel={'MyRestoBookingWaitingListFAB'} style={style.vfab} onPress={async() => { this._showPopView(1); }}>
                                <Icon name={Icon.Icon.plus} preset={Icon.preset.w7} style={{ color: 'rgba(38,38,38,0.85)',alignSelf:'center' }}></Icon>
                          </TouchableOpacity>
                        </View>
                        :
                        <ActivityIndicator preset={ActivityIndicator.preset.h1} style={{ flex: 1 }}></ActivityIndicator>
                        }
                    </View>
                    <View accessible={true}  tabLabel={SGLocalize.translate("MyBooking.tabReservationTitle")} style={{flex:1}} >
                        {this.alreadyMount === true ?
                         <View style={{flex:1}}>
                            <TabMyReservation accessible={true} accessibilityLabel={'MyRestoBookingScreenTabR'} navigator={this.props.navigation} myReservationActiveData={this.dataReservationActive} myReservationHistoryData={this.dataReservationHistory} style={style.containerView1} language={this._language} userData={this.currentUserData} callback={this._callBackForUpdate.bind(this)} loadData ={this._onLoadReservation.bind(this)}  loadDataHistory={this._onLoadReservationHistory.bind(this)} loadingData ={this.state.loadingReservation} loadingDataHistory ={this.state.loadingReservationHistory} refreshData ={this._onRefreshReservation.bind(this)} refreshDataHistory ={this._onRefreshReservationHistory.bind(this)}></TabMyReservation>
                            <TouchableOpacity accessible={true} accessibilityLabel={'MyRestoBookingReservationFAB'} style={style.vfab} onPress={async() => { this._showPopView(2); }}>
                                <Icon name={Icon.Icon.plus} preset={Icon.preset.w7} style={{ color: 'rgba(38,38,38,0.85)',alignSelf:'center' }}></Icon>
                          </TouchableOpacity>
                        </View>
                        :
                            <ActivityIndicator preset={ActivityIndicator.preset.h1} style={{ flex: 1 }}></ActivityIndicator>
                        }
                    </View>
                    <View accessible={true}  tabLabel={SGLocalize.translate("MyBooking.tabOrderMenuTitle")}  style={{flex:1}}>
                        {this.alreadyMount === true ?
                        <View style={{flex:1}}>
                            <TabMyOrderMenu accessible={true} accessibilityLabel={'MyRestoBookingScreenTabOM'} navigator={this.props.navigation} orderMenuActiveData={this.dataActive} orderMenuHistoryData={this.dataHistory} style={style.containerView1} language={this._language} userData={this.currentUserData} callback={this._callBackForUpdate.bind(this)} loadData ={this._onLoadOrderMenu.bind(this)}  loadDataHistory={this._onLoadOrderMenuHistory.bind(this)} loadingData ={this.state.loadingOrderMenu} loadingDataHistory ={this.state.loadingOrderMenuHistory} refreshData ={this._onRefreshOrderMenu.bind(this)} refreshDataHistory ={this._onRefreshOrderMenuHistory.bind(this)}></TabMyOrderMenu>
                            <TouchableOpacity accessible={true} accessibilityLabel={'MyRestoBookingOrderMenuFAB'} style={style.vfab} onPress={async() => { this._showPopView(3); }}>
                                <Icon name={Icon.Icon.plus} preset={Icon.preset.w7} style={{ color: 'rgba(38,38,38,0.85)',alignSelf:'center' }}></Icon>
                            </TouchableOpacity>
                        </View>
                        :
                        <ActivityIndicator preset={ActivityIndicator.preset.h1} style={{ flex: 1 }}></ActivityIndicator>
                        }
                    </View>

                  
                </TabView>
                <View style={{ width: '100%', height: SGHelperWindow.getFooterHeight() }}></View>
                <View style={{ width: '100%', height: SGHelperWindow.getHeaderHeight() }}></View>
                <Animated.View style={{ position: 'absolute', transform: [{ translateY: this._baseAnimY.interpolate({ inputRange: [-1, 0], outputRange: [(SGHelperWindow.getStatusBarHeight() - SGHelperWindow.getHeaderHeight()), SGHelperWindow.getStatusBarHeight()] }) },], height: SGHelperWindow.getHeaderHeight(), width: '100%' }}>
                    <BackMenuBar accessible={true} accessibilityLabel={'HomeScreenHeader'} currentUser={this.currentUser} navigator={this.props.navigation} imageSetting={this.imageSetting} style={style.throwWHP}></BackMenuBar>
                </Animated.View>
                <Animated.View style={{ position: 'absolute', transform: [{ translateY: this._baseAnimY.interpolate({ inputRange: [-1, 0], outputRange: [SGHelperWindow.getWHPNoHeader().h + 8 * p, SGHelperWindow.getWHPNoHeader().h - Math.max(SGHelperWindow.getFooterHeight(), 2 * p) - SGHelperWindow.getHeaderHeight()] }) },], height: Math.max(SGHelperWindow.getFooterHeight(), 2 * p) + SGHelperWindow.getHeaderHeight(), width: '100%' }}>
                    <BottomNavigationContainer accessible={true} accessibilityLabel={'MyRestoBookingScreenBottomNav'} blackTheme borderOff active4={true} navigator={this.props.navigation} state={this.getBottomNavigationState} style={style.containerView3} screen={this.props.route.name}></BottomNavigationContainer>
                </Animated.View>
            </RootView>
        );
    }
}
