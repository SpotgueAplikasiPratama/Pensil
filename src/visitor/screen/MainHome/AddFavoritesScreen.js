/*
Version 1.2.0
Adding Paging By Melvin , 25 Maret 2021
 * 1. Yohanes April 01 2021
 * - add Error Handling
 * 2. Leon, 4 May 2021
  - Fix Like, Fix Favorite, Fix Notification
*/

import React from 'react';
import { StyleSheet, Animated, RefreshControl } from 'react-native';
import { SGFlatList as FlatList, SGRootView as RootView, SGView as View, SGText as Text, SGTabView as TabView, SGActivityIndicator as ActivityIndicator, SGImage as Image, SGButton as Button, SGPopView,SGDialogBox } from '../../../core/control';
import { SGBaseScreen } from '../../../core/screen/SGBaseScreen';
import { AddFavoritesSearchBar } from '../../component_V2/AddFavoritesSearchBar';
import { SGHelperNavigation, SGHelperGlobalVar, SGHelperWindow, SGHelperType, SGHelperErrorHandling } from '../../../core/helper';
import { SGLocalize } from '../../locales/SGLocalize';
import { RibbonHeader } from '../../component_V2/RibbonHeader';
import { BottomNavigationContainer } from '../../component_V2/BottomNavigationContainer';
import { filterDAO } from '../../db/filterDAO';
import { sortDAO } from '../../db/sortDAO';
import { SmallFavoritePlaceCard } from '../../container_V2/SmallFavoritePlaceCard';
import { SmallFavoriteRestoCard } from '../../container_V2/SmallFavoriteRestoCard';
import { SmallFavoriteStoreCard } from '../../container_V2/SmallFavoriteStoreCard';
import { tbVUserFavoriteAPI } from '../../api/tbVUserFavoriteAPI';
import { VRewardAPI } from '../../api/VRewardAPI'
import { VFilterOptionsAPI } from '../../api/VFilterOptionsAPI';

export class AddFavoritesScreen extends SGBaseScreen {


    getPagingDataPlace(){
        var itemPerPage = SGHelperType.getPaging()
        return {paging:true,offset:this.pagingCounterPlace, totalPerPage:itemPerPage}
    }
    getPagingDataStore(){
        var itemPerPage = SGHelperType.getPaging()
        return {paging:true,offset:this.pagingCounterStore, totalPerPage:itemPerPage}
    }
    getPagingDataResto(){
        var itemPerPage = SGHelperType.getPaging()
        return {paging:true,offset:this.pagingCounterResto, totalPerPage:itemPerPage}
    }

    createStyleSheet = (whp) => {
        var { w, h, p } = whp;
        return StyleSheet.create({
            mainContainer: { width: w, backgroundColor: '#FFFFFF', justifyContent: 'flex-start' },
            throwWHP: { width: w, height: h, padding: p, backgroundColor: 'white' },
            containerView1: { width: w, height: w, padding: p, backgroundColor: 'white' },
            textView1: { width: w - 2 * p, height: w * 0.12, alignItems: 'flex-start', },
            text1: { color: '#7a7a7a' },
            tabBarStyle: { borderColor: '#C5C4BC', borderTopWidth: 0.0015 * w, borderBottomWidth: 0.0015 * w, width:w },
            tabBarUnderlineStyle: { backgroundColor: '#1E1E1E' },
            flatListBGColor: { justifyContent: 'flex-start', alignItems: 'center', backgroundColor: '#FFFFFF' },
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
        });
    }

    async componentDidMount() {
        await this._onRefreshAllItem(true);
        this._unsubscribe = this.props.navigation.addListener('focus', async () => {
            await this._onRefreshAllItem();
        });
    }

    componentWillUnmount() {
        if (this._unsubscribe) { this._unsubscribe(); }
    }
    checkAPIBatchStatusAllDone1(){
        
        this.setState({ refreshPlace : false, refreshStore:false,refreshResto:false, });
        this.forceUpdate();
    }
    async _onRefreshAllItem(resetPaging=false) {
        if(resetPaging){
            this.baseRunSingleAPIWithRedoOption('getLocationFilter', (async (v1) => { return VFilterOptionsAPI.getLocationFilter(v1) }).bind(this,this.Language), ( (v) => {
                this._buildingMatrix = v //await VFilterOptionsAPI.getLocationFilter(this.Language);async 
                this.pagingCounterPlace= 0
                this.pagingCounterStore= 0
                this.pagingCounterResto= 0
                this.pagingPlace = this.getPagingDataPlace()
                this.pagingStore = this.getPagingDataStore()
                this.pagingResto = this.getPagingDataResto()
                // this._onRefreshStorePaging();
                // this._onRefreshRestoPaging();
                this.baseInitAPIParallel( SGHelperGlobalVar.getVar("ResponTimes"), (() => { this.checkAPIBatchStatusAllDone1(); }).bind(this));
                this.baseAddAPIParallel('getUserUnfavPlaceList', (async (v1,v2,v3,v4,v5) => { return tbVUserFavoriteAPI.getUserUnfavPlaceList(v1,v2,v3,v4,v5) }).bind(this,this.Language, this.searchKeywordPlace, this._filterDataPlace, this._sortDataPlace,this.pagingPlace), ((v) => {
                    this.pagingCounterPlace = v.length
                    this.dataPlace.arrData = v;
                    this.dataPlace.alreadyMount = true; 
                    if(v.length<SGHelperType.getPaging())this.setState({stopPullingPlace:true})
                    else this.setState({stopPullingPlace:false})
                }).bind(this), null);
                this.baseAddAPIParallel('getUserUnfavStoreList', (async (v1,v2,v3,v4,v5) => { return tbVUserFavoriteAPI.getUserUnfavStoreList(v1,v2,v3,v4,v5) }).bind(this,this.Language, this.searchKeywordStore, this._filterDataStore, this._sortDataStore,this.pagingStore), ((v) => {
                    this.pagingCounterStore = v.length;
                    this.dataStore.arrData = v;
                    console.log(v);
                    this.dataStore.alreadyMount = true; 
                    if(v.length<SGHelperType.getPaging())this.setState({stopPullingStore:true})
                    else this.setState({stopPullingStore:false})
                }).bind(this), null)
                this.baseAddAPIParallel('getUserUnfavPlaceList', (async (v1,v2,v3,v4,v5) => { return tbVUserFavoriteAPI.getUserUnfavRestoList(v1,v2,v3,v4,v5) }).bind(this,this.Language, this.searchKeywordResto, this._filterDataResto, this._sortDataResto,this.pagingResto), ((v) => {
                    this.pagingCounterResto = v.length;
                    this.dataResto.arrData = v;
                    console.log(v);
                    this.dataResto.alreadyMount = true; 
                    if(v.length<SGHelperType.getPaging())this.setState({stopPullingResto:true})
                    else this.setState({stopPullingResto:false})
                }).bind(this), null)
                
                this.baseRunAPIParallel();
                // this._onRefreshPlacePaging();
                // this._onRefreshStorePaging();
                // this._onRefreshRestoPaging();
            }).bind(this),  null,  SGHelperGlobalVar.getVar("ResponTimes"));
        }  else {
            this.forceUpdate();
        }
    }


