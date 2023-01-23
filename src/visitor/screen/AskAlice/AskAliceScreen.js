/**
 * Version 1.2.0
 * 1. Yohanes March 29 2021
 * - add Error Handling
 */
import React from 'react';
import { StyleSheet, Animated, Platform } from 'react-native';
import { SGView as View, SGRootView as RootView, SGDialogBox as DialogBox, SGImage as Image, SGText as Text, SGScrollView as ScrollView, SGTouchableOpacity as TouchableOpacity,SGIcon as Icon } from '../../../core/control';
import { ModuleHeader } from '../../component_V2/ModuleHeader';
import { SGBaseScreen } from '../../../core/screen/SGBaseScreen';
import { BottomNavigationContainer } from '../../component_V2/BottomNavigationContainer';
import { SGBaseContainer } from '../../../core/container/SGBaseContainer';
import { SGHelperNavigation, SGHelperGlobalVar, SGHelperType, SGHelperWindow, SGHelperErrorHandling } from '../../../core/helper';
import { RibbonHeader } from '../../component_V2/RibbonHeader';
import { SGLocalize } from '../../locales/SGLocalize';
import { tbVAliceWTEatAPI } from '../../../visitor/api/tbVAliceWTEatAPI';
import { tbVAliceWTGiftAPI } from '../../../visitor/api/tbVAliceWTGiftAPI';
import { tbVAliceWTGoAPI } from '../../../visitor/api/tbVAliceWTGoAPI';
import { tbVAliceCTBuyAPI } from '../../../visitor/api/tbVAliceCTBuyAPI';
import { MyMenuBar } from '../../component_V2/MyMenuBar';
import Tts from 'react-native-tts';
import image from '../../asset/image';
import idJSON from '../../locales/id.json';
import enJSON from '../../locales/en.json';
import cnJSON from '../../locales/cn.json';
import { tbSystemParamsDAO,  } from '../../db/tbSystemParamsDAO';
import { VisitorHelper } from '../../helper/VisitorHelper';
import {askAliceLastLocationData, askAliceLastLocationSelectedDAO} from '../../db/askAliceLastLocationSelectedDAO';

export class LeftChatBubble extends SGBaseContainer {
    createStyleSheet = (whp) => {
        var { w, h, p } = whp;
        return StyleSheet.create({
            mainView1: { marginTop: 0, marginLeft: 5 * p, flexDirection: 'row', width: w, padding: p, alignItems: 'flex-start', justifyContent: 'flex-start' },
            imageView: { borderRadius: w, justifyContent: 'flex-start', width: w * 0.1, },
            image: { borderColor: '#D3D3D3', borderWidth: 0.3, borderRadius: w, width: w * 0.1, height: w * 0.1, resizeMode: 'contain' },
            bubbleView: { alignItems: 'flex-start', },
            chatBubble: { marginTop: p, marginLeft: 2 * p, backgroundColor: '#E9B64C', borderBottomEndRadius: 10, borderTopEndRadius: 10, borderBottomLeftRadius: 10, padding: 2 * p, maxWidth: w * 0.7 },
            text: { textAlign: 'justify' },
            nameText: { color: '#909090', marginTop: 4 * p, marginLeft: 2 * p },
            chatText: { color: '#ffffff' }
        });
    }

    constructor(props, context, ...args) {
        super(props, context, ...args);
        this.whp = { w: props.style.width, h: props.style.height, p: props.style.padding };
        this.style = this.createStyleSheet(this.whp);
        this.title = props.title;
        this.image = props.image;

    }

    render() {
        var { w, h, p } = this.whp;
        var style = this.style;
        var data = this.props.parkingListData;
        return (
            <View accessible={true} accessibilityLabel={'LeftChatBubbleRoot'} style={style.mainView1}>
                {/* <View shadow shadowIntensity={0.5} style={style.imageView}>
                    <Image style={style.image} source={{ uri: image.askAliceAvatar[this.props.imageSetting].url }}></Image>
                </View> */}
                <View accessible={true} accessibilityLabel={'LeftChatBubbleView1'} style={style.bubbleView}>
                    {/* <Text preset={Text.preset.h9B} style={style.nameText}>{SGLocalize.translate('askAliceScreen.AIName')}</Text> */}
                    <View accessible={true} accessibilityLabel={'LeftChatBubbleAliceChat'} style={style.chatBubble}>
                        <Text accessible={true} accessibilityLabel={'LeftChatBubbleAliceChatText'} preset={Text.preset.titleH4B} style={style.chatText}>{this.props.text}</Text>
                    </View>
                </View>
            </View>
        );
    }
}

export class LeftChoiceBubble extends SGBaseContainer {
    createStyleSheet = (whp) => {
        var { w, h, p } = whp;
        return StyleSheet.create({
            mainView1: { marginTop: 0, marginLeft: 5 * p, flexDirection: 'row', width: w, padding: p, alignItems: 'flex-start', justifyContent: 'flex-start' },
            imageView: { borderRadius: w, justifyContent: 'flex-start', width: w * 0.1, },
            image: { borderColor: '#D3D3D3', borderWidth: 0.3, borderRadius: w, width: w * 0.1, height: w * 0.1, resizeMode: 'contain' },
            bubbleView: { alignItems: 'flex-start', },
            chatBubble: { alignItems: 'flex-start', marginTop: p, marginLeft: 2 * p, backgroundColor: '#E9B64C', borderBottomEndRadius: 10, borderTopEndRadius: 10, borderBottomLeftRadius: 10, padding: 2 * p, maxWidth: w * 0.8 },
            text: { textAlign: 'justify' },
            nameText: { color: '#909090', marginTop: 4 * p, marginLeft: 2 * p },
            chatText: { color: '#ffffff', marginBottom: p * 2 },
            textChoice: { color: '#696969' },
            choiceView: { alignItems: 'flex-start', marginHorizontal: p, backgroundColor: '#FFFFFF', width: w * 0.6, marginVertical: p, borderRadius: 8, padding: p,minHeight:w*0.08 },
            choiceViewSelected: { alignItems: 'flex-start', marginHorizontal: p, backgroundColor: '#ffffff', width: w * 0.6, marginVertical: p, borderRadius: 8, padding: p,minHeight:w*0.08 },
            choiceViewDisabled: { alignItems: 'flex-start', marginHorizontal: p, backgroundColor: 'rgb(220,220,220)', width: w * 0.6, marginVertical: p, borderRadius: 8, padding: p,minHeight:w*0.08 },
            textChoiceSelected: { color: '#019179' },
            text2Choice: { color: '#696969' },
            choice2View: { alignItems: 'flex-start', marginLeft: 'auto', marginHorizontal: 0, backgroundColor: '#FFFFFF', width: w * 0.5, marginVertical: 0.57 * p, borderRadius: 8, padding: p,minHeight:w*0.08 },
            choice2ViewSelected: { alignItems: 'flex-start', marginLeft: 'auto', marginHorizontal: 0, backgroundColor: '#ffffff', width: w * 0.5, marginVertical: 0.57 * p, borderRadius: 8, padding: p,minHeight:w*0.08 },
            text2ChoiceSelected: { color: '#019179' },
            choice2Container: { alignItems: 'flex-end', width: w * 0.6 }
        });
    }

    constructor(props, context, ...args) {
        super(props, context, ...args);
        this.whp = { w: props.style.width, h: props.style.height, p: props.style.padding }
        this.style = this.createStyleSheet(this.whp);
        this.title = props.title;
        this.image = props.image;
        this.state = { selected: 99, selected2: 99, inactive: false };
        if(this.props.firstQuestion)this._constructCircuitBreaker()
    }

    choiceSelected(val) {
        if (this.props.check) {
            if (val === 0) {
                this.setState({ selected: val, inactive: true });
            }
            if (val === 1 && this.props.placeID !== '') {
                this.setState({ selected: val, inactive: true });
            }
            if (val === 2 && this.props.placeID !== '') {
                this.setState({ selected: val, inactive: true });
            }
            if (val === 3 && this.props.placeID !== '') {
                this.setState({ selected: val, inactive: true });
            }
        }
        else {
            this.setState({ selected: val, inactive: true });
        }

    }
    _constructCircuitBreaker(){
        console.log('_constructCircuitBreaker')
        var data = this.props.choiceData
        var indeks = ['CircuitBreakerAliceWhereToGo','CircuitBreakerAliceWhatToEat','CircuitBreakerAliceWhatToBuy','CircuitBreakerAliceWhatToGift']
        for (var i=0;i<data.length;i++){
            // this._circuitBreakerChecking(indeks[i])
            var circuitBreaker = SGHelperType.getCircuitBreakerStatus(indeks[i])
            // console.log(circuitBreaker)
            if(circuitBreaker.fActive==="N"){
                if(indeks[i]==='CircuitBreakerAliceWhereToGo') this.whereToGo=true
                if(indeks[i]==='CircuitBreakerAliceWhatToEat') this.whatToEat=true
                if(indeks[i]==='CircuitBreakerAliceWhatToBuy') this.whatToBuy=true
                if(indeks[i]==='CircuitBreakerAliceWhatToGift') this.whatToGift=true
            }  
        }
    }
    _checkDisableCircuitBreaker(val,isRender){
        var indeks =['whereToGo','whatToEat','whatToBuy','whatToGift']
        if(isRender===false)return this.state.inactive || this[indeks[val]]
        return this[indeks[val]]
    }
    choiceSelectedNoDisable(val) {
        this.setState({ selected: val });
    }

    choiceSelected2(val1, val2) {
        this.setState({ selected: val1, selected2: val2, inactive: true });
    }
    
