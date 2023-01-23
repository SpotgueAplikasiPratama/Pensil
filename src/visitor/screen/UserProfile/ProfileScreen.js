/*
Version 1.2.0
* 1. Leon 12 Apr 2021
* - add ErrorHandling
* Leon, 4 May 2021
  - Fix Like, Fix Favorite, Fix Notification
*/
import React from "react";
import { StyleSheet, Animated } from "react-native";
import { SGBaseScreen } from "../../../core/screen/SGBaseScreen";
import { SGView as View, SGText as Text, SGTouchableOpacity as TouchableOpacity, SGScrollView as ScrollView, SGTabView as TabView, SGRootView, SGPicker as Picker, SGFlatList as FlatList, SGButton as Button, SGPopView, SGImage as Image,SGActivityIndicator,SGDialogBox as DialogBox ,SGRootScrollView} from "../../../core/control";
import { ProfileHeaderContainer } from '../../container_V2/ProfileHeaderContainer';
import { PlaceCheckInHistoryCard } from '../../container_V2/PlaceCheckInHistoryCard';
import { SmallFavoritePlaceCard } from '../../container_V2/SmallFavoritePlaceCard';
import { SmallFavoriteRestoCard } from '../../container_V2/SmallFavoriteRestoCard';
import { SmallFavoriteStoreCard } from '../../container_V2/SmallFavoriteStoreCard';
import { StoreCheckInHistoryCard } from '../../container_V2/StoreCheckInHistoryCard';
import { RestoCheckInHistoryCard } from '../../container_V2/RestoCheckInHistoryCard';
import { PlaceContentLikeHistoryCard } from '../../container_V2/PlaceContentLikeHistoryCard';
import { StoreContentLikeHistoryCard } from '../../container_V2/StoreContentLikeHistoryCard';
import { RestoContentLikeHistoryCard } from '../../container_V2/RestoContentLikeHistoryCard';
import { SGHelperNavigation, SGHelperGlobalVar, SGHelperWindow,SGHelperType,SGHelperErrorHandling } from '../../../core/helper';
import { SGLocalize } from '../../locales/SGLocalize';
import image from '../../asset/image';
import { tbUserDAO } from '../../db/tbUserDAO';
import { VProfileAPI } from '../../api/VProfileAPI';
import { tbVUserFavoriteAPI } from '../../api/tbVUserFavoriteAPI';
import { BottomNavigationContainer } from '../../component_V2/BottomNavigationContainer';
import { CustomMenuBar } from '../../component_V2/CustomMenuBar';
import Clipboard from '@react-native-community/clipboard';
import { sortDAO } from '../../db/sortDAO';


export class ProfileScreen extends SGBaseScreen {

    getPagingFavoritePlace(){
        var itemPerPage = SGHelperType.getPaging()
        return {paging:true,offset:this.pagingCounterFavoritePlace, totalPerPage:itemPerPage}
    }
    getPagingFavoriteStore(){
        var itemPerPage = SGHelperType.getPaging()
        return {paging:true,offset:this.pagingCounterFavoriteStore, totalPerPage:itemPerPage}
    }
    getPagingFavoriteResto(){
        var itemPerPage = SGHelperType.getPaging()
        return {paging:true,offset:this.pagingCounterFavoriteResto, totalPerPage:itemPerPage}
    }

    getPagingLikePlace(){
        var itemPerPage = SGHelperType.getPaging()
        return {paging:true,offset:this.pagingCounterLikePlace, totalPerPage:itemPerPage}
    }
    getPagingLikeStore(){
        var itemPerPage = SGHelperType.getPaging()
        return {paging:true,offset:this.pagingCounterLikeStore, totalPerPage:itemPerPage}
    }
    getPagingLikeResto(){
        var itemPerPage = SGHelperType.getPaging()
        return {paging:true,offset:this.pagingCounterLikeResto, totalPerPage:itemPerPage}
    }
    

    createStyleSheet = (whp) => {
        var { w, h, p } = whp;
        return StyleSheet.create({
            throwWHP: { width: w, height: h, padding: p },
            mainContainer: { width: w, justifyContent: 'flex-start', backgroundColor: '#FFFFFF', paddingVertical: 0 },
            tabBarStyle: { borderColor: '#E6E6E6', borderTopWidth: 0.005 * w, borderBottomWidth: 0.0025 * w, width:w },
            tabBarUnderlineStyle: { backgroundColor: '#1E1E1E' },
            containerView1: { width: w, height: w, padding: p, backgroundColor: 'white' },
            text1: { textAlign: 'center', fontSize: w * 0.025, marginTop: w * 0.01 },
            picker: { width: w * 0.3, borderRadius: 4 * p, backgroundColor: '#e1e1e1', borderWidth: 0, marginHorizontal: 2 * p, marginVertical: p },
            pickerView: { alignItems: 'flex-end', width: w, marginTop: p },
        });
    };

    async componentDidMount() {
        await this._onRefreshAllItem(true);
        this._unsubscribe = this.props.navigation.addListener('focus', async () => {
            await this._onRefreshAllItem();
        });
    }

    checkAPIBatchStatusAllDone() {
            this.counterBatch=0
            this.alreadyMount = true;
            this.pagingCounterFavoritePlace = this.favPlaceData.length;
            this.pagingCounterFavoriteStore = this.favStoreData.length;
            this.pagingCounterFavoriteResto = this.favRestoData.length;
            this.pagingCounterLikePlace = this.placeContentLikeHistoryData.length;
            this.pagingCounterLikeStore = this.storeContentLikeHistoryData.length;
            this.pagingCounterLikeResto = this.restoContentLikeHistoryData.length;
            this.setState({  refreshFavoritePlace : false,refreshFavoriteStore :false, refreshFavoriteResto : false,refreshLikePlace : false, refreshLikeStore : false,refreshLikeResto : false, })
            this.forceUpdate();
    }

