import React from 'react';
import { SGBaseContainer } from '../../core/container/SGBaseContainer';
import { SGView as View, SGScrollView as ScrollView, SGText as Text, SGImage as Image, SGImageButton as ImageButton, SGTouchableOpacity as TouchableOpacity,SGDialogBox,SGButton as Button  } from '../../core/control';
import { StyleSheet, Platform } from 'react-native';
import { SGLocalize } from '../locales/SGLocalize';
import {AvailableMyParkingAndroidTV} from '../container_V2/AvailableMyParkingAndroidTV'
import { SGHelperGlobalVar, SGHelperNavigation,SGHelperType } from '../../core/helper';
import image from '../asset/image';
import { create } from 'react-test-renderer';

export class ParkingHeaderAndroidTV extends SGBaseContainer {
    createStyleSheet = (whp) => {
        var { w, h, p } = whp;
        return StyleSheet.create({
            mainContainer: { width: w-4*p,height:w*0.24, justifyContent: 'center', alignItems: 'center',borderColor:'rgb(228,228,228)'},
            // mainContainer: { width: w,height:w*0.5, justifyContent: 'flex-start', alignItems: 'flex-start',marginBottom:2*p},
            containerView1_1_1: {margin:0,flexDirection:'row', alignItems: 'center', justifyContent: 'space-around',paddingRight:11*p},
            parkingAreaSlider: { flexDirection: 'row', padding: p },
            parkingAreaName: { color: '#00C38C' },
            parkingAreaNameOnline: { color: '#808080' },
            parkingFloor: {  flexDirection: 'row', justifyContent: 'center', backgroundColor: '#FFFFFF', borderColor: '#00C38C', borderTopLeftRadius: p * 2, borderBottomLeftRadius: p * 2, borderWidth: 0.1 * p, padding: 0.5 * p },
            parkingFloorOnline: { marginRight: -1, flexDirection: 'row', justifyContent: 'center', backgroundColor: '#FFFFFF', borderColor: '#808080', borderTopLeftRadius: p * 2, borderBottomLeftRadius: p * 2, borderWidth: 0.1 * p, padding: 0.5 * p },
            parkingArea: { marginRight: 2 * p, flexDirection: 'row', justifyContent: 'center', backgroundColor: '#00C38C', borderTopRightRadius: p * 2, borderBottomRightRadius: p * 2, padding: 0.5 * p, width: (w - 2 * p) * 0.14 },
            parkingAreaOnline: { marginRight: 2 * p, flexDirection: 'row', justifyContent: 'center', backgroundColor: '#808080', borderTopRightRadius: p * 2, borderBottomRightRadius: p * 2, padding: 0.5 * p, width: (w - 2 * p) * 0.14 },
            // parkingFloor: {  flexDirection: 'row', justifyContent: 'center', backgroundColor: '#FFFFFF', borderColor: '#00C38C', borderTopLeftRadius: p * 2, borderBottomLeftRadius: p * 2, borderWidth: 0.1 * p, padding: 0.3* p },
            // parkingFloorOnline: { marginRight: -1, flexDirection: 'row', justifyContent: 'center', backgroundColor: '#FFFFFF', borderColor: '#808080', borderTopLeftRadius: p * 2, borderBottomLeftRadius: p * 2, borderWidth: 0.1 * p, padding: 0.3* p },
            // parkingArea: { marginRight: 0, flexDirection: 'row', justifyContent: 'center', backgroundColor: '#00C38C', borderTopRightRadius: p * 2, borderBottomRightRadius: p * 2, padding: 0.2*p, width: (w - 2 * p) * 0.1 },
            // parkingAreaOnline: { marginRight: 0, flexDirection: 'row', justifyContent: 'center', backgroundColor: '#808080', borderTopRightRadius: p * 2, borderBottomRightRadius: p * 2, padding: 0.2*p, width: (w - 2 * p) * 0.1 },
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
        this.scrollViewRef = React.createRef()
        this.svWidth = 0
        this.svHeight= 0
        this.moveTo ="right"
        this.position=0
        this.intervalMoving = 0
    }


    _checkOfflineIsExist(){
        var data =this.props.parkingData
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
        if(d.fActive==="Y" && d.fOnline==="Y") return d.fGreen
        if(d.fActive==="N") return SGLocalize.translate("MyParkingSpotWithLayoutScreen.Close")
    }
    componentDidMount(){
       this.interval= setInterval(() => {
             this._onMoveScrollView()
        }, 3000);
    }
    componentWillUnmount(){
        clearInterval(this.interval);
    }
    _onMoveScrollView(){
        if(this.svWidth!==0){
            if(this.moveTo==="right"){
                this.position = this.position+this.intervalMoving
                if(this.position>=this.svWidth){
                    this.position=this.svWidth
                    this.moveTo = "left"
                    // if(this.moveTo+this.intervalMoving>=)
                } 
            }else{
                this.position = this.position-this.intervalMoving
                if(this.position<=0){
                    this.position=0
                    this.moveTo = "right"
                } 
            }
            if(this.scrollViewRef){
                this.scrollViewRef.current.scrollTo({ x: this.position, y: 0, animated: true })
            }
            
        }
    }
    _initScrollViewDimension(w,h){
        this.svWidth=w *0.75
        this.svHeight=h
        this.intervalMoving = w*0.2
    }
    render() {
        this._checkOfflineIsExist()
        var { w, h, p } = this.whp;
        var style = this.style;
        var data = this.props.parkingData
        var tR = SGLocalize.translate
        return (
 
           
            <View accessible={true} accessibilityLabel={'ParkingHighlightRootView'} style={style.mainContainer}>
                <AvailableMyParkingAndroidTV  style={{width:w,height:h,padding:p}} lastUpdated={this.props.lastUpdated}></AvailableMyParkingAndroidTV>
                {
                    this.offline &&
                    <Text style={{paddingLeft:2*p,alignSelf:'flex-start'}} preset={Text.preset.heading9}>{tR("parkingHighlight.Offline")}</Text>
                }

                <ScrollView ref={this.scrollViewRef} showsHorizontalScrollIndicator={false} accessible={true} accessibilityLabel={'ParkingHighlightScrollHorizontalView'} horizontal contentContainerStyle={style.containerView1_1_1} style={{width:w,marginLeft:2*p,marginRight:2*p,padding:0}} onContentSizeChange={(width, height) => {this._initScrollViewDimension(width, height)}}>

                    {
                        data.map((d) => {
                            return ( 
                                <TouchableOpacity key={d.fID} hidden={d.fGreen===0?true:false}>
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
