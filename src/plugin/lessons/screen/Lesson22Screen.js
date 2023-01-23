import React from 'react';
import Core from '../../core/core';


export default class Lesson22Screen extends Core.Screen.SGBaseScreen {

    createStyleSheet = (whp) => {
        const { StyleSheet } = Core;
        var { w, h, p } = whp;
        return StyleSheet.create({
            v1: { justifyContent: 'center', alignItems: 'flex-start', width: w, height: h, overflow: 'visible' },
        });
    }

    constructor(props, context, ...args) {
        const { SGHelperDB } = Core.Helper;
        super(props, context, ...args);
        this.style = this.createStyleSheet(this.WHP);
        this._darkMode = false;
        this._name = '';
        this.loadData();
    }

    async loadData() {
        const { SGHelperDB } = Core.Helper;
        var v = await SGHelperDB.getKeyValue('MyName');
        this._name = (v === null ? '' : v);
        this.forceUpdate();
    }

    //model lain
    async loadData2() {
        const { SGHelperDB } = Core.Helper;
        SGHelperDB.getKeyValue('MyName').then((v)=>{
            Core.log('aa');
            this._name = (v === null ? '' : v);
            this.forceUpdate();    
        });
        Core.log('bb');
    }

    async onButtonPress() {
        const { SGHelperDB } = Core.Helper;
        await SGHelperDB.storeKeyValue('MyName', this._name);
        alert('name saved');
    }

    render() {
        const { SGRootScrollView, SGButton, SGText, SGTextInput } = Core.Control;
        var style = this.style;
        var { w, h, p } = this.WHP;
        return (
            <SGRootScrollView style={{width:w, backgroundColor:'white'}}>
                <SGText preset={SGText.preset.h6B}>Your Name:</SGText>
                <SGTextInput dataType={SGTextInput.dataType.text} placeHolder={'Please enter name'} value={this._name} onChangeText={(v) => { this._name = v; this.forceUpdate(); }} />
                <SGButton label={'Save Name'} onPress={this.onButtonPress.bind(this)} />
            </SGRootScrollView>
        );
    }
}