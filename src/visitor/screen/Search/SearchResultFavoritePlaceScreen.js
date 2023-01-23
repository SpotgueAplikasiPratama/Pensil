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
import { SGRootView as RootView, SGView as View, SGText as Text, SGFlatList as FlatList, SGPopView, SGImage as Image, SGButton as Button, SGActivityIndicator as ActivityIndicator } from '../../../core/control';
import { SGBaseScreen } from '../../../core/screen/SGBaseScreen';
import { FullSearchBar } from '../../component_V2/FullSearchBar';
import { DefaultPlaceCard } from '../../container_V2/DefaultPlaceCard';
import { SGHelperNavigation, SGHelperGlobalVar, SGHelperWindow,SGHelperType,SGHelperErrorHandling } from '../../../core/helper';
import { SGLocalize } from '../../locales/SGLocalize';
import { RibbonHeader } from '../../component_V2/RibbonHeader';
import { BottomNavigationContainer } from '../../component_V2/BottomNavigationContainer';
import { filterDAO } from '../../db/filterDAO';
import { sortDAO } from '../../db/sortDAO';
import { VSearchResultFavoritePlaceAPI } from '../../api/VSearchResultFavoritePlaceAPI';
import { VFilterOptionsAPI } from '../../api/VFilterOptionsAPI';
import idJSON from '../../locales/id.json';
import enJSON from '../../locales/en.json';
import cnJSON from '../../locales/cn.json';
import { tbLookupDAO } from '../../db/tbLookupDAO';
import { VRewardAPI } from '../../api/VRewardAPI'
import { EmptyDetailView } from '../../container_V2/EmptyDetailView';
import { VisitorHelper } from '../../helper/VisitorHelper';

export class SearchResultFavoritePlaceScreen extends SGBaseScreen {

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
            text1: { color: '#7a7a7a' },
            //style popup reward
            rewardPV: { width: w - 12 * p, padding: p, borderRadius: 2 * p, backgroundColor: 'white', justifyContent: 'flex-start' },
            headerPV: { width: w - 22 * p, paddingVertical: 2 * p },
            textPV1: { color: '#484848' },
            textPV2: { color: '#858585' },
            textPV3: { color: '#484848', marginVertical: p,alignItems:'flex-start' },
            textPV4: { color: '#484848', alignSelf: 'flex-start', marginVertical: p,paddingLeft:4*p},
            imagePV: { width: w * 0.667, height: w * 0.375, padding: p, marginVertical: 2 * p },
            buttonPV: { backgroundColor: '#01BBA0', width: w * 0.38, height: w * 0.1, borderRadius: p,alignItems:'center',justifyContent:'center'},
            buttonViewPV: { flexDirection: 'row', justifyContent: 'space-around', width: w - 22 * p, marginVertical: 2 * p },
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
    
