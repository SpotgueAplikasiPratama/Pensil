/*
 * Version 1.4.11
 * Yohanes, 5 Jan 2021
 * 1. new Screen
*/
import React from 'react';
import { StyleSheet, Animated,Linking,FlatList } from 'react-native';
import { SGRootView as RootView, SGView as View, SGText as Text, SGTouchableOpacity as TouchableOpacity, SGButton as Button, SGActivityIndicator as ActivityIndicator, SGRootView } from '../../../core/control';
import { SGBaseScreen } from '../../../core/screen/SGBaseScreen';
import { SGLocalize } from '../../locales/SGLocalize';
import { SGHelperNavigation, SGHelperGlobalVar,  SGHelperType } from '../../../core/helper';
import {tbVParkingUserAPI} from '../../api/tbVParkingUserAPI'  
import {VMallHomeAPI} from '../../api/VMallHomeAPI'  
import {EmptyDetailView} from '../../container_V2/EmptyDetailView'
import { TVEventHandler } from 'react-native';
export class SelectParkingScreen extends SGBaseScreen {
 
    createStyleSheet = (whp) => {
        var { w, h, p } = whp;
        return StyleSheet.create({
            to: { width:w*0.75,height:h*0.065,backgroundColor:'rgb(38,38,38)',justifyContent:'center',alignItems:'center',marginVertical:2*p,borderRadius:4*p },
            to1: { width:w*0.2,height:h*0.05,backgroundColor:'rgb(38,38,38)',justifyContent:'center',alignItems:'center',borderRadius:4*p},
            v1:{flex:1,width:'100%',height:'100%',alignItems:'center'},
            throwWHP:{width:w,height:h,padding:p}
        });
    }

    _enableTVEventHandler() {
     
        try {
            this._tvEventHandler = new TVEventHandler();
            this._tvEventHandler.enable(this, function (cmp, evt) {
                cmp._renderingRemote(evt.eventType,evt.eventKeyAction)
            });
        } catch (error) {
            console.log(error)
        }
        
      }
    
      _disableTVEventHandler() {
        if (this._tvEventHandler) {
          this._tvEventHandler.disable();
        //   delete this._tvEventHandler;
        }
      }
    async componentDidMount() {
        this._enableTVEventHandler();
        await this._onRefreshAllItem();
    }
    componentWillUnmount() {
        this._disableTVEventHandler();
        if (this._unsubscribe) { this._unsubscribe(); }
    }

    async _onRefreshAllItem() {

        this.currentUser = SGHelperGlobalVar.getVar('GlobalCurrentUser');
        this.currentUserData = SGHelperGlobalVar.getVar('GlobalCurrentUserData');
        this.imageSetting = SGHelperGlobalVar.getVar('GlobalImageSetting');
        this.currentUserImage = SGHelperGlobalVar.getVar('GlobalCurrentUserImage');
        this.baseRunSingleAPIWithRedoOption('SearchParkingBuildingList', (async (v1) => { return VMallHomeAPI.getBuildingParkingHighlightData(v1) }).bind(this, this.props.route.params.buildingKey), ((v) => {
            this.parkingList = v
            this.setState({refresh:false})
            this.alreadyMount=true
            this.freezeScreen=false
            this._onConstructArray(v.length)
            this._onConstructFunction()
            this.forceUpdate()
        }).bind(this),  (()=>{this.freezeScreen=false;this.forceUpdate()}).bind(this),  SGHelperGlobalVar.getVar("ResponTimes"),false);
    }

    constructor(props, context, ...args) {
        super(props, context, ...args);
        this.style = this.createStyleSheet(this.WHP);
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
        this._initVariable()
    }
    _initVariable(){
        this.initCountButton = 2
        this.maxButton= 2
        this.selectedRemote = 0
        this.freezeScreen=true
    }
    _renderingRemote(buttonClicked,isHoldButton){
        if(buttonClicked==="up" && !this.freezeScreen && isHoldButton===0){
            if(this.selectedRemote>0){
                this.selectedRemote = this.selectedRemote-1
                if(this.flatlistRef && this.selectedRemote!==0  && this.selectedRemote!==1){
                    this.flatlistRef.current.scrollToIndex({index: this.selectedRemote-this.initCountButton,animated:true});
                }
                this.forceUpdate()
            }
        }else if(buttonClicked==="down" && !this.freezeScreen && isHoldButton===0){
            if(this.selectedRemote<this.maxButton-1){
                this.selectedRemote = this.selectedRemote+1
                if(this.flatlistRef && this.selectedRemote!==0  && this.selectedRemote!==1){
                    this.flatlistRef.current.scrollToIndex({index: this.selectedRemote-this.initCountButton,animated:true});
                }
                this.forceUpdate()
            }
        }
        else if(buttonClicked==="select" && !this.freezeScreen && isHoldButton===0){
            if(this.selectedRemote===0){
                SGHelperNavigation.navigateReset(this.props.navigation,"SelectMall",{})
            }
            else if(this.selectedRemote===1){
                this._onButtonRefresh()
            }else if(this.selectedRemote>1){
                // console.log(this.arrParkingKey)
                // console.log(this.parkingList)
                var item = this.arrParkingKey[this.selectedRemote]

                // console.log(item)
                SGHelperNavigation.navigateReset(this.props.navigation,"ParkingDetailAndroidTV",{fParkingLayoutKey:item.fParkingLayoutKey,fBuildingKey:item.fBuildingKey})
            }
        }
       
    }

