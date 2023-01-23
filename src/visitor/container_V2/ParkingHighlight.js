import React from 'react';
import { SGBaseContainer } from '../../core/container/SGBaseContainer';
import { SGView as View, SGScrollView as ScrollView, SGText as Text, SGImage as Image, SGImageButton as ImageButton, SGTouchableOpacity as TouchableOpacity,SGDialogBox  } from '../../core/control';
import { StyleSheet, Platform } from 'react-native';
import { SGLocalize } from '../locales/SGLocalize';
import {AvailableParking} from '../container_V2/AvailableParking'
import { SGHelperGlobalVar, SGHelperNavigation,SGHelperType, SGHelperStyle } from '../../core/helper';
import image from '../asset/image';

export class ParkingHighlight extends SGBaseContainer {
    createStyleSheet = (whp) => {
        var { w, h, p } = whp;
        return StyleSheet.create({
            mainContainer: { width: w, justifyContent: 'flex-start', alignItems: 'flex-start', paddingTop: 2*p, marginBottom:0*p },
            header: { width: w, paddingLeft: p * 4, paddingRight: p * 4, flexDirection: 'row', justifyContent: 'space-between', backgroundColor: '#FFFFFF', paddingVertical: p },
            mainView1: { alignItems: 'flex-start', justifyContent: 'flex-start', width: w - 2 * p, paddingBottom: p, },
            containerView1_1: { alignItems: 'flex-start', justifyContent: 'flex-start', width: w - 2 * p, paddingVertical: 0, backgroundColor: '#FFFFFF' },
            containerView1_1_1: { flexWrap: 'wrap', flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-around', marginLeft: p * 3, marginBottom:0*p },
            containerView1_2: { flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'space-around', width: w, borderTopWidth: p * 0.6, borderBottomWidth: p * 0.6, paddingVertical: p * 3, paddingHorizontal: p * 4, borderColor: '#E5E5E5' },
            containerView1_2_1: { flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', width: (w - 2 * p) / 3, borderWidth: w * 0.0009, paddingVertical: p },
            parkingContainerView: { width: w - 2 * p, borderRadius: 1.5 * p, marginTop: 0, marginBottom: 2.5*p },
            textView1: { flexDirection: 'row', width: w - 2 * p, },
            textView1_1: { alignItems: 'flex-start', justifyContent: 'center', width: (w - 2 * p) / 2, height: (w - 2 * p) * 0.1, },
            textView1_2: { alignItems: 'flex-end', justifyContent: 'center', width: (w - 2 * p) / 2, height: (w - 2 * p) * 0.1, },
            parkingAreaSlider: { flexDirection: 'row', padding: p },
            parkingAreaName: { color: '#00C38C' },
            parkingAreaNameOnline: { color: '#808080' },
            textTitle: { maxWidth: w * 0.9, color: '#606060' },
            text2: { color: '#7a7a7a' },
            parkingFloor: {height:w*0.08, marginRight: -1, flexDirection: 'row', justifyContent: 'center', backgroundColor: '#FFFFFF', borderColor: '#00C38C', borderTopLeftRadius: p * 2, borderBottomLeftRadius: p * 2, borderWidth: 0.1 * p, padding: 0.5 * p },
            parkingFloorOnline: {height:w*0.08,marginRight: -1, flexDirection: 'row', justifyContent: 'center', backgroundColor: '#FFFFFF', borderColor: '#808080', borderTopLeftRadius: p * 2, borderBottomLeftRadius: p * 2, borderWidth: 0.1 * p, padding: 0.5 * p },
            parkingArea: {height:w*0.08,marginRight: 2 * p, flexDirection: 'row', justifyContent: 'center', backgroundColor: '#00C38C', borderTopRightRadius: p * 2, borderBottomRightRadius: p * 2, padding: 0.5 * p, width: (w - 2 * p) * 0.15,borderColor: '#00C38C',borderWidth: 0.1 * p  },
            parkingAreaOnline: {height:w*0.08,marginRight: 2 * p, flexDirection: 'row', justifyContent: 'center', backgroundColor: '#808080', borderTopRightRadius: p * 2, borderBottomRightRadius: p * 2, padding: 0.5 * p, width: (w - 2 * p) * 0.15,borderColor: '#808080',borderWidth: 0.1 * p },
            icon: { backgroundColor: 'white', height: (w - 2 * p) * 0.1, width: (w - 2 * p) * 0.1, borderRadius: 0.1 * w },
            availableNumber: { color: '#FFFFFF' },
            availableNumberOffline: { color: 'white' },
            button: { backgroundColor: 'white', height: w * 0.095, width: w * 0.27, overflow: 'hidden', borderWidth:1, borderColor:SGHelperStyle.color.SGText.TextLightGrey, borderRadius:2*p},
            buttonImage: { resizeMode: 'cover', height: w * 0.09, backgroundColor: 'white' },            
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
        console.log(data)
        if (data.fShowLayoutParkir === 'Y') {
            var circuitBreaker = SGHelperType.getCircuitBreakerStatus('CircuitBreakerHighLightMallParkir')
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
           
        }else{
            SGDialogBox.showWarning(null, SGLocalize.translate('globalText.FailText'), SGLocalize.translate('LockComment.ParkingLockComment'), SGLocalize.translate('globalText.ok'), () => { }, true)
        }
    }

  

    openGPS(lat, lng, label) {
        const scheme = Platform.select({ ios: 'maps:0,0?q=', android: 'geo:0,0?q=' });
        const latLng = `${lat},${lng}`;
        const url = Platform.select({
            ios: `${scheme}${label}@${latLng}`,
            android: `${scheme}${latLng}(${label})`
        });
        this.props.openExternalApp(url);

    }

    openGojek(lat, lng, label) {
        if(Platform.OS === 'ios'){
                
            var url = SGHelperType.getSystemParamsValue('LinkGojekAppStore')
        }else{
            var url = SGHelperType.getSystemParamsValue('LinkGojekPlayStore')
        }
        // const scheme = Platform.select({ ios: 'gojek:0,0?q=', android: 'gojek:0,0?q=' });
        // const latLng = `${lat},${lng}`;
        // const url = Platform.select({
        //     ios: `${scheme}${label}@${latLng}`,
        //     android: `${scheme}${latLng}(${label})`
        // });
        // console.log(url);
        this.props.openExternalApp(url);
    }

    openGrab(lat, lng, label) {
        if(Platform.OS === 'ios'){
                
            var url = SGHelperType.getSystemParamsValue('LinkGrabAppStore')
        }else{
            var url = SGHelperType.getSystemParamsValue('LinkGrabPlayStore')
        }
       
        // const scheme = Platform.select({ ios: 'grab:0,0?q=', android: 'grab:0,0?q=' });
        // const latLng = `${lat},${lng}`;
        // const url = Platform.select({
        //     ios: `${scheme}${label}@${latLng}`,
        //     android: `${scheme}${latLng}(${label})`
        // });
        this.props.openExternalApp(url);
    }

    _checkOfflineIsExist(){
        var data = this.props.parkingHighlightData.data
        this.offline=false
        for(var i=0;i<data.length;i++){
            if(data[i].fOnline==="N") {
                this.offline=true
                break;
            }
        }
        console.log(data)
        console.log(this.offline)
    }
    _constructText(d){
        if(d.fOnline==="N" && d.fActive==="Y") return SGLocalize.translate("MyParkingSpotWithLayoutScreen.Off")
        if(d.fActive==="Y" && d.fOnline==="Y") return d.fGreen
        if(d.fActive==="N") return SGLocalize.translate("MyParkingSpotWithLayoutScreen.Close")
    }
    render() {
        console.log('ParkingHighlight-render');
        this._checkOfflineIsExist()
        // console.log(this.props.lastUpdated);
        var { w, h, p } = this.whp;
        var style = this.style;
        var data = this.props.parkingHighlightData.data;
        var tR = SGLocalize.translate
        console.log(data);
        return (
            <View accessible={true} accessibilityLabel={'ParkingHighlightRootView'} style={style.mainContainer}>
                
                <AvailableParking hidden={data.length===0?true:false} style={{width:w,height:h,padding:p}} lastUpdated={this.props.lastUpdated.data}></AvailableParking>
                {
                    this.offline &&
                    <Text style={{paddingLeft:4*p}} preset={Text.preset.titleH4_5}>{tR("parkingHighlight.Offline")}</Text>
                }
                <View hidden={data.length===0?true:false} accessible={true} accessibilityLabel={'ParkingHighlightContainerView1'} style={style.parkingContainerView}>
                    <View accessible={true} accessibilityLabel={'ParkingHighlightContainerParkingView'} style={style.containerView1_1}>
                        <ScrollView accessible={true} accessibilityLabel={'ParkingHighlightScrollHorizontalView'} horizontal>
                            <View accessible={true} accessibilityLabel={'ParkingHighlightParkingView'} style={style.containerView1_1_1}>
                                {
                                    data.map((d) => {
                                        return ( 
                                            <TouchableOpacity key={d.fID} onPress={this.onPress.bind(this, d)} hidden={d.fGreen===0?true:false}>
                                                <View accessible={true} accessibilityLabel={'ParkingHighlightParkingAreaView'} style={style.parkingAreaSlider}>
                                                    <View accessible={true} accessibilityLabel={'ParkingHighlightParkingFloorView'} style={d.fActive==="Y"?style.parkingFloor:style.parkingFloorOnline}>
                                                        <Text accessible={true} accessibilityLabel={'ParkingHighlightParkingAreaNameText'} preset={Text.preset.titleH4B} style={d.fActive==="Y"?style.parkingAreaName:style.parkingAreaNameOnline}>{(d['fParkirName' + this.props.language.toUpperCase()]).toUpperCase()}</Text>
                                                    </View>
                                                    <View accessible={true} accessibilityLabel={'ParkingHighlightParkingArea'} style={d.fActive==="Y"?style.parkingArea:style.parkingAreaOnline}>
                                                        <Text accessible={true} accessibilityLabel={'ParkingHighlightAvailNumberText'} preset={Text.preset.titleH3B} style={style.availableNumber}>{this._constructText(d)}</Text>
                                                    </View>
                                                </View>
                                            </TouchableOpacity>
                                        )
                                    })
                                }
                            </View>
                        </ScrollView>
                    </View>
                </View>
              
                <View accessible={true} accessibilityLabel={'ParkingHighlightGoToPlaceView'} style={style.containerView1_2}>
                    <Text accessible={true} accessibilityLabel={'ParkingHighlightTitleText'} style={{ color: '#000000' }} preset={Text.preset.titleH2B}>{SGLocalize.translate("parkingHighlight.findLocation")}</Text>
                    <View style={{flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', width: w, marginBottom:0*p }}>
                        <ImageButton accessible={true} accessibilityLabel={'ParkingHighlightGoogleMapImageButton'} onPress={this.openGPS.bind(this, this.props.linkData.latitude, this.props.linkData.longitude, this.props.linkData['fBuildingName' + this.props.language.toUpperCase()])} shadow={false} shadowIntensity={0.7} style={style.button} source={{ uri: image.logoGoogleMaps[this.imageSetting].url }} imageStyle={style.buttonImage} />
                        {this.props.linkData.linkGojek !== 'N' &&
                        <ImageButton accessible={true} accessibilityLabel={'ParkingHighlightGojekImageButton'} onPress={this.openGojek.bind(this,this.props.linkData.latitude, this.props.linkData.longitude, this.props.linkData['fBuildingName' + this.props.language.toUpperCase()])} shadow={false} shadowIntensity={0.7} style={style.button} source={{ uri: image.logoGojek[this.imageSetting].url}} imageStyle={style.buttonImage} />
                        }
                        {this.props.linkData.linkGrab !== 'N' &&
                        <ImageButton accessible={true} accessibilityLabel={'ParkingHighlightGrabImageButton'} onPress={this.openGrab.bind(this,this.props.linkData.latitude, this.props.linkData.longitude, this.props.linkData['fBuildingName' + this.props.language.toUpperCase()])} shadow={false} shadowIntensity={0.7} style={style.button} source={{ uri:  image.logoGrab[this.imageSetting].url }} imageStyle={style.buttonImage} />
                        }
                    </View>
                </View>
            </View>
        );
    }
}