    render() {
        var { w, h, p } = this.whp;
        var style = this.style;
        var data = this.props.choiceData;

        return (
            <View accessible={true} accessibilityLabel={'LeftChoiceBubbleRoot'} style={style.mainView1}>
                {/* <View shadow shadowIntensity={0.5} style={style.imageView}>
                    <Image style={style.image} source={{ uri: image.askAliceAvatar[this.props.imageSetting].url }}></Image>
                </View> */}
                <View accessible={true} accessibilityLabel={'LeftChoiceBubbleView1'} style={style.bubbleView}>
                    {/* <Text preset={Text.preset.h9B} style={style.nameText}>{SGLocalize.translate('askAliceScreen.AIName')}</Text> */}
                    <View accessible={true} accessibilityLabel={'LeftChoiceBubbleAlice'} style={style.chatBubble}>
                        <Text accessible={true} accessibilityLabel={'LeftChoiceBubbleQuestion'} preset={Text.preset.titleH4B} style={style.chatText}>{this.props.text}</Text>
                        {this.props.choiceData2 ?
                            data.map((x, index) => {
                                return (
                                    <View accessible={true} accessibilityLabel={'LeftChoiceBubbleChoiceDataRootView'}>
                                        <TouchableOpacity disabled={this.state.inactive} disabledColor onPress={() => { this.choiceSelectedNoDisable(x.value) }}>
                                            {x.value === this.state.selected ?
                                                (<View accessible={true} accessibilityLabel={'LeftChoiceBubbleChoiceDataSelected'} style={style.choiceViewSelected}><Text preset={Text.preset.titleH5B} style={style.textChoiceSelected}>{x.label}</Text></View>) :
                                                (<View accessible={true} accessibilityLabel={'LeftChoiceBubbleChoiceData'} style={style.choiceView}><Text preset={Text.preset.titleH5B} style={style.textChoice}>{x.label}</Text></View>)
                                            }
                                        </TouchableOpacity>
                                        <View accessible={true} accessibilityLabel={'LeftChoiceBubbleChoiceDataView1'} hidden={this.state.selected === x.value ? false : true}  style={style.choice2Container}>
                                            {this.state.selected === x.value ? this.props.choiceData2[this.state.selected].map((y, index) => {
                                                return (
                                                    <TouchableOpacity disabled={this.state.inactive} disabledColor onPress={() => { this.choiceSelected2(x.value, y.value); this.props.onChoicePress({ label: x.label, value: x.value }, { label: y.label, value: y.value }) }}>
                                                        {y.value === this.state.selected2 ?
                                                            (<View accessible={true} accessibilityLabel={'LeftChoiceBubbleChoice2DataSelected'} style={style.choice2ViewSelected}><Text preset={Text.preset.titleH5B} style={style.text2ChoiceSelected}>{y.label}</Text></View>) :
                                                            (<View accessible={true} accessibilityLabel={'LeftChoiceBubbleChoice2Data'} style={style.choice2View}><Text preset={Text.preset.titleH5B} style={style.text2Choice}>{y.label}</Text></View>)
                                                        }
                                                    </TouchableOpacity>
                                                )
                                            }) : (null)}
                                        </View>
                                    </View>
                                )
                            })
                            :
                            data.map((x, index) => {
                                return (
                                    <View accessible={true} accessibilityLabel={'LeftChoiceBubbleDisableRootView'}>
                                        <TouchableOpacity  disabled={this._checkDisableCircuitBreaker(x.value,false)} disabledColor onPress={() => { this.choiceSelected(x.value); this.props.onChoicePress({ label: x.label, value: x.value }) }} >
                                            {x.value === this.state.selected ?
                                                (<View accessible={true} accessibilityLabel={'LeftChoiceBubbleDisableView1'} style={style.choiceViewSelected}><Text accessible={true} accessibilityLabel={'LeftChoiceBubbleDisableSelected'} preset={Text.preset.titleH5B} style={style.textChoiceSelected}>{x.label}</Text></View>) :
                                                (<View accessible={true} accessibilityLabel={'LeftChoiceBubbleDisableView2'} style={this._checkDisableCircuitBreaker(x.value,true)===true? style.choiceViewDisabled : style.choiceView}><Text accessible={true} accessibilityLabel={'LeftChoiceBubbleDisable'} preset={Text.preset.titleH5B} style={style.textChoice}>{x.label}</Text></View>)
                                            }
                                        </TouchableOpacity>
                                    </View>
                                )
                            })
                        }
                    </View>
                </View>
            </View>
        );
    }
}

export class RightChatBubble extends SGBaseContainer {
    createStyleSheet = (whp) => {
        var { w, h, p } = whp;
        var rImage = w * 0.13;
        return StyleSheet.create({
            mainView1: { marginVertical: 3 * p, flexDirection: 'row-reverse', width: w, padding: p, alignItems: 'flex-start', justifyContent: 'flex-start' },
            imageView: { borderRadius: w, marginRight: 4 * p, justifyContent: 'flex-start', width: w * 0.1, },
            image: { borderColor: '#D3D3D3', borderWidth: 0.3, borderRadius: w, width: w * 0.1, height: w * 0.1, resizeMode: 'contain' },
            bubbleView: { alignItems: 'flex-end', marginRight: p * 5 },
            chatBubble: { marginRight: 2 * p, marginTop: p, backgroundColor: '#59B990', borderBottomEndRadius: 10, borderTopLeftRadius: 10, borderBottomLeftRadius: 10, padding: 2 * p, maxWidth: w * 0.7 },
            text: { textAlign: 'justify' },
            nameText: { color: '#909090', marginTop: 4 * p, marginRight: 2 * p },
            chatText: { color: '#ffffff', marginHorizontal: p * 2, marginVertical: p }
        });
    }

    constructor(props, context, ...args) {
        super(props, context, ...args);
        this.whp = { w: props.style.width, h: props.style.height, p: props.style.padding };
        this.style = this.createStyleSheet(this.whp);
        this.title = props.title;
        this.image = props.image;
    }

    render() {
        var { w, h, p } = this.whp;
        var style = this.style;
        return (
            <View accessible={true} accessibilityLabel={'RightChatBubbleRootView'} style={style.mainView1}>
                {/* <View shadow shadowIntensity={0.5} style={style.imageView}>
                    <Image style={style.image} source={{ uri: this.props.image }}></Image>
                </View> */}
                <View accessible={true} accessibilityLabel={'RightChatBubbleView1'} style={style.bubbleView}>
                    {/* <Text accessible={true} accessibilityLabel={'RightChatBubbleUserName'} preset={Text.preset.h9B} style={style.nameText}>{SGLocalize.translate('askAliceScreen.Me')}</Text> */}
                    <View accessible={true} accessibilityLabel={'RightChatBubbleUser'} style={style.chatBubble}>
                        <Text accessible={true} accessibilityLabel={'RightChatBubbleAnswer'} preset={Text.preset.titleH4B} style={style.chatText}>{this.props.text}</Text>
                    </View>
                </View>
            </View>
        );
    }
}

export class AskAliceScreen extends SGBaseScreen {

    getRecommendQuestionData() {
        return ([
            { label: SGLocalize.translate('askAliceQuestion.0'), value: 0 },
            { label: SGLocalize.translate('askAliceQuestion.1'), value: 1 },
            { label: SGLocalize.translate('askAliceQuestion.2'), value: 2 },
            { label: SGLocalize.translate('askAliceQuestion.3'), value: 3 },
        ]);
    }

    createStyleSheet = (whp) => {
        var { w, h, p } = whp;
        return StyleSheet.create({
            mainView1: { width: w, height: h, backgroundColor: 'white', justifyContent: 'flex-start', },
            throwWHP: { width: w, padding: p, height: h },
            image: { width: w * 0.2, height: w * 0.2, resizeMode: 'contain', backgroundColor: 'transparent', marginTop: p * 2 },
            containerView1: { width: w, height: w, padding: p, backgroundColor: 'white' },
            containerView3: { width: w, height: h, padding: p },
            ribbonHeader: { marginTop: 0 },
            sv1_2: { justifyContent: "flex-start", alignItems: 'flex-start', paddingBottom: p * 5 },
            locationNameText: {maxWidth:w*0.75, color: '#000000' },
            changeLocationText: { color: '#7ACDEF' },
            header: { width: w, paddingHorizontal: p * 4, flexDirection: 'row', justifyContent: 'space-between', backgroundColor: '#FFFFFF' },
            voiceIcon: { width: w * 0.09, height: w * 0.09, resizeMode: 'contain', backgroundColor: 'transparent', marginVertical: 0, marginTop: p, marginHorizontal: 0 }
        });
    }


    componentWillUnmount() {
        if (this._unsubscribe) { this._unsubscribe(); }
    }

    
    async _onRefreshAllItem() {
        var aliceLocation = await askAliceLastLocationSelectedDAO.getAliceLocation();
        if(aliceLocation.length !==0){
        this.selectedPlace = SGHelperGlobalVar.getVar('GlobalLastSelectedPlace');
        // SGHelperGlobalVar.setVar('GlobalLastSelectedPlace', aliceLocation[0].selectedPlace);
        }
        // this.forceUpdate();
    }

    // function untuk menyiapkan hal-hal yang dibutuhkan untuk menjalankan fungsi tts
    async _setupAliceTTS(){
        this._ttsLanguage = {
            id: { key: ["in-ID", "id-ID"], pitch: 1, volRate: 0.5 },
            en: { key: ["en-US"], pitch: 1, volRate: 0.5 },
            cn: { key: ["zh-CN"], pitch: 1, volRate: 0.5 },
        }
        this.engineIsAvailable = false;
        this.voiceIsAvailable = false;
        this._engines = [];
        this._voices = [];

        // FOR ANDROID
        if(Platform.OS === 'android'){
            //SETUP TTS ENGINE
            this._ttsEngine = 'com.google.android.tts';
            this.engines = await Tts.engines();
            for(var i = 0; i< this.engines.length; i++){
                if(this._ttsEngine === this.engines[i].name){
                    this.engineIsAvailable = true;
                    break;
                }
            }
            //SETUP TTS VOICE
            if(this.engineIsAvailable){ 
                this._voices = await Tts.voices();
                if(this.voiceIsAvailable === false){
                for(var i = 0; i < this._voices.length; i++){
                    console.log(this._ttsLanguage[this.Language].key);
                    if((this._ttsLanguage[this.Language].key).includes(this._voices[i].language)){
                        this.voiceIsAvailable = true;
                        this.selectedVoices = this._voices[i].language;
                        break;
                    }
                }
                // DialogBox.showConfirmation(this._dbID, SGLocalize.translate('askAliceScreen.checkAlertTitle'), 'You are missing google text to speech language for ' + this._ttsLanguage[this.Language].key + ' you want to download it first?','No', () => {  },'Yes', ()=> { Tts.requestInstallData(); this._triggerAliceVoice('question0'); } )
            }
            //SETUP TTS SETTING
            if(this.engineIsAvailable && this.voiceIsAvailable === true){
                Tts.setDefaultLanguage(this.selectedVoices);
                Tts.setDefaultRate(this._ttsLanguage[this.Language].volRate);
                Tts.setDefaultPitch(this._ttsLanguage[this.Language].pitch);
            }
        }
        this.voiceAvailabilityChecked = true;
    }
    //FOR IOS
        if(Platform.OS === 'ios'){
            this.engineIsAvailable = true;
            //SETUP TTS VOICE
            if(this.engineIsAvailable){
                this._voices = await Tts.voices()
                if(this.voiceIsAvailable === false){
                    for(var i = 0; i< this._voices.length; i++){
                        if((this._ttsLanguage[this.Language].key).includes(this._voices[i].language)){
                            this.voiceIsAvailable = true;
                            this.selectedVoices = this._voices[i].language;
                            break;
                        }
                    }
                    if(this.voiceIsAvailable === false){
                        DialogBox.showConfirmation(this._dbID, SGLocalize.translate('askAliceScreen.checkAlertTitle'), SGLocalize.translate('askAliceScreen.MissingGoogleText1') + this._ttsLanguage[this.Language].key + SGLocalize.translate('askAliceScreen.tryDownloadText'),SGLocalize.translate('globalText.no'), () => {  },SGLocalize.translate('globalText.yes'), ()=> { Tts.requestInstallData(); this._triggerAliceVoice('question0'); } )
                    }
                    if(this.voiceIsAvailable === false){
                        Tts.requestInstallData();
                    }
                }
                //SETUP TTS SETTINGS
                if(this.voiceIsAvailable === true){
                    Tts.setDefaultLanguage(this.selectedVoices);
                    Tts.setDefaultRate(this._ttsLanguage[this.Language].volRate);
                    Tts.setDefaultPitch(this._ttsLanguage[this.Language].pitch);
                }
            }
        }
    }

