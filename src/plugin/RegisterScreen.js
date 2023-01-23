import React from 'react';
import Core from '../core/core'
import Card from './plugin1/component/Card';
import CardModel from './plugin1/model/CardModel';
import NewRegistrationForm from './plugin1/model/NewRegistrationForm';
import ExistingRegistrationForm from './plugin1/model/ExistingRegistrationForm';
import tbVRegisterAPI from './plugin1/api/tbVRegisterAPI';
import AddNewMemberForm from './plugin1/component/AddNewMemberForm';
import ExistingMemberForm from './plugin1/component/ExistingMemberForm';
import MyTranslator from './lessons/locale/MyTranslator'

export default class RegisterScreen extends Core.Screen.SGBaseScreen {
  getDataFilter(lang) {
    return ([
      // { name: 'fCardBlockedStatus', operator: '=', value: 'Y', visible: false }

    ]);
  }

  getDataSorting(lang) {
    return ([
        // { name: 'fLastModifiedDate', descending: true, selected: true, visible: false },
        // { name: 'fCardName' + lang, descending: false, selected: true, visible: false },
        // { name: 'fID', descending: true, selected: true, visible: false },
    ]);
  }


  createStyleSheet = (whp) => {
    var { w, h, p } = whp;
    return Core.StyleSheet.create({
      throwWHP: { width: w, height: h, padding: p },
      v1: { justifyContent: 'center', alignItems: 'flex-start', width: w, height: h, overflow: 'visible' },
      to1: { marginBottom: 10 },
      t1: { color: 'blue' },
      v2: {marginTop: 20, width: w,flex: 1, backgroundColor: 'blue'},
      vTAS: {alignSelf: 'flex-start'},
      vButton: {width: 0.8*w, height: 0.1*w, bottom: 0},
      vTab: {height:h, justifyContent: 'flex-start', backgroundColor:'white', padding: 0.1*w},
    });
  }

  constructor(props, context, ...args) {
    const {SGHelperGlobalVar} = Core.Helper
    super(props, context, ...args);
    // this.setting = this.props.setting;
    this.props.navigation.setOptions({
      headerShown: false,
    });
    this.style = this.createStyleSheet(this.WHP);
    this.filterData = this.getDataFilter(this._language);
    this.sortData = this.getDataSorting(this._language);
    this.usData = SGHelperGlobalVar.getVar('GlobalCurrentUserData')
    this.alreadyMount = false;
    this.fBuildingKey = this.props.route.params.buildingKey;
    this.inputDTO = {language : this._language,fBuildingKey : this.fBuildingKey} 
    this.formDisabled = false;
    this.NewRegistrationFormSetting = {};
    this.ExistingRegistrationFormSetting = {};
    this.NewRegistrationSetting = {};
    this.refresh = false;
    this.state = {refresh:false};
    this.card = this.props.route.params.data;
    this.imset = SGHelperGlobalVar.getVar('GlobalImageSetting')
  }


