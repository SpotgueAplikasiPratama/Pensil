/*
    Change log by Melvin 2 Maret 2021 11:09 - Active List Add Link Get More to My Refferal
     
* Version 1.2.0
* 1. Leon 10-11 Apr 2021
 * - add ErrorHandling
 * 2. Yohanes 13 Apr 2021
 * - fix Parking 
*/

import React from 'react';
import { StyleSheet, Animated } from 'react-native';
import { SGRootView as RootView, SGTabView as TabView, SGText as Text, SGView as View, SGFlatList as FlatList, SGActivityIndicator as ActivityIndicator,SGScrollView as ScrollView } from '../../../core/control';
import { ModuleHeader } from '../../component_V2/ModuleHeader';
import { SGBaseScreen } from '../../../core/screen/SGBaseScreen';
import { BottomNavigationContainer } from '../../component_V2/BottomNavigationContainer';
import { RewardCard } from '../../container_V2/RewardCard';
import { SGLocalize } from '../../locales/SGLocalize';
import { SGHelperGlobalVar, SGHelperWindow,SGHelperType ,SGHelperErrorHandling} from '../../../core/helper';
import { RibbonHeader } from '../../component_V2/RibbonHeader';
import { MyMenuBar } from '../../component_V2/MyMenuBar';
import { VRewardAPI } from '../../api/VRewardAPI'
import { EmptyDetailView } from '../../container_V2/EmptyDetailView';
import { TabMyRewardList } from '../../container_V2/TabMyRewardList';
import {MyReferralInMyRewardScreen} from './MyReferralInMyRewardScreen';
import {tbVAuctionAPI} from '../../api/tbVAuctionAPI';
import { VFilterOptionsAPI } from '../../api/VFilterOptionsAPI';
import { TabAuction } from '../../container_V2/TabAuction';
import { filterDAO } from '../../db/filterDAO';

export class MyRewardsScreen extends SGBaseScreen {

    getFilterData(){
        return([
            { name: this._language.toUpperCase(), operator: 'SEARCH', value: this.searchKeyword.keyword },
            { name: 'fRedeemedStatus', operator: '=', value: 'N' },
            { name: 'fExpiredStatus', operator: '!=', value: 'Y' },
            { name: 'fType', operator: 'IN', value: null, type: 'multi', title: SGLocalize.translate('filterSubTitle.typeRewardTitle'), group: SGLocalize.translate('filterGroup.typeReward'),optionList: this.getRewardTypeFilterList(), visible: true },
        ])
    }

    getRewardTypeFilterList() {
        return (
            [
                { key: 'building', title: SGLocalize.translate('filterSubTitle.typeRewardMallTitle')},
                { key: 'resto', title: SGLocalize.translate('filterSubTitle.typeRewardRestoTitle') },
                { key: 'store', title: SGLocalize.translate('filterSubTitle.typeRewardStoreTitle')}
            ]
        )
    }

    getSortData(){
        return([
            { name: 'rank', descending: true, title: SGLocalize.translate('sortOptions.MostRelevant'), selected: false, visible: false },
            { name: 'fLastModifiedDate', descending: true, title: SGLocalize.translate('sortOptions.Newest'), selected: true, visible: true },
            { name: 'fLastModifiedDate', descending: false, title: SGLocalize.translate('sortOptions.Oldest'), selected: false, visible: true },
            { name: 'fExpiredUseDate', descending: false, selected: true },
            { name: 'fID', descending: true, selected: true, visible: false },
        ])
    }

    getFilterDataHistory(){
        return([
            { name: 'fType', operator: 'IN', value: null, type: 'multi', title: 'Tipe Hadiah', group: 'Tipe',optionList: this.getRewardTypeFilterList(), visible: true },
        ])
    }

    getSortDataHistory(){
        return([
            { name: 'fLastModifiedDate', descending: true, title: SGLocalize.translate('sortOptions.Newest'), selected: true, visible: true },
            { name: 'fLastModifiedDate', descending: false, title: SGLocalize.translate('sortOptions.Oldest'), selected: false, visible: true },
            { name: 'fUsedDate', descending: true, selected: true },
            { name: 'fID', descending: true, selected: true, visible: false }
        ])
    }

