/**
 * Version1.4.4
 * 1.Yohanes 13 Agustus 2021
 * - add new Component
 */
import React from 'react';
import { SGBaseContainer } from '../../core/container/SGBaseContainer';
import { SGView as View,SGText as Text, SGImage as Image, SGIcon as Icon } from '../../core/control';
import { StyleSheet } from 'react-native';
import { SGHelperGlobalVar, SGHelperNavigation,SGHelperType } from '../../core/helper';
import ImageAssets from '../asset/image';
import { SGLocalize } from '../locales/SGLocalize';

import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
export class ParkingIconDescription extends SGBaseContainer {
    createStyleSheet = (whp) => {
        var { w, h, p } = whp;
        return StyleSheet.create({
            iconView:{width:w, borderColor: '#E6E6E6', borderTopWidth: 0.005 * w},
            iconInfoContianer: {  flexDirection: 'row',marginVertical:2*p,flexGrow:1,marginHorizontal:2*p},
            iconDetail: { flexDirection: 'row',borderBottomWidth:0.5*p,borderColor: '#E6E6E6' },
            viewIconDetail2:{ borderColor: '#E6E6E6', borderWidth: p/2,marginHorizontal:2*p,borderRadius:2*p,justifyContent:'center',alignItems:'center'},
            viewIconDetail:{ borderColor: '#59B990', borderWidth: p/2,marginHorizontal:2*p,borderRadius:2*p,justifyContent:'center',alignItems:'center'},
            iconImage: { color: '#737373' },
            iconText: { color: '#737373' },
        });
    }
    shouldComponentUpdate(){
        this.imageSetting = SGHelperGlobalVar.getVar('GlobalImageSetting');
        return true
    }
    constructor(props, context, ...args) {
        super(props, context, ...args);
        this.whp = { w: props.style.width, h: props.style.height, p: props.style.padding }
        this.style = this.createStyleSheet(this.whp);
        this.imageSetting = SGHelperGlobalVar.getVar('GlobalImageSetting');
        this.state={public:false,ladies:false,disabled:false,valet:false,gold:false,vip:false,chargingStation:false}
    }
    _resetState(mode,forceUpdate){
        if(mode!=="Public")this.state.public=false
        if(mode!=="Ladies")this.state.ladies=false
        if(mode!=="Disabled")this.state.disabled=false
        if(mode!=="Valet")this.state.valet=false
        if(mode!=="Gold")this.state.gold=false
        if(mode!=="VIP")this.state.vip=false
        if(mode!=="ChargingStation")this.state.chargingStation=false
        if(forceUpdate){
            this.setState({public:false,ladies:false,disabled:false,valet:false,gold:false,vip:false,chargingStation:false})
        }

    }
    componentDidUpdate(prevProps){
        if(this.props.mode==="SearchPillar" && prevProps.mode!==this.props.mode) this._resetState("",true)
    }
    _onPressIconDescription(mode){
        if(this.props.onPressIconDescription){
            this._resetState(mode,false)
            if(mode==="Public"){
                this.setState({public:!this.state.public})
                this.props.onPressIconDescription(mode,this.state.public)
            }
            else if(mode==="Ladies"){
                this.setState({ladies:!this.state.ladies})
                this.props.onPressIconDescription(mode,this.state.ladies)
            }
            else if(mode==="Disabled"){
                this.setState({disabled:!this.state.disabled})
                this.props.onPressIconDescription(mode,this.state.disabled)
            }
            else if(mode==="Valet"){
                this.setState({valet:!this.state.valet})
                this.props.onPressIconDescription(mode,this.state.valet)
            }
            else if(mode==="Gold"){
                this.setState({gold:!this.state.gold})
                this.props.onPressIconDescription(mode,this.state.gold)
            }
            else if(mode==="VIP"){
                this.setState({vip:!this.state.vip})
                this.props.onPressIconDescription(mode,this.state.vip)
            }
            else if(mode==="ChargingStation"){
                this.setState({chargingStation:!this.state.chargingStation})
                this.props.onPressIconDescription(mode,this.state.chargingStation)
            }
            
        }
    }

