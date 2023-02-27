/**
* MAG Core BaseControl class for all custom control in the project
* wrap react native React.Component implementation and hide from MAG UI App
* @format 
* @flow 
* 1. Toggle hide/show
* 2. Definable style from selected list
* 3. width and height as relative % from parent component
* 4. link to certain data model object
*/
import React from 'react';
import { SGBaseContainer } from './SGBaseContainer';

export class SGBaseForm extends SGBaseContainer {
    constructor(props, context, ...args) {
        super(props, context, ...args);
    }
    initData(propData) {
        if (propData.GUID !== this._GUID || propData.getRevision() !== this._revision) {
            this._data = propData;
            this._GUID = propData.GUID;
            this._revision = propData.getRevision();
            this.state = { ...this.state, data: this._data };
        }
    }
    setData(fieldName, val) {
        this._data._setValue(fieldName, val);
        this._revision = this._data.getRevision();
        // this.setState({ data: this._data })
    }
    getData(fieldName) {
        var original = this.props.original;
        return original ? this._data._getOriginalValue(fieldName) : this._data._getValue(fieldName);
    }
}