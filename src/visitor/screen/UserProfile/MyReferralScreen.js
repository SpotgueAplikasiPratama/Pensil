// /*
// * 1. Leon 12 Apr 2021
// * - add ErrorHandling
// */
// import React from "react";
// import { StyleSheet,Animated } from "react-native";
// import { SGBaseScreen } from "../../../core/screen/SGBaseScreen";
// import { SGView as View, SGText as Text, SGTouchableOpacity as TouchableOpacity, SGScrollView as ScrollView, SGTabView as TabView, SGRootView, SGPicker as Picker, SGFlatList as FlatList, SGButton as Button, SGPopView, SGImage as Image, SGActivityIndicator as ActivityIndicator,SGIcon as Icon,SGDialogBox as DialogBox } from "../../../core/control";
// import { ProfileHeaderContainer } from '../../container_V2/ProfileHeaderContainer';
// import Carousel from 'react-native-snap-carousel';
// import { SGHelperNavigation, SGHelperGlobalVar, SGHelperWindow, SGHelperType ,SGHelperErrorHandling} from '../../../core/helper';
// import { SGLocalize } from '../../locales/SGLocalize';
// import { CarouselRewardCard } from '../../container_V2/CarouselRewardCard';
// import { tbVReferralCodeAPI } from '../../api/tbVReferralCodeAPI';
// import { BottomNavigationContainer } from '../../component_V2/BottomNavigationContainer';
// import { CustomMenuBar } from '../../component_V2/CustomMenuBar';
// import { DefaultReferralRewardCard } from '../../container_V2/DefaultReferralRewardCard';
// import { CardIconButtonShare } from '../../component_V2/CardIconButton';
// import Clipboard from '@react-native-community/clipboard';

// export class MyReferralScreen extends SGBaseScreen {

//     getDataFilter() {
//         return ([
//             { name: 'fStartDate', operator: '<=', value: new Date().toISOString(), visible: false },
//         ]);
//     }

//     getDataSort(language) {
//         return ([
//             {name:'fLikeCountType',descending: true,selected: true,visible:false},
//             {name:'fTenantName'+language,descending: false, selected: true, visible: false},
//             {name: 'fID', descending: true, selected: true, visible: false }
//         ])
//     }

//     getPagingData(){
//         var itemPerPage = SGHelperType.getPaging()
//         return {paging:true,offset:this.pagingCounter, totalPerPage:itemPerPage}
//     }

//     createStyleSheet = (whp) => {
//         var { w, h, p } = whp;
//         return StyleSheet.create({
//             throwWHP: { width: w, height: h, padding: p },
//             mainContainer: { width: w, justifyContent: 'flex-start', paddingVertical: 0 },
//             myReferralHeader: { width: w - 12 * p, flexDirection: 'row', justifyContent: 'flex-start', marginVertical: 4 * p },
//             pointBox: { width: w - 12 * p, padding: 4 * p, borderRadius: 2 * p, backgroundColor: '#191919', },
//             pointContainer: { width: w - 12 * p, flexDirection: 'row', backgroundColor: '#191919', },
//             pointSubContainer: { width: (w - 12 * p) * 0.5 },
//             textPoint: { color: '#FFFFFF' },
//             point: { color: '#FFFFFF' },
//             buttonHistory: { borderColor: 'white', borderRadius: 2 * p, width: w * 0.8, marginTop: 2 * p, borderWidth: p * 1 / 2, paddingVertical: 1.5 * p, paddingHorizontal: p },
//             redeemTextTitle: { alignSelf: 'flex-start', marginLeft: 6 * p, marginTop: 8 * p, marginBottom: 4 * p },
//             scV1:{width:w,marginVertical:2*p},
//             iconContainer: {position:'absolute',right:0,bottom:0,flexDirection:'row',justifyContent:'center'},
//             iconButton: { width: w,height:w,padding: p },
//         });
//     };

//     async componentDidMount() {
//         await this._onRefreshAllItem(true);
//         this._unsubscribe = this.props.navigation.addListener('focus', async () => {
//             await this._onRefreshAllItem(true);
//         });
//     }

//     checkAPIBatchStatusAllDone(resetPaging) {
//         this.counterBatch=0
//         this.pagingCounter = this.rewardList.length
//         this.alreadyMount = true;
//         this.setState({ refresh: false });
//         this.forceUpdate();
//     }

