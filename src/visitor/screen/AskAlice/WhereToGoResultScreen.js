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
import { NoSortSearchBar } from '../../component_V2/NoSortSearchBar';
import { WhereToGoCard } from '../../container_V2/WhereToGoCard';
import { SGHelperNavigation, SGHelperGlobalVar, SGHelperWindow, SGHelperErrorHandling, SGHelperType } from '../../../core/helper';
import { SGLocalize } from '../../locales/SGLocalize';
import { RibbonHeader } from '../../component_V2/RibbonHeader';
import { BottomNavigationContainer } from '../../component_V2/BottomNavigationContainer';
import { filterDAO } from '../../db/filterDAO';
import { sortDAO } from '../../db/sortDAO';
import { WhereToGoResultDAO } from '../../db/WhereToGoResultDAO';
import idJSON from '../../locales/id.json';
import enJSON from '../../locales/en.json';
import cnJSON from '../../locales/cn.json';
import { tbLookupDAO } from '../../db/tbLookupDAO';
import { VFilterOptionsAPI } from '../../api/VFilterOptionsAPI';
import { EmptyDetailView } from '../../container_V2/EmptyDetailView';
import { VisitorHelper } from '../../helper/VisitorHelper';

export class WhereToGoResultScreen extends SGBaseScreen {


    getPagingData() {
        var itemPerPage = SGHelperType.getPaging()
        return { paging: true, offset: this.pagingCounter, totalPerPage: itemPerPage }
    }

