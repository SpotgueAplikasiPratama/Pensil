import React from 'react';
import Core from '../../../core/core';


export default class CardModel extends Core.Model.SGBaseModel {
    static getBlankJSON() {
        return {
            fiD:'',
            fBuildingKey:'',
            fCardNameID:'',
            fCardNameEN:'',
            fCardNameCN:'',
            fContentID:{CardName:'',ShortDescription:'', LongDescription:'', TandC:'', StepEarnSelf:'',StepEarnBuilding:'',StepEarnTenant:'',BackGroundImage:[''],ImageSliderBenefit:['']},
            fContentEN:{CardName:'',ShortDescription:'', LongDescription:'', TandC:'', StepEarnSelf:'',StepEarnBuilding:'',StepEarnTenant:'',BackGroundImage:[''],ImageSliderBenefit:['']},
            fContentCN:{CardName:'',ShortDescription:'', LongDescription:'', TandC:'', StepEarnSelf:'',StepEarnBuilding:'',StepEarnTenant:'',BackGroundImage:[''],ImageSliderBenefit:['']},
            fType:{custom:{},default:{}},
            fJSONName:'',
            fJSONNumber:0,
            fJSONValidNumber:0,
            fJSONExpiredDate:'',
            fJSONPoint:0,
            fCardExpiredDays:0,
            fActive: '',
            fCreatedByID:'',
            fCreatedDate:'',
            fLastModifiedByID:'',
            fLastModifiedDate:''
            };
                
    }
    constructor(ori, cur, changeList) {
        super(CardModel, ori ? ori : CardModel.getBlankJSON(), cur, changeList);
    }

    get fID() { return this._getValue('fID'); }
    set fID(val) { this._setValue('fID', val); }
    get fBuildingKey() { return this._getValue('fBuildingKey'); }
    set fBuildingKey(val) { this._setValue('fBuildingKey', val); }
    get fCardNameID() { return this._getValue('fCardNameID'); }
    set fCardNameID(val) { this._setValue('fCardNameID', val); }
    get fCardNameEN() { return this._getValue('fCardNameEN'); }
    set fCardNameEN(val) { this._setValue('fCardNameEN', val); }
    get fCardNameCN() { return this._getValue('fCardNameCN'); }
    set fCardNameCN(val) { this._setValue('fCardNameCN', val); }
    get fContentID() { return this._getValue('fContentID'); }
    set fContentID(val) { this._setValue('fContentID', val); }
    get fContentEN() { return this._getValue('fContentEN'); }
    set fContentEN(val) { this._setValue('fContentEN', val); }
    get fContentCN() { return this._getValue('fContentCN'); }
    set fContentCN(val) { this._setValue('fContentCN', val); }
    get fType() { return this._getValue('fType'); }
    set fType(val) { this._setValue('fType', val); }
    get fJSONName() { return this._getValue('fJSONName'); }
    set fJSONName(val) { this._setValue('fJSONName', val); }
    get fJSONNumber() { return this._getValue('fJSONNumber'); }
    set fJSONNumber(val) { this._setValue('fJSONNumber', val); }
    get fJSONValidNumber() { return this._getValue('fJSONValidNumber'); }
    set fJSONValidNumber(val) { this._setValue('fJSONValidNumber', val); }
    get fJSONExpiredDate() { return this._getValue('fJSONExpiredDate'); }
    set fJSONExpiredDate(val) { this._setValue('fJSONExpiredDate', val); }
    get fJSonPoint() { return this._getValue('fJSonPoint'); }
    set fJSonPoint(val) { this._setValue('fJSonPoint', val); }
    get fCardExpiredDays() { return this._getValue('fCardExpiredDays'); }
    set fCardExpiredDays(val) { this._setValue('fCardExpiredDays', val); }
    get fActive() { return this._getValue('fActive'); }
    set fActive(val) { this._setValue('fActive', val); }
    get fCreatedByID() { return this._getValue('fCreatedByID'); }
    set fCreatedByID(val) { this._setValue('fCreatedByID', val); }
    get fCreatedDate() { return this._getValue('fCreatedDate'); }
    set fCreatedDate(val) { this._setValue('fCreatedDate', val); }
    get fLastModifiedByID() { return this._getValue('fLastModifiedByID'); }
    set fLastModifiedByID(val) { this._setValue('fLastModifiedByID', val); }
    get fLastModifiedDate() { return this._getValue('fLastModifiedDate'); }
    set fLastModifiedDate(val) { this._setValue('fLastModifiedDate', val); }
    get pointexpire() { return this._getValue('pointexpire'); }
    set pointexpire(val) { this._setValue('pointexpire', val); }
}