import React from 'react';
import Core from '../../../core/core';


export default class StudentModel extends Core.Model.SGBaseModel {
    static getBlankJSON() {
        return {nama:'', alamat:'', umur:0 };
    }
    constructor(ori, cur, changeList) {
        super(StudentModel, ori ? ori : StudentModel.getBlankJSON(), cur, changeList);
    }
    get nama() { return this._getValue('nama'); }
    set nama(val) { this._setValue('nama', val); }
    get alamat() { return this._getValue('alamat'); }
    set alamat(val) { this._setValue('alamat', val); }
    get umur() { return this._getValue('umur'); }
    set umur(val) { this._setValue('umur', val); }
}