import React from 'react';
import Core from '../core/core';
import Card from '../plugin/plugin1/component/Card';
import tbVCardDetailAPI from './plugin1/api/tbVCardDetailAPI';
import SliderBenefit from './plugin1/component/SliderBenefit';
import MyTranslator from './lessons/locale/MyTranslator';
import {LoyaltyRewardCard} from '../visitor/container_V2/LoyaltyRewardCard'
import tbVPointHistoryAPI from './plugin1/api/tbVPointHistoryAPI';
import PointHistory from './PointHistory';
import EarnPoint from './EarnPoint';
import tbVEarnPointAPI from './plugin1/api/tbVEarnPointAPI';
import { tbCImageUploadAPI } from '../core/api/tbCImageUploadAPI';
import tbVRegisterAPI from './plugin1/api/tbVRegisterAPI';

const {SGHelperNavigation, SGHelperType, SGHelperGlobalVar} = Core.Helper;

export default class CardDetail extends Core.Screen.SGBaseScreen {

  getFilterReward(lang,cardKey) {
    const { SGLocalize } = Core.Control
    return ([
      { name: this._language.toUpperCase(), operator: 'SEARCH', value: this.searchKeyword.keyword },
      { name: 'buildingKey', operator: '=', value:this.fBuildingKey, visible: false },
      { name: 'fCardKey', operator: '=', value:cardKey, visible: false },
      { name: 'fType', operator: 'IN', value: null, type: 'multi', title: SGLocalize.translate('filterSubTitle.typeRewardTitle'), group: SGLocalize.translate('filterGroup.typeReward'),optionList: this.getRewardTypeFilterList(), visible: true },
        ]);
  }

  getRewardTypeFilterList() {
    const { SGLocalize } = Core.Control
    return (
        [
            { key: 'building', title: SGLocalize.translate('filterSubTitle.typeRewardMallTitle')},
            { key: 'resto', title: SGLocalize.translate('filterSubTitle.typeRewardRestoTitle') },
            { key: 'store', title: SGLocalize.translate('filterSubTitle.typeRewardStoreTitle')}
        ]
    )
  }
  
  getSortingReward(lang) {
    const { SGLocalize } = Core.Control
    return ([
      // { name: 'rank', descending: true, title: SGLocalize.translate('sortOptions.MostRelevant'), selected: false, visible: false },
      {name:'fLoyaltyPoint',descending: false, title: SGLocalize.translate('sortOptions.LowestReferralPrice'), selected: false,visible:true},
      {name:'fLoyaltyPoint',descending: true, title:SGLocalize.translate('sortOptions.HighestReferralPrice'), selected: true,visible:true},
      {name:'fRewardName'+this._language.toUpperCase(),descending: false, title: SGLocalize.translate('sortOptions.ReferralNameAZ'), selected: false,visible:true},
      {name:'fRewardName'+this._language.toUpperCase(),descending: true, title: SGLocalize.translate('sortOptions.ReferralNameZA'), selected: false,visible:true},
    ]);
  }

  getPagingReward(){
    const { SGHelperType } = Core.Helper;
    var itemPerPage = SGHelperType.getPaging()
    return {paging:true, offset:this.pagingCounter, totalPerPage:itemPerPage}
  }

  //Pindahan dari Point History
  getFilterDataEarn(lang) {
    return ([
      // { name: this._language.toUpperCase(), operator: 'SEARCH', value: '' },
      { name: 'fType', operator: '=', value:this.fTargetType, visible: false },
      { name: 'fMemberKey', operator: '=', value:this.props.route.params.fID, visible: false }
        ]);
  }
  getSortingDataEarn(lang) {
    return ([
            { name: 'fLastModifiedDate', descending: true, selected: true, visible: false },
    ]);
  }
  getPagingDataEarn(){
    const { SGHelperType } = Core.Helper;
    var itemPerPage = SGHelperType.getPaging()
    return {paging:false, offset:this.pagingCounterEarn, totalPerPage:itemPerPage}
  }

  getFilterDataRedeem(lang) {
    return ([
      // { name: this._language.toUpperCase(), operator: 'SEARCH', value: '' },
      { name: 'fType', operator: '=', value:this.fTargetType, visible: false },
      { name: 'fMemberKey', operator: '=', value:this.props.route.params.fID, visible: false }
        ]);
  }
  getSortingDataRedeem(lang) {
    return ([
            // { name: 'fLastModifiedDate', descending: true, selected: true, visible: false },
    ]);
  }
  getPagingDataRedeem(){
    const { SGHelperType } = Core.Helper;
    var itemPerPage = SGHelperType.getPaging()
    return {paging:false, offset:this.pagingCounterRedeem, totalPerPage:itemPerPage}
  }

  getFilterDataExpire(lang) {
    return ([
      // { name: this._language.toUpperCase(), operator: 'SEARCH', value: '' },
      { name: 'fType', operator: '=', value:this.fTargetType, visible: false },
      { name: 'fMemberKey', operator: '=', value:this.props.route.params.fID, visible: false }
        ]);
  }
  getSortingDataExpire(lang) {
    return ([
            // { name: 'fLastModifiedDate', descending: true, selected: true, visible: false },
    ]);
  }
  getPagingDataExpire(){
    const { SGHelperType } = Core.Helper;
    var itemPerPage = SGHelperType.getPaging()
    return {paging:false, offset:this.pagingCounterExpire, totalPerPage:itemPerPage}
  }

