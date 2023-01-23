/**
 * wrap react-native WebView component with 2 additional behavior
 * 1. default style and preset to choose from
 * 2. hidden true|false
 * 3. load from html or from url 
 *    source={{uri:'...'}} | originWhiteList={['*']} source={{html:'<h1>hello</h1>'}}
 * 4. javascript injection
 *    a. injectedJavaScript prop
 *    b. injectedJavaScriptBeforeContentLoaded prop
 *    c. injectJavaScript method 
 *       ref={r => (this.webref = r)}
 *       this.webref.injectJavaScript(scriptStr);
 *    d. postMessage (in page) and onMessage event (in app to capture the message)
 * 5. link navigation interception
 *    onNavigationStateChange event
 */

import React from 'react';
import { StyleSheet } from 'react-native';
import { SGHelperStyle } from '../helper/SGHelperStyle';
import { SGBaseControl } from './SGBaseControl';
import { WebView } from 'react-native-webview';
import { SGView } from './SGView';
import { SGActivityIndicator } from './SGActivityIndicator';
import { SGHelperType } from '../helper';

export class SGWebView extends SGBaseControl {
    static preset = {
        default: 'default',
        hidden: 'hidden',
    }
    static _presetStyle = StyleSheet.create({
        default: { alignSelf: 'stretch', alignItems: 'stretch' },
        hidden: { width: 0, height: 0, margin: 0, overflow: 'hidden' },
    });
    constructor(props, context, ...args) {
        super(props, context, ...args);
        this.state = { isLoaded: false };
        this.webViewRef = React.createRef();

    }

    goBack(){
        if(SGHelperType.isDefined(this.webViewRef.current)){
            this.webViewRef.current.goBack();
        }
    }

    goForward(){
        if(SGHelperType.isDefined(this.webViewRef.current)){
            this.webViewRef.current.goForward();
        }
    }

    render() {
        var myProps;
        myProps = SGHelperStyle.addStyleProps(this.props, SGWebView._presetStyle[this.props.preset ? this.props.preset : SGWebView.preset.default]);
        var vStyle = this.props.hidden ? SGWebView._presetStyle.hidden : myProps.style;
        myProps.style = null;
        return (
            !this.props.hidden &&
            <SGView accessible={true} accessibilityLabel={'SGWebViewRootView'} style={vStyle}>
                <WebView ref={this.webViewRef} accessible={true} accessibilityLabel={'SGWebViewWebView'} {...myProps} onLoadEnd={(e) => { this.setState({ isLoaded: true }); }} ></WebView>
                {!this.state.isLoaded &&
                    <SGActivityIndicator style={{ position: 'absolute', width: '100%', height: '100%' }} hidden={this.props.hidden ? true : this.state.isLoaded} preset={SGActivityIndicator.preset.h2} />
                }
            </SGView>
        );
    }
}
