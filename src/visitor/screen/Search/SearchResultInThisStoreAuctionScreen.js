
import React from 'react';
import { StyleSheet,Animated} from 'react-native';
import { SGRootView as RootView, SGFlatList as FlatList, SGActivityIndicator as ActivityIndicator, SGView as View } from '../../../core/control';
import { SGBaseScreen } from '../../../core/screen/SGBaseScreen';
import { FullSearchBar } from '../../component_V2/FullSearchBar';
import { DefaultAuctionCard } from '../../container_V2/DefaultAuctionCard';
import { SGHelperNavigation, SGHelperGlobalVar,SGHelperWindow,SGHelperType,SGHelperErrorHandling } from '../../../core/helper';
import { SGLocalize } from '../../locales/SGLocalize';
import { RibbonHeader } from '../../component_V2/RibbonHeader';
import { BottomNavigationContainer } from '../../component_V2/BottomNavigationContainer';
import { filterDAO } from '../../db/filterDAO';
import { sortDAO } from '../../db/sortDAO';
import { VSearchResultAuctionAPI } from '../../api/VSearchResultAuctionAPI';
import { VFilterOptionsAPI } from '../../api/VFilterOptionsAPI';
import { EmptyDetailView } from '../../container_V2/EmptyDetailView';

export class SearchResultInThisStoreAuctionScreen extends SGBaseScreen {

    getPagingData(){
        var itemPerPage = SGHelperType.getPaging()
        return {paging:true,offset:this.pagingCounter, totalPerPage:itemPerPage}
    }

