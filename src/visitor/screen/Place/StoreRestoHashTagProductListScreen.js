/*
Version 1.2
Adding Paging By Melvin , 29 Maret 2021
 * 1. Yohanes 01 April 2021
 * - add ErrorHandling
* Leon, 4 May 2021
  - Fix Like
*/
import React from 'react';
import { StyleSheet,Animated } from 'react-native';
import { SGView as View, SGRootView as RootView, SGText as Text, SGPicker as Picker, SGFlatList as FlatList, SGActivityIndicator as ActivityIndicator,SGDialogBox } from '../../../core/control';
import { SGBaseScreen } from '../../../core/screen/SGBaseScreen';
import { BottomNavigationContainer } from '../../component_V2/BottomNavigationContainer';
import { SGLocalize } from '../../locales/SGLocalize';
import { SGHelperNavigation, SGHelperGlobalVar,SGHelperWindow,SGHelperType, SGHelperErrorHandling } from '../../../core/helper';
import { sortDAO } from '../../db/sortDAO';
import { ProductSliderListMixCard } from '../../container_V2/ProductSliderListMixCard'
import { EmptyDetailView } from '../../container_V2/EmptyDetailView';
import { VMallHomeAPI } from '../../api/VMallHomeAPI';
import { PromoSalesSearchBar } from '../../component_V2/PromoSalesSearchBar';
import { tbVUserViewAPI } from '../../api/tbVUserViewAPI';

export class StoreRestoHashTagProductListScreen extends SGBaseScreen {

    getPagingData(){
        var itemPerPage = SGHelperType.getPaging()
        return {paging:true,offset:this.pagingCounter, totalPerPage:itemPerPage}
    }

    async componentDidMount() {
        await this._onRefreshAllItem(true);
        this._unsubscribe = this.props.navigation.addListener('focus', async () => {
            await this._onRefreshAllItem();
        });
        var jsonInput = { fID: '', fContentType: 'SeeAllHashTagSales',  fTargetKey: SGHelperType.getGUID(), fUserKey: '', fActive: 'Y', fCreatedByID: '', fCreatedDate: new Date(), fLastModifiedByID: '', fLastModifiedDate: new Date() }
        this._addUserClick(jsonInput)
    }

    _addUserClick(jsonInput){
        console.log('user click');
        tbVUserViewAPI.addUserClick(jsonInput).then(()=>{}).catch((error)=>{
            SGHelperErrorHandling.Handling(error,this._addUserClick(this,jsonInput))
        })
    }

    componentWillUnmount() {
        if (this._unsubscribe) { this._unsubscribe(); }
    }

    async _onRefreshAllItem(resetPaging = false) {
       
        this.currentUser = SGHelperGlobalVar.getVar('GlobalCurrentUser');
        this.currentUserData = SGHelperGlobalVar.getVar('GlobalCurrentUserData');
        this.imageSetting = SGHelperGlobalVar.getVar('GlobalImageSetting');
        this.currentUserImage = SGHelperGlobalVar.getVar('GlobalCurrentUserImage');
        if(resetPaging){
            this.setState({ refresh: true })
            this.pagingCounter= 0
            this.paging = this.getPagingData()
           
                this.baseRunSingleAPIWithRedoOption('SearchBuildingHighlightSeeMoreSaleHashtag', (async (v1,v2,v3,v4,v5,v6) => { return VMallHomeAPI.SearchBuildingHighlightSeeMoreSaleHashtag(v1, v2, v3, v4,v5,v6) }).bind(this, this.props.route.params.buildingKey,this.Language,this.searchKeyword, this._filterData, this.sortArr,this.paging), ((v) => {
                    this.data = v 
                    this._onPullAPIDone()
                }).bind(this), null,  SGHelperGlobalVar.getVar("ResponTimes"));
           
            
        }  else {
            this.forceUpdate();
        }
    }   

    async _onRefresh() {
        this.setState({ refresh: true ,stopPulling:true})
        console.log("_onRefresh")
        if(!this.refresh && !this.state.loading){
            this.refresh= true
            this.pagingCounter = 0
            this.paging = this.getPagingData()

            this.baseRunSingleAPIWithRedoOption('SearchBuildingHighlightSeeMoreSaleHashtag', (async (v1,v2,v3,v4,v5,v6) => { return VMallHomeAPI.SearchBuildingHighlightSeeMoreSaleHashtag(v1, v2, v3, v4,v5,v6) }).bind(this, this.props.route.params.buildingKey,this.Language,this.searchKeyword, this._filterData, this.sortArr,this.paging), ((v) => {
                    this.data = v
                    this.pagingCounter = this.data.length
                    if(v.length<SGHelperType.getPaging())this.setState({stopPulling:true})
                    else this.setState({stopPulling:false})
                    this.refresh=false
                    this.setState({ refresh: false});
                    this.forceUpdate()
                }).bind(this), null,  SGHelperGlobalVar.getVar("ResponTimes"));
           
        }
    }

