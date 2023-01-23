
/**
 * Version 1.3.0
 * 1. Melvin 20 May 2021
 * - Improve API Main Home Screen
 * Version 1.2.0
 * 1. Yohanes 26 March 2021
 * - add ErrorHandling
 * 2. Yohanes 26 April 2021
 * - add TrackingTransparency
 * Version 1.1.0
 * 1. Yohanes, 8 Maret 2021
 *  - add Version and Mode  
 *  - check Version Pending
 *  
 * */
 import React, { Fragment } from "react";
 import { StyleSheet, Dimensions, Linking, Platform,BackHandler } from "react-native";
 import { SGBaseScreen } from "../../../core/screen/SGBaseScreen";
 import { SGImage as Image, SGText as Text, SGView as View, SGRootView as RootView,SGDialogBox,SGFlatList as FlatList,SGActivityIndicator as ActivityIndicator } from "../../../core/control";
 import {  SGHelperGlobalVar, SGHelperNavigation, SGHelperType,SGHelperErrorHandling } from '../../../core/helper';
 import image from '../../asset/image';
 import { SGLocalize } from '../../locales/SGLocalize';
 import { tbVUserAPI } from '../../api/tbVUserAPI';
 import CryptoJS from 'crypto-js';
 import DeviceInfo from 'react-native-device-info';
 import { tbSystemParamsDAO } from '../../db/tbSystemParamsDAO';
 import { tbCLookUpAPI } from "../../api/tbCLookUpAPI";
 import { tbLookupDAO } from '../../db/tbLookupDAO';
 import idJSON from '../../locales/id.json';
 import enJSON from '../../locales/en.json';
 import cnJSON from '../../locales/cn.json';
 import { SGHelperAPICall } from '../../../core/helper/SGHelperAPICall';
 import { SGHelperWindow } from '../../../core/helper/SGHelperWindow';
 import { tbVUserLoginAPI } from '../../api/tbVUserLoginAPI';
 import { tbCSysParamAPI } from '../../api/tbCSysParamAPI';
 import { mode, version,tvMode } from '../../../../app.json'
 import RNExitApp from 'react-native-exit-app';
 import {SGHelperSoundPlayer} from '../../../core/helper/SGHelperSoundPlayer';
 import {tbVProfileSponsorshipAPI} from '../../api/tbVProfileSponsorshipAPI';
 export class SplashScreenAndroidTV extends SGBaseScreen {
 
     constructor(props, context, ...args) {
         super(props, context, ...args);
         SGHelperGlobalVar.addVar("Navigation",this.props.navigation)
         SGHelperGlobalVar.addVar("ResponTimes",15000)
         this.style = this.createStyleSheet(this.WHPNoHeader);
         this.props.navigation.setOptions({
             headerShown: false,
         });
         this.versionExpired = false;
         this.userTokenData = '';
         this.userDataSetting = '';
         this.sponsorData = [];
         this.alreadyMount = false;
         SGHelperGlobalVar.addVar('GlobalLanguage', 'id');
         SGLocalize.initLanguage(SGHelperGlobalVar.getVar('GlobalLanguage'));
         SGHelperGlobalVar.addVar("GlobalImageSetting", 'med');
         SGHelperGlobalVar.addVar("GlobalCurrency", 'IDR');
         SGHelperGlobalVar.addVar('GlobalAnonymous', false);
         SGHelperGlobalVar.addVar('tmpHidePrompt',false);
         SGHelperGlobalVar.addVar('tmpHidePromptFav',false);
         this.imageSetting = SGHelperGlobalVar.getVar("GlobalImageSetting");
         this.currency = SGHelperGlobalVar.getVar("GlobalCurrency");
         this.state = { loadingStart: 0, loadingEnd: 6, disabled: true,apiMap:false,apiAnonymous:false,apiSponsorship:false,apiLastLogin:false,apiLookUp:false,apiSysParams:false,navigate:false }
         this.pending = false
         SGHelperGlobalVar.setVar("UserLikeCache",[]);
         SGHelperGlobalVar.setVar("UserFavoriteCache",[]);
         SGHelperGlobalVar.setVar("UserNotificationCache",[]);
         this._logo = [require('../../asset/logo1_480.gif'),
             require('../../asset/logo2_480.gif'),
             require('../../asset/logo3_480.gif'),
             require('../../asset/logo4_480.gif'),
             require('../../asset/logo5_480.gif'),
             require('../../asset/logo6_480.gif')];
         this._i = Math.floor(Math.random()*6);
         this._soundFinished=false;
     }
 
     hashAnonymousLogin(str, key) {
         str = CryptoJS.enc.Utf8.parse(str);
         key = CryptoJS.enc.Utf8.parse(key);
         var mac = CryptoJS.HmacSHA256(str, key);
         return (mac.toString(CryptoJS.enc.Base64));
     }
 
     createStyleSheet = (whp) => {
         var { w, h, p } = whp;
         return StyleSheet.create({
             mainView1: { width: w, height: h, padding: p, justifyContent: 'center', backgroundColor: 'rgb(254,252,254)' },
             imageCont1: { padding: p, backgroundColor: 'rgb(254,252,254)' },
             image1:{backgroundColor:'white',width:w*0.5, height:w*0.5, resizeMode: 'contain',},
             container: { height: w * 0.015, width: w * 0.35, backgroundColor: 'rgb(254,252,254)', borderColor: 'rgb(228,228,228)', borderWidth: 1, borderRadius: 10, alignItems: 'flex-start', marginTop: 1 * p },
             text1: { color: '#909090', },
             vViewSponsorship:{width:w,flexDirection:'row',justifyContent:'space-between'},
             viewVSponsorship: { alignSelf: 'stretch', flex: 1 },
             vSponsorship: { width: w*0.12, height:w*0.12, justifyContent: 'center', alignItems: 'center',marginHorizontal:8*p },
             textSponsorship: { color: '#909090',alignSelf:'center' },
             style1:{width:w,height:w*0.15},
             style2:{width:w,height:w*0.3},
             style3:{width:w,height:w*0.45}
         });
     };
 
     async _tableMapAPI() {
 
      var res = await SGHelperAPICall.refreshVisitorAPIMap()
   
     }
 
     linkDownload(res) {
         var result = JSON.parse(res.data);
         
         if (Platform.OS === 'ios') {
             var value = result.linkAppStore
             this.handleLink(value)
         } else {
             var value = result.linkPlayStore
             this.handleLink(value)
         }
     }
 
     handleLink(url) {
         Linking.canOpenURL(url
         ).then(supported => {
             if (supported) {
                 Linking.openURL(url);
             } else {
               SGDialogBox.showWebView(url,()=>{});
             }
         });
     };
 

 
 
     async APIBatchStatusAllDone() {
         this.alreadyMount = true;
         this.forceUpdate();
         this._askingVersion("SelectMall")
     }
     async getInitAPI(){
        this.baseInitAPIParallel( SGHelperGlobalVar.getVar("ResponTimes"), (async () => { await this.APIBatchStatusAllDone(); }).bind(this),null,false,true);
           
        this.baseAddAPIParallel('getAllSponsorshipData', (async () => { return tbVProfileSponsorshipAPI.searchActiveSponsor(); }).bind(this), ((v) => {
            // this.sponsorData = v
            // this.sponsorData=[]

            if(v.length>=9){
              for(var i =0;i<9;i++){
                this.sponsorData.push(v[i])
              }
            }else{
              for(var i =0;i<v.length;i++){
                this.sponsorData.push(v[i])
              }
            }
              // for(var i =0;i<9;i++){
              //   this.sponsorData.push(v[0])
              // }
            this.setState(prevState => ({ loadingStart: prevState.loadingStart + 1,apiSponsorship:true }))
        }).bind(this), null);

        // //get last login for announcement setting
        this.baseAddAPIParallel('getLastLoginUser', (async () => { return tbVUserLoginAPI.getLastLoginUser(); }).bind(this), ((v) => {
            SGHelperGlobalVar.addVar("lastLogin", v);
            this.setState(prevState => ({ loadingStart: prevState.loadingStart + 1,apiLastLogin:true }))
        }).bind(this), null);

        // //Update Lookup to Realm
        this.baseAddAPIParallel('getAllLookUpData', (async () => { return tbCLookUpAPI.getAllLookUpData(); }).bind(this), ((v) => {
            this.LookUpData = v
            // console.log('LookUpData')
            // console.log(this.LookUpData);
            tbLookupDAO.refreshLookup(this.LookUpData);
            this.setState(prevState => ({ loadingStart: prevState.loadingStart + 1 ,apiLookUp:true}))
        }).bind(this), null);

        // //retrieve visitor sysparam and store in memory
        this.baseAddAPIParallel('searchSysParam', (async () => { return tbCSysParamAPI.searchSysParam([{ name: 'fType', operator: '=', value: 'visitor' }], []); }).bind(this), ((v) => {
            var systemParamObject = {}
            for (var i = 0; i < v.length; i++) {
                systemParamObject[v[i].fParams] = v[i].fValue
            }
            SGHelperGlobalVar.addVar("SysParam", systemParamObject)
            SGHelperGlobalVar.setVar("ResponTimes",SGHelperType.getSysParamsValueToInt("TimeOutAPI"))
            this.setState(prevState => ({ loadingStart: prevState.loadingStart + 1,apiSysParams:true }))
        }).bind(this),  null);

        this.baseRunAPIParallel();
     }
     async _getAnonymous(){
         try {
           var date = new Date().toJSON()
           var str = DeviceInfo.getUniqueId() + date
           var deviceJSON = {
               fDeviceID: DeviceInfo.getUniqueId(),
               password: this.hashAnonymousLogin(str, "SpotgueRangers"),
               timestamp: date,
               fDeviceModel: DeviceInfo.getModel(),
               fDeviceBrand: DeviceInfo.getBrand(),
               fDeviceOS: DeviceInfo.getSystemName(),
               fDeviceOSVersion: DeviceInfo.getSystemVersion(),
               fDeviceHeight: (Dimensions.get('screen').width).toString(),
               fDeviceWidth: (Dimensions.get('screen').width).toString(),
               fLoginLocation: ""
           }
             console.log("CallAnonymous")
             var resAnonymous = await tbVUserAPI.anonymous(deviceJSON);
             console.log('res Anonymous');
             console.log(resAnonymous);
             this.setState(prevState => ({ loadingStart: prevState.loadingStart + 1,apiAnonymous:true }))
             // var result = JSON.parse(resAnonymous.data);
             SGHelperGlobalVar.addVar("token", resAnonymous.token);
             SGHelperGlobalVar.addVar('refreshAnnouncement', true);
             this.getInitAPI()
       
         } catch (error) {
             SGHelperErrorHandling.Handling(error,this._getAnonymous.bind(this,deviceJSON),null,false,'_getAnonymous')
         }
     }

     async _getData(){

         this.baseRunSingleAPIWithRedoOption('APIMap', (async () => { return this._tableMapAPI() }).bind(this), ( async () => {
             if (!this.pending) {
                 this.setState(prevState => ({ loadingStart: prevState.loadingStart + 1,apiMap:true }))
                 if (this.versionExpired == false) {
 
                     SGHelperGlobalVar.addVar('GlobalLastSelectedPlace', { key: '', placeNameID: idJSON.globalText.defaultSelectedPlaceText, placeNameEN: enJSON.globalText.defaultSelectedPlaceText, placeNameCN: cnJSON.globalText.defaultSelectedPlaceText });
                     SGHelperGlobalVar.addVar('GlobalEnableAliceVoice', true);
                     await this._getAnonymous();
                    
                 }
             }
         }).bind(this), null,  SGHelperGlobalVar.getVar("ResponTimes"),false);
   
     }
     async _checkingConnection(){
        if(!this.state.apiMap){
            await this._getData()
        }else if(!this.state.apiAnonymous){
            await this._getAnonymous();
        }else{
            this.getInitAPI()
        }
     }
     async componentDidMount() {
         await this._getData()
         BackHandler.addEventListener('hardwareBackPress', this.onBackPress);
         this.interval = setInterval(async() => {
           await this._checkingConnection()
         }, 30000);
        
     }
     
     _askingVersion(screen) {
         if(this._soundFinished){
             var running_on_android_tv = Platform.isTV;
             if(running_on_android_tv && tvMode){
                 if(this.state.navigate===false){
                     this.setState({navigate:true})
                     SGHelperNavigation.navigateReset(this.props.navigation, screen,{})
                 }
              
             }
             
         } else {
             setTimeout((()=>{this._askingVersion(screen)}).bind(this),250);
         }
     }
     componentWillUnmount() {
        clearInterval(this.interval);
         clearTimeout(this.timeoutHandle); // This is just necessary in the case that the screen is closed before the timeout fires, otherwise it would cause a memory leak that would trigger the transition regardless, breaking the user experience.
         BackHandler.removeEventListener('hardwareBackPress', this.onBackPress);
     }
 
     onBackPress(){
         SGDialogBox.showConfirmation(null, SGLocalize.translate('ExitApp.ExitAppTitle'), SGLocalize.translate('ExitApp.ExitAppDesc'), SGLocalize.translate('ExitApp.No2'), () => { console.log('Close') },SGLocalize.translate('ExitApp.Yes2'), () => {RNExitApp.exitApp()}, true)
         return true;
     }
     
     _generateStyle(){
         if(this.sponsorData.length >=1 && this.sponsorData.length <=3){
             return this.style.style1
         }else if(this.sponsorData.length >=4 && this.sponsorData.length <=6){
             return this.style.style2
         }else if(this.sponsorData.length >=7 && this.sponsorData.length <=9){
             return this.style.style3
         }
     }
     render() {
         var { w, h, p } = this.WHP;
         var style = this.style;
         return (
             <RootView accessible={true} accessibilityLabel={'SplashScreenRootView'} style={style.mainView1}>
                 {/* {this.alreadyMount && */}
                     <View accessible={true} accessibilityLabel={'SplashScreenImageContainerView'} style={style.imageCont1}>
                         <View style={{width:w,flex:1,justifyContent:'center'}}>
                             <Image accessible accessibilityLabel={'SplashScreenLogoImage'} style={style.image1} source={this._logo[this._i]} onLoad={(()=>{SGHelperSoundPlayer.playSFX(require('../../asset/spotgue_sound.m4a'),0,()=>{this._soundFinished=true;})}).bind(this)} >
                             </Image>
                             <Text accessible={true} accessibilityLabel={'SplashScreenTagLineText'} preset={Text.preset.titleH3} style={style.text1} >{SGLocalize.translate("splashScreen.tagLine")}</Text>
                             <View style={style.container}>
                                 <View style={{ height: w * 0.015, width: (w * 0.35) * this.state.loadingStart / this.state.loadingEnd, backgroundColor: 'rgb(205,205,205)', justifyContent: 'flex-start' }}></View>
                             </View>
                         </View>
                         {this.sponsorData.length !==0 &&
                         <View style={{position:'absolute',bottom:0}}> 
                             {/* <Text preset={Text.preset.h7B} style={style.textSponsorship}>{SGLocalize.translate("splashScreen.SponsorText")}</Text> */}
                             <View style={this._generateStyle()}>
                                 <FlatList  scrollEnabled={false}   
                                     contentContainerStyle={{flexDirection:'column'}} style={{height:w*0.45}}  numColumns={3} data={this.sponsorData}  renderItem={({ item }) => {
                                         return (  
                                             <Image style={style.vSponsorship} source={{ uri:  item['fContentID'].fSponsorImageJSON[0].high.uri  }} />  
                                         );
                                         }} keyExtractor={item => item.fID}>
                                 </FlatList>
                             </View>
                         </View>
                         }
                     </View>
                 {/* } */}
                  <View style={{ width: '100%', height: SGHelperWindow.getFooterHeight(),backgroundColor:'transparent' }}></View>
                  <View style={{ width: '100%', height: SGHelperWindow.getFooterHeight(),backgroundColor:'transparent' }}></View>
                 {/* {this.alreadyMount && */}
                     <View style={{ position:'absolute',bottom:15}}><Text preset={Text.preset.titleH4} style={{ color: 'rgb(144,144,144)' }}>{version} ({mode})</Text></View>
                 {/* } */}
             </RootView>
         );
     }
 }
 
 
 