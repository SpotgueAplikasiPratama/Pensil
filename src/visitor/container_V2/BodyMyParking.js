import React from 'react';
import { Dimensions } from 'react-native';
import { SGBaseContainer } from '../../core/container/SGBaseContainer';
import { SGView as View, SGText as Text, SGImage as Image,SGIcon as Icon ,SGTouchableOpacity as TouchableOpacity} from '../../core/control';
import { StyleSheet } from 'react-native';
import { SGLocalize } from '../locales/SGLocalize';
import {ParkingHeader} from'../container_V2/ParkingHeader'
import {VisitorHelper} from '../helper/VisitorHelper';
import { SGHelperNavigation } from '../../core/helper';
export class BodyMyParking extends SGBaseContainer {
    createStyleSheet = (whp) => {
        var { w, h, p } = whp;
        return StyleSheet.create({
            typeAndLocationText: { color: '#626262',marginHorizontal:0,marginBottom:2*p },
            placeNameText: { color: '#000000',marginHorizontal:0 },
            lastVisitText: {width:w*0.575, color: '#A2A2A2',marginHorizontal:0,paddingRight:3*p },
            to:{flexDirection:'row',justifyContent:'center',alignItems:'flex-start'},
            v2:{padding:3*p},
            v3:{alignItems:'flex-start',marginTop:5*p},
            img:{width:w*0.22,height:w*0.22},
            throwWHP:{width:w,height:h,padding:p}
        });
    }

    constructor(props, context, ...args) {
        super(props, context, ...args);
        this.whp = this.screenWHPNoHeader
        this.style = this.createStyleSheet(this.whp);
        
    }
    
    _onPressMall(){
        console.log('AW')
        this.props.onHideParkingPopView()
        setTimeout(()=>{
            SGHelperNavigation.navigatePush(this.props.navigator, 'MallHome', { contentKey: this.props.mallList.buildingKey });
        },250)
    }
    render() {
        var { w, h, p } = this.whp;
        var style = this.style;
        // var data = this.props.data
        var language=this.props.language
        var imageSetting=this.props.imageSetting
        var data=this.props.mallList
        // console.log(this.mallL)
        return (
            
               <View accessible={true} accessibilityLabel={'ParkingHighlightTopTextView'} style={{borderTopWidth:this.props.index===0?3*p: 1.5*p,borderBottomWidth:1.5*p,borderColor:'rgb(228,228,228)'}}>

                    <TouchableOpacity style={style.to} onPress={()=>{this._onPressMall()}}>
                        <View shadow style={style.v2}>
                            <Image  source={{ uri: data['fContent' + language].fImageJSON[0]['thumbnail' + imageSetting.charAt(0).toUpperCase() + imageSetting.slice(1)].uri }} style={style.img}></Image>
                        </View>
                        <View style={style.v3}>
                            <Text accessible={true} accessibilityLabel={'AskAliceAddLocationPlaceLocationType'} preset={Text.preset.h5B} numberOfLines={1} style={style.placeNameText}>{data['fContent'+language].fBuildingName}</Text>
                            <Text accessible={true} accessibilityLabel={'AskAliceAddLocationPlaceLocationType'} preset={Text.preset.heading9B} numberOfLines={1} style={style.typeAndLocationText}>{VisitorHelper.getLocalizeDataFromLookUp('BuildingCategory',data.buildingType,this.props.language)}, {VisitorHelper.getLocalizeDataFromLookUp('City',data.city,language)}</Text>
                            <Text accessible={true} accessibilityLabel={'MallHomeHeaderShortDesc'} preset={Text.preset.heading9} style={style.lastVisitText} numberOfLines={2}>{data['fContent'+language].fShortDescription}</Text>              
                        </View>
                    </TouchableOpacity>
                    <ParkingHeader lastUpdated={this.props.lastUpdated} onHideParkingPopView={this.props.onHideParkingPopView} navigator ={this.props.navigator} parkingData={data.parkingData} buildingKey={data.buildingKey} lastUpdated={this.props.lastUpdated} language={this.props.language} style={style.throwWHP}></ParkingHeader>
               
                </View>
                
        );
    }
}