    _onPullAPIDone(){
        this.pagingCounter = this.data.length
        this.alreadyMount = true;
        if(this.data.length<SGHelperType.getPaging())this.setState({stopPulling:true})
        else this.setState({stopPulling:false})
        this.setState({ refresh: false });
        this.forceUpdate();
    }

    async _onLoad(){
       
        this.currentUser = SGHelperGlobalVar.getVar('GlobalCurrentUser');
        this.currentUserData = SGHelperGlobalVar.getVar('GlobalCurrentUserData');
        this.imageSetting = SGHelperGlobalVar.getVar('GlobalImageSetting');
        this.currentUserImage = SGHelperGlobalVar.getVar('GlobalCurrentUserImage');
       
        if(!this.state.loading && !this.state.stopPulling){
           
            this.setState({loading:true})
            this.paging = this.getPagingData()
           
            this.baseRunSingleAPIWithRedoOption('SearchBuildingHighlightSeeMoreSaleHashtag', (async (v1,v2,v3,v4,v5,v6) => { return VMallHomeAPI.SearchBuildingHighlightSeeMoreSaleHashtag(v1, v2, v3, v4,v5,v6) }).bind(this, this.props.route.params.buildingKey,this.Language,this.searchKeyword, this._filterData, this.sortArr,this.paging), ((v) => {
                this._onLoadDone(v)
            }).bind(this), null,  SGHelperGlobalVar.getVar("ResponTimes"));
        }
 
    }


    _onLoadDone(resData){
        if(resData.length!==0){
            for(var i=0;i<resData.length;i++){
                this.data.push(resData[i])
            }
            this.pagingCounter = this.pagingCounter + resData.length
        } else this.setState({stopPulling:true})
        this.setState({loading:false})
        console.log('_onLoadDone')
        // this.forceUpdate()
    }

    goToPage(pageId) {
        this.refs.TV1.goToPage(pageId);
    }

    createStyleSheet = (whp) => {
        var { w, h, p } = whp;

        return StyleSheet.create({
            throwWHP: { width: w, height: h, padding: p },
            mainContainer: { width: w, height: h, backgroundColor: '#FFFFFF' },
            picker: { width: w * 0.315 },
            header: { marginVertical: 3 * p, width: w, marginHorizontal: 0, paddingHorizontal: p * 3, flexDirection: 'row', justifyContent: 'space-between' },
            textTitle: { color: '#000000', maxWidth: w * 0.58 },
            containerView1: { width: w, height: w, padding: p, backgroundColor: 'white' },
        });
    }

    constructor(props, context, ...args) {
        super(props, context, ...args);
        this.style = this.createStyleSheet(this.WHP);
        this.data = [];
        this.searchKeyword = '';
        this._filterData = [];
        this.sortArr = sortDAO.getProductStoreRestoNoSearchSortData();
        this.sortOptionList = this.getSortOptionList(this.sortArr);
        this._setSelectedSortOption(this.sortOptionList[0].key);
        this.currentUser = SGHelperGlobalVar.getVar('GlobalCurrentUser');
        this.imageSetting = SGHelperGlobalVar.getVar('GlobalImageSetting');
        this.currentUserImage = SGHelperGlobalVar.getVar('GlobalCurrentUserImage');
        this.currency = SGHelperGlobalVar.getVar('GlobalCurrency');
        this.props.navigation.setOptions({
            headerShown: false,
        });

        // Paging
         this.state = {  refresh: false , loading:false, stopPulling:false };
         this.alreadyMount = false;
         this.refresh=false
         this.pagingCounter = 0

    }

    async _setSelectedSortOption(selectedSortOption) {
        for (var i = 0; i < this.sortArr.length; i++) {
            if (this.sortArr[i].title === selectedSortOption) {
                this.selectedSortOption = selectedSortOption;
                this.sortArr[i].selected = true;
            }
            else {
                this.sortArr[i].selected = false;
            }
        }
    }

    getSortOptionList(data) {
        var res = [];
        for (var i = 0; i < data.length; i++) {
            if(data[i].visible !== false){
            var tempJSON = { key: data[i].title, title: data[i].title }
            res.push(tempJSON);
            }
        }
        return (res);
    }

    _getLikeRestoResource(data) {
        var contentID = data.fContentID;
        var contentEN = data.fContentEN;
        var contentCN = data.fContentCN;
        return (
            { fContentType: 'RestoMenu', fContentKey: data.key, fText1: { id: contentID.fProductName, en: contentEN.fProductName, cn: contentCN.fProductName }, fText2: { id: data.fStoreNameID, en: data.fStoreNameEN, cn: data.fStoreNameCN }, fText3: { id: data.fBuildingNameID, en: data.fBuildingNameEN, cn: data.fBuildingNameCN }, fImageID: contentID.fImageJSON, fImageEN: contentEN.fImageJSON, fImageCN: contentCN.fImageJSON, fTargetKey: data.storeKey }
        )
    }

