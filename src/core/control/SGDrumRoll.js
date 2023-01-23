/**
 * custom DrumRoll component with behavior
 * 1. apply default style and user can customize style prop
 * 2. user can customize textStyle prop and textPreset prop
 * 3. receive list of key-title in optionList prop
 * 4. hidden true|false
 * 5. shadow true|false
 * 6. disabled true|false
 * 7. value prop
 * 8. onValueChange event
 * 9. stateless true|false (follow value given)
 */

import React from 'react';
import { Platform, ScrollView, StyleSheet } from 'react-native';
import { SGHelperStyle, SGHelperType } from '../helper';
import { SGBaseControl } from './SGBaseControl';
import { SGView } from './SGView';
import { SGText } from './SGText';
import { SGIcon } from './SGIcon';

export class SGDrumRoll extends SGBaseControl {
    initProps() {
        if (super.isPropsNeedInitOrChanged(this.props)) {
            var { w, h, p } = this._screenWHPNoHeader;
            this._w = this.props.style ? (this.props.style.width ? this.props.style.width : w - 4 * p) : w - 4 * p;
            this._h = this.props.style ? (this.props.style.height ? this.props.style.height : w * 0.25) : w * 0.25;
            this._p = p;
            this._itemH = Math.round(this._h / 3);
            this._h = this._itemH * 3;
            var borderR = (this.props.style ? (this.props.style.borderRadius ? this.props.style.borderRadius : 2 * this._p) : 4 * this._p);
            this._style = {
                default: StyleSheet.create({
                    v1: { backgroundColor: SGHelperStyle.color.SGDrumRoll.BGWhite, borderRadius: borderR, },
                    sv1: { flex: 1, alignSelf: 'stretch', },
                    v2: { width: '100%', paddingHorizontal: 2 * p, height: this._itemH, alignItems: this.props.textAlign ? this.props.textAlign : 'center' },
                    t1: { color: SGHelperStyle.color.SGDrumRoll.TextBlack },
                }),
                disabled: StyleSheet.create({
                    v1: { backgroundColor: SGHelperStyle.color.SGDrumRoll.BGDisabled,borderRadius: borderR,  },
                    sv1: { flex: 1, alignSelf: 'stretch', borderRadius: borderR, },
                    v2: { width: '100%', paddingHorizontal: 2 * p, height: this._itemH, alignItems: this.props.textAlign ? this.props.textAlign : 'center' },
                    t1: { color: SGHelperStyle.color.SGDrumRoll.TextDisabled },
                })
            }
        };
    }

    constructor(props, context, ...args) {
        super(props, context, ...args);
        this._y = 0;
        this._dataCount = 0;
        this._ignoreScroll = false;
        this.SV1 = React.createRef();
        this.initStateEvt = () => {
            this._data = this.props.optionList;
            this._selIndex = 0;
            if (SGHelperType.isDefined(this.props.value)) {
                for (var i = 0; i < this._data.length; i++) {
                    this._data[i].index = i;
                    if (this._data[i].key === this.props.value) {
                        this._selIndex = i;
                    }
                }
            }
            this._arrOffset = [];
            for (var i = 0; i < this._data.length + 2; i++) {
                this._arrOffset.push(i * this._itemH);
            }
            var y = this._selIndex * this._itemH;
            if (this._y !== y && SGHelperType.isDefined(this.SV1.current) && this._dataCount === this._data.length) {
                this.forceScroll(y);
            }
            this._dataCount = this._data.length;
            this.state = { selIndex: this._selIndex, data: this._data };
        }
    }
    forceScroll(y) {
        this._ignoreScroll = Platform.OS === 'ios' ? true : false;
        this._y = y;
        this.SV1.current.scrollTo({ y: this._y });
    }
    onContentSizeChangeHandler(width, height) {
        var y = this._selIndex * this._itemH;
        if (this._y !== y) {
            this.forceScroll(y);
        }
    }
    onScrollHandler(v) {
        if (this.props.onRoll) {
            this.props.onRoll(v);
        }
    }
    onScrollEndDragHandler(v) {

    }
    onScrollEndHandler(v) {
        if (!this._ignoreScroll) {
            this._pos = v.nativeEvent.contentOffset.y;
            this._selIndex = Math.round(this._pos / this._itemH);
            this._y = this._selIndex * this._itemH;
            this._value = this._data[this._selIndex].key;
            if (!this.props.stateless) { super.mySetState({ selIndex: this._selIndex }); }
            if (this.props.onValueChange) {
                this.props.onValueChange(this._data[this._selIndex].key);
            }
        }
        this._ignoreScroll = false;
    }
    render() {
        this.initProps();
        super.initValue(this.props.value, this.props.stateless, this.initStateEvt, this.initStateEvt)
        var style = this._style[this.props.disabled ? 'disabled' : 'default'];
        return (
            !this.props.hidden &&
            <SGView accessible={true} accessibilityLabel={'SGDrumRollRootView'} style={[style.v1, this.props.style]} shadow={this.props.shadow} shadowIntensity={this.props.shadowIntensity} disabled={this.props.disabled} hidden={this.props.hidden} >
                <ScrollView accessible={true} accessibilityLabel={'SGDrumRollScrollView'} ref={this.SV1} scrollEnabled={this.props.disabled ? false : true} style={style.sv1} onContentSizeChange={this.onContentSizeChangeHandler.bind(this)} scrollEventThrottle={100} onScroll={this.onScrollHandler.bind(this)} onScrollEndDrag={this.onScrollEndDragHandler.bind(this)} onMomentumScrollEnd={this.onScrollEndHandler.bind(this)} decelerationRate={0.9} showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false} snapToOffsets={this._arrOffset}>
                    <SGView accessible={true} accessibilityLabel={'SGDrumRollContentView'} style={style.v2}></SGView>
                    {
                        this._data.map((d, i) => {
                            return (
                                <SGView accessible={true} accessibilityLabel={'SGDrumRollTextView'} style={style.v2} key={d.index}>
                                    <SGText accessible={true} accessibilityLabel={'SGDrumRollTitle'} preset={this._selIndex === i ? (this.props.selectedTextPreset ? this.props.selectedTextPreset : SGText.preset.titleH2) : (this.props.textPreset ? this.props.textPreset : SGText.preset.titleH3)} style={[style.t1, this.props.textStyle]}>{d.title}</SGText>
                                </SGView>
                            )
                        })
                    }
                    <SGView accessible={true} accessibilityLabel={'SGDrumRollStyleView'} style={style.v2}></SGView>
                </ScrollView>
            </SGView>
        );
    }
}
