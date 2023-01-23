/*
Version 1.2
Adding Paging By Melvin , 29 Maret 2021
*/

import React from 'react';
import { StyleSheet, Animated,AppState } from 'react-native';
import { SGView as View, SGRootView as RootView, SGText as Text, SGIcon as Icon,SGActivityIndicator as ActivityIndicator, SGScrollview as ScrollView, SGButton as Button, SGFlatList as FlatList,SGImage as Image,SGTouchableOpacity as TouchableOpacity,SGDialogBox } from '../../../core/control';
import { BottomNavigationContainer } from '../../component_V2/BottomNavigationContainer';
import { SimpleSearchBar } from '../../component_V2/SimpleSearchBar';
import { RestoHomeHeader } from '../../container_V2/RestoHomeHeader';
import {RestoHomeNewHeader} from '../../container_V2/RestoHomeNewHeader';
import { CommentPopup } from '../../container_V2/CommentPopup';
import { SGLocalize } from '../../locales/SGLocalize';
import { SGHelperNavigation, SGHelperGlobalVar, SGHelperType, SGHelperWindow, SGHelperErrorHandling } from '../../../core/helper';
import { SGPopView } from '../../../core/control/SGPopView';
import { SGBaseScreen } from '../../../core/screen/SGBaseScreen';
import { tbWaitingListDAO, tbWaitingListData } from '../../db/tbWaitingListDAO';
import { FAB } from '../../component_V2/FAB';
import { WaitingListCard } from '../../container_V2/WaitingListCard';
import { tbVWaitingListAPI } from '../../api/tbVWaitingListAPI';
import { tbVUserCheckInAPI } from '../../api/tbVUserCheckInAPI';
import { VRestoHomeAPI } from '../../api/VRestoHomeAPI';
import { VRestoProfileAPI } from '../../api/VRestoProfileAPI';
import { VRewardAPI } from '../../api/VRewardAPI';
import {AvailableWaitingList} from '../../component_V2/AvailableWaitingList';
import { EmptyDetailView } from '../../container_V2/EmptyDetailView';
export class RestoWaitingListScreen extends SGBaseScreen {

    getFilterDataWaiting() {
        return ([
            { name: 'fStoreKey', operator: '=', value: this.restoKey, visible: false },
            { name: 'fStatus', operator: 'IN', value: ['waiting', 'called'], visible: false },
        ]);
    }

    getSortWaitingCalledData() {
        return ([
            { name: 'fBookDateTime', descending: false, selected: true, visible: false },
        ])
    }

    getPagingData(){
        var itemPerPage = SGHelperType.getPaging()
        return {paging:true,offset:this.pagingCounter, totalPerPage:itemPerPage}
    }

    createStyleSheet = (whp) => {
        var { w, h, p } = whp;

        return StyleSheet.create({
            mainView1: { width: w, height: h, backgroundColor: "white" },
            throwWHP: { width: w, height: h, padding: p },
            text1: { color: '#676464' },
            text2: { color: 'grey' },
            containerView1: { width: w, padding: p, backgroundColor: 'white' },
            containerView2: { width: w, height: w * 0.1,  flexDirection: 'row', borderTopWidth: p * 0.3, borderBottomWidth: p * 0.3, borderBottomColor: "#E4E4E4", borderTopColor: "#E4E4E4" },
            containerView2_1: { width: w * 0.3, height: w * 0.1, flexDirection: 'row', justifyContent: 'flex-start', paddingLeft: 4 * p },
            containerView2_2: { width: w * 0.2, height: w * 0.1, flexDirection: 'row', justifyContent: 'flex-start' },
            containerView2_3: { width: w * 0.5, height: w * 0.1, flexDirection: 'row', justifyContent: 'flex-end', paddingRight: 4 * p },
            containerView3: { width: w, height: h, padding: p },
            cardView: { width: w - 2 * p, padding: p },
            vfab: { backgroundColor: 'transparent', width: w * 0.2, height: w * 0.2, position: 'absolute', bottom: SGHelperWindow.getFooterHeight() + SGHelperWindow.getHeaderHeight() - 2*p, right: w * 0.015, borderRadius: w * 0.6 },
        });
    }

