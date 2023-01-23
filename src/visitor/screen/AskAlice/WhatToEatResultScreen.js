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
import { DefaultRestoMenuCard } from '../../container_V2/DefaultRestoMenuCard';
import { WhatToEatCard } from '../../container_V2/WhatToEatCard';
import { SGHelperNavigation, SGHelperGlobalVar, SGHelperWindow, SGHelperErrorHandling,SGHelperType } from '../../../core/helper';
import { SGLocalize } from '../../locales/SGLocalize';
import { RibbonHeader } from '../../component_V2/RibbonHeader';
import { BottomNavigationContainer } from '../../component_V2/BottomNavigationContainer';
import { filterDAO } from '../../db/filterDAO';
import { sortDAO } from '../../db/sortDAO';
import { VAliceResultAPI } from '../../api/VAliceResultAPI';
import { EmptyDetailView } from '../../container_V2/EmptyDetailView';

export class WhatToEatResultScreen extends SGBaseScreen {

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

    async _onRefreshAllItem(resetPaging = false) {

        this.currentUser = SGHelperGlobalVar.getVar('GlobalCurrentUser');
        this.imageSetting = SGHelperGlobalVar.getVar('GlobalImageSetting');
        this.currentUserCurrency = SGHelperGlobalVar.getVar('GlobalCurrency');
        this.currentUserImage = SGHelperGlobalVar.getVar('GlobalCurrentUserImage');
        this.userData = SGHelperGlobalVar.getVar('GlobalCurrentUserData');
        this._buildingMatrix = filterDAO.getBuildingMatrix();

        if(resetPaging){
            this.setState({ refresh: true })
            this.pagingCounter= 0
            this.paging = this.getPagingData()
            console.log('run');
            console.log(this._sortData);
            this.baseRunSingleAPIWithRedoOption('getWhatToEatResult', (async (v1,v2,v3,v4) => { return VAliceResultAPI.getWhatToEatResult(v1,v2,v3,v4) }).bind(this,this.props.route.params.userAnswerData,this._filterData,this._sortData,this.paging), (async (v) => {
                this.renderData =v // await VAliceResultAPI.getWhatToEatResult(this.props.route.params.userAnswerData,this._filterData,this._sortData,this.paging);
                if(v.length<SGHelperType.getPaging())this.setState({stopPulling:true})
                else this.setState({stopPulling:false})
                this.pagingCounter =  this.renderData.length
                this.alreadyMount = true;
                this.setState({ refresh: false })
            }).bind(this), (()=>{this.setState({ refresh: false })}),  SGHelperGlobalVar.getVar("ResponTimes")); 
        } else {
            this.forceUpdate();
        }

      
       
    }