    async _onRefreshPlacePaging(){
        this.setState({ refreshPlace: true,stopPullingPlace:true})
        if(!this.refreshPlace && !this.state.loadingPlace){
            this.refreshPlace= true
            this.pagingCounterPlace = 0
            this.pagingPlace = this.getPagingDataPlace()
           
            if (this.searchKeywordPlace === '') {
                // console.log('1')
                this.currentUser = SGHelperGlobalVar.getVar('GlobalCurrentUser');
                this.imageSetting = SGHelperGlobalVar.getVar('GlobalImageSetting');
                this.dataPlace.isLoading = true;
                // this.forceUpdate();
                this.baseRunSingleAPIWithRedoOption('getUserUnfavPlaceList', (async (v1,v2,v3,v4,v5) => { return tbVUserFavoriteAPI.getUserUnfavPlaceList(v1,v2,v3,v4,v5) }).bind(this,this.Language, this.searchKeywordPlace, this._filterDataPlace, this._sortDataPlace,this.pagingPlace), ((v) => {
                    this.pagingCounterPlace = v.length
                    if(v.length<SGHelperType.getPaging())this.setState({stopPullingPlace:true})
                    else this.setState({stopPullingPlace:false})
                    this.dataPlace.arrData = v;
                    // console.log('2')
                    this.dataPlace.isLoading = false;
                    this.dataPlace.alreadyMount = true;
                    this.refreshPlace=false
                    this.setState({ stopPullingPlace:false, refreshPlace: false });
                    this.forceUpdate();

                }).bind(this),  (()=>{this.setState({ stopPullingPlace:false, refreshPlace: false });}),  SGHelperGlobalVar.getVar("ResponTimes"));
            }
            else {    
                // console.log('2')
                this.currentUser = SGHelperGlobalVar.getVar('GlobalCurrentUser');
                this.imageSetting = SGHelperGlobalVar.getVar('GlobalImageSetting');
                this.dataPlace.isLoading = true;
                // this.forceUpdate();
                this.baseRunSingleAPIWithRedoOption('getUserUnfavPlaceListWithSearch', (async (v1,v2,v3,v4,v5) => { return tbVUserFavoriteAPI.getUserUnfavPlaceListWithSearch(v1,v2,v3,v4,v5) }).bind(this,this.Language, this.searchKeywordPlace, this._filterDataPlaceSearch, this._sortDataPlaceSearch,this.pagingPlace), ((v) => {
                // tbVUserFavoriteAPI.getUserUnfavPlaceListWithSearch(this.Language, this.searchKeywordPlace, this._filterDataPlaceSearch, this._sortDataPlaceSearch,this.pagingPlace).then((v) => {
                    this.pagingCounterPlace = v.length
                    if(v.length<SGHelperType.getPaging())this.setState({stopPullingPlace:true})
                    else this.setState({stopPullingPlace:false})
                    this.dataPlace.arrData = v;
                    console.log(v);
                    this.dataPlace.isLoading = false;
                    this.dataPlace.alreadyMount = true;
                    this.refreshPlace=false
                    this.setState({ stopPullingPlace:false, refreshPlace: false });
                    this.forceUpdate();
                // })
                }).bind(this),  (()=>{this.setState({ stopPullingPlace:false, refreshPlace: false });}),  SGHelperGlobalVar.getVar("ResponTimes"));
            }
           
        }       
    }

