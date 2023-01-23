import React from 'react';
import Core from '../../../core/core';

export default class SliderBenefit extends Core.Control.SGBaseContainer {

  createStyleSheet = (whp) => {
    const { StyleSheet } = Core;
    var { w, h, p } = whp;
    return StyleSheet.create({
      v1: { width:w, flex: 1, backgroundColor: 'white', alignItems: 'center', justifyContent: 'center' },
      v2: {height:52*p, width:0.9*w,borderRadius:10, alignItems:'center', justifyContent:'center',marginLeft:0},
      v3: {alignSelf:'flex-start',width:0.9*w,alignItems:'flex-start', justifyContent:'flex-start',borderBottomWidth:1,width:w,borderColor:'grey',marginLeft:10*p},
      v4: {alignSelf:'flex-start',width:0.9*w,alignItems:'flex-end'},
      vImage: {marginBottom:10,backgroundColor: 'rgba(255,0,0,0.6)', width: '100%', height:'100%',borderRadius:10, alignItems:'flex-start', justifyContent:'flex-start',paddingVertical:4*p},
      vColorGreen: {color:'green'},
      vColorBlue: {color:'lightblue'},
      imagekartu:{width:0.95*w,marginBottom:p,backgroundColor: 'rgba(255,0,0,0.6)',height:0.6*w,borderRadius:10, alignItems:'flex-start', justifyContent:'flex-start',resizeMode:'cover'},

    });
  }

  constructor(props, context, ...args) {
    super(props, context, ...args);
    this.style = this.createStyleSheet(this.screenWHP);
  }

  componentWillUnmount() {
    if (!this._previousOrientationLandscape) {      
      Core.Helper.SGHelperWindow.lockPortrait();
    }
  }

  render() {
    const { SGText,SGIcon,SGView, SGButton, SGImage,SGTouchableOpacity} = Core.Control;
    const { SGHelperNavigation } = Core.Helper;
    var { w, h, p } = this.screenWHP;
    var style = this.style;
    var data = this.props.data;
    var imset = this.props.imset;
    return(
    <SGView style={{width: w*0.95,height:'100%'}}>
      <SGTouchableOpacity style={{alignItems:'center'}}onPress={() => { }}>
        <SGImage style={style.imagekartu} source={{ uri: data[imset].uri }}/>
      </SGTouchableOpacity>
    </SGView>
    );
  }
}