    // function untuk trigger suara alice
    _triggerAliceVoice(type, content){
        if (this.enableAliceVoice) {
            if (type === 'question0') {
                Tts.getInitStatus().then(() => {
                    Tts.stop();
                    if (this.Language === 'en') {
                        Tts.speak('Hi ' + this._name + enJSON.askAliceScreen.firstChat);
                        Tts.speak(enJSON.askAliceScreen.firstQuestion);
                    } else if (this.Language === 'id') {
                        Tts.speak('Hai ' + this._name + idJSON.askAliceScreen.firstChat);
                        Tts.speak(idJSON.askAliceScreen.firstQuestion);
                    } else if (this.Language === 'cn') {
                        Tts.speak('你好 ' + this._name + cnJSON.askAliceScreen.firstChat);
                        Tts.speak(cnJSON.askAliceScreen.firstQuestion);
                        }
                    });
                    }
            if (type === 'question1') {
                if (content === 'WTGo') {
                    Tts.getInitStatus().then(() => {
                    Tts.stop();
                    if (this.Language === 'en') {
                        Tts.speak(enJSON.WTGoQ1.title);
                        } else if (this.Language === 'id') {
                        Tts.speak(idJSON.WTGoQ1.title);
                        } else if (this.Language === 'cn') {
                        Tts.speak(cnJSON.WTGoQ1.title);
                        }
                });
                        }
                        if (content === 'WTEat') {
                            Tts.getInitStatus().then(() => {
                                Tts.stop();
                                if (this.Language === 'en') {
                                    Tts.speak(enJSON.WTEatQ1.title);
                                } else if (this.Language === 'id') {
                                    Tts.speak(idJSON.WTEatQ1.title);
                                } else if (this.Language === 'cn') {
                                    Tts.speak(cnJSON.WTEatQ1.title);
                                }
                            });
                        }
                        if (content === 'CTBuy') {
                            Tts.getInitStatus().then(() => {
                                Tts.stop();
                                if (this.Language === 'en') {
                                    Tts.speak(enJSON.CTBuyQ1.title);
                                } else if (this.Language === 'id') {
                                    Tts.speak(idJSON.CTBuyQ1.title);
                                } else if (this.Language === 'cn') {
                                    Tts.speak(cnJSON.CTBuyQ1.title);
                                }
                            });
                        }
                        if (content === 'WTGift') {
                            Tts.getInitStatus().then(() => {
                                Tts.stop();
                                if (this.Language === 'en') {
                                    Tts.speak(enJSON.WTGiftQ1.title);
                                } else if (this.Language === 'id') {
                                    Tts.speak(idJSON.WTGiftQ1.title);
                                } else if (this.Language === 'cn') {
                                    Tts.speak(cnJSON.WTGiftQ1.title);
                                }
                            });
                        }
                    }
                    if (type === 'question2') {
                        if (content === 'WTGo') {
                            Tts.getInitStatus().then(() => {
                                Tts.stop();
                                if (this.Language === 'en') {
                                    Tts.speak(enJSON.WTGoQ2.title);
                                } else if (this.Language === 'id') {
                                    Tts.speak(idJSON.WTGoQ2.title);
                                } else if (this.Language === 'cn') {
                                    Tts.speak(cnJSON.WTGoQ2.title);
                                }
                            });
                        }
                        if (content === 'WTEat') {
                            Tts.getInitStatus().then(() => {
                                Tts.stop();
                                if (this.Language === 'en') {
                                    Tts.speak(enJSON.WTEatQ2.title);
                                } else if (this.Language === 'id') {
                                    Tts.speak(idJSON.WTEatQ2.title);
                                } else if (this.Language === 'cn') {
                                    Tts.speak(cnJSON.WTEatQ2.title);
                                }
                            });
                        }
                        if (content === 'CTBuy') {
                            Tts.getInitStatus().then(() => {
                                Tts.stop();
                                if (this.Language === 'en') {
                                    Tts.speak(enJSON.CTBuyQ2.title);
                                } else if (this.Language === 'id') {
                                    Tts.speak(idJSON.CTBuyQ2.title);
                                } else if (this.Language === 'cn') {
                                    Tts.speak(cnJSON.CTBuyQ2.title);
                                }
                            });
                        }
                        if (content === 'WTGift') {
                            Tts.getInitStatus().then(() => {
                                Tts.stop();
                                if (this.Language === 'en') {
                                    Tts.speak(enJSON.WTGiftQ2.title);
                                } else if (this.Language === 'id') {
                                    Tts.speak(idJSON.WTGiftQ2.title);
                                } else if (this.Language === 'cn') {
                                    Tts.speak(cnJSON.WTGiftQ2.title);
                                }
                            });
                        }
                    }
                    if (type === 'question3') {
                        if (content === 'WTGo') {
                            Tts.getInitStatus().then(() => {
                                Tts.stop();
                                if (this.Language === 'en') {
                                    Tts.speak(enJSON.WTGoQ3.title);
                                } else if (this.Language === 'id') {
                                    Tts.speak(idJSON.WTGoQ3.title);
                                } else if (this.Language === 'cn') {
                                    Tts.speak(cnJSON.WTGoQ3.title);
                                }
                            });
                        }
                        if (content === 'WTEat') {
                            Tts.getInitStatus().then(() => {
                                Tts.stop();
                                if (this.Language === 'en') {
                                    Tts.speak(enJSON.WTEatQ3.title);
                                } else if (this.Language === 'id') {
                                    Tts.speak(idJSON.WTEatQ3.title);
                                } else if (this.Language === 'cn') {
                                    Tts.speak(cnJSON.WTEatQ3.title);
                                }
                            });
                        }
                        if (content === 'CTBuy') {
                            Tts.getInitStatus().then(() => {
                                Tts.stop();
                                if (this.Language === 'en') {
                                    Tts.speak(enJSON.CTBuyQ3.title);
                                } else if (this.Language === 'id') {
                                    Tts.speak(idJSON.CTBuyQ3.title);
                                } else if (this.Language === 'cn') {
                                    Tts.speak(cnJSON.CTBuyQ3.title);
                                }
                            });
                        }
                        if (content === 'WTGift') {
                            Tts.getInitStatus().then(() => {
                                Tts.stop();
                                if (this.Language === 'en') {
                                    Tts.speak(enJSON.WTGiftQ3.title);
                                } else if (this.Language === 'id') {
                                    Tts.speak(idJSON.WTGiftQ3.title);
                                } else if (this.Language === 'cn') {
                                    Tts.speak(cnJSON.WTGiftQ3.title);
                                }
                            });
                        }
                    }
                    if (type === 'question4') {
                        Tts.getInitStatus().then(() => {
                            Tts.stop();
                            if (this.Language === 'en') {
                                Tts.speak(enJSON.askAliceScreen.aliceResultChat);
                            } else if (this.Language === 'id') {
                                Tts.speak(idJSON.askAliceScreen.aliceResultChat);
                            } else if (this.Language === 'cn') {
                                Tts.speak(cnJSON.askAliceScreen.aliceResultChat);
                            }
                        });
                    }
                }
    }

    // function untuk set on off voice alice
    async _setOnOffAliceVoice(firstTime=false){
        if(this.voiceIsAvailable && this.engineIsAvailable){
            this.userAliceVoiceSetting = await tbSystemParamsDAO.getUserAliceVoiceSetting();
            if(this.firstTimeOpen === false){
                this.newUserAliceVoiceSetting = SGHelperType.copyJSON(this.userAliceVoiceSetting);
                console.log(this.newUserAliceVoiceSetting)
                if (this.userAliceVoiceSetting.fValue === 'Y') {
                        Tts.stop();
                        this.newUserAliceVoiceSetting.fValue = 'N'
                    }
                else if (this.userAliceVoiceSetting.fValue === 'N'){
                        this.newUserAliceVoiceSetting.fValue = 'Y'
                    }
                    // console.log(this.userAliceVoiceSetting)
                    // console.log(this.newUserAliceVoiceSetting.fValue)
                await tbSystemParamsDAO.updateUserAliceVoiceSetting(this.userAliceVoiceSetting, this.newUserAliceVoiceSetting.fValue);
            }
          
            if(this.userAliceVoiceSetting.fValue === 'Y'){
                this.enableAliceVoice = true;
                this.voiceIconURI = image.soundOnBlack[this.imageSetting].url
            }
            else{
                this.enableAliceVoice = false;
                this.voiceIconURI = image.soundOffBlack[this.imageSetting].url
            }
            this.forceUpdate();
        }
        else{
            this.enableAliceVoice = false;
            this.voiceIconURI = image.soundOffBlack[this.imageSetting].url;
            if(this.engineIsAvailable){
                if(this.voiceIsAvailable === false){
                    DialogBox.showWarning(this._dbID, SGLocalize.translate('askAliceScreen.checkAlertTitle'), SGLocalize.translate('askAliceScreen.MissingGoogleText1') + this._ttsLanguage[this.Language].key + SGLocalize.translate('askAliceScreen.MissingGoogleText2'),SGLocalize.translate('globalText.ok'),()=>{}, true )
                }
            }
            
            else{
                DialogBox.showWarning(this._dbID, SGLocalize.translate('askAliceScreen.checkAlertTitle'), SGLocalize.translate('askAliceScreen.MissingGoogleText3'),SGLocalize.translate('globalText.ok'), () => {  },true );
            }
        }
        // if(firstTime)this.forceUpdate();
    }

