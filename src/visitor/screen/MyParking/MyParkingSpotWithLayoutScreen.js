/**
 * Version 1.4.4
 * 1.Yohanes 13 Agustus 2021
 * - add new Component ParkingStatusDescription And ParkingIconDescription
 * Version 1.2.0
 * 1. Yohanes, 05 April 2021
 *    - fix Payment
 * 2. Yohanes 26 March 2021
 * - add ErrorHandling
 * 3. Yohanes, 29 April 2021
 * - - Fix Style LayoutParking
 * Version 1.1.0
 * 1. Yohanes, 4 Maret 2021
 *    - Fix Style CarBox , responsive
 * 2. Yohanes, 9 Maret 2021
 *    - add disabled props to CarBoxCard  
 */
 import React from 'react';
 import { StyleSheet, Animated } from 'react-native';
 import { SGView as View, SGRootView as RootView, SGIcon as Icon, SGButton as Button, SGScrollView as ScrollView, SGTabView as TabView, SGTouchableOpacity as TouchableOpacity, SGImage as ImageBackground, SGImage as Image, SGText as Text, SGDialogBox, SGFlatList as FlatList, SGActivityIndicator as ActivityIndicator } from '../../../core/control';
 import { ModuleHeader } from '../../component_V2/ModuleHeader';
 import { SGBaseScreen } from '../../../core/screen/SGBaseScreen';
 import { BottomNavigationContainer } from '../../component_V2/BottomNavigationContainer';
 import { MyParkingSpotHistoryCard } from '../../container_V2/MyParkingSpotHistoryCard';
 import { SGPanZoomView } from '../../../core/control/SGPanZoomView';
 import { CarBoxCard } from '../../container_V2/CarBoxCard';
 import { SGPopView } from '../../../core/control/SGPopView';
 import { SGHelperErrorHandling, SGHelperGlobalVar, SGHelperType, SGHelperWindow } from '../../../core/helper'
 import { SGLocalize } from '../../locales/SGLocalize';
 import { RibbonHeader } from '../../component_V2/RibbonHeader';
 import image from '../../asset/image';
 import { tbVParkingUserAPI } from '../../api/tbVParkingUserAPI'
 import { tbCPaymentAPI } from '../../api/tbCPaymentAPI';
 import { CustomMenuBar } from '../../component_V2/CustomMenuBar';
 import { EmptyDetailView } from '../../container_V2/EmptyDetailView';
 import {CardIconButton} from '../../component_V2/CardIconButton';
 import { CommentPopup } from '../../container_V2/CommentPopup';
 import {ParkingStatusDescription} from '../../container_V2/ParkingStatusDescription'
 import {ParkingIconDescription} from '../../container_V2/ParkingIconDescription'
