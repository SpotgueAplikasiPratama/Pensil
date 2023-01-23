/**
 * Version 1.4.6
 * 1.Yohanes 19 October 2021
 * - Now can search pillar
 * Version 1.4.4
 * 1.Yohanes 13 Agustus 2021
 * - add new Component ParkingStatusDescription And ParkingIconDescription
 * Version 1.4.1
 *  - change style parking imgScale from 8 to system param
 * Version 1.4.0
 * 1. Yohanes 16 June 2021
 * - change style parking imgScale from 2 to 8
* Version 1.2.0
 * 1. Yohanes 26 March 2021
 * - add ErrorHandling
 * - fix last updated always 2 minutes ago
 * 2. Yohanes, 24 Maret 2021
 *    - fix Payment
 * 3. Yohanes, 17 Maret 2021 
 *    - fix Style Layout picture parking
 * Version 1.1.0
 * 1. Yohanes, 4 Maret 2021
 *    - Fix Style CarBox , responsive
 *    -  
 */
import React from 'react';
import { StyleSheet, Animated } from 'react-native';
import { SGView as View, SGRootView as RootView, SGScrollView as ScrollView, SGImage as Image, SGTouchableOpacity as TouchableOpacity, SGText as Text, SGImage as ImageBackground, SGIcon as Icon, SGDialogBox, SGButton as Button, SGPopView , SGIconButton as IconButton,SGViewPager as ViewPager} from '../../../core/control';
import { SGBaseScreen } from '../../../core/screen/SGBaseScreen';
import { SGPanZoomView } from '../../../core/control/SGPanZoomView';
import { CarBoxCard } from '../../container_V2/CarBoxCard';
import { SGHelperType, SGHelperGlobalVar, SGHelperWindow, SGHelperErrorHandling } from '../../../core/helper'
import { SGLocalize } from '../../locales/SGLocalize'
import { SGHelperNavigation } from '../../../core/helper'
import { BottomNavigationContainer } from '../../component_V2/BottomNavigationContainer';
import { tbVParkingUserAPI } from '../../api/tbVParkingUserAPI'
import { tbCPaymentAPI } from '../../api/tbCPaymentAPI'
import { CustomMenuBar } from '../../component_V2/CustomMenuBar';
import { tbVUserCheckInAPI } from '../../api/tbVUserCheckInAPI';
import { VRewardAPI } from '../../api/VRewardAPI';
import { tbUserCheckInData } from '../../db/tbUserCheckInDAO';
import { SGFormPicker } from '../../../core/form';
import {ParkingLayoutHeader} from '../../container_V2/ParkingLayoutHeader'
import {ParkingIconDescription} from '../../container_V2/ParkingIconDescription'
import {ParkingStatusDescription} from '../../container_V2/ParkingStatusDescription'
import { tbVUserViewAPI } from '../../api/tbVUserViewAPI';
import {FloatingButton} from '../../container_V2/FloatingButton'
export class ParkingLayoutFullScreen extends SGBaseScreen {
    createStyleSheet = (whp, data) => {
        var { w, h, p } = whp;
        this._vW = w 
        this._vH = h*0.75
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
            headerContainer: { width: w, paddingHorizontal: p * 2, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
            headerLeftContainer: { justifyContent: 'flex-start', alignItems: 'flex-start', marginVertical: p * 2 },
            floorNameText: { color: '#000000' },
            scrollViewActiveContainer: { justifyContent: 'flex-start', alignItems: 'center' },
          
            paymentInfoContainer: { width: w, borderColor: '#E6E6E6', borderTopWidth:0.005*w,alignItems:'flex-start' },
            firstPaymentImageContainer: {  backgroundColor: '#FFFFFF', marginLeft: p * 4, marginRight: p * 2, marginVertical: 0, borderRadius: p * 3 },
            paymentImageContainer: {  backgroundColor: '#FFFFFF', marginLeft: p * 4, marginRight: p * 2, marginVertical: 0, borderRadius: p * 3 },
            paymentImage: { width: w * 0.2,height:w*0.1, backgroundColor: '#FFFFFF', resizeMode: 'cover', marginHorizontal: 0, borderRadius: 0 },
           
            psv1: { width: this._vW, height: this._vH, borderWidth: 2, borderColor: 'rgb(150,150,150)' },
            img1: { width: this._imgW, height: this._imgH, alignItems: 'flex-start', justifyContent: 'flex-start',resizeMode:'contain',backgroundColor:'transparent' },
            c1: { width: this._cW, height: this._cH, backgroundColor: 'blue' },
            //style popup reward
            rewardPV: { width: w - 12 * p, padding: p, borderRadius: 2 * p, backgroundColor: 'white', justifyContent: 'flex-start' },
            headerPV: { width: w - 22 * p, paddingVertical: 2 * p },
            textPV1: { color: '#484848' },
            textPV2: { color: '#858585' },
            textPV3: { color: '#484848', marginVertical: p,alignItems:'flex-start' },
            textPV4: { color: '#484848', alignSelf: 'flex-start', marginVertical: p,paddingLeft:4*p},
            imagePV: { width: w * 0.667, height: w * 0.375, padding: p, marginVertical: 2 * p },
            buttonPV: { backgroundColor: '#01BBA0', width: w * 0.38, height: w * 0.1, borderRadius: p,alignItems:'center',justifyContent:'center'},
            buttonViewPV: { flexDirection: 'row', justifyContent: 'space-around', width: w - 22 * p, marginVertical: 2 * p },
            //style popupView
            parkingPV:{width: w - 12 * p,height: w * 1.1 * 9 / 16, borderRadius: 2 * p, backgroundColor: 'white', justifyContent: 'flex-start',padding:0},
            sliderContainer: {width: w-12*p, height: w * 0.95 * 9 / 16, backgroundColor: '#FFFFFF', borderRadius: 0},
        });
    }

    constructor(props, context, ...args) {
        super(props, context, ...args);
        //scale down image for faster loading
        this._imgScale = SGHelperType.getSysParamsValueToInt("ImageScaleParking")/2;
        this._data = {
            fParkirNameID: '',fParkirNameEN: '',fParkirNameCN: '',fWidthImage: 1,fHeightImage: 1,fCarScale: 1,
            fLastModifiedDate: Date.parse(SGHelperType.convertNewDate(new Date())),
            parkingSpot: [{fXPosition: 0,fYPosition: 0,fRotation: 0,fType: 0,fStatus: 0,fLocation: '',fPlate: '',fWidthImage: 1,fHeightImage: 1,fCarScale: 1,}],
            fGreen: 0,fRed: 0,fGrey:0,fPublic: 0,fLadies: 0,fDisabled:0,fValet: 0,fGold: 0,fVIP:0,fChargingStation:0,fDDSActive:'N'
        }
        this.style = this.createStyleSheet(this.WHP, this._data);
        this.props.navigation.setOptions({
            headerShown: false,
            headerTitle: '',
            headerBackTitle: 'Back'
        });
        this.pvParkingID = SGPopView.getPopViewID();
        SGHelperGlobalVar.addVar("ParkingCheckIn",false)
        this.isAlreadyCheckIn = false
        this.currentUser = SGHelperGlobalVar.getVar('GlobalCurrentUser');
        this.imageSetting = SGHelperGlobalVar.getVar('GlobalImageSetting');
        this.anonymousMode = SGHelperGlobalVar.getVar('GlobalAnonymous');
        this.userData = SGHelperGlobalVar.getVar('GlobalCurrentUserData');
        this.paymentData = []
        this._minutes = 0;
        this.mySpotCount = 0;
        this.startTimes = new Date()
        this.floatingButton=[]
        this.popUpRewardWaiting=false;
        this.surpriseReward = null;        
        this.pvID=SGPopView.getPopViewID()
        this.listOfPillar=[]
        this._searchedPillar=''
        this._typeCar=-1
        this._userDataParked={fID:null}
        this.mode=""
        this.selectedImage=[]
        this.state ={hideParkingLayoutDesc:false,parkingSpot:[]}
        this.modeEditFloating=false
        this.svRef=React.createRef();
        this.toggleFlagTriggered=false;
    }

    //event called by CarBoxCard when user select to check in
    async _checkInPress() {
        if (this.userData) {
            var userCheckInData = new tbUserCheckInData().getCurrentJSON();
            userCheckInData.fID = null;
            userCheckInData.fUserKey = this.userData.fID;
            userCheckInData.fCreatedBy = this.userData.fID;
            userCheckInData.fLastModifiedBy = this.userData.fID;
            userCheckInData.fContentType = 'Place';
            userCheckInData.fContentKey =  this.props.route.params.contentKey
            await this._addUserCheckInHandler(userCheckInData)
            return true
        }           
        return false;
    }

    async _addUserCheckInHandler(userCheckInData){
        try {
            this.dbID3 = SGDialogBox.showLoading(SGLocalize.translate("AlertMessage.Waiting"))
            await tbVUserCheckInAPI.addUserCheckIn(userCheckInData);
            SGHelperGlobalVar.setVar("ParkingCheckIn",true)
            this.isAlreadyCheckIn=true
            await this._SurpriseRewardCheckInMall();
            SGDialogBox.hideDialogBox(this.dbID3, true);
        } catch (error) {
            this.popUpRewardWaiting=false
            SGDialogBox.hideDialogBox(this.dbID3, true)
            SGHelperErrorHandling.Handling(error,this._addUserCheckInHandler.bind(this,userCheckInData))
        }       
    }

    async _SurpriseRewardCheckInMall() {
        try {
            this.surpriseReward = await VRewardAPI.SurpriseRewardCheckInMall(this.props.route.params.contentKey)
            if (this.surpriseReward.fID !== null) {
                this.popUpRewardWaiting=true
            } else {
                this.popUpRewardWaiting=false
                this.surpriseReward = null;
            }
        } catch (error) {
            SGHelperErrorHandling.Handling(error,this._SurpriseRewardCheckInMall.bind(this))
        }       
    }

    onShowReward() {
        if(this.popUpRewardWaiting){
            this.forceUpdate();
            setTimeout(() => { SGPopView.showPopView(this.pvID) }, 200);
        }
    }

    onHideRewardCondition(navigate){
        this.popUpRewardWaiting=false
        this.surpriseReward = null;
        SGPopView.hidePopView(this.pvID);
        if(navigate){
            setTimeout(()=>{
                SGHelperNavigation.navigatePush(this.props.navigation, 'MyRewards')
            },300)
        }
    }

    async onChangeParkir(data, action) {
        var date = new Date().toISOString()
        var copyJSON = {
            fID: '',
            fUserKey: this.userData.fID,
            fBuildingKey: this._data.fBuildingKey,
            fCheckInDate: date,
            fCheckOutDate: new Date(0),
            fParkirNameID: this._data.fParkirNameID,
            fParkirNameEN: this._data.fParkirNameEN,
            fParkirNameCN: this._data.fParkirNameCN,
            fBuildingNameID: this._data.fBuildingNameID,
            fBuildingNameEN: this._data.fBuildingNameEN,
            fBuildingNameCN: this._data.fBuildingNameCN,
            fActive: 'Y',
            fStatus: 'Y',
            fCreatedBy: this.userData.fID,
            fCreatedDate: date,
            fLastModifiedBy: this.userData.fID,
            fLastModifiedDate: date,
            fParkingJSON: {
                fID: data.fID,
                fBuildingKey: this._data.fBuildingKey,
                fParkingLayoutKey: this.props.route.params.fID,
                fParkirNameID: this._data.fParkirNameID,
                fParkirNameEN: this._data.fParkirNameEN,
                fParkirNameCN: this._data.fParkirNameCN,
                fBuildingNameID: this._data.fBuildingNameID,
                fBuildingNameEN: this._data.fBuildingNameEN,
                fBuildingNameCN: this._data.fBuildingNameCN,
                fLocation: data.fLocation,
                fPlate: data.fPlate,
                fRotation: data.fRotation,
                fStatus: data.fStatus,
                fType: data.fType,
                fXPosition: data.fXPosition,
                fYPosition: data.fYPosition
            }
        }
        this.dbIDOnChangeParkir = SGDialogBox.showLoading(SGLocalize.translate("AlertMessage.Waiting"))
        this.thread1 = this.baseInitAPIParallel( SGHelperGlobalVar.getVar("ResponTimes"), (() => { this.checkAPIBatchStatusAllDone1(); }).bind(this),()=>{},true);
        var result;
        if (action === 'add'){
            this.baseAddAPIParallel('AddParkingSpot', (async (v1) => { return tbVParkingUserAPI.AddParkingSpot(v1) }).bind(this,copyJSON), ((res) => {
                result = res;   
            }).bind(this), (()=>{ SGDialogBox.hideDialogBox(this.dbIDOnChangeParkir, true);}),this.thread1);
        } 
        else {
            this.baseAddAPIParallel('UpdateParkingSpot', (async (v1) => { return tbVParkingUserAPI.UpdateParkingSpot(v1) }).bind(this,copyJSON), ((res) => {
                result = res;   
            }).bind(this), (()=>{ SGDialogBox.hideDialogBox(this.dbIDOnChangeParkir, true);}), this.thread1);
        }

        this.baseRunAPIParallel(this.thread1); 
    }
    checkAPIBatchStatusAllDone2() {
        this.setState({parkingSpot:this._data.parkingSpot})
    }
    checkAPIBatchStatusAllDone1() {
        this.thread2 = this.baseInitAPIParallel( SGHelperGlobalVar.getVar("ResponTimes"), (() => { this.checkAPIBatchStatusAllDone2(); }).bind(this), ()=>{}, true);
        this.baseAddAPIParallel('GetParkingSpot', (async () => { return tbVParkingUserAPI.GetParkingSpot()}).bind(this), (async (v) => {
            SGDialogBox.hideDialogBox(this.dbIDOnChangeParkir, true);
            this._userDataParked = v 
            if (SGHelperType.isDefined(this._userDataParked) && this._userDataParked.fID !== null) {
                this.mySpotCount = this._data.fID === this._userDataParked.fParkingJSON.fParkingLayoutKey ? 1 : 0
            }
            this.startTimes = new Date()
        }).bind(this),()=>{SGDialogBox.hideDialogBox(this.dbIDOnChangeParkir, true);}, this.thread2); 
        
        this.baseAddAPIParallel('GetParkingLayoutAndData', (async (v1,v2) => { return tbVParkingUserAPI.GetParkingLayoutAndData(v1,v2) }).bind(this,this.props.route.params.fID,this.props.route.params.contentKey), ((v) => {
            this._data = v;
        }).bind(this),(()=>{if(this.dbID2!==null) SGDialogBox.hideDialogBox(this.dbID2, true)}).bind(this),this.thread2);

        this.baseRunAPIParallel(this.thread2); 
    }

    componentWillUnmount() {
        if (this._unsubscribe) { this._unsubscribe(); }
    }

    async componentDidMount() {
        this.dbID2 = SGDialogBox.showLoading("waiting")
        await this._onRefresh()
        this._unsubscribe = this.props.navigation.addListener('focus', async () => {
            this.userData = SGHelperGlobalVar.getVar('GlobalCurrentUserData');
            await this._onRefresh();
            this.forceUpdate();
            this.onShowReward();
        });
    }
    getImageJSON(){
        return(
            [{"id":"12a6be4d-4b3b-4b38-9dc2-08d946889ac8","high":{"uri":"https://spotguestoragedev04.blob.core.windows.net/visitor/b9073fe3-107e-42a9-7ec0-08d90e9bdd45.85644ceb-ec67-4a2c-99ec-8f84d919391e","width":1080,"height":1080},"med":{"uri":"https://spotguestoragedev04.blob.core.windows.net/visitor/b9073fe3-107e-42a9-7ec0-08d90e9bdd45.b7bfebe9-968d-492f-bcd9-a159b220f0ea","width":720,"height":720},"low":{"uri":"https://spotguestoragedev04.blob.core.windows.net/visitor/b9073fe3-107e-42a9-7ec0-08d90e9bdd45.74a0f82f-eaa6-4b3d-9d0f-2af639c3ff3f","width":480,"height":480},"thumbnailHigh":{"uri":"https://spotguestoragedev04.blob.core.windows.net/visitor/b9073fe3-107e-42a9-7ec0-08d90e9bdd45.8964c72b-b81e-4619-9788-9316528b3e45","width":360,"height":360},"thumbnailMed":{"uri":"https://spotguestoragedev04.blob.core.windows.net/visitor/b9073fe3-107e-42a9-7ec0-08d90e9bdd45.6bf35b3c-f4a7-443d-8a69-fde800e920d4","width":240,"height":240},"thumbnailLow":{"uri":"https://spotguestoragedev04.blob.core.windows.net/visitor/b9073fe3-107e-42a9-7ec0-08d90e9bdd45.545d7957-deae-4ddb-b072-979e16774f35","width":120,"height":120},"text":"","textPosition":"topLeft"}]
        )
    }
    getFloatingDataDummyJSON(){
        
        return[
            {"fID":"c35c9ba5-fcdb-49bc-9b14-3f77b840aaf1","fBuildingKey":"c1d319ee-93a3-466d-87b0-074754ac3504","fParkingLayoutKey":"d92168cf-be6c-4c3c-8506-b1ef262df22b","fImageJSON":[{"id":"12a6be4d-4b3b-4b38-9dc2-08d946889ac8","high":{"uri":"https://spotguestoragedev04.blob.core.windows.net/visitor/b9073fe3-107e-42a9-7ec0-08d90e9bdd45.85644ceb-ec67-4a2c-99ec-8f84d919391e","width":1080,"height":1080},"med":{"uri":"https://spotguestoragedev04.blob.core.windows.net/visitor/b9073fe3-107e-42a9-7ec0-08d90e9bdd45.b7bfebe9-968d-492f-bcd9-a159b220f0ea","width":720,"height":720},"low":{"uri":"https://spotguestoragedev04.blob.core.windows.net/visitor/b9073fe3-107e-42a9-7ec0-08d90e9bdd45.74a0f82f-eaa6-4b3d-9d0f-2af639c3ff3f","width":480,"height":480},"thumbnailHigh":{"uri":"https://spotguestoragedev04.blob.core.windows.net/visitor/b9073fe3-107e-42a9-7ec0-08d90e9bdd45.8964c72b-b81e-4619-9788-9316528b3e45","width":360,"height":360},"thumbnailMed":{"uri":"https://spotguestoragedev04.blob.core.windows.net/visitor/b9073fe3-107e-42a9-7ec0-08d90e9bdd45.6bf35b3c-f4a7-443d-8a69-fde800e920d4","width":240,"height":240},"thumbnailLow":{"uri":"https://spotguestoragedev04.blob.core.windows.net/visitor/b9073fe3-107e-42a9-7ec0-08d90e9bdd45.545d7957-deae-4ddb-b072-979e16774f35","width":120,"height":120},"text":"","textPosition":"topLeft"}],"fXPosition":137,"fYPosition":201,"fWidth":17,"fHeight":17},
            {"fID":"001dfeca-ee93-46ee-863c-0a7fc93275cb","fBuildingKey":"c1d319ee-93a3-466d-87b0-074754ac3504","fParkingLayoutKey":"d92168cf-be6c-4c3c-8506-b1ef262df22b","fImageJSON":[{"id":"12a6be4d-4b3b-4b38-9dc2-08d946889ac8","high":{"uri":"https://spotguestoragedev04.blob.core.windows.net/visitor/b9073fe3-107e-42a9-7ec0-08d90e9bdd45.85644ceb-ec67-4a2c-99ec-8f84d919391e","width":1080,"height":1080},"med":{"uri":"https://spotguestoragedev04.blob.core.windows.net/visitor/b9073fe3-107e-42a9-7ec0-08d90e9bdd45.b7bfebe9-968d-492f-bcd9-a159b220f0ea","width":720,"height":720},"low":{"uri":"https://spotguestoragedev04.blob.core.windows.net/visitor/b9073fe3-107e-42a9-7ec0-08d90e9bdd45.74a0f82f-eaa6-4b3d-9d0f-2af639c3ff3f","width":480,"height":480},"thumbnailHigh":{"uri":"https://spotguestoragedev04.blob.core.windows.net/visitor/b9073fe3-107e-42a9-7ec0-08d90e9bdd45.8964c72b-b81e-4619-9788-9316528b3e45","width":360,"height":360},"thumbnailMed":{"uri":"https://spotguestoragedev04.blob.core.windows.net/visitor/b9073fe3-107e-42a9-7ec0-08d90e9bdd45.6bf35b3c-f4a7-443d-8a69-fde800e920d4","width":240,"height":240},"thumbnailLow":{"uri":"https://spotguestoragedev04.blob.core.windows.net/visitor/b9073fe3-107e-42a9-7ec0-08d90e9bdd45.545d7957-deae-4ddb-b072-979e16774f35","width":120,"height":120},"text":"","textPosition":"topLeft"}],"fXPosition":191,"fYPosition":216,"fWidth":17,"fHeight":17},
            
            // {}
        ]
        //EXCEL
        //INSERT INTO tbBFloatingParkingDB VALUES ('c35c9ba5-fcdb-49bc-9b14-3f77b840aaf1','c1d319ee-93a3-466d-87b0-074754ac3504','d92168cf-be6c-4c3c-8506-b1ef262df22b','[{"id":"12a6be4d-4b3b-4b38-9dc2-08d946889ac8","high":{"uri":"https://spotguestoragedev04.blob.core.windows.net/visitor/b9073fe3-107e-42a9-7ec0-08d90e9bdd45.85644ceb-ec67-4a2c-99ec-8f84d919391e","width":1080,"height":1080},"med":{"uri":"https://spotguestoragedev04.blob.core.windows.net/visitor/b9073fe3-107e-42a9-7ec0-08d90e9bdd45.b7bfebe9-968d-492f-bcd9-a159b220f0ea","width":720,"height":720},"low":{"uri":"https://spotguestoragedev04.blob.core.windows.net/visitor/b9073fe3-107e-42a9-7ec0-08d90e9bdd45.74a0f82f-eaa6-4b3d-9d0f-2af639c3ff3f","width":480,"height":480},"thumbnailHigh":{"uri":"https://spotguestoragedev04.blob.core.windows.net/visitor/b9073fe3-107e-42a9-7ec0-08d90e9bdd45.8964c72b-b81e-4619-9788-9316528b3e45","width":360,"height":360},"thumbnailMed":{"uri":"https://spotguestoragedev04.blob.core.windows.net/visitor/b9073fe3-107e-42a9-7ec0-08d90e9bdd45.6bf35b3c-f4a7-443d-8a69-fde800e920d4","width":240,"height":240},"thumbnailLow":{"uri":"https://spotguestoragedev04.blob.core.windows.net/visitor/b9073fe3-107e-42a9-7ec0-08d90e9bdd45.545d7957-deae-4ddb-b072-979e16774f35","width":120,"height":120},"text":"","textPosition":"topLeft"}]','137','201','17','17','Y','25ed05dc-d5c2-4cd8-f051-08d86aa18a6b',GetDate(),'25ed05dc-d5c2-4cd8-f051-08d86aa18a6b',getDate() ) 
        //INSERT INTO tbBFloatingParkingDB VALUES ('52a6d9b5-ed8f-4c33-adea-aed454eeb81d','c1d319ee-93a3-466d-87b0-074754ac3504','d92168cf-be6c-4c3c-8506-b1ef262df22b','[{"id":"12a6be4d-4b3b-4b38-9dc2-08d946889ac8","high":{"uri":"https://spotguestoragedev04.blob.core.windows.net/visitor/b9073fe3-107e-42a9-7ec0-08d90e9bdd45.85644ceb-ec67-4a2c-99ec-8f84d919391e","width":1080,"height":1080},"med":{"uri":"https://spotguestoragedev04.blob.core.windows.net/visitor/b9073fe3-107e-42a9-7ec0-08d90e9bdd45.b7bfebe9-968d-492f-bcd9-a159b220f0ea","width":720,"height":720},"low":{"uri":"https://spotguestoragedev04.blob.core.windows.net/visitor/b9073fe3-107e-42a9-7ec0-08d90e9bdd45.74a0f82f-eaa6-4b3d-9d0f-2af639c3ff3f","width":480,"height":480},"thumbnailHigh":{"uri":"https://spotguestoragedev04.blob.core.windows.net/visitor/b9073fe3-107e-42a9-7ec0-08d90e9bdd45.8964c72b-b81e-4619-9788-9316528b3e45","width":360,"height":360},"thumbnailMed":{"uri":"https://spotguestoragedev04.blob.core.windows.net/visitor/b9073fe3-107e-42a9-7ec0-08d90e9bdd45.6bf35b3c-f4a7-443d-8a69-fde800e920d4","width":240,"height":240},"thumbnailLow":{"uri":"https://spotguestoragedev04.blob.core.windows.net/visitor/b9073fe3-107e-42a9-7ec0-08d90e9bdd45.545d7957-deae-4ddb-b072-979e16774f35","width":120,"height":120},"text":"","textPosition":"topLeft"}]','191','216','17','17','Y','25ed05dc-d5c2-4cd8-f051-08d86aa18a6b',GetDate(),'25ed05dc-d5c2-4cd8-f051-08d86aa18a6b',getDate() ) 
    }
    _showPopView(data){
        // console.log('hehe')
        console.log(data)
        this.selectedImage=data
        console.log(this.selectedImage[0][this.imageSetting])
        this.forceUpdate()
        SGPopView.showPopView(this.pvParkingID)
    }
    _closePopView(){
        this.selectedImage=[]
        SGPopView.hidePopView(this.pvParkingID)
    }
    async _onRefresh() {
        this.fBuildingKey = this.props.route.params.contentKey;
        this.fID = this.props.route.params.fID;
        this.thread3 = this.baseInitAPIParallel( SGHelperGlobalVar.getVar("ResponTimes"), (async() => { this.checkAPIBatchStatusAllDone(); }).bind(this),()=>{},true);
        
        this.baseAddAPIParallel('GetParkingLayoutAndData', (async (v1,v2) => { return tbVParkingUserAPI.GetParkingLayoutAndData(v1,v2) }).bind(this,this.props.route.params.fID,this.props.route.params.contentKey), ((v) => {
            this._data = v;
            console.log(v)
        }).bind(this),(()=>{if(this.dbID2!==null) SGDialogBox.hideDialogBox(this.dbID2, true)}).bind(this),this.thread3);

        
        this.baseAddAPIParallel('CheckUserCheckInHere', (async (v1) => { return tbVUserCheckInAPI.CheckUserCheckInHere(v1) }).bind(this,this.fBuildingKey), ((v) => {
            this.isAlreadyCheckIn = v 
            SGHelperGlobalVar.setVar("ParkingCheckIn",v)
        }).bind(this),(()=>{if(this.dbID2!==null) SGDialogBox.hideDialogBox(this.dbID2, true)}).bind(this), this.thread3);

        if (this.anonymousMode !== true) {
            this.baseAddAPIParallel('GetParkingSpot', (async () => { return tbVParkingUserAPI.GetParkingSpot() }).bind(this,), ((v) => {
                this._userDataParked = v 
                }).bind(this),(()=>{if(this.dbID2!==null) SGDialogBox.hideDialogBox(this.dbID2, true)}).bind(this), this.thread3);
        }
        
        this.baseAddAPIParallel('getPayment', (async (v1) => { return tbCPaymentAPI.getPayment(v1) }).bind(this,this.fBuildingKey), ((v) => {
            this.paymentData = v 
        }).bind(this),(()=>{if(this.dbID2!==null) SGDialogBox.hideDialogBox(this.dbID2, true)}).bind(this),this.thread3);
        
        this.baseAddAPIParallel('GetListOfPillar', (async (v1) => { return tbVParkingUserAPI.GetListOfPillar(v1) }).bind(this,this.fID), ((v) => {
            this.listOfPillar = v
        }).bind(this),(()=>{if(this.dbID2!==null) SGDialogBox.hideDialogBox(this.dbID2, true)}).bind(this), this.thread3);
        // this.floatingButton = this.getFloatingDataDummyJSON()
        // console.log(this.floatingButton)
        this.baseRunAPIParallel(this.thread3);
    }

    async checkAPIBatchStatusAllDone() {
        console.log("checkAPIBatchStatusAllDone")
        if (SGHelperType.isDefined(this._userDataParked) && this._userDataParked.fID !== null) {
            this.mySpotCount = this._data.fID === this._userDataParked.fParkingJSON.fParkingLayoutKey ? 1 : 0
        }
        // console.log(this._userDataParked)
        SGDialogBox.hideDialogBox(this.dbID2, true);
        this._addUserView();
        this.style = this.createStyleSheet(this.WHP, this._data);
        this.setState({parkingSpot:this._data.parkingSpot});
        if(!this.toggleFlagTriggered){ 
            this.toggleFlagTriggered = true;
            setTimeout((()=>{if(!this.state.hideParkingLayoutDesc){this.toggleHideShowInfo()}}).bind(this),3500);
        }
    }
    async _refreshParking() {
        this.baseRunSingleAPIWithRedoOption('GetParkingLayoutAndData', (async (v1,v2) => { this.dbIDRefreshParking = SGDialogBox.showLoading(); return tbVParkingUserAPI.GetParkingLayoutAndData(v1,v2) }).bind(this,this.props.route.params.fID,this.props.route.params.contentKey), ((v) => {
            this._data = v 
            console.log('2')
            console.log(v)
            this.startTimes = new Date()
            SGDialogBox.hideDialogBox(this.dbIDRefreshParking,true)
            this.setState({parkingSpot:v.parkingSpot})
        }).bind(this),  (()=>{SGDialogBox.hideDialogBox(this.dbIDRefreshParking,true)}),  SGHelperGlobalVar.getVar("ResponTimes"));
    }
    
    _onSearchPillar(v){
        this._searchedPillar = v
        this.mode="SearchPillar"
        this._typeCar = -1
        this.forceUpdate();
    }

    _isBlinking(location,type){
        if(this.mode==="SearchPillar"){
            if(this._searchedPillar === location) return true
        }else if(this.mode==="type"){
            if(this._typeCar==type) return true

        }
        return false
    }

    _onSearchMode(mode,active){
        this.mode="type"
        if(mode==="Public")this._typeCar = 0
        else if(mode==="Ladies")this._typeCar = 1
        else if(mode==="Disabled")this._typeCar = 2
        else if(mode==="Valet")this._typeCar = 3
        else if(mode==="Gold")this._typeCar = 4
        else if(mode==="VIP")this._typeCar = 5
        else if(mode==="ChargingStation")this._typeCar = 6
        if(active)this._typeCar=-1
        this._searchedPillar=''
        this.forceUpdate()
    }

    async _addUserView(){
        try {
            var jsonInput = { fID: '', fContentType: 'Parking',fContentKey: this._data.fID, fTargetKey: this._data.fBuildingKey, fUserKey: '', fActive: 'Y', fCreatedBy: '', fCreatedDate: new Date(), fLastModifiedBy: '', fLastModifiedDate: new Date() }
            await tbVUserViewAPI.addUserView(jsonInput) 
        } catch (error) {
            SGHelperErrorHandling.Handling(error,this._addUserView.bind(this),false,"addUserViewAPI")
        }
    }

    toggleHideShowInfo(){
        this.setState({hideParkingLayoutDesc:!this.state.hideParkingLayoutDesc});
        if(this.svRef.current){ this.svRef.current.scrollTo(0); }
    }
    render() {
        var { w, h, p } = this.WHP;
        var style = this.style;
        var tR = SGLocalize.translate;
        var paymentData = this.paymentData;
        var navigation = this.props.navigation;
        var language = this._language.toUpperCase();
        var surpriseReward = this.surpriseReward;
        var statusData = {
            available: this._data.fGreen,
            full:this._data.fRed,
            mySpot : this.mySpotCount,
            offline : this._data.fGrey,
            fDDSActive: this._data.fDDSActive,
            fDDSCount: this._data.fDDSCount
        }
        console.log(statusData)
        var _placeKey = this.props.route.params.contentKey;
        var dataTemp =this._data

        console.log('ParkingLayoutFullScreen');
        return (
            <RootView dummyStatusBar dummyHeaderBar accessible={true} accessibilityLabel={'ParkingLayoutFullScreenRootView'} style={style.mainContainer}>
                <SGPopView accessible={true} accessibilityLabel={'MallHomeScreenPopView'} vPos={'Top'} animationType={'slideUp'} modal popViewID={this.pvID} >
                    {
                        surpriseReward !== null &&
                        <View accessible={true} accessibilityLabel={'MallHomeScreenRewardView'} style={style.rewardPV}>
                            <View accessible={true} accessibilityLabel={'MallHomeScreenHeaderRewardView'} style={style.headerPV}>
                                <Text accessible={true} accessibilityLabel={'MallHomeScreenCongratsText'} style={style.textPV1} preset={Text.preset.titleH2B}>{tR('mallHomeScreen.RewardCongratulation')}</Text>
                                <Text accessible={true} accessibilityLabel={'MallHomeScreenRewardText'} style={style.textPV2} preset={Text.preset.titleH4_5B}>{tR('mallHomeScreen.RewardText')} {surpriseReward['fReward' + language].fTargetName}</Text>
                                <Image accessible={true} accessibilityLabel={'MallHomeScreenRewardImage'} style={style.imagePV} source={{ uri: surpriseReward['fReward' + language].fImageJSON.length !== 0 ? surpriseReward['fReward' + language].fImageJSON[0][this.imageSetting].uri : '' }}></Image>
                                <Text accessible={true} accessibilityLabel={'MallHomeScreenRewardName'} style={style.textPV3} preset={Text.preset.titleH3B}>{surpriseReward['fReward' + language].fRewardName}</Text>
                                <Text accessible={true} accessibilityLabel={'MallHomeScreenShortDesc'} style={style.textPV4} preset={Text.preset.titleH4}>{surpriseReward['fReward' + language].fShortDescription}</Text>
                                <View accessible={true} accessibilityLabel={'MallHomeScreenButtonView'} style={style.buttonViewPV}>
                                    <Button accessible={true} accessibilityLabel={'MallHomeScreenOkButton'} style={style.buttonPV} textPreset={Text.preset.titleH4_5B} label={tR('mallHomeScreen.Okay')} onPress={ (()=>{this.onHideRewardCondition(); })}></Button>
                                    <Button accessible={true} accessibilityLabel={'MallHomeScreenMyRewardsButton'} style={style.buttonPV} textPreset={Text.preset.titleH4_5B} label={tR('mallHomeScreen.MyRewards')} onPress={(() => { this.onHideRewardCondition(true);  }).bind(this)}></Button>
                                </View>
                            </View>
                        </View>
                    }
                </SGPopView>
                <SGPopView accessible={true} accessibilityLabel={'MallHomeScreenPopView'} vPos={'Top'} animationType={'slideUp'} modal popViewID={this.pvParkingID} >
                    <View accessible={true} accessibilityLabel={'MallHomeScreenRewardView'} style={style.parkingPV}>
                        <IconButton accessible={true} accessibilityLabel={'ParkingListScreenPopCloseIcon'} iconPreset={Icon.preset.h4} style={{position:'absolute', left:w*0.79,top:p, backgroundColor: 'rgb(38,38,38)', color: 'white', borderRadius: 5*p,zIndex:999}} name={Icon.Icon.close} onPress={()=>{this._closePopView()}} />
                        <ViewPager accessible={true} accessibilityLabel={'StorePromoSliderViewPager'} style={style.sliderContainer} initialPage={0} showPageIndicator={true} transitionStyle={'scroll'} pageIndicatorStyle={{ position: 'absolute', bottom: 0 * p, flexDirection: 'row', alignSelf: 'center' }}>
                        {
                            this.selectedImage.map((x) => {
                                return (
                                    <Image key={x.id} accessible={true} accessibilityLabel={'StorePromoSliderImage'} style={style.sliderContainer} source={{ uri: x[this.imageSetting].uri }}></Image>
                                )
                            })
                        }
                        </ViewPager>
                    </View>   
                </SGPopView>
                <View accessible={true} style={style.headerContainer}>
                    <View accessible={true} accessibilityLabel={'ParkingLayoutFullScreenHeaderView'} style={style.headerLeftContainer}>
                        <Text accessible={true} accessibilityLabel={'ParkingLayoutFullScreenLastUpdatedText'} preset={Text.preset.titleH1B} style={style.floorNameText}>{this._data['fParkirName' + language]}</Text>
                        <ParkingLayoutHeader startTimes = {this.startTimes} hiddenTop style={{width:w,height:h,padding:p}}></ParkingLayoutHeader>
                        {/* <Text accessible={true} accessibilityLabel={'ParkingLayoutFullScreenLastUpdatedText'} preset={Text.preset.h8} style={style.lastUpdatedText} numberOfLines={2}>{tR('ParkingLayoutFullScreen.LastUpdated', { count: 2 })}</Text> */}
                    </View>
                    <Button preset={Button.preset.green} label={'Refresh'} onPress={this._refreshParking.bind(this)}></Button>
                </View>
                <ScrollView dummyFooterBar dummyBottomBar ref={this.svRef} accessible={true} accessibilityLabel={'ParkingLayoutFullScreenScrollView'} contentContainerStyle={style.scrollViewActiveContainer}>
                    <View hidden={this.state.hideParkingLayoutDesc} style={{flex:1}}>
                        <Text style={{width:9/10*w, marginTop: 3*p, color:'gray'}}>{SGLocalize.translate("ParkingLayoutFullScreen.SupportedPayment")}</Text>
                        <View accessible={true} style={style.paymentInfoContainer}>
                            <ScrollView style={{width:w}} accessible={true} accessibilityLabel={'ParkingLayoutFullScreenHorizontalScrollView'}  horizontal showsHorizontalScrollIndicator={false}>
                                {        
                                        paymentData.map((d, index) => {
                                            return (
                                                <TouchableOpacity key={d.fID} style={{marginVertical:2*p}} >
                                                    <View accessible={true} shadow style={index === 0 ? style.firstPaymentImageContainer : style.paymentImageContainer}>
                                                        <Image accessible={true} accessibilityLabel={'ParkingLayoutFullScreenPaymentMethodImage'} source={{ uri: d['fContent' + this._language.toUpperCase()].fImageJSON[0][this.imageSetting].uri }} style={style.paymentImage}></Image>
                                                    </View>
                                                </TouchableOpacity>
                                            )

                                        })
                                }
                            </ScrollView>
                        </View>
                        <Text style={{width:9/10*w, marginTop: 3*p, color:'gray'}}>{SGLocalize.translate("ParkingLayoutFullScreen.Availability")}</Text>
                        <View style={{borderColor: '#E6E6E6', borderTopWidth:0.005*w}}>
                            <ParkingStatusDescription style={{width:w,padding:p}} data={statusData}></ParkingStatusDescription>
                        </View>
                        
                        <Text style={{width: 9/10*w, marginTop: 3*p, color:'gray'}}>{SGLocalize.translate("ParkingLayoutFullScreen.ParkingSpotType")}</Text>
                        <ParkingIconDescription style={{width:w,padding:p}} data={dataTemp} onPressIconDescription={this._onSearchMode.bind(this)} mode={this.mode}></ParkingIconDescription>
                        <SGFormPicker language={language} accessible={true} accessibilityLabel={'UserProfileFormGenderPicker'} single label={SGLocalize.translate("ParkingLayoutFullScreen.searchPillarText")}  optionList={this.listOfPillar} onValueChange={(v) => { this._onSearchPillar(v)}} value={this.selectedPillar} />
                    </View>
                    <TouchableOpacity style={{width:w,alignItems:'center',justifyContent:'center'}} onPress={()=>{this.setState({hideParkingLayoutDesc:!this.state.hideParkingLayoutDesc})}}>
                        <Icon  name={this.state.hideParkingLayoutDesc===true? Icon.Icon.arrowDown:Icon.Icon.arrowUp} preset={Icon.preset.h1} onPress={this.toggleHideShowInfo.bind(this)}></Icon>
                    </TouchableOpacity>
                    <Text hidden={this._data.fDDSActive==="N"}>{ tR("ParkingLayoutFullScreen.On")}</Text>
                    <SGPanZoomView showBar accessible={true} accessibilityLabel={'ParkingLayoutFullScreenZoomView'} style={style.psv1} scale={1 / this._imgScale} locked={false} maxScale={8}>
                        <ImageBackground accessible={true} accessibilityLabel={'ParkingLayoutFullScreenImgBackMap'} style={style.img1} source={{ uri: this._data.fURLImage }} resizeMode='contain' >
                            {
                              
                                this.state.parkingSpot.map((d,i) => {
                                    return <CarBoxCard accessible={true} accessibilityLabel={'ParkingLayoutFullScreenCarBoxCard'} placeKey={_placeKey} isAlreadyCheckIn={this.isAlreadyCheckIn} userData={this.userData} key={i} widthScreen={w} style={style.c1} data={d} scale={1 / this._scXY} onCheckInPress={this._checkInPress.bind(this)} onChangeParkir={this.onChangeParkir.bind(this)} userParked={this._userDataParked} onShowReward={this.onShowReward.bind(this)} navigation={navigation} fDDSActive={this._data.fDDSActive} fOnline={this._data.fOnline} blinking={this._isBlinking(d.fLocation,d.fType,this._mode)}/>
                                })
                            }
                            {
                                this.floatingButton.map((d,i)=>{
                                    if(SGHelperType.isDefined(d.fID))
                                    return <FloatingButton data={d} editMode={this.floatingButton.length===i+1 && this.modeEditFloating?true:false} showPopView={this._showPopView.bind(this)}></FloatingButton>
                                })
                            }
                        </ImageBackground>
                    </SGPanZoomView>
                </ScrollView>
                <Animated.View style={{ position: 'absolute', transform: [{ translateY: this._baseAnimY.interpolate({ inputRange: [-1, 0], outputRange: [(SGHelperWindow.getStatusBarHeight() - SGHelperWindow.getHeaderHeight()), SGHelperWindow.getStatusBarHeight()] }) },], height: SGHelperWindow.getHeaderHeight(), width: '100%' }}>
                    <CustomMenuBar btnBack accessible={true} accessibilityLabel={'HomeScreenHeader'} currentUser={this.currentUser} navigator={this.props.navigation} imageSetting={this.imageSetting} style={style.throwWHP}></CustomMenuBar>
                </Animated.View>
                <Animated.View style={{ position: 'absolute', transform: [{ translateY: this._baseAnimY.interpolate({ inputRange: [-1, 0], outputRange: [SGHelperWindow.getWHPNoHeader().h + 8 * p, SGHelperWindow.getWHPNoHeader().h - Math.max(SGHelperWindow.getFooterHeight(), 2 * p) - SGHelperWindow.getHeaderHeight()] }) },], height: Math.max(SGHelperWindow.getFooterHeight(), 2 * p) + SGHelperWindow.getHeaderHeight(), width: '100%' }}>
                    <BottomNavigationContainer accessible={true} currentUser={this.currentUser} navigator={this.props.navigation} style={style.throwWHP}></BottomNavigationContainer>
                </Animated.View>
            </RootView>
        );
    }
}