    async componentDidMount() {
        await this._onRefreshAllItem();
        this._unsubscribe = this.props.navigation.addListener('focus', async() => {
            await this._onRefreshAllItem();
            this.forceUpdate()
        });

        this._unsubscribe = this.props.navigation.addListener('blur', async () => {
            Tts.stop();
        });

        this._name = SGHelperGlobalVar.getVar('GlobalCurrentUserData').fName;
        if(this.firstTimeOpen === true){
            await this._setupAliceTTS();
            await this._setOnOffAliceVoice(this.firstTimeOpen);

            this._triggerAliceVoice('question0');
            this.firstTimeOpen = false;
        };
        this.forceUpdate();
    }

    constructor(props, context, ...args) {
        super(props, context, ...args);
        this.style = this.createStyleSheet(this.WHP);
        this.props.navigation.setOptions({
            headerShown: false
        });
        this.data;
        this.currentUser = SGHelperGlobalVar.getVar('GlobalCurrentUser');
        this.imageSetting = SGHelperGlobalVar.getVar('GlobalImageSetting');
        this.currentUserImage = SGHelperGlobalVar.getVar('GlobalCurrentUserImage');
        this.currentUserCurrency = SGHelperGlobalVar.getVar('GlobalCurrency');
        this._dbID = DialogBox.getDialogBoxID();
        this.selectedPlace = SGHelperGlobalVar.getVar('GlobalLastSelectedPlace');
        this.arrFilter = [
            { name: 'fActive', operator: '=', value: 'Y' },
        ]
        this.arrSortWTEat = [
            { name: 'fActive', operator: '=', value: 'Y' },
        ]
        this.firstTimeOpen = true;
        this.AskAliceAvatar =  SGHelperType.getSystemParamsValue('askAliceAvatar'+this.imageSetting.charAt(0).toUpperCase()+this.imageSetting.slice(1));
    }

    getAllWTGoQ1Choice() {
        var res = [];
        var distinct = [];
        for (var i = 0; i < this.data.length; i++) {
            var acceptJSON = { label: SGLocalize.translate('WTGoQ1.' + (this.data[i].fAnswerQ1).toString()), value: this.data[i].fAnswerQ1 };
            if (!distinct.includes(acceptJSON.value)) {
                distinct.push(acceptJSON.value);
                res.push(acceptJSON);
            }
        }
        return (res);
    }

    getAllWTGoQ2Choice(selectedVal) {
        var res = [];
        var distinct = [];
        for (var i = 0; i < this.data.length; i++) {
            if (this.data[i].fAnswerQ1 === selectedVal) {
                var acceptJSON = { label: SGLocalize.translate('WTGoQ2.' + (this.data[i].fAnswerQ2).toString()), value: this.data[i].fAnswerQ2 };
                if (!distinct.includes(acceptJSON.value)) {
                    distinct.push(acceptJSON.value);
                    res.push(acceptJSON);
                }
            }
        }
        return (res);
    }

    getAllWTGoQ3Choice(selectedVal) {
        var res = [];
        var distinct = [];
        for (var i = 0; i < this.data.length; i++) {
            if (this.data[i].fAnswerQ1 === this.secondQuestion.value && this.data[i].fAnswerQ2 === selectedVal) {
                var acceptJSON = { label: SGLocalize.translate('WTGoQ3.' + (this.data[i].fAnswerQ3).toString()), value: this.data[i].fAnswerQ3 };
                if (!distinct.includes(acceptJSON.value)) {
                    distinct.push(acceptJSON.value);
                    res.push(acceptJSON);
                }
            }
        }
        return (res);
    }

    getAllWTEatQ1Choice() {
        var res = [];
        var distinct = [];
        for (var i = 0; i < this.data.length; i++) {
            var acceptJSON = { label: VisitorHelper.getLocalizeDataFromLookUp('WTEatQ1',(this.data[i].fAnswerQ1).toString(),this.Language.toUpperCase()), value: this.data[i].fAnswerQ1 };
            // var acceptJSON = { label: SGLocalize.translate('WTEatQ1.' + (this.data[i].fAnswerQ1).toString()), value: this.data[i].fAnswerQ1 };
            if (!distinct.includes(acceptJSON.value)) {
                distinct.push(acceptJSON.value);
                res.push(acceptJSON);
            }
        }
        return (res);
    }

    getAllWTEatQ2Choice(selectedVal) {
        var res = [];
        var distinct = [];
        for (var i = 0; i < this.data.length; i++) {
            if (this.data[i].fAnswerQ1 === selectedVal) {
                var acceptJSON = { label: VisitorHelper.getLocalizeDataFromLookUp('WTEatQ2',(this.data[i].fAnswerQ2).toString(),this.Language.toUpperCase()), value: this.data[i].fAnswerQ2 };
                // var acceptJSON = { label: SGLocalize.translate('WTEatQ2.' + (this.data[i].fAnswerQ2).toString()), value: this.data[i].fAnswerQ2 };
                if (!distinct.includes(acceptJSON.value)) {
                    distinct.push(acceptJSON.value);
                    res.push(acceptJSON);
                }
            }
        }
        return (res);
    }

    getAllWTEatQ3Choice(selectedVal) {
        var priceRangeList =
        {
            IDR: { 0: { min: 0.0, max: 50000.0 }, 1: { min: 50000.0, max: 100000.0 }, 2: { min: 100000.0, max: 200000.0 }, 3: { min: 200000.0, max: 500000.0 },  4: { min: 500000.0, max: 1000000000.0 } },
            USD: { 0: { min: 0.0, max: 10.0, }, 1: { min: 10.0, max: 20.0 }, 2: { min: 20.0, max: 30.0 }, 3: { min: 30.0, max: 40.0 }, 4: { min: 40.0, max: 1000000000.0 } },
            CNY: { 0: { min: 0.0, max: 20.0 }, 1: { min: 20.0, max: 40.0 }, 2: { min: 40.0, max: 100.0 }, 3: { min: 100.0, max: 230.0 }, 4: { min: 230.0, max: 1000000000.0 } },
            JPY: { 0: { min: 0.0, max: 370.0 }, 1: { min: 370.0, max: 900.0 }, 2: { min: 900.0, max: 1500.0 }, 3: { min: 1500.0, max: 3800.0 }, 4: { min: 3800.0, max: 1000000000.0 }  },
            KRW: { 0: { min: 0.0, max: 3860.0 }, 1: { min: 3860.0, max: 9300.0 }, 2: { min: 9300.0, max: 15440.0 }, 3: { min: 15440.0, max: 40000.0 }, 4: { min: 40000.0, max: 1000000000.0 } },
            MYR: { 0: { min: 0.0, max: 15.0 }, 1: { min: 15.0, max: 35.0 }, 2: { min: 35.0, max: 60.0 }, 3: { min: 60.0, max: 40000.0 }, 4: { min: 145.0, max: 1000000000.0 } },
            SGD: { 0: { min: 0.0, max: 5.0 }, 1: { min: 5.0, max: 12.0 }, 2: { min: 12.0, max: 20.0 }, 3: { min: 20.0, max: 50.0 }, 4: { min: 50.0, max: 1000000000.0 } },
            AUD: { 0: { min: 0.0, max: 5.0 }, 1: { min: 5.0, max: 12.0 }, 2: { min: 12.0, max: 20.0 }, 3: { min: 20.0, max: 50.0 }, 4: { min: 50.0, max: 1000000000.0 } },
        }
        var res = [];
        var distinct = [];
        var allPriceLang = {id :'Semua Harga',en:'All Price',cn:'所有价格'}
        res.push({label:allPriceLang[this.Language],value:5,currency:this.currentUserCurrency, min:0,max:9999999999999999})
        for (var i = 0; i < this.data.length; i++) {
            if (this.data[i].fAnswerQ1 === this.secondQuestion.value && this.data[i].fAnswerQ2 === selectedVal) {
                var acceptJSON = { label: SGLocalize.translate("WTEatQ3." + (this.data[i].fAnswerQ3).toString(), 
                { min: (VisitorHelper._showPriceText(priceRangeList[this.currentUserCurrency][this.data[i].fAnswerQ3].min)), 
                max: (VisitorHelper._showPriceText(priceRangeList[this.currentUserCurrency][this.data[i].fAnswerQ3].max)), currency: this.currentUserCurrency }), 
                value: this.data[i].fAnswerQ3, currency: this.currentUserCurrency, min: priceRangeList[this.currentUserCurrency][this.data[i].fAnswerQ3].min, max: priceRangeList[this.currentUserCurrency][this.data[i].fAnswerQ3].max, currency: this.currentUserCurrency };
                console.log('alice accept JSON')
                console.log(acceptJSON);
                if (!distinct.includes(acceptJSON.value)) {
                    distinct.push(acceptJSON.value);
                    res.push(acceptJSON);
                }
            }
        }
   
        return (res);
    }

    getAllCTBuyQ1Choice() {
        var res = [];
        var distinct = [];
        for (var i = 0; i < this.data.length; i++) {
            var acceptJSON = { label:  VisitorHelper.getLocalizeDataFromLookUp('CTBuyQ1',(this.data[i].fAnswerQ1).toString(),this.Language.toUpperCase()), value: this.data[i].fAnswerQ1 };
            // var acceptJSON = { label: SGLocalize.translate('CTBuyQ1.' + (this.data[i].fAnswerQ1).toString()), value: this.data[i].fAnswerQ1 };
            if (!distinct.includes(acceptJSON.value)) {
                distinct.push(acceptJSON.value);
                res.push(acceptJSON);
            }
        }
        return (res);
    }