    async _onRefresh() {
        this.currentUser = SGHelperGlobalVar.getVar('GlobalCurrentUser');
        this.imageSetting = SGHelperGlobalVar.getVar('GlobalImageSetting');
        this.currentUserCurrency = SGHelperGlobalVar.getVar('GlobalCurrency');
        this.currentUserImage = SGHelperGlobalVar.getVar('GlobalCurrentUserImage');
        this.userData = SGHelperGlobalVar.getVar('GlobalCurrentUserData');
        this._buildingMatrix = filterDAO.getBuildingMatrix();

        this.setState({ refresh: true ,stopPulling:true})
        if(!this.refresh && !this.state.loading){
            this.refresh= true
            this.pagingCounter = 0
            this.paging = this.getPagingData()


            this.baseRunSingleAPIWithRedoOption('getWhatToEatResult', (async (v1,v2,v3,v4) => { return VAliceResultAPI.getWhatToEatResult(v1,v2,v3,v4) }).bind(this,this.props.route.params.userAnswerData,this._filterData,this._sortData,this.paging), ((v) => {
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
        this.imageSetting = SGHelperGlobalVar.getVar('GlobalImageSetting');
        this.currentUserCurrency = SGHelperGlobalVar.getVar('GlobalCurrency');
        this.currentUserImage = SGHelperGlobalVar.getVar('GlobalCurrentUserImage');
        this.userData = SGHelperGlobalVar.getVar('GlobalCurrentUserData');
        this._buildingMatrix = filterDAO.getBuildingMatrix();

        if(!this.state.loading && !this.state.stopPulling){    
            this.setState({loading:true})
            this.paging = this.getPagingData()
            this.baseRunSingleAPIWithRedoOption('getWhatToEatResult', (async (v1,v2,v3,v4) => { return VAliceResultAPI.getWhatToEatResult(v1,v2,v3,v4) }).bind(this,this.props.route.params.userAnswerData,this._filterData,this._sortData,this.paging), (async (v) => {
                var resData = v //await VAliceResultAPI.getWhatToEatResult(this.props.route.params.userAnswerData,this._filterData,this._sortData,this.paging);
                if(resData.length!==0){
                    for(var i=0;i<resData.length;i++){
                        this.renderData.push(resData[i])
                    }
                    this.pagingCounter = this.pagingCounter + resData.length
                } else this.setState({stopPulling:true})
                this.setState({loading:false})
            }).bind(this), (()=>{this.setState({ refresh: false })}),  SGHelperGlobalVar.getVar("ResponTimes")); 
        }
    }

    constructor(props, context, ...args) {
        super(props, context, ...args);
        this.style = this.createStyleSheet(this.WHP);
        var { w, h, p } = this.WHP;
        this.props.navigation.setOptions({
            headerShown: false,
        });
        this.renderData = [];
        this._filterData = filterDAO.getWhatToEatFilterData();
        this._sortData = sortDAO.getWhatToEatSortData(this.Language.toUpperCase());
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

    async _setFilter(dataFilter) {
        this._filterData = dataFilter;
        await this._onRefreshAllItem(true);
    }

    async _setSort(dataSort) {
        this._sortData = dataSort;
        await this._onRefreshAllItem(true);
    }
    
    _getLikeResource(data) {
        var contentRestoID = data.fContentRestoID;
        var contentRestoEN = data.fContentRestoEN;
        var contentRestoCN = data.fContentRestoCN;
        var contentID = data.fContentID;
        var contentEN = data.fContentEN;
        var contentCN = data.fContentCN;
        return (
            { fContentType: 'WhatToEat', fContentKey: data.key, fText1: { id: contentID.fRecName, en: contentEN.fRecName, cn: contentCN.fRecName }, fText2: { id: contentRestoID.fStoreName, en: contentRestoEN.fStoreName, cn: contentRestoCN.fStoreName }, fText3: { id: data.fBuildingNameID, en: data.fBuildingNameEN, cn: data.fBuildingNameCN }, fImageID: contentID.fImageJSON, fImageEN: contentEN.fImageJSON, fImageCN: contentCN.fImageJSON, fTargetKey: data.fStoreKey }
        )
    }

    _getCommentResource(data) {
        var contentRestoID = data.fContentRestoID;
        var contentRestoEN = data.fContentRestoEN;
        var contentRestoCN = data.fContentRestoCN;
        var contentID = data.fContentID;
        var contentEN = data.fContentEN;
        var contentCN = data.fContentCN;
        return (
            {
                fUserImage: this.userData.fProfileImageJSON, fContentType: 'WhatToEat', fContentKey: data.key,
                fContentName: { id: contentID.fRecName, en: contentEN.fRecName, cn: contentCN.fRecName },
                fContentText1: { id: contentRestoID.fStoreName, en: contentRestoEN.fStoreName, cn: contentRestoCN.fStoreName },
                fContentText2: { id: contentID.fShortDescription, en: contentEN.fShortDescription, cn: contentCN.fShortDescription },
                fContentImage: { id: contentID.fImageJSON, en: contentEN.fImageJSON, cn: contentCN.fImageJSON },
                fTargetType: 'Resto', fTargetName: { id: contentRestoID.fStoreName, en: contentRestoEN.fStoreName, cn: contentRestoCN.fStoreName },
                fTargetImage: { id: contentRestoID.fStoreImageJSON, en: contentRestoEN.fStoreImageJSON, cn: contentRestoCN.fStoreImageJSON },
                fTargetKey: data.fStoreKey
            }
        )
    }

    render() {
        var { w, h, p } = this.WHP;
        var style = this.style;

        return (
            <RootView dummyStatusBar dummyHeaderBar accessible={true} accessibilityLabel={'WhatToEatResultScreenRootView'} style={style.mainContainer}>
                <RibbonHeader textPreset={Text.preset.titleH2B} borderTopOff goldTheme imageSetting={this.imageSetting} title={SGLocalize.translate("WhatToEatResultScreen.screenTitle")} ribbonWidth={0.45}></RibbonHeader>
                {this.alreadyMount ?
                    this.renderData.length !== 0 ?
                        <FlatList refreshing={this.state.refreshFlatList} onRefresh={this._onRefresh.bind(this)} accessible={true} accessibilityLabel={'WhatToEatResultScreenList'} showsVerticalScrollIndicator={false} contentContainerStyle={{ justifyContent: 'flex-start', alignItems: 'center' }} data={this.renderData} renderItem={({ item }) => {
                            // console.log(item);
                            return (
                                <WhatToEatCard onLike={((item, s,c)=>{console.log(item);  item.fUserLikedThis = s; item.fLikeCountRec+=c; this.forceUpdate();}).bind(this, item)} accessible={true} accessibilityLabel={'WhatToEatResultScreenMenuCard'} commentPackage={this._getCommentResource(item)} likePackage={this._getLikeResource(item)} key={item.key} language={this.Language} data={item} currency={this.currentUserCurrency} navigator={this.props.navigation} imageSetting={this.imageSetting} likeText={SGLocalize.translate("WhatToEatResultScreen.likeText")} contentKey={item.key} style={style.throwWHP}></WhatToEatCard>
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
                    <FullSearchBar noSearchBar noIconSearchBar accessibilityLabel={'SeeAllFavoritesRestoScreenSearchBar'} screen='SearchResultFavoriteResto' searchKeyword={this.searchKeyword} language={this.Language} sortData={this._sortData} onApplySort={ this._setSort.bind(this) } onPressFilter={() => { SGHelperNavigation.navigatePush(this.props.navigation, 'Filter', { filterData: this._filterData, buildingMatrix: this._buildingMatrix, onApplyFilter: (v) => { this._setFilter(v) }, onCloseFilter: (v) => { console.log(v) } }) }} navigator={this.props.navigation} imageSetting={this.imageSetting} style={this.style.throwWHP}></FullSearchBar>
                </Animated.View>
                <BottomNavigationContainer accessible={true} currentUser={this.currentUser} navigator={this.props.navigation} style={style.throwWHP}></BottomNavigationContainer>
            </RootView>
        );
    }
}