    async _onRefreshAllItem(resetPaging=false) {
        this.currentUser = SGHelperGlobalVar.getVar('GlobalCurrentUser');
        this.currentUserData = SGHelperGlobalVar.getVar('GlobalCurrentUserData');
        this.imageSetting = SGHelperGlobalVar.getVar('GlobalImageSetting');
        this.currentUserImage = SGHelperGlobalVar.getVar('GlobalCurrentUserImage');


        if(resetPaging){
            
            this.pagingCounterFavoritePlace = 0
            this.pagingCounterFavoriteStore = 0
            this.pagingCounterFavoriteResto = 0
            this.pagingCounterLikePlace = 0
            this.pagingCounterLikeStore = 0
            this.pagingCounterLikeResto = 0

            this.pagingFavoritePlace = this.getPagingFavoritePlace();
            this.pagingFavoriteStore = this.getPagingFavoriteStore();
            this.pagingFavoriteResto = this.getPagingFavoriteResto();
            this.pagingLikePlace = this.getPagingLikePlace();
            this.pagingLikeStore = this.getPagingLikeStore();
            this.pagingLikeResto = this.getPagingLikeResto();

            this.baseInitAPIParallel(SGHelperGlobalVar.getVar("ResponTimes"), (() => { this.checkAPIBatchStatusAllDone(); }).bind(this));

            this.baseAddAPIParallel('getUserFavPlaceList', (async (v1,v2,v3) => { return tbVUserFavoriteAPI.getUserFavPlaceList(v1,v2,v3); }).bind(this, [],this._sortDataFavoritePlace,this.pagingFavoritePlace), ((v) => {
                this.favPlaceData = v;
            }).bind(this),  null);

           

            this.baseAddAPIParallel('getUserFavRestoList', (async (v1,v2,v3) => { return tbVUserFavoriteAPI.getUserFavRestoList(v1,v2,v3); }).bind(this, [],this._sortDataFavoriteResto,this.pagingFavoriteResto ), ((v) => {
                this.favRestoData = v;
            }).bind(this),  null);

           

            this.baseAddAPIParallel('getUserFavStoreList', (async (v1,v2,v3) => { return tbVUserFavoriteAPI.getUserFavStoreList(v1,v2,v3); }).bind(this, [],this._sortDataFavoriteStore,this.pagingFavoriteStore ), ((v) => {
                this.favStoreData = v;
            }).bind(this),  null);

           

            this.baseAddAPIParallel('getUserPlaceCheckInHistory', (async () => { return VProfileAPI.getUserPlaceCheckInHistory(); }).bind(this ), ((v) => {
                this.placeCheckInData = v;
            }).bind(this),  null);

           

            this.baseAddAPIParallel('getUserStoreCheckInHistory', (async () => { return VProfileAPI.getUserStoreCheckInHistory(); }).bind(this ), ((v) => {
                this.storeCheckInData = v;
            }).bind(this),  null);


           

            this.baseAddAPIParallel('getUserRestoCheckInHistory', (async () => { return VProfileAPI.getUserRestoCheckInHistory(); }).bind(this ), ((v) => {
                this.restoCheckInData = v;
            }).bind(this),  null);

           

            this.baseAddAPIParallel('getPlaceContentLikeHistoryData', (async (v1,v2,v3) => { return VProfileAPI.getPlaceContentLikeHistoryData(v1,v2,v3); }).bind(this, [],this.sortHistoryLike,this.pagingLikePlace ), ((v) => {
                this.placeContentLikeHistoryData = v;
            }).bind(this),  null);

          

            this.baseAddAPIParallel('getStoreContentLikeHistoryData', (async (v1,v2,v3) => { return VProfileAPI.getStoreContentLikeHistoryData(v1,v2,v3); }).bind(this, [],this.sortHistoryLike,this.pagingLikeStore ), ((v) => {
                this.storeContentLikeHistoryData = v;
            }).bind(this),  null);

         

            this.baseAddAPIParallel('getRestoContentLikeHistoryData', (async (v1,v2,v3) => { return VProfileAPI.getRestoContentLikeHistoryData(v1,v2,v3); }).bind(this, [],this.sortHistoryLike,this.pagingLikeResto ), ((v) => {
                this.restoContentLikeHistoryData = v;
            }).bind(this),  null);

           
            this.baseRunAPIParallel();
        } else {
            this.forceUpdate();
        }
    }

    
    async _onLoadDataFavoritePlace(){
 
            console.log('loadFavoritePlace');
            if(!this.state.loadingFavoritePlace && !this.state.stopPullingFavoritePlace){
                this.setState({loadingFavoritePlace:true})
                this.pagingFavoritePlace = this.getPagingFavoritePlace();
               
                this.baseRunSingleAPIWithRedoOption('getUserFavPlaceList', (async (v1, v2, v3) => { return tbVUserFavoriteAPI.getUserFavPlaceList(v1, v2, v3) }).bind(this, [],this._sortDataFavoritePlace,this.pagingFavoritePlace), ((v) => {           
                    var resData = v;
                    if(resData.length!==0){
                        for(var i=0;i<resData.length;i++){
                            this.favPlaceData.push(resData[i])
                        }
                        this.pagingCounterFavoritePlace = this.pagingCounterFavoritePlace + resData.length
                        
                    }else this.setState({stopPullingFavoritePlace:true})
                }).bind(this), (()=>{ this.setState({loadingFavoritePlace:false}) }), SGHelperGlobalVar.getVar("ResponTimes"));
            }


    }

    async _onLoadFavoriteStore(){
        // try {
            console.log('loadFavoriteStore');
            if(!this.state.loadingFavoriteStore && !this.state.stopPullingFavoriteStore){
                this.setState({loadingFavoriteStore:true})
                this.pagingFavoriteStore = this.getPagingFavoriteStore();
               
                this.baseRunSingleAPIWithRedoOption('getUserFavStoreList', (async (v1, v2, v3) => { return tbVUserFavoriteAPI.getUserFavStoreList(v1, v2, v3) }).bind(this, [],this._sortDataFavoriteStore,this.pagingFavoriteStore ), ((v) => {           
                var resData = v// await tbVUserFavoriteAPI.getUserFavStoreList([],this._sortDataFavoriteStore,this.pagingFavoriteStore)
                if(resData.length!==0){
                    for(var i=0;i<resData.length;i++){
                        this.favStoreData.push(resData[i])
                    }
                    this.pagingCounterFavoriteStore = this.pagingCounterFavoriteStore + resData.length
                    
                }else this.setState({stopPullingFavoriteStore:true})
                this.setState({loadingFavoriteStore:false})
            }).bind(this), (()=>{     this.setState({loadingFavoriteStore:false}) }), SGHelperGlobalVar.getVar("ResponTimes"));
            }
       

    }

    async _onLoadFavoriteResto(){
      
            console.log('loadFavoriteResto');
            if(!this.state.loadingFavoriteResto && !this.state.stopPullingFavoriteResto){
                this.setState({loadingFavoriteResto:true})
                this.pagingFavoriteResto = this.getPagingFavoriteResto();
               
                this.baseRunSingleAPIWithRedoOption('getUserFavRestoList', (async (v1, v2, v3) => {  return tbVUserFavoriteAPI.getUserFavRestoList(v1, v2, v3) }).bind(this, [],this._sortDataFavoriteResto,this.pagingFavoriteResto ), ((v) => {           
                    var resData = v// await tbVUserFavoriteAPI.getUserFavRestoList([],this._sortDataFavoriteResto,this.pagingFavoriteResto)
                    if(resData.length!==0){
                        for(var i=0;i<resData.length;i++){
                            this.getFavResto.push(resData[i])
                        }
                        this.pagingCounterFavoriteResto = this.pagingCounterFavoriteResto + resData.length
                        
                    }else this.setState({stopPullingFavoriteResto:true})
                    this.setState({loadingFavoriteResto:false})
                }).bind(this), (()=>{     this.setState({loadingFavoriteStore:false}) }), SGHelperGlobalVar.getVar("ResponTimes"));
            }
    }

    async _onLoadLikePlace(){
        // try {
            console.log('loadLikePlace');
            if(!this.state.loadingLikePlace && !this.state.stopPullingLikePlace){
                this.setState({loadingLikePlace:true})
                this.pagingLikePlace = this.getPagingLikePlace();
               
                this.baseRunSingleAPIWithRedoOption('getPlaceContentLikeHistoryData', (async (v1, v2, v3) => {  return VProfileAPI.getPlaceContentLikeHistoryData(v1, v2, v3) }).bind(this, [],this.sortHistoryLike,this.pagingLikePlace ), ((v) => {           
                    var resData = v// await VProfileAPI.getPlaceContentLikeHistoryData([],this.sortHistoryLike,this.pagingLikePlace)
                    if(resData.length!==0){
                        for(var i=0;i<resData.length;i++){
                            this.placeContentLikeHistoryData.push(resData[i])
                        }
                        this.pagingCounterLikePlace = this.pagingCounterLikePlace + resData.length
                        
                        }else this.setState({stopPullingLikePlace:true})
                    this.setState({loadingLikePlace:false})
                }).bind(this), (()=>{     this.setState({loadingFavoriteStore:false}) }), SGHelperGlobalVar.getVar("ResponTimes"));
            }
        // } catch (error) {
        //     SGHelperErrorHandling.Handling(error,this._onLoadLikePlace.bind(this))
        // } finally{
        //     this.setState({loadingLikePlace:false})
        // }

    }

