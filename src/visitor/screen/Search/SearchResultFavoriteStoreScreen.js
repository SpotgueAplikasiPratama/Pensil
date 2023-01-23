/*
Version 1.2
Adding Paging By Melvin , 25 Maret 2021
 * 1. Yohanes 01 April 2021
 * - add ErrorHandling
 *  * 2. Leon 12 Apr 2021
 * - add ErrorHandling
 *  * 3. Leon, 4 May 2021
  - Fix Like, Fix Favorite, Fix Notification
*/

import React from 'react';
import { StyleSheet, Animated } from 'react-native';
import { SGRootView as RootView, SGView as View, SGText as Text, SGFlatList as FlatList, SGActivityIndicator as ActivityIndicator } from '../../../core/control';
import { SGBaseScreen } from '../../../core/screen/SGBaseScreen';
import { FullSearchBar } from '../../component_V2/FullSearchBar';
import { DefaultStoreCard } from '../../container_V2/DefaultStoreCard';
import { SGHelperNavigation, SGHelperGlobalVar, SGHelperWindow,SGHelperType, SGHelperErrorHandling } from '../../../core/helper';
import { SGLocalize } from '../../locales/SGLocalize';
import { RibbonHeader } from '../../component_V2/RibbonHeader';
import { BottomNavigationContainer } from '../../component_V2/BottomNavigationContainer';
import { filterDAO } from '../../db/filterDAO';
import { sortDAO } from '../../db/sortDAO';
import { VSearchResultFavoriteStoreAPI } from '../../api/VSearchResultFavoriteStoreAPI';
import { VFilterOptionsAPI } from '../../api/VFilterOptionsAPI';
import idJSON from '../../locales/id.json';
import enJSON from '../../locales/en.json';
import cnJSON from '../../locales/cn.json';
import { tbLookupDAO } from '../../db/tbLookupDAO'
import { EmptyDetailView } from '../../container_V2/EmptyDetailView';
import { VisitorHelper } from '../../helper/VisitorHelper';

export class SearchResultFavoriteStoreScreen extends SGBaseScreen {

    getPagingData(){
        var itemPerPage = SGHelperType.getPaging()
        return {paging:true,offset:this.pagingCounter, totalPerPage:itemPerPage}
    }

