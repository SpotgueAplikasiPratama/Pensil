/*
 * Version 1.4.11
 * Yohanes, 5 Jan 2021
 * 1. new Screen
*/
import React from 'react';
import { StyleSheet, Animated,Linking,FlatList, Dimensions } from 'react-native';
import { SGRootView as RootView, SGView as View, SGText as Text, SGTouchableOpacity as TouchableOpacity, SGButton as Button, SGActivityIndicator as ActivityIndicator, SGRootView, SGActivityIndicator } from '../../../core/control';
import { SGBaseScreen } from '../../../core/screen/SGBaseScreen';
import { SGLocalize } from '../../locales/SGLocalize';
import { SGHelperNavigation, SGHelperGlobalVar,  SGHelperType,SGHelperWindow } from '../../../core/helper';
import {tbVParkingUserAPI} from '../../api/tbVParkingUserAPI'  
import {VMallHomeAPI} from '../../api/VMallHomeAPI'   
import {tbVParkingAndroidTVAPI} from '../../api/tbVParkingAndroidTVAPI'  
import {EmptyDetailView} from '../../container_V2/EmptyDetailView'
import { TVEventHandler } from 'react-native';
import { MallHeaderAndroidTV } from '../../container_V2/MallHeaderAndroidTV';
import { MallBodyParkingAndroidTV } from '../../container_V2/MallBodyParkingAndroidTV';
import {ParkingHeaderAndroidTV} from '../../container_V2/ParkingHeaderAndroidTV'
import {MallFooterAndroidTV} from '../../container_V2/MallFooterAndroidTV'
export class ParkingDetailAndroidTVScreen extends SGBaseScreen {
 
    createStyleSheet = (whp) => {
        var { w, h, p } = whp;
        return StyleSheet.create({
            to: { width:w*0.75,height:h*0.065,backgroundColor:'rgb(38,38,38)',justifyContent:'center',alignItems:'center',marginVertical:2*p,borderRadius:4*p },
            throwWHP:{width:w,height:h,padding:p}
        });
    }

    async componentDidMount() {
        await this._onRefreshAllItem();
        setTimeout(() => {
            SGHelperNavigation.navigate(this.props.navigation,"HomeMallDetailAndroidTV",{fBuildingKey:this.props.route.params.fBuildingKey,fParkingLayoutKey:this.props.route.params.fParkingLayoutKey})
        }, 60000);
        this.interval= setInterval(async() => {
            console.log("RefreshParkingDetail every "+ SGHelperType.getSysParamsValueToInt('ParkingDetailAndroidTVScreen1')/1000 +" seconds")
            await this._onRefreshAllItem();
       }, SGHelperType.getSysParamsValueToInt('ParkingDetailAndroidTVScreen1'));
       this._unsubscribe = this.props.navigation.addListener('focus', async () => {

        // console.log(SGHelperNavigation.getRoutes(this.props.navigation))
        setTimeout(() => {
            SGHelperNavigation.navigate(this.props.navigation,"HomeMallDetailAndroidTV",{fBuildingKey:this.props.route.params.fBuildingKey,fParkingLayoutKey:this.props.route.params.fParkingLayoutKey})
        }, 60000);
        });
    }
    componentWillUnmount() {
        if (this._unsubscribe) { this._unsubscribe(); }
        clearInterval(this.interval);
    }
    checkAPIBatchStatusAllDone(){
        this.alreadyMount=true
        this.timeUpdate = new Date()
        this.forceUpdate()
    }
    async _onRefreshAllItem() {

        this.currentUser = SGHelperGlobalVar.getVar('GlobalCurrentUser');
        this.currentUserData = SGHelperGlobalVar.getVar('GlobalCurrentUserData');
        this.imageSetting = SGHelperGlobalVar.getVar('GlobalImageSetting');
        this.currentUserImage = SGHelperGlobalVar.getVar('GlobalCurrentUserImage');

        this.baseInitAPIParallel( SGHelperGlobalVar.getVar("ResponTimes"), (() => { this.checkAPIBatchStatusAllDone(); }).bind(this),null,false,true);
        this.baseAddAPIParallel('GetParkingLayoutAndData', (async (v1,v2) => { return tbVParkingUserAPI.GetParkingLayoutAndData(v1,v2)}).bind(this,this.props.route.params.fParkingLayoutKey,this.props.route.params.fBuildingKey), (async (v) => {
            this._data = v
            // console.log(this._data)
        }).bind(this),null, null); 
        
        this.baseAddAPIParallel('getBuildingParkingHighlightData', (async (v1) => { return VMallHomeAPI.getBuildingParkingHighlightData(v1) }).bind(this, this.props.route.params.fBuildingKey), ((v) => {
            this._parkingHighlightData=v
        }).bind(this), null, null);
        this.paramParkingLog = {
            fBuildingKey:this.props.route.params.fBuildingKey,
            fParkingLayoutKey:this.props.route.params.fParkingLayoutKey,
            fDate: SGHelperType.convertNewDate(new Date())
        }
        console.log('aw')
        console.log(this.paramParkingLog)
        this.baseAddAPIParallel('AddAndroidTVLog', (async (v1) => { return tbVParkingAndroidTVAPI.AddAndroidTVLog(v1) }).bind(this, this.paramParkingLog), ((v) => {
        }).bind(this), null, null);
        this.baseRunAPIParallel(); 
    }