    async _onLoadLikeStore(){
        // try{
            console.log('loadLikeStore');
            if(!this.state.loadingLikeStore && !this.state.stopPullingLikeStore){
                this.setState({loadingLikeStore:true})
                this.pagingLikeStore = this.getPagingLikeStore();
            
                this.baseRunSingleAPIWithRedoOption('getStoreContentLikeHistoryData', (async (v1, v2, v3) => {  return VProfileAPI.getStoreContentLikeHistoryData(v1, v2, v3) }).bind(this, [],this.sortHistoryLike,this.pagingLikeStore ), ((v) => {           
                    var resData = v// await VProfileAPI.getStoreContentLikeHistoryData([],this.sortHistoryLike,this.pagingLikeStore)
                    if(resData.length!==0){
                        for(var i=0;i<resData.length;i++){
                            this.storeContentLikeHistoryData.push(resData[i])
                        }
                        this.pagingCounterLikeStore = this.pagingCounterLikeStore + resData.length
                        
                    }else this.setState({stopPullingLikeStore:true})
                    this.setState({loadingLikeStore:false})
                }).bind(this), (()=>{     this.setState({loadingLikeStore:false}) }), SGHelperGlobalVar.getVar("ResponTimes"));
            }
        // } catch (error) {
        //     SGHelperErrorHandling.Handling(error,this._onLoadLikeStore.bind(this))
        // }finally{
        //     this.setState({loadingLikeStore:false})
        // }
    }

    async _onLoadLikeResto(){
        // try {
            console.log('loadLikeResto');
            if(!this.state.loadingLikeResto && !this.state.stopPullingLikeResto){
                this.setState({loadingLikeResto:true})
                this.pagingLikeResto = this.getPagingLikeResto();
               
                this.baseRunSingleAPIWithRedoOption('getRestoContentLikeHistoryData', (async (v1, v2, v3) => {  return VProfileAPI.getRestoContentLikeHistoryData(v1, v2, v3) }).bind(this, [],this.sortHistoryLike,this.pagingLikeResto), ((v) => {           
                    var resData = v// await VProfileAPI.getRestoContentLikeHistoryData([],this.sortHistoryLike,this.pagingLikeResto)
                    if(resData.length!==0){
                        for(var i=0;i<resData.length;i++){
                            this.restoContentLikeHistoryData.push(resData[i])
                        }
                        this.pagingCounterLikeResto = this.pagingCounterLikeResto + resData.length
                        
                    }else this.setState({stopPullingLikeResto:true})
                    this.setState({loadingLikeResto:false})
                }).bind(this), (()=>{ this.setState({loadingLikeResto:false}) }), SGHelperGlobalVar.getVar("ResponTimes"));
            }
        // } catch (error) {
        //     SGHelperErrorHandling.Handling(error,this._onLoadLikeResto.bind(this))
        // }finally{
        //     this.setState({loadingLikeResto:false})
        // }

    }

    async _onRefreshCheckInPlace(){
        
        this.baseRunSingleAPIWithRedoOption('getUserPlaceCheckInHistory', (async () => { return VProfileAPI.getUserPlaceCheckInHistory() }).bind(this), ((v) => {
            this.placeCheckInData = v;
        }).bind(this), null,SGHelperGlobalVar.getVar("ResponTimes") );
    }

    async _onRefreshCheckInStore(){
        
        this.baseRunSingleAPIWithRedoOption('getUserStoreCheckInHistory', (async () => { return VProfileAPI.getUserStoreCheckInHistory() }).bind(this), ((v) => {
            this.storeCheckInData = v;
        }).bind(this), null,SGHelperGlobalVar.getVar("ResponTimes") );
    }

    async _onRefreshCheckInResto(){
        
        this.baseRunSingleAPIWithRedoOption('getUserRestoCheckInHistory', (async () => { return VProfileAPI.getUserRestoCheckInHistory() }).bind(this), ((v) => {
            this.restoCheckInData = v;
        }).bind(this), null,SGHelperGlobalVar.getVar("ResponTimes") );
    }


    async _onRefreshFavoritePlace() {
        this.setState({ refreshFavoritePlace: true ,stopPullingFavoritePlace:true})
        if(!this.refreshFavoritePlace && !this.state.loadingFavoritePlace){
            this.refreshFavoritePlace= true
            this.pagingCounterFavoritePlace = 0
            this.pagingFavoritePlace = this.getPagingFavoritePlace();


            this.baseRunSingleAPIWithRedoOption('getUserFavStoreList', (async (v1,v2,v3) => { return tbVUserFavoriteAPI.getUserFavPlaceList(v1,v2,v3) }).bind(this, [],this._sortDataFavoritePlace,this.pagingFavoritePlace), ((v) => {
            this.favPlaceData = v
            this.pagingCounterFavoritePlace = this.favPlaceData.length
            if(v.length<SGHelperType.getPaging())this.setState({stopPullingFavoritePlace:true})
            else this.setState({stopPullingFavoritePlace:false})
            this.refreshFavoritePlace=false
            this.setState({ refreshFavoritePlace: false});
            this.forceUpdate()
            }).bind(this), null,SGHelperGlobalVar.getVar("ResponTimes") );
        }
    }

    async _onRefreshFavoriteStore() {
        this.setState({ refreshFavoriteStore: true ,stopPullingFavoriteStore:true})
        if(!this.refreshFavoriteStore && !this.state.loadingFavoriteStore){
            this.refreshFavoriteStore= true
            this.pagingCounterFavoriteStore = 0
            this.pagingFavoriteStore = this.getPagingFavoriteStore();


            this.baseRunSingleAPIWithRedoOption('getUserFavStoreList', (async (v1,v2,v3) => { return tbVUserFavoriteAPI.getUserFavStoreList(v1,v2,v3) }).bind(this, [],this._sortDataFavoriteStore,this.pagingFavoriteStore ), ((v) => {
            this.favStoreData = v
            this.pagingCounterFavoriteStore = this.favStoreData.length
            if(v.length<SGHelperType.getPaging())this.setState({stopPullingFavoriteStore:true})
            else this.setState({stopPullingFavoriteStore:false})
            this.refreshFavoriteStore=false
            this.setState({ refreshFavoriteStore: false});
            this.forceUpdate()
            }).bind(this), null,SGHelperGlobalVar.getVar("ResponTimes") );
        }
    }