    createStyleSheet = (whp) => {
        var { w, h, p } = whp;
        return StyleSheet.create({
            throwWHP: { width: w, height: h, padding: p },
            mainContainer: { width: w, height: h, backgroundColor: '#E6E6E6', justifyContent: 'flex-start' },
            mainView1: { width: w, height: h, backgroundColor: 'white', justifyContent: 'flex-start', },
            throwWHP: { width: w, height: h, padding: p, backgroundColor: 'white' },
            containerView1: { width: w, height: w, padding: p, backgroundColor: 'white', alignSelf: 'center' },
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
        this.currentuserData = SGHelperGlobalVar.getVar('GlobalCurrentUserData');
        if (resetPaging) {
            this.baseRunSingleAPIWithRedoOption('getLocationFilter', (async (v1) => { return VFilterOptionsAPI.getLocationFilter(v1) }).bind(this, this.Language), (async (v) => {
                this._buildingMatrix = v//await VFilterOptionsAPI.getLocationFilter(this.Language);
                this.setState({ refresh: true })
                this.pagingCounter = 0
                this.paging = this.getPagingData()

                this.baseRunSingleAPIWithRedoOption('getWhereToGoRecommendationResult', (async (v1, v2, v3, v4) => { return WhereToGoResultDAO.getWhereToGoRecommendationResult(v1, v2, v3, v4) }).bind(this, this.props.route.params.userAnswerData, this._filterData, this._sortData, this.paging), (async (res) => {
                    this.renderData = res //await WhereToGoResultDAO.getWhereToGoRecommendationResult(this.props.route.params.userAnswerData, this._filterData,this._sortData,this.paging);
                    console.log(res)
                    this.pagingCounter = this.renderData.length
                    if (v.length < SGHelperType.getPaging()) this.setState({ stopPulling: true })
                    else this.setState({ stopPulling: false })
                    this.alreadyMount = true;
                    this.setState({ refresh: false });
                }).bind(this), (() => { this.setState({ loading: false }) }), SGHelperGlobalVar.getVar("ResponTimes"));

            }).bind(this), null, SGHelperGlobalVar.getVar("ResponTimes"));
        }  else {
            this.forceUpdate();
        }
    }

    async _onRefresh() {
        this.currentUser = SGHelperGlobalVar.getVar('GlobalCurrentUser');
        this.imageSetting = SGHelperGlobalVar.getVar('GlobalImageSetting');
        this.currentUserCurrency = SGHelperGlobalVar.getVar('GlobalCurrency');
        this.currentUserImage = SGHelperGlobalVar.getVar('GlobalCurrentUserImage');
        this.currentuserData = SGHelperGlobalVar.getVar('GlobalCurrentUserData');

        this.setState({ refresh: true, stopPulling: true })
        if (!this.refresh && !this.state.loading) {
            this.refresh = true
            this.pagingCounter = 0
            this.paging = this.getPagingData()


            this.baseRunSingleAPIWithRedoOption('getWhereToGoRecommendationResult', (async (v1, v2, v3, v4) => { return WhereToGoResultDAO.getWhereToGoRecommendationResult(v1, v2, v3, v4) }).bind(this, this.props.route.params.userAnswerData, this._filterData, this._sortData, this.paging), ((v) => {
                this.renderData = v
                this.pagingCounter = this.renderData.length
                if (v.length < SGHelperType.getPaging()) this.setState({ stopPulling: true })
                else this.setState({ stopPulling: false })
                this.refresh = false
                this.setState({ refresh: false });
                this.forceUpdate()
            }).bind(this), null, SGHelperGlobalVar.getVar("ResponTimes"));
        }
    }

    async _onLoad() {
        this.currentUser = SGHelperGlobalVar.getVar('GlobalCurrentUser');
        this.userData = SGHelperGlobalVar.getVar('GlobalCurrentUserData');
        this.imageSetting = SGHelperGlobalVar.getVar('GlobalImageSetting');
        this.currentUserCurrency = SGHelperGlobalVar.getVar('GlobalCurrency');
        this.currentUserImage = SGHelperGlobalVar.getVar('GlobalCurrentUserImage');
        this.baseRunSingleAPIWithRedoOption('getLocationFilter', (async (v1) => { return VFilterOptionsAPI.getLocationFilter(v1) }).bind(this, this.Language), (async (v) => {
            this._buildingMatrix = v// await VFilterOptionsAPI.getLocationFilter(this.Language);
            if (!this.state.loading && !this.state.stopPulling) {
                this.setState({ loading: true })
                this.paging = this.getPagingData()

                this.baseRunSingleAPIWithRedoOption('getWhereToGoRecommendationResult', (async (v1, v2, v3, v4) => { return WhereToGoResultDAO.getWhereToGoRecommendationResult(v1, v2, v3, v4) }).bind(this, this.props.route.params.userAnswerData, this._filterData, this._sortData, this.paging), (async (res) => {
                    var resData = res//await WhereToGoResultDAO.getWhereToGoRecommendationResult(this.props.route.params.userAnswerData, this._filterData,this._sortData,this.paging);

                    if (resData.length !== 0) {
                        for (var i = 0; i < resData.length; i++) {
                            this.renderData.push(resData[i])
                        }
                        this.pagingCounter = this.pagingCounter + resData.length
                    } else this.setState({ stopPulling: true })
                    this.setState({ loading: false })
                    console.log('DONEEE')
                }).bind(this), (() => { this.setState({ loading: false }) }), SGHelperGlobalVar.getVar("ResponTimes"));
            }
        }).bind(this), null, SGHelperGlobalVar.getVar("ResponTimes"));

    }

    constructor(props, context, ...args) {
        super(props, context, ...args);
        this.style = this.createStyleSheet(this.WHP);
        var { w, h, p } = this.WHP;
        this.props.navigation.setOptions({
            headerShown: false,
        });
        this.currentUser = SGHelperGlobalVar.getVar('GlobalCurrentUser');
        this.currentUserImage = SGHelperGlobalVar.getVar('GlobalCurrentUserImage');
        this.imageSetting = SGHelperGlobalVar.getVar('GlobalImageSetting');
        this.currentUserCurrency = SGHelperGlobalVar.getVar('GlobalCurrency');
        this.currentUserData = SGHelperGlobalVar.getVar('GlobalCurrentUserData');
        this.renderData = [];
        this._filterData = filterDAO.getWhereToGoFilterData();
        this._sortData = sortDAO.getWhereToGoSortData(this.Language.toUpperCase());
        this._buildingMatrix = [];

        // Paging
        this.state = { refresh: false, loading: false, stopPulling: false };
        this.alreadyMount = false;
        this.refresh = false
        this.pagingCounter = 0
    }

    async _setFilter(dataFilter) {
        this._filterData = dataFilter;
        await this._onRefreshAllItem(true);
    }

    _getLikeResource(data) {
        var contentBuildingID = data.fContentID;
        var contentBuildingEN = data.fContentEN;
        var contentBuildingCN = data.fContentCN;
        return (
            { fContentType: 'WhereToGo', fContentKey: data.buildingKey, fText1: { id: contentBuildingID.fBuildingName, en: contentBuildingEN.fBuildingName, cn: contentBuildingCN.fBuildingName }, fText2: { id: idJSON.city[tbLookupDAO.getLookUpValue(data.fCity)], en: enJSON.city[tbLookupDAO.getLookUpValue(data.fCity)], cn: cnJSON.city[tbLookupDAO.getLookUpValue(data.fCity)] }, fText3: { id: '', en: '', cn: '' }, fImageID: contentBuildingID.fImageJSON, fImageEN: contentBuildingEN.fImageJSON, fImageCN: contentBuildingCN.fImageJSON, fTargetKey: data.buildingKey }
        )
    }


    _getCommentResource(data) {
        var contentBuildingID = data.fContentID;
        var contentBuildingEN = data.fContentEN;
        var contentBuildingCN = data.fContentCN;
        var city = data.fCity.toLowerCase();
        return (
            {
                fUserImage: this.currentUserData.fProfileImageJSON, fContentType: 'WhereToGo', fContentKey: data.buildingKey,
                fContentName: { id: contentBuildingID.fBuildingName, en: contentBuildingEN.fBuildingName, cn: contentBuildingCN.fBuildingName },
                fContentText1: { id: SGLocalize.translate('city.'+city), en: SGLocalize.translate('city.'+city), cn: SGLocalize.translate('city.'+city) },
                fContentText2: { id: contentBuildingID.fShortDescription, en: contentBuildingEN.fShortDescription, cn: contentBuildingCN.fShortDescription },
                fContentImage: { id: contentBuildingID.fImageJSON, en: contentBuildingEN.fImageJSON, cn: contentBuildingCN.fImageJSON },
                fTargetType: 'Place', fTargetName: { id: contentBuildingID.fBuildingName, en: contentBuildingEN.fBuildingName, cn: contentBuildingCN.fBuildingName },
                fTargetImage: { id: contentBuildingID.fImageJSON, en: contentBuildingEN.fImageJSON, cn: contentBuildingCN.fImageJSON },
                fTargetKey: data.buildingKey
            }
        )
    }

    render() {
        var { w, h, p } = this.WHP;
        var style = this.style;

        return (
            <RootView dummyStatusBar dummyHeaderBar accessible={true} accessibilityLabel={'WhereToGoResultScreenRootView'} style={style.mainContainer}>
                <RibbonHeader title={SGLocalize.translate("WhereToGoResultScreen.screenTitle")}></RibbonHeader>
                {this.alreadyMount ?
                    this.renderData.length !== 0 ?
                        <FlatList refreshing={this.state.refresh} onRefresh={this._onRefresh.bind(this)} accessible={true} accessibilityLabel={'WhereToGoResultScreenList'} showsVerticalScrollIndicator={false} contentContainerStyle={{ justifyContent: 'flex-start', alignItems: 'center' }} data={this.renderData} renderItem={({ item }) => {
                            return (
                                <WhereToGoCard onLike={((item, s, c) => { console.log(item); item.fUserLikedThis = s; item.fLikeCountBuilding += c; this.forceUpdate(); }).bind(this, item)} accessible={true} accessibilityLabel={'WhereToGoResultScreenWTGiftRestoCard'} likePackage={this._getLikeResource(item)} commentPackage={this._getCommentResource(item)} key={item.buildingKey} data={item} language={this.Language} currency={this.currentUserCurrency} navigator={this.props.navigation} imageSetting={this.imageSetting} likeText={SGLocalize.translate("WhereToGoResultScreen.likeText")} contentKey={item.buildingKey} style={style.throwWHP}></WhereToGoCard>
                            )
                        }} keyExtractor={item => item.fID}
                            onEndReached={this._onLoad.bind(this)}
                            onEndReachedThreshold={SGHelperType.getThreshold()}
                            ListFooterComponent={() => {
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
                        <EmptyDetailView text={SGLocalize.translate('globalText.AliceResultNotFill')} style={style.throwWHP}></EmptyDetailView>
                    :
                    <ActivityIndicator preset={ActivityIndicator.preset.h1} style={{ flex: 1 }}></ActivityIndicator>
                }
                {/* <View style={{ width: w, height: w * 0.15,backgroundColor:'transparent'}}></View> */}
                <Animated.View style={{ position: 'absolute', transform: [{ translateY: this._baseAnimY.interpolate({ inputRange: [-1, 0], outputRange: [(SGHelperWindow.getStatusBarHeight() - SGHelperWindow.getHeaderHeight()), SGHelperWindow.getStatusBarHeight()] }) },], height: SGHelperWindow.getHeaderHeight(), width: '100%' }}>
                    <NoSortSearchBar accessible={true} accessibilityLabel={'SearchResultPlaceEventScreenFullSearchBar'} noSearch searchKeyword={this.searchKeyword} language={this.Language} onPressFilter={() => { SGHelperNavigation.navigatePush(this.props.navigation, 'Filter', { filterData: this._filterData, buildingMatrix: this._buildingMatrix, onApplyFilter: (v) => { this._setFilter(v) }, onCloseFilter: (v) => { console.log(v) } }) }} navigator={this.props.navigation} imageSetting={this.imageSetting} style={this.style.containerView1}></NoSortSearchBar>
                </Animated.View>
                <BottomNavigationContainer accessible={true} currentUser={this.currentUser} navigator={this.props.navigation} style={style.throwWHP}></BottomNavigationContainer>
            </RootView>
        );
    }
}
