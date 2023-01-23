import React from 'react';
import Core from '../../core/core';


export default class Lesson21Screen extends Core.Screen.SGBaseScreen {

    createStyleSheet = (whp) => {
        const {StyleSheet} = Core;
        var { w, h, p } = whp;
        return StyleSheet.create({
            v1: { justifyContent: 'center', alignItems: 'flex-start', width: w, height: h, overflow: 'visible' },
        });
    }

    constructor(props, context, ...args) {
        Core.log('constructor');
        const {SGHelperGlobalVar} = Core.Helper;
        super(props, context, ...args);
        this.style = this.createStyleSheet(this.WHP);
        this._darkMode = false;
        if(!SGHelperGlobalVar.isVar('jumlahLoginGagal')){
            SGHelperGlobalVar.addVar('jumlahLoginGagal',0);
        } 
    }

    onButtonPress() {
        var c = Core.Helper.SGHelperGlobalVar.getVar('jumlahLoginGagal');
        Core.Helper.SGHelperGlobalVar.setVar('jumlahLoginGagal',c+1);
        Core.log(Core.Helper.SGHelperGlobalVar.getVar('jumlahLoginGagal'));
    }

    onButton2Press() {
        Core.Helper.SGHelperGlobalVar.setVar('jumlahLoginGagal',0);
        Core.log(Core.Helper.SGHelperGlobalVar.getVar('jumlahLoginGagal'));
    }

    onButton3Press() {
        this._evt = Core.Helper.SGHelperGlobalVar.subscribeVar('jumlahLoginGagal',(x)=>{ alert(x+' upaya login gagal')});
    }

    onButton4Press() {
        Core.Helper.SGHelperGlobalVar.unSubscribeVar('jumlahLoginGagal',this._evt);
    }

    render() {
        const { SGRootScrollView, SGButton, } =Core.Control;
        Core.log('render')
        var style = this.style;
        var { w, h, p } = this.WHP;
        return (
            <SGRootScrollView style={{width:w,backgroundColor:'white'}}>
                <SGButton label={'Login'} onPress={this.onButtonPress.bind(this)} />
                <SGButton label={'Reset'} onPress={this.onButton2Press.bind(this)} />
                <SGButton label={'Add Event'} onPress={this.onButton3Press.bind(this)} />
                <SGButton label={'Remove Event'} onPress={this.onButton4Press.bind(this)} />
            </SGRootScrollView>
        );
    }
}