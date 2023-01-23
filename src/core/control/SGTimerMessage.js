
import React from 'react';
import { TouchableWithoutFeedback, StyleSheet, ScrollView} from 'react-native';
import { SGView as View } from './SGView';
import { SGText as Text } from './SGText';
import { SGBaseControl } from './SGBaseControl';
import { SGHelperGlobalVar, SGHelperType, SGHelperWindow,SGHelperAnimation } from '../helper';
import { SGConfigCore } from '../config/SGConfigCore';

export class SGTimerMessage extends SGBaseControl {
    static _timerMessageList = [];
    static getTimerMessageID() {
        return SGHelperType.getGUID();
    }
    static registerTimerMessage(timerMessageID, callBack){
        SGTimerMessage._timerMessageList[timerMessageID] = {id:timerMessageID,callBack:callBack};
    }
    static removeTimerMessage(timerMessageID){
        delete SGTimerMessage._timerMessageList[timerMessageID];
    }
    static showTimerMessage(timerMessageID, title, msg) {
        if(SGHelperType.isDefined(SGTimerMessage._timerMessageList[timerMessageID])){
            SGTimerMessage._timerMessageList[timerMessageID].callBack(title, msg);
        }
    }
    static showTimerMessageMulti(timerMessageID, title, msg) {
        var lang = SGHelperGlobalVar.getVar('Language');
        if(SGHelperType.isDefined(SGTimerMessage._timerMessageList[timerMessageID])){
            SGTimerMessage._timerMessageList[timerMessageID].callBack(title[lang], msg[lang]);
        }
    }