import { SGFormPicker } from '../../../core/form';
import { HeaderMyParking } from '../../container_V2/HeaderMyParking';
import { BodyMyParking } from '../../container_V2/BodyMyParking';

 //status : 0=hijau, 1=orange, 2=merah, 3=ungu.4=abu,5=hitam
 //type : 0=normal, 1=ladies, 2=disabled, 3=vallet,4=VIP,5=Gold,6=ChargingStation
 
 export class MyParkingSpotWithLayoutScreen extends SGBaseScreen {
 
    getFilterParking(buildingKey=null) {
        return ([
          { name: 'buildingKey', operator: '=', value: buildingKey,  },
        ]);
      }
      getSortParking(){
        return([
            { name: 'fBuildingName'+ this._language.toUpperCase(), descending: false, selected: true },
        ])
    }
     getPagingData(){
         var itemPerPage = SGHelperType.getPaging()
         return {paging:true,offset:this.pagingCounter, totalPerPage:itemPerPage}
     }
 
     createStyleSheet = (whp, data) => {
         var { w, h, p } = whp;
         this._vW = w 
         this._vH = w
         this._scXY = Math.max(data.fWidthImage / this._vW, data.fHeightImage / this._vH) / this._imgScale;
         this._imgW = data.fWidthImage / this._scXY;
         this._imgH = data.fHeightImage / this._scXY;
         var scaleW = Math.trunc(w * (h/w)/10*0.975)
         var scaleH =  Math.trunc(w * (h/w)/10 *1.95)
         this._cW = scaleW * this._scXY * data.fCarScale;
         this._cH = scaleH * this._scXY * data.fCarScale;
         return StyleSheet.create({
             throwWHP: { width: w, height: h, padding: p },
             mainContainer: { width: w, height: h, backgroundColor: '#FFFFFF', justifyContent: 'flex-start' },
             tabBarStyle: { borderColor: '#E6E6E6', borderTopWidth: 0.005 * w, borderBottomWidth: 0.005 * w,width:w },
             tabBarUnderlineStyle: { backgroundColor: '#1E1E1E' },
             scrollViewActive: { width: w, paddingTop: p * 5 },
             scrollViewActiveContainer: { justifyContent: 'flex-start', alignItems: 'center' },
             parkingInfoContainer: { width: w - p * 10, flexDirection: 'row', justifyContent: 'flex-start', backgroundColor: '#FFFFFF', borderRadius: p * 3, borderWidth: w * 0.0015 },
             leftContainer: { maxWidth: w * 0.2, paddingHorizontal: p * 3, justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#FFFFFF' },
             parkingFloorNameText: { color: '#000000', marginTop: p * 3, marginBottom: p * 2 },
             line: { width: w * 0.12, borderWidth: w * 0.0035, borderColor: '#7A7A7A' },
             iconCar: { color: '#191919', width: w * 0.15, height: w * 0.12, resizeMode: 'contain', backgroundColor: 'transparent', marginVertical: 0, marginVertical: p * 2 },
             rightContainer: { width: (w - p * 10) - w * 0.2, height: w * 0.35, marginLeft: p * 3, justifyContent: 'space-around', alignItems: 'flex-start' },
             detail: { flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'flex-start' },
             keyText: { width: w * 0.3, color: '#373737', marginHorizontal: 0 },
             sepText: { color: '#373737', marginHorizontal: 0, marginRight: p },
             valueText: { color: '#373737', marginHorizontal: 0 },
             btnCheckOut: { width: w * 0.45, height: w * 0.12, borderRadius: p * 4, alignItems: 'center', justifyContent: 'center', marginVertical: p * 4, paddingVertical: p * 2 },
             btnComment: { width: w * 0.45, height: w * 0.12, borderRadius: p * 4, alignItems: 'center', justifyContent: 'center', marginVertical: p * 4, paddingVertical: p * 2 },
 
             paymentInfoContainer: { width: w, borderColor: '#E6E6E6', borderTopWidth:0.005*w,alignItems:'flex-start' },
             firstPaymentImageContainer: {  backgroundColor: '#FFFFFF', marginLeft: p * 5, marginRight: p * 2, marginVertical: 0, borderRadius: p * 3 },
             paymentImageContainer: {  backgroundColor: '#FFFFFF', marginLeft: p * 4, marginRight: p * 2, marginVertical: 0, borderRadius: p * 3 },
             paymentImage: { width: w * 0.2,height:w*0.1, backgroundColor: '#FFFFFF', resizeMode: 'cover', marginHorizontal: 0, borderRadius: 0 },
             payment:{marginVertical:2*p},

             psv1: { width: this._vW, height: this._vH},
             img1: { width: this._imgW, height: this._imgH, alignItems: 'flex-start', justifyContent: 'flex-start',resizeMode:'contain',backgroundColor:'transparent' },
             c1: { width: this._cW, height: this._cH, backgroundColor: 'blue' },
             scrollViewInactive: { justifyContent: 'flex-start' },
             parkingHistoryCardContainer: { width: w, padding: p, backgroundColor: 'white' },
             flatListView: { paddingVertical: p * 2 },
             clearHistoryButton: { paddingHorizontal: p, paddingVertical: p, alignSelf: 'flex-end', marginBottom: 0 },
             iconButton:{width:w,height:h,padding:p},
             vfab: { backgroundColor: 'transparent', width: w * 0.2, height: w * 0.2, position: 'absolute', bottom: SGHelperWindow.getFooterHeight() + SGHelperWindow.getHeaderHeight() - 2 * p, right: w * 0.015, borderRadius: w * 0.6 },

         });
     }
 
     constructor(props, context, ...args) {
         super(props, context, ...args);
         this._data = {
             fParkirNameID: '',
             fParkirNameEN: '',
             fParkirNameCN: '',
             fWidthImage: 1,
             fHeightImage: 1,
             fCarScale: 1,
             fShowLayoutParkir:"N",
             fLastModifiedDate: Date.parse(SGHelperType.convertNewDate(new Date())),
             parkingSpot: [{
                 fXPosition: 0,
                 fYPosition: 0,
                 fRotation: 0,
                 fType: 0,
                 fStatus: 0,
                 fLocation: '',
                 fPlate: '',
                 fWidthImage: 1,
                 fHeightImage: 1,
                 fCarScale: 1,
             }],
             fGreen: 0,
             fRed: 0,
         }
         this._imgScale = SGHelperType.getSysParamsValueToInt("ImageScaleParking")/2;
         this.style = this.createStyleSheet(this.WHP, this._data);
         this.props.navigation.setOptions({
             headerShown: false,
         });
         this.pvID1 = SGPopView.getPopViewID();
         this.pvIDParking = SGPopView.getPopViewID()
         this.onIconPress = this.onIconPress.bind(this);
         this.userData = SGHelperGlobalVar.getVar('GlobalCurrentUserData');
         this.imageSetting = SGHelperGlobalVar.getVar('GlobalImageSetting');
         this._dataHistory = []
         this.paymentData=[]
         this.alreadyMount = false;
         this.state = { active1: true, active2: false, refresh: false ,refreshFlatList:false, loading:false, stopPulling:false, hideParkingLayoutDesc:false,headerBuildingParkingHighlight:false  }
         this.refresh=false
         this.pagingCounter = 0
         this.mallList=[]
         this.mallOptionList=[]
         this.selectedBuilding=null
         this.lastUpdated=new Date()
         this.toggleFlagTriggered=false;
         this.svRef=React.createRef();
     }
     async componentDidMount() {
         await this._focus(true);
         this._unsubscribe = this.props.navigation.addListener('focus', async () => {
             await this._focus();
         });
 
     }
     async _headerBuildingParkingHighlight(refresh=false,selectedBuilding){
         if(this.mallList.length===0||refresh){

            this.setState({headerBuildingParkingHighlight:true})
            this.selectedBuilding=selectedBuilding
            this.arrFilter=this.getFilterParking(selectedBuilding)
            this.arrSort=this.getSortParking()
            this.baseRunSingleAPIWithRedoOption('SearchParkingBuildingList', (async (v1,v2) => { return tbVParkingUserAPI.SearchParkingBuildingList(v1,v2) }).bind(this, this.arrFilter, this.arrSort), ((v) => {
                this.mallList = v
                console.log(v)
                this.lastUpdated=new Date()
                if(selectedBuilding===null)this._constructPicker()
                this.setState({headerBuildingParkingHighlight:false})
            }).bind(this),  null,  SGHelperGlobalVar.getVar("ResponTimes"));
         }
     }
     _constructPicker(){

        this.mallOptionList=[]
        for(var i =0;i<this.mallList.length;i++){
            this.mallOptionList.push({ key: this.mallList[i].buildingKey, title: this.mallList[i]['fBuildingName'+this._language.toUpperCase()] })
        }
     }
     componentWillUnmount() {
         if (this._unsubscribe) { this._unsubscribe(); }
     }
 
     async _focus(reset) {
         // this.dbID2 = SGDialogBox.showLoading("waiting")
         await this._onRefresh(reset)
         // SGDialogBox.hideDialogBox(this.dbID2,true)
         // this.createStyleSheet(this.WHP, this._data);
         this.alreadyMount = true;
         // this.forceUpdate()
     }
     checkAPIBatchStatusAllDone() {
         if(!this.toggleFlagTriggered ){
             this.toggleFlagTriggered=true; 
             setTimeout((()=>{if(!this.state.hideParkingLayoutDesc){this.toggleHideShowLayout()}}).bind(this),3500);
         }
         this.forceUpdate();
     }
     async _onRefresh(resetPaging = false) {
         this.baseRunSingleAPIWithRedoOption('GetParkingSpot', (async () => { return tbVParkingUserAPI.GetParkingSpot() }).bind(this), ((v) => {
             this._userDataParked = v 
             if(resetPaging||this._userDataParked.fID!==null)this.baseInitAPIParallel( SGHelperGlobalVar.getVar("ResponTimes"), (() => { this.checkAPIBatchStatusAllDone(); }).bind(this));
             
             if(resetPaging){
                 this.setState({ refresh: true })
                 this.pagingCounter= 0
                 this.paging = this.getPagingData()
                 this.baseAddAPIParallel('SearchParkingUserHistory', (async (v1,v2,v3) => { return tbVParkingUserAPI.SearchParkingUserHistory(v1,v2,v3) }).bind(this,[{ name: 'fUserKey', operator: '=', value: this.userData.fID }, { name: 'fStatus', operator: '=', value: 'N' }], [{ name: 'fCheckOutDate', descending: true, selected: true }],this.paging), ((v) => {
                     this._dataHistory = v 
                     this.pagingCounter = this._dataHistory.length
                     this.setState({ refresh: false });
                 }).bind(this), null);
             }  
 
             if (this._userDataParked.fID !== null) {    
                 this.baseAddAPIParallel('GetParkingLayoutAndData', (async (v1,v2) => { return tbVParkingUserAPI.GetParkingLayoutAndData(v1,v2) }).bind(this,this._userDataParked.fParkingJSON.fParkingLayoutKey, this._userDataParked.fBuildingKey), ((res) => {
                     this._data = res;   
                     this.style = this.createStyleSheet(this.WHP, this._data);   

                 }).bind(this), null);
                 this.baseAddAPIParallel('getPayment', (async (v1) => { return tbCPaymentAPI.getPayment(v1) }).bind(this,this._userDataParked.fBuildingKey), ((v) => {
                     this.paymentData = v;    
                 }).bind(this), null);
                
             }
            
             if(resetPaging||this._userDataParked.fID!==null)this.baseRunAPIParallel();
         }).bind(this),  null,  SGHelperGlobalVar.getVar("ResponTimes"));
     }
 
     async _onRefreshFlatList() {
         this.setState({ refresh: true ,stopPulling:true})
         if(!this.refresh && !this.state.loading){
             this.refresh= true
             this.pagingCounter = 0
             this.paging = this.getPagingData()
             this.baseRunSingleAPIWithRedoOption('SearchParkingUserHistory', (async (v1,v2,v3) => { return tbVParkingUserAPI.SearchParkingUserHistory(v1,v2,v3) }).bind(this,[{ name: 'fUserKey', operator: '=', value: this.userData.fID }, { name: 'fStatus', operator: '=', value: 'N' }], [{ name: 'fCheckOutDate', descending: true, selected: true }],this.paging), ((v) => {
             this._dataHistory = v
             this.pagingCounter = this._dataHistory.length
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
             this.baseRunSingleAPIWithRedoOption('SearchParkingUserHistory', (async (v1,v2,v3) => { return tbVParkingUserAPI.SearchParkingUserHistory(v1,v2,v3) }).bind(this,[{ name: 'fUserKey', operator: '=', value: this.userData.fID }, { name: 'fStatus', operator: '=', value: 'N' }], [{ name: 'fCheckOutDate', descending: true, selected: true }, {name: 'fID', descending: true, selected: true, visible: false }],this.paging), ((v) => {
                 var resData =  v //await tbVParkingUserAPI.SearchParkingUserHistory([{ name: 'fUserKey', operator: '=', value: this.userData.fID }, { name: 'fStatus', operator: '=', value: 'N' }], [{ name: 'fCheckOutDate', descending: true, selected: true }, {name: 'fID', descending: true, selected: true, visible: false }],this.paging)
                 if(resData.length!==0){
                     for(var i=0;i<resData.length;i++){
                         this._dataHistory.push(resData[i])
                     }
                     this.pagingCounter = this.pagingCounter + resData.length
                 } else this.setState({stopPulling:true})
                 this.setState({loading:false})
             }).bind(this),  null,  SGHelperGlobalVar.getVar("ResponTimes"));
         }
     }
 
     async _onClearParkingHistory() {
         try {
             await tbVParkingUserAPI.ClearParkingHistory();
             await this._onRefreshFlatList();
         } catch (error) {
             SGHelperErrorHandling.Handling(error,this._onClearParkingHistory.bind(this))
         }
        
     }
 
     _getImage(){
         var guid = "5639dad8-1f9f-42a8-b36a-81e36481a8f3"
         return  [
             {
                 "id": guid,
                 "high": {
                     "uri": "https://spotguestoragelive01.blob.core.windows.net/visitordefaultassets/ParkingLogo_high.png",
                     "width": 1080,
                     "height": 1080
                 },
                 "med": {
                     "uri": "https://spotguestoragelive01.blob.core.windows.net/visitordefaultassets/ParkingLogo_med.png",
                     "width": 720,
                     "height": 720
                 },
                 "low": {
                     "uri": "https://spotguestoragelive01.blob.core.windows.net/visitordefaultassets/ParkingLogo_low.png",
                     "width": 480,
                     "height": 480
                 },
                 "thumbnailHigh": {
                     "uri": "https://spotguestoragelive01.blob.core.windows.net/visitordefaultassets/ParkingLogo_high.png",
                     "width": 360,
                     "height": 360
                 },
                 "thumbnailMed": {
                     "uri": "https://spotguestoragelive01.blob.core.windows.net/visitordefaultassets/ParkingLogo_med.png",
                     "width": 240,
                     "height": 240
                 },
                 "thumbnailLow": {
                     "uri": "https://spotguestoragelive01.blob.core.windows.net/visitordefaultassets/ParkingLogo_low.png",
                     "width": 120,
                     "height": 120
                 },
                 "text": "",
                 "textPosition": "topLeft"
             }
         ]
     }
 
     _getCommentParking(data) {
         var imageJSONID =  this._getImage()
         var imageJSONEN = this._getImage()
         var imageJSONCN = this._getImage()
       
         if(data.fParkirNameID!==''){
             return (
                 {
                     fUserImage: this.userData.fProfileImageJSON, fContentType: 'Parking', fContentKey: data.fID,
                     fContentName: { id: data.fParkirNameID, en: data.fParkirNameEN, cn: data.fParkirNameCN },
                     fContentText1: { id: data.fBuildingNameID, en: data.fBuildingNameEN, cn: data.fBuildingNameCN },
                     fContentText2: { id: '', en: '', cn: '' },
                     fContentImage: { id: imageJSONID, en: imageJSONEN, cn: imageJSONCN },
                     fTargetType: 'Place', fTargetName: { id: data.fBuildingNameID, en: data.fBuildingNameEN, cn: data.fBuildingNameCN },
                     fTargetImage: { id: data.fContentID.fImageJSON, en: data.fContentEN.fImageJSON, cn: data.fContentCN.fImageJSON },
                     fTargetKey: data.fBuildingKey
                 }
             )
         }
     }
 
 
     async onCheckOut(data) {
         try{
             this.dbID2 = SGDialogBox.showLoading(SGLocalize.translate("AlertMessage.Waiting"))
             await tbVParkingUserAPI.CheckOutParking(data)
             await this._onRefresh(true);
             SGDialogBox.hideDialogBox(this.dbID2, true)
             // this.forceUpdate()
         }catch(error){
            SGDialogBox.hideDialogBox(this.dbID2, true)
            SGHelperErrorHandling.Handling(error,this.onCheckOut.bind(this,data))
             // SGDialogBox.showFail(null, SGLocalize.translate("AlertMessage.Fail"), SGLocalize.translate("MyParkingSpotWithLayoutScreen.CheckOutParkirFail"), 'OK', () => { })
         }
     }
     showPopView() {
         SGPopView.showPopView(this.pvID1);
     }  
 
     onHidePopView() {
         SGPopView.hidePopView(this.pvID1);
     }
     onHideParkingPopView(){
        SGPopView.hidePopView(this.pvIDParking);
     }
 
     toggleHideShowLayout(){
        if(this.svRef.current){
            if(this.state.hideParkingLayoutDesc){
                this.svRef.current.scrollTo(0);
            } else {
                this.svRef.current.scrollToEnd();
            }
        }
        this.setState({hideParkingLayoutDesc:!this.state.hideParkingLayoutDesc});
     }
     _renderSomething1(styleParent, dataParking, data) {
         var { w, h, p } = this.WHP;
         var style = this.style;
         var tR = SGLocalize.translate
         var paymentData = this.paymentData
         var mySpot = SGHelperType.isDefined(this._userDataParked) && this._userDataParked.fID !== null ? 1 : 0
         var dataStatus = {
            available: data.fGreen,
            full:data.fRed,
            mySpot : mySpot,
            offline : data.fGrey,
            fDDSActive: data.fDDSActive,
            fDDSCount: data.fDDSCount
        }
        // console.table(data)
         return (
             <ScrollView ref={this.svRef} dummyFooterBar dummyBottomBar accessible={true} accessibilityLabel={'MyParkingSpotWithLayoutScreenRootScrollView'} showsVerticalScrollIndicator={false} style={styleParent} contentContainerStyle={style.scrollViewActiveContainer}>
                 
                 <View accessible={true} accessibilityLabel={'MyParkingSpotWithLayoutScreenView1'} style={style.parkingInfoContainer}>
                     <View accessible={true} accessibilityLabel={'MyParkingSpotWithLayoutScreenView1_1'} style={style.leftContainer}>
                         <Text accessible={true} accessibilityLabel={'MyParkingSpotWithLayoutScreenCardText'} preset={Text.preset.titleH2B} style={style.parkingFloorNameText}>{dataParking.fParkingJSON['fParkirName' + this._language.toUpperCase()]}</Text>
                         <View accessible={true} accessibilityLabel={'MyParkingSpotWithLayoutScreenCardLineView'} style={style.line}></View>
                         <ImageBackground accessible={true} accessibilityLabel={'MyParkingSpotWithLayoutScreenImageBackground'} source={{ uri: image.myParkingGoldIcon[this.imageSetting].url }} style={style.iconCar}></ImageBackground>
                     </View>
                     <View accessible={true} accessibilityLabel={'MyParkingSpotWithLayoutScreenView1_2'} style={style.rightContainer}>
                         <View accessible={true} style={style.detail}>
                             {/* <Text accessible={true} accessibilityLabel={'MyParkingSpotWithLayoutScreenPlaceName'} preset={Text.preset.h8B}>{tR('MyParkingSpotWithLayoutScreen.PlaceName')}</Text>
                             <Text accessible={true} accessibilityLabel={'MyParkingSpotWithLayoutScreenCardText1'} preset={Text.preset.h8B} style={style.sepText}>:</Text> */}
                             <Text accessible={true} accessibilityLabel={'MyParkingSpotWithLayoutScreenDataParkingPlaceName'} preset={Text.preset.titleH2B} style={style.valueText} numberOfLines={3}>{dataParking['fBuildingName' + this._language.toUpperCase()]}</Text>
                         </View>
                         <View accessible={true} style={style.detail}>
                             <Text accessible={true} accessibilityLabel={'MyParkingSpotWithLayoutScreenParkingLocation'} preset={Text.preset.titleH4B} style={style.keyText}>{tR('MyParkingSpotWithLayoutScreen.ParkingLocation')}</Text>
                             <Text accessible={true} accessibilityLabel={'MyParkingSpotWithLayoutScreenCardText2'} preset={Text.preset.titleH4B} style={style.sepText}>:</Text>
                             <Text accessible={true} accessibilityLabel={'MyParkingSpotWithLayoutScreenDataLocationParking'} preset={Text.preset.titleH4B} style={style.valueText}>{dataParking['fParkirName' + this._language.toUpperCase()]}, {dataParking.fParkingJSON.fLocation}</Text>
                         </View>
                         <View accessible={true} style={style.detail}>
                             <Text accessible={true} accessibilityLabel={'MyParkingSpotWithLayoutScreenVehicleNumber'} preset={Text.preset.titleH4B} style={style.keyText}>{tR('MyParkingSpotWithLayoutScreen.VehicleNumber')}</Text>
                             <Text accessible={true} accessibilityLabel={'MyParkingSpotWithLayoutScreenCardText3'} preset={Text.preset.titleH4B} style={style.sepText}>:</Text>
                             <Text accessible={true} accessibilityLabel={'MyParkingSpotWithLayoutScreenDataParking'} preset={Text.preset.titleH4B} style={style.valueText}>{dataParking.fParkingJSON.fPlate}</Text>
                         </View>
                         <View accessible={true} style={style.detail}>
                             <Text accessible={true} accessibilityLabel={'MyParkingSpotWithLayoutScreenCheckIn'} preset={Text.preset.titleH4B} style={style.keyText}>{tR('MyParkingSpotWithLayoutScreen.CheckIn')}</Text>
                             <Text accessible={true} accessibilityLabel={'MyParkingSpotWithLayoutScreenCardText4'} preset={Text.preset.titleH4B} style={style.sepText}>:</Text>
                             <Text accessible={true} accessibilityLabel={'MyParkingSpotWithLayoutScreenCheckIn'} preset={Text.preset.titleH4B} style={style.valueText}>{SGHelperType.formatTime(SGHelperType.convertNewDate(dataParking.fCheckInDate), this._language.toUpperCase())}</Text>
                         </View>
                     </View>
                 </View>
 
                <View style={{flexDirection:'row'}}>
                     <Button shadow accessible={true} accessibilityLabel={'MyParkingSpotComment'} style={style.btnComment} preset={Button.preset.green}  textPreset={Text.preset.titleH3B} label={tR('MyParkingSpotWithLayoutScreen.NeedHelpText')} onPress={() => {this.showPopView() }} disabled={this._data.fCanComment == 'Y' ? false : true}></Button>
                     <Button shadow accessible={true} accessibilityLabel={'MyParkingSpotWithLayoutScreenButtonCheckOut'} style={style.btnCheckOut} preset={Button.preset.red}  textPreset={Text.preset.titleH3B} label={tR('MyParkingSpotWithLayoutScreen.CheckOut')} onPress={() => { this.onCheckOut(dataParking) }}></Button>
                </View>
                {
                     data.fShowLayoutParkir ==="Y" && 
                     <View>
                        <View hidden={this.state.hideParkingLayoutDesc}>
                            <Text style={{width: 9/10*w, marginTop: 3*p, color:'gray'}}>{SGLocalize.translate("ParkingLayoutFullScreen.ParkingSpotType")}</Text>
                            <ParkingIconDescription style={style.throwWHP} data={data} ></ParkingIconDescription>

                            <Text style={{width:9/10*w, marginTop: 3*p, color:'gray'}}>{SGLocalize.translate("ParkingLayoutFullScreen.SupportedPayment")}</Text>
                            <View accessible={true} style={style.paymentInfoContainer}>
                                <ScrollView accessible={true} accessibilityLabel={'MyParkingSpotWithLayoutScreenHorizontalScrollView'} horizontal showsHorizontalScrollIndicator={false}>
                                    {
                                        paymentData.map((d, index) => {
                                            return (
                                                <TouchableOpacity key={d.fKey} style={style.payment}>
                                                    <View accessible={true} shadow style={index === 0 ? style.firstPaymentImageContainer : style.paymentImageContainer}>
                                                        <Image accessible={true} accessibilityLabel={'MyParkingSpotWithLayoutScreenPaymentMethodImage'} source={{ uri: d['fContent' + this._language.toUpperCase()].fImageJSON[0][this.imageSetting].uri }} style={style.paymentImage}></Image>
                                                    </View>
                                                </TouchableOpacity>
                                            )
        
                                        })
                                    }
                                </ScrollView>
                            </View>
                            <Text style={{width:9/10*w, marginTop: 3*p, color:'gray'}}>{SGLocalize.translate("ParkingLayoutFullScreen.Availability")}</Text>
                            <View style={{borderColor: '#E6E6E6', borderTopWidth:0.005*w}}>
                                <ParkingStatusDescription style={style.throwWHP} data={dataStatus}></ParkingStatusDescription>
                            </View>
                        </View>
                        <TouchableOpacity onPress={this.toggleHideShowLayout.bind(this)}>
                            <View style={{width:w, height:6*p}}>
                                {this.state.hideParkingLayoutDesc === true &&
                                    <View style={{width:10*p, height:10*p}}>
                                        <Icon  name={Icon.Icon.arrowDown} preset={Icon.preset.h1} style={{ alignItem:'center' }}></Icon>
                                    </View>
                                }
                                {this.state.hideParkingLayoutDesc === false &&
                                    <View style={{width:10*p, height:10*p}}>
                                        <Icon  name={Icon.Icon.arrowUp} preset={Icon.preset.h1} style={{ alignItem:'center' }}></Icon>
                                    </View>
                                }
                            </View>
                        </TouchableOpacity>
                        
                        <Text hidden={data.fDDSActive==="N"}>{ tR("ParkingLayoutFullScreen.On")}</Text>
                        <TouchableOpacity onPress={() => { this.props.navigation.navigate('ParkingLayoutFullScreen', { fID: data.fID ,contentKey:data.fBuildingKey}) }}>
                            <SGPanZoomView showBar accessible={true} accessibilityLabel={'MyParkingSpotWithLayoutScreenZoomView'} style={style.psv1} scale={1 / this._imgScale} >
                                <ImageBackground accessible={true} accessibilityLabel={'MyParkingSpotWithLayoutScreenImgBackMap'} style={style.img1} source={{ uri: this._data.fURLImage }} >
                                    {
                                        data.parkingSpot.map((d,i) => {
                                            return <CarBoxCard accessible={true} accessibilityLabel={'MyParkingSpotWithLayoutScreenCarBoxCard'} key={i} userData={this.userData} style={style.c1} data={d} scale={1 / this._scXY} userParked={this._userDataParked} disabled fDDSActive={data.fDDSActive} fOnline={data.fOnline}/>
                                        })
                                    }
                                </ImageBackground>
                            </SGPanZoomView>
                        </TouchableOpacity>          
                    </View>
                }  

                <View style={{ width: '100%', height: SGHelperWindow.getHeaderHeight() }}></View>
               
             </ScrollView>
             
         )
     }
 
     _renderSomething2(data, language) {
         var { w, h, p } = this.WHP;
         var style = this.style
         
         return (
             <View accessible={true} accessibilityLabel={'MyParkingSpotWithLayoutScreenContainerView5'} style={style.scrollViewInactive}>
                 {this.alreadyMount ?
                 data.length !== 0 ?
                     <View style={{ flex: 1 }}>
                         <Button preset={Button.preset.blackBorder} onPress={() => { this._onClearParkingHistory() }} style={style.clearHistoryButton} textPreset={Text.preset.titleH5} label={SGLocalize.translate("MyParkingSpotWithLayoutScreen.ClearHistoryButton")}></Button>
                         <FlatList refreshing={this.state.refreshFlatList} onRefresh={this._onRefreshFlatList.bind(this)} accessible={true} accessibilityLabel={'MyParkingSpotWithLayoutScreenListHistory'} data={data} style={style.flatListView} showsHorizontalScrollIndicator={false} renderItem={({ item }) => {
                             return (<MyParkingSpotHistoryCard accessible={true} accessibilityLabel={'MyParkingSpotWithLayoutScreenMyParkHistoryCard'} language={language} imageSetting={this.imageSetting} navigator={this.props.navigation} data={item} style={this.style.parkingHistoryCardContainer}></MyParkingSpotHistoryCard>)
                         }} keyExtractor={item => item.fID}
                         onEndReached={this._onLoad.bind(this)}
                         onEndReachedThreshold={SGHelperType.getThreshold()}
                         ListFooterComponent={()=>{
                             if( this.state.loading)return <ActivityIndicator preset={ActivityIndicator.preset.h1}></ActivityIndicator>
                             else return null
                         }}
                         >
                         </FlatList>
                     </View>
                     :
                     <EmptyDetailView text={SGLocalize.translate('globalText.emptyList')} style={style.throwWHP}></EmptyDetailView>
                     :
                     <ActivityIndicator preset={ActivityIndicator.preset.h1} style={{ flex: 1 }}></ActivityIndicator>
                     }
                 <View style={{ height: SGHelperWindow.getHeaderHeight(), backgroundColor: '#181818', width: '100%' }}></View>
                 <View style={{ height: SGHelperWindow.getFooterHeight(), backgroundColor: '#181818', width: '100%' }}></View>
             </View>
         )
     }
     onIconPress(active) {
         this.setState({ active1: false, active2: false })
         if (active === "1") this.setState({ active1: true })
         if (active === "2") this.setState({ active2: true })
     }

     render() {
         var { w, h, p } = this.WHP;
         var style = this.style;
         var navigator = this.props.navigation;
         var language = this._language.toUpperCase()
         var dataActive = this._userDataParked
         var dataHistory = this._dataHistory;
         var dataLayout = this._data;
         var imageSetting=this.imageSetting
         var tR = SGLocalize.translate
         console.log(this.mallList)
         return (
             <RootView dummyStatusBar dummyHeaderBar accessible={true} accessibilityLabel={'MyParkingSpotWithLayoutScreenRootView'} style={style.mainContainer}>
                 
                
                <SGPopView accessible={true} accessibilityLabel={'SGPopViewCommentPopUp'} vPos={'Top'} modal popViewID={this.pvID1}>
                     <CommentPopup accessible={true} accessibilityLabel={'CommentPopUp'} commentPackage={this._getCommentParking(this._data)} contentType={'Parking'} contentKey={this.props.contentKey} popViewID={this.pvID1} style={style.throwWHP}></CommentPopup>
                 </SGPopView>
 
                 <RibbonHeader borderOff imageSetting={this.imageSetting} title={SGLocalize.translate("MyParkingSpotWithLayoutScreen.screenTitle")}></RibbonHeader>
                 <TabView accessible={true} accessibilityLabel={'ProfileScreenCITabView'} tabBarStyle={style.tabBarStyle} tabBarTextStyle={style.tabBarTextStyle} scrollableTabBar={true} tabBarUnderlineStyle={style.tabBarUnderlineStyle} tabBarActiveTextColor={'#000000'} tabBarInactiveTextColor={'#6E6A6A'} tabBarActiveTextPreset={Text.preset.titleH2B} tabBarInactiveTextPreset={Text.preset.titleH2}>
                     <View accessible={true} style={{ flex: 1 }} tabLabel={tR('MyParkingSpotWithLayoutScreen.Active')}>
                         {this.alreadyMount ?
                             this.state.active1 && SGHelperType.isDefined(dataActive) && dataActive.fID !== null && this.alreadyMount ?
                                 this._renderSomething1(this.style.scrollViewActive, dataActive, dataLayout)
                                 :
                                 (
                                     <View>
                                         <SGPopView vPos={'Bottom'} popViewID={this.pvIDParking}>
                                            <View  style={{backgroundColor:'white',width:w*0.9,height:w*1.7,alignItems:'flex-start',justifyContent:'flex-start',borderRadius:5*p}}>
                                                <HeaderMyParking selectedBuilding={this.selectedBuilding} mallOptionList={this.mallOptionList} language={language} onHideParkingPopView={this.onHideParkingPopView.bind(this)} refreshHeaderBuildingParkingHighlight={this._headerBuildingParkingHighlight.bind(this)}></HeaderMyParking>
                                                <FlatList refreshing={this.state.headerBuildingParkingHighlight} onRefresh={()=>{this._headerBuildingParkingHighlight(true,null)}} accessible={true} accessibilityLabel={'FlatListMyParking'} data={this.mallList}  contentContainerStyle={{ justifyContent: 'center', alignItems: 'center' }} style={{width:w*0.9}} renderItem={({ item, index }) => {
                                                return (
                                                    <BodyMyParking index = {index} lastUpdated={this.lastUpdated} onHideParkingPopView={this.onHideParkingPopView.bind(this)} navigator ={this.props.navigation} imageSetting={imageSetting}  language={language} mallList={item}></BodyMyParking>
                                                    );
                                                }}
                                                keyExtractor={item => item.buildingKey}
                                                // onEndReached={loadDataHistory}
                                                // onEndReachedThreshold={SGHelperType.getThreshold()}
                                                // ListFooterComponent={()=>{
                                                //     if(loadingDataHistory)return <SGActivityIndicator preset={SGActivityIndicator.preset.h1} style={{width: w,height:h*0.05}}></SGActivityIndicator>
                                                //     else return null
                                                // }}
                                                >
                                            </FlatList>
                                            
                                               
                                           </View>
                                            
                                         </SGPopView>
                                      
                                        <EmptyDetailView text={SGLocalize.translate('MyParkingSpotWithLayoutScreen.EmptyActiveParking')} style={style.throwWHP}></EmptyDetailView>
                                        <TouchableOpacity accessible={true} accessibilityLabel={'MyParkingSpotWithLayoutFABView'} style={style.vfab} onPress={async() => {SGPopView.showPopView(this.pvIDParking);this._headerBuildingParkingHighlight(false,null) }}>
                                            <Icon name={Icon.Icon.plus} preset={Icon.preset.w7} style={{ color: 'rgba(38,38,38,0.85)' }}></Icon>
                                        </TouchableOpacity>
                                    </View>
                             
                                 )
                             :
                             (<ActivityIndicator preset={ActivityIndicator.preset.h1} style={{ flex: 1 }}></ActivityIndicator>)
                         }
                         <View style={{ width: '100%', height: SGHelperWindow.getHeaderHeight(), backgroundColor: 'transparent' }}></View>
                     </View>
                     <View accessible={true} style={{ flex: 1 }} tabLabel={tR('MyParkingSpotWithLayoutScreen.History')}>
                         {this._renderSomething2(dataHistory, this._language)}
                     </View>
                 </TabView>
                 <Animated.View style={{ position: 'absolute', transform: [{ translateY: this._baseAnimY.interpolate({ inputRange: [-1, 0], outputRange: [(SGHelperWindow.getStatusBarHeight() - SGHelperWindow.getHeaderHeight()), SGHelperWindow.getStatusBarHeight()] }) },], height: SGHelperWindow.getHeaderHeight(), width: '100%' }}>
                     <CustomMenuBar btnBack accessible={true} accessibilityLabel={'HomeScreenHeader'} currentUser={this.currentUser} navigator={this.props.navigation} imageSetting={this.imageSetting} style={style.throwWHP}></CustomMenuBar>
                 </Animated.View>
                 <Animated.View style={{ position: 'absolute', transform: [{ translateY: this._baseAnimY.interpolate({ inputRange: [-1, 0], outputRange: [SGHelperWindow.getWHPNoHeader().h + 8 * p, SGHelperWindow.getWHPNoHeader().h - Math.max(SGHelperWindow.getFooterHeight(), 2 * p) - SGHelperWindow.getHeaderHeight()] }) },], height: Math.max(SGHelperWindow.getFooterHeight(), 2 * p) + SGHelperWindow.getHeaderHeight(), width: '100%' }}>
                     <BottomNavigationContainer accessible={true} currentUser={this.currentUser} navigator={this.props.navigation} style={style.throwWHP} screen={this.props.route.name}></BottomNavigationContainer>
                 </Animated.View>
 
             </RootView>
         );
     }
 }