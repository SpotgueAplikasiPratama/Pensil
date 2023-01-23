import React from 'react';
import { SGView, SGButton, SGPopView, SGText } from '../control';
import { SGBaseContainer } from '../container/SGBaseContainer';
import { SGHelperType, SGHelperGlobalVar, SGHelperStyle, SGHelperWindow } from '../helper';
import { SGFormErrorMessage } from './SGFormErrorMessage';
import Theme from '../asset/Theme'
//buat SGPopMessage show message with timer to auto close, preset message type and appropriate icon

export class SGFormButton extends SGBaseContainer {
    static preset = {
        default: 'default',
        t1: 't1',
        t2: 't2',
        t3: 't3',
        tblue:'tblue',
        tred:'tred',
        tgreen:'tgreen',
        v1: 'v1',
        v2: 'v2',
        v3:'v3',
        b1: 'b1',
        b2: 'b2',
        b2_red: 'b2_red',
        b2_green: 'b2_green',
        t3_h3B: 't3_h3B',
        auctionButton:'auctionButton'

    }
    static _isPresetInit = false;
    static _presetView = {};
    static _initPresetView() {
        var { w, h, p } = SGHelperWindow.getWHPNoHeader();
        SGFormButton._presetView = {
            default: {
                style: { width: w - 4 * p, padding: p, marginTop: 2 * p, backgroundColor: 'white', flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', flexWrap: 'wrap' },
            },
            v1: {
                style: { backgroundColor: 'transparent' }
            },
            v2: { backgroundColor: "transparent" },
            default: {
                style: { width: w - 4 * p, padding: p, marginTop: 2 * p, backgroundColor: 'white', flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', flexWrap: 'wrap' },
            },
            t1: {
                style: { backgroundColor: 'white' },
            },
            t2: {
                style: { backgroundColor: 'white' },
            },
            t3: {
                style: { backgroundColor: 'white' },
            },
            tblue: {
                style: { backgroundColor: 'white' },
            },
            tgreen: {
                style: { backgroundColor: 'white' },
            },
            tred: {
                style: { backgroundColor: 'white' },
            },
            b1: {},
            b2_red: {},
            b2_green: {},
            t3_h3B: {
                style: { backgroundColor: 'white' },
            },
            auctionButton: {
                style: { backgroundColor: 'transparent',alignSelf:'flex-end' }
            },
        };
    }
    static _presetButton = {};
    static _initPresetButton() {
        var { w, h, p } = SGHelperWindow.getWHPNoHeader();
        SGFormButton._presetButton = {
            default: {
                style: { borderWidth: 0, width: w * 0.8 - 4 * p, marginHorizontal: 0, padding: 0, minHeight: w * 0.1, alignItems: 'center' },
                textPreset: SGText.preset.titleH3,
                textStyle: {},
            },
            v1: {
                style: { width: w * 0.3, minHeight: w * 0.115, alignItems: 'center', justifyContent: 'center', backgroundColor: SGHelperStyle.color.SGButton.Green, marginBottom: 2 * p, borderRadius: 4 * p, },
                textPreset: SGText.preset.titleH3B,
                textStyle: {}
            }
            ,
            v2: {
                style: { width: w * 0.4, minHeight: w * 0.115, alignItems: 'center', justifyContent: 'center', backgroundColor: "red", marginBottom: 2 * p, borderRadius: 8 * p, },
                textPreset: SGText.preset.titleH3,
                textStyle: {}
            },
            v3: {
                style: {  backgroundColor: '#465056', marginTop: w * 0.05, width: w * 0.675, height: w * 0.125, justifyContent: "center", alignSelf: "center", alignItems: "center", borderRadius: p * 10  },
                textPreset: SGText.preset.titleH3,
                textStyle: {},
            },
            t1: {
                style: { borderWidth: 0, width: (w - 2 * p) * 0.4, borderRadius: 3 * p, marginHorizontal: 0, padding: 0, minHeight: w * 0.1, alignItems: 'center', justifyContent: 'center', backgroundColor: "#1DB482" },
                textPreset: SGText.preset.titleH3,
                textStyle: {},
            },
            t2: {
                style: { borderWidth: 0, width: (w - 2 * p) * 0.3, borderRadius: 3 * p, marginHorizontal: 0, padding: 0, minHeight: w * 0.1, alignItems: 'center', justifyContent: 'center', backgroundColor: "#1DB482" },
                textPreset: SGText.preset.titleH3,
                textStyle: {},
            },
            t3: {
                style: { backgroundColor: '#465056', marginTop: 5 * p, width: w * 0.45, height: w * 0.125, justifyContent: "center", alignSelf: "center", alignItems: "center", borderRadius: p * 10 },
                textPreset: SGText.preset.titleH3,
                textStyle: {},
            },
            tblue: {
                style: { borderWidth: 0, width: (w - 2 * p) * 0.3, borderRadius: 6 * p, marginHorizontal: 0, padding: 0, minHeight: w * 0.1, alignItems: 'center', justifyContent: 'center',  borderColor: 'rgb(62,148,220)', backgroundColor: 'rgb(62,148,220)' },
                textPreset: SGText.preset.titleH3,
                textStyle: {},
            },
            tred: {
                style: { borderWidth: 0, width: (w - 2 * p) * 0.3, borderRadius: 6 * p, marginHorizontal: 0, padding: 0, minHeight: w * 0.1, alignItems: 'center', justifyContent: 'center',  borderColor: 'rgb(230,77,77)', backgroundColor: 'rgb(230,77,77)' },
                textPreset: SGText.preset.titleH3,
                textStyle: {},
            },
            tgreen: {
                style: { borderWidth: 0, width: (w - 2 * p) * 0.3, borderRadius: 6 * p, marginHorizontal: 0, padding: 0, minHeight: w * 0.1, alignItems: 'center', justifyContent: 'center',   borderColor: 'rgb(56,188,140)',backgroundColor: 'rgb(56,188,140)'},
                textPreset: SGText.preset.titleH3,
                textStyle: {},
            },
            b1: {
                style: { width: w * 0.5, borderRadius: 3 * p, backgroundColor: '#1DB482', alignItems: 'center' },
                textPreset: SGText.preset.titleH3,
                textStyle: {},
            },
            b2: {
                style: { alignItems: 'center', width: w * 0.35, backgroundColor: Theme.primaryColor },
                textPreset: SGText.preset.titleH3,
                textStyle: {},
            },
            b2_red: {
                style: { width: w * 0.4, borderRadius: 3 * p, backgroundColor: SGHelperStyle.color.ButtonGrey, alignItems: 'center' },
                textPreset: SGText.preset.titleH3,
                textStyle: {},
            },
            b2_green: {
                style: { width: w * 0.4, borderRadius: 3 * p, backgroundColor: SGHelperStyle.color.ButtonGreen, alignItems: 'center' },
                textPreset: SGText.preset.titleH3,
                textStyle: {},
            },
            t3_h3B: {
                style: { backgroundColor: '#465056', marginTop: 5 * p, width: w * 0.45, height: w * 0.125, justifyContent: "center", alignSelf: "center", alignItems: "center", borderRadius: p * 10 },
                textPreset: SGText.preset.titleH3B,
                textStyle: {},
            },
            auctionButton: {
                style: { width: w * 0.35, marginHorizontal: 0, padding: 0, minHeight: w * 0.12, alignItems: 'center', justifyContent: 'center', backgroundColor: SGHelperStyle.color.SGButton.Green,  borderRadius: 4 * p, },
                textPreset: SGText.preset.titleH3B_C,
                textStyle: {},
            },
        };
    }

    static _initPreset() {
        if (!SGFormButton._isPresetInit) {
            SGFormButton._initPresetView();
            SGFormButton._initPresetButton();
            SGFormButton._isPresetInit = true;
        }
    }

    validateData() {
        var OK = true;
        this._errMessage = [];
        if (SGHelperType.isDefined(this.props.data)) {
            if(this.props.validatorOff){
                return OK
            }
            var res = this.props.data.validate();
            for (var i = 0; i < res.length; i++) {
                if (!res[i].isValid) {
                    OK = false;
                    this._errMessage.push(res[i].errMessage);
                }
            }
        }
        return OK;
    }

    constructor(props, context, ...args) {
        super(props, context, ...args);
        SGFormButton._initPreset();
        this.pvID = SGPopView.getPopViewID();
        this._errMessage = [];
        this.state = { errMessage: this._errMessage };
    }

    onPressHandler(v) {
        if (!this.validateData()) {
            this.setState({ errMessage: this._errMessage })
            SGPopView.showPopView(this.pvID);
        } else {
            if (this.props.onPress) {
                this.props.onPress();
            }
        }
    }
    render() {
        var disabled = this.props.disabled;
        var hidden = this.props.hidden;
        var buttonProp = { label: this.props.label, shadow: this.props.shadow, shadowIntensity: this.props.shadowIntensity, disabled: this.props.disabled };
        var pr = SGHelperType.isDefined(this.props.preset) ? this.props.preset : SGFormButton.preset.default;
        return (
            <SGView accessible={true} accessibilityLabel={'SGFormButtonRootView'} hidden={hidden} {...SGFormButton._presetView[pr]}>
                <SGButton accessible={true} accessibilityLabel={'SGFormButton2'} {...buttonProp}  {...SGFormButton._presetButton[pr]} onPress={this.onPressHandler.bind(this)} />
                <SGFormErrorMessage accessible={true} accessibilityLabel={'SGFormButtonErrorMessage'} preset={SGFormErrorMessage.preset.default} popViewID={this.pvID} errMessage={this._errMessage} />
            </SGView>
        );
    }
} 