     //Auction
     getDataFilterAuctionActive() {
        return ([
            { name: 'fActive', operator: '=', value: 'Y', visible: false },
        ]);
    }

    getDataFilterAuctionHistory() {
        return ([
            { name: 'fActive', operator: '=', value: 'N', visible: false },
        ]);
    }

    getSortAuctionDataActive() {
        return ([
            { name: 'fStartDate', descending: false, selected: true, visible: false },
            { name: 'auctionfID', descending: false, selected: true, visible: false },
        ]);
    }

    getSortAuctionDataHistory() {
        return ([
            { name: 'fStartDate', descending: false, selected: true, visible: false },
            { name: 'auctionfID', descending: false, selected: true, visible: false },
        ]);
    }


    getPagingData(){
        var itemPerPage = SGHelperType.getPaging()
        return {paging:true,offset:this.pagingCounterData, totalPerPage:itemPerPage}
    }
    getPagingDataHistory(){
        var itemPerPage = SGHelperType.getPaging()
        return {paging:true,offset:this.pagingCounterDataHistory, totalPerPage:itemPerPage}
    }

    getPagingAuction(){
        var itemPerPage = SGHelperType.getPaging()
        return {paging:true,offset:this.pagingCounterAuction, totalPerPage:itemPerPage}
    }

    getPagingAuctionHistory(){
        var itemPerPage = SGHelperType.getPaging()
        return {paging:true,offset:this.pagingCounterAuctionHistory, totalPerPage:itemPerPage}
    }

    createStyleSheet = (whp) => {
        var { w, h, p } = whp;
        return StyleSheet.create({
            throwWHP: { width: w, height: h, padding: p },
            mainContainer: { width: w, height: h, backgroundColor: '#FFFFFF' },
            containerView1: { width: w, height: h, padding: p, backgroundColor: 'white' },
            containerView2: { width: w, height: w * 0.6, padding: p },
            sv1: { backgroundColor: 'white' },
            sv1_2: { backgroundColor: 'white', justifyContent: 'flex-start', alignItems: 'center', },
            tabBarStyle: { borderColor: '#E4E4E4', borderBottomWidth: w * 0.003, borderTopWidth: w * 0.003, width:w },
            tabBarUnderlineStyle: { backgroundColor: '#1E1E1E' },
            text1:{},
        });
    }

    constructor(props, context, ...args) {
        super(props, context, ...args);
        this.style = this.createStyleSheet(this.WHP);
        this.props.navigation.setOptions({
            headerShown: false
        });
        this.currentUser = SGHelperGlobalVar.getVar('GlobalCurrentUser');
        this.currentUserData = SGHelperGlobalVar.getVar('GlobalCurrentUserData');
        this.imageSetting = SGHelperGlobalVar.getVar('GlobalImageSetting');
        this.currentUserImage = SGHelperGlobalVar.getVar('GlobalCurrentUserImage');
        this.rewardData = [];
        this.rewardDataHistory = [];
        this.rewardDataActive = [];
        this.searchKeyword = {keyword: ''}

        this.filterData = this.getFilterData();
        this.sortData = this.getSortData();
        
        this.filterDataHistory =  this.getFilterDataHistory();
        this.sortDataHistory = this.getSortDataHistory();

         // auction
         this.filterAuction = this.getDataFilterAuctionActive();
         this.sortAuction = this.getSortAuctionDataActive();
         this.filterAuctionHistory = this.getDataFilterAuctionHistory();
         this.sortAuctionHistory = this.getSortAuctionDataHistory();

        this.alreadyMount = false;
        this.state = { 
            refreshData:false,refreshDataHistory:false,refreshAll:false,
            loadingData :false, loadingDataHistory:false,
            stopPullingData :false, stopPullingDataHistory:false,
            filterAuction : this.filterAuction,sortAuction : this.sortAuction,
            filterAuctionHistory : this.filterAuctionHistory,sortAuctionHistory : this.sortAuctionHistory,
            refreshAuction : false,refreshAuctionHistory:false,
            loadingAuction:false,loadingAuctionHistory:false,
            stopPullingAuction:false,stopPullingAuctionHistory:false,
        };
        this.refreshData =false;
        this.refreshDataHistory =false;
        this.refreshAuction = false
        this.refreshAuctionHistory = false
        this.pagingCounterData =0;
        this.pagingCounterDataHistory = 0;
        this.pagingCounterAuction = 0;
        this.pagingCounterAuctionHistory = 0;
        this.counterBatch=0
        this.errorBatch = []
        this._tabIndex = 0;
       
    }
    async componentDidMount() {
        await this._callRewardAPI(true);
        this._unsubscribe = this.props.navigation.addListener('focus', async (res) => {
            await this._callRewardAPI();
        });
    }

