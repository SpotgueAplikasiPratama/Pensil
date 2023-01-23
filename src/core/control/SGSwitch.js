/**
 * wrap react-native switch component with additional behavior
 * 1. apply default style and have preset to choose
 * 2. hidden true|false
 * 3. disabled true|false
 * 4. maintain its state
 * 5. support mappingValue props such as mappingValue={{true:'Y', false:'N'}}
 */

import React from 'react';
import { StyleSheet, Switch, Platform } from 'react-native';
import { SGHelperStyle, SGHelperType } from '../helper';
import { SGBaseControl } from './SGBaseControl';
import { SGView } from './SGView';

export class SGSwitch extends SGBaseControl {
    static preset = {
        default: 'default',
        small: 'small',
        smallVisitor: 'smallVisitor',
        hidden: 'hidden',
    }
    static _presetStyle = StyleSheet.create({
        default: { marginHorizontal: 2, transform: [{ scaleX: 1 }, { scaleY: 1 }] },
        small: { marginHorizontal: 2, transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }] },
        smallVisitor: { marginHorizontal: 2, transform: [{ scaleX: 0.7 }, { scaleY: 0.7 }] },
        hidden: { width: 0, height: 0, overflow: 'hidden', padding: 0, margin: 0, transform: [{ scaleX: 0 }, { scaleY: 0 }] },
    });
    constructor(props, context, ...args) {
        super(props, context, ...args);
    }
    initProps() {
        if (super.isPropsNeedInitOrChanged(this.props)) {
            var myProps;
            if (this.props.hidden) {
                myProps = SGHelperStyle.addStyleProps(this.props, SGSwitch._presetStyle[SGSwitch.preset.hidden], true);
            } else {
                myProps = SGHelperStyle.addStyleProps(this.props, SGSwitch._presetStyle[this.props.preset ? this.props.preset : SGSwitch.preset.default]);
                if (this.props.shadow && !this.props.disabled) {
                    myProps.style = SGHelperStyle.addShadowStyle(myProps.style, this.props.shadowIntensity);
                }
                myProps.trackColor = this.props.trackColor ? this.props.trackColor : this.props.disabled ? { true: SGHelperStyle.color.SGSwitch.GreenDisabled, false: SGHelperStyle.color.SGSwitch.RedDisabled } : { true: SGHelperStyle.color.SGSwitch.Green, false: SGHelperStyle.color.SGSwitch.Red };
                myProps.thumbColor = this.props.thumbColor ? this.props.thumbColor : SGHelperStyle.color.SGSwitch.White;
                myProps.onValueChange = this.onValueChangeHandler.bind(this);
                myProps.ios_backgroundColor = myProps.trackColor.false;
                myProps.disabled = false;
            }
            this.myProps = myProps;
        }
    }
    initValue() {
        if (!this._isValueInit || this.props.stateless || !this._renderBySelf) {
            if (SGHelperType.isDefined(this.props.mappingValue)) {
                this._value = !SGHelperType.isDefined(this.props.value) ? false : (this.props.value === this.props.mappingValue.true ? true : false);
            } else {
                this._value = !SGHelperType.isDefined(this.props.value) ? false : this.props.value;
            }
            this.state = { value: this._value };
            this._isValueInit = true;
        }
        this._renderBySelf = false;
    }

    onValueChangeHandler(val) {
        this._value = val;
        if (!this.props.stateless) { super.mySetState({ value: this._value }); }
        if (this.props.onValueChange) {
            if (SGHelperType.isDefined(this.props.mappingValue)) {
                this.props.onValueChange(val ? this.props.mappingValue.true : this.props.mappingValue.false);
            } else {
                this.props.onValueChange(val);
            }
        }
    }
    render() {
        var { w, h, p } = this._screenWHPNoHeader;
        this.initProps();
        this.initValue();
        return (
            !this.props.hidden &&
            <SGView>
                <Switch accessible={true} accessibilityLabel={'SGSwitchRoot'} {...this.myProps} value={this._value} />
                {
                    this.props.disabled &&
                    <SGView style={{ position: 'absolute', width: w * 0.2, height: w * 0.2, backgroundColor: 'rgba(0,0,0,0)', top: 0, left: 0 }}></SGView>
                }
            </SGView>
        )
    }
}