    async _onRefreshStorePaging(){
        // console.log('refreshStore')
        this.setState({ refreshStore: true,stopPullingStore:true})
        if(!this.refreshStore && !this.state.loadingStore){
            this.refreshStore= true
            this.pagingCounterStore = 0
            this.pagingStore = this.getPagingDataStore()
            
            if (this.searchKeywordStore === '') {
               
                this.currentUser = SGHelperGlobalVar.getVar('GlobalCurrentUser');
                this.imageSetting = SGHelperGlobalVar.getVar('GlobalImageSetting');
                this.dataStore.isLoading = true;
                // this.forceUpdate();
                this.baseRunSingleAPIWithRedoOption('getUserUnfavStoreList', (async (v1,v2,v3,v4,v5) => { return tbVUserFavoriteAPI.getUserUnfavStoreList(v1,v2,v3,v4,v5) }).bind(this,this.Language, this.searchKeywordStore, this._filterDataStore, this._sortDataStore,this.pagingStore), ((v) => {
                // tbVUserFavoriteAPI.getUserUnfavStoreList(this.Language, this.searchKeywordStore, this._filterDataStore, this._sortDataStore,this.pagingStore).then((v) => {
                    console.log('_onRefreshStorePaging')
                    this.pagingCounterStore = v.length;
                    if(v.length<SGHelperType.getPaging())this.setState({stopPullingStore:true})
                    else this.setState({stopPullingStore:false})
                    this.dataStore.arrData = v;
                    console.log(v);
                    this.dataStore.isLoading = false;
                    this.dataStore.alreadyMount = true;
                    this.refreshStore=false
                    this.setState({ stopPullingStore:false, refreshStore: false });
                  
                    this.forceUpdate();
                // })
                }).bind(this),  (()=>{this.setState({ stopPullingStore:false, refreshStore: false });}),  SGHelperGlobalVar.getVar("ResponTimes"));
            }
            else {
                this.currentUser = SGHelperGlobalVar.getVar('GlobalCurrentUser');
                this.imageSetting = SGHelperGlobalVar.getVar('GlobalImageSetting');
                this.dataStore.isLoading = true;
                // this.forceUpdate();
                this.baseRunSingleAPIWithRedoOption('getUserUnfavStoreListWithSearch', (async (v1,v2,v3,v4,v5) => { return tbVUserFavoriteAPI.getUserUnfavStoreListWithSearch(v1,v2,v3,v4,v5) }).bind(this,this.Language, this.searchKeywordStore, this._filterDataStoreSearch, this._sortDataStoreSearch,this.pagingStore), ((v) => {
                // tbVUserFavoriteAPI.getUserUnfavStoreListWithSearch(this.Language, this.searchKeywordStore, this._filterDataStoreSearch, this._sortDataStoreSearch,this.pagingStore).then((v) => {
                    this.pagingCounterStore = v.length;
                    if(v.length<SGHelperType.getPaging())this.setState({stopPullingStore:true})
                    else this.setState({stopPullingStore:false})
                    this.dataStore.arrData = v;
                    console.log(v);
                    this.dataStore.isLoading = false;
                    this.dataStore.alreadyMount = true;
                    this.refreshStore=false
                    this.setState({ stopPullingStore:false, refreshStore: false });
                    this.forceUpdate();
                // })
                }).bind(this),  (()=>{this.setState({ stopPullingStore:false, refreshStore: false });}),  SGHelperGlobalVar.getVar("ResponTimes"));
            }
           
        }       
    }

    async _onRefreshRestoPaging(){
        this.setState({ refreshResto: true,stopPullingResto:true})
        if(!this.refreshResto && !this.state.loadingResto){
            this.refreshResto= true
            this.pagingCounterResto = 0
            this.pagingResto = this.getPagingDataResto()
            
            if (this.searchKeywordResto === '') {
                this.currentUser = SGHelperGlobalVar.getVar('GlobalCurrentUser');
                this.imageSetting = SGHelperGlobalVar.getVar('GlobalImageSetting');
                this.dataResto.isLoading = true;
                // this.forceUpdate();
                this.baseRunSingleAPIWithRedoOption('getUserUnfavRestoList', (async (v1,v2,v3,v4,v5) => { return tbVUserFavoriteAPI.getUserUnfavRestoList(v1,v2,v3,v4,v5) }).bind(this,this.Language, this.searchKeywordResto, this._filterDataResto, this._sortDataResto,this.pagingResto), ((v) => {
                // tbVUserFavoriteAPI.getUserUnfavRestoList(this.Language, this.searchKeywordResto, this._filterDataResto, this._sortDataResto,this.pagingResto).then((v) => {
                  
                    this.pagingCounterResto = v.length;
                    if(v.length<SGHelperType.getPaging())this.setState({stopPullingResto:true})
                    else this.setState({stopPullingResto:false})
                    this.dataResto.arrData = v;
                    this.dataResto.isLoading = false;
                    this.dataResto.alreadyMount = true;
                    this.refreshResto=false
                    this.setState({ stopPullingResto:false, refreshResto: false });
                    this.forceUpdate();
                // })
                }).bind(this),  (()=>{this.setState({ stopPullingResto:false, refreshResto: false });}),  SGHelperGlobalVar.getVar("ResponTimes"));
            }
            else {
                this.currentUser = SGHelperGlobalVar.getVar('GlobalCurrentUser');
                this.imageSetting = SGHelperGlobalVar.getVar('GlobalImageSetting');
                this.dataResto.isLoading = true;
                // this.forceUpdate();
                this.baseRunSingleAPIWithRedoOption('getUserUnfavRestoListWithSearch', (async (v1,v2,v3,v4,v5) => { return tbVUserFavoriteAPI.getUserUnfavRestoListWithSearch(v1,v2,v3,v4,v5) }).bind(this,this.Language, this.searchKeywordResto, this._filterDataRestoSearch, this._sortDataRestoSearch,this.pagingResto), ((v) => {
                // tbVUserFavoriteAPI.getUserUnfavRestoListWithSearch(this.Language, this.searchKeywordResto, this._filterDataRestoSearch, this._sortDataRestoSearch,this.pagingResto).then((v) => {
                    this.pagingCounterResto = v.length;
                    if(v.length<SGHelperType.getPaging())this.setState({stopPullingResto:true})
                    else this.setState({stopPullingResto:false})
                    this.dataResto.arrData = v;
                    console.log(v);
                    this.dataResto.isLoading = false;
                    this.dataResto.alreadyMount = true;
                    this.refreshResto=false
                    this.setState({ stopPullingResto:false, refreshResto: false });
                    this.forceUpdate();

                }).bind(this),  (()=>{this.setState({ stopPullingResto:false, refreshResto: false });}),  SGHelperGlobalVar.getVar("ResponTimes"));
            }
           
        }       
    }

