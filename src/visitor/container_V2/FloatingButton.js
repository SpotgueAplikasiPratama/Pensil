/**
 * Version 1.4.11
 * yohanes 4 Jan 2022
 * 1. New component

 */
 import React from 'react';
 import {  StyleSheet} from 'react-native';
 import { SGBaseContainer } from '../../core/container/SGBaseContainer';
 import {  SGTouchableOpacity as TouchableOpacity, SGView as View, SGIcon } from '../../core/control';
 import { SGHelperType } from '../../core/helper';
 export class FloatingButton extends SGBaseContainer {

     constructor(props, context, ...args) {
         super(props, context, ...args);
         this._data=this.props.data
         this.initStyleSheet(this._data)
         this.editMode=this.props.editMode
         this.mode=1
     }
 
     initStyleSheet(propStyle) {
         this._whp = { w: propStyle.fWidth, h: propStyle.fHeight, p: propStyle.fWidth*0.01 }
         var { w, h, p } = this._whp;
         this._style = StyleSheet.create({
             to1: { width:w,height:h,borderRadius:w*0.2,backgroundColor:'transparent',borderWidth:5*p, borderColor:this.props.colorButton?this.props.colorButton:'red',position:'absolute',left:propStyle.fXPosition+28,top:propStyle.fYPosition+28},
             toEdit: { width:w,height:h,borderRadius:w*0.2,backgroundColor:'transparent',borderWidth:5*p, borderColor:this.props.colorButton?this.props.colorButton:'red'},
            
         });
     }
  
    _scaleSize(action){
        if(action==="plusW")this._data.fWidth = this._data.fWidth+1
        if(action==="minusW")this._data.fWidth = this._data.fWidth-1
        if(action==="plusH")this._data.fHeight = this._data.fHeight+1
        if(action==="minusH")this._data.fHeight = this._data.fHeight-1
        if(action==="plus"){
            this._data.fWidth = this._data.fWidth+1
            this._data.fHeight = this._data.fHeight+1
        }
        if(action==="minus"){
            this._data.fWidth = this._data.fWidth-1
            this._data.fHeight = this._data.fHeight-1
        }
        this.initStyleSheet(this._data)
        this.forceUpdate()
    }
    _movement(action){
        if(action==='left')this._data.fXPosition = this._data.fXPosition-1.0;console.log('left')
        if(action==='right')this._data.fXPosition = this._data.fXPosition+1.0
        if(action==='up')this._data.fYPosition = this._data.fYPosition-1.0
        if(action==='down')this._data.fYPosition = this._data.fYPosition+1.0
        // console.log(action)
        // console.log(this._data)
        this.initStyleSheet(this._data)
        this.forceUpdate()
        
    }
    _onClickButton(){
        console.log(this.editMode)
        if(this.editMode){
            var Guid=SGHelperType.getGUID()
            console.log("%c"+JSON.stringify({fID:Guid,fBuildingKey:this._data.fBuildingKey,fParkingLayoutKey:this._data.fParkingLayoutKey, fImageJSON:this._data.fImageJSON,fXPosition:this._data.fXPosition,fYPosition:this._data.fYPosition,fWidth:this._data.fWidth,fHeight:this._data.fHeight}),"color:yellow")
            console.log("%cINSERT INTO tbBFloatingParkingDB VALUES ('"+Guid+"','" + this._data.fBuildingKey+"','"+this._data.fParkingLayoutKey +"','"+ JSON.stringify(this._data.fImageJSON) +"','"+this._data.fXPosition +"','"+ this._data.fYPosition+"','"+ this._data.fWidth+"','"+this._data.fHeight +"','Y','25ed05dc-d5c2-4cd8-f051-08d86aa18a6b',GetDate(),'25ed05dc-d5c2-4cd8-f051-08d86aa18a6b',getDate() ) ","color:green")
        }else{
            console.log('aw')
            this.props.showPopView(this._data.fImageJSON)
        }
        
    }
    render() {
        var style = this._style;
         return (
            <>

           
                {
                    this.editMode &&
                    <View style={{position:'absolute',top:this._data.fYPosition,left:this._data.fXPosition}}>
                        <View style={{flexDirection:'row'}}>
                            <SGIcon style={{backgroundColor:'rgba(169,169,169,0.5)'}} preset={SGIcon.preset.h6} onPress={()=>{this._scaleSize(this.mode===1?'minus':'minusW')}} name={SGIcon.Icon.minus}></SGIcon>
                            <SGIcon style={{backgroundColor:'rgba(169,169,169,0.5)'}} preset={SGIcon.preset.h6} onPress={()=>{this._movement("up")}} name={SGIcon.Icon.arrowUp}></SGIcon>
                            <SGIcon style={{backgroundColor:'rgba(169,169,169,0.5)'}} preset={SGIcon.preset.h6} onPress={()=>{this._scaleSize(this.mode===1?'plus':'plusW')}} name={SGIcon.Icon.plusCircle}></SGIcon>
                        </View>
                        <View style={{flexDirection:'row'}}>
                            <SGIcon style={{backgroundColor:'rgba(169,169,169,0.5)'}} preset={SGIcon.preset.h6} onPress={()=>{this._movement('left')}} name={SGIcon.Icon.arrowLeft}></SGIcon>
                            <TouchableOpacity style={style.toEdit} onPress={()=>{this._onClickButton()}}></TouchableOpacity>
                            <SGIcon style={{backgroundColor:'rgba(169,169,169,0.5)'}} preset={SGIcon.preset.h6} onPress={()=>{this._movement('right')}} name={SGIcon.Icon.arrowRight}></SGIcon>
                        </View>
                        <View style={{flexDirection:'row'}}>
                            <SGIcon hidden={this.mode===1?true:false} style={{backgroundColor:'rgba(169,169,169,0.5)'}} preset={SGIcon.preset.h6} onPress={()=>{this._scaleSize('minusH')}} name={SGIcon.Icon.minus}></SGIcon>
                            <SGIcon style={{backgroundColor:'rgba(169,169,169,0.5)'}} preset={SGIcon.preset.h6} onPress={()=>{this._movement('down')}} name={SGIcon.Icon.arrowDown}></SGIcon>
                            <SGIcon hidden={this.mode===1?true:false} style={{backgroundColor:'rgba(169,169,169,0.5)'}} preset={SGIcon.preset.h6} onPress={()=>{this._scaleSize('plusH')}} name={SGIcon.Icon.plusCircle}></SGIcon>
                            
                        </View>
                    </View>
                }
                {
                    !this.editMode &&
                    <TouchableOpacity style={style.to1} onPress={()=>{this._onClickButton()}}></TouchableOpacity>
                }
                

           
             </>
        );
    }
 }
 