  createStyleSheet = (whp) => {
    const { StyleSheet, } = Core;
    var { w, h, p } = whp;
    return StyleSheet.create({
        throwWHP: { width: w, height: h, padding: p },
        // v1: { justifyContent: 'center', alignItems: 'flex-start', width: w, height: h, overflow: 'visible' },
        v2: {width:w,height:w*0.16, backgroundColor:'black',flexDirection:'row',justifyContent:'flex-start',borderBottomRightRadius:10,borderBottomLeftRadius:10},
        v3: {width:w, flexDirection:'row',justifyContent:'center'},
        v6: {width: 0.95*w,backgroundColor:'white', borderRadius:10, justifyContent:'center',paddingVertical:2*p, borderWidth:1, borderColor:'lightgrey', marginTop: p*4},
        vTV: {width: 0.8*w,backgroundColor:'white', borderRadius:10, flexDirection:'row', justifyContent:'space-between',paddingVertical:4*p, marginTop:3*p, borderWidth:1, borderColor:'lightgrey'}, 
        vImage: { width: 0.95*w, height:0.5*w,borderRadius:10, alignItems:'flex-start', justifyContent:'flex-start',paddingVertical:4*p},
        vIcon: {color:'white',backgroundColor:'black',marginLeft:w*0.05},
        vSV: {width:w,alignSelf:'center',flexDirection:'column',justifyContent:'space-between'},  
        vSearchBar:{width:w, backgroundColor: 'white' , padding:p},
        myReferralText: { color: '#63AEE0'},

        //popview t&C
        vClose: { position: 'absolute', right: 0, top: -2 },
        vView1:{flex:1, justifyContent: 'flex-start', margin: p*3},
        descriptionText: { color: '#000000', alignSelf: 'flex-start' },

        //QR
        v3_a: { width: w - 16 * p, height: w * 0.8, backgroundColor: "white",  justifyContent: 'flex-start' },
        v3_1: { width: w - 20 * p,  paddingVertical: 2 * p, borderBottomWidth: 1, borderBottomColor: 'rgb(169,169,169)', marginBottom: 2 },
        v3_1_1: { width: (w - 20 * p) / 3.5, height: (w - 20 * p) / 3.5, borderRadius: 2 * p, resizeMode: 'cover', backgroundColor: "white" },
        v3_1_2: { flex: 1,backgroundColor:'white' },
        v4: { flexDirection: 'row', justifyContent: 'center' },
        v4_2: { alignSelf: 'center', justifyContent: 'center', },
        vQRCode: { marginHorizontal: 2 * p, marginVertical: 2 * p },
    });
  }

  constructor(props, context, ...args) {
      const {SGHelperGlobalVar} = Core.Helper
      super(props, context, ...args);
      this.style = this.createStyleSheet(this.WHP);
      this.props.navigation.setOptions({
        headerShown: false,
      });
      this.pvID1 = Core.Control.SGPopView.getPopViewID();
      this.pvID2 = Core.Control.SGPopView.getPopViewID();
      this.language = this._language.toUpperCase();
      this.fTargetType = this.props.route.params.fTargetType
      this.fID = this.props.route.params.fID
      console.log(this.fID)
      console.log("guid card")
      this.fBuildingKey = this.props.route.params.fBuildingKey
      this.fBuildingName = this.props.route.params.fBuildingName
      this.searchKeyword = {keyword:''}
      this.getCardDetailByID = {fType: this.fTargetType, itemID : this.fID}
      this.imset = SGHelperGlobalVar.getVar('GlobalImageSetting')
      this.rewardData = []
      this.pickerInput ={language: this._language.toUpperCase(), fbuildingKey: this.fBuildingKey}
      this.viewShotRef = React.createRef();
      this.filterDataEarn = this.getFilterDataEarn(this._language);
      this.sortingDataEarn = this.getSortingDataEarn(this._language);
  
      this.filterDataRedeem = this.getFilterDataRedeem(this._language);
      this.sortingDataRedeem = this.getSortingDataRedeem(this._language);
  
      this.filterDataExpire = this.getFilterDataExpire(this._language);
      this.sortingDataExpire = this.getSortingDataExpire(this._language);

      this.alreadyMount = false;
      this.pagingCounter = 0
      this.pagingCounterEarn = 0
      this.pagingCounterRedeem = 0
      this.pagingCounterExpire = 0

      this.captureRef = React.createRef();
      this.url = ''

      this.state = {refresh:false, loading: false, stopPulling: false, 
        refreshEarn : false, loadingEarn : false, stopPullingEarn : false,
        refreshRedeem: false, loadingRedeem: false, stopPullingRedeem: false,
        refreshExpire: false,loadingExpire: false,stopPullingExpire: false,
        filterDataEarn: this.filterDataEarn, sortingDataEarn: this.sortingDataEarn,
        filterDataRedeem: this.filterDataRedeem, sortingDataRedeem: this.sortingDataRedeem,
        filterDataExpire: this.filterDataExpire, sortingDataExpire: this.sortingDataExpire,
        url :'',
        saving: false,
      };
      this.refresh = false;
      this.refreshEarn = false;
      this.refreshRedeem = false;
      this.refreshExpire = false;

      this.bool1=true
      this.bool2=true
      this.bool3=true
  }