    componentWillUnmount() {
        if (this._unsubscribe) { this._unsubscribe(); }
    }

    async _callBackForceUpdate() {
        await this._callRewardAPI(true)
    }

    checkAPIBatchStatusAllDone() {
        this.pagingCounterData = this.rewardDataActive.length;
        this.pagingCounterDataHistory = this.rewardDataHistory.length;
        this.pagingCounterAuction = this.dataAuction.length;
        this.pagingCounterAuctionHistory = this.dataAuctionHistory.length;
        this.alreadyMount = true;
        this.setState({ refreshData:false,refreshDataHistory:false,
            filterAuction : this.filterAuction,filterAuctionHistory : this.filterAuctionHistory,sortAuction:this.sortAuction,sortAuctionHistory:this.sortAuctionHistory,
            refreshAuction:false,refreshAuctionHistory : false
        })
        this.forceUpdate();
    }
    
    async _callRewardAPI(resetPaging=false) {

        if(resetPaging){
            this.pagingCounterData= 0
            this.pagingCounterDataHistory= 0
            this.pagingCounterAuction = 0
            this.pagingCounterAuctionHistory = 0

            this.pagingData = this.getPagingData()
            this.pagingDataHistory = this.getPagingDataHistory()
            this.pagingAuction = this.getPagingAuction();
            this.pagingAuctionHistory = this.getPagingAuctionHistory();
            this.baseInitAPIParallel(SGHelperGlobalVar.getVar("ResponTimes"), (() => { this.checkAPIBatchStatusAllDone(); }).bind(this));

            this.baseAddAPIParallel('searchRedeemReward', (async (v1,v2,v3) => { return VRewardAPI.searchRedeemReward(v1,v2,v3); }).bind(this,this.filterData,this.sortData,this.pagingData), ((v) => {
                this.rewardDataActive = v;
                if(v.length<SGHelperType.getPaging())this.setState({stopPullingData:true})
                else this.setState({stopPullingData:false})
            }).bind(this),  null);
            
         
            
            this.baseAddAPIParallel('searchRedeemRewardHistory', (async (v1,v2,v3) => { return VRewardAPI.searchRedeemRewardHistory(v1,v2,v3); }).bind(this, this.filterDataHistory, this.sortDataHistory,this.pagingDataHistory), ((v) => {
                this.rewardDataHistory = v;
                console.log(this.rewardDataHistory)
                console.log('lihat reward history')
                if(v.length<SGHelperType.getPaging())this.setState({stopPullingDataHistory:true})
                else this.setState({stopPullingDataHistory:false})
            }).bind(this),  null);
            
            this.baseAddAPIParallel('SearchMyBookingAuctionActive', (async (v1,v2,v3) => { return tbVAuctionAPI.searchMyBookingAuction(v1,v2,v3); }).bind(this,this.filterAuction, this.sortAuction,this.pagingAuction), ((v) => {
                this.dataAuction = v;
                console.log('auction active')
                console.log(this.dataAuction);
                if(v.length<SGHelperType.getPaging())this.setState({stopPullingAuction:true})
                else this.setState({stopPullingAuction:false})
            }).bind(this),  null);

            this.baseAddAPIParallel('SearchMyBookingAuctionHistory', (async (v1,v2,v3) => { return tbVAuctionAPI.searchMyBookingAuction(v1,v2,v3); }).bind(this,this.filterAuctionHistory, this.sortAuctionHistory,this.pagingAuctionHistory), ((v) => {
                this.dataAuctionHistory = v;
                console.log('auction history')
                console.log(this.dataAuctionHistory);
                if(v.length<SGHelperType.getPaging())this.setState({stopPullingAuctionHistory:true})
                else this.setState({stopPullingAuctionHistory:false})
            }).bind(this),  null);

            this.baseRunAPIParallel();
        }       
    }

