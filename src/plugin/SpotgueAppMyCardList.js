import React from 'react';
import Core from '../core/core';
import tbVMainHomeVisitorAPI from './plugin1/api/tbVMainHomeVisitorAPI';
import { VFilterOptionsAPI } from '../visitor/api/VFilterOptionsAPI';
import Card from './plugin1/component/Card';
import MyCardConfirmationCard from './plugin1/component/MyCardConfirmationCard';
import MyTranslator from './lessons/locale/MyTranslator';
import { BottomNavigationContainer } from '../visitor/component_V2/BottomNavigationContainer';


export default class SpotgueAppMyCardList extends Core.Screen.SGBaseScreen {
    getDataFilterCard() {
        return ([
            { name:'fMemberProfileJSON', operator:'CONTAINS', value:this.searchKeyword.keyword, type:'search' },
            { name: 'fCardStatus', operator: '=', value: 'approved', visible: false },
            { name: 'fBuildingKey', operator: 'IN', value: null, type: 'buildingName', title: MyTranslator.tr('SpotgueAppMyCardList.specificPlace'), group: MyTranslator.tr('SpotgueAppMyCardList.Location'), visible: true },

            ]
        );
    }

    getDataFilterHis(lang) {
        return ([
            { name:'fMemberProfileJSON', operator:'CONTAINS', value:this.searchKeywordHis.keyword, type:'search' },
            { name: 'fCardStatus', operator: 'IN', type: 'multi', optionList:[{key: 'approved', title: MyTranslator.tr('SpotgueAppMyCardList.Accepted')}, {key: 'submitted', title: MyTranslator.tr('SpotgueAppMyCardList.Submitted')}, {key: 'rejected', title: MyTranslator.tr('SpotgueAppMyCardList.Rejected')}] , title: MyTranslator.tr('SpotgueAppMyCardList.StatusTitle'), group: MyTranslator.tr('SpotgueAppMyCardList.Status'), value: null, visible: true },
            ]);
    }
      
    getDataSorting(lang) {
    return ([
        { name: 'fCardRegistrationDate', descending: true, title: MyTranslator.tr('SpotgueAppMyCardList.SortNewestRegisDate'), selected: false, visible: true },
        { name: 'fCardRegistrationDate', descending: false, title: MyTranslator.tr('SpotgueAppMyCardList.SortOldestRegisDate'), selected: false, visible: true },
        { name: 'fCardExpiryDate', descending: false, title: MyTranslator.tr('SpotgueAppMyCardList.SortNewestExpiredDate'), selected: false, visible: true },
        { name: 'fCardExpiryDate', descending: true, title: MyTranslator.tr('SpotgueAppMyCardList.SortOldestExpiredDate'), selected: false, visible: true },
        { name: 'fID', descending: false, selected: true, visible: false },
    ]);
    }

    getDataSortingHistory(lang) {
    return ([
        { name: 'fCardRegistrationDate', descending: true, title: MyTranslator.tr('SpotgueAppMyCardList.SortNewestRegisDate'), selected: false, visible: true },
        { name: 'fCardRegistrationDate', descending: false, title: MyTranslator.tr('SpotgueAppMyCardList.SortOldestRegisDate'), selected: false, visible: true },
        { name: 'fID', descending: false, selected: true, visible: false },
    ]);
    }
    
    getPagingDataCard(){
    const { SGHelperType } = Core.Helper;
    var itemPerPage = SGHelperType.getPaging()
    return {paging:true, offset:this.pagingCounterCard, totalPerPage:itemPerPage}
    }

    getPagingDataHis(){
    const { SGHelperType } = Core.Helper;
    var itemPerPage = SGHelperType.getPaging()
    return {paging:true, offset:this.pagingCounterHis, totalPerPage:itemPerPage}
    }

