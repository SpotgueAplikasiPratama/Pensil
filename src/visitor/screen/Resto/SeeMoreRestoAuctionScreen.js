/*
Version 1.2
Adding Paging By Melvin , 29 Maret 2021
 * 1. Yohanes 01 April 2021
 * - add ErrorHandling
*/

import React from 'react';
import { StyleSheet } from 'react-native';
import { SGRootView as RootView, SGFlatList as FlatList, SGActivityIndicator as ActivityIndicator, SGView as View,SGText as Text } from '../../../core/control';
import { SGBaseScreen } from '../../../core/screen/SGBaseScreen';
import { FullSearchBar } from '../../component_V2/FullSearchBar';
import { SGHelperNavigation, SGHelperGlobalVar,SGHelperType,SGHelperWindow, SGHelperErrorHandling } from '../../../core/helper';
import { SGLocalize } from '../../locales/SGLocalize';
import { RibbonHeader } from '../../component_V2/RibbonHeader';
import { BottomNavigationContainer } from '../../component_V2/BottomNavigationContainer';
import { filterDAO } from '../../db/filterDAO';
import { sortDAO } from '../../db/sortDAO';
import { VSeeMoreRestoAuctionAPI } from '../../api/VSeeMoreRestoAuctionAPI';
import { EmptyDetailView } from '../../container_V2/EmptyDetailView';
import { DefaultAuctionCard } from '../../container_V2/DefaultAuctionCard';

export class SeeMoreRestoAuctionScreen extends SGBaseScreen {

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
        this.currentUserImage = SGHelperGlobalVar.getVar('GlobalCurrentUserImage');
        this._buildingMatrix = filterDAO.getBuildingMatrix();