    getAllCTBuyQ1_2Choice() {
        var res = [];
        for (var j = 0; j < this.question1Choice.length; j++) {
            var group = [];
            var distinct = [];
            for (var i = 0; i < this.data.length; i++) {
                var acceptJSON = { label:  VisitorHelper.getLocalizeDataFromLookUp('CTBuyQ1_2',(this.data[i].fAnswerQ2).toString(),this.Language.toUpperCase()), value: this.data[i].fAnswerQ2 };
                // var acceptJSON = { label: SGLocalize.translate('CTBuyQ1_2.' + (this.data[i].fAnswerQ2).toString()), value: this.data[i].fAnswerQ2 };
                if (j === this.data[i].fAnswerQ1 && !distinct.includes(acceptJSON.value)) {
                    distinct.push(acceptJSON.value);
                    group.push(acceptJSON);
                }
            }
            res.push(group);
        }
        return (res);
    }

    getAllCTBuyQ2Choice(selectedVal1, selectedVal2) {
        var res = [];
        var distinct = [];
        //need to use localize from lookup for label
        var allTheme = {id :'Semua Tema',en:'All Theme',cn:'所有主题'}
        res.push({label:allTheme[this.Language],value:-1});
        for (var i = 0; i < this.data.length; i++) {
            if (this.data[i].fAnswerQ1 === selectedVal1 && this.data[i].fAnswerQ2 === selectedVal2) {
                var acceptJSON = { label:  VisitorHelper.getLocalizeDataFromLookUp('CTBuyQ2',(this.data[i].fAnswerQ3).toString(),this.Language.toUpperCase()), value: this.data[i].fAnswerQ3 };
                // var acceptJSON = { label: SGLocalize.translate('CTBuyQ2.' + (this.data[i].fAnswerQ3).toString()), value: this.data[i].fAnswerQ3 };
                if (!distinct.includes(acceptJSON.value)) {
                    distinct.push(acceptJSON.value);
                    res.push(acceptJSON);
                }
            }
        }
        return (res);
    }

    getAllCTBuyQ3Choice(selectedVal) {
        var priceRangeList =
        {
            IDR: { 0: { min: 0.0, max: 150000.0 }, 1: { min: 150000.0, max: 300000.0 }, 2: { min: 300000.0, max: 800000.0 }, 3: { min: 800000.0, max: 2000000.0 } , 4: { min: 2000000.0, max: 5000000.0 },5: { min: 5000000.0, max: 1000000000.0 }},
            USD: { 0: { min: 0.0, max: 20.0, }, 1: { min: 20.0, max: 40.0 }, 2: { min: 40.0, max: 70.0 }, 3: { min: 70.0, max: 145.0 } ,4: { min: 145.0, max: 200.0 },5: { min: 200.0, max: 1000000000.0 }},
            CNY: { 0: { min: 0.0, max: 30.0 }, 1: { min: 30.0, max: 50.0 }, 2: { min: 50.0, max: 100.0 }, 3: { min: 100.0, max: 920.0 } ,4: { min: 920.0, max: 1500.0 },5: { min: 1500.0, max: 1000000000.0 }},
            JPY: { 0: { min: 0.0, max: 1110.0 }, 1: { min: 1110.0, max: 2220.0 }, 2: { min: 2220.0, max: 5915.0 }, 3: { min: 5915.0, max: 15000.0 }, 4: { min: 15000.0, max: 30000.0 },5: { min: 30000.0, max: 1000000000.0 } },
            KRW: { 0: { min: 0.0, max: 11580.0 }, 1: { min: 11580.0, max: 23200.0 }, 2: { min: 23200.0, max: 61800.0 }, 3: { min: 61800.0, max: 160000.0 }, 4: { min: 160000.0, max: 200000.0 },5: { min: 200000.0, max: 1000000000.0 } },
            MYR: { 0: { min: 0.0, max: 45.0 }, 1: { min: 45.0, max: 90.0 }, 2: { min: 90.0, max: 230.0 }, 3: { min: 230.0, max: 580.0 } , 4: { min: 580.0, max: 1000.0 },5: { min: 1000.0, max: 1000000000.0 }},
            SGD: { 0: { min: 0.0, max: 15.0 }, 1: { min: 15.0, max: 30.0 }, 2: { min: 30.0, max: 80.0 }, 3: { min: 80.0, max: 190.0 }, 4: { min: 190.0, max: 300.0 }, 5: { min: 300.0, max: 1000000000.0 } },
            AUD: { 0: { min: 0.0, max: 15.0 }, 1: { min: 15.0, max: 30.0 }, 2: { min: 30.0, max: 80.0 }, 3: { min: 80.0, max: 190.0 }, 4: { min: 190.0, max: 300.0 },5: { min: 300.0, max: 1000000000.0 } },
        }
        var res = [];
        var distinct = [];
        var allPriceLang = {id :'Semua Harga',en:'All Price',cn:'所有价格'}
        res.push({label:allPriceLang[this.Language],value:6,currency:this.currentUserCurrency, min:0,max:9999999999999999})
        for (var i = 0; i < this.data.length; i++) {
            if ((this.data[i].fAnswerQ1 === this.secondQuestion.value && this.data[i].fAnswerQ2 === this.thirdQuestion.value && this.data[i].fAnswerQ3 === selectedVal)||selectedVal===-1) {
                var acceptJSON = { label: SGLocalize.translate("CTBuyQ3." + (this.data[i].fAnswerQ4).toString(), { min: (VisitorHelper._showPriceText(priceRangeList[this.currentUserCurrency][this.data[i].fAnswerQ4].min)), max: (VisitorHelper._showPriceText(priceRangeList[this.currentUserCurrency][this.data[i].fAnswerQ4].max)), currency: this.currentUserCurrency }), value: this.data[i].fAnswerQ4, currency: this.currentUserCurrency, min: priceRangeList[this.currentUserCurrency][this.data[i].fAnswerQ4].min, max: priceRangeList[this.currentUserCurrency][this.data[i].fAnswerQ4].max, currency: this.currentUserCurrency };
                if (!distinct.includes(acceptJSON.value)) {
                    distinct.push(acceptJSON.value);
                    res.push(acceptJSON);
                }
            }
        }
      
        return (res);
    }

    getAllWTGiftQ1Choice() {
        var res = [];
        var distinct = [];
        for (var i = 0; i < this.data.length; i++) {
            var acceptJSON = { label: VisitorHelper.getLocalizeDataFromLookUp('WTGiftQ1',(this.data[i].fAnswerQ1).toString(),this.Language.toUpperCase()), value: this.data[i].fAnswerQ1 };
            // var acceptJSON = { label: SGLocalize.translate('WTGiftQ1.' + (this.data[i].fAnswerQ1).toString()), value: this.data[i].fAnswerQ1 };
            if (!distinct.includes(acceptJSON.value)) {
                distinct.push(acceptJSON.value);
                res.push(acceptJSON);
            }
        }
        return (res);
    }

    getAllWTGiftQ2Choice(selectedVal) {
        var res = [];
        var distinct = [];
        for (var i = 0; i < this.data.length; i++) {
            if (this.data[i].fAnswerQ1 === selectedVal) {
                var acceptJSON = { label: VisitorHelper.getLocalizeDataFromLookUp('WTGiftQ2',(this.data[i].fAnswerQ2).toString(),this.Language.toUpperCase()), value: this.data[i].fAnswerQ2 };
                // var acceptJSON = { label: SGLocalize.translate('WTGiftQ2.' + (this.data[i].fAnswerQ2).toString()), value: this.data[i].fAnswerQ2 };
                if (!distinct.includes(acceptJSON.value)) {
                    distinct.push(acceptJSON.value);
                    res.push(acceptJSON);
                }
            }
        }
        return (res);
    }

    getAllWTGiftQ3Choice(selectedVal) {
        var priceRangeList =
        {
            IDR: { 0: { min: 0.0, max: 200000.0 }, 1: { min: 200000.0, max: 500000.0 }, 2: { min: 500000.0, max: 1000000.0 }, 3: { min: 1000000.0, max: 5000000.0 }, 4: { min: 5000000.0, max: 1000000000.0 } },
            USD: { 0: { min: 0.0, max: 20.0, }, 1: { min: 20.0, max: 30.0 }, 2: { min: 30.0, max: 40.0 }, 3: { min: 40.0, max: 360.0 }, 4: { min: 360.0, max: 1000000000.0 }  },
            CNY: { 0: { min: 0.0, max: 100.0 }, 1: { min: 100.0, max: 230.0 }, 2: { min: 230.0, max: 460.0 }, 3: { min: 460.0, max: 2300.0 }, 4: { min: 2300.0, max: 1000000000.0 }  },
            JPY: { 0: { min: 0.0, max: 1480.0 }, 1: { min: 1480.0, max: 3700.0 }, 2: { min: 3700.0, max: 7400.0 }, 3: { min: 7400.0, max: 38000.0 }, 4: { min: 30000.0, max: 1000000000.0 }  },
            KRW: { 0: { min: 0.0, max: 15450.0 }, 1: { min: 15450.0, max: 38600.0 }, 2: { min: 38600.0, max: 80000.0 }, 3: { min: 80000.0, max: 400000.0 }, 4: { min: 400000.0, max: 1000000000.0 }  },
            MYR: { 0: { min: 0.0, max: 60.0 }, 1: { min: 60.0, max: 145.0 }, 2: { min: 145.0, max: 290.0 }, 3: { min: 290.0, max: 1450.0 }, 4: { min: 1450.0, max: 1000000000.0 }  },
            SGD: { 0: { min: 0.0, max: 20.0 }, 1: { min: 20.0, max: 50.0 }, 2: { min: 50.0, max: 100.0 }, 3: { min: 100.0, max: 475.0 }, 4: { min: 475.0, max: 1000000000.0 }  },
            AUD: { 0: { min: 0.0, max: 20.0 }, 1: { min: 20.0, max: 50.0 }, 2: { min: 50.0, max: 100.0 }, 3: { min: 100.0, max: 470.0 }, 4: { min: 470.0, max: 1000000000.0 }  },
        }
        var res = [];
        var distinct = [];
        var allPriceLang = {id :'Semua Harga',en:'All Price',cn:'所有价格'}
        res.push({label:allPriceLang[this.Language],value:5,currency:this.currentUserCurrency, min:0,max:9999999999999999})
        for (var i = 0; i < this.data.length; i++) {
            if (this.data[i].fAnswerQ1 === this.secondQuestion.value && this.data[i].fAnswerQ2 === selectedVal) {
                var acceptJSON = { label: SGLocalize.translate("WTGiftQ3." + (this.data[i].fAnswerQ3).toString(), { min: (VisitorHelper._showPriceText(priceRangeList[this.currentUserCurrency][this.data[i].fAnswerQ3].min)).toString(), max: (VisitorHelper._showPriceText(priceRangeList[this.currentUserCurrency][this.data[i].fAnswerQ3].max)).toString(), currency: this.currentUserCurrency }), value: this.data[i].fAnswerQ3, currency: this.currentUserCurrency, min: priceRangeList[this.currentUserCurrency][this.data[i].fAnswerQ3].min, max: priceRangeList[this.currentUserCurrency][this.data[i].fAnswerQ3].max, currency: this.currentUserCurrency };
                if (!distinct.includes(acceptJSON.value)) {
                    distinct.push(acceptJSON.value);
                    res.push(acceptJSON);
                }
            }
        }
        return (res);
    }

