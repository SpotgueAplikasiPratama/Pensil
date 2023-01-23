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
import { SGHelperNavigation, SGHelperGlobalVar, SGHelperWindow ,SGHelperType,SGHelperErrorHandling} from '../../../core/helper';
import { SGLocalize } from '../../locales/SGLocalize';
import { RibbonHeader } from '../../component_V2/RibbonHeader';
import { BottomNavigationContainer } from '../../component_V2/BottomNavigationContainer';
import { filterDAO } from '../../db/filterDAO';
import { sortDAO } from '../../db/sortDAO';
import { VSearchResultFavoriteStorePromoAPI } from '../../api/VSearchResultFavoriteStorePromoAPI';
import { VFilterOptionsAPI } from '../../api/VFilterOptionsAPI';
import { EmptyDetailView } from '../../container_V2/EmptyDetailView';
import { tbVEventSponsorshipAPI } from '../../api/tbVEventSponsorshipAPI';
import { DefaultSponsorPromoCard } from '../../container_V2/DefaultSponsorPromoCard';

export class SearchResultSponsorPromoScreen extends SGBaseScreen {

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
        
        if(resetPaging){
            this.setState({ refresh: true })
            this.pagingCounter= 0
            this.paging = this.getPagingData()

            this.baseRunSingleAPIWithRedoOption('getAllSearchResultSponsorEvent', (async (v1,v2,v3,v4,v5) => { return tbVEventSponsorshipAPI.getAllSearchResultSponsorEvent(v1,v2,v3,v4,v5); }).bind(this,this.Language, this.searchKeyword, this._filterData, this._sortData,this.paging), ((v) => {
                this.data = v;
                this.pagingCounter = this.data.length
                if(v.length<SGHelperType.getPaging())this.setState({stopPulling:true})
                else this.setState({stopPulling:false})
                this.alreadyMount = true;
                this.setState({ refresh: false });
                this.forceUpdate();
            }).bind(this),  (()=>{this.setState({ refresh:false })}),  SGHelperGlobalVar.getVar("ResponTimes"));

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
            this.baseRunSingleAPIWithRedoOption('getAllSearchResultSponsorEvent', (async (v1, v2, v3, v4, v5) => { return tbVEventSponsorshipAPI.getAllSearchResultSponsorEvent(v1, v2, v3, v4, v5) }).bind(this, this.Language, this.searchKeyword, this._filterData, this._sortData,this.paging), ((v) => {
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
                this.baseRunSingleAPIWithRedoOption('getAllSearchResultSponsorEvent', (async (v1, v2, v3,v4,v5) => {  return tbVEventSponsorshipAPI.getAllSearchResultSponsorEvent(v1, v2, v3,v4,v5) }).bind(this, this.Language, this.searchKeyword, this._filterData, this._sortData,this.paging), ((v) => {           
                    var resData =  v
                    if(resData.length!==0){
                        for(var i=0;i<resData.length;i++){
                            this.data.push(resData[i])
                        }
                        this.pagingCounter = this.pagingCounter + resData.length
                    } else this.setState({stopPulling:true})
                    this.setState({loading:false})
                }).bind(this), (()=>{ this.setState({loadingWaitingList:false}) }), SGHelperGlobalVar.getVar("ResponTimes"));
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
        this._filterData = filterDAO.getSponsorPromoFilterData(this.Language);
        this._sortData = sortDAO.getSponsorPromoSortData(this.Language.toUpperCase());
        this.props.navigation.setOptions({
            headerShown: false,
        });
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


    render() {
        var { w, h, p } = this.WHP;
        var style = this.style;

        return (
            <RootView dummyStatusBar dummyHeaderBar accessible={true} accessibilityLabel={'SearchResultSponsorPromoScreenRootView'} style={style.mainContainer}>
               <RibbonHeader imageSetting={this.imageSetting} title={SGLocalize.translate("HomeScreen.SponsorshipTitle")}></RibbonHeader>
                {this.alreadyMount ?
                    this.data.length !== 0 ?
                        <FlatList refreshing={this.state.refreshFlatList} onRefresh={this._onRefresh.bind(this)} accessible={true} accessibilityLabel={'SearchResultSponsorPromoScreenList'} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingVertical: p, justifyContent: 'flex-start', alignItems: 'center' }} data={this.data} renderItem={({ item }) => {
                            return (
                                <DefaultSponsorPromoCard accessible={true} accessibilityLabel={'SeeAllSponsorshipPromoCard'} navigator={this.props.navigation} key={item.fID} data={item} style={style.containerView1}></DefaultSponsorPromoCard>
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
                <Animated.View style={{ position: 'absolute', transform: [{ translateY: this._baseAnimY.interpolate({ inputRange: [-1, 0], outputRange: [(SGHelperWindow.getStatusBarHeight() - SGHelperWindow.getHeaderHeight()), SGHelperWindow.getStatusBarHeight()] }) },], height: SGHelperWindow.getHeaderHeight(), width: '100%' }}>
                <FullSearchBar sponsor accessible={true} accessibilityLabel={'SeeAllSponsorshipPromoScreen'} screen='SearchResultSponsorPromo' searchKeyword={this.searchKeyword} language={this.Language} sortData={this._sortData} onApplySort={(v) => { this._setSort(v) }} onPressFilter={() => { SGHelperNavigation.navigatePush(this.props.navigation, 'Filter', { filterData: this._filterData, onApplyFilter: (v) => { this._setFilter(v) }, onCloseFilter: (v) => { console.log(v) } }) }} navigator={this.props.navigation} imageSetting={this.imageSetting} style={this.style.containerView1}></FullSearchBar>
                </Animated.View>
                <Animated.View style={{ position: 'absolute', transform: [{ translateY: this._baseAnimY.interpolate({ inputRange: [-1, 0], outputRange: [SGHelperWindow.getWHPNoHeader().h + 8 * p, SGHelperWindow.getWHPNoHeader().h - Math.max(SGHelperWindow.getFooterHeight(), 2 * p) - SGHelperWindow.getHeaderHeight()] }) },], height: Math.max(SGHelperWindow.getFooterHeight(), 2 * p) + SGHelperWindow.getHeaderHeight(), width: '100%' }}>
                    <BottomNavigationContainer navigator={this.props.navigation} style={style.throwWHP}></BottomNavigationContainer>
                </Animated.View>
            </RootView>
        );
    }
}