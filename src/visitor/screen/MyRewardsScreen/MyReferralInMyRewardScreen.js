/**
 * 1. Yohanes 01 April 2021
 * - add ErrorHandling
 * * 2. Leon 10-11 Apr 2021
 * - add ErrorHandling
 */
import React from "react";
import { StyleSheet, Animated,SafeAreaView,Platform,Share } from "react-native";
import { SGBaseScreen } from "../../../core/screen/SGBaseScreen";
import { SGView as View, SGText as Text, SGTouchableOpacity as TouchableOpacity, SGScrollView as ScrollView, SGTabView as TabView, SGRootView, SGPicker as Picker, SGFlatList as FlatList, SGButton as Button, SGPopView, SGImage as Image, SGActivityIndicator as ActivityIndicator,SGIcon as Icon,SGDialogBox as DialogBox,SGViewPager as ViewPager } from "../../../core/control";
import { ProfileHeaderContainer } from '../../container_V2/ProfileHeaderContainer';
import Carousel from 'react-native-snap-carousel';
import { SGHelperNavigation, SGHelperGlobalVar, SGHelperWindow, SGHelperType, SGHelperErrorHandling } from '../../../core/helper';
import { SGLocalize } from '../../locales/SGLocalize';
import { tbVReferralCodeAPI } from '../../api/tbVReferralCodeAPI';
import { DefaultReferralRewardCard } from '../../container_V2/DefaultReferralRewardCard';
import { CardIconButtonShare } from '../../component_V2/CardIconButton';
import Clipboard from '@react-native-community/clipboard';
import RNFetchBlob from "react-native-blob-util";
import { BottomNavigationContainer } from '../../component_V2/BottomNavigationContainer';
import { CustomMenuBar } from '../../component_V2/CustomMenuBar';
import { EmptyDetailView } from '../../container_V2/EmptyDetailView';
import { SGHelperAPICall } from "../../../core/helper/SGHelperAPICall";
import { SearchBarNoBack } from "../../component_V2/SearchBarNoBack";
import image from '../../asset/image';
import { tbUserShareData } from '../../db/tbUserShareDAO'
import { tbVUserShareAPI } from '../../../visitor/api/tbVUserShareAPI';

export class MyReferralInMyRewardScreen extends SGBaseScreen {
    getDataFilterPresent() {
        return ([
            { name: this._language.toUpperCase(), operator: 'SEARCH', value: this.searchKeyword.keyword },
            { name: 'fType', operator: 'IN', value: null, type: 'multi', title: SGLocalize.translate('filterSubTitle.typeRewardTitle'), group: SGLocalize.translate('filterGroup.typeReward'),optionList: this.getRewardTypeFilterList(), visible: true },
            // { name: 'fStartDate', operator: '<=', value: new Date().toISOString(), visible: false }
        ]);
    }

    getRewardTypeFilterList() {
        return (
            [
                { key: 'building', title: SGLocalize.translate('filterSubTitle.typeRewardMallTitle')},
                { key: 'resto', title: SGLocalize.translate('filterSubTitle.typeRewardRestoTitle') },
                { key: 'store', title: SGLocalize.translate('filterSubTitle.typeRewardStoreTitle')}
            ]
        )
    }
    getDataSort() {
        return ([
            { name: 'rank', descending: true, title: SGLocalize.translate('sortOptions.MostRelevant'), selected: false, visible: false },
            {name:'fReferralPrice',descending: false, title: SGLocalize.translate('sortOptions.LowestReferralPrice'), selected: false,visible:true},
            {name:'fReferralPrice',descending: true, title:SGLocalize.translate('sortOptions.HighestReferralPrice'), selected: true,visible:true},
            {name:'fRewardName'+this._language.toUpperCase(),descending: false, title: SGLocalize.translate('sortOptions.ReferralNameAZ'), selected: false,visible:true},
            {name:'fRewardName'+this._language.toUpperCase(),descending: true, title: SGLocalize.translate('sortOptions.ReferralNameZA'), selected: false,visible:true},
        ])
    }

    getPagingData(){
        var itemPerPage = SGHelperType.getPaging()
        return {paging:true,offset:this.pagingCounter, totalPerPage:itemPerPage}
    }

