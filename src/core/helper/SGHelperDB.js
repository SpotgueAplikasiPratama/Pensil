/**
* MAG Core Helper for Realm DB modules and function
* wrap Realm DB implementation and hide from MAG UI App
* @format 
* @flow 
* 1. Create Realm DB Modules
* 2. Load Modules and Configuration
* 3. Execute database operation command
*/
import React from 'react';
// import { MMKV } from 'react-native-mmkv';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { dbMode } from '../../../app.json'
import { SGHelperType } from '.';
import DeviceInfo from 'react-native-device-info'
export class SGHelperDB {
    /**
     * change array of JSON filter into string
     * operator 'IN' dan value kasih array 
     * @param {*} arrFilter : JSON in format [{name:'fActive', operator:'=', value:true}, {name:'fCity', operator:'IN', value:['jkt','sby]}, {name:'fName', operator:'CONTAINS', value:'an'}] 
     * {strQuery:'fActive = $0 AND (fCity = $1 OR fCity = $2) AND fName CONTAINS $3', arrParam:[true,'jkt','sby','an']}
     */
    static constructFilter(arrFilter) {
        var str = '';
        var arr = [];
        var count = 0;
        var connector = 'AND'
        //filter data using arrFilter
        for (var i = 0; i < arrFilter.length; i++) {
            if (arrFilter[i].value !== null) {
                if (arrFilter[i].operator === 'IN' && Array.isArray(arrFilter[i].value)) {
                    if (arrFilter[i].value.length > 0) {
                        str = (str === '' ? '(' : str + ' AND (');
                        var str2 = '';
                        for (var j = 0; j < arrFilter[i].value.length; j++) {
                            str2 = (str2 === '' ? '' : str2 + ' OR ') + arrFilter[i].name + ' = $' + count;
                            count++;
                            arr.push(arrFilter[i].value[j]);
                        }
                        str = str + str2 + ')';
                    }
                } else if (arrFilter[i].operator === 'XIN' && Array.isArray(arrFilter[i].value)) {
                    if (arrFilter[i].value.length > 0) {
                        str = (str === '' ? '(' : str + ' AND (');
                        var str2 = '';
                        for (var j = 0; j < arrFilter[i].value.length; j++) {
                            str2 = (str2 === '' ? '' : str2 + ' OR ') + arrFilter[i].name + ' = $' + count;
                            count++;
                            arr.push(arrFilter[i].value[j]);
                        }
                        str = str + str2 + ')';
                    } else {
                        str = (str === '' ? '(1 != 1)' : str + ' AND ( 1 != 1 )');
                    }
                } else if (arrFilter[i].operator === 'INARRAY' && Array.isArray(arrFilter[i].value)) {
                    if (arrFilter[i].value.length > 0) {
                        str = (str === '' ? '(' : str + ' AND (');
                        var str2 = '';
                        for (var j = 0; j < arrFilter[i].value.length; j++) {
                            str2 = (str2 === '' ? '' : str2 + ' OR ') + arrFilter[i].name + ' CONTAINS $' + count;
                            count++;
                            arr.push(arrFilter[i].value[j]);
                        }
                        str = str + str2 + ')';
                    }
                }
                else {
                    str = (str === '' ? '' : str + ' AND ') + arrFilter[i].name + ' ' + arrFilter[i].operator + ' $' + count;
                    count++;
                    arr.push(arrFilter[i].value);
                }
            }
        }
        return { strQuery: str, arrParam: arr };
    }