    constructor(props, context, ...args) {
        super(props, context, ...args);
        this.style = this.createStyleSheet(this._whpNoHeader);
      
        this.props.navigation.setOptions({
            headerShown: false,
        });
        this.currentUser = SGHelperGlobalVar.getVar('GlobalCurrentUser');
        this.currentUserData = SGHelperGlobalVar.getVar('GlobalCurrentUserData');
        this.currentUserCurrency = SGHelperGlobalVar.getVar('GlobalCurrency');
        this.imageSetting = SGHelperGlobalVar.getVar('GlobalImageSetting');
        this.currentUserImage = SGHelperGlobalVar.getVar('GlobalCurrentUserImage');
        this.alreadyMount = false;
        this.parkingList=[]
        this.arrFilter=[]
        this.arrSort=[
            { name: 'fBuildingName'+ this._language.toUpperCase(), descending: false, selected: true },
        ]
        this.state={refresh:true,buttonList:[]}
        this.flatlistRef= React.createRef();
        this._parkingHighlightData=[]
        this.text="Temukan info parkir tersedia dan tandai titik parkir Anda di Aplikasi MAG"
       
    }


    render() {
        var { w, h, p } = this.WHP;
        var style = this.style;
        var data = this._data
        var parkingHighlightData = this._parkingHighlightData
        // console.log(SGHelperGlobalVar.getVar("token"))
        // console.log(JSON.stringify({
        //     fBuildingKey:this.props.route.params.fBuildingKey,
        //     fParkingLayoutKey:this.props.route.params.fParkingLayoutKey,
        //     fDate: SGHelperType.convertNewDate(new Date())
        // }))
        return (
            <SGRootView   accessible={true} accessibilityLabel={'RestoMenuDetailScreenRootView'} style={{flex:1}}>
               {
                   this.alreadyMount &&
                   <View style={{width:'100%',height:'100%'}}>
                        <MallHeaderAndroidTV data={data['fContent'+this._language.toUpperCase()] } imageSetting={this.imageSetting} language={this._language}></MallHeaderAndroidTV>
                        <ParkingHeaderAndroidTV lastUpdated={new Date()} parkingData={parkingHighlightData} buildingKey={data.buildingKey} language={this._language} style={style.throwWHP}></ParkingHeaderAndroidTV>
                        <MallBodyParkingAndroidTV style={{width:w,height:h,padding:p}} parkingData ={data} language={this._language} lastUpdated={this.timeUpdate}></MallBodyParkingAndroidTV>
                        <MallFooterAndroidTV fBuildingName={this._data['fBuildingName'+this._language.toUpperCase()]} text={this.text} style={{width:w,height:h,padding:p}} parkingData ={data} language={this._language} lastUpdated={this.timeUpdate}></MallFooterAndroidTV>
                    </View>
               }
               {
                   !this.alreadyMount &&
                   <SGActivityIndicator style={{flex:1}} preset={SGActivityIndicator.preset.h1}></SGActivityIndicator>
               }
            </SGRootView>
        );
    }
}