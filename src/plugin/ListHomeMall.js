import React from 'react';
import Core from '../core/core';
import { SGHelperGlobalVar, SGHelperType } from '../core/helper';
import Card from './plugin1/component/Card';
import MyCardConfirmationCard from './plugin1/component/MyCardConfirmationCard';
import tbVHomeMallAPI from './plugin1/api/tbVHomeMallAPI';
import { RibbonHeader } from '../visitor/component_V2/RibbonHeader';

export default class ListHomeMall extends Core.Screen.SGBaseScreen {
    getDataFilterCard(lang) {
        return ([
            // { name: 'fCardStatus', operator: '=', value: 'approved', visible: false },
        //   { name: 'fCardStatus', operator: '=', value: 'submitted', visible: false },
          { name: 'fBuildingKey', operator: '=', value: this.fBuildingKey, visible: false }
            ]);
      }

    getDataFilterHis(lang) {
        return ([
            // { name: 'fReferralCode', operator: '=', value: this.usData.fReferralCode, visible: false },
            // { name: 'fCardStatus', operator: '=', value: 'approved', visible: false },
        //   { name: 'fCardStatus', operator: '=', value: 'submitted', visible: false },
          { name: 'fBuildingKey', operator: '=', value: this.fBuildingKey, visible: false }
            ]);
      }
      
      getDataSorting(lang) {
        return ([
          // { name: 'fID', descending: false, selected: true, visible: false },
          // { name: 'fCreatedDate', descending: true, selected: true, visible: false },
        ]);
      }
    
      getPagingDataCard(){
        const { SGHelperType } = Core.Helper;
        var itemPerPage = SGHelperType.getPaging()
        return {paging:false, offset:this.pagingCounterCard, totalPerPage:itemPerPage}
      }

      getPagingDataHis(){
        const { SGHelperType } = Core.Helper;
        var itemPerPage = SGHelperType.getPaging()
        return {paging:false, offset:this.pagingCounterHis, totalPerPage:itemPerPage}
      }

    createStyleSheet = (whp) => {
        const { StyleSheet, } = Core;
        var { w, h, p } = whp;
        return StyleSheet.create({
          throwWHP: { width: w, height: h, padding: p },
          v1: { justifyContent: 'center', alignItems: 'flex-start', width: w, height: h, overflow: 'visible' },
          v2: {width:w,height:w*0.16, backgroundColor:'black',flexDirection:'row',justifyContent:'flex-start',borderBottomRightRadius:10,borderBottomLeftRadius:10},
          v3: { width: w * 0.6, height: w * 0.7, backgroundColor: 'white',borderWidth:2,borderRadius:5 },
          vIcon: {color:'white',backgroundColor:'black',marginLeft:w*0.05},
          vIcon2: {color:'white',backgroundColor:'black',marginLeft:w*0.02},
          vIcon3: {color:'white',backgroundColor:'black',marginHorizontal:w*0.02},
          vInput: {alignSelf:'flex-start',marginLeft:w*0.05, width:w*0.5},
          vFilter: {width:w*0.4,marginTop:w*0.03,borderBottomWidth:2,flexDirection:'row',alignSelf:'center'},
          vAscending: { width: w * 0.6, height: w * 0.3, backgroundColor: 'white',borderWidth:2,borderRadius:5 },
          vDescending: {width:w*0.4,marginTop:w*0.03,marginBottom:w*0.03,borderBottomWidth:2,flexDirection:'row',alignSelf:'center'},
        });
    }
    constructor(props, context, ...args) {
        super(props, context, ...args);
        this.style = this.createStyleSheet(this.WHP);
        this.props.navigation.setOptions({
          headerShown: false,
        });
        this._darkMode = false;
        this.cardList = []
        this.historyList = []
        this.pvID1 = Core.Control.SGPopView.getPopViewID();
        this.pvID2 = Core.Control.SGPopView.getPopViewID();
        this.usData = SGHelperGlobalVar.getVar("GlobalCurrentUserData")
        this.fBuildingKey = this.props.route.params.contentKey
        this.filterDataCard = this.getDataFilterCard(this._language);
        this.filterDataHis = this.getDataFilterHis(this._language);
        this.sortData = this.getDataSorting(this._language);
        this.state = {refreshCard : false , 
                     loadingCard : false, 
                     stopPullingCard : false, 
                     filterDataCard: this.filterDataCard, 
                     sortData : this.sortData,
                     refreshHis: false, 
                     loadingHis: false,
                     stopPullingHis: false,
                     filterDataHis: this.filterDataHis};
        this.alreadyMount = false;
        this.pagingCounterCard = 0;
        this.pagingCounterHis = 0;
        this.refreshCard = false;
        this.refreshHis = false;
        this.imageSetting = SGHelperGlobalVar.getVar('GlobalImageSetting')
        this.anonymousMode = SGHelperGlobalVar.getVar('GlobalAnonymous');
        this.forceUpdate();
    }

