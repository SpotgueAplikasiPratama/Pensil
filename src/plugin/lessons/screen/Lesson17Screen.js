import React from 'react';
import Core from '../../core/core';

export default class Lesson17Screen extends Core.Screen.SGBaseScreen {

    createStyleSheet = (whp) => {
        const {StyleSheet} = Core;
        var { w, h, p } = whp;
        return StyleSheet.create({
            v1: { justifyContent: 'center', alignItems: 'flex-start', width: w, height: h, overflow: 'visible' },
        });
    }

    constructor(props, context, ...args) {
        Core.log('constructor');
        super(props, context, ...args);
        this.style = this.createStyleSheet(this.WHP);
        this._darkMode = false;
        this._webViewID = React.createRef();
        this._isLoaded = false;
    }

    onShouldStartLoadWithRequestHandler(newState){
        Core.log('onShouldStartLoadWithRequestHandler');
        Core.log(newState.url);
        return true;
    }
    onLoadEndHandler(e){
        Core.log('onLoadEnd');
        this._isLoaded = true; 
    }
    onNavigationStateChangeHandler(newState){
        Core.log('onNavigationStateChangeHandler');
        Core.log(newState.url);
    }
    onLoadStartHandler(){
        Core.log('onLoadStartHandler')
    }
    onMessage(event) {
        alert( event.nativeEvent.data );
    }

    render() {
        Core.log('render')
        const { SGRootView, SGTabView, SGWebView, SGView, SGButton, } = Core.Control;
        var style = this.style;
        var { w, h, p } = this.WHP;
        const INJECTED_JAVASCRIPT = `window.addEventListener('beforeunload', (event) => { event.preventDefault(); event.returnValue = '';});`;
        
        var videoLink="https://www.youtube.com/embed/DjB1OvEYMhY";
        var videoW = 1280;
        var videoH = 800;

        var HTML="<html><body><iframe id='player' width='"+ videoW + "px' height='"+ videoH + "px' src='" + videoLink + "?enablejsapi=1'></iframe>"+
        "<script>var player;"+
        "function myYT() { player = new YT.Player( 'player', { events: { 'onStateChange': onPlayerStateChange }});}"+
        "function onPlayerStateChange(event) { switch(event.data) { "+
        "case 0: window.ReactNativeWebView.postMessage('video ended');break;"+
        "case 1: window.ReactNativeWebView.postMessage('video played');break;"+
        "case 2: window.ReactNativeWebView.postMessage('video paused');break;"+
        "}}"+
        "window.onYouTubeIframeAPIReady = myYT;</script>"+
        "<script src='https://www.youtube.com/iframe_api'></script></body></html>";

        return (
            <SGRootView style={{width:w, backgroundColor:'white'}}>
                <SGButton label={'Toggle Dark Mode'} onPress={() => { this._darkMode = !this._darkMode; this.forceUpdate(); }} />
                <SGTabView hideTabBar={this._hideTabView} ref={this._tabView} scrollableTabBar={true} style={{ alignSelf: 'stretch', flex: 1, backgroundColor: this._darkMode ? 'black' : 'white' }} onChangeTab={(e) => { this._tabIndex = e.i; this.forceUpdate(); }}>
                    <SGView tabLabel='SGWebView-HTML' style={{ flex: 1, }}>
                        <SGWebView style={{ flex: 1 }} source={{ html: HTML }} onMessage={this.onMessage} />
                    </SGView>
                    <SGView tabLabel='SGWebView' style={{ alignSelf: 'stretch', flex: 1 }}>
                        <SGWebView
                            source={{ uri: 'https://observablehq.com/@d3/contourdensity-linear-binning' }}
                            style={{ flex: 1 }}
                        />
                    </SGView>
                    <SGView tabLabel='SGWebView2' style={{ alignSelf: 'stretch', flex: 1 }} >
                        <SGWebView
                            source={{ uri: 'https://www.spotgue.com' }}
                            style={{ flex: 1 }}
                        />
                    </SGView>
                </SGTabView>
            </SGRootView>
        );
    }
}