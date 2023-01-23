/**
 * Version 1.2.0
 * 1. Yohanes March 29 2021
 * - add Error Handling
* Leon, 4 May 2021
  - Fix Like
*/
import React from 'react';
import { StyleSheet, Animated } from 'react-native';
import { SGRootView as RootView, SGView as View, SGText as Text, SGFlatList as FlatList, SGActivityIndicator as ActivityIndicator } from '../../../core/control';
import { SGBaseScreen } from '../../../core/screen/SGBaseScreen';
import { FullSearchBar } from '../../component_V2/FullSearchBar';
import { WhatToGiftRestoCard } from '../../container_V2/WhatToGiftRestoCard';
import { WhatToGiftStoreCard } from '../../container_V2/WhatToGiftStoreCard';
import { SGHelperNavigation, SGHelperGlobalVar, SGHelperWindow, SGHelperErrorHandling,SGHelperType } from '../../../core/helper';
import { SGLocalize } from '../../locales/SGLocalize';
import { RibbonHeader } from '../../component_V2/RibbonHeader';
import { BottomNavigationContainer } from '../../component_V2/BottomNavigationContainer';
import { filterDAO } from '../../db/filterDAO';
import { sortDAO } from '../../db/sortDAO';
import { VAliceResultAPI } from '../../api/VAliceResultAPI';
import { EmptyDetailView } from '../../container_V2/EmptyDetailView';

export class WhatToGiftResultScreen extends SGBaseScreen {

    getPagingData(){
        var itemPerPage = SGHelperType.getPaging()
        return {paging:true,offset:this.pagingCounter, totalPerPage:itemPerPage}
    }

