/**
* Spotgue CheckBoxList control class 
* wrap react native checkbox implementation and hide from Spotgue UI App
* inheritance from SGBaseControl
* @format 
* @flow 
* 1. can tick or untick by tapping on box or label part
* 2. hidden true|false
* 3. single true|false
* 4. receive key-title pair in props optionList 
* 5. disabled true|false
* 6. specify numberOfColumns={x}, but must specify style={{width:...}} to work
* 7. stateless true|false
* 8. darkMode true|false
*/

import React from 'react';
import { SGView } from './SGView';
import { SGCheckBox } from './SGCheckBox';
import { SGBaseControl } from './SGBaseControl';
import { SGHelperType } from '../helper/SGHelperType';

export class SGCheckBoxList extends SGBaseControl {
    static preset = {
        default:'default',
        disabled:'disabled',
    }
    static _processData(optionList, value) {
        var val = [].concat(Array.isArray(value) ? value : [value]);
        var res = [];
        for (var i = 0; i < optionList.length; i++) {
            res.push({ index: i, key: optionList[i].key, title: optionList[i].title, selected: val.includes(optionList[i].key) });
        }
        return res;
    }
    constructor(props, context, ...args) {
        super(props, context, ...args);
        this.stateEvt = () => {
            this._data = SGCheckBoxList._processData(this.props.optionList, this.props.value);
            this.state = { data: this._data }
        };
    }
    get Value() {
        var data = this._data;
        var val = [];
        for (var i = 0; i < data.length; i++) {
            if (data[i].selected) {
                val.push(data[i].key);
            }
        }
        return val;
    }
    unCheckAll() {
        for (var i = 0; i < this._data.length; i++) {
            this._data[i].selected = false;
        }
    }
    onPressHandler(index, value) {
        if (this.props.single) { this.unCheckAll(); }
        this._data[index].selected = value;
        if (!this.props.stateless) { super.mySetState({ data: this._data }); }
        if (SGHelperType.isDefined(this.props.onValueChange)) {
            this.props.onValueChange(this.Value);
        }
    }
    initProps() {
        if (super.isPropsNeedInitOrChanged(this.props)) {
            var isDef = SGHelperType.isDefined;
            this.w = !isDef(this.props.style) ? {} : !isDef(this.props.style.width) ? {} : { width: this.props.style.width / (isDef(this.props.numberOfColumns) ? this.props.numberOfColumns : 1) };
            this.dir = !isDef(this.props.style) ? {} : !isDef(this.props.style.width) ? {} : !isDef(this.props.numberOfColumns) ? {} : { flexDirection: 'row' };
        }
    }

    render() {
        this.initProps();
        super.initValue(this.props.value, this.props.stateless, this.stateEvt, this.stateEvt);
        return (
            !this.props.hidden &&
            <SGView accessible={true} accessibilityLabel={'SGCheckBoxListRootView'} hidden={this.props.hidden ? true : false} style={{...this.props.style, width: '100%', justifyContent: 'flex-start', alignItems: 'flex-start', flexWrap: 'wrap', ...this.dir }}>
                {
                    this._data.map((d) => {
                        return (
                            <SGCheckBox darkMode={this.props.darkMode} accessible={true} accessibilityLabel={'SGCheckBoxListItem'} style={this.w} disabled={this.props.disabled ? true : false} key={d.index} preset={this.props.preset} textPreset={this.props.textPreset} title={d.title} value={d.selected} onValueChange={(v) => { this.onPressHandler(d.index, v) }} />
                        )
                    })
                }
            </SGView>
        );
    }
}