    showPopFilter(){
        Core.Control.SGPopView.showPopView(this.pvID1);
      }

    showPopSort(){
        Core.Control.SGPopView.showPopView(this.pvID2);
      }

      async _refreshDataParallel(resetPaging=false) {
        const {SGHelperGlobalVar} = Core.Helper;
        this.status ={
            getDataCard:false,
            getDataHis:false,
        }
        if(resetPaging){
          this.pagingCounterCard = 0;
          this.pagingCounterHis = 0;
            this.pagingDataCard = this.getPagingDataCard()
            this.pagingDataHis = this.getPagingDataHis()
    
            // this.baseInitAPIParallel(10000, (async () => { this._dataLoadDone(); }).bind(this));
            this.baseInitAPIParallel(SGHelperGlobalVar.getVar("ResponTimes"), (() => { this._dataLoadDone(); }).bind(this));
            this.baseAddAPIParallel('SearchBuildingHighlightLoyaltyCardList', (async (v1,v2,v3) => { return tbVHomeMallAPI.SearchBuildingHighlightLoyaltyCardList(v1,v2,v3) }).bind(this,this.filterDataCard, this.sortData, this.pagingDataCard), ((v) => {
              this.cardList = v
              console.log(this.cardList.length)
              console.log('lenth')
            }).bind(this), null);
            
            !this.anonymousMode &&
            this.baseAddAPIParallel('SearchMyLoyaltyRegistrationHistory', (async (v1,v2,v3) => { return tbVHomeMallAPI.SearchMyLoyaltyRegistrationHistory(v1,v2,v3) }).bind(this,this.filterDataHis, this.sortData, this.pagingDataHis), ((v) => {
              this.historyList = v;
            }).bind(this), null);
          
            this.baseRunAPIParallel();
        }
      
        this.forceUpdate()
    }

    _dataLoadDone() {
        this.pagingCounterCard = this.cardList.length;
        this.pagingCounterHis = this.historyList.length;
        if(this.pagingCounterCard<SGHelperType.getPaging())this.setState({stopPullingCard:true}) 
        else this.setState({stopPullingCard:false})
        if(this.pagingCounterHis<SGHelperType.getPaging())this.setState({stopPullingHis:true}) 
        else this.setState({stopPullingHis:false})
        
        this.setState({refreshCard:false,refreshHis:false})
        this.alreadyMount=true
        this.forceUpdate();
    }

    async _onRefreshCardList(resetPaging = false) {
        const {SGHelperType} = Core.Helper;
        // Core.log('saya onRefreshHistory')
        this.setState({ refreshCard: true ,stopPullingCard:true})
        if(!this.refreshCard && !this.state.loadingCard){
            // Core.log('Saya masuk ke dalam if')
            this.refreshCard= true
            this.pagingCounterCard = 0
            this.pagingDataCard = this.getPagingDataCard()
            this.baseRunSingleAPIWithRedoOption('SearchBuildingHighlightLoyaltyCardList', (async (v1,v2,v3) => { return tbVHomeMallAPI.SearchBuildingHighlightLoyaltyCardList(v1,v2,v3) }).bind(this,this.filterDataCard, this.sortData, this.pagingDataCard), ((v) => {
                this.cardList = v
                this.pagingCounterCard = this.cardList.length
                if(v.length<SGHelperType.getPaging())this.setState({stopPullingCard:true})
                else this.setState({stopPullingCard:false})
                this.refreshCard=false
                this.setState({ filterDataCard: this.filterDataCard, sortData: this.sortData, refreshCard: false });
                this.forceUpdate();
                }).bind(this), null,SGHelperGlobalVar.getVar("ResponTimes") );
        }
    }