    createStyleSheet = (whp,bgCol, txCol) => {
        var { w, h, p } = whp;
        var cfg = SGConfigCore.config.SGTimerMessage;
        var w1 = w * cfg.wF;
        var h1 = h * cfg.hF;
        return StyleSheet.create({
            v1: { zIndex: 998, width: w, height: h, position: 'absolute', left: 0, top: 0, },
            to1: { width: w, height: h, },
            v2: { width: '100%', height: '100%', backgroundColor: cfg.bgColorOutside },
            v3: { zIndex: 999, width: w1, height: h1, position: 'absolute', left: (w - w1) / 2, top: h, padding: p, borderRadius: 2 * p, backgroundColor: bgCol },
            v4: { width: w1, height: w1 * 0.1, padding: p, },
            sv1: { width: w1 - 2 * p, height: h1 - w1 * 0.1 - 2 * p, padding: p, },
            sv1_2: { alignItems: 'flex-start', justifyContent: 'flex-start', },
            t1: { fontSize: w * cfg.titleFontF, width: '100%', color: txCol },
            t2: { fontSize: w * cfg.bodyFontF, width: '100%', color: txCol },
        });
    }
    componentWillUnmount() {
        SGTimerMessage.removeTimerMessage(this.props.timerMessageID);
    }
    onAnimateAlpha(cur) {
        this.setState({ currentXYWHA: { ...this.state.currentXYWHA, a: cur.x } });
    }
    onAnimateNonAlpha(cur) {
        this.setState({ currentXYWHA: { ...this.state.currentXYWHA, ...cur } });
    }
    onEndEntry(cur) {
        if (this._animationType === 'alpha') { cur = { a: cur.x }; }
        this.setState({ currentXYWHA: { ...this.state.currentXYWHA, ...cur } });
        this._allowClose = true;
    }
    onEndExit(cur) {
        if (this._animationType === 'alpha') { cur = { a: cur.x }; }
        this.setState({ isVisible: false, currentXYWHA: { ...this.state.currentXYWHA, ...cur } });
    }
    addAnimation(entry) {
        var { w, h, p } = this.whp;
        var cfg = SGConfigCore.config.SGTimerMessage;
        var x1, y1, w1, h1, x2, y2;

        w1 = w * cfg.wF;
        h1 = h * cfg.hF;
        x1 = (w - w1) / 2;
        y1 = h;
        x2 = x1;
        y2 = h - h1;
        if (entry) {
            if (this._animationType === 'slide') {
                this._animID = SGHelperAnimation.addAnimation2D(x1, y1, x2, y2, true, cfg.animationDuration, this.onAnimateNonAlpha.bind(this), this.onEndEntry.bind(this));
                return { x: x1, y: y1, w: w1, h: h1, a: 1 };
            } else if (this._animationType === 'alpha') {
                this._animID = SGHelperAnimation.addAnimation1D(0, 1, false, cfg.animationDuration, this.onAnimateAlpha.bind(this), this.onEndEntry.bind(this));
                return { x: x2, y: y2, w: w1, h: h1, a: 0 };
            } else if (this._animationType === 'scale') {
                this._animID = SGHelperAnimation.addAnimation4D(x2 + w1 / 2, y2 + h1 / 2, 0, 0, x2, y2, w1, h1, false, cfg.animationDuration, this.onAnimateNonAlpha.bind(this), this.onEndEntry.bind(this));
                return { x: x2 + w1 / 2, y: y2 + h1 / 2, w: 0, h: 0, a: 1 };
            } else {
                this._animationType = 'alpha';
                this._animID = SGHelperAnimation.addAnimation1D(0, 1, false, cfg.animationDuration, this.onAnimateAlpha.bind(this), this.onEndEntry.bind(this));
                return { x: x2, y: y2, w: w1, h: h1, a: 0 };
            }
        } else {
            if (this._animationType === 'slide') {
                this._animID = SGHelperAnimation.addAnimation2D(x2, y2, x1, y1, true, cfg.animationDuration, this.onAnimateNonAlpha.bind(this), this.onEndExit.bind(this));
                return { x: x2, y: y2, w: w1, h: h1, a: 1 };
            } else if (this._animationType === 'alpha') {
                this._animID = SGHelperAnimation.addAnimation1D(1, 0, false, cfg.animationDuration, this.onAnimateAlpha.bind(this), this.onEndExit.bind(this));
                return { x: x2, y: y2, w: w1, h: h1, a: 1 };
            } else if (this._animationType === 'scale') {
                this._animID = SGHelperAnimation.addAnimation4D(x2, y2, w1, h1, x2 + w1 / 2, y2 + h1 / 2, 0, 0, false, cfg.animationDuration, this.onAnimateNonAlpha.bind(this), this.onEndExit.bind(this));
                return { x: x2, y: y2, w: w1, h: h1, a: 1 };
            } else {
                this._animationType = 'alpha';
                this._animID = SGHelperAnimation.addAnimation1D(1, 0, false, cfg.animationDuration, this.onAnimateAlpha.bind(this), this.onEndExit.bind(this));
                return { x: x2, y: y2, w: w1, h: h1, a: 1 };
            }
        }
    }
    hideMe() {
        this._allowClose = false;
        for (var i = 0; i < this._timeoutID.length; i++) {
            clearTimeout(this._timeoutID[i]);
        }
        this._timeoutID = [];
        var cur = this.addAnimation(false);
    }
    showMessage(title, msg) {
        this._title = title;
        this._msg = msg;
        this._allowClose = false;
        this._timeoutID.push(setTimeout(() => { this.hideMe() }, this._autoHideDelay));
        var cur = this.addAnimation(true);
        this.setState({ isVisible: true, currentXYWHA: cur });
    }
    constructor(props, context, ...args) {
        super(props, context, ...args);
        this.whp = SGHelperWindow.getWHP();
        this.state = { isVisible: false, currentXYWHA: { x: 0, y: 0, w: 0, h: 0, a: 0 } };
        if (SGHelperType.isDefined(this.props.timerMessageID)) {
            SGTimerMessage.registerTimerMessage(this.props.timerMessageID, this.showMessage.bind(this));
        }
        this._timeoutID = [];
        this._animationType = this.props.animationType ? this.props.animationType : 'slide';
        var cfg = SGConfigCore.config.SGTimerMessage;
        this._autoHideDelay = (SGHelperType.isDefined(this.props.autoHideDelay) ? this.props.autoHideDelay : cfg.timeOut);
        if(SGHelperType.isDefined(this.props.style)){
            this._bgColor = (SGHelperType.isDefined(this.props.style.backgroundColor) ? this.props.style.backgroundColor : cfg.backgroundColor);
            this._txColor = (SGHelperType.isDefined(this.props.style.textColor) ? this.props.style.textColor : cfg.textColor);    
        } else{
            this._bgColor=cfg.backgroundColor;
            this._txColor = cfg.textColor;
        }
        this.style = this.createStyleSheet(this.whp,this._bgColor,this._txColor);
    }
    render() {
        var { w, h, p } = this.whp;
        var style = this.style;
        if (this.state.isVisible) {
            return (
                <View style={style.v1} dontRandomColor>
                    <TouchableWithoutFeedback style={style.to1} onPress={() => { if (this._allowClose) { this.hideMe(); } }}>
                        <View style={style.v2} dontRandomColor></View>
                    </TouchableWithoutFeedback>
                    <View style={{ ...style.v3, opacity:this.state.currentXYWHA.a, left: this.state.currentXYWHA.x, top: this.state.currentXYWHA.y, width: this.state.currentXYWHA.w, height: this.state.currentXYWHA.h}} dontRandomColor>
                        <View style={style.v4} dontRandomColor>
                            <Text style={style.t1}>{this._title}</Text>
                        </View>
                        <ScrollView style={style.sv1} contentContainerStyle={style.sv1_2}>
                            <Text style={style.t2}>{this._msg}</Text>
                        </ScrollView>
                    </View>
                </View>
            );
        } else {
            return null;
        }
    }
}