    createStyleSheet = (whp) => {
        var { w, h, p } = whp;
        return StyleSheet.create({
            mainContainer: { width: w, height: h, backgroundColor: '#E6E6E6', justifyContent: 'flex-start' },
            throwWHP: { width: w, height: h, padding: p },
            containerView1: { width: w, height: w, padding: p, backgroundColor: 'white' },
            textView1: { width: w - 2 * p, height: w * 0.12, alignItems: 'flex-start', },
            text1: { color: '#7a7a7a' }
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

    checkAPIBatchStatusAllDone() {
        this.pagingCounter = this.data.length
        this.alreadyMount = true;
        this.setState({ refresh: false});
        this.forceUpdate();
 
    }
    
    async _onRefreshAllItem(resetPaging = false) {
        this.currentUser = SGHelperGlobalVar.getVar('GlobalCurrentUser');
        this.currentUserData = SGHelperGlobalVar.getVar('GlobalCurrentUserData');
        this.imageSetting = SGHelperGlobalVar.getVar('GlobalImageSetting');

        if(resetPaging){
            this.setState({ refresh: true })
            this.pagingCounter= 0
            this.paging = this.getPagingData()

            this.baseInitAPIParallel(SGHelperGlobalVar.getVar("ResponTimes"), (() => { this.checkAPIBatchStatusAllDone(); }).bind(this));

            this.baseAddAPIParallel('getLocationFilter', (async (v1) => { return VFilterOptionsAPI.getLocationFilter(v1); }).bind(this,this.Language), ((v) => {
                this._buildingMatrix = v;
            }).bind(this),  null);

            this.baseAddAPIParallel('getAllSearchResultFavoriteStore', (async (v1,v2,v3,v4,v5) => { return VSearchResultFavoriteStoreAPI.getAllSearchResultFavoriteStore(v1,v2,v3,v4,v5); }).bind(this,this.Language, this.searchKeyword, this._filterData, this._sortData,this.paging), ((v) => {
                this.data = v;
                if(v.length<SGHelperType.getPaging())this.setState({stopPulling:true})
                else this.setState({stopPulling:false})
            }).bind(this),  null);
    
            this.baseRunAPIParallel();
        }  else {
            this.forceUpdate();
        }
    }

    async _onRefresh() {
        console.log('refresh')
        this.setState({ refresh: true ,stopPulling:true})
        if(!this.refresh && !this.state.loading){
            this.refresh= true
            this.pagingCounter = 0
            this.paging = this.getPagingData()


            this.baseRunSingleAPIWithRedoOption('getAllSearchResultFavoriteStore', (async (v1, v2, v3, v4, v5) => { return VSearchResultFavoriteStoreAPI.getAllSearchResultFavoriteStore(v1, v2, v3, v4, v5) }).bind(this,this.Language, this.searchKeyword, this._filterData, this._sortData,this.paging), ((v) => {
            this.data = v
            this.pagingCounter = this.data.length
            if(v.length<SGHelperType.getPaging())this.setState({stopPulling:true})
            else this.setState({stopPulling:false})
            this.refresh=false
            this.setState({ refresh: false});
            this.forceUpdate()
            }).bind(this), null,SGHelperGlobalVar.getVar("ResponTimes") );
        }
    }

    async _onLoad(){
        if(!this.state.loading && !this.state.stopPulling){
        
            this.setState({loading:true})
            this.paging = this.getPagingData()

            this.baseRunSingleAPIWithRedoOption('getAllSearchResultFavoriteStore', (async (v1, v2, v3,v4,v5) => {  return VSearchResultFavoriteStoreAPI.getAllSearchResultFavoriteStore(v1, v2, v3,v4,v5) }).bind(this, this.Language, this.searchKeyword, this._filterData, this._sortData,this.paging), ((v) => {           
            var resData = v// await VSearchResultFavoriteStoreAPI.getAllSearchResultFavoriteStore(this.Language, this.searchKeyword, this._filterData, this._sortData,this.paging);
            if(resData.length!==0){
                for(var i=0;i<resData.length;i++){
                    this.data.push(resData[i])
                }
                this.pagingCounter = this.pagingCounter + resData.length
            } else this.setState({stopPulling:true})
            this.setState({loading:false})
            }).bind(this), (()=>{   this.setState({loading:false}) }), SGHelperGlobalVar.getVar("ResponTimes"));
        }
    }
    

    constructor(props, context, ...args) {
        super(props, context, ...args);
        this.style = this.createStyleSheet(this.WHP);
        var { w, h, p } = this.WHP;
        this.currentUser = SGHelperGlobalVar.getVar('GlobalCurrentUser');
        this.currentUserData = SGHelperGlobalVar.getVar('GlobalCurrentUserData');
        this.imageSetting = SGHelperGlobalVar.getVar('GlobalImageSetting');
        this.searchKeyword = this.props.route.params.searchKeyword;
        this.data = [];
        this._filterData = filterDAO.getStoreFilterData(this.Language);
        this._sortData = sortDAO.getStoreFavoriteSearchSortData(this.Language.toUpperCase());
        this._buildingMatrix = [];
        this.props.navigation.setOptions({
            headerShown: false,
        });
        // Paging
        this.state = {  refresh: false ,refreshFlatList:false, loading:false, stopPulling:false };
        this.alreadyMount = false;
        this.refresh=false
        this.pagingCounter = 0
        this.counterBatch=0
        this.errorBatch = []
    }

    async _setFilter(dataFilter) {
        this._filterData = dataFilter;
        await this._onRefreshAllItem(true);
    }

    async _setSort(dataSort) {
        this._sortData = dataSort;
        await this._onRefreshAllItem(true);
    }

    _getLikeResourceStore(data) {
        var contentStoreID = data.fContentStoreID;
        var contentStoreEN = data.fContentStoreEN;
        var contentStoreCN = data.fContentStoreCN;
        var contentBuildingID = data.fContentBuildingID;
        var contentBuildingEN = data.fContentBuildingEN;
        var contentBuildingCN = data.fContentBuildingCN;
        return (
            { fContentType: 'Store', fContentKey: data.key, fText1: { id: contentStoreID.fStoreName, en: contentStoreEN.fStoreName, cn: contentStoreCN.fStoreName }, fText2: { id: idJSON.storeCategory[tbLookupDAO.getLookUpValue(data.storeCategory)], en: enJSON.storeCategory[tbLookupDAO.getLookUpValue(data.storeCategory)], cn: cnJSON.storeCategory[tbLookupDAO.getLookUpValue(data.storeCategory)] }, fText3: { id: contentBuildingID.fBuildingName, en: contentBuildingEN.fBuildingName, cn: contentBuildingCN.fBuildingName }, fImageID: contentStoreID.fStoreImageJSON, fImageEN: contentStoreEN.fStoreImageJSON, fImageCN: contentStoreCN.fStoreImageJSON, fTargetKey: data.key }
        )
    }

    render() {
        var { w, h, p } = this.WHP;
        var style = this.style;
        console.log('search result favorite store screen')
        return (
            <RootView dummyStatusBar dummyHeaderBar accessible={true} accessibilityLabel={'SearchResultFavoriteStoreScreenRootView'} style={style.mainContainer}>
                <RibbonHeader search searchTitle={SGLocalize.translate("SearchResultFavoriteStoreScreen.searchTitle")} imageSetting={this.imageSetting} title={SGLocalize.translate("SearchResultFavoriteStoreScreen.screenTitle")}></RibbonHeader>
                {this.alreadyMount ?
                    this.data.length ?
                        <FlatList refreshing={this.state.refreshFlatList} onRefresh={this._onRefresh.bind(this)} accessible={true} accessibilityLabel={'SearchResultFavoriteStoreScreenList'} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingVertical: p, justifyContent: 'flex-start', alignItems: 'center' }} data={this.data} renderItem={({ item }) => {
                            return (
                                <DefaultStoreCard onNotification={((item, s)=>{ console.log(item);  item.fUserNotificationThis = s; this.forceUpdate();}).bind(this,item)} onFavorite={((item, s)=>{console.log(item);  item.fUserFavoriteThis = s; this.forceUpdate();}).bind(this,item)} onLike={((item, s,c)=>{item.fUserLikedThis = s; item.fLikeCountStore+=c; this.forceUpdate();}).bind(this,item)} accessible={true} accessibilityLabel={'SearchResultFavoriteStoreScreenDefStoreCard'} accessibilityLabel={'SearchAllScreenDefStoreCard'} likePackage={this._getLikeResourceStore(item)} navigator={this.props.navigation} language={this.Language} imageSetting={this.imageSetting} likeText={SGLocalize.translate("SearchResultStoreScreen.likeText")} locationText={SGLocalize.translate("SearchResultStoreScreen.locationText")} lastVisitedText={SGLocalize.translate("SearchResultStoreScreen.lastVisitedText")} key={item.key} contentKey={item.key} storeName={item['fStoreName' + (this.Language).toUpperCase()]} storeCategory={item.storeCategory} storeLocation={item['fContentStore' + this.Language.toUpperCase()].fLocation} storeFloor={item.floor} placeName={item['fBuildingName' + (this.Language).toUpperCase()]} image={item['fContentBuilding' + (this.Language).toUpperCase()].fImageJSON[0][this.imageSetting].uri} location={item['fContentImage']} lastVisited={item.lastVisited} contentLikeCount={item.fLikeCountStore} footerLikeCount={item.fLikeCountBuilding} contentImage={item['fContentStore' + (this.Language).toUpperCase()].fStoreImageJSON[0][this.imageSetting].uri} city={item.fCity} like={item.fUserLikedThis} notification={item.fUserNotificationThis} favorite={item.fUserFavoriteThis} style={style.containerView1}></DefaultStoreCard>
                            );
                        }} keyExtractor={item => item.key}
                        onEndReached={this._onLoad.bind(this)}
                        onEndReachedThreshold={SGHelperType.getThreshold()}
                        ListFooterComponent={()=>{
                            return (
                                <React.Fragment>
                                    {
                                        this.state.loading &&
                                        <ActivityIndicator preset={ActivityIndicator.preset.h1} style={{ width: w, height: h * 0.05 }}></ActivityIndicator>
                                    }
                                    <View style={{ width: '100%', height: SGHelperWindow.getHeaderHeight() }}></View>
                                    <View style={{ width: '100%', height: SGHelperWindow.getFooterHeight() }}></View>
                                </React.Fragment>
                            )
                        }}
                        >
                        </FlatList>
                        :
                        <EmptyDetailView text={SGLocalize.translate('globalText.emptyList')} style={style.throwWHP}></EmptyDetailView>
                    :
                    <ActivityIndicator preset={ActivityIndicator.preset.h1} style={{ flex: 1 }}></ActivityIndicator>
                }
                 {/* <View style={{width:w,height:w*0.15,backgroundColor:'transparent'}}></View> */}
                <Animated.View style={{ position: 'absolute', transform: [{ translateY: this._baseAnimY.interpolate({ inputRange: [-1, 0], outputRange: [(SGHelperWindow.getStatusBarHeight() - SGHelperWindow.getHeaderHeight()), SGHelperWindow.getStatusBarHeight()] }) },], height: SGHelperWindow.getHeaderHeight(), width: '100%' }}>
                    <FullSearchBar accessible={true} accessibilityLabel={'SearchResultFavoriteStoreScreenFullSearchBar'} screen='SearchResultFavoriteStore' searchKeyword={this.searchKeyword} language={this.Language} sortData={this._sortData} onApplySort={(v) => { this._setSort(v) }} onPressFilter={() => { SGHelperNavigation.navigatePush(this.props.navigation, 'Filter', { filterData: this._filterData, buildingMatrix: this._buildingMatrix, onApplyFilter: (v) => { this._setFilter(v) }, onCloseFilter: (v) => { console.log(v) } }) }} navigator={this.props.navigation} style={this.style.containerView1}></FullSearchBar>
                </Animated.View>
                <Animated.View style={{ position: 'absolute', transform: [{ translateY: this._baseAnimY.interpolate({ inputRange: [-1, 0], outputRange: [SGHelperWindow.getWHPNoHeader().h + 8 * p, SGHelperWindow.getWHPNoHeader().h - Math.max(SGHelperWindow.getFooterHeight(), 2 * p) - SGHelperWindow.getHeaderHeight()] }) },], height: Math.max(SGHelperWindow.getFooterHeight(), 2 * p) + SGHelperWindow.getHeaderHeight(), width: '100%' }}>
                    <BottomNavigationContainer navigator={this.props.navigation} style={style.throwWHP}></BottomNavigationContainer>
                </Animated.View>
            </RootView>
        );
    }
}