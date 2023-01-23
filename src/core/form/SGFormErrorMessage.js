
import React from 'react';
import { SGBaseContainer } from '../container/SGBaseContainer';
import { SGView, SGScrollView, SGText, SGIconButton, SGIcon, SGPopView,SGTouchableOpacity } from '../control';
import { SGHelperType, SGHelperGlobalVar, SGHelperStyle, SGHelperWindow } from '../helper';
import { SGFormErrorMessage as labels } from '../locale/lang.json';

export class SGFormErrorMessage extends SGBaseContainer {
    static preset = {
        default: 'default',
        t1: 't1',
        v1: 'v1',
        b1: 'b1',
    }
    static _isPresetInit = false;
    static _presetPopView = {};
    static _initPresetPopView() {
        var { w, h, p } = SGHelperWindow.getWHPNoHeader();
        SGFormErrorMessage._presetPopView = {
            default: {
                text: { style: { flex: 1, color: 'red',paddingLeft:2*p,marginVertical:2*p }, },
                view: { style: { justifyContent: 'flex-start', alignItems: 'flex-start', borderWidth: 1, backgroundColor: SGHelperStyle.color.popUpBackgroundColor, borderColor: SGHelperStyle.color.borderColor, width: w - 4 * p, height: h * 0.3, borderRadius: 2 * p, padding: p, backgroundColor: 'white' }, },
                iconClose: { style: { marginVertical: 0, paddingVertical: 0, alignSelf: 'center' } },
                iconError: { preset: SGIcon.preset.h5, style: { color: 'red',paddingRight:2*p,marginVertical:2*p } },
                iconCloseFlatTouch:{style:{width:w*0.3,height:w*0.03, marginVertical: 2 * p, borderRadius: 5 * p,alignSelf:'center' }},
                iconCloseFlat: {style:{ backgroundColor: SGHelperStyle.color.SGFormErrorMessage.PVBGBlack, width: w * 0.14, height: w * 0.009,alignSelf:'center'}},
                vt_1: { style:{ alignSelf: 'center', color: SGHelperStyle.color.SGFormErrorMessage.TextBlack, marginBottom: 2 * p, }},
                line:{style:{width: w - 6 * p,borderWidth:0.5}},
            },
            v1: {},
            t1: {},
            b1: {}
        };
    }
    static _initPreset() {
        if (!SGFormErrorMessage._isPresetInit) {
            SGFormErrorMessage._initPresetPopView();
            SGFormErrorMessage._isPresetInit = true;
        }
    }

    constructor(props, context, ...args) {
        super(props, context, ...args);
        SGFormErrorMessage._initPreset();
        this.pvID = this.props.popViewID;
    }

    onHideErrorHandler() {
        SGPopView.hidePopView(this.pvID);
    }

    render() {
        this._errMessage = this.props.errMessage ? this.props.errMessage : [];
        this.labels = labels;
        this._lang = SGHelperType.isDefined(SGHelperGlobalVar.getVar('GlobalLanguage')) ? SGHelperGlobalVar.getVar('GlobalLanguage').toUpperCase() : 'ID';
        var pr = SGHelperType.isDefined(this.props.preset) ? this.props.preset : SGFormErrorMessage.preset.default;
        return (
            <SGPopView accessible={true} accessibilityLabel={'SGFormErrorMessageRootPopView'} popViewID={this.pvID} shadow animationType={'slide'} vPos='bottom'>
                <SGView accessible={true} accessibilityLabel={'SGFormErrorMessageView'} shadow {...SGFormErrorMessage._presetPopView[pr].view}>
                <SGTouchableOpacity {...SGFormErrorMessage._presetPopView[pr].iconCloseFlatTouch} onPress={this.onHideErrorHandler.bind(this)}>
                    <SGView {...SGFormErrorMessage._presetPopView[pr].iconCloseFlat}></SGView>
                </SGTouchableOpacity>
                <SGText preset={SGText.preset.titleH3B} {...SGFormErrorMessage._presetPopView[pr].vt_1}>{this.labels[this._lang].fail}</SGText>
                <SGView accessible={true} accessibilityLabel={'SGFormErrorMessageView'} shadow {...SGFormErrorMessage._presetPopView[pr].line}></SGView>
                    {/* <SGIconButton accessible={true} accessibilityLabel={'SGFormErrorMessageIconButtonArrowDown'} {...SGFormErrorMessage._presetPopView[pr].iconClose} name={SGIcon.Icon.arrowDown} onPress={this.onHideErrorHandler.bind(this)} /> */}
                    <SGScrollView accessible={true} accessibilityLabel={'SGFormErrorMessageScrollView'}>
                        {
                            this._errMessage.map((d) => {
                                return (
                                    <SGView accessible={true} accessibilityLabel={'SGFormErrorMessageGUIDView'} key={SGHelperType.getGUID()} style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'flex-start' }}>
                                         <SGText preset={SGText.preset.titleH3} accessible={true} accessibilityLabel={'SGFormErrorMessageText'} {...SGFormErrorMessage._presetPopView[pr].text}>{d}</SGText>
                                         <SGIcon accessible={true} accessibilityLabel={'SGFormErrorMessageIconError'} {...SGFormErrorMessage._presetPopView[pr].iconError} name={SGIcon.Icon.error} />
                                    </SGView>
                                )
                            })
                        }
                    </SGScrollView>
                </SGView>
            </SGPopView>
        );
    }
}