  async _onRefreshAllItem() {
    const { SGHelperGlobalVar } = Core.Helper;
        this.baseInitAPIParallel(SGHelperGlobalVar.getVar("ResponTimes"), (() => { this.checkAPIBatchStatusAllDone(); }).bind(this));
        
        this.baseAddAPIParallel('GetNewRegistrationFormSetting', (async (v1) => { return tbVRegisterAPI.GetNewRegistrationFormSetting(v1) }).bind(this, this.fBuildingKey), ((v) => {
          SGHelperGlobalVar.addVar('NewRegistrationFormSetting', v)
          this.NewRegistrationFormSetting = SGHelperGlobalVar.getVar('NewRegistrationFormSetting');
        }).bind(this),null);

        this.baseAddAPIParallel('GetExistingRegistrationFormSetting', (async (v1) => { return tbVRegisterAPI.GetExistingRegistrationFormSetting(v1) }).bind(this, this.fBuildingKey), ((v) => {
          SGHelperGlobalVar.addVar('ExistingRegistrationFormSetting', v)
          this.ExistingRegistrationFormSetting = SGHelperGlobalVar.getVar('ExistingRegistrationFormSetting');
        }).bind(this),null);

        this.baseAddAPIParallel('GetNewRegistrationSetting', (async (v1) => { return tbVRegisterAPI.GetNewRegistrationSetting(v1) }).bind(this, this.card.fCardKey), ((v) => {
          SGHelperGlobalVar.addVar('NewRegistrationSetting', v)
          this.NewRegistrationSetting = SGHelperGlobalVar.getVar('NewRegistrationSetting');
        }).bind(this),null);
      
        this.baseAddAPIParallel('TenantListPicker', (async (v1) => { return tbVRegisterAPI.TenantListPicker(v1); }).bind(this, this.inputDTO), ((v) => {
          this.tenantListPicker = v;
        }).bind(this),null);

        this.baseAddAPIParallel('CardListPicker', (async (v1) => { return tbVRegisterAPI.CardListPicker(v1); }).bind(this, this.inputDTO), ((v) => {
          this.CardListPicker = v;
        }).bind(this),null);

        this.baseAddAPIParallel('SearchLocationMatrix', (async (v1,v2) => { return tbVRegisterAPI.SearchLocationMatrix(v1,v2) }).bind(this,this.filterData, this.sortData), ((v) => {
          this.LocationMatrix = v;
        }).bind(this),null);

        this.baseAddAPIParallel('GetUDFLoyaltyByBuilding', (async (v1) => { return tbVRegisterAPI.GetUDFLoyaltyByBuilding(v1); }).bind(this, this.fBuildingKey), ((v) => {
          SGHelperGlobalVar.addVar('LoyaltyNewUDFSetting', v)
          this.UDFLoyaltySetting = v;
        }).bind(this),null);

        this.baseRunAPIParallel();
  }

  checkAPIBatchStatusAllDone(){
    this.setState({ refresh:false})
    this.NewMemberForm = new NewRegistrationForm();
    this.ExistingMemberForm = new ExistingRegistrationForm();
    this.alreadyMount = true;
    this.forceUpdate();
  }

  async componentDidMount(){
    const {SGHelperGlobalVar} = Core.Helper
    if(SGHelperGlobalVar.getVar('customSetting') == null){
      SGHelperGlobalVar.addVar('customSetting', {})
    }else{
      SGHelperGlobalVar.setVar('customSetting', {})
    }

    await this._onRefreshAllItem();
    this._unsubscribe = this.props.navigation.addListener('focus', async () => {
        await this._onRefreshAllItem();
    });
  }

  async _onAddPressNew(data){
    const {SGDialogBox, SGPopView} = Core.Control
    const {SGHelperErrorHandling, SGHelperNavigation, SGHelperType} = Core.Helper
    this.inputData = SGHelperType.copyJSON(data.getCurrentJSON())
    this.inputData.fBuildingKey = this.fBuildingKey;
    this.inputData.fReferralCode = this.usData.fReferralCode;
    for(var i = 0 ; i < 8 ; i++){
      this.inputData.fMemberProfileJSON['fCustomField'+(i+1)] = (this.UDFLoyaltySetting.fUDFLoyalty[i].fType == 'image') ? JSON.stringify(this.inputData.fMemberProfileJSON['fCustomField'+(i+1)]) : this.inputData.fMemberProfileJSON['fCustomField'+(i+1)]
    }
    try {
      var update = true;
      if((this.NewRegistrationFormSetting.fIDCardNumber =='hidden' || this.NewRegistrationFormSetting.fIDCardNumber =='optional') && this.inputData.fMemberProfileJSON.fIDCardNumber.toString().length !== 0){
        if(this.inputData.fMemberProfileJSON.fIDCardNumber.toString().length !== 16 ){
          update = false;
          SGDialogBox.showWarning(null,Core.Control.SGLocalize.translate("globalText.FailText"),Core.Control.SGLocalize.translate("Loyalty.IDCardInvalid"),Core.Control.SGLocalize.translate("AlertMessage.OK"),()=>{update = true},true)
        }
      }
      if((this.NewRegistrationFormSetting.fEmail =='hidden' || this.NewRegistrationFormSetting.fEmail =='optional') && this.inputData.fMemberProfileJSON.fEmail.toString().length !== 0){
        if(!Core.Helper.SGHelperType.isEmail(this.inputData.fMemberProfileJSON.fEmail)){
          update = false;
          SGDialogBox.showWarning(null,Core.Control.SGLocalize.translate("globalText.FailText"),Core.Control.SGLocalize.translate("Loyalty.EmailInvalid"),Core.Control.SGLocalize.translate("AlertMessage.OK"),()=>{update = true},true)
        }
      }
      if((this.NewRegistrationFormSetting.fMobilePhone =='hidden' || this.NewRegistrationFormSetting.fMobilePhone =='optional') && this.inputData.fMemberProfileJSON.fMobilePhone.toString().length !== 0){
        if(!Core.Helper.SGHelperType.isPhone(this.inputData.fMemberProfileJSON.fMobilePhone)) {
          update = false;
          SGDialogBox.showWarning(null,Core.Control.SGLocalize.translate("globalText.FailText"),Core.Control.SGLocalize.translate("Loyalty.NumberPhoneInvalid"),Core.Control.SGLocalize.translate("AlertMessage.OK"),()=>{update = true},true)
        } 
      }
      if(this.NewRegistrationSetting.fRegistrationMaxReceiptCombined > 0 && this.inputData.fRegistrationReceipt.length == 0){
        update = false;
        SGDialogBox.showWarning(null,Core.Control.SGLocalize.translate("globalText.FailText"),Core.Control.SGLocalize.translate("Loyalty.EmptyReceipt"),Core.Control.SGLocalize.translate("AlertMessage.OK"),()=>{update = true},true)
      }
      if(update){
        this.dbID2 = SGDialogBox.showLoading(MyTranslator.tr("AlertMessage.Waiting"))
        await tbVRegisterAPI.AddNewUserLoyaltyRegistration(this.inputData)
        SGDialogBox.hideDialogBox(this.dbID2, true);
        SGDialogBox.showToast(MyTranslator.tr('ShowToastMessage.SuccessAdd'), () => {SGHelperNavigation.goBack(this.props.navigation)})
      }
    } 
    catch (error) {
      SGDialogBox.hideDialogBox(this.dbID2, true);
      SGHelperErrorHandling.Handling(error,this._onAddPressNew.bind(this))
    }

    this.forceUpdate();
  }