    async componentDidMount() {
      if(SGHelperGlobalVar.getVar('customSetting') == null){
        SGHelperGlobalVar.addVar('customSetting', {})
      }else{
        SGHelperGlobalVar.setVar('customSetting', {})
      }

      this._onRefreshAllItem(true);
      this._unsubscribe = this.props.navigation.addListener('focus', async () => {
           this._onRefreshAllItem();
      });
      this.forceUpdate();
    }

    async _setFilter(dataFilter) {
      this.filterReward = dataFilter;
      await this._onRefreshReward();
    }

    async _setSort(dataSort) {
        this.sortReward = dataSort;
        await this._onRefreshReward();
    }


    async _onRefreshAllItem(resetPaging = false) {
      const { SGHelperGlobalVar } = Core.Helper;
      
      if(resetPaging){
        this.setState({stopPulling:false})
        this.pagingCounter = 0
        
        this.pagingCardReward = this.getPagingReward()
        this.pagingDataEarn = this.getPagingDataEarn();
        this.pagingDataRedeem = this.getPagingDataRedeem()
        this.pagingDataExpire = this.getPagingDataExpire()
  

        this.baseInitAPIParallel(SGHelperGlobalVar.getVar("ResponTimes"), (() => { this.checkAPIBatchStatusAllDone(); }).bind(this));
        // this.baseAddAPIParallel('GetNewRegistrationSetting', (async (v1) => { return tbVCardDetailAPI.GetNewRegistrationSetting(v1) }).bind(this, this.props.route.params.buildingKey), ((v) => {
        //   SGHelperGlobalVar.addVar('newRegisSetting', v)
        // }).bind(this),null);
        this.baseAddAPIParallel('GetMyLoyaltyCardDetailByID', (async (v1) => { return tbVCardDetailAPI.GetMyLoyaltyCardDetailByID(v1) }).bind(this,this.getCardDetailByID ), ((v) => {
          this.MyLoyaltyCardDetailByID = v
          this.MyLoyaltyCardDetailByID.fJSONPoint = JSON.parse(this.MyLoyaltyCardDetailByID.fJSONPoint)
          this.MyLoyaltyCardDetailByID.fJSONNumber = JSON.parse(this.MyLoyaltyCardDetailByID.fJSONNumber)
          this.MyLoyaltyCardDetailByID.fJSONName = JSON.parse(this.MyLoyaltyCardDetailByID.fJSONName)
          this.MyLoyaltyCardDetailByID.fJSONValidNumber = JSON.parse(this.MyLoyaltyCardDetailByID.fJSONValidNumber)
          this.MyLoyaltyCardDetailByID.fJSONExpiredDate = JSON.parse(this.MyLoyaltyCardDetailByID.fJSONExpiredDate)
          console.log(this.MyLoyaltyCardDetailByID)
          console.log('cekkk')
          SGHelperGlobalVar.addVar('MyLoyaltyCardDetailByID', this.MyLoyaltyCardDetailByID)
        }).bind(this),null);

        this.baseAddAPIParallel('SearchMyLoyaltyEarnPoint', (async (v1,v2,v3) => { return tbVPointHistoryAPI.SearchMyLoyaltyEarnPoint(v1,v2,v3) }).bind(this, this.filterDataEarn,this.sortingDataEarn,this.pagingDataEarn), ((v) => {
          this.LoyaltyEarnPoint = v;
        }).bind(this),null);        
        this.baseAddAPIParallel('SearchMyLoyaltyRedeemPoint', (async (v1,v2,v3) => { return tbVPointHistoryAPI.SearchMyLoyaltyRedeemPoint(v1,v2,v3) }).bind(this, this.filterDataRedeem,this.sortingDataRedeem,this.pagingDataRedeem), ((v) => {
          this.MyLoyaltyRedeemPoint = v;
        }).bind(this),null);
        this.baseAddAPIParallel('SearchMyLoyaltyExpiredPoint', (async (v1,v2,v3) => { return tbVPointHistoryAPI.SearchMyLoyaltyExpiredPoint(v1,v2,v3) }).bind(this, this.filterDataExpire,this.sortingDataExpire,this.pagingDataExpire), ((v) => {
          this.MyLoyaltyExpiredPoint = v;
        }).bind(this),null);


        // this.baseAddAPIParallel('GetEarnPointSetting', (async (v1) => { return tbVEarnPointAPI.GetEarnPointSetting(v1) }).bind(this,this.fID ), ((v) => {
        //   this.EarnPointSetting = v   
        // }).bind(this),null);
        this.baseAddAPIParallel('TenantListPicker', (async (v1,v2) => { return tbVEarnPointAPI.TenantListPicker(v1,v2); }).bind(this, this.pickerInput), ((v) => {
          this.tenantListPicker = v;
        }).bind(this),null);

        // this.baseAddAPIParallel('SearchLoyaltyReward', (async (v1,v2,v3) => { return tbVCardDetailAPI.SearchLoyaltyReward(v1,v2,v3) }).bind(this,this.filterReward, this.sortReward, this.pagingCardReward), ((v) => {
        //   this.rewardData = v;
        // }).bind(this),null);

        this.baseRunAPIParallel();
      }
    }