            this.baseAddAPIParallel('getAllSearchResultFavoritePlace', (async (v1,v2,v3,v4,v5) => { return VSearchResultFavoritePlaceAPI.getAllSearchResultFavoritePlace(v1,v2,v3,v4,v5); }).bind(this,this.Language, this.searchKeyword, this._filterData, this._sortData,this.paging), ((v) => {
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


            this.baseRunSingleAPIWithRedoOption('getAllSearchResultFavoritePlace', (async (v1, v2, v3, v4, v5) => { return VSearchResultFavoritePlaceAPI.getAllSearchResultFavoritePlace(v1, v2, v3, v4, v5) }).bind(this, this.Language, this.searchKeyword, this._filterData, this._sortData,this.paging), ((v) => {
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

                this.baseRunSingleAPIWithRedoOption('getAllSearchResultFavoritePlace', (async (v1, v2, v3,v4,v5) => {  return VSearchResultFavoritePlaceAPI.getAllSearchResultFavoritePlace(v1, v2, v3,v4,v5) }).bind(this, this.Language, this.searchKeyword, this._filterData, this._sortData,this.paging), ((v) => {           
                var resData = v// await VSearchResultFavoritePlaceAPI.getAllSearchResultFavoritePlace(this.Language, this.searchKeyword, this._filterData, this._sortData,this.paging);
                if(resData.length!==0){
                    for(var i=0;i<resData.length;i++){
                        this.data.push(resData[i])
                    }
                    this.pagingCounter = this.pagingCounter + resData.length
                } else this.setState({stopPulling:true})
                this.setState({loading:false})
            }).bind(this), (()=>{ this.setState({loading:false}) }), SGHelperGlobalVar.getVar("ResponTimes"));
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
        this._filterData = filterDAO.getPlaceFilterData();
        this._sortData = sortDAO.getPlaceFavoriteSearchSortData(this.Language.toUpperCase());
        this._buildingMatrix = [];
        this.props.navigation.setOptions({
            headerShown: false,
        });
        this.pvID = SGPopView.getPopViewID();
        this.surpriseReward = { fID: null, fRewardID: { fTargetName: '', fShortDescription: '', fImageJSON: [] }, fRewardEN: { fTargetName: '', fShortDescription: '', fImageJSON: [] }, fRewardCN: { fTargetName: '', fShortDescription: '', fImageJSON: [] } }
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

    _getLikeResourcePlace(data) {
        var contentID = data.fContentID;
        var contentEN = data.fContentEN;
        var contentCN = data.fContentCN;
        return (
            { fContentType: 'Place', fContentKey: data.key, fText1: { id: contentID.fBuildingName, en: contentEN.fBuildingName, cn: contentCN.fBuildingName }, fText2: { id: idJSON.city[tbLookupDAO.getLookUpValue(data.fCity)], en: enJSON.city[tbLookupDAO.getLookUpValue(data.fCity)], cn: cnJSON.city[tbLookupDAO.getLookUpValue(data.fCity)] }, fText3: { id: '', en: '', cn: '' }, fImageID: contentID.fImageJSON, fImageEN: contentEN.fImageJSON, fImageCN: contentCN.fImageJSON, fTargetKey: data.key }
        )
    }
    onHideReward() {
        SGPopView.hidePopView(this.pvID);
    }
    onShowReward() {
        this.forceUpdate()
        SGPopView.showPopView(this.pvID);

    }
    async _SurpriseRewardLikeMall(buildingKey) {
        try {
            if (!SGHelperGlobalVar.getVar('GlobalAnonymous')) {
                this.surpriseReward = await VRewardAPI.SurpriseRewardLikeMall(buildingKey)
                if (this.surpriseReward.fID !== null) {
                    this.onShowReward()
                } else this.surpriseReward = { fID: null, fRewardID: { fTargetName: '', fShortDescription: '', fImageJSON: [] }, fRewardEN: { fTargetName: '', fShortDescription: '', fImageJSON: [] }, fRewardCN: { fTargetName: '', fShortDescription: '', fImageJSON: [] } }
    
            }
        } catch (error) {
            SGHelperErrorHandling.Handling(error,this._SurpriseRewardLikeMall.bind(this,buildingKey))
        }

    }
    render() {
        var { w, h, p } = this.WHP;
        var style = this.style;
        var language = this.Language.toUpperCase()
        var surpriseReward = this.surpriseReward;
        var tR = SGLocalize.translate;
        console.log('SearchResultFavoritePlaceScreen')
        return (
            <RootView dummyStatusBar dummyHeaderBar accessible={false} accessibilityLabel={'SearchResultFavoritePlaceScreenRootView'} style={style.mainContainer}>
                <SGPopView accessible={true} accessibilityLabel={'MallHomeScreenPopView'} vPos={'Top'} animationType={'slideUp'} modal popViewID={this.pvID} >
                    <View accessible={true} accessibilityLabel={'MallHomeScreenRewardView'} style={style.rewardPV}>
                        <View accessible={true} accessibilityLabel={'MallHomeScreenHeaderRewardView'} style={style.headerPV}>
                            <Text accessible={true} accessibilityLabel={'MallHomeScreenCongratsText'} style={style.textPV1} preset={Text.preset.titleH2B}>{tR('mallHomeScreen.RewardCongratulation')}</Text>
                            <Text accessible={true} accessibilityLabel={'MallHomeScreenRewardText'} style={style.textPV2} preset={Text.preset.titleH4_5B}>{tR('mallHomeScreen.RewardText')} {surpriseReward['fReward' + language].fTargetName}</Text>
                            <Image accessible={true} accessibilityLabel={'MallHomeScreenRewardImage'} style={style.imagePV} source={{ uri: surpriseReward['fReward' + language].fImageJSON.length !== 0 ? surpriseReward['fReward' + language].fImageJSON[0][this.imageSetting].uri : '' }}></Image>
                            <Text accessible={true} accessibilityLabel={'MallHomeScreenRewardName'} style={style.textPV3} preset={Text.preset.titleH3B}>{surpriseReward['fReward' + language].fRewardName}</Text>
                            <Text accessible={true} accessibilityLabel={'MallHomeScreenShortDesc'} style={style.textPV4} preset={Text.preset.titleH4}>{surpriseReward['fReward' + language].fShortDescription}</Text>
                            <View accessible={true} accessibilityLabel={'MallHomeScreenButtonView'} style={style.buttonViewPV}>
                                <Button accessible={true} accessibilityLabel={'MallHomeScreenOkButton'} style={style.buttonPV} textPreset={Text.preset.titleH4_5B} label={tR('mallHomeScreen.Okay')} onPress={() => this.onHideReward(this.pvID)}></Button>
                                <Button accessible={true} accessibilityLabel={'MallHomeScreenMyRewardsButton'} style={style.buttonPV} textPreset={Text.preset.titleH4_5B} label={tR('mallHomeScreen.MyRewards')} onPress={() => { this.onHideReward(this.pvID); SGHelperNavigation.navigatePush(this.props.navigation, 'MyRewards') }}></Button>
                            </View>
                        </View>
                    </View>
                </SGPopView>
                <RibbonHeader search searchTitle={SGLocalize.translate("SearchResultFavoritePlaceScreen.searchTitle")} imageSetting={this.imageSetting} title={SGLocalize.translate("SearchResultFavoritePlaceScreen.screenTitle")}></RibbonHeader>
                {this.alreadyMount ?
                    this.data.length !== 0 ?
                        <FlatList refreshing={this.state.refreshFlatList} onRefresh={this._onRefresh.bind(this)} accessible={true} accessibilityLabel={'SearchResultFavoritePlaceScreenList'} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingVertical: p, justifyContent: 'flex-start', alignItems: 'center' }} data={this.data} renderItem={({ item }) => {
                            return (
                                <DefaultPlaceCard onNotification={((item, s)=>{ console.log(item);  item.fUserNotificationThis = s; this.forceUpdate();}).bind(this,item)} onFavorite={((item, s)=>{console.log(item);  item.fUserFavoriteThis = s; this.forceUpdate();}).bind(this,item)} onLike={((item, s,c)=>{item.fUserLikedThis = s; item.fLikeCount+=c; this.forceUpdate();}).bind(this,item)} accessible={true} accessibilityLabel={'SearchResultFavoritePlaceScreenDefPlaceCard'} likePackage={this._getLikeResourcePlace(item)} navigator={this.props.navigation} imageSetting={this.imageSetting} likeText={SGLocalize.translate("SeeAllFavoritesPlaceScreen.likeText")} lastVisitedText={SGLocalize.translate("SeeAllFavoritesPlaceScreen.lastVisitedText")} likeIconLabel={SGLocalize.translate("SeeAllFavoritesPlaceScreen.likeIconLabel")}
                                    notificationIconLabel={SGLocalize.translate("SeeAllFavoritesPlaceScreen.notificationIconLabel")} favoriteIconLabel={SGLocalize.translate("SeeAllFavoritesPlaceScreen.favoriteIconLabel")} key={item.key} contentKey={item.key} placeName={item['fContent' + this.Language.toUpperCase()].fBuildingName} placeCategory={item.fBuildingType} location={item.fCity} lastVisited={item.lastVisited} contentLikeCount={item.fLikeCount} contentImage={item['fContent' + this.Language.toUpperCase()].fImageJSON[0][this.imageSetting].uri} shortDesc={item['fContent' + this.Language.toUpperCase()].fShortDescription} like={item.fUserLikedThis} notification={item.fUserNotificationThis} favorite={item.fUserFavoriteThis} style={style.containerView1}
                                    likeMallGetReward={async () => await this._SurpriseRewardLikeMall(item.key)}></DefaultPlaceCard>
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
                    <FullSearchBar accessible={true} accessibilityLabel={'SearchResultFavoritePlaceScreenFullSearchBar'} screen='SearchResultFavoritePlace' searchKeyword={this.searchKeyword} language={this.Language} sortData={this._sortData} onApplySort={(v) => { this._setSort(v) }} onPressFilter={() => { SGHelperNavigation.navigatePush(this.props.navigation, 'Filter', { filterData: this._filterData, buildingMatrix: this._buildingMatrix, onApplyFilter: (v) => { this._setFilter(v) }, onCloseFilter: (v) => { console.log(v) } }) }} navigator={this.props.navigation} style={this.style.containerView1}></FullSearchBar>
                </Animated.View>
                <Animated.View style={{ position: 'absolute', transform: [{ translateY: this._baseAnimY.interpolate({ inputRange: [-1, 0], outputRange: [SGHelperWindow.getWHPNoHeader().h + 8 * p, SGHelperWindow.getWHPNoHeader().h - Math.max(SGHelperWindow.getFooterHeight(), 2 * p) - SGHelperWindow.getHeaderHeight()] }) },], height: Math.max(SGHelperWindow.getFooterHeight(), 2 * p) + SGHelperWindow.getHeaderHeight(), width: '100%' }}>
                    <BottomNavigationContainer navigator={this.props.navigation} style={style.throwWHP}></BottomNavigationContainer>
                </Animated.View>
            </RootView>
        );
    }
}