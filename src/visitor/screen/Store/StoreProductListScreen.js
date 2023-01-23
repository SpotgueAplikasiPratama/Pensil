/*
Version 1.2
Adding Paging By Melvin , 29 Maret 2021
 * 2. Leon 12 Apr 2021
 * - add ErrorHandling
*/

import React from 'react';
import { StyleSheet, Animated } from 'react-native';
import { SGView as View, SGRootView as RootView, SGTabView as TabView, SGText as Text, SGImage as Image, SGScrollView as ScrollView, SGIcon as Icon, SGPicker as Picker, SGFlatList as FlatList, SGActivityIndicator as ActivityIndicator } from '../../../core/control';
import { SGBaseScreen } from '../../../core/screen/SGBaseScreen';
import { StorePromoSlider } from '../../container_V2/StorePromoSlider';
import { BottomNavigationContainer } from '../../component_V2/BottomNavigationContainer';
import { SimpleSearchBar } from '../../component_V2/SimpleSearchBar';
import { SGLocalize } from '../../locales/SGLocalize';
import { StoreHomeHeader } from '../../container_V2/StoreHomeHeader';
import { SGHelperNavigation, SGHelperGlobalVar, SGHelperWindow,SGHelperType, SGHelperErrorHandling } from '../../../core/helper';
import { StoreProductCategorySlider } from '../../container_V2/StoreProductCategorySlider';
import Carousel from 'react-native-snap-carousel';
import { CarouselProductCard } from '../../container_V2/CarouselProductCard';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { sortDAO } from '../../db/sortDAO';
import { VStoreProductListAPI } from '../../api/VStoreProductListAPI';
import { EmptyDetailView } from '../../container_V2/EmptyDetailView';

export class StoreProductListScreen extends SGBaseScreen {

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
        this.currentUser = SGHelperGlobalVar.getVar('GlobalCurrentUser');
        this.currentUserData = SGHelperGlobalVar.getVar('GlobalCurrentUserData');
        this.imageSetting = SGHelperGlobalVar.getVar('GlobalImageSetting');
        this.currentUserImage = SGHelperGlobalVar.getVar('GlobalCurrentUserImage');