        if(resetPaging){
            this.setState({ refresh: true })
            this.pagingCounter= 0
            this.paging = this.getPagingData()
            this.baseRunSingleAPIWithRedoOption('SearchRestoAuctionList', (async (v1,v2,v3,v4) => { return VSeeMoreRestoAuctionAPI.SearchRestoAuctionList(v1, v2, v3, v4) }).bind(this, this.props.route.params.contentKey, this._filterData, this._sortData,this.paging), ((v) => {           
                this.data = v
                this.pagingCounter = this.data.length
                this.alreadyMount = true;
                if(v.length<SGHelperType.getPaging())this.setState({stopPulling:true})
                else this.setState({stopPulling:false})
                this.setState({ refresh: false });
                this.forceUpdate();
            }).bind(this),  (()=>{ this.setState({ refresh: false }) }),  SGHelperGlobalVar.getVar("ResponTimes"));
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


            this.baseRunSingleAPIWithRedoOption('SearchRestoAuctionList', (async (v1,v2,v3,v4) => { return VSeeMoreRestoAuctionAPI.SearchRestoAuctionList(v1, v2, v3, v4) }).bind(this, this.props.route.params.contentKey, this._filterData, this._sortData,this.paging), ((v) => {           
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
  
            this.currentUser = SGHelperGlobalVar.getVar('GlobalCurrentUser');
            this.currentUserData = SGHelperGlobalVar.getVar('GlobalCurrentUserData');
            this.imageSetting = SGHelperGlobalVar.getVar('GlobalImageSetting');
            this.currentUserImage = SGHelperGlobalVar.getVar('GlobalCurrentUserImage');
            this._buildingMatrix = filterDAO.getBuildingMatrix();
            
            if(!this.state.loading && !this.state.stopPulling){
                
                this.setState({loading:true})
                this.paging = this.getPagingData()
                this.baseRunSingleAPIWithRedoOption('SearchRestoAuctionList', (async (v1,v2,v3,v4) => { return VSeeMoreRestoAuctionAPI.SearchRestoAuctionList(v1, v2, v3, v4) }).bind(this, this.props.route.params.contentKey, this._filterData, this._sortData,this.paging), ((v) => {           
                    var resData =  v 
                    if(resData.length!==0){
                        for(var i=0;i<resData.length;i++){
                            this.data.push(resData[i])
                        }
                        this.pagingCounter = this.pagingCounter + resData.length
                    } else this.setState({stopPulling:true})
                    this.setState({loading:false})
                }).bind(this), null,  SGHelperGlobalVar.getVar("ResponTimes"));
 
                
            }  
    }

    async _setFilter(dataFilter) {
        this._filterData = dataFilter;
        await this._onRefreshAllItem(true);
    }

    async _setSort(dataSort) {
        this._sortData = dataSort;
        await this._onRefreshAllItem(true);
    }

    constructor(props, context, ...args) {
        super(props, context, ...args);
        this.style = this.createStyleSheet(this.WHP);
        var { w, h, p } = this.WHP;
        this.props.navigation.setOptions({
            headerShown: false,
        });
        this.restoKey = this.props.route.params.contentKey;
        this.currentUser = SGHelperGlobalVar.getVar('GlobalCurrentUser');
        this.currentUserData = SGHelperGlobalVar.getVar('GlobalCurrentUserData');
        this.imageSetting = SGHelperGlobalVar.getVar('GlobalImageSetting');
        this._filterData = filterDAO.getRestoRestoAuctionFilterData();
        this._sortData = sortDAO.getRestoRestoAuctionSortData(this.Language.toUpperCase());
        this._buildingMatrix = filterDAO.getBuildingMatrix();
        this.currentUserImage = SGHelperGlobalVar.getVar('GlobalCurrentUserImage');
     
        this.data = [];

       // Paging
       this.state = {  refresh: false ,refreshFlatList:false, loading:false, stopPulling:false };
       this.alreadyMount = false;
       this.refresh=false
       this.pagingCounter = 0
    }

    _getLikeResource(data) {
        var contentStoreID = data.fContentStoreID;
        var contentStoreEN = data.fContentStoreEN;
        var contentStoreCN = data.fContentStoreCN;
        var contentStoreAuctionID = data.fContentAuctionCN;
        var contentStoreAuctionEN = data.fContentAuctionEN;
        var contentStoreAuctionCN = data.fContentAuctionCN;
        return (
            { fContentType: 'RestoAuction', fContentKey: data.key, fText1: { id: contentStoreAuctionID.fAuctionName, en: contentStoreAuctionEN.fAuctionName, cn: contentStoreAuctionCN.fAuctionName }, fText2: { id: contentStoreID.fStoreName, en: contentStoreEN.fStoreName, cn: contentStoreCN.fStoreName }, fText3: { id: data.fBuildingNameID, en: data.fBuildingNameEN, cn: data.fBuildingNameCN }, fImageID: contentStoreAuctionID.fImageJSON, fImageEN: contentStoreAuctionEN.fImageJSON, fImageCN: contentStoreAuctionCN.fImageJSON, fTargetKey: data.storeKey }
        )
    }

    _getCommentResource(data) {
        var contentStoreID = data.fContentStoreID;
        var contentStoreEN = data.fContentStoreEN;
        var contentStoreCN = data.fContentStoreCN;
        var contentStoreAuctionID = data.fContentAuctionID;
        var contentStoreAuctionEN = data.fContentAuctionEN;
        var contentStoreAuctionCN = data.fContentAuctionCN;
        return (
            {
                fUserImage: this.currentUserData.fProfileImageJSON, fContentType: 'RestoAuction', fContentKey: data.key,
                fContentName: { id: contentStoreAuctionID.fAuctionName, en: contentStoreAuctionEN.fAuctionName, cn: contentStoreAuctionCN.fAuctionName },
                fContentText1: { id: contentStoreID.fStoreName, en: contentStoreEN.fStoreName, cn: contentStoreCN.fStoreName },
                fContentText2: { id: contentStoreAuctionID.fShortDescription, en: contentStoreAuctionEN.fShortDescription, cn: contentStoreAuctionCN.fShortDescription },
                fContentImage: { id: contentStoreAuctionID.fImageJSON, en: contentStoreAuctionEN.fImageJSON, cn: contentStoreAuctionCN.fImageJSON },
                fTargetType: 'Resto', fTargetName: { id: contentStoreID.fStoreName, en: contentStoreEN.fStoreName, cn: contentStoreCN.fStoreName },
                fTargetImage: { id: contentStoreID.fStoreImageJSON, en: contentStoreEN.fStoreImageJSON, cn: contentStoreCN.fStoreImageJSON },
                fTargetKey: data.storeKey
            }
        )
    }

    render() {
        var { w, h, p } = this.WHP;
        var style = this.style;
        console.log('see more auction screen')
        console.log(this.data)

        return (

            <RootView dummyStatusBar accessible={true} accessibilityLabel={'SeeMoreRestoPromoScreenRootView'} style={style.mainContainer}>
                <FullSearchBar accessible={true} accessibilityLabel={'SeeMoreRestoPromoScreenFullSearchBar'} imageSetting={this.imageSetting} screen='SearchResultInThisRestoAuction' restoKey={this.restoKey} sortData={this._sortData} onApplySort={ this._setSort.bind(this) } onPressFilter={() => { SGHelperNavigation.navigatePush(this.props.navigation, 'Filter', { filterData: this._filterData, buildingMatrix: this._buildingMatrix, onApplyFilter: (v) => { this._setFilter(v) }, onCloseFilter: (v) => { console.log(v) } }) }} navigator={this.props.navigation} style={this.style.containerView1} language={this.Language}></FullSearchBar>
                {  this.alreadyMount ?
                    this.data.length !== 0 ?
                        (<View style={{ flex: 1 }}>
                            <RibbonHeader imageSetting={this.imageSetting} title={SGLocalize.translate("SearchResultAuctionScreen.screenTitle")}></RibbonHeader>
                            <FlatList refreshing={this.state.refreshFlatList} onRefresh={this._onRefresh.bind(this)} accessible={true} accessibilityLabel={'SeeMoreRestoPromoScreenList'} showsVerticalScrollIndicator={false} contentContainerStyle={{ justifyContent: 'flex-start', alignItems: 'center' }} data={this.data} renderItem={({ item }) => {
                                return (
                                    <DefaultAuctionCard fContentType ={'RestoAuction'} onLike={((item, s,c)=>{item.fUserLikedThis = s; item.fLikeCountAuction+=c; this.forceUpdate();}).bind(this,item)} accessible={true} accessibilityLabel={'SeeAllTrendingAuctionScreenDefAuctionCard'} commentPackage={this._getCommentResource(item)} likePackage={this._getLikeResource(item)} navigator={this.props.navigation} likeText={SGLocalize.translate("SeeAllTrendingAuctionScreen.likeText")} key={item.key} contentKey={item.key} auctionName={item['fAuctionName' + (this.Language).toUpperCase()]} storeName={item['fStoreName' + (this.Language).toUpperCase()]} storeCategory={item.storeCategory} location={item.fCity} placeName={item['fBuildingName' + (this.Language).toUpperCase()]} contentImage={item['fContentAuction' + (this.Language).toUpperCase()].fImageJSON[0][this.imageSetting].uri} contentImageShareButton={item['fContentAuction' + (this.Language).toUpperCase()].fImageJSON[0].thumbnailLow.uri} image={item['fContentStore' + (this.Language).toUpperCase()].fStoreImageJSON[0][this.imageSetting].uri} contentLikeCount={item.fLikeCountAuction} footerLikeCount={item.fLikeCountStore} like={item.fUserLikedThis} startDate={item.startDate} endDate={item.endDate} shareMessage={item['fContentAuction' + this.Language.toUpperCase()].fShareMessage} targetKey={item.storeKey} canComment={item.fCanComment} style={style.containerView1}></DefaultAuctionCard>
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
                        </View>
                        )
                        :
                        (<EmptyDetailView text={SGLocalize.translate('globalText.emptyDetail')} style={style.throwWHP}></EmptyDetailView>)
                    :
                    (<ActivityIndicator preset={ActivityIndicator.preset.h1} style={{ flex: 1 }}></ActivityIndicator>)}
                {/* <View style={{ width: '100%', height: SGHelperWindow.getFooterHeight() }}></View>
                <View style={{ width: '100%', height: SGHelperWindow.getHeaderHeight() }}></View> */}
                <BottomNavigationContainer navigator={this.props.navigation} style={style.throwWHP}>
                </BottomNavigationContainer>
            </RootView>
        );
    }
}