    constructor(props, context, ...args) {
        super(props, context, ...args);
        this.style = this.createStyleSheet(this.WHP);
        this.waitingListData = [];
        this.currentUser = SGHelperGlobalVar.getVar('GlobalCurrentUser');
        this.currentUserData = SGHelperGlobalVar.getVar('GlobalCurrentUserData');
        this.imageSetting = SGHelperGlobalVar.getVar('GlobalImageSetting');
        this.currentUserImage = SGHelperGlobalVar.getVar('GlobalCurrentUserImage');
        this.currency = SGHelperGlobalVar.getVar('GlobalCurrency');
        this.profileResto = '';
        this.restoKey = this.props.route.params.restoKey;
        this._filterDataWaiting = this.getFilterDataWaiting();
        this._sortDataWaiting = this.getSortWaitingCalledData();
       
        this.restoHeaderData = '';
        this.resultRefreshTime = 0;
        this.animFlag = false;
       
        this.surpriseReward = { fID: null, fRewardID: { fTargetName: '', fShortDescription: '', fImageJSON: [] }, fRewardEN: { fTargetName: '', fShortDescription: '', fImageJSON: [] }, fRewardCN: { fTargetName: '', fShortDescription: '', fImageJSON: [] } }
        this.pvID = SGPopView.getPopViewID();
        this.props.navigation.setOptions({
            headerShown: false,
        });

         // Paging
         this.state = { appState: AppState.currentState ,refresh: false, loading:false, stopPulling:false , refreshTime: '', filterWaiting: this._filterDataWaiting, sortWaiting: this._sortDataWaiting };
         this.alreadyMount = false;
         this.refresh=false
         this.pagingCounter = 0
         this.canWaitingList = false;
    }

    async componentDidMount() {
        await this._onSearchingItem(true);
        if (!this.animFlag) { setTimeout(() => { this.animFlag = true; this.baseCreateAnimation(500, null); }, 1000); }
        this._unsubscribe = this.props.navigation.addListener('focus', async () => {
            await this._onSearchingItem();

            AppState.addEventListener('change', this._handleAppStateChange);
            //check apps still active or not

            if (this.state.appState === "active") {
            this.interval = setInterval(async () => {
                await this._onSearchingItem();
                if (!this.animFlag) { setTimeout(() => { this.animFlag = true; this.baseCreateAnimation(500, null); }, 1000); }
            }, SGHelperType.getSysParamsValueToInt('RestoWaitingListScreenInterval1'));
            }
        });
    }

    _handleAppStateChange = (nextAppState) => {
        if (
            this.state.appState.match(/inactive|background/) &&
            nextAppState === 'active'
        ) {
            console.log('App has come to the foreground!');
        }
        this.setState({ appState: nextAppState });
        
    };


    _componentWillUnmount() {
        AppState.removeEventListener('change', this._handleAppStateChange);
        clearInterval(this.interval);
        if (this._unsubscribe) { this._unsubscribe(); }
    }

    async _callBackForceUpdate() {
        await this._onSearchingItem(true);
    }

    _checkRefreshTime() {
        var dateNow = Date.parse(new Date());
        var refreshDate = Date.parse((this.state.refreshTime));
        this.resultRefreshTime = Math.abs((Math.round(dateNow - refreshDate) / 60000).toFixed(0));
    }

    checkAPIBatchStatusAllDone() {
  
        this.pagingCounter = this.waitingListData.length
        this._checkCanAddWaitingList();
        this.alreadyMount = true;
        this.setState({ refresh: false,stopPulling:false });
        this.forceUpdate();

    }

