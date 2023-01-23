// import { RealmDB, tbLookupData as tbLookupRealm } from './RealmDB';
import { SGHelperType, SGHelperDB } from '../../core/helper';
import { SGBaseModel } from '../../core/model/SGBaseModel';
import { SGHelperGlobalVar} from '../../core/helper';

export class tbLookupDAO {

    static refreshLookup(data){
        var arrByGroup = {};
        var arrActiveByGroup = {};
        var arrByKey = {};
        var arrActiveByKey = {};
        for(var i=0;i<data.length;i++){
            if(!SGHelperType.isDefined(arrByGroup[data[i].fGroup])){arrByGroup[data[i].fGroup]=[]}
            arrByGroup[data[i].fGroup].push(data[i]);
            arrByKey[data[i].fLookUpKey] = data[i];
            if(data[i].fActive==='Y'){
                if(!SGHelperType.isDefined(arrActiveByGroup[data[i].fGroup])){arrActiveByGroup[data[i].fGroup]=[]}
                arrActiveByGroup[data[i].fGroup].push(data[i]);
                arrActiveByKey[data[i].fLookUpKey] = data[i];
            }
        }
        if(!SGHelperGlobalVar.isVar('GlobalLookupByGroup')){
            SGHelperGlobalVar.addVar('GlobalLookupByGroup',arrByGroup)
        } else {
            SGHelperGlobalVar.setVar('GlobalLookupByGroup',arrByGroup)
        } 
        if(!SGHelperGlobalVar.isVar('GlobalActiveLookupByGroup')){
            SGHelperGlobalVar.addVar('GlobalActiveLookupByGroup',arrActiveByGroup)
        } else {
            SGHelperGlobalVar.setVar('GlobalActiveLookupByGroup',arrActiveByGroup)
        } 
        if(!SGHelperGlobalVar.isVar('GlobalLookupByKey')){
            SGHelperGlobalVar.addVar('GlobalLookupByKey',arrByKey)
        } else {
            SGHelperGlobalVar.setVar('GlobalLookupByKey',arrByKey)
        } 
        if(!SGHelperGlobalVar.isVar('GlobalActiveLookupByKey')){
            SGHelperGlobalVar.addVar('GlobalActiveLookupByKey',arrActiveByKey)
        } else {
            SGHelperGlobalVar.setVar('GlobalActiveLookupByKey',arrActiveByKey)
        } 
    }

    static getSpecificLookupByGroup(groupName) {
        if(!SGHelperGlobalVar.isVar('GlobalLookupByGroup')){
            return [];
        } else {
            return SGHelperGlobalVar.getVar('GlobalLookupByGroup')[groupName];
        } 
    }

    static getActiveLookUpByGroup(groupName) {
        if(!SGHelperGlobalVar.isVar('GlobalActiveLookupByGroup')){
            return [];
        } else {
            return SGHelperGlobalVar.getVar('GlobalActiveLookupByGroup')[groupName];
        } 
    }

    static getLookUpValue(lookUpKey) {
        if(!SGHelperGlobalVar.isVar('GlobalActiveLookupByKey')){
            return null;
        } else {
            return SGHelperGlobalVar.getVar('GlobalActiveLookupByKey')[lookUpKey];
        } 
    }

}

export class tbLookUpData extends SGBaseModel {
    static getBlankJSON() {
        return { fID: '', fGroup: '', fLookUpKey: '', fValueKey: '', fActive: '', fCreatedBy: '', fCreatedDate: '', fLastModifiedBy: '', fLastModifiedDate: '',fLanguage:'' };
    }
    constructor(ori, cur, changeList) {
        super(tbLookUpData, ori ? ori : tbLookUpData.getBlankJSON(), cur, changeList);
    }
    set fID(val) { this._setValue('fID', val); } get fID() { return this._getValue('fID'); }
    set fGroup(val) { this._setValue('fGroup', val); } get fGroup() { return this._getValue('fGroup'); }
    set fLookUpKey(val) { this._setValue('fLookUpKey', val); } get fLookUpKey() { return this._getValue('fLookUpKey'); }
    set fValueKey(val) { this._setValue('fValueKey', val); } get fValueKey() { return this._getValue('fValueKey'); }
    set fActive(val) { this._setValue('fActive', val); } get fActive() { return this._getValue('fActive'); }
    set fCreatedBy(val) { this._setValue('fCreatedBy', val); } get fCreatedBy() { return this._getValue('fCreatedBy'); }
    set fCreatedDate(val) { this._setValue('fCreatedDate', val); } get fCreatedDate() { return this._getValue('fCreatedDate'); }
    set fLastModifiedBy(val) { this._setValue('fLastModifiedBy', val); } get fLastModifiedBy() { return this._getValue('fLastModifiedBy'); }
    set fLastModifiedDate(val) { this._setValue('fLastModifiedDate', val); } get fLastModifiedDate() { return this._getValue('fLastModifiedDate'); }
    set fLanguage(val) { this._setValue('fLanguage', val); } get fLanguage() { return this._getValue('fLanguage'); }
}