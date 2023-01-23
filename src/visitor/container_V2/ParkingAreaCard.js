import React from 'react';
import { StyleSheet } from 'react-native';
import { SGBaseContainer } from '../../core/container/SGBaseContainer';
import { SGView as View, SGText as Text, SGTouchableOpacity as TouchableOpacity, SGImage as  Image,SGDialogBox } from '../../core/control';
import { SGLocalize } from '../locales/SGLocalize';
import { SGHelperGlobalVar, SGHelperNavigation ,SGHelperType} from '../../core/helper';
import { ScrollView } from 'react-native-gesture-handler';
import ImageAssets from '../asset/image'
export class ParkingAreaCard extends SGBaseContainer {
    createStyleSheet = (whp, status,ddsStatus) => {
        var { w, h, p } = whp;
        return StyleSheet.create({
            mainView1: {  marginTop: w * 0.025, flexDirection: 'row', width: w, alignItems: 'flex-start', justifyContent: 'flex-start', borderRadius:2*p,borderWidth:4,borderColor:'#eaeaea',backgroundColor:status ? '#017f40' : '#aaaaaa',borderBottomColor:'#eaeaea' },
            mainView2:{backgroundColor: status ? '#017f40' : '#aaaaaa',flexDirection:'row'},
            containerView2: { justifyContent: 'flex-start', alignItems: 'flex-start',marginTop:ddsStatus?0:3.5*p,backgroundColor: status ? '#017f40' : '#aaaaaa'},
            containerView2_1: { flexDirection:'row', justifyContent:'space-between',alignItems:'flex-start' ,width:w*0.65 },
            containerView2_3: { justifyContent: 'flex-start', width: (w - 2 * p) * 0.66,height:w*0.15, marginTop: 0,marginBottom:0,paddingVertical:0},
            containerView2_3_1_1: { justifyContent: 'flex-start', marginHorizontal: p },
            outerParkingBox: { marginHorizontal: 0, backgroundColor: status ? '#cccccc' : '#757575', paddingHorizontal: 1.75 * p, paddingVertical: 1.75 * p, borderRadius: 2 * p,marginHorizontal:3.5*p,marginVertical:3.5*p },
            parkingAreaLogo: { backgroundColor: status ? 'white' : '#9e9e9e', width: (w - 2 * p) * 0.22, height: (w - 2 * p) * 0.22, borderRadius: 1 * p },
            textLogo: { color: status ? '#007a45' : '#bfbfbf' },
            viewLogo: { backgroundColor: status ? '#007a45' : '#bfbfbf' ,width:w*0.16,height:0.75*p},
            textTitle: { color: status ? ('white') : ('#7b7b7b') },
            text2: { color: status ? 'white': '#7b7b7b',alignSelf:'flex-start' },
            text3: { color: status ? ('white') : ('#7b7b7b'),marginVertical:0.25*p },
          
            textNumber: { color: '#016742' },
            textFull: { color: '#fb2a01' },
            numberView: { marginBottom: 2 * p, backgroundColor: status ? 'white' : '#7f7f7f', width: (w - 2 * p) * 2 / 3 * 0.7 / 4, height: w * 0.05, borderRadius: 0.5 * p },
            icon1: { fontSize: w * 0.04, color: status ? ('white') : ('#7b7b7b') },
            icon2: { fontSize: w * 0.04, color: status ? ('white') : ('#7b7b7b') },
        });
    }

