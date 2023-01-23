/**
 * 1. Yohanes 01 April 2021
 * - add ErrorHandling
 *  * 2. Leon 12 Apr 2021
 * - add ErrorHandling
 * Version 1.2.0
 *  1. Leon, 4 May 2021
  - Fix Like, Fix Favorite, Fix Notification
 */
import React from 'react';
import { StyleSheet, Animated } from 'react-native';
import { SGRootView as RootView, SGView as View, SGText as Text, SGFlatList as FlatList, SGActivityIndicator as ActivityIndicator } from '../../../core/control';
import { SGBaseScreen } from '../../../core/screen/SGBaseScreen';
import { NoSortSearchBar } from '../../component_V2/NoSortSearchBar';
import { DefaultStoreCard } from '../../container_V2/DefaultStoreCard';
import { SGHelperNavigation, SGHelperGlobalVar, SGHelperWindow,SGHelperType ,SGHelperErrorHandling} from '../../../core/helper';
import { SGLocalize } from '../../locales/SGLocalize';
import { RibbonHeader } from '../../component_V2/RibbonHeader';
import { BottomNavigationContainer } from '../../component_V2/BottomNavigationContainer';
import { filterDAO } from '../../db/filterDAO';
import { sortDAO } from '../../db/sortDAO';
import { VSeeMoreMostLikedStoreAPI } from '../../api/VSeeMoreMostLikedStoreAPI';
import idJSON from '../../locales/id.json';
import enJSON from '../../locales/en.json';
import cnJSON from '../../locales/cn.json';
import { tbLookupDAO } from '../../db/tbLookupDAO'
import { EmptyDetailView } from '../../container_V2/EmptyDetailView';
import { VisitorHelper } from '../../helper/VisitorHelper';

export class SeeMoreMostLikedStoreScreen extends SGBaseScreen {

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