    async _onRefreshData(){

        this.setState({ refreshData: true ,stopPullingData:true})
        if(!this.refreshData && !this.state.loadingData){
            this.filterData[0].value = this.searchKeyword.keyword
            if(this.searchKeyword.keyword != ''){
                this.sortData[0].visible = true
            }else{
                if(this.sortData[0].selected == true){
                    this.sortData[1].selected = true
                    this.sortData[0].selected = false
                    this.sortData[0].visible = false
                }
            }
            this.refreshData= true
            this.pagingCounterData = 0
            this.pagingData = this.getPagingData()


            this.baseRunSingleAPIWithRedoOption('searchRedeemReward', (async (v1, v2, v3) => {  return VRewardAPI.searchRedeemReward(v1, v2, v3) }).bind(this, this.filterData,this.sortData,this.pagingData), ((v) => {           
                this.rewardDataActive = v//await VRewardAPI.searchRedeemReward(this.filterData,this.sortData,this.pagingData)
                console.log(this.rewardDataActive)
                console.log('lihat lah sini')
                if(v.length<SGHelperType.getPaging())this.setState({stopPullingData:true})
                else this.setState({stopPullingData:false})
                this.pagingCounterData =  this.rewardDataActive.length
                this.refreshData=false
                this.setState({  refreshData: false });
                this.forceUpdate()
            }).bind(this), (()=>{ this.setState({loading:false}) }), SGHelperGlobalVar.getVar("ResponTimes"));
        }
        
    }

    async _onRefreshDataHistory(){

        this.setState({ refreshDataHistory: true ,stopPullingDataHistory:true})
        if(!this.refreshDataHistory && !this.state.loadingDataHistory){
            this.refreshDataHistory= true
            this.pagingCounterDataHistory = 0
            this.pagingDataHistory = this.getPagingDataHistory()
           
            this.baseRunSingleAPIWithRedoOption('searchRedeemRewardHistory', (async (v1, v2, v3) => {  return VRewardAPI.searchRedeemRewardHistory(v1, v2, v3) }).bind(this, this.filterDataHistory, this.sortDataHistory,this.pagingDataHistory), ((v) => {           
                this.rewardDataHistory = v//await VRewardAPI.searchRedeemRewardHistory(this.filterDataHistory, this.sortDataHistory,this.pagingDataHistory)
                
                if(v.length<SGHelperType.getPaging())this.setState({stopPullingDataHistory:true})
                else this.setState({stopPullingDataHistory:false})

                this.pagingCounterDataHistory =  this.rewardDataHistory.length
                this.refreshDataHistory=false
                this.setState({  refreshDataHistory: false });
                this.forceUpdate()
            }).bind(this), (()=>{ this.setState({loading:false}) }), SGHelperGlobalVar.getVar("ResponTimes"));
        }

    }

    async _onRefreshAuction() {
        this.setState({ refreshAuction: true ,stopPullingAuction:true})
        if(!this.refreshAuction && !this.state.loadingAuction){
            this.refreshAuction = true
            this.pagingCounterAuction = 0
            this.pagingAuction = this.getPagingAuction();

            this.baseRunSingleAPIWithRedoOption('SearchMyBookingAuctionActive', (async (v1,v2,v3) => { return tbVAuctionAPI.searchMyBookingAuction(v1,v2,v3); }).bind(this,this.filterAuction, this.sortAuction,this.pagingAuction), ((v) => {
            this.dataAuction = v
            this.pagingCounterAuction = this.dataAuction.length
            if(v.length<SGHelperType.getPaging())this.setState({stopPullingAuction:true})
            else this.setState({stopPullingAuction:false})
            this.refreshAuction =false
            this.setState({ refreshAuction: false});
            this.forceUpdate()
            }).bind(this), null,SGHelperGlobalVar.getVar("ResponTimes") );
        }
    }