    createStyleSheet = (whp) => {
        var { w, h, p } = whp;
        return StyleSheet.create({
            throwWHP: { width: w, height: h, padding: p },
            mainContainer: { width: w, justifyContent: 'flex-start', paddingVertical: 0,backgroundColor: '#E6E6E6' },
            myReferralHeader: { width: w, flexDirection: 'row', justifyContent: 'flex-start', marginVertical: 4 * p,paddingHorizontal:6*p },
            pointBox: { width: w - 12 * p, padding: 4 * p, borderRadius: 2 * p, backgroundColor: '#191919',marginBottom:2*p },
            pointContainer: { width: w - 12 * p, flexDirection: 'row', backgroundColor: '#191919', },
            pointSubContainer: { minWidth: w* 0.42,alignItems:'flex-start' },
            pointSubContainer2: { minWidth: w* 0.32,alignItems:'center' },
            textPoint: { color: '#FFFFFF' },
            point: { color: '#FFFFFF',alignSelf:'center',paddingRight:10*p },
            point2: { color: '#FFFFFF' },
            buttonView:{flexDirection:'row',justifyContent:'space-between', marginTop: 2 * p},
            buttonHistory: { borderColor: 'white', borderRadius: 2 * p, width: w * 0.4, borderWidth: p * 1 / 2, },
            buttonShareReferral: { borderColor: 'white', borderRadius: 2 * p, width: w * 0.38, borderWidth: p * 1 / 2},
            redeemTextTitle: { alignSelf: 'flex-start', marginLeft: 6 * p, marginTop: 8 * p, marginBottom: 4 * p },
            scV1:{width:w,marginVertical:2*p},
            iconContainer: {position:'absolute',right:0,bottom:0,flexDirection:'row',justifyContent:'center',marginRight:6*p},
            iconButton: { width: w,height:w,padding: p },
            containerView1: { width: w, padding: p, backgroundColor: 'white' },

            vPopView:{ width: w - 8 * p, height: w * 1.5, backgroundColor: 'white',justifyContent:'flex-start',borderRadius:4*p},
            vImageSlider:{ width: w-16*p, height: w * 1.25 * 9 / 16,borderRadius: p * 2, alignSelf: 'center',resizeMode:'stretch'},
            vBorderPopView:{width: w-16*p,height:w*0.55,borderWidth:p*0.1,borderRadius:4*p,justifyContent:'flex-start'},
            pageindicator:{position: 'absolute', bottom: 0 * p, flexDirection: 'row',backgroundColor:'transparent' },
            vShare:{flexDirection:'row',marginTop:6*p},
            vMyRefCode:{width:w*0.35,height:w*0.1,borderTopLeftRadius:4*p,borderBottomLeftRadius:4*p,borderTopRightRadius:0,borderBottomRightRadius:0,borderWidth:p*0.1,flexDirection:'row',justifyContent:'center',alignItems:'center'},
            vShareRef:{width:w*0.4,height:w*0.1,borderTopLeftRadius:0,borderBottomLeftRadius:0,borderTopRightRadius:4*p,borderBottomRightRadius:4*p,borderWidth:p*0.1,backgroundColor:'rgb(230,77,77)',flexDirection:'row',justifyContent:'center',alignItems:'center'},
            textPopView1:{marginTop:4*p},
            textPopView2:{paddingLeft:2*p,paddingRight:2*p,marginTop:4*p,textAlign:'center'},
            textPopView3:{paddingLeft:2*p,paddingRight:2*p,marginTop:6*p,textAlign:'center'},
            vClose: { position: 'absolute', right: 0, top: -2 },
            iconButton: { width: w,height:w,padding: p },
        });
    };

    async componentDidMount() {
        await this._onRefreshAllItem(true);
        this._unsubscribe = this.props.navigation.addListener('focus', async () => {
            await this._onRefreshAllItem();
        });    
    }

    checkAPIBatchStatusAllDone() {
        // this.pagingCounter = this.rewardList.length 
        this.alreadyMount = true;
        this.setState({ refresh: false});
        this.forceUpdate();
    
    }



