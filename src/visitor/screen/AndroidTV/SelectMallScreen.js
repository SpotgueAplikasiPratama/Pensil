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
import {EmptyDetailView} from '../../container_V2/EmptyDetailView'
import { TVEventHandler } from 'react-native';
export class SelectMallScreen extends SGBaseScreen {
 
    createStyleSheet = (whp) => {
        var { w, h, p } = whp;
        return StyleSheet.create({
            to: { width:w*0.75,height:h*0.065,backgroundColor:'rgb(38,38,38)',justifyContent:'center',alignItems:'center',marginVertical:2*p,borderRadius:4*p },
            to1: { width:w*0.2,height:h*0.05,backgroundColor:'rgb(38,38,38)',justifyContent:'center',alignItems:'center',borderRadius:4*p},
            v1:{flex:1,width:'100%',height:'100%',alignItems:'center'}
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
        this.baseRunSingleAPIWithRedoOption('SearchParkingBuildingList', (async (v1,v2) => { return tbVParkingUserAPI.SearchParkingBuildingList(v1,v2) }).bind(this, this.arrFilter, this.arrSort), ((v) => {
            this.mallList = v
            this.setState({refresh:false})

            this.freezeScreen=false
            this._onConstructArray(v.length)
            this._onConstructFunction()
            this.forceUpdate()
            // console.log(v[0])
            // console.log('aw')
            // console.log(this.mallList)
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
        this.mallList=[]
        this.arrFilter=[]
        this.arrSort=[
            { name: 'fBuildingName'+ this._language.toUpperCase(), descending: false, selected: true },
        ]
        
        this.state={refresh:true,buttonList:[]}
        this.flatlistRef= React.createRef();
        this._initVariable()
    }
    _initVariable(){
        this.initCountButton = 1
        this.maxButton=1
        this.selectedRemote = -1
        this.freezeScreen=true
    }
    _renderingRemote(buttonClicked,isHoldButton){
        // console.log(buttonClicked)
        
        if(buttonClicked==="up" && !this.freezeScreen && isHoldButton===0){
            // this.selectedRemote=
            if(this.selectedRemote>0){
                this.selectedRemote = this.selectedRemote-1
                if(this.flatlistRef && this.selectedRemote!==0 && this.selectedRemote!==1){
                    this.flatlistRef.current.scrollToIndex({index: this.selectedRemote-1});
                }
                this.forceUpdate()
            }
        }else if(buttonClicked==="down" && !this.freezeScreen && isHoldButton===0){
            if(this.selectedRemote<this.maxButton-1){
                this.selectedRemote = this.selectedRemote+1
                if(this.flatlistRef && this.selectedRemote!==0 && this.selectedRemote!==1){
                    this.flatlistRef.current.scrollToIndex({index: this.selectedRemote-1});
                }
                this.forceUpdate()
            }
        }
        else if(buttonClicked==="select" && !this.freezeScreen && isHoldButton===0){
            if(this.selectedRemote===0){
                this._onButtonRefresh()
            }else if(this.selectedRemote>0){
              SGHelperNavigation.navigateReset(this.props.navigation,"SelectParking",{buildingKey:this.arrBuildingKey[this.selectedRemote]})
            }
        }
       
    }
    _onClickByMouse(data){
        // SGHelperNavigation.navigateReset(this.props.navigation,"SelectParking",{buildingKey:data.buildingKey})
    }
    _onConstructArray(length){
        this.maxButton=1
        this.maxButton = this.maxButton + length
     
    }
    _onConstructFunction(){
        this.arrBuildingKey=[]
        for(var i=0;i<this.initCountButton;i++){
            this.arrBuildingKey.push("")
        }
        for(var i=0;i<this.mallList.length;i++){
            this.arrBuildingKey.push(this.mallList[i].buildingKey)
        }
        // this.selectedKey= buildingKey
    }
    _onButtonRefresh(){
        this.freezeScreen=true
        this.mallList=[]
        this.setState({refresh:true})
        this.baseRunSingleAPIWithRedoOption('SearchParkingBuildingList', (async (v1,v2) => { return tbVParkingUserAPI.SearchParkingBuildingList(v1,v2) }).bind(this, this.arrFilter, this.arrSort), ((v) => {
            this.mallList = v
            this._onConstructArray(v.length)
            this._onConstructFunction()
            // this._onConstructArray
            this.freezeScreen=false
            this.setState({refresh:false})
        }).bind(this),  (()=>{this.freezeScreen=false;this.forceUpdate()}).bind(this),  SGHelperGlobalVar.getVar("ResponTimes"),false);
    }

    render() {
        var { w, h, p } = this.WHP;
        var style = this.style;
        
        return (
            <SGRootView dummyStatusBar dummyHeaderBar accessible={true} accessibilityLabel={'RestoMenuDetailScreenRootView'} style={style.mainContainer}>
                <View style={style.v1}> 
                    <View style={{alignItems:'flex-end',width:w}}>
                        <View style={{backgroundColor:this.selectedRemote===0? 'rgba(38,38,38,0.25)':'transparent',marginRight:5*p,marginBottom:5*p }}>
                            <TouchableOpacity style={style.to1} onPress={()=>{this._onButtonRefresh()}} >
                                <Text style={{color:'white'}} preset={Text.preset.h5B}>{'refresh'}</Text>
                            </TouchableOpacity>
                        </View>

                    </View>
                 
                    <Text preset={Text.preset.h3}>{SGLocalize.translate("AndroidTV.SelectMall")}</Text>
                  
                    <FlatList  ref={this.flatlistRef} refreshing={this.state.refresh} accessible={true} accessibilityLabel={'FlatListRewardHistory'} data={this.mallList}  contentContainerStyle={{ justifyContent: 'space-between', alignItems: 'center' }} renderItem={({ item, index }) => {
                      
                        return (
                            // <Button label={item.fBuildingNameID}></Button>
                            <View style={{backgroundColor:this.selectedRemote===this.initCountButton+index? 'rgba(38,38,38,0.25)':'transparent'}} >
                                <TouchableOpacity  style={style.to} onPress={()=>{this._onClickByMouse(item)}}>
                                    <Text style={{color:'white'}} preset={Text.preset.h5B}>{item.fBuildingNameID}</Text>
                                </TouchableOpacity>
                            </View>
                           
                        );
                    }}
                    keyExtractor={item => item.buildingKey}
                    ListEmptyComponent={()=>{
                        return <ActivityIndicator preset={ActivityIndicator.preset.h1} style={{ flex: 1 }}></ActivityIndicator>//<EmptyDetailView text={SGLocalize.translate('globalText.emptyList')} style={style.throwWHP}></EmptyDetailView>
                    }}
                    >
                    </FlatList>
                </View>
                
                
            </SGRootView>
        );
    }
}