        if(resetPaging){
            this.setState({ refresh: true })
            this.pagingCounter= 0
            this.paging = this.getPagingData()

            if (this.props.route.params.categoryKey === 'trending') {
                this.baseRunSingleAPIWithRedoOption('getStoreTrendingProductList', (async (v1,v2,v3) => { return VStoreProductListAPI.getStoreTrendingProductList(v1,v2,v3) }).bind(this,this.props.route.params.storeKey, this.sortArr,this.paging), (async (v) => {
                    this.data =v // await VStoreProductListAPI.getStoreTrendingProductList(this.props.route.params.storeKey, this.sortArr,this.paging);
                    this.pagingCounter = this.data.length
                    if(v.length<SGHelperType.getPaging())this.setState({stopPulling:true})
                    else this.setState({stopPulling:false})
                    this.alreadyMount = true;
                    this.setState({ refresh: false });
                    this.forceUpdate();
                }).bind(this), null,  SGHelperGlobalVar.getVar("ResponTimes"));
            }
            else {
                console.log('getStoreProductList')
                this.baseRunSingleAPIWithRedoOption('getStoreProductList', (async (v1,v2,v3,v4) => { return VStoreProductListAPI.getStoreProductList(v1,v2,v3,v4) }).bind(this,this.props.route.params.storeKey, this.props.route.params.categoryKey, this.sortArr,this.paging), (async (v) => {
                    this.data =v // await VStoreProductListAPI.getStoreTrendingProductList(this.props.route.params.storeKey, this.sortArr,this.paging);
                    this.pagingCounter = this.data.length
                    if(v.length<SGHelperType.getPaging())this.setState({stopPulling:true})
                    else this.setState({stopPulling:false})
                    this.alreadyMount = true;
                    this.setState({ refresh: false});
                    this.forceUpdate();
                }).bind(this), null,  SGHelperGlobalVar.getVar("ResponTimes"));
                // this.data = await VStoreProductListAPI.getStoreProductList(this.props.route.params.storeKey, this.props.route.params.categoryKey, this.sortArr,this.paging);
            }
            
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


            if (this.props.route.params.categoryKey === 'trending') {
                this.baseRunSingleAPIWithRedoOption('getStoreTrendingProductList', (async (v1,v2,v3) => { return VStoreProductListAPI.getStoreTrendingProductList(v1,v2,v3) }).bind(this,this.props.route.params.storeKey, this.sortArr,this.paging), (async (v) => {
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
                this.baseRunSingleAPIWithRedoOption('getStoreProductList', (async (v1,v2,v3,v4) => { return VStoreProductListAPI.getStoreProductList(v1,v2,v3,v4) }).bind(this,this.props.route.params.storeKey, this.props.route.params.categoryKey, this.sortArr,this.paging), (async (v) => {
                    this.data =v 
                    this.pagingCounter = this.data.length
                    if(v.length<SGHelperType.getPaging())this.setState({stopPulling:true})
                    else this.setState({stopPulling:false})
                    this.refresh=false
                    this.setState({ refresh: false});
                    this.forceUpdate()
                }).bind(this), null,  SGHelperGlobalVar.getVar("ResponTimes"));
                // this.data = await VStoreProductListAPI.getStoreProductList(this.props.route.params.storeKey, this.props.route.params.categoryKey, this.sortArr,this.paging);
            }
        }
    }

    async _onLoad(){

        this.currentUser = SGHelperGlobalVar.getVar('GlobalCurrentUser');
        this.currentUserData = SGHelperGlobalVar.getVar('GlobalCurrentUserData');
        this.imageSetting = SGHelperGlobalVar.getVar('GlobalImageSetting');
        this.currentUserImage = SGHelperGlobalVar.getVar('GlobalCurrentUserImage');

        if(!this.state.loading && !this.state.stopPulling){
            
            this.setState({loading:true})
            this.paging = this.getPagingData()

            if (this.props.route.params.categoryKey === 'trending') {
                this.baseRunSingleAPIWithRedoOption('getStoreTrendingProductList', (async (v1,v2,v3) => { return VStoreProductListAPI.getStoreTrendingProductList(v1,v2,v3) }).bind(this,this.props.route.params.storeKey, this.sortArr,this.paging), (async (v) => {
                    var resData =v 
                    if(resData.length!==0){
                        for(var i=0;i<resData.length;i++){
                            this.data.push(resData[i])
                        }
                        this.pagingCounter = this.pagingCounter + resData.length
                    } else this.setState({stopPulling:true})
                    this.setState({loading:false})
                }).bind(this), null,  SGHelperGlobalVar.getVar("ResponTimes"));
               
            }
            else {
                console.log(' Load getStoreProductList')
                this.baseRunSingleAPIWithRedoOption('getStoreProductList', (async (v1,v2,v3,v4) => { return VStoreProductListAPI.getStoreProductList(v1,v2,v3,v4) }).bind(this,this.props.route.params.storeKey, this.props.route.params.categoryKey, this.sortArr,this.paging), (async (v) => {
                    var resData =v 
                    if(resData.length!==0){
                        for(var i=0;i<resData.length;i++){
                            this.data.push(resData[i])
                        }
                        this.pagingCounter = this.pagingCounter + resData.length
                    } else this.setState({stopPulling:true})
                    this.setState({loading:false})
                }).bind(this), null,  SGHelperGlobalVar.getVar("ResponTimes"));
                // var resData = await VStoreProductListAPI.getStoreProductList(this.props.route.params.storeKey, this.props.route.params.categoryKey, this.sortArr,this.paging);
            }

            
        }


    }

    goToPage(pageId) {
        this.refs.TV1.goToPage(pageId);
    }

    createStyleSheet = (whp) => {
        var { w, h, p } = whp;

        return StyleSheet.create({
            mainContainer: { width: w, height: h, backgroundColor: '#FFFFFF', justifyContent: 'flex-start' },
            throwWHP: { width: w, height: h, padding: p },
            card: { width: (w - p * 12), height: h * 0.62, padding: p * 0.62 },
            tabBarTextStyle: { color: '#606060' },
            tabBarStyle: { borderColor: '#8cccd0', borderBottomWidth: 0.0015 * w },
            textSeeMore: { alignSelf: 'flex-end', color: '#44a1c2', marginRight: 2 * p, marginVertical: 4 * p },
            picker: { width: w * 0.315 },
            header: { marginVertical: 3 * p, width: w, marginHorizontal: 0, paddingHorizontal: p * 3, flexDirection: 'row', justifyContent: 'space-between' },
            textTitle: { color: '#000000' }
        });
    }

    constructor(props, context, ...args) {
        super(props, context, ...args);
        this.style = this.createStyleSheet(this.WHP);
        this.data = [];
        this.sortArr = sortDAO.getStoreProductNoSearchSortData();
        this.storeKey = this.props.route.params.storeKey;
        this.currentUserCurrency = SGHelperGlobalVar.getVar('GlobalCurrency');
        this.searchKeyword = '';
        this.sortOptionList = this.getSortOptionList(this.sortArr);
        if (this.props.route.params.categoryKey === 'trending') {
            this._setSelectedSortOption(this.sortOptionList[1].key);
        }
        this._setSelectedSortOption(this.sortOptionList[0].key);
        this.currentUser = SGHelperGlobalVar.getVar('GlobalCurrentUser');
        this.currentUserData = SGHelperGlobalVar.getVar('GlobalCurrentUserData');
        this.imageSetting = SGHelperGlobalVar.getVar('GlobalImageSetting');
        this.currentUserImage = SGHelperGlobalVar.getVar('GlobalCurrentUserImage');
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

    _getLikeResource(data) {
        var contentID = data.fContentID;
        var contentEN = data.fContentEN;
        var contentCN = data.fContentCN;
        return (
            { fContentType: 'StoreProduct', fContentKey: data.key, fText1: { id: contentID.fProductName, en: contentEN.fProductName, cn: contentCN.fProductName }, fText2: { id: data.fStoreNameID, en: data.fStoreNameEN, cn: data.fStoreNameCN }, fText3: { id: data.fBuildingNameID, en: data.fBuildingNameEN, cn: data.fBuildingNameCN }, fImageID: contentID.fImageJSON, fImageEN: contentEN.fImageJSON, fImageCN: contentCN.fImageJSON, fTargetKey: data.storeKey }
        )
    }

    getSortOptionList(data) {
        console.log(data);
        var res = [];
        for (var i = 0; i < data.length; i++) {
            if(data[i].visible !== false){
            var tempJSON = { key: data[i].title, title: data[i].title }
            res.push(tempJSON);
            }
        }
        console.log(res);
        return (res);
    }

    render() {
        var { w, h, p } = this.WHP;
        var style = this.style;
        return (
            // <TouchableWithoutFeedback>
            <RootView dummyStatusBar accessible={true} accessibilityLabel={'StoreProductListScreenRootView'} style={style.mainContainer}>
                <SimpleSearchBar accessible={true} accessibilityLabel={'StoreProductListScreenSimpleSearchBar'} imageSetting={this.imageSetting} screen='SearchResultInThisStoreStoreProduct' categoryKey={this.props.route.params.categoryKey} searchKeyword={this.searchKeyword} language={this.Language} storeKey={this.storeKey}  placeholder={SGLocalize.translate("storeHomeScreen.searchPlaceholder")} navigator={this.props.navigation} imageSetting={this.imageSetting} style={this.style.throwWHP}></SimpleSearchBar>
                {this.alreadyMount ?
                    this.data.length !== 0 ?
                        <View style={{ flex: 1 }}>
                            <View accessible={true} accessibilityLabel={'StoreProductListScreenHeaderView'} style={style.header}>
                                <Text accessible={true} accessibilityLabel={'StoreProductListScreenTitleCategory'} preset={Text.preset.titleH1B} style={style.textTitle}>{this.props.route.params.title}</Text>
                                    <Picker accessible={true} accessibilityLabel={'StoreProductListScreenOptionPicker'} shadowIntensity={0.2} textPreset={Text.preset.titleH4} single language={(this.Language).toUpperCase()} style={style.picker} shadow optionList={this.sortOptionList} value={this.selectedSortOption} onValueChange={async (v) => { this._setSelectedSortOption(v);this._onRefreshAllItem(true); }} />
                            </View>
                            <FlatList  refreshing={this.state.refreshFlatList} onRefresh={this._onRefresh.bind(this)} accessible={true} accessibilityLabel={'StoreProductListScreenItemList'} numColumns={2} style={{ backgroundColor: '#e2e2e2', flexWrap: 'wrap', width: w, paddingHorizontal: p * 2, paddingVertical: p * 2 }} contentContainerStyle={{ justifyContent: 'center', alignItems: 'center' }} data={this.data} renderItem={({ item }) => {
                                return (
                                    <CarouselProductCard onLike={((item, s,c)=>{item.fUserLikedThis = s; item.fLikeCountProduct+=c; this.forceUpdate();}).bind(this,item)} accessible={true} accessibilityLabel={'StoreProductListScreenCarouselCard'} currency={this.currentUserCurrency} listMode likePackage={this._getLikeResource(item)} navigator={this.props.navigation} contentKey={item.key} isAvailable={item.isAvailable} storeKey={this.props.route.params.storeKey} like={item.fUserLikedThis} normalPrice={item.fCNormalPrice} promoPrice={item.fCPromoPrice} productName={item['fContent' + this.Language.toUpperCase()].fProductName} contentImage={item['fContent' + this.Language.toUpperCase()].fImageJSON[0][this.imageSetting].uri} contentOwnerCurrency={item.fCurrency} style={this.style.card}></CarouselProductCard>
                                );
                            }} keyExtractor={item => item.key}
                            onEndReached={this._onLoad.bind(this)}
                            onEndReachedThreshold={SGHelperType.getThreshold()}
                            ListFooterComponent={()=>{
                                if( this.state.loading)return <ActivityIndicator preset={ActivityIndicator.preset.h1} style={{width:w,height:h*0.05}}></ActivityIndicator>
                                else return null
                            }}
                           >
                            </FlatList>
                        </View>
                        :
                        <EmptyDetailView text={SGLocalize.translate('globalText.emptyDetail')} style={style.throwWHP}></EmptyDetailView>
                    :
                    <ActivityIndicator preset={ActivityIndicator.preset.h1} style={{ flex: 1 }}></ActivityIndicator>
                }
                <View style={{ width: '100%', height: SGHelperWindow.getFooterHeight()-p}}></View>
                <View style={{ width: '100%', height: SGHelperWindow.getHeaderHeight()-p}}></View>
                {/* <Animated.View style={{ position: 'absolute', transform: [{ translateY: this._baseAnimY.interpolate({ inputRange: [-1, 0], outputRange: [SGHelperWindow.getWHPNoHeader().h + 8 * p, SGHelperWindow.getWHPNoHeader().h - Math.max(SGHelperWindow.getFooterHeight(), 2 * p) - SGHelperWindow.getHeaderHeight()] }) },], height: Math.max(SGHelperWindow.getFooterHeight(), 2 * p) + SGHelperWindow.getHeaderHeight(), backgroundColor: '#181818', width: '100%' }}> */}
                    <BottomNavigationContainer accessible={true} accessibilityLabel={'HomeScreenBottomNav'} currentUser={this.currentUser} navigator={this.props.navigation} style={style.throwWHP}></BottomNavigationContainer>
                {/* </Animated.View> */}
            </RootView>
        );
    }
}