//     async _onRefreshAllItem(resetPaging = false) {
//         this.currentUser = SGHelperGlobalVar.getVar('GlobalCurrentUser');
//         this.currentUserData = SGHelperGlobalVar.getVar('GlobalCurrentUserData');
//         this.imageSetting = SGHelperGlobalVar.getVar('GlobalImageSetting');
//         this.currentUserImage = SGHelperGlobalVar.getVar('GlobalCurrentUserImage');
       
//         if(resetPaging){
//             this.setState({ refresh: true })
//             this.pagingCounter= 0
//             this.paging = this.getPagingData()

//             this.baseInitAPIParallel(SGHelperGlobalVar.getVar("ResponTimes"), (() => { this.checkAPIBatchStatusAllDone(); }).bind(this));

//             this.baseAddAPIParallel('getUserReferralPoint', (async () => { return tbVReferralCodeAPI.getUserReferralPoint(); }).bind(this), ((v) => {
//                 this.myReferralPoint = v;
//             }).bind(this),  null);

//             this.baseAddAPIParallel('getReferralRewardList', (async (v1,v2,v3) => { return tbVReferralCodeAPI.getReferralRewardList(v1,v2,v3); }).bind(this, this.filterData,this.sortData,this.paging), ((v) => {
//                 this.rewardList=[]
//                 this.rewardList = v;
//                 this.rewardList.unshift({headerSection:true})
//                 this._constructHistorySection(this.rewardList)
//             }).bind(this),  null);
               
//             this.baseRunAPIParallel();

//         } else {
//             this.forceUpdate();
//         }
//     }
//     _constructHistorySection(rewardList){
//         if(!this.historySection){
//             for(var i =0;i<rewardList.length;i++){
//                 if(rewardList[i].fHistory==="N"){
//                     rewardList.splice(i,0,{historySection:true})
//                     this.historySection=true
//                     this.indexHeader=[1,i+1]
//                     break;
//                 }
//             }
//         }
//     }

//     async _onLoad(){
//             if(!this.state.loading && !this.state.stopPulling){
            
//                 this.setState({loading:true})
//                 this.paging = this.getPagingData()

//                 this.baseRunSingleAPIWithRedoOption('getReferralRewardList', (async (v1, v2, v3) => {  return tbVReferralCodeAPI.getReferralRewardList(v1, v2, v3) }).bind(this, this.filterData,this.sortData,this.paging), ((v) => {           
//                     var resData = v// await tbVReferralCodeAPI.getReferralRewardList(this.filterData,this.sortData,this.paging);
//                     this._constructHistorySection(resData)
//                     if(resData.length!==0){
//                         for(var i=0;i<resData.length;i++){
//                             this.rewardList.push(resData[i])
//                         }
//                         this.pagingCounter = this.pagingCounter + resData.length
//                     } else this.setState({stopPulling:true})

//                     this.setState({loading:false})
//                 }).bind(this), (()=>{   this.setState({loading:false}) }), SGHelperGlobalVar.getVar("ResponTimes"));
//             }
       
//     }


//     componentWillUnmount() {
//         if (this._unsubscribe) { this._unsubscribe(); }
//     }

//     constructor(props, context, ...args) {
//         super(props, context, ...args);
//         this.style = this.createStyleSheet(this.WHP);
//         this.props.navigation.setOptions({
//             headerShown: false
//         });
//         this.state = { active1: true, active2: false, active3: false, active4: false, active5: false, active6: false, active7: false, active8: false, active9: false, active10: false }
//         // this.onIconPress = this.onIconPress.bind(this);
//         this.rewardList = [];
//         this.currentUser = SGHelperGlobalVar.getVar('GlobalCurrentUser');
//         this.imageSetting = SGHelperGlobalVar.getVar('GlobalImageSetting');
//         this.currentUserData = SGHelperGlobalVar.getVar('GlobalCurrentUserData');
//         this.filterData = this.getDataFilter();
//         this.sortData = this.getDataSort(this.Language.toUpperCase());

//          // Paging
//          this.state = {  refresh: false ,refreshFlatList:false, loading:false, stopPulling:false };
//          this.alreadyMount = false;
//          this.refresh=false
//          this.pagingCounter = 0
//          this.counterBatch=0
//          this.errorBatch = []
//          this.indexHeader=[1]
//     }