    async onChoice0Press(choice, type) {
        if (choice.value === 0) {
            this.firstQuestion = choice;
            this.questionType = 'WTGo';
            this._triggerAliceVoice('question1', this.questionType);
            this.baseRunSingleAPIWithRedoOption('searchWTGoWithArrFilter', (async (v1,v2) => { return tbVAliceWTGoAPI.searchWTGoWithArrFilter(v1,v2) }).bind(this, this.arrFilter, []), ((v) => {
                this.data = v
                this.question1Choice = this.getAllWTGoQ1Choice();  
                this.forceUpdate();
            }).bind(this),  null,  SGHelperGlobalVar.getVar("ResponTimes"));
        }
        if (choice.value === 1) {
            if (this.selectedPlace.key !== '') {
                this.firstQuestion = choice;
                this.questionType = 'WTEat';
                this._triggerAliceVoice('question1', this.questionType);
                this.baseRunSingleAPIWithRedoOption('searchWTEatWithArrFilter', (async (v1,v2) => { return tbVAliceWTEatAPI.searchWTEatWithArrFilter(v1,v2) }).bind(this, this.arrFilter, []), ((v) => {
                    this.data = v //await tbVAliceWTEatAPI.searchWTEatWithArrFilter(this.arrFilter, []);
                    this.question1Choice = this.getAllWTEatQ1Choice();
                    this.forceUpdate();
                }).bind(this),  null,  SGHelperGlobalVar.getVar("ResponTimes"));
            }
            else {
                SGHelperNavigation.navigatePush(this.props.navigation, 'AddLocationAskAlice');
                // DialogBox.showFail(this._dbID, SGLocalize.translate('askAliceScreen.checkAlertTitle'), SGLocalize.translate('askAliceScreen.checkAlertText'), 'OK', () => { this.forceUpdate() })
            }
        }
        if (choice.value === 2) {
            if (this.selectedPlace.key !== '') {
                this.firstQuestion = choice;
                this.questionType = 'CTBuy';
                this._triggerAliceVoice('question1', this.questionType);
                this.baseRunSingleAPIWithRedoOption('searchCTBuyWithArrFilter', (async (v1,v2) => { return tbVAliceCTBuyAPI.searchCTBuyWithArrFilter(v1,v2) }).bind(this, this.arrFilter, []), ((v) => {
                    this.data = v//await tbVAliceCTBuyAPI.searchCTBuyWithArrFilter(this.arrFilter, []);
                    this.question1Choice = this.getAllCTBuyQ1Choice();
                    this.question1_2Choice = this.getAllCTBuyQ1_2Choice()
                    this.forceUpdate();
                }).bind(this),  null,  SGHelperGlobalVar.getVar("ResponTimes"));
            }
            else {
                SGHelperNavigation.navigatePush(this.props.navigation, 'AddLocationAskAlice');
                // DialogBox.showFail(this._dbID, SGLocalize.translate('askAliceScreen.checkAlertTitle'), SGLocalize.translate('askAliceScreen.checkAlertText'), 'OK', () => { this.forceUpdate() })
            };
        }
        if (choice.value === 3) {
            if (this.selectedPlace.key !== '') {
                this.firstQuestion = choice;
                this.questionType = 'WTGift';
                this._triggerAliceVoice('question1', this.questionType);
                this.baseRunSingleAPIWithRedoOption('searchWTGiftWithArrFilter', (async (v1,v2) => { return tbVAliceWTGiftAPI.searchWTGiftWithArrFilter(v1,v2) }).bind(this, this.arrFilter, []), ((v) => {
                    this.data =v// await tbVAliceWTGiftAPI.searchWTGiftWithArrFilter(this.arrFilter, []);
                    this.question1Choice = this.getAllWTGiftQ1Choice();
                    this.forceUpdate();
                }).bind(this),  null,  SGHelperGlobalVar.getVar("ResponTimes"));
            }
            else {
                SGHelperNavigation.navigatePush(this.props.navigation, 'AddLocationAskAlice');
                // DialogBox.showFail(this._dbID, SGLocalize.translate('askAliceScreen.checkAlertTitle'), SGLocalize.translate('askAliceScreen.checkAlertText'), 'OK', () => { this.forceUpdate() })
            };

        }
        

        
    }

    onWTGoChoice1Press(choice) {
        this.secondQuestion = choice;
        this.question2Choice = this.getAllWTGoQ2Choice(choice.value);
        this._triggerAliceVoice('question2', this.questionType);
        this.forceUpdate();
    }

    onWTGoChoice2Press(choice) {
        this.question3Choice = this.getAllWTGoQ3Choice(choice.value);
        this.thirdQuestion = choice;
        this._triggerAliceVoice('question3', this.questionType);
        this.forceUpdate();
    }

    onWTGoChoice3Press(choice) {
        this.fourthQuestion = choice;
        this._triggerAliceVoice('question4', this.questionType);
        this.forceUpdate();
    }

    onWTEatChoice1Press(choice) {
        this.secondQuestion = choice;
        this.question2Choice = this.getAllWTEatQ2Choice(choice.value);
        this._triggerAliceVoice('question2', this.questionType);
        this.forceUpdate();
    }

    onWTEatChoice2Press(choice) {
        this.question3Choice = this.getAllWTEatQ3Choice(choice.value);
        this.thirdQuestion = choice;
        this._triggerAliceVoice('question3', this.questionType);
        this.forceUpdate();
    }

    onWTEatChoice3Press(choice) {
        this.fourthQuestion = choice;
        this._triggerAliceVoice('question4', this.questionType);
        this.forceUpdate();
    }

    onCTBuyChoice1Press(choice1, choice2) {
        this.secondQuestion = choice1;
        this.thirdQuestion = choice2;
        this.question2Choice = this.getAllCTBuyQ2Choice(choice1.value, choice2.value);
        this._triggerAliceVoice('question2', this.questionType);
        this.forceUpdate();
    }

    onCTBuyChoice2Press(choice) {
        this.question3Choice = this.getAllCTBuyQ3Choice(choice.value);
        this.fourthQuestion = choice;
        console.log('onCTBuyChoice2Press')
        console.log(this.fourthQuestion);
        this._triggerAliceVoice('question3', this.questionType);
        this.forceUpdate();
    }

    onCTBuyChoice3Press(choice) {
        this.fifthQuestion = choice;
        this._triggerAliceVoice('question4', this.questionType);
        this.forceUpdate();
    }

    onWTGiftChoice1Press(choice) {
        this.secondQuestion = choice;
        this.question2Choice = this.getAllWTGiftQ2Choice(choice.value);
        this._triggerAliceVoice('question2', this.questionType);
        this.forceUpdate();
    }

    onWTGiftChoice2Press(choice) {
        this.question3Choice = this.getAllWTGiftQ3Choice(choice.value);
        this.thirdQuestion = choice;
        this._triggerAliceVoice('question3', this.questionType);
        this.forceUpdate();
    }

    onWTGiftChoice3Press(choice) {
        this.fourthQuestion = choice;
        this.forceUpdate();
    }

    loopingGetValueByPrice(value,arr){
        for(var i=0;i<arr.length;i++){
            if(arr[i].value == value){
                return arr[i];
            }
        }
    }

    generateUserAnswerData() {
        if (this.questionType === 'WTGo') {
            var userAnswer = { visitorType: this.secondQuestion, mainPurpose: this.thirdQuestion, secondaryPurpose: this.fourthQuestion };
        }
        if (this.questionType === 'WTEat') {

            console.log('generateUseranswerData')
            console.log(this.fourthQuestion);
            console.log( this.question3Choice);
            var binerStr = "00000000000000000000000000000000";
            var answer1 = binerStr.substring(0, this.secondQuestion.value) + '1' + binerStr.substring(this.secondQuestion.value + 1);
            var answer2 = binerStr.substring(0, this.thirdQuestion.value) + '1' + binerStr.substring(this.thirdQuestion.value + 1);
            var answer3 = this.loopingGetValueByPrice(this.fourthQuestion.value,this.question3Choice)
            // var answer3 = this.question3Choice[this.fourthQuestion.value];
            var userAnswer = { answer1: answer1, answer2: answer2, answer3: answer3 };
        }
        if (this.questionType === 'CTBuy') {

            console.log('generateUseranswerData')
            console.log(this.fifthQuestion);
            console.log( this.question3Choice);
            console.log('---')
            console.log(this.question3Choice[this.fifthQuestion.value])
            var binerStr = "00000000000000000000000000000000";

            var binerStr = "00000000000000000000000000000000";
            var binerStr128 = "00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000";
            var answer1 = binerStr.substring(0, this.secondQuestion.value) + '1' + binerStr.substring(this.secondQuestion.value + 1);
            var answer2 = binerStr128.substring(0, this.thirdQuestion.value) + '1' + binerStr128.substring(this.thirdQuestion.value + 1);
            var answer3 = this.fourthQuestion.value===-1 ? binerStr :binerStr.substring(0, this.fourthQuestion.value) + '1' + binerStr.substring(this.fourthQuestion.value + 1);
            // var answer4 = this.question3Choice[this.fifthQuestion.value];
            var answer4 = this.loopingGetValueByPrice(this.fifthQuestion.value,this.question3Choice);
            var userAnswer = { answer1: answer1, answer2: answer2, answer3: answer3, answer4: answer4 };
            console.log(userAnswer);
        }
        if (this.questionType === 'WTGift') {
            var binerStr = "00000000000000000000000000000000";
            var answer1 = binerStr.substring(0, this.secondQuestion.value) + '1' + binerStr.substring(this.secondQuestion.value + 1);
            var answer2 = binerStr.substring(0, this.thirdQuestion.value) + '1' + binerStr.substring(this.thirdQuestion.value + 1);
            // var answer3 = this.question3Choice[this.fourthQuestion.value];
            var answer3 = this.loopingGetValueByPrice(this.fourthQuestion.value,this.question3Choice);
            var userAnswer = { answer1: answer1, answer2: answer2, answer3: answer3 };
        }
        return (userAnswer);
    }
    autoNavigate(screen, data) {
        var userAnswerData = data;
        userAnswerData.buildingKey = this.selectedPlace.key;
        SGHelperNavigation.navigatePopPush(this.props.navigation, screen, { userAnswerData: userAnswerData })
        // setTimeout(() => { SGHelperNavigation.navigatePopPush(this.props.navigation, screen, { userAnswerData: userAnswerData }) }, 5000);
    }

