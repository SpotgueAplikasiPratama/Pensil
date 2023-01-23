/*
Version 1.2
Adding Paging By Melvin , 25 Maret 2021
 * 1. Yohanes 01 April 2021
 * - add ErrorHandling
 *  * 2. Leon 12 Apr 2021
 * - add ErrorHandling
*/

import React from 'react';
import { StyleSheet, Animated } from 'react-native';
import { SGRootView as RootView, SGView as View, SGText as Text, SGFlatList as FlatList, SGActivityIndicator as ActivityIndicator } from '../../../core/control';
import { SGBaseScreen } from '../../../core/screen/SGBaseScreen';
import { FullSearchBar } from '../../component_V2/FullSearchBar';
import { DefaultStoreProductCard } from '../../container_V2/DefaultStoreProductCard';
import { SGHelperNavigation, SGHelperGlobalVar, SGHelperWindow,SGHelperType, SGHelperErrorHandling } from '../../../core/helper';
import { SGLocalize } from '../../locales/SGLocalize';
import { RibbonHeader } from '../../component_V2/RibbonHeader';
import { BottomNavigationContainer } from '../../component_V2/BottomNavigationContainer';
import { filterDAO } from '../../db/filterDAO';
import { sortDAO } from '../../db/sortDAO';
import { VSearchResultStoreProductAPI } from '../../api/VSearchResultStoreProductAPI';
import { VFilterOptionsAPI } from '../../api/VFilterOptionsAPI';
import { EmptyDetailView } from '../../container_V2/EmptyDetailView';

export class SearchResultStoreProductScreen extends SGBaseScreen {

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

    checkAPIBatchStatusAllDone(resetPaging) {
        // if(this.counterBatch===2){
        //     if (this.status.getBuildingMatrix &&
        //         this.status.getData 
        //         ) {
                    
                    this.pagingCounter = this.data.length
                    this.alreadyMount = true;
                    this.setState({ refresh: false,});
                    this.forceUpdate();
        //     }else{
        //         this.counterBatch=0
        //         SGHelperErrorHandling.multiHandling(this.errorBatch,this._onRefreshAllItem.bind(this,resetPaging))
        //         this.errorBatch=[]
        //     }
        // }

    }
    
