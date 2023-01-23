/**
 * 
* Spotgue Core Helper for helping with type check, conversion, and formatting
*/
/**
 * Version 1.2.0
 * 1. Yohanes, 16 Maret 2021
 *  - change Threshold to 0.1
 * Version 1.1.0
 * 1. Yohanes, 3 Maret 2021
 *  - Add getPaging function, return 20
 *  - delete function log
 * 2. Yohanes, 5 Maret 2021
 *  - Add paging Threshold
 */
 import * as RNLocalize from 'react-native-localize';
 import { string } from 'prop-types';
 import { keyEncrypt } from '../../../app.json'
 
 import CryptoJS from 'crypto-js';
 import { Platform } from 'react-native';
 import {SGHelperGlobalVar} from '.'
 import {mode } from './../../../app.json'
 import {SGLocalize} from '../../visitor/locales/SGLocalize'
 export class SGHelperType {
     /**
      * list of available regex pattern available for each string type
      */
     static regexType = {
         alpha: /^[a-zA-Z]+$/,
         alphanumeric: /^[a-zA-Z0-9]+$/,
         email: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
         password: /^[a-zA-Z0-9]\w{7,15}$/, //min 8 max 16 consist letter number and underscore
         zipCodeID: /^\d{5}$/, //5 digit angka
         //may not be used when passing original numeric value instead of string
         number: /^(\+|-)?\d+$/, //signed number
         decimal: /^[-+]?\d*\.?\d*$/, //signed floating point
         currency: /^[0-9]+?(\.[0-9]?[0-9])?$/, //amount with 2 decimal point
         //may not be used when passing original date value instead of string
         date: /^((((31\/(0?[13578]|1[02]))|((29|30)\/(0?[1,3-9]|1[0-2])))\/(1[6-9]|[2-9]\d)?\d{2})|(29\/0?2\/(((1[6-9]|[2-9]\d)?(0[48]|[2468][048]|[13579][26])|((16|[2468][048]|[3579][26])00))))|(0?[1-9]|1\d|2[0-8])\/((0?[1-9])|(1[0-2]))\/((1[6-9]|[2-9]\d)?\d{2}))$/, // date time dd/mm/yyyy
         datetime: /^((((31\/(0?[13578]|1[02]))|((29|30)\/(0?[1,3-9]|1[0-2])))\/(1[6-9]|[2-9]\d)?\d{2})|(29\/0?2\/(((1[6-9]|[2-9]\d)?(0[48]|[2468][048]|[13579][26])|((16|[2468][048]|[3579][26])00))))|(0?[1-9]|1\d|2[0-8])\/((0?[1-9])|(1[0-2]))\/((1[6-9]|[2-9]\d)?\d{2})) (20|21|22|23|[0-1]?\d):[0-5]?\d:[0-5]?\d$/, // date time dd/mm/yyyy hh:mm:ss
         time: /^([0-1][0-9]|[2][0-3]):([0-5][0-9])$/, //time in hh:mm (24 hour format)
         utc: /^\d{4}-(?:0[1-9]|1[0-2])-(?:0[1-9]|[1-2]\d|3[0-1])T(?:[0-1]\d|2[0-3]):[0-5]\d:[0-5]\d(?:\.\d+|)(?:Z|(?:\+|\-)(?:\d{2}):?(?:\d{2}))$/,
         phone: /^(\+)?[0-9]{5,16}$/, //phone number
         phoneOrEmail: /^(\+)?[0-9]{5,16}|(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, //phone or email
     }
 
     /**
      * list of available predefined string type for regex testing
      */
     static stringType = {
         string: 'string',
         alpha: 'alpha',
         alphanumeric: 'alphanumeric',
         email: 'email',
         password: 'password',
         zipCodeID: 'zipCodeID',
         number: 'number',
         decimal: 'decimal',
         currency: 'currency',
         date: 'date',
         datetime: 'datetime',
         time: 'time',
         phone: 'phone',
         phoneOrEmail: 'phoneOrEmail',
     }
     /**
      * check if value is following alphabet regex pattern (only letter allowed)
      * @param {*} val 
      */
     static isAlpha(val) {
         return SGHelperType._testRegex(SGHelperType.stringType.alpha, val);
     }
     /**
      * check if value is following alphanumeric regex pattern (only letter and number allowed)
      * @param {*} val 
      */
 
     static  validURL(str) {
         var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
           '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
           '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
           '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
           '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
           '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
         return !!pattern.test(str);
     }
     
     static isAlphaNumeric(val) {
         return SGHelperType._testRegex(SGHelperType.stringType.alphanumeric, val);
     }
     /**
      * check if value is following email regex pattern
      * @param {*} val 
      */
     static isEmail(val) {
         return SGHelperType._testRegex(SGHelperType.stringType.email, val);
     }
     /**
      * check if value is following strong password regex pattern (8-16 digit with letter, number, and underscore allowed)
      * @param {*} val 
      */
     static isPassword(val) {
         return SGHelperType._testRegex(SGHelperType.stringType.password, val);
     }
 
     static isPhone(val) {
         return SGHelperType._testRegex(SGHelperType.stringType.phone, val);
     }
     /**
     * check if value is following Indonesia Zip Code regex pattern (5 digit number)
     * @param {*} val 
     */
     static isZipCodeID(val) {
         return SGHelperType._testRegex(SGHelperType.stringType.zipCodeID, val);
     }
     /**
     * check if value is following signed integer regex pattern (no decimal point)
     * @param {*} val 
     */
     static isNumber(val) {
         return SGHelperType._testRegex(SGHelperType.stringType.number, val);
     }
     /**
     * check if value is following signed decimal regex pattern
     * @param {*} val 
     */
     static isDecimal(val) {
         return SGHelperType._testRegex(SGHelperType.stringType.decimal, val);
     }
     /**
     * check if value is following currency regex pattern (2 decimal point) but without thousand separator
     * @param {*} val 
     */
     static isCurrency(val) {
         return SGHelperType._testRegex(SGHelperType.stringType.currency, val);
     }
     /**
      * check if value is following date dd/mm/yyyy regex pattern
      * @param {*} val 
      */
     static isDate(val) {
         return SGHelperType._testRegex(SGHelperType.stringType.date, val);
     }
     /**
      * check if value is following date time dd/mm/yyyy hh:mm:ss regex pattern
      * @param {*} val 
      */
     static isDateTime(val) {
         return SGHelperType._testRegex(SGHelperType.stringType.datetime, val);
     }
     /**
      * check if value is following time hh:mm:ss regex pattern
      * @param {*} val 
      */
     static isTime(val) {
         return SGHelperType._testRegex(SGHelperType.stringType.time, val);
     }
     /**
      * check if the value passed is not null and not undefined
      * @param {*} val 
      */
     static isDefined(val) {
         return !(val === null || typeof (val) === 'undefined');
     }
     /**
      * convert string time hh:mm:ss into number of seconds
      * @param {string} strTime 
      */
     static timeToSecond(tm) {
         if (!SGHelperType.isDefined(tm)) { return 0 };
         var dtTm = tm instanceof Date ? tm : SGHelperType._testRegex('utc', tm) ? SGHelperType.dateValue(tm) : new Date(1900, 0, 1, ...tm.split(':'));
         var arr = [dtTm.getHours(), dtTm.getMinutes(), dtTm.getSeconds()];
         return arr[0] * 3600 + arr[1] * 60 + (SGHelperType.isDefined(arr[2]) ? arr[2] : 0);
     }
     /**
      * get locale setup for decimal separator (usually , or .)
      */
     static getDecimalSeparator() {
         return RNLocalize.getNumberFormatSettings().decimalSeparator;
     }
     /**
      * get locale setup for thousand separator (usually , or .)
      */
     static getThousandSeparator() {
         return RNLocalize.getNumberFormatSettings().groupingSeparator;
     }
     /**
      * remove thousand separator in a formatted currency
      * @param {string} strVal 
      */
     static removeThousandSeparator(strVal) {
         var regex = SGHelperType.getThousandSeparator() === '.' ? /\./gi : /,/gi;
         return strVal.replace(regex, '');
     }
     /**
      * add thousand separator in a currency
      * @param {string} strVal 
      */
     static addThousandSeparator(strVal) {
         var arr = strVal.split(SGHelperType.getDecimalSeparator());
         return arr[0].replace(/\B(?=(\d{3})+(?!\d))/g, SGHelperType.getThousandSeparator()) + (SGHelperType.isDefined(arr[1]) ? SGHelperType.getDecimalSeparator() + arr[1] : '');
     }
     /**
      * remove all currency formatting and convert to decimal
      * @param {string} strVal 
      */
     static normalizeCurrency(strVal) {
         var str = SGHelperType.removeThousandSeparator(strVal);
         if (SGHelperType.getDecimalSeparator() === ',') {
             return str.replace(/,/gi, '.');
         } else {
             return str;
         }
     }
     /**
      * format currency value into thousand separated following locale
      * @param {string} strVal 
      */
     static localizeCurrency(strVal) {
         var str = typeof strVal === 'string' ? strVal : String(strVal);
         if (SGHelperType.getDecimalSeparator() === ',') {
             str = str.replace(/\./gi, ',');
         }
         return SGHelperType.addThousandSeparator(str);
     }
     /**
      * test value against defined regex pattern
      * @param {string} stringType : choose from SGHelperType.stringType
      * @param {*} val 
      */
     static _testRegex(stringType, val) {
         if (!SGHelperType.isDefined(val)) return false;
         if (stringType === SGHelperType.stringType.date || stringType === SGHelperType.stringType.datetime || stringType === SGHelperType.stringType.time) {
             var regex1 = SGHelperType.regexType[stringType];
             var regex2 = SGHelperType.regexType.utc;
             return regex1.test(String(val)) || regex2.test(String(val));
         } else {
             var regex = SGHelperType.regexType[stringType];
             if (SGHelperType.isDefined(regex)) {
                 return regex.test(String(val));
             } else {
                 return true;
             }
         }
     }
     /**
      * create new date time object based on UTC (GMT 0) time
      * @param {number} year 
      * @param {number} month 
      * @param {number} date 
      * @param {number} hour 
      * @param {number} min 
      * @param {number} sec 
      * @param {number} ms 
      */
     static newUTCDate(year, month, date, hour = 0, min = 0, sec = 0, ms = 0) {
         var dt = new Date();
         dt.setUTCFullYear(year);
         dt.setUTCMonth(month - 1);
         dt.setUTCDate(date);
         dt.setUTCHours(hour);
         dt.setUTCMinutes(min);
         dt.setUTCSeconds(sec);
         dt.setUTCMilliseconds(ms);
         return dt;
     }
     /**
      * convert date time to date with time part set as 0
      * @param {Date} dt : Date object
      */
     static datetimeToDate(dt) {
         return SGHelperType.newLocaleDate(dt.getFullYear(), dt.getMonth() + 1, dt.getDate(), 0, 0, 0, 0);
     }
     /**
      * create new date time object based on local time zone
      * @param {number} year 
      * @param {number} month 
      * @param {number} date 
      * @param {number} hour 
      * @param {number} min 
      * @param {number} sec 
      * @param {number} ms 
      */
     static newLocaleDate(year, month, date, hour = 0, min = 0, sec = 0, ms = 0) {
         var dt = new Date();
         dt.setFullYear(year);
         dt.setMonth(month - 1);
         dt.setDate(date);
         dt.setHours(hour);
         dt.setMinutes(min);
         dt.setSeconds(sec);
         dt.setMilliseconds(ms);
         return dt;
     }
 
     /**
      * generate a random GUID as unique identifier
      */
     static getGUID() {
         return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
             var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
             return v.toString(16);
         });
     }
     
     static isGuid(value) {    
        var regex = /[a-f0-9]{8}(?:-[a-f0-9]{4}){3}-[a-f0-9]{12}/i;
        var match = regex.exec(value);
        return match != null;
    }
 
     static right(str, count) {
         var n = str.length;
         if (n <= count) {
             return str;
         } else {
             return str.substring(n - count, n);
         }
     }
     static left(str, count) {
         return str.substring(0, count);
     }
     static mid(str, start, count) {
         return str.substring(start - 1, start - 1 + count);
     }
 
     static stringify(val) {
         if (Array.isArray(val)) {
             return val.toString();
         } else if (typeof (val) === 'object') {
             return JSON.stringify(val);
         } else {
             return String(val);
         }
     }
     static copyJSON(src) {
         return JSON.parse(JSON.stringify(src));
     }
 
     static copyArrayJSON(src) {
         var tempData = [];
         for (var i = 0; i < src.length; i++) {
             var acceptJSON = JSON.parse(JSON.stringify(src[i]))
             tempData.push(acceptJSON);
         }
         return tempData;
     }
 
    //  static copyRealmObject(src, realmClassName) {
    //      var object = {};
    //      var properties = Object.getOwnPropertyNames(realmClassName.schema.properties)
    //      for (var property of properties) {
    //          object[property] = src[property];
    //      }
    //      return object;
    //  }
 
     static zeroPad(str, len) {
         return SGHelperType.right('000000000000' + str, len);
     }
 
     static Months = {
         EN: [
             { key: 1, title: 'Jan' }, { key: 2, title: 'Feb' }, { key: 3, title: 'Mar' },
             { key: 4, title: 'Apr' }, { key: 5, title: 'May' }, { key: 6, title: 'Jun' },
             { key: 7, title: 'Jul' }, { key: 8, title: 'Aug' }, { key: 9, title: 'Sep' },
             { key: 10, title: 'Oct' }, { key: 11, title: 'Nov' }, { key: 12, title: 'Dec' }],
         ID: [
             { key: 1, title: 'Jan' }, { key: 2, title: 'Peb' }, { key: 3, title: 'Mar' },
             { key: 4, title: 'Apr' }, { key: 5, title: 'Mei' }, { key: 6, title: 'Jun' },
             { key: 7, title: 'Jul' }, { key: 8, title: 'Agu' }, { key: 9, title: 'Sep' },
             { key: 10, title: 'Okt' }, { key: 11, title: 'Nop' }, { key: 12, title: 'Des' }],
         CN: [
             { key: 1, title: '01' }, { key: 2, title: '02' }, { key: 3, title: '03' },
             { key: 4, title: '04' }, { key: 5, title: '05' }, { key: 6, title: '06' },
             { key: 7, title: '07' }, { key: 8, title: '08' }, { key: 9, title: '09' },
             { key: 10, title: '10' }, { key: 11, title: '11' }, { key: 12, title: '12' }],
     }
 
     static startDay(dt) {
         var d = dt ? SGHelperType.dateValue(dt) : new Date();
         return new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0, 0);
     }
 
     static endDay(dt) {
         var d = dt ? SGHelperType.dateValue(dt) : new Date();
         return new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999);
     }
 
     static dateValue(dateVar) {
         return SGHelperType.isDefined(dateVar) ? (dateVar instanceof Date ? dateVar : SGHelperType.convertNewDate(dateVar)) : null;
     }
 
     static numerizeDate(dt) {
         var myDt = dt;
         if (!(myDt instanceof Date)) {
             myDt = new Date(dt);
         }
         var zPad = SGHelperType.zeroPad
         var str = zPad(myDt.getFullYear(), 4) + zPad(myDt.getMonth() + 1, 2) + zPad(myDt.getDate(), 2) + zPad(myDt.getHours(), 2) + zPad(myDt.getMinutes(), 2) + zPad(myDt.getSeconds(), 2) + zPad(myDt.getMilliseconds(), 3);
         return Number(str);
     }
 
     static formatDateTime(dateVar, language) {
         var dt;
         if (dateVar instanceof Date) {
             dt = dateVar
             // console.log('dt')
             // console.log(dt)
 
             // console.log(dt.getHours())
             // console.log(dt.getUTCHours())
             dt.set
         } else {
 
             dt = new Date(dateVar);
         }
         var _year = dt.getFullYear();
         var _month = dt.getMonth() + 1;
         var _date = dt.getDate();
         var _hour = dt.getHours();
         var _minute = dt.getMinutes();
         switch (language) {
             case 'ID':
                 // console.log(dt.getHours())
 
                 // console.log(dateVar)
                 // console.log(_hour)
                 // console.log(_minute)
                 return SGHelperType.zeroPad(_date, 2) + '-' + SGHelperType.Months[language][_month - 1].title + '-' + _year + ' ' + SGHelperType.zeroPad(_hour, 2) + ':' + SGHelperType.zeroPad(_minute, 2)
                 break;
             case 'CN':
                 return _year + '-' + SGHelperType.Months[language][_month - 1].title + '-' + SGHelperType.zeroPad(_date, 2) + ' ' + SGHelperType.zeroPad(_hour, 2) + ':' + SGHelperType.zeroPad(_minute, 2)
                 break;
             case 'EN':
                 return SGHelperType.zeroPad(_date, 2) + '-' + SGHelperType.Months[language][_month - 1].title + '-' + _year + ' ' + SGHelperType.zeroPad(_hour, 2) + ':' + SGHelperType.zeroPad(_minute, 2)
                 break;
             default:
                 return SGHelperType.zeroPad(_date, 2) + '-' + SGHelperType.Months['EN'][_month - 1].title + '-' + _year + ' ' + SGHelperType.zeroPad(_hour, 2) + ':' + SGHelperType.zeroPad(_minute, 2)
                 break;
         }
     }
 
     static convertNewDate(date) {
        if (date instanceof Date) {
            return date;
        }
        else if (date === '' || !SGHelperType.isDefined(date)) {
            return date;
        }
        else {
            if (Platform.OS === 'ios') {
                if(SGHelperType.right(date,1)==='Z'){
                    return new Date(date);
                } else {
                    var dateStr =  SGHelperType.left(date, 23);
                    if(dateStr.length === 19){ dateStr = dateStr+'.000';}
                    var newDateConvert;
                    try{
                        newDateConvert = new Date(dateStr);
                    } catch(e){
                        newDateConvert = new Date(dateStr+'Z');
                    }
                    if (dateStr + 'Z' !== newDateConvert.toISOString() ) {
                        newDateConvert = new Date(dateStr + 'Z');
                        if (dateStr + 'Z' !== newDateConvert.toISOString() ) {
                            newDateConvert = new Date(dateStr);
                            newDateConvert.setHours(newDateConvert.getHours() - newDateConvert.getTimezoneOffset() / 60)
                            if (dateStr + 'Z' !== newDateConvert.toISOString() ) {
                                newDateConvert = new Date(dateStr);
                                newDateConvert.setHours(newDateConvert.getUTCHours() - newDateConvert.getTimezoneOffset() / 60)
                                if (dateStr + 'Z' !== newDateConvert.toISOString() ) {
                                    newDateConvert = new Date(dateStr + 'Z');
                                    newDateConvert.setHours(newDateConvert.getHours() - newDateConvert.getTimezoneOffset() / 60)
                                    if (dateStr + 'Z' !== newDateConvert.toISOString() ) {
                                        newDateConvert = new Date(dateStr + 'Z');
                                        newDateConvert.setHours(newDateConvert.getUTCHours() - newDateConvert.getTimezoneOffset() / 60)
                                    }
                                }
                            }
                        }
                    }
                    return newDateConvert;
                }
            } else {
                var newDateConvert = new Date(date + (SGHelperType.right(date, 1) === 'Z' ? '' : 'Z'));
                return newDateConvert;
            }
        }
    }

 
 
     static formatDate(dateVar, language) {
         var dt;
         if (dateVar instanceof Date) {
             dt = dateVar
         } else {
             dt = new Date(dateVar);
         }
         var _year = dt.getFullYear();
         var _month = dt.getMonth() + 1;
         var _date = dt.getDate();
         switch (language) {
             case 'ID':
                 return SGHelperType.zeroPad(_date, 2) + '-' + SGHelperType.Months[language][_month - 1].title + '-' + _year
                 break;
             case 'CN':
                 return _year + '-' + SGHelperType.Months[language][_month - 1].title + '-' + SGHelperType.zeroPad(_date, 2)
                 break;
             case 'EN':
                 return SGHelperType.zeroPad(_date, 2) + '-' + SGHelperType.Months[language][_month - 1].title + '-' + _year
                 break;
             default:
                 return SGHelperType.zeroPad(_date, 2) + '-' + SGHelperType.Months['EN'][_month - 1].title + '-' + _year
                 break;
         }
 
     }

     static formatDateMonthNum(dateVar, language) {
        var dt;
        if (dateVar instanceof Date) {
            dt = dateVar
        } else {
            dt = new Date(dateVar);
        }
        var _year = dt.getFullYear();
        var _month = dt.getMonth() + 1;
        var _date = dt.getDate();
        switch (language) {
            case 'ID':
                return SGHelperType.zeroPad(_date, 2) + '-' + SGHelperType.Months['CN'][_month - 1].title + '-' + SGHelperType.zeroPad(_year, 2)
                break;
            case 'CN':
                return _year + '-' + SGHelperType.Months['CN'][_month - 1].title + '-' + SGHelperType.zeroPad(_date, 2)
                break;
            case 'EN':
                return SGHelperType.zeroPad(_date, 2) + '-' + SGHelperType.Months['CN'][_month - 1].title + '-' + SGHelperType.zeroPad(_year, 2)
                break;
            default:
                return SGHelperType.zeroPad(_date, 2) + '-' + SGHelperType.Months['CN'][_month - 1].title + '-' + SGHelperType.zeroPad(_year, 2)
                break;
        }

    }
    
     static formatTime(dateVar, language) {
         var dt;
         if (dateVar instanceof Date) {
             dt = dateVar
         } else {
             dt = new Date(dateVar);
         }
         var _hour = dt.getHours();
         var _minute = dt.getMinutes();
         return SGHelperType.zeroPad(_hour, 2) + ':' + SGHelperType.zeroPad(_minute, 2)
     }
 
     static random(num) {
         return Math.floor(Math.random() * num);
     }
     static getRandomElement(arr, n) {
         var _res = [];
         var _resVal = [];
         for (var i = 0; i < n; i++) {
             var flag = false;
             while (!flag) {
                 var x = SGHelperType.random(arr.length);
                 if (!_res.includes(x)) {
                     _res.push(x);
                     _resVal.push(arr[x]);
                     flag = true;
                 }
             }
         }
         return _resVal;
     }
 
 
     static convertUTCDateToLocalDate(date) {
         var newDate = new Date(date.getTime() - date.getTimezoneOffset() * 60 * 1000);
         // console.log(newDate);
         return newDate;
     }
     static encrypt(str) {
         str = CryptoJS.enc.Utf8.parse(str);
         key = CryptoJS.enc.Utf8.parse(keyEncrypt);
         var mac = CryptoJS.HmacSHA256(str, key);
         return (mac.toString(CryptoJS.enc.Base64));
     }
     static getLookUpByGroup(lookUp, fGroup) {
         var arr = []
         for (var i = 0; i < lookUp.length; i++) {
             if (lookUp[i].fGroup === fGroup) {
                 arr.push(lookUp[i]);
             }
         }
         return arr
     }
     static getValueKeyLookUp(lookUp, fLookUpKey) {
 
         for (var i = 0; i < lookUp.length; i++) {
             if (lookUp[i].fLookUpKey === fLookUpKey) {
                 return lookUp[i].fValueKey;
             }
         }
 
     }
     static getSysParamsValueToInt(param) {
         var sysParams = SGHelperGlobalVar.getVar('SysParam')
         return SGHelperType.isDefined(SGHelperGlobalVar)? parseInt(sysParams[param]):1000000 
     }
 
     static getSystemParamsValue(param) {
         var sysParams = SGHelperGlobalVar.getVar('SysParam')
         return SGHelperType.isDefined(SGHelperGlobalVar)? sysParams[param]: '' 
     }
     static getPaging(paging=""){
        return paging!==""? paging : 10
    }
    static getThreshold(){
        return Platform.OS === 'ios' ? 0 : 0.1
    }

    static sortByProperty(property, reverse) {
        if (reverse) {
            return function (a, b) {
                if (a[property] > b[property])
                    return -1;
                else if (a[property] < b[property])
                    return 1;
                return 0;
            }
        }
        else {
            return function (a, b) {
                if (a[property] > b[property])
                    return 1;
                else if (a[property] < b[property])
                    return -1;
                return 0;
            }
        }
    }

    static _sortArrJSON(array, element, reverse) {
        array.sort(this.sortByProperty(element, reverse));
        return array;
    }

    static _constructOptionList(array, keyFieldName, translateGroup, translateKey){
        var res = []
        for (var i = 0; i < array.length; i++) {
                res.push({ key: array[i][keyFieldName], title: SGLocalize.translate(translateGroup+'.'+array[i][translateKey]) })
            }
            return(res);
        }
       
    static checkPhoneNumberCountryCode(phoneNumberCountryCode, phoneNumber){
        phoneNumber = phoneNumber.replace('-','');
        if(phoneNumberCountryCode !== ''){
            if(phoneNumber.includes(phoneNumberCountryCode)){
                var position = phoneNumber.indexOf(phoneNumberCountryCode) + phoneNumberCountryCode.length;
                var output = [phoneNumber.slice(0, position), '-', phoneNumber.slice(position)].join('');
            }
            else{
                if(phoneNumber[0] === '0'){
                    var output = phoneNumberCountryCode + '-' + phoneNumber.substring(1);
                }
                else{
                    var output = phoneNumberCountryCode + '-' + phoneNumber;
                }
            }
            return output; 
        }
    }

    static _getPhoneNumber(phoneNumber){
        var phoneNumberCountryCode = phoneNumber.substr(phoneNumber.indexOf('-')+1);
        return phoneNumberCountryCode;
    }

    static _getPhoneNumberCountryCode(phoneNumber){
        var phoneNumberCountryCode = phoneNumber.substr(0, phoneNumber.indexOf('-'));
        return phoneNumberCountryCode;
    }

    static sortArrJSONWithArrOrder(arr, propertyName, order) {
        var newArr = [];
        for (var i = 0; i < order.length; i++) {
            for (var j = 0; j < arr.length; j++) {
                if (arr[j][propertyName] === order[i]) {
                    newArr.push(arr[j]);
                }
            }
        }
        return newArr;
    }

    static ArraymaxLength(type = 1){
        if(type == 1) return 8
        if(type == 2) return 32
        if(type == 3) return 256
        if (type == 4) return 512
        if(type == 5) return 1024
        if (type == 6) return 4096
        if(type == 7) return 75
        return 8
        }
    static _revertUTCDate(GMTValue,dateFrom){
        var minute = (GMTValue%1)*60
        var dateTemp = new Date(dateFrom)
        var hour = Math.trunc(GMTValue) 
        var date = new Date(dateTemp.getFullYear(),dateTemp.getMonth(),dateTemp.getDate(),dateTemp.getHours()+hour,dateTemp.getMinutes()+minute,dateTemp.getSeconds(),dateTemp.getMilliseconds())
        return date
    }
    static _constructUTCDate(GMTValue,dateFrom){
        var minute = (GMTValue%1)*60
        var dateTemp = SGHelperType.convertNewDate(dateFrom)
        var hour = Math.trunc((new Date().getTimezoneOffset() + (GMTValue*60))/60) 
        var date = new Date(dateTemp.getFullYear(),dateTemp.getMonth(),dateTemp.getDate(),dateTemp.getHours()-(hour),dateTemp.getMinutes()+minute,dateTemp.getSeconds(),dateTemp.getMilliseconds())
        return date
    }
    static getCircuitBreakerStatus(param){
        var sysParams = SGHelperGlobalVar.getVar('SysParam')[param]
        var circuitBreaker = JSON.parse(sysParams)  
        return circuitBreaker
    }
 }