    createStyleSheet = (whp) => {
        const { StyleSheet } = Core;
        var { w, h, p } = whp;
        return StyleSheet.create({
            throwWHP: {width: w, height: h, padding: p},
            v1: { justifyContent: 'center', alignItems: 'flex-start', width: w, height: h, overflow: 'visible' },
            v2: {width:w,height:w*0.16, backgroundColor:'black',flexDirection:'row',justifyContent:'flex-start',borderBottomRightRadius:10,borderBottomLeftRadius:10},
            v3: { width: w * 0.6, height: w * 0.7, backgroundColor: 'white',borderWidth:2,borderRadius:5 },
            vIcon: {color:'white',backgroundColor:'black',marginLeft:w*0.05},
            vIcon2: {color:'white',backgroundColor:'black',marginLeft:w*0.02},
            vIcon3: {color:'white',backgroundColor:'black',marginHorizontal:w*0.02},
            vInput: {alignSelf:'flex-start',marginLeft:w*0.05, width:w*0.5},
            vFilter: {width:w*0.4,marginTop:w*0.03,borderBottomWidth:2,flexDirection:'row',alignSelf:'center'},
            vAscending: { width: w * 0.6, height: w * 0.3, backgroundColor: 'white',borderWidth:2,borderRadius:5 },
            vDescending: {width:w*0.4,marginTop:w*0.03,marginBottom:w*0.03,borderBottomWidth:2,flexDirection:'row',alignSelf:'center'},
            vSearchBar:{width:w, backgroundColor: 'white' , padding:p},

            mallThumbnail: { width: (w - p * 2) * 0.14, height: (w - p * 2) * 0.14, resizeMode: 'cover', borderRadius: p * 2.5, marginBottom: 0 },
            bottomCenterContainer: { width: w * 0.6, flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', marginLeft: 0 },
            mallNameText: { color: '#3E3E3E' },
            typeAndLocationText: { color: '#989898' },
            bottomLeftContainer: { width: w * 0.15, marginLeft: w * 0.05, marginVertical: p * 1.5 },
        });
    }
    constructor(props, context, ...args) {
        super(props, context, ...args);
        const {SGHelperGlobalVar} = Core.Helper
        this.style = this.createStyleSheet(this.WHP);
        this.props.navigation.setOptions({
            headerShown: false,
        });
        this._darkMode = false;
        this.cardList = []
        this.historyList = []
        this.searchKeyword = {keyword:''}
        this.searchKeywordHis = {keyword:''}
        this.pvID1 = Core.Control.SGPopView.getPopViewID();
        this.pvID2 = Core.Control.SGPopView.getPopViewID();
        this.usData = SGHelperGlobalVar.getVar("GlobalCurrentUserData")
        this.filterDataCard = this.getDataFilterCard(this.Language);
        this.filterDataHis = this.getDataFilterHis(this.Language);
        this._buildingMatrix = []
        this.sortData = this.getDataSorting(this.Language);
        this.sortDataHis = this.getDataSortingHistory(this.Language);
        this.state = {refreshCard : false , 
                     loadingCard : false, 
                     stopPullingCard : false, 
                     filterDataCard: this.filterDataCard, 
                     sortData : this.sortData,
                     refreshHis: false, 
                     loadingHis: false,
                     stopPullingHis: false,
                     filterDataHis: this.filterDataHis,
                     sortDataHis: this.sortDataHis};
        this.alreadyMount = false;
        this.pagingCounterCard = 0;
        this.pagingCounterHis = 0;
        this.refreshCard = false;
        this.refreshHis = false;
        this.imset = SGHelperGlobalVar.getVar('GlobalImageSetting')
    }

    async componentDidMount(){
        await this._refreshDataParallel(true)
        this._unsubscribe = this.props.navigation.addListener('focus', async () => {
            this._refreshDataParallel()
        });
    }

    showPopFilter(){
        Core.Control.SGPopView.showPopView(this.pvID1);
      }

    showPopSort(){
        Core.Control.SGPopView.showPopView(this.pvID2);
      }

    async _refreshDataParallel(resetPaging=false) {
        const {SGHelperGlobalVar} = Core.Helper;
        this.status ={
            getDataCard:false,
            getDataHis:false,
        }
        if(resetPaging){
            this.setState({refreshCard:true})
            this.setState({refreshHis:true})
    
            this.pagingDataCard = this.getPagingDataCard()
            this.pagingDataHis = this.getPagingDataHis()      
   
            // this.baseInitAPIParallel(10000, (async () => { this._dataLoadDone(); }).bind(this));
            this.baseInitAPIParallel(SGHelperGlobalVar.getVar("ResponTimes"), (() => { this._dataLoadDone(); }).bind(this));
             
            this.baseAddAPIParallel('getLocationFilter', (async (v1) => { return VFilterOptionsAPI.getLocationFilter(v1); }).bind(this,this.Language), ((v) => {
                this._buildingMatrix = v;
            }).bind(this), null);
            
            this.baseAddAPIParallel('SearchMyLoyaltyCardList', (async (v1,v2,v3) => { return tbVMainHomeVisitorAPI.SearchMyLoyaltyCardList(v1,v2,v3) }).bind(this,this.filterDataCard, this.sortData, this.pagingDataCard), ((v) => {
              this.cardList = v;
              for(var i = 0 ; i < v.length; i++){
                this.cardList[i].fJSONPoint = JSON.parse(this.cardList[i].fJSONPoint)
                this.cardList[i].fJSONNumber = JSON.parse(this.cardList[i].fJSONNumber)
                this.cardList[i].fJSONName = JSON.parse(this.cardList[i].fJSONName)
                this.cardList[i].fJSONValidNumber = JSON.parse(this.cardList[i].fJSONValidNumber)
                this.cardList[i].fJSONExpiredDate = JSON.parse(this.cardList[i].fJSONExpiredDate)
              }
            }).bind(this), null);
    
            this.baseAddAPIParallel('SearchMyLoyaltyRegistrationHistory', (async (v1,v2,v3) => { return tbVMainHomeVisitorAPI.SearchMyLoyaltyRegistrationHistory(v1,v2,v3) }).bind(this,this.filterDataHis, this.sortDataHis, this.pagingDataHis), ((a) => {
              this.historyList = a;
            }).bind(this), null);

             this.baseRunAPIParallel();
           
        }
    }

    _dataLoadDone() {
        const {SGHelperType} = Core.Helper
        this.pagingCounterCard = this.cardList.length;
        this.pagingCounterHis = this.historyList.length;
        if(this.pagingCounterCard<SGHelperType.getPaging())this.setState({stopPullingCard:true}) 
        else this.setState({stopPullingCard:false})
        if(this.pagingCounterHis<SGHelperType.getPaging())this.setState({stopPullingHis:true}) 
        else this.setState({stopPullingHis:false})
        this.setState({refreshCard:false,refreshHis:false})
        this.alreadyMount=true
        this.forceUpdate();
    }

    async _onRefreshCardList(resetPaging = false) {
        const {SGHelperType, SGHelperGlobalVar} = Core.Helper;
        this.setState({ refreshCard: true ,stopPullingCard:true})
        if(!this.refreshCard && !this.state.loadingCard){
            // this.filterDataCard = this.getDataFilterCard(this.Language)
            this.refreshCard= true
            this.pagingCounterCard = 0
            this.filterDataCard[0].value = this.searchKeyword.keyword
            this.pagingDataCard = this.getPagingDataCard()
            this.baseRunSingleAPIWithRedoOption('SearchMyLoyaltyCardList', (async (v1,v2,v3) => { return tbVMainHomeVisitorAPI.SearchMyLoyaltyCardList(v1,v2,v3) }).bind(this,this.filterDataCard, this.sortData, this.pagingDataCard), ((v) => {
                this.cardList = v
                this.pagingCounterCard = this.cardList.length
                if(v.length<SGHelperType.getPaging())this.setState({stopPullingCard:true})
                else this.setState({stopPullingCard:false})
                this.refreshCard=false
                this.setState({ filterDataCard: this.filterDataCard, sortData: this.sortData, refreshCard: false });
                this.forceUpdate();
                }).bind(this), null,SGHelperGlobalVar.getVar("ResponTimes") );
        }
    }

    async _onRefreshHistoryList(resetPaging = false) {
        const {SGHelperType, SGHelperGlobalVar} = Core.Helper;
        this.setState({ refreshHis: true ,stopPullingHis:true})
        if(!this.refreshHis && !this.state.loadingHis){
            this.refreshHis= true
            this.pagingCounterHis = 0
            this.filterDataHis[0].value = this.searchKeywordHis.keyword
            this.pagingDataHis = this.getPagingDataHis()
            this.baseRunSingleAPIWithRedoOption('SearchMyLoyaltyRegistrationHistory', (async (v1,v2,v3) => { return tbVMainHomeVisitorAPI.SearchMyLoyaltyRegistrationHistory(v1,v2,v3) }).bind(this,this.filterDataHis, this.sortDataHis, this.pagingDataHis), ((v) => {
                this.historyList = v
                this.pagingCounterHis = this.historyList.length
                if(v.length<SGHelperType.getPaging())this.setState({stopPullingHis:true})
                else this.setState({stopPullingHis:false})
                this.refreshHis=false
                this.setState({ filterDataHis: this.filterDataHis, sortData: this.sortData, refreshHis: false });
                this.forceUpdate();
            }).bind(this), null,SGHelperGlobalVar.getVar("ResponTimes") );
        }
    }

    async _onLoadCardItem(){
        const {SGHelperGlobalVar} = Core.Helper;
        if(!this.state.loadingCard && !this.state.stopPullingCard){
            this.setState({loadingCard:true})
            this.pagingDataCard = this.getPagingDataCard()
            this.baseRunSingleAPIWithRedoOption('SearchMyLoyaltyCardList', (async (v1,v2,v3) => { return tbVMainHomeVisitorAPI.SearchMyLoyaltyCardList(v1,v2,v3) }).bind(this,this.filterDataCard, this.sortData, this.pagingDataCard), ((v) => {
                var resData = v
                if(resData.length!==0){
                    for(var i=0;i<resData.length;i++){
                        this.cardList.push(resData[i])
                    }
                    this.pagingCounterCard = this.pagingCounterCard + resData.length
                }else this.setState({stopPullingCard:true})
                this.setState({loadingCard:false})
            }).bind(this), null,SGHelperGlobalVar.getVar("ResponTimes") );
        }
    }

    async _onLoadHistoryItem(){
        const {SGHelperGlobalVar} = Core.Helper;
        console.log(this.state.stopPullingHis)
        if(!this.state.loadingHis && !this.state.stopPullingHis){
            console.log('dalem iff')
            this.setState({loadingHis:true})
            this.pagingDataHis = this.getPagingDataHis()
            this.baseRunSingleAPIWithRedoOption('SearchMyLoyaltyRegistrationHistory', (async (v1,v2,v3) => { return tbVMainHomeVisitorAPI.SearchMyLoyaltyRegistrationHistory(v1,v2,v3) }).bind(this,this.filterDataHis, this.sortDataHis, this.pagingDataHis), ((v) => {
                var resData = v
                if(resData.length!==0){
                    for(var i=0;i<resData.length;i++){
                        this.historyList.push(resData[i])
                    }
                    this.pagingCounterHis = this.pagingCounterHis + resData.length
                }else this.setState({stopPullingHis:true})
                this.setState({loadingHis:false})
            }).bind(this), (()=>{this.setState({ loadingHis:false })}),SGHelperGlobalVar.getVar("ResponTimes") );
        }
      }

    async _setFilter(dataFilter) {
        this.filterDataCard = dataFilter;
        await this._onRefreshCardList();
    }

    async _setSort(dataSort) {
        this.sortData = dataSort;
        await this._onRefreshCardList();
    }

    async _setFilterHistory(dataFilter) {
        this.filterDataHis = dataFilter;
        await this._onRefreshHistoryList();
    }

    async _setSortHis(dataSort) {
        this.sortDataHis = dataSort;
        await this._onRefreshHistoryList();
    }

    render() {
        var language = this.Language.toUpperCase();
        var style = this.style;
        var { w, h, p } = this.WHP;
        const { SGImage, SGRootView,SGTouchableOpacity,  SGFlatList, SGScrollView, SGTextInput, SGFilePicker, SGText, SGView, SGTabView,SGIcon, SGActivityIndicator } = Core.Control;
        const {SGHelperNavigation, VisitorHelper, FullSearchBar, CustomMenuBar, SearchBarNoBack, SGHelperWindow, SGHelperType} = Core.Helper;
        return (
            <SGRootView dummyStatusBar style={{flex: 1}}>
                <CustomMenuBar btnBack accessible={true} accessibilityLabel={'HomeScreenHeader'} navigator={this.props.navigation} imageSetting={this.imset} style={this.WHP}></CustomMenuBar>
                {this.alreadyMount ? 
                (
                <SGTabView style={{width:w }}>
                    <SGView style={{flex: 1}} tabLabel={MyTranslator.tr('SpotgueAppMyCardList.cards')}>
                        <SearchBarNoBack accessible={true} accessibilityLabel={'SearchResultPlaceScreenFullSearchBar'} searchKeyword={this.searchKeyword} language={this.Language}  sortData={this.sortData} onApplySort={(v) => { this._setSort(v) }} onPressFilter={() => { SGHelperNavigation.navigatePush(this.props.navigation, 'Filter', { filterData: this.filterDataCard, buildingMatrix: this._buildingMatrix, onApplyFilter: (v) => { this._setFilter(v) }, onCloseFilter: (v) => { console.log(v) } }) }} navigator={this.props.navigation} imageSetting={this.imset} refresh={this._onRefreshCardList.bind(this)} style={style.vSearchBar}></SearchBarNoBack>
                        <SGFlatList showsVerticalScrollIndicator={false} refreshing={this.state.refreshCard} onRefresh={this._onRefreshCardList.bind(this, true)} contentContainerStyle={{justifyContent: 'flex-start', alignItems: 'flex-start'}} data={this.cardList} renderItem={({ item }) => {
                            return (
                                <SGView style={{width: w, backgroundColor: '#FFFFFF', justifyContent: 'flex-start', borderRadius: 0, marginVertical: p*2}}>
                                    {this.cardList.length != 0 &&
                                        <SGTouchableOpacity onPress={() => { SGHelperNavigation.navigatePush(this.props.navigation, 'CardDetail', { fID: item.fID, fTargetType: item.fTargetType, fBuildingKey: item.fBuildingKey, fBuildingName: item.fBuildingNameID }) }}>
                                            <Card data = {item} datalang = {language} imset={this.imset}/>
                                        </SGTouchableOpacity>
                                    }
                                    <SGTouchableOpacity onPress={() => { SGHelperNavigation.navigatePush(this.props.navigation, 'MallHome', { contentKey: item.fBuildingKey }) }}>
                                        <SGView style={{ width: w, borderTopColor: '#E5E5E5', borderTopWidth: w * 0.003, flexDirection: 'row', justifyContent: 'flex-start', marginTop: p*2}}>

                                            <SGView accessible={true} style={style.bottomLeftContainer}>
                                                <SGImage accessible={true} accessibilityLabel={'DefaultPlaceEventCardFooterImage'} source={{ uri: item['fContentBuilding'+language].fImageJSON[0].high.uri }} style={style.mallThumbnail}></SGImage>
                                            </SGView>
                                            <SGView accessible={true} style={style.bottomCenterContainer}>
                                                <SGText accessible={true} accessibilityLabel={'DefaultPlaceEventCardFooterName'} numberOfLines={1} preset={SGText.preset.titleH4_5B} style={style.mallNameText}>{item['fContentBuilding' + language].fBuildingName}</SGText>
                                                <SGText accessible={true} accessibilityLabel={'DefaultPlaceEventCardFooterLocation'} numberOfLines={1} preset={SGText.preset.titleH6B} style={style.typeAndLocationText}>{VisitorHelper.getLocalizeDataFromLookUp('Country',item.fCountry, this.Language)}, {VisitorHelper.getLocalizeDataFromLookUp('Province',item.fProvince, this.Language)}, {VisitorHelper.getLocalizeDataFromLookUp('City',item.fCity, this.Language)}</SGText>
                                                <SGText accessible={true} accessibilityLabel={'DefaultPlaceEventCardFooterLike'} numberOfLines={1} preset={SGText.preset.titleH6B} style={style.typeAndLocationText}>{item.fTotalLikeBuilding} {MyTranslator.tr('SpotgueAppMyCardList.orangmenyukai')}</SGText>
                                            </SGView>
                                        </SGView>
                                    </SGTouchableOpacity>
                                </SGView>
                                );
                                }} keyExtractor={item => item.fID}
                                onEndReached={this._onLoadCardItem.bind(this)}
                                onEndReachedThreshold={SGHelperType.getThreshold()}
                                ListFooterComponent={()=>{
                                if( this.state.loadingCard )return <SGActivityIndicator preset={SGActivityIndicator.preset.h1} style={{width:w,height:h*0.05}}></SGActivityIndicator>
                                    else return null
                                }}>
                                    
                        </SGFlatList>
                    {/* </SGView> */}
                    </SGView>

                    <SGView style={{flex: 1}} tabLabel= {MyTranslator.tr('SpotgueAppMyCardList.confirmation')}>
                        <SearchBarNoBack accessible={true} accessibilityLabel={'SearchResultPlaceScreenFullSearchBar'} searchKeyword={this.searchKeywordHis} language={this.Language}  sortData={this.sortDataHis} onApplySort={(v) => { this._setSortHis(v) }} onPressFilter={() => { SGHelperNavigation.navigatePush(this.props.navigation, 'Filter', { filterData: this.filterDataHis, buildingMatrix: this._buildingMatrix, onApplyFilter: (v) => { this._setFilterHistory(v) }, onCloseFilter: (v) => { console.log(v) } }) }} navigator={this.props.navigation} imageSetting={this.imset} refresh={this._onRefreshHistoryList.bind(this)} style={style.vSearchBar}></SearchBarNoBack>
                        <SGFlatList showsVerticalScrollIndicator={false} refreshing={this.state.refreshHis} onRefresh={this._onRefreshHistoryList.bind(this, true)} contentContainerStyle={{justifyContent: 'flex-start', alignItems: 'flex-start'}} data={this.historyList} renderItem={({ item }) => {
                            return (
                                <SGView>
                                    {this.historyList.length != 0 &&
                                    <MyCardConfirmationCard data = {item} datalang = {language}/>  
                                    }
                                </SGView>
                                );
                                }} keyExtractor={item => item.fID}
                                onEndReached={this._onLoadHistoryItem.bind(this)}
                                onEndReachedThreshold={SGHelperType.getThreshold()}
                                ListFooterComponent={()=>{
                                if( this.state.loadingHis )return <SGActivityIndicator preset={SGActivityIndicator.preset.h1} style={{width:w,height:h*0.05}}></SGActivityIndicator>
                                    else return null
                                }}>
                        </SGFlatList>
                    </SGView>
                </SGTabView>
                )
                :
                (
                    <SGActivityIndicator preset={SGActivityIndicator.preset.h1} style={{width:w,height:h}}></SGActivityIndicator>
                )}

            <SGView style={{ width: '100%', height: SGHelperWindow.getHeaderHeight() }}></SGView>
            <SGView style={{ width: '100%', height: SGHelperWindow.getFooterHeight() }}></SGView>
            <BottomNavigationContainer accessible={true} accessibilityLabel={'RewardDetailScreenBottomNav'} navigator={this.props.navigation} style={style.throwWHP}></BottomNavigationContainer>
        </SGRootView>
        );
    }
}