    /**
     * change array of JSON sort into realm sort array
     * @param {*} arrSort : JSON in format [{name:'fCreatedDate',descending:true, selected:true}, {name:'fName', descending:false, selected:true}, {name:'fTotal', descending:false, selected:false}]
     * [['fCreatedDate',true],['fName',false]]
     */
    static constructSort(arrSort) {
        var sort = [];
        for (var i = 0; i < arrSort.length; i++) {
            if (arrSort[i].selected) {
                if (Array.isArray(arrSort[i].name)) {
                    for (var j = 0; j < arrSort[i].name.length; j++) {
                        sort.push([arrSort[i].name[j], arrSort[i].descending[j]]);
                    }
                } else {
                    sort.push([arrSort[i].name, arrSort[i].descending]);
                }
            }
        }
        return sort;
    }
    static _filtering(data,condition){
        var tempData = JSON.parse(data)
        var arr =[]
        for(var i=0;i<tempData.length;i++){
            var isDatum = true
            for(var j=0;j<condition.length;j++){
               
                if(condition[j].value instanceof Date){
                    
                    if(condition[j].operator ===">="){
                        if(tempData[i][condition[j].name] >= condition[j].value){
                            isDatum=false
                            break;
                        }
                    }else {
                        if(tempData[i][condition[j].name] <= condition[j].value){
                            isDatum=false
                            break;
                        }
                    }
                    
                }
                else {
                    if(tempData[i][condition[j].name]!==condition[j].value){
                        isDatum=false
                        break;
                    }
                }
            }
            if(isDatum)arr.push(tempData[i])
        }
        return arr
    }
    static _filteringDelete(data,condition){
        var tempData = JSON.parse(data)
        var arr =[]
        var isDatum = true
        for(var i=0;i<tempData.length;i++){
            isDatum=true
            for(var j=0;j<condition.length;j++){
                if(tempData[i][condition[j].name]===condition[j].value){
                    isDatum=false
                    break;
                }
            }
            if(isDatum)arr.push(tempData[i])
        }
        return arr
    }
    static async _get(table,condition){
        try {
            if(await DeviceInfo.isEmulator() || dbMode!=='mmkv'){
                
                var value = await AsyncStorage.getItem(table)
     
                if(value !== null) {
                    if(SGHelperType.isDefined(condition)){
                        return  Promise.resolve(this._filtering(value,condition))
                    }
                } 
                if(value===null) return Promise.resolve([])
                return Promise.resolve(JSON.parse(value))
               
            }
            else{
                var value = MMKV.getString(table)
                if(value!==null && SGHelperType.isDefined(value)){
                    if(SGHelperType.isDefined(condition)){
                        return  Promise.resolve(this._filtering(value,condition))
                    }
                }
                if(value===null || !SGHelperType.isDefined(value)) return Promise.resolve([])
                return Promise.resolve(JSON.parse(value))
            }
        } catch (error) {
            console.warn(error)
            return Promise.resolve([])
        }
       
    }
    // static async _getListOf
    static async _delete(table,condition){
        try {
            if(await DeviceInfo.isEmulator() || dbMode!=='mmkv'){
                if(SGHelperType.isDefined(condition)){
                    var value = await AsyncStorage.getItem(table)
                    if(value !== null) {
                        var data = this._filteringDelete(value,condition)
                        if(data.length!==0){
                            try {
                                await AsyncStorage.removeItem(table)
                                return Promise.resolve(this._insert(table,data))
                            } catch (error) {
                                console.warn(error)
                                this._insert(table,JSON.parse(value))
                                return Promise.resolve(this._insert(table,data))
                            }
                            
 
                        }
                    } 
                }   
                await AsyncStorage.removeItem(table)
                return Promise.resolve(true)
            }
            else {
                if(SGHelperType.isDefined(condition)){
                    var value = MMKV.getString(table)
                    if(value!==null && SGHelperType.isDefined(value)) {
                        var data = this._filteringDelete(value,condition)
                        if(data.length!==0){
                            try {
                                MMKV.delete(table)
                                console.log(data)
                                this._insert(table,data)
                            } catch (error) {
                                console.warn(error)
                                this._insert(table,JSON.parse(value))
                            }
                            
 
                        }
                    } 
                }
                MMKV.delete(table)
                return Promise.resolve(true)
            }
        } catch (error) {
            console.warn("delete fail "+ table+" :"+error)
            return Promise.resolve(false)
        }
    }
    static async _insert(table, value){
        try {
            if(await DeviceInfo.isEmulator() || dbMode!=='mmkv'){   
                var isTableExist = await this._get(table)
                if(Array.isArray(value)){
                    for(var i=0;i<value.length;i++){
                        isTableExist.push(value[i])
                    }
                }else{
                    isTableExist.push(value)
                }
                await AsyncStorage.setItem(table, JSON.stringify(isTableExist))
                return Promise.resolve(true)
            }
            else{
                var isTableExist = await this._get(table)
                if(Array.isArray(value)){
                    for(var i=0;i<value.length;i++){
                        isTableExist.push(value[i])
                    }
                }else{
                    isTableExist.push(value)
                }
                MMKV.set(table, JSON.stringify(isTableExist))  
                return Promise.resolve(true)
            }
        } catch (error) {
            console.warn("insert fail "+ table+" :"+error)
            return Promise.resolve(false)
        }
    }
    static async _update(table, value){
        try {
            if(Array.isArray(value)){
                throw ("array is not allowed ")
            }else{
                if(await DeviceInfo.isEmulator() || dbMode!=='mmkv'){   
                    var isTableExist = await this._get(table)
                    if(isTableExist.length===0){
                        await AsyncStorage.setItem(table, JSON.stringify(value))
                    }else {
                        for(var i=0;i<isTableExist.length;i++){
                            if(isTableExist[i].fID === value.fID){
                                var key = Object.keys(value)
                                for(var j =0;j<key.length;j++){
                                    isTableExist[i][key[j]] = value[key[j]]
                                }
                                await AsyncStorage.setItem(table, JSON.stringify(isTableExist))
                                return  Promise.resolve(true)
    
                            }
                        }
                       
                        var keyInsert = Object.keys(value)
                        var keyColumn = Object.keys(isTableExist[0])
    
                        var sameColumn = JSON.stringify(keyInsert) === JSON.stringify(keyColumn)
                        if(sameColumn){
                            isTableExist.push(value)
                            await AsyncStorage.setItem(table, JSON.stringify(isTableExist))
                            return  Promise.resolve(true)
                        }
                        
                        throw new Error ("Something went wrong") 
                    }
                    
                    
                    return Promise.resolve(true)
                }
                else{
                    var isTableExist = await this._get(table)
                    if(isTableExist.length===0){
                        MMKV.set(table, JSON.stringify(value))  
                    }else {
                        for(var i=0;i<isTableExist.length;i++){
                            if(isTableExist[i].fID === value.fID){
                                var key = Object.keys(value)
                                for(var j =0;j<key.length;j++){
                                    isTableExist[i][key[j]] = value[key[j]]
                                }
                                MMKV.set(table, JSON.stringify(isTableExist))  
                                return  Promise.resolve(true)
    
                            }
                        }
                        throw new Error ("Something went wrong") 
                    }
                    return Promise.resolve(true)
                }
            }

        } catch (error) {
            console.warn("insert fail "+ table+" :"+error)
            return Promise.resolve(false)
        }
    }
    static async isKeyExist(key) {
        var keys = [];
        if (await DeviceInfo.isEmulator() || dbMode!=='mmkv') {
            keys = await AsyncStorage.getAllKeys();
        } else {
            keys = MMKV.getAllKeys();
        }
        for (var i = 0; i < keys.length; i++) {
            if (keys[i] === key) { return true; }
        }
        return false;
    }
    static async storeKeyValue(key, value) {
        if (await DeviceInfo.isEmulator() || dbMode!=='mmkv') {
            await AsyncStorage.setItem(key, JSON.stringify(value));
        } else {
            MMKV.set(key, JSON.stringify(value));
        }
    }
    static async getKeyValue(key) {
        if (await SGHelperDB.isKeyExist(key)) {
            if (await DeviceInfo.isEmulator() || dbMode!=='mmkv') {
                return (JSON.parse(await AsyncStorage.getItem(key)));
            } else {
                return (JSON.parse(MMKV.getString(key)));
            }
        } else {
            return null;
        }
    }

}