    async _onRefreshAllItem(resetPaging = false) {
        this.currentUser = SGHelperGlobalVar.getVar('GlobalCurrentUser');
        this.currentUserData = SGHelperGlobalVar.getVar('GlobalCurrentUserData');
        this.imageSetting = SGHelperGlobalVar.getVar('GlobalImageSetting');
        
        // this.status ={
        //     getBuildingMatrix:false,
        //     getData:false,
        // }

        if(resetPaging){
            this.setState({ refresh: true })
            this.pagingCounter= 0
            this.paging = this.getPagingData()

            this.baseInitAPIParallel(SGHelperGlobalVar.getVar("ResponTimes"), (() => { this.checkAPIBatchStatusAllDone(); }).bind(this));

            this.baseAddAPIParallel('getLocationFilter', (async (v1) => { return VFilterOptionsAPI.getLocationFilter(v1); }).bind(this,this.Language), ((v) => {
                this._buildingMatrix = v;
            }).bind(this),  null);


            // VFilterOptionsAPI.getLocationFilter(this.Language).then((v) => {
            //     this._buildingMatrix = v;
            //     this.status.getBuildingMatrix = true; 
            //     }).catch((error)=>{
            //         SGHelperErrorHandling.getMultiError(error,this.errorBatch)
            //     }).finally(()=>{
            //         this.counterBatch++
            //         this.checkAPIBatchStatusAllDone(resetPaging);
            //     })
    
            this.baseAddAPIParallel('getAllSearchResultStoreProduct', (async (v1,v2,v3,v4,v5) => { return VSearchResultStoreProductAPI.getAllSearchResultStoreProduct(v1,v2,v3,v4,v5); }).bind(this, this.Language, this.searchKeyword, this._filterData, this._sortData,this.paging), ((v) => {
                this.data = v;
                if(v.length<SGHelperType.getPaging())this.setState({stopPulling:true})
                else this.setState({stopPulling:false})
            }).bind(this),  null);

            // VSearchResultStoreProductAPI.getAllSearchResultStoreProduct(this.Language, this.searchKeyword, this._filterData, this._sortData,this.paging).then((v) => {
            //     this.data = v;
            //     this.status.getData = true; 
            // }).catch((error)=>{
            //     SGHelperErrorHandling.getMultiError(error,this.errorBatch)
            // }).finally(()=>{
            //     this.counterBatch++
            //     this.checkAPIBatchStatusAllDone(resetPaging);
            // })
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


            this.baseRunSingleAPIWithRedoOption('getAllSearchResultStoreProduct', (async (v1, v2, v3, v4, v5) => { return VSearchResultStoreProductAPI.getAllSearchResultStoreProduct(v1, v2, v3, v4, v5) }).bind(this, this.Language, this.searchKeyword, this._filterData, this._sortData,this.paging), ((v) => {
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
            console.log('load more')
            if(!this.state.loading && !this.state.stopPulling){
                
                this.setState({loading:true})
                this.paging = this.getPagingData()

                this.baseRunSingleAPIWithRedoOption('getAllSearchResultStoreProduct', (async (v1, v2, v3,v4,v5) => {  return VSearchResultStoreProductAPI.getAllSearchResultStoreProduct(v1, v2, v3,v4,v5) }).bind(this, this.Language, this.searchKeyword, this._filterData, this._sortData,this.paging), ((v) => {           
                    var resData = v// await VSearchResultStoreProductAPI.getAllSearchResultStoreProduct(this.Language, this.searchKeyword, this._filterData, this._sortData,this.paging);
                    if(resData.length!==0){
                        for(var i=0;i<resData.length;i++){
                            this.data.push(resData[i])
                        }
                        this.pagingCounter = this.pagingCounter + resData.length
                    } else this.setState({stopPulling:true})
                    this.setState({loading:false})
                }).bind(this), (()=>{   this.setState({loading:false}) }), SGHelperGlobalVar.getVar("ResponTimes"));
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
        this.currentUser = SGHelperGlobalVar.getVar('GlobalCurrentUser');
        this.currentUserData = SGHelperGlobalVar.getVar('GlobalCurrentUserData');
        this.imageSetting = SGHelperGlobalVar.getVar('GlobalImageSetting');
        this.searchKeyword = this.props.route.params.searchKeyword;
        this.data = [];
        this._filterData = filterDAO.getStoreProductFilterData();
        this._sortData = sortDAO.getStoreProductSortData();
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

    _getLikeResourceStoreProduct(data) {
        var contentStoreID = data.fContentStoreID;
        var contentStoreEN = data.fContentStoreEN;
        var contentStoreCN = data.fContentStoreCN;
        var contentStoreProductID = data.fContentProductID;
        var contentStoreProductEN = data.fContentProductEN;
        var contentStoreProductCN = data.fContentProductCN;
        return (
            { fContentType: 'StoreProduct', fContentKey: data.productKey, fText1: { id: contentStoreProductID.fProductName, en: contentStoreProductEN.fProductName, cn: contentStoreProductCN.fProductName }, fText2: { id: contentStoreID.fStoreName, en: contentStoreEN.fStoreName, cn: contentStoreCN.fStoreName }, fText3: { id: data.fBuildingNameID, en: data.fBuildingNameEN, cn: data.fBuildingNameCN }, fImageID: contentStoreProductID.fImageJSON, fImageEN: contentStoreProductEN.fImageJSON, fImageCN: contentStoreProductCN.fImageJSON, fTargetKey: data.storeKey }
        )
    }

    _getCommentResourceStoreProduct(data) {
        var contentStoreID = data.fContentStoreID;
        var contentStoreEN = data.fContentStoreEN;
        var contentStoreCN = data.fContentStoreCN;
        var contentStoreProductID = data.fContentProductID;
        var contentStoreProductEN = data.fContentProductEN;
        var contentStoreProductCN = data.fContentProductCN;

        return (
            {
                fUserImage: this.currentUserData.fProfileImageJSON, fContentType: 'StoreProduct', fContentKey: data.productKey,
                fContentName: { id: contentStoreProductID.fProductName, en: contentStoreProductEN.fProductName, cn: contentStoreProductCN.fProductName },
                fContentText1: { id: contentStoreID.fStoreName, en: contentStoreEN.fStoreName, cn: contentStoreCN.fStoreName },
                fContentText2: { id: data.fBuildingNameID, en: data.fBuildingNameEN, cn: data.fBuildingNameCN },
                fContentImage: { id: contentStoreProductID.fImageJSON, en: contentStoreProductEN.fImageJSON, cn: contentStoreProductCN.fImageJSON },
                fTargetType: 'Store', fTargetName: { id: contentStoreID.fStoreName, en: contentStoreEN.fStoreName, cn: contentStoreCN.fStoreName },
                fTargetImage: { id: contentStoreID.fStoreImageJSON, en: contentStoreEN.fStoreImageJSON, cn: contentStoreCN.fStoreImageJSON },
                fTargetKey: data.storeKey
            }
        )
    }

    render() {
        var { w, h, p } = this.WHP;
        var style = this.style;

        return (
            <RootView dummyStatusBar dummyHeaderBar accessible={true} accessibilityLabel={'SearchResultStoreProductScreenRootView'} style={style.mainContainer}>
                <RibbonHeader imageSetting={this.imageSetting} title={SGLocalize.translate("SearchResultStoreProductScreen.screenTitle")}></RibbonHeader>
                {this.alreadyMount ?
                    this.data.length !== 0 ?
                        <FlatList refreshing={this.state.refreshFlatList} onRefresh={this._onRefresh.bind(this)} accessible={true} accessibilityLabel={'SearchResultStoreProductScreenList'} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingVertical: p, justifyContent: 'flex-start', alignItems: 'center' }} data={this.data} renderItem={({ item }) => {
                            return (
                                <DefaultStoreProductCard onLike={((item, s,c)=>{item.fUserLikedThis = s; item.fLikeCountProduct+=c; this.forceUpdate();}).bind(this,item)} accessible={true} accessibilityLabel={'SearchResultStoreProductScreenDefStoreProductCard'} likePackage={this._getLikeResourceStoreProduct(item)} commentPackage={this._getCommentResourceStoreProduct(item)} navigator={this.props.navigation} imageSetting={this.imageSetting} footer={false} likeText={SGLocalize.translate("SearchResultStoreProductScreen.likeText")} key={item.productKey} contentKey={item.productKey} productName={item['fContentProduct' + this.Language.toUpperCase()].fProductName} normalPrice={item.fCNormalPrice} promoPrice={item.fCPromoPrice} contentImageShareButton={item['fContentProduct' + this.Language.toUpperCase()].fImageJSON[0].thumbnailLow.uri} storeKey={item.storeKey} fCurrency={item.fCurrency} storeName={item['fContentStore' + this.Language.toUpperCase()].fStoreName} storeCategory={item.storeCategory} footerLikeCount={item.fLikeCountStore} footerImage={item['fContentStore' + this.Language.toUpperCase()].fStoreImageJSON[0][this.imageSetting].uri} placeName={item['fBuildingName' + this.Language.toUpperCase()]} city={item.fCity} contentLikeCount={item.fLikeCountProduct} contentImage={item['fContentProduct' + this.Language.toUpperCase()].fImageJSON[0][this.imageSetting].uri} like={item.fUserLikedThis} shareMessage={item['fContentProduct' + this.Language.toUpperCase()].fShareMessage} targetKey={item.storeKey} canComment={item.fCanComment} style={style.containerView1}></DefaultStoreProductCard>
                            );
                        }} keyExtractor={item => item.key}
                        onEndReached={this._onLoad.bind(this)}
                        onEndReachedThreshold={SGHelperType.getThreshold()}
                        ListFooterComponent={()=>{
                            return(
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
                {/* <View style={{ width: '100%', height: SGHelperWindow.getFooterHeight() }}></View>
                <View style={{ width: '100%', height: SGHelperWindow.getHeaderHeight() }}></View> */}
                <Animated.View style={{ position: 'absolute', transform: [{ translateY: this._baseAnimY.interpolate({ inputRange: [-1, 0], outputRange: [(SGHelperWindow.getStatusBarHeight() - SGHelperWindow.getHeaderHeight()), SGHelperWindow.getStatusBarHeight()] }) },], height: SGHelperWindow.getHeaderHeight(), width: '100%' }}>
                    <FullSearchBar accessible={true} accessibilityLabel={'SearchResultRestoMenuScreenFullSearchBar'} storeKey={this.storeKey} searchKeyword={this.searchKeyword} language={this.Language} onPressSort={() => { SGHelperNavigation.navigatePush(this.props.navigation, 'Sort', { sortData: this._sortData, onApplySort: (v) => { this._setSort(v) }, onCloseSort: (v) => { console.log(v) } }) }} onPressFilter={() => { SGHelperNavigation.navigatePush(this.props.navigation, 'Filter', { filterData: this._filterData, buildingMatrix: this._buildingMatrix, onApplyFilter: (v) => { this._setFilter(v) }, onCloseFilter: (v) => { console.log(v) } }) }} navigator={this.props.navigation} style={this.style.containerView1}></FullSearchBar>
                </Animated.View>
                <Animated.View style={{ position: 'absolute', transform: [{ translateY: this._baseAnimY.interpolate({ inputRange: [-1, 0], outputRange: [SGHelperWindow.getWHPNoHeader().h + 8 * p, SGHelperWindow.getWHPNoHeader().h - Math.max(SGHelperWindow.getFooterHeight(), 2 * p) - SGHelperWindow.getHeaderHeight()] }) },], height: Math.max(SGHelperWindow.getFooterHeight(), 2 * p) + SGHelperWindow.getHeaderHeight(), width: '100%' }}>
                    <BottomNavigationContainer navigator={this.props.navigation} style={style.throwWHP}></BottomNavigationContainer>
                </Animated.View>
            </RootView>
        );
    }
}