    async _onRefreshAuctionHistory() {
        this.setState({ refreshAuctionHistory: true ,stopPullingAuctionHistory:true})
        if(!this.refreshAuctionHistory && !this.state.loadingAuctionHistory){
            this.refreshAuctionHistory= true
            this.pagingCounterAuctionHistory = 0
            this.pagingAuctionHistory = this.getPagingAuctionHistory();

            this.baseRunSingleAPIWithRedoOption('SearchMyBookingAuctionHistory', (async (v1,v2,v3) => { return tbVAuctionAPI.searchMyBookingAuction(v1,v2,v3); }).bind(this,this.filterAuctionHistory, this.sortAuctionHistory,this.pagingAuctionHistory), ((v) => {
            this.dataAuctionHistory = v
            this.pagingCounterAuctionHistory = this.dataAuctionHistory.length
            if(v.length<SGHelperType.getPaging())this.setState({stopPullingAuctionHistory:true})
            else this.setState({stopPullingAuctionHistory:false})
            this.refreshAuctionHistory =false
            this.setState({ refreshAuctionHistory: false});
            this.forceUpdate()
            }).bind(this), null,SGHelperGlobalVar.getVar("ResponTimes") );
        }
    }
    async _onLoadData(){
        console.log('load')
        if(!this.state.loadingData && !this.state.stopPullingData){
            this.setState({loadingData:true})
            this.pagingData = this.getPagingData()
           
            this.baseRunSingleAPIWithRedoOption('searchRedeemReward', (async (v1, v2, v3) => {  return VRewardAPI.searchRedeemReward(v1, v2, v3) }).bind(this, this.filterData,this.sortData,this.pagingData), ((v) => {           
                var resData =  v//await VRewardAPI.searchRedeemReward(this.filterData,this.sortData,this.pagingData)
                if(resData.length!==0){
                    for(var i=0;i<resData.length;i++){
                        this.rewardDataActive.push(resData[i])
                    }
                    this.pagingCounterData = this.pagingCounterData + resData.length
                    
                }else this.setState({stopPullingData:true})
                this.setState({loadingData:false})
            }).bind(this), (()=>{ this.setState({loadingData:false}) }), SGHelperGlobalVar.getVar("ResponTimes"));
        }
    }

    async _onLoadDataHistory(){
        console.log('loadHistory')
        if(!this.state.loadingDataHistory && !this.state.stopPullingDataHistory){
            this.setState({loadingDataHistory:true})
            this.pagingDataHistory = this.getPagingDataHistory()
            console.log(this.pagingDataHistory);

        this.baseRunSingleAPIWithRedoOption('searchRedeemRewardHistory', (async (v1, v2, v3) => { return VRewardAPI.searchRedeemRewardHistory(v1, v2, v3) }).bind(this, this.filterDataHistory, this.sortDataHistory,this.pagingDataHistory), ((v) => {           
            var resData =  v//await VRewardAPI.searchRedeemRewardHistory(this.filterDataHistory, this.sortDataHistory,this.pagingDataHistory)
            if(resData.length!==0){
                for(var i=0;i<resData.length;i++){
                    this.rewardDataHistory.push(resData[i])
                }
                this.pagingCounterDataHistory = this.pagingCounterDataHistory + resData.length
               
            }else this.setState({stopPullingDataHistory:true})
            this.setState({loadingDataHistory:false})
        }).bind(this), (()=>{ this.setState({loadingDataHistory:false}) }), SGHelperGlobalVar.getVar("ResponTimes"));
        }
    }
    