    async _onSearchingItem(resetPaging = false) {
        
        if(resetPaging){
            this.setState({ refresh: true })
            this.pagingCounter= 0
            this.paging = this.getPagingData()

            this.baseInitAPIParallel( SGHelperGlobalVar.getVar("ResponTimes"), (() => { this.checkAPIBatchStatusAllDone(); }).bind(this));
      
            this.baseAddAPIParallel('getRestoHomeProfile', (async (v1) => { return VRestoProfileAPI.getRestoHomeProfile(v1) }).bind(this,this.restoKey), ((v) => {
                this.profileResto = v;     
            }).bind(this), null);
            this.baseAddAPIParallel('searchWaitingListVisitor', (async (v1,v2,v3) => { return tbVWaitingListAPI.searchWaitingListVisitor(v1,v2,v3) }).bind(this,this._filterDataWaiting, this._sortDataWaiting,this.paging), ((v) => {
                this.waitingListData = v; 
                if(v.length<SGHelperType.getPaging())this.setState({stopPulling:true})
                else this.setState({stopPulling:false})    
            }).bind(this), null);
            this.baseAddAPIParallel('CheckUserCheckInHere', (async (v1) => { return tbVUserCheckInAPI.CheckUserCheckInHere(v1) }).bind(this,this.restoKey), ((v) => {
                this.isAlreadyCheckIn = v;     
            }).bind(this), null);
            this.baseAddAPIParallel('getRestoSettings', (async (v1) => { return VRestoHomeAPI.getRestoSettings(v1) }).bind(this,this.restoKey), ((v) => {
                this.restoSettingsData = v;     
            }).bind(this), null);
            this.baseAddAPIParallel('getRestoHomeHeader', (async (v1) => { return VRestoHomeAPI.getRestoHomeHeader(v1) }).bind(this,this.restoKey), ((v) => {
                this.restoHeaderData = v;     
            }).bind(this), null);
            this.baseRunAPIParallel()
        }
    }

    async _onLoad(){
        if(!this.state.loading && !this.state.stopPulling){
            this.setState({loading:true})
            this.paging = this.getPagingData()
            this.baseRunSingleAPIWithRedoOption('searchWaitingListVisitor', (async (v1,v2,v3) => { return tbVWaitingListAPI.searchWaitingListVisitor(v1,v2,v3) }).bind(this,this._filterDataWaiting, this._sortDataWaiting,this.paging), ((v) => {
                var resData = v // await tbVWaitingListAPI.searchWaitingListVisitor(this._filterDataWaiting, this._sortDataWaiting,this.paging);
                if(resData.length!==0){
                    for(var i=0;i<resData.length;i++){
                        this.waitingListData.push(resData[i])
                    }
                    this.pagingCounter = this.pagingCounter + resData.length
                } else this.setState({stopPulling:true})
                this.setState({loading:false})
            }).bind(this), null,  SGHelperGlobalVar.getVar("ResponTimes"));
        }
    }

    async _refreshDataWaitingList() {
        this.setState({ refresh: true ,stopPulling:false})
        if(!this.refresh){
            this.refresh = true;
            this.pagingCounter = 0;
            this.paging = this.getPagingData();
            this.baseRunSingleAPIWithRedoOption('searchWaitingListVisitor', (async (v1,v2,v3) => { return tbVWaitingListAPI.searchWaitingListVisitor(v1,v2,v3) }).bind(this,this._filterDataWaiting, this._sortDataWaiting,this.paging), ((v) => {
                this.waitingListData = v //await tbVWaitingListAPI.searchWaitingListVisitor(this._filterDataWaiting, this._sortDataWaiting,this.paging);
                this.pagingCounter = this.waitingListData.length;
                if(v.length<SGHelperType.getPaging())this.setState({stopPulling:true})
                else this.setState({stopPulling:false})
                this.refresh = false;
                this.setState({ refreshTime: new Date(), filterWaiting: this._filterDataWaiting, sortWaiting: this._sortDataWaiting ,refresh:false});
                this._checkRefreshTime();
                this.forceUpdate();
            }).bind(this), null,  SGHelperGlobalVar.getVar("ResponTimes"));
        }
    }

    showPopView(args) {
        SGPopView.showPopView(args[0]);
    }

    _addWatingListPress() {
        if(this.canWaitingList) SGHelperNavigation.navigatePush(this.props.navigation, "AddWaitingList", { callback: this._callBackForceUpdate.bind(this), restoKey: this.restoKey })
        else SGDialogBox.showWarning(null, SGLocalize.translate("AlertMessage.Fail"), SGLocalize.translate("AlertMessage.FailAddWaitingListClose"), SGLocalize.translate("AlertMessage.OK"), () => { }, true)
    }

