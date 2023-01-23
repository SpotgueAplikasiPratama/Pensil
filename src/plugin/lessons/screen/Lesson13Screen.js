import React from 'react';
import Core from '../../core/core';

export default class Lesson13Screen extends Core.Screen.SGBaseScreen {

    constructor(props, context, ...args) {
        super(props, context, ...args);
        this._nama = '';
        this._tabView = React.createRef();
        this._hideTabView = false;
        this._tabIndex = 0;
    }
    render() {
        const { SGText, SGRootView, SGTabView, SGScrollView, SGView, SGButton, SGImage} = Core.Control;

        var { w, h, p } = this._screenWHPNoHeader;
        return (
            <SGRootView>
                <SGView style={{ width: w, height: 80, backgroundColor: 'white' }}>
                    <SGScrollView horizontal style={{width:w}} contentContainerStyle={{ flexDirection: 'row', backgroundColor: 'white' }}>
                        <SGButton label={'Tab1'} style={{ backgroundColor: this._tabIndex === 0 ? 'red' : 'black' }} onPress={() => { this._tabView.current.goToPage(0) }} />
                        <SGButton label={'Tab2'} style={{ backgroundColor: this._tabIndex === 1 ? 'red' : 'black' }} onPress={() => { this._tabView.current.goToPage(1) }} />
                        <SGButton label={'Tab3'} style={{ backgroundColor: this._tabIndex === 2 ? 'red' : 'black' }} onPress={() => { this._tabView.current.goToPage(2) }} />
                        <SGButton label={'Tab4'} style={{ backgroundColor: this._tabIndex === 3 ? 'red' : 'black' }} onPress={() => { this._tabView.current.goToPage(3) }} />
                        <SGButton label={'HideTabBar'} onPress={() => { this._hideTabView = true; this.forceUpdate(); }} />
                        <SGButton label={'ShowTabBar'} onPress={() => { this._hideTabView = false; this.forceUpdate(); }} />
                    </SGScrollView>
                </SGView>
                <SGTabView locked={false} hideTabBar={this._hideTabView} ref={this._tabView} scrollableTabBar={true} style={{ alignSelf: 'stretch', width:w, flex: 1, backgroundColor: this._darkMode ? 'black' : 'white' }} onChangeTab={(e) => { this._tabIndex = e.i; this.forceUpdate(); }}>
                    <SGView tabLabel='View1' style={{height:w, backgroundColor:'pink'}}>
                        <SGText>Ini Tab 1</SGText>
                    </SGView>
                    <SGView tabLabel='View2' style={{height:w, backgroundColor:'orange'}}>
                        <SGText>Ini Tab 2</SGText>
                    </SGView>
                    <SGView tabLabel='View3' style={{height:w, backgroundColor:'cyan'}}>
                        <SGText>Ini Tab 3</SGText>
                    </SGView>
                    <SGView tabLabel='View4' style={{height:w, backgroundColor:'purple'}}>
                        <SGText>Ini Tab 4</SGText>
                    </SGView>
                    <SGImage tabLabel='View5' style={{width:w*0.5, height:w*0.5,}} source={{uri:'https://www.spotgue.com/logo.png'}}/>
                </SGTabView>
            </SGRootView>
        );
    }
}