// _shareMessageRefferal(){
//     var linkIOS =SGHelperType.getSystemParamsValue('LinkAppStore');
//     var linkAndroid =SGHelperType.getSystemParamsValue('LinkPlayStore');
//     if(this.Language == 'id'){
//         return SGHelperType.getSystemParamsValue('RefferalRewardText1ID')+' '+SGHelperType.getSystemParamsValue('RefferalRewardText2ID')+ '\n' +"dan masukin kode referral aku: " +this.currentUserData.fReferralCode + ' '+ '\n'+ SGHelperType.getSystemParamsValue('RefferalRewardText3ID')
//     }else if (this.Language == 'en'){
//         return SGHelperType.getSystemParamsValue('RefferalRewardText1EN')+' '+SGHelperType.getSystemParamsValue('RefferalRewardText2EN')+ '\n' +"and use my refferal code: " +this.currentUserData.fReferralCode + ' '+ '\n'+SGHelperType.getSystemParamsValue('RefferalRewardText3EN')
//     }else if (this.Language == 'cn'){
//         return SGHelperType.getSystemParamsValue('RefferalRewardText1CN')+' '+SGHelperType.getSystemParamsValue('RefferalRewardText2CN')+ '\n' +"并使用我的推荐代码: " +this.currentUserData.fReferralCode + ' '+ '\n'+SGHelperType.getSystemParamsValue('RefferalRewardText3CN')
//     }
// }

//     _copyKey(){
//         Clipboard.setString(this.currentUserData.fReferralCode);
//         setTimeout(() => {DialogBox.showToast(SGLocalize.translate('ShowToastMessage.Copied'), null)}, 300); 

//     }

//     render() {
//         var { w, h, p } = this.WHP;
//         var style = this.style;
//         var indexHeader=this.indexHeader
//         console.log('my Refferal Screen')
//         return (
//             <SGRootView dummyStatusBar  accessible={true} accessibilityLabel={'MyReferralScreenRootView'} style={style.mainContainer}>
//                   <CustomMenuBar btnBack accessible={true} accessibilityLabel={'HomeScreenHeader'} currentUser={this.currentUser} navigator={this.props.navigation} imageSetting={this.imageSetting} style={style.throwWHP}></CustomMenuBar>
//                 {this.alreadyMount ?
                    
//                     <View> 
//                         <FlatList stickyHeaderIndices={indexHeader} refreshing={this.state.refreshFlatList} onRefresh={this._onRefreshAllItem.bind(this,true)} accessible={true} accessibilityLabel={'SeeAllTrendingPlaceEventScreenList'} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingVertical: p, backgroundColor: 'white', justifyContent: 'flex-start', alignItems: 'center', paddingBottom: SGHelperWindow.getFooterHeight() + SGHelperWindow.getHeaderHeight() }} data={this.rewardList} renderItem={({ item }) => {
                           
//                            if(!item.headerSection && !item.historySection){
//                                 return (
//                                     <DefaultReferralRewardCard data={item} language={this.Language} imageSetting={this.imageSetting} navigator={this.props.navigation} style={style.throwWHP}></DefaultReferralRewardCard>
//                                 );
//                            }
//                             else if(item.historySection){
//                                 return(
//                                     <View style={{backgroundColor:'black',alignItems:'flex-start',paddingLeft:5*p}}><Text preset={Text.preset.h3B} style={{color:'white'}}>{SGLocalize.translate("MyReferralScreen.History")}</Text></View>
//                                 )
//                             }
//                             else if(item.headerSection){
//                                 return(
//                                     <View style={{backgroundColor:'black',alignItems:'flex-start',paddingLeft:5*p}}><Text preset={Text.preset.h3B} style={{color:'white'}}>{SGLocalize.translate("MyReferralScreen.OnGoing")}</Text></View>
//                                 )
                               