    // async setOnOffAliceVoice() {
    //     this.newUserAliceVoiceSetting = SGHelperType.copyJSON(this.userAliceVoiceSetting);
    //     if (this.newUserAliceVoiceSetting.fValue === 'Y') {
    //         Tts.stop();
    //         this.newUserAliceVoiceSetting.fValue = 'N'
    //     }
    //     else {
    //         // FOR ANDROID
    //         if(Platform.OS === 'android'){
    //             this._ttsEngine = 'com.google.android.tts';
    //             this.engineIsAvailable = false;
    //         this._engines = [];
    //         this.engines = await Tts.engines();
    //         for(var i = 0; i< this.engines.length; i++){
    //             if(this._ttsEngine === this.engines[i].name){
    //                 this.engineIsAvailable = true;
    //                 await Tts.setDefaultEngine('com.google.android.tts');
    //                 break;
    //             }
    //         }
    //         if(this.engineIsAvailable === false){
    //             DialogBox.showFail(this._dbID, SGLocalize.translate('askAliceScreen.checkAlertTitle'), 'you dont have google text to speech engine downloaded on your device','okay', () => {  },true );
    //             }
    //             if(this.engineIsAvailable){
    //                 this._voices = [];
    //                 this._voices = await Tts.voices()
    //                 // Tts.voices().then((voices) => {
    //                 this.voiceIsAvailable = false;
    //                 if(this.voiceIsAvailable === false){
    //                     for(var i = 0; i< this._voices.length; i++){
    //                         if(this._ttsLanguage[this.Language].key === this._voices[i].language){
    //                             this.voiceIsAvailable = true;
    //                             break;
    //                         }
    //                     }
    //                     if(this.voiceIsAvailable === false ){
    //                         DialogBox.showConfirmation(this._dbID, SGLocalize.translate('askAliceScreen.checkAlertTitle'), 'You are missing google text to speech language for' + this._ttsLanguage[this.Language].key + ' you want to download it first?','No', () => {  },'Yes', ()=> { Tts.requestInstallData(); this._triggerAliceVoice('question0'); } )
    //                     }
    //                     // if(this.voiceIsAvailable === false){
    //                     //     Tts.requestInstallData();
    //                     // }
    //                 }
    //                 if(this.voiceIsAvailable === true){
    //                     Tts.setDefaultLanguage(this._ttsLanguage[this.Language].key);
    //                     Tts.setDefaultRate(this._ttsLanguage[this.Language].volRate);
    //                     Tts.setDefaultPitch(this._ttsLanguage[this.Language].pitch);
    //                 }
    //             }
    //         }
    //         //FOR IOS
    //     if(Platform.OS === 'ios'){
    //         this.engineIsAvailable = true;
    //         if(this.engineIsAvailable){
    //             this._voices = [];
    //             this._voices = await Tts.voices()
    //             // Tts.voices().then((voices) => {
    //             this.voiceIsAvailable = false;
    //             if(this.voiceIsAvailable === false){
    //                 for(var i = 0; i< this._voices.length; i++){
    //                     if(this._ttsLanguage[this.Language].key === this._voices[i].language){
    //                         this.voiceIsAvailable = true;
    //                         break;
    //                     }
    //                 }
    //                 if(this.voiceIsAvailable === false){
    //                     DialogBox.showConfirmation(this._dbID, SGLocalize.translate('askAliceScreen.checkAlertTitle'), 'You are missing google text to speech language for' + this._ttsLanguage[this.Language].key + ' you want to download it first?','No', () => {  },'Yes', ()=> { Tts.requestInstallData(); this._triggerAliceVoice('question0'); } )
    //                 }
    //                 // if(this.voiceIsAvailable === false){
    //                 //     Tts.requestInstallData();
    //                 // }
    //             }
    //             if(this.voiceIsAvailable === true){
    //                 Tts.setDefaultLanguage(this._ttsLanguage[this.Language].key);
    //                 Tts.setDefaultRate(this._ttsLanguage[this.Language].volRate);
    //                 Tts.setDefaultPitch(this._ttsLanguage[this.Language].pitch);
    //             }
    //         }
    //     }   
    //         this.getUserAliceVoiceSettingArr = [
    //             { name: 'fParams', operator: '=', value: 'userAliceVoiceSetting' },
    //             { name: 'fActive', operator: '=', value: 'Y' }
    //         ]
    //         this.userAliceVoiceSetting = tbSystemParamsDAO.getSystemParamsWithArrFilter(this.getUserAliceVoiceSettingArr, [], null, null, null);
    //         this.enableAliceVoice = this.userAliceVoiceSetting.fValue === 'Y' && this.voiceIsAvailable && this.engineIsAvailable ? true : false;
    //         this.enableAliceVoice === true ?
    //             this.voiceIconURI = image.soundOnBlack[this.imageSetting].url
    //             :
    //             this.voiceIconURI = image.soundOffBlack[this.imageSetting].url
    //         if (this.newUserAliceVoiceSetting.fValue === 'N') {
    //             this.newUserAliceVoiceSetting.fValue = 'Y'
    //         }
    //     }
    //     tbSystemParamsDAO.updateSystemParams(this.userAliceVoiceSetting, this.newUserAliceVoiceSetting.fValue);
    //     this.getUserAliceVoiceSettingArr = [
    //         { name: 'fParams', operator: '=', value: 'userAliceVoiceSetting' },
    //         { name: 'fActive', operator: '=', value: 'Y' }
    //     ]
    //     this.userAliceVoiceSetting = tbSystemParamsDAO.getSystemParamsWithArrFilter(this.getUserAliceVoiceSettingArr, [], null, null, null);
    //     this.enableAliceVoice = this.userAliceVoiceSetting.fValue === 'Y' ? true : false;
    //     this.enableAliceVoice ?
    //         this.voiceIconURI = image.soundOnBlack[this.imageSetting].url
    //         :
    //         this.voiceIconURI = image.soundOffBlack[this.imageSetting].url
    //     this.forceUpdate();
    // }