    _onCardPress(data) {
        var tempData = (new tbWaitingListData(data)).cloneData();
        SGHelperNavigation.navigatePush(this.props.navigation, "ViewWaitingList", { data: tempData, callback: this._callBackForceUpdate.bind(this), restoKey: this.restoKey, profileResto: this.profileResto, dataSetting: this.restoSettingsData })
    }

    async _refresh() {
        try {
            this.isAlreadyCheckIn = await tbVUserCheckInAPI.CheckUserCheckInHere(this.restoKey);
            this.forceUpdate();
        } catch (error) {
            SGHelperErrorHandling.Handling(error,this._refresh.bind(this))
        }

    }

    async _SurpriseRewardCheckInStore() {
        try {
            if (!SGHelperGlobalVar.getVar('GlobalAnonymous')) {
                this.surpriseReward = await VRewardAPI.SurpriseRewardCheckInStore(this.restoKey)
                if (this.surpriseReward.fID !== null) {
                    this.onShowReward()
                } else this.surpriseReward = { fID: null, fRewardID: { fTargetName: '', fShortDescription: '', fImageJSON: [] }, fRewardEN: { fTargetName: '', fShortDescription: '', fImageJSON: [] }, fRewardCN: { fTargetName: '', fShortDescription: '', fImageJSON: [] } }
            }
        } catch (error) {
            SGHelperErrorHandling.Handling(error,this._SurpriseRewardCheckInStore.bind(this))
        }


    }
    async _SurpriseRewardLikeTenant(restoKey) {
        try {
            if (!SGHelperGlobalVar.getVar('GlobalAnonymous')) {
                this.surpriseReward = await VRewardAPI.SurpriseRewardLikeStore(restoKey)
                
                if (this.surpriseReward.fID !== null) {
                    this.onShowReward()
                } else this.surpriseReward = { fID: null, fRewardID: { fTargetName: '', fShortDescription: '', fImageJSON: [] }, fRewardEN: { fTargetName: '', fShortDescription: '', fImageJSON: [] }, fRewardCN: { fTargetName: '', fShortDescription: '', fImageJSON: [] } }
            }
        } catch (error) {
            SGHelperErrorHandling.Handling(error,this._SurpriseRewardLikeTenant.bind(this,restoKey))
        }
 
    }
    onHideReward() {
        SGPopView.hidePopView(this.pvID);
    }
    onShowReward() {
        this.forceUpdate();
        SGPopView.showPopView(this.pvID);
    }

    _constructDay(Day){
            if(Day ==0){
                return 6
            }else if(Day==1){
                return 0
            }else if(Day ==2){
                return 1
            }else if(Day ==3){
                return 2
            }else if(Day ==4){
                return 3
            }else if(Day ==5){
                return 4
            }else if(Day ==6){
                return 5
            }
        }