    async _onRefreshHistoryList(resetPaging = false) {
        const {SGHelperType} = Core.Helper;
        // Core.log('saya onRefreshHistory')
        this.setState({ refreshHis: true ,stopPullingHis:true})
        if(!this.refreshHis && !this.state.loadingHis){
            // Core.log('Saya masuk ke dalam if')
            this.refreshHis= true
            this.pagingCounterHis = 0
            this.pagingDataHis = this.getPagingDataHis()
            this.baseRunSingleAPIWithRedoOption('SearchMyLoyaltyRegistrationHistory', (async (v1,v2,v3) => { return tbVHomeMallAPI.SearchMyLoyaltyRegistrationHistory(v1,v2,v3) }).bind(this,this.filterDataHis, this.sortData, this.pagingDataHis), ((v) => {
                this.historyList = v
                this.pagingCounterHis = this.historyList.length
                if(v.length<SGHelperType.getPaging())this.setState({stopPullingHis:true})
                else this.setState({stopPullingHis:false})
                this.refreshHis=false
                this.setState({ filterDataHis: this.filterDataHis, sortData: this.sortData, refreshHis: false });
                this.forceUpdate();
                }).bind(this), null,SGHelperGlobalVar.getVar("ResponTimes") );
        }
    }

    async _onLoadCardItem(){
        const {SGHelperGlobalVar} = Core.Helper;
        console.log(this.state.stopPullingCard)
        console.log(this.state.loadingCard)
        console.log('load')
        if(!this.state.loadingCard && !this.state.stopPullingCard){
          console.log('onload nih')
            this.setState({loadingCard:true})
            this.pagingDataCard = this.getPagingDataCard()
            this.baseRunSingleAPIWithRedoOption('SearchBuildingHighlightLoyaltyCardList', (async (v1,v2,v3) => { return tbVHomeMallAPI.SearchBuildingHighlightLoyaltyCardList(v1,v2,v3) }).bind(this,this.filterDataCard, this.sortData, this.pagingDataCard), ((v) => {
              var resData = v
                if(resData.length!==0){
                    for(var i=0;i<resData.length;i++){
                        this.cardList.push(resData[i])
                    }
                    this.pagingCounterCard = this.pagingCounterCard + resData.length
                }else this.setState({stopPullingCard:true})
                this.setState({loadingCard:false})
                this.forceUpdate()
                }).bind(this), null,SGHelperGlobalVar.getVar("ResponTimes") );
        }
    }

    async _onLoadHistoryItem(){
        const {SGHelperGlobalVar} = Core.Helper;
        if(!this.state.loadingHis && !this.state.stopPullingHis){
          this.setState({loadingHis:true})
          this.pagingDataHis = this.getPagingDataHis()
          this.baseRunSingleAPIWithRedoOption('SearchMyLoyaltyRegistrationHistory', (async (v1,v2,v3) => { return tbVHomeMallAPI.SearchMyLoyaltyRegistrationHistory(v1,v2,v3) }).bind(this,this.filterDataHis, this.sortData, this.pagingDataHis), ((v) => {
            var resData = v
              if(resData.length!==0){
                  for(var i=0;i<resData.length;i++){
                      this.historyList.push(resData[i])
                  }
                  this.pagingCounterHis = this.pagingCounterHis + resData.length
              }else this.setState({stopPullingHis:true})
              this.setState({loadingHis:false})
              this.forceUpdate();
              }).bind(this), null,SGHelperGlobalVar.getVar("ResponTimes") );
        }
      }
    

   async componentDidMount(){
    await this._refreshDataParallel(true)
    this._unsubscribe = this.props.navigation.addListener('focus', async () => {
        this._refreshDataParallel()
    });
    this.forceUpdate()
  }