  async _onAddPressExisting(data){
    const {SGDialogBox, SGPopView} = Core.Control
    const {SGHelperErrorHandling, SGHelperNavigation} = Core.Helper
    data.getCurrentJSON().fBuildingKey = this.fBuildingKey;
    data.getCurrentJSON().fReferralCode = this.usData.fReferralCode;
    try {
      var update = true;
      if((this.ExistingRegistrationFormSetting.fIDCardNumber =='hidden' || this.ExistingRegistrationFormSetting.fIDCardNumber =='optional') && data.getCurrentJSON().fMemberProfileJSON.fIDCardNumber.toString().length !== 0){
        if(data.getCurrentJSON().fMemberProfileJSON.fIDCardNumber.toString().length !== 16 ){
          update = false;
          SGDialogBox.showWarning(null,Core.Control.SGLocalize.translate("globalText.FailText"),Core.Control.SGLocalize.translate("Loyalty.IDCardInvalid"),Core.Control.SGLocalize.translate("AlertMessage.OK"),()=>{update = true},true)
        }
      }
      if((this.ExistingRegistrationFormSetting.fEmail =='hidden' || this.ExistingRegistrationFormSetting.fEmail =='optional') && data.getCurrentJSON().fMemberProfileJSON.fEmail.toString().length !== 0){
        if(!Core.Helper.SGHelperType.isEmail(data.getCurrentJSON().fMemberProfileJSON.fEmail)){
          update = false;
          SGDialogBox.showWarning(null,Core.Control.SGLocalize.translate("globalText.FailText"),Core.Control.SGLocalize.translate("Loyalty.EmailInvalid"),Core.Control.SGLocalize.translate("AlertMessage.OK"),()=>{update = true},true)
        }
      }
      if((this.ExistingRegistrationFormSetting.fMobilePhone =='hidden' || this.ExistingRegistrationFormSetting.fMobilePhone =='optional') && data.getCurrentJSON().fMemberProfileJSON.fMobilePhone.toString().length !== 0){
        if(!Core.Helper.SGHelperType.isPhone(data.getCurrentJSON().fMemberProfileJSON.fMobilePhone)) {
          update = false;
          SGDialogBox.showWarning(null,Core.Control.SGLocalize.translate("globalText.FailText"),Core.Control.SGLocalize.translate("Loyalty.NumberPhoneInvalid"),Core.Control.SGLocalize.translate("AlertMessage.OK"),()=>{update = true},true)
        } 
      }
      if(update){
        this.dbID2 = SGDialogBox.showLoading(MyTranslator.tr("AlertMessage.Waiting"))
        await tbVRegisterAPI.AddExistingUserLoyaltyRegistration(data)
        SGDialogBox.hideDialogBox(this.dbID2, true);
        SGDialogBox.showToast(MyTranslator.tr('ShowToastMessage.SuccessAdd'), () => {SGHelperNavigation.goBack(this.props.navigation)})
      }
    } 
    catch (error) {
      SGDialogBox.hideDialogBox(this.dbID2, true);
      SGHelperErrorHandling.Handling(error,this._onAddPressExisting.bind(this))
    }
    this.forceUpdate();
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
    const { SGView, SGText, SGScrollView, SGRootView, SGTabView, SGTextInput} = Core.Control;
    const { SGHelperNavigation, SGHelperType,SGHelperWindow ,CustomMenuBar, BottomNavigationContainer } = Core.Helper;
    const { SGFormButton } = Core.Form
    var style = this.style;
    var language = this._language.toUpperCase()
    var { w, h, p } = this.WHPNoHeader;
    return (
    <SGRootView dummyStatusBar style = {{backgroundColor: 'white'}}>
      <CustomMenuBar btnBack accessible={true} accessibilityLabel={'HomeScreenHeader'} navigator={this.props.navigation} imageSetting={this.imset} style={style.throwWHP}></CustomMenuBar>
      {this.alreadyMount == true ? (
      <SGView style={{flex: 1}}>
        <SGView style = {{width: w, alignItems: 'flex-start'}}>
            <SGText preset={SGText.preset.h3B}>{MyTranslator.tr('RegisterScreen.title')}</SGText>
        </SGView>

        <Card data={this.card} datalang = {language} imset = {this.imset} ></Card>
        
        {/* <SGView style={style.v2}> */}
        <SGTabView style={{width:w, flex:1, alignSelf: 'center'}} onChangeTab={(e) => { this._tabIndex = e.i; this.forceUpdate(); }}>
          { this.NewRegistrationFormSetting.fFullName != undefined &&
            <SGScrollView tabLabel={MyTranslator.tr('RegisterScreen.tabNew')} contentContainerStyle={{justifyContent: 'flex-start', backgroundColor:'white'}} >
              <AddNewMemberForm data={this.NewMemberForm} setting={this.NewRegistrationFormSetting} settingReceipt={this.NewRegistrationSetting} disabled={this.formDisabled} LocationMatrix={this.LocationMatrix} tenantPicker={this.tenantListPicker} cardList={this.CardListPicker} userData={this.usData} card={this.card} UDFSetting={this.UDFLoyaltySetting} _checkCustomSetting={this._checkCustomSetting.bind(this)}></AddNewMemberForm>
              <SGFormButton style = {style.vButton} label={MyTranslator.tr('RegisterScreen.registerButton')} onPress={this._onAddPressNew.bind(this, this.NewMemberForm)} data={this.NewMemberForm}/>
            </SGScrollView>
          }
          { this.ExistingRegistrationFormSetting.fFullName != undefined &&
            <SGScrollView tabLabel={MyTranslator.tr('RegisterScreen.tabExisting')} contentContainerStyle={{justifyContent: 'flex-start', backgroundColor:'white'}}>
              <ExistingMemberForm data = {this.ExistingMemberForm} setting = {this.ExistingRegistrationFormSetting} disabled={this.formDisabled} LocationMatrix={this.LocationMatrix} cardList={this.CardListPicker} userData={this.usData} card={this.card}></ExistingMemberForm>
              <SGFormButton style = {style.vButton} label={MyTranslator.tr('RegisterScreen.registerButton')} onPress={this._onAddPressExisting.bind(this, this.ExistingMemberForm)} data={this.ExistingMemberForm}/>
            </SGScrollView>
          } 
        </SGTabView>
        {/* </SGView>  */}
      </SGView> ) : (null)
      }

      <SGView style={{ width: '100%', height: SGHelperWindow.getHeaderHeight() }}></SGView>
      <SGView style={{ width: '100%', height: SGHelperWindow.getFooterHeight() }}></SGView>
      <BottomNavigationContainer accessible={true} accessibilityLabel={'RewardDetailScreenBottomNav'} navigator={this.props.navigation} style={style.throwWHP}></BottomNavigationContainer>
    </SGRootView>
    );
  }
}