    _getLikeStoreResource(data) {
        var contentID = data.fContentID;
        var contentEN = data.fContentEN;
        var contentCN = data.fContentCN;
        return (
            { fContentType: 'StoreProduct',fContentKey: data.key, fText1: { id: contentID.fProductName, en: contentEN.fProductName, cn: contentCN.fProductName }, fText2: { id: data.fStoreNameID, en: data.fStoreNameEN, cn: data.fStoreNameCN }, fText3: { id: data.fBuildingNameID, en: data.fBuildingNameEN, cn: data.fBuildingNameCN }, fImageID: contentID.fImageJSON, fImageEN: contentEN.fImageJSON, fImageCN: contentCN.fImageJSON, fTargetKey: data.storeKey }
        )
    }


    _setSearchKeyword(value) {
        this.searchKeyword = value;
        this.forceUpdate();
    }

    async _setSort(dataSort) {
        this.sortArr = dataSort;
        await this._onRefresh(true);
    }

    async _setFilter(dataFilter) {
        this._filterData = dataFilter;
        await this._onRefresh(true);
    }

    render() {
        var { w, h, p } = this.WHP;
        var style = this.style;
        return (
            <RootView dummyStatusBar accessible={true} accessibilityLabel={'RestoMenuListScreenRootView'} style={style.mainContainer}>
                <PromoSalesSearchBar accessible={true} accessibilityLabel={'PromoSalesSEarchBar'} language={this.Language} screen='AddFavorites' searchKeyword={this.searchKeyword}  setSearchKeyword={this._setSearchKeyword.bind(this)} onRefresh={this._onRefresh.bind(this)} sortData={this.sortArr }  onApplySort={ this._setSort.bind(this) } onPressFilter={() => { SGHelperNavigation.navigatePush(this.props.navigation, 'Filter', { filterData: this._filterData, onApplyFilter: (v) => { this._setFilter(v) }, onCloseFilter: (v) => { console.log(v) } }) }} navigator={this.props.navigation} imageSetting={this.imageSetting} style={this.style.containerView1} forceUpdate={this.forceUpdate.bind(this)} ></PromoSalesSearchBar>
                {this.alreadyMount ?

                        <View style={{ flex: 1 }}>
                            <View accessible={true} accessibilityLabel={'RestoMenuListScreenHeaderView'} style={style.header}>
                                <Text accessible={true} accessibilityLabel={'RestoMenuListScreenTitleCategory'} preset={Text.preset.titleH1B} style={style.textTitle}>{this.props.route.params.screenTitle}</Text>
                             
                                    <Picker accessible={true} accessibilityLabel={'RestoMenuListScreenOptionPicker'} shadowIntensity={0.2} textPreset={Text.preset.titleH4_5} single language={(this.Language).toUpperCase()} style={style.picker} shadow optionList={this.sortOptionList} value={this.selectedSortOption} onValueChange={async (v) => { this._setSelectedSortOption(v); this._onRefreshAllItem(true); }} />
                                
                            </View>
                            <FlatList  refreshing={this.state.refresh} onRefresh={this._onRefresh.bind(this)} accessible={true} accessibilityLabel={'RestoMenuListScreenItemList'} numColumns={2} style={{ flexWrap: 'wrap', width: w, backgroundColor: '#E0E0E0', padding: p, paddingTop: p * 5 }} contentContainerStyle={{ justifyContent: 'center', alignItems: 'flex-start', backgroundColor: '#E0E0E0' }} data={this.data} renderItem={({ item ,index}) => {
                                return (
                                    <ProductSliderListMixCard listMode={true} onLike={((item, s,c)=>{console.log(item);  item.fUserLikedThis = s; item.fLikeCountProduct+=c; this.forceUpdate();}).bind(this, item)} accessible={true} accessibilityLabel={'RestoMenuListScreenSliderCard'} likePackage={item.fType =='resto'? this._getLikeRestoResource(item) :this._getLikeStoreResource(item)} navigator={this.props.navigation} language={this.Language} imageSetting={this.imageSetting} key={item.key} data={item} currency={this.currency} style={style.throwWHP}></ProductSliderListMixCard>
                                );
                            }} keyExtractor={item => item.uniqueID} 
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
                            ListEmptyComponent={()=>{
                                return <EmptyDetailView text={SGLocalize.translate('globalText.emptyList')} style={style.throwWHP}></EmptyDetailView>
                            }}
                            scrollEventThrottle={100} onScroll={this.baseOnScrollHandler.bind(this)} onMomentumScrollBegin={this.baseOnMomentumScrollBeginHandler.bind(this)} onScrollEndDrag={this.baseOnScrollEndDragHandler.bind(this)} onMomentumScrollEnd={this.baseOnMomentumScrollEndHandler.bind(this)}>
                            
                            </FlatList>
                        </View>
                       
                    :
                    (<ActivityIndicator preset={ActivityIndicator.preset.h1} style={{ flex: 1 }}></ActivityIndicator>)
                }
                <BottomNavigationContainer accessible={true} accessibilityLabel={'RestoMenuListScreenBottomNav'} blackTheme navigator={this.props.navigation} style={style.throwWHP}></BottomNavigationContainer>
            </RootView>
        );
    }
}
