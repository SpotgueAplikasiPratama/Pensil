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
import { SGRootView as RootView, SGFlatList as FlatList, SGActivityIndicator as ActivityIndicator, SGView as View } from '../../../core/control';
import { SGBaseScreen } from '../../../core/screen/SGBaseScreen';
import { FullSearchBar } from '../../component_V2/FullSearchBar';
import { DefaultStorePromoCard } from '../../container_V2/DefaultStorePromoCard';
import { SGHelperNavigation, SGHelperGlobalVar, SGHelperWindow,SGHelperType, SGHelperErrorHandling } from '../../../core/helper';
import { SGLocalize } from '../../locales/SGLocalize';
import { RibbonHeader } from '../../component_V2/RibbonHeader';
import { BottomNavigationContainer } from '../../component_V2/BottomNavigationContainer';
import { filterDAO } from '../../db/filterDAO';
import { sortDAO } from '../../db/sortDAO';
import { VSearchInThisStoreAPI } from '../../api/VSearchInThisStoreAPI';
import { VFilterOptionsAPI } from '../../api/VFilterOptionsAPI';
import { EmptyDetailView } from '../../container_V2/EmptyDetailView';

export class SearchResultInThisStoreStorePromoScreen extends SGBaseScreen {

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

            this.baseAddAPIParallel('getSearchInStoreStorePromo', (async (v1,v2,v3,v4,v5,v6) => { return VSearchInThisStoreAPI.getSearchInStoreStorePromo(v1,v2,v3,v4,v5,v6); }).bind(this, this.Language, this.searchKeyword, this._filterData, this._sortData, this.storeKey,this.paging), ((v) => {
                this.data = v;
                if(v.length<SGHelperType.getPaging())this.setState({stopPulling:true})
                else this.setState({stopPulling:false})
            }).bind(this),  null);

            // VSearchInThisStoreAPI.getSearchInStoreStorePromo(this.Language, this.searchKeyword, this._filterData, this._sortData, this.storeKey,this.paging).then((v) => {
            //     this.data = v;
            //     this.status.getData = true; 
            // }).catch((error)=>{
            //     SGHelperErrorHandling.getMultiError(error,this.errorBatch)
            // }).finally(()=>{
            //     this.counterBatch++
            //     this.checkAPIBatchStatusAllDone(resetPaging);
            // })

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


