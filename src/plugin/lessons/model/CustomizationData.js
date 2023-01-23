import React from 'react';
import Core from '../../core/core';

export default class CustomizationData extends Core.Model.SGBaseModel {
    static getBlankJSON() {
        return { id: '', imageURL: '', title: '', desc: '', price: 0, active: true,};
    }
    constructor(ori, cur, changeList) {
        super(CustomizationData, ori ? ori : CustomizationData.getBlankJSON(), cur, changeList);
    }
    set id(val) { this._setValue('id', val); }
    get id() { return this._getValue('id'); }
    set imageURL(val) { this._setValue('imageURL', val); }
    get imageURL() { return this._getValue('imageURL'); }
    set title(val) { this._setValue('title', val); }
    get title() { return this._getValue('title'); }
    set desc(val) { this._setValue('desc', val); }
    get desc() { return this._getValue('desc'); }
    set price(val) { this._setValue('price', val); }
    get price() { return this._getValue('price'); }
    set active(val) { this._setValue('active', val); }
    get active() { return this._getValue('active'); }
}