    onPress(data) {
        if (data.fShowLayoutParkir === 'Y' && data.fActive==="Y") {
            var circuitBreaker = SGHelperType.getCircuitBreakerStatus('CircuitBreakerFacilityMallParkir')
            var language=SGHelperGlobalVar.getVar('GlobalLanguage').toUpperCase()
            if(circuitBreaker.fActive==="Y"){
                if (this.anonymousMode) {
                    SGDialogBox.showAction(null, SGLocalize.translate("AnonymousAlert.title"), SGLocalize.translate("AnonymousAlert.message"), SGLocalize.translate("AnonymousAlert.signUpButton"), () => { SGHelperNavigation.navigatePush(this.props.navigator, 'SignUp') }, SGLocalize.translate("AnonymousAlert.signInButton"), () => { SGHelperNavigation.navigatePush(this.props.navigator, 'SignIn') }, true)
                }else{
                    SGHelperNavigation.navigatePush(this.props.navigator, 'ParkingLayoutFullScreen', { fID: data.fID, contentKey: this.props.contentKey });
                }
            }else{
                SGDialogBox.showWarning(null,circuitBreaker["Title"+language],circuitBreaker[language],circuitBreaker["Button"+language],()=>{},true)
            }
            
        }else if (data.fShowLayoutParkir==="N"){
            SGDialogBox.showWarning(null, SGLocalize.translate('globalText.FailText'), SGLocalize.translate('LockComment.ParkingLockComment'), SGLocalize.translate('globalText.ok'), () => { }, true)
        }
    }

    constructor(props, context, ...args) {
        super(props, context, ...args);
        this.status = this.props.data.fActive==="Y"?  true : false
        this.ddsActive = this.props.data.fDDSActive==="Y" ? true:false
        this.whp = { w: props.acceptStyle.width, h: props.acceptStyle.height, p: props.acceptStyle.padding }
        this.style = this.createStyleSheet(this.whp, this.status,this.ddsActive);
        this.anonymousMode = SGHelperGlobalVar.getVar('GlobalAnonymous');
    }

    render() {
        this.whp = { w: this.props.acceptStyle.width, h: this.props.acceptStyle.height, p: this.props.acceptStyle.padding }
        this.status = this.props.data.fActive==="Y"?  true : false
        this.ddsActive = this.props.data.fDDSActive==="Y" ? true:false
        this.style = this.createStyleSheet(this.whp,this.status,this.ddsActive);
        var style = this.style;
        var data = this.props.data;
        var imageSetting = SGHelperGlobalVar.getVar('GlobalImageSetting')
        var {w,h,p} = this.whp
        console.log(data)
        return (
            // <View>
                <View accessible={true} accessibilityLabel={'ParkingAreaCardRootView'} style={style.mainView1}>
                    <View style={style.mainView2}>
                        <TouchableOpacity accessible={true} accessibilityLabel={'ParkingAreaCardBoxView'} style={style.outerParkingBox} onPress={this.onPress.bind(this, data)}>
                            <View accessible={true} accessibilityLabel={'ParkingAreaCardAreaLogoView'} style={style.parkingAreaLogo}>
                                <Text accessible={true} accessibilityLabel={'ParkingAreaCardAreaLogoText'} preset={Text.preset.titleH2B} style={style.textLogo}>{data['fParkirName' + this.props.language.toUpperCase()]}</Text>
                                <View accessible={true} accessibilityLabel={'ParkingAreaCardAreaLogoText'} style={style.viewLogo}></View>
                            </View>
                        </TouchableOpacity>

                        <View accessible={true} accessibilityLabel={'ParkingAreaCardAreaStatusView'} style={style.containerView2}>
                            <TouchableOpacity onPress={this.onPress.bind(this, data)}>
                                <View accessible={true} accessibilityLabel={'ParkingAreaCardAreaStatusTextView'} style={style.containerView2_1}>
                                    <Text accessible={true} accessibilityLabel={'ParkingAreaCardAreaText'} preset={Text.preset.titleH2B} style={style.textTitle}>{data['fParkirName' + this.props.language.toUpperCase()]}</Text>
                                    <Text accessible={true} accessibilityLabel={'ParkingAreaCardStatusText'} preset={Text.preset.titleH3B} style={style.text2}>{SGLocalize.translate('ParkingAreaCard.'+ data.fActive) }</Text>
                                    
                                </View>
                                <Text accessible={true} accessibilityLabel={'ParkingAreaCardTextBottomStatus'} preset={Text.preset.titleH3} style={style.text3}>{this.props.text1}</Text>
                            </TouchableOpacity>
                            {
                                (data.fDDSActive==="N" && data.fOnline==="Y") && 
                                <ScrollView accessible={true} accessibilityLabel={'ParkingAreaCardContentView'} contentContainerStyle={style.containerView2_3}  horizontal showsHorizontalScrollIndicator={false}>
                                    <TouchableOpacity style={{flexDirection:'row',flex:1}} onPress={this.onPress.bind(this, data)}>
                                    {
                                        data.fPublic!==0 &&
                                        <View accessible={true} accessibilityLabel={'ParkingAreaCardPublicContainerView'} style={style.containerView2_3_1_1}>
                                            <Image  style={{width:w*0.06,height:w*0.045,backgroundColor:'transparent'}} source={{ uri: ImageAssets.PublicParking[imageSetting].url }}></Image>
                                            <View hidden={data.fActive==="Y"?false:true} accessible={true} accessibilityLabel={'ParkingAreaCardPublicNumbView'} style={style.numberView}>
                                                <Text accessible={true} accessibilityLabel={'ParkingAreaCardPublicNumbText'} preset={Text.preset.h9B} style={data.fPublic === 0 ? style.textFull : style.textNumber}>{this.status ? data.fPublic : ''}</Text>
                                            </View>
                                        </View>

                                    }
                                    {
                                        data.fLadies!==0 &&
                                        <View accessible={true} accessibilityLabel={'ParkingAreaCardPublicContainerView'} style={style.containerView2_3_1_1}>
                                            <Image  style={{width:w*0.06,height:w*0.045,backgroundColor:'transparant'}} source={{ uri: ImageAssets.LadiesParking[imageSetting].url }}></Image>
                                            <View hidden={data.fActive==="Y"?false:true} accessible={true} accessibilityLabel={'ParkingAreaCardPublicNumbView'} style={style.numberView}>
                                                <Text accessible={true} accessibilityLabel={'ParkingAreaCardPublicNumbText'} preset={Text.preset.h9B} style={data.fLadies === 0 ? style.textFull : style.textNumber}>{this.status ? data.fLadies : ''}</Text>
                                            </View>  
                                        </View>
                                    }
                                    {
                                        data.fDisabled!==0 &&
                                        <View accessible={true} accessibilityLabel={'ParkingAreaCardPublicContainerView'} style={style.containerView2_3_1_1}>
                                            <Image  style={{width:w*0.06,height:w*0.045,backgroundColor:'transparant'}} source={{ uri: ImageAssets.DisabledParking[imageSetting].url }}></Image>
                                            <View hidden={data.fActive==="Y"?false:true} accessible={true} accessibilityLabel={'ParkingAreaCardPublicNumbView'} style={style.numberView}>
                                                <Text accessible={true} accessibilityLabel={'ParkingAreaCardPublicNumbText'} preset={Text.preset.h9B} style={data.fDisabled === 0 ? style.textFull : style.textNumber}>{this.status ? data.fDisabled : ''}</Text>
                                            </View>
                                        </View>
                                    }
                                    {
                                        data.fValet!==0 &&
                                        <View accessible={true} accessibilityLabel={'ParkingAreaCardPublicContainerView'} style={style.containerView2_3_1_1}>
                                            <Image  style={{width:w*0.06,height:w*0.045,backgroundColor:'transparant'}} source={{ uri: ImageAssets.ValetParking[imageSetting].url }}></Image>
                                            <View hidden={data.fActive==="Y"?false:true} accessible={true} accessibilityLabel={'ParkingAreaCardPublicNumbView'} style={style.numberView}>
                                                <Text accessible={true} accessibilityLabel={'ParkingAreaCardPublicNumbText'} preset={Text.preset.h9B} style={data.fValet === 0 ? style.textFull : style.textNumber}>{this.status ? data.fValet : ''}</Text>
                                            </View>
                                        </View>
                                    }
                                    {
                                        data.fGold!==0 &&
                                        <View accessible={true} accessibilityLabel={'ParkingAreaCardPublicContainerView'} style={style.containerView2_3_1_1}>
                                            <Image  style={{width:w*0.06,height:w*0.045,backgroundColor:'transparant'}} source={{ uri: ImageAssets.GoldParking[imageSetting].url }}></Image>
                                            <View hidden={data.fActive==="Y"?false:true} accessible={true} accessibilityLabel={'ParkingAreaCardPublicNumbView'} style={style.numberView}>
                                                <Text accessible={true} accessibilityLabel={'ParkingAreaCardPublicNumbText'} preset={Text.preset.h9B} style={data.fGold === 0 ? style.textFull : style.textNumber}>{this.status ? data.fGold : ''}</Text>
                                            </View>
                                        </View>
                                    }
                                    {
                                        data.fVIP!==0 &&
                                        <View accessible={true} accessibilityLabel={'ParkingAreaCardPublicContainerView'} style={style.containerView2_3_1_1}>
                                            <Image  style={{width:w*0.06,height:w*0.045,backgroundColor:'transparant'}} source={{ uri: ImageAssets.VIPParking[imageSetting].url }}></Image>
                                            <View  hidden={data.fActive==="Y"?false:true} accessible={true} accessibilityLabel={'ParkingAreaCardPublicNumbView'} style={style.numberView}>
                                                <Text accessible={true} accessibilityLabel={'ParkingAreaCardPublicNumbText'} preset={Text.preset.h9B} style={data.fVIP === 0 ? style.textFull : style.textNumber}>{this.status ? data.fVIP : ''}</Text>
                                            </View>
                                        </View>
                                    }
                                    {
                                        data.fChargingStation!==0 &&
                                        <View accessible={true} accessibilityLabel={'ParkingAreaCardPublicContainerView'} style={style.containerView2_3_1_1}>
                                            <Image  style={{width:w*0.06,height:w*0.045,backgroundColor:'transparant'}} source={{ uri: ImageAssets.ChargingParking[imageSetting].url }}></Image>
                                            <View hidden={data.fActive==="Y"?false:true} accessible={true} accessibilityLabel={'ParkingAreaCardPublicNumbView'} style={style.numberView}>
                                                <Text accessible={true} accessibilityLabel={'ParkingAreaCardPublicNumbText'} preset={Text.preset.h9B} style={data.fChargingStation === 0 ? style.textFull : style.textNumber}>{this.status ? data.fChargingStation : ''}</Text>
                                            </View>
                                        </View>
                                    }
                                    </TouchableOpacity>
                                </ScrollView>
                            }
                            {
                                data.fDDSActive==="Y" && data.fOnline==="Y"  &&
                                <TouchableOpacity   onPress={this.onPress.bind(this, data)} style={{width:w*0.47 ,height:w*0.15}}>
                                    
                                    <Text preset={Text.preset.h6B} style={style.text3}>{SGLocalize.translate('ParkingAreaCard.Offline')}</Text>
                                    <Text preset={Text.preset.h6B} style={style.text3}>{SGLocalize.translate('ParkingAreaCard.Availability')+ " "+(data.fDDSCount>999?"999+" : data.fDDSCount)}</Text>
                                </TouchableOpacity>
                            }
                            {
                                data.fOnline==="N" &&
                                <TouchableOpacity   onPress={this.onPress.bind(this, data)} style={{width:w*0.47 ,height:w*0.15}}>
                                   
                                    <Text preset={Text.preset.titleH3B} style={style.text3}>{SGLocalize.translate('ParkingAreaCard.Offline')}</Text>
                                   
                                </TouchableOpacity>
                            }
                            
                        </View>
                    </View>
                 
                   
                
                    
                </View>
            // </View>
        );
    }
}