    async _onLoadPlace(){
        if(!this.state.loadingPlace && !this.state.stopPullingPlace){
            console.log("_onLoadPlace")
            this.setState({loadingPlace:true})
            this.pagingPlace = this.getPagingDataPlace()
            
            if (this.searchKeywordPlace === '') {
                this.currentUser = SGHelperGlobalVar.getVar('GlobalCurrentUser');
                this.imageSetting = SGHelperGlobalVar.getVar('GlobalImageSetting');
                this.baseRunSingleAPIWithRedoOption('getUserUnfavPlaceList', (async (v1,v2,v3,v4,v5) => { return tbVUserFavoriteAPI.getUserUnfavPlaceList(v1,v2,v3,v4,v5) }).bind(this,this.Language, this.searchKeywordPlace, this._filterDataPlace, this._sortDataPlace,this.pagingPlace), ((v) => {
                // tbVUserFavoriteAPI.getUserUnfavPlaceList(this.Language, this.searchKeywordPlace, this._filterDataPlace, this._sortDataPlace,this.pagingPlace).then((v) => {
                    var resData = v;
                    if(resData.length!==0){
                        for(var i=0;i<resData.length;i++){
                            this.dataPlace.arrData.push(resData[i])
                        }
                        this.pagingCounterPlace = this.pagingCounterPlace + resData.length
                       
                    }else this.setState({stopPullingPlace:true})
                    this.setState({loadingPlace:false})
                
                }).bind(this),  (()=>{ this.setState({loadingPlace:false})}),  SGHelperGlobalVar.getVar("ResponTimes"));
            }
            else {    
                this.currentUser = SGHelperGlobalVar.getVar('GlobalCurrentUser');
                this.imageSetting = SGHelperGlobalVar.getVar('GlobalImageSetting');
                this.baseRunSingleAPIWithRedoOption('getUserUnfavPlaceListWithSearch', (async (v1,v2,v3,v4,v5) => { return tbVUserFavoriteAPI.getUserUnfavPlaceListWithSearch(v1,v2,v3,v4,v5) }).bind(this,this.Language, this.searchKeywordPlace, this._filterDataPlaceSearch, this._sortDataPlaceSearch,this.pagingPlace), ((v) => {
                // tbVUserFavoriteAPI.getUserUnfavPlaceListWithSearch(this.Language, this.searchKeywordPlace, this._filterDataPlaceSearch, this._sortDataPlaceSearch,this.pagingPlace).then((v) => {
                
                    var resData = v;
                    if(resData.length!==0){
                        for(var i=0;i<resData.length;i++){
                            this.dataPlace.arrData.push(resData[i])
                        }
                        this.pagingCounterPlace = this.pagingCounterPlace + resData.length
                       
                    }else this.setState({stopPullingPlace:true})
                    this.setState({loadingPlace:false})
                   
                }).bind(this),  (()=>{    this.setState({loadingPlace:false})}),  SGHelperGlobalVar.getVar("ResponTimes"));
                // });
            }
        }
    }
    
    async _onLoadStore(){
        if(!this.state.loadingStore && !this.state.stopPullingStore){
            console.log("_onLoadStore")
            this.setState({loadingStore:true})
            this.pagingStore = this.getPagingDataStore()
          
            if (this.searchKeywordStore === '') {
                this.currentUser = SGHelperGlobalVar.getVar('GlobalCurrentUser');
                this.imageSetting = SGHelperGlobalVar.getVar('GlobalImageSetting');
                this.baseRunSingleAPIWithRedoOption('getUserUnfavStoreList', (async (v1,v2,v3,v4,v5) => { return tbVUserFavoriteAPI.getUserUnfavStoreList(v1,v2,v3,v4,v5) }).bind(this,this.Language, this.searchKeywordStore, this._filterDataStore, this._sortDataStore,this.pagingStore), ((v) => {
                // tbVUserFavoriteAPI.getUserUnfavStoreList(this.Language, this.searchKeywordStore, this._filterDataStore, this._sortDataStore,this.pagingStore).then((v) => {
                    var resData = v;
                    
                    if(resData.length!==0){
                        for(var i=0;i<resData.length;i++){
                            this.dataStore.arrData.push(resData[i])
                        }
                        this.pagingCounterStore = this.pagingCounterStore + resData.length
                       
                    }else this.setState({stopPullingStore:true})
                    this.setState({loadingStore:false})
                  
                // });
                }).bind(this),  (()=>{ this.setState({loadingStore:false})}),  SGHelperGlobalVar.getVar("ResponTimes"));
            }
            else {
                this.currentUser = SGHelperGlobalVar.getVar('GlobalCurrentUser');
                this.imageSetting = SGHelperGlobalVar.getVar('GlobalImageSetting');
                this.baseRunSingleAPIWithRedoOption('getUserUnfavStoreListWithSearch', (async (v1,v2,v3,v4,v5) => { return tbVUserFavoriteAPI.getUserUnfavStoreListWithSearch(v1,v2,v3,v4,v5) }).bind(this,this.Language, this.searchKeywordStore, this._filterDataStoreSearch, this._sortDataStoreSearch,this.pagingStore), ((v) => {
                // tbVUserFavoriteAPI.getUserUnfavStoreListWithSearch(this.Language, this.searchKeywordStore, this._filterDataStoreSearch, this._sortDataStoreSearch,this.pagingStore).then((v) => {
                    var resData = v;
                   
                    if(resData.length!==0){
                        for(var i=0;i<resData.length;i++){
                            this.dataStore.arrData.push(resData[i])
                        }
                        this.pagingCounterStore = this.pagingCounterStore + resData.length
                       
                    }else this.setState({stopPullingStore:true})
                    this.setState({loadingStore:false})
                // });
                }).bind(this),  (()=>{ this.setState({loadingStore:false})}),  SGHelperGlobalVar.getVar("ResponTimes"));
            }
        }
    }