    async _onRefreshAllItem(resetPaging = false) {
        this.currentUser = SGHelperGlobalVar.getVar('GlobalCurrentUser');
        this.currentUserData = SGHelperGlobalVar.getVar('GlobalCurrentUserData');
        this.imageSetting = SGHelperGlobalVar.getVar('GlobalImageSetting');
        this.currentUserImage = SGHelperGlobalVar.getVar('GlobalCurrentUserImage');

        if(resetPaging){
           
            this.pagingCounter= 0
            this.paging = this.getPagingData();
            this.filterData[0].value = this.searchKeyword.keyword
            if(this.searchKeyword.keyword != ''){
                this.sortData[0].visible = true
            }else{
                if(this.sortData[0].selected == true){
                    this.sortData[1].selected = true
                    this.sortData[0].selected = false
                    this.sortData[0].visible = false
                }
            }
            this.historySection=false
            this.activeSection=false
            this.indexHeader=[1]
            this.baseInitAPIParallel(SGHelperGlobalVar.getVar("ResponTimes"), (() => { this.checkAPIBatchStatusAllDone(); }).bind(this));

            this.baseAddAPIParallel('getUserReferralPoint', (async () => { return tbVReferralCodeAPI.getUserReferralPoint(); }).bind(this), ((v) => {
                this.myReferralPoint = v;
                
            }).bind(this),  null);

        

            this.baseAddAPIParallel('getReferralRewardList', (async (v1,v2,v3) => { return tbVReferralCodeAPI.getReferralRewardList(v1,v2,v3); }).bind(this,this.filterData,this.sortData,this.paging), ((v) => {
                this.rewardList=[]
                this.rewardList = v;
               
                if(v.length != 0){
                    if(v[0].fHistory==='N'){
                        this.activeSection=true
                        this.rewardList.unshift({fID:SGHelperType.getGUID(), headerSection:true})
                    }
                }
                this._constructHistorySection(this.rewardList)
                this.pagingCounter = v.length 
                if(v.length<SGHelperType.getPaging())this.setState({stopPulling:true})
                else this.setState({stopPulling:false})
            }).bind(this),  null);
           
            this.baseRunAPIParallel();
        }  else {
            this.forceUpdate();
        }
    }
    _constructHistorySection(rewardList){
        if(!this.historySection){
            for(var i =0;i<rewardList.length;i++){
                if(rewardList[i].fHistory==="Y"){
                    rewardList.splice(i,0,{fID:SGHelperType.getGUID(),historySection:true})
                    this.historySection=true
                    console.log(this.pagingCounter)
                    if(this.activeSection){
                        this.indexHeader=[1,  this.pagingCounter+i+1]
                    }
                    else  this.indexHeader=[1]
                    break;
                }
            }
        }
    }

    async _onLoad(){

            if(!this.state.loading && !this.state.stopPulling){
                console.log('load')
                this.setState({loading:true})
                this.paging = this.getPagingData()
                this.baseRunSingleAPIWithRedoOption('getReferralRewardList', (async (v1, v2, v3) => { return tbVReferralCodeAPI.getReferralRewardList(v1, v2, v3) }).bind(this, this.filterData,this.sortData,this.paging), ((v) => {           
                var resData =  v
                this.pagingCounter = this.pagingCounter + resData.length
                this._constructHistorySection(resData)
                if(resData.length!==0){
                    for(var i=0;i<resData.length;i++){
                        this.rewardList.push(resData[i])
                    }
                   
                } else this.setState({stopPulling:true})
                this.setState({loading:false})
            }).bind(this), (()=>{ this.setState({loading:false}) }), SGHelperGlobalVar.getVar("ResponTimes"));
        }    
    }


    componentWillUnmount() {
        if (this._unsubscribe) { this._unsubscribe(); }
    }