    render() {

        var { w, h, p } = this.whp;
        var imageSetting= this.imageSetting
        var style = this.style;
        var tR=SGLocalize.translate
        var data = this.props.data
        if(data.fID==="5dee8258-758e-6fed-0ca5-651ae5a4018f")console.log(data)
        return (
            <View style={style.iconView} hidden={this.props.hidden}>
                <ScrollView accessible={true} accessibilityLabel={'ParkingLayoutFullScreenContainerView'} contentContainerStyle={style.iconInfoContianer} horizontal showsHorizontalScrollIndicator={false}>
                    {
                        data.fPublic>0 &&
                        <TouchableOpacity style={this.state.public?style.viewIconDetail:style.viewIconDetail2} onPress={()=>{this._onPressIconDescription("Public")}}>
                            <View accessible={true} accessibilityLabel={'ParkingLayoutFullScreenPublicView'} style={style.iconDetail}>
                                <Image accessible={true} accessibilityLabel={'CarBoxCardImage'} style={{width:w*0.08,height:w*0.065,backgroundColor:'black',borderRadius:p}} source={{ uri: ImageAssets.PublicParking[imageSetting].url }}></Image>
                                <Text accessible={true} accessibilityLabel={'ParkingLayoutFullScreenPublicT'} preset={Text.preset.h9B} style={style.iconText}>{tR('ParkingLayoutFullScreen.Public')}</Text>
                            </View>
                            <Text preset={Text.preset.h7_5B} style={style.iconText}>{data.fPublic}</Text>
                        </TouchableOpacity>
                    }
                    {
                        data.fLadies>0 &&
                        <TouchableOpacity style={this.state.ladies?style.viewIconDetail:style.viewIconDetail2} onPress={()=>{this._onPressIconDescription("Ladies")}}>
                            <View accessible={true} accessibilityLabel={'ParkingLayoutFullScreenPublicView'} style={style.iconDetail}>
                                <Image accessible={true} accessibilityLabel={'CarBoxCardImage'} style={{width:w*0.08,height:w*0.065,backgroundColor:'black',borderRadius:p}} source={{ uri: ImageAssets.LadiesParking[imageSetting].url }}></Image>
                                <Text accessible={true} accessibilityLabel={'ParkingLayoutFullScreenPublicT'} preset={Text.preset.h9B} style={style.iconText}>{tR('ParkingLayoutFullScreen.Ladies')}</Text>
                            </View>
                            <Text preset={Text.preset.h7_5B} style={style.iconText}>{data.fLadies}</Text>
                        </TouchableOpacity>
                    }
                    {
                        data.fDisabled>0 &&
                        <TouchableOpacity style={this.state.disabled?style.viewIconDetail:style.viewIconDetail2} onPress={()=>{this._onPressIconDescription("Disabled")}}>
                            <View accessible={true} accessibilityLabel={'ParkingLayoutFullScreenPublicView'} style={style.iconDetail}>
                                <Image accessible={true} accessibilityLabel={'CarBoxCardImage'} style={{width:w*0.08,height:w*0.065,backgroundColor:'black',borderRadius:p}} source={{ uri: ImageAssets.DisabledParking[imageSetting].url }}></Image>
                                <Text accessible={true} accessibilityLabel={'ParkingLayoutFullScreenPublicT'} preset={Text.preset.h9B} style={style.iconText}>{tR('ParkingLayoutFullScreen.Disabled')}</Text>
                            </View>
                            <Text preset={Text.preset.h7_5B} style={style.iconText}>{data.fDisabled}</Text>
                        </TouchableOpacity>
                    }
                    {
                        data.fValet>0 &&
                        <TouchableOpacity style={this.state.valet?style.viewIconDetail:style.viewIconDetail2} onPress={()=>{this._onPressIconDescription("Valet")}}>
                            <View accessible={true} accessibilityLabel={'ParkingLayoutFullScreenPublicView'} style={style.iconDetail}>
                                <Image accessible={true} accessibilityLabel={'CarBoxCardImage'} style={{width:w*0.08,height:w*0.065,backgroundColor:'black',borderRadius:p}} source={{ uri: ImageAssets.ValetParking[imageSetting].url }}></Image>
                                <Text accessible={true} accessibilityLabel={'ParkingLayoutFullScreenPublicT'} preset={Text.preset.h9B} style={style.iconText}>{tR('ParkingLayoutFullScreen.Valet')}</Text>
                            </View>
                            <Text preset={Text.preset.h7_5B} style={style.iconText}>{data.fValet}</Text>
                        </TouchableOpacity>
                    }
                    {
                        data.fGold>0 &&
                        <TouchableOpacity style={this.state.gold?style.viewIconDetail:style.viewIconDetail2} onPress={()=>{this._onPressIconDescription("Gold")}}>
                            <View accessible={true} accessibilityLabel={'ParkingLayoutFullScreenPublicView'} style={style.iconDetail}>
                                <Image accessible={true} accessibilityLabel={'CarBoxCardImage'} style={{width:w*0.08,height:w*0.065,backgroundColor:'black',borderRadius:p}} source={{ uri: ImageAssets.GoldParking[imageSetting].url }}></Image>
                                <Text accessible={true} accessibilityLabel={'ParkingLayoutFullScreenPublicT'} preset={Text.preset.h9B} style={style.iconText}>{tR('ParkingLayoutFullScreen.Gold')}</Text>
                            </View>
                            <Text preset={Text.preset.h7_5B} style={style.iconText}>{data.fGold}</Text>
                        </TouchableOpacity>
                    }
                    {
                        data.fVIP>0 &&
                        <TouchableOpacity style={this.state.vip?style.viewIconDetail:style.viewIconDetail2} onPress={()=>{this._onPressIconDescription("VIP")}}>
                            <View accessible={true} accessibilityLabel={'ParkingLayoutFullScreenPublicView'} style={style.iconDetail}>
                                <Image accessible={true} accessibilityLabel={'CarBoxCardImage'} style={{width:w*0.08,height:w*0.065,backgroundColor:'black',borderRadius:p}} source={{ uri: ImageAssets.VIPParking[imageSetting].url }}></Image>
                                <Text accessible={true} accessibilityLabel={'ParkingLayoutFullScreenPublicT'} preset={Text.preset.h9B} style={style.iconText}>{tR('ParkingLayoutFullScreen.VIP')}</Text>
                            </View>
                            <Text preset={Text.preset.h7_5B} style={style.iconText}>{data.fVIP}</Text>
                        </TouchableOpacity>
                    }
                    {
                        data.fChargingStation>0 &&
                        <TouchableOpacity style={this.state.chargingStation?style.viewIconDetail:style.viewIconDetail2} onPress={()=>{this._onPressIconDescription("ChargingStation")}}>
                            <View accessible={true} accessibilityLabel={'ParkingLayoutFullScreenPublicView'} style={style.iconDetail}>
                                <Image accessible={true} accessibilityLabel={'CarBoxCardImage'} style={{width:w*0.08,height:w*0.065,backgroundColor:'black',borderRadius:p}} source={{ uri: ImageAssets.ChargingParking[imageSetting].url }}></Image>
                                <Text accessible={true} accessibilityLabel={'ParkingLayoutFullScreenPublicT'} preset={Text.preset.h9B} style={style.iconText}>{tR('ParkingLayoutFullScreen.ChargingStation')}</Text>
                            </View>
                            <Text preset={Text.preset.h7_5B} style={style.iconText}>{data.fChargingStation}</Text>
                        </TouchableOpacity>
                    }
                </ScrollView>
            </View>
        );
    }
}