    async checkAPIBatchStatusAllDone(){
      try {
        await this._showReward()
      } catch (error) {
          Core.Helper.SGHelperErrorHandling.Handling(error,this.checkAPIBatchStatusAllDone.bind(this))
      }
    }

    async checkAPIBatchStatusAllDone2(){
      this.pagingCounter = this.rewardData.length 
      this.pagingCounterEarn = this.LoyaltyEarnPoint.length;
      this.pagingCounterRedeem = this.MyLoyaltyRedeemPoint.length;
      this.pagingCounterExpire = this.MyLoyaltyExpiredPoint.length;

      if(this.rewardData.length<SGHelperType.getPaging())this.setState({stopPulling:true})
      else this.setState({stopPulling:false})
      if(this.pagingCounterEarn<SGHelperType.getPaging())this.setState({stopPullingEarn:true}) 
      else this.setState({stopPullingEarn:false})
      if(this.pagingCounterRedeem<SGHelperType.getPaging())this.setState({stopPullingRedeem:true}) 
      else this.setState({stopPullingRedeem:false})
      if(this.pagingCounterExpire<SGHelperType.getPaging())this.setState({stopPullingExpire:true}) 
      else this.setState({stopPullingExpire:false})
      this.setState({ refresh:false, refreshEarn:false,  refreshRedeem: false, refreshExpire: false})

      console.log(this.EarnPointSetting)
      console.log(this.EarnPointSetting.fAllowedMethod)
      console.log('allowed method')
      for(var i=0;i<this.EarnPointSetting.fAllowedMethod.length;i++){
        if(this.EarnPointSetting.fAllowedMethod[i] == 'building'){
            this.bool1 = false
        }
        if(this.EarnPointSetting.fAllowedMethod[i] == 'tenant'){
          this.bool2 = false
        }
        if(this.EarnPointSetting.fAllowedMethod[i] == 'visitor'){
          this.bool3 = false
        }
      }

      this.alreadyMount = true;
      this.forceUpdate();
    } 

    async _showReward(){
      
      this.filterReward = this.getFilterReward(this._language,this.MyLoyaltyCardDetailByID.fCardKey);
      this.sortReward = this.getSortingReward(this._language);
      this.pagingCardReward = this.getPagingReward()

      this.baseInitAPIParallel(SGHelperGlobalVar.getVar("ResponTimes"), (() => { this.checkAPIBatchStatusAllDone2(); }).bind(this));
      this.baseAddAPIParallel('GetEarnPointSetting', (async (v1) => { return tbVCardDetailAPI.GetEarnPointSetting(v1) }).bind(this, this.MyLoyaltyCardDetailByID.fCardKey), ((v) => {
        SGHelperGlobalVar.addVar('EarnPointSetting', v)
        this.EarnPointSetting = v
      }).bind(this),null);

      this.baseAddAPIParallel('GetNewRegistrationSetting', (async (v1) => { return tbVCardDetailAPI.GetNewRegistrationSetting(v1) }).bind(this, this.MyLoyaltyCardDetailByID.fCardKey), ((v) => {
        SGHelperGlobalVar.addVar('newRegisSetting', v)
      }).bind(this),null);

      this.baseAddAPIParallel('SearchLoyaltyReward', (async (v1,v2,v3) => { return tbVCardDetailAPI.SearchLoyaltyReward(v1,v2,v3) }).bind(this,this.filterReward, this.sortReward, this.pagingCardReward), ((v) => {       
        this.rewardData = v;
      }).bind(this), null);


      this.baseRunAPIParallel();
    }

    async _onRefreshReward() {
      this.setState({ refresh: true ,stopPulling:true})
      if(!this.refresh && !this.state.loading){
          this.refresh=true
          this.pagingCounter=0
          this.filterReward[0].value = this.searchKeyword.keyword
          this.pagingCardReward = this.getPagingReward()
          // this.filterReward = this.getFilterReward(this._language);

          this.baseRunSingleAPIWithRedoOption('SearchLoyaltyReward', (async (v1,v2,v3) => { return tbVCardDetailAPI.SearchLoyaltyReward(v1, v2,v3) }).bind(this, this.filterReward, this.sortReward,this.pagingCardReward), ((v) => {
              this.rewardData = v
              this.pagingCounter = this.rewardData.length
              this.refresh=false
              if(v.length<SGHelperType.getPaging())this.setState({stopPulling:true})
              else this.setState({stopPulling:false})
              this.setState({ refresh: false })
              this.forceUpdate()
          }).bind(this), (()=>{ this.setState({ refresh: false }) }), SGHelperGlobalVar.getVar("ResponTimes"));
      }
  }

  
    async _onLoad(){
      if(!this.state.loading && !this.state.stopPulling){
          this.setState({loading:true})
          this.pagingCardReward = this.getPagingReward()
          this.baseRunSingleAPIWithRedoOption('SearchLoyaltyReward', (async (v1, v2, v3) => { return tbVCardDetailAPI.SearchLoyaltyReward(v1, v2, v3) }).bind(this, this.filterReward,this.sortReward,this.pagingCardReward), ((v) => {           
            var resData =  v
            this.pagingCounter = this.pagingCounter + resData.length

            if(resData.length!==0){
                for(var i=0;i<resData.length;i++){
                    this.rewardData.push(resData[i])
                }
              
            } else this.setState({stopPulling:true})
            this.setState({loading:false})
      }).bind(this), (()=>{ this.setState({loading:false}) }), SGHelperGlobalVar.getVar("ResponTimes"));
      }    
    }