    constructor(props, context, ...args) {
        super(props, context, ...args);
        this.style = this.createStyleSheet(this.WHP);
        this.props.navigation.setOptions({
            headerShown: false
        });
        this.state = { active1: true, active2: false, active3: false, active4: false, active5: false, active6: false, active7: false, active8: false, active9: false, active10: false,loading:false }
        // this.onIconPress = this.onIconPress.bind(this);
        this.rewardList = [];
        this.searchKeyword = {keyword: ''};
        this.currentUser = SGHelperGlobalVar.getVar('GlobalCurrentUser');
        this.imageSetting = SGHelperGlobalVar.getVar('GlobalImageSetting');
        this.currentUserData = SGHelperGlobalVar.getVar('GlobalCurrentUserData');
        this.filterData = this.getDataFilterPresent();
        this.sortData = this.getDataSort(this.Language.toUpperCase());
        this.referral = SGHelperType.isDefined(this.props.route)?true:false
         // Paging
         this.state = {  refresh: false , refreshFlatList:false, loading:false, stopPulling:false };
         this.alreadyMount = false;
         this.refresh=false
         this.pagingCounter = 0
         this.historySection=false;
         this.activeSection=false
         this.indexHeader=[1],
         this.pvID = SGPopView.getPopViewID();
    }

    _shareMessageRefferal(){
        var referralCode =this.currentUserData.fReferralCode;
        if(this.Language == 'id'){
            var shareMessage = eval('`' +  SGHelperType.getSystemParamsValue('RefferalRewardTextID') + '`')
            return shareMessage;
        }else if (this.Language == 'en'){
            var shareMessage = eval('`' +  SGHelperType.getSystemParamsValue('RefferalRewardTextEN') + '`')
            return shareMessage;
        }else if (this.Language == 'cn'){   
            var shareMessage = eval('`' +  SGHelperType.getSystemParamsValue('RefferalRewardTextCN') + '`')
            return shareMessage;
        }
    }

    _copyKey(){
        Clipboard.setString(this.currentUserData.fReferralCode);
        setTimeout(() => {DialogBox.showToast(SGLocalize.translate('ShowToastMessage.Copied'), null)}, 300); 

    }

    async _setSort(dataSort) {
        this.sortData = dataSort;
        await this._onRefreshAllItem(true)
    }

    async _setFilter(dataFilter) {
        this.filterData = dataFilter;
        await this._onRefreshAllItem(true)
    }

    _showPopView() {
        SGPopView.showPopView(this.pvID);
    }
    
    _hidePopView() {
        SGPopView.hidePopView(this.pvID);
    }

    async _addData() {
        try {
                this.currentUser = SGHelperGlobalVar.getVar('GlobalCurrentUser');
                var userShareData = new tbUserShareData().getCurrentJSON();
                userShareData.fUserKey = this.currentUser;
                userShareData.fCreatedBy = this.currentUser;
                userShareData.fLastModifiedBy = this.currentUser;
                userShareData.fContentType = 'UserRefferal';
                userShareData.fContentKey = SGHelperType.getGUID();
                userShareData.fTargetKey = SGHelperType.getGUID();
                await tbVUserShareAPI.addUserShare(userShareData);
        } catch (error) {
            SGHelperErrorHandling.Handling(error, this._addData.bind(this))
        }

    }

    _shareReferral(){
        this._addData();
        var message =this._shareMessageRefferal()
        this.setState({ loading: true })
        Share.share({
            subject: 'Spotgue Share!',
            title: 'Share Spotgue!',
            message: message,
        }, {
            // Android only:
            dialogTitle: 'Share',
            // iOS only:
        })
    this.setState({ loading: false })
    }