    async _onLoadAuction(){
       
        if(!this.state.loadingAuction && !this.state.stopPullingAuction){
            this.setState({loadingAuction:true})
            this.pagingAuction = this.getPagingAuction()

            this.baseRunSingleAPIWithRedoOption('SearchMyBookingAuctionActive', (async (v1, v2, v3) => {  return tbVAuctionAPI.searchMyBookingAuction(v1,v2,v3); }).bind(this,this.filterAuction, this.sortAuction,this.pagingAuction), ((v) => {
            var resData =  v
            if(resData.length!==0){
                for(var i=0;i<resData.length;i++){
                    this.dataAuction.push(resData[i])
                }
                this.pagingCounterAuction = this.pagingCounterAuction + resData.length
               
            }else this.setState({stopPullingAuction:true})
            this.setState({loadingAuction:false})
        }).bind(this), (()=>{ this.setState({loadingAuction:false}) }), SGHelperGlobalVar.getVar("ResponTimes"));
        }
    }

    async _onLoadAuctionHistory(){
       
        if(!this.state.loadingAuctionHistory && !this.state.stopPullingAuctionHistory){
            this.setState({loadingAuctionHistory:true})
            this.pagingAuctionHistory = this.getPagingAuctionHistory()

            this.baseRunSingleAPIWithRedoOption('SearchMyBookingAuctionHistory', (async (v1, v2, v3) => {  return tbVAuctionAPI.searchMyBookingAuction(v1,v2,v3); }).bind(this,this.filterAuctionHistory, this.sortAuctionHistory,this.pagingAuctionHistory), ((v) => {
            var resData =  v
            if(resData.length!==0){
                for(var i=0;i<resData.length;i++){
                    this.dataAuctionHistory.push(resData[i])
                }
                this.pagingCounterAuctionHistory = this.pagingCounterAuctionHistory + resData.length
               
            }else this.setState({stopPullingAuctionHistory:true})
            this.setState({loadingAuctionHistory:false})
        }).bind(this), (()=>{ this.setState({loadingAuctionHistory:false}) }), SGHelperGlobalVar.getVar("ResponTimes"));
        }
    }

    _renderTitle(){
       if(this._tabIndex ==0) return SGLocalize.translate("MyRewardsScreen.Title")
       else if (this._tabIndex ==1) return SGLocalize.translate("MyRewardsScreen.MyRefferal")
       else if (this._tabIndex ==2) return SGLocalize.translate("MyRewardsScreen.tabAuctionTittle")
    }
    render() {
        var { w, h, p } = this.WHP;
        var style = this.style;
        return (
            <RootView dummyStatusBar accessible={true} accessibilityLabel={'MyRewardsScreenRootView'} style={style.mainContainer}>
                <Animated.View style={{ height: this._baseAnimY.interpolate({ inputRange: [-1, 0], outputRange: [0, SGHelperWindow.getHeaderHeight()] }), width: '100%' }} />
                <RibbonHeader borderTopOff style={{ marginTop: 0 }} imageSetting={this.imageSetting} title={this._renderTitle()}></RibbonHeader>
             
                <TabView onChangeTab={(e) => { this._tabIndex = e.i; this.forceUpdate(); }} accessible={true} accessibilityLabel={'MyRewardScreenTabView'} tabBarStyle={style.tabBarStyle} tabBarTextStyle={style.tabBarTextStyle} tabBarUnderlineStyle={style.tabBarUnderlineStyle} tabBarActiveTextColor={'#000000'} tabBarInactiveTextColor={'#6E6A6A'} tabBarActiveTextPreset={Text.preset.titleH2B} tabBarInactiveTextPreset={Text.preset.titleH2} scrollableTabBar style={{ flex: 1 }} initialPage={0} renderTabBar={() => <DefaultTabBar />}  >

                  
                    <View tabLabel={SGLocalize.translate('MyRewardsScreen.Title')} style={{flex:1}}>
                        {this.alreadyMount === true ?
                            <TabMyRewardList accessible={true} accessibilityLabel={'MyRewardScreenTab1'} navigator={this.props.navigation} myRewardActive={this.rewardDataActive} myRewardHistory={this.rewardDataHistory} style={style.containerView1} language={this._language} userData={this.currentUserData} callback={this._callBackForceUpdate.bind(this)} refreshData ={this._onRefreshData.bind(this)} refreshDataHistory ={this._onRefreshDataHistory.bind(this)} loadData ={this._onLoadData.bind(this)}  loadDataHistory={this._onLoadDataHistory.bind(this)} loadingData ={this.state.loadingData} loadingDataHistory ={this.state.loadingDataHistory} filterData={this.filterData} sortData={this.sortData} searchKeyword={this.searchKeyword}></TabMyRewardList>
                        :
                        <ActivityIndicator preset={ActivityIndicator.preset.h1} style={{ flex: 1 }}></ActivityIndicator>
                        }
                    </View>
                    
                    <View tabLabel={SGLocalize.translate('MyRewardsScreen.MyRefferal')} style={{flex:1,backgroundColor: '#E6E6E6'}}>

                        {this.alreadyMount === true ?
                          <MyReferralInMyRewardScreen navigation = {this.props.navigation} ></MyReferralInMyRewardScreen>
                        :
                        <ActivityIndicator preset={ActivityIndicator.preset.h1} style={{ flex: 1 }}></ActivityIndicator>
                        
                        }
                    </View>
                
                    <View accessible={true}  tabLabel={SGLocalize.translate("MyRewardsScreen.tabAuctionTittle")}  style={{flex:1}}>
                        {this.alreadyMount === true ?
                        <TabAuction accessible={true} accessibilityLabel={'MyRewardScreenTabAuction'} navigator={this.props.navigation} auctionData={this.dataAuction} auctionDataHistory={this.dataAuctionHistory} style={style.containerView1} language={this._language} userData={this.currentUserData}  loadData ={this._onLoadAuction.bind(this)}  loadDataHistory={this._onLoadAuctionHistory.bind(this)} loadingData ={this.state.loadingAuction} loadingDataHistory ={this.state.loadingAuctionHistory} refreshData ={this._onRefreshAuction.bind(this)} refreshDataHistory ={this._onRefreshAuctionHistory.bind(this)}></TabAuction>  
                        :
                        <ActivityIndicator preset={ActivityIndicator.preset.h1} style={{ flex: 1 }}></ActivityIndicator>
                        }
                    </View>

                </TabView>

                <Animated.View style={{ position: 'absolute', transform: [{ translateY: this._baseAnimY.interpolate({ inputRange: [-1, 0], outputRange: [(SGHelperWindow.getStatusBarHeight() - SGHelperWindow.getHeaderHeight()), SGHelperWindow.getStatusBarHeight()] }) },], height: SGHelperWindow.getHeaderHeight(), width: '100%' }}>
                    <MyMenuBar accessible={true} accessibilityLabel={'HomeScreenHeader'} currentUser={this.currentUser} navigator={this.props.navigation} imageSetting={this.imageSetting} style={style.throwWHP}></MyMenuBar>
                </Animated.View>

                
                <Animated.View style={{ position: 'absolute', transform: [{ translateY: this._baseAnimY.interpolate({ inputRange: [-1, 0], outputRange: [SGHelperWindow.getWHPNoHeader().h + 8 * p, SGHelperWindow.getWHPNoHeader().h - Math.max(SGHelperWindow.getFooterHeight(), 2 * p) - SGHelperWindow.getHeaderHeight()] }) },], height: Math.max(SGHelperWindow.getFooterHeight(), 2 * p) + SGHelperWindow.getHeaderHeight(), backgroundColor: 'transparent', width: '100%' }}>
                    <BottomNavigationContainer accessible={true} accessibilityLabel={'HomeScreenBottomNav'} currentUser={this.currentUser} navigator={this.props.navigation} style={style.throwWHP} screen={this.props.route.name}></BottomNavigationContainer>
                </Animated.View>
            </RootView>

        );
    }
}