    async _onRefreshEarn() {
      const {SGHelperType, SGHelperGlobalVar} = Core.Helper;
      this.setState({ refreshEarn: true ,stopPullingEarn:true})
      if(!this.refreshEarn && !this.state.loadingEarn){
          this.refreshEarn= true
          this.pagingCounterEarn = 0
          this.pagingDataEarn = this.getPagingDataEarn()
          this.baseRunSingleAPIWithRedoOption('SearchMyLoyaltyEarnPoint', (async (v1,v2,v3) => { return tbVPointHistoryAPI.SearchMyLoyaltyEarnPoint(v1,v2,v3) }).bind(this,this.filterDataEarn,this.sortingDataEarn, this.pagingDataEarn), ((v) => {
            this.LoyaltyEarnPoint = v
            this.pagingCounterEarn = this.LoyaltyEarnPoint.length
    
            if(v.length<SGHelperType.getPaging())this.setState({stopPullingEarn:true})
            else this.setState({stopPullingEarn:false})
    
            this.refreshEarn=false
            this.setState({ filterDataEarn: this.filterDataEarn, sortingDataEarn: this.sortingDataEarn, refreshEarn: false });
            this.forceUpdate();
          }).bind(this), null,SGHelperGlobalVar.getVar("ResponTimes") );
        }
      }
    
    async _onLoadEarn(){
      const {SGHelperGlobalVar} = Core.Helper;
      if(!this.state.loadingEarn && !this.state.stopPullingEarn){
          this.setState({loadingEarn:true})
          this.pagingDataEarn = this.getPagingDataEarn()
          this.baseRunSingleAPIWithRedoOption('SearchMyLoyaltyEarnPoint', (async (v1,v2,v3) => { return tbVPointHistoryAPI.SearchMyLoyaltyEarnPoint(v1,v2,v3) }).bind(this,this.filterDataEarn, this.sortingDataEarn, this.pagingDataEarn), ((v) => {
            var resData = v
            this.pagingCounterEarn = this.pagingCounterEarn + resData.length
  
            if(resData.length!==0){
              for(var i=0;i<resData.length;i++){
                  this.LoyaltyEarnPoint.push(resData[i])
              }
            }else this.setState({stopPullingEarn:true})
            this.setState({loadingEarn:false})
            this.forceUpdate()
          }).bind(this), null,SGHelperGlobalVar.getVar("ResponTimes") );
      }
    }
  
    async _onRefreshRedeem() {
      const {SGHelperType, SGHelperGlobalVar} = Core.Helper;
      this.setState({ refreshRedeem: true ,stopPullingRedeem:true})
      if(!this.refreshRedeem && !this.state.loadingRedeem){
          this.refreshRedeem= true
          this.pagingCounterRedeem = 0
          this.pagingDataRedeem = this.getPagingDataRedeem()
          this.baseRunSingleAPIWithRedoOption('SearchMyLoyaltyRedeemPoint', (async (v1,v2,v3) => { return tbVPointHistoryAPI.SearchMyLoyaltyRedeemPoint(v1,v2,v3) }).bind(this,this.filterDataRedeem,this.sortingDataRedeem, this.pagingDataRedeem), ((v) => {
            this.MyLoyaltyRedeemPoint = v
            this.pagingCounterRedeem = this.MyLoyaltyRedeemPoint.length
            
            if(v.length<SGHelperType.getPaging())this.setState({stopPullingRedeem:true})
            else this.setState({stopPullingRedeem:false})
            
            this.refreshRedeem=false
            this.setState({ filterDataRedeem: this.filterDataRedeem, sortingDataRedeem: this.sortingDataRedeem, refreshRedeem: false });
            this.forceUpdate();
          }).bind(this), null,SGHelperGlobalVar.getVar("ResponTimes") );
        }
      }
  
  
  async _onLoadRedeem(){
    const {SGHelperGlobalVar} = Core.Helper;
    if(!this.state.loadingRedeem && !this.state.stopPullingRedeem){
      this.setState({loadingRedeem:true})
      this.pagingDataRedeem = this.getPagingDataRedeem()
      this.baseRunSingleAPIWithRedoOption('SearchMyLoyaltyRedeemPoint', (async (v1,v2,v3) => { return tbVPointHistoryAPI.SearchMyLoyaltyRedeemPoint(v1,v2,v3) }).bind(this,this.filterDataRedeem, this.sortingDataRedeem, this.pagingDataRedeem), ((v) => {
        var resData = v
          if(resData.length!==0){
            for(var i=0;i<resData.length;i++){
                this.MyLoyaltyRedeemPoint.push(resData[i])
            }
            this.pagingCounterRedeem = this.pagingCounterRedeem + resData.length
          }else this.setState({stopPullingRedeem:true})
          this.setState({loadingRedeem:false})
          this.forceUpdate()
          }).bind(this), null,SGHelperGlobalVar.getVar("ResponTimes") );
        }
    }
  