            this.baseRunSingleAPIWithRedoOption('getSearchInStoreStorePromo', (async (v1, v2, v3, v4, v5,v6) => { return VSearchInThisStoreAPI.getSearchInStoreStorePromo(v1, v2, v3, v4, v5,v6) }).bind(this, this.Language, this.searchKeyword, this._filterData, this._sortData, this.storeKey,this.paging), ((v) => {
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
            if(!this.state.loading && !this.state.stopPulling){
            
                this.setState({loading:true})
                this.paging = this.getPagingData()

                this.baseRunSingleAPIWithRedoOption('getSearchInStoreStorePromo', (async (v1, v2, v3,v4,v5,v6) => { return VSearchInThisStoreAPI.getSearchInStoreStorePromo(v1, v2, v3,v4,v5,v6) }).bind(this, this.Language, this.searchKeyword, this._filterData, this._sortData, this.storeKey,this.paging), ((v) => {           
                    var resData = v// await VSearchInThisStoreAPI.getSearchInStoreStorePromo(this.Language, this.searchKeyword, this._filterData, this._sortData, this.storeKey,this.paging);
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
        this.storeKey = this.props.route.params.storeKey;
        this._filterData = filterDAO.getInThisStoreStorePromoFilterDataSearch();
        this._sortData = sortDAO.getStorePromoSearchInStoreSortData(this.Language.toUpperCase());
        this._buildingMatrix = [];
        this.props.navigation.setOptions({
            headerShown: false,
        });
        // Paging
        this.state = {  refresh: false , refreshFlatList:false, loading:false, stopPulling:false };
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

    _getLikeResourceStorePromo(data) {
        var contentStoreID = data.fContentStoreID;
        var contentStoreEN = data.fContentStoreEN;
        var contentStoreCN = data.fContentStoreCN;
        var contentStorePromoID = data.fContentStorePromoID;
        var contentStorePromoEN = data.fContentStorePromoEN;
        var contentStorePromoCN = data.fContentStorePromoCN;
        return (
            { fContentType: 'StorePromo', fContentKey: data.key, fText1: { id: contentStorePromoID.fEventName, en: contentStorePromoEN.fEventName, cn: contentStorePromoCN.fEventName }, fText2: { id: contentStoreID.fStoreName, en: contentStoreEN.fStoreName, cn: contentStoreCN.fStoreName }, fText3: { id: data.fBuildingNameID, en: data.fBuildingNameEN, cn: data.fBuildingNameCN }, fImageID: contentStorePromoID.fImageJSON, fImageEN: contentStorePromoEN.fImageJSON, fImageCN: contentStorePromoCN.fImageJSON, fTargetKey: data.storeKey }
        )
    }

    _getCommentResourceStorePromo(data) {
        var contentStoreID = data.fContentStoreID;
        var contentStoreEN = data.fContentStoreEN;
        var contentStoreCN = data.fContentStoreCN;
        var contentStorePromoID = data.fContentStorePromoID;
        var contentStorePromoEN = data.fContentStorePromoEN;
        var contentStorePromoCN = data.fContentStorePromoCN;
        return (
            {
                fUserImage: this.currentUserData.fProfileImageJSON, fContentType: 'StorePromo', fContentKey: data.key,
                fContentName: { id: contentStorePromoID.fEventName, en: contentStorePromoEN.fEventName, cn: contentStorePromoCN.fEventName },
                fContentText1: { id: contentStoreID.fStoreName, en: contentStoreEN.fStoreName, cn: contentStoreCN.fStoreName },
                fContentText2: { id: contentStorePromoID.fShortDescription, en: contentStorePromoEN.fShortDescription, cn: contentStorePromoCN.fShortDescription },
                fContentImage: { id: contentStorePromoID.fImageJSON, en: contentStorePromoEN.fImageJSON, cn: contentStorePromoCN.fImageJSON },
                fTargetType: 'Store', fTargetName: { id: contentStoreID.fStoreName, en: contentStoreEN.fStoreName, cn: contentStoreCN.fStoreName },
                fTargetImage: { id: contentStoreID.fImageJSON, en: contentStoreEN.fImageJSON, cn: contentStoreCN.fImageJSON },
                fTargetKey: data.storeKey
            }
        )
    }

    render() {
        var { w, h, p } = this.WHP;
        var style = this.style;
        console.log('searchresultinthistorepromo')
        return (
            <RootView dummyStatusBar dummyHeaderBar accessible={true} accessibilityLabel={'SearchResultStorePromoScreenRootView'} style={style.mainContainer}>
                <RibbonHeader imageSetting={this.imageSetting} title={SGLocalize.translate("SearchResultStorePromoScreen.screenTitle")} ribbonWidth={0.875}></RibbonHeader>
                {this.alreadyMount ?
                    this.data.length !== 0 ?
                        (<FlatList refreshing={this.state.refreshFlatList} onRefresh={this._onRefresh.bind(this)} accessible={true} accessibilityLabel={'SearchResultStorePromoScreenList'} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingVertical: p, justifyContent: 'flex-start', alignItems: 'center' }} data={this.data} renderItem={({ item }) => {

                            return (
                                <DefaultStorePromoCard onLike={((item, s,c)=>{item.fUserLikedThis = s; item.fLikeCountStorePromo+=c; this.forceUpdate();}).bind(this,item)} accessible={true} accessibilityLabel={'SearchResultStorePromoScreenDefStorePromoCard'} likePackage={this._getLikeResourceStorePromo(item)} commentPackage={this._getCommentResourceStorePromo(item)} navigator={this.props.navigation} likeText={SGLocalize.translate("SearchResultStorePromoScreen.likeText")} key={item.key} contentKey={item.key} eventName={item['fEventName' + (this.Language).toUpperCase()]} storeName={item['fStoreName' + (this.Language).toUpperCase()]} storeCategory={item.storeCategory} location={item.fCity} placeName={item['fBuildingName' + (this.Language).toUpperCase()]} contentImage={item['fContentStorePromo' + (this.Language).toUpperCase()].fImageJSON[0][this.imageSetting].uri} contentImageShareButton={item['fContentStorePromo' + (this.Language).toUpperCase()].fImageJSON[0].thumbnailLow.uri} image={item['fContentStore' + (this.Language).toUpperCase()].fStoreImageJSON[0][this.imageSetting].uri} contentLikeCount={item.fLikeCountStorePromo} footerLikeCount={item.fLikeCountStore} like={item.fUserLikedThis} startDate={item.startDate} endDate={item.endDate} shareMessage={item['fContentStorePromo' + this.Language.toUpperCase()].fShareMessage} targetKey={item.storeKey} canComment={item.fCanComment} style={style.containerView1}></DefaultStorePromoCard>
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
                        </FlatList>)
                        :
                        (<EmptyDetailView text={SGLocalize.translate('globalText.emptyList')} style={style.throwWHP}></EmptyDetailView>)
                    :
                    (<ActivityIndicator preset={ActivityIndicator.preset.h1} style={{ flex: 1 }}></ActivityIndicator>)
                }
                 {/* <View style={{width:w,height:w*0.15,backgroundColor:'transparent'}}></View> */}
                <Animated.View style={{ position: 'absolute', transform: [{ translateY: this._baseAnimY.interpolate({ inputRange: [-1, 0], outputRange: [(SGHelperWindow.getStatusBarHeight() - SGHelperWindow.getHeaderHeight()), SGHelperWindow.getStatusBarHeight()] }) },], height: SGHelperWindow.getHeaderHeight(), width: '100%' }}>
                    <FullSearchBar accessible={true} accessibilityLabel={'SearchResultFavoriteStorePromoScreenFullSearchBar'} storeKey={this.storeKey}  screen={'SearchResultInThisStoreStorePromo'} searchKeyword={this.searchKeyword} language={this.Language} sortData={this._sortData} onApplySort={(v) => { this._setSort(v) }} onPressFilter={() => { SGHelperNavigation.navigatePush(this.props.navigation, 'Filter', { filterData: this._filterData, buildingMatrix: this._buildingMatrix, onApplyFilter: (v) => { this._setFilter(v) }, onCloseFilter: (v) => { console.log(v) } }) }} navigator={this.props.navigation} style={this.style.containerView1}></FullSearchBar>
                </Animated.View>
                <Animated.View style={{ position: 'absolute', transform: [{ translateY: this._baseAnimY.interpolate({ inputRange: [-1, 0], outputRange: [SGHelperWindow.getWHPNoHeader().h + 8 * p, SGHelperWindow.getWHPNoHeader().h - Math.max(SGHelperWindow.getFooterHeight(), 2 * p) - SGHelperWindow.getHeaderHeight()] }) },], height: Math.max(SGHelperWindow.getFooterHeight(), 2 * p) + SGHelperWindow.getHeaderHeight(), width: '100%' }}>
                    <BottomNavigationContainer navigator={this.props.navigation} style={style.throwWHP}></BottomNavigationContainer>
                </Animated.View>
            </RootView>
        );
    }
}