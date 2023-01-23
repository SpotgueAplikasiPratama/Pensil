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
import { DefaultRestoMenuCard } from '../../container_V2/DefaultRestoMenuCard';
import { SGHelperNavigation, SGHelperGlobalVar, SGHelperWindow,SGHelperType, SGHelperErrorHandling } from '../../../core/helper';
import { SGLocalize } from '../../locales/SGLocalize';
import { RibbonHeader } from '../../component_V2/RibbonHeader';
import { BottomNavigationContainer } from '../../component_V2/BottomNavigationContainer';
import { filterDAO } from '../../db/filterDAO';
import { sortDAO } from '../../db/sortDAO';
import { VSearchResultRestoMenuAPI } from '../../api/VSearchResultRestoMenuAPI';
import { VFilterOptionsAPI } from '../../api/VFilterOptionsAPI';
import { EmptyDetailView } from '../../container_V2/EmptyDetailView';

export class SearchResultRestoMenuScreen extends SGBaseScreen {

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
    
            this.baseAddAPIParallel('getAllSearchResultRestoMenu', (async (v1,v2,v3,v4,v5) => { return VSearchResultRestoMenuAPI.getAllSearchResultRestoMenu(v1,v2,v3,v4,v5); }).bind(this, this.Language, this.searchKeyword, this._filterData, this._sortData,this.paging), ((v) => {
                this.data = v;
                if(v.length<SGHelperType.getPaging())this.setState({stopPulling:true})
                else this.setState({stopPulling:false})
            }).bind(this),  null);

            // VSearchResultRestoMenuAPI.getAllSearchResultRestoMenu(this.Language, this.searchKeyword, this._filterData, this._sortData,this.paging).then((v) => {
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