  async _onRefreshExpire() {
    const {SGHelperType, SGHelperGlobalVar} = Core.Helper;
    this.setState({ refreshExpire: true ,stopPullingExpire:true})
    if(!this.refreshExpire && !this.state.loadingExpire){
      this.refreshExpire= true
      this.pagingCounterExpire = 0
      this.pagingDataExpire = this.getPagingDataExpire()
      this.baseRunSingleAPIWithRedoOption('SearchMyLoyaltyExpiredPoint', (async (v1,v2,v3) => { return tbVPointHistoryAPI.SearchMyLoyaltyExpiredPoint(v1,v2,v3) }).bind(this,this.filterDataExpire,this.sortingDataExpire, this.pagingDataExpire), ((v) => {
        this.MyLoyaltyExpiredPoint = v
        this.pagingCounterExpire = this.MyLoyaltyExpiredPoint.length
        
        if(v.length<SGHelperType.getPaging())this.setState({stopPullingExpire:true})
        else this.setState({stopPullingExpire:false})
        
        this.refreshExpire=false
        this.setState({ filterDataExpire: this.filterDataExpire, sortingDataExpire: this.sortingDataExpire, refreshExpire: false });
        this.forceUpdate();
      }).bind(this), null,SGHelperGlobalVar.getVar("ResponTimes") );
    }
  }
  
  
  async _onLoadExpire(){
    const {SGHelperGlobalVar} = Core.Helper;
    if(!this.state.loadingExpire && !this.state.stopPullingExpire){
      this.setState({loadingExpire:true})
      this.pagingDataExpire = this.getPagingDataExpire()
      this.baseRunSingleAPIWithRedoOption('SearchMyLoyaltyExpiredPoint', (async (v1,v2,v3) => { return tbVPointHistoryAPI.SearchMyLoyaltyExpiredPoint(v1,v2,v3) }).bind(this,this.filterDataExpire, this.sortingDataExpire, this.pagingDataExpire), ((v) => {
        var resData = v
        if(resData.length!==0){
            for(var i=0;i<resData.length;i++){
                this.MyLoyaltyExpiredPoint.push(resData[i])
            }
            this.pagingCounterExpire = this.pagingCounterExpire + resData.length
        }else this.setState({stopPullingExpire:true})
        this.setState({loadingExpire:false})
        this.forceUpdate()
        }).bind(this), null,SGHelperGlobalVar.getVar("ResponTimes") );
      }
    }

  componentWillUnmount() {
      if (this._unsubscribe) { this._unsubscribe(); }
  }

    
  showPopBene(){
    Core.Control.SGPopView.showPopView(this.pvID1);
  }

  hidePopBene(){
    Core.Control.SGPopView.hidePopView(this.pvID1);
  }
  
  _onShowQR(){
    Core.Control.SGPopView.showPopView(this.pvID2);
  }

  _onHideQR(){
    Core.Control.SGPopView.hidePopView(this.pvID2);
  }

  async _checkCustomSetting(input) {
    const { SGDialogBox, SGLocalize } = Core.Control;
    const { SGHelperType, SGHelperGlobalVar } = Core.Helper;
    this.dbID2 = SGDialogBox.showLoading(SGLocalize.translate("AlertMessage.Processing"))
  
    this.baseRunSingleAPIWithRedoOption('GetLoyaltyCustomReceiptSettByCategory', (async (v1) => { return tbVRegisterAPI.GetLoyaltyCustomReceiptSettByCategory(v1); }).bind(this, input), ((v) => {
      SGHelperGlobalVar.setVar('customSetting', v)
      SGDialogBox.hideDialogBox(this.dbID2, true); 
      this.forceUpdate()
    }).bind(this),  null);
  
  }