    _onConstructArray(length){
        this.maxButton=2
        this.maxButton = this.maxButton + length
    }
    _onConstructFunction(){
        this.arrParkingKey=[]
        for(var i=0;i<this.initCountButton;i++){
            this.arrParkingKey.push({})
        }
        console.log(this.parkingList)
        for(var i=0;i<this.parkingList.length;i++){
            this.arrParkingKey.push({fParkingLayoutKey:this.parkingList[i].fID,fBuildingKey:this.parkingList[i].fBuildingKey})
        }
    }
    _onButtonRefresh(){
        this.alreadyMount=false
        this.freezeScreen=true
        this.parkingList=[]
        this.setState({refresh:true})
        this.baseRunSingleAPIWithRedoOption('getBuildingParkingHighlightData', (async (v1) => { return VMallHomeAPI.getBuildingParkingHighlightData(v1) }).bind(this, this.props.route.params.buildingKey), ((v) => {
            this.parkingList = v
            this._onConstructArray(v.length)
            this._onConstructFunction()
            this.alreadyMount=true
            this.freezeScreen=false
            this.setState({refresh:false})
        }).bind(this),  (()=>{this.freezeScreen=false;this.forceUpdate()}).bind(this),  SGHelperGlobalVar.getVar("ResponTimes"),false);
    }
    _onClickByMouse(data){
        // console.log(data)
        // SGHelperNavigation.navigateReset(this.props.navigation,"ParkingDetailAndroidTV",{fParkingLayoutKey:data.fID,fBuildingKey:data.fBuildingKey})
    }
    render() {
        var { w, h, p } = this.WHP;
        var style = this.style;
        
        return (
            <SGRootView dummyStatusBar dummyHeaderBar accessible={true} accessibilityLabel={'RestoMenuDetailScreenRootView'} >
                <View style={style.v1}> 
                    <View style={{alignItems:'flex-end',width:w}}>
                        <View style={{backgroundColor:this.selectedRemote===0? 'rgba(38,38,38,0.25)':'transparent',marginRight:5*p,marginBottom:2*p }}>
                            <TouchableOpacity style={style.to1} onPress={()=>{SGHelperNavigation.navigateReset(this.props.navigation,"SelectMall",{})}} >
                                <Text style={{color:'white'}} preset={Text.preset.h5B}>{'Back'}</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{backgroundColor:this.selectedRemote===1? 'rgba(38,38,38,0.25)':'transparent',marginRight:5*p,marginBottom:2*p }}>
                            <TouchableOpacity style={style.to1} onPress={()=>{this._onButtonRefresh()}} >
                                <Text style={{color:'white'}} preset={Text.preset.h5B}>{'Refresh'}</Text>
                            </TouchableOpacity>
                        </View> 
                    </View>

                    <Text preset={Text.preset.h3}>{SGLocalize.translate("AndroidTV.SelectParking")}</Text>
                    <FlatList ref={this.flatlistRef} refreshing={this.state.refresh} accessible={true} accessibilityLabel={'FlatListRewardHistory'} data={this.parkingList}  contentContainerStyle={{ justifyContent: 'space-between', alignItems: 'center' }} renderItem={({ item, index }) => {
                        return (
                            <View style={{backgroundColor:this.selectedRemote===this.initCountButton+index? 'rgba(38,38,38,0.25)':'transparent'}} >
                                <TouchableOpacity  style={style.to} onPress={()=>{this._onClickByMouse(item)}}>
                                    <Text style={{color:'white'}} preset={Text.preset.h5B}>{item.fParkirNameID}</Text>
                                </TouchableOpacity>
                            </View>
                           
                        );
                    }}
                    keyExtractor={item => item.fID}
                    ListEmptyComponent={()=>{
                        if(!this.alreadyMount)
                            return <ActivityIndicator preset={ActivityIndicator.preset.h1} style={{ flex: 1 }}></ActivityIndicator>//<EmptyDetailView text={SGLocalize.translate('globalText.emptyList')} style={style.throwWHP}></EmptyDetailView>
                        else
                            return <EmptyDetailView text={SGLocalize.translate('globalText.emptyList')} style={style.throwWHP}></EmptyDetailView>
                    }}
                    ListHeaderComponent={()=>{
                        
                            return <View style={{with:w,height:h*0.065}}></View>
                    }}
                    >
                    </FlatList>
                </View>
            </SGRootView>
        );
    }
}