    async _onRefreshAllItem(resetPaging = false) {
            this.currentUser = SGHelperGlobalVar.getVar('GlobalCurrentUser');
            this.currentUserData = SGHelperGlobalVar.getVar('GlobalCurrentUserData');
            this.imageSetting = SGHelperGlobalVar.getVar('GlobalImageSetting');
          
            
            if(resetPaging){
                this.setState({ refresh: true })
                this.pagingCounter= 0
                this.paging = this.getPagingData()

                this.baseRunSingleAPIWithRedoOption('getMostLikedStoreList', (async (v1, v2, v3, v4) => { return VSeeMoreMostLikedStoreAPI.getMostLikedStoreList(v1, v2, v3, v4) }).bind(this, this.props.route.params.contentKey, this._filterData, this._sortData,this.paging), ((v) => {           
                    this.data = v//await VSeeMoreMostLikedStoreAPI.getMostLikedStoreList(this.props.route.params.contentKey, this._filterData, this._sortData,this.paging);
                    if(v.length<SGHelperType.getPaging())this.setState({stopPulling:true})
                    else this.setState({stopPulling:false})
                    this.pagingCounter = this.data.length
                    this.alreadyMount = true;
                    this.forceUpdate();
                    this.setState({ refresh: false });
                }).bind(this), (()=>{ this.setState({ refresh: false }); }), SGHelperGlobalVar.getVar("ResponTimes"));
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


            this.baseRunSingleAPIWithRedoOption('getMostLikedStoreList', (async (v1,v2,v3,v4) => { return VSeeMoreMostLikedStoreAPI.getMostLikedStoreList(v1,v2,v3,v4) }).bind(this, this.props.route.params.contentKey, this._filterData, this._sortData,this.paging), ((v) => {
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
        // try {
            this.currentUser = SGHelperGlobalVar.getVar('GlobalCurrentUser');
            this.currentUserData = SGHelperGlobalVar.getVar('GlobalCurrentUserData');
            this.imageSetting = SGHelperGlobalVar.getVar('GlobalImageSetting');
            
            if(!this.state.loading && !this.state.stopPulling){
                
                this.setState({loading:true})
                this.paging = this.getPagingData()

                this.baseRunSingleAPIWithRedoOption('getMostLikedStoreList', (async (v1, v2, v3, v4) => {  return VSeeMoreMostLikedStoreAPI.getMostLikedStoreList(v1, v2, v3, v4) }).bind(this, this.props.route.params.contentKey, this._filterData, this._sortData,this.paging), ((v) => {           
                    var resData =  v//await VSeeMoreMostLikedStoreAPI.getMostLikedStoreList(this.props.route.params.contentKey, this._filterData, this._sortData,this.paging);
                    if(resData.length!==0){
                        for(var i=0;i<resData.length;i++){
                            this.data.push(resData[i])
                        }
                        this.pagingCounter = this.pagingCounter + resData.length
                    } else this.setState({stopPulling:true})
                    this.setState({loading:false})
                }).bind(this), (()=>{ this.setState({ refresh: false,stopPulling:false }); }), SGHelperGlobalVar.getVar("ResponTimes"));
            }
        // } catch (error) {
        //     SGHelperErrorHandling.Handling(error,this._onLoad.bind(this))   
        // }finally{
        //     this.setState({loading:false})
        // }

    }

    constructor(props, context, ...args) {
        super(props, context, ...args);
        this.style = this.createStyleSheet(this.WHP);
        var { w, h, p } = this.WHP;
        this.contentKey = this.props.route.params.contentKey;
        this.contentData = this.props.route.params.contentData;
        this.currentUser = SGHelperGlobalVar.getVar('GlobalCurrentUser');
        this.currentUserData = SGHelperGlobalVar.getVar('GlobalCurrentUserData');
        this.imageSetting = SGHelperGlobalVar.getVar('GlobalImageSetting');
        this.searchKeyword = '';
        this.data = [];
        this._filterData = filterDAO.getInThisPlaceStoreFilterData();
        this._sortData = sortDAO.getMostLikedPlaceStoreSortData(this.Language.toUpperCase());
        this.props.navigation.setOptions({
            headerShown: false,
        });
         // Paging
         this.state = {  refresh: false , refreshFlatList:false, loading:false, stopPulling:false };
         this.alreadyMount = false;
         this.refresh=false
         this.pagingCounter = 0
    }



    _getLikeResource(data) {
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

    async _setFilter(dataFilter) {
        this._filterData = dataFilter;
        await this._onRefreshAllItem(true);
    }
    
    render() {
        var { w, h, p } = this.WHP;
        var style = this.style;

        return (
            <RootView dummyStatusBar dummyHeaderBar accessible={true} accessibilityLabel={'SeeMoreMostLikedStoreScreenRootView'} style={style.mainContainer}>
                <RibbonHeader textPreset={'heading4B'} imageSetting={this.imageSetting} title={SGLocalize.translate("SeeMoreMostLikedStoreScreen.screenTitle", { placeName: this.contentData['fContent' + this.Language.toUpperCase()].fBuildingName })} ribbonWidth={0.6}></RibbonHeader>
                {this.alreadyMount ?
                    this.data.length !== 0 ?
                        
                        <View style={{flex:1}}>
                        <FlatList refreshing={this.state.refreshFlatList} onRefresh={this._onRefresh.bind(this)} accessible={true} accessibilityLabel={'SeeMoreMostLikedStoreScreenList'} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingVertical: p, justifyContent: 'flex-start', alignItems: 'center' }} data={this.data} renderItem={({ item }) => {
                            return (
                                <DefaultStoreCard onNotification={((item, s)=>{ console.log(item);  item.fUserNotificationThis = s; this.forceUpdate();}).bind(this,item)} onFavorite={((item, s)=>{console.log(item);  item.fUserFavoriteThis = s; this.forceUpdate();}).bind(this,item)} onLike={((item, s,c)=>{item.fUserLikedThis = s; item.fLikeCountStore+=c; this.forceUpdate();}).bind(this,item)} accessible={true} accessibilityLabel={'SeeMoreMostLikedStoreScreenStoreCard'} likePackage={this._getLikeResource(item)} navigator={this.props.navigation} imageSetting={this.imageSetting} likeText={SGLocalize.translate("globalText.likeCountText")} locationText={SGLocalize.translate("SeeMoreMostLikedStoreScreen.locationText")} lastVisitedText={SGLocalize.translate("SeeMoreMostLikedStoreScreen.lastVisitedText")} language={this.Language} key={item.key} contentKey={item.key} storeName={item['fStoreName' + (this.Language).toUpperCase()]} storeCategory={item.storeCategory} storeFloor={item.floor} placeName={item['fBuildingName' + (this.Language).toUpperCase()]} image={item['fContentBuilding' + (this.Language).toUpperCase()].fImageJSON[0][this.imageSetting].uri} city={item.fCity} lastVisited={item.lastVisited} contentLikeCount={item.fLikeCountStore} footerLikeCount={item.fLikeCountBuilding} contentImage={item['fContentStore' + (this.Language).toUpperCase()].fStoreImageJSON[0][this.imageSetting].uri} shortDesc={item['fContentStore' + (this.Language).toUpperCase()].fShortDescription} like={item.fUserLikedThis} notification={item.fUserNotificationThis} favorite={item.fUserFavoriteThis} style={style.containerView1}></DefaultStoreCard>
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
                         {/* <View style={{width:w,height:w*0.15,backgroundColor:'transparent'}}></View> */}
                        </View>
                        
                        :
                        <EmptyDetailView text={SGLocalize.translate('globalText.emptyList')} style={style.throwWHP}></EmptyDetailView>
                    :
                    <ActivityIndicator preset={ActivityIndicator.preset.h1} style={{ flex: 1 }}></ActivityIndicator>
                }
                
                <Animated.View style={{ position: 'absolute', transform: [{ translateY: this._baseAnimY.interpolate({ inputRange: [-1, 0], outputRange: [(SGHelperWindow.getStatusBarHeight() - SGHelperWindow.getHeaderHeight()), SGHelperWindow.getStatusBarHeight()] }) },], height: SGHelperWindow.getHeaderHeight(), width: '100%' }}>
                    <NoSortSearchBar accessible={true} accessibilityLabel={'SeeMoreMostLikedStoreScreenNoSortSearchBar'} imageSetting={this.imageSetting} screen='SearchResultInThisPlaceStore' searchKeyword={this.searchKeyword} language={this.Language} buildingKey={this.contentKey} onPressSort={() => { SGHelperNavigation.navigatePush(this.props.navigation, 'Sort', { sortData: this._sortData, onApplySort: (v) => { console.log(v) }, onCloseSort: (v) => { console.log(v) } }) }} onPressFilter={() => { SGHelperNavigation.navigatePush(this.props.navigation, 'Filter', { filterData: this._filterData, buildingMatrix: this._buildingMatrix, onApplyFilter: (v) => {  this._setFilter(v) }, onCloseFilter: (v) => { console.log(v) } }) }} navigator={this.props.navigation} style={this.style.containerView1}></NoSortSearchBar>
                </Animated.View>
                <Animated.View style={{ position: 'absolute', transform: [{ translateY: this._baseAnimY.interpolate({ inputRange: [-1, 0], outputRange: [SGHelperWindow.getWHPNoHeader().h + 8 * p, SGHelperWindow.getWHPNoHeader().h - Math.max(SGHelperWindow.getFooterHeight(), 2 * p) - SGHelperWindow.getHeaderHeight()] }) },], height: Math.max(SGHelperWindow.getFooterHeight(), 2 * p) + SGHelperWindow.getHeaderHeight(), width: '100%' }}>
                    <BottomNavigationContainer navigator={this.props.navigation} style={style.throwWHP}></BottomNavigationContainer>
                </Animated.View>
            </RootView>
        );
    }
}