    render() {
        var { w, h, p } = this.WHP;
        var style = this.style;
        var indexHeader=this.indexHeader
        return (
            <SGRootView dummyStatusBar={this.referral} accessible={true} accessibilityLabel={'MyReferralScreenRootView'} style={style.mainContainer}>
                
                <SGPopView popViewID={this.pvID}  animationType={'slide'} vPos='Top' >
                    <View style={style.vPopView}>
                        <TouchableOpacity style={style.vClose} onPress={() => { this._hidePopView() }}>
                            <Icon name={Icon.Icon.closecircle} preset={Icon.preset.h1} style={{ color: '#181818' }}></Icon>
                        </TouchableOpacity>
                        <Text preset={Text.preset.titleH2B} style={style.textPopView1}>{SGLocalize.translate('MyReferralScreen.ReferFriendText')}</Text>
                        <Image source={{ uri:image.shareReferral[this.imageSetting].url }} style={style.vImageSlider}></Image>
                        <View style={style.vBorderPopView}>
                            <Text preset={Text.preset.titleH3B} style={style.textPopView2}>{SGLocalize.translate('MyReferralScreen.ReferFriendText2')}</Text>
                            <Text preset={Text.preset.titleH3B} style={style.textPopView3}>{SGLocalize.translate('MyReferralScreen.ReferFriendText3')}</Text>
                            <View style={style.vShare}>
                                <TouchableOpacity style={style.vMyRefCode} onPress={() => {this._copyKey()}}> 
                                    <Icon preset={Icon.preset.h4} name={Icon.Icon.copy} style={{color:'rgb(230,77,77)'}}></Icon>
                                    <Text preset={Text.preset.titleH3B} style={{color:'rgb(230,77,77)'}}>{this.currentUserData.fReferralCode}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={style.vShareRef} onPress={()=>{this._shareReferral()}}> 
                                    <Icon name={Platform.OS ==='ios'? Icon.Icon.shareIOS : Icon.Icon.share} preset={Icon.preset.h4} style={{color:'white'}}></Icon>
                                    <Text preset={Text.preset.titleH3B} style={{color:'white'}}>{SGLocalize.translate('MyReferralScreen.ShareText')}</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                    
                </SGPopView>
                {
                    this.referral && 
                    <CustomMenuBar  btnBack accessible={true} accessibilityLabel={'HomeScreenHeader'} currentUser={this.currentUser} navigator={this.props.navigation} imageSetting={this.imageSetting} style={style.throwWHP}></CustomMenuBar>
                }
                {this.alreadyMount ?
                    (
                    // <View> 
                        <FlatList refreshing={this.state.refreshFlatList} stickyHeaderIndices={indexHeader} onRefresh={this._onRefreshAllItem.bind(this,true)}  accessible={true} accessibilityLabel={'SeeAllTrendingPlaceEventScreenList'} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingVertical: p, backgroundColor: 'white', justifyContent: 'flex-start', alignItems: 'center' }} data={this.rewardList} renderItem={({ item }) => {
                            if(!item.headerSection && !item.historySection){
                                return (
                                    <DefaultReferralRewardCard slider data={item} language={this.Language} imageSetting={this.imageSetting} navigator={this.props.navigation} style={style.throwWHP} myPoint={this.myReferralPoint}></DefaultReferralRewardCard>
                                    
                                );
                            }else if(item.historySection){
                                return(
                                    <View style={{backgroundColor:'black',alignItems:'center'}}><Text preset={Text.preset.titleH2B} style={{color:'white'}}>{SGLocalize.translate("MyReferralScreen.History")}</Text></View>
                                )
                            }
                            else if(item.headerSection){
                                return(
                                    <View style={{backgroundColor:'black',alignItems:'center', marginBottom: p*2}}><Text preset={Text.preset.titleH2B} style={{color:'white'}}>{SGLocalize.translate('MyReferralScreen.redeemSectionTitle')}</Text></View>
                                )
                               
                            }
                           
                        }} keyExtractor={item => item.fID} 
                        onEndReached={this._onLoad.bind(this)}
                        onEndReachedThreshold={SGHelperType.getThreshold()}
                        ListFooterComponent={()=>{
                            if( this.state.loading)return <ActivityIndicator preset={ActivityIndicator.preset.h1} style={{width:w,height:h*0.05}}></ActivityIndicator>
                            else return null
                        }}
                        // scrollEventThrottle={100} onScroll={this.baseOnScrollHandler.bind(this)} onMomentumScrollBegin={this.baseOnMomentumScrollBeginHandler.bind(this)} onScrollEndDrag={this.baseOnScrollEndDragHandler.bind(this)} onMomentumScrollEnd={this.baseOnMomentumScrollEndHandler.bind(this)} showsVerticalScrollIndicator={false}
                        ListHeaderComponent={
                            <View style={{backgroundColor:'white'}}>
                                <View style={style.myReferralHeader}>
                                    <Image style={{ backgroundColor: 'transparent' }} source={{ uri: this.currentUserData.fProfileImageJSON[0][this.imageSetting].uri }}></Image>
                                    <View style={{ justifyContent: 'flex-start', alignItems: 'flex-start' }}>
                                        <Text preset={Text.preset.titleH2}>{this.currentUserData.fName}</Text>
                                        <Text accessible={true} accessibilityLabel={'ProfileHeaderContainerUName'} preset={Text.preset.titleH3}>{SGLocalize.translate('ProfileScreen.MyReferralIDLabel')} {this.currentUserData.fReferralCode}</Text>
                                        <Text preset={Text.preset.titleH3}>{SGLocalize.translate('MyReferralScreen.joinSinceText')} {SGHelperType.formatDate(new Date(this.currentUserData.fCreatedDate), this.Language.toUpperCase())}</Text>
                                    </View>
                                </View>
                                <View style={style.pointBox}>
                                    <View style={style.pointContainer}>
                                        <View style={style.pointSubContainer}>
                                            <Text preset={Text.preset.titleH3B} style={style.textPoint}>{SGLocalize.translate('MyReferralScreen.totalAvailablePointText')}</Text>
                                            <Text preset={Text.preset.titleH3B} style={style.point}>{this.myReferralPoint.totalAvailable}</Text>
                                        </View>
                                        <View style={style.pointSubContainer2}>
                                            <Text preset={Text.preset.titleH3B} style={style.textPoint}>{SGLocalize.translate('MyReferralScreen.totalReferralText')}</Text>
                                            <Text preset={Text.preset.titleH3B} style={style.point2}>{this.myReferralPoint.total}</Text>
                                        </View>
                                    </View>
                                    <View style={style.buttonView}>
                                        <Button style={style.buttonHistory} onPress={() => this._showPopView()} textPreset={Text.preset.titleH4_5B} label={SGLocalize.translate('MyReferralScreen.shareMyReferral')}></Button>
                                        <Button style={style.buttonShareReferral} onPress={() => SGHelperNavigation.navigatePush(this.props.navigation, 'ReferralHistory')} textPreset={Text.preset.titleH4_5B} label={SGLocalize.translate('MyReferralScreen.whoReferredByMe')}></Button>
                                    </View>
                                </View>
                                {/* <Text preset={Text.preset.h4B} style={style.redeemTextTitle}>{SGLocalize.translate('MyReferralScreen.redeemSectionTitle')}</Text> */}
                                <SearchBarNoBack accessible={true} accessibilityLabel={'SearchResultPlaceScreenFullSearchBar'} searchKeyword={this.searchKeyword} language={this.Language}  sortData={this.sortData} onApplySort={(v) => { this._setSort(v) }} onPressFilter={() => { SGHelperNavigation.navigatePush(this.props.navigation, 'Filter', { filterData: this.filterData, onApplyFilter: (v) => { this._setFilter(v) }, onCloseFilter: (v) => { console.log(v) } }) }} navigator={this.props.navigation} imageSetting={this.imageSetting} style={this.style.containerView1} refresh={this._onRefreshAllItem.bind(this)}></SearchBarNoBack>
                            </View>
                        }
                        >
                        </FlatList>
                       
                    )
                    :
                    (<ActivityIndicator preset={ActivityIndicator.preset.h1} style={{ flex: 1 }}></ActivityIndicator>)
                }
                 <View style={{width:w*0.15,height:w*0.15,backgroundColor:'transparent'}}></View>
                 {
                    this.referral && 
                    <Animated.View style={{ position: 'absolute', transform: [{ translateY: this._baseAnimY.interpolate({ inputRange: [-1, 0], outputRange: [SGHelperWindow.getWHPNoHeader().h + 8 * p, SGHelperWindow.getWHPNoHeader().h - Math.max(SGHelperWindow.getFooterHeight(), 2 * p) - SGHelperWindow.getHeaderHeight()] }) },], height: Math.max(SGHelperWindow.getFooterHeight(), 2 * p) + SGHelperWindow.getHeaderHeight(), backgroundColor: 'transparent', width: '100%' }}>
                        <BottomNavigationContainer accessible={true} accessibilityLabel={'HomeScreenBottomNav'} currentUser={this.currentUser} navigator={this.props.navigation} style={style.throwWHP} screen={this.props.route.name}></BottomNavigationContainer>
                    </Animated.View>
                }
            </SGRootView>
        );
    }
}