    async _onLoadResto(){
        if(!this.state.loadingResto && !this.state.stopPullingResto){
            console.log("_onLoadResto")
            this.setState({loadingResto:true})
            this.pagingResto = this.getPagingDataResto()
            
            if (this.searchKeywordResto === '') {
                this.currentUser = SGHelperGlobalVar.getVar('GlobalCurrentUser');
                this.imageSetting = SGHelperGlobalVar.getVar('GlobalImageSetting');
                this.baseRunSingleAPIWithRedoOption('getUserUnfavRestoList', (async (v1,v2,v3,v4,v5) => { return tbVUserFavoriteAPI.getUserUnfavRestoList(v1,v2,v3,v4,v5) }).bind(this,this.Language, this.searchKeywordResto, this._filterDataResto, this._sortDataResto, this.pagingResto), ((v) => {
                // tbVUserFavoriteAPI.getUserUnfavRestoList(this.Language, this.searchKeywordResto, this._filterDataResto, this._sortDataResto, this.pagingResto).then((v) => {
                    var resData = v;
                    if(resData.length!==0){
                        for(var i=0;i<resData.length;i++){
                            this.dataResto.arrData.push(resData[i])
                        }
                        this.pagingCounterResto = this.pagingCounterResto + resData.length
                       
                    }else this.setState({stopPullingResto:true})
                    this.setState({loadingResto:false})
                // });
                }).bind(this),  (()=>{ this.setState({loadingResto:false})}),  SGHelperGlobalVar.getVar("ResponTimes"));
            }
            else {
                this.currentUser = SGHelperGlobalVar.getVar('GlobalCurrentUser');
                this.imageSetting = SGHelperGlobalVar.getVar('GlobalImageSetting');
                this.baseRunSingleAPIWithRedoOption('getUserUnfavRestoListWithSearch', (async (v1,v2,v3,v4,v5) => { return tbVUserFavoriteAPI.getUserUnfavRestoListWithSearch(v1,v2,v3,v4,v5) }).bind(this,this.Language, this.searchKeywordResto, this._filterDataRestoSearch, this._sortDataRestoSearch, this.pagingResto), ((v) => {
                // tbVUserFavoriteAPI.getUserUnfavRestoListWithSearch(this.Language, this.searchKeywordResto, this._filterDataRestoSearch, this._sortDataRestoSearch, this.pagingResto).then((v) => {
                    var resData = v;
                    if(resData.length!==0){
                        for(var i=0;i<resData.length;i++){
                            this.dataResto.arrData.push(resData[i])
                        }
                        this.pagingCounterResto = this.pagingCounterResto + resData.length
                       
                    }else this.setState({stopPullingResto:true})
                    this.setState({loadingResto:false})
                // });
                }).bind(this),  (()=>{ this.setState({loadingResto:false})}),  SGHelperGlobalVar.getVar("ResponTimes"));
            }
        }
    }

    constructor(props, context, ...args) {
        super(props, context, ...args);
        this.style = this.createStyleSheet(this.WHP);
        var { w, h, p } = this.WHP;
        this.props.navigation.setOptions({
            headerShown: false,
        });
        this.currentUser = SGHelperGlobalVar.getVar('GlobalCurrentUser');
        this.imageSetting = SGHelperGlobalVar.getVar('GlobalImageSetting');
        this.searchKeywordPlace = ''
        this.searchKeywordStore = ''
        this.searchKeywordResto = ''
        this.dataPlace = { arrData: [], isLoading: false, alreadyMount: false };
        this.dataStore = { arrData: [], isLoading: false, alreadyMount: false };
        this.dataResto = { arrData: [], isLoading: false, alreadyMount: false };
        this._filterDataPlace = filterDAO.getPlaceFilterData();
        this._sortDataPlace = sortDAO.getPlaceNoSearchSortData(this.Language.toUpperCase());

        this._filterDataStore = filterDAO.getStoreFilterData();
        this._sortDataStore = sortDAO.getStoreNoSearchSortData(this.Language.toUpperCase());

        this._filterDataResto = filterDAO.getRestoFilterData();
        this._sortDataResto = sortDAO.getRestoNoSearchSortData(this.Language.toUpperCase());
        
        this._filterDataPlaceSearch = filterDAO.getPlaceFilterData();
        this._sortDataPlaceSearch = sortDAO.getPlaceSearchSortData(this.Language.toUpperCase());
        this._filterDataStoreSearch = filterDAO.getStoreFilterData();
        this._sortDataStoreSearch = sortDAO.getStoreSearchSortData(this.Language.toUpperCase());
        this._filterDataRestoSearch = filterDAO.getRestoFilterData();
        this._sortDataRestoSearch = sortDAO.getRestoSearchSortData(this.Language.toUpperCase());
        this._buildingMatrix = [];
        this.selectedTab = 0;
        this.pvID = SGPopView.getPopViewID();
        this.surpriseReward = { fID: null, fRewardID: { fTargetName: '', fShortDescription: '', fImageJSON: [] }, fRewardEN: { fTargetName: '', fShortDescription: '', fImageJSON: [] }, fRewardCN: { fTargetName: '', fShortDescription: '', fImageJSON: [] } }

        // Paging
        this.state ={
            refreshPlace : false, refreshStore:false,refreshResto:false,refreshAll:false,
            loadingPlace : false, loadingStore: false, loadingResto :false,
            stopPullingPlace:false,stopPullingStore:false,stopPullingResto:false,
        }

        this.refreshPlace = false;
        this.refreshStore = false;
        this.refreshResto = false;
        this.pagingCounterPlace = 0;
        this.pagingCounterStore = 0;
        this.pagingCounterResto = 0;
    }