    _checkCanAddWaitingList(){
        var data = this.profileResto.opHours
        console.log(data);
        var time = SGHelperType.formatTime(SGHelperType.convertNewDate(new Date()));
        var getDay =new Date().getDay();
        var Day = this._constructDay(getDay);
        if (Day == 0) {
            if (time >= SGHelperType.formatTime(SGHelperType.convertNewDate(data[0].openTime)) && time <= SGHelperType.formatTime(SGHelperType.convertNewDate(data[0].closeTime)) && data[0].fActive === 'Y') {
                console.log('0')
                return this.canWaitingList = true;
            }
        } if (Day == 1) {
            if (time >= SGHelperType.formatTime(SGHelperType.convertNewDate(data[1].openTime)) && time <= SGHelperType.formatTime(SGHelperType.convertNewDate(data[1].closeTime)) && data[1].fActive === 'Y') {
                console.log('1')
                return this.canWaitingList = true;
            }
        } if (Day == 2) {
            if (time >= SGHelperType.formatTime(SGHelperType.convertNewDate(data[2].openTime)) && time <= SGHelperType.formatTime(SGHelperType.convertNewDate(data[2].closeTime)) && data[2].fActive === 'Y') {
                console.log('2')
                return this.canWaitingList = true;
            }
        } if (Day == 3) {
            if (time >= SGHelperType.formatTime(SGHelperType.convertNewDate(data[3].openTime)) && time <= SGHelperType.formatTime(SGHelperType.convertNewDate(data[3].closeTime)) && data[3].fActive === 'Y') {
                console.log('3')
                return this.canWaitingList = true;
            }
        }
        if (Day == 4) {
            if (time >= SGHelperType.formatTime(SGHelperType.convertNewDate(data[4].openTime)) && time <= SGHelperType.formatTime(SGHelperType.convertNewDate(data[4].closeTime)) && data[4].fActive === 'Y') {
                return this.canWaitingList = true;
            }
        } if (Day == 5) {
            if (time >= SGHelperType.formatTime(SGHelperType.convertNewDate(data[5].openTime)) && time <= SGHelperType.formatTime(SGHelperType.convertNewDate(data[5].closeTime)) && data[5].fActive === 'Y') {
                return this.canWaitingList = true;
            }
        } if (Day == 6) {
            if (time >= SGHelperType.formatTime(SGHelperType.convertNewDate(data[6].openTime)) && time <= SGHelperType.formatTime(SGHelperType.convertNewDate(data[6].closeTime)) && data[6].fActive === 'Y') {
                return this.canWaitingList = true;
            }
        }
    }
    render() {
        var { w, h, p } = this.WHP;
        var style = this.style;
        var tR = SGLocalize.translate;
        var language = this.Language.toUpperCase()
        var surpriseReward = this.surpriseReward;
      
        return (
            <RootView dummyStatusBar  accessible={true} accessibilityLabel={'RestoWaitingListScreenRootView'} style={style.mainView1}>
                <SGPopView accessible={true} accessibilityLabel={'RestoWaitingListScreenPopView'} vPos={'Top'} modal popViewID={this.pvID1}>
                    <CommentPopup accessible={true} accessibilityLabel={'RestoWaitingListScreenCommentPopup'} popViewID={this.pvID1} style={style.throwWHP}></CommentPopup>
                </SGPopView>
                <SGPopView accessible={true} accessibilityLabel={'MallHomeScreenPopView'} vPos={'Top'} animationType={'slideUp'} modal popViewID={this.pvID} >
                    <View accessible={true} accessibilityLabel={'MallHomeScreenRewardView'} style={style.rewardPV}>
                        <View accessible={true} accessibilityLabel={'MallHomeScreenHeaderRewardView'} style={style.headerPV}>
                            <Text accessible={true} accessibilityLabel={'MallHomeScreenCongratsText'} style={style.textPV1} preset={Text.preset.titleH2B}>{tR('mallHomeScreen.RewardCongratulation')}</Text>
                            <Text accessible={true} accessibilityLabel={'MallHomeScreenRewardText'} style={style.textPV2} preset={Text.preset.titleH4_5B}>{tR('mallHomeScreen.RewardText')} {surpriseReward['fReward' + language].fTenantName}</Text>
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
                {this.alreadyMount ?
               <View style={{flex:1}}>
                <RestoHomeNewHeader noCheckButton animVar={this._baseAnimVar} accessible={true} accessibilityLabel={'RestoWaitingList'} isAlreadyCheckIn={this.isAlreadyCheckIn} currentUserData={this.currentUserData} language={this.Language} imageSetting={this.imageSetting} selectedResto={this.restoKey} refresh={this._refresh.bind(this)} currentUserImage={this.currentUserImage} screen='RestoProfile' navigator={this.props.navigation} headerData={this.restoHeaderData} style={style.throwWHP} checkInReward={async () => await this._SurpriseRewardCheckInStore()} likeTenantGetReward={async () => await this._SurpriseRewardLikeTenant(this.restoKey)} fullData={this.profileResto}></RestoHomeNewHeader>
                <View accessible={true} accessibilityLabel={'RestoWaitingListScreenLastUpdateView'} style={style.containerView2}>
                    <View accessible={true} accessibilityLabel={'RestoWaitingListScreenDateView'} style={style.containerView2_1}>
                        <Text accessible={true} accessibilityLabel={'RestoWaitingListScreenDateText'} preset={Text.preset.titleH3} style={style.text1}>{SGHelperType.formatDate(new Date(), this._language)}</Text>
                    </View>
                    <View accessible={true} accessibilityLabel={'RestoWaitingListScreenTimeView'} style={style.containerView2_2}>
                        <Text accessible={true} accessibilityLabel={'RestoWaitingListScreenTimeText'} preset={Text.preset.titleH3} style={style.text1}>{SGHelperType.formatTime(new Date(), this._language)}</Text>
                    </View>
                    <View accessible={true} accessibilityLabel={'RestoWaitingListScreenLUTextView'} style={style.containerView2_3}>
                        <AvailableWaitingList accessible={true} accessibilityLabel={'RestoWaitingListScreenAvailable'} style={style.throwWHP}></AvailableWaitingList>
                    </View>
                </View>
                <FlatList refreshing={this.state.refresh} onRefresh={this._refreshDataWaitingList.bind(this)} accessible={true} accessibilityLabel={'RestoWaitingListScreenCardList'} contentContainerStyle={{ justifyContent: 'flex-start', alignItems: 'center' }} data={this.waitingListData} renderItem={({ item, index }) => {
                    return (
                        <WaitingListCard restoSettingData={this.restoSettingsData} accessible={true} accessibilityLabel={'RestoWaitingListScreenWLCard'} style={style.cardView} language={this._language} number={index + 1} data={item} currentUser={this.currentUserData} imageSetting={this.imageSetting} onPress={this._onCardPress.bind(this, item)}></WaitingListCard>
                    );
                }} keyExtractor={item => item.fID}
                onEndReached={this._onLoad.bind(this)}
                onEndReachedThreshold={SGHelperType.getThreshold()}
                ListFooterComponent={()=>{
                    if( this.state.loading)return <ActivityIndicator preset={ActivityIndicator.preset.h1} style={{width:w,height:h*0.05}}></ActivityIndicator>
                    else return null
                }}
                ListEmptyComponent={()=>{
                    return <View style={{width:w,height:h*0.6,flex:1}}>
                            <Text  preset={Text.preset.titleH2} style={{alignSelf:'center'}}>{SGLocalize.translate('tabWaitingList.notActiveWLText')}</Text>
                    </View>
                }}
                >
                </FlatList>
                 <View style={{width:w,height:w*0.15,backgroundColor:'transparent'}}></View>
                <TouchableOpacity accessible={true} accessibilityLabel={'HomeScreenFABFavView'} style={style.vfab} onPress={this._addWatingListPress.bind(this)}>
                    <Icon name={Icon.Icon.plus} preset={Icon.preset.w7} style={{color:'rgba(38,38,38,0.85)'}}></Icon>
                </TouchableOpacity>
                </View>
                 :(<ActivityIndicator preset={ActivityIndicator.preset.h1} style={{ flex: 1 }}></ActivityIndicator>)
                }
                <Animated.View style={{ position: 'absolute', transform: [{ translateY: this._baseAnimY.interpolate({ inputRange: [-1, 0], outputRange: [(SGHelperWindow.getStatusBarHeight() - SGHelperWindow.getHeaderHeight()), SGHelperWindow.getStatusBarHeight()] }) },], height: SGHelperWindow.getHeaderHeight(), width: '100%' }}>
                    <SimpleSearchBar accessible={true} accessibilityLabel={'RestoWaitingListScreenSimpleSearchBar'} imageSetting={this.imageSetting} navigator={this.props.navigation} placeholder={SGLocalize.translate("restoHomeScreen.searchPlaceholder")} style={this.style.containerView1}></SimpleSearchBar>
                </Animated.View>
                <Animated.View style={{ position: 'absolute', transform: [{ translateY: this._baseAnimY.interpolate({ inputRange: [-1, 0], outputRange: [SGHelperWindow.getWHPNoHeader().h + 8 * p, SGHelperWindow.getWHPNoHeader().h - Math.max(SGHelperWindow.getFooterHeight(), 2 * p) - SGHelperWindow.getHeaderHeight()] }) },], height: Math.max(SGHelperWindow.getFooterHeight(), 2 * p) + SGHelperWindow.getHeaderHeight(), width: '100%' }}>
                    <BottomNavigationContainer accessible={true} accessibilityLabel={'RestoWaitingListScreenBottomNav'} blackTheme navigator={this.props.navigation} style={style.containerView3}></BottomNavigationContainer>
                </Animated.View>
            </RootView>
        );
    }
}