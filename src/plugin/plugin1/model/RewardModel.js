import React from 'react';
import Core from '../../../core/core';


export default class RewardModel extends Core.Model.SGBaseModel {
    static getBlankJSON() {
        return {fID:'',namareward:'', pointneeded:0 , stock:0 ,desc:'', uri:''};
    }
    constructor(ori, cur, changeList) {
        super(RewardModel, ori ? ori : RewardModel.getBlankJSON(), cur, changeList);
    }

    get fID() { return this._getValue('fID'); }
    set fID(val) { this._setValue('fID', val); }
    get namareward() { return this._getValue('namareward'); }
    set namareward(val) { this._setValue('namareward', val); }
    get pointneeded() { return this._getValue('pointneeded'); }
    set pointneeded(val) { this._setValue('pointneeded', val); }
    get stock() { return this._getValue('stock'); }
    set stock(val) { this._setValue('stock', val); }
    get desc() { return this._getValue('desc'); }
    set desc(val) { this._setValue('desc', val); }
    get uri() { return this._getValue('uri'); }
    set uri(val) { this._setValue('uri', val); }
}