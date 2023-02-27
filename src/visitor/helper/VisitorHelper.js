/**
* MAG Visitor Helper for helping with type check, conversion, and formatting
*/
import { SGLocalize } from "../locales/SGLocalize";
import { SGHelperType, SGHelperGlobalVar } from '../../core/helper';
import {tbLookupDAO} from '../db/tbLookupDAO';

export class VisitorHelper {

    static _decideDayText(value) {
        if (value === 'null') {
            return ('');
        }
        else {
            if (value == 0) {
                return (SGLocalize.translate("lastVisitedTag.today"));
            }
            else if (value == 1) {
                return (SGLocalize.translate("lastVisitedTag.day"))
            }
            else if (parseInt(value) < 7) {
                return (value + ' ' + SGLocalize.translate("lastVisitedTag.days"))
            }
            else if (value == 7) {
                return ('1' + ' ' + SGLocalize.translate("lastVisitedTag.week"))
            }
            else if (parseInt(value) > 7) {
                return (SGLocalize.translate("lastVisitedTag.overWeek"))
            }
        }

    }

    static _showPriceText(value, contentOwnerCurrency) {
        // console.log(value);
        var currentUserCurrency = SGHelperGlobalVar.getVar('GlobalCurrency');
        var res = '';
        if (value >= 1000) {
            res = SGHelperType.addThousandSeparator(value.toFixed(0).toString())
        }
        if (value < 1000) {
            res = (value.toFixed(2)).toString();
        }
        if (SGHelperType.isDefined(contentOwnerCurrency)) {
            if (currentUserCurrency !== contentOwnerCurrency) {
                res = '~ ' + res;
            }
        }
        return res;
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

    /**
* How to Use _naturalSort
1. give array of json parameter to myArray
2. give string of 'asc' for ascending or 'desc' for descending to parameter type
3. give string of 'field name' to parameter fieldName
*/

    static _naturalSort(myArray, type, fieldName ){
        const collator = new Intl.Collator('en', { numeric: true, sensitivity: 'base' })
        const sorted = myArray.sort((a, b) => collator.compare(b[fieldName], a[fieldName]))
        if(type==='asc'){
            var res = sorted;
        }
        if(type === 'desc'){
            var res = sorted.reverse();
        }
        return(res)
    }

    static _getPhoneNumber(phoneNumber){
        var phoneNumberCountryCode = phoneNumber.substr(phoneNumber.indexOf('-')+1);
        return phoneNumberCountryCode;
    }

    static _getPhoneNumberCountryCode(phoneNumber){
        var phoneNumberCountryCode = phoneNumber.substr(0, phoneNumber.indexOf('-'));
        return phoneNumberCountryCode;
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

    static availabilityLocalize(language){
        if(language == 'id' || language == 'ID'){
            return 'Semua Tipe'
        }else if (language == 'en' || language == 'EN'){
            return 'All Type'
        }else if (language == 'cn' || language == 'CN'){
            return '所有类型'
        }
    }

    static getLocalizeDataFromLookUp(filter,key,lang){
        var language = lang;
        if(language !== 'ID' && language !=='id' &&  language !=='en' && language !== 'EN' && language !== 'cn' && language !== 'CN'){
            language = 'en'
        }
        var pullData = tbLookupDAO.getSpecificLookupByGroup(filter);
        if(pullData.length !== 0){
            for (var i = 0; i < pullData.length; i++) {
                if(pullData[i].fLookUpKey == key){
                    return pullData[i].fLanguage[language.toLowerCase()]
                }
            }
        }
        return 'Undefined'
    }
}