    async _onRefreshFavoriteResto() {
        this.setState({ refreshFavoriteResto: true ,stopPullingFavoriteResto:true})
        if(!this.refreshFavoriteResto && !this.state.loadingFavoriteResto){
            this.refreshFavoriteResto= true
            this.pagingCounterFavoriteResto = 0
            this.pagingFavoriteResto = this.getPagingFavoriteResto();


            this.baseRunSingleAPIWithRedoOption('getUserFavRestoList', (async (v1,v2,v3) => { return tbVUserFavoriteAPI.getUserFavRestoList(v1,v2,v3) }).bind(this, [],this._sortDataFavoriteResto,this.pagingFavoriteResto ), ((v) => {
            this.favRestoData = v
            this.pagingCounterFavoriteResto = this.favRestoData.length
            if(v.length<SGHelperType.getPaging())this.setState({stopPullingFavoriteResto:true})
            else this.setState({stopPullingFavoriteResto:false})
            this.refreshFavoriteResto=false
            this.setState({ refreshFavoriteResto: false});
            this.forceUpdate()
            }).bind(this), null,SGHelperGlobalVar.getVar("ResponTimes") );
        }
    }

    async _onRefreshLikedPlace() {
        this.setState({ refreshLikePlace: true ,stopPullingLikePlace:true})
        if(!this.refreshLikePlace && !this.state.loadingLikePlace){
            this.refreshLikePlace= true
            this.pagingCounterLikePlace = 0
            this.pagingLikePlace = this.getPagingLikePlace();


            this.baseRunSingleAPIWithRedoOption('getPlaceContentLikeHistoryData', (async (v1,v2,v3) => { return VProfileAPI.getPlaceContentLikeHistoryData(v1,v2,v3) }).bind(this, [],this.sortHistoryLike,this.pagingLikePlace ), ((v) => {
            this.placeContentLikeHistoryData = v
            this.pagingCounterLikePlace =  this.placeContentLikeHistoryData.length
            if(v.length<SGHelperType.getPaging())this.setState({stopPullingLikePlace:true})
            else this.setState({stopPullingLikePlace:false})
            this.refreshLikePlace=false
            this.setState({ refreshLikePlace: false});
            this.forceUpdate()
            }).bind(this), null,SGHelperGlobalVar.getVar("ResponTimes") );
        }
    }

    async _onRefreshLikedStore() {
        this.setState({ refreshLikeStore: true ,stopPullingLikeStore:true})
        if(!this.refreshLikeStore && !this.state.loadingLikeStore){
            this.refreshLikeStore= true
            this.pagingCounterLikeStore = 0
            this.pagingLikeStore = this.getPagingLikeStore();


            this.baseRunSingleAPIWithRedoOption('getStoreContentLikeHistoryData', (async (v1,v2,v3) => { return VProfileAPI.getStoreContentLikeHistoryData(v1,v2,v3) }).bind(this, [],this.sortHistoryLike,this.pagingLikeStore  ), ((v) => {
            this.storeContentLikeHistoryData = v
            this.pagingCounterLikeStore =  this.storeContentLikeHistoryData.length
            if(v.length<SGHelperType.getPaging())this.setState({stopPullingLikeStore:true})
            else this.setState({stopPullingLikeStore:false})
            this.refreshLikeStore=false
            this.setState({ refreshLikeStore: false});
            this.forceUpdate()
            }).bind(this), null,SGHelperGlobalVar.getVar("ResponTimes") );
        }
    }