            this.baseRunSingleAPIWithRedoOption('getAllSearchResultRestoMenu', (async (v1, v2, v3, v4, v5) => { return VSearchResultRestoMenuAPI.getAllSearchResultRestoMenu(v1, v2, v3, v4, v5) }).bind(this, this.Language, this.searchKeyword, this._filterData, this._sortData,this.paging), ((v) => {
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
            console.log('load')
            if(!this.state.loading && !this.state.stopPulling){
                
                this.setState({loading:true})
                this.paging = this.getPagingData()

                this.baseRunSingleAPIWithRedoOption('getAllSearchResultRestoMenu', (async (v1, v2, v3,v4,v5) => { return VSearchResultRestoMenuAPI.getAllSearchResultRestoMenu(v1, v2, v3,v4,v5) }).bind(this, this.Language, this.searchKeyword, this._filterData, this._sortData,this.paging), ((v) => {           
                    var resData = v// await VSearchResultRestoMenuAPI.getAllSearchResultRestoMenu(this.Language, this.searchKeyword, this._filterData, this._sortData,this.paging);
                    if(resData.length!==0){
                        for(var i=0;i<resData.length;i++){
                            this.data.push(resData[i])
                        }
                        this.pagingCounter = this.pagingCounter + resData.length
                    } else this.setState({stopPulling:true})
                    this.setState({loading:false})
                }).bind(this), (()=>{    this.setState({loading:false}) }), SGHelperGlobalVar.getVar("ResponTimes"));

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
        this._filterData = filterDAO.getRestoMenuFilterData();
        this._sortData = sortDAO.getRestoMenuSortData();
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

    getLikeResourceRestoMenu(data) {
        var contentRestoID = data.fContentRestoID;
        var contentRestoEN = data.fContentRestoEN;
        var contentRestoCN = data.fContentRestoCN;
        var contentRestoMenuID = data.fContentProductID;
        var contentRestoMenuEN = data.fContentProductEN;
        var contentRestoMenuCN = data.fContentProductCN;
        return (
            { fContentType: 'RestoMenu', fContentKey: data.productKey, fText1: { id: contentRestoMenuID.fProductName, en: contentRestoMenuEN.fProductName, cn: contentRestoMenuCN.fProductName }, fText2: { id: contentRestoID.fStoreName, en: contentRestoEN.fStoreName, cn: contentRestoCN.fStoreName }, fText3: { id: data.fBuildingNameID, en: data.fBuildingNameEN, cn: data.fBuildingNameCN }, fImageID: contentRestoMenuID.fImageJSON, fImageEN: contentRestoMenuEN.fImageJSON, fImageCN: contentRestoMenuCN.fImageJSON, fTargetKey: data.restoKey }
        )
    }

    _getCommentResourceRestoMenu(data) {
        var contentRestoID = data.fContentRestoID;
        var contentRestoEN = data.fContentRestoEN;
        var contentRestoCN = data.fContentRestoCN;
        var contentRestoMenuID = data.fContentProductID;
        var contentRestoMenuEN = data.fContentProductEN;
        var contentRestoMenuCN = data.fContentProductCN;

        return (
            {
                fUserImage: this.currentUserData.fProfileImageJSON, fContentType: 'RestoMenu', fContentKey: data.productKey,
                fContentName: { id: contentRestoMenuID.fProductName, en: contentRestoMenuEN.fProductName, cn: contentRestoMenuCN.fProductName },
                fContentText1: { id: contentRestoID.fStoreName, en: contentRestoEN.fStoreName, cn: contentRestoCN.fStoreName },
                fContentText2: { id: data.fBuildingNameID, en: data.fBuildingNameEN, cn: data.fBuildingNameCN },
                fContentImage: { id: contentRestoMenuID.fImageJSON, en: contentRestoMenuEN.fImageJSON, cn: contentRestoMenuCN.fImageJSON },
                fTargetType: 'Resto', fTargetName: { id: contentRestoID.fStoreName, en: contentRestoEN.fStoreName, cn: contentRestoCN.fStoreName },
                fTargetImage: { id: contentRestoID.fStoreImageJSON, en: contentRestoEN.fStoreImageJSON, cn: contentRestoCN.fStoreImageJSON },
                fTargetKey: data.restoKey
            }
        )
    }

    render() {
        var { w, h, p } = this.WHP;
        var style = this.style;

        return (
            <RootView dummyStatusBar dummyHeaderBar accessible={true} accessibilityLabel={'SearchResultRestoMenuScreenRootView'} style={style.mainContainer}>
                <RibbonHeader imageSetting={this.imageSetting} title={SGLocalize.translate("SearchResultRestoMenuScreen.screenTitle")}></RibbonHeader>
                {this.alreadyMount ?
                    this.data.length !== 0 ?
                        <FlatList refreshing={this.state.refreshFlatList} onRefresh={this._onRefresh.bind(this)} accessible={true} accessibilityLabel={'SearchResultRestoMenuScreenList'} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingVertical: p, justifyContent: 'flex-start', alignItems: 'center' }} data={this.data} renderItem={({ item }) => {
                            return (
                                <DefaultRestoMenuCard onLike={((item, s,c)=>{item.fUserLikedThis = s; item.fLikeCountProduct+=c; this.forceUpdate();}).bind(this,item)}  accessible={true} accessibilityLabel={'SearchResultRestoMenuScreenDefRestoMenuCard'} likePackage={this._getLikeResourceRestoMenu(item)} commentPackage={this._getCommentResourceRestoMenu(item)} navigator={this.props.navigation} imageSetting={this.imageSetting} likeText={SGLocalize.translate("SearchResultRestoMenuScreen.likeText")} key={item.productKey} contentKey={item.productKey} menuName={item['fContentProduct' + this.Language.toUpperCase()].fProductName} normalPrice={item.fCNormalPrice} promoPrice={item.fCPromoPrice}  restoKey={x.restoKey} fCurrency={x.fCurrency} restoName={item['fContentResto' + this.Language.toUpperCase()].fStoreName} restoCategory={item.restoCategory} restoCuisine={item.restoCuisine} footerLikeCount={item.fLikeCountResto} placeName={item['fBuildingName' + this.Language.toUpperCase()]} footerImage={item['fContentResto' + this.Language.toUpperCase()].fStoreImageJSON[0][this.imageSetting].uri} location={item.fCity} contentLikeCount={item.fLikeCountProduct} contentImage={item['fContentProduct' + this.Language.toUpperCase()].fImageJSON[0][this.imageSetting].uri} contentImageShareButton={item['fContentProduct' + this.Language.toUpperCase()].fImageJSON[0].thumbnailLow.uri} like={item.fUserLikedThis} shareMessage={x['fContentProduct' + this.Language.toUpperCase()].fShareMessage} targetKey={x.restoKey} canComment={x.fCanComment} style={style.containerView1}></DefaultRestoMenuCard>
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
            </RootView>
        );
    }
}