    createStyleSheet = (whp) => {
        var { w, h, p } = whp;
        return StyleSheet.create({
            mainView1: { width: w, height: h, backgroundColor: '#E6E6E6', justifyContent: 'flex-start', },
            throwWHP: { width: w, height: h, padding: p, backgroundColor: 'white' },
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
        this.setState({ refresh: false,});
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

            this.baseAddAPIParallel('SearchStoreAuctionListWithKeyword', (async (v1,v2,v3,v4,v5,v6) => { return VSearchResultAuctionAPI.SearchStoreAuctionListWithKeyword(v1,v2,v3,v4,v5,v6); }).bind(this, this.Language, this.searchKeyword, this._filterData, this._sortData, this.storeKey,this.paging), ((v) => {
                this.data = v;
                if(v.length<SGHelperType.getPaging())this.setState({stopPulling:true})
                else this.setState({stopPulling:false})
            }).bind(this),  null);

            this.baseRunAPIParallel();
        } else {
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

            this.baseRunSingleAPIWithRedoOption('SearchStoreAuctionListWithKeyword', (async (v1, v2, v3, v4, v5,v6) => {  return VSearchResultAuctionAPI.SearchStoreAuctionListWithKeyword(v1,v2,v3,v4,v5,v6); }).bind(this, this.Language, this.searchKeyword, this._filterData, this._sortData, this.storeKey,this.paging), ((v) => {
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
                this.baseRunSingleAPIWithRedoOption('SearchStoreAuctionListWithKeyword', (async (v1, v2, v3,v4,v5,v6) => {  return VSearchResultAuctionAPI.SearchStoreAuctionListWithKeyword(v1,v2,v3,v4,v5,v6); }).bind(this, this.Language, this.searchKeyword, this._filterData, this._sortData, this.storeKey,this.paging), ((v) => {
                    var resData = v
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
        this.storeKey = this.props.route.params.storeKey;
        this._filterData = filterDAO.getInThisStoreAuctionilterDataSearch();
        this._sortData = sortDAO.getAuctionSearchSortData(this.Language.toUpperCase());
        this._buildingMatrix = [];
        this.props.navigation.setOptions({
            headerShown:false,
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

    _getLikeResource(data) {
        var contentStoreID = data.fContentStoreID;
        var contentStoreEN = data.fContentStoreEN;
        var contentStoreCN = data.fContentStoreCN;
        var contentAuctionID = data.fContentAuctionID;
        var contentAuctionEN = data.fContentAuctionEN;
        var contentAuctionCN = data.fContentAuctionCN;
        return (
            { fContentType: 'StoreAuction', fContentKey: data.key, fText1: { id: contentAuctionID.fAuctionName, en: contentAuctionEN.fAuctionName, cn: contentAuctionCN.fAuctionName }, fText2: { id: contentStoreID.fStoreName, en: contentStoreEN.fStoreName, cn: contentStoreCN.fStoreName }, fText3: { id: data.fBuildingNameID, en: data.fBuildingNameEN, cn: data.fBuildingNameCN }, fImageID: contentAuctionID.fImageJSON, fImageEN: contentAuctionEN.fImageJSON, fImageCN: contentAuctionCN.fImageJSON, fTargetKey: data.storeKey }
        )
    }

    _getCommentResource(data) {
        var contentStoreID = data.fContentStoreID;
        var contentStoreEN = data.fContentStoreEN;
        var contentStoreCN = data.fContentStoreCN;
        var contentAuctionID = data.fContentAuctionID;
        var contentAuctionEN = data.fContentAuctionEN;
        var contentAuctionCN = data.fContentAuctionCN;
        return (
            {
                fUserImage: this.currentUserData.fProfileImageJSON, fContentType: 'StoreAuction', fContentKey: data.key,
                fContentName: { id: contentAuctionID.fEventName, en: contentAuctionEN.fEventName, cn: contentAuctionCN.fEventName },
                fContentText1: { id: contentStoreID.fStoreName, en: contentStoreEN.fStoreName, cn: contentStoreCN.fStoreName },
                fContentText2: { id: contentAuctionID.fShortDescription, en: contentAuctionEN.fShortDescription, cn: contentAuctionCN.fShortDescription },
                fContentImage: { id: contentAuctionID.fImageJSON, en: contentAuctionEN.fImageJSON, cn: contentAuctionCN.fImageJSON },
                fTargetType: 'Store', fTargetName: { id: contentStoreID.fStoreName, en: contentStoreEN.fStoreName, cn: contentStoreCN.fStoreName },
                fTargetImage: { id: contentStoreID.fImageJSON, en: contentStoreEN.fImageJSON, cn: contentStoreCN.fImageJSON },
                fTargetKey: data.storeKey
            }
        )
    }

    render() {
        var { w, h, p } = this.WHP;
        var style = this.style;
        console.log('aw')
        return (
            <RootView dummyStatusBar dummyHeaderBar accessible={true} accessibilityLabel={'SearchResultAuctionScreenRootView'} style={style.mainView1}>
                <RibbonHeader imageSetting={this.imageSetting} title={SGLocalize.translate("SearchResultAuctionScreen.screenTitle")} ribbonWidth={0.875}></RibbonHeader>
                {this.alreadyMount ?
                    this.data.length !== 0 ?
                    
                    <View style={{flex:1}}>
                        
                        <FlatList refreshing={this.state.refreshFlatList} onRefresh={this._onRefresh.bind(this)} accessible={true} accessibilityLabel={'SearchResultAuctionScreenList'} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingVertical: p,justifyContent: 'flex-start', alignItems: 'center' }} data={this.data} renderItem={({ item }) => {
                            return (
                                <DefaultAuctionCard fContentType ={'StoreAuction'} onLike={((item, s,c)=>{item.fUserLikedThis = s; item.fLikeCountAuction+=c; this.forceUpdate();}).bind(this,item)} accessible={true} accessibilityLabel={'SeeAllTrendingAuctionScreenDefAuctionCard'} commentPackage={this._getCommentResource(item)} likePackage={this._getLikeResource(item)} navigator={this.props.navigation} likeText={SGLocalize.translate("SeeAllTrendingAuctionScreen.likeText")} key={item.key} contentKey={item.key} auctionName={item['fAuctionName' + (this.Language).toUpperCase()]} storeName={item['fStoreName' + (this.Language).toUpperCase()]} storeCategory={item.storeCategory} location={item.fCity} placeName={item['fBuildingName' + (this.Language).toUpperCase()]} contentImage={item['fContentAuction' + (this.Language).toUpperCase()].fImageJSON[0][this.imageSetting].uri} contentImageShareButton={item['fContentAuction' + (this.Language).toUpperCase()].fImageJSON[0].thumbnailLow.uri} image={item['fContentStore' + (this.Language).toUpperCase()].fStoreImageJSON[0][this.imageSetting].uri} contentLikeCount={item.fLikeCountAuction} footerLikeCount={item.fLikeCountStore} like={item.fUserLikedThis} startDate={item.startDate} endDate={item.endDate} shareMessage={item['fContentAuction' + this.Language.toUpperCase()].fShareMessage} targetKey={item.storeKey} canComment={item.fCanComment} style={style.containerView1}></DefaultAuctionCard>
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
                    </View>
                    
                        :
                        <EmptyDetailView text={SGLocalize.translate('globalText.emptyList')} style={style.throwWHP}></EmptyDetailView>
                    :
                    <ActivityIndicator preset={ActivityIndicator.preset.h1} style={{ flex: 1 }}></ActivityIndicator>
                }
                <Animated.View style={{ position: 'absolute', transform: [{ translateY: this._baseAnimY.interpolate({ inputRange: [-1, 0], outputRange: [(SGHelperWindow.getStatusBarHeight() - SGHelperWindow.getHeaderHeight()), SGHelperWindow.getStatusBarHeight()] }) },], height: SGHelperWindow.getHeaderHeight(), width: '100%' }}>
                    <FullSearchBar accessible={true} accessibilityLabel={'SearchResultAuctionScreenFullSearchBar'} screen={'SearchResultInThisStoreAuction'} storeKey={this.storeKey} searchKeyword={this.searchKeyword} language={this.Language} sortData={this._sortData} onApplySort={(v) => { this._setSort(v) }} onPressFilter={() => { SGHelperNavigation.navigatePush(this.props.navigation, 'Filter', { filterData: this._filterData, buildingMatrix: this._buildingMatrix, onApplyFilter: (v) => { this._setFilter(v) }, onCloseFilter: (v) => { console.log(v) } }) }} navigator={this.props.navigation} style={this.style.containerView1}></FullSearchBar>
                </Animated.View>
                <Animated.View style={{ position: 'absolute', transform: [{ translateY: this._baseAnimY.interpolate({ inputRange: [-1, 0], outputRange: [SGHelperWindow.getWHPNoHeader().h + 8 * p, SGHelperWindow.getWHPNoHeader().h - Math.max(SGHelperWindow.getFooterHeight(), 2 * p) - SGHelperWindow.getHeaderHeight()] }) },], height: Math.max(SGHelperWindow.getFooterHeight(), 2 * p) + SGHelperWindow.getHeaderHeight(), width: '100%' }}>
                    <BottomNavigationContainer navigator={this.props.navigation} style={style.throwWHP}></BottomNavigationContainer>
                </Animated.View>
            </RootView>
        );
    }
}