    async _onRefreshLikedResto() {
        this.setState({ refreshLikeResto: true ,stopPullingLikeResto:true})
        if(!this.refreshLikeResto && !this.state.loadingLikeResto){
            this.refreshLikeResto= true
            this.pagingCounterLikeResto = 0
            this.pagingLikeResto = this.getPagingLikeResto();


            this.baseRunSingleAPIWithRedoOption('getRestoContentLikeHistoryData', (async (v1,v2,v3) => { return VProfileAPI.getRestoContentLikeHistoryData(v1,v2,v3) }).bind(this, [],this.sortHistoryLike,this.pagingLikeResto ), ((v) => {
            this.restoContentLikeHistoryData = v
            this.pagingCounterLikeResto =  this.restoContentLikeHistoryData.length
            if(v.length<SGHelperType.getPaging())this.setState({stopPullingLikeResto:true})
            else this.setState({stopPullingLikeResto:false})
            this.refreshLikeResto=false
            this.setState({ refreshLikeResto: false});
            this.forceUpdate()
            }).bind(this), null,SGHelperGlobalVar.getVar("ResponTimes") );
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
        this.state = { active1: true, active2: false, active3: false, active4: false, active5: false, active6: false, active7: false, active8: false, active9: false, active10: false }
        this.currentUser = SGHelperGlobalVar.getVar('GlobalCurrentUser');
        this.imageSetting = SGHelperGlobalVar.getVar('GlobalImageSetting');
        this.userData = SGHelperGlobalVar.getVar('GlobalCurrentUserData');
        this.currentUserData = SGHelperGlobalVar.getVar('GlobalCurrentUserData');
        this.favPlaceData = '';
        this.favRestoData = '';
        this.favStoreData = '';
        this.placeCheckInData = ''
        this.storeCheckInData = ''
        this.restoCheckInData = ''
        this.placeContentLikeHistoryData = ''
        this.storeContentLikeHistoryData = ''
        this.restoContentLikeHistoryData = ''
        this.icon = { placeIcon: image.profileTabMallIcon[this.imageSetting].url, storeIcon: image.profileTabStoreIcon[this.imageSetting].url, restoIcon: image.profileTabRestoIcon[this.imageSetting].url }
        this.filterPlaceLike = [
            { key: 'Default', title: SGLocalize.translate('filterPlaceLike.Default') },
            { key: 'Place', title: SGLocalize.translate('filterPlaceLike.Place') },
            { key: 'PlaceEvent', title: SGLocalize.translate('filterPlaceLike.PlaceEvent') },
            { key: 'Facility', title: SGLocalize.translate('filterPlaceLike.Facility') },
            { key: 'WhereToGo', title: SGLocalize.translate('filterPlaceLike.WhereToGo') },
            { key: 'Reward', title: SGLocalize.translate('filterPlaceLike.Reward') },
        ],
            this.filterStoreLike = [
                { key: 'Default', title: SGLocalize.translate('filterStoreLike.Default') },
                { key: 'Store', title: SGLocalize.translate('filterStoreLike.Store') },
                { key: 'StorePromo', title: SGLocalize.translate('filterStoreLike.StorePromo') },
                { key: 'StoreProduct', title: SGLocalize.translate('filterStoreLike.StoreProduct') },
                { key: 'StoreWhatToGift', title: SGLocalize.translate('filterStoreLike.StoreWhatToGift') },
                { key: 'ClothToBuy', title: SGLocalize.translate('filterStoreLike.ClothToBuy') },
                { key: 'Reward', title: SGLocalize.translate('filterStoreLike.Reward') },
            ]
        this.filterRestoLike = [
            { key: 'Default', title: SGLocalize.translate('filterRestoLike.Default') },
            { key: 'Resto', title: SGLocalize.translate('filterRestoLike.Resto') },
            { key: 'RestoPromo', title: SGLocalize.translate('filterRestoLike.RestoPromo') },
            { key: 'RestoMenu', title: SGLocalize.translate('filterRestoLike.RestoMenu') },
            { key: 'RestoWhatToGift', title: SGLocalize.translate('filterRestoLike.RestoWhatToGift') },
            { key: 'WhatToEat', title: SGLocalize.translate('filterRestoLike.WhatToEat') },
            { key: 'Reward', title: SGLocalize.translate('filterRestoLike.Reward') },
        ]

        this._sortDataFavoritePlace = sortDAO.getPlaceProfileSortData(this.Language.toUpperCase());
        this._sortDataFavoriteResto = sortDAO.getRestoProfileSortData(this.Language.toUpperCase());
        this._sortDataFavoriteStore = sortDAO.getStoreProfileSortData(this.Language.toUpperCase());
        this.sortHistoryLike = sortDAO.getSortHistoryLikedData(this.Language.toUpperCase());

        this.alreadyMount = false

        this.state = { selectedRender: 'checkIn', selectedFilterPlace: this.filterPlaceLike[0].key, selectedFilterStore: this.filterStoreLike[0].key, selectedFilterResto: this.filterRestoLike[0].key,
        refreshFavoritePlace : false,refreshFavoriteStore :false, refreshFavoriteResto : false,refreshLikePlace : false, refreshLikeStore : false,refreshLikeResto : false, 
        refreshFlatListCheckInPlace : false,refreshFlatListCheckInStore:false,refreshFlatListCheckInResto:false,
        refreshFlatListFavoritePlace:false,refreshFlatListFavoriteStore:false,refreshFlatListFavoriteResto:false,refreshFlatListLikePlace:false,refreshFlatListLikeStore:false,refreshFlatListLikeResto:false,
        loadingFavoritePlace : false, loadingFavoriteStore : false, loadingFavoriteResto : false,loadingLikePlace:false,loadingLikeStore:false,loadingLikeResto:false,
        stopPullingFavoritePlace:false,stopPullingFavoriteStore:false,stopPullingFavoriteResto:false,stopPullingLikePlace:false,stopPullingLikeStore:false,stopPullingLikeResto:false,
        };

        this.refreshFavoritePlace=false
        this.refreshFavoriteStore=false
        this.refreshFavoriteResto = false
        this.refreshLikePlace = false
        this.refreshLikeStore = false
        this.refreshLikeResto = false

        this.pagingCounterFavoritePlace = 0
        this.pagingCounterFavoriteStore = 0
        this.pagingCounterFavoriteResto = 0
        this.pagingCounterLikePlace = 0
        this.pagingCounterLikeStore = 0
        this.pagingCounterLikeResto = 0
        this.counterBatch=0
        this.errorBatch = []
    }

    onRenderChange(renderTarget) {
        this.setState({ selectedRender: renderTarget });
    }

    onIconPress(active) {
        this.setState({ active1: false, active2: false, active3: false, active4: false, active5: false, active6: false, active7: false, active8: false, active9: false, active10: false })
        if (active === "1") this.setState({ active1: true })
        if (active === "2") this.setState({ active2: true })
        if (active === "3") this.setState({ active3: true })
        if (active === "4") this.setState({ active4: true })
    }

    onSettingPress() {
        SGHelperNavigation.navigatePush(this.props.navigation, "ChooseSettingScreen");
    }

    _getLikeResource(data) {
        return (
            { fContentType: data.contentGroup, fContentKey: data.contentKey, fText1: data.text1, fText2: data.text2, fText3: data.text3, fImageID: data.contentImageID, fImageEN: data.contentImageEN, fImageCN: data.contentImageCN, fTargetKey: data.fTargetKey }
        )
    }

    _copyKey(){
        Clipboard.setString(this.currentUserData.fReferralCode);
        setTimeout(() => {DialogBox.showToast(SGLocalize.translate('ShowToastMessage.Copied'), null)}, 300); 

    }
   

    render() {
        var { w, h, p } = this.WHP;
        var style = this.style;
        var n = this.props.navigation;
        var language = this.Language.toUpperCase()
        var tR = SGLocalize.translate
        return (
            <SGRootView dummyStatusBar accessible={true} accessibilityLabel={'ProfileScreenRootView'} style={style.mainContainer}>
                
                <ProfileHeaderContainer accessible={true} accessibilityLabel={'ProfileScreenHeader'} currentUserData={this.currentUserData} imageSetting={this.imageSetting} language={this.Language} style={style.throwWHP} selectedRender={this.state.selectedRender} onRenderChangePress={this.onRenderChange.bind(this)} navigator={this.props.navigation} copyContent={() => {this._copyKey()}} ></ProfileHeaderContainer>
                <View accessible={true} accessibilityLabel={'ProfileScreenCheckInView'} style={{ flex: 1 }} hidden={this.state.selectedRender === 'checkIn' ? false : true}>
                    <TabView accessible={true} accessibilityLabel={'ProfileScreenCITabView'} tabBarStyle={style.tabBarStyle} tabBarTextStyle={style.tabBarTextStyle}  tabBarUnderlineStyle={style.tabBarUnderlineStyle} tabBarActiveTextColor={'#000000'} tabBarInactiveTextColor={'#6E6A6A'} tabBarActiveTextPreset={Text.preset.titleH2B} tabBarInactiveTextPreset={Text.preset.titleH2}>
                    {this.placeCheckInData.length !==0 ?
                        <View accessible={true} accessibilityLabel={'ProfileScreenCIPlaceView'} style={{ flex: 1 }} tabLabel={SGLocalize.translate('ProfileScreen.mallTabTitle')}>
                            <FlatList refreshing={this.state.refreshFlatListCheckInPlace} onRefresh={this._onRefreshCheckInPlace.bind(this)} accessible={true} accessibilityLabel={'ProfileScreenCIPlaceList'} showsVerticalScrollIndicator={false} contentContainerStyle={{ justifyContent: 'flex-start', alignItems: 'center', }} data={this.placeCheckInData} renderItem={({ item }) => {
                                return (
                                    <PlaceCheckInHistoryCard accessible={true} accessibilityLabel={'ProfileScreenPlaceCIHistCard'} language={this.Language} data={item} navigator={this.props.navigation} imageSetting={this.imageSetting} likeText={SGLocalize.translate("globalText.likeCountText")} lastVisitedText={SGLocalize.translate("globalText.lastVisitedText")} lastCheckInLabel={SGLocalize.translate('ProfileScreen.lastCheckInLabel')} style={style.throwWHP}></PlaceCheckInHistoryCard>
                                );
                            }} keyExtractor={item => item.key}>
                            </FlatList>
                        </View>
                        :
                        <View tabLabel={SGLocalize.translate('ProfileScreen.mallTabTitle')} style={{ flex: 1, justifyContent: 'center'}}>
                            <Text preset={Text.preset.titleH2} style={{ textAlign: 'center' }}>{SGLocalize.translate('EmptyProfileScreen.emptyCheckInMall')}</Text>
                        </View>
                        }
                        {this.storeCheckInData.length !== 0 ?
                        <View accessible={true} accessibilityLabel={'ProfileScreenCIStoreView'} style={{ flex: 1 }} tabLabel={SGLocalize.translate('ProfileScreen.storeTabTitle')}>
                            <FlatList refreshing={this.state.refreshFlatListCheckInStore} onRefresh={this._onRefreshCheckInStore.bind(this)} accessible={true} accessibilityLabel={'ProfileScreenCIStorelList'} showsVerticalScrollIndicator={false} contentContainerStyle={{ justifyContent: 'flex-start', alignItems: 'center' }} data={this.storeCheckInData} renderItem={({ item }) => {
                                return (
                                    <StoreCheckInHistoryCard accessible={true} accessibilityLabel={'ProfileScreenStoreCIHistCard'} language={this.Language} data={item} navigator={this.props.navigation} imageSetting={this.imageSetting} likeText={SGLocalize.translate("globalText.likeCountText")} lastVisitedText={SGLocalize.translate("globalText.lastVisitedText")} lastCheckInLabel={SGLocalize.translate('ProfileScreen.lastCheckInLabel')} style={style.throwWHP}></StoreCheckInHistoryCard>
                                );
                            }} keyExtractor={item => item.key}>
                            </FlatList>
                        </View>
                        :
                        <View tabLabel={SGLocalize.translate('ProfileScreen.storeTabTitle')} style={{ flex: 1, justifyContent: 'center'}}>
                            <Text preset={Text.preset.titleH2} style={{ textAlign: 'center' }}>{SGLocalize.translate('EmptyProfileScreen.emptyCheckInStore')}</Text>
                        </View>
                        }
                        {this.restoCheckInData.length !== 0 ?
                        <View accessible={true} accessibilityLabel={'ProfileScreenCIRestoView'} style={{ flex: 1 }} tabLabel={SGLocalize.translate('ProfileScreen.restoTabTitle')}>
                            <FlatList refreshing={this.state.refreshFlatListCheckInResto} onRefresh={this._onRefreshCheckInResto.bind(this)} accessible={true} accessibilityLabel={'ProfileScreenCIRestolList'} showsVerticalScrollIndicator={false} contentContainerStyle={{ justifyContent: 'flex-start', alignItems: 'center' }} data={this.restoCheckInData} renderItem={({ item }) => {
                                return (
                                    <RestoCheckInHistoryCard accessible={true} accessibilityLabel={'ProfileScreenRestoCIHistCard'} language={this.Language} data={item} navigator={this.props.navigation} imageSetting={this.imageSetting} likeText={SGLocalize.translate("globalText.likeCountText")} lastVisitedText={SGLocalize.translate("globalText.lastVisitedText")} lastCheckInLabel={SGLocalize.translate('ProfileScreen.lastCheckInLabel')} style={style.throwWHP}></RestoCheckInHistoryCard>
                                );
                            }} keyExtractor={item => item.key}>
                            </FlatList>
                        </View>
                        :
                        <View tabLabel={SGLocalize.translate('ProfileScreen.restoTabTitle')} style={{ flex: 1, justifyContent: 'center'}}>
                            <Text preset={Text.preset.titleH2} style={{ textAlign: 'center' }}>{SGLocalize.translate('EmptyProfileScreen.emptyCheckInResto')}</Text>
                        </View>
                        }
                    </TabView>
                </View>

                <View accessible={true} accessibilityLabel={'ProfileScreenFavoriteView'} style={{ flex: 1 }} hidden={this.state.selectedRender === 'favorites' ? false : true}>
                    <TabView accessible={true} accessibilityLabel={'ProfileScreenFavTabView'} tabLabel={'TabView'} scrollableTabBar tabBarStyle={style.tabBarStyle} tabBarTextStyle={style.tabBarTextStyle}  tabBarUnderlineStyle={style.tabBarUnderlineStyle} tabBarActiveTextColor={'#000000'} tabBarInactiveTextColor={'#6E6A6A'} tabBarActiveTextPreset={Text.preset.titleH2B} tabBarInactiveTextPreset={Text.preset.titleH2}>
                    
                    {this.favPlaceData.length !== 0 ?
                        <View accessible={true} accessibilityLabel={'ProfileScreenFavPlaceView'} style={{ flex: 1 }} tabLabel={SGLocalize.translate('ProfileScreen.mallTabTitle')}>
                            <FlatList  refreshing={this.state.refreshFlatListFavoritePlace} onRefresh={this._onRefreshFavoritePlace.bind(this)}  accessible={true} accessibilityLabel={'ProfileScreenFavPlaceList'} showsVerticalScrollIndicator={false} contentContainerStyle={{ justifyContent: 'flex-start', alignItems: 'center' }} data={this.favPlaceData} renderItem={({ item }) => {
                                return (
                                    <SmallFavoritePlaceCard onFavorite={((item, s)=>{console.log(item);  item.fUserFavoriteThis = s; this.forceUpdate();}).bind(this, item)} accessible={true} accessibilityLabel={'ProfileScreenPlaceFavHistCard'} data={item} navigator={this.props.navigation} imageSetting={this.imageSetting} language={this.Language} likeText={SGLocalize.translate("SeeAllFavoritesPlaceScreen.likeText")} lastVisitedText={SGLocalize.translate("SeeAllFavoritesPlaceScreen.lastVisitedText")} favoriteIconLabel={SGLocalize.translate("SeeAllFavoritesPlaceScreen.favoriteIconLabel")} key={item.buildingKey} contentKey={item.buildingKey} dataContent={item['fContent' + this.Language.toUpperCase()]} placeCategory={item.fBuildingType} city={item.fCity} isUserFavoriteThis={item.fUserFavoriteThis} style={style.containerView1}></SmallFavoritePlaceCard>
                                );
                            }} keyExtractor={item => item.key}
                            onEndReached={this._onLoadDataFavoritePlace.bind(this)}
                            onEndReachedThreshold={SGHelperType.getThreshold()}
                            ListFooterComponent={()=>{
                                if( this.state.loadingFavoritePlace)return <SGActivityIndicator preset={SGActivityIndicator.preset.h1} style={{width:w,height:h*0.05}}></SGActivityIndicator>
                                else return null
                            }}
                            >
                            </FlatList>
                        </View>
                        :
                        <View tabLabel={SGLocalize.translate('ProfileScreen.mallTabTitle')} style={{ flex: 1, justifyContent: 'center'}}>
                            <Text preset={Text.preset.titleH2} style={{ textAlign: 'center' }}>{SGLocalize.translate('EmptyProfileScreen.emptyFavoriteMall')}</Text>
                        </View>
                        }
                        {this.favStoreData.length !== 0 ?
                        <View accessible={true} accessibilityLabel={'ProfileScreenFavStoreView'} style={{ flex: 1 }} tabLabel={SGLocalize.translate('ProfileScreen.storeTabTitle')}>
                            <FlatList refreshing={this.state.refreshFlatListFavoriteStore} onRefresh={this._onRefreshFavoriteStore.bind(this)} accessible={true} accessibilityLabel={'ProfileScreenFavStorelList'} showsVerticalScrollIndicator={false} contentContainerStyle={{ justifyContent: 'flex-start', alignItems: 'center' }} data={this.favStoreData} renderItem={({ item }) => {
                                return (
                                    <SmallFavoriteStoreCard onFavorite={((item, s)=>{console.log(item);  item.fUserFavoriteThis = s; this.forceUpdate();}).bind(this, item)} accessible={true} accessibilityLabel={'ProfileScreenStoreFavHistCard'} data={item} navigator={this.props.navigation} imageSetting={this.imageSetting} language={this.Language} likeText={SGLocalize.translate("SeeAllFavoritesStoreScreen.likeText")} locationText={SGLocalize.translate("SeeAllFavoritesStoreScreen.locationText")} lastVisitedText={SGLocalize.translate("SeeAllFavoritesStoreScreen.lastVisitedText")} favoriteIconLabel={SGLocalize.translate("SeeAllFavoritesPlaceScreen.favoriteIconLabel")} key={item.storeKey} contentKey={item.key} dataContent={item['fContentStore' + this.Language.toUpperCase()]} placeName={item['fBuildingName' + this.Language.toUpperCase()]} city={item.fCity} isUserFavoriteThis={item.fUserFavoriteThis} style={style.containerView1}></SmallFavoriteStoreCard>
                                );
                            }} keyExtractor={item => item.key}
                            onEndReached={this._onLoadFavoriteStore.bind(this)}
                            onEndReachedThreshold={SGHelperType.getThreshold()}
                            ListFooterComponent={()=>{
                                if( this.state.loadingFavoriteStore)return <SGActivityIndicator preset={SGActivityIndicator.preset.h1} style={{width:w,height:h*0.05}}></SGActivityIndicator>
                                else return null
                            }}
                            >
                            </FlatList>
                        </View>
                        :
                        <View tabLabel={SGLocalize.translate('ProfileScreen.storeTabTitle')} style={{ flex: 1, justifyContent: 'center'}}>
                            <Text preset={Text.preset.titleH2} style={{ textAlign: 'center' }}>{SGLocalize.translate('EmptyProfileScreen.emptyFavoriteStore')}</Text>
                        </View>
                        }
                        {this.favRestoData.length !== 0 ?
                        <View accessible={true} accessibilityLabel={'ProfileScreenFavRestoView'} style={{ flex: 1 }} tabLabel={SGLocalize.translate('ProfileScreen.restoTabTitle')}>
                            <FlatList refreshing={this.state.refreshFlatListFavoriteResto} onRefresh={this._onRefreshFavoriteResto.bind(this)} accessible={true} accessibilityLabel={'ProfileScreenFavRestolList'} showsVerticalScrollIndicator={false} contentContainerStyle={{ justifyContent: 'flex-start', alignItems: 'center' }} data={this.favRestoData} renderItem={({ item }) => {
                                return (
                                    <SmallFavoriteRestoCard onFavorite={((item, s)=>{console.log(item);  item.fUserFavoriteThis = s; this.forceUpdate();}).bind(this, item)} accessible={true} accessibilityLabel={'ProfileScreenRestoFavHistCard'} data={item} navigator={this.props.navigation} imageSetting={this.imageSetting} language={this.Language} likeText={SGLocalize.translate("SeeAllFavoritesRestoScreen.likeText")} locationText={SGLocalize.translate("SeeAllFavoritesRestoScreen.locationText")} lastVisitedText={SGLocalize.translate("SeeAllFavoritesRestoScreen.lastVisitedText")} favoriteIconLabel={SGLocalize.translate("SeeAllFavoritesPlaceScreen.favoriteIconLabel")} key={item.restoKey} contentKey={item.key} dataContent={item['fContentResto' + this.Language.toUpperCase()]} placeName={item['fBuildingName' + this.Language.toUpperCase()]} city={item.fCity} isUserFavoriteThis={item.fUserFavoriteThis} style={style.containerView1}></SmallFavoriteRestoCard>
                                );
                            }} keyExtractor={item => item.key}
                            onEndReached={this._onLoadFavoriteResto.bind(this)}
                            onEndReachedThreshold={SGHelperType.getThreshold()}
                            ListFooterComponent={()=>{
                                if( this.state.loadingFavoriteResto)return <SGActivityIndicator preset={SGActivityIndicator.preset.h1} style={{width:w,height:h*0.05}}></SGActivityIndicator>
                                else return null
                            }}
                            >
                            </FlatList>
                        </View>
                        :
                       <View tabLabel={SGLocalize.translate('ProfileScreen.restoTabTitle')} style={{ flex: 1, justifyContent: 'center'}}>
                            <Text preset={Text.preset.titleH2} style={{ textAlign: 'center' }}>{SGLocalize.translate('EmptyProfileScreen.emptyFavoriteResto')}</Text>
                        </View>
                        }
                    </TabView>
                </View>
                <View accessible={true} accessibilityLabel={'ProfileScreenLikeView'} style={{ flex: 1 }} hidden={this.state.selectedRender === 'likes' ? false : true}>
                    <TabView accessible={true} accessibilityLabel={'ProfileScreenLikedTabView'} tabLabel={'TabView'} scrollableTabBar tabBarStyle={style.tabBarStyle} tabBarTextStyle={style.tabBarTextStyle}  tabBarUnderlineStyle={style.tabBarUnderlineStyle} tabBarActiveTextColor={'#000000'} tabBarInactiveTextColor={'#6E6A6A'} tabBarActiveTextPreset={Text.preset.titleH2B} tabBarInactiveTextPreset={Text.preset.titleH2}>
                    {this.placeContentLikeHistoryData.length !== 0 ?
                        <View accessible={true} accessibilityLabel={'ProfileScreenLikedPlaceView'} style={{ flex: 1 }} tabLabel={SGLocalize.translate('ProfileScreen.mallTabTitle')}>
                            <View accessible={true} accessibilityLabel={'ProfileScreenLikedPlacePickerView'} style={style.pickerView}>
                                <Picker accessible={true} accessibilityLabel={'ProfileScreenLikedPlacePicker'} shadowIntensity={0.2} textPreset={Text.preset.titleH4} single language={(this.Language).toUpperCase()} style={style.picker} shadow optionList={this.filterPlaceLike} value={this.state.selectedFilterPlace} onValueChange={(v) => { this.setState({ selectedFilterPlace: v }) }} />
                            </View>
                            <FlatList  refreshing={this.state.refreshFlatListLikePlace} onRefresh={this._onRefreshLikedPlace.bind(this)} accessible={true} accessibilityLabel={'ProfileScreenLikedPlacelList'} showsVerticalScrollIndicator={false} contentContainerStyle={{ justifyContent: 'flex-start', alignItems: 'center' }} data={this.placeContentLikeHistoryData} renderItem={({ item }) => {
                                return (
                                    <PlaceContentLikeHistoryCard onLike={((item, s,c)=>{console.log(item);  item.fUserLikedThis = s; item.fLikeCount+=c; this.forceUpdate();}).bind(this, item)} accessible={true} accessibilityLabel={'ProfileScreenPlaceCLHistCard'} likePackage={this._getLikeResource(item)} hidden={this.state.selectedFilterPlace != 'Default' ? (item.contentGroup !== this.state.selectedFilterPlace ? true : false) : false} language={this.Language} data={item} navigator={this.props.navigation} imageSetting={this.imageSetting} likeText={SGLocalize.translate("globalText.likeCountText")} lastVisitedText={SGLocalize.translate("globalText.lastVisitedText")} lastCheckInLabel={SGLocalize.translate('ProfileScreen.lastCheckInLabel')} style={style.containerView1}></PlaceContentLikeHistoryCard>
                                );
                            }} keyExtractor={item => item.key}
                            onEndReached={this._onLoadLikePlace.bind(this)}
                            onEndReachedThreshold={SGHelperType.getThreshold()}
                            ListFooterComponent={()=>{
                                if( this.state.loadingLikePlace)return <SGActivityIndicator preset={SGActivityIndicator.preset.h1} style={{width:w,height:h*0.05}}></SGActivityIndicator>
                                else return null
                            }}
                            >
                            </FlatList>
                        </View>
                        :
                        <View tabLabel={SGLocalize.translate('ProfileScreen.mallTabTitle')} style={{ flex: 1, justifyContent: 'center'}}>
                            <Text preset={Text.preset.titleH2} style={{ textAlign: 'center' }}>{SGLocalize.translate('EmptyProfileScreen.emptyLikeMall')}</Text>
                        </View>
                        }

                        {this.storeContentLikeHistoryData.length !== 0 ?
                        <View accessible={true} accessibilityLabel={'ProfileScreenLikedStoreView'} style={{ flex: 1 }} tabLabel={SGLocalize.translate('ProfileScreen.storeTabTitle')}>
                            <View accessible={true} accessibilityLabel={'ProfileScreenLikedStorePickerView'} style={style.pickerView}>
                                <Picker accessible={true} accessibilityLabel={'ProfileScreenLikedStorePicker'} shadowIntensity={0.2} textPreset={Text.preset.titleH4} single language={(this.Language).toUpperCase()} style={style.picker} shadow optionList={this.filterStoreLike} value={this.state.selectedFilterStore} onValueChange={(v) => { this.setState({ selectedFilterStore: v }) }} />
                            </View>
                            <FlatList  refreshing={this.state.refreshFlatListLikeStore} onRefresh={this._onRefreshLikedStore.bind(this)} accessible={true} accessibilityLabel={'ProfileScreenLikedStorelList'} showsVerticalScrollIndicator={false} contentContainerStyle={{ justifyContent: 'flex-start', alignItems: 'center' }} data={this.storeContentLikeHistoryData} renderItem={({ item }) => {
                                return (
                                    <StoreContentLikeHistoryCard onLike={((item, s,c)=>{console.log(item);  item.fUserLikedThis = s; item.fLikeCountStore+=c; this.forceUpdate();}).bind(this, item)} accessible={true} accessibilityLabel={'ProfileScreenStoreCLHistCard'} likePackage={this._getLikeResource(item)} hidden={this.state.selectedFilterStore != 'Default' ? (item.contentGroup != this.state.selectedFilterStore ? true : false) : false} language={this.Language} data={item} navigator={this.props.navigation} imageSetting={this.imageSetting} likeText={SGLocalize.translate("globalText.likeCountText")} lastVisitedText={SGLocalize.translate("globalText.lastVisitedText")} lastCheckInLabel={SGLocalize.translate('ProfileScreen.lastCheckInLabel')} style={style.containerView1}></StoreContentLikeHistoryCard>
                                );
                            }} keyExtractor={item => item.key}
                            onEndReached={this._onLoadLikeStore.bind(this)}
                            onEndReachedThreshold={SGHelperType.getThreshold()}
                            ListFooterComponent={()=>{
                                if( this.state.loadingLikeStore)return <SGActivityIndicator preset={SGActivityIndicator.preset.h1} style={{width:w,height:h*0.05}}></SGActivityIndicator>
                                else return null
                            }}
                            >
                            </FlatList>
                        </View>
                            :
                        <View tabLabel={SGLocalize.translate('ProfileScreen.storeTabTitle')} style={{ flex: 1, justifyContent: 'center'}}>
                            <Text preset={Text.preset.titleH2} style={{ textAlign: 'center' }}>{SGLocalize.translate('EmptyProfileScreen.emptyLikeStore')}</Text>
                        </View>
                        }

                        {this.restoContentLikeHistoryData.length !== 0 ?
                        <View accessible={true} accessibilityLabel={'ProfileScreenLikedRestoView'} style={{ flex: 1 }} tabLabel={SGLocalize.translate('ProfileScreen.restoTabTitle')}>
                            <View accessible={true} accessibilityLabel={'ProfileScreenLikedRestoPickerView'} style={style.pickerView}>
                                <Picker accessible={true} accessibilityLabel={'ProfileScreenLikedRestoPicker'} shadowIntensity={0.2} textPreset={Text.preset.titleH4} single language={(this.Language).toUpperCase()} style={style.picker} shadow optionList={this.filterRestoLike} value={this.state.selectedFilterResto} onValueChange={(v) => { this.setState({ selectedFilterResto: v }) }} />
                            </View>
                            <FlatList refreshing={this.state.refreshFlatListLikeResto} onRefresh={this._onRefreshLikedResto.bind(this)} accessible={true} accessibilityLabel={'ProfileScreenLikedRestolList'} showsVerticalScrollIndicator={false} contentContainerStyle={{ justifyContent: 'flex-start', alignItems: 'center' }} data={this.restoContentLikeHistoryData} renderItem={({ item }) => {
                                return (
                                    <RestoContentLikeHistoryCard onLike={((item, s,c)=>{console.log(item);  item.fUserLikedThis = s; item.fLikeCountStore+=c; this.forceUpdate();}).bind(this, item)} accessible={true} accessibilityLabel={'ProfileScreenRestoCLHistCard'} likePackage={this._getLikeResource(item)} hidden={this.state.selectedFilterResto !== 'Default' ? (item.contentGroup != this.state.selectedFilterResto ? true : false) : false} language={this.Language} data={item} navigator={this.props.navigation} imageSetting={this.imageSetting} likeText={SGLocalize.translate("globalText.likeCountText")} lastVisitedText={SGLocalize.translate("globalText.lastVisitedText")} lastCheckInLabel={SGLocalize.translate('ProfileScreen.lastCheckInLabel')} style={style.containerView1}></RestoContentLikeHistoryCard>
                                );
                            }} keyExtractor={item => item.key}
                            onEndReached={this._onLoadLikeResto.bind(this)}
                            onEndReachedThreshold={SGHelperType.getThreshold()}
                            ListFooterComponent={()=>{
                                if( this.state.loadingLikeResto)return <SGActivityIndicator preset={SGActivityIndicator.preset.h1} style={{width:w,height:h*0.05}}></SGActivityIndicator>
                                else return null
                            }}
                            >
                            </FlatList>
                        </View>
                        :
                        <View tabLabel={SGLocalize.translate('ProfileScreen.restoTabTitle')} style={{ flex: 1, justifyContent: 'center'}}>
                            <Text preset={Text.preset.titleH2} style={{ textAlign: 'center' }}>{SGLocalize.translate('EmptyProfileScreen.emptyLikeResto')}</Text>
                        </View>
                        }
                    </TabView>
                </View>
                <View style={{ width: '100%', height: SGHelperWindow.getHeaderHeight(), backgroundColor: 'white' }}></View>
                <View style={{ width: '100%', height: SGHelperWindow.getFooterHeight(), backgroundColor: 'white' }}></View>
                <Animated.View style={{ position: 'absolute', transform: [{ translateY: this._baseAnimY.interpolate({ inputRange: [-1, 0], outputRange: [(SGHelperWindow.getStatusBarHeight() - SGHelperWindow.getHeaderHeight()), SGHelperWindow.getStatusBarHeight()] }) },], height: SGHelperWindow.getHeaderHeight(), width: '100%' }}>
                    <CustomMenuBar btnBack btnSetting accessible={true} accessibilityLabel={'HomeScreenHeader'} currentUser={this.currentUser} navigator={this.props.navigation} imageSetting={this.imageSetting} style={style.throwWHP} onSettingPress={this.onSettingPress.bind(this)}></CustomMenuBar>
                </Animated.View>

                <BottomNavigationContainer accessible={true} accessibilityLabel={'HomeScreenBottomNav'} currentUser={this.currentUser} navigator={this.props.navigation} style={style.throwWHP}></BottomNavigationContainer>
            </SGRootView>
        );
    }
}

