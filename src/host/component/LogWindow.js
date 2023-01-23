import React from 'react';
import { SGScrollView, SGText, SGView,SGIcon,SGBaseControl, SGWebView, SGDialogBox, SGPopView } from "../../core/control";
import Core from '../../core/core.js';
import Clipboard from '@react-native-community/clipboard';

export default class LogWindow extends SGBaseControl {
    constructor(props, context, ...args) {
        super(props, context, ...args);
        this._fontPreset = [SGText.preset.h5,SGText.preset.h6,SGText.preset.h7,SGText.preset.h8,SGText.preset.h9,SGText.preset.h10];
        this._lastUpdate = Core._logs.timeStamp;
        this.state = { data: Core._logs.data, fontIndex:3};
        this._siID = setInterval(() => {
            if (this._lastUpdate !== Core._logs.timeStamp) { 
                this.setState({ data: Core._logs.data }); 
            }
        }, 200);
        this._SVID = React.createRef();
        this.pv1 = SGPopView.getPopViewID();
    }
    componentWillUnmount() {
        clearInterval(this._siID);
    }
    increaseTextFontSize(){
        if(this.state.fontIndex>0){
            this.setState({fontIndex: this.state.fontIndex-1})
        }
    }
    decreaseTextFontSize(){
        if(this.state.fontIndex<5){
            this.setState({fontIndex: this.state.fontIndex+1})
        }
    }
    clearLog(){
        Core._logs.timeStamp = Date.now(); 
        Core._logs.data = [];
    }
    copyLog(){
        var str = '';
        for(var i=0;i<Core._logs.data.length;i++){
            str += Core._logs.data[i]+'\n';
        }
        Clipboard.setString(str);
    }
    showWebView(){
        this.strHTML ="<HTML><HEAD></HEAD><BODY style='color:white; background-color:black'>";
        for(var i=0;i<Core._logs.data.length;i++){
            this.strHTML += Core._logs.data[i]+"</br>"
        }
        this.strHTML += "</BODY></HTML>";
        SGPopView.showPopView(this.pv1,false,false);
    }
    hideWebView(){
        SGPopView.hidePopView(this.pv1);
    }
    render() {
        var {w,h,p} = this.screenWHP;
        return (
            <>
                <SGView dontRandomColor style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-between' }}>
                    <SGText style={{ color: 'white' }} preset={SGText.preset.h7B}>{'LOG'}</SGText>
                    <SGView dontRandomColor style={{ flexDirection: 'row' }}>
                        <SGIcon preset={SGIcon.preset.h5B} name={SGIcon.Icon.minusCircle} style={{ color: 'white' }} onPress={this.decreaseTextFontSize.bind(this)} />
                        <SGIcon preset={SGIcon.preset.h5B} name={SGIcon.Icon.plusCircle} style={{ color: 'white' }} onPress={this.increaseTextFontSize.bind(this)} />
                        <SGIcon preset={SGIcon.preset.h5B} name={SGIcon.Icon.delete} style={{ color: 'white' }} onPress={this.clearLog.bind(this)} />
                        <SGIcon preset={SGIcon.preset.h5B} name={SGIcon.Icon.copy} style={{ color: 'white' }} onPress={this.copyLog.bind(this)} />
                        <SGIcon preset={SGIcon.preset.h5B} name={SGIcon.Icon.sizeFullScreen} style={{ color: 'white' }} onPress={this.showWebView.bind(this)} />
                        <SGIcon preset={SGIcon.preset.h4B} name={SGIcon.Icon.close} style={{ color: 'white' }} onPress={this.props.onClose?this.props.onClose:()=>{}} />
                    </SGView>
                </SGView>
                <SGScrollView ref={this._SVID} onContentSizeChange={()=>{this._SVID.current.scrollToEnd({animated:true});}} dontRandomColor style={{ width: '100%', height: '100%', }} contentContainerStyle={{ alignItems: 'flex-start', alignItems: 'flex-start' }}>
                    {
                        this.state.data.map((d, i) => {
                            return <SGText key={i} preset={this._fontPreset[this.state.fontIndex]} style={{ color: 'white' }}>{d}</SGText>
                        })
                    }
                </SGScrollView>
                <SGPopView popViewID={this.pv1} animationType={'slide'} vPos='bottom'>
                    <SGView style={{width:w*0.95, height:h*0.95, backgroundColor:'black', borderRadius:p}}>
                        <SGWebView style={{ flex:1 }} source={{ html: this.strHTML }}  />
                        <SGIcon preset={SGIcon.preset.h4B} name={SGIcon.Icon.close} style={{ color: 'white', position:'absolute', top:0, right:0,}} onPress={this.hideWebView.bind(this)} />
                    </SGView>
                </SGPopView>
            </>
        );
    }
}