  render() {
    var style = this.style;
    var { w, h, p } = this.WHP;
    const { SGRootView,SGActivityIndicator,SGImage,SGDatePicker,SGTouchableOpacity, SGScrollView, SGTabView, SGViewPager, SGText, SGView, SGPopView,SGIcon,SGFlatList, SGLocalize, SGQRImage,SGViewShot } = Core.Control;
    const {CustomMenuBar, SearchBarNoBack, SGHelperWindow, BottomNavigationContainer} = Core.Helper;
    const {SGFormButton} = Core.Form
    const {ViewShot} = Core
    this.language = this._language.toUpperCase();
  
    return (
    <SGRootView dummyStatusBar>
      {this.alreadyMount &&
      <SGView>
        <SGPopView modal vPos={'center'} hPos={'center'} animationType={'none'} popViewID={this.pvID1}>
          <SGView style={{ width: w - 8 * p, height: h*0.85, padding: p, borderRadius: 2 * p, backgroundColor: 'white', justifyContent: 'flex-start' }}>
            <SGText preset={SGText.preset.h4B}>{MyTranslator.tr('CardDetail.tc')}</SGText>
            <SGTouchableOpacity style={style.vClose} onPress={() => { this.hidePopBene() }}>
                <SGIcon name={SGIcon.Icon.closecircle} preset={SGIcon.preset.h1} style={{ color: '#181818' }}></SGIcon>
            </SGTouchableOpacity>
            <SGScrollView contentContainerStyle={style.vView1}> 
              <SGText preset={SGText.preset.heading7} style={style.descriptionText}>{this.MyLoyaltyCardDetailByID['fContent'+(this.language)].fTandC}</SGText>
            </SGScrollView>
          </SGView>
        </SGPopView>

        <SGPopView vPos={'center'} hPos={'center'} animationType={'none'} popViewID={this.pvID2}>
          <SGView style={{ width: w * 0.8, height: w, padding: p,borderRadius:3*p, backgroundColor: 'white', justifyContent: 'center' }}>

          <SGViewShot  ref={this.viewShotRef} options={{ format: "png", quality: 1.0 }} onComplete={(e) => {console.log(e)}}>
               <SGText accessible={true} preset={SGText.preset.h5B} numberOfLines={2} style={{alignSelf:'center'}}>{this.MyLoyaltyCardDetailByID['fContent'+(this.language)].fCardName}</SGText>
               <SGText accessible={true} preset={SGText.preset.h7} numberOfLines={1} style={{alignSelf:'center'}}>{this.MyLoyaltyCardDetailByID['fMemberProfileJSON'].fFullName}</SGText>
            <SGQRImage preset={SGQRImage.preset.w1_1} accessible={true} accessibilityLabel={'RewardDetailScreenQRImage'} textStyle={{ color: "white", width: 0, height: 0 }} value={this.props.route.params.fID}></SGQRImage>
          </SGViewShot>
            <SGFormButton accessible={true} accessibilityLabel={'capture'} preset={SGFormButton.preset.tblue} shadow  onPress={() => this.viewShotRef.current.Save()} label={SGLocalize.translate('Button.Save')} />
          </SGView>
        </SGPopView>

      </SGView>
      }

      <CustomMenuBar btnBack accessible={true} accessibilityLabel={'HomeScreenHeader'} navigator={this.props.navigation} imageSetting={this.imset} style={style.throwWHP}></CustomMenuBar>
        {this.alreadyMount ? 
        (
        <SGTabView>
          <SGView tabLabel={MyTranslator.tr('CardDetail.tabCard')}>
            <SGFlatList showsVerticalScrollIndicator={false} refreshing={this.state.refresh} onRefresh={this._onRefreshAllItem.bind(this, true)} contentContainerStyle={{justifyContent: 'flex-start', alignItems: 'flex-start'}} data={this.rewardData} renderItem={({ item }) => {
              return (
                <LoyaltyRewardCard hideButton={this.MyLoyaltyCardDetailByID.fCardBlockedStatus === 'Y' ? true : this.MyLoyaltyCardDetailByID.fActive === 'Y' ? false : true} slider data={item} dataLoyalty={this.MyLoyaltyCardDetailByID} language={this.language} imageSetting={this.imset} navigator={this.props.navigation} style={style.throwWHP}></LoyaltyRewardCard>
      
              );
              }} keyExtractor={item => item.fID}
              onEndReached={this._onLoad.bind(this)}
              onEndReachedThreshold={SGHelperType.getThreshold()}
              ListFooterComponent={()=>{
                  if( this.state.loading)return <SGActivityIndicator preset={SGActivityIndicator.preset.h1} style={{width:w,height:h*0.05}}></SGActivityIndicator>
                  else return null
              }}
              ListHeaderComponent={
                <SGView style={{width:w , flex: 1}}>
                  <SGView style={{width:w*0.98}}>
                    <SGText style={{alignSelf:'flex-start'}} preset={SGText.preset.h4B}>
                      {SGLocalize.translate('CardDetail.memberCardTitle', {buildingName: this.fBuildingName})}
                    </SGText>
                    <Card data={this.MyLoyaltyCardDetailByID} datalang={this.language} imset={this.imset} ></Card>
                  </SGView>

                  <SGView style={style.v3}>
                    <SGTouchableOpacity onPress={() => this._onShowQR()}>
                      <SGText accessible={true} accessibilityLabel={'ProfileHeaderContainerUName'} style={style.myReferralText} preset={SGText.preset.titleH3B}>{MyTranslator.tr('CardDetail.showQRLabel')}</SGText>
                    </SGTouchableOpacity>
                  </SGView>

                  <SGView style={{width:w, backgroundColor: 'black', alignSelf: 'center',backgroundColor: 'black', marginTop: p*2}}>
                    <SGText style={{color: 'white'}} preset={SGText.preset.titleH2B}> {MyTranslator.tr('CardDetail.cardBenefits')}</SGText>
                  </SGView>

                  <SGView style = {{width: w, height: w*0.7, marginTop:-p, justifyContent:'flex-start'}}>
                    {this.MyLoyaltyCardDetailByID['fContent'+(this.language)].fImageSliderBenefit !== null &&
                    this.MyLoyaltyCardDetailByID['fContent'+(this.language)].fImageSliderBenefit.length != 0 &&
                      <SGViewPager pageIndicatorStyle={{ position: 'absolute', bottom: 0 * p, flexDirection: 'row', alignSelf: 'center' }} style={{width:w, height:0.7*w}} accessible={true} accessibilityLabel={'StoreProfileLocationViewPager'} initialPage={0} showPageIndicator={true} transitionStyle={'scroll'}>
                          {(this.MyLoyaltyCardDetailByID['fContent'+(this.language)].fImageSliderBenefit).map((x, index) => {
                            return (
                              <SGView style={{width:w}}accessible={true} key={x.id}>
                                  <SliderBenefit data={x} imset={this.imset}></SliderBenefit>             
                              </SGView>
                            )
                          })}
                      </SGViewPager>
                    }
                  </SGView>

                  <SGTouchableOpacity onPress={this.showPopBene.bind(this)}>
                    <SGView style={style.v6}> 
                        <SGText preset={SGText.preset.h6B}>{MyTranslator.tr('CardDetail.tandc')}</SGText>
                        <SGIcon name={SGIcon.Icon.arrowDown} preset={SGIcon.preset.h8B} style={{color:'black'}}/>
                    </SGView>  
                  </SGTouchableOpacity>
                    
                  <SGView style={{width:w, backgroundColor: 'black', alignSelf: 'center',backgroundColor: 'black', marginVertical: p*4}}>
                    <SGText style={{color: 'white'}} preset={SGText.preset.titleH2B}> {MyTranslator.tr('CardDetail.rewardsSelection')}</SGText>
                  </SGView>
                  <SearchBarNoBack accessible={true} accessibilityLabel={'SearchResultPlaceScreenFullSearchBar'} searchKeyword={this.searchKeyword} language={this.language}  sortData={this.sortReward} onApplySort={(v) => { this._setSort(v) }} onPressFilter={() => { SGHelperNavigation.navigatePush(this.props.navigation, 'Filter', { filterData: this.filterReward, onApplyFilter: (v) => { this._setFilter(v) }, onCloseFilter: (v) => { console.log(v) } }) }} navigator={this.props.navigation} imageSetting={this.imset} refresh={this._onRefreshReward.bind(this)} style={style.vSearchBar}></SearchBarNoBack>

                  {this.rewardData.length == 0 &&
                    <SGView style={{ width: '100%', height: SGHelperWindow.getFooterHeight() }}></SGView>
                  }    
                </SGView>
              }
              >
            </SGFlatList>
          </SGView>

          <SGView style={{width:w, flex:1}} tabLabel={MyTranslator.tr('CardDetail.PointHistory')}>
              <PointHistory 
                LoyaltyEarnPoint={this.LoyaltyEarnPoint} MyLoyaltyRedeemPoint={this.MyLoyaltyRedeemPoint} MyLoyaltyExpiredPoint={this.MyLoyaltyExpiredPoint}
                _onLoadEarn={this._onLoadEarn.bind(this)} _onLoadExpire={this._onLoadExpire.bind(this)} _onLoadRedeem={this._onLoadRedeem.bind(this)} 
                _onRefreshEarn={this._onRefreshEarn.bind(this)} _onRefreshRedeem={this._onRefreshRedeem.bind(this)} _onRefreshExpire={this._onRefreshExpire.bind(this)}
                state={this.state}
              ></PointHistory>
          </SGView>

          {(this.MyLoyaltyCardDetailByID.fActive === 'Y' && this.MyLoyaltyCardDetailByID.fCardBlockedStatus === 'N') &&
            <SGView style={{width:w, flex:1}} tabLabel={MyTranslator.tr('CardDetail.tabEarn')}>
                <EarnPoint
                  MyLoyaltyCardDetailByID={this.MyLoyaltyCardDetailByID}
                  fMemberKey={this.props.route.params.fID} EarnPointSetting={this.EarnPointSetting} tenantListPicker={this.tenantListPicker}
                  fBuildingKey={this.fBuildingKey} bool1={this.bool1} bool2={this.bool2} bool3={this.bool3}
                  fCardBlockedStatus ={this.MyLoyaltyCardDetailByID.fCardBlockedStatus} _checkCustomSetting={this._checkCustomSetting.bind(this)}
                  fCardKey={this.MyLoyaltyCardDetailByID.fCardKey}>
                </EarnPoint>
            </SGView>
          }

        </SGTabView>
        ) 
        : 
        (<SGActivityIndicator preset={SGActivityIndicator.preset.h1} style={{width:w,height:h}}></SGActivityIndicator>)
        }
        
        <SGView style={{ width: '100%', height: SGHelperWindow.getHeaderHeight() }}></SGView>
        <SGView style={{ width: '100%', height: SGHelperWindow.getFooterHeight() }}></SGView>
        <BottomNavigationContainer accessible={true} accessibilityLabel={'RewardDetailScreenBottomNav'} navigator={this.props.navigation} style={style.throwWHP}></BottomNavigationContainer>
    </SGRootView>
    );
  }
}