//                             }
//                         }} keyExtractor={item => item.key} 
//                         onEndReached={this._onLoad.bind(this)}
//                         onEndReachedThreshold={SGHelperType.getThreshold()}
//                         ListFooterComponent={()=>{
//                             if( this.state.loading)return <ActivityIndicator preset={ActivityIndicator.preset.h1} style={{width:w,height:h*0.05}}></ActivityIndicator>
//                             else return null
//                         }}
//                         scrollEventThrottle={100} onScroll={this.baseOnScrollHandler.bind(this)} onMomentumScrollBegin={this.baseOnMomentumScrollBeginHandler.bind(this)} onScrollEndDrag={this.baseOnScrollEndDragHandler.bind(this)} onMomentumScrollEnd={this.baseOnMomentumScrollEndHandler.bind(this)} showsVerticalScrollIndicator={false}
//                         ListHeaderComponent={
//                             <View style={{backgroundColor:'white'}}>
//                                 <View style={style.myReferralHeader}>
//                                     <Image style={{ backgroundColor: 'transparent' }} source={{ uri: this.currentUserData.fProfileImageJSON[0][this.imageSetting].uri }}></Image>
//                                     <View style={{ justifyContent: 'flex-start', alignItems: 'flex-start' }}>
//                                         <Text preset={Text.preset.h5}>{this.currentUserData.fName}</Text>
//                                         <Text accessible={true} accessibilityLabel={'ProfileHeaderContainerUName'} style={style.nameText} preset={Text.preset.heading7}>{SGLocalize.translate('ProfileScreen.MyReferralIDLabel')} {this.currentUserData.fReferralCode}</Text>
//                                         <Text preset={Text.preset.heading7}>{SGLocalize.translate('MyReferralScreen.joinSinceText')} {SGHelperType.formatDate(new Date(this.currentUserData.fCreatedDate), this.Language.toUpperCase())}</Text>
//                                     </View>
//                                     <View style={style.iconContainer}>
//                                         <TouchableOpacity onPress={() => {this._copyKey()}}>
//                                                 <Icon preset={Icon.preset.h3} name={Icon.Icon.copy} style={style.vIC1}></Icon>
//                                         </TouchableOpacity>
//                                         <CardIconButtonShare accessible={true} accessibilityLabel={'UserProfileShareIconButton'} textColor='white' navigator={this.props.navigation} contentType='UserRefferal' contentKey={SGHelperType.getGUID()} shareMessage={this._shareMessageRefferal()} targetKey={SGHelperType.getGUID()} type={'share'} style={style.iconButton}></CardIconButtonShare>
//                                     </View>
//                                 </View>
//                                 <View style={style.pointBox}>
//                                     <View style={style.pointContainer}>
//                                         <View style={style.pointSubContainer}>
//                                             <Text preset={Text.preset.h6B} style={style.textPoint}>{SGLocalize.translate('MyReferralScreen.totalAvailablePointText')}</Text>
//                                             <Text preset={Text.preset.h6B} style={style.point}>{this.myReferralPoint.totalAvailable}</Text>
//                                         </View>
//                                         <View style={style.pointSubContainer}>
//                                             <Text preset={Text.preset.h6B} style={style.textPoint}>{SGLocalize.translate('MyReferralScreen.totalReferralText')}</Text>
//                                             <Text preset={Text.preset.h6B} style={style.point}>{this.myReferralPoint.total}</Text>
//                                         </View>
//                                     </View>
//                                     <Button style={style.buttonHistory} onPress={() => SGHelperNavigation.navigatePush(this.props.navigation, 'ReferralHistory')} textPreset={Text.preset.h8B} label={SGLocalize.translate('MyReferralScreen.whoReferredByMe')}></Button>
//                                 </View>
//                                 <Text preset={Text.preset.h4B} style={style.redeemTextTitle}>{SGLocalize.translate('MyReferralScreen.redeemSectionTitle')}</Text>
            
//                             </View>
//                         }
//                         >
//                         </FlatList>
//                         <View style={{ width: '100%', height: SGHelperWindow.getFooterHeight() }}></View>
//                         <View style={{ width: '100%', height: SGHelperWindow.getHeaderHeight() }}></View>
//                     </View>
//                     :
//                     <ActivityIndicator preset={ActivityIndicator.preset.h1} style={{ flex: 1 }}></ActivityIndicator>
//                 }
//                 <BottomNavigationContainer accessible={true} accessibilityLabel={'HomeScreenBottomNav'} currentUser={this.currentUser} navigator={this.props.navigation} style={style.throwWHP}></BottomNavigationContainer>
//             </SGRootView>
//         );
//     }
// }