    render() {
        var { w, h, p } = this.WHP;
        var style = this.style;
        var navigator = this.props.navigation;
        var MainListQuestion = this.getRecommendQuestionData();

        return (
            <RootView dummyStatusBar dummyHeaderBar accessible={true} accessibilityLabel={'AskAliceScreenRootView'} style={style.mainView1}>
                <DialogBox accessible={true} accessibilityLabel={'AskAliceScreenDialogBox'} dialogBoxID={this._dbID} />
                <RibbonHeader imageSetting={this.imageSetting} title={SGLocalize.translate('askAliceScreen.title')}></RibbonHeader>
                <View accessible={true} style={style.header}>
                    <View accessible={true} style={style.leftContainer}>
                        <Image style={style.image} source={{ uri: this.AskAliceAvatar }}></Image>
                        {/* <Icon name={Icon.Icon.robot} preset={Icon.preset.w9} style={{ color: 'black',marginTop:2.1*p }}></Icon> */}
                    </View>
                    <View accessible={true} style={{ alignItems: 'flex-end' }}>
                        <TouchableOpacity onPress={(this._setOnOffAliceVoice.bind(this))}>
                            <Image accessible={true} accessibilityLabel={''} source={{ uri: this.voiceIconURI }} style={style.voiceIcon}></Image>
                        </TouchableOpacity>
                        <Text accessible={true} accessibilityLabel={'AskAliceScreenPlaceName'} style={style.locationNameText} preset={Text.preset.titleH2B} numberOfLines={2}>{this.selectedPlace['placeName' + this.Language.toUpperCase()]}</Text>
                        <Text accessible={true} accessibilityLabel={'AskAliceScreenAddLocation'} style={style.changeLocationText} onPress={() => SGHelperNavigation.navigatePush(this.props.navigation, 'AddLocationAskAlice')} preset={Text.preset.titleH4B}>{SGLocalize.translate('askAliceScreen.changeLocation')}</Text>
                    </View>
                </View>
                <ScrollView dummyFooterBar dummyBottomBar accessible={true} accessibilityLabel={'AskAliceScreenScrollView'} ref='SV1' style={style.scrollView1} onContentSizeChange={() => this.refs.SV1.scrollToEnd()} contentContainerStyle={style.sv1_2}>
                    <LeftChatBubble imageSetting={this.imageSetting} text={SGLocalize.translate('askAliceScreen.firstChat')} style={style.throwWHP}></LeftChatBubble>
                    <LeftChoiceBubble firstQuestion placeID={this.selectedPlace.key} check imageSetting={this.imageSetting} text={SGLocalize.translate('askAliceScreen.firstQuestion')} onChoicePress={this.onChoice0Press.bind(this)} choiceData={MainListQuestion} style={style.throwWHP}></LeftChoiceBubble>
                    {(this.firstQuestion && this.firstQuestion.value === 0) &&
                        <View accessible={true} accessibilityLabel={'AskAliceScreenQuestionRoot'}>
                            <RightChatBubble image={this.currentUserImage} text={this.firstQuestion.label} style={style.throwWHP}></RightChatBubble>
                            <LeftChoiceBubble imageSetting={this.imageSetting} onChoicePress={this.onWTGoChoice1Press.bind(this)} text={SGLocalize.translate('WTGoQ1.title')} choiceData={this.question1Choice} style={style.throwWHP}></LeftChoiceBubble>
                            {(this.secondQuestion) &&
                                <View accessible={true} accessibilityLabel={'AskAliceScreenSecondQuestion'}>
                                    <RightChatBubble image={this.currentUserImage} text={this.secondQuestion.label} style={style.throwWHP}></RightChatBubble>
                                    <LeftChoiceBubble imageSetting={this.imageSetting} onChoicePress={this.onWTGoChoice2Press.bind(this)} text={SGLocalize.translate('WTGoQ2.title')} choiceData={this.question2Choice} style={style.throwWHP}></LeftChoiceBubble>
                                </View>
                            }
                            {(this.thirdQuestion) &&
                                <View accessible={true} accessibilityLabel={'AskAliceScreenThirdQuestion'}>
                                    <RightChatBubble image={this.currentUserImage} text={this.thirdQuestion.label} style={style.throwWHP}></RightChatBubble>
                                    <LeftChoiceBubble imageSetting={this.imageSetting} onChoicePress={this.onWTGoChoice3Press.bind(this)} text={SGLocalize.translate('WTGoQ3.title')} choiceData={this.question3Choice} style={style.throwWHP}></LeftChoiceBubble>
                                </View>
                            }
                            {(this.fourthQuestion) &&
                                <View accessible={true} accessibilityLabel={'AskAliceScreenFourtQuestion'}>
                                    <RightChatBubble image={this.currentUserImage} text={this.fourthQuestion.label} style={style.throwWHP}></RightChatBubble>
                                    <LeftChatBubble imageSetting={this.imageSetting} text={SGLocalize.translate('askAliceScreen.aliceResultChat')} style={style.throwWHP} autoNavigate={this.autoNavigate('WhereToGoResult', this.generateUserAnswerData())}></LeftChatBubble>
                                </View>
                            }
                        </View>
                    }
                    {(this.firstQuestion && this.firstQuestion.value === 1 && this.selectedPlace.key !== '') &&
                        <View accessible={true} accessibilityLabel={'AskAliceScreenQuestionRoot2'}>
                            <RightChatBubble image={this.currentUserImage} text={this.firstQuestion.label} style={style.throwWHP}></RightChatBubble>
                            <LeftChoiceBubble imageSetting={this.imageSetting} onChoicePress={this.onWTEatChoice1Press.bind(this)} text={SGLocalize.translate('WTEatQ1.title')} choiceData={this.question1Choice} style={style.throwWHP}></LeftChoiceBubble>
                            {(this.secondQuestion) &&
                                <View accessible={true} accessibilityLabel={'AskAliceScreenSecondQuestion2'}>
                                    <RightChatBubble image={this.currentUserImage} text={this.secondQuestion.label} style={style.throwWHP}></RightChatBubble>
                                    <LeftChoiceBubble imageSetting={this.imageSetting} onChoicePress={this.onWTEatChoice2Press.bind(this)} text={SGLocalize.translate('WTEatQ2.title')} choiceData={this.question2Choice} style={style.throwWHP}></LeftChoiceBubble>
                                </View>
                            }
                            {(this.thirdQuestion) &&
                                <View accessible={true} accessibilityLabel={'AskAliceScreenThirdQuestion2'}>
                                    <RightChatBubble image={this.currentUserImage} text={this.thirdQuestion.label} style={style.throwWHP}></RightChatBubble>
                                    <LeftChoiceBubble imageSetting={this.imageSetting} onChoicePress={this.onWTEatChoice3Press.bind(this)} text={SGLocalize.translate('WTEatQ3.title')} choiceData={this.question3Choice} style={style.throwWHP}></LeftChoiceBubble>
                                </View>
                            }
                            {(this.fourthQuestion) &&
                                <View accessible={true} accessibilityLabel={'AskAliceScreenFourtQuestion2'}>
                                    <RightChatBubble image={this.currentUserImage} text={this.fourthQuestion.label} style={style.throwWHP}></RightChatBubble>
                                    <LeftChatBubble imageSetting={this.imageSetting} text={SGLocalize.translate('askAliceScreen.aliceResultChat')} style={style.throwWHP} autoNavigate={this.autoNavigate('WhatToEatResult', this.generateUserAnswerData())}></LeftChatBubble>
                                </View>
                            }
                        </View>
                    }

                    {(this.firstQuestion && this.firstQuestion.value === 2 && this.selectedPlace.key !== '') &&
                        <View accessible={true} accessibilityLabel={'AskAliceScreenQuestionRoot3'}>
                            <RightChatBubble image={this.currentUserImage} text={this.firstQuestion.label} style={style.throwWHP}></RightChatBubble>
                            <LeftChoiceBubble imageSetting={this.imageSetting} onChoicePress={this.onCTBuyChoice1Press.bind(this)} text={SGLocalize.translate('CTBuyQ1.title')} choiceData={this.question1Choice} choiceData2={this.question1_2Choice} style={style.throwWHP}></LeftChoiceBubble>
                            {(this.secondQuestion && this.thirdQuestion) &&
                                <View accessible={true} accessibilityLabel={'AskAliceScreenSecondThirdQuestion3'}>
                                    <RightChatBubble image={this.currentUserImage} text={this.secondQuestion.label + ', ' + this.thirdQuestion.label} style={style.throwWHP}></RightChatBubble>
                                    <LeftChoiceBubble imageSetting={this.imageSetting} onChoicePress={this.onCTBuyChoice2Press.bind(this)} text={SGLocalize.translate('CTBuyQ2.title')} choiceData={this.question2Choice} style={style.throwWHP}></LeftChoiceBubble>
                                </View>
                            }
                            {(this.fourthQuestion) &&
                                <View accessible={true} accessibilityLabel={'AskAliceScreenFourtQuestion3'}>
                                    <RightChatBubble image={this.currentUserImage} text={this.fourthQuestion.label} style={style.throwWHP}></RightChatBubble>
                                    <LeftChoiceBubble imageSetting={this.imageSetting} onChoicePress={this.onCTBuyChoice3Press.bind(this)} text={SGLocalize.translate('CTBuyQ3.title')} choiceData={this.question3Choice} style={style.throwWHP}></LeftChoiceBubble>
                                </View>
                            }
                            {(this.fifthQuestion) &&
                                <View accessible={true} accessibilityLabel={'AskAliceScreenFifthQuestion'}>
                                    <RightChatBubble image={this.currentUserImage} text={this.fifthQuestion.label} style={style.throwWHP}></RightChatBubble>
                                    <LeftChatBubble imageSetting={this.imageSetting} text={SGLocalize.translate('askAliceScreen.aliceResultChat')} style={style.throwWHP} autoNavigate={this.autoNavigate('ClothToBuyResult', this.generateUserAnswerData())}></LeftChatBubble>
                                </View>
                            }
                        </View>
                    }
                    {(this.firstQuestion && this.firstQuestion.value === 3 && this.selectedPlace.key !== '') &&
                        <View accessible={true} accessibilityLabel={'AskAliceScreenQuestionRoot4'}>
                            <RightChatBubble image={this.currentUserImage} text={this.firstQuestion.label} style={style.throwWHP}></RightChatBubble>
                            <LeftChoiceBubble imageSetting={this.imageSetting} onChoicePress={this.onWTGiftChoice1Press.bind(this)} text={SGLocalize.translate('WTGiftQ1.title')} choiceData={this.question1Choice} style={style.throwWHP}></LeftChoiceBubble>
                            {(this.secondQuestion) &&
                                <View accessible={true} accessibilityLabel={'AskAliceScreenSecondQuestion4'}>
                                    <RightChatBubble image={this.currentUserImage} text={this.secondQuestion.label} style={style.throwWHP}></RightChatBubble>
                                    <LeftChoiceBubble imageSetting={this.imageSetting} onChoicePress={this.onWTGiftChoice2Press.bind(this)} text={SGLocalize.translate('WTGiftQ2.title')} choiceData={this.question2Choice} style={style.throwWHP}></LeftChoiceBubble>
                                </View>
                            }
                            {(this.thirdQuestion) &&
                                <View accessible={true} accessibilityLabel={'AskAliceScreenThirdQuestion4'}>
                                    <RightChatBubble image={this.currentUserImage} text={this.thirdQuestion.label} style={style.throwWHP}></RightChatBubble>
                                    <LeftChoiceBubble imageSetting={this.imageSetting} onChoicePress={this.onWTGiftChoice3Press.bind(this)} text={SGLocalize.translate('WTGiftQ3.title')} choiceData={this.question3Choice} style={style.throwWHP}></LeftChoiceBubble>
                                </View>
                            }
                            {(this.fourthQuestion) &&
                                <View accessible={true} accessibilityLabel={'AskAliceScreenFourtQuestion4'}>
                                    <RightChatBubble image={this.currentUserImage} text={this.fourthQuestion.label} style={style.throwWHP}></RightChatBubble>
                                    <LeftChatBubble imageSetting={this.imageSetting} text={SGLocalize.translate('askAliceScreen.aliceResultChat')} style={style.throwWHP} autoNavigate={this.autoNavigate('WhatToGiftResult', this.generateUserAnswerData())}></LeftChatBubble>
                                </View>
                            }
                        </View>
                    }
                </ScrollView>
                
                <Animated.View style={{ position: 'absolute', transform: [{ translateY: this._baseAnimY.interpolate({ inputRange: [-1, 0], outputRange: [(SGHelperWindow.getStatusBarHeight() - SGHelperWindow.getHeaderHeight()), SGHelperWindow.getStatusBarHeight()] }) },], height: SGHelperWindow.getHeaderHeight(), width: '100%' }}>
                    <MyMenuBar accessible={true} accessibilityLabel={'HomeScreenHeader'} currentUser={this.currentUser} navigator={this.props.navigation} imageSetting={this.imageSetting} style={style.throwWHP}></MyMenuBar>
                </Animated.View>
                <BottomNavigationContainer accessible={true} currentUser={this.currentUser} navigator={this.props.navigation} style={style.throwWHP} screen={this.props.route.name}></BottomNavigationContainer>
            </RootView>
        );
    }
}