    createStyleSheet = (whp) => {
        var { w, h, p } = whp;
        return StyleSheet.create({
            throwWHP: { width: w, height: h, padding: p },
            mainContainer: { width: w, height: h, backgroundColor: '#E6E6E6' },
            mainView1: { width: w, height: h, backgroundColor: 'white', justifyContent: 'flex-start', },
            throwWHP: { width: w, height: h, padding: p, backgroundColor: 'white' },
            containerView1: { width: w - 2 * p, height: w, padding: p, backgroundColor: 'white' },
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

    async _setFilter(dataFilter) {
        this._filterData = dataFilter;
        await this._onRefreshAllItem(true);
    }

    async _setSort(dataSort) {
        this._sortData = dataSort;
        await this._onRefreshAllItem(true);
    }

    async _onRefreshAllItem(resetPaging = false) {
      
        this.currentUser = SGHelperGlobalVar.getVar('GlobalCurrentUser');
        this.userData = SGHelperGlobalVar.getVar('GlobalCurrentUserData');
        this.imageSetting = SGHelperGlobalVar.getVar('GlobalImageSetting');
        this.currentUserCurrency = SGHelperGlobalVar.getVar('GlobalCurrency');
        this.currentUserImage = SGHelperGlobalVar.getVar('GlobalCurrentUserImage');
        this._buildingMatrix = filterDAO.getBuildingMatrix();

        if(resetPaging){
            this.setState({ refresh: true })
            this.pagingCounter= 0
            this.paging = this.getPagingData()
            this.baseRunSingleAPIWithRedoOption('getWhatToGiftResult', (async (v1,v2,v3,v4) => { return VAliceResultAPI.getWhatToGiftResult(v1,v2,v3,v4) }).bind(this,this.props.route.params.userAnswerData,this._filterData,this._sortData,this.paging), (async (v) => {
                this.renderData = v//await VAliceResultAPI.getWhatToGiftResult(this.props.route.params.userAnswerData,this._filterData,this._sortData,this.paging);
                if(v.length<SGHelperType.getPaging())this.setState({stopPulling:true})
                else this.setState({stopPulling:false})
                this.pagingCounter =  this.renderData.length
                this.alreadyMount = true;
                this.setState({ refresh: false });
                this.forceUpdate();
            }).bind(this), (()=>{this.setState({ refresh: false })}),  SGHelperGlobalVar.getVar("ResponTimes")); 
        } else {
            this.forceUpdate();
        }
    }

    async _onRefresh() {
        this.currentUser = SGHelperGlobalVar.getVar('GlobalCurrentUser');
        this.userData = SGHelperGlobalVar.getVar('GlobalCurrentUserData');
        this.imageSetting = SGHelperGlobalVar.getVar('GlobalImageSetting');
        this.currentUserCurrency = SGHelperGlobalVar.getVar('GlobalCurrency');
        this.currentUserImage = SGHelperGlobalVar.getVar('GlobalCurrentUserImage');
        this._buildingMatrix = filterDAO.getBuildingMatrix();

        this.setState({ refresh: true ,stopPulling:true})
        if(!this.refresh && !this.state.loading){
            this.refresh= true
            this.pagingCounter = 0
            this.paging = this.getPagingData()


            this.baseRunSingleAPIWithRedoOption('getWhatToGiftResult', (async (v1,v2,v3,v4) => { return VAliceResultAPI.getWhatToGiftResult(v1,v2,v3,v4) }).bind(this,this.props.route.params.userAnswerData,this._filterData,this._sortData,this.paging), ((v) => {
            this.renderData = v
            this.pagingCounter = this.renderData.length
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
        this.userData = SGHelperGlobalVar.getVar('GlobalCurrentUserData');
        this.imageSetting = SGHelperGlobalVar.getVar('GlobalImageSetting');
        this.currentUserCurrency = SGHelperGlobalVar.getVar('GlobalCurrency');
        this.currentUserImage = SGHelperGlobalVar.getVar('GlobalCurrentUserImage');
        this._buildingMatrix = filterDAO.getBuildingMatrix();

        if(!this.state.loading && !this.state.stopPulling){    
            this.setState({loading:true})
            this.paging = this.getPagingData()
            this.baseRunSingleAPIWithRedoOption('getWhatToGiftResult', (async (v1,v2,v3,v4) => { return VAliceResultAPI.getWhatToGiftResult(v1,v2,v3,v4) }).bind(this,this.props.route.params.userAnswerData,this._filterData,this._sortData,this.paging), (async (v) => {
                var resData = v//await VAliceResultAPI.getWhatToGiftResult(this.props.route.params.userAnswerData,this._filterData,this._sortData,this.paging);
                if(resData.length!==0){
                    for(var i=0;i<resData.length;i++){
                        this.renderData.push(resData[i])
                    }
                    this.pagingCounter = this.pagingCounter + resData.length
                } else this.setState({stopPulling:true})
                this.setState({loading:false})
            }).bind(this), (()=>{this.setState({ loading: false })}),  SGHelperGlobalVar.getVar("ResponTimes")); 
        }
    }

    constructor(props, context, ...args) {
        super(props, context, ...args);
        this.style = this.createStyleSheet(this.WHP);
        var { w, h, p } = this.WHP;
        this.props.navigation.setOptions({
            headerShown: false,
        });
        this.renderData = []
        this._filterData = filterDAO.getWhatToGiftFilterData();
        this._sortData = sortDAO.getWhatToGiftSortData(this.Language.toUpperCase());
        this.currentUser = SGHelperGlobalVar.getVar('GlobalCurrentUser');
        this.userData = SGHelperGlobalVar.getVar('GlobalCurrentUserData');
        this.currentUserImage = SGHelperGlobalVar.getVar('GlobalCurrentUserImage');
        this.imageSetting = SGHelperGlobalVar.getVar('GlobalImageSetting');
        this.currentUserCurrency = SGHelperGlobalVar.getVar('GlobalCurrency');

        // Paging
        this.state = {  refresh: false ,refreshFlatList:false, loading:false, stopPulling:false };
        this.alreadyMount = false;
        this.refresh=false
        this.pagingCounter = 0
    }

    _getLikeResource(data) {
        if (data.fType === 'giftResto') {
            var contentType = 'RestoWhatToGift'
        }
        if (data.fType === 'giftStore') {
            var contentType = 'StoreWhatToGift'
        }
        var contentStoreID = data.fContentStoreID;
        var contentStoreEN = data.fContentStoreEN;
        var contentStoreCN = data.fContentStoreCN;
        var contentID = data.fContentID;
        var contentEN = data.fContentEN;
        var contentCN = data.fContentCN;
        return (
            { fContentType: contentType, fContentKey: data.key, fText1: { id: contentID.fRecName, en: contentEN.fRecName, cn: contentCN.fRecName }, fText2: { id: contentStoreID.fStoreName, en: contentStoreEN.fStoreName, cn: contentStoreCN.fStoreName }, fText3: { id: data.fBuildingNameID, en: data.fBuildingNameEN, cn: data.fBuildingNameCN }, fImageID: contentID.fImageJSON, fImageEN: contentEN.fImageJSON, fImageCN: contentCN.fImageJSON, fTargetKey: data.fStoreKey }
        )
    }

    _getCommentResource(data) {
        if (data.fType === 'giftResto') {
            var contentType = 'RestoWhatToGift'
        }
        if (data.fType === 'giftStore') {
            var contentType = 'StoreWhatToGift'
        }
        var contentStoreID = data.fContentStoreID;
        var contentStoreEN = data.fContentStoreEN;
        var contentStoreCN = data.fContentStoreCN;
        var contentID = data.fContentID;
        var contentEN = data.fContentEN;
        var contentCN = data.fContentCN;
        return (
            {
                fUserImage: this.userData.fProfileImageJSON, fContentType: contentType, fContentKey: data.key,
                fContentName: { id: contentID.fRecName, en: contentEN.fRecName, cn: contentCN.fRecName },
                fContentText1: { id: contentStoreID.fStoreName, en: contentStoreEN.fStoreName, cn: contentStoreCN.fStoreName },
                fContentText2: { id: contentID.fShortDescription, en: contentEN.fShortDescription, cn: contentCN.fShortDescription },
                fContentImage: { id: contentID.fImageJSON, en: contentEN.fImageJSON, cn: contentCN.fImageJSON },
                fTargetType: data.fType === 'giftStore' ? 'Store' : 'Resto', fTargetName: { id: contentStoreID.fStoreName, en: contentStoreEN.fStoreName, cn: contentStoreCN.fStoreName },
                fTargetImage: { id: contentStoreID.fStoreImageJSON, en: contentStoreEN.fStoreImageJSON, cn: contentStoreCN.fStoreImageJSON },
                fTargetKey: data.fStoreKey
            }
        )
    }

    render() {
        var { w, h, p } = this.WHP;
        var style = this.style;

        return (
            <RootView dummyStatusBar dummyHeaderBar accessible={true} accessibilityLabel={'WhatToGiftResultScreenRootView'} style={style.mainContainer}>
                <RibbonHeader borderTopOff imageSetting={this.imageSetting} title={SGLocalize.translate("WhatToGiftResultScreen.screenTitle")} ribbonWidth={0.45}></RibbonHeader>
                {
                    this.alreadyMount ?
                        this.renderData.length !== 0 ?
                            <FlatList refreshing={this.state.refreshFlatList} onRefresh={this._onRefresh.bind(this)} accessible={true} accessibilityLabel={'WhatToGiftResultScreenList'} showsVerticalScrollIndicator={false} contentContainerStyle={{ justifyContent: 'flex-start', alignItems: 'center' }} data={this.renderData} renderItem={({ item }) => {
                                return (
                                    item.fType === 'giftResto' ?
                                        (<WhatToGiftRestoCard onLike={((item, s,c)=>{console.log(item);  item.fUserLikedThis = s; item.fLikeCountRec+=c; this.forceUpdate();}).bind(this, item)} accessible={true} accessibilityLabel={'WhatToGiftResultScreenWTGiftRestoCard'} likePackage={this._getLikeResource(item)} commentPackage={this._getCommentResource(item)} language={this.Language} key={item.key} data={item} currency={this.currentUserCurrency} navigator={this.props.navigation} imageSetting={this.imageSetting} likeText={SGLocalize.translate("WhatToGiftResultScreen.likeText")} contentKey={item.key} style={style.throwWHP}></WhatToGiftRestoCard>)
                                        : (<WhatToGiftStoreCard onLike={((item, s,c)=>{console.log(item);  item.fUserLikedThis = s; item.fLikeCountRec+=c; this.forceUpdate();}).bind(this, item)} accessible={true} accessibilityLabel={'WhatToGiftResultScreenWTGiftStoreCard'} likePackage={this._getLikeResource(item)} commentPackage={this._getCommentResource(item)} language={this.Language} key={item.key} data={item} currency={this.currentUserCurrency} navigator={this.props.navigation} imageSetting={this.imageSetting} likeText={SGLocalize.translate("WhatToGiftResultScreen.likeText")} contentKey={item.key} style={style.throwWHP}></WhatToGiftStoreCard>)
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
                            <View style={{ borderRadius: 4 * p, backgroundColor: 'white',paddingBottom:2*p,marginTop:2*p, width: 0.9 * w, borderColor: 'rgb(230,230,230)', borderWidth: 0.25 * p, position:'absolute',bottom:h/2 }}>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', backgroundColor: "rgba(38,38,38,0.85)", width: 0.9 * w, borderTopRightRadius: 4 * p, borderTopLeftRadius: 4 * p }}>
                                    <Text preset={Text.preset.titleH2B} style={{ paddingLeft: 2 * p, paddingRight: 2 * p, marginVertical: 3 * p, textAlign: 'justify', textAlignVertical: 'top', color: "white" }}>{SGLocalize.translate('globalText.AliceIsWorkingOnIt')}</Text>
                                </View>
                                <Text preset={Text.preset.titleH3} style={{ paddingLeft: 2 * p, paddingRight: 2 * p, marginVertical: 3 * p, textAlign: 'justify', textAlignVertical: 'top', color: "rgb(130,128,128)" }}>{SGLocalize.translate('globalText.AliceResultNotFill')}</Text>
                            </View>
                        :
                        <ActivityIndicator preset={ActivityIndicator.preset.h1} style={{ flex: 1 }}></ActivityIndicator>
                }
                {/* <View style={{ width: w, height: w * 0.15,backgroundColor:'transparent'}}></View> */}
                <Animated.View style={{ position: 'absolute', transform: [{ translateY: this._baseAnimY.interpolate({ inputRange: [-1, 0], outputRange: [(SGHelperWindow.getStatusBarHeight() - SGHelperWindow.getHeaderHeight()), SGHelperWindow.getStatusBarHeight()] }) },], height: SGHelperWindow.getHeaderHeight(), width: '100%' }}>
                    <FullSearchBar noSearchBar noIconSearchBar accessible={true} accessibilityLabel={'SeeAllFavoritesRestoScreenSearchBar'} screen='SearchResultFavoriteResto' searchKeyword={this.searchKeyword} language={this.Language} sortData={this._sortData} onApplySort={(v) => { this._setSort(v) }} onPressFilter={() => { SGHelperNavigation.navigatePush(this.props.navigation, 'Filter', { filterData: this._filterData, buildingMatrix: this._buildingMatrix, onApplyFilter: (v) => { this._setFilter(v) }, onCloseFilter: (v) => { console.log(v) } }) }} navigator={this.props.navigation} imageSetting={this.imageSetting} style={this.style.throwWHP}></FullSearchBar>
                </Animated.View>
                <BottomNavigationContainer accessible={true} currentUser={this.currentUser} navigator={this.props.navigation} style={style.throwWHP}></BottomNavigationContainer>
            </RootView>
        );
    }
}