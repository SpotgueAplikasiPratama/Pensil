import React from 'react';
import Core from '../core/core';
import Card from './plugin1/component/Card';
import CardModel from './plugin1/model/CardModel';
import RewardModel from './plugin1/model/RewardModel.js';
import { LoyaltyRewardCard } from '../visitor/container_V2/LoyaltyRewardCard';
import tbVHomeMallAPI from './plugin1/api/tbVHomeMallAPI';
import SliderBenefit from './plugin1/component/SliderBenefit';
import MyTranslator from './lessons/locale/MyTranslator';
import tbVCardDetailAPI from './plugin1/api/tbVCardDetailAPI';


export default class HomeMallDetail extends Core.Screen.SGBaseScreen {
  getFilterReward(lang,cardKey) {
    const { SGLocalize } = Core.Control
    return ([
      { name: this._language.toUpperCase(), operator: 'SEARCH', value: this.searchKeyword.keyword },
      { name: 'buildingKey', operator: '=', value:this.props.route.params.buildingKey, visible: false },
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
  createStyleSheet = (whp) => {
    var { w, h, p } = whp;
    return Core.StyleSheet.create({
      throwWHP: { width: w, height: h, padding: p },
      // v1: { justifyContent: 'center', alignItems: 'flex-start', width: w, height: h, overflow: 'visible' },
      v2: {width:w,height:w*0.16, backgroundColor:'black',flexDirection:'row',justifyContent:'flex-start',borderBottomRightRadius:10,borderBottomLeftRadius:10},
      v3: {width:w*0.9, justifyContent:'center'},
      vButton1: {width:w*0.9, marginVertical: p*2},
      v6: {width: 0.95*w,backgroundColor:'white', borderRadius:10, justifyContent:'center',paddingVertical:2*p, borderWidth:1, borderColor:'lightgrey', marginTop: p*4},
      vTV: {width: 0.8*w,backgroundColor:'white', borderRadius:10, flexDirection:'row', justifyContent:'space-between',paddingVertical:4*p, marginTop:3*p, borderWidth:1, borderColor:'lightgrey'}, 
      vImage: { width: 0.95*w, height:0.5*w,borderRadius:10, alignItems:'flex-start', justifyContent:'flex-start',paddingVertical:4*p},
      vIcon: {color:'white',backgroundColor:'black',marginLeft:w*0.05},
      vSV: {width:w,alignSelf:'center',flexDirection:'column',justifyContent:'space-between'},  
      vSearchBar:{width:w, backgroundColor: 'white' , padding:p},

      //popview t&C
      vClose: { position: 'absolute', right: 0, top: -2 },
      vView1:{flex:1, justifyContent: 'flex-start', margin: p*3},
      descriptionText: { color: '#000000', alignSelf: 'flex-start' },
    });
  }

  constructor(props, context, ...args) {
    const {SGHelperGlobalVar} = Core.Helper;
    super(props, context, ...args);
    this.props.navigation.setOptions({
      headerShown: false,
    });
    this.style = this.createStyleSheet(this.WHP);
    this.pvID1 = Core.Control.SGPopView.getPopViewID();
    this.imset = SGHelperGlobalVar.getVar('GlobalImageSetting')
    this.anonymousMode = SGHelperGlobalVar.getVar('GlobalAnonymous');
    this.cardfID = this.props.route.params.contentKey 
    this.searchKeyword = {keyword: ''}
    this.carddata = new CardModel();
    this.state = {refresh:false};
    this.rewardData = new RewardModel(); 
    this.LoyaltyReward = []

    this.alreadyMount = false;
    this.pagingCounter = 0
    this.state = {refresh:false, loading: false, stopPulling: false};
    this.refresh = false;
  }

  async componentDidMount(){
    await this._onRefreshAllItem(true);
    this._unsubscribe = this.props.navigation.addListener('focus', async () => {
        await this._onRefreshAllItem();
    });
    this.forceUpdate()

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

      this.baseInitAPIParallel(SGHelperGlobalVar.getVar("ResponTimes"), (() => { this.checkAPIBatchStatusAllDone(); }).bind(this));
       
      this.baseAddAPIParallel('GetEarnPointSetting', (async (v1) => { return tbVCardDetailAPI.GetEarnPointSetting(v1) }).bind(this, this.cardfID), ((v) => {
          SGHelperGlobalVar.addVar('EarnPointSetting', v)
        }).bind(this),null);

        this.baseAddAPIParallel('GetNewRegistrationSetting', (async (v1) => { return tbVCardDetailAPI.GetNewRegistrationSetting(v1) }).bind(this, this.cardfID), ((v) => {
          SGHelperGlobalVar.addVar('newRegisSetting', v)
        }).bind(this),null);

        this.baseAddAPIParallel('GetBuildingHighlightLoyaltyCardDetail', (async (v1) => { return tbVHomeMallAPI.GetBuildingHighlightLoyaltyCardDetail(v1) }).bind(this, this.cardfID), ((v) => {
          this.GetBuilding = v;
          this.GetBuilding.fJSONPoint = JSON.parse(this.GetBuilding.fJSONPoint)
          this.GetBuilding.fJSONNumber = JSON.parse(this.GetBuilding.fJSONNumber)
          this.GetBuilding.fJSONName = JSON.parse(this.GetBuilding.fJSONName)
          this.GetBuilding.fJSONValidNumber = JSON.parse(this.GetBuilding.fJSONValidNumber)
          this.GetBuilding.fJSONExpiredDate = JSON.parse(this.GetBuilding.fJSONExpiredDate)
        }).bind(this),null);
      this.baseRunAPIParallel();
    }
  }

  async _showReward(){
    this.filterReward = this.getFilterReward(this._language,this.GetBuilding.fCardKey);
    this.sortReward = this.getSortingReward(this._language);
    this.pagingCardReward = this.getPagingReward()
    this.baseRunSingleAPIWithRedoOption('SearchLoyaltyReward', (async (v1, v2, v3) => { return tbVHomeMallAPI.SearchLoyaltyReward(v1, v2, v3) }).bind(this, this.filterReward,this.sortReward,this.pagingCardReward), ((v) => {           
      this.LoyaltyReward = v;
      const {SGHelperType} = Core.Helper
      this.pagingCounter = this.LoyaltyReward.length 
      if(this.LoyaltyReward.length<SGHelperType.getPaging())this.setState({stopPulling:true})
      else this.setState({stopPulling:false})
      this.setState({ refresh:false})
      this.alreadyMount = true;
      this.forceUpdate();
    }).bind(this), (()=>{}), Core.Helper.SGHelperGlobalVar.getVar("ResponTimes"));
  }

  async checkAPIBatchStatusAllDone(){
    try {
      await this._showReward()
    } catch (error) {
        Core.Helper.SGHelperErrorHandling.Handling(error,this.checkAPIBatchStatusAllDone.bind(this))
    }
  }

  async _onRefreshReward() {
    const {SGHelperType, SGHelperGlobalVar} = Core.Helper
    this.setState({ refresh: true ,stopPulling:true})
    console.log('refresh reward')
    if(!this.refresh && !this.state.loading){
      console.log('refresh reward 2')
        this.refresh=true
        this.pagingCounter=0
        this.filterReward[0].value = this.searchKeyword.keyword
        this.pagingCardReward = this.getPagingReward()
        console.log(this.getFilterReward(this._language,this.GetBuilding.fCardKey));
        // this.filterReward = this.getFilterReward(this._language,this.GetBuilding.fCardKey);
        // this.sortReward = this.getSortingReward(this._language);
        this.baseRunSingleAPIWithRedoOption('SearchLoyaltyReward', (async (v1,v2,v3) => { return tbVHomeMallAPI.SearchLoyaltyReward(v1, v2,v3) }).bind(this, this.filterReward, this.sortReward,this.pagingCardReward), ((v) => {
            this.LoyaltyReward = v
            console.log(this.LoyaltyReward);
            this.pagingCounter = this.LoyaltyReward.length
            this.refresh=false
            if(v.length<SGHelperType.getPaging())this.setState({stopPulling:true})
            else this.setState({stopPulling:false})
            this.setState({ refresh: false })
            this.forceUpdate()
        }).bind(this), (()=>{ this.setState({ refresh: false }) }), SGHelperGlobalVar.getVar("ResponTimes"));
    }
  }

  async _onLoad(){
    const {SGHelperType, SGHelperGlobalVar} = Core.Helper
    if(!this.state.loading && !this.state.stopPulling){
        this.setState({loading:true})
        this.pagingCardReward = this.getPagingReward()
        // this.filterReward = this.getFilterReward(this._language,this.GetBuilding.fCardKey);
        // this.sortReward = this.getSortingReward(this._language);
        this.baseRunSingleAPIWithRedoOption('SearchLoyaltyReward', (async (v1, v2, v3) => { return tbVHomeMallAPI.SearchLoyaltyReward(v1, v2, v3) }).bind(this, this.filterReward,this.sortReward,this.pagingCardReward), ((v) => {           
          var resData =  v
          this.pagingCounter = this.pagingCounter + resData.length

          if(resData.length!==0){
              for(var i=0;i<resData.length;i++){
                  this.LoyaltyReward.push(resData[i])
              }
            
          } else this.setState({stopPulling:true})
          this.setState({loading:false})
    }).bind(this), (()=>{ this.setState({loading:false}) }), SGHelperGlobalVar.getVar("ResponTimes"));
    }    
  }

  showPopBene(){
    Core.Control.SGPopView.showPopView(this.pvID1);
  }

  hidePopBene(){
    Core.Control.SGPopView.hidePopView(this.pvID1);
  }

  render() {
    var style = this.style;
    var { w, h, p } = this.WHP;
    const { SGRootView,SGTouchableOpacity, SGActivityIndicator,SGButton, SGViewPager, SGText, SGView, SGPopView,SGIcon,SGFlatList, SGScrollView, SGLocalize } = Core.Control;
    const {SGHelperNavigation, CustomMenuBar, SGHelperType, SearchBarNoBack, SGHelperWindow, BottomNavigationContainer} = Core.Helper;
    var language = this._language.toUpperCase()
    // Core.log(this.carddata)
    return (
    <SGRootView dummyStatusBar>
      <CustomMenuBar btnBack accessible={true} accessibilityLabel={'HomeScreenHeader'} navigator={this.props.navigation} imageSetting={this.imset} style={style.throwWHP}></CustomMenuBar>
      {this.alreadyMount &&
        <SGPopView vPos={'center'} hPos={'center'} animationType={'none'} popViewID={this.pvID1}>
          <SGView style={{ width: w - 8 * p, height: h*0.85, padding: p, borderRadius: 2 * p, backgroundColor: 'white', justifyContent: 'flex-start' }}>
            <SGText preset={SGText.preset.h4B}>{MyTranslator.tr('CardDetail.tc')}</SGText>
            <SGTouchableOpacity style={style.vClose} onPress={() => { this.hidePopBene() }}>
                <SGIcon name={SGIcon.Icon.closecircle} preset={SGIcon.preset.h1} style={{ color: '#181818' }}></SGIcon>
            </SGTouchableOpacity>
            <SGScrollView contentContainerStyle={style.vView1}> 
              <SGText preset={SGText.preset.heading7} style={style.descriptionText}>{this.GetBuilding['fContent' + language].fTandC}</SGText>
            </SGScrollView>
          </SGView>
        </SGPopView>
      }
      { this.alreadyMount ? (
        <SGFlatList showsVerticalScrollIndicator={false} refreshing={this.state.refresh} onRefresh={this._onRefreshAllItem.bind(this, true)} contentContainerStyle={{justifyContent: 'flex-start', alignItems: 'flex-start'}} data={this.LoyaltyReward} renderItem={({ item }) => {
        return (
          <LoyaltyRewardCard dataLoyalty={this.GetBuilding} hideButton={true} slider data={item} language={this.Language} imageSetting={this.imset} navigator={this.props.navigation} style={style.throwWHP}></LoyaltyRewardCard>
        );
        }} keyExtractor={item => Core.Helper.SGHelperType.getGUID()}
        onEndReached={this._onLoad.bind(this)}
        onEndReachedThreshold={SGHelperType.getThreshold()}
        ListFooterComponent={()=>{
            if( this.state.loading)return <SGActivityIndicator preset={SGActivityIndicator.preset.h1} style={{width:w,height:h*0.05}}></SGActivityIndicator>
            else return null
        }}
        ListHeaderComponent={
        <SGView style={{marginBottom: p*4}}>
          <SGView style={{width:w*0.98}}>
            <SGText style={{alignSelf:'flex-start'}} preset={SGText.preset.h4B}>
              {SGLocalize.translate('CardDetail.memberCardTitle', {buildingName: this.props.route.params.buildingName})}
            </SGText>
            <Card data={this.GetBuilding} datalang={language} imset={this.imset} ></Card>
          </SGView>
          
          {!this.anonymousMode &&
            <SGView style={style.v3}>
              <SGButton style = {style.vButton1} label={MyTranslator.tr('CardDetail.RegistrerButton')} onPress={() => { SGHelperNavigation.navigatePush(this.props.navigation, 'RegisterScreen', {buildingKey: this.props.route.params.buildingKey, data: this.GetBuilding}) }}/>
            </SGView>
          }
          <SGView style={{width:w, backgroundColor: 'black', alignSelf: 'center',backgroundColor: 'black', marginVertical: p*4}}>
            <SGText style={{color: 'white'}} preset={SGText.preset.titleH2B}>{MyTranslator.tr('CardDetail.cardBenefits')}</SGText>
          </SGView>      
          <SGView style = {{width: w, height: w*0.7, marginTop:-p, justifyContent:'flex-start'}}>
            {this.GetBuilding['fContent'+this._language.toUpperCase()].fImageSliderBenefit.length != 0 &&
              <SGViewPager pageIndicatorStyle={{ position: 'absolute', bottom: 0 * p, flexDirection: 'row', alignSelf: 'center' }} style={{width:w, height:0.7*w}} accessible={true} accessibilityLabel={'StoreProfileLocationViewPager'} initialPage={0} showPageIndicator={true} transitionStyle={'scroll'}>
                  {(this.GetBuilding['fContent'+this._language.toUpperCase()].fImageSliderBenefit).map((x, index) => {
                    return (
                      <SGView style={{width:w}}accessible={true} key={Core.Helper.SGHelperType.getGUID()}>
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
          <SearchBarNoBack accessible={true} accessibilityLabel={'SearchResultPlaceScreenFullSearchBar'} searchKeyword={this.searchKeyword} language={language}  sortData={this.sortReward} onApplySort={(v) => { this._setSort(v) }} onPressFilter={() => { SGHelperNavigation.navigatePush(this.props.navigation, 'Filter', { filterData: this.filterReward, onApplyFilter: (v) => { this._setFilter(v) }, onCloseFilter: (v) => { console.log(v) } }) }} navigator={this.props.navigation} imageSetting={this.imset} refresh={this._onRefreshReward.bind(this)} style={style.vSearchBar}></SearchBarNoBack>
          
          {this.LoyaltyReward.length == 0 &&
            <SGView style={{ width: '100%', height: SGHelperWindow.getFooterHeight() }}></SGView>
          }
        </SGView>
      }
      >
      </SGFlatList>
      )
      :
      (<SGView accessible={true} accessibilityLabel={'HomeMallDetailView'} style={{ flex: 1, color: '#606060' }}>
      <SGActivityIndicator preset={SGActivityIndicator.preset.h1} style={{ flex: 1 }}></SGActivityIndicator>
    </SGView>)
      }
      <SGView style={{ width: '100%', height: SGHelperWindow.getHeaderHeight() }}></SGView>
      <SGView style={{ width: '100%', height: SGHelperWindow.getFooterHeight() }}></SGView>
      <BottomNavigationContainer accessible={true} accessibilityLabel={'RewardDetailScreenBottomNav'} navigator={this.props.navigation} style={style.throwWHP}></BottomNavigationContainer>
    
  </SGRootView>    
  );
}
}