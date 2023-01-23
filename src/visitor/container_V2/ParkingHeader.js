import React from 'react';
import { SGBaseContainer } from '../../core/container/SGBaseContainer';
import { SGView as View, SGScrollView as ScrollView, SGText as Text, SGImage as Image, SGImageButton as ImageButton, SGTouchableOpacity as TouchableOpacity,SGDialogBox  } from '../../core/control';
import { StyleSheet, Platform } from 'react-native';
import { SGLocalize } from '../locales/SGLocalize';
import {AvailableMyParking} from '../container_V2/AvailableMyParking'
import { SGHelperGlobalVar, SGHelperNavigation,SGHelperType } from '../../core/helper';
import image from '../asset/image';

export class ParkingHeader extends SGBaseContainer {
    createStyleSheet = (whp) => {
        var { w, h, p } = whp;
        return StyleSheet.create({
            mainContainer: { width: w, justifyContent: 'flex-start', alignItems: 'flex-start',marginBottom:2*p,marginLeft:11*p},
            containerView1_1_1: {marginLeft:3*p,flexDirection:'row', alignItems: 'flex-start', justifyContent: 'space-around',paddingRight:11*p},
            parkingAreaSlider: { flexDirection: 'row', padding: p },
            parkingAreaName: { color: '#00C38C' },
            parkingAreaNameOnline: { color: '#808080' },
            parkingFloor: {  flexDirection: 'row', justifyContent: 'center', backgroundColor: '#FFFFFF', borderColor: '#00C38C', borderTopLeftRadius: p * 2, borderBottomLeftRadius: p * 2, borderWidth: 0.1 * p, padding: 0.5 * p },
            parkingFloorOnline: { marginRight: -1, flexDirection: 'row', justifyContent: 'center', backgroundColor: '#FFFFFF', borderColor: '#808080', borderTopLeftRadius: p * 2, borderBottomLeftRadius: p * 2, borderWidth: 0.1 * p, padding: 0.5 * p },
            parkingArea: { marginRight: 2 * p, flexDirection: 'row', justifyContent: 'center', backgroundColor: '#00C38C', borderTopRightRadius: p * 2, borderBottomRightRadius: p * 2, padding: 0.5 * p, width: (w - 2 * p) * 0.15 },
            parkingAreaOnline: { marginRight: 2 * p, flexDirection: 'row', justifyContent: 'center', backgroundColor: '#808080', borderTopRightRadius: p * 2, borderBottomRightRadius: p * 2, padding: 0.5 * p, width: (w - 2 * p) * 0.15 },
            availableNumber: { color: '#FFFFFF' },
             
        });
    }

    constructor(props, context, ...args) {
        super(props, context, ...args);
        this.whp = { w: props.style.width, h: props.style.height, p: props.style.padding }
        this.style = this.createStyleSheet(this.whp);
        this.imageSetting = SGHelperGlobalVar.getVar('GlobalImageSetting');
        this.anonymousMode = SGHelperGlobalVar.getVar('GlobalAnonymous');
        this.offline=false;
    }

    onPress(data) {
        if (data.fShowLayoutParkir === 'Y') {
            var circuitBreaker = SGHelperType.getCircuitBreakerStatus('CircuitBreakerHighLightMallParkir')
            var language=SGHelperGlobalVar.getVar('GlobalLanguage').toUpperCase()
            if(circuitBreaker.fActive==="Y"){
                if (this.anonymousMode) {
                    SGDialogBox.showAction(null, SGLocalize.translate("AnonymousAlert.title"), SGLocalize.translate("AnonymousAlert.message"), SGLocalize.translate("AnonymousAlert.signUpButton"), () => { SGHelperNavigation.navigatePush(this.props.navigator, 'SignUp') }, SGLocalize.translate("AnonymousAlert.signInButton"), () => { SGHelperNavigation.navigatePush(this.props.navigator, 'SignIn') }, true)
                }else{
                    console.log(data)
                    if(data.fActive==="Y"){
                        if(this.props.onHideParkingPopView)this.props.onHideParkingPopView()
                        setTimeout(()=>{
                            SGHelperNavigation.navigatePush(this.props.navigator, 'ParkingLayoutFullScreen', { fID: data.parkingLayoutKey, contentKey: this.props.buildingKey });
                        },250)
                    }else{
                        console.log("cannot navigate")
                    }
                  
                }
            }else{
                SGDialogBox.showWarning(null,circuitBreaker["Title"+language],circuitBreaker[language],circuitBreaker["Button"+language],()=>{},true)
            }
           
        }else{
            SGDialogBox.showWarning(null, SGLocalize.translate('globalText.FailText'), SGLocalize.translate('LockComment.ParkingLockComment'), SGLocalize.translate('globalText.ok'), () => { }, true)
        }
    }

    _checkOfflineIsExist(){
        var data =this.props.parkingData
        console.log(data)
        this.offline=false
        for(var i=0;i<data.length;i++){
            if(data[i].fOnline==="N") {
                this.offline=true
                break;
            }
        }
    }
    _constructText(d){
        if(d.fOnline==="N" && d.fActive==="Y") return SGLocalize.translate("MyParkingSpotWithLayoutScreen.Off")
        if(d.fActive==="Y" && d.fOnline==="Y") return d.totalAvailable
        if(d.fActive==="N") return SGLocalize.translate("MyParkingSpotWithLayoutScreen.Close")
    }
    render() {
        this._checkOfflineIsExist()
        var { w, h, p } = this.whp;
        var style = this.style;
        // var data = this.props.parkingHighlightData.data;
        var data = this.props.parkingData
        // console.log(this.props.parkingData)
        var tR = SGLocalize.translate
        var language= this.props.language
        // console.log(this.props.linkData);
        return (
 
           
            <View accessible={true} accessibilityLabel={'ParkingHighlightRootView'} style={style.mainContainer}>
                
                <AvailableMyParking  style={{width:w,height:h,padding:p}} lastUpdated={this.props.lastUpdated}></AvailableMyParking>
                {
                    this.offline &&
                    <Text style={{paddingLeft:4*p}} preset={Text.preset.h7}>{tR("parkingHighlight.Offline")}</Text>
                }

                <ScrollView accessible={true} accessibilityLabel={'ParkingHighlightScrollHorizontalView'} horizontal contentContainerStyle={style.containerView1_1_1}>

                    {
                        data.map((d) => {
                            return ( 
                                <TouchableOpacity key={d.fID} onPress={this.onPress.bind(this, d)} hidden={d.totalAvailable===0?true:false}>
                                    <View accessible={true} accessibilityLabel={'ParkingHighlightParkingAreaView'} style={style.parkingAreaSlider}>
                                        <View accessible={true} accessibilityLabel={'ParkingHighlightParkingFloorView'} style={d.fActive==="Y"?style.parkingFloor:style.parkingFloorOnline}>
                                            <Text accessible={true} accessibilityLabel={'ParkingHighlightParkingAreaNameText'} preset={Text.preset.h6_5B} style={d.fActive==="Y"?style.parkingAreaName:style.parkingAreaNameOnline}>{(d['fParkirName' + this.props.language.toUpperCase()]).toUpperCase()}</Text>
                                        </View>
                                        <View accessible={true} accessibilityLabel={'ParkingHighlightParkingArea'} style={d.fActive==="Y"?style.parkingArea:style.parkingAreaOnline}>
                                            <Text accessible={true} accessibilityLabel={'ParkingHighlightAvailNumberText'} preset={Text.preset.h6_5B} style={style.availableNumber}>{this._constructText(d)}</Text>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            )
                        })
                    }

                </ScrollView>

            </View>

        );
    }
}
