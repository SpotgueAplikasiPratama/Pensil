import { values } from 'ramda';
import React from 'react';
import { StyleSheet,Platform,Linking } from 'react-native';
import { SGBaseContainer } from '../../core/container/SGBaseContainer';
import { SGScrollView, SGView as View,SGWebView as WebView,SGIcon as Icon,SGTouchableOpacity as TouchableOpacity,SGText as Text, SGDialogBox } from '../../core/control';
import { SGHelperNavigation, SGHelperGlobalVar, SGHelperWindow,SGHelperType } from '../../core/helper';
import { SGLocalize } from '../locales/SGLocalize';

export class WebViewButton extends SGBaseContainer{
    createStyleSheet = (whp) => {
        var { w, h, p } = whp;
        return StyleSheet.create({
          v1:{backgroundColor:'transparent',flexDirection:'row'},
          touchIconLeft:{backgroundColor:'rgba(38,38,38,0.25)',borderColor:'rgba(255,255,255,0.8)',borderWidth:0.5*p, width:w*0.1,height:w*0.1,borderRadius:(w*0.1 + w*0.1)/2,justifyContent:'center',alignItems:'center',elevation:1},
          touchIconRight:{marginLeft:2*p, backgroundColor:'rgba(38,38,38,0.25)',borderColor:'rgba(255,255,255,0.8)',borderWidth:0.5*p,width:w*0.1,height:w*0.1,borderRadius:(w*0.1 + w*0.1)/2,justifyContent:'center',alignItems:'center',elevation:1},
        });
    }

    constructor(props, context, ...args) {
        super(props, context, ...args);
        this.style = this.createStyleSheet(this.screenWHP);
        this.webView = this.props.webViewRef;
       
    }

    render() {
        var { w, h, p } = this.screenWHP;
        var style = this.style;
        return (
            <View accessible={true} accessibilityLabel={'WebViewRender'} style={style.v1}>
                <TouchableOpacity style={style.touchIconLeft} shadow onPress={() => {this.webView.current.goBack();}}>
                    <Icon name={Icon.Icon.arrowLeft}  preset={Icon.preset.h1} style={{color:'rgba(255,255,255,0.8)'}}></Icon>
                 </TouchableOpacity>
                 <TouchableOpacity style={style.touchIconRight} shadow onPress={() => {this.webView.current.goForward();}}>
                    <Icon name={Icon.Icon.arrowRight}  preset={Icon.preset.h1} style={{color:'rgba(255,255,255,0.8)'}}></Icon>
                 </TouchableOpacity>
                 {
                    this.props.onToggleFullScreen &&
                    <TouchableOpacity style={style.touchIconRight} shadow onPress={() => {this.props.onToggleFullScreen();}}>
                        <Icon name={!this.props.fullScreenMode?Icon.Icon.sizeFullScreen:Icon.Icon.sizeActual}  preset={Icon.preset.h3} style={{color:'rgba(255,255,255,0.8)'}}></Icon>
                    </TouchableOpacity> 
                 }
            </View>
        );
    }
}

export class WebViewRender extends SGBaseContainer {
    createStyleSheet = (whp) => {
        var { w, h, p } = whp;
        return StyleSheet.create({
          v1:{width:w,height: this.props.highlightDisplay ? (Platform.OS === 'android' ?'93%':'89%') :'100%',backgroundColor:'transparent'},
          link:{backgroundColor:'transparent',marginVertical:2*p},
        });
    }

    constructor(props, context, ...args) {
        super(props, context, ...args);
        this.whp = this._screenWHP;
        this.height = this.whp.h;
        this.style = this.createStyleSheet(this.whp);
        this.state={counter:1};
        this.webViewRenderRef = React.createRef();
        this.showLink = SGHelperType.isDefined(this.props.hideButton) ? false : true       
    }

    goBack(){
        if(SGHelperType.isDefined(this.webViewRenderRef.current)){
            this.webViewRenderRef.current.goBack();
        }
    }

    goForward(){
        if(SGHelperType.isDefined(this.webViewRenderRef.current)){
            this.webViewRenderRef.current.goForward();
        }
    }
    
    handleLink(url) {
        Linking.canOpenURL(url
        ).then(supported => {
            if (supported) {
                Linking.openURL(url);
            } else {
                SGDialogBox.showWebView(url,()=>{});
                // SGDialogBox.showWarning(null,SGLocalize.translate("AlertMessage.Whoops"),SGLocalize.translate("AlertMessage.AlertHandleLink"),SGLocalize.translate("AlertMessage.OK"),()=>{},true,{label: url,url:url})
                // console.log("Don't know how to open URI: " + url);
            }
        });
    };

    render() {
        var { w, h, p } = this.whp;
        var style = this.style;
        return (
                <View accessible={true} accessibilityLabel={'WebViewRender'} style={this.props.screenShotMode?{width:this.props.screenShotW,height:this.props.screenShotH, backgroundColor:'transparent'}:style.v1}>
                    {this.props.fType == 'url' ?
                    <WebView injectedJavaScript={this.props.injectedJavaScript} onMessage={this.props.onMessage} ref={this.webViewRenderRef} accessible={true} accessibilityLabel={'Url'} style={this.props.screenShotMode?{width:this.props.screenShotW,height:this.props.screenShotH,flex:0}:{flex:1,backgroundColor:'white'}} source={{ uri : this.props.data}}></WebView>
                    :
                    <WebView injectedJavaScript={this.props.injectedJavaScript} onMessage={this.props.onMessage} ref={this.webViewRenderRef} accessible={true} accessibilityLabel={'html'} style={{flex:1,backgroundColor:'white'}} source={{ html : this.props.data}}></WebView>
                    }
                    {this.showLink && this.props.fType =='url' && Platform.OS =='android' &&
                    <>
                    <TouchableOpacity onPress={() => {this.handleLink(this.props.data)}} style={style.link}>
                        <Text preset={Text.preset.h7} style={{color: '#63AEE0'}}>{SGLocalize.translate('globalText.goToContentWebsiteText')}</Text>
                    </TouchableOpacity>
                    </>
                    }
                </View>
        );
    }
}
