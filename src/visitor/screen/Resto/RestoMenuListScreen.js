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
import { SGView as View, SGRootView as RootView, SGText as Text, SGPicker as Picker, SGFlatList as FlatList, SGActivityIndicator as ActivityIndicator } from '../../../core/control';
import { SGBaseScreen } from '../../../core/screen/SGBaseScreen';
import { BottomNavigationContainer } from '../../component_V2/BottomNavigationContainer';
import { SimpleSearchBar } from '../../component_V2/SimpleSearchBar';
import { SGLocalize } from '../../locales/SGLocalize';
import { SGHelperNavigation, SGHelperGlobalVar,SGHelperWindow,SGHelperType, SGHelperErrorHandling } from '../../../core/helper';
import { sortDAO } from '../../db/sortDAO';
import { RestoMenuSliderCard } from '../../container_V2/RestoMenuSliderCard';
import { VRestoMenuListAPI } from '../../api/VRestoMenuListAPI';
import { EmptyDetailView } from '../../container_V2/EmptyDetailView';

export class RestoMenuListScreen extends SGBaseScreen {

    getPagingData(){
        var itemPerPage = SGHelperType.getPaging()
        return {paging:true,offset:this.pagingCounter, totalPerPage:itemPerPage}
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
        console.log('resto menu list screen')
        console.log(this.props.route.params.categoryKey)
        this.currentUser = SGHelperGlobalVar.getVar('GlobalCurrentUser');
        this.currentUserData = SGHelperGlobalVar.getVar('GlobalCurrentUserData');
        this.imageSetting = SGHelperGlobalVar.getVar('GlobalImageSetting');
        this.currentUserImage = SGHelperGlobalVar.getVar('GlobalCurrentUserImage');
        if(resetPaging){
            this.setState({ refresh: true })
            this.pagingCounter= 0
            this.paging = this.getPagingData()
            if (this.props.route.params.categoryKey === 'trending') {
                this.baseRunSingleAPIWithRedoOption('getRestoTrendingProductList', (async (v1,v2,v3) => { return VRestoMenuListAPI.getRestoTrendingProductList(v1,v2,v3) }).bind(this,this.props.route.params.restoKey, this.sortArr,this.paging), ((v) => {
                    this.data = v 
                    this._onPullAPIDone()
                }).bind(this), null,  SGHelperGlobalVar.getVar("ResponTimes"));
            }
            else if (this.props.route.params.categoryKey === 'bestseller') {
                this.baseRunSingleAPIWithRedoOption('getRestoBestSellerProductList', (async (v1,v2,v3) => { return VRestoMenuListAPI.getRestoBestSellerProductList(v1,v2,v3) }).bind(this,this.props.route.params.restoKey, this.sortArr,this.paging), ((v) => {
                    this.data = v 
                    this._onPullAPIDone()
                }).bind(this), null,  SGHelperGlobalVar.getVar("ResponTimes"));
           }
            else if (this.props.route.params.categoryKey === 'promo') {
                this.baseRunSingleAPIWithRedoOption('getRestoPromoProductList', (async (v1,v2,v3) => { return VRestoMenuListAPI.getRestoPromoProductList(v1,v2,v3) }).bind(this,this.props.route.params.restoKey, this.sortArr,this.paging), ((v) => {
                    this.data = v 
                    this._onPullAPIDone()
                }).bind(this), null,  SGHelperGlobalVar.getVar("ResponTimes"));
           }
            else {
                console.log('else')
                this.baseRunSingleAPIWithRedoOption('getRestoProductList', (async (v1,v2,v3,v4) => { return VRestoMenuListAPI.getRestoProductList(v1,v2,v3,v4) }).bind(this,this.props.route.params.restoKey, this.props.route.params.categoryKey, this.sortArr,this.paging), ((v) => {
                    this.data = v 
                    this._onPullAPIDone()
                }).bind(this), null,  SGHelperGlobalVar.getVar("ResponTimes"));
           }  
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


            if (this.props.route.params.categoryKey === 'trending') {
                this.baseRunSingleAPIWithRedoOption('getStoreTrendingProductList', (async (v1,v2,v3) => { return VRestoMenuListAPI.getRestoTrendingProductList(v1,v2,v3) }).bind(this,this.props.route.params.restoKey, this.sortArr,this.paging), ((v) => {
                    this.data = v
                    this.pagingCounter = this.data.length
                    if(v.length<SGHelperType.getPaging())this.setState({stopPulling:true})
                    else this.setState({stopPulling:false})
                    this.refresh=false
                    this.setState({ refresh: false});
                    this.forceUpdate()
                }).bind(this), null,  SGHelperGlobalVar.getVar("ResponTimes"));
            }
            else if (this.props.route.params.categoryKey === 'bestseller') {
                this.baseRunSingleAPIWithRedoOption('getRestoBestSellerProductList', (async (v1,v2,v3) => { return VRestoMenuListAPI.getRestoBestSellerProductList(v1,v2,v3) }).bind(this,this.props.route.params.restoKey, this.sortArr,this.paging), ((v) => {
                    this.data = v
                    this.pagingCounter = this.data.length
                    if(v.length<SGHelperType.getPaging())this.setState({stopPulling:true})
                    else this.setState({stopPulling:false})
                    this.refresh=false
                    this.setState({ refresh: false});
                    this.forceUpdate()
                }).bind(this), null,  SGHelperGlobalVar.getVar("ResponTimes"));
            }
            else if (this.props.route.params.categoryKey === 'promo') {
                this.baseRunSingleAPIWithRedoOption('getRestoPromoProductList', (async (v1,v2,v3) => { return VRestoMenuListAPI.getRestoPromoProductList(v1,v2,v3) }).bind(this,this.props.route.params.restoKey, this.sortArr,this.paging), ((v) => {
                    this.data = v
                    this.pagingCounter = this.data.length
                    if(v.length<SGHelperType.getPaging())this.setState({stopPulling:true})
                    else this.setState({stopPulling:false})
                    this.refresh=false
                    this.setState({ refresh: false});
                    this.forceUpdate()
                }).bind(this), null,  SGHelperGlobalVar.getVar("ResponTimes"));
              
            }
            else {
                this.baseRunSingleAPIWithRedoOption('getRestoProductList', (async (v1,v2,v3,v4) => { return VRestoMenuListAPI.getRestoProductList(v1,v2,v3,v4) }).bind(this,this.props.route.params.restoKey, this.props.route.params.categoryKey, this.sortArr,this.paging), ((v) => {
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
            // console.log("YOHANES")
            // console.log(this.state.stopPulling)
            this.setState({loading:true})
            this.paging = this.getPagingData()

            if (this.props.route.params.categoryKey === 'trending') {
                    this.baseRunSingleAPIWithRedoOption('getRestoTrendingProductList', (async (v1,v2,v3) => { return VRestoMenuListAPI.getRestoTrendingProductList(v1,v2,v3) }).bind(this,this.props.route.params.restoKey, this.sortArr,this.paging), ((v) => {
                        this._onLoadDone(v)
                    }).bind(this), null,  SGHelperGlobalVar.getVar("ResponTimes"));
                }
                else if (this.props.route.params.categoryKey === 'bestseller') {
                    this.baseRunSingleAPIWithRedoOption('getRestoBestSellerProductList', (async (v1,v2,v3) => { return VRestoMenuListAPI.getRestoBestSellerProductList(v1,v2,v3) }).bind(this,this.props.route.params.restoKey, this.sortArr,this.paging), ((v) => {
                        this._onLoadDone(v)
                    }).bind(this), null,  SGHelperGlobalVar.getVar("ResponTimes"));
                }
                else if (this.props.route.params.categoryKey === 'promo') {
                    this.baseRunSingleAPIWithRedoOption('getRestoPromoProductList', (async (v1,v2,v3) => { return VRestoMenuListAPI.getRestoPromoProductList(v1,v2,v3) }).bind(this,this.props.route.params.restoKey, this.sortArr,this.paging), ((v) => {
                        this._onLoadDone(v)
                    }).bind(this), null,  SGHelperGlobalVar.getVar("ResponTimes"));
                  
                }
                else {
                    console.log('onLoad')
                    this.baseRunSingleAPIWithRedoOption('getRestoProductList', (async (v1,v2,v3,v4) => { return VRestoMenuListAPI.getRestoProductList(v1,v2,v3,v4) }).bind(this,this.props.route.params.restoKey, this.props.route.params.categoryKey, this.sortArr,this.paging), ((v) => {
                        this._onLoadDone(v)
                    }).bind(this), null,  SGHelperGlobalVar.getVar("ResponTimes"));
                  
                }            
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
            textTitle: { color: '#000000', maxWidth: w * 0.58 }
        });
    }

    constructor(props, context, ...args) {
        super(props, context, ...args);
        this.style = this.createStyleSheet(this.WHP);
        this.data = [];
        this.searchKeyword = '';
        this.restoKey = this.props.route.params.restoKey;
        this.sortArr = sortDAO.getRestoMenuNoSearchSortData();
        this.sortOptionList = this.getSortOptionList(this.sortArr);
        if (this.props.route.params.categoryKey === 'trending') {
            this._setSelectedSortOption(this.sortOptionList[1].key);
        }
        this._setSelectedSortOption(this.sortOptionList[0].key);
        this.currentUser = SGHelperGlobalVar.getVar('GlobalCurrentUser');
        this.imageSetting = SGHelperGlobalVar.getVar('GlobalImageSetting');
        this.currentUserImage = SGHelperGlobalVar.getVar('GlobalCurrentUserImage');
        this.currency = SGHelperGlobalVar.getVar('GlobalCurrency');
        this.props.navigation.setOptions({
            headerShown: false,
        });

        // Paging
         this.state = {  refresh: false , refreshFlatList:false, loading:false, stopPulling:false };
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

    _getLikeResource(data) {
        var contentID = data.fContentID;
        var contentEN = data.fContentEN;
        var contentCN = data.fContentCN;
        return (
            { fContentType: 'RestoMenu', fContentKey: data.key, fText1: { id: contentID.fProductName, en: contentEN.fProductName, cn: contentCN.fProductName }, fText2: { id: data.fRestoNameID, en: data.fRestoNameEN, cn: data.fRestoNameCN }, fText3: { id: data.fBuildingNameID, en: data.fBuildingNameEN, cn: data.fBuildingNameCN }, fImageID: contentID.fImageJSON, fImageEN: contentEN.fImageJSON, fImageCN: contentCN.fImageJSON, fTargetKey: data.restoKey }
        )
    }

    render() {
        var { w, h, p } = this.WHP;
        var style = this.style;
        var date = new Date();
      
        return (
            <RootView dummyStatusBar accessible={true} accessibilityLabel={'RestoMenuListScreenRootView'} style={style.mainContainer}>
                <SimpleSearchBar accessible={true} categoryKey={this.props.route.params.categoryKey} accessibilityLabel={'RestoMenuListScreenSimpleSearchBar'} navigator={this.props.navigation} imageSetting={this.imageSetting}  screen='SearchResultInThisRestoRestoMenu' searchKeyword={this.searchKeyword} language={this.Language} restoKey={this.restoKey} placeholder={SGLocalize.translate("storeHomeScreen.searchPlaceholder")} style={this.style.throwWHP}></SimpleSearchBar>
                {this.alreadyMount ?
                    this.data.length > 0 ?
                        (<View style={{ flex: 1 }}>
                            <View accessible={true} accessibilityLabel={'RestoMenuListScreenHeaderView'} style={style.header}>
                                <Text accessible={true} accessibilityLabel={'RestoMenuListScreenTitleCategory'} preset={Text.preset.titleH1B} style={style.textTitle}>{this.props.route.params.screenTitle}</Text>
                                {this.props.route.params.categoryKey === 'trending' ?
                                    (null)
                                    :
                                    (<Picker accessible={true} accessibilityLabel={'RestoMenuListScreenOptionPicker'} shadowIntensity={0.2} textPreset={Text.preset.titleH4} single language={(this.Language).toUpperCase()} style={style.picker} shadow optionList={this.sortOptionList} value={this.selectedSortOption} onValueChange={async (v) => { this._setSelectedSortOption(v); this._onRefreshAllItem(true); }} />)
                                }
                            </View>
                            <FlatList  refreshing={this.state.refreshFlatList} onRefresh={this._onRefresh.bind(this)} accessible={true} accessibilityLabel={'RestoMenuListScreenItemList'} numColumns={2} style={{ flexWrap: 'wrap', width: w, backgroundColor: '#E0E0E0', padding: p, paddingTop: p * 5 }} contentContainerStyle={{ justifyContent: 'center', alignItems: 'flex-start', backgroundColor: '#E0E0E0' }} data={this.data} renderItem={({ item }) => {
                                return (
                                    <RestoMenuSliderCard listMode={true} onLike={((item, s,c)=>{console.log(item);  item.fUserLikedThis = s; item.fLikeCountProduct+=c; this.forceUpdate();}).bind(this, item)} accessible={true} accessibilityLabel={'RestoMenuListScreenSliderCard'} likePackage={this._getLikeResource(item)} navigator={this.props.navigation} language={this.Language} imageSetting={this.imageSetting} key={item.key} data={item} currency={this.currency} style={style.throwWHP}></RestoMenuSliderCard>
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
                            scrollEventThrottle={100} onScroll={this.baseOnScrollHandler.bind(this)} onMomentumScrollBegin={this.baseOnMomentumScrollBeginHandler.bind(this)} onScrollEndDrag={this.baseOnScrollEndDragHandler.bind(this)} onMomentumScrollEnd={this.baseOnMomentumScrollEndHandler.bind(this)}>
                            </FlatList>
                        </View>)
                        :
                        (<EmptyDetailView text={SGLocalize.translate('globalText.emptyList')} style={style.throwWHP}></EmptyDetailView>)
                    :
                    (<ActivityIndicator preset={ActivityIndicator.preset.h1} style={{ flex: 1 }}></ActivityIndicator>)
                }
                <BottomNavigationContainer accessible={true} accessibilityLabel={'RestoMenuListScreenBottomNav'} blackTheme navigator={this.props.navigation} style={style.throwWHP}></BottomNavigationContainer>
            </RootView>
        );
    }
}