    _onChangeTab(e) {
        this.selectedTab = e.i;
        this.forceUpdate();
        if (!this._baseFlag) { this.baseAnimateSlideIn(); }
    }
    onHideReward() {
        SGPopView.hidePopView(this.pvID);
    }
    onShowReward() {
        this.forceUpdate();
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
            SGHelperErrorHandling.Handling(error,this._SurpriseRewardLikeMall.bind(this,buildingKey))
        }

    }

    _setSearchKeyword(value, type) {
        if (type === 'place') {
            this.searchKeywordPlace = value;
            this.forceUpdate();
        }
        if (type === 'store') {
            this.searchKeywordStore = value;
            this.forceUpdate();
        }
        if (type === 'resto') {
            this.searchKeywordResto = value;
            this.forceUpdate();
        }
    }

    async _setFilter(dataFilter,type) {
        this._filterData = dataFilter;
        if (type === 'place') {
            await this._onRefreshPlacePaging(true);
        }
        if (type === 'store') {
            await this._onRefreshStorePaging(true);
        }
        if (type === 'resto') {
            await this._onRefreshRestoPaging(true);
        }
    }

    async _setSort(dataSort) {
        if(this.searchKeywordPlace !== ''){
            this._sortDataPlace = dataSort;
            await this._onRefreshPlacePaging(true);
        }
        if(this.searchKeywordStore !== ''){
            this._sortDataStore = dataSort;
            await this._onRefreshStorePaging(true);
        }
        if(this.searchKeywordResto !== ''){
            this._sortDataResto = dataSort;
            await this._onRefreshRestoPaging(true);
        }
    }

    render() {
        var { w, h, p } = this.WHP;
        var style = this.style;
        var language = this.Language.toUpperCase()
        var tR = SGLocalize.translate
        return (
            <RootView accessible={true} accessibilityLabel={'AddFavoritesScreenRootView'} style={style.mainContainer}>
                <TabView tabBarFloatingStyle={{ position: 'absolute', top: SGHelperWindow.getHeaderHeight() + SGHelperWindow.getStatusBarHeight(), transform: [{ translateY: this._baseAnimY.interpolate({ inputRange: [-1, 0], outputRange: [0, SGHelperWindow.getHeaderHeight()] }) },], }} tabBarPosition={'floating'} accessible={true} accessibilityLabel={'AddFavoritesScreenTabView'} onChangeTab={this._onChangeTab.bind(this)} tabBarStyle={style.tabBarStyle} tabBarTextStyle={style.tabBarTextStyle} scrollableTabBar tabBarUnderlineStyle={style.tabBarUnderlineStyle} tabBarActiveTextColor={'#000000'} tabBarInactiveTextColor={'#716E6E'} tabBarActiveTextPreset={Text.preset.titleH2B} tabBarInactiveTextPreset={Text.preset.titleH2} style={{ backgroundColor: '#FFFFFF' }} initialPage={0} renderTabBar={() => <DefaultTabBar />}>
                    
                    {
                             this.dataPlace.alreadyMount ?
                                this.dataPlace.arrData.length !== 0 ?
                                    <FlatList  accessible={true} accessibilityLabel={'AddFavoritesScreenPlaceList'} tabLabel={SGLocalize.translate('AddFavoritesScreen.placeTabTitle')} showsVerticalScrollIndicator={false} contentContainerStyle={style.flatListBGColor} data={this.dataPlace.arrData} renderItem={({ item, index }) => {
                                        return (
                                            <SmallFavoritePlaceCard onFavorite={((item, s)=>{item.fUserFavoriteThis = s; this.forceUpdate();}).bind(this, item)} accessible={true} accessibilityLabel={'AddFavoritesScreenSmallFavPlaceCard'} smallMode navigator={this.props.navigation} language={this.Language} imageSetting={this.imageSetting} likeText={SGLocalize.translate("SeeAllFavoritesPlaceScreen.likeText")} favoriteIconLabel={SGLocalize.translate("SeeAllFavoritesPlaceScreen.favoriteIconLabel")} key={item.key} contentKey={item.key} dataContent={item['fContent' + this.Language.toUpperCase()]} placeCategory={item.fBuildingType} city={item.fCity} isUserFavoriteThis={item.fUserFavoriteThis?item.fUserFavoriteThis:'N'} style={style.containerView1}></SmallFavoritePlaceCard>
                                        );
                                    }} keyExtractor={item => item.key} 
                                        onEndReached={this._onLoadPlace.bind(this)}
                                        onEndReachedThreshold={SGHelperType.getThreshold()}
                                        ListFooterComponent={()=>{
                                            return(
                                                <React.Fragment>
                                                {
                                                    this.state.loadingPlace &&
                                                    <ActivityIndicator preset={ActivityIndicator.preset.h1} style={{ width: w, height: h * 0.05 }}></ActivityIndicator>
                                                }
                                                    <View style={{ width: '100%', height: SGHelperWindow.getHeaderHeight() }}></View>
                                                    <View style={{ width: '100%', height: SGHelperWindow.getFooterHeight() }}></View>
                                                </React.Fragment>
                                            )
                                        }}
                                        scrollEventThrottle={100} onScroll={this.baseOnScrollHandler.bind(this)} onMomentumScrollBegin={this.baseOnMomentumScrollBeginHandler.bind(this)} onScrollEndDrag={this.baseOnScrollEndDragHandler.bind(this)} onMomentumScrollEnd={this.baseOnMomentumScrollEndHandler.bind(this)} showsVerticalScrollIndicator={false} refreshControl={
                                        <RefreshControl refreshing={this.state.refreshPlace} onRefresh={this._onRefreshPlacePaging.bind(this)} />
                                    } ListHeaderComponent={
                                        <View style={{ height: SGHelperWindow.getHeaderHeight() * 3 + SGHelperWindow.getStatusBarHeight(), width: w, justifyContent: 'flex-end' }}>
                                            {
                                                this.state.refreshPlace &&
                                                <ActivityIndicator preset={ActivityIndicator.preset.h1} />
                                            }
                                        </View>
                                    }>
                                    </FlatList>
                                :
                                 
                                    <View tabLabel={SGLocalize.translate('AddFavoritesScreen.placeTabTitle')} style={{ flex: 1, justifyContent: 'flex-start'}}>
                                        <Text preset={Text.preset.titleH3} style={{ textAlign: 'center' }}>{SGLocalize.translate('AddFavoritesScreen.noMorePlaceToAdd')}</Text>
                                    </View>       
                                    
                            :
                                <View tabLabel={SGLocalize.translate('AddFavoritesScreen.placeTabTitle')} style={{ flex: 1}}>
                                    <ActivityIndicator preset={ActivityIndicator.preset.h1}></ActivityIndicator>
                                </View> 
                    }

                    {
                             this.dataStore.alreadyMount ?
                                this.dataStore.arrData.length !== 0 ?
                                    <FlatList accessible={true} accessibilityLabel={'AddFavoritesScreenStoreList'} tabLabel={SGLocalize.translate('AddFavoritesScreen.storeTabTitle')} showsVerticalScrollIndicator={false} contentContainerStyle={style.flatListBGColor} data={this.dataStore.arrData} renderItem={({ item, index }) => {
                                        return (
                                            <SmallFavoriteStoreCard onFavorite={((item, s)=>{item.fUserFavoriteThis = s; this.forceUpdate();}).bind(this, item)} accessible={true} accessibilityLabel={'AddFavoritesScreenSmallFavStoreCard'} navigator={this.props.navigation} language={this.Language} imageSetting={this.imageSetting} likeText={SGLocalize.translate("SeeAllFavoritesStoreScreen.likeText")} locationText={SGLocalize.translate("SeeAllFavoritesStoreScreen.locationText")} lastVisitedText={SGLocalize.translate("SeeAllFavoritesStoreScreen.lastVisitedText")} key={item.key} contentKey={item.key} dataContent={item['fContentStore' + this.Language.toUpperCase()]} placeName={item['fBuildingName' + this.Language.toUpperCase()]} city={item.fCity} isUserFavoriteThis={item.fUserFavoriteThis?item.fUserFavoriteThis:'N'} style={style.containerView1}></SmallFavoriteStoreCard>
                                        );
                                    }} keyExtractor={item => item.key} 
                                    onEndReached={this._onLoadStore.bind(this)}
                                    onEndReachedThreshold={SGHelperType.getThreshold()}
                                    ListFooterComponent={()=>{
                                        return(
                                            <React.Fragment>
                                            {
                                                this.state.loadingStore &&
                                                <ActivityIndicator preset={ActivityIndicator.preset.h1} style={{ width: w, height: h * 0.05 }}></ActivityIndicator>
                                            }
                                                <View style={{ width: '100%', height: SGHelperWindow.getHeaderHeight() }}></View>
                                                <View style={{ width: '100%', height: SGHelperWindow.getFooterHeight() }}></View>
                                            </React.Fragment>
                                        )
                                    }}
                                    scrollEventThrottle={100} onScroll={this.baseOnScrollHandler.bind(this)} onMomentumScrollBegin={this.baseOnMomentumScrollBeginHandler.bind(this)} onScrollEndDrag={this.baseOnScrollEndDragHandler.bind(this)} onMomentumScrollEnd={this.baseOnMomentumScrollEndHandler.bind(this)} showsVerticalScrollIndicator={false} refreshControl={
                                        <RefreshControl refreshing={this.state.refreshStore} onRefresh={this._onRefreshStorePaging.bind(this)} />
                                    } ListHeaderComponent={
                                        <View style={{ height: SGHelperWindow.getHeaderHeight() * 3 + SGHelperWindow.getStatusBarHeight(), width: w, justifyContent: 'flex-end' }}>
                                            {
                                                this.state.refreshStore &&
                                                <ActivityIndicator preset={ActivityIndicator.preset.h1} />
                                            }
                                        </View>
                                    }>
                                    </FlatList>
                                    :
                                    <View tabLabel={SGLocalize.translate('AddFavoritesScreen.storeTabTitle')} style={{ flex: 1, justifyContent: 'flex-start'}}>
                                        <Text preset={Text.preset.titleH3} style={{ textAlign: 'center' }}>{SGLocalize.translate('AddFavoritesScreen.noMoreStoreToAdd')}</Text>
                                    </View>      
                                    
                                :
                            <View tabLabel={SGLocalize.translate('AddFavoritesScreen.storeTabTitle')} style={{ flex: 1}}>
                                
                                <ActivityIndicator preset={ActivityIndicator.preset.h1}></ActivityIndicator>
                            </View>   
                    }


                    {
                             this.dataResto.alreadyMount ?
                                this.dataResto.arrData.length !== 0 ?
                                    <FlatList accessible={true} accessibilityLabel={'AddFavoritesScreenRestoList'} tabLabel={SGLocalize.translate('AddFavoritesScreen.restoTabTitle')} showsVerticalScrollIndicator={false} contentContainerStyle={style.flatListBGColor} data={this.dataResto.arrData} renderItem={({ item, index }) => {
                                        return (
                                            <SmallFavoriteRestoCard onFavorite={((item, s)=>{item.fUserFavoriteThis = s; this.forceUpdate();}).bind(this, item)} accessible={true} accessibilityLabel={'AddFavoritesScreenSmallFavRestoCard'} smallMode navigator={this.props.navigation} language={this.Language} imageSetting={this.imageSetting} likeText={SGLocalize.translate("SeeAllFavoritesRestoScreen.likeText")} locationText={SGLocalize.translate("SeeAllFavoritesRestoScreen.locationText")} lastVisitedText={SGLocalize.translate("SeeAllFavoritesRestoScreen.lastVisitedText")} key={item.key} contentKey={item.key} dataContent={item['fContentStore' + this.Language.toUpperCase()]} placeName={item['fBuildingName' + this.Language.toUpperCase()]} city={item.fCity} isUserFavoriteThis={item.fUserFavoriteThis?item.fUserFavoriteThis:'N'} style={style.containerView1}></SmallFavoriteRestoCard>
                                        );
                                    }} keyExtractor={item => item.key}
                                        onEndReached={this._onLoadResto.bind(this)}
                                        onEndReachedThreshold={SGHelperType.getThreshold()}
                                        ListFooterComponent={()=>{
                                            return(
                                                <React.Fragment>
                                                {
                                                    this.state.loadingResto &&
                                                    <ActivityIndicator preset={ActivityIndicator.preset.h1} style={{ width: w, height: h * 0.05 }}></ActivityIndicator>
                                                }
                                                    <View style={{ width: '100%', height: SGHelperWindow.getHeaderHeight() }}></View>
                                                    <View style={{ width: '100%', height: SGHelperWindow.getFooterHeight() }}></View>
                                                </React.Fragment>
                                            )
                                     
                                        }}
                                    scrollEventThrottle={100} onScroll={this.baseOnScrollHandler.bind(this)} onMomentumScrollBegin={this.baseOnMomentumScrollBeginHandler.bind(this)} onScrollEndDrag={this.baseOnScrollEndDragHandler.bind(this)} onMomentumScrollEnd={this.baseOnMomentumScrollEndHandler.bind(this)} showsVerticalScrollIndicator={false} refreshControl={
                                        <RefreshControl refreshing={this.state.refreshResto} onRefresh={this._onRefreshRestoPaging.bind(this)} />
                                    } ListHeaderComponent={
                                        <View style={{ height: SGHelperWindow.getHeaderHeight() * 3 + SGHelperWindow.getStatusBarHeight(), width: w, justifyContent: 'flex-end' }}>
                                            {
                                                this.state.refreshResto &&
                                                <ActivityIndicator preset={ActivityIndicator.preset.h1} />
                                            }
                                        </View>
                                    }>
                                    </FlatList>
                                    :
                                    <View tabLabel={SGLocalize.translate('AddFavoritesScreen.restoTabTitle')} style={{ flex: 1, justifyContent: 'flex-start' }}>
                                        <Text preset={Text.preset.titleH3} style={{ textAlign: 'center' }}>{SGLocalize.translate('AddFavoritesScreen.noMoreRestoToAdd')}</Text>
                                    </View>     
                                    
                                :
                            <View tabLabel={SGLocalize.translate('AddFavoritesScreen.restoTabTitle')} style={{ flex: 1}}>
                                <ActivityIndicator preset={ActivityIndicator.preset.h1}></ActivityIndicator>
                            </View>  
                    }
                </TabView>
                {/* <View style={{width:w,height:w*0.12,backgroundColor:'transparent'}}></View> */}
                <Animated.View style={{ position: 'absolute', transform: [{ translateY: this._baseAnimY.interpolate({ inputRange: [-1, 0], outputRange: [(SGHelperWindow.getStatusBarHeight() - SGHelperWindow.getHeaderHeight()), SGHelperWindow.getStatusBarHeight()] }) },], height: SGHelperWindow.getHeaderHeight(), width: '100%' }}>
                    <AddFavoritesSearchBar hidden={this.selectedTab !== 0} accessible={true} accessibilityLabel={'AddFavoritesScreenSearchBarPlace'} language={this.Language} screen='AddFavorites' searchKeyword={this.searchKeywordPlace} tab={'place'} setSearchKeyword={this._setSearchKeyword.bind(this)} onRefreshPlace={this._onRefreshPlacePaging.bind(this)} sortData={this.searchKeywordPlace !== '' ? this._sortDataPlaceSearch : this._sortDataPlace }  onApplySort={ this._setSort.bind(this,'place') } onPressFilter={() => { SGHelperNavigation.navigatePush(this.props.navigation, 'Filter', { filterData: this.searchKeywordPlace !== '' ? this._filterDataPlaceSearch : this._filterDataPlace, buildingMatrix: this._buildingMatrix, onApplyFilter: (v) => { this._setFilter(v,'place') }, onCloseFilter: (v) => { console.log(v) } }) }} navigator={this.props.navigation} imageSetting={this.imageSetting} style={this.style.containerView1}></AddFavoritesSearchBar>
                    <AddFavoritesSearchBar hidden={this.selectedTab !== 1} accessible={true} accessibilityLabel={'AddFavoritesScreenSearchBarStore'} language={this.Language} screen='AddFavorites' searchKeyword={this.searchKeywordStore} tab={'store'} setSearchKeyword={this._setSearchKeyword.bind(this)} onRefreshStore={this._onRefreshStorePaging.bind(this)} sortData={this.searchKeywordStore !== '' ? this._sortDataStoreSearch : this._sortDataStore} onApplySort={ this._setSort.bind(this,'store') } onPressFilter={() => { SGHelperNavigation.navigatePush(this.props.navigation, 'Filter', { filterData: this.searchKeywordStore !== '' ? this._filterDataStoreSearch : this._filterDataStore, buildingMatrix: this._buildingMatrix, onApplyFilter: (v) => { this._setFilter(v,'store') }, onCloseFilter: (v) => { console.log(v) } }) }} navigator={this.props.navigation} imageSetting={this.imageSetting} style={this.style.containerView1}></AddFavoritesSearchBar>
                    <AddFavoritesSearchBar hidden={this.selectedTab !== 2} accessible={true} accessibilityLabel={'AddFavoritesScreenSearchBarResto'} language={this.Language} screen='AddFavorites' searchKeyword={this.searchKeywordResto} tab={'resto'} setSearchKeyword={this._setSearchKeyword.bind(this)} onRefreshResto={this._onRefreshRestoPaging.bind(this)} sortData={this.searchKeywordResto !== '' ? this._sortDataRestoSearch : this._sortDataResto} onApplySort={ this._setSort.bind(this,'resto') } onPressFilter={() => { SGHelperNavigation.navigatePush(this.props.navigation, 'Filter', { filterData: this.searchKeywordResto !== '' ? this._filterDataRestoSearch : this._filterDataResto, buildingMatrix: this._buildingMatrix, onApplyFilter: (v) => { this._setFilter(v,'resto') }, onCloseFilter: (v) => { console.log(v) } }) }} navigator={this.props.navigation} imageSetting={this.imageSetting} style={this.style.containerView1}></AddFavoritesSearchBar>
                </Animated.View>
                
                <Animated.View style={{ position: 'absolute', transform: [{ translateY: this._baseAnimY.interpolate({ inputRange: [-1, 0], outputRange: [SGHelperWindow.getStatusBarHeight(), SGHelperWindow.getStatusBarHeight() + SGHelperWindow.getHeaderHeight()] }) },], height: SGHelperWindow.getHeaderHeight(), width: '100%' }}>
                    <RibbonHeader imageSetting={this.imageSetting} title={SGLocalize.translate("AddFavoritesScreen.screenTitle")}></RibbonHeader>
                </Animated.View>

                <View style={{ position: 'absolute', height: SGHelperWindow.getStatusBarHeight(), backgroundColor: '#181818', width: '100%' }}></View>

                <Animated.View style={{ position: 'absolute', transform: [{ translateY: this._baseAnimY.interpolate({ inputRange: [-1, 0], outputRange: [SGHelperWindow.getWHPNoHeader().h + 8 * p, SGHelperWindow.getWHPNoHeader().h - Math.max(SGHelperWindow.getFooterHeight(), 2 * p) - SGHelperWindow.getHeaderHeight()] }) },], height: Math.max(SGHelperWindow.getFooterHeight(), 2 * p) + SGHelperWindow.getHeaderHeight(), width: '100%' }}>
                    <BottomNavigationContainer navigator={this.props.navigation} style={style.throwWHP}>
                    </BottomNavigationContainer>
                </Animated.View>
            </RootView>
        );
    }
}