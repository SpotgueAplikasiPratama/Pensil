import React from 'react';
import Core from '../../../core/core';
import { SGHelperType } from '../../../core/helper';
// import PointCard from './PointCard';
import tbVPointHistoryAPI from '../api/tbVPointHistoryAPI';

export default class PointHistoryEarn extends Core.Control.SGBaseContainer {

  createStyleSheet = (whp) => {
    const { StyleSheet } = Core;
    var { w, h, p } = whp;
    return StyleSheet.create({
      v1: { width:w, flex: 1, backgroundColor: 'white', alignItems: 'center', justifyContent: 'center' },
      imagekartu:{marginBottom:10,backgroundColor: 'rgba(255,0,0,0.6)', width: '100%', height:'100%',borderRadius:10, alignItems:'flex-start', justifyContent:'flex-start',paddingVertical:4*p},
      pointStyle:{},
      vCard: {height:52*p, width:0.9*w+p,borderRadius:10, alignItems:'flex-start', justifyContent:'center',marginLeft:-p, backgroundColor: 'blue',},
      vColorWhite: {color:'white'},
      vPosition: {flexDirection:'row', justifyContent:'flex-start', marginTop:-2*p},
      vCardName: {color:'white', marginTop:6*p},
      vJSONName: {color:'white', marginTop:-2*p},
      vThru: {color:'white',marginTop:-1*p},
      v8: {backgroundColor: "#000000", borderTopRightRadius: 5, borderBottomRightRadius: 5, alignItems: "flex-start",marginTop:2*p, minWidth: w*0.2, maxWidth: w*0.35},
      v9: {width: 0.9*w,backgroundColor:'white', borderRadius:10, flexDirection:'column', justifyContent:'space-between',paddingVertical:4*p, marginTop:3*p, borderWidth:1, borderColor:'lightgrey'},
      vTV2: {width:'100%',flexDirection:'row', justifyContent:'space-between'},  
      v31: { width: w * 0.9, height: w * 1.5, backgroundColor: 'white',borderWidth:2, borderRadius:10, justifyContent:'flex-start'},
      approved: {color:'rgb(56,188,140)'},
      rejected: {color:'#E24444'},
      submitted: {color:'#FBB833'},
    });
  }

  constructor(props, context, ...args) {
    super(props, context, ...args);
    this.style = this.createStyleSheet(this.screenWHP);
    this.data = this.props.data;
    console.log(this.data)
    console.log('llihat data')
    this.fType = this.props.fType;
    Core.log(JSON.stringify(this.fType))
  }

  componentWillUnmount() {
    if (!this._previousOrientationLandscape) {     
      Core.Helper.SGHelperWindow.lockPortrait();
    }
  }  

  render() {
    const {SGText,SGIcon, SGTextInput, SGView,SGTouchableOpacity,SGImage } = Core.Control;
    var { w, h, p } = this.screenWHP;
    var style = this.style;
    var data = this.props.data;
    console.log(data)

    if(data.fStatus == 'rejected'){
      style.option = style.rejected;
    }
    if(data.fStatus == 'approved'){
      style.option = style.approved;
    }
    if(data.fStatus == 'submitted'){
      style.option = style.submitted;
    }
      
    return (
      <SGView style={style.v9}>

        <SGView style={style.vTV2}>
          <SGView style={{alignItems:'flex-start'}}>
            <SGText style={{marginLeft:2*p}}>{SGHelperType.formatDateTime(SGHelperType.convertNewDate(data.fLastModifiedDate))}</SGText>
            
            <SGView style={{flexDirection: 'row', width: 0.9*w, justifyContent: 'space-between'}}>
              <SGView style={style.v8}>
                <SGText preset={SGText.preset.h5B} style={{minWidth: w*0.2, maxWidth: w*0.35,marginTop:3*p, color:'white'}}>+ {data.fPoint} P</SGText>
              </SGView>
              <SGText preset={SGText.preset.titleH2B} style={style.option}>{data.fStatus}</SGText>
            </SGView>
          </SGView>
        </SGView>

        <SGText style={{marginTop: p*2}}>{data.fReason}</SGText>
    </SGView>
    );
  }
}