    render() {
      var language = this._language.toUpperCase();
      var style = this.style;
      var { w, h, p } = this.WHP;
      const { SGImage, SGRootView,SGTouchableOpacity,  SGFlatList, SGScrollView, SGTextInput, SGFilePicker, SGText, SGView, SGTabView,SGIcon, SGActivityIndicator } = Core.Control;
      const { SGFormFilePicker, SGFormImagePicker, SGFormTextInput, SGFormPicker, SGFormDatePicker, SGFormTimePicker, SGFormMapPicker, SGFormButton, SGFormSwitch } =Core.Form;
      const {SGHelperNavigation, VisitorHelper, SGHelperWindow ,CustomMenuBar, BottomNavigationContainer} = Core.Helper;
      return (
        <SGRootView dummyStatusBar style = {{width: w, flex:1, backgroundColor: 'white'}}>
        <CustomMenuBar btnBack accessible={true} accessibilityLabel={'HomeScreenHeader'} navigator={this.props.navigation} imageSetting={this.imageSetting} style={style.throwWHP}></CustomMenuBar>
        
        {this.alreadyMount ?
        (
          !this.anonymousMode ?
          <SGTabView style={{width:w}}>
            <SGView tabLabel='Cards' style = {{flex:1, width: '100%'}}>
              <SGFlatList showsVerticalScrollIndicator={false} refreshing={this.state.refreshCard} onRefresh={this._onRefreshCardList.bind(this, true)} contentContainerStyle={{justifyContent: 'flex-start', alignItems: 'center' }} data={this.cardList} renderItem={({ item }) => {
                return (
                  <SGTouchableOpacity style = {{marginTop: 3*p}} onPress={() => { SGHelperNavigation.navigatePush(this.props.navigation, 'LoyaltyDetail', {contentKey: item.fID, buildingName: this.props.route.params.buildingName, buildingKey: this.fBuildingKey}) }}>
                    <Card data={item} datalang = {language} imset = {this.imageSetting} ></Card>
                  </SGTouchableOpacity>
                
                  );
                  }} keyExtractor={item => item.fID}   
                  // onEndReached={this._onLoadCardItem.bind(this)}
                  // onEndReachedThreshold={SGHelperType.getThreshold()}
                  // ListFooterComponent={()=>{
                  //   if( this.state.loadingCard )return <SGActivityIndicator preset={SGActivityIndicator.preset.h1} style={{width:w,height:h*0.05}}></SGActivityIndicator>
                  //       else return null
                  //   }}
              >
              </SGFlatList>
            </SGView>
            <SGView style={{flex: 1}} tabLabel='Confirmation'>
              <SGFlatList showsVerticalScrollIndicator={false} refreshing={this.state.refreshHis} onRefresh={this._onRefreshHistoryList.bind(this, true)} contentContainerStyle={{justifyContent: 'flex-start', alignItems: 'center' }} data={this.historyList} renderItem={({ item }) => {
                return (
                  this.historyList.length != 0 &&
                    <MyCardConfirmationCard data = {item} datalang = {language}/>  
                    
                  );
                  }} keyExtractor={item => item.fID}
                  // onEndReached={this._onLoadHistoryItem.bind(this)}
                  // onEndReachedThreshold={SGHelperType.getThreshold()}
                  // ListFooterComponent={()=>{
                  //   if( this.state.loadingHis )return <SGActivityIndicator preset={SGActivityIndicator.preset.h1} style={{width:w,height:h*0.05}}></SGActivityIndicator>
                  //       else return null
                  //   }}
                    >

                    
                </SGFlatList>
            </SGView>
          </SGTabView>
          :
          <SGView style = {{flex:1, width: '100%'}}>
             <RibbonHeader imageSetting={this.imageSetting} title={"List Cards"} ></RibbonHeader>
            <SGFlatList showsVerticalScrollIndicator={false} refreshing={this.state.refreshCard} onRefresh={this._onRefreshCardList.bind(this, true)} contentContainerStyle={{justifyContent: 'flex-start', alignItems: 'center' }} data={this.cardList} renderItem={({ item }) => {
              return (
                <SGTouchableOpacity style = {{marginTop: 3*p}} onPress={() => { SGHelperNavigation.navigatePush(this.props.navigation, 'LoyaltyDetail', {contentKey: item.fID, buildingName: this.props.route.params.buildingName, buildingKey: this.fBuildingKey}) }}>
                  <Card data={item} datalang = {language} imset = {this.imageSetting} ></Card>
                </SGTouchableOpacity>
              
                );
                }} keyExtractor={item => item.fID} 
                // onEndReached={this._onLoadCardItem.bind(this)}
                // onEndReachedThreshold={SGHelperType.getThreshold()}
                // ListFooterComponent={()=>{
                //   if( this.state.loadingCard )return <SGActivityIndicator preset={SGActivityIndicator.preset.h1} style={{width:w,height:h*0.05}}></SGActivityIndicator>
                //       else return null
                //   }}
                >
            </SGFlatList>
        </SGView>
        )
        :
        (null)}

      <SGView style={{ width: '100%', height: SGHelperWindow.getHeaderHeight() }}></SGView>
      <SGView style={{ width: '100%', height: SGHelperWindow.getFooterHeight() }}></SGView>
      <BottomNavigationContainer accessible={true} accessibilityLabel={'RewardDetailScreenBottomNav'} navigator={this.props.navigation} style={style.throwWHP}></BottomNavigationContainer